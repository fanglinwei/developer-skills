import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), 'fixtures/code-review/discovery');

function python(directory, source) {
  return execFileSync('python3', ['-B', '-c', source], {
    cwd: resolve(ROOT, directory), encoding: 'utf8',
  }).trim();
}

test('review diffs match complete fixed source versions', () => {
  for (const name of readdirSync(ROOT)) {
    const root = resolve(ROOT, name);
    // Python stdlib makes the portable fixture diff deterministic without Git writes.
    const expected = python(name, "from pathlib import Path; import difflib; names=sorted({str(p.relative_to(Path(v))) for v in ('before','after') for p in Path(v).rglob('*.py')}); result='';\nfor name in names:\n a=Path('before')/name; b=Path('after')/name; result+=''.join(difflib.unified_diff(a.read_text().splitlines(True) if a.exists() else [],b.read_text().splitlines(True) if b.exists() else [],fromfile='before/'+name,tofile='after/'+name))\nprint(result,end='')");
    assert.equal(readFileSync(resolve(root, 'review.diff'), 'utf8').trim(), expected);
  }
});

test('existing fixture tests pass while independent behavior checks distinguish regressions', () => {
  for (const name of readdirSync(ROOT)) {
    execFileSync('python3', ['-B', '-m', 'unittest', 'discover', '-s', 'tests'], {
      cwd: resolve(ROOT, name, 'after'), stdio: 'pipe',
    });
  }
  assert.equal(python('protected-read/after', "from service import get_order\ntry: get_order({'x': {'tenant':'b','total':10}},'a','x')\nexcept PermissionError: print('blocked')"), 'blocked');
  const checkout = "from worker import run_checkout; print(run_checkout([{'unit_cents':1250,'quantity':2}])['charged_cents'])";
  assert.equal(python('checkout/before', checkout), '2500');
  assert.equal(python('checkout/after', checkout), '250000');
  assert.equal(python('exports/after', "from exporter import export_rows; print(len(export_rows([{'id':1,'amount':20,'status':'paid','archived':True}], include_archived=True)))"), '0');
});
