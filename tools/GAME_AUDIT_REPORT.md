# Whole-game audit report (Below the Abbey 3.719)

Made with `tools/game_audit.py`, the castle method of `tools/ps_audit.py` and `tools/ps_ground.py` applied to every level of the game.
Nothing in the game was changed for this report; the findings are for the fixing agents.

## How it was made

- One Chrome page boots `?town=oldhaven&lvl=34`, then visits every area the way the jump links do (the `AREAS` table of `jumpFromUrl`,
  plus `pspAreas`, `blAreas`, `ntAreas`, the Vault, the Black Swill and the Deeper Hollow spots, plus the first level of every `WORLD_LOCS`
  place: 74 visits), so each package loads its pictures and finishes building. Then every `KH_LAZY` level is built, again and again until
  nothing new appears. Result: **12,933 levels** built (541 lazy numbers never build; see UNBUILT).
- Each level is loaded with the game's own `reset(id)`: the real `G.grid`, `G.decor` (people made walk-through, trees from `t` squares, the
  teleporter), `TERR_BLOCK` and `TERR_STEP`. Reach uses the real step rules (`terrStepOK` on terraced levels), openable doors, key doors,
  lever targets and the castles' hidden doors; warps inside a level are joined. Starts are the level start and every door, portal and
  mound landing into the level.
- Sizes, lifts and drops are read from the game's own `spriteList()` (the camera is walked over big maps), so every package wrapper
  (`ps_flush`, `ps_scale` and the rest) is already applied. Grounding uses the `ps_ground.py` alpha padding method on the drawn picture.
- Run time on this PC: about 95 s to visit and build, about 150 s to audit all levels. `--area`, `--levels`, `--json`, `--report`,
  `--resume` work; allowed findings live in `tools/game_audit_allow.json` with a reason each and are still counted.
- The castle tools still pass: `PS_PORT=9011 python tools/ps_audit.py` prints `AUDIT CLEAN` on this tree.

Run it: `python -m http.server 9011` from the repo root, then
`GA_PORT=9011 BTA_CHROME="C:/Program Files/Google/Chrome/Application/chrome.exe" python tools/game_audit.py --all --report tools/GAME_AUDIT_REPORT.md`.

## The most important findings, in plain words

1. **One generator, 2,800 hovering pieces.** The house scenes in `src/desert/khemetra_build.js` (lines 240 to 257, used for the houses of
   Khemetra, Oldhaven and the Hollow towns) lift four pieces beside the back wall with bob but give them no wall side: `kitchenshelf`
   (`kh_int6_5`, bob .5), `tapestry` (`kh_int4_3`, bob .45), `shrine` (`kh_int6_1`, bob .3) and `hlamp` (`kh_int2_1`, bob .8). The
   engine draws them free-standing in the middle of the square, so they hang in mid air half a square in front of the wall (HOVER).
   Fix it once in the scene table: wall pictures (`pic:1` with `wd:[0,-1]`) for the shelf, tapestry and shrine; the hanging lamp may be
   meant to hang from the ceiling and needs a look. Wenlock's interiors do the same with `wl2_hall_1` and `wl2_library_5`.
2. **Generated houses shared by two areas (DEST_SHARED, 38).** Houses 4949 to 5498 are entered from Khemetra AND from a Hollow
   Grasslands town: the Hollow town builders take house numbers that Khemetra's house numbering also uses. Walking into one of those
   doors can show the other town's house. Needs a numbering fix in `hgt_rooms.js` / `hgt_town_*.js` (or `khemetra_build.js` `KH_HOUSE_NEXT`).
3. **Webs that float in rooms (WEBFREE, 405).** `gy_web` is put in room corners as free-standing decor by `sale_rooms.js` (every Sale
   house), `blight_polish14.js` (four corners of Blighted Road rooms), `blight_toll.js` and the graveyard and catacomb builders. The
   owner's rule from the castle: webs only on walls (`pic:1` with `wd`).
4. **Free-standing pieces inside walls (INWALL, 759).** Biggest: Nibb (level 484) has 393 `hgt_gardenlantern` and friends on wall squares
   (invisible or poking out of walls), Wenlock interiors put crates on the outer wall row, the Pilgrim's Path monastery fence and graves
   stand in wall squares.
5. **Chests and people nobody can reach (LOOT_UNREACH 187, NPC_UNREACH 125, ITEM_UNREACH 45).** Many are real (Hollow town rooms, the
   Well Maze, the Oakwood herbs behind trees); some are on islands reached by boat in the Deeper Hollow, which the audit does not model.
6. **Loose arches and gates (LOOSEDOOR, 107):** 55 `yar_arch` standing free on the floor of the Drowned Abbey (321), `hg_arch` and
   `hgt_arch` in the Hollow lands, `bl_arch` across the Blighted Road.
7. **Floating pieces (FLOAT 236):** desert plants `dplant2` on the Sand Road and Red Dunes (their picture has empty rows under the
   stem), `b9_twig` in Rookery Mill and Pale Bridge (lifted 0.5), Deeper Hollow huts.
8. **Missing pictures (MISSINGPIC 56):** `hgt_arch` (42, the Hollow towns), `hgt_glowshrooms`, `wm_barrel_stack`, a `lantern` in Blackbriar
   cellars, `ale` in the Bone Orchard; `assets/af_hagblind.png` is a 404.
9. **Signs on open air (NOWALL 52):** the Vault's `sign_gy` (11), Wenlock's `sign_wlnote`, the player-house signs `sign_hsown` in
   Khemetra, Ironhill and Wenlock (whose wall side points at open ground).
10. **Creatures cut off in the fight window (FOE_CUT 48):** `hgusl9` (25) and the `hgdemon` family in the Underlevel, `hgins9` in the
    Hollow Grasslands, and one tall creature per Blighted Road place (`tt0` to `tt5`).


<!-- the tables below are generated by tools/game_audit.py --report -->

## Counts per area

12933 levels audited in 151 s (plus about 95 s to visit every area and build every level). 6389 findings, 13 of them allowed in tools/game_audit_allow.json. Review codes (DEST_SHARED, NAMEPIC, ONEWAY, UNBUILT) are for a person to look at and never fail the run.

| Region | Area | Levels with findings | Fix | Review | Checks |
|---|---|---|---|---|---|
| Below the Abbey | Hollow Grasslands | 251 | 1295 | 58 | LOOSEDOOR 32, ROUTEBLOCK 15, CORRIDOR 124, START_BLOCKED 1, ITEM_BLOCKED 1, ITEM_UNREACH 2, LOOT_UNREACH 79, NPC_UNREACH 28, MISSINGPIC 46, NPC_TALL 4, FOE_CUT 6, FLOAT 40, HOVER 267, SINK 34, INWALL 500, DUPDECOR 116, ONEWAY 20, DEST_SHARED 38 |
| Below the Abbey | The Deeper Hollow | 1 | 143 | 1 | NOWALL 4, OVERLAP 1, PICINWALL 2, LOOSEDOOR 1, ITEM_BLOCKED 1, LOOT_UNREACH 58, FLOAT 33, HOVER 12, HUGE 26, INWALL 5, ONEWAY 1 |
| Below the Abbey | The Underlevel | 1 | 69 | 0 | NOWALL 2, PICINWALL 1, FOE_CUT 36, FOE_FLOAT 17, DUPDECOR 13 |
| Below the Abbey | The Orange Spire | 7 | 9 | 0 | NOWALL 3, LOOSEDOOR 1, LOOT_UNREACH 3, FOE_STACK 2 |
| Below the Abbey | Below the Abbey | 3 | 6 | 1 | CORRIDOR 4, ITEM_UNREACH 1, NPC_UNREACH 1, ONEWAY 1 |
| Below the Abbey | The Drowned Maze | 1 | 2 | 3 | DUPDECOR 2, NAMEPIC 3 |
| Below the Abbey | The Violet Tower | 1 | 0 | 1 | ONEWAY 1 |
| Khemetra, Yarrim and the sea | Khemetra | 2774 | 2780 | 4 | NOWALL 3, ROUTEBLOCK 2, ARRIVE_WALL 1, FOE_BLOCKED 2, ITEM_UNREACH 1, NPC_TALL 1, HOVER 2752, DUPDECOR 18, ONEWAY 4 |
| Khemetra, Yarrim and the sea | The Isle of Bells | 2 | 58 | 0 | LOOSEDOOR 55, FOE_BLOCKED 2, FOE_STACK 1 |
| Khemetra, Yarrim and the sea | Yarrim | 19 | 29 | 9 | NOWALL 3, LOOSEDOOR 2, ITEM_UNREACH 1, INWALL 23, ONEWAY 8, NAMEPIC 1 |
| Khemetra, Yarrim and the sea | The Open Sea | 7 | 8 | 0 | LOOSEDOOR 7, FOE_STACK 1 |
| Khemetra, Yarrim and the sea | Cinder Isle | 1 | 1 | 0 | FOE_STACK 1 |
| Oldhaven and the road | The Pilgrim’s Path | 92 | 259 | 63 | ROUTEBLOCK 7, CORRIDOR 26, FOE_BLOCKED 2, ITEM_UNREACH 12, NPC_UNREACH 71, INWALL 93, DUPDECOR 32, OUTSIDE 16, ONEWAY 63 |
| Oldhaven and the road | Oldhaven | 33 | 41 | 9 | NOWALL 3, DOOR_UNREACH 10, TERRBLOCK 1, NPC_UNREACH 2, HOVER 22, INWALL 3, ONEWAY 9 |
| Oldhaven and the road | The Oakwood | 4 | 35 | 4 | WEBFREE 2, ROUTEBLOCK 17, ARRIVE_WALL 1, FOE_BLOCKED 1, ITEM_UNREACH 12, HOVER 2, ONEWAY 4 |
| Oldhaven and the road | Saint Elen’s | 8 | 16 | 1 | OVERDOOR 2, FLOAT 10, HUGE 4, NAMEPIC 1 |
| The Blighted Lands | Sale | 32 | 132 | 22 | OVERLAP 2, WEBFREE 96, NPC_UNREACH 1, NPC_TALL 1, FLOAT 4, HOVER 4, INWALL 17, DUPDECOR 7, ONEWAY 22 |
| The Blighted Lands | Church of the Hollow Saint | 10 | 60 | 8 | WEBFREE 31, LOOSEDOOR 1, ITEM_UNREACH 1, NPC_TALL 5, FOE_CUT 1, FLOAT 14, HOVER 4, INWALL 2, DUPDECOR 1, ONEWAY 8 |
| The Blighted Lands | Vault of Maldrake | 8 | 58 | 1 | NOWALL 11, WEBFREE 35, NPC_TALL 12, ONEWAY 1 |
| The Blighted Lands | Rookery Mill | 10 | 50 | 8 | WEBFREE 7, FOE_CUT 1, FLOAT 38, INWALL 4, ONEWAY 7, NAMEPIC 1 |
| The Blighted Lands | Toll House | 10 | 38 | 11 | OVERLAP 1, WEBFREE 35, LOOSEDOOR 1, HOVER 1, ONEWAY 9, NAMEPIC 2 |
| The Blighted Lands | Ashenfold Farm | 10 | 38 | 7 | OVERLAP 1, WEBFREE 28, LOOSEDOOR 2, NPC_TALL 1, FOE_CUT 1, INWALL 3, DUPDECOR 2, ONEWAY 7 |
| The Blighted Lands | Pale Bridge | 10 | 36 | 7 | OVERLAP 2, WEBFREE 3, LOOSEDOOR 1, NPC_TALL 1, FLOAT 25, HOVER 1, INWALL 3, ONEWAY 7 |
| The Blighted Lands | Hollowbell Abbey | 10 | 25 | 6 | OVERLAP 2, WEBFREE 11, LOOSEDOOR 2, ITEM_BLOCKED 1, FOE_CUT 1, HOVER 1, INWALL 4, DUPDECOR 2, CONSOLE_WARN 1, ONEWAY 5, NAMEPIC 1 |
| The Blighted Lands | Gallowmere | 10 | 21 | 6 | WEBFREE 11, LOOSEDOOR 1, NPC_UNREACH 5, FOE_CUT 1, FLOAT 1, HOVER 1, INWALL 1, ONEWAY 6 |
| The Blighted Lands | Lanternrest Waystation | 10 | 19 | 4 | OVERLAP 1, WEBFREE 1, FLOAT 6, HOVER 7, INWALL 2, DUPDECOR 2, ONEWAY 4 |
| The Blighted Lands | Bone Orchard | 10 | 16 | 5 | WEBFREE 5, ITEM_BLOCKED 1, MISSINGPIC 1, FOE_CUT 1, FLOAT 4, HOVER 1, INWALL 1, DUPDECOR 2, ONEWAY 5 |
| The Known Lands | Greendale | 7 | 30 | 5 | NOWALL 3, ROUTEBLOCK 4, CORRIDOR 3, ITEM_UNREACH 2, NPC_UNREACH 3, DUPDECOR 15, ONEWAY 5 |
| The Known Lands | Ironhill Road | 4 | 23 | 2 | WEBFREE 2, ROUTEBLOCK 8, CORRIDOR 2, ARRIVE_WALL 1, ITEM_UNREACH 3, NPC_UNREACH 1, DUPDECOR 5, FOE_STACK 1, ONEWAY 2 |
| The Known Lands | Ironhill | 5 | 16 | 5 | NOWALL 4, CORRIDOR 3, FOE_BLOCKED 1, LOOT_UNREACH 2, NPC_UNREACH 1, INWALL 3, DUPDECOR 2, ONEWAY 5 |
| The Known Lands | Thornwood | 4 | 13 | 3 | ROUTEBLOCK 2, CORRIDOR 1, FOE_BLOCKED 1, ITEM_BLOCKED 1, DUPDECOR 8, ONEWAY 3 |
| The Known Lands | Greyfang Pass | 5 | 9 | 5 | WEBFREE 2, CORRIDOR 2, ARRIVE_WALL 1, HOVER 4, ONEWAY 5 |
| The Known Lands | Gandrick's Wood | 4 | 8 | 3 | CORRIDOR 1, ITEM_UNREACH 2, DUPDECOR 4, FOE_STACK 1, ONEWAY 3 |
| The Known Lands | Anaea | 4 | 6 | 3 | NOWALL 3, ITEM_UNREACH 2, DUPDECOR 1, ONEWAY 3 |
| The Known Lands | Ironhill Moor | 4 | 4 | 4 | ROUTEBLOCK 2, CORRIDOR 1, FOE_STACK 1, ONEWAY 3, NAMEPIC 1 |
| The Known Lands | Thornwick | 3 | 3 | 3 | NOWALL 1, CORRIDOR 1, DUPDECOR 1, ONEWAY 3 |
| The Known Lands | Golden Crypt | 1 | 3 | 0 | NOWALL 1, ITEM_BLOCKED 1, ITEMDEF 1 |
| The Known Lands | Burial Ground | 1 | 1 | 0 | FOE_BLOCKED 1 |
| The Pale Lands | The Pale Spire | 10 | 39 | 2 | OVERDOOR 2, OVERLAP 1, ARRIVE_WALL 3, TERRBLOCK 3, ITEM_UNREACH 3, LOOT_UNREACH 6, NPC_UNREACH 4, WDLOOSE 11, DUPDECOR 2, NAN 1, CONSOLE_WARN 3, ONEWAY 2 |
| The Pale Lands | The Never-Ending Tower | 1 | 2 | 0 | SIGNTEXT 2 |
| The deserts | The Sand Road | 3 | 39 | 2 | CORRIDOR 1, ARRIVE_WALL 7, ITEM_UNREACH 1, FLOAT 28, INWALL 2, ONEWAY 2 |
| The deserts | The Red Dunes | 5 | 26 | 6 | LOOT_UNREACH 1, FLOAT 24, INWALL 1, ONEWAY 6 |
| The deserts | The Violet Erg | 6 | 8 | 3 | CORRIDOR 5, ITEM_BLOCKED 1, ITEM_UNREACH 2, ONEWAY 3 |
| The deserts | The Golden Erg | 4 | 3 | 2 | CORRIDOR 3, ONEWAY 2 |
| The deserts | The White Dunes | 2 | 2 | 1 | CORRIDOR 2, ONEWAY 1 |
| The deserts | The Blue Dunes | 2 | 2 | 0 | CORRIDOR 1, ITEM_BLOCKED 1 |
| The deserts | The Flatlands | 1 | 0 | 1 | ONEWAY 1 |
| Wenlock | Wenlock | 73 | 200 | 4 | NOWALL 7, WEBFREE 3, ARRIVE_WALL 1, NPC_UNREACH 6, FLOAT 9, HOVER 58, INWALL 91, DUPDECOR 25, ONEWAY 4 |
| Wenlock | Wenlock Graveyard | 9 | 111 | 1 | WEBFREE 110, LOOSEDOOR 1, NAMEPIC 1 |
| Wenlock | The Well Maze | 4 | 62 | 0 | WEBFREE 13, LOOT_UNREACH 38, NPC_UNREACH 2, MISSINGPIC 4, DUPDECOR 5 |
| Wenlock | Blackbriar Wood | 8 | 12 | 4 | WEBFREE 2, CORRIDOR 2, ARRIVE_WALL 1, MISSINGPIC 5, NPC_TALL 1, INWALL 1, ONEWAY 4 |
| Wenlock | The Maze of Gardens | 1 | 8 | 1 | NOWALL 1, OVERLAP 4, ROUTEBLOCK 1, NPC_TALL 1, DUPDECOR 1, ONEWAY 1 |
| Wenlock | The Grey Charnel | 1 | 6 | 0 | NOWALL 1, WEBFREE 5 |
| Wenlock | The Black Barrow | 1 | 3 | 0 | NOWALL 1, WEBFREE 2 |
| Wenlock | Under the Well | 1 | 0 | 1 | ONEWAY 1 |
| Wenlock | The Red Ossuary | 1 | 1 | 0 | NOWALL 1 |
| Wenlock | The Pale Catacombs | 1 | 1 | 0 | WEBFREE 1 |
| global | global | 191 | 1 | 190 | LOAD404 1, UNBUILT 190 |
| **All** | | 3702 | 5886 | 490 | |

## Counts per check

| Check | Findings | Areas |
|---|---|---|
| NOWALL | 52 | 17 |
| OVERDOOR | 4 | 2 |
| OVERLAP | 15 | 9 |
| PICINWALL | 3 | 2 |
| WEBFREE | 405 | 21 |
| LOOSEDOOR | 107 | 13 |
| ROUTEBLOCK | 58 | 9 |
| CORRIDOR | 182 | 17 |
| DOOR_UNREACH | 10 | 1 |
| START_BLOCKED | 1 | 1 |
| ARRIVE_WALL | 16 | 8 |
| FOE_BLOCKED | 10 | 7 |
| ITEM_BLOCKED | 8 | 8 |
| TERRBLOCK | 4 | 2 |
| ITEM_UNREACH | 45 | 14 |
| LOOT_UNREACH | 187 | 7 |
| NPC_UNREACH | 125 | 12 |
| ITEMDEF | 1 | 1 |
| MISSINGPIC | 56 | 4 |
| SIGNTEXT | 2 | 1 |
| NPC_TALL | 27 | 9 |
| FOE_CUT | 48 | 8 |
| FOE_FLOAT | 17 | 1 |
| FLOAT | 236 | 13 |
| HOVER | 3137 | 15 |
| SINK | 34 | 1 |
| HUGE | 30 | 2 |
| INWALL | 759 | 19 |
| WDLOOSE | 11 | 1 |
| DUPDECOR | 266 | 22 |
| FOE_STACK | 8 | 7 |
| OUTSIDE | 16 | 1 |
| NAN | 1 | 1 |
| CONSOLE_WARN | 4 | 2 |
| LOAD404 | 1 | 1 |
| ONEWAY (review) | 251 | 40 |
| DEST_SHARED (review) | 38 | 1 |
| NAMEPIC (review) | 11 | 8 |
| UNBUILT (review) | 190 | 1 |

