/* ==========================================================================
   THE WARDEN'S SEALS, and the west gate of Wenlock (prefix ws / WS). Act 9 of the main story: quests wk4 to wk8. Last in the injection order.
   The west gate of Wenlock (the signposted THE WESTERN KINGDOMS gate at the west end of High Street) was shut years ago on the order of the Road Wardens. Opening it needs THREE WARDEN'S SEALS, one from each dark place of Wenlock:
     1. the well maze under the town well (levels 497 to 502): the Well-Warden in the Amethyst Deep (502) drops it. Flag: G.flags.wm.bossDead.
     2. the Witch's Wood (520 to 523): Grisselda Blackbriar drops it when she is dead. Flag: G.flags.wwDead.
     3. the Wenlock Graveyard (530 to 535): the Prioress Morwenna, the last of the four mazes' bosses, drops it. Flag: gyF().dead[3].
   Each seal is a quest item with the pale silver mark of the Pale Sovereign (it is in Vance's ledger and on the pieces of the Sovereign's key). The seal comes with the boss's drop, AND there is a plinth in each place
   (502 near the pedestal, 521 in the cottage parlour, 530 in the yard near the lych-gate) that hands the seal over when the boss is already dead (an old save), so it can always be had. No new dungeon.
   Quests: wk4 The Closed Road (the mayor tells it; done at once, it opens wk5 to wk7), wk5 / wk6 / wk7 one seal each, in any order (each is done the moment its seal is obtained), wk8 The Western Gate (back to the mayor with all three:
   a short scene, the gate opens). The open gate shows a different picture; walking through shows the end-of-part message and sends the party back inside Wenlock. Nothing lies beyond.
   Flags (saved with the game): G.flags.ws = {told:1, got:{1,2,3}}, G.flags.wsGate = 1 (the gate is open).
   Test link: ?town=wenlock&lvl=80&ws=1 (the mayor, ready to tell the tale: errand done), ws=2 (all three bosses dead, wk4 taken, no seal yet: walk to the plinths), ws=3 (all three seals in the bag, wk8 ready, at the mayor),
   ws=gate (the gate open, at its foot), ws=p1 / p2 / p3 (the bosses dead, standing at that plinth). Same as wsDemo('1') in the console.
   ========================================================================== */
const WS={prev:{},demoDone:false};
const wsF=()=>{const F=G.flags;if(!F.ws)F.ws={told:0,got:{}};if(!F.ws.got)F.ws.got={};return F.ws};
/* ---------- the three seals ---------- */
const WS_MARK='A small pale silver mark is inlaid in its face. It is the same mark that is in Vance’s ledger and on the pieces of the Pale Sovereign’s key.';
ITEMDEF.wkseal1={n:"Warden’s Seal of the Well",k:'quest',t:'Quest item',ic:'ore',c:'#b8b0d8',stack:1,price:0,sw:.3,d:'A disc of dark iron as wide as a palm, taken from the Well-Warden in the Amethyst Deep under Wenlock. '+WS_MARK+' One of the three seals that keep the west gate of Wenlock shut. Take it to the mayor.'};
ITEMDEF.wkseal2={n:"Warden’s Seal of the Wood",k:'quest',t:'Quest item',ic:'ore',c:'#9ab888',stack:1,price:0,sw:.3,d:'A disc of dark iron as wide as a palm, taken from Grisselda Blackbriar in Blackbriar Wood. '+WS_MARK+' One of the three seals that keep the west gate of Wenlock shut. Take it to the mayor.'};
ITEMDEF.wkseal3={n:"Warden’s Seal of the Graveyard",k:'quest',t:'Quest item',ic:'ore',c:'#c8c0b0',stack:1,price:0,sw:.3,d:'A disc of dark iron as wide as a palm, taken from the Prioress Morwenna in the Wenlock graveyard. '+WS_MARK+' One of the three seals that keep the west gate of Wenlock shut. Take it to the mayor.'};
const WSD={
  1:{item:'wkseal1',q:'wk5',plinth:'ws_plinth1',place:'the maze under the Wenlock well',who:'the Well-Warden',pl:'plinth',
     name:"Warden’s Seal of the Well",
     locked:'A stone plinth stands on the floor of the Warden’s court, with a round hollow in its top, the size of a palm. The Well-Warden still guards this place. The seal is not here yet.',
     text:'A stone plinth stands on the floor of the Warden’s court. In the round hollow in its top lies a disc of dark iron with a pale silver mark in its face. The Well-Warden is dead, and nothing guards it now.'},
  2:{item:'wkseal2',q:'wk6',plinth:'ws_plinth2',place:'Blackbriar Wood',who:'Grisselda Blackbriar',pl:'bone totem',
     name:"Warden’s Seal of the Wood",
     locked:'A bone totem stands in the corner of the parlour, with a round iron hook on it, the size of a palm. Grisselda Blackbriar still lives here. The seal is not here yet.',
     text:'A bone totem stands in the corner of the parlour. A disc of dark iron hangs on a hook on it, with a pale silver mark in its face. Grisselda is dead, and nobody is left to mind it.'},
  3:{item:'wkseal3',q:'wk7',plinth:'ws_plinth3',place:'the Wenlock graveyard',who:'the Prioress Morwenna',pl:'altar',
     name:"Warden’s Seal of the Graveyard",
     locked:'A small stone altar stands by the path, with a round hollow in its top, the size of a palm. The last guardian of the graveyard, the Prioress Morwenna, is not dead yet. The seal is not here yet.',
     text:'A small stone altar stands by the path. In the round hollow in its top lies a disc of dark iron with a pale silver mark in its face. The Prioress Morwenna is dead, and nothing guards it now.'}};
