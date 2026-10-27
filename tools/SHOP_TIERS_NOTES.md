# Shop tiers: handover notes (work paused, flag OFF)

## Why the playtest saw only plain gear
- Brannoch's Forge (SMITH_STOCK) and Dorn's Store / Aldous's Store (MERCHANT_STOCK) and the Witch's Shelf (WITCH_STOCK) sell only white gear. The bot never opened the four Ironhill buildings (ih_swordsmith "Steelhold Blades", ih_armourer "Ironhill Plate and Mail", ih_alchemist "The Cauldron", Corvin's Arcana), which already sold ungated tiered gear (KH_STOCK.sword / armour2 / potion2 = GEAR_STOCK, shared with Khemetra, no mage cloth in armour2).
- Brannoch and Dorn are in IRONHILL (levels 15, 17). Thornwick (level 3, rating 7) has only Aldous's Store (level 4) and the Witch (level 24).
- Playtest party levels: Thornwick 10 to 19 (gold 300 to 3,100), Ironhill 23 to 31 (gold 4,200 to 7,600).

## What exists (src/desert/shop_tiers.js, last in tools/inject.py ORDER, injected, parses, no console errors)
- `const ST_ENABLED=false` at the top. False: no shop changes at all. True: new stock on.
- New items (always defined, harmless): 8 daggers, 8 staves (st_ ids, levels 1 to 30, 150 to 2,600 gold), Morning Star, Iron-Rimmed Shield, Chain Sleeves, Chain Leggings; icons are recoloured plain icons (gearTintIcons wrap).
- `ST_SHOPS` per shop title; `openShop` wrapper adds goods with item level <= party level + 5 each time the shop opens (old stock kept for Aldous, Brannoch, Dorn, Witch; curated replace for Steelhold Blades, Plate and Mail, The Cauldron). Aldous's "Nothing fancy" line is changed.
- Plan: Thornwick green to early blue (to 900 gold); Ironhill blue to red, odd purple (2,600 to 2,800) late.

## Tested
- With the flag on: stock lists built correctly at party levels 10/19 (Thornwick) and 23/31 (Ironhill), no console errors (counts: Aldous 69-71, Witch 21-26, Brannoch 45-47, Dorn 59-60, Steelhold 29-34, Plate 24-38, Cauldron 16).

## Not done
- Printing the item table (script: scratchpad tbl.py idea: openShop(d,stock,name) with a fake decor d={} then read d.contents).
- Real purchases/equips per class, selling check, walking into the shops, title load check with flag on.
- Tier colours by price: white <120, green <400, blue <1100, red <2600, purple <6500, orange above (effective price x1.6 helm, x2.2 arms, x2 legs; rings: green 310-360, blue to 820, red to 1100, purple to 1500).

## Turn on and test
Set ST_ENABLED=true, `python tools/inject.py`, serve the repo (own port), open `?town=ironhill&lvl=23&gear=0`, buy and equip one item per class, check the console.
