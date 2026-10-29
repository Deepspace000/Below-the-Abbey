/* ==========================================================================
   THE NEVER-ENDING TOWER: THE WAY IN (prefix ntm). The entrance hall "The Crooked Tower" (level id NT.BASE), the great door (sealed with pale silver until the Pale Spire is finished),
   the place on the world map north of the Pale Spire, the teleport network (a handful of floors to choose from), the achievements, the stats line, the Go to area rows, the jump links
   (?town=neverending and ?town=neverending&floor=N), the parchment map of a floor.
   ntUnlock() opens the tower; the Pale Spire's last boss is meant to call it (or set G.flags.psp.finished). Notes: tools/NT_NOTES.md
   ========================================================================== */
const NTM={JUMP_CAP:300,MILESTONES:[10,25,50,100,250,500,1000]};
LEVEL_NAMES[NT.BASE]='The Crooked Tower';LEVEL_RATING[NT.BASE]=100;
const ntF=()=>{const F=G.flags;return F.nt||(F.nt={deepest:0,best:{floor:0,level:0},ms:{}})};
const ntUnlocked=()=>{const F=G.flags||{};return !!((F.psp&&F.psp.finished)||(F.nt&&(F.nt.open||F.nt.debug)))};
function ntUnlock(){const f=ntF();if(!f.open){f.open=1;try{msg('Far to the north, a door of pale silver unlocks with a sound like a bell.','#d8e4ff');sfx('win')}catch(e){}}}
/* ---------- the entrance hall ---------- */
const NTE={W:38,H:30,door:{x0:17,x1:20,y:3},gate:{x0:18,x1:19,y:27}};
function ntBuildEntrance(){
  if(LEVELS[NT.BASE])return LEVELS[NT.BASE];
  if(!NT.ready)throw new Error('nt: pictures not loaded');
  gyAlias();
  const W=NTE.W,H=NTE.H,a=new Uint8Array(W*H),open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&a[y*W+x]===1,hs=(x,y,c)=>hash2(x,y,c+4141);
  for(let y=4;y<=26;y++)for(let x=2;x<=35;x++)a[y*W+x]=1;
  for(let y=5;y<=25;y++)for(const x of [8,13,24,29]){if(y%6===3)a[y*W+x]=0}   // columns
  for(let y=8;y<=22;y+=7)for(const x of [4,5,32,33])a[y*W+x]=0;
  for(let x=NTE.door.x0;x<=NTE.door.x1;x++)a[3*W+x]=0;   // the door tiles are walls
  const look={n:0,wallBase:'texGrey',wallVar:1,pattern:'ashlar',wh:2.3,amb:.07,
    pal:{hue:225,sat:.12,val:.9,wallTint:[.92,.98,1.16],floorTint:[.88,.93,1.12],ceilTint:[.85,.9,1.1],flame:3,lcol:[.75,.95,1.65],name:'Silver'}};
  look.pal.ceilTint=[.85,.9,1.1];
  NT._making=true;let T,gDoor=[],gGate=[],gStone;
  try{T=ntWallTiles(0,look);
    if(IMG.nt_tower_front)IMG.gyp_nt_tower_front=IMG.nt_tower_front;
    const fr=IMG.gyp_nt_tower_front?'nt_tower_front':'f_gothic';
    for(let i=0;i<4;i++)gDoor.push(ntTile(0,'texGrey_0',2.3,{fac:{img:fr,i,n:4},gain:1.1,rgb:look.pal.wallTint,tag:'nt0d'+i,emit:.32}));
    for(let i=0;i<2;i++)gGate.push(ntTile(0,'texGrey_0',2.3,{fac:{img:'gatesC_0',i,n:2},gain:1.1,rgb:look.pal.wallTint,tag:'nt0g'+i,emit:.25}))}finally{NT._making=false}
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const PL=T.plain.map(ch),FAR=ch(T.far),rows=[];
  for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){if(open(x,y)){s+='.';continue}s+=near(x,y)?PL[(hs(x,y,5)*PL.length)|0]:FAR}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  for(let i=0;i<4;i++){put(NTE.door.x0+i,NTE.door.y,ch(gDoor[i]));KH_DOOR[gDoor[i]]={nt:'door'}}
  for(let i=0;i<2;i++){put(NTE.gate.x0+i,NTE.gate.y,ch(gGate[i]));KH_DOOR[gGate[i]]={nt:'exit'}}
  const decor=[],lights=[],lcol={},V={lcol,col:look.pal.lcol,torch:{fl:3,col:look.pal.lcol,red:false}};
  V.torches=ntTorchSpots(open,W,H,(x,y)=>y===NTE.door.y||y===NTE.gate.y,hs);
  const dec=(k,x,y,o)=>{o=o||{};if(!IMG[k]||!open(x,y))return;decor.push(Object.assign({k,x,y,block:!!o.block,walk:!o.block,deco:!o.block,sc:o.sc||1},o.block?{}:{}))};
  for(const [x,y] of [[16,5],[21,5],[10,5],[27,5],[3,5],[34,5],[10,24],[27,24]]){if(open(x,y)){decor.push({k:'brazier',x,y,block:true,sc:1});lights.push([x,y]);lcol[x+','+y]=look.pal.lcol}}
  decor.push({k:'sign_gy',x:18,y:6,block:false,wd:[0,-1],txt:['THE NEVER-ENDING TOWER','Each floor is one level higher than the last'],sc:1});
  decor.push({k:'sign_gy',x:19,y:24,block:false,wd:[0,1],txt:['THE CROOKED TOWER','North of the Pale Spire'],sc:1});
  for(const [x,y] of [[6,12],[6,18],[31,12],[31,18]])dec('gy_slab',x,y,{block:true,sc:.9});
  const fm=[];for(let y=0;y<H;y++)fm.push('0'.repeat(W).split(''));
  for(let y=4;y<=26;y++)for(let x=2;x<=35;x++){if(x>=15&&x<=22&&y<=12)fm[y][x]='3';else if(x>=17&&x<=20)fm[y][x]='1'}
  const fSet=ntFloorSet(0,look),ceil=ntCeil(0,look);
  const L={rows,chars,fmap:fm.map(r=>r.join('')),floorSet:fSet,floor:fSet[0],floor2:fSet[1],ceil,ceilH:2.3,start:{x:18,y:24,f:0},enemies:[],items:[],decor,lights,portals:[],day:0,amb:.07,torchGap:1e9,noExtras:true,
    tele:{x:21,y:23},name:'The Crooked Tower',label:'The Crooked Tower',diff:100,mapNames:[],_nt:V,_gems:1,_entrance:1};
  LEVELS[NT.BASE]=L;
  NT.ENT={back:{x:18,y:4,f:2},arrive:{x:18,y:26,f:0}};
  return L}