const wsDead=n=>{const F=G.flags;try{return n===1?!!(F.wm&&F.wm.bossDead):n===2?!!F.wwDead:!!(typeof gyF==='function'&&gyF().dead&&gyF().dead[3])}catch(e){return false}};
const wsGot=n=>!!wsF().got[n];
const wsAll=()=>wsGot(1)&&wsGot(2)&&wsGot(3);
const wsHave=n=>bagCount(WSD[n].item)>0;
const wsLying=n=>(G.items||[]).some(i=>i&&!i.taken&&i.k===WSD[n].item);
/* the seal is handed over: into the bag (or onto the floor if the bag is full), and the quest of that seal is done */
function wsGive(n,from){
  const D=WSD[n],S=wsF();
  if(!bagAdd(mkItem(D.item)))G.items.push({k:D.item,x:G.P.x,y:G.P.y,taken:false});
  S.got[n]=1;
  msg(from?from:'You have the '+D.name+'.','#ffe36a');sfx('win');
  wsSync()}
/* the quests follow the seals: a seal obtained completes its quest; the last one opens wk8 */
function wsSync(){
  const S=wsF();if(!S.told)return;
  for(const n of [1,2,3]){const q=WSD[n].q;if(S.got[n]&&qSt(q)==='active'&&qReady(q))qTurnIn(q)}
  if(wsAll()&&qSt('wk5')==='done'&&qSt('wk6')==='done'&&qSt('wk7')==='done'&&qSt('wk8')===null){
    qAccept('wk8');msg('You have all three Warden’s Seals. Take them to the mayor of Wenlock, at the church end of the town.','#ffe36a')}}
