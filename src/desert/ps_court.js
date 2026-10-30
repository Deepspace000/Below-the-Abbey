/* ==========================================================================
   THE PALE SPIRE, PACKAGE 2: THE COURT OF STATUES, REDESIGNED AS A SCHNOOR (prefix psc / PSC). Levels 9730 (the court, outdoor, 64x56, rating 101), 9731 (the Gardener's Lodge, rest room, 16x14) and 9732 (the Mews and Stable, 20x16).
   The contract (ids, sizes, link squares) is in ps_ids.js; the owner's direction is tools/PALE_SPIRE_REDESIGN.md; the plan is tools/PALE_SPIRE_PLAN.md (package 2); notes are in tools/PALE_SPIRE_NOTES.md.
   THE LOOK: a dark, demented gothic quarter (black weathered stone, verdigris copper, sickly green-white lamps, dark ivy and moss, overcast dark green-grey sky).
   A tangle of tiny cobbled lanes between tall black-timbered gabled houses, high brick walls, small walled gardens, a fountain square under a clock tower with a walk-under passage, a stream with a stone bridge and footbridges, alcoves with creepy statues, arches.
   WHAT IS HERE
   1. art loading, floors, wall tiles painted in code (houses, brick, castle front, clock tower, doors), the sky, hedges
   2. the creatures: statues that wake (pscs), patrols, the five slow wandering mini bosses (loops, PSC.loops), drops, safe zone round the Waystone Nook
   3. people and quests (psq3 to psq5), the builder pscBuild (lanes, squares, twelve nooks, creatures), the lodge and the mews
   Everything that is a person, a statue or a creature uses pspPic(name) / 'ps_c_<id>' (ps_core.js), so painted pieces from assets/ps drop in with no code change.
   ========================================================================== */
const PSC={ID:9730,LODGE:9731,MEWS:9732,W:64,H:56,R:101,TELE:[8,44],loops:{},lamps:[],benchUsed:false,
  FRONTS:[[32,12],[18,12],[14,24],[50,24],[58,30]],   // the four door fronts: no creature within 3 squares
  NECKS:[3,1,5,2,4]};   // the order of the five hydra necks (the plaque in the Weeping Alcove says it)
const pscIs=n=>n>=9730&&n<=9739;
const pscF=()=>{const F=pspF();return F.c||(F.c={necks:[],roses:0,taken:{}})};
const pscQ=(id,title,who,steps,reward,extra)=>{const q=yrQ(id,title,who,steps,reward,extra);QAREA[id]=PSP.REGION;return q};
const pscSafe=(x,y,r)=>Math.hypot(x-PSC.TELE[0],y-PSC.TELE[1])<=(r||8);
const pscNearFront=(x,y,r)=>PSC.FRONTS.some(f=>Math.hypot(x-f[0],y-f[1])<=(r||3))||Math.hypot(x-32,y-49)<=3||Math.hypot(x-10,y-42)<=3||Math.hypot(x-54,y-42)<=3;
/* the palette of the castle (dark black and green, like the old German churches); package 1 may later put a shared one in PSP_PAL, this one is ours until then */
const PSC_K={stone:'#22262b',stone2:'#2f353c',stoneLt:'#566471',trim:'#7a8896',cop:'#a8843f',cop2:'#6b5428',copLt:'#d8b86a',verd:'#4aa58b',brick:'#34363b',brick2:'#292b30',mort:'#13151a',plast:'#44505a',plast2:'#56626c',plastDk:'#323c45',timber:'#0e1013',glass:'#bfe6f0',glassDk:'#14222c',iron:'#0d0f12',moss:'#3a5a48',ivy:['#1c3226','#27402f','#162a20','#2c4a3c','#223c34'],slate:'#2b3641',slateLt:'#566a7c'};
const PSC_SICK=[.66,.98,1.25],PSC_GREEN=[.55,1.1,1.15],PSC_WARM=[1.6,1.05,.55];   // cold teal-blue moonlight; warm brass lamps are the exception
PSP_PICS.banner_long_a=[3.6,['hl_p_banner','mw_banner','hgtb_deco_banner'],{keep:1}];PSP_PICS.banner_long_b=[3.6,['mw_banner','hl_p_banner','hgtb_deco_banner'],{keep:1}];PSP_PICS.bat_flock=[1.2,['gyi_raven','gy_bones'],{dark:1}];PSP_PICS.moon_crescent=[2.0,['gy_column'],{}];
/* ---------- art: the same loader the Blighted Road uses (the graveyard, witch wood and Wenlock pictures are the stand-ins' sources) ---------- */
const pscNeedArt=()=>typeof blNeedArt==='function'?blNeedArt():false;
function pscWait(then){if(PSC._wait)return true;PSC._wait=1;try{msg('The Court of Statues comes into view...','#b8d0c0')}catch(e){}wlLoad().then(()=>{PSC._wait=0;then()}).catch(e=>{PSC._wait=0;console.error('psc load',e)});return true}
{const _g=goToLevel;goToLevel=function(n,entry){
  if(pscIs(n)&&pscNeedArt()&&pscWait(()=>goToLevel(n,entry)))return;
  if(pscIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error('psc build',n,e)}
  const r=_g.call(this,n,entry);
  try{if(pscIs(n))pscArrive(n)}catch(e){console.error('pscArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(pscIs(n)&&pscNeedArt()&&pscWait(()=>jumpToLevel(n,target)))return;
  return _j.call(this,n,target)}}
{const _r=restore;restore=function(sv){
  if(sv&&pscIs(sv.level)&&pscNeedArt()&&pscWait(()=>restore(sv)))return;
  if(sv&&pscIs(sv.level)&&!LEVELS[sv.level]&&KH_LAZY[sv.level])try{KH_LAZY[sv.level]()}catch(e){console.error('psc restore',e)}
  return _r.apply(this,arguments)}}
function pscArrive(n){PSC.benchUsed=false;PSC.springUsed=false;
  if(n===PSC.ID){const F=pscF();if(!F.seen){F.seen=1;try{msg('The Court of Statues. Black houses and spires lean over the lanes, the moon is a thin blade, and everything made of stone is looking at you.','#b8d0c0')}catch(e){}}}
  try{bl3Apply(n)}catch(e){}}
/* the light of the court: a still dark overcast, no night swing */
{const _up=update;update=function(dt){_up.apply(this,arguments);try{if(pscIs(LEVEL)&&LEVELS[LEVEL]&&LEVELS[LEVEL].outdoor)G.day=.5}catch(e){}}}
{const _w=weatherNow;weatherNow=function(){
  if(pscIs(LEVEL)){const L=LEVELS[LEVEL];
    if(L&&L.outdoor)return {id:'mist',n:'Teal mist',fog:.016,haze:.28,dark:0,mix:.5,col:[96,124,146],text:'A cold teal mist lies in the canyon lanes under a thin crescent moon. Bats wheel over the spires. Nothing else moves, and everything looks.'};
    return null}
  return _w.apply(this,arguments)}}
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(pscIs(LEVEL)){const L=LEVELS[LEVEL],lc=(L._psc&&L._psc.lcol)||{};
    for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=lc[key]||(L._psc&&L._psc.col)||PSC_SICK;l.kI=L.outdoor?1.3:1.3;l.range2=L.outdoor?64:120;l.calm=true}}}catch(e){console.error('psc lights',e)}
  return r}}
if(typeof TELE_KEEP_HI!=='undefined')TELE_KEEP_HI.add(9730);
/* ---------- floors: dark cobbles, flags, wet cobbles, dark bed, dark lawn, chequer, still water ---------- */
const PSC_FLOORSET=['psf_cobble','psf_flag','psf_wet','psf_bed','psf_lawn','psf_chequer','psf_water'];
function pscPaintFloors(){const N=128;for(const [out,tex,g,t] of [['psf_cobble','cobble',1.9,[.92,1,1.08]],['psf_flag','flagstone',1.7,[.9,1,1.08]],['psf_wet','cobble_wet',1.6,[.85,.98,1.14]]]){const im=IMG['ps_tex_'+tex];if(!im||!im.width)continue;
  const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(im,0,0,N,N);const d=x.getImageData(0,0,N,N).data;
  for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,d[i]*g*t[0]);d[i+1]=Math.min(255,d[i+1]*g*t[1]);d[i+2]=Math.min(255,d[i+2]*g*t[2]);d[i+3]=255}FLOORS[out]=new Uint8ClampedArray(d)}}
function pscFloors(){
  if(PSC._fl)return;blFloors();
  const tone=(out,src,g,t)=>{if(typeof gyFloorTone==='function'&&FLOORS[src])gyFloorTone(out,src,g,t);if(!FLOORS[out])FLOORS[out]=FLOORS.cobble||FLOORS.grass};
  tone('psf_cobble','gyf_cobble',.56,[.8,.92,1.05]);
  tone('psf_flag','gyf_flag',.9,[.8,.92,1.05]);
  tone('psf_bed','gyf_dirt',.42,[.6,.8,.62]);
  tone('psf_lawn','gyf_grass',.5,[.62,.86,.8]);
  tone('psf_wet','gyf_cobble',.44,[.66,.82,.98]);
  pscPaintFloors();
  if(typeof gyFloorWet==='function'&&FLOORS.psf_wet)try{const w=gyFloorWet('psf_wetx','psf_wet',[.36,.5,.62],23);if(FLOORS[w])FLOORS.psf_wet=FLOORS[w]}catch(e){}
  {const b=FLOORS.psf_flag,N=Math.round(Math.sqrt(b.length/4)),d=new Uint8ClampedArray(b.length);
   for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4,q=(((x*2/N)|0)+((y*2/N)|0))&1,m=q?.55:.3;d[i]=Math.min(255,b[i]*m*(q?1:.85));d[i+1]=Math.min(255,b[i+1]*m*(q?1:.95));d[i+2]=Math.min(255,b[i+2]*m*(q?1:.9));d[i+3]=255}
   FLOORS.psf_chequer=d}
  {const N=128,d=new Uint8ClampedArray(N*N*4),T2=6.2832;   // dark green still water with slow ripples and a few cold glints (tiles seamlessly)
   for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4,u=x/N,v=y/N,r=Math.sin(T2*(2*u+Math.sin(T2*v)*.18))*.5+Math.sin(T2*(3*v+Math.sin(T2*u*2)*.12))*.5,n=hash2(x>>1,y>>1,57);
     const g=r>.9?46:0;d[i]=12+r*5+n*5+g*.6;d[i+1]=30+r*8+n*6+g*.9;d[i+2]=46+r*10+n*7+g;d[i+3]=255}
   FLOORS.psf_water=d}
  /* the overcast: a heavy dark green-grey cloud */
  if(!CEILS.psc_sky&&CEILS.cloud){const b=CEILS.cloud,d=new Uint8ClampedArray(b.length);for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,b[i]*.3);d[i+1]=Math.min(255,b[i+1]*.45);d[i+2]=Math.min(255,b[i+2]*.62);d[i+3]=255}CEILS.psc_sky=d}
  PSC._fl=1}
/* ---------- wall tiles painted in code: black timbered houses, brick, the castle front, the clock tower, doors, the curtain wall ---------- */
const PSC_TEX=['texBlack_0','texBlack_1','texBlack_2','texBlack_3','texBlack_4'];
function pscTile(key,wh,draw,o){o=o||{};const tex=o.tex||PSC_TEX[(key.length+(o.v||0))%5];return gyTile(tex,wh,Object.assign({gain:o.gain||1.6,rgb:o.rgb||[.78,.92,1.05],tag:'psc'+key,draw},o.fac?{fac:o.fac}:{}))}
function pscIvy(x,W,Hp,seed,amt,maxLen,fromBottom){const R=blRng(seed),K=PSC_K.ivy;amt=Math.ceil(amt*.45);
  for(let k=0;k<amt;k++){let px=R()*W,len=Hp*(.12+R()*(maxLen||.5));const pts=[[px,fromBottom?Hp:0]],dir=fromBottom?-1:1;
    x.strokeStyle='#142419';x.lineWidth=1.2+R()*1.6;x.beginPath();x.moveTo(px,fromBottom?Hp+2:-2);
    for(let s=1;s<=8;s++){px+=(R()-.5)*10;const py=(fromBottom?Hp:0)+dir*len*s/8;pts.push([px,py]);x.lineTo(px,py)}x.stroke();
    for(const [lx,ly] of pts)for(let j=0;j<3;j++){const ox=(R()-.5)*14,oy=(R()-.5)*10,r=2.4+R()*3.4;x.fillStyle=K[(R()*5)|0];x.beginPath();x.ellipse(lx+ox,ly+oy,r,r*.65,R()*3,0,6.3);x.fill()}}}
function pscPointed(x,cx,y1,ww,top,fill,stroke,lw){x.beginPath();x.moveTo(cx-ww/2,y1);x.lineTo(cx-ww/2,top+ww*.55);x.quadraticCurveTo(cx-ww/2,top+ww*.08,cx,top);x.quadraticCurveTo(cx+ww/2,top+ww*.08,cx+ww/2,top+ww*.55);x.lineTo(cx+ww/2,y1);x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.lineWidth=lw||4;x.strokeStyle=stroke;x.stroke()}}
/* bricks, dark, in courses; y0..y1 is the strip painted */
/* the painted textures (assets/ps tex_*), laid on a tile 128 wide from the bottom up; false when the picture is not there */
function pscPaintTex(x,W,Hp,name,y0,y1,off){const im=typeof IMG!=='undefined'&&IMG['ps_tex_'+name];if(!im||!im.width)return false;
  x.save();x.beginPath();x.rect(0,y0,W,y1-y0);x.clip();for(let y=y1-128,u=0;y>y0-128;y-=128,u++){const sh=((off||0)+u*47)%128;for(const dx of [-sh,128-sh]){x.save();if(u%2){x.translate(W,0);x.scale(-1,1)}x.drawImage(im,0,0,im.width,im.height,dx,y,128,128);x.restore()}}x.restore();return true}
function pscBricks(x,W,Hp,seed,y0,y1){if(pscPaintTex(x,W,Hp,'ashlar',y0,y1,seed*13)||pscPaintTex(x,W,Hp,'brick_dark',y0,y1,seed*13))return;const R=blRng(seed),cols=[PSC_K.brick,PSC_K.brick2,'#463f3a','#322d2b','#3f3b37','#2f3a33'];
  x.save();x.beginPath();x.rect(0,y0,W,y1-y0);x.clip();x.fillStyle=PSC_K.mort;x.fillRect(0,y0,W,y1-y0);
  for(let y=y1-17,r=0;y>y0-17;y-=17,r++)for(let bx=-(r%2)*20;bx<W;bx+=40){x.fillStyle=cols[(R()*6)|0];x.fillRect(bx+1,y+1,38,15);if(R()<.16){x.fillStyle='rgba(70,120,70,.4)';x.fillRect(bx+1,y+1,38,4)}}
  x.restore()}
