/* ==========================================================================
   THE BLIGHTED ROAD, POLISH FOR PLACES 1 TO 4 (prefix b14 / B14): the Toll House (9610), Ashenfold Farm (9620), the Church of the Hollow Saint (9630), Gallowmere (9640) and their rooms.
   Last in ORDER. It gives the four builders shared helpers (dead wall styles, dead copies of painted props, ground patches) and wraps the weather.
   Nothing here is drawn in code except filters over painted pieces. See tools/polish/blight1to4_CRITIC.md for the faults and tools/polish/blight1to4_NOTES.md for what was done.
   Helpers: b14Dead(key,src,filter,h) makes a filtered copy of a painted picture once and returns its key. b14Styles() registers the dark wall styles (WL.sty.dflint, dbrick, dtimber, dhoney, dwhite).
   b14Patches(C,opt) lays patches of bare earth and mud on the grass. b14Furrows(C,x0,y0,x1,y1) ploughs a field. b14Dressing(C,id) is the prop pass of each place.
   ========================================================================== */
const B14={ids:[9610,9620,9630,9640]};
const b14Mine=id=>id>=9610&&id<=9643;
/* ---- the air: a darker, greener fog ---- */
{const _w=weatherNow;weatherNow=function(){
  const r=_w.apply(this,arguments);
  if(r&&r.id==='fog'&&b14Mine(LEVEL)){const L=LEVELS[LEVEL];if(L&&L.outdoor){
    if(LEVEL===9640)return Object.assign({},r,{col:[60,86,78],mix:.72,haze:.4});     // the fen: thick, green, wet
    if(LEVEL===9630)return Object.assign({},r,{col:[74,78,88],mix:.66,haze:.3});     // the churchyard: cold blue grey
    return Object.assign({},r,{col:[70,82,68],mix:.65,haze:.32})}}
  return r}}
/* ---- dead copies of painted pieces ---- */
function b14Dead(key,src,filter,h){
  if(IMG[key])return key;
  const im=IMG[src];if(!im||!im.width)return src;
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');try{x.filter=filter||'saturate(.35) brightness(.62)'}catch(e){}x.drawImage(im,0,0);x.filter='none';
  x.globalCompositeOperation='multiply';x.fillStyle='rgb(190,200,186)';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='destination-in';x.drawImage(im,0,0);
  IMG[key]=c;NPC_H[key]=h||NPC_H[src]||1;return key}
const B14_ROOF='saturate(.3) brightness(.56) sepia(.25)';
function b14Roof(k){return b14Dead('b14r_'+k,k,B14_ROOF)}
/* the dark wall styles: the Wenlock sheets, greyed and dimmed (tint is a multiply) */
function b14Styles(){
  if(typeof OH_STY==='undefined'||typeof WL==='undefined'||!WL.sty)return;
  const mk=(name,from,tint)=>{const S=OH_STY[from];if(!S)return;OH_STY[name]=Object.assign({},S,{tint:tint});WL.sty[name]=name};
  mk('dflint',WL.sty.flint||'wlgrey',[112,118,112,0]);mk('dbrick',WL.sty.brick||'brick',[104,92,90,0]);mk('dtimber',WL.sty.timber||'timber',[104,108,100,0]);
  mk('dhoney',WL.sty.honey||'golden',[110,110,100,0]);mk('dwhite',WL.sty.white||'cottage',[100,106,100,0]);mk('dblack',WL.sty.black||'timber',[118,120,114,0])}
/* ---- noise for the patches ---- */
function b14Noise(hs,x,y,cs,sd){const u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
  return(hs(i,j,sd)*(1-sx)+hs(i+1,j,sd)*sx)*(1-sy)+(hs(i,j+1,sd)*(1-sx)+hs(i+1,j+1,sd)*sx)*sy}
