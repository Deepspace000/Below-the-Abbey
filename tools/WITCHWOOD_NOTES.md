# The Witch's Wood (Blackbriar Wood): notes for the next session

A small dark forest north of Wenlock, with a malevolent witch, Grisselda Blackbriar, in a gingerbread-and-bone cottage. Rated LEVEL 82 (the owner's staggered ladder: Wenlock 80, the wood 82, the graveyard 84).
Test link: `?town=witchwood&lvl=82` (clamp and AREAS entry in `jumpFromUrl` in index.html; the Go to area list has a "Blackbriar Wood, north of Wenlock" row with levels 520 to 523, rated 82).
Entrance: Blackbriar Lane, a lane north from the start of Wenlock's back track (x=38, y=3 to 13) to a painted iron gate in the north wall at (38,2). The way back is the iron gate at the foot of the wood.

## Levels and ids (verified free by grep)
- 520 the wood (55 by 55), 521 Grisselda's Cottage (parlour), 522 the cellar, 523 the kitchen with the great oven. `WK.WITCH`, `WK.WITCH_ROOMS`, `WK.WITCHSTART`, `WK.WITCHBACK` are in `src/desert/wk_ids.js`.
- Rooms of the wood (`WW_R` in ww_wood.js, numbered on the map): 1 gate glade, 2 graveyard glade (bone totem 1), 3 ruined chapel (rowan, a chest, the chapel front is a painted wall), 4 well glade, 5 hanged man's glade (totem 2), 6 stone circle (totem 3),
  7 root hollow (the Flesh-Pile), 8 the witch's clearing (the cottage front is a painted wall of five squares, the door in the middle), 9 bramble glade (chest), 10 spider glade (chest). A dried brook (cracked mud band, rotten bridges) crosses the middle,
  with the hag-stone in it. The trodden track (dirt floor) leads from the gate to the cottage door; moss paths lead to dead ends with potions and chests.

## Files (src/desert, in tools/inject.py ORDER after garden_sound.js)
- `ww_list.js` (written by `python tools/ww_list.py` from assets/ww/manifest.json), `ww_art.js` (loader, aliases WWA, floors, wall tiles `wwTile` including slices of the big front pictures, ENEMY_DEF of the guardians, the Hag-blinded affliction, wrappers of goToLevel, jumpToLevel,
  restore, wdDoorLevel, wlLoad; `weatherNow` returns a heavy fog for level 520), `ww_wood.js` (maze generator `wwGen`, the build, foes, lights, doors, chests, the call for Wenlock's gate `wwWenlockGate`, called from wlBuild in wenlock_town.js),
  `ww_rooms.js` (the three small levels), `ww_quests.js` (people, objects, the eight quests, the witch's behaviour, flags), `ww_sound.js`, `maps_witchwood.js` (parchment map, quest area name).
- Edits outside: wenlock_town.js got two single entries (the lane in `WL_ROAD`, and the call to `wwWenlockGate` just before "the level"); index.html: `witchwood` in the `jumpFromUrl` clamp (82) and AREAS (`witchwood:[520,27,52,0]`); wk_ids.js got its last two lines; tools/inject.py ORDER.

## The quests ("Into the Oven", 8 chained quests, ids wwq1 to wwq8, area "Wenlock")
1 The Boy Who Followed the Smell (Goodwife Marrow, new, on Blackbriar Lane): a boot (gate glade), a ribbon on a thorn and crumbs (on the track).
2 Salt and Iron (Goody Prue): blessed salt from Brother Tuck, a cold iron horseshoe from Fenn Ironside (talk steps, items in the bag).
3 The Hag-Stone and the Rowan (Sexton Moss): hag-stone from the dry brook, rowan from the chapel; he makes the Witchbane Charm (reward item, flag wwCharm).
4 Break the Witch's Wards (Brother Tuck): smash three bone totems (the charm is needed; two crows come out of the branches each time). The cottage door is locked until all three are down.
5 The Key to the Cellar (Constable Fudge): the Flesh-Pile (root hollow) drops the cellar key when it dies (flag wwCellarOpen opens the trapdoor portal).
6 Little Prisoners (Goodwife Marrow): open three cages in the cellar (and untie Button the dog); the first cage opened alerts the witch (flag wwHostile); the freed folk (Pip, the Pottle twins, Hannah, Button) appear in Wenlock.
7 Into the Oven (Mayor Thistlewood): fight Grisselda in her parlour; at 50% health she flees to the kitchen (flag wwFled, she is removed with no reward); in the kitchen she is fought to 12% and then cornered (wwCornered) and becomes a talkable figure; "Push her into the oven" starts a four beat dark comic scene,
  sets wwDead (saved, nothing respawns: the arrival code only spawns her when wwFled and not wwCornered and not wwDead). Reward: gold, XP, the Hag-Stone Ring, potions.
8 The Last Crumbs (Goody Prue): the recipe book from the kitchen table (appears after the oven); reward the Singed Hat and a gingerbread man; a gingerbread stall opens in Wenlock's square (flag wwStall). A few townsfolk have new lines once wwDead is set.
Every step can be done before its quest is taken. Total XP about 83,600 (after the doubling in QREW_MUL); rewards are a tenth above Wenlock's own. Hand-in hooks yield to Wenlock's older quests only while those are active (see `wwGive`).

## The boss (wwwitch)
Base hp 800 (about 31,000 at her level, party level + 2), dmg 24 to 38, `boss`, `NO_VARY`, `aboveParty:2`. `act` (wwWitchAct): every third turn a curse (cursed), blinding smoke (the new "Hag-blinded" affliction), or a summon of two crows or two hounds (at most five alive); she also throws bolts of green fire at range (`ranged` 4); her casting pose is the attack picture `wwi_witchA`.
`hurtEnemy` is wrapped: she cannot be killed by blows (hp stops at 50% in the parlour, 12% in the kitchen); that triggers the flight or the corner.

## Pictures (assets/ww, 47 pieces, Gemini sheets, cut with tools/ingest_ww.py)
guardA (scarecrow, hound, spider, golem, crows, toad), guardB (revenant, root-horror, Flesh-Pile, hag-light, carrion crow), witch (casting pose, staff pose), propsA (cauldron, oven, cage with children, empty cage, bone totem, skull signpost), propsB (standing stone, grave, toadstool ring, well, crow tree, bone charm),
trees (6), bldg (rotten bridge, iron gate; the angled cottage and chapel from that sheet were thrown away), front (0 chapel, 1 cottage, both straight on), tex (6 seamless textures, cut by tools/ww_tex.py), smalls (boot, ribbon on a thorn, crumbs, rowan, hag-stone, gingerbread man).
The ingest tool removes Gemini's thin ground lines and specks. Contact sheets: `python tools/ww_contact.py <sheet>`. The Gemini tab and helper pattern are in tools/kh_gemini_helpers.js (downloads were made with a canvas and an anchor into the Downloads folder: no receiver was needed).

## Tests (own server: `python -m http.server 8374` from the repo root)
`python tools/ww_test.py shots` (console errors, level build, screenshots), `python tools/ww_flow.py` (all eight quests, the cages, the fight, the oven, the aftermath, with real game functions), `python tools/ww_shots.py` (about 30 screenshots in _ww_shots/), `python tools/ww_map.py` (parchment map),
`python tools/wl_walk.py` (Wenlock walkability: still passes with the new lane; it was run against port 8374).

## Known weak points
Hanged-man glade has no separate hanged-man picture in the tree (the revenant carries its own branch). The cage bars keep a faint mauve fringe from the magenta key. Interior rooms are plain (no windows, little furniture, the old Khemetra props stand in).
The wood is a dense maze: the map and the dirt track help. The ceiling is the standard sky under the fog.
