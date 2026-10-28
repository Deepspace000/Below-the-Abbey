# Priest healing audit: BEFORE the retune

State of the game at the start of this task (healShare/healScaled of the earlier change, costs from healcost.js). Run with `python tools/heal_audit/run_audit.py before` then `report.py before`.

## Summary of what was wrong

1. **No spell heals what its card says.** Heal says "8-12", Mend "6-10", Greater Heal "24-34", Divine Intervention "35%". Real heals are a share of the patient's health: Heal 33 percent at level 1 and 76 percent at level 60, Greater Heal 96 percent at level 60, Mend 36 percent. Purify states 18 percent but heals 24 to 35 percent.
2. **Greater Heal is not greater than Heal.** At level 60 and above Heal already heals 76 to 100 percent of max health for 3 mana (a free full heal), and Greater Heal at 17 mana is at best equal (both 99.9 percent at level 80).
3. **Cost does not follow healing.** Mana per 100 percent of health delivered: Heal 3 to 4, Greater Heal 17, Mend 8 to 10, Purify 8 to 12, Divine Intervention 15. A bargain next to a trap.
4. **Overheal is counted in the log and floats.** A heal on someone 1 hp short of max shows "+370" while only 1 hp is gained (every heal spell, every level).
5. **Purify takes mana when nobody is hurt** (it cleanses, but with nothing to cleanse and nobody wounded the mana is simply lost).
6. **Divine Intervention is flat** (35 percent, never grows with level; only the Faith and Saint bonuses move it) and has no random variance.
7. **The call sites pass different "ranks":** the quick Heal passes 0.66 times the caster level, the powers pass the unlock level of the power, and spells pass the spell unlock level. So Greater Heal (unlock 60) and Heal (0.66 x level) did not even use the same scale.
8. Correct already: mana is deducted exactly once per cast (also group casts), exactly the listed cost, the card cost equals the cost deducted, a cast with too little mana is refused without deduction, no mana for casts with no hurt target (except Purify), nobody is healed above max, dead heroes are not healed by heals, Revive and Resurrection work.

Quick Heal and the Heal power are the same code path (heroSpecial), so they cannot differ.

Harness: tools/heal_audit/run_audit.py (Playwright, the real heroSpecial, powerNew and mxCast), party levels 1 to 80 set through the real levelUp, priest = Wulfric. Per spell and level: 30 casts with every ally at 1 hp (so the whole heal shows), 30 casts with allies at 20 to 30 percent, then cap, full-health, low-mana and dead-hero tests, plus one deterministic cast (random fixed at the middle) used for the ordering checks. Heal crits are switched off during the averages (a crit adds three quarters more, one cast in eight).

