/* ==========================================================================
   WILD PLACES. Hidden caves and old overgrown ruins stand behind the trees of the outdoor lands. Every entrance is choked by dead trees (the game's burnable ones) that have to be burned with
   a torch or lantern before the door can be reached, and shows a small ? on the maps until the place has been visited.
   - Seven caves in the older forests (witches, bears, wolves, outcasts, a fugitive, treasure; three of them with quests).
   - One to four ruins in every outdoor map (one or two on each stretch of the Pilgrim's Path): old stone in different colours, overgrown with vines, with trees and
     flowers growing inside that the party can walk through. Most are empty and dark; some hold a little treasure; a few have been taken by slimes. All are rich in herbs.
   Interiors are built the first time they are entered, from the place's id alone, so nothing is stored in a save.
   ========================================================================== */
for(const n of ['pf_cavemouth','pf_ruindoor','pf_ruinwall'])loadImg(n,'assets/'+n+'.jpg');
for(const n of ['pt_birch','pt_willow','pf_witch','pf_exile'])loadImg(n,'assets/'+n+'.png');
Object.assign(NPC_H,{pt_birch:2.7,pt_willow:2.5,pf_witch:1.3,pf_exile:1.25});
ENEMY_DEF.bear=Object.assign({},ENEMY_DEF.wolf,{name:'Brown Bear',hp:64,dmg:[7,13],hit:.78,w:1.15,img:'bear',xp:85,speed:1,kind:'bear'});
ENEMY_DEF.slime=Object.assign({},ENEMY_DEF.wolf,{name:'Green Slime',hp:30,dmg:[2,5],hit:.62,w:.85,img:'slime',xp:30,speed:1,kind:'slime'});
const WD_OUT=[2,7,10,19,22,32,41,60,61,62,63,64,311]; // the outdoor maps outside the Pilgrim's Path that hide places (the Path's own levels are LP.BASE to LP.BASE+LP.N-1)
const WD_TINTS=[[255,255,255],[200,228,200],[240,214,170],[226,190,192],[190,206,236],[236,226,200]];
const WD_RUIN_NAMES=['The Overgrown Ruin','The Mossy Vault','The Vine-Choked Cellar','The Forgotten Shrine','The Sunken Hall','The Old Watchpost','The Tangled Crypt','The Green Hall','The Fallen Gatehouse','The Ivy Chapel'];
const WD_CAVES=[ // [level, kind, name]  ids 7200 and up
 [2,'witch','The Witch’s Hollow'],[7,'bears','The Bear Den'],[10,'fugitive','The Hunted Man’s Hole'],[19,'wolvestreasure','The Moor Wolves’ Cave'],[22,'exile','The Exile’s Cave'],[32,'treasure','The Greendale Hoard'],[311,'bears','The Oakwood Bear Cave']];
const WD_CAVE0=7200,WD_RUIN0=8000;
WD_CAVES.forEach((c,i)=>LEVEL_NAMES[WD_CAVE0+i]=c[2]);
const WD_ENT={}; // interior id -> {n,x,y,f}: where its door stands in the outdoor map
const wdRuinId=(n,k)=>WD_RUIN0+n*8+k;
/* the levels where a door tile can be walked into: every cave and ruin, and every outdoor map that has an entrance to one */
function wdDoorLevel(n){return n>=7100||WD_OUT.includes(n)}
const wdIsLP=n=>typeof LP!=='undefined'&&n>=LP.BASE&&n<LP.BASE+LP.N;
const wdCount=n=>{const r=hash2(n,3,4401);return wdIsLP(n)?1+(r>.6?1:0):1+Math.floor(r*4)};
/* ---------- styles and tiles ---------- */
function wdStyle(kind,tint,dark){
  const key='wd_'+kind+'_'+tint.join('_')+(dark?'d':'');
  if(!OH_STY[key]){const c=kind==='cave',f=dark?.78:1;
    OH_STY[key]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:c?'pf_rock':'pf_ruinwall',door:c?'pf_cavemouth':'pf_ruindoor',win:c?'pf_rock':'pf_ruinwall',alt:c?'pf_rock':'pf_ruinwall',zoom:1,contrast:1.15,tint:[tint[0]*f|0,tint[1]*f|0,tint[2]*f|0,0]})}
  return key}
