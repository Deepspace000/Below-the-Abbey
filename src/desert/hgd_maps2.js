/* ==========================================================================
   THE DEEPER HOLLOW MAPS, REDRAWN (prefix hgdm3 / HGDM3). The maze map is now drawn like a hand-inked medieval map instead of a grid of squares: soft watercolour washes for each biome,
   wobbly ink-lined passages with rounded corners, hatching along the walls, painted trees and fountains in the clearings, and a much finer picture (sheets are painted five times as sharp).
   Also: the thieves' houses, the lakes (deep water, dark blue) and their docks, and one more view, the Drowned Maze (the watery passages).
   Replaces hgdmpSheet and the underlevel sheet of hgd_maps.js.
   ========================================================================== */
for(const n of ['tree0','tree1','tree2','fountain','thouse','pond','reeds','croc'])loadImg('icn_hgdi_'+n,'assets/icn_hgdi_'+n+'.png');
HGDMP.views.push(['Drowned','The Drowned Maze',0,0,61,61]);
const HGDM3={S:5,order:[]};
const hgdm3H=(a,b)=>{const t=Math.sin(a*127.1+b*311.7)*43758.5453;return t-Math.floor(t)};
const hgdm3RGB=h=>{const n=parseInt(h.slice(1),16);return [n>>16&255,n>>8&255,n&255]};
function hgdm3Canvas(S){const c=document.createElement('canvas');c.width=DW*S;c.height=DH*S;const x=c.getContext('2d');x.scale(S,S);return {c,x}}
// keep only the newest few sheets (each is a large canvas)
function hgdm3Keep(vi){const o=HGDM3.order.filter(v=>v!==vi);o.push(vi);while(o.length>3){const d=o.shift();delete HGDMP.cache[d]}HGDM3.order=o}
const hgdm3Vn=(u,v)=>{const a=Math.floor(u),b=Math.floor(v),fu=u-a,fv=v-b,s1=fu*fu*(3-2*fu),s2=fv*fv*(3-2*fv),h=(i,j)=>hgdm3H(a+i,b+j);return (h(0,0)*(1-s1)+h(1,0)*s1)*(1-s2)+(h(0,1)*(1-s1)+h(1,1)*s1)*s2};
const hgdm3Mix=(hex,to,t)=>{const c=hgdm3RGB(hex);return 'rgb('+[0,1,2].map(i=>Math.round(c[i]+(to[i]-c[i])*t)).join(',')+')'};
/* lone posts inside open ground (a tree or a pillar standing in a clearing or a pool) are painted as floor, so the map shows no holes; the trees themselves are drawn on top */
function hgdm3Fill(rows,L,loose){const dk=new Set();if(L&&L.decor)for(const d of L.decor)if(d.k==='hgt_fairytree'||d.k==='hgtb_plant_belltree'||d.k==='hgtb_deco_fountain')dk.add(d.x+','+d.y);const H=rows.length,W=rows[0].length,out=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++){let ch=rows[y][x];if(ch!=='.'&&x>0&&y>0&&x<W-1&&y<H-1){let n=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if((i||j)&&rows[y+j][x+i]==='.')n++;if((loose&&n===8)||(n===8&&L&&L._hgdm&&L._hgdm.kind[y*W+x-1]>0&&L._hgdm.kind[y*W+x+1]>0)||(n>=4&&dk.has(x+','+y)))ch='.'}r+=ch}out.push(r)}return out}
/* the little things painted on the floors of clearings, rooms, atriums and pools (drawn on the floor layer with source-atop, so they never spill onto the ink) */
function hgdm3Deco(g,cx,cy,c0,a,b,s,fine){
  const h=k=>hgdm3H(cx*7+k,cy*3+k*5),r=Math.max(.12,s*.05);g.lineCap='round';
  if(c0===1||c0===3){
    const dense=c0===3?1.7:1;
    if(h(1)<.2*dense){g.strokeStyle=h(2)<.5?'rgba(52,92,40,.85)':'rgba(84,110,40,.85)';g.lineWidth=r;g.beginPath();const bx=a+(h(3)-.5)*s*.6,by=b+(h(4)-.5)*s*.6;for(let k=0;k<4;k++){const d=(k-1.5)*s*.11;g.moveTo(bx+d,by+s*.12);g.quadraticCurveTo(bx+d*1.2,by-s*.02,bx+d*2.1,by-s*(.12+h(5+k)*.1))}g.stroke()}
    if(h(9)<.045*dense){g.fillStyle=['#e8b0c0','#f0d060','#fff','#c090d8'][(h(10)*4)|0];const fx=a+(h(11)-.5)*s*.7,fy=b+(h(12)-.5)*s*.7;g.beginPath();g.arc(fx,fy,r*1.1,0,6.3);g.fill()}
    if(h(13)<.035){const px=a+(h(14)-.5)*s*.6,py=b+(h(15)-.5)*s*.6;g.fillStyle='#b9b6a6';g.strokeStyle='rgba(60,50,40,.8)';g.lineWidth=r*.7;g.beginPath();g.ellipse(px,py,s*.11,s*.07,h(16)*3,0,6.3);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(px-s*.03,py-s*.02,s*.04,s*.02,0,0,6.3);g.fill()}
    if(c0===3&&h(17)<.05){g.strokeStyle='rgba(40,84,40,.85)';g.lineWidth=r*1.2;g.beginPath();const fx=a+(h(18)-.5)*s*.4,fy=b+s*.15;for(let k=-2;k<=2;k++){g.moveTo(fx,fy);g.quadraticCurveTo(fx+k*s*.12,fy-s*.18,fx+k*s*.2,fy-s*.05+Math.abs(k)*s*.04)}g.stroke()}
    if(h(19)<.03){g.fillStyle='rgba(60,96,44,.8)';for(let k=0;k<3;k++){g.beginPath();g.arc(a+(h(20+k)-.5)*s*.6,b+(h(23+k)-.5)*s*.6,s*.09,0,6.3);g.fill()}}
  }else if(c0===2){
    if(h(1)<.12){g.strokeStyle='rgba(90,58,26,.5)';g.lineWidth=r*.8;g.beginPath();const bx=a+(h(2)-.5)*s*.5,by=b+(h(3)-.5)*s*.5;g.moveTo(bx,by);g.lineTo(bx+s*.3*(h(4)-.5)*2,by+s*.18*(h(5)-.5)*2);g.lineTo(bx+s*.45*(h(6)-.5)*2,by+s*.3*(h(7)-.5)*2);g.stroke()}
    if(h(8)<.07){g.fillStyle='rgba(120,90,50,.5)';g.beginPath();g.ellipse(a+(h(9)-.5)*s*.5,b+(h(10)-.5)*s*.5,s*.1,s*.07,h(11)*3,0,6.3);g.fill()}
    if(fine&&h(12)<.3){g.strokeStyle='rgba(90,58,26,.4)';g.lineWidth=r*.7;g.beginPath();const w=s*(.3+h(13)*.2),q=k=>(h(14+k)-.5)*s*.18;g.moveTo(a-w+q(0),b-w*.8+q(1));g.lineTo(a+w+q(2),b-w*.8+q(3));g.lineTo(a+w+q(4),b+w*.8+q(5));g.lineTo(a-w+q(6),b+w*.8+q(7));g.closePath();if(h(20)<.5){g.fillStyle=h(21)<.5?'rgba(110,70,30,.10)':'rgba(255,248,225,.16)';g.fill()}g.stroke()}
  }else if(c0===4){
    if(h(1)<.45){g.strokeStyle=h(2)<.5?'rgba(255,255,255,.75)':'rgba(30,80,120,.35)';g.lineWidth=r;g.beginPath();const bx=a+(h(3)-.5)*s*.4,by=b+(h(4)-.5)*s*.5;g.moveTo(bx-s*.3,by);g.quadraticCurveTo(bx-s*.15,by-s*.13,bx,by);g.quadraticCurveTo(bx+s*.15,by+s*.13,bx+s*.3,by);g.stroke()}
    if(h(5)<.05){g.fillStyle='rgba(70,130,60,.9)';g.beginPath();g.ellipse(a,b,s*.2,s*.13,0,.4,5.9);g.lineTo(a,b);g.fill()}
  }}
