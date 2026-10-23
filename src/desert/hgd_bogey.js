/* ==========================================================================
   THE BOGEYMAN WANDERS THE UNDERLEVEL (prefix bgyw / BGYW), level 476. There is no timer. He is one creature that is in the level from the start, and he walks the corridors on his own,
   slowly and patiently: a random wander along the passages that leans toward the squares where the party has walked. He never shows on the mini map, and in the 3D view he is only a dark shape
   (his own creature type, hlbogeyw, glows much less than the fighting one). He walks only on free floor squares (never a wall, a statue, the water or the party's own square); the level is packed with creatures, so he slips through their squares like smoke.
   When he gets close (the next square, or two squares away with a free square between) he springs: the full-screen jump scare of hgd_dark.js, then the fight at the party's own level against hlbogey.
   He can come from behind, from the side or head on. He cannot scare in the first 20 seconds of a visit or for 30 seconds after a scare, and never while another creature is close, a fight is on, or the party is
   in a menu, a talk or aboard a boat (he waits). If the party gets away from the fight he slips off and comes again 40 to 90 seconds later, at least 25 squares away. If he is killed he is gone until the party
   next enters the Underlevel (G.flags.hgdnBogeyDead, cleared on entry). Once a visit, when he first comes within about 7 squares behind or beside the party, a line says so and a faint heartbeat plays near him.
   Nothing here is kept in the level or in a save except his position as an ordinary creature (the save already stores creatures); everything else is in G.bgyw, which is not saved and is rebuilt on entry.
   ========================================================================== */
const BGYW={ID:476,GRACE:20,AFTER:30,WARN:7,TRAIL:40,PURSUE:.3};
ENEMY_DEF.hlbogeyw=Object.assign({},ENEMY_DEF.hlbogey,{glow:.16}); // the wandering figure: a dark shape; the fighting one (hlbogey) is the old Bogeyman, unchanged
const bgywS=()=>G.bgyw||(G.bgyw={noScare:G.time+BGYW.GRACE,trail:[],dirty:true,field:null,fieldT:-9,pm:new Map(),pmT:-9,from:null,p:1,dur:1,pause:0,rest:false,dir:null,warned:false,mode:null,spawnAt:undefined,hb:0,sbuf:null,loseT:0,blk:null,blkA:null,blkN:-1});
const bgywBusy=()=>!!(G.cut||G.talk||G.menu||G.map||G.overview||(G.inv&&G.inv.open)||G.loot||TP);
const bgywBoat=()=>typeof hgoOn==='function'&&!!hgoOn();
/* free floor: not a wall, a statue, a tree, the water or the edge of the map */
function bgywBlk(){const S=bgywS();if(S.blkA!==G.decor||S.blkN!==G.decor.length){S.blkA=G.decor;S.blkN=G.decor.length;S.blk=new Set();for(const d of G.decor)if(d.block&&!d.found)S.blk.add(d.y*MW+d.x)}return S.blk}
const bgywLand=(x,y)=>x>0&&y>0&&x<MW-1&&y<MH-1&&G.grid[y][x]===0&&!cellBlocked(x,y)&&!(typeof hgoWater==='function'&&hgoWater(x,y))&&!bgywBlk().has(y*MW+x);
const bgywFree=(x,y)=>bgywLand(x,y)&&!enemyAt(x,y)&&!(x===G.P.x&&y===G.P.y); // a square with nothing on it
const bgywStep=(x,y)=>bgywLand(x,y)&&!(x===G.P.x&&y===G.P.y); // a square he may walk to: the Underlevel is packed with creatures (a quarter of its floor), so he slips through them like smoke, but never onto the party
/* the walking cost from some starting squares over the free floor, as a number for every square (-1 beyond the cap). A step costs 2, so a start can be given a cost in halves of a square */
function bgywDist(seeds,cap,buf){
  const n=MW*MH,d=buf&&buf.length===n?buf.fill(-1):new Int16Array(n).fill(-1),bk=[];
  for(const [x,y,c] of seeds){const i=y*MW+x;if(d[i]<0||c<d[i]){d[i]=c;(bk[c]=bk[c]||[]).push(i)}}
  for(let c=0;c<=cap;c++){const a=bk[c];if(!a)continue;
    for(let k=0;k<a.length;k++){const i=a[k];if(d[i]!==c)continue;const x=i%MW,y=(i/MW)|0,nc=c+2;if(nc>cap)continue;
      for(let q=0;q<4;q++){const nx=x+DIRS[q][0],ny=y+DIRS[q][1];if(!bgywLand(nx,ny))continue;const j=ny*MW+nx;if(d[j]<0||nc<d[j]){d[j]=nc;(bk[nc]=bk[nc]||[]).push(j)}}}}
  return d}