/* patches of bare earth ('1') and wet mud ('5') on the grass ('0'): never on a path, a reserved square or the boundary. opt: {earth:.66, mud:.78, cs:6, keep:fn} */
function b14Patches(C,opt){
  opt=opt||{};const hs=C.hs,W=C.W,H=C.H,E=opt.earth===undefined?.58:opt.earth,M=opt.mud===undefined?.72:opt.mud,cs=opt.cs||5;
  for(let y=C.Y0;y<=C.Y1;y++)for(let x=C.X0;x<=C.X1;x++){
    const i=y*W+x;if(C.fm[i]!=='0'||C.path.has(x+','+y)||(opt.keep&&opt.keep(x,y)))continue;
    const n=b14Noise(hs,x,y,cs,C.id+91)*.75+b14Noise(hs,x,y,2.5,C.id+92)*.25;
    if(n>M)C.fm[i]='5';else if(n>E)C.fm[i]='1'}}
/* a ploughed field: furrows of mud every third row, stalks standing on the ridges. dense: chance of a stalk on a ridge cell */
function b14Furrows(C,x0,y0,x1,y1,dense){
  const hs=C.hs;dense=dense||.8;
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    if(C.path.has(x+','+y))continue;
    if(y%3===0){C.fm[y*C.W+x]='5';continue}
    if(hs(x,y,141)>dense)continue;
    const k=hs(x,y,145)<.45?'ww_twig2':'bl_grass'+((hs(x,y,146)*4)|0);
    const d=C.D(k,x,y,{sc:.8+hs(x,y,142)*.7});if(d){d.ox=(hs(x,y,143)-.5)*.3;d.oy=(hs(x,y,144)-.5)*.2}}}
/* a prop dressing helper: list of [key,x,y,opt] placed with dec (exact) */
function b14Place(C,list){for(const [k,x,y,o] of list)C.dec(k,x,y,Object.assign({block:true},o||{}))}
/* ---- wrap the kit: the four builders get the dark styles, and every roof of the four places is dimmed at C.finish ---- */
{const _k=blKit;blKit=function(spec){
  const C=_k.apply(this,arguments);
  if(b14Mine(spec.id)){
    b14Styles();
    const fin=C.finish;
    C.finish=function(o){
      try{for(const s of C.sky){if(s.k&&!s.big&&IMG[s.k])s.k=b14Roof(s.k)}}catch(e){console.error('b14 roofs',e)}
      // the bright Wenlock garden pieces (flower barrows, crates, sacks) are dimmed to dead copies
      try{for(const d of C.decor){if(/^kh_ohgard\d_\d$/.test(d.k)||/^kh_oqstuff_[89]$/.test(d.k)||d.k==='gy_rose'){const k2=b14Dead('b14d_'+d.k,d.k,'saturate(.25) brightness(.58)');if(IMG[k2])d.k=k2}}}catch(e){console.error('b14 decor',e)}
      try{b34Vary(C.decor,spec.id)}catch(e){console.error('b34 vary',e)}
      return fin.apply(this,arguments)}}
  return C}}

/* ---- the mere: cold grey-green water with long pale ripples (the game's water goes brown under the warm party light and shows no shine, so the fen read as bare mud). Made in code, as walls and floors may be. ---- */
function b14Mere(){
  if(FLOORS.b14_mere)return 'b14_mere';
  const N=128,d=new Uint8ClampedArray(N*N*4),TAU2=Math.PI*2,hh=(a,b,c)=>hash2(a,b,c);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const w=Math.sin(TAU2*(y*3/N+.28*Math.sin(TAU2*x*2/N)))*.5+.5,w2=Math.sin(TAU2*(x*2/N+y*5/N+.2*Math.sin(TAU2*y*3/N)))*.5+.5,m=w*.6+w2*.4;
    let r=70+34*m,g=104+44*m,b=106+40*m;
    const i=(y*N+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255}
  // pale ripple dashes and a few dark weed flecks (wrapped, so the tile joins)
  for(let n=0;n<46;n++){const cx=(hh(n,1,301)*N)|0,cy=(hh(n,2,301)*N)|0,len=6+((hh(n,3,301)*14)|0),pale=hh(n,4,301)>.3;
    for(let k=0;k<len;k++){const x=(cx+k)%N,y=cy%N,i=(y*N+x)*4,a=Math.sin(Math.PI*k/len)*(pale?.5:.35);
      if(pale){d[i]+=(210-d[i])*a;d[i+1]+=(225-d[i+1])*a;d[i+2]+=(225-d[i+2])*a}else{d[i]*=1-a;d[i+1]*=1-a*.8;d[i+2]*=1-a*.8}}}
  FLOORS.b14_mere=d;return 'b14_mere'}

