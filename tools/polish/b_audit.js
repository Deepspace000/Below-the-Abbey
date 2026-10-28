(()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,rows=L.rows;const bi=(x,y)=>M.bio[y*W+x];
const Z=(x,y)=>bi(x,y)>=4;const out={};
const ch=(x,y)=>rows[y]&&rows[y][x];const isWallC=c=>!!c&&(c==='#'||(c!=='.'&&c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8));
const pass=(x,y)=>{const c=ch(x,y);return !!c&&!isWallC(c)};
const D=[[0,-1],[1,0],[0,1],[-1,0]];
// reach
const dist=new Int32Array(W*H).fill(-1);const q=[[L.start.x,L.start.y]];dist[L.start.y*W+L.start.x]=0;
for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of D){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||dist[ny*W+nx]>=0||!pass(nx,ny))continue;dist[ny*W+nx]=1;q.push([nx,ny])}}
out.reachCells=q.length;
const nb=(x,y)=>D.filter(([a,b])=>pass(x+a,y+b)).length;
const zd=L.decor.filter(d=>Z(d.x,d.y));out.zoneDecor=zd.length;
// npc ids
const npcs={};for(const d of zd)if(d.npc)npcs[d.npc]=(npcs[d.npc]||0)+1;out.npcIds=npcs;
out.noKeeper=Object.keys(npcs).filter(n=>typeof KH_KEEPERS!=='undefined'&&!KH_KEEPERS[n]);
// notes
const notes=zd.filter(d=>d.npc==='hgd_note');out.notes=notes.length;
try{out.notePool=HGDF_NOTES.length;out.noteEmpty=HGDF_NOTES.map((t,i)=>[i,t]).filter(([i,t])=>!t||String(t).length<8).map(a=>a[0]);out.noteDupUse=notes.map(d=>d.note%HGDF_NOTES.length).filter((v,i,a)=>a.indexOf(v)!==i).length}catch(e){out.noteErr=String(e)}
// wall decor, blocking, stacked
const wallD=[],blockD=[],stack={},stk=[];const key=(x,y)=>x+','+y;
for(const d of zd){if(d.pic)continue;const c=ch(d.x,d.y);if(!pass(d.x,d.y))wallD.push([d.k,d.x,d.y]);
  if(d.block&&nb(d.x,d.y)<=2&&c==='.')blockD.push([d.k,d.x,d.y]);
  if(d.hgdl)continue;const kk=key(d.x,d.y);(stack[kk]=stack[kk]||[]).push(d.k)}
