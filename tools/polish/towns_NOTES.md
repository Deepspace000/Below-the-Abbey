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

# Round 4 (towns_CRITIC3.md fixes), still src/desert/hgd_polish_c.js

Server port 8321, daemon c5_daemon.py (queue c5_q, c5lib.py), shots c5_shots/, audit c5_audit.js, lum c5_lum.py (samples c3_samples.js), tour c5_tour.py, one shot c5shot.py.
1. Per-kind scale table: HGDPC_SCALE.push(...) after the table: jars .45-.65, wax barrels, lectern, sacks .3-.42 (they were person sized and hid the Hedgefoot giver), huts 1.5-1.8 (were 1.1), pink/cream/lilac cloud bushes, the lantern cluster (hgtb_deco_lanterns .55-.8, was 1.35 at Nacre Landing), bells, reeds. Drifting petal clouds keep hgd_polish_b's cap (they float).
2. Step I1 (after step E): nothing within one square of a giver, shopkeeper, priest or note, and nothing of h>=.35 within two squares in line of a giver; notes: nothing h>=.3 within two squares in line. Props go to the nearest cell out of every line (3 tiers).
3. Step I2: hanging shop signs (hgdpc_ss*) 0.62 of a person, lift .3.
4. Corridor notes: hgdpcCorr(L) at the end of this file, called from hgd_polish_text.js (hgsApply wrapper, just before hgtApply). Every wall note picture in a town or enclave becomes a standing sign in the square corner, scale 1.35 (page becomes scroll), so it faces the walker and reads at 3 to 4 squares. hgdpcLate(L) clears small props off and in front of notes (and drops hanging-lamp pictures there), moves a note that stands behind a blocker, last resort removes a small rock/clutter blocker (removing never closes a way). Scroll text rectangle enlarged in HGTX_TBL.
5. Light: corridor lamps every 4 (towns) / 3.6 (enclaves, 3 in the dark-wall ones) squares, stronger pools (kI .85 to 2.8, r2 52 to 80), around-pools .75 (1.5 in Lantern Landing, Mossy Corner, Quiet Room, Sleeping Nook), enclave centre pools 2.6.
Result: hub mean 79 (min 65), corridors mean 75, darkest sampled corridor 59 after the last tweak (49 before it, one sample).
Not fixed: a rock that guards a secret (hgdTier) stands 2 squares in line of the Mossy Corner note (89,142).