/* ---- the rooms of the four places: bone heaps were drawn a metre across (now a handful of bones), webs in the corners, candle stubs and cold window light so the cosy rooms look blighted, and the barn, cellar, belfry and vestry, which stood nearly empty, get their furniture ---- */
const B14_ROOMX={
  9622:b=>{b.prop('shelving',1,1,{h:1.2});b.prop('veg',6,1,{h:.6});b.raw('barrel',1,5,{sc:.9});b.raw('crate',4,6,{sc:.9});b.raw('hay',9,3,{sc:.8})},
  9623:b=>{b.raw('hay',1,2,{sc:1.1});b.raw('hay',1,3,{sc:1.0});b.raw('hay',11,3,{sc:1.0});b.prop('cothearth',8,1,{h:.95});b.prop('waterbarrel',1,8,{h:.7});b.raw('crate',3,7,{sc:.9});b.raw('crate',4,7,{sc:.8});b.raw('barrel',10,8,{sc:.9});
    b.raw('wl_prop1_5',3,4,{sc:.42,block:true});b.raw('hay',6,8,{sc:.9,block:false})},
  9633:b=>{b.prop('bookshelf',1,1,{h:1.1});b.prop('candlerack',3,1,{h:1.0});b.prop('candlerack',9,1,{h:1.0});b.raw('barrel',1,8,{sc:.8});b.raw('hay',11,8,{sc:.8})},
  9634:b=>{b.prop('coatrack',9,1,{h:1.0});b.prop('waterbarrel',1,7,{h:.7});b.prop('tapestry',7,1,{h:1.0,block:false})}
};
function b14RoomDress(id,b){
  try{if(B14_ROOMX[id])B14_ROOMX[id](b)}catch(e){console.error('b14 room x',id,e)}
  try{if(B34_ROOMX[id])B34_ROOMX[id](b)}catch(e){console.error('b34 room x',id,e)}
  const W=b.W,H=b.H,free=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&!b.has(x,y);
  // webs in the top corners and above the door side, a few bone fragments and candle stubs on free cells, none in the middle of the room or beside the door
  for(const [x,y] of [[1,1],[W-2,1],[1,H-2],[W-2,H-2]])if(free(x,y))b.raw('gy_web',x,y,{block:false,sc:.5});
  const placed=[],far=(x,y)=>placed.every(q=>Math.max(Math.abs(q[0]-x),Math.abs(q[1]-y))>2);
  let n=0;for(let k=0;k<40&&n<4;k++){const x=1+((hash2(k,id,311)*(W-2))|0),y=1+((hash2(k,id,312)*(H-3))|0);if(!free(x,y)||!far(x,y)||Math.abs(x-(W>>1))<2&&y>H-4)continue;b.raw('gy_bones',x,y,{block:false,sc:.25});placed.push([x,y]);n++}
  n=0;placed.length=0;for(let k=0;k<30&&n<3;k++){const x=1+((hash2(k,id,313)*(W-2))|0),y=1+((hash2(k,id,314)*(H-3))|0);if(!free(x,y)||!far(x,y)||Math.abs(x-(W>>1))<2&&y>H-4)continue;b.raw('gy_candles',x,y,{block:false,sc:.35});placed.push([x,y]);n++}}
{const _r=blRoom;blRoom=function(spec){
  if(b14Mine(spec.id)){
    const ob=spec.build;
    spec.build=function(C){if(ob)ob.apply(this,arguments);
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){}};
      b14RoomDress(spec.id,{raw:C.raw,put:C.put,W:C.W,H:C.H,has:C.has,prop:P})};
    // a cold light from the window side: every cosy room gets one pale light
    if(spec.lights&&!spec.b14){spec.b14=1;const w=spec.w,h=spec.h;spec.lights=spec.lights.concat([[w-2,h-2]]);spec.lcol=Object.assign({},spec.lcol||{});spec.lcol[(w-2)+','+(h-2)]=[.7,1.1,.95]}}
  const L=_r.apply(this,arguments);
  try{if(b14Mine(spec.id))b34VaryRoom(L)}catch(e){console.error('b34 vary room',e)}
  return L}}

