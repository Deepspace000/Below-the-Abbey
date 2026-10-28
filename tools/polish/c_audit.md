# Towns audit (zone C): maze towns, enclaves, shops, people, churches

Script: tools/polish/c_audit.js run by tools/polish/c_probe.py (server port 8362). Raw data: c_audit_before.json, c_audit_after.json.

## Counts

| Check | Before | After |
|---|---|---|
| Identical NPC dialogue lines (shops, church, vill) | 12 | 1 |
| Pictures shared by NPCs in one place (same picture 2+ times, towns) | 22 | 16 |
| Stacked decor cells | 12 | 13 |
| Identical clusters of 3+ within 4 cells | 90 | 13 |
| Blocking props cutting a corridor (flood fill) | 0 | 0 |
| Placeholder / em dash text | 0 | 0 |
| Decor on wall cells | 0 | 0 |
| Unreachable NPCs | 0 | 0 |

Notes: the before figure for quest givers was an audit artefact (their roots need quest state), they are fine. 8 of the remaining clusters are fern groves (different ferns of one family) and the Gildmere lamp ring (a deliberate ring of four lights). Stacked cells left are a wall plaque plus a floor prop (allowed) and props placed by other agents (hgx).

## Other findings (before)

- hg_npc2 is a human boy picture with no NPC_H entry: drawn 1.67 squares high and used as a priest, armourer and trader in 6 places (a giant boy).
- hg_npc3 drawn at 0.72, others 0.90 to 1.01: no common scale for people.
- 40 shop greetings were one line copied to 8 towns (identical text 7 or 8 times), every town used the same 3 warning lines and 6 gossip lines.
- Towns where one picture stood 4 or 5 times (Blue Lantern: hg_npc1 x5).
- No sign or notice board at any shop, church or town; the 24 villagers and 6 travellers repeated stock lines; all 6 travellers were named A traveller.
- Churches stand 15 to 20 squares from their town centre (kept: placed by hgd_church.js; now each has a sign).

## PROPORTIONS (effective height in squares = NPC_H x sc), towns and enclaves

| Kind | Count | Min | Max | Median | Outliers fixed |
|---|---|---|---|---|---|
| hgt_fairytree | 56 | 3 | 3.2 | 3.2 |  |
| hgtb_plant_belltree | 52 | 3 | 3 | 3 |  |
| hgtb_plant_spiralfern | 45 | 1.6 | 1.6 | 1.6 |  |
| hg_lamp | 29 | 2.2 | 2.2 | 2.2 |  |
| art_hgdf_plant1 | 26 | 0.31 | 0.44 | 0.39 |  |
| art_hgdf_plant0 | 24 | 0.57 | 0.83 | 0.71 |  |
| hgt_bulbflower | 23 | 1.9 | 1.9 | 1.9 |  |
| hgt_mushrooms | 22 | 0.9 | 0.9 | 0.9 |  |
| NPC:hg_npc6 | 21 | 0.95 | 0.95 | 0.95 |  |
| hgt_shellflower | 20 | 2.1 | 2.1 | 2.1 |  |
| hgt_reeds | 20 | 0.98 | 1.4 | 1.4 |  |
| art_hgxrock2 | 19 | 0.31 | 0.45 | 0.36 |  |
| hgt_fern | 18 | 1.1 | 1.1 | 1.1 |  |
| teleporter | 18 | 0.62 | 0.62 | 0.62 |  |
| art_hgxrock1 | 18 | 0.39 | 0.56 | 0.47 |  |
| NPC:noticeboard | 18 | 0.77 | 0.77 | 0.77 |  |
| art_hgxrock6 | 17 | 0.25 | 0.35 | 0.31 |  |
| NPC:hg_npc0 | 15 | 0.98 | 0.98 | 0.98 |  |
| art_hgxrock3 | 15 | 0.17 | 0.24 | 0.2 |  |
| art_hgdf_plant4 | 14 | 0.45 | 0.59 | 0.53 |  |
| NPC:sign_store | 14 | 1.05 | 1.05 | 1.05 |  |
| hgtb_plantbed | 13 | 1.15 | 1.15 | 1.15 |  |
| NPC:hg_npc3 | 13 | 0.95 | 0.95 | 0.95 | 0.72 now 0.95 |
| art_hgdf_shield6 | 13 | 0.8 | 0.8 | 0.8 |  |
| art_hgxrock5 | 13 | 0.54 | 0.65 | 0.59 |  |
| hgt_pearlbush | 12 | 1 | 1 | 1 |  |
| NPC:hl_p_note | 12 | 0.45 | 0.45 | 0.45 |  |
| hgtb_deco_shellstatue | 12 | 1.6 | 2 | 2 |  |
| art_hgdf_shield2 | 12 | 0.8 | 0.8 | 0.8 |  |
| art_hgxprop0 | 12 | 0.21 | 0.3 | 0.24 |  |
| art_hgxprop5 | 12 | 0.24 | 0.35 | 0.32 |  |
| hgtb_bench | 12 | 0.66 | 0.66 | 0.66 |  |
| art_hgdf_wsym6 | 11 | 0.85 | 0.85 | 0.85 |  |
| art_hgdf_shield0 | 11 | 0.8 | 0.8 | 0.8 |  |
| art_hgdf_plant3 | 11 | 0.34 | 0.41 | 0.38 |  |
| art_hgxrock0 | 11 | 0.42 | 0.48 | 0.44 |  |
| art_hgxprop7 | 11 | 0.12 | 0.18 | 0.15 |  |
| art_hgdf_wsym5 | 10 | 0.85 | 0.85 | 0.85 |  |
| hgtb_deco_pearlplinth | 9 | 1.15 | 1.8 | 1.15 |  |
| NPC:hg_npc4 | 9 | 1 | 1 | 1 | 1.01 now 1.00 |

NPC pictures after the fix: hg_npc0 0.98, hg_npc1 0.90, hg_npc3 0.95, hg_npc4 1.00, hg_npc5 0.95, hg_npc6 0.95, hg_wizard 1.00, hg_npc2 (child) 0.80. Aspect ratios are preserved by the engine (width = NPC_H x image width / height), so nothing is stretched.
New props use existing NPC_H where it exists (benches 0.6, statue 1.7 to 2.0, well 0.78, fountains 1.3 to 1.8, crates 0.5, barrels 0.58, buckets 0.36), signs are drawn 1.05 to 1.1 high (a hand above a person) and notice boards 0.9 to 1.0.
