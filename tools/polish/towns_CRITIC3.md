# Towns critic review, round 3 (zone C, Deeper Hollow towns, final)

Method: own server on port 8362 (stopped by PID), link ?town=deephollow&lvl=34, 1100x760 software GL. 58 screenshots in the main tour plus 11 sign shots (tools/polish/c4_shots/, about 37 looked at with Read at full size). Audit rerun with c2_audit.js and c3_audit2.js (tools/polish/c4_tour.py, c4_signs.py, c4_result.json). Console errors: none in the tour (58 jumps) and none in the sign run. One transient "Cannot read properties of undefined (reading '29440')" appeared once while other agents were rebuilding index.html mid-run (all frames black); it did not reproduce on rerun, but watch for it after the final rebuild. Mean luminance measured on every shot (crop of the 3D view).

## Audit rerun
Pictures 35, givers 20 of 20 different, repeated sentences 1 (3x "They said it before they went in."), adjacent NPCs 0, blocker rows 1 (14,159), houses 32 (29 in a street run), church distances 3 to 6 squares (all eight), churchDoorBlockers 2 (huts in line at 2 squares: (106,175) for church0, (69,130) for church2), onWall 2, stacked 4, cut-off corridors 0, lights 737 (682 added), 235 corridor lamps, 7 plaques. 169 notes and signs, 7 still without a label (all hgd_pa_note: (75,91) (53,137) (59,145) (31,163) (11,177) (91,199) (101,200)). Writing: 153 lettered signs level-wide, 44 in the zone, 42 of them wall pictures. Em dashes 0.

## Second-review defects, one by one
1. Churches far from squares: FIXED. 3 to 6 squares, all visible from the square (church0, 1, 2, 6, 7 shots).
2. church4 white slab / church3 lantern bundle: FIXED in part. church3 is now a white shrine with candles and a frog priest (good). church4 is a mossy ruined arch with a monk, reads as a well or ruin, not a chapel.
3. Door blockers: PARTLY FIXED. Nothing in the doorway of church0, 3. The "GOODS" hanging shop sign still fills the left third of the view at church1 (16,162). Hut in line at church0 and church2 (audit). Barrel stands in front of the Dunewell giver when approached from the north (q4); from the west it is clear (dunewell_giver).
4. Enclave approaches near black: FIXED for hubs (all 18 hub averages 54.7 to 94, mean 72). Corridors still dark in four places (issue 3).
5. Honey Press and Pearl Fountain unidentifiable: PARTLY FIXED. Honey Press now has a lit "HONEY PRESS" plaque and a board, but the landmark is a pottery stall; Pearl Fountain not re-checked beyond its plaque.
6. Houses not a street: FIXED (29 of 32 in runs; house21 and house28 read as lanes with tudor, stone, thatch and onion dome cottages side by side).
7. Beige quad on the left of house5: FIXED (honeycomb wall is now painted hexagonal cells, house7 and Combwick shots). A different problem at Nacre Landing (issue 2).
8. Board repetition: not fixed, boards and plaques are still one board picture, but the names differ so it reads well.

## Luminance (mean of 3D view)
Hubs: 18 zone averages, all 61 or more except The Lantern Landing 58.5 (samples 54.7 and 62.2). Cairnhold 61.8 and Tessera 61.0 are on the edge. Overall hub mean 72.0 (target 60: met in 17 of 18). Corridors: mean 66.0, 11 of 54 samples under 50, darkest 42.4 (Mossy Corner), 44.0 (Lantern Landing), 44.6 (Quiet Room), 45.8 (Combwick). Plazas look warm and good; corridors outside lamp pools are still gloomy but readable.

