/* ==========================================================================
   THE PALE SPIRE, PACKAGE 1 (REBUILT, redesign of 30 Oct 2026): THE GATE (prefix psg / PSG).
   Levels: 9720 The Pale Approach (64 x 56 outdoor: five switchback legs climbing a crag between high walls, retaining walls with pits and iron fences, a gully bridge,
   hidden nooks, a ravine crossed by a long stone bridge, the Barbican forecourt and the Great Gate), 9721 The Great Gatehouse (32 x 24), 9722 The Winch Loft (20 x 18),
   9723 The Porter's Lodge (18 x 14, rest room).
   Everything is made with the shared kit (ps_kit.js: pspMake, PSP_PAL, the sky and the CASTLE VIEW, C.rise C.ravine C.bridge C.fence C.vines C.archway C.alcove).
   Numbers (ids, sizes, link squares) come from PSP in ps_ids.js. Palette: black weathered stone, verdigris copper, sickly green light (PSP_PAL).
   The castle view (the sky picture castle_view, then castle_view_near, growing as the party climbs) is switched on by the `castle` option of pspMake in psgBuildApproach.
   Part A: items and creatures. Part B: the approach. Part C: the interiors. Part D: people, quests and objects (unchanged in content from the first build).
   ========================================================================== */
const PSG={ids:[9720,9721,9722,9723]};
const psgIs=n=>n>=9720&&n<=9729;
const psgF=()=>pspF();
/* ---------- things carried ---------- */
ITEMDEF.pshorn={n:"The Warden's Horn",k:'quest',t:'Quest item',ic:'amulet',c:'#c8c4b8',stack:1,price:0,sw:.4,d:"A long horn of dull horn and tarnished silver, the kind a Road Warden blew to call the watch. It lay on a table in the Winch Loft beside the man who carried it. Captain Dyrwen Harrow of the Road Wardens is in the dungeons of the Pale Spire and would like it back."};
ITEMDEF.pstoken={n:"Pilgrim's Token",k:'quest',t:'Quest item',ic:'ring',c:'#b8b4d0',stack:1,price:0,sw:.05,d:"A small thing left by a pilgrim on the way to the Pale Spire: a ribbon, a button, a bent coin. Nine of them are needed to settle the cairn on the Pale Approach. Merrick Dole the porter will want them."};
ITEMDEF.pskeyring={n:"The Gate Captain's Key Ring",k:'quest',t:'Quest item',ic:'key',c:'#c0c4d8',stack:1,price:0,sw:.3,d:"A heavy ring of iron keys, each tagged with a number. It hung at the belt of the Gate Captain. Merrick Dole the porter has wanted it for years."};
/* ---------- the creatures (pictures: ps_c_<id>, painted when it exists, else the kit's stand-in) ---------- */
Object.assign(ENEMY_DEF,{
  psguard:{name:'Pale Guard',hp:84,dmg:[10,16],hit:.87,w:.62,img:'ps_c_psguard',ph:1.8,xp:34,gold:[0,0],speed:1,verb:'cuts',ps:1},
  pshalberd:{name:'Pale Halberdier',hp:128,dmg:[14,22],hit:.85,w:.7,img:'ps_c_pshalberd',ph:2.0,xp:46,gold:[0,0],speed:.7,verb:'hews',ps:1},
  psarcher:{name:'Pale Archer',hp:70,dmg:[10,16],hit:.88,w:.6,img:'ps_c_psarcher',ph:1.7,xp:38,gold:[0,0],speed:1,ranged:3,verb:'looses an arrow at',ps:1},
  pssentinel:{name:'Veiled Sentinel',hp:150,dmg:[14,22],hit:.86,w:.8,img:'ps_c_pssentinel',ph:2.1,xp:60,gold:[0,0],speed:1,verb:'strikes',ps:1,still:1,glow:.15,wake:'The veiled statue lifts its head. The cloth over its face does not move, but it is looking at you.'},
  psgatecaptain:{name:'The Gate Captain',hp:520,dmg:[16,26],hit:.9,w:.85,img:'ps_c_psgatecaptain',ph:2.2,xp:1100,gold:[0,0],speed:1,verb:'cleaves',boss:true,aboveParty:0,ps:1,still:1,glow:.25,wake:'The Gate Captain raises his halberd. "None pass the inner gate," he says, in a voice like a door closing.'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('psgatecaptain');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('psgatecaptain');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.psgatecaptain=[4200,5200];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^ps(guard|halberd|archer|sentinel)/,'shaken',.12],[/^psgatecaptain/,'shaken',.25]);
/* pictures this package asks the art agent for (stand-ins until painted): the clock-tower gate, long banners, buttresses */
for(const [n,h,src] of [['gate_clock',5.0,['gy_crypt','gy_mausoleum']],['banner_long_a',3.2,['hl_p_banner','mw_banner']],['banner_long_b',3.2,['hl_p_banner','mw_banner']],['buttress_a',3.6,['gy_column','gy_crypt']],['buttress_b',3.6,['gy_column','gy_crypt']]])PSP_PICS[n]=[h,src,{}];
/* ---------- small helpers shared by the builders ---------- */
/* a darkened, green-shifted copy of one of the Wenlock room props (bed, table, rack ...) so that it sits in the black and green castle; cached */
function psgToned(key,warm){
  const k='psg_t'+(warm?'w':'')+'_'+key;if(IMG[k])return k;const src=IMG[key];if(!src||!src.width)return key;
  bl3Tint(k,key,warm?'saturate(.8) brightness(.8) contrast(1.05)':'saturate(.4) brightness(.6) contrast(1.1)');return IMG[k]?k:key}
/* a Wenlock room prop by its WLIN_P name, placed with the kit: C2.prop(name,x,y,{block,sc,h,npc}) */
function psgProp(C,name,x,y,o,warm){
  o=o||{};const p=typeof WLIN_P!=='undefined'&&WLIN_P[name];if(!p)return null;const key='wl2_'+p[0];if(!IMG[key])return null;
  if(typeof wlinDefringe==='function')try{wlinDefringe(key)}catch(e){}
  const ratio=(o.h?o.h/p[1]:1)*(o.sc||1),d={block:o.block!==false};if(ratio!==1)d.sc=ratio;const bob=o.bob!==undefined?o.bob:p[3];if(bob)d.bob=bob*ratio;if(o.npc)d.npc=o.npc;
  return C.dec(psgToned(key,warm),x,y,d)}
/* ---------- the castle view stand-in: until the painted castle_view and castle_view_near arrive (assets/ps), a dark gothic castle on its crag is drawn here, once, straight on. ---------- */
function psgDrawCastle(W,H,near){
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),hs=(a,b)=>hash2(a,b,near?31:32),P=PSP_PAL;
  const base=H*.8;
  // the crag: black broken rock under the whole city, fading to mist at the bottom
  x.beginPath();x.moveTo(0,H);for(let i=0;i<=44;i++){const px=i*W/44,e=Math.abs(i/44-.5);x.lineTo(px,base+H*(.02+hs(i,1)*.07)+e*H*.28)}x.lineTo(W,H);x.closePath();
  const rg=x.createLinearGradient(0,base,0,H);rg.addColorStop(0,'#0a0e14');rg.addColorStop(1,'#141c26');x.fillStyle=rg;x.fill();
  // a spire: [centre, width, top of the body, spire height, lean]; bodies are tall and narrow, with a slate-blue moonlit edge on the right
  const S=[[.05,.045,.5,.2,.01],[.11,.05,.38,.3,-.012],[.17,.06,.46,.22,.01],[.24,.05,.3,.36,-.014],[.31,.07,.4,.26,.012],[.39,.05,.24,.42,-.01],[.46,.06,.34,.3,.012],[.54,.12,.14,.62,0],[.62,.06,.32,.3,-.012],[.69,.05,.26,.4,.014],[.76,.07,.4,.26,-.01],[.83,.05,.34,.34,.012],[.9,.06,.44,.24,-.01],[.96,.045,.5,.18,.01]];
  const win=(cx,cy,w,h,lit)=>{x.beginPath();x.moveTo(cx-w/2,cy+h/2);x.lineTo(cx-w/2,cy-h/6);x.quadraticCurveTo(cx-w/2,cy-h/2,cx,cy-h/2);x.quadraticCurveTo(cx+w/2,cy-h/2,cx+w/2,cy-h/6);x.lineTo(cx+w/2,cy+h/2);x.closePath();x.fillStyle=lit?'#e0a050':'#05080c';x.globalAlpha=lit?.9:1;x.fill();x.globalAlpha=1};
  // flying buttresses and bridges between the towers, drawn first so the towers stand in front
  x.strokeStyle='#0c121a';x.lineWidth=Math.max(2,W*.004);for(let i=0;i<S.length-1;i++){const a=S[i],b=S[i+1],ya=base-(base-a[2]*H)*.4,yb=base-(base-b[2]*H)*.45;x.beginPath();x.moveTo(a[0]*W,ya+H*.08);x.quadraticCurveTo((a[0]+b[0])*W/2,Math.min(ya,yb)-H*.05,b[0]*W,yb+H*.08);x.stroke()}
  x.fillStyle='#0c121a';x.fillRect(W*.03,H*.62,W*.94,base-H*.62+2);
  S.forEach(([cx,w,top,sh,lean],k)=>{const px=cx*W,pw=w*W,ty=top*H,spH=sh*H;
    x.save();x.translate(px,base);x.transform(1,0,lean*1.3,1,0,0);x.translate(-px,-base);
    const tg=x.createLinearGradient(px-pw/2,0,px+pw/2,0);tg.addColorStop(0,'#0e141c');tg.addColorStop(.7,'#161e29');tg.addColorStop(1,'#4a6078');x.fillStyle=tg;x.fillRect(px-pw/2,ty,pw,base-ty+2);
    // belts, tiny balconies and pinnacles
    x.fillStyle='#0a0e14';for(let q=0;q<4;q++)x.fillRect(px-pw/2-pw*.06,ty+(base-ty)*(q+1)/5,pw*1.12,H*.008);
    for(const o of [-.5,.5]){x.beginPath();x.moveTo(px+o*pw-pw*.07,ty);x.lineTo(px+o*pw,ty-H*.06);x.lineTo(px+o*pw+pw*.07,ty);x.closePath();x.fillStyle='#0c1218';x.fill()}
    // the spire: slate, very thin and tall, a crocketed edge, a verdigris tip
    const sg=x.createLinearGradient(px-pw/2,0,px+pw/2,0);sg.addColorStop(0,'#0c1218');sg.addColorStop(.75,'#1c2834');sg.addColorStop(1,'#6a8ca6');
    x.beginPath();x.moveTo(px-pw*.55,ty);x.lineTo(px,ty-spH);x.lineTo(px+pw*.55,ty);x.closePath();x.fillStyle=sg;x.fill();
    x.fillStyle='#0c1218';for(let q=1;q<6;q++){const yy=ty-spH*q/6.5,hw=pw*.55*(1-q/6.5);x.fillRect(px+hw-1,yy,3,3)}
    x.fillStyle=P.verdigris;x.fillRect(px-1,ty-spH-H*.025,2,H*.03);x.beginPath();x.arc(px,ty-spH-H*.025,2,0,6.3);x.fill();
    // tiny lit windows, a few
    const n=near?7:4;for(let q=0;q<n;q++){const wyq=ty+H*.04+q*(base-ty-H*.08)/n;win(px+(hs(k,q)-.5)*pw*.45,wyq,Math.max(1.6,pw*.1),H*(near?.045:.038),hs(k,q+9)<.38)}
    x.restore()});
  // the great keep: a round clock-face high up on the central tower
  const kx=.54*W,ky=H*.3;x.fillStyle='#0a0e14';x.beginPath();x.arc(kx,ky,W*.026,0,6.3);x.fill();x.strokeStyle=P.brass;x.lineWidth=Math.max(1.5,W*.002);x.beginPath();x.arc(kx,ky,W*.021,0,6.3);x.stroke();
  for(let a=0;a<12;a++){x.beginPath();x.moveTo(kx+Math.cos(a*.5236)*W*.016,ky+Math.sin(a*.5236)*W*.016);x.lineTo(kx+Math.cos(a*.5236)*W*.02,ky+Math.sin(a*.5236)*W*.02);x.stroke()}
  c._ps=1;return c}
{const _pp=pspPics;pspPics=function(){_pp.apply(this,arguments);
  try{for(const [n,w,h,near] of [['castle_view',1500,470,false],['castle_view_near',1700,520,true]]){const k='ps_'+n;if(!IMG[k]||IMG[k]._ps){IMG[k]=psgDrawCastle(w,h,near);IMG[k]._ps=1;NPC_H[k]=9}}}catch(e){console.error('psg castle',e)}}}

