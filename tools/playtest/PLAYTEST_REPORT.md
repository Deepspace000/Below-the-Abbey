# Below the Abbey, automated playtest report

Game version 3.640. Playtester: Python Playwright harness in `tools/playtest/` (`lib.js` bot, `common.py` stages, `h.py` runner, `state.json` resumable save, `deaths.json`, `report.py`).

## Starting conditions

- A true new game: the default party (Sigrid warrior, Gruff thief, Sorcha mage, Wulfric priest), no gold, no cheats, no god mode, no free xp or items, no set levels, no jump links, fixed (non scaling) world.
- Stopped by the owner in Act 1 at the Castle Dungeons (step 7). Acts 2 to 8 were not played.
- Logged fallbacks: the sealed portal in Gandricks Wood; the Castle Dungeons guards and Halbrecht killed through the damage routine after 20 wipes each (impossible grind).

## Summary numbers

| | |
|---|---|
| Stages completed | 11 |
| Total wall clock of the harness (sum over all processes, headless, game clock driven directly) | 7m 22s |
| Estimated human playing time (new game to the furthest point reached) | 5h 55m |
| Hero deaths | 166 |
| Party wipes (game reloaded from its autosave) | 52 |
| Combat rounds played | 3763 |
| Steps walked | 7297 |
| Dialogue pages | 537 (34807 characters) |
| Shop transactions | 104 |
| Kills | 193 |

Human time estimate: 1 s per step walked, 0.5 s per turn, 3 s per combat round, dialogue read at 15 characters per second plus 1.5 s per page, 12 s per shop transaction, 4 s per rest. Retries after a wipe count in full (a player repeats them too). Time spent in `skipped` steps is not counted.

## Stages (in play order)

| # | Stage | Area start > end | Hero lv start > end | Hero deaths | Wipes | Gold end | Wall | Human est. | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | crypt | 1 > 2 | 1/1/1/1 > 6/6/6/6 | 0 | 0 | 209 | 0m 00s | 12m 23s |  |
| 2 | abbey | 2 > 3 | 6/6/6/6 > 10/10/10/10 | 4 | 1 | 488 | 0m 41s | 15m 58s |  |
| 3 | th_town | 3 > 3 | 10/10/10/10 > 10/10/10/10 | 0 | 0 | 275 | 0m 04s | 14m 54s |  |
| 4 | th_side | 3 > 3 | 10/10/10/10 > 16/16/16/16 | 0 | 0 | 1908 | 0m 54s | 1h 19m |  |
| 5 | th_gandrick | 3 > 8 | 16/16/16/16 > 18/18/18/18 | 0 | 0 | 2419 | 0m 02s | 18m 01s |  |
| 6 | th_handin | 8 > 5 | 18/18/18/18 > 19/19/19/19 | 0 | 0 | 3115 | 0m 01s | 6m 07s |  |
| 7 | ironhill_road | 5 > 13 | 19/19/19/19 > 23/23/23/23 | 0 | 0 | 3930 | 0m 11s | 35m 46s |  |
| 8 | ih_report | 13 > 14 | 23/23/23/23 > 23/23/23/23 | 0 | 0 | 4220 | 0m 01s | 1m 30s |  |
| 9 | ih_side | 14 > 13 | 23/23/23/23 > 28/28/28/28 | 0 | 0 | 5645 | 0m 36s | 2h 01m |  |
| 10 | ih_mines | 13 > 21 | 28/28/28/28 > 29/29/29/29 | 0 | 0 | 6093 | 0m 00s | 15m 07s |  |
| 11 | ih_escape | 21 > 21 | 29/29/29/29 > 31/29/31/31 | 130 | 43 | 7604 | 3m 18s | 34m 52s |  |

## Deaths per area (worst first)

| Area | Name | Wipes | Hero deaths | Party avg level | Top killers |
|---|---|---|---|---|---|
| 21 | Castle Dungeons | 43 | 130 | 29 to 29.8 | Mayor Halbrecht L28 x130 |
| 19 | Ironhill Moor | 8 | 32 | 30.5 to 30.8 | Bandit Archer L31 x7, Hitman L31 x6, Bounty Hunter L31 x4, Bounty Hunter L32 x3 |
| 2 | The abbey grounds and the Thornwood | 1 | 4 | 8 to 8 | Skeleton L8 x3, Skeleton L7 x1 |

