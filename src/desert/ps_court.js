/* ==========================================================================
   THE PALE SPIRE, PACKAGE 2: THE COURT OF STATUES (prefix psc / PSC). Levels 9730 (the courtyard, outdoor, 96x88, rating 101), 9731 (the Gardener's Lodge, rest room) and 9732 (the Mews and Stable).
   The contract (ids, sizes, link squares) is in ps_ids.js; the plan is tools/PALE_SPIRE_PLAN.md (package 2); what is built and what is stand-in is in tools/PALE_SPIRE_NOTES.md.
   WHAT IS HERE
   1. art loading for the three levels, floors, wall tiles painted in code (pale ashlar facade with gothic windows, arcades, balconies, ivy veils, the four doors, towers), silver hedges (garden_hedges.js gmHedge)
   2. the creatures: statues that wake (pscs), patrols, the five slow wandering mini bosses (loops, PSC.loops), drops, safe zone round the Waystone Nook
   3. the courtyard builder pscBuild (lawns, plaza with the great fountain, arcaded pavilions with a bridging arch, twelve nooks, statues, people, quests), the lodge and the mews
   Everything that is a person, a statue or a creature uses pspPic(name) / 'ps_c_<id>' (ps_core.js), so painted pieces from assets/ps drop in with no code change.
   ========================================================================== */
const PSC={ID:9730,LODGE:9731,MEWS:9732,W:96,H:88,R:101,TELE:[12,76],loops:{},lamps:[],benchUsed:false,
  FRONTS:[[48,18],[28,18],[22,34],[74,34]],   // the four door fronts: no creature within 3 squares
  NECKS:[3,1,5,2,4]};   // the order of the five hydra necks (the plaque in the Weeping Alcove says it)
const pscIs=n=>n>=9730&&n<=9739;
const pscF=()=>{const F=pspF();return F.c||(F.c={necks:[],roses:0,taken:{}})};
const pscQ=(id,title,who,steps,reward,extra)=>{const q=yrQ(id,title,who,steps,reward,extra);QAREA[id]=PSP.REGION;return q};
const pscSafe=(x,y,r)=>Math.hypot(x-PSC.TELE[0],y-PSC.TELE[1])<=(r||8);
const pscNearFront=(x,y,r)=>PSC.FRONTS.some(f=>Math.hypot(x-f[0],y-f[1])<=(r||3))||Math.hypot(x-48,y-83)<=3||Math.hypot(x-14,y-64)<=3||Math.hypot(x-82,y-66)<=3;
/* ---------- art: the same loader the Blighted Road uses (the graveyard, witch wood and Wenlock pictures are the stand-ins' sources) ---------- */
const pscNeedArt=()=>typeof blNeedArt==='function'?blNeedArt():false;
function pscWait(then){if(PSC._wait)return true;PSC._wait=1;try{msg('The Court of Statues comes into view...','#c8c8e8')}catch(e){}wlLoad().then(()=>{PSC._wait=0;then()}).catch(e=>{PSC._wait=0;console.error('psc load',e)});return true}
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
  if(n===PSC.ID){const F=pscF();if(!F.seen){F.seen=1;try{msg('The Court of Statues. The grass is cut, the hedges are clipped, and everything that stands here is looking at you.','#c8c8e8')}catch(e){}}}
  try{bl3Apply(n)}catch(e){}}
/* the light of the court: a still pale twilight, no night swing */
{const _up=update;update=function(dt){_up.apply(this,arguments);try{if(pscIs(LEVEL)&&LEVELS[LEVEL]&&LEVELS[LEVEL].outdoor)G.day=.82}catch(e){}}}
{const _w=weatherNow;weatherNow=function(){
  if(pscIs(LEVEL)){const L=LEVELS[LEVEL];
    if(L&&L.outdoor)return {id:'mist',n:'Pale mist',fog:.014,haze:.3,dark:1,mix:.55,col:[176,170,214],text:'A thin silver mist lies on the grass. The sky is pale lilac and has no sun in it. Nothing moves, and everything looks.'};
    return null}
  return _w.apply(this,arguments)}}
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(pscIs(LEVEL)){const L=LEVELS[LEVEL],lc=(L._psc&&L._psc.lcol)||{};
    for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=lc[key]||(L._psc&&L._psc.col)||[.9,1.0,1.3];l.kI=L.outdoor?1.15:1.3;l.range2=L.outdoor?75:120;l.calm=true}}}catch(e){console.error('psc lights',e)}
  return r}}
if(typeof TELE_KEEP_HI!=='undefined')TELE_KEEP_HI.add(9730);
/* ---------- floors: lawn, white gravel, flags, wet cobbles, dark flower bed, black and white chequer, still water ---------- */
const PSC_FLOORSET=['psf_lawn','psf_gravel','psf_flag','psf_cobble','psf_bed','psf_chequer','psf_water'];
function pscFloors(){
  if(PSC._fl)return;blFloors();
  const tone=(out,src,g,t)=>{if(typeof gyFloorTone==='function'&&FLOORS[src])gyFloorTone(out,src,g,t);if(!FLOORS[out])FLOORS[out]=FLOORS.cobble||FLOORS.grass};
  tone('psf_lawn','gyf_grass',1.05,[.92,1.12,1.0]);
  tone('psf_gravel','gyf_gravel',1.45,[1.02,1.02,1.1]);
  tone('psf_flag','gyf_flag',1.25,[.98,.98,1.1]);
  tone('psf_cobble','gyf_cobble',.62,[.85,.9,1.05]);
  tone('psf_bed','gyf_dirt',.55,[.85,.78,1.0]);
  {const b=FLOORS.psf_flag,N=Math.round(Math.sqrt(b.length/4)),d=new Uint8ClampedArray(b.length);
   for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4,q=(((x*2/N)|0)+((y*2/N)|0))&1,m=q?1.05:.34;d[i]=Math.min(255,b[i]*m*(q?1:.9));d[i+1]=Math.min(255,b[i+1]*m*(q?1:.85));d[i+2]=Math.min(255,b[i+2]*m*(q?1.02:1.15));d[i+3]=255}
   FLOORS.psf_chequer=d}
  if(FLOORS.water&&typeof gyFloorTone==='function')try{gyFloorTone('psf_water','water',1.5,[.85,.95,1.25])}catch(e){}
  if(!FLOORS.psf_water)FLOORS.psf_water=FLOORS.psf_chequer;
  PSC._fl=1}
/* ---------- wall tiles painted in code: pale ashlar, gothic windows, arcades, balconies, ivy veils, doors, towers ---------- */
const PSC_TEX=['texGrey_1','texGrey_3','texGrey_2','texGrey_4'];
function pscTile(key,wh,draw,o){o=o||{};const tex=o.tex||PSC_TEX[(key.length+(o.v||0))%PSC_TEX.length];return gyTile(tex,wh,Object.assign({gain:o.gain||1.62,rgb:o.rgb||[.97,.96,1.12],tag:'psc'+key,draw},o.fac?{fac:o.fac}:{}))}
function pscCourses(x,W,Hp,n){x.fillStyle='rgba(54,50,86,.32)';for(let i=1;i<n;i++){const y=Hp-i*Hp/n;x.fillRect(0,y,W,3);x.fillStyle='rgba(240,242,255,.18)';x.fillRect(0,y+3,W,2);x.fillStyle='rgba(54,50,86,.32)'}}
function pscIvy(x,W,Hp,seed,amt,maxLen){const R=blRng(seed);
  for(let k=0;k<amt;k++){let px=R()*W,len=Hp*(.12+R()*(maxLen||.5));const pts=[[px,0]];
    x.strokeStyle='#26382f';x.lineWidth=1.2+R()*1.6;x.beginPath();x.moveTo(px,-2);
    for(let s=1;s<=8;s++){px+=(R()-.5)*10;const py=len*s/8;pts.push([px,py]);x.lineTo(px,py)}x.stroke();
    for(const [lx,ly] of pts)for(let j=0;j<3;j++){const ox=(R()-.5)*14,oy=(R()-.5)*10,r=2.4+R()*3.4;x.fillStyle=['#2f4a3a','#3d5e48','#4a6e52','#25382d','#587a5c'][(R()*5)|0];x.beginPath();x.ellipse(lx+ox,ly+oy,r,r*.65,R()*3,0,6.3);x.fill()}}}
function pscPointed(x,cx,y1,ww,top,fill,stroke,lw){x.beginPath();x.moveTo(cx-ww/2,y1);x.lineTo(cx-ww/2,top+ww*.55);x.quadraticCurveTo(cx-ww/2,top+ww*.08,cx,top);x.quadraticCurveTo(cx+ww/2,top+ww*.08,cx+ww/2,top+ww*.55);x.lineTo(cx+ww/2,y1);x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.lineWidth=lw||4;x.strokeStyle=stroke;x.stroke()}}
function pscWindow(x,W,Hp,cx,top,ww,hh,glow){const g=x.createLinearGradient(0,top,0,top+hh);g.addColorStop(0,glow?'#8a74d8':'#5a4a98');g.addColorStop(.55,'#3a2f78');g.addColorStop(1,'#241c52');
  pscPointed(x,cx,top+hh,ww+10,top-5,'#d6dcee','#eef2ff',3);pscPointed(x,cx,top+hh,ww,top,g,'#46406a',3);
  x.strokeStyle='#cfd6ea';x.lineWidth=3;x.beginPath();x.moveTo(cx,top+4);x.lineTo(cx,top+hh);x.moveTo(cx-ww/2,top+hh*.5);x.lineTo(cx+ww/2,top+hh*.5);x.stroke();
  x.fillStyle='rgba(190,170,255,.35)';x.beginPath();x.ellipse(cx,top+ww*.45,ww*.18,ww*.22,0,0,6.3);x.fill();
  x.fillStyle='#c4cbe0';x.fillRect(cx-ww/2-8,top+hh,ww+16,6)}
