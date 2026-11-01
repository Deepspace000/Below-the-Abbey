/* ==========================================================================
   SECRET WALLS (prefix sr / SR). Every maze and every dungeon of moderate size or more hides a few small rooms behind a suspicious wall square, the way the
   crypts below the Abbey (level 1, early_polish.js) already do. The same mechanism opens them: walking into the wall (W, Up, the arrow, the pad), the attack
   or use key, or a click opens it for good (G.flags.ep_sec[id]); standing beside one brings a draught message. Level 1 keeps its own four rooms (EP_SECRETS).
   How it is made, for any level:
     - the plan (srPlan) is worked out once per session from the level's pristine rows, with a seed made of the level number only, so it is the same on every
       visit: the door is a plain wall square at the end of a straight run of corridor (a wall the party walks up to and faces), the room is 2x2 to 3x3 behind it,
       cut out of solid rock with a wall all round it (nothing but its own door touches it), away from stairs, portals, people, props, items and creatures.
       Mazes have walls one square thick, so a room that finds no rock inside the level is cut into a margin of solid wall that is added to the right or the
       bottom of the map (the squares of the level never move, and no open square of the original level changes).
     - the rooms stay solid in the level's rows and are hollowed out of G.grid on each visit (srApply, as level 1 does); only the chests are in the level's decor.
     - the sealed wall keeps the level's own wall picture; srSusFor makes the odd block, the crack and the dust from that picture's own pixels (so it takes the
       palette of any wall: stone, brick, hedge, comb), and the engine draws it through SR_CT (one line in the wall pass).
     - a chest in every room: 1 to 2 health potions and 1 to 2 mana potions (2 to 4 in all), sometimes a little gold, and one surprise item that fits the level's rating.
     - one room in four (by design: room number j of a level has a creature when j mod 4 equals a number taken from the level's number) holds a creature of the
       level's own roster, woken when the wall opens; whether it was killed is kept in G.flags.sr_mon.
   Which levels: SR_BIG (moderate or larger) and, for about half of the small desert dungeons (the burrows 50 to 59 and the DNG_INFO dungeons), a hash decides.
   ========================================================================== */
const SR_BIG=[18,21,39,40,42,65,104,107,114,117,124,127,134,137,144,147,260,449,450,471,472,473,474,475,476,477,497,498,499,500,502,532,533,534,535,9673,9674,9675];
const SR_ROOMS={},SR={gd:null,lv:0,tex:{},live:[],ok:{}};
self.SR_ROOMS=SR_ROOMS;self.SR_CT=new Map();
const srUnique=['boss','gandrick','mayor','overseer','halbrecht','wraith','sut','firelizard','cyclops','pharaohboss'];
const srPlain=v=>v===1||v===2||(v>=9&&v<=14)||(v>=20&&v<=22)||(v>=100&&!(typeof KH_DOOR!=='undefined'&&KH_DOOR[v]));
const srRating=n=>(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[n])||(LEVELS[n]&&LEVELS[n].diff)||n;
/* the grid values of the rows, exactly as reset() makes them */
function srGrid(L){const R=L.rows,ch=L.chars||{},g=[];for(let y=0;y<R.length;y++){const r=[];for(let x=0;x<R[0].length;x++){const c=R[y][x];r.push(ch[c]!==undefined?ch[c]:(c==='.'||c==='t')?0:c==='D'?3:c==='L'?4:c==='X'?5:c==='%'?2:c==='T'?6:c==='G'?7:c==='C'?8:WALLCH[c]!==undefined?WALLCH[c]:1)}g.push(r)}return g}
function srKindOf(n,L,open){if(n===1||!L||!L.rows||!L.rows.length||L.outdoor||(typeof TERRS!=='undefined'&&TERRS[n]))return null;if(SR_BIG.includes(n))return 'big';
  const little=(n>=50&&n<=59)||(typeof DNG_INFO!=='undefined'&&DNG_INFO[n]);if(little&&open>=85&&open<400&&hash2(n,5,901)<.5)return 'little';return null}
