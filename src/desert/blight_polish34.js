/* ==========================================================================
   QA AND ATMOSPHERE PASS FOR PLACES 3 AND 4 (prefix b34): the Church of the Hollow Saint (9630 to 9634) and Gallowmere (9640 to 9643).
   See tools/polish/blight34_NOTES.md. Everything here is filters over painted pictures, lettered boards and light; nothing is drawn as a creature.
   (The three hooks that call into this file are in blight_polish14.js: the fog colours, b34Vary in the kit wrapper, b34VaryRoom and B34_ROOMX in the room wrapper.)
   b34Var(key,src,filter,flip) a filtered or mirrored copy of a painted picture. b34Ghosts() eight ghost pictures for the choir.
   b34Vary(decor,id) swaps same-key neighbours (trees, grass, hedges, reeds) for their cousins. b34VaryRoom(L) the same for the little room props.
   b34Note(C,x,y,id,pic,text,o) puts a readable board on the nearest free cell. b34ChurchExtra(C) and b34GalExtra(C) are called from the two builders.
   b34Tick is the extra ambient sound (wind, drips, frogs, ropes) hooked on the same tick as the rest.
   ========================================================================== */
function b34Var(key,src,filter,flip){
  if(IMG[key])return key;
  const im=IMG[src];if(!im||!im.width)return src;
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');
  if(flip){x.translate(im.width,0);x.scale(-1,1)}
  try{x.filter=filter||'none'}catch(e){}x.drawImage(im,0,0);x.filter='none';
  IMG[key]=c;NPC_H[key]=NPC_H[src]||1;return key}
function b34Ghosts(){
  const base=['gy_ghost0','gy_ghost1','gy_ghost2','gy_banshee'];
  return base.concat([['b34_gh0','gy_ghost0','hue-rotate(35deg) brightness(.92)'],['b34_gh1','gy_ghost1','hue-rotate(-30deg) saturate(.8)'],['b34_gh2','gy_ghost2','sepia(.5) brightness(.9)'],['b34_gh3','gy_banshee','hue-rotate(60deg) brightness(.9)']].map(a=>b34Var(a[0],a[1],a[2],1)))}
const B34_FAM=[['gy_dead','ww_willow','ww_oakmoss','ww_oakface'],['bl_grass0','bl_grass1','bl_grass2','bl_grass3'],['bl_hedge0','bl_hedge1','bl_hedge2'],['hgwm_reed0','b14_reeds','b14_greeds']];
const B34_CLEAR={9640:[[23,12],[22,13]]};   // two props that cut a pocket of the Reeve's Isle off from the landing
function b34Vary(decor,id){
  if(id!==9630&&id!==9640)return 0;
  for(const [cx,cy] of (B34_CLEAR[id]||[])){for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.x===cx&&d.y===cy&&!d.npc)decor.splice(i,1)}}
  const at=new Map();let n=0;
  for(const d of decor){
    const fam=B34_FAM.find(f=>f.includes(d.k));
    if(fam&&!d.npc){
      const R=fam===B34_FAM[0]?2:1,near=new Set();
      for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){const a=at.get((d.x+dx)+','+(d.y+dy));if(a)for(const k of a)near.add(k)}
      if(near.has(d.k)){const alt=fam.filter(k=>k!==d.k&&!near.has(k)&&IMG[k]);if(alt.length){d.k=alt[(d.x*7+d.y*3)%alt.length];n++}}}
    const key=d.x+','+d.y;if(!at.has(key))at.set(key,[]);at.get(key).push(d.k)}
  return n}
function b34VaryRoom(L){
  if(!L||!L.decor)return;
  const small=['gy_bones','gy_candles'],seen=[];
  const alt={gy_bones:b34Var('b34_bones2','gy_bones','sepia(.35) brightness(.85)',1),gy_candles:b34Var('b34_candles2','gy_candles','sepia(.3) brightness(.9)',1)};
  L.decor=L.decor.filter(d=>{
    if(d.npc||d.hidden)return true;
    const base=Object.keys(alt).find(k=>d.k===k||d.k===alt[k]);
    if(!base)return true;
    // two of one kind within two squares: the second turns into its mirrored cousin, a third is dropped
    const near=seen.filter(s=>s.base===base&&Math.max(Math.abs(s.x-d.x),Math.abs(s.y-d.y))<=2);
    if(near.length>=2)return false;
    if(near.length===1)d.k=near[0].k===alt[base]?base:alt[base];
    seen.push({base,k:d.k,x:d.x,y:d.y});return true})}
