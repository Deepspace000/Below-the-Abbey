# Underlevel (level 476) CRITIC review, round 3 (final)

Method: own server on port 8363 (stopped by PID), headless Chromium 960x720, 44 full-size frames, 26 of them opened and looked at (vignettes, ladders, signs and runes, beacon at 8 and 20 squares, hubs). Audit re-run with the u3 script, luminance with the u3_lum script (14 corridors, 5 hubs), text state probed in the page. Scripts and frames are in the session scratchpad (`c/` and `shots/`).

## Audit re-run
violet props 0, scale outliers 0 of 437, blank signs 0, em dash false, unreachable 0, on water 0, blocking 0, clusters 0, rows of 3 0, pairs 4, seated skeletons 4, kits 16 (10 used), dead-end prop sets 53 distinct (top 7 percent), book 0.14 high and 0.38 wide, console errors none. Polish pass 664 ms in the audit run (it was 378 ms in round 2).
Luminance: corridors mean 74.8 (min 61.0), hubs mean 62.2 (min 51.7), so the fixer's 76 and 67 do not reproduce; hubs run 5 below the claim.

## Second-review defects, one by one
1. Grey smear at the statue (63,105): FIXED. The Spare Shelf and The Dig frames show no smear and no statue fills the view.
2. Wreck: PARTLY. It is a cut hull with a stern piece and planks and reads as damaged, but it is the old boat picture with a straight sawn edge, and 25 intact boats stand beside it.
3. Dead-end kits: FIXED by the numbers (53 sets, top 7 percent). In frames Barricade, Tallow Camp, Stone Stack, Company Purse each look different.
4. Book too big: FIXED (0.14 high, reads right beside the barrel and lantern).
5. Lantern over rune: FIXED (0 notes and runes share a square).
6. Captain's Light colour: FIXED, amber cage and warm pool.
7. Labels: NOT FIXED in the world. Data is right (23 of 23 have a label and text), but nothing is drawn. See issue 1.
8. Brightness: PARTLY. Corridors fine; hubs 62 (see issue 4).

## Grades

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 8 | 0 outliers; statues, wheel, chests, candles, book all read right. Wreck still a cut boat. |
| Signage and text | 3 | The 23 level-476 notice boards are the blank pinned-papers picture; the 12 or so rune stones show glyphs only. No word is visible anywhere on the level (frames 32, 36, 37, 39). |
| Prop placement | 7 | Nothing blocks or floats. Twin identical chests side by side at The Barricade look mirrored. |
| Repetition | 6 | Kit variety is fixed. Wall is still one rock tile in every corridor; two cage lanterns of one type; mirrored pairs. |
| Landmarks and navigation | 8 | Beacon reads as a hot core with a streak at 8 and 20 squares; coloured pools (teal, amber, cyan); statues facing the water. |
| Lighting and atmosphere | 7 | Good pools and fog. Hubs average 62 and the darkest are 52. |
| Bespoke detail and storytelling | 8 | Weeping child with the lantern, praying monk by the water, Dig, tally stone, eye wall. Story is mostly lost because the notes cannot be read in world. |
| Art quality and consistency | 7 | Grey-blue recolour is cohesive. No new painting (wreck, boards). |
| Performance | 6 | 664 ms build pass in swiftshader (was 378); about 165 halos. Not profiled on real GPU. |
| Console errors | 10 | None. |

## Remaining issues
1. **Signs and notes show no writing** (blocker). `hgd_polish_text.js` `hgtOne` only handles decor whose `d.k` starts with `art_hs_`. Level 476 uses `hgpd_board` (notice board) and `hgpd_rune`, set in `hgd_polish_d.js` lines 278, 280, 305 and 334, so `d.hgt` stays null and `d.label` is never painted (probe: hgt null, hgtBase null on all 23). Examples: board (65,77) "Dunmow's Light", (77,59) "The Spare Light", (93,46), (124,22), (95,163); rune stones (21,117), (78,53), (191,147). Fix: in `hgd_polish_d.js` give boards the `art_hs_board` or `art_hs_page` picture (or add `hgpd_board` and `hgpd_rune` to HGTX_TBL with a text rectangle measured on their pictures) and let `hgtOne` accept them, then check that the label is at least 12 px tall from 3 squares. For rune stones either paint the one to four word label in the engraved gold style under the glyphs or add a readable line; glyphs alone do not count as writing.
2. **Hub brightness** (medium). Hubs average 62.2, min 51.7: hubs (87,163) f0 and (20,117) f0 are the darkest. Fix: raise the ambient or add a light of range 4 to any 3x3 hub with none within 3 squares, aim at mean 70 or more.
3. **Wall tile is a single stone** (low-medium, carried over). Every corridor frame uses the same rock tile. Fix: a stained and a chalk-marked variant on every 8th to 10th wall square.
4. **Twin chests** (low). The Barricade (24,128) f2: two identical mirrored chests side by side. Fix: swap one for a crate or a broken chest.
5. **Wreck is still a boat picture** (low). (154,81) f0: cut hull with a straight sawn edge. Fix: paint a proper broken hull or add a jagged cut mask and ribs showing.
6. **Build pass 664 ms** (low). Was 378 ms. Fix: cache the per-square light scans or build lazily on first visit of the zone; verify on a real GPU.