/* ---------- the quests ---------- */
QUESTS.wk4={title:'The Closed Road',who:'Mayor Aldous Thistlewood',desc:'The mayor of Wenlock says that the west gate at the end of High Street was shut years ago on the order of the Road Wardens, and that it can only be opened with three Warden’s Seals. One lies in each of the three dark places of Wenlock: the maze under the town well, Blackbriar Wood and the old graveyard. Each seal is kept by whatever lives there. Fetch the three seals and bring them to the mayor.',need:1,goal:()=>wsF().told?1:0,reward:{gold:6000,xp:40000,items:['potion6']}};
QUESTS.wk5={title:'The Seal under the Well',who:'Mayor Aldous Thistlewood',desc:'Under the town well of Wenlock lies a four-level maze of violet brick. Its guardian, the Well-Warden, in the Amethyst Deep at the bottom, holds a Warden’s Seal. Kill him and take the seal. If he is already dead, take the seal from the plinth in his court.',need:1,goal:()=>wsGot(1)?1:0,reward:{gold:9000,xp:60000,items:['potion6']}};
QUESTS.wk6={title:'The Seal in the Wood',who:'Mayor Aldous Thistlewood',desc:'Blackbriar Wood lies north of Wenlock, through the gate at the top of Blackbriar Lane. Grisselda Blackbriar, the witch, holds a Warden’s Seal in her cottage. Kill her and take the seal. If she is already dead, take it from the bone totem in her parlour.',need:1,goal:()=>wsGot(2)?1:0,reward:{gold:10000,xp:66000,items:['potion6']}};
QUESTS.wk7={title:'The Seal in the Graveyard',who:'Mayor Aldous Thistlewood',desc:'The old graveyard lies west of Wenlock, behind the lych-gate at the end of Churchyard Lane. A Warden’s Seal is kept by the last guardian of its four mazes, the Prioress Morwenna. Kill her and take the seal. If she is already dead, take it from the stone altar in the yard, near the lych-gate.',need:1,goal:()=>wsGot(3)?1:0,reward:{gold:11000,xp:72000,items:['potion6']}};
QUESTS.wk8={title:'The Western Gate',who:'Mayor Aldous Thistlewood',desc:'You have all three Warden’s Seals. Take them to the mayor of Wenlock. He will go with you to the west gate and open it.',need:1,goal:()=>wsAll()?1:0,reward:{gold:15000,xp:100000,items:['potion6','potion6','potion6']}};
for(const id of ['wk4','wk5','wk6','wk7','wk8'])QAREA[id]='The Western Kingdoms';
if(typeof MAIN_QUESTS!=='undefined')['wk4','wk5','wk6','wk7','wk8'].forEach(id=>MAIN_QUESTS.add(id));
if(typeof QNOTE!=='undefined')QNOTE.wk8='The west gate of Wenlock stands open. The road west lies beyond it. The next part of the story is not written yet.';
if(typeof QWORLD_ID!=='undefined'){QWORLD_ID.wk4='wenlock';QWORLD_ID.wk5='wellmaze';QWORLD_ID.wk6='witchwood';QWORLD_ID.wk7='wkgrave';QWORLD_ID.wk8='wenlock'}
/* the quest rings and the map markers (see quest_rings_fix.js): the mayor, then the boss while he lives, the plinth once he is dead */
if(typeof QRF!=='undefined'){
  const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx});
  const T=QRF.T;
  T.wk4={give:[N(496,'wlo_mayor')]};
  T.wk5={give:[N(496,'wlo_mayor')],act:()=>wsDead(1)?[N(502,'ws_plinth1')]:[E(502,/^wmwarden$/)]};
  T.wk6={give:[N(496,'wlo_mayor')],act:()=>wsDead(2)?[N(521,'ws_plinth2')]:[E(520,/^wwwitch$/),N(521,'wwo_grisselda')]};
  T.wk7={give:[N(496,'wlo_mayor')],act:()=>wsDead(3)?[N(530,'ws_plinth3')]:[E(535,/^gymorwenna$/),N(530,'gyo_door3')]};
  T.wk8={give:[N(496,'wlo_mayor')],act:[N(496,'wlo_mayor')],ready:[N(496,'wlo_mayor')]}}
/* ---------- the plinths: the seal can always be had, even in a save where the boss died long ago ---------- */
function wsPlinth(n){
  const D=WSD[n],S=wsF(),F=G.flags;
  if(F.wsGate)return say('The '+D.pl+' is empty. The seal that lay here is set into the west gate of Wenlock.',[BYE]);
  if(!wsDead(n))return say(D.locked,[BYE]);
  if(wsHave(n)||wsLying(n))return say('The '+D.pl+' is empty. You have already taken the seal.',[BYE]);
  return say(D.text,[['Take the seal.',()=>{wsGive(n,'You take the '+D.name+'. It is cold and heavy.');return null}],BYE])}
