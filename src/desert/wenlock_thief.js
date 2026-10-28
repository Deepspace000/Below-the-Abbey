/* ==========================================================================
   WENLOCK: THE SHADY QUESTS (prefix wlt / WLT, quests wlq60 to wlq63). Four small crimes for four back-alley clients, each in a named house that only opens after dark (20:00 to 05:00):
   wlq60  Gaffer Nettle, a fence by the old bridge: take the silver candlesticks from Church View (number 5 Church Lane).
   wlq61  Barnaby Pike, a gambler behind the inn: swap loaded dice into the dice cup at Bluebell Cottage (number 6 Green Lane).
   wlq62  Crispin Vane, a rival's agent in the east of town: copy a page of the order book at Weaver's Cottage (number 14 High Street).
   wlq63  Old Ned Gudgeon, a poacher by the witch's wood gate: find the loose floorboard at The Willows (number 5 Mill Lane) and take back his wife's locket.
   By day the doors stay shut or the householder sends the party off (see wltDoor). Inside, every house has the thing the quest asks for, a purse that can be stolen for gold (any time), and a front window to peek through
   (it says where the watchmen are). Taking, copying or swapping something while a watchman can see the square outside the door (wenlock_watch.js, wlzWatching) is a theft seen: the party is arrested.
   Leaving with stolen goods in a watchman's sight is the same. A watchman who sees the party go in after a warning stands at the door for two and a half minutes. After an arrest the stolen things are taken (wltConfiscate)
   and put back where they were, so each quest can still be finished; the gambler hands out a new pair of dice.
   Flags (G.flags): wlt1_in wlt1_got, wlt2_in wlt2_plant, wlt3_in wlt3_got, wlt4_in wlt4_found wlt4_got (n_in: went in after dark with the quest; _got: the thing is in the bag), wltv1..4 (purse taken), wltHot (this visit's loot).
   ========================================================================== */
ITEMDEF.wlt_candle={n:'Silver Candlesticks',k:'quest',t:'Stolen goods',ic:'lantern',c:'#d8d8e8',stack:1,price:1,d:'A pair of tall silver candlesticks, taken from the mantel at Church View. They are heavy, and Mr Hatchley would very much like them back.',sw:.2};
ITEMDEF.wlt_dice={n:'Loaded Dice',k:'quest',t:'Quest item',ic:'bones',c:'#d8d0c0',stack:1,price:1,d:'A pair of grey bone dice with a little chip out of one corner. They are loaded, and only ever show six. Barnaby Pike wants them put in the dice cup at Bluebell Cottage.',sw:.1};
ITEMDEF.wlt_copy={n:'Copied Order Page',k:'quest',t:'Stolen goods',ic:'scroll',c:'#e8e0c0',stack:1,price:1,d:'One page of figures copied out by candlelight from the order book of Mistress Fenwick, the weaver: who buys her cloth, how much, and at what price.',sw:.1};
ITEMDEF.wlt_locket={n:"Old Ned's Locket",k:'quest',t:'Quest item',ic:'amulet',c:'#d8d8e0',stack:1,price:1,d:'A small silver locket with a curl of grey hair inside. It was the wife of Old Ned Gudgeon, and he wants it back.',sw:.1};
const WLT_CONTRA=['wlt_candle','wlt_dice','wlt_copy','wlt_locket'];
const wltF=()=>G.flags;
/* ---- the four houses: found by their lot, named (the street name boards are made by wenlock_names.js, which skips a house that already has a name), numbered as its door plate will be ---- */
const WLT=[];
{const defs=[{n:1,side:'CW',pos:37,name:'Church View'},{n:2,side:'GE',pos:32,name:'Bluebell Cottage'},{n:3,side:'S',pos:74,name:"Weaver's Cottage"},{n:4,side:'MW',pos:63,name:'The Willows'}];
 for(const d of defs){
   const i=WL_LOTS.findIndex(l=>l[0]===d.side&&l[1]===d.pos),h=WL_HOUSES[i];
   h.hname=d.name;const k=WLN_NAMES.findIndex(q=>q[0]===d.name);if(k>=0)WLN_NAMES.splice(k,1);
   const seq=WL_HOUSES.filter((q,j)=>j<WL_LOTS.length&&WL_LOTS[j][0]===d.side).sort((a,b)=>(a.x0-b.x0)||(a.y0-b.y0));
   const num=2*seq.indexOf(h)+(WLN_ODD[d.side]?1:2),street=WLN_STREET[d.side];
   WLT.push(Object.assign({h,num,street,addr:'number '+num+', '+street},d))}
}
const wltHouses=()=>WLT;
const wltHouseOf=lvl=>WLT.find(t=>t.h.id===lvl)||null;
const wltT=n=>WLT[n-1];
/* ---- the quests ---- */
Object.assign(WL_REW,{wlq60:{gold:450,xp:5000},wlq61:{gold:500,xp:5500},wlq62:{gold:550,xp:6000},wlq63:{gold:600,xp:6500,items:['potion5']}});
WL_QUESTS.push(
  {id:'wlq60',giver:'Gaffer Nettle',title:'The Candlesticks of Church View',desc:'A fence wants the silver candlesticks from a house on Church Lane, taken after dark.'},
  {id:'wlq61',giver:'Barnaby Pike',title:'A Pair of Loaded Dice',desc:'A gambler wants his loaded dice swapped into a rival\'s dice cup, in a house on Green Lane, after dark.'},
  {id:'wlq62',giver:'Crispin Vane',title:'A Page from the Order Book',desc:'A rival merchant\'s agent wants a page copied from a weaver\'s order book, in a house on High Street, after dark.'},
  {id:'wlq63',giver:'Old Ned Gudgeon',title:"The Locket Under the Rug",desc:'A poacher wants his late wife\'s locket taken back from a moneylender\'s hiding place in a house on Mill Lane, after dark.'});
