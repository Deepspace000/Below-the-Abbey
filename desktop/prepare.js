// Copies only what the game needs into desktop/game, ready to be packed: the page, the manifest and the assets.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'game');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'manifest.json']) if (fs.existsSync(path.join(root, f))) fs.copyFileSync(path.join(root, f), path.join(out, f));
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true, filter: (s) => !s.split(path.sep).includes('detailed') });
console.log('game copied to', out);
