/* ==========================================================================
   WENLOCK: THE INSIDES (prefix wlin / WLIN). Every room behind a door in Wenlock (levels 7100 to 7199): the church, the inn, the shops, the hall, the school, the
   almshouse, the cellar, the granary and the homes. The town (wenlock_town.js) builds each room through khRoom() when its door is first opened; this file
   (1) loads the painted pieces in assets/wl2 (made with Gemini, cut by tools/ingest_wl2.py), (2) wraps khRoom so that every Wenlock room gets its own walls, floor,
   windows, furniture and people, from the data in WLIN_ROOMS below, and (3) gives the small folk of the rooms things to say.
   Pieces: IMG['wl2_<sheet>_<n>']. Each prop is listed once in WLIN_P (piece, height in cells, glow, height off the floor).
   ========================================================================== */
const WLIN={man:null,ready:false,loading:null};
function wlinLoad(){
  if(WLIN.loading)return WLIN.loading;
  WLIN.loading=(async()=>{
    try{WLIN.man=await (await fetch('assets/wl2/manifest.json?v='+VERSION)).json()}catch(e){WLIN.man={}}
    await Promise.all(Object.keys(WLIN.man).map(k=>loadImg('wl2_'+k,'assets/wl2/'+WLIN.man[k].file)));
    wlinPrep();try{wlinFaces()}catch(e){console.error(e)}WLIN.ready=true;
  })().catch(e=>{console.error('wlinLoad',e);WLIN.man=WLIN.man||{};WLIN.ready=true});
  return WLIN.loading;
}
/* the town's own loader also waits for ours */
{const _wl=wlLoad;wlLoad=function(){if(WLIN._both)return WLIN._both;return WLIN._both=Promise.resolve(_wl.apply(this,arguments)).then(()=>wlinLoad())}}
/* prop: [piece, height in cells, glow [dx,dy] (a firelit or candlelit thing), height off the floor, stand-in role from the older props] */
const WLIN_P={
  hearth:['inn_0',1.3,0,0,'hearth'],bar:['inn_1',.8,0,0,'counter'],longtable:['inn_2',.6,0,0,'table'],ale:['inn_3',.8,0,0,'barrel'],chandelier:['inn_4',.62,[0,.72],.42,'hlamp'],lute:['inn_5',.55,0,0,'chair'],
  forge:['smith_0',1.3,0,0,'oven'],anvil:['smith_1',.55,0,0,'chest'],weaponrack:['smith_2',.9,0,0,'rack'],shelving:['smith_3',1.2,0,0,'shelf'],shopcounter:['smith_4',.75,0,0,'counter'],hangstand:['smith_5',1.2,0,0,'rack'],
  mannequin:['armour_0',1.1,0,0,'statue'],shields:['armour_1',.7,0,.3,'tapestry'],potshelf:['armour_2',1.25,0,0,'potshelf'],cauldron:['armour_3',.8,[0,.7],0,'brazier'],herbrack:['armour_4',1.1,0,0,'rack'],apothcab:['armour_5',.9,0,0,'dresser'],
  bookshelf:['library_0',1.3,0,0,'bookcase'],readdesk:['library_1',.8,0,0,'desk'],globe:['library_2',.7,0,0,'amphora'],scrollrack:['library_3',1.0,0,0,'shelf'],schooldesk:['library_4',.62,0,0,'table'],noticeboard:['library_5',.8,0,.1,'tapestry'],
  pew:['church_0',.62,0,0,'bench'],altar:['church_1',.85,0,0,'shrine'],glasswin:['church_2',1.5,0,.12,'tapestry'],font:['church_3',.7,0,0,'basin'],lectern:['church_4',.95,0,0,'shrine'],votive:['church_5',.8,[0,.35],0,'brazier'],
  oven:['bakery_0',.95,0,0,'oven'],bakertable:['bakery_1',.7,0,0,'table'],butcher:['bakery_2',1.25,0,0,'rack'],veg:['bakery_3',.6,0,0,'melons'],tailor:['bakery_4',1.1,0,0,'statue'],spinwheel:['bakery_5',.7,0,0,'loom'],
  cobbler:['trades_0',.8,0,0,'desk'],candlerack:['trades_1',1.15,[0,.4],0,'rack'],coopstack:['trades_2',.95,0,0,'amphorae'],cothearth:['trades_3',.95,0,0,'hearth'],bed:['trades_4',.7,0,0,'bed'],cot:['trades_5',.55,0,0,'cradle'],
  pietable:['home_0',.7,0,0,'table'],dresser:['home_1',1.05,0,0,'dresser'],cat:['home_2',.26,0,0,'cushions'],dog:['home_3',.36,0,0,'cushions'],rocker:['home_4',.7,0,0,'chair'],clock:['home_5',1.3,0,0,'wardrobe'],
  banner:['hall_0',1.7,0,.05,'banner'],tapestry:['hall_1',1.1,0,.3,'tapestry'],counciltable:['hall_2',.8,0,0,'feast'],mayorchair:['hall_3',1.0,0,0,'throne'],waterbarrel:['hall_4',.7,0,0,'barrel'],coatrack:['hall_5',1.1,0,0,'rack']
};
const WLIN_S=1.2; // every prop is drawn a fifth larger than its table height, so the rooms are not bare
const WLIN_FOLK={wife:'folk1_0',vicar:'folk1_1',teacher:'folk1_2',boy:'folk1_3',girl:'folk1_4',baker:'folk1_5',minstrel:'folk2_0',smith:'folk2_1',farmer:'folk2_2',gran:'folk2_3',merchant:'folk2_4',maid:'folk2_5'};
/* fall-back looks: the older props are used while a picture is missing */
function wlinPrep(){
  for(const k in WLIN_P){const p=WLIN_P[k];NPC_H['wl2_'+p[0]]=p[1]*WLIN_S}
  for(const k in WLIN_FOLK)NPC_H['wl2_'+WLIN_FOLK[k]]=.98;
  for(let i=0;i<6;i++){const im=IMG['wl2_floor_'+i];if(im&&!FLOORS['wl2f'+i])FLOORS['wl2f'+i]=dsPaintedTex(im)}
}
/* the walls: kind -> wall piece, floor piece, window pieces that suit it */
const WLIN_LOOK={
  timber:{wall:'wl2_wall_0',floor:'wl2f0',ff:'floor_0',win:2},oak:{wall:'wl2_wall_1',floor:'wl2f0',ff:'floor_0',win:3},plaster:{wall:'wl2_wall_2',floor:'wl2f0',ff:'floor_0',win:0},
  plaster2:{wall:'wl2_wall_2',floor:'wl2f4',ff:'floor_4',win:5},stone:{wall:'wl2_wall_3',floor:'wl2f1',ff:'floor_1',win:4},brick:{wall:'wl2_wall_4',floor:'wl2f2',ff:'floor_2',win:0},
  brick2:{wall:'wl2_wall_4',floor:'wl2f3',ff:'floor_3',win:0},sage:{wall:'wl2_wall_5',floor:'wl2f0',ff:'floor_0',win:5},church:{wall:'wl2_wall_3',floor:'wl2f5',ff:'floor_5',win:1},
  cellar:{wall:'wl2_wall_3',floor:'wl2f1',ff:'floor_1',win:4},tile:{wall:'wl2_wall_2',floor:'wl2f3',ff:'floor_3',win:0},timber2:{wall:'wl2_wall_0',floor:'wl2f4',ff:'floor_4',win:2},
  oakflag:{wall:'wl2_wall_1',floor:'wl2f1',ff:'floor_1',win:3}
};
let WLIN_WIN={},WLIN_DOORTEX=null;
function wlinDoorTex(){if(WLIN_DOORTEX!==null)return WLIN_DOORTEX;const im=IMG.kh_ohwall1_5||IMG.wl2_wall_1;if(!im)return WLIN_DOORTEX=T_TILE[1]||0;const [c,x]=tcv();x.drawImage(im,0,0,TS,TS);return WLIN_DOORTEX=addTex(pix(c))}
function wlinWinGid(i){ // a wall square with a window in it
  if(WLIN_WIN[i]!==undefined)return WLIN_WIN[i];const im=IMG['wl2_ww_'+i];if(!im)return WLIN_WIN[i]=null;
  const [c,x]=tcv();x.drawImage(im,0,0,TS,TS);const id=addTex(pix(c)),gid=KH_NEXT_GID++;T_TILE[gid]=id;return WLIN_WIN[i]=gid;
}
/* ---- a prop on the floor: always the painted piece when it exists, else the older stand-in ---- */
function wlinProp(C,name,x,y,o){
  o=o||{};const p=WLIN_P[name];if(!p)return;const key='wl2_'+p[0];
  if(!IMG[key]){const r=p[4];if(r&&typeof KH_PROPS!=='undefined'&&KH_PROPS[r])C.put(r,x,y,o.npc?{npc:o.npc}:undefined);return}
  const im=IMG[key],ratio=(o.h?o.h/p[1]:1)*(o.sc||1),w=p[1]*WLIN_S*im.width/im.height*ratio;
  const d=Object.assign({},o);delete d.h;delete d.sc;if(ratio!==1)d.sc=ratio;
  const bob=o.bob!==undefined?o.bob:p[3];if(bob)d.bob=bob*ratio;
  if(p[2]&&o.glow!==0){C.raw('lamp',x,y,Object.assign({lk:key,glow:p[2]},d))}else C.raw(key,x,y,d);
  // the cells under a wide piece are blocked too (not the ones in the middle of a room: the party walks round)
  if(!o.free)for(let xx=Math.floor(x+.5-w/2+.12);xx<=Math.floor(x+.5+w/2-.12);xx++){if(xx!==x)C.raw('crate',xx,y,{hidden:true})}
}
/* ---- the room data. w,h; look; amb; lights [x,y,red]; props [name,x,y,opts]; folk [id,x,y,opts] (the keeper stays 'keeper'); win [x,y] (a window in a wall square) ---- */
const WLIN_ROOMS={};
const WLIR=(name,def)=>{WLIN_ROOMS[name]=def};
/* THE INN: a great hearth behind the landlord, a bar either side of him, long tables, barrels, a chandelier, a minstrel and his lute */
WLIR('inn',{w:15,h:11,look:'timber',amb:.62,lights:[[3,2],[11,2],[7,6,1],[2,8],[12,8]],keeper:[7,2],
  props:[['hearth',7,1],['bar',3,3],['bar',4,3],['bar',5,3],['bar',6,3],['bar',8,3],['bar',9,3],['bar',10,3],['bar',11,3],['potshelf',2,1],['potshelf',3,1],['potshelf',11,1],['potshelf',12,1],['ale',1,2],['ale',13,2],
    ['longtable',3,6],['longtable',11,6],['longtable',3,8],['longtable',11,8],['chandelier',4,5,{free:1}],['chandelier',10,5,{free:1}],['chandelier',7,7,{free:1}],['lute',13,9],['waterbarrel',1,9],['shelving',1,8]],
  folk:[['wli_nell',6,4],['wli_farmers',9,4],['wli_traveller2',5,5],['wli_minstrel',12,9],['wli_innkeeper_dog',8,6],['wli_inn_cat',2,4]],win:[[4,0],[10,0],[0,4],[0,8],[14,4],[14,8]]});