const WLT_DARK='after dark (from eight in the evening until five in the morning)';
wlQ('wlq60','Gaffer Nettle, a fence',[
  ['Go to Church View, '+wltT(1).addr+', '+WLT_DARK+' and get inside without a watchman seeing you. A lamp hangs by the door.',()=>wltF().wlt1_in,['wlt_door1']],
  ['Take the silver candlesticks from the mantel at Church View, and get out of the house without being seen. If a watchman sees you take them, you are arrested.',()=>bagCount('wlt_candle')>0,['wlt_candle']]],{take:{wlt_candle:1}});
wlQ('wlq61','Barnaby Pike, a gambler',[
  ['Go to Bluebell Cottage, '+wltT(2).addr+', '+WLT_DARK+' and get inside without a watchman seeing you.',()=>wltF().wlt2_in,['wlt_door2']],
  ['Swap the loaded dice into the dice cup on the table at Bluebell Cottage. If a watchman sees you at it, you are arrested.',()=>wltF().wlt2_plant,['wlt_cup']]],{give:'wlt_dice'});
wlQ('wlq62','Crispin Vane, a merchant\'s agent',[
  ['Go to Weaver\'s Cottage, '+wltT(3).addr+', '+WLT_DARK+' and get inside without a watchman seeing you.',()=>wltF().wlt3_in,['wlt_door3']],
  ['Copy a page of the order book on the writing desk at Weaver\'s Cottage, and get out without being seen.',()=>bagCount('wlt_copy')>0,['wlt_ledger']]],{take:{wlt_copy:1}});
wlQ('wlq63','Old Ned Gudgeon, a poacher',[
  ['Go to The Willows, '+wltT(4).addr+', '+WLT_DARK+' and get inside without a watchman seeing you.',()=>wltF().wlt4_in,['wlt_door4']],
  ['Find the loose floorboard under the rug at The Willows.',()=>wltF().wlt4_found,['wlt_rug']],
  ["Take the locket from the box under the floorboard, and get out without being seen.",()=>bagCount('wlt_locket')>0,['wlt_rug']]],{take:{wlt_locket:1}});
