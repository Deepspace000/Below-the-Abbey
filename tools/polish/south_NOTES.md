# South zone (precincts 13 to 24, atrium, gate): polish round 2

File: `src/desert/hgd_polish_b.js` (round 1 notes: `b_NOTES.md`). Tools: `s_audit.js` (run with `s_probe.py`), `s_snap.py` (screenshots), `s_dump.js`, `s_plan*.js`. Test port 8341.

## How scale is read (engine)
A picture's height in squares is `NPC_H[k] * decor.sc`; width follows the picture's own aspect. A villager is 0.9. The walls of this maze are `ceilH` 2.7 high, so a hall is three villagers tall (the brief's "wall about 1.0" does not apply here). Everything is sized against the villager.

## Scale table (applied by script to all zone decor, `hgpbPolish2`)
villager 0.9 to 0.98, pickpocket 0.8, door/plaque gate 1.5 (the gate to the Maze of Gardens is the tallest thing near it), statues 1.4 (shell) and at most 1.35 (art_hgxstat), plinths 0.65, lamps 1.3 (1.5 beside the plaque), shop signs 0.6, notice boards 0.75, bookcases 1.2, houses 1.9, chests at most 0.5, table 0.5, chair 0.55, bench 0.5, trees by size class 1.5 / 1.9 / 2.3 / 2.6, spiral fern 0.75 to 0.95, bulb flower 1.0 to 1.2, shell flower 1.1 to 1.3, petal clouds at most 0.9 high and 1.2 wide.

## Fixed (critic list)
1 statues, plinths, lamps rescaled. 2 shop signs 0.6. 3 bookcases 1.2 (the wizard's own awning is part of his painting and was left). 4 houses 1.9. 5 signposts are now the painted signpost with the precinct and two directions lettered on the board (made at run time), notes keep the paper. 6 Blue Quarter and Mosaic Halls lit (see below). 7 lamp at quest giver 75,25 removed, horsefly moved away from the hermit (all creatures within 4.6 squares of a named person are moved at least 6 away; tall props beside any person are removed). 8 long climbs: 21 waysides (bench and cage lantern, pack, statue and candelabrum, brazier, cart, bell, crate and cask) with a pace stone each. 9 every dead end gets a prop on the corridor axis, a lantern, a light and its own line of text. 10 vignettes rebuilt with distinct props (windlass and bucket, brazier, ladder, scale, tools, ore cart, shrine, antlers and shields on the wall instead of the odd banner). 11 ferns, flowers, gate rescaled. 12 notes that mention hedges, honeycomb or trees are replaced by lines for the biome where they stand; 24 new lines, no line repeats in the zone. 14 petal clouds capped. 13 (404 icons) left to the other agent.

## Bug found and fixed
The game copies only a fixed list of fields from level decor to `G.decor`. `pbt` (the text of notes and signposts), `note`, `zone`, `lift` and a picture height of 0 were dropped, so in real play every note and signpost said the worn-away line and warning signs had no place name. Round 1 tested by passing level decor to `startTalk`. `hgpbCopyDecor` now copies them back when the level is set up.

## Lighting
`hgpbLights` runs at level set-up (some wall pieces open after the build, so it must see the final maze). Greedy path-distance coverage: no open cell is farther than 8 (sandstone), 6 (blue, mosaic) or 7 (gilded) squares from a light. 641 lights in the zone, each with a colour (amber, cold blue, lilac, gold) and strength 1.5 to 2.3, through `L.col` / `kI` on the live light. Hung lantern pictures show many of the sources. Props that must be read (statues, signs, chests, people, notes) carry a small `lift` so they are never black.

## Audit (s_audit.js)
Before (round 1, estimated from its proportion table): lamps out of scheme 48, shell statues 14, plinths 13, signs 28, houses 2, bookcases 2, trees over 2.7 about 166, plants 82, people 8, chests 17, lights in zone 86, notes/signposts with live text 0 of 103.
After: all of those 0, cells far from a light 0 (was about 940), duplicate texts 0, hedge or honeycomb texts 0, creatures near people 0, tall props near people 0, identical clusters 0, rows of three 0, long runs with a gap over 16 squares 0, empty dead ends 1 of 123, patch time about 340 ms plus lighting at load.

## Still weak
No new painted art was made: waysides and vignettes borrow the Well Maze (purple) pictures, which clash a little with the pastel Mosaic Halls. Wall lanterns are one picture per biome pair. Walls are still the old textures. The hung lanterns are not animated. Creatures were not rescaled.

# Round 3 (this pass): every item of south_CRITIC2.md

Test server: `python tools/polish/s3_server.py` (port 8331, big backlog; the plain http.server dropped connections under load). Tools: `s3_snap.py` (screenshots plus mean luminance, entries starting `v_` stand 3 squares from a dead end), `s3_plan_full.json` (70 views), `s3_lum.py`, `s3_audit.js` (run with `s3_probe.py`, extends s_audit.js), `s3_q8.js` (talks to every person and note of the zone), `s3_map.py`.
New art, all raster, made from existing painted pictures: `tools/hpb_recolor.py` writes `assets/ds_hpb_<prop>_<biome>.png` (the Well Maze props recoloured out of purple into the four precinct tints, 4 sandstone, 5 blue, 6 rose terracotta, 7 gold, plus a signpost board per biome) and `tools/hpb_walls.py` writes `assets/ds_tex_hpb_blue0-4.png` and `ds_tex_hpb_mos0-3.png`. No new files in tools/inject.py ORDER (everything is in hgd_polish_b.js; artlist.js picks up the new ds_ pictures).

## What changed, by critic defect
1 Signposts: the board is stretched wider (post keeps its width), only two direction lines (the precinct is in the dialog and the label), bold cream with a dark edge, abbreviated names (ATRIUM, first word if over 13 letters), lettering now sits on the board (the old fractions put line one above it), post 1.5 high. Readable at 3 squares in all five views (p_* and pv_* shots).
2 Notes: every note, post and sign of the zone has a title in `d.label` (1 to 4 words, hand made for all 120 known lines, `Pace Stone N`, `Danger: <zone>`, `Signpost: <precinct>`), non-empty text, and the label is copied to the live decor (`hgpbCopyDecor`). The text agent draws the writing.
3 Scribe's Corner: chair 0.55, table 0.5 (they were drawn at their raw size because the keys had no height).
4 Shop signs `hgdpc_ss*` 0.6 and moved beside the stall, not in front of the keeper (forge: the smith is clear).
5 Notice boards 0.6, quest givers 0.95, posts 1.0.
6 Cosmetic rocks, trees, statues, plants within 2 squares of a quest giver are removed (the standing stone at 46,92 is gone).
7 Kits: all 12 vignettes rebuilt with absolute heights and their own props (no Well Maze prop in two vignettes, tiles for the Tile Counter, no bucket in Mortar Mistake); ordinary dead ends use a shuffled deck per biome of 14 to 17 kinds (no kind twice within 12 squares); 12 wayside kits. Audit: 48 kinds, same kind within 9 squares of itself 5 times (was most of the zone).
8 Mosaic: kI 1.9 to 0.95 and the wall pictures dimmed (x0.76) with 4 variants (mosaic, filigree, scales, dado). The lit slab beside a hung lantern is now pink instead of white. Mean luminance of the Mosaic shots fell from about 120 to 95.
9 Blue Quarter: five wall variants (blue bricks, small bricks, bricks with dado and cornice, a lantern niche, a gold framed lapis panel), made from the painted brick pictures. They are separate wall characters 0x3a0 to 0x3a8 set in `hgpbWalls` (all wall tests in this file use `HPB_WCH`).
10 Black triangle at 103,27: not geometry. The far end of the room is an unlit stretch of wall seen at a grazing angle; with the dimmer Mosaic it reads as ordinary distance dark.
11 Dead end 169,80: it is a vault corridor behind a gem door; every key or gem door of the zone now has a prop beside the cell in front of it (`doorProps`).
12 Purple art: all Well Maze pieces placed by this file are recoloured per biome; the crates, barrels, buckets, braziers, hung lanterns and the purple bookshelf that other builders left in the zone are swapped for the same recolours at the same height. Left alone on purpose: 11 pieces (crystals, a lamp post: glowing gems are fine in a vault).
13 "TEA NOTICE": a real Dry Ward notice board (polish_c, 178,92) with the header fully visible, not a clipped label.

## Numbers
Mean luminance of the 70 views (software GL, 3D area only): corridors and vignettes 76.5 (min 42 at a sand dead end and a blue wall seen at one square), hubs (towns, atrium, people) 70.5 (atrium 62 to 75). Before: corridors about 70, with sand dead ends at 34 to 43.
Audit: 0 out of scale classes, 0 cells far from a light, 0 empty texts, 0 notes without label, 124 of 124 people and 121 of 121 notes and signs talk, npc counts identical to before, 0 console errors.