Columns: cost = listed on the card; mana = average actually deducted; text = the percent the description states; avg heal = per ally healed (hp, then percent of that ally's max health, allies at 1 hp); 20-30% = percent healed when allies start at 20 to 30 percent (limited by what is missing); allies = how many were healed; mana per 100% = cost divided by the total percent of health delivered over all allies, times 100.

| level | spell | cost | mana | text | avg heal | % of max | 20-30% | allies | mana per 100% | cap behaviour |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Heal | 3 | 3.0 | none | 11 | 33.4 | 32.7 | 1 | 9.0 | never above max; shows 9, real 1 |
| 10 | Heal | 3 | 3.0 | none | 71 | 40.6 | 40.7 | 1 | 7.4 | never above max; shows 36, real 1 |
| 10 | Purify | 12 | 12.0 | 18% | 33 | 27.1 | 26.9 | 4 | 11.1 | never above max; shows 37, real 1 |
| 20 | Heal | 3 | 3.0 | none | 156 | 47.3 | 48.1 | 1 | 6.3 | never above max; shows 82, real 1 |
| 20 | Purify | 12 | 12.0 | 18% | 57 | 24.2 | 24.1 | 4 | 12.4 | never above max; shows 76, real 1 |
| 30 | Heal | 3 | 3.0 | none | 262 | 54.3 | 54.8 | 1 | 5.5 | never above max; shows 120, real 1 |
| 30 | Mend | 15 | 15.0 | none | 129 | 36.0 | 36.1 | 4 | 10.4 | never above max; shows 174, real 1 |
| 30 | Purify | 12 | 12.0 | 18% | 83 | 23.9 | 23.8 | 4 | 12.5 | never above max; shows 110, real 1 |
| 40 | Heal | 3 | 3.0 | none | 400 | 61.5 | 62.5 | 1 | 4.9 | never above max; shows 174, real 1 |
| 40 | Mend | 15 | 15.0 | none | 172 | 36.2 | 35.8 | 4 | 10.4 | never above max; shows 253, real 1 |
| 40 | Purify | 12 | 12.0 | 18% | 110 | 23.8 | 24.0 | 4 | 12.6 | never above max; shows 147, real 1 |
| 50 | Heal | 3 | 3.0 | none | 556 | 69.3 | 69.3 | 1 | 4.3 | never above max; shows 276, real 1 |
| 50 | Mend | 15 | 15.0 | none | 214 | 36.3 | 36.3 | 4 | 10.3 | never above max; shows 275, real 1 |
| 50 | Purify | 12 | 12.0 | 18% | 140 | 24.8 | 24.7 | 4 | 12.1 | never above max; shows 181, real 1 |
| 50 | Resurrection | 36 | 36.0 | none | 295 | 50.1 | 50.1 | 4 | 18.0 | never above max |
| 60 | Heal | 3 | 3.0 | none | 732 | 76.5 | 76.4 | 1 | 3.9 | never above max; shows 370, real 1 |
| 60 | Mend | 15 | 15.0 | none | 252 | 35.9 | 36.2 | 4 | 10.5 | never above max; shows 347, real 1 |
| 60 | Greater Heal | 17 | 17.0 | none | 922 | 96.4 | 80.0 | 1 | 17.6 | never above max; shows 416, real 1 |
| 60 | Purify | 12 | 12.0 | 18% | 171 | 25.6 | 25.8 | 4 | 11.7 | never above max; shows 187, real 1 |
| 60 | Resurrection | 36 | 36.0 | none | 351 | 50.0 | 50.0 | 4 | 18.0 | never above max |
| 70 | Heal | 3 | 3.0 | none | 925 | 83.4 | 79.5 | 1 | 3.6 | never above max; shows 414, real 1 |
| 70 | Mend | 15 | 15.0 | none | 292 | 35.8 | 36.0 | 4 | 10.5 | never above max; shows 421, real 1 |
| 70 | Greater Heal | 17 | 17.0 | none | 1082 | 97.5 | 80.1 | 1 | 17.4 | never above max; shows 547, real 1 |
| 70 | Divine Intervention | 32 | 32.0 | none | 342 | 42.0 | 42.0 | 4 | 19.0 | never above max; shows 466, real 1 |
| 70 | Purify | 12 | 12.0 | 18% | 206 | 26.7 | 26.7 | 4 | 11.2 | never above max; shows 256, real 1 |
| 70 | Resurrection | 36 | 36.0 | none | 407 | 50.1 | 50.1 | 4 | 18.0 | never above max |
| 80 | Heal | 3 | 3.0 | none | 1291 | 99.9 | 80.0 | 1 | 3.0 | never above max; shows 699, real 1 |
| 80 | Mend | 15 | 15.0 | none | 422 | 45.0 | 45.3 | 4 | 8.3 | never above max; shows 639, real 1 |
| 80 | Greater Heal | 17 | 17.0 | none | 1291 | 99.9 | 80.0 | 1 | 17.0 | never above max; shows 673, real 1 |
| 80 | Divine Intervention | 32 | 32.0 | none | 493 | 52.5 | 52.5 | 4 | 15.2 | never above max; shows 678, real 1 |
| 80 | Purify | 12 | 12.0 | 18% | 310 | 35.1 | 34.9 | 4 | 8.5 | never above max; shows 371, real 1 |
| 80 | Resurrection | 36 | 36.0 | none | 470 | 50.0 | 50.0 | 4 | 18.0 | never above max |

Revive (power, not a heal) costs 18 at every level, raises one fallen ally at 40 percent, takes its mana once and refuses when nobody has fallen: unchanged. Resurrection (spell) revives everyone at 70 percent and heals the living for half: unchanged, it keeps its own rules.

## MISMATCHES (93)

- L1 Heal: overheal counted: log/float shows 9 but only 1 was healed
- L1 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L10 Heal: overheal counted: log/float shows 36 but only 1 was healed
- L10 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L10 Purify: mana deducted (12) when nobody was hurt
- L10 Purify: overheal counted: log/float shows 37 but only 1 was healed
- L10 Purify: description says 18 percent, real heal is 27.1 percent
- L20 Heal: overheal counted: log/float shows 82 but only 1 was healed
- L20 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L20 Purify: mana deducted (12) when nobody was hurt
- L20 Purify: overheal counted: log/float shows 76 but only 1 was healed
- L20 Purify: description says 18 percent, real heal is 24.2 percent
- L30 Heal: overheal counted: log/float shows 120 but only 1 was healed
- L30 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L30 Mend: overheal counted: log/float shows 174 but only 1 was healed
- L30 Mend: description states no real percent ("Heals every living ally for 6-10.")
- L30 Purify: mana deducted (12) when nobody was hurt
- L30 Purify: overheal counted: log/float shows 110 but only 1 was healed
- L30 Purify: description says 18 percent, real heal is 23.9 percent
- L40 Heal: overheal counted: log/float shows 174 but only 1 was healed
- L40 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L40 Mend: overheal counted: log/float shows 253 but only 1 was healed
- L40 Mend: description states no real percent ("Heals every living ally for 6-10.")
- L40 Purify: mana deducted (12) when nobody was hurt
- L40 Purify: overheal counted: log/float shows 147 but only 1 was healed
- L40 Purify: description says 18 percent, real heal is 23.8 percent
- L50 Heal: overheal counted: log/float shows 276 but only 1 was healed
- L50 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L50 Mend: overheal counted: log/float shows 275 but only 1 was healed
- L50 Mend: description states no real percent ("Heals every living ally for 6-10.")
- L50 Purify: mana deducted (12) when nobody was hurt
- L50 Purify: overheal counted: log/float shows 181 but only 1 was healed
- L50 Purify: description says 18 percent, real heal is 24.8 percent
- L60 Heal: overheal counted: log/float shows 370 but only 1 was healed
- L60 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L60 Mend: overheal counted: log/float shows 347 but only 1 was healed
- L60 Mend: description states no real percent ("Heals every living ally for 6-10.")
- L60 Greater Heal: overheal counted: log/float shows 416 but only 1 was healed
- L60 Greater Heal: description states no real percent ("Heals the most wounded ally for 24-34.")
- L60 Purify: mana deducted (12) when nobody was hurt
- L60 Purify: overheal counted: log/float shows 187 but only 1 was healed
- L60 Purify: description says 18 percent, real heal is 25.6 percent
- L70 Heal: overheal counted: log/float shows 414 but only 1 was healed
- L70 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L70 Mend: overheal counted: log/float shows 421 but only 1 was healed
- L70 Mend: description states no real percent ("Heals every living ally for 6-10.")
- L70 Greater Heal: overheal counted: log/float shows 547 but only 1 was healed
- L70 Greater Heal: description states no real percent ("Heals the most wounded ally for 24-34.")
- L70 Divine Intervention: overheal counted: log/float shows 466 but only 1 was healed
- L70 Divine Intervention: description states no real percent ("Heals every living ally for 35% of their maximum health.")
- L70 Purify: mana deducted (12) when nobody was hurt
- L70 Purify: overheal counted: log/float shows 256 but only 1 was healed
- L70 Purify: description says 18 percent, real heal is 26.7 percent
- L80 Heal: overheal counted: log/float shows 699 but only 1 was healed
- L80 Heal: description states no real percent ("Heals the most wounded ally for 8-12, and far more as the pr")
- L80 Mend: overheal counted: log/float shows 639 but only 1 was healed
- L80 Mend: description states no real percent ("Heals every living ally for 6-10.")
- L80 Greater Heal: overheal counted: log/float shows 673 but only 1 was healed
- L80 Greater Heal: description states no real percent ("Heals the most wounded ally for 24-34.")
- L80 Divine Intervention: overheal counted: log/float shows 678 but only 1 was healed
- L80 Divine Intervention: description states no real percent ("Heals every living ally for 35% of their maximum health.")
- L80 Purify: mana deducted (12) when nobody was hurt
- L80 Purify: overheal counted: log/float shows 371 but only 1 was healed
- L80 Purify: description says 18 percent, real heal is 35.1 percent
- L10 Heal: mana per percent healed is -20 percent from the line average (7.39 vs 9.24)
- L10 Purify: mana per percent healed is 20 percent from the line average (11.08 vs 9.24)
- L20 Heal: mana per percent healed is -32 percent from the line average (6.34 vs 9.36)
- L20 Purify: mana per percent healed is 32 percent from the line average (12.39 vs 9.36)
- L30 Heal: mana per percent healed is -42 percent from the line average (5.53 vs 9.49)
- L30 Purify: mana per percent healed is 32 percent from the line average (12.54 vs 9.49)
- L40 Heal: mana per percent healed is -47 percent from the line average (4.88 vs 9.28)
- L40 Purify: mana per percent healed is 36 percent from the line average (12.59 vs 9.28)
- L50 Heal: mana per percent healed is -51 percent from the line average (4.33 vs 8.92)
- L50 Purify: mana per percent healed is 35 percent from the line average (12.09 vs 8.92)
- L50 Mend: mana per percent healed is 16 percent from the line average (10.34 vs 8.92)
- L60 Heal: mana per percent healed is -64 percent from the line average (3.92 vs 10.93)
- L60 Greater Heal: mana per percent healed is 61 percent from the line average (17.63 vs 10.93)
- L70 Heal: mana per percent healed is -71 percent from the line average (3.60 vs 12.36)
- L70 Greater Heal: mana per percent healed is 41 percent from the line average (17.43 vs 12.36)
- L70 Mend: mana per percent healed is -15 percent from the line average (10.46 vs 12.36)
- L70 Divine Intervention: mana per percent healed is 54 percent from the line average (19.05 vs 12.36)
- L80 Greater Heal: does not heal a larger percent than Heal (99.9 vs 99.9, uncapped 100 vs 100)
- L80 Greater Heal: does not heal more than Heal in absolute amount (1291 vs 1291)
- L80 Heal: mana per percent healed is -71 percent from the line average (3.00 vs 10.43)
- L80 Greater Heal: mana per percent healed is 63 percent from the line average (17.01 vs 10.43)
- L80 Purify: mana per percent healed is -18 percent from the line average (8.55 vs 10.43)
- L80 Mend: mana per percent healed is -20 percent from the line average (8.32 vs 10.43)
- L80 Divine Intervention: mana per percent healed is 46 percent from the line average (15.24 vs 10.43)
- L20 Purify: percent healed did not rise with level (24.2 after 27.1)
- L30 Purify: percent healed did not rise with level (23.9 after 24.2)
- L40 Purify: percent healed did not rise with level (23.8 after 23.9)
- L60 Mend: percent healed did not rise with level (35.9 after 36.3)
- L70 Mend: percent healed did not rise with level (35.8 after 35.9)