/* the clients */
khNpc('wlt_fence','Gaffer Nettle, a dealer in second-hand goods','kh_ohfolk2_3',()=>yrLines('wlt_fence',["Nothing for you today. Come back with something, and I will not ask where it came from.","I am a respectable dealer in second-hand goods. The goods have just had a great many previous owners."]),{sc:.95});
const WLD60=khQD("Evening to you. Or morning, I never ask. I buy things, I sell things, and I do not ask where they have been. Nettle, they call me. Now, there is a pair of silver candlesticks on the mantel at Church View, "+wltT(1).addr+". Mr Hatchley is away at his sister's until Friday, and the house is empty. I want those candlesticks, and I will pay well. Go after dark, when the door can be opened. By day it is bolted and the neighbours are nosy. Mind the watchman who walks Church Lane. If he sees you with your hand on the silver, it is the cells. Bail is 500 gold, or three nights on straw. And I never heard of you.",
  "Good. Church View, "+wltT(1).addr+". After dark, not before. There is a lamp by the door. Look through the front window when you are inside, to see where the watch is.",
  (n,m)=>bagCount('wlt_candle')>0?'You have the candlesticks? Bring them here.':(wltF().wlt1_in?'You are in already? Good. The candlesticks are on the mantel. Take them, and get out before the watchman comes by.':'Church View, '+wltT(1).addr+'. After dark, and keep out of sight of the watch. A lamp hangs by the door.'),
  'Are those them? Let me look. Silver, and heavy. Oh, that is good silver.',
  'Lovely. I know a man two counties off who will not ask a single question. Here is your share. And you were never here.',
  'Business is quiet. If I hear of something else, I will find you. Do not look for me.',
  'Here they are.');
wlGive('wlt_fence','wlq60','wlq1',WLD60);
khNpc('wlt_gambler','Barnaby Pike, a gambler','kh_oqmen_2',()=>yrLines('wlt_gambler',["Fifty gold on a single throw, that is the sort of man I am. Or was. Now it is two coppers and a bad feeling.","I once won a goose in a game of dice. The goose won it back."]),{sc:.98});
const WLD61=khQD("Sit down. No, stand, it is safer. I am Barnaby Pike, and I have not won a game of dice at the Plough and Pigeon in two years. Dunstan Orme has, every night. He rolls sixes the way other men breathe, and I know why. His dice are loaded, and he keeps them in a cup on the table at Bluebell Cottage, "+wltT(2).addr+". I have a loaded pair of my own, and they only ever show six. Go in after dark and swap them into his cup. When he takes them to the inn on Saturday, the whole bar will watch a pair of dice do something very strange, and Orme will go in the brook. It will be worth your while. A watchman walks Green Lane, so pick your moment.",
  "Here, the grey pair with the chip. Do not roll them, they only show six and it makes people suspicious. Bluebell Cottage, "+wltT(2).addr+". After dark.",
  (n,m)=>wltF().wlt2_plant?'Has it been done? Bring me word.':(bagCount('wlt_dice')>0?'Put the dice in the cup on the table at Bluebell Cottage, '+wltT(2).addr+', after dark. Keep clear of the watchman.':'Lost the dice? Ask me for another pair.'),
  'Is it done? Did you swap them?',
  'Ha! By Saturday night he will be the most surprised man in Wenlock. Here is your cut. I was at the inn all night, and so were you.',
  'Orme has not been to the inn for three days. I won a game of dice. It felt wonderful and I am a little ashamed.',
  'It is done.');
wlGive('wlt_gambler','wlq61','wlq1',WLD61);
yrHook('wlt_gambler',d=>{
  if(qSt('wlq61')==='active'&&!wltF().wlt2_plant&&bagCount('wlt_dice')<1)return say('You have lost the dice? That, or the watch has them. Here is another pair. Do not lose these.',[['Take another pair.',()=>{bagAdd(mkItem('wlt_dice'));return say('The grey pair, with the chip. Bluebell Cottage, '+wltT(2).addr+'. After dark.',[BYE])}],BYE]);
  return null});
