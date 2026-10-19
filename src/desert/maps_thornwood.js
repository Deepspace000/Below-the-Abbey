/* Area map for the Thornwood (level 2, the abbey grounds and the thorny forest) and the Wolves' Den (level 23): see maps_common.js.
   Dense hatched woodland, thorns, twisted trees, trails, the ruined abbey graveyard, a shrine, a camp and a hollow, in muted greens and browns. */
const MPT_INK='#2a1a0c';
function mpThornwoodWob(x,pts,seed,j){x.beginPath();pts.forEach((p,i)=>{const a=p[0]+(hash2(i,seed,41)-.5)*j,b=p[1]+(hash2(i,seed,42)-.5)*j;i?x.lineTo(a,b):x.moveTo(a,b)});x.stroke()}
/* a twisted, bare-ish thorn tree seen from the front: crooked trunk, hooked branches with thorn ticks, a dark ragged crown */
function mpThornwoodTree(x,a,b,s,seed,dead){
  x.save();x.lineCap='round';x.strokeStyle='#3a2616';x.lineWidth=Math.max(.6,.9*s);
  const lean=(hash2(seed,1,43)-.5)*2.4*s,h=(5.5+hash2(seed,2,43)*3)*s;
  x.beginPath();x.moveTo(a,b);x.bezierCurveTo(a+lean,b-h*.35,a-lean*.8,b-h*.7,a+lean*.4,b-h);x.stroke();
  if(!dead){const g=['#2f4a30','#3a4a2a','#2a3d2c','#40502e'][seed%4];x.fillStyle=g;x.globalAlpha=.7;
    for(let k=0;k<3;k++){x.beginPath();x.ellipse(a+lean*.4+(hash2(seed,k,44)-.5)*3.2*s,b-h-(k?1.2:0)*s+(hash2(seed,k,45)-.5)*s,(1.7+hash2(seed,k,46)*.9)*s,(1.3+hash2(seed,k,47)*.6)*s,0,0,6.3);x.fill()}x.globalAlpha=1}
  x.lineWidth=Math.max(.45,.55*s);
  for(let k=0;k<3;k++){const sd=(k%2?1:-1),y0=b-h*(.35+.2*k),L=(2.4+hash2(seed,k,48)*1.8)*s;
    x.beginPath();x.moveTo(a+lean*.3,y0);x.quadraticCurveTo(a+sd*L*.7,y0-L*.2,a+sd*L,y0-L*.7);x.stroke();
    x.beginPath();x.moveTo(a+sd*L*.62,y0-L*.25);x.lineTo(a+sd*L*.62+sd*.9*s,y0-L*.5);x.stroke()}
  x.restore()}
/* a bramble tangle: loops of thorny cane */
function mpThornwoodBramble(x,a,b,s,seed){
  x.save();x.strokeStyle='#3a2a1a';x.lineWidth=.55;x.lineCap='round';
  for(let k=0;k<3;k++){x.beginPath();const r=(1.6+hash2(seed,k,50)*1.5)*s;x.ellipse(a+(hash2(seed,k,51)-.5)*2*s,b+(hash2(seed,k,52)-.5)*1.2*s,r,r*.55,hash2(seed,k,53)*3,0,Math.PI*1.7);x.stroke()}
  x.lineWidth=.45;for(let k=0;k<5;k++){const an=hash2(seed,k,54)*6.3,r=(1.4+hash2(seed,k,55)*1.8)*s;x.beginPath();x.moveTo(a+Math.cos(an)*r,b+Math.sin(an)*r*.55);x.lineTo(a+Math.cos(an)*(r+1.4*s),b+Math.sin(an)*(r+1.4*s)*.55-.5*s);x.stroke()}
  x.restore()}
function mpThornwoodGrave(x,a,b,s,cross){x.save();x.strokeStyle=MPT_INK;x.lineWidth=.6;
  if(cross){x.beginPath();x.moveTo(a,b-3.4*s);x.lineTo(a,b+1*s);x.moveTo(a-1.5*s,b-2*s);x.lineTo(a+1.5*s,b-2*s);x.stroke()}
  else{x.fillStyle='#bdb49c';x.beginPath();x.moveTo(a-1.4*s,b+1*s);x.lineTo(a-1.4*s,b-1.4*s);x.arc(a,b-1.4*s,1.4*s,Math.PI,0);x.lineTo(a+1.4*s,b+1*s);x.closePath();x.fill();x.stroke()}
  x.restore()}
