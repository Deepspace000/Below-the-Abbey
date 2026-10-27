# The Wenlock Graveyard and Crypt: HANDOVER (work paused by the owner, switched OFF)

## State in one paragraph
Most of it is built and was tested piece by piece, but it was never played through end to end after the last changes, and it is **switched off**: `const GY_ENABLED=false` in `src/desert/gy_list.js` (written by `tools/gy_list.py`, whose `ENABLED = False` line is the real switch; regenerate with `python tools/gy_list.py`, then `python tools/inject.py`).
Off means: no lane and no gate in Wenlock, no Go to area rows, no `?town=graveyard` link, and the pictures are not loaded with the town. The levels, quests and items still exist in memory but cannot be reached, and nothing in them runs. Checked with the flag off: `tools/wl_walk.py` (copy with port 8373) passes with no console errors.
**To turn it on:** set `ENABLED = True` in `tools/gy_list.py`, run `python tools/gy_list.py` and `python tools/inject.py`. Nothing else. Do not bump the version, commit or push without the owner.

## What is DONE (and how far it was checked)
- **Pictures**: 100 painted pieces in `assets/gy` (Gemini, cut with `tools/ingest_gy.py`): Lady Aldith in three poses, four mini-bosses, 13 creatures, stones, trees, gates, crypt furnishings, relics, fences, props, four brick texture sets (6 variants each), 6 floors. All looked at. Raw sheets were in a temp folder and are not kept; the cut pieces are the master.
- **Graveyard 530** (70 by 70, rated 84): gate path, plaza and tomb, four doors, ruined chapel, family plot with Sir Edmund's stone and Aldith's unnamed grave, gravedigger's hut, 55 readable epitaphs, yews, ravens, lanterns, dusk mist. Builds, flood fill clean, screenshots looked at. A little dark.
- **Crypt 531**: built, ghost standing in it looked good. After the ending it becomes a lit shrine (code written, tested once by function).
- **Mazes 532 to 535** (31 by 31, levels 84, 85, 86, 87): generator, brick walls, rooms, creatures, quest objects, boss room and door, self-check (all clean). **Walls were then changed to 1.3 high (`GYM.WH`) so that the torches sit at hand height; the props were scaled .75 for that; the creatures, bosses and rooms have NOT been looked at again at the new height.**
- **Coloured wall torches** (the owner's addition): each maze has torches of one flame colour that light the walls and floor in that colour, flickering, at junctions, along corridors and in the boss chamber (25 each). Engine painted torch bracket plus code-drawn flames (`gyFlames` in `gy_art.js` adds blue and yellow to the engine's orange, red and purple; one line added in `index.html` where the flame is drawn: `L.fl`). **Mapping used: 532 RED, 533 YELLOW, 534 BLUE, 535 PURPLE.** The owner's list said 532 blue, 533 red, 534 yellow, 535 purple but also said to pick what suits the brick and creatures; if the owner wants their list exactly, change `torch:{fl,col,name,css}` and `lcol` of each entry in `GYM_SPEC` (`gy_mazes.js`): fl 1 red (and `red:true`), 2 purple, 3 blue, 4 yellow. Screenshots looked at: all four colours read clearly; the purple in the bone-white maze is rather bright.
- **Bosses**: four ENEMY_DEFs (Vane, Grimsby, Aldric, Morwenna) at hp 15,010 / 16,498 / 18,005 / 20,009 and 8 to 15 base damage (about 340 to 450 a blow), special moves on a count, helpers at 2/3 and 1/3, relic and last words on death, return to the graveyard, no respawn. Tested by calling the real functions, never fought for real.
- **Quests**: gyq1 to gyq5 (ring/key, name-stone/levers, locket/hunt of eight spirits, book/trapped chest, the grave), Lady Aldith's talk, the ending in five steps, bell in Wenlock, new lines for four Wenlock people, rewards (about 70,000 xp and 42,000 gold plus lantern, sword, ring, rose). Run end to end by `tools/gy_qtest.js` once: all passed except two test faults I had already fixed (the boss room was shut by a candle standing on the door square; the bell message was lost from the 6-line message list). **The last full run after those fixes and the torch change did not finish: run it again first.**
- **Level 84 to 87 cap code**: nothing in the engine caps below 87 (looked at `xpcap.js`, `hollowscale.js`, `area_levels.js`, `difficulty.js`, `hgd_balance.js`, `levelUp`). The Go to level `+` button capped at 80 in `index.html`, now 88. The graveyard jump link clamps at 87 itself.
- **Maps**: `gy_maps.js` draws parchment maps for all six levels, with the torches as coloured dots and a key row. The map screenshots (`tools/gy_test.py mapshots`) were taken but **not looked at yet**.