function pscBalusters(x,W,y,h){x.fillStyle='#d2d8ea';x.fillRect(0,y,W,6);x.fillRect(0,y+h,W,8);x.fillStyle='#b4bad0';for(let b=6;b<W;b+=14){x.fillRect(b,y+6,7,h-6);x.fillStyle='#e4e8f6';x.fillRect(b+1,y+6,2,h-6);x.fillStyle='#b4bad0'}}
const pscBig=(i,n,paint)=>(x,W,Hp)=>{x.save();x.translate(-i*128,0);paint(x,n*128,Hp);x.restore()};
function pscFacadeTiles(){
  if(PSC.T)return PSC.T;const T={},wh=5.2;
  const stone=(k,draw)=>pscTile(k,wh,(x,W,Hp)=>{pscCourses(x,W,Hp,5);if(draw)draw(x,W,Hp)});
  T.plain=[0,1,2].map(i=>stone('fp'+i,(x,W,Hp)=>{if(i===1)pscIvy(x,W,Hp,11,5,.35);if(i===2)pscIvy(x,W,Hp,12,2,.2)}));
  T.win=[0,1,2].map(i=>stone('fw'+i,(x,W,Hp)=>{pscWindow(x,W,Hp,64,Hp*.3,34,Hp*.26,i===1);pscWindow(x,W,Hp,64,Hp*.66,26,Hp*.17,false);if(i===2)pscIvy(x,W,Hp,20+i,7,.55);if(i===0)pscIvy(x,W,Hp,30,3,.3)}));
  T.twin=stone('ftw',(x,W,Hp)=>{pscWindow(x,W,Hp,34,Hp*.32,24,Hp*.24,true);pscWindow(x,W,Hp,94,Hp*.32,24,Hp*.24,false);pscBalusters(x,W,Hp*.6,34)});
  T.balcony=stone('fb',(x,W,Hp)=>{pscBalusters(x,W,Hp*.52,40);pscWindow(x,W,Hp,64,Hp*.2,38,Hp*.22,true);pscIvy(x,W,Hp,41,8,.5)});
  T.buttress=stone('fbu',(x,W,Hp)=>{x.fillStyle='rgba(40,36,70,.42)';x.fillRect(0,0,30,Hp);x.fillRect(98,0,30,Hp);x.fillStyle='rgba(240,244,255,.3)';x.fillRect(30,0,4,Hp);x.fillRect(94,0,4,Hp);for(let s=1;s<5;s++){x.fillStyle='rgba(232,236,250,.3)';x.fillRect(30,Hp-s*Hp/5,68,4)}pscIvy(x,W,Hp,51,4,.4)});
  T.ivy=stone('fiv',(x,W,Hp)=>{pscIvy(x,W,Hp,61,16,.85)});
  T.arcade=[0,1].map(i=>stone('fa'+i,(x,W,Hp)=>{const g=x.createLinearGradient(0,0,0,Hp);g.addColorStop(0,'#20203a');g.addColorStop(1,'#34304c');
    pscPointed(x,64,Hp,92,Hp-330,'#c8cee4','#e4e8f6',3);pscPointed(x,64,Hp,82,Hp-322,g,'#46406a',3);
    x.fillStyle='#b8bed6';x.fillRect(12,Hp-12,104,12);x.fillStyle='#d8deee';x.fillRect(16,Hp-10,96,5);   // plinth shelf
    pscBalusters(x,W,Hp*.36,30);pscWindow(x,W,Hp,64,Hp*.14,22,Hp*.1,true);pscIvy(x,W,Hp,70+i,i?12:6,.7)}));
  // the doors: three wide each. The middle tile (i=1) is the portal tile.
  const greatPaint=(x,W,Hp)=>{const cx=W/2,dw=170,top=Hp-410,bot=Hp;
    x.fillStyle='rgba(44,40,76,.5)';x.fillRect(cx-dw/2-34,top-24,dw+68,bot-top+24);
    pscPointed(x,cx,bot,dw+30,top-20,'#e2e8f6','#f4f6ff',4);pscPointed(x,cx,bot,dw,top,'#43301f','#2a1c10',5);
    const g=x.createLinearGradient(cx-dw/2,0,cx+dw/2,0);g.addColorStop(0,'#5a4028');g.addColorStop(.5,'#6e5033');g.addColorStop(1,'#4a331f');x.save();pscPointed(x,cx,bot,dw-10,top+6,null,null);x.clip();x.fillStyle=g;x.fillRect(cx-dw/2,top,dw,bot-top);
    x.fillStyle='rgba(0,0,0,.45)';x.fillRect(cx-2,top,4,bot-top);for(const yy of [.28,.5,.72,.9]){x.fillRect(cx-dw/2,top+(bot-top)*yy,dw,3)}
    x.fillStyle='#cfd6ea';for(let sx=-1;sx<=1;sx+=2)for(let k=0;k<14;k++){x.beginPath();x.arc(cx+sx*(18+(k%2)*46),top+60+k*20,3,0,6.3);x.fill()}
    x.fillStyle='#b8c0d8';for(const yy of [.3,.7]){x.fillRect(cx-dw/2,top+(bot-top)*yy-5,dw,8)}
    x.restore();x.fillStyle='#d8c070';x.beginPath();x.arc(cx-14,bot-170,7,0,6.3);x.arc(cx+14,bot-170,7,0,6.3);x.fill();
    x.strokeStyle='#e8ecfa';x.lineWidth=5;x.beginPath();x.arc(cx,top-80,40,0,6.3);x.stroke();x.fillStyle='#4a3a98';x.beginPath();x.arc(cx,top-80,36,0,6.3);x.fill();x.strokeStyle='#e8ecfa';x.lineWidth=3;for(let a=0;a<6;a++){x.beginPath();x.moveTo(cx,top-80);x.lineTo(cx+Math.cos(a*1.047)*36,top-80+Math.sin(a*1.047)*36);x.stroke()}
    for(const sx of [-1,1]){x.fillStyle='#caD0e6';x.fillRect(cx+sx*(dw/2+60)-10,Hp-250,20,250);pscWindow(x,W,Hp,cx+sx*(dw/2+60),Hp*.22,26,Hp*.18,true)}
    pscIvy(x,W,Hp,81,10,.4)};
  T.great=[0,1,2].map(i=>pscTile('fg'+i,wh,pscBig(i,3,(x,W,Hp)=>{pscCourses(x,W,Hp,5);greatPaint(x,W,Hp)}),{emit:1}));
  const galPaint=(x,W,Hp)=>{const cx=W/2,dw=150,top=Hp-360,bot=Hp;
    x.fillStyle='rgba(44,40,76,.45)';x.fillRect(cx-dw/2-30,top-20,dw+60,bot-top+20);pscPointed(x,cx,bot,dw+26,top-16,'#dfe5f4','#f2f5ff',4);
    pscPointed(x,cx,bot,dw,top,'#6a6a9a','#2c2850',5);x.save();pscPointed(x,cx,bot,dw-8,top+6,null,null);x.clip();
    for(let r=0;r<6;r++)for(let c=0;c<4;c++){x.fillStyle='rgba(190,170,255,'+(.25+.1*((r+c)%2))+')';x.fillRect(cx-dw/2+c*38+3,top+r*60+4,32,54)}
    x.fillStyle='#d8deee';x.fillRect(cx-3,top,6,bot-top);x.fillRect(cx-dw/2,top+120,dw,5);x.fillRect(cx-dw/2,top+240,dw,5);x.restore();
    pscBalusters(x,W,Hp*.5,30);pscIvy(x,W,Hp,91,8,.35)};
  T.gallery=[0,1,2].map(i=>pscTile('fgal'+i,wh,pscBig(i,3,(x,W,Hp)=>{pscCourses(x,W,Hp,5);galPaint(x,W,Hp)}),{emit:1}));
  const lowDoor=(x,W,Hp,leaf)=>{const cx=64,dw=62,top=Hp-190;x.fillStyle='rgba(44,40,76,.45)';x.fillRect(cx-dw/2-14,top-14,dw+28,190);
    x.fillStyle='#c9cfe2';x.fillRect(cx-dw/2-8,top-8,dw+16,Hp-top+8);x.fillStyle=leaf?'#3f5a3a':'#3a2f22';x.fillRect(cx-dw/2,top,dw,Hp-top);
    if(leaf){x.strokeStyle='#8fb48a';x.lineWidth=3;for(let k=0;k<5;k++){const yy=top+16+k*26;x.beginPath();x.moveTo(cx-dw/2+8,yy);x.bezierCurveTo(cx-10,yy-16,cx+10,yy+16,cx+dw/2-8,yy);x.stroke();x.fillStyle='#8fb48a';x.beginPath();x.ellipse(cx-dw/2+14,yy+4,5,3,.6,0,6.3);x.ellipse(cx+dw/2-14,yy-4,5,3,-.6,0,6.3);x.fill()}x.fillStyle='#e0e6f4';x.fillRect(cx-dw/2-8,top-26,dw+16,12);}
    else{x.fillStyle='rgba(0,0,0,.4)';x.fillRect(cx-2,top,4,Hp-top);x.fillStyle='#8a8a98';for(let k=0;k<4;k++)x.fillRect(cx-dw/2,top+22+k*42,dw,4)}
    x.fillStyle='#d8c070';x.beginPath();x.arc(cx+14,Hp-90,4,0,6.3);x.fill()};
  T.kitchen=pscTile('fk',wh,(x,W,Hp)=>{pscCourses(x,W,Hp,5);lowDoor(x,W,Hp,false);pscWindow(x,W,Hp,64,Hp*.34,26,Hp*.2,false)},{emit:1});
  T.cloister=pscTile('fcl',wh,(x,W,Hp)=>{pscCourses(x,W,Hp,5);lowDoor(x,W,Hp,true);pscWindow(x,W,Hp,64,Hp*.34,26,Hp*.2,true);pscIvy(x,W,Hp,95,10,.5)},{emit:1});
  // curtain wall, towers, gate
  const cw=3.4;
  T.cwall=[0,1,2].map(i=>pscTile('cw'+i,cw,(x,W,Hp)=>{pscCourses(x,W,Hp,3);x.fillStyle='rgba(30,28,56,.5)';for(let k=0;k<4;k++)x.fillRect(k*34+4,0,18,16);if(i===1)pscIvy(x,W,Hp,111,9,.6);if(i===2){x.fillStyle='#1a1830';x.fillRect(58,Hp*.4,10,Hp*.16)}},{v:i}));
  T.tower=[0,1].map(i=>pscTile('tw'+i,6.4,(x,W,Hp)=>{pscCourses(x,W,Hp,6);x.fillStyle='#1c1a34';for(const yy of [.3,.55]){x.fillRect(60,Hp*yy,8,Hp*.1)}pscIvy(x,W,Hp,121+i,i?10:4,.5);x.fillStyle='rgba(30,28,56,.5)';for(let k=0;k<4;k++)x.fillRect(k*34+4,0,18,20)},{v:i}));
  T.pier=pscTile('gp',3.4,(x,W,Hp)=>{pscCourses(x,W,Hp,3);x.fillStyle='rgba(40,36,70,.4)';x.fillRect(0,0,22,Hp);x.fillRect(106,0,22,Hp);pscIvy(x,W,Hp,131,5,.45)},{v:1});
  T.gate=gyTile('texGrey_1',3.4,{fac:{img:'gatesC_0',i:0,n:1},gain:1.1,tag:'pscgate',emit:.28,rgb:[.95,.95,1.1]});
  T.hedgeLow=[];T.hedgeHigh=[];
  return PSC.T=T}
