# Deeper Hollow polish B: audit (precincts 13 to 24, the atrium and the gate)

Zone = every cell whose biome is 4 to 7 (Sandstone Deeps, Blue Quarter, Mosaic Halls, Gilded Quarter), 11,978 open cells. Script: tools/polish/b_audit.js run by tools/polish/b_probe.py; raw data b_audit_before.json (patch off, `?hgpb=0`) and b_audit_after.json.

| Check | Before | After |
|---|---|---|
| Decor pieces in the zone (bio 4-7) | 2990 | 2867 |
| Decor on wall cells | 0 | 0 |
| Blocking pieces that cut a one-square way (exact flood-fill test) | 0 | 0 |
| Cells holding 2+ pieces with no offset (stacked) | 1 | 0 |
| Clusters: 4+ of one kind within 4 squares (reeds of the marsh excluded) | 261 | 2 |
| Props drawn wider than a square in or beside a corridor | 64 | 14 |
| Unreachable items | 0 | 0 |
| Unreachable people and shops | 0 | 0 |
| Unreachable creatures | 0 | 0 |
| Dead ends with nothing within 2 squares | 2 | 0 |
| Open cells with no prop, item or light within 7 squares | 0 | 0 |
| Lights in the zone | 66 | 86 |

Other findings (before):
- The old notes and warning signs always showed note number 0 and a sign with no place name, because the old talk roots read G.talk.d, which is set only after the root runs (startTalk). Fixed in hgd_polish_b.js: all 38 notes and the zone names on the 44 signs now show.
- hg_npc2 (used by 40 people in the Hollow) had no height, so it drew about 1.7 tall next to villagers of 0.9. Set to 1.3 (drawn 0.94).
- The drifting petal clouds were up to 3.8 squares wide (flower art at scale 1.5 to 2.3 of 0.75); clamped to 1.3.
- Pearl plinths were 1.5 squares wide in one-square niches, shell statues 1.26; scaled to 0.97 and 0.91 wide.
- Warning signs (the gate picture) were 1.12 squares wide in one-square corridors; now 0.85.
- Chests were 0.62 tall (68 percent of a villager) and 0.8 wide; now 0.47 tall (about knee to hip).
- The plaque below the atrium still said the road ends here and thanked the player for playing, although the gate to the Maze of Gardens opens there; it now tells the truth before and after the Black Swill dies.
- No empty signs, no placeholder strings, no em dashes were found in the source of the Hollow files.

## PROPORTIONS (effective height in squares = NPC_H x sc; a villager is 0.9; picture aspect = width / height; counts are for the zone, min/max/median for the whole level after the patch)

