# The Pale Spire: gothic gear (src/desert/ps_gear.js)

26 unique pieces, level 100 (lvl 100, rar 1, price 0, gear 1, ids `pg_*`, globals `PGR*`). 12 weapons (two each of Sword, Axe, Mace, Bow, Staff, Dagger), 10 armour pieces (two each of head, chest, arms, legs, shield), 4 rings.
Each is 31 to 40 percent above the best of its slot elsewhere in the game (Sword 610, Mace 485, Bow 550, Dagger 375, Axe 330, Staff 225 with magic 180 and 192, chest 62, head 24, shield 26, legs 19, arms 15, ring ward 20).
Palette: dark violet, black, antique brass, verdigris, bone. State: `G.flags.psp.pg.got[itemId]`; a piece is given once. Test: `python tools/pg_test.py` (own server, PS_PORT, BTA_CHROME).

How a piece is found: boss = guaranteed drop the first time the boss dies (hurtEnemy hook); quest = id appended to `QUESTS[q].reward.items` (a full bag puts it on the ground); riddle = chest in a dead end, plain question about the castle, a wrong answer wakes two creatures and the chest may be tried again; key = chest that opens only for a quest item found on the level.
Chests are placed after the level builds (`KH_LAZY[id]` wrapper, `pgrSpot` picks a reachable dead end far from doors, rest rooms, safe zones and the waystone).

## Where everything is

| Level | Piece | Slot | How |
|---|---|---|---|
| 9720 Approach (outside) | Pilgrim's Mourning Greaves `pg_pilgrimlegs` | legs | riddle chest: how many tokens lie about the road (nine) |
| 9720 Approach (outside) | Cairn-Stone Band `pg_cairnring` | ring | key chest: a pilgrim's token (or psq1 done) |
| 9721 Gatehouse | Tollbell Greatsword `pg_tollblade` | Sword | boss: The Gate Captain |
| 9721 Gatehouse | Raven-Beak Helm `pg_ravenhelm` | head | riddle chest: the dead man in the loft (a Road Warden) |
| 9722 Winch Loft | Portcullis-Wire Bow `pg_winchbow` | Bow | key chest: the Warden's Horn `pshorn` |
| 9722 Winch Loft | Road Warden's Vambraces `pg_harrowarms` | arms | quest psq35 (the horn, handed to Harrow) |
| 9723 Porter's Lodge | Votive Shield of the Nine Tokens `pg_votiveshield` | shield | quest psq1 |
| 9723 Porter's Lodge | Porter's Keyblade `pg_keyblade` | Dagger | quest psq2 |
| 9730 Court (outside) | Tearstone Maul `pg_tearmaul` | Mace | boss: The Weeping Colossus |
| 9730 Court (outside) | Gargoyle-Wing Cleaver `pg_gargcleaver` | Axe | boss: Mother Gargoyle |
| 9731 Gardener's Lodge | Briar Rose Band `pg_briarring` | ring | quest psq4 |
| 9731 Gardener's Lodge | Briarwood Rood Staff `pg_briarstaff` | Staff | boss: The Thorn Warden (the hedge Hobb clipped badly; he stands in the Court) |
| 9732 Mews | Falconer's Last Bow `pg_falconbow` | Bow | key chest: the Hound Master's whistle `pswhistle` |
| 9732 Mews | Falconer's Mourning Gauntlets `pg_falconarms` | arms | quest psq5 |
| 9740 Great Halls | Plate of the Black Cathedral `pg_cathedralplate` | chest | boss: The Stair Warden |
| 9740 Great Halls | Crown of a Hundred Candles `pg_candlecrown` | head | riddle chest: the bird on Isaude's signet (a heron) |
| 9750 Kitchens and Armoury | The Steward's Reckoning `pg_reckoning` | Mace | boss: The Pale Steward |
| 9750 Kitchens and Armoury | Cobweb-Mail Leggings `pg_cobweblegs` | legs | riddle chest: what the Steward counts besides servants (the spoons) |
| 9760 Cloister, Chapel, Library | Blade of the Weeping Saint `pg_weepingedge` | Sword | boss: The Pale Sacristan |
| 9760 Cloister, Chapel, Library | Staff of the Last Candle `pg_candlestaff` | Staff | quest psq23 |
| 9780 Undercroft Gaols | The Questioner's Hook `pg_questioner` | Dagger | boss: The Questioner |
| 9780 Undercroft Gaols | Ring of the Silent Question `pg_silencering` | ring | riddle chest: colour of the string on Hob Garrick's tin (red) |
| 9790 Deep Cells | Drowned Gaoler's Headsman `pg_gaolheadsman` | Axe | boss: The Drowned Gaoler |
| 9790 Deep Cells | Drowned Bell Ring `pg_bellring` | ring | quest psq33 |
| 9800 Oubliette | Reliquary Plate of the Pit `pg_pitplate` | chest | boss: The Hunger in the Hole |
| 9800 Oubliette | Bulwark of the Last Dawn `pg_dawnshield` | shield | quest psq37 |