## Top 40 findings per area

Ordered by check (wall pictures, doors and routes first, cosmetic last), then level and position.

### Khemetra (2784 findings in 2774 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 44 | Khemetra, the Golden City | sign_hsown | 188,312 | wall side 0,-1 is open |
| NOWALL | 44 | Khemetra, the Golden City | sign_hsown | 199,313 | wall side 0,-1 is open |
| NOWALL | 44 | Khemetra, the Golden City | sign_hsown | 210,313 | wall side 0,-1 is open |
| ROUTEBLOCK | 44 | Khemetra, the Golden City | pstump | 33,216 | door at 32,216 to 11536 |
| ROUTEBLOCK | 44 | Khemetra, the Golden City | pstump | 33,217 | door at 32,217 to 11536 |
| ARRIVE_WALL | 261 | Ishkander's Study | portal | 7,10 | to 260 lands on 39,2 ("w") |
| FOE_BLOCKED | 232 | The Old Granary | rat | 6,1 | on sacks |
| FOE_BLOCKED | 240 | The Bath Cellar | ghost | 6,1 | on sacks |
| ITEM_UNREACH | 44 | Khemetra, the Golden City | herb_dandelion | 371,375 |  |
| NPC_TALL | 44 | Khemetra, the Golden City | kh_city1_3 | 330,334 | h 1.50 npc kh_riddle |
| HOVER | 238 | The Musicians House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 241 | A Quiet House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 244 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 248 | A Nobleman's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 252 | A Magical House | kh_int2_1 | 6,3 | gap 0.78 (pad 0.00, h 0.50, bob 0.80) |
| HOVER | 254 | A Cat Lover's House | kh_int6_1 | 4,1 | gap 0.27 (pad 0.00, h 0.75, bob 0.30) |
| HOVER | 258 | A Priest's House | kh_int6_1 | 4,1 | gap 0.27 (pad 0.00, h 0.75, bob 0.30) |
| HOVER | 1034 | A Musician's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 1035 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 1036 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 1039 | A Magical House | kh_int2_1 | 6,3 | gap 0.78 (pad 0.00, h 0.50, bob 0.80) |
| HOVER | 1041 | A Priest's House | kh_int6_1 | 4,1 | gap 0.27 (pad 0.00, h 0.75, bob 0.30) |
| HOVER | 1049 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 1053 | A Priest's House | kh_int6_1 | 4,1 | gap 0.27 (pad 0.00, h 0.75, bob 0.30) |
| HOVER | 1057 | A Musician's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 1060 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 1062 | A Priest's House | kh_int6_1 | 4,1 | gap 0.27 (pad 0.00, h 0.75, bob 0.30) |
| HOVER | 1063 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| DUPDECOR | 260 | The Cisterns beneath Khemetra | bones | 30,7 |  |
| DUPDECOR | 260 | The Cisterns beneath Khemetra | bones | 16,27 |  |
| DUPDECOR | 1705 | A Messy House | corpse0 | 2,4 |  |
| DUPDECOR | 1967 | A Scholar's House | corpse2 | 6,4 |  |
| DUPDECOR | 2307 | A Potter's House | corpse3 | 5,3 |  |
| DUPDECOR | 2598 | A Messy House | corpse0 | 4,1 |  |
| DUPDECOR | 2991 | A Worker's House | corpse3 | 1,3 |  |
| DUPDECOR | 3047 | A Scholar's House | corpse1 | 1,2 |  |
| ONEWAY | 270 | The Temple Dungeons | portal | 4,5 | to 44 Khemetra, the Golden City, no way back |
| ONEWAY | 3318 | Small House, Khemetra | portal | 5,7 | to 44 Khemetra, the Golden City, no way back |
| ONEWAY | 3319 | Medium House, Khemetra | portal | 5,10 | to 44 Khemetra, the Golden City, no way back |
| ONEWAY | 3320 | Large Mansion, Khemetra | portal | 18,18 | to 44 Khemetra, the Golden City, no way back |

### Hollow Grasslands (1353 findings in 251 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| LOOSEDOOR | 470 | The Hollow Grasslands | hg_arch | 112,23 |  |
| LOOSEDOOR | 470 | The Hollow Grasslands | hg_arch | 40,30 |  |
| LOOSEDOOR | 470 | The Hollow Grasslands | hg_arch | 112,45 |  |
| LOOSEDOOR | 470 | The Hollow Grasslands | hg_arch | 40,50 |  |
| LOOSEDOOR | 470 | The Hollow Grasslands | hg_arch | 75,67 |  |
| LOOSEDOOR | 470 | The Hollow Grasslands | hg_arch | 75,89 |  |
| LOOSEDOOR | 470 | The Hollow Grasslands | hg_arch | 26,90 |  |
| LOOSEDOOR | 470 | The Hollow Grasslands | hg_arch | 124,108 |  |
| ROUTEBLOCK | 4881 | The Weavers’ Guildhall | kh_int4_3 | 6,1 | door at 6,0 to 4882 |
| ROUTEBLOCK | 4886 | The Warp Cellar | kh_int2_4 | 9,1 | door at 9,0 to 4887 |
| ROUTEBLOCK | 5005 | The Herbalist | hgtb_plant_lacecoral | 4,2 | door at 4,0 to 5016 |
| ROUTEBLOCK | 5010 | The Lamp Store | hgtb_stall_sage_herbs | 4,2 | door at 4,0 to 5015 |
| ROUTEBLOCK | 5083 | A Weaving Hall | hgtb_plant_potvine | 6,1 | door at 6,0 to 5128 |
| ROUTEBLOCK | 5088 | A Thread Library | kh_int1_3 | 8,1 | door at 8,0 to 5129 |
| ROUTEBLOCK | 5098 | A Map Room | hgtb_furn_cabinet | 6,1 | door at 6,0 to 5131 |
| ROUTEBLOCK | 5103 | A Reed Storehouse (2) | hgtb_furn_bookshelf | 8,1 | door at 8,0 to 5132 |
| CORRIDOR | 4864 | Brollo's Pearl Shop | hg_waxbarrel | 9,2 |  |
| CORRIDOR | 4865 | The Root Cellar | hg_waxbarrel | 1,4 |  |
| CORRIDOR | 4865 | The Root Cellar | hg_waxbarrel | 9,4 |  |
| CORRIDOR | 4880 | Granny Murrp’s House | hgtb_furn_hearth | 4,2 |  |
| CORRIDOR | 4888 | The Dyers’ House | hgtb_deco_fountain | 4,2 |  |
| CORRIDOR | 4889 | The Reed-Cutter’s Hut | hgtb_plant_potvine | 2,1 |  |
| CORRIDOR | 4891 | The Reed Trader | barrel | 1,3 |  |
| CORRIDOR | 4891 | The Reed Trader | crate | 7,3 |  |
| START_BLOCKED | 5180 | Rug Beater |  | 5,5 | g=0 |
| ITEM_BLOCKED | 4885 | The Spindle Room | hgjelly | 4,3 | g=0 |
| ITEM_UNREACH | 470 | The Hollow Grasslands | greatermana | 119,38 |  |
| ITEM_UNREACH | 470 | The Hollow Grasslands | herb_nettle | 18,104 |  |
| LOOT_UNREACH | 4865 | The Root Cellar | hg_waxbarrel | 1,4 |  |
| LOOT_UNREACH | 4865 | The Root Cellar | hg_waxbarrel | 9,4 |  |
| LOOT_UNREACH | 4872 | The Drowned Archive | hg_chestweed | 1,7 |  |
| LOOT_UNREACH | 4872 | The Drowned Archive | hg_chestjelly | 7,7 |  |
| LOOT_UNREACH | 4890 | The Last Thread (inn) | barrel | 1,2 |  |
| LOOT_UNREACH | 4890 | The Last Thread (inn) | barrel | 11,2 |  |
| LOOT_UNREACH | 4891 | The Reed Trader | crate | 7,3 |  |
| LOOT_UNREACH | 4921 | The Feast Kitchen | hg_waxbarrel | 9,1 |  |
| NPC_UNREACH | 482 | Ulb | hg_npc6 | 79,59 | npc hgxulb_blem |
| NPC_UNREACH | 4861 | Mother Glubba's House | hg_npc1 | 3,2 | npc hgn_glubba |
| NPC_UNREACH | 4878 | The Cloth Merchant | hg_npc5 | 4,1 | npc hgx_ex_cloth |
| NPC_UNREACH | 4890 | The Last Thread (inn) | hg_npc5 | 6,2 | npc hgxulb_innkeeper |

### The Pilgrim’s Path (322 findings in 92 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| ROUTEBLOCK | 403 | The Pilgrim’s Path | gtree3 | 92,281 | door at 93,281 to 7102 |
| ROUTEBLOCK | 406 | The Pilgrim’s Path | gtree0 | 92,408 | door at 93,408 to 7105 |
| ROUTEBLOCK | 407 | The Pilgrim’s Path | gtree3 | 92,165 | door at 93,165 to 7106 |
| ROUTEBLOCK | 409 | The Pilgrim’s Path, over the mountains | gtree6 | 92,516 | door at 93,516 to 7108 |
| ROUTEBLOCK | 414 | The Pilgrim’s Path, over the mountains | gtree0 | 79,531 | mound at 80,531 to 11312 |
| ROUTEBLOCK | 417 | The Pilgrim’s Path | gtree6 | 92,283 | door at 93,283 to 7115 |
| ROUTEBLOCK | 420 | The Pilgrim’s Path | gtree3 | 92,395 | door at 93,395 to 7118 |
| CORRIDOR | 11201 | The Ivy Chapel | rs_brick2 | 25,7 |  |
| CORRIDOR | 11211 | The Mossy Vault | rs_brick2 | 17,8 |  |
| CORRIDOR | 11216 | The Green Hall | rs_brick1 | 7,12 |  |
| CORRIDOR | 11218 | The Vine-Choked Cellar | rs_brick1 | 25,4 |  |
| CORRIDOR | 11235 | The Vine-Choked Cellar | rs_brick1 | 11,6 |  |
| CORRIDOR | 11256 | The Vine-Choked Cellar | rs_brick1 | 8,13 |  |
| CORRIDOR | 11280 | The Forgotten Shrine | rs_brick2 | 25,16 |  |
| CORRIDOR | 11280 | The Forgotten Shrine | rs_brick2 | 21,20 |  |
| FOE_BLOCKED | 412 | The Pilgrim’s Path, over the mountains | wolf | 83,366 | on rocks |
| FOE_BLOCKED | 417 | The Pilgrim’s Path | wolf | 92,283 | on gtree6 |
| ITEM_UNREACH | 400 | The Pilgrim’s Path | manadraught | 100,476 |  |
| ITEM_UNREACH | 403 | The Pilgrim’s Path | herb_comfrey | 100,604 |  |
| ITEM_UNREACH | 406 | The Pilgrim’s Path | greatermana | 100,153 |  |
| ITEM_UNREACH | 407 | The Pilgrim’s Path | greatermana | 81,583 |  |
| ITEM_UNREACH | 409 | The Pilgrim’s Path, over the mountains | herb_mint | 57,307 |  |
| ITEM_UNREACH | 412 | The Pilgrim’s Path, over the mountains | herb_sage | 67,67 |  |
| ITEM_UNREACH | 416 | The Pilgrim’s Path | herb_marigold | 100,777 |  |
| ITEM_UNREACH | 417 | The Pilgrim’s Path | manadraught | 100,475 |  |
| NPC_UNREACH | 401 | The Pilgrim’s Path | kh_ohgard1_3 | 101,457 | npc lp_bench |
| NPC_UNREACH | 405 | The Pilgrim’s Path | kh_ohgard1_3 | 103,266 | npc lp_bench |
| NPC_UNREACH | 405 | The Pilgrim’s Path | grave2 | 97,557 | npc epitaph |
| NPC_UNREACH | 405 | The Pilgrim’s Path | grave2 | 99,557 | npc epitaph |
| NPC_UNREACH | 405 | The Pilgrim’s Path | grave | 101,557 | npc epitaph |
| NPC_UNREACH | 405 | The Pilgrim’s Path | cross | 103,557 | npc epitaph |
| NPC_UNREACH | 405 | The Pilgrim’s Path | cross | 97,559 | npc epitaph |
| NPC_UNREACH | 405 | The Pilgrim’s Path | cross | 99,559 | npc epitaph |
| INWALL | 401 | The Pilgrim’s Path | kh_ohgard1_3 | 101,457 | g=28694 |
| INWALL | 405 | The Pilgrim’s Path | kh_ohgard1_3 | 103,266 | g=28714 |
| INWALL | 405 | The Pilgrim’s Path | ironfence | 101,556 | g=28714 |
| INWALL | 405 | The Pilgrim’s Path | ironfence | 102,556 | g=28714 |
| INWALL | 405 | The Pilgrim’s Path | ironfence | 103,556 | g=28714 |
| INWALL | 405 | The Pilgrim’s Path | grave | 101,557 | g=28714 |
| INWALL | 405 | The Pilgrim’s Path | cross | 103,557 | g=28714 |

### Wenlock (204 findings in 73 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 496 | Wenlock | sign_hsown | 84,12 | wall side -1,0 is open |
| NOWALL | 496 | Wenlock | sign_wlnote | 64,16 | wall side 0,1 is open |
| NOWALL | 496 | Wenlock | sign_hsown | 84,18 | wall side -1,0 is open |
| NOWALL | 496 | Wenlock | sign_hsown | 84,24 | wall side -1,0 is open |
| NOWALL | 496 | Wenlock | sign_wlnote | 55,36 | wall side 0,1 is open |
| NOWALL | 496 | Wenlock | sign_wlnote | 77,86 | wall side 0,1 is open |
| NOWALL | 496 | Wenlock | sign_wlnote | 86,87 | wall side 0,1 is open |
| WEBFREE | 7098 | Old Bracken's Den | gy_web | 13,3 |  |
| WEBFREE | 7098 | Old Bracken's Den | gy_web | 3,7 |  |
| WEBFREE | 7098 | Old Bracken's Den | gy_web | 11,9 |  |
| ARRIVE_WALL | 496 | Wenlock | portal | 97,50 | to 490 lands on 2,2 ("̋") |
| NPC_UNREACH | 7010 | The Plough and Pigeon | kh_ohfolk3_5 | 7,2 | npc wli_k_inn |
| NPC_UNREACH | 7012 | The Wenlock Library | wl2_library_0 | 13,9 | npc wli_shelf7 |
| NPC_UNREACH | 7033 | The Willows | kh_int5_4 | 2,2 | npc wlt_rug |
| NPC_UNREACH | 7033 | The Willows | wl2_home_1 | 6,2 | npc wlt_val |
| NPC_UNREACH | 7054 | Bluebell Cottage | wl2_home_0 | 5,2 | npc wlt_cup |
| NPC_UNREACH | 7054 | Bluebell Cottage | wl2_home_1 | 7,2 | npc wlt_val |
| FLOAT | 7010 | The Plough and Pigeon | lamp | 4,5 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7010 | The Plough and Pigeon | lamp | 10,5 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7010 | The Plough and Pigeon | lamp | 7,7 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7034 | Wick's Chandlery | lamp | 4,4 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7043 | Church View | wl2_hall_1 | 6,4 | gap 0.25 (pad 0.00, h 1.08, bob 0.25) |
| FLOAT | 7090 | The Inn Cellar | lamp | 4,5 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7090 | The Inn Cellar | lamp | 10,5 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7092 | Wenlock Mill | wl2_mill_0 | 7,1 | gap 0.06 (pad 0.04, h 1.38, bob 0.00) |
| HOVER | 7001 | A Warm Cottage | wl2_hall_1 | 2,1 | gap 0.25 (pad 0.00, h 0.96, bob 0.25) |
| HOVER | 7001 | A Warm Cottage | wl2_library_5 | 6,1 | gap 0.35 (pad 0.00, h 0.96, bob 0.35) |
| HOVER | 7002 | Fenn's Forge | wl2_armour_1 | 11,5 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| HOVER | 7003 | A Wool Merchant's House | wl2_hall_1 | 5,1 | gap 0.25 (pad 0.00, h 1.08, bob 0.25) |
| HOVER | 7005 | A Retired Soldier's House | wl2_hall_1 | 7,1 | gap 0.25 (pad 0.00, h 0.96, bob 0.25) |
| HOVER | 7006 | A Farmer's Kitchen | wl2_hall_1 | 5,1 | gap 0.25 (pad 0.00, h 0.96, bob 0.25) |
| HOVER | 7009 | A Brook Fisher's Cottage | wl2_library_5 | 7,1 | gap 0.35 (pad 0.00, h 0.96, bob 0.35) |
| HOVER | 7011 | A Widow's Parlour | wl2_hall_1 | 2,1 | gap 0.25 (pad 0.00, h 0.96, bob 0.25) |
| INWALL | 7001 | A Warm Cottage | wl2_home_5 | 0,4 | g=23712 |
| INWALL | 7002 | Fenn's Forge | crate | 12,3 | g=28684 |
| INWALL | 7002 | Fenn's Forge | crate | 0,4 | g=28686 |
| INWALL | 7003 | A Wool Merchant's House | wl2_home_5 | 8,3 | g=23712 |
| INWALL | 7004 | Crumb's Bakery | crate | 0,1 | g=28687 |
| INWALL | 7004 | Crumb's Bakery | crate | 10,1 | g=28687 |
| INWALL | 7004 | Crumb's Bakery | sacks | 10,2 | g=28687 |

