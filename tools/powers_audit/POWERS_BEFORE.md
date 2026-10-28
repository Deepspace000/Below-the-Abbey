# Character powers: the state before the retune (v3.682 plus the heal retune)

Every power of every class, in unlock order. `python tools/powers_audit/dump_inventory.py before` lists them from the running game (`inventory_before.json`); `python tools/powers_audit/run_audit.py before 40` measures them (`raw_before.json`).

**Method.** For each class and each of the levels 1, 10, 20, 30, 40, 50, 60, 70 and 80 a fresh hero of that class is built (levelled up with the real `levelUp`, so stats, health and mana are the real ones), given the best shop weapon of its type that its level and stats allow (Sword for Warrior, Axe for Barbarian, Mace for Paladin, Priest, Monk and Goat, Bow for Ranger and Archer, Dagger for Thief and Assassin, the best staff for Mage and Sorcerer), and every spell of its class that its level allows. Then every unlocked active power is used 40 times through the real `heroSpecial` on three standing dummies of that level in a corridor (health 1,000,000,000, one square, two squares and three squares ahead). The numbers are the average damage on the first dummy (direct damage, and damage over time added up as the status says), the mana (or stamina) that was really deducted, and the status or buff that was put on. "Spell" of a mage or sorcerer is the scroll in hand and is outside the ladder. Passive powers have no cost.

**Resource:** stamina for Warrior, Barbarian, Ranger, Archer, Thief, Assassin, Monk and Goat; mana for Paladin, Mage, Sorcerer and Priest. There are **no cooldowns** in the game: a power is limited only by the resource (and it can be used every round).

**Counts:** 109 class powers (58 active, rest passive) in 12 classes, plus 64 bought spells (levels 10 to 50, learned from the Spells shop) = 122 active powers measured.


## Warrior (Stamina)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Power Strike | active melee | 6 | m=2 a=2 | A crushing blow: double weapon damage plus 2. | 31 / 56 / 140 / 321 / 456 / 588 / 621 / 881 / 978 |
| 10 | Iron Skin | passive | - | pas={armor: 2} | Armor +2. | - |
| 10 | Intimidating Shout | spell w10 | 9 | aim=[area,3] fx=[[fear,4]] | A roar that sends every foe within 3 squares running for 4 rounds. | - / effect / effect / effect / effect / effect / effect / effect / effect |
| 20 | Cleave | active multi | 8 | m=1.2 n=2 | Two heavy swings that never miss, each at 1.2 times weapon damage. | - / - / 166 / 383 / 545 / 702 / 742 / 1056 / 1170 |
| 20 | Shield Wall | spell w20 | 14 | aim=party fx=[[buff,armor,5,8]] | The whole party locks shields: armor +5 for 8 rounds. | - / - / buff / buff / buff / buff / buff / buff / buff |
| 30 | Battle Cry | active buff | 9 | amt=0.25 b=dmgPct rounds=8 party | The whole party deals 25% more damage for 8 rounds. | - / - / - / buff / buff / buff / buff / buff / buff |
| 30 | Hamstring | spell w30 | 18 | aim=front fx=[[dmg,[20,30]],[slow,6],[bleed,6,4]] | A low cut to the legs: damage, slows the foe and leaves it bleeding. | - / - / - / 99 / 117 / 135 / 153 / 165 / 183 |
| 40 | Veteran | passive | - | pas={maxhp: 15, hitPct: 0.05} | Max health +15 and +5% to hit. | - |
| 40 | Battle Standard | spell w40 | 23 | aim=party fx=[[buff,dmgPct,0.25,10],[buff,hitPct,0.1,10]] | A raised banner: the party deals 25% more damage and hits 10% more often for 10 rounds. | - / - / - / - / buff / buff / buff / buff / buff |
| 50 | Shield Wall | active buff | 9 | amt=4 b=armor rounds=8 party | The whole party gains +4 armor for 8 rounds. | - / - / - / - / - / buff / buff / buff / buff |
| 50 | Warlord's Challenge | spell w50 | 27 | aim=[area,4] fx=[[confuse,4],[vuln,4]] | Every foe within 4 squares turns on its neighbours, and takes more damage while it does. | - / - / - / - / - / effect / effect / effect / effect |
| 60 | Executioner | passive | - | pas={crit: 0.1} | 10% chance to deal double damage on every hit. | - |
| 70 | Titan's Fury | active melee | 15 | m=4 a=4 | Four times weapon damage plus 4. | - / - / - / - / - / - / - / 1763 / 1955 |
| 80 | Warlord | passive | - | pas={maxhp: 30, dmgPct: 0.1} | Max health +30, all damage +10%. | - |

## Barbarian (Stamina)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Rage Blow | active melee | 8 | m=2.5 a=0 | A wild swing for two and a half times weapon damage. | 45 / 81 / 171 / 558 / 700 / 819 / 826 / 1252 / 1424 |
| 10 | Thick Hide | passive | - | pas={maxhp: 10} | Max health +10. | - |
| 10 | Savage Roar | spell b10 | 9 | aim=[area,3] fx=[[fear,4],[curse,4]] | A bestial roar: foes within 3 squares flee and fight weaker. | - / effect / effect / effect / effect / effect / effect / effect / effect |
| 20 | Bloodlust | active buff | 6 | amt=0.4 b=dmgPct rounds=6 | Deal 40% more damage for 6 rounds. | - / - / buff / buff / buff / buff / buff / buff / buff |
| 20 | Rend | spell b20 | 14 | aim=front fx=[[dmg,[24,34]],[bleed,8,4]] | Claws tear the foe ahead and leave it bleeding for 8 rounds. | - / - / 98 / 120 / 141 / 163 / 184 / 198 / 219 |
| 30 | Berserker | passive | - | pas={dmgPct: 0.15} | All damage +15%. | - |
| 30 | Blood Frenzy | spell b30 | 18 | aim=self fx=[[buff,dmgPct,0.6,6],[buff,crit,0.15,6]] | Red rage: +60% damage and +15% double hits for 6 rounds. | - / - / - / buff / buff / buff / buff / buff / buff |
| 40 | Savage Roar | active daze | 9 | range=3 | Every enemy within 3 tiles is stunned for a turn. | - / - / - / - / effect / effect / effect / effect / effect |
| 40 | Earthshatter | spell b40 | 23 | aim=[area,3] fx=[[dmg,[30,44]],[hold,2]] | A fist into the ground: foes within 3 squares take damage and are thrown down for 2 rounds. | - / - / - / - / 104 / 121 / 137 / 153 / 170 |
| 50 | Unbreakable | passive | - | pas={armor: 3, regen: 0.2} | Armor +3 and recover 1 health every 5 rounds. | - |
| 50 | Avatar of the Bear | spell b50 | 27 | aim=self fx=[[buff,dmgPct,1,8],[buff,regen,3,8],[buff,armor,4,8]] | The bear spirit takes you: double damage, fast healing and +4 armor for 8 rounds. | - / - / - / - / - / buff / buff / buff / buff |
| 60 | Whirlwind | active aoe | 11 | m=1.5 range=2 | Hit every enemy within 2 tiles for 1.5 times weapon damage. | - / - / - / - / - / - / 496 / 752 / 854 |
| 70 | Avatar of Ruin | active melee | 18 | m=5 a=0 | Five times weapon damage. | - / - / - / - / - / - / - / 2506 / 2849 |
| 80 | Primal Rage | passive | - | pas={dmgPct: 0.15, maxhp: 25} | All damage +15% and max health +25. | - |