/* THE GENERAL STORE */
WLIR('general',{w:11,h:8,look:'timber2',amb:.64,lights:[[2,2],[8,2],[5,5]],keeper:[5,2],
  props:[['shelving',1,1],['shelving',2,1],['shelving',8,1],['shelving',9,1],['hangstand',5,1],['shopcounter',3,3],['shopcounter',4,3],['shopcounter',6,3],['shopcounter',7,3],['coopstack',9,5],['veg',1,5],['bookshelf',9,3,{h:1.0}]],
  folk:[['wli_dibble_cat',2,6]],win:[[3,0],[7,0],[0,4],[10,4]],raw:[['barrel',1,3],['sacks',9,6],['crate',1,6],['sacks',10,2]]});
/* THE SMITHY: forge glow, anvil, bellows, racks of blades */
WLIR('forge',{w:13,h:9,look:'cellar',amb:.5,lights:[[5,1,1],[7,1,1],[2,4],[10,4],[6,6,1]],keeper:[6,2],
  props:[['forge',6,1],['weaponrack',2,1],['weaponrack',3,1],['weaponrack',9,1],['weaponrack',10,1],['anvil',9,3],['anvil',3,3],['shopcounter',5,3],['shopcounter',7,3],['waterbarrel',11,2],['hangstand',1,4,{h:1.0}],['shields',11,5]],
  folk:[['wli_apprentice',9,4]],win:[[3,0],[9,0],[0,4],[12,4]],raw:[['barrel',11,6],['crate',1,7]]});
