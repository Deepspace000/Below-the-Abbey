# Stall shop bindings

Written by `tools/stall_shop/gen_md.py` from the live game (`stlTable()` in `src/desert/stall_shop.js`, run by `tools/stall_shop/run.py`).
A stall here is a piece of town decor that did nothing when pressed: a market stall, tent, cart, barrow, wagon or counter that is not a person, chest, shop or door.
Pressing one (click, or the use key and pad button while facing it) opens the shop page of the nearest shopkeeper within six steps on foot, 
the one standing behind it first. With nobody near it shows a short line about the stall. Painted stalls of the Deeper Hollow (hgstall_*) have no decor of their own;
their click area leads to their keeper. Stalls that are people or shops of their own (npc, shop, loot) keep what they do and are only counted under "kept".

## By level

| Level | Name | Stalls | Bound | Decorative | Kept (own job) |
|---|---|---|---|---|---|
| 3 | Thornwick | 1 | 0 | 1 | - |
| 13 | Ironhill | 2 | 0 | 2 | - |
| 32 | Greendale Forest | 0 | 0 | 0 | - |
| 33 | Anaea | 0 | 0 | 0 | - |
| 44 | Khemetra, the Golden City | 133 | 0 | 133 | kh_cart1_0 [npc] x10 |
| 290 | Yarrim | 0 | 0 | 0 | kh_cart1_0 [npc] x1 |
| 304 | Oldhaven Quay | 4 | 3 | 1 | - |
| 305 | Oldhaven | 30 | 0 | 30 | - |
| 311 | The Oakwood | 0 | 0 | 0 | - |
| 364 | The Hollow Land | 0 | 0 | 0 | - |
| 430 | Saint Elen’s Monastery | 0 | 0 | 0 | - |
| 470 | The Hollow Grasslands | 0 | 0 | 0 | - |
| 475 | The Deeper Hollow | 84 | 43 | 41 | - |
| 481 | Exsce | 0 | 0 | 0 | - |
| 482 | Ulb | 23 | 0 | 23 | - |
| 483 | Glorm | 212 | 2 | 210 | cart [shop] x9 |
| 484 | Nibb | 24 | 0 | 24 | - |
| 490 | The Maze of Gardens | 0 | 0 | 0 | - |
| 496 | Wenlock | 11 | 10 | 1 | - |
| 520 | Blackbriar Wood | 0 | 0 | 0 | - |

Total: 20 levels with a scan, 524 stalls found, 58 bound to a shopkeeper, 466 decorative.

## Every binding

### Level 3, Thornwick

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| cart (cart) | 21,23 | nobody within range | - | flavour line | - |

### Level 13, Ironhill

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| cart (cart) | 33,16 | nobody within range | - | flavour line | - |
| cart (cart) | 26,25 | nobody within range | - | flavour line | - |

### Level 44, Khemetra, the Golden City

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| kh_stall1_2 (stall) | 98,102 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 100,102 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 103,102 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 108,102 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 113,102 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 115,102 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 282,102 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 284,102 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 287,102 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 292,102 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 297,102 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 299,102 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 98,107 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 103,107 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 108,107 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 110,107 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 113,107 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 282,107 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 287,107 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 292,107 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 294,107 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 297,107 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 98,112 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 103,112 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 105,112 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 113,112 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 282,112 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 287,112 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 289,112 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 292,112 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 297,112 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 98,117 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 103,117 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 105,117 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 108,117 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 113,117 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 282,117 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 284,117 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 287,117 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 292,117 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 297,117 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 299,117 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 98,290 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 100,290 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 103,290 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 108,290 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 113,290 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 115,290 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 118,290 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 123,290 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 274,290 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 276,290 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 279,290 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 284,290 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 289,290 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 291,290 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 294,290 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 299,290 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 98,295 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 100,295 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 103,295 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 108,295 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 113,295 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 115,295 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 118,295 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 123,295 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 274,295 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 276,295 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 279,295 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 284,295 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 289,295 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 291,295 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 294,295 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 299,295 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 98,300 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 100,300 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 103,300 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 108,300 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 113,300 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 115,300 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 118,300 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 123,300 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 274,300 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 276,300 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 279,300 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 284,300 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 289,300 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 291,300 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 294,300 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 299,300 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 98,305 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 100,305 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 103,305 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 108,305 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 113,305 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 115,305 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 118,305 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 123,305 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 274,305 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 276,305 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 279,305 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 284,305 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 289,305 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 291,305 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 294,305 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 299,305 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 188,312 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 190,312 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 193,312 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 198,312 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 203,312 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 205,312 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 208,312 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 188,317 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 193,317 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 195,317 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 198,317 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 203,317 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 208,317 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 210,317 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 188,322 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 193,322 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 198,322 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 200,322 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 203,322 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 208,322 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 188,327 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 190,327 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 193,327 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 198,327 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 203,327 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 205,327 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 208,327 | nobody within range | - | flavour line | - |