function mpThornwoodDraw23(c,x,L,api){
  const f=mplFit(12,9,10),W=12,H=9,s=f.s;
  // rock around the den, hatched
  x.fillStyle='rgba(70,60,44,.55)';x.fillRect(f.ox-6,f.oy-6,W*s+12,H*s+12);
  for(let i=0;i<900;i++){const px=f.ox-6+hash2(i,1,60)*(W*s+12),py=f.oy-6+hash2(i,2,60)*(H*s+12);x.strokeStyle='rgba(40,30,20,.35)';x.lineWidth=.6;x.beginPath();x.moveTo(px,py);x.lineTo(px+3,py-3);x.stroke()}
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const ch=L.rows[y][xx];if(ch==='#')continue;
    for(let k=0;k<5;k++){x.fillStyle=k%2?'rgba(190,168,120,.9)':'rgba(176,152,106,.9)';x.beginPath();x.arc(f.X(xx+.5)+(hash2(xx,y*7+k,61)-.5)*s*.7,f.Y(y+.5)+(hash2(xx,y*7+k,62)-.5)*s*.7,s*.62,0,6.3);x.fill()}}
  for(let i=0;i<260;i++){const px=f.X(hash2(i,1,63)*W),py=f.Y(hash2(i,2,63)*H);const cx=Math.floor((px-f.ox)/s),cy=Math.floor((py-f.oy)/s);if((L.rows[cy]||'')[cx]==='#'||!L.rows[cy])continue;x.fillStyle='rgba(90,70,40,.5)';x.beginPath();x.arc(px,py,.6,0,6.3);x.fill()}
  // wall outline: ink on every edge between floor and rock
  x.strokeStyle=MPT_INK;x.lineWidth=1.6;x.lineCap='round';
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){if(L.rows[y][xx]==='#')continue;
    for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){const o=(L.rows[y+dy]||'')[xx+dx];if(o==='#'||o===undefined){const ax=f.X(xx+(dx>0?1:0)),ay=f.Y(y+(dy>0?1:0)),bx=dx?ax:f.X(xx+1),by=dy?ay:f.Y(y+1);const px=dx?ax:f.X(xx),py=dy?ay:f.Y(y);mpThornwoodWob(x,[[px,py],[(px+bx)/2,(py+by)/2],[bx,by]],xx*9+y,1.4)}}}
  for(const d of L.decor||[]){const px=f.X(d.x+.5),py=f.Y(d.y+.5);
    if(d.k==='bones'){x.strokeStyle='#efe8d8';x.lineWidth=1.8;x.beginPath();x.moveTo(px-6,py-3);x.lineTo(px+6,py+3);x.moveTo(px-6,py+3);x.lineTo(px+6,py-3);x.stroke();api.I.skull(x,px,py,1.3)}
    if(d.k==='chest'){x.fillStyle='#8a5a28';x.strokeStyle=MPT_INK;x.lineWidth=1;x.fillRect(px-7,py-5,14,10);x.strokeRect(px-7,py-5,14,10);x.fillStyle=MPL.GOLD;x.fillRect(px-7,py-1.5,14,2);x.fillRect(px-1.5,py-2,3,4)}}
  api.text(x,"Wolves' Den",f.X(6),f.Y(.45),9,'#4a2a12');
  api.text(x,'Way out',f.X(5.5),f.Y(8.55),7,'#4a2a12');
  api.text(x,'Treasure chest',f.X(9.6),f.Y(1.9),6.5,'#4a2a12');
  // the way out: an arrow
  x.fillStyle=MPL.VERM;x.strokeStyle=MPT_INK;x.lineWidth=.8;const ax=f.X(5.5),ay=f.Y(8.9);x.beginPath();x.moveTo(ax-4,ay);x.lineTo(ax+4,ay);x.lineTo(ax,ay+5);x.closePath();x.fill();x.stroke();
  api.title(x,"Wolves' Den",'A cave under the Thornwood');
  api.compass(x,46,264,13);
  api.notes(x,['A cave of wolves under the thorny wood.','Four wolves lair here. Two rooms are joined by a short passage.','Bones lie in three places.','A chest sits in the top right corner.'],11,66,72);
  api.panel(x,394,40,80,64);api.text(x,'Key',434,49,8,MPL.VERM);
  x.fillStyle='#c4aa72';x.fillRect(401,58,10,7);x.strokeStyle=MPT_INK;x.strokeRect(401,58,10,7);api.text(x,'Floor',416,62,6.5,MPT_INK,'left');
  api.I.skull(x,406,76,1);api.text(x,'Bones',416,76,6.5,MPT_INK,'left');
  x.fillStyle='#8a5a28';x.fillRect(401,84,10,7);x.strokeRect(401,84,10,7);api.text(x,'Chest',416,88,6.5,MPT_INK,'left')}