/* THE ARMOURER */
WLIR('armour',{w:13,h:9,look:'stone',amb:.56,lights:[[2,2],[10,2],[6,5]],keeper:[6,2],
  props:[['mannequin',2,1],['mannequin',4,1],['mannequin',8,1],['mannequin',10,1],['shields',6,1],['shopcounter',4,3],['shopcounter',5,3],['shopcounter',7,3],['shopcounter',8,3],['weaponrack',11,4],['mannequin',1,5],['shields',1,3,{bob:.2}],['anvil',11,6,{h:.45}]],
  folk:[],win:[[3,0],[9,0],[0,4],[12,4]],raw:[['crate',11,2],['barrel',1,7]]});
/* THE WEAPONSMITH */
WLIR('weapons',{w:13,h:9,look:'brick',amb:.58,lights:[[3,2],[9,2],[6,5],[11,6,1]],keeper:[6,2],
  props:[['weaponrack',1,1],['weaponrack',3,1],['weaponrack',9,1],['weaponrack',11,1],['shields',6,1],['shopcounter',4,3],['shopcounter',5,3],['shopcounter',7,3],['shopcounter',8,3],['anvil',11,5],['forge',11,3,{h:.9}]],
  folk:[['wli_hale_d1',3,4],['wli_hale_d2',9,5]],win:[[2,0],[10,0],[0,5],[12,6]],raw:[['barrel',1,5],['crate',1,7]]});
/* THE POTION SHOP: bubbling flasks, shelves of coloured bottles */
WLIR('potion',{w:11,h:8,look:'oak',amb:.56,lights:[[2,2],[8,2],[5,5,0],[9,4,1]],keeper:[5,2],
  props:[['potshelf',1,1],['potshelf',2,1],['potshelf',3,1],['potshelf',7,1],['potshelf',8,1],['potshelf',9,1],['apothcab',5,1],['shopcounter',4,3],['shopcounter',6,3],['cauldron',9,4],['cauldron',1,4,{h:.55,glow:0}],['herbrack',9,6,{h:.9}]],
  folk:[['wli_holt_cat',2,6]],win:[[3,0],[7,0],[0,4],[10,4]],raw:[['crate',1,6],['barrel',10,2]]});