for(const n of [1,2,3]){const D=WSD[n];khNpc(D.plinth,n===1?'A stone plinth':n===2?'A bone totem':'A stone altar',n===1?'wm_orb_pedestal':n===2?'ww_totem':'gy_altar',()=>wsPlinth(n))}
const WS_PL={502:{n:1,k:'wm_orb_pedestal',at:[13,3]},521:{n:2,k:'ww_totem',at:[3,6]},530:{n:3,k:'gy_altar',at:[62,35]}};
function wsFreeCell(L,ax,ay,need){
  const rows=L.rows,occ=new Map();for(const d of L.decor||[])occ.set(d.x+','+d.y,d);
  let best=null,bd=1e9;
  for(let y=1;y<rows.length-1;y++)for(let x=1;x<rows[y].length-1;x++){
    if(rows[y][x]!=='.'||occ.has(x+','+y))continue;
    let open=0,bad=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;if(rows[y+dy][x+dx]==='.')open++;const o=occ.get((x+dx)+','+(y+dy));if(o&&o.block)bad++}
    if(open<need||bad>1)continue;
    const d=Math.hypot(x-ax,y-ay);if(d<bd){bd=d;best=[x,y]}}
  return best}
function wsPlinthInstall(n){
  const P=WS_PL[n];if(!P)return;
  if(!LEVELS[n]&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error('ws plinth build',e)}
  const L=LEVELS[n];if(!L||L._wsPl||!L.rows)return;
  const c=wsFreeCell(L,P.at[0],P.at[1],8)||wsFreeCell(L,P.at[0],P.at[1],5);if(!c)return;
  L.decor=L.decor||[];L.decor.push({k:P.k,x:c[0],y:c[1],block:true,npc:WSD[P.n].plinth});L._wsPl={x:c[0],y:c[1]};
  if(G.decor&&G.decor!==L.decor&&LEVEL===n)G.decor.push(L.decor[L.decor.length-1])}
{const _l=loadLevel;loadLevel=function(n){
  if(WS_PL[n])try{wsPlinthInstall(n)}catch(e){console.error('ws plinth',e)}
  if(n===496)try{wsPatchGate(n)}catch(e){console.error('ws gate',e)}
  const r=_l.apply(this,arguments);
  if(n===496)try{wsPatchGate(n)}catch(e){console.error('ws gate',e)}
  return r}}
/* ---------- the west gate: shut until the seals are in, then open ---------- */
const WS_LOCK='A signpost beside the gate reads: TO THE WESTERN KINGDOMS. Beneath it, in smaller letters: (not yet open). The gate is shut, and the road beyond it is blocked by a very large and very sleepy ox. The mayor says that three Warden’s Seals would open it.';
function wsGateTex(){ // the open gate: the shut gate's own picture with the middle opened on a sunlit road, drawn in code from the shut gate's texture (a wall tile, not a prop)
  if(T_DOORS.wlgate3!==undefined)return T_DOORS.wlgate3;
  const src=T_DOORS.wlgate2;if(src===undefined)return undefined;
  const t=TEX[src],W=128,Hh=Math.round(t.d.length/(W*4)),d=new Uint8ClampedArray(t.d),e=new Uint8ClampedArray(d.length);
  const x0=34,x1=94,y0=Math.max(0,Hh-128+12),y1=Hh;
  for(let y=y0;y<y1;y++){const v=(y-y0)/(y1-y0); // 0 at the top of the opening, 1 at the foot
    for(let x=x0;x<x1;x++){const i=(y*W+x)*4,h=(x-(x0+x1)/2)/((x1-x0)/2);
      let r,g,b;
      if(v<.5){const k=v/.5;r=70+55*k;g=105+45*k;b=150-20*k} // sky, paling to gold at the horizon
      else if(v<.64){const k=(v-.5)/.14;r=50-20*k;g=80-30*k;b=40-14*k} // a dark line of hedge
      else{const k=(v-.64)/.36;const road=1-Math.min(1,Math.abs(h)*1.5);r=70+80*road*(1-k*.3);g=60+66*road*(1-k*.3);b=40+40*road*(1-k*.3)} // the road, running away
      d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255;e[i]=r*.3;e[i+1]=g*.3;e[i+2]=b*.3;e[i+3]=255}}
  for(let y=y0;y<y1;y++){for(const [a,b] of [[x0-8,x0],[x1,x1+8]])for(let x=a;x<b;x++){const i=(y*W+x)*4;d[i]*=.62;d[i+1]*=.58;d[i+2]*=.52}} // the two leaves, folded back against the posts
  const id=addTex(d,e);TEX[id].h=t.h;TEX[id].wh=t.wh;T_DOORS.wlgate3=id;return id}
