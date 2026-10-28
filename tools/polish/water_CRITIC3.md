# Critic review, round 3 (final): Zone water (Drowned Maze 477, boat lakes of 475)

Method: own server on port 8364 (stopped by PID), tools/polish/ec3_all.py (audit, save tests, 41 shots with mean luminance), ec3_sign.py (quest test, creature probe, 18 sign close-ups at 3 and 1 squares), ec3_lab*.py. All 59 full-size shots (1100x760) are in tools/polish/shots_ecritic3/ (crit_*.png, sg_*.png); 29 were looked at one by one with the Read tool (13 set pieces, 5 hubs, 4 corridors, 4 lake docks and water, 6 sign close-ups). Console errors: none.

Audit re-run (matches the fixer): moss near set pieces 0, moss max 0.25, 13 set pieces with 9 to 21 props within 3 squares, max distance to a landmark 10 (at 5,17), 39 notes all with a label and text, no dashes, piranha 6 squares from the warden chest, 162 lights, 965 decor. Save tests: oldSaveOpensEmpty, newSaveRestored, indexIgnored all true.

Luminance (mean of 3D view): corridors 54.1 to 75.9, hubs 61.3 to 83.5 (hub1 at (34,28) is 61.3, below the claimed 64), set pieces 56 to 91, lake docks 58 to 66, lake water 55 to 58.

## Second-review defects, one by one

1. Set pieces are lone props (mirror, diver, clam, scales, rune, cache): FIXED. Mirror, scales, cache, rune stone and nook now read as scenes with 5 to 8 props (crit_v_Mirror, crit_v_The_scales, crit_v_Smugglers_cache, crit_v_Rune_stone).
2. Moss hides the board and ruin arch: FIXED for moss (audit 0, max 0.25). But the board is still not seen, now because of a creature (see issue 1 below).
3. Lakes 1 and 2 share one dock approach: NOT FIXED. crit_l0d, crit_l1d, crit_l2d are the same arch, the same planks and the same boat in the same place, differing only by a side tint. The beacon "straight ahead" is not visible from the dock (dark arch opening). The boat is still cut by the screen bottom. The fixer admits the arch is engine geometry, but the boat and the bottom crop are decor.
4. Fish head-on over notes: MOSTLY FIXED. Fish are at 0.35. But crit_hub2 shows a giant catfish filling the right third and a pike on the left at about 1.5 squares: far larger than 0.35 reads on screen.
5. Long blank corridors: PARTLY FIXED. (27,9) east (crit_c11) is still a blank green tunnel with nothing but a distant speck for 10+ squares; crit_cor7 (25,41) has one clam and a note. Landmarks exist in the data but are not on the sight line.
6. One hue and a flat vent wedge: PARTLY FIXED. The haze exists (gardens teal, shrine violet) but corridors are still flat green; the pink vent wedge under statues is now a pink disc (crit_v_Garden), acceptable.
7. White flat fish: not seen (not re-checked as found). 8. Pale pots: darker now (crit_v_Smugglers_cache), FIXED.
9. Piranha near warden chest: FIXED (6 squares).
10. Old-save chest migration: FIXED and tested.
11. Quest, save and minimap test: DONE by the fixer, but my own quest run found a new bug (issue 2).

## Grades

| Area | R2 | R3 | Evidence |
|---|---|---|---|
| Proportions and scale | 7 | 6 | Net drying rack in hub2 is about 2.5 high and fills the screen (crit_hub2); catfish at 1.5 squares is screen filling (hub2); barrel at 1 square in scales view is bigger than the scales. Statues, shrine, rune, mirror fine. |
| Signage and text | 8 | 5 | See issues 3 to 5. Writing is only legible at 1 square, and then often reads just "Note". Titles are truncated sentences. |
| Prop placement | 7 | 7 | Clean sight lines, no moss blocking. Three set pieces filled by creatures. |
| Repetition | 6 | 6 | Same frog with lantern, same candelabra, same crystal clusters, same barrel and coral in nearly every set piece (Mirror, Shrine, Scales, Cache, Nook). |
| Landmarks and navigation | 6 | 6 | Signs are numerous but unreadable from afar; (27,9) east still blank; Board, Bell and Diver's camp not visible from their approach. |
| Lighting and atmosphere | 6 | 7 | Measured luminance fine, set pieces lit by pools, lake water tinted and reflecting (crit_l2w crystal pillar is good). Maze corridors remain a single dark green. |
| Bespoke detail and storytelling | 7 | 7 | Shrine, diver, candles, nets, frog keeper good; many notes carry real stories. |
| Art quality and consistency | 7 | 7 | Painted props consistent; lake docks and creature blur at 1 square unchanged. |
| Performance and loading | 8 | 8 | 162 lights, 965 decor, 119 fish: no stalls under software GL; not profiled on a GPU. |
| Console errors | 10 | 10 | None across 59 shots and the save tests. |

