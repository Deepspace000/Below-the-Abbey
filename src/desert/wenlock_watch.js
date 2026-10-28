/* ==========================================================================
   WENLOCK: THE WATCH AND THE CELLS (prefix wlz / WLZ). Four watchmen walk fixed routes along the roads of Wenlock, by day and by night, and stop and look about at the corners.
   A watchman SEES a place when it is within about five squares (stealth and masks shorten it), he is facing it (within about sixty degrees, or any way round when it is
   under two squares), nothing solid is in the way and, at night, the place is lit (a lamp, a lit window, or his own lantern, which lights two squares round him).
   Night is 20:00 to 05:00 (G.clock is in minutes, 1440 to the day, the clock shows 'Day 1 08:00'; resting at an inn or camping passes the time).
   Theft (src/desert/wenlock_thief.js) inside a house counts as seen when a watchman sees the square outside the door of that house: he is looking in at the window.
   A thief who is seen is arrested: the party is taken to THE WENLOCK CELLS, level 7097 (a small level beside the Village Hall, in the Wenlock room range 7000 to 7099).
   The gaoler offers bail (500 gold, then out at the steps of the Village Hall) or the sentence: three nights pass, nobody is healed or rested, every hero is Poorly and Flea-bitten (afflictions.js).
   Watchmen never fight and cannot be killed (they are walk-through pictures that only talk). Nothing here needs saving beyond G.flags (wlJailed, wlzWarn, wlzWarnT); the routes are rebuilt on load.
   Quick test link: ?town=wenlock&lvl=80&wlt=1 (also 2, 3, 4, or jail): it is 22:00, the party has 1200 gold and stands at the door of thief house 1 (Church View) with its quest taken; wlt=jail puts it in the cells. Same as wlzDemo(n) in the console.
   Test hooks: WLZ.g (the four watchmen: x, y, f, s, dir, pause, post), wlzSees(g,x,y), wlzArrest(...), wlzDemo(n).
   ========================================================================== */
