/* ==========================================================================
   THE PALE SPIRE: THE DUNGEONS (package 5; prefix psd / PSD). Three floors under the kitchens of the Pale Spire:
   9780 The Undercroft Gaols (102): the Gaoler's Hall, Cell Block A (ten cells), the Question Room (the Questioner), the stair down.
   9790 The Deep Cells and the Cistern (103): Cell Block B (half flooded), the Cistern with three valve wheels and the Drowned Gaoler, the stair down.
   9800 The Oubliette (104): the round pit, cells round it, the Hunger in the Hole. No stairs down.
   Nine prisoners, nine quests (psq30 to psq38, area "The Pale Spire"). Every cell has its door as a picture (an iron gate) that opens when the party talks to the prisoner (no key needed).
   This file has its own floor maker psdMake (built on the same pieces as vtMake of the Vault: gyTile, gyFloorTone, torches), because the dungeons need water floors, cell doors and a round chamber.
   Flags: G.flags.psp.d = {cell:{key:1}, stone:{n:1}, wheel:[order so far], wheelsDone, gaoler:0|1|2, ghp, pots, framePainted, namesSpoken, ...}. Notes: tools/PALE_SPIRE_NOTES.md (section "Package 5").
   Look (owner's references 9 and 14): cold wet cobbles, roots and ivy pushing through the cell windows, mossy benches, arched bastion tunnels. Warm candlelight only in the cells of friendly prisoners.
   ========================================================================== */
const PSD={ids:[9780,9790,9800],SPEC:{},cells:{},WH:1.5,S:.8,ready:false,loading:null};
const psdIs=n=>n===9780||n===9790||n===9800;
const psdF=()=>{const F=pspF();return F.d||(F.d={cell:{},stone:{},wheel:[],gaoler:0,pots:0})};
const PSD_WARM=[1.5,1.05,.55];
/* ---------- creatures (the pictures are pspPic stand-ins until painted: ps_c_<id>) ---------- */
Object.assign(ENEMY_DEF,{
  psturnkey:{name:'Pale Turnkey',hp:74,dmg:[7,12],hit:.86,w:.72,ph:1.9,img:'ps_c_psturnkey',xp:30,gold:[0,0],speed:1,verb:'clubs',gy:1},
  psflayed:{name:'Flayed Prisoner',hp:56,dmg:[6,11],hit:.86,w:.6,ph:1.7,img:'ps_c_psflayed',xp:28,gold:[0,0],speed:2,verb:'claws',gy:1,glow:.12},
  psshackle:{name:'Shackled Dead',hp:84,dmg:[7,12],hit:.85,w:.7,ph:1.8,img:'ps_c_psshackle',xp:30,gold:[0,0],speed:1,verb:'pulls at',gy:1,still:1,wake:'The skeleton in the chains lifts its head. The links pull tight, and then the staple comes out of the wall.'},
  psleech:{name:'Cistern Leech',hp:66,dmg:[6,11],hit:.86,w:.9,ph:1.0,img:'ps_c_psleech',xp:30,gold:[0,0],speed:1,verb:'fastens on',gy:1},
  psdrowned:{name:'Drowned Prisoner',hp:76,dmg:[7,11],hit:.85,w:.62,ph:1.7,img:'ps_c_psdrowned',xp:32,gold:[0,0],speed:1,verb:'drags at',gy:1},
  pscellghost:{name:'Cell Ghost',hp:50,dmg:[6,10],hit:.87,w:.6,ph:1.6,img:'ps_c_pscellghost',xp:28,gold:[0,0],speed:1,fly:true,floatH:.1,verb:'chills',gy:1,glow:.5},
  psbonecrawl:{name:'Bone Crawler',hp:68,dmg:[7,12],hit:.86,w:.9,ph:1.5,img:'ps_c_psbonecrawl',xp:32,gold:[0,0],speed:2,fly:true,floatH:.55,verb:'rakes',gy:1},
  psquestioner:{name:'The Questioner',hp:520,dmg:[9,15],hit:.9,w:.8,ph:2.1,img:'ps_c_psquestioner',xp:900,gold:[0,0],speed:1,verb:'burns',boss:true,gy:1,glow:.2,psdb:1},
  psdrowngaoler:{name:'The Drowned Gaoler',hp:660,dmg:[10,16],hit:.9,w:1.1,ph:2.6,img:'ps_c_psdrowngaoler',xp:1100,gold:[0,0],speed:1,verb:'crushes',boss:true,gy:1,glow:.15,psdb:2,noFlee:1},
  pshunger:{name:'The Hunger in the Hole',hp:800,dmg:[11,18],hit:.9,w:1.6,ph:3.4,img:'ps_c_pshunger',xp:1400,gold:[0,0],speed:1,verb:'devours',boss:true,gy:1,glow:.1,psdb:3,noFlee:1,still:1,wake:'The pale heap in the pit draws itself up. It has no face, only a mouth that opens along its whole front.'}});
for(const t of ['psquestioner','psdrowngaoler','pshunger']){if(typeof NO_VARY!=='undefined')NO_VARY.push(t);if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push(t)}
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.psquestioner=[5000,6200];BOSS_GOLD.psdrowngaoler=[5600,6800];BOSS_GOLD.pshunger=[7000,8400]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^psleech/,'bleeding',.22],[/^psdrowned/,'tomblung',.2],[/^psflayed/,'fever',.15],[/^pscellghost/,'haunted',.2],[/^psquestioner/,'bleeding',.25],[/^psdrowngaoler/,'shaken',.25],[/^pshunger/,'cursed',.25],[/^psbonecrawl/,'bleeding',.15]);
/* ---------- the floor maker ---------- */
function psdMake(info){
  const id=info.id;if(LEVELS[id])return LEVELS[id];
  const S=PSD.SPEC[id];if(!S)throw new Error('psd: no plan for '+id);
  try{gyAlias()}catch(e){}
  const W=info.W,H=info.H,WH=PSD.WH,hs=(a,b,c)=>hash2(a,b,c+id),g=[];
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  for(const r of S.rects)for(let y=r[1];y<=r[3];y++)for(let x=r[0];x<=r[2];x++)g[y][x]='.';
  if(S.carve)S.carve(g);
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chars[c]=gid;chMap.set(gid,c)}return c};
  const open=(x,y)=>!!(g[y]&&g[y][x]==='.'),near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const vt=v=>ch(gyTile(S.brick+'_'+v,WH,S.rgb||S.wall?{gain:1.05*(S.wall||1),rgb:S.rgb}:undefined));
  const VAR=(S.vars||[0,0,0,3,3,5,5,1,0,3,2,4]).map(vt),RIM=[4,5,1,4,2].map(vt);
  const rimCell=new Set();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]==='.')for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)if(g[y+b]&&g[y+b][x+a]==='#')rimCell.add((y+b)*W+x+a);
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    if(!near(x,y)){s+=VAR[0];continue}
    s+=rimCell.has(y*W+x)&&hs(x,y,3)<.45?RIM[(hs(x,y,4)*RIM.length)|0]:VAR[(hs(x,y,5)*VAR.length)|0]}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  const decor=[],enemies=[],items=[],lights=[],lcol={},occ=new Set(),keep=new Set(),miss=[],V={lcol,col:S.lcol,torch:S.torch,miss,id};
  let start=null;const doorSq=[];
  const inc=PSP.LINKS.find(l=>l.to===id&&l.from!==id);if(inc)start={x:inc.land[0],y:inc.land[1],f:inc.land[2]};
  for(const D of S.doors){
    const dx=D.x,dy=D.y;let gid;
    const inner=[[0,-1],[1,0],[0,1],[-1,0]].map(([a,b])=>[dx+a,dy+b]).find(([x,y])=>open(x,y));
    if(!inner)throw new Error('psd '+id+': door at '+dx+','+dy+' has no floor beside it');
    if(D.kind==='stair'){
      const lk=pspLinkAt(id,dx,dy);if(!lk)throw new Error('psd '+id+': no link at '+dx+','+dy);
      gid=gyTile(S.brick+'_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:1.1,rgb:S.rgb,tag:'psdstair'+id+'_'+dx});
      KH_DOOR[gid]={psd:'stair',lvl:lk.to,at:{x:lk.land[0],y:lk.land[1],f:lk.land[2]}}}
    else if(D.kind==='sealed'){
      gid=gyTile('texGrey_1',2.4,{fac:{img:'gatesC_0',i:0,n:1},gain:.95,tag:'psdsealed'+id});
      KH_DOOR[gid]={psd:'sealed',msg:D.msg}}
    put(dx,dy,ch(gid));doorSq.push([dx,dy,inner[0],inner[1]]);occ.add(inner[0]+','+inner[1]);
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)keep.add((inner[0]+a)+','+(inner[1]+b))}
  if(S.keepAt)for(const [kx,ky,r] of S.keepAt)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)keep.add((kx+a)+','+(ky+b));
  if(start)for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)keep.add((start.x+a)+','+(start.y+b));
  const free=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  const fm=[];for(let y=0;y<H;y++)fm.push(new Array(W).fill(S.floorDef||'0'));
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  const dec=(a,x,y,o)=>{o=o||{};const kk=GYA[a]?'gy_'+a:a;if(!open(x,y)){miss.push(a+'@'+x+','+y);return null}
    if(!o.force&&(occ.has(x+','+y)||(o.block&&keep.has(x+','+y)))){miss.push('taken '+a+'@'+x+','+y);return null}
    const d={k:kk,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}d.sc=(o.sc||1)*(o.raw?1:PSD.S);if(o.npc){d.npc=o.npc;d.deco=false;if(o.block)d.solid=1}
    if(o.wd)d.wd=o.wd;if(o.txt)d.txt=o.txt;if(o.goldAmt)d.goldAmt=o.goldAmt;if(o.ox!==undefined){d.ox=o.ox;d.oy=o.oy}decor.push(d);if(!o.over)occ.add(x+','+y);return d};
  const P=(name,x,y,o)=>dec(pspPic(name),x,y,o);          // a painted piece (or its stand-in) by its ps name
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd,txt:[a,b||''],sc:1})};
  const foe=(t,x,y,lvl)=>{if(!open(x,y)||occ.has(x+','+y)){miss.push('foe '+t+'@'+x+','+y);return false}enemies.push({t,x,y,lvl:lvl||info.lvl});occ.add(x+','+y);return true};
  const light=(x,y,col)=>{if(!open(x,y)){miss.push('light@'+x+','+y);return}lights.push([x,y]);if(col)lcol[x+','+y]=col};
  const C={id,S,W,H,g,rows,open,free,dec,P,sign,foe,light,setF,decor,enemies,lights,lcol,occ,keep,V,fm,info,rng:(a,b)=>hash2(a,b,id*3)};
  S.dress(C);
  /* ---- wall torches (violet or silver), candle niches, lamps ---- */
  const torches=[];
  {const blk=new Set();for(const d of decor)if(d.block)blk.add(d.x+','+d.y);const skip=doorSq.map(q=>[q[0],q[1]]),cand=[];
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(open(x,y)||rows[y][x]==='.'||skip.some(q=>Math.hypot(q[0]-x,q[1]-y)<2.2))continue;
     for(let f=0;f<4;f++){const nx=x+GYM_D[f][0],ny=y+GYM_D[f][1];if(!open(nx,ny)||blk.has(nx+','+ny))continue;
       const d4=GYM_D.filter(([a,b])=>open(nx+a,ny+b)).length,nar=(!open(nx-1,ny)&&!open(nx+1,ny))||(!open(nx,ny-1)&&!open(nx,ny+1));
       cand.push({x,y,f,nar,pri:d4>=3?1:d4===2?2:3,h:hs(x,y,f*7)})}}
   cand.sort((a,b)=>a.pri-b.pri||a.h-b.h);
   for(const c of cand){const gp=c.nar?3.6:3;if(torches.some(t=>Math.hypot(t[0]-c.x,t[1]-c.y)<gp))continue;torches.push([c.x,c.y,c.f,c.nar?1:0])}}
  V.torches=torches;
  {const tk=new Set(torches.map(t=>t[0]+','+t[1])),NIL=gyTile(S.brick+'_0',WH,{fac:{img:'cryptD_3',i:0,n:1},gain:.92*(S.wall||1),rgb:S.rgb,tag:'psdniche'+id,draw:(x,w,h)=>{
     const c=IMG.gyp_cryptD_2;x.globalCompositeOperation='lighter';const gr=x.createRadialGradient(64,h-62,2,64,h-62,46);gr.addColorStop(0,'rgba(190,150,255,.22)');gr.addColorStop(1,'rgba(150,110,255,0)');x.fillStyle=gr;x.fillRect(0,h-120,w,120);x.globalCompositeOperation='source-over';
     if(c)x.drawImage(c,0,0,c.width,c.height*.5,46,h-84,36,25)}}),cand=[];
   const nearDoor=(x,y)=>doorSq.some(q=>Math.hypot(q[0]-x,q[1]-y)<3.2);
   for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(open(x,y)||rows[y][x]==='.'||tk.has(x+','+y)||nearDoor(x,y))continue;
     const ns=GYM_D.filter(([a,b])=>open(x+a,y+b));if(ns.length!==1)continue;const [a,b]=ns[0],nx=x+a,ny=y+b;
     if(torches.some(t=>Math.hypot(t[0]-x,t[1]-y)<1.6)||occ.has(nx+','+ny))continue;cand.push({x,y,nx,ny,h:hs(x,y,95)})}
   cand.sort((p,q)=>p.h-q.h);const nic=[];
   for(const c of cand){if(nic.length>=(S.niches===undefined?10:S.niches))break;if(nic.some(n=>Math.hypot(n.x-c.x,n.y-c.y)<5))continue;nic.push(c);put(c.x,c.y,ch(NIL));light(c.nx,c.ny,[.85,.7,1.3])}}
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y))continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=(S.lampGap||5.4))){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=S.lcol}}}
  /* ---- floors: 0 dark flags, 1 lighter flags, 2 wet cobbles, 3 causeway flags, 4 straw, 5 shallow water, 6 deep water (blocked) ---- */
  const T=(out,src,gain,tint)=>{try{return gyFloorTone(out,src,gain,tint)}catch(e){return src}};
  const wat=(out,gain,tint)=>FLOORS.water?T(out,'water',gain,tint):T(out,'gyf_slate',gain*.6,[.55,.85,1.1]);
  const fb0=T('psf_'+id+'a',GY_FLOORSET[S.fl0===undefined?3:S.fl0],S.fgain||.5,S.ftint||[.9,.93,1]),fb1=T('psf_'+id+'b',GY_FLOORSET[S.fl1===undefined?5:S.fl1],S.fgain1||.68,S.ftint||[.9,.93,1]);
  const fSet=[fb0,fb1,gyFloorWet('psf_'+id+'w',fb0,S.lcol,id%97+3),T('psf_cflag','gyf_flag',.55,[.9,.93,1.06]),T('psf_straw','gyf_dirt',.95,[1.32,1.14,.7]),wat('psf_shallow',.85,[.72,.95,1.02]),wat('psf_deep',.42,[.5,.78,.95])];
  const fmS=fm.map(r=>r.join(''));
  const L={rows,chars,fmap:fmS,floorSet:fSet,floor:fb0,floor2:fb1,ceil:S.ceil||'gyc_crypt',ceilH:WH,start:start||{x:2,y:2,f:2},enemies,items,decor,lights,portals:[],day:0,amb:S.amb===undefined?.03:S.amb,torchGap:1e9,noTele:true,noExtras:true,
    name:info.name,label:info.name,diff:info.lvl,mapNames:S.names||[],_psd:V};
  V.start=start;LEVELS[id]=L;LEVEL_NAMES[id]=info.name;LEVEL_RATING[id]=info.lvl;
  {let deep=0;const blk=new Uint8Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(fm[y][x]==='6'&&open(x,y)){blk[y*W+x]=1;deep++}}
   if(deep){try{TERRS[id]=yarTerrain(W,H,new Float32Array(W*H).fill(.3),new Float32Array(W*H),blk)}catch(e){console.error('psd terrain',e)}V.deep=blk}}
  if(miss.length&&window.PSD_DEBUG)console.warn('psd '+id+' missed: '+miss.join(' '));
  V.missed=miss;
  return L}
