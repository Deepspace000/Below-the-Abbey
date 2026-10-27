# Shop tiers: notes (flag ON since 2026-10-27)

## Why the playtest saw only plain gear
- Aldous's Store, Fenwick's Goods (MERCHANT_STOCK), Brannoch's Forge (SMITH_STOCK), Dorn's Store (MERCHANT_STOCK), the Witch's Shelf (WITCH_STOCK), the hunter's pack and the Peddler's Cart in the crypts (SHOP_STOCK) sold only white gear and a few plain potions. The bot never opened the four Ironhill buildings (Steelhold Blades, Ironhill Plate and Mail, The Cauldron, Corvin's Arcana), which sold ungated tiered gear (KH_STOCK.sword / armour2 / potion2 = GEAR_STOCK, shared with Khemetra, no mage cloth in armour2).
- Brannoch and Dorn are in Ironhill (levels 15, 17). Thornwick (level 3, rating 7) has only Aldous's Store (level 4) and the Witch (level 24). Anaea (level 33, rating 37) has only Fenwick's Goods (level 37) as a gear shop (the Golden Crust, level 36, sells food).
- Playtest party levels: Thornwick 10 to 19 (gold 300 to 3,100), Ironhill 23 to 31 (gold 4,200 to 7,600). Anaea is reached at about level 31.

## What exists (src/desert/shop_tiers.js, last in tools/inject.py ORDER)
- `const ST_ENABLED=true` at the top. False: no shop changes at all (the new items still exist, nothing sells them). True: the new stock and the door fix are on.
- New items (st_ ids, 24 of them): 10 daggers and 10 staves (levels 1 to 40, 150 to 4,200 gold), Morning Star, Iron-Rimmed Shield, Chain Sleeves, Chain Leggings. Icons are recoloured plain icons (gearTintIcons wrap). Added in this round: Wraith Knife (35, 3,300), Kingsbane (40, 4,200), Dawnwood Staff (35, 3,300), Archmage's Staff (40, 4,200).
- `ST_SHOPS` has one table per shop title. The `openShop` wrapper adds goods whose item level is at most party level + 5 (or an explicit third number in the row) each time a shop opens. A table with `replace:1` throws the old stock away (Steelhold Blades, Ironhill Plate and Mail, The Cauldron); the others keep the old stock.
- Shops now covered: Aldous's Store, The Witch's Shelf, The Hunter's Pack (Gandrick's Wood, standing near the Bandit Cache door), Brannoch's Forge, Dorn's Store, Steelhold Blades, Ironhill Plate and Mail, The Cauldron, Fenwick's Goods (Anaea), and the Peddler's Cart in the crypts (the only cart that is a shop; the carts in Ironhill, the Mines, the Moor and the Pass are lootable scenery, not shops).
- The cart is opened with openLoot, not openShop, so an `openLoot` wrapper builds its first stock (`stCartTable`, by level).
- Persistence: what a shop has put out (`d.tierSeen`) is now saved with the level (sparseDecor / applySparseDecor wrappers). Before this, loading a game restocked every curated shop and re-added bought-out pieces. A shop that was opened before the flag was on counts its old stock as put out.
- Door fix: Corvin's Arcana and The Cauldron stand in the woods of Ironhill's north side; trees stood on their doors and across the way, so the party could not walk in (PT.takePortal 'noexit', and act('fwd') into the trees does nothing). `stClearDoors` finds the cheapest way from each door to ground the party can reach and removes the trees and rocks on it (8 pieces, only with the flag on). The two south shops were already reachable.
- Aldous's and Fenwick's greetings no longer say that they sell nothing fancy.

## Tiers (colour by price; the game has no tier names)
White under 120, green under 400, blue under 1,100, red under 2,600, purple under 6,500, orange above (effective price: helm x1.6, arms x2.2, legs x2). Rings: green 310 to 360, blue to 820, red to 1,100, purple to 1,500.

