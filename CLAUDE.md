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
  `?town=hollowland&lvl=34` (the Hollow Land and its castle), `?town=orangetower&lvl=34` (the Orange Spire, level 1), `?town=landpath&lvl=34` (the Pilgrim’s Path), `?town=monastery&lvl=34` (Saint Elen's Monastery), `?town=oakwood&lvl=34` (the Oakwood),
  `?town=oldhaven&lvl=34` (Oldhaven), `?town=khemetracity&lvl=34`. Replace these with the newest
  areas whenever a new one is added (register it in the `AREAS` table in `jumpFromUrl`).
- The desert and city code lives in `src/desert/*.js` and is injected into `index.html` by `python tools/inject.py`. Edit the
  files in `src/desert`, then run the script. Never edit the injected block by hand.
- Pictures for Khemetra and Yarrim are in `assets/kh` and are listed in `assets/kh/manifest.json`; cut a sheet with
  `python tools/ingest_kh.py` (use `soft=1` for thin dark parts such as ropes and iron posts).