/* the dungeons register themselves; package 6's glue wraps arrival (art loading) the same way, so loading here is a safety net for a jump straight in */
for(const id of PSD.ids)pspRegister(id,psdMake);
/* ---------- loading, lights, doors, deep water ---------- */
const psdReady=()=>PSD.ready||(typeof PSP!=='undefined'&&PSP.ready);   // the glue (ps_glue.js) loads the art first; this is only a safety net
function psdLoad(){
  if(PSD.loading)return PSD.loading;
  PSD.loading=Promise.all([typeof gyLoad==='function'?gyLoad():0,typeof khLoadAssets==='function'?khLoadAssets():0]).then(()=>{try{gyAlias();if(typeof pspPics==='function')pspPics()}catch(e){console.error('psdLoad',e)}PSD.ready=true}).catch(e=>{console.error('psdLoad',e);PSD.ready=true});
  return PSD.loading}
{const _g=goToLevel;goToLevel=function(n,entry){
  if(psdIs(n)&&!psdReady()&&!PSD._wait){PSD._wait=1;psdLoad().then(()=>{PSD._wait=0;goToLevel(n,entry)});return}
  if(psdIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error(e)}
  if(psdIs(n)&&typeof psdPrep==='function')try{psdPrep(n)}catch(e){console.error('psdPrep',e)}
  const r=_g.call(this,n,entry);
  try{if(psdIs(n)&&typeof psdArrive==='function')psdArrive(n)}catch(e){console.error('psdArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(psdIs(n)&&!psdReady()&&!PSD._wait){PSD._wait=1;psdLoad().then(()=>{PSD._wait=0;jumpToLevel(n,target)});return}
  if(psdIs(n)&&target<LEVEL_RATING[n])target=LEVEL_RATING[n];
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&psdIs(sv.level)&&!psdReady()&&!PSD._wait){PSD._wait=1;psdLoad().then(()=>{PSD._wait=0;restore(sv)});return}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);
  try{if(psdIs(LEVEL)&&typeof psdArrive==='function')psdArrive(LEVEL)}catch(e){console.error('psd restore',e)}
  return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||psdIs(n)}}
if(typeof CONTAINERS!=='undefined'&&!CONTAINERS.includes('gy_chest'))CONTAINERS.push('gy_chest');
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(psdIs(LEVEL)){const L=LEVELS[LEVEL],V=L&&L._psd;if(V){
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=V.lcol[key]||V.col;l.kI=1.4;l.range2=115;l.calm=true}
      if(V.torches&&V.torch){gyFlames();const T=V.torch;
        for(const [x,y,f,nar] of V.torches){const d=GYM_D[f],O=nar?.035:TORCH_OUT;
          LIGHTS.push({x:x+.5+d[0]*(.5+O),y:y+.5+d[1]*(.5+O),ph:hash2(x,y,5)*6.28,key:(y*MW+x)*4+f,taken:false,red:!!T.red,fl:T.fl,col:T.col,o:O,nar:!!nar,range2:150,kI:1.25})}}}}}catch(e){console.error('psd lights',e)}
  return r}}
/* the doors: stairs, the sealed wine cellar door */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psd){
    if(d.psd==='stair'){sfx('door');if(!LEVELS[d.lvl]&&KH_LAZY[d.lvl])try{KH_LAZY[d.lvl]()}catch(e){console.error(e)}goToLevel(d.lvl,d.at);return true}
    if(d.psd==='sealed'){sfx('locked');msg(d.msg,'#c8d0e0');return true}
    return true}
  return _k.apply(this,arguments)}}
/* deep water cannot be waded: the engine's message for blocked terrain is about mountains, so the dungeons say their own */
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(psdIs(LEVEL)&&typeof TERR_BLOCK!=='undefined'&&TERR_BLOCK&&TERR_BLOCK[ny*MW+nx]){sfx('bump');msg('The water is too deep and cold to wade. Keep to the stone and the shallows.','#a8c8d8');return true}}catch(e){}
  return _db.apply(this,arguments)}}
/* ==========================================================================
   THE PLANS: rooms as rectangles [x0,y0,x1,y1] (x across, y down), doors, the look, the names for the maps, and the dress function that furnishes each floor.
   Violet torches (fl 2) in the Gaols, cold blue (fl 3) in the Deep Cells, dim violet in the Oubliette. Warm candlelight only in the cells of friendly prisoners.
   ========================================================================== */
const psdOpenSet=(a,b)=>{const o=[];for(let y=a[1];y<=a[3];y++)for(let x=a[0];x<=a[2];x++)o.push([x,y]);return o};
/* a cell door: a picture of an iron gate on the doorway square; talking to it talks to the prisoner inside (and opens the door), an empty cell just opens */
function psdGate(C,key,x,y,who,note){
  const nid='psd_cell'+key;PSD.cells[key]={who,note,x,y,level:C.id};
  if(!NPCS[nid]){const pn=who&&NPCS[who];khNpc(nid,pn?pn.name:'A cell door',pn?pn.img:'gy_igate2',d=>psdGateTalk(key,d))}
  return C.P('cell_door',x,y,{block:true,npc:nid,sc:.62,raw:true})}