function wdTiles(kind,wh,tint,dark){const TM=ohTiles(),k=wdStyle(kind,tint,dark);return {wall:TM.make('plain',k,wh).gid,door:TM.make('door',k,wh)}}
/* ---------- placing an entrance ---------- */
function wdSetRow(L,x,y,c){const r=L.rows[y];if(r&&x>=0&&x<r.length)L.rows[y]=r.slice(0,x)+c+r.slice(x+1)}
const wdTreeKey=d=>/^([glp]?tree\d|pt_)/.test(d.k)&&!d.npc;
function wdSpot(L,n,seed){
  const W=L.rows[0].length,H=L.rows.length,st=L.start||{x:0,y:0},lp=wdIsLP(n);
  const trees=new Map(),other=[];
  for(const d of L.decor){if(wdTreeKey(d))trees.set(d.x+','+d.y,1);else if(!d.pfCut&&(d.npc||d.loot||d.shop||d.enter||d.k==='lever'))other.push(d)} // anything else (rocks, stumps, flowers, bushes) is cleared away
  const near=(x,y,r)=>{for(const o of other)if(Math.abs(o.x-x)<=r&&Math.abs(o.y-y)<=r)return true;for(const e of (L.enemies||[]))if(Math.abs(e.x-x)<=r&&Math.abs(e.y-y)<=r)return true;for(const i of (L.items||[]))if(Math.abs(i.x-x)<=r&&Math.abs(i.y-y)<=r)return true;return false};
  const x0=lp?80:4,x1=lp?W-14:W-5,y0=lp?150:4,y1=lp?H-150:H-8;
  let best=null,bs=-1;
  for(let t=0;t<700;t++){
    const x=x0+((hash2(t,seed,4410)*(x1-x0))|0),y=y0+((hash2(t,seed,4411)*(y1-y0))|0);
    if(!lp&&Math.abs(x-st.x)+Math.abs(y-st.y)<24)continue;
    if(lp&&Math.abs(y-st.y)<50)continue;
    let ok=true;
    for(let dy=0;dy<=3&&ok;dy++)for(let dx=-2;dx<=2;dx++){const c=(L.rows[y+dy]||'')[x+dx];if(c!=='.'){ok=false;break}}
    if(!ok||near(x,y+1,3)||(L._wd||[]).some(q=>Math.abs(q.x-x)<8&&Math.abs(q.y-y)<8))continue;
    for(const [dx,dy] of [[-3,1],[3,1],[-2,4],[2,4]]){const c=(L.rows[y+dy]||'')[x+dx];if(c&&c!=='.'&&/[0-9]/.test(c))ok=false}
    if(!ok)continue;
    let tc=0;for(let dy=-4;dy<=5;dy++)for(let dx=-4;dx<=4;dx++)if(trees.has((x+dx)+','+(y+dy)))tc++;
    const sc=tc+hash2(t,seed,4412)*4; // behind trees where there are trees
    if(sc>bs){bs=sc;best=[x,y]}}
  return best}
function wdPlace(L,n,id,kind,tint,seed){
  const sp=wdSpot(L,n,seed);if(!sp)return false;const [x,y]=sp;
  L.chars=L.chars||{};
  const wh=L.ceilH||5,T=wdTiles(kind,Math.min(wh,3.4),tint,false),rc=String.fromCharCode(0x3a0+(id%64)),dc=String.fromCharCode(0x3e0+(id%64));
  L.chars[rc]=T.wall;
  const dgid=KH_NEXT_GID++;T_TILE[dgid]=T.door.tex;KH_DOOR[dgid]={lvl:id,at:kind==='cave'?{x:8,y:12,f:0}:{x:13,y:18,f:0}};L.chars[dc]=dgid; // where the party stands just inside: the cave's start, or the ruin's
  for(let dy=0;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)wdSetRow(L,x+dx,y+dy,(dy===2&&dx===0)?dc:rc);
  // the trees round the little building are made invisible, and a dry thicket grows across the door
  for(const d of L.decor)if(!d.npc&&!d.loot&&!d.shop&&!d.enter&&d.x>=x-3&&d.x<=x+3&&d.y>=y-1&&d.y<=y+4&&!(d.x===x&&d.y===y+3)){d.block=false;d.sc=.0001;d.pfCut=1}
  wdThicket(L,n,x,y+3,id);
  (L._wd=L._wd||[]).push({x,y,id});
  WD_ENT[id]={n,x,y:y+3,f:2};
  return true}
