# The Blighted Road: notes for the next session

The road west from the open gate of Wenlock to Sale: ten places, each its own map, ids 9610 to 9709 (place n has id 9600 + 10n, its rooms use id+1 to id+9). The plan is in `NEXT_PART_PLAN.md` (the ten places, ratings, look).

## Files (src/desert, run `python tools/inject.py` after editing; they are last in ORDER, after `wenlock_seals.js`)
- `blight_road.js`  the table `BL_ROAD` (id, name, lvl, W, H, built, rooms, fromE, fromW, exitY), `blRegister(n, builderFn, opts)`, KH_LAZY for all 100 ids (a place not built yet gets a stub), arrival loading (Wenlock's `wlLoad` brings the graveyard and witch wood pictures), the hook that makes the open west gate of Wenlock lead to the Toll House (wraps `usePortal`, only once place 1 is built), story hint text, Go to area rows, `blAreas` (jump links, called from `jumpFromUrl` in index.html).
- `blight_kit.js`   the shared look and the level builder: floors (dead grass, mud, flags), `weatherNow` fog (grey green), lamp colours (`lv._bl.lcol`), sound (`blsTick`: crows, creaks, a far bell), creatures `bl*` (ENEMY_DEF), lettered pictures (`blPost`, `blSlab`, `blMilestone`), `blKit(spec)` (the builder kit C), `blRoom(spec)` (interiors), `blStubBuild`.
- `blight_toll.js`  place 1, the Toll House (9610, room 9611, rating 84).
- `blight_ashenfold.js` place 2, Ashenfold Farm (9620, farmhouse 9621, cellar 9622, barn 9623, rating 85).
- `tools/blight_test.py` headless tests (`load`, `links`, `quests`, `shots`). `tools/blight_probe.py` runs a bit of JS in the game. `tools/blight_contact.py` makes a contact sheet of existing pictures.

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