### Level 304, Oldhaven Quay

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| oq_stall (stall) | 26,13 | Marta, the fishwife | oq_fm1 | Marta's Fish Stall | 1 |
| oq_stall (stall) | 54,18 | nobody within range | - | flavour line | - |
| oq_stall (stall) | 26,19 | Big Hobb, the fishmonger | oq_fm2 | Hobb's Stall | 3 |
| oq_stall (stall) | 26,25 | Pol, the quay cook | oq_fm3 | The Quay Kitchen | 1 |

### Level 305, Oldhaven

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| kh_stall1_0 (stall) | 104,46 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 107,46 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 110,46 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 113,46 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 103,48 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 113,48 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 104,52 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 107,52 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 110,52 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 113,52 | nobody within range | - | flavour line | - |
| kh_stall2_1 (stall) | 108,56 | nobody within range | - | flavour line | - |
| kh_stall2_2 (stall) | 112,56 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 108,79 | nobody within range | - | flavour line | - |
| kh_stall2_1 (stall) | 115,79 | nobody within range | - | flavour line | - |
| kh_stall2_2 (stall) | 122,79 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 106,84 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 114,84 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 122,84 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 105,88 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 109,88 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 113,88 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 117,88 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 121,88 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 125,88 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 110,90 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 118,90 | nobody within range | - | flavour line | - |
| kh_stall1_5 (stall) | 126,90 | nobody within range | - | flavour line | - |
| kh_stall2_3 (stall) | 108,95 | nobody within range | - | flavour line | - |
| kh_stall2_4 (stall) | 115,95 | nobody within range | - | flavour line | - |
| kh_stall2_5 (stall) | 122,95 | nobody within range | - | flavour line | - |

