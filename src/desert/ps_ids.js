/* ==========================================================================
   THE PALE SPIRE: SHARED NUMBERS (the contract; prefix psp / PSP). Written first so that every builder agrees.
   Read tools/PALE_SPIRE_PLAN.md before you build anything. This file holds data only: the level ids, map sizes, ratings, and
   the exact connection squares between levels. It registers nothing (no KH_LAZY, no LEVEL_NAMES, no ENEMY_DEF): package 6
   (ps_glue.js) does that from this table.
   NOTE: the global name PS is already taken by powers_scaling.js (window.PS), so every global of the Pale Spire starts with psp / PSP.
   The ids 9710 to 9998 were checked free on 29 Oct 2026 (9999 appears only as a sentinel number in other files, leave it unused).
   Facing f: 0 north (y minus 1), 1 east, 2 south, 3 west. x grows east, y grows south.
   A link says: stepping on the square `at` of level `from` (a door, arch or stair tile) takes the party to level `to`, onto the open
   square `land` = [x, y, f]. Both squares must be open floor, with a clear 3 by 3 area round `land`. Every link below has a twin
   going back; both halves are listed. `prov:1` means the far side is not built yet and the number is a promise for the later builder.
   `lock:'pskey2'` means the stair door needs the Second Floor Key (item id pskey2) in the bag; the key is kept after use.
   ========================================================================== */
const PSP={REGION:'The Pale Lands',LO:9710,HI:9998,ENTRY:{id:9720,x:32,y:52,f:0}};
/* id of every level and block (a block of ten ids: the first is the main level, the rest are its rooms, floors or towers) */
PSP.ID={DOOR:9710,APPROACH:9720,GATEHOUSE:9721,WINCH:9722,LODGE:9723,
  COURT:9730,GARDENER:9731,MEWS:9732,
  HALLS:9740,WEST:9750,EAST:9760,ORCHARD:9770,YEWMAZE:9775,
  DUNG1:9780,DUNG2:9790,DUNG3:9800,CELLARS:9810,
  F2C:9820,F2W:9830,F2E:9840,WALL:9850,WINTER:9860,TERRACE:9870,
  F3:9880,MOON:9890,BELL:9900,RAVEN:9910,ALCHEMY:9920,
  KEEP:9930,ROOFGARDEN:9940,MIRRORMAZE:9950,DONJON:9960,
  SPIRESTAIR:9970,THRONE:9980,CROWN:9990};
/* planned maps. kind: out outdoor, in indoor, maze, atrium. pkg: the work package that builds it (0 = later, not part of the first build). */
const PSP_LV=(id,name,W,H,lvl,pkg,kind,o)=>Object.assign({id,name,W,H,lvl,pkg,kind,built:false},o||{});
PSP.LEVELS=[
 PSP_LV(9710,'The Pale Door',48,40,100,0,'in',{note:'where Sale opens onto the Pale Lands; built later with the Sanctuary of Sale (7299)'}),
 PSP_LV(9720,'The Pale Approach',64,56,100,1,'out'),
 PSP_LV(9721,'The Great Gatehouse',32,24,100,1,'in'),
 PSP_LV(9722,'The Winch Loft',20,18,100,1,'in'),
 PSP_LV(9723,"The Porter's Lodge",18,14,100,1,'in',{rest:1}),
 PSP_LV(9730,'The Court of Statues',64,56,101,2,'out',{tele:[8,44]}),
 PSP_LV(9731,"The Gardener's Lodge",16,14,101,2,'in',{rest:1}),
 PSP_LV(9732,'The Mews and Stable',20,16,101,2,'in'),
 PSP_LV(9740,'The Ground Floor: the Great Halls',64,48,101,3,'in'),
 PSP_LV(9750,'The Ground Floor: Kitchens and Armoury',48,40,101,4,'in'),
 PSP_LV(9760,'The Ground Floor: Cloister, Chapel and Library',48,40,101,4,'in'),
 PSP_LV(9770,'The Pale Orchard and Kitchen Garden',96,80,102,0,'out'),
 PSP_LV(9775,'The Yew Maze',64,64,102,0,'maze'),
 PSP_LV(9780,'The Undercroft Gaols',48,40,102,5,'in'),
 PSP_LV(9790,'The Deep Cells and the Cistern',48,40,103,5,'in'),
 PSP_LV(9800,'The Oubliette',40,36,104,5,'in'),
 PSP_LV(9810,'The Wine Cellar and Old Cistern',64,48,103,0,'in'),
 PSP_LV(9820,'The Second Floor: the State Rooms',112,84,103,0,'in'),
 PSP_LV(9830,'The Second Floor: the West Wing, State Bedchambers',72,64,104,0,'in'),
 PSP_LV(9840,'The Second Floor: the East Wing, Council and Great Library',72,64,104,0,'in'),
 PSP_LV(9850,'The Curtain Wall Walk',96,88,104,0,'out'),
 PSP_LV(9860,'The Wintergarden',80,64,105,0,'atrium'),
 PSP_LV(9870,'The Moonlit Terrace Maze',72,64,105,0,'maze'),
 PSP_LV(9880,'The Third Floor: the Hall of Mirrors and the Observatory Gallery',112,84,106,0,'in'),
 PSP_LV(9890,'The Moon Tower',40,40,107,0,'in',{floors:5}),
 PSP_LV(9900,'The Bell Tower',40,40,108,0,'in',{floors:5}),
 PSP_LV(9910,'The Raven Tower and the Great Mews',48,48,108,0,'in',{floors:4}),
 PSP_LV(9920,"The Alchemist's Tower",40,40,109,0,'in',{floors:5}),
 PSP_LV(9930,'The Upper Keep: Armoury, Treasury and Reliquary',96,72,110,0,'in'),
 PSP_LV(9940,'The Hanging Forest',96,80,112,0,'atrium'),
 PSP_LV(9950,'The Maze of Mirrors',64,64,112,0,'maze'),
 PSP_LV(9960,'The Donjon Stair',48,64,113,0,'in',{floors:4}),
 PSP_LV(9970,'The Spire Stair',32,48,114,0,'in',{floors:3}),
 PSP_LV(9980,'The Throne Room of the Pale Sovereign',80,64,115,0,'in'),
 PSP_LV(9990,'The Crown of the Spire',64,64,115,0,'out')];
