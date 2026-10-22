/* ==========================================================================
   THE BOAT LAKES (prefix hgdb / HGDB). Three lakes lie inside the great maze of the Deeper Hollow (level 475), each a closed room of deep water ringed with wall (laid out in hgd_maze.js, filled in
   hgd_lakes.js). Each has two docks, a departure dock and a far dock: a wooden tile in the ring where a corridor ends, with steps going down into the water and a boat. Walking into the dock offers
   a hop aboard; in the boat (G.flags.hgdBoat) the party moves over water only, the view is the bow of a wooden boat, and the steps are water. Walking into a dock from the water offers to land.
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
function hgdbDockGid(TM){OH_STY.hgdb_dock=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:hgdbTexDock(),door:hgdbTexDock(),win:hgdbTexDock(),alt:hgdbTexDock(),zoom:1,contrast:1,tint:[255,255,255,0]});return TM.make('plain','hgdb_dock',2.7).gid}
const hgdbL=()=>{const L=LEVELS[HGD.ID];return L&&L._hgdl?L:null};
const hgdbWater=(x,y)=>{const L=LEVELS[HGD.ID];return !!(L&&L.fmap&&L.fmap[y]&&L.fmap[y][x]==='6')};
const hgdbOn=()=>LEVEL===HGD.ID&&G.flags&&G.flags.hgdBoat;
// the map shows the docks
{const _dn=hgdmpDrawNames;hgdmpDrawNames=function(vi){try{const L=hgdbL(),V=MPL.view;if(L&&V&&V.z&&vi<5){const A=V.area,z=V.z;ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
    for(const k of L._hgdl.lakes)if(k.docks)for(const d of [k.docks.dep,k.docks.far]){const px=A.x+(V.X(d.x+.5)-V.sx0)*z,py=A.y+(V.Y(d.y+.5)-V.sy0)*z;if(px<A.x||px>A.x+A.w||py<A.y||py>A.y+A.h)continue;hgdmpBoatIcon(ctx,px,py,Math.max(.9,Math.min(1.6,.7+z*.12)))}
    ctx.restore()}}catch(e){}return _dn.apply(this,arguments)}}
/* ---------- hopping on, and landing ---------- */
function hgdbPrompt(text,opts){G.talk={d:{k:'_',x:G.P.x,y:G.P.y},n:{name:'A dock'},node:say(text,opts),t:G.time,btns:[]};G.hold=null;G.queued=null}
function hgdbFindDock(nx,ny){const L=hgdbL();if(!L)return null;for(const k of L._hgdl.lakes){if(!k.docks)continue;for(const side of ['dep','far']){const d=k.docks[side];if(d.x===nx&&d.y===ny)return {k,side,d}}}return null}
function hgdbHop(f){const d=f.d;G.flags.hgdBoat={lk:f.k.i,side:f.side};G.P.x=d.wx;G.P.y=d.wy;G.P.f=DIRS.findIndex(q=>q[0]===d.dx&&q[1]===d.dy);G.P.angT=(G.P.f-1)*Math.PI/2;G.C={x:G.P.x,y:G.P.y,a:G.P.angT};reveal();msg('You step into the boat and push off. Steer it with the arrows. It is a small lake, and things move in the water.','#9fe0c0');sfx('door')}
function hgdbLand(f){const d=f.d,F=G.flags;if(f.side==='far'){F.hgdFar=F.hgdFar||{};F.hgdFar[f.k.i]=1}F.hgdBoat=null;G.P.x=d.ax;G.P.y=d.ay;G.P.f=DIRS.findIndex(q=>q[0]===-d.dx&&q[1]===-d.dy);G.P.angT=(G.P.f-1)*Math.PI/2;G.C={x:G.P.x,y:G.P.y,a:G.P.angT};reveal();msg(f.side==='far'?'The boat bumps the far dock. You climb the steps and walk on.':'The boat bumps the dock. You climb the steps.','#e8e0a0');sfx('door')}
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===HGD.ID&&hgdbL()){const boat=!!G.flags.hgdBoat,dk=hgdbFindDock(nx,ny);
      if(dk){sfx('locked');
        if(!boat)hgdbPrompt('A flight of wooden steps goes down into dark water, and a little boat is tied at the bottom. The lake is deep, and the boat is the only way across. Do you want to hop on?',[['Hop on.',()=>{G.talk=null;hgdbHop(dk);return null}],['Not now.',()=>null]]);
        else hgdbPrompt(dk.side==='far'?'The far dock. Wooden steps lead up into a corridor. Do you want to land here and go on on foot?':'The dock where you started. Wooden steps lead up into a corridor. Do you want to land here?',[['Land.',()=>{G.talk=null;hgdbLand(dk);return null}],['Keep steering.',()=>null]]);return true}
      if(g===0){const w=hgdbWater(nx,ny);
        if(boat&&!w){sfx('bump');G.shake=.08;msg('The boat cannot go on land.','#9fc0d0');return true}
        if(!boat&&w){sfx('bump');G.shake=.08;msg('The water is too deep to wade. There is a boat at the dock.','#9fc0d0');return true}}}}catch(e){console.warn('hgdb',e)}
  return _db.apply(this,arguments)}}
// the boat does not outlive the lake: any other way into or out of the maze puts the party on its feet
function hgdbDeep(){if(FLOORS.hgdl_deep)return FLOORS.hgdl_deep;const s=FLOORS.hgtb_deep||FLOORS.water;if(!s)return null;const o=new Uint8ClampedArray(s.length);for(let i=0;i<s.length;i+=4){o[i]=s[i]*1.5+10;o[i+1]=s[i+1]*1.6+22;o[i+2]=s[i+2]*1.7+38;o[i+3]=s[i+3]}return FLOORS.hgdl_deep=o}
function hgdbFloor(){G.fl7=LEVEL===HGD.ID&&typeof FLOORS!=='undefined'?hgdbDeep():null}
{const _g=goToLevel;goToLevel=function(n,e){const r=_g.apply(this,arguments);try{if(G.flags&&G.flags.hgdBoat&&(LEVEL!==HGD.ID||!hgdbWater(G.P.x,G.P.y)))G.flags.hgdBoat=null;hgdbFloor()}catch(x){}return r}}
{const _r=restore;restore=function(sv){const r=_r.apply(this,arguments);try{hgdbFloor();if(G.flags&&G.flags.hgdBoat&&!(LEVEL===HGD.ID&&hgdbWater(G.P.x,G.P.y)))G.flags.hgdBoat=null}catch(e){}return r}}
{const _u=update;update=function(dt){if(G.fl7===undefined||(LEVEL===HGD.ID)!==!!G.fl7)try{hgdbFloor()}catch(e){}return _u.apply(this,arguments)}}
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
    const v=.8+Math.random()*.4;nz(.32,(n==='step'?.2:.1)*v*SNDOPT.steps,'bandpass',900+Math.random()*500,450,0);nz(.55,.11*v*SNDOPT.steps,'lowpass',520,180,.06);
    if(n==='step'){tone(300+Math.random()*120,170,.1,'sine',.05*SNDOPT.steps,.02);if(Math.random()<.5)tone(500+Math.random()*300,260,.06,'sine',.035*SNDOPT.steps,.16)}return}
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
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('There are lakes in the maze, with a boat at the steps down to each. Cross by boat and you save a long walk, but the water has crocodiles in it.');
