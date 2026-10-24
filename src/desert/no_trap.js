/* ==========================================================================
   NEVER TRAPPED. Whenever the party arrives somewhere by a door, a cave mouth or a stair, make sure it is not walled in by trees, rocks or other solid scenery.
   Nothing is generated and nothing is moved: the level is exactly as it was built. If the squares the party can walk to from where it stands are only a small pocket
   (fewer than 40), the shortest line of solid scenery (trees, rocks, bushes, stumps) out of the pocket is opened, the same way a burned tree is (it stays open from then on,
   because the level remembers it). Walls are never touched. Last in the injection order.
   ========================================================================== */
const NT_SOLID=/^([glp]?tree|ltree|pt_|flora|bush|gboulder|grocks|rock|gstump|pstump|stump|veg|hay|wd_hill|hedge)/;
function noTrapCheck(){for(let i=0;i<8;i++)if(!noTrapStep())break} // one line of trees at a time, until the pocket opens onto open ground
function noTrapStep(){
  try{
    if(G.state!=='play'||!G.grid||!G.decor)return false;
    const px=G.P.x,py=G.P.y,key=(x,y)=>y*MW+x;
    const solid=new Map();for(const d of G.decor)if(d.block&&!d.found&&!d.npc&&NT_SOLID.test(d.k))solid.set(key(d.x,d.y),d);
    const blocked=(x,y)=>{if(x<0||y<0||x>=MW||y>=MH)return true;const g=G.grid[y]&&G.grid[y][x];if(g!==0)return true;return G.decor.some(d=>d.block&&!d.found&&!d.npc&&d.x===x&&d.y===y&&!solid.has(key(x,y)))};
    // the pocket: free squares reachable from the party (stop counting at 40)
    const seen=new Set([key(px,py)]),q=[[px,py]];
    for(let i=0;i<q.length&&q.length<40;i++){const [x,y]=q[i];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(seen.has(k)||blocked(nx,ny)||solid.has(k))continue;seen.add(k);q.push([nx,ny])}}
    if(q.length>=40)return false;
    // Dijkstra out of the pocket: a free square costs 0, a solid-scenery square costs 1; stop at the first free square that is not in the pocket
    const dist=new Map(),prev=new Map(),open=[];for(const [x,y] of q){dist.set(key(x,y),0);open.push([0,x,y])}
    let goal=null;
    while(open.length&&!goal){open.sort((a,b)=>a[0]-b[0]);const [dd,x,y]=open.shift();if(dd>dist.get(key(x,y)))continue;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(blocked(nx,ny))continue;const c=solid.has(k)?1:0,nd=dd+c;
        if(dist.has(k)&&dist.get(k)<=nd)continue;dist.set(k,nd);prev.set(k,key(x,y));
        if(!seen.has(k)&&c===0&&nd>0){goal=k;break}open.push([nd,nx,ny])}}
    if(!goal)return false;
    let k=goal,opened=0;while(k!==undefined&&!seen.has(k)){const d=solid.get(k);if(d){for(const e of G.decor)if(e.block&&!e.found&&!e.npc&&e.x===d.x&&e.y===d.y&&NT_SOLID.test(e.k)){e.found=true;e.block=false;opened++}}k=prev.get(k)}
    if(opened){try{buildDecorMap()}catch(e){}}
    return opened>0;
  }catch(e){console.error('noTrapCheck',e);return false}
}
{const _g=goToLevel;goToLevel=function(n,entry){const r=_g.apply(this,arguments);if(entry)try{noTrapCheck()}catch(e){}return r}}