/* hedges: silver and dark yew (the two new kinds are put in the garden table) */
function pscHedges(){
  if(PSC._hed)return PSC._hed;
  GMH.pscsilver={base:'#2c3a3c',cols:['#8aa4a2','#9db6b4','#728e8c','#b0c8c6','#647e7c'],len:[9,13],ratio:.42,n:1.35,shape:'oval'};
  GMH.pscyew={base:'#0c1820',cols:['#1f3b40','#2a4c52','#183036','#355e60','#2d4a5a'],len:[10,15],ratio:.14,n:1.6,shape:'needle'};
  GMH.pscbloom={base:'#1c2c2e',cols:['#5d7a78','#6f8c88','#4c6866'],len:[7,10],ratio:.5,n:1.25,shape:'oval',acc:[{k:'bloom',cs:['#f4f0fa','#e8dcf4','#ffffff','#d0c0ec'],n:40,s:5.4,p:6}]};
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
  psraven:pscE('psraven',{name:'Pale Raven',hp:40,dmg:[6,10],speed:2,fly:true,floatH:.3,verb:'stabs',xp:28,pscfeather:1}),
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
  psstatuehammer:{n:"Ossian's Statue Hammer",k:'weapon',t:'Mace',ic:'mace',c:'#a8a8b8',dmg:[430,540],hit:.2,req:{str:76},lvl:103,price:0,rar:1,eff:{bossdmg:.35,stun:[.15,1]},sw:.9,d:"A heavy mallet with a stone head that has split a hundred statues. Bosses take 35% more, and some blows stun. Needs level 103."},
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
khNpc('psc_gardener','Hobb Ashby, the gardener','ps_p_gardener',d=>{
  const F=pscF();
  return say(F.hobb?"Sit down, sit down. There is hot water on the stove and the bed is made. Nobody has ever come into the lodge to hurt me, and I have never worked out why. I do not ask.":"Oh! A living face. Come in and shut the door, the draught is bad for the seedlings. I am Hobb Ashby, gardener to the Pale Sovereign, and I have not been told to stop, so I have not stopped. The roses want cutting, the hedges want clipping, and the statues want something I cannot name.",
    [['Rest by the stove (free).',()=>{F.hobb=1;G.talk=null;restParty(true);return say('You sleep in the lodge by the stove. Nothing comes in. You wake warm and healed.',[BYE])}],
     ['Tell me about the statues.',()=>{F.hobb=1;return say("They were not here when I was a boy. A sculptor called Ossian came, and he kept carving, and when he ran out of room he carved the ones that bite. Do not walk close to the ugly ones. They wake up if you come within three squares. The kind ones stay still.",[['Go on.',()=>say("The pale roses in the Rose Garden are the only thing here that I did not plant for the Sovereign. They came by themselves. I cut them for the lodge. If you cut five for me I will give you something for it.",[BYE])],BYE])}],
     ['Where is it safe in the court?',()=>say('The Waystone Nook, in the south west corner behind the clipped hedges. Nothing goes in there. The stone will carry you back to Sale or Lanternrest, so you can fetch supplies and come back. And this lodge. And that is all.',[BYE])],BYE])},{sc:1});
khNpc('psc_ysmay','Lady Ysmay','ps_p_courtier2',d=>{
  const F=pscF();
  if(F.ossianDead)return say("He has stopped. I can feel it, like a bell that has stopped ringing. Thank you. Sit by the pond for a while. It is still here.",[BYE]);
  return say("I am Ysmay. I have stood by this pond for a very long time. I used to be the Sovereign's cousin, then the Sovereign's guest, and now I am only here. The still water shows what stood here before the statues.",
    [['Who made the statues?',()=>say("My husband, Ossian. He was a good man with a chisel, and then he began to carve what he saw in the dark. Each one is a little worse than the last. He walks the Sculptor's Yard and the statue ring now, with a mallet, and wakes what he has made when he is hurt.",[BYE])],
     ['The castle keys?',()=>say("The Sacristan hid things where the candles are, I heard. That was when they came for him. I only know that.",[BYE])],BYE])},{sc:1});
khNpc('psc_falconer','The Falconer','ps_p_falconer',d=>{
  const F=pscF();
  return say(F.fcount?"The hawk is gone. The glove is all that is left. Bring it, if you find it, and the Hound Master's whistle too. I will tell you why when you have them.":"I kept the Sovereign's hawks. I am not alive any more, but the ravens do not know that, and they will not leave the perches. Do not touch the feather on the near perch. It is a trap that I set myself, to catch a thief, and I forgot to take it down.",[BYE])},{sc:1});
/* psq3 The Sculptor's Chisel: Lady Ysmay, put Ossian down and bring her his chisel */
pscQ('psq3',"The Sculptor's Chisel",'Lady Ysmay',[
  ["Put Ossian the Mad Sculptor down (he walks the Sculptor's Yard, south east of the great fountain) and bring his chisel to Lady Ysmay at the Mirror Pond.",()=>bagCount('pschisel')>0,[]]],
  {gold:6000,xp:35000,items:['potion6','potion6','supermana']},{take:{pschisel:1}});
wwGive('psc_ysmay','psq3',()=>true,{
  offer:"Ossian was my husband. He cannot be talked out of it any more. Will you stop him? He walks the Sculptor's Yard, in the south east corner, among the half carved statues. When he is hurt he wakes the statues beside him, so do not fight him near too many. Bring me his chisel afterwards. I would like to hold it once.",
  accept:"Thank you. He will not know you. He does not know me. His yard is south east of the fountain, behind the wall with the two gaps.",
  remind:()=>pscF().ossianDead?"Ossian is down. Bring me his chisel.":"Ossian walks the Sculptor's Yard, south east of the great fountain.",
  ready:"That is his chisel. I would know it anywhere.",
  thanks:'Thank you. I will keep it here by the water.',after:'The pond is quiet now. Thank you.'});
/* psq4 Roses for the Lodge: Hobb, five silver roses */
pscQ('psq4','Roses for the Lodge','Hobb Ashby, the gardener',[
  ['Cut five silver roses in the Rose Garden, south west of the great fountain, and bring them to Hobb in the Gardener\'s Lodge.',()=>bagCount('psroses')>=5,[]]],
  {gold:4000,xp:25000,items:['psgardshears','potion6']},{take:{psroses:5}});
wwGive('psc_gardener','psq4',()=>true,{
  offer:"If you cut five of the silver roses for me I can put them in the lodge and have something living on the table. The Rose Garden is south west of the fountain, behind the yew hedge, next to the road that goes west to my door. The roses bite. Not the thorns, the roses.",
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

/* ---------- the arch that bridges the way (painted in code: it is architecture, a stone arch with a gallery over it) ---------- */
function pscArchPic(){
  if(IMG.psc_arch)return 'psc_arch';
  const W=760,H=420,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const st=(x0,y0,w,h)=>{const g=x.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,'#aeb4cc');g.addColorStop(.35,'#dfe4f4');g.addColorStop(1,'#9298b4');x.fillStyle=g;x.fillRect(x0,y0,w,h)};
  st(0,150,92,270);st(W-92,150,92,270);
  x.fillStyle='rgba(60,56,96,.35)';for(let y=170;y<H;y+=36){x.fillRect(0,y,92,3);x.fillRect(W-92,y,92,3)}
  // the arch: a pointed opening between the piers, stone ring above
  x.save();x.beginPath();x.moveTo(92,H);x.lineTo(92,230);x.quadraticCurveTo(92,150,W/2,70);x.quadraticCurveTo(W-92,150,W-92,230);x.lineTo(W-92,H);x.lineTo(W,H);x.lineTo(W,60);x.lineTo(0,60);x.lineTo(0,H);x.closePath();
  const g=x.createLinearGradient(0,60,0,H);g.addColorStop(0,'#e6eaf8');g.addColorStop(1,'#a6acc6');x.fillStyle=g;x.fill();x.restore();
  x.lineWidth=7;x.strokeStyle='#f2f5ff';x.beginPath();x.moveTo(92,230);x.quadraticCurveTo(92,150,W/2,70);x.quadraticCurveTo(W-92,150,W-92,230);x.stroke();
  // the gallery: a balustrade with tiny arches and violet window slits
  x.fillStyle='#d4dae9';x.fillRect(0,0,W,64);x.fillStyle='#8f96b2';x.fillRect(0,56,W,8);x.fillStyle='#eef1fb';x.fillRect(0,0,W,8);
  for(let b=10;b<W;b+=34){x.fillStyle='#b4bad2';x.fillRect(b,12,10,42);x.fillStyle='#f0f3fc';x.fillRect(b+1,12,3,42)}
  for(let k=0;k<7;k++){const cx=70+k*103;x.fillStyle='#5a4a98';x.beginPath();x.moveTo(cx-10,60);x.lineTo(cx-10,40);x.quadraticCurveTo(cx,26,cx+10,40);x.lineTo(cx+10,60);x.fill()}
  // ivy over the piers
  const R=blRng(77);for(let k=0;k<70;k++){const px=(R()<.5?R()*92:W-92+R()*92),py=150+R()*270*(R()),r=3+R()*5;x.fillStyle=['#2f4a3a','#3d5e48','#4a6e52','#25382d'][(R()*4)|0];x.beginPath();x.ellipse(px,py,r,r*.65,R()*3,0,6.3);x.fill()}
  IMG.psc_arch=c;NPC_H.psc_arch=4.2;return 'psc_arch'}
/* ---------- 4. the courtyard ---------- */
function pscBase(info){
  if(typeof pspPics==='function')pspPics();
  pscFloors();const T=pscFacadeTiles(),HG=pscHedges();
  const W=96,H=88,C=blKit({id:9730,W,H,name:info.name,lvl:101,tele:PSC.TELE,start:{x:48,y:83,f:0}});
  const ch=C.ch,hs=C.hs,rows=C.rows,block=C.block,fm=C.fm,hgt=C.hgt;
  const P=(k,x,y,o)=>C.free(x,y)?C.dec(k,x,y,o):null;                       // a prop on a free open cell
  const B=(k,x,y,o)=>P(k,x,y,Object.assign({block:true},o||{}));            // a solid prop
  const S=(name,x,y,o)=>B(pspPic(name),x,y,Object.assign({sc:1},o||{}));   // a statue
  const Fl=(x0,y0,x1,y1,f)=>C.setF(x0,y0,x1,y1,f);
  const gidOf=c=>C.chars[c];
  const lampAt=(x,y,col)=>{if(C.free(x,y)||C.isOpen(x,y)){C.lamp(x,y,col);PSC.lamps.push([x,y])}};
  const SILV=[.85,1.0,1.35],VIOL=[1.1,.75,1.4];
  PSC.lamps=[];
  /* ---- the shape of the open ground ---- */
  const towerSW=(x,y)=>x<=7&&y>=77,towerSE=(x,y)=>x>=88&&y>=77;
  const openAt=(x,y)=>{
    if(towerSW(x,y)||towerSE(x,y))return false;
    if(y>=17&&y<=50&&x>=21&&x<=75)return true;
    if(y>=51&&y<=83&&x>=5&&x<=90)return true;
    if(y>=84&&y<=85&&x>=46&&x<=50)return true;
    return false};
  const vh=(a,b,i)=>(hs(a,b,i)*4)|0;
  /* the facade: tile by position along a face. kind decides the rhythm */
  const GREAT=[47,48,49],GAL=[27,28,29];
  const facadeN=x=>{
    if(GREAT.includes(x))return T.great[x-47];if(GAL.includes(x))return T.gallery[x-27];
    if((x>=31&&x<=43)||(x>=53&&x<=65))return T.arcade[x%2];
    const i=(x-21)%8,seq=[T.buttress,T.win[0],T.plain[0],T.win[1],T.balcony,T.win[2],T.plain[1],T.twin];return seq[i]};
  const facadeSide=(y,flip)=>{const i=(y-17+(flip?3:0))%7;return [T.buttress,T.win[0],T.win[1],T.plain[0],T.win[2],T.twin,T.plain[2]][i]};
  const facadeS=x=>[T.buttress,T.win[1],T.plain[1],T.win[0],T.balcony,T.win[2],T.plain[0],T.twin][(x*3)%8];
  const doorTile={};   // [x,y] -> gid, the four doors and the two wall stairs and the gate
  const wallTile=(x,y)=>{
    if(towerSW(x,y)||towerSE(x,y))return T.tower[(x+y)&1];
    if(y===16&&x>=21&&x<=75)return facadeN(x);
    if(x===20&&y>=17&&y<=50)return y===34?T.kitchen:facadeSide(y,0);
    if(x===76&&y>=17&&y<=50)return y===34?T.cloister:facadeSide(y,1);
    if(y===50&&((x>=5&&x<=20)||(x>=76&&x<=90)))return facadeS(x);
    if(y===86&&x>=46&&x<=50)return x===48?T.gate:T.pier;
    if(x===4&&y>=51&&y<=83)return T.cwall[vh(x,y,5)%3];
    if(x===91&&y>=51&&y<=83)return T.cwall[vh(x,y,6)%3];
    if(y===84)return T.cwall[vh(x,y,7)%3];
    if(y===85&&(x<46||x>50))return T.cwall[vh(x,y,8)%3];
    return T.cwall[0]};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(openAt(x,y)){fm[y*W+x]='0';continue}C.solid(x,y,ch(wallTile(x,y)))}
  /* the links of the contract: read from PSP.LINKS, so the numbers are in one place only */
  const linkAt=(x,y)=>pspLinkAt(9730,x,y);
  const bind=(gid,x,y,extra)=>{const l=linkAt(x,y);if(!l)return;
    KH_DOOR[gid]=Object.assign({lvl:l.to,get at(){if(!LEVELS[l.to]&&KH_LAZY[l.to])try{KH_LAZY[l.to]()}catch(e){console.error(e)}return {x:l.land[0],y:l.land[1],f:l.land[2]}},psc:1},extra||{})};
  bind(T.great[1],48,16);bind(T.gallery[1],28,16);bind(T.kitchen,20,34);bind(T.cloister,76,34);bind(T.gate,48,86);
  // the two wall stairs, each behind a grille: sealed for now
  for(const [sx,sy,tag] of [[4,60,'gl0'],[91,60,'gl1']]){
    const g=pscTile(tag,3.4,(x,Wd,Hp)=>{pscCourses(x,Wd,Hp,3);x.fillStyle='#14122a';pscPointed(x,64,Hp,86,Hp*.18,'#14122a','#d8deee',5);x.strokeStyle='#8a90a8';x.lineWidth=4;for(let b=26;b<110;b+=14){x.beginPath();x.moveTo(b,Hp*.34);x.lineTo(b,Hp);x.stroke()}x.beginPath();x.moveTo(20,Hp*.55);x.lineTo(108,Hp*.55);x.stroke();pscIvy(x,Wd,Hp,140+sx,6,.3)},{v:2});
    C.solid(sx,sy,ch(g));const l=linkAt(sx,sy);KH_DOOR[g]={lvl:l?l.to:9850,psc:1,seal:'The wall walk is closed. An iron grille is locked across the foot of the stair, and the lock is pale with frost.',at:{x:6,y:60,f:1}}}
  /* ---- floors ---- */
  const circ=(cx,cy,r,f)=>{for(let y=Math.floor(cy-r);y<=cy+r;y++)for(let x=Math.floor(cx-r);x<=cx+r;x++)if(x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.'&&Math.hypot(x-cx,y-cy)<=r)fm[y*W+x]=f};
  Fl(46,17,50,83,'1');Fl(21,17,75,19,'2');Fl(44,17,52,19,'5');Fl(21,33,75,34,'1');
  Fl(40,76,56,83,'1');Fl(42,70,54,75,'1');
  circ(48,52,8.2,'2');circ(48,52,5.2,'5');
  for(let y=47;y<=57;y++)for(let x=43;x<=53;x++){const d=Math.hypot(x-48,y-52);if(d<=2.4){fm[y*W+x]='6';block[y*W+x]=1}}
  /* terraces and a sunken plaza (height only; walking is the same) */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let h=.3;if(y>=17&&y<=21)h+=.0;const d=Math.hypot(x-48,y-52);if(d<7)h-=.14*(1-d/7);hgt[y*W+x]=h}
  /* ---- the gate and the arrival ---- */
  lampAt(45,82,SILV);lampAt(51,82,SILV);lampAt(45,79,VIOL);lampAt(51,79,VIOL);
  /* ---- named plaques (lettered slabs) and signs ---- */
  const plaque=(x,y,key,lines,text)=>{const id='psc_pl_'+key,k=blSlab('psc_slab_'+key,lines,{h:.95,top:.18,span:.62});if(!NPCS[id])khNpc(id,'A plaque',k,()=>say(text,[BYE]));return C.thing(k,id,x,y,{sc:1})};
  plaque(44,82,'court',['THE COURT','OF STATUES'],'A pale stone plaque. THE COURT OF STATUES. Under it, in smaller letters: Keep to the white gravel. Do not stare at the ones that stare. Do not touch the roses. The Great Door is straight ahead, to the north.');
  plaque(52,16+2,'great',['THE GREAT','DOOR'],'A plaque beside the great door. THE GREAT DOOR. It leads into the Great Halls. The silver and oak doors are open.');
  plaque(31,18,'gallery',['THE GALLERY','DOOR'],'A plaque beside the gallery door. THE GALLERY DOOR. It leads to the Gallery of Portraits.');
  plaque(23,36,'kitchen',['THE KITCHEN','DOOR'],'A plaque beside a plain low door in the west wing. THE KITCHEN DOOR. Tradesmen and servants only.');
  plaque(73,36,'cloister',['THE CLOISTER','DOOR'],'A plaque beside a carved door in the east wing. THE CLOISTER DOOR. It leads to the cloister, the chapel and the library. The leaves on the door are carved so well that they look wet.');
  /* ---- the way: lamps and the statue rows (the S1 pieces, each neighbour different) ---- */
  const NAMES=['st_mourners','st_chimera','st_hydra','st_judge','st_gargoyle','st_headless','st_hound','st_veiled','st_hand','st_bishop'];
  const WAKE={};   // enemies that stand as statues: [x,y] -> type (placed instead of the decor statue)
  const wakers={};const reserveWake=(t,x,y)=>{wakers[x+','+y]=t};
  const rowStat=(x,ys,off)=>ys.forEach((y,i)=>{const nm=NAMES[(i*3+off)%NAMES.length];S(nm,x,y)});
  const NYS=[],SYS=[];for(let y=20;y<=41;y+=3)NYS.push(y);for(let y=62;y<=80;y+=3)SYS.push(y);
  rowStat(45,NYS,0);rowStat(51,NYS,5);rowStat(45,SYS,2);rowStat(51,SYS,7);
  for(let y=22;y<=80;y+=6){if(y>=44&&y<=60)continue;lampAt(46,y,y%12?SILV:VIOL);lampAt(50,y+3,y%12?VIOL:SILV)}
  /* the Great Door apron: urns, balustrade posts, benches */
  for(const x of [44,52]){P('gy_urn',x,18,{block:true,sc:.9});}
  for(const x of [40,56]){P('gy_urn',x,19,{block:true,sc:.9})}
  /* ---- the arcade: a statue on a plinth in front of every second arch (ref: ivy cloister) ---- */
  [31,33,35,37,39,41,43].forEach((x,i)=>S(NAMES[(i*2+1)%10],x,17));
  [53,55,57,59,61,63,65].forEach((x,i)=>S(NAMES[(i*2+4)%10],x,17));
  P('gy_bench',25,18,{block:true,sc:.9});P('gy_bench',71,18,{block:true,sc:.9});P('gy_bench',36,19,{sc:.8,block:true});P('gy_bench',60,19,{sc:.8,block:true});
  lampAt(24,18,SILV);lampAt(72,18,SILV);lampAt(30,19,VIOL);lampAt(66,19,VIOL);lampAt(42,19,VIOL);lampAt(54,19,VIOL);
  /* ---- the great fountain and its plaza (ref: sunken round pond with a fountain) ---- */
  B(pspPic('st_fountain'),48,52,{sc:1});
  for(let a=0;a<12;a++){const ang=a*Math.PI/6+Math.PI/12,x=Math.round(48+Math.cos(ang)*7.2),y=Math.round(52+Math.sin(ang)*7.2);if(Math.abs(x-48)<=3&&(y<48||y>56))continue;if(Math.abs(y-52)<=2&&(x<44||x>52))continue;
    if(a%4===1)lampAt(x,y,VIOL);else S(NAMES[(a*3+1)%10],x,y,{sc:.95})}
  for(const [x,y] of [[41,45],[55,45],[41,59],[55,59]]){P('gy_urn',x,y,{block:true,sc:.85})}
  for(const [x,y] of [[43,45],[53,45],[43,59],[53,59]])P(pscTint('psc_fern','flowerpot','grayscale(.45) hue-rotate(40deg) brightness(.9)',.7),x,y,{sc:1,block:true});
  /* the bridging arch and its two pavilions (ref: stone arch bridging two buildings) */
  {const wallPav=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(rows[y][x]!=='.')continue;
      const front=y===y1,side=(x===x1&&x0>48)||(x===x0&&x0<48);   // the faces that look at the way and at the south
      const t=front?(x%2?T.win[1]:T.arcade[0]):(side?facadeSide(y,x0>48):T.plain[1]);C.solid(x,y,ch(t))}};
   wallPav(36,36,43,39);wallPav(53,36,60,39);
   P(pscArchPic(),48,37,{sc:1,block:false});
   S('st_judge',44,36);S('st_hydra',52,36);S('st_veiled',44,40);S('st_bishop',52,40);   // the statues at the arch's feet
   for(const x of [38,41])P(pscTint('psc_fern','flowerpot','grayscale(.45) hue-rotate(40deg) brightness(.9)',.7),x,40,{sc:1,block:true});
   for(const x of [55,58])P('psc_fern',x,40,{sc:1,block:true})}
  /* ---- hedge enclosures: the nooks (ring of hedge, gaps, floor) ---- */
  const encl=(x0,y0,x1,y1,o)=>{o=o||{};const kind=o.hedge||'high',gaps=o.gaps||[],list=HG[kind];
    const inGap=(x,y)=>gaps.some(g=>(g[0]==='N'&&y===y0&&x>=g[1]&&x<=g[2])||(g[0]==='S'&&y===y1&&x>=g[1]&&x<=g[2])||(g[0]==='W'&&x===x0&&y>=g[1]&&y<=g[2])||(g[0]==='E'&&x===x1&&y>=g[1]&&y<=g[2]));
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
      const edge=x===x0||x===x1||y===y0||y===y1;
      if(edge){if(inGap(x,y)){fm[y*W+x]=o.gapFloor||'1';continue}if(rows[y][x]==='.')C.solid(x,y,ch(list[vh(x,y,9)]))}
      else if(o.floor)fm[y*W+x]=o.floor}};
  const FL={w:pscTint('psc_fl_w','mw_rose','grayscale(.85) brightness(1.5)',.5),p:pscTint('psc_fl_p','mw_rose','hue-rotate(250deg) saturate(.7) brightness(.85)',.5),r:'mw_rose'};
  const flowers=(x0,y0,x1,y1,seed,dens)=>{Fl(x0,y0,x1,y1,'4');for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const r=hs(x,y,seed);if(r<dens){const k=r<dens*.12?FL.r:r<dens*.6?FL.w:FL.p;P(k,x,y,{sc:.8+hs(x,y,seed+1)*.5})}}};
  PSC.flowers=flowers;
  return {C,P,B,S,Fl,encl,flowers,lampAt,plaque,reserveWake,wakers,NAMES,SILV,VIOL,circ,T,HG,FL}}

