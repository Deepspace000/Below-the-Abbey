# Stall shops: status (work paused by the owner)

## Done
- `src/desert/stall_shop.js` (in `tools/inject.py` ORDER just before `crows.js` and `jump_ready.js`). Injected, parses, game loads.
  - Classifier: stall by name (stall, market, booth, awning, kiosk, canopy, pavilion) anywhere; cart, tent, barrow, wagon, counter in a town or with a person within 3 squares.
    People, chests, shops, doors and levers are skipped (they keep their own job).
  - Binding: nearest person within 6 steps on foot whose first talk page has a trade button that opens a shop (tried quietly with openShop held back, gold guarded, cached per level).
    Ties: behind the stall first. Press opens that shop page directly (same function as the Trade button), no greeting.
  - Nobody near: a short flavour line (no em dashes).
  - Use key and pad button (heroAttack wrapper), click (viewTap wrapper), hover tip "Trade at X" (crtPass wrapper), painted Deeper Hollow stalls get a click area (spriteList wrapper).
- One edit in the non-injected top of `index.html`: a hit line after the item hits in the sprite loop (`stlHitRef`).
- Test tools in this folder: `lib.py`, `run.py` (batch), `repl.py` (one browser kept open, commands via a file), `explore.py`, `gen_md.py` (writes BINDINGS.md from run.py JSON).

## Seen in the one live run (Wenlock, level 496)
- 11 stall decor found, 10 bound to the right keeper (fruit, spice, pottery, fish, cloth, jewellery x2, eggs, melon, jar), 1 decorative (kh_stall2_3 at 34,72).
- Keepers pressed directly still talk as before.
- The use key and click checks FAILED in that run, but the harness was at fault: it called frame() by hand (caused drawPressFx arc errors) and did not wait for canAct().
  `lib.py` is already rewritten to wait for real frames; it has NOT been run yet.

## Remains
1. Run the checks again with the fixed harness (one browser at a time): use key, click, hover tip, buy and sell, keeper unchanged, no console errors. If the use key or click still does nothing, debug `stlAhead`, `stlHitAt`, and whether `G.hits` gets the `stl` entries.
2. Scan and test more towns (Oldhaven 305 and quay 304, Khemetra 44, Yarrim 290, Thornwick 3, Ironhill 13, Deeper Hollow 475, Hollow Grasslands 470, the 481 to 484 towns, Wenlock shop interiors) and check the painted Deeper Hollow stalls (the church picture may be swapped for a filtered copy by hgd_polish_c.js, which would miss the image match).
3. Four screenshots of the shop page opened from a stall, looked at with Read.
4. Generate `BINDINGS.md` with `python tools/stall_shop/gen_md.py out1.json ...` (not written yet).
5. Not committed, version not bumped, as instructed.