function wdThicket(L,n,x,y,id){ // dead twisted trees grow across the way: the game's own burnable trees (tap one, burn it with a torch or a lantern, and it is ash you can walk over)
  for(const d of L.decor)if(wdTreeKey(d)&&d.x===x&&d.y===y){d.block=false;d.sc=.0001;d.pfCut=1}
  const k=['gtree0','gtree3','gtree6','gtree4'];
  L.decor.push({k:k[(hash2(x,y,760)*4)|0],x,y,block:true,sc:1.05,ox:-.18,oy:0},{k:k[(hash2(x,y,761)*4)|0],x,y,block:true,sc:.95,ox:.2,oy:.06});
  (L._wdMarks=L._wdMarks||[]).push({x,y,id})}
/* ---------- a ? on the map for every place not yet visited, as soon as the party looks towards it ---------- */
const wdRevealed=()=>{const F=G.flags;return F.wdSeen||(F.wdSeen={})};
/* sharp eyes: a Ranger in the party, a Scout, and the herb trades (Healer, Alchemist) all spot hidden places from further away, and over a wider angle */
function wdSharp(){
  let range=15,cone=.62;
  try{
    if(G.heroes.some((h,i)=>h.alive&&HERO_DEF[i].cls==='Ranger')){range+=10;cone=.4}
    const sc=typeof profPerk==='function'?profPerk('scout'):0,hb=Math.max(typeof profPerk==='function'?profPerk('healer'):0,typeof profPerk==='function'?profPerk('alchemist'):0);
    if(sc){range+=2*sc;cone-=.04*sc}
    if(hb){range+=1.5*hb;cone-=.02*hb}
  }catch(e){}
  return {range:Math.min(range,34),cone:Math.max(.15,cone)}}
{const _u=ui;ui=function(dt){try{if(G.state==='play'&&!G.cut){const L=LEVELS[LEVEL];if(L&&L._wdMarks){const R=wdRevealed(),f=DIRS[G.P.f]||[0,-1],sk=wdSharp();
  for(const m of L._wdMarks){if(R[LEVEL+':'+m.id])continue;const dx=m.x-G.P.x,dy=m.y-G.P.y,dd=Math.hypot(dx,dy);if(dd>sk.range||dd<.5)continue;if((dx*f[0]+dy*f[1])/dd>=sk.cone)R[LEVEL+':'+m.id]=1}}}}catch(e){}return _u.apply(this,arguments)}}
{const _dq=drawQuestMarks;drawQuestMarks=function(ox,oy,cs,big,rad){_dq.apply(this,arguments);
  try{const L=LEVELS[LEVEL];if(!L||!L._wdMarks)return;const seen=(G.flags&&G.flags.lvSeen)||{};
    const R=wdRevealed();for(const m of L._wdMarks){if(seen[m.id]||!R[LEVEL+':'+m.id])continue;if(rad&&(Math.abs(m.x-G.C.x)>rad||Math.abs(m.y-G.C.y)>rad))continue;
      const cx=ox+(m.x+.5)*cs,cy=oy+(m.y+.5)*cs;ctx.save();ctx.strokeStyle='#c8c0a8';ctx.fillStyle='rgba(40,34,24,.85)';ctx.lineWidth=big?1.4:1;ctx.beginPath();ctx.arc(cx,cy,cs*.8,0,TAU);ctx.fill();ctx.stroke();
      txt('?',cx,cy+.5,big?Math.max(8,cs*.95):Math.max(5,cs*.9),'#e8e0c0','center',true);ctx.restore()}}catch(e){}}}