/* ---------- the twelve nooks, the lawns, the buildings, the creatures ---------- */
function pscBuild(info){
  const X=pscBase(info),{C,P,B,S,Fl,encl,flowers,lampAt,plaque,reserveWake,wakers,NAMES,SILV,VIOL,T,HG,FL}=X;
  const W=96,H=88,rows=C.rows,block=C.block,fm=C.fm,hs=C.hs,F0=pscF;
  const WARM=[1.6,1.05,.55];
  const thing=(k,id,x,y,o)=>C.thing(k,id,x,y,Object.assign({sc:1},o||{}));
  const nm=(id,name,pic,fn)=>{if(!NPCS[id])khNpc(id,name,pic,fn)};
  const sayBye=t=>()=>say(t,[BYE]);
  const FERN=pscTint('psc_fern','flowerpot','grayscale(.45) hue-rotate(40deg) brightness(.9)',.7);
  const BENCH=pscTint('psc_mossbench','gy_bench','sepia(.4) hue-rotate(50deg) saturate(1.6) brightness(.85)',.55);
  const WELL=pscTint('psc_springpic','well','grayscale(.5) brightness(1.25)',1.0);
  const STONETREE=pscTint('psc_stonetree','gy_dead','grayscale(1) brightness(1.5) contrast(.9)',2.6);
  const SROSE=pscTint('psc_rosepic','gy_rose','grayscale(.85) brightness(1.6)',.55);
  const LEVER=pscTint('psc_lever','gy_lever','grayscale(.6) brightness(1.3)',.9);
  const chest=(x,y,o)=>{const d=P('gy_chest',x,y,{block:true,sc:.95});if(d){PSC.chest['9730:'+x+','+y]=o||{pot:2,mana:1,gold:1500}}return d};
  /* lawns: the long grass fields of the upper court and the two gardens, with flower beds (pale and wrong: white, bruise purple, one red), mossy benches, urns, ferns, sundials */
  flowers(24,40,30,41,31,.55);flowers(36,42,42,43,32,.5);flowers(54,40,58,41,33,.5);flowers(63,42,70,43,34,.55);flowers(24,46,31,47,35,.5);flowers(65,46,71,47,36,.5);
  flowers(24,35,28,36,37,.5);flowers(68,35,72,36,38,.5);flowers(12,67,17,68,39,.5);flowers(36,54,41,55,40,.45);flowers(56,64,61,65,41,.45);flowers(80,68,84,69,42,.5);flowers(66,52,70,53,43,.5);
  for(const [x,y] of [[26,44],[70,44],[28,50],[68,50]])B(BENCH,x,y,{sc:1});
  for(const [x,y] of [[30,38],[66,38]])B('gy_urn',x,y,{sc:1});
  B('gy_column',34,45,{sc:1});B('gy_column',62,45,{sc:1});     // the two sundials stand in as plain columns until a painted sundial exists
  for(const [x,y] of [[37,40],[59,40],[40,52],[56,62],[30,68],[44,74]])P(FERN,x,y,{block:true,sc:1.1});
  /* ===== 1. THE WAYSTONE NOOK (12,76): the teleport stone, a bench, two kneeling knights, a lamp. No creature within 8 (checked below). ===== */
  encl(8,72,16,80,{hedge:'bloom',gaps:[['E',75,77]],floor:'2',gapFloor:'2'});
  S('st_headless',10,74);S('st_headless',10,78);B(BENCH,14,73,{sc:1});B(BENCH,14,79,{sc:1});lampAt(12,73,[1.05,.9,1.5]);lampAt(10,76,[.9,1.0,1.4]);
  plaque(15,80,'waystone',['THE WAYSTONE','NOOK'],'THE WAYSTONE NOOK. A plaque on the hedge. The stone in the middle carries a party back to the towns it knows. Nothing in the Court of Statues comes into this nook. Rest your feet.');
  /* ===== 2. THE WEEPING ALCOVE (30,60): six mourners round a chest and a plaque with the order of the hydra's necks ===== */
  encl(27,57,33,63,{hedge:'high',gaps:[['N',29,31]],floor:'3',gapFloor:'3'});
  S('st_mourners',28,58);S('st_mourners',32,58);S('st_mourners',28,62);S('st_mourners',32,62);reserveWake('psmourner',28,60);reserveWake('psmourner',32,60);
  chest(30,60,{pot:3,mana:2,elixir:1,gold:1800});
  plaque(30,62,'order',['THE HYDRA','1 2 3 4 5'],'A plaque in the Weeping Alcove. THE HYDRA. Five necks, counted from the left. Pull them in this order: three, one, five, two, four. Then the pool will remember water.');
  /* ===== 3. THE ROSE GARDEN (40,70): eight silver roses, the Thorn Warden walks along its north side ===== */
  encl(33,65,42,74,{hedge:'bloom',gaps:[['N',37,38],['W',69,70]],floor:'0',gapFloor:'1'});
  Fl(34,66,41,73,'4');
  for(const [x,y] of [[35,67],[39,67],[36,69],[40,69],[35,71],[39,71],[37,73],[41,72]])P(FL.w,x,y,{sc:.9});
  const ROSES=[[35,68],[38,68],[40,67],[36,70],[40,71],[35,72],[38,72],[41,73]];
  ROSES.forEach(([x,y],i)=>{const id='psc_rose'+i;
    nm(id,'A silver rose',SROSE,d=>{const Fc=pscF();if(Fc.taken[id])return say('The stem is cut. A little silver sap runs down it.',[BYE]);
      return say('A silver rose in full flower. The petals are the colour of the moon on frost, and the heart is violet. It leans toward your hand, and it is not a gentle lean.',[['Cut it.',()=>{Fc.taken[id]=1;Fc.roses=(Fc.roses|0)+1;pscGone(d);bl3Give('psroses');sfx('key');msg('You cut a silver rose. It bites your thumb on the way out of the bush.','#e8e8f8');G.talk=null;return null}],BYE])});
    thing(SROSE,id,x,y,{sc:1});bl3Hide(9730,id,()=>pscF().taken[id])});
  plaque(36,66,'rose',['THE ROSE','GARDEN'],'THE ROSE GARDEN. A plaque in the hedge. These roses were not planted. They came up by themselves the year the statues began, and the gardener has cut them every week since.');
  /* ===== 4. THE GARGOYLE ARBOUR (24,22): crouched gargoyles on pillars, a small spring ===== */
  encl(24,21,32,29,{hedge:'high',gaps:[['E',25,26],['S',27,28]],floor:'0',gapFloor:'0'});
  S('st_gargoyle',26,23);reserveWake('psgargoyle',30,23);S('st_gargoyle',26,27);reserveWake('psgargoyle',30,27);
  nm('psc_spring','A small spring',WELL,()=>{if(PSC.springUsed)return say('The spring is clear and very cold. You have drunk what you wanted.',[BYE]);
    return say('A small spring, running out of a cleft in a block of pale stone and into a round basin. It tastes of iron and snow.',[['Drink.',()=>{PSC.springUsed=1;pscHeal(.12);sfx('potion');G.talk=null;msg('The cold water clears your heads. A little of the weariness goes.','#bfe0ff');return null}],BYE])});
  thing(WELL,'psc_spring',28,25,{sc:1});B(BENCH,25,22,{sc:.9});lampAt(28,22,VIOL);
  /* ===== 8. THE HYDRA POOL (36,28): a dry pool, five stone necks to pull in the plaque's order ===== */
  encl(35,22,43,32,{hedge:'high',gaps:[['S',38,39]],floor:'3',gapFloor:'3'});
  Fl(37,25,41,29,'3');S('st_hydra',39,27);
  const NECK_X=[36,37,39,41,42];
  NECK_X.forEach((x,i)=>{const id='psc_neck'+(i+1);
    nm(id,'A stone neck',LEVER,()=>{const Fc=pscF();if(Fc.hydra)return say('The pool is full. The hydra\'s necks are slack and still.',[BYE]);
      return say('The '+['first','second','third','fourth','fifth'][i]+' neck of the hydra, counted from the left, with a stone handle where the head should be.',[['Pull it.',()=>{G.talk=null;Fc.necks=(Fc.necks||[]).concat(i+1);sfx('door');
        const seq=Fc.necks,ok=PSC.NECKS.slice(0,seq.length).every((v,j)=>v===seq[j]);
        if(!ok){Fc.necks=[];msg('A grinding sound, and the necks all spring back. Wrong. Start again.','#d0b8e8');return null}
        if(seq.length===5){Fc.hydra=1;Fc.necks=[];msg('A deep gurgle runs under the floor. Water climbs up out of the stone and fills the pool, and a stone drawer slides out of the hydra\'s plinth.','#bfe0ff');
          try{const L=LEVELS[9730],Wd=L.rows[0].length;const a=G.fmap.split('');for(let y=25;y<=29;y++)for(let x2=37;x2<=41;x2++)a[y*Wd+x2]='6';G.fmap=a.join('')}catch(e){}
          const g=pscDecorOf('psc_hydragems');if(g&&g.hidden){g.hidden=false;g.found=false;g.block=true}}
        else msg('Click. '+seq.length+' of 5.','#c8c8e8');return null}],BYE])});
    thing(LEVER,id,x,24,{sc:1})});
  nm('psc_hydragems','A stone drawer',pspPic('st_hand'),d=>{const Fc=pscF();if(Fc.gems)return say('The drawer is empty.',[BYE]);
    return say('A drawer of pale stone, and in it a heap of cut stones and old coins.',[['Take them.',()=>{Fc.gems=1;pscGone(d);bl3Give('gem_diamond');bl3Give('gem_sapphire');bl3Give('gem_tanzanite');G.gold+=2400;sfx('key');msg('You take three gems and 2400 gold from the drawer.','#ffe36a');G.talk=null;return null}],BYE])});
  {const d=thing(pspPic('st_hand'),'psc_hydragems',39,30,{sc:.5});if(d&&!pscF().hydra){d.hidden=true;d.found=true;d.block=false}}
  bl3Hide(9730,'psc_hydragems',()=>!pscF().hydra||pscF().gems);
  plaque(40,31,'hydra',['THE HYDRA','POOL'],'THE HYDRA POOL. A plaque. The pool is dry. The five necks are handles. The order of the pulls is written on a plaque in the Weeping Alcove, in the south west garden.');
  /* ===== 9. THE MIRROR POND (60,28): a still pool, Lady Ysmay ===== */
  encl(56,23,64,31,{hedge:'high',gaps:[['S',59,60]],floor:'2',gapFloor:'2'});
  for(let y=26;y<=28;y++)for(let x=59;x<=61;x++){fm[y*W+x]='6';block[y*W+x]=1}
  S('st_veiled',58,25);S('st_veiled',62,25);B(BENCH,57,29,{sc:.9});B(BENCH,63,29,{sc:.9});lampAt(60,24,SILV);
  C.person('psc_ysmay',60,30,1);
  plaque(58,31,'pond',['THE MIRROR','POND'],'THE MIRROR POND. The water does not move and does not ripple. Look in it long enough and you see the court as it was before the statues.');
  /* ===== 10. THE LANTERN BENCH: a bench between two statues, a lantern that is always warm ===== */
  encl(67,22,72,28,{hedge:'bloom',gaps:[['S',69,70]],floor:'0',gapFloor:'0'});
  S('st_veiled',68,24);S('st_veiled',71,24);
  nm('psc_lbench','The lantern bench',BENCH,()=>{if(PSC.benchUsed)return say('You have sat here already. The lantern is still warm, and so is the bench.',[BYE]);
    return say('A stone bench between two veiled maidens, and over it a lantern on a hook. The flame in the lantern is yellow, the only warm light in the court, and it has never gone out.',[['Sit a while.',()=>{PSC.benchUsed=1;pscHeal(.15);sfx('potion');G.talk=null;msg('You sit in the lantern light. The ache goes out of your legs.','#ffd9a0');return null}],BYE])});
  thing(BENCH,'psc_lbench',69,24,{sc:1.1});lampAt(69,23,WARM);
  /* ===== 5. THE HOUND KENNEL (84,58): dog statues, a kennel with a skeleton, a chest ===== */
  encl(84,52,90,57,{hedge:'yew',gaps:[['W',54,55]],floor:'3',gapFloor:'1'});
  S('st_hound',85,53);S('st_hound',89,53);S('st_hound',85,56);S('st_hound',89,56);
  B('gy_barrow',88,54,{sc:1.1});P('gy_bones',87,54,{sc:.8});P('gy_bones',88,55,{sc:.7});chest(88,56,{pot:2,mana:1,gold:1400});
  /* ===== 6. THE HEADLESS KNIGHTS' CORNER (86,76): six headless knights facing the wall, one a lever ===== */
  encl(80,71,90,77,{hedge:'yew',gaps:[['N',84,85]],floor:'3',gapFloor:'1'});
  for(const x of [81,83,85,87,89])S('st_headless',x,75);
  nm('psc_knightlever','A headless knight',pspPic('st_headless'),()=>{const Fc=pscF();if(Fc.knight)return say('The sixth knight stands as it stood. The lever in its hand is down.',[BYE]);
    return say('The knight second from the east end holds a stone sword upright, and the cross-guard is a handle. It is the only one whose hand is loose.',[['Pull the sword.',()=>{Fc.knight=1;sfx('door');G.talk=null;msg('A niche opens in the hedge wall behind the knights with a sound like grinding teeth.','#c8c8e8');const g=pscDecorOf('psc_nichering');if(g){g.hidden=false;g.found=false;g.block=true}return null}],BYE])});
  thing(pspPic('st_headless'),'psc_knightlever',87,74,{sc:1});
  nm('psc_nichering','A niche',pspPic('st_hand'),d=>{const Fc=pscF();if(Fc.ring)return say('The niche is empty.',[BYE]);
    return say('A small dark niche with a ring on a velvet cushion, and a card that says: for the one who looked behind them.',[['Take the ring.',()=>{Fc.ring=1;pscGone(d);bl3Give('psknightring');sfx('key');msg('You take the Ring of the Headless Guard.','#ffe36a');G.talk=null;return null}],BYE])});
  {const d=thing('gy_niche','psc_nichering',84,72,{sc:.7});if(d&&!pscF().knight){d.hidden=true;d.found=true;d.block=false}}
  bl3Hide(9730,'psc_nichering',()=>!pscF().knight||pscF().ring);
  /* ===== 7. THE SCULPTOR'S YARD (70,70): Ossian's open workshop ===== */
  encl(60,68,78,80,{hedge:'yew',gaps:[['W',73,74],['N',68,69]],floor:'2',gapFloor:'1'});
  for(const [x,y,n] of [[66,72,'st_chimera'],[72,72,'st_bishop'],[66,76,'st_judge'],[72,76,'st_hydra'],[64,74,'st_hand'],[74,74,'st_mourners']])S(n,x,y);
  for(const [x,y] of [[64,72],[74,76],[65,77],[73,72]])P('barrel',x,y,{block:true,sc:.9});for(const [x,y] of [[70,72],[70,76],[68,74],[71,74]])P('crate',x,y,{block:true,sc:.8});
  for(const [x,y] of [[67,73],[69,75],[71,73]])P('gy_bones',x,y,{sc:.5});
  chest(76,77,{pot:3,mana:2,elixir:1,gold:2600});
  plaque(62,69,'yard',['THE SCULPTOR\'S','YARD'],"THE SCULPTOR'S YARD. A plaque on a half-carved block. Visitors are asked not to touch the unfinished. The unfinished are sensitive.");
  /* ===== 11. THE KNOT (20,64): a hedge maze of 4 by 4 cells with a chest at its heart ===== */
  {const x0=20,y0=65,N=4,cells=[],E=new Set(),vis=new Set(),R=blRng(4242);
   const key=(a,b)=>a+','+b,st=[[0,0]];vis.add('0,0');
   while(st.length){const [a,b]=st[st.length-1],ds=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>{const na=a+dx,nb=b+dy;return na>=0&&nb>=0&&na<N&&nb<N&&!vis.has(key(na,nb))});
     if(!ds.length){st.pop();continue}const [dx,dy]=ds[(R()*ds.length)|0],na=a+dx,nb=b+dy;vis.add(key(na,nb));E.add(key(a*2+1+dx,b*2+1+dy));st.push([na,nb])}
   const wall=(x,y)=>C.solid(x,y,C.ch(HG.yew[(hs(x,y,12)*4)|0]));
   for(let gy=0;gy<9;gy++)for(let gx=0;gx<9;gx++){const x=x0+gx,y=y0+gy;if(rows[y][x]!=='.')continue;fm[y*W+x]='0';
     const odd=gx%2===1&&gy%2===1;if(odd)continue;
     const passage=(gx%2===1||gy%2===1)&&E.has(gx+','+gy);   // an opening between two cells
     if(gx===0||gy===0||gx===8||gy===8){if(gy===8&&gx===3){fm[y*W+x]='1';continue}wall(x,y);continue}
     if(passage)continue;wall(x,y)}
   chest(x0+5,y0+5,{pot:2,mana:2,elixir:1,gold:2200});S('st_hand',x0+1,y0+1);
   plaque(x0+3,y0+10,'knot',['THE KNOT',''],'THE KNOT. A little hedge maze, four paths by four. The way in is at the south. The heart is a little right of the middle. Gardeners have been lost in it, and one of them was only a statue.')}
  /* ===== 12. THE ORCHARD OF STONE FRUIT (80,48 -> 63,57): trees hung with stone apples; one is real ===== */
  encl(58,54,68,60,{hedge:'bloom',gaps:[['S',62,63]],floor:'0',gapFloor:'1'});
  [[60,56],[63,56],[66,56],[60,58],[63,58],[66,58]].forEach(([x,y],i)=>{const id='psc_apple'+i;
    nm(id,'A tree of stone apples',STONETREE,d=>{const Fc=pscF();
      if(i===2){if(Fc.apple)return say('Only stone apples are left on this tree.',[BYE]);return say('A pale tree hung with apples of grey stone. One of them, on a low branch, has a bruise on its side, and a bruise is not a thing that a stone has.',[['Pick the bruised one.',()=>{Fc.apple=1;if(!bagAdd(mkItem('apple')))G.items.push({k:'apple',x:G.P.x,y:G.P.y,taken:false});sfx('key');G.talk=null;msg('It is a real apple, cold and sweet.','#cfe8c8');return null}],BYE])}
      return say('A pale tree hung with apples of grey stone. You pick one up. It is stone, all the way through.',[BYE])});
    thing(STONETREE,id,x,y,{sc:1})});
  plaque(61,61,'orchard',['THE ORCHARD','OF STONE FRUIT'],'THE ORCHARD OF STONE FRUIT. A plaque. The fruit is not for eating. One of the apples was left by mistake.');
  /* the buildings: the Gardener's Lodge and the Mews (Wenlock style walls, door tiles bound to the contract) */
  for(const [h,lvl] of [[{x0:10,y0:56,x1:18,y1:62,face:'S',sty:'wlgrey',roof:'thatch2',wh:2.5,door:[14,62],col:WARM},PSC.LODGE],[{x0:79,y0:59,x1:86,y1:64,face:'S',sty:'wlgrey',roof:'thatch2',wh:2.5,door:[82,64],col:[1.0,.9,1.3]},PSC.MEWS]]){
    C.house(h);const g=C.chars[rows[h.door[1]][h.door[0]]];const l=pspLinkAt(9730,h.door[0],h.door[1]);
    if(l)KH_DOOR[g]={lvl:l.to,get at(){if(!LEVELS[l.to]&&KH_LAZY[l.to])KH_LAZY[l.to]();return {x:l.land[0],y:l.land[1],f:l.land[2]}},psc:1}}
  plaque(13,64,'lodge',['THE GARDENER\'S','LODGE'],"THE GARDENER'S LODGE. A plaque by the door. Hobb Ashby, gardener. Knock before you come in. A fire is lit. Boots off.");
  plaque(84,66,'mews',['THE MEWS','AND STABLE'],'THE MEWS AND STABLE. A plaque by a wide door. The hawks have not been fed for a long time and have not minded.');
  /* the lamps of the wall stairs, benches, ivy around them */
  lampAt(6,58,VIOL);lampAt(6,62,VIOL);lampAt(89,58,VIOL);lampAt(89,62,VIOL);B(BENCH,6,60,{sc:.9});B(BENCH,89,60,{sc:.9});
  /* more of the court: statues singly in the lawns, rings round the lawns */
  for(const [n,x,y] of [['st_bishop',32,34],['st_judge',64,34],['st_hand',40,36],['st_chimera',26,38],['st_hydra',70,38],['st_gargoyle',58,48],['st_veiled',38,48],['st_hound',24,31],['st_headless',72,31],['st_mourners',23,24],['st_bishop',73,24],['st_hand',23,34]])S(n,x,y);
  for(const [n,x,y] of [['st_hound',28,54],['st_judge',20,57],['st_veiled',24,60],['st_chimera',8,64],['st_hydra',18,70],['st_headless',22,76],['st_bishop',30,78],['st_mourners',38,80],['st_gargoyle',34,76],['st_hand',44,66],['st_hound',56,66],['st_judge',54,76],['st_bishop',60,64],['st_veiled',78,64],['st_chimera',88,66],['st_gargoyle',80,82],['st_hydra',72,82],['st_mourners',64,82],['st_hand',9,58],['st_hound',88,80]])S(n,x,y);
  for(const [x,y] of [[18,76],[26,80],[34,72],[40,78],[54,70],[58,80],[76,82],[80,76]])lampAt(x,y,(x+y)%2?SILV:VIOL);
  for(const [x,y] of [[25,44],[31,50],[67,44],[73,50],[26,28],[70,30]])lampAt(x,y,(x+y)%2?SILV:VIOL);
  /* hedge rows along the lawns: low silver hedges and two cross hedges, with gaps */
  {const hh=(x,y)=>{if(rows[y][x]==='.')C.solid(x,y,C.ch(HG.low[(hs(x,y,14)*4)|0]))};
   for(let x=24;x<=38;x++){if(x>=31&&x<=36)continue;hh(x,50)}for(let x=58;x<=72;x++){if(x>=61&&x<=66)continue;hh(x,50)}
   for(let x=5;x<=36;x++){if(x>=14&&x<=18||x>=30&&x<=34||x===5)continue;if(rows[52][x]==='.')hh(x,52)}
   for(let x=58;x<=90;x++){if(x>=64&&x<=66||x>=72&&x<=76||x>=84&&x<=88)continue;hh(x,52)}}
  /* ---- the creatures ---- */
  const ok=(x,y)=>!pscSafe(x,y,9)&&!pscNearFront(x,y,3)&&rows[y]&&rows[y][x]==='.';
  const foe=(t,x,y,rad)=>{const q=C.near(x,y,rad||3,false);if(q&&ok(q[0],q[1]))C.foe(t,q[0],q[1])};
  for(const k in wakers){const [x,y]=k.split(',').map(Number);if(ok(x,y))C.foe(wakers[k],x,y)}
  const WK=[['psgargoyle',[[24,44],[72,44],[40,60],[56,60]]],['pschimera',[[27,40],[69,40],[36,76],[60,76]]],['pshydra',[[37,45],[59,45]]],['psmourner',[[74,55],[56,70]]],['psjudge',[[24,48],[72,48],[48,70]]]];
  for(const [t,l] of WK)for(const [x,y] of l)foe(t,x,y,1);
  for(const [x,y] of [[30,44],[66,44],[30,72],[70,56],[82,80],[56,78]])foe('psmarblehound',x,y);
  for(const [x,y] of [[24,38],[70,52],[62,62],[86,68]])foe('pshedger',x,y);
  for(const [x,y] of [[34,24],[66,26],[26,32],[81,69]])foe('psthornsprite',x,y,2);
  for(const [x,y] of [[30,38],[66,38],[38,56],[78,58]])foe('psmoth',x,y,2);
  for(const [x,y] of [[47,76],[49,72],[47,68],[49,64],[47,28],[49,24]])foe('psguard',x,y,1);
  /* the five wanderers, each on a loop of open ground (PSC.loops) */
  PSC.loops.pscolossus=[[48,46],[53,48],[54,52],[53,56],[48,58],[43,56],[42,52],[43,48]];
  PSC.loops.psgargmother=[[27,34],[70,34]];
  PSC.loops.psthornwarden=[[24,54],[38,54],[38,64],[24,64]];
  PSC.loops.psossian=[[62,70],[76,70],[76,78],[62,78]];
  PSC.loops.pshoundmaster=[[63,33],[71,33],[71,47],[57,47],[57,41],[63,41]];
  C.foe('pscolossus',48,46);C.foe('psgargmother',27,34);C.foe('psthornwarden',24,54);C.foe('psossian',62,70);C.foe('pshoundmaster',63,33);
  foe('pshoundhm',62,33,1);foe('pshoundhm',64,34,1);
  for(const e of C.enemies)if(e.t==='pscolossus'||e.t==='psgargmother'||e.t==='psthornwarden'||e.t==='psossian'||e.t==='pshoundmaster')e.lvl=102;
  /* map names for the parchment sheet */
  C.mapNames.push({t:'The Great Door',x:48,y:18,k:'place'},{t:'The Gallery Door',x:28,y:18,k:'place'},{t:'The Kitchen Door',x:22,y:34,k:'place'},{t:'The Cloister Door',x:74,y:34,k:'place'},{t:'The Great Fountain',x:48,y:52,k:'place'},{t:'The Courtyard Gate',x:48,y:82,k:'place'},
    {t:'The Waystone Nook',x:12,y:76,k:'place'},{t:'The Weeping Alcove',x:30,y:60,k:'place'},{t:'The Rose Garden',x:37,y:70,k:'place'},{t:'The Gargoyle Arbour',x:28,y:25,k:'place'},{t:'The Hound Kennel',x:87,y:54,k:'place'},{t:"The Headless Knights' Corner",x:85,y:74,k:'place'},
    {t:"The Sculptor's Yard",x:69,y:74,k:'place'},{t:'The Hydra Pool',x:39,y:27,k:'place'},{t:'The Mirror Pond',x:60,y:27,k:'place'},{t:'The Lantern Bench',x:69,y:25,k:'place'},{t:'The Knot',x:24,y:69,k:'place'},{t:'The Orchard of Stone Fruit',x:63,y:57,k:'place'},
    {t:"The Gardener's Lodge",x:14,y:59,k:'place'},{t:'The Mews and Stable',x:82,y:61,k:'place'});
  const lv=C.finish({start:{x:48,y:83,f:0},col:[.88,1.0,1.3]});
  lv.floorSet=PSC_FLOORSET.slice();lv.floor=lv.floorSet[0];lv.day=.82;lv.amb=.9;lv.ceilH=7;lv.name=info.name;lv.label=info.name;
  lv._psc={lcol:C.lcol,col:[.88,1.0,1.3]};lv.noTele=false;lv.tele=PSC.TELE;
  lv.sky=lv.sky||[];
  return lv}