function pscMossBase(x,W,Hp,seed,h){const R=blRng(seed);for(let k=0;k<W/3;k++){const px=R()*W,r=3+R()*7;x.fillStyle=R()<.5?'rgba(52,96,52,.8)':'rgba(34,70,40,.85)';x.beginPath();x.ellipse(px,Hp-R()*h,r,r*.6,0,0,6.3);x.fill()}}
/* a tall thin pointed (lancet) window with green glass, mullion and tracery; bot = y of its sill */
function pscLancet(x,cx,bot,ww,hh,glow,dark){const top=bot-hh,g=x.createLinearGradient(0,top,0,bot);
  if(dark){g.addColorStop(0,'#0e1c18');g.addColorStop(1,'#050a08')}else{g.addColorStop(0,glow?'#e0b868':'#46687c');g.addColorStop(.5,glow?'#b07c34':'#26465a');g.addColorStop(1,glow?'#7a4a1c':'#122430')}
  pscPointed(x,cx,bot,ww+14,top-6,PSC_K.stoneLt,PSC_K.stone,3);pscPointed(x,cx,bot,ww,top,g,'#0c120f',3);
  x.strokeStyle='#0c120f';x.lineWidth=3;x.beginPath();x.moveTo(cx,top+ww*.55);x.lineTo(cx,bot);for(let yy=top+ww+10;yy<bot-8;yy+=26){x.moveTo(cx-ww/2,yy);x.lineTo(cx+ww/2,yy)}x.stroke();
  x.beginPath();x.arc(cx,top+ww*.42,ww*.2,0,6.3);x.stroke();
  x.fillStyle=PSC_K.stoneLt;x.fillRect(cx-ww/2-12,bot,ww+24,7)}
/* a grotesque face in the stone: brow, hollow eyes, wide mouth, small horns */
function pscFace(x,cx,cy,s,seed){const R=blRng(seed||1);
  x.fillStyle=PSC_K.stone2;x.beginPath();x.ellipse(cx,cy,s*.9,s,0,0,6.3);x.fill();x.strokeStyle='#0a0d0b';x.lineWidth=2;x.stroke();
  x.fillStyle='#050807';x.beginPath();x.ellipse(cx-s*.38,cy-s*.2,s*.2,s*.16,.3,0,6.3);x.ellipse(cx+s*.38,cy-s*.2,s*.2,s*.16,-.3,0,6.3);x.fill();
  x.fillStyle='#8fe0b0';x.beginPath();x.arc(cx-s*.38,cy-s*.2,s*.05,0,6.3);x.arc(cx+s*.38,cy-s*.2,s*.05,0,6.3);x.fill();
  x.fillStyle='#050807';x.beginPath();x.moveTo(cx-s*.55,cy+s*.35);x.quadraticCurveTo(cx,cy+s*(.55+R()*.3),cx+s*.55,cy+s*.35);x.quadraticCurveTo(cx,cy+s*.2,cx-s*.55,cy+s*.35);x.fill();
  x.fillStyle=PSC_K.trim;for(let t=-2;t<=2;t++){x.beginPath();x.moveTo(cx+t*s*.18-2,cy+s*.34);x.lineTo(cx+t*s*.18+2,cy+s*.34);x.lineTo(cx+t*s*.18,cy+s*.5);x.fill()}
  x.strokeStyle=PSC_K.stone2;x.lineWidth=Math.max(2,s*.14);x.beginPath();x.moveTo(cx-s*.6,cy-s*.75);x.quadraticCurveTo(cx-s*.9,cy-s*1.3,cx-s*.45,cy-s*1.5);x.moveTo(cx+s*.6,cy-s*.75);x.quadraticCurveTo(cx+s*.9,cy-s*1.3,cx+s*.45,cy-s*1.5);x.stroke()}
/* a band of verdigris copper scales */
function pscCopper(x,W,y,h){const g=x.createLinearGradient(0,y,0,y+h);g.addColorStop(0,PSC_K.slateLt);g.addColorStop(.3,PSC_K.slate);g.addColorStop(1,'#141b22');x.fillStyle=g;x.fillRect(0,y,W,h);
  x.strokeStyle='rgba(4,8,12,.6)';x.lineWidth=1.5;for(let r=0,yy=y+9;yy<y+h+9;yy+=9,r++)for(let bx=-(r%2)*8;bx<W;bx+=16){x.beginPath();x.arc(bx+8,yy-9,8,0,3.14);x.stroke()}
  x.fillStyle=PSC_K.cop2;x.fillRect(0,y+h,W,4)}
function pscIronBars(x,x0,y0,x1,y1,gap){x.strokeStyle=PSC_K.iron;x.lineWidth=3;x.beginPath();for(let b=x0;b<=x1;b+=gap){x.moveTo(b,y0);x.lineTo(b,y1)}x.moveTo(x0,y0+8);x.lineTo(x1,y0+8);x.moveTo(x0,y1-16);x.lineTo(x1,y1-16);x.stroke();x.fillStyle=PSC_K.iron;for(let b=x0;b<=x1;b+=gap){x.beginPath();x.moveTo(b-4,y0+1);x.lineTo(b,y0-9);x.lineTo(b+4,y0+1);x.fill()}}
const pscBig=(i,n,paint)=>(x,W,Hp)=>{x.save();x.translate(-i*128,0);paint(x,n*128,Hp);x.restore()};
/* ---- a narrow black-timbered gabled house, three tiles wide. d: {seed,plast,pat,brick,box,sign,face,door} ---- */
function pscTimber(x,x0,y0,x1,y1,plast,pat,seed){pscBricks(x,x1-x0+Math.max(0,x0),0,seed*7,y0,y1);return;const R=blRng(seed);x.fillStyle=plast;x.fillRect(x0,y0,x1-x0,y1-y0);
  for(let k=0;k<40;k++){x.fillStyle=R()<.5?'rgba(0,0,0,.1)':'rgba(255,255,255,.05)';x.fillRect(x0+R()*(x1-x0),y0+R()*(y1-y0),10+R()*24,3)}
  x.strokeStyle=PSC_K.timber;x.lineWidth=7;x.beginPath();x.rect(x0+3,y0+3,x1-x0-6,y1-y0-6);x.stroke();
  x.lineWidth=6;x.beginPath();for(let px=Math.ceil(x0/64)*64;px<x1;px+=64){if(px>x0+4){x.moveTo(px,y0);x.lineTo(px,y1)}}
  const mid=(y0+y1)/2;
  if(pat===0){for(let px=Math.ceil(x0/64)*64;px<x1;px+=64){x.moveTo(px,y1);x.lineTo(px+(px%128?-30:30),mid)}}
  else if(pat===1){for(let px=Math.ceil(x0/64)*64;px<x1-64;px+=64){x.moveTo(px,y0);x.lineTo(px+64,y1);x.moveTo(px+64,y0);x.lineTo(px,y1)}}
  else if(pat===2){x.moveTo(x0,mid);x.lineTo(x1,mid);for(let px=Math.ceil(x0/64)*64;px<x1;px+=64){x.moveTo(px,mid);x.lineTo(px+32,y0);x.moveTo(px,mid);x.lineTo(px+32,y1)}}
  else{for(let px=Math.ceil(x0/64)*64;px<x1-32;px+=32){x.moveTo(px,y1);x.lineTo(px+32,mid);x.lineTo(px+64,y1)}}
  x.stroke()}
function pscLeaded(x,cx,bot,ww,hh,lit,box,seed){const top=bot-hh,g=x.createLinearGradient(0,top,0,bot);
  if(lit){g.addColorStop(0,'#f0c878');g.addColorStop(1,'#b87a30')}else{g.addColorStop(0,'#2a4252');g.addColorStop(1,'#0c161e')}
  x.fillStyle=PSC_K.timber;x.fillRect(cx-ww/2-5,top-5,ww+10,hh+10);x.fillStyle=g;x.fillRect(cx-ww/2,top,ww,hh);
  x.strokeStyle='#0a0d0b';x.lineWidth=2;x.beginPath();for(let k=1;k<3;k++){x.moveTo(cx-ww/2+k*ww/3,top);x.lineTo(cx-ww/2+k*ww/3,bot)}for(let yy=top+hh/3;yy<bot-4;yy+=hh/3){x.moveTo(cx-ww/2,yy);x.lineTo(cx+ww/2,yy)}x.stroke();
  x.fillStyle='rgba(255,255,255,.14)';x.fillRect(cx-ww/2+3,top+3,ww/3-4,hh/3);
  if(box){const R=blRng(seed||3);x.fillStyle='#2a2018';x.fillRect(cx-ww/2-6,bot+2,ww+12,12);for(let k=0;k<9;k++){x.fillStyle=['#2f5a3a','#3e6a4c','#23402e','#8fb0a8','#b8ccd0'][(R()*5)|0];x.beginPath();x.arc(cx-ww/2+k*(ww/8),bot-1-R()*6,3+R()*3,0,6.3);x.fill()}}}
function pscHousePaint(x,W,Hp,d){   // a castle wing wall (no Tudor beams, jetties, balconies or leaded windows): dark brick, a stone plinth, a string course, a copper cornice, and at most a few narrow slit lights
  const B=Hp,T=PSC_K;
  pscBricks(x,W,Hp,d.seed+1,0,B);
  pscCopper(x,W,0,46);x.fillStyle=T.stoneLt;x.fillRect(0,50,W,5);
  x.fillStyle=T.stone2;x.fillRect(0,B*.46,W,9);x.fillStyle=T.stoneLt;x.fillRect(0,B*.46,W,3);
  x.fillStyle=T.stone;x.fillRect(0,B-30,W,30);x.fillStyle=T.stoneLt;x.fillRect(0,B-32,W,3);
  for(const f of d.slits||[])pscLancet(x,W*f,B*.4,22,120,false,true);
  if(d.face)pscFace(x,W*d.face,B*.22,15,d.seed);
  pscIvy(x,W,Hp,d.seed+9,d.ivy||4,.45,true);pscMossBase(x,W,Hp,d.seed+8,26)}
const PSC_HOUSES=[
  {seed:11,hs:[7.4,8.4,7.4],ivy:3},
  {seed:23,hs:[8.4,7.4,8.4],ivy:8,slits:[.5]},
  {seed:35,hs:[7.4,7.4,8.4],ivy:2,slits:[.17,.83],face:.5},
  {seed:47,hs:[8.4,8.4,7.4],ivy:6},
  {seed:59,hs:[7.4,8.4,8.4],ivy:5,slits:[.5]},
  {seed:71,hs:[8.4,7.4,7.4],ivy:3,slits:[.17,.5,.83]}];
/* brick walls (high, for the lanes and the gardens): plain, ivy, blind arches, an iron gate, slit windows, a buttress with a spout, a carved relief */
function pscBrickWall(k,wh){
  return pscTile('bw'+k,wh,(x,W,Hp)=>{const T=PSC_K;pscBricks(x,W,Hp,100+k,0,Hp);
    x.fillStyle=T.stone;x.fillRect(0,0,W,16);x.fillStyle=T.stoneLt;x.fillRect(0,16,W,3);   // the coping
    if(k===1){pscIvy(x,W,Hp,200,26,.95);pscIvy(x,W,Hp,201,12,.6)}
    if(k===2){for(const cx of [34,94]){pscPointed(x,cx,Hp-28,46,Hp-290,T.stone,T.stoneLt,5);pscPointed(x,cx,Hp-28,32,Hp-276,'#06090a',null);x.strokeStyle='#14201a';x.lineWidth=3;x.beginPath();x.moveTo(cx,Hp-276);x.lineTo(cx,Hp-28);x.stroke()}pscIvy(x,W,Hp,202,5,.4)}
    if(k===3){pscPointed(x,64,Hp-20,84,Hp-300,T.stone,T.stoneLt,6);pscPointed(x,64,Hp-20,70,Hp-288,'#05080a',null);pscIronBars(x,38,Hp-270,90,Hp-20,10);x.fillStyle=T.cop;x.fillRect(58,Hp-170,12,14);x.strokeStyle=T.cop;x.lineWidth=3;x.beginPath();x.arc(64,Hp-132,9,0,6.3);x.stroke();pscIvy(x,W,Hp,203,8,.5)}
    if(k===4){for(const yy of [Hp*.3,Hp*.55]){for(const cx of [32,96]){x.fillStyle='#04070a';x.fillRect(cx-5,yy,10,60);x.strokeStyle=T.stoneLt;x.lineWidth=3;x.strokeRect(cx-5,yy,10,60)}}pscIvy(x,W,Hp,204,10,.7,true)}
    if(k===5){x.fillStyle='rgba(8,12,10,.5)';x.fillRect(0,0,24,Hp);x.fillRect(104,0,24,Hp);for(let s=1;s<6;s++){x.fillStyle=T.stoneLt;x.fillRect(24,Hp-s*Hp/6,80,4)}x.fillStyle=T.stone2;x.fillRect(52,Hp*.5,24,70);x.fillStyle='#050807';x.fillRect(58,Hp*.5+40,12,30);x.fillStyle='rgba(120,200,150,.25)';x.fillRect(58,Hp*.5+70,12,Hp*.5-70-30);pscFace(x,64,Hp*.42,18,7)}
    if(k===6){x.fillStyle=T.stone2;x.fillRect(14,Hp*.28,100,Hp*.34);x.strokeStyle=T.stoneLt;x.lineWidth=4;x.strokeRect(14,Hp*.28,100,Hp*.34);pscFace(x,64,Hp*.45,38,9);pscIvy(x,W,Hp,206,4,.4)}
    pscMossBase(x,W,Hp,300+k,30)},{v:k})}
/* the castle front and the curtain wall: black ashlar, tall thin windows, faces, copper cornices */
function pscAshlar(x,W,Hp,seed){if(pscPaintTex(x,W,Hp,'ashlar',0,Hp,seed*7))return;const R=blRng(seed);x.fillStyle=PSC_K.mort;x.fillRect(0,0,W,Hp);const cols=[PSC_K.stone,PSC_K.stone2,'#252a27','#323833'];
  for(let y=Hp-34,r=0;y>-34;y-=34,r++)for(let bx=-(r%2)*32;bx<W;bx+=64){x.fillStyle=cols[(R()*4)|0];x.fillRect(bx+2,y+2,60,30)}}
function pscCastle(k,wh){
  return pscTile('cs'+k,wh,(x,W,Hp)=>{const T=PSC_K;pscAshlar(x,W,Hp,500+k);
    pscCopper(x,W,0,46);x.fillStyle=T.stoneLt;x.fillRect(0,50,W,6);
    for(const yy of [Hp*.33,Hp*.62]){x.fillStyle=T.stone2;x.fillRect(0,yy,W,10);x.fillStyle=T.stoneLt;x.fillRect(0,yy,W,3)}
    if(k===0){x.fillStyle='rgba(6,10,8,.55)';x.fillRect(0,0,34,Hp);x.fillRect(94,0,34,Hp);for(let s=1;s<7;s++){x.fillStyle=T.stoneLt;x.fillRect(34,Hp-s*Hp/7,60,4)}pscFace(x,64,Hp*.2,18,k);pscLancet(x,64,Hp*.58,26,150,false,true)}
    if(k===1){pscLancet(x,36,Hp*.3,26,150,true);pscLancet(x,92,Hp*.3,26,150,false);pscLancet(x,36,Hp*.66,26,170,false);pscLancet(x,92,Hp*.66,26,170,true);pscFace(x,64,Hp*.15,14,k)}
    if(k===2){pscFace(x,64,Hp*.2,20,k);x.fillStyle='#04070a';pscPointed(x,64,Hp*.7,50,Hp*.33,'#04070a',T.stoneLt,5);pscFace(x,64,Hp*.52,22,k+4)}
    if(k===3){pscLancet(x,64,Hp*.34,38,200,true);pscLancet(x,64,Hp*.74,34,150,false);pscIvy(x,W,Hp,520,16,.8)}
    if(k===4){x.fillStyle=T.stoneLt;x.fillRect(0,Hp*.5,W,8);for(let b=6;b<W;b+=14){x.fillStyle='#46534b';x.fillRect(b,Hp*.5+8,7,36)}x.fillRect(0,Hp*.5+44,W,8);pscLancet(x,64,Hp*.46,40,150,true);pscIvy(x,W,Hp,521,10,.6)}
    if(k===5){x.fillStyle='#02040a';x.beginPath();x.arc(64,Hp*.4,40,0,6.3);x.fill();x.strokeStyle=T.cop;x.lineWidth=7;x.stroke();x.strokeStyle='#1a3a30';x.lineWidth=3;for(let a=0;a<8;a++){x.beginPath();x.moveTo(64,Hp*.4);x.lineTo(64+Math.cos(a*.785)*40,Hp*.4+Math.sin(a*.785)*40);x.stroke()}x.fillStyle='rgba(120,210,160,.7)';x.beginPath();x.arc(64,Hp*.4,22,0,6.3);x.fill();pscLancet(x,64,Hp*.82,24,110,false,true);pscIvy(x,W,Hp,522,12,.7)}
    pscIvy(x,W,Hp,530+k,6,.5,true);pscMossBase(x,W,Hp,540+k,24)},{v:k})}