## Paladin (Mana)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Smite | active melee | 6 | m=1 a=4 undead | Weapon damage plus 4, doubled against skeletons. | 12 / 27 / 71 / 166 / 221 / 336 / 340 / 471 / 516 |
| 10 | Blessed Armor | passive | - | pas={armor: 2} | Armor +2. | - |
| 10 | Lay on Hands | spell p10 | 12 | aim=front|ally fx=[[heal,[40,60]],[cleanse]] | Heals the most wounded ally for 40-60 and cleanses their afflictions. It heals at least that, and more as you... | - / - / - / - / - / - / - / - / - |
| 20 | Lay on Hands | active healx | 11 | amt=[12, 18] | Heals the most wounded ally for 12-18. | - / - / - / - / - / - / - / - / - |
| 20 | Holy Chains | spell p20 | 14 | aim=front fx=[[dmg,[18,26]],[hold,4]] | Golden chains hold the foe ahead for 4 rounds and burn it. | - / - / 45 / 56 / 67 / 79 / 90 / 101 / 112 |
| 30 | Undead Bane | passive | - | pas={undeadPct: 0.5} | Deal 50% more damage to skeletons. | - |
| 30 | Aura of Courage | spell p30 | 18 | aim=party fx=[[buff,dmgPct,0.15,12],[buff,hitPct,0.1,12],[buff,dodge,0.08,12]] | The party fights bolder for 12 rounds: +15% damage, +10% to hit and enemies miss more. | - / - / - / buff / buff / buff / buff / buff / buff |
| 40 | Divine Shield | active buff | 9 | amt=5 b=armor rounds=8 party | The whole party gains +5 armor for 8 rounds. | - / - / - / - / buff / buff / buff / buff / buff |
| 40 | Smite Evil | spell p40 | 23 | aim=[area,3] fx=[[dmg,[30,40]],[curse,6]] | Holy fire on foes within 3 squares, doubled against the undead, and cursing them. | - / - / - / - / 99 / 114 / 130 / 145 / 161 |
| 50 | Crusader | passive | - | pas={dmgPct: 0.15, hitPct: 0.05} | All damage +15% and +5% to hit. | - |
| 50 | Avenging Angel | spell p50 | 36 | aim=party fx=[[buff,dmgPct,0.4,8],[heal,[30,40],1]] | An angel at your side: the party heals for 30-40 and deals 40% more damage for 8 rounds. It heals at least th... | - / - / - / - / - / buff / buff / buff / buff |
| 60 | Holy Wrath | active aoe | 12 | dmg=[12, 18] range=3 undead | Holy fire hits every enemy within 3 tiles for 12-18. Double against skeletons. | - / - / - / - / - / - / 24 / 26 / 27 |
| 70 | Judgment | active melee | 15 | m=3 a=12 undead | Three times weapon damage plus 12, doubled against skeletons. | - / - / - / - / - / - / - / 1414 / 1549 |
| 80 | Aura of Light | passive | - | pas={armor: 4, dmgPct: 0.1} | Armor +4 and all damage +10%. | - |

## Ranger (Stamina)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Aimed Shot | active shot | 5 | m=2 range=3 | A careful shot that never misses: double weapon damage, up to 3 tiles away. | 12 / 44 / 118 / 298 / 440 / 588 / 593 / 810 / 843 |
| 10 | Keen Eyes | passive | - | pas={hitPct: 0.06} | +6% to hit. | - |
| 10 | Entangling Roots | spell r10 | 9 | aim=[area,3] fx=[[hold,3]] | Roots burst from the ground and hold every foe within 3 squares for 3 rounds. | - / effect / effect / effect / effect / effect / effect / effect / effect |
| 20 | Pinning Shot | active shot | 6 | m=1.5 range=3 daze | A shot for 1.5 times weapon damage that leaves the target dazed. | - / - / 89 / 224 / 330 / 441 / 445 / 608 / 632 |
| 20 | Bark Skin | spell r20 | 14 | aim=party fx=[[buff,armor,6,10]] | The skin of the whole party toughens like bark: armor +6 for 10 rounds. | - / - / buff / buff / buff / buff / buff / buff / buff |
| 30 | Woodcraft | passive | - | pas={dodge: 0.08, hungerSlow: 0.25} | Enemies miss 8% more often. Hunger falls 25% slower. | - |
| 30 | Poison Arrow | spell r30 | 18 | aim=front fx=[[dmg,[26,36]],[poison,10,4]] | A poisoned shot: damage, then 4 poison damage each round for 10 rounds. | - / - / - / 135 / 159 / 183 / 207 / 222 / 246 |
| 40 | Rapid Fire | active ranged | 9 | m=1 n=3 range=4 | Three arrows that never miss, up to 4 tiles away. | - / - / - / - / 660 / 882 / 889 / 1214 / 1265 |
| 40 | Swarm of Wasps | spell r40 | 23 | aim=[area,3] fx=[[poison,6,3],[blind,5]] | Wasps cover every foe within 3 squares: stung, poisoned and unable to see. | - / - / - / - / 36 / 42 / 48 / 48 / 54 |
| 50 | Deadeye | passive | - | pas={crit: 0.12} | 12% chance to deal double damage on every hit. | - |
| 50 | Wrath of the Forest | spell r50 | 27 | aim=[area,4] fx=[[dmg,[36,52]],[hold,3],[confuse,3]] | The forest itself rises: foes take damage, are rooted and lash out at each other. | - / - / - / - / - / 139 / 158 / 176 / 195 |
| 60 | Hunter's Mark | active buff | 8 | amt=0.5 b=dmgPct rounds=8 | Deal 50% more damage for 8 rounds. | - / - / - / - / - / - / buff / buff / buff |
| 70 | Arrow Storm | active aoe | 15 | m=2 range=4 | Arrows hit every enemy within 4 tiles for 2 times weapon damage. | - / - / - / - / - / - / - / 810 / 843 |
| 80 | Master of the Wild | passive | - | pas={hitPct: 0.08, crit: 0.1} | +8% to hit and 10% more double damage. | - |