/* ==========================================================================
   PART B: THE PALE APPROACH (9720, 64 x 56, outdoor). The party arrives from Sale's west gate at the foot (32,52) and climbs five legs, each two squares wide, that run east and west
   up the crag. Between two legs lie a retaining wall, three rows of pit (a drop, seen over an iron fence from the lane below) and the fence; the legs are joined by arched stair passages.
   LEGS (lane rows y and y+1): L1 y51 x6..36 (with the landing plaza x28..36 y50..53), L2 y44 x6..52, L3 y37 x12..52, L4 y30 x12..46, L5 y23 x30..46 (the bridgehead x31..33 y22).
   CONNECTORS: x6..7 (L1 to L2), x51..52 (L2 to L3), x12..13 (L3 to L4), x45..46 (L4 to L5). The ravine (y16..21) is crossed by the Long Bridge at x32. North of it the Barbican forecourt
   (causeway x31..33, two bays behind iron fences) leads to the Great Gate at (32,6). A gully with a small bridge cuts L3. Hidden nooks: A (x40..44 y48..50), B (x47..50 y32..35), C (x18..23 y25..28), the cairn niche (x26..29 y27..29).
   Heights: leg k stands at LEG[k][1] (0.3 at the foot, 3.9 at the bridgehead, 4.4 on the forecourt). The castle view (kit sky) grows as the party climbs.
   ========================================================================== */
