// evaluated inside the page (level 475 loaded). Returns the audit of the first twelve precincts (biomes 0 to 3).
(()=>{
const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,bio=M.bio,rows=L.rows,ZB=4,out={};
const inZ=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&bio[y*W+x]<ZB;
const ch=(x,y)=>rows[y]&&rows[y][x];
const isWallC=c=>!!c&&c!=='.'&&c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8;
const pass=(x,y)=>{const c=ch(x,y);return !!c&&c!=='#'&&!isWallC(c)};
const DV=[[0,-1],[1,0],[0,1],[-1,0]];
const med=a=>{a=a.slice().sort((p,q)=>p-q);return a.length?a[a.length>>1]:0};
const round=v=>Math.round(v*1000)/1000;
const D=L.decor.filter(d=>inZ(d.x,d.y));
out.zoneDecor=D.length;
// open cells in zone
let openZ=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(inZ(x,y)&&pass(x,y))openZ++;out.zoneOpenCells=openZ;
const nOpen=(x,y)=>{let n=0;for(const [a,b] of DV)if(pass(x+a,y+b))n++;return n};
// 1 signs
const sg=D.filter(d=>d.npc==='hgd_sign');out.signs=sg.length;
out.signsNoZone=sg.filter(d=>d.zone===undefined||!L._hgdp.zones[d.zone]).map(d=>[d.x,d.y]);
// notes
const notes=D.filter(d=>d.npc==='hgd_note');out.notes=notes.length;
out.noteTexts=notes.map(d=>[d.x,d.y,d.note,(HGDF_NOTES[d.note%HGDF_NOTES.length]||'')]);
out.emptyNotes=out.noteTexts.filter(n=>!n[3]||n[3].length<8).map(n=>[n[0],n[1]]);
out.dupNoteIdx={};{const c={};for(const n of out.noteTexts)c[n[3]]=(c[n[3]]||0)+1;out.dupNoteIdx=Object.entries(c).filter(e=>e[1]>1).map(e=>[e[0].slice(0,50),e[1]])}
out.notesTotal=HGDF_NOTES.length;
// npcs: dialogue
const npcs=D.filter(d=>d.npc&&!/^hgd_(sign|note|plaque)/.test(d.npc));out.npcs=npcs.length;
out.npcBad=[];
for(const d of npcs){try{G.talk={d};const def=(typeof KH_NPCS!=='undefined'&&KH_NPCS[d.npc]);out.npcBad.push&&0}catch(e){}}
// 2 blocking, stacking
const cellsD={};for(const d of L.decor){const i=d.y*W+d.x;(cellsD[i]=cellsD[i]||[]).push(d)}
out.onWall=D.filter(d=>!d.pic&&!pass(d.x,d.y)).map(d=>[d.k,d.x,d.y]);
const blockers=L.decor.filter(d=>d.block&&!d.walk);
const blkSet=new Set(blockers.map(d=>d.y*W+d.x));
const bfs=(withBlock)=>{const dist=new Int32Array(W*H).fill(-1),q=[L.start.y*W+L.start.x];dist[q[0]]=0;for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of DV){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||!pass(nx,ny))continue;const n=ny*W+nx;if(dist[n]>=0)continue;if(withBlock&&blkSet.has(n))continue;dist[n]=dist[c]+1;q.push(n)}}return dist};
const d0=bfs(false),d1=bfs(true);
out.reachNoBlock=0;out.reachBlock=0;out.cutOff=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(d0[i]>=0)out.reachNoBlock++;if(d1[i]>=0)out.reachBlock++;if(inZ(x,y)&&d0[i]>=0&&d1[i]<0&&!blkSet.has(i))out.cutOff.push([x,y])}
out.blockersCorr=D.filter(d=>d.block&&!d.walk&&pass(d.x,d.y)&&nOpen(d.x,d.y)<=2).map(d=>[d.k,d.x,d.y]);
// blockers sitting in the single-square corridor that are the only way (cut cells behind)
out.stacked=[];for(const i in cellsD){const a=cellsD[i].filter(d=>!d.pic&&inZ(d.x,d.y)&&!d.hgdl);const big=a.filter(d=>d.block||d.npc);const same={};for(const d of a)same[d.k]=(same[d.k]||0)+1;
 if(big.length>=2||Object.values(same).some(v=>v>=2))out.stacked.push([+i%W,((+i/W)|0),a.map(d=>d.k).join('+')])}
// clusters: 3 or more identical (non-wall-picture) within radius 2 of a decor
const NONPLANT=k=>true;
const byK={};for(const d of D){if(d.pic)continue;(byK[d.k]=byK[d.k]||[]).push(d)}
out.clusters=[];let clusterObjs=0;const clusterByKind={};
for(const k in byK){const a=byK[k];const grid={};for(const d of a){const key=((d.x>>2)+','+(d.y>>2));(grid[key]=grid[key]||[]).push(d)}
 for(const d of a){let n=0;for(let gx=(d.x>>2)-1;gx<=(d.x>>2)+1;gx++)for(let gy=(d.y>>2)-1;gy<=(d.y>>2)+1;gy++){const g=grid[gx+','+gy];if(g)for(const e of g)if(Math.max(Math.abs(e.x-d.x),Math.abs(e.y-d.y))<=2)n++}
  if(n>=3){clusterObjs++;clusterByKind[k]=(clusterByKind[k]||0)+1}}}
