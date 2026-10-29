# Blight growths: twisted trees and growths (29 Oct 2026)

Files
- `src/desert/blight_growths.js` (prefix `bgr`), last in ORDER of `tools/inject.py` (after `blight_sky.js`).
- Pictures: `assets/ds_bl_twist_1..6.png` (six tree silhouettes: leaning bone-white, screaming face, lightning-split, corkscrew, hunched with moss beard, hand-branch) and `assets/ds_bl_grow_1..6.png` (swollen bulbs, root tangle, fungus stump, thorn vines, skull-pod tree, root hand). They load at start through `DS_PAINTED` (inject.py writes the list from the `ds_*.png` files), so the keys are `IMG.bl_twist_n` and `IMG.bl_grow_n`. A seventh key, `bl_grow_ring` (pale fungus), is a filtered copy of `wm_mush_cluster`, made in code at first use. Heights are set in `BGR_PIECES` (`NPC_H`).
- Art was made in Gemini through the owner's Chrome (own tab, two sheets of 3 x 2 on magenta, strict front elevation, both looked at before use, tab closed). `tools/polish/blg_cut.py <sheet.jpg> <prefix> <first>` cuts a 3 x 2 sheet into transparent PNGs; `tools/polish/blg_contact.py <out.png>` makes a contact sheet.
- Test: `tools/polish/bgr_test.py verify|perf|shots` (own server on 8606, `BTA_CHROME`). `verify` is independent of the scatter code.

How it works
- Runs once per level after everything else has built it (flag `L._bgr`): the last wrap of `KH_LAZY[id]` for the ten places and the Barrow Hill (9670), and a wrap of `saBuild` for Sale (600). It is seeded by the level id, so a level always gets the same trees. `window.__BGR_OFF=true` before the level builds skips it.
- Places: blight ground (grass, dirt, gravel, mud), hill grass and dirt, Sale bare earth. Never on a path (the kit's `C.path` is saved by a wrap of `blKit`; hill and Sale paths come from their ground and street tables), never within 2 squares of a door or gate, a person, a talking or wall picture, an item or an arrival square, never within 1 of a spawn, never where 2 or more fences, stones, carts and so on already stand within 2 squares. Lanternrest's fort and the Pale Bridge approach are kept clear (`BGR_CLEAR`).
- Density follows two layers of value noise, so there are thick woods and clearings; it is lower within 2 squares of a path. Same picture is never within 2 squares of itself. Solid pieces are only kept if every cell beside them that had a free 2x2 square still has one. After the scatter a flood fill from every entry must reach everything it reached before; any piece beside a lost cell or an unreachable door, person or item is removed, then the 2x2 rule is checked again. Up to 240 pieces per level (Sale 170). About 70 percent are solid, the thorn clumps, root hands and fungus rings are walk-through.
- About one in five solid trees or growths of the six main kinds is a talking prop (`bgr_x_<picture>`), with a plain examine text in `BGR_TEXT`. No item drops (the optional drop was not done).

Results (verify, all pass): 9610 231 pieces, 9620 235, 9630 217, 9640 185, 9650 227, 9660 231, 9670 135, 9680 213, 9690 200, 9700 228, Sale 170. Lost cells 0, narrowed corridors 0, pieces within 2 of a door, person or quest piece 0, same picture within 2 squares 0. Screenshots of all eleven were checked by eye.
Not counted as protected in the test: herbs and mana potions, which are added later by `collect.js` and `manadrops.js` on free cells only.

Known gaps
- No pictures for bramble arches, cankers or wall moss: only the 12 painted pieces plus the filtered fungus ring. Another Gemini sheet (bramble arch, wall moss, canker) would add them.
- Frame time was not measurable in headless swiftshader (frame() returned 0 ms); the added decor is about 140 to 240 per level on 700 to 1500 existing. Judge on the owner's laptop.
- The lightning in the split-tree picture (`bl_twist_3`) shows as a thin white bolt above it.
- A file loaded after `blight_growths.js` that calls `blRegister` again would replace the wrapped `KH_LAZY` and skip the pass for that place; keep this file last.
- The rooms of the places (interiors) are untouched; only outdoors.

## Round 2 (29 Oct 2026)
- `assets/ds_bl_twist_3.png`: the stray bolt is gone (alpha cleared in the gap between the two halves, original kept outside the repo; checked on a dark background).
- No walled-in trees: after the scatter, a blocking piece (ours or the level's) whose four neighbours are all blocked costs one of OUR neighbouring pieces (or itself, if ours and none beside it is ours). The fix, the flood fill and the 2x2 rule run three times in a row (`fixAll`). The Barrow Hill (52,52) pocket cannot come back. `bgr_test.py verify` now also reports `pocket`; all 11 levels pass (lost 0, narrow 0, pocket 0). `BGR_INIT` env var injects JS before load; `window.__BGR_NOPOCKET` / `__BGR_NOEXTRA` are debug switches.
- Pink bulbs (`bl_grow_1`): recoloured in code to a bruise and bone tone (hue-rotate, desaturated), weight halved, and never within 12 squares of a gate, door or arrival square.
- Variety (fix 9): every tree and the fungus stump and root knot get mirrored, dark (thick of a wood), pale (rim lit, edge of a wood and beside paths) variants made in code at first use; wider height range (young 0.6 to tall 1.6); undergrowth (grass tufts, twigs, thorns, fungus rings; `_bgru`, walk-through) round about 60 percent of trees, up to 120 per level.
- New Gemini art (one sheet, own tab, closed): `ds_bl_arch` (bramble arch, walk-through, 1 or 2 over the straight road in 9610, 9620, 9630, 9640, 9650, 9680, 9690), `ds_bl_canker` (new solid growth, talks), `ds_bl_moss` (wall moss strip hung on wall faces, up to 46 per level), `ds_bl_win_a` (casement), `ds_bl_win_b` (lancet), `ds_bl_win_c` (round). Windows get a warm halo made in code. Sheet cut with `blg_cut.py`.
- Lit windows: `blWindowGlow(L,{x,y,wd,k,cy})` is a global helper (wall face: (x,y) is the OPEN cell, `wd` points to the wall, `cy` = height of the window centre in squares, default 1.5; or without `wd` a standing picture with `ox`,`oy`,`sc`). The pass finds every window tile (`ohTiles` is wrapped to remember window gids) and lights 55 percent of window faces (80 percent in the church and abbey places, tall lancet there), plus churches and the chapter house through `BGR_BWIN` (window positions in the painted picture, keys `bl_church`, `bl_hall`, `wl_bldg1_0/1`). Seen in Sale, Ashenfold, Toll, church, abbey.
- Checks by eye: church, abbey church, chapter house, farm wall, Sale lane, dry woods in six places.
- Gaps: lit windows do not flicker or follow the time of day; wall pictures cover the painted window of that tile; moss hangs from its top edge (as painted).