## Fallbacks, skips and unreachable steps (every one is a finding)

- area 7: transit 7 => noexit 
- area 13: route to 14 => noexit 
- area 21: IMPOSSIBLE GRIND: castle guards L27-29 (20 wipes) (killed through game damage routine)
- area 21: IMPOSSIBLE GRIND: Halbrecht L28 (20 wipes) (killed through game damage routine)

## Purchases

| Area | Party avg lvl | Item | For | Price | Gold left |
|---|---|---|---|---|---|
| 1 | 4 | bread | party | 8 | 1 |
| 1 | 4 | bread | party | 8 | 1 |
| 1 | 4 | bread | party | 8 | 1 |
| 1 | 4 | bread | party | 8 | 1 |
| 1 | 4 | apple | party | 4 | 1 |
| 4 | 10 | bread | party | 8 | 300 |
| 4 | 10 | bread | party | 8 | 300 |
| 4 | 10 | bread | party | 8 | 300 |
| 4 | 10 | bread | party | 8 | 300 |
| 4 | 10 | potion | party | 25 | 300 |
| 4 | 10 | potion | party | 25 | 300 |
| 4 | 10 | potion | party | 25 | 300 |
| 4 | 10 | potion | party | 25 | 300 |
| 4 | 10 | cap | Gruff | 8 | 300 |
| 4 | 10 | cap | Sorcha | 8 | 300 |
| 4 | 10 | jerkin | Gruff | 22 | 300 |
| 4 | 10 | axe | Wulfric | 30 | 300 |
| 4 | 10 | bow | Wulfric | 30 | 274 |
| 4 | 10 | apple | quest item | 0 | 270 |
| 4 | 10 | apple | quest item | 0 | 266 |
| 4 | 10 | cheese | quest item | 0 | 256 |
| 4 | 10 | ale | quest item | 0 | 250 |
| 4 | 10 | ale | quest item | 0 | 244 |
| 4 | 10 | herring | quest item | 0 | 232 |
| 4 | 10 | herring | quest item | 0 | 220 |
| 4 | 10 | herring | quest item | 0 | 208 |
| 4 | 10 | apple | quest item | 0 | 204 |
| 4 | 14 | bread | party | 8 | 1193 |
| 4 | 14 | apple | quest item | 0 | 1174 |
| 4 | 14 | apple | quest item | 0 | 1170 |
| 4 | 14 | cheese | quest item | 0 | 1160 |
| 4 | 14 | ale | quest item | 0 | 1154 |
| 4 | 14 | ale | quest item | 0 | 1148 |
| 4 | 14 | apple | quest item | 0 | 1144 |
| 4 | 15 | bread | party | 9 | 1733 |
| 4 | 15 | pottage | party | 13 | 1733 |
| 4 | 15 | pottage | party | 13 | 1733 |
| 4 | 15 | pottage | party | 13 | 1733 |
| 4 | 15 | sausage | party | 15 | 1733 |
| 4 | 15 | sausage | party | 15 | 1733 |
| 4 | 15 | cheese | quest item | 0 | 1707 |
| 4 | 15 | cheese | quest item | 0 | 1696 |
| 4 | 16 | sausage | party | 15 | 1833 |
| 4 | 16 | pie | party | 30 | 1833 |
| 4 | 16 | pie | party | 30 | 1833 |
| 7 | 16 | bread | party | 9 | 1899 |
| 7 | 16 | bread | party | 9 | 1899 |
| 7 | 16 | bread | party | 9 | 1899 |
| 7 | 16 | bread | party | 9 | 1899 |
| 7 | 16 | cheese | party | 11 | 1899 |
| 7 | 16 | cheese | party | 11 | 1899 |
| 7 | 16 | potion | party | 28 | 1899 |
| 7 | 16 | potion | party | 28 | 1899 |
| 7 | 16 | potion | party | 28 | 1899 |
| 15 | 23 | potion | party | 28 | 3752 |
| 15 | 23 | potion | party | 28 | 3752 |
| 15 | 23 | potion | party | 28 | 3752 |
| 15 | 23 | potion2 | party | 83 | 3752 |
| 15 | 23 | potion2 | party | 83 | 3752 |
| 15 | 23 | shield | Gruff | 20 | 3752 |
| 15 | 23 | shield | Wulfric | 20 | 3752 |
| 15 | 23 | leggings | Sigrid | 11 | 3752 |
| 15 | 23 | bracers | Sigrid | 11 | 3752 |
| 15 | 23 | leggings | Gruff | 11 | 3752 |
| 15 | 23 | bracers | Gruff | 11 | 3752 |
| 15 | 23 | jerkin | Sorcha | 24 | 3752 |
| 15 | 23 | jerkin | Wulfric | 24 | 3752 |
| 15 | 23 | helm | Wulfric | 44 | 3752 |
| 15 | 23 | helm | Wulfric | 44 | 3752 |
| 17 | 23 | bread | party | 9 | 3607 |
| 17 | 23 | bread | party | 9 | 3607 |
| 17 | 23 | bread | party | 9 | 3607 |
| 17 | 23 | bread | party | 9 | 3607 |
| 17 | 23 | potion | party | 28 | 3607 |
| 17 | 23 | potion | party | 28 | 3607 |
| 17 | 23 | potion | party | 28 | 3607 |
| 17 | 23 | apple | quest item | 0 | 3603 |
| 17 | 23 | apple | quest item | 0 | 3599 |
| 17 | 23 | cheese | quest item | 0 | 3588 |
| 17 | 23 | cheese | quest item | 0 | 3577 |
| 17 | 23 | ale | quest item | 0 | 3570 |
| 17 | 23 | ale | quest item | 0 | 3563 |
| 17 | 25 | herring | quest item | 0 | 4365 |
| 17 | 25 | herring | quest item | 0 | 4352 |
| 17 | 25 | herring | quest item | 0 | 4339 |
| 17 | 25 | apple | quest item | 0 | 4335 |
| 17 | 25 | potion | party | 27 | 4269 |
| 17 | 25 | potion2 | party | 82 | 4269 |
| 17 | 25 | potion2 | party | 82 | 4269 |
| 17 | 27 | apple | quest item | 0 | 5004 |
| 17 | 27 | apple | quest item | 0 | 5000 |
| 17 | 27 | apple | quest item | 0 | 4996 |
| 17 | 30.5 | bread | party | 9 | 7532 |
| 17 | 30.5 | bread | party | 9 | 7532 |
| 17 | 30.5 | pottage | party | 13 | 7532 |
| 17 | 30.5 | pottage | party | 13 | 7532 |
| 17 | 30.5 | pottage | party | 13 | 7532 |
| 17 | 30.5 | sausage | party | 15 | 7532 |