const WLZ={JAIL:7097,BAIL:500,NIGHTS:3,g:[],blk:null,dec:null,map:null,cue:{}};
const wlzHour=()=>((G.clock||0)%1440)/60;
const wlzNight=()=>{const h=wlzHour();return h>=20||h<5};
/* the beats: waypoints along the roads (axis-aligned legs), walked out and back. ids wlz_g1 to wlz_g4. */
const WLZ_ROUTES=[
  {id:'wlz_g1',name:'Watchman Hobbs',face:'kh_ohsold1_0',beat:'Church Lane and the west end of High Street',pts:[[6,50],[24,50],[24,28]],s0:.62,d0:-1},
  {id:'wlz_g2',name:'Watchman Pell',face:'kh_ohsold1_1',beat:'the market square and Mill Lane',pts:[[42,50],[72,50],[72,80]],s0:.55,d0:1},
  {id:'wlz_g3',name:'Watchman Crane',face:'kh_ohsold1_0',beat:'Green Lane and the back track',pts:[[84,50],[84,14],[62,14]],s0:.3,d0:1},
  {id:'wlz_g4',name:'Watchman Dobbin',face:'kh_ohsold1_1',beat:'the east end of High Street',pts:[[58,50],[74,50],[95,50]],s0:.7,d0:-1}
];
const WLZ_SPEED=1.05, WLZ_ROT=[[1,0],[0,1],[-1,0],[0,-1]];
function wlzInit(){
  WLZ.g=WLZ_ROUTES.map(r=>{
    const len=[0];for(let i=1;i<r.pts.length;i++)len[i]=len[i-1]+Math.abs(r.pts[i][0]-r.pts[i-1][0])+Math.abs(r.pts[i][1]-r.pts[i-1][1]);
    const g={id:r.id,name:r.name,face:r.face,beat:r.beat,pts:r.pts,len,total:len[len.length-1],s:len[len.length-1]*r.s0,dir:r.d0,pause:0,lookT:0,post:null,x:0,y:0,f:[1,0]};
    wlzPlace(g);return g});
}
/* position and facing from the distance along the beat */
function wlzPlace(g){
  const s=Math.max(0,Math.min(g.total,g.s));let i=0;while(i<g.pts.length-2&&s>g.len[i+1])i++;
  const a=g.pts[i],b=g.pts[i+1],L=g.len[i+1]-g.len[i],t=L?(s-g.len[i])/L:0;
  g.x=a[0]+(b[0]-a[0])*t;g.y=a[1]+(b[1]-a[1])*t;
  if(!g.pause&&!g.post){const sx=Math.sign(b[0]-a[0])*g.dir,sy=Math.sign(b[1]-a[1])*g.dir;if(sx||sy)g.f=[sx,sy]}
}
function wlzStep(g,dt){
  if(g.post){g.post.t-=dt;g.f=g.post.f;if(g.post.t<=0)g.post=null;return}
  if(g.pause>0){ // stopped at a corner or the end of the beat: turns round a quarter every so often
    g.pause-=dt;g.lookT-=dt;if(g.lookT<=0){g.lookT=.9;const i=WLZ_ROT.findIndex(q=>q[0]===g.f[0]&&q[1]===g.f[1]);g.f=WLZ_ROT[((i<0?0:i)+1)&3]}
    if(g.pause<=0){g.pause=0;wlzPlace(g)}return}
  const ns=Math.max(0,Math.min(g.total,g.s+g.dir*WLZ_SPEED*dt)),last=g.pts.length-1;
  let hit=-1;  // the first waypoint on the way (a waypoint he is standing on is not "on the way")
  if(g.dir>0){for(let w=0;w<=last;w++)if(g.len[w]>g.s+1e-9&&g.len[w]<=ns+1e-9){hit=w;break}}
  else{for(let w=last;w>=0;w--)if(g.len[w]<g.s-1e-9&&g.len[w]>=ns-1e-9){hit=w;break}}
  if(hit>=0){ // stop and turn
    g.s=g.len[hit];g.pause=(hit===0||hit===last)?3.6:2.4;g.lookT=.9;
    const sx=g.f[0],sy=g.f[1];wlzPlace(g);g.f=[sx,sy];
    if(hit===0)g.dir=1;else if(hit===last)g.dir=-1;
    return}
  g.s=ns;wlzPlace(g);
}
/* what blocks a line of sight in the town: every wall square and every solid thing */
function wlzGrid(){
  const L=LEVELS[496];if(!L||!L.rows)return null;if(WLZ.blk&&WLZ.blk.L===L)return WLZ.blk;
  const W=L.rows[0].length,H=L.rows.length,b=new Uint8Array(W*H);
  for(let y=0;y<H;y++){const r=L.rows[y];for(let x=0;x<W;x++)if(r[x]!=='.')b[y*W+x]=1}
  for(const d of L.decor||[])if(d.block&&!d.npc&&d.x>=0&&d.y>=0&&d.x<W&&d.y<H&&!/^(lamp|sign_)/.test(d.k))b[d.y*W+d.x]=1;
  return WLZ.blk={L,W,H,b};
}
function wlzLOS(ax,ay,bx,by){
  const G2=wlzGrid();if(!G2)return true;
  const dx=bx-ax,dy=by-ay,n=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))*4);
  const sx=Math.round(ax),sy=Math.round(ay),ex=Math.round(bx),ey=Math.round(by);
  for(let i=1;i<n;i++){const x=Math.round(ax+dx*i/n),y=Math.round(ay+dy*i/n);if((x===sx&&y===sy)||(x===ex&&y===ey))continue;if(x<0||y<0||x>=G2.W||y>=G2.H||G2.b[y*G2.W+x])return false}
  return true;
}
/* is this place lit at night? a street lamp or lit window near it, or the watchman's own lantern */
function wlzLit(x,y,g){
  if(!wlzNight())return true;
  if(g&&Math.hypot(x-g.x,y-g.y)<=2.4)return true;
  const L=LEVELS[496];if(!L)return true;
  for(const l of (L.lights||[]))if(Math.hypot(x-l[0],y-l[1])<=3.3)return true;
  for(const l of (L._wlaLights||[]))if(Math.hypot(x-(l[0]-.5),y-(l[1]-.5))<=2.6)return true;
  return false;
}
function wlzRange(){
  let R=5.5;try{if(typeof skLevel==='function')R-=skLevel('stealth')*.25}catch(e){}
  R=Math.max(3,R);try{if(typeof afflHas==='function'&&afflHas('masked'))R*=.6}catch(e){}
  return R;
}
/* does this watchman see the square (x,y)? */
function wlzSees(g,x,y){
  const dx=x-g.x,dy=y-g.y,d=Math.hypot(dx,dy);
  if(d>wlzRange())return false;
  if(d>1.7&&(dx*g.f[0]+dy*g.f[1])/d<.5)return false;
  if(!wlzLOS(g.x,g.y,x,y))return false;
  return wlzLit(x,y,g);
}
/* the first watchman who sees a square, or null */
function wlzWatcher(x,y){for(const g of WLZ.g)if(wlzSees(g,x,y))return g;return null}
/* where the party is, for the watch: in the town its own square; in a house, the square outside that house's door */
function wlzPartySpot(){
  if(LEVEL===496&&G.P)return [G.P.x,G.P.y];
  const t=typeof wltHouseOf==='function'?wltHouseOf(LEVEL):null;
  return t?[t.h.front[0],t.h.front[1]]:null;
}
function wlzWatching(){const p=wlzPartySpot();return p?wlzWatcher(p[0],p[1]):null}
/* the watchman stops where he is, facing a square, for a while (he saw somebody go in) */
function wlzPost(g,x,y,secs){const dx=x-g.x,dy=y-g.y;g.post={t:secs||150,f:Math.abs(dx)>=Math.abs(dy)?[Math.sign(dx)||1,0]:[0,Math.sign(dy)||1]};g.pause=0}
/* ---- the talk: watchmen only talk ---- */
for(const r of WLZ_ROUTES){
  khNpc(r.id,r.name,r.face,d=>{
    const night=wlzNight(),F=G.flags;
    const day=['Morning. I walk '+r.beat+', and back again. Keep your blades sheathed and your boots out of the flower beds.','Nothing to report. Nothing ever is, which is how I like it.','If you lose something, the village hall has a lost property box. It is mostly hats.'];
    const nt=['Evening. The lamps are lit and I am watching. Anybody who walks into a house that is not theirs, after dark, answers to me.','I walk '+r.beat+' all night. I stop at the corners and look about. People who are up to something tend to stay out of the lamplight.','Thieves get bail at 500 gold or three nights in the cells. I am told the straw has fleas. I do not like to say how I know.'];
    const L=night?nt:day,k='wlzt_'+r.id,i=(F[k]||0)%L.length;F[k]=i+1;
    return say(L[i],[BYE])},{sc:1});
}
/* ---- the arrest ---- */
function wlzCatch(g,text,after){
  G.talk={d:{k:khFaceKey(g?g.face:'kh_ohsold1_0'),x:G.P.x,y:G.P.y},n:{name:g?g.name:'A watchman'},node:say(text,[['Go quietly.',()=>{after();return null}]]),t:G.time,btns:[]};G.hold=null;G.queued=null;
  sfx('locked');
}
/* the watch has seen a theft (or a warning ignored): the party is arrested. why: a line about it. */
function wlzArrest(g,why,extra){
  g=g||WLZ.g[0];
  wlzCatch(g,why||'Halt! Thieves! I saw the whole thing. You are under arrest, all of you. The cells will cool your tempers.',()=>wlzJail(extra));
}
function wlzJail(extra){
  const F=G.flags;F.wlJailed=1;F.wlJails=(F.wlJails||0)+1;F.wlzWarn=0;
  let lost=[];try{if(typeof wltConfiscate==='function')lost=wltConfiscate(extra)}catch(e){console.error(e)}
  for(const g of WLZ.g){g.post=null}
  if(!LEVELS[WLZ.JAIL]&&KH_LAZY[WLZ.JAIL])KH_LAZY[WLZ.JAIL]();
  sfx('locked');
  WLZ._arrive=1;goToLevel(WLZ.JAIL,{x:6,y:2,f:2});WLZ._arrive=0;
  later(300,()=>{msg('The cell door slams. You are in the Wenlock cells.','#d0b090');for(const t of lost)msg(t,'#e0a070')});
}
/* released: out of the front of the Village Hall, in the morning or straight away */
function wlzRelease(){
  const F=G.flags,hall=WL_HOUSES.find(h=>h.spk==='hall');
  F.wlJailed=0;WLZ._rel=1;
  try{sfx('door');goToLevel(496,{x:hall.front[0],y:hall.front[1],f:hall.out})}finally{WLZ._rel=0}
  later(300,()=>msg('You stand on the steps of the Village Hall, blinking.','#e8d8a0'));
}
function wlzBail(){
  if(G.gold<WLZ.BAIL)return false;
  G.gold-=WLZ.BAIL;msg(WLZ.BAIL+' gold paid in bail.','#e8c870');wlzRelease();return true;
}
/* three nights on straw: the clock moves on to the morning after the third night; nobody heals, nobody rests */
function wlzServe(){
  const hrs=G.heroes.map(h=>[h.hp,h.mp]),food=G.heroes.map(h=>h.food);
  const c=G.clock||0,day=Math.floor(c/1440),hr=(c%1440)/60,target=(day+(hr<5?WLZ.NIGHTS-1:WLZ.NIGHTS))*1440+480;
  advanceTime(Math.max(60,target-c));
  G.heroes.forEach((h,i)=>{h.hp=Math.min(h.hp,hrs[i][0]);h.mp=Math.min(h.mp,hrs[i][1]);if(h.alive)h.food=Math.max(food[i],35)}); // thin gruel: nobody starves, nobody mends
  try{const M=G.flags.affM;if(M)M.lastRest=G.clock}catch(e){}
  try{afflInflict('poorly',-1);afflInflict('fleas',-1)}catch(e){console.error(e)}
  msg('Three nights pass on cold straw. Nobody sleeps well.','#d0b090');
  wlzRelease();
}
/* ---- the cells: a small level beside the Village Hall ---- */
WLIR('jail',{w:13,h:9,look:'cellar',amb:.36,lights:[[2,2],[6,2],[10,2],[3,6],[9,6]],keeper:null,noExtras:1,
  props:[['bed',1,1,{free:1,h:.55}],['bed',11,1,{free:1,h:.55}],['bed',6,1,{free:1,h:.55}]],
  folk:[['wlz_gaoler',6,4],['wlz_drunk',2,2],['wlz_poacher',10,2]],win:[],raw:[['barrel',1,7],['crate',11,7],['sacks',11,6],['barrel',2,7],['crate',4,7]]});
