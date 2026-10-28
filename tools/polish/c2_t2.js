()=>{const L=LEVELS[475],zs=L._hgdp.zones.filter(z=>z.type==='safe');const dec=L.decor.filter(d=>zs.some(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r));
const cell={};for(const d of dec){const k=d.x+','+d.y;(cell[k]=cell[k]||[]).push(d.k+(d.pic?'(pic)':'')+(d.npc?'['+d.npc+']':''))}
const st=Object.entries(cell).filter(e=>e[1].length>1).map(e=>e[0]+' '+e[1].join('+'));
const W=201,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';const bl=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
const flood=(useB)=>{const sn=new Uint8Array(W*W);const q=[[L.start.x,L.start.y]];sn[L.start.y*W+L.start.x]=1;while(q.length){const [x,y]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=W||sn[ny*W+nx]||!open(nx,ny))continue;if(useB&&bl.has(nx+','+ny))continue;sn[ny*W+nx]=1;q.push([nx,ny])}}return sn};
const a=flood(false),b=flood(true);const cut=[];for(let i=0;i<W*W;i++)if(a[i]&&!b[i]&&!bl.has((i%W)+','+((i/W)|0)))cut.push((i%W)+','+((i/W)|0));
return {st,cut,hs:IMG.icn_hgdi_thouse?1:0,hut5:IMG.icn_hgdi_hut5?1:0,sh:IMG.art_hgstall_shrine?1:0,ps:IMG.art_hgtb_shrine?1:0,h0:IMG.hg_house0?1:0,mon:IMG.monk?1:0,pw:IMG.prismwiz?1:0}}