/* a living prisoner behind the gate (the picture is p_<name>) */
function psdPerson(C,who,pic,x,y){return C.P('p_'+pic,x,y,{block:true,npc:who,raw:true,sc:1})}
/* a cell furnished: bed, bucket, roots through the window, a warm candle if the prisoner is friendly */
function psdCell(C,key,side,cx,who,pic,note,extra){
  const N=side==='N',gy=N?C.cellGate[0]:C.cellGate[1],iy0=N?C.cellRows[0]:C.cellRows[2],dir=N?1:-1;   // dir: from the gate towards the back wall
  const back=N?C.cellRows[0]:C.cellRows[1],mid=N?back+2:back-2;      // the back wall row and the prisoner's row
  psdGate(C,key,cx,gy,who,note);
  C.P('straw_bed',cx-1,back,{});C.P('bucket_well',cx+1,back,{sc:.6});
  if(IMG.ww_twig2)C.dec('ww_twig2',cx+1,mid,{sc:.5,over:1,force:1});
  if(who){psdPerson(C,who,pic,cx,mid);C.light(cx,mid,PSD_WARM)}
  if(extra)extra(C,cx,back,mid,gy);
}
/* ====================================================================== 9780 THE UNDERCROFT GAOLS ====================================================================== */
{const CX=[15,19,23,27,31],R=[[30,4,50,16],[39,17,41,23],[9,24,43,26],[9,27,11,39],[44,18,72,34],[64,35,66,49],[9,36,66,38],[56,50,76,59],
   [34,19,37,22],[35,23,35,23],[34,28,37,31],[35,27,35,27],[44,40,52,46],[48,39,48,39],[20,40,26,44],[23,39,23,39],[56,40,62,47],[59,39,59,39],[68,41,76,47],[67,43,67,44]];
 for(const x of CX)R.push([x-1,19,x+1,22],[x,23,x,23],[x-1,28,x+1,31],[x,27,x,27]);
 PSD.SPEC[9780]={brick:'texGrey',rgb:[.9,.92,1.08],wall:.9,lcol:[.74,.62,1.2],torch:{fl:2,col:[.56,.36,.74],name:'purple',css:'#b06cf0'},fgain:.5,ftint:[.88,.9,1.05],fl0:3,fl1:5,ceil:'gyc_crypt',
 rects:R,keepAt:[[66,57,2]],
 doors:[{x:40,y:3,kind:'stair'},{x:66,y:60,kind:'stair'},{x:10,y:40,kind:'sealed',msg:'A heavy oak door bound with iron, barred from the other side. Cold air comes under it, and the sound of water. This way leads to the Wine Cellar, and it cannot be opened from here.'}],
 names:[{t:"The Gaoler's Hall",x:40,y:10,k:'place'},{t:'Cell Block A',x:24,y:25,k:'place'},{t:"The Gaolers' Mess",x:35,y:20,k:'place'},{t:'The Question Room',x:58,y:26,k:'place'},{t:'The Sealed Cellar Door',x:10,y:38,k:'place'},{t:'The Guards\' Rest',x:48,y:43,k:'place'},{t:'The Latrines',x:23,y:42,k:'place'},{t:'The Quarters',x:59,y:44,k:'place'},{t:'The Store',x:72,y:44,k:'place'},{t:'The Stair Room',x:66,y:54,k:'place'}],
 dress(C){const {dec,P,sign,foe,light}=C;C.cellGate=[23,27];C.cellRows=[19,31,29];
  /* the Gaoler's Hall: the hall under the kitchens, two long tables, a cage, the key boards; three tunnel-arches of the bastion lead off its south side */
  sign(38,4,[0,-1],'THE UNDERCROFT GAOLS','The cells are down the south passage');
  P('table_high',35,9,{block:true});P('table_high',45,9,{block:true});
  for(const [x,y] of [[34,11],[36,11],[44,11],[46,11]])dec('bench',x,y,{sc:.8});
  P('cage',48,5,{block:true});P('chains',32,4,{});P('chains',48,12,{});
  P('barrels',31,14,{block:true});P('barrels',49,14,{block:true});P('brazier',33,7,{block:true});P('brazier',47,7,{block:true});
  P('bucket_well',31,6,{sc:.6});dec('bones',44,15,{sc:.7});dec('web',30,4,{sc:.55});dec('web',50,4,{sc:.55});
  light(33,7,[.95,.6,1.25]);light(47,7,[.95,.6,1.25]);light(35,12,[.7,.65,1.2]);light(45,12,[.7,.65,1.2]);
  if(IMG.ww_twig2){for(const [x,y] of [[30,9],[50,10],[36,16],[44,16]])dec('ww_twig2',x,y,{sc:.7,over:1,force:1})}
  foe('psturnkey',36,13);foe('psturnkey',44,13);foe('psturnkey',40,15);foe('gyrat',32,12);foe('gyrat',48,8);
  /* Cell Block A */
  CX.forEach((cx,i)=>{
    const nW={0:['garrick','garrick'],2:['isaude','isaude']};
    if(i===0)psdCell(C,'9780_0','N',cx,'psd_garrick','garrick');
    else if(i===2)psdCell(C,'9780_2','N',cx,'psd_isaude','isaude');
    else if(i===1)psdCell(C,'9780_1','N',cx,null,null,'The lock is rusted through and falls apart in your hand. Inside, a skeleton sits chained to the wall with its head on its chest. Somebody has scratched a tally on the stone beside it, forty strokes, and then a line.',(C,cx,back,mid)=>{foe('psshackle',cx,mid)});
    else if(i===3)psdCell(C,'9780_3','N',cx,null,null,'The cell door opens with a groan. Straw, a tin bowl, a heap of old clothes, and a small chest pushed under the bed.',(C,cx,back,mid)=>{dec('chest',cx,mid,{block:true})});
    else psdCell(C,'9780_4','N',cx,null,null,'The cell is empty. The straw is fresh, and somebody has been sleeping here. On the wall is scratched: THEY DO NOT FEED YOU AFTER THE THIRD DAY. THAT IS HOW YOU KNOW.');
    if(i===0)psdCell(C,'9780_5','S',cx,'psd_peck','peck');
    else if(i===1)psdCell(C,'9780_6','S',cx,null,null,'The door swings open. A man in rags is chained to the back wall. He has been dead a long while, and something in the chains has not got the message.',(C,cx,back,mid)=>{foe('psshackle',cx,mid)});
    else if(i===2)psdCell(C,'9780_7','S',cx,null,null,'The lock turns by itself. A cold shape stands in the corner of the cell, facing the wall, and does not turn round at once.',(C,cx,back,mid)=>{foe('pscellghost',cx,mid)});
    else if(i===3)psdCell(C,'9780_8','S',cx,null,null,'The door opens. A guard who stole from his own prison is lying here with his keys still on his belt, and a small chest under his head.',(C,cx,back,mid)=>{dec('chest',cx,mid,{block:true})});
    else psdCell(C,'9780_9','S',cx,null,null,'The cell is empty except for a bucket and a message on the wall: THE ONES WHO TALK ARE LET OUT. THE ONES WHO DO NOT ARE FORGOTTEN.')});
  P('chains',12,24,{});P('chains',22,26,{});P('chains',34,24,{});P('chains',16,26,{});
  for(const [x,y] of [[13,25],[26,25],[38,25],[10,29]])dec('bones',x,y,{sc:.7});
  for(const [x,y] of [[14,24],[30,26],[24,24]])dec('web',x,y,{sc:.5});
  if(IMG.ww_twig2)for(const [x,y] of [[12,26],[28,24],[37,26],[10,32],[10,35]])dec('ww_twig2',x,y,{sc:.8,over:1,force:1});
  for(const [x,y] of [[20,25],[34,25],[10,31]])light(x,y,[.7,.62,1.2]);
  sign(13,24,[0,-1],'CELL BLOCK A','Speak to the one inside and the door opens');
  foe('psturnkey',20,25);foe('psturnkey',37,25);foe('psflayed',10,31);foe('psflayed',27,26);foe('gyrat',16,25);foe('gyrat',30,25);foe('gyrat',10,37);
  /* the Gaolers' Mess and the Store */
  P('table_high',35,20,{block:true});dec('bench',36,22,{sc:.8});P('barrels',37,19,{block:true});dec('gy_nameplate',34,21,{block:true,npc:'psd_stone0',sc:1,raw:true});
  P('barrels',34,28,{block:true});dec('crate',36,28,{block:true,sc:.9});dec('crate',37,30,{block:true,sc:.9});P('straw_bed',34,31,{});foe('gyrat',35,29);
  /* the Question Room */
  sign(44,23,[-1,0],'THE QUESTION ROOM','Ask politely. It does not help.');
  P('rack',47,19,{block:true});P('iron_maiden',53,19,{block:true});P('iron_maiden',57,19,{block:true});P('stocks',62,19,{block:true});
  P('chains',50,19,{});P('chains',66,19,{});P('chains',70,19,{});
  P('rack',47,33,{block:true});P('stocks',52,33,{block:true});P('iron_maiden',58,33,{block:true});P('chains',62,33,{});P('chains',68,33,{});
  P('brazier',55,22,{block:true});P('brazier',55,30,{block:true});P('brazier',66,22,{block:true});P('brazier',66,32,{block:true});
  for(const [x,y] of [[55,22],[55,30],[66,22],[66,32]])light(x,y,[1.25,.55,.85]);
  P('shackled_skeleton',72,22,{});P('shackled_skeleton',72,30,{});dec('bones',50,27,{sc:.8});dec('bones',60,25,{sc:.7});dec('bones',64,30,{sc:.7});dec('bones',50,22,{sc:.7});
  P('butcher_block',70,27,{block:true});dec('chest',71,19,{block:true,npc:'psd_tinchest',raw:true,sc:.9});
  dec('gy_nameplate',45,33,{block:true,npc:'psd_stone1',sc:1,raw:true});
  foe('psquestioner',66,27);foe('psshackle',45,20);foe('psshackle',72,26);foe('psshackle',60,33);foe('psflayed',50,25);foe('psflayed',64,21);foe('gyrat',58,28);
  /* the south corridor and its rooms: the guards' rest, the latrines, the quarters, the store */
  for(const [x,y] of [[20,37],[34,38],[44,37],[54,36],[62,38]])dec('bones',x,y,{sc:.65});
  P('chains',16,36,{});P('chains',40,36,{});P('chains',56,38,{});dec('web',12,36,{sc:.55});dec('web',50,36,{sc:.55});
  if(IMG.ww_twig2)for(const [x,y] of [[14,38],[30,36],[46,38],[60,36]])dec('ww_twig2',x,y,{sc:.8,over:1,force:1});
  for(const [x,y] of [[18,37],[30,37],[42,37],[54,37]])light(x,y,[.7,.62,1.2]);
  foe('psturnkey',28,37);foe('psflayed',46,37);foe('psturnkey',52,37);foe('gyrat',16,37);foe('gyrat',38,38);
  P('straw_bed',45,41,{});P('straw_bed',45,45,{});dec('bench',50,42,{sc:.8});P('barrels',51,45,{block:true});P('brazier',51,41,{block:true});light(50,43,[.8,.65,1.2]);foe('psturnkey',48,44);
  P('bucket_well',21,41,{block:true});P('bucket_well',25,41,{block:true});P('bucket_well',21,43,{block:true,sc:.7});dec('bones',24,43,{sc:.7});foe('gyrat',23,42);
  for(const [x,y] of [[57,41],[57,45],[61,41],[61,45]])P('straw_bed',x,y,{});P('table_high',59,43,{block:true});P('barrels',62,47,{block:true});foe('psturnkey',59,45);
  P('rack',70,41,{block:true});P('rack',74,41,{block:true});dec('chest',69,46,{block:true,goldAmt:2800});dec('chest',75,46,{block:true,goldAmt:3100});P('barrels',72,46,{block:true});dec('crate',76,43,{block:true,sc:.9});light(72,44,[.8,.65,1.2]);
  /* the Stair Room */
  sign(64,59,[0,1],'THE STAIR TO THE DEEP CELLS','Below, the cells stand in water');
  dec('bench',58,52,{sc:.8});dec('bench',74,52,{sc:.8});P('barrels',58,57,{block:true});P('barrels',74,57,{block:true});P('brazier',60,51,{block:true});P('brazier',72,51,{block:true});light(60,52,[.9,.62,1.2]);light(72,52,[.9,.62,1.2]);light(66,55,[.75,.65,1.2]);
  P('chains',70,50,{});dec('bones',62,56,{sc:.7});dec('web',56,50,{sc:.55});dec('web',76,50,{sc:.55});
  foe('psturnkey',62,54);foe('psturnkey',70,55);foe('gyrat',64,52)}}};
