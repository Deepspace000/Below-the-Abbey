# North zone notes (Deeper Hollow, precincts 1 to 12, level 475), round 2

Fixed (all in src/desert/hgd_polish_a.js, tools in tools/polish/north_*.py|js):
- Stone Warrens and all four biomes: 698 real coloured lights with matching props (teal/violet crystals, fungus, violet braziers in the Warrens; garden lamps and glow mushrooms in the hedge; honey lamps and cages in the honeycomb; pearl lamps in the shells). A light at every junction, and no corridor square further than 5 steps (Warrens) or 7 to 8 (others) from a light. Mean view luminance in the Warrens 40 to 56 (hedge 44 to 56, honeycomb 51 to 61), same sample cells lights on/off (north_lum.py).
- Odd flat floor patches (the "hard-edged pool" rectangles were lone grass or pool floor tiles): smoothed, dead ends and the square before them use the biome floor.
- hg_house2 (bare white tower) swapped for hg_house0/1. Boss sizes: Mother Silk and Lantern King 1.9 high, mini boss orbs 1.7 to 1.8, guard 1.0, bug 1.0, worm 0.95, jelly 0.95.
- Tally Wall: blank signpost removed, note is a carved line with the text, candle table and chair added. No blank signboards are placed by this file any more.
- Notes: 96 notes in the zone, all different (0 duplicates, 0 blank, 0 em dashes), 60 new dead end lines, each at its own height. Vignette and dead end notes use d.text, the others d.pbt, so the signage pass can pick a board that fits.
- Twelve vignettes each with their own props, light colour and note (no two share two props). Cold Camp has a bedroll, cold fire and a slumped skeleton; Unfinished Arch has an arch; Ribbon Corner a ribbon pole; Drone's Vigil a wax candle knight; skull and crown banner removed.
- Dead ends dressed with biome kits that never repeat in a row; reed and plant clumps thinned (identical clusters 179 to 28).

SCALE scheme (engine): decor height in squares = NPC_H[k] * d.sc, walls are 2.7 (ceilH), villager 0.9 to 0.98. Table: door/gate 1.15, house 2.2, statue 1.3 to 1.5, plinth 0.65, lamp 1.3 to 1.5, chest 0.38 to 0.48, bench/table/crate 0.45 to 0.6, trees 1.6/2.0/2.4/2.7, shell flowers 1.1 to 1.3, vines 1.5 to 1.9, reeds 0.6 to 0.9.

Still weak / not mine: town zones inside this area are rescaled later by hgd_polish_c (trees 2.5 to 3.5, frog people up to 1.6 in the audit), the wall note picture itself is replaced by hgd_polish_signs, 66 asset 404s are another agent's. Three dead ends (27,141; 193,159; 63,165) still read as bare by the audit metric. Frame rate cannot be judged under software GL.
