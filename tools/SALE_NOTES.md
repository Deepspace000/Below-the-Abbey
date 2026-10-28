# Sale: notes for the next session

Sale is a grim gothic town of the dead, rated 90, 72 by 72, at the end of the future Blighted Lands road, west of Wenlock. Test link: `?town=sale&lvl=90` (AREAS in `jumpFromUrl`; the level cap for this link is 90).
Written on branch `worktree-agent-a022e2690ac14267d`. Nothing versioned, pushed or sent to itch.

## Level ids (a free range, checked against the whole source)
- 600 Sale (town). 601 The Hollow Cellar, 602 The Sale Crypt, 603 The Belfry of Sale.
- 604 to 619 reserved. 604 to 609 and 610 to 619 are STUBS (a bare room "The Blighted Road" with a cairn and a way back to Sale), so a link or a save that names them loads. The real road may replace them.
- 7200 to 7299 rooms behind doors: 7201 and up are one per entry of `SA_HOUSES` (ten shops, the gravedigger's and the bellman's cottages; houses that are not shops or cottages are sealed). **7299 is the Sanctuary (`SA.SANCT`), not built**: its door is a barred closed door, see below.
- All of these have `LEVEL_RATING` 90 and names set in `sale_ids.js`.

## Entrance and the road (what to attach later)
- The party arrives at `SA.START` = (67,36) facing west: the entrance square just inside the **east gate** (the iron gate tile is `SA.EAST` = (69,36), portal index 1 of level 600).
- At the moment the gate is locked ("not passable yet", flag `saRoadOpen`). **`saAttachRoad(toLevel, x, y, f)`** (sale_town.js) makes the gate lead to the road: it rewrites the portal and sets `G.flags.saRoadOpen`. Call it from the road code when it builds (and again when a game loads in Sale: `SA.ROAD` is remembered in memory only, so set it at start-up of the road file, before the town is built, or call it on arrival).
- The way back from the road should arrive at `SA.START` (x=67,y=36,f=3).
- World map: Sale is at (-462,292), road `westgate` to `sale` in `WORLD_ROADS`. `wvDefault` and the quest-focus view were widened (260*z to 700*z in three places in index.html) so far-west places can be centred.

## The Sanctuary
A gothic chapel (painted front `gyp_f_gothic` from assets/gy2) at the north of the square, x 32 to 36, y 25 to 29; door squares are the middle three of the front (34 and its neighbours), front square (34,30). Bumping the door says the plain line "Barred from inside. Someone is sheltering here." (`khBump` wrapper, KH_DOOR `sale:{sanct:1}`). No room is built. For Wren and Aldous Wend: give those three door gids (`SA.sanct`) a `lvl` and an `at`, build room 7299, and set a flag.

## Files (src/desert, appended at the END of tools/inject.py ORDER)
`sale_ids.js` ids and stubs; `sale_art.js` loader (Wenlock art via `wlLoad`, graveyard art via `gyLoad`, own art from assets/sa), ghosts made from painted folk, dark roofs and walls, floors, the dead (enemy defs), quest items, fog (`weatherNow`), arrival wrappers (`goToLevel`, `jumpToLevel`, `restore`, `restoreNow`); `sale_town.js` the layout tables (`SA_LOTS`, `SA_SPEC`, `SA_ROADS`, `SA_ZONES`), `saBuild`, barricade texture, doors, `saAttachRoad`; `sale_rooms.js` shop rooms (Wenlock rooms dimmed, no Wenlock folk), keepers, stock, the three small levels (`saMini`); `sale_folk.js` ghosts, the living, the hostility rule; `sale_quests.js` the ten quests, the voice behind the boards, rings; `sale_sound.js`; `maps_sale.js` area map, world map entry, Go to area rows.
Core edits in index.html (outside the injected block): `sale:[600,67,36,3]` in AREAS and the level cap 90 for it; `LEVEL===600` in the sky-sprite list (roofs); a wind line and a dungeon line in the ambience chain; the three `260*z` clamps (see above).

