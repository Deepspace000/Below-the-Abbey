(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,rows=L.rows,Z=(x,y)=>M.bio[y*W+x]>=4;const out={};
const isW=c=>!c||c==='#'||(c!=='.'&&c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8),op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';
const D=[[0,-1],[1,0],[0,1],[-1,0]];const hOf=d=>(NPC_H[d.k]||0)*(d.sc||1);
const zd=L.decor.filter(d=>Z(d.x,d.y));out.zoneDecor=zd.length;
// reach
const dist=new Int32Array(W*H).fill(-1),q=[[L.start.x,L.start.y]];dist[L.start.y*W+L.start.x]=0;for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of D){const nx=x+a,ny=y+b;if(op(nx,ny)&&dist[ny*W+nx]<0){dist[ny*W+nx]=1;q.push([nx,ny])}}}
// PROPORTIONS
const tall=[],tab={};
for(const d of zd){if(d.pic||!d.k||d.hgdl)continue;const h=hOf(d);if(!h)continue;const k=d.k;(tab[k]=tab[k]||[]).push(h);
 const lim=/tree|vine|fairy|belltree|willow|giantcap|house|abbeyspire|dune/.test(k)?Infinity:/^hg_house/.test(k)?2:1.6;if(h>lim)tall.push([k,d.x,d.y,+h.toFixed(2)])}
out.tallOver1_6=tall.length;out.tallList=tall.slice(0,15);
const cnt=(re,lo,hi)=>zd.filter(d=>!d.pic&&re.test(d.k)&&(hOf(d)<lo||hOf(d)>hi)).map(d=>[d.k,d.x,d.y,+hOf(d).toFixed(2)]);
out.badLamps=cnt(/^(hg_lamp|hgt_lamppost)$/,1,1.55);out.badStatues=cnt(/^(hgtb_deco_shellstatue|art_hgxstat)/,.9,1.45);out.badPlinths=cnt(/plinth/,.5,.8);
out.badSigns=cnt(/^(sign_|hgdpc_sg_)/,.4,.7);out.badPeople=cnt(/^(hg_npc\d|hg_wizard)$/,.8,1.05);out.badHouses=cnt(/^hg_house/,1.7,2.1);out.badBook=cnt(/bookshelf/,.9,1.3);out.badChests=cnt(/^hg_chest/,.3,.55);
out.badTrees=cnt(/^(hgtb_plant_belltree|hgt_fairytree)$/,1.4,2.7);out.badPlants=cnt(/^(hgt_bulbflower|hgt_shellflower|hgtb_plant_spiralfern)$/,.6,1.35);out.badTables=cnt(/^(hgtb_table|hgtb_bench|hgtb_chair)$/,.3,.6);
for(const k of ['badLamps','badStatues','badPlinths','badSigns','badPeople','badHouses','badBook','badChests','badTrees','badPlants','badTables'])out[k+'N']=out[k].length;
out.badSample=['badLamps','badStatues','badSigns','badPeople','badHouses'].map(k=>out[k].slice(0,2));
for(const k of ['badLamps','badStatues','badPlinths','badSigns','badPeople','badHouses','badBook','badChests','badTrees','badPlants','badTables'])delete out[k];
out.profile={};for(const k of ['hg_lamp','hgtb_deco_shellstatue','art_hgxstat4','hgtb_deco_pearlplinth','sign_store','hg_npc0','hg_npc4','hg_house0','hgtb_plant_belltree','hg_chestwax','hgtb_table','wm_bookshelf','gate'])if(tab[k]){const a=tab[k].sort((x,y)=>x-y);out.profile[k]=[a.length,+a[0].toFixed(2),+a[a.length-1].toFixed(2)]}
// LIGHTING: path distance to nearest light
const lw=new Int16Array(W*H).fill(9999),lq=[];for(const l of L.lights)if(op(l[0],l[1])){lw[l[1]*W+l[0]]=0;lq.push([l[0],l[1]])}
for(let i=0;i<lq.length;i++){const [x,y]=lq[i],dd=lw[y*W+x];if(dd>=20)continue;for(const [a,b] of D){const nx=x+a,ny=y+b;if(op(nx,ny)&&lw[ny*W+nx]>dd+1){lw[ny*W+nx]=dd+1;lq.push([nx,ny])}}}
const R={4:8,5:6,6:6,7:7};let dark=0,tot=0;const bio={};for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(Z(x,y)&&op(x,y)&&dist[y*W+x]>=0){tot++;const b=M.bio[y*W+x];if(lw[y*W+x]>R[b]+1){dark++;bio[b]=(bio[b]||0)+1}}
out.cellsFarFromLight=dark;out.zoneCells=tot;out.darkByBio=bio;out.lightsZone=L.lights.filter(l=>Z(l[0],l[1])).length;out.coloured=Object.keys(L._hgpbCol||{}).length;
// TEXT
const posts=zd.filter(d=>d.npc==='hgdb_post'),notes=zd.filter(d=>/^(hgdb_note|hgd_note|hgd_pa_note)$/.test(d.npc));const txt=d=>d.pbt||d.text||(d.npc==='hgd_note'?HGDF_NOTES[d.note%HGDF_NOTES.length]:'');
const all=posts.concat(notes).map(txt);out.textPieces=all.length;out.emptyText=all.filter(t=>!t||t.length<8).length;out.dupText=all.filter((t,i)=>all.indexOf(t)!==i).length;out.emDash=all.filter(t=>/—/.test(t)).length;
out.hedgeText=all.filter(t=>/hedge|honeycomb|\btree/i.test(t)).length;
// G.decor carries the text?
out.liveNoText=G.decor.filter(d=>(d.npc==='hgdb_post'||d.npc==='hgdb_note')&&Z(d.x,d.y)&&!d.pbt).length;
// near givers
const people=zd.filter(d=>d.npc&&!d.pic&&!/^hgdb_|^hgd_note|^hgd_sign|^hgd_plaque|^hgd_pa_note/.test(d.npc));let nn=0,en=0;
for(const g of people){for(const d of zd)if(d!==g&&!d.npc&&!d.pic&&!d._pbv&&Math.max(Math.abs(d.x-g.x),Math.abs(d.y-g.y))<=1&&hOf(d)>.55&&/lamp|tree|fern|bush|flower|vine|reeds|statue|plinth|mushroom|pillar/.test(d.k))nn++;
 for(const e of L.enemies)if(Math.hypot(e.x-g.x,e.y-g.y)<4.6&&!e.boss)en++}
