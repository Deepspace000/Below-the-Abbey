# Blighted Road places 5 and 6: QA and atmosphere pass (29 Oct 2026)

Zone: Bone Orchard 9650 (rooms 9651 to 9655) and Lanternrest Waystation 9660 (rooms 9661 to 9666).
Files touched: `src/desert/blight_orchard.js`, `blight_lanternrest.js`, `blight58_polish.js`. `blight_kit.js` was not changed.

## Tools written (tools/polish)
- `blight56_check.js` + `blight56_run.py [town] [jsfile]`: in the real game, for all 13 levels: flood fill from the start over walkable cells (no wall char, no blocking prop); lists unreachable cells, unreachable people, doors and creatures, same-key props within 2 squares, blocking props next to doors, creatures in cramped spots, every 1-wide gap, and the real chokepoints (a gap whose closing cuts any person, door or creature off).
- `blight56_dump.py town id...`: prints a room or place as a character grid (# wall, + door, N person, B blocking prop, o walk-through prop, E creature, ? unreachable).
- `blight56_shots.py outdir name:lvl:x:y:f ...`: screenshots at chosen squares.
- Run them against your own server (`BL_PORT`, default 8603).

## Found and fixed
1. The Reaper-Farmer and the two yard pickers were NOT in the Harvest Yard: the yard is all path, and `foeNear` (off path) pushed them out to the road side at 41,34, right beside the road. Now placed exactly inside the yard (reaper 44,31, pickers 39,27 and 49,27) with `C.foe`.
2. Inn (9661): the barrel at 13,4 walled in the road's teleport stone at 13,2. Barrel moved to 13,1; the stone can be walked to.
3. Pressing Shed (9651): a picker was spawned in a 4-open-cell corner (13,3); moved to 11,4.
4. Adjacent identical props: shed (two press stacks, two barrels), cellar (five barrels in a row), hut (two herb racks), Harvest Hall (three long tables), inn (two pot shelves), armoury (four mannequins), forge (four weapon racks, hay in pairs), infirmary (four cots), hall door banners, tents at 58,20 and 60,22, braziers at the lane mouth (they also stood on the road: now at 41,34 and 47,34), braziers beside wall stairs (two per stair, now one), ravens side by side (b58Crows now keeps 2 squares apart), crypt-field crosses in the scatter loop.
5. Checked and found fine: no chokepoints (no gap that cuts anything off) in any of the 13 levels; every person, door, gate and creature is reachable; gates 3 wide; fort gate 3 wide; no console errors; no NaN.
Left as is: dead-end 1-wide strips between the yard fence and the hall (x 37, y 21 to 24), the wall-walk side lanes in the fort, and the hidden `crate` blockers that Wenlock's `wlinProp` puts under wide pieces (bars, tables, shelves) are by design (a counter run is one counter).

## Added (atmosphere and story)
- Readable things (plain literal text, no em dashes): Orchard: harvest tally board, swollen prayer book at the crypt field gate, scarecrows in the rows (3), Hesper's hag stone, press log, Bartle's cellar book, the patrol roll, Hesper's receipts. Lanternrest: ration board, sentry log at the gate, marker boot on the road, slate on the bar, armoury issue book, orders from Oldhaven, ward chart, beacon watch book.
- Props and trails: husk trail along the road to the shed, spilled stores by the cart, camp dogs, a flag on the drill ground, spilled stores and bones by the burnt wagon, bones leading from the Road-Maw's hollow, boots, crumbs, candles, bones in every room.
- Lights: a pale green pool at the harvest bell, a candle at the prayer book.
- Sound (`b56Tick` in blight_lanternrest.js, one timer per sound, level by level): orchard wind in branches, apple dropping, bones rattling, picker basket rustle, the harvest bell far off, something dragged far off in the crypt field; shed press creak, cellar scurry and groan, crypt drone and whisper, hut bubbling and crackle, hall rafters; fort sentry steps, dog, flag, pot, cough; inn fire crackle, mug clink, murmured song; armoury clinks; stable snort and stamp; hall paper; infirmary cough and groan; beacon wind.

## Test results after the pass (own server 8603)
load OK, quests OK (blq50 to blq59 end to end), shop OK, save OK, walk OK (no creature near an arrival or inside the fort), no console errors.
Two test failures that are NOT from this pass:
- `blight56_test.py rest`: the check "one teleport stone in the inn" fails because commit 372fee9 (3.695) made `teleWanted` return false for ids 9600 to 9709 (no stones on the Blighted Road). The test is outdated; the inn's `tele:[13,2]` is now inert. The rest-for-free part passes.
- `blight56_test.py links`: place 7 (Vault, 9670) has no E and W door objects in the check, so it reports FAIL. That is the Vault zone, not 5 or 6. Links of 5 and 6 themselves pass.

## Left / not done
- Gemini art: the coordinator allowed 3 to 5 painted pieces late in the pass. Not made (laptop under load from other agents, one browser at a time). Still stand-ins: skull-apple tree (bleached tree plus bones), harvest bell (graveyard bell scaled), tents (Wenlock flower tent painted over), crypt front (small Wenlock house), stew pot. Most valuable next: a skull-apple tree, a painted bell, a soldier's tent.
- Fog/colour: no per-region fog exists; only lights were added.
- `QRF` rings for the new readable things are not needed (not quests).

## Screenshots
`tools/polish/shots56/before/*.png` (before), `tools/polish/shots56/after/*.png` (after).
