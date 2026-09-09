import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
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
assert.equal(files.length, 18, 'expected all 18 v9 route artifacts');

const documents = await Promise.all(files.map(file => readFile(file, 'utf8')));
assert.equal(new Set(documents).size, 1, 'v9 route artifacts must remain identical');

for (let index = 0; index < documents.length; index += 1) {
  const match = documents[index].match(/const BASE='([^']+)'/);
  assert.ok(match, `missing BASE in ${relative(root, files[index])}`);
  assert.equal(match[1], '/gotu/mirror-demo-v9', `wrong BASE in ${relative(root, files[index])}`);
}

console.log(`Validated ${files.length} identical v9 routes at /gotu/mirror-demo-v9.`);