const PSG_LEG=[[51,.3,6,36],[44,1.2,6,52],[37,2.1,12,52],[30,3.0,12,46],[23,3.9,30,46]];   // lane row y, ground height, x from, x to
const PSG_CONN=[[6,7],[51,52],[12,13],[45,46]];                                              // connector columns between leg k and k+1
function psgBuildApproach(info){
  const W=64,H=56;
  const C=pspMake({id:9720,start:{x:32,y:52,f:0},walled:true,wall:'dark',wh:4.4,floor:'cobble',amb:.62,wind:.25,castle:{at:[32,-40],far:93,near:49,lift:55,lift1:8,h0:48,h1:110},terrace:true});
  const {rows,block,hgt,fm}=C,ix=(x,y)=>y*W+x,hs=C.hs,PAL=PSP_PAL,GR=PAL.green,SI=PAL.silver;
  const wt=(style,wh,x,y)=>C.ch(pspWallGid(style,(hs(x,y,3)*4)|0,wh));
  const paintWall=(x,y,style,wh)=>{if(x>=0&&y>=0&&x<W&&y<H)C.solid(x,y,wt(style,wh,x,y))};
  const open=(x,y)=>rows[y]&&rows[y][x]==='.';
  /* ---- 1. the ground: heights by leg, then everything is rock until carved ---- */
  const hrow=y=>{if(y>=53)return .3;if(y<=15)return 4.4;for(const [ly,h] of PSG_LEG){const o=y-ly;if(o>=-5&&o<=1)return o>=0?h:o===-1?h-.15:h-.7}return 3.9};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)hgt[ix(x,y)]=hrow(y);
  const carve=(x0,y0,x1,y1,f)=>{C.carve(x0,y0,x1,y1);if(f)C.setFloor(x0,y0,x1,y1,f)};
  const unwalk=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)block[ix(x,y)]=1};   // open to the eye, closed to the feet (pits, fence cells, the ravine)
  /* lanes and plaza */
  PSG_LEG.forEach(([y,h,x0,x1])=>carve(x0,y,x1,y+1,'cobble'));
  carve(28,50,36,53,'flag');carve(31,22,33,22,'flag');
  /* connectors (stair passages) */
  [[6,46,7,50,1.2,.3,45,51],[51,39,52,43,2.1,1.2,38,44],[12,32,13,36,3.0,2.1,31,37],[45,25,46,29,3.9,3.0,24,30]].forEach(([a,b,c,d,hN,hS,ry0,ry1])=>{carve(a,b,c,d,'flag');C.rise(a,ry0,c,ry1,hN,hS,'y')});
  /* bands between the legs: fence row, three pit rows, the retaining wall row */
  const band=k=>{const [y,h,x0,x1]=PSG_LEG[k],[y2,h2,u0,u1]=PSG_LEG[k+1];const a=Math.max(x0,u0),b=Math.min(x1,u1),cs=PSG_CONN[k];
    const cells=[];for(let x=a;x<=b;x++){if(x>=cs[0]&&x<=cs[1])continue;cells.push(x)}return {y,h,y2,h2,cells}};
  const B=[0,1,2,3].map(band);
  B.forEach(bd=>{for(const x of bd.cells){
    carve(x,bd.y-1,x,bd.y-1,'flagdark');unwalk(x,bd.y-1,x,bd.y-1);   // the fence cell
    carve(x,bd.y-4,x,bd.y-2,'wet');unwalk(x,bd.y-4,x,bd.y-2);        // the pit
    carve(x,bd.y-5,x,bd.y-5);                                       // (the retaining wall is painted back below)
  }});
  /* ---- 2. the ravine, the Long Bridge, the Barbican forecourt ---- */
  C.ravine(4,16,59,21,2.6,'wet');
  for(const x of [35,36,37,38,39,40,41,42,43,44,45,46]){carve(x,22,x,22,'flagdark');unwalk(x,22,x,22)}   // L5's fence over the ravine
  carve(30,22,30,22,'flagdark');unwalk(30,22,30,22);carve(34,22,34,22,'flagdark');unwalk(34,22,34,22);
  C.bridge(32,16,32,21,{h:4.1,floor:'flag'});
  carve(31,7,33,15,'flagdark');                                                                     // the causeway
  carve(25,8,29,14,'gravel');carve(35,8,39,14,'gravel');                                           // the two bays
  for(let y=7;y<=15;y++)for(const x of [30,34]){if(y===10||y===13)continue;carve(x,y,x,y,'flagdark');unwalk(x,y,x,y)}   // iron fences between causeway and bays (two gaps each)
  carve(30,10,30,10,'flagdark');carve(30,13,30,13,'flagdark');carve(34,10,34,10,'flagdark');carve(34,13,34,13,'flagdark');
  for(const [x,y] of [[30,15],[34,15]])carve(x,y,x,y,'flagdark');
  carve(25,15,29,15,'gravel');carve(35,15,39,15,'gravel');unwalk(25,15,29,15);unwalk(35,15,39,15);                  // the south edge of each bay is a balustrade over the ravine
  /* the gully that cuts L3, with its own small bridge */
  C.ravine(29,37,31,38,2.2,'wet');C.bridge(29,37,31,37,{h:2.1,floor:'flag'});
  /* ---- 3. nooks ---- */
  carve(40,48,44,50,'flagdark');carve(42,46,42,47,'cobble');                  // A
  carve(47,32,50,35,'flagdark');carve(48,36,48,36,'cobble');                  // B
  carve(18,25,23,28,'flagdark');carve(20,29,20,29,'cobble');                  // C
  carve(26,27,29,29,'flagdark');                                               // the cairn niche
  /* ---- 4. the walls: every rock cell beside open ground is dressed, retaining walls are low ---- */
  const near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const SET=['ash','ash','ivy','brick','moss','ash','ivy','brick'];
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(open(x,y)||!near(x,y))continue;
    const r=hs(x,y,9);let st=SET[(r*SET.length)|0];if(r>.89)st='win';paintWall(x,y,st,4.4)}
  B.forEach(bd=>{for(const x of bd.cells){const wh=bd.h2-(bd.h-.7)+.6,r=hs(x,bd.y,12);
    paintWall(x,bd.y-5,r<.35?'ivy':r<.6?'moss':r<.8?'brick':'ash',wh)}});
  /* castle foundation wall on the north bank of the ravine (low, so the sky shows over it), and the gate wall with its towers */
  for(let x=4;x<=59;x++){if(x>=25&&x<=39)continue;if(open(x,15))continue;paintWall(x,15,hs(x,15,5)<.5?'ash':'brick',2.0)}
  for(let x=24;x<=40;x++)paintWall(x,6,(x%4===0)?'pier':'ash',5.0);
  for(const [a,b] of [[24,28],[36,40]])for(let x=a;x<=b;x++)for(let y=2;y<=7;y++)if(!open(x,y)){paintWall(x,y,y===4&&x%2===0?'win':(y<=3?'pier':'ash'),5.1)}
  for(let x=25;x<=39;x++)if(!open(x,7))paintWall(x,7,x%3===0?'win':'ash',5.0);
  /* ---- 5. the doors (the contract table): back to Sale, the Great Gate ---- */
  C.links({style:{'Sale':'gate','Great Gate':'great'}});
  /* ---- 6. dressing ---- */
  const pit=(x,y)=>block[ix(x,y)]&&open(x,y);
  const lamp=(x,y,col)=>{C.dec('gy_lantern',x,y,{block:false});C.light(x,y,col||SI)};
  const FENCE=['iron_fence_a','iron_fence_b'];
  B.forEach((bd,k)=>{
    bd.cells.forEach((x,i)=>{
      C.prop(FENCE[(x+k)&1],x,bd.y-1,{block:false,maxW:1.02});
      for(let y=bd.y-4;y<=bd.y-2;y++){const r=hs(x,y,41);
        if(r<.16)C.prop('rose_pale',x,y,{block:false,sc:.9+hs(x,y,42)*.4});
        else if(r<.27)C.prop('ivy_clump',x,y,{block:false});
        else if(r<.34)C.prop('moss_rock',x,y,{block:false});
        else if(r<.38)C.dec('gy_bones',x,y,{block:false,sc:.7});
        else if(r<.42)C.dec('gy_dead',x,y,{block:false,sc:.9+hs(x,y,43)*.4})}
      if(hs(x,bd.y,44)<.34)C.picture(hs(x,bd.y,45)<.5?'vine_a':'vine_b',x,bd.y-4,[0,-1]);   // vines hang down the retaining wall
      if(i%9===4){C.alcove(x,bd.y-4,['alcove_weeper','alcove_monk','alcove_knight','alcove_maiden'][(i+k)&3],[0,-1])}
      if(i%8===2){lamp(x,bd.y-1);}
      if(i%11===5)C.light(x,bd.y-3,[.35,.9,.5])});   // a cold glow far down in the pit
  });
  for(let x=35;x<=46;x++)C.prop(FENCE[x&1],x,22,{block:false,maxW:1.02});
  for(let x=5;x<=58;x+=3){if(x>=28&&x<=36)continue;C.prop('rose_pale',x,17+((x/3)&3),{block:false,sc:.8})}     // the ravine: wild roses on its ledges
  for(let x=6;x<=58;x+=5){if(x>=26&&x<=38)continue;C.dec('gy_dead',x,18+((x/5)&3),{block:false,sc:1+hs(x,5,2)*.4})}
  for(const x of [10,18,26,38,46,54])C.light(x,19,[.3,.8,.5]);
  /* the plaza: Pilgrim's Landing */
    C.prop('st_veiled',30,53,{block:true});C.prop('st_headless',34,53,{block:true});
  C.sign(33,53,[0,1],'THE PALE ROAD','To the castle of the Pale Sovereign');C.sign(31,53,[0,1],'SALE','Back through the west gate');
  lamp(28,50);lamp(36,50);lamp(28,53,SI);lamp(36,53,SI);
  C.vines(29,53,{});C.vines(35,53,{});C.prop('urn_big',28,53,{block:true});C.prop('urn_big',36,53,{block:true});
  C.grave(36,51,'psg_waymark',['THE PALE SPIRE','CASTLE OF THE','PALE SOVEREIGN'],{h:1.25,npc:'psg_waymark'});
  /* L1 */
  C.archway(24,51,'arch_ivy');C.archway(14,52,'arch_iron');
  for(const x of [10,18,22])C.alcove(x,52,['alcove_monk','alcove_weeper','alcove_empty'][x%3],[0,1]);
  lamp(8,51);lamp(26,52);lamp(16,51);C.prop('st_hand',20,51,{block:true});
  /* connector 1 */
  C.archway(6,48,'arch_stair');C.vineWall(6,46,6,50,[-1,0]);C.vines(7,47,{});lamp(7,49);
  /* L2 */
  C.archway(15,44,'arch_high');C.archway(30,45,'arch_ivy');C.archway(44,44,'arch_low');
  C.prop('well_pale',24,45,{block:true});C.prop('cart_old',38,45,{block:true});
  for(const x of [9,20,34,47])C.alcove(x,45,['alcove_maiden','alcove_knight','alcove_empty','alcove_weeper'][(x>>2)&3],[0,1]);
  C.vineWall(8,44,10,44,[0,-1]);lamp(12,44);lamp(27,45);lamp(41,44);lamp(48,45);C.prop('st_gargoyle',32,44,{block:true});
  /* connector 2 */
  C.archway(51,41,'arch_stair');C.vineWall(52,39,52,43,[1,0]);C.vines(51,40,{});lamp(51,42);
  /* L3 */
  C.archway(20,37,'arch_high');C.archway(40,38,'arch_ivy');C.archway(47,37,'arch_low');
  for(const x of [15,25,36,43])C.alcove(x,38,['alcove_knight','alcove_maiden','alcove_weeper','alcove_monk'][(x>>1)&3],[0,1]);
  lamp(18,38);lamp(34,37);lamp(44,38);C.prop('statue_plinth',24,38,{block:true});C.prop('rose_arch',38,37,{block:false});
  /* connector 3 */
  C.archway(12,34,'arch_stair');C.vineWall(12,32,12,36,[-1,0]);C.vines(13,33,{});lamp(13,35);
  /* L4 */
  C.archway(17,30,'arch_ivy');C.archway(38,31,'arch_high');
  for(const x of [14,22,33,42])C.alcove(x,31,['alcove_empty','alcove_knight','alcove_maiden','alcove_monk'][(x>>1)&3],[0,1]);
  lamp(16,30);lamp(31,31);lamp(40,30);C.vineWall(14,30,16,30,[0,-1]);C.prop('st_veiled',34,31,{block:true});
  /* the cairn niche (quest psq1) */
  C.thing('gy_mound','psg_cairn',27,28,{sc:1.6});
  for(const [dx,dy,k] of [[-1,0,'bl_stone1'],[1,1,'bl_lean'],[0,-1,'bl_stone2']])C.dec(k,27+dx,28+dy,{block:true,sc:.7});
  C.picture('alcove_weeper',27,27,[0,-1]);lamp(26,29);C.vines(29,27,{});
  /* connector 4 */
  C.archway(45,27,'arch_stair');C.vineWall(46,25,46,29,[1,0]);C.vines(45,26,{});lamp(46,28);
  /* L5 and the bridgehead */
  C.archway(38,23,'arch_ivy');C.archway(32,22,'arch_high');
  for(const x of [34,41,44])C.alcove(x,24,['alcove_knight','alcove_weeper','alcove_maiden'][x%3],[0,1]);
  lamp(31,24);lamp(36,23);lamp(43,24);C.vines(31,22,{});C.vines(33,22,{});C.prop('urn_big',31,23,{block:true});C.prop('urn_big',33,23,{block:true});
  C.sign(30,23,[-1,0],'THE LONG BRIDGE','Keep to the middle. The rail is old.');
  /* the Long Bridge: lamps on the rails, a statue at each end, arches below the deck are drawn by the kit */
  for(const y of [17,20]){C.dec('gy_lantern',31,y,{block:false});C.light(31,y,GR);C.dec('gy_lantern',33,y,{block:false});C.light(33,y,GR)}
  C.light(32,18,SI);C.light(32,21,SI);
  /* the forecourt */
  C.archway(32,12,'arch_high');C.archway(32,9,'arch_iron');
  for(const y of [8,11,14]){for(const x of [30,34]){if(open(x,y)&&block[ix(x,y)])C.prop(FENCE[(x+y)&1],x,y,{block:false,maxW:1.02})}}
  for(let y=7;y<=15;y++)for(const x of [30,34]){if(open(x,y)&&block[ix(x,y)]&&!C.decor.some(d=>d.x===x&&d.y===y))C.prop(FENCE[(x+y)&1],x,y,{block:false,maxW:1.02})}
  for(const x of [25,26,27,28,29,35,36,37,38,39])C.prop(FENCE[x&1],x,15,{block:false,maxW:1.02});
  C.prop('st_veiled',27,11,{block:true});C.prop('st_headless',37,11,{block:true});
  for(const [x,y] of [[26,12],[28,9],[36,9],[38,12]])C.prop('rose_pale',x,y,{block:true,sc:1.1});
  C.prop('urn_big',25,8,{block:true});C.prop('urn_big',39,8,{block:true});
  for(const [x,y] of [[31,8],[33,8],[31,14],[33,14]]){lamp(x,y)}
  C.picture('window_great',25,8,[0,-1]);C.picture('window_great',39,8,[0,-1]);
  /* the clock-tower gate arch: a round clock face high over the door, two long banners hanging beside it */
  C.prop('clock_face',32,7,{block:false,bob:2.3});C.prop('banner_long_a',31,7,{block:false,bob:.3});C.prop('banner_long_b',33,7,{block:false,bob:.3});C.light(32,8,PAL.brassHi?[1.1,.8,.45]:SI);
  C.vineWall(26,8,28,8,[0,-1]);C.vineWall(36,8,38,8,[0,-1]);C.light(27,11,GR);C.light(37,11,GR);
  C.sign(31,7,[0,-1],'THE GREAT GATE','Castle of the Pale Sovereign');
  /* canyon street: buttresses lean against the lane walls, spaced along each leg */
  for(const [y,xs] of [[52,[10,14,24]],[45,[10,18,26,36,42,48]],[38,[14,22,30,45,50]],[31,[14,20,26,32,41,44]],[24,[33,39,45]]])for(const x of xs)C.prop(x%2?'buttress_a':'buttress_b',x,y,{block:false});
  /* ---- 7. hidden nooks ---- */
  C.vines(42,46,{});C.vines(42,47,{});C.prop('alcove_empty',42,48,{block:false});
  C.alcove(41,48,'alcove_weeper',[0,-1]);C.alcove(43,48,'alcove_monk',[0,-1]);C.chest(42,50,{tier:1});C.light(42,49,GR);C.prop('st_hand',40,49,{block:true});C.prop('urn_big',44,49,{block:true});
  C.vines(48,36,{});C.alcove(48,32,'alcove_knight',[0,-1]);C.alcove(49,32,'alcove_maiden',[0,-1]);C.chest(50,35,{tier:1});C.light(48,34,GR);C.prop('st_gargoyle',47,34,{block:true});C.vineWall(47,33,47,35,[-1,0]);
  C.vines(20,29,{});C.alcove(19,25,'alcove_weeper',[0,-1]);C.alcove(22,25,'alcove_empty',[0,-1]);C.chest(23,28,{tier:1});C.light(20,27,GR);
  C.prop('col_twist',19,27,{block:true});C.prop('col_twist',22,27,{block:true});C.prop('statue_plinth',20,25,{block:true});
  /* ---- 8. the people and the things ---- */
  const nearWalk=(x,y)=>{for(let r=0;r<=3;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const a=x+dx,b=y+dy;if(C.free(a,b)&&!block[ix(a,b)])return [a,b]}return null};
  const TOK=[[35,52,'gy_ring'],[12,51,'gy_locket'],[7,48,'gy_rose'],[20,45,'gy_book'],[44,48,'gy_bell'],[40,38,'ww_ribbon'],[50,34,'ww_boot'],[38,31,'gy_ring'],[26,12,'ww_crumbs']];
  TOK.forEach(([x,y,k],i)=>{const q=nearWalk(x,y);if(q)C.dec(k,q[0],q[1],{block:true,npc:'psg_tok'+i,sc:1.7})});
  C.chest(41,45,{tier:1});
  const FOE=(t,x,y)=>{const q=nearWalk(x,y);return q?pspFoe(C,t,q[0],q[1]):false},WAKE=(t,x,y)=>{const q=nearWalk(x,y);return q?pspStatueWake(C,t,q[0],q[1]):false};
  /* creatures: guards and halberdiers on the legs, archers in the forecourt bays, veiled sentinels in alcoves and nooks */
  FOE('psguard',17,52);FOE('psguard',30,44);FOE('psguard',26,38);FOE('psguard',16,30);FOE('psguard',40,24);FOE('psguard',32,11);FOE('psguard',12,34);
  FOE('pshalberd',42,44);FOE('pshalberd',44,38);FOE('pshalberd',37,30);FOE('pshalberd',32,13);
  for(const [x,y] of [[26,10],[38,10],[26,13],[38,13]])FOE('psarcher',x,y);
  for(const [x,y] of [[10,44],[49,33],[21,27],[43,49]])WAKE('pssentinel',x,y);
  C.glow(6.5,SI);
  const lv=C.finish({start:{x:32,y:52,f:0}});
  lv.mapNames=[{t:"Pilgrim's Landing",x:32,y:51,k:'place'},{t:'The Long Climb',x:20,y:45,k:'place'},{t:'The Gully Bridge',x:30,y:37,k:'place'},{t:"The Pilgrims' Cairn",x:27,y:28,k:'place'},{t:'The Long Bridge',x:32,y:19,k:'place'},{t:'The Barbican',x:32,y:12,k:'place'},{t:'The Great Gate',x:32,y:7,k:'place'}];
  return lv}