function wsPatchGate(n){
  const L=LEVELS[n||496],F=G.flags;if(!L||!L.portals)return;
  const p=L.portals[2];if(!p||p.to!==496||!(p.req==='wlNeverOpen'||p.wsWest))return;
  p.wsWest=1;p.req='wsGate';p.lock=WS_LOCK;
  if(F.wsGate&&wsGateTex()!==undefined)p.tex='wlgate3';
  if(LEVEL===(n||496)&&G.portals&&G.portals[2]&&G.portals[2]!==p){const q=G.portals[2];q.wsWest=1;q.req='wsGate';q.lock=WS_LOCK;if(F.wsGate&&p.tex==='wlgate3')q.tex='wlgate3'}}
{const _up=usePortal;usePortal=function(i){const p=G.portals[i];
  if(LEVEL===496&&p&&p.wsWest&&G.flags.wsGate){sfx('door');
    hgduPrompt('The gate stands open, and the road west runs away between the hedges in the sun. The road west lies beyond. The next part of the story is not written yet.',[['Go back into Wenlock.',()=>{G.talk=null;goToLevel(496,{x:8,y:50,f:1});msg('You walk back along High Street into Wenlock.','#c8e8a0');return null}]]);return}
  return _up.apply(this,arguments)}}
/* the same said by signposts and the people after the gate is open (the old lines say "not yet open"): applied by say() in index.html */
function wsFixText(s){
  return s.replace(/\(not yet open\)/g,'(open now)')
    .replace('The road west is not yet open. When it is, I shall have a ribbon, and a very large pair of scissors.','The road west is open. I had a ribbon and a very large pair of scissors ready, and the ox ate the ribbon.')
    .replace('The road west is not yet open. Please stop asking the clerk. He does not know. He has asked the road.','The road west is open. Please stop asking the clerk what is out there. He does not know. He has asked the road.')
    .replace('The road west is still not open, but you are very welcome','The road west is open now, but you are very welcome')}
/* ---------- the mayor ---------- */
const WS_OFFER=[
  'Now that you have settled in, I must tell you something I should have said at the start. The road west is not shut by an ox. The ox only sits on it. The gate at the west end of High Street was shut years ago, on the order of some men who called themselves the Road Wardens. My father was the mayor then. He was told to keep it shut, and told not to ask why.',
  'The Road Wardens shut it with three seals, and left one in each of the three dark places around Wenlock. One lies under the town well, in the maze below it. One lies in Blackbriar Wood, in the witch’s cottage. One lies in the old graveyard, at the end of its mazes. Each is guarded by whatever lives there: the Well-Warden under the well, Grisselda in the wood, and in the graveyard the last of the four who keep it.',
  'The order that shut the gate came with a great deal of silver, and a small pale mark in the wax. My father kept the letter. Bring me all three seals and I will open the gate. I will tell you who the Road Wardens served when you do. Will you go?'];
function wsMissing(){const o=[];for(const n of [1,2,3])if(!wsGot(n))o.push(n===1?'the seal under the Wenlock well':n===2?'the seal in Blackbriar Wood':'the seal in the graveyard');return o}
function wsAccept(){
  const S=wsF();S.told=1;qAccept('wk4');qTurnIn('wk4');
  for(const id of ['wk5','wk6','wk7'])if(qSt(id)===null)qAccept(id);
  wsSync()}
