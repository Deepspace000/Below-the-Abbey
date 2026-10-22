/* ==========================================================================
   THE BOAT LAKES (prefix hgdb / HGDB). Three lakes lie inside the great maze of the Deeper Hollow (level 475), each a closed room of deep water ringed with wall (laid out in hgd_maze.js, filled in
   hgd_lakes.js). Each has two docks, a departure dock and a far dock: a wooden tile in the ring where a corridor ends, with steps going down into the water and a boat. The boat lies at anchor where it was left (G.flags.hgdBoats); the Embark button appears on land near it and the Disembark button in the boat beside a landing, as at the Narrow Sea. In the boat (G.flags.hgdBoat) the party moves over water only and the view is the bow of a wooden boat.
   ========================================================================== */
const HGDB={DIFF:73};
Object.assign(ENEMY_DEF,{
  hgwcroc:{name:'Swamp Crocodile',hp:300,dmg:[15,26],hit:.8,w:1.9,img:'hgw_croc',xp:230,gold:[10,40],speed:1,verb:'snaps at',aboveParty:1},
  hgweel:{name:'Marsh Eel',hp:150,dmg:[10,18],hit:.8,w:1.1,img:'uw_eel_0',xp:150,gold:[0,12],speed:1,verb:'bites'},
  hgwsnake:{name:'Vine Snake',hp:130,dmg:[9,16],hit:.82,w:1.0,img:'hgw_snake',xp:140,gold:[0,10],speed:1,verb:'strikes'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('hgwcroc','hgweel','hgwsnake');
AFFL_HITS.push([/^hgwsnake/,'stung',.3],[/^hgwcroc/,'bleeding',.2],[/^hgweel/,'fever',.1]);
function hgdbArt(){if(!IMG.hgw_croc&&IMG.firelizard){try{hlTint('firelizard',30,90,40,.62,'hgw_croc');if(IMG.firelizardA)hlTint('firelizardA',30,90,40,.62,'hgw_crocA')}catch(e){}}
  if(!IMG.hgw_snake&&IMG.cobra){try{hlTint('cobra',40,150,60,.55,'hgw_snake');if(IMG.cobraA)hlTint('cobraA',40,150,60,.55,'hgw_snakeA')}catch(e){}}}
/* ---------- the dock tile ---------- */
function hgdbTexDock(){const key='hgdb_dock';if(IMG[key])return key;if(IMG.art_tex_hgdp_dock&&IMG.art_tex_hgdp_dock.width)return 'art_tex_hgdp_dock';
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{const b=IMG.tex_abbeywall;if(b)x.drawImage(b,0,0,w,h);else{x.fillStyle='#4a4638';x.fillRect(0,0,w,h)}x.fillStyle='rgba(0,16,20,.3)';x.fillRect(0,0,w,h);
    const g=x.createLinearGradient(0,40,0,h);g.addColorStop(0,'#2a6a74');g.addColorStop(1,'#0a2a34');x.fillStyle=g;x.beginPath();x.moveTo(14,h);x.lineTo(14,50);x.quadraticCurveTo(14,14,64,14);x.quadraticCurveTo(114,14,114,50);x.lineTo(114,h);x.closePath();x.fill();x.strokeStyle='#0c1418';x.lineWidth=3;x.stroke();
    x.fillStyle='#8a5a2c';x.strokeStyle='#2a1808';x.lineWidth=2;x.beginPath();x.moveTo(34,92);x.quadraticCurveTo(64,112,94,92);x.lineTo(88,80);x.lineTo(40,80);x.closePath();x.fill();x.stroke();
    x.fillStyle='#c8a060';x.fillRect(44,84,40,4);
    x.strokeStyle='rgba(180,240,230,.5)';x.lineWidth=1.4;for(let i=0;i<3;i++){x.beginPath();x.moveTo(24,100+i*8);x.quadraticCurveTo(64,94+i*8,104,100+i*8);x.stroke()}
    x.fillStyle='#7a5a30';x.fillRect(8,110,112,10);x.strokeStyle='#2a1808';x.lineWidth=1.4;x.strokeRect(8,110,112,10);for(let i=1;i<7;i++){x.beginPath();x.moveTo(8+i*16,110);x.lineTo(8+i*16,120);x.stroke()}
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.strokeRect(1.5,1.5,w-3,h-3)});
  return key}
function hgdbDockGid(TM){OH_STY.hgdb_dock=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'tex_abbeywall',door:hgdbTexDock(),win:'tex_abbeywall',alt:'tex_abbeywall',zoom:1,contrast:1,tint:[255,255,255,0]});return TM.make('door','hgdb_dock',2.7).gid} // one dock picture at the bottom of the wall, plain stone above it (not three stacked docks)
const hgdbL=()=>{const L=LEVELS[HGD.ID];return L&&L._hgdl?L:null};
const hgdbWater=(x,y)=>{const L=LEVELS[HGD.ID];return !!(L&&L.fmap&&L.fmap[y]&&L.fmap[y][x]==='6')};
const hgdbOn=()=>LEVEL===HGD.ID&&G.flags&&G.flags.hgdBoat;
// every dock of a lake: the old lakes have a departure dock and a far dock, the Flooded Quarter has four
function hgdbDocksOf(k){if(k.wm)return (k.wdocks||[]).map(d=>({k,d,side:'d'+d.n,n:d.n}));if(!k.docks)return [];return [{k,d:k.docks.dep,side:'dep'},{k,d:k.docks.far,side:'far'}]}
function hgdbAllDocks(L){const o=[];for(const k of L._hgdl.lakes)for(const q of hgdbDocksOf(k))o.push(q);return o}
const hgdbDirOf=(dx,dy)=>Math.max(0,DIRS.findIndex(q=>q[0]===dx&&q[1]===dy));
// the map shows the docks
{const _dn=hgdmpDrawNames;hgdmpDrawNames=function(vi){try{const L=hgdbL(),V=MPL.view;if(L&&V&&V.z&&vi<5){const A=V.area,z=V.z;ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
    for(const q of hgdbAllDocks(L)){const d=q.d,px=A.x+(V.X(d.x+.5)-V.sx0)*z,py=A.y+(V.Y(d.y+.5)-V.sy0)*z;if(px<A.x||px>A.x+A.w||py<A.y||py>A.y+A.h)continue;hgdmpBoatIcon(ctx,px,py,Math.max(.9,Math.min(1.6,.7+z*.12)))}
    ctx.restore()}}catch(e){}return _dn.apply(this,arguments)}}
