// Copies only what the game needs into desktop/game, ready to be packed: the page, the manifest and the assets.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'game');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'manifest.json']) if (fs.existsSync(path.join(root, f))) fs.copyFileSync(path.join(root, f), path.join(out, f));
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true, filter: (s) => !s.split(path.sep).includes('detailed') });
// the testing menu belongs to the Pages build only: cut its loader out of the Windows page
const pg = path.join(out, 'index.html');
let h = fs.readFileSync(pg, 'utf8');
h = h.replace(/<script>\/\*TESTMENU\*\/[\s\S]*?\/\*ENDTESTMENU\*\/<\/script>\r?\n?/, '');
if (h.includes('TESTMENU')) throw new Error('testing menu loader still in the Windows page');
fs.writeFileSync(pg, h);
console.log('game copied to', out);
