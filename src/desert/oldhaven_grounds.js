/* ==========================================================================
   OLDHAVEN: THE CASTLE GROUNDS. The ward of the castle has a winding path round the keep and its two long halls (the lanes at the north, west and east that nothing used
   to stand in). Now:
   - two small quests: Pip the page lost the steward's signet ring on the north path, and Hob the chandler needs four candle-ends from the ground round the keep;
   - Tam, an old gate-guard, who talks about the loose stones in the halls (a hint, no quest);
   - a few things to pick up lying on the path: two healing potions, two herbs;
   - three secret doors (the same loose-stone door as the mazes, secret_rooms.js, planned by hand here because the city is an open level): one in the west hall, one in
     the east hall, one in the west face of the keep. Each hides a small chamber with a chest (potions, a little gold and one surprise item).
   The people and things are put in by ohBuild (OH_GROUNDFOLK, OH_GROUNDITEMS, OH_GROUNDSECRET); the doors are SR_ROOMS[305], which srApply already handles.
   ========================================================================== */
ITEMDEF.ohsignet={n:"Steward's Signet",k:'quest',t:'Quest item',ic:'ring',c:'#d8b040',stack:1,price:1,d:'A heavy silver signet ring, cut with the castle tower. The steward seals the king\'s letters with it.',sw:.1};
ITEMDEF.ohcandle={n:'Candle-end',k:'quest',t:'Quest item',ic:'herb',c:'#e8d8a0',stack:1,price:1,d:'A fat stub of beeswax candle, dropped on the castle paths by a page in a hurry.',sw:.1};
const OG_FOLK=[
 {id:'og_pip',n:'Pip, a page of the castle',face:'kh_ohfolk1_5',at:[52,16]},
 {id:'og_hob',n:'Hob, the castle chandler',face:'kh_ohfolk3_3',at:[96,16]},
 {id:'og_tam',n:'Tam, an old gate-guard',face:'kh_ohfolk7_4',at:[62,9]}
];
const OH_GROUNDFOLK=OG_FOLK.map(f=>[f.id,f.at[0],f.at[1]]);
/* the north path is the lane at y 8 (west of the keep from x 51 to 62, east of it from 86 to 98); the side lanes are x 51-52 and 96-97, and x 62 and 86 run beside the keep */
const OH_GROUNDITEMS=[
  ['ohsignet',60,8],
  ['ohcandle',55,17],['ohcandle',62,15],['ohcandle',86,15],['ohcandle',93,8],
  ['potion',51,10],['potion',97,10],['herb',57,8],['herb',90,17]];
/* hidden chambers: door (a wall square of a hall or the keep), from (the lane square in front of it), cells (inside the solid block), chest (the far corner), lamp */
const OH_GROUNDSECRET=[
  {id:'oh_w',door:[53,12],from:[52,12],cells:[[54,11],[55,11],[56,11],[54,12],[55,12],[56,12]],chest:[56,12],lamp:[55,11],w:2,d:3},
  {id:'oh_e',door:[95,12],from:[96,12],cells:[[94,11],[93,11],[92,11],[94,12],[93,12],[92,12]],chest:[92,12],lamp:[93,11],w:2,d:3},
  {id:'oh_k',door:[63,13],from:[62,13],cells:[[64,12],[65,12],[66,12],[64,13],[65,13],[66,13]],chest:[66,12],lamp:[65,13],w:2,d:3}];
SR_ROOMS[305]=OH_GROUNDSECRET.map((s,j)=>Object.assign({sr:1,lv:305,j,mon:null,free:s.cells.filter(c=>!(c[0]===s.chest[0]&&c[1]===s.chest[1])&&!(c[0]===s.door[0]+(s.door[0]-s.from[0])&&c[1]===s.door[1]+(s.door[1]-s.from[1])))},s));
const ogq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Oldhaven'};
ogq('og1',"The Steward's Signet",'Pip, a page of the castle','Pip lost the steward\'s silver signet ring while running a letter along the north path round the keep. Find it on the ground and bring it back to Pip, before the steward finds out.',1,()=>Math.min(1,bagCount('ohsignet')),{gold:700,xp:6000,items:['potion4']},{take:{ohsignet:1}});
ogq('og2','Candle-ends for the Keep','Hob, the castle chandler','Hob makes the candles for the castle, and a page has been dropping them along the paths round the keep. Pick up 4 candle-ends from the ground and bring them to Hob.',4,()=>Math.min(4,bagCount('ohcandle')),{gold:600,xp:5500},{take:{ohcandle:4}});
const OGD={
 og1:khQD('Oh, please! The steward\'s signet ring. I had it in my hand on the north path, the one round the keep, and then a goose came and now it is gone. If he finds out, I am cleaning the moat. Will you look for it? It is silver, with a little tower on it.','Thank you, thank you. Try the lane along the north wall.',(g,n)=>`The ring is somewhere on the paths round the keep. You have ${g} of ${n}.`,'My ring! My neck! I mean, the steward\'s ring! Thank you.','The goose is in the moat now. Here, this is all I have, from the steward\'s own purse. He will not miss it.','The steward has not noticed. Thank you.','Here is the ring.'),
 og2:khQD('The candles for the keep are mine, and every dawn I find them on the paths, dropped by the pages who carry them. A candle-end is a candle I cannot count. Four of them, if you would. They lie on the ground along the lanes round the keep.','Four candle-ends. Look along the lanes, and in the corners.',(g,n)=>`Four candle-ends, and you have ${g}.`,'Four ends. I will melt them into one proper candle. Thank you.','Four candle-ends. Take this for the trouble.','The keep has light again.','Here are four candle-ends.')};
const ogNpc=(id,fn,q)=>{const f=OG_FOLK.find(x=>x.id===id);khNpc(f.id,f.n,f.face,fn,q?{q}:undefined)};
ogNpc('og_pip',()=>qSt('og1')==='done'?say('The steward has not noticed. I am going to be very good from now on, for at least a week.',[BYE]):qNode('og1',OGD.og1),'og1');
ogNpc('og_hob',()=>qSt('og2')==='done'?say('The paths are clear and the candles are counted. I could sing.',[BYE]):qNode('og2',OGD.og2),'og2');
ogNpc('og_tam',()=>say(qSt('og1')==='active'?'A ring? Pip has lost a ring? Try the north lane, lad. And mind the geese.':'Thirty years on the gate, and I will tell you a thing the young ones do not know. The two long halls and the keep have loose stones in them, on the lane side. Walk up to one and push. Some old guards put their savings behind them.',[BYE]));
/* the open city keeps a blocked-square map for its terrain (TERR_BLOCK): the hidden chambers and their opened doors must be free squares in it as well as in the grid */
{const _dw=drawWorld;drawWorld=function(){
  try{if(LEVEL===305&&typeof TERR_BLOCK!=='undefined'&&TERR_BLOCK&&G.grid){const F=(G.flags.ep_sec||{});
    for(const s of OH_GROUNDSECRET){if(s.bad)continue;for(const [x,y] of s.cells)if(G.grid[y]&&G.grid[y][x]===0)TERR_BLOCK[y*MW+x]=0;if(F[s.id]&&G.grid[s.door[1]][s.door[0]]===0)TERR_BLOCK[s.door[1]*MW+s.door[0]]=0}}}catch(e){console.error('oggr',e)}
  return _dw.apply(this,arguments)}}