// the name of the Flooded Quarter on the map
{const _n=hgdmpNames;hgdmpNames=function(vi){const out=_n.apply(this,arguments);try{const L=hgdbL();if(L&&vi<5){const V=HGDMP.views[vi],[,,vx,vy,vw,vh]=V;for(const k of L._hgdl.lakes)if(k.wm){const cx=(k.x0+k.x1)/2,cy=(k.y0+k.y1)/2;if(cx>=vx-2&&cx<=vx+vw+2&&cy>=vy-2&&cy<=vy+vh+2)out.push({t:k.name,x:cx+.5,y:cy+.5,dy:0,k:'water'})}}}catch(e){}return out}}
/* ---------- the boat at anchor, embarking and disembarking (the same buttons as the Narrow Sea ship: Disembark in the boat beside a landing, Embark on land within eight squares of the boat) ---------- */
// where each lake's boat lies: where it was left (G.flags.hgdBoats, kept in the save), or at the departure dock at first
function hgdbBoatAt(k){const F=G.flags,b=F.hgdBoats&&F.hgdBoats[k.i];if(b)return b;const q=hgdbDocksOf(k)[0];if(!q)return null;return {x:q.d.wx,y:q.d.wy,f:hgdbDirOf(q.d.dx,q.d.dy)}}
function hgdbSync(){ // the anchored boats are sprites on the water; the boat you ride is not
  const L=hgdbL();if(LEVEL!==HGD.ID||!L||!G.decor||!G.flags)return;const F=G.flags,ride=F.hgdBoat?F.hgdBoat.lk:-1,sig=ride+'|'+JSON.stringify(F.hgdBoats||{});
  if(G._hgdbRef===G.decor&&G._hgdbSig===sig)return;
  G.decor=G.decor.filter(d=>!d.hgdBoatSpr);
  for(const k of L._hgdl.lakes){if(k.i===ride)continue;const b=hgdbBoatAt(k);if(b)G.decor.push({k:'yar_boat_row',x:b.x,y:b.y,block:false,walk:true,deco:false,hgdBoatSpr:1,hgdl:1,bob:-.22})}
  G._hgdbRef=G.decor;G._hgdbSig=sig}
function hgdbEmbark(k){
  const F=G.flags,b=hgdbBoatAt(k);if(!b)return;
  F.hgdBoat={lk:k.i,side:'e'};G.P.x=b.x;G.P.y=b.y;G.P.f=b.f;G.P.angT=(G.P.f-1)*Math.PI/2;G.C={x:G.P.x,y:G.P.y,a:G.P.angT};reveal();
  if(k.wm&&!F.hgdWmSeen){F.hgdWmSeen=1;msg('You push off into The Flooded Quarter, a maze of deep channels between high walls.','#9fe0c0')}
  else msg(k.wm?'You step into the boat and push off. Steer it with the arrows.':'You step into the boat and push off. Steer it with the arrows. It is a small lake, and things move in the water.','#9fe0c0');
  sfx('door');hgdbSync()}
