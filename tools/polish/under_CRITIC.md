# Underlevel (level 476) CRITIC review

Method: own server on port 8383 (stopped by PID afterwards), headless Chromium 960x720, 15 set-piece shots (d_vshots) plus 28 extra shots (corridors, junction signs, docks, ladders, Black Swill landing, creatures). Shots are in `C:/Users/mirko/AppData/Local/Temp/dshots/` (v0-v14 set pieces, c0-c15 and e0-e11 positions, g0-g4 ladders, lad0/lad1 before and after walls). Audit re-run: all numbers reproduce, console clean apart from pre-existing 404s for assets/icn_*.png (not this zone).

Link: `index.html?town=deephollow&lvl=34`, then in the console `goToLevel(476,{x,y,f})` (f 0 N, 1 E, 2 S, 3 W) then `hgoFace(f)`.

## Grades

| Area | Grade | Evidence |
|---|---|---|
| Proportions and scale | 6 | Creature fix real (kraken, serpent, leviathan now full size, c11, c12, e4). Walls fixed (lad0 beige slab vs now rock). But 5 defects below: ship wheel (v14), child statue taller than the adult monk, three different boat sizes, chest vs seated skeleton, candle as tall as a book is wide. |
| Signage and text | 8 | 30 readables, no em dashes, no typos found. All 8 rune stones that I BFS-checked give the exact step count and compass word (140,73 15 west; 74,150 7 east; 138,53 37 east; 52,77 31 north; etc). One rune has no text (issue 2). Direction word is the first leg only, not stated as such. |
| Prop placement | 7 | Audit: 0 blocking, 0 on water, 0 unreachable. Dig vignette has a hard rectangular ground patch (issue 3). Skeleton sits on a cairn at 154,81 / v9 reads as floating on a rock heap. |
| Repetition | 6 | Audit says 0 clusters, but screen-level repetition is heavy: 16 near-identical rune/board signs, 12 identical skeleton+lantern+bucket dead ends, one rock wall tile everywhere, same open-book sprite at the same screen spot in every vignette (v1, v7, v8). |
| Landmarks and navigation | 6 | Signs are genuinely useful and correct. Lit lamp islet and chapel exist but are not visible from across the sea (e4 and e6 show only a faint speck; the author admits it). Ladder walls are the only bright thing in the level (g0, g1, g3) and are readable, good. |
| Lighting and atmosphere | 7 | Pools of light and red eye glow work (c5, c6, c14), blue grotto and teal lanterns give colour (v2, c6). Corridors beyond 3 squares fall to black (c0, e2) which is dread but loses the "eerie coloured glow" in plain straights. Glow Orb has no hook in this zone (grep glowOrb in hgd_dark.js and hgd_polish_d.js: 0). |
| Bespoke detail and story | 8 | Thirteen journal pages in order of loss, child and woman statues facing the water (v13), wreck, chapel, tally wall. Best part of the pass. Pages 6, 9, 11, 12 lack "Day N" so the diary timeline is uneven. |
| Art quality and consistency | 5 | No new art. The wm props are violet-tinted (boat, crate, barrel, post, wheel pedestal, chest) in a grey level (v0, v3, v10, v14). Reads as a different palette. Wall rock is good but one tile. |
| Performance and loading | 6 | Level build 4.0 s vs 2.8 s without the polish (about 1.2 s extra, swiftshader, 484 decor, 112 lights). 6 fps under software GL, so not conclusive, but lazy build is a visible hitch. |
| Console errors | 9 | No page errors. 404s are `assets/icn_*.png` (pre-existing, other zones). |

## Defects (numbered)