function pscCurtain(k,wh){
  return pscTile('cu'+k,wh,(x,W,Hp)=>{const T=PSC_K;pscAshlar(x,W,Hp,600+k);
    x.fillStyle='rgba(2,4,3,.6)';for(let c=0;c<4;c++)x.fillRect(c*34+4,0,20,20);
    x.fillStyle=T.stone2;x.fillRect(0,22,W,8);
    if(k===1){for(const cx of [36,92]){x.fillStyle='#030504';x.fillRect(cx-5,Hp*.3,10,70);x.strokeStyle=T.stoneLt;x.lineWidth=3;x.strokeRect(cx-5,Hp*.3,10,70)}}
    if(k===2){pscFace(x,64,Hp*.3,22,k);x.fillStyle='#030504';x.fillRect(56,Hp*.3+22,16,50)}
    if(k===0)pscLancet(x,64,Hp*.6,24,120,false,true);
    pscIvy(x,W,Hp,610+k,18,.9,true);pscMossBase(x,W,Hp,620+k,30)},{v:k})}
/* ---- the doors (three wide each; the middle tile is the portal) ---- */
function pscDoors(T){
  const great=(x,W,Hp)=>{const cx=W/2,dw=174,top=Hp-420,bot=Hp,K=PSC_K;pscAshlar(x,W,Hp,700);pscCopper(x,W,0,46);
    x.fillStyle='rgba(2,5,4,.6)';x.fillRect(cx-dw/2-36,top-30,dw+72,bot-top+30);pscPointed(x,cx,bot,dw+34,top-24,K.stoneLt,K.stone,5);
    pscPointed(x,cx,bot,dw,top,'#0a0f0c','#050403',5);const g=x.createLinearGradient(cx-dw/2,0,cx+dw/2,0);g.addColorStop(0,'#141c18');g.addColorStop(.5,'#202c26');g.addColorStop(1,'#0e1411');
    x.save();pscPointed(x,cx,bot,dw-10,top+6,null,null);x.clip();x.fillStyle=g;x.fillRect(cx-dw/2,top,dw,bot-top);x.fillStyle='rgba(0,0,0,.55)';x.fillRect(cx-2,top,4,bot-top);
    for(const yy of [.3,.52,.74,.92]){x.fillStyle=K.cop2;x.fillRect(cx-dw/2,top+(bot-top)*yy-4,dw,9)}
    x.fillStyle=K.copLt;for(let sx=-1;sx<=1;sx+=2)for(let k=0;k<14;k++){x.beginPath();x.arc(cx+sx*(18+(k%2)*46),top+60+k*20,3,0,6.3);x.fill()}x.restore();
    pscFace(x,cx,top-34,22,1);x.fillStyle=K.cop;x.beginPath();x.arc(cx-14,bot-170,7,0,6.3);x.arc(cx+14,bot-170,7,0,6.3);x.fill();
    x.fillStyle='#02050a';x.beginPath();x.arc(cx,top-100,42,0,6.3);x.fill();x.strokeStyle=K.cop;x.lineWidth=7;x.stroke();x.fillStyle='rgba(150,205,230,.65)';x.beginPath();x.arc(cx,top-100,26,0,6.3);x.fill();x.strokeStyle='#0a1812';x.lineWidth=3;for(let a=0;a<8;a++){x.beginPath();x.moveTo(cx,top-100);x.lineTo(cx+Math.cos(a*.785)*42,top-100+Math.sin(a*.785)*42);x.stroke()}
    for(const sx of [-1,1]){pscLancet(x,cx+sx*(dw/2+64),Hp-250,26,190,true)}pscIvy(x,W,Hp,701,10,.5,true)};
  T.great=[0,1,2].map(i=>pscTile('fg'+i,6.6,pscBig(i,3,great),{emit:1}));
  const gal=(x,W,Hp)=>{const cx=W/2,dw=150,top=Hp-370,bot=Hp,K=PSC_K;pscAshlar(x,W,Hp,710);pscCopper(x,W,0,46);
    x.fillStyle='rgba(2,5,4,.55)';x.fillRect(cx-dw/2-30,top-20,dw+60,bot-top+20);pscPointed(x,cx,bot,dw+26,top-16,K.stoneLt,K.stone,4);
    pscPointed(x,cx,bot,dw,top,'#0b1612','#050a08',5);x.save();pscPointed(x,cx,bot,dw-8,top+6,null,null);x.clip();
    for(let r=0;r<6;r++)for(let c=0;c<4;c++){x.fillStyle='rgba(120,190,220,'+(.22+.1*((r+c)%2))+')';x.fillRect(cx-dw/2+c*38+3,top+r*60+4,32,54)}
    x.fillStyle=K.stone2;x.fillRect(cx-3,top,6,bot-top);x.fillRect(cx-dw/2,top+120,dw,5);x.fillRect(cx-dw/2,top+240,dw,5);x.restore();
    pscFace(x,cx,top-30,18,2);for(const sx of [-1,1])pscLancet(x,cx+sx*(dw/2+58),Hp-230,24,170,false);pscIvy(x,W,Hp,711,9,.4,true)};
  T.gallery=[0,1,2].map(i=>pscTile('fgal'+i,6.2,pscBig(i,3,gal),{emit:1}));
  const lowDoor=(x,W,Hp,leaf)=>{const cx=64,dw=64,top=Hp-200,K=PSC_K;pscAshlar(x,W,Hp,720+leaf);pscCopper(x,W,0,40);
    pscPointed(x,cx,Hp,dw+22,top-14,K.stoneLt,K.stone,4);pscPointed(x,cx,Hp,dw,top,leaf?'#10241a':'#182019','#050806',4);
    if(leaf){x.strokeStyle='#7fcf9a';x.lineWidth=3;for(let k=0;k<5;k++){const yy=top+34+k*30;x.beginPath();x.moveTo(cx-dw/2+8,yy);x.bezierCurveTo(cx-10,yy-16,cx+10,yy+16,cx+dw/2-8,yy);x.stroke();x.fillStyle='#7fcf9a';x.beginPath();x.ellipse(cx-dw/2+14,yy+4,5,3,.6,0,6.3);x.ellipse(cx+dw/2-14,yy-4,5,3,-.6,0,6.3);x.fill()}}
    else{x.fillStyle='rgba(0,0,0,.5)';x.fillRect(cx-2,top,4,Hp-top);x.fillStyle=K.iron;for(let k=0;k<4;k++)x.fillRect(cx-dw/2,top+30+k*42,dw,5)}
    x.fillStyle=K.cop;x.beginPath();x.arc(cx+16,Hp-92,4,0,6.3);x.fill();pscFace(x,cx,top-34,12,leaf+3);pscLancet(x,24,Hp*.5,18,90,leaf>0,!leaf);pscLancet(x,104,Hp*.5,18,90,leaf>0,!leaf);pscIvy(x,W,Hp,730+leaf,8,.4,true)};
  T.kitchen=pscTile('fk',4.6,(x,W,Hp)=>lowDoor(x,W,Hp,0));
  T.cloister=pscTile('fcl',4.6,(x,W,Hp)=>lowDoor(x,W,Hp,1));
  return T}
function pscFacadeTiles(){
  if(PSC.T)return PSC.T;const T={};
  /* houses: four designs, each three tiles wide with a stepped gable (the three tiles have different heights) */
  T.house=PSC_HOUSES.map((d,di)=>[0,1,2].map(i=>pscTile('hs'+di+'_'+i,d.hs[i],pscBig(i,3,(x,W,Hp)=>pscHousePaint(x,W,Hp,d)),{v:di})));
  /* the same houses with a painted door in the middle tile for the lodge and the mews, wide stable door for the mews */
  T.brick=[0,1,2,3,4,5,6].map(k=>pscBrickWall(k,4.8+(k%3)*.6));
  T.lowbrick=pscTile('lowb',1.3,(x,W,Hp)=>{pscBricks(x,W,Hp,909,0,Hp);x.fillStyle=PSC_K.stone;x.fillRect(0,0,W,14);x.fillStyle=PSC_K.stoneLt;x.fillRect(0,14,W,3);pscMossBase(x,W,Hp,910,16)},{v:2});
  T.castle=[0,1,2,3,4,5].map(k=>[7.4,8.4,9.4].map(h=>pscCastle(k,h)));
  T.cwall=[0,1,2].map(k=>pscCurtain(k,5.0));
  pscDoors(T);
  const tw=(k,wh,paint)=>pscTile('tw'+k,wh,(x,W,Hp)=>{const K=PSC_K;pscAshlar(x,W,Hp,800+k);pscCopper(x,W,0,50);for(const yy of [.25,.45,.68]){x.fillStyle=K.stone2;x.fillRect(0,Hp*yy,W,8);x.fillStyle=K.stoneLt;x.fillRect(0,Hp*yy,W,3)}paint&&paint(x,W,Hp,K);pscIvy(x,W,Hp,810+k,10,.6,true);pscMossBase(x,W,Hp,820+k,26)},{v:k});
  T.tower=[tw(0,9.4,(x,W,Hp)=>{pscLancet(x,64,Hp*.55,22,130,false,true)}),tw(1,9.4,(x,W,Hp)=>{pscFace(x,64,Hp*.38,20,3);pscLancet(x,64,Hp*.7,22,110,true)}),tw(2,9.4,(x,W,Hp)=>{pscLancet(x,36,Hp*.4,20,120,false,true);pscLancet(x,92,Hp*.4,20,120,true)})];
  /* the clock: a big black dial with gold-green numerals across three tiles */
  T.clock=[0,1,2].map(i=>pscTile('ck'+i,9.6,pscBig(i,3,(x,W,Hp)=>{const K=PSC_K,cx=W/2,cy=Hp*.66;pscAshlar(x,W,Hp,830);pscCopper(x,W,0,56);
    x.fillStyle=K.stone2;x.beginPath();x.arc(cx,cy,176,0,6.3);x.fill();x.strokeStyle=K.cop;x.lineWidth=12;x.stroke();x.fillStyle='#0a100d';x.beginPath();x.arc(cx,cy,156,0,6.3);x.fill();
    x.strokeStyle='#d8b86a';x.lineWidth=5;x.fillStyle='#d8b86a';for(let h=0;h<12;h++){const a=h*Math.PI/6;x.beginPath();x.moveTo(cx+Math.cos(a)*128,cy+Math.sin(a)*128);x.lineTo(cx+Math.cos(a)*(h%3?144:112),cy+Math.sin(a)*(h%3?144:112));x.stroke()}
    x.lineWidth=11;x.strokeStyle='#e8d098';x.beginPath();x.moveTo(cx,cy);x.lineTo(cx-6,cy-96);x.stroke();x.lineWidth=7;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+104,cy+48);x.stroke();x.beginPath();x.arc(cx,cy,12,0,6.3);x.fillStyle=K.cop;x.fill();
    pscFace(x,cx,cy-210,20,4);pscFace(x,cx-168,cy+170,14,5);pscFace(x,cx+168,cy+170,14,6);pscIvy(x,W,Hp,831,12,.6,true);pscMossBase(x,W,Hp,832,26)}),{v:3}));
  /* the belfry side of the tower: three louvred pointed openings, a bell showing */
  T.belfry=[0,1,2].map(i=>pscTile('bf'+i,9.6,pscBig(i,3,(x,W,Hp)=>{const K=PSC_K;pscAshlar(x,W,Hp,840);pscCopper(x,W,0,56);
    for(const cx of [W*.2,W*.5,W*.8]){pscPointed(x,cx,Hp*.5,70,Hp*.14,'#030605',K.stoneLt,6);x.strokeStyle='#14281f';x.lineWidth=5;for(let yy=Hp*.2;yy<Hp*.5;yy+=22){x.beginPath();x.moveTo(cx-30,yy);x.lineTo(cx+30,yy+8);x.stroke()}}
    pscLancet(x,W*.5,Hp*.9,30,150,true);pscFace(x,W*.5,Hp*.58,22,8);pscIvy(x,W,Hp,841,12,.7,true);pscMossBase(x,W,Hp,842,26)}),{v:4}));
  /* the passage under the tower: ribbed dark stone */
  T.passage=pscTile('pas',5.2,(x,W,Hp)=>{const K=PSC_K;pscAshlar(x,W,Hp,850);for(let r=0;r<3;r++){x.strokeStyle='#08100c';x.lineWidth=5;x.beginPath();x.moveTo(64,0);x.quadraticCurveTo(64+r*30-30,Hp*.4,64,Hp);x.stroke()}x.fillStyle='rgba(60,120,90,.25)';x.fillRect(0,Hp*.8,W,Hp*.2);pscMossBase(x,W,Hp,851,36)},{v:1});
  /* a culvert: where the stream goes under a house */
  T.culvert=pscTile('cul',3.8,(x,W,Hp)=>{const K=PSC_K;pscBricks(x,W,Hp,860,0,Hp);pscPointed(x,64,Hp,100,Hp-190,'#020403',K.stoneLt,7);pscIronBars(x,30,Hp-170,98,Hp,12);x.fillStyle='rgba(100,200,160,.3)';x.fillRect(20,Hp-24,88,24);pscMossBase(x,W,Hp,861,40)},{v:3});
  /* the wall stairs: a dark arch behind an iron grille */
  T.grille=pscTile('gl',4.2,(x,W,Hp)=>{const K=PSC_K;pscAshlar(x,W,Hp,870);pscPointed(x,64,Hp,92,Hp-300,'#030504',K.stoneLt,6);pscIronBars(x,30,Hp-270,98,Hp,13);pscFace(x,64,Hp-326,14,9);pscIvy(x,W,Hp,871,10,.4,true)},{v:2});
  T.gate=gyTile('texBlack_1',3.9,{fac:{img:'gatesC_0',i:0,n:1},gain:1.2,tag:'pscgate',emit:.28,rgb:[.8,1,.88]});
  return PSC.T=T}
/* hedges: silver and dark yew (the two new kinds are put in the garden table) */
function pscHedges(){
  if(PSC._hed)return PSC._hed;
  GMH.pscsilver={base:'#0b1610',cols:['#26402f','#315040','#1d3226','#3d5e47','#172a1f'],len:[9,13],ratio:.42,n:1.35,shape:'oval'};
  GMH.pscyew={base:'#050c08',cols:['#14301f','#1c3d28','#0e2216','#254a30','#173a26'],len:[10,15],ratio:.14,n:1.6,shape:'needle'};
  GMH.pscbloom={base:'#0c1a12',cols:['#1d3828','#244230','#183024'],len:[7,10],ratio:.5,n:1.25,shape:'oval',acc:[{k:'bloom',cs:['#6c8a78','#5d7868','#7a9486'],n:12,s:4.4,p:6}]};
  const H={low:[],high:[],bloom:[],yew:[]};
  for(let v=0;v<4;v++){H.low.push(gmHedge('pscsilver',v,1.05));H.high.push(gmHedge('pscsilver',v,2.4));H.bloom.push(gmHedge('pscbloom',v,1.6));H.yew.push(gmHedge('pscyew',v,2.6))}
  return PSC._hed=H}