| Kind | Zone count | Min | Max | Median | Aspect |
|---|---|---|---|---|---|
| art_hgdf_plant1 | 112 | 0.25 | 0.44 | 0.36 | 1.13 |
| art_hgdf_plant0 | 105 | 0.48 | 0.84 | 0.67 | 0.40 |
| hgt_reeds | 90 | 0.42 | 1.40 | 0.87 | 0.71 |
| hgt_fairytree | 89 | 3.00 | 3.20 | 3.20 | 0.82 |
| hgtb_plant_belltree | 77 | 3.00 | 3.20 | 3.00 | 1.01 |
| art_hgdf_plant6 | 64 | 0.19 | 0.30 | 0.24 | 1.44 |
| art_hgxrock1 | 61 | 0.39 | 0.56 | 0.48 | 1.09 |
| hl_p_note | 60 | 0.45 | 0.45 | 0.45 | 0.84 |
| art_hgxrock6 | 57 | 0.24 | 0.36 | 0.30 | 2.21 |
| art_hgdf_plant5 | 55 | 0.44 | 0.74 | 0.57 | 0.61 |
| art_hgxrock3 | 54 | 0.17 | 0.34 | 0.21 | 2.41 |
| art_hgthin0 | 51 | 0.44 | 0.66 | 0.57 | 0.26 |
| art_hgxrock2 | 50 | 0.31 | 0.46 | 0.39 | 1.05 |
| art_hgthin3 | 50 | 0.44 | 0.66 | 0.54 | 0.32 |
| art_hgdf_wsym4 | 46 | 0.85 | 0.85 | 0.85 | 0.96 |
| hg_lamp | 45 | 2.20 | 2.20 | 2.20 | 0.59 |
| art_hgdf_plant4 | 45 | 0.43 | 0.60 | 0.53 | 0.47 |
| art_hgdf_vine0 | 44 | 1.80 | 1.80 | 1.80 | 0.95 |
| art_hgdf_vine3 | 44 | 1.80 | 1.80 | 1.80 | 0.92 |
| art_hgdf_wsym5 | 41 | 0.85 | 0.85 | 0.85 | 0.47 |
| art_hgxprop11 | 41 | 0.10 | 0.23 | 0.20 | 1.38 |
| art_hgdf_wsym7 | 40 | 0.85 | 0.85 | 0.85 | 1.02 |
| art_hgxprop13 | 39 | 0.24 | 0.45 | 0.30 | 1.43 |
| art_hgxprop7 | 38 | 0.12 | 0.34 | 0.15 | 1.95 |
| hgt_fern | 37 | 0.95 | 1.10 | 1.10 | 0.72 |
| art_hgdf_wsym6 | 37 | 0.85 | 0.85 | 0.85 | 1.43 |
| art_hgdf_vine1 | 37 | 1.80 | 1.80 | 1.80 | 0.93 |
| art_hgdf_vine2 | 36 | 1.80 | 1.80 | 1.80 | 0.85 |
| art_hgdf_plant7 | 35 | 0.60 | 0.88 | 0.75 | 0.64 |
| gate | 34 | 0.59 | 0.95 | 0.59 | 1.47 |
| art_hgdf_plant2 | 34 | 0.49 | 0.70 | 0.60 | 0.38 |
| art_hgdf_plant3 | 34 | 0.34 | 0.48 | 0.39 | 0.61 |
| art_hgxprop10 | 34 | 0.06 | 0.19 | 0.15 | 1.71 |
| art_hgthin2 | 32 | 0.44 | 0.66 | 0.53 | 0.35 |
| hgt_mushrooms | 31 | 0.77 | 1.04 | 0.90 | 0.85 |
| hgtb_plant_spiralfern | 31 | 1.60 | 1.60 | 1.60 | 0.40 |
| art_hgxprop0 | 31 | 0.21 | 0.41 | 0.26 | 1.85 |
| art_hgxprop4 | 31 | 0.21 | 0.30 | 0.24 | 0.84 |
| art_hgxprop1 | 30 | 0.21 | 0.38 | 0.26 | 1.25 |
| hgt_bulbflower | 28 | 1.90 | 1.90 | 1.90 | 0.31 |
| hgt_pearlbush | 27 | 1.00 | 1.00 | 1.00 | 1.05 |
| art_hgxprop5 | 27 | 0.24 | 0.35 | 0.29 | 0.83 |
| art_hgthin7 | 27 | 0.44 | 0.65 | 0.52 | 0.22 |
| art_hgthin4 | 27 | 0.45 | 0.66 | 0.53 | 0.29 |
| art_hgxrock5 | 26 | 0.54 | 0.65 | 0.59 | 0.70 |
| art_hgxprop6 | 26 | 0.21 | 0.31 | 0.26 | 1.35 |
| art_hgxrock7 | 25 | 0.41 | 0.61 | 0.52 | 1.00 |
| art_hgthin1 | 25 | 0.44 | 0.67 | 0.54 | 0.32 |
| art_hgthin6 | 24 | 0.44 | 0.67 | 0.55 | 0.30 |
| hgt_shellflower | 23 | 2.10 | 2.10 | 2.10 | 0.35 |
| art_hgxprop14 | 23 | 0.20 | 0.30 | 0.25 | 0.99 |
| art_hgdf_wsym13 | 22 | 0.85 | 0.85 | 0.85 | 0.80 |
| art_hgxprop12 | 20 | 0.27 | 0.41 | 0.35 | 1.09 |
| art_hgthin5 | 20 | 0.44 | 0.66 | 0.55 | 0.32 |
| art_hgxprop8 | 19 | 0.21 | 0.30 | 0.24 | 1.43 |
| art_hgdf_wsym15 | 18 | 0.85 | 0.85 | 0.85 | 0.64 |
| art_hgxprop9 | 18 | 0.21 | 0.31 | 0.26 | 1.10 |
| hg_chestwax | 17 | 0.43 | 0.62 | 0.46 | 1.29 |
| hgtb_plantbed | 16 | 1.15 | 1.15 | 1.15 | 1.19 |
| art_hgdf_wsym10 | 16 | 0.85 | 0.85 | 0.85 | 0.97 |
| art_hgxstat7 | 16 | 1.12 | 1.29 | 1.24 | 0.45 |
| hg_chestweed | 15 | 0.43 | 0.46 | 0.43 | 1.38 |
| art_hgdf_wsym12 | 15 | 0.85 | 0.85 | 0.85 | 1.00 |
| art_hgdf_shield8 | 15 | 0.80 | 0.80 | 0.80 | 1.00 |
| art_hgxstat6 | 15 | 1.19 | 1.31 | 1.26 | 0.43 |
| art_hgxstat5 | 15 | 1.06 | 1.30 | 1.24 | 0.61 |
| art_hgxprop15 | 15 | 0.21 | 0.30 | 0.26 | 1.58 |
| hgtb_deco_shellstatue | 14 | 1.44 | 2.00 | 2.00 | 0.63 |
| art_hgdf_shield4 | 14 | 0.80 | 0.80 | 0.80 | 1.00 |
| hgt_vine_roundleaf | 14 | 2.49 | 3.47 | 2.98 | 0.40 |
| hgtb_deco_pearlplinth | 13 | 1.15 | 1.80 | 1.80 | 0.84 |
| teleporter | 13 | 0.62 | 0.62 | 0.62 | 0.00 |
| art_hgxrock0 | 13 | 0.42 | 0.50 | 0.47 | 1.46 |
| hg_npc0 | 11 | 0.98 | 0.98 | 0.98 | 0.62 |
| hg_npc6 | 11 | 0.95 | 0.95 | 0.95 | 0.54 |
| art_hgdf_shield7 | 11 | 0.80 | 0.80 | 0.80 | 1.00 |
| art_hgdf_shield6 | 11 | 0.80 | 0.80 | 0.80 | 1.00 |
| art_hgxrock4 | 11 | 0.77 | 0.94 | 0.87 | 0.46 |
| noticeboard | 10 | 0.77 | 0.77 | 0.77 | 0.88 |
| art_hgdf_shield3 | 9 | 0.80 | 0.80 | 0.80 | 1.00 |
| hg_npc3 | 8 | 0.72 | 0.95 | 0.95 | 0.49 |
| art_hgdf_wsym9 | 8 | 0.85 | 0.85 | 0.85 | 0.94 |
| sign_store | 8 | 1.05 | 1.05 | 1.05 | 0.75 |
| hg_chestjelly | 7 | 0.43 | 0.46 | 0.46 | 1.31 |
| hg_npc5 | 7 | 0.94 | 0.95 | 0.95 | 0.51 |
| art_hgdf_wsym14 | 7 | 0.85 | 0.85 | 0.85 | 1.06 |
| art_hgdf_wsym8 | 7 | 0.85 | 0.85 | 0.85 | 0.95 |
| art_hgxstat4 | 7 | 1.23 | 1.31 | 1.26 | 0.84 |
| hgtb_bench | 7 | 0.66 | 0.66 | 0.66 | 1.02 |
| hg_npc2 | 6 | 0.80 | 0.94 | 0.80 | 0.54 |
| hg_npc4 | 6 | 1.00 | 1.01 | 1.00 | 0.55 |
| hg_npc1 | 6 | 0.90 | 0.90 | 0.90 | 0.60 |
| hgdfc_pink1 | 6 | 0.67 | 1.68 | 0.67 | 1.94 |
| art_hgxstat0 | 6 | 1.20 | 1.27 | 1.24 | 0.44 |
| art_hgxprop2 | 6 | 0.17 | 0.21 | 0.19 | 1.06 |
| art_hgxstat1 | 5 | 1.19 | 1.31 | 1.25 | 0.44 |
| hgtb_lilacmoth | 4 | 0.52 | 0.52 | 0.52 | 1.87 |
| pickpocket | 4 | 0.55 | 0.55 | 0.55 | 0.42 |
| hg_wizard | 4 | 1.00 | 1.00 | 1.00 | 0.49 |
| sign_smith | 4 | 1.05 | 1.05 | 1.05 | 0.81 |
| hgdpc_sg_armour | 4 | 1.05 | 1.05 | 1.05 | 1.10 |
| hgdpc_sg_magic | 4 | 1.05 | 1.05 | 1.05 | 1.10 |
| sign_inn | 4 | 1.05 | 1.05 | 1.05 | 0.67 |
| sign_church | 4 | 1.09 | 1.09 | 1.09 | 0.53 |
| wm_noticeboard | 4 | 0.95 | 0.95 | 0.95 | 1.27 |
| wm_crate | 4 | 0.50 | 0.50 | 0.50 | 1.06 |
| hgtb_chair | 4 | 0.90 | 0.90 | 0.90 | 0.53 |
| art_wm_crate | 4 | 0.40 | 0.50 | 0.45 | 1.06 |
| hgtb_fishbeetle | 3 | 0.56 | 0.56 | 0.56 | 1.80 |
| art_hgdf_wsym11 | 3 | 0.85 | 0.85 | 0.85 | 0.76 |
| art_hgdf_shield0 | 3 | 0.80 | 0.80 | 0.80 | 1.00 |
| hgdfc_aqua2 | 3 | 0.71 | 1.60 | 0.71 | 1.83 |
| hgdfc_lilac2 | 3 | 0.83 | 0.83 | 0.83 | 1.57 |
| hgt_lamppost | 3 | 1.84 | 1.84 | 1.84 | 0.20 |
| wm_lantern_gold | 3 | 0.80 | 0.80 | 0.80 | 0.56 |
| art_hgxprop3 | 3 | 0.12 | 0.13 | 0.12 | 2.69 |
| hgtb_pearlslug | 2 | 0.28 | 0.28 | 0.28 | 1.44 |
| hgtb_creammoth | 2 | 0.35 | 0.35 | 0.35 | 1.37 |
| hgdfc_cream1 | 2 | 0.62 | 1.29 | 1.29 | 2.08 |
| sacks | 2 | 0.60 | 0.60 | 0.60 | 1.14 |
| hgtb_table | 2 | 0.70 | 0.70 | 0.70 | 0.97 |
| hgtb_deco_banner | 2 | 1.92 | 1.92 | 1.92 | 0.60 |
| art_wm_barrel | 2 | 0.52 | 0.58 | 0.58 | 0.79 |
| hgtb_jadeeel | 1 | 0.42 | 0.42 | 0.42 | 1.07 |
| hgtb_pinkbulb | 1 | 0.32 | 0.32 | 0.32 | 1.23 |
| hgtb_fishfly | 1 | 0.49 | 0.49 | 0.49 | 1.32 |
| hgtb_pups | 1 | 0.28 | 0.28 | 0.28 | 2.42 |
| hgdfc_lilac1 | 1 | 0.70 | 0.70 | 0.70 | 1.87 |
| hg_house0 | 1 | 3.10 | 3.10 | 3.10 | 0.39 |
| hg_house1 | 1 | 2.50 | 2.50 | 2.50 | 0.59 |
| art_hgxstat3 | 1 | 1.20 | 1.31 | 1.25 | 0.65 |
| art_hgxstat2 | 1 | 1.19 | 1.31 | 1.24 | 0.60 |
| hgdpc_post4 | 1 | 1.25 | 1.25 | 1.25 | 0.70 |
| hgdpc_post5 | 1 | 1.25 | 1.25 | 1.25 | 0.70 |
| hgdpc_post6 | 1 | 1.25 | 1.25 | 1.25 | 0.70 |
| hgdpc_post7 | 1 | 1.25 | 1.25 | 1.25 | 0.70 |
| urn | 1 | 0.55 | 0.55 | 0.55 | 0.78 |
| wm_brazier | 1 | 1.05 | 1.05 | 1.05 | 0.40 |
| hl_p_candle | 1 | 0.80 | 0.80 | 0.80 | 0.63 |
| hgtb_deco_lanterns | 1 | 1.35 | 1.44 | 1.44 | 0.97 |
| well | 1 | 0.78 | 0.78 | 0.78 | 0.72 |
| wm_bucket | 1 | 0.36 | 0.36 | 0.36 | 0.90 |
| hgtb_lantern | 1 | 1.03 | 1.03 | 1.03 | 0.73 |
| vase0 | 1 | 0.52 | 0.52 | 0.52 | 0.54 |
| hgtb_stall_rose_lanterns | 1 | 1.36 | 1.36 | 1.36 | 1.52 |
| hgtb_furn_clock | 1 | 1.30 | 1.30 | 1.30 | 0.34 |
| hgt_hanglamp | 1 | 0.80 | 0.80 | 0.80 | 0.39 |
| hgt_fountain | 1 | 1.30 | 1.30 | 1.30 | 0.67 |
| wm_bookshelf | 1 | 1.71 | 1.71 | 1.71 | 0.98 |
| hgtb_furn_bookshelf | 1 | 1.60 | 1.60 | 1.60 | 0.80 |
| hg_lectern | 1 | 1.10 | 1.10 | 1.10 | 0.61 |
| hgtb_furn_books_globe | 1 | 0.80 | 0.80 | 0.80 | 1.58 |
| yar_tent | 1 | 1.00 | 1.00 | 1.00 | 1.35 |
| hgtb_plant_barrel | 1 | 0.60 | 0.60 | 0.60 | 0.78 |
| wm_lantern_hang | 1 | 0.90 | 0.90 | 0.90 | 0.41 |
| wm_cage_lantern | 1 | 0.50 | 0.50 | 0.50 | 0.56 |
| art_hgtb_bench | 1 | 0.50 | 0.50 | 0.50 | 1.02 |
| art_hgtb_furn_bookshelf | 1 | 1.05 | 1.05 | 1.05 | 0.80 |
| art_hgtb_furn_books_globe | 1 | 0.34 | 0.34 | 0.34 | 1.58 |
| art_hgtb_deco_banner | 1 | 0.95 | 0.95 | 0.95 | 0.60 |

Enemy sizes (width w from ENEMY_DEF, height from the picture aspect): 

Creatures are left as they are: they are drawn wider than a corridor on purpose (they fill it), the Warden is the biggest thing in the zone at 2.3 x 2.3, every picture is drawn at its own aspect ratio so nothing is stretched.