khNpc('wlt_agent','Crispin Vane, an agent','kh_ohfolk2_4',()=>yrLines('wlt_agent',["I represent a firm of wool merchants who would rather not be named. They are very large, and quite nervous.","Do you know what the price of wool is? Nor do I. That is why I am here."]),{sc:.98});
const WLD62=khQD("Good evening. Crispin Vane. I represent a firm of wool merchants who would like to stay unnamed, and who would like to know what Mistress Fenwick the weaver charges the big houses for her cloth. She keeps an order book on the writing desk at Weaver's Cottage, "+wltT(3).addr+". The book must not leave the house, and she must not know it was opened. Go after dark, copy out one page, and bring it to me. The house stands right on the High Street, with a lamp at the door, and the watch comes by often. Be quick about it.",
  "Weaver's Cottage, "+wltT(3).addr+". After dark. One page, copied in a neat hand. Peek through the front window before you start, to see that the watch is away.",
  (n,m)=>bagCount('wlt_copy')>0?'You have the page? Bring it here.':(wltF().wlt3_in?'You are in? The order book is on the writing desk. Copy one page.':'Weaver\'s Cottage, '+wltT(3).addr+', after dark. Mind the watch.'),
  'Is that the page? Let me see. Hm. Hm. She is charging them far too little. This is excellent.',
  'That will help my employers a great deal, and hurt Mistress Fenwick a little. Business is business. Here is your fee.',
  'I am told the price of wool has gone up. I like to think we had something to do with it.',
  'Here is the page.');
wlGive('wlt_agent','wlq62','wlq1',WLD62);
khNpc('wlt_poacher','Old Ned Gudgeon, a poacher','kh_oqmen_5',()=>yrLines('wlt_poacher',["I never took a rabbit in my life. The rabbits took themselves, and I happened to be carrying a sack.","The best nights for fishing are dark ones. The watch does not agree."]),{sc:.98});
const WLD63=khQD("I borrowed seven pounds from Old Hargreave the moneylender, and I paid every penny back at Michaelmas. He still has the thing I left as a pledge, my late wife's silver locket, with her hair in it. He says he has lost it. He has not. It is in a box under a loose floorboard beneath the rug at The Willows, "+wltT(4).addr+". I watched him put it there through the window. I cannot go in, the whole watch knows my face. It is only taking back what is mine. He is away all week. Go after dark, and mind the lamp and the watch.",
  "Thank you. The Willows, "+wltT(4).addr+". The rug is in the back room. Roll it back, and the loose board is under it. After dark, and out before the watchman comes.",
  (n,m)=>bagCount('wlt_locket')>0?'You have it? Bring it here.':(wltF().wlt4_found?'You found the board? The box is under it. Take the locket and go.':'The Willows, '+wltT(4).addr+', after dark. The rug in the back room, and the board under it.'),
  'Is that it? Oh. Oh, yes. That is her hair. Thank you.',
  'I had thought I would never see it again. Here, it is not much, but it is what I have. Go on. And keep out of the cells.',
  'I wear it every day. The moneylender has not said a word. He knows.',
  "Here is the locket.");
