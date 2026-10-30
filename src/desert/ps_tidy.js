/* ps_tidy.js: the castle's housekeeper. Runs once on every castle level after ps_curate.js.
   Every loose free-standing prop (barrels, crates, boxes, sacks, casks, urns, lamps, braziers, candelabra, stools, buckets, baskets) is pushed against a wall:
   it stays where it is only if it already stands against a wall in a roomy place, clear of the main route, the doors and the stairs;
   otherwise it moves to the nearest such spot (never one that would cut a way through, checked by a flood fill), or goes if there is none.
   The report is in LEVELS[id]._tidy. */
const PST_MOVE=/barrel|crate|box|sack|cask|keg|lamp|lantern|brazier|candelabra|candle|(^|_)urn($|_)|vase|stool|bucket|basket|pot\b|jar|tray/i;
const PST_KEEP=/furn_(?!chair|stool)|clock|wardrobe|screen|sideboard|table|chest|door|gate|arch|stair|sign|window|mirror|portrait|hearth|fireplace|bed|altar|statue|st_|col|pillar|tele|fountain|well|tomb|bell/i;
function pstTidy(id,L){
  if(!L||L._tidied||!L.rows)return L;L._tidied=1;
  for(const d of L.decor||[])if(!d.pic&&d.bob>0&&/armour/i.test(String(d.k)))d.bob=0;   // suits of armour stand on the floor
  const W=L.rows[0].length,H=L.rows.length,TB=(typeof TERRS!=='undefined'&&TERRS[id]&&TERRS[id].block)||null;
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.'&&!(TB&&TB[y*W+x]);
  const ORTH=[[1,0],[-1,0],[0,1],[0,-1]];
  const blockAt=new Map();for(const d of L.decor||[])if(d.block&&!d.pic&&!d.deco)blockAt.set(Math.round(d.x)+','+Math.round(d.y),d);
  const foeAt=new Set((L.enemies||[]).map(e=>Math.round(e.x)+','+Math.round(e.y)));
  const anyAt=new Set();for(const d of L.decor||[])if(!d.pic)anyAt.add(Math.round(d.x)+','+Math.round(d.y));
  // key points: the start, every door of this level, every landing into it, the stone
  const keys=[];const add=p=>{if(p&&p[0]!=null){const x=Math.round(p[0]),y=Math.round(p[1]);keys.push([x,y])}};
  const st=L.start||{};add([st.x,st.y]);
  for(const l of PSP.LINKS){if(l.from===id&&l.at)add(l.at);if(l.to===id&&l.land)add(l.land)}
  if(PSP.TELE&&PSP.TELE.id===id)add(PSP.TELE.at);
  const keyNear=(x,y)=>keys.some(k=>Math.max(Math.abs(k[0]-x),Math.abs(k[1]-y))<=2);
  // the route: a plain shortest walk from the start to every key point
  const open2=(x,y)=>open(x,y)&&!(blockAt.has(x+','+y)&&PST_KEEP.test(String(blockAt.get(x+','+y).k)));
  const par=new Int32Array(W*H).fill(-2),s0=keys.find(k=>open(k[0],k[1]))||null;if(!s0)return L;
  const q=[s0[1]*W+s0[0]];par[q[0]]=-1;
  for(let i=0;i<q.length;i++){const v=q[i],x=v%W,y=(v/W)|0;for(const [a,b] of ORTH){const nx=x+a,ny=y+b;if(!open(nx,ny))continue;const nv=ny*W+nx;if(par[nv]!==-2)continue;par[nv]=v;q.push(nv)}}
  const route=new Set();for(const k of keys){const kk=[[0,0],[1,0],[-1,0],[0,1],[0,-1]].map(o=>(k[1]+o[1])*W+k[0]+o[0]).find(v=>v>=0&&v<W*H&&par[v]!==-2);let v=kk;while(v!==undefined&&v>=0&&!route.has(v)){route.add(v);v=par[v]}}
  const onRoute=(x,y)=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(route.has((y+b)*W+x+a))return true;return false};
  // a count of the separate walkable regions and the cells in them: a move is allowed only if it does not split a region (warp doors are not followed, so every region is counted)
  const reach=()=>{const seen=new Uint8Array(W*H);let comps=0,cells=0;for(let s=0;s<W*H;s++){const sx=s%W,sy=(s/W)|0;if(seen[s]||!open(sx,sy)||blockAt.has(sx+','+sy))continue;comps++;const qq=[s];seen[s]=1;for(let i=0;i<qq.length;i++){const v=qq[i],x=v%W,y=(v/W)|0;cells++;for(const [a,b] of ORTH){const nx=x+a,ny=y+b;if(!open(nx,ny)||blockAt.has(nx+','+ny))continue;const nv=ny*W+nx;if(seen[nv])continue;seen[nv]=1;qq.push(nv)}}}return {comps,cells}};
  const wallSide=(x,y)=>ORTH.some(([a,b])=>!open(x+a,y+b));
  const roomy=(x,y)=>ORTH.filter(([a,b])=>open(x+a,y+b)).length>=3;
  const good=(x,y)=>open(x,y)&&!blockAt.has(x+','+y)&&!anyAt.has(x+','+y)&&!foeAt.has(x+','+y)&&wallSide(x,y)&&roomy(x,y)&&!onRoute(x,y)&&!keyNear(x,y);
  // never block a square that is the only way to a neighbour (that would leave it cut off)
  const free=(x,y)=>open(x,y)&&!blockAt.has(x+','+y);
  const keepsNeighbours=(x,y)=>ORTH.every(([a,b])=>{const nx=x+a,ny=y+b;if(!free(nx,ny))return true;let n=0;for(const [c,d] of ORTH)if((nx+c!==x||ny+d!==y)&&free(nx+c,ny+d))n++;return n>=1});
  const rep={kept:0,moved:0,removed:0};let base=reach();
  const items=(L.decor||[]).filter(d=>!d.pic&&!d.deco&&!d.npc&&!d.goldAmt&&!d.psKeep&&!d.tele&&PST_MOVE.test(String(d.k))&&!PST_KEEP.test(String(d.k)));
  const gone=new Set(),P=L._ps||{};
  for(const d of items){const x=Math.round(d.x),y=Math.round(d.y);
    if(good(x,y)||(wallSide(x,y)&&roomy(x,y)&&!onRoute(x,y)&&!keyNear(x,y))){rep.kept++;continue}
    // the square it leaves must stay joined to the walkable floor, or it would be an empty pocket
    const wasB=blockAt.get(x+','+y);blockAt.delete(x+','+y);
    if(!ORTH.some(([a,b])=>free(x+a,y+b))){if(wasB)blockAt.set(x+','+y,wasB);rep.kept++;continue}
    let best=null;
    for(let r=1;r<=14&&!best;r++){const cs=[];for(let b=-r;b<=r;b++)for(let a=-r;a<=r;a++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const cx=x+a,cy=y+b;if(good(cx,cy)&&keepsNeighbours(cx,cy))cs.push([Math.hypot(a,b),cx,cy])}
      cs.sort((m,n)=>m[0]-n[0]);for(const c of cs.slice(0,6)){blockAt.set(c[1]+','+c[2],d);const r=reach();const ok=r.comps<=base.comps;if(ok){best=c;break}blockAt.delete(c[1]+','+c[2])}}
    anyAt.delete(x+','+y);
    if(best){const ol=(L.lights||[]).find(l=>l[0]===x&&l[1]===y);if(ol){ol[0]=best[1];ol[1]=best[2];if(P.lcol&&P.lcol[x+','+y]){P.lcol[best[1]+','+best[2]]=P.lcol[x+','+y];delete P.lcol[x+','+y]}}
      (rep.log=rep.log||[]).push([d.k,x,y,best[1],best[2]]);d.x=best[1];d.y=best[2];anyAt.add(best[1]+','+best[2]);rep.moved++}
    else{gone.add(d);rep.removed++}
    base=reach()}
  if(gone.size)L.decor=L.decor.filter(d=>!gone.has(d));
  L._tidy=rep;return L}
