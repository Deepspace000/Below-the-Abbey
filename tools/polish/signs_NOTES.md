# Signage and asset pass (hgd_polish_signs.js)

## Signs
- 12 new painted front-on sprites (Gemini, magenta sheets, cut by tools/hs_ingest.py): assets/ds_hs_*.png (game name art_hs_*) with copies in assets/hp/signs_*.png.
  post, board, tablet, plaque, hanging, runestone, waymarker, slate, scroll, page, marker, warning. Raw sheets in tools/polish/signs_raw/.
- src/desert/hgd_polish_signs.js (last in tools/inject.py ORDER). Wraps hgdBuild, hgduBuild, hgdwBuild and setupLights; for every decor entry in levels 475, 476, 477 that
  uses hl_p_note it picks a sprite from the text (carved: tablet/plaque/runestone; notice/rules: board; shop: hanging; epitaph: marker/tablet/plaque; warning: warning/slate;
  directions: post/waymarker/plaque; diary/letters: page/scroll; npc hgdb_post: post/waymarker; otherwise page/scroll/slate/plaque/tablet by hash). Text, npc id and click are untouched.
- Wall notes stay flat on the wall at chest height (heights: page .55, scroll .62, tablet .62, plaque .46, slate .6, board .82, hanging .72). Standing kinds (post 1.02, waymarker .66,
  runestone .78, marker .5, warning .56) lose pic/wd-flat and stand in the corner of the square next to the wall (ox/oy), never mid-corridor. Idempotent via d.hgs.
- Verified: after build no decor in 475/476/477 uses hl_p_note (kept list: none). 476 has no notes. Screenshots: 18 in 475, 12 in 477 (tools/polish/signs_shots.py).
- Not touched: the old Hollow levels (39 etc., hollow.js, hollow_haunt.js, hgd_fun.js khNpc portrait) still use hl_p_note, they are not the Deeper Hollow.
  Existing shop signs (k gate, npc hgd_sign, 43 of them) were already signs and are kept.

## 404s (66 before, 0 now)
- 12 painted icons made (Gemini sheet, tools/ingest_icon.py): icn_hgdgem_{amber,amethyst,emerald,pearl,ruby,sapphire}, icn_hgdkey_{blue,gold,green,red}, icn_hgdlantern, icn_hgdshard.
  These were placeholder tinted ore icons. The amethyst had holes where bright purple was keyed out; filled by hand.
- The other 54 are items whose icons the game makes in code from a base icon (food, bows, axes, rings, spells, sp_*30b). tools/inject.py now writes ICN_FILES (existing icn_*/sp_* files)
  into artlist.js; hgd_polish_signs.js wraps loadImg to skip icn_/sp_ files that do not exist; spells.js asks only for sp_ files in ICN_FILES. Add a new icon file, run inject.py, it is requested.
- Check: tools/polish/signs_audit.py (counts 404s, hl_p_note left), signs_icons2.js (icon identity).
