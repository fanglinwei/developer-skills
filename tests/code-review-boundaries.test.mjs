import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), 'fixtures/code-review/boundaries');

function python(path, source) {
  return execFileSync('python3', ['-B', '-c', source], { cwd: resolve(ROOT, path), encoding: 'utf8' }).trim();
}

test('boundary diffs contain every delivered Python source', () => {
  for (const name of ['classification', 'acceptance']) {
    const diff = python(name, "from pathlib import Path; import difflib; result=''; names=sorted({str(p.relative_to(Path(v))) for v in ('before','after') for p in Path(v).rglob('*.py')})\nfor n in names:\n a=Path('before')/n; b=Path('after')/n; result+=''.join(difflib.unified_diff(a.read_text().splitlines(True) if a.exists() else [], b.read_text().splitlines(True) if b.exists() else [],fromfile='before/'+n,tofile='after/'+n))\nprint(result,end='')");
    assert.equal(readFileSync(resolve(ROOT, name, 'review.diff'), 'utf8').trim(), diff);
  }
});

test('integrity implementation rejects corruption but positive-only check misses always-true mutant', () => {
  assert.equal(python('classification/after', "import hashlib; from integrity import verify_snapshot\ndata=b'release snapshot'; digest=hashlib.sha256(data).hexdigest(); assert verify_snapshot(data,digest); assert not verify_snapshot(data+b'!',digest); print('verified')"), 'verified');
  assert.equal(python('classification/after', "import runpy,integrity\nintegrity.verify_snapshot=lambda data,digest:True\nrunpy.run_path('check_existing.py')"), 'valid snapshot check passed');
});

test('optional CSV export has real regression even while header-only check passes', () => {
  assert.equal(python('acceptance/after', "import runpy; runpy.run_path('check_existing.py')"), 'CSV header check passed');
  const call = "from exporter import export_amount; print(export_amount(199))";
  assert.equal(python('acceptance/before', call), '1.99');
  assert.equal(python('acceptance/after', call), '1');
});