pspRegister(9720,psgBuildApproach);
/* ==========================================================================
   PART C: THE INTERIORS. All are made with pspMake (indoor). Walls are dressed by psgDressWalls: black stone, brick, ivy and moss, with tall green lancet windows.
   ========================================================================== */
/* dress every wall square that touches open floor: style by a hash, tall lancet windows now and then. opt: {wh, set, win (chance), skip(x,y)} */
function psgDressWalls(C,opt){
  opt=opt||{};const W=C.W,H=C.H,wh=opt.wh||C.wh,SET=opt.set||['ash','ash','brick','ivy','moss','brick'],hs=C.hs;
  const open=(x,y)=>C.rows[y]&&C.rows[y][x]==='.';
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(open(x,y))continue;
    let n=false;for(let dy=-1;dy<=1&&!n;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy)){n=true;break}
    if(!n||(opt.skip&&opt.skip(x,y)))continue;
    const r=hs(x,y,17);let st=SET[(r*SET.length)|0];if(r>1-(opt.win||.07)&&!(x%2))st='win';
    C.solid(x,y,C.ch(pspWallGid(st,(hs(x,y,3)*4)|0,wh)))}}
const psgWin=(C,list,wh)=>{for(const [x,y] of list)C.solid(x,y,C.ch(pspWallGid('win',(x+y)&3,wh||C.wh)))};
/* ===== 9721 THE GREAT GATEHOUSE (32 x 24): the passage (x15..17), west guardroom (door to the lodge at 7,19), east guardroom (stair to the loft at 26,8), the gate chapel and the gaoler's closet ===== */
function psgBuildGatehouse(){
  const C=pspMake({id:9721,start:{x:16,y:19,f:0},wh:4.0,floor:'flagdark',wall:'ash',amb:.17,lcol:PSP_PAL.silver}),SI=PSP_PAL.silver,GR=PSP_PAL.green;
  C.room(15,3,17,21,{floor:'flagdark',name:'The Passage',at:[16,14]});
  C.room(4,12,12,18,{floor:'flag',name:'The West Guardroom',at:[8,15]});C.room(4,9,6,11,{floor:'straw',name:'The Bunks',at:[5,10]});
  C.room(20,9,28,18,{floor:'flag',name:'The East Guardroom',at:[24,14]});
  C.room(8,4,12,7,{floor:'marble',name:'The Gate Chapel',at:[10,5]});C.room(20,3,24,6,{floor:'wet',name:"The Gaoler's Closet",at:[22,5]});
  C.carve(13,14,14,15);C.carve(18,14,19,15);C.carve(13,6,14,6);C.carve(18,5,19,5);
  psgDressWalls(C,{wh:4.0,win:.0});
  psgWin(C,[[3,14],[3,16],[9,11],[29,11],[29,13],[29,15],[29,17],[10,3],[22,2],[16,1]],4.0);
  C.links({style:{'Court':'great','stair up':'stair'}});
  const P=(n,x,y,o)=>psgProp(C,n,x,y,o),dec=(k,x,y,o)=>C.dec(k,x,y,o);
  /* the passage: plaques, a portcullis held high, murder holes, banners, arches to walk under */
  C.sign(15,5,[-1,0],'THE GREAT GATEHOUSE','Castle of the Pale Sovereign');C.sign(17,7,[1,0],'NO ARMS BEYOND THE INNER GATE','By order of the Gate Captain');
  C.sign(15,8,[-1,0],'MURDER HOLES ABOVE','Do not stand under them');C.sign(17,9,[1,0],'MURDER HOLES ABOVE','Do not stand under them');
  C.sign(15,20,[-1,0],'THE OUTER GATE','Closed at dusk. It has not been dusk for years.');
  C.prop('arch_iron',16,12,{block:false});C.archway(16,8,'arch_high');C.archway(16,16,'arch_high');C.archway(16,4,'arch_low');
  for(const [x,y,w] of [[15,10,[-1,0]],[17,11,[1,0]],[15,13,[-1,0]],[17,18,[1,0]]])dec(psgToned('wl2_hall_0'),x,y,{block:false,wd:w,pic:1,bob:.5});
  C.alcove(15,17,'alcove_knight',[-1,0]);C.alcove(17,17,'alcove_weeper',[1,0]);C.alcove(15,19,'alcove_monk',[-1,0]);
  C.vineWall(15,3,15,4,[-1,0]);C.vineWall(17,3,17,4,[1,0]);C.vines(16,6,{});
  for(const y of [6,10,14,18])C.light(16,y,y%8===6?SI:GR);
  C.picture('lantern_bracket',15,15,[-1,0]);C.picture('lantern_bracket',17,15,[1,0]);
  pspStatueWake(C,'psgatecaptain',16,11);pspFoe(C,'psguard',16,6);pspFoe(C,'psguard',16,15);
  /* the west guardroom: racks, a cold hearth, a table, bunks in their alcove */
  for(const x of [5,7,11])P('weaponrack',x,12);C.prop('hearth_cold',9,12,{block:true});
  P('longtable',8,15);dec('gy_bench',10,17,{block:false});dec('gy_bench',8,13,{block:false});
  P('bed',4,10);P('bed',6,10);P('shields',4,12,{bob:.3});dec('barrel',12,18,{});dec('crate',11,18,{sc:.9});dec('sacks',12,14,{});
  C.vineWall(4,9,6,9,[0,-1]);C.alcove(10,18,'alcove_empty',[0,1]);
  for(const [x,y] of [[7,13],[11,15],[5,16],[9,17]])C.light(x,y,SI);C.light(5,10,GR);
  pspFoe(C,'psguard',5,13);pspFoe(C,'psguard',11,15);pspFoe(C,'pshalberd',12,12);pspFoe(C,'psarcher',4,16);
  /* the east guardroom: racks, mannequins, a duty table, the stair up */
  for(const x of [21,23,28])P('weaponrack',x,9);P('mannequin',21,13);P('mannequin',28,13);
  P('counciltable',24,14);dec('gy_bench',24,16,{block:false});dec('gy_bench',24,12,{block:false});
  C.prop('col_fluted',22,16,{block:true});C.prop('col_fluted',27,16,{block:true});dec('barrel',28,18,{});dec('crate',27,18,{sc:.9});C.chest(21,18,{tier:0});
  C.alcove(23,9,'alcove_knight',[0,-1]);C.vines(26,9,{});C.sign(24,9,[0,-1],'STAIR TO THE WINCH LOFT','Winch and chains. Guards at work.');
  for(const [x,y] of [[22,11],[27,12],[22,17],[26,17]])C.light(x,y,SI);
  pspFoe(C,'psguard',22,11);pspFoe(C,'pshalberd',25,16);pspFoe(C,'psarcher',28,15);pspFoe(C,'psarcher',28,17);pspFoe(C,'psguard',22,14);
  C.sign(9,18,[0,1],"PORTER'S LODGE",'Knock before you enter');
  /* the gate chapel: an altar under a green window, two pews, a monk in his niche */
  C.prop('altar',10,5,{block:true});C.picture('window_stained',10,4,[0,-1]);C.prop('pews',9,7,{block:true});C.prop('pews',11,7,{block:true});C.alcove(8,5,'alcove_monk',[-1,0]);C.vines(12,5,{});
  C.light(10,6,GR);C.cand(12,7,GR);
  /* the gaoler's closet: a cage, bones, a chest, a face in the wall */
  C.prop('cage',22,4,{block:true});dec('gy_bones',23,6,{block:false,sc:.9});dec('gy_bones',21,5,{block:false,sc:.6});C.chest(24,5,{tier:1});C.alcove(20,4,'alcove_empty',[-1,0]);C.picture('chains',24,4,[1,0]);C.light(22,5,GR);
  C.glow(6,SI);
  return C.finish({start:{x:16,y:19,f:0}})}
