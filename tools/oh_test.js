/* Dev helper for Oldhaven: paste into the page console (or eval a fetch of this file).
   tp(level,x,y,facing)  teleports and skips cutscenes.   chk()  flood-fills level 305 from the gate and reports unreachable ground and doors. */
window.tp=async(n,x,y,f)=>{G.cut=null;G.talk=null;G.flags.oldhavenSeen=1;G.flags.oldhavenOpen=1;G.flags.courtOpen=1;G.clock=720;if(!LEVELS[n]&&KH_LAZY[n])KH_LAZY[n]();if(LEVEL!==n)goToLevel(n,{x,y,f});else{G.P.x=x;G.P.y=y;G.P.f=f;G.C.x=x+.5;G.C.y=y+.5;G.f=f}G.cut=null;G.talk=null;await new Promise(r=>setTimeout(r,1200));return [LEVEL,JSON.stringify(G.C)]};
window.chk=()=>{const L=LEVELS[305],W=150,H=150;const bl=new Uint8Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(L.rows[y][x]!=='.')bl[y*W+x]=1;for(const d of L.decor)if(d.block&&!d.walk)bl[(d.y|0)*W+(d.x|0)]=1;
  const seen=new Uint8Array(W*H),q=[[74,141]];seen[141*W+74]=1;while(q.length){const [x,y]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const i=ny*W+nx;if(seen[i]||bl[i])continue;seen[i]=1;q.push([nx,ny])}}
  let un=0,tot=0;const ex=[];for(let y=6;y<144;y++)for(let x=6;x<144;x++){const i=y*W+x;if(!bl[i]){tot++;if(!seen[i]){un++;if(ex.length<30)ex.push(x+','+y)}}}
  const hs=OH.houses;const badFront=hs.filter(h=>!seen[h.front[1]*W+h.front[0]]).map(h=>h.name+'@'+h.front);
  const sp=hs.filter(h=>h.sp).map(h=>h.id+':'+h.name+'@'+h.front);
  return {walkable:tot,unreachable:un,ex:ex.join(' '),houses:hs.length,badFront,decor:L.decor.length,sky:L.sky.length,specials:sp}};