## Quest log (accepted, handed in)

| Quest | Change | Area | Given by or to | Party avg lvl | Gold after |
|---|---|---|---|---|---|
| bandits | ->active | 3 | Rolf, the gate warden | 10 | 300 |
| wolves | ->active | 3 | Hild, the huntress | 10 | 300 |
| apples | ->active | 3 | Old Tam | 10 | 300 |
| cheese | ->active | 3 | Goodwife Mabel | 10 | 300 |
| bread | ->active | 3 | Wat, the beggar | 10 | 300 |
| ale | ->active | 3 | Hob | 10 | 300 |
| goats | ->active | 3 | Old Maud | 10 | 290 |
| rats | ->active | 3 | Goodwife Edda | 10 | 290 |
| fish | ->active | 3 | Farmer Will | 10 | 290 |
| thornwick_shake | ->active | 3 | Sly Dunstan | 10 | 290 |
| wq_mossback | ->active | 3 | Mother Mossback | 10 | 290 |
| gandrick | ->active | 5 | Mayor Corbin | 10 | 275 |
| bread | active>done | 3 | Wat, the beggar | 10 | 295 |
| ghosts | ->active | 3 | Nim | 10 | 295 |
| wood | ->active | 6 | Bram, the innkeeper | 10 | 274 |
| bandits | active>done | 3 | Rolf, the gate warden | 14 | 1201 |
| wolves | active>done | 3 | Hild, the huntress | 15 | 1811 |
| ironhill | active>done | 14 | Mayor Halbrecht | 23 | 4220 |
| mines | ->active | 14 | Mayor Halbrecht | 23 | 4220 |
| wolves2 | ->active | 13 | Captain Rowan | 23 | 4220 |
| herbs | ->active | 13 | Wynn, the herbalist | 23 | 4220 |
| graves | ->active | 13 | Odo, the gravekeeper | 23 | 4220 |
| pick | ->active | 13 | Hesta | 23 | 4220 |
| pip | ->active | 13 | Ysolde | 23 | 4220 |
| overseer | ->active | 13 | Foreman Bryn | 23 | 4220 |
| herbs | active>done | 13 | Wynn, the herbalist | 25 | 4460 |
| rats2 | ->active | 16 | Mara, the innkeeper | 25 | 4460 |
| wolves2 | active>done | 13 | Captain Rowan | 27 | 5008 |
| mines | active>done | 21 | Mayor Halbrecht | 29 | 6093 |
| escape | ->active | 21 | Mayor Halbrecht | 29 | 6093 |
| rats2 | active>done | 16 | Mara, the innkeeper | 30.5 | 7662 |