wlGive('wlt_poacher','wlq63','wlq1',WLD63);
/* quest rings: the client, then the door of the house, then the thing in the house, then the client again */
if(typeof QRF!=='undefined'){
  const N=(l,...ids)=>({lvl:l,npc:ids}),F=()=>G.flags;
  QRF.T.wlq60={give:[N(496,'wlt_fence')],act:()=>!F().wlt1_in?[N(496,'wlt_door1')]:[N(wltT(1).h.id,'wlt_candle')],ready:[N(496,'wlt_fence')]};
  QRF.T.wlq61={give:[N(496,'wlt_gambler')],act:()=>!F().wlt2_in?[N(496,'wlt_door2')]:[N(wltT(2).h.id,'wlt_cup')],ready:[N(496,'wlt_gambler')]};
  QRF.T.wlq62={give:[N(496,'wlt_agent')],act:()=>!F().wlt3_in?[N(496,'wlt_door3')]:[N(wltT(3).h.id,'wlt_ledger')],ready:[N(496,'wlt_agent')]};
  QRF.T.wlq63={give:[N(496,'wlt_poacher')],act:()=>!F().wlt4_in?[N(496,'wlt_door4')]:[N(wltT(4).h.id,'wlt_rug')],ready:[N(496,'wlt_poacher')]};
}
/* ---- the doors: a lamp by each door (also the quest ring), and what a door does by day and by night ---- */
for(const t of WLT){
  khNpc('wlt_door'+t.n,'The lamp at '+t.name,'kh_ohgard2_5',()=>{
    const night=wlzNight();
    return say(t.name+', '+t.addr+'. '+(night?'The lamp by the door is lit. The street is quiet, and the door is not bolted.':'The shutters are closed and the door is shut. Nobody answers the knocker.'),[BYE])});
}
const WLT_DAY={
  1:()=>{sfx('locked');msg('The shutters are closed and the door is bolted. A card in the window reads: AWAY. BACK FRIDAY. HATCHLEY.','#d09a80')},
  2:()=>wltSay('kh_ohfolk3_4','A woman at the window','A woman puts her head out of an upstairs window. "Mr Orme is at the inn, and I am not buying anything," she says, and shuts the window.'),
  3:()=>wltSay('kh_ohfolk4_2','Mistress Fenwick','The door opens a hand\'s width. A woman in a weaver\'s apron looks you up and down. "The shop is round the back, and it is shut," says Mistress Fenwick. "Come back on market day." The door shuts.'),
  4:()=>{sfx('locked');msg('Nobody answers. A dog barks inside, a lot, and keeps barking while you stand there.','#d09a80')}
};
function wltSay(face,name,text){G.talk={d:{k:khFaceKey(face),x:G.P.x,y:G.P.y},n:{name},node:say(text,[BYE]),t:G.time,btns:[]};G.hold=null;G.queued=null;sfx('locked')}
/* walking into the door of one of the four houses: true if the door was dealt with here, undefined to go in as usual */
function wltDoor(t,d){
  const F=wltF();
  if(!wlzNight()){WLT_DAY[t.n]();return true}
  const g=wlzWatching();
  if(g){
    if(F.wlzWarnT!==undefined&&G.clock-F.wlzWarnT>2880)F.wlzWarn=0;
    F.wlzWarn=(F.wlzWarn||0)+1;F.wlzWarnT=G.clock;
    if(F.wlzWarn>=2){wlzArrest(g,'You again! I told you to keep away from other people\'s doors after dark. That is trespass. You are under arrest, all of you.');return true}
    const enter=()=>{wlzPost(g,t.h.front[0],t.h.front[1],150);sfx('door');goToLevel(d.lvl,d.at);return null};
    G.talk={d:{k:khFaceKey(g.face),x:G.P.x,y:G.P.y},n:{name:g.name},node:say('You there! That is '+t.name+', and the owner is not at home. What business have you at that door after dark? Go home. I am watching you. If I catch you at it, you will be in the cells.',[['Sorry, officer. We will go.',()=>null],['We are only going in for a moment.',enter]]),t:G.time,btns:[]};G.hold=null;G.queued=null;sfx('locked');
    return true}
  return undefined;
}
{const _kb=khBump;khBump=function(nx,ny,g){
  if(LEVEL===496){const d=KH_DOOR[g],t=d&&d.lvl!==undefined?wltHouseOf(d.lvl):null;if(t){const r=wltDoor(t,d);if(r!==undefined)return r}}
  return _kb.apply(this,arguments)}}
/* going into and out of the houses: the entry flags, and the watchman at the window on the way out */
function wltEnsure(){for(const t of WLT){const id=t.h.id;if(!LEVELS[id]&&KH_LAZY[id])try{KH_LAZY[id]()}catch(e){console.error('wlt build',e)}}}
/* the room is called by the name of the house (the level banner, the quest ring: "Go to Church View") */
for(const t of WLT){const id=t.h.id,old=KH_LAZY[id];if(!old)continue;
  KH_LAZY[id]=()=>{if(LEVELS[id])return;old();const L=LEVELS[id];if(L){L.name=t.name;L.label=t.name}LEVEL_NAMES[id]=t.name}}
{const _g=goToLevel;goToLevel=function(n,entry){
  const from=LEVEL,tf=wltHouseOf(from),r=_g.apply(this,arguments);
  try{
    if(LEVEL===n){
      const tt=wltHouseOf(n);
      if(tt){const F=wltF();F.wltHot=null;if(wlzNight())F['wlt'+tt.n+'_in']=1;try{msg(wlzNight()?'It is dark inside, and quiet. The front window is by the door.':'You are inside.','#c8c0a0')}catch(e){}}
      if(n===496&&tf){const F=wltF(),H=F.wltHot;
        if(H&&H.lvl===from){
          const g=wlzWatching();F.wltHot=null;
          if(g)later(350,()=>wlzArrest(g,'Stop, thief! I saw you through the window, and now you walk out of that house with your pockets full! You are under arrest, all of you.',{hot:H}));
          else{try{msg('You slip out into the lamplight. Nobody saw you.','#a8e0a0');skXP('stealth',3)}catch(e){}}}}
      if(n===496&&!G._wltBuilt){G._wltBuilt=1;wltEnsure()}}
  }catch(e){console.error('wlt goToLevel',e)}
  return r}}
