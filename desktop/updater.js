// Content updates for the Windows app, so that a player who did not get the game through the itch.io app (and so gets no
// automatic patches) still gets the new version without downloading the whole game again.
//
// How it works. The game is only web files (index.html and assets/). GitHub Pages serves the newest copy of them, and
// tools/make_win_manifest.py lists every file there with its sha256 in win-manifest.json. At start-up the app reads that
// list, compares it with the files it has, downloads only the ones that changed (checking every hash), and keeps them in
// the user's data folder. The next time the game starts it serves those files instead of the ones it was installed with.
// Nothing is ever half applied, and a game that is running never has its files changed under it: the new files are
// collected in a temporary folder, put together with the earlier downloads in a new folder, and only then does state.json
// (which says what the folder holds) change. If anything goes wrong the old files stay in use.
//
// An installed app that is as new as the downloaded files (the player installed a newer build) drops the download.
const { app, net } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE = (process.env.BTA_UPDATE_BASE || 'https://deepspace000.github.io/Below-the-Abbey/').replace(/\/?$/, '/');
const MAX_BYTES = 500 * 1024 * 1024; // a bigger update than this is left to a normal download
const PARALLEL = 6;

let bundledDir = '', dir = '', filesDir = '', stateFile = '', bundled = null, state = null, over = new Set();

const cmp = (a, b) => { // versions such as 3.605 and 3.1002
  const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d < 0 ? -1 : 1; }
  return 0;
};
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
// the hash in the list is of the file as git commits it: a text file (no NUL byte in it) with CRLF turned into LF (tools/make_win_manifest.py)
const norm = (buf) => buf.subarray(0, 8000).includes(0) || !buf.includes(13) ? buf : Buffer.from(buf.toString('latin1').replace(/\r\n/g, '\n'), 'latin1');
const inDir = (root, rel) => path.join(root, ...rel.split('/'));
const rmrf = (p) => { try { fs.rmSync(p, { recursive: true, force: true }); } catch (e) { /* ignore */ } };

// the page of the web version carries the loader of the Testing menu; the Windows page has it cut out (as in prepare.js)
function forWindows(rel, buf) {
  if (rel !== 'index.html') return buf;
  const h = buf.toString('utf8').replace(/<script>\/\*TESTMENU\*\/[\s\S]*?\/\*ENDTESTMENU\*\/<\/script>\r?\n?/, '');
  if (h.includes('TESTMENU')) throw new Error('testing menu loader still in the page');
  return Buffer.from(h, 'utf8');
}

function init(gameDir) {
  bundledDir = gameDir;
  dir = path.join(app.getPath('userData'), 'update');
  stateFile = path.join(dir, 'state.json');
  bundled = readJson(path.join(gameDir, 'win-manifest.json')); // written into the app by prepare.js
  state = readJson(stateFile);
  if (state && (!bundled || !state.dirName || cmp(state.v, bundled.v) <= 0)) { // the app is as new as the download, or newer
    rmrf(dir); state = null;
  }
  filesDir = state ? path.join(dir, state.dirName) : '';
  over = new Set(state && Array.isArray(state.over) ? state.over : []);
  if (fs.existsSync(dir)) for (const n of fs.readdirSync(dir)) if (n !== 'state.json' && (!state || n !== state.dirName)) rmrf(path.join(dir, n)); // leftovers of older updates
  return current();
}

const current = () => state ? { v: state.v, files: state.files } : bundled ? { v: bundled.v, files: bundled.files } : null;

// the file to serve for a path inside the game
function resolve(rel) {
  if (over.has(rel)) { const f = inDir(filesDir, rel); if (fs.existsSync(f)) return f; }
  return inDir(bundledDir, rel);
}

async function getJson(url) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 15000);
  try { const r = await net.fetch(url, { cache: 'no-store', signal: ctl.signal }); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json(); }
  finally { clearTimeout(t); }
}

// Looks for a newer version and, if there is one, downloads what changed. Resolves to {v, files, bytes} when new files
// are ready for the next start, or null (nothing to do, offline, too big, or a failure: the old files stay in use).
async function check(log) {
  log = log || (() => {});
  const cur = current();
  if (!cur) { log('no manifest in this build'); return null; }
  let remote;
  try { remote = await getJson(BASE + 'win-manifest.json?t=' + Date.now()); } catch (e) { log('no update check: ' + e.message); return null; }
  if (!remote || !remote.files || !remote.v) { log('the update list is not valid'); return null; }
  if (cmp(remote.v, cur.v) <= 0) { log('up to date (' + cur.v + ')'); return null; }
  const want = Object.keys(remote.files).filter((p) => !cur.files[p] || cur.files[p][0] !== remote.files[p][0]);
  const bytes = want.reduce((n, p) => n + remote.files[p][1], 0);
  log('new version ' + remote.v + ' (have ' + cur.v + '): ' + want.length + ' files, ' + (bytes / 1048576).toFixed(1) + ' MB');
  if (bytes > MAX_BYTES) { log('too big for an automatic update'); return null; }
  const tmp = path.join(dir, 'tmp'), nextName = 'f-' + remote.v, next = path.join(dir, nextName);
  try {
    rmrf(tmp); rmrf(next);
    let at = 0, done = 0;
    const worker = async () => {
      for (;;) {
        const i = at++; if (i >= want.length) return;
        const rel = want[i], exp = remote.files[rel];
        const url = BASE + rel.split('/').map(encodeURIComponent).join('/') + '?v=' + encodeURIComponent(remote.v);
        let buf;
        for (let attempt = 0; ; attempt++) {
          try {
            const r = await net.fetch(url, { cache: 'no-store' });
            if (!r.ok) throw new Error('HTTP ' + r.status);
            buf = norm(Buffer.from(await r.arrayBuffer()));
            if (sha(buf) !== exp[0]) throw new Error('the file does not match its hash');
            break;
          } catch (e) { if (attempt >= 2) throw new Error(rel + ': ' + e.message); }
        }
        const dest = inDir(tmp, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, forWindows(rel, buf));
        if (++done % 50 === 0) log(done + ' / ' + want.length + ' files');
      }
    };
    await Promise.all(Array.from({ length: Math.min(PARALLEL, want.length) }, worker));
    // all of it is here and checked. The new folder holds the earlier downloads that are still right, and the new files
    const nextOver = new Set();
    for (const rel of over) {
      const r = remote.files[rel];
      if (!r || want.includes(rel)) continue; // gone from the game, or replaced just now
      if (bundled.files[rel] && bundled.files[rel][0] === r[0]) continue; // the app already holds exactly this file
      const from = inDir(filesDir, rel), to = inDir(next, rel);
      if (!fs.existsSync(from)) continue;
      fs.mkdirSync(path.dirname(to), { recursive: true });
      try { fs.linkSync(from, to); } catch (e) { fs.copyFileSync(from, to); }
      nextOver.add(rel);
    }
    for (const rel of want) {
      const to = inDir(next, rel);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.renameSync(inDir(tmp, rel), to); nextOver.add(rel);
    }
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(stateFile + '.new', JSON.stringify({ v: remote.v, dirName: nextName, files: remote.files, over: Array.from(nextOver) }));
    fs.renameSync(stateFile + '.new', stateFile); // from now on the next start uses the new files; this run still uses the old ones
    rmrf(tmp);
    log('update ' + remote.v + ' is ready for the next start');
    return { v: remote.v, files: want.length, bytes };
  } catch (e) {
    log('update failed, the old files stay in use: ' + e.message);
    rmrf(tmp); rmrf(next);
    return null;
  }
}

module.exports = { init, resolve, check, current };
