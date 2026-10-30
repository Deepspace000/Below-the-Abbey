/* ==========================================================================
   QUIET CHESTS IN THE DESERTS. Four chests in each desert (the Red Dunes, the Blue and White Dunes, the Golden and Violet Ergs and the Flatlands), each holding
   200 to 500 gold. They stand in quiet places: tucked among rocks and dunes, well away from creatures, people, doors and the stone teleporter, and far apart
   from each other. They are chosen the same way every time, so a saved game always finds them where they were.
   ========================================================================== */
const DC_DESERTS=[43,60,61,62,63,64];
function dcPlace(n){
  const L=LEVELS[n];if(!L||L._dc||typeof terrFor!=='function')return;L._dc=1;
  const tb=terrFor(n);if(!tb)return;const W=tb.W,H=tb.H,N=W*H,blocked=new Uint8Array(N);
  for(let i=0;i<N;i++)blocked[i]=tb.block[i]?1:0;
  for(let y=0;y<H;y++){const r=L.rows[y]||'';for(let x=0;x<W;x++)if(r[x]!=='.')blocked[y*W+x]=1} // the dune and cliff walls of the map (the terrain mask alone leaves them open)
  const hz=[];
  for(const d of (L.decor||[])){if(d.x<0||d.y<0||d.x>=W||d.y>=H)continue;if(d.block)blocked[d.y*W+d.x]=1;if(d.npc||d.enter||d.k==='chest'||d.k==='dhatch')hz.push([d.x,d.y])}
  for(const e of (L.enemies||[]))hz.push([e.x,e.y]);
  for(const it of (L.items||[]))hz.push([it.x,it.y]);
  try{const t=teleSpot(n);if(t)hz.push([t.x,t.y])}catch(e){}
  for(let y=0;y<H;y++){const r=L.rows[y]||'';for(let x=0;x<W;x++){const c=r[x];if(c&&c!=='.'&&/[0-9]/.test(c))hz.push([x,y])}}
  // how far (in steps) each cell is from the start: only cells the party can reach count
  const dist=new Int32Array(N).fill(-1),q=[L.start.y*W+L.start.x];dist[q[0]]=0;
  for(let h=0;h<q.length;h++){const i=q[h],x=i%W,y=(i/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<1||ny<1||nx>=W-1||ny>=H-1)continue;const j=ny*W+nx;if(dist[j]>=0||blocked[j])continue;dist[j]=dist[i]+1;q.push(j)}}
  const cand=[];
  for(let y=4;y<H-4;y+=2)for(let x=4;x<W-4;x+=2){const i=y*W+x;if(dist[i]<25||blocked[i])continue;
    let mh=99;for(const [hx,hy] of hz){const d=Math.max(Math.abs(hx-x),Math.abs(hy-y));if(d<mh){mh=d;if(mh<10)break}}if(mh<10)continue;
    let open=0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(blocked[(y+dy)*W+x+dx])open++; // the more rock and scrub round it, the more tucked away
    if(typeof terrH==='function'){const h0=terrH(x+.5,y+.5);let fl=true;for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]])if(Math.abs(terrH(x+dx+.5,y+dy+.5)-h0)>.4){fl=false;break}if(!fl)continue}
    cand.push([x,y,Math.min(mh,24)+open*.3+hash2(x,y,n+7)*4])}
  cand.sort((a,b)=>b[2]-a[2]);
  const picked=[];
  for(const c of cand){if(picked.length>=4)break;if(picked.some(p=>Math.max(Math.abs(p[0]-c[0]),Math.abs(p[1]-c[1]))<36))continue;picked.push(c)}
  for(const [x,y] of picked)L.decor.push({k:'chest',x,y,block:true,goldAmt:200+Math.floor(hash2(x,y,n+11)*301)});
  L._dcN=picked.length;
}
{const _g=goToLevel;goToLevel=function(n,e){try{if(DC_DESERTS.includes(n)){if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();dcPlace(n)}}catch(x){console.error(x)}return _g.apply(this,arguments)}}