function hgdbDisembark(q){
  const F=G.flags,d=q.d;if(q.side==='far'){F.hgdFar=F.hgdFar||{};F.hgdFar[q.k.i]=1}if(q.k.wm){F.hgdWd=F.hgdWd||{};F.hgdWd[q.n]=1}
  F.hgdBoats=F.hgdBoats||{};F.hgdBoats[q.k.i]={x:d.wx,y:d.wy,f:G.P.f};F.hgdBoat=null;
  G.P.x=d.ax;G.P.y=d.ay;G.P.f=hgdbDirOf(-d.dx,-d.dy);G.P.angT=(G.P.f-1)*Math.PI/2;G.C={x:G.P.x,y:G.P.y,a:G.P.angT};reveal();
  msg(q.side==='far'?'The boat bumps the far dock. You climb the steps and walk on. The boat stays tied at the steps.':'You climb the steps to the landing. The boat stays tied at the steps.','#e8e0a0');sfx('door');hgdbSync()}
function hgdbNearLanding(){ // in the boat: the landing within three squares
  const L=hgdbL();if(!L||!G.flags.hgdBoat)return null;let best=null,bd=99;
  for(const q of hgdbAllDocks(L)){if(q.k.i!==G.flags.hgdBoat.lk)continue;const dd=Math.hypot(G.P.x-q.d.ax,G.P.y-q.d.ay);if(dd<=3.1&&dd<bd){bd=dd;best=q}}return best}
function hgdbNearBoat(){ // on land: a boat at anchor within eight squares
  const L=hgdbL();if(!L||G.flags.hgdBoat)return null;let best=null,bd=99;
  for(const k of L._hgdl.lakes){const b=hgdbBoatAt(k);if(!b)continue;const dd=Math.hypot(G.P.x-b.x,G.P.y-b.y);if(dd<=8&&dd<bd){bd=dd;best=k}}return best}
function hgdbButtons(){
  if(LEVEL!==HGD.ID||G.state!=='play'||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||G.overview||TP||!hgdbL())return;
  if(G.flags.hgdBoat){const q=hgdbNearLanding();if(q)btnText('hgdbdis','Disembark',6,180,100,22)}
  else if(hgdbNearBoat())btnText('hgdbemb','Embark',6,180,100,22)}
{const _h=uwHud;uwHud=function(){_h.apply(this,arguments);try{hgdbButtons()}catch(e){}}}
{const _b=handleBtn;handleBtn=function(id){
  if((id==='hgdbdis'||id==='hgdbemb')&&G.state==='play'&&!G.cut&&!G.talk&&!G.menu&&!TP){if(id==='hgdbdis'){const q=hgdbNearLanding();if(q)hgdbDisembark(q)}else{const k=hgdbNearBoat();if(k)hgdbEmbark(k)}return}
  _b(id)}}
// the dock is only scenery with steps now; and the boat moves only on water, the party never wades into deep water
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===HGD.ID&&hgdbL()){const boat=!!G.flags.hgdBoat;
      if(hgdbAllDocks(hgdbL()).some(q=>q.d.x===nx&&q.d.y===ny)){sfx('bump');if(!G.flags.hgdDockHint){G.flags.hgdDockHint=1;msg(boat?'Wooden steps go up to a landing. Use the Disembark button when you are close.':'Wooden steps go down into dark water, with a boat tied below. Use the Embark button when you are near it.','#9fc0d0')}return true}
      if(g===0){const w=hgdbWater(nx,ny);
        if(boat&&!w){sfx('bump');G.shake=.08;msg('The boat cannot go on land.','#9fc0d0');return true}
        if(!boat&&w){sfx('bump');G.shake=.08;msg('The water is too deep to wade. Find the boat and use the Embark button.','#9fc0d0');return true}}}}catch(e){console.warn('hgdb',e)}
  return _db.apply(this,arguments)}}