## Bugs and findings

### 1. [HIGH] Opened locked doors are not saved (Gandrick's Cave, level 8): possible softlock after reload

snapshot() in index.html stores `grid` only for LEVEL===1. A locked door (tile 4) opened with the cave key is locked again after a load, and the key is already used. Reproduce: Gandrick's Cave, take the key at (20,3), open the door at (24,5), enter Gandrick's room, let the autosave run (or save), then load. The party is inside the vault, the door is locked and there is no key; the only way out found was the harness travel fallback. The same risk applies to every locked door outside level 1.

### 2. [HIGH] Gandrick's Wood (level 7): the portal to the Ironhill Road is sealed by tree decor

Portal 2 (to level 10) is the tile at (8,19). Tree decor with block=true stands at x=11 on y=18..20 and on rows 17 and 21 around it, so the 18 cells holding the portal form an island (flood fill, and walking into (11,19) bumps). The route to Ironhill is not walkable. The harness used the portal's own destination as a logged fallback. Files: index.html and the forest decor passes in src/desert.

### 3. [MEDIUM] A surrendered bandit can block the way for ever

mercyCheck sets e.surr; mercyBroken sets e.mercyDone when a surrendered bandit is struck again. mercyTick skips creatures with mercyDone, so a surrendered bandit who survives the blow stays (alert, surr=true) and never leaves. Reproduce in Gandrick's Wood at (24,20): 'The Bandit blocks the way!' repeats until he is killed.

### 4. [MEDIUM] Gear never keeps up with creatures between Thornwick and Khemetra (design finding)

Hero damage comes only from the weapon plus floor((STR-8)/4); creature health grows x(1+0.45(L-1)). Every shop in Thornwick, Ironhill, Greendale and Anaea sells only tier 0 gear (dagger 3-5 up to axe 5-9, helm armour 2) and 3 or 4 healing potions each. At level 25 the party hits for 12-17, 5-8, 2-4 and 7-11 against a level 19 skeleton with 728 hp. Gold piles up unused: 2,468 at level 16, about 7,600 at level 31. The tiered weapons (tempered, greatsword and so on) are sold only from Khemetra on (KH_STOCK and GEAR_STOCK).

### 5. [LOW] 404s for sprite sheets on load

assets/sp_m30b.png, sp_z30b.png, sp_c30b.png (and similar) return 404 when the page is served from the repo root.

### 6. [LOW] MAIN_QUEST_LINE.md differs from the game

The crypt is rated 4 (doc says 1 to 3). Kill Gandrick pays 250 gold and 1000 xp (doc lists the pre-doubling 125 and 500; every quest pays double, QREW_MUL). Over the Pass is handed out automatically after Out of the Dungeons (doc: Captain Rowan).