### global (191 findings in 191 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| LOAD404 |  |  |  |  | 404 assets/af_hagblind.png |
| UNBUILT | 6311 |  |  |  | KH_LAZY never builds 6311 to 6649 (339 levels) and no door leads there |
| UNBUILT | 6706 |  |  |  | KH_LAZY never builds 6706 to 6709 (4 levels) and no door leads there |
| UNBUILT | 21011 |  |  |  | KH_LAZY never builds 21011 and no door leads there |
| UNBUILT | 21016 |  |  |  | KH_LAZY never builds 21016 and no door leads there |
| UNBUILT | 21024 |  |  |  | KH_LAZY never builds 21024 and no door leads there |
| UNBUILT | 21101 |  |  |  | KH_LAZY never builds 21101 and no door leads there |
| UNBUILT | 21127 |  |  |  | KH_LAZY never builds 21127 and no door leads there |
| UNBUILT | 21144 |  |  |  | KH_LAZY never builds 21144 and no door leads there |
| UNBUILT | 21185 |  |  |  | KH_LAZY never builds 21185 and no door leads there |
| UNBUILT | 21241 |  |  |  | KH_LAZY never builds 21241 and no door leads there |
| UNBUILT | 21288 |  |  |  | KH_LAZY never builds 21288 and no door leads there |
| UNBUILT | 21314 |  |  |  | KH_LAZY never builds 21314 and no door leads there |
| UNBUILT | 21369 |  |  |  | KH_LAZY never builds 21369 and no door leads there |
| UNBUILT | 21384 |  |  |  | KH_LAZY never builds 21384 and no door leads there |
| UNBUILT | 21429 |  |  |  | KH_LAZY never builds 21429 and no door leads there |
| UNBUILT | 21447 |  |  |  | KH_LAZY never builds 21447 and no door leads there |
| UNBUILT | 21473 |  |  |  | KH_LAZY never builds 21473 and no door leads there |
| UNBUILT | 21526 |  |  |  | KH_LAZY never builds 21526 and no door leads there |
| UNBUILT | 21552 |  |  |  | KH_LAZY never builds 21552 and no door leads there |
| UNBUILT | 21598 |  |  |  | KH_LAZY never builds 21598 and no door leads there |
| UNBUILT | 21652 |  |  |  | KH_LAZY never builds 21652 and no door leads there |
| UNBUILT | 21691 |  |  |  | KH_LAZY never builds 21691 and no door leads there |
| UNBUILT | 21775 |  |  |  | KH_LAZY never builds 21775 and no door leads there |
| UNBUILT | 21816 |  |  |  | KH_LAZY never builds 21816 and no door leads there |
| UNBUILT | 21838 |  |  |  | KH_LAZY never builds 21838 and no door leads there |
| UNBUILT | 21843 |  |  |  | KH_LAZY never builds 21843 and no door leads there |
| UNBUILT | 21857 |  |  |  | KH_LAZY never builds 21857 and no door leads there |
| UNBUILT | 21898 |  |  |  | KH_LAZY never builds 21898 and no door leads there |
| UNBUILT | 22337 |  |  |  | KH_LAZY never builds 22337 and no door leads there |
| UNBUILT | 22339 |  |  |  | KH_LAZY never builds 22339 and no door leads there |
| UNBUILT | 22357 |  |  |  | KH_LAZY never builds 22357 and no door leads there |
| UNBUILT | 22443 |  |  |  | KH_LAZY never builds 22443 and no door leads there |
| UNBUILT | 22687 |  |  |  | KH_LAZY never builds 22687 and no door leads there |
| UNBUILT | 22737 |  |  |  | KH_LAZY never builds 22737 and no door leads there |
| UNBUILT | 22745 |  |  |  | KH_LAZY never builds 22745 and no door leads there |
| UNBUILT | 22754 |  |  |  | KH_LAZY never builds 22754 and no door leads there |
| UNBUILT | 22825 |  |  |  | KH_LAZY never builds 22825 and no door leads there |
| UNBUILT | 22844 |  |  |  | KH_LAZY never builds 22844 and no door leads there |
| UNBUILT | 22849 |  |  |  | KH_LAZY never builds 22849 and no door leads there |

### Sale (154 findings in 32 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| OVERLAP | 600 | Sale | bl_win_a | 58,20 | sign_sabelfry |
| OVERLAP | 600 | Sale | bl_win_a | 45,36 | sign_sa7216 |
| WEBFREE | 600 | Sale | gy_web | 30,5 |  |
| WEBFREE | 600 | Sale | gy_web | 50,5 |  |
| WEBFREE | 600 | Sale | gy_web | 26,6 |  |
| WEBFREE | 600 | Sale | gy_web | 64,8 |  |
| WEBFREE | 600 | Sale | gy_web | 54,10 |  |
| WEBFREE | 600 | Sale | gy_web | 11,20 |  |
| WEBFREE | 600 | Sale | gy_web | 49,21 |  |
| WEBFREE | 600 | Sale | gy_web | 14,23 |  |
| NPC_UNREACH | 7216 | The Last Orders | kh_ohfolk3_5 | 7,2 | npc sa_k_tavern |
| NPC_TALL | 600 | Sale | sa_gibbet | 38,33 | h 2.76 npc sa_gibbet |
| FLOAT | 7210 | The Gilded Eye, Jewellers | lamp | 4,4 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7216 | The Last Orders | lamp | 4,5 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7216 | The Last Orders | lamp | 10,5 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 7216 | The Last Orders | lamp | 7,7 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| HOVER | 7238 | The Watchman's Billet | wl2_hall_1 | 5,1 | gap 0.25 (pad 0.00, h 0.96, bob 0.25) |
| HOVER | 7239 | The Wool Merchant's House | wl2_hall_1 | 3,1 | gap 0.25 (pad 0.00, h 1.08, bob 0.25) |
| HOVER | 7243 | The Gravedigger's Cottage | wl2_hall_1 | 4,1 | gap 0.25 (pad 0.00, h 1.08, bob 0.25) |
| HOVER | 7243 | The Gravedigger's Cottage | wl2_hall_1 | 1,5 | gap 0.22 (pad 0.00, h 0.96, bob 0.22) |
| INWALL | 600 | Sale | gy_wcross | 65,58 | g=27764 |
| INWALL | 600 | Sale | gy_bones | 64,59 | g=27764 |
| INWALL | 7209 | The Dead Letter Scriptorium | crate | 0,1 | g=23713 |
| INWALL | 7209 | The Dead Letter Scriptorium | crate | 10,1 | g=23713 |
| INWALL | 7210 | The Gilded Eye, Jewellers | crate | 0,1 | g=28684 |
| INWALL | 7210 | The Gilded Eye, Jewellers | crate | 8,1 | g=28684 |
| INWALL | 7213 | Crust and Cleaver | crate | 0,1 | g=28684 |
| INWALL | 7215 | Vesper's Alembic | crate | 10,1 | g=28684 |
| DUPDECOR | 7216 | The Last Orders | crate | 4,3 |  |
| DUPDECOR | 7216 | The Last Orders | crate | 5,3 |  |
| DUPDECOR | 7216 | The Last Orders | crate | 7,3 |  |
| DUPDECOR | 7216 | The Last Orders | crate | 9,3 |  |
| DUPDECOR | 7216 | The Last Orders | crate | 10,3 |  |
| DUPDECOR | 7216 | The Last Orders | crate | 2,8 |  |
| DUPDECOR | 7229 | The Reeve's House | crate | 2,1 |  |
| ONEWAY | 604 | The Blighted Road | portal | 5,8 | to 600 Sale, no way back |
| ONEWAY | 605 | The Blighted Road | portal | 5,8 | to 600 Sale, no way back |
| ONEWAY | 606 | The Blighted Road | portal | 5,8 | to 600 Sale, no way back |
| ONEWAY | 607 | The Blighted Road | portal | 5,8 | to 600 Sale, no way back |
| ONEWAY | 608 | The Blighted Road | portal | 5,8 | to 600 Sale, no way back |

### The Deeper Hollow (144 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 475 | The Deeper Hollow | art_hgdf_vine0 | 100,57 | wall side -1,0 is open |
| NOWALL | 475 | The Deeper Hollow | art_hgdf_vine1 | 23,118 | wall side 0,-1 is open |
| NOWALL | 475 | The Deeper Hollow | art_hgdf_vine2 | 41,122 | wall side 0,-1 is open |
| NOWALL | 475 | The Deeper Hollow | art_hgdf_vine3 | 17,132 | wall side -1,0 is open |
| OVERLAP | 475 | The Deeper Hollow | art_hs_page | 173,131 | art_hgdf_wsym3 |
| PICINWALL | 475 | The Deeper Hollow | hgpa_dd3 | 70,114 | g=22488 |
| PICINWALL | 475 | The Deeper Hollow | hgpa_dd0 | 30,152 | g=22504 |
| LOOSEDOOR | 475 | The Deeper Hollow | hpa_arch | 175,191 |  |
| ITEM_BLOCKED | 475 | The Deeper Hollow | hgcomb | 101,200 | g=22485 |
| LOOT_UNREACH | 475 | The Deeper Hollow | hg_chestweed | 13,3 |  |
| LOOT_UNREACH | 475 | The Deeper Hollow | hg_chestwax | 63,5 |  |
| LOOT_UNREACH | 475 | The Deeper Hollow | hg_chestjelly | 177,9 |  |
| LOOT_UNREACH | 475 | The Deeper Hollow | hg_chestwax | 197,11 |  |
| LOOT_UNREACH | 475 | The Deeper Hollow | hg_chestwax | 3,13 |  |
| LOOT_UNREACH | 475 | The Deeper Hollow | hg_chestwax | 73,13 |  |
| LOOT_UNREACH | 475 | The Deeper Hollow | hg_chestweed | 13,25 |  |
| LOOT_UNREACH | 475 | The Deeper Hollow | hg_chestweed | 107,27 |  |
| FLOAT | 475 | The Deeper Hollow | hgdfc_lilac1 | 56,3 | gap 0.83 (pad 0.15, h 0.64, bob 0.73) |
| FLOAT | 475 | The Deeper Hollow | icn_hgdi_hut6 | 115,12 | gap 0.14 (pad 0.09, h 1.50, bob 0.00) |
| FLOAT | 475 | The Deeper Hollow | icn_hgdi_hut6 | 119,12 | gap 0.14 (pad 0.09, h 1.50, bob 0.00) |
| FLOAT | 475 | The Deeper Hollow | hgdfc_pink1 | 93,14 | gap 0.62 (pad 0.00, h 0.62, bob 0.62) |
| FLOAT | 475 | The Deeper Hollow | hgdfc_aqua2 | 96,15 | gap 0.85 (pad 0.04, h 0.66, bob 0.83) |
| FLOAT | 475 | The Deeper Hollow | icn_hgdi_hut7 | 138,24 | gap 0.13 (pad 0.09, h 1.50, bob 0.00) |
| FLOAT | 475 | The Deeper Hollow | hgdfc_lilac2 | 29,27 | gap 0.76 (pad 0.04, h 0.76, bob 0.73) |
| FLOAT | 475 | The Deeper Hollow | icn_hgdi_hut1 | 118,27 | gap 0.22 (pad 0.15, h 1.50, bob 0.00) |
| HOVER | 475 | The Deeper Hollow | hgdfc_pink1 | 56,1 | gap 0.65 (pad 0.00, h 0.62, bob 0.65) |
| HOVER | 475 | The Deeper Hollow | hgdfc_pink1 | 58,1 | gap 0.80 (pad 0.00, h 0.62, bob 0.80) |
| HOVER | 475 | The Deeper Hollow | hgdfc_cream1 | 55,5 | gap 0.79 (pad 0.05, h 0.58, bob 0.77) |
| HOVER | 475 | The Deeper Hollow | hgdfc_pink1 | 23,33 | gap 0.80 (pad 0.00, h 0.62, bob 0.80) |
| HOVER | 475 | The Deeper Hollow | hgdfc_pink1 | 25,33 | gap 0.67 (pad 0.00, h 0.62, bob 0.67) |
| HOVER | 475 | The Deeper Hollow | hgdfc_pink1 | 154,45 | gap 0.82 (pad 0.00, h 0.62, bob 0.82) |
| HOVER | 475 | The Deeper Hollow | hgdfc_aqua2 | 151,48 | gap 0.86 (pad 0.04, h 0.66, bob 0.84) |
| HOVER | 475 | The Deeper Hollow | hgdfc_aqua2 | 149,53 | gap 0.68 (pad 0.04, h 0.66, bob 0.66) |
| HUGE | 475 | The Deeper Hollow | hpbp13 | 157,5 | drawn 1.37 wide, 1.50 high (ceiling 2.70) |
| HUGE | 475 | The Deeper Hollow | hpbp25 | 125,7 | drawn 1.37 wide, 1.50 high (ceiling 2.70) |
| HUGE | 475 | The Deeper Hollow | hpbp16 | 75,11 | drawn 1.37 wide, 1.50 high (ceiling 2.70) |
| HUGE | 475 | The Deeper Hollow | hpbp15 | 25,13 | drawn 1.37 wide, 1.50 high (ceiling 2.70) |
| HUGE | 475 | The Deeper Hollow | hpbp10 | 41,15 | drawn 1.37 wide, 1.50 high (ceiling 2.70) |
| HUGE | 475 | The Deeper Hollow | hpbp4 | 89,18 | drawn 1.37 wide, 1.50 high (ceiling 2.70) |
| HUGE | 475 | The Deeper Hollow | hpbp17 | 109,21 | drawn 1.37 wide, 1.50 high (ceiling 2.70) |

### Wenlock Graveyard (112 findings in 9 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 5,7 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 43,7 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 19,10 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 25,10 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 43,10 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 45,10 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 5,13 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 7,13 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 41,13 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 39,19 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 63,19 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 47,22 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 39,25 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 19,31 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 55,37 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 23,39 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 15,42 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 20,44 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 9,46 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 49,46 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 22,51 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 9,52 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 7,58 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 17,58 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 61,58 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 21,59 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 23,61 |  |
| WEBFREE | 530 | Wenlock Graveyard | gy_web | 47,64 |  |
| WEBFREE | 531 | Lady Aldith's Crypt | gy_web | 9,4 |  |
| WEBFREE | 531 | Lady Aldith's Crypt | gy_web | 15,4 |  |
| WEBFREE | 531 | Lady Aldith's Crypt | gy_web | 3,8 |  |
| WEBFREE | 531 | Lady Aldith's Crypt | gy_web | 21,8 |  |
| WEBFREE | 531 | Lady Aldith's Crypt | gy_web | 3,14 |  |
| WEBFREE | 531 | Lady Aldith's Crypt | gy_web | 21,14 |  |
| WEBFREE | 531 | Lady Aldith's Crypt | gy_web | 8,16 |  |
| WEBFREE | 531 | Lady Aldith's Crypt | gy_web | 16,16 |  |
| WEBFREE | 536 | The Vane Tomb | gy_web | 4,2 |  |
| WEBFREE | 536 | The Vane Tomb | gy_web | 6,2 |  |
| LOOSEDOOR | 530 | Wenlock Graveyard | gy_arch | 52,10 |  |
| NAMEPIC | 530 | Wenlock Graveyard | gy_tomb | 8,22 | "A weathered stone" is stone, picture is grave |

### The Underlevel (69 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 476 | The Underlevel | msgr_D | 120,42 | wall side 0,-1 is open |
| NOWALL | 476 | The Underlevel | msgr_E | 97,78 | wall side 0,-1 is open |
| PICINWALL | 476 | The Underlevel | hgpd_hook | 93,44 | g=22531 |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 157,5 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgdemon3 | 141,10 | top at 1.34 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgdemon2 | 70,15 | top at 1.43 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 107,22 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 93,31 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 57,35 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 131,44 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 74,45 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgdemon8 | 140,48 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgdemon1 | 188,50 | top at 1.41 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgdemon7 | 145,53 | top at 1.34 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgdemon9 | 98,55 | top at 1.40 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 72,58 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgdemon5 | 97,58 | top at 1.22 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 72,63 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgdemon0 | 47,80 | top at 1.49 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 191,83 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 170,91 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 22,95 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 23,95 | top at 1.15 (window about 1.0) |
| FOE_CUT | 476 | The Underlevel | hgusl9 | 33,97 | top at 1.15 (window about 1.0) |
| FOE_FLOAT | 476 | The Underlevel | hgusl3 | 165,24 | gap 0.05 (pad 0.07) |
| FOE_FLOAT | 476 | The Underlevel | hgusl3 | 92,26 | gap 0.05 (pad 0.07) |
| FOE_FLOAT | 476 | The Underlevel | hgusl3 | 71,45 | gap 0.05 (pad 0.07) |
| FOE_FLOAT | 476 | The Underlevel | hgusl3 | 72,48 | gap 0.05 (pad 0.07) |
| FOE_FLOAT | 476 | The Underlevel | hgusl3 | 102,55 | gap 0.05 (pad 0.07) |
| FOE_FLOAT | 476 | The Underlevel | hgusl3 | 57,60 | gap 0.05 (pad 0.07) |
| FOE_FLOAT | 476 | The Underlevel | hgusl3 | 15,96 | gap 0.05 (pad 0.07) |
| FOE_FLOAT | 476 | The Underlevel | hgusl3 | 55,98 | gap 0.05 (pad 0.07) |
| DUPDECOR | 476 | The Underlevel | art_hgxprop2 | 113,4 |  |
| DUPDECOR | 476 | The Underlevel | art_hgxprop2_m | 41,34 |  |
| DUPDECOR | 476 | The Underlevel | art_hgxprop2 | 103,37 |  |
| DUPDECOR | 476 | The Underlevel | art_hgxprop2_m | 77,59 |  |
| DUPDECOR | 476 | The Underlevel | art_hgxprop2 | 64,100 |  |
| DUPDECOR | 476 | The Underlevel | hgpd_candle_m | 116,121 |  |
| DUPDECOR | 476 | The Underlevel | art_hgxprop2 | 172,122 |  |
| DUPDECOR | 476 | The Underlevel | hgq_chain | 137,125 |  |

### Church of the Hollow Saint (68 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 9631 | The Nave of the Hollow Saint | gy_web | 1,1 |  |
| WEBFREE | 9631 | The Nave of the Hollow Saint | gy_web | 19,1 |  |
| WEBFREE | 9632 | The Crypt of the Hollow Saint | gy_web | 1,1 |  |
| WEBFREE | 9632 | The Crypt of the Hollow Saint | gy_web | 19,1 |  |
| WEBFREE | 9632 | The Crypt of the Hollow Saint | gy_web | 1,13 |  |
| WEBFREE | 9632 | The Crypt of the Hollow Saint | gy_web | 19,13 |  |
| WEBFREE | 9633 | The Belfry | gy_web | 1,1 |  |
| WEBFREE | 9633 | The Belfry | gy_web | 11,1 |  |
| WEBFREE | 9634 | The Vestry | gy_web | 1,1 |  |
| LOOSEDOOR | 9630 | The Church of the Hollow Saint | bl_arch | 47,34 |  |
| ITEM_UNREACH | 9633 | The Belfry | greatermana | 11,3 |  |
| NPC_TALL | 9631 | The Nave of the Hollow Saint | mi_saint | 3,2 | h 1.75 npc blc_saint |
| NPC_TALL | 9631 | The Nave of the Hollow Saint | b34_gh3 | 3,5 | h 1.54 npc blc_choir |
| NPC_TALL | 9631 | The Nave of the Hollow Saint | gy_banshee | 5,5 | h 1.44 npc blc_choir |
| NPC_TALL | 9631 | The Nave of the Hollow Saint | b34_gh3 | 15,5 | h 1.54 npc blc_choir |
| NPC_TALL | 9631 | The Nave of the Hollow Saint | gy_banshee | 17,5 | h 1.44 npc blc_choir |
| FOE_CUT | 9630 | The Church of the Hollow Saint | tt5 | 20,18 | top at 1.32 (window about 1.0) |
| FLOAT | 9630 | The Church of the Hollow Saint | gy_book | 50,25 | gap 0.10 (pad 0.00, h 0.42, bob 0.10) |
| FLOAT | 9631 | The Nave of the Hollow Saint | b34_gh1 | 2,5 | gap 0.11 (pad 0.03, h 1.09, bob 0.08) |
| FLOAT | 9631 | The Nave of the Hollow Saint | b34_gh3 | 3,5 | gap 0.12 (pad 0.00, h 1.54, bob 0.12) |
| FLOAT | 9631 | The Nave of the Hollow Saint | gy_banshee | 5,5 | gap 0.08 (pad 0.00, h 1.44, bob 0.08) |
| FLOAT | 9631 | The Nave of the Hollow Saint | b34_gh1 | 6,5 | gap 0.15 (pad 0.03, h 1.09, bob 0.12) |
| FLOAT | 9631 | The Nave of the Hollow Saint | b34_gh1 | 14,5 | gap 0.19 (pad 0.03, h 1.09, bob 0.16) |
| FLOAT | 9631 | The Nave of the Hollow Saint | b34_gh3 | 15,5 | gap 0.08 (pad 0.00, h 1.54, bob 0.08) |
| FLOAT | 9631 | The Nave of the Hollow Saint | b34_gh1 | 18,5 | gap 0.11 (pad 0.03, h 1.09, bob 0.08) |
| HOVER | 9631 | The Nave of the Hollow Saint | wl2_church_2 | 5,0 | gap 0.10 (pad 0.00, h 1.56, bob 0.10) |
| HOVER | 9631 | The Nave of the Hollow Saint | wl2_church_2 | 15,0 | gap 0.10 (pad 0.00, h 1.56, bob 0.10) |
| HOVER | 9632 | The Crypt of the Hollow Saint | gy_book | 9,1 | gap 0.55 (pad 0.00, h 0.38, bob 0.55) |
| HOVER | 9634 | The Vestry | wl2_hall_1 | 7,1 | gap 0.27 (pad 0.00, h 1.20, bob 0.27) |
| INWALL | 9631 | The Nave of the Hollow Saint | wl2_church_2 | 5,0 | g=28684 |
| INWALL | 9631 | The Nave of the Hollow Saint | wl2_church_2 | 15,0 | g=28684 |
| DUPDECOR | 9630 | The Church of the Hollow Saint | bl_win_b | 35,21 |  |
| ONEWAY | 9632 | The Crypt of the Hollow Saint | portal | 10,14 | to 9631 The Nave of the Hollow Saint, no way back |
| ONEWAY | 9633 | The Belfry | portal | 6,9 | to 9631 The Nave of the Hollow Saint, no way back |
| ONEWAY | 9634 | The Vestry | portal | 5,8 | to 9631 The Nave of the Hollow Saint, no way back |
| ONEWAY | 9635 | An unfinished room | portal | 4,6 | to 9630 The Church of the Hollow Saint, no way back |
| ONEWAY | 9636 | An unfinished room | portal | 4,6 | to 9630 The Church of the Hollow Saint, no way back |
| ONEWAY | 9637 | An unfinished room | portal | 4,6 | to 9630 The Church of the Hollow Saint, no way back |
| ONEWAY | 9638 | An unfinished room | portal | 4,6 | to 9630 The Church of the Hollow Saint, no way back |
| ONEWAY | 9639 | An unfinished room | portal | 4,6 | to 9630 The Church of the Hollow Saint, no way back |