khNpc('wlz_gaoler','Gaoler Grimble','kh_oqmen_1',d=>{
  const F=G.flags;
  if(!F.wlJailed)return say('Go on, then. And keep your hands in your own pockets.',[BYE]);
  const short=Math.max(0,WLZ.BAIL-G.gold);
  const pay=['Pay 500 gold bail.',()=>{if(!wlzBail())return say('You are '+short+' gold short. I do not give credit.',[BYE]);return null}];
  const serve=['Serve three nights.',()=>say('Three nights, then. You will be let out in the morning of the fourth day. The bread is stale, the straw has fleas, and it is damp. Nobody gets any rest or healing. Are you sure?',[['Yes, serve the sentence.',()=>{wlzServe();return null}],['Let me think.',()=>null]])];
  return say('You were seen thieving in Wenlock. The law here is plain. You can pay 500 gold bail and walk out onto the steps of the Village Hall now. Or you can sit out three nights in the cells. The bread is stale, the straw has fleas, and you will come out ill. Anything stolen that you are carrying has been taken from you.'+(short?' You have '+G.gold+' gold, so bail is '+short+' short.':''),[pay,serve,['Let me think.',()=>null]])});
khNpc('wlz_drunk','A man asleep on the straw','kh_ohfolk3_5',()=>say('He is asleep, on his back, with his mouth open. He smells of ale. A sign on the wall says: DRUNK AND DISORDERLY, ONE NIGHT.',[BYE]),{sc:.9});
khNpc('wlz_poacher','A man in the end cell','kh_oqmen_5',()=>say('"Three nights for a rabbit," he says. "It was a very small rabbit. Do not take a rabbit, friend. And keep away from the watchman on Church Lane, he has eyes like a hawk."',[BYE]),{sc:.95});
KH_LAZY[WLZ.JAIL]=()=>{
  if(LEVELS[WLZ.JAIL])return;
  const hall=WL_HOUSES.find(h=>h.spk==='hall'),back={to:496,x:hall.front[0],y:hall.front[1],f:hall.out};
  const b={id:'wlin'+WLZ.JAIL,wlin:'jail',name:'The Wenlock Cells',room:'cellar',keeper:null,floor:'wood',wallImg:'kh_ohwall1_0'};
  const R=khRoom(b,WLZ.JAIL,back),lv=R.level;
  // three cells along the north wall, each with an opening on to the corridor; the gaoler stands in the opening of the middle one
  const rows=lv.rows.map(r=>r.split(''));
  for(let y=1;y<=3;y++){rows[y][4]='w';rows[y][8]='w'}
  for(let x=1;x<=11;x++)if(x!==2&&x!==6&&x!==10)rows[4][x]='w';
  lv.rows=rows.map(r=>r.join(''));
  lv.portals[0].req='wlzOpen';lv.portals[0].lock='The cell door is locked. Speak to the gaoler.';
  lv.start={x:6,y:2,f:2};lv.diff=80;lv.noExtras=true;
  LEVELS[WLZ.JAIL]=lv;LEVEL_NAMES[WLZ.JAIL]='The Wenlock Cells';LEVEL_RATING[WLZ.JAIL]=80;
};
LEVEL_NAMES[WLZ.JAIL]='The Wenlock Cells';LEVEL_RATING[WLZ.JAIL]=80;
/* nobody walks out of the cells by the menu or a jump while jailed */
{const _g=goToLevel;goToLevel=function(n,entry){
  if(G.flags&&G.flags.wlJailed&&LEVEL===WLZ.JAIL&&n!==WLZ.JAIL&&!WLZ._rel){try{sfx('locked');msg('You are in a locked cell. Speak to the gaoler.','#d09a80')}catch(e){}return}
  return _g.apply(this,arguments)}}