function wsMayor(d,prev){
  const F=G.flags,S=wsF(),other=['Something else.',()=>prev(d)];
  if(F.wsGate){
    if(qSt('wlq9')==='done'&&qSt('wlq10')!=='done')return prev(d);
    return yrLines('ws_mayor_after',['The gate is open, and I have still not got used to it. Nobody has come through it, and nobody has gone out. The road has gone very quiet.','The Road Wardens served the Pale Sovereign. I have read my father’s letter again, and the mark in the wax is the mark on the seals. Whatever the Sovereign wanted from the west, he paid for it in silence.','If you go west, take food, and a good map, which I cannot give you. I have not got one.'])}
  if(qSt('wk8')==='active'&&qReady('wk8')){
    if(!wsHave(1)||!wsHave(2)||!wsHave(3))return say('You found all three seals, but you do not have all three with you now. Go back to the place of the missing one. Its plinth, altar or totem will give it again.',[other,BYE]);
    return say('All three! The well, the wood and the graveyard! Come, come with me to the gate. Bring the seals, and let the whole town follow.',[['Open the gate.',()=>wsOpenScene()],other,BYE])}
  if(qSt('wk4')===null&&F.wkMayor&&qSt('wlq1')==='done'){
    const p3=()=>say(WS_OFFER[2],[['We will fetch the three seals.',()=>{wsAccept();return say('Thank you. Do them in any order you like. Each seal has the pale mark on it. Do not let it out of your bag, and mind yourselves. The well and the wood and the graveyard have not stood empty all these years for nothing.',[BYE])}],['Not now.',()=>null]]);
    const p2=()=>say(WS_OFFER[1],[['Go on.',p3],['Not now.',()=>null]]);
    return say(WS_OFFER[0],[['Go on.',p2],other,['Not now.',()=>null]])}
  if(qSt('wk4')==='done'&&qSt('wk8')===null&&!wsAll()){
    const m=wsMissing(),got=3-m.length;
    return say('The west gate needs three Warden’s Seals. You have '+got+' of the three. Still to find: '+m.join(', ')+'.',[other,BYE])}
  return null}
{const n=NPCS.wlo_mayor,k=KH_KEEPERS.wlo_mayor;
  if(n){const prev=n.root;n.root=d=>wsMayor(d,prev)||prev(d);if(k)k.root=n.root}}
{const og=Object.getOwnPropertyDescriptor(QGIVER,'wlo_mayor'),old=og&&og.get?og.get:()=>QGIVER.wlo_mayor;
  Object.defineProperty(QGIVER,'wlo_mayor',{enumerable:true,configurable:true,get(){
    const l=[].concat(old.call(QGIVER)||[]),F=G.flags;
    if(qSt('wk8')==='active'&&qReady('wk8'))l.unshift('wk8');
    else if(qSt('wk4')===null&&F.wkMayor&&qSt('wlq1')==='done')l.unshift('wk4');
    return l.length?l:null}})}
/* ---------- the scene at the gate ---------- */
CUTS.wsGate=()=>[
  {text:'The mayor leads the party along High Street to the west gate, with half of Wenlock walking behind him. The ox gets up and wanders off. Nobody has seen it move in years.'},
  {text:'He lays the three seals in three round hollows in the iron of the gate: the iron one from the well, the one from the wood and the one from the graveyard. They fit as if they had been made for them, and they were.'},
  {text:'Each seal turns a quarter turn. A thin pale silver light runs across the iron from one to the next, and goes out. The bolts draw back by themselves, and the two leaves of the gate swing open on the road.'},
  {who:'Mayor Thistlewood',text:'It is open. I have walked past that gate every day of my life, and I never thought I would see it open. Sit on the wall a moment, all of you. I owe you the rest of it.'},
  {who:'Mayor Thistlewood',text:'The Road Wardens were never wardens of any road. They were paid. The silver that paid them came from the Pale Sovereign, the dead king under the Abbey, the same king whose silver paid Vance and Corvane. The mark on the seals is his mark. He wanted the road west kept shut, and kept quiet.'},
  {who:'Mayor Thistlewood',text:'Look at it. In my father’s day the carts came along that road every week. Then it was shut, and nothing has come through since. No trader, no pilgrim, no post rider. The west has fallen quiet, and I do not know what is out there. Somebody has to go and see.'},
  {text:'The gate stands open. The road beyond it runs west between hedges, in the sun, and there is no sound on it at all.'}];