/* the squares round the party and how many steps each is from it, up to lim (a Map of square number to steps) */
function bgywNear(lim){
  const m=new Map(),q=[[G.P.x,G.P.y]];m.set(G.P.y*MW+G.P.x,0);
  for(let i=0;i<q.length;i++){const [x,y]=q[i],d=m.get(y*MW+x);if(d>=lim)continue;
    for(const v of DIRS){const nx=x+v[0],ny=y+v[1],k=ny*MW+nx;if(m.has(k)||!bgywLand(nx,ny))continue;m.set(k,d+1);q.push([nx,ny])}}
  return m}
const bgywLvl=()=>Math.round(G.heroes.reduce((n,h)=>n+h.lvl,0)/Math.max(1,G.heroes.length));
/* he is somewhere in the dark, at least 25 squares from the party (by the passages, and in a straight line too), where the party cannot see him, on a square with nothing on it */
function bgywSpawn(){
  const S=bgywS(),px=G.P.x,py=G.P.y,d=bgywDist([[px,py,0]],160,S.sbuf);S.sbuf=d;
  const occ=new Set(G.enemies.filter(e=>e.hp>0).map(e=>e.y*MW+e.x)),near=[],far=[],any=[];
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){
    if(Math.abs(x-px)+Math.abs(y-py)<25||occ.has(y*MW+x)||!bgywLand(x,y))continue;
    const c=d[y*MW+x];if(c>=50)(c<=120?near:far).push([x,y]);else any.push([x,y])}
  const pool=near.length?near:far.length?far:any;if(!pool.length)return false;
  let at=null;for(let t=0;t<12&&!at;t++){const c=pool[(Math.random()*pool.length)|0];if(!hasLOS(c[0],c[1],px,py))at=c}
  if(!at)at=pool[(Math.random()*pool.length)|0];
  const pl=bgywLvl(),st=enemyStat('hlbogeyw',pl);
  G.enemies.push({id:Math.max(G.enemies.length,ENEMY_SPAWNS.length),t:'hlbogeyw',lvl:pl,x:at[0],y:at[1],rx:at[0],ry:at[1],hp:st.hp,maxhp:st.hp,alert:false,chilled:0,flash:0,lunge:0,dying:0,seed:Math.random()*10,sx:210,sy:100});
  S.from=[at[0],at[1]];S.p=S.dur=1;S.dir=null;S.pause=0;S.rest=false;S.loseT=0;return true}
/* anything else close, or a fight on: he waits */
const bgywBlocked=e=>{const P=G.P;return G.enemies.some(q=>{if(q===e||q.hp<=0||q.dying||q.t==='hlbogey'||q.t==='hlbogeyw')return false;const m=Math.abs(q.x-P.x)+Math.abs(q.y-P.y);return m<=3||(q.alert&&m<=7)})};
/* the square next to the party that he can spring to: where he is, if that is next to the party; or the square between, two squares away with a free square between */
function bgywSpring(e){
  const P=G.P,m=Math.abs(e.x-P.x)+Math.abs(e.y-P.y);if(m===1)return [e.x,e.y];
  if(m===2)for(const v of DIRS){const x=P.x+v[0],y=P.y+v[1];if(Math.abs(x-e.x)+Math.abs(y-e.y)===1&&bgywFree(x,y))return [x,y]}
  return null}
/* he stops being a wanderer and becomes the Bogeyman of the old fight, at the party's own level */
function bgywTurn(e){
  const fr=e.hp/e.maxhp,pl=bgywLvl();e.t='hlbogey';e.lvl=pl;e.maxhp=enemyStat('hlbogey',pl).hp;e.hp=Math.max(1,Math.ceil(e.maxhp*fr));e.alert=true;
  const S=bgywS();S.mode='fight';S.noScare=Math.max(S.noScare,G.time+BGYW.AFTER);S.loseT=0}