/* ==========================================================================
   ROUND 12 (prefix b12): QA and atmosphere for places 1 and 2 (9610, 9611, 9620 to 9623).
   Fixes: banners no longer narrow the toll road to one square, duplicate lanterns and barrels beside each other were varied, the cellar start square was blocked by a crate,
   a skeleton in the kitchen corner stood in a pocket. Adds: written notes and signs, trails of bones and straw, a kennel, a wash pot, ambient sound by place, a dusty fog for the farm.
   ========================================================================== */
const b12Say=(t)=>()=>say(t,[BYE]);
khNpc('blt_ditchsign','A ditch warning','greensign',b12Say('A board nailed to a post at the side of the road. DO NOT DRINK FROM THE DITCH. Under it, in a child’s hand: IT WAS SWEET LAST WEEK.'));
khNpc('blt_tally','A tally slab','bl_slab',b12Say('A grey slab at the edge of the toll yard with columns of scratches cut in it, five to a bundle. At the bottom the columns stop and one word is cut deep: PAID. There is a space left below for more.'));
khNpc('blt_hutsign','A roadmender’s board','bl_slab',b12Say('A board by the roadmender’s hut. It reads: MENDING DONE. DO NOT KNOCK. HE IS NOT IN. The tapping from inside has a pattern, three and then two. It is the pattern of a man mending a road.'));
khNpc('blt_diary','A page from a Warden’s diary','gy_book',b12Say('A single page, torn from a diary and left on the bed. It reads: Day 3. The Captain says we are not to leave the house, and not to look at the door. Day 4. I looked at the door. It is only a door. Day 5. The silver is in the walls now. I can hear it. The page ends there.'));
khNpc('blt_deskslip','A slip under the strongbox','gy_book',b12Say('A slip of paper pushed under the strongbox. It reads: To the clerk. The chest is full. Send a cart. Send two. The weight is wrong, the silver is heavier than it was. There is no reply on the back.'));
khNpc('bla_barnsign','A board by the barn door','bl_slab',b12Say('A board by the barn door, lettered by hand. KNOCK THREE TIMES. IF THEY ANSWER IN THE SAME WAY, DO NOT COME IN. Hob Fenner.'));
khNpc('bla_kennel','A dog kennel','bl_hut',b12Say('A small kennel by the yard fence. The chain runs out of it, across the mud, and ends in a bare collar lying on the ground. Inside, a bowl of something dry. The name above the door is TRUSTY.'));
khNpc('bla_letter','A letter on the shelf','gy_book',b12Say('A letter in Wilf Sedge’s hand, not finished. Dear Miller, I cannot bring the corn this year. The man in the wax coat says he will take it for the road. He was very kind. I signed what he asked, and I did not read it, and my hand has been light ever since.'));
khNpc('bla_tally','Scratches in the barn post','gy_book',b12Say('Marks cut in the post by the loft ladder, one for every day. There are nine. Beside the ninth Hob has cut a small bowl and a small spoon.'));
function b12Toll(C){
  C.post(24,30,'bl_t_ditch',[{n:'THE DITCH',d:0}],'blt_ditchsign','',{i:3});
  C.dec('bl_slab',53,27,{block:true,npc:'blt_tally',sc:.7});
  C.dec('bl_slab',15,13,{block:true,npc:'blt_hutsign',sc:.6});
  for(const [x,y] of [[20,36],[21,35],[23,34],[26,34],[29,33],[32,34]])C.dec('gy_bones',x,y,{sc:.2});
  C.dec('bl_barrow',30,36,{block:true,sc:.8});C.dec('ww_stump',14,34,{block:true,sc:.7});C.dec('gy_bench',45,36,{block:false});
  C.light(38,35,C.pale);C.light(58,16,C.pale);C.light(14,33,C.warm)}
