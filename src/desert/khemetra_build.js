/* ==========================================================================
   KHEMETRA: THE BUILDINGS. Which fronts on the street are doors, what lies behind each one, and the rooms themselves.
   ========================================================================== */
const KH_PROPS={ // painted props by role: [sheet piece, height in cells]; the old game sprites stand in until a picture exists
  counter:['kh_int1_1','counter',.6],table:['kh_int1_2','bench',.5],shelf:['kh_int1_0','crate',1.05],bookcase:['kh_int1_3','crate',1.1],chair:['kh_int1_4','bench',.55],bed:['kh_int1_5','bench',.6],
  cushions:['kh_int2_0','sacks',.4],brazier:['kh_int2_2','brazier0',.75],hlamp:['kh_int2_1','lamp',.5],basin:['kh_int2_3','fountain',.7],amphora:['kh_int2_4','urn',.8],chest:['kh_int2_5','chest',.5],
  fountain:['kh_city1_0','fountain',1.1],well:['kh_city1_1','well',1.0],obelisk:['kh_city1_2','memorial',2.4],statue:['kh_city1_3','statue',1.5],lamp:['kh_nolamp','lamp',1.5],bench:['kh_city1_4','bench',.6],
  palm:['kh_city2_0','dpalm0',2.4],tree:['kh_city2_1','ltree17',1.7],shrub:['kh_city2_2','lbush0',.8],planter:['kh_city2_5','flowerpot',.5],pot:['kh_city2_3','flowerpot',.9],pergola:['kh_city2_4','bench',1.5],
  ship:['kh_ship1_0','crate',.9],wheel:['kh_ship1_1','barrel',.8],anchor:['kh_ship1_2','barrel',.8],rope:['kh_ship1_3','sacks',.35],seachest:['kh_ship1_4','chest',.5],sail:['kh_ship1_5','crate',1.1],
  throne:['kh_throne1_0','statue',1.4],banner:['kh_throne1_1','banner',1.3],maptable:['kh_throne1_2','counter',.6],candle:['kh_throne1_3','lamp',1.2],
  stallA:['kh_stall1_0','cart',.95],stallB:['kh_stall1_1','cart',.95],stallC:['kh_stall1_2','cart',.95],stallD:['kh_stall1_3','cart',.95],stallE:['kh_stall1_4','cart',.95],stallF:['kh_stall1_5','cart',.95],
  melons:['kh_stall2_0','crate',.5],amphorae:['kh_stall2_1','urn',.7],hay:['kh_stall2_2','cart',.7],veg:['kh_stall2_3','produce',.55],carpets:['kh_stall2_4','sacks',.6],copper:['kh_stall2_5','urn',.8],
  vase0:['vase0','vase0',.55],vase1:['vase1','vase1',.7],vase2:['vase2','vase2',.6],vase3:['vase3','vase3',.55]
};
function khProp(role){const p=KH_PROPS[role];return IMG[p[0]]?p[0]:p[1]}
function khPropH(role){return KH_PROPS[role][2]}
/* every building with a door: a pool of fronts to take it from, a name, a keeper, and the kind of room behind it */
const KH_BUILDINGS=[
  // shops
  {id:'potion1',pool:'shop',sub:'potion',name:"Nefer's Philtres",room:'shop',keeper:'kh_nefer',stock:'potion'},
  {id:'potion2',pool:'shop',sub:'potion',name:'The Green Flask',room:'shop',keeper:'kh_greenflask',stock:'potion'},
  {id:'potion3',pool:'shop',sub:'potion',name:"Old Senet's Remedies",room:'shop',keeper:'kh_senet',stock:'potion'},
  {id:'scroll1',pool:'shop',sub:'scroll',name:'The Silver Quill',room:'shop',keeper:'kh_quill',stock:'scroll'},
  {id:'scroll2',pool:'shop',sub:'scroll',name:'House of Seven Scrolls',room:'shop',keeper:'kh_sevenscrolls',stock:'scroll'},
  {id:'food1',pool:'shop',sub:'food',name:'The Golden Crust Bakery',room:'shop',keeper:'kh_baker',stock:'food'},
  {id:'food2',pool:'shop',sub:'food',name:'Dates and Dreams',room:'shop',keeper:'kh_dates',stock:'food'},
  {id:'food3',pool:'shop',sub:'spice',name:'The Spice Garden',room:'shop',keeper:'kh_spices',stock:'food'},
  {id:'food4',pool:'shop',sub:'food',name:"Hapi's Pantry",room:'shop',keeper:'kh_pantry',stock:'food'},
  {id:'arms1',pool:'shop',sub:'weapon',name:'The Sun Forge',room:'shop',keeper:'kh_forge',stock:'arms'},
  {id:'arms2',pool:'shop',sub:'weapon',name:"The Guard's Armoury",room:'shop',keeper:'kh_armoury',stock:'armour'},
  {id:'gen1',pool:'shop',sub:'cloth',name:'Silk and Linen',room:'shop',keeper:'kh_silk',stock:'general'},
  {id:'gen2',pool:'shop',sub:'cloth',name:"The Wanderer's Pack",room:'shop',keeper:'kh_pack',stock:'general'},
  {id:'ship',pool:'shop',sub:'ship',name:"Menkaure's Shipwrights",room:'ship',keeper:'kh_captain'},
  // inns
  {id:'inn1',pool:'shop',sub:'inn',name:'The Gilded Camel',room:'inn',keeper:'kh_inn1'},
  {id:'inn2',pool:'shop',sub:'inn2',name:'The Sleeping Sphinx',room:'inn',keeper:'kh_inn2'},
  {id:'inn3',pool:'shop',sub:'inn',name:'The Moon and Mint',room:'inn',keeper:'kh_inn3'},
  // work, quests, maps
  {id:'work1',pool:'shop',sub:'work',name:"The Labourers' Hall",room:'hall',keeper:'kh_work1'},
  {id:'work2',pool:'shop',sub:'work',name:'The Day Hire House',room:'hall',keeper:'kh_work2'},
  {id:'work3',pool:'shop',sub:'work',name:"Porters' Guild",room:'hall',keeper:'kh_work3'},
  {id:'quest1',pool:'shop',sub:'quest',name:'The Contract House',room:'hall',keeper:'kh_quest1'},
  {id:'quest2',pool:'shop',sub:'quest',name:"The Bounty Board",room:'hall',keeper:'kh_quest2'},
  // prayer houses and temples
  {id:'pray1',pool:'pray',name:'House of the Rising Sun',room:'prayer',keeper:'kh_pray1'},
  {id:'pray2',pool:'pray',name:'House of the Guiding Star',room:'prayer',keeper:'kh_pray2'},
  {id:'pray3',pool:'pray',name:'House of Eternal Life',room:'prayer',keeper:'kh_pray3'},
  {id:'pray4',pool:'pray',name:'House of the New Moon',room:'prayer',keeper:'kh_pray4'},
  {id:'temple1',pool:'temple',name:'Temple of the Sun',room:'temple',keeper:'kh_temple1'},
  {id:'temple2',pool:'temple',name:'Temple of Bastet',room:'temple',keeper:'kh_temple2'},
  {id:'church',pool:'pray',name:'The Church of Light',room:'temple',keeper:'kh_church',near:[122,205]},
  // baths
  {id:'bath1',pool:'bath',name:'The Court Baths',room:'bath',keeper:'kh_bath1'},
  {id:'bath2',pool:'bath',name:'The Blue Hammam',room:'bath',keeper:'kh_bath2'},
  // houses with something going on
  {id:'granary',pool:'low',name:'The Old Granary',room:'cellar',keeper:null,enemies:['rat','rat','rat','rat','rat','rat','rat','rat','bat','bat']},
  {id:'denA',pool:'ruin',name:'A Ruined House',room:'ruin',keeper:null,enemies:['skel','skel','skel']},
  {id:'denB',pool:'ruin',name:'A Collapsed House',room:'ruin',keeper:null,enemies:['skel','skel','skel']},
  {id:'denC',pool:'ruin',name:'A Boarded House',room:'ruin',keeper:null,enemies:['bandit','bandit','bandit','archer']},
  {id:'denD',pool:'ruin',name:'An Abandoned House',room:'ruin',keeper:null,enemies:['skel','skel','bat','bat']},
  {id:'urnhouse',pool:'ruin',name:'A Shuttered House',room:'ruin',keeper:null,enemies:[]},
  {id:'drumhouse',pool:'house',name:'The Musicians House',room:'home',keeper:'kh_drummer'},
  {id:'ledgerhouse',pool:'ruin',name:'The Tax Collectors Old House',room:'ruin',keeper:null,enemies:['bandit']},
  {id:'baths_cellar',pool:'bath',name:'The Bath Cellar',room:'cellar',keeper:null,enemies:['ghost','ghost','ghost','ghost'],near:[330,340]},
  // homes of those who give quests
  {id:'homeA',pool:'house',name:'A Quiet House',room:'home',keeper:'kh_homeA'},
  {id:'homeB',pool:'mansion',name:"A Merchant's House",room:'home',keeper:'kh_homeB'},
  {id:'homeC',pool:'house',name:"A Scholar's House",room:'home',keeper:'kh_homeC'},
];
const KH_DIRS=[[0,-1],[0,1],[-1,0],[1,0]];
const KH_FACE_F=[0,2,3,1]; // the way you face when you step out: north, south, west, east
let KH_LEVEL_NEXT=200;
/* choose, for each building, a stretch of street front of the right sort and far from its own kind */
function khPlaceBuildings(C){
  const rng=khRng(2024),placed=[],P=KH_POOLS,mods=C.modules;
  const byKind={};for(const m of mods){(byKind[m.kind]=byKind[m.kind]||[]).push(m)}
  const centre=m=>{const a=m.cells[Math.floor(m.cells.length/2)];return [a[0],a[1]]};
  const used=new Set();
  const poolOf=(b)=>b.pool==='shop'?P.shop[b.sub]:P[b.pool];
  const wantKind=(b)=>b.pool==='shop'?'shop':b.pool;
  const out=[];
  const frontOk=m=>{const mid=m.cells[Math.floor((m.cells.length-1)/2)],d=KH_DIRS[m.face],x=mid[0]+d[0],y=mid[1]+d[1];return C.reach[C.idx(x,y)]===1&&C.reach[C.idx(x+d[0],y+d[1])]===1};
  for(const kk in byKind)byKind[kk]=byKind[kk].filter(frontOk);
  for(const b of KH_BUILDINGS){
    const e0=poolOf(b)[0];if(!e0)continue;
    const need=e0.n;
    let cands=(byKind[wantKind(b)]||[]).filter(m=>m.n===need&&!used.has(m));
    if(b.pool==='low')cands=(byKind.low||[]).filter(m=>m.n===2&&!used.has(m));
    if(b.pool==='shop'&&cands.length<20)cands=mods.filter(m=>m.n===2&&!used.has(m)&&frontOk(m)&&(m.kind==='house'||m.kind==='shop'||m.kind==='mansion'));
    if(b.pool==='ruin'&&cands.length<10)cands=mods.filter(m=>m.n===2&&!used.has(m)&&frontOk(m)&&m.kind!=='castle'&&m.kind!=='palace');
    if(!cands.length)cands=mods.filter(m=>m.n===need&&!used.has(m)&&frontOk(m)&&m.kind!=='castle'&&m.kind!=='palace');
    let best=null,bs=-1e18;
    for(let t=0;t<260;t++){
      const m=cands[(rng()*cands.length)|0];if(!m||used.has(m))continue;
      const c=centre(m);
      let sc=1e9;
      if(b.near)sc=-Math.hypot(c[0]-b.near[0],c[1]-b.near[1]);
      else for(const q of placed)if(q.b.pool===b.pool&&q.b.sub===b.sub)sc=Math.min(sc,Math.hypot(c[0]-q.c[0],c[1]-q.c[1]));
      if(b.pool==='ruin'||b.id==='granary'){const dd=Math.hypot(c[0]-60,c[1]-60);sc=-dd+rng()*30}
      if(sc>bs){bs=sc;best=m}
    }
    if(!best)continue;
    used.add(best);
    const pool=poolOf(b),ent=pool[(rng()*pool.length)|0];
    best.e=ent;best.n=ent.n;best.wh=ent.wh;best.bld=b.id;
    // the module may now be a different size from the cells it holds: keep n equal to the cells
    best.e=Object.assign({},ent,{n:best.cells.length});
    placed.push({b,m:best,c:centre(best)});
    out.push({b,m:best});
  }
  return out;
}
/* the door tiles are the middle of each such front, and the rooms behind them are built into levels 200 and up */
function khMakeDoorsAndRooms(C,L,placed){
  const doors={};
  for(const {b,m} of placed){
    const lvl=KH_LEVEL_NEXT++;
    m.lvl=lvl;
    const dir=KH_DIRS[m.face],cells=m.cells,mid=cells[Math.floor((cells.length-1)/2)];
    const front=[mid[0]+dir[0],mid[1]+dir[1]],ff=KH_FACE_F[m.face];
    const doorCells=cells.length===2?cells:[mid];
    m.doorCells=doorCells;
    const room=khRoom(b,lvl,{to:44,x:front[0],y:front[1],f:ff});
    LEVELS[lvl]=room.level;
    m.at=room.start;
    doors[b.id]={lvl,front,face:ff,b};
    b.lvl=lvl;b.front=front;
  }
  return doors;
}
/* ---- the rooms ---- */
const KH_KEEPERS={}; // npc id -> {name, face, root}: filled in by khemetra_story.js
function khKeeperFace(id){const k=KH_KEEPERS[id];return k?k.face:'peasantM'}
function khInteriorWall(kind){ // a painted wall for the inside of a building
  const pick={shop:0,inn:3,hall:3,prayer:5,temple:1,bath:2,cellar:4,ruin:4,home:0,ship:3,palace:5}[kind];
  const im=IMG['kh_wall1_'+(pick===undefined?0:pick)];if(!im)return null;
  KH_WALLGID=KH_WALLGID||{};if(KH_WALLGID[kind]!==undefined)return KH_WALLGID[kind];
  const [c,x]=tcv();x.drawImage(im,0,0,TS,TS);const id=addTex(pix(c)),gid=KH_NEXT_GID++;T_TILE[gid]=id;return KH_WALLGID[kind]=gid;
}
let KH_WALLGID=null;
function khRoom(b,lvl,back){
  const rooms={shop:khRoomShop,inn:khRoomInn,prayer:khRoomPrayer,temple:khRoomTemple,bath:khRoomBath,hall:khRoomHall,cellar:khRoomCellar,ruin:khRoomRuin,home:khRoomHome,ship:khRoomShip};
  const R=(rooms[b.room]||khRoomShop)(b);
  const W=R.w,H=R.h,mid=W>>1;
  const rows=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++){r+=(y===0||x===0||x===W-1)?'w':y===H-1?(x===mid?'0':'w'):'.'}rows.push(r)}
  const decor=[],put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const raw=(k,x,y,o)=>decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}));
  const npc=(id,x,y,extra)=>{const kp=KH_KEEPERS[id];if(!kp)return;decor.push(Object.assign({k:kp.face,x,y,block:true,npc:id,sc:kp.sc||1},extra||{}))};
  R.build({put,raw,npc,mid,W,H});
  const wall=khInteriorWall(b.room);
  const level={rows,start:{x:mid,y:H-2,f:0},enemies:(R.enemies||[]).map(e=>({t:e[0],x:e[1],y:e[2],lvl:e[3]})),items:R.items||[],decor,day:0,amb:R.amb||.66,
    floor:R.floor||'kh1',ceil:'beam',name:b.name,label:b.name,lights:R.lights||[],portals:[{to:back.to,x:back.x,y:back.y,f:back.f,tex:'in'}],diff:16,khRoom:b.id,
    chars:wall?{w:wall}:undefined};
  if(R.noExtras)level.noExtras=true;
  return {level,start:{x:mid,y:H-2,f:0}};
}
const khPlan=(x0,y0,x1,y1)=>{const o=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)o.push([x,y]);return o};
function khRoomShop(b){return {w:11,h:8,lights:[[3,2],[7,2],[5,5]],build:({put,raw,npc,mid})=>{
  for(const x of [3,4,6,7])put('counter',x,3);
  for(const x of [1,2,3,7,8,9])put('shelf',x,1);
  put('amphora',1,5);put('amphora',9,5);put('chest',1,6);put('chest',9,6);raw('barrel',9,3);raw('crate',1,3);
  npc(b.keeper,mid,2);
}}}
function khRoomInn(b){return {w:13,h:9,lights:[[3,2],[9,2],[6,5],[2,7],[10,7]],build:({put,raw,npc,mid})=>{
  for(const x of [4,5,7,8])put('counter',x,3);
  put('shelf',3,1);put('shelf',4,1);put('shelf',8,1);put('shelf',9,1);raw('barrel',2,2);raw('barrel',10,2);
  for(const [x,y] of [[3,5],[9,5],[3,7],[9,7]]){put('table',x,y);put('chair',x-1,y);put('chair',x+1,y)}
  put('brazier',6,1);put('cushions',1,5);put('cushions',11,5);
  npc(b.keeper,mid,2);
  npc(b.id+'_p1',3,6);npc(b.id+'_p2',10,6);
}}}
function khRoomPrayer(b){return {w:9,h:8,floor:'kh2',lights:[[2,1],[6,1],[4,4]],amb:.6,build:({put,raw,npc,mid})=>{
  put('brazier',3,1);put('brazier',5,1);put('statue',4,1);
  for(const [x,y] of [[2,4],[3,4],[5,4],[6,4],[2,5],[3,5],[5,5],[6,5]])put('cushions',x,y);
  put('amphora',1,2);put('amphora',7,2);
  npc(b.keeper,mid,3);
}}}
function khRoomTemple(b){return {w:13,h:11,floor:'kh2',lights:[[4,1],[8,1],[6,5],[2,8],[10,8]],amb:.6,build:({put,raw,npc,mid})=>{
  put('statue',2,2);put('statue',10,2);put('statue',6,1);
  put('brazier',4,1);put('brazier',8,1);put('brazier',6,6);
  put('obelisk',1,5);put('obelisk',11,5);put('amphora',1,8);put('amphora',11,8);
  for(const [x,y] of [[3,6],[4,6],[8,6],[9,6],[3,8],[4,8],[8,8],[9,8]])put('cushions',x,y);
  npc(b.keeper,mid,3);
}}}
function khRoomBath(b){return {w:13,h:9,floor:'kh5',lights:[[3,2],[9,2],[6,5]],amb:.7,build:({put,raw,npc,mid})=>{
  for(const [x,y] of [[2,2],[10,2],[2,5],[10,5]])put('basin',x,y);
  put('cushions',4,1);put('cushions',8,1);put('amphora',1,7);put('amphora',11,7);put('brazier',6,1);
  npc(b.keeper,mid,3);
}}}
function khRoomHall(b){return {w:11,h:8,lights:[[3,2],[7,2],[5,5]],build:({put,raw,npc,mid})=>{
  for(const x of [3,4,6,7])put('counter',x,3);
  for(const x of [1,2,3,7,8,9])raw('noticeboard',x,1);
  put('table',2,5);put('chair',2,6);put('table',8,5);put('chair',8,6);raw('crate',1,3);raw('barrel',9,3);
  npc(b.keeper,mid,2);
}}}
function khRoomHome(b){return {w:9,h:7,lights:[[2,2],[6,2]],build:({put,raw,npc,mid})=>{
  put('bed',1,1);put('bed',7,1);put('table',4,3);put('chair',3,3);put('chair',5,3);put('chest',7,4);put('amphora',1,4);
  npc(b.keeper,mid,1);
}}}
function khRoomShip(b){return {w:13,h:9,lights:[[3,2],[9,2],[6,5]],build:({put,raw,npc,mid})=>{
  put('ship',6,1);put('wheel',2,2);put('anchor',10,2);put('rope',3,5);put('seachest',9,5);put('sail',1,4);put('sail',11,4);
  for(const x of [4,5,7,8])put('counter',x,3);
  npc(b.keeper,mid,2);
}}}
function khRoomCellar(b){
  const en=(b.enemies||[]);
  return {w:15,h:11,floor:'kh3',amb:.34,noExtras:true,lights:[[2,2],[12,2],[7,6],[3,8],[11,8]],
    enemies:en.map((t,i)=>[t,2+((i*5)%11),1+(i%3)*3,15]),items:[{k:'potion',x:13,y:9},{k:'potion',x:1,y:9}],
    build:({put,raw})=>{for(const [x,y] of [[3,3],[4,3],[7,3],[8,3],[11,3],[3,6],[7,6],[8,6],[11,6],[4,9],[10,9]])raw(((x+y)&1)?'barrel':'crate',x,y);raw('sacks',6,1);raw('sacks',9,9)}};
}
function khRoomRuin(b){
  const en=(b.enemies||[]);
  return {w:11,h:9,floor:'kh3',amb:.4,noExtras:true,lights:[[2,2],[8,2],[5,6]],
    enemies:en.map((t,i)=>[t,2+((i*3)%7),1+(i%2)*3,15]),items:[],
    build:({put,raw})=>{raw('bones',3,6);raw('bones',7,5);raw('crate',1,1);raw('barrel',9,1);raw('crate',9,7);raw('bones',2,3);
      if(b.id==='urnhouse')raw('urn',5,2,{npc:'kh_urn'});
      if(b.id==='ledgerhouse')raw('chest',5,1,{npc:'kh_ledger'});
      else if(b.id==='denC'){raw('chest',5,1,{npc:'kh_sealchest'});raw('sacks',2,6,{npc:'kh_drumsack'})}
      else raw('chest',5,1,{block:true,deco:false});}};
}
function decor_urn(raw){raw('urn',5,2,{npc:'kh_urn'})}