/* ---- readable boards ---- */
function b34Note(C,x,y,id,pic,text,o){
  o=o||{};const cell=C.near(x,y,o.rad||2,true);if(!cell)return false;
  if(!NPCS[id])khNpc(id,o.name||'A board',pic,()=>say(text,[BYE]));
  return !!C.dec(pic,cell[0],cell[1],{block:true,npc:id,sc:o.sc||1})}
function b34Board(key,lines,i){return blPost(key,lines.map(n=>({n,d:0})),i||0)}
function b34Slab(key,lines,o){return blSlab(key,lines,Object.assign({h:.8,top:.2,span:.55},o||{}))}
/* ---- the churchyard and the road ---- */
function b34ChurchExtra(C){
  const N=(x,y,id,pic,text,o)=>{try{b34Note(C,x,y,id,pic,text,o)}catch(e){console.error('b34 note',id,e)}};
  N(61,25,'blc_tally',b34Slab('b34_tally',['TALLY','IN FIVES'],{h:.9}),"A board leaning on the sexton's fence with two columns of chalk marks, in bundles of five. The first column has four thousand and eleven strokes. The second column, in different chalk, has the same number. The second column is the newer, and the last bundle is not finished.",{name:'A tally board'});
  N(33,26,'blc_bellrule',b34Board('b34_bellrule',['DO NOT RING','THE BELLS'],2),"A board nailed to a post by the bells, in the sexton's square hand. DO NOT RING THE BELLS. DO NOT LET THEM RING. IF THEY RING, DIG. Under it somebody has scratched a row of small crosses, one for each time.",{name:'A warning board'});
  N(56,42,'blc_pitboard',b34Board('b34_pit',['PAUPERS','NO NAMES KEPT'],3),'A board pushed into the earth at the edge of the pit. PAUPERS. NO NAMES KEPT. Under it in smaller letters: BRING BREAD, NOT FLOWERS. There are no flowers. There are a few heels of very old bread set in a row on the nearest mound, and a crow sitting beside them, waiting.',{name:'A pit board'});
  N(39,50,'blc_poornote',b34Board('b34_poor',['THE CANDLE','IS LIT'],1),'A card nailed to a post by the poor chapel. THE CANDLE IS LIT EVERY NIGHT. NOBODY HAS SEEN WHO LIGHTS IT. PLEASE LEAVE IT BE.',{name:'A card'});
  N(14,38,'blc_rag',b34Board('b34_rag',['WENT ON WEST','KEEP TO LIGHTS'],4),'A strip of cloth tied round a post by the road, with charcoal writing on it. HELD UP HERE THREE DAYS. THE BELLS DO NOT STOP AT NIGHT. WENT ON WEST. KEEP TO THE LIGHTS ON THE CAUSEWAY. The charcoal has run in the damp, and the cloth has been pulled at, as if somebody wanted to take it along and changed their mind.',{name:'A strip of cloth'});
  // a coffin waiting by the sexton's hut, an urn on the fence line
  try{const bg=b34Var('b34_coffin','gy_coffin','saturate(.55) brightness(.8)',1);C.D(bg,55,26,{block:true,sc:.8});C.D('bl_urn',54,32,{block:true,sc:.7})}catch(e){}
  // the dragged trail: bone fragments from the east plot to the vault door, candle stubs along the path edge from the lych-gate
  try{const bz=[b34Var('b34_bonetrail','gy_bones','brightness(.85) sepia(.3)',1),'gy_bones',b34Var('b34_bones2','gy_bones','sepia(.35) brightness(.85)',1)];for(let k=0;k<6;k++){const x=Math.round(50-k*1.9+(C.hs(k,3,401)-.5)*1.2),y=Math.round(21+k*1.1);C.D(bz[k%3],x,y,{sc:.22})}}catch(e){}
  try{const cs=b34Var('b34_candles2','gy_candles','sepia(.3) brightness(.9)',1);for(let k=0;k<5;k++)C.D(k%2?'gy_candles':cs,33-(k%2),30-k*3,{sc:.3})}catch(e){}
  // grave candles: three of the six boards still have a light on them; cold light on the church front; a green light over the pit
  for(const [x,y] of [[22,18],[28,22],[29,26]])C.light(x,y+1,C.warm);
  C.light(37,16,[.7,1.05,.95]);C.light(36,19,[.7,1.05,.95]);
  C.light(54,40,[.6,1.1,.7]);C.light(52,46,[.55,1.15,.8]);
  C.light(24,40,C.warm)}