/* the plan of one level: {rooms, ext:[right,bottom]} (or null) */
function srPlan(n,L){
  const R=L.rows,H=R.length,W=R[0].length,g=srGrid(L);let open=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]===0)open++;
  const kind=srKindOf(n,L,open);if(!kind)return null;
  const MG=8,at=(x,y)=>x<0||y<0||x>=W+MG||y>=H+MG?-1:(x>=W||y>=H)?1:g[y][x],plain=(x,y)=>srPlain(at(x,y));
  const want=kind==='big'?Math.max(2,Math.min(6,Math.round(open/600))):(hash2(n,6,903)<.4?2:1);
  const occ=new Set(),haz=[];
  for(const d of L.decor||[]){occ.add(Math.round(d.x)+','+Math.round(d.y));if(d.npc||d.enter||d.opens||d.lockedBy||d.k==='teleporter'||d.secret||d.shop)haz.push([Math.round(d.x),Math.round(d.y)])}
  for(const e of L.enemies||[]){occ.add(e.x+','+e.y);haz.push([e.x,e.y])}
  for(const i of L.items||[]){occ.add(i.x+','+i.y);haz.push([i.x,i.y])}
  haz.push([L.start.x,L.start.y]);
  try{if(typeof teleSpot==='function'){const t=teleSpot(n);if(t&&t.x!==undefined)haz.push([t.x,t.y])}}catch(e){} // the stone teleporter is put in by reset(), not listed in the decor
  const special=(x,y)=>{for(let b=-2;b<=2;b++)for(let a=-2;a<=2;a++){const v=at(x+a,y+b);if(v>0&&!srPlain(v))return true}return false};
  const near1=(x,y,r)=>haz.some(h=>Math.abs(h[0]-x)<=r&&Math.abs(h[1]-y)<=r);
  const cand=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!==0||occ.has(x+','+y)||near1(x,y,1))continue;
    for(let f=0;f<4;f++){const dx=DIRS[f][0],dy=DIRS[f][1],Dx=x+dx,Dy=y+dy,px=-dy,py=dx;
      if(!plain(Dx,Dy)||at(x-dx,y-dy)!==0||occ.has(Dx+','+Dy)||!plain(Dx+px,Dy+py)||!plain(Dx-px,Dy-py)||special(Dx,Dy))continue;
      const sizes=[[2,2],[3,2],[2,3],[3,3]],so=(hash2(Dx,Dy,n*7+1)*4)|0;let done=null;
      for(let si=0;si<4&&!done;si++){const [w,d]=sizes[(si+so)%4],co=(hash2(Dx,Dy,n*7+2)*w)|0;
        for(let ci=0;ci<w&&!done;ci++){const c=(ci+co)%w,cells=[],inR=new Set();let ok=true;
          for(let k=0;k<d&&ok;k++)for(let j=0;j<w;j++){const cx=Dx+dx*(k+1)+px*(j-c),cy=Dy+dy*(k+1)+py*(j-c);if(cx<1||cy<1||!plain(cx,cy)){ok=false;break}cells.push([cx,cy]);inR.add(cx+','+cy)}
          if(!ok)continue;const ring=new Set();
          for(const [cx,cy] of cells)for(const [a,b] of DIRS){const rx=cx+a,ry=cy+b,k=rx+','+ry;if(inR.has(k)||(rx===Dx&&ry===Dy))continue;if(!plain(rx,ry)){ok=false;break}ring.add(k)}
          if(ok)done={w,d,c,cells,ring}}}
      if(!done)continue;let nb=0;for(const [a,b] of DIRS)if(at(x+a,y+b)===0)nb++;
      cand.push({D:[Dx,Dy],F:[x,y],f,dir:[dx,dy],px,py,w:done.w,d:done.d,c:done.c,cells:done.cells,ring:done.ring,score:hash2(Dx,Dy,n*7+3)-(nb===1?.3:0)})}}
  cand.sort((a,b)=>a.score-b.score);
  const rooms=[],claim=new Set(),claimRing=new Set();
  for(const dmin of [12,7,3]){for(const q of cand){if(rooms.length>=want)break;if(rooms.includes(q))continue;
      if(rooms.some(r=>Math.abs(r.D[0]-q.D[0])+Math.abs(r.D[1]-q.D[1])<dmin))continue;
      const own=[q.D[0]+','+q.D[1],...q.cells.map(c=>c[0]+','+c[1])];
      if(own.some(k=>claim.has(k)||claimRing.has(k))||[...q.ring].some(k=>claim.has(k)))continue;
      if(Math.abs(q.F[0]-L.start.x)+Math.abs(q.F[1]-L.start.y)<5)continue;
      for(const k of own)claim.add(k);for(const k of q.ring)claimRing.add(k);rooms.push(q)}}
  if(!rooms.length)return null;
  rooms.sort((a,b)=>a.D[1]-b.D[1]||a.D[0]-b.D[0]);
  let mx=W-1,my=H-1;for(const q of rooms){for(const k of [...q.ring,...q.cells.map(c=>c[0]+','+c[1])]){const [x,y]=k.split(',').map(Number);if(x>mx)mx=x;if(y>my)my=y}}
  const ext=[mx>W-1?mx+2-W:0,my>H-1?my+2-H:0];
  // the creature of the level's own roster (never a boss), the level it normally appears at
  const cnt={},lv={};for(const e of L.enemies||[]){if(srUnique.includes(e.t))continue;cnt[e.t]=(cnt[e.t]||0)+1;if(e.lvl)lv[e.t]=e.lvl}
  const roster=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]||(a<b?-1:1));
  if(!roster.length&&((n>=50&&n<=59)||(n>=100&&n<=151)))roster.push('dskeleton','mummy','scorpion'); // a desert dungeon that holds no creature of its own: the kinds the other desert dungeons hold
  const phi=((n*.6180339887)%1),nm=roster.length?Math.floor(rooms.length*.25+phi):0, // spread evenly over the level numbers, so that over the whole game one room in four has a creature
  monSet=new Set(rooms.map((q,j)=>[j,hash2(n,j,908)]).sort((x,y)=>y[1]-x[1]).slice(0,nm).map(x=>x[0]));
  const out=[];
  rooms.forEach((q,j)=>{const [fx,fy]=q.F,[dx,dy]=q.dir,cellAt=(k,jj)=>[q.D[0]+dx*(k+1)+q.px*(jj-q.c),q.D[1]+dy*(k+1)+q.py*(jj-q.c)];
    const far=q.c===0?q.w-1:0,chest=cellAt(q.d-1,far),monCell=cellAt(q.d-1,q.c),hasMon=monSet.has(j);
    const t=roster.length?roster[(hash2(n,j,905)*Math.min(2,roster.length))|0]:null;
    // one or two props on squares that are not the chest, the creature's square, nor the way in
    const props=[],free=q.cells.filter(c=>!(c[0]===chest[0]&&c[1]===chest[1])&&!(c[0]===monCell[0]&&c[1]===monCell[1])&&!(c[0]===q.D[0]+dx&&c[1]===q.D[1]+dy));
    out.push({id:'s'+n+'_'+j,sr:1,lv:n,j,door:q.D,from:[fx,fy],cells:q.cells,chest,mon:hasMon?{t,lvl:lv[t]||0,x:monCell[0],y:monCell[1]}:null,lamp:free.length?free[(hash2(n,j,906)*free.length)|0]:chest,free,w:q.w,d:q.d})});
  return {rooms:out,ext,kind,open,W,H,want}}