function bgywScare(e,cell){
  const P=G.P,fd=DIRS[P.f];e.x=cell[0];e.y=cell[1];bgywTurn(e);e.lunge=1; // rx and ry glide in: he lunges the last square
  const dot=(e.x-P.x)*fd[0]+(e.y-P.y)*fd[1];
  (G.hgdn=G.hgdn||{}).scare=G.time;G.shake=.9;sfx('screech');sfx('hit');
  msg(dot>0?'THE BOGEYMAN LEAPS OUT OF THE DARK, RIGHT IN FRONT OF YOU!':dot<0?'THE BOGEYMAN IS RIGHT BEHIND YOU!':'THE BOGEYMAN IS RIGHT BESIDE YOU!','#ff6a5a');
  const l=hlLive();if(l.length&&Math.random()<.5){try{afflInflict('shaken',l[(Math.random()*l.length)|0],true)}catch(x){}}}
/* his next square: mostly straight on, now and then a turn, never back on himself unless it is a dead end, and often a step toward where the party has been */
function bgywPick(S,e){
  const P=G.P,cx=e.x,cy=e.y;let opts=[];
  for(let q=0;q<4;q++){const nx=cx+DIRS[q][0],ny=cy+DIRS[q][1];if(bgywStep(nx,ny))opts.push([nx,ny,q])}
  if(G.time<S.noScare){const d0=Math.abs(cx-P.x)+Math.abs(cy-P.y);opts=opts.filter(o=>{const d=Math.abs(o[0]-P.x)+Math.abs(o[1]-P.y);return d>=3||d>d0})} // while he cannot scare, he keeps out of the party's way
  if(!opts.length)return null;
  if(!S.field||(S.dirty&&G.time-S.fieldT>1.5)){const n=S.trail.length;S.field=bgywDist(S.trail.map((c,i)=>[c[0],c[1],n-1-i]),150,S.field);S.fieldT=G.time;S.dirty=false}
  const D=S.field,here=D[cy*MW+cx];let pick=null;
  if(here>=0&&Math.random()<BGYW.PURSUE){let best=null;for(const o of opts){const v=D[o[1]*MW+o[0]];if(v>=0&&v<here&&(!best||v<best[0]))best=[v,o]}if(best)pick=best[1]}
  if(!pick){const rev=S.dir===null?-1:(S.dir+2)%4,non=opts.filter(o=>o[2]!==rev),pool=non.length?non:opts,str=pool.find(o=>o[2]===S.dir);pick=(str&&Math.random()<.75)?str:pool[(Math.random()*pool.length)|0]}
  S.dir=pick[2];return pick}
function bgywBeat(k){ // a faint heartbeat, from the sounds the game already makes (no audio file)
  if(!AC||G.mute||!SNDOPT.amb)return;tone(56,40,.17,'sine',.2*k);nz(.1,.05*k,'lowpass',200,90,0);tone(48,36,.2,'sine',.13*k,.21);nz(.1,.03*k,'lowpass',180,80,.21)}
function bgywWander(S,e,dt){
  const P=G.P,fd=DIRS[P.f],man=Math.abs(e.x-P.x)+Math.abs(e.y-P.y),busy=bgywBusy(),boat=bgywBoat(),wait=bgywBlocked(e);
  S.mode='wander';if(!S.from){S.from=[e.x,e.y];S.p=S.dur=1}
  if(G.time-S.pmT>.4){S.pmT=G.time;S.pm=bgywNear(10)}
  // a breath behind or beside the party: said once a visit, with a heartbeat that grows as he comes near
  {const pd=S.pm.get(e.y*MW+e.x),dot=(e.x-P.x)*fd[0]+(e.y-P.y)*fd[1];
    if(pd!==undefined&&pd<=9&&dot<=0&&!busy){
      if(!S.warned&&man<=BGYW.WARN){S.warned=true;msg(dot<0?'Something is breathing behind you.':'Something is breathing close beside you.','#9a8fc0')}
      if(S.warned&&G.time>=S.hb){S.hb=G.time+1.15;bgywBeat(.35+.65*(1-pd/10))}}}
  // close: he springs
  if(!busy&&!boat&&!wait&&G.time>=S.noScare){const c=bgywSpring(e);if(c){bgywScare(e,c);return}}
  // his slow walk (he stands still while the party is in a menu or a talk, aboard a boat, or busy with something else close by)
  if(!(busy||boat||(wait&&man<=8))){
    if(S.pause>0)S.pause-=dt;
    else{
      if(S.p<S.dur)S.p=Math.min(S.dur,S.p+dt);
      if(S.p>=S.dur){
        const go=()=>{const o=bgywPick(S,e);if(o){S.from=[e.x,e.y];e.x=o[0];e.y=o[1];S.p=0;S.dur=1.1+Math.random()*.25}else S.pause=.6};
        if(S.rest){S.rest=false;go()}else if(Math.random()<.1){S.rest=true;S.pause=.8+Math.random()*1.4}else go()}}}
  const f=S.from,k=Math.min(1,S.p/S.dur);e.rx=f[0]+(e.x-f[0])*k;e.ry=f[1]+(e.y-f[1])*k}
