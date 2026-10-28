# Critic review round 2: Deeper Hollow south zone (precincts 13 to 24, atrium, gate)

Method: own server on port 8372 (`python -m http.server`, stopped by PID from `south2_server.pid`), `?town=deephollow&lvl=34` (level 475), 69 full size screenshots (1100x760, software GL), every one looked at or in a contact group read with the Read tool: 12 vignettes, 6 signposts close, 5 signposts at 3 squares, 3 lamps, 4 atrium views, gate, 9 spots, 4 town squares, 8 dead ends, 5 quest givers, 6 waysides, 2 long climbs, 2 note and post dialogues, q9, hermit. Shots are in the scratchpad `cs/A`, `cs/B`, `cs/C`. Audit re-run: `s_audit.js` through `south2_probe.py` (output `south2_audit.json`). I also verified the signpost directions by my own breadth first search (`south2_q3.js`).

## Audit result (re-run, matches the fixer's table)

3,365 zone decor pieces, 0 out of scale pieces in every class (lamps 1.3 to 1.5, shell statues 1.4, plinths 0.65, signs 0.6, houses 1.9, bookcase 1.2, chests 0.46, trees 1.5 to 2.6, gate 1.5), 0 cells far from a light (11,462 zone cells, 641 lights, all coloured), 103 of 103 notes and signposts have live text (G.decor), 0 duplicate texts, 0 hedge texts, 0 em dashes, 0 creatures or tall props near people, 123 dead ends of which 1 is empty, 8 long runs with 0 big gaps. Patch time 325 to 439 ms. Load 18.8 s in software GL (same as round 1). 0 HTTP errors of 400 or more on a clean load (the 66 missing files of round 1 are gone), 0 JS page errors. Console warnings only: 8 `hgtm model ... triangles (cap about 3000)` lines for stilt and bulk models (not this zone's pieces) and one getImageData hint.

Signpost directions: 54 lines checked, all name a way that gets closer to the place and distances match the real path (within the 5 pace rounding). 6 of the 54 are exact ties (for example post 89,18 "South: Blue Lantern 95" while East is also 95), so they are true, not wrong.

## Grades (1 to 10), round 1 to round 2

| Area | R1 | R2 | Evidence |
|---|---|---|---|
| Proportions and scale | 6 | 7 | Every audited class is on the scheme and it shows: lamps, statues, plinths, houses, the gate (tallest thing near it in `gate_foot` and `atrium_n`). Still off: Scribe's Corner chair and table (36,5) are larger than the 1.2 bookcase (defect 3), forge sign hangs in front of its smith (defect 4), notice boards read about twice a villager in the town squares (defect 5). |
| Signage and text | 5 | 7 | Signposts are now a painted board with precinct and two lettered directions, text is live, directions verified. But at 3 squares only the precinct line reads, the two direction lines are mush (defect 1). Notes are blank cream paper in the world (defect 2). |
| Prop placement | 6 | 8 | q9 (75,21 f2) now has a clear giver, hermit (152,71 f3) has a clear corridor, ppl shots show nothing in the way except defect 6. Dead end props sit on the axis (de4_65_65 chest, de5_45_37 orb, de7_153_45 shell). |
| Repetition | 4 | 6 | 26 distinct vignette and wayside kits, 0 identical clusters, 0 rows. But barrel in 5 of 12 vignettes, pail and bowl in 3, same blank note paper in 6 (defect 7). |
| Landmarks and navigation | 6 | 7 | Waysides on long climbs (bell at 95,33 f1, minecart at 19,11 f1, benches, braziers), lamps coloured per precinct, gate readable. Signs hard to read (defect 1) and the atrium north wall has a blown out panel (defect 8). |
| Lighting and atmosphere | 4 | 6 | Blue Quarter and Mosaic Halls are no longer black, every cell is lit and tinted. But Mosaic is now over exposed: wall pieces near a light go flat near white with a hard rectangular edge (defect 8), while the Blue Quarter walls stay a flat navy wallpaper of star dots and read dim even beside a lantern (defect 9). |
| Bespoke detail and storytelling | 6 | 7 | Lamplighter (child statue, ladder, two lanterns), Gilder's Hoard, Little Shrine, Mortar Mistake (skeleton under rubble), Trophy Wall (shields and antlers on the wall) all read. Tile Counter (126,3) still has no tiles, only scales and a bucket. |
| Art quality and consistency | 7 | 6 | The new kits borrow Well Maze purple pictures (barrel, crate, bucket, brazier) that clash with the pastel Mosaic and the blue halls; the Mosaic and Blue wall textures are noisy flat fills next to the good sandstone and gilded walls; a few pictures sit at odd size inside a vignette (the Scribe's chair). The shops, gate, Warden and sandstone look are still strong. |
| Performance and loading | 8 | 8 | 325 ms patch, same load as before, 710 lights on the level (software GL gives 6 fps, no useful number, so the real cost of 641 coloured lights is untested on a GPU). |
| Console errors | 7 | 8 | 0 JS errors, 0 HTTP 4xx on clean loads. In 2 of about 7 probe runs the console showed `ERR_CONNECTION_REFUSED` lines that I could not reproduce with `requestfailed` logging; source unknown, so I do not count it as fixed or broken. |

## First review defects, one by one

1. Statues, plinths, lamps too tall: FIXED. Audit 0 bad. `v_TheKeepersCache` (129,55 f2): the owl is 1.31 and still fills a third of the view at two squares, acceptable now. `lamp_97_7` shows lamps in scale.
2. Shop signs bigger than shopkeepers: FIXED in the audit (0.6), PARTLY in play: see defect 4 here.
3. Wizard and bookcases: FIXED for bookcases (1.2); the wizard's awning was left by design.
4. Houses: FIXED (1.9, audit 0 bad).
5. Signposts and notes as handprint paper: FIXED for posts (painted board, text lettered, `talk_post` shows the precinct and two directions in the portrait and the dialogue). Notes no longer show the handprint but are blank paper (new defect 2). Legibility at distance is the new defect 1.
6. Blue Quarter and Mosaic near black: FIXED (0 cells far from a light). Introduces the over exposure in defect 8.
7. Lamp at q9 and creature at hermit: FIXED (shots q9 and hermit).
8. Long climbs empty: FIXED (21 waysides plus pace stones; wy_99_33, wy_23_11, long_71_49, long_103_27 show something every 10 to 15 squares).
9. Dead ends dull: FIXED (de4_65_65, de5_45_37, de7_197_11, de7_153_45 are good). Leftover: de4_169_77 (169,80 f0) looks down a dark empty stone corridor to a door with nothing on the axis.
10. Vignette props repeat: PARTLY FIXED (new props: windlass, ladder, scales, ore cart, shrine; wall banner replaced) but defect 7 below.
11. Tall ferns and flowers, gate: FIXED (gate 1.5 and tallest in `gate_foot`).
12. Leftover hedge jokes: FIXED (0 hedge texts).
13. Missing icons: FIXED (0 responses of 400 or more; done by the other agent).
14. Petal cloud: FIXED (spot_room_172_35 shows no bush hiding the giver).

## Remaining defects (new or still open)

1. **Signposts are unreadable at normal distance (HIGH, signage).** `pv_132_75` (132,78 f0), `pv_73_39` (70,39 f1), `pv_41_15` (38,15 f1), `pv_25_13` (25,10 f2), `pv_189_43` (187,43 f1): at 3 squares the precinct line reads, "E GILDMERE" half reads and the second direction is a smear. At 1 square the board fills the screen and the last line is clipped ("S NACRELANDING" with no gap, `post_132_75`). Fix: make the picture wider (0.9 high board, letters 1.5 times larger, two lines of direction only, abbreviate Nacre Landing to NACRE) or raise the sign to 0.9 and use a bolder, dark on light lettering.
2. **Notes are blank paper in the world (MEDIUM, signage).** `art_hs_page`, `art_hs_scroll`, `art_hs_slate` show no writing at any distance (Cold Camp 197,104 f0; Trophy Wall 171,11 f3; Mortar Mistake 71,6 f0; Gilder's Hoard 190,55 f1 where it looks like a white tombstone behind the chest). Fix: pick one pic per kind with visible scribble lines, or draw 3 to 4 grey strokes at run time like the signposts.
3. **Scribe's Corner scale (MEDIUM).** (36,5 f3): the round chair is taller than the bookcase and the screen top clips it, teapot and globe are plausible. Fix: chair to 0.55, table 0.5 as in the scheme (it is not using `hgtb_chair`).
4. **Sign blocks the shopkeeper (MEDIUM).** `ppl_hgd_s2_arms4_49_89` (49,87 f2): the VARN'S FORGE board hangs one square in front of the smith and covers him. Fix: move shop signs to the wall beside the stall or to 2 squares in front, and lift them (`lift`) above head height.
5. **Notice boards twice a villager (LOW).** `town_Dunewell` (42,90), `town_Tessera` (121,16), `town_BlueLantern` (28,45): the board is about twice the quest giver, who is a small blurred figure. Fix: boards 0.75 to 0.6 and quest givers 0.95.
6. **Standing stone fills the view at a giver (MEDIUM, placement).** `ppl_hgdpc_text_46_94` (46,92 f2): a pale cracked stone 1 square ahead hides the giver. Fix: remove props within 1 square of the standing cell of a named person, in the same pass that already clears tall props.
7. **Kit repetition (MEDIUM).** Same barrel in Cold Camp, Dry Well, Waiting Bench, Barricade, Trophy Wall; same bucket and bowl in Dry Well, Tile Counter, Mortar Mistake; same blank paper in 6. Fix: vary barrel with the crate or cask, drop the bucket from Tile Counter and Mortar Mistake, add tiles to Tile Counter.
8. **Mosaic walls blown to flat white by lights (HIGH, lighting).** `gate_foot` (100,3 f0): the wall at 100,1 is a hard edged white slab with a violet lantern; `de6_129_37` (127,37 f1) and `wy_99_33` (95,33 f1) wash the pink to near white. Fix: lower `kI` for biome 6 from 1.9 to about 1.3 and light radius cap, or lay `lift` only on props and not on wall faces next to the light.
9. **Blue Quarter wall is a flat navy star wallpaper (MEDIUM, art).** `v_TheWaitingBench` (7,52 f2), `de5_45_37`, `wy_23_11`: no stone, no relief, dim even at 2 squares from a cage lantern. Fix: replace with a stone texture tinted blue, raise biome 5 floor ambient a little.
10. **Black jagged tear at far corridor end (LOW).** `long_103_27` (103,27 f3): a dark triangular hole at the top of the far corridor. Fix: check wall cap geometry at the end of long runs in biome 6.
11. **Empty dead end (LOW).** `de4_169_77` (169,80 f0): nothing on the axis, only the door at the end. Audit counts this one as the 1 empty. Fix: one prop and a lantern like the others.
12. **Borrowed purple art (MEDIUM, consistency).** Waysides and vignettes use the Well Maze purple pictures on pink and blue backgrounds. Fix: recolor to the precinct tint (the `d2_recolor.py` tool exists) or paint one set for the Hollow.
13. **Unverified: "TEA NOTICE" board.** In `spot_room_178_92` (178,92 f2) a small grey board three squares ahead is lettered "TEA NOTICE" (looks like a clipped label). I could not match it to a decor piece, so check the text of boards in the Dry Ward.

## Verdict

FIX FIRST. The engineering and proportions are now good and the first review's blockers are gone, but three grades are below 7 (lighting 6, repetition 6, art consistency 6). Fix defects 8, 1, 2 and 7 first (about an hour of work), then 9 and 12.