KH_LAZY[NT.BASE]=()=>{if(!NT.ready)return null;return ntBuildEntrance()};
/* the great door and the south gate */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.nt==='door'){
    if(!ntUnlocked()){sfx('locked');msg('The great door is sealed with pale silver. No key opens it, and it will not move.','#d8e4ff');return true}
    sfx('door');const {plan}=ntPlan(1);goToLevel(ntIdOf(1),{x:plan.down.ix,y:plan.down.iy,f:plan.down.f});return true}
  if(d&&d.nt==='exit'){
    const to=typeof PSP!=='undefined'&&PSP.ENTRY?PSP.ENTRY:null;
    if(to&&(LEVELS[to.id]||KH_LAZY[to.id])){sfx('door');goToLevel(to.id,{x:to.x,y:to.y,f:to.f});return true}
    sfx('bump');msg('The road south to the Pale Spire is lost in cold mist.','#b8c8e0');return true}
  return _k.apply(this,arguments)}}
/* ---------- arrival: the deepest floor, the milestones ---------- */
function ntArrive(n,restored){
  const f=ntFloorOf(n),F=ntF();
  if(!restored)ntEvict(f);
  if(f<1)return
  if(f>F.deepest){
    F.deepest=f;F.best={floor:f,level:partyLevel()};
    if(!restored&&f>1)try{msg('New deepest floor: Floor '+f+', level '+partyLevel()+'.','#ffe36a');sfx('win')}catch(e){}}
  for(const m of NTM.MILESTONES)if(f>=m&&!F.ms[m]){F.ms[m]=1;if(!restored)try{msg('ACHIEVEMENT: Floor '+m+' of the Never-Ending Tower.','#ffe36a');sfx('win')}catch(e){}}}
