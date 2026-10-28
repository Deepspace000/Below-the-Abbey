# Infested houses: which towns, and how each builds its houses

Code: `src/desert/infested.js` (table `INF.TOWNS`, one row per town). Test: `python tools/infest_test.py [port] [town,town]` (needs `python -m http.server <port>` in the repo folder and Playwright with Chrome).
Jump links (AREAS in `jumpFromUrl`): `?town=infested`, `infestedwenlock`, `infestedyarrim`, `infestedthornwick`, `infestedironhill`, `infestedanaea`, and the same with `cellar` on the end (`infestedwenlockcellar`). Add `&lvl=8` for a weak party.

## Towns covered

| Town | How its houses are built | Which houses | Result in the test | Creatures |
|---|---|---|---|---|
| Oldhaven (305) | `khRoom`, ids 6000-6999, `b.id` `oh<n>` | 1 in 10 by hash | 25 of 311 | rat, bat, skel, bandit |
| Khemetra (44) | `khRoom`, ids from `khHouseId`, `b.id` `house<n>` | 1 in 10 by hash, kinds house/mansion/low | 27 of 428 | same |
| Wenlock (496) | `wlinMake` (wenlock_in.js) via `khRoom`, ids 7001-7099, `b.wlin` `home_*` | plain lots only (no special lot), never mill, barn, chapel, shops, inn, school, hall | 6 of 44 (7003, 7006, 7011, 7044, 7054, 7056) | rat, bat, skel, bandit at level 77 (town 80 less 3) |
| Yarrim (290) | `yarBuild` cottages via `khRoom` with a template, ids 1500-1515 | the 15 fisher cottages (1505 is the Steam House bath, never) | 3 of 15 (1508, 1509, 1510) | same, level 45 |
| Thornwick (3) | "locked houses" (camp.js `makeLockedHouse`): every house door tile of the town is a house, number 40000+town*10000+y*100+x, `b.id` `lh<n>` | 1 in 10 of the door tiles by hash | 24 of 214 | rat, rat, bat, bandit at level 4 |
| Ironhill (13) | locked houses, 3 door tiles (one is the bathhouse door) | at least 2 picks of 3 (so a tiny town is not left out); the bath door wins if picked | 1 of 3 | rat, bandit, bat at level 19 |
| Anaea (33) | locked houses, 4 door tiles (one is the bath) | at least 2 picks | 2 of 4 | rat, bat only (a peaceful valley), level 34 |

Rules everywhere: never shops, inns, temples, baths, chapels, the mill; never a house whose keeper or any resident gives a quest (`QGIVER`, checked on the finished room); never hoard houses (500 gold or more) or scripted rooms; never the purchasable plots of `housing.js` (those are open ground plots, not houses). Residents become bodies (corpse0..3), household pets simply go. Cleared state is in `G.flags.inf[level]`.

## Cellar level numbers (no clashes)

- house N in 1000-9999 (Oldhaven, Khemetra, Wenlock 7001-7099): N + 20000 (21000-29999; Wenlock cellars 27001-27099)
- Yarrim cottages 1500-1515: N + 19000 (20500-20515)
- locked houses (number 40000 and up): N + 6000000 (about 6.04 million and up)
Each cellar has a stub in `KH_LAZY` (houses) or is built by the wrapped `makeLockedHouse` (locked houses), so a save made inside a cellar loads. A save in a Wenlock or Yarrim cellar waits for the town pictures first.
The Yarrim cottage numbers 1500-1515 are now reserved at load (a stub that builds Yarrim first), because Khemetra's `khHouseId` could otherwise take them when the city was built before Yarrim.

## Surveyed and NOT covered (and why)

| Place | How houses are built | Reason |
|---|---|---|
| Thornwick named rooms (4 shop, 5 mayor, 6 inn, 9 Empty House, 29 chapel) | prebuilt `LEVELn_DATA` / `mkInterior` | shops, inn, mayor (quest giver), chapel; the Empty House is already a haunted quest room (ghosts quest) |
| Ironhill named rooms (14-17, 30, 271-274) | `mkInterior`, `new_shops.js` | castle, forge, inn, store, church, shops |
| Anaea named rooms (34-38, 40) | `mkInterior` | hall, inn, bakery, store, temple, cellars |
| Greendale (32) | open forest, no houses | none |
| Yarrim named rooms (291-299) | `yarrim_town.js` | inn, harbourmaster, ship dealer, trading post, chapel, quest houses (Maren, Net Loft, Light, Brine and Rope) |
| Oldhaven special rooms, Oldhaven quay (`oldhaven_quay.js`) | hand built | shops, quest houses |
| Monastery (Saint Elen's) | `monastery_build.js` | monks' rooms with keepers and quests, no ordinary dwellings |
| Wenlock mill, barn, windmill, dovecote, chapel | `wenlock_mill.js`, `wenlock_chapel.js` | not dwellings |
| Hollow Grasslands frog villages, Hollow Land towns (hgt_*, hollowgrass_*) | hand placed rooms | fishfolk and frog folk, every house tied to a language or story quest; no body art for them |
| Pilgrim's Path huts (6800-6812, 6904, 7108) | `landpath.js` | single hermit and quest houses, not a town |
| Black Swill, Witchwood, Gardens, Graveyard | own builders | not towns with dwellings |

## Weak spots

- The Thornwick locked-house count includes door tiles on the palisade ring, because every wall tile that gives a "locked door" message is a house in the existing design. About 1 in 10 of them are infested, as for the real doors.
- A locked-house door can still be locked: the party must pick it or find it on the latch as before. Infested houses are not special-cased.
- The bath door of Ironhill and Anaea is not known statically, so those towns pick 2 doors; if one is the bath, only one house is infested (Ironhill).