/* THE HERBALIST: hanging bundles, drying racks, jars */
WLIR('herbs',{w:11,h:8,look:'plaster2',amb:.62,lights:[[2,2],[8,2],[5,5],[9,4,1]],keeper:[5,2],
  props:[['herbrack',1,1],['herbrack',3,1],['herbrack',7,1],['herbrack',9,1],['apothcab',5,1],['shopcounter',4,3],['shopcounter',6,3],['cauldron',9,4],['herbrack',1,5,{h:.9}],['apothcab',2,6,{h:.7}]],
  folk:[['wli_bryony_cat',8,6]],win:[[3,0],[7,0],[0,4],[10,4]],raw:[['sacks',10,2],['crate',1,3]]});
/* THE SCROLL SELLER */
WLIR('scrolls',{w:11,h:8,look:'oak',amb:.58,lights:[[2,2],[8,2],[5,5]],keeper:[5,2],
  props:[['bookshelf',1,1],['scrollrack',2,1],['scrollrack',3,1],['scrollrack',7,1],['scrollrack',8,1],['bookshelf',9,1],['readdesk',4,3],['readdesk',6,3],['globe',9,5],['bookshelf',1,5,{h:1.0}]],
  folk:[['wli_quill_cat',3,6]],win:[[5,0],[0,4],[10,4]],raw:[['crate',9,3]]});
/* THE LIBRARY: tall shelves, reading desks, a globe */
WLIR('library',{w:15,h:11,look:'oak',amb:.58,lights:[[2,2],[7,2],[12,2],[3,7],[11,7]],keeper:[7,2],
  props:[['bookshelf',1,1,{npc:'wli_shelf1'}],['bookshelf',2,1,{npc:'wli_shelf2'}],['bookshelf',3,1,{npc:'wli_shelf3'}],['bookshelf',4,1],['bookshelf',5,1],['bookshelf',9,1],['bookshelf',10,1],['bookshelf',11,1,{npc:'wli_shelf4'}],['bookshelf',12,1,{npc:'wli_shelf5'}],['bookshelf',13,1,{npc:'wli_shelf6'}],
    ['readdesk',6,3],['readdesk',8,3],['globe',3,5],['readdesk',11,6],['readdesk',3,8],['noticeboard',13,5],['scrollrack',1,5],['bookshelf',1,7],['bookshelf',1,8],['bookshelf',13,8],['bookshelf',13,9,{npc:'wli_shelf7'}]],
  folk:[['wli_reader1',10,6],['wli_reader2',4,8],['wli_lib_cat',6,6]],win:[[7,0],[0,3],[14,3],[0,6],[14,6]],raw:[]});
/* THE BAKERY */
WLIR('bakery',{w:11,h:8,look:'brick2',amb:.62,lights:[[2,2,1],[8,2],[5,5]],keeper:[5,2],
  props:[['oven',1,1],['oven',2,1,{glow:0}],['bakertable',3,3],['bakertable',7,3],['veg',9,5],['shelving',8,1],['shelving',9,1],['bakertable',5,6,{h:.55}]],
  folk:[['wli_baker_wife',8,4],['wli_baker_dog',2,5]],win:[[4,0],[7,0],[0,4],[10,4]],raw:[['sacks',1,5],['sacks',1,6],['sacks',10,2]]});
/* THE BUTCHER */
WLIR('butcher',{w:11,h:8,look:'stone',amb:.56,lights:[[2,2],[8,2],[5,5]],keeper:[5,2],
  props:[['butcher',1,1],['butcher',3,1],['butcher',7,1],['butcher',9,1],['shopcounter',4,3],['shopcounter',6,3],['coopstack',9,5,{h:.7}],['waterbarrel',1,5]],
  folk:[['wli_butcher_dog',3,5]],win:[[5,0],[0,4],[10,4]],raw:[['crate',10,2],['barrel',1,3]]});
/* THE GREENGROCER */
WLIR('green',{w:11,h:8,look:'plaster',amb:.7,lights:[[2,2],[8,2],[5,5]],keeper:[5,2],
  props:[['veg',1,1],['veg',2,1],['veg',3,1],['veg',7,1],['veg',8,1],['veg',9,1],['shopcounter',4,3],['shopcounter',6,3],['veg',1,5],['veg',9,5],['coopstack',10,3,{h:.7}]],
  folk:[['wli_pip_goat',8,6]],win:[[3,0],[7,0],[0,4],[10,4]],raw:[['sacks',1,3],['sacks',9,2],['crate',2,6]]});
/* THE TAILOR */
WLIR('tailor',{w:11,h:8,look:'sage',amb:.64,lights:[[2,2],[8,2],[5,5]],keeper:[5,2],
  props:[['tailor',1,1],['tailor',2,1],['tailor',3,1],['tailor',7,1],['tailor',8,1],['tailor',9,1],['shopcounter',4,3],['shopcounter',6,3],['spinwheel',9,5],['tailor',1,5,{h:.9}],['bed',4,6,{h:.5}]],
  folk:[['wli_lacey_cat',8,6]],win:[[5,0],[0,4],[10,4]],raw:[['chest',10,2]]});
/* THE COBBLER */
WLIR('cobbler',{w:9,h:7,look:'timber2',amb:.62,lights:[[2,2],[6,2],[4,4]],keeper:[4,2],
  props:[['cobbler',1,1],['cobbler',2,1],['shelving',6,1],['shelving',7,1],['shopcounter',3,3],['shopcounter',5,3],['coopstack',7,4,{h:.6}],['rocker',1,4]],
  folk:[['wli_heel_dog',2,5]],win:[[4,0],[0,3],[8,3]],raw:[['crate',7,5]]});