/* ---- Gallowmere: the fen ---- */
function b34GalExtra(C){
  const N=(x,y,id,pic,text,o)=>{try{b34Note(C,x,y,id,pic,text,o)}catch(e){console.error('b34 note',id,e)}};
  N(47,48,'blg_jettynote',b34Board('b34_jetty',['THE BOAT','ASK OSK FIRST'],2),"A board at the landward end of the jetty. THE BOAT GOES TO HERON ISLE AND TO THE REEVE'S ISLE, AND COMES BACK FROM BOTH. ROW SLOWLY. DO NOT TRAIL A HAND. Under it, in a different hand: OSK BRINE LIVES IN THE STILT HOUSE ON THE GREEN.",{name:'A jetty board'});
  N(75,41,'blg_planknote',b34Board('b34_plank',['KEEP TO','THE PLANKS'],5),'A board at the east end of the causeway. WADING IS NOT SAFE. THE WATER IS DEEPER THAN IT LOOKS AND NOBODY HAS FOUND ITS BOTTOM. THE LAMPS ARE LIT IN ORDER, STARTING AT THIS END.',{name:'A causeway board'});
  N(34,35,'blg_roll',b34Slab('b34_roll',['THE ROLL','212 NAMES'],{h:.9}),'A flat slab propped against the green, with names scratched in columns. The columns go on past the edge of the stone and onto the post behind it. The last three names are cut deeper than the rest, as if the hand had pressed hard.',{name:'The roll'});
  N(9,44,'blg_peatpegs',b34Board('b34_peat',['PEAT','S. SALLOW'],1),"A cut face of black peat with a row of pegs along its top, one for each day's cutting. The pegs run to the end of the bank. The last one has a date burned into it, nine years old.",{name:'Peat pegs'});
  N(10,23,'blg_reedmark',b34Board('b34_reedmark',['T. CORDER','CUT HERE'],3),"Reed bundles tied in threes, each with a notch cut in the band. They are Tam Corder's mark. The newest bundle has been standing four years, and has not been taken for thatch.",{name:'Reed bundles'});
  N(63,15,'blg_nest',b34Board('b34_heron',['HERON ISLE','NO LANDING'],0),"A post at the landing, the paint peeled. HERON ISLE. NO LANDING. A heron's nest sits on top of the post, built from reeds, string and small pale bones, and nothing is in it.",{name:'The landing post'});
  N(29,15,'blg_reeveland',b34Board('b34_reevesign',['THE REEVE','TOLL PAID HERE'],4),"A board at the landing. THE REEVE'S ISLE. TOLL PAID AT THE HALL. The word PAID has been scratched out. Under it, in a shaking hand: NOT YET.",{name:'The landing board'});
  // a wreck: a grey boat gone to the bottom among the reeds, never the boat that rows
  try{const wb=b34Var('b34_wreck','yar_boat_row','saturate(.2) brightness(.45)',1);const c=C.near(13,46,3,true);if(c)C.dec(wb,c[0],c[1],{block:true,sc:1.1})}catch(e){}
  // bog lights over the bodies, a cold light at the gibbet, pale lights on the two isles
  for(const [x,y] of [[10,50],[12,58],[44,58],[84,50]])C.light(x,y,[.55,1.15,.8]);
  C.light(36,33,[.7,1.05,1.0]);C.light(66,16,[.6,1.1,.85]);C.light(26,15,[.6,1.1,.85])}
/* ---- the rooms ---- */
function b34Put(b,pic,x,y,id,text,name){
  if(b.has(x,y))return;
  if(!NPCS[id])khNpc(id,name,pic,()=>say(text,[BYE]));
  b.raw(pic,x,y,{npc:id,solid:1,deco:false,sc:.85})}