## Remaining issues (numbered)

1. H. Creatures still fill three set piece views, and the fixer's note is right. crit_v_Wardens_board shows a scorpion/worm body across the whole screen: the scorpion stands at (31,22), the snake at (29,21), both 3 squares from the board (31,25) and exactly on the approach square. crit_v_Sunken_Bell: turtle at (17,20), 3 squares south of the bell (17,17). crit_v_Divers_camp: spider (19,36), piranha (20,35), leech (18,35) around the approach (21,36). The audit threshold is 3 squares, which is exactly the approach distance. Fix: keep every creature at least 5 squares from each set piece AND from the standard approach squares (31,22), (17,20), (21,36), (9,38) etc.; move those five creatures (hgfscorpion 31,22 / 29,19, hgfsnake 29,21, hgfturtle 17,20, hgfbeetle 15,21, hgfleech 18,35, hgfpiranha 20,35, hgfspider 19,36), then re-shoot the three views.
2. H. Shell Chests quest completes too early. Chests moved by round 3 are counted twice (hgd_quests2.js line 34 writes "x,y", hgd_polish_e3.js line 153 writes the original position). Opening chests 1 to 5 in order gives counts 1, 3, 4, 5, 7: the quest (need 6) is satisfied after 5 chests, and after only 3 chests if all three are moved ones (7 moved chests exist). Fix: write only one key per chest (the position key, or hgdwOrig only), and make the old-save check read both without adding a second key.
3. H. In-world writing is mostly not what the labels say. Close-ups (sg_*): the plaque at (21,11) still has d.k = art_hs_plaque (not swapped to an hgt_ picture, HGTX.fonts is false) and shows the baked word "Note" although its label is "Chiselled in neat capitals:..."; the pages at (11,21) and slate at (8,36) and tablet at (9,39) also read "Note". Only the post at (13,37) ("A dead end") and warning (3,15) show a real title. Fix: make sure every hgtList entry is swapped on level load (await document.fonts.ready, then call hgtLabel for all decor) and never leave the blank base art with the baked word.
4. M. Titles are poor: 12 of 30 labels are cut sentences ending in "..." ("Chiselled in neat capitals:...", "A ticket stub stuck to the hull:...", "A diver's slate: Hest went..."). hgtTitle takes the lead-in. Fix: write explicit short titles (2 to 4 words: "Stairs 46 west", "Hest's slate", "Ferry ticket") in the note data or d.label, and use them before the sentence cutter.
5. M. Legibility at distance: at 3 squares (sg_sign_page_11_21_d3, crit_v_Pearl_grotto, crit_v_The_scales, crit_v_Smugglers_cache, crit_v_Mirror) writing is a tiny dark squiggle on a thin sign. Text is clear only at 1 square. Fix: raise sign height to 0.6 to 0.7 for all pieces in this zone (the plaque and scroll got it, posts and pages did not), use cream ink on dark sign pictures, and draw a larger text block (at least 18 percent of picture height).
6. M. Lake docks identical: l0d, l1d, l2d at (39,137), (147,97), (97,65). Give each dock its own boat pose (not cropped at the bottom edge: lift the boat 0.3 or shrink it to .5) and put a visible beacon or lit landmark in the arch opening, 2 to 3 squares out; the lake tint at the edge is not enough.
7. M. Hub2 (17,18) facing west: net drying rack about 2.5 high filling the screen and a 1.5 square catfish. Cap nets at 1.3 high, and hide fish within 2.5 squares of the camera for sizes above 0.25.
8. M. (27,9) east and (25,41) north: put a lit landmark within 6 squares of the corridor start on the sight line, not beside it.
9. L. Repetition of one frog with lantern, one candelabra, one crystal cluster: use at least three variants of each across the 13 set pieces.
10. L. Hub1 (34,28) mean luminance 61.3, below the claimed 64: raise ambient 0.58 to 0.62 for hubs.

## Verdict

FIX FIRST. Signage and text (5) and proportions (6), repetition (6) and landmarks (6) are below 7; three of thirteen set pieces are still unseeable because of creatures; the Shell Chests quest now counts moved chests twice.
