/* ps_tidy.js: the castle's housekeeper. Runs once on every castle level after ps_curate.js.
   Every loose free-standing prop (barrels, crates, boxes, sacks, casks, urns, lamps, braziers, candelabra, stools, buckets, baskets) is pushed against a wall:
   it stays where it is only if it already stands against a wall in a roomy place, clear of the main route, the doors and the stairs;
   otherwise it moves to the nearest such spot (never one that would cut a way through, checked by a flood fill), or goes if there is none.
   The report is in LEVELS[id]._tidy. */
const PST_MOVE=/barrel|crate|box|sack|cask|keg|lamp|lantern|brazier|candelabra|candle|(^|_)urn($|_)|vase|stool|bucket|basket|pot\b|jar|tray/i;
const PST_KEEP=/furn_(?!chair|stool)|clock|wardrobe|screen|sideboard|table|chest|door|gate|arch|stair|sign|window|mirror|portrait|hearth|fireplace|bed|altar|statue|st_|col|pillar|tele|fountain|well|tomb|bell/i;
function pstTidy(id,L){
  if(!L||L._tidied||!L.rows)return L;L._tidied=1;
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
{for(const info of PSP.LEVELS){const id=info.id,orig=KH_LAZY[id];if(!orig||orig._pst)continue;
  const w=()=>{const lv=orig();const L=LEVELS[id]||lv;try{pstTidy(id,L)}catch(e){console.error('ps tidy',id,e)}return LEVELS[id]||lv};w._pst=1;w._psc=orig._psc;KH_LAZY[id]=w}}
