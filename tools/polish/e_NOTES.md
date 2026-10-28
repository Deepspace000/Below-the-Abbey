# Polish notes, zone E: the Drowned Maze (level 477), lakes, waterways

## Files
- src/desert/hgd_polish_e.js (new, last in tools/inject.py ORDER). Patches the BUILT level 477 after hgd_water.js and hgd_water2.js.
- tools/polish/e_dump.py, e_audit.py (audit, `before` switch uses window.HGDWE_OFF), e_shot.py (screenshots, `@x,y` looks at a square), e_js.py.
- tools/polish/e_audit_before.md, e_audit.md (counts and the PROPORTIONS table), tools/polish/shots/e_*.png.

## Found (before)
- 1796 decor on 985 squares, 215 squares with 3 or more things, 859 over-dense identical clusters (moss, boulders, weed).
- Boulders up to 1.26 high (taller than a hero), moss cushions filling the screen, vents wider than their square, ceiling vines 3.3 high under a 2.6 ceiling,
  the Hollow's pearly reed (hgt_reeds) glowing like a feather fan in green water.
- 7 shell chests in the middle of one-square corridors (blocked half the way), 27 of 29 dead ends empty, no notes, no signs, no landmarks, no coloured light.
## Changed (after)
- Plants thinned and re-scaled (reeds 0.6 to 0.9, grass 0.6 to 0.8, boulders 0.4 to 0.6, moss 0.25 to 0.4 of a person). Squares with 3+ things: 3 (all deliberate set pieces). Clusters: 0.
- Seven corridor chests carried to the nearest empty dead end (quest counters key on the chest square, so an old save may offer an opened chest again once).
- 13 set pieces: Garden of Saints, Drowned Library, Sunken Bell, Wreck of the Ferry (the four chambers), the diver's camp (a new tier 2 chest), smugglers' cache, pearl grotto,
  rune stone, saint's shrine, the scales, lantern nook, mirror, the Warden's board. Each has props, a coloured pool of light and a written story.
- 8 true signposts at junctions (nearest steps up and the Warden's chamber, by compass), 18 unique short notes in the other dead ends. 27 notes in all, no empty or repeated text, no dashes.
- 18 more fish lanes. Every solid prop is placed only if a flood fill from the first stairs still reaches every free square.
## Proportions (person = 1.0), see e_audit.md for the full table
Bookshelf 0.98 to 1.0, bell 0.9, statues 1.25 (same as the rest of the maze), boat 0.78 (1.15 wide: four heroes fit), shrine 0.9, mirror 0.95, scales 0.75, rune stone 0.75,
chest 0.55, barrel 0.58, crate 0.5, skeleton 0.5, shells 0.4, coral 0.5. All drawn at the picture's own width to height ratio (the engine derives width from height).
## Not done / still weak
- No new paintings were made this pass (no Gemini/Canva session was run): every vignette reuses existing front-on art. A painted drowned lamp post, a heron colony, a sunken bell with a rope,
  lily pad rafts and a jetty are the pieces worth painting next (prefix e_ in assets/hp/).
- The three surface lakes (hgd_lakes.js) and the marsh were audited for proportions and misplaced boats and docks (none on land, no outliers) but got no new set pieces.
- Corridors in 477 stay long and dark by design (thick haze); the 7 old chests were moved but not given hint notes.
- The barrel in the Wreck room sits in a room corner (counted as a corridor square by the audit; harmless).
- 3 steps lead down from 475, not 4 (a missing pond-side entrance in hgd_water.js): not changed.
