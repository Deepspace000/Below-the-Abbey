# CRITIC review: Deeper Hollow, zone A (first twelve precincts, level 475, y 90 to 200)

Method: own server on port 8380 (stopped by PID afterwards), audit rerun (a_audit.py critic, output a_audit_critic.json), 48 full-size screenshots read one by one (20 "crit_*" at precinct centres and audit hot spots, 12 "vig_*" at the twelve vignettes, 16 "npc_*" at towns, shops, signs, gates; all in %TEMP%\a_shots). Rendering is software GL (swiftshader), so frame rate cannot be judged.

Audit rerun matches the agent's table: 0 cut-off squares, 1 stacked cell (intended lantern pair at 169,119), 179 objects in identical clusters, 16 dead ends with nothing near, 77 dull cells, 0 em dashes, 0 unreachable items or chests, 0 page errors.

## Grades

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 6 | Chests (0.62) now read right against frogs (npc_13, 40,91). Trees 3.0 to 3.2 and houses 3.4 high are 2.5 to 3.5 times a person (1.3) and a wall (about 1.0), which is deliberate Hollow scale. Defects 3, 4, 5, 7 below. |
| Signage and text | 6 | Town signs read well (npc_09 "CAIRNHOLD", npc_02 "ARMOUR"). All 38 vignette and dead end notes are well written, no typos, no em dashes. But the Tally Wall board is blank (vig_03) and 3 notes are duplicated. |
| Prop placement | 7 | Nothing blocks a corridor, nothing floats, every prop stands on the floor line. Hard-edged light pools and two corridor chests at 1 square wide are the only blemishes. |
| Repetition | 4 | 12 vignettes all use the same paper note with a red handprint (65 notes in the zone), the same potion bottle, the same crate and sack sprites. 179 objects still in identical clusters (reeds 47, plant6 30). |
| Landmarks and navigation | 6 | Lantern posts and signposts help in the hedge and honeycomb. The Stone Warrens (biome 1) are close to black, so landmarks there cannot be seen. |
| Lighting and atmosphere | 4 | Hedge, honeycomb and shell halls read well. Stone Warrens fail (defect 1). Light pools under props are flat coloured rectangles (defect 6). |
| Bespoke detail and storytelling | 5 | The writing is the best thing in the zone. The pictures do not carry it: no bedroll, fire, tally marks or barricade, only aliased crates, vases and a skeleton. Tone clash between warm notes and a bloody handprint paper. |
| Art quality and consistency | 6 | Shops, frogs, trees, creatures are strong. One white unfinished-looking house (defect 2), one banner of a different style (skull and crown in a bee hall). |
| Performance and loading | 5 | Could not measure fps (software GL gives 6 fps). Load 22 s in software GL. 66 asset 404s on every load (defect 8). |
| Console errors | 8 | Zero page errors, zero script errors; only the 404 resource lines. |

## Defects (numbered, with severity and fix)

