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
// the list of files and their hashes, for the updater (tools/make_win_manifest.py, run by tools/stamp.py): it must belong to this page
const mf = path.join(root, 'win-manifest.json');
if (!fs.existsSync(mf)) throw new Error('win-manifest.json is missing: run python tools/stamp.py');
const ver = (fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/const VERSION='([^']+)'/) || [])[1];
if (JSON.parse(fs.readFileSync(mf, 'utf8')).v !== ver) throw new Error('win-manifest.json is not for version ' + ver + ': run python tools/stamp.py');
fs.copyFileSync(mf, path.join(out, 'win-manifest.json'));
console.log('game copied to', out);