out.tallNearPeople=nn;out.enemiesNearPeople=en;out.people=people.length;
// identical clusters, rows
const byK={};for(const d of zd){if(d.pic||d.hgdl||d.npc)continue;(byK[d.k]=byK[d.k]||[]).push(d)}let clus=0;const cl=[];for(const k in byK){if(/reeds|hgdf_plant|hgthin|hgxrock|hgxprop/.test(k))continue;const a=byK[k];for(const d of a){const n=a.filter(e=>Math.max(Math.abs(e.x-d.x),Math.abs(e.y-d.y))<=4).length;if(n>=4){clus++;cl.push(k)}}}
out.clusters=clus;out.clusterKinds=[...new Set(cl)].slice(0,8);
// rows of identical props: 3 in a straight line
let rowsN=0;for(const k in byK){if(/reeds|hgdf_plant|hgthin|hgxrock|hgxprop|tree/.test(k))continue;const a=byK[k],s=new Set(a.map(d=>d.x+','+d.y));for(const d of a)for(const [dx,dy] of [[1,0],[0,1]])if(s.has((d.x+dx*2)+','+(d.y+dy*2))&&s.has((d.x+dx*4)+','+(d.y+dy*4)))rowsN++}
out.rowsOfThree=rowsN;
// dead ends without anything
let de=0,deAll=0;for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!Z(x,y)||!op(x,y)||dist[y*W+x]<0||M.kind[y*W+x])continue;let c=0;for(const [a,b] of D)if(op(x+a,y+b))c++;if(c!==1)continue;deAll++;let f=false;for(const d of L.decor)if(Math.abs(d.x-x)<=1&&Math.abs(d.y-y)<=1&&(!d.pic||d.npc)){f=true;break}if(!f)for(const i of L.items)if(Math.abs(i.x-x)<=1&&Math.abs(i.y-y)<=1){f=true;break}if(!f)de++}
out.deadEnds=deAll;out.deadEndsEmpty=de;
// long runs and waysides
const isC=(x,y,ax)=>op(x,y)&&!M.kind[y*W+x]&&(ax?(op(x,y-1)&&op(x,y+1)&&(op(x-1,y)?1:0)+(op(x+1,y)?1:0)<=1):(op(x-1,y)&&op(x+1,y)&&(op(x,y-1)?1:0)+(op(x,y+1)?1:0)<=1));
let longRuns=0,bare=0;const lms=zd.filter(d=>!d.pic&&(d._pbv||d.k==='hg_lamp')||(d.pic&&/^hpb_(lan|cage)/.test(d.k)));const kits=zd.filter(d=>d._pbv&&!d.pic&&(d.ox||d.oy));for(let ax=0;ax<2;ax++){const A=ax?W:H,B=ax?H:W;for(let a=0;a<A;a++){let st=-1;for(let b=0;b<=B;b++){const x=ax?a:b,y=ax?b:a,ok=b<B&&isC(x,y,ax)&&Z(x,y);if(ok&&st<0)st=b;if(!ok&&st>=0){if(b-st>=24){longRuns++;let has=0;for(let t=st;t<b;t+=1){const xx=ax?a:t,yy=ax?t:a;}const cells=[];for(let t=st;t<b;t++)cells.push(ax?[a,t]:[t,a]);let last=-1,gap=0,mg=0;for(let i=0;i<cells.length;i++){const [xx,yy]=cells[i];const hit=lms.some(d=>Math.abs(d.x-xx)<=1&&Math.abs(d.y-yy)<=1);if(hit){mg=Math.max(mg,i-last);last=i}}mg=Math.max(mg,cells.length-1-last);if(mg>16){bare++;(out.gapRuns=out.gapRuns||[]).push([ax,a,st,b-1,mg,lms.filter(d=>(ax?d.x===a:d.y===a)).length])}}st=-1}}}}
out.longRuns=longRuns;out.longRunsWithBigGap=bare;
out.kits=kits.length;out.hgpb=L._hgpb&&L._hgpb.log&&L._hgpb.log.p2;out.ms=L._hgpb&&L._hgpb.ms;
return out})()
