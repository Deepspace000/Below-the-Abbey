# Blighted Road places 1 to 4: polish round (branch worktree-agent-a51ef238974893e27)

Critic list: `tools/polish/blight1to4_CRITIC.md`. New file `src/desert/blight_polish14.js` (last in ORDER, after `blight_palebridge.js`); edits in `blight_toll.js`, `blight_ashenfold.js`, `blight_church.js`, `blight_gallowmere.js`; one core line in `index.html`. No level, quest or exit ids changed.

## What was fixed
1. **Far wall drawn** (all four places, the biggest single fault): `index.html`, the wall ray loop, `guard++<(LEVEL>=9610&&LEVEL<=9709?180:LEVEL===530||LEVEL===9670?100:64)`. Before, a view along a 72 to 90 wide place ended in a white picket band; now the dark boundary wall shows. (Covers all ten places of the road; other branches editing that line need to keep the same condition.)
2. **Dark wall styles**: `b14Styles()` registers `dflint dbrick dtimber dhoney dwhite dblack` (Wenlock sheets with a multiply tint). Toll house flint, farmhouse brick, the Gallowmere houses use them.
3. **Roofs dimmed**: the kit's `C.finish` is wrapped for the four ids; every roof sprite becomes a greyed dark copy (`b14Roof`). The barn picture is a darkened copy (`b14_barn`).
4. **Dead copies of bright pieces** (`b14Dead`): Wenlock flower barrows, crates and sacks (`kh_ohgard*`, `kh_oqstuff_8/9`), the pink pampas `reeds` and `greeds` of the fen.
5. **Props**: toll yard (stocks, two wrecked carts, grain cart, barrels, crates, sacks, torn banners, caged bones at the bar, door lamps), farmyard (grain cart, carts, sacks, barrels, crates, lobster pots, washing line, lamps), pilgrim road at the church (carts, sacks, barrels, banners, cages, crates), plague pit (bone heaps, tipped cart), railings (bone charms), Gallowmere green, causeway, jetty and banks (cages, nets, pots, crates, carts, banners). Bones on the roads at scale .25 (they were a metre across).
6. **Ground**: patches of bare earth and mud (`b14Patches`), ploughed furrows with stalks in the farm fields and the toll fields (`b14Furrows`).
7. **Gallowmere water**: the engine has six floor slots (chars 0 to 5); the builder's char 6 drew as the mud slot, so the mere looked like bare earth. Land is now slot 0 (wet mud), water slot 5 with a new cold grey-green rippled floor `b14Mere` made in code. Check: shots 9640@70,38,3 and 55,40,2 (`tools/polish/b14_shoot.py`).
8. **Fog**: a darker, greener haze for the four places (`weatherNow` wrap).
9. **Rooms** (`blRoom` wrapped for ids 9610 to 9643): webs in the corners, a few bone bits and candle stands on free cells, one pale cold light in each room, furniture for the cellar, barn, belfry and vestry (`B14_ROOMX`).

## How it was checked
Tests (own server on port 8611, one mode at a time, Chrome from `BTA_CHROME`): `tools/blight34_test.py` load, links, quests, walk, save all OK; `tools/blight_test.py` load, quests, walk, gate, save all OK. `python tools/polish/b14_check.py` (node --check of every script block and every `blight_*.js`) 0 bad. Re-shot every outdoor position and every room after the fixes.

## Tools made
`tools/polish/b14_shoot.py` (outdoor shots from a JSON list; env TOWN, MINLVL, PRE), `b14_rooms.py` (four views per room), `b14_sheet.py` (contact sheet), `b14_check.py`.

## What remains
- Sky: flat grey; a painted cloud or moon panel needs Gemini (Chrome was not connected, so no new art was made).
- Lit windows are still only light on the ground; houses need painted tiles with a glowing window.
- Gallowmere houses are plain boxes, not houses on stilts; the causeway is a grey carpet.
- Ashenfold farmhouse is one ten-wide wall with eight identical windows; orchard is eight identical trees; the pig sty is a fence piece.
- Toll: roadmender hut and lean-to are the same hut picture; the church's upside-down bells read as brown trumpets; the nave's checkerboard floor is very bright.
- The Rookery (place 9) uses the same broken water slot (`lv.floorSet[6]`, fm '6'); fix there the same way (water into slot 5, land elsewhere).
- Hostile spacing and quest object positions were not changed; walk tests pass (no creature near an arrival square in the outdoor maps).