/* the painter. o: rows,W,H (cells), vx..vh (the view), X,Y,s (cell to sheet), S, cat(cx,cy) 0 passage 1 clearing 2 room 3 atrium 4 water, rock(cx,cy) -> [r,g,b], floors (colours by cat), hatch colour, blot (blotch colours by cat) */
function hgdm3Paint(x,o){
  const {rows,W,H,vx,vy,vw,vh,X,Y,s}=o,INK=o.ink||MPL.INK,A=MPL.AREA,open=(a,b)=>rows[b]&&rows[b][a]==='.';
  const x0=Math.max(0,vx-1),x1=Math.min(W,vx+vw+1),y0=Math.max(0,vy-1),y1=Math.min(H,vy+vh+1),fine=s>=2.4;
  x.save();x.beginPath();x.rect(Math.max(A.x,X(vx)),Math.max(A.y,Y(vy)),Math.min(A.w,vw*s),Math.min(A.h,vh*s));x.clip();
  // the wash: three pixels per cell, with soft noise, darkened a little near the passages, stretched smooth like watercolour
  {const R=3,wc=document.createElement('canvas');wc.width=W*R;wc.height=H*R;const wx=wc.getContext('2d'),im=wx.createImageData(W*R,H*R),near=new Uint8Array(W*H);
    for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){let n=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if(open(cx+i,cy+j))n++;near[cy*W+cx]=n}
    for(let py=0;py<H*R;py++)for(let px=0;px<W*R;px++){const cx=(px/R)|0,cy=(py/R)|0,c=o.rock(cx,cy),i=(py*W*R+px)*4,
      n=(hgdm3Vn(px/(R*3.2),py/(R*3.2))-.5)*20+(hgdm3H(px,py)-.5)*9,f=1-.03*near[cy*W+cx];
      im.data[i]=c[0]*f+n;im.data[i+1]=c[1]*f+n;im.data[i+2]=c[2]*f+n;im.data[i+3]=255}
    wx.putImageData(im,0,0);x.save();x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.globalAlpha=.92;x.drawImage(wc,0,0,W*R,H*R,X(0),Y(0),W*s,H*s);x.restore()}
  // hatching along the walls, in short pen strokes
  if(s>=2.2){x.strokeStyle=o.hatch||'rgba(42,26,12,.4)';x.lineWidth=Math.max(.14,s*.035);x.lineCap='round';x.beginPath();
    for(let cy=y0;cy<y1;cy++)for(let cx=x0;cx<x1;cx++){if(open(cx,cy))continue;if(!(open(cx-1,cy)||open(cx+1,cy)||open(cx,cy-1)||open(cx,cy+1)))continue;
      const a=X(cx),b=Y(cy),n=s>=5?4:3;for(let k=0;k<n;k++){const h1=hgdm3H(cx*3+k,cy),h2=hgdm3H(cy*3+k,cx+9),px=a+h1*s*.85+.08*s,py=b+h2*s*.7+.1*s,l=s*(.16+.1*hgdm3H(cx+k,cy*2));x.moveTo(px,py);x.lineTo(px+l*.8,py+l*1.2)}}
    x.stroke()}
  if(o.rockDeco)o.rockDeco(x,{open,x0,x1,y0,y1});
  // the passages: every open cell is a wobbly pen line to its neighbours
  const cat=o.cat,pw=o.pw||[.66,1.4,1.4,1.4,1.4,1.4],ow=Math.max(.15,s*.09),paths=[0,1,2,3,4,5].map(()=>new Path2D()),used=[0,0,0,0,0,0];
  const px=(cx,cy)=>X(cx+.5)+(hgdm3H(cx,cy)-.5)*s*.2,py=(cx,cy)=>Y(cy+.5)+(hgdm3H(cy+5,cx)-.5)*s*.2;
  for(let cy=y0;cy<y1;cy++)for(let cx=x0;cx<x1;cx++){if(!open(cx,cy))continue;const c0=cat(cx,cy),a=px(cx,cy),b=py(cx,cy);paths[c0].moveTo(a,b);paths[c0].lineTo(a+.01,b);used[c0]=1;
    for(const [dx,dy] of [[1,0],[0,1]]){const nx=cx+dx,ny=cy+dy;if(nx>=x1||ny>=y1||!open(nx,ny))continue;const c1=(c0&&cat(nx,ny))?Math.max(c0,cat(nx,ny)):0,a2=px(nx,ny),b2=py(nx,ny),w=(hgdm3H(cx*2,cy+nx)-.5)*s*.14;
      paths[c1].moveTo(a,b);paths[c1].quadraticCurveTo((a+a2)/2+(dy?w:0),(b+b2)/2+(dx?w:0),a2,b2);used[c1]=1}}
  x.lineCap='round';x.lineJoin='round';
  const each=(f)=>{for(let c=0;c<6;c++)if(used[c])f(c)};
  // a soft shadow round the ink, then the ink twice (a faint second pass a hair off, like a pen going over it again)
  const hl=o.halo||['rgba(50,30,12,.13)','rgba(50,30,12,.15)'];
  each(c=>{x.strokeStyle=hl[0];x.lineWidth=pw[c]*s+7*ow;x.stroke(paths[c])});
  each(c=>{x.strokeStyle=hl[1];x.lineWidth=pw[c]*s+4.5*ow;x.stroke(paths[c])});
  x.save();x.translate(s*.035,s*.03);x.globalAlpha=.5;each(c=>{x.strokeStyle=INK;x.lineWidth=pw[c]*s+2.6*ow;x.stroke(paths[c])});x.restore();
  each(c=>{x.strokeStyle=INK;x.lineWidth=pw[c]*s+2*ow;x.stroke(paths[c])});
  // the floors, painted on their own layer: shaded edge in three bands, soft blotches, then the little things
  const lay=hgdm3Canvas(o.S),g=lay.x;g.lineCap='round';g.lineJoin='round';
  const shade=o.shade||[70,44,20];
  [[1,.34],[.95,.17],[.9,0]].forEach(([k,t])=>each(c=>{g.strokeStyle=hgdm3Mix(o.floors[c],shade,t);g.lineWidth=pw[c]*s*k;g.stroke(paths[c])}));
  g.globalCompositeOperation='source-atop';
  for(let cy=y0;cy<y1;cy++)for(let cx=x0;cx<x1;cx++){if(!open(cx,cy))continue;const c0=cat(cx,cy),a=px(cx,cy),b=py(cx,cy);
    if(c0>0&&hgdm3H(cx+1,cy*5)<.06){const r=s*(1.2+hgdm3H(cy,cx)*2.4),gr=g.createRadialGradient(a,b,0,a,b,r),bc=(o.blot||['','rgba(70,110,40,','rgba(150,100,40,','rgba(40,110,60,','rgba(30,90,150,','rgba(10,40,110,'])[c0];gr.addColorStop(0,bc+'.2)');gr.addColorStop(1,bc+'0)');g.fillStyle=gr;g.fillRect(a-r,b-r,2*r,2*r)}
    if(c0===0){if(o.corridorDeco)o.corridorDeco(g,cx,cy,a,b,s)}
    else if(fine||hgdm3H(cx,cy)<.4)(o.deco||hgdm3Deco)(g,cx,cy,c0,a,b,s,fine)}
  x.drawImage(lay.c,0,0,DW,DH);
  x.restore()}