/* THE CHANDLER: candles hanging everywhere */
WLIR('chandler',{w:9,h:7,look:'plaster',amb:.7,lights:[[2,2],[6,2],[4,4],[2,5],[6,5]],keeper:[4,2],
  props:[['candlerack',1,1],['candlerack',2,1],['candlerack',6,1],['candlerack',7,1],['shopcounter',3,3],['shopcounter',5,3],['candlerack',1,4,{h:.9}],['candlerack',7,4,{h:.9}],['chandelier',4,4,{free:1}]],
  folk:[['wli_wick_cat',7,5]],win:[[4,0],[0,3],[8,3]],raw:[['barrel',1,5]]});
/* THE COOPER */
WLIR('cooper',{w:11,h:8,look:'timber',amb:.62,lights:[[2,2],[8,2],[5,5]],keeper:[5,2],
  props:[['coopstack',1,1],['coopstack',2,1],['coopstack',8,1],['coopstack',9,1],['ale',5,1,{h:.8}],['shopcounter',4,3],['shopcounter',6,3],['ale',1,5],['waterbarrel',9,5],['coopstack',10,3,{h:.7}]],
  folk:[['wli_hoop_dog',3,5]],win:[[3,0],[7,0],[0,4],[10,4]],raw:[['crate',2,6]]});
/* THE VILLAGE HALL: a long table, the mayor's chair, banners, a notice board */
WLIR('hall',{w:13,h:10,look:'oakflag',amb:.62,lights:[[2,2],[10,2],[6,6],[2,7],[10,7]],keeper:[6,2],
  props:[['banner',2,1],['banner',4,1],['banner',8,1],['banner',10,1],['mayorchair',6,1],['counciltable',5,3],['counciltable',7,3],['noticeboard',1,4],['noticeboard',11,4,{npc:'wli_notice2'}],['coatrack',1,7],['waterbarrel',11,7],['tapestry',11,1,{h:.9}],['tapestry',1,1,{h:.9}]],
  folk:[['wli_page2',9,5],['wli_clerk',3,5]],win:[[6,0],[0,3],[0,7],[12,3],[12,7]],raw:[]});
/* THE SCHOOL */
WLIR('school',{w:11,h:9,look:'sage',amb:.66,lights:[[2,2],[8,2],[5,5]],keeper:[5,2],
  props:[['noticeboard',4,1,{npc:'wli_blackboard'}],['noticeboard',6,1,{h:.7}],['bookshelf',1,1],['bookshelf',9,1],['schooldesk',2,4],['schooldesk',4,4],['schooldesk',6,4],['schooldesk',8,4],['schooldesk',2,6],['schooldesk',4,6],['schooldesk',6,6],['schooldesk',8,6],['globe',1,3,{h:.55}],['coatrack',10,3,{h:.9}]],
  folk:[['wli_pupil1',3,5],['wli_pupil2',7,5],['wli_pupil3',5,7]],win:[[2,0],[8,0],[0,4],[10,4]],raw:[]});
/* THE ALMSHOUSE */
WLIR('almshouse',{w:11,h:8,look:'plaster2',amb:.64,lights:[[2,2],[8,2],[5,5]],keeper:[5,2],
  props:[['bed',1,1],['bed',2,1],['bed',8,1],['bed',9,1],['cothearth',5,1],['rocker',2,4],['pietable',8,4],['dresser',10,3,{h:.9}],['clock',1,5,{h:1.0}],['cat',3,5]],
  folk:[['wli_gran',3,3],['wli_oldfarmer',7,5],['wli_almscat',3,6]],win:[[3,0],[7,0],[0,4],[10,4]],raw:[]});
/* THE CHURCH OF SAINT WENNA: nave, pews, stained glass, altar, a font, a priest */
WLIR('church',{w:13,h:13,look:'church',amb:.62,lights:[[3,2],[9,2],[6,3],[3,7],[9,7],[2,10],[10,10]],keeper:[6,2],
  props:[['altar',6,1],['glasswin',3,1],['glasswin',9,1],['votive',2,2,{npc:'wli_votive'}],['votive',10,2,{npc:'wli_votive'}],['pew',3,5],['pew',4,5],['pew',8,5],['pew',9,5],['pew',3,7],['pew',4,7],['pew',8,7],['pew',9,7],['pew',3,9],['pew',4,9],['pew',8,9],['pew',9,9],
    ['font',10,11],['lectern',5,3,{npc:'wli_lectern'}],['banner',1,5,{h:1.2}],['banner',11,5,{h:1.2}]],
  folk:[['wli_widow',3,6],['wli_choirboy',9,8],['wli_church_cat',7,10]],win:[[2,0],[4,0],[6,0],[8,0],[10,0],[0,3],[0,6],[0,9],[12,3],[12,6],[12,9]],raw:[]});