/* adds the margin of solid wall (to the right and the bottom only, so no square of the level moves), once */
function srExtend(L,ext){if(L._srx||(!ext[0]&&!ext[1]))return;L._srx=1;const R=L.rows,H=R.length,W=R[0].length,g=srGrid(L),cnt={};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if((x===0||y===0||x===W-1||y===H-1)&&srPlain(g[y][x]))cnt[R[y][x]]=(cnt[R[y][x]]||0)+1;
  let pad='#',bc=0;for(const c in cnt)if(cnt[c]>bc){bc=cnt[c];pad=c}
  const rows=R.slice().map(r=>r+pad.repeat(ext[0])),NW=W+ext[0];for(let i=0;i<ext[1];i++)rows.push(pad.repeat(NW));L.rows=rows;
  if(Array.isArray(L.fmap)&&L.fmap.length){const fm=L.fmap.map(r=>r+(r[r.length-1]||'0').repeat(ext[0])),lastc=fm[fm.length-1][0];for(let i=0;i<ext[1];i++)fm.push(fm[fm.length-1]);L.fmap=fm;void lastc}}
{const _ll=loadLevel;loadLevel=function(n){
  try{if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();const L=LEVELS[n];
    if(L&&L.rows&&!L._srp){L._srp=1;const P=srPlan(n,L);if(P){L._srPlan=P;srExtend(L,P.ext);SR_ROOMS[n]=P.rooms}}}catch(e){console.error('sr plan',e)}
  const r=_ll.apply(this,arguments);
  try{const L=LEVELS[n];if(L&&L._srPlan&&!L._srD){L._srD=1;const add=L._srPlan.rooms.map(s=>({k:'chest',x:s.chest[0],y:s.chest[1],block:true,kname:'sr_'+s.id}));for(const d of add)L.decor.push(d);if(DECOR_SPAWNS!==L.decor)for(const d of add)DECOR_SPAWNS.push(d)}
    if(L&&L._srPlan&&typeof epLoad==='function')epLoad()}catch(e){console.error('sr decor',e)}
  return r}}