/* every chest, coffer and person of a castle level can be reached: walls that open (hidden doors, closets, niches, warp stairs) are listed in L._secrets and followed;
   where loose furniture still walls a chest or a person off, the pieces on the cheapest way in are taken away (furniture first, columns and statues only if there is no other way). */
const PST_STRUCT=/col|pillar|pier|statue|st_|alcove|stair|tele|fountain|well|tomb|throne|altar|organ/i;
function pstAccess(id,L){
  if(!L||L._access||!L.rows||!L.chars)return;L._access=1;
  const W=L.rows[0].length,H=L.rows.length,TB=(typeof TERRS!=='undefined'&&TERRS[id]&&TERRS[id].block)||null,D4=[[1,0],[-1,0],[0,1],[0,-1]];
  const doorAt=(x,y)=>{const c=L.rows[y]&&L.rows[y][x];if(!c||c==='.')return null;const g=L.chars[c];return g!==undefined&&KH_DOOR[g]?KH_DOOR[g]:null};
  const sec=[],warp=new Map();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const D=doorAt(x,y);if(!D)continue;
    if(D.A||D.B)warp.set(y*W+x,[D.A,D.B].filter(Boolean));
    else if(/secret|closet|niche/.test(String(D.psh||'')+String(D.psw||'')+String(D.psd||'')))sec.push({x,y})}
  L._secrets=sec;const secS=new Set(sec.map(q=>q.y*W+q.x));
  if(TB)for(const v of secS)TB[v]=0;   // the terrace block of an indoor level marks every wall square; a wall that opens must be walkable once it is open
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&(L.rows[y][x]==='.'||secS.has(y*W+x))&&!(TB&&TB[y*W+x]);
  const solid=new Map();for(const d of L.decor||[])if(d.block&&!d.found)solid.set(Math.round(d.y)*W+Math.round(d.x),d);
  const targets=(L.decor||[]).filter(d=>(d.loot||d.goldAmt||(d.npc&&!d.wd)||/chest|coffer/i.test(String(d.k)))&&!d.pic);
  const reach=()=>{const seen=new Uint8Array(W*H),q=[];const push=(x,y)=>{if(open(x,y)&&!solid.has(y*W+x)&&!seen[y*W+x]){seen[y*W+x]=1;q.push(y*W+x)}};
    if(L.start)push(L.start.x,L.start.y);for(const l of PSP.LINKS)if(l.to===id&&l.land)push(l.land[0],l.land[1]);
    for(let i=0;i<q.length;i++){const v=q[i],x=v%W,y=(v/W)|0;for(const [a,b] of D4){const nx=x+a,ny=y+b,w=warp.get(ny*W+nx);if(w)for(const p of w)push(p[0],p[1]);push(nx,ny)}}
    return seen};
  const rep={removed:[]};let seen=reach();
  const near=(d)=>{const x=Math.round(d.x),y=Math.round(d.y);return D4.some(([a,b])=>seen[(y+b)*W+x+a])||!!seen[y*W+x]};
  for(const t of targets){if(near(t))continue;const tx=Math.round(t.x),ty=Math.round(t.y);
    // cheapest way in from the reached floor: a free square costs 0, loose furniture 1, a column or statue 6; people, chests and walls are never crossed
    const cost=v=>{const d=solid.get(v);if(!d)return 0;if(d===t||d.npc||d.loot||d.goldAmt||/chest|coffer/i.test(String(d.k)))return -1;return PST_STRUCT.test(String(d.k))?6:1};
    const dist=new Float64Array(W*H).fill(1e9),prev=new Int32Array(W*H).fill(-1),dq=[];
    for(let v=0;v<W*H;v++)if(seen[v]){dist[v]=0;dq.push(v)}
    for(let it=0;it<dq.length&&it<200000;it++){let bi=it;for(let j=it+1;j<dq.length&&j<it+64;j++)if(dist[dq[j]]<dist[dq[bi]])bi=j;[dq[it],dq[bi]]=[dq[bi],dq[it]];const v=dq[it],x=v%W,y=(v/W)|0;
      for(const [a,b] of D4){const nx=x+a,ny=y+b;if(!open(nx,ny))continue;const nv=ny*W+nx,c=cost(nv);if(c<0)continue;if(dist[v]+c<dist[nv]){dist[nv]=dist[v]+c;prev[nv]=v;dq.push(nv)}}}
    let best=-1;for(const [a,b] of D4){const nv=(ty+b)*W+tx+a;if(open(tx+a,ty+b)&&dist[nv]<1e9&&(best<0||dist[nv]<dist[best]))best=nv}
    if(best<0)continue;
    for(let v=best;v>=0&&!seen[v];v=prev[v]){const d=solid.get(v);if(d){L.decor.splice(L.decor.indexOf(d),1);solid.delete(v);rep.removed.push([d.k,d.x,d.y,'for '+t.k+'@'+tx+','+ty])}}
    seen=reach()}
  L._accessRep=rep}