| Shop | Plan | Count of new gear by tier at the top party level (G / B / R / P) |
|---|---|---|
| Aldous's Store (party 10 to 19) | green to blue (to 900) | 20 / 22 / 0 / 0 |
| The Witch's Shelf | staves and cloth, green to blue | 7 / 6 / 1 / 0 |
| The Hunter's Pack (party 7 to 14) | green to blue | 11 / 10 / 0 / 0 |
| Peddler's Cart, crypts (party 1 to 4) | green only, seven pieces | 7 / 0 / 0 / 0 |
| Brannoch's Forge (party 23 to 31) | blue and red | 1 / 11 / 14 / 0 |
| Dorn's Store | everyday, blue at most | 8 / 22 / 2 / 0 |
| Steelhold Blades | blue to red, odd purple | 0 / 8 / 20 / 6 |
| Ironhill Plate and Mail | blue to red, odd purple | 1 / 10 / 20 / 3 |
| The Cauldron | potions (white to blue) | none |
| Fenwick's Goods (party 31 to 40) | red and purple | 0 / 3 / 26 / 32 |

Ironhill note: the lvl 5 blue weapons (bastard, beardaxe, flanged, longbow, kris, runed staff) were taken out of Brannoch's Forge and replaced by lvl 10 ones, and the Boarhide set (a level 10 set) was taken out of Ironhill Plate and Mail, because they are 13 levels below the party that arrives (23). Dorn's Store still has them on purpose (everyday gear). Steelhold, Plate and Mail and the Cauldron no longer sell the top of the old ladder (level 35 and up) before Khemetra; their stock is gated by party level.

## Checks done (2026-10-27, playwright on port 8374, scripts were in the session scratchpad, not kept)
- Item tables printed per shop at the playtest party levels (Aldous 10 to 19, Brannoch/Dorn/Steelhold/Plate 23 to 31, Hunter 7 to 14, Fenwick 31 to 40). Tiers read as planned, no duplicate lines, no white-only shop left.
- Coverage: for all 12 classes at every checked level the shops sell a usable weapon of the class's kind and every armour slot, within 0 to 5 levels of the hero's level (the exceptions are inherent: Mage, Sorcerer and Assassin cannot meet a shield's STR).
- Purchases through the shop screen's own buttons, then equip, for one piece per slot per class in Hunter, Thornwick, Ironhill and Anaea: 266 slots OK, 0 failures, prices paid as listed, an item above the hero's level is refused. (Stock counts are 1 per piece, so the 4 heroes of a party share one piece of each kind.)
- Selling: gold goes up by exactly sellPriceR, the item leaves the bag.
- Save and load: a bought-out piece stays gone, a curated shop is not reset. An old save (shop opened before the flag) gets the new goods once, with no duplicates and no re-stock of what was bought.
- Top-up as the party levels (Aldous 3 to 12 to 19): new lines appear once, none twice.
- Walked in with the real movement code (tools/playtest/lib.js): Aldous, Brannoch, Dorn, Steelhold, Plate and Mail, the Cauldron, Corvin's Arcana, Fenwick, the crypt cart; the hunter by moving the party next to him (the gate into Gandrick's Wood is not walkable for the bot; the party also dies there at level 9 with no gear).
- Title screen and game load with the flag on: no console errors; the 66 asset 404s (icn_*.png, sp_*.png when served from the repo root) are the same with the flag off.

## Left to do
- The new pieces have no painted icons (recoloured plain icons). Paint daggers and staves, and the chain, if wanted (art rules in CLAUDE.md).
- Everything is count 1 per piece (like Khemetra). A party of four wanting the same helm cannot all buy it.
- Not touched: Corvin's Arcana stock (spells), the Golden Crust and the Passing Cart and Caravan (food), Khemetra and every later town (Oldhaven, Wenlock, the Hollow), orange tier.
- The Hunter's Pack was tested by moving the party next to him; check the walk from Gandrick's Wood by hand.
- A balance playtest with the shops on (does gold now go somewhere, are Act 1 fights easier): rerun tools/playtest.