/* ====================================================================== 9790 THE DEEP CELLS AND THE CISTERN ====================================================================== */
{const CX=[14,22,32,40],R=[[58,4,74,12],[46,7,57,9],[46,10,48,22],[10,15,45,23],[28,24,30,33],[20,34,60,56],[9,55,21,59]];
 for(const x of CX)R.push([x-1,10,x+1,13],[x,14,x,14]);
 PSD.SPEC[9790]={brick:'texBlack',rgb:[.82,.9,1.12],wall:1.3,lcol:[.5,.75,1.5],torch:{fl:3,col:[.45,.8,1.7],name:'blue',css:'#4f9cff'},fgain:.52,ftint:[.82,.9,1.12],fl0:3,fl1:5,ceil:'gyc_2',
 rects:R,keepAt:[[14,57,2]],
 doors:[{x:66,y:3,kind:'stair'},{x:14,y:60,kind:'stair'}],
 names:[{t:'The Stair Landing',x:66,y:8,k:'place'},{t:'Cell Block B',x:28,y:17,k:'place'},{t:'The Flooded Half',x:38,y:21,k:'place'},{t:'The Drain',x:29,y:28,k:'place'},{t:'The Cistern',x:40,y:48,k:'place'},{t:'The West Wheel',x:24,y:36,k:'place'},{t:'The South Wheel',x:40,y:52,k:'place'},{t:'The East Wheel',x:58,y:38,k:'place'},{t:'The Stair Room',x:15,y:57,k:'place'}],
 dress(C){const {dec,P,sign,foe,light,setF}=C;C.cellGate=[14,0];C.cellRows=[10,13,12];
  /* floors: wet cobbles on the dry side, shallows on the flooded side and in the cistern, deep pools (blocked), dry causeways */
  setF(10,15,26,23,'2');setF(27,15,45,16,'2');setF(27,17,45,23,'5');setF(31,10,33,13,'5');setF(39,10,41,13,'5');setF(31,14,33,14,'2');setF(28,24,30,33,'2');
  setF(34,18,39,21,'6');
  setF(20,34,60,56,'5');setF(33,36,52,42,'6');setF(44,48,54,55,'6');setF(26,48,35,55,'6');
  for(const r of [[28,34,30,46],[22,35,27,38],[21,35,23,56],[28,44,57,46],[39,44,41,54],[37,50,43,54],[56,36,58,46],[55,36,60,40]])setF(r[0],r[1],r[2],r[3],'3');
  setF(9,55,21,59,'2');setF(58,4,74,12,'2');setF(46,7,57,9,'2');setF(46,10,48,22,'2');
  /* the landing */
  sign(64,4,[0,-1],'THE DEEP CELLS','Below the gaols. The water rises here.');
  dec('bench',60,5,{sc:.8});dec('bench',72,5,{sc:.8});P('barrels',60,11,{block:true});P('barrels',72,11,{block:true});P('brazier',62,5,{block:true});P('brazier',70,5,{block:true});
  light(62,5,[.5,.8,1.5]);light(70,5,[.5,.8,1.5]);light(66,10,[.55,.8,1.45]);P('chains',74,8,{});dec('web',58,4,{sc:.55});dec('web',74,4,{sc:.55});
  foe('psturnkey',61,9);foe('psturnkey',71,9);foe('gyrat',66,11);
  /* Cell Block B */
  psdCell(C,'9790_0','N',14,'psd_calpurnia','calpurnia');
  psdCell(C,'9790_1','N',22,'psd_harrow','harrow');
  psdCell(C,'9790_2','N',32,'psd_sedge','sedge');
  psdCell(C,'9790_3','N',40,null,null,'The door swings open and water runs out over your boots. Two prisoners drowned here, side by side, and one of them is still on his feet. A small chest floats against the back wall.',(C,cx,back,mid)=>{foe('psdrowned',cx,mid);dec('chest',cx+1,mid-1,{block:true})});
  sign(18,15,[0,-1],'THE VALVES OF THE CISTERN','Turn the wheels in this order: SOUTH, then WEST, then EAST. Never out of turn.');
  dec('gy_nameplate',12,16,{block:true,npc:'psd_stone2',sc:1,raw:true});
  dec('column',12,19,{block:true});dec('column',12,22,{block:true});dec('column',20,19,{block:true});dec('column',20,22,{block:true});dec('column',30,19,{block:true});dec('column',30,22,{block:true});dec('column',42,19,{block:true});dec('column',42,22,{block:true});
  dec('bench',16,17,{sc:.8});dec('bench',24,17,{sc:.8});dec('bones',17,21,{sc:.7});dec('bones',25,20,{sc:.7});P('chains',26,15,{});P('chains',10,15,{});
  if(IMG.ww_twig2)for(const [x,y] of [[11,15],[24,16],[28,15],[35,16],[44,16],[16,23],[26,23]])dec('ww_twig2',x,y,{sc:.8,over:1,force:1});
  for(const [x,y] of [[16,19],[24,19],[34,16],[43,16],[28,21]])light(x,y,[.5,.8,1.5]);
  foe('pscellghost',17,19);foe('pscellghost',24,22);foe('psleech',29,20);foe('psleech',43,21);foe('psdrowned',38,23);foe('psdrowned',44,17);foe('psturnkey',22,16);foe('psturnkey',36,15);
  /* the drain (a short passage of wet cobbles, with water running in a gutter) */
  dec('bones',29,28,{sc:.7});P('chains',28,26,{});if(IMG.ww_twig2)dec('ww_twig2',30,31,{sc:.8,over:1,force:1});light(29,27,[.5,.8,1.5]);light(29,31,[.5,.8,1.5]);foe('psleech',29,25);
  /* the cistern: wheels on three stone platforms, columns standing in the shallows, a stone on the west walkway */
  P('valve_wheel',24,36,{block:true,npc:'psd_wheel0',raw:true,sc:.9});P('valve_wheel',40,52,{block:true,npc:'psd_wheel1',raw:true,sc:.9});P('valve_wheel',58,38,{block:true,npc:'psd_wheel2',raw:true,sc:.9});
  for(const [x,y] of [[26,44],[26,47],[59,44],[59,50],[46,43],[34,43]])dec('column',x,y,{block:true});
  dec('gy_nameplate',21,46,{block:true,npc:'psd_stone3',sc:1,raw:true});
  P('brazier',22,36,{block:true});P('brazier',43,50,{block:true});P('brazier',60,36,{block:true});P('bucket_well',23,38,{sc:.6});dec('bones',42,52,{sc:.7});dec('bones',58,40,{sc:.7});dec('bones',38,45,{sc:.7});dec('bones',29,40,{sc:.7});
  for(const [x,y] of [[22,36],[43,50],[60,36],[29,40],[29,45],[40,45],[56,44],[22,52]])light(x,y,[.5,.8,1.5]);
  sign(29,34,[0,-1],'THE CISTERN','Three wheels hold back the water');
  if(IMG.ww_twig2)for(const [x,y] of [[22,45],[31,35],[50,45],[61,38],[40,48],[21,54]])dec('ww_twig2',x,y,{sc:.9,over:1,force:1});
  foe('psleech',26,41);foe('psleech',36,43);foe('psleech',47,47);foe('psleech',55,42);foe('psleech',60,48);foe('psleech',24,50);
  foe('psdrowned',25,45);foe('psdrowned',57,49);foe('psdrowned',50,44);foe('pscellghost',33,45);
  /* the stair room to the Oubliette */
  sign(12,59,[0,1],'THE STAIR TO THE OUBLIETTE','Nobody was meant to come back up');
  dec('bench',10,56,{sc:.8});dec('bench',20,58,{sc:.8});P('barrels',10,58,{block:true});P('brazier',19,56,{block:true});light(18,57,[.5,.8,1.5]);dec('bones',16,58,{sc:.7});foe('psdrowned',18,58)}}};
/* ====================================================================== 9800 THE OUBLIETTE ====================================================================== */
PSD.O={cx:36,cy:33,rx:27,ry:22,cells:[['E',21],['E',28],['E',38],['E',45],['W',28],['W',38],['W',45]]};
PSD.SPEC[9800]={brick:'texBone',rgb:[.9,.88,1.05],wall:.62,lcol:[.72,.6,1.1],torch:{fl:2,col:[.5,.32,.66],name:'purple',css:'#b06cf0'},fgain:.48,fgain1:.8,ftint:[.88,.86,1.02],fl0:5,fl1:4,ceil:'gyc_3',amb:.02,
 rects:[[8,4,22,9],[13,10,15,22]],keepAt:[[14,6,2]],
 doors:[{x:14,y:3,kind:'stair'}],
 names:[{t:'The Shaft Foot',x:15,y:7,k:'place'},{t:'The Round Chamber',x:36,y:19,k:'place'},{t:'The Pit',x:36,y:33,k:'place'},{t:'The Cells of the Oubliette',x:60,y:33,k:'place'}],
 carve(g){const O=PSD.O,ok=(x,y)=>((x-O.cx)/O.rx)**2+((y-O.cy)/O.ry)**2<=1;
  for(let y=0;y<64;y++)for(let x=0;x<72;x++)if(ok(x,y))g[y][x]='.';
  const xmax=y=>{for(let x=71;x>=0;x--)if(ok(x,y))return x;return -1},xmin=y=>{for(let x=0;x<72;x++)if(ok(x,y))return x;return -1};
  O.gates=[];
  for(const [side,y] of O.cells){
    if(side==='E'){const xe=Math.max(xmax(y-1),xmax(y),xmax(y+1));for(let x=xmax(y)+1;x<=xe+1;x++)g[y][x]='.';
      for(let yy=y-1;yy<=y+1;yy++)for(let x=xe+2;x<=xe+4;x++)g[yy][x]='.';O.gates.push({side,y,gx:xe+1,ix:xe+3})}
    else{const xw=Math.min(xmin(y-1),xmin(y),xmin(y+1));for(let x=xmin(y)-1;x>=xw-1;x--)g[y][x]='.';
      for(let yy=y-1;yy<=y+1;yy++)for(let x=xw-4;x<=xw-2;x++)g[yy][x]='.';O.gates.push({side,y,gx:xw-1,ix:xw-3})}}},
 dress(C){const {dec,P,sign,foe,light,setF,open}=C,O=PSD.O;
  for(let y=0;y<64;y++)for(let x=0;x<72;x++)if(open(x,y)&&Math.hypot((x-O.cx)/1,(y-O.cy)/1)<=8.6)setF(x,y,x,y,'1');
  for(let y=14;y<54;y+=3)for(let x=12;x<62;x+=3)if(open(x,y)&&C.rng(x,y)<.28&&Math.hypot(x-O.cx,y-O.cy)>9.5)setF(x,y,x,y,'2');
  sign(16,4,[0,-1],'THE OUBLIETTE','What is put down here is forgotten');
  dec('gy_nameplate',9,6,{block:true,npc:'psd_stone4',sc:1,raw:true});dec('bench',20,5,{sc:.8});P('brazier',21,8,{block:true});light(20,7,[.72,.6,1.15]);P('chains',10,9,{});dec('web',8,4,{sc:.55});dec('web',22,4,{sc:.55});dec('bones',17,8,{sc:.8});
  light(14,13,[.7,.6,1.15]);light(14,19,[.7,.6,1.15]);
  /* the cells round the pit */
  const who=[['psd_gaunt','gaunt'],['psd_stamford','stamford'],['psd_yseult','yseult']],cellDefs=[
    {who:0},{who:1},{note:'The door opens. A man in the remains of a uniform is sitting against the back wall with his sword across his knees. It is a very good sword, and he has not let go of it. Under him is a small chest.',chest:1},
    {note:'The door opens with a crack of rust. Inside, three skeletons are chained side by side. The middle one gets up.',foe:'psshackle'},
    {who:2},{note:'The door opens on a heap of straw, a woman\'s shawl and a tin cup full of bone dust. A small chest stands in the straw.',chest:1},{note:'The cell is cold in a way that has nothing to do with the stone. Something in the corner is waiting for you to speak first.',foe:'pscellghost'}];
  O.gates.forEach((G2,i)=>{const cd=cellDefs[i],E=G2.side==='E',gy=G2.y,key='9800_'+i,w=cd.who!==undefined?who[cd.who]:null;
    psdGate(C,key,G2.gx,gy,w?w[0]:null,cd.note);const ix=G2.ix;
    P('straw_bed',E?ix+1:ix-1,gy-1,{});P('bucket_well',E?ix+1:ix-1,gy+1,{sc:.6});
    if(w){psdPerson(C,w[0],w[1],ix,gy);light(ix,gy,PSD_WARM)}
    if(cd.chest)dec('chest',ix,gy+1,{block:true});if(cd.foe)foe(cd.foe,ix,gy);
    if(IMG.ww_twig2)dec('ww_twig2',E?ix+1:ix-1,gy,{sc:.5,over:1,force:1})});
  /* the pit: the Hunger asleep in the middle on a floor of bones, a chest at its edge, a ring of bone piles */
  foe('psbonecrawl',22,24);foe('psbonecrawl',50,24);foe('psbonecrawl',22,42);foe('psbonecrawl',50,42);foe('psbonecrawl',36,21);foe('psbonecrawl',36,46);
  foe('psshackle',16,30);foe('psshackle',56,32);foe('psshackle',16,36);foe('psshackle',56,36);foe('pscellghost',30,22);foe('pscellghost',42,44);foe('pscellghost',14,24);
  foe('pshunger',36,33);dec('chest',36,40,{block:true,goldAmt:9000,sc:1});
  for(let a=0;a<22;a++){const t=a/22*6.283,r=5.4+(a%3)*1.1,x=Math.round(O.cx+Math.cos(t)*r),y=Math.round(O.cy+Math.sin(t)*r*.9);if(Math.abs(x-36)<=1&&y>=39)continue;dec('bones',x,y,{sc:.8+(a%4)*.1})}
  for(const [x,y] of [[30,28],[42,29],[30,38],[44,36],[36,27]])P('shackled_skeleton',x,y,{});
  /* the round walk: bone-strewn, roots and shadows */
  for(let n=0;n<70;n++){const t=C.rng(n,3)*6.283,r=11+C.rng(n,5)*12,x=Math.round(O.cx+Math.cos(t)*r*1.15),y=Math.round(O.cy+Math.sin(t)*r*.92);if(Math.hypot(x-O.cx,y-O.cy)>9.4)dec('bones',x,y,{sc:.6+C.rng(n,7)*.4})}
  if(IMG.ww_twig2)for(let n=0;n<26;n++){const t=C.rng(n,13)*6.283,r=17+C.rng(n,15)*8,x=Math.round(O.cx+Math.cos(t)*r*1.1),y=Math.round(O.cy+Math.sin(t)*r*.9);if(Math.hypot(x-O.cx,y-O.cy)>9.4)dec('ww_twig2',x,y,{sc:.8,over:1,force:1})}
  for(const [x,y] of [[20,26],[20,40],[52,26],[52,40],[36,16],[36,50],[28,20],[44,48],[28,46],[44,20],[14,30],[58,33],[24,33],[48,33]])light(x,y,[.7,.6,1.15]);
  for(const [x,y] of [[24,20],[48,20],[24,46],[48,46],[36,18],[36,48]])P('brazier',x,y,{block:true});
  }};
