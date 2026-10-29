# Below the Abbey: stats, 17 Oct to 29 Oct (v3.698)

| Stat | 17 Oct | 19 Oct | 20 Oct | 21 Oct | 22 Oct | 25 Oct | 29 Oct |
|---|---|---|---|---|---|---|---|
| Monster types | 91 | 95 | 114 | 141 | 172 | 202 | 286 |
| Quests | 190 | 197 | 221 | 221 | 246 | 262 | 373 |
| Named NPCs | 574 | 601 | 639 | 774 | 892 | 914 | 1,796 |
| Classes | 12 | 12 | 12 | 12 | 12 | 12 | 12 |
| Dungeons | 112 | ~165 | 288 | 288 | ~290 | 291 | ~305 |
| Named areas | ~175 | ~230 | 359 | ~363 | ~363 | n/a | n/a |
| Weapons | 77 | 77 | 80 | 80 | 87 | 89 | 121 |
| Rings | 8 | 29 | 29 | 29 | 29 | 33 | 50 |
| Helms | 23 | 23 | 25 | 26 | 26 | 34 | 41 |
| Body armour | 20 | 21 | 22 | 22 | 22 | 30 | 32 |
| Arm armour | 12 | 13 | 14 | 14 | 14 | 22 | 23 |
| Leg armour | 12 | 13 | 14 | 15 | 15 | 23 | 24 |
| Shields | 8 | 8 | 9 | 9 | 9 | 9 | 10 |
| Lights | 2 | 2 | 2 | 2 | 2 | 2 | 4 |

How the 29 Oct column was counted: the game was loaded headless and every lazily built area was built first. Monster types are the entries in `ENEMY_DEF` (280 different names). Quests are the keys of `QUESTS`. Named NPCs are the `NPCS` entries with a name (1,360 different names). Gear is `ITEMDEF` entries by kind. Dungeons are areas that are not outdoors and not building interiors (305 of 611 areas; the rule is the one used in `STATS_3.456.md`, but the owner's own rule is not known, so treat it as approximate). Named areas are left as n/a, as on 25 Oct.

Notes: the NPC count roughly doubled because the infested houses and the new western towns add many named people; four areas failed to build during the count (4 of 1,523), so numbers could be slightly low. Lights are now torch, Brass Lantern, Glow Orb and one more (not identified).