### The Well Maze (62 findings in 4 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 498 | The Violet Maze | wm_web | 30,5 |  |
| WEBFREE | 498 | The Violet Maze | wm_web | 31,5 |  |
| WEBFREE | 498 | The Violet Maze | wm_web | 31,31 |  |
| WEBFREE | 498 | The Violet Maze | wm_web | 36,31 |  |
| WEBFREE | 498 | The Violet Maze | wm_web | 38,31 |  |
| WEBFREE | 498 | The Violet Maze | wm_web | 32,33 |  |
| WEBFREE | 498 | The Violet Maze | wm_web | 34,34 |  |
| WEBFREE | 498 | The Violet Maze | wm_web | 38,34 |  |
| WEBFREE | 498 | The Violet Maze | wm_web | 36,35 |  |
| WEBFREE | 499 | The Bell Vaults | wm_web | 1,10 |  |
| WEBFREE | 499 | The Bell Vaults | wm_web | 1,12 |  |
| WEBFREE | 502 | The Amethyst Deep | wm_web | 10,1 |  |
| WEBFREE | 502 | The Amethyst Deep | wm_web | 9,8 |  |
| LOOT_UNREACH | 497 | Under the Wenlock Well | wm_chest | 6,17 |  |
| LOOT_UNREACH | 497 | Under the Wenlock Well | wm_chest | 7,17 |  |
| LOOT_UNREACH | 497 | Under the Wenlock Well | wm_chest | 19,27 |  |
| LOOT_UNREACH | 497 | Under the Wenlock Well | wm_chest | 11,33 |  |
| LOOT_UNREACH | 497 | Under the Wenlock Well | wm_treasure_chest | 7,36 |  |
| LOOT_UNREACH | 497 | Under the Wenlock Well | wm_chest | 27,39 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_chest | 5,5 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_chest | 1,6 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_treasure_chest | 5,6 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_barrel_tall | 23,9 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_barrel_tall | 25,10 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_chest | 21,11 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_treasure_chest | 22,11 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_chest | 24,11 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_treasure_chest | 27,15 |  |
| LOOT_UNREACH | 498 | The Violet Maze | wm_chest | 11,22 |  |
| NPC_UNREACH | 498 | The Violet Maze | wm_lever_up | 39,37 | npc wmsw_0 |
| NPC_UNREACH | 499 | The Bell Vaults | teleporter | 23,37 | npc wm_exit_stone |
| MISSINGPIC | 498 | The Violet Maze | wm_barrel_stack | 11,23 |  |
| MISSINGPIC | 498 | The Violet Maze | wm_barrel_stack | 14,23 |  |
| MISSINGPIC | 499 | The Bell Vaults | wm_barrel_stack | 5,32 |  |
| MISSINGPIC | 499 | The Bell Vaults | wm_barrel_stack | 6,32 |  |
| DUPDECOR | 497 | Under the Wenlock Well | wm_brazier | 31,31 |  |
| DUPDECOR | 498 | The Violet Maze | wm_mirror | 27,27 |  |
| DUPDECOR | 498 | The Violet Maze | wm_brazier | 17,31 |  |
| DUPDECOR | 499 | The Bell Vaults | wm_brazier | 29,33 |  |
| DUPDECOR | 502 | The Amethyst Deep | wm_brazier | 13,33 |  |

### Vault of Maldrake (59 findings in 8 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 9671 | The Barrow Stair | sign_gy | 14,16 | wall side 0,-1 is open |
| NOWALL | 9672 | The Ossuary of the Roll | sign_gy | 14,13 | wall side 0,-1 is open |
| NOWALL | 9673 | The Bell Gallery | sign_gy | 17,6 | wall side 0,-1 is open |
| NOWALL | 9673 | The Bell Gallery | sign_gy | 5,16 | wall side 0,-1 is open |
| NOWALL | 9673 | The Bell Gallery | sign_gy | 16,16 | wall side 0,-1 is open |
| NOWALL | 9673 | The Bell Gallery | sign_gy | 27,16 | wall side 0,-1 is open |
| NOWALL | 9674 | The Silvered Cellars | sign_gy | 16,8 | wall side 0,-1 is open |
| NOWALL | 9674 | The Silvered Cellars | sign_gy | 7,10 | wall side 0,-1 is open |
| NOWALL | 9674 | The Silvered Cellars | sign_gy | 13,21 | wall side 0,-1 is open |
| NOWALL | 9675 | The Hall of Underhill | sign_gy | 28,19 | wall side 0,-1 is open |
| NOWALL | 9676 | The Stair of Quiet | sign_gy | 13,27 | wall side 0,-1 is open |
| WEBFREE | 9671 | The Barrow Stair | gy_web | 11,2 |  |
| WEBFREE | 9671 | The Barrow Stair | gy_web | 17,2 |  |
| WEBFREE | 9671 | The Barrow Stair | gy_web | 5,9 |  |
| WEBFREE | 9671 | The Barrow Stair | gy_web | 12,9 |  |
| WEBFREE | 9671 | The Barrow Stair | gy_web | 23,9 |  |
| WEBFREE | 9671 | The Barrow Stair | gy_web | 5,15 |  |
| WEBFREE | 9671 | The Barrow Stair | gy_web | 16,15 |  |
| WEBFREE | 9671 | The Barrow Stair | gy_web | 23,15 |  |
| WEBFREE | 9672 | The Ossuary of the Roll | gy_web | 10,5 |  |
| WEBFREE | 9672 | The Ossuary of the Roll | gy_web | 23,5 |  |
| WEBFREE | 9672 | The Ossuary of the Roll | gy_web | 10,9 |  |
| WEBFREE | 9672 | The Ossuary of the Roll | gy_web | 20,9 |  |
| WEBFREE | 9672 | The Ossuary of the Roll | gy_web | 7,13 |  |
| WEBFREE | 9672 | The Ossuary of the Roll | gy_web | 23,13 |  |
| WEBFREE | 9672 | The Ossuary of the Roll | gy_web | 7,25 |  |
| WEBFREE | 9672 | The Ossuary of the Roll | gy_web | 23,25 |  |
| WEBFREE | 9673 | The Bell Gallery | gy_web | 4,7 |  |
| WEBFREE | 9673 | The Bell Gallery | gy_web | 28,7 |  |
| WEBFREE | 9673 | The Bell Gallery | gy_web | 10,13 |  |
| WEBFREE | 9673 | The Bell Gallery | gy_web | 20,13 |  |
| NPC_TALL | 9675 | The Hall of Underhill | gy_zombie | 8,8 | h 1.47 npc vto_villager |
| NPC_TALL | 9675 | The Hall of Underhill | gy_zombie | 12,8 | h 1.47 npc vto_villager |
| NPC_TALL | 9675 | The Hall of Underhill | gy_zombie | 16,8 | h 1.47 npc vto_villager |
| NPC_TALL | 9675 | The Hall of Underhill | gy_zombie | 20,8 | h 1.47 npc vto_villager |
| NPC_TALL | 9675 | The Hall of Underhill | gy_zombie | 24,8 | h 1.47 npc vto_villager |
| NPC_TALL | 9675 | The Hall of Underhill | gy_zombie | 28,8 | h 1.47 npc vto_villager |
| NPC_TALL | 9675 | The Hall of Underhill | gy_zombie | 8,15 | h 1.47 npc vto_villager |
| NPC_TALL | 9675 | The Hall of Underhill | gy_zombie | 12,15 | h 1.47 npc vto_villager |
| ONEWAY | 9679 | An unfinished room | portal | 4,6 | to 9670 The Barrow Hill, no way back |

### The Isle of Bells (58 findings in 2 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 38,11 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 37,13 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 37,14 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 13,17 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 14,18 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 67,18 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 12,21 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 21,22 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 26,27 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 11,28 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 13,29 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 59,30 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 62,31 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 53,33 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 52,35 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 83,36 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 84,36 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 96,36 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 19,38 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 18,40 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 20,40 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 40,42 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 96,42 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 92,43 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 41,46 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 87,46 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 64,47 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 61,50 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 26,52 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 38,54 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 53,55 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 78,56 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 47,57 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 85,57 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 94,57 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 94,61 |  |
| LOOSEDOOR | 321 | The Drowned Abbey | yar_arch | 19,64 |  |
| FOE_BLOCKED | 301 | The Isle of Bells | ghost | 51,36 | on yar_altar |
| FOE_BLOCKED | 301 | The Isle of Bells | skel | 54,38 | on ltree17 |
| FOE_STACK | 301 | The Isle of Bells | spectre | 45,44 |  |

### Rookery Mill (58 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 9691 | The Rookery Mill: the grinding floor | gy_web | 1,1 |  |
| WEBFREE | 9691 | The Rookery Mill: the grinding floor | gy_web | 11,1 |  |
| WEBFREE | 9692 | The Rookery Mill: the loft | gy_web | 1,1 |  |
| WEBFREE | 9692 | The Rookery Mill: the loft | gy_web | 11,1 |  |
| WEBFREE | 9693 | The Rookery Mill: the cap | gy_web | 1,1 |  |
| WEBFREE | 9693 | The Rookery Mill: the cap | gy_web | 9,1 |  |
| WEBFREE | 9694 | The Miller's House | gy_web | 9,1 |  |
| FOE_CUT | 9690 | The Rookery Mill | tt4 | 43,34 | top at 1.44 (window about 1.0) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 23,4 | gap 0.49 (pad 0.00, h 0.41, bob 0.49) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,4 | gap 0.37 (pad 0.00, h 0.38, bob 0.37) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 23,6 | gap 0.15 (pad 0.00, h 0.31, bob 0.15) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,8 | gap 0.24 (pad 0.00, h 0.34, bob 0.24) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,10 | gap 0.16 (pad 0.00, h 0.31, bob 0.16) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,12 | gap 0.49 (pad 0.00, h 0.41, bob 0.49) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 23,14 | gap 0.36 (pad 0.00, h 0.37, bob 0.36) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,16 | gap 0.15 (pad 0.00, h 0.30, bob 0.15) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 23,18 | gap 0.42 (pad 0.00, h 0.39, bob 0.42) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,18 | gap 0.35 (pad 0.00, h 0.37, bob 0.35) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 23,20 | gap 0.21 (pad 0.00, h 0.32, bob 0.21) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,20 | gap 0.13 (pad 0.00, h 0.30, bob 0.13) |
| FLOAT | 9690 | The Rookery Mill | gy_book | 61,21 | gap 0.10 (pad 0.00, h 0.50, bob 0.10) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 23,24 | gap 0.31 (pad 0.00, h 0.36, bob 0.31) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,26 | gap 0.17 (pad 0.00, h 0.31, bob 0.17) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 23,28 | gap 0.24 (pad 0.00, h 0.33, bob 0.24) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 27,28 | gap 0.14 (pad 0.00, h 0.30, bob 0.14) |
| FLOAT | 9690 | The Rookery Mill | b9_twig | 23,30 | gap 0.29 (pad 0.00, h 0.35, bob 0.29) |
| FLOAT | 9690 | The Rookery Mill | bl_thimble | 28,31 | gap 0.10 (pad 0.00, h 0.34, bob 0.10) |
| FLOAT | 9690 | The Rookery Mill | bl_thimble | 51,38 | gap 0.10 (pad 0.00, h 0.34, bob 0.10) |
| INWALL | 9691 | The Rookery Mill: the grinding floor | crate | 12,8 | g=29022 |
| INWALL | 9691 | The Rookery Mill: the grinding floor | barrel | 1,9 | g=29022 |
| INWALL | 9693 | The Rookery Mill: the cap | hl_p_window | 0,4 | g=29022 |
| INWALL | 9693 | The Rookery Mill: the cap | hl_p_window | 10,4 | g=29022 |
| ONEWAY | 9692 | The Rookery Mill: the loft | portal | 6,8 | to 9691 The Rookery Mill: the grinding floor, no way back |
| ONEWAY | 9693 | The Rookery Mill: the cap | portal | 5,9 | to 9692 The Rookery Mill: the loft, no way back |
| ONEWAY | 9695 | An unfinished room | portal | 4,6 | to 9690 The Rookery Mill, no way back |
| ONEWAY | 9696 | An unfinished room | portal | 4,6 | to 9690 The Rookery Mill, no way back |
| ONEWAY | 9697 | An unfinished room | portal | 4,6 | to 9690 The Rookery Mill, no way back |
| ONEWAY | 9698 | An unfinished room | portal | 4,6 | to 9690 The Rookery Mill, no way back |
| ONEWAY | 9699 | An unfinished room | portal | 4,6 | to 9690 The Rookery Mill, no way back |
| NAMEPIC | 9690 | The Rookery Mill | gy_book | 55,27 | "The tally on the stone" is stone, picture is book |

### Oldhaven (50 findings in 33 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 305 | Oldhaven | sign_hsown | 101,47 | wall side 0,-1 is open |
| NOWALL | 305 | Oldhaven | sign_hsown | 121,48 | wall side 0,-1 is open |
| NOWALL | 305 | Oldhaven | sign_hsown | 115,49 | wall side 0,-1 is open |
| DOOR_UNREACH | 304 | Oldhaven Quay | portal | 39,8 | to 305 |
| DOOR_UNREACH | 304 | Oldhaven Quay | portal | 40,8 | to 305 |
| DOOR_UNREACH | 304 | Oldhaven Quay | portal | 41,8 | to 305 |
| DOOR_UNREACH | 305 | Oldhaven | portal | 100,4 | to 400 |
| DOOR_UNREACH | 305 | Oldhaven | portal | 101,4 | to 400 |
| DOOR_UNREACH | 305 | Oldhaven | portal | 145,73 | to 311 |
| DOOR_UNREACH | 305 | Oldhaven | portal | 145,74 | to 311 |
| DOOR_UNREACH | 305 | Oldhaven | portal | 73,145 | to 304 |
| DOOR_UNREACH | 305 | Oldhaven | portal | 74,145 | to 304 |
| DOOR_UNREACH | 305 | Oldhaven | portal | 75,145 | to 304 |
| TERRBLOCK | 304 | Oldhaven Quay | superiorheal | 44,36 | item |
| NPC_UNREACH | 305 | Oldhaven | kh_ohfolk1_4 | 40,67 | npc oh_f_monk |
| NPC_UNREACH | 305 | Oldhaven | kh_ohfolk2_1 | 40,68 | npc oh_f_friar |
| HOVER | 6009 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 6025 | A Nobleman's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 6070 | A Chaplain's House | kh_int6_1 | 4,1 | gap 0.27 (pad 0.00, h 0.75, bob 0.30) |
| HOVER | 6073 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 6112 | A Nobleman's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 6138 | A Chaplain's House | kh_int6_1 | 4,1 | gap 0.27 (pad 0.00, h 0.75, bob 0.30) |
| HOVER | 6139 | A Minstrel's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 6140 | A Nobleman's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 6141 | A Nobleman's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 6142 | A Chaplain's House | kh_int6_1 | 4,1 | gap 0.27 (pad 0.00, h 0.75, bob 0.30) |
| HOVER | 6144 | A Warm House | kh_int6_5 | 4,1 | gap 0.48 (pad 0.00, h 0.60, bob 0.50) |
| HOVER | 6172 | A Minstrel's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| HOVER | 6208 | A Nobleman's House | kh_int4_3 | 4,1 | gap 0.42 (pad 0.00, h 1.00, bob 0.45) |
| INWALL | 305 | Oldhaven | kh_ohfolk1_4 | 40,67 | g=1270 |
| INWALL | 305 | Oldhaven | kh_ohfolk2_1 | 40,68 | g=1269 |
| INWALL | 305 | Oldhaven | kh_ohfolk2_1 | 40,69 | g=1268 |
| ONEWAY | 3315 | Small House, Oldhaven | portal | 5,7 | to 305 Oldhaven, no way back |
| ONEWAY | 3316 | Medium House, Oldhaven | portal | 5,10 | to 305 Oldhaven, no way back |
| ONEWAY | 3317 | Large Mansion, Oldhaven | portal | 18,18 | to 305 Oldhaven, no way back |
| ONEWAY | 6013 | A Healer's House | portal | 4,5 | to 305 Oldhaven, no way back |
| ONEWAY | 6096 | A Soldier's Billet | portal | 4,5 | to 305 Oldhaven, no way back |
| ONEWAY | 6132 | A Scholar's House | portal | 4,5 | to 305 Oldhaven, no way back |
| ONEWAY | 6216 | A Nobleman's House | portal | 4,5 | to 305 Oldhaven, no way back |
| ONEWAY | 6217 | A Merchant's House | portal | 4,5 | to 305 Oldhaven, no way back |

