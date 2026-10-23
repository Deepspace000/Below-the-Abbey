# Below the Abbey: permanent instructions

These are standing rules from the owner of the game. They apply to every session and every change. Read them before you
make or ask for any picture, and before you push.

## Art: everything is drawn straight on

1. **All graphics are drawn straight on, in strict front elevation, like a flat architectural drawing.** Never at an angle:
   no three-quarter view, no isometric view, no top-down or bird's-eye view, no view of a roof slope from the side, no
   perspective. This covers every creature, person, item, prop, building front, roof, tree, boat, lantern and sign.
   The only exceptions are the parchment area maps, which are bird's-eye maps by design.
2. **Roofs and anything that rises over a wall are seen from the street looking up**, never from above. A gable roof is a
   flat symmetrical triangle seen straight on. A dome is a dome seen from the side. You never see the top of a roof.
3. **When you ask an image generator for a sheet, say it in capitals**: "STRICT FRONT ELEVATION, exactly straight on,
   symmetrical, no depth, no perspective, no angle". Say that the bottom edge is a straight horizontal line.
4. **Look at every sheet before you use it.** If even one piece is angled, generate the sheet again. Do not ship angled art
   "for now" and do not argue that it looks cute. An angled picture is a defect.
5. Creatures, people, items and props are **painterly raster art** (Gemini first, Canva if Gemini runs out). Never SVG or
   shapes drawn in code for these. Walls and floors may be made in code when no painting exists.
6. A figure is drawn **full length**, hat to boots, with the feet visible, so that it stands on the ground. A picture cut off
   at the waist looks as if the person has sunk into the floor.
7. Reuse the lanterns, urns, vases and carts that already exist before you make new ones.

## Towns

- A town is small and grew by itself: one little main road, about three even smaller lanes going off it, a little main square, and
  a dirt track at the back running out to a couple of cottages. No town grid, no blocks. Every road still runs in a straight line,
  north to south or east to west. Roads are one square wide, and nothing stands in the road (lamps, tubs and arches stand beside it
  or are walk-through), so the whole town can be walked.
- Houses are tiny (two squares across and two deep; the shops and the inn three across), each with its own painted roof.

## Quest marks

- A gold **!** over (or on the map beside) anyone with a quest to give. A green **?** over anyone the party can hand a finished
  quest in to. Never a gold question mark. Same marks in the 3D view, on the minimap and on every area map.

## Writing

- Never use em dashes, in the game, in notes, in commit messages, anywhere.

## Workflow