pspRegister(9721,psgBuildGatehouse);
/* ===== 9722 THE WINCH LOFT (20 x 18): the stair hall, the murder-hole floor, the great winch, the Warden's table with his horn, a gallery ===== */
function psgBuildLoft(){
  const C=pspMake({id:9722,start:{x:4,y:9,f:1},wh:3.6,floor:'flagdark',wall:'ash',amb:.15,lcol:PSP_PAL.green}),SI=PSP_PAL.silver,GR=PSP_PAL.green;
  C.room(3,7,6,11,{floor:'flagdark',name:'The Stair',at:[4,9]});
  C.room(7,8,16,10,{floor:'flag'});C.setFloor(9,8,14,10,'grate');C.mapNames.push({t:'The Murder-Hole Floor',x:11,y:9,k:'place'});
  C.room(13,3,17,14,{floor:'flagdark',name:'The Winch',at:[15,6]});
  C.room(6,12,11,15,{floor:'flag',name:"The Warden's Table",at:[8,13]});C.carve(8,11,9,11);
  C.room(7,4,11,6,{floor:'marble',name:'The Gallery',at:[9,5]});C.carve(9,7,9,7);
  psgDressWalls(C,{wh:3.6,win:.0});
  psgWin(C,[[18,5],[18,8],[18,11],[9,3],[11,3],[5,13],[6,16]],3.6);
  C.links({style:{'stair':'stair'}});
  const P=(n,x,y,o)=>psgProp(C,n,x,y,o),dec=(k,x,y,o)=>C.dec(k,x,y,o);
  C.sign(8,4,[0,-1],'THE MURDER HOLES','They open on the passage below');C.sign(4,7,[0,-1],'THE WINCH LOFT','Keep the chains clear');
  P('spinwheel',15,8,{h:2.4});for(const [x,y] of [[14,5],[16,11],[14,12]])dec('hl_p_chains',x,y,{block:false,sc:1.2});
  dec('wm_chain',8,5,{block:false});dec('wm_chain',16,5,{block:false,sc:1.1});C.prop('col_twist',13,5,{block:true});C.prop('col_twist',17,5,{block:true});C.prop('col_twist',13,12,{block:true});C.prop('col_twist',17,12,{block:true});
  /* the table and the dead Road Warden: his bones, his coat, and his horn */
  P('counciltable',8,14);dec('gy_bones',7,14,{block:false,sc:1.6});dec('gy_bones',10,14,{block:false,sc:1});
  dec('gy_bell',9,13,{npc:'psg_horn',sc:1.5,block:true});
  C.sign(8,15,[0,1],'A ROAD WARDEN',"His horn is on the table");
  C.chest(11,5,{tier:1});dec('barrel',17,13,{});dec('crate',16,13,{sc:.9});dec('sacks',6,5,{});dec('barrel',6,11,{sc:.9});
  P('weaponrack',7,15);P('weaponrack',10,15);C.alcove(6,13,'alcove_monk',[-1,0]);C.vineWall(3,7,3,11,[-1,0]);C.vines(9,7,{});
  for(const [x,y] of [[8,5],[15,4],[16,13],[8,13],[11,9],[4,9]])C.light(x,y,y>12?SI:GR);
  pspFoe(C,'psguard',14,4);pspFoe(C,'psguard',15,12);pspFoe(C,'pshalberd',11,9);pspFoe(C,'pshalberd',15,6);
  C.glow(6,SI);
  return C.finish({start:{x:4,y:9,f:1}})}