/* the achievements page: the tower's own part at the end of the list */
{const _al=achList;achList=function(){
  const r=_al.apply(this,arguments);
  try{const F=(G.flags&&G.flags.nt)||{deepest:0,best:{floor:0,level:0},ms:{}};
    r.out.push({h:'The Never-Ending Tower'});
    r.out.push({n:F.deepest?'Deepest: Floor '+F.deepest+', level '+(F.best&&F.best.level||ntRatingOf(F.deepest)):'Not yet entered',s:F.deepest>0});
    for(const m of NTM.MILESTONES)r.out.push({n:'Reached floor '+m,s:!!(F.ms&&F.ms[m])})}catch(e){console.error(e)}
  return r}}
{const _ss=statSections;statSections=function(){
  const secs=_ss.apply(this,arguments);
  try{const F=(G.flags&&G.flags.nt)||{deepest:0,best:{floor:0,level:0}};
    const road=secs.find(s=>s[0]==='THE ROAD');
    if(road)road[1].push(['Never-Ending Tower',F.deepest?'Floor '+stN(F.deepest)+', level '+stN(F.best.level||ntRatingOf(F.deepest)):'not yet'])}catch(e){console.error(e)}
  return secs}}
/* ---------- the world map: a huge crooked tower north of the Pale Spire ---------- */
if(typeof WMB_PLACES!=='undefined'&&typeof WORLD_LOCS!=='undefined'&&!WORLD_LOCS.some(l=>l.k==='neverending')){
  const P={k:'neverending',n:'The Never-Ending Tower',full:'The Never-Ending Tower',r:'100 and up',x:-906,y:98,ids:[],ic:'castle',pic:[['i_spire',0,0,36],['i_spire',3,-22,27],['i_spire',7,-38,19]],note:'a huge crooked tower, north of the Pale Spire',pale:1};
  Object.defineProperty(P,'ids',{enumerable:true,configurable:true,get(){return (ntUnlocked()||NT.DEBUG)?[NT.BASE]:[]}});
  WMB_PLACES.push(P);
  const o={k:P.k,n:P.n,x:P.x,y:P.y,ic:P.ic,bl:P,planned:P.r,get lv(){return P.ids.filter(wmbHas)}};
  WORLD_LOCS.push(o);WMN_SPEC[P.k]=P.pic;
  if(typeof WORLD_ROADS!=='undefined'&&!WORLD_ROADS.some(r=>r.join()==='palespire,neverending'))WORLD_ROADS.push(['palespire','neverending'])}
/* floors of the tower belong to the tower on the map */
{const _tl=teleLocOf;teleLocOf=function(n,d){if(ntIs(n))return WORLD_LOCS.find(l=>l.k==='neverending')||null;return _tl.apply(this,arguments)}}
if(typeof WMW_INTERIOR!=='undefined'){const _wi=WMW_INTERIOR;}
/* ---------- the teleport network: a handful of floors, and plus and minus buttons ---------- */
function ntWoken(){return Object.keys(G.flags.teles||{}).map(Number).filter(n=>ntIs(n)&&G.flags.teles[n]).map(ntFloorOf).filter(f=>f>=0).sort((a,b)=>a-b)}
function ntNearWoken(list,target,dir){   // the woken floor nearest to target in the direction (dir>0: at or above, dir<0: at or below); null if none
  if(dir>0){for(const f of list)if(f>=target)return f}else{for(let i=list.length-1;i>=0;i--)if(list[i]<=target)return list[i]}return null}
/* a sensible handful: the entrance, floor 1, the highest woken, the ten floors round the current one, and multiples of 10 and 25 up to the highest */
function ntHandful(){
  const w=ntWoken(),set=new Set(),hi=w.length?w[w.length-1]:0,cur=ntIs(LEVEL)?ntFloorOf(LEVEL):0;
  for(const f of w){if(f===0||f===1||f===hi||(Math.abs(f-cur)<=10)||f%25===0||(f%10===0&&f<=hi))set.add(f)}
  return [...set].sort((a,b)=>a-b)}
{const _lat=teleLevelsAt;teleLevelsAt=function(loc){
  if(loc&&loc.k==='neverending')return ntHandful().map(ntIdOf);
  return _lat.apply(this,arguments)}}
