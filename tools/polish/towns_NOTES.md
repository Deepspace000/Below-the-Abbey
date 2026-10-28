# Towns and enclaves, polish round 3 (src/desert/hgd_polish_c.js)

Test server port 8332 (own process, stop by PID in tools/polish/c3_server.pid). Daemon tools/polish/c3_daemon.py (queue c3_q, helper c3lib.py), shots in c3_shots/.
Audit scripts: c2_audit.js (round 2 table), c3_audit2.js (round 3 additions), c3_lum.py (mean frame luminance), c3_tour.py (shots of every church, street, landmark, corridor), c3_final.py (reload + all audits + quests).

## What was wrong (towns_CRITIC2.md) and what was done
1. Churches 12 to 22 squares from their towns: step A0 of hgdpc2Build moves every church that is more than 8 squares from its square onto the rim of the square (3 to 9 squares from the centre, 2 squares of room round it, 3 squares from any person). Distances now 3 to 7 (0:6 1:6 2:7 3:3 4:6 5:6 6:3 7:6). The church light, sign and props follow.
2. Church art: the flat white slab (church4) and the lantern pile (church3) are gone. The lantern pile was the prop hgtb_deco_lanterns standing in front of the shrine, not the shrine. Fronts are now painted pieces with no flattening tint: 0 chapel, 1 gothic niche (icn_shrine_moor), 2 honey dome, 3 pearl shrine, 4 sandstone shrine, 5 crystal spire (hg_tower4), 6 pink cathedral (hg_tower7), 7 gold pagoda shrine. The two spires are tall enough to be seen over a square.
3. Door blockers: church props stand at fixed side slots two squares out and never on the door line; everything within one square of a church, every tall prop within two, and every lamp on its axis at two squares is moved away (step E). Crates, benches, tables and chests two squares in line with a quest giver or shopkeeper are moved too. The Old Well vignette crates became a barrel and a jar. Audit: churchDoorBlockers empty.
4. Enclave corridors near black: step F2 puts a hanging lamp (hgt_hanglamp) and a light pool every 4.5 squares along every corridor within 12 squares of an enclave and 5 squares within 9 of a town (254 lamps). Town and enclave centre pools are stronger (1.0, radius 80 and 72). See the luminance table below.
5. Honey Press and Pearl Fountain: every town landmark gets a lit, lettered plaque beside its main piece (HONEY PRESS, PEARL FOUNTAIN, and so on, 7 plaques; the Old Well already has one) and a light of its own.
6. Houses: step C builds a street of four houses (a row or column, one free square between houses, one frontage line, door plate in front of each) on the rim of each square; where the maze has no room for four it makes runs of three or two. 32 houses, 30 of them in a street run. Gap cells are checked so no pocket is closed off; step F4 opens any pocket a blocker closes (0 needed).
7. The large flat beige panel at (13,159) was the WALL, not a prop: the Honeycomb Reach wall picture `hg_wax` never existed, so every honeycomb wall drew as a flat beige slab. It is now painted in code (a tileable lattice of waxed hexagons, some capped, some empty) and set before the level is built. This also fixes the Hollow Grasslands deeper wall that shares the name.
8. Labels: every note and sign in the zone has d.label (1 to 4 words); the table is F5 (hgd_note, hgd_pa_note, hgdb_note, hgdb_post, hgd_sign). hgdpc_text signs and plaques carry label too. No empty text, no em dash (audit: noLabel [], emptyText [], emDash 0).
9. Extras: the church priest of Combwick no longer shares a picture with a quest giver (20 givers, 20 different pictures).

## Not done
- Notice boards and plaques are still one board picture (round 2 item 8, low). The text pass (hgd_polish_text.js) paints the headings.
- The Honey Press landmark is still the pottery stall with a wax barrel; the plaque names it. A painted press would need a new sheet.

## Checks
See the final report of the session for the luminance numbers and counts. Console errors: none on load, the tour or 93 talks. Old saves: chests and quest objects were not moved (first pass vignette chests are untouched, hgdTier items are skipped by every move).
