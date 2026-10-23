// Desktop wrapper for Below the Abbey. It serves the game's own files through a private app:// address, so the game
// code runs exactly as it does on the web (fetch, audio and images all work), and it keeps the window running at full
// speed even when it is covered. The web version is untouched.
const { app, BrowserWindow, protocol, net, Menu, globalShortcut } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const updater = require('./updater');

const SMOKE = !!process.env.BTA_SMOKETEST;
// in development the game is the folder above; in a built app it is copied into resources/game by prepare.js
const GAME_DIR = process.env.BTA_GAME_DIR ? path.resolve(process.env.BTA_GAME_DIR) : app.isPackaged ? path.join(process.resourcesPath, 'game') : path.resolve(__dirname, '..');
const UPD_TEST = !!process.env.BTA_UPDATE_TEST; // test run: look for an update at once, print what happens, then quit
if (process.env.BTA_USERDATA) app.setPath('userData', path.resolve(process.env.BTA_USERDATA));

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true } }
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 720, minWidth: 640, minHeight: 360,
    backgroundColor: '#000000', title: 'Below the Abbey', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), backgroundThrottling: false, contextIsolation: true }
  });
  Menu.setApplicationMenu(null);
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

// Newer game files: the app looks on GitHub Pages for a newer version (see updater.js), downloads only the files that
// changed and uses them from the next start. The installed files are what is served until then.
function startUpdates(win) {
  if ((!app.isPackaged && !UPD_TEST) || (SMOKE && !UPD_TEST)) return;
  setTimeout(async () => {
    let r = null;
    try { r = await updater.check((m) => { if (UPD_TEST) console.log('UPDATER', m); }); } catch (e) { if (UPD_TEST) console.log('UPDATER error', e.message); }
    if (r && !win.isDestroyed()) {
      const v = String(r.v).replace(/[^0-9.]/g, '');
      win.webContents.executeJavaScript(`(()=>{const d=document.createElement('div');d.textContent='Version ${v} has been downloaded. It will be used the next time you start the game.';d.style.cssText='position:fixed;left:50%;bottom:12px;transform:translateX(-50%);background:#1b1409;color:#f0e4b4;border:1px solid #8a7448;padding:8px 14px;font:14px serif;z-index:99999;border-radius:4px;pointer-events:none';document.body.appendChild(d);setTimeout(()=>d.remove(),9000)})()`).catch(() => {});
    }
    if (UPD_TEST) setTimeout(() => app.quit(), 500);
  }, UPD_TEST ? 1500 : 5000);
}

app.whenReady().then(() => {
  updater.init(GAME_DIR);
  protocol.handle('app', (req) => {
    const u = new URL(req.url);
    let rel = decodeURIComponent(u.pathname).replace(/^\/+/, '');
    if (rel === '') rel = 'index.html';
    if (rel.split('/').includes('..')) return new Response('Forbidden', { status: 403 });
    const file = updater.resolve(rel);
    if (!require('fs').existsSync(file)) return new Response('Not found', { status: 404 }); // the web version has a few of these too
    return net.fetch(pathToFileURL(file).toString());
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
