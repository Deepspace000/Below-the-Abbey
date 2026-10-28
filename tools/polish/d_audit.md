# Underlevel audit (level 476), before and after the polish pass

Script: tools/polish/d_audit.py (`before` runs with the polish patch switched off). Port 8363.

| check | before | after |
|---|---|---|
| decor pieces | 331 | 492 |
| lights | 90 | 115 |
| map names | 3 | 14 |
| dead ends (total) | 82 | 82 |
| dead ends with nothing within 2 squares | 32 | 4 |
| long bare straights (25+ squares, no prop, no light) | 3 | 0 |
| cells with 3 or more props stacked | 13 | 6 |
| clusters of 3+ identical props within 4 squares (boss ring excluded) | 0 | 0 |
| props blocking a one-square corridor | 0 | 0 |
| readable notes, signs and journal pages | 0 | 30 |
| readables with empty or placeholder text | 0 | 0 |
| props on wall squares | 0 | 0 |
| props on water (boats excluded) | 0 | 0 |
| wall-hung props with no wall behind | 0 | 0 |
| creatures on a blocking prop | 0 | 0 |
| land props the party cannot walk to (islets and the boss island excluded) | 0 | 0 |
| chests | 6 | 8 |

Notes: the "stacked 3+" cells that remain are the shrines (two candles and a scrap of bone, by design) and the Hermit; the six braziers round the Black Swill are the boss ring (left alone). Signs and notes did not exist before (0), so there were no empty ones; the 30 readables now all carry real text. No em dashes in any text (checked by script). Empty dead ends 32 to 4 (the four left are the Messenger letters and ladder spurs).

## PROPORTIONS (height in squares: a hero is 0.8, hip-high crate 0.45, a statue 1.25)