/* ==========================================================================
   THINGS THE PARTY CARRIES (the rewards and the quest items this package owns; the others are in PSP_ITEMS of ps_core.js and are defined by their own package)
   ========================================================================== */
ITEMDEF.pstin={n:"Garrick's Tin",k:'quest',t:'Quest item',ic:'ore',c:'#a8a8a0',stack:1,price:0,sw:.2,d:"A small round tin, dented, with the lid tied down with red string. It rattles with lock picks. Hob Garrick, in the Undercroft Gaols, would like it back."};
ITEMDEF.pspaintbrush={n:"Gaunt's Brush and Palette",k:'quest',t:'Quest item',ic:'dagger',c:'#b8a0d0',stack:1,price:0,sw:.2,d:"A painter's brush and a small wooden palette, lent by Wilhelmina Gaunt. Take them to the empty frame in the Gallery of Portraits and paint it."};
ITEMDEF.pspickset={n:"Garrick's Pick Set",k:'tool',t:'Tool',ic:'lockpick',c:'#c8c0b0',stack:1,price:0,sw:.1,d:"A roll of fine picks and wrenches, better than any shop sells. Hob Garrick made them himself and gave them to you. They open any lock you meet."};
ITEMDEF.pslocket={n:"Isaude's Silver Locket",k:'ring',t:'Ring',ic:'amulet',c:'#d8dcec',price:0,lvl:102,pas:{ward:18,dodge:.07,regen:.7,mpRegen:.5},int:8,hp:90,rar:1,sw:.1,d:"A small silver locket that once held the hair of Lady Isaude's husband. Adds 8 Intelligence and 90 health, every blow on the wearer is 18 lighter, enemies miss 7% more, and wounds and tiredness heal steadily. Needs level 102."};
ITEMDEF.psraincharm={n:"Sedge's Rain Charm",k:'ring',t:'Ring',ic:'amulet',c:'#9ac8e8',price:0,lvl:103,pas:{ward:19,dodge:.07,regen:.9,mpRegen:.4},hp:110,rar:1,sw:.1,d:"A knot of blue thread and a small shell, the charm that the wellwives of the Low Street hang over the well. Adds 110 health, every blow on the wearer is 19 lighter, enemies miss 7% more, and wounds close quickly. Needs level 103."};
ITEMDEF.pscandle={n:'Candle of Calpurnia',k:'light',t:'Light',ic:'torch',c:'#f0e8c8',light:3.4,price:0,rar:1,sw:.3,d:"A thick white candle that burns with a steady gold flame, and has never got shorter. Sister Calpurnia kept it all through her years in the cell. It shines further than any lantern, and the dead keep back from its light a little."};
ITEMDEF.psharrowseal={n:"Harrow's Seal",k:'ring',t:'Ring',ic:'ring',c:'#c0c8d8',price:0,lvl:104,pas:{ward:20,dodge:.08,regen:.8,mpRegen:.5},int:8,hp:100,rar:1,sw:.1,d:"The signet of Captain Dyrwen Harrow, last Warden of the Road. It is the twin of the seals the Wardens left in Wenlock, and whoever carries it will be heard at their doors. Adds 8 Intelligence and 100 health, every blow on the wearer is 20 lighter, enemies miss 8% more, and wounds and tiredness heal steadily. Needs level 104."};
ITEMDEF.pspalette={n:"Gaunt's Palette",k:'ring',t:'Ring',ic:'ring',c:'#c8a8e0',price:0,lvl:104,pas:{ward:18,dodge:.08,regen:.7,mpRegen:.7},int:10,hp:90,rar:1,sw:.1,d:"A tiny palette of old walnut with seven dried colours on it, worn on a cord. Wilhelmina Gaunt painted three Sovereigns with it. Adds 10 Intelligence and 90 health, every blow on the wearer is 18 lighter, enemies miss 8% more, and spells recover faster. Needs level 104."};
ITEMDEF.psdawnsword={n:'Dawnwarden',k:'weapon',t:'Sword',ic:'sword',c:'#e8e4f4',dmg:[520,620],hit:.2,req:{str:76},lvl:96,price:0,rar:1,eff:{daze:.2,bleed:[.3,6,45],bossdmg:.4},dbl:.2,sw:.46,d:"Sir Edrik Stamford's sword, a plain blade with a white pommel and a sunrise cut into the guard. It was his father's, and his father's before him. One blow in five leaves the foe dazed, wounds bleed, and bosses take 40% more. Needs level 96."};
ITEMDEF.psantidote={n:'Pale Antidote',k:'potion',t:'Potion',ic:'potion',c:'#d0e8f0',price:0,d:'A pale, bitter antidote made by Yseult Ardent from the silver roses of the courtyard. It cures poison, venom, fever and the silver sickness.',cures:1,sw:.34};
/* ==========================================================================
   THE PRISONERS AND THEIR NINE QUESTS (psq30 to psq38). Premise, task and reward are the plan's; the words are plain.
   ========================================================================== */
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes('The Pale Spire'))QAREA_ORDER.push('The Pale Spire');
const psdStones=()=>Object.keys(psdF().stone).length;
function psdQ(id,title,who,steps,reward,extra){
  const q=Object.assign({title,who,need:steps.length,goal:()=>steps.reduce((n,s)=>n+(s[1]()?1:0),0),reward},extra||{});
  Object.defineProperty(q,'desc',{enumerable:true,configurable:true,get(){const s=steps.find(s=>!s[1]());return s?(typeof s[0]==='function'?s[0]():s[0]):'Go back to '+who.split(',')[0]+'. All is done.'}});
  QUESTS[id]=q;QAREA[id]='The Pale Spire';return q}
const psdHas=(id,n)=>()=>bagCount(id)>=(n||1);
psdQ('psq30',"The Gaoler's Tin",'Hob Garrick, thief, in Cell Block A of the Undercroft Gaols',[["Bring Hob Garrick's tin of lock picks from the chest in the north east corner of the Question Room, in the Undercroft Gaols (below the kitchens). Red string on the lid.",psdHas('pstin')]],{gold:6000,xp:40000,items:['pspickset']},{take:{pstin:1}});
psdQ('psq31','The Signet Behind the Portrait','Lady Isaude Marwen, in Cell Block A of the Undercroft Gaols',[["Find Lady Isaude's portrait in the West Gallery (the Gallery of Portraits, ground floor of the Great Halls) and bring her heron signet ring from behind it.",psdHas('pssignet')]],{gold:7000,xp:45000,items:['pslocket']},{take:{pssignet:1}});
psdQ('psq32',"The Steward's Keys",'Ansel Peck, cook, in Cell Block A of the Undercroft Gaols',[["Kill the Pale Steward in the kitchens (ground floor, west wing).",()=>!!pspF().stewardDead],["Bring Ansel Peck's iron ladle from the kitchens.",psdHas('psladle')]],{gold:6500,xp:42000,items:['psstew']},{take:{psladle:1}});
psdQ('psq33','The Three Wheels','Mother Sedge, wellwife, in the flooded Cell Block B of the Deep Cells',[["Turn the three valve wheels of the Cistern in the order shown on the wall of Cell Block B ("+"south, west, east).",()=>!!psdF().wheelsDone],["Survive the Drowned Gaoler, who rises when the last wheel is turned.",()=>psdF().gaoler===2]],{gold:8000,xp:50000,items:['psraincharm']});
psdQ('psq34','Names on the Wall','Sister Calpurnia, in Cell Block B of the Deep Cells',[[()=>"Read the five Name Stones cut into the walls of the dungeons: two in the Undercroft Gaols, two in the Deep Cells, one in the Oubliette ("+Math.min(5,psdStones())+" of 5).",()=>psdStones()>=5],["Speak the names aloud at the altar of the chapel (ground floor, east wing). Stand close to the altar.",()=>!!psdF().namesSpoken]],{gold:9000,xp:55000,items:['pscandle']});
psdQ('psq35',"The Warden's Horn",'Captain Dyrwen Harrow, in Cell Block B of the Deep Cells',[["Bring the Warden's Horn from the Winch Loft above the Great Gatehouse. Captain Harrow only wants to hold it; you keep it.",psdHas('pshorn')]],{gold:10000,xp:60000,items:['psharrowseal']});
psdQ('psq36','The Empty Frame','Wilhelmina Gaunt, court painter, in the Oubliette',[["Take three pigment pots from the Painters' Closet (behind the Gallery of Portraits, ground floor) to Wilhelmina Gaunt in the Oubliette, and give them to her.",()=>!!psdF().pots],["Take her brush and palette to the empty frame in the Gallery of Portraits and paint it (stand close to the frame).",()=>!!pspF().framePainted]],{gold:10000,xp:60000,items:['pspalette']});
psdQ('psq37','Dawnwarden','Sir Edrik Stamford, in the Oubliette',[["Bring Sir Edrik's sword Dawnwarden from the rack in the Armoury (ground floor, west wing) to the Oubliette.",psdHas('psdawnwarden')]],{gold:12000,xp:70000,items:['psdawnsword']},{take:{psdawnwarden:1}});
psdQ('psq38','The Cup for the Sovereign','Yseult Ardent, cupbearer, in the Oubliette',[["Bring three silver roses from the Rose Garden of the Court of Statues to Yseult Ardent in the Oubliette.",psdHas('psroses',3)]],{gold:11000,xp:65000,items:['psantidote']},{take:{psroses:3}});
QNOTE.psq33='Down in the Deep Cells the water begins to drain, and for the first time in a year Mother Sedge has dry feet.';
function psdGive(id,n){for(let i=0;i<n;i++){if(!bagAdd(mkItem(id)))G.items.push({k:id,x:G.P.x,y:G.P.y,taken:false})}}
/* the talk of a prisoner: first meeting, the offer, the reminder, the hand-in, the thanks. D = the texts. */
function psdOffer(qid,D){return gySay(D.offer,[['We will help.',()=>{qAccept(qid);return gySay(D.accept,[BYE])}],['Not now.',()=>null]])}
function psdHand(qid,D){return gySay(D.ready,[['Here you are.',()=>{const rw=rewardText(qid);qTurnIn(qid);if(D.done)D.done();return gySay(D.thanks+' (Reward: '+rw+'.)',[BYE])}],BYE])}
function psdTalk(qid,D,d){
  const st=qSt(qid);
  if(qReady(qid))return psdHand(qid,D);
  if(st==='done')return gySay(D.after,[BYE]);
  if(st==='active'){if(D.active){const n=D.active(qid,D);if(n)return n}return gySay(D.remind(),[BYE])}
  return gySay(D.intro,[['Is there anything we can do?',()=>psdOffer(qid,D)],['Who else is kept here?',()=>gySay(D.others||"Others are in the cells round about. Speak to each one, and the door opens.",[BYE])],BYE])}