/* ---------- the people of the caves ---------- */
khNpc('pf_witch','The Cave Witch','pf_witch',()=>qNode('pf4',khQD('Well, well. A visitor through my thicket, and with a torch, no less. I am not a bad witch. I am a busy one. My cauldron is empty, and the herbs in the woods are not picking themselves. Bring me four herbs and I will not turn you into anything.','Four herbs. Any four. Do not bring me dandelions.',(g,n)=>`${g} of ${n} herbs.`,'Four herbs! They will do. They will do nicely.','Four herbs, picked well enough.','The cauldron is bubbling. Go on, shoo.','Here are four herbs.'),{q:'pf4'}),{q:'pf4',sc:1});
monq('pf4','Herbs for the Cave Witch','The Cave Witch','The witch of the hollow wants four herbs from the woods for her cauldron.',4,()=>Math.min(4,bagCount('herb')),{gold:400,xp:4000},{take:{herb:4}});QAREA.pf4='The Pilgrim’s Path';
khNpc('pf_exile','An exiled noble','pf_exile',()=>qNode('pf5',khQD('You find me at a low ebb, friends. I was a baron, once. A lord who did not like my vote, a false letter, and a road out of the country. I have eaten roots for a month. A hot pie would be the finest thing in the world. A single pie.','One pie. I will never forget it. A baron’s word, and I have little else.',(g,n)=>`${g} of ${n} pies.`,'A pie! Real pastry! I will weep, and then I will eat.','One pie, and a baron’s thanks.','I ate it very slowly. It was perfect.','Here is a pie.')),{q:'pf5'});
monq('pf5','A Pie for the Exile','An exiled noble','A baron in exile lives in a cave beyond the Greyfang Pass. He would love one hot pie.',1,()=>Math.min(1,bagCount('pie')),{gold:500,xp:5000},{take:{pie:1}});QAREA.pf5='The Pilgrim’s Path';
khNpc('pf_hunted','A hunted man','kh_ohfolk2_3',()=>qNode('pf6',khQD('Do not shout. Please. There are three of them, with dogs, and they are two days behind me. I have a purse and a bad knee. If you could spare a healing potion, I would give you every coin I have, and a warning about the road.','One potion. Bless you.',(g,n)=>`${g} of ${n} potions.`,'A potion! My knee thanks you. Here, take the purse.','One potion, one grateful man.','I will move on at dusk. Tell no one.','Here is a potion.')),{q:'pf6'});
monq('pf6','A Potion for the Hunted Man','A hunted man','A man hides in a hole by the Ironhill Road. He needs a healing potion for his knee.',1,()=>Math.min(1,bagCount('potion')),{gold:450,xp:4500},{take:{potion:1}});QAREA.pf6='The Pilgrim’s Path';
/* ---------- the interiors ---------- */
function wdParent(id){ // the outdoor map and kind of an interior id
  if(id>=WD_CAVE0&&id<WD_CAVE0+WD_CAVES.length){const c=WD_CAVES[id-WD_CAVE0];return {n:c[0],cave:c}}
  const v=id-WD_RUIN0,n=Math.floor(v/8),k=v%8;return {n,k}}
function wdRun(rows,W,H,sd,cells,pick,kind){return null}
function wdCaveRows(sd,W,H){
  const g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));let x=8,y=H-3;const cells=[];
  const carve=(a,b)=>{if(a>=2&&b>=2&&a<=W-3&&b<=H-3&&g[b][a]==='#'){g[b][a]='.';cells.push([a,b])}};carve(x,y);
  for(let i=0;i<190;i++){const r=hash2(sd,i,701);if(r<.45)y--;else if(r<.6)y++;else if(r<.8)x--;else x++;x=Math.max(2,Math.min(W-3,x));y=Math.max(2,Math.min(H-3,y));carve(x,y);if(hash2(sd,i,702)<.1){carve(x+1,y);carve(x,y+1);carve(x+1,y+1)}}
  return {g,cells}}
function wdRuinRows(sd,W,H){
  const g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));const rooms=[],cells=[];
  const cut=r=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)if(g[y][x]==='#'){g[y][x]='.';cells.push([x,y])}};
  rooms.push({x0:(W>>1)-3,y0:H-6,x1:(W>>1)+3,y1:H-3});
  for(let t=0;t<600&&rooms.length<5;t++){const w=4+((hash2(sd,t,720)*4)|0),h=3+((hash2(sd,t,721)*3)|0),x0=1+((hash2(sd,t,722)*(W-w-2))|0),y0=1+((hash2(sd,t,723)*(H-h-8))|0);
    if(rooms.some(r=>x0<=r.x1+2&&x0+w-1>=r.x0-2&&y0<=r.y1+2&&y0+h-1>=r.y0-2))continue;rooms.push({x0,y0,x1:x0+w-1,y1:y0+h-1})}
  rooms.forEach(cut);const mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  for(let i=1;i<rooms.length;i++){let bj=0,bd=1e9;const [ax,ay]=mid(rooms[i]);for(let j=0;j<i;j++){const [bx,by]=mid(rooms[j]),d=Math.abs(ax-bx)+Math.abs(ay-by);if(d<bd){bd=d;bj=j}}
    const [bx,by]=mid(rooms[bj]),hl=(y,x0,x1)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)if(g[y][x]==='#'){g[y][x]='.';cells.push([x,y])}},vl=(x,y0,y1)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)if(g[y][x]==='#'){g[y][x]='.';cells.push([x,y])}};
    if(hash2(sd,i,724)<.5){hl(ay,ax,bx);vl(bx,ay,by)}else{vl(ax,ay,by);hl(by,ax,bx)}}
  return {g,cells,rooms}}