/* ---------- 2. the creatures (pictures: 'ps_c_<id>' from ps_core.js; ph = picture height in cells; health comes from the balance code and the rating of the place) ---------- */
const pscE=(id,o)=>Object.assign({img:'ps_c_'+id,ph:(PSP_CREATURES[id]&&PSP_CREATURES[id][2])||1.6,w:.7,xp:30,gold:[0,0],speed:1,hit:.86,ps:1},o);
Object.assign(ENEMY_DEF,{
  psgargoyle:pscE('psgargoyle',{img:'ps_st_gargoyle',ph:1.4,name:'Stone Gargoyle',hp:70,dmg:[7,12],speed:2,fly:true,floatH:.2,verb:'rakes',xp:34,pscs:1,wake:'The crouched gargoyle opens its eyes. There is dust in them.'}),
  pschimera:pscE('pschimera',{img:'ps_st_chimera',ph:2.0,name:'Chimera Statue',hp:96,dmg:[8,14],verb:'tears at',xp:40,pscs:1,wake:'The chimera shakes the moss off its three heads, one after another.'}),
  pshydra:pscE('pshydra',{img:'ps_st_hydra',ph:2.6,name:'Hydra Statue',hp:130,dmg:[9,15],verb:'strikes at',xp:48,pscs:1,wake:'Five stone necks lift together and turn to look at you.'}),
  psmourner:pscE('psmourner',{img:'ps_st_mourners',ph:2.4,name:'Weeping Mourner',hp:84,dmg:[7,12],verb:'claws',xp:36,pscs:1,wake:'The six-armed mourner lowers its hands from its face. It has been weeping the whole time.'}),
  psjudge:pscE('psjudge',{img:'ps_st_judge',ph:2.6,name:'Horned Judge',hp:120,dmg:[10,16],verb:'hammers',xp:46,pscs:1,wake:'The horned judge lifts his scales. The pans are empty, and he does not mind.'}),
  psmarblehound:pscE('psmarblehound',{name:'Marble Hound',hp:52,dmg:[7,11],speed:2,verb:'savages',xp:30,wander:true,roam:7}),
  pshoundhm:pscE('psmarblehound',{name:'Marble Hound',hp:52,dmg:[7,11],speed:2,verb:'savages',xp:30,pscpack:1}),
  pshedger:pscE('pshedger',{name:'Hollow Gardener',hp:66,dmg:[7,12],verb:'shears',xp:32,wander:true,roam:6}),
  psthornsprite:pscE('psthornsprite',{name:'Thorn Sprite',hp:30,dmg:[5,9],speed:2,verb:'pricks',xp:24,pscs:1,wake:'Something small and green uncurls from the hedge, holding a thorn like a spear.'}),
  psmoth:pscE('psmoth',{name:'Pale Moth Swarm',hp:34,dmg:[4,8],speed:2,fly:true,floatH:.3,verb:'dusts',xp:28,pscs:1,wake:'The white flowers lift off their stems. They were moths, and now they are in your eyes.',blind:1}),
  psraven:pscE('psraven',{name:'Pale Raven',hp:40,dmg:[6,10],speed:2,fly:false,floatH:0,verb:'stabs',xp:28,pscfeather:1}),
  /* the five slow wanderers (hp is a size: bosses are about 0.5 to 0.7 of Maldrake scaled up, tuned by eye) */
  pscolossus:pscE('pscolossus',{name:'The Weeping Colossus',hp:560,dmg:[11,17],hit:.9,verb:'crushes',xp:900,boss:true,aboveParty:0,pscwalk:1}),
  psgargmother:pscE('psgargmother',{name:'Mother Gargoyle',hp:450,dmg:[9,15],hit:.9,speed:2,fly:true,floatH:.3,verb:'rakes',xp:800,boss:true,aboveParty:0,pscwalk:1}),
  psthornwarden:pscE('psthornwarden',{name:'The Thorn Warden',hp:430,dmg:[9,15],hit:.9,verb:'lashes',xp:760,boss:true,aboveParty:0,pscwalk:1,regrow:1}),
  psossian:pscE('psossian',{name:'Ossian the Mad Sculptor',hp:500,dmg:[10,16],hit:.9,verb:'hammers',xp:850,boss:true,aboveParty:0,pscwalk:1}),
  pshoundmaster:pscE('pshoundmaster',{name:'The Hound Master',hp:430,dmg:[9,15],hit:.9,verb:'cracks his whip at',xp:760,boss:true,aboveParty:0,pscwalk:1})});
/* the pale guard is package 1's creature; if its file has not defined it (stand-alone test) a plain one stands in */
if(!ENEMY_DEF.psguard)ENEMY_DEF.psguard=pscE('psguard',{name:'Pale Guard',hp:62,dmg:[7,12],verb:'cuts',xp:32,wander:true,roam:5});
if(typeof NO_VARY!=='undefined')NO_VARY.push('pscolossus','psgargmother','psthornwarden','psossian','pshoundmaster');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('pscolossus','psthornwarden');
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.pscolossus=[4600,6000];BOSS_GOLD.psgargmother=[4200,5400];BOSS_GOLD.psthornwarden=[4000,5200];BOSS_GOLD.psossian=[4400,5800];BOSS_GOLD.pshoundmaster=[4000,5200]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^psmoth/,'shaken',.25],[/^(psmourner|pscolossus)/,'cursed',.12],[/^(psthorn|pshedger)/,'bleeding',.2],[/^(psgarg|pshound|psmarble)/,'bleeding',.15]);
/* ---------- the things that are carried: drops of the five, and the small rewards ---------- */
Object.assign(ITEMDEF,{
  pscolossustear:{n:'Colossus Tear',k:'quest',t:'Gem',ic:'ore',c:'#cfd8ff',stack:1,price:9000,gem:22000,rar:1,sw:.3,d:'A tear of clear pale stone as big as a hen egg, cold to hold. A shop pays about 22000 gold for it.'},
  psgargeye:{n:"Gargoyle Matriarch's Eye",k:'ring',t:'Ring',ic:'ring',c:'#b8b4d8',price:0,lvl:102,pas:{ward:16,dodge:.06,regen:.5},hp:90,rar:1,sw:.2,d:"A grey stone eye set in a silver ring. It never blinks. Adds 90 health, every blow on the wearer is 16 lighter, enemies miss 6% more, and wounds close steadily. Needs level 102."},
  pswardenshears:{n:"The Warden's Shears",k:'weapon',t:'Dagger',ic:'dagger',c:'#a8c0b8',dmg:[330,420],hit:.2,req:{dex:72},lvl:101,price:0,rar:1,eff:{bleed:[.35,6,40],bossdmg:.3},dbl:.3,sw:.5,d:"Long iron garden shears, the blades as green as old copper. Wounds bleed, and bosses take 30% more. Needs level 101."},
  pschisel:{n:"Ossian's Chisel",k:'quest',t:'Quest item',ic:'dagger',c:'#b8b8c8',stack:1,price:0,sw:.2,d:"A sculptor's chisel, worn bright. Lady Ysmay's husband carved with it."},
  psstatuehammer:{n:"Ossian's Statue Hammer",k:'weapon',t:'Mace',ic:'mace',c:'#a8a8b8',dmg:[430,540],hit:.2,req:{str:76},lvl:103,price:0,rar:1,eff:{bossdmg:.35,stun:.15},sw:.9,d:"A heavy mallet with a stone head that has split a hundred statues. Bosses take 35% more, and some blows stun. Needs level 103."},
  pswhistle:{n:"The Hound Master's Whistle",k:'ring',t:'Ring',ic:'ring',c:'#d0d4e4',price:0,lvl:102,pas:{ward:12,dodge:.08},hp:70,rar:1,sw:.1,d:"A small silver whistle on a ring band. Dogs do not like it and neither do you. Adds 70 health, every blow on the wearer is 12 lighter, and enemies miss 8% more. Needs level 102."},
  psglove:{n:'Falcon Glove',k:'quest',t:'Quest item',ic:'ring',c:'#b09a78',stack:1,price:0,sw:.1,d:"A long leather glove for a hawk, cracked with age. The falconer ghost in the Mews would like it back."},
  psgardshears:{n:"Gardener's Shears",k:'ring',t:'Ring',ic:'ring',c:'#98b0a0',price:0,lvl:101,pas:{ward:10,regen:.7},hp:60,rar:1,sw:.1,d:"A small pair of shears worn on a cord ring. Adds 60 health, every blow on the wearer is 10 lighter, and wounds close steadily. Needs level 101."},
  pscord:{n:"The Falconer's Cord",k:'ring',t:'Ring',ic:'ring',c:'#c8b898',price:0,lvl:102,pas:{ward:12,dodge:.07,regen:.4},hp:75,rar:1,sw:.1,d:"A braided cord ring of the kind that ties a hawk to a glove. Adds 75 health, every blow on the wearer is 12 lighter, and enemies miss 7% more. Needs level 102."},
  psknightring:{n:'Ring of the Headless Guard',k:'ring',t:'Ring',ic:'ring',c:'#c0c4d8',price:0,lvl:101,pas:{ward:14,dodge:.05},hp:80,rar:1,sw:.1,d:'A heavy ring of dull steel from the hidden niche in the Headless Knights\' Corner. Adds 80 health, every blow on the wearer is 14 lighter, and enemies miss 5% more. Needs level 101.'}});
for(const id of ['psroses','pschisel','psglove']){if(!ITEMDEF[id]&&PSP_ITEMS[id])ITEMDEF[id]=Object.assign({},PSP_ITEMS[id],{price:0,sw:.1})}
if(!ITEMDEF.psroses)ITEMDEF.psroses={n:'Silver Rose',k:'quest',t:'Quest item',ic:'herb',c:'#e8e8f4',stack:1,price:0,sw:.05,d:'A rose with silver-white petals and a faint violet heart, cut from the Rose Garden of the Court of Statues.'};
/* drops and phases: bl3Kill / bl3Hit come from blight_late.js */
bl3Kill('pscolossus',e=>{bl3Give('pscolossustear');msg('The Colossus kneels, covers its face with both hands and stops. A clear stone tear lies where it knelt.','#cfd8ff')});
bl3Kill('psgargmother',e=>{bl3Give('psgargeye');msg("Mother Gargoyle falls in a shower of grey grit. Her stone eye rolls to your feet.",'#cfd8ff')});
bl3Kill('psthornwarden',e=>{bl3Give('pswardenshears');msg('The Thorn Warden comes apart into yew and thorn. A pair of long shears lies in the cuttings.','#bfe8c8')});
bl3Kill('psossian',e=>{const F=pscF();F.ossianDead=1;bl3Give('pschisel');bl3Give('psstatuehammer');msg("Ossian drops his hammer and sits down among his statues. His chisel lies in his open hand.",'#e0e0f0')});
bl3Kill('pshoundmaster',e=>{bl3Give('pswhistle');msg("The Hound Master falls. A small silver whistle rolls out of his glove.",'#e0e0f0')});
bl3Hit('psgargmother',e=>{e._ph=(e._ph|0)+1;if(e._ph%4===0&&G.enemies.filter(m=>m.hp>0&&m.t==='psgargoyle'&&m._kid).length<3){const m=bl3Add('psgargoyle',e.x,e.y,PSC.R);if(m){m._kid=1;msg('Mother Gargoyle shrieks, and a small gargoyle breaks off her back.','#c8c8e8')}}});
bl3Hit('psossian',e=>{e._ph=(e._ph|0)+1;const n=G.enemies.filter(m=>m.hp>0&&m._kid).length;if(n<3){const m=bl3Add(e._ph%2?'psgargoyle':'pschimera',e.x,e.y,PSC.R);if(m){m._kid=1;msg('Ossian strikes a statue beside him with his mallet, and it climbs down off its plinth.','#c8c8e8')}}});
bl3Hit('psmourner',e=>{if(Math.random()<.25)msg('The mourner screams. It is a wet, rising sound, and it goes through your teeth.','#d0b8e8')});
/* ---------- the movement of the court's creatures: waking statues, loops, the safe zone, the thorn warden's regrowth, ravens that wait for the feather ---------- */
const PSC_LAMPLIT=()=>{for(const l of PSC.lamps)if(Math.hypot(l[0]-G.P.x,l[1]-G.P.y)<99)return true;return false};
function pscLoopStep(e,def){
  const loop=PSC.loops[e.t];if(!loop||!loop.length)return 0;
  e._pc=(e._pc|0)+1;if(e._pc%3)return 0;    // one step in three: about a third of a creature's pace
  if(e.hx===undefined){e.hx=e.x;e.hy=e.y;e._pi=0;let bd=1e9;loop.forEach((p,i)=>{const d=Math.abs(p[0]-e.x)+Math.abs(p[1]-e.y);if(d<bd){bd=d;e._pi=i}})}
  let tg=loop[e._pi%loop.length];
  if(Math.abs(e.x-tg[0])+Math.abs(e.y-tg[1])<=1){e._pi=(e._pi+1)%loop.length;tg=loop[e._pi];e._stuck=0}
  const dx=tg[0]-e.x,dy=tg[1]-e.y,pref=[];
  if(Math.abs(dx)>=Math.abs(dy)){if(dx)pref.push([Math.sign(dx),0]);if(dy)pref.push([0,Math.sign(dy)])}else{if(dy)pref.push([0,Math.sign(dy)]);if(dx)pref.push([Math.sign(dx),0])}
  for(const d of DIRS)if(!pref.some(p=>p[0]===d[0]&&p[1]===d[1]))pref.push(d);
  for(const d of pref){const x=e.x+d[0],y=e.y+d[1];
    if(cellBlocked(x,y)||!terrStepOK(e.x,e.y,x,y)||enemyAt(x,y)||(x===G.P.x&&y===G.P.y)||pscSafe(x,y,10))continue;
    const bd2=Math.abs(x-tg[0])+Math.abs(y-tg[1]),cur=Math.abs(e.x-tg[0])+Math.abs(e.y-tg[1]);
    if(bd2>cur&&e._stuck<4){e._stuck=(e._stuck|0)+1;continue}
    e.x=x;e.y=y;e._stuck=0;return 130}
  e._stuck=(e._stuck|0)+1;if(e._stuck>8){e._pi=(e._pi+1)%loop.length;e._stuck=0}
  return 0}
{const _ea=enemyAct;enemyAct=function(e){
  try{const d=ENEMY_DEF[e.t];
    if(d&&d.ps&&pscIs(LEVEL)){
      const dist=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
      if(pscSafe(G.P.x,G.P.y,9)){if(e.alert)e.alert=false;if(dist>1)return 0}      // nothing hunts the party in the Waystone Nook
      if(d.pscs&&!e.alert){if(dist<=3){e.alert=true;try{msg(d.wake,'#c8c8e8');sfx('rattle')}catch(x){}return 220}return 0}
      if(d.pscfeather&&!e.alert){if(pscF().feather&&dist<=9){e.alert=true;try{msg('The ravens on the perches turn their heads together and all of them look at your hand.','#c8c8e8')}catch(x){}return 220}return 0}
      if(d.regrow&&e.hp>0&&e.hp<(e.maxhp||e.hp)){let lit=false;for(const l of PSC.lamps)if(Math.hypot(l[0]-e.x,l[1]-e.y)<=4.5)lit=true;if(!lit&&(G.rounds|0)%2===0){e.hp=Math.min(e.maxhp,e.hp+Math.ceil(e.maxhp*.012));if(!e._rg){e._rg=1;msg('New yew shoots curl out of the Thorn Warden and close its wounds. Fire or a lit lamp would stop that.','#bfe8c8')}}}
      if(d.pscpack&&!e.alert){const m=G.enemies.find(q=>q.hp>0&&q.t==='pshoundmaster');
        if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=7&&hasLOS(e.x,e.y,G.P.x,G.P.y)){e.alert=true;return 150}
        if(m&&Math.abs(e.x-m.x)+Math.abs(e.y-m.y)>2){const o=DIRS.map(q=>[e.x+q[0],e.y+q[1]]).filter(([x,y])=>!cellBlocked(x,y)&&!enemyAt(x,y)&&!(x===G.P.x&&y===G.P.y)&&!pscSafe(x,y,10)).sort((a,b)=>(Math.abs(a[0]-m.x)+Math.abs(a[1]-m.y))-(Math.abs(b[0]-m.x)+Math.abs(b[1]-m.y)))[0];if(o){e.x=o[0];e.y=o[1];return 130}}
        return 0}
      if(d.pscwalk){
        if(e.alert){const hd=e.hx===undefined?0:Math.abs(e.x-e.hx)+Math.abs(e.y-e.hy);if(dist>13||(hd>22)){e.alert=false;return 0}}   // they do not leave their ground
        else{if(dist<=6&&hasLOS(e.x,e.y,G.P.x,G.P.y)){e.alert=true;sfx('growl');msg(d.name+' turns and comes for you.','#ff9a7a');return 220}
          return pscLoopStep(e,d)}}
    }}catch(x){console.error('psc act',x)}
  return _ea.apply(this,arguments)}}

