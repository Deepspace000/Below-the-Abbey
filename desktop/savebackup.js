// A second copy of the player's saves, in a plain file outside the app's own storage (Documents\Below the Abbey\Saves).
// The game keeps its saves in the browser storage of the app (AppData). If that storage is ever empty after an update,
// the game asks for this copy and puts the saves back (see the first script in index.html).
// saves.json is the latest copy, saves.prev.json the one before it, saves.start.json the copy as it was when the app started.
const fs = require('fs');
const path = require('path');
const PFX = 'abbeySave_';
let startCopied = false;

const clean = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
  const out = {};
  for (const k of Object.keys(obj)) if (k.startsWith(PFX) && k !== PFX + 'broken' && typeof obj[k] === 'string') out[k] = obj[k];
  return out;
};
const readFile = (f) => { try { const o = clean(JSON.parse(fs.readFileSync(f, 'utf8'))); return o; } catch (e) { return null; } };

function read(dir) {
  const a = readFile(path.join(dir, 'saves.json'));
  if (a && Object.keys(a).length) return a;
  return null; // an empty latest copy means the player erased everything on purpose: nothing to put back
}
function write(dir, obj) {
  const o = clean(obj);
  if (!o) return false;
  try {
    fs.mkdirSync(dir, { recursive: true });
    const cur = path.join(dir, 'saves.json'), prev = path.join(dir, 'saves.prev.json'), start = path.join(dir, 'saves.start.json'), tmp = path.join(dir, 'saves.tmp');
    const text = JSON.stringify(o);
    let old = null; try { old = fs.readFileSync(cur, 'utf8'); } catch (e) { /* none yet */ }
    if (old === text) return true;
    if (old && !startCopied) { fs.writeFileSync(start, old); startCopied = true; } else startCopied = true;
    if (old) fs.writeFileSync(prev, old);
    fs.writeFileSync(tmp, text);
    fs.renameSync(tmp, cur);
    return true;
  } catch (e) { return false; }
}
module.exports = { read, write, clean };