### Level 475, The Deeper Hollow

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| hgstall_arms (painted stall) | 123,9 | Dagny, the weaponsmith of Tessera | hgd_s2_arms6 | Weaponsmith | 0 |
| art_hpb_ore_cart_6 (cart) | 71,11 | nobody within range | - | flavour line | - |
| hgstall_trader (painted stall) | 128,19 | Harl, the trader of Tessera | hgd_s2_trader6 | General Trader | 0 |
| hgstall_general (painted stall) | 142,19 | Orbin, the gold-trader | hgd_shop7 | Orbin, the gold-trader | 0 |
| hgstall_general (painted stall) | 115,20 | Tomm, the tile-trader | hgd_shop6 | Tomm, the tile-trader | 0 |
| hgstall_magic (painted stall) | 120,22 | Lorn, the magic seller of Tessera | hgd_s2_magic6 | Magic Seller | 0 |
| hgstall_armour (painted stall) | 125,22 | Bram, the armourer of Tessera | hgd_s2_armour6 | Armourer | 0 |
| hgstall_trader (painted stall) | 137,22 | Dorrit, the trader of Gildmere | hgd_s2_trader7 | General Trader | 0 |
| hgstall_armour (painted stall) | 148,23 | Hedda, the armourer of Gildmere | hgd_s2_armour7 | Armourer | 0 |
| hgstall_arms (painted stall) | 135,25 | Tor, the weaponsmith of Gildmere | hgd_s2_arms7 | Weaponsmith | 0 |
| hgtb_stall_rose_lanterns (stall) | 148,30 | nobody within range | - | flavour line | - |
| hgstall_magic (painted stall) | 137,33 | Isolde, the magic seller of Gildmere | hgd_s2_magic7 | Magic Seller | 0 |
| hgstall_armour (painted stall) | 17,34 | Tilde, the armourer of Blue Lantern | hgd_s2_armour5 | Armourer | 0 |
| art_hpb_mine_cart_7 (cart) | 199,34 | nobody within range | - | flavour line | - |
| art_hpb_ore_cart_6 (cart) | 133,37 | nobody within range | - | flavour line | - |
| hgstall_general (painted stall) | 33,39 | Ilse, the apothecary | hgd_shop5 | Ilse, the apothecary | 0 |
| hgstall_arms (painted stall) | 19,43 | Mara, the weaponsmith of Blue Lantern | hgd_s2_arms5 | Weaponsmith | 0 |
| hgstall_magic (painted stall) | 35,48 | Anwen, the magic seller of Blue Lantern | hgd_s2_magic5 | Magic Seller | 0 |
| hgstall_trader (painted stall) | 30,52 | Nell, the trader of Blue Lantern | hgd_s2_trader5 | General Trader | 0 |
| art_hpb_ore_cart_4 (cart) | 65,61 | nobody within range | - | flavour line | - |
| art_hpb_mine_cart_4 (cart) | 152,71 | nobody within range | - | flavour line | - |
| hgstall_magic (painted stall) | 41,81 | Quill, the magic seller of Dunewell | hgd_s2_magic4 | Magic Seller | 0 |
| hgstall_trader (painted stall) | 46,84 | Cask, the trader of Dunewell | hgd_s2_trader4 | General Trader | 0 |
| hgstall_armour (painted stall) | 33,87 | Rolf, the armourer of Dunewell | hgd_s2_armour4 | Armourer | 0 |
| hgstall_arms (painted stall) | 49,89 | Varn, the weaponsmith of Dunewell | hgd_s2_arms4 | Weaponsmith | 0 |
| yar_tent (tent) | 177,90 | nobody within range | - | flavour line | - |
| hgstall_magic (painted stall) | 73,93 | Mirel, the magic seller of Nacre Landing | hgd_s2_magic3 | Magic Seller | 0 |
| hgstall_general (painted stall) | 47,94 | Hask, the well-keeper | hgd_shop4 | Hask, the well-keeper | 0 |
| hgstall_armour (painted stall) | 77,94 | Edda, the armourer of Nacre Landing | hgd_s2_armour3 | Armourer | 0 |
| hgstall_arms (painted stall) | 84,97 | Osk, the weaponsmith of Nacre Landing | hgd_s2_arms3 | Weaponsmith | 0 |
| art_hpb_ore_cart_4 (cart) | 195,99 | nobody within range | - | flavour line | - |
| hgstall_general (painted stall) | 84,108 | Pearla, the shell-trader | hgd_shop3 | Pearla, the shell-trader | 0 |
| hgstall_trader (painted stall) | 87,109 | Wren, the trader of Nacre Landing | hgd_s2_trader3 | General Trader | 0 |
| hgtb_stall_orange_pottery (stall) | 63,127 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 107,129 | nobody within range | - | flavour line | - |
| hgstall_trader (painted stall) | 56,134 | Tobb, the trader of Combwick | hgd_s2_trader2 | General Trader | 0 |
| hgtb_stall_orange_pottery (stall) | 66,136 | Sela, the comb-seller | hgd_shop2 | Sela, the comb-seller | 4 |
| hgstall_general (painted stall) | 70,136 | Sela, the comb-seller | hgd_shop2 | Sela, the comb-seller | 0 |
| hpa_crysTall (stall) | 103,137 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 79,139 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 111,140 | nobody within range | - | flavour line | - |
| hgstall_magic (painted stall) | 68,141 | Vesper, the magic seller of Combwick | hgd_s2_magic2 | Magic Seller | 0 |
| hgstall_arms (painted stall) | 55,142 | Ketter, the weaponsmith of Combwick | hgd_s2_arms2 | Weaponsmith | 0 |
| hgstall_armour (painted stall) | 61,143 | Aldric, the armourer of Combwick | hgd_s2_armour2 | Armourer | 0 |
| hpa_crysTall (stall) | 69,146 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 99,146 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 115,154 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 96,155 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 58,159 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 75,159 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 89,160 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 105,161 | nobody within range | - | flavour line | - |
| hgstall_magic (painted stall) | 12,165 | Orrin, the magic seller of Cairnhold | hgd_s2_magic1 | Magic Seller | 0 |
| hgstall_general (painted stall) | 15,165 | Dwen, the stone-smith | hgd_shop1 | Dwen, the stone-smith | 0 |
| hpa_crysTall (stall) | 191,167 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 55,168 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 95,169 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 39,171 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 63,171 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 83,171 | nobody within range | - | flavour line | - |
| hgstall_armour (painted stall) | 11,173 | Sigrun, the armourer of Cairnhold | hgd_s2_armour1 | Armourer | 0 |
| hgstall_arms (painted stall) | 25,174 | Hild, the weaponsmith of Cairnhold | hgd_s2_arms1 | Weaponsmith | 0 |
| hgstall_magic (painted stall) | 113,175 | Syl, the magic seller of Hedgefoot | hgd_s2_magic0 | Magic Seller | 0 |
| hpa_crysTall (stall) | 29,176 | Hild, the weaponsmith of Cairnhold | hgd_s2_arms1 | Weaponsmith | 6 |
| hpa_crysTall (stall) | 1,177 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 9,177 | Sigrun, the armourer of Cairnhold | hgd_s2_armour1 | Armourer | 6 |
| hpa_crysTall (stall) | 187,177 | nobody within range | - | flavour line | - |
| hgstall_trader (painted stall) | 20,178 | Sabel, the trader of Cairnhold | hgd_s2_trader1 | General Trader | 0 |
| hgstall_general (painted stall) | 102,178 | Marl, the Hedgefoot grocer | hgd_shop0 | Marl, the Hedgefoot grocer | 0 |
| hgstall_armour (painted stall) | 117,178 | Gunnar, the armourer of Hedgefoot | hgd_s2_armour0 | Armourer | 0 |
| hpa_crysTall (stall) | 37,179 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 47,179 | nobody within range | - | flavour line | - |
| hgstall_arms (painted stall) | 110,180 | Brand, the weaponsmith of Hedgefoot | hgd_s2_arms0 | Weaponsmith | 0 |
| hpa_crysTall (stall) | 21,181 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 60,181 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 23,184 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 1,186 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 191,186 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 51,189 | nobody within range | - | flavour line | - |
| hgstall_trader (painted stall) | 110,189 | Pim, the trader of Hedgefoot | hgd_s2_trader0 | General Trader | 0 |
| hpa_crysTall (stall) | 177,189 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 199,192 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 25,194 | nobody within range | - | flavour line | - |
| hpa_crysTall (stall) | 11,197 | nobody within range | - | flavour line | - |