Known quirk outside this file: `ps_court.js` gives Ossian's Statue Hammer `stun:[.15,1]` (an array); the weapon code wants a number, so that stun never fires. Not touched here.

## Rule for every new floor: two more pieces

Every new floor gets two more pieces, level 100 (or the floor's rating if higher), 25 to 40 percent above the current best of their slot. Steps: add the items with `pgrItem(...)` in `ps_gear.js` (or a `ps_gear2.js` after it), add rows to `PGR.PLACE` as `[item, level, how, ref]`, add chests to `PGR.CHESTS` (riddle: `foe` list and `ans`; key: `key` item), list the level in `tools/pg_test.py` chest loop, add the icon to `tools/PS_GEAR_ICONS.md`. Mix the ways: one boss or quest, one riddle, key or secret. Riddles use only things the party can learn on the castle's levels (plaques, talk, statue names). Plain literal text, no dashes.

## 24 planned pieces for floors 9820 to 9990 (names and slots only)

| Floor | Piece | Slot |
|---|---|---|
| 9820 State Rooms | Chandelier-Chain Whip-Sword | Sword |
| 9820 State Rooms | Mantle of the Dead Chamberlain | chest |
| 9830 West Wing | Bedchamber Warming-Pan Mace | Mace |
| 9830 West Wing | Veil-Ring of the Widowed Queen | ring |
| 9840 East Wing | Quill of the Great Library | Staff |
| 9840 East Wing | Cowl of the Council | head |
| 9850 Curtain Wall Walk | Murder-Hole Crossbow-Bow | Bow |
| 9850 Curtain Wall Walk | Battlement Pavise | shield |
| 9860 Wintergarden | Frostbloom Pruning Axe | Axe |
| 9860 Wintergarden | Glasshouse Greaves | legs |
| 9870 Terrace Maze | Moonlit Stiletto | Dagger |
| 9880 Hall of Mirrors | Mirror-Shard Gauntlets | arms |
| 9890 Moon Tower | Orrery Staff of the Pale Moon | Staff |
| 9900 Bell Tower | Great Bell Clapper Maul | Mace |
| 9900 Bell Tower | Ringer's Rope Band | ring |
| 9910 Raven Tower | Murder of Ravens Helm | head |
| 9920 Alchemist's Tower | Retort-Glass Vial Blade | Dagger |
| 9930 Upper Keep | Reliquary Cuirass of Saint Elen | chest |
| 9930 Upper Keep | Treasury Warden's Greatsword | Sword |
| 9940 Hanging Forest | Hanging Tree Longbow | Bow |
| 9950 Maze of Mirrors | Silvered Leggings | legs |
| 9960 Donjon Stair | Executioner's Spire Axe | Axe |
| 9980 Throne Room | Shield of the Pale Sovereign | shield |
| 9990 Crown of the Spire | Crown-Thorn Ring | ring |