/* the surprise item: one single piece that fits the level's rating, never a quest item (it must have a price and no package or quest mark) */
function srPool(r){if(SR.pool&&SR.pool.r===r)return SR.pool.list;const hi=100+r*r*1.7,lo=hi*.12,kinds=['weapon','head','chest','arms','legs','shield','ring','spell','light'],list=[];
  for(const id of Object.keys(ITEMDEF).sort()){const d=ITEMDEF[id];if(!d||!kinds.includes(d.k)||!(d.price>0)||d.pkg||d.pg||d.quest||d.bf||/^(pg_|ps|bl|vt|wlt_|hgd?key|gy)/.test(id))continue;if(d.price>hi||d.price<lo)continue;if(d.lvl&&d.lvl>r+8)continue;list.push(id)}
  SR.pool={r,list};return list}
function srContents(s,n){const r=srRating(n),ru=k=>hash2(s.chest[0]*7+k,s.chest[1]*5+n,880+k),items=[],add=(id,q)=>{if(!ITEMDEF[id])return;if(ITEMDEF[id].stack)items.push({id,n:q||1});else for(let i=0;i<(q||1);i++)items.push({id,n:1})};
  const hp=1+((ru(1)*2)|0),mp=1+((ru(2)*2)|0);for(let i=0;i<hp;i++)add(healTierFor(r,ru(3+i)),1);
  for(let i=0;i<mp;i++)add(manaTierFor(r,ru(6+i)),1); // the tiers of the level's rating (mana_tiers.js): the best one allowed or the one below, never weaker
  const pool=srPool(r);let sur=null;if(pool.length){sur=pool[(ru(9)*pool.length)|0];add(sur,1)}
  const gold=ru(10)<.5?Math.round((12+r*3.2)*(.7+.6*ru(11))):0;return {items,gold,sur}}