### Level 482, Ulb

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| hgtb_stall_orange_pottery (stall) | 93,8 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 100,8 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 107,8 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 33,52 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 36,52 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 39,52 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 42,52 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 30,62 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 33,62 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 36,62 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 39,62 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 42,62 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 69,121 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 81,121 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 85,121 | nobody within range | - | flavour line | - |
| kh_stall1_4 (stall) | 87,121 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 89,121 | nobody within range | - | flavour line | - |
| kh_stall1_3 (stall) | 61,128 | nobody within range | - | flavour line | - |
| kh_stall1_2 (stall) | 89,128 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 65,129 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 85,129 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 63,131 | nobody within range | - | flavour line | - |
| kh_stall1_1 (stall) | 87,131 | nobody within range | - | flavour line | - |

### Level 483, Glorm

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| hgtb_stall_orange_pottery (stall) | 76,15 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 73,16 | nobody within range | - | flavour line | - |
| counter (counter) | 76,16 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 76,17 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 73,18 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 57,22 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 63,22 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 69,22 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 81,22 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 87,22 | nobody within range | - | flavour line | - |
| counter (counter) | 73,24 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 76,24 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 73,25 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 76,26 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 73,27 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 48,31 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 54,31 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 60,31 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 66,31 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 78,31 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 84,31 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 96,31 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 76,33 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 73,34 | nobody within range | - | flavour line | - |
| counter (counter) | 76,34 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 76,35 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 73,36 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 51,40 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 57,40 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 63,40 | nobody within range | - | flavour line | - |
| counter (counter) | 66,40 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 69,40 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 81,40 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 87,40 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 93,40 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 99,40 | nobody within range | - | flavour line | - |
| counter (counter) | 73,42 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 76,42 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 73,43 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 76,44 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 73,45 | nobody within range | - | flavour line | - |
| counter (counter) | 45,49 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 48,49 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 54,49 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 60,49 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 66,49 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 78,49 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 84,49 | nobody within range | - | flavour line | - |
| counter (counter) | 87,49 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 90,49 | nobody within range | - | flavour line | - |
| counter (counter) | 93,49 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 96,49 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 102,49 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 76,51 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 73,52 | nobody within range | - | flavour line | - |
| counter (counter) | 76,52 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 76,53 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 73,54 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 45,58 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 51,58 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 57,58 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 63,58 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 69,58 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 81,58 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 87,58 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 93,58 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 99,58 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 105,58 | nobody within range | - | flavour line | - |
| counter (counter) | 73,60 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 76,60 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 73,61 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 76,62 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 73,63 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 36,67 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 42,67 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 48,67 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 54,67 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 60,67 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 66,67 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 84,67 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 90,67 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 96,67 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 102,67 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 108,67 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 38,71 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 42,71 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 46,71 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 50,71 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 54,71 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 58,71 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 62,71 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 66,71 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 82,71 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 86,71 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 90,71 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 94,71 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 98,71 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 102,71 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 106,71 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 110,71 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 38,76 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 42,76 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 46,76 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 50,76 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 54,76 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 58,76 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 62,76 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 66,76 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 82,76 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 86,76 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 90,76 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 94,76 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 98,76 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 102,76 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 106,76 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 110,76 | nobody within range | - | flavour line | - |
| counter (counter) | 37,78 | nobody within range | - | flavour line | - |
| counter2 (counter) | 89,78 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 38,81 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 42,81 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 46,81 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 50,81 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 54,81 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 58,81 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 62,81 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 86,81 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 90,81 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 94,81 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 98,81 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 102,81 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 106,81 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 110,81 | nobody within range | - | flavour line | - |
| counter2 (counter) | 58,82 | nobody within range | - | flavour line | - |
| counter2 (counter) | 95,84 | nobody within range | - | flavour line | - |
| counter2 (counter) | 55,85 | nobody within range | - | flavour line | - |
| counter2 (counter) | 43,91 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 38,92 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 42,92 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 46,92 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 50,92 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 54,92 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 58,92 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 62,92 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 86,92 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 38,97 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 42,97 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 46,97 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 50,97 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 54,97 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 62,97 | Lantern seller | hgx_lantern | Lantern seller | 3 |
| hgtb_stall_orange_pottery (stall) | 86,97 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 38,102 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 42,102 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 46,102 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 50,102 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 54,102 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 58,102 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 62,102 | Lantern seller | hgx_lantern | Lantern seller | 6 |
| hgtb_stall_sage_herbs (stall) | 86,102 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 36,108 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 40,108 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 48,108 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 52,108 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 60,108 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 64,108 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 84,108 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 88,108 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 96,108 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 100,108 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 108,108 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 112,108 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 36,111 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 40,111 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 48,111 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 52,111 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 60,111 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 64,111 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 84,111 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 88,111 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 96,111 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 100,111 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 108,111 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 112,111 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 36,114 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 40,114 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 48,114 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 52,114 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 60,114 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 64,114 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 84,114 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 88,114 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 96,114 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 100,114 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 108,114 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 112,114 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 36,117 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 40,117 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 48,117 | nobody within range | - | flavour line | - |
| hgtb_stall_lilac_cloth (stall) | 52,117 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 60,117 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 64,117 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 84,117 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 88,117 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 96,117 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 108,117 | nobody within range | - | flavour line | - |
| hgtb_stall_sage_herbs (stall) | 112,117 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 75,127 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 66,131 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 84,131 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 66,133 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 84,133 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 75,137 | nobody within range | - | flavour line | - |

