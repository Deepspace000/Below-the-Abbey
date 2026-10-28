# Underlevel (level 476) CRITIC review, round 2

Method: own server on port 8373 (stopped by PID afterwards), headless Chromium 960x720 full frames. 71 screenshots in `C:/Users/mirko/AppData/Local/Temp/c3shots/` (26 vignettes, 12 ladder approaches, 12 ladder feet, 4 orb alcoves, 5 signs, 2 beacon views and extras). Every shot looked at in the 25 I list below or spot checked. Scripts: `tools/polish/c3tmp/` (copies of d2_* pointing at 8373). Audit: `tools/polish/c3tmp/audit_after.json`.

## Audit re-run (reproduces the fixer's numbers)
violet props 0, scale outliers 0 of 412, coloured lights 53, orb frames 11 (fixer said 12, layout varies per load), readables 41, signs 23, blank signs 0, em dash false, unreachable 0, on water 0, blocking 0, clusters 0, rows of 3 equal 0, polish pass 347 to 378 ms, console errors none (only the old icn_*.png 404s filtered).

## Defects of round 1, one by one
1. Ship wheel oversized: FIXED. 0.54 high on its pedestal, now sits at monk-hip height beside a barrel (14_vig_The_Steersman).
2. Rune with no text: FIXED. 0 blank signs of 23.
3. Dig rectangle: FIXED. The tan rectangle is gone, replaced by a rubble heap and a cart (11_vig_The_Dig). New problem: a large grey light smear across the whole view there (issue 2 below).
4. Statue scale: FIXED. Child 0.75, adults 1.1 to 1.15, child now clearly smaller than the monk (13, 06).
5. Three boat sizes: FIXED by numbers (1.4 and 1.5 wide). But see issue 3, the wreck is still a whole boat.
6. Chest vs skeleton: FIXED. Chest 0.4 next to the seated skeleton reads right (24, 10).
7. Candles: FIXED. 0.15 high, a believable candle (09, 07, 36).
8. Palette clash: FIXED. 0 violet props, wm props are grey-blue and sit with the rock. The only violet is the deliberate pink orb light (issue 6).
9. Lighthouse and chapel from afar: FIXED. Hot core with a horizontal streak, readable at 8 and 20 squares (38_lamp_8, 39_lamp_20). Not checked at 34 by eye, the fixer's script says it is.
10. Ladder foot kit: FIXED. Bucket and rope, crate, candles, bones and skull, post and chain all stand in the approach corridor (ladB00, 01, 03, 07, 10). Four ladders have only a candle pair or one prop, see issue 9.
11. Sign wording: FIXED ("The way starts to the west", no arrow claimed).
12. Repeated book and skeleton: PARTLY FIXED, see issue 1.
13. Journal pages without days: FIXED per notes (days 12 to 63), not re-read in game.
14. Build time: FIXED, 0.35 to 0.38 s measured inside the page.
15. Glow Orb: FIXED. 11 alcoves with a framed orb cage, each its own light colour (x02 green, x03 blue). Light range 13.5 with an orb against 7.8 with a torch.
16. Skeleton on cairn: FIXED. In 09_vig_The_Tally_Wall the skeleton now sits beside the cairn with its hands on the floor.