/* THE INN CELLAR and THE OLD GRANARY */
WLIR('cellar',{w:15,h:11,look:'cellar',amb:.36,lights:[[2,2],[12,2],[7,6],[3,8],[11,8]],keeper:null,noExtras:1,
  props:[['ale',3,2],['ale',5,2],['ale',9,2],['ale',11,2],['coopstack',1,7],['coopstack',13,7],['ale',3,8],['ale',11,8]],
  folk:[['wli_ghost',7,3]],win:[],raw:[['crate',1,2],['barrel',13,2],['sacks',6,9],['crate',8,9],['barrel',1,9],['crate',13,9]],items:[['potion5',13,8],['manadraught',1,8]]});
WLIR('granary',{w:13,h:9,look:'timber2',amb:.4,lights:[[2,2],[10,2],[6,5]],keeper:null,noExtras:1,
  props:[['shelving',1,1],['shelving',2,1],['shelving',10,1],['shelving',11,1],['coopstack',6,1],['veg',3,5,{h:.55}],['veg',9,5,{h:.55}]],
  folk:[],win:[[4,0],[8,0],[0,4],[12,4]],raw:[['sacks',4,3],['sacks',8,3],['sacks',6,6],['sacks',2,6],['sacks',10,6],['crate',1,3],['crate',11,3],['sacks',3,7],['sacks',9,7]],
  enemies:[['rat',3,4,70],['rat',9,4,70],['rat',6,7,70],['rat',2,7,70],['bat',6,3,70]],items:[['potion4',11,7]]});