function wsOpenScene(){G.talk=null;G.hold=null;startCut('wsGate',wsGateEnd);return null}
function wsGateEnd(){
  const F=G.flags;
  for(const id of ['wkseal1','wkseal2','wkseal3'])while(bagCount(id)>0)bagRemove(id,1);
  try{qTurnIn('wk8')}catch(e){console.error(e)}
  F.wsGate=1;
  try{wsPatchGate(496)}catch(e){console.error(e)}
  goToLevel(496,{x:5,y:50,f:3});G.cut=null;G.talk=null;
  msg('The west gate of Wenlock stands open.','#e8e0a0')}
/* ---------- the story pages and the next hint ---------- */
STORY.push(
  {id:'wsclosed',c:()=>qSt('wk4')!==null,t:'The Closed Road',x:'The mayor of Wenlock told the party that the west gate at the end of High Street was shut years ago on the order of the Road Wardens. It cannot be opened by force. The Road Wardens locked it with three Warden’s Seals and left one in each of the three dark places of the town: under the well, in Blackbriar Wood and in the graveyard. Each is guarded by whatever lives there. The letter that shut the gate came with a great deal of silver and a small pale mark in the wax.'},
  {id:'wswell',c:()=>wsGot(1),t:'The Seal under the Well',x:'In the Amethyst Deep, at the bottom of the violet maze under the well, the party took a Warden’s Seal from the Well-Warden. It is a disc of dark iron with a pale silver mark inlaid in its face: the same mark that is in Vance’s ledger and on the pieces of the Pale Sovereign’s key.'},
  {id:'wswood',c:()=>wsGot(2),t:'The Seal in the Wood',x:'In Blackbriar Wood the party took a second Warden’s Seal from the witch Grisselda Blackbriar. It carries the same pale silver mark. The witch had kept it among her bones and sugar as if it were her own.'},
  {id:'wsgrave',c:()=>wsGot(3),t:'The Seal in the Graveyard',x:'In the Wenlock graveyard the party took the third Warden’s Seal from the Prioress Morwenna, last of the four who guard the mazes. The same pale silver mark is on it. The Road Wardens left all three seals where something would guard them, and the Pale Sovereign’s silver had been paying for it for years.'},
  {id:'wsgate',c:()=>G.flags.wsGate,t:'The Western Gate',x:'The mayor set the three seals in the west gate of Wenlock, and the gate opened. He told the party that the Road Wardens served the Pale Sovereign, the dead king under the Abbey whose silver bought Vance and Corvane. Since the gate was shut, nothing has come out of the west: no trader, no pilgrim, no rider. The west has fallen quiet. The road west lies beyond the gate. The next part of the story is not written yet.'});
{const _sn=storyNext;storyNext=function(){const F=G.flags;
  if(F.wsGate)return 'The west gate of Wenlock is open. The road west lies beyond it. The next part of the story is not written yet.';
  if(qSt('wk8')==='active')return 'Take the three Warden’s Seals to the mayor of Wenlock. He will open the west gate.';
  if(qSt('wk5')==='active'||qSt('wk6')==='active'||qSt('wk7')==='active'){const m=wsMissing();
    return 'Find the Warden’s Seals that open the west gate of Wenlock, and take them to the mayor. Still to find: '+m.join(', ')+'.'}
  if(F.wkMayor&&qSt('wk4')===null&&qSt('wlq1')==='done')return 'Speak to the mayor of Wenlock again. He has something to tell you about the shut west gate.';
  if(F.wkMayor&&qSt('wk4')===null)return 'Do the mayor’s errand in Wenlock: take his note to Bartle the crier in the market square. Then speak to the mayor again about the road west.';
  return _sn.apply(this,arguments)}}