## Grades (1 to 10)

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 6 | Villagers, signposts, houses, lamps and churches sit believably (q1, q7, house21, church2). Hanging shop signs are far too large and hang at the camera (house0 "MARL'S GOODS", house28 "SOLDE'S CURIOS", church1 "GOODS"). |
| Signage and text | 7 | Signposts, boards, plaques and shop signs in the squares are clearly legible with the new lettering (GILDMERE, THE COUNTING HOUSE, LAMPLIGHTERS' POST, GARDENER'S REST, HONEY PRESS). Corridor wall notes are legible only from about one square and at an angle ("Gold Key, Gold Door" readable at 2 squares; "Not Yours", "Door and key rule", "Gem doors" are unreadable slivers at 3 to 4 squares). 42 of 44 lettered signs are side wall pictures, so most lettering is only read when bumped into. |
| Prop placement | 6 | The giver at the Hedgefoot square (112,179) is half hidden behind a pile of sacks (hub_Hedgefoot). Nacre Landing's giant lantern cluster hangs in the walkway and fills the view (hub_NacreLanding, house14, mean luminance 117 to 140). Hanging shop signs fill the foreground. A crate sits in front of the "Large Night Visitor" slate (s_10). A mushroom clump and a crystal stand in front of notes (sign_tablet1, plaque1). |
| Repetition | 7 | 35 NPC pictures, 0 clusters. Mushroom clumps, wall lanterns and the same board picture recur, but each town has a distinct material and roof set. |
| Landmarks and navigation | 7 | Every church stands within 3 to 6 squares of its square and is visible from it. Landmark plaques are lit and named (Lamplighters' Post, Honey Press). The Honey Press is a pottery stall. |
| Lighting and atmosphere | 7 | Hubs 72 mean, 17 of 18 at 60 or more; plazas warm. Lantern Landing 58.5 misses; four corridors at 42 to 46. Still no mist. |
| Bespoke detail and storytelling | 8 | Per-town houses, painted wax cells, named plaques, vignettes, labelled notes with wry titles ("Not Yours", "The slug is not slow"), 20 different givers. |
| Art quality and consistency | 7 | church3 and church6 (pink cathedral with moth) are good; church4 is a ruin; some tint filters flatten shading (church2 onion dome), church6 has dithered black speckle on the facade. Honeycomb walls are good. |
| Performance | 7 | 737 lights; 299 ms per frame under software GL while other agents were running (not meaningful, as in earlier rounds); loads without stalls. Not measured on a real GPU. |
| Console errors | 9 | None in 58 jumps and 11 sign shots; one transient error during another agent's rebuild (see method). |

## Remaining issues (numbered, with coordinates and fixes)
1. MEDIUM, props hide givers. The Hedgefoot giver at (112,179) is half behind a pile of six sacks about 1 square in front of it; move the sacks 2 squares sideways. The Dunewell barrel is in front of the giver (42,90) from the north: move it 2 squares west.
2. MEDIUM, Nacre Landing (76,101) and house14 (71,101): the giant hanging pink lantern cluster is in the walk line and fills the screen (luminance 117 to 140). Shrink it to 0.5 scale, lift it above eye height or move it beside the road.
3. MEDIUM, lighting. Corridors still under 50 near Mossy Corner (93,134), Lantern Landing (15,11), Quiet Room (52,168) and Combwick (64,135). Add one lamp every 4 squares; raise the Lantern Landing hub from 58.5 to 60 or more.
4. MEDIUM, signage. Corridor wall notes are not legible from 3 squares (42 of 44 are side wall pictures). Fix: scale wall pictures 1.5x, or put the lettered plate on the end wall facing the approach, or move key notes onto signposts. Seven hgd_pa_note still have no label: (75,91) (53,137) (59,145) (31,163) (11,177) (91,199) (101,200).
5. MEDIUM, scale. Hanging shop signs (Marl's Goods at house0, Solde's Curios at house28, GOODS at church1 (16,162)) are 2 to 3 times the width of the stall and block the view at the camera. Fix: scale to 0.5 and raise them, and move the church1 sign 2 squares sideways.
6. LOW, doors. Hut in line at 2 squares: (106,175) before church0 and (69,130) before church2. Shift 2 squares sideways.
7. LOW, art. church4 (41,84) reads as a ruined well, not a chapel. church6 (124,16) has black dither speckles on the facade. Honey Press (63,140) is a pottery stall.
8. LOW, text. One sentence repeated 3 times ("They said it before they went in."). The slate "Large Night Visitor" (115,26) has a crate directly in front, text cut off.

## Verdict: FIX FIRST (proportions and prop placement 6; the bar was every grade 7 or more). The gaps are small and mostly prop positions and sign scale. The earlier landmark and art problems are closed.