/* ---------- 3. people, things and quests (registered once, at load; the builder only places them) ---------- */
const pscGone=d=>{if(d){d.found=true;d.hidden=true;d.block=false}};
const pscTint=(key,src,filter,h)=>{if(IMG[key])return key;if(!bl3Tint(key,src,filter,h))return src;return key};
const pscDecorOf=id=>G.decor&&G.decor.find(d=>d.npc===id);
const pscHeal=(f)=>{try{G.heroes.forEach(h=>{if(h.alive)h.hp=Math.min(h.max,h.hp+Math.ceil(h.max*f))})}catch(e){}};
khNpc('psc_gardener','Hobb Ashby, the gardener','ps_c_pshedger',d=>{
  const F=pscF();
  return say(F.hobb?"Sit down, sit down. There is hot water on the stove and the bed is made. Nobody has ever come into the lodge to hurt me, and I have never worked out why. I do not ask.":"Oh! A living face. Come in and shut the door, the draught is bad for the seedlings. I am Hobb Ashby, gardener to the Pale Sovereign, and I have not been told to stop, so I have not stopped. The roses want cutting, the hedges want clipping, and the statues want something I cannot name.",
    [['Rest by the stove (free).',()=>{F.hobb=1;G.talk=null;restParty(true);return say('You sleep in the lodge by the stove. Nothing comes in. You wake warm and healed.',[BYE])}],
     ['Tell me about the statues.',()=>{F.hobb=1;return say("They were not here when I was a boy. A sculptor called Ossian came, and he kept carving, and when he ran out of room he carved the ones that bite. Do not walk close to the ugly ones. They wake up if you come within three squares. The kind ones stay still.",[['Go on.',()=>say("The pale roses in the Rose Garden are the only thing here that I did not plant for the Sovereign. They came by themselves. I cut them for the lodge. If you cut five for me I will give you something for it.",[BYE])],BYE])}],
     ['Where is it safe in the court?',()=>say('The Waystone Nook, in the south west corner, in front of my door behind the clipped hedges. Nothing goes in there. The stone will carry you back to Sale or Lanternrest, so you can fetch supplies and come back. And this lodge. And that is all.',[BYE])],BYE])},{sc:1});
khNpc('psc_ysmay','Lady Ysmay','ps_c_pscourtier',d=>{
  const F=pscF();
  if(F.ossianDead)return say("He has stopped. I can feel it, like a bell that has stopped ringing. Thank you. Sit by the pond for a while. It is still here.",[BYE]);
  return say("I am Ysmay. I have stood by this pond for a very long time. I used to be the Sovereign's cousin, then the Sovereign's guest, and now I am only here. The still water shows what stood here before the statues.",
    [['Who made the statues?',()=>say("My husband, Ossian. He was a good man with a chisel, and then he began to carve what he saw in the dark. Each one is a little worse than the last. He walks the Sculptor's Yard and the statue ring now, with a mallet, and wakes what he has made when he is hurt.",[BYE])],
     ['The castle keys?',()=>say("The Sacristan hid things where the candles are, I heard. That was when they came for him. I only know that.",[BYE])],BYE])},{sc:1});
khNpc('psc_falconer','The Falconer','ps_c_psfalconer',d=>{
  const F=pscF();
  return say(F.fcount?"The hawk is gone. The glove is all that is left. Bring it, if you find it, and the Hound Master's whistle too. I will tell you why when you have them.":"I kept the Sovereign's hawks. I am not alive any more, but the ravens do not know that, and they will not leave the perches. Do not touch the feather on the near perch. It is a trap that I set myself, to catch a thief, and I forgot to take it down.",[BYE])},{sc:1});
/* psq3 The Sculptor's Chisel: Lady Ysmay, put Ossian down and bring her his chisel */
pscQ('psq3',"The Sculptor's Chisel",'Lady Ysmay',[
  ["Put Ossian the Mad Sculptor down (he walks the Sculptor's Yard, south of the stream, through the gate on the east side of the Torstrasse) and bring his chisel to Lady Ysmay at the Mirror Pond.",()=>bagCount('pschisel')>0,[]]],
  {gold:6000,xp:35000,items:['potion6','potion6','supermana']},{take:{pschisel:1}});
wwGive('psc_ysmay','psq3',()=>true,{
  offer:"Ossian was my husband. He cannot be talked out of it any more. Will you stop him? He walks the Sculptor's Yard, south of the stream, through the gate on the east side of the Torstrasse, among the half carved statues. When he is hurt he wakes the statues beside him, so do not fight him near too many. Bring me his chisel afterwards. I would like to hold it once.",
  accept:"Thank you. He will not know you. He does not know me. His yard is south of the stream, east of the Torstrasse, behind an iron gate.",
  remind:()=>pscF().ossianDead?"Ossian is down. Bring me his chisel.":"Ossian walks the Sculptor's Yard, south of the stream, east of the Torstrasse.",
  ready:"That is his chisel. I would know it anywhere.",
  thanks:'Thank you. I will keep it here by the water.',after:'The pond is quiet now. Thank you.'});
/* psq4 Roses for the Lodge: Hobb, five silver roses */
pscQ('psq4','Roses for the Lodge','Hobb Ashby, the gardener',[
  ['Cut five silver roses in the Rose Garden, south of the stream and west of the Torstrasse, and bring them to Hobb in the Gardener\'s Lodge.',()=>bagCount('psroses')>=5,[]]],
  {gold:4000,xp:25000,items:['psgardshears','potion6']},{take:{psroses:5}});
wwGive('psc_gardener','psq4',()=>true,{
  offer:"If you cut five of the silver roses for me I can put them in the lodge and have something living on the table. The Rose Garden is south of the stream, behind an iron gate in the west wall of the Torstrasse. The roses bite. Not the thorns, the roses.",
  accept:"Five roses, cut clean. Use your hand, not a blade. Mind the Thorn Warden. He is a hedge that I clipped badly once.",
  remind:()=>'Five silver roses from the Rose Garden. You have '+Math.min(5,bagCount('psroses'))+'.',
  ready:'Five roses. They are almost the right colour.',
  thanks:'There. They will last a week, which is a long time in this place. Take my old shears.',after:'The roses are on the table. I look at them a lot.'});
/* psq5 The Last Falcon: the falconer ghost, the glove from the stable and the Hound Master's whistle */
pscQ('psq5','The Last Falcon','The Falconer',[
  ['Find the falcon glove in the Mews and Stable (east side of the court, south of the Cloister Door) and take the Hound Master\'s whistle from the Hound Master on the east lawn.',()=>bagCount('psglove')>0&&bagCount('pswhistle')>0,[]]],
  {gold:5000,xp:30000,items:['pscord','potion6']},{take:{psglove:1}});
wwGive('psc_falconer','psq5',()=>true,{
  offer:"My last falcon went out of the window the night the Sovereign shut the gates, and I think she is still flying. I would like two things: her glove, which is in a chest in one of the stalls, and the whistle of the Hound Master, who took it from me for his dogs. He walks the east lawn with two hounds. Will you bring me both?",
  accept:"Thank you. The glove chest is in the third stall. Do not touch the feather on the perch by the door. The whistle you will have to take from him.",
  remind:()=>(bagCount('psglove')?'You have the glove. ':'The glove is in a chest in the stalls. ')+(bagCount('pswhistle')?'You have the whistle.':'The whistle is with the Hound Master on the east lawn.'),
  ready:'The glove, and the whistle. Now I can call her.',
  thanks:'Now I can call her. Take my cord. It is all I have, and it is warm.',after:'I stand at the window with the glove on. Some nights I hear her.'});
/* chests: loot tables (every chest of the court is an ordinary gy_chest; the content is chosen here by square) */
PSC.chest={};
{const _lf=lootFor;lootFor=function(d){
  if(pscIs(LEVEL)&&d&&d.k==='gy_chest'){const c=PSC.chest[LEVEL+':'+d.x+','+d.y]||{pot:2,mana:1},items=[];
    const add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    for(let i=0;i<(c.pot||0);i++)add('potion6',1);if(c.mana)add('supermana',c.mana);if(c.elixir)add('elixir',c.elixir);
    for(const it of c.items||[])add(it);
    d.gold=c.gold||0;return items}
  return _lf.apply(this,arguments)}}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psc){
    if(d.seal){sfx('locked');msg(d.seal,'#c8c8e8');return true}
    if(!LEVELS[d.lvl]&&!KH_LAZY[d.lvl]){sfx('locked');msg('This part of the Pale Spire is not open yet.','#c8c8e8');return true}}
  return _k.apply(this,arguments)}}

/* ---------- 4. the court: the layout (64 x 56; '#' wall, '.' open, '~' water, 'b' a bridge) ---------- */
const PSC_LANES=[   // name, x0,y0,x1,y1 (open rectangles that are lanes: lamps, vines and wall alcoves are hung along them)
  ['castle',5,11,58,12],['west',4,13,5,35],['east',58,13,59,35],['gallery',19,14,20,28],['kitchen',13,21,14,35],['weber',13,29,28,30],['great',31,14,32,19],['passage',32,20,32,26],
  ['latern',33,16,51,17],['hunde',36,18,37,30],['cloister',50,13,51,35],['kupfer',36,29,51,30],['mauer',4,34,14,35],['ufer',14,36,50,36],['bank',14,39,50,40],['tor',31,39,32,47],['sueden',4,50,30,51],['suedost',35,50,59,51],['lane',46,43,51,43]];
const PSC_COURTS=[[22,14,27,19],[22,21,27,26],[22,32,27,34],[40,21,46,26],[53,28,57,32],[24,42,29,49],[14,41,22,49],[4,41,12,47],[34,42,45,49],[52,41,58,44],[47,46,53,50],[55,46,59,50],[40,14,44,15]];
function pscLayout(){
  const W=64,H=56,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const O=(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]=c||'.'};
  O(5,11,58,12);O(17,13,19,13);O(30,13,34,13);
  O(4,13,5,35);O(58,13,59,35);O(4,33,14,35);O(49,34,59,35);O(57,33,59,35);O(4,33,6,35);
  O(19,14,20,28);O(13,29,28,30);O(13,21,14,35);O(13,23,15,25);
  O(22,14,27,19);O(21,16,21,17);O(22,21,27,26);O(21,24,21,25);
  O(23,31,24,31);O(22,32,27,34);
  O(31,14,32,19);O(32,20,32,26);O(33,16,51,17);O(40,14,44,15);
  O(36,18,37,30);O(50,13,51,35);O(49,23,51,25);O(36,29,51,30);
  O(29,27,35,33);O(31,34,32,36);
  O(38,23,39,24);O(40,21,46,26);O(52,29,52,30);O(53,28,57,32);
  O(14,36,50,36);O(14,37,50,38,'~');O(32,37,32,38,'b');O(20,37,20,38,'b');O(44,37,44,38,'b');
  O(31,39,32,47);O(30,48,34,51);O(14,39,50,40);
  O(4,36,5,50);O(4,41,12,47);O(4,50,30,51);
  O(14,41,22,49);O(24,42,29,49);O(30,45,30,46);
  O(33,45,33,46);O(34,42,45,49);O(52,41,58,44);O(47,46,53,50);O(55,46,59,50);O(47,51,59,51);
  O(46,43,51,43);O(46,48,46,49);O(35,50,46,51);
  for(const [x,y] of [[6,17],[6,28],[57,19],[57,27],[13,20],[21,20]])g[y][x]='.';   // recesses in the walls, each holds a statue
  for(const [x,y] of [[31,29],[32,29],[33,29],[31,30],[33,30],[31,31],[32,31],[33,31],[32,30]])g[y][x]='~';   // the fountain basin
  for(const [x,y] of [[42,23],[43,23],[44,23],[42,24],[43,24],[44,24]])g[y][x]='~';                 // the mirror pond
  return g}
/* stand-in arches until the painted ones (assets/ps arch_* and rose_arch) arrive: a pointed stone frame with the middle left open, so a lane can be seen through it. Made only when no painted piece exists. */
function pscArchStands(){
  if(PSC._arch)return;PSC._arch=1;
  const mk=(name,kind)=>{const key='ps_'+name;if(IMG[key]&&!IMG[key]._ps)return;const w=248,h=400,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),K=PSC_K,R=blRng(name.length*13+kind);
    const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#1b201d');g.addColorStop(.5,K.stone2);g.addColorStop(1,'#151916');
    x.beginPath();x.moveTo(0,h);x.lineTo(0,70);x.quadraticCurveTo(w/2,-40,w,70);x.lineTo(w,h);x.lineTo(w-50,h);x.lineTo(w-50,150);x.quadraticCurveTo(w/2,40,50,150);x.lineTo(50,h);x.closePath();x.fillStyle=g;x.fill();
    x.strokeStyle=K.stoneLt;x.lineWidth=4;x.stroke();x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=2;for(let y=h-30;y>90;y-=34){x.beginPath();x.moveTo(0,y);x.lineTo(50,y);x.moveTo(w-50,y);x.lineTo(w,y);x.stroke()}
    x.fillStyle=K.cop;x.beginPath();x.moveTo(w/2-16,4);x.lineTo(w/2+16,4);x.lineTo(w/2,30);x.fill();
    if(kind===1||kind===3){for(let k=0;k<60;k++){const side=R()<.5,px=side?R()*52:w-R()*52,py=70+R()*320*R(),r=4+R()*6;x.fillStyle=K.ivy[(R()*5)|0];x.beginPath();x.ellipse(px,py,r,r*.65,R()*3,0,6.3);x.fill()}
      for(let k=0;k<14;k++){const px=60+R()*128,py=70+R()*60;x.fillStyle=K.ivy[(R()*5)|0];x.beginPath();x.ellipse(px,py+k*3,5,8,0,0,6.3);x.fill()}}
    if(kind===2){x.strokeStyle=K.iron;x.lineWidth=5;for(const px of [58,76,172,190]){x.beginPath();x.moveTo(px,h);x.lineTo(px,170);x.stroke()}}
    if(kind===3){for(let k=0;k<26;k++){const px=R()<.5?20+R()*30:w-20-R()*30,py=120+R()*260;x.fillStyle=R()<.3?'#d8ecd4':'#2f6a3a';x.beginPath();x.arc(px,py,4+R()*3,0,6.3);x.fill()}}
    c._ps=1;IMG[key]=c;NPC_H[key]=3.4};
  mk('arch_high',0);mk('arch_low',0);mk('arch_ivy',1);mk('arch_iron',2);mk('arch_stair',0);mk('rose_arch',3)}