## Archer (Stamina)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Volley | active volley | 6 | m=1 range=4 | Two arrows that never miss, each at full weapon damage, up to 4 tiles away. | 25 / 50 / 132 / 340 / 506 / 676 / 679 / 927 / 1096 |
| 10 | Steady Aim | passive | - | pas={dmgPct: 0.15} | All damage +15%. | - |
| 10 | Flaming Arrow | spell a10 | 9 | aim=front fx=[[dmg,[20,28]],[burn,5,5]] | An arrow wrapped in fire: damage and 5 burn damage each round for 5 rounds. | - / 63 / 79 / 96 / 113 / 130 / 146 / 158 / 175 |
| 20 | Piercing Shot | active shot | 6 | m=2.5 range=4 | A shot for 2.5 times weapon damage, up to 4 tiles away. | - / - / 166 / 425 / 632 / 845 / 849 / 1159 / 1371 |
| 20 | Pinning Shot | spell a20 | 14 | aim=front fx=[[dmg,[22,32]],[hold,3]] | An arrow through the foot: damage and pinned in place for 3 rounds. | - / - / 55 / 67 / 80 / 93 / 106 / 118 / 131 |
| 30 | Quick Draw | passive | - | pas={hitPct: 0.06, dodge: 0.05} | +6% to hit. Enemies miss 5% more often. | - |
| 30 | Rain of Arrows | spell a30 | 18 | aim=[area,4] fx=[[dmg,[26,38]]] | A hundred arrows fall on every foe within 4 squares. | - / - / - / 78 / 92 / 107 / 121 / 136 / 150 |
| 40 | Triple Shot | active ranged | 9 | m=1 n=3 range=4 | Three arrows that never miss, up to 4 tiles away. | - / - / - / - / 760 / 1014 / 1018 / 1391 / 1644 |
| 40 | Cursed Arrow | spell a40 | 23 | aim=front fx=[[dmg,[30,42]],[curse,8],[bleed,8,4]] | A black arrow: damage, bleeding, and the foe hits weaker for 8 rounds. | - / - / - / - / 158 / 182 / 206 / 222 / 245 |
| 50 | Eagle Eye | passive | - | pas={crit: 0.12} | 12% chance to deal double damage on every hit. | - |
| 50 | Dragonbone Arrow | spell a50 | 27 | aim=front fx=[[exec,0.25,[70,100]]] | One arrow of dragon bone: 70-100 damage, and a foe under a quarter health simply dies. | - / - / - / - / - / 252 / 286 / 319 / 352 |
| 60 | Arrow Rain | active aoe | 12 | m=1.5 range=4 | Arrows hit every enemy within 4 tiles for 1.5 times weapon damage. | - / - / - / - / - / - / 510 / 696 / 823 |
| 70 | Perfect Shot | active shot | 15 | m=6 range=5 | One shot for 6 times weapon damage, up to 5 tiles away. | - / - / - / - / - / - / - / 2784 / 3288 |
| 80 | Legendary Marksman | passive | - | pas={dmgPct: 0.15, crit: 0.1} | All damage +15% and 10% more double damage. | - |

## Thief (Stamina)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Twin Stab | active twin | 5 |  | Two attacks that never miss: double weapon damage in total. | 23 / 44 / 82 / 279 / 368 / 387 / 389 / 965 / 1006 |
| 10 | Nimble | passive | - | pas={dodge: 0.08} | Enemies miss 8% more often. | - |
| 10 | Sense Traps | active sense | 8 | range=6 | Reveals every trap within 6 squares for about 20 seconds, as a faint glow on the floor: warm red for the fire... | - / - / - / - / - / - / - / - / - |
| 10 | Pickpocket | spell t10 | 9 | aim=front fx=[[steal,3]] | Lift gold from the foe ahead. You get more at higher levels. | - / - / - / - / - / - / - / - / - |
| 20 | Smoke Bomb | active daze | 6 | range=3 | Every enemy within 3 tiles is stunned for a turn. | - / - / effect / effect / effect / effect / effect / effect / effect |
| 20 | Smoke Bomb | spell t20 | 14 | aim=[area,3] fx=[[blind,5]] | Thick smoke blinds every foe within 3 squares for 5 rounds: they miss much more often. | - / - / effect / effect / effect / effect / effect / effect / effect |
| 30 | Lucky | passive | - | pas={goldPct: 0.3} | Enemies drop 30% more gold. | - |
| 30 | Venom Blade | spell t30 | 18 | aim=front fx=[[dmg,[26,36]],[poison,8,4],[slow,6]] | A poisoned stab that also slows the foe. | - / - / - / 123 / 145 / 168 / 190 / 204 / 226 |
| 40 | Flurry | active multi | 8 | m=1 n=3 | Three attacks that never miss, each at full weapon damage. | - / - / - / - / 553 / 580 / 584 / 1447 / 1509 |
| 40 | Befuddle | spell t40 | 23 | aim=[area,4] fx=[[confuse,4]] | Foes within 4 squares see enemies everywhere and fight each other for 4 rounds. | - / - / - / - / effect / effect / effect / effect / effect |
| 50 | Shadow Step | passive | - | pas={crit: 0.1, dodge: 0.05} | 10% double damage and enemies miss 5% more often. | - |
| 50 | Master Heist | spell t50 | 27 | aim=[area,4] fx=[[steal,14],[hold,2]] | Rob every foe within 4 squares blind and leave them frozen with surprise for 2 rounds. | - / - / - / - / - / effect / effect / effect / effect |
| 60 | Death Mark | active melee | 9 | m=3.5 a=0 | Three and a half times weapon damage. | - / - / - / - / - / - / 679 / 1687 / 1761 |
| 70 | Master Thief | passive | - | pas={dmgPct: 0.2, goldPct: 0.5} | All damage +20% and 50% more gold. | - |
| 80 | Ghost | passive | - | pas={dodge: 0.1, crit: 0.1} | Enemies miss 10% more often and 10% more double damage. | - |

## Assassin (Stamina)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Backstab | active backstab | 5 |  | Triple damage on a foe that has not noticed you, double otherwise. | 22 / 42 / 80 / 321 / 419 / 437 / 437 / 1071 / 1240 |
| 10 | Poise | passive | - | pas={crit: 0.06} | 6% chance to deal double damage on every hit. | - |
| 10 | Garrote | spell s10 | 9 | aim=front fx=[[dmg,[16,24]],[bleed,10,5]] | A wire round the throat: damage and 5 bleeding damage each round for 10 rounds. | - / 82 / 102 / 123 / 143 / 163 / 184 / 194 / 214 |
| 20 | Vanish | active buff | 6 | amt=1 b=dmgPct rounds=3 | Deal 100% more damage for 3 rounds. | - / - / buff / buff / buff / buff / buff / buff / buff |
| 20 | Marked for Death | spell s20 | 14 | aim=front fx=[[vuln,8],[curse,8]] | The foe takes 50% more damage from every blow for 8 rounds and hits weaker. | - / - / effect / effect / effect / effect / effect / effect / effect |
| 30 | Cold Blood | passive | - | pas={dmgPct: 0.15} | All damage +15%. | - |
| 30 | Night Terror | spell s30 | 18 | aim=[area,4] fx=[[fear,5]] | Nightmares walk among the foes within 4 squares: they flee for 5 rounds. | - / - / - / effect / effect / effect / effect / effect / effect |
| 40 | Nerve Strike | active melee | 8 | m=2 a=0 daze | Two times weapon damage that leaves the target dazed. | - / - / - / - / 419 / 437 / 437 / 1071 / 1240 |
| 40 | Poison Cloud | spell s40 | 23 | aim=[area,3] fx=[[dmg,[22,32]],[poison,8,5]] | A cloud of green death over every foe within 3 squares. | - / - / - / - / 144 / 165 / 185 / 198 / 219 |
| 50 | Shadowblade | passive | - | pas={crit: 0.1, hitPct: 0.05} | 10% double damage and +5% to hit. | - |
| 50 | Death Warrant | spell s50 | 27 | aim=front fx=[[exec,0.4,[80,110]]] | A foe under 40% health dies at once. Otherwise it takes 80-110 damage. | - / - / - / - / - / 280 / 316 / 353 / 389 |
| 60 | Assassinate | active melee | 11 | m=4 a=0 | Four times weapon damage. | - / - / - / - / - / - / 874 / 2142 / 2481 |
| 70 | Death's Embrace | passive | - | pas={crit: 0.2, dmgPct: 0.1} | 20% chance of double damage and all damage +10%. | - |
| 80 | Angel of Death | passive | - | pas={dmgPct: 0.15, crit: 0.1} | All damage +15% and 10% more double damage. | - |