/* THE HOMES, one look for each kind of household (WL_COT in the town file picks the kind) */
const WLIN_HOME={
  warm:{look:'timber',amb:.64,res:[5,3],props:[['cothearth',4,1],['bed',7,1],['dresser',1,1],['pietable',2,4,{npc:'wli_pie'}],['clock',8,3,{h:1.1}],['rocker',6,4]],folk:[['wli_home_cat',3,2],['wli_home_dog',6,5]],win:[[2,0],[6,0],[0,3],[8,3]]},
  worker:{look:'plaster2',amb:.62,res:[4,3],props:[['cothearth',4,1],['shelving',7,1],['dresser',1,1],['pietable',2,4],['ale',7,4],['veg',1,4,{h:.5}],['coopstack',8,3,{h:.7}]],folk:[['wli_home_dog',5,5]],win:[[2,0],[6,0],[8,3]]},
  spartan:{look:'plaster',amb:.58,res:[3,4],props:[['bed',1,1],['clock',7,1],['tapestry',4,1,{h:.9}],['rocker',2,3],['votive',6,3,{h:.6}]],folk:[['wli_home_cat',5,4]],win:[[4,0],[0,3],[8,3]]},
  messy:{look:'oak',amb:.6,res:[4,3],props:[['bookshelf',1,1],['bookshelf',2,1],['bookshelf',7,1],['readdesk',4,1],['globe',6,3,{h:.55}],['bed',7,4],['scrollrack',1,4,{h:.8}]],folk:[['wli_home_cat',3,4]],win:[[3,0],[0,3]],raw:[['crate',6,5],['crate',2,5],['sacks',8,5]]},
  scholar:{look:'oak',amb:.6,res:[4,3],props:[['bookshelf',1,1],['bookshelf',2,1],['bookshelf',3,1],['bookshelf',7,1],['readdesk',5,1],['globe',2,4],['rocker',7,4],['lectern',6,3,{h:.8}]],folk:[['wli_home_cat',5,5]],win:[[4,0],[8,3]]},
  merchant:{look:'timber',amb:.62,res:[4,3],props:[['dresser',1,1],['shelving',3,1],['tapestry',5,1,{h:.9}],['bed',7,1],['pietable',2,4],['clock',8,3,{h:1.1}]],folk:[['wli_home_dog',5,5]],win:[[4,0],[0,3],[8,3]],raw:[['chest',1,3],['chest',2,3],['sacks',6,3],['sacks',7,3]]},
  healer:{look:'plaster2',amb:.62,res:[4,3],props:[['herbrack',1,1],['herbrack',2,1],['apothcab',4,1],['cauldron',7,3,{h:.6}],['bed',7,1],['herbrack',1,4,{h:.8}]],folk:[['wli_home_cat',3,5]],win:[[3,0],[6,0],[0,3]]},
  children:{look:'timber2',amb:.68,res:[4,3],props:[['cot',1,1],['bed',7,1],['cothearth',4,1],['cot',7,4,{h:.5}],['rocker',2,4],['pietable',5,5,{h:.55}]],folk:[['wli_home_cat',3,3],['wli_home_dog',6,5],['wli_home_kid',2,6]],win:[[2,0],[6,0],[0,3],[8,3]]},
  potter:{look:'brick2',amb:.62,res:[4,3],props:[['oven',1,1],['bakertable',4,1],['bed',7,1],['shelving',8,3,{h:.9}],['veg',1,4,{h:.5}]],folk:[['wli_home_dog',6,5]],win:[[3,0],[6,0],[8,3]],raw:[['sacks',2,4],['sacks',7,4]]},
  cats:{look:'plaster',amb:.64,res:[4,3],props:[['cat',1,1,{h:.3}],['cat',2,3,{h:.3}],['cat',6,1,{h:.3}],['cat',7,4,{h:.3}],['rocker',2,1],['bed',7,1,{h:.6}],['pietable',4,5,{h:.55}],['dresser',8,2,{h:.9}]],folk:[['wli_home_cat',3,5],['wli_cat2',5,3]],win:[[4,0],[0,3],[8,3]]},
  soldier:{look:'stone',amb:.58,res:[4,3],props:[['weaponrack',1,1],['mannequin',3,1],['bed',7,1],['shields',5,1],['pietable',2,4],['ale',7,4,{h:.55}]],folk:[['wli_home_dog',5,5]],win:[[4,0],[0,3],[8,3]]},
  fisher:{look:'timber2',amb:.6,res:[4,3],props:[['hangstand',1,1],['bed',7,1],['cothearth',4,1],['ale',7,4,{h:.7}],['coopstack',1,4,{h:.8}],['pietable',2,4]],folk:[['wli_home_cat',5,5]],win:[[2,0],[6,0],[8,3]]},
  noble:{look:'oak',amb:.66,res:[4,3],props:[['dresser',1,1],['tapestry',4,1,{h:.95}],['clock',7,1],['bed',7,4,{h:.8}],['pietable',2,4],['bookshelf',1,4,{h:1.0}],['mannequin',3,1,{h:.9}]],folk:[['wli_home_dog',5,5]],win:[[3,0],[6,0],[0,3],[8,3]]},
  musician:{look:'timber',amb:.64,res:[4,3],props:[['lute',1,1],['lute',2,1,{h:.5}],['bed',7,1],['tapestry',4,1,{h:.9}],['rocker',2,4],['pietable',7,4,{h:.55}]],folk:[['wli_home_cat',5,5]],win:[[4,0],[0,3],[8,3]]}
};
for(const k in WLIN_HOME)WLIR('home_'+k,Object.assign({w:9,h:7,keeper:null},WLIN_HOME[k]));
/* ---- every door of the town (WL_DOORS in wenlock_town.js) gets its room, built when first entered (KH_LAZY) ---- */
const WLIN_BY_KIND={church:'church',inn:'inn',smith:'forge',bakery:'bakery',butcher:'butcher',library:'library',scroll:'scrolls',tailor:'tailor',armour:'armour',weapons:'weapons',general:'general',greengrocer:'green',potion:'potion',herb:'herbs',cooper:'cooper',chandler:'chandler',cobbler:'cobbler',almshouse:'almshouse',school:'school',hall:'hall'};
const WLIN_KEEPER={church:'wli_k_church',inn:'wli_k_inn',smith:'wli_k_smith',bakery:'wli_k_bakery',butcher:'wli_k_butcher',library:'wli_k_library',scroll:'wli_k_scrolls',tailor:'wli_k_tailor',armour:'wli_k_armour',weapons:'wli_k_weapons',general:'wli_k_general',greengrocer:'wli_k_green',potion:'wli_k_potion',herb:'wli_k_herbs',cooper:'wli_k_cooper',chandler:'wli_k_chandler',cobbler:'wli_k_cobbler',almshouse:'wli_k_almshouse',school:'wli_k_school',hall:'wli_k_hall'};
const WLIN_SCENES=['warm','worker','spartan','messy','scholar','merchant','healer','children','potter','cats','soldier','fisher','noble','musician'];
const WLIN_HOMENAME={warm:'A Warm Cottage',worker:"A Farmer's Kitchen",spartan:"A Widow's Parlour",messy:'A Cluttered Cottage',scholar:"A Scholar's Cottage",merchant:"A Wool Merchant's House",healer:"A Healer's Cottage",children:"A Family's Cottage",potter:"A Baker's Flat",cats:'A House of Cats',soldier:"A Retired Soldier's House",fisher:"A Brook Fisher's Cottage",noble:"A Gentleman's House",musician:"A Fiddler's Cottage"};
const WLIN_RES={warm:['wli_r_wife','wli_r_cook'],worker:['wli_r_wife','wli_r_man'],spartan:['wli_r_old','wli_r_nun'],messy:['wli_r_scholar','wli_r_fiddler'],scholar:['wli_r_scholar','wli_r_girl'],merchant:['wli_r_wife','wli_r_cook'],healer:['wli_r_nun','wli_r_old'],children:['wli_r_mum','wli_r_wife'],potter:['wli_r_weaver','wli_r_cook'],cats:['wli_r_old','wli_r_weaver'],soldier:['wli_r_man','wli_r_old'],fisher:['wli_r_old','wli_r_man'],noble:['wli_r_wife','wli_r_scholar'],musician:['wli_r_fiddler','wli_r_girl']};
function wlinMake(d){ // d: one entry of WL_DOORS
  const id=d.id,home=!WLIN_BY_KIND[d.kind],r=hash2(id,7,3),scene=home?WLIN_SCENES[(r*WLIN_SCENES.length)|0]:null;
  const name=home?WLIN_HOMENAME[scene]:d.name,back={to:WL.ID,x:d.front.x,y:d.front.y,f:d.out};
  const b={id:'wlin'+id,wlin:home?'home_'+scene:WLIN_BY_KIND[d.kind],name,room:home?'home':'shop',keeper:home?(hash2(id,9,4)<.8?WLIN_RES[scene][(hash2(id,5,5)*WLIN_RES[scene].length)|0]:null):WLIN_KEEPER[d.kind],floor:'wood',wallImg:'kh_ohwall1_2'};
  const R=khRoom(b,id,back);LEVELS[id]=R.level;LEVELS[id].diff=80;LEVEL_NAMES[id]=name;LEVEL_RATING[id]=80;return R.level;
}
for(const d of WL_DOORS){const id=d.id;KH_LAZY[id]=()=>{if(!LEVELS[id])wlinMake(d)}}
/* the inn cellar (7190) is down a trapdoor-door in the inn's west wall; a smugglers' tunnel leads on to the old granary (7191) */
function wlinCellar(which){
  const inn=WL_DOORS.find(d=>d.kind==='inn'),id=which?WL.GRANARY:WL.CELLAR,nm=which?'The Old Granary':'The Inn Cellar',name=which?'granary':'cellar';
  const b={id:'wlin'+id,wlin:name,name:nm,room:'cellar',keeper:null,floor:'wood',wallImg:'kh_ohwall1_0'};
  const R=khRoom(b,id,{to:which?WL.CELLAR:inn.id,x:which?13:1,y:which?5:5,f:which?3:1});LEVELS[id]=R.level;LEVELS[id].diff=80;LEVEL_NAMES[id]=nm;LEVEL_RATING[id]=80;
  return R.level;
}
KH_LAZY[WL.CELLAR]=()=>{if(!LEVELS[WL.CELLAR])wlinCellar(0)};KH_LAZY[WL.GRANARY]=()=>{if(!LEVELS[WL.GRANARY])wlinCellar(1)};
function wlinR(name,b){
  const D=WLIN_ROOMS[name]||WLIN_ROOMS.home_warm;
  return {w:D.w,h:D.h,floor:WLIN_LOOK[D.look].floor,amb:Math.min(.9,D.amb+.1),tele:[D.w-2,D.h-2],lights:D.lights||[[2,2],[D.w-3,2],[D.w>>1,D.h>>1]],noExtras:D.noExtras,enemies:D.enemies,items:D.items&&D.items.map(i=>({k:i[0],x:i[1],y:i[2]})),build:C=>wlinBuild(D,name,b,C)};
}
function wlinBuild(D,name,b,C){
  const {raw,npc}=C;
  for(const r of (D.raw||[]))raw(r[0],r[1],r[2],r[3]);
  for(const p of D.props)wlinProp(C,p[0],p[1],p[2],p[3]);
  // the keeper or the person at home
  const kp=D.keeper||D.res;
  if(b.keeper&&kp)npc(b.keeper,kp[0],kp[1]);
  for(const f of (D.folk||[]))npc(f[0],f[1],f[2],f[3]);
  if(D.extra)D.extra(C,b);
}
/* wrap khRoom: a Wenlock room is built from the data above, with its own walls, floor and windows */
{const _kr=khRoom;khRoom=function(b,lvl,back){
  if(!(b&&b.wlin))return _kr.apply(this,arguments);
  const name=b.wlin,D=WLIN_ROOMS[name]||WLIN_ROOMS.home_warm,L=WLIN_LOOK[D.look];
  b.tpl=(bb)=>wlinR(name,bb);b.wallImg=IMG[L.wall]?L.wall:b.wallImg;b.floor=FLOORS[L.floor]?L.floor:(b.floor||'wood');b.scene=undefined;
  if(!D.keeper&&!D.res)b.keeper=null;
  const r=_kr.call(this,b,lvl,back);
  try{wlinPost(r.level,D,L,b,lvl)}catch(e){console.error('wlinPost',e)}
  r.level.wlin=name;return r}}
