/* ==========================================================================
   HOUSING: THE DATA (prefix HS). Real estate agents in the towns sell houses and furniture; the code is in housing.js.
   - HS_SIZES: the three houses (small 20,000, medium 40,000, large mansion 100,000), what they look like outside, how big the chest is.
   - HS_TOWNS: the table of towns. Each row says which sizes the town sells (so towns can differ), where the agent stands, and the plot of each size
     (x0,y0,w,d = the rectangle the house covers; face = the side the door is on; the cell in front of the door must be open street).
   - HS_ROOMS: the inside of each size (size of the room, walls, fixed furniture, and the marker spots: 'd' for a decoration, 't' for a trophy).
   - HS_CATALOGUE: the furniture and decorations on sale at every agent, with their (high) prices.
   - HS_BOSSES and HS_FEATS: every boss that can be defeated and every feat of the game, which become trophies.
   ========================================================================== */
const HS_BASE=3300;          // interior level numbers: HS_BASE + 3 * (town number) + size number (3300 to 3399 are free; 6000 to 6999 belong to Oldhaven, the quay, the Pilgrim's Path and the monastery, and 7100 and up are caves)
const HS_SIZE_IDS=['small','medium','large'];
const HS_SIZES={
  small:{name:'Small House',price:20000,w:3,d:2,wh:2.0,sty:'cottage',roof:'kh_yroof3_1',roofW:.5,cap:40,
    blurb:'One cosy room with a hearth, a bed, a table and a chest. Four places for furniture and two for trophies.',slotsD:4,slotsT:2},
  medium:{name:'Medium House',price:40000,w:4,d:3,wh:2.4,sty:'timber',roof:'kh_ohroof1_2',roofW:.5,cap:80,
    blurb:'Two rooms: a living room with a hearth and a table, and a bedroom. Eight places for furniture and six for trophies.',slotsD:8,slotsT:6},
  large:{name:'Large Mansion',price:100000,w:6,d:4,wh:3.0,sty:'golden',roof:'kh_ohroof1_5',roofW:.8,cap:160,
    blurb:'A great hall, two wings, and a long trophy hall that shows every boss the party has beaten. Fourteen places for furniture.',slotsD:14,slotsT:67}
};
/* The towns. sizes: what the agent sells (a town can sell fewer: Thornwick has only the small house). agent: where he stands, and a free cell for the office board. plots: one per size sold (x0,y0,w,d is the
   rectangle on the ground; 'face' is the side the door is on: S, N, E or W). skin: optional look of the houses in this town (wall style, roof picture). */
