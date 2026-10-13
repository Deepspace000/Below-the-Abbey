/* ==========================================================================
   OLDHAVEN, the city of King Osric. Reached from the quay (304) through a gate that opens at noon.
     305 Oldhaven (the city)   306 The Court of King Osric   307 The King's Rest (inn)   308 Oldhaven Arms (smith)
     309 The Apothecary   310 The Chapel of Saint Brannoch
   The end of this part of the story is in the court: the master ledger is read, the chancellor turns on the king, and the warrant is torn up.
   ========================================================================== */
for(const n of ['osric','vance','aldwyn','rguard'])loadImg('yar_p_'+n,'assets/yar_p_'+n+'.png');
Object.assign(NPC_H,{yar_p_osric:1,yar_p_vance:1,yar_p_aldwyn:1,yar_p_rguard:1});
Object.assign(ENEMY_DEF,{
  chancellor:{name:'Chancellor Vance',hp:300,dmg:[11,17],hit:.82,w:.6,img:'yar_p_vance',xp:1600,gold:[400,700],speed:1,verb:'strikes',aboveParty:3},
  rguard:{name:'Royal Guard',hp:120,dmg:[9,14],hit:.78,w:.55,img:'yar_p_rguard',xp:300,gold:[40,90],speed:1,verb:'cuts',aboveParty:1}
});
const OH={W:90,H:70,ID:305,COURT:306,ROOM:307};
vq('vq6','The Court of King Osric','King Osric','At noon the party is brought before King Osric with the master ledger. Make him read it.',1,khFlag('pardoned'),{gold:6000,xp:25000,items:['potion4']});
const OH_HOUSES=[
  {b:[20,36,30,44],p:3,d:[25,36],f:[25,35,0],room:'inn',name:'The King\'s Rest',keeper:'oh_inn'},
  {b:[58,36,68,44],p:4,d:[63,36],f:[63,35,0],room:'shop',name:'Oldhaven Arms',keeper:'oh_smith'},
  {b:[20,48,28,56],p:5,d:[24,48],f:[24,47,0],room:'shop',name:'The Apothecary',keeper:'oh_apoth'},
  {b:[60,48,70,56],p:6,d:[65,48],f:[65,47,0],room:'prayer',name:'The Chapel of Saint Brannoch',keeper:'oh_priest'}
];
const OH_PLAIN=[[12,22,24,30],[28,22,40,30],[50,22,62,30],[66,22,78,30],[12,48,17,56],[32,48,40,58],[48,48,56,58],[74,40,80,50]];
function ohBuild(){
  if(LEVELS[OH.ID])return;
  const W=OH.W,H=OH.H,N=W*H;
  const rows=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push((x===0||y===0||x===W-1||y===H-1)?'D':'.');rows.push(r)}
  const h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N),fm=new Array(N).fill('0');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;h[i]=.45+.05*tsmooth(x/7,y/7,81);fm[i]='0'}
  const wall=(x0,y0,x1,y1,ch)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){rows[y][x]=ch;block[y*W+x]=1}};
  wall(4,4,85,5,'C');wall(4,64,85,65,'C');wall(4,4,5,65,'C');wall(84,4,85,65,'C'); // the city wall
  const street=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(!block[y*W+x])fm[y*W+x]='1'};
  street(43,17,47,63);street(10,32,80,34);street(10,46,80,48);street(34,22,36,31);
  for(const q of OH_HOUSES){for(let y=q.b[1];y<=q.b[3];y++)for(let x=q.b[0];x<=q.b[2];x++){rows[y][x]=['a','b','c'][(x+y*2)%3];block[y*W+x]=1}rows[q.d[1]][q.d[0]]=String(q.p)}
  for(const b of OH_PLAIN)for(let y=b[1];y<=b[3];y++)for(let x=b[0];x<=b[2];x++){rows[y][x]=['a','b','c'][(x*2+y)%3];block[y*W+x]=1}
  wall(30,6,60,16,'C'); // the palace, with its gate in the south face
  rows[16][45]='1';
  rows[65][45]='2';block[65*W+45]=1;rows[64][45]='.';block[64*W+45]=0;rows[64][44]='.';block[64*W+44]=0;rows[64][46]='.';block[64*W+46]=0;
  for(let x=43;x<=47;x++){rows[64][x]='.';block[64*W+x]=0;rows[65][x]=x===45?'2':'C'}
  const decor=[],scenery=[],used=new Set();
  const put=(k,x,y,o)=>{if(x<2||y<2||x>=W-2||y>=H-2||rows[y][x]!=='.'||block[y*W+x]||used.has(x+','+y))return false;decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}));used.add(x+','+y);return true};
  put('fountain',45,40);put('well',38,40);put('well',52,40);
  for(const [k,x,y] of [['cart',31,38],['barrel',32,38],['crate',33,38],['crate',55,38],['barrel',56,38],['cart',57,38],['barrel',31,43],['crate',57,43]])put(k,x,y);
  for(let x=14;x<=78;x+=8){put('lamp',x,31);put('lamp',x+3,49)}
  for(const [id,face,x,y] of [['oh_cap','yar_p_aldwyn',45,19],['oh_guardA','yar_p_rguard',43,18],['oh_guardB','yar_p_rguard',47,18],['oh_g1','guard',45,61],['oh_g2','guard',43,61],['oh_m1','merchant',40,38],['oh_m2','baker',50,38],['oh_w1','peasantW',36,42],['oh_w2','peasantM',54,42],['oh_k1','child',46,44],['oh_o1','oldman',40,44],['oh_s1','scribe',48,36],['oh_pr','priest',44,50]])put(face,x,y,{block:true,deco:false,npc:id,sc:1});
  for(const [id,face,x,y] of [['oh_shop1','smith',22,34],['oh_shop2','merchant',66,34]])put(face,x,y,{block:true,deco:false,npc:id,sc:1});
  const lv={rows:rows.map(r=>r.join('')),start:{x:45,y:62,f:0},enemies:[],items:[{k:'potion',x:44,y:44},{k:'potion',x:48,y:36}],decor,scenery,
    fmap:null,floorSet:['cobble','cobble','wood','bluesand','bluewater','pebA'],floor:'cobble',ceil:'cloud',day:.98,outdoor:true,amb:.9,name:'Oldhaven',label:'Oldhaven',noExtras:true,diff:25,tele:{x:45,y:60},
    chars:{D:LEVEL41_DATA.chars.D,C:LEVEL41_DATA.chars.C},lights:[],portals:[]};
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}lv.fmap=fmap;
  lv.portals[1]={to:OH.COURT,x:15,y:21,f:0,tex:'tgate',req:'courtOpen',lock:'The great gate of the palace is shut. The gate-captain, Aldwyn, can tell you when the court sits.'};
  lv.portals[2]={to:304,x:0,y:0,f:2,tex:'tgate'};
  const START={inn:[6,7],hall:[5,6],shop:[5,6],prayer:[4,6],home:[4,4]};
  for(const q of OH_HOUSES){
    const id=OH.ROOM+q.p-3,st=START[q.room];
    lv.portals[q.p]={to:id,x:st[0],y:st[1],f:0,tex:q.room==='inn'?'inn':q.room==='prayer'?'hall':'shop'};
    KH_LAZY[id]=()=>{if(LEVELS[id])return;const L=khRoom({id:'oh'+q.p,name:q.name,room:q.room,keeper:q.keeper},id,{to:OH.ID,x:q.f[0],y:q.f[1],f:q.f[2]}).level;LEVELS[id]=L;LEVEL_NAMES[id]=q.name};
  }
  LEVELS[OH.ID]=lv;LEVEL_NAMES[OH.ID]='Oldhaven';TERRS[OH.ID]=yarTerrain(W,H,h,rk,block);
  const q4=LEVELS[304];if(q4)lv.portals[2].x=q4.start.x,lv.portals[2].y=q4.start.y;
}
KH_LAZY[OH.ID]=()=>{seaBuild(304);ohBuild()};LEVEL_NAMES[OH.ID]='Oldhaven';
for(const q of OH_HOUSES){const id=OH.ROOM+q.p-3,stub=()=>{seaBuild(304);ohBuild();if(!LEVELS[id]&&KH_LAZY[id]!==stub)KH_LAZY[id]()};KH_LAZY[id]=stub;LEVEL_NAMES[id]=q.name}
/* ---- the court ---- */
function ohBuildCourt(){
  const W=31,H=24,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('w'));
  for(let y=1;y<=21;y++)for(let x=1;x<=29;x++)g[y][x]='.';
  g[H-1][15]='0';g[22][15]='.';
  const rows=g.map(r=>r.join(''));
  const decor=[],put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const npc=(id,k,x,y,o)=>decor.push(Object.assign({k,x,y,block:true,npc:id,sc:1},o||{}));
  put('throne',15,2);put('banner',11,2);put('banner',19,2);put('banner',6,2);put('banner',24,2);
  for(const x of [5,10,20,25])put('statue',x,6);
  for(const [x,y] of [[8,9],[22,9],[8,14],[22,14]])put('brazier',x,y);
  for(const x of [3,27])for(const y of [10,16])put('candle',x,y);
  npc('oh_king','yar_p_osric',15,4);npc('oh_vance','yar_p_vance',19,5);npc('oh_halb','mayor',11,5);
  return {rows,start:{x:15,y:21,f:0},decor,lights:[[8,4],[15,5],[22,4],[8,10],[22,10],[8,16],[22,16],[15,18]]};
}
KH_LAZY[OH.COURT]=()=>{
  if(LEVELS[OH.COURT])return;const c=ohBuildCourt();
  LEVELS[OH.COURT]={rows:c.rows,start:c.start,enemies:[],items:[],decor:c.decor,day:0,amb:.75,floor:'kh2',ceil:'beam',name:'The Court of King Osric',label:'Royal Court',lights:c.lights,
    portals:[{to:OH.ID,x:45,y:18,f:2,tex:'tgate'}],diff:25,noExtras:true};
  LEVEL_NAMES[OH.COURT]='The Court of King Osric';
};
LEVEL_NAMES[OH.COURT]='The Court of King Osric';
/* ---- people ---- */
khNpc('oh_cap','Captain Aldwyn, of the Gate','yar_p_aldwyn',()=>{
  const F=G.flags;
  if(F.pardoned)return say('The warrant is void, and I am glad of it. I have never liked being told to chase honest people. The court is open to you.',[BYE]);
  if(F.courtOpen)return say('The court is sitting. Go in. Say your piece, and let the king read what you carry.',[BYE]);
  if(qSt('vq4')!=='done')return say('The court sits at noon, and not for armed strangers with a price on their heads. If you carry something the king should read, go and get it first.',[BYE]);
  return say('The court sits at noon. Armed parties are not admitted. But I hear there is a ledger, and a scribe called Isolde. Is it true you have it?',[['We have the master ledger, whole, in Isolde\'s hand.',()=>{F.courtOpen=1;return say('Then the king will want to see it, whatever Chancellor Vance says. Go in. The doors are open. I have not seen you, and I never saw you on the quay, and I will stand outside the door with my halberd and listen.',[BYE])}],['Not yet.',()=>null]])
},{q:'vq6'});
khNpc('oh_guardA','A royal guard','yar_p_rguard',()=>say('Eyes front. The gate-captain talks to petitioners. I just keep the door.',[BYE]));
khNpc('oh_guardB','A royal guard','yar_p_rguard',()=>say('If you are the four from the quay, keep your hands where I can see them. I am told to be polite. I do not always do what I am told.',[BYE]));
khNpc('oh_g1','A gate guard','guard',()=>say('Oldhaven. Walk, do not run, and do not draw anything in the street.',[BYE]));
khNpc('oh_g2','A gate guard','guard',()=>say('Twenty thousand crowns a head. I could have a very nice house. I could. Please do not make this difficult.',[BYE]));
khNpc('oh_m1','A merchant','merchant',()=>say(G.flags.pardoned?'Is it true? The king tore up the warrant in open court? Then the world is round after all. I have been selling lamp oil to the watch for years, and I never liked their faces.':'The whole city is talking about four strangers. A ransom! I would not mind five minutes in a back room with them. For the reward, you understand.',[BYE]));
khNpc('oh_m2','A baker','baker',()=>say('Fresh rolls. Not for sale to anyone on the king\'s list. Which is everyone this week, apparently.',[BYE]));
khNpc('oh_w1','A washerwoman','peasantW',()=>say('The chancellor has been buying silence in this city for years. Everyone knows. Nobody says. Here, in the lane, anyone can say anything, because it is all very quiet.',[BYE]));
khNpc('oh_w2','A porter','peasantM',()=>say('The king is old, and the chancellor is clever. That is all you need to know about Oldhaven.',[BYE]));
khNpc('oh_k1','A child','child',()=>say('Is it true that the Dawn Walker has a gull figurehead? My brother says it has a lady. I say it is a gull.',[BYE]));
khNpc('oh_o1','An old soldier','oldman',()=>say('Osric was a good king, once. The old kind, who knew the names of his captains. Then he grew tired, and let the clever ones sign for him.',[BYE]));
khNpc('oh_s1','A city scribe','scribe',()=>say('I keep the court roll. Today the chancellor ordered the roll closed to the public. I have never heard that order before. I find it interesting.',[BYE]));
khNpc('oh_pr','A priest','priest',()=>say('Oldhaven has a chapel for every kind of sinner. Mine is for the tired ones.',[BYE]));
khShop('oh_shop1','Bram, the smith','smith',"Oldhaven Arms",'Steel, oil and a hot fire. Whatever the court says about you, steel does not ask.','arms');
khShop('oh_shop2','Hester, the grocer','merchant','The King\'s Larder','Bread, cheese and travelling food. The king\'s crest on the barrel makes it taste better.','food');
khInn('oh_inn','Wynn, innkeeper of the King\'s Rest','innkeeper','The King\'s Rest',30,'The King\'s Rest. Clean beds, hot water, a fire, and no questions. A room is 30 gold, and the soup is free.');
khShop('oh_smith','Bram, at the Oldhaven Arms','smith','Oldhaven Arms','Swords, axes and plate. All of it made in the shop behind me.','arms');
khShop('oh_apoth','Maud, the apothecary','merchant','The Apothecary','Draughts for the body and tinctures for the mind. Tell me what ails you.','potion');
khNpc('oh_priest','Sister Margery, of the Chapel','priest',()=>say('Saint Brannoch watched over travellers. I watch over the ones who return. Would you like a blessing before you go to the court?',[['Ask for a blessing.',()=>{try{afflCure('cursed',-1,true)}catch(e){}msg('A calm settles on the party.','#a8d8ff');return say('Go with grace.',[BYE])}],BYE]));
khNpc('oh_king','King Osric','yar_p_osric',()=>say(G.flags.pardoned?'You have done me and my kingdom a greater service than any lord of mine. Ask what you will. The road is long, and there is more unwritten in that ledger than a single reading can hold.':'Speak, since you came such a long way.',[BYE]));
khNpc('oh_vance','Chancellor Vance','yar_p_vance',()=>say('Majesty, they are lying, as every forger does.',[BYE]));
khNpc('oh_halb','Mayor Halbrecht','mayor',()=>say(G.flags.pardoned?'The king has taken me for a liar. A pity. I was so good at it.':'The ledger is a forgery, your majesty! Do not listen!',[BYE]));
/* ---- the noon gate on the quay, the court, and the end ---- */
function ohWaitNoon(){const m=G.clock%1440;if(m<720)G.clock+=720-m;G.flags.oldhavenOpen=1;msg('Noon bells ring over Oldhaven. The gate on the quay swings open.','#ffe36a');sfx('level')}
(function(){
  const n=NPCS.oh_herald;if(!n||n._wn)return;n._wn=1;
  n.root=()=>{
    const F=G.flags;
    if(F.oldhavenOpen||F.pardoned)return say('The gate stands open. Walk, do not run.',[BYE]);
    return say('The king\'s court meets at noon. The gate is barred until the bells ring. Wait on the quay and do not touch your swords.',[['Wait for noon.',()=>{ohWaitNoon();return say('You wait on the stones while the harbour goes about its business around you. Then the noon bells ring, and the gate groans open.',[BYE])}],['Not yet.',()=>null]]);
  };
})();
Object.assign(CUTS,{
 oldhavenCourt:()=>[
  {text:'The great doors of the Court of Oldhaven open on a long hall of pale stone and blue banners. King Osric sits on a plain silver throne, older than the portraits of him. Chancellor Vance stands at his right hand, smiling, with a scroll in his ink-stained fingers. Mayor Halbrecht of Ironhill waits in chains by the dais.'},
  {who:'King Osric',text:'So these are the four forgers. You came a very long way to be hanged.'},
  {who:hn(0),text:'We came to be heard, majesty. We carry the master ledger, in the hand of your own scribe, Isolde.'},
  {who:'Chancellor Vance',text:'The scribe Isolde is a thief and a liar, your majesty. Whatever these people carry, it was written in a garret by a woman who fled the court with the king\'s silver.'},
  {who:hn(1),text:'She fled because the man who ordered the tolls was your Warden, Lord Corvane. The tolls, the warrant, the knives sent across the sea. Read the last page, majesty. It names who he paid.'},
  {who:'King Osric',text:'Corvane is dead?'},
  {who:hn(2),text:'He died on an island at the end of the Vaast Sea, with a sword in his hand, and the third page of the ledger in an altar at his back.'},
  {text:'The king takes the ledger. The court is silent as he turns the pages. His hands are steady until the last one.'},
  {who:'King Osric',text:'Every toll. Every year. And on the last page, in Corvane\'s own hand, a name that is not mine. Vance. My chancellor.'},
  {who:'Chancellor Vance',text:'Your majesty, a forger\'s fancy! Guards! These people have come to murder the king! Seize them!'},
  {text:'Silver armour rings on stone. The guards at the doors draw their swords, and Vance throws off his chain of office. In his chains, Halbrecht begins to laugh.'},
  {who:'King Osric',text:'Guards of the Crown, to me! Those who stand with Vance, die with him!'}
 ],
 oldhavenPardon:()=>[
  {text:'Vance falls on the steps of the dais, and the hall goes quiet. The guards who stood with him lower their swords one by one.'},
  {who:'King Osric',text:'I have kept faith with the wrong men for twenty years. And four people I called forgers have kept it for me.'},
  {who:'King Osric',text:'By my seal and my crown, the warrant against you is void, and the ransom on your heads is lifted. Let it be read in every town from Oldhaven to Thornwick. And let Mayor Halbrecht of Ironhill see the inside of the gaol he built for honest people.'},
  {who:'Mayor Halbrecht',text:'Majesty, I only did what I was told!'},
  {who:'King Osric',text:'Yes. That is what is wrong with you.'},
  {who:hn(0),text:'We ask nothing, majesty, except to walk our own road without a price on it.'},
  {who:'King Osric',text:'Then it is yours, and the gates of Oldhaven with it. But the road is long, and there is more written in that ledger than one reading can hold. Corvane was not the only man who wrote letters.'},
  {text:'On the table behind the king, Ishkander\'s letter lies open, the seal still unbroken. The road home is clear. The road onward is not.'}
 ]
});
function ohCourtFight(){
  const F=G.flags;F.courtFight=1;
  const v=G.decor.find(d=>d.npc==='oh_vance');if(v)v.hidden=true;
  seaSpawn('chancellor',3,true);for(let i=0;i<4;i++)seaSpawn('rguard',5,true);
  msg('Chancellor Vance draws a sword from under his robe.','#ff8a7a');
}
function oldhavenPardon(){
  const F=G.flags;if(F.pardoned)return;F.pardoned=1;F.wanted=0;
  for(const e of G.enemies)if(e.t==='rguard'&&e.hp>0){e.hp=0;e.dying=.55}
  const hb=G.decor.find(d=>d.npc==='oh_halb');if(hb)hb.hidden=true;
  startCut('oldhavenPardon',()=>{if(qSt('vq6')===null)qAccept('vq6');if(qReady('vq6'))qTurnIn('vq6');msg('The warrant is void. The ransom is lifted.','#ffe36a');sfx('win')});
}
function ohEnter(n){
  const F=G.flags;
  if(n===OH.COURT){
    const k=G.decor.find(d=>d.npc==='oh_halb');if(k&&F.pardoned)k.hidden=true;const v=G.decor.find(d=>d.npc==='oh_vance');if(v&&(F.courtFight))v.hidden=true;
    if(!F.courtSeen){F.courtSeen=1;if(qSt('vq6')===null)qAccept('vq6');startCut('oldhavenCourt',ohCourtFight)}
  }
}
