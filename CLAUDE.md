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

## Writing

- Never use em dashes, in the game, in notes, in commit messages, anywhere.

## Workflow

- After every change: bump `VERSION` in `index.html`, commit, push, and give the Pages link
  (https://deepspace000.github.io/Below-the-Abbey/) together with the full list of start-area links
  (`?town=khemetracity&lvl=34`, `?town=khemetra&lvl=36`, `?town=reddunes&lvl=36`, `?town=sandroad&lvl=34`,
  `?town=tomb&lvl=34`, `?town=burrow&lvl=34`, and any area that was added).
- The desert and city code lives in `src/desert/*.js` and is injected into `index.html` by `python tools/inject.py`. Edit the
  files in `src/desert`, then run the script. Never edit the injected block by hand.
- Pictures for Khemetra and Yarrim are in `assets/kh` and are listed in `assets/kh/manifest.json`; cut a sheet with
  `python tools/ingest_kh.py` (use `soft=1` for thin dark parts such as ropes and iron posts).