function b12Ash(C){
  C.dec('bl_slab',54,25,{block:true,npc:'bla_barnsign',sc:.6});
  C.dec('bl_hut',37,25,{block:true,npc:'bla_kennel',sc:.38});
  for(const [x,y] of [[26,22],[27,24],[25,26],[26,28],[24,30],[28,31]])C.dec('ww_twig2',x,y,{sc:.7});
  for(const [x,y] of [[12,9],[20,17],[30,11],[16,45]])C.light(x,y,C.pale);
  C.light(38,26,C.warm)}
B14_ROOMX[9611]=b=>{b.raw('gy_book',9,3,{npc:'blt_deskslip',solid:1,deco:false,sc:.35});b.raw('gy_book',8,7,{npc:'blt_diary',solid:1,deco:false,sc:.35});b.raw('gy_candles',9,5,{block:false,sc:.4});b.raw('bl_barrow',1,4,{block:false,sc:.4})};
B14_ROOMX[9621]=b=>{b.raw('gy_book',13,3,{npc:'bla_letter',solid:1,deco:false,sc:.35});b.raw('gy_candles',5,2,{block:false,sc:.4});b.raw('gy_bones',3,6,{block:false,sc:.3})};
{const _o=B14_ROOMX[9623];B14_ROOMX[9623]=b=>{_o(b);b.raw('gy_book',8,5,{npc:'bla_tally',solid:1,deco:false,sc:.35})}}
/* a dusty brown fog at the farm, ambient sound by place */
{const _w=weatherNow;weatherNow=function(){const r=_w.apply(this,arguments);
  if(r&&r.id==='fog'&&LEVEL>=9620&&LEVEL<=9623){const L=LEVELS[LEVEL];if(L&&L.outdoor)return Object.assign({},r,{col:[92,84,62],mix:.62,haze:.3})}
  return r}}
const B12S={n:{}};
function b12Tick(){
  if(!AC||!MASTER||G.state!=='play'||G.mute||!SNDOPT.amb||LEVEL<9610||LEVEL>9623)return;
  const now=AC.currentTime,L=LEVEL,at=(k,lo,hi)=>{if(!(now>(B12S.n[k]||0))){return false}B12S.n[k]=now+lo+Math.random()*(hi-lo);return true};
  if(L===9610&&at('tap',22,40)){tone(150,95,.07,'square',.03,0);tone(150,95,.07,'square',.03,.45);tone(150,95,.07,'square',.03,.9)}   // the hut taps, three
  if(L===9610&&at('flap',15,30))tone(300,220,.5,'triangle',.012,0);   // a torn banner
  if(L===9611&&at('tick',2,2.1)){tone(1700,1600,.03,'square',.012,0)}   // the clock
  if(L===9611&&at('pour',30,60)){for(let i=0;i<6;i++)tone(2400+Math.random()*900,1800,.04,'sine',.01,i*.07)}   // grey wax dust settling
  if(L===9620&&at('cow',40,80))tone(110,70,1.5,'sawtooth',.018,0);   // a far cow, low
  if(L===9620&&at('rustle',9,20)&&typeof wwsCreak==='function')wwsCreak(.3);
  if(L===9621&&at('plate',12,26))tone(1000,700,.06,'triangle',.04,0);   // a plate set down
  if(L===9621&&at('fire',2,4))tone(60+Math.random()*80,40,.05,'sawtooth',.012,0);   // the fire
  if(L===9622&&at('hum',20,40)){[392,440,392].forEach((f,i)=>tone(f,f,.5,'sine',.012,i*.6))}   // somebody small humming
  if(L===9623&&at('moo',25,50))tone(120,85,1.3,'sawtooth',.02,0);
  if(L===9623&&at('hay',10,22)&&typeof wwsCreak==='function')wwsCreak(.25)}
{const _t=yarSoundTick;yarSoundTick=function(){_t.apply(this,arguments);try{b12Tick()}catch(e){console.error('b12',e)}}}

