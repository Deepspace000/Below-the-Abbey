# Wenlock: notes for the next session

Wenlock is an English country market town, level 496 (100 by 100), reached from the Maze of Gardens through the lych-gate at the east end (`WK.WSTART` = 95,50 facing west).
The road west is a signposted gate that stays shut ("not yet open"). Interiors are levels 7100 to 7199 (built by `src/desert/wenlock_in_*.js`, not by the town files).

## Files (all in src/desert, run `python tools/inject.py` after editing)
- `wenlock_art.js`   loader for `assets/wl` (manifest.json, empty so far), heights, roofs (new colours are tinted copies of the Oldhaven and Yarrim gables), floors, wall styles. Global name `WLART` (not WLA, terrain.js owns that).
- `wenlock_town.js`  tables at the top: `WL_SPEC`, `WL_LOTS`, `WL_HOUSES`, `WL_DOORS` (for the interior builder), `WL_QUESTS`; then `wlBuild()` (terrain, roads, brook, bridge, gates, church, houses, church yard, square with the well, green with pond, orchard, yards, trees, lamps),
  and wrappers of `goToLevel`, `restore`, `jumpToLevel`, `usePortal` (gate back to the garden uses `WK.GBACK`; first arrival calls `wkMet('wenlock')` once; on return from the well sets `G.flags.wlWellDone` when `wlWellQuestGoal()` says so).
- `wenlock_folk.js`  about 45 outdoor townsfolk and animals (ids `wlo_*`), placed near coordinates by `wlPlaceFolk`.
- `wenlock_quests.js` the mayor and the ten chained quests `wlq1` to `wlq10` (mayor, crier, Goody Prue, Mrs Tanner, Constable Fudge, Jack Joiner, Curate Pettigrew, Mrs Suds, Sexton Moss, mayor). Quest 8 opens the well (`G.flags.wlWellOpen`, `WK.WELLDOOR`, `WK.WELLBACK`) and goes down to `WK.WELL[0]` at `WK.WELLSTART`. Its reward gives the Belfry Key (`wlkey`) for quest 9. Mayor's first talk calls `wkMet('mayor')` once.
- `wenlock_sound.js` wind, birdsong, the hour bell, the smith's hammer (loud near the forge door).
- `maps_wenlock.js`  illuminated area map, world map entry (`WORLD_LOCS` k `wenlock`, west of the Hollow Lands), `QWORLD`, Go to area list rows.

## Core edits in index.html (outside the injected block, all marked by `496`)
`LEVEL===496` was added next to `LEVEL===305` for the outdoor sky, haze, day cycle and the roof list (`desertLv`, `hzr0`, `hzc0`, `hzmax0`, `hzrate0`, `ohL`, `dsl`, the sky list in the sprite pass), the ambience line, the water bump message, and `wenlock:[496,95,50,3]` in `AREAS` of `jumpFromUrl`. Link: `?town=wenlock&lvl=80`.

## Testing (own server, `python -m http.server 8377` from the repo root)
- `python tools/wl_test.py shots`  console errors and 20 screenshots in `_wl_shots/`.
- `python tools/wl_walk.py`        flood fill over the real level: every road cell reached (incl. across the bridge), every door front reached, no NPC in a road, gates reached.
- `python tools/wl_quest_test.py`  runs the mayor and all ten quests through accept and hand-in, the well, and every door in `WL_DOORS`.
- `python tools/wl_map.py`         area map and world map pictures.

## Art status
Gemini hit its limit on the first sheet. ChatGPT images (chatgpt.com, owner's Chrome, own tab; the sheet is an `img` blob that a script saves with an anchor download into the Downloads folder, then `cp` it to `_wl_in/`) made three sheets before it ran out ("You're out of images"), cut with `python tools/ingest_wl.py <sheet.png> <name> sprite maxh=512`:
`roof1` (6 gables: wheat thatch, mossy thatch, red tile, honey stone slate, blue slate with bargeboard, mossy tile), `prop1` (market cross, stocks, maypole, pump with trough, flower tent, hay wagon), `bldg1` (church with tower, village hall, windmill, watermill, dovecote, barn). That is 18 pictures in assets/wl.
They are wired in: the church and hall stand as big sky sprites over hidden wall blocks (the sprite must stand in FRONT of the wall face, on the side the party sees), the windmill, mill, dovecote and barn the same way (`pic()` in wlBuild), roofs via `WL_ROOFS`, props in the square and on the green.
Still on stand-ins (sheets not made yet, the code already prefers these names when they exist): `wall1..4_0..5` (flint, black and white timber, cob, stone wall tex sheets, 3x2), `duck0..2`, `goose0..2`, `sheep0`, new townsfolk (a folk sheet prompt is in the session history: shepherdess, milkmaid, vicar, old farmer, village girl with goose, miller), dog and cat sprites, a painted bridge. Canva (generate-image then remove-background) was not tried.

## Ideas not done
Market-day stalls change by time of day; people that walk about; painted interiors of the cellar quests were dropped when the ten-quest chain replaced the loose side quests.
