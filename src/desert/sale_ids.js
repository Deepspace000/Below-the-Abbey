/* ==========================================================================
   SALE: THE NUMBERS (prefix sa / SA). A grim gothic town of the dead, rated 90, at the end of the (future) Blighted Lands road, west of Wenlock.
   Level ids (all free ranges; see tools/SALE_NOTES.md):
     600        Sale, the town (72 by 72)
     601        The Hollow Cellar (survivors; quest sa4)          602 The Sale Crypt (relic; quest sa9)          603 The Belfry (the boy; quest sa7)
     604 to 619 reserved. 604 to 609 are stubs ("the Blighted Road, not built yet", a way back to Sale) so that a save or a link to them loads; the real road may replace them with
                `saAttachRoad(toLevel, x, y, f)` (see sale_town.js), which makes the east gate of Sale lead there.
     7200 to 7299  rooms behind the doors of Sale (the ten shops, two cottages; 7299 is the Sanctuary, which stays barred, Wren and Aldous Wend will live there later).
   SA.START is where the party arrives from the east gate (the entrance square); SA.EAST is the gate tile itself.
   ========================================================================== */
const SA={ID:600,W:72,H:72,CELLAR:601,CRYPT:602,BELFRY:603,STUBS:[604,605,606,607,608,609],RESERVED:[610,619],H0:7200,H1:7299,SANCT:7299,RATING:90,
  START:{x:67,y:36,f:3},EAST:{x:69,y:36},ROAD:null,ready:false,loading:null};
const saIs=n=>n>=600&&n<=619||n>=7200&&n<=7299;
for(let i=600;i<=619;i++)LEVEL_RATING[i]=90;for(let i=7200;i<=7299;i++)LEVEL_RATING[i]=90;
Object.assign(LEVEL_NAMES,{600:'Sale',601:'The Hollow Cellar',602:'The Sale Crypt',603:'The Belfry of Sale'});
for(const i of SA.STUBS)LEVEL_NAMES[i]='The Blighted Road';
/* the stubs: one small bare room with a way back to the east gate of Sale, built when first asked for (a saved game or a link that names one of these levels) */
function saStubBuild(id){
  if(LEVELS[id])return LEVELS[id];
  const R=khRoom({id:'sastub'+id,name:'The Blighted Road',room:'ruin',keeper:null,enemies:[]},id,{to:SA.ID,x:SA.START.x,y:SA.START.y,f:3});
  const L=R.level;L.diff=90;L.noExtras=true;L.decor=L.decor.filter(d=>!d.npc);L.decor.push({k:'cairn',x:5,y:4,block:true,npc:'sa_stub'});
  saTidy(L,{id});LEVELS[id]=L;return L}
for(const i of SA.STUBS)KH_LAZY[i]=()=>saStubBuild(i);
for(let i=SA.RESERVED[0];i<=SA.RESERVED[1];i++)KH_LAZY[i]=()=>saStubBuild(i);
/* ==========================================================================
   THE TIDY PASS (the castle standard) for every level of Sale (600 to 619, 7200 to 7299) and of the Vault of Maldrake (9670 to 9679). Each builder calls saTidy(L) once on its
   finished level, before anything else sees it:
   1. a free-standing piece inside a wall square steps into the room when the square in front is free, else it goes (the hidden footprint blocks of the Wenlock rooms just go);
      the same piece twice on one square is kept once;
   2. a web is only ever in a real corner: it moves to the nearest open square with two walls (within two squares, one outdoors), hangs flat on one of them under the top of the
      wall (a wall picture, pic with wd), and goes when there is no corner near; the painted web is the graveyard's, cropped (sa_web) so that the stray bone beside it is gone;
   3. a sign whose wall side is open is turned to a real wall of its square, or moved to the nearest square that has one; a sign never sits on a door or a window;
   4. a tapestry or banner standing free beside a wall (hanging in the air half a square in front of it) becomes a flat wall picture on that wall, under its top;
   5. a person boxed in by the hidden footprint of a counter gets the one square in front of them back, so that they can be talked to.
   The pictures that this pass hangs (webs, tapestries) are drawn flush on the wall face and at their own scale (the engine sizes a wall picture by its NPC_H alone): see the
   spriteList wrap below, which only acts on these levels and only on pieces marked _sat.
   ========================================================================== */
const SAT_D4=[[0,-1],[1,0],[0,1],[-1,0]];
const SAT_WALLPIC=/wl2_hall_[01]$|tapestry|banner|portrait|painting|picture|frame|plaque|mirror|kitchenshelf|shrine/i;
const satOn=n=>saIs(n)||(n>=9670&&n<=9679);
function satWeb(){
  if(IMG.sa_web)return 'sa_web';const im=IMG.gy_web;if(!im||!im.width)return 'gy_web';
  const x0=Math.round(im.width*.2),c=document.createElement('canvas');c.width=im.width-x0;c.height=im.height;c.getContext('2d').drawImage(im,x0,0,c.width,c.height,0,0,c.width,c.height);
  IMG.sa_web=c;NPC_H.sa_web=NPC_H.gy_web||1.2;return 'sa_web'}