for(const kk in stack){const arr=stack[kk];if(arr.length>1){const nox=zd.filter(d=>d.x+','+d.y===kk&&!d.pic&&!d.hgdl&&!d.ox&&!d.oy).length;if(nox>1)stk.push([kk,arr.join('|')])}}
out.wallDecor=wallD;out.blockCorr=blockD;out.stacked=stk;
// clusters of 3+ identical within 4
const byK={};for(const d of zd){if(d.pic||d.hgdl||d.npc)continue;(byK[d.k]=byK[d.k]||[]).push(d)}
const clus=[];for(const k in byK){const a=byK[k];for(const d of a){const n=a.filter(e=>Math.max(Math.abs(e.x-d.x),Math.abs(e.y-d.y))<=4).length;if(n>=4&&k!=='hgt_reeds')clus.push([k,d.x,d.y,n])}}
out.clusters=clus.length;out.clusterTop=clus.sort((a,b)=>b[3]-a[3]).slice(0,40);
// proportions
const prop={};const H_=(k)=>NPC_H[k];
for(const d of L.decor){const k=d.k;if(!k)continue;const im=IMG[k];const h=(NPC_H[k]||0)*(d.sc||1);(prop[k]=prop[k]||[]).push([h,d.sc||1,Z(d.x,d.y)?1:0,im&&im.width?im.width/im.height:0,!!NPC_H[k]])}
const tab=[];for(const k in prop){const a=prop[k],hs=a.map(v=>v[0]).sort((x,y)=>x-y);tab.push([k,a.length,hs[0],hs[hs.length-1],hs[hs.length>>1],a[0][3],a[0][4],a.filter(v=>v[2]).length])}
out.prop=tab;
// enemies
const en={};for(const e of L.enemies){const st=enemyStat(e.t);const im=IMG[st.img];(en[e.t]=en[e.t]||{n:0,w:st.w,img:st.img,asp:im&&im.width?im.width/im.height:0,h:im&&im.width?st.w*im.height/im.width:0,sc:e.sc||null}).n++}
out.enemies=en;
// items reach
const itemsBad=[];for(const it of L.items)if(Z(it.x,it.y)&&dist[it.y*W+it.x]<0)itemsBad.push([it.k,it.x,it.y]);out.itemsUnreach=itemsBad;out.itemsZone=L.items.filter(i=>Z(i.x,i.y)).length;
const decUn=zd.filter(d=>!d.pic&&!d.hgdl&&(d.npc||d.loot||d.shop)&&dist[d.y*W+d.x]<0).map(d=>[d.k,d.x,d.y,d.npc]);out.npcUnreach=decUn;
const enUn=L.enemies.filter(e=>Z(e.x,e.y)&&dist[e.y*W+e.x]<0).map(e=>[e.t,e.x,e.y]);out.enemyUnreach=enUn;
// dead ends
const occ=new Set(L.decor.map(d=>key(d.x,d.y)));const items=new Set(L.items.map(d=>key(d.x,d.y)));
const dead=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!Z(x,y)||ch(x,y)!=='.'||dist[y*W+x]<0)continue;if(nb(x,y)===1){let near=false;for(let a=-2;a<=2&&!near;a++)for(let b=-2;b<=2;b++){if(occ.has(key(x+a,y+b))||items.has(key(x+a,y+b))){near=true;break}}if(!near)dead.push([x,y])}}
out.deadEmpty=dead.length;out.deadSample=dead.slice(0,30);
// bare stretches: open cells with no decor/item/light within 7
const sp=new Uint8Array(W*H);for(const d of L.decor)if(d.x>=0&&d.y>=0&&d.x<W&&d.y<H&&!d.hgdl)sp[d.y*W+d.x]=1;for(const d of L.items)sp[d.y*W+d.x]=1;for(const l of L.lights)sp[l[1]*W+l[0]]=1;
let bare=0;const bareS=[];for(let y=2;y<H-2;y+=1)for(let x=2;x<W-2;x+=1){if(!Z(x,y)||ch(x,y)!=='.'||dist[y*W+x]<0)continue;let f=false;for(let a=-7;a<=7&&!f;a++)for(let b=-7;b<=7;b++){const xx=x+a,yy=y+b;if(xx>=0&&yy>=0&&xx<W&&yy<H&&sp[yy*W+xx]){f=true;break}}if(!f){bare++;if(bareS.length<2000)bareS.push([x,y])}}
out.bareCells=bare;out.bareSample=bareS.filter((v,i)=>i%25===0).slice(0,40);
// lights in zone
out.lightsZone=L.lights.filter(l=>Z(l[0],l[1])).length;
// open cells count zone
let oc=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(Z(x,y)&&ch(x,y)==='.')oc++;out.openCells=oc;
// strings with placeholders in notes
out.mapNames=L.mapNames&&Object.keys(L.mapNames).length;
out.atrium=L.enemies.filter(e=>e.t==='hgdwarden');
out.gates=zd.filter(d=>d.k==='gate').map(d=>[d.x,d.y,d.npc,d.zone]);
out.kindCount=M.kind&&0;
// exact blockers: a blocking decor on an open cell whose removal from the maze cuts off other cells
const tot=(skip)=>{const seen=new Uint8Array(W*H),qq=[[L.start.x,L.start.y]];seen[L.start.y*W+L.start.x]=1;let n=1;for(let i=0;i<qq.length;i++){const [x,y]=qq[i];for(const [a,b] of D){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||seen[ny*W+nx]||ch(nx,ny)!=='.'||(nx===skip[0]&&ny===skip[1]))continue;seen[ny*W+nx]=1;n++;qq.push([nx,ny])}}return n};
const T0=tot([-9,-9]);const exact=[];for(const d of L.decor){if(!Z(d.x,d.y)||!d.block||d.pic||ch(d.x,d.y)!=='.'||nb(d.x,d.y)>2)continue;if(T0-tot([d.x,d.y])-1>0)exact.push([d.k,d.x,d.y,d.npc||''])}
out.blockExact=exact;
// drawn widths in corridors
const wideC=[];const nb8=(x,y)=>{let n=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&pass(x+a,y+b))n++;return n};
for(const d of zd){if(d.pic||d.hgdl)continue;const im=IMG[d.k];if(!im||!im.width||!NPC_H[d.k])continue;const w=NPC_H[d.k]*(d.sc||1)*im.width/im.height;if(nb8(d.x,d.y)<=5&&w>1.0&&!/tree|house|lamp|plant|vine|fern|fairy|bulb|shellflower|spiral|belltree/.test(d.k))wideC.push([d.k,d.x,d.y,+w.toFixed(2)])}
out.wideCorr=wideC;
const ck={};for(const c of clus)ck[c[0]]=(ck[c[0]]||0)+1;out.clusterKinds=ck;
out.stackedDetail=stk;
out.hgpb=L._hgpb||null;return out})()