const HS_TOWNS=[
  {key:'thornwick',lvl:3,name:'Thornwick',sizes:['small'],face:'kh_ohfolk5_5',
    agent:{x:38,y:17,sign:{x:37,y:17}},
    plots:{small:{x0:40,y0:14,w:3,d:2,face:'S'}}},
  {key:'ironhill',lvl:13,name:'Ironhill',sizes:['small','medium','large'],face:'kh_ohfolk5_5',
    agent:{x:46,y:18,sign:{x:47,y:18}},
    plots:{small:{x0:46,y0:4,w:2,d:3,face:'W'},medium:{x0:41,y0:14,w:3,d:4,face:'W'},large:{x0:40,y0:3,w:4,d:6,face:'E'}}},
  {key:'greendale',lvl:32,name:'Greendale',sizes:['small','medium','large'],face:'kh_ohfolk5_5',
    agent:{x:37,y:9,sign:{x:36,y:9}},
    plots:{small:{x0:39,y0:10,w:2,d:3,face:'W'},medium:{x0:47,y0:10,w:3,d:4,face:'E'},large:{x0:42,y0:7,w:4,d:6,face:'E'}}},
  {key:'anaea',lvl:33,name:'Anaea',sizes:['small','medium','large'],face:'kh_ohfolk5_5',
    agent:{x:46,y:18,sign:{x:47,y:18}},
    plots:{small:{x0:45,y0:15,w:2,d:3,face:'W'},medium:{x0:40,y0:18,w:4,d:3,face:'N'},large:{x0:41,y0:25,w:4,d:6,face:'E'}}},
  {key:'yarrim',lvl:290,name:'Yarrim',sizes:['small','medium','large'],face:'kh_yfolk2_1',sheets:['yfolk2'],
    agent:{x:46,y:54,sign:{x:47,y:54}},
    plots:{small:{x0:32,y0:51,w:3,d:2,face:'S'},medium:{x0:41,y0:50,w:4,d:3,face:'S'},large:{x0:52,y0:49,w:6,d:4,face:'S'}}},
  {key:'oldhaven',lvl:305,name:'Oldhaven',sizes:['small','medium','large'],face:'kh_ohfolk5_5',
    agent:{x:108,y:50,sign:{x:109,y:50}},
    plots:{small:{x0:101,y0:45,w:3,d:2,face:'S'},large:{x0:114,y0:45,w:6,d:4,face:'S'},medium:{x0:121,y0:45,w:4,d:3,face:'S'}}},
  {key:'khemetra',lvl:44,name:'Khemetra',sizes:['small','medium','large'],face:'kh_npc2_2',sheets:['npc2','roof1','roof2','roofup1'],
    agent:{x:195,y:314,sign:{x:196,y:314}},
    skin:{small:{sty:'cream',roof:'kh_roofup1_1',roofW:.3},medium:{sty:'honey',roof:'kh_roof2_2',roofW:.3},large:{sty:'gold',roof:'kh_roof2_0',roofW:.3}},
    plots:{small:{x0:188,y0:310,w:3,d:2,face:'S'},medium:{x0:199,y0:310,w:4,d:3,face:'S'},large:{x0:209,y0:309,w:6,d:4,face:'S'}}},
  {key:'wenlock',lvl:496,name:'Wenlock',sizes:['small','medium','large'],face:'kh_ohfolk5_5',
    agent:{x:82,y:30,sign:{x:81,y:30}},
    plots:{small:{x0:82,y0:18,w:2,d:3,face:'E'},medium:{x0:81,y0:24,w:3,d:4,face:'E'},large:{x0:80,y0:11,w:4,d:6,face:'E'}}}
];
/* the painted pieces: the outside of a town needs the wall, roof and agent sheets (assets/kh, per town more in 'sheets'); the inside of a house needs the furniture sheets and the wl2 pieces of Wenlock */
const HS_SHEETS_TOWN=['ohwall1','ohwall2','ohwall3','ohwall4','ohwall5','ohwall6','ohroof1','yroof3','ohfolk5'];
const HS_SHEETS_HOME=['int2','int3','int4','int5','int6','city1','city2','throne1','oqgarg','maptable1'];
/* ---- the rooms ----
   w,h: the size of the level. look: wall and floor (see HS_LOOK). walls: extra wall rectangles [x0,y0,x1,y1] drawn inside, gaps: cells made open again.
   win: wall cells that have a window. fixed: the things the house always has. slots: [x,y,'d'|'t'] marker spots. lights: [x,y]. door: x of the door in the bottom wall. */