### Toll House (49 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| OVERLAP | 9610 | The Toll House of the Road Wardens | bl_win_c | 38,22 | bl_win_a |
| WEBFREE | 9611 | The Wardens' Toll House | gy_web | 1,1 |  |
| WEBFREE | 9611 | The Wardens' Toll House | gy_web | 11,1 |  |
| WEBFREE | 9611 | The Wardens' Toll House | gy_web | 1,7 |  |
| WEBFREE | 9612 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9612 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9612 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9612 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9613 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9613 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9613 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9613 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9614 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9614 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9614 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9614 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9615 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9615 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9615 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9615 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9616 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9616 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9616 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9616 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9617 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9617 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9617 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9617 | An unfinished room | gy_web | 7,5 |  |
| LOOSEDOOR | 9610 | The Toll House of the Road Wardens | bl_arch | 15,31 |  |
| HOVER | 9611 | The Wardens' Toll House | wl2_library_5 | 5,1 | gap 0.11 (pad 0.00, h 1.08, bob 0.11) |
| ONEWAY | 9610 | The Toll House of the Road Wardens | door | 70,32 | to 496 Wenlock, no way back |
| ONEWAY | 9612 | An unfinished room | portal | 4,6 | to 9610 The Toll House of the Road Wardens, no way back |
| ONEWAY | 9613 | An unfinished room | portal | 4,6 | to 9610 The Toll House of the Road Wardens, no way back |
| ONEWAY | 9614 | An unfinished room | portal | 4,6 | to 9610 The Toll House of the Road Wardens, no way back |
| ONEWAY | 9615 | An unfinished room | portal | 4,6 | to 9610 The Toll House of the Road Wardens, no way back |
| ONEWAY | 9616 | An unfinished room | portal | 4,6 | to 9610 The Toll House of the Road Wardens, no way back |
| ONEWAY | 9617 | An unfinished room | portal | 4,6 | to 9610 The Toll House of the Road Wardens, no way back |
| ONEWAY | 9618 | An unfinished room | portal | 4,6 | to 9610 The Toll House of the Road Wardens, no way back |
| NAMEPIC | 9610 | The Toll House of the Road Wardens | gy_candles | 20,41 | "A ruined wayside shrine" is altar, picture is lamp |
| NAMEPIC | 9611 | The Wardens' Toll House | gy_book | 9,3 | "A slip under the strongbox" is chest, picture is book |

### Ashenfold Farm (45 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| OVERLAP | 9620 | Ashenfold Farm | bl_win_c | 52,22 | bl_win_a |
| WEBFREE | 9621 | The Sedges' Kitchen | gy_web | 1,1 |  |
| WEBFREE | 9622 | The Farmhouse Cellar | gy_web | 1,6 |  |
| WEBFREE | 9623 | The Ashenfold Barn | gy_web | 1,1 |  |
| WEBFREE | 9623 | The Ashenfold Barn | gy_web | 1,7 |  |
| WEBFREE | 9624 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9624 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9624 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9624 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9625 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9625 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9625 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9625 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9626 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9626 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9626 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9626 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9627 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9627 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9627 | An unfinished room | gy_web | 1,5 |  |
| WEBFREE | 9627 | An unfinished room | gy_web | 7,5 |  |
| WEBFREE | 9628 | An unfinished room | gy_web | 1,1 |  |
| WEBFREE | 9628 | An unfinished room | gy_web | 7,1 |  |
| WEBFREE | 9628 | An unfinished room | gy_web | 1,5 |  |
| LOOSEDOOR | 9620 | Ashenfold Farm | bl_arch | 22,35 |  |
| LOOSEDOOR | 9620 | Ashenfold Farm | bl_arch | 63,35 |  |
| NPC_TALL | 9621 | The Sedges' Kitchen | gy_zombie | 7,4 | h 1.55 npc bla_wilf |
| FOE_CUT | 9620 | Ashenfold Farm | tt0 | 12,26 | top at 1.26 (window about 1.0) |
| INWALL | 9622 | The Farmhouse Cellar | crate | 0,1 | g=24091 |
| INWALL | 9623 | The Ashenfold Barn | wl2_hall_4 | 1,8 | g=24091 |
| INWALL | 9623 | The Ashenfold Barn | barrel | 10,8 | g=24091 |
| DUPDECOR | 9621 | The Sedges' Kitchen | crate | 6,5 |  |
| DUPDECOR | 9621 | The Sedges' Kitchen | crate | 8,5 |  |
| ONEWAY | 9622 | The Farmhouse Cellar | portal | 5,7 | to 9621 The Sedges' Kitchen, no way back |
| ONEWAY | 9624 | An unfinished room | portal | 4,6 | to 9620 Ashenfold Farm, no way back |
| ONEWAY | 9625 | An unfinished room | portal | 4,6 | to 9620 Ashenfold Farm, no way back |
| ONEWAY | 9626 | An unfinished room | portal | 4,6 | to 9620 Ashenfold Farm, no way back |
| ONEWAY | 9627 | An unfinished room | portal | 4,6 | to 9620 Ashenfold Farm, no way back |
| ONEWAY | 9628 | An unfinished room | portal | 4,6 | to 9620 Ashenfold Farm, no way back |
| ONEWAY | 9629 | An unfinished room | portal | 4,6 | to 9620 Ashenfold Farm, no way back |

### Pale Bridge (43 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| OVERLAP | 9700 | The Pale Bridge and the Gate of Sale | bl_win_c | 5,27 | bl_win_a |
| OVERLAP | 9700 | The Pale Bridge and the Gate of Sale | bl_win_c | 63,27 | bl_win_a |
| WEBFREE | 9700 | The Pale Bridge and the Gate of Sale | gy_web | 63,30 |  |
| WEBFREE | 9701 | The Gatehouse of Sale | gy_web | 1,1 |  |
| WEBFREE | 9702 | The Wall Walk | gy_web | 1,1 |  |
| LOOSEDOOR | 9700 | The Pale Bridge and the Gate of Sale | gy_arch | 9,35 |  |
| NPC_TALL | 9700 | The Pale Bridge and the Gate of Sale | bl_paleknight | 51,35 | h 1.65 npc blp_knight |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,4 | gap 0.19 (pad 0.00, h 0.36, bob 0.19) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,4 | gap 0.21 (pad 0.00, h 0.37, bob 0.21) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,7 | gap 0.40 (pad 0.00, h 0.44, bob 0.40) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,13 | gap 0.32 (pad 0.00, h 0.41, bob 0.32) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,13 | gap 0.41 (pad 0.00, h 0.45, bob 0.41) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,16 | gap 0.26 (pad 0.00, h 0.39, bob 0.26) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,16 | gap 0.15 (pad 0.00, h 0.35, bob 0.15) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,19 | gap 0.20 (pad 0.00, h 0.37, bob 0.20) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,22 | gap 0.21 (pad 0.00, h 0.37, bob 0.21) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,25 | gap 0.50 (pad 0.00, h 0.48, bob 0.50) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,25 | gap 0.19 (pad 0.00, h 0.37, bob 0.19) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,28 | gap 0.36 (pad 0.00, h 0.43, bob 0.36) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,40 | gap 0.36 (pad 0.00, h 0.43, bob 0.36) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,43 | gap 0.32 (pad 0.00, h 0.41, bob 0.32) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,46 | gap 0.46 (pad 0.00, h 0.46, bob 0.46) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,49 | gap 0.14 (pad 0.00, h 0.35, bob 0.14) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,49 | gap 0.41 (pad 0.00, h 0.44, bob 0.41) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,52 | gap 0.39 (pad 0.00, h 0.44, bob 0.39) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,52 | gap 0.29 (pad 0.00, h 0.40, bob 0.29) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,55 | gap 0.24 (pad 0.00, h 0.38, bob 0.24) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 56,55 | gap 0.40 (pad 0.00, h 0.44, bob 0.40) |
| FLOAT | 9700 | The Pale Bridge and the Gate of Sale | b9_twig | 46,61 | gap 0.19 (pad 0.00, h 0.36, bob 0.19) |
| HOVER | 9700 | The Pale Bridge and the Gate of Sale | gy_ring | 11,44 | gap 0.10 (pad 0.00, h 0.34, bob 0.10) |
| INWALL | 9702 | The Wall Walk | hl_p_window | 0,4 | g=29022 |
| INWALL | 9702 | The Wall Walk | hl_p_window | 10,4 | g=29022 |
| INWALL | 9702 | The Wall Walk | hay | 10,5 | g=29022 |
| ONEWAY | 9703 | An unfinished room | portal | 4,6 | to 9700 The Pale Bridge and the Gate of Sale, no way back |
| ONEWAY | 9704 | An unfinished room | portal | 4,6 | to 9700 The Pale Bridge and the Gate of Sale, no way back |
| ONEWAY | 9705 | An unfinished room | portal | 4,6 | to 9700 The Pale Bridge and the Gate of Sale, no way back |
| ONEWAY | 9706 | An unfinished room | portal | 4,6 | to 9700 The Pale Bridge and the Gate of Sale, no way back |
| ONEWAY | 9707 | An unfinished room | portal | 4,6 | to 9700 The Pale Bridge and the Gate of Sale, no way back |
| ONEWAY | 9708 | An unfinished room | portal | 4,6 | to 9700 The Pale Bridge and the Gate of Sale, no way back |
| ONEWAY | 9709 | An unfinished room | portal | 4,6 | to 9700 The Pale Bridge and the Gate of Sale, no way back |

### The Pale Spire (41 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| OVERDOOR | 9740 | The Ground Floor: the Great Halls | sign_gy | 32,6 | door 22761 |
| OVERDOOR | 9740 | The Ground Floor: the Great Halls | sign_gy | 38,8 | door 22769 |
| OVERLAP | 9760 | The Ground Floor: Cloister, Chapel and L | ps_clock_face | 42,29 | sign_gy |
| ARRIVE_WALL | 9730 | The Court of Statues | door | 3,34 | to 9850 lands on 6,58 (off the map of 24x18) |
| ARRIVE_WALL | 9730 | The Court of Statues | door | 60,34 | to 9850 lands on 89,58 (off the map of 24x18) |
| ARRIVE_WALL | 9740 | The Ground Floor: the Great Halls | door | 32,5 | to 9820 lands on 56,78 (off the map of 24x18) |
| TERRBLOCK | 9790 | The Deep Cells and the Cistern | gem_moonstone | 36,17 | item |
| TERRBLOCK | 9790 | The Deep Cells and the Cistern | gem_pinksapphire | 25,19 | item |
| TERRBLOCK | 9790 | The Deep Cells and the Cistern | gem_violetspinel | 37,31 | item |
| ITEM_UNREACH | 9740 | The Ground Floor: the Great Halls | gem_garnet | 9,34 |  |
| ITEM_UNREACH | 9760 | The Ground Floor: Cloister, Chapel and L | gem_greentourmaline | 28,11 |  |
| ITEM_UNREACH | 9800 | The Oubliette | gem_whitesapphire | 37,29 |  |
| LOOT_UNREACH | 9740 | The Ground Floor: the Great Halls | chest | 8,5 |  |
| LOOT_UNREACH | 9740 | The Ground Floor: the Great Halls | chest | 24,33 |  |
| LOOT_UNREACH | 9740 | The Ground Floor: the Great Halls | chest | 8,38 |  |
| LOOT_UNREACH | 9740 | The Ground Floor: the Great Halls | chest | 15,41 |  |
| LOOT_UNREACH | 9750 | The Ground Floor: Kitchens and Armoury | psw_chest | 8,36 |  |
| LOOT_UNREACH | 9800 | The Oubliette | gy_chest | 34,28 |  |
| NPC_UNREACH | 9740 | The Ground Floor: the Great Halls | ps_furn_bed_canopy | 6,6 | npc psh_bed |
| NPC_UNREACH | 9750 | The Ground Floor: Kitchens and Armoury | psw_sword_rack | 22,4 | npc psw_hilt1 |
| NPC_UNREACH | 9760 | The Ground Floor: Cloister, Chapel and L | ps_reliquary_chest | 32,13 | npc psw_reliquary |
| NPC_UNREACH | 9780 | The Undercroft Gaols | gy_chest | 45,14 | npc psd_tinchest |
| WDLOOSE | 9780 | The Undercroft Gaols | ps_lantern_red_b | 28,15 | wd 0,-1 but drawn free-standing |
| WDLOOSE | 9780 | The Undercroft Gaols | ps_lantern_red_a | 16,17 | wd -1,0 but drawn free-standing |
| WDLOOSE | 9780 | The Undercroft Gaols | ps_lantern_red_b | 19,29 | wd 0,1 but drawn free-standing |
| WDLOOSE | 9790 | The Deep Cells and the Cistern | ps_lantern_red_a | 44,5 | wd 1,0 but drawn free-standing |
| WDLOOSE | 9790 | The Deep Cells and the Cistern | ps_lantern_red_a | 17,10 | wd 0,1 but drawn free-standing |
| WDLOOSE | 9790 | The Deep Cells and the Cistern | ps_lantern_red_b | 42,26 | wd 0,1 but drawn free-standing |
| WDLOOSE | 9800 | The Oubliette | ps_lantern_red_a | 20,11 | wd 0,-1 but drawn free-standing |
| WDLOOSE | 9800 | The Oubliette | ps_lantern_red_b | 30,11 | wd 0,-1 but drawn free-standing |
| WDLOOSE | 9800 | The Oubliette | ps_lantern_red_a | 23,26 | wd 0,1 but drawn free-standing |
| WDLOOSE | 9800 | The Oubliette | ps_lantern_red_a | 16,30 | wd 0,-1 but drawn free-standing |
| DUPDECOR | 9720 | The Pale Approach | ps_iron_fence_a | 34,50 |  |
| DUPDECOR | 9730 | The Court of Statues | ps_lantern_bracket | 13,30 |  |
| NAN | 9730 | The Court of Statues | teleporter |  | sc undefined bob undefined |
| CONSOLE_WARN | 9740 | The Ground Floor: the Great Halls |  |  | psh missed: ps_chandelier@32,43 pic ps_pt_isaude@22,43 ps_st_chimera@41,41 ps_st_mourners@55,41 ps_st_veiled@5 |
| CONSOLE_WARN | 9750 | The Ground Floor: Kitchens and Armoury |  |  | psw 9750 missed: nopic:tools@12,4 nopic:tools@7,22 nopic:pot@7,24 nopic:jar@12,17 nopic:jar@14,17 nokey@22,15  |
| CONSOLE_WARN | 9760 | The Ground Floor: Cloister, Chapel and L |  |  | psw 9760 missed: nopic:cl_girl@6,35 nopic:tools@44,32 |
| ONEWAY | 9830 | The Second Floor: the West Wing, State B | door | 12,15 | to 9750 The Ground Floor: Kitchens and Armoury, no way back |
| ONEWAY | 9840 | The Second Floor: the East Wing, Council | door | 12,15 | to 9760 The Ground Floor: Cloister, Chapel and L, no way back |

