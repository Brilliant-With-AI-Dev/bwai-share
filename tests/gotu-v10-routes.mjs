import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demoRoot = join(root, 'gotu', 'mirror-demo-v10');

async function findRouteFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findRouteFiles(path);
    return entry.name === 'index.html' ? [path] : [];
  }));
  return nested.flat().sort();
}

const files = await findRouteFiles(demoRoot);
assert.equal(files.length, 18, 'expected all 18 v10 route entry points');

const documents = await Promise.all(files.map(file => readFile(file, 'utf8')));
assert.equal(new Set(documents).size, 1, 'route entry points must remain identical');
const html = documents[0];
const css = await readFile(join(demoRoot, 'styles.css'), 'utf8');
const model = await readFile(join(demoRoot, 'model.js'), 'utf8');
const app = await readFile(join(demoRoot, 'app.js'), 'utf8');

for (const asset of ['styles.css', 'model.js', 'app.js']) {
  assert.match(html, new RegExp(`/gotu/mirror-demo-v10/${asset}`), `missing ${asset} reference`);
}
assert.doesNotMatch(html, /<(style|script)(?![^>]+src=)[^>]*>\s*\S/i, 'HTML must not contain inline bundles');
assert.doesNotMatch(css, /data:font/i, 'fonts must remain external assets');
assert.doesNotMatch(app, /data:image/i, 'images must remain external assets');
assert.match(app, /const BASE=['"]\/gotu\/mirror-demo-v10['"]/, 'wrong client-side route base');
assert.ok(model.includes('const Model='), 'model bundle is missing');

const assets = (await readdir(join(demoRoot, 'assets'))).sort();
assert.equal(assets.length, 10, 'expected six fonts and four images');
for (const asset of assets) {
  const bytes = await readFile(join(demoRoot, 'assets', asset));
  if (asset.endsWith('.png')) assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  if (asset.endsWith('.ttf')) assert.equal(bytes.subarray(0, 4).toString('hex'), '00010000');
}

for (const file of files) {
  assert.ok((await stat(file)).size < 5_000, 'HTML entry point regressed above 5 KB');
}
assert.ok((await stat(join(demoRoot, 'styles.css'))).size < 100_000, 'CSS bundle regressed above 100 KB');
assert.ok((await stat(join(demoRoot, 'app.js'))).size < 100_000, 'app bundle regressed above 100 KB');

console.log('Validated 18 small route entries sharing cached v10 assets.');

const index = await readFile(join(root, 'gotu', 'index.html'), 'utf8');
assert.match(index, /Candidate — not approved · v10/);
assert.match(index, /No version is currently approved/);
assert.match(index, /href="\/gotu\/mirror-demo-v10\/about-demo\/"/);
const archive = index.split('<details class="previous-versions">')[1];
assert.ok(archive && !index.includes('<details class="previous-versions" open'));
for (let v = 1; v <= 9; v++) assert.ok(archive.includes(`/gotu/mirror-demo-v${v}/`), `missing preserved v${v}`);
const manifest = JSON.parse(await readFile(join(root, 'gotu', 'candidates.json'), 'utf8'));
assert.equal(manifest.latest, 10);
assert.equal(manifest.approved, null);
assert.equal(manifest.candidates.length, 10);
console.log('Verified candidate status, current index link, and all preserved versions.');