function ntTeleNode(sel,page){
  const w=ntWoken();if(!w.length)return say('The stone does not answer.',[BYE]);
  const hi=w[w.length-1];sel=Math.max(w[0],Math.min(hi,sel));if(!w.includes(sel))sel=ntNearWoken(w,sel,-1)||w[0];
  const cur=ntIs(LEVEL)?ntFloorOf(LEVEL):-1,nm=f=>f===0?'the entrance hall':'floor '+f;
  const opts=[];
  opts.push(['Go to '+nm(sel)+(sel>0?' (level '+ntRatingOf(sel)+')':''),()=>{if(sel===cur){return say('You are already there.',[BYE])}teleportTo(ntIdOf(sel));return null}]);
  const step=(label,t,dir)=>{const f=ntNearWoken(w,t,dir);if(f!==null&&f!==sel)opts.push([label+': '+nm(f),()=>ntTeleNode(f,page)])};
  if(page===1){
    step('100 floors up',sel+100,1);step('100 floors down',sel-100,-1);step('1000 floors up',sel+1000,1);step('1000 floors down',sel-1000,-1);
    step('The highest woken stone',hi,-1);step('Floor 1',1,1);
    opts.push(['Back.',()=>ntTeleNode(sel,0)])}
  else{
    step('Next stone up',sel+1,1);step('Next stone down',sel-1,-1);step('About 10 floors up',sel+10,1);step('About 10 floors down',sel-10,-1);
    if(hi>=100)opts.push(['Longer leaps...',()=>ntTeleNode(sel,1)]);
    opts.push(['Stay here.',()=>null])}
  return say('The Never-Ending Tower. Woken stones: '+w.length+'. The highest is on floor '+hi+'. Where to?',opts)}
{const _tf=teleFromMap;teleFromMap=function(k){
  if(k==='neverending'){
    if(!teleOn()){G.wnote={text:'Stand on a woken teleporter to travel.',t:G.time};return}
    const w=ntWoken();if(!w.length)return;
    if(w.length===1&&ntIs(LEVEL)&&w[0]===ntFloorOf(LEVEL)){G.wnote={text:'You are already here.',t:G.time};return}
    G.overview=false;G.world=false;G.teleMode=false;
    G.talk={d:{k:'teleporter'},n:{name:'Teleporter'},node:ntTeleNode(w[w.length-1],0),t:G.time,btns:[]};G.hold=null;G.queued=null;return}
  return _tf.apply(this,arguments)}}
/* ---------- Go to area, and the jump to the tower ---------- */
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);
  try{if(!out.some(r=>r.n===NT.BASE)){out.push({h:'The Never-Ending Tower, north of the Pale Spire'});
    out.push({n:NT.BASE,name:ntUnlocked()||NT.DEBUG?'The Crooked Tower':'The Crooked Tower (sealed)'});
    if(ntUnlocked()||NT.DEBUG){LEVEL_RATING[ntIdOf(1)]=ntRatingOf(1);out.push({n:ntIdOf(1),name:'Floor 1'});const d=ntF().deepest;if(d>1){LEVEL_RATING[ntIdOf(d)]=ntRatingOf(d);out.push({n:ntIdOf(d),name:'Floor '+d+', the deepest reached'})}}}}catch(e){console.error(e)}
  return out}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(ntIs(n)){
    if(!ntUnlocked()&&!NT.DEBUG){try{sfx('locked');msg('The Crooked Tower is sealed with pale silver.','#d8e4ff')}catch(e){}return}
    target=Math.min(NTM.JUMP_CAP,Math.max(target||0,ntFloorOf(n)>0?ntRatingOf(ntFloorOf(n)):99))}
  return _j.call(this,n,target)}}