function wlinPost(level,D,L,b,lvl){
  const W=level.rows[0].length,H=level.rows.length,rows=level.rows.map(r=>r.split(''));
  level.chars=Object.assign({},level.chars||{});
  const gid=wlinWinGid(L.win);
  if(gid!==null&&gid!==undefined){const ch='Ω';level.chars[ch]=gid;
    for(const [x,y] of (D.win||[])){if(y<0||y>=H||x<0||x>=W)continue;if(rows[y][x]==='w')rows[y][x]=ch}}
  // an extra door in a wall: the inn's cellar door, the cellar's tunnel to the granary and back
  const door=(x,y,to,at,ch)=>{const g=KH_NEXT_GID++;T_TILE[g]=wlinDoorTex();KH_DOOR[g]={lvl:to,at};level.chars[ch]=g;rows[y][x]=ch};
  if(D===WLIN_ROOMS.inn)door(0,5,WL.CELLAR,{x:13,y:5,f:3},'Ψ');
  if(D===WLIN_ROOMS.cellar)door(14,5,WL.GRANARY,{x:1,y:5,f:1},'Ψ');
  if(D===WLIN_ROOMS.granary)door(0,5,WL.CELLAR,{x:13,y:5,f:3},'Ψ');
  level.rows=rows.map(r=>r.join(''));
}
