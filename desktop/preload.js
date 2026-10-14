// Marks the page as the desktop app, so the game can tell it apart from the web version later
// (for saving to files, Steam achievements and so on).
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('BTA_DESKTOP', { desktop: true, platform: process.platform });