## Mage (Mana)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Spell | active spell | 0 |  | Casts the active spell chosen in the spell tab. | - / - / - / - / - / - / - / - / - |
| 10 | Arcane Mind | passive | - | pas={spellPct: 0.15} | Spell damage +15%. | - |
| 10 | Hold Person | spell m10 | 9 | aim=front fx=[[hold,5]] | The foe ahead cannot move or act for 5 rounds. | - / effect / effect / effect / effect / effect / effect / effect / effect |
| 20 | Mage Armor | active buff | 6 | amt=3 b=armor rounds=8 party | The whole party gains +3 armor for 8 rounds. | - / - / buff / buff / buff / buff / buff / buff / buff |
| 20 | Polymorph: Sheep | spell m20 | 14 | aim=front fx=[[poly,sheep,8]] | The foe becomes a harmless sheep for 8 rounds. Baa. | - / - / effect / effect / effect / effect / effect / effect / effect |
| 30 | Mana Well | passive | - | pas={spellPct: 0.1, maxhp: 10} | Spell damage +10% and max health +10. | - |
| 30 | Mirror Images | spell m30 | 18 | aim=party fx=[[buff,dodge,0.25,8]] | Ghostly copies of the party draw blows: enemies miss 25% more for 8 rounds. | - / - / - / buff / buff / buff / buff / buff / buff |
| 30 | Arcane Lance | spell m30b | 24 | aim=front fx=[[dmg,[18,26]],[vuln,3]] | A lance of pure force: about 40-55 damage at level 30, and the foe takes more from the next blows. | - / - / - / 71 / 85 / 118 / 135 / 151 / 213 |
| 40 | Fireball | active aoe | 12 | dmg=[14, 20] range=3 | Fire hits every enemy within 3 tiles for 14-20. | - / - / - / - / 104 / 129 / 135 / 197 / 255 |
| 40 | Disintegrate | spell m40 | 23 | aim=front fx=[[exec,0.2,[90,130]]] | A beam of unmaking: 90-130 damage, and a foe under 20% health is dust. | - / - / - / - / 349 / 481 / 544 / 607 / 848 |
| 50 | Spell Mastery | passive | - | pas={spellPct: 0.25} | Spell damage +25%. | - |
| 50 | Time Stop | spell m50 | 27 | aim=all fx=[[hold,3]] | Time stops for every foe in sight for 3 rounds. The party moves freely. | - / - / - / - / - / effect / effect / effect / effect |
| 60 | Chain Lightning | active aoe | 14 | dmg=[12, 18] range=4 | Lightning hits every enemy within 4 tiles for 12-18. | - / - / - / - / - / - / 132 / 194 / 251 |
| 70 | Meteor | active aoe | 21 | dmg=[28, 40] range=4 | A meteor hits every enemy within 4 tiles for 28-40. | - / - / - / - / - / - / - / 222 / 287 |
| 80 | Archmage | passive | - | pas={spellPct: 0.4, dodge: 0.05} | Spell damage +40% and enemies miss 5% more often. | - |

## Sorcerer (Mana)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Spell | active spell | 0 |  | Casts the active spell with +2 damage. | - / - / - / - / - / - / - / - / - |
| 10 | Innate Power | passive | - | pas={spellPct: 0.15} | Spell damage +15%. | - |
| 10 | Wail of Fear | spell z10 | 9 | aim=[area,4] fx=[[fear,5]] | A wail that turns the courage of every foe within 4 squares to water. | - / effect / effect / effect / effect / effect / effect / effect / effect |
| 20 | Siphon | active drain | 6 | dmg=[10, 16] | Drains 10-16 health from the enemy ahead and heals you for half. | - / - / 54 / 89 / 107 / 137 / 142 / 210 / 269 |
| 20 | Polymorph: Cow | spell z20 | 14 | aim=front fx=[[poly,cow,8]] | The foe becomes a placid cow for 8 rounds. Moo. | - / - / effect / effect / effect / effect / effect / effect / effect |
| 30 | Wild Magic | passive | - | pas={spellPct: 0.2} | Spell damage +20%. | - |
| 30 | Wild Surge | spell z30 | 18 | aim=front fx=[[surge]] | Raw chaos: a random mighty effect. Damage, a sheep, a heal, a hold. Anything can happen. | - / - / - / effect / effect / effect / effect / effect / effect |
| 30 | Chain Lightning | spell z30b | 24 | aim=[area,3] fx=[[dmg,[16,24]]] | Lightning leaps between every foe within 3 squares for about 35-50 damage each at level 30. | - / - / - / 72 / 86 / 122 / 139 / 156 / 215 |
| 40 | Frost Nova | active aoe | 11 | dmg=[8, 12] range=3 daze | Ice hits every enemy within 3 tiles for 8-12 and stuns them. | - / - / - / - / 103 / 132 / 137 / 205 / 262 |
| 40 | Dragon's Breath | spell z40 | 23 | aim=[area,3] fx=[[dmg,[34,48]],[burn,5,6]] | A cone of fire: foes within 3 squares take damage and burn for 5 rounds. | - / - / - / - / 199 / 267 / 301 / 330 / 438 |
| 50 | Overchannel | passive | - | pas={spellPct: 0.3} | Spell damage +30%. | - |
| 50 | Rift of Banishing | spell z50 | 27 | aim=front fx=[[banish]] | Opens a rift that swallows the foe ahead. Great beasts and bosses take a heavy blow instead. | - / - / - / - / - / - / - / - / - |
| 60 | Lightning Storm | active aoe | 15 | dmg=[16, 24] range=4 | Lightning hits every enemy within 4 tiles for 16-24. | - / - / - / - / - / - / 153 / 221 / 283 |
| 70 | Cataclysm | active aoe | 23 | dmg=[34, 48] range=4 | Ruin hits every enemy within 4 tiles for 34-48. | - / - / - / - / - / - / - / 256 / 326 |
| 80 | Living Storm | passive | - | pas={spellPct: 0.4, maxhp: 20} | Spell damage +40% and max health +20. | - |

