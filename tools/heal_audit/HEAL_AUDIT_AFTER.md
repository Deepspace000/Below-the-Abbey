# Priest healing audit: AFTER the retune (fixed amounts, like potions)

Zero mismatches (`python tools/heal_audit/run_audit.py after`, `report.py`, `build_docs.py`). Files: `src/desert/heal_scaling.js` (the TIER table of amounts and costs is at the top), one extra argument at the three call sites (index.html quick Heal and powers, src/desert/spells.js), and a guard in `mxCast` so a pure heal or cleanse with nobody hurt costs no mana.

## The design

Heal spells restore a **fixed number of health points**, like the healing potions (30, 60, 90, 120, 210, 220, 450 health), not a percent of the patient's health. Hero health keeps growing (about 25 at level 1, 700 at 60, 1000 at 80), so the weak spells become mostly useless as the party levels, exactly like the weak potions, and the player moves up to the stronger spell.

`amount = (base + per-level x caster level) x (1 + healing bonus)`, rounded; the healing bonus is Faith (+20 percent from level 10) and Saint (+30 percent more at level 80), the same kind of bonus for every spell, so the level and Faith bonus can never lift a weak spell above a stronger one (every spell has a bigger base than the one below it in its line; the harness checks the order at every tested level). The heal is capped at what the patient is missing, and the number logged and floated is the number healed. There is no random spread (a heal crit, one cast in eight, adds three quarters more, capped the same way).

| spell | kind, unlocks | base | per level | mana (fixed) | amount at 1 / 30 / 60 / 70 / 80 (with Faith and Saint) |
|---|---|---|---|---|---|
| Heal | single, 1 | 10 | 0.4 | 3 | 10 / 26 / 41 / 46 / 63 |
| Greater Heal | single, 60 | 270 | 0.5 | 26 | - / - / 360 / 366 / 465 |
| Restoration | single, spell level 50 | 560 | 0.6 | 52 | - / - / 715 / 722 / 912 |
| Purify | group, spell level 10 | 8 | 0.3 | 9 | - / 20 / 31 / 35 / 48 |
| Mend | group, 30 | 30 | 0.4 | 19 | - / 50 / 65 / 70 / 93 |
| Divine Intervention | group, 70 | 100 | 0.4 | 45 | - / - / - / 154 / 198 |

**Mana** is fixed per spell (no level factor): Heal 3, Purify 9, Mend 19, Greater Heal 26, Divine Intervention 45. It is proportional to the health delivered over all allies (a group heal counts every ally), about 0.07 mana per hp at level 60 for every spell; the harness fails if any spell is more than 15 percent away from the line average at any level. Because the cost never grows, a weak spell stays cheap and simply stops mattering.

**Ordering.** Singles are compared with singles (Heal, Greater Heal, Restoration) and groups with groups (Purify, Mend, Divine Intervention), in absolute hp, strictly, at every level where both exist; a later spell also costs strictly more. Resurrection and Revive are unchanged.

Other classes (Paladin, Monk, Goat, scrolls) keep the old formula. Potions, inn rest, church and regeneration are not touched. Cards say, for example, "Restores about 41 health to the most wounded ally." for the priest in the party at their level, and the card amount equals the real amount at every level (checked). Screenshots: `shot_powers_L1.png`, `shot_powers_L60.png`.

## Obsolescence: amount as a percent of a typical hero's maximum health (average of the four heroes)

| level | typical max hp | Heal | Purify | Mend | Greater Heal | Restoration | Divine Intervention |
|---|---|---|---|---|---|---|---|
| 1 | 25 | 40.0% (10 hp) | - | - | - | - | - |
| 10 | 130 | 13.1% (17 hp) | 10.0% (13 hp) | - | - | - | - |
| 20 | 243 | 9.1% (22 hp) | 7.0% (17 hp) | - | - | - | - |
| 30 | 358 | 7.3% (26 hp) | 5.6% (20 hp) | 14.0% (50 hp) | - | - | - |
| 40 | 476 | 6.5% (31 hp) | 5.0% (24 hp) | 11.6% (55 hp) | - | - | - |
| 50 | 588 | 6.1% (36 hp) | 4.8% (28 hp) | 10.2% (60 hp) | - | 120.3% (708 hp) | - |
| 60 | 701 | 5.8% (41 hp) | 4.4% (31 hp) | 9.3% (65 hp) | 51.4% (360 hp) | 102.0% (715 hp) | - |
| 70 | 814 | 5.7% (46 hp) | 4.3% (35 hp) | 8.6% (70 hp) | 45.0% (366 hp) | 88.8% (722 hp) | 18.9% (154 hp) |
| 80 | 938 | 6.7% (63 hp) | 5.1% (48 hp) | 9.9% (93 hp) | 49.5% (465 hp) | 97.2% (912 hp) | 21.1% (198 hp) |

Targets met: at level 1 Heal restores 40 percent of a typical hero (wanted 30 to 60); at level 70 Heal restores 5.7 percent (3 to 6), the top single heal Greater Heal 45 percent (35 to 50). The priest has three single heals (Heal, Greater Heal, Restoration) and three group heals; Purify, Mend and Divine Intervention fill the middle as group heals (4 percent, 9 percent and 19 percent per ally at level 70).

