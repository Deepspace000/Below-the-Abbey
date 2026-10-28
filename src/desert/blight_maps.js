/* ==========================================================================
   THE BLIGHTED ROAD: the parchment area maps (every id 9610 to 9709) in the style of maps_*.js (compare gy_maps.js): drawn from the real level rows, fmap and decor, with the named places numbered and listed.
   A builder gets a map for free: put {t,x,y,k:'place'} rows into the level's mapNames (blKit: C.mapNames.push(...)).
   ========================================================================== */
const BLMP={ground:{'0':'#b3b48c','1':'#b49c76','2':'#c8c2b0','3':'#b4b0a6','4':'#d6d0bc','5':'#8f8468','6':'#7c6e58'},ink:'#241812'};
function blMapDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s,INK=MPL.INK,out=!!L.outdoor;
  const wall=(cx,cy)=>!(R[cy]&&R[cy][cx]==='.'),col=(cx,cy)=>{const g=L.chars&&L.chars[R[cy][cx]],q=(typeof GY!=='undefined'&&GY.col&&GY.col[g])||null;return q||(out?[96,100,92]:[120,100,80])};
  x.save();x.shadowColor='rgba(40,30,10,.5)';x.shadowBlur=14;x.shadowOffsetX=3;x.shadowOffsetY=5;x.fillStyle='#2a2418';x.fillRect(PX-1.6,PY-1.6,PW+3.2,PH+3.2);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    if(wall(cx,cy)){const k=col(cx,cy),v=hash2(cx,cy,5)*12-6;x.fillStyle=`rgb(${Math.max(0,Math.min(255,k[0]*.8+v))|0},${Math.max(0,Math.min(255,k[1]*.8+v))|0},${Math.max(0,Math.min(255,k[2]*.8+v))|0})`}
    else{const f=L.fmap&&L.fmap[cy]?L.fmap[cy][cx]:'x';x.fillStyle=out?((L._ground&&L._ground[f])||BLMP.ground[f]||'#cfc8b6'):'#c9b896'}
    x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2)}
  x.strokeStyle=BLMP.ink;x.lineWidth=.6;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(wall(cx,cy-1)){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(wall(cx,cy+1)){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(wall(cx-1,cy)){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}if(wall(cx+1,cy)){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}}
  x.stroke();
  const D=((typeof G!=='undefined'&&blIs(LEVEL)&&G.decor&&G.decor.length)?G.decor:L.decor).slice().sort((a,b)=>a.y-b.y);
  const BIG=/^(bl_(chapel|hut|mausoleum|angel|crypt|obelisk|column|ccross|tomb|urn)|gy_(candles|chest|mound|hatch2)|ww_(well|stone|totem|crowtree|stump))$/,TREE=/^(gy_dead|ww_(oakmoss|oakface|willow|thorn|pine2)|ltree)/;
  for(const d of D){if(d.found||d.hidden)continue;const k=d.k||'';
    if(BIG.test(k)&&IMG[k]){const im=IMG[k],big=/chapel|mausoleum|hut|crypt|well/.test(k),hh=Math.max(2.4,Math.min(big?12:7,(NPC_H[k]||1)*s*(d.sc||1)*(big?1.4:1.2))),ww=hh*im.width/im.height;x.drawImage(im,X(d.x+.5)-ww/2,Y(d.y+1)-hh+s*.3,ww,hh)}
    else if(TREE.test(k)){x.fillStyle='rgba(60,70,52,.8)';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),Math.max(.9,s*.42),0,6.3);x.fill()}
    else if(/^bl_hedge/.test(k)){x.fillStyle='rgba(88,82,60,.9)';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.6),Math.max(.7,s*.34),0,6.3);x.fill()}
    else if(/^(bl_(stone1|stone2|lean|slab|wcross)|bl_wg\d|bl_mile\d|gy_rpost)/.test(k)){x.fillStyle='#7a766c';x.lineWidth=.25;x.fillRect(X(d.x+.25),Y(d.y+.15),s*.5,s*.7)}
    else if(/^gy_lantern$/.test(k)){x.fillStyle='#e8c050';x.beginPath();x.arc(X(d.x+.5),Y(d.y+.5),Math.max(.6,s*.36),0,6.3);x.fill()}}
  // roofs of the houses: the painted pieces of the sky list, as small dark gables
  for(const sk of (L.sky||[])){if(!sk||sk.w===undefined||sk.z===0||sk.big)continue;x.fillStyle='rgba(70,52,44,.75)';x.fillRect(X(sk.x-sk.w/2),Y(sk.y-1.4),sk.w*s,2.8*s)}
  x.restore();
  const names=L.mapNames||[];
  names.forEach((n,i)=>{const px=X(n.x+.5),py=Y(n.y+.5);x.save();x.fillStyle='rgba(250,240,200,.92)';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(px,py,3.6,0,6.3);x.fill();x.stroke();x.restore();api.text(x,String(i+1),px,py+.2,5.4,INK)});
  api.title(x,LEVEL_NAMES[LEVEL]||L.name||'The Blighted Road','',12,5);
  api.compass(x,50,262,15);
  if(names.length){const a=392,b=40,w=86,lh=10.4,h=14+names.length*lh;api.panel(x,a,b,w,h);api.text(x,'Places',a+w/2,b+8,6.6,'#6a1a0e');
    names.forEach((n,i)=>{api.text(x,(i+1)+'  '+n.t.replace(/^The /,''),a+5,b+17+i*lh,5.2,INK,'left')})}
  {const p=blPlaceOf(LEVEL);if(p){const a=6,b=46,w=84,h=30;api.panel(x,a,b,w,h);api.text(x,'The Blighted Road',a+w/2,b+8,5.6,'#6a1a0e');api.text(x,'Place '+p.n+' of 10',a+w/2,b+17,5.2,INK);api.text(x,'Sale: '+p.sale+(p.sale===1?' stage':' stages'),a+w/2,b+25,5.2,INK)}}}
mplInstall({name:'blight',levels:BL_IDS,draw:blMapDraw,tint:[2,6,0],foot:'You are the yellow arrow. The numbers on the map are listed on the right.'});
/* the world map: one place west of the shut gate of the Western Kingdoms, standing for the whole road (the road's own list is in the Go to area menu) */
function blWorldAdd(){try{if(typeof WORLD_LOCS==='undefined'||WORLD_LOCS.find(l=>l.k==='blightroad'))return;const g=WORLD_LOCS.find(l=>l.k==='westgate');if(!g)return;WORLD_LOCS.push({k:'blightroad',n:'The Blighted Lands',lv:BL_ROAD.map(p=>p.id),x:g.x-92,y:g.y+8,ic:'graves'})}catch(e){console.error('bl world',e)}}
blWorldAdd();
if(typeof wmwBuild==='function'){const _wb=wmwBuild;wmwBuild=function(){const r=_wb.apply(this,arguments);blWorldAdd();return r}}