## Priest (Mana)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Heal | active heal | 3 |  | Restores about 10 health to the most wounded ally. A small, cheap heal that is not much use once the party is... | - / - / - / - / - / - / - / - / - |
| 10 | Faith | passive | - | pas={healPct: 0.2} | Healing is 20% stronger. | - |
| 10 | Purify | spell c10 | 9 | aim=party fx=[[cleanse],[heal,[12,20],1]] | Cleanses every affliction on the party and restores about 8 health to everyone. | - / - / - / - / - / - / - / - / - |
| 20 | Blessing | active buff | 8 | amt=0.2 b=dmgPct rounds=8 party | The whole party deals 20% more damage for 8 rounds. | - / - / buff / buff / buff / buff / buff / buff / buff |
| 20 | Turn Undead | spell c20 | 14 | aim=[area,4] fx=[[undead,10,[40,60]]] | Undead within 4 squares flee for 10 rounds or are destroyed. Living foes cower for 2 rounds. | - / - / effect / effect / effect / effect / effect / effect / effect |
| 30 | Mend | active healx | 19 | amt=[6, 10] all | Restores about 30 health to every living ally. | - / - / - / - / - / - / - / - / - |
| 30 | Sanctuary Ward | spell c30 | 18 | aim=party fx=[[buff,armor,4,10],[buff,dodge,0.15,10]] | A sacred ward: armor +4 and enemies miss 15% more for 10 rounds. | - / - / - / buff / buff / buff / buff / buff / buff |
| 30 | Smiting Light | spell c30b | 24 | aim=[area,3] fx=[[dmg,[16,24]],[curse,4]] | Hallowed light on every foe within 3 squares for about 35-50 damage each at level 30, and it curses them. | - / - / - / 51 / 62 / 72 / 82 / 93 / 103 |
| 40 | Sanctuary | passive | - | pas={armor: 3, maxhp: 8} | Armor +3 and max health +8. | - |
| 40 | Divine Wrath | spell c40 | 23 | aim=[area,4] fx=[[dmg,[34,50]],[curse,6]] | Light from the heavens strikes every foe within 4 squares, and curses them. | - / - / - / - / 114 / 133 / 151 / 169 / 187 |
| 50 | Revive | active revive | 18 | pct=0.4 | Raises one fallen ally with 40% health. | - / - / - / - / - / - / - / - / - |
| 50 | Resurrection | spell c50 | 36 | aim=dead fx=[[revive,0.7],[healpct,0.5]] | Raises every fallen hero at 70% health and heals the living for half. | - / - / - / - / - / - / - / - / - |
| 50 | Restoration | spell c40h | 52 | aim=front|ally fx=[[heal,[60,90]]] | Restores about 561 health to the most wounded ally. The strongest single heal, and it costs a great deal of m... | - / - / - / - / - / - / - / - / - |
| 60 | Greater Heal | active healx | 26 | amt=[24, 34] | Restores about 271 health to the most wounded ally. | - / - / - / - / - / - / - / - / - |
| 70 | Divine Intervention | active healx | 45 | pct=0.35 all | The greatest group heal: every living ally recovers about 100 health. | - / - / - / - / - / - / - / - / - |
| 80 | Saint | passive | - | pas={healPct: 0.3, maxhp: 20} | Healing is 30% stronger and max health +20. | - |

## Monk (Stamina)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Palm Strike | active melee | 5 | m=2 a=0 | A focused strike for double damage. Strong even unarmed. | 8 / 43 / 65 / 316 / 421 / 648 / 650 / 838 / 931 |
| 10 | Inner Calm | passive | - | pas={dodge: 0.08, hungerSlow: 0.3} | Enemies miss 8% more often. Hunger falls 30% slower. | - |
| 10 | Pressure Point | spell k10 | 9 | aim=front fx=[[hold,4]] | A finger on the right spot: the foe ahead cannot move for 4 rounds. | - / effect / effect / effect / effect / effect / effect / effect / effect |
| 20 | Flurry of Blows | active multi | 6 | m=1 n=3 | Three strikes that never miss, each at full damage. | - / - / 98 / 473 / 631 / 974 / 977 / 1257 / 1396 |
| 20 | Wholeness of Body | spell k20 | 18 | aim=self fx=[[heal,[50,70]],[cleanse]] | You heal 50-70 and cleanse every affliction on you. It heals at least that, and more as you grow: about 46 pe... | - / - / - / - / - / - / - / - / - |
| 30 | Iron Body | passive | - | pas={armor: 3, maxhp: 10} | Armor +3 and max health +10. | - |
| 30 | Quivering Palm | spell k30 | 18 | aim=front fx=[[dmg,[30,44]],[bleed,6,5],[curse,6]] | A strike that keeps hurting: damage, bleeding and a weakened foe. | - / - / - / 129 / 151 / 173 / 196 / 212 / 234 |
| 40 | Stunning Fist | active melee | 8 | m=2.5 a=0 daze | Two and a half times weapon damage and the target is dazed. | - / - / - / - / 526 / 811 / 814 / 1047 / 1164 |
| 40 | Mantra of Peace | spell k40 | 23 | aim=[area,4] fx=[[sleep,5]] | Foes within 4 squares fall asleep until they are hurt, or 5 rounds pass. | - / - / - / - / effect / effect / effect / effect / effect |
| 50 | Ki Mastery | passive | - | pas={dmgPct: 0.15, mpRegen: 0.25} | All damage +15%. Recover 1 stamina every 4 rounds. | - |
| 50 | Thousand Fists | spell k50 | 27 | aim=[area,3] fx=[[dmg,[26,36]],[dmg,[26,36]],[dmg,[26,36]],[dmg,[26,36]],[dmg,[26,36]]] | Five rapid blows land on every foe within 3 squares. | - / - / - / - / - / 515 / 585 / 655 / 725 |
| 60 | Dragon Kick | active melee | 11 | m=4 a=0 | Four times weapon damage. | - / - / - / - / - / - / 1302 / 1675 / 1863 |
| 70 | Perfect Harmony | passive | - | pas={dmgPct: 0.25, crit: 0.12, dodge: 0.1} | All damage +25%, 12% double damage and enemies miss 10% more often. | - |
| 80 | Enlightenment | passive | - | pas={dmgPct: 0.15, armor: 3, dodge: 0.08} | All damage +15%, armor +3 and enemies miss 8% more often. | - |

## Goat (Stamina)

| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |
|---|---|---|---|---|---|---|
| 1 | Headbutt | active butt | 5 |  | A hard butt for 5-10 damage that leaves the foe dazed for a turn. | 9 / 11 / 14 / 17 / 20 / 24 / 26 / 30 / 32 |
| 10 | Tough Hide | passive | - | pas={armor: 2, hungerSlow: 0.3} | Armor +2. Hunger falls 30% slower. | - |
| 10 | Bleat of Doom | spell g10 | 9 | aim=[area,4] fx=[[fear,4]] | A bleat so awful that every foe within 4 squares runs for 4 rounds. | - / effect / effect / effect / effect / effect / effect / effect / effect |
| 20 | Stubborn | passive | - | pas={maxhp: 15} | Max health +15. | - |
| 20 | Eat Anything | spell g20 | 18 | aim=party fx=[[cleanse],[feed,30],[heal,[16,24],1]] | The goat eats everything, then the party feels better: cleansed, fed and healed. It heals at least that, and ... | - / - / - / - / - / - / - / - / - |
| 30 | Charge | active melee | 8 | m=3 a=0 daze | Three times weapon damage and the target is dazed. | - / - / - / 486 / 647 / 866 / 873 / 1218 / 1225 |
| 30 | Polymorph: Goat | spell g30 | 18 | aim=front fx=[[poly,goat,10]] | The foe becomes a goat for 10 rounds. It seems pleased. | - / - / - / effect / effect / effect / effect / effect / effect |
| 40 | Surefooted | passive | - | pas={dodge: 0.1} | Enemies miss 10% more often. | - |
| 40 | Mountain Charge | spell g40 | 23 | aim=front fx=[[dmg,[40,60]],[hold,3]] | A charge from the high peaks: heavy damage and a stunned foe. | - / - / - / - / 134 / 155 / 176 / 197 / 218 |
| 50 | Scavenger | passive | - | pas={hungerSlow: 0.5, regen: 0.17} | Hunger falls 50% slower and recover 1 health every 6 rounds. | - |
| 50 | Great Stampede | spell g50 | 27 | aim=[area,5] fx=[[dmg,[44,64]],[hold,2]] | A spectral herd thunders through every foe within 5 squares. | - / - / - / - / - / 166 / 188 / 211 / 233 |
| 60 | Rampage | active multi | 11 | m=1.3 n=3 | Three butts that never miss, each at 1.3 times damage. | - / - / - / - / - / - / 1133 / 1584 / 1594 |
| 70 | Legend of the Mountain | active melee | 15 | m=5 a=0 daze | Five times weapon damage and the target is dazed. | - / - / - / - / - / - / - / 2030 / 2041 |
| 80 | Mountain King | passive | - | pas={maxhp: 30, armor: 3, dodge: 0.08} | Max health +30, armor +3 and enemies miss 8% more often. | - |

## Flags in the old numbers (the audit rules are listed in POWERS_AFTER.md)

Counts: bargain 142, description-mismatch 7, ladder-ends-early 12, later-power-not-dearer 20, later-power-weaker 17, no-level-scaling 1, trap 115


**ladder-ends-early** (12)

- Warrior: last damage power unlocks at level 70 (the game goes to level 87)
- Barbarian: last damage power unlocks at level 70 (the game goes to level 87)
- Paladin: last damage power unlocks at level 70 (the game goes to level 87)
- Ranger: last damage power unlocks at level 70 (the game goes to level 87)
- Archer: last damage power unlocks at level 70 (the game goes to level 87)
- Thief: last damage power unlocks at level 60 (the game goes to level 87)
- Assassin: last damage power unlocks at level 60 (the game goes to level 87)
- Mage: last damage power unlocks at level 70 (the game goes to level 87)
- Sorcerer: last damage power unlocks at level 70 (the game goes to level 87)
- Priest: last damage power unlocks at level 40 (the game goes to level 87)
- Monk: last damage power unlocks at level 60 (the game goes to level 87)
- Goat: last damage power unlocks at level 70 (the game goes to level 87)

**later-power-weaker** (17)

- Warrior: single line: Hamstring (lv30) is 99 at level 30, earlier Cleave (lv20) is 383
- Warrior: buff-def line: Shield Wall (lv50) is 128 at level 50, earlier Shield Wall (lv20) is 160
- Barbarian: single line: Rend (lv20) is 98 at level 20, earlier Rage Blow (lv1) is 171
- Barbarian: control-area line: Savage Roar (lv40) is 3 at level 40, earlier Savage Roar (lv10) is 48
- Paladin: single line: Holy Chains (lv20) is 45 at level 20, earlier Smite (lv1) is 71
- Paladin: group line: Holy Wrath (lv60) is 72 at level 60, earlier Smite Evil (lv40) is 390
- Ranger: single line: Pinning Shot (lv20) is 89 at level 20, earlier Aimed Shot (lv1) is 118
- Ranger: single line: Poison Arrow (lv30) is 135 at level 30, earlier Pinning Shot (lv20) is 224
- Archer: single line: Flaming Arrow (lv10) is 79 at level 20, earlier Volley (lv1) is 132
- Archer: single line: Pinning Shot (lv20) is 55 at level 20, earlier Piercing Shot (lv20) is 166
- Archer: single line: Cursed Arrow (lv40) is 158 at level 40, earlier Triple Shot (lv40) is 760
- Thief: single line: Venom Blade (lv30) is 123 at level 30, earlier Twin Stab (lv1) is 279
- Assassin: single line: Garrote (lv10) is 123 at level 30, earlier Backstab (lv1) is 321
- Assassin: single line: Death Warrant (lv50) is 280 at level 50, earlier Nerve Strike (lv40) is 437
- Sorcerer: group line: Lightning Storm (lv60) is 459 at level 60, earlier Dragon's Breath (lv40) is 903
- Monk: single line: Quivering Palm (lv30) is 129 at level 30, earlier Flurry of Blows (lv20) is 473
- Goat: single line: Mountain Charge (lv40) is 134 at level 40, earlier Charge (lv30) is 647

**later-power-not-dearer** (20)

- Warrior: single line: Titan's Fury (lv70) costs 15, earlier Hamstring (lv30) costs 18
- Warrior: buff-def line: Shield Wall (lv50) costs 9, earlier Shield Wall (lv20) costs 14
- Barbarian: control-area line: Savage Roar (lv40) costs 9, earlier Savage Roar (lv10) costs 9
- Barbarian: group line: Whirlwind (lv60) costs 11, earlier Earthshatter (lv40) costs 23
- Paladin: group line: Holy Wrath (lv60) costs 12, earlier Smite Evil (lv40) costs 23
- Ranger: single line: Rapid Fire (lv40) costs 9, earlier Poison Arrow (lv30) costs 18
- Ranger: group line: Arrow Storm (lv70) costs 15, earlier Wrath of the Forest (lv50) costs 27
- Archer: single line: Piercing Shot (lv20) costs 6, earlier Flaming Arrow (lv10) costs 9
- Archer: single line: Triple Shot (lv40) costs 9, earlier Pinning Shot (lv20) costs 14
- Archer: single line: Perfect Shot (lv70) costs 15, earlier Dragonbone Arrow (lv50) costs 27
- Archer: group line: Arrow Rain (lv60) costs 12, earlier Rain of Arrows (lv30) costs 18
- Thief: single line: Flurry (lv40) costs 8, earlier Venom Blade (lv30) costs 18
- Assassin: single line: Nerve Strike (lv40) costs 8, earlier Garrote (lv10) costs 9
- Assassin: single line: Assassinate (lv60) costs 11, earlier Death Warrant (lv50) costs 27
- Mage: single line: Disintegrate (lv40) costs 23, earlier Arcane Lance (lv30) costs 24
- Sorcerer: group line: Frost Nova (lv40) costs 11, earlier Chain Lightning (lv30) costs 24
- Sorcerer: group line: Lightning Storm (lv60) costs 15, earlier Dragon's Breath (lv40) costs 23
- Priest: group line: Divine Wrath (lv40) costs 23, earlier Smiting Light (lv30) costs 24
- Monk: single line: Stunning Fist (lv40) costs 8, earlier Quivering Palm (lv30) costs 18
- Goat: single line: Rampage (lv60) costs 11, earlier Mountain Charge (lv40) costs 23

