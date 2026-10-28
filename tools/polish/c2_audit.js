()=>{const L=LEVELS[475],P=L._hgdp,rows=L.rows;const open=(x,y)=>rows[y]&&rows[y][x]==='.';
const zs=P.zones.filter(z=>z.type==='safe'),towns=zs.filter(z=>z.town!==undefined);
const inAny=d=>zs.find(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r);
const R={};const dec=L.decor.filter(inAny);R.zoneDecor=dec.length;
if(!G.quests)G.quests={};if(!G.flags)G.flags={};
const ppl=dec.filter(d=>d.npc&&NPCS[d.npc]&&!/hgdpc_text|sign|note|hgdb_post/.test(d.npc));
// pictures
const pic={};for(const d of ppl){pic[d.k]=(pic[d.k]||0)+1}R.pictures=Object.keys(pic).length;R.picUse=Object.entries(pic).sort((a,b)=>b[1]-a[1]).slice(0,6).map(e=>e.join(':')).join(' ');
const giv=ppl.filter(d=>/hgd_q\d|church\d/.test(d.npc));const gp={};for(const d of giv)gp[d.k]=(gp[d.k]||0)+1;R.giverPictures=Object.keys(gp).length+' of '+giv.length;R.giverMax=Math.max(...Object.values(gp));
// sentences across the zone NPC texts
const sc={};const texts=[];for(const d of ppl){let t='';try{HGDPC.cur=d;const n=NPCS[d.npc].root(d);t=(n&&n.text)||''}catch(e){t=''}texts.push(t);
 for(const s of t.split(/(?<=[.!?])\s+/)){const k=s.trim();if(k.length>6)sc[k]=(sc[k]||0)+1}}
// notes and boards too
for(const d of dec.filter(d=>d.txt)){for(const s of d.txt.split(/(?<=[.!?])\s+/)){const k=s.trim();if(k.length>6)sc[k]=(sc[k]||0)+1}}
R.repeatSent=Object.entries(sc).filter(e=>e[1]>2).sort((a,b)=>b[1]-a[1]).map(e=>e[1]+'x '+e[0].slice(0,60));R.repeatCount=R.repeatSent.length;
R.maxRepeat=Math.max(...Object.values(sc));
R.emptyText=ppl.filter((d,i)=>!texts[i]).map(d=>d.npc);
R.badChars=texts.filter(t=>/—|undefined|TODO|NaN/.test(t)).length;
// proximity: pairs of NPC cells within chebyshev 1 / 2
let adj=0,near2=0;const pairs=[];const sh=ppl.filter(d=>!/church/.test(d.npc));
for(let i=0;i<ppl.length;i++)for(let j=i+1;j<ppl.length;j++){const a=ppl[i],b=ppl[j];const c=Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));if(c<=1){adj++;pairs.push(a.npc+'/'+b.npc+'@'+a.x+','+a.y)}else if(c<=2)near2++}
R.npcAdjacent=adj;R.npcWithin2=near2;R.adjSample=pairs.slice(0,6);
// blockers in a row (3+ in a line of blocking decor at consecutive x or y)
const blk=new Set(dec.filter(d=>d.block&&!/hgxstat|statue|plinth/.test(d.k)).map(d=>d.x+','+d.y));let rowsN=0;const rs=[];
for(const k of blk){const [x,y]=k.split(',').map(Number);if(!blk.has((x-1)+','+y)&&blk.has((x+1)+','+y)&&blk.has((x+2)+','+y)){rowsN++;rs.push(x+','+y)}if(!blk.has(x+','+(y-1))&&blk.has(x+','+(y+1))&&blk.has(x+','+(y+2))){rowsN++;rs.push(x+','+y+'v')}}
R.blockerRows=rowsN;R.blockerRowAt=rs.slice(0,8);
// kinds
R.houses=dec.filter(d=>/hgdpc_house/.test(d.hs||'')).length;
R.churchArt=[];for(const d of dec.filter(d=>/church\d/.test(d.npc)))R.churchArt.push(d.npc+':'+(d.cv||'-')+'@'+d.x+','+d.y);
// stacked
const cell={};for(const d of dec){const k=d.x+','+d.y;(cell[k]=cell[k]||[]).push(d.k)}R.stacked=Object.entries(cell).filter(e=>e[1].length>1&&L.decor.filter(d=>d.x+","+d.y===e[0]).filter(d=>!d.pic).length>1).length;
R.onWall=dec.filter(d=>!open(d.x,d.y)).length;
// clusters of >=3 identical kinds within 4 cells
const cl=[];const done=new Set();for(const d of dec){if(d.npc||d.k===undefined||/hgdf_(wsym|shield|vine)/.test(d.k))continue;const g=dec.filter(e=>e.k===d.k&&!e.npc&&Math.abs(e.x-d.x)<=3&&Math.abs(e.y-d.y)<=3);if(g.length>=3){const key=d.k+Math.floor(d.x/4)+','+Math.floor(d.y/4);if(!done.has(key)){done.add(key);cl.push(d.k+' x'+g.length+'@'+d.x+','+d.y)}}}
R.clusters=cl.length;R.clusterList=cl.slice(0,10);
// scale outliers vs table
const TAB=window.HGDPC_SCALE||null;const by={};for(const d of dec){const h=NPC_H[d.k]?NPC_H[d.k]*(d.sc||1):null;if(h===null)continue;const kk=(d.npc?'NPC:':'')+d.k;(by[kk]=by[kk]||[]).push(h)}
R.heights=Object.fromEntries(Object.entries(by).filter(e=>!/hgdf_|hgxprop|hgxrock|plant\d/.test(e[0])).map(([k,a])=>[k,[a.length,+Math.min(...a).toFixed(2),+Math.max(...a).toFixed(2)]]));
// reach
const W=201,seen=new Uint8Array(W*W);const st=[[L.start.x,L.start.y]];seen[L.start.y*W+L.start.x]=1;const bl=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
const reach=(sn)=>sn;const flood=(useB)=>{const sn=new Uint8Array(W*W);const q=[[L.start.x,L.start.y]];sn[L.start.y*W+L.start.x]=1;while(q.length){const [x,y]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=W||sn[ny*W+nx]||!open(nx,ny))continue;if(useB&&bl.has(nx+','+ny))continue;sn[ny*W+nx]=1;q.push([nx,ny])}}return sn};
const a=flood(false),b=flood(true);let cut=0;for(let i=0;i<W*W;i++)if(a[i]&&!b[i]&&!bl.has((i%W)+','+((i/W)|0)))cut++;R.cutOff=cut;
R.npcUnreach=ppl.filter(d=>!b[d.y*W+d.x]&&false).length;
R.lights=(L.lights||[]).length;R.extraLights=(HGDPC.lights||[]).length;
R.stats=L._hgdpc&&L._hgdpc.stats;
return R}