function wdBuild(id){
  const P=wdParent(id),cave=!!P.cave,W=cave?17:27,H=cave?15:21,sd=id*13+7;
  const parentL=LEVELS[P.n]||(KH_LAZY[P.n]&&(KH_LAZY[P.n](),LEVELS[P.n]));
  if(!WD_ENT[id]){try{wdPrep(P.n)}catch(e){console.error(e)}}
  const ent=WD_ENT[id]||{n:P.n,x:(parentL&&parentL.start&&parentL.start.x)||2,y:(parentL&&parentL.start&&parentL.start.y)||2,f:2};
  const diff=(parentL&&parentL.diff)||(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[P.n])||20;
  const tint=cave?[255,255,255]:WD_TINTS[(hash2(id,5,730)*WD_TINTS.length)|0];
  const R=cave?wdCaveRows(sd,W,H):wdRuinRows(sd,W,H),g=R.g,cells=R.cells;
  const door=String.fromCharCode(0x2f0);let sx,sy;
  if(cave){sx=8;sy=H-3}else{sx=W>>1;sy=H-3}
  g[sy+1][sx]=door;g[sy][sx]='.';
  const d=new Int16Array(W*H).fill(-1),q=[sx+sy*W];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],cx=c%W,cy=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}
  const open=cells.filter(([a,b])=>d[b*W+a]>2).sort((a,b)=>d[b[1]*W+b[0]]-d[a[1]*W+a[0]]);
  const used=new Set([sx+','+sy]),pick=i=>{for(let t=0;t<open.length;t++){const c=open[(i*7+t*3)%open.length];if(!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);return c}}return null};
  const far=open[0]||[sx,sy-2],decor=[],enemies=[],items=[];used.add(far[0]+','+far[1]);
  let kind,name;
  if(cave){kind=P.cave[1];name=P.cave[2]}
  else{const r=hash2(id,9,731);kind=r<.72?'empty':r<.9?'treasure':'slime';name=WD_RUIN_NAMES[(hash2(id,8,732)*WD_RUIN_NAMES.length)|0]}
  const gold=120+Math.round(diff*5);
  if(cave){
    decor.push(...[1].map(()=>{const b=pick(1)||[sx,sy-1];return {k:'bones',x:b[0],y:b[1],block:false}}));
    if(kind==='treasure'||kind==='bears'||kind==='wolvestreasure'){decor.push({k:'chest',x:far[0],y:far[1],block:true,goldAmt:gold+80});const c=pick(2);if(c)items.push({k:'potion',x:c[0],y:c[1]})}
    if(kind==='bears'){for(let i=0;i<2;i++){const c=pick(20+i);if(c)enemies.push({t:'bear',x:c[0],y:c[1]})}}
    if(kind==='wolvestreasure'){for(let i=0;i<3;i++){const c=pick(30+i);if(c)enemies.push({t:'wolf',x:c[0],y:c[1]})}}
    const person=(npc,pic)=>{const kp=KH_KEEPERS[npc];if(kp)decor.push({k:khFaceKey(kp.face),x:far[0],y:far[1],block:false,walk:true,npc,sc:1})};
    if(kind==='witch'){person('pf_witch');const c=pick(3);if(c)decor.push({k:'barrel',x:c[0],y:c[1],block:true})}
    if(kind==='exile'){person('pf_exile');const c=pick(3);if(c)decor.push({k:'barrel',x:c[0],y:c[1],block:true})}
    if(kind==='fugitive'){person('pf_hunted');const c=pick(3);if(c)decor.push({k:'barrel',x:c[0],y:c[1],block:true})}
  }else{
    // overgrown: trees, bushes and flowers growing in the halls, all of them passable; and herbs everywhere
    cells.forEach(([a,b],i)=>{if(used.has(a+','+b)||(a===sx&&b>=sy-1))return;const r=hash2(a,b,740+id%9);
      if(r<.09)decor.push({k:r<.045?'pt_birch':'pt_willow',x:a,y:b,block:false,walk:true,sc:.62+hash2(a,b,745)*.3});
      else if(r<.2)decor.push({k:'lflora0'+(r<.14?'':r<.17?'_1':'_2'),x:a,y:b,block:false,walk:true,deco:true,sc:.9});
      else if(r<.24)decor.push({k:'lbush0',x:a,y:b,block:false,walk:true,sc:.8})});
    const nh=6+((hash2(id,3,741)*5)|0);for(let i=0;i<nh;i++){const c=pick(60+i);if(!c)break;const h=HERBS[(hash2(id,i,742)*HERBS.length)|0];items.push({k:'herb_'+h[0],x:c[0],y:c[1]})}
    if(kind==='treasure'){decor.push({k:'chest',x:far[0],y:far[1],block:true,goldAmt:gold});const c=pick(80);if(c)items.push({k:'potion',x:c[0],y:c[1]})}
    if(kind==='slime'){for(let i=0;i<4;i++){const c=pick(90+i);if(c)enemies.push({t:'slime',x:c[0],y:c[1]})}}
  }
  const T=wdTiles(cave?'cave':'ruin',cave?2.6:2.8,tint,true),dgid=KH_NEXT_GID++;T_TILE[dgid]=T.door.tex;KH_DOOR[dgid]={lvl:ent.n,at:{x:ent.x,y:ent.y,f:ent.f}};
  const chars={'#':T.wall};chars[door]=dgid;
  if(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[P.n])LEVEL_RATING[id]=LEVEL_RATING[P.n];
  LEVEL_NAMES[id]=name;
  return {rows:g.map(r=>r.join('')),start:{x:sx,y:sy,f:0},enemies,items,decor,chars,day:0,name,label:name,diff,ceilH:cave?2.6:2.9,torchGap:1e9,noTele:true,portals:[],lights:[],mapNames:[{t:name,x:sx,y:H-1,k:'place'}]}}
