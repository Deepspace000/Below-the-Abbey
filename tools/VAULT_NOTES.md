# The Vault of Maldrake (place 7 of the Blighted Road): HANDOVER

Branch `worktree-agent-a89ef4a59fd2097fa`, nothing versioned, pushed or sent to itch (VERSION is untouched). Levels 9670 to 9678, rated 88 to 89.

## What is built

| Level | Name | Rating | What is in it |
|---|---|---|---|
| 9670 | The Barrow Hill (outside) | 88 | 64 by 56 blighted hill under grey-green mist. Road along the south with a gate at each end (east to Lanternrest, west to Hollowbell). A path winds up in switchbacks past 14 barrows (7 open, with the dead coming out), a ring of standing stones, leaning stones, dead trees, pale lanterns, to a terrace and the front of the Vault (three tiles, name plaque MALDRAKE, angels, urns, lanterns). Garrison picket at the foot: two tents, fire, wrecked wagon with a skeleton horse, barrels, the teleporter stone, Sergeant Hale (quest giver) and Corporal Wick. South of the road the ruins of Underhill: ruined chapel, three cottages, the well with the silver skin, fences, two chests. 29 creatures. Real terrain heights (a slope up to the terrace). |
| 9671 | The Barrow Stair | 88 | Vestibule, Hall of Guards (8 sarcophagi, hidden ambush plate), Cells (Private Fenn, a survivor, gives a hint and a potion), Scribe's Alcove (journal page 1, chest), passage with two spike plates (walk down the middle), Warden's Hall with the Barrow Warden (mini boss, silver key), FIRST PALE-SILVER LOCK. |
| 9672 | The Ossuary of the Roll | 88 | Reading Room with the Roll of Underhill, Gravedigger's Rest (journal page 2, chest guarded by two plates), Cold Store, the RING OF COFFINS: eight coffins round a rune, to be opened in the order the village died (the Roll gives the order, the plates give the names; a wrong lid resets the ring and two ghouls climb out). Opening all eight opens the Coffin Gate. |
| 9673 | The Bell Gallery | 88 | Five bells (Miller, Great, Child, Priest, Widow) with a plate each; the peal is Child, Widow, Miller, Priest, Great (journal page 3 in the Ringers' Room, the founder's ledger in the loft). Each bell has its own pitch; a wrong bell resets and a shade and a banshee come. The peal opens the SECOND LOCK. |
| 9674 | The Silvered Cellars | 89 | Counting Hall (journal page 4: the Pale Factor's letters), three sigil rooms: the Room of Needles (46 plates, one lane), the Hounds' Den (hidden plate, five hounds), the Silvered Hall (two giants, pikes, a mage). Three Silver Sigils open the THIRD LOCK (three discs of light). |
| 9675 | The Hall of Underhill | 89 | The long supper table with twelve seated dead villagers (each its own line), 11 walking dead, chapel, Maldrake's old study (journal page 5, the red-eyed bookcase that opens the SECRET DOOR to the archive). |
| 9676 | The Stair of Quiet | 89 | Stair hall with statues and journal page 6, the Hall of Plates (15 plates, lanes), two side vaults, the Silver Warden's Landing: the Silver Warden (mini boss, Sanctum Seal), FOURTH LOCK. |
| 9677 | Maldrake's Sanctum | 89 | Apse with his table and two dark mirrors (the Sovereign watches), twelve memorial candles, one man. Hard boss fight or the sympathy ending. |
| 9678 | The Secret Archive | 89 | Bookcases, his desk with the Silver Contract, journal page 7, a chest with 9,000 gold, Hesper's ghost (his wife, who died before the silver came). |

The teleporter is on the hill only (`L.tele`, 9670 added to `TELE_KEEP_HI`); every floor is `noTele`. Every floor has its own parchment map (`mplInstall` name 'vault', numbered places, key, torches as coloured dots, pale-silver locks as pale discs, stairs as gold discs) and rows in the Go to area list.

## Story and endings

Wystan Maldrake kept the barrows of Underhill (12 households, 81 people) and was the village's nearest thing to a doctor. The grey fever came; the Pale Sovereign's agent (the Pale Factor) offered silver that would mend it, for a small service; Maldrake signed. The silver let them die and then stood them up again; the ring he cannot take off turns them out to walk the Road at night. He sealed himself under the hill behind five pale-silver locks (a key, a peal, three sigils, a seal, and a ring of coffins) "so that nobody is hurt and so that I cannot do worse", and left his journal for whoever came who had read this far. He keeps the Gate Key of Sale for the Sovereign.

* Sympathy: find the Silver Contract in the secret archive (red-eyed book, old study, floor 5), bring it to Maldrake, read it clause by clause, he agrees, the ring breaks. Reward: Gate Key of Sale, Ring of the Quiet Silver, the spell Quiet the Dead for every hero (id vtquiet, `MX_POWER`), 10,000 gold and 60,000 xp, a potions set, story page "A Quiet Hill". He sits down and watches the hill clear.
* Fight: ask for the key; he says the ring will not let him give it; the party fights a hard level 89 boss (25,800 health, dmg 332 to 556, three phases: the dead of Underhill climb up at two thirds and at one third, the ring flares, he weeps while he casts, a mend every 7 rounds). Reward: Gate Key of Sale, Maldrake's Black Staff, the ring (lore), potions; the dead of Underhill still walk. Story page "The Key from the Barrow".
* Both give the key. Hale reacts differently to each.

## Quests (all main quests, area "The Blighted Lands")

| Id | Title | Giver | What | Reward (before the x2 quest rule) |
|---|---|---|---|---|
| bl7a | The Dead on the Hill | Hale | kill 8 of the dead on the hill | 3,000 gold, 20,000 xp, potion |
| bl7b | Down the Barrow Stair | Hale (finishes by itself) | first lock open, ring of coffins done, second lock open | 4,000 gold, 30,000 xp, potion, mana |
| bl7c | What Maldrake Wrote | Hale (finishes by itself) | find 4 of the 6 journal pages | 5,000 gold, 36,000 xp, elixir |
| bl7d | The Last Locks | Hale (finishes by itself) | third lock (sigils), last lock (seal), reach the Sanctum | 6,000 gold, 45,000 xp, mana, elixir |
| bl7e | The Gate Key of Sale | Hale (hand in on the hill) | take the Gate Key from Maldrake and show Hale | 12,000 gold, 70,000 xp, Underhill Well Ring |

QNEXT chains them. Rings are in `QRF.T.bl7a..e` (vault_story.js); gold ! and green ? over Hale come from `QGIVER.vto_hale`. Story So Far pages (9) are `STORY.push` in vault_story.js; `storyNext` hints are there too (they only speak when the vault is the party's current business).

## Files

`src/desert/vault_core.js` (ids, creatures, items, spell, loading, weather, sound, lights, locks, traps, road links, loot), `vault_build.js` (the floor maker, plate floor, gate tiles, ASCII dump and reach check for tests), `vault_floors.js` (the eight plans and what stands in them), `vault_hill.js` (the hill), `vault_boss.js` (the three fights), `vault_story.js` (people, books, puzzles, quests, story, rings, maps, Go to list, jump links). All appended at the end of `ORDER` in `tools/inject.py` (keep every name when merging). Two small edits outside the injected block, both in `index.html`: a line after the blackswill line in `jumpFromUrl` (AREAS getters for `vault` and `vaultboss`), and the ray limit of the wall loop, `while(guard++<(LEVEL===530||LEVEL===9670?100:64))` (the hill's road is 60 squares long, and rays that run out draw white stripes at the horizon).

Jump links (also in `AREAS`; the party's level comes from the wrapper in vault_story.js, so `lvl` may be above 40): `?town=vault&lvl=88` (the picket at the foot of the hill), `?town=vaultboss&lvl=89` (the Sanctum, every lock open, quests under way), `?town=vaultarchive&lvl=89` (the archive with the contract). Extras: `&q=1..5` quests done up to that one, `&pages=1`, `&contract=1`, `&keys=1`, `&open=1`.

## The seam with the road framework (blight_road.js was written by someone else)

Nothing here needs `BL_ROAD`. The place says where it joins the road in `VT.link = {east:9660, west:9680}` and `VT.arrive = {east:{x,y,f}, west:{x,y,f}}` (where the party stands coming in from the east or the west). The two road gates call `vtNeighbour(dir)`: first `VT.neighbour(dir)` if the framework defines one (return `{id, at}`), then `BL_ARRIVE[id].east/west` if that table exists, else the neighbour's `LEVELS[id].start` if the level or its KH_LAZY stub exists; if nothing is there the gate says that part of the Road is not open yet. When merging: have the framework either set `VT.neighbour` or fill `BL_ARRIVE[9660].west`/`BL_ARRIVE[9680].east` (where the party stands on arriving from this place), and read `VT.arrive` for where this place expects arrivals. The hill sets its own weather (`weatherNow`), light and sound; it is registered with `KH_LAZY` and `LEVEL_NAMES`/`LEVEL_RATING`.

## Art, and what is not painted

All pictures are reused: Wenlock graveyard (`assets/gy`), Witch's Wood trees and signs, Orange Spire props (lectern, coffin, desk, shelf, mirror, cage, candle), Oldhaven soldiers, the Wenlock yard's painted fronts. The three named creatures are existing pictures toned to pale silver in code (`vtTone` in vault_core.js): the Barrow Warden is the Orange Spire's skeleton king, the Silver Warden the graveyard's armoured knight, Maldrake Aldous Wend's wizard figure leached grey. A painted Maldrake of his own (and a painted Silver Warden, a sad old barrow-wizard with a ring) is the biggest art gap; a Gemini sheet cut with `tools/ingest_gy.py` and put in `GYA`/`vtPics` would replace the toned stand-ins without any other change. Also not painted: the pale-silver lock (drawn in code on the iron gate picture: glowing discs), the plates (code floor), the hill's slope (engine terrain).

Engine facts learned: a wall texture is shown mirrored when the wall is seen looking north or east, so lettering painted on such a wall must be drawn mirrored (the Maldrake plaque and the east road gate do this; the graveyard's north tombs do not); a decor piece keeps only a few fields (`i` is looked up by square, `vtI`); the iron gate picture has a see-through middle, so it is drawn over darkness (`vtGateTile`), not over brick; a person made of a decor piece is walk-through unless `solid`.

## Tests

On your own server (`python -m http.server 8473` from the repo root; stop only that process by its PID; never kill python by name). Chrome: set `BTA_CHROME`.

* `python tools/vault_test.py struct` every level builds, rows rectangular, nothing off the floor, every square reachable with the locks open, stairs link both ways and arrive next to the stair taken, the people and quests exist (147 checks).
* `python tools/vault_test.py sympathy` and `fight`: the whole chain with the game's own dialogue nodes and functions: Hale, 8 kills, the Warden and the key, a spike plate and an ambush plate, the Roll, a wrong coffin and the right order, a wrong bell and the peal, the pages, the sigils, the red-eyed book, the archive, the contract, the Silver Warden and the seal, the Sanctum, the ending (read aloud, or the fight with phases, the boss health kept in a save), Hale's hand-in, a save and a load of every state (about 120 checks each). The boss's health is set low in the test.
* `python tools/vault_test.py shots` screenshots of 21 places into `%TEMP%/vault_shots`; `maps` the nine parchment maps.
* `python tools/vault_sim.py [boss] [fights] [boss level] [party level]` plays fights with the real round functions (it is a rough tool: with the jump party and its 30-health potions a fight is lost, for the Wenlock graveyard bosses too, so use it to compare, not to judge).
* `node tools/vault_check.js` syntax of every script block; `python tools/vault_brackets.py file.js` finds an unbalanced brace.

## Balance

Maldrake: 25,800 health at level 89, hits 332 to 556, volleys on a count, helpers at two thirds and one third: the same shape as the Wenlock graveyard bosses (Aldric 18,000 health, hits 282 to 495 at 86; Morwenna 20,000, 323 to 537 at 87), about 1.4 times Aldric's health. The Barrow Warden is 12,000 (below Vane's 15,000: it is the first floor), the Silver Warden 17,350. Ordinary creatures are the graveyard's, at the rating of the floor. No balance run with a properly geared party has been done; heal ladder (heal_scaling.js) makes the priest's heals small, so the fight leans on potions. If it is too hard, lower `hp:640` of `vtmaldrake` in vault_core.js or the volley multipliers in `VTX_MOVES` (vault_boss.js).

## Gaps and ideas

* No painted Maldrake (see above); the three signs of the hill are plain wooden signposts.
* No sound recordings: wind, crows, a far tolling bell, drips, creaks and moans are made with `tone` and `nz`; the bells have their own pitches; not auditioned by ear.
* The Road framework still has to link 9670 to its neighbours (see the seam).
* The hill's barrows are scenery with a line each; none can be entered.
* Journal pages are lore items (the bag) and are re-readable at the lectern; there is no separate journal tab for them beyond the Story So Far pages.
* The hill's creature count (29) and the floors' (11 to 18 each) are modest; more of them would be easy to add in the `dress` functions.

## New in-game text (for the owner to look at)

Item descriptions and the spell are plain and literal; the dialogue and the book pages are in character (the owner may want them plainer). The full texts are in `vault_story.js` (`VT_BOOK`, `VT_HALE`, `VT_SARC`, `VT_VILLAGERS`, `VT_BARROWS`, `VTH_SIGNS`, the people's lines) and `vault_core.js` (items).

| Where | Text |
|---|---|
| Pale Silver Key | A key of pale silver. It opens the first pale-silver lock of the Vault of Maldrake, at the south end of the Warden's Hall on the first floor. |
| Silver Sigil of Underhill | A flat silver disc stamped with a small house and a well. Three of them open the third pale-silver lock, on the fourth floor of the Vault of Maldrake. |
| The Sanctum Seal | A silver seal on a cord. It opens the last pale-silver lock of the Vault of Maldrake, the door to Maldrake's Sanctum on the sixth floor. |
| The Silver Contract | A sheet of grey vellum: the contract between Wystan Maldrake and the Pale Sovereign. The last clause says how it ends. Read all of it aloud to Maldrake in his Sanctum, and he must agree that it is over. |
| The Gate Key of Sale | A long silver key with a crown for a bow. It opens the great gate of Sale at the west end of the Blighted Road. The Pale Sovereign left it with Maldrake. |
| Maldrake's Black Staff | The staff of black ash that Maldrake carried. Adds 118 to the power of spells, bosses take 50% more, and one blow in three leaves the foe dazed. Needs level 89. |
| Ring of the Quiet Silver | A clean silver band made from the metal of Maldrake's broken ring. Adds 7 Intelligence and 80 health, every blow on the wearer is 16 lighter, enemies miss 7% more, and wounds and tiredness heal steadily. Needs level 89. |
| Quiet the Dead (spell) | Undead within 5 squares flee for 12 rounds or are destroyed outright, and the living cower for 3 rounds. Learned from Maldrake. |
| Quest bl7a | Kill 8 of the dead on the Barrow Hill, so that Sergeant Hale can get to the door. |
| Quest bl7b | Go through the door of the Vault at the top of the hill. In the Barrow Stair, kill the Barrow Warden for the Pale Silver Key and open the first pale-silver lock ... Open the Ring of Coffins in the order of the Roll of Underhill ... Ring the five bells of the Bell Gallery in the right order, and open the second pale-silver lock. |
| Quest bl7c | Find four pages of Maldrake's journal. They lie on the lecterns and desks of the Vault, one on each of the first six floors. |
| Quest bl7d | Fetch the three Silver Sigils of Underhill and open the third pale-silver lock; kill the Silver Warden for the Sanctum Seal and open the last lock; go down into Maldrake's Sanctum. |
| Quest bl7e | Take the Gate Key of Sale from Wystan Maldrake in his Sanctum, by listening to him or by killing him. |
| Plaques on the floors | THE VAULT OF MALDRAKE / CLOSED BY THE GARRISON / THE HALL OF GUARDS / MIND THE FLOOR, The middle is the way / THE OSSUARY OF THE ROLL, Read the Roll before you open a lid / THE RING, Eight lids, one order / THE BELL GALLERY, Five bells. One peal. / THE SILVERED CELLARS / THE ROOM OF NEEDLES, Walk where the floor is plain / THE HALL OF UNDERHILL, Where the village sat down to supper / THE STAIR OF QUIET / THE SANCTUM / THE ARCHIVE, Nobody comes here. That is the idea. |
