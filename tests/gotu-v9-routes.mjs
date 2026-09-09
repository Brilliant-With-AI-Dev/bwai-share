import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const demoRoot = join(root, 'gotu', 'mirror-demo-v9');

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
assert.equal(files.length, 18, 'expected all 18 v9 route entry points');

const documents = await Promise.all(files.map(file => readFile(file, 'utf8')));
assert.equal(new Set(documents).size, 1, 'route entry points must remain identical');
const html = documents[0];
const css = await readFile(join(demoRoot, 'styles.css'), 'utf8');
const model = await readFile(join(demoRoot, 'model.js'), 'utf8');
const app = await readFile(join(demoRoot, 'app.js'), 'utf8');

for (const asset of ['styles.css', 'model.js', 'app.js']) {
  assert.match(html, new RegExp(`/gotu/mirror-demo-v9/${asset}`), `missing ${asset} reference`);
}
assert.doesNotMatch(html, /<(style|script)(?![^>]+src=)[^>]*>\s*\S/i, 'HTML must not contain inline bundles');
assert.doesNotMatch(css, /data:font/i, 'fonts must remain external assets');
assert.doesNotMatch(app, /data:image/i, 'images must remain external assets');
assert.match(app, /const BASE='\/gotu\/mirror-demo-v9'/, 'wrong client-side route base');
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

console.log('Validated 18 small route entries sharing cached v9 assets.');