1. **Ship's wheel oversized** (medium). `hgpd_wheel` h 0.90 on a 1.0 pedestal at (135,138), view from (135,139) f0 = v14. The wheel is taller than the monk (0.84) and 3x the barrel beside it. Fix: sc 0.6, keep it on the rock.
2. **Rune stone with no text** (medium, breaks the "no empty signs" claim). `hgd_polish_d.js` line 210 dead-end scene adds `hgpd_rune` with no `read`. Repro: decor at (142,172), stand at (142,171) f2. 16 runes and boards exist, 15 have text. Fix: give it a lore line or swap it for a candle pair.
3. **Hard rectangular ground patch on the Dig set piece** (medium). Repro: `goToLevel(476,{x,y,f})` from d_vshots index 11 (The Dig, vig 93,179), shot v11: a tan rectangle with straight edges at the base of the bones and rubble. Cause not confirmed, one of the bone, rubble or straw sprites has an opaque base. Fix: crop or alpha-mask that sprite, or replace it with a sprite that already has a soft edge.
4. **Statue scale** (low-medium). `art_hgxstat3` child with lantern is 1.25 high, the adult monk statue is 0.84 and the living monk 0.84 (v6, v13). A child statue taller than a monk reads wrong. Fix: sc about 0.75 for stat3, keep the 1.25 woman.
5. **Three boat sizes** (low-medium). `hgpd_boat` 0.93 high by 1.38 wide, `art_wm_boat` 0.81 by 1.20, `yar_boat_row` 0.85 by 1.81 (c4, c5, v5). The wreck boat is the biggest and is meant to be a broken second boat. Fix: sc 1.3 to match the party boat, and the row boat width to 1.5.
6. **Chest vs seated skeleton** (low). Chest 0.48 high, skeleton 0.50, but the chest width 0.58 vs 0.62 and in v3 the chest looks twice the skeleton because the skeleton is seated and faint. Fix: sc 0.8 for the lone chests at the skeleton dead ends.
7. **Candles too big** (low). `hgpd_candle` 0.24 high is the same as the open book is wide, and half a barrel (v1, v6, e9). Fix: sc 0.55.
8. **Palette clash** (high for the "AAA" bar, but needs art). wm props are violet (v0, v3, v10, c7, v14). Fix with a grey-blue tint on all `art_wm_*` and `hgpd_*` that reuse them (per-image tint in the decor draw), or paint a grey set.
9. **Lighthouse and chapel not visible from afar** (medium). Repro: stand at (126,111) f0 (e4), the lamp at (126,106) is a smudge. Fix: add a very large soft glow sprite (light bloom, additive) to `hgpd_lamp` that is drawn at any distance within 20 squares, ignoring the near-light cull.
10. **Ladder foot kit not visible** (low). g0, g1, g3: standing at the ladder foot you see only the brick and ladder, no props. Author says every ladder has a kit. Fix: check the props sit at the foot cell and not behind the player.
11. **Sign wording** (low). "about 15 steps ... to the west" is the direction of the first leg, and the painted stone shows no arrow although the text says one was scratched. Fix: say "start to the west" and add an arrow to the sprite or drop the word.
12. **Repeated open-book sprite and same skeleton dead end** (low). Vary: three book poses, different skeleton rotations or props.
13. **Journal pages without a day** (low). Pages 6, 9, 11, 12, 13 have none, so the timeline jumps from Day 12 (page 5) to Day 41 (page 10). Fix: add days.
14. **Build time** (low-medium). 1.2 s extra at first entry to 476 (4.0 s total with software GL). Fix: build the polish pass in chunks, or cache the BFS.
15. **Glow Orb** (medium, depends on other agents). No handling in this zone. Fix once `orbs.js` lands: raise light radius for glowOrb in `hgd_dark.js` and make the blue grotto react.
16. **Skeleton on cairn** (low). v9 (The Bone Gutter shot at 154,81 area): skeleton rests on a cairn with no feet contact line, looks like floating on rocks. Fix: lower by .05 or put it beside the cairn.

## Verdict

FIX FIRST. The pass is strong on story, signs and walls and has no errors, but the proportion defects (1, 4, 5), the empty rune (2), the rectangle artifact (3) and the palette clash (8) would be noticed by a reviewer in minutes.