**bargain** (142)

- Warrior: single line at level 30: Power Strike does 53.6 per cost, line average 35.6 (+50%)
- Warrior: single line at level 30: Cleave does 47.8 per cost, line average 35.6 (+34%)
- Warrior: single line at level 40: Power Strike does 76.0 per cost, line average 50.2 (+51%)
- Warrior: single line at level 40: Cleave does 68.2 per cost, line average 50.2 (+36%)
- Warrior: single line at level 50: Power Strike does 98.1 per cost, line average 64.4 (+52%)
- Warrior: single line at level 50: Cleave does 87.8 per cost, line average 64.4 (+36%)
- Warrior: single line at level 60: Power Strike does 103.4 per cost, line average 68.2 (+52%)
- Warrior: single line at level 60: Cleave does 92.7 per cost, line average 68.2 (+36%)
- Warrior: single line at level 70: Power Strike does 146.9 per cost, line average 101.4 (+45%)
- Warrior: single line at level 70: Cleave does 132.0 per cost, line average 101.4 (+30%)
- Warrior: single line at level 80: Power Strike does 162.9 per cost, line average 112.4 (+45%)
- Warrior: single line at level 80: Cleave does 146.2 per cost, line average 112.4 (+30%)
- Barbarian: single line at level 20: Rage Blow does 21.4 per cost, line average 14.2 (+51%)
- Barbarian: single line at level 30: Rage Blow does 69.7 per cost, line average 39.2 (+78%)
- Barbarian: single line at level 40: Rage Blow does 87.5 per cost, line average 48.8 (+79%)
- Barbarian: single line at level 50: Rage Blow does 102.3 per cost, line average 57.0 (+80%)
- Barbarian: single line at level 60: Rage Blow does 103.2 per cost, line average 58.2 (+77%)
- Barbarian: single line at level 70: Rage Blow does 156.5 per cost, line average 103.3 (+52%)
- Barbarian: single line at level 70: Avatar of Ruin does 139.2 per cost, line average 103.3 (+35%)
- Barbarian: single line at level 80: Rage Blow does 178.1 per cost, line average 117.3 (+52%)
- Barbarian: single line at level 80: Avatar of Ruin does 158.3 per cost, line average 117.3 (+35%)
- Barbarian: group line at level 60: Whirlwind does 135.1 per cost, line average 76.5 (+77%)
- Barbarian: group line at level 70: Whirlwind does 205.0 per cost, line average 112.5 (+82%)
- Barbarian: group line at level 80: Whirlwind does 232.9 per cost, line average 127.5 (+83%)
- Paladin: single line at level 20: Smite does 11.8 per cost, line average 7.5 (+57%)
- Paladin: single line at level 30: Smite does 27.7 per cost, line average 15.9 (+75%)
- Paladin: single line at level 40: Smite does 36.9 per cost, line average 20.8 (+77%)
- Paladin: single line at level 50: Smite does 56.0 per cost, line average 30.8 (+82%)
- Paladin: single line at level 60: Smite does 56.7 per cost, line average 31.6 (+80%)
- Paladin: single line at level 70: Smite does 78.6 per cost, line average 60.0 (+31%)
- Paladin: single line at level 70: Judgment does 94.3 per cost, line average 60.0 (+57%)
- Paladin: single line at level 80: Smite does 86.1 per cost, line average 65.8 (+31%)
- Paladin: single line at level 80: Judgment does 103.3 per cost, line average 65.8 (+57%)
- Paladin: group line at level 60: Smite Evil does 17.0 per cost, line average 11.5 (+48%)
- Paladin: group line at level 70: Smite Evil does 18.9 per cost, line average 12.7 (+49%)
- Paladin: group line at level 80: Smite Evil does 21.0 per cost, line average 13.9 (+51%)
- Ranger: single line at level 20: Aimed Shot does 23.6 per cost, line average 19.2 (+23%)
- Ranger: single line at level 30: Aimed Shot does 59.6 per cost, line average 34.8 (+71%)
- Ranger: single line at level 40: Aimed Shot does 88.0 per cost, line average 56.3 (+56%)
- Ranger: single line at level 40: Rapid Fire does 73.3 per cost, line average 56.3 (+30%)
- Ranger: single line at level 50: Aimed Shot does 117.5 per cost, line average 74.8 (+57%)
- Ranger: single line at level 50: Rapid Fire does 98.0 per cost, line average 74.8 (+31%)
- Ranger: single line at level 60: Aimed Shot does 118.6 per cost, line average 75.8 (+56%)
- Ranger: single line at level 60: Rapid Fire does 98.8 per cost, line average 75.8 (+30%)
- Ranger: single line at level 70: Aimed Shot does 161.9 per cost, line average 102.6 (+58%)
- Ranger: single line at level 70: Rapid Fire does 134.9 per cost, line average 102.6 (+31%)
- Ranger: single line at level 80: Aimed Shot does 168.6 per cost, line average 107.1 (+58%)
- Ranger: single line at level 80: Rapid Fire does 140.5 per cost, line average 107.1 (+31%)
- Ranger: group line at level 50: Wrath of the Forest does 15.4 per cost, line average 10.5 (+48%)
- Ranger: group line at level 60: Wrath of the Forest does 17.6 per cost, line average 11.9 (+47%)
- Ranger: group line at level 70: Arrow Storm does 161.9 per cost, line average 62.6 (+159%)
- Ranger: group line at level 80: Arrow Storm does 168.6 per cost, line average 65.8 (+156%)
- Archer: single line at level 20: Volley does 22.1 per cost, line average 15.6 (+41%)
- Archer: single line at level 20: Piercing Shot does 27.7 per cost, line average 15.6 (+77%)
- Archer: single line at level 30: Volley does 56.6 per cost, line average 35.7 (+59%)
- Archer: single line at level 30: Piercing Shot does 70.8 per cost, line average 35.7 (+98%)
- Archer: single line at level 40: Volley does 84.4 per cost, line average 49.9 (+69%)
- Archer: single line at level 40: Piercing Shot does 105.4 per cost, line average 49.9 (+111%)
- Archer: single line at level 40: Triple Shot does 84.4 per cost, line average 49.9 (+69%)
- Archer: single line at level 50: Volley does 112.7 per cost, line average 57.8 (+95%)
- ... and 82 more of the same kind

**trap** (115)