### The Sand Road (41 findings in 3 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| CORRIDOR | 8331 | The Sunken Hall | rs_brick2 | 25,7 |  |
| ARRIVE_WALL | 41 | The Sand Road | mound | 138,34 | to 59 lands on 10,14 ("H") |
| ARRIVE_WALL | 41 | The Sand Road | mound | 49,48 | to 58 lands on 10,14 ("W") |
| ARRIVE_WALL | 41 | The Sand Road | mound | 145,48 | to 57 lands on 10,14 ("W") |
| ARRIVE_WALL | 41 | The Sand Road | mound | 60,69 | to 56 lands on 10,14 ("H") |
| ARRIVE_WALL | 41 | The Sand Road | mound | 121,79 | to 55 lands on 10,14 ("H") |
| ARRIVE_WALL | 41 | The Sand Road | mound | 18,90 | to 54 lands on 10,14 ("H") |
| ARRIVE_WALL | 41 | The Sand Road | mound | 55,127 | to 50 lands on 10,14 ("W") |
| ITEM_UNREACH | 41 | The Sand Road | greatermana | 59,215 |  |
| FLOAT | 41 | The Sand Road | dplant2 | 43,13 | gap 0.06 (pad 0.12, h 0.51, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 32,15 | gap 0.07 (pad 0.12, h 0.64, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 41,18 | gap 0.07 (pad 0.12, h 0.56, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 39,22 | gap 0.06 (pad 0.12, h 0.49, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 155,26 | gap 0.05 (pad 0.12, h 0.46, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 112,28 | gap 0.07 (pad 0.12, h 0.63, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 92,34 | gap 0.06 (pad 0.12, h 0.50, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 111,37 | gap 0.07 (pad 0.12, h 0.56, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 120,40 | gap 0.06 (pad 0.12, h 0.51, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 148,43 | gap 0.07 (pad 0.12, h 0.60, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 67,45 | gap 0.07 (pad 0.12, h 0.58, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 57,46 | gap 0.06 (pad 0.12, h 0.49, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 99,46 | gap 0.06 (pad 0.12, h 0.53, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 126,46 | gap 0.07 (pad 0.12, h 0.59, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 62,50 | gap 0.07 (pad 0.12, h 0.64, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 124,53 | gap 0.07 (pad 0.12, h 0.61, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 39,55 | gap 0.06 (pad 0.12, h 0.53, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 115,58 | gap 0.05 (pad 0.12, h 0.47, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 65,65 | gap 0.07 (pad 0.12, h 0.64, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 134,65 | gap 0.06 (pad 0.12, h 0.53, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 142,66 | gap 0.07 (pad 0.12, h 0.57, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 143,68 | gap 0.06 (pad 0.12, h 0.48, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 74,76 | gap 0.06 (pad 0.12, h 0.47, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 57,80 | gap 0.08 (pad 0.12, h 0.64, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 155,85 | gap 0.08 (pad 0.12, h 0.65, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 98,86 | gap 0.06 (pad 0.12, h 0.54, bob 0.00) |
| FLOAT | 41 | The Sand Road | dplant2 | 130,87 | gap 0.06 (pad 0.12, h 0.51, bob 0.00) |
| INWALL | 41 | The Sand Road | dobelisk | 68,192 | g=6 |
| INWALL | 41 | The Sand Road | dobelisk | 78,192 | g=6 |
| ONEWAY | 8330 | The Old Watchpost | door | 16,23 | to 41 The Sand Road, no way back |
| ONEWAY | 8331 | The Sunken Hall | door | 16,23 | to 41 The Sand Road, no way back |

### The Oakwood (39 findings in 4 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 7206 | Stroud and Daughter, Weaponsmiths | gy_web | 1,1 |  |
| WEBFREE | 7206 | Stroud and Daughter, Weaponsmiths | gy_web | 11,1 |  |
| ROUTEBLOCK | 311 | The Oakwood | gtree4 | 33,19 | mound at 33,18 to 10489 |
| ROUTEBLOCK | 311 | The Oakwood | gtree3 | 38,30 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree12 | 38,38 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree4 | 38,39 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree4 | 38,40 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree4 | 38,41 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree8 | 38,43 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | pstump | 25,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree4 | 26,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree0 | 27,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree8 | 28,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree0 | 29,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree8 | 33,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree0 | 34,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree19 | 35,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree0 | 36,44 | mound at 24,44 to 7206 |
| ROUTEBLOCK | 311 | The Oakwood | ltree8 | 37,44 | mound at 24,44 to 7206 |
| ARRIVE_WALL | 311 | The Oakwood | mound | 24,44 | to 7206 lands on 8,16 (off the map of 13x9) |
| FOE_BLOCKED | 311 | The Oakwood | wolf | 39,13 | on ltree19 |
| ITEM_UNREACH | 311 | The Oakwood | herb_moonpetal | 32,4 |  |
| ITEM_UNREACH | 311 | The Oakwood | herb_chamomile | 34,6 |  |
| ITEM_UNREACH | 311 | The Oakwood | herb_marigold | 76,8 |  |
| ITEM_UNREACH | 311 | The Oakwood | greatermana | 17,9 |  |
| ITEM_UNREACH | 311 | The Oakwood | herb_lavender | 49,16 |  |
| ITEM_UNREACH | 311 | The Oakwood | herb_moonpetal | 52,25 |  |
| ITEM_UNREACH | 311 | The Oakwood | herb_burdock | 4,53 |  |
| ITEM_UNREACH | 311 | The Oakwood | herb_silverleaf | 12,55 |  |
| ITEM_UNREACH | 311 | The Oakwood | manadraught | 35,61 |  |
| ITEM_UNREACH | 311 | The Oakwood | herb_chamomile | 74,63 |  |
| ITEM_UNREACH | 311 | The Oakwood | greatermana | 4,64 |  |
| ITEM_UNREACH | 311 | The Oakwood | greatermana | 26,70 |  |
| HOVER | 7206 | Stroud and Daughter, Weaponsmiths | wl2_armour_1 | 3,1 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| HOVER | 7206 | Stroud and Daughter, Weaponsmiths | wl2_armour_1 | 6,1 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| ONEWAY | 311 | The Oakwood | mound | 24,44 | to 7206 Stroud and Daughter, Weaponsmiths, no way back |
| ONEWAY | 7206 | Stroud and Daughter, Weaponsmiths | portal | 6,8 | to 600 Sale, no way back |
| ONEWAY | 10490 | The Fallen Gatehouse | door | 16,23 | to 311 The Oakwood, no way back |
| ONEWAY | 10491 | The Tangled Crypt | door | 16,23 | to 311 The Oakwood, no way back |

### Yarrim (38 findings in 19 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 290 | Yarrim | sign_hsown | 32,53 | wall side 0,-1 is open |
| NOWALL | 290 | Yarrim | sign_hsown | 41,53 | wall side 0,-1 is open |
| NOWALL | 290 | Yarrim | sign_hsown | 53,53 | wall side 0,-1 is open |
| LOOSEDOOR | 290 | Yarrim | yar_arch2 | 47,35 |  |
| LOOSEDOOR | 290 | Yarrim | yar_arch2 | 33,40 |  |
| ITEM_UNREACH | 1509 | A Widow's Cottage | manadraught | 1,1 |  |
| INWALL | 1500 | A Net-Mender's Cottage | kh_ship1_5 | 6,2 | g=24090 |
| INWALL | 1500 | A Net-Mender's Cottage | kh_ship1_5 | 6,3 | g=24090 |
| INWALL | 1501 | A Widow's Cottage | kh_int3_2 | 6,3 | g=24086 |
| INWALL | 1502 | A Poor Fisher's Hut | yar_bucket3 | 6,4 | g=24087 |
| INWALL | 1503 | A Boatbuilder's House | kh_ship1_0 | 6,1 | g=24086 |
| INWALL | 1503 | A Boatbuilder's House | kh_ship1_2 | 6,3 | g=24086 |
| INWALL | 1504 | A Fisherman's Cottage | barrel | 6,1 | g=24088 |
| INWALL | 1504 | A Fisherman's Cottage | kh_ship1_5 | 6,4 | g=24088 |
| INWALL | 1506 | A Boatbuilder's House | kh_ship1_0 | 6,1 | g=24089 |
| INWALL | 1506 | A Boatbuilder's House | kh_ship1_2 | 6,3 | g=24089 |
| INWALL | 1507 | A Poor Fisher's Hut | yar_bucket3 | 6,4 | g=24087 |
| INWALL | 1508 | A Net-Mender's Cottage | kh_ship1_5 | 6,2 | g=24088 |
| INWALL | 1508 | A Net-Mender's Cottage | kh_ship1_5 | 6,3 | g=24088 |
| INWALL | 1509 | A Widow's Cottage | kh_int3_2 | 6,3 | g=24090 |
| INWALL | 1510 | A Poor Fisher's Hut | yar_bucket3 | 6,4 | g=24089 |
| INWALL | 1511 | A Poor Fisher's Hut | yar_bucket3 | 6,4 | g=24088 |
| INWALL | 1512 | A Net-Mender's Cottage | kh_ship1_5 | 6,2 | g=24087 |
| INWALL | 1512 | A Net-Mender's Cottage | kh_ship1_5 | 6,3 | g=24087 |
| INWALL | 1513 | A Boatbuilder's House | kh_ship1_0 | 6,1 | g=24088 |
| INWALL | 1513 | A Boatbuilder's House | kh_ship1_2 | 6,3 | g=24088 |
| INWALL | 1514 | A Poor Fisher's Hut | yar_bucket3 | 6,4 | g=24086 |
| INWALL | 1515 | A Boatbuilder's House | kh_ship1_0 | 6,1 | g=24085 |
| INWALL | 1515 | A Boatbuilder's House | kh_ship1_2 | 6,3 | g=24085 |
| ONEWAY | 1502 | A Poor Fisher's Hut | portal | 3,5 | to 290 Yarrim, no way back |
| ONEWAY | 1507 | A Poor Fisher's Hut | portal | 3,5 | to 290 Yarrim, no way back |
| ONEWAY | 1510 | A Poor Fisher's Hut | portal | 3,5 | to 290 Yarrim, no way back |
| ONEWAY | 1512 | A Net-Mender's Cottage | portal | 3,5 | to 290 Yarrim, no way back |
| ONEWAY | 1513 | A Boatbuilder's House | portal | 3,5 | to 290 Yarrim, no way back |
| ONEWAY | 3312 | Small House, Yarrim | portal | 5,7 | to 290 Yarrim, no way back |
| ONEWAY | 3313 | Medium House, Yarrim | portal | 5,10 | to 290 Yarrim, no way back |
| ONEWAY | 3314 | Large Mansion, Yarrim | portal | 18,18 | to 290 Yarrim, no way back |
| NAMEPIC | 290 | Yarrim | kh_cart1_0 | 53,41 | "Hamid and his donkey" is animal, picture is cart |

### Greendale (35 findings in 7 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 32 | Greendale Forest | sign_hsown | 46,8 | wall side -1,0 is open |
| NOWALL | 32 | Greendale Forest | sign_hsown | 38,10 | wall side 1,0 is open |
| NOWALL | 32 | Greendale Forest | sign_hsown | 50,10 | wall side -1,0 is open |
| ROUTEBLOCK | 32 | Greendale Forest | pstump | 61,10 | portal at 63,10 to 33 |
| ROUTEBLOCK | 32 | Greendale Forest | gtree6 | 58,16 | mound at 58,15 to 8256 |
| ROUTEBLOCK | 32 | Greendale Forest | gtree6 | 33,28 | mound at 33,27 to 7205 |
| ROUTEBLOCK | 32 | Greendale Forest | gtree4 | 41,33 | mound at 41,32 to 8258 |
| CORRIDOR | 32 | Greendale Forest | logm | 24,14 |  |
| CORRIDOR | 8258 | The Old Watchpost | rs_brick2 | 5,9 |  |
| CORRIDOR | 8259 | The Vine-Choked Cellar | rs_brick2 | 18,7 |  |
| ITEM_UNREACH | 32 | Greendale Forest | herb_moonpetal | 36,33 |  |
| ITEM_UNREACH | 32 | Greendale Forest | bread | 38,37 |  |
| NPC_UNREACH | 32 | Greendale Forest | shr_1 | 27,29 | npc shr_green |
| NPC_UNREACH | 32 | Greendale Forest | rabbits | 37,35 | npc rabbits |
| NPC_UNREACH | 32 | Greendale Forest | rabbits | 39,37 | npc rabbits |
| DUPDECOR | 39 | The Overgrown Hollow | flora3 | 27,2 |  |
| DUPDECOR | 39 | The Overgrown Hollow | lflora0_1 | 9,4 |  |
| DUPDECOR | 39 | The Overgrown Hollow | lflora0 | 1,5 |  |
| DUPDECOR | 39 | The Overgrown Hollow | lflora0_1 | 40,7 |  |
| DUPDECOR | 39 | The Overgrown Hollow | lflora0_1 | 20,11 |  |
| DUPDECOR | 39 | The Overgrown Hollow | flora0 | 22,13 |  |
| DUPDECOR | 39 | The Overgrown Hollow | flora7 | 24,15 |  |
| DUPDECOR | 39 | The Overgrown Hollow | flora4 | 39,15 |  |
| DUPDECOR | 39 | The Overgrown Hollow | lflora0 | 42,15 |  |
| DUPDECOR | 39 | The Overgrown Hollow | lflora0 | 1,27 |  |
| DUPDECOR | 39 | The Overgrown Hollow | flora1 | 33,29 |  |
| DUPDECOR | 39 | The Overgrown Hollow | flora3 | 44,29 |  |
| DUPDECOR | 39 | The Overgrown Hollow | flora1 | 23,33 |  |
| DUPDECOR | 39 | The Overgrown Hollow | lflora0_1 | 21,34 |  |
| DUPDECOR | 39 | The Overgrown Hollow | lflora0 | 24,37 |  |
| ONEWAY | 32 | Greendale Forest | portal | 0,36 | to 22 The Greyfang Pass, no way back |
| ONEWAY | 3306 | Small House, Greendale | portal | 5,7 | to 32 Greendale Forest, no way back |
| ONEWAY | 3307 | Medium House, Greendale | portal | 5,10 | to 32 Greendale Forest, no way back |
| ONEWAY | 3308 | Large Mansion, Greendale | portal | 18,18 | to 32 Greendale Forest, no way back |
| ONEWAY | 8259 | The Vine-Choked Cellar | door | 16,23 | to 32 Greendale Forest, no way back |

### The Red Dunes (32 findings in 5 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| LOOT_UNREACH | 43 | The Red Dunes | chest | 8,46 |  |
| FLOAT | 43 | The Red Dunes | dplant2 | 32,15 | gap 0.07 (pad 0.12, h 0.64, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 39,22 | gap 0.06 (pad 0.12, h 0.49, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 155,26 | gap 0.05 (pad 0.12, h 0.46, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 112,28 | gap 0.07 (pad 0.12, h 0.63, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 92,34 | gap 0.06 (pad 0.12, h 0.50, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 120,40 | gap 0.06 (pad 0.12, h 0.51, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 148,43 | gap 0.07 (pad 0.12, h 0.60, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 67,45 | gap 0.07 (pad 0.12, h 0.58, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 57,46 | gap 0.06 (pad 0.12, h 0.49, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 124,53 | gap 0.07 (pad 0.12, h 0.61, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 115,58 | gap 0.05 (pad 0.12, h 0.47, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 74,76 | gap 0.06 (pad 0.12, h 0.47, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 57,80 | gap 0.08 (pad 0.12, h 0.64, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 98,86 | gap 0.06 (pad 0.12, h 0.54, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 54,89 | gap 0.07 (pad 0.12, h 0.62, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 100,92 | gap 0.06 (pad 0.12, h 0.55, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 88,99 | gap 0.07 (pad 0.12, h 0.64, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 89,107 | gap 0.05 (pad 0.12, h 0.46, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 34,114 | gap 0.07 (pad 0.12, h 0.60, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 38,123 | gap 0.06 (pad 0.12, h 0.53, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 59,137 | gap 0.05 (pad 0.12, h 0.46, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 76,138 | gap 0.06 (pad 0.12, h 0.48, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 56,172 | gap 0.06 (pad 0.12, h 0.55, bob 0.00) |
| FLOAT | 43 | The Red Dunes | dplant2 | 31,178 | gap 0.07 (pad 0.12, h 0.58, bob 0.00) |
| INWALL | 43 | The Red Dunes | chest | 8,46 | g=101 |
| ONEWAY | 43 | The Red Dunes | portal | 96,6 | to 44 Khemetra, the Golden City, no way back |
| ONEWAY | 43 | The Red Dunes | portal | 89,189 | to 42 The Tomb of Sut, no way back |
| ONEWAY | 105 | Sepulchre of the Drowned Star | portal | 9,14 | to 43 The Red Dunes, no way back |
| ONEWAY | 106 | Ossuary of the Silent Vizier | portal | 10,18 | to 43 The Red Dunes, no way back |
| ONEWAY | 110 | Barrow of the Burning Moon | portal | 14,14 | to 43 The Red Dunes, no way back |
| ONEWAY | 112 | Hollow of Golden Ash | portal | 14,14 | to 43 The Red Dunes, no way back |

### Hollowbell Abbey (31 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| OVERLAP | 9680 | Hollowbell Abbey | bl_win_c | 20,11 | bl_win_b |
| OVERLAP | 9680 | Hollowbell Abbey | bl_win_c | 16,12 | bl_win_b |
| WEBFREE | 9680 | Hollowbell Abbey | gy_web | 19,26 |  |
| WEBFREE | 9681 | The Chapter House | gy_web | 1,1 |  |
| WEBFREE | 9681 | The Chapter House | gy_web | 15,1 |  |
| WEBFREE | 9682 | The Scriptorium | gy_web | 1,1 |  |
| WEBFREE | 9683 | The Refectory | gy_web | 1,1 |  |
| WEBFREE | 9684 | The Ringing Chamber | gy_web | 1,1 |  |
| WEBFREE | 9684 | The Ringing Chamber | gy_web | 7,1 |  |
| WEBFREE | 9685 | The Belfry of Hollowbell | gy_web | 1,1 |  |
| WEBFREE | 9685 | The Belfry of Hollowbell | gy_web | 13,1 |  |
| WEBFREE | 9686 | The Crypt of the Brothers | gy_web | 1,1 |  |
| WEBFREE | 9686 | The Crypt of the Brothers | gy_web | 17,1 |  |
| LOOSEDOOR | 9680 | Hollowbell Abbey | bl_arch | 17,37 |  |
| LOOSEDOOR | 9680 | Hollowbell Abbey | bl_arch | 55,37 |  |
| ITEM_BLOCKED | 9680 | Hollowbell Abbey | potion6 | 27,31 | g=0 |
| FOE_CUT | 9680 | Hollowbell Abbey | tt3 | 61,3 | top at 1.32 (window about 1.0) |
| HOVER | 9681 | The Chapter House | wl2_hall_1 | 8,1 | gap 0.30 (pad 0.00, h 1.32, bob 0.30) |
| INWALL | 9680 | Hollowbell Abbey | bl_fence | 21,4 | g=23106 |
| INWALL | 9680 | Hollowbell Abbey | bl_fence | 22,4 | g=23106 |
| INWALL | 9680 | Hollowbell Abbey | bl_fence | 23,4 | g=23106 |
| INWALL | 9680 | Hollowbell Abbey | bl_fence | 24,4 | g=23106 |
| DUPDECOR | 9680 | Hollowbell Abbey | bl_grow_4 | 81,9 |  |
| DUPDECOR | 9680 | Hollowbell Abbey | bl_win_b | 34,10 |  |
| CONSOLE_WARN | 9684 | The Ringing Chamber |  |  | b891 no spot for b891_ropetally |
| ONEWAY | 9680 | Hollowbell Abbey | door | 82,38 | to 9670 The Barrow Hill, no way back |
| ONEWAY | 9685 | The Belfry of Hollowbell | portal | 7,10 | to 9684 The Ringing Chamber, no way back |
| ONEWAY | 9687 | An unfinished room | portal | 4,6 | to 9680 Hollowbell Abbey, no way back |
| ONEWAY | 9688 | An unfinished room | portal | 4,6 | to 9680 Hollowbell Abbey, no way back |
| ONEWAY | 9689 | An unfinished room | portal | 4,6 | to 9680 Hollowbell Abbey, no way back |
| NAMEPIC | 9680 | Hollowbell Abbey | gy_book | 64,46 | "The cracked bell mould" is bell, picture is book |

### Gallowmere (27 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 9641 | Osk Brine's House | gy_web | 1,1 |  |
| WEBFREE | 9641 | Osk Brine's House | gy_web | 11,1 |  |
| WEBFREE | 9641 | Osk Brine's House | gy_web | 1,7 |  |
| WEBFREE | 9641 | Osk Brine's House | gy_web | 11,7 |  |
| WEBFREE | 9642 | The Reeve's Flooded Hall | gy_web | 1,1 |  |
| WEBFREE | 9642 | The Reeve's Flooded Hall | gy_web | 13,1 |  |
| WEBFREE | 9642 | The Reeve's Flooded Hall | gy_web | 1,10 |  |
| WEBFREE | 9642 | The Reeve's Flooded Hall | gy_web | 13,10 |  |
| WEBFREE | 9643 | Nan Sallow's Cottage | gy_web | 1,1 |  |
| WEBFREE | 9643 | Nan Sallow's Cottage | gy_web | 9,1 |  |
| WEBFREE | 9643 | Nan Sallow's Cottage | gy_web | 1,7 |  |
| LOOSEDOOR | 9640 | Gallowmere | bl_arch | 19,38 |  |
| NPC_UNREACH | 9640 | Gallowmere | bl_mk1 | 67,11 | npc blg_marker |
| NPC_UNREACH | 9640 | Gallowmere | gy_ghost1 | 68,12 | npc blg_ghost1 |
| NPC_UNREACH | 9640 | Gallowmere | gy_mound | 70,12 | npc blg_bog |
| NPC_UNREACH | 9640 | Gallowmere | lamp | 69,13 | npc blg_lantern |
| NPC_UNREACH | 9640 | Gallowmere | b34_heron | 63,15 | npc blg_nest |
| FOE_CUT | 9640 | Gallowmere | tt1 | 34,55 | top at 1.50 (window about 1.0) |
| FLOAT | 9642 | The Reeve's Flooded Hall | lamp | 7,8 | gap 0.68 (pad 0.00, h 1.20, bob 0.68) |
| HOVER | 9642 | The Reeve's Flooded Hall | wl2_hall_1 | 7,0 | gap 0.30 (pad 0.00, h 1.32, bob 0.30) |
| INWALL | 9642 | The Reeve's Flooded Hall | wl2_hall_1 | 7,0 | g=28684 |
| ONEWAY | 9644 | An unfinished room | portal | 4,6 | to 9640 Gallowmere, no way back |
| ONEWAY | 9645 | An unfinished room | portal | 4,6 | to 9640 Gallowmere, no way back |
| ONEWAY | 9646 | An unfinished room | portal | 4,6 | to 9640 Gallowmere, no way back |
| ONEWAY | 9647 | An unfinished room | portal | 4,6 | to 9640 Gallowmere, no way back |
| ONEWAY | 9648 | An unfinished room | portal | 4,6 | to 9640 Gallowmere, no way back |
| ONEWAY | 9649 | An unfinished room | portal | 4,6 | to 9640 Gallowmere, no way back |

### Ironhill Road (25 findings in 4 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 7202 | Pennyworth's Provisions | gy_web | 1,1 |  |
| WEBFREE | 7202 | Pennyworth's Provisions | gy_web | 9,1 |  |
| ROUTEBLOCK | 10 | The Ironhill Road | gtree4 | 40,7 | mound at 40,6 to 8082 |
| ROUTEBLOCK | 10 | The Ironhill Road | pstump | 23,10 | mound at 22,10 to 7202 |
| ROUTEBLOCK | 10 | The Ironhill Road | ptree1 | 24,11 | mound at 22,10 to 7202 |
| ROUTEBLOCK | 10 | The Ironhill Road | ptree5 | 24,12 | mound at 22,10 to 7202 |
| ROUTEBLOCK | 10 | The Ironhill Road | gtree12 | 24,13 | mound at 22,10 to 7202 |
| ROUTEBLOCK | 10 | The Ironhill Road | ptree0 | 24,16 | mound at 22,10 to 7202 |
| ROUTEBLOCK | 10 | The Ironhill Road | wd_hill2 | 24,20 | mound at 22,10 to 7202 |
| ROUTEBLOCK | 10 | The Ironhill Road | gtree0 | 24,21 | mound at 22,10 to 7202 |
| CORRIDOR | 8080 | The Green Hall | rs_brick0 | 15,6 |  |
| CORRIDOR | 8082 | The Fallen Gatehouse | rs_brick0 | 19,18 |  |
| ARRIVE_WALL | 10 | The Ironhill Road | mound | 22,10 | to 7202 lands on 8,16 (off the map of 11x8) |
| ITEM_UNREACH | 10 | The Ironhill Road | cheese | 42,21 |  |
| ITEM_UNREACH | 10 | The Ironhill Road | healdraught | 40,26 |  |
| ITEM_UNREACH | 10 | The Ironhill Road | manadraught | 42,27 |  |
| NPC_UNREACH | 10 | The Ironhill Road | grave | 40,25 | npc p_lonely |
| DUPDECOR | 10 | The Ironhill Road | grocks | 13,3 |  |
| DUPDECOR | 10 | The Ironhill Road | grocks | 43,11 |  |
| DUPDECOR | 10 | The Ironhill Road | plog | 10,15 |  |
| DUPDECOR | 10 | The Ironhill Road | grocks | 27,19 |  |
| DUPDECOR | 10 | The Ironhill Road | grocks | 22,21 |  |
| FOE_STACK | 10 | The Ironhill Road | wolf | 45,13 |  |
| ONEWAY | 10 | The Ironhill Road | mound | 22,10 | to 7202 Pennyworth's Provisions, no way back |
| ONEWAY | 7202 | Pennyworth's Provisions | portal | 5,7 | to 600 Sale, no way back |

### Lanternrest Waystation (23 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| OVERLAP | 9660 | Lanternrest Waystation | bl_win_c | 26,12 | bl_win_a |
| WEBFREE | 9661 | The Last Lantern | gy_web | 1,1 |  |
| FLOAT | 9660 | Lanternrest Waystation | gy_book | 47,42 | gap 0.20 (pad 0.00, h 0.42, bob 0.20) |
| FLOAT | 9661 | The Last Lantern | lamp | 7,5 | gap 0.42 (pad 0.00, h 0.74, bob 0.42) |
| FLOAT | 9662 | The Garrison Armoury | gy_book | 9,6 | gap 0.20 (pad 0.00, h 0.38, bob 0.20) |
| FLOAT | 9664 | The Captain's Hall | gy_book | 3,3 | gap 0.20 (pad 0.00, h 0.38, bob 0.20) |
| FLOAT | 9664 | The Captain's Hall | wl2_library_5 | 2,6 | gap 0.11 (pad 0.00, h 1.08, bob 0.11) |
| FLOAT | 9666 | The Beacon Room | gy_book | 3,5 | gap 0.20 (pad 0.00, h 0.38, bob 0.20) |
| HOVER | 9661 | The Last Lantern | gy_sign | 1,5 | gap 0.20 (pad 0.00, h 1.08, bob 0.20) |
| HOVER | 9662 | The Garrison Armoury | wl2_armour_1 | 6,1 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| HOVER | 9662 | The Garrison Armoury | wl2_armour_1 | 1,3 | gap 0.20 (pad 0.00, h 0.84, bob 0.20) |
| HOVER | 9663 | The Stable and Forge | wl2_armour_1 | 3,1 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| HOVER | 9663 | The Stable and Forge | wl2_armour_1 | 1,5 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| HOVER | 9665 | The Infirmary | gy_book | 7,7 | gap 0.20 (pad 0.00, h 0.38, bob 0.20) |
| HOVER | 9666 | The Beacon Room | wl2_library_5 | 2,1 | gap 0.11 (pad 0.00, h 1.08, bob 0.11) |
| INWALL | 9663 | The Stable and Forge | crate | 14,4 | g=24091 |
| INWALL | 9665 | The Infirmary | wl2_smith_3 | 12,5 | g=28683 |
| DUPDECOR | 9661 | The Last Lantern | crate | 4,3 |  |
| DUPDECOR | 9661 | The Last Lantern | crate | 10,3 |  |
| ONEWAY | 9660 | Lanternrest Waystation | door | 1,60 | to 9670 The Barrow Hill, no way back |
| ONEWAY | 9667 | An unfinished room | portal | 4,6 | to 9660 Lanternrest Waystation, no way back |
| ONEWAY | 9668 | An unfinished room | portal | 4,6 | to 9660 Lanternrest Waystation, no way back |
| ONEWAY | 9669 | An unfinished room | portal | 4,6 | to 9660 Lanternrest Waystation, no way back |

### Ironhill (21 findings in 5 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 13 | Ironhill | sign_hsown | 44,4 | wall side -1,0 is open |
| NOWALL | 13 | Ironhill | sign_hsown | 45,4 | wall side 1,0 is open |
| NOWALL | 13 | Ironhill | sign_hsown | 40,14 | wall side 1,0 is open |
| NOWALL | 13 | Ironhill | sign_rubymaze | 34,25 | wall side 0,-1 is open |
| CORRIDOR | 13 | Ironhill | barrel | 17,22 |  |
| CORRIDOR | 13 | Ironhill | crate | 17,23 |  |
| CORRIDOR | 13 | Ironhill | crate | 34,23 |  |
| FOE_BLOCKED | 21 | Castle Dungeons | guard | 32,12 | on bench |
| LOOT_UNREACH | 13 | Ironhill | chest | 4,4 |  |
| LOOT_UNREACH | 13 | Ironhill | chest | 4,32 |  |
| NPC_UNREACH | 13 | Ironhill | miner | 6,24 | npc ih_fixer |
| INWALL | 13 | Ironhill | gboulder | 44,22 | g=132 |
| INWALL | 13 | Ironhill | grocks | 3,23 | g=128 |
| INWALL | 13 | Ironhill | miner | 6,24 | g=131 |
| DUPDECOR | 13 | Ironhill | grocks | 23,8 |  |
| DUPDECOR | 13 | Ironhill | grocks | 33,8 |  |
| ONEWAY | 13 | Ironhill | portal | 0,19 | to 11 The Ironhill Tunnel, no way back |
| ONEWAY | 21 | Castle Dungeons | portal | 37,20 | to 14 Ironhill Castle, no way back |
| ONEWAY | 3303 | Small House, Ironhill | portal | 5,7 | to 13 Ironhill, no way back |
| ONEWAY | 3304 | Medium House, Ironhill | portal | 5,10 | to 13 Ironhill, no way back |
| ONEWAY | 3305 | Large Mansion, Ironhill | portal | 18,18 | to 13 Ironhill, no way back |

### Bone Orchard (21 findings in 10 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 9651 | The Pressing Shed | gy_web | 1,1 |  |
| WEBFREE | 9652 | The Cider Cellar | gy_web | 1,1 |  |
| WEBFREE | 9653 | The Crypt of the Lost Patrol | gy_web | 1,1 |  |
| WEBFREE | 9654 | Mother Hesper's Hut | gy_web | 1,1 |  |
| WEBFREE | 9655 | The Harvest Hall | gy_web | 1,1 |  |
| ITEM_BLOCKED | 9650 | The Bone Orchard | potion6 | 30,40 | g=0 |
| MISSINGPIC | 9652 | The Cider Cellar | ale | 11,5 | npc bo_cask |
| FOE_CUT | 9650 | The Bone Orchard | tt2 | 70,60 | top at 1.38 (window about 1.0) |
| FLOAT | 9650 | The Bone Orchard | gy_book | 19,41 | gap 0.20 (pad 0.00, h 0.42, bob 0.20) |
| FLOAT | 9651 | The Pressing Shed | gy_book | 7,3 | gap 0.20 (pad 0.00, h 0.38, bob 0.20) |
| FLOAT | 9652 | The Cider Cellar | gy_book | 8,3 | gap 0.20 (pad 0.00, h 0.38, bob 0.20) |
| FLOAT | 9653 | The Crypt of the Lost Patrol | gy_book | 4,6 | gap 0.20 (pad 0.00, h 0.38, bob 0.20) |
| HOVER | 9654 | Mother Hesper's Hut | gy_book | 7,6 | gap 0.20 (pad 0.00, h 0.38, bob 0.20) |
| INWALL | 9654 | Mother Hesper's Hut | ww_crumbs | 6,7 | g=28683 |
| DUPDECOR | 9651 | The Pressing Shed | crate | 7,1 |  |
| DUPDECOR | 9655 | The Harvest Hall | crate | 5,4 |  |
| ONEWAY | 9652 | The Cider Cellar | portal | 6,8 | to 9651 The Pressing Shed, no way back |
| ONEWAY | 9656 | An unfinished room | portal | 4,6 | to 9650 The Bone Orchard, no way back |
| ONEWAY | 9657 | An unfinished room | portal | 4,6 | to 9650 The Bone Orchard, no way back |
| ONEWAY | 9658 | An unfinished room | portal | 4,6 | to 9650 The Bone Orchard, no way back |
| ONEWAY | 9659 | An unfinished room | portal | 4,6 | to 9650 The Bone Orchard, no way back |

### Saint Elen’s (17 findings in 8 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| OVERDOOR | 430 | Saint Elen’s Monastery | mw_rose | 60,14 | door 23250 |
| OVERDOOR | 430 | Saint Elen’s Monastery | mw_rose | 41,16 | door 23229 |
| FLOAT | 6900 | The Church of Saint Elen | mi_chand | 7,6 | gap 3.10 (pad 0.00, h 0.95, bob 3.10) |
| FLOAT | 6900 | The Church of Saint Elen | mi_chand | 7,11 | gap 3.10 (pad 0.00, h 0.95, bob 3.10) |
| FLOAT | 6900 | The Church of Saint Elen | mi_chand | 7,16 | gap 3.10 (pad 0.00, h 0.95, bob 3.10) |
| FLOAT | 6901 | The Refectory | mi_chand | 5,3 | gap 1.50 (pad 0.00, h 0.95, bob 1.50) |
| FLOAT | 6902 | The Scriptorium | mi_chand | 5,4 | gap 1.50 (pad 0.00, h 0.95, bob 1.50) |
| FLOAT | 6903 | The Kitchen | mi_chand | 4,3 | gap 1.50 (pad 0.00, h 0.95, bob 1.50) |
| FLOAT | 6904 | The Guest House | mi_chand | 6,3 | gap 1.50 (pad 0.00, h 0.95, bob 1.50) |
| FLOAT | 6905 | The Infirmary | mi_chand | 4,3 | gap 1.50 (pad 0.00, h 0.95, bob 1.50) |
| FLOAT | 6906 | The Chapel of the Lamps | mi_chand | 5,5 | gap 2.15 (pad 0.00, h 0.95, bob 2.15) |
| FLOAT | 6906 | The Chapel of the Lamps | mi_chand | 5,9 | gap 2.15 (pad 0.00, h 0.95, bob 2.15) |
| HUGE | 430 | Saint Elen’s Monastery | mw_rose | 60,14 | drawn 1.43 wide, 1.50 high (ceiling 5.20) |
| HUGE | 430 | Saint Elen’s Monastery | mw_rose | 41,16 | drawn 1.43 wide, 1.50 high (ceiling 5.20) |
| HUGE | 6900 | The Church of Saint Elen | mw_rose | 7,1 | drawn 1.43 wide, 1.50 high (ceiling 4.40) |
| HUGE | 6906 | The Chapel of the Lamps | mw_rose | 5,1 | drawn 1.43 wide, 1.50 high (ceiling 3.40) |
| NAMEPIC | 430 | Saint Elen’s Monastery | memorial | 38,18 | "The monastery bell" is bell, picture is grave |

### Thornwood (16 findings in 4 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| ROUTEBLOCK | 2 | The abbey grounds and the Thornwood | gtree3 | 37,10 | mound at 37,9 to 7200 |
| ROUTEBLOCK | 2 | The abbey grounds and the Thornwood | gtree6 | 47,23 | mound at 47,22 to 8016 |
| CORRIDOR | 8017 | The Forgotten Shrine | rs_brick2 | 14,3 |  |
| FOE_BLOCKED | 2 | The abbey grounds and the Thornwood | skel | 42,13 | on tree4 |
| ITEM_BLOCKED | 2 | The abbey grounds and the Thornwood | cheese | 42,17 | g=0 |
| DUPDECOR | 2 | The abbey grounds and the Thornwood | grocks | 19,6 |  |
| DUPDECOR | 2 | The abbey grounds and the Thornwood | gfungus | 19,7 |  |
| DUPDECOR | 2 | The abbey grounds and the Thornwood | flora9 | 52,11 |  |
| DUPDECOR | 2 | The abbey grounds and the Thornwood | gfungus | 17,15 |  |
| DUPDECOR | 2 | The abbey grounds and the Thornwood | flora3 | 32,16 |  |
| DUPDECOR | 2 | The abbey grounds and the Thornwood | grocks | 38,21 |  |
| DUPDECOR | 2 | The abbey grounds and the Thornwood | grocks | 49,26 |  |
| DUPDECOR | 2 | The abbey grounds and the Thornwood | grocks | 35,35 |  |
| ONEWAY | 8017 | The Forgotten Shrine | door | 16,23 | to 2 The abbey grounds and the Thornwood, no way back |
| ONEWAY | 8018 | The Mossy Vault | door | 16,23 | to 2 The abbey grounds and the Thornwood, no way back |
| ONEWAY | 8019 | The Vine-Choked Cellar | door | 16,23 | to 2 The abbey grounds and the Thornwood, no way back |

### Blackbriar Wood (16 findings in 8 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 7207 | Marrowbone's Remedies | gy_web | 1,1 |  |
| WEBFREE | 7207 | Marrowbone's Remedies | gy_web | 9,1 |  |
| CORRIDOR | 12161 | The Tangled Crypt | rs_brick2 | 9,11 |  |
| CORRIDOR | 12163 | The Ivy Chapel | rs_brick2 | 11,10 |  |
| ARRIVE_WALL | 520 | Blackbriar Wood | mound | 7,21 | to 7207 lands on 8,16 (off the map of 11x8) |
| MISSINGPIC | 7208 | The Hounds’ Hollow | lantern | 9,16 |  |
| MISSINGPIC | 12160 | The Vine-Choked Cellar | lantern | 17,22 |  |
| MISSINGPIC | 12161 | The Tangled Crypt | lantern | 17,22 |  |
| MISSINGPIC | 12162 | The Green Hall | lantern | 17,22 |  |
| MISSINGPIC | 12163 | The Ivy Chapel | lantern | 17,22 |  |
| NPC_TALL | 523 | Grisselda's Kitchen | wwi_witchA | 6,4 | h 2.60 npc wwo_witchc |
| INWALL | 7207 | Marrowbone's Remedies | crate | 0,1 | g=28684 |
| ONEWAY | 520 | Blackbriar Wood | mound | 7,21 | to 7207 Marrowbone's Remedies, no way back |
| ONEWAY | 7207 | Marrowbone's Remedies | portal | 5,7 | to 600 Sale, no way back |
| ONEWAY | 12162 | The Green Hall | door | 16,23 | to 520 Blackbriar Wood, no way back |
| ONEWAY | 12163 | The Ivy Chapel | door | 16,23 | to 520 Blackbriar Wood, no way back |

### Greyfang Pass (14 findings in 5 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 7204 | Ironbrow's Armoury | gy_web | 1,1 |  |
| WEBFREE | 7204 | Ironbrow's Armoury | gy_web | 11,1 |  |
| CORRIDOR | 8177 | The Forgotten Shrine | rs_brick2 | 21,3 |  |
| CORRIDOR | 8179 | The Old Watchpost | rs_brick1 | 16,15 |  |
| ARRIVE_WALL | 22 | The Greyfang Pass | mound | 74,36 | to 7204 lands on 8,16 (off the map of 13x9) |
| HOVER | 7204 | Ironbrow's Armoury | wl2_armour_1 | 4,1 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| HOVER | 7204 | Ironbrow's Armoury | wl2_armour_1 | 6,1 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| HOVER | 7204 | Ironbrow's Armoury | wl2_armour_1 | 10,1 | gap 0.30 (pad 0.00, h 0.84, bob 0.30) |
| HOVER | 7204 | Ironbrow's Armoury | wl2_armour_1 | 1,3 | gap 0.20 (pad 0.00, h 0.84, bob 0.20) |
| ONEWAY | 22 | The Greyfang Pass | mound | 74,36 | to 7204 Ironbrow's Armoury, no way back |
| ONEWAY | 7204 | Ironbrow's Armoury | portal | 6,8 | to 600 Sale, no way back |
| ONEWAY | 8177 | The Forgotten Shrine | door | 16,23 | to 22 The Greyfang Pass, no way back |
| ONEWAY | 8178 | The Sunken Hall | door | 16,23 | to 22 The Greyfang Pass, no way back |
| ONEWAY | 8179 | The Old Watchpost | door | 16,23 | to 22 The Greyfang Pass, no way back |

### Gandrick's Wood (11 findings in 4 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| CORRIDOR | 8059 | The Green Hall | rs_brick1 | 6,9 |  |
| ITEM_UNREACH | 7 | Gandrick's Wood | manadraught | 4,12 |  |
| ITEM_UNREACH | 8058 | The Sunken Hall | manadraught | 3,2 |  |
| DUPDECOR | 7 | Gandrick's Wood | grocks | 9,3 |  |
| DUPDECOR | 7 | Gandrick's Wood | gboulder | 31,13 |  |
| DUPDECOR | 7 | Gandrick's Wood | gfungus | 27,14 |  |
| DUPDECOR | 7 | Gandrick's Wood | flora1 | 12,22 |  |
| FOE_STACK | 7 | Gandrick's Wood | wolf | 22,3 |  |
| ONEWAY | 8056 | The Sunken Hall | door | 16,23 | to 7 Gandrick's Wood, no way back |
| ONEWAY | 8058 | The Sunken Hall | door | 16,23 | to 7 Gandrick's Wood, no way back |
| ONEWAY | 8059 | The Green Hall | door | 16,23 | to 7 Gandrick's Wood, no way back |

### The Violet Erg (11 findings in 6 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| CORRIDOR | 8496 | The Overgrown Ruin | rs_brick1 | 8,13 |  |
| CORRIDOR | 8497 | The Ivy Chapel | rs_brick0 | 7,14 |  |
| CORRIDOR | 8497 | The Ivy Chapel | rs_brick2 | 14,14 |  |
| CORRIDOR | 8498 | The Sunken Hall | rs_brick2 | 9,2 |  |
| CORRIDOR | 8499 | The Overgrown Ruin | rs_brick2 | 5,6 |  |
| ITEM_BLOCKED | 62 | The Violet Erg | superiorheal | 164,172 | g=0 |
| ITEM_UNREACH | 266 | The Tunnel to the Narrow Sea | herb_comfrey | 24,4 |  |
| ITEM_UNREACH | 266 | The Tunnel to the Narrow Sea | herb_lavender | 20,12 |  |
| ONEWAY | 266 | The Tunnel to the Narrow Sea | portal | 15,18 | to 62 The Violet Erg, no way back |
| ONEWAY | 8498 | The Sunken Hall | door | 16,23 | to 62 The Violet Erg, no way back |
| ONEWAY | 8499 | The Overgrown Ruin | door | 16,23 | to 62 The Violet Erg, no way back |

### Anaea (9 findings in 4 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 33 | Anaea | sign_hsown | 44,15 | wall side 1,0 is open |
| NOWALL | 33 | Anaea | sign_hsown | 40,17 | wall side 0,1 is open |
| NOWALL | 33 | Anaea | sign_hsown | 45,26 | wall side -1,0 is open |
| ITEM_UNREACH | 33 | Anaea | herb_rosemary | 31,5 |  |
| ITEM_UNREACH | 33 | Anaea | herb_comfrey | 12,7 |  |
| DUPDECOR | 33 | Anaea | boulder | 16,28 |  |
| ONEWAY | 3309 | Small House, Anaea | portal | 5,7 | to 33 Anaea, no way back |
| ONEWAY | 3310 | Medium House, Anaea | portal | 5,10 | to 33 Anaea, no way back |
| ONEWAY | 3311 | Large Mansion, Anaea | portal | 18,18 | to 33 Anaea, no way back |

### The Orange Spire (9 findings in 7 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 451 | The Orange Spire, level 12 | hl_p_banner | 17,11 | wall side 0,-1 is open |
| NOWALL | 458 | The Orange Spire, level 19 | msgr_A | 20,6 | wall side 0,1 is open |
| NOWALL | 458 | The Orange Spire, level 19 | msgr_T | 5,16 | wall side 0,1 is open |
| LOOSEDOOR | 364 | The Hollow Land | hg_gate | 62,57 |  |
| LOOT_UNREACH | 444 | The Orange Spire, level 5 | chest | 9,19 |  |
| LOOT_UNREACH | 445 | The Orange Spire, level 6 | chest | 3,13 |  |
| LOOT_UNREACH | 452 | The Orange Spire, level 13 | chest | 32,29 |  |
| FOE_STACK | 452 | The Orange Spire, level 13 | hlvictim | 18,4 |  |
| FOE_STACK | 454 | The Orange Spire, level 15 | hlvictim | 27,5 |  |

### The Maze of Gardens (9 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 490 | The Maze of Gardens | sign_gm | 45,71 | wall side 0,-1 is open |
| OVERLAP | 490 | The Maze of Gardens | gm_trellis | 12,27 | sign_gm |
| OVERLAP | 490 | The Maze of Gardens | gm_trellis | 10,37 | gm_niche |
| OVERLAP | 490 | The Maze of Gardens | sign_gm | 57,47 | gm_trellis |
| OVERLAP | 490 | The Maze of Gardens | gm_niche | 12,53 | sign_gm |
| ROUTEBLOCK | 490 | The Maze of Gardens | gm_rose_red | 45,89 | door at 45,90 to 475 |
| NPC_TALL | 490 | The Maze of Gardens | gm_saint | 45,23 | h 1.70 npc gmo_prompter |
| DUPDECOR | 490 | The Maze of Gardens | gm_lavender | 51,65 |  |
| ONEWAY | 490 | The Maze of Gardens | door | 45,90 | to 475 The Deeper Hollow, no way back |

### Ironhill Moor (8 findings in 4 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| ROUTEBLOCK | 19 | Ironhill Moor | gtree4 | 40,7 | mound at 40,6 to 8152 |
| ROUTEBLOCK | 19 | Ironhill Moor | gtree4 | 56,34 | mound at 56,33 to 7203 |
| CORRIDOR | 8153 | The Vine-Choked Cellar | rs_brick0 | 19,6 |  |
| FOE_STACK | 19 | Ironhill Moor | bandit | 59,21 |  |
| ONEWAY | 8153 | The Vine-Choked Cellar | door | 16,23 | to 19 Ironhill Moor, no way back |
| ONEWAY | 8154 | The Old Watchpost | door | 16,23 | to 19 Ironhill Moor, no way back |
| ONEWAY | 8155 | The Ivy Chapel | door | 16,23 | to 19 Ironhill Moor, no way back |
| NAMEPIC | 19 | Ironhill Moor | statue | 46,30 | "The standing stones" is stone, picture is statue |

### The Open Sea (8 findings in 7 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| LOOSEDOOR | 336 | Cormorant Ledge | yar_arch | 39,23 |  |
| LOOSEDOOR | 337 | Kelpgate Rock | yar_arch | 34,18 |  |
| LOOSEDOOR | 339 | Wrack Point | yar_arch | 25,40 |  |
| LOOSEDOOR | 340 | Greenmantle | yar_arch | 103,64 |  |
| LOOSEDOOR | 341 | The Hollow Isle | yar_arch | 83,86 |  |
| LOOSEDOOR | 342 | Ashwood | yar_arch | 31,51 |  |
| LOOSEDOOR | 343 | Leviathan's Rest | yar_arch | 36,18 |  |
| FOE_STACK | 341 | The Hollow Isle | skel | 80,58 |  |

### Below the Abbey (7 findings in 3 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| CORRIDOR | 362 | The Ossuary of Brothers | coffin | 23,10 |  |
| CORRIDOR | 362 | The Ossuary of Brothers | coffin | 6,11 |  |
| CORRIDOR | 362 | The Ossuary of Brothers | barrel | 30,12 |  |
| CORRIDOR | 363 | The Hollow Abbey | barrel | 14,6 |  |
| ITEM_UNREACH | 362 | The Ossuary of Brothers | manadraught | 22,2 |  |
| NPC_UNREACH | 362 | The Ossuary of Brothers | grave | 23,3 | npc epitaph |
| ONEWAY | 360 | The Sealed Stair | portal | 15,21 | to 1 The crypts below the abbey, no way back |

### Thornwick (6 findings in 3 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 3 | Thornwick | sign_hsown | 40,16 | wall side 0,-1 is open |
| CORRIDOR | 3 | Thornwick | barrel | 29,22 |  |
| DUPDECOR | 3 | Thornwick | grocks | 20,30 |  |
| ONEWAY | 3 | Thornwick | portal | 0,17 | to 2 The abbey grounds and the Thornwood, no way back |
| ONEWAY | 12 | The Well Cellar | portal | 3,10 | to 3 Thornwick, no way back |
| ONEWAY | 3300 | Small House, Thornwick | portal | 5,7 | to 3 Thornwick, no way back |

### The Grey Charnel (6 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 533 | The Grey Charnel | sign_gy | 3,27 | wall side 0,-1 is open |
| WEBFREE | 533 | The Grey Charnel | gy_web | 5,9 |  |
| WEBFREE | 533 | The Grey Charnel | gy_web | 29,18 |  |
| WEBFREE | 533 | The Grey Charnel | gy_web | 28,19 |  |
| WEBFREE | 533 | The Grey Charnel | gy_web | 14,25 |  |
| WEBFREE | 533 | The Grey Charnel | gy_web | 14,26 |  |

### The Drowned Maze (5 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| DUPDECOR | 477 | The Drowned Maze | art_hgxprop2 | 33,1 |  |
| DUPDECOR | 477 | The Drowned Maze | art_hgxprop0 | 38,37 |  |
| NAMEPIC | 477 | The Drowned Maze | art_wm_shrine | 33,1 | "A note on the wall" is book, picture is altar |
| NAMEPIC | 477 | The Drowned Maze | art_wm_bell | 17,17 | "A note on the wall" is book, picture is bell |
| NAMEPIC | 477 | The Drowned Maze | art_wm_boat | 11,35 | "A note on the wall" is book, picture is boat |

### The Golden Erg (5 findings in 4 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| CORRIDOR | 8488 | The Overgrown Ruin | rs_brick2 | 9,4 |  |
| CORRIDOR | 8489 | The Forgotten Shrine | rs_brick0 | 22,13 |  |
| CORRIDOR | 8491 | The Mossy Vault | rs_brick2 | 22,20 |  |
| ONEWAY | 8490 | The Vine-Choked Cellar | door | 16,23 | to 61 The Golden Erg, no way back |
| ONEWAY | 8491 | The Mossy Vault | door | 16,23 | to 61 The Golden Erg, no way back |

### Golden Crypt (3 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 31 | The Golden Crypt | lever | 8,8 | wall side -1,0 is open |
| ITEM_BLOCKED | 31 | The Golden Crypt | potion2 | 27,3 | g=0 |
| ITEMDEF | 31 | The Golden Crypt | goldkey | 31,16 |  |

### The Black Barrow (3 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 534 | The Black Barrow | sign_gy | 3,27 | wall side 0,-1 is open |
| WEBFREE | 534 | The Black Barrow | gy_web | 25,17 |  |
| WEBFREE | 534 | The Black Barrow | gy_web | 7,23 |  |

### The White Dunes (3 findings in 2 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| CORRIDOR | 8504 | The Vine-Choked Cellar | rs_brick2 | 21,3 |  |
| CORRIDOR | 8507 | The Green Hall | rs_brick0 | 24,9 |  |
| ONEWAY | 8507 | The Green Hall | door | 16,23 | to 63 The White Dunes, no way back |

### The Blue Dunes (2 findings in 2 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| CORRIDOR | 8481 | The Old Watchpost | rs_brick2 | 7,6 |  |
| ITEM_BLOCKED | 60 | The Blue Dunes | apple | 106,113 | g=0 |

### The Never-Ending Tower (2 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| SIGNTEXT | 1000000000 | The Crooked Tower | sign_gy | 15,4 | Each floor is one level higher than the last |
| SIGNTEXT | 1000000000 | The Crooked Tower | sign_gy | 22,26 | North of the Pale Spire |

### Burial Ground (1 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| FOE_BLOCKED | 20 | Ironhill Burial Ground | ghost | 2,7 | on tree6 |

### Cinder Isle (1 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| FOE_STACK | 302 | Cinder Isle | skel | 45,32 |  |

### The Violet Tower (1 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| ONEWAY | 460 | The Foot of the Violet Tower | portal | 9,11 | to 459 The Orange Spire, level 20, no way back |

### Under the Well (1 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| ONEWAY | 501 | Under the Well | portal | 3,18 | to 3 Thornwick, no way back |

### The Red Ossuary (1 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| NOWALL | 532 | The Red Ossuary | sign_gy | 3,27 | wall side 0,-1 is open |

### The Pale Catacombs (1 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| WEBFREE | 535 | The Pale Catacombs | gy_web | 1,1 |  |

### The Flatlands (1 findings in 1 levels)

| Code | Level | Name | Key | x,y | Extra |
|---|---|---|---|---|---|
| ONEWAY | 8515 | The Green Hall | door | 16,23 | to 64 The Flatlands, no way back |

## Allowed (recorded, not hidden)

| Reason | Count |
|---|---|
| Sale: planks nailed across the boarded-up doors, drawn on the door square on purpose | 10 |
| Pale Spire Great Halls: the Painters' Closet (4..6,38..41) opens with the brass key (same secret tools/ps_test.py reach allows) | 2 |
| the Crooked Road gate into the Never-Ending Tower: the tower's own south gate leads back (tools/ps_test.py dest checks it) | 1 |


## What the audit cannot see (be honest about this)

- **Anything that only happens while playing.** Levels are checked as built, not after quests, cutscenes, the day and night, storms,
  flooding, infestations or story flags move things. Enter hooks (`afflEnter`, `yarEnter`, `uwEnterHook`, `seaEnterHook`, `bathEnter`)
  are not run per level; `reset(id)` clears `G.flags`, so pieces that appear only with a flag set are not seen.
- **Door presses.** Destinations are read from `KH_DOOR`, portals and mound `enter` data. The audit does not press doors with `doMove`
  (only `tools/ps_test.py dest` does that, for the castle). A door tile whose level has no `khBump` route in `doMove`/`desertBump`, a door
  that a wrapper redirects, or a door that is locked by a flag, is not caught. ONEWAY is a review list: many "one-way" rooms are
  entered by a mechanism the link graph does not read (trapdoors, talk options, boats, ladders made by npc decor), so a missing way
  back in the graph is not always a missing way back in the game.
- **Boats, swimming, diving, the sea map, levers and keys in order.** Reach treats key doors, lever targets and hidden castle doors as
  open and never models boats or diving helms. Chests on islands of the Deeper Hollow and the Drowned Maze are listed as unreachable
  although a boat may reach them; a lever behind its own wall is treated as pulled.
- **Things seen from far or from an angle.** No screenshots: a picture that is the right size but the wrong picture, a roof that pokes
  through the sky, z-fighting, a sign that reads badly, an angled (non front elevation) painting, a wrong colour or a figure cut off at
  the waist are not seen. NAMEPIC is only a word heuristic (name says rose, key says stone) for a person to check.
- **People and creature heights are heuristics.** NPC_TALL and NPC_SHORT only look at tall, narrow pictures of clickable pieces whose key
  does not name an object; statues, scarecrows and ghosts slip in and out. FOE_CUT is computed from the fit rule (drawn height plus
  float above 1.0 of the window); `tools/ps_battle_audit.py` measures the real fight window and is the judge for a specific creature.
- **Grounding of 3D models and custom drawers.** Pieces drawn as `hgtm` 3D models, fish tanks (`hgtk_*`), the Khemetra walkers and the
  sky lists are skipped. Terraced levels add the engine's 0.06 settle; the exact foot height on a slope (`terrFoot`) is not measured.
- **Flora is excused.** Trees, bushes, grass, ferns, vines and moss are excused from INWALL, DUPDECOR and SINK (forests use trees on wall
  squares as the forest wall), so a real misplaced tree is not reported.
- **Loading is real but local.** Pictures load from the local server; a request the server drops shows as `LOAD404 ... failed` and a
  MISSINGPIC that is not there in the next run. Re-run before fixing a lone missing picture. Sound files are not checked.
- **Generated houses are audited one by one.** About 11,000 of the 12,933 levels are generated house interiors and cellars; one bad
  template shows up thousands of times (HOVER), so count by source file, not by number.

## Proposed split of the fixing work

Each chunk owns its files and only those files; none of them edits the engine part of `index.html` (outside the injected block) or a
file owned by another chunk. Everyone runs `python tools/inject.py` after editing (the injected block is regenerated as a whole, so
commit chunk by chunk and rebase before injecting), then `python tools/game_audit.py --area <their area>` until their counts are zero
or every remaining finding is in `tools/game_audit_allow.json` with a reason. A finding that needs a file outside the chunk goes back to
the coordinator instead of being fixed in place.

| Chunk | Areas | Owns these source files | Main findings to clear |
|---|---|---|---|
| A. House interiors | every generated house (Khemetra, Oldhaven, Hollow towns) | `khemetra_build.js` (scene table and `KH_HOUSE_NEXT`) | HOVER about 2,800 (`kitchenshelf`, `tapestry`, `shrine`, `hlamp`), DUPDECOR corpses in Khemetra houses; with chunk C the house number clash (DEST_SHARED 38) |
| B. Blighted Road, west half | Toll House, Ashenfold Farm, Church of the Hollow Saint, Gallowmere, Bone Orchard | `blight_toll.js`, `blight_ashenfold.js`, `blight_church.js`, `blight_gallowmere.js`, `blight_orchard.js`, `blight_polish14.js`, `blight_kit.js`, `blight_glue.js` | WEBFREE (corner webs, `blight_polish14.js` line 95), LOOSEDOOR `bl_arch`, NPC_TALL ghosts and saint, NPC_UNREACH at Gallowmere's islet, FOE_CUT `tt0`..`tt2`, MISSINGPIC `ale` |
| C. Blighted Road, east half | Lanternrest, Hollowbell Abbey, Rookery Mill, Pale Bridge, the road itself | `blight_lanternrest.js`, `blight_hollowbell.js`, `blight_rookery.js`, `blight_palebridge.js`, `blight_road.js`, `blight_polish34.js`, `blight58_polish.js`, `blight_late.js`, `blight_growths.js`, `blight_titans.js` | FLOAT `b9_twig` (59), HOVER, OVERLAP windows `bl_win_*`, the `b891_ropetally` console warning, FOE_CUT `tt3`..`tt5` |
| D. The Vault | Vault of Maldrake (9670s) | `vault_build.js`, `vault_core.js`, `vault_floors.js`, `vault_hill.js`, `vault_story.js`, `vault_boss.js` | NOWALL `sign_gy` (11), WEBFREE (35), NPC_TALL `gy_zombie` villagers |
| E. Sale | Sale and its houses, crypt, belfry | `sale_town.js`, `sale_rooms.js`, `sale_folk.js`, `sale_quests.js`, `sale_art.js` | WEBFREE 96 (`sale_rooms.js` lines 93 and 102 add two corner webs to every room), INWALL crates, ONEWAY portals (review) |
| F. Hollow Grasslands towns | Exsce 481, Ulb 482, Glorm 483, Nibb 484, the maze 486, their rooms | `hgt_town_*.js`, `hgt_rooms.js`, `hgt_lamps.js`, `hgt_lib.js`, `hgt_maze.js`, `hgt_art*.js` | INWALL 499 (Nibb's garden lanterns), MISSINGPIC `hgt_arch` 42, CORRIDOR and LOOT_UNREACH in the rooms, DEST_SHARED with chunk A, START_BLOCKED 5180 |
| G. Hollow Grasslands outdoors and hives | 470 to 474 | `hollowgrass*.js`, `hg_hives.js`, `hg_rescue.js` | LOOSEDOOR `hg_arch`, DUPDECOR palisades and lamps, SINK frogs (bob -0.5), FLOAT bound folk in the hives, FOE_CUT `hgins9` |
| H. Deeper Hollow, Underlevel, Drowned Maze | 475, 476, 477 | `hgd_*.js`, `hgt_deeper.js` | LOOT_UNREACH (check by boat first), HUGE vines `art_hgdf_vine*`, FLOAT huts and swimmers, FOE_CUT `hgusl9` and `hgdemon*`, FOE_FLOAT `hgusl3` |
| I. Wenlock town and houses | 496 and 7000s | `wenlock_*.js` (not the graveyard) | INWALL crates on the outer wall row, HOVER `wl2_hall_1`, NOWALL `sign_wlnote`, (the `sign_hsown` player-house signs belong to chunk N, `housing.js`) |
| J. Graveyards and catacombs | Wenlock Graveyard 530s, Red Ossuary, Grey Charnel, Black Barrow, Pale Catacombs | `gy_*.js` | WEBFREE 120, NOWALL |
| K. Well Maze, Gardens, Blackbriar | 490s, 497 to 502, 520s | `wellmaze_*.js`, `garden_*.js`, `ww_*.js` | LOOT_UNREACH 38 in the Well Maze, OVERLAP in the Gardens, MISSINGPIC `wm_barrel_stack`, `lantern` |
| L. Oldhaven, the Pilgrim's Path, Oakwood, Saint Elen's | 304 to 311, 400 to 434, 6900s, forest caves | `oldhaven*.js`, `landpath.js`, `pilgrim.js`, `pforest.js`, `passpath.js`, `monastery*.js`, `wilds.js`, `wd_hills.js` | NPC_UNREACH graves and benches, INWALL fence, OUTSIDE `ironfence` at x 104, CORRIDOR `rs_brick` rubble, ROUTEBLOCK trees round cave mounds, FLOAT `mi_chand` |
| M. Khemetra city, Yarrim, the sea | 44, 199 to 274, 289 to 343 | `khemetra_city.js`, `khemetra_main.js`, `khemetra_map.js`, `yarrim*.js`, `seas.js`, `underwater.js`, `voyage.js` | LOOSEDOOR `yar_arch` 55 in the Drowned Abbey (321), INWALL ship parts in Yarrim houses, ROUTEBLOCK stumps at 33,216 |
| N. The known lands and the deserts | 1 to 40, 41 to 65, burrows, desert dungeons | `maps_*.js` for those places, `housing.js`, `dunes.js`, `road.js`, `burrows.js`, `dungeons.js`, `tomb.js` | FLOAT `dplant2` (52), ARRIVE_WALL mound landings on the Sand Road, DUPDECOR rocks, `sign_hsown` NOWALL (player houses, `housing.js`), ITEMDEF `goldkey` in the Golden Crypt |
| O. Castle residue | Pale Spire, Never-Ending Tower | `ps_*.js`, `nt_*.js` | WDLOOSE red lanterns in the dungeons, NAN teleporter in 9730, ARRIVE_WALL to unbuilt rooms, SIGNTEXT two tower signs, the three `psh/psw missed` warnings |
| P. Coordinator | global | `tools/game_audit*.py/json`, assets | LOAD404 `af_hagblind.png`, UNBUILT review (541 lazy numbers that never build), ONEWAY review list, new allowlist entries with reasons |

Order: A and E first (two small edits clear about 2,900 findings), then B, C, D (the Blighted Lands, the owner's priority), then F to O
in any order and in parallel.