/* ---------- the maze: views 0 to 4 ---------- */
function hgdm3Maze(vi){
  const L=LEVELS[HGD.ID];if(!L||!L._hgdp)return null;if(HGDMP.cache[vi])return HGDMP.cache[vi];
  const M=L._hgdm,W=M.W,H=M.H,bio=M.bio,kind=M.kind,rows=L._hgdm3r||(L._hgdm3r=hgdm3Fill(L.rows,L)),V=HGDMP.views[vi],[,vname,vx,vy,vw,vh]=V,A=MPL.AREA,pad=4,s=Math.min((A.w-2*pad)/vw,(A.h-2*pad)/vh),ox=A.x+(A.w-vw*s)/2,oy=A.y+(A.h-vh*s)/2;
  const X=c=>ox+(c-vx)*s,Y=c=>oy+(c-vy)*s,{c,x}=hgdm3Canvas(HGDM3.S);mplParchment(x);const INK=MPL.INK,big=vi>0,tint=HGDMP.tints.map(hgdm3RGB);
  const wet=(a,b)=>L.fmap&&L.fmap[b]&&L.fmap[b][a]==='5',deep=(a,b)=>L.fmap&&L.fmap[b]&&L.fmap[b][a]==='6';
  hgdm3Paint(x,{rows,W,H,vx,vy,vw,vh,X,Y,s,S:HGDM3.S,hatch:'rgba(46,28,12,.42)',
    rock:(cx,cy)=>{const t=tint[bio[cy*W+cx]]||tint[0];return [t[0]*.93,t[1]*.93,t[2]*.9]},
    cat:(cx,cy)=>deep(cx,cy)?5:wet(cx,cy)?4:kind[cy*W+cx]||0,floors:['#f6efd6','#e2ecc6','#f1dcb0','#d2e3b4','#a6dcf2','#2a5c92']});
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  const inV=(a,b)=>a>=vx-1&&a<=vx+vw+1&&b>=vy-1&&b<=vy+vh+1,ix=(n,a,b,w)=>hgdiDraw(x,n,a,b,w);
  // the lakes: their reed beds are drawn, the docks are marked by hgd_boat.js
  if(L._hgdl)for(const k of L._hgdl.lakes){if(!k.islets)continue;for(const c of k.islets)if(inV(c[0],c[1]))ix('reeds',X(c[0]+.5),Y(c[1]+.5)+s*.8,Math.max(5,Math.min(10,s*2.2)))}
  if(L._hgdw)for(const e of L._hgdw.entrances)if(inV(e.x,e.y))ix('pond',X(e.x+.5)-s*1.2,Y(e.y+.5)+s*1.4,Math.max(6,Math.min(13,s*2.8)));
  // trees and fountains, painted; thinned so they do not hide the passages
  const taken=new Set(),gap=big?3.6:4.4,tw=Math.max(4.2,Math.min(10,s*2.5));
  for(const d of L.decor){if(!inV(d.x,d.y)||wet(d.x,d.y)||deep(d.x,d.y))continue;const px=X(d.x+.5),py=Y(d.y+.5);
    if(d.k==='hgt_fairytree'||d.k==='hgtb_plant_belltree'){const key=((px/gap)|0)+','+((py/gap)|0);if(taken.has(key))continue;taken.add(key);ix('tree'+(d.k==='hgtb_plant_belltree'?2:hgdm3H(d.x,d.y)<.5?0:1),px,py+tw*.38,tw)}
    else if(d.k==='hgtb_deco_fountain')ix('fountain',px,py+tw*.4,tw*1.25)}
  // danger rings and warning signs
  for(const z of L._hgdp.zones){if(z.type!=='danger')continue;if(z.x+z.r<vx||z.x-z.r>vx+vw||z.y+z.r<vy||z.y-z.r>vy+vh)continue;
    x.save();x.strokeStyle='#9a2418';x.lineWidth=big?.9:.7;x.setLineDash([2.4,3]);x.beginPath();x.arc(X(z.x+.5),Y(z.y+.5),z.r*s,0,6.3);x.stroke();x.restore()}
  if(big)for(const d of L.decor){if(d.npc!=='hgd_sign'||!inV(d.x,d.y))continue;hgdiDraw(x,'sign',X(d.x+.5),Y(d.y+.5)+2.6,8.5)}
  if(L._hgds)for(const k in L._hgds.doors){const dd=L._hgds.doors[k];if(dd.type==='secret')continue;const p=k.split(',').map(Number);if(!inV(p[0],p[1]))continue;const col=dd.type==='key'?HGDS_KEYS[dd.idx][2]:HGDS_GEMS[dd.idx][2];hgdmpDoorIcon(x,X(p[0]+.5),Y(p[1]+.5),col,dd.type==='gem',big?.85:.6)}
  // the thieves' houses
  if(L._hgdv)for(const a of L._hgdv.agents)if(inV(a.house[0],a.house[1]))ix('thouse',X(a.house[0]+.5),Y(a.house[1]+.5)+Math.max(4,s*1.6),Math.max(9,Math.min(18,s*4)));
  // towns and enclaves: the little huts, and the ladders down
  for(const z of L._hgdp.zones){if(z.type!=='safe')continue;if(z.x<vx-2||z.x>vx+vw+2||z.y<vy-2||z.y>vy+vh+2)continue;const town=z.town!==undefined;
    hgdmpHut(x,X(z.x+.5),Y(z.y+.5)-1,bio[z.y*W+z.x],town,(town?.95:.8)*(big?1.05:.7))}
  if(L._hgdu)for(const l of L._hgdu.ladders){if(!inV(l.x,l.y))continue;hgdmpLadderIcon(x,X(l.x+.5),Y(l.y+.5),big?.9:.62)}
  x.restore();
  mplTitle(x,'The Deeper Hollow',vname,10,12);
  const lx=8,ly=64;x.save();x.font='bold 7px '+FUI;x.fillStyle=INK;x.textAlign='left';x.fillText('BIOMES',lx,ly);
  ['Hedge maze','Stone warrens','Honeycomb reach','Shell galleries','Sandstone deeps','Blue quarter','Mosaic halls','Gilded quarter'].forEach((n,i)=>{const yy=ly+9+i*10;x.fillStyle=HGDMP.tints[i];x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(lx,yy-4,9,7);x.strokeRect(lx,yy-4,9,7);x.fillStyle=INK;x.font='6.2px '+FUI;x.fillText(n,lx+12,yy)});
  const ky=ly+98;x.font='bold 7px '+FUI;x.fillStyle=INK;x.fillText('KEY',lx,ky);
  const ent=[['Town',()=>hgdmpHut(x,lx+4.5,ky+9,2,true,1)],['Safe place',()=>hgdmpHut(x,lx+4.5,ky+20,0,false,1)],['Danger zone',()=>{x.strokeStyle='#9a2418';x.lineWidth=.8;x.setLineDash([2,1.6]);x.beginPath();x.arc(lx+4.5,ky+30,3.6,0,6.3);x.stroke();x.setLineDash([])}],
    ['Warning sign',()=>hgdiDraw(x,'sign',lx+4.5,ky+43,9)],['Locked door',()=>hgdmpDoorIcon(x,lx+4.5,ky+51,'#b8321e',false,.9)],['Gem door',()=>hgdmpDoorIcon(x,lx+4.5,ky+62,'#274a9a',true,.9)],['Ladder down',()=>hgdmpLadderIcon(x,lx+4.5,ky+73,.9)],
    ["Thief's house",()=>hgdiDraw(x,'thouse',lx+4.5,ky+87,10)],['Boat dock',()=>hgdmpBoatIcon(x,lx+4.5,ky+96,.9)],['Steps to water',()=>hgdmpStepsIcon(x,lx+4.5,ky+107,.9)],['Shallow water (walk)',()=>{x.fillStyle='#a6dcf2';x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(lx,ky+112,9,7);x.strokeRect(lx,ky+112,9,7)}],['Deep water (lake, boat)',()=>{x.fillStyle='#2a5c92';x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(lx,ky+123,9,7);x.strokeRect(lx,ky+123,9,7)}]];
  ent.forEach(([n,dr],i)=>{dr();x.fillStyle=INK;x.font='6.2px '+FUI;x.textAlign='left';x.fillText(n,lx+12,ky+[10,21,31,42,52,63,74,86,96,107,117,128][i])});
  x.restore();mplCompass(x,448,48,17);mplBorder(x);
  hgdm3Keep(vi);return HGDMP.cache[vi]={c,X,Y,S:HGDM3.S}}