/* every place gets a lazy builder */
for(let i=0;i<WD_CAVES.length;i++)KH_LAZY[WD_CAVE0+i]=((id)=>()=>{if(!LEVELS[id])LEVELS[id]=wdBuild(id)})(WD_CAVE0+i);
for(const n of [...WD_OUT,...Array.from({length:24},(_,i)=>400+i)])for(let k=0;k<4;k++){const id=wdRuinId(n,k);KH_LAZY[id]=((i)=>()=>{if(!LEVELS[i])LEVELS[i]=wdBuild(i)})(id)}
/* ---------- carving the outdoor maps ---------- */
function wdPrep(n){
  const L=LEVELS[n];if(!L||L._wdDone||!L.rows||!L.decor)return;L._wdDone=1;
  if(typeof pfPrep==='function'&&wdIsLP(n))try{pfPrep(n)}catch(e){}
  const caves=WD_CAVES.map((c,i)=>[c,i]).filter(([c])=>c[0]===n);
  for(const [c,i] of caves)wdPlace(L,n,WD_CAVE0+i,'cave',[255,255,255],WD_CAVE0+i);
  const cnt=(WD_OUT.includes(n)||wdIsLP(n))?wdCount(n):0;
  for(let k=0;k<cnt;k++){const id=wdRuinId(n,k),tint=WD_TINTS[(hash2(id,5,730)*WD_TINTS.length)|0];wdPlace(L,n,id,'ruin',tint,id)}
  // soft trees that grow only along the sides of the path: the party can walk right through them
  if(wdIsLP(n)||WD_OUT.includes(n)){let c=0;const trees=L.decor.filter(d=>d.block&&/^[lp]tree\d/.test(d.k)&&!d.pfCut);const occupied=new Set(L.decor.map(d=>d.x+','+d.y));
    for(const d of trees){if(c>=180)break;const x=d.x-1,y=d.y;if(hash2(d.x,d.y,750)>.035)continue;if(L.rows[y]&&L.rows[y][x]==='.'&&!occupied.has(x+','+y)&&L.rows[y][x-1]==='.'){occupied.add(x+','+y);L.decor.push({k:hash2(d.x,d.y,751)<.5?'pt_birch':'pt_willow',x,y,block:false,walk:true,sc:.75+hash2(d.x,d.y,752)*.35});c++}}}
}
{const _ll=loadLevel;loadLevel=function(n){try{if(wdIsLP(n)&&!LEVELS[n]&&KH_LAZY[n])KH_LAZY[n]();wdPrep(n)}catch(x){console.error(x)}return _ll.apply(this,arguments)}}
{const _g=goToLevel;goToLevel=function(n,e){try{if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]()}catch(x){console.error(x)}return _g.apply(this,arguments)}}
/* ---------- the word in town: a woodsman in Thornwick and a scout in Ironhill talk about the hidden places ---------- */
const WD_TALK=[
 "Walk the woods slowly, and keep an eye on the dead trees. Where a few of them stand twisted across nothing at all, there is usually a reason. Burn them down with a torch or a lantern and you may find a door.",
 "Behind some of those thickets there are caves. Wolves, bears, sometimes a poor soul who has been driven out of a village and has nowhere else to go. A few of them have a little treasure, and a few have a quest, if you are kind.",
 "And the old ruins, grown over with vines. Most are empty, and dark as the inside of a boot. Some have a chest. Some have been taken by slimes, so do not go in with an empty health bar. But the herbs! The herbs in those halls are the best I have ever seen.",
 "Once you have seen a spot, a little question mark turns up on your map. It means a place is there, and could be anything. It goes away once you have been inside."];