## Restoration (new single heal, spell level 50, bought in the Spells tab like the other spells)

Learned the same way as Purify and the other priest spells: from level 50, for 3000 gold, in the priest's Spells tab (spells are bought there, not in a shop). Mana 52, fixed. It is the strongest single heal: about twice Greater Heal at every level (1.96 to 2.07 times), with the same kind of level and Faith bonus, so the order never inverts. Greater Heal is a power at level 60, so Restoration (level 50) unlocks before it, but it is stronger than both Heal and Greater Heal.

| level | amount | mana | hp per mana | % of typical max | Greater Heal amount | ratio |
|---|---|---|---|---|---|---|
| 40 | locked until level 50 (formula: 701) | 52 | 13.5 | 147.2% | 348 (formula) | 2.01 |
| 50 | 708 | 52 | 13.6 | 120.3% | 354 (not yet learned) | 2.00 |
| 60 | 715 | 52 | 13.8 | 102.0% | 360 | 1.99 |
| 70 | 722 | 52 | 13.9 | 88.8% | 366 | 1.97 |
| 80 | 912 | 52 | 17.5 | 97.2% | 465 | 1.96 |

## Level 60: old (percent of health) versus new (fixed hp)

| spell | old avg hp per ally | new hp per ally | old mana | new mana |
|---|---|---|---|---|
| Heal (L60) | 732 | 41 | 3 | 3 |
| Greater Heal (L60) | 922 | 360 | 17 | 26 |
| Mend (L60) | 252 | 65 | 15 | 19 |
| Purify (L60) | 171 | 31 | 12 | 9 |
| Divine Intervention (L70) | 342 | 154 | 32 | 45 |

The fixed amounts are much smaller than the earlier percent-of-health heals at level 60 and above, by design: only Greater Heal stays a serious heal (about half of a typical hero) at level 60.

## Mana per hp healed, all allies counted (the same for every spell within 15 percent)

| level | Heal | Greater Heal | Restoration | Purify | Mend | Divine Intervention |
|---|---|---|---|---|---|---|
| 1 | 0.300 | - | - | - | - | - |
| 10 | 0.176 | - | - | 0.173 | - | - |
| 20 | 0.136 | - | - | 0.132 | - | - |
| 30 | 0.115 | - | - | 0.113 | 0.095 | - |
| 40 | 0.097 | - | - | 0.094 | 0.086 | - |
| 50 | 0.083 | - | 0.073 | 0.080 | 0.079 | - |
| 60 | 0.073 | 0.072 | 0.073 | 0.073 | 0.073 | - |
| 70 | 0.065 | 0.071 | 0.072 | 0.064 | 0.068 | 0.073 |
| 80 | 0.048 | 0.056 | 0.057 | 0.047 | 0.051 | 0.057 |

## Checks at every level (1, 10, 20, 30, 40, 50, 60, 70, 80)

Mana deducted equals the listed cost and the card cost, exactly once, also for group casts; nothing deducted when nobody is hurt, when mana is short, or for a dead target; dead heroes are not healed; no healing above max health; the logged number is the number healed; the card amount equals the real amount; the cost never changes with level; the heal of a spell rises with level; a later spell in a line heals more hp and costs more; mana per hp within 15 percent across the line; the obsolescence targets above.

Harness: tools/heal_audit/run_audit.py (Playwright, the real heroSpecial, powerNew and mxCast), party levels 1 to 80 set through the real levelUp, priest = Wulfric. Per spell and level: casts with every ally at 1 hp (so the whole heal shows), then cap, full-health, low-mana and dead-hero tests. Heal crits are switched off in the averages (a crit adds three quarters more, one cast in eight).

Columns: cost = mana listed on the card = mana deducted; amount = health restored per ally (with Faith and Saint); allies = how many were healed; hp per mana = total health restored divided by cost; typical max = average maximum health of the four heroes at that level; % of typical = amount divided by that. The falling percent of the weaker spells is the intended obsolescence.

