/* ==========================================================================
   THE LAKES OF THE MAZE, FILLED IN (prefix hgdl / HGDL). Runs last in the chain. Until now each lake was a placeholder (so no other builder put anything in it); here the placeholder becomes deep water,
   anything that landed on a lake is removed, and the lake gets its own life: reeds along the ragged shore and out in the water, floating lily pads and bundles of reeds, hanging vines on the ring of wall,
   little islets of reeds (two with a chest), crocodiles, eels and snakes, and bees, butterflies and dragonflies flitting over it all.
   ========================================================================== */
for(const n of ['cr_bee0','cr_bee1'])if(!IMG[n])loadImg(n,'assets/'+n+'.png');
const HGDL_PH=String.fromCharCode(0x361);
function hgdlMask(L){if(L._hgdlMask)return L._hgdlMask;const M=L._hgdm,W=M.W,H=M.H,m=new Uint8Array(W*H);for(const k of L._hgdl.lakes)for(let y=k.y0;y<=k.y1;y++)for(let x=k.x0;x<=k.x1;x++)if(L.fmap[y][x]==='6'&&L.rows[y][x]!==undefined&&(L.rows[y][x]==='.'||L.rows[y][x]===HGDL_PH))m[y*W+x]=1;return L._hgdlMask=m}
// remove everything not made for the lake that stands on a lake square, or on the landings round the departure docks (creatures only)
function hgdlClean(L){
  if(!L||!L._hgdl||!L._hgdlDone)return;const W=L._hgdm.W,m=hgdlMask(L),on=o=>m[o.y*W+o.x]===1;
  let n=0;const keep=(arr)=>{const k=arr.filter(o=>o.hgdl||!on(o));n+=arr.length-k.length;return k};
  L.decor=keep(L.decor);L.items=keep(L.items);L.enemies=keep(L.enemies);
  const land=[];for(const k of L._hgdl.lakes)if(k.plaza)for(const c of k.plaza)land.push(c);
  const e2=L.enemies.filter(e=>e.hgdl||!land.some(c=>Math.abs(c[0]-e.x)<=5&&Math.abs(c[1]-e.y)<=5));n+=L.enemies.length-e2.length;L.enemies=e2;
  L._hgdlRemoved=(L._hgdlRemoved||0)+n}