/* the engine sizes a wall picture by NPC_H alone (decor.sc is ignored), so a picture hung at a smaller scale gets its own key: the same painting with a smaller NPC_H */
function satKey(k,sc){
  if(!IMG[k]||!sc||Math.abs(sc-1)<.02)return k;const key='sat_'+k+'_'+Math.round(sc*100);
  if(!IMG[key]){IMG[key]=IMG[k];NPC_H[key]=(NPC_H[k]||.6)*sc}return key}
function saTidy(L,o){
  o=o||{};if(!L||!L.rows||!L.decor||L._sat)return L&&L._sat;
  const W=L.rows[0].length,H=L.rows.length,rep={moved:0,inwall:0,dup:0,web:0,webGone:0,sign:0,signGone:0,pic:0,npc:0};L._sat=rep;
  const inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H,open=(x,y)=>inb(x,y)&&L.rows[y][x]==='.';
  const gid=(x,y)=>{const c=L.rows[y][x];return L.chars&&L.chars[c]!==undefined?L.chars[c]:undefined};
  const winG=new Set();try{if(typeof BGR_WIN!=='undefined')for(const g in BGR_WIN)winG.add(+g);if(typeof WLIN_WIN!=='undefined')for(const k in WLIN_WIN)if(WLIN_WIN[k]!==null)winG.add(WLIN_WIN[k])}catch(e){}
  const isDoor=(x,y)=>{const g=gid(x,y);return g!==undefined&&((typeof KH_DOOR!=='undefined'&&!!KH_DOOR[g])||(g>=30&&g<100))};
  const isWall=(x,y)=>inb(x,y)&&!open(x,y)&&!isDoor(x,y);
  const isWin=(x,y)=>{const g=gid(x,y);return g!==undefined&&winG.has(g)};
  let ceil=L.ceilH||2.2;try{if(o.id!==undefined&&typeof ceilFor==='function')ceil=ceilFor(o.id,L)||ceil}catch(e){}
  const wallH=(x,y)=>{try{const t=TEX[T_TILE[gid(x,y)]];if(t&&t.wh)return Math.min(t.wh,o.town?99:ceil)}catch(e){}return ceil};
  const isWeb=d=>/(^|_)web/i.test(String(d.k))&&!d.npc;
  // 1. pieces in wall squares, and twins
  const solidAt=new Set();for(const d of L.decor)if(d.block&&!d.pic&&Number.isInteger(d.x)&&Number.isInteger(d.y))solidAt.add(d.x+','+d.y);
  const seen=new Set(),keep=[];
  for(const d of L.decor){
    if(!Number.isInteger(d.x)||!Number.isInteger(d.y)){keep.push(d);continue}
    const key=d.k+'|'+d.x+','+d.y+'|'+(d.pic?1:0)+'|'+(d.wd?d.wd.join(','):'')+'|'+(d.npc||'');
    if(seen.has(key)){rep.dup++;continue}seen.add(key);
    if(!d.pic&&!d.wd&&!d.npc&&inb(d.x,d.y)&&!open(d.x,d.y)&&!isDoor(d.x,d.y)){
      if(d.hidden||isWeb(d)){rep.inwall++;continue}
      const n=SAT_D4.map(([a,b])=>[d.x+a,d.y+b]).find(([a,b])=>open(a,b)&&!solidAt.has(a+','+b)&&!keep.some(e=>e.x===a&&e.y===b&&!e.pic&&!e.hidden));
      if(n){solidAt.delete(d.x+','+d.y);d.x=n[0];d.y=n[1];if(d.block)solidAt.add(n[0]+','+n[1]);rep.moved++}else{rep.inwall++;continue}}
    keep.push(d)}
  L.decor=keep;
  // the wall faces that already hold a picture or a sign (webs may share)
  const face=new Set();const fk=(x,y,w)=>x+','+y+','+w[0]+','+w[1];
  for(const d of L.decor)if(d.wd&&(d.pic||d.txt)&&!isWeb(d))face.add(fk(d.x,d.y,d.wd));
  const ring=(x,y,r,fn)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const v=fn(x+dx,y+dy);if(v)return v}return null};
  // 2. webs into corners
  const R=o.town?1:2,wk=satWeb(),out=[];
  for(const d of L.decor){
    if(!isWeb(d)||(d.pic&&d.wd&&isWall(d.x+d.wd[0],d.y+d.wd[1]))){out.push(d);continue}
    let best=null;
    for(let r=0;r<=R&&!best;r++)best=ring(Math.round(d.x),Math.round(d.y),r,(x,y)=>{if(!open(x,y))return null;const w=SAT_D4.filter(([a,b])=>isWall(x+a,y+b)&&!isWin(x+a,y+b));
      if(w.length<2||!w.some(q=>q[0])||!w.some(q=>q[1]))return null;const pick=w.find(q=>!face.has(fk(x,y,q)))||w[0];return [x,y,pick]});
    if(!best){rep.webGone++;continue}
    const [x,y,wd]=best,kk=satKey(wk,Math.min(d.sc||.55,.6)),h=NPC_H[kk]||.66;delete d.sc;
    Object.assign(d,{k:kk,x,y,wd:[wd[0],wd[1]],pic:1,block:false,walk:true,deco:true,_sat:1,bob:Math.max(.15,Math.min(1.75,wallH(x+wd[0],y+wd[1]))-h-.03)});   // under the top of the wall, and never so high that the party cannot see itdelete d.solid;delete d.hidden;
    rep.web++;out.push(d)}
  L.decor=out;
  // 3. signs on real walls
  const sgOut=[];
  for(const d of L.decor){
    if(!(d.txt&&d.wd)||!Number.isInteger(d.x)||!Number.isInteger(d.y)||(isWall(d.x+d.wd[0],d.y+d.wd[1])&&!isWin(d.x+d.wd[0],d.y+d.wd[1]))){sgOut.push(d);continue}
    face.delete(fk(d.x,d.y,d.wd));let best=null;
    for(let r=0;r<=2&&!best;r++)best=ring(d.x,d.y,r,(x,y)=>{if(!open(x,y))return null;const dirs=[d.wd].concat(SAT_D4.filter(q=>q[0]!==d.wd[0]||q[1]!==d.wd[1]));
      const w=dirs.find(q=>isWall(x+q[0],y+q[1])&&!isWin(x+q[0],y+q[1])&&!face.has(fk(x,y,q)));return w?[x,y,w]:null});
    if(!best){rep.signGone++;continue}
    d.x=best[0];d.y=best[1];d.wd=[best[2][0],best[2][1]];face.add(fk(d.x,d.y,d.wd));rep.sign++;sgOut.push(d)}
  L.decor=sgOut;
  // 4. lifted wall pieces become wall pictures
  for(const d of L.decor){
    if(d.pic||d.wd||d.npc||d.lk||!SAT_WALLPIC.test(String(d.k))||!IMG[d.k])continue;
    const ok=(x,y,a,b)=>open(x,y)&&isWall(x+a,y+b)&&!isWin(x+a,y+b)&&!face.has(fk(x,y,[a,b]));
    let at=null;
    for(const [a,b] of SAT_D4){if(!isWall(d.x+a,d.y+b))continue;   // the wall it hangs beside; over a window or a taken face it slides along the wall
      for(const t of [0,1,-1,2,-2]){const x=d.x+(a?0:t),y=d.y+(b?0:t);if(ok(x,y,a,b)){at=[x,y,a,b];break}}if(at)break}
    if(!at)continue;
    const top=wallH(at[0]+at[2],at[1]+at[3])-.04;let sc=d.sc||1,hh=(NPC_H[d.k]||1)*sc;
    if(hh>top-.04){sc*=(top-.04)/hh;hh=(NPC_H[d.k]||1)*sc}   // a hanging taller than the wall is made to fit under its top
    d.k=satKey(d.k,sc);delete d.sc;d.x=at[0];d.y=at[1];d.pic=1;d.wd=[at[2],at[3]];d.block=false;d.walk=true;d._sat=1;d.bob=Math.max(0,Math.min(d.bob||0,top-hh));
    face.add(fk(d.x,d.y,d.wd));rep.pic++}
  // 5. people boxed in by hidden footprint blocks
  if(L.start){
    const reach=()=>{const bs=new Set();for(const d of L.decor)if((d.block||d.solid)&&!d.pic&&Number.isInteger(d.x))bs.add(d.x+','+d.y);
      const s=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of SAT_D4){const nx=x+a,ny=y+b,k=nx+','+ny;if(s.has(k)||!open(nx,ny)||bs.has(k))continue;s.add(k);q.push([nx,ny])}}return s};
    let S=reach();
    for(const p of L.decor){if(!p.npc||p.pic||p.hidden||!Number.isInteger(p.x))continue;const nb=SAT_D4.map(([a,b])=>[p.x+a,p.y+b]);if(nb.some(([x,y])=>S.has(x+','+y)))continue;
      for(const [x,y] of nb){const hid=L.decor.filter(e=>e.hidden&&e.x===x&&e.y===y);if(!hid.length)continue;if(!SAT_D4.some(([a,b])=>S.has((x+a)+','+(y+b))))continue;
        L.decor=L.decor.filter(e=>!hid.includes(e));rep.npc++;S=reach();break}}}
  return rep}
/* the pictures this pass hung lie flush on the wall face (.497 of a square from the middle, as in the castle) and at their own scale */
{const _sl=spriteList;spriteList=function(){const out=_sl.apply(this,arguments);
  try{if(typeof LEVEL!=='undefined'&&satOn(LEVEL))for(const s of out){const d=s.decor;if(!d||!d._sat||!s.pic||!d.wd)continue;
    s.x=d.x+.5+d.wd[0]*.497;s.y=d.y+.5+d.wd[1]*.497}}catch(e){console.error('sale tidy sprites',e)}
  return out}}