/* until the painted pieces arrive the stand-ins are made dark and green like the rest of the court (a filter over the stand-in only; a painted piece is never touched) */
function pscDarkStands(){
  if(PSC._dk)return;PSC._dk=1;
  const names=Object.keys(PSP_PICS).filter(n=>/^(st_|alcove_|iron_|vine_|ivy_|moss_|rose_|clock_|bell_|bridge_|lantern_|well_|cart_|statue_|urn_|cobble_|stairs_|window_|c_ps)/.test(n));
  for(const n of names){const k='ps_'+n,im=IMG[k];if(!im||!im._ps||im._pscd)continue;
    const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');
    try{x.filter='grayscale(.7) brightness(.5) contrast(1.15)'}catch(e){}x.drawImage(im,0,0);x.filter='none';x.globalCompositeOperation='source-atop';x.fillStyle='rgba(50,84,116,.3)';x.fillRect(0,0,c.width,c.height);
    c._ps=1;c._pscd=1;IMG[k]=c}
  for(const n of ['banner_long_a','banner_long_b']){const k='ps_'+n,im=IMG[k];if(!im||!im._ps||im._pscd)continue;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');try{x.filter='sepia(1) saturate(1.5) hue-rotate(-38deg) brightness(.42) contrast(1.1)'}catch(e){}x.drawImage(im,0,0);c._ps=1;c._pscd=1;IMG[k]=c}}
/* ---------- the builder: walls, doors, floors, heights ---------- */
function pscBase(info){
  if(typeof pspPics==='function')pspPics();
  pscFloors();pscArchStands();pscDarkStands();const T=pscFacadeTiles(),HG=pscHedges(),g=pscLayout();
  const W=64,H=56,C=blKit({id:9730,W,H,name:info.name,lvl:101,tele:PSC.TELE,start:{x:32,y:49,f:0}});
  const ch=C.ch,hs=C.hs,rows=C.rows,block=C.block,fm=C.fm,hgt=C.hgt,int=Math.floor;
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&g[y][x]!=='#';
  const P=(k,x,y,o)=>{if(typeof k==='string'&&!IMG[k]&&IMG['ps_'+k])k='ps_'+k;return C.free(x,y)?C.dec(k,x,y,o):null};                        // a prop on a free open cell
  const B=(k,x,y,o)=>P(k,x,y,Object.assign({block:true},o||{}));             // a solid prop
  const S=(name,x,y,o)=>B(pspPic(name),x,y,Object.assign({sc:1},o||{}));    // a statue (or any painted piece) that blocks
  const Q=(name,x,y,o)=>P(pspPic(name),x,y,o);                               // a painted piece that can be walked through
  const hang=(name,x,y,wd,bob,o)=>{if(/^vine_/.test(name)&&hs(x,y,91)<.55)return null;const u=C.used.has(x+','+y);const d=C.dec(pspPic(name),x,y,Object.assign({wd,bob},o||{}));if(!u)C.used.delete(x+','+y);return d};   // a picture hung flat on the wall beside the cell
  const Fl=(x0,y0,x1,y1,f)=>C.setF(x0,y0,x1,y1,f);
  const lampAt=(x,y,col)=>{if(C.isOpen(x,y)){C.lamp(x,y,col||PSC_SICK);PSC.lamps.push([x,y])}};
  PSC.lamps=[];
  /* ---- walls: which tile goes where ---- */
  const face=(x,y)=>{for(const [dx,dy,f] of [[0,1,'S'],[0,-1,'N'],[1,0,'E'],[-1,0,'W']])if(open(x+dx,y+dy))return f;return null};
  const inCourt=(x,y)=>PSC_COURTS.some(r=>x>=r[0]-1&&x<=r[2]+1&&y>=r[1]-1&&y<=r[3]+1);
  const castleSeq=[0,1,3,1,2,4,1,5,3,0,1,2,5,3,1,4];
  const castleTile=(x,y)=>{const k=castleSeq[(x*5+3)%16],hi=int(hs(x,y,41)*3);return T.castle[k][hi]};
  const wallFor=(x,y)=>{
    const f=face(x,y);if(!f)return T.brick[0];
    if(y<=10&&x>=4&&x<=59)return castleTile(x,y);
    if(x<=3||x>=60||y>=52)return T.cwall[int(hs(x,y,5)*3)];
    if((x===12&&y>=14&&y<=28)||(x===52&&y>=14&&y<=28))return T.castle[[1,3,2,4,1][y%5]][0];   // the west and east wings, seen from the lanes
    if(y===13&&x>=5&&x<=58)return T.brick[[0,5,4,0,1,6,4][int(hs(x,y,8)*7)]];                       // the back wall of the castle row
    if(y===35&&x>=14&&x<=50)return T.brick[[5,0,1,4][int(hs(x,y,9)*4)]];                           // the river wall
    if(inCourt(x,y))return T.brick[[1,6,0,4,1,5,0][int(hs(x,y,6)*7)]];
    const horiz=f==='N'||f==='S',a=horiz?x:y,seg=int(a/3),h=hs(seg,horiz?y:x,9);
    if(h<.62){const di=int(hs(seg,7,f.charCodeAt(0))*T.house.length);return T.house[di][a-seg*3]}
    return T.brick[[0,1,4,0,5,1,0][int(hs(seg,3,f.charCodeAt(0))*7)]]};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!=='#'){fm[y*W+x]='0';continue}C.solid(x,y,ch(wallFor(x,y)))}
  for(let x=46;x<=51;x++){if(g[42][x]==='#')C.solid(x,42,ch(T.passage));if(g[44][x]==='#')C.solid(x,44,ch(T.passage))}   // the alley under the knights' wall is an undercroft
  for(const y of [22,25])for(const x of [38,39])C.solid(x,y,ch(T.passage));
  /* the clock tower: a seven by seven block with a one-wide passage through it (x 32). South face: the dial on the left, the belfry on the right. */
  for(let y=20;y<=26;y++)for(let x=29;x<=35;x++){if(x===32)continue;
    let t;if(x===31||x===33)t=T.passage;else if(y===26)t=x<32?T.clock[x-29]:T.belfry[x-33];else t=T.tower[(x+y)%3];C.solid(x,y,ch(t))}
  C.solid(31,20,ch(T.tower[1]));C.solid(33,20,ch(T.tower[2]));
  /* a house for the lodge and one for the mews (front rows are the south faces y 40) */
  for(let x=6;x<=13;x++)C.solid(x,40,ch(T.house[4][(x-7+3)%3]));for(let x=51;x<=57;x++)C.solid(x,40,ch(T.house[5][(x-51)%3]));
  /* the culverts: the stream goes under a house at each end */
  for(const [x,y] of [[13,37],[13,38],[51,37],[51,38]])C.solid(x,y,ch(T.culvert));
  /* the doors of the contract: every link of this level, a door tile of its own */
  const clone=base=>{const gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[base];if(GY.col&&GY.col[base])GY.col[gid]=GY.col[base];return gid};
  const sealed=pspDoorGid('iron',4.8);   // the sealed wall-stair doors are the castle's own ironbound door set in the wall (the old tile was a flat amber arch)
  const DOORS={'32,10':T.great[1],'18,10':T.gallery[1],'12,24':T.kitchen,'52,24':T.cloister,'10,40':T.cloister,'54,40':T.kitchen,'3,34':sealed,'60,34':sealed,'32,52':T.gate,'60,30':T.gate};
  const bind=l=>{const base=DOORS[l.at[0]+','+l.at[1]];if(!base)return;const gid=clone(base);C.solid(l.at[0],l.at[1],ch(gid));
    const d={lvl:l.to,get at(){if(!LEVELS[l.to]&&KH_LAZY[l.to])try{KH_LAZY[l.to]()}catch(e){console.error(e)}return {x:l.land[0],y:l.land[1],f:l.land[2]}},psc:1};
    if(l.prov)d.seal='The wall walk is closed. An iron grille is locked across the foot of the stair, and the lock is furred with green rust.';
    KH_DOOR[gid]=d};
  for(const l of pspLinksFrom(9730))if(l.at)bind(l);
  /* ---- floors ---- */
  Fl(5,11,58,12,'0');Fl(30,13,34,13,'5');Fl(17,13,19,13,'1');Fl(31,14,32,19,'1');Fl(32,20,32,26,'5');
  Fl(29,27,35,33,'1');Fl(31,34,32,36,'1');Fl(14,36,50,36,'2');Fl(14,39,50,40,'2');Fl(31,39,32,47,'0');Fl(30,48,34,51,'1');
  Fl(4,41,12,47,'1');Fl(22,14,27,19,'4');Fl(22,21,27,26,'1');Fl(22,32,27,34,'1');Fl(40,21,46,26,'1');Fl(40,14,44,15,'1');Fl(53,28,57,32,'3');
  Fl(24,42,29,49,'4');Fl(14,41,22,49,'4');Fl(34,42,45,49,'3');Fl(52,41,58,44,'1');Fl(47,46,53,50,'1');Fl(55,46,59,50,'3');Fl(36,18,37,30,'2');Fl(13,21,14,35,'2');
  const water=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(rows[y][x]==='.'){fm[y*W+x]='6';block[y*W+x]=1}};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]==='~'){fm[y*W+x]='6';block[y*W+x]=1}
  /* ---- heights: the court climbs to the castle; the stream and the pond lie low; the bridge and the garden terraces stand up ---- */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let h=.3;if(y<=34)h+=Math.max(0,(34-y))*.02;hgt[y*W+x]=h}
  const raise=(x0,y0,x1,y1,d)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)hgt[y*W+x]+=d};
  raise(14,37,50,38,-.3);raise(32,37,32,38,.55);raise(20,37,20,38,.5);raise(44,37,44,38,.5);raise(31,29,33,31,-.2);raise(42,23,44,24,-.18);
  raise(22,14,27,19,.22);raise(40,21,46,26,-.1);raise(22,21,27,26,-.12);raise(53,28,57,32,.15);raise(30,13,34,13,.1);
  return {C,T,HG,g,W,H,P,B,S,Q,hang,Fl,lampAt,open,water,raise}}