function hgdlFill(L){
  if(L._hgdlDone||!L._hgdl)return;
  // the placeholder becomes open water
  L.rows=L.rows.map(r=>r.indexOf(HGDL_PH)<0?r:r.split(HGDL_PH).join('.'));L._hgdlDone=1;
  const M=L._hgdm,W=M.W,m=hgdlMask(L);hgdlClean(L);hgdbArt();
  const open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',water=(x,y)=>m[y*W+x]===1,wall=(x,y)=>{const c=L.rows[y]&&L.rows[y][x];return !!c&&c!=='.'&&c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8};
  const DV=[[0,-1],[1,0],[0,1],[-1,0]],REED=['hgt_reeds','hgt_reeds','hgt_reeds','art_hgdf_plant1'];
  L._hgdl.agents=[];
  L._hgdl.lakes.forEach((k,li)=>{if(!k.docks)return;const rnd=hgdmRng(475800+li),cells=[],dw=[[k.docks.dep.wx,k.docks.dep.wy],[k.docks.far.wx,k.docks.far.wy]];
    for(let y=k.y0;y<=k.y1;y++)for(let x=k.x0;x<=k.x1;x++)if(water(x,y))cells.push([x,y]);
    const nearD=(x,y,r)=>dw.some(p=>Math.abs(p[0]-x)<=r&&Math.abs(p[1]-y)<=r),shoreD=(x,y)=>{let d=9;for(let r=1;r<=4&&d===9;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)if(Math.max(Math.abs(a),Math.abs(b))===r&&!water(x+a,y+b)){d=r;break}return d};
    const used=new Set(),isFree=(x,y)=>water(x,y)&&!used.has(x+','+y);
    const dec=(kk,x,y,o)=>L.decor.push(Object.assign({k:kk,x,y,block:false,walk:true,deco:true,hgdl:1},o||{}));
    // hanging vines on the ring of wall
    const vs=[];for(const [x,y] of cells)for(const [a,b] of DV)if(wall(x+a,y+b)&&!nearD(x,y,1)&&rnd()<.4&&vs.every(v=>Math.abs(v[0]-x)+Math.abs(v[1]-y)>=3)){vs.push([x,y]);dec('art_hgdf_vine'+((rnd()*4)|0),x,y,{wd:[a,b],pic:1,bob:.9});break}
    // islets: a clump of reeds (blocking) with reeds round it; two have a chest
    const ils=[];let t=0;while(ils.length<5&&t++<400){const c=cells[(rnd()*cells.length)|0];if(shoreD(c[0],c[1])<3||nearD(c[0],c[1],4)||ils.some(q=>Math.abs(q[0]-c[0])+Math.abs(q[1]-c[1])<6))continue;ils.push(c)}
    ils.forEach((c,i)=>{const [x,y]=c;used.add(x+','+y);
      if(i<2&&!(li===0&&i===0))L.decor.push({k:'hg_chestweed',x,y,block:true,hgdTier:2,hgdGive:[],hgdl:1});else dec('hgt_reeds',x,y,{block:true,walk:false,deco:false,sc:1.25});
      for(const [a,b] of DV.concat([[1,1],[-1,1],[1,-1],[-1,-1]])){const xx=x+a,yy=y+b;if(isFree(xx,yy)&&rnd()<.75){used.add(xx+','+yy);dec(REED[(rnd()*4)|0],xx,yy,{sc:.8+rnd()*.5})}}});
    k.islets=ils;
    // reeds along the shore, a few out in the open water, lily pads
    const lilies=[];
    for(const [x,y] of cells){if(!isFree(x,y)||nearD(x,y,1))continue;const sd=shoreD(x,y),r=rnd();
      if(sd===1&&r<.55){used.add(x+','+y);dec(REED[(rnd()*4)|0],x,y,{sc:.8+rnd()*.5})}
      else if(sd>1&&r<.05){used.add(x+','+y);dec('hgt_reeds',x,y,{sc:.8+rnd()*.5})}
      else if(sd>1&&r<.15){used.add(x+','+y);lilies.push([x,y]);dec('art_hgdf_plant6',x,y,{sc:.55+rnd()*.3})}}
    // things to pick up: bundles of reeds in the reed beds, lily flowers on the pads, the lost net by an islet
    const ni=[];const freeI=(x,y)=>water(x,y)&&!L.items.some(i=>i.x===x&&i.y===y)&&!nearD(x,y,1);
    const reedCells=cells.filter(([x,y])=>freeI(x,y)&&shoreD(x,y)<=2&&L.decor.some(d=>d.hgdl&&d.k==='hgt_reeds'&&Math.abs(d.x-x)+Math.abs(d.y-y)<=1&&!d.block));
    for(let i=0;i<5&&reedCells.length;i++){const c=reedCells.splice((rnd()*reedCells.length)|0,1)[0];L.items.push({k:'hglreed',x:c[0],y:c[1],hgdl:1})}
    for(let i=0;i<5&&lilies.length;i++){const c=lilies.splice((rnd()*lilies.length)|0,1)[0];L.items.push({k:'hgllily',x:c[0],y:c[1],hgdl:1})}
    if(li===0&&ils[0]){const [x,y]=ils[0];for(const [a,b] of DV){if(freeI(x+a,y+b)&&!L.decor.some(d=>d.block&&d.x===x+a&&d.y===y+b)){L.items.push({k:'hglnet',x:x+a,y:y+b,hgdl:1});break}}}
    // creatures, only ever in the water of this lake
    const kinds=['hgwcroc','hgwcroc','hgwcroc','hgweel','hgweel','hgweel','hgweel','hgwsnake','hgwsnake','hgwsnake','hgwsnake'];
    const spots=cells.filter(([x,y])=>water(x,y)&&!nearD(x,y,5)&&!L.decor.some(d=>d.block&&d.x===x&&d.y===y)&&!L.items.some(i=>i.x===x&&i.y===y));
    const got=[];for(const kd of kinds){for(let tt=0;tt<60&&spots.length;tt++){const c=spots[(rnd()*spots.length)|0];if(got.some(q=>Math.abs(q[0]-c[0])+Math.abs(q[1]-c[1])<4))continue;got.push(c);L.enemies.push({t:kd,x:c[0],y:c[1],hgdl:1});break}}
    // the life in the air
    const homes=cells.filter(([x,y])=>L.decor.some(d=>d.hgdl&&!d.block&&d.x===x&&d.y===y&&(d.k==='hgt_reeds'||d.k==='art_hgdf_plant6')));
    const BF=['cabbagewhite','brimstone','orangetip','commonblue','smallcopper','peacock','redadmiral','paintedlady','cloudedyellow'];
    const mk=(type,n,kind)=>{for(let i=0;i<n;i++){const h=homes.length?homes[(rnd()*homes.length)|0]:cells[(rnd()*cells.length)|0];L._hgdl.agents.push({lake:li,type,kind:kind?kind[i%kind.length]:null,x:h[0]+.5,y:h[1]+.5,hx:h[0]+.5,hy:h[1]+.5,tx:h[0]+.5,ty:h[1]+.5,t:rnd()*2,ph:rnd()*6,e:{t:'bfly',x:h[0],y:h[1],hp:1}})}};
    mk('bf',8,BF);mk('bee',6);mk('dfl',2)});
  L._hgdl.agentCount=L._hgdl.agents.length}