- After every change: bump `VERSION` in `index.html`, commit, push, rebuild the itch.io zip with `python tools/pack_itch.py`
  (it overwrites the old `itch-build.zip` in this folder every time, so there is only ever one), and give the Pages link
  (https://deepspace000.github.io/Below-the-Abbey/) together with the start-area links for the LATEST areas, not the old ones:
  `?town=boatdock&lvl=34` (the Deeper Hollow, the landing just before the first boat), `?town=deephollow&lvl=34` (the Deeper Hollow, at the door into the maze), `?town=hollowgrass&lvl=34` (the Hollow Grasslands, a dark grassland with fishfolk villages and four beehive dungeons), `?town=hollowland&lvl=34` (the Hollow Land and its castle), `?town=orangetower&lvl=34` (the Orange Spire, level 1), `?town=landpath&lvl=34` (the Pilgrim’s Path), `?town=monasterygate&lvl=34` (outside the monastery, at the statue and the lane to the gate), `?town=monastery&lvl=34` (Saint Elen's Monastery), `?town=oakwood&lvl=34` (the Oakwood),
  `?town=oldhaven&lvl=34` (Oldhaven), `?town=khemetracity&lvl=34`. Replace these with the newest
  areas whenever a new one is added (register it in the `AREAS` table in `jumpFromUrl`).
- The desert and city code lives in `src/desert/*.js` and is injected into `index.html` by `python tools/inject.py`. Edit the
  files in `src/desert`, then run the script. Never edit the injected block by hand.
- Pictures for Khemetra and Yarrim are in `assets/kh` and are listed in `assets/kh/manifest.json`; cut a sheet with
  `python tools/ingest_kh.py` (use `soft=1` for thin dark parts such as ropes and iron posts).

## Releasing: itch.io with butler, and the Windows app with Electron

The itch.io page is https://bickering-goat.itch.io/below-the-abbey (project `bickering-goat/below-the-abbey`). It has three butler channels: `html5` (the browser game, "played in the browser"), `manual` (the manual PDF, a plain download) and `windows` (the Windows app). Full steps are in `ITCH.md`; the short version:

- **First time on a computer:** `python tools/get_butler.py` downloads butler into `tools/butler` (git ignores it). Then the OWNER runs `tools/butler/butler login` (Windows: `tools\butler\butler.exe login`) and approves it in the browser. Never type, ask for or store the owner's itch.io password or API key. `tools/butler/butler status bickering-goat/below-the-abbey` shows the channels.
- **Browser build:** `python tools/push_itch.py preview` builds `itch-build/` (via `tools/pack_itch.py`: pictures glued into four `pack*.bin` files, loader in `tools/itch_shim.js` with the "Downloading the pictures" counter on the loading screen, no manual inside) and lists what would change. `python tools/push_itch.py push` uploads it to `html5`. `python tools/push_itch.py manual` uploads `Below-the-Abbey-manual.pdf` to `manual`. `python tools/pack_itch.py` still makes `itch-build.zip` for a hand upload, and `--manual` makes `itch-build-with-manual.zip` (the PDF inside, with the Game manual button).
- **Standing instruction from the owner: every release goes everywhere.** Whenever a version is pushed to GitHub, also push it to itch.io `html5` (`python tools/push_itch.py preview`, then `push`) AND rebuild and push the Windows app to the `windows` channel (steps below), with the same `--userversion`. Do the preview first and mention what changed, but no extra confirmation is needed for these pushes. The manual channel is only pushed when the manual changes. If a step fails (butler not logged in, build error), say so plainly instead of skipping it quietly.
- **A push goes live in its channel at once.** Always run `preview` first, show the owner what changed, and push only when they say so ("push to itch"). Each update: bump `VERSION`, `python tools/stamp.py`, commit and push to GitHub, then butler.
- **Windows app (Electron, in `desktop/`):** `cd desktop`, `npm install` once (needs permission to download Electron, about 100 MB), then build the app: `node prepare.js` copies the game into `desktop/game`, then `npx electron-builder --win --publish never -c.directories.output=dist2`. This gives the plain folder `desktop/dist2/win-unpacked/` and the installer `desktop/dist2/Below the Abbey Setup <version>.exe`. The build config (`desktop/package.json`) sets `signAndEditExecutable: false` because electron-builder's signing tool needs symbolic-link rights that a normal Windows user does not have; the installer is per-user (`perMachine: false`, `allowElevation: false`), so players need no administrator rights, and its first page (`desktop/build/license.txt`) explains the "Windows protected your PC" screen (More info, then Run anyway; the app is not code-signed). Test it before pushing: `BTA_SMOKETEST=1` with the exe prints a `SMOKE {...} errors: 0` line; the installer can be tested silently with `"Below the Abbey Setup x.exe" /S /D=<empty folder>` and removed with the `Uninstall Below the Abbey.exe` it leaves there.
- **Windows app self-update (from 3.606):** the app checks GitHub Pages for a newer `win-manifest.json` and downloads only the changed game files (see `desktop/README.md`). `python tools/stamp.py` writes the manifest, so commit and push `win-manifest.json` with every release (it is in the release chain already); `desktop/prepare.js` refuses to build if it is for another version. This is for players outside the itch.io app; itch app players still get butler patches.
- **Pushing the Windows app:** `tools/butler/butler push desktop/dist2/win-unpacked bickering-goat/below-the-abbey:windows --userversion <VERSION>` (the folder, so players get patch updates), or push the installer file instead. Channel names containing `windows` tag the file as a Windows download automatically. Ask the owner before pushing.
- **The manual** (a 200 page PDF styled on old Ultima manuals) is built by `python manual/build.py` (about 12 minutes); see the notes at the top of `manual/build.py`, `manual/BRIEF.md` and the memory of this project. It is not in the game build; the GitHub Pages build opens it from the More menu.