/* ---------- the lanes, the squares, the twelve nooks, the creatures ---------- */
function pscBuild(info){
  const X=pscBase(info),{C,T,HG,g,W,H,P,B,S,Q,hang,Fl,lampAt,open,water}=X;
  const rows=C.rows,block=C.block,fm=C.fm,hs=C.hs,int=Math.floor,F0=pscF;
  const GR=PSC_GREEN,SK=PSC_SICK,WARM=PSC_WARM;
  const thing=(k,id,x,y,o)=>C.thing(k,id,x,y,Object.assign({sc:1},o||{}));
  const nm=(id,name,pic,fn)=>{if(!NPCS[id])khNpc(id,name,pic,fn)};
  const FERN=pscTint('psc_fern','flowerpot','grayscale(.45) hue-rotate(60deg) brightness(.7)',.7);
  const BENCH=pscTint('psc_mossbench','gy_bench','sepia(.4) hue-rotate(80deg) saturate(1.6) brightness(.7)',.55);
  const WELL=pscTint('psc_springpic','well','grayscale(.6) brightness(.9)',1.0);
  const STONETREE=pscTint('psc_stonetree','gy_dead','grayscale(1) brightness(1.1) contrast(.9)',2.6);
  const SROSE=pscTint('psc_rosepic',pspPic('rose_pale'),'brightness(1.1)',.9);
  const LEVER=pscTint('psc_lever','gy_lever','grayscale(.6) brightness(1.1)',.9);
  const chest=(x,y,o)=>{const d=P('gy_chest',x,y,{block:true,sc:.95});if(d){PSC.chest['9730:'+x+','+y]=o||{pot:2,mana:1,gold:1500}}return d};
  const hedge=(x,y,kind)=>{if(g[y][x]==='.'&&rows[y][x]==='.'&&!C.used.has(x+','+y)){C.solid(x,y,C.ch(HG[kind||'high'][int(hs(x,y,9)*4)]));g[y][x]='h';fm[y*W+x]='4'}};
  const NAMES=['st_mourners','st_chimera','st_hydra','st_judge','st_gargoyle','st_headless','st_judge','st_veiled','st_hand','st_bishop'];
  const wakers={};const reserveWake=(t,x,y)=>{wakers[x+','+y]=t};
  const plaque=(x,y,key,lines,text)=>{const id='psc_pl_'+key,k=blSlab('psc_slab_'+key,lines,{h:.95,top:.18,span:.62});if(!NPCS[id])khNpc(id,'A plaque',k,()=>say(text,[BYE]));return C.thing(k,id,x,y,{sc:1})};
  /* ===== the dressing of every lane: lanterns on brackets (a lit lantern every seventh square), ivy and vines hung on the walls, alcoves with creepy statues set into the wall ===== */
  const isDoorCell=(x,y)=>{const c=rows[y]&&rows[y][x];return c&&c!=='.'&&KH_DOOR[C.chars[c]]};
  const wallAt=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&g[y][x]==='#'&&!isDoorCell(x,y);
  const sideWd=(x,y,salt)=>{const c=[[0,-1],[0,1],[-1,0],[1,0]].filter(([a,b])=>wallAt(x+a,y+b));return c.length?c[int(hs(x,y,salt)*c.length)]:null};
  const ALC=['alcove_weeper','alcove_monk','alcove_knight','alcove_maiden','alcove_empty'];
  PSC_LANES.forEach((ln,li)=>{const [nmx,x0,y0,x1,y1]=ln,horiz=(x1-x0)>(y1-y0);
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(g[y][x]!=='.')continue;const idx=horiz?x:y,wd=sideWd(x,y,3+li);if(!wd)continue;
      if((idx+li*3)%7===0&&!(x>=30&&x<=34&&y>=11&&y<=13)){hang('lantern_bracket',x,y,wd,.9);lampAt(x,y,hs(x,y,71)<.35?WARM:SK)}
      else if(hs(x,y,61+li)<.13)hang(hs(x,y,62)<.5?'vine_a':'vine_b',x,y,wd,0);
            else if(hs(x,y,63+li)<.03)hang(ALC[int(hs(x,y,64)*5)],x,y,wd,0)}});
  /* creepy statues in the recesses of the walls (each stands in a hole of its own) */
  [[6,17,'alcove_weeper'],[6,28,'alcove_monk'],[57,19,'alcove_knight'],[57,27,'alcove_maiden'],[13,20,'alcove_empty'],[21,20,'alcove_weeper']].forEach(([x,y,n],i)=>S(n,x,y));
  /* ===== THE CASTLE ROW (y 11 and 12): lanterns, ivy, gargoyles, an arch every few steps; the lane is narrowed by plinths ===== */
  for(const x of [12,26,38,50])S(NAMES[(x>>1)%10],x,11);
  
  for(const x of [6,57])B('urn_big',x,12,{sc:.9});
  plaque(34,13,'great',['THE GREAT','DOOR'],'A plaque beside the great door. THE GREAT DOOR. It leads into the Great Halls. The black oak doors are open.');
  plaque(16,11,'gallery',['THE GALLERY','DOOR'],'A plaque beside the gallery door. THE GALLERY DOOR. It leads to the Gallery of Portraits.');
  plaque(14,26,'kitchen',['THE KITCHEN','DOOR'],'A plaque beside a plain low door in the west wing. THE KITCHEN DOOR. Tradesmen and servants only.');
  plaque(50,26,'cloister',['THE CLOISTER','DOOR'],'A plaque beside a carved door in the east wing. THE CLOISTER DOOR. It leads to the cloister, the chapel and the library. The leaves on the door are carved so well that they look wet.');
  plaque(34,50,'court',['THE COURT','OF STATUES'],'A black stone plaque. THE COURT OF STATUES. Under it, in smaller letters: Keep to the cobbles. Do not stare at the ones that stare. Do not touch the roses. The clock tower is straight ahead, to the north.');
  /* ===== the gate yard and the Torstrasse: gate piers, urns, an arch, the street climbs north ===== */
  lampAt(30,49,SK);lampAt(34,49,SK);for(const [x,y,n] of [[30,47,'lantern_red_a'],[34,47,'lantern_red_b'],[31,35,'lantern_red_a'],[33,35,'lantern_red_b'],[31,18,'lantern_red_a'],[33,18,'lantern_red_b']]){if(C.isOpen(x,y)){Q(n,x,y);lampAt(x,y,PSG_RED)}}
  S('st_veiled',31,44);S('st_hand',32,43);S('st_bishop',31,40);
  for(const y of [40,47])B('urn_big',32,y,{sc:1});
  /* ===== the clock tower and the walk-under passage ===== */
  for(const y of [21,23,25])hang(ALC[(y>>1)%5],32,y,[y%2?-1:1,0],0);
  Q('bell_big',32,22,{sc:.8,bob:1.5});lampAt(32,21,GR);lampAt(32,25,GR);
  /* ===== the fountain square under the clock: the weeping giant's basin in the middle, statues on plinths, benches, ring of lamps ===== */
  
  S('st_fountain',32,30);
  for(const [x,y,n] of [[29,27,'st_judge'],[35,27,'st_bishop'],[29,33,'st_veiled'],[35,33,'st_chimera']])S(n,x,y);
  B(BENCH,29,32,{sc:.9});B(BENCH,35,32,{sc:.9});B('urn_big',30,28,{sc:.85});B('urn_big',34,28,{sc:.85});
  lampAt(30,32,GR);lampAt(34,32,GR);lampAt(30,28,SK);lampAt(34,28,SK);
  /* ===== the stream: iron rails, a stone bridge on the Torstrasse and two footbridges ===== */
  for(const bx of [32,20,44])for(const by of [37,38])for(const sx of [-.42,.42])P(pspPic('bridge_rail'),bx,by,{block:false,ox:sx,sc:1,oy:0});
  lampAt(32,36,SK);lampAt(20,36,GR);lampAt(44,36,GR);
  for(let x=15;x<=49;x+=2)if(x!==32&&x!==20&&x!==44&&x!==31&&x!==33)P(pspPic('iron_rail'),x,36,{block:false,oy:.44});
  
  /* ===== the vines: curtains of ivy over the stream wall and the back walls ===== */
  for(let x=15;x<=49;x+=3)hang(x%2?'vine_a':'vine_b',x,36,[0,-1],0);
  /* ===== THE WAYSTONE NOOK (8,44): hedge walls, two kneeling knights, a bench and a lamp; no creature comes within 8 ===== */
  for(const y of [41,42,43,46,47])hedge(6,y,'bloom');for(let x=7;x<=12;x++)hedge(x,47,'bloom');hedge(7,41,'bloom');hedge(8,41,'bloom');hedge(12,46,'bloom');
  S('st_headless',7,43);S('st_headless',7,45);B(BENCH,11,46,{sc:1});lampAt(8,42,[.9,1.2,1.0]);lampAt(11,44,[.9,1.2,1.0]);
  plaque(12,42,'waystone',['THE WAYSTONE','NOOK'],'THE WAYSTONE NOOK. A plaque on the hedge. The stone in the middle carries a party back to the towns it knows. Nothing in the Court of Statues comes into this nook. Rest your feet.');
  /* ===== THE WEEPING ALCOVE (22..27,32..34): mourners round a chest and the plaque with the order of the hydra's necks ===== */
  S('st_mourners',22,32);S('st_mourners',27,32);S('st_mourners',22,34);S('st_mourners',27,34);reserveWake('psmourner',23,33);reserveWake('psmourner',26,33);
  chest(24,34,{pot:3,mana:2,elixir:1,gold:1800});
  plaque(25,32,'order',['THE HYDRA','1 2 3 4 5'],'A plaque in the Weeping Alcove. THE HYDRA. Five necks, counted from the left. Pull them in this order: three, one, five, two, four. Then the pool will remember water.');
  lampAt(24,32,GR);
  /* ===== THE ROSE GARDEN (24..29,42..49): a hedge path in an S, eight silver roses; the Thorn Warden walks it ===== */
  for(let x=24;x<=27;x++)hedge(x,45,'bloom');for(let x=26;x<=29;x++)hedge(x,48,'bloom');
  const ROSES=[[24,42],[27,42],[25,44],[28,44],[25,47],[28,47],[24,49],[27,49]];
  ROSES.forEach(([x,y],i)=>{const id='psc_rose'+i;
    nm(id,'A silver rose',SROSE,d=>{const Fc=pscF();if(Fc.taken[id])return say('The stem is cut. A little silver sap runs down it.',[BYE]);
      return say('A silver rose in full flower. The petals are the colour of the moon on frost, and the heart is green-black. It leans toward your hand, and it is not a gentle lean.',[['Cut it.',()=>{Fc.taken[id]=1;Fc.roses=(Fc.roses|0)+1;pscGone(d);bl3Give('psroses');sfx('key');msg('You cut a silver rose. It bites your thumb on the way out of the bush.','#e8e8f8');G.talk=null;return null}],BYE])});
    thing(SROSE,id,x,y,{sc:1});bl3Hide(9730,id,()=>pscF().taken[id])});
  plaque(29,42,'rose',['THE ROSE','GARDEN'],'THE ROSE GARDEN. A plaque in the wall. These roses were not planted. They came up by themselves the year the statues began, and the gardener has cut them every week since.');
  lampAt(28,46,GR);P('urn_big',29,43,{block:true,sc:.9});
  /* ===== THE GARGOYLE ARBOUR (22..27,14..19): gargoyles on pillars, a small spring, a gate in the wall ===== */
  S('st_gargoyle',22,14);S('st_gargoyle',27,14);reserveWake('psgargoyle',22,19);reserveWake('psgargoyle',27,19);
  for(const [x,y] of [[23,15],[26,15],[23,18],[26,18]])B(pspPic('col_twist'),x,y,{sc:.9});
  nm('psc_spring','A small spring',WELL,()=>{if(PSC.springUsed)return say('The spring is clear and very cold. You have drunk what you wanted.',[BYE]);
    return say('A small spring, running out of a cleft in a block of black stone and into a round basin. It tastes of iron and snow.',[['Drink.',()=>{PSC.springUsed=1;pscHeal(.12);sfx('potion');G.talk=null;msg('The cold water clears your heads. A little of the weariness goes.','#bfe0ff');return null}],BYE])});
  thing(WELL,'psc_spring',25,16,{sc:1});B(BENCH,22,17,{sc:.9});lampAt(25,18,GR);
  /* ===== THE HYDRA POOL (22..27,21..26): a dry pool, five stone necks along the north wall to pull in the order of the plaque ===== */
  Fl(24,23,26,24,'3');S('st_hydra',25,23);
  [22,23,24,25,26].forEach((x,i)=>{const id='psc_neck'+(i+1);
    nm(id,'A stone neck',LEVER,()=>{const Fc=pscF();if(Fc.hydra)return say('The pool is full. The hydra\'s necks are slack and still.',[BYE]);
      return say('The '+['first','second','third','fourth','fifth'][i]+' neck of the hydra, counted from the left, with a stone handle where the head should be.',[['Pull it.',()=>{G.talk=null;Fc.necks=(Fc.necks||[]).concat(i+1);sfx('door');
        const seq=Fc.necks,ok=PSC.NECKS.slice(0,seq.length).every((v,j)=>v===seq[j]);
        if(!ok){Fc.necks=[];msg('A grinding sound, and the necks all spring back. Wrong. Start again.','#d0b8e8');return null}
        if(seq.length===5){Fc.hydra=1;Fc.necks=[];msg('A deep gurgle runs under the floor. Water climbs up out of the stone and fills the pool, and a stone drawer slides out of the hydra\'s plinth.','#bfe0ff');
          try{const L=LEVELS[9730],Wd=L.rows[0].length;const a=G.fmap.split('');for(let y=23;y<=24;y++)for(let x2=24;x2<=26;x2++)a[y*Wd+x2]='6';G.fmap=a.join('')}catch(e){}
          const g2=pscDecorOf('psc_hydragems');if(g2&&g2.hidden){g2.hidden=false;g2.found=false;g2.block=true}}
        else msg('Click. '+seq.length+' of 5.','#c8c8e8');return null}],BYE])});
    thing(LEVER,id,x,21,{sc:1})});
  nm('psc_hydragems','A stone drawer',pspPic('st_hand'),d=>{const Fc=pscF();if(Fc.gems)return say('The drawer is empty.',[BYE]);
    return say('A drawer of black stone, and in it a heap of cut stones and old coins.',[['Take them.',()=>{Fc.gems=1;pscGone(d);bl3Give('gem_diamond');bl3Give('gem_sapphire');bl3Give('gem_tanzanite');G.gold+=2400;sfx('key');msg('You take three gems and 2400 gold from the drawer.','#ffe36a');G.talk=null;return null}],BYE])});
  {const d=thing(pspPic('st_hand'),'psc_hydragems',27,23,{sc:.5});if(d&&!pscF().hydra){d.hidden=true;d.found=true;d.block=false}}
  bl3Hide(9730,'psc_hydragems',()=>!pscF().hydra||pscF().gems);
  plaque(22,26,'hydra',['THE HYDRA','POOL'],'THE HYDRA POOL. A plaque. The pool is dry. The five necks are handles. The order of the pulls is written on a plaque in the Weeping Alcove, south of the weavers\' lane.');
  lampAt(27,25,GR);
  /* ===== THE MIRROR POND (40..46,21..26): a still pool, Lady Ysmay, an alley with a gate ===== */
  S('st_veiled',41,22);S('st_veiled',45,22);B(BENCH,40,26,{sc:.9});B(BENCH,46,26,{sc:.9});lampAt(43,22,SK);lampAt(43,26,GR);
  C.person('psc_ysmay',41,25,1);
  plaque(46,24,'pond',['THE MIRROR','POND'],'THE MIRROR POND. The water does not move and does not ripple. Look in it long enough and you see the court as it was before the statues.');
  /* ===== THE LANTERN BENCH (40..44,14..15): a bench between two veiled maidens, the one warm lantern of the court ===== */
  S('st_veiled',40,14);S('st_veiled',44,14);
  nm('psc_lbench','The lantern bench',BENCH,()=>{if(PSC.benchUsed)return say('You have sat here already. The lantern is still warm, and so is the bench.',[BYE]);
    return say('A stone bench between two veiled maidens, and over it a lantern on a hook. The flame in the lantern is yellow, the only warm light in the court, and it has never gone out.',[['Sit a while.',()=>{PSC.benchUsed=1;pscHeal(.15);sfx('potion');G.talk=null;msg('You sit in the lantern light. The ache goes out of your legs.','#ffd9a0');return null}],BYE])});
  thing(BENCH,'psc_lbench',42,14,{sc:1.1});lampAt(42,15,WARM);
  /* ===== THE BARROW CORNER (55..59,46..50) ===== */
  S('st_hand',55,46);S('st_veiled',59,46);S('st_hand',55,50);S('st_veiled',59,49);
  B('gy_barrow',58,47,{sc:1.1});chest(57,50,{pot:2,mana:1,gold:1400});lampAt(57,46,GR);
  /* ===== THE HEADLESS KNIGHTS' CORNER (47..53,46..50): knights facing the wall, the second from the east is a lever ===== */
  for(const x of [48,52])S('st_headless',x,46);S('st_headless',50,49);
  nm('psc_knightlever','A headless knight',pspPic('st_headless'),()=>{const Fc=pscF();if(Fc.knight)return say('The sixth knight stands as it stood. The lever in its hand is down.',[BYE]);
    return say('The knight second from the east end holds a stone sword upright, and the cross-guard is a handle. It is the only one whose hand is loose.',[['Pull the sword.',()=>{Fc.knight=1;sfx('door');G.talk=null;msg('A niche opens in the wall behind the knights with a sound like grinding teeth.','#c8c8e8');const g2=pscDecorOf('psc_nichering');if(g2){g2.hidden=false;g2.found=false;g2.block=true}return null}],BYE])});
  thing(pspPic('st_headless'),'psc_knightlever',53,48,{sc:1});
  nm('psc_nichering','A niche',pspPic('st_hand'),d=>{const Fc=pscF();if(Fc.ring)return say('The niche is empty.',[BYE]);
    return say('A small dark niche with a ring on a velvet cushion, and a card that says: for the one who looked behind them.',[['Take the ring.',()=>{Fc.ring=1;pscGone(d);bl3Give('psknightring');sfx('key');msg('You take the Ring of the Headless Guard.','#ffe36a');G.talk=null;return null}],BYE])});
  {const d=thing('gy_niche','psc_nichering',47,49,{sc:.7});if(d&&!pscF().knight){d.hidden=true;d.found=true;d.block=false}}
  bl3Hide(9730,'psc_nichering',()=>!pscF().knight||pscF().ring);lampAt(50,48,GR);
  /* ===== THE SCULPTOR'S YARD (34..45,42..49): Ossian's workshop, half carved statues, a ring to walk round ===== */
  for(const [x,y,n] of [[36,43,'st_chimera'],[44,43,'st_bishop'],[36,48,'st_judge'],[44,48,'st_hydra'],[39,45,'st_hand'],[41,46,'st_mourners'],[34,46,'st_gargoyle']])S(n,x,y);
  chest(45,49,{pot:3,mana:2,elixir:1,gold:2600});lampAt(35,44,GR);lampAt(43,47,SK);
  plaque(34,43,'yard',['THE SCULPTOR\'S','YARD'],"THE SCULPTOR'S YARD. A plaque on a half-carved block. Visitors are asked not to touch the unfinished. The unfinished are sensitive.");
  /* ===== THE KNOT (14..22,41..49): a hedge maze of 4 by 4 paths with a chest at its heart ===== */
  {const x0=14,y0=41,N=4,E=new Set(),vis=new Set(),R=blRng(4242),key=(a,b)=>a+','+b,st=[[0,0]];vis.add('0,0');
   while(st.length){const [a,b]=st[st.length-1],ds=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>{const na=a+dx,nb=b+dy;return na>=0&&nb>=0&&na<N&&nb<N&&!vis.has(key(na,nb))});
     if(!ds.length){st.pop();continue}const [dx,dy]=ds[(R()*ds.length)|0],na=a+dx,nb=b+dy;vis.add(key(na,nb));E.add(key(a*2+1+dx,b*2+1+dy));st.push([na,nb])}
   for(let gy=0;gy<9;gy++)for(let gx=0;gx<9;gx++){const x=x0+gx,y=y0+gy;if(rows[y][x]!=='.')continue;fm[y*W+x]='4';
     const odd=gx%2===1&&gy%2===1;if(odd)continue;
     const passage=(gx%2===1||gy%2===1)&&E.has(gx+','+gy);
     if(gx===0||gy===0||gx===8||gy===8){if(gy===8&&gx===3)continue;hedge(x,y,'yew');continue}
     if(passage)continue;hedge(x,y,'yew')}
   chest(x0+5,y0+5,{pot:2,mana:2,elixir:1,gold:2200});S('st_hand',x0+1,y0+1);
   plaque(19,50,'knot',['THE KNOT',''],'THE KNOT. A little hedge maze, four paths by four. The way in is at the south. The heart is a little right of the middle. Gardeners have been lost in it, and one of them was only a statue.')}
  /* ===== THE ORCHARD OF STONE FRUIT (53..57,28..32): trees hung with stone apples; one is real ===== */
  [[54,29],[56,29],[55,30],[54,31],[56,31],[57,32]].forEach(([x,y],i)=>{const id='psc_apple'+i;
    nm(id,'A tree of stone apples',STONETREE,d=>{const Fc=pscF();
      if(i===2){if(Fc.apple)return say('Only stone apples are left on this tree.',[BYE]);return say('A pale tree hung with apples of grey stone. One of them, on a low branch, has a bruise on its side, and a bruise is not a thing that a stone has.',[['Pick the bruised one.',()=>{Fc.apple=1;if(!bagAdd(mkItem('apple')))G.items.push({k:'apple',x:G.P.x,y:G.P.y,taken:false});sfx('key');G.talk=null;msg('It is a real apple, cold and sweet.','#cfe8c8');return null}],BYE])}
      return say('A pale tree hung with apples of grey stone. You pick one up. It is stone, all the way through.',[BYE])});
    thing(STONETREE,id,x,y,{sc:1})});
  plaque(53,28,'orchard',['THE ORCHARD','OF STONE FRUIT'],'THE ORCHARD OF STONE FRUIT. A plaque. The fruit is not for eating. One of the apples was left by mistake.');lampAt(55,28,GR);
  plaque(12,26,'lodge',['THE GARDENER\'S','LODGE'],"THE GARDENER'S LODGE. A plaque by the door. Hobb Ashby, gardener. Knock before you come in. A fire is lit. Boots off.");
  plaque(56,42,'mews',['THE MEWS','AND STABLE'],'THE MEWS AND STABLE. A plaque by a wide door. The hawks have not been fed for a long time and have not minded.');
  /* ===== the rest of the lanes, each with something of its own ===== */
  // west perimeter: a long ivy stair, a well, benches under the wall (the wall stair is at the south end)
  lampAt(5,34,GR);
  // east perimeter: a handcart, barrels, a rubble heap, a bell on a post
  B('bell_frame',59,28,{sc:1});lampAt(58,34,GR);
  // the gallery lane and the kitchen lane
  
  // the weavers' lane: a well, a cart, drying frames of cloth
  
  // the great lane north of the tower and the lantern lane
  for(const y of [15,18])S(NAMES[(y*3)%10],31,y);
  // the hound lane, the coppersmiths' lane, the cloister lane
  S('st_veiled',37,20);B('urn_big',43,29,{sc:1});
  
  // the south lanes
  
  for(let x=6;x<=29;x+=3)hang(x%2?'vine_a':'vine_b',x,51,[0,1],0);for(let x=36;x<=58;x+=3)hang(x%2?'vine_b':'vine_a',x,51,[0,1],0);
  /* ===== the creatures ===== */
  const ok=(x,y)=>Math.hypot(x-32,y-49)>=12&&!pscSafe(x,y,9)&&!pscNearFront(x,y,3)&&rows[y]&&rows[y][x]==='.';
  const foe=(t,x,y,rad)=>{const q=C.near(x,y,rad||3,false);if(q&&ok(q[0],q[1]))C.foe(t,q[0],q[1])};
  for(const k in wakers){const [x,y]=k.split(',').map(Number);if(ok(x,y))C.foe(wakers[k],x,y)}
  const WK=[['psgargoyle',[[10,12],[46,12],[54,11],[28,12]]],['pschimera',[[20,18],[36,27],[46,34],[40,41]]],['pshydra',[[19,24],[47,42]]],['psmourner',[[57,31],[24,30]]],['psjudge',[[20,32],[38,26],[32,41]]]];
  for(const [t,l] of WK)for(const [x,y] of l)foe(t,x,y,1);
  for(const [x,y] of [[8,35],[42,36],[28,50],[48,50]])foe('pshedger',x,y);
  for(const [x,y] of [[24,43],[26,48],[56,29],[22,46]])foe('psthornsprite',x,y,2);
  for(const [x,y] of [[54,30],[25,16],[41,22],[57,48]])foe('psmoth',x,y,2);
  for(const [x,y] of [[31,44],[32,46],[31,16],[32,14],[32,34],[33,41]])foe('psguard',x,y,1);
  /* the five wanderers, each on a loop of open ground (PSC.loops) */
  PSC.loops.pscolossus=[[30,28],[34,28],[34,32],[30,32]];
  PSC.loops.psgargmother=[[9,12],[30,11],[55,12],[30,12]];
  PSC.loops.psthornwarden=[[24,33],[22,31],[19,33],[22,35]];
  PSC.loops.psossian=[[45,43],[45,47],[42,47],[42,44]];
  PSC.loops.pshoundmaster=[[40,17],[37,17],[37,29],[44,30],[37,29],[37,17]];
  C.foe('pscolossus',30,28);C.foe('psgargmother',9,12);C.foe('psthornwarden',24,33);C.foe('psossian',45,43);C.foe('pshoundmaster',40,17);
  for(const e of C.enemies)e.lvl=(e.t==='pscolossus'||e.t==='psgargmother'||e.t==='psthornwarden'||e.t==='psossian'||e.t==='pshoundmaster')?102:Math.max(100,Math.min(102,Math.round(100+2*(50-e.y)/36)));
  /* map names for the parchment sheet */
  C.mapNames.push({t:'The Great Door',x:32,y:12,k:'place'},{t:'The Gallery Door',x:18,y:12,k:'place'},{t:'The Kitchen Door',x:14,y:24,k:'place'},{t:'The Cloister Door',x:50,y:24,k:'place'},{t:'The Clock Tower',x:32,y:23,k:'place'},{t:'The Fountain Square',x:32,y:30,k:'place'},{t:'The Courtyard Gate',x:32,y:49,k:'place'},
    {t:'The Waystone Nook',x:8,y:44,k:'place'},{t:'The Weeping Alcove',x:24,y:33,k:'place'},{t:'The Rose Garden',x:26,y:46,k:'place'},{t:'The Gargoyle Arbour',x:25,y:17,k:'place'},{t:'The Barrow Corner',x:57,y:48,k:'place'},{t:"The Headless Knights' Corner",x:50,y:48,k:'place'},
    {t:"The Sculptor's Yard",x:40,y:46,k:'place'},{t:'The Hydra Pool',x:25,y:23,k:'place'},{t:'The Mirror Pond',x:43,y:24,k:'place'},{t:'The Lantern Bench',x:42,y:15,k:'place'},{t:'The Knot',x:18,y:45,k:'place'},{t:'The Orchard of Stone Fruit',x:55,y:30,k:'place'},
    {t:"The Gardener's Lodge",x:10,y:41,k:'place'},{t:'The Mews and Stable',x:54,y:41,k:'place'},{t:'The Stream',x:26,y:37,k:'place'});
  for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if(C.rows[d.y]&&C.rows[d.y][d.x]!=='.'&&!d.npc)C.decor.splice(i,1)}   // a hedge or wall laid over a prop takes the prop away
  const lv=C.finish({start:{x:32,y:49,f:0},col:PSC_SICK});
  lv.floorSet=PSC_FLOORSET.slice();lv.floor=lv.floorSet[0];lv.day=.74;lv.amb=.86;lv.ceilH=9;lv.ceil=CEILS.psc_sky?'psc_sky':lv.ceil;lv.name=info.name;lv.label=info.name;
  lv._psc={lcol:C.lcol,col:PSC_SICK};lv.noTele=false;lv.tele=PSC.TELE;
  lv.sky=lv.sky||[];
  return lv}

