# Below the Abbey: desktop wrapper

The game itself is the web page in the folder above. This folder only wraps it so it can run as a normal Windows program.

- `npm install` once.
- `npm start` runs the game in a window straight from the folder above, so every change you make shows up.
- `npm run dist` copies the game into `game/` and builds a Windows folder and installer into `dist/`.
- `BTA_SMOKETEST=1 npm start` opens the game, waits a few seconds, prints a short report and quits.

The game can detect the app with `window.BTA_DESKTOP`. Press F11 for full screen.

## Updates from GitHub Pages

A player who did not get the app through the itch.io app gets no automatic patches, so the app updates its own game files (`updater.js`). `tools/make_win_manifest.py` (run by `tools/stamp.py`, so every release) writes `win-manifest.json`: every file of the game with its sha256 (of the file as git commits it: text files with LF line ends). GitHub Pages serves that file and the game files. Five seconds after start the app reads the list from Pages; if its version is newer than the one the app holds, it downloads only the files whose hash changed, checks every one, keeps them in the user's data folder (`update/`) and uses them from the next start (a note on screen says so). Nothing is half applied, and the files of a running game never change. If the installed app is as new as the download, the download is dropped. Only the game's files update this way: a change to `main.js` or Electron itself needs a new build.

- `prepare.js` copies `win-manifest.json` into the app and stops if it is not the manifest of this version: run `python tools/stamp.py` first.
- Commit and push `win-manifest.json` with each release (Pages must serve it), or the apps will not see the version.
- Test (no real Pages needed): `BTA_GAME_DIR` (the installed game folder), `BTA_UPDATE_BASE` (a local web server holding a newer copy and its `win-manifest.json`), `BTA_USERDATA` (a scratch folder) and `BTA_UPDATE_TEST=1 npm start` look for an update at once, print `UPDATER ...` lines and quit.
