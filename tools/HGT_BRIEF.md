# Hollow Grasslands: the four strange cities (project brief)

Game: single-file HTML canvas dungeon crawler (grid raycaster) in `C:\Users\mirko\Downloads\NIGHTFLYER RADIO SUBSPACE\RAT-CELLARS`. Read `CLAUDE.md` and the memory-style rules below first.
The Hollow Grasslands (level 470, `src/desert/hollowgrass*.js`) is a cold, ghostly cavern land with a rock roof, frog-like fishfolk and five villages (Exsce, Ulb, Glorm, Wexsh, Nibb). Today the villages
are flat palisaded squares on level 470. The owner wants FOUR real cities that are a joy to explore: **big, strange, surreal, vertical** (reference: the pink and pale-blue Dr Seuss-like towers in
`tools/hgt_reference.webp`: leaning towers with tiny windows, huge curving staircases that climb the outside of buildings, arches, bridges of stairs, houses with round doors, bulb-shaped upper rooms).

## What the owner asked for (verbatim intent)
- Four cities in the Hollow Grasslands, based on the CURRENT look Exsce has (spiked palisade, pale houses, arch gates, lamps, pastel illuminated-manuscript colours), but with LOTS of variety, nooks and crannies, much bigger than now.
- Lots of stairs up to rooms that are higher up, and stairs going DOWN into houses below the ground.
- Glittering lights on the plants. House material beautiful, light and SHELL-LIKE (pearl, nacre, pale pink, aqua, cream).
- Use real 3D heights (not flat): steps and towers the player can climb, and climb back down. Detailed, beautiful, stunning, strange. Each structure lavished with attention.
- Exploring must feel rewarding: secret nooks, balconies, sunken courts, lookout towers, hidden rooms, things to find.

## The engine plan (do not invent another one)
The renderer already has a height-field mode used by the deserts (`TERR_NOW`, `terrFor`, `terrH`, `terrMarch` in `src/desert/terrain.js`; the camera rides the ground). It is smooth (bilinear). We add a
**terraced mode** for the town levels: heights are per CELL and sampled nearest-neighbour, so every cell is a flat step and cliffs/risers are sharp; the camera eases between cell heights; the party can walk
from a cell to a neighbour only when the height difference is small (<= 0.55); walls (any non-'.' cell, drawn by the normal raycaster, height from the wall tile's `TEX[..].wh`) stand on the ground height of their cell, so
towers = tall wall cells and their tops are not walkable, while STAIRS and PLATFORMS are open cells of rising height (a staircase is a run of open cells, each a little higher). Negative heights give sunken courts and
stairs going down. Buildings you can enter are wall-textured blocks with a door cell (`D`/digit portal like the other levels) leading to an interior level (a normal flat level built by code, as the beehives are).

Level ids: towns 480, 481, 482, 483 (`HGT.ID0 = 480`). Their interiors: 4850 and up (any free ids; check `LEVELS`, `LEVEL_NAMES`, KH_LAZY and the range lists).
All gotchas learned for level 470 apply to the town levels too: the raycaster gives up after 64 cells (open-horizon condition), `GRIM_L` haze, tint values for 470 in the renderer, `goToLevel`/`restore`/`jumpToLevel` KH_READY range lists
(see memory notes: a save made in a new level range crashed Continue/Go to area until the ranges were extended, ALWAYS test the title screen WITH a save inside the new level), the cold overlay on `drawWeatherFx`, rock roof.
Heights use game units where the eye is about 0.5 and a normal wall is `CEILH` high; a comfortable stair step is 0.18 to 0.3 high per cell; towers can rise 6 to 14 units.

Data contract (who owns what is below):
```js
LEVELS[id] = { rows:[...], chars:{...}, start:{x,y}, decor:[...], portals:[...], lights:[...], mapNames:[...], terrace:{ h: Float32Array(W*H) /* per cell */ }, outdoor:true, ... }
```
Only open cells ('.') are walked; their height is `terrace.h[y*W+x]`. A wall cell's base height is also `terrace.h` (set it to the ground height of the building foot).

## Team and files (names start with the prefix shown; every src file shares one global scope; run `python tools/inject.py` after every edit; never hand-edit the injected block in index.html except where the engine brief says core edits go in index.html)
- ENGINE agent: terraced renderer, camera easing, climb rule, roof and haze for the town levels, level-range lists, a small test level 480. Files: `src/desert/terrain.js`, core edits in `index.html`, new `src/desert/hgt_engine.js` (prefix `hgte`).
- ART agent: painted shell-like wall textures (several tints), doors, window variants, stair and pavement floors, glitter plants, ornaments, lamps. Gemini only, no code-drawn art. Files: assets, `src/desert/hgt_art.js` (prefix `hgta`), tools/ingest_* scripts.
- LIBRARY agent: builders for strange structures on the height grid (stairs straight/curved/spiral, towers, leaning towers, arches, bulb houses, sunken houses and courts, terraces, bridges of steps, secret nooks, plant clusters) plus a town-level assembler and a 2D debug image of a town. Files: `src/desert/hgt_lib.js` (prefix `hgtl`).
- Later: FOUR TOWN agents, one per city, each designing the whole city with one extra-lavish signature structure. Files `src/desert/hgt_town_<name>.js` (prefix `hgtx<name>`).

## Style rules (always)
- Never use em dashes anywhere (code comments, text, commit messages). Plain, literal, factual game text; no explanatory prose on maps. No cute or jokey wording.
- Art is PAINTERLY RASTER made with Gemini (see memory-style notes in `CLAUDE.md` and `tools/`): strict front elevation for sprites and walls, magenta (#ff00ff) background for cut-outs, check every sheet, regenerate if wrong. Nothing drawn in code for creatures, props or buildings (heights, layouts and lighting effects in code are fine). Map overlays may be code.
- Do not commit, push or bump the version; the owner's main session does that. Never kill python by name; stop only a process you started, by PID.
- Edit only your own files plus the core edits named in your assignment. Other agents work at the same time.
- Test loop: dev server already at http://localhost:8070 (do not start another). Create your own Browser tab (`tabs_create`) and pass its tabId everywhere. Start your own screenshot receiver once in the background: `python C:\Users\mirko\AppData\Local\Temp\claude\C--Users-mirko-Downloads-NIGHTFLYER-RADIO-SUBSPACE\6395aa69-0c9e-4a19-b1b5-473991e122b8\scratchpad\recv2.py <port>` saves POSTed images to `scratchpad\shots_<port>\<name>.jpg`; look at them with Read. In the page: wait `G.lst`, `await khLoadAssets(); await khPrepare();`, then `goToLevel(id,{x,y,f:0}); G.state='play'; G.menu=false; render3D(); ctx.setTransform(2,0,0,2,0,0); ui(.016); await fetch('http://localhost:<port>/n.jpg',{method:'POST',body:ctx.canvas.toDataURL('image/jpeg',.9)})` (reload the page after code changes). Hidden pane: screenshots of the pane may be stale, the canvas POST is reliable.
- Final report under 150 words: what exists, how to call it, what is missing.

## Owner rule added later: minimise SVG and code-drawn graphics
No SVG anywhere. Nothing in the town levels is drawn by canvas code or vector shapes: every wall, door, step, plant, lamp, ornament and sky/roof picture is a painted raster picture made with Gemini and ingested into assets. Code only places pictures, sets heights, shading and light. Debug images for designers may be code-drawn but never ship in the game.