function mpThornwoodDraw(c,x,L,api){
  if(L.name&&/Wolves/.test(L.name)||L.rows.length<12)return mpThornwoodDraw23(c,x,L,api);
  try{if(typeof pfOld==='function')pfOld(2)}catch(e){}
  const W=L.rows[0].length,H=L.rows.length,f=mplFit(W,H),s=f.s,R=L.rows;
  const at=(a,b)=>(R[b]||'')[a]||'T';
  const isT=(a,b)=>at(a,b)==='T';
  const fm=(a,b)=>((L.fmap&&L.fmap[b])||'')[a]==='1';
  // 1. ground wash: pale damp olive where open, deep brown green under the trees (soft blobs so the grid does not show)
  x.save();x.beginPath();x.rect(MPL.AREA.x,MPL.AREA.y,MPL.AREA.w,MPL.AREA.h);x.clip();
  x.fillStyle='rgba(150,142,92,.34)';x.fillRect(MPL.AREA.x,MPL.AREA.y,MPL.AREA.w,MPL.AREA.h);
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){const t=isT(a,y),px=f.X(a+.5),py=f.Y(y+.5);
    for(let k=0;k<(t?3:1);k++){x.fillStyle=t?(k%2?'rgba(40,52,32,.5)':'rgba(56,48,30,.45)'):(hash2(a,y,70)<.5?'rgba(168,160,104,.35)':'rgba(138,134,84,.3)');
      x.beginPath();x.arc(px+(hash2(a,y*3+k,71)-.5)*s*.9,py+(hash2(a,y*3+k,72)-.5)*s*.9,s*(t?1.05:.8)+hash2(a,y,73)*s*.3,0,6.3);x.fill()}}
  // damp patches and mossy grass tufts in the clearings
  for(let i=0;i<260;i++){const a=hash2(i,1,74)*W,b=hash2(i,2,74)*H;if(isT(Math.floor(a),Math.floor(b)))continue;x.strokeStyle='rgba(70,86,40,.6)';x.lineWidth=.5;const px=f.X(a),py=f.Y(b);x.beginPath();x.moveTo(px-1.2,py);x.lineTo(px-.6,py-1.8);x.moveTo(px,py);x.lineTo(px,py-2.2);x.moveTo(px+1.2,py);x.lineTo(px+.6,py-1.8);x.stroke()}
  // 2. trails (floor type 1): dirt ribbon with inked edges
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){if(!fm(a,y)||isT(a,y))continue;const px=f.X(a+.5),py=f.Y(y+.5);
    for(let k=0;k<2;k++){x.fillStyle=k?'rgba(176,146,96,.8)':'rgba(150,120,76,.8)';x.beginPath();x.arc(px+(hash2(a,y+k,75)-.5)*s*.4,py+(hash2(a,y+k,76)-.5)*s*.4,s*.62,0,6.3);x.fill()}
    x.fillStyle='rgba(90,64,36,.6)';x.beginPath();x.arc(px+(hash2(a,y,77)-.5)*s,py+(hash2(a,y,78)-.5)*s,.5,0,6.3);x.fill()}
  // 3. the forest edge: an inked wobbly line along every border between trees and clearing, and diagonal hatching inside the trees
  x.strokeStyle='rgba(32,22,12,.75)';x.lineWidth=.8;x.lineCap='round';
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){if(!isT(a,y))continue;
    for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){if(isT(a+dx,y+dy)||a+dx<0||y+dy<0||a+dx>=W||y+dy>=H)continue;
      const ax=f.X(a+(dx>0?1:0)),ay=f.Y(y+(dy>0?1:0)),px=dx?ax:f.X(a),py=dy?ay:f.Y(y),bx=dx?ax:f.X(a+1),by=dy?ay:f.Y(y+1);
      mpThornwoodWob(x,[[px,py],[(px+bx)/2,(py+by)/2],[bx,by]],a*13+y,1.5)}}
  x.lineWidth=.45;x.strokeStyle='rgba(20,28,16,.5)';
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){if(!isT(a,y))continue;for(let k=0;k<3;k++){const px=f.X(a+hash2(a,y*3+k,79)),py=f.Y(y+hash2(a,y*3+k,80));x.beginPath();x.moveTo(px,py);x.lineTo(px+2.4,py-2.4);x.stroke()}}
  // 5. decor: trees are already drawn as the T cells; draw brambles, graves, crosses, statues, bones, the well and the shrine
  const drawAbbey=()=>{
  // 4. the ruined abbey: a floor of flagstones inside the wall, then the wall as inked blocks, broken in places
  {const x0=1,y0=6,x1=14,y1=19;x.fillStyle='rgba(176,168,148,.75)';x.fillRect(f.X(x0+1),f.Y(y0+1),(x1-x0-1)*s,(y1-y0-1)*s);
   x.strokeStyle='rgba(60,50,36,.45)';x.lineWidth=.4;for(let y=y0+1;y<y1;y++)for(let a=x0+1;a<x1;a++){if(R[y][a]==='#')continue;if(hash2(a,y,81)<.5){x.strokeRect(f.X(a)+.3,f.Y(y)+.3,s-.6,s-.6)}}
   x.fillStyle='rgba(90,120,70,.4)';for(let i=0;i<40;i++){x.beginPath();x.arc(f.X(x0+1+hash2(i,1,82)*(x1-x0-1)),f.Y(y0+1+hash2(i,2,82)*(y1-y0-1)),1+hash2(i,3,82)*1.4,0,6.3);x.fill()}}
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){if(R[y][a]!=='#')continue;const px=f.X(a),py=f.Y(y);
    x.fillStyle=hash2(a,y,83)<.5?'#8f8a78':'#a39d88';x.strokeStyle=MPT_INK;x.lineWidth=.7;x.fillRect(px,py,s,s);x.strokeRect(px+.1,py+.1,s-.2,s-.2);
    x.beginPath();x.moveTo(px,py+s/2);x.lineTo(px+s,py+s/2);x.moveTo(px+s*(.3+.4*hash2(a,y,84)),py);x.lineTo(px+s*(.3+.4*hash2(a,y,84)),py+s/2);x.stroke()}
  // the chapel and its pews inside (the char tiles W,V,U,N and the % floor are chapel fittings)
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){const ch=R[y][a];if(ch==='%'){x.fillStyle='rgba(120,40,30,.3)';x.fillRect(f.X(a),f.Y(y),s,s)}else if('WVUN'.includes(ch)){x.fillStyle='#b9b09a';x.strokeStyle=MPT_INK;x.lineWidth=.6;x.fillRect(f.X(a)+.4,f.Y(y)+.4,s-.8,s-.8);x.strokeRect(f.X(a)+.4,f.Y(y)+.4,s-.8,s-.8)}}
  };
  const items=[],trees=[];
  for(const d of L.decor||[]){const k=d.k;
    if(k==='gbramble'||k==='greeds')items.push([d.y,()=>mpThornwoodBramble(x,f.X(d.x+.5),f.Y(d.y+.7),Math.max(.55,s*.17),d.x*7+d.y)]);
    else if(k==='grave'||k==='grave2')items.push([d.y,()=>mpThornwoodGrave(x,f.X(d.x+.5),f.Y(d.y+.7),s*.3,false)]);
    else if(k==='cross')items.push([d.y,()=>mpThornwoodGrave(x,f.X(d.x+.5),f.Y(d.y+.7),s*.34,true)]);
    else if(k==='statue')items.push([d.y,()=>{const px=f.X(d.x+.5),py=f.Y(d.y+.8);x.fillStyle='#cfc8b4';x.strokeStyle=MPT_INK;x.lineWidth=.7;x.fillRect(px-1.6,py-1,3.2,1.6);x.strokeRect(px-1.6,py-1,3.2,1.6);x.beginPath();x.moveTo(px,py-6);x.lineTo(px+1.8,py-1);x.lineTo(px-1.8,py-1);x.closePath();x.fill();x.stroke();x.beginPath();x.arc(px,py-6.6,1.2,0,6.3);x.fill();x.stroke()}]);
    else if(k==='bones')items.push([d.y,()=>api.I.skull(x,f.X(d.x+.5),f.Y(d.y+.7),.55)]);
    else if(k==='well')items.push([d.y,()=>{const px=f.X(d.x+.5),py=f.Y(d.y+.7);x.fillStyle='#aaa292';x.strokeStyle=MPT_INK;x.lineWidth=.8;x.beginPath();x.ellipse(px,py,3.2,1.9,0,0,6.3);x.fill();x.stroke();x.fillStyle='#1c2630';x.beginPath();x.ellipse(px,py,1.9,1,0,0,6.3);x.fill()}]);
    else if(k==='barrel')items.push([d.y,()=>{const px=f.X(d.x+.5),py=f.Y(d.y+.8);x.fillStyle='#7a5430';x.strokeStyle=MPT_INK;x.lineWidth=.6;x.fillRect(px-1.8,py-3.4,3.6,3.8);x.strokeRect(px-1.8,py-3.4,3.6,3.8)}]);
    else if(k==='gstump')items.push([d.y,()=>{x.fillStyle='#5a3a1c';x.beginPath();x.ellipse(f.X(d.x+.5),f.Y(d.y+.7),1.3,.8,0,0,6.3);x.fill()}]);
    else if(k==='gboulder'||k==='grocks')items.push([d.y,()=>{x.fillStyle=k==='grocks'?'#9a9480':'#8a8472';x.strokeStyle=MPT_INK;x.lineWidth=.5;const px=f.X(d.x+.5),py=f.Y(d.y+.7),r=k==='grocks'?.9:1.5;x.beginPath();x.ellipse(px,py,r*1.2,r*.8,0,0,6.3);x.fill();x.stroke()}]);
    else if(k==='gfungus')items.push([d.y,()=>{const px=f.X(d.x+.5),py=f.Y(d.y+.7);x.fillStyle='#b9a07a';x.beginPath();x.arc(px,py,.9,Math.PI,0);x.fill()}]);}
  // twisted trees: one per forest cell, with some left dead and bare, drawn back to front
  for(let y=0;y<H;y++)for(let a=0;a<W;a++){if(!isT(a,y))continue;const h=hash2(a,y,85);if(h<.12)continue;const seed=(a*31+y*17)|0;
    trees.push([y+.5,()=>mpThornwoodTree(x,f.X(a+.2+hash2(a,y,86)*.6),f.Y(y+.8),s*(.52+hash2(a,y,87)*.22),seed,hash2(a,y,88)<.28)])}
  trees.sort((p,q)=>p[0]-q[0]);for(const it of trees)it[1]();drawAbbey();
  items.sort((p,q)=>p[0]-q[0]);for(const it of items)it[1]();
  // 6. the entrance to the Wolves' Den at the cave mark, a dark mouth in the rock
  {const px=f.X(22.5),py=f.Y(2.9);x.fillStyle='#7c7664';x.strokeStyle=MPT_INK;x.lineWidth=.9;x.beginPath();x.moveTo(px-7,py+3);x.quadraticCurveTo(px-6,py-8,px,py-8);x.quadraticCurveTo(px+6,py-8,px+7,py+3);x.closePath();x.fill();x.stroke();x.fillStyle='#15100a';x.beginPath();x.moveTo(px-3.4,py+3);x.quadraticCurveTo(px-3,py-3.6,px,py-3.6);x.quadraticCurveTo(px+3,py-3.6,px+3.4,py+3);x.closePath();x.fill();x.strokeStyle='rgba(30,22,16,.6)';x.lineWidth=.5;for(let k=0;k<6;k++){x.beginPath();x.moveTo(px-6+k*2,py-6+Math.abs(k-2.5));x.lineTo(px-4+k*2,py-3);x.stroke()}}
  // the abbey spire and a broken chapel roof
  {const px=f.X(5.5),py=f.Y(12.6);api.I.tower(x,px,py,.9);x.strokeStyle=MPT_INK;x.lineWidth=.8;x.beginPath();x.moveTo(px-1.6,py-9.8);x.lineTo(px,py-14.6);x.lineTo(px+1.8,py-9.8);x.stroke()}
  x.restore();
  // 7. a river-like trail does not exist here; place names, hand lettered with a pale halo
  const names=[['Abbey Ruins',8,4.5,7.4,'#3a1c10'],['Chapel',4,17.6,5.6,'#3a1c10'],['Graveyard',9.6,13.4,6,'#3a1c10'],["Wolves' Den",24,5.4,7.2,'#3a1c10'],['Gallows Shrine',24,32.2,7,'#3a1c10'],["Witch's Hut",41,35.4,7.6,'#3a1c10'],['Bandit Camp',46.5,8.4,7,'#3a1c10']];
  // simple glyphs on the places that have no building: a camp tent, a hollow ring of stones, the shrine
  {const px=f.X(48.5),py=f.Y(11);for(const dx of [-3,3]){x.fillStyle=dx<0?'#a8643a':'#7a4a2a';x.strokeStyle=MPT_INK;x.lineWidth=.7;x.beginPath();x.moveTo(px+dx-4,py+2);x.lineTo(px+dx,py-4.6);x.lineTo(px+dx+4,py+2);x.closePath();x.fill();x.stroke()}
   x.fillStyle=MPL.VERM;x.beginPath();x.arc(px+.3,py+3.2,1.3,0,6.3);x.fill();
   const hx=f.X(41),hy=f.Y(32.6);x.strokeStyle=MPT_INK;x.lineWidth=.8;x.fillStyle='rgba(60,70,44,.6)';x.beginPath();x.ellipse(hx,hy,9,5,0,0,6.3);x.fill();for(let k=0;k<9;k++){const an=k*6.283/9;x.fillStyle='#a8a28c';x.beginPath();x.ellipse(hx+Math.cos(an)*9,hy+Math.sin(an)*5,1.6,2,0,0,6.3);x.fill();x.stroke()}
   x.fillStyle='#5a2a40';x.strokeStyle=MPT_INK;x.beginPath();x.arc(hx,hy,2.2,0,6.3);x.fill();x.stroke();x.strokeStyle='#d8c8e0';x.lineWidth=.5;x.beginPath();x.moveTo(hx-1.4,hy);x.lineTo(hx+1.4,hy);x.stroke();
   const gx=f.X(24.5),gy=f.Y(29.6);x.strokeStyle=MPT_INK;x.lineWidth=1.3;x.beginPath();x.moveTo(gx-6,gy+2);x.lineTo(gx-6,gy-6);x.lineTo(gx+5,gy-6);x.lineTo(gx+5,gy-4);x.stroke();x.lineWidth=.7;x.beginPath();x.moveTo(gx+5,gy-4);x.lineTo(gx+5,gy-1);x.stroke();x.beginPath();x.arc(gx+5,gy,1.1,0,6.3);x.stroke()}
  for(const [t,a,b,sz,col] of names)api.text(x,t,f.X(a),f.Y(b),sz,col);
  api.text(x,'THORNWOOD',f.X(31),f.Y(38.5),11,'#2c3a24');
  // 8. margins
  api.title(x,'Thornwood','A grim forest of thorns and graves');
  api.compass(x,46,268,13);
  api.panel(x,6,54,82,150);
  api.notes(x,['A dark forest of twisted thorn trees.','Wolves den under rock in the north. Bandits camp in the east.','A witch keeps a hut in the south east.','An old abbey lies ruined in the west, with its graveyard.','Follow the pale dirt trails.'],11,64,72,6.2,4);
  api.panel(x,394,40,80,96);api.text(x,'Key',434,49,8,MPL.VERM);
  const key=[['tree','Thorn tree'],['bram','Bramble'],['grave','Grave'],['wall','Abbey wall'],['trail','Trail']];
  key.forEach(([k,t],i)=>{const kx=406,ky=63+i*14;
    if(k==='tree')mpThornwoodTree(x,kx,ky+4,.9,3,false);else if(k==='bram')mpThornwoodBramble(x,kx,ky+1,.9,5);else if(k==='grave')mpThornwoodGrave(x,kx,ky+2,.9,true);
    else if(k==='wall'){x.fillStyle='#a39d88';x.strokeStyle=MPT_INK;x.lineWidth=.7;x.fillRect(kx-5,ky-2,10,6);x.strokeRect(kx-5,ky-2,10,6)}
    else{x.fillStyle='rgba(165,134,86,.9)';x.fillRect(kx-5,ky-1,10,4)}
    api.text(x,t,418,ky+1,6.5,MPT_INK,'left')});
  // small flourishes: ravens over the wood
  x.save();x.strokeStyle=MPT_INK;x.lineWidth=1;x.lineCap='round';for(const [a,b] of [[394,150],[420,160],[448,148]]){x.beginPath();x.moveTo(a-5,b);x.quadraticCurveTo(a-2.5,b-4,a,b);x.quadraticCurveTo(a+2.5,b-4,a+5,b);x.stroke()}x.restore();
  api.notes(x,['Brambles snag the careless in the forest.','Graves stand in the abbey yard and one lonely shrine in the south.'],399,186,70,6.2,4)}
mplInstall({name:'thornwood',levels:[2,23],draw:mpThornwoodDraw,foot:'You are the yellow arrow. Thorns grow thick off the trails.',tint:[-8,-4,-12],
  fit:L=>mplFit(L.rows[0].length,L.rows.length,L.rows.length<12?10:4)});