pspRegister(9722,psgBuildLoft);
/* ===== 9723 THE PORTER'S LODGE (18 x 14, REST ROOM): warm candlelight, a bed, a stove with a kettle, a chest of potions, Merrick Dole ===== */
function psgBuildLodge(){
  const WARM=PSP_PAL.warm;
  const C=pspMake({id:9723,start:{x:9,y:4,f:2},wh:2.7,floor:'flag',wall:'panel',amb:.5,lcol:WARM}),dec=(k,x,y,o)=>C.dec(k,x,y,o);
  C.room(7,3,11,6,{floor:'runner',name:"The Porter's Lodge",at:[9,9],warm:true});C.room(3,7,14,11,{floor:'flag',warm:true});
  psgDressWalls(C,{wh:2.7,set:['panel','brick','panel','ash'],win:.0});
  psgWin(C,[[4,6],[13,6],[2,9],[15,9],[9,2]].filter(q=>!(q[0]===9&&q[1]===2)),2.7);
  C.links({});
  const P=(n,x,y,o)=>psgProp(C,n,x,y,o,true);
  P('cothearth',13,7);P('cot',6,8);P('dresser',4,10);P('dresser',4,11);P('pietable',9,9);dec('gy_bench',9,11,{block:false});dec('gy_bench',9,7,{block:false});
  P('rocker',12,9);P('clock',14,9);P('coatrack',7,3);dec('barrel',14,11,{});dec('sacks',13,11,{});dec('hl_p_candle',7,10,{sc:.9,block:false});dec('hl_p_candle',11,10,{sc:.9,block:false});
  C.vines(7,5,{});C.vines(11,5,{});
  C.sign(10,3,[0,-1],"THE PORTER'S LODGE",'Rest here. Nothing hostile comes in.');
  C.person('psg_porter',10,8,2);
  pspRest(C,{x0:3,y0:3,x1:14,y1:11,bed:[4,8],chest:[13,10],name:"The Porter's Lodge",line:'The Porter\'s Lodge. It is warm, and it smells of tea. Nothing hostile comes in here.'});
  return C.finish({start:{x:9,y:4,f:2}})}
