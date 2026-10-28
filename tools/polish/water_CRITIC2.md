# Critic review, round 2: Zone water (Drowned Maze 477, boat lakes of 475)

Method: own server on port 8374 (stopped by PID afterwards), e_dump.py and e_audit.py / e2_audit.py re-run against the live game,
42 full-size screenshots (1100x760) in tools/polish/shots_ecritic2/ (ec2_*.png): 13 set pieces, 4 signposts and notes, 12 corridor views,
13 lake views of 475 (docks, landmarks). Every shot was looked at. Console errors: none (the old hgdpc ReferenceError did not appear). Load: both levels came up without stalls.

Audit re-run (matches the fixer): table outliers 0; round-leaf vines gone; 81 lights, 985 of 985 open squares inside a light pool; 28 note carriers on 18 different sprites;
creatures within 3 squares of a set piece 1 (piranha at (36,29)); solid props with under 3 squares of sight 1 (rune stone (5,35), sight 2).

## Round 1 defects, one by one

1. One note sprite with a red handprint: FIXED. Posts, waymarkers, slates, plaques, scrolls, tablets, a noticeboard and notes riding on the bell, boat, shrine, scales (ec2_note1, ec2_way1, ec2_shrine).
2. Round-leaf vine hiding the note at (13,37): FIXED (signpost is clear in ec2_note1).
3. Scale of bell, statues, shelves: FIXED. Bell is now about the size of the statue (ec2_bell), shelves differ (ec2_library), mirror and scales read at human scale.
4. Enemies parked on set pieces: MOSTLY FIXED. Nothing on the cache, board or bell now. One piranha remains 3 squares from the warden chest (audit).
5. Shrine not visible: FIXED (ec2_shrine, clean sight line, candles and crystal).
6. Fish like feather fans: FIXED in style (painted carp, perch, goldfish, pike: ec2_library, ec2_c2) but see issues 4 and 5 below.
7. Three identical lakes: PARTLY FIXED. Water now looks wet: tinted water floor, a landmark with an upside-down reflection, per-lake light colour (ec2_l1m amber-teal lamp pillar, ec2_l2m shell statue, ec2_l3m crystal pillar), shell-pattern walls at lake 2 (ec2_l2b). But the dock approach is still the same arch, boat and planks in lakes 1 and 2 (ec2_l1a and ec2_l2a differ only by side tint), and the boat is still cut by the bottom edge.
8. Empty corridors: PARTLY FIXED. Lights everywhere, but (41,13) north (ec2_c7) and (7,33) north (ec2_c9 area) and the row at (27,9) east (ec2_c11) are 10 to 16 squares of plain dark green with one bookshelf edge.
9. Dead ends bare: FIXED per audit (audit counts 0), views at (1,41) and (1,1) hold a seagrass tuft and a lamp.
10. Old-save chest migration: NOT FIXED (acknowledged by the fixer, no flag migration, no test).
11. Eight near-identical signposts: FIXED, eight voices with real distances.

## Grades

| Area | R1 | R2 | Evidence |
|---|---|---|---|
| Proportions and scale | 6 | 7 | Table respected, bell, shelves, mirror, rune all sensible. Remaining: carp at one square is a screen-filling 1.0 high monster (ec2_way2); lake dock boat still bigger than the planks (ec2_l1a); moss mound at (31,26) is as big as a barrel and hides the board (ec2_board). |
| Signage and text | 6 | 8 | 18 sprites, distinct voices, no dashes, none empty. Notes reachable and unobstructed. |
| Prop placement | 7 | 7 | Audit clean. But decor stands in front of set pieces: moss mound hides the Warden's board (ec2_board), another hides the ruin arch at (1,5) (ec2_c12); fish pile onto the library shelf and cover a note (ec2_library, ec2_way2); several set pieces are one lone prop in a bare tunnel (ec2_mirror, ec2_diver, ec2_grotto, ec2_scales, ec2_rune). |
| Repetition | 5 | 6 | Fish are varied now, but the same big round moss mound, same tall seagrass tuft and same pink vent wedge recur in almost every shot (ec2_c8, c12, board, garden, library, bell). |
| Landmarks and navigation | 6 | 6 | Eight good signposts and 13 set pieces, but from a corridor you cannot see any of them; set pieces sit around corners. Long blank runs remain (ec2_c7, ec2_c11). Lake landmarks are strong from the water (ec2_l2m, ec2_l3m). |
| Lighting and atmosphere | 5 | 6 | Light pools are real now, lakes have tinted water and reflections. But maze corridors are one flat dark green, no fog layer, no caustics, no wet floor; vent "pink wedge" reads as a flat pink triangle rather than lit sand (ec2_bell, ec2_library). |
| Bespoke detail and storytelling | 7 | 7 | Diver, candles, nets, amphora and frog lantern keeper are good (ec2_lantern). Still all reused art, no painted jetty, heron colony or lily pads. |
| Art quality and consistency | 6 | 7 | Painted fish are a big step up. Pale outlined lobster pots look ghostly (ec2_l1c), one bright white flat fish sprite remains (ec2_bell, right side), enemy sprites go very blurry at 1 square (ec2_c5). |
| Performance and loading | 8 | 8 | 1050 decor, 81 lights, 119 fish, no stalls seen. Not profiled on a real GPU. |
| Console errors | 10 | 10 | None. |

## Remaining issues

1. H. Set pieces are single props in bare tunnels: mirror (3,11), diver's camp chest (21,39), pearl clam (29,31), scales (3,25), rune stone (5,35), smugglers' crates (13,29). Add 3 to 5 supporting props and a light pool each, so they read as scenes (ec2_mirror, ec2_diver, ec2_grotto).
2. H. Moss mound (art_hgwm_moss) sits at 1 to 2 squares in front of the Warden's board (31,26), the ruin arch (1,4) and others and hides them (ec2_board, ec2_c12). Remove moss within 2 squares of any set piece, and cap moss height at about 0.25.
3. M. Lakes 1 and 2 share one dock approach (arch, boat, planks); boat cut by screen bottom. Give each landing its own approach prop or boat pose (39,137), (147,97) facing north. Lake 3 docks (97,65) and (123,43) face blank walls at the dock (ec2_l3a, ec2_l3c): turn landings toward the water.
4. M. Fish are placed head-on to corridors: a carp pair at (35,39) facing west fills the screen over a signpost (ec2_way2); fish stack on the library shelf (ec2_library). Keep shoals at 1.5 squares or more from notes and set pieces, and cap size at 0.35.
5. M. Long blank corridors remain: (41,13) to (41,3) north, (27,9) east, (7,33) north. Add a light plus one small prop every 5 squares.
6. M. Lighting is one hue in the maze: add a second tint (teal for gardens, amber for camps) and a fog band or caustic overlay at low height. The pink vent wedge should be a lit sand disc, not a flat triangle.
7. L. White flat fish sprite at (19,17) region (ec2_bell, right) clashes with the painted carp; replace or tint.
8. L. Pale outlined lobster pots at dock 1 (ec2_l1c) look unfinished; use a painted pot or darken the outline.
9. L. Piranha at (36,29) is 3 squares from the warden chest; move 2 more squares away.
10. L. Old saves: opened chests that were moved may be offered again once. Add a flag migration and a load test.
11. L. No quest or save-load test was run for this zone; minimap and save load were not checked.

## Verdict

FIX FIRST. Large gains (signage, scale, painted fish, lake reflections, shrine, clean console), but repetition, landmarks and lighting are still 6, and set pieces still read as lone props with moss blocking two of them.
