# QA and atmosphere pass: Vault of Maldrake (9670 to 9678) and Sale (600, rooms, 601 to 603)

Files touched: `src/desert/sale_town.js`, `sale_rooms.js`, `sale_art.js`, `sale_sound.js`, `vault_core.js`, `vault_build.js`, `vault_floors.js`, `vault_hill.js`, `vault_story.js` (then `python tools/inject.py`). No version bump, no commit.

## Tools (tools/polish, port B7_PORT, default 8605)
`b7s_audit.js` + `b7s_audit.py <tag>` (env `B7_ONLY=sale|vault`): per level, flood fill from the arrival square (locks treated as open), unreachable cells with and without props, doors with no free front square, doors to missing levels, NPCs with no free neighbour, items and creatures unreachable, props in walls, NaN, identical props within 2 squares, stacked props, adjacent identical creatures, creatures in tight spots, 1-wide cells (and which are 1-wide only because of a prop). `b7s_ascii.js` + `b7s_run.py` dump ASCII maps. Results `b7s_audit_before.json`, `b7s_audit_after*.json`. Screenshots `tools/polish/b7s_shots/a` (Sale streets), `b` (Sale rooms and the three small levels), `c` (Vault), each with a `_sheet*.png`.

## Found
- No console errors, NaN, bad keys, unreachable rooms, unreachable floors or locked doors without a route in either zone. The quest chain tests still pass.
- Sale town: 56 identical props within 2 squares (bones, webs, urns, dead trees, stones, hay). Shop rooms: the Wenlock copies had crates and sacks in wall squares (raw pieces at x = width-1) and runs of identical shelves. Hill: 195 identical neighbours (mostly trees).
- Tight places: the Hollow Cellar, Sale Crypt and Belfry joined their rooms by 1-wide passages and stair shafts. Seven vault floors had 1-wide connectors and lobbies between locks and stairs (about 20 squares). Candle Street and the other Sale roads are 1 wide by the owner's town rule and were left alone; the town is open ground between the houses so nothing depends on a 1-wide gap.
- Urns beside Sale doors are beside, not in front of, the door square (front squares are free for all ten shops and the cottages).

## Fixed
- All 1-wide connectors of the three Sale small levels and of vault floors 9671 to 9676 are now 3 wide (2 wide in the cellar, crypt and belfry). Door squares stay one square, as doors must.
- `b7Dedupe` (sale_town.js, shared): swaps the second of two identical props for another painted piece of the same kind, or drops it. Runs at the end of the Sale build, the three small levels, every vault floor and the hill. Identical creatures side by side are swapped to another of the same rank (`vtqCreatures`).
- Shop rooms: raw props in walls dropped, shelf runs varied (`saVaryProps`, `saVaryRaw`).
- Audit now shows 0 identical props within 2 squares in Sale, rooms (counter runs excepted), and floors, except where a pair is the design: the two lanterns and roses either side of the vault door, the four helmet crosses, the memorial candles in the Sanctum, the cages of the cells, the archive shelves (all have a talking part).

## Added
Sale town: seven signposts with plain writing (toll board, Charnel Row, Back Track, Bell Lane, Hollin Farm, Sanctuary, Tanners' Lane); a child's boot (matches the notice board), an overturned handcart, a well bucket with a cut rope, a coil of rope at the gibbet; a thin bread-crumb trail to the Sanctuary step; a bone trail along Charnel Row to the crypt stair; candle stubs up Bell Lane to the belfry; roses at barricaded doors; a cage lantern and light at each shop door; six epitaph boards in the dead quarter; four pale shapes (the Orange Spire's painted ghost) standing in the quiet streets. Fog colour now follows the part of town (green and thick in the dead quarter, brown over the farm, blue by Bell Lane, pale in the square).
Sale rooms: each of the ten shops has a readable note about its keeper, a candle, a bucket, and small dropped things (rings, a book, crumbs, a boot, a hag stone). Cellar, crypt and belfry have notes (a tally, a mason's list, a split grave-salt sack, a raven's nest), chains, crumbs, apple cores and buckets.
Sale sound: gusts, shutters, chain rattle near the gibbet, a ghost child humming in the square, scratching, bone clatter, groans and whispers in the dead quarter, lowing at the farm, wings at the belfry; shops get clock ticks, floorboards, a muffled bell, mice; crypt stone grind and whispers; belfry wind and wings.
Vault: 14 readable notes across the floors (garrison log, Price's helmet, the cage tally, the Roll, boots, a place card for Wat Bramble, the shawl by the desk, a child's drawing), 4 more on the hill, dropped boots/books/rings/candles/chains/crates on every floor, bell ropes (chains) by the five bells, coloured lights per chamber (cold silver in the cellars and stair, warm in the guard hall, pale in the sanctum). Hill fog changes colour under the vault front and in Underhill. New sounds per floor: gusts and rustle on the hill, chain and steps (1), whispers and page turns (2, 9678), silver clinks (4), spoons on plates at the supper table (5), stair steps and stone (6), hush (7).

## Test results (own server 8605)
`vault_test.py struct` 147 of 147. `vault_test.py sympathy` 124 of 125: the only failure, "the stone of the hill is in the level (teleporter decor)", is NOT from this pass: `teleWanted` in `src/desert/teleport.js` now returns false for every id 9600 to 9709, which removes the hill's stone (VAULT_NOTES says the hill keeps one) and Lanternrest's (`TELE_KEEP_HI` 9661). Lead to decide; one-line exceptions for 9670 and 9661 before that line restore both. `sale_test.py all`: no failures. Audit after: no console errors.

## Left / not done
- Gemini art not made (the Chrome extension is connected, but the multi-step generate, cut and ingest per piece was left out to keep the weak laptop free). Still wanted, in this order: a painted gibbet (filter of the hanging cage still in use), a ghost villager sheet (the Orange Spire ghost is reused for four shapes, the walking ghosts are still tinted folk), a painted Maldrake (toned wizard figure still in use), lit windows (still light squares).
- Another agent's `blight_growths.js` places growths with talk on the hill; one (`bl_twist_1` at 52,52) has all neighbours blocked. Not in my files.
- Sale roads stay 1 wide (owner's town rule). Wenlock-copy chandeliers in the shops are blocking pieces (as in Wenlock).
- Audio is generated with `tone`/`nz`; none auditioned by ear.