/* every restore starts the build over */
if(typeof restore==='function'){const _r=restore;restore=function(){G._wltBuilt=0;return _r.apply(this,arguments)}}
{const _qa=qAccept;qAccept=function(id){const r=_qa.apply(this,arguments);if(/^wlq6[0-3]$/.test(id))try{wltEnsure()}catch(e){console.error(e)}return r}}
/* ---- inside the houses ---- */
{const _wb=wlinBuild;wlinBuild=function(D,name,b,C){
  const id=+String(b&&b.id||'').replace(/\D/g,''),t=wltHouseOf(id);
  if(t&&b)b.keeper=null;   // nobody is up at this hour: the household is out or asleep
  const out=_wb.call(this,D,name,b,C);
  if(t)try{wltFurnish(t,D,C)}catch(e){console.error('wltFurnish',e)}
  return out}}
function wltFurnish(t,D,C){
  const W=D.w,H=D.h,mid=W>>1,taken=new Set();
  const free=(x,y)=>x>=1&&y>=1&&x<=W-2&&y<=H-2&&!C.has(x,y)&&!taken.has(x+','+y);
  const spot=(row)=>{let best=null,bs=-1e9;
    for(let y=row||1;y<=(row?row:H-3);y++)for(let x=1;x<=W-2;x++){if(!free(x,y))continue;if(y>=H-3&&Math.abs(x-mid)<=1)continue;
      let nb=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(free(x+dx,y+dy)||(x+dx>=1&&y+dy>=1&&x+dx<=W-2&&y+dy<=H-2&&!C.has(x+dx,y+dy)))nb++;
      const s=nb*10-y*2-Math.abs(x-mid)*.1;if(s>bs){bs=s;best=[x,y]}}
    if(best)taken.add(best[0]+','+best[1]);return best};
  const put=(prop,id,o)=>{const q=spot();if(!q)return;wlinProp(C,prop,q[0],q[1],Object.assign({npc:id,free:1},o||{}))};
  if(t.n===1)put('votive','wlt_candle',{h:.55});
  if(t.n===2)put('pietable','wlt_cup',{h:.5});
  if(t.n===3)put('readdesk','wlt_ledger',{h:.7});
  if(t.n===4){const q=spot();if(q)C.put('rolledcarpets',q[0],q[1],{npc:'wlt_rug'})}
  put('dresser','wlt_val',{h:.9});
  // the front window, in the wall beside the door
  const wy=H-2,wq=[[mid-3,wy],[mid+3,wy],[mid-2,wy],[mid+2,wy]].find(q=>q[0]>=1&&q[0]<=W-2&&!C.has(q[0],q[1])&&!taken.has(q[0]+','+q[1]));
  if(wq)wlinProp(C,'glasswin',wq[0],wq[1],{npc:'wlt_peek',free:1,h:.8});
}
/* what happens when something is stolen, copied or swapped in a house: the watch looks first */
function wltCaught(g,text){later(60,()=>wlzArrest(g,text));return null}
function wltHotAdd(t,gold){const F=wltF(),H=F.wltHot&&F.wltHot.lvl===t.h.id?F.wltHot:(F.wltHot={lvl:t.h.id,gold:0});H.gold+=gold||0}
function wltNow(){const t=wltHouseOf(LEVEL);return t}
/* put things back and take them away after an arrest: returns lines for the cell door slamming */
function wltConfiscate(extra){
  const F=wltF(),lost=[];
  for(const id of WLT_CONTRA){const n=bagCount(id);if(n>0){bagRemove(id,n);lost.push('The gaoler takes the '+ITEMDEF[id].n.toLowerCase()+'.')}}
  const H=(extra&&extra.hot)||F.wltHot;
  if(H&&H.gold>0){const t=Math.min(G.gold,H.gold);if(t>0){G.gold-=t;lost.push('The gaoler takes '+t+' gold of stolen money.')}}
  F.wltHot=null;F.wlt1_got=0;F.wlt3_got=0;F.wlt4_got=0;   // the things are back where they were, and the quests can be tried again
  return lost;
}
khNpc('wlt_candle','The silver candlesticks','wl2_church_5',d=>{
  const F=wltF(),t=wltNow();
  if(qSt('wlq60')==='active'&&!F.wlt1_got){
    return say('Two tall silver candlesticks stand on the mantel, polished, with the stubs of white candles in them. They are heavy, and worth a good deal.',[['Take the candlesticks.',()=>{
      const g=wlzWatching();if(g)return wltCaught(g,'Thief! I saw you through the window, taking the candlesticks off the mantel! You are under arrest, all of you.');
      if(!bagAdd(mkItem('wlt_candle')))return say('Your bag is full.',[BYE]);
      F.wlt1_got=1;wltHotAdd(t,0);sfx('key');try{skXP('stealth',2)}catch(e){}
      return say('You wrap the candlesticks in a cloth and slip them into your bag. Now get out of the house before the watch comes by.',[BYE])}],BYE])}
  return say(F.wlt1_got?'The mantel is bare where the candlesticks stood.':'Two tall silver candlesticks on the mantel. They are not yours, and nobody has asked you to take them.',[BYE])},{sc:1});
