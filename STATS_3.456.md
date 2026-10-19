# Statistics, 20 October 2026 (version 3.456)

| | 17 October 2026 | 19 October 2026 | 20 October 2026 |
|---|---|---|---|
| Monster types | 91 (88 distinct names) | 95 (92 distinct names) | 114 (111 distinct names) |
| Quests | 190 | 197 | 221 |
| NPCs with a name | 574 (460 distinct names) | 601 (489 distinct names) | 639 (523 distinct names) |
| Classes | 12 | 12 | 12 |
| Dungeons | 112 (74 underground) | about 165 (about 95 underground) | 288 (258 underground) |
| Named areas (towns, wilds, dungeons, sea) | about 175 (173 distinct) | about 230 | 359 (195 distinct names) |

Gear (one column; the first column is the owner's pasted figure, the second is counted today)

| | Pasted | 20 October 2026 |
|---|---|---|
| Weapons | 77 | 80 |
| Rings | 29 | 29 |
| Helms | 23 | 25 |
| Body armour | 21 | 22 |
| Arm armour | 13 | 14 |
| Leg armour | 13 | 14 |
| Shields | 8 | 9 |
| Lights (torch and lantern) | 2 | 2 |

## How each number was counted

Everything was counted by loading the game headless (Playwright, Chromium, 15 s wait) and reading the live objects.
Where a count needs every area, I first built every lazily built area (the `KH_LAZY` table) so that no area is missing.

- **Monster types**: number of entries in `ENEMY_DEF`, and the number of different `name` values. This reproduces the 17 October
  figure exactly when run on the old build (v3.283 gives 91 and 88). 114 includes the 19 Hollow Grasslands creatures
  (insects, swarms, hive guards and bosses), which are the whole difference from the 19 October 95.
- **Quests**: number of keys in `QUESTS` after the game has loaded. v3.283 gives exactly 190.
- **NPCs with a name**: number of `NPCS` entries that have a name, after all areas are built, and the number of different names.
  v3.283 gives exactly 574 and 460.
- **Classes**: `CLASSES.length`, 12 (Warrior, Barbarian, Paladin, Ranger, Archer, Thief, Assassin, Mage, Sorcerer, Priest,
  Monk, Goat).
- **Gear**: `ITEMDEF` entries by kind: weapon 80, ring 29, head 24, chest 22, arms 14, legs 14, shield 9, light 2.
  Helms are 25 because the Warlord's Helm is a helm that the code files under the wrong kind (see the bug below).
  v3.283 gives 77 weapons and 8 shields like the pasted column, so the pasted gear column was counted some time after
  17 October but before today (rings 8 then, 29 now).

### Numbers I could not reproduce exactly

- **Dungeons**: counted as every area that is not outdoors and not a building interior (house, shop, inn, church; those have a
  `beam` ceiling). That gives 288 today (145 distinct names, because the wild ruins and caves share names). On v3.283 the same
  rule gives 109, close to the owner's 112, so this is probably the right idea, but not exactly the owner's rule. The
  "underground" figure is a judgement: 288 minus the sealed stair and the Hollow Land (5), the Orange Spire (21) and the four
  hives, which leaves 258. I could not reproduce the owner's 74 or 95 with any clean rule, so treat the underground figure as soft.
  The growth since the 19 October figure is the 148 generated wild caves, ruins and cellars along the Pilgrim's Path.
- **Named areas**: outdoor areas (towns, wilds, sea, 71) plus the 288 dungeons above, building interiors left out, giving 359.
  Distinct names are 195. On v3.283 the same rule gives 179 (153 distinct), against the owner's about 175 (173 distinct), so the
  total is near but the distinct figure is not. The Pilgrim's Path counts as 24 areas here (one per segment) and the generated
  wild dungeons repeat their names, which is why the distinct count is so much lower than the total.
- **19 October column**: copied from the owner's table. The build at the end of 19 October (v3.445) already counted 114 monster types
  and 221 quests, so the owner's 19 October figures were taken earlier in the day.

### A bug found while counting

The Warlord's Helm in `src/desert/gear.js` (line 85, `ga('warlordhelm',"Warlord's Helm",'Helm',...)`) leaves out the `'head'`
kind argument, so every other argument shifts one place and the item is stored with the kind "Warlord's Helm". It is probably not
wearable in the head slot. It was not changed.
