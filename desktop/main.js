// Desktop wrapper for Below the Abbey. It serves the game's own files through a private app:// address, so the game
// code runs exactly as it does on the web (fetch, audio and images all work), and it keeps the window running at full
// speed even when it is covered. The web version is untouched.
const { app, BrowserWindow, protocol, net, Menu, globalShortcut } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

const SMOKE = !!process.env.BTA_SMOKETEST;
// in development the game is the folder above; in a built app it is copied into resources/game by prepare.js
const GAME_DIR = app.isPackaged ? path.join(process.resourcesPath, 'game') : path.resolve(__dirname, '..');

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

app.whenReady().then(() => {
  protocol.handle('app', (req) => {
    const u = new URL(req.url);
    let rel = decodeURIComponent(u.pathname);
    if (rel === '/' || rel === '') rel = '/index.html';
    const file = path.normalize(path.join(GAME_DIR, rel));
    if (!file.startsWith(GAME_DIR)) return new Response('Forbidden', { status: 403 });
    if (!require('fs').existsSync(file)) return new Response('Not found', { status: 404 }); // the web version has a few of these too
    return net.fetch(pathToFileURL(file).toString());
  });
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