/* links: PSP_L(fromId, [x,y], toId, [x,y,f], options) */
PSP.LINKS=[];
const PSP_L=(from,at,to,land,o)=>PSP.LINKS.push(Object.assign({from,at,to,land},o||{}));
/* REDESIGN (30 Oct 2026, tools/PALE_SPIRE_REDESIGN.md): the castle is compact and vertical now; every map is smaller and these squares are the new contract.
   Sale's WEST gate (level 600, built by package 1) leads to the Approach; there is no Pale Door level any more on the way (9710 stays unbuilt). `ext:1` = the other level is outside the Pale Spire range. */
PSP.SALE={gate:[1,36],land:[4,36,1]};   // Sale (600): the gate tile and where the party lands when it comes back from the castle road
PSP_L(9720,[32,54],600,[4,36,1],{name:'back to Sale',ext:1});
/* package 1: approach, gatehouse, winch loft, porter's lodge */
PSP_L(9720,[32,6],9721,[16,19,0],{name:'the Great Gate'});
PSP_L(9721,[16,22],9720,[32,9,2],{name:'out of the gatehouse, south'});
PSP_L(9721,[16,2],9730,[32,49,0],{name:'into the Court of Statues'});
PSP_L(9730,[32,52],9721,[16,5,2],{name:'the courtyard gate'});
PSP_L(9721,[26,8],9722,[4,9,1],{name:'stair up to the winch loft'});
PSP_L(9722,[2,9],9721,[26,10,2],{name:'stair down to the east guardroom'});
PSP_L(9721,[7,19],9723,[9,4,2],{name:"door to the Porter's Lodge"});
PSP_L(9723,[9,2],9721,[7,17,0],{name:'door back to the west guardroom'});
/* package 2: courtyard, lodge, mews, the four doors, the wall stairs (provisional) */
PSP_L(9730,[10,40],9731,[8,10,0],{name:"the Gardener's Lodge"});
PSP_L(9731,[8,12],9730,[10,42,2],{name:'out of the lodge'});
PSP_L(9730,[54,40],9732,[10,12,0],{name:'the Mews and Stable'});
PSP_L(9732,[10,14],9730,[54,42,2],{name:'out of the mews'});
PSP_L(9730,[32,10],9740,[32,44,0],{name:'Door 1: the Great Door'});
PSP_L(9740,[32,46],9730,[32,12,2],{name:'the Great Door, from inside'});
PSP_L(9730,[18,10],9740,[18,44,0],{name:'Door 2: the Gallery Door'});
PSP_L(9740,[18,46],9730,[18,12,2],{name:'the Gallery Door, from inside'});
PSP_L(9730,[12,24],9750,[42,22,3],{name:'Door 3: the Kitchen Door'});
PSP_L(9750,[45,22],9730,[14,24,1],{name:'the Kitchen Door, from inside'});
PSP_L(9730,[52,24],9760,[5,22,1],{name:'Door 4: the Cloister Door'});
PSP_L(9760,[2,22],9730,[50,24,3],{name:'the Cloister Door, from inside'});
PSP_L(9730,[3,34],9850,[6,58,0],{name:'west wall stair up',prov:1});
PSP_L(9850,[6,60],9730,[5,34,1],{name:'west wall stair down',prov:1});
PSP_L(9730,[60,34],9850,[89,58,0],{name:'east wall stair up',prov:1});
PSP_L(9850,[89,60],9730,[58,34,3],{name:'east wall stair down',prov:1});
/* ground floor: the three maps are joined inside */
PSP_L(9740,[2,30],9750,[42,12,3],{name:'screens passage to the service wing'});
PSP_L(9750,[45,12],9740,[5,30,1],{name:'service wing to the screens passage'});
PSP_L(9740,[61,30],9760,[5,12,1],{name:'banqueting hall to the east wing'});
PSP_L(9760,[2,12],9740,[58,30,3],{name:'east wing to the banqueting hall'});
/* the three stairs to the second floor (all need the Second Floor Key; far sides provisional) */
PSP_L(9740,[32,5],9820,[56,78,0],{name:'the Grand Stair',lock:'pskey2',prov:1});
PSP_L(9820,[56,81],9740,[32,8,2],{name:'the Grand Stair, down',prov:1});
PSP_L(9750,[6,3],9830,[8,8,2],{name:'the West Turret Stair',lock:'pskey2',prov:1});
PSP_L(9830,[8,5],9750,[6,6,2],{name:'the West Turret Stair, down',prov:1});
PSP_L(9760,[42,3],9840,[64,8,2],{name:'the East Turret Stair',lock:'pskey2',prov:1});
PSP_L(9840,[64,5],9760,[42,6,2],{name:'the East Turret Stair, down',prov:1});
/* package 4 to package 5: the dungeon door and the stairs down through the dungeons */
PSP_L(9750,[20,36],9780,[24,5,2],{name:'the Dungeon Door'});
PSP_L(9780,[24,2],9750,[20,33,0],{name:'stair up to the kitchens'});
PSP_L(9780,[40,36],9790,[40,5,2],{name:'stair down to the Deep Cells'});
PSP_L(9790,[40,2],9780,[40,33,0],{name:'stair up to the Gaols'});
PSP_L(9790,[8,36],9800,[8,5,2],{name:'stair down to the Oubliette'});
PSP_L(9800,[8,2],9790,[8,33,0],{name:'stair up to the Deep Cells'});
/* things every package needs to agree on */
PSP.TELE={id:9730,at:[8,44]};                       // the one teleport stone of the first build (TELE_KEEP_HI gets 9730); every other level is noTele
PSP.KEY2={item:'pskey2',name:'The Second Floor Key',flag:'key2',hiddenIn:9800};   // lies in a strongbox in the pit of the Oubliette, behind the Hunger (ps_dungeon.js); G.flags.psp.key2 = true once taken
PSP.REST=[9723,9731,9740,9750,9760];                 // levels that hold a quiet rest room (free rest, no creatures, warm candle light); the room names are in the plan
/* test and jump links (?town=...&lvl=...): name -> [level, x, y, f]; the party level for a link is the level rating of the target, capped at 115 */
PSP.JUMPS={palespire:[9720,32,52,0],palespire1:[9720,32,52,0],palespire2:[9730,32,49,0],palespire3:[9740,32,44,0],palespire4:[9750,42,22,3],
  palespire5:[9760,5,22,1],palespire6:[9780,24,5,2],palespire7:[9790,40,5,2],palespire8:[9800,8,5,2],palespirekey:[9800,22,14,2]};
/* small readers (no side effects) */
const pspIs=n=>n>=PSP.LO&&n<=PSP.HI;
const pspLevel=id=>PSP.LEVELS.find(l=>l.id===id)||null;
const pspLinksFrom=id=>PSP.LINKS.filter(l=>l.from===id);
const pspLinkAt=(id,x,y)=>PSP.LINKS.find(l=>l.from===id&&l.at&&l.at[0]===x&&l.at[1]===y)||null;