function bgywFight(S,e,dt){
  S.mode='fight';
  if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)>14&&!G.timers.length){ // the party got away: he slips back into the dark and comes again later, far off
    S.loseT+=dt;if(S.loseT>3){G.enemies=G.enemies.filter(q=>q!==e);S.mode=null;S.loseT=0;S.spawnAt=G.time+40+Math.random()*50}}
  else S.loseT=0}
function bgywTick(dt){
  if(LEVEL!==BGYW.ID||G.state!=='play'||!G.enemies||!G.P||!G.decor)return;
  const S=bgywS(),F=G.flags,P=G.P;
  {const tr=S.trail,l=tr[tr.length-1];if(!l||l[0]!==P.x||l[1]!==P.y){tr.push([P.x,P.y]);if(tr.length>BGYW.TRAIL)tr.shift();S.dirty=true}} // where the party has been
  const e=G.enemies.find(q=>q.hp>0&&!q.dying&&(q.t==='hlbogeyw'||q.t==='hlbogey'));
  if(!e){
    if(S.mode==='fight'){S.mode=null;if(G.enemies.some(q=>q.t==='hlbogey'&&q.hp<=0))F.hgdnBogeyDead=1}
    if(F.hgdnBogeyDead)return; // killed: gone for the rest of this visit
    if(S.spawnAt===undefined)S.spawnAt=G.time; // the first moment of a visit: he is already somewhere in the dark
    if(G.time>=S.spawnAt){if(bgywSpawn()){S.spawnAt=undefined;S.mode='wander'}else S.spawnAt=G.time+3}
    return}
  S.spawnAt=undefined;
  if(e.t==='hlbogey')bgywFight(S,e,dt);else bgywWander(S,e,dt)}
/* ---------- the hooks ---------- */
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{bgywTick(dt)}catch(e){console.error('bgyw',e)}return r}}
{const _ea=enemyAct;enemyAct=function(e){if(e&&e.t==='hlbogeyw')return 0;return _ea.apply(this,arguments)}} // he does not act in the rounds: his walk is in real time (above)
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){ // hurt before he springs (an arrow, a spell): the fight starts, with no jump scare
  try{if(e&&e.t==='hlbogeyw'&&e.hp>0)bgywTurn(e)}catch(x){}
  const was=e&&e.hp>0,r=_he.apply(this,arguments);
  try{if(was&&e.hp<=0&&e.t==='hlbogey'&&LEVEL===BGYW.ID&&G.flags)G.flags.hgdnBogeyDead=1}catch(x){}
  return r}}
{const _m=drawMinimap;drawMinimap=function(){ // never on the mini map while he wanders
  const hid=[];try{if(LEVEL===BGYW.ID)for(const e of G.enemies)if(e.t==='hlbogeyw'&&e.hp>0){hid.push([e,e.hp]);e.hp=-1}}catch(x){}
  try{return _m.apply(this,arguments)}finally{for(const h of hid)h[0].hp=h[1]}}}
{const _dp=drawEnemyPlate;drawEnemyPlate=function(){try{const f=frontEnemy(4);if(f&&f.e.t==='hlbogeyw')return}catch(x){}return _dp.apply(this,arguments)}} // no name plate for a dark shape
{const _g=goToLevel;goToLevel=function(n){const r=_g.apply(this,arguments);try{G.bgyw=null;if(n===BGYW.ID&&LEVEL===BGYW.ID&&G.flags)delete G.flags.hgdnBogeyDead}catch(e){}return r}} // a new visit: he is back
{const _rn=restoreNow;restoreNow=function(){const r=_rn.apply(this,arguments);try{G.bgyw=null}catch(e){}return r}}
