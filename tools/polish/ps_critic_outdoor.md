# Pale Spire outdoor critic (9720 to 9723, 9730 to 9732), ranked

Walked every level from 8 to 12 spread viewpoints per round (tools/polish/ps_walk_outdoor.py, sheets with sheet.py), three rounds.

## Findings and what was done (ranked)
1. Castle view never visible. Walls of 4.4 to 5 cells and tall fences hide the 20 degree sky strip, so the painted castle_view never shows. PARTLY FIXED: the gate wall flanks were lowered (3.4 and 4.2), the painted gate_clock stands in front of the Great Gate (scale .6, arch hole in the neighbouring arch pieces is now see-through). Still weak: castle_view in the sky is only seen from open spots; the dark rectangular ravine face under the Long Bridge reads as a flat black slab.
2. Painted arches had an opaque dark plum plug in the opening (a violet haze in every lane, and it hid anything behind the arch, including the gate). FIXED in ps_glue.js pspDePlum: plum made neutral blue black, the openings of arch_high and arch_ivy made see-through, iron pieces de-purpled.
3. Walls and floors were flat code-drawn blotches (brick with random colour squares, ivy ellipses). FIXED: painted tex_* now feed pspWallGid (ash, dark, ivy, moss, brick, win, arch, pier, panel), pspFloor (flag, flagdark, gravel, cobble, wet, marble) and the court tiles (pscBricks, pscAshlar, psf_cobble, psf_flag, psf_wet). Helper pspTex in ps_kit.js aliases the textures for gyTile.
4. Sky was procedural noise. FIXED: tex_sky_night is now the sky base (mirrored, no seam), with the moon and bats over it.
5. Too dark and foggy. FIXED a little: outdoor ambient .62 to .8 (Approach .82), court mist haze .34 to .28, no extra darkening.
6. Court lanes: bare brick walls, no houses. FIXED a little: lit painted schnoor fronts and doors hung along the lane walls (about one cell in seven, one wall side only). They are flat pictures in front of the wall, not true gables; true gable silhouettes need wall tiles.
7. The clock-tower gate was a flat brown door with two orange slabs. FIXED: painted gate_clock in front of the great gate; code door kept behind it.
8. Big bell stood on the ground in the clock passage (filled the screen). FIXED: scale .8, lifted.
9. Stand-in people: porter, gardener, Lady Ysmay, falconer used Oldhaven folk (kh_ohfolk*) scaled up; Ossian used kh_ohfolk6_0 as a fall-back. FIXED: they now use c_psservant, c_pshedger, c_pscourtier, c_psfalconer; Ossian uses the ghoul.
10. Violet or purple iron fences, wm_chain posts and hl_p_chains stand-ins. FIXED (de-purpled, toned grey).
11. Mews was one 20 by 15 open cobble floor. FIXED: iron stall fences, twisted columns, arches, urns (reach and walk pass).
12. Lodge yellow brick and bright green runner. FIXED: painted timber plaster panels, wine coloured runner.
13. Haunted dressing (owner request): cobwebs on arches and corners, sheeted windows, haunted mirrors, ancestor portraits, glowing candles, red lanterns with red light, cobwebbed beds, in the gatehouse (guardrooms, chapel, closet), loft, porter's lodge, gardener's lodge, mews, the gate forecourt and the court's main lane. All names are registered in PSP_PICS in ps_gate.js with stand-ins; painted art replaces them by name.

## Still weak
* castle_view in the sky is rarely in sight; the ravine faces are flat black; distant fog flattens dark sprites (gate_clock is faint at range).
* The Knot hedge-maze fences in the court are very big; the court ivy is blotchy ellipses; houses are code-drawn timber fronts.
* Gate Captain and Pale Guard figures are broad and brutish, not gaunt; ghosts (halberdiers, guards) are translucent stand-ins.
* Gardener's lodge is one 16 by 13 room with a plain wood floor.
* Porter (c_psservant) is a thin ghost but wears a wig; art agent should paint a gaunt porter and gardener (no hedger scissors figure).
