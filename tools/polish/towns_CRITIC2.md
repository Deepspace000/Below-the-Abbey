# Towns critic review, round 2 (zone C, Deeper Hollow towns)

Method: own server on port 8372 (my process stopped by PID; an older server on the same port, PID 13236, was not mine and was left alone). Link ?town=deephollow&lvl=34, 1100x760, 36 full-size screenshots in tools/polish/towns_critic2_shots/ (all looked at with Read), audit rerun with tools/polish/c2_audit.js (via tools/polish/towns_critic2.py), c2_quest.js rerun, console watched. Console errors: none. Load about 29 s in software GL (swiftshader, not a fair frame-rate test).

## Audit rerun (matches the fixer's table)
Pictures 34, givers 15 of 15 different, repeated sentences 0 (max 2), adjacent NPCs 0, blocker rows 0, houses 32, extra lights 332, cut-off corridors 0, on-wall props 0, clusters 0, stacked 1. All 93 zone NPCs open a conversation, no errors.

## Defects of the first review, one by one
1. Churches identical: FIXED in silhouette (8 different shapes: chapel, wooden shrine, honey dome, pink lantern shrine, white tower, blue tent, moth hall, gold dome, shots church0 to church7). Quality caveat in new issues 2 and 3.
2. Same frog for every giver and priest: FIXED (15 of 15 differ; humans, frogs, moth, monk, farmer, fisher seen in q0 to q7 and church shots).
3. Shops shoulder to shoulder: FIXED (0 adjacent, 0 blocker rows; q1, q2, q5, q7 read as open squares with spaced stalls).
4. No houses: FIXED in part. 32 houses with lettered plates (house0, 5, 10, 15, 20, 25, 30). They are single sprites dropped in maze corridors, not a street of roofed houses (see issue 6).
5. Repeated sentences: FIXED (0 over 2).
6. Black church fronts: PARTLY FIXED. Church doors have lamps and glow (church0, 1, 6, 7 good). Enclave approaches are still nearly black (vign8, w_fount, both near-black).
7. Unreadable boards and generic signs: FIXED. Boards read "COMBWICK NOTICES", plaques "OLD WELL", "SILENCE NOTICE", "TANSY'S INN", "BRAND'S ...", zero duplicate sign text.
8. Landmark plaques hiding landmarks: FIXED for Old Well (w_well: well clear, plaque beside it). Honey Press and Pearl Fountain still not identifiable (w_press only shows a corridor, vign8 is a notice board).
9. Vignette props hiding givers: FIXED (w_enc2: reading room globe and books no longer cover the giver, giver is behind but visible with its mark).
10. Duplicate Tessera signs: FIXED (dupSigns empty).
11. Tooling: not a game defect, ports still hard coded.

## Grades (1 to 10)

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 7 | Villagers 0.9 to 1.05, shop signs, houses and lamps sit believably (q0, q1, q2, house0). Statue in Hedgefoot is taller than the people beside it, acceptable. |
| Signage and text | 8 | Lettered boards, plates, shop names; no em dashes, no repeats, Hollow cipher intentional. |
| Prop placement | 6 | Props still hide the thing they belong to: stone lantern sits dead in front of church0 doorway (w_chuA), fern spiral stands in front of the lantern shrine church3 (church3 shot), a "GOODS" sign fills the left third of church1, a huge crate stands in front of the Dunewell giver (q4). |
| Repetition | 7 | 34 pictures, no clusters. Houses and churches still reuse older paintings. Notice boards and plaques are the same board picture everywhere. |
| Landmarks and navigation | 5 | Churches are 12 to 21 squares from town centres (Hedgefoot to church0 is 21, Dunewell church is about 12, Gildmere to church6 is 22). Nothing is visible from a street junction. No beacon, no street leading the eye to the church. Press and fountain still unreadable. |
| Lighting and atmosphere | 6 | Plazas and church doors are warm and good (q1, q6, q7, church0, church7). Enclave corridors still near black (vign8, w_fount). No mist, as the fixer said. |
| Bespoke detail and storytelling | 7 | Plates, vignettes, notes, per-town houses (beehive, shell, sand hut, tent, gold dome) are charming. |
| Art quality and consistency | 6 | church4 is a flat featureless white slab with a tiny emblem and a cropped top edge (church4 shot); church3 reads as a pile of pink paper lanterns, not a church; tint filters flatten the shading on church2 and church5. A big flat beige quad covers the left half of house5. |
| Performance and loading | 7 | 332 added lights, 809 level-wide; no stalls seen, load 29 s in software GL. Not measured on real GPU. |
| Console errors | 10 | None on load, 36 jumps, or 93 talks. |

## Remaining issues (numbered, with coordinates and fixes)
1. HIGH, landmarks. Churches stand far from the square and cannot be seen. Coordinates: church0 (120,160) vs Hedgefoot (112,179); church2 (54,147); church4 (52,78); church5 (36,32); church7 (156,22) vs Gildmere (143,28). Fix: move each church to within 6 squares of its square (hgd_church.js owns placement, or relocate in the polish block with a pocket check), and add a signpost or lit lantern trail from the square to the church door.
2. HIGH, art. church4 (52,78) reads as a plain white slab; church3 (77,104) is a lantern cluster. Fix: paint real chapel fronts (gable, door, window) or cut the tint strength and restore the original shading; for church3 pick a shrine picture instead of the lantern bundle.
3. MEDIUM, placement. Door blockers: stone lantern at about (120,162) in front of church0; fern spiral in front of church3 at (77,106); crate at about (42,92) between player path and Dunewell giver (42,90); "GOODS" signboard beside church1 (16,162) at 1 square. Fix: move each at least 2 squares sideways of the door line.
4. MEDIUM, lighting. Enclave approaches near black: (45,169) toward Quiet Room, (110,181) side lanes, (52,167). Fix: one dim lamp every 5 squares along the 8 enclave corridors, as already done for junctions.
5. MEDIUM, landmarks. Honey Press (65,142) and Pearl Fountain (48,170) are still unidentifiable. Fix: a painted press and fountain, or at least a lit named plaque facing the approach.
6. LOW, houses. 32 single huts in corridors do not make a street (CLAUDE.md asks for a lane of houses). Fix: group 3 to 4 houses along one lane per town with 1 square gaps.
7. LOW, art. A large flat beige quad fills the left half of the view at (13,159) facing east (house5 shot): probably a missing wall texture or a stretched prop. Fix: inspect that wall cell.
8. LOW, repetition. Notice boards and plaques are one board picture in all towns; add two board variants.

## Verdict: FIX FIRST (landmarks and navigation 5; prop placement, lighting and art quality at 6).