function psdPrisoner(id,name,face,qid,D){khNpc(id,name,face,d=>psdTalk(qid,D,d),{q:[qid]});PSD.people=PSD.people||{};PSD.people[id]=D}
const psdLeft=()=>{const F=psdF();return F.wheel.length};
psdPrisoner('psd_garrick','Hob Garrick, thief','kh_ohfolk1_0','psq30',{
  intro:"Hob Garrick, thief, and I will say so before you do. I came in over the kitchen roof for six candlesticks. Six! Silver, mind. The turnkeys caught me on the stairs, and the Questioner took everything off me, my boots included, and my tin.",
  offer:"My tin of picks. Round, dented, the lid tied down with red string. The Questioner keeps what he takes in a chest in the Question Room, the north east corner. I would go myself, but the door is not the only thing in my way. Bring it back and I will make it worth your while. I know something about the Sacristan.",
  accept:"Bless you. Mind the Questioner. He talks to the walls, and I think the walls have started to answer.",
  remind:()=>bagCount('pstin')?"You have the tin! Give it here.":"The tin is in a chest in the north east corner of the Question Room, with red string round the lid.",
  ready:"That is it. Red string and all, and the lid is still tied.",
  thanks:"Wonderful. Those picks have opened better doors than yours. Take the set, I have another in my boot. And since you were kind: the day before the guards took the Sacristan, I saw him carry something into the chapel in a cloth, very carefully. Not a book. He put it where the candles are. That is all I know, and it is not nothing.",
  after:"Hob Garrick, honest man, at your service. If you ever find six silver candlesticks, they are mine.",
  done:()=>{pspF().garrickTold=1}});
psdPrisoner('psd_isaude','Lady Isaude Marwen','kh_ohfolk2_0','psq31',{
  intro:"I am Lady Isaude Marwen, and no, you do not have to bow. The Steward wanted my signet, because whoever holds it holds my house, and the house is all I have left. So I hid it where he would never think to look.",
  offer:"Behind my own portrait, in the Gallery of Portraits, the West Gallery on the ground floor of the Great Halls. A gold signet with a heron cut in it. Will you fetch it? I do not ask you to give it to anyone. I only want to hold it once before I am forgotten.",
  accept:"Thank you. My portrait is the one where I look as if I knew a joke. The frame is gold. Lift the frame, not the canvas. The canvas is very old.",
  remind:()=>bagCount('pssignet')?"You have it! Give it here.":"Behind my portrait in the West Gallery, ground floor of the Great Halls. A gold frame, and I am the one who looks as if she knew a joke.",
  ready:"That is my heron. Oh. Give it to me.",
  thanks:"It is warm from your hand. Thank you. Take this locket. It held my husband's hair, and now it can hold your luck.",
  after:"I am still Lady Marwen. I find that is enough."});
psdPrisoner('psd_peck','Ansel Peck, cook','kh_ohfolk3_0','psq32',{
  intro:"Ansel Peck, cook to the Pale Court for thirty one years, and for twenty nine of them the food was fit to eat. Then the Steward told me to cook for the dead. Nobody eats at their feasts. Nobody. So I stopped cooking, and here I am.",
  offer:"The Steward starved the kitchens to make me give in. If you put him down, I will think kindly of you for the rest of my life, which may be short. And my ladle, an iron one, I left it hanging by the great pot. Bring it, and I will give you something that does not taste of ash.",
  accept:"He is a tall thin ghost with a ring of keys, in the kitchens. You cannot miss him, he rattles. Mind the rats, they have been at the flour.",
  remind:()=>!pspF().stewardDead?"The Pale Steward is still in the kitchens on the ground floor. Tall, thin, a ring of keys.":bagCount('psladle')?"You have my ladle! Give it here.":"The Steward is gone, good. Now my ladle, an iron one by the great pot in the kitchens.",
  ready:"My ladle! And the Steward is gone? I can taste the air already.",
  thanks:"Ten bowls of my best, packed for the road. They stay warm, I never found out why. And since you ask about the Sacristan: a sad, careful man. He told me once he kept the upper keys where the candles are. The chapel, I think.",
  after:"If the kitchens are free, I will be there before the week is out. Somebody has to feed this place properly.",
  done:()=>{psdGive('psstew',9);pspF().peckTold=1}});
psdPrisoner('psd_sedge','Mother Sedge, wellwife','kh_ohfolk4_0','psq33',{
  intro:"Mother Sedge, wellwife of the Low Street. I have drawn water for the poor since before the Sovereign, and I know one thing about water: it goes where you let it. Look at my floor.",
  offer:"The cistern is flooded, and my cell with it. Three valve wheels hold the water back, and someone jammed them on purpose. They turn in an order, and the order is written on the wall of this block. Turn them right and the water goes down. The last wheel wakes whatever lives in the tank. Will you do it?",
  accept:"South first, then west, then east, as the wall says. Turn one wrong and every wheel springs back and the pipes scream. The thing in the tank is the old Gaoler. He drowned in there, and he does not know it yet.",
  remind:()=>psdF().wheelsDone?"The Gaoler has risen. Put him down.":"The wheels are in the Cistern, south of here. South, then west, then east. "+(psdLeft()?psdLeft()+' of 3 turned.':'None turned yet.'),
  ready:"The water is going down. I can hear it. Dear heart, you did it.",
  thanks:"Take this. A rain charm, the sort the wellwives hang over the well. It says that whatever comes, it will also stop.",
  after:"My feet are dry for the first time in a year. I shall sit here and enjoy it.",
  others:"Calpurnia is two cells along, she prays. Harrow across from her, he counts. The fourth cell had two men in it, and the water got them."});
psdPrisoner('psd_calpurnia','Sister Calpurnia','kh_ohfolk5_0','psq34',{
  intro:"Sister Calpurnia, of the chapel of the Spire. They shut me in here when I would not bless the Sovereign. I said I could not bless a man who had never asked me to. It is a great deal of fuss for a sentence.",
  offer:"Those who were kept here scratched their names on the walls, and nobody has read them since. There are five Name Stones, two in the Gaols above, two here in the Deep Cells, and one in the Oubliette at the bottom. Read them. Then go to the altar of the chapel and say the names aloud. Somebody must. It is the only burial they will have.",
  accept:"Read each stone slowly. The names are all that is left of them. Then the chapel, on the ground floor of the east wing. Stand close to the altar and speak.",
  remind:()=>psdStones()<5?"Name Stones read: "+psdStones()+" of 5. Two in the Gaols, two in the Deep Cells, one in the Oubliette.":"You have read them all. Now the altar of the chapel, east wing, ground floor. Stand close and speak the names.",
  ready:"You have said them. I felt it, even down here, like a bell a long way off. Thank you.",
  thanks:"Take my candle. It has burned for nobody since I was brought here, and it is no shorter. Perhaps it was waiting.",
  after:"I am no longer afraid of the dark. It was never the dark that was the trouble."});
psdPrisoner('psd_harrow','Captain Dyrwen Harrow','kh_ohsold1_0','psq35',{
  intro:"Captain Dyrwen Harrow, last Warden of the Road. I held the gate while the others went west. They took me alive, which I regret. Now I tell the rats the news. The rats are not good listeners.",
  offer:"My horn hangs in the Winch Loft above the gatehouse, where they hung it as a trophy. It is battered and tarnished, but it is the horn of the Road Wardens, and I would like to hold it once more. Bring it to me. Then it is yours to keep.",
  accept:"The Great Gatehouse, the east guardroom, the stair up to the loft. Go quietly. The Gate Captain sleeps lightly.",
  remind:()=>bagCount('pshorn')?"You have it! Bring it here.":"The horn hangs in the Winch Loft above the Great Gatehouse. East guardroom, stair up.",
  ready:"That is her. She is cold. She was always cold.",
  thanks:"Keep the horn, I do not need it. Take this seal instead. Wenlock has others like it, and a man who carries one will be heard at the Wardens' doors.",
  after:"Captain Harrow, at ease. For the first time in nine years, at ease."});
psdPrisoner('psd_gaunt','Wilhelmina Gaunt','kh_ohfolk6_0','psq36',{
  intro:"Wilhelmina Gaunt. Court painter to three Sovereigns, and the only one of them who ever asked me to paint what I saw. That was a mistake, and they shut me down here for it. There is one empty frame in the Gallery of Portraits. Mine. I never filled it.",
  offer:"I would like it painted. I cannot go, you see. Three pots of pigment from the Painters' Closet behind the Gallery, on the ground floor of the Great Halls. Bring them to me, and I will lend you my brush and palette, and you will paint the frame yourself, in my name.",
  accept:"The closet is behind the Gallery, a small room with a brush hanging on the door. The pots are clay, and small. Bring three.",
  remind:()=>"Take the brush and the palette to the empty frame in the Gallery of Portraits, and stand in front of it. Then come back and tell me how it looks.",
  active:(qid,D)=>{const F=psdF();
    if(!F.pots){if(bagCount('pspigment')>=3)return gySay("Three pots. Violet, white and grey, I can smell them from here. Give them to me.",[['Give her the three pots.',()=>{bagRemove('pspigment',3);F.pots=1;psdGive('pspaintbrush',1);return gySay("Good. Here is my brush and my palette. Take them to the Gallery of Portraits, to the empty frame, and stand before it. You will know what to do. Then come back and tell me how it looks.",[BYE])}],BYE]);
      return gySay("Three pots of pigment from the Painters' Closet behind the Gallery of Portraits. You have "+Math.min(2,bagCount('pspigment'))+(bagCount('pspigment')===1?" pot.":" pots."),[BYE])}
    return null},
  ready:"Is it done? Describe it to me. No, do not. I would rather imagine it.",
  thanks:"That is the first frame I ever finished by another's hand. Keep my palette. And you will find the frame has opened something in the Gallery. That was the idea.",
  after:"I can see it from here, if I close my eyes. It is a good frame."});
psdPrisoner('psd_stamford','Sir Edrik Stamford','kh_ohsold1_1','psq37',{
  intro:"Sir Edrik Stamford, knight of King Osric's garrison. We were four on the road when the Pale Guard took us, and I am the one who is still alive, if you call this alive.",
  offer:"They took my sword, Dawnwarden. It was my father's, and his father's. It hangs on a rack in the Armoury now, ground floor, west wing, south of the kitchens. I would like to hold it once more. Bring it here, and afterwards it is yours. A sword is no use to me in a cell.",
  accept:"A plain blade, a white pommel, a sunrise cut into the guard. You will know it when you see it.",
  remind:()=>bagCount('psdawnwarden')?"You have it! Bring it here.":"Dawnwarden hangs on a rack in the Armoury, ground floor, west wing.",
  ready:"Dawnwarden. Gods, it is light.",
  thanks:"It was my father's. Now it is yours, because you carried it through the Spire when I could not. Keep it bright.",
  after:"I held it for a whole minute. That is more than I hoped for."});
