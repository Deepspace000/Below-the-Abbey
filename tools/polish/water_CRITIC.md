# Critic review: Zone E, Drowned Maze (477), lakes and marsh (475)

Method: own server on port 8384, tools/polish/e_dump.py and e_audit.py re-run (numbers match the agent's report), 36 full-size screenshots
(1100x760) in tools/polish/shots_ecritic/ (ec_*.png): 13 set pieces, 3 signposts, 3 notes, 5 corridors, shrine, 6 lake docks of 475.
Console errors: none in any run. Load: level 477 and 475 both came up in under 15 s under software GL (no stalls seen).

## Grades

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 6 | Props sit on the floor line and nothing is stretched. But bell vs statue vs shelves are not in one scale (issue 3), roundleaf vine fills the screen (issue 2), boat dwarfs the dock (issue 7). |
| Signage and text | 6 | 27 notes, no dashes, no empty text, no duplicates (audit). But all 27 use one sprite with a red handprint (issue 1) and eight signposts say almost the same sentence. |
| Prop placement | 7 | Audit clean (0 blocked squares, 0 unreachable). Enemies sit on top of set pieces (issue 4). Shrine not visible from its open side (issue 5). |
| Repetition | 5 | Cluster counter is 0, but the same two fish shoals, same orange fry swarm and same moth sprite repeat in every view (issue 6). |
| Landmarks and navigation | 6 | 13 set pieces plus signposts, but corridors between them are long empty green fog (ec_corr1, ec_corr3, ec_sign3). |
| Lighting and atmosphere | 5 | Pools of light under set pieces are nice (ec_garden, ec_bell). Elsewhere flat dark green; no water surface, no reflections, no wet floor, no caustics. |
| Bespoke detail and storytelling | 7 | Written stories are good (diver's slate, bell, scales). Pictures only reuse existing art, so the vignettes read as prop piles, not scenes. |
| Art quality and consistency | 6 | Painted props are good; bubbles and pearly statue are good. Fish shoals look like white feather fans (ec_diver, ec_rune), a mismatch with the painterly rest. |
| Performance and loading | 8 | No stalls, 1023 decor on 985 squares. |
| Console errors | 10 | None. |

Water brief: the user asked for water that looks wet and lit (reflections, lily pads, jetties, fog on water, shoals, drowned statues). In the
maze: drowned statues yes, fog yes, shoals weak, reflections no, lily pads no. In the 475 lakes: nothing was added, and the three lakes look
identical (ec_lake1a, ec_lake2a, ec_lake3a are the same dock tunnel picture, only the side tint differs).

## Issues (severity: H high, M medium, L low)

1. H. Every note and sign is the same parchment sprite with a red handprint (hl_p_note). It reads as a bloody warning on a brass plate,
   a chalk mark, a slate and a signpost alike (ec_scales, ec_lantern, ec_cache, ec_sign3, ec_note1). Repro: level 477 at (3,25), (5,35), (3,11), (21,11).
   Fix: paint or reuse distinct front-on sprites (brass plate, slate, wooden signpost with arrows, clam shell); the e_ prefix is reserved for this.
2. H. hgt_vine_roundleaf (15 in the maze, 2.2 persons tall) fills the whole frame and hides the note behind it (ec_note1, repro (13,37) facing west
   from (15,37)); the leaf colour is pearly pale and clashes with the green water. Fix: cap sc so height <= 1.4, or remove inside corridors and keep
   in rooms only; tint to the maze green.
3. M. Scale mismatch in set pieces: the Sunken Bell (0.9) is far larger than the Saint statue (1.25 but narrow) next to it visually and the bell
   fills 60 percent of the screen at 2 squares (ec_bell, (17,17)); the library shelves are 1.0 but the central pale shelf looks different (ec_library, (18,7)).
   Fix: set bell to about 0.7 and scale all three shelves identically, tint the central one to match.
4. M. Enemies stand in set pieces. A bloodworm lies across the smugglers' chest (ec_cache, (3,10) enemy over the cache at (3,11)), a giant leech
   at the Warden's board (ec_board, (31,25)), a giant worm fills the corridor at (20,29) (ec_corr3). The worm is also out of scale (taller than the wall).
   Fix: move enemies 3 or more squares from any set piece, and cap worm sc at 1.0.
5. M. The Saint's shrine at (17,25) is not visible from (19,25) looking west (ec_shrine2 shows an empty corridor, only fish) and from (17,27) the
   camera faces a stone arch (ec_shrine). Either the shrine is hidden behind a blocking cell or the approach is wrong. Repro: load 477, goToLevel(477,{x:19,y:25,f:3}).
   Fix: check G.grid around (18,25) and (17,26); face the shrine toward the open corridor.
6. M. The fish shoal (white, spiky, feather-fan look) and orange fry swarm are placed in near mirror-image pairs high in the frame (ec_start, ec_mirror,
   ec_board, ec_corr5). They read as hanging ornaments, not swimming fish, because they sit at head height and never move apart.
   Fix: more varied sprites, smaller shoals at different heights, and bob them; add a few single fish.
7. M. Lakes (475): all three look the same and have no water in view at the dock; the boat is cut by the bottom of the screen and is larger than the
   dock planks (ec_lake1a, ec_lake2a, ec_lake3a, ec_lake3b; docks (39,137), (147,97), (97,65), (123,43)). No lily pads, reeds, reflection, jetty
   posts with ropes or fog on the water. Fix: a water surface layer with reflection tint and ripples at the dock, lily pads and a heron colony
   as bespoke, one different landmark per lake.
8. L. Corridors are very empty and dark: 15 to 20 squares with only one reed (ec_corr1, ec_corr3, ec_corr5). Fix: dim ceiling lamps or glowing
   weed at every 6th square, a floor puddle sprite.
9. L. The audit's remaining weak points: 2 dead ends with only weed (1,41) and (1,1); one barrel in a one-square corridor (7,31).
10. L. Old-save risk: seven chests were moved; an opened one may be offered again once. Add hint notes or a flag migration.
11. L. Eight signposts say almost the same sentence about the steps and the Warden. Fix: vary the wording and add distance in squares.

## Verdict

FIX FIRST. The structure and writing are sound and the audit numbers hold, but the zone is not yet "wet and lit": no reflections, lily pads or jetties,
one note sprite for everything, a few scale problems, and enemies parked on set pieces.