// the final pass, after every other builder
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdl)try{hgdlFill(L)}catch(e){console.error('hgdl',e)}}}
// whatever a later lazy builder adds before the party enters is swept out too
{const _g=goToLevel;goToLevel=function(n,e){try{if(n===HGD.ID){const L=LEVELS[HGD.ID];if(L&&L._hgdlDone){hgdlClean(L);hgdbArt()}}}catch(x){console.error(x)}return _g.apply(this,arguments)}}
/* ---------- the little flyers: drawn as sprites, flitting over the water of the lakes ---------- */
function hgdlStep(L,dt){
  const m=hgdlMask(L),W=L._hgdm.W,px=G.P.x+.5,py=G.P.y+.5;
  for(const a of L._hgdl.agents){if(Math.abs(a.x-px)>20||Math.abs(a.y-py)>20)continue;
    a.ph+=dt*(a.type==='bf'?9:a.type==='bee'?22:30);a.t-=dt;
    if(a.t<=0||Math.hypot(a.tx-a.x,a.ty-a.y)<.12){
      const R=a.type==='bee'?1.5:a.type==='bf'?4.5:7,step=a.type==='bee'?.4+Math.random()*.8:a.type==='bf'?1+Math.random()*2.5:2+Math.random()*4;
      a.t=a.type==='bee'?.25+Math.random()*.7:a.type==='bf'?.8+Math.random()*2:.3+Math.random()*1.2;
      for(let tr=0;tr<8;tr++){const ang=Math.random()*6.283,nx=a.x+Math.cos(ang)*step,ny=a.y+Math.sin(ang)*step;if(Math.hypot(nx-a.hx,ny-a.hy)<=R&&m[(ny|0)*W+(nx|0)]===1){a.tx=nx;a.ty=ny;break}}}
    const dx=a.tx-a.x,dy=a.ty-a.y,dl=Math.hypot(dx,dy)||1,sp=(a.type==='bee'?2.6:a.type==='bf'?1.1:3.4)*dt,nx=a.x+dx/dl*Math.min(sp,dl),ny=a.y+dy/dl*Math.min(sp,dl);
    if(m[(ny|0)*W+(nx|0)]===1){a.x=nx;a.y=ny}else a.t=0}}
{const _sl=spriteList;let last=performance.now();spriteList=function(){const L=_sl.apply(this,arguments);
  try{const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;const V=LEVEL===HGD.ID&&LEVELS[HGD.ID];
    if(V&&V._hgdl&&V._hgdl.agents&&G.state==='play'){hgdlStep(V,dt);const px=G.P.x+.5,py=G.P.y+.5;
      for(const a of V._hgdl.agents){if(Math.abs(a.x-px)>18||Math.abs(a.y-py)>18)continue;let img=null,w=.2,bob=.4;
        if(a.type==='bf'){const fr=typeof bfFrames==='function'?bfFrames(a.kind):null;if(!fr)continue;img=fr[Math.floor(a.ph)%4];w=.3;bob=.5+Math.sin(a.ph*.3)*.12}
        else if(a.type==='bee'){img=Math.floor(a.ph)%2?IMG.cr_bee1:IMG.cr_bee0;w=.16;bob=.3+Math.sin(a.ph*.2+a.x)*.1+(Math.sin(a.ph)*.02)}
        else{img=IMG.hgtb_jadefinmoth;w=.3;bob=.55+Math.sin(a.ph*.1)*.06}
        if(!img)continue;a.e.x=a.x|0;a.e.y=a.y|0;L.push({x:a.x,y:a.y,img,w,bob,e:a.e,fade:1})}}}catch(e){console.error(e)}
  return L}}