if(typeof jumpToLevel==='function'){const _j=jumpToLevel;jumpToLevel=function(n){if(G.flags&&G.flags.wlJailed&&LEVEL===WLZ.JAIL&&n!==WLZ.JAIL&&!WLZ._rel){try{msg('You are in a locked cell. Speak to the gaoler.','#d09a80')}catch(e){}return}return _j.apply(this,arguments)}}
/* ---- the pass that puts the four watchmen in the town (the town builder calls the polish passes at the end of wlBuild) ---- */
function wlzPass(C){
  if(!WLZ.g.length)wlzInit();
  WLZ.g.forEach((g,i)=>{const kp=KH_KEEPERS[g.id];if(!kp)return;C.walk(khFaceKey(kp.face),Math.round(g.x),Math.round(g.y),{npc:g.id,sc:.98,cloudid:'wlzg'+i})});
}
WLP_PASSES.push(['watch',C=>wlzPass(C)]);
/* ---- every frame: the watchmen walk (while the party is in the town the pictures move; in a house they go on walking out of sight) ---- */
function wlzTick(dt){
  if(G.state!=='play'||!G.heroes)return;
  dt=Math.min(dt,.1);
  if(!WLZ.g.length)wlzInit();
  if(!G.talk&&!G.cut&&!G.menu){for(const g of WLZ.g)wlzStep(g,dt)}
  if(LEVEL===496){
    if(WLZ.dec!==G.decor){WLZ.dec=G.decor;WLZ.map=new Map();for(const d of G.decor)if(d.cloudid&&/^wlzg\d$/.test(d.cloudid))WLZ.map.set(d.cloudid,d)}
    WLZ.g.forEach((g,i)=>{const d=WLZ.map.get('wlzg'+i);if(!d)return;d.x=Math.floor(g.x+.5);d.y=Math.floor(g.y+.5);d.ox=g.x-d.x;d.oy=g.y-d.y;d.bob=g.pause>0||g.post?0:.012+.012*Math.abs(Math.sin(G.time*6+i))});
    // each watchman carries a lantern: a warm light that moves with him (it only shows at dusk and by night)
    if(WLZ.lampsIn!==LIGHTS){WLZ.lampsIn=LIGHTS;WLZ.lamps=WLZ.g.map((g,i)=>{const l={x:g.x+.5,y:g.y+.5,ph:i*1.7,key:-7000-i,taken:false,red:false,free:true,lamp:true,calm:true,col:[1.3,.95,.5],range2:10,kI:.7,wlz:1};LIGHTS.push(l);return l})}
    WLZ.g.forEach((g,i)=>{const l=WLZ.lamps&&WLZ.lamps[i];if(l){l.x=g.x+.5;l.y=g.y+.5}});
    if(!WLZ._url){WLZ._url=1;const m=/[?&]wlt=(\w+)/.exec(location.search);if(m)try{wlzDemo(m[1]==='jail'?'jail':+m[1])}catch(e){console.error(e)}}
  }else if(typeof wltHouseOf==='function'&&wltHouseOf(LEVEL)){ // inside a house at night: footsteps and lantern light outside
    const t=wltHouseOf(LEVEL),h=t.h;let best=null,bd=99;
    for(const g of WLZ.g){const d=Math.hypot(g.x-h.front[0],g.y-h.front[1]);if(d<bd){bd=d;best=g}}
    const c=WLZ.cue;
    if(bd<=8&&!c[LEVEL]){c[LEVEL]=1;msg('Boots in the street outside. A lantern moves past the shutters.','#c8c0a0')}
    else if(bd>11)c[LEVEL]=0;
  }
}
{const _u=update;update=function(dt){try{wlzTick(dt)}catch(e){if(!WLZ._err){WLZ._err=1;console.error('wlz',e)}}return _u.apply(this,arguments)}}
function wlzDemo(n){
  const F=G.flags;G.clock=Math.floor((G.clock||0)/1440)*1440+22*60;if(G.gold<1200)G.gold=1200;
  if(!G.quests.wlq1)G.quests.wlq1={st:'done',ord:(F.qSeq=(F.qSeq|0)+1),base:0};
  if(n==='jail'){F.wlJailed=1;if(!LEVELS[WLZ.JAIL])KH_LAZY[WLZ.JAIL]();goToLevel(WLZ.JAIL,{x:6,y:2,f:2});return}
  const t=wltHouses()[n-1];if(!t)return;
  const q='wlq'+(59+n);if(qSt(q)===null)qAccept(q);
  goToLevel(496,{x:t.h.front[0],y:t.h.front[1],f:t.h.out===0?2:t.h.out===2?0:t.h.out===1?3:1});
}
