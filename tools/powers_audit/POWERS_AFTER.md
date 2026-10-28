# Character powers: before and after the retune

Files: `src/desert/powers_scaling.js` (all numbers; last before `jump_ready.js` in `tools/inject.py`), harness in `tools/powers_audit/` (`audit.js`, `run_audit.py`, `fight.js`, `run_fight.py`, `analyse.py`, `report.py`, `shots.py`). Old numbers: `POWERS_BEFORE.md`. Re-run: start `python -m http.server 8357` in the repo root, then `python tools/powers_audit/run_audit.py after 3`, `python tools/powers_audit/run_fight.py after`, `python tools/powers_audit/report.py`.

## The rule in plain words

Inside one class, a later power must hit harder **and** cost more than an earlier power of the same kind, and each point of cost must buy about the same damage all along the line (within 20 percent), so a stronger power is neither a bargain nor a trap. Kinds ("lines") are: single-target damage, area damage, offensive buffs, defensive buffs, control of one foe, control of an area. Healing is left to `heal_scaling.js`, and the mage and sorcerer scroll "Spell" is the scroll in hand.

Each class has one number **E**: how many "usual blows" of damage one point of cost buys with a single-target power. A **usual blow U** is the hero's own average hit: for a fighter the weapon's average damage plus the strength bonus and rings, times the damage bonuses from passives and the chance of a double hit; for a mage or sorcerer (intelligence bonus + the staff's magic + 8) times the spell bonuses. So a power grows with the weapon, the stat and the gear exactly as the creatures grow with the place.

    damage of a use = cost x e x U x g          e = E x 0.75 x (1 - 0.15 x (unlock level - 1) / 79)          g = (1 + 0.002 x (level - unlock level)) x (1 + 0.002 x level)

An area power does 0.4 of that to **each** foe (about 1.2 times a single power when three are close). Bleed, poison and burn are part of the same total, spread over their rounds. E per class (usual blows per point of cost, before the two corrections): Warrior 0.31, Barbarian 0.30, Paladin 0.25, Ranger 0.35, Archer 0.36, Thief 0.38, Assassin 0.33, Mage 0.20, Sorcerer 0.20, Priest 0.20, Monk 0.40, Goat 0.36. They were taken from what each class's own powers did before, so the class balance is kept. The first bracket of g pays each level of mastery above the unlock, the second makes every power a little stronger as the hero grows, beyond the weapon and the stats (the best weapons stop at level 70, so without it the top powers would stop growing). The factor 0.75 and the taper of 0.15 were set from the fight simulations below (see the balance section). Costs are fixed numbers that rise with the unlock level and never change with the caster level, so an early power stays cheap and simply matters less and less as the heroes grow (a cheap power is still usable, it is just a smaller blow). Each card now says the real number for the hero it is shown for, for example "About 612 damage for Sigrid at level 40." (checked against the measured average: zero mismatches).

## Results

**12 classes, 121 active powers measured before (121 class powers and spells, all passives excluded), 144 after (23 added).** Flags before: 314. Flags after: 0.

| rule | flags before | flags after |
|---|---|---|
| bargain | 142 | 0 |
| description-mismatch | 7 | 0 |
| ladder-ends-early | 12 | 0 |
| later-power-not-dearer | 20 | 0 |
| later-power-weaker | 17 | 0 |
| no-level-scaling | 1 | 0 |
| trap | 115 | 0 |

Rules checked at every level 1, 10, ..., 80: `later-power-weaker` (a later power of the same line does less than an earlier one, beyond a 5 percent sampling margin), `later-power-not-dearer` (a later power costs the same or less), `bargain` and `trap` (damage per cost more than 20 percent above or below the line average), `no-level-scaling` (damage does not rise with the level, or falls), `ladder-ends-early` (no damage power at level 80 or later), `description-mismatch` (card number differs from the measured average), `cost-mismatch` (the resource really deducted differs from the cost on the card or is not deducted exactly once), `short-resource-bug` (a power was used, or charged, with too little resource).

Costs: every use deducted exactly the card cost, once (also for area powers and multi-hit powers), at all nine levels; with one point less than the cost the use was refused and nothing was deducted. There are no cooldowns in the game to test: powers can be used every round until the resource runs out.

## Remaining flags after the retune

Counts: 


## Before and after, class by class

Each cell is `before > after` for the average damage of one use at the hero level in the column header (area powers: damage to **each** foe; damage over time is included). `-` means not unlocked (or not a damage power). Costs are `before > after`. New powers are marked **new**.


### Warrior (Stamina)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 20 | Shield Wall | buff (defence) | 14 > 12 | 160 > 160 | 160 > 160 | 160 > 160 | 160 > 160 | - |
| 50 | Shield Wall | buff (defence) | 9 > 18 | - > - | - > - | 128 > 320 | 128 > 320 | - |
| 30 | Battle Cry | buff (offence) | 9 > 9 | - > - | 8 > 8 | 8 > 8 | 8 > 8 | - |
| 40 | Battle Standard | buff (offence) | 23 > 14 | - > - | 12 > 12 | 12 > 12 | 12 > 12 | - |
| 10 | Intimidating Shout | control (area) | 9 > 9 | 30 > 30 | 30 > 30 | 30 > 30 | 30 > 30 | - |
| 50 | Warlord's Challenge | control (area) | 27 > 27 | - > - | - > - | 60 > 60 | 60 > 60 | - |
| 1 | Power Strike | single | 6 > 6 | 140 > 112 | 456 > 391 | 621 > 562 | 978 > 936 | 156 |
| 20 | Cleave | single | 8 > 8 | 166 > 139 | 545 > 483 | 742 > 697 | 1170 > 1162 | 145 |
| 30 | Hamstring | single | 18 > 11 | - > - | 117 > 642 | 153 > 920 | 183 > 1539 | 140 |
| 50 | Skullsplitter **new** | single | new > 14 | new > - | new > - | new > 1085 | new > 1812 | 129 |
| 70 | Titan's Fury | single | 15 > 17 | - > - | - > - | - > - | 1955 > 2029 | 119 |
| 80 | Worldsplitter **new** | single | new > 22 | new > - | new > - | new > - | new > 2518 | 114 |

### Barbarian (Stamina)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 20 | Bloodlust | buff (offence) | 6 > 6 | 2 > 2 | 2 > 2 | 2 > 2 | 2 > 2 | - |
| 30 | Blood Frenzy | buff (offence) | 18 > 12 | - > - | 4 > 4 | 4 > 4 | 4 > 4 | - |
| 50 | Avatar of the Bear | buff (offence) | 27 > 21 | - > - | - > - | 8 > 8 | 8 > 8 | - |
| 10 | Savage Roar | control (area) | 9 > 9 | 48 > 48 | 48 > 48 | 48 > 48 | 48 > 48 | - |
| 40 | Thunderous Roar | control (area) | 9 > 13 | - > - | 3 > 72 | 3 > 72 | 3 > 72 | - |
| 40 | Earthshatter | area | 23 > 10 | - > - | 104 > 286 | 137 > 358 | 170 > 653 | 196 |
| 60 | Whirlwind | area | 11 > 13 | - > - | - > - | 496 > 429 | 854 > 784 | 181 |
| 1 | Rage Blow | single | 8 > 8 | 171 > 154 | 700 > 667 | 826 > 831 | 1424 > 1513 | 189 |
| 20 | Rend | single | 14 > 10 | 98 > 180 | 141 > 775 | 184 > 965 | 219 > 1762 | 176 |
| 50 | Skull Cleaver **new** | single | new > 14 | new > - | new > - | new > 1204 | new > 2198 | 157 |
| 70 | Avatar of Ruin | single | 18 > 19 | - > - | - > - | - > - | 2849 > 2750 | 145 |
| 80 | Mountain's Wrath **new** | single | new > 26 | new > - | new > - | new > - | new > 3610 | 139 |

### Paladin (Mana)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 40 | Divine Shield | buff (defence) | 9 > 9 | - > - | 160 > 160 | 160 > 160 | 160 > 160 | - |
| 30 | Aura of Courage | buff (offence) | 18 > 18 | - > - | 10 > 10 | 10 > 10 | 10 > 10 | - |
| 50 | Avenging Angel | buff (offence) | 36 > 36 | - > - | - > - | 13 > 13 | 13 > 13 | - |
| 40 | Smite Evil | area | 23 > 11 | - > - | 99 > 155 | 130 > 254 | 161 > 410 | 112 |
| 60 | Holy Wrath | area | 12 > 14 | - > - | - > - | 24 > 299 | 27 > 482 | 103 |
| 1 | Smite | single | 6 > 6 | 71 > 71 | 221 > 247 | 340 > 402 | 516 > 647 | 108 |
| 20 | Holy Chains | single | 14 > 9 | 45 > 99 | 67 > 343 | 90 > 563 | 112 > 906 | 101 |
| 50 | Righteous Blow **new** | single | new > 13 | new > - | new > - | new > 723 | new > 1166 | 90 |
| 70 | Judgment | single | 15 > 16 | - > - | - > - | - > - | 1549 > 1322 | 83 |
| 80 | Sunbrand **new** | single | new > 22 | new > - | new > - | new > - | new > 1745 | 79 |

### Ranger (Stamina)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 20 | Bark Skin | buff (defence) | 14 > 14 | 240 > 240 | 240 > 240 | 240 > 240 | 240 > 240 | - |
| 60 | Hunter's Mark | buff (offence) | 8 > 8 | - > - | - > - | 4 > 4 | 4 > 4 | - |
| 10 | Entangling Roots | control (area) | 9 > 9 | 27 > 27 | 27 > 27 | 27 > 27 | 27 > 27 | - |
| 40 | Swarm of Wasps | area | 23 > 9 | - > - | 36 > 228 | 48 > 324 | 54 > 486 | 162 |
| 50 | Wrath of the Forest | area | 27 > 12 | - > - | - > - | 158 > 414 | 195 > 623 | 156 |
| 70 | Arrow Storm | area | 15 > 15 | - > - | - > - | - > - | 843 > 718 | 144 |
| 1 | Aimed Shot | single | 5 > 5 | 118 > 92 | 440 > 365 | 593 > 521 | 843 > 782 | 156 |
| 20 | Pinning Shot | single | 6 > 7 | 89 > 120 | 330 > 477 | 445 > 679 | 632 > 1021 | 146 |
| 30 | Poison Arrow | single | 18 > 9 | - > - | 159 > 592 | 207 > 838 | 246 > 1264 | 140 |
| 40 | Rapid Fire | single | 9 > 11 | - > - | 660 > 691 | 889 > 988 | 1265 > 1485 | 135 |
| 60 | Heartseeker **new** | single | new > 15 | new > - | new > - | new > 1241 | new > 1871 | 125 |
| 80 | Killing Shot **new** | single | new > 21 | new > - | new > - | new > - | new > 2411 | 115 |

### Archer (Stamina)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 30 | Rain of Arrows | area | 18 > 10 | - > - | 92 > 301 | 121 > 428 | 150 > 731 | 219 |
| 60 | Arrow Rain | area | 12 > 13 | - > - | - > - | 510 > 493 | 823 > 845 | 195 |
| 1 | Volley | single | 6 > 6 | 132 > 126 | 506 > 506 | 679 > 716 | 1096 > 1221 | 204 |
| 10 | Flaming Arrow | single | 9 > 7 | 79 > 142 | 113 > 570 | 146 > 811 | 175 > 1381 | 197 |
| 20 | Piercing Shot | single | 6 > 9 | 166 > 175 | 632 > 705 | 849 > 1001 | 1371 > 1708 | 190 |
| 20 | Pinning Shot | single | 14 > 11 | 55 > 213 | 80 > 862 | 106 > 1224 | 131 > 2088 | 190 |
| 40 | Triple Shot | single | 9 > 13 | - > - | 760 > 942 | 1018 > 1339 | 1644 > 2285 | 176 |
| 40 | Cursed Arrow | single | 23 > 15 | - > - | 158 > 1081 | 206 > 1547 | 245 > 2634 | 176 |
| 50 | Dragonbone Arrow | single | 27 > 17 | - > - | - > - | 286 > 1680 | 352 > 2873 | 169 |
| 70 | Perfect Shot | single | 15 > 20 | - > - | - > - | - > - | 3288 > 3117 | 156 |
| 80 | Starfall Shot **new** | single | new > 25 | new > - | new > - | new > - | new > 3736 | 149 |

### Thief (Stamina)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 20 | Smoke Bomb | control (area) | 6 > 6 | 3 > 3 | 3 > 3 | 3 > 3 | 3 > 3 | - |
| 20 | Smoke Bomb | control (area) | 14 > 14 | 22 > 22 | 22 > 22 | 22 > 22 | 22 > 22 | - |
| 40 | Befuddle | control (area) | 23 > 23 | - > - | 36 > 36 | 36 > 36 | 36 > 36 | - |
| 1 | Twin Stab | single | 5 > 5 | 82 > 74 | 368 > 345 | 389 > 387 | 1006 > 1059 | 212 |
| 30 | Venom Blade | single | 18 > 8 | - > - | 145 > 498 | 190 > 552 | 226 > 1516 | 190 |
| 40 | Flurry | single | 8 > 10 | - > - | 553 > 594 | 584 > 667 | 1509 > 1828 | 183 |
| 60 | Death Mark | single | 9 > 13 | - > - | - > - | 679 > 797 | 1761 > 2194 | 169 |
| 70 | Shadowstrike **new** | single | new > 17 | new > - | new > - | new > - | new > 2753 | 162 |
| 80 | Moonless Kill **new** | single | new > 22 | new > - | new > - | new > - | new > 3417 | 155 |
| 10 | Pickpocket | special | 9 > 9 | - > - | - > - | - > - | - > - | - |
| 50 | Master Heist | special | 27 > 27 | - > - | - > - | - > - | - > - | - |

### Assassin (Stamina)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 20 | Vanish | buff (offence) | 6 > 6 | 3 > 3 | 3 > 3 | 3 > 3 | 3 > 3 | - |
| 20 | Marked for Death | control (one foe) | 14 > 14 | 28 > 28 | 28 > 28 | 28 > 28 | 28 > 28 | - |
| 30 | Night Terror | control (area) | 18 > 18 | - > - | 38 > 38 | 38 > 38 | 38 > 38 | - |
| 40 | Poison Cloud | area | 23 > 11 | - > - | 144 > 243 | 185 > 269 | 219 > 815 | 222 |
| 1 | Backstab | single | 5 > 5 | 80 > 59 | 419 > 326 | 437 > 359 | 1240 > 1075 | 215 |
| 10 | Garrote | single | 9 > 7 | 102 > 80 | 143 > 441 | 184 > 483 | 214 > 1458 | 208 |
| 40 | Nerve Strike | single | 8 > 9 | - > - | 419 > 504 | 437 > 557 | 1240 > 1671 | 186 |
| 50 | Death Warrant | single | 27 > 11 | - > - | - > - | 316 > 654 | 389 > 1963 | 178 |
| 60 | Assassinate | single | 11 > 14 | - > - | - > - | 874 > 799 | 2481 > 2400 | 171 |
| 70 | Needle in the Dark **new** | single | new > 18 | new > - | new > - | new > - | new > 2962 | 165 |
| 80 | Reaper's Kiss **new** | single | new > 23 | new > - | new > - | new > - | new > 3629 | 158 |

### Mage (Mana)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 20 | Mage Armor | buff (defence) | 6 > 6 | 96 > 96 | 96 > 96 | 96 > 96 | 96 > 96 | - |
| 30 | Mirror Images | buff (defence) | 18 > 18 | - > - | 320 > 320 | 320 > 320 | 320 > 320 | - |
| 10 | Hold Person | control (one foe) | 9 > 9 | 15 > 15 | 15 > 15 | 15 > 15 | 15 > 15 | - |
| 20 | Polymorph: Sheep | control (one foe) | 14 > 14 | 28 > 28 | 28 > 28 | 28 > 28 | 28 > 28 | - |
| 50 | Time Stop | control (area) | 27 > 27 | - > - | - > - | 27 > 27 | 27 > 27 | - |
| 40 | Fireball | area | 12 > 12 | - > - | 104 > 81 | 135 > 113 | 255 > 232 | 58 |
| 60 | Chain Lightning | area | 14 > 15 | - > - | - > - | 132 > 129 | 251 > 266 | 53 |
| 70 | Meteor | area | 21 > 21 | - > - | - > - | - > - | 287 > 359 | 51 |
| 80 | Starfall **new** | area | new > 28 | new > - | new > - | new > - | new > 458 | 49 |
| 30 | Arcane Lance | single | 24 > 10 | - > - | 85 > 174 | 135 > 242 | 213 > 500 | 50 |
| 40 | Disintegrate | single | 23 > 13 | - > - | 349 > 217 | 544 > 302 | 848 > 625 | 48 |
| 60 | Arcane Ruin **new** | single | new > 17 | new > - | new > - | new > 365 | new > 755 | 44 |
| 1 | Spell | special | 0 > 0 | - > - | - > - | - > - | - > - | - |

### Sorcerer (Mana)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 20 | Polymorph: Cow | control (one foe) | 14 > 14 | 28 > 28 | 28 > 28 | 28 > 28 | 28 > 28 | - |
| 10 | Wail of Fear | control (area) | 9 > 9 | 38 > 38 | 38 > 38 | 38 > 38 | 38 > 38 | - |
| 30 | Chain Lightning | area | 24 > 9 | - > - | 86 > 68 | 139 > 96 | 215 > 196 | 65 |
| 40 | Frost Nova | area | 11 > 11 | - > - | 103 > 80 | 137 > 112 | 262 > 230 | 63 |
| 40 | Dragon's Breath | area | 23 > 13 | - > - | 199 > 96 | 301 > 133 | 438 > 270 | 62 |
| 60 | Lightning Storm | area | 15 > 16 | - > - | - > - | 153 > 152 | 283 > 310 | 58 |
| 70 | Cataclysm | area | 23 > 22 | - > - | - > - | - > - | 326 > 408 | 56 |
| 20 | Siphon | single | 6 > 7 | 54 > 62 | 107 > 136 | 142 > 195 | 269 > 396 | 57 |
| 60 | Soul Rend **new** | single | new > 15 | new > - | new > - | new > 354 | new > 725 | 48 |
| 80 | Annihilating Ray **new** | single | new > 22 | new > - | new > - | new > - | new > 978 | 44 |
| 1 | Spell | special | 0 > 0 | - > - | - > - | - > - | - > - | - |
| 30 | Wild Surge | special | 18 > 18 | - > - | - > - | - > - | - > - | - |
| 50 | Rift of Banishing | special | 27 > 27 | - > - | - > - | - > - | - > - | - |

### Priest (Mana)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 30 | Sanctuary Ward | buff (defence) | 18 > 18 | - > - | 400 > 400 | 400 > 400 | 400 > 400 | - |
| 20 | Blessing | buff (offence) | 8 > 8 | 6 > 6 | 6 > 6 | 6 > 6 | 6 > 6 | - |
| 30 | Smiting Light | area | 24 > 9 | - > - | 62 > 114 | 82 > 162 | 103 > 173 | 58 |
| 40 | Divine Wrath | area | 23 > 12 | - > - | 114 > 146 | 151 > 208 | 187 > 222 | 56 |
| 50 | Hallowed Fire **new** | area | new > 15 | new > - | new > - | new > 250 | new > 267 | 53 |
| 80 | Dawn of Judgement **new** | area | new > 24 | new > - | new > - | new > - | new > 377 | 47 |
| 65 | Sunlance **new** | single | new > 14 | new > - | new > - | new > - | new > 585 | 42 |
| 20 | Turn Undead | special | 14 > 14 | - > - | - > - | - > - | - > - | - |

### Monk (Stamina)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 10 | Pressure Point | control (one foe) | 9 > 9 | 12 > 12 | 12 > 12 | 12 > 12 | 12 > 12 | - |
| 40 | Mantra of Peace | control (area) | 23 > 23 | - > - | 30 > 30 | 30 > 30 | 30 > 30 | - |
| 50 | Thousand Fists | area | 27 > 12 | - > - | - > - | 585 > 560 | 725 > 850 | 212 |
| 1 | Palm Strike | single | 5 > 5 | 65 > 63 | 421 > 432 | 650 > 706 | 931 > 1066 | 213 |
| 20 | Flurry of Blows | single | 6 > 7 | 98 > 82 | 631 > 562 | 977 > 920 | 1396 > 1389 | 198 |
| 30 | Quivering Palm | single | 18 > 9 | - > - | 151 > 696 | 196 > 1139 | 234 > 1721 | 191 |
| 40 | Stunning Fist | single | 8 > 11 | - > - | 526 > 815 | 814 > 1337 | 1164 > 2024 | 184 |
| 60 | Dragon Kick | single | 11 > 13 | - > - | - > - | 1302 > 1458 | 1863 > 2210 | 170 |
| 70 | Fist of the Mountain **new** | single | new > 16 | new > - | new > - | new > - | new > 2610 | 163 |
| 80 | Hundred-Fold Palm **new** | single | new > 20 | new > - | new > - | new > - | new > 3129 | 156 |

### Goat (Stamina)

| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |
|---|---|---|---|---|---|---|---|---|
| 30 | Polymorph: Goat | control (one foe) | 18 > 18 | - > - | 28 > 28 | 28 > 28 | 28 > 28 | - |
| 10 | Bleat of Doom | control (area) | 9 > 9 | 30 > 30 | 30 > 30 | 30 > 30 | 30 > 30 | - |
| 50 | Great Stampede | area | 27 > 13 | - > - | - > - | 188 > 489 | 233 > 726 | 168 |
| 1 | Headbutt | single | 5 > 5 | 14 > 113 | 20 > 399 | 26 > 568 | 32 > 841 | 168 |
| 30 | Charge | single | 8 > 8 | - > - | 647 > 570 | 873 > 814 | 1225 > 1208 | 151 |
| 40 | Mountain Charge | single | 23 > 10 | - > - | 134 > 685 | 176 > 978 | 218 > 1452 | 145 |
| 60 | Rampage | single | 11 > 12 | - > - | - > - | 1133 > 1082 | 1594 > 1611 | 134 |
| 70 | Legend of the Mountain | single | 15 > 16 | - > - | - > - | - > - | 2041 > 2060 | 129 |
| 80 | Avalanche of Horns **new** | single | new > 22 | new > - | new > - | new > - | new > 2716 | 123 |

## New powers

Learned the way the class powers are: automatically at the unlock level (they stand in the ladder by level). The Barbarian roar of level 40 was a one-round stun and is now a real roar. Saved selections of the Special power are moved to follow the new order (flag `powOrder`, saved with the game).

| class | new power | unlock | cost | line | what the card says at level 80 |
|---|---|---|---|---|---|
| Warrior | Skullsplitter | 50 | 14 stamina | single target | A downward blow aimed at the helm. About 1813 damage for Tester at level 80. |
| Warrior | Worldsplitter | 80 | 22 stamina | single target | A blow that cracks the ground under the foe. About 2519 damage for Tester at level 80. |
| Barbarian | Thunderous Roar | 40 | 13 stamina | control (area) | A roar that shakes dust from the roof: every foe within 3 squares flees for 6 rounds and fights weaker for 6. |
| Barbarian | Skull Cleaver | 50 | 14 stamina | single target | One chop, then the foe sits down. About 2198 damage for Tester at level 80. |
| Barbarian | Mountain's Wrath | 80 | 26 stamina | single target | A roar, a leap and a blow like a landslide. About 3610 damage for Tester at level 80. |
| Paladin | Righteous Blow | 50 | 13 mana | single target | A blow that rings like a bell, doubled against skeletons. About 1166 damage for Tester at level 80. |
| Paladin | Sunbrand | 80 | 22 mana | single target | The blade burns white. Doubled against skeletons. About 1744 damage for Tester at level 80. |
| Ranger | Heartseeker | 60 | 15 stamina | single target | One arrow, loosed after a long breath, up to 4 tiles away. About 1871 damage for Tester at level 80. |
| Ranger | Killing Shot | 80 | 21 stamina | single target | The shot the old hunters talk about, up to 5 tiles away. About 2411 damage for Tester at level 80. |
| Archer | Starfall Shot | 80 | 25 stamina | single target | An arrow that comes down out of a clear sky, up to 5 tiles away. About 3736 damage for Tester at level 80. |
| Thief | Shadowstrike | 70 | 17 stamina | single target | Out of the dark and into the ribs. About 2753 damage for Tester at level 80. |
| Thief | Moonless Kill | 80 | 22 stamina | single target | The blow nobody sees. About 3417 damage for Tester at level 80. |
| Assassin | Needle in the Dark | 70 | 18 stamina | single target | A thin blade, a thick shadow, a quiet end. About 2962 damage for Tester at level 80. |
| Assassin | Reaper's Kiss | 80 | 23 stamina | single target | The last thing the foe ever feels. About 3629 damage for Tester at level 80. |
| Mage | Arcane Ruin | 60 | 17 mana | single target | The weave unravels around the foe ahead, which then takes more from the next blows. About 755 damage for Tester at level 80. |
| Mage | Starfall | 80 | 28 mana | area | The stars themselves come down on every foe within 4 squares. About 458 damage to each foe in reach for Tester at level 80. |
| Sorcerer | Soul Rend | 60 | 15 mana | single target | The foe ahead is torn along its seams and hits weaker for 4 rounds. About 725 damage for Tester at level 80. |
| Sorcerer | Annihilating Ray | 80 | 22 mana | single target | A ray of raw ruin through the foe ahead. About 978 damage for Tester at level 80. |
| Priest | Hallowed Fire | 50 | 15 mana | area | Cold white fire on every foe within 3 squares, and it curses them. About 267 damage to each foe in reach for Tester at level 80. |
| Priest | Sunlance | 65 | 14 mana | single target | A spear of daylight through the foe ahead. About 585 damage for Tester at level 80. |
| Priest | Dawn of Judgement | 80 | 24 mana | area | The sun comes up inside the crypt. Every foe within 4 squares is struck and cursed. About 377 damage to each foe in reach for Tester at level 80. |
| Monk | Fist of the Mountain | 70 | 16 stamina | single target | Stillness, then a single blow with the weight of the mountain. About 2610 damage for Tester at level 80. |
| Monk | Hundred-Fold Palm | 80 | 20 stamina | single target | A hundred strikes in the space of one breath. About 3129 damage for Tester at level 80. |
| Goat | Avalanche of Horns | 80 | 22 stamina | single target | Everything the goat has, all at once. About 2716 damage for Tester at level 80. |

24 new powers.

## Balance: rounds to kill

**Smooth check (no dice).** For each party the real `heroAttack` and `heroSpecial` are tried once against the line of foes, the best affordable use is taken every round until the stamina or mana is gone, and the rounds to kill are counted (a fraction of a round at the end). Before = the numbers of v3.682, after = this retune.

| party | level | 1 foe: before > after | 3 foes: before > after | 6 foes: before > after |
|---|---|---|---|---|
| Warrior/Thief/Mage/Priest | 10 | 11.3 > 12.4 (+10%) | 33.7 > 34.6 (+3%) | 69.6 > 70.5 (+1%) |
| Warrior/Thief/Mage/Priest | 20 | 7.6 > 8.5 (+13%) | 31.0 > 32.0 (+3%) | 66.2 > 67.1 (+1%) |
| Warrior/Thief/Mage/Priest | 30 | 2.6 > 2.8 (+10%) | 8.7 > 10.3 (+18%) | 21.9 > 24.6 (+12%) |
| Warrior/Thief/Mage/Priest | 40 | 2.3 > 2.4 (+5%) | 6.0 > 7.4 (+24%) | 20.0 > 22.5 (+12%) |
| Warrior/Thief/Mage/Priest | 50 | 2.3 > 1.9 (-16%) | 5.9 > 5.8 (-2%) | 17.7 > 19.7 (+12%) |
| Warrior/Thief/Mage/Priest | 60 | 2.1 > 1.7 (-19%) | 5.6 > 4.8 (-15%) | 14.5 > 16.2 (+12%) |
| Warrior/Thief/Mage/Priest | 70 | 1.0 > 0.8 (-19%) | 2.7 > 2.2 (-19%) | 5.1 > 4.2 (-18%) |
| Warrior/Thief/Mage/Priest | 80 | 0.9 > 0.6 (-35%) | 2.4 > 1.6 (-33%) | 4.6 > 3.1 (-33%) |
| Barbarian/Archer/Sorcerer/Paladin | 10 | 8.6 > 9.8 (+15%) | 26.4 > 29.4 (+12%) | 54.7 > 60.8 (+11%) |
| Barbarian/Archer/Sorcerer/Paladin | 20 | 3.7 > 4.0 (+8%) | 18.9 > 21.6 (+14%) | 44.4 > 49.3 (+11%) |
| Barbarian/Archer/Sorcerer/Paladin | 30 | 1.8 > 1.7 (-2%) | 5.8 > 5.9 (+2%) | 15.0 > 15.8 (+5%) |
| Barbarian/Archer/Sorcerer/Paladin | 40 | 1.8 > 1.6 (-10%) | 4.8 > 4.9 (+2%) | 13.4 > 14.5 (+8%) |
| Barbarian/Archer/Sorcerer/Paladin | 50 | 1.6 > 1.1 (-31%) | 4.4 > 3.3 (-26%) | 10.2 > 9.9 (-2%) |
| Barbarian/Archer/Sorcerer/Paladin | 60 | 1.6 > 1.1 (-32%) | 3.5 > 2.9 (-18%) | 6.1 > 5.1 (-16%) |
| Barbarian/Archer/Sorcerer/Paladin | 70 | 0.6 > 0.6 (+9%) | 1.6 > 1.6 (+5%) | 3.0 > 3.0 (+1%) |
| Barbarian/Archer/Sorcerer/Paladin | 80 | 0.5 > 0.4 (-16%) | 1.3 > 1.1 (-16%) | 2.6 > 2.2 (-16%) |
| Ranger/Assassin/Monk/Goat | 10 | 7.8 > 8.5 (+8%) | 28.9 > 30.7 (+6%) | 60.5 > 64.1 (+6%) |
| Ranger/Assassin/Monk/Goat | 20 | 4.7 > 4.5 (-4%) | 21.8 > 22.6 (+4%) | 48.3 > 50.4 (+4%) |
| Ranger/Assassin/Monk/Goat | 30 | 1.4 > 1.6 (+14%) | 4.2 > 4.8 (+15%) | 11.4 > 13.6 (+19%) |
| Ranger/Assassin/Monk/Goat | 40 | 1.3 > 1.2 (-9%) | 4.0 > 3.7 (-9%) | 9.9 > 11.6 (+17%) |
| Ranger/Assassin/Monk/Goat | 50 | 1.2 > 1.1 (-12%) | 3.6 > 3.2 (-12%) | 7.4 > 8.0 (+8%) |
| Ranger/Assassin/Monk/Goat | 60 | 0.9 > 0.8 (-8%) | 2.7 > 2.5 (-8%) | 5.5 > 5.5 (+0%) |
| Ranger/Assassin/Monk/Goat | 70 | 0.5 > 0.5 (-17%) | 1.4 > 1.3 (-6%) | 2.6 > 2.5 (-4%) |
| Ranger/Assassin/Monk/Goat | 80 | 0.5 > 0.3 (-36%) | 1.3 > 1.0 (-25%) | 2.4 > 1.9 (-21%) |

All 72 cells: mean change -3.1%, shortest -36%, longest +24%; 65 cells (90%) within 25 percent either way.
At level 60 (the case the owner asked about): mean -11.7%, shortest -32%, longest +12%.

**Simulated fights (with dice).** The party fights creatures of its own level with the real `heroAttack` and `heroSpecial` (no enemy attacks: only how many rounds it takes to kill all of them). Each hero uses its highest class power it can afford (class powers only, no bought spells, no healing or buffs), otherwise a plain attack; the foe is an ordinary non-flying, non-undead creature of about 170 base health, one or three in a corridor. Averages of 8 fights (the dice make single fights vary a lot, so the smooth check above is the one to trust).

| party | level | foes | foe health | rounds before | rounds after | change |
|---|---|---|---|---|---|---|
| Warrior/Thief/Mage/Priest | 20 | 1 | 1624 | 6.75 | 7.62 | +13% |
| Warrior/Thief/Mage/Priest | 20 | 3 | 1624 | 25.25 | 26.75 | +6% |
| Warrior/Thief/Mage/Priest | 20 | 6 | 1624 | 36.00 | 30.25 | -16% |
| Warrior/Thief/Mage/Priest | 40 | 1 | 3167 | 2.75 | 2.88 | +5% |
| Warrior/Thief/Mage/Priest | 40 | 3 | 3167 | 7.62 | 8.88 | +16% |
| Warrior/Thief/Mage/Priest | 40 | 6 | 3167 | 14.88 | 16.75 | +13% |
| Warrior/Thief/Mage/Priest | 60 | 1 | 3842 | 2.75 | 2.12 | -23% |
| Warrior/Thief/Mage/Priest | 60 | 3 | 3842 | 6.88 | 6.62 | -4% |
| Warrior/Thief/Mage/Priest | 60 | 6 | 3842 | 15.00 | 16.38 | +9% |
| Warrior/Thief/Mage/Priest | 80 | 1 | 3870 | 1.00 | 1.00 | +0% |
| Warrior/Thief/Mage/Priest | 80 | 3 | 3870 | 3.38 | 3.00 | -11% |
| Warrior/Thief/Mage/Priest | 80 | 6 | 3870 | 6.38 | 6.12 | -4% |
| Barbarian/Archer/Sorcerer/Paladin | 20 | 1 | 1624 | 4.00 | 4.38 | +9% |
| Barbarian/Archer/Sorcerer/Paladin | 20 | 3 | 1624 | 15.25 | 17.00 | +11% |
| Barbarian/Archer/Sorcerer/Paladin | 20 | 6 | 1624 | 25.25 | 26.75 | +6% |
| Barbarian/Archer/Sorcerer/Paladin | 40 | 1 | 3167 | 2.00 | 2.00 | +0% |
| Barbarian/Archer/Sorcerer/Paladin | 40 | 3 | 3167 | 5.88 | 7.12 | +21% |
| Barbarian/Archer/Sorcerer/Paladin | 40 | 6 | 3167 | 12.25 | 13.75 | +12% |
| Barbarian/Archer/Sorcerer/Paladin | 60 | 1 | 3842 | 2.00 | 1.88 | -6% |
| Barbarian/Archer/Sorcerer/Paladin | 60 | 3 | 3842 | 4.88 | 4.38 | -10% |
| Barbarian/Archer/Sorcerer/Paladin | 60 | 6 | 3842 | 8.25 | 8.38 | +2% |
| Barbarian/Archer/Sorcerer/Paladin | 80 | 1 | 3870 | 1.00 | 1.00 | +0% |
| Barbarian/Archer/Sorcerer/Paladin | 80 | 3 | 3870 | 2.25 | 2.00 | -11% |
| Barbarian/Archer/Sorcerer/Paladin | 80 | 6 | 3870 | 4.00 | 4.00 | +0% |
| Ranger/Assassin/Monk/Goat | 20 | 1 | 1624 | 4.38 | 5.88 | +34% |
| Ranger/Assassin/Monk/Goat | 20 | 3 | 1624 | 17.00 | 17.62 | +4% |
| Ranger/Assassin/Monk/Goat | 20 | 6 | 1624 | 24.38 | 26.00 | +7% |
| Ranger/Assassin/Monk/Goat | 40 | 1 | 3167 | 2.00 | 2.00 | +0% |
| Ranger/Assassin/Monk/Goat | 40 | 3 | 3167 | 4.88 | 5.12 | +5% |
| Ranger/Assassin/Monk/Goat | 40 | 6 | 3167 | 9.38 | 10.62 | +13% |
| Ranger/Assassin/Monk/Goat | 60 | 1 | 3842 | 1.00 | 1.50 | +50% |
| Ranger/Assassin/Monk/Goat | 60 | 3 | 3842 | 3.25 | 3.25 | +0% |
| Ranger/Assassin/Monk/Goat | 60 | 6 | 3842 | 6.25 | 9.50 | +52% |
| Ranger/Assassin/Monk/Goat | 80 | 1 | 3870 | 1.00 | 1.00 | +0% |
| Ranger/Assassin/Monk/Goat | 80 | 3 | 3870 | 2.00 | 2.00 | +0% |
| Ranger/Assassin/Monk/Goat | 80 | 6 | 3870 | 3.50 | 3.12 | -11% |


## Balance notes

What was tried: GE 1 gave a mean change of -19 percent in rounds to kill (worst -50); TAPER .25 broke the 20 percent flatness rule; final values GE .75, TAPER .15 and a small correction CM per class. Mean change in rounds to kill is about -5 percent.

Known outliers: level 50 of the second party (-31, -26 percent) and level 80 (-35 to -16 percent, but fights there already last about one round). The flatness band at level 80 is nearly used up (worst line deviation +18.7 percent, limit 20), so TAPER cannot grow.

Final audit (3 samples per cell, all 12 classes, levels 1 to 80): 0 flags. Restoration (priest heal) moved from level 50 to level 62, after Greater Heal (level 60); heals are not part of the damage ladders.


## Screenshots

`tools/powers_audit/shots_after/NN_Class_L1.png`, `_L40.png` and `_L80.png` for each of the 12 classes: the Powers page with the whole ladder and the costs; the card of the first power shows the real number for the hero.

Icons: the class powers (the first column of ladders) have never had icons in this game (the Powers page shows "Lv N" for them), so the new martial powers have none either. The seven new spell-type powers (Arcane Ruin, Starfall, Soul Rend, Annihilating Ray, Sunlance, Hallowed Fire, Dawn of Judgement) and the new Barbarian roar borrow the painted spell picture of a nearby spell, recoloured with `pToneMap` the same way the grand spells do (`pwTintIcons` in `powers_scaling.js`).