/* the loose gems of a castle level: placed here (gems.js would scatter them on any open square, also on terrace cells the party cannot step on and in rooms nobody reaches).
   Same count and value spread as gems.js, but only on squares walked to from the start and every landing, off the terraces, away from doors. */
function pstGems(id,L){
  if(!L||L._gems||!L.rows||L.outdoor||(L.day>0)||!(L.enemies||[]).length||typeof GEM_BY_VALUE==='undefined')return;L._gems=1;
  const W=L.rows[0].length,H=L.rows.length,TB=(typeof TERRS!=='undefined'&&TERRS[id]&&TERRS[id].block)||null;
  const blk=new Set();for(const d of L.decor||[])if(d.block)blk.add(Math.round(d.x)+','+Math.round(d.y));
  const walk=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.'&&!(TB&&TB[y*W+x])&&!blk.has(x+','+y);
  const seen=new Uint8Array(W*H),q=[];const push=(x,y)=>{if(walk(x,y)&&!seen[y*W+x]){seen[y*W+x]=1;q.push([x,y])}};
  if(L.start)push(L.start.x,L.start.y);for(const l of PSP.LINKS)if(l.to===id&&l.land)push(l.land[0],l.land[1]);
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])push(x+a,y+b)}
  const taken=new Set();for(const o of [...(L.items||[]),...(L.enemies||[]),...(L.decor||[])])taken.add(Math.round(o.x)+','+Math.round(o.y));
  const st=L.start||{x:1,y:1};let floor=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(L.rows[y][x]==='.')floor++;
  const cnt=Math.max(1,Math.min(7,Math.round(floor/230))),rating=LEVEL_RATING[id]||L.diff||100,skew=Math.min(1,rating/90)*.6;
  const nearDoor=(x,y)=>{for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const c=(L.rows[y+dy]||'')[x+dx];if(c&&c!=='.'&&L.chars&&KH_DOOR[L.chars[c]])return true}return Math.abs(x-st.x)+Math.abs(y-st.y)<6};
  L.items=L.items||[];let placed=0;
  for(let t=0;t<1500&&placed<cnt;t++){const x=1+Math.floor(hash2(t,id,811)*(W-2)),y=1+Math.floor(hash2(t,id,823)*(H-2));
    if(!seen[y*W+x]||taken.has(x+','+y)||nearDoor(x,y))continue;
    const u=hash2(placed,id,839),u2=u*(1-skew)+skew*hash2(placed,id,853),g=GEM_BY_VALUE[Math.min(39,Math.floor(u2*40))];
    taken.add(x+','+y);L.items.push({k:'gem_'+g[0],x,y});placed++}}
{for(const info of PSP.LEVELS){const id=info.id,orig=KH_LAZY[id];if(!orig||orig._pst)continue;
  const w=()=>{const lv=orig();const L=LEVELS[id]||lv;try{pstTidy(id,L)}catch(e){console.error('ps tidy',id,e)}try{pstAccess(id,L)}catch(e){console.error('ps access',id,e)}try{pstGems(id,L)}catch(e){console.error('ps gems',id,e)}return LEVELS[id]||lv};w._pst=1;w._psc=orig._psc;KH_LAZY[id]=w}}