psdPrisoner('psd_yseult','Yseult Ardent, cupbearer','kh_ohfolk7_0','psq38',{
  intro:"Yseult Ardent, cupbearer. Forty years I tasted the Sovereign's cup, every morning and every night, and I am still alive. That is the first thing that should tell you something.",
  offer:"I know what is in the cup now, and I can make an antidote. It needs silver roses, from the Rose Garden in the courtyard, the ones with a violet heart. Three of them. Bring them to me and I will make it, and tell you what I know about the Sovereign.",
  accept:"Silver white petals and a violet heart. The Rose Garden of the Court of Statues. Mind the gardener, he does not like them picked.",
  remind:()=>bagCount('psroses')>=3?"You have the roses! Give them here.":"Three silver roses from the Rose Garden in the courtyard. You have "+Math.min(2,bagCount('psroses'))+".",
  ready:"Three silver roses. Give them here, quickly, before they close.",
  thanks:"Five doses of antidote, good against the silver poison and the cold fever. And this. The Sovereign has not drunk from that cup in a hundred years. It is not for drinking, it is for being seen to be drunk from. That is all I will say, and I have said more than I should.",
  after:"I still taste everything before I swallow it. It is a hard habit to lose.",
  done:()=>{psdGive('psantidote',4);pspF().sovereignLore=1}});
/* ---------- the doors of the cells ---------- */
function psdApplyCells(){
  const L=LEVELS[LEVEL];if(!L||!psdIs(LEVEL))return;const F=psdF();
  for(const list of [L.decor,G.decor||[]])for(const d of list)if(d.npc&&d.npc.startsWith('psd_cell')&&F.cell[d.npc.slice(8)]){d.found=true;d.block=false;d.solid=0}}
function psdOpen(key,quiet){const F=psdF();F.cell[key]=1;psdApplyCells();if(!quiet){sfx('door');msg('The cell door swings open.','#d8d0e8')}}
function psdGateTalk(key,d){
  const c=PSD.cells[key],F=psdF();if(!c)return say('A cell door.',[BYE]);
  if(c.who){const n=NPCS[c.who];if(!F.cell[key])psdOpen(key);return n.root({k:khFaceKey(n.img),x:d.x,y:d.y,npc:c.who})}
  if(F.cell[key])return say('The cell door stands open.',[BYE]);
  psdOpen(key);return gySay(c.note||'The cell is empty.',[BYE])}
/* ---------- the chest with the tin, the Name Stones, the valve wheels ---------- */
khNpc('psd_tinchest','The Questioner\'s chest','chest',()=>{const F=psdF();
  if(F.tinTaken||bagCount('pstin'))return gySay("The chest holds the Questioner's things: a roll of cloth with a row of small bright knives in it, a hood, a list of names with most of them struck out. Nothing of Garrick's is left.",[BYE]);
  F.tinTaken=1;psdGive('pstin',1);sfx('key');msg("You take Garrick's tin.",'#ffe36a');
  return gySay("The chest is full of other people's belongings, each tied up in a little cloth with a number. One is a round tin, dented, the lid tied down with red string. It rattles. You take it.",[BYE])});
const PSD_STONE=[
 "A block of stone in the wall, and cut into it with the handle of a spoon: ORRIC TAM, MILLER. NELL ASHE. TOBY, AND TOBY'S DOG. Under it, smaller: THE DOG WAS LET OUT. HE WAS A GOOD DOG.",
 "Names, cut very small: WYN FELLOWES, TINKER. THE TWO BRAND BROTHERS. And one more, scratched over twice: I HAD A NAME ONCE. IT WAS ENOUGH TO GET ME HERE.",
 "Names scratched round a cell window: SISTER AGNES, WHO SANG TO THE OTHERS. MASTER PELL, CLOCKMAKER. JOSS, AGED NINE, WHO IS NOT IN TROUBLE, HE ONLY FELL IN.",
 "Four names in one hand: HOLLIN, MERROW, DANE, KESTREL. Then: WE WERE THE NIGHT WATCH. WE SAID THE KING WAS NOT WELL. WE WERE RIGHT.",
 "NAMES OF THE LOST. Hundreds of names, cut over each other until the stone is nothing but names. Near the bottom, newer and very clear: IF YOU ARE READING THIS, SAY THEM. THEY WERE ALL SOMEBODY."];
for(let i=0;i<5;i++)khNpc('psd_stone'+i,i===4?'The Names of the Lost':'A Name Stone','gy_nameplate',()=>{const F=psdF(),first=!F.stone[i];F.stone[i]=1;
  if(first){sfx('key');msg('You read a Name Stone. '+psdStones()+' of 5.','#ffe36a');if(psdStones()===5)msg('That is all five Name Stones. Speak the names at the altar of the chapel.','#ffe36a')}
  return gySay(PSD_STONE[i]+(first?'':' (Read already.)'),[BYE])});
/* the valve wheels: SOUTH (1), then WEST (0), then EAST (2); the third turned lets the Gaoler rise */
const PSD_WN=['WEST','SOUTH','EAST'],PSD_ORDER=[1,0,2];
for(let i=0;i<3;i++)khNpc('psd_wheel'+i,'A valve wheel','gy_rune',()=>{const F=psdF();
  if(F.wheelsDone)return gySay('The wheel is turned all the way. Far below, water is running away down a drain.',[BYE]);
  if(F.wheel.includes(i))return gySay('The '+PSD_WN[i].toLowerCase()+' wheel is already turned. '+F.wheel.length+' of 3.',[BYE]);
  return gySay('A great iron valve wheel, rusted dull red. A plate under it reads: THE '+PSD_WN[i]+' WHEEL. '+(F.wheel.length?F.wheel.length+' of 3 turned in the right order.':'None has been turned yet.'),[['Turn the wheel.',()=>psdTurn(i)],['Leave it.',()=>null]])});
function psdTurn(i){
  const F=psdF(),want=PSD_ORDER[F.wheel.length];
  if(i===want){F.wheel.push(i);sfx('door');G.shake=.3;
    if(F.wheel.length===3){F.wheelsDone=1;F.gaoler=1;F.ghp=1;msg('The third wheel turns. Every pipe in the cistern groans, and the water begins to move.','#a8d0f0');later(900,psdGaolerRise);
      return gySay('The east wheel turns, stiff, then easy. Far below you the whole cistern draws a long breath. Then the water in the middle of the tank begins to heave.',[BYE])}
    msg('The wheel turns with a long grinding squeal. '+F.wheel.length+' of 3.','#a8d0f0');return gySay('The wheel turns, and somewhere in the pipes something clunks and holds. '+F.wheel.length+' of 3.',[BYE])}
  F.wheel=[];sfx('growl');G.shake=.5;msg('Wrong order. Every wheel springs back, and the pipes scream.','#d09a80');
  const fr=gyFreeAround({x:G.P.x,y:G.P.y},4);for(let n=0;n<2&&n<fr.length;n++){addEnemy('psleech',fr[n][0],fr[n][1],true);const m=G.enemies[G.enemies.length-1];if(m){m.lvl=LEVELS[LEVEL].diff;m.psdAdd=1}}
  return gySay('That was the wrong wheel. The pipes shriek, every wheel in the cistern spins back to where it began, and two leeches the size of forearms come swimming up the nearest shallows.',[BYE])}
function psdGaolerRise(){
  if(LEVEL!==9790)return;const fr=gyFreeAround({x:G.P.x,y:G.P.y},7).filter(f=>f[2]>=4);if(!fr.length)return;
  const f=fr[Math.min(fr.length-1,3)];addEnemy('psdrowngaoler',f[0],f[1],true);const m=G.enemies[G.enemies.length-1];
  if(m){m.lvl=103;m.base=103;m.fixed=LEVEL;m.maxhp=enemyStat('psdrowngaoler',103).hp;m.hp=m.maxhp;m.psPh=0;m.psSum=0}
  sfx('growl');G.shake=.5;msg('A huge shape stands up out of the water, wrapped in chains, with a ring of keys at its belt. "Nobody leaves," it says, as it has said for a hundred years.','#a8d0f0')}
/* ---------- the three bosses: moves, helpers at two thirds and one third, what they leave ---------- */
const PSD_BOSS={
 psquestioner:{moves:[{every:3,mult:1.2,near:2,affl:'bleeding',txt:'The Questioner lifts a glowing iron out of the brazier and lays it across the front hero, quite gently. "A few questions," he says, in the voice of a clerk reading a list.',col:'#f0c8c0',verb:'The hot iron burns'},{every:5,all:true,mult:.5,affl:'shaken',txt:'He lets go of a chain, and every hook and weight in the room swings. The screaming that was in the walls comes out all at once.',col:'#e0d0f0',verb:'The screaming hurts'}],help:['psflayed','Two Flayed Prisoners tear loose from the wall chains, wailing.']},
 psdrowngaoler:{moves:[{every:3,mult:1.35,near:2,affl:'shaken',txt:'The Drowned Gaoler swings a chain with a padlock on the end. It has locked a great many doors.',col:'#c0d8f0',verb:'The chain hits'},{every:5,all:true,mult:.6,affl:'tomblung',txt:'He opens his mouth and the cistern comes out of it, cold, in a roar. Every hero is soaked and coughing.',col:'#a8d0f0',verb:'Cold water drowns'}],mend:[8,.03,'Water runs back into the wounds in his chest.'],help:['psdrowned','Two drowned prisoners climb out of the tank, still in their chains.']},
 pshunger:{moves:[{every:3,mult:1.35,near:3,affl:'bleeding',txt:'The Hunger lunges, and the mouth along its front closes on the front hero. It does not chew. It simply takes.',col:'#e8c8f0',verb:'The mouth closes on'},{every:4,all:true,mult:.6,affl:'cursed',txt:'The whole pit breathes in. Every hero feels something go out of them, very small, and not come back.',col:'#e8d0f8',verb:'The hunger drains'}],mend:[9,.03,'The bones of the pit crumble, and the pale mass draws them in.'],help:['psbonecrawl','Bone crawlers pour down out of the walls of the pit to feed it.']}};
for(const t in PSD_BOSS)ENEMY_DEF[t].act=e=>{if(e.hp<=0)return 0;return gyBossAct(e,PSD_BOSS[t])};
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  const def=e&&ENEMY_DEF[e.t],isB=!!(def&&def.psdb&&e.hp>0),stew=!!(e&&e.t==='psteward'&&e.hp>0);
  _he.apply(this,arguments);
  try{
    if(stew&&e.hp<=0)pspF().stewardDead=1;
    if(isB){
      if(e.hp>0&&e.t==='psdrowngaoler'){psdF().ghp=e.hp/Math.max(1,e.maxhp)}
      if(e.hp<=0){psdBossDied(e);return}
      const step=Math.min(2,Math.floor((1-e.hp/e.maxhp)*3));if(e.psSum===undefined)e.psSum=Math.min(2,Math.max(0,Math.floor((1-(e.hp+dmg)/e.maxhp)*3)));
      while(e.psSum<step){e.psSum++;const H=PSD_BOSS[e.t].help,fr=gyFreeAround(e,4);if(H&&fr.length){for(let n=0;n<2&&n<fr.length;n++){addEnemy(H[0],fr[n][0],fr[n][1],true);const m=G.enemies[G.enemies.length-1];if(m){m.psdAdd=1;m.lvl=LEVELS[LEVEL].diff}}msg(H[1],'#d8d0e8');sfx('growl')}}}
  }catch(x){console.error('psd boss hurt',x)}}}
function psdBossDied(e){
  const F=psdF(),t=e.t;for(const q of G.enemies)if(q.hp>0&&q.psdAdd){q.hp=0;q.dying=.4}
  if(t==='psquestioner'){F.questionerDead=1;sfx('win');msg('The Questioner folds up like a coat. The iron rings on the floor, and the room is quiet for the first time in a long while.','#ffe36a')}
  else if(t==='psdrowngaoler'){F.gaoler=2;sfx('win');msg('The Drowned Gaoler goes down in a rush of dark water, and the ring of keys sinks with him. The cistern begins, slowly, to drain.','#ffe36a');later(1400,()=>msg('Somewhere above, Mother Sedge is calling that her cell is dry.','#a8d0f0'))}
  else if(t==='pshunger'){F.hungerDead=1;sfx('win');msg('The Hunger comes apart into pale dust and a great many bones. The pit is only a pit. A chest stands at its edge.','#ffe36a')}}
