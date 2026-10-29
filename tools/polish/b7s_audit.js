// evaluated in page. Audits levels listed in window.__ids. Returns per-level report.
(()=>{
const ids=window.__ids,res={};
const DV=[[0,-1],[1,0],[0,1],[-1,0]];
for(const id of ids){
 let L=LEVELS[id];if(!L&&KH_LAZY[id]){try{KH_LAZY[id]();L=LEVELS[id]}catch(e){res[id]={err:'lazy '+e};continue}}
 if(!L){res[id]={err:'no level'};continue}
 const R={};res[id]=R;const rows=L.rows,H=rows.length,W=rows[0].length;R.size=[W,H];R.name=L.name;
 const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';
 const doorAt=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return null;const c=rows[y][x];if(c==='.')return null;const g=L.chars&&L.chars[c];const d=g!==undefined&&KH_DOOR[g];return d||null};
 R.badRows=rows.filter(r=>r.length!==W).length;
 const blk=new Map();for(const d of L.decor){if((d.block&&!d.walk)||(d.npc&&d.solid))blk.set(d.x+','+d.y,d)}
 R.start=[L.start.x,L.start.y,open(L.start.x,L.start.y)];
 R.nan=[];for(const d of L.decor)if(!isFinite(d.x)||!isFinite(d.y)||(d.sc!==undefined&&!isFinite(d.sc)))R.nan.push(['decor',d.k,d.x,d.y]);
 for(const e of L.enemies)if(!isFinite(e.x)||!isFinite(e.y))R.nan.push(['en',e.t]);
 for(const e of L.items)if(!isFinite(e.x)||!isFinite(e.y))R.nan.push(['item',e.k]);
 R.offOrWall=[];for(const d of L.decor){if(d.pic||d.hidden)continue;if(!open(d.x,d.y))R.offOrWall.push(['decor',d.k,d.x,d.y,(d.npc||'')])}
 for(const e of L.enemies)if(!open(e.x,e.y))R.offOrWall.push(['enemy',e.t,e.x,e.y]);
 for(const e of L.items)if(!open(e.x,e.y))R.offOrWall.push(['item',e.k,e.x,e.y]);
 R.missingImg=[];{const seen={};for(const d of L.decor){if(d.pic)continue;const k=d.k;if(k&&!seen[k]){seen[k]=1;if(!IMG[k]&&NPC_H[k]===undefined)R.missingImg.push(k)}}}
 const seen=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];
 const isGateThru=(x,y)=>{const d=doorAt(x,y);return d&&(d.vt==='lock'||d.vt==='secret'||d.vt==='ringgate')};
 for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of DV){const nx=x+a,ny=y+b,k=nx+','+ny;if(seen.has(k)||nx<0||ny<0||nx>=W||ny>=H)continue;if(!(open(nx,ny)||isGateThru(nx,ny)))continue;if(blk.has(k))continue;seen.add(k);q.push([nx,ny])}}
 const sn=new Set([L.start.x+','+L.start.y]),q2=[[L.start.x,L.start.y]];
 for(let i=0;i<q2.length;i++){const [x,y]=q2[i];for(const [a,b] of DV){const nx=x+a,ny=y+b,k=nx+','+ny;if(sn.has(k)||nx<0||ny<0||nx>=W||ny>=H)continue;if(!(open(nx,ny)||isGateThru(nx,ny)))continue;sn.add(k);q2.push([nx,ny])}}
 R.openCells=0;R.unreachGeom=[];R.unreachProp=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!open(x,y))continue;R.openCells++;const k=x+','+y;if(!sn.has(k))R.unreachGeom.push([x,y]);else if(!seen.has(k)&&!blk.has(k))R.unreachProp.push([x,y])}
 R.unreachGeomN=R.unreachGeom.length;R.unreachPropN=R.unreachProp.length;R.unreachGeom=R.unreachGeom.slice(0,30);R.unreachProp=R.unreachProp.slice(0,30);
 R.doors=[];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const d=doorAt(x,y);if(!d)continue;const fr=DV.map(([a,b])=>[x+a,y+b]).filter(([a,b])=>open(a,b));const frOK=fr.filter(([a,b])=>seen.has(a+','+b)&&!blk.has(a+','+b));R.doors.push({x,y,lvl:d.lvl,vt:d.vt,sale:d.sale?1:0,front:fr.length,frontOK:frOK.length})}
 R.doorNoFront=R.doors.filter(d=>d.frontOK===0).map(d=>[d.x,d.y,d.lvl,d.vt,d.front]);
 R.doorBadTarget=R.doors.filter(d=>d.lvl!==undefined&&!LEVELS[d.lvl]&&!KH_LAZY[d.lvl]).map(d=>[d.x,d.y,d.lvl]);
 R.npcBlockedFront=[];
 for(const d of L.decor){if(!d.npc||d.pic)continue;const nb=DV.map(([a,b])=>[d.x+a,d.y+b]).filter(([a,b])=>open(a,b));const ok=nb.filter(([a,b])=>seen.has(a+','+b)&&!blk.has(a+','+b));if(!ok.length)R.npcBlockedFront.push([d.npc,d.k,d.x,d.y])}
 R.itemUnreach=L.items.filter(i=>!seen.has(i.x+','+i.y)).map(i=>[i.k,i.x,i.y]);
 R.enemyUnreach=L.enemies.filter(i=>!seen.has(i.x+','+i.y)).map(i=>[i.t,i.x,i.y]);
 R.dupNear=[];const D=L.decor.filter(d=>!d.pic&&d.k&&!d.hidden);
 for(let i=0;i<D.length;i++)for(let j=i+1;j<D.length;j++){const a=D[i],b=D[j];if(a.k!==b.k)continue;const c=Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));if(c<=2)R.dupNear.push([a.k,a.x,a.y,b.x,b.y,c])}
 R.dupNearN=R.dupNear.length;R.dupNear=R.dupNear.slice(0,80);
 R.stack=[];{const m={};for(const d of D){const k=d.x+','+d.y;(m[k]=m[k]||[]).push(d)}for(const k in m){const a=m[k].filter(d=>NPC_H[d.k]===undefined||NPC_H[d.k]>.25);if(a.length>1)R.stack.push([k,a.map(d=>d.k+(d.block?'*':'')).join('+')])}}
 R.stackN=R.stack.length;R.stack=R.stack.slice(0,60);
 R.enemyPile=[];for(let i=0;i<L.enemies.length;i++)for(let j=i+1;j<L.enemies.length;j++){const a=L.enemies[i],b=L.enemies[j];if(a.x===b.x&&a.y===b.y)R.enemyPile.push([a.t,b.t,a.x,a.y])}
 R.enemyAdj=[];for(let i=0;i<L.enemies.length;i++)for(let j=i+1;j<L.enemies.length;j++){const a=L.enemies[i],b=L.enemies[j];if(a.t===b.t&&Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y))<=1)R.enemyAdj.push([a.t,a.x,a.y,b.x,b.y])}
 R.enemyTight=L.enemies.filter(e=>DV.filter(([a,b])=>open(e.x+a,e.y+b)&&!blk.has((e.x+a)+','+(e.y+b))).length<=2).map(e=>[e.t,e.x,e.y]);
 R.doorFrontBlocked=[];for(const d of R.doors){for(const [a,b] of DV){const fx=d.x+a,fy=d.y+b;if(open(fx,fy)&&blk.has(fx+','+fy))R.doorFrontBlocked.push([d.x,d.y,fx,fy,blk.get(fx+','+fy).k])}}
 const free=(x,y)=>open(x,y)&&!blk.has(x+','+y);
 const tight=[];
 for(const k of seen){const [x,y]=k.split(',').map(Number);if(!free(x,y))continue;
   let hw=1,vw=1;for(let a=x-1;free(a,y);a--)hw++;for(let a=x+1;free(a,y);a++)hw++;for(let b=y-1;free(x,b);b--)vw++;for(let b=y+1;free(x,b);b++)vw++;
   const nF=DV.filter(([a,b])=>free(x+a,y+b)).length;
   if(Math.min(hw,vw)===1&&nF>=1&&nF<=2){
     let hg=1,vg=1;for(let a=x-1;open(a,y);a--)hg++;for(let a=x+1;open(a,y);a++)hg++;for(let b=y-1;open(x,b);b--)vg++;for(let b=y+1;open(x,b);b++)vg++;
     tight.push([x,y,Math.min(hg,vg)>=2?1:0]);}
 }
 R.tightN=tight.length;
 R.tightByProp=tight.filter(t=>t[2]).map(t=>t.slice(0,2)).slice(0,60);
 R._tight=tight.map(t=>t.slice(0,2));
 R.decorN=L.decor.length;R.lights=(L.lights||[]).length;R.enemiesN=L.enemies.length;R.itemsN=L.items.length;
 const kc={};for(const d of L.decor)kc[d.k]=(kc[d.k]||0)+1;R.kinds=Object.keys(kc).length;
}
return res})()