/* the face of the sealed wall: this level's own wall picture, one block a little out of line, a crack round it, dust at its foot */
function srSusFor(ti,s){const key=ti+'_'+s.id;if(SR.tex[key]!==undefined)return SR.tex[key];const T=TEX[ti];if(!T||!T.d||T.e||T.tw||T.d.length%(TS*4)!==0)return SR.tex[key]=ti;
  const HH=T.d.length/(TS*4),k=HH/TS,h1=hash2(s.door[0],s.door[1],41),h2=hash2(s.door[0],s.door[1],42),x0=36+((h1*10)|0),x1=x0+46+((h2*10)|0),y0=Math.round((HH>TS?.40*TS:42+((h2*8)|0))*(HH>TS?1:1)),y1=y0+Math.round((52+((h1*8)|0))*(HH>TS?1:1));
  const yy0=HH>TS?Math.round(HH*(.36+h2*.05)):y0,yy1=HH>TS?Math.round(HH*(.74+h1*.05)):Math.min(y1,112);
  const d=epSusData(T.d,x0,Math.min(x1,118),yy0,yy1,HH),n=addTex(d,null);for(const q of Object.keys(T))if(q!=='d'&&q!=='e')TEX[n][q]=T[q];void k;return SR.tex[key]=n}
/* the rooms of the level just entered: hollowed out of G.grid, chests filled, lights and props, the creature woken or put back, the sealed walls registered */
const srSetF=()=>{const F=G.flags;return F.sr_mon=F.sr_mon||{}};
function srApply(){const list=SR_ROOMS[LEVEL];SR.gd=G.decor;SR.lv=LEVEL;SR.live=[];SR_CT.clear();if(!list||!list.length||!EP.ready)return;
  const F=epSecF(),Mf=srSetF(),n=LEVEL;
  for(const s of list){
    const ch=G.decor.find(d=>d.kname==='sr_'+s.id);
    if(!s.cells.every(([x,y])=>G.grid[y]&&G.grid[y][x]!==undefined&&(G.grid[y][x]===0||srPlain(G.grid[y][x])))||!(G.grid[s.door[1]]&&(G.grid[s.door[1]][s.door[0]]===0||srPlain(G.grid[s.door[1]][s.door[0]])))){s.bad=1;if(ch){ch.hidden=true;ch.block=false;ch.loot=false}continue}
    s.bad=0;for(const [x,y] of s.cells)G.grid[y][x]=0;const [dx,dy]=s.door;if(F[s.id]&&G.grid[dy][dx]!==0)G.grid[dy][dx]=0;
    if(ch){if(!ch.contents){const C=srContents(s,n);ch.contents=C.items;s.sur=C.sur;if(ch.gold===undefined)ch.gold=C.gold}ch.loot=true;ch.srSur=1;if(IMG.ep_chest_s)ch.lk='ep_chest_s'}
    if(!G.decor.some(d=>d.srP===s.id)){srProps(s)}
    if(!F[s.id]){
      const [fx,fy]=s.from,ox=dx-fx,oy=dy-fy;
      for(let f=0;f<4;f++){const key=(dy*MW+dx)*4+f;if(torchAt.has(key)){torchAt.delete(key);const l=LIGHTS.find(q=>q.key===key);if(l)l.taken=true}}
      if(IMG.ep_candles&&!G.decor.some(d=>d.epSecC===s.id))G.decor.push({k:'ep_candles',x:fx,y:fy,ox:ox*.36+(oy?.18:0),oy:oy*.36+(ox?.18:0),sc:.55,block:false,deco:true,loot:false,shop:false,epSecC:s.id});
      if(!LIGHTS.some(l=>l.epSecC===s.id))LIGHTS.push({x:fx+.5+ox*.4,y:fy+.5+oy*.4,ph:hash2(fx,fy,7)*6.28,key:-6000-LIGHTS.length,taken:false,red:false,free:true,lamp:true,calm:false,kI:.42,col:[1.25,.9,.55],range2:5,epSecC:s.id});
      SR_CT.set(dy*MW+dx,s)}
    if(!LIGHTS.some(l=>l.epSec===s.id))LIGHTS.push({x:s.lamp[0]+.5,y:s.lamp[1]+.5,ph:hash2(s.lamp[0],s.lamp[1],3)*6.28,key:-5000-LIGHTS.length,taken:false,red:false,free:true,lamp:true,calm:false,kI:.5,col:[1.2,.86,.56],range2:30,epSec:s.id});
    if(F[s.id]&&s.mon&&Mf[s.id]===1)srSpawn(s)}}