pspRegister(9723,psgBuildLodge);
/* ==========================================================================
   PART D: PEOPLE, QUESTS AND OBJECTS. Flags in G.flags.psp: tok (bitmask of the nine pilgrims' tokens taken), horn (the Warden's Horn taken), cap (Gate Captain dead), ring (key ring taken), sketch (given),
   seen9720 .. seen9723 (first arrival lines). Quests psq1 The Pilgrims' Offerings and psq2 The Captain's Key Ring, both given by Merrick Dole (psg_porter).
   ========================================================================== */
ITEMDEF.pssketch={n:"Merrick's Sketch of the Castle",k:'quest',t:'Lore',ic:'book',c:'#c8c0a8',stack:1,price:0,sw:.05,d:"A porter's sketch on the back of a ledger page. The gatehouse is at the bottom, then the Court of Statues, then the great house. The Great Hall is in the middle of the north range, the kitchens and armoury are in the west wing, the chapel, cloister and library are in the east wing, and the dungeons run down under the kitchens. The upper floors are marked: LOCKED, KEYS WITH THE SACRISTAN."};
const psgTok=()=>{let m=psgF().tok|0,n=0;for(let i=0;i<9;i++)if(m&(1<<i))n++;return n};
const PSG_TOK_NAMES=['a blue hair ribbon','a horn button','a bent silver penny','a child\'s wooden bird','a cracked clay whistle','a small iron key','a scrap of red cloth with a name sewn on it','a pewter pilgrim badge','a lock of grey hair tied with thread'];
bl3Q('psq1',"The Pilgrims' Offerings",'Merrick Dole, the porter',[
  ['Find the nine tokens that pilgrims left on the Pale Approach and in the barbican (the cairn on the road shows where to start), and bring them to Merrick Dole the porter in his lodge in the gatehouse.',()=>bagCount('pstoken')>=9,['psg_cairn','psg_tok0','psg_tok1','psg_tok2','psg_tok3','psg_tok4','psg_tok5','psg_tok6','psg_tok7','psg_tok8']]],
  {gold:3000,xp:20000,items:['potion6','potion6']},{take:{pstoken:9}});
bl3Q('psq2',"The Captain's Key Ring",'Merrick Dole, the porter',[
  ['Defeat the Gate Captain in the passage of the Great Gatehouse, and bring his key ring to Merrick Dole the porter.',()=>bagCount('pskeyring')>=1,['psgatecaptain']]],
  {gold:4000,xp:25000,items:['potion6','potion6','potion6']},{take:{pskeyring:1}});
for(const q of ['psq1','psq2'])QAREA[q]=PSP.REGION;
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx});   // where the quest ring points
  QRF.T.psq1={give:[N(9723,'psg_porter')],act:[N(9720,'psg_cairn','psg_tok0','psg_tok1','psg_tok2','psg_tok3','psg_tok4','psg_tok5','psg_tok6','psg_tok7','psg_tok8')],ready:[N(9723,'psg_porter')]};
  QRF.T.psq2={give:[N(9723,'psg_porter')],act:[E(9721,/^psgatecaptain$/)],ready:[N(9723,'psg_porter')]}}
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes(PSP.REGION))QAREA_ORDER.push(PSP.REGION);
if(typeof QWORLD!=='undefined'&&!QWORLD[PSP.REGION])QWORLD[PSP.REGION]='wenlock';
const PSG_Q={
  psq1:{offer:"There is a cairn on the road below the gate. Pilgrims left things on it for luck, and for the dead, for as long as there have been pilgrims. None of the pilgrims who left them came back. Nine of the small things are lying about on the road and in the barbican now, where they fell or were kicked, and it troubles me that they are lying in the dirt. Would you gather them and bring them to me? I will put them back on the cairn myself, when the road is quiet.",
    accept:"Thank you. Look along the road, in the barbican and behind the dead trees. They are small, so look low. The cairn is on the west side of the road, a little way up from where you came in.",
    remind:()=>'You have '+bagCount('pstoken')+' of the nine tokens. Look along the road and in the barbican. The cairn is on the west side of the road.',
    ready:"That is nine. I counted them twice. Look at them: a ribbon, a button, somebody's whistle. Somebody was very fond of each of these.",
    thanks:"Thank you. I will set them on the cairn tonight. You have earned the chapel's directions, too: from the courtyard, go through the Great Door, then east through the Banqueting Hall to the wing with the cloister. The chapel is at the far end, behind the garth. Mind the choir. Here, take this, from the gatehouse stores.",
    after:"The tokens are back on the cairn. I go down to look at them every evening, if the road is quiet. It is very seldom quiet."},
  psq2:{offer:"There is a thing I would ask, if you are going to be fighting him anyway. The Gate Captain has the key ring of the gatehouse: the guardrooms, the stores, the lodge, the loft, the lot. I was porter here for thirty years and I have not touched my own keys since he took them. He stands in the passage, under the inner portcullis, and he does not let anyone by. Bring me the ring, if you can.",
    accept:"Thank you. He is slow, but he hits like a falling door. He wakes when you come within two paces of him. Do not stand in the middle of the passage and hope.",
    remind:()=>bagCount('pskeyring')>0?'You have the key ring. Bring it to me, in the lodge.':'The Gate Captain stands in the passage of the gatehouse, under the inner portcullis. He keeps the key ring on his belt.',
    ready:"That is my ring. Number one is the lodge. Number two is the loft. Number three, I never found out. Thank you.",
    thanks:"Thank you. I shall sleep with it under the pillow. Take these, from the stores. They are not much, but nobody else is going to use them.",
    after:"The key ring hangs on its nail again. It is the first time in years that a thing has been where it ought to be."}};