khNpc('wlt_cup','The dice cup','wl2_home_0',d=>{
  const F=wltF(),t=wltNow();
  if(qSt('wlq61')==='active'&&!F.wlt2_plant){
    if(bagCount('wlt_dice')<1)return say('A leather dice cup on the table, with a pair of dice inside. You have no loaded dice to swap in. Barnaby Pike will give you another pair.',[BYE]);
    return say('A leather dice cup stands on the table, with two white dice inside. They are a little too round at the corners.',[['Swap in the loaded dice.',()=>{
      const g=wlzWatching();if(g)return wltCaught(g,'Thief! I saw you through the window, fiddling about with the dice! You are under arrest, all of you.');
      bagRemove('wlt_dice',1);F.wlt2_plant=1;sfx('key');yrStep('You swapped the loaded dice into the cup.');try{skXP('stealth',2)}catch(e){}
      return say('You tip the dice out, drop the grey pair in their place and slip the white pair into your sleeve. Now get out of the house.',[BYE])}],BYE])}
  return say(F.wlt2_plant?'The dice cup holds a grey pair with a chip out of one corner.':'A leather dice cup on the table, with two dice inside.',[BYE])},{sc:1});
khNpc('wlt_ledger','The order book','wl2_library_1',d=>{
  const F=wltF(),t=wltNow();
  if(qSt('wlq62')==='active'&&!F.wlt3_got){
    return say('A tall writing desk with a thick order book open on it, a pen, an ink pot and a stub of candle. The columns are neat: names, lengths of cloth, prices.',[['Copy a page of the book.',()=>{
      const g=wlzWatching();if(g)return wltCaught(g,'Thief! I saw you through the window, with the candle, writing in somebody else\'s book! You are under arrest, all of you.');
      if(!bagAdd(mkItem('wlt_copy')))return say('Your bag is full.',[BYE]);
      F.wlt3_got=1;wltHotAdd(t,0);sfx('key');try{skXP('stealth',2)}catch(e){}
      return say('You light the stub of candle and copy a page of the order book, names, lengths and prices, in a neat hand. You blow out the candle and close the book exactly as you found it. Now get out of the house.',[BYE])}],BYE])}
  return say(F.wlt3_got?'The order book lies closed on the desk. You have the page.':'A writing desk with an order book on it. The writing is small and neat.',[BYE])},{sc:1});