| kind | count | scale min | scale max | height min | height median | height max | width max | spread (max/min) | note |
|---|---|---|---|---|---|---|---|---|---|
| art_hgxrock5 | 6 | 2.50 | 2.50 | 1.49 | 1.49 | 1.49 | 1.04 | 1 | boss ring columns, left alone (1.49 high by design) |
| hgpd_lamp | 1 | 1.00 | 1.00 | 1.25 | 1.25 | 1.25 | 0.40 | 1 |  |
| art_hgxstat6 | 1 | 1.00 | 1.00 | 1.25 | 1.25 | 1.25 | 0.54 | 1 |  |
| hgpd_blue | 2 | 2.00 | 2.50 | 1.00 | 1.25 | 1.25 | 1.05 | 1.25 |  |
| art_hgxstat3 | 1 | 1.00 | 1.00 | 1.25 | 1.25 | 1.25 | 0.81 | 1 |  |
| art_hgxstat7 | 1 | 0.95 | 0.95 | 1.19 | 1.19 | 1.19 | 0.53 | 1 |  |
| art_wm_shrine | 8 | 1.00 | 1.00 | 0.95 | 0.95 | 0.95 | 1.02 | 1 |  |
| hgpd_boat | 1 | 1.50 | 1.50 | 0.93 | 0.93 | 0.93 | 1.38 | 1 |  |
| hgpd_wheel | 1 | 1.00 | 1.00 | 0.90 | 0.90 | 0.90 | 0.70 | 1 |  |
| art_wm_chain | 30 | 0.85 | 0.95 | 0.89 | 0.89 | 1.00 | 0.58 | 1.12 | clamped; duplicate dock posts removed |
| yar_boat_row | 12 | 1.70 | 1.70 | 0.85 | 0.85 | 0.85 | 1.81 | 1 |  |
| hgpd_post | 2 | 0.80 | 0.80 | 0.84 | 0.84 | 0.84 | 0.49 | 1 |  |
| monk | 1 | 1.00 | 1.00 | 0.84 | 0.84 | 0.84 | 0.28 | 1 |  |
| art_wm_boat | 13 | 1.30 | 1.30 | 0.81 | 0.81 | 0.81 | 1.20 | 1 | beached boats raised from 0.62 to 0.81 high (same class as the party boat 0.85) |
| fisher | 1 | 1.00 | 1.00 | 0.80 | 0.80 | 0.80 | 0.40 | 1 |  |
| hgpd_bell | 1 | 1.00 | 1.00 | 0.75 | 0.75 | 0.75 | 0.83 | 1 |  |
| hgpd_teal | 2 | 0.80 | 1.20 | 0.44 | 0.66 | 0.66 | 0.59 | 1.5 |  |
| art_wm_web | 31 | 1.00 | 1.00 | 0.60 | 0.60 | 0.60 | 0.85 | 1 |  |
| hgpd_tools | 3 | 0.80 | 0.90 | 0.56 | 0.59 | 0.63 | 0.69 | 1.13 |  |
| hgpd_board | 7 | 0.90 | 0.90 | 0.54 | 0.54 | 0.54 | 0.69 | 1 |  |
| art_hgxprop12 | 24 | 1.32 | 1.70 | 0.45 | 0.51 | 0.58 | 0.63 | 1.29 |  |
| art_wm_skeleton | 11 | 1.00 | 1.00 | 0.50 | 0.50 | 0.50 | 0.62 | 1 |  |
| hgpd_hook | 4 | 0.90 | 1.00 | 0.45 | 0.50 | 0.50 | 0.28 | 1.11 |  |
| hgpd_cage | 1 | 1.00 | 1.00 | 0.50 | 0.50 | 0.50 | 0.28 | 1 |  |
| hgpd_skel | 10 | 1.00 | 1.00 | 0.50 | 0.50 | 0.50 | 0.62 | 1 |  |
| hgpd_cart | 1 | 1.00 | 1.00 | 0.50 | 0.50 | 0.50 | 0.61 | 1 |  |
| hgpd_barrel | 6 | 0.80 | 0.90 | 0.46 | 0.49 | 0.52 | 0.41 | 1.13 |  |
| brazier | 8 | 0.70 | 0.70 | 0.49 | 0.49 | 0.49 | 0.49 | 1 |  |
| chest | 8 | 1.00 | 1.00 | 0.48 | 0.48 | 0.48 | 0.58 | 1 |  |
| hgpd_coral | 3 | 1.00 | 1.20 | 0.40 | 0.48 | 0.48 | 0.53 | 1.2 |  |
| hgpd_root | 3 | 1.40 | 1.40 | 0.48 | 0.48 | 0.48 | 0.52 | 1 |  |
| hgpd_stone | 3 | 0.60 | 1.10 | 0.28 | 0.47 | 0.51 | 0.75 | 1.83 |  |
| art_wm_barrel | 8 | 0.80 | 0.88 | 0.46 | 0.46 | 0.51 | 0.40 | 1.1 | clamped to 10% of median |
| art_wm_crate_lid | 8 | 1.00 | 1.00 | 0.46 | 0.46 | 0.46 | 0.51 | 1 | clamped |
| hgpd_rune | 9 | 0.70 | 0.70 | 0.45 | 0.45 | 0.45 | 0.37 | 1 |  |
| hgpd_cairn | 8 | 0.50 | 1.10 | 0.25 | 0.45 | 0.55 | 0.58 | 2.2 |  |
| hgpd_lid | 4 | 0.90 | 0.95 | 0.41 | 0.44 | 0.44 | 0.48 | 1.06 |  |
| hgpd_crate | 10 | 0.80 | 0.95 | 0.40 | 0.42 | 0.47 | 0.51 | 1.19 |  |
| art_hgxprop13 | 10 | 1.22 | 1.70 | 0.36 | 0.41 | 0.51 | 0.72 | 1.39 |  |
| art_wm_crate | 21 | 0.75 | 0.95 | 0.38 | 0.40 | 0.47 | 0.51 | 1.27 | scale clamped to within 10% of median |
| art_hgxrock6 | 20 | 1.14 | 1.46 | 0.34 | 0.40 | 0.43 | 0.96 | 1.28 |  |
| art_dbones | 4 | 1.20 | 1.43 | 0.36 | 0.39 | 0.43 | 0.68 | 1.19 |  |
| hgpd_tooth | 4 | 1.30 | 1.80 | 0.39 | 0.39 | 0.54 | 0.86 | 1.38 |  |
| art_wm_cage_lantern | 15 | 0.75 | 0.75 | 0.38 | 0.38 | 0.38 | 0.21 | 1 |  |
| art_hgxrock0 | 6 | 0.80 | 0.80 | 0.37 | 0.37 | 0.37 | 0.54 | 1 |  |
| hgpd_keg | 12 | 0.90 | 1.00 | 0.36 | 0.36 | 0.40 | 0.34 | 1.11 |  |
| hgpd_rubble | 5 | 1.10 | 1.40 | 0.33 | 0.36 | 0.42 | 0.93 | 1.27 |  |
| hgpd_bones | 7 | 1.40 | 1.50 | 0.36 | 0.36 | 0.38 | 0.71 | 1.07 |  |
| art_hgxprop0 | 23 | 1.20 | 1.68 | 0.31 | 0.34 | 0.43 | 0.79 | 1.4 |  |
| art_hgxprop1 | 5 | 1.30 | 1.30 | 0.33 | 0.33 | 0.33 | 0.42 | 1 |  |
| art_hgxprop6 | 3 | 1.30 | 1.30 | 0.33 | 0.33 | 0.33 | 0.45 | 1 |  |
| art_wm_bucket | 23 | 0.90 | 1.00 | 0.32 | 0.32 | 0.36 | 0.32 | 1.11 | clamped to 10% of median |
| hgpd_bucket | 11 | 0.90 | 1.00 | 0.32 | 0.32 | 0.36 | 0.32 | 1.11 |  |
| hgpd_straw | 8 | 1.10 | 1.20 | 0.28 | 0.30 | 0.30 | 0.48 | 1.09 |  |
| hgpd_shells | 4 | 1.00 | 1.30 | 0.22 | 0.29 | 0.29 | 0.41 | 1.3 |  |
| art_hgxrock3 | 6 | 1.00 | 1.44 | 0.21 | 0.26 | 0.31 | 0.74 | 1.44 |  |
| hgpd_lantern | 6 | 1.00 | 1.30 | 0.20 | 0.26 | 0.26 | 0.51 | 1.3 |  |
| art_hgxprop2 | 16 | 1.00 | 1.15 | 0.21 | 0.24 | 0.24 | 0.26 | 1.15 |  |
| hgpd_candle | 16 | 0.80 | 1.10 | 0.19 | 0.24 | 0.26 | 0.28 | 1.38 |  |
| hgpd_book | 12 | 1.15 | 1.15 | 0.23 | 0.23 | 0.23 | 0.62 | 1 |  |
| hgpd_gold | 1 | 1.00 | 1.00 | 0.20 | 0.20 | 0.20 | 0.32 | 1 |  |

Creatures (drawn height after the engine fit; FIT_MAX 0.8): the ordinary slimes, horrors, sea creatures and swimmers are all fitted to 0.8, a hero. The ten demon bosses are 1.1 to 1.5 high (taller than a hero, as bosses should be). Before: the Toothed Leviathan, the Kraken Horror and the Black Slime Serpent were squeezed to 0.8 high, the size of a hero, although they are sea monsters. After: the three are allowed full size, 1.5, 1.8 and 1.4 high (about twice a hero). The Black Swill is 1.74 high and 3.5 wide, unchanged.

Dread statues (hgd_dark.js) are 1.4 to 1.7 high against a hero 0.8: clearly larger than a person. New statues in the chapel and on the waiting rock are 1.25 (monk) and 1.19 (girl, about 1.5 of the picture height by NPC_H 1.25 times 0.95).

Ladders are wall tiles (full wall height); the party boat is 1.81 wide by 0.85 high (a boat for four heroes).