- Warrior: single line at level 30: Hamstring does 5.5 per cost, line average 35.6 (-85%)
- Warrior: single line at level 40: Hamstring does 6.5 per cost, line average 50.2 (-87%)
- Warrior: single line at level 50: Hamstring does 7.5 per cost, line average 64.4 (-88%)
- Warrior: single line at level 60: Hamstring does 8.5 per cost, line average 68.2 (-88%)
- Warrior: single line at level 70: Hamstring does 9.2 per cost, line average 101.4 (-91%)
- Warrior: single line at level 80: Hamstring does 10.2 per cost, line average 112.4 (-91%)
- Barbarian: single line at level 20: Rend does 7.0 per cost, line average 14.2 (-51%)
- Barbarian: single line at level 30: Rend does 8.6 per cost, line average 39.2 (-78%)
- Barbarian: single line at level 40: Rend does 10.1 per cost, line average 48.8 (-79%)
- Barbarian: single line at level 50: Rend does 11.6 per cost, line average 57.0 (-80%)
- Barbarian: single line at level 60: Rend does 13.1 per cost, line average 58.2 (-77%)
- Barbarian: single line at level 70: Rend does 14.1 per cost, line average 103.3 (-86%)
- Barbarian: single line at level 80: Rend does 15.6 per cost, line average 117.3 (-87%)
- Barbarian: group line at level 60: Earthshatter does 17.9 per cost, line average 76.5 (-77%)
- Barbarian: group line at level 70: Earthshatter does 20.0 per cost, line average 112.5 (-82%)
- Barbarian: group line at level 80: Earthshatter does 22.2 per cost, line average 127.5 (-83%)
- Paladin: single line at level 20: Holy Chains does 3.2 per cost, line average 7.5 (-57%)
- Paladin: single line at level 30: Holy Chains does 4.0 per cost, line average 15.9 (-75%)
- Paladin: single line at level 40: Holy Chains does 4.8 per cost, line average 20.8 (-77%)
- Paladin: single line at level 50: Holy Chains does 5.6 per cost, line average 30.8 (-82%)
- Paladin: single line at level 60: Holy Chains does 6.4 per cost, line average 31.6 (-80%)
- Paladin: single line at level 70: Holy Chains does 7.2 per cost, line average 60.0 (-88%)
- Paladin: single line at level 80: Holy Chains does 8.0 per cost, line average 65.8 (-88%)
- Paladin: group line at level 60: Holy Wrath does 6.0 per cost, line average 11.5 (-48%)
- Paladin: group line at level 70: Holy Wrath does 6.5 per cost, line average 12.7 (-49%)
- Paladin: group line at level 80: Holy Wrath does 6.8 per cost, line average 13.9 (-51%)
- Ranger: single line at level 20: Pinning Shot does 14.8 per cost, line average 19.2 (-23%)
- Ranger: single line at level 30: Poison Arrow does 7.5 per cost, line average 34.8 (-78%)
- Ranger: single line at level 40: Poison Arrow does 8.8 per cost, line average 56.3 (-84%)
- Ranger: single line at level 50: Poison Arrow does 10.2 per cost, line average 74.8 (-86%)
- Ranger: single line at level 60: Poison Arrow does 11.5 per cost, line average 75.8 (-85%)
- Ranger: single line at level 70: Poison Arrow does 12.3 per cost, line average 102.6 (-88%)
- Ranger: single line at level 80: Poison Arrow does 13.7 per cost, line average 107.1 (-87%)
- Ranger: group line at level 50: Swarm of Wasps does 5.5 per cost, line average 10.5 (-48%)
- Ranger: group line at level 60: Swarm of Wasps does 6.3 per cost, line average 11.9 (-47%)
- Ranger: group line at level 70: Swarm of Wasps does 6.3 per cost, line average 62.6 (-90%)
- Ranger: group line at level 70: Wrath of the Forest does 19.6 per cost, line average 62.6 (-69%)
- Ranger: group line at level 80: Swarm of Wasps does 7.0 per cost, line average 65.8 (-89%)
- Ranger: group line at level 80: Wrath of the Forest does 21.7 per cost, line average 65.8 (-67%)
- Archer: single line at level 20: Flaming Arrow does 8.8 per cost, line average 15.6 (-44%)
- Archer: single line at level 20: Pinning Shot does 3.9 per cost, line average 15.6 (-75%)
- Archer: single line at level 30: Flaming Arrow does 10.7 per cost, line average 35.7 (-70%)
- Archer: single line at level 30: Pinning Shot does 4.8 per cost, line average 35.7 (-87%)
- Archer: single line at level 40: Flaming Arrow does 12.6 per cost, line average 49.9 (-75%)
- Archer: single line at level 40: Pinning Shot does 5.7 per cost, line average 49.9 (-89%)
- Archer: single line at level 40: Cursed Arrow does 6.9 per cost, line average 49.9 (-86%)
- Archer: single line at level 50: Flaming Arrow does 14.4 per cost, line average 57.8 (-75%)
- Archer: single line at level 50: Pinning Shot does 6.6 per cost, line average 57.8 (-89%)
- Archer: single line at level 50: Cursed Arrow does 7.9 per cost, line average 57.8 (-86%)
- Archer: single line at level 50: Dragonbone Arrow does 9.3 per cost, line average 57.8 (-84%)
- Archer: single line at level 60: Flaming Arrow does 16.2 per cost, line average 58.7 (-72%)
- Archer: single line at level 60: Pinning Shot does 7.6 per cost, line average 58.7 (-87%)
- Archer: single line at level 60: Cursed Arrow does 9.0 per cost, line average 58.7 (-85%)
- Archer: single line at level 60: Dragonbone Arrow does 10.6 per cost, line average 58.7 (-82%)
- Archer: single line at level 70: Flaming Arrow does 17.6 per cost, line average 91.9 (-81%)
- Archer: single line at level 70: Pinning Shot does 8.4 per cost, line average 91.9 (-91%)
- Archer: single line at level 70: Cursed Arrow does 9.7 per cost, line average 91.9 (-90%)
- Archer: single line at level 70: Dragonbone Arrow does 11.8 per cost, line average 91.9 (-87%)
- Archer: single line at level 80: Flaming Arrow does 19.4 per cost, line average 108.2 (-82%)
- Archer: single line at level 80: Pinning Shot does 9.4 per cost, line average 108.2 (-91%)
- ... and 55 more of the same kind

**description-mismatch** (7)

- Archer: Dragonbone Arrow card says 70-100 damage, real average 352 at level 80
- Assassin: Death Warrant card says 80-110 damage, real average 389 at level 80
- Mage: Arcane Lance card says 40-55 damage, real average 213 at level 80
- Mage: Disintegrate card says 90-130 damage, real average 848 at level 80
- Sorcerer: Chain Lightning card says 35-50 damage, real average 215 at level 80
- Priest: Smiting Light card says 35-50 damage, real average 103 at level 80
- Goat: Headbutt card says 5-10 damage, real average 32 at level 80

**no-level-scaling** (1)

- Goat: Legend of the Mountain: 2030 at level 70, 2041 at level 80