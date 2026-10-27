# World map: the western kingdoms, the atlas and the coverage check

All new code is in `src/desert/maps_world_west.js` (prefix `wmw` / `WMW`), injected after `gy_maps.js` (it needs `GY`, `WK` and `WM`). Run `python tools/inject.py` after editing it.

## What is on the world map
The map already had a wide western land (The Western Reaches, The Far West), so nothing was widened. Wenlock moved west to (-300,226) to make room, and the title "The Western Reaches" moved north to (-300,64) in three places (`maps_world.js` twice, `maps_world_new.js` once). No small writing under place names (owner rule in `world_tweaks.js`), so Wenlock lost its "a market town" line.
- Wenlock (496 and its rooms, `WL.H0`), The Maze of Gardens (490 to 495, a green hedge maze with a fountain), Blackbriar Wood (520 to 523, dark pines made once from the atlas pines with a CSS filter, and a cottage), Wenlock Graveyard (530, 531; atlas graves and crypt), the four graveyard mazes (532 to 535) as the atlas brick maze in the wall colours of `gy_mazes.js` (red clay, grey stone, black basalt, bone white), The Well Maze (497, 498, 499, 502: four violet slabs numbered 1 to 4 under a well ring), The Western Kingdoms (a shut gate, no levels, the road west is not yet open), Under the Well (501, a blue grey maze beside Thornwick), The Underlevel (476, round black sea, island, six pillars) and The Drowned Maze (477), both north of the Hollow Lands, The Golden Pyramid (65, atlas pyramid in the Golden Erg).
- Roads: Garden Road (Deeper Hollow, gardens, Wenlock, with a bridge where the river is), Blackbriar Lane, Churchyard Lane, the road west, Well Lane, lanes to the four mazes, Thornwick to Under the Well. Lane names are written along the road where there is a clear stretch (`wmwRoadWords`).
- The Deeper Hollow gets a small gate on its north wall (grey until `bswDead` or `wkGate`) and, once level 475 has been built, eight gold dots for its towns (names at zoom 2.4 and up).
- Little dungeons: a mound-and-door mark for each of the 52 desert dungeons (100 to 151, from `DNG_INFO`) and the ten Sand Road burrows (50 to 59), scattered round their desert and kept clear of every name. Names show at zoom 2.1 or more; marks that found no room for a name show it from zoom 4.2.
- Quest dots: `QWORLD_ID` for wk1 (Deeper Hollow), wk2 (gardens), wk3 (Wenlock), bsw1 (Underlevel); `QWORLD['Wenlock Graveyard']` for the five ghost quests (gyq1 to gyq5); the witch quests and Wenlock quests already count at Wenlock (their givers are in town).
- Hollow Grasslands `lv` now holds 480 to 489 and 4850 to 5499, so "you are here" works inside the four terrace towns (Exsce, Ulb, Glorm, Nibb) and their rooms.

## The atlas of mazes and dungeons
The Atlas button (bottom row of the world map, between Level map and the zoom buttons) opens four parchment pages (`G.wAtlas`, buttons `watlas`, `watl_prev`, `watl_next`, `watl_back`, `ovexit`). It lists every maze, dungeon and hidden place that is not already a big picture, with levels, ratings, notes, and a gold dot once visited. The seven hidden caves (7200 to 7206) show as "? A hidden cave" until found. The atlas closes by itself if the map was closed while it was open (`G._wAtlasT`).

## Coverage check
`python tools/worldmap_check.py [--port 8372] [--all]` starts its own http.server if nothing answers on the port, loads the game, and asks `wmwCoverage(id)` for every named level and every `AREAS` id (parsed from `index.html`; the three getters deephollow, boatdock, blackswill are added by hand). `how` is `symbol` (a `WORLD_LOCS` place lists the id), `atlas`, or `interior` (rooms inside a place, ranges in `WMW_INTERIOR`). Exit code 1 if a named id is not shown. Last run: 532 named ids, 532 shown, 50 AREAS entries, all shown.

## Test helpers
`python tools/wm_shot.py name:zoom:worldx:worldy ...` (3x screenshots in `_wm_shots/`, `GRID=1` draws a world-coordinate grid) and `python tools/wm_atlas_shot.py`. Both use port 8372 and wait for `LEVEL===496`.

## Not shown, and why
- The rooms of Wenlock, the terrace towns, Yarrim, the Oldhaven quay, the Pilgrim path and the Pilgrim caves are shown by the symbol of their town (you are here pin, Go to area list), not one by one.
- The eight maze towns have no exact dots until level 475 has been built once (building it just to draw the map would be slow).
- The Terrace test levels (480, 485, 486, 487) are in the atlas only.
- Levels without a name (6000 to 6649, 8016 and up, the `None` ids) are filler and are not listed.