## Who is hostile (the rule)
Only inside `SA_ZONES`: **The Dead Quarter** (x 8 to 34, y 38 to 67: Charnel Row, its ruined houses, the Ropewalk Cottage door to the Hollow Cellar, the crypt stair, the Charnel Yard) and **Hollin Farm** (x 57 to 68, y 55 to 67). There live skeletons, pikemen, ghouls (11), zombies, wights, a bone priest, a bloated gravedigger and Sir Ranulf the Hollow. They wake only when the party is in the same zone and go quiet and walk home when it leaves (`enemyAct` wrapper). Everything else (Candle Street, Gibbet Square, Bell Lane, Tanners' Lane, the Back Track west of the farm, every shop front) is safe; the dead there are ghosts (peaceful, walk-through, talk). Living people: the shopkeepers behind their boards, Old Spade the gravedigger, Wick Tolliver the bellman, three survivors in the Hollow Cellar, Pip in the Belfry. Zone entry and exit print a line.

## The ten trust quests (journal area "Sale"; any order; reward gold/xp before the doubling of QREW_MUL)
| id | shop (keeper) | what you do | reward |
|---|---|---|---|
| sa1 | Pennyworth's Provisions (Tabitha Pennyworth) | collect 3 flasks of lamp oil lying in the ruined houses of Charnel Row | 300 / 4000 |
| sa2 | Ironbrow's Armoury (Sgt Hob Ironbrow) | kill Sir Ranulf the Hollow, a named wight at the Charnel Yard | 500 / 6500 |
| sa3 | Stroud and Daughter (Marta Stroud) | kill 8 ghouls (dead quarter or Hollin Farm; counted from taking the quest) | 500 / 6000 |
| sa4 | Marrowbone's Remedies (Old Nan Marrowbone) | rescue her 3 apprentices from the Hollow Cellar (601, door in the Ropewalk Cottage) | 600 / 7000 |
| sa5 | The Dead Letter Scriptorium (Ottoline Quill) | take a letter to the bellman on Bell Lane, bring his reply back | 300 / 4500 |
| sa6 | The Gilded Eye (Silvio Gilt) | retrieve the stolen shop sign from the ruined hut at Hollin Farm | 450 / 5500 |
| sa7 | Madame Veil, Mourning Tailor (Orla Veil) | rescue her nephew Pip from the top of the Belfry (603) | 700 / 8000 |
| sa8 | Crust and Cleaver (Hettie Mawd) | collect 4 sacks of rye flour from Hollin Farm | 350 / 4500 |
| sa9 | Vesper's Alembic (Orrin Vesper) | bring grave-salt from the vault of the Sale Crypt (602) | 800 / 9000 + Potion |
| sa10 | The Last Orders (Big Bram Cobb) | give 3 ales (handed over at the start) to the 3 ghost regulars in the square | 400 / 5000 |
Handing in (to the voice through the boards) removes the planks (door texture swapped, barricade marker hidden), sets `G.flags.sa_open_<shop>`, opens the door and changes the keeper's talk (a thank-you first, then the shop). Opening is re-applied from the flags on every arrival and every load (`saApplyDoors`, `saArrive`).

## Shops (level 90 stock; `KH_STOCK.sa_*`)
General (provisions, lamps, escape potions), armour and weapons (gear of levels 50 to 95), apothecary (herbs, healing ladder), books (scrolls, rings, mana), jeweller (every ring and amulet), tailor (cloth and light armour), butcher and baker (food), alchemist (potion ladder), tavern (food, ale, rooms 150 gold, news). Rooms are `WLIN_ROOMS['sa_<shop>']`, copies of Wenlock's, dimmed.

## Art
Reused (all painted): Wenlock folk, roofs and wall sheets, the graveyard's undead, ghosts, dead trees, stones, lanterns, bones, webs, the gothic front, vault front, iron gate, candelabra, bell. Ghost townsfolk are Wenlock/Oldhaven folk made pale and see-through in code (`saGhost`). The barricade is the painted door tile with dark planks nailed across it (a door texture made in code; the walls and doors may be); an invisible marker sprite carries the voice and the quest mark.
**Not done, stand-ins in use** (Claude in Chrome was not connected, so Gemini could not be reached): a painted gibbet (`sa_gibbet`, stand-in the raven post `gy_rpost`), a painted dead fountain (`sa_fountain`, stand-in a stone urn `gy_urn`), a painted plague cart (`sa_cart`, stand-in `kh_cart1_0`). Drop painted pieces into `assets/sa/` and list them in `assets/sa/manifest.json` (`{"gibbet":{"file":"gibbet.webp","h_cells":2.4},...}`, STRICT FRONT ELEVATION, magenta ground, cut with `tools/ingest_gy.py`-style code); the loader (`saLoadOwn`) and `saPrep` already prefer `IMG['sa_<name>']`.

## Tests (own server: `python -m http.server <port>` from the repo root; stop only your own PID; set `BTA_CHROME` and `SA_PORT`)
`python tools/sale_test.py all` runs about 60 checks (town builds, every shop barricaded, Sanctuary barred, flood fill of every road and door and person and item, zones, small levels and stubs, the east gate, all ten quests taken, done and handed in with the shop opened, sold from, entered, and kept by a save and load, quest rings, talk, no dashes). `shots` and `shots2` write screenshots and maps into `_sale_shots/` (git-ignored).

## Ideas not done
Lit windows in some houses at night; the dead quarter has no painted ground variants; the ghost folk are tinted copies (a dedicated sheet of ghost villagers would look better); only two enterable cottages; the cellar and crypt have no own maps (the plain map is used); the world-map picture is the atlas town plus graves.