| level | spell | cost | mana | card amount | amount per ally | allies | hp per mana | typical max hp | % of typical max | cap behaviour |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Heal | 3 | 3.0 | 10 | 10 | 1 | 3.3 | 25 | 40.0 | never above max; shows 1, real 1 |
| 10 | Heal | 3 | 3.0 | 17 | 17 | 1 | 5.7 | 130 | 13.1 | never above max; shows 1, real 1 |
| 10 | Purify | 9 | 9.0 | 13 | 13 | 4 | 5.8 | 130 | 10.0 | never above max; shows 1, real 1 |
| 20 | Heal | 3 | 3.0 | 22 | 22 | 1 | 7.3 | 243 | 9.1 | never above max; shows 1, real 1 |
| 20 | Purify | 9 | 9.0 | 17 | 17 | 4 | 7.6 | 243 | 7.0 | never above max; shows 1, real 1 |
| 30 | Heal | 3 | 3.0 | 26 | 26 | 1 | 8.7 | 358 | 7.3 | never above max; shows 1, real 1 |
| 30 | Mend | 19 | 19.0 | 50 | 50 | 4 | 10.5 | 358 | 14.0 | never above max; shows 1, real 1 |
| 30 | Purify | 9 | 9.0 | 20 | 20 | 4 | 8.9 | 358 | 5.6 | never above max; shows 1, real 1 |
| 40 | Heal | 3 | 3.0 | 31 | 31 | 1 | 10.3 | 476 | 6.5 | never above max; shows 1, real 1 |
| 40 | Mend | 19 | 19.0 | 55 | 55 | 4 | 11.6 | 476 | 11.6 | never above max; shows 1, real 1 |
| 40 | Purify | 9 | 9.0 | 24 | 24 | 4 | 10.7 | 476 | 5.0 | never above max; shows 1, real 1 |
| 50 | Heal | 3 | 3.0 | 36 | 36 | 1 | 12.0 | 588 | 6.1 | never above max; shows 1, real 1 |
| 50 | Mend | 19 | 19.0 | 60 | 60 | 4 | 12.6 | 588 | 10.2 | never above max; shows 1, real 1 |
| 50 | Purify | 9 | 9.0 | 28 | 28 | 4 | 12.4 | 588 | 4.8 | never above max; shows 1, real 1 |
| 50 | Resurrection | 36 | 36.0 | none | 295 | 4 | 32.8 | 588 | 50.1 | never above max |
| 50 | Restoration | 52 | 52.0 | 708 | 708 | 1 | 13.6 | 588 | 120.3 | never above max; shows 1, real 1 |
| 60 | Heal | 3 | 3.0 | 41 | 41 | 1 | 13.7 | 701 | 5.8 | never above max; shows 1, real 1 |
| 60 | Mend | 19 | 19.0 | 65 | 65 | 4 | 13.7 | 701 | 9.3 | never above max; shows 1, real 1 |
| 60 | Greater Heal | 26 | 26.0 | 360 | 360 | 1 | 13.8 | 701 | 51.4 | never above max; shows 1, real 1 |
| 60 | Purify | 9 | 9.0 | 31 | 31 | 4 | 13.8 | 701 | 4.4 | never above max; shows 1, real 1 |
| 60 | Resurrection | 36 | 36.0 | none | 351 | 4 | 39.0 | 701 | 50.0 | never above max |
| 60 | Restoration | 52 | 52.0 | 715 | 715 | 1 | 13.8 | 701 | 102.0 | never above max; shows 1, real 1 |
| 70 | Heal | 3 | 3.0 | 46 | 46 | 1 | 15.3 | 814 | 5.7 | never above max; shows 1, real 1 |
| 70 | Mend | 19 | 19.0 | 70 | 70 | 4 | 14.7 | 814 | 8.6 | never above max; shows 1, real 1 |
| 70 | Greater Heal | 26 | 26.0 | 366 | 366 | 1 | 14.1 | 814 | 45.0 | never above max; shows 1, real 1 |
| 70 | Divine Intervention | 45 | 45.0 | 154 | 154 | 4 | 13.7 | 814 | 18.9 | never above max; shows 1, real 1 |
| 70 | Purify | 9 | 9.0 | 35 | 35 | 4 | 15.6 | 814 | 4.3 | never above max; shows 1, real 1 |
| 70 | Resurrection | 36 | 36.0 | none | 407 | 4 | 45.2 | 814 | 50.1 | never above max |
| 70 | Restoration | 52 | 52.0 | 722 | 722 | 1 | 13.9 | 814 | 88.8 | never above max; shows 1, real 1 |
| 80 | Heal | 3 | 3.0 | 63 | 63 | 1 | 21.0 | 938 | 6.7 | never above max; shows 1, real 1 |
| 80 | Mend | 19 | 19.0 | 93 | 93 | 4 | 19.6 | 938 | 9.9 | never above max; shows 1, real 1 |
| 80 | Greater Heal | 26 | 26.0 | 465 | 465 | 1 | 17.9 | 938 | 49.5 | never above max; shows 1, real 1 |
| 80 | Divine Intervention | 45 | 45.0 | 198 | 198 | 4 | 17.6 | 938 | 21.1 | never above max; shows 1, real 1 |
| 80 | Purify | 9 | 9.0 | 48 | 48 | 4 | 21.3 | 938 | 5.1 | never above max; shows 1, real 1 |
| 80 | Resurrection | 36 | 36.0 | none | 470 | 4 | 52.2 | 938 | 50.0 | never above max |
| 80 | Restoration | 52 | 52.0 | 912 | 912 | 1 | 17.5 | 938 | 97.2 | never above max; shows 1, real 1 |

Revive (power, not a heal) costs 18 at every level, raises one fallen ally at 40 percent, takes its mana once and refuses when nobody has fallen: unchanged. Resurrection (spell) revives everyone at 70 percent and heals the living for half: unchanged.

## MISMATCHES: none (0)