1. **Stone Warrens are nearly black (HIGH).** Repro: `index.html?town=deephollow`, then goToLevel 475 and stand at 101,158 facing north (crit_03), 176,179 (crit_04), 71,155 facing south (npc_03), 79,153 (npc_04), 181,189 (npc_10), 120,160 (npc_06 church sign is barely legible). Walls, props, vignettes and gate signs vanish. The audit reports `lightsZone 0`. Fix: give biome 1 a minimum ambient (raise L.amb for ids 1 or add a torch every 6 to 8 squares), and make the vignette lanterns real light sources. Re-shoot the four spots above.
2. **hg_house2 is a plain white slab (HIGH).** Repro: 49,184 (Thorn Reach), stand at 49,182 facing south (npc_11). A bright white rectangle 96x300 with only a round door, no roof, no windows, no texture, glowing against the dark. It looks like a missing painting. Fix: paint or tint it like hg_house0 and hg_house1, or replace with those. Check every hg_house2 in the zone (decor `k==='hg_house2'`).
3. **Boss creatures are smaller than their minions (MEDIUM).** Rendered height = w x image aspect. Boss `hgdb_spider` w1.755 gives about 1.2 high, `hgdb_beetle` w1.62 gives about 1.0, while the ordinary wasp guard `hgdguard` is 1.32 and `hgdworm` is about 1.4 (a worm taller than a person). The agent shrank jelly, bug, cricket and toad but left the hierarchy inverted. Fix: scale bosses to at least 1.8 high, cap hgdworm at 1.0, hgdjelly at 1.0.
4. **Mini boss orbs are 3.2 high, 2.5 times a person (MEDIUM).** `hgmini2` w2.5, `hgmini4` w2.5, `hgmini3` w2.2 (hgfire art 328x420). The agent left these "as designed". They tower over the 1.0 walls and appear cut off by the top of the view at distance 2. Fix: 1.8 to 2.2 high.
5. **Spawning inside the Wasp Alley nest fills the screen (MEDIUM, scale).** Repro: 101,95 facing any direction (crit_09). A hgdguard wasp (1.32 high) one square away covers the whole 3D view, because 1.3 high sprites are taller than the 1.0 high wall. Same for the frog shopkeepers at one square (npc_00, npc_12, npc_13). Fix: lower NPC_H for hg_npc0, hg_npc4, hg_npc6, hg_npc5 to 0.95 to 1.05 so a person fits under the wall line, or raise the ceiling (`ceilH`) in towns.
6. **Vignette light pools are hard-edged flat green or teal rectangles (MEDIUM).** Repro: vig_02 (43,191 stand 3 back), vig_03 (107,155), vig_04. The pool under props looks like a painted sticky rectangle on the stone floor. Fix: use a radial falloff, or drop the tint.
7. **Tally Wall has a blank signboard (MEDIUM, text).** Repro: 107,155, 3 back (vig_03). Prop `hpa_board` is `wm_signpost` with no writing, while the note says "Two hundred and eleven scratches". A sign with no writing breaks the "every sign has real writing" rule. Fix: paint tally marks on the board (Gemini route) or swap for a wall texture with scratches.
8. **66 asset 404s on every load (MEDIUM, loading).** icn_* inventory icons (including this zone's own icn_hgdgem_*, icn_hgdkey_*, icn_hgdlantern, icn_hgdshard) and sp_c30b, sp_m30b, sp_z30b. Repro: open the page with the network tab, or run `tools/polish/*.py` and count responses with status 404. Fix: add the missing PNGs or give the loader a fallback so the browser does not make 66 failed requests. Check that picking up a gem or key shows an icon.
9. **Same wall note on all 65 notes, red handprint (MEDIUM, repetition and tone).** `hl_p_note` (431x512) appears in every vignette (vig_00, 01, 02, 03, 04, 05, 08, 09, 10, 11) in the same place high on the wall. A bloody handprint sits on "Sorry about the mess" and "I WAS HERE AND IT WAS FINE". Fix: three or four note styles (pinned scrap, chalk, carved line, ribbon), and no handprint on the warm ones.
10. **Vignettes share props and rewards (MEDIUM).** Crate, barrel, sacks, lamp, vase and potion bottle in all twelve. Ribbon Corner has no ribbon, Cold Camp has no bedroll or fire (vig_05 shows a lantern and sacks), Unfinished Arch has no arch. Fix: paint the five items the agent listed as still wanted, plus a ribbon.
11. **Drone's Vigil banner is a different art style (LOW).** vig_07 (187,161): crimson skull and crown banner, painterly dark, in a gold bee hall. Fix: a wax-yellow banner with a bee mark. Also the skeleton prop at vig_06 (97,121) reads as a four-legged animal, not a drone.
12. **179 objects still sit in identical clusters (LOW).** Reeds 47, art_hgdf_plant6 30, hgt_vine_roundleaf 24, art_hgdf_plant0 19. Reeds also range 0.42 to 1.08 high (2.6 times). Fix: tighten the reed range to 0.6 to 0.9 and rotate sprites between three variants.
13. **Duplicate notes (LOW).** Three pairs: "The hedge maze is the easy part", "There is a shortcut here", "The slug is not slow". Fix: rewrite one of each pair.
14. **16 dead ends empty and 77 dull cells remain (LOW).** Dead ends at 63,95; 55,133; 97,137; 43,145; 63,145; 77,151; 85,151; 193,159; 63,165; 119,165; 189,167; 117,169; 107,181; 185,191; 179,193; 101,200. In crit_19 (63,95) the only content is a pink rag hanging from the hedge and nothing at the end. Fix: finish the list.
15. **Hanging shop signs read huge at one square (LOW).** npc_15 (88,108 facing west): the pouch sign is 1.3 times the frog beside it. Cosmetic.
16. **Quest checks were never run (MEDIUM, process).** The agent said so. Ten quest givers became visible this pass, so run the quest tests before shipping.

## Verdict

FIX FIRST: Stone Warrens darkness, the white house, inverted boss sizes, the blank Tally Wall board, and the repeated note and props.
