# Places 8, 9, 10 QA and atmosphere pass (29 Oct 2026)

Zone: Hollowbell Abbey 9680 to 9686, Rookery Mill 9690 to 9694, Pale Bridge and Gate of Sale 9700 to 9702.
Tools (all in tools/polish): `blight8910_dump.py` (dumps the 15 levels to JSON, own server port 8604), `blight8910_check.py` (BFS reachability from start to every NPC and door, tight route cells with no free 2x2, tight enemies, duplicate props within 2 squares, door approaches, cramped NPCs), `blight8910_ascii.py` (map view).

## Found
- No console errors, bad keys, NaN, unreachable NPCs, doors or rooms, quest dead ends or boss problems. Tests load, links, quests, bosses, walk, save all pass after the changes.
- Toll yard of Sale (9700): the toll post (4,34) and a plain post (4,36) squeezed the yard to single-width gaps. Fixed in blight_palebridge.js (one toll post now at 3,33).
- Two identical crates in one cell (9701 at 3,1) and rows of crates two apart in the rooms (9683, 9701, 9694, 9702): same-cell duplicates removed, crates two apart become barrels, hay or sacks (b891Dedupe, b891Crates).
- Six identical seated skeletons in the refectory: every second one is now a pale monk.
- Hostile creatures in tight spots (blbrother 65,7; blbones in the refectory) and wardens standing beside Corporal Piper at the waystation: moved to roomy cells, kept 9.6 squares from every east arrival square (b891Foes).
- Mist props stacked twice in one cell along the Rookery millrace: removed.
- Not changed on purpose: precinct wall gaps (random ruin gaps, the gate is 3 wide), graves, columns, lanterns across a road, hedges, twigs, mist (deliberate repeats).

## Added
- 21 notes and signs with writing (gate notice, habit pegs, herb slate, cracked bell mould, pilgrim bundle, prayer book, mill board, rook tally, stopped wheel rope, field pole, bridge stone, ravine rope, toll board, desk page, rope tally, crypt names, sack tally, nest, supper table, guard roster, letter). Each placed on a free roomy cell, kept only if the walkable area stays the same.
- Litter trails (candle stubs, bones, bundles, sacks, hay, barrels), warm or cold pool lights.
- Haze colour per place (cold blue at the bridge, brown at the mill, pale at the abbey) by wrapping weatherNow.
- Sound: slow chant and low bell hum at the abbey, rook calls and mill creaks at the mill, wind and a chain clink at the bridge (b891Tick).
- Height variation: Rookery (narrower flat road band, 12 knolls) and Pale Bridge (narrower flats, 12 banks and knolls) in blight_rookery.js and blight_palebridge.js.
- All new code is at the end of src/desert/blight58_polish.js (prefix b891).

## Left
- Gemini art was offered late; not used. Still wanted: a painted ruined church, Abbot, Pale Knight, bell, rope, pale-silver lock.
- Notes b891_cairn and b891_herbs landed a few squares from their ideal spot or not at all (the cairn spot is on the path band); check by eye. The ringing chamber note is in a very small room and may be missing.
- Heights are a gentle improvement, not dramatic. The Rookery sky gets a brown tint from the haze colour (tuned down once).

## Screenshots
before: tools/polish/b8910_before/*.png, after: tools/polish/b8910_after/*.png
