# Critic review round 3 (final): Deeper Hollow south zone

Method: own server on port 8361 (`python -m http.server`, stopped by PID), `?town=deephollow&lvl=34` (level 475). 64 full size screenshots (1100x760, software GL) taken with the round 2 route (12 vignettes, 5 signposts at 3 squares, 6 signposts close, 3 lamps, atrium, gate, 9 spots, 4 town squares, 8 dead ends, 5 quest givers, 6 waysides, 2 long climbs, note and post dialogues). About 40 of them looked at one by one with the Read tool, the rest measured. Audit `s_audit.js` re-run.

## Audit (re-run)

3,415 zone decor pieces, 0 out of scale in every class (lamps 1.3 to 1.5, shell statues 1.4, plinths 0.65, chests 0.46, table 0.5, houses 1.9, gate 1.5, trees 1.5 to 2.6), 0 cells far from a light (11,462 cells, 671 lights, all coloured), 104 text pieces, 0 empty, 0 duplicate, 0 em dashes, 0 hedge texts, 122 titled, 18 door props, 123 dead ends of which 1 empty, 0 tall props or enemies near people, 8 long runs with 0 big gaps. Patch time 1,026 ms here (was 325 to 439; measured while a luminance script ran at the same time, so treat as unconfirmed). 0 page errors, 0 HTTP 4xx. Console: 73 warnings, all `hgtm model ... triangles (cap about 3000)` for stilt and bulk models (not this zone's pieces) plus one getImageData hint. `ERR_CONNECTION_REFUSED` lines appear on cold load: they are the single threaded python test server dropping connections under 100+ parallel image requests (every named file exists in assets/ and rendered in the shots), not a game defect.

Luminance (mean of the 3D view over 64 shots): 75.9 of 255. Zero shots with any pixels above 240, so the Mosaic blowout is gone. Mosaic and gilded vignettes 98 to 127, Blue Quarter 77 to 93, brown corridors 42 to 75. Darkest: de4_65_65 41.9, wy_57_19 42.4, de7_197_11 48.2, de4_169_77 49.4.

## Second review defects, one by one

1. Signposts unreadable at 3 squares: FIXED. `pv_132_75`, `pv_41_15`, `pv_25_13`, `pv_189_43` read both lines clearly ("E GILDMERE / S NACRE LANDING", "N GILDMERE / W NACRE LANDING"). Minor: `pv_41_15` "S BLUE LANTERN" touches the board edges; `pv_73_39` is partly under a mist cloud.
2. Notes blank paper: FIXED. Every note shows a lettered title ("Cold Camp Diary", "Hunt Club Trophies", "The Mortar Mistake", "The Waiting Bench", "Gilder's Hoard"). Title only, and some are partly hidden (see remaining 2).
3. Scribe's Corner chair: FIXED. Chair, globe, table and candelabrum now sit below the bookcase (1.2).
4. Forge sign hides smith: FIXED. Sign now hangs low and to the right; smith fully visible (but see remaining 4).
5. Notice boards twice a villager: FIXED. Boards in Dunewell, Tessera and Blue Lantern are about the size of a signpost and the givers read as people.
6. Standing stone hides giver (46,92 f2): FIXED. Clear corridor to the note.
7. Kit repetition: MOSTLY FIXED. Tile Counter has scales and rubble, Mortar Mistake has skeleton, Cold Camp has lantern and bucket. Barrel still in 3 vignettes (remaining 3).
8. Mosaic blown to white: FIXED. `gate_foot`, `de6_129_37`, `wy_99_33` pink and mauve, hard edge gone, lantern glow reads.
9. Blue Quarter flat wallpaper: FIXED. Stone blocks with glowing mortar, `v_TheWaitingBench`, `de5_45_37`, `v_TheScribesCorner` look like a place.
10. Black tear at corridor end (103,27 f3): FIXED. Not present.
11. Empty dead end 169,80: NOT FIXED. Corridor is dim (49 mean) with only a faint blob and a door (remaining 1).
12. Borrowed purple art: FIXED. Barrels, crates, brazier, buckets now match their precinct (brown in Dry Well and Trophy Wall, grey in Barricade).
13. TEA NOTICE board (178,92 f2): resolved. It is a real lettered notice board.

## Grades (1 to 10), round 2 to round 3

| Area | R2 | R3 | Evidence |
|---|---|---|---|
| Proportions and scale | 7 | 8 | Audit 0 bad; chair, boards, givers, lamps, plinths all on scheme. Owl at (129,55 f2) is 1.31 and fills a third of a 1 wide corridor. |
| Signage and text | 7 | 8 | Posts legible at 3 squares, town signs and notice boards legible, shop signs legible, notes show titles. Note writing is title only. |
| Prop placement | 8 | 8 | Axis props at dead ends, clear givers. Foreground clutter in Barricade (crate, barrel, stone stacked in a 1 wide hall). |
| Repetition | 6 | 7 | Distinct kits, per biome dead end props. Barrel in 3 vignettes, same lantern art in Cold Camp and Lamplighter. |
| Landmarks and navigation | 7 | 8 | Posts readable and directions verified in round 2, waysides present, gate readable, colour per precinct. |
| Lighting and atmosphere | 6 | 7 | Mean 76, no blowout, no black. Some dead ends still dim (42 to 49). |
| Bespoke detail and storytelling | 7 | 8 | Lamplighter, Little Shrine, Gilder's Hoard, Mortar Mistake, Trophy Wall, Keeper's Cache all read. |
| Art quality and consistency | 6 | 7 | Recoloured props fit; blue stone and gilded panels good. Mosaic pink wallpaper still a busy flat print next to them. |
| Performance | 8 | 8 | Patch time unconfirmed (1,026 ms under load), 671 lights, GPU cost untested (software GL). |
| Console errors | 8 | 8 | 0 JS errors, 0 HTTP 4xx; only model triangle warnings from other zones. |

## Remaining issues (numbered)

1. LOW lighting: `de4_169_77` (169,80 f0) is a dim, empty looking corridor (mean 49). Fix: add one lit prop (chest or orb) on the axis at about (169,83) and a cage lantern in the last 2 squares. Brighten `de4_65_65` (65,67 f0, mean 42) and `de7_197_11` (197,13 f0, mean 48) the same way.
2. LOW signage: notes partly hidden by the prop in front. `v_TheGildersHoard` (190,55 f1) the chest covers the end of "Gilder's Hoard"; `v_TheKeepersCache` (129,55 f2) the owl covers the title; `v_TheMortarMistake` (71,6 f0) title cut to "The Mortar Mistak". Fix: raise the note `lift` by 0.15 or move the note 0.3 squares behind the prop.
3. LOW repetition: the same banded barrel in `v_TheBarricade`, `v_TheDryWell`, `v_TheTrophyWall`. Fix: swap the Trophy Wall barrel for `hpb_cask` or a standing shield, and the Barricade barrel for a sack.
4. LOW signage: shop signs are legible but large at 1 square (`ppl_hgd_s2_arms4_49_89`, 49,87 f2: the VARN'S FORGE board is about a third of the smith's height; in Hask's Goods it duplicates the stall's own lettering). Fix: scale shop signs to 0.5 and skip the sign when the stall art already carries lettering.
5. LOW signage: standing in the post cell (`post_132_75`, 132,75 f0) the pole fills the screen and the board is out of view. Fix: raise the board to 1.8 or keep it on the wall plane so it reads from inside the cell.
6. LOW art: Mosaic wall (pink wallpaper, `v_TheTileCounter`, `town_Tessera`) is a flat print without relief next to the stone blue and gilded panels. Fix: use a pink tinted stone block texture as in the Blue Quarter.
7. LOW verification: `wy_57_19` (53,19 f1) faces a plain wall at one square and shows no wayside; the orecart is around the corner. Check the wayside is visible on the approach.
8. NOTE (not a defect): the note and post dialogues type out; in a 2.5 s capture they were mid sentence ("goes rou", "East: Gild"). Confirm full text appears on the final frame.

## Verdict

SHIP. Every grade is 7 or more, no blockers, all first and second review blockers are fixed except the minor empty dead end; the remaining list is polish.
