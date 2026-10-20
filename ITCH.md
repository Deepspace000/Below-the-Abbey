# Uploading Below the Abbey to itch.io with butler

The itch.io page is https://bickering-goat.itch.io/below-the-abbey . Butler uploads only the parts that changed, so an update is a few MB instead of the whole 268 MB zip.

## One time, on a new computer
1. `python tools/get_butler.py` (downloads butler into `tools/butler`, which git ignores).
2. `tools/butler/butler login` (Windows: `tools\butler\butler.exe login`). A browser opens: log in to itch.io and press Authorize. Do this yourself; never paste your login or API key anywhere else.
3. On the game's Edit page on itch.io, after the first push, tick "This file will be played in the browser" on the `html5` file, and delete the old hand-uploaded zip.

## Each update
1. Bump `VERSION` in `index.html`, run `python tools/stamp.py`, commit and push as usual.
2. `python tools/push_itch.py preview` builds `itch-build/` and lists what would change. Nothing is uploaded.
3. `python tools/push_itch.py push` uploads it to the `html5` channel. It goes live in that channel as soon as it finishes.
4. `python tools/push_itch.py manual` uploads `Below-the-Abbey-manual.pdf` to the `manual` channel (a normal download on the page). Only needed when the manual changes (rebuild it with `python manual/build.py`, about 12 minutes).

## Notes
- `tools/pack_itch.py` builds the browser folder: the pictures are glued into four big `pack*.bin` files (itch allows at most 1000 files) and `tools/itch_shim.js` hands them to the page, with a progress bar on the loading screen. `python tools/pack_itch.py --manual` makes a zip that also holds the manual PDF and a Game manual button in the menu (the Pages build always has the button).
- The first push uploads nearly everything; later ones send only changes. Adding many new pictures can move bytes inside the pack files, so a push after a big art update may be larger.

## The Windows app (Electron)
1. `cd desktop`, `npm install` once.
2. `node prepare.js`, then `npx electron-builder --win --publish never -c.directories.output=dist2`. Output: `desktop/dist2/win-unpacked/` (the plain folder) and `desktop/dist2/Below the Abbey Setup <version>.exe` (per-user installer, no administrator rights needed, first page explains the Windows "protected your PC" screen).
3. Smoke test: run `Below the Abbey.exe` with the environment variable `BTA_SMOKETEST=1`; it should print `errors: 0` and quit.
4. Push the folder to itch: `tools/butler/butler push desktop/dist2/win-unpacked bickering-goat/below-the-abbey:windows --userversion <VERSION>`.
5. On the game's Edit page the file shows as a Windows download. Add a line to the page: Windows may say "Windows protected your PC" because this small game is not signed with a paid certificate; click More info, then Run anyway.
