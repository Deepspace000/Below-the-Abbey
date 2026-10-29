# Round 12 QA and atmosphere: Toll House (9610, 9611) and Ashenfold Farm (9620 to 9623)

Files edited: src/desert/blight_toll.js, blight_ashenfold.js, blight_polish14.js (new b12 section at the end). blight_kit.js untouched.
Tools: tools/polish/blight12_reach.js (Dijkstra/BFS reach and corridor width check, duplicates, bad keys, NaN, tight enemies; run with tools/polish/blight12_run.sh "town=blight1&lvl=84" tools/polish/blight12_reach.js), blight12_grid.js (ASCII grids of the rooms).

## Found and fixed
- Toll yard banners stood at y 31 and 33 on both yard gates, leaving a 1 square gap in the 3 wide road: moved to y 30 and 34.
- Cellar (9622): the arrival/start square (5,6) held a crate; removed. Three identical coopstacks in a row and two identical shelves: varied (veg, water barrel, candle rack).
- Kitchen (9621): a Wayside Skeleton spawned in a 1 square pocket (12,8): moved to (10,7).
- Duplicate neighbours: four lanterns at the toll house and farmhouse fronts (replaced by wash pots), barrel pairs (second is now a crate), graves row mounds (alternate mounds are barrows), random room bone and candle stubs now keep 3 squares apart.
- Checked clean: no NaN, no missing picture keys, no bad NPC or enemy or item keys, all doors, NPCs, items and gates reachable, nothing blocks a door front. tools/blight_test.py quests passes (blq1 to blq6).

## Added
- Notes and signs: ditch warning post, tally slab in the toll yard, roadmender hut board, Warden's diary page and desk slip (toll house), barn door board, kennel (Trusty), Wilf's unfinished letter (kitchen), Hob's tally post (barn).
- Trails: bones from the shrine to the road, straw along the farm lane. Props: overturned barrow, chopping stump, bench, wash pots. More pale lights at the scarecrow poles, crow tree, yard.
- Sound by place (b12Tick): hut taps three times, banner flap, toll house clock tick and wax dust, far cow, field rustle, plate set down, fire crackle, humming in the cellar, barn moo and hay creak.
- Dusty brown fog at the farm (9620 outdoors); toll road keeps the grey green.

## Left
- Graves row (x 52 to 58, y 23 to 24) is 1 wide between boards by design; reached from the south.
- Gate lantern pairs and Wenlock-room furniture repeats (library shelves, tables) are intentional framing.
- Gemini was allowed late; not used (no new pictures needed for this pass).
- Other agents' files were mid-edit during my tests (b34Vary and B34_ROOMX errors, a transient syntax error): not from this zone.
- Screenshots: tools/polish/shots12/grave.png, shrine.png, toll1.png (toll1 taken before a transient failure, may be stale).

## Round 2 (29 Oct 2026): Toll House and Ashenfold
- Critic fixes: the pink bulb pairs (`bl_grow_1`) within 11 squares of the gates are taken away (b2Post in blight_polish14.js, a wrap of `bgrEnsure`; blight_growths.js not edited). Toll yard: painted gallows with two hanged (`bl_hang2`) at the south edge of the yard, strong warm light at the toll house door (windows now glow), the bare slope beside the graves broken up with dead trees, a rose, an urn. Ashenfold: strong warm lights in front of the farmhouse, cellar floor given a crate, barrel and bones in the middle. Stones, mounds, reeds, dead trees get a spread of sizes and shifts. A tree that stood on a potion is removed.
- New painted art (Gemini, owner's Chrome, own tab, closed): `assets/ds_bl_hang1.png`, `ds_bl_hang2.png` (shared with Gallowmere). Raw sheets and cutter: tools/polish/blight_r2/ (cut.py, shoot.py, reach.js, build.sh, before/ and after/ shots).
- Checks: reach script (tools/polish/blight_r2/reach.js) clean for 9610 to 9623 (the only flags are false positives: Tilly's cell has an isolated neighbour, the crypt start is the stair). blight_test load, quests, walk pass.
- Not done: the fog and rain wash (blight_sky.js, other agent), the fungus monolith (growths file), painted lit windows on the wall tiles themselves.
