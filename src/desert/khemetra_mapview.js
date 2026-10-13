/* ==========================================================================
   KHEMETRA: THE MAP. The city is drawn like the other towns, on parchment: roofs by kind of building, parks, markets and
   plazas, palms and fountains, doors, and names for the quarters, the squares, the streets and every shop. The picture is
   painted once and then scaled; the names appear as you zoom in.
   ========================================================================== */
const KH_STREETS=['Lotus Street','Scarab Way','Papyrus Lane','Ankh Street','Jackal Row','Date Palm Lane','Potters Way','Weavers Road','Lamp Lane','Gold Street','Moon Street','Sunrise Way','Cat Lane','Falcon Street','Spice Road','Water Carriers Lane','Reed Street','Sphinx Walk','Honey Lane','Salt Row','Blue Door Lane','Basket Street','Copper Way','Silver Street','Oleander Lane','Hyacinth Row','Mint Street','Indigo Way','Saffron Road','Alabaster Street','Camel Lane','Sandal Row','Lantern Walk','Cedar Way','Fig Tree Lane','Amber Street','Dove Lane','Myrrh Street','Granite Row','Cobbler Lane'];
const KH_PARK_NAMES=['Palm Park','Fig Park','Lotus Park','Dove Park','Date Park','Oleander Park','Jasmine Park','Mint Park','Sycamore Park','Heron Park','Papyrus Park','Willow Park','Peacock Park','Orange Park','Lily Park','Cypress Park','Rose Park','Acacia Park','Hibiscus Park','Pomegranate Park','Linden Park','Myrtle Park','Almond Park','Tamarind Park','Sage Park','Henna Park','Olive Park','Wisteria Park','Citron Park','Jacaranda Park','Laurel Park','Plum Park'];
const KH_DISTRICTS=[
  {n:'The Old Quarter',x0:6,y0:6,x1:125,y1:125},{n:"The Beggars' Quarter",x0:300,y0:214,x1:392,y1:300},{n:'The Temple District',x0:290,y0:8,x1:392,y1:105},
  {n:'The Bathhouse Quarter',x0:290,y0:305,x1:392,y1:392},{n:"The Weavers' Quarter",x0:6,y0:262,x1:100,y1:392},{n:"The Merchants' Quarter",x0:105,y0:262,x1:290,y1:392},
  {n:'The Garden District',x0:6,y0:130,x1:150,y1:255},{n:'The Noble Quarter',x0:150,y0:8,x1:290,y1:150},{n:'The Craftsmen\'s Quarter',x0:255,y0:110,x1:392,y1:212},{n:'The Pilgrims\' Way',x0:105,y0:8,x1:150,y1:125}
];
const KH_KIND_COL={house:'#c1835a',low:'#cfae7e',mansion:'#d9bf84',shop:'#dcae4a',temple:'#ece4cc',pray:'#cdd8e4',bath:'#72bcc4',ruin:'#938c80',palace:'#ecdc94',castle:'#a89a78'};
let KH_MAPIMG=null,KH_MAPVER=-1;
function khNameStreets(C){ // names for the streets between the blocks, from the grid the city was built on
  const out={v:[],h:[]};
  C.xb.forEach((b,i)=>{if(i+1<C.xb.length)out.v.push({n:KH_STREETS[(i*7+3)%KH_STREETS.length],x:Math.round((b[1]+C.xb[i+1][0])/2)})});
  C.yb.forEach((b,j)=>{if(j+1<C.yb.length)out.h.push({n:KH_STREETS[(j*5+11)%KH_STREETS.length],y:Math.round((b[1]+C.yb[j+1][0])/2)})});
  return out;
}
function khBuildMapImage(){
  const C=KH_CITY;if(!C)return null;
  const S=5,W=C.W,H=C.H,idx=C.idx,cv=document.createElement('canvas');cv.width=W*S;cv.height=H*S;const x=cv.getContext('2d');
  // parchment under everything
  x.fillStyle='#d6c493';x.fillRect(0,0,W*S,H*S);
  // ground first, then every solid cell as plain wall; the houses are laid over it one by one, each reaching inward from its front
  const GR={0:'#e4d3a2',1:'#dccb98',2:'#d8d6c4',3:'#d9bf84',4:'#a9c47f',5:'#b3d6d6'};
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    const i=idx(cx,cy);
    x.fillStyle=C.solid[i]?'#b39a70':(GR[C.fl[i]]||'#e4d3a2');x.fillRect(cx*S,cy*S,S,S);
  }
  const own=new Int32Array(W*H).fill(-1);
  C.modules.forEach((m,mi)=>{
    const d=KH_DIRS[m.face],ix=-d[0],iy=-d[1],depth=m.kind==='castle'?KH.WALL:m.kind==='palace'?3:4+((khHash(m.cells[0][0],m.cells[0][1],8)*3)|0);
    const got=[];
    for(let k=0;k<depth;k++){
      let ok=true;for(const [cx,cy] of m.cells){const px=cx+ix*k,py=cy+iy*k;if(px<0||py<0||px>=W||py>=H||!C.solid[idx(px,py)]||own[idx(px,py)]>=0){ok=false;break}}
      if(!ok)break;for(const [cx,cy] of m.cells)got.push([cx+ix*k,cy+iy*k]);
    }
    if(!got.length)return;
    const base=KH_KIND_COL[m.kind]||'#c1835a',shade=(khHash(m.cells[0][0],m.cells[0][1],4)-.5)*34;
    let x0=1e9,y0=1e9,x1=-1,y1=-1;
    for(const [px,py] of got){own[idx(px,py)]=mi;x0=Math.min(x0,px);y0=Math.min(y0,py);x1=Math.max(x1,px);y1=Math.max(y1,py)}
    const c=base.replace('#','');const r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),bl=parseInt(c.slice(4,6),16);
    x.fillStyle='rgb('+clamp(r+shade,0,255)+','+clamp(g+shade,0,255)+','+clamp(bl+shade,0,255)+')';
    x.fillRect(x0*S,y0*S,(x1-x0+1)*S,(y1-y0+1)*S);
    x.fillStyle='rgba(255,244,210,.22)';   // a light ridge down the middle of the roof
    if(x1-x0>=y1-y0)x.fillRect(x0*S+1,((y0+y1+1)/2)*S-.8,(x1-x0+1)*S-2,1.6);else x.fillRect(((x0+x1+1)/2)*S-.8,y0*S+1,1.6,(y1-y0+1)*S-2);
    x.strokeStyle='rgba(40,26,12,.8)';x.lineWidth=1.1;x.strokeRect(x0*S+.5,y0*S+.5,(x1-x0+1)*S-1,(y1-y0+1)*S-1);
  });
  // the edge of every street and square
  x.fillStyle='rgba(40,26,12,.55)';
  for(let cy=1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){
    const i=idx(cx,cy);if(!C.solid[i])continue;
    if(!C.solid[i-1])x.fillRect(cx*S,cy*S,1,S);if(!C.solid[i+1])x.fillRect(cx*S+S-1,cy*S,1,S);
    if(!C.solid[i-W])x.fillRect(cx*S,cy*S,S,1);if(!C.solid[i+W])x.fillRect(cx*S,cy*S+S-1,S,1);
  }
  // the castle wall
  x.strokeStyle='#3a2a16';x.lineWidth=3;x.strokeRect(KH.WALL*S-1,KH.WALL*S-1,(W-2*KH.WALL)*S+2,(H-2*KH.WALL)*S+2);
  // the palace, drawn bigger and with a spire
  const P=C.PB;x.fillStyle='#f0e4a8';x.fillRect(P.x0*S,P.y0*S,(P.x1-P.x0+1)*S,(P.y1-P.y0+1)*S);x.strokeStyle='#5a4420';x.lineWidth=2;x.strokeRect(P.x0*S,P.y0*S,(P.x1-P.x0+1)*S,(P.y1-P.y0+1)*S);
  x.fillStyle='#e0b838';for(const [dx,dy] of [[-14,-6],[0,-8],[14,-6],[-8,6],[8,6]]){x.beginPath();x.arc((KH.CX+dx)*S,(P.y0+14+dy)*S,5.5*S/2,0,Math.PI*2);x.fill();x.stroke()}
  // fountains, wells, obelisks, palms
  const L=LEVELS[44];
  for(const d of L.decor){
    const px=d.x*S+S/2,py=d.y*S+S/2;
    if(/^dpalm|^kh_city2_0$/.test(d.k)){x.fillStyle='rgba(60,100,40,.85)';x.beginPath();x.arc(px,py,S*.75,0,Math.PI*2);x.fill()}
    else if(d.k==='kh_city1_0'||d.k==='fountain'){x.fillStyle='#5aa0c8';x.strokeStyle='#2a3a4a';x.lineWidth=1;x.beginPath();x.arc(px,py,S*1.6,0,Math.PI*2);x.fill();x.stroke()}
    else if(d.k==='kh_city1_1'||d.k==='well'){x.fillStyle='#4a6c8a';x.beginPath();x.arc(px,py,S*1,0,Math.PI*2);x.fill()}
    else if(d.k==='kh_city1_2'||d.k==='memorial'){x.fillStyle='#f4efe0';x.strokeStyle='#2a1c0e';x.lineWidth=1;x.beginPath();x.moveTo(px,py-S*2);x.lineTo(px+S*.9,py+S);x.lineTo(px-S*.9,py+S);x.closePath();x.fill();x.stroke()}
    else if(/^kh_stall1_/.test(d.k)){x.fillStyle=['#c04a3a','#4a8a5a','#d09a30','#4a6aa0','#a04a8a','#c87a30'][(d.x+d.y)%6];x.fillRect(px-S*.9,py-S*.7,S*1.8,S*1.4)}
  }
  // doors
  for(const b of KH_BUILDINGS){if(!b.front)continue;x.fillStyle='#f4c542';x.strokeStyle='#2a1c0e';x.lineWidth=.8;x.beginPath();x.arc(b.front[0]*S+S/2,b.front[1]*S+S/2,S*.7,0,Math.PI*2);x.fill();x.stroke()}
  return cv;
}
/* names on the map; how many appear depends on how close the party has zoomed */
function khDrawCityMap(cs,ox,oy){
  const C=KH_CITY;if(!C){return}
  if(!KH_MAPIMG){KH_MAPIMG=khBuildMapImage()}
  const ink='#2a1c0e',halo='rgba(240,228,184,.9)';
  ctx.imageSmoothingEnabled=true;
  ctx.fillStyle='#bfa97a';ctx.fillRect(0,0,DW,DH);
  ctx.drawImage(KH_MAPIMG,ox,oy,C.W*cs,C.H*cs);
  const lab=(t,x,y,sz,col,rot)=>{ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.font=`bold ${sz}px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=Math.max(2,sz*.3);ctx.strokeStyle=halo;ctx.strokeText(t,0,0);ctx.fillStyle=col||ink;ctx.fillText(t,0,0);ctx.restore()};
  const vis=(x,y,pad)=>{const sx=ox+x*cs,sy=oy+y*cs;return sx>-pad&&sy>-pad&&sx<DW+pad&&sy<DH+pad};
  // quarters
  const dsz=cs<4?clamp(cs*3.4,8,14):clamp(cs*1.7,8,11);
  for(const d of KH_DISTRICTS){const cx=(d.x0+d.x1)/2,cy=(d.y0+d.y1)/2;if(vis(cx,cy,200))lab(d.n.toUpperCase(),ox+cx*cs,oy+cy*cs,dsz,'#5a3a16')}
  lab('THE PALACE OF KHEMETRA',ox+KH.CX*cs,oy+(C.PB.y0+(C.PB.y1-C.PB.y0)*.62)*cs,clamp(cs*4.4,10,18),'#5a2a0a');
  lab('THE CHURCH OF LIGHT',ox+122*cs,oy+190*cs,clamp(cs*2.4,8,12),'#2a3a5a');
  lab('THE GREAT GATE',ox+KH.CX*cs,oy+(C.H-KH.WALL-2)*cs,clamp(cs*2.6,8,12),'#5a2a0a');
  if(cs<7)lab('The Avenue of the Sun',ox+(KH.CX+5.5)*cs,oy+318*cs,clamp(cs*2.4,8,11),'#3a2a16',-Math.PI/2);
  // squares, markets and parks
  if(cs>=2.4){
    let pi=0;
    for(const p of C.plazas){const nm=p.park?KH_PARK_NAMES[(pi++)%KH_PARK_NAMES.length]:p.name;if(!nm)continue;const cx=(p.x0+p.x1)/2,cy=(p.y0+p.y1)/2;if(vis(cx,cy,100))lab(nm,ox+cx*cs,oy+(cy+((p.y1-p.y0)>>2))*cs,clamp(cs*1.9,7,11),p.park?'#2a5a22':'#3a2a16')}
  }
  // streets
  if(cs>=3){
    const st=C._streets||(C._streets=khNameStreets(C)),sz=clamp(cs*1.5,7,10);
    for(const s of st.v){for(let y=40;y<C.H-30;y+=95){let ok=true;for(let k=-4;k<=4;k++)if(C.solid[C.idx(s.x,y+k)])ok=false;if(ok&&vis(s.x,y,60))lab(s.n,ox+(s.x+.5)*cs,oy+y*cs,sz,'#4a3820',-Math.PI/2)}}
    for(const s of st.h){for(let xx=40;xx<C.W-30;xx+=110){let ok=true;for(let k=-4;k<=4;k++)if(C.solid[C.idx(xx+k,s.y)])ok=false;if(ok&&vis(xx,s.y,60))lab(s.n,ox+xx*cs,oy+(s.y+.5)*cs,sz,'#4a3820')}}
    lab('Ring Road',ox+KH.CX*cs,oy+246*cs,clamp(cs*1.6,7,10),'#4a3820');lab('West Road',ox+75*cs,oy+(KH.CY+.5)*cs,clamp(cs*1.6,7,10),'#4a3820');lab('East Road',ox+325*cs,oy+(KH.CY+.5)*cs,clamp(cs*1.6,7,10),'#4a3820');
  }
  // shops, inns, temples and houses of note: the name at the door, with a small sign for what it is
  if(cs>=4.2){
    const ICON={shop:'⚖',inn:'⌂',pray:'✶',temple:'✶',bath:'≈',hall:'⚒',ship:'⚓'};
    for(const b of KH_BUILDINGS){
      if(!b.front||!vis(b.front[0],b.front[1],80))continue;
      if(/^(den|urnhouse|ledgerhouse|granary|baths_cellar|home|drumhouse)/.test(b.id)&&cs<9)continue;
      const col=b.room==='inn'?'#7a1a10':b.room==='prayer'||b.room==='temple'?'#2a3a7a':b.room==='bath'?'#0a5a6a':b.room==='ruin'||b.room==='cellar'?'#5a5448':'#3a2208';
      lab(b.name,ox+(b.front[0]+.5)*cs,oy+(b.front[1]+.5-(b.m&&b.m.face===0?1.6:b.m&&b.m.face===1?-1.6:0))*cs,clamp(cs*1.1,7,10),col);
    }
  }
  // the hatch to the cisterns once the vizier has named it
  if(G.flags.khWizardKnown&&vis(KH_HATCH.x,KH_HATCH.y,60)){lab('Hatch to the Cisterns',ox+(KH_HATCH.x+.5)*cs,oy+(KH_HATCH.y-1.5)*cs,clamp(cs*1.4,7,10),'#7a1a10');ctx.fillStyle='#7a1a10';ctx.beginPath();ctx.arc(ox+(KH_HATCH.x+.5)*cs,oy+(KH_HATCH.y+.5)*cs,Math.max(2,cs*.5),0,Math.PI*2);ctx.fill()}
  // a small key
  ctx.save();ctx.fillStyle='rgba(30,20,10,.82)';rrect(ctx,6,DH-66,150,40,4);ctx.fill();
  const key=[['#c1835a','Houses'],['#dcae4a','Shops'],['#ece4cc','Temples'],['#72bcc4','Baths'],['#938c80','Ruins'],['#a9c47f','Parks']];
  key.forEach(([c,t],i)=>{const kx=12+(i%3)*48,ky=DH-60+Math.floor(i/3)*16;ctx.fillStyle=c;ctx.fillRect(kx,ky,8,8);txt(t,kx+11,ky+5,7,'#e8dcb4','left')});
  ctx.restore();
}