khNpc('wlt_rug','A rolled rug','kh_int5_4',d=>{
  const F=wltF(),t=wltNow();
  if(qSt('wlq63')==='active'){
    if(!F.wlt4_found)return say('A rug is rolled up against the wall of the back room. Under it, one of the floorboards is a little too clean at the edges.',[['Pull up the loose floorboard.',()=>{
      F.wlt4_found=1;sfx('key');yrStep('You found the loose floorboard.');
      return say('The board lifts out with a squeak. Under it, in a gap between the joists, is a small wooden box with a brass catch.',[BYE])}],BYE]);
    if(!F.wlt4_got)return say('The loose board is up. In the gap between the joists, a small wooden box.',[['Take the locket from the box.',()=>{
      const g=wlzWatching();if(g)return wltCaught(g,'Thief! I saw you through the window, pulling up the floor! You are under arrest, all of you.');
      if(!bagAdd(mkItem('wlt_locket')))return say('Your bag is full.',[BYE]);
      F.wlt4_got=1;wltHotAdd(t,0);sfx('key');try{skXP('stealth',2)}catch(e){}
      return say('The box holds a small silver locket on a chain, and a curl of grey hair inside it. You close the box, set the board back and slip the locket into your bag. Now get out of the house.',[BYE])}],BYE])}
  return say('A rug rolled up against the wall.',[BYE])},{sc:1});
/* the purse in the dresser: any time, never a quest. Four sums, 140 to 260 gold */
khNpc('wlt_val','A dresser with a purse in it','wl2_home_1',d=>{
  const F=wltF(),t=wltNow(),k='wltv'+t.n;
  if(F[k])return say('The drawer of the dresser is open and empty. You took the purse.',[BYE]);
  const gold=100+t.n*40;
  return say('The top drawer of the dresser is not quite shut. Inside there is a leather purse that clinks when you touch it.',[['Take the purse.',()=>{
    const g=wlzWatching();if(g)return wltCaught(g,'Thief! I saw you through the window, with your hand in the drawer! You are under arrest, all of you.');
    F[k]=1;G.gold+=gold;wltHotAdd(t,gold);sfx('key');msg('Stolen: '+gold+' gold.','#e8c870');try{skXP('stealth',2);honourAdd(-2,'you stole from a house')}catch(e){}
    return say('The purse holds '+gold+' gold. You slip it into your pocket and shut the drawer. Get out before the watch comes by.',[BYE])}],BYE])},{sc:1});
/* the front window: a peek at where the watchmen are */
khNpc('wlt_peek','The front window','wl2_church_2',d=>{
  const t=wltNow();if(!t)return say('A small window.',[BYE]);
  const fx=t.h.front[0],fy=t.h.front[1];
  const near=WLZ.g.map(g=>({g,d:Math.hypot(g.x-fx,g.y-fy)})).sort((a,b)=>a.d-b.d)[0];
  if(!near||near.d>12)return say('You part the curtain a finger\'s width. The street is empty as far as you can see. No watchman near.',[BYE]);
  const g=near.g,dx=g.x-fx,dy=g.y-fy,dir=Math.abs(dx)>=Math.abs(dy)?(dx>0?'east':'west'):(dy>0?'south':'north');
  const look=wlzSees(g,fx,fy)?'He is looking at this house. It is not a good time.':(near.d<=wlzRange()?'He is looking the other way.':'He is some way off.');
  return say('You part the curtain a finger\'s width. '+g.name+' is about '+Math.round(near.d)+' squares away to the '+dir+(g.pause>0||g.post?', standing still':', walking')+'. '+look,[BYE])},{sc:1});
/* the pass that places the four clients and the lamps by the doors (called by wenlock_polish.js with the town builder's tools) */
function wltPass(C){
  for(const t of WLT){const h=t.h,q=C.near(h.front[0],h.front[1],2);
    if(q){C.dc('lamp',q[0],q[1],{npc:'wlt_door'+t.n,deco:false});C.lights.push([q[0],q[1]]);t.lamp=q}}
  C.person('wlt_fence',74,81,4);       // by the old bridge, in the south
  C.person('wlt_gambler',57,45,4);     // behind the inn
  C.person('wlt_agent',79,54,4);       // east of Mill Lane, by the wool yard
  C.person('wlt_poacher',41,11,4);     // by the gate of the witch's wood
}
WLP_PASSES.push(['thief',C=>wltPass(C)]);