## What is NOT done or not checked (do in this order)
1. Set the flag on, run `python tools/gy_test.py load` and `quests` (see below). Fix whatever fails.
2. Look at the maze at the new wall height: `python tools/gy_test.py mazeshots` and `torchshots`; check creature and boss sizes, props, the plaque in the start room, the boss door.
3. Look at the map screenshots; fix the map drawing if ugly (`gyMapDraw`).
4. Brighten the graveyard a little more if the owner wants (`weatherNow` in `gy_art.js`, `day` and `amb` in `gy_yard.js`).
5. Play a boss fight for real with a level 84 party (`?town=graveyard&lvl=84&k=1`), tune `dmg` in `gy_art.js` and `GY_BOSSMOVES` in `gy_boss.js`. A front hero has about 1,350 health in jump gear.
6. Check the Wenlock side: gate tile in the west wall at (2,31) at the end of Churchyard Lane (y=31), the lych-gate sprite, and run `tools/wl_walk.py` again with the flag on.
7. Look at saves: quit in a maze and reload (`gyArrive`, door state, lights); `restore` waits for the pictures.
8. Then only: tell the owner; version bump, commit, push, itch (see CLAUDE.md).

## Files (all in `src/desert`, after the witch's wood in `tools/inject.py` ORDER; `gy_list.js` first of mine)
`gy_list.js` (generated: GY_ENABLED, GY_LIST), `gy_art.js` (ids `GY`, loader, aliases `GYA`, floors, `gyTile`, creatures and bosses, items, weather, hooks, `gyFlames`), `gy_yard.js` (graveyard 530, epitaphs `GY_EPI`, `gyWenlockGate`), `gy_crypt.js` (531), `gy_mazes.js` (`GYM_SPEC`, `gyMazeGen`, `gyMazeBuild`, `gyMazeCheck`, torch plan), `gy_boss.js` (boss moves, deaths, doors, lights and torches in a `setupLights` hook, chests), `gy_quests.js` (quests, talk, levers, chests, the grave and the ending), `gy_maps.js` (maps, Go to rows, jump link).
Shared files touched, one small edit each: `wk_ids.js` (appended `WK.GRAVE...`), `wenlock_town.js` (one call to `gyWenlockGate` after the witch's gate), `tools/inject.py` (ORDER entries), `index.html` (the `+` button 80 to 88; `L.fl` in the torch flame line).
Tools: `tools/ingest_gy.py` (`auto=1` finds pieces by the gaps, `soft=1` thin parts, `unmix=` takes magenta out of dark/grey see-through pieces, `unpink=`, `alpha=` `fade=` ghosts), `tools/gy_list.py`, `tools/gy_contact.py` (montage), `tools/gy_test.py` and `tools/gy_qtest.js`.
Important engine facts learned: `G.decor` keeps only a few fields of a piece (not `i`; look it up by square in `LEVELS[n].decor`, see `gyI`); `G.talk` is an object `{d,n,node,t,btns}`, an option function returns the next node or null; `setupLights` empties `LIGHTS` after `loadLevel`, so lights are added by wrapping it; `goToLevel` turns the party away from a wall, so set `G.P.f` after arriving in tests; creatures are scaled to fit the window unless listed in `HUGE_FOES`; headless game time runs slowly (timers like `later(1500)` take several seconds).

## Ids and links (with the flag on)
530 graveyard, 531 crypt, 532 The Red Ossuary, 533 The Grey Charnel, 534 The Black Barrow, 535 The Pale Catacombs. `?town=graveyard&lvl=84` (+ `&k=1..4` a maze, `&crypt=1`, `&relics=1`, `&q=1..5`, `&keys=1`). Go to area has a row for each. Journal area "Wenlock Graveyard".

## Tests (run on your OWN server: `python -m http.server 8373` from the repo root; stop only that process by PID; never kill python by name)
`python tools/gy_test.py load | shots | mazeshots [1..4] | torchshots | mapshots | stats | quests` (screenshots go to `%TEMP%\gy_shots`; `GY_PORT` and `GY_SHOTS` change port and folder). Pages take 15 to 25 seconds to start: the script waits for the game. `quests` takes about four minutes (run it in the background and read its output). The pre-existing 404s for `assets/sp_*.png` and `icn_*.png` are not ours.

## Known bugs and weak spots
- Not re-verified after the last edits: see "NOT done" above.
- The sheets are about 1,000 px wide, so pieces are 150 to 300 px high; bosses about 220 px (soft close up). Some pieces keep a faint purple edge from the background.
- Creatures are scaled to fit the window like all creatures, so a skeleton and a wraith come out nearly the same height.
- The writing (epitaphs, the ghost's talk, the jokes) is the writer's, to be replaced freely. No em dashes anywhere (checked with grep).
- No sounds of its own except the bell (made with the game's `tone`).
- `index.html` is rebuilt by `tools/inject.py` between its markers only; the two small hand edits above are outside the markers.