function wdTalkNode(i){return say(WD_TALK[i],[i<WD_TALK.length-1?['Go on.',()=>wdTalkNode(i+1)]:['Thank you. We will look.',()=>null],BYE])}
NPCS.tw_woodsman={name:'A woodsman',img:'peasantM',root:()=>wdTalkNode(0)};NPCS_BY['A woodsman']=NPCS.tw_woodsman;
NPCS.ih_scout={name:'A scout of the Ironhill watch',img:'huntress',root:()=>wdTalkNode(0)};NPCS_BY['A scout of the Ironhill watch']=NPCS.ih_scout;
for(const [lv,npc,img] of [[3,'tw_woodsman','peasantM'],[13,'ih_scout','huntress']]){
  const L=LEVELS[lv];if(!L||!L.rows||L._wdNpc)continue;L._wdNpc=1;
  const taken=new Set((L.decor||[]).filter(d=>d.block||d.npc||d.enter).map(d=>d.x+','+d.y)),st=L.start||{x:2,y:2};
  const near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const c=(L.rows[y+dy]||'')[x+dx];if(c&&c!=='.')return true}return false};
  let best=null,bd=1e9;for(let y=1;y<L.rows.length-1;y++)for(let x=1;x<L.rows[0].length-1;x++){if(L.rows[y][x]!=='.'||taken.has(x+','+y)||near(x,y))continue;const d=Math.abs(x-(st.x+6))+Math.abs(y-st.y);if(d<bd&&d>=3){bd=d;best=[x,y]}}
  if(best)L.decor.push({k:img,x:best[0],y:best[1],block:true,npc});
}

/* the world map opens centred on the party: along the Pilgrim's Path (by how far along it they stand, even from inside a cave or ruin), or on the place a cave or ruin belongs to */
function wvCentre(){
  try{
    let n=LEVEL,row=G.P.y;
    if(n>=7100){
      if(n<7120){const ci=n-7100;n=LP.BASE+PF_SEGS[ci];row=(PF_ENT[ci]||{}).y||400}
      else{const P=wdParent(n),e=WD_ENT[LEVEL];n=P.n;if(e)row=e.y}}
    if(wdIsLP(n)){const f=lpGY(n-LP.BASE,row)/LP_TOT,Q=k=>WORLD_LOCS.find(q=>q.k===k),O=Q('oldhaven'),C=Q('landpath'),Y=Q('yarrim');if(O&&C&&Y){const a=(1-f)*(1-f),b=2*f*(1-f),c=f*f;return [a*O.x+b*C.x+c*Y.x,a*O.y+b*C.y+c*Y.y]}return C?[C.x,C.y]:null} // how far along the path the party stands, on a curve from Oldhaven through the Path's mark to Yarrim
    if(LEVEL>=7100){const l=WORLD_LOCS.find(q=>q.lv.includes(n));return l?[l.x,l.y]:null}
  }catch(e){}
  return null}