out.clusterObjs=clusterObjs;out.clusterByKind=Object.entries(clusterByKind).sort((a,b)=>b[1]-a[1]).slice(0,25);
// 3 proportions
const prop={};let noH={};
for(const d of D){const k=d.k;if(d.pic){continue}const h=NPC_H[k];if(!h){noH[k]=(noH[k]||0)+1;continue}(prop[k]=prop[k]||[]).push(h*(d.sc||1))}
out.noHeight=noH;
out.props=Object.entries(prop).map(([k,a])=>({k,n:a.length,min:round(Math.min(...a)),max:round(Math.max(...a)),med:round(med(a)),base:NPC_H[k],ratio:round(Math.max(...a)/Math.min(...a))})).sort((a,b)=>b.med-a.med);
out.propOutliers=out.props.filter(p=>p.ratio>1.5).map(p=>p.k+' x'+p.n+' '+p.min+'-'+p.max);
// enemies
const E=L.enemies.filter(e=>inZ(e.x,e.y));out.enemies=E.length;const ek={};for(const e of E){ek[e.t]=(ek[e.t]||0)+1}out.enemyKinds=ek;
// items reachable
out.itemsZone=L.items.filter(i=>inZ(i.x,i.y)).length;out.itemsUnreach=L.items.filter(i=>inZ(i.x,i.y)&&d0[i.y*W+i.x]<0).map(i=>[i.k,i.x,i.y]);
out.chests=D.filter(d=>d.loot||/chest/.test(d.k));out.chestsUnreach=out.chests.filter(d=>d0[d.y*W+d.x]<0&&!(d1[d.y*W+d.x]>=0)).map(d=>[d.k,d.x,d.y]);out.chests=out.chests.length;
// dead ends and featureless stretches
const LM=d=>d.npc||d.loot||/lamp|stat|gate|tele|brazier|chest|note|^hpa_/.test(d.k)||d.zone!==undefined;
const lmCells=[];for(const d of D)if(LM(d)&&!d.pic||d.npc==='hgd_note')lmCells.push(d.y*W+d.x);for(const i of L.items)if(inZ(i.x,i.y))lmCells.push(i.y*W+i.x);for(const e of E)lmCells.push(e.y*W+e.x);
const ld=new Int32Array(W*H).fill(-1);{const q=[];for(const c of lmCells){if(ld[c]<0){ld[c]=0;q.push(c)}}for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of DV){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||!pass(nx,ny))continue;const n=ny*W+nx;if(ld[n]>=0)continue;ld[n]=ld[c]+1;q.push(n)}}}
out.deadEnds=[];out.dullCells=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!inZ(x,y)||!pass(x,y)||d0[y*W+x]<0)continue;const wat=L.fmap[y][x]==='6';if(wat)continue;if(nOpen(x,y)===1&&ld[y*W+x]>3)out.deadEnds.push([x,y,ld[y*W+x]]);if(ld[y*W+x]>12)out.dullCells.push([x,y,ld[y*W+x]])}
// lights
out.lightsZone=(L.lights||[]).filter(l=>inZ(Math.floor(l.x),Math.floor(l.y))).length;out.lightSample=(L.lights||[])[5];
// text typos
out.emDash=[];
// placeholders
const ph=/TODO|lorem|undefined|\bsign\b$/i;out.placeholders=[];
// precinct names
out.precincts=hgdmpPrec(L).filter(p=>p.b<ZB).map(p=>[p.name,p.x,p.y,p.b]);
out.kinds={};{const kc={};for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(inZ(x,y)&&pass(x,y)){const k=M.kind[y*W+x];kc[k]=(kc[k]||0)+1}}out.kinds=kc}

