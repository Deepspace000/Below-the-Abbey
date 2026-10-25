// Marks the page as the desktop app, so the game can tell it apart from the web version later
// (for saving to files, Steam achievements and so on). It also lets the game's Screen page switch full screen on and off.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('BTA_DESKTOP', {
  desktop: true, platform: process.platform,
  fullscreen: () => ipcRenderer.invoke('bta-fs', 'get'),
  toggleFullscreen: () => ipcRenderer.invoke('bta-fs', 'toggle')
});
