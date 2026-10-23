import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILLS = new Set([
  'code-review', 'code-simplifier', 'codegraph-project-scan',
  'frontend-ai-dev-docs', 'frontend-page-clone', 'frontend-safe-development',
  'frontend-style-clone', 'swift-code-style',
]);

function isWithin(root, path) {
  const part = relative(root, path);
  return !isAbsolute(part) && part !== '..' && !part.startsWith(`..${sep}`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function listFiles(root, directory = root) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const path = resolve(directory, entry.name);
    assert(!entry.isSymbolicLink(), `Symlink in package: ${relative(root, path)}`);
    assert(entry.name !== '.DS_Store', 'Finder metadata in package');
    if (entry.isDirectory()) files.push(...listFiles(root, path));
    else files.push(path);
  }
  return files;
}

export function validate(directory) {
  const root = realpathSync(directory);
  const files = listFiles(root);
  for (const path of files) {
    if (extname(path) === '.json') readJson(path);
  }

  const manifest = readJson(resolve(root, 'plugin.json'));
  const overlay = readJson(resolve(root, '.codex-plugin/plugin.json'));
  assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', 'Wrong schema declaration');
  assert.equal(manifest.name, 'developer-skills', 'Wrong plugin name');
  assert(/^\d+\.\d+\.\d+$/.test(manifest.version), 'Invalid version');
  for (const key of ['name', 'version', 'description']) {
    assert(manifest[key] && overlay[key] === manifest[key], `Manifest mismatch: ${key}`);
  }
  assert.equal(overlay.skills, './skills/', 'Wrong skill directory');
  assert.equal(overlay.interface?.displayName, 'Developer Skills', 'Wrong display name');
  assert(!['hooks', 'mcpServers', 'apps'].some(key => key in overlay), 'Unexpected runtime integration');

  const marketplace = readJson(resolve(root, '.agents/plugins/marketplace.json'));
  assert.equal(marketplace.name, 'developer-skills', 'Wrong marketplace name');
  assert.equal(marketplace.plugins?.length, 1, 'Expected one marketplace entry');
  const entry = marketplace.plugins[0];
  assert.equal(entry.name, manifest.name, 'Wrong marketplace plugin');
  assert.deepEqual(entry.source, { source: 'local', path: './' }, 'Wrong marketplace source');
  assert.deepEqual(entry.policy, { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, 'Wrong install policy');
  assert.equal(entry.category, 'Productivity', 'Missing marketplace category');

  assert.deepEqual(new Set(readdirSync(resolve(root, 'skills'))), SKILLS, 'Wrong skill set');
  for (const name of SKILLS) {
    const text = readFileSync(resolve(root, 'skills', name, 'SKILL.md'), 'utf8');
    assert(text.startsWith('---\n') && text.slice(4).includes('\n---\n'), `Missing front matter: ${name}`);
    const front = text.split('---', 3)[1];
    assert(front.split('\n').includes(`name: ${name}`), `Wrong skill name: ${name}`);
    assert(/^description: \S.+$/m.test(front), `Missing description: ${name}`);
  }
  assert(statSync(resolve(root, 'skills/frontend-safe-development/SKILL.md')).isFile(), 'Missing bundled review dependency');

  const snapshot = readJson(resolve(root, 'source-manifest.json'));
  assert.deepEqual(new Set(snapshot.skills.map(skill => skill.name)), SKILLS, 'Wrong source records');
  const tracked = new Set();
  const changed = [];
  for (const skill of snapshot.skills) {
    for (const record of skill.files) {
      const path = resolve(root, 'skills', skill.name, record.path);
      assert(isWithin(resolve(root, 'skills'), path), `Source path outside skills: ${record.path}`);
      const local = relative(root, path).split(sep).join('/');
      assert(!tracked.has(local), `Duplicate source record: ${local}`);
      tracked.add(local);
      const hash = createHash('sha256').update(readFileSync(path)).digest('hex');
      assert.equal(hash, record.packaged_sha256, `Checksum mismatch: ${local}`);
      if (record.source_sha256 !== record.packaged_sha256) changed.push(local);
    }
  }
  const actual = new Set(files.filter(path => isWithin(resolve(root, 'skills'), path))
    .map(path => relative(root, path).split(sep).join('/')));
  assert.deepEqual(tracked, actual, 'Source inventory does not match packaged files');
  assert.deepEqual(changed, ['skills/code-review/SKILL.md'], 'Unexpected source adaptations');

  for (const path of files) {
    if (!['.md', '.json', '.yaml'].includes(extname(path))) continue;
    const text = readFileSync(path, 'utf8');
    assert(!/\/(?:Users|home)\/[^/\s]+\//.test(text), `Machine-specific path: ${relative(root, path)}`);
    if (extname(path) !== '.md') continue;
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)\n]+)\)/g)) {
      const link = match[1];
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(link) || link.startsWith('#')) continue;
      const target = resolve(dirname(path), link.split('#', 1)[0]);
      assert(isWithin(root, target) && existsSync(target), `Broken or escaping link in ${relative(root, path)}: ${link}`);
    }
  }
  return { skills: SKILLS.size, source_files: tracked.size, adapted_files: changed };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(JSON.stringify({ status: 'PASS', ...validate(resolve(dirname(fileURLToPath(import.meta.url)), '..')) }));
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