/* the chest of the pit and the other chests: potions, mana, gear and gold, better the deeper the floor */
{const _lf=lootFor;lootFor=function(d){
  if(psdIs(LEVEL)&&d&&(d.k==='gy_chest'||d.k==='chest')){
    const r=q=>hash2(d.x,d.y,700+q+LEVEL),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})},k=Math.max(0,LEVEL-9780)/10;
    for(let q=0;q<2+(k>0?1:0);q++)add(potionFor(r(10+q)),1);add('supermana',1+(k>0?1:0));if(r(2)<.6)add('elixir',1);
    for(let q=0;q<1+(k>1?1:0);q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}
    if(typeof ringFor==='function'&&r(3)<.5)add(ringFor(r(4),102+k));
    d.gold=(d.goldAmt||0)||3000+k*700+Math.floor(r(5)*2600);return items}
  return _lf.apply(this,arguments)}}
/* ---------- arrival: first-visit lines, the cells that were opened, the flood that was drained, a saved fight ---------- */
function psdPrep(n){   // before the level loads: Cell Block B is dry once the wheels are done
  const F=psdF();if(n===9790&&F.wheelsDone&&LEVELS[n]&&!LEVELS[n]._drained){const L=LEVELS[n];L._drained=1;L.fmap=L.fmap.map((r,y)=>y<=23?r.split('').map((c,x)=>c==='5'&&x<=45?'2':c).join(''):r)}}
function psdArrive(n){
  const F=psdF();psdApplyCells();
  if(!F['seen'+n]){F['seen'+n]=1;const t={9780:'The Undercroft Gaols. Cold stone, wet cobbles, and somewhere a chain being dragged very slowly.',9790:'The Deep Cells. The air is cold and smells of old water. Every wall is wet.',9800:'The Oubliette. The shaft closes over your head. There is no stair down from here, only the pit.'}[n];later(700,()=>msg(t,'#cfc8e8'))}
  if(n===9790&&F.gaoler===1&&!G.enemies.some(e=>e.t==='psdrowngaoler'&&e.hp>0)){
    const fr=gyFreeAround({x:G.P.x,y:G.P.y},8).filter(f=>f[2]>=4);if(fr.length){const f=fr[0];addEnemy('psdrowngaoler',f[0],f[1],true);const m=G.enemies[G.enemies.length-1];
      if(m){m.lvl=103;m.base=103;m.fixed=LEVEL;m.maxhp=enemyStat('psdrowngaoler',103).hp;m.hp=Math.max(1,Math.ceil(m.maxhp*(F.ghp===undefined?1:F.ghp)));m.psSum=m.psPh=Math.min(2,Math.floor((1-m.hp/m.maxhp)*3))}}}}
/* the altar of the chapel and the empty frame belong to other floors; the dungeon quests only ask the party to stand close and answer a prompt (the owners of those floors may also set the flags: namesSpoken in G.flags.psp.d, framePainted in G.flags.psp) */
{const _u=update;let nt=0;update=function(dt){try{
  if(G.state==='play'&&(nt-=dt)<=0){nt=.6;psdProx()}
  if(psdIs(LEVEL)&&G.state==='play'&&G.decor&&!PSD._ap){PSD._ap=LEVEL;psdApplyCells()}if(PSD._ap&&PSD._ap!==LEVEL)PSD._ap=0}catch(e){console.error('psd update',e)}return _u.apply(this,arguments)}}
function psdNearDecor(rx){return (G.decor||[]).find(d=>rx.test(d.k||'')&&!d.found&&Math.abs(d.x-G.P.x)+Math.abs(d.y-G.P.y)<=2)}
function psdProx(){
  if(G.talk||!G.P)return;const F=psdF(),P=pspF();let alt=false,fr=false;
  if(LEVEL===9760&&qSt('psq34')==='active'&&psdStones()>=5&&!F.namesSpoken){const d=psdNearDecor(/altar/);alt=!!d;if(d&&!PSD.altNear){PSD.altNear=1;
    G.talk={d,n:{name:'The altar'},t:G.time,btns:[],node:say('You have read all five Name Stones, and you know the names. The altar is plain and cold, with a bowl of dry petals on it. This is the place Sister Calpurnia meant.',[['Speak the names aloud.',()=>{F.namesSpoken=1;sfx('win');msg('You speak the names, one after another, and the chapel is very quiet. Down below, a bell seems to ring once.','#ffe36a');return gySay("You say them all. Orric Tam, Nell Ashe, Toby and Toby's dog. Wyn Fellowes. The Brand brothers. Sister Agnes, Master Pell, Joss. Hollin, Merrow, Dane, Kestrel. And the hundreds at the bottom of the Oubliette, which you read as many of as you can. When you stop, the candles on the altar all lean towards you, and then stand straight again.",[BYE])}],['Not yet.',()=>null]])};G.hold=null;G.queued=null}}
  if(!alt)PSD.altNear=0;
  if(LEVEL===9740&&qSt('psq36')==='active'&&F.pots&&!P.framePainted&&bagCount('pspaintbrush')){const d=psdNearDecor(/pt_empty/);fr=!!d;if(d&&!PSD.frameNear){PSD.frameNear=1;
    G.talk={d,n:{name:'The empty frame'},t:G.time,btns:[],node:say('An empty frame, gold, very old, with nothing in it but a little dust on the canvas. Wilhelmina Gaunt left the brush and palette in your hands for this.',[['Paint the frame.',()=>{P.framePainted=1;sfx('win');msg('You paint the frame, slowly, in Gaunt\'s colours.','#ffe36a');try{if(typeof pspFramePainted==='function')pspFramePainted()}catch(e){console.error(e)}return gySay("You mix violet and white and grey, and paint what you see: a small, tired figure in a plain chair, with a crown on the floor beside it. It takes a long time. When you step back the frame is no longer empty, and something clicks behind the wall.",[BYE])}],['Not yet.',()=>null]])};G.hold=null;G.queued=null}}
  if(!fr)PSD.frameNear=0}
/* ---------- sound: drips, a chain, a far moan, rats, running water in the cistern (made with tone and nz) ---------- */
const PSDS={n:{}};
function psdsDrip(v){if(!AC||G.mute)return;const f=800+Math.random()*700;tone(f,f*.6,.12,'sine',.03*v,0);tone(f*.7,f*.5,.14,'sine',.012*v,.1)}
function psdsChain(v){if(!AC||G.mute)return;for(let i=0;i<5;i++){const d=i*(.09+Math.random()*.06);tone(1700+Math.random()*1000,1400,.07,'triangle',.022*v,d)}}
function psdsMoan(v){if(!AC||G.mute)return;const f=150+Math.random()*60;tone(f,f*.75,1.8,'sine',.022*v,0);tone(f*1.5,f*1.2,1.5,'triangle',.009*v,.2);nz(1.5,.004*v,'bandpass',700,400,0)}
function psdsRats(v){if(!AC||G.mute)return;for(let i=0;i<9;i++)nz(.04,.025*v,'highpass',4200,3400,i*.07+Math.random()*.04)}
function psdsWater(v){if(!AC||G.mute)return;nz(2.6,.03*v,'bandpass',500,900,0);nz(2,.015*v,'lowpass',300,200,.4)}
function psdsTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!psdIs(LEVEL)||!SNDOPT.amb)return;
  const now=AC.currentTime,N=PSDS.n,due=(k,lo,hi)=>{if(N[k]===undefined){N[k]=now+Math.random()*hi;return false}if(now<=N[k])return false;N[k]=now+lo+Math.random()*(hi-lo);return true};
  if(due('drip',3,8))psdsDrip(.5+Math.random()*.5);if(due('chain',14,34))psdsChain(.7);if(due('moan',26,60))psdsMoan(.6);if(due('rat',18,40))psdsRats(.7);
  if(LEVEL===9790&&due('wat',6,14))psdsWater(.8);if(LEVEL===9800&&due('deep',30,60))psdsMoan(.9)}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{psdsTick()}catch(e){console.error('psds',e)}}}
/* ---------- the rings of the quest log (gold ! over the giver, circles where to go) ---------- */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),X=(l,x,y)=>({lvl:l,xy:[x,y]});
  const gv=(l,id)=>[N(l,id,'psd_cell'+Object.keys(PSD.cells).find(k=>PSD.cells[k].who===id))];
  QRF.T.psq30={give:[N(9780,'psd_garrick')],act:()=>psdF().tinTaken?[N(9780,'psd_garrick')]:[N(9780,'psd_tinchest')],ready:[N(9780,'psd_garrick')]};
  QRF.T.psq31={give:[N(9780,'psd_isaude')],act:()=>[N(9780,'psd_isaude')],ready:[N(9780,'psd_isaude')]};
  QRF.T.psq32={give:[N(9780,'psd_peck')],act:()=>[N(9780,'psd_peck')],ready:[N(9780,'psd_peck')]};
  QRF.T.psq33={give:[N(9790,'psd_sedge')],act:()=>{const F=psdF();return !F.wheelsDone?[N(9790,'psd_wheel'+PSD_ORDER[F.wheel.length])]:[E(9790,/^psdrowngaoler$/)]},ready:[N(9790,'psd_sedge')]};
  QRF.T.psq34={give:[N(9790,'psd_calpurnia')],act:()=>{const F=psdF(),o=[];for(let i=0;i<5;i++)if(!F.stone[i])o.push(N(i<2?9780:i<4?9790:9800,'psd_stone'+i));return o.length?o:[N(9790,'psd_calpurnia')]},ready:[N(9790,'psd_calpurnia')]};
  QRF.T.psq35={give:[N(9790,'psd_harrow')],act:()=>[N(9790,'psd_harrow')],ready:[N(9790,'psd_harrow')]};
  QRF.T.psq36={give:[N(9800,'psd_gaunt')],act:()=>[N(9800,'psd_gaunt')],ready:[N(9800,'psd_gaunt')]};
  QRF.T.psq37={give:[N(9800,'psd_stamford')],act:()=>[N(9800,'psd_stamford')],ready:[N(9800,'psd_stamford')]};
  QRF.T.psq38={give:[N(9800,'psd_yseult')],act:()=>[N(9800,'psd_yseult')],ready:[N(9800,'psd_yseult')]}}
/* test helper: the ASCII of a floor (# wall, . floor, D door, o blocked piece, N person, G cell gate, ~ shallow water, W deep water, e creature) and the reach of every square from the arrival with cell gates counted as open */
function psdAscii(id){
  const L=LEVELS[id]||(KH_LAZY[id]&&(KH_LAZY[id](),LEVELS[id]));if(!L)return '';const rows=L.rows.map((r,y)=>r.split('').map((c,x)=>c==='.'?(L.fmap[y][x]==='6'?'W':L.fmap[y][x]==='5'?'~':'.'):'#'));
  for(const [k,gid] of Object.entries(L.chars)){const d=KH_DOOR[gid];if(!d)continue;for(let y=0;y<rows.length;y++)for(let x=0;x<L.rows[y].length;x++)if(L.rows[y][x]===k)rows[y][x]='D'}
  for(const d of L.decor){if(d.k==='sign_gy')continue;const c=d.npc&&d.npc.startsWith('psd_cell')?'G':d.npc?'N':d.block?'o':'-';if(rows[d.y][d.x]==='.'||rows[d.y][d.x]==='~'||rows[d.y][d.x]==='-')rows[d.y][d.x]=c}
  for(const e of L.enemies)rows[e.y][e.x]='e';
  return rows.map(r=>r.join('')).join('\n')}