const B34_ROOMX={
  9631:b=>{
    b34Put(b,b34Board('b34_hymnboard',['HYMN','THE LAST'],2),14,3,'blc_hymnboard','A hymn board on a short post. All four slots show the same number. The last slot has been scratched out and chalked in again so many times that the wood has gone thin, and every time it is the same number.','A hymn board');
    b34Put(b,'gy_book',8,3,'blc_sermon','A stack of sermon pages on a stool, held down with a stone. They are numbered. The top page is numbered nine, and is in the middle of a sentence. Nothing in the stack is numbered above nine, and nothing is numbered below one.','Sermon pages');
    b34Put(b,'gy_candles',12,12,'blc_plate','A wooden collection plate at the end of a pew, with four coins on it. All four have gone black, and none of them has been spent.','A collection plate');
    b34Put(b,'gy_book',13,11,'blc_hymnal','A hymnal left open on the floor at the end of a pew, face down. The spine is cracked at the last hymn.','A hymnal')},
  9632:b=>{
    b34Put(b,b34Slab('b34_scratch',['41 ROWS','OF STROKES'],{h:.9}),6,12,'blc_scratch','Scratched into the stone at knee height, in rows: tally marks. There are forty-one rows, one row for each year of the sermon overhead. The last row is not finished.','Scratched marks');
    b34Put(b,b34Slab('b34_epitaph',["ORLA'S POOR",'ALL OF THEM'],{h:.9}),14,12,'blc_epitaph',"A flat slab set in the floor. ORLA'S POOR, it says, and under it the cut goes on in a long list with no names, only numbers. Each number is struck through, one at a time, in a row of small neat strokes.",'A floor slab')},
  9633:b=>{
    b34Put(b,'gy_book',4,6,'blc_ringlog',"The bellringers' log, on a ledge, in a long column of entries. Harvest, rung. Wedding, rung. The old Sovereign's death, rung, muffled. The last entry has no word beside it, only a date, and below that the lines are ruled in advance, all the way to the bottom of the page, and blank.","The ringers' log")},
  9634:b=>{
    b34Put(b,b34Slab('b34_register',['REGISTER','OF BURIALS'],{h:.9}),2,4,'blc_register','The burial register, on a stand. The entries are in one hand for forty years. Then there is one night with many names, all crowded into a single page. After it comes a line in a different hand: SERMON CONTINUES. After that, the pages are blank.','The register')},
  9641:b=>{
    b34Put(b,b34Slab('b34_tides',['TIDES','ALL LOW'],{h:.9}),8,3,'blg_tides',"A slate on a nail, chalked with a week of tides in Osk's hand. Every line says the same: LOW. The last line says: LOW. STILL LOW. IT IS NOT THE WATER THAT HAS COME UP.",'A slate of tides')},
  9642:b=>{
    b34Put(b,b34Slab('b34_tollroll',['TOLL ROLL','NO. NO. NO.'],{h:.9}),13,4,'blg_tollroll',"The village's answer to the toll, written out in the Reeve's own hand and signed by every household. The answer is one word, and it is repeated down the whole page. The ink at the bottom is still wet.",'The toll roll')},
  9643:b=>{
    b34Put(b,b34Slab('b34_salted',['SALTED','NINE YEARS'],{h:.9}),2,3,'blg_saltlist',"A list on the wall in Nan's hand, of everything in the house that has been salted and what day it was done. The first entry is her husband. The last entries are a cat, a loaf, and a boy's cap.",'A salting list')}
};
/* ---- the extra ambient sound ---- */
const B34S={wind:0,drip:0,creak:0,frog:0,plop:0,rope:0,knock:0,heron:0,rustle:0};
function b34Tick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!SNDOPT.amb||!b14Mine(LEVEL))return;
  const now=AC.currentTime,S=B34S,px=G.P.x,py=G.P.y,R=Math.random;
  if(LEVEL===9630){
    if(now>S.wind){S.wind=now+14+R()*16;nz(3.2,.035,'bandpass',420,260,0);nz(2.6,.02,'bandpass',900,500,.6)}
    if(now>S.rustle){S.rustle=now+9+R()*12;nz(.7,.02,'highpass',3200,2400,0)}
    if(now>S.rope&&Math.hypot(px-37,py-26)<16){S.rope=now+16+R()*20;tone(70,62,.9,'sine',.04,0);nz(.5,.02,'bandpass',200,150,.1)}}
  else if(LEVEL===9631){
    if(now>S.creak){S.creak=now+8+R()*10;try{wwsCreak(.35)}catch(e){}}
    if(now>S.wind){S.wind=now+17+R()*14;nz(1.8,.012,'bandpass',600,380,0)}}
  else if(LEVEL===9632){
    if(now>S.drip){S.drip=now+3+R()*5;try{wwsDrip(.7)}catch(e){}}
    if(now>S.knock){S.knock=now+28+R()*30;tone(62,48,.18,'sine',.08,0);tone(60,46,.16,'sine',.06,.45)}
    if(now>S.wind){S.wind=now+20+R()*16;nz(1.4,.02,'lowpass',160,110,0)}}
  else if(LEVEL===9633){
    if(now>S.wind){S.wind=now+6+R()*7;nz(2.4,.03,'bandpass',680,380,0);nz(2.0,.02,'bandpass',1100,640,.4)}
    if(now>S.creak){S.creak=now+11+R()*13;tone(95,88,2.2,'sine',.03,0);tone(190,176,1.6,'sine',.015,.2)}}
  else if(LEVEL===9634){
    if(now>S.creak){S.creak=now+7+R()*9;try{wwsCreak(.3)}catch(e){}}
    if(now>S.rustle){S.rustle=now+12+R()*12;nz(.8,.015,'highpass',2800,2200,0)}}
  else if(LEVEL===9640){
    if(now>S.frog){S.frog=now+5+R()*9;const f=240+R()*90;tone(f,f*.8,.09,'square',.014,0);tone(f*1.06,f*.84,.09,'square',.012,.13);if(R()<.5)tone(f*.92,f*.7,.08,'square',.01,.27)}
    if(now>S.plop){S.plop=now+7+R()*10;const f=420+R()*180;tone(f,f*.35,.14,'sine',.05,0)}
    if(now>S.rustle){S.rustle=now+8+R()*10;nz(1.4,.018,'highpass',3000,2000,0)}
    if(now>S.rope&&Math.hypot(px-36,py-32)<14){S.rope=now+11+R()*14;tone(78,70,1.1,'sine',.035,0);nz(.6,.018,'bandpass',180,140,.2)}
    if(now>S.heron&&py<22){S.heron=now+20+R()*30;tone(560,330,.45,'sawtooth',.014,0);nz(.4,.012,'bandpass',900,500,0)}
    if(now>S.wind){S.wind=now+16+R()*16;nz(3,.022,'bandpass',360,220,0)}}
  else if(LEVEL===9641){
    if(now>S.creak){S.creak=now+7+R()*9;try{wwsCreak(.32)}catch(e){}}
    if(now>S.plop){S.plop=now+6+R()*8;const f=380+R()*120;tone(f,f*.4,.12,'sine',.03,0)}}
  else if(LEVEL===9642){
    if(now>S.plop){S.plop=now+4+R()*6;const f=300+R()*160;tone(f,f*.38,.16,'sine',.045,0)}
    if(now>S.knock){S.knock=now+22+R()*24;tone(120,90,.5,'sine',.05,0);nz(.8,.02,'bandpass',500,260,.1)}}
  else if(LEVEL===9643){
    if(now>S.knock){S.knock=now+30+R()*30;tone(70,55,.12,'sine',.07,0)}
    if(now>S.creak){S.creak=now+9+R()*10;try{wwsCreak(.3)}catch(e){}}}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{b34Tick()}catch(e){console.error('b34 tick',e)}}}

/* ---------- round 2 (29 Oct 2026): painted art made in Gemini (assets/ds_bl_stilt1, bl_stilt2, bl_ibell2, bl_hang1, bl_hang2) ---------- */
NPC_H.bl_hang1=1.9;NPC_H.bl_hang2=1.9;NPC_H.bl_ibell2=1.15;NPC_H.bl_stilt1=3.0;NPC_H.bl_stilt2=2.9;
