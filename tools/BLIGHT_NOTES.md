# The Blighted Road: notes for the next session

The road west from the open gate of Wenlock to Sale: ten places, each its own map, ids 9610 to 9709 (place n has id 9600 + 10n, its rooms use id+1 to id+9). The plan is in `NEXT_PART_PLAN.md` (the ten places, ratings, look).

## Files (src/desert, run `python tools/inject.py` after editing; they are last in ORDER, after `wenlock_seals.js`)
- `blight_road.js`  the table `BL_ROAD` (id, name, lvl, W, H, built, rooms, fromE, fromW, exitY), `blRegister(n, builderFn, opts)`, KH_LAZY for all 100 ids (a place not built yet gets a stub), arrival loading (Wenlock's `wlLoad` brings the graveyard and witch wood pictures), the hook that makes the open west gate of Wenlock lead to the Toll House (wraps `usePortal`, only once place 1 is built), story hint text, Go to area rows, `blAreas` (jump links, called from `jumpFromUrl` in index.html).
- `blight_kit.js`   the shared look and the level builder: floors (dead grass, mud, flags), `weatherNow` fog (grey green), lamp colours (`lv._bl.lcol`), sound (`blsTick`: crows, creaks, a far bell), creatures `bl*` (ENEMY_DEF), lettered pictures (`blPost`, `blSlab`, `blMilestone`), `blKit(spec)` (the builder kit C), `blRoom(spec)` (interiors), `blStubBuild`.
- `blight_toll.js`  place 1, the Toll House (9610, room 9611, rating 84).
- `blight_ashenfold.js` place 2, Ashenfold Farm (9620, farmhouse 9621, cellar 9622, barn 9623, rating 85).
- `blight_maps.js` parchment area maps for every id of the road (fill `C.mapNames` and a builder gets a map) and one world map entry.
- `tools/blight_test.py` headless tests (`load`, `links`, `quests`, `walk`, `gate`, `save`, `shots`, `all`). `tools/blight_probe.py` runs a bit of JS in the game. `tools/blight_contact.py` makes a contact sheet of existing pictures.

## How a place is added (for the Vault of Maldrake, the church, and so on)
```
function myBuild(p){ const C=blKit({id:p.id,W:p.W,H:p.H,name:p.name,lvl:p.lvl}); C.boundary(); C.setF(...); C.pth(...); C.gate('E',y); C.gate('W',y); C.milestone(x,y); ...; C.dress({keep:(x,y)=>...}); return C.finish({start:{x,y,f}}) }
blRegister(7, myBuild, {fromE:{x,y,f}, fromW:{x,y,f}, rooms:[9671,9672], names:{9671:'...'}, rating:{9671:89}});
```
- Kit helpers: `dec/D/DB` (props: exact key / off paths / solid), `thing` (solid prop that talks, with khNpc registered by you), `person` (a khNpc keeper standing near a spot), `foe(type,x,y)`, `foes([[type,x,y]])`, `house({x0,y0,x1,y1,face,sty,roof,wh,to})` (enterable, Wenlock style), `post` (lettered signpost), `milestone` (SALE n STAGES), `grave`, `light(x,y,col)`, `C.warm` / `C.pale` colours, `dress()` (dead trees, scrub, stones, bones, crow posts), `hills(amp)`.
- Keys that exist after `wlLoad()`: `gy_*` (stones, dead tree, lantern, fence, urn, bones, web, rpost with crow, chapel ruin, hut, chest ...), `ww_*` (thorn, willow, oakmoss, well, sign, totem, cauldron, stump, twig ...), `kh_oh*` people and props, Wenlock `wl_bldg1_0..5` (church, hall, windmill, mill, dovecote, barn). The faces for people are `kh_ohfolk1..7_0..5`, `kh_ohsold1_*`, `kh_oqmen_*`.
- Creatures: `bldeadwarden blhusk blghoul blbones blbloat blcrow blshade blhound blscare blscarebig blcrowflock`. Level of a creature = the rating of the place (`LEVEL_RATING`), spread by the engine.
- Quest rings: add `QRF.T.<id>` entries (see quest_rings_fix.js). Quests use `yrQ` and `qNode` (see ww_quests.js for the pattern). Region name for quests: `QAREA[id]='The Blighted Lands'`.
- Teleport stones: none on the road except where a place says so (Lanternrest has the road's teleporter). `noTele:true` unless `spec.tele` is given.
- Never use em dashes. Text is plain and literal.

## Jump links
`?town=blight1` to `?town=blight10` (the east end of that place; lvl defaults to 84, capped at 90).

## Test servers
Use your own port (`python -m http.server 8447` from the worktree root); another session may already hold a port and serve a different checkout (check that `curl http://localhost:PORT/index.html` contains `blight_road.js`).

## Progress and gaps
See the end of this file (updated as places are built).

### Built (28 Oct 2026)
- Framework: table, stubs for all 100 ids, level kit, look (grey green haze, dead grass, dead stone copies, bare trees), sound, west gate hook (tested both ways), story hint, Go to area rows, jump links, area maps, world map entry (placed west of the western-kingdoms gate; not checked by eye, it is outside the opening view).
- Place 1 Toll House (9610 rating 84, room 9611): 72x64, toll yard, toll house you can enter (ledger desk, strongbox, dead warden), graves of nine Wardens, ruined shrine, roadmender hut, crow tree, hedges, milestone SALE 9 STAGES. Quests blq1 (ledger), blq2 (five Dead Road Wardens), blq3 (shrine candle). People: Wat Harrow, Marl Quill, Sister Anwen.
- Place 2 Ashenfold Farm (9620 rating 85, rooms 9621 kitchen, 9622 cellar, 9623 barn): 80x70, farmyard, farmhouse with the dead family at supper, barn (Wenlock barn picture), well, haystacks, dead fields with walking scarecrows (they wait, then wake), orchard. Quests blq4 (Tilly in the cellar), blq5 (Heart-Scarecrow, burn the heart in the hearth), blq6 (the farmer's ring). Milestone SALE 8 STAGES.
- Tests: all pass (load, links, quests, walk, gate, save).

### Gaps and ideas
- No new painted art was made (no Gemini): everything reuses graveyard, witch wood, Wenlock and engine pictures. A dedicated painted scarecrow-on-a-pole, a farmhouse front and a milestone would raise the finish. Dead hedges are tinted Wenlock bushes (read as ferns).
- The sprite pass for roofs and painted buildings needed one core edit in index.html (the sky list condition now includes levels 9610 to 9709), plus the jump link parse and the cap/default level in jumpFromUrl and one line calling blAreas.
- Lit windows are only light colours on the ground in front of the houses. The toll house walls are the pale Wenlock flint.
- No teleport stones yet (Lanternrest, place 6, is meant to have the road's one).
- If `wenlock_seals.js` is not in ORDER before blight_road.js the gate hook does nothing (the hook needs G.portals[2].wsWest).

### Places 3 and 4 (28 Oct 2026)
Files: `src/desert/blight_church.js` (place 3), `src/desert/blight_gallowmere.js` (place 4), both at the end of ORDER after `blight_maps.js`. Tests: `tools/blight34_test.py [load|links|quests|walk|save|shots|all]` (own server, `BL_PORT`, default 8481). `tools/blight_probe.py` now takes `BL_W`/`BL_H` for the window size.
- **Church of the Hollow Saint** (9630, rating 86, 80x70, rooms 9631 nave, 9632 crypt, 9633 belfry, 9634 vestry). The painted Wenlock church picture greyed in code (`bl_church`), four upside-down bells (`bl_ibell`, the graveyard's bell picture flipped) beside the flagged path, lych-gate, railed churchyard with six grave boards, the Alder vault, the sexton's hut, Peggy's lean-to, the plague pit, the poor chapel. Sound: the bells toll low through the samples `church_bell1/2` (rate .5 to .62), the choir sings a slow glassy chord in the nave (`blcSing`). The choir is 16 ghost pictures with a float, each talks; when the hymn is finished they are hidden (flag `choirRest`).
  People: Father Alder (`blc_alder`, the priest picture), Gideon Mould sexton (`blc_gideon`), Precentor Ambrose Lark ghost (`blc_ambrose`), Peggy Thripp (`blc_peggy`), the statue of the Hollow Saint (`blc_saint`). Boss: The Pale Cantor (`blcantor`, in the crypt, gold 3200 to 4000).
  Quests: blq7 The True Bell (Gideon: three bells in the belfry, two false ones cost 12% health each; true one is small and nameless), blq8 The Choir's Hymn (Ambrose: three pages in the crypt, belfry and churchyard), blq9 The Last Congregation (Father Alder: read six grave boards, tell him), blq10 The Saint's Alms Bowl (statue: hidden niche in the crypt). Rewards: Gideon's Grave Spade, Precentor's Tuning Ring, three potions, Cowl of the Hollow Saint.
- **Gallowmere** (9640, rating 86, 90x76, rooms 9641 Osk's house, 9642 the Reeve's flooded hall, 9643 Nan's cottage). A fen: land is cut out of water with ellipses; water cells are floor slot 6 (`blf_water`, set in `lv.floorSet[6]`, the engine only has seven floor slots) and blocked in the terrain (`TERRS[id].block`, the way Wenlock's brook works). `lv._ground` gives the parchment map its own colours for the slots (blight_maps.js reads it). Causeway of planks with five lamps (`blg_lamp`): each lights from the one before and burns away the wisps within 5.5 squares. Rowing boat (`blg_boat0` at the jetty 51,48) moves the party to Heron Isle (62,18) or the Reeve's Isle (28,18) (same-level move: set G.P, G.C, reveal()), boats on the isles bring it back. Gibbet tree (crow tree plus two hanged scarecrows), well, bog bodies, reeds, grey reed beds, pale lights on the water.
  People: Osk Brine ferryman (`blg_osk`), Nan Sallow peat-cutter (`blg_nan`), Tam Corder reed-cutter (`blg_tam`), three drowned ghosts. Creatures: `blwisp` (Fen Wisp, level 86, still until near), bloated drowned men, husks, ghouls; boss The Drowned Reeve (`blreeve`, in 9642, gold 3400 to 4200, drops the Reeve's Rod).
  Quests: blq11 The Ferryman's Lantern (Osk; lantern on Heron Isle), blq12 Peat Salt (Nan; three sacks: salt pans south, south west bank, south east bank), blq13 Graves of the Drowned (Tam; three markers: reed beds NW, Heron Isle, under the Gallows Tree), blq14 The Drowned Reeve (Nan, after blq12). Rewards: Osk's Tide Ring, Peat-Cutter's Hood, potions, the Reeve's Rod.
- Quest ids used: blq7 to blq14. Place 5 onward should start at blq15.
- Gaps: no new painted art (no Gemini): everything reuses graveyard, witch wood, Wenlock, Hollow and engine pictures; the upside-down bell is the bell picture flipped; bog bodies are mound pictures; the stilt houses are Wenlock-style houses with posts, not houses on legs; the hanged are the scarecrow totems; the Reeve is the graveyard giant picture. The fen's water is a toned copy of the game's water floor (dark, little shine). Chrome was not used. Wisps are placed on land or the causeway only (they fly, but nothing is placed over water). The inverted bell tolls do not raise any extra dead (sound and a message only).