function srTheme(n){return n>=471&&n<=474?['jar','sacks','bucket','candles']:(n===18||n===11)?['orecrate','coalsacks','crates2','barrel2']:(n>=497&&n<=502)||n===477||(n>=532&&n<=535)?['bonepile','jar','potrubble','skel_slump']:n===21||n===260||n===289?['crates2','barrel2','bonepile','chains']:['bonepile','jar','sarc','skel_slump','potrubble']}
function srProps(s){const th=srTheme(s.lv),pick=k=>{const o=th.filter(t=>IMG['ep_'+t]);return o.length?o[(hash2(s.door[0],s.door[1],k)*o.length)|0]:null};
  const a=pick(61),b=pick(62);const put=(k,c,oxx,oyy,sc)=>{if(!k)return;G.decor.push({k:'ep_'+k,x:c[0],y:c[1],block:false,deco:true,loot:false,shop:false,srP:s.id,ox:oxx,oy:oyy,sc:sc||.85})};
  const fr=s.free.slice();if(fr.length){const c=fr[(hash2(s.door[0],s.door[1],63)*fr.length)|0];put(a,c,(hash2(c[0],c[1],64)-.5)*.3,.12,.85);if(fr.length>1&&b&&b!==a){const c2=fr.find(q=>q!==c);put(b,c2,(hash2(c2[0],c2[1],65)-.5)*.3,.12,.8)}}
  // a cobweb high in a corner of the back wall, on a wall face of the room that nothing else uses
  if(IMG.ep_web_corner){const cs=s.cells,tryDirs=DIRS;let done=false;for(const c of cs){if(done)break;for(const [a1,b1] of tryDirs){const wx=c[0]+a1,wy=c[1]+b1;if(G.grid[wy]&&G.grid[wy][wx]>0&&!cs.some(q=>q[0]===wx&&q[1]===wy)&&!(wx===s.door[0]&&wy===s.door[1])){NPC_H.ep_web_corner=.45;G.decor.push({k:'ep_web_corner',x:c[0],y:c[1],wd:[a1,b1],pic:1,bob:.72,block:false,deco:true,loot:false,shop:false,srP:s.id});done=true;break}}}}}
/* the creature of a room, awake at once; put back (still awake) when the party returns and it was neither killed nor beaten */
function srSpawn(s){if(!s.mon||G.enemies.some(e=>e.srRoom===s.id))return;const m=s.mon;addEnemy(m.t,m.x,m.y,true);const e=G.enemies[G.enemies.length-1];e.srRoom=s.id;
  if(m.lvl){e.lvl=m.lvl;const st=enemyStat(m.t,m.lvl);e.hp=e.maxhp=st.hp}SR.live.push(e)}
function srOpened(s){if(!s.mon)return;srSetF()[s.id]=1;srSpawn(s);msg('Something inside the hidden room stirs.','#e8b890')}
/* in the hook of the frame: apply on entering a level, note a creature that was killed */
function srTick(){if(typeof LEVEL==='undefined'||!G.decor||!G.P)return;
  if((SR.gd!==G.decor||SR.lv!==LEVEL)&&EP.ready){try{srApply()}catch(e){console.error('sr apply',e);SR.gd=G.decor;SR.lv=LEVEL}}
  if(SR.live.length){const Mf=srSetF();for(const e of SR.live)if(e.hp<=0&&Mf[e.srRoom]===1){Mf[e.srRoom]=2}}}
{const _dw=drawWorld;drawWorld=function(){try{if(SR_ROOMS[LEVEL]||SR.gd)srTick()}catch(e){}return _dw.apply(this,arguments)}}
/* "Something glints at the bottom of the chest." when the chest of a secret wall is opened (once) */
{const _ol=openLoot;openLoot=function(d){const r=_ol.apply(this,arguments);try{if(d&&d.srSur&&!d.srSurMsg&&G.loot&&G.loot.decor===d){d.srSurMsg=1;msg('Something glints at the bottom of the chest.','#ffe9a0')}}catch(e){}return r}}