/* ---------- the underlevel: view 5, drawn as a place of blood, bone and watching eyes ---------- */
function hgdm3Skull(g,a,b,r,glow){
  g.save();g.lineJoin='round';g.fillStyle='#d9cfb6';g.strokeStyle='#120406';g.lineWidth=Math.max(.1,r*.16);
  g.beginPath();g.ellipse(a,b-r*.12,r*.92,r*.86,0,0,6.3);g.fill();g.stroke();
  g.beginPath();g.moveTo(a-r*.55,b+r*.5);g.lineTo(a-r*.5,b+r*1.15);g.lineTo(a+r*.5,b+r*1.15);g.lineTo(a+r*.55,b+r*.5);g.closePath();g.fill();g.stroke();
  g.beginPath();for(let k=-1;k<=1;k++){g.moveTo(a+k*r*.28,b+r*.7);g.lineTo(a+k*r*.28,b+r*1.14)}g.stroke();
  g.fillStyle='#0c0204';for(const d of [-1,1]){g.beginPath();g.ellipse(a+d*r*.4,b-r*.18,r*.3,r*.36,0,0,6.3);g.fill()}
  g.beginPath();g.moveTo(a,b+r*.1);g.lineTo(a-r*.12,b+r*.4);g.lineTo(a+r*.12,b+r*.4);g.closePath();g.fill();
  if(glow){g.fillStyle='#ff3a20';for(const d of [-1,1]){g.beginPath();g.arc(a+d*r*.4,b-r*.14,r*.12,0,6.3);g.fill()}}
  g.restore()}