const HS_LOOK={
  timber:{wall:'wl2_wall_0',floor:'wl2f0',ww:2},sage:{wall:'wl2_wall_5',floor:'wl2f2',ww:5},plaster:{wall:'wl2_wall_2',floor:'wl2f5',ww:0}
};
const HS_ROOMS={
  small:{w:11,h:8,look:'timber',door:5,amb:.72,
    walls:[],win:[[3,0],[7,0],[0,3],[10,3]],
    fixed:{hearth:[1,1],table:[5,3],bed:[9,1],chest:[9,5]},tele:[1,6],
    slots:[[1,4,'d'],[9,3,'d'],[3,6,'d'],[7,6,'d'],[4,1,'t'],[6,1,'t']],
    lights:[[3,2],[7,2],[5,5]]},
  medium:{w:17,h:11,look:'sage',door:5,amb:.78,
    walls:[[10,1,10,9]],gaps:[[10,5],[10,6]],win:[[3,0],[7,0],[13,0],[0,4],[16,5]],
    fixed:{hearth:[1,1],table:[5,4],bed:[13,1],chest:[15,9]},tele:[1,9],
    slots:[[1,4,'d'],[1,7,'d'],[9,3,'d'],[9,8,'d'],[3,9,'d'],[7,9,'d'],[11,8,'d'],[15,5,'d'],[3,1,'t'],[5,1,'t'],[7,1,'t'],[9,1,'t'],[11,1,'t'],[15,1,'t']],
    lights:[[3,3],[7,3],[5,7],[13,4],[13,8]]},
  large:{w:37,h:19,look:'plaster',door:18,amb:.78,
    walls:[[1,6,35,6],[12,7,12,17],[24,7,24,17]],gaps:[[17,6],[18,6],[19,6],[12,12],[12,13],[24,12],[24,13]],
    win:[[3,0],[9,0],[15,0],[21,0],[27,0],[33,0],[0,10],[36,10],[5,18],[31,18]],
    fixed:{hearth:[18,7],table:[18,11],bed:[3,8],chest:[10,8]},tele:[35,17],
    slots:[[1,10,'d'],[1,14,'d'],[4,17,'d'],[8,17,'d'],[11,14,'d'],[13,9,'d'],[13,15,'d'],[23,9,'d'],[23,15,'d'],[25,10,'d'],[25,14,'d'],[29,17,'d'],[33,17,'d'],[35,12,'d']],
    lights:[[6,3],[18,3],[30,3],[6,12],[18,14],[30,12]]}
};
/* the trophy hall of the mansion: every cell of the top row and the bottom row of the hall (the openings in the divider stay free) */
(function(){const L=HS_ROOMS.large;for(let x=1;x<=35;x++)L.slots.push([x,1,'t']);for(let x=1;x<=35;x++)if(x<17||x>19)L.slots.push([x,5,'t'])})();
/* ---- the furniture and decorations: id, name, price, picture, height in cells, bob (height off the floor), light (glows) ---- */
const HS_CATALOGUE=[
  ['planter','Window box of flowers',500,'kh_city2_5',.5],
  ['cat','Sleeping cat on a cushion',500,'wl2_home_2',.26],
  ['dog','Sleeping hound',500,'wl2_home_3',.36],
  ['rocker','Rocking chair',600,'wl2_home_4',.7],
  ['palm','Potted palm',800,'kh_city2_3',.9],
  ['ale','Stack of ale barrels',800,'wl2_inn_3',.8],
  ['dresser','Welsh dresser',900,'wl2_home_1',1.05],
  ['rolled','Rolled carpets',900,'kh_int5_4',.8],
  ['herbs','Herb drying rack',1000,'wl2_armour_4',1.1],
  ['lute','Lute on a stool',1100,'wl2_inn_5',.55],
  ['anvil','Smith\'s anvil',1200,'wl2_smith_2',.55],
  ['spinning','Spinning wheel',1300,'wl2_bakery_5',.7],
  ['readdesk','Scholar\'s reading desk',1500,'wl2_library_1',.8],
  ['tailor','Dressmaker\'s dummy',1500,'wl2_bakery_4',1.1],
  ['scrolls','Scroll cabinet',1600,'wl2_library_3',1.0],
  ['bookcase','Library bookcase',1900,'wl2_library_0',1.3],
  ['cauldron','Brewing cauldron',1800,'wl2_armour_3',.8,0,1],
  ['birdcage','Songbird in a cage',1800,'kh_int6_2',.85],
  ['weapons','Weapon rack',2000,'wl2_smith_1',.9],
  ['banner','Heraldic banner',2000,'wl2_hall_0',1.7,.05],
  ['feast','Feast table',2200,'wl2_inn_2',.6],
  ['chest2','Ornate chest',2200,'kh_int2_5',.5],
  ['shields','Board of painted shields',2400,'wl2_armour_1',.7,.3],
  ['candelabra','Silver candelabra',2400,'kh_throne1_3',1.2,0,1],
  ['potions','Potion shelves',2600,'wl2_armour_2',1.25],
  ['clock','Grandfather clock',2800,'wl2_home_5',1.3],
  ['carpet','Woven wall carpet',3000,'kh_int4_3',1.0,.1],
  ['armour','Suit of plate armour',3200,'wl2_armour_0',1.1],
  ['mapdesk','Map table',3400,'kh_maptable1_1',.72],
  ['chandelier','Iron chandelier',3600,'wl2_inn_4',.62,.42,1],
  ['gargoyle','Stone gargoyle',3800,'kh_oqgarg_0',.9],
  ['globe','Armillary sphere',4200,'wl2_library_2',.7],
  ['tapestry','Hunting tapestry',4800,'wl2_hall_1',1.1,.3],
  ['harp','Concert harp',5200,'kh_int5_0',.9],
  ['throne','Carved chair of state',6500,'wl2_hall_3',1.0],
  ['fountain','Indoor fountain',9000,'kh_int2_3',.7],
  ['statue','Marble statue',12000,'kh_city1_3',1.5],
  ['obelisk','Painted stone obelisk',15000,'kh_city1_2',1.8]
].map(a=>({id:a[0],name:a[1],price:a[2],pic:a[3],h:a[4],bob:a[5]||0,glow:!!a[6]}));
/* ---- the bosses, in the order the party meets them: [enemy type, picture file (null: none on disk, a banner is shown instead), optional test of a story flag that also counts]. The name comes from the game's own table of creatures.
   A boss counts as defeated when the game's own kill counter (G.flags.k_<type>) is above zero, so every kill is already recorded. ---- */