/* ---------- the Gardener's Lodge (rest room, 9731, 16x14) and the Mews and Stable (9732, 20x16) ---------- */
function pscWidenRoom(L,w,h){   // the contract sizes are one row more than the room maker's: pad with wall
  while(L.rows.length<h)L.rows.push('w'.repeat(L.rows[0].length));
  if(L.rows[0].length<w)L.rows=L.rows.map(r=>r+'w'.repeat(w-r.length))}
function pscRoomDoor(L,l){   // the room maker's plain exit square becomes a door tile of the shared kind (KH_DOOR.psp), so the link tests and the key/seal glue see it
  const gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[pspDoorGid('oak',2.5)];KH_DOOR[gid]={get lvl(){return l.to},get at(){return {x:l.land[0],y:l.land[1],f:l.land[2]}},psp:l,lock:null,prov:false,pspName:l.name};
  const ch='d';L.chars=Object.assign({},L.chars||{});L.chars[ch]=gid;
  const r=L.rows[l.at[1]];L.rows[l.at[1]]=r.slice(0,l.at[0])+ch+r.slice(l.at[0]+1)}
function pscLodge(info){
  /* rebuilt with the castle kit (it was a Khemetra wooden room: plank floor and ceiling, one flat wall): slate flags, banded stone walls, a muted lamp glow, pieces that stand against the walls */
  const WARM=[1.2,.9,.58];
  const C=pspMake({id:9731,start:{x:8,y:10,f:0},wh:3.0,floor:'slate',wall:'ash',amb:.42,lcol:WARM});C.warmCol=WARM;C.warm=WARM;
  C.room(3,3,12,11,{floor:'slate',name:info.name,at:[8,7],warm:true});
  psgDressWalls(C,{wh:3.0,win:0,set:['string','ash','string','brick'],rhythm:1});
  psgDim(['window_sheeted_c','hearth_cold'],'brightness(.62) saturate(.55)');
  C.links({style:{'out of the lodge':'oak'}});
  /* the north wall: a cold hearth, a vine, the desk, a sconce each side; the bed against the east wall; a chest and barrels in the two south corners; one urn each side of the door */
  C.prop('hearth_cold',4,3,{block:true,sc:.8});C.prop('furn_desk',9,3,{block:true,sc:.8});
  C.picture('vine_a',7,3,[0,-1]);C.picture('sconce_black',6,3,[0,-1],{bob:1.0});C.picture('sconce_black',11,3,[0,-1],{bob:1.0});
  C.prop('straw_bed',12,7,{block:true,sc:1.2});C.picture('window_sheeted_c',3,7,[-1,0]);
  const ch=C.chest(4,10,{tier:0});if(ch)ch.sc=.75;PSC.chest['9731:4,10']={pot:3,mana:2,elixir:1,gold:900};
  C.prop('barrels',12,10,{block:true,sc:.9});
  C.prop('urn_big',7,11,{block:true,sc:.75});C.prop('urn_big',9,11,{block:true,sc:.75});
  C.picture('cobweb_corner_a',3,3,[0,-1]);C.picture('cobweb_corner_b',12,3,[0,-1]);
  C.light(5,4,WARM);C.light(8,7,WARM);C.light(11,9,WARM);
  C.person('psc_gardener',8,6,1);
  psgNoLooseArch(C);
  return C.finish({start:{x:8,y:10,f:0}})}
function pscMews(info){
  /* rebuilt with the castle kit: cobbled stable floor, banded stone walls; the falconer between two twisted columns, a perch each side of him, two stone troughs, the feather perch and the glove chest near the door */
  const G1=[.8,1.15,.95];
  const C=pspMake({id:9732,start:{x:10,y:12,f:0},wh:3.4,floor:'cobble',wall:'ash',amb:.2,lcol:PSP_PAL.silver});
  C.room(3,3,16,13,{floor:'cobble',name:info.name,at:[10,8]});
  C.setFloor(8,3,12,6,'flagdark');
  psgDressWalls(C,{wh:3.4,win:0,set:['string','ash','string','ash','moss'],rhythm:1,slits:1});
  psgDim(['window_sheeted_a'],'brightness(.58) saturate(.55)');
  C.links({style:{'out of the mews':'oak'}});
  C.prop('col_twist',8,3,{block:true,sc:.9});C.prop('col_twist',12,3,{block:true,sc:.9});
  for(const x of [5,15])C.prop('gy_rpost',x,3,{block:true,sc:1.1});
  C.prop('font',3,8,{block:true,sc:.9});C.prop('font',16,8,{block:true,sc:.9});
  C.dec('gy_rpost',7,11,{npc:'psc_feather',block:true,solid:1,deco:false,sc:1.0});
  C.dec('gy_chest',3,12,{npc:'psc_glovechest',block:true,solid:1,deco:false,sc:.8});
  C.picture('window_sheeted_a',10,3,[0,-1]);C.picture('chains',3,5,[-1,0]);C.picture('chains',16,5,[1,0]);
  C.picture('cobweb_corner_a',3,3,[0,-1]);C.picture('cobweb_corner_b',16,3,[0,-1]);
  for(const [x,y] of [[4,5],[15,5],[5,9],[14,10]])pspFoe(C,'psraven',x,y);
  for(const [x,y] of [[5,4],[14,4],[10,8],[5,11],[15,11]])C.light(x,y,G1);
  C.person('psc_falconer',10,5,1);
  psgNoLooseArch(C);
  return C.finish({start:{x:10,y:12,f:0}})}
nmFeather();
function nmFeather(){
  khNpc('psc_feather','A perch by the door','gy_rpost',d=>{const F=pscF();
    if(F.feather)return say('The perch is bare. The ravens on the other perches have all turned to look at you.',[BYE]);
    return say('A perch with one pale feather lying on it, laid straight, as if for somebody to find. The falconer ghost warned you about it.',[['Take the feather.',()=>{F.feather=1;G.talk=null;sfx('rattle');msg('As your fingers close on the feather, every raven in the room opens its eyes.','#d0b8e8');return null}],['Leave it.',()=>null]])});
  khNpc('psc_glovechest','A chest in the third stall','gy_chest',d=>{const F=pscF();
    if(F.glove)return say('The chest is empty. The lining still smells of leather and feathers.',[BYE]);
    return say('A small chest in the third stall, with a falcon on the lid, carved by somebody who loved falcons. It is not locked.',[['Open it.',()=>{F.glove=1;pscGone(d);bl3Give('psglove');sfx('key');G.talk=null;msg('You take a worn falcon glove from the chest.','#ffe36a');return null}],BYE])})}
/* ---------- the rings of the quest map and the Go to rows are added by package 6; the quest rings are ours ---------- */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx});
  QRF.T.psq3={give:[N(9730,'psc_ysmay')],act:[E(9730,/^psossian$/)],ready:[N(9730,'psc_ysmay')]};
  QRF.T.psq4={give:[N(9731,'psc_gardener')],act:[N(9730,'psc_rose0','psc_rose1','psc_rose2','psc_rose3','psc_rose4','psc_rose5','psc_rose6','psc_rose7')],ready:[N(9731,'psc_gardener')]};
  QRF.T.psq5={give:[N(9732,'psc_falconer')],act:[N(9732,'psc_glovechest'),E(9730,/^pshoundmaster$/)],ready:[N(9732,'psc_falconer')]}}
/* ---------- registration (ps_core pspRegister; ids and sizes are in ps_ids.js) ---------- */
pspRegister(9730,pscBuild,{names:{9731:"The Gardener's Lodge",9732:'The Mews and Stable'},rating:{9731:101,9732:101}});
pspRegister(9731,pscLodge);pspRegister(9732,pscMews);