// a pair of glowing red eyes looking out of the rock
function hgdm3Eyes(x,a,b,s,k){
  const r=s*(.9+k*.8),gr=x.createRadialGradient(a,b,0,a,b,r);gr.addColorStop(0,'rgba(255,40,20,.55)');gr.addColorStop(1,'rgba(255,40,20,0)');x.fillStyle=gr;x.fillRect(a-r,b-r,2*r,2*r);
  const w=s*.3*(1+k*.5),d=s*.34*(1+k*.5);x.fillStyle='#ff5030';for(const e of [-1,1]){x.save();x.translate(a+e*d,b);x.rotate(-e*.35);x.beginPath();x.ellipse(0,0,w,w*.4,0,0,6.3);x.fill();x.restore()}
  x.fillStyle='#fff0a0';for(const e of [-1,1]){x.beginPath();x.arc(a+e*d,b,w*.22,0,6.3);x.fill()}}
// three claw scratches
function hgdm3Claws(g,a,b,s,ang,col){g.save();g.translate(a,b);g.rotate(ang);g.strokeStyle=col;g.lineCap='round';g.lineWidth=Math.max(.12,s*.05);g.beginPath();for(let k=-1;k<=1;k++){g.moveTo(k*s*.16,-s*.34);g.quadraticCurveTo(k*s*.16+s*.05,0,k*s*.16+s*.02,s*.34)}g.stroke();g.restore()}
function hgdm3Under(){
  const U=LEVELS[HGDU.ID];if(!U)return null;if(HGDMP.cache[5])return HGDMP.cache[5];
  const W=201,H=201,rows=U._hgdm3r||(U._hgdm3r=hgdm3Fill(U.rows,U)),A=MPL.AREA,pad=4,s=Math.min((A.w-2*pad)/W,(A.h-2*pad)/H),ox=A.x+(A.w-W*s)/2,oy=A.y+(A.h-H*s)/2,X=c=>ox+c*s,Y=c=>oy+c*s,{c,x}=hgdm3Canvas(HGDM3.S);
  const BONE='#e6dcc0',open=(a,b)=>rows[b]&&rows[b][a]==='.';
  // the whole sheet: near black, stained with old blood
  x.fillStyle='#0b0406';x.fillRect(0,0,DW,DH);
  for(let i=0;i<150;i++){x.fillStyle=i%4?'rgba(70,8,10,.16)':'rgba(0,0,0,.35)';x.beginPath();x.ellipse(hgdm3H(i,1)*DW,hgdm3H(i,2)*DH,6+hgdm3H(i,3)*34,3+hgdm3H(i,4)*16,hgdm3H(i,5)*3,0,6.3);x.fill()}
  hgdm3Paint(x,{rows,W,H,vx:0,vy:0,vw:W,vh:H,X,Y,s,S:HGDM3.S,ink:'#060103',pw:[1.3,1.3,1.3,1.3,1.3],hatch:'rgba(0,0,0,.6)',shade:[120,8,10],halo:['rgba(150,10,10,.18)','rgba(170,14,10,.24)'],
    rock:(cx,cy)=>{const v=hgdm3Vn(cx/9,cy/9),w=hgdm3Vn(cx/3+50,cy/3);return [24+v*40+w*10,8+v*6,12+v*6]},cat:()=>0,floors:['#cdbf9d','#cdbf9d','#cdbf9d','#cdbf9d','#cdbf9d'],
    rockDeco:(g,q)=>{
      // cracks, claw marks and watching eyes in the rock next to the passages
      const cand=[];for(let cy=q.y0;cy<q.y1;cy++)for(let cx=q.x0;cx<q.x1;cx++){if(open(cx,cy))continue;if(open(cx-1,cy)||open(cx+1,cy)||open(cx,cy-1)||open(cx,cy+1))cand.push([cx,cy])}
      const pe=.03;
      for(const [cx,cy] of cand){const h=hgdm3H(cx*1.7,cy*2.3),a=X(cx+.5),b=Y(cy+.5);
        if(h<.1){g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=s*.07;g.lineCap='round';g.beginPath();g.moveTo(a,b);let px=a,py=b;for(let k=0;k<3;k++){px+=(hgdm3H(cx+k,cy)-.5)*s*1.6;py+=(hgdm3H(cy+k,cx)-.3)*s*1.4;g.lineTo(px,py)}g.stroke()}
        else if(h<.14)hgdm3Claws(g,a,b,s*3.6,hgdm3H(cx,cy)*6,'rgba(170,16,12,.85)')}
      for(const [cx,cy] of cand){if(hgdm3H(cx*3.1,cy*1.3)<pe)hgdm3Eyes(g,X(cx+.5),Y(cy+.5),s*1.5,hgdm3H(cy,cx))}},
    corridorDeco:(g,cx,cy,a,b,s)=>{
      const h=k=>hgdm3H(cx*5+k,cy*11+k*3),v=hgdm3Vn(cx/8+7,cy/8);
      // sickly red light and old blood pools
      if(v>.55&&h(1)<.5){const r=s*1.6,gr=g.createRadialGradient(a,b,0,a,b,r);gr.addColorStop(0,'rgba(190,24,12,'+Math.min(.45,(v-.5)*1.3)+')');gr.addColorStop(1,'rgba(190,24,12,0)');g.fillStyle=gr;g.fillRect(a-r,b-r,2*r,2*r)}
      if(h(2)<.035){const r=s*(.5+h(3)*.9),gr=g.createRadialGradient(a,b,0,a,b,r);gr.addColorStop(0,'rgba(110,4,6,.85)');gr.addColorStop(.7,'rgba(120,6,8,.7)');gr.addColorStop(1,'rgba(120,6,8,0)');g.fillStyle=gr;g.fillRect(a-r,b-r,2*r,2*r)}
      if(h(4)<.05){g.fillStyle='rgba(120,6,8,.85)';for(let k=0;k<6;k++){g.beginPath();g.arc(a+(h(5+k)-.5)*s*1.3,b+(h(11+k)-.5)*s*1.3,s*(.06+h(17+k)*.1),0,6.3);g.fill()}}
      if(h(23)<.02){g.strokeStyle='rgba(120,6,8,.8)';g.lineWidth=s*.09;g.lineCap='round';g.beginPath();const bx=a+(h(24)-.5)*s*.6;g.moveTo(bx,b-s*.3);g.lineTo(bx,b+s*(.1+h(25)*.4));g.stroke()}
      if(h(26)<.03)hgdm3Claws(g,a,b,s*2.2,h(27)*6,'rgba(40,4,6,.8)');
      if(h(28)<.025){g.strokeStyle='#efe6cc';g.lineWidth=s*.13;g.lineCap='round';g.beginPath();g.moveTo(a-s*.5,b-s*.25);g.lineTo(a+s*.5,b+s*.25);g.moveTo(a-s*.5,b+s*.25);g.lineTo(a+s*.5,b-s*.25);g.stroke();g.fillStyle='#efe6cc';for(const [dx,dy] of [[-.5,-.25],[.5,.25],[-.5,.25],[.5,-.25]]){g.beginPath();g.arc(a+dx*s,b+dy*s,s*.11,0,6.3);g.fill()}}
      if(h(29)<.02)hgdm3Skull(g,a,b,s*.8,h(30)<.5)}});
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  // the dark closes in at the edges
  {const v=x.createRadialGradient(A.x+A.w/2,A.y+A.h/2,A.h*.34,A.x+A.w/2,A.y+A.h/2,A.h*.82);v.addColorStop(0,'rgba(4,0,2,0)');v.addColorStop(1,'rgba(4,0,2,.72)');x.fillStyle=v;x.fillRect(A.x,A.y,A.w,A.h)}
  // the ladders, each on a pale glow so they cannot be missed
  for(const l of U._hgdu.ladders){const a=X(l.x+.5),b=Y(l.y+.5),r=9,gr=x.createRadialGradient(a,b,0,a,b,r);gr.addColorStop(0,'rgba(255,236,170,.95)');gr.addColorStop(.55,'rgba(255,210,120,.55)');gr.addColorStop(1,'rgba(255,200,100,0)');x.fillStyle=gr;x.fillRect(a-r,b-r,2*r,2*r);hgdmpLadderIcon(x,a,b,1.1)}
  x.restore();
  // the frame: dried blood and dull iron, studs of bone, a skull in each corner
  {x.save();x.lineWidth=5;x.strokeStyle='#3a0608';x.strokeRect(5,5,DW-10,DH-10);x.lineWidth=2;x.strokeStyle='#7a1010';x.strokeRect(3,3,DW-6,DH-6);x.lineWidth=1;x.strokeStyle='#050102';x.strokeRect(8.5,8.5,DW-17,DH-17);x.strokeRect(1.5,1.5,DW-3,DH-3);
    x.fillStyle='#8a8070';for(let i=14;i<DW-8;i+=9)for(const y of [5,DH-5]){x.beginPath();x.arc(i,y,1.2,0,6.3);x.fill()}for(let j=14;j<DH-8;j+=9)for(const xx of [5,DW-5]){x.beginPath();x.arc(xx,j,1.2,0,6.3);x.fill()}
    for(const [cx,cy] of [[9,9],[DW-9,9],[9,DH-9],[DW-9,DH-9]]){x.fillStyle='#1a0507';x.beginPath();x.arc(cx,cy,9,0,6.3);x.fill();x.strokeStyle='#7a1010';x.lineWidth=1.2;x.stroke();hgdm3Skull(x,cx,cy-.4,4.6,true)}x.restore()}
  // the title: blood-red letters with drips, then plain words in bone
  {x.save();x.font='15px '+FTITLE;x.textAlign='left';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=3.4;x.strokeStyle='#050102';x.strokeText('The Underlevel',14,26);x.fillStyle='#c01a14';x.fillText('The Underlevel',14,26);x.fillStyle='rgba(255,120,90,.35)';x.fillText('The Underlevel',14,25.3);
    x.fillStyle='#a01010';for(const [dx,dl] of [[24,9],[52,6],[71,12],[96,7]]){x.fillRect(dx,32,1.4,dl);x.beginPath();x.arc(dx+.7,32+dl,1.6,0,6.3);x.fill()}
    x.font='bold 7px '+FUI;x.lineWidth=2.4;x.strokeStyle='#050102';x.strokeText('very dark and dangerous',14,56);x.fillStyle=BONE;x.fillText('very dark and dangerous',14,56);x.restore()}
  const lx=10,ly=76,tx=(t,a,b,bold)=>{x.save();x.font=(bold?'bold 7px ':'6.4px ')+FUI;x.textAlign='left';x.textBaseline='alphabetic';x.lineJoin='round';x.lineWidth=2.4;x.strokeStyle='#050102';x.strokeText(t,a,b);x.fillStyle=bold?'#d8402a':BONE;x.fillText(t,a,b);x.restore()};
  tx('KEY',lx,ly,1);
  {const a=lx+5,b=ly+13,gr=x.createRadialGradient(a,b,0,a,b,8);gr.addColorStop(0,'rgba(255,236,170,.95)');gr.addColorStop(1,'rgba(255,200,100,0)');x.fillStyle=gr;x.fillRect(a-8,b-8,16,16);hgdmpLadderIcon(x,a,b,1.1);tx('Ladder up',lx+14,ly+15)}
  x.save();x.strokeStyle='#38b8d0';x.lineWidth=1;x.setLineDash([2,2]);x.beginPath();x.moveTo(lx,ly+30);x.lineTo(lx+10,ly+30);x.stroke();x.restore();tx('Your footsteps',lx+14,ly+32);
  hgdm3Eyes(x,lx+5,ly+44,2.2,.3);tx('Watching eyes',lx+14,ly+46);hgdm3Skull(x,lx+5,ly+56,3.6,true);tx('Old bones',lx+14,ly+59);
  ['No food, no torches.','Dark insects, many.','Ten demons wander here.'].forEach((n,i)=>tx(n,lx,ly+80+i*10));
  // the compass, in blood and bone
  {x.save();x.translate(448,48);x.fillStyle='#14080a';x.strokeStyle='#7a1010';x.lineWidth=1;x.beginPath();x.arc(0,0,17,0,6.3);x.fill();x.stroke();x.beginPath();x.arc(0,0,12.5,0,6.3);x.stroke();
    for(let k=0;k<4;k++){x.save();x.rotate(k*Math.PI/2);x.fillStyle=k===0?'#c01a14':BONE;x.strokeStyle='#050102';x.beginPath();x.moveTo(0,-20);x.lineTo(3.4,0);x.lineTo(-3.4,0);x.closePath();x.fill();x.stroke();x.restore()}x.restore();tx('N',445.4,24,1)}
  hgdm3Keep(5);return HGDMP.cache[5]={c,X,Y,S:HGDM3.S}}