## Grades

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 7 | All numbers consistent, statues, wheel, chests, candles right. The open book is too big (issue 4). Wreck is not a wreck (issue 3). |
| Signage and text | 8 | 41 readables, 0 blank, no em dashes. Rune stone is large and clear (x07). One lantern overlaps a rune (issue 5). |
| Prop placement | 7 | 0 blocking, 0 on water, set pieces sit on the floor. One overlap (issue 5), one statue clipped by the menu bar at 1 square (06, harmless). |
| Repetition | 6 | One seated skeleton sprite, one lantern cage, one bucket and rope, one book and one cairn appear in almost every dead end and vignette: 03, 09, 12, 15, 19, 24, x00, x02, ladB00. Mirroring hides it only a little. The rock wall tile is still one tile (every corridor shot). |
| Landmarks and navigation | 8 | Beacon from far away, coloured pools (blue grotto 07, 15, 16), minimap labels. |
| Lighting and atmosphere | 8 | Best area: ice blue, teal, amber and green pools (15, 18, x02, x03), red eyes, a clearly readable corridor in front of you. Smears in issue 2. |
| Bespoke detail and storytelling | 8 | Statues facing the water (13, 06), Dig, chapel, tally wall, orb alcove names. |
| Art quality and consistency | 7 | Recolour grey-blue is cohesive. Still only recoloured and reused painted pieces, no new painting. Pink orb room (19) is the one odd palette moment. |
| Performance and loading | 7 | 0.35 to 0.38 s polish pass, 163 halos drawn per frame within 14 squares (not profiled under real GL). |
| Console errors | 10 | None. |

## Remaining defects (numbered)
1. **Repetition of the dead-end kit** (medium). Same seated skeleton, same cage lantern, same bucket and rope, same book across about a third of the level. Examples: Company Purse (93,179), Tally Wall (191,149), Spare Shelf (20,115), Captain's Light (153,144), orb alcoves (64,77), (93,46). Fix: paint or find 2 more skeleton poses (lying, slumped against the wall) and 2 more lantern or candle holders, and use a different dominant prop per alcove.
2. **Grey light smear** (medium). The Dig at (63,105) f2 (and 02, 04 show milder): a white diagonal streak covers a third of the screen and washes out the cart. It is the halo glow of a light placed behind the player or at a wall corner. Fix: clamp halo radius and alpha when the light is within 2 squares of the camera, or skip the streak part for any light closer than 3 squares.
3. **The Wreck is a whole boat** (medium). The Wreck vignette at (154,81) f0 shows the same intact rowing boat with oars as the beached boats. Fix: paint a broken hull, or crop the boat in two halves (bow only, tilted planks) and add loose planks and rope.
4. **Open book still outsized** (low-medium). In 24 (20,115 f2) and 15 the book is about 3x wider than the lantern is tall and wider than the barrel. Fix: sc 0.6 for the book kind (width about 0.35 squares).
5. **Lantern drawn over rune** (low). Rune stone at (138,53) f2 (x08): a hanging lantern sprite overlaps the top half of the rune, hiding the first line. Fix: move the lantern one square sideways or drop it from rune squares.
6. **Pink orb room** (low). Captain's Light (153,144) f0 (19): the whole left wall is violet pink. It is a deliberate orb colour, but it breaks the grey-blue palette. Fix: shift that orb to the amber or green set or lower the colour saturation of the wall light by half.
7. **Red speckle cloud** (low). Barricade (170,24) f1 (10) and Chalk Corridor (105,31) f2 (01): a cluster of small red rings floats on the far wall. It reads as noise, not as a thing. Fix: find out which sprite it is (likely distant eye glow or a swarm) and give it a body, or cull it past 6 squares.
8. **Single wall tile** (low-medium, carried over). Every corridor shot has the same rock tile at the same scale. A second tile with chalk marks or a stained variant for every 10th square would help.
9. **Ladder kits uneven** (low). The ladder at (172,75) has a candle pair only, and (31,68) and (135,76) show a bare corridor in the first 3 squares in two of my tries. Fix: give every ladder at least one tall prop (post, crate or cage).
10. **Water band cuts through statue** (low). 13_vig_The_Waiting_Rock (95,125) f0: a hard horizontal water edge crosses the child statue's belly. Water edge is drawn over the sprite. Fix: draw statues after the water plane, or raise the plinth.

## Verdict
FIX FIRST on strict reading (repetition is a 6). All 16 round 1 defects are really fixed and the zone is clearly better, with no console errors. Issues 1, 2 and 3 are the ones to clear, then SHIP.