### Level 484, Nibb

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| kh_stall1_0 (stall) | 79,5 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 62,12 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 103,14 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 63,16 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 109,23 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 120,33 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 76,62 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 72,63 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 80,63 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 68,64 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 87,69 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 62,71 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 88,73 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 61,75 | nobody within range | - | flavour line | - |
| hgtb_stall_coral_fruit (stall) | 89,77 | nobody within range | - | flavour line | - |
| hgtb_stall_rose_lanterns (stall) | 62,79 | nobody within range | - | flavour line | - |
| hgtb_stall_aqua_jars (stall) | 88,81 | nobody within range | - | flavour line | - |
| hgtb_stall_navy_books (stall) | 63,83 | nobody within range | - | flavour line | - |
| hgtb_stall_yellow_bread (stall) | 82,88 | nobody within range | - | flavour line | - |
| hgtb_stall_orange_pottery (stall) | 70,89 | nobody within range | - | flavour line | - |
| hgtb_stall_pink_flowers (stall) | 78,89 | nobody within range | - | flavour line | - |
| hgtb_stall_teal_fish (stall) | 74,90 | nobody within range | - | flavour line | - |
| kh_stall1_0 (stall) | 85,133 | nobody within range | - | flavour line | - |
| kh_stall2_0 (stall) | 62,144 | nobody within range | - | flavour line | - |

