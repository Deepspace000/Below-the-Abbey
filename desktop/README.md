# Below the Abbey: desktop wrapper

The game itself is the web page in the folder above. This folder only wraps it so it can run as a normal Windows program.

- `npm install` once.
- `npm start` runs the game in a window straight from the folder above, so every change you make shows up.
- `npm run dist` copies the game into `game/` and builds a Windows folder and installer into `dist/`.
- `BTA_SMOKETEST=1 npm start` opens the game, waits a few seconds, prints a short report and quits.

The game can detect the app with `window.BTA_DESKTOP`. Press F11 for full screen.
