# Underlevel polish notes (zone D, level 476)

Files: src/desert/hgd_polish_d.js (last in tools/inject.py ORDER), tools/polish/d_*.py (audit, shots, geometry), d_audit.md (before and after counts, PROPORTIONS table).
Run: `python -m http.server 8363`, then `python tools/polish/d_audit.py before|after`, `d_vshots.py` (one screenshot per set piece), `d_read.py` (reads a sign and a journal page by bumping).

## What was wrong
- The walls were smooth blank beige slabs. OH_STY.hgdu_rock had tint [4,3,5,.5]: multiply to black, then a 50 percent beige screen over it, which erased the jagged rock texture and the ladder picture. Fixed by retinting (plain multiply) and rebuilding the two wall tiles in the built level.
- The Leviathan, the Kraken and the great serpent were fitted to hero height (0.8). Now full size (1.5, 1.8, 1.4 high).
- Beached boats (0.62 high) were smaller than the party boat (0.85); crates, barrels, buckets and posts varied by a third; dock stacks had three props on a cell; 32 dead ends were empty; the level had no readable text at all (no signs, notes or lore), 3 map names, three long bare straights.

## What was added (all in the built level, no generator touched, no quest object moved)
- Thirteen journal pages of the Tallow Company (a lost expedition), each in its own set piece: first camp, chalk corridor (lanterns where they stopped), crossing post, cold camp, the Keeper's Rock (a lamp post and brazier on an islet, strong light), the Wreck (a big beached boat, skeleton, tools, a 1000 gold chest), the Drowned Chapel (monk statue, bell, candles, cairn, a bell that tolls in the dark within 16 squares), the Blue Grotto (glowing blue mushrooms in a room), the Reading Room, the Tally Wall (a stone for each day), the Barricade, the Dig (cart, tools, a great tooth), the Company Purse (second chest; first touch reads the last page, the second opens it). Plus the Waiting Rock (two statues facing the water) and the Steersman (a ship's wheel on a rock). Pages count "n of 13" in G.flags.hgpdSeen.
- Twelve ladder feet each get their own small kit; twelve to fourteen junction signs (rune stone for UP, notice board for BOAT) whose direction and step count are the real shortest walking distance (BFS); small scenes in the other empty dead ends (7 kinds); landmarks every dozen squares on long bare stretches; the other islets get one small thing each; 11 new names on the map; about 25 new small lights.
- Painted art: only existing pieces (assets/ds_wm_*, ds_hgx*, ds_dbones); no new pictures were made.

## What remains weak
- No new painted art was made (the brief asked for 10 to 25 pieces); the wm props are purple and sit a little oddly in the grey Underlevel. A grey-black variant set (bedroll, tally board, wreck, lighthouse tower) would help.
- The lighthouse is lit but not a true beacon visible across the sea; the engine lights sprites only near lights.
- Reading Room shelf is a wall picture and is not always on a wall that faces the entrance.
- Black Swill chamber, boss, Bogeyman, Messenger, letters, shrines, boatman and Orrin quests are untouched. Remaining stacked cells (6) are the shrine candle pairs.