### Level 496, Wenlock

| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |
|---|---|---|---|---|---|
| kh_stall1_0 (stall) | 43,46 | An apple seller | wlo_stall1 | The Fruit Stall | 2 |
| kh_stall1_1 (stall) | 46,46 | A spice seller | wlo_stall5 | The Spice Stall | 2 |
| kh_stall1_3 (stall) | 50,46 | Clay the potter | wlo_potter | The Pottery Stall | 2 |
| kh_stall1_4 (stall) | 53,46 | A fishwife | wlo_stall3 | The Fish Stall | 1 |
| kh_stall2_3 (stall) | 41,48 | An egg woman | wlo_stall4 | Eggs and Greens | 1 |
| kh_stall2_0 (stall) | 55,48 | A melon seller | wlo_stall7 | The Melon Stall | 1 |
| kh_stall2_1 (stall) | 41,52 | A jar seller | wlo_stall8 | The Jar Stall | 1 |
| kh_stall2_2 (stall) | 55,52 | A jeweller | wlo_stall6 | The Jewellery Stall | 2 |
| kh_stall1_2 (stall) | 43,54 | Silas, a pedlar | wlo_pedlar | The Cloth and Rug Stall | 2 |
| kh_stall1_5 (stall) | 54,54 | A jeweller | wlo_stall6 | The Jewellery Stall | 1 |
| kh_stall2_3 (stall) | 34,72 | nobody within range | - | flavour line | - |

