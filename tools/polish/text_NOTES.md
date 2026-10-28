# Writing on the signs (round 3)

New file src/desert/hgd_polish_text.js (ORDER: right after hgd_polish_signs.js). Paints a label on a cached copy of each art_hs_* sign sprite
(IMG key hgt_<kind>_<hash of label>, one canvas per kind and label, painted when the decor is first built or entered, idempotent via d.hgt).
Wall pictures keep d.k and show the lettered copy through d.lk (maps and quests read d.k); standing signs get d.k swapped (d.hgtBase keeps the blank id).
Text fonts: FUI (small caps) for most, FTITLE blackletter for the hanging sign. Ink: dark on paper, dark engraved on brass, cream with dark outline on stone, slate and wood, gold on the rune stone. Per letter jitter, no blur.

Text rectangles (fractions of the sprite, x0,y0,x1,y1; in HGTX_TBL, measured by eye on tools/polish/text_sheet.png and corrected after full-size renders):
page .16,.2,.84,.8 | scroll .28,.38,.78,.72 | plaque .17,.2,.83,.46 (brass plate) | tablet .2,.2,.8,.62 | slate .2,.24,.8,.7 (rot -.03) |
marker .2,.22,.8,.6 | warning .15,.14,.85,.44 | runestone .22,.83,.78,.95 (below the runes) | waymarker .26,.56,.74,.76 | hanging .3,.57,.7,.71 (cartouche) |
board .12,.185,.88,.3 | post lower arrow .22,.3,.86,.42, upper arrow .14,.12,.74,.24 (a post with two short sentences puts one on each arrow).
plaque and scroll were scaled up a little (.6 and .7 high) so the writing reads at 3 squares.

Labels: d.label if set; HGTX_LAB for the older floors' notes (hl_note0..17, hl_vance0..2); board = "Notices, <level name>"; otherwise the first sentence of the
note without its "Chalked:" style lead-in, cut at a clause or word if over 36 characters. Shouted notes are set in normal case.
Older Hollow floors (440-459, cavern 364) are now in HGSG.IDS so their red-handprint parchments become signs with writing too (hgsText was wrapped to read HL_NOTES / HL_VANCE).

Audit: python tools/polish/text_audit.py -> tools/polish/text_labels.json (every sign-like decor with label; none empty). Shots: tools/polish/text_shots.py <kinds> (m_<kind>.png = 1, 3, 5 squares). Server port 8335.

Known: at 5 squares the writing is legible only on the big signs (page, slate, tablet, warning); that is the sprite size, not the text.
Seen in passing, not mine: on floors 440-459 almost every note has npc hl_note16 (same text repeated), hollow.js line 429 index; wall-note signposts sit in front of lamps in level 475 (79,81).
Not done: art_wm_noticeboard (hgd_polish_e boards) is another sprite and is still unlettered; 476 had no notes at build.
