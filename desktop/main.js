// Desktop wrapper for Below the Abbey. It serves the game's own files through a private app:// address, so the game
// code runs exactly as it does on the web (fetch, audio and images all work), and it keeps the window running at full
// speed even when it is covered. The web version is untouched.
const { app, BrowserWindow, protocol, net, Menu, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const updater = require('./updater');
const savebackup = require('./savebackup');
const saveDir = () => path.join(app.getPath('documents'), 'Below the Abbey', 'Saves');

const SMOKE = !!process.env.BTA_SMOKETEST;
// in development the game is the folder above; in a built app it is copied into resources/game by prepare.js
const GAME_DIR = process.env.BTA_GAME_DIR ? path.resolve(process.env.BTA_GAME_DIR) : app.isPackaged ? path.join(process.resourcesPath, 'game') : path.resolve(__dirname, '..');
const UPD_TEST = !!process.env.BTA_UPDATE_TEST; // test run: look for an update at once, print what happens, then quit
if (process.env.BTA_USERDATA) app.setPath('userData', path.resolve(process.env.BTA_USERDATA));

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true } }
]);

// the game's Screen page asks for full screen on or off (F11 does the same)
ipcMain.handle('bta-fs', (e, cmd) => {
  const w = BrowserWindow.fromWebContents(e.sender); if (!w) return false;
  if (cmd === 'toggle') { const on = !w.isFullScreen(); w.setFullScreen(on); return on; }
  return w.isFullScreen();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 720, minWidth: 640, minHeight: 360,
    backgroundColor: '#000000', title: 'Below the Abbey', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), backgroundThrottling: false, contextIsolation: true }
  });
  Menu.setApplicationMenu(null);
  // the window only ever shows the game itself: no leaving for another address, and a new window only for the game's own files (the manual)
  win.webContents.on('will-navigate', (e, url) => { if (!/^app:\/\/game\//i.test(url)) e.preventDefault(); });
  win.webContents.setWindowOpenHandler(({ url }) => (/^app:\/\/game\//i.test(url) ? { action: 'allow' } : { action: 'deny' }));
  win.loadURL('app://game/index.html');
  startUpdates(win);
  if (SMOKE) {
    const errors = [];
    win.webContents.on('console-message', (_e, level, msg) => { if (level >= 3) errors.push(msg); });
    win.webContents.once('did-finish-load', () => setTimeout(async () => {
      const info = await win.webContents.executeJavaScript('({title:document.title,state:window.__game&&window.__game.state,version:typeof VERSION!=="undefined"?VERSION:null,canvas:!!document.querySelector("canvas")})').catch(e => ({ err: String(e) }));
      console.log('SMOKE', JSON.stringify(info), 'errors:', errors.length);
      errors.slice(0, 5).forEach(m => console.log('ERR', m));
      app.quit();
    }, 6000));
  }
  win.webContents.on('before-input-event', (_e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') win.setFullScreen(!win.isFullScreen());
  });
}

// A banner over the game (top centre) that stays until it is dismissed. restart=true adds a "Restart now" button.
function banner(win, text, restart, secs) {
  if (win.isDestroyed()) return;
  if (UPD_TEST) console.log('BANNER', text);
  const js = `(()=>{let d=document.getElementById('bta-upd');if(!d){d=document.createElement('div');d.id='bta-upd';d.style.cssText='position:fixed;left:50%;top:14px;transform:translateX(-50%);background:#1b1409;color:#f0e4b4;border:2px solid #d8b868;padding:10px 16px;font:15px serif;z-index:99999;border-radius:5px;box-shadow:0 0 18px #000c;text-align:center;max-width:80vw';document.body.appendChild(d)}
d.textContent=${JSON.stringify(text)};
const mk=(t,f)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='margin:8px 6px 0;padding:4px 12px;font:14px serif;background:#3a2a10;color:#f0e4b4;border:1px solid #d8b868;cursor:pointer';b.onclick=f;d.appendChild(document.createElement('br'));d.appendChild(b);return b};
${restart ? "mk('Restart now',()=>window.BTA_DESKTOP.restart());mk('Later',()=>d.remove());" : "clearTimeout(window.__btaUt);" + (secs ? "window.__btaUt=setTimeout(()=>d.remove()," + secs * 1000 + ");" : "")}})()`;
  win.webContents.executeJavaScript(js).catch(() => {});
}
ipcMain.on('bta-saves-read', (e) => { let r = null; try { r = savebackup.read(saveDir()); } catch (x) { /* none */ } e.returnValue = r; });
ipcMain.on('bta-saves-write', (e, obj) => { try { savebackup.write(saveDir(), obj); } catch (x) { /* the game goes on without a copy */ } });
ipcMain.handle('bta-restart', () => { app.relaunch(); app.exit(0); });

// Newer game files: the app looks on GitHub Pages for a newer version (see updater.js), downloads only the files that
// changed and uses them from the next start. The installed files are what is served until then.
function startUpdates(win) {
  if ((!app.isPackaged && !UPD_TEST) || (SMOKE && !UPD_TEST)) return;
  const go = async () => {
    banner(win, 'Checking for updates...', false, 0);
    let r = null;
    const log = (m) => {
      if (UPD_TEST) console.log('UPDATER', m);
      const n = /^new version (\S+)/.exec(m);
      if (n) banner(win, 'Downloading version ' + n[1].replace(/[^0-9.]/g, '') + '...', false, 0);
      else if (/^update failed/.test(m)) banner(win, 'The new version could not be downloaded. The game will try again next time you start it.', false, 8);
      else if (/^up to date/.test(m)) banner(win, 'The game is up to date.', false, 3);
      else if (/^no update check|^the update list/.test(m)) banner(win, 'Could not check for updates (are you online?).', false, 5);
    };
    try { r = await updater.check(log); } catch (e) { if (UPD_TEST) console.log('UPDATER error', e.message); }
    if (r && !win.isDestroyed()) banner(win, 'Version ' + String(r.v).replace(/[^0-9.]/g, '') + ' has been downloaded. Restart the game to play it.', true);
    if (UPD_TEST) setTimeout(() => app.quit(), 500);
  };
  win.webContents.once('dom-ready', () => setTimeout(go, 400)); // as soon as the loading screen is up, so the player sees it looking
}

app.whenReady().then(() => {
  updater.init(GAME_DIR);
  protocol.handle('app', (req) => {
    const u = new URL(req.url);
    let rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
    if (rel === '') rel = 'index.html';
    if (!updater.safeRel(rel)) return new Response('Forbidden', { status: 403 });
    const file = updater.resolve(rel);
    if (!require('fs').existsSync(file)) return new Response('Not found', { status: 404 }); // the web version has a few of these too
    return net.fetch(pathToFileURL(file).toString());
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