/* ---------- round 2 (29 Oct 2026): critic fixes for the Toll House, Ashenfold, the church and Gallowmere ----------
   b2Post(id) runs after the growths pass of each of the four places (a wrap of bgrEnsure, see blight_growths.js, which is not edited): the pink bulb pairs at the gates are taken away,
   and stones, reeds and dead trees get a spread of sizes and a small shift, so a row is not a fence of copies. Only removes or rescales; nothing can be cut off by it. */
const B2_JIT=/^(bl_stone|bl_lean|bl_wcross|gy_stones|gy_mound|bl_barrow|hgwm_reed|b14_reeds|b14_greeds|gy_dead|ww_willow|ww_oakmoss|ww_oakface|bl_grass|bl_hedge)/;
function b2Post(id){
  const L=LEVELS[id];if(!L||!L.decor||L._b2)return;L._b2=1;
  const ent=[[L.start.x,L.start.y]];
  try{const p=blPlaceOf(id);if(p){if(p.fromE)ent.push([p.fromE.x,p.fromE.y]);if(p.fromW)ent.push([p.fromW.x,p.fromW.y])}}catch(e){}
  // a talking growth with no free square beside it cannot be reached: it stays a plain growth (npc taken off)
  {const W=L.rows[0].length,H=L.rows.length,T=TERRS[id],bl=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
   const fr=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.'&&!(T&&T.block&&T.block[y*W+x])&&!bl.has(x+','+y);
   for(const d of L.decor)if(d.npc&&/^bgr_x_/.test(d.npc)&&![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>fr(d.x+a,d.y+b))){delete d.npc;d.deco=true;d.solid=0}}
  for(const d of L.decor)if(d.npc&&/^bgr_x_/.test(d.npc)&&id===9640&&d.x===31&&d.y===7){delete d.npc;d.deco=true;d.solid=0}   // on the strip north of the Reeve's hall, which the walk test cannot reach
  let cut=0,jit=0;
  const itc=new Set((L.items||[]).map(i=>i.x+','+i.y));   // a tree standing on a potion is taken away
  for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];
    if(d.k==='bl_grow_1'&&ent.some(e=>Math.abs(e[0]-d.x)<=11&&Math.abs(e[1]-d.y)<=8)){L.decor.splice(i,1);cut++;continue}
    if(d.block&&!d.npc&&itc.has(d.x+','+d.y)){L.decor.splice(i,1);cut++;continue}
    if(!d.npc&&!d._j&&B2_JIT.test(d.k)){d._j=1;const h=hash2(d.x,d.y,id+77),h2=hash2(d.y,d.x,id+78);
      if(!/^bl_(hedge|grass)/.test(d.k))d.sc=+((d.sc||1)*(.72+h*.68)).toFixed(2);
      d.ox=+((d.ox||0)+(h2-.5)*.3).toFixed(2);d.oy=+((d.oy||0)+(h-.5)*.2).toFixed(2);jit++}}
  L._b2s={cut,jit}}
if(typeof bgrEnsure==='function'){const _be=bgrEnsure;bgrEnsure=function(id){const L=LEVELS[id],first=L&&!L._bgr;const r=_be.apply(this,arguments);try{if(first&&(id===9610||id===9620||id===9630||id===9640))b2Post(id)}catch(e){console.error('b2',e)}return r}}
/* the toll yard: a gallows at the south edge of the yard (the Wardens hanged their own), a warm glow at the door of the toll house, a bare slope beside the graves broken up */
function b2Toll(C){
  C.dec(IMG.bl_hang2?'bl_hang2':'gy_rpost',45,36,{block:true,sc:1.05});C.light(45,35,C.pale);
  C.light(41,27,[1.8,1.2,.6]);C.light(43,27,[1.8,1.2,.6]);
  for(const [x,y,k,sc] of [[47,22,'gy_dead',1.1],[46,25,'gy_rose',.8],[48,27,'bl_urn',.8],[49,23,'gy_bones',.35],[47,24,'gy_dead',.9]])C.dec(k,x,y,{block:k!=='gy_bones'&&k!=='gy_rose',sc})}