/* ---------- the seals are noticed when the boss dies (the poll is quiet when a save is loaded with the boss already dead: then the plinth gives the seal) ---------- */
function wsPoll(){
  for(const n of [1,2,3]){const dead=wsDead(n);
    if(WS.prev[n]===undefined){WS.prev[n]=dead;continue}
    if(dead&&!WS.prev[n]){WS.prev[n]=true;
      if(!wsGot(n)&&!G.flags.wsGate)try{wsGive(n,n===1?'Among the shards of the Well-Warden lies a Warden’s Seal. You take it.':n===2?'In the witch’s ashes lies a Warden’s Seal. You take it.':'In the Prioress’s grey dust lies a Warden’s Seal. You take it.')}catch(e){console.error('wsGive',e)}}
    if(!dead)WS.prev[n]=false}
  if(G.flags.ws&&G.flags.ws.told)wsSync()}
{const _u=update;update=function(dt){
  try{if(G.state==='play'&&G.flags){wsPoll();if(!WS.demoDone&&LEVEL===496){WS.demoDone=true;const m=/[?&]ws=(\w+)/.exec(location.search);if(m)wsDemo(m[1])}}}catch(e){console.error('wsPoll',e)}
  return _u.apply(this,arguments)}}
/* ---------- test links: ?town=wenlock&lvl=80&ws=1 | 2 | 3 | gate | p1 | p2 | p3 ---------- */
function wsBosses(){const F=G.flags;if(!F.wm)wmF();F.wm.bossDead=1;F.wwDead=1;gyF().dead[3]=1;WS.prev={1:true,2:true,3:true}}
function wsDemo(w){
  const F=G.flags;F.wlMayorMet=1;F.wkGarden=1;F.wkWenlock=1;
  for(const id of ['wk1','wk2','wk3','wlq1']){G.quests[id]={st:'done',ord:(F.qSeq=(F.qSeq|0)+1),base:0}}
  F.wkMayor=1;G.gold=Math.max(G.gold,5000);
  const mayor=()=>{const L=LEVELS[496],m=(G.decor||[]).find(d=>d.npc==='wlo_mayor');return m?{x:m.x,y:m.y}:{x:27,y:31}};
  const toMayor=()=>{const m=mayor();goToLevel(496,{x:m.x,y:m.y+2,f:0})};
  if(w==='1'){toMayor();return}
  if(w==='gate'){F.wsGate=1;wsPatchGate(496);goToLevel(496,{x:5,y:50,f:3});return}
  if(w==='2'||w==='3'||/^p[123]$/.test(w)){
    wsBosses();wsAccept();
    if(w==='3'){for(const n of [1,2,3]){wsGive(n)}toMayor();return}
    if(w==='2'){toMayor();return}
    const n=+w[1],lv=n===1?502:n===2?521:530;
    wsEnsure(lv).then(()=>{const L=LEVELS[lv],pl=L&&L._wsPl;if(!pl)return;const s=L.rows[pl.y+1]&&L.rows[pl.y+1][pl.x]==='.';goToLevel(lv,{x:pl.x,y:pl.y+(s?1:-1),f:s?0:2});G.state='play'})}}
/* a level of the three places is built (the witch's pictures are loaded first) before the party goes there */
async function wsEnsure(lv){try{if(typeof wwIs==='function'&&wwIs(lv)&&!WW.ready)await wwLoad();if(!LEVELS[lv]&&typeof wwIs==='function'&&wwIs(lv)&&KH_LAZY[WW.ID])KH_LAZY[WW.ID](); /* the cottage is built with the wood */ if(!LEVELS[lv]&&KH_LAZY[lv])KH_LAZY[lv]();wsPlinthInstall(lv)}catch(e){console.error('wsEnsure',e)}}