/* ---------- the Gardener's Lodge (rest room, 9731) and the Mews and Stable (9732) ---------- */
function pscWidenRoom(L,w,h){   // the contract sizes are one column / one row more than the room maker's: pad with wall
  while(L.rows.length<h)L.rows.push('w'.repeat(L.rows[0].length));
  if(L.rows[0].length<w)L.rows=L.rows.map(r=>r+'w'.repeat(w-r.length))}
function pscLodge(info){
  if(typeof pspPics==='function')pspPics();
  const l=pspLinkAt(9731,10,14);
  blRoom({id:PSC.LODGE,name:info.name,w:20,h:15,amb:.7,rating:101,floor:'wood',wall:'kh_ohwall1_2',
    back:{to:l.to,x:l.land[0],y:l.land[1],f:l.land[2]},
    lights:[[3,2],[16,2],[10,6],[3,10],[16,10]],lcol:{'3,2':[1.5,1.05,.55],'16,2':[1.5,1.05,.55],'10,6':[1.5,1.05,.55],'3,10':[1.4,1.0,.6],'16,10':[1.4,1.0,.6]},col:[1.4,1.0,.6],
    build:({put,raw,npc})=>{
      put('hearth',3,1);put('kitchenshelf',6,1);put('potshelf',8,1);put('rack',12,1);put('rack',13,1);put('bed',16,2);put('bed',18,2);
      for(const [x,y] of [[8,5],[10,5],[12,5]])put('table',x,y);put('chair',7,6);put('chair',13,6);put('cushions',3,6);put('amphora',1,3);put('amphora',1,8);
      raw('crate',17,10,{sc:.9});raw('barrel',18,11,{sc:.9});raw('gy_chest',2,11,{sc:.95});raw('gy_bones',9,10,{block:false,sc:.4});raw('flowerpot',5,2,{block:false,sc:.9});raw('flowerpot',9,12,{block:false,sc:.9});
      npc('psc_gardener',10,3)}});
  PSC.chest['9731:2,11']={pot:3,mana:2,elixir:1,gold:900};
  const L=LEVELS[PSC.LODGE];pscWidenRoom(L,20,16);L.diff=L.rating=101;L.noExtras=true;LEVEL_RATING[PSC.LODGE]=101;return L}