### 7. [LOW] Route to Ironhill Castle sometimes unreachable on foot from the arrival point ('route to 14 => noexit')

Seen once in run 3 in Ironhill (level 13); the harness used the portal destination. Not investigated.

### 8. [INFO] Rest is a free full heal, full mana and a revive

restParty(false) anywhere without enemies close heals everyone, refills mana and raises the dead to half health for 8 hours of game time and about 33 food. Pulls one at a time are therefore very safe and potions are rarely needed outside long fights.


## Levelling analysis

### Combat policy
Policy version 3 (the current run): every round the bot checks each hero. Healers (priest) heal first when anyone is below 50 percent (group heal when two are below 60 percent, else a single heal on the weakest) and drink mana potions when dry. A hero below 50 percent drinks the best-fitting healing potion (the game picks the smallest that covers the wound); afflicted heroes use cures; casters use mana potions. It uses area powers when two or more enemies are near, a party buff at the start of a real fight, melee, multi or twin powers on strong enemies, otherwise a plain attack. It focuses fire by turning to the adjacent enemy with the fewest hit points. It rests (free in this game) below 70 percent health or 30 percent mana for priest and mage before every pull, and restocks potions in town when it carries fewer than 4. It has no flee or defend (the game has neither). Every wipe stores a `pol` record (heals, group heals, potions, mana potions, powers, potions left, mana left) in deaths.json.

### Wipes: in range and under-level (run 3, policy 3)
In range (party within one level of the rating, or above it): Castle Dungeons 43 wipes (130 hero deaths, nearly all Mayor Halbrecht L28 with ten castle guards, party level 29 to 31), Ironhill Moor 8 wipes (Bandit Archer, Hitman and Bounty Hunter, all level 31 while the party is wanted; party about 31), Abbey grounds 1. Under-level wipes: none, because the entry rule was enforced by `gate()`.

Earlier runs are kept in run1_ungated/ and run2_policy1/ for comparison. Run 1 (no entry rule, policy 1): 64 wipes in the Ironhill Mines at level 17 against rating 25 and 32 in the Tunnel (all UNDER-LEVEL, not a difficulty signal), plus 38 in Gandrick's Cave with no potions. Run 2 (entry rule, policy 2): 64 wipes in the Ironhill Tunnel at gap 0 (skeleton packs L18 to 19). Run 3 (policy 3): 0 wipes in the Tunnel and 0 in the Mines (entered at level 29 against rating 25 after levelling with side quests). So the Tunnel result was mostly the bot: the same area went from 64 wipes to 0 with the better policy. The Castle Dungeons and the Moor are the only places where the policy 3 party still dies at par.

### Pacing
xpNeed(level) = 15 x level x (level+1). A kill at the area's own level pays about 80 x level xp (skeleton L19: 1520, L25: 2000), so a level takes about 5 to 6 kills at par; creatures below the party pay 6 percent less per level of difference. Quests are doubled: Gandrick 1000 xp, Word for Ironhill 1600, Mines 900, Out of the Dungeons 1800. In run 3 the party went from 10 to 16 on the Thornwick side quests and hunts (about 79 minutes of estimated human time, 55 s of harness time), to 23 on the Ironhill road and to 28 after the Ironhill side quests (about 2 hours). The Ironhill gate needed 3 levels in one grind cycle (1,724 s of estimated human time). Levelling is therefore not the wall; gear and damage are (see the MEDIUM finding). Side quest xp is small beside the kills: the grind areas gave the levels.

### Next run
Resume: from the repo root run `python -m http.server 8398`, then in tools/playtest run `./loop.sh run_act1.py`. It reloads state.json (localStorage saves, counters, results) and carries on at the first unfinished stage (`ih_escape`, then `pass`). After a browser crash the loop restarts from the last mark. Acts 2 to 8 have no stage scripts yet: write them in the style of stages_act1.py (gate(), transit(), npc_talk(), kill_until(), clear_until(), once()). Act 2 notes: the walkable road from Anaea to Khemetra goes through the Tomb of Sut (level 42, four sun discs, door decor with `enter`); buy tier gear in Khemetra with the stored gold before going on.