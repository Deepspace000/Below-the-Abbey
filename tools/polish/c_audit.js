()=>{try{hgBuild();hgdBuild()}catch(e){}
const L=LEVELS[475],P=L._hgdp,rows=L.rows,W=201,H=201;
const open=(x,y)=>rows[y]&&rows[y][x]==='.';
const zs=P.zones.filter(z=>z.type==='safe');
const inAny=d=>zs.find(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r);
const R={};
// reachability flood fill from start
const seen=new Uint8Array(W*H);const st=[[L.start.x,L.start.y]];seen[L.start.y*W+L.start.x]=1;
const blk=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
while(st.length){const [x,y]=st.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||seen[ny*W+nx]||!open(nx,ny))continue;seen[ny*W+nx]=1;st.push([nx,ny])}}
const reach=(x,y)=>!!seen[y*W+x];
const dec=L.decor.filter(inAny);
R.zoneDecor=dec.length;
// NPCs
if(!G.quests)G.quests={};if(!G.flags)G.flags={};
R.npcs=dec.filter(d=>d.npc&&NPCS[d.npc]&&!/sign|note|hgdpc_text/.test(d.npc)).map(d=>{let t='';try{HGDPC.cur=d;const n=NPCS[d.npc].root(d);t=n&&n.text||''}catch(e){t='ERR '+e.message}
 return {npc:d.npc,name:NPCS[d.npc].name,k:d.k,x:d.x,y:d.y,sc:d.sc,h:+(((NPC_H[d.k]||0)*(d.sc||1)).toFixed(2)),zone:inAny(d).name,text:t}});
// duplicates
const tc={};for(const n of R.npcs){tc[n.text]=(tc[n.text]||0)+1}
R.dupText=Object.entries(tc).filter(e=>e[1]>1&&e[0]).map(e=>[e[1],e[0].slice(0,70)]);
R.emptyText=R.npcs.filter(n=>!n.text||/ERR/.test(n.text)).map(n=>[n.npc,n.text]);
// same image next to each other in a zone
R.sameImg={};for(const z of zs){const c={};for(const n of R.npcs.filter(n=>n.zone===z.name))c[n.k]=(c[n.k]||0)+1;const m=Object.entries(c).filter(e=>e[1]>1);if(m.length)R.sameImg[z.name]=m}
// stacked
const cell={};for(const d of dec){const k=d.x+','+d.y;(cell[k]=cell[k]||[]).push(d.k)}
R.stacked=Object.entries(cell).filter(e=>e[1].length>1).map(e=>e[0]+' '+e[1].join('+'));
R.onWall=dec.filter(d=>!open(d.x,d.y)).map(d=>d.k+'@'+d.x+','+d.y);
R.unreach=dec.filter(d=>d.npc&&!reach(d.x,d.y)).map(d=>d.npc+'@'+d.x+','+d.y);
R.itemsUnreach=L.items.filter(i=>!reach(i.x,i.y)).map(i=>i.k+'@'+i.x+','+i.y);
// blocking in narrow corridor: blocking decor whose open neighbours <=2 and opposite pair
R.blockNarrow=dec.filter(d=>d.block&&!d.npc).filter(d=>{const n=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(d.x+a,d.y+b)).length;return n<=2}).map(d=>d.k+'@'+d.x+','+d.y);
R.npcNarrow=dec.filter(d=>d.block&&d.npc).filter(d=>{const n=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(d.x+a,d.y+b)).length;return n<=2}).map(d=>d.npc+'@'+d.x+','+d.y);
// clusters of >=3 identical kinds within 4 cells
const cl=[];const done=new Set();for(const d of dec){if(d.npc||d.k===undefined)continue;const g=dec.filter(e=>e.k===d.k&&!e.npc&&Math.abs(e.x-d.x)<=4&&Math.abs(e.y-d.y)<=4);if(g.length>=3){const key=d.k+Math.floor(d.x/5)+','+Math.floor(d.y/5);if(!done.has(key)){done.add(key);cl.push(d.k+' x'+g.length+' near '+d.x+','+d.y)}}}
R.clusters=cl;
// proportions by kind
const by={};for(const d of dec){if(d.npc&&/sign/.test(d.npc)){}const nh=NPC_H[d.k];const h=nh?nh*(d.sc||1):null;const key=(d.npc?'NPC:':'')+d.k;(by[key]=by[key]||[]).push(h)}
R.prop=Object.entries(by).map(([k,a])=>{const v=a.filter(x=>x!=null).sort((x,y)=>x-y);return [k,a.length,v.length?+v[0].toFixed(2):null,v.length?+v[v.length-1].toFixed(2):null,v.length?+v[v.length>>1].toFixed(2):null]});
// notes / signs
R.notes=dec.filter(d=>/note|sign/.test(d.npc||'')).map(d=>{let t='';try{const n=NPCS[d.npc].root(d);t=n&&n.text||''}catch(e){t='ERR'}return [d.npc,d.x,d.y,t.slice(0,60)]});
// placeholder text
R.bad=[];for(const n of R.npcs)if(/undefined|TODO|lorem|\u2014/i.test(n.text))R.bad.push(n.npc);
// elem types in towns lacking
R.townKinds={};for(const z of zs.filter(z=>z.town!==undefined)){const ids=R.npcs.filter(n=>n.zone===z.name).map(n=>n.npc.replace(/\d+$/,''));const c={};ids.forEach(i=>c[i]=(c[i]||0)+1);R.townKinds[z.name]=c}
{const reachWith=(useB)=>{const sn=new Uint8Array(W*H);const bl=new Set(useB?L.decor.filter(d=>d.block).map(d=>d.x+','+d.y):[]);const q=[[L.start.x,L.start.y]];sn[L.start.y*W+L.start.x]=1;while(q.length){const [x,y]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||sn[ny*W+nx]||!open(nx,ny)||bl.has(nx+','+ny))continue;sn[ny*W+nx]=1;q.push([nx,ny])}}return sn};
 const a=reachWith(false),b=reachWith(true),bl=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));let cut=0;const ex=[];for(let i=0;i<W*H;i++)if(a[i]&&!b[i]&&!bl.has((i%W)+','+((i/W)|0))){cut++;if(ex.length<6)ex.push((i%W)+','+((i/W)|0))}R.cutOff=[cut,ex]}
R.stats=L._hgdpc?L._hgdpc.stats:null;
return R}