// the boat does not outlive the lake: any other way into or out of the maze puts the party on its feet
function hgdbDeep(){if(FLOORS.hgdl_deep)return FLOORS.hgdl_deep;const s=FLOORS.hgtb_deep||FLOORS.water;if(!s)return null;const o=new Uint8ClampedArray(s.length);for(let i=0;i<s.length;i+=4){o[i]=s[i]*1.5+10;o[i+1]=s[i+1]*1.6+22;o[i+2]=s[i+2]*1.7+38;o[i+3]=s[i+3]}return FLOORS.hgdl_deep=o}
function hgdbFloor(){G.fl7=LEVEL===HGD.ID&&typeof FLOORS!=='undefined'?hgdbDeep():null}
{const _g=goToLevel;goToLevel=function(n,e){const r=_g.apply(this,arguments);try{if(G.flags&&G.flags.hgdBoat&&(LEVEL!==HGD.ID||!hgdbWater(G.P.x,G.P.y)))G.flags.hgdBoat=null;hgdbFloor()}catch(x){}return r}}
{const _r=restore;restore=function(sv){const r=_r.apply(this,arguments);try{hgdbFloor();if(G.flags&&G.flags.hgdBoat&&!(LEVEL===HGD.ID&&hgdbWater(G.P.x,G.P.y)))G.flags.hgdBoat=null}catch(e){}return r}}
{const _u=update;update=function(dt){try{hgdbSync()}catch(e){}if(G.fl7===undefined||(LEVEL===HGD.ID)!==!!G.fl7)try{hgdbFloor()}catch(e){}return _u.apply(this,arguments)}}
/* ---------- the view: the bow of a wooden boat, bobbing on the water ---------- */
function hgdbHud(){
  if(!hgdbOn()||G.state!=='play'||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||G.overview)return;
  const im=IMG.art_hgdl_bow,t=G.time;if(!im||!im.width)return;
  const w=400,hh=w*im.height/im.width,bob=Math.sin(t*1.3)*1.8+Math.sin(t*.41)*1.3,sway=Math.sin(t*.7)*1.2,x=(420-w)/2+sway;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();
  // the lap of the water along both sides of the hull
  ctx.strokeStyle='rgba(190,235,240,.55)';ctx.lineWidth=1.2;
  for(let i=0;i<5;i++){const y=150+i*11+Math.sin(t*1.1+i)*1.5,ph=t*.9+i*1.7;for(const s of [0,1]){const bx=s?330:90,dir=s?1:-1;ctx.beginPath();ctx.moveTo(bx+dir*(10+i*14),y);ctx.quadraticCurveTo(bx+dir*(26+i*14),y-2.5+Math.sin(ph)*1.2,bx+dir*(44+i*14),y);ctx.stroke()}}
  ctx.drawImage(im,x,210-hh*.76+bob,w,hh);
  ctx.fillStyle='rgba(120,200,220,.22)';const ly=203+Math.sin(t*1.6)*1.2;ctx.fillRect(0,ly,420,210-ly);
  ctx.restore()}
{const _h=uwHud;uwHud=function(){_h.apply(this,arguments);try{hgdbHud()}catch(e){}}}
/* ---------- the sound: steps are the lap of water and the dip of an oar; a soft hush of water all the while ---------- */
{const _s=sfx;sfx=function(n){if((n==='step'||n==='turn')&&hgdbOn()&&AC&&!G.mute&&SNDOPT.steps){
    const v=.8+Math.random()*.4;nz(.34,(n==='step'?.1:.06)*v*SNDOPT.steps,'lowpass',3800*v,1400,0);nz(.3,.06*v*SNDOPT.steps,'highpass',2000*v,3800,.02);nz(.55,.05*v*SNDOPT.steps,'lowpass',900,300,.06);
    return}
  return _s.apply(this,arguments)}}
const HGDBS={src:null,hush:null,next:0};
function hgdbSound(){
  if(!AC||typeof NB==='undefined'||!NB)return;const now=AC.currentTime,on=G.state==='play'&&!G.mute&&SNDOPT.amb&&hgdbOn();
  if(!HGDBS.src){const mk=(type,f,q)=>{const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;s.loop=true;s.loopStart=Math.random()*.5;fl.type=type;fl.frequency.value=f;fl.Q.value=q;g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(MASTER);s.start();return {s,f:fl,g}};
    HGDBS.src=mk('lowpass',320,.7);HGDBS.hush=mk('bandpass',1800,.6)}
  const sw=.5+.5*Math.sin(now*.43)*Math.sin(now*.15+1);
  HGDBS.src.g.gain.setTargetAtTime(on?.14+.1*sw:0,now,.5);HGDBS.src.f.frequency.setTargetAtTime(240+260*sw,now,.4);HGDBS.hush.g.gain.setTargetAtTime(on?.012+.03*sw:0,now,.6);
  if(on&&now>HGDBS.next){HGDBS.next=now+1.8+Math.random()*3.5;nz(.5,.13,'bandpass',1200,520,0);if(Math.random()<.4)tone(380+Math.random()*200,200,.09,'sine',.04,.1)}}
{const _s=seaSoundTick;seaSoundTick=function(){_s.apply(this,arguments);try{hgdbSound()}catch(e){}}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('There are lakes in the maze, with a boat tied at the steps down to each. Use the Embark button by the steps. Cross by boat and you save a long walk, but the water has crocodiles in it.');
