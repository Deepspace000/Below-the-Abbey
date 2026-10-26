# The Purple Maze under the Well of Wenlock: notes for the next session

Four levels of purple brick under the town well of Wenlock, all rated level 80. Files (all in `src/desert`, last in `ORDER` of `tools/inject.py`):
`wellmaze_gen.js` (pure maze maker, runs in node), `wellmaze_art.js` (ids, look, creatures, items, pictures), `wellmaze_specs.js` (the rooms of each level, the four mazes made at load, stair squares),
`wellmaze_build.js` (walls, tiles, the context handed to the room furnishers), `wellmaze_levels.js` (assembly, floors, creatures, finds, the self-check), `wellmaze_rooms.js` (one furnisher per room kind),
`wellmaze_notes.js` (every sign and note), `wellmaze_mech.js` (doors, keys, switches, secret closets, pits, the mirror walk), `wellmaze_play.js` (what the NPCs and doors do), `wellmaze_hooks.js` (loadLevel, pits, the boss, loot, lists, test link),
`wellmaze_map.js` (the four illuminated area maps). Pictures: `assets/ds_wm_*.png` (creatures and props, IMG['art_wm_*']), `assets/ds_tex_wm_*.png` (walls), `assets/ds_floor_wm_*`, `assets/ds_ceil_wm_*`; raw cut pieces in `assets/wm/`.
Tools: `tools/wm_ingest.py` (cuts a Gemini sheet drawn on flat GREEN, not magenta, because the art is purple), `tools/wm_test.js` (node: makes the four mazes and prints them).

## Level ids
497 Under the Wenlock Well, 498 The Violet Maze, 499 The Bell Vaults, **502** The Amethyst Deep. The brief said 500 for the fourth, but 500 is the Ruby Maze (`ruby_maze.js`) and 501 is the Thornwick well, so the fourth level is 502. `wellmaze_art.js` sets `WK.WELL=[497,498,499,502]` at load.
Contract: `WK.WELLSTART` is set at load ({x:29,y:2,f:2}, the foot of the ladder). The ladder (NPC `wm_ladderup`) calls `goToLevel(WK.WENLOCK, WK.WELLBACK||{x:2,y:2,f:0})`, waiting for the town to finish building if needed (the town builds asynchronously).
At the prize on 502: `G.flags.wlWellDone=true` and `wlWellQuestGoal()` if it is a function. State: `G.flags.wm` (open doors, levers, hints, scale, bells, lamps, pits, boss, prize), saved with the game.
Test links: `?town=wellmaze&lvl=80` (level 497), `&k=2|3|4` the other levels, `&keys=1` gives the three keys, `&dead=1` the boss already dead. The levels are in the Go to area list (The Known Lands).

## The way through
Keys (each opens only its own stair door, 'This lock is the wrong shape.' for another key, 'You need the Violet Key.' for none; the key is used up):
- Violet Key (497 to 498): in the foreman's strongbox at the far corner of the Collapsed Mine, a mimic chest. Hint: the slate in the mine, a brass plate on the stair door.
- Amethyst Key (498 to 499): in a closet behind the plaque (riddle) door. Hint: the Soaked Ledger in the library.
- Warden's Key (499 to 502): in a secret closet at a dead end (press the walls at dead ends). Hint: the Warden's Page in the shrine.
Switches (levers, cranks, a chain; each opens a sealed treasure room, 'Somewhere a door grinds open.', map pin after use): 497 one lever at the far dead end; 498 a pair of cranks far apart (both needed), and a lever in a secret closet; 499 a lever past hollow slabs (pits) guarded by a spider and a cultist; 502 a chain guarded by two golems.
The four puzzles, one per level, each opens a treasure room (never a needed key):
- 497 weights: the scale at the shaft needs EXACTLY 80: Weight Barrels (25) and Weight Crates (15) lie in the camp, cellar and shrine (3 of each). Only 2 barrels and 2 crates make 80. Note: 'The Foreman's Notice' (noticeboard in the shaft), chalk in the cellar.
- 498 mirror hall: a white crystal stands in a dead end near the hall. The three mirrors show the walk with every left and right swapped; walk it the other way about; at the end the wall at the side the mirror names is a hidden door (a vault).
- 499 bell code: three bells in the Bell Hall, low LONG, middle SHORT, high LONG. Note: the Notes of the Ringer, in the library of 499. A wrong peal resets.
- 502 lanterns: light LILAC, then GOLD, then VIOLET. Note: the Warden's Lamp Order, in the mine of 499. A wrong order puts them all out and they can be lit again.
Also: a riddle door on 498 (answer: a well), a rowing boat in the cistern of 497 (a boat NPC at the stair takes the party to a small island closet with a chest, and back), secret closets with chests, 6 hidden pit slabs per level (a bruise, 8 percent, once), notes and little stories (the diggers' tally, the lost bell-ringer).
Boss: the Well-Warden (502, boss room at the top): about 30,900 health at level 80 (hp 820, like the Black Swill), shard volleys at the front two every 4th round, a shard storm at everyone every 9th round, mends a little, sends a golem at two thirds and one third health. Pays 5,000 to 6,500 gold, 48,000 xp, the Warden's Amethyst Edge (a level 80 sword), 2 potions and a supermana. Dies for good (`F.bossDead`, any live copy is removed every frame).
Rare level 80 pieces: Amethyst Warden Plate (chain vault), Violet Well Ring (bell and lantern vaults), the Edge (boss).

## Checks
`WM.checks` (run when a level is built) flood-fills from the arrival square with every vault and secret door counted as open and moves or softens any prop that walls in a square; it logs `wm: level N has X squares the party cannot reach` if one is left (none). No key is ever behind its own door (the route test in the session confirmed: key 1 in the open, key 2 behind the riddle door, key 3 behind a secret door, all reachable from the arrival square; vault doors and switches reachable).
Balance: ordinary creature health comes from `hgd_balance.js` by the written hp (hp/48 clamped .6 to 1.4), so `hp` in `ENEMY_DEF` is only a size. With the default level 80 party, fight ratings: 497 kinds 1.0 to 2.0 (fair to easy), 498 about 0.9 to 1.2, golems 0.6 (hard). The boss estimate is like the Black Swill's.

## Weak spots
- Wenlock itself was still being built by another agent; the ladder up was tested only as far as the call (the town level was not available in my session).
- The art is 17 Gemini sheets (4 of textures, 10 of props, 2 of creatures, 1 boss) cut into pieces about 250 px high, scaled up 1.5 to 2 times, so props are a little soft close up. One candle block (drawn with its top visible) and one barrel stack were thrown away as angled.
- The cultist and the fungus walker stay dark at a distance (their paintings are dark); they carry extra glow in `wellmaze_hooks.js`.
- No sounds of its own (pits, levers and bells reuse existing effects).
