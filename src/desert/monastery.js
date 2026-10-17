/* ==========================================================================
   SAINT ELEN'S MONASTERY, halfway along the Pilgrim’s Path. A gate cut into the rock of the pass leads into green grounds: a church, a cloister
   with a fountain, a refectory, a scriptorium, a kitchen, a guest house, an infirmary, herb and flower gardens, an orchard, hives and a bell.
   Friendly monks live there. East of it lies a quiet cemetery with a mausoleum, and below the grounds a cellar and old crypts have a ghost
   problem. Ten quiet quests. Levels: 430 grounds, 431 cemetery, 432 cellars, 433 old crypts, 434 the mausoleum; rooms from 6900.
   ========================================================================== */
const MON={ID:430,CEM:431,CELLAR:432,CRYPT:433,MAUS:434,ROOM0:6900,W:84,H:72,GATE_IN:[42,66],CEM_IN:[4,20]};
ITEMDEF.abbotring={n:"The Abbot's Ring",k:'quest',t:'Quest item',ic:'herb',c:'#e8d070',stack:0,price:0,d:'A plain gold ring, worn thin, with a small cross cut into it. It lay in a chest in the old crypts below Saint Elen’s. It belonged to the abbot who lies there.',sw:.2};
ENEMY_DEF.weepingbrother={name:'The Weeping Brother',hp:700,dmg:[16,26],hit:.8,w:.62,img:'ghost',xp:6000,gold:[300,600],speed:1,verb:'wails at',aboveParty:2,fly:true};
const MONF=()=>{const F=G.flags;return F.mon||(F.mon={met:{},bell:0,rest:0,letter:0})};
const monq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Saint Elen’s Monastery'};
if(QAREA_ORDER.indexOf('Saint Elen’s Monastery')<0)QAREA_ORDER.splice(QAREA_ORDER.indexOf('Elsewhere'),0,'Saint Elen’s Monastery');

/* ---- the buildings of the grounds: x0, y0, x1, y1, height of the walls, style, door column, kind, name, keeper ---- */
const MON_BLD=[
  {rid:MON.ROOM0,   x0:33,y0:8, x1:49,y1:15,wh:3.8,st:'cream',dx:41,room:'prayer',name:'The Church of Saint Elen',keeper:'mon_chaplain',at:{x:7,y:19,f:0},tower:1,church:1},
  {rid:MON.ROOM0+1, x0:8, y0:22,x1:20,y1:29,wh:2.7,st:'golden',dx:14,room:'hall',name:'The Refectory',keeper:'mon_refec',at:{x:5,y:6,f:0}},
  {rid:MON.ROOM0+2, x0:62,y0:22,x1:74,y1:29,wh:2.7,st:'cream',dx:68,room:'home',name:'The Scriptorium',keeper:'mon_scribe',at:{x:5,y:6,f:0},script:1},
  {rid:MON.ROOM0+3, x0:8, y0:40,x1:16,y1:45,wh:2.3,st:'cottage',dx:12,room:'home',scene:'warm',name:'The Kitchen',keeper:'mon_cook',at:{x:4,y:4,f:0}},
  {rid:MON.ROOM0+4, x0:64,y0:38,x1:76,y1:45,wh:2.7,st:'timber',dx:70,room:'inn',name:'The Guest House',keeper:'mon_guest',at:{x:6,y:7,f:0}},
  {rid:MON.ROOM0+5, x0:24,y0:42,x1:31,y1:47,wh:2.3,st:'cottage',dx:27,room:'home',scene:'healer',name:'The Infirmary',keeper:'mon_infirm',at:{x:4,y:4,f:0}},
  {rid:MON.ROOM0+6, x0:54,y0:6,x1:66,y1:13,wh:4.6,st:'cream',dx:60,room:'prayer',name:'The Chapel of the Lamps',keeper:'mon_sister',at:{x:5,y:13,f:0},chapel:1}
];
MON_BLD.forEach(b=>LEVEL_NAMES[b.rid]=b.name);
LEVEL_NAMES[MON.ID]='Saint Elen’s Monastery';LEVEL_NAMES[MON.CEM]='The Quiet Cemetery';LEVEL_NAMES[MON.CELLAR]='The Monastery Cellars';LEVEL_NAMES[MON.CRYPT]='The Old Crypts';LEVEL_NAMES[MON.MAUS]='The Mausoleum';
/* ---- the monks ---- */
const monLines=(id,n,face,lines,quest)=>khNpc(id,n,face,()=>{const M=MONF();M.met[id]=1;return yrLines(id,lines)},quest?{q:quest}:undefined);
monLines('mon_chaplain','Brother Cyprian, the chaplain','kh_ohfolk1_4',["The church is open all day. Sit anywhere. The light is best at about four.","We sing at dawn and at dusk. You are welcome to sing, or to listen, or to sleep in the back pew. All three have been done.","Saint Elen walked here with a goat and a lamp and decided it was far enough."]);
monLines('mon_sister','Sister Agnes, keeper of the lamps','kh_ohfolk2_3',["Every lamp in the chapel is lit by hand, at dusk, by me. It takes an hour. It is the best hour of my day.","The glass was brought from the coast in straw, piece by piece. Not one pane cracked. We say that is the saint's doing.","Sit in any pew. Look up. Most people forget to look up.","The angel at the back was gilded by a pilgrim who wished to pay for a bed and had no coin. We gave her the bed anyway."]);
monLines('mon_refec','Brother Maurus, the refectorian','kh_ohfolk2_2',["Soup at noon and at dusk. There is always enough. The brothers say I over-cook, but nobody has ever left hungry.","Sit anywhere. Nobody counts the bowls.","We eat in silence, mostly, and then there is a long minute of gratitude at the end, which is my favourite part."]);
monLines('mon_infirm','Brother Osmund, the infirmarian','kh_ohfolk2_1',["Nobody is ill at the moment. It is a good day for an infirmarian, and a dull one.","The remedy for most things is rest and a clean room. The rest is herbs, which Brother Herbert grows.","If your feet hurt, sit. The pilgrims always have sore feet."]);
monLines('mon_guest_p1','A pilgrim','kh_ohfolk5_3',["I have been here three nights. I said I would stay one.","They do not ask you to leave. That is the whole of their hospitality, and it is a great deal."]);
monLines('mon_guest_p2','A traveller','kh_ohfolk6_3',["The soup is very good. I believe it is simply onions.","I have not spoken to anyone for two days. This is the first. It was a pleasant conversation."]);
// the guest house is the one the player rests in
khNpc('mon_guest','Brother Hilarion, the guest-master','kh_ohfolk2_1',()=>{
  const M=MONF();M.met.mon_guest=1;
  const opts=[['Take a quiet hour here, by the fire. (free)',()=>{try{restParty(true)}catch(e){}M.rest=1;msg('You rest by the fire. The monastery bell rings the hour, very quietly.','#a8e8c0');return say('There. Sleep is the best of all the sacraments. Come back whenever you like. The beds are never full.',[BYE])}]];
  if(qSt('mq10')!=='done')opts.push(['About a quiet hour',()=>qNode('mq10',MOND.mq10)]);
  return say('Welcome, welcome. The guest house is always open. There is a bed, a bowl of soup and a fire, and nobody will ask you to pay or to pray. Rest, if you like.',[...opts,BYE]);
},{q:'mq10'});