const PSG_PORTER_FACE='kh_ohfolk6_2';
khNpc('psg_porter','Merrick Dole, the porter',PSG_PORTER_FACE,d=>psgPorterTalk(),{sc:1});
{const dsc=Object.getOwnPropertyDescriptor(QGIVER,'psg_porter');
  Object.defineProperty(QGIVER,'psg_porter',{enumerable:true,configurable:true,get(){const l=[];for(const q of ['psq1','psq2'])if(qSt(q)!=='done')l.push(q);return l.length?l:null}})}
function psgPorterTalk(){
  const F=psgF(),opts=[];
  for(const q of ['psq1','psq2']){const st=qSt(q);if(st==='done')continue;
    if(qReady(q))return qNode(q,PSG_Q[q]);
    opts.push([st==='active'?(q==='psq1'?'About the pilgrims\' tokens.':'About the key ring.'):(q==='psq1'?'Is something troubling you?':'Do you need anything fetched?'),()=>qNode(q,PSG_Q[q])])}
  const back=()=>psgPorterTalk();
  const intro=F.metPorter?"Back again. The kettle is on, and the bed is made. Nothing comes in here. Ask what you like.":"(An old man in a porter's coat, with a ring of small tin tags at his belt and a kettle on the stove, looks up from his chair.) You are alive. I had stopped expecting that. I am Merrick Dole, porter of this gate. I stayed when the rest went up the stairs, or were taken, and nobody has told me to stop. Sit down. Nothing hostile comes into this room. I do not know why, and I have decided not to ask.";
  F.metPorter=1;
  return say(intro,[
    ...opts,
    ['Rest in the lodge.',()=>{G.talk=null;try{restParty(true)}catch(e){console.error(e)}return say('You sleep in the porter\'s bed and on his floor, and wake warm. The kettle is on again. Everyone is healed and fed.',[BYE])}],
    ['What is this place?',()=>say("The Pale Spire, the castle of the Pale Sovereign. You are in the gatehouse, at the front. Behind it is the Court of Statues, which is not a nice name for a nice place. Beyond that is the great house itself: the Great Hall in the middle of the north range, the kitchens and armoury in the west wing, the cloister, chapel and library in the east wing, and the dungeons under the kitchens. The upper floors are locked. The keys went to the sacristan, and nobody has told me where he put them.",[['Back.',back],BYE])],
    ['Who holds the gatehouse?',()=>say("The pale guards, and the halberdiers, and the archers in the slits. They were soldiers once. Now they stand where they stand and do what they did, and the Gate Captain is the worst of them, because he remembers his orders best. He keeps the passage. The two guardrooms open off it, and the stair in the east one goes up to the winch loft, where the portcullis chains are. There is a dead man in the loft who was a Road Warden. I have not had the heart to move him.",[['Back.',back],BYE])],
    [F.sketch?'About that sketch.':'Do you know the way?',()=>{
      if(F.sketch)return say("It is the best I can do. The gatehouse is the bottom of the page. Do not trust the upper floors, I have never seen them.",[['Back.',back],BYE]);
      F.sketch=1;if(!bagAdd(mkItem('pssketch')))G.items.push({k:'pssketch',x:G.P.x,y:G.P.y,taken:false});
      sfx('key');return say("I know the ground floor, from thirty years of carrying messages. I have drawn it for you on a page of the ledger. Take it. It shows which wing is which, and where the stairs go down.",[['Back.',back],BYE])}],
    BYE])}
khNpc('psg_horn',"The Warden's Horn",'gy_bell',d=>{const F=psgF();
  if(F.horn)return say('The place on the table where the horn lay.',[BYE]);
  return say("A long horn of dull horn and tarnished silver lies on the table, beside the bones of the man who carried it. He wore the grey cloak of a Road Warden, and the cloak is still on the chair. The horn is his.",[['Take the horn.',()=>{F.horn=1;if(d){d.found=true;d.hidden=true}if(!bagAdd(mkItem('pshorn')))G.items.push({k:'pshorn',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg("You take the Warden's Horn.",'#ffe36a');return null}],BYE])});
bl3Hide(9722,'psg_horn',()=>!!psgF().horn);
for(let i=0;i<9;i++){const bit=1<<i;
  khNpc('psg_tok'+i,"A pilgrim's token",'gy_ring',d=>{const F=psgF();
    if((F.tok|0)&bit)return say('Nothing here now.',[BYE]);
    return say('Lying in the dirt is '+PSG_TOK_NAMES[i]+'. It was left for luck on the way to the Pale Spire.',[["Pick it up.",()=>{F.tok=(F.tok|0)|bit;if(d){d.found=true;d.hidden=true}if(!bagAdd(mkItem('pstoken')))G.items.push({k:'pstoken',x:G.P.x,y:G.P.y,taken:false});
      sfx('key');msg("You pick up a pilgrim's token ("+psgTok()+' of 9).','#ffe36a');if(qSt('psq1')==='active')yrStep("You have "+bagCount('pstoken')+' of the nine tokens.');return null}],BYE])});
  bl3Hide(9720,'psg_tok'+i,()=>!!((psgF().tok|0)&bit))}
khNpc('psg_cairn','A cairn of pilgrims\' offerings','bl_stone1',()=>{
  const n=bagCount('pstoken');
  return say("A tall heap of stones beside the road, with a board leaning on it. The board says: FOR THOSE WHO WENT UP. Ribbons and buttons and little carved things were left here by pilgrims, and many have fallen off and lie scattered along the road and in the barbican. "+(qSt('psq1')==='done'?"The cairn has been tidied.":qSt('psq1')==='active'?"You carry "+n+" of the nine tokens that belong on it.":"Merrick Dole the porter would know more. His lodge is in the gatehouse, at the end of the road."),[BYE])});
/* the Gate Captain: his key ring, and the Warden's Horn if it has not been taken */
bl3Kill('psgatecaptain',e=>{const F=psgF();if(F.cap)return;F.cap=1;F.ring=1;bl3Give('pskeyring');
  let t="The Gate Captain goes down on one knee, and then on his face, and the key ring slides off his belt. You take the Gate Captain's Key Ring.";
  if(!F.horn){F.horn=1;bl3Give('pshorn');t+=" The Warden's Horn was hanging beside it, and you take that as well."}
  try{msg(t,'#ffe36a');sfx('win')}catch(x){}});
khNpc('psg_waymark','The waymark','bl_stone1',()=>say("A tall black stone beside the landing, cut with plain capitals: THE PALE SPIRE, CASTLE OF THE PALE SOVEREIGN. Somebody has scratched a tally of days under the letters, and an arrow pointing up the hill. The road climbs in long switchbacks to a bridge, and the bridge leads to the Great Gate.",[BYE]));
/* arrival lines (first visit to each place) and the porter's painted face */
const PSG_ARR={9720:'The Pale Approach. A cobbled road climbs the crag in long switchbacks under a low lid of black-green cloud. Far above, the castle stands in the mist.',9721:'The Great Gatehouse. The passage is cold and long, and a portcullis hangs high in the dark.',9722:'The Winch Loft. Chains as thick as a leg run into the floor.',9723:''};
{const _pa=pspArrive;pspArrive=function(n,restored){_pa.apply(this,arguments);
  if(!psgIs(n))return;
  try{bl3Apply(n)}catch(e){console.error(e)}
  try{const kp=KH_KEEPERS.psg_porter,im=IMG.ps_p_porter;if(kp&&im&&!im._ps){kp.face='ps_p_porter';NPC_H.ps_p_porter=NPC_H.ps_p_porter||1.0}}catch(e){}
  const F=psgF();if(!restored&&!F['psgs'+n]){F['psgs'+n]=1;try{if(PSG_ARR[n])msg(PSG_ARR[n],'#c8e0d0')}catch(e){}}}}
