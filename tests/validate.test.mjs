import assert from 'node:assert/strict';
import { appendFileSync, cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validate } from '../scripts/validate.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function copyPackage(t) {
  const temporary = mkdtempSync(resolve(tmpdir(), 'developer-skills-test-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const root = resolve(temporary, 'package');
  cpSync(ROOT, root, { recursive: true, filter: source => !source.split(/[\\/]/).includes('.git') });
  return root;
}

test('valid package', t => {
  assert.equal(validate(copyPackage(t)).skills, 8);
});

test('missing reference', t => {
  const root = copyPackage(t);
  unlinkSync(resolve(root, 'skills/frontend-page-clone/references/element-ui-checklist.md'));
  assert.throws(() => validate(root), { code: 'ENOENT' });
});

test('missing code review collaboration reference', t => {
  const root = copyPackage(t);
  unlinkSync(resolve(root, 'skills/code-review/references/agent-collaboration.md'));
  assert.throws(() => validate(root), { code: 'ENOENT' });
});

test('changed skill content', t => {
  const root = copyPackage(t);
  appendFileSync(resolve(root, 'skills/code-simplifier/SKILL.md'), '\nUnexpected behavior change.\n');
  assert.throws(() => validate(root), /Checksum mismatch/);
});

test('marketplace source outside package', t => {
  const root = copyPackage(t);
  const path = resolve(root, '.agents/plugins/marketplace.json');
  const value = JSON.parse(readFileSync(path, 'utf8'));
  value.plugins[0].source.path = '../elsewhere';
  writeFileSync(path, JSON.stringify(value));
  assert.throws(() => validate(root), /Wrong marketplace source/);
});

test('version mismatch', t => {
  const root = copyPackage(t);
  const path = resolve(root, 'plugin.json');
  const value = JSON.parse(readFileSync(path, 'utf8'));
  value.version = '0.2.0';
  writeFileSync(path, JSON.stringify(value));
  assert.throws(() => validate(root), /Manifest mismatch: version/);
});

test('broken document link', t => {
  const root = copyPackage(t);
  appendFileSync(resolve(root, 'README.md'), '\n[Missing](missing.md)\n');
  assert.throws(() => validate(root), /Broken or escaping link/);
});

test('symlink', t => {
  const root = copyPackage(t);
  symlinkSync(resolve(root, 'README.md'), resolve(root, 'linked-readme'));
  assert.throws(() => validate(root), /Symlink in package/);
});