const HS_BOSSES=[
  ['boss','assets/boss.png'],['gandrick','assets/gandrick.png'],['mayor','assets/mayor.png'],['halbrecht','assets/mayor.png'],['overseer','assets/skel.png'],['wraith','assets/wraith.png'],
  ['sut','assets/sut.png'],['firelizard','assets/ds_firelizard.png'],['cyclops','assets/ds_cyclops.png'],['pharaohboss','assets/ds_pharaohboss.png'],['cinder',null],
  ['corvane','assets/yar_p_corvane.png'],['chancellor','assets/yar_p_vance.png'],
  ['uweelboss','assets/uw_eel_0.png'],['kraken','assets/uw_kraken_0.png'],['uwgiant',null],['uwmega',null],['uwgulper',null],['w_crowncrab',null],['hgoboss',null],
  ['hlboss0','assets/hl_boss0.png'],['hlboss1','assets/hl_boss1.png'],['hlboss2','assets/hl_boss2.png'],['hlboss3','assets/hl_boss3.png'],
  ['hlt0','assets/hl_phantom.png'],['hlt1','assets/hl_jester.png'],['hlt2','assets/hl_butcher.png'],['hlt3','assets/hl_banshee.png'],['hlt4','assets/hl_vampire.png'],['hlt5','assets/hl_choir.png'],
  ['hollowabbot',null],['weepingbrother',null],
  ['hgboss1','assets/hg_wasp.png'],['hgboss2','assets/hg_golem.png'],['hgboss3','assets/hg_larva.png'],['hgboss4','assets/hg_queen.png'],
  ['hgdwarden','assets/hg_golem.png'],['hgdb_slug','assets/ds_hgtb_pearlslug.png'],['hgdb_jelly','assets/ds_hgtb_creamjelly.png'],['hgdb_worm','assets/ds_hgtb_jadeeel.png'],['hgdb_bug','assets/hg_ins6.png'],
  ['hgdb_spider','assets/ds_hgtb_spindlespider.png'],['hgdb_beetle','assets/ds_hgtb_lanternbeetle.png'],['hgdb_mixed','assets/hg_ins6.png'],['hgfcatfish',null],
  ['bsw','assets/ds_bsw.png',F=>F.bswDead],['gmwarden',null],['wmwarden',null],['wwabom',null],['wwwitch',null,F=>F.wwDead],['gyvane',null],['gygrimsby',null],['gyaldric',null],['gymorwenna',null]
];
/* feats that are not one boss: [id, name, where the flag is, picture shown on the banner] */
const HS_FEATS=[
  ['avenue','Cleansed the Avenue of Vaults',F=>F.gyAvenue],
  ['pilgrim','Completed the Pilgrim\'s Path',F=>F.lpAbbot],
  ['shrines','Keeper of the Old Shrines',F=>F.shrinesDone],
  ['hollowvermin','Scourge of the Hollow',F=>F.hgdVzAlls],
  ['underlevelvermin','Scourge of the Underlevel',F=>F.hgdVzAllu]
];
