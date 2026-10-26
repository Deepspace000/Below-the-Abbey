# Wenlock interiors: notes

Rooms behind every door of Wenlock (levels 7100 to 7199; the table is `WL_DOORS` in `src/desert/wenlock_town.js`). The town file builds the doors; these files build the rooms.

## Files (src/desert, run `python tools/inject.py` after editing; order in inject.py: after wenlock_folk.js)
- `wenlock_in.js`   loader for `assets/wl2` (manifest.json; pieces are `IMG['wl2_<sheet>_<n>']`), the prop catalogue `WLIN_P` (piece, height in cells, glow, height off floor), the wall and floor looks `WLIN_LOOK`, and ALL room data in `WLIN_ROOMS`
  (size, look, ambient light, lights, props, folk, window squares). `KH_LAZY[id]` is set for every `WL_DOORS` id and for 7190 (inn cellar) and 7191 (old granary); each room is made by `khRoom()` (wrapped: a `b.wlin` name picks the data),
  its first portal returns to `d.front` with facing `d.out`. Windows are wall squares from `wl2_ww_0..5` (char U+03A9). The inn has a cellar door in its west wall, the cellar a tunnel door to the granary and back.
  Homes: 14 households chosen by a hash of the level number (`WLIN_HOME`: cottage with hearth, cat and pie; farmer's kitchen; widow's parlour; cluttered; scholar; wool merchant; healer; family with child; baker's flat; house of cats; soldier; fisher; gentleman; fiddler).
- `wenlock_in_folk.js` pets, children, neighbours, the ghost Percival, the cottage pie, the notice boards, the blackboard, the votive candles (5 gold, blessing), the lectern, eight library books (read in place with the reader of hgt_books.js: `hgbOpen('read',id)`, texts added to `HGB_TEXT` as `wlb_*`), and the librarian.
- `wenlock_in_keepers.js` shopkeepers (`wli_k_*`), their stock (`KH_STOCK.wli_*`, level 80: potion ladder to potion7, mana, escape, best arms and armour under 30000), the landlord (room 60 gold, meal, gossip), the vicar (heal, raise, curses, sicknesses, as in hgd_church.js), school, almshouse, hall clerk, household folk.

## Pictures (assets/wl2, 14 Gemini sheets, 84 pieces)
`floor_0..5` (planks, flags, herringbone brick, terracotta, rushes, chequer), `wall_0..5` (half-timber, oak linenfold, plaster, stone, brick, sage plaster), `ww_0..5` (wall squares with a window each), props `inn`, `smith`, `armour`, `library`, `church`, `bakery`, `trades`, `home`, `hall` (6 each, see WLIN_P for what each is) and `folk1`, `folk2` (12 full-length people).
Tools: `tools/ingest_wl2.py <sheet.jpg> <name> <tex|sprite|comp>` (comp cuts loose objects by blobs, use it for props and people; `seam=none` for walls), `tools/contact_wl2.py <prefix> <out.png>`, `tools/wl2_gemini_helpers.js` (pasted in the console of the Gemini Images tab; receiver `python tools/mg_recv.py <outdir> 8380`).
If a picture is missing the older props stand in (the fourth column of WLIN_P) and people fall back to the Oldhaven folk (`wlinFaces`).

## Tests
`python tools/wl2_test.py [port] [ids]` screenshots every room (needs a server, `python -m http.server 8376`), `python tools/shots_wl2.py` makes contact sheets, `python tools/wl2_func.py` checks portals, stock, inn rest, church heal and raise, library books.

## Weak spots / ideas
- The reading desk and school desk pictures show a slightly sloped top (they are lectern desks). Redo with a flat-on bench if Gemini is free.
- No stairs or upper floors; the inn's "rooms" are the rest option. A painted stair, rugs seen from the front (hung on the wall), a kitchen range, a loom, a wall clock and a hanging sign for each shop would add life.
- Windows give no coloured light (the engine has only warm or red lights).
- The mayor (`wlo_mayor`) is outdoors; the hall has a clerk instead.