/* called from jumpFromUrl (index.html): the party's level for ?town=neverending[&floor=N] (floor N: level 99 + N, but never above JUMP_CAP) */
function ntJumpLevel(town,q){
  if(town!=='neverending')return 0;
  const f=Math.max(0,parseInt(q.get('floor')||'0',10)||0),lvl=parseInt(q.get('lvl')||'0',10);
  return Math.min(NTM.JUMP_CAP,lvl>0?lvl:f>0?99+f:99)}
function ntAreas(AREAS){
  const q=new URLSearchParams(location.search);
  Object.defineProperty(AREAS,'neverending',{enumerable:true,configurable:true,get(){
    const f=Math.max(0,parseInt(q.get('floor')||'0',10)||0);
    const F=ntF();F.debug=1;   // a jump link bypasses the seal
    if(f>0){const {plan}=ntPlan(f);return [ntIdOf(f),plan.down.ix,plan.down.iy,plan.down.f]}
    return [NT.BASE,18,24,0]}})}
/* ---------- the parchment map of a floor ---------- */
if(typeof mplInstall==='function'){
  const ntmDraw=(c,x,L,api)=>{
    const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s,INK=MPL.INK,V=L._nt||{},look=V.look,pal=look&&look.pal;
    const wallC=pal?'rgb('+pal.wallTint.map(v=>Math.round(Math.min(255,v*90))).join(',')+')':'#5a5a68',floorC=pal?'rgb('+pal.floorTint.map(v=>Math.round(Math.min(255,v*185))).join(',')+')':'#c8c4d0';
    x.save();x.shadowColor='rgba(40,30,10,.5)';x.shadowBlur=14;x.shadowOffsetX=3;x.shadowOffsetY=5;x.fillStyle='#2a2430';x.fillRect(PX-1.6,PY-1.6,PW+3.2,PH+3.2);x.restore();
    x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();
    const SN=G.seen||[],seen=(i,j)=>!!(SN[j]&&SN[j][i]);   // only what the party has seen is drawn
    for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!seen(cx,cy))continue;x.fillStyle=R[cy][cx]==='.'?floorC:wallC;x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
    x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();
    for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(R[cy][cx]!=='.'||!seen(cx,cy))continue;const X0=X(cx),Y0=Y(cy),w=(i,j)=>!(R[j]&&R[j][i]==='.');
      if(w(cx,cy-1)){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(w(cx,cy+1)){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(w(cx-1,cy)){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}if(w(cx+1,cy)){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}}
    x.stroke();
    if(V.plan){const d=V.plan.down,u=V.plan.up,st=V.plan.stone;
      if(seen(u.x,u.y)){x.fillStyle='#d8b050';x.fillRect(X(u.x)+s*.1,Y(u.y)+s*.1,s*.8,s*.8)}if(seen(d.x,d.y)){x.fillStyle='#8aa0d8';x.fillRect(X(d.x)+s*.1,Y(d.y)+s*.1,s*.8,s*.8)}
      if(seen(st.x,st.y)){x.fillStyle='#8ad0f0';x.beginPath();x.arc(X(st.x+.5),Y(st.y+.5),Math.max(1.2,s*.4),0,6.3);x.fill()}}
    x.restore();
    api.title(x,L.name||'The Never-Ending Tower','',12,5);api.compass(x,50,262,15);
    {const a=6,b=46,w=92,h=22;api.panel(x,a,b,w,h);api.text(x,'Rating '+(L.diff||100),a+w/2,b+8,5.6,'#4a2a6a');api.text(x,'Gold: up. Blue: down. Light disc: stone.',a+w/2,b+17,4.4,INK)}};
  mplInstall({get name(){let n=0;const S=G.seen;if(S)for(const r of S)for(let i=0;i<r.length;i+=3)if(r[i])n++;return 'nt'+n},levels:{includes:n=>ntIs(n)},draw:ntmDraw,tint:[3,2,6],foot:'You are the yellow arrow. Gold square: stairs up. Blue square: stairs down. Pale disc: the teleport stone.'})}
if(typeof mpmgiKind==='function'){const _k=mpmgiKind;mpmgiKind=function(lv){return ntIs(lv)?'dungeon':_k.apply(this,arguments)}}