// ---- round 2 additions (north) ----
{const A=L._hgpa||{};
 // 1) real lights in the zone and light coverage (BFS steps to the nearest of my lights, per biome)
 const LTs=(A.lights||[]);out.lightsMine=LTs.length;out.lightsByBio=[0,1,2,3].map(b=>LTs.filter(l=>bio[l[1]*W+l[0]]===b).length);
 const src=LTs.map(l=>l[1]*W+l[0]);const ldl=new Int32Array(W*H).fill(-1),qq=[];for(const c of src){if(ldl[c]<0){ldl[c]=0;qq.push(c)}}
 for(let i=0;i<qq.length;i++){const c=qq[i],x=c%W,y=(c/W)|0;for(const [a,b] of DV){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||!pass(nx,ny))continue;const n=ny*W+nx;if(ldl[n]>=0)continue;ldl[n]=ldl[c]+1;qq.push(n)}}
 out.unlit=[0,0,0,0];out.unlitCells=[];out.maxLightDist=[0,0,0,0];const LIMIT=[8,5,7,7];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!inZ(x,y)||!pass(x,y)||d0[y*W+x]<0||L.fmap[y][x]==='6')continue;const b=bio[y*W+x],v=ldl[y*W+x];out.maxLightDist[b]=Math.max(out.maxLightDist[b],v<0?99:v);if(v<0||v>LIMIT[b]){out.unlit[b]++;if(out.unlitCells.length<30)out.unlitCells.push([x,y,v])}}
 // 2) scale table: per kind class the min/max/median effective height
 const cls=[['villager',/^(hg_npc\d|hg_wizard|pickpocket|hgdfc_)/],['door/gate',/^gate$/],['house',/^hg_house/],['statue',/^(hgtb_deco_shellstatue|art_hgxstat|wm_statue)/],['plinth',/plinth/],['lamp',/^(hg_lamp|hgt_lamppost|hpa_post|hpa_lamp|hpa_lampT|hpa_lampost)/],['chest',/^hg_chest/],['table/bench/crate',/^(hgtb_bench|hgtb_furn_table|hpa_crate|hpa_table|hpa_ctable|hpa_chair|hpa_barrel|hpa_cask|hpa_keg|hpa_lid)/],['tree',/^(hgt_fairytree|hgtb_plant_belltree)/],['vine',/vine/],['shellflower',/shellflower|bulbflower/],['sign',/^(sign_|hgdpc_sg_)/],['reeds',/reeds/],['crystal/fungus light',/^(hpa_crys|hpa_mush|hpa_glow|hpa_bulb|hpa_eggs|hpa_brazier)/]];
 out.scaleTable=cls.map(([n,re])=>{const a=[];for(const d of D){if(d.pic||!re.test(d.k))continue;a.push((NPC_H[d.k]||0)*(d.sc||1))}return [n,a.length,a.length?round(Math.min(...a)):0,a.length?round(Math.max(...a)):0,round(med(a))]});
 const en=[];for(const k of ['hgdguard','hgdbug','hgdworm','hgdjelly','hgdspider','hgdb_spider','hgdb_beetle','hgmini2','hgmini3','hgmini4']){const dd=ENEMY_DEF[k];const im=IMG[dd.img];en.push([k,dd.w,im?round(dd.w*im.height/im.width):null])}out.enemyH=en;
 // 3) notes: all notes in zone (wall notes + posts) with their final text
 const nt=D.filter(d=>d.npc==='hgd_note'||d.npc==='hgd_pa_note').map(d=>[d.x,d.y,String(d.npc==='hgd_pa_note'?(d.text||''):(d.pbt||HGDF_NOTES[(d.note||0)%HGDF_NOTES.length]||''))]);
 out.noteN=nt.length;{const c={};for(const n of nt)c[n[2].trim().toLowerCase()]=(c[n[2].trim().toLowerCase()]||0)+1;out.noteDup=Object.entries(c).filter(e=>e[1]>1).length;out.noteBlank=nt.filter(n=>n[2].trim().length<8).length}
 out.noteEmDash=nt.filter(n=>/[—–]/.test(n[2])).length;
 const sg2=D.filter(d=>d.npc==='hgd_sign');out.signBlankText=0;
 // 4) house2 and blank board
 out.house2=D.filter(d=>d.k==='hg_house2').length;out.board=D.filter(d=>/board|signpost/.test(d.k)&&!d.npc).length;
 // 5) vignette props: kinds within 1 of each vignette cell must differ from the other vignettes
 const V=(A.vig||[]).filter(v=>v[1]);const sets=V.map(v=>[v[0],[...new Set(D.filter(d=>d.hpa&&Math.abs(d.x-v[1][0])<=0&&Math.abs(d.y-v[1][1])<=0&&!d.pic).map(d=>d.k))].sort()]);
 out.vigSets=sets;out.vigShared=0;for(let i=0;i<sets.length;i++)for(let j=i+1;j<sets.length;j++){const sh=sets[i][1].filter(k=>sets[j][1].includes(k));if(sh.length>=2)out.vigShared++}
 // 6) rows of identical objects (>=3 of the same kind in one straight line within 6 squares) and identical neighbours at the same cell
 let rows3=0;const pk={};for(const d of D){if(d.pic||d.npc||d.loot)continue;(pk[d.k]=pk[d.k]||[]).push(d)}
 for(const k in pk){const set=new Set(pk[k].map(d=>d.x+','+d.y));for(const d of pk[k]){for(const [a,b] of [[1,0],[0,1]]){let n=1;for(let i=1;i<=3;i++)if(set.has((d.x+a*i)+','+(d.y+b*i)))n++;else break;if(n>=3)rows3++}}}
 out.rows3=rows3;
 out.lightsEngine=null;
}
return out})()