/* ---------- the watery passages: views 6 to 8 ---------- */
function hgdm3Water(vi){
  const id=HGDW.ID;if(HGDMP.cache[vi])return HGDMP.cache[vi];
  if(!LEVELS[id]&&KH_LAZY[id])try{KH_LAZY[id]()}catch(e){console.error(e)}
  const L=LEVELS[id];if(!L)return null;const rows=L._hgdm3r||(L._hgdm3r=hgdm3Fill(L.rows,L,true)),W=rows[0].length,H=rows.length,A=MPL.AREA,pad=6,s=Math.min((A.w-2*pad)/W,(A.h-2*pad)/H),ox=A.x+(A.w-W*s)/2,oy=A.y+(A.h-H*s)/2,X=c=>ox+c*s,Y=c=>oy+c*s,{c,x}=hgdm3Canvas(HGDM3.S);
  mplParchment(x);const INK=MPL.INK;
  hgdm3Paint(x,{rows,W,H,vx:0,vy:0,vw:W,vh:H,X,Y,s,S:HGDM3.S,hatch:'rgba(30,60,28,.5)',rock:(cx,cy)=>[104+hgdm3H(cx,cy)*20,132+hgdm3H(cy,cx)*16,86],cat:()=>4,floors:['#2a5c92','#2a5c92','#2a5c92','#2a5c92','#2a5c92']});
  x.save();x.beginPath();x.rect(A.x,A.y,A.w,A.h);x.clip();
  const ix=(n,a,b,w)=>hgdiDraw(x,n,a,b,w);
  if(L._hgdw)for(const st of (L._hgdw.stairs||[]))if(st&&st.x!==undefined)hgdmpStepsIcon(x,X(st.x+.5),Y(st.y+.5),1.1);
  x.restore();
  mplTitle(x,LEVEL_NAMES[id],'water passages',10,12);
  const lx=8,ly=70;x.save();x.font='bold 7px '+FUI;x.fillStyle=INK;x.textAlign='left';x.fillText('KEY',lx,ly);x.font='6.2px '+FUI;
  x.fillStyle='#2a5c92';x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(lx,ly+60,9,7);x.strokeRect(lx,ly+60,9,7);x.fillStyle=INK;x.fillText('Deep water (helm)',lx+12,ly+66);
  hgdmpStepsIcon(x,lx+4.5,ly+38,.9);x.fillText('Steps up',lx+12,ly+38)
  x.restore();mplCompass(x,448,48,17);mplBorder(x);
  hgdm3Keep(vi);return HGDMP.cache[vi]={c,X,Y,S:HGDM3.S}}
{const _s=hgdmpSheet;hgdmpSheet=function(vi){try{if(vi===5)return hgdm3Under();if(vi>=6)return hgdm3Water(vi);return hgdm3Maze(vi)}catch(e){console.error('hgdm3',e);return _s.apply(this,arguments)}}}
// the names layer: the thieves' houses
{const _n=hgdmpNames;hgdmpNames=function(vi){const out=_n.apply(this,arguments);try{const L=LEVELS[HGD.ID];if(vi!==5&&vi<6&&L&&L._hgdv){const V=HGDMP.views[vi],[,,vx,vy,vw,vh]=V;L._hgdv.agents.forEach(a=>{if(a.house[0]>=vx&&a.house[0]<=vx+vw&&a.house[1]>=vy&&a.house[1]<=vy+vh)out.push({t:HGDV_NAMES[a.i]+"'s house",x:a.house[0]+.5,y:a.house[1]+.5,dy:5,k:'thief'})})}}catch(e){}return out}}