function pscMews(info){
  if(typeof pspPics==='function')pspPics();
  const l=pspLinkAt(9732,12,18);
  const HORSE=pscTint('psc_horse','statue','grayscale(1) brightness(1.4) contrast(.9)',1.5);
  blRoom({id:PSC.MEWS,name:info.name,w:25,h:19,amb:.5,rating:101,floor:'cobble',wall:'kh_ohwall1_0',
    back:{to:l.to,x:l.land[0],y:l.land[1],f:l.land[2]},
    lights:[[4,2],[12,2],[20,2],[4,14],[20,14],[12,9]],lcol:{'4,2':[.9,1.0,1.35],'12,2':[1.0,.8,1.4],'20,2':[.9,1.0,1.35],'4,14':[.9,1.0,1.35],'20,14':[.9,1.0,1.35],'12,9':[1.0,.85,1.4]},col:[.95,1.0,1.3],
    enemies:[['psraven',3,3],['psraven',8,3],['psraven',16,3],['psraven',21,3],['psraven',3,8]],
    build:({put,raw,npc})=>{
      for(const [x,y] of [[3,2],[8,2],[16,2],[21,2],[2,8],[22,8]])raw('gy_rpost',x,y,{sc:1.1});
      raw('gy_rpost',10,15,{npc:'psc_feather',solid:1,deco:false,sc:1.0});
      for(const [x,y] of [[2,13],[6,13],[10,13]]){raw('hay',x,y,{sc:1.0});raw('crate',x+1,y+3,{sc:.8})}
      raw(HORSE,18,13,{sc:1});raw('gy_chest',14,13,{npc:'psc_glovechest',solid:1,deco:false,sc:.95});
      raw('barrel',23,15,{sc:.9});raw('barrel',23,16,{sc:.9});raw('gy_bones',20,11,{block:false,sc:.5});raw('gy_web',1,1,{block:false,sc:.4});raw('gy_web',23,1,{block:false,sc:.4});
      npc('psc_falconer',12,5)}});
  const L=LEVELS[PSC.MEWS];pscWidenRoom(L,26,20);L.diff=L.rating=101;L.noExtras=true;LEVEL_RATING[PSC.MEWS]=101;return L}
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
