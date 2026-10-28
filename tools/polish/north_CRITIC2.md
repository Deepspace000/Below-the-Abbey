# CRITIC round 2: Deeper Hollow, zone A (precincts 1 to 12, level 475, y 90 to 200)

Method: own server on port 8370 (stopped by PID, no listener left), audit rerun (north_audit.py critic2, output north_audit_critic2.json), 30 full-size screenshots (900x560) read one by one (%TEMP%\n_shots\c_00 to c_29: 12 precinct centres, the original repro spots, 6 vignettes, 4 dead ends, signs and shops). Software GL (swiftshader), so frame rate cannot be judged. Cold load 24 s, 0 page errors, 0 asset 404s this run (66 before). No em dashes found.

Audit rerun matches the fixer: 0 cut off, 0 stacked, clusters 28, dead ends 3 (27,141; 193,159; 63,165), dull 1 (188,119), notes 96 with 0 duplicates, 0 blank, 0 house2, vigShared 0, lightsMine 698, boss heights 1.90, mini bosses 1.7 to 1.8.

## First review, defect by defect

1. Stone Warrens black: PARTLY FIXED. Corridors now read (c_12 71,155 mean 35, c_13 79,153 mean 52, c_15 mean 72, purple crystals visible). But precinct centres are still near black: c_03 Cairn 101,158 mean 29 (empty dark room, nothing visible), c_04 Mason's Ward 176,179 mean 30, c_25 63,165 mean 37, c_00/c_02 about 36 to 43. The landmarks of the hub rooms cannot be seen.
2. hg_house2 white slab: FIXED (c_16, 49,182: now a painted tower with windows and frill). It is still a bright pink white block, the brightest object in a dark room, 1.5 times as tall as the view.
3. Bosses smaller than minions: FIXED (1.90 vs guard 0.99).
4. Mini boss orbs: FIXED (1.7 to 1.8).
5. Wasp Alley spawn fills screen: NOT FIXED. c_09 (101,95) and c_27 (105,93): one guard at one square still covers the entire 3D view (sprite is 0.99 high but the view only shows about 0.8 of a square at that range). Spawn is also inside a monster nest.
6. Hard-edged pools: MOSTLY FIXED (no coloured rectangles under props). c_04 (176,179) still shows a hard-edged blue triangle on the floor, a lone water floor patch.
7. Tally Wall blank board: FIXED as stated (c_19 107,155 has a carved note, candle table). But the note picture is a blank grey slab, see 9.
8. 66 asset 404s: FIXED this run (0).
9. Same wall note on all notes: NOT FIXED in what the player sees. Every vignette note (c_19, c_20, c_21, c_22) shows a blank pale parchment or slab with NO visible writing, so the 96 well written notes cannot be read. The fixer says the note sprite is the signage agent's. From the player's side it is unfinished.
10. Vignettes share props: FIXED. Each reads differently: candle table (c_19), writing desk (c_20), wax knight with chest and lantern (c_22), pearl plinth (c_21 area). Good.
11. Drone banner: FIXED (replaced by wax knight, c_22).
12. Clusters: FIXED (28 left).
13. Duplicate notes: FIXED.
14. Dead ends: MOSTLY FIXED. 63,165 and 193,159 now have a plinth with an orb, 27,141 a boulder, hanging sign and plant. Three remain by metric; 27,141 is the weakest.
15. Hanging shop signs large: not re-checked in detail (c_18 88,108 looks fine).
16. Quest checks: not shown in the fixer report as evidence beyond "no regressions". Not independently run.

## Grades

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 6 | Bosses, chests, lamps, doors now read right (c_05, c_22). But propOutliers still list belltree and fairytree 1.6 to 3.5, and the audit shows villagers up to 1.676 (hgd_polish_c rescales after this file). White tower (c_16) overpowers its room. Guard fills screen at one square (c_09). |
| Signage and text | 4 | Town signs fine (c_17 "DUNEWELL NOTICES"). Every vignette note renders as a blank parchment, so none of the 96 notes can be read. Four lamps and a statue have no height set. |
| Prop placement | 8 | Nothing blocks a corridor, nothing floats or cuts off. |
| Repetition | 7 | Clusters 179 to 28; vignettes distinct. Honeycomb walls (c_21, c_22) are large flat tan planes with no texture. |
| Landmarks and navigation | 6 | Lanterns and crystals help in corridors (c_01, c_13, c_15). Warrens hubs are still dark and empty. 9 cells remain more than 6 steps from a light (max 9). |
| Lighting and atmosphere | 6 | Real improvement in hedge and shell halls (c_00, c_01, c_10). Warrens hubs mean 29 to 36 are too dark; honeycomb is washed out and flat (mean 86 to 108 against walls). |
| Bespoke detail and storytelling | 7 | Vignette props now tell their stories (cold camp, tally candle, drone knight). The words are hidden by the blank note art. |
| Art quality and consistency | 6 | Creatures, chests, crystals strong. Blank notes and plain tan honeycomb walls look unfinished. |
| Performance and loading | 6 | Unmeasurable fps; 24 s cold load under software GL; 698 lights plus 229 enemies is a risk, not measured. 404s gone. |
| Console errors | 9 | 0 page errors, 0 404s. |

## Remaining defects (numbered)

1. Vignette and dead end notes render blank (c_19 107,155; c_20 43,191; c_21 97,121; c_22 187,161; 63,165). Fix: draw d.text onto the note sprite (canvas text over the parchment in hgd_polish_signs) or give the note texture visible writing. Re-shoot those four.
2. Warrens hubs too dark: 101,158 (mean 29), 176,179 (30), 63,165 (37), 23,182 (35). Fix: one more light of strength at each precinct centre (a brazier or crystal cluster within 2 squares), raise ambient by about 25 percent in biome 1 rooms. Target mean above 50.
3. Wasp Alley spawn 101,95 and 105,93: the party starts inside a guard's face. Fix: move the guard 3 squares from the entry or put the entry in the empty square before it.
4. Pearl tower / hg_house0 at 49,182 is a bright pink white block against a dark room. Fix: tint or dim by 30 percent; lower its scale 2.2 to 1.8.
5. Hard-edged blue floor triangle at 176,179 (water patch tile). Fix: blend the tile to biome floor or add a puddle sprite.
6. Honeycomb walls (97,121 and 187,161): flat tan planes with no texture. Fix: give biome 2 a comb texture variation like the shell hall.
7. hgd_polish_c still rescales trees to 3.5 and frogs to 1.68 in this zone; four lamps and a shell statue have no height. Fix: clamp in hgd_polish_c to the table above and set heights on art_hgt_lamppost, art_hgtb_lamp_tall (x2), art_hgtb_deco_shellstatue, art_hgt_gardenlantern.
8. Dead end 27,141 is a bare boulder plus sign; 188,119 dull cell. Fix: a kit like the plinth dead ends.
9. Nine cells more than 6 steps from a light: 105,93; 133,127; 107,139; 27,141; 63,165; 33,167; 163,188; 115,189; 59,193.
10. Frame rate and quest regression tests not shown by evidence. Run on real GPU and run the quest checks (north_quest.py) before shipping.

## Verdict

FIX FIRST. Grades below 7: proportions 6, signage 4, landmarks 6, lighting 6, art quality 6, performance 6. The blank notes are the main blocker.
