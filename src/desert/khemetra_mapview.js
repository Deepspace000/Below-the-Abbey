/* ==========================================================================
   KHEMETRA: THE MAP. The city is drawn like an old bird's-eye map on parchment: every house a little building with a roof and a
   front wall, domes on the temples and baths, striped awnings on the shops, palms and trees, ponds in the parks, a crenellated
   wall with towers. The picture is painted once and then scaled. The names are laid over it afterwards; the greater ones always
   stay, the smaller ones appear wherever there is room for them, so zooming out never empties the map.
   ========================================================================== */
const KH_ADJ=['Lotus','Scarab','Papyrus','Ankh','Jackal','Date Palm','Potters','Weavers','Lamp','Gold','Moon','Sunrise','Cat','Falcon','Spice','Reed','Sphinx','Honey','Salt','Basket','Copper','Silver','Oleander','Mint','Indigo','Saffron','Alabaster','Camel','Sandal','Lantern','Cedar','Fig Tree','Amber','Dove','Myrrh','Granite','Cobbler','Ibis','Cobra','Jasmine','Henna','Barley','Turquoise','Carnelian','Tamarisk','Sycamore','Baker','Dyer','Mason','Scribe','Water Carriers','Blue Door','Hyacinth','Ostrich','Mongoose','Nightingale','Carob','Pomegranate','Obsidian','Lapis'];
const KH_ROADTYPE=['Street','Lane','Way','Row','Road','Walk'];
const KH_POND_S=['Heron Basin','Mirror Pool','Frog Hollow','Lily Basin','Dragonfly Pool','Cool Pool','Sparrow Bath','Reed Basin','Quiet Pool','Pearl Basin','Duckweed Pool','Little Moon'];
const KH_POND_M=['Heron Pond','Lotus Pond','Egret Water','Kingfisher Pond','Carp Pond','Papyrus Pond','The Turquoise Pond','Ibis Water','Willow Water','Reflection Pond','Sunken Garden Pond','Moon Mirror'];
const KH_POND_L=['Lake Nefertari','Lotus Mere','The Great Mere','Lake of Reeds','Pelican Lake','Lake Hatshepsut','The Little Nile','Lake Amenemhat','Stork Mere','Lake of the Seven Palms'];
const KH_PARK_NAMES=['Palm Park','Fig Park','Lotus Park','Dove Park','Date Park','Oleander Park','Jasmine Park','Mint Park','Sycamore Park','Heron Park','Papyrus Park','Willow Park','Peacock Park','Orange Park','Lily Park','Cypress Park','Rose Park','Acacia Park','Hibiscus Park','Pomegranate Park','Linden Park','Myrtle Park','Almond Park','Tamarind Park','Sage Park','Henna Park','Olive Park','Wisteria Park','Citron Park','Jacaranda Park','Laurel Park','Plum Park'];
const KH_CUL_A=["Beggar's","Lost Sandal","Sleeping Dog","Crooked","Blind","Whisper","Tinker's","Dusty","Hidden","Pigeon","Mud","Smoke","Cracked Jar","Thimble","Broken Cart","Sparrow","Stray Cat","Widow's","Lucky","Old Well","Thorn","Ladder","Drowsy","Moth","Mouse","Crumb","Fiddler's","Gossip","Candle","Bramble","Nine Steps","Three Doors","Laundry","Sandfly","Hen","Onion","Tailor's","Cooper's","Echo","Shadow"];
const KH_CUL_B=['Court','Close','Alley','Yard','Cul-de-sac','Dead End','Nook','Passage','Mews','Corner'];
const KH_TOWER_N=['Wind','Falcon','Silence','Bells','Seven Stars','Dawn','Salt','Lamps','Watchers','Moon','Ravens','Shadows','Glass','Sunset','Whispers','Hours','Scribes','Incense','Locusts','Stars','Lantern','Ibis','Scorpion','Cobra','Pelican','Kestrel','Echoes','Dust','Sand','Honey','Reeds','Drums','Eagle','Camels','Jackals','Cranes'];
const KH_TOWER_T=['Tower of the','The'];
const KH_SHOP_A=['Brass Camel','Basket & Brim','Laughing Jackal','Honeycomb Sweets','Kohl & Kisses','Copper Kettle','Papyrus & Co.','Seven Sandals','Dusty Lamp','Fig & Falcon','Blue Scarab','Olive Press','Dye Works','Pipe & Drum','Crooked Scale','Rug Merchant','Bead Seller','Glassblower','Tinsmith','Saddler','Cheese Seller','Incense Seller','Perfumer','Coppersmith','Rope Maker','Tentmaker','Barber','Letter Writer','Fortune Teller','Date Press','Brick Yard','Sandal Maker','Oil Seller','Pigeon Fancier','Salt Merchant','Wig Maker','Sweet Water','Ink & Reed','Mat Weaver','Lamp Wright'];
const KH_TRADES=['Baker','Weaver','Potter','Dyer','Tailor','Cooper','Tinker','Spice Seller','Fishmonger','Scribe','Jeweller','Cobbler','Carpenter','Mason','Lamp Maker','Fruit Seller','Butcher','Rope Maker','Barber','Perfumer'];
const KH_PRAY_N=['Quiet Hour','Four Winds','Open Hand','Still Water','Golden Door','Seven Lamps','Morning Star','Long Shadow','Warm Light','Patient Moon','White Dove','Silent Reed'];
const KH_TEMPLE_N=['Isis','Osiris','Horus','Thoth','Ptah','Sekhmet','Hathor','Anubis','Sobek','Khnum','Maat','Neith'];
const KH_BATH_N=['The Alabaster Baths','Hammam of the Pearl','The Warm Spring','Baths of the Setting Sun','The Cedar Baths','The Rose Hammam','The Cool Fountain Baths','Hammam of Seven Pools'];
const KH_DISTRICTS=[
  {n:'The Old Quarter',x0:6,y0:6,x1:125,y1:125},{n:"The Beggars' Quarter",x0:300,y0:214,x1:392,y1:300},{n:'The Temple District',x0:290,y0:8,x1:392,y1:105},
  {n:'The Bathhouse Quarter',x0:290,y0:305,x1:392,y1:392},{n:"The Weavers' Quarter",x0:6,y0:262,x1:100,y1:392},{n:"The Merchants' Quarter",x0:105,y0:262,x1:290,y1:392},
  {n:'The Garden District',x0:6,y0:130,x1:150,y1:255},{n:'The Noble Quarter',x0:150,y0:8,x1:290,y1:150},{n:"The Craftsmen's Quarter",x0:255,y0:110,x1:392,y1:212},{n:"The Pilgrims' Way",x0:105,y0:8,x1:150,y1:125}
];
const KH_KIND_COL={house:'#c1835a',low:'#cfae7e',mansion:'#d9bf84',shop:'#dcae4a',temple:'#ece4cc',pray:'#cdd8e4',bath:'#72bcc4',ruin:'#938c80',palace:'#ecdc94',castle:'#a89a78'};
let KH_MAPIMG=null,KH_MAPVER=-1;
function khShuffled(a,seed){const r=khRng(seed),o=a.slice();for(let i=o.length-1;i>0;i--){const j=(r()*(i+1))|0;[o[i],o[j]]=[o[j],o[i]]}return o}
function khNameStreets(C){ // a different name for every street between the blocks, from the grid the city was built on
  const out={v:[],h:[]},adj=khShuffled(KH_ADJ,5);let k=0;
  const name=()=>{const a=adj[k%adj.length],t=KH_ROADTYPE[(k*5+2)%KH_ROADTYPE.length];k++;return a+' '+t};
  C.xb.forEach((b,i)=>{if(i+1<C.xb.length)out.v.push({n:name(),x:Math.round((b[1]+C.xb[i+1][0])/2)})});
  C.yb.forEach((b,j)=>{if(j+1<C.yb.length)out.h.push({n:name(),y:Math.round((b[1]+C.yb[j+1][0])/2)})});
  return out;
}
/* colour helpers */
function khRGB(h){const c=h.replace('#','');return [parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]}
function khShade(h,a){const [r,g,b]=khRGB(h);return 'rgb('+clamp(r+a,0,255)+','+clamp(g+a,0,255)+','+clamp(b+a,0,255)+')'}
const KH_ROOF={
  house:['#c8744a','#b8603e','#d08a52','#3f8a96','#4a74a8','#a8585e','#c99a46','#7a9a5a','#c8744a','#d9a04c'],
  low:['#c9a070','#b8946a','#d0b080','#a88a60','#c48c5c','#b07850'],
  mansion:['#d9b45a','#4a74a8','#c8744a','#3f8a96','#d0a040','#8a5a8a'],
  shop:['#d9a43a','#c8503a','#3f8a96','#7a9a4a','#a8585e','#d08a30'],
  ruin:['#8a8070','#7a7266','#948a78'],pray:['#c8d8e8','#d8e0ea','#bcd0e0'],temple:['#f2ecd8','#ece4cc'],bath:['#6fb8c0','#5aa8b4','#86c8cc']
};
const KH_WALLC={house:'#ead6aa',low:'#dcc496',mansion:'#f2e4bc',shop:'#eed9a8',temple:'#f6f0e0',pray:'#e8eef4',bath:'#d6ecec',ruin:'#a99f90'};
function khBuildMapImage(){
  const C=KH_CITY;if(!C)return null;
  const S=6,W=C.W,H=C.H,idx=C.idx,cv=document.createElement('canvas');cv.width=W*S;cv.height=H*S;const x=cv.getContext('2d');
  const hs=khHash,TAU=Math.PI*2,INK='rgba(52,34,16,.85)';
  const L=LEVELS[44],B=KH.WALL;
  // ---- parchment, with a little mottling ----
  x.fillStyle='#d9c799';x.fillRect(0,0,W*S,H*S);
  for(let i=0;i<5200;i++){const a=hs(i,3,201),b=hs(i,5,202);x.fillStyle=`rgba(${120+hs(i,1,203)*60|0},${90+hs(i,2,204)*40|0},50,${.025+hs(i,7,205)*.04})`;x.beginPath();x.arc(a*W*S,b*H*S,10+hs(i,9,206)*60,0,TAU);x.fill()}
  // ---- ground ----
  const GR={0:'#e6d6a6',1:'#e0cf9c',2:'#efe3b8',3:'#dcc58a',4:'#9fbe74',5:'#a9d2d0'};
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    const i=idx(cx,cy);if(C.solid[i])continue;
    const f=C.fl[i];x.fillStyle=GR[f]||GR[0];x.fillRect(cx*S,cy*S,S,S);
    const r=hs(cx,cy,210);
    if(f===4){ // lawn: two greens and grass tufts
      if(r<.5){x.fillStyle='rgba(70,120,50,.22)';x.fillRect(cx*S,cy*S,S,S)}
      if(r>.78){x.strokeStyle='rgba(50,100,36,.6)';x.lineWidth=.8;x.beginPath();const px=cx*S+hs(cx,cy,211)*S,py=cy*S+hs(cx,cy,212)*S;x.moveTo(px-1,py+1.5);x.lineTo(px-1.5,py-1);x.moveTo(px,py+1.5);x.lineTo(px,py-1.5);x.moveTo(px+1,py+1.5);x.lineTo(px+1.5,py-1);x.stroke()}
    }else if(f===5){if(((cx+cy)&1)===0){x.fillStyle='rgba(40,110,120,.2)';x.fillRect(cx*S,cy*S,S,S)}}
    else if(f===2){if(((cx>>1)+(cy>>1))&1){x.fillStyle='rgba(190,150,60,.14)';x.fillRect(cx*S,cy*S,S,S)}}
    else if(f===3){x.fillStyle='rgba(120,80,30,.12)';x.fillRect(cx*S,cy*S+S-1,S,1);if(((cx*7+cy*3)&3)===0)x.fillRect(cx*S+S/2,cy*S,1,S)}
    else if(r<.1){x.fillStyle='rgba(110,80,40,.25)';x.fillRect(cx*S+hs(cx,cy,213)*S,cy*S+hs(cx,cy,214)*S,1.2,1.2)}
  }
  // how wide each street is: the shorter of the open runs across and along it
  const run=new Uint8Array(W*H*2);
  for(let y=0;y<H;y++){let k=0;while(k<W){if(C.solid[idx(k,y)]){k++;continue}let e=k;while(e<W&&!C.solid[idx(e,y)])e++;for(let q=k;q<e;q++)run[idx(q,y)*2]=Math.min(255,e-k);k=e}}
  for(let xx=0;xx<W;xx++){let k=0;while(k<H){if(C.solid[idx(xx,k)]){k++;continue}let e=k;while(e<H&&!C.solid[idx(xx,e)])e++;for(let q=k;q<e;q++)run[idx(xx,q)*2+1]=Math.min(255,e-k);k=e}}
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    const i=idx(cx,cy);if(C.solid[i]||C.zone[i]!==0)continue;
    const wd=Math.min(run[i*2],run[i*2+1]);
    if(wd>=7){x.fillStyle='rgba(243,213,122,.55)';x.fillRect(cx*S,cy*S,S,S)}else if(wd>=5){x.fillStyle='rgba(236,214,142,.35)';x.fillRect(cx*S,cy*S,S,S)}
    else if(wd<=2){x.fillStyle='rgba(120,90,50,.14)';x.fillRect(cx*S,cy*S,S,S)}
  }
  // ---- the buildings: each reaches inward from its front, as before; the rest of a block is a walled yard ----
  const own=new Int32Array(W*H).fill(-1),blds=[];
  // neighbouring fronts of the same sort are laid out as one building, two to four fronts wide
  const lines=new Map();
  C.modules.forEach((m,mi)=>{
    if(m.kind==='castle'||m.kind==='palace')return;
    const horiz=m.face<2,line=horiz?m.cells[0][1]:m.cells[0][0],pos=Math.min(...m.cells.map(c=>horiz?c[0]:c[1])),end=Math.max(...m.cells.map(c=>horiz?c[0]:c[1]));
    const key=m.face+':'+line,a=lines.get(key);const o={m,mi,pos,end};if(a)a.push(o);else lines.set(key,[o]);
  });
  const groups=[],cls=k=>k==='house'||k==='low'||k==='mansion'?'d':k;
  for(const a of lines.values()){
    a.sort((p,q)=>p.pos-q.pos);
    let g=null;
    for(const o of a){
      const tgt=2+((hs(o.m.cells[0][0],o.m.cells[0][1],9)*3)|0);
      if(g&&o.pos===g.end+1&&cls(o.m.kind)===cls(g.mods[0].kind)&&g.mods.length<g.tgt&&!o.m.bld&&!g.mods[0].bld){g.mods.push(o.m);g.mis.push(o.mi);g.end=o.end}
      else{g={mods:[o.m],mis:[o.mi],end:o.end,tgt};groups.push(g)}
    }
  }
  groups.forEach(g=>{
    const m=g.mods[0],d=KH_DIRS[m.face],ix=-d[0],iy=-d[1],depth=4+((hs(m.cells[0][0],m.cells[0][1],8)*3)|0),cells=[].concat(...g.mods.map(q=>q.cells));
    const got=[];
    for(let k=0;k<depth;k++){
      let ok=true;for(const [cx,cy] of cells){const px=cx+ix*k,py=cy+iy*k;if(px<0||py<0||px>=W||py>=H||!C.solid[idx(px,py)]||own[idx(px,py)]>=0){ok=false;break}}
      if(!ok)break;for(const [cx,cy] of cells)got.push([cx+ix*k,cy+iy*k]);
    }
    if(!got.length)return;
    let x0=1e9,y0=1e9,x1=-1,y1=-1;
    for(const [px,py] of got){own[idx(px,py)]=g.mis[0];x0=Math.min(x0,px);y0=Math.min(y0,py);x1=Math.max(x1,px);y1=Math.max(y1,py)}
    blds.push({m,mods:g.mods,mi:g.mis[0],mis:g.mis,x0,y0,x1,y1});
  });
  C._bb=new Map();for(const b of blds)for(const q of b.mis)C._bb.set(q,b);
  // yards: solid ground no building reaches
  for(let cy=B;cy<H-B;cy++)for(let cx=B;cx<W-B;cx++){
    const i=idx(cx,cy);if(!C.solid[i]||own[i]>=0)continue;
    if(C.PB&&cx>=C.PB.x0&&cx<=C.PB.x1&&cy>=C.PB.y0&&cy<=C.PB.y1)continue;
    x.fillStyle=hs(cx>>1,cy>>1,220)<.5?'#cdb386':'#c6ab7e';x.fillRect(cx*S,cy*S,S,S);
    if(hs(cx,cy,221)<.07){x.fillStyle='rgba(80,110,50,.55)';x.beginPath();x.arc(cx*S+S/2,cy*S+S/2,S*.45,0,TAU);x.fill()}
  }
  // shadows fall to the south-east, on the street, before any roof is laid
  x.fillStyle='rgba(60,40,20,.2)';
  for(const b of blds){const hw=S*(b.m.kind==='temple'?1.6:b.m.kind==='mansion'?1.3:1)*.9;x.fillRect((b.x0)*S+hw*.6,(b.y0)*S+hw*.9,(b.x1-b.x0+1)*S,(b.y1-b.y0+1)*S)}
  blds.sort((a,b)=>(a.y1-b.y1)||(a.x0-b.x0));
  const dome=(cx,cy,r,col,hi)=>{const g=x.createRadialGradient(cx-r*.35,cy-r*.4,r*.1,cx,cy,r);g.addColorStop(0,hi);g.addColorStop(1,col);x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill();x.strokeStyle=INK;x.lineWidth=.9;x.stroke()};
  for(const b of blds){
    const m=b.m,k=m.kind,r0=hs(m.cells[0][0],m.cells[0][1],4),px=b.x0*S,py=b.y0*S,w=(b.x1-b.x0+1)*S,h=(b.y1-b.y0+1)*S;
    const hw=Math.min(h*.5,S*(k==='temple'?1.5:k==='mansion'?1.25:k==='bath'||k==='pray'?1.1:k==='ruin'?.55:k==='low'?.75:1));
    const pal=KH_ROOF[k]||KH_ROOF.house,roof=pal[(r0*pal.length)|0],wall=khShade(KH_WALLC[k]||'#ead6aa',(r0-.5)*14);
    const rh=h-hw;
    // front wall
    x.fillStyle=wall;x.fillRect(px,py+rh,w,hw);
    x.fillStyle='rgba(60,40,20,.28)';x.fillRect(px,py+rh+hw*.55,w,hw*.45);
    // roof
    const horiz=w>=rh;
    if(k==='ruin'){
      x.fillStyle=roof;x.fillRect(px,py,w,rh);
      x.fillStyle='rgba(40,30,20,.5)';for(let q=0;q<3;q++){const a=hs(m.cells[0][0],m.cells[0][1],230+q);x.fillRect(px+a*w*.6,py+hs(a*9,q,231)*rh*.5,w*.35,rh*.4)}
      x.fillStyle='rgba(70,60,50,.7)';for(let q=0;q<5;q++){x.fillRect(px+hs(b.x0,q,232)*w,py+hs(b.y0,q,233)*rh,1.4,1.4)}
    }else if(k==='temple'||k==='pray'||k==='bath'||k==='mansion'||(k==='house'&&r0<.3)||(k==='shop'&&r0<.15)){
      x.fillStyle=khShade(roof,-8);x.fillRect(px,py,w,rh);x.fillStyle='rgba(255,246,214,.18)';x.fillRect(px,py,w,2);
      x.fillStyle='rgba(60,40,20,.18)';x.fillRect(px+w-2,py,2,rh);
      const rr=Math.min(w,rh)*(k==='temple'?.38:.3);
      const dc=k==='bath'?'#3f9aa6':k==='pray'?'#7aa0d0':k==='temple'?'#e0b838':k==='mansion'?'#d8b040':'#4a8aa8';
      dome(px+w/2,py+rh/2,rr,dc,khShade(dc,60));
      if(k==='temple'||k==='mansion'){x.fillStyle='#e8c040';x.fillRect(px+w/2-.5,py+rh/2-rr-2.2,1,2.4)}
    }else{
      // a flat or pitched roof: light on the north-west side, dark on the south-east, a ridge between
      if(horiz){x.fillStyle=khShade(roof,18);x.fillRect(px,py,w,rh/2);x.fillStyle=khShade(roof,-14);x.fillRect(px,py+rh/2,w,rh/2);x.fillStyle='rgba(255,240,200,.45)';x.fillRect(px+1,py+rh/2-.5,w-2,1)}
      else{x.fillStyle=khShade(roof,18);x.fillRect(px,py,w/2,rh);x.fillStyle=khShade(roof,-14);x.fillRect(px+w/2,py,w/2,rh);x.fillStyle='rgba(255,240,200,.45)';x.fillRect(px+w/2-.5,py+1,1,rh-2)}
      x.strokeStyle='rgba(60,30,10,.22)';x.lineWidth=.6;x.beginPath();
      if(horiz){for(let q=2;q<rh;q+=2.4){x.moveTo(px+1,py+q);x.lineTo(px+w-1,py+q)}}else{for(let q=2;q<w;q+=2.4){x.moveTo(px+q,py+1);x.lineTo(px+q,py+rh-1)}}
      x.stroke();
      if(k==='house'&&r0>.8&&w>10&&rh>10){x.fillStyle='#c8b080';x.fillRect(px+w*.65,py+rh*.2,S*.9,S*.9);x.strokeStyle=INK;x.lineWidth=.6;x.strokeRect(px+w*.65,py+rh*.2,S*.9,S*.9)} // a stair hut on the roof
    }
    // the front of the house: a door and windows on a south front, an awning on a shop
    if(m.face===1)for(const q of b.mods){
      const mx=q.cells.reduce((u,c)=>u+c[0],0)/q.cells.length+.5;
      x.fillStyle='#3a2410';x.fillRect(mx*S-1.6,py+rh+hw*.28,3.2,hw*.72);x.beginPath();x.arc(mx*S,py+rh+hw*.28,1.6,Math.PI,0);x.fill();
      x.fillStyle='rgba(40,28,14,.7)';for(const dxw of [-S*1.1,S*1.1]){const wxx=mx*S+dxw;if(wxx>px+1&&wxx<px+w-1)x.fillRect(wxx-.7,py+rh+hw*.25,1.4,hw*.4)}
    }
    if(k==='shop'){
      const cols=[['#c0412e','#f0e0b8'],['#2f7f8a','#f0e0b8'],['#d09a28','#7a3a2a'],['#4a8a5a','#f0e0b8']][(r0*4)|0];
      const ax=m.face===1?px:m.face===0?px:m.face===2?px:px+w-2.4,ay=m.face===1?py+rh-1:m.face===0?py:py,aw=(m.face===0||m.face===1)?w:2.4,ah=(m.face===0||m.face===1)?2.4:rh;
      const n=(m.face===0||m.face===1)?Math.max(2,Math.round(aw/2.2)):Math.max(2,Math.round(ah/2.2));
      for(let q=0;q<n;q++){x.fillStyle=cols[q&1];if(m.face===0||m.face===1)x.fillRect(ax+q*aw/n,ay,aw/n,ah);else x.fillRect(ax,ay+q*ah/n,aw,ah/n)}
      x.strokeStyle='rgba(52,34,16,.6)';x.lineWidth=.5;x.strokeRect(ax,ay,aw,ah);
    }
    x.strokeStyle=INK;x.lineWidth=1;x.strokeRect(px+.5,py+.5,w-1,h-1);
    x.beginPath();x.moveTo(px,py+rh);x.lineTo(px+w,py+rh);x.strokeStyle='rgba(52,34,16,.55)';x.lineWidth=.7;x.stroke();
  }
  // the edge of every street and square
  x.fillStyle='rgba(52,34,16,.4)';
  for(let cy=1;cy<H-1;cy++)for(let cx=1;cx<W-1;cx++){
    const i=idx(cx,cy);if(C.solid[i]||C.zone[i]===2)continue;
    if(C.solid[i-1])x.fillRect(cx*S,cy*S,1,S);if(C.solid[i+1])x.fillRect(cx*S+S-1,cy*S,1,S);
    if(C.solid[i-W])x.fillRect(cx*S,cy*S,S,1);
  }
  // ---- the crenellated wall, its towers and the great gate ----
  const wallStone=(x0,y0,x1,y1)=>{x.fillStyle='#bba37a';x.fillRect(x0,y0,x1-x0,y1-y0);x.strokeStyle='rgba(60,42,20,.35)';x.lineWidth=.6;x.beginPath();for(let yy=y0+4;yy<y1;yy+=4){x.moveTo(x0,yy);x.lineTo(x1,yy)}for(let xx=x0+6;xx<x1;xx+=6){x.moveTo(xx,y0);x.lineTo(xx,y1)}x.stroke()};
  const WS=B*S;
  wallStone(0,0,W*S,WS);wallStone(0,(H-B)*S,W*S,H*S);wallStone(0,WS,WS,(H-B)*S);wallStone((W-B)*S,WS,W*S,(H-B)*S);
  x.fillStyle='#8a7550';for(let q=0;q<W*S;q+=S*1.2){x.fillRect(q,0,S*.6,S*.5);x.fillRect(q,H*S-S*.5,S*.6,S*.5)}for(let q=0;q<H*S;q+=S*1.2){x.fillRect(0,q,S*.5,S*.6);x.fillRect(W*S-S*.5,q,S*.5,S*.6)}
  x.strokeStyle='#3a2a16';x.lineWidth=2.4;x.strokeRect(WS,WS,(W-2*B)*S,(H-2*B)*S);x.lineWidth=1.2;x.strokeRect(1,1,W*S-2,H*S-2);
  const tower=(cx,cy,r,cap)=>{x.fillStyle='rgba(50,34,16,.28)';x.beginPath();x.ellipse(cx+r*.5,cy+r*.7,r*1.05,r*.8,0,0,TAU);x.fill();const g=x.createLinearGradient(cx-r,cy,cx+r,cy);g.addColorStop(0,'#d8c496');g.addColorStop(1,'#a58f64');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill();x.strokeStyle=INK;x.lineWidth=1.1;x.stroke();dome(cx,cy-r*.15,r*.7,cap,khShade(cap,60))};
  for(const [tx,ty] of [[WS/2,WS/2],[W*S-WS/2,WS/2],[WS/2,H*S-WS/2],[W*S-WS/2,H*S-WS/2]])tower(tx,ty,S*2.8,'#3f7f8c');
  for(let q=1;q<6;q++){const t=q/6;for(const [tx,ty] of [[t*W*S,WS/2],[t*W*S,H*S-WS/2],[WS/2,t*H*S],[W*S-WS/2,t*H*S]])if(Math.abs(tx-KH.CX*S)>S*8||ty<H*S/2)tower(tx,ty,S*1.7,'#b8603e')}
  { // the gate: two towers and an arch
    const gx=KH.CX*S+S/2,gy=(H-B)*S;
    x.fillStyle='#2a1c0e';x.beginPath();x.rect(gx-S*4,gy,S*8,WS);x.fill();x.fillStyle='#e8c860';x.fillRect(gx-S*3.6,gy+S*.4,S*7.2,WS-S*.4);
    x.strokeStyle='#5a3a16';x.lineWidth=1;for(let q=-3;q<=3;q++){x.beginPath();x.moveTo(gx+q*S,gy+S*.4);x.lineTo(gx+q*S,gy+WS);x.stroke()}
    tower(gx-S*5.4,gy+WS/2,S*2.6,'#e0b838');tower(gx+S*5.4,gy+WS/2,S*2.6,'#e0b838');
  }
  // ---- the palace, a great pile of domes and towers ----
  const P=C.PB,pw=(P.x1-P.x0+1)*S,ph=(P.y1-P.y0+1)*S,pxx=P.x0*S,pyy=P.y0*S;
  x.fillStyle='rgba(60,40,20,.25)';x.fillRect(pxx+S*2,pyy+S*3,pw,ph);
  x.fillStyle='#e9d7a0';x.fillRect(pxx,pyy,pw,ph*.78);x.fillStyle='#d6bf80';x.fillRect(pxx,pyy+ph*.78,pw,ph*.22);
  x.strokeStyle='#5a4420';x.lineWidth=2;x.strokeRect(pxx,pyy,pw,ph);x.strokeStyle='rgba(90,66,32,.5)';x.lineWidth=.8;x.beginPath();for(let q=1;q<10;q++){x.moveTo(pxx+q*pw/10,pyy+ph*.78);x.lineTo(pxx+q*pw/10,pyy+ph)}x.moveTo(pxx,pyy+ph*.78);x.lineTo(pxx+pw,pyy+ph*.78);x.stroke();
  dome(KH.CX*S,pyy+ph*.38,pw*.17,'#e0b030','#fff0a0');x.fillStyle='#e8c040';x.fillRect(KH.CX*S-.8,pyy+ph*.38-pw*.17-7,1.6,7);
  for(const dx of [-.3,.3])dome((KH.CX+dx*(P.x1-P.x0))*S,pyy+ph*.42,pw*.09,'#3f8a96','#9ad0d8');
  for(const dx of [-.42,-.14,.14,.42])dome((KH.CX+dx*(P.x1-P.x0))*S,pyy+ph*.18,pw*.05,'#e0b030','#fff0a0');
  for(const [tx,ty] of [[pxx,pyy],[pxx+pw,pyy],[pxx,pyy+ph*.78],[pxx+pw,pyy+ph*.78]])tower(tx,ty,S*2.6,'#e0b838');
  // ---- the squares: ponds in the parks, fountains, wells, obelisks, stalls ----
  C._ponds=[];
  const sm=khShuffled(KH_POND_S,31),md=khShuffled(KH_POND_M,32),lg=khShuffled(KH_POND_L,33);let ns=0,nm=0,nl=0;
  for(const p of C.plazas){
    if(p.z!==2)continue;
    const pw2=p.x1-p.x0+1,ph2=p.y1-p.y0+1,cx=(p.x0+p.x1)>>1,cy=(p.y0+p.y1)>>1,mn=Math.min(pw2,ph2),r=hs(p.x0,p.y0,51);
    let cls=r<.4?0:r<.75?1:2;if(mn<14&&cls===2)cls=1;
    const rx=Math.max(2.4,mn*[.12,.2,.3][cls])+hs(p.y0,p.x0,52)*(cls+1)*.9,ry=rx*(.62+hs(p.x0,p.y1,53)*.3);
    const name=cls===0?sm[ns++%sm.length]:cls===1?md[nm++%md.length]:lg[nl++%lg.length];
    C._ponds.push({cx:cx+.5,cy:cy+.5,rx,ry,name,cls});
    const X=(cx+.5)*S,Y=(cy+.5)*S,RX=rx*S,RY=ry*S;
    x.fillStyle='rgba(60,40,20,.25)';x.beginPath();x.ellipse(X+1.5,Y+2,RX+2,RY+2,0,0,TAU);x.fill();
    x.fillStyle='#e8dcae';x.beginPath();x.ellipse(X,Y,RX+2.2,RY+2.2,0,0,TAU);x.fill();x.strokeStyle=INK;x.lineWidth=1;x.stroke();
    const g=x.createRadialGradient(X-RX*.3,Y-RY*.3,RX*.1,X,Y,RX);g.addColorStop(0,'#a6e0ec');g.addColorStop(1,'#4f95b8');x.fillStyle=g;x.beginPath();x.ellipse(X,Y,RX,RY,0,0,TAU);x.fill();x.strokeStyle='#2a4a60';x.lineWidth=.8;x.stroke();
    x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=.7;for(let q=0;q<2+cls*2;q++){const a=hs(q,p.x0,54)*TAU,rr=.35+hs(q,p.y0,55)*.4;x.beginPath();x.arc(X+Math.cos(a)*RX*rr*.5,Y+Math.sin(a)*RY*rr*.5,RX*.18,0.2,2.2);x.stroke()}
    if(cls>=1){for(let q=0;q<4+cls*5;q++){const a=hs(q,p.x1,56)*TAU,rr=.45+hs(q,p.y1,57)*.45;x.fillStyle='rgba(80,150,70,.85)';x.beginPath();x.ellipse(X+Math.cos(a)*RX*rr,Y+Math.sin(a)*RY*rr,1.5,1,0,0,TAU);x.fill()}} // lily pads
    if(cls===2){x.fillStyle='#c4b078';x.beginPath();x.ellipse(X+RX*.35,Y-RY*.1,RX*.2,RY*.22,0,0,TAU);x.fill();x.strokeStyle=INK;x.stroke();x.fillStyle='rgba(60,110,40,.9)';x.beginPath();x.arc(X+RX*.35,Y-RY*.2,2.4,0,TAU);x.fill()} // an island with a palm
    else{x.fillStyle='#f4f0e0';x.beginPath();x.arc(X,Y,Math.min(3.2,RX*.22),0,TAU);x.fill();x.strokeStyle=INK;x.lineWidth=.8;x.stroke();x.strokeStyle='rgba(255,255,255,.9)';x.beginPath();x.moveTo(X,Y);x.lineTo(X,Y-5);x.moveTo(X,Y-3);x.lineTo(X-2,Y-6);x.moveTo(X,Y-3);x.lineTo(X+2,Y-6);x.stroke()} // a fountain jet
    if(cls>=1){for(let q=0;q<7+cls*4;q++){const a=q/(7+cls*4)*TAU+.3;const ex=X+Math.cos(a)*(RX+3.2),ey=Y+Math.sin(a)*(RY+3.2);x.strokeStyle='#4a7a3a';x.lineWidth=.9;x.beginPath();x.moveTo(ex,ey);x.lineTo(ex+Math.cos(a)*1.5,ey-3);x.stroke()}} // reeds on the bank
  }
  // ---- trees, palms and the furniture of the squares ----
  const palm=(px2,py2,sc)=>{x.fillStyle='rgba(50,36,16,.22)';x.beginPath();x.ellipse(px2+1.6,py2+.8,S*.7*sc,S*.28*sc,0,0,TAU);x.fill();x.strokeStyle='#6a4a22';x.lineWidth=1.2;x.beginPath();x.moveTo(px2,py2);x.lineTo(px2+.4,py2-S*.9*sc);x.stroke();
    x.strokeStyle='#4a7a38';x.lineWidth=1.3;const hx=px2+.4,hy=py2-S*.9*sc;for(let k=0;k<7;k++){const a=k/7*TAU+hs(px2|0,py2|0,60);x.beginPath();x.moveTo(hx,hy);x.quadraticCurveTo(hx+Math.cos(a)*S*.5*sc,hy+Math.sin(a)*S*.3*sc-1.5,hx+Math.cos(a)*S*.95*sc,hy+Math.sin(a)*S*.55*sc+1);x.stroke()}x.fillStyle='#3a2a12';x.beginPath();x.arc(hx,hy,.9,0,TAU);x.fill()};
  const tree=(px2,py2,sc)=>{x.fillStyle='rgba(50,36,16,.22)';x.beginPath();x.ellipse(px2+1.6,py2+1.2,S*.8*sc,S*.34*sc,0,0,TAU);x.fill();const g=x.createRadialGradient(px2-1,py2-S*.5,1,px2,py2-S*.3,S*.85*sc);g.addColorStop(0,'#8ab862');g.addColorStop(1,'#4a7a3a');x.fillStyle=g;x.beginPath();x.arc(px2,py2-S*.35*sc,S*.75*sc,0,TAU);x.fill();x.strokeStyle='rgba(30,60,24,.7)';x.lineWidth=.7;x.stroke()};
  const stallCols=[['#c04a3a','#f0e0b8'],['#4a8a5a','#f0e0b8'],['#d09a30','#7a3a2a'],['#4a6aa0','#f0e0b8'],['#a04a8a','#f0e0b8'],['#c87a30','#f0e0b8']];
  for(const d of L.decor){
    const px2=d.x*S+S/2,py2=d.y*S+S*.8,k=d.k;
    if(/^dpalm|^kh_city2_0$/.test(k))palm(px2,py2,(d.sc||1));
    else if(/^kh_city2_1$|^ltree/.test(k))tree(px2,py2,(d.sc||1)*.9);
    else if(/^kh_city2_2$|^lbush/.test(k)){x.fillStyle='#5a8a46';x.beginPath();x.arc(px2,py2-1,S*.4,0,TAU);x.fill();x.strokeStyle='rgba(30,60,24,.6)';x.lineWidth=.6;x.stroke()}
    else if(k==='kh_city1_1'||k==='well'){x.fillStyle='#b6a888';x.beginPath();x.arc(px2,py2-S*.3,S*.8,0,TAU);x.fill();x.strokeStyle=INK;x.lineWidth=.9;x.stroke();x.fillStyle='#2f5a78';x.beginPath();x.arc(px2,py2-S*.3,S*.5,0,TAU);x.fill()}
    else if(k==='kh_city1_2'||k==='memorial'){x.fillStyle='rgba(50,36,16,.25)';x.beginPath();x.moveTo(px2+S*.4,py2);x.lineTo(px2+S*2.6,py2+S*.4);x.lineTo(px2+S*.4,py2+S*.4);x.fill();x.fillStyle='#f4efe0';x.strokeStyle=INK;x.lineWidth=.9;x.beginPath();x.moveTo(px2,py2-S*3.2);x.lineTo(px2+S*.7,py2+S*.4);x.lineTo(px2-S*.7,py2+S*.4);x.closePath();x.fill();x.stroke();x.fillStyle='#e0b838';x.beginPath();x.moveTo(px2,py2-S*3.2);x.lineTo(px2+S*.18,py2-S*2.6);x.lineTo(px2-S*.18,py2-S*2.6);x.fill()}
    else if(/^kh_stall1_/.test(k)){const c=stallCols[(d.x+d.y)%6],aw=S*1.9,ah=S*1.2;x.fillStyle='rgba(50,36,16,.25)';x.fillRect(px2-aw/2+1.5,py2-ah/2+2,aw,ah);for(let q=0;q<4;q++){x.fillStyle=c[q&1];x.fillRect(px2-aw/2+q*aw/4,py2-ah,aw/4,ah*.55)}x.fillStyle='#b8946a';x.fillRect(px2-aw/2,py2-ah*.45,aw,ah*.5);x.strokeStyle=INK;x.lineWidth=.6;x.strokeRect(px2-aw/2,py2-ah,aw,ah*1.05)}
    else if(k==='kh_city1_3'||k==='statue'){x.fillStyle='#e8e0cc';x.beginPath();x.arc(px2,py2-S*.9,S*.35,0,TAU);x.fill();x.fillRect(px2-S*.3,py2-S*.6,S*.6,S*.8);x.strokeStyle=INK;x.lineWidth=.6;x.strokeRect(px2-S*.3,py2-S*.6,S*.6,S*.8)}
  }
  // doors: a small gold plate on the front of every house, a larger one on shops, inns, temples and baths that are named
  for(const m of C.modules){if(!m.house)continue;const mid=m.cells[(m.cells.length-1)>>1];x.fillStyle='rgba(246,200,70,.85)';x.beginPath();x.arc(mid[0]*S+S/2+KH_DIRS[m.face][0]*S*.5,mid[1]*S+S/2+KH_DIRS[m.face][1]*S*.5,S*.2,0,TAU);x.fill()}
  for(const b of KH_BUILDINGS){if(!b.front)continue;x.fillStyle='#f4c542';x.strokeStyle='#2a1c0e';x.lineWidth=.8;x.beginPath();x.arc(b.front[0]*S+S/2,b.front[1]*S+S/2,S*.62,0,TAU);x.fill();x.stroke()}
  // ---- an aged edge: darkened rim and a light burn ----
  const vg=x.createRadialGradient(W*S/2,H*S/2,W*S*.32,W*S/2,H*S/2,W*S*.74);vg.addColorStop(0,'rgba(80,50,20,0)');vg.addColorStop(1,'rgba(80,50,20,.34)');x.fillStyle=vg;x.fillRect(0,0,W*S,H*S);
  return cv;
}
/* ---- the names: gathered once in map squares, then placed each time the map moves, most important first, none over another ---- */
function khMapLabels(C){
  const out=[],add=(t,x,y,pri,o)=>out.push(Object.assign({t,x,y,pri},o||{}));
  const hs=khHash;
  for(const d of KH_DISTRICTS)add(d.n.toUpperCase(),(d.x0+d.x1)/2,(d.y0+d.y1)/2,0,{k:'dist',col:'#5a3a16'});
  add('THE PALACE OF KHEMETRA',KH.CX,C.PB.y0+(C.PB.y1-C.PB.y0)*.62,0,{k:'major',col:'#5a2a0a'});
  add('THE CHURCH OF LIGHT',122,190,1,{k:'major',col:'#2a3a5a'});
  add('THE GREAT GATE',KH.CX,C.H-KH.WALL-2,1,{k:'major',col:'#5a2a0a'});
  add('The Avenue of the Sun',KH.CX+5.5,318,2,{k:'road',col:'#3a2a16',rot:-Math.PI/2});
  add('Ring Road',KH.CX,246,3,{k:'road',col:'#4a3820'});add('West Road',75,KH.CY+.5,3,{k:'road',col:'#4a3820'});add('East Road',325,KH.CY+.5,3,{k:'road',col:'#4a3820'});
  add('THE COURT OF THE GOLDEN SUN',KH.CX,C.PB.y1+14,1,{k:'major',col:'#7a5a10'});
  add('The Palace Gate',KH.CX,243,3,{k:'road',col:'#5a2a0a'});
  // squares, markets, parks, ponds
  let pi=0;const pn=khShuffled(KH_PARK_NAMES,41);
  for(const p of C.plazas){const nm=p.park?pn[(pi++)%pn.length]:p.name;if(!nm)continue;add(nm,(p.x0+p.x1)/2,(p.y0+p.y1)/2+((p.y1-p.y0)>>2)+1,2,{k:'plaza',col:p.park||p.z===2?'#2a5a22':'#3a2a16'})}
  if(C._ponds)for(const q of C._ponds)add(q.name,q.cx,q.cy-q.ry-1.4,3,{k:'pond',col:'#1f5a7a',ital:true});
  // markets: the rows of stalls
  const rows=['Melon Row','Carpet Row','Copper Corner','Amphora Alley','Hay Yard','Greengrocers\' Row','Dyers\' Corner','Basket Corner'];let ri=0;
  for(const p of C.plazas){if(p.z!==1)continue;for(const [fx,fy] of [[.22,.22],[.78,.22],[.22,.78],[.78,.78]])add(rows[(ri++)%rows.length],p.x0+(p.x1-p.x0)*fx,p.y0+(p.y1-p.y0)*fy,6,{k:'small',col:'#7a4a1a',ital:true})}
  // streets: a name each, repeated along the street where the way is clear
  const st=C._streets||(C._streets=khNameStreets(C));
  for(const s of st.v)for(let y=34;y<C.H-30;y+=48){let ok=C.zone[C.idx(s.x,y)]===0;for(let k=-5;k<=5;k++)if(C.solid[C.idx(s.x,y+k)])ok=false;if(ok)add(s.n,s.x+.5,y,4,{k:'street',col:'#4a3820',rot:-Math.PI/2})}
  for(const s of st.h)for(let xx=34;xx<C.W-30;xx+=54){let ok=C.zone[C.idx(xx,s.y)]===0;for(let k=-5;k<=5;k++)if(C.solid[C.idx(xx+k,s.y)])ok=false;if(ok)add(s.n,xx,s.y+.5,4,{k:'street',col:'#4a3820'})}
  // cul-de-sacs
  if(C.lanes){const cn=khShuffled(KH_CUL_A.flatMap(a=>KH_CUL_B.map(b=>a+' '+b)),43);C.lanes.filter(l=>{const q=C.idx((l.x0+l.x1)>>1,(l.y0+l.y1)>>1);return !C.solid[q]&&C.zone[q]===0}).forEach((l,i)=>{const cx=(l.x0+l.x1+1)/2,cy=(l.y0+l.y1+1)/2;add(cn[i%cn.length],cx,cy,5,{k:'lane',col:'#6a4a28',ital:true,rot:l.v?-Math.PI/2:0})})}
  // towers
  const tn=khShuffled(KH_TOWER_N,47);let ti=0;
  for(const e of LEVELS[44].sky||[]){if(!/^kh_tow/.test(e.k))continue;const n=tn[ti%tn.length],ord=Math.floor(ti/tn.length);ti++;add((ti%2?'Tower of the ':'The ')+n+(ti%2?'':' Tower')+(ord?' '+(ord+1):''),e.x,e.y-1.4,4,{k:'tower',col:'#5a2a3a'})}
  // prominent shops, temples, baths and houses
  const sa=khShuffled(KH_SHOP_A,53),pr=khShuffled(KH_PRAY_N,54),tm=khShuffled(KH_TEMPLE_N,55),bn=khShuffled(KH_BATH_N,56);let a1=0,a2=0,a3=0,a4=0;
  const front=(m,o)=>{const mid=m.cells[(m.cells.length-1)>>1],d=KH_DIRS[m.face];return [mid[0]+.5+d[0]*(o||1.6),mid[1]+.5+d[1]*(o||1.6)]};
  const bnamed=new Set();
  for(const b of KH_BUILDINGS){if(!b.front||!b.m)continue;bnamed.add(b.m);const col=b.room==='inn'?'#7a1a10':b.room==='prayer'||b.room==='temple'?'#2a3a7a':b.room==='bath'?'#0a5a6a':b.room==='ruin'||b.room==='cellar'?'#5a5448':'#3a2208';const [fx,fy]=front(b.m,1.7);
    if(b.room==='shop'){(C._shopMarks||(C._shopMarks=[])).push({x:fx,y:fy});add(b.name,fx,fy+1.2,2,{k:'shopm',col:'#5a2a00'});continue} // the shops: a marker on the door and a bigger, darker name that wins over the street names
    add(b.name,fx,fy,/^(den|urnhouse|ledgerhouse|granary|baths_cellar|home|drumhouse|hs_)/.test(b.id)?7:5,{k:'shop',col})}
  C.modules.forEach((m,i)=>{
    if(bnamed.has(m)||!m.house)return;
    const r=hs(m.cells[0][0],m.cells[0][1],77),k=m.kind;let nm=null,col='#3a2208',pri=7;
    if(k==='shop'&&r<.4)nm=r<.2?sa[(a1++)%sa.length]:'The '+KH_TRADES[(r*97|0)%KH_TRADES.length]+"'s";
    else if(k==='pray'&&r<.7){nm='House of the '+pr[(a2++)%pr.length];col='#2a3a7a'}
    else if(k==='temple'){nm='Temple of '+tm[(a3++)%tm.length];col='#2a3a7a';pri=5}
    else if(k==='bath'&&r<.6){nm=bn[(a4++)%bn.length];col='#0a5a6a';pri=6}
    else if(k==='mansion'&&r<.08){nm='Villa '+KH_NAMES[(r*1e3|0)%KH_NAMES.length];pri=7}
    if(!nm)return;const [fx,fy]=front(m,1.7);add(nm,fx,fy,pri,{k:'shop',col});
  });
  return out;
}
function khPlaceLabels(C,cs,ox,oy){
  const key=cs.toFixed(3)+'|'+Math.round(ox)+'|'+Math.round(oy);
  if(C._lk===key)return C._lp;
  if(!C._labels)C._labels=khMapLabels(C);
  const sizes={dist:[cs*3.6,9,15],major:[cs*2.6,8,12],plaza:[cs*1.9,7,11],pond:[cs*1.5,6.5,9],road:[cs*1.6,7,10],street:[cs*1.5,6.5,9.5],lane:[cs*1.3,6,8.5],tower:[cs*1.3,6.5,9],shop:[cs*1.15,6,9.5],shopm:[cs*1.6,7,11],small:[cs*1.2,6,8.5]};
  const cand=[];
  for(const l of C._labels){const sx=ox+l.x*cs,sy=oy+l.y*cs;if(sx<-60||sy<-30||sx>DW+60||sy>DH+30)continue;const z=sizes[l.k]||sizes.shop;cand.push({l,sx,sy,sz:clamp(z[0],z[1],z[2])})}
  cand.sort((a,b)=>a.l.pri-b.l.pri);
  const placed=[],res=[],wcache=C._wc||(C._wc={});
  ctx.save();
  for(const c of cand){
    const l=c.l,ck=l.t+'|'+Math.round(c.sz*2)+(l.ital?'i':'');let w=wcache[ck];
    if(w===undefined){ctx.font=`${l.ital?'italic ':''}bold ${c.sz}px ${FUI}`;w=wcache[ck]=ctx.measureText(l.t).width}
    const rot=l.rot?true:false,bw=(rot?c.sz:w)+3,bh=(rot?w:c.sz)+3,x0=c.sx-bw/2,y0=c.sy-bh/2;
    let hit=false;for(let i=0;i<placed.length;i++){const p=placed[i];if(x0<p[0]+p[2]&&x0+bw>p[0]&&y0<p[1]+p[3]&&y0+bh>p[1]){hit=true;break}}
    if(hit)continue;
    placed.push([x0,y0,bw,bh]);res.push(c);
  }
  ctx.restore();
  C._lk=key;C._lp=res;return res;
}
function khDrawCityMap(cs,ox,oy){
  const C=KH_CITY;if(!C){return}
  if(!KH_MAPIMG){KH_MAPIMG=khBuildMapImage()}
  const halo='rgba(244,234,196,.92)';
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.fillStyle='#bfa97a';ctx.fillRect(0,0,DW,DH);
  ctx.drawImage(KH_MAPIMG,ox,oy,C.W*cs,C.H*cs);
  for(const c of khPlaceLabels(C,cs,ox,oy)){
    const l=c.l;ctx.save();ctx.translate(c.sx,c.sy);if(l.rot)ctx.rotate(l.rot);
    ctx.font=`${l.ital?'italic ':''}bold ${c.sz}px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    ctx.lineWidth=Math.max(2,c.sz*.3);ctx.strokeStyle=halo;ctx.strokeText(l.t,0,0);ctx.fillStyle=l.col;ctx.fillText(l.t,0,0);ctx.restore();
  }
  for(const m of C._shopMarks||[]){ // a gold coin on the door of every shop
    const mx=ox+m.x*cs,my=oy+m.y*cs;if(mx<-10||my<-10||mx>DW+10||my>DH+10)continue;const r=clamp(cs*.8,3.2,6.5);
    ctx.save();ctx.beginPath();ctx.arc(mx,my,r+1.2,0,Math.PI*2);ctx.fillStyle='#3a1c00';ctx.fill();
    ctx.beginPath();ctx.arc(mx,my,r,0,Math.PI*2);ctx.fillStyle='#ffd23a';ctx.fill();
    ctx.beginPath();ctx.arc(mx,my,r*.55,0,Math.PI*2);ctx.lineWidth=Math.max(.8,r*.22);ctx.strokeStyle='#a06a00';ctx.stroke();ctx.restore();
  }
  if(typeof drawRumourMarks==='function')drawRumourMarks(ox,oy,cs);
  // the hatch to the cisterns once the vizier has named it
  if(G.flags.khWizardKnown){ctx.fillStyle='#7a1a10';ctx.beginPath();ctx.arc(ox+(KH_HATCH.x+.5)*cs,oy+(KH_HATCH.y+.5)*cs,Math.max(2,cs*.5),0,Math.PI*2);ctx.fill();
    const sx=ox+(KH_HATCH.x+.5)*cs,sy=oy+(KH_HATCH.y-1.5)*cs;ctx.font=`bold ${clamp(cs*1.4,7,10)}px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.strokeStyle=halo;ctx.strokeText('Hatch to the Cisterns',sx,sy);ctx.fillStyle='#7a1a10';ctx.fillText('Hatch to the Cisterns',sx,sy)}
  // a compass rose
  { const cx=DW-mapRes()[0]-30,cy=44,r=20;ctx.save();ctx.translate(cx,cy);ctx.fillStyle='rgba(236,222,176,.9)';ctx.beginPath();ctx.arc(0,0,r+3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#3a2814';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='#3a2814';for(let k=0;k<4;k++){ctx.save();ctx.rotate(k*Math.PI/2);ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(3,-3);ctx.lineTo(0,0);ctx.lineTo(-3,-3);ctx.closePath();ctx.fillStyle=k===0?'#a8402e':'#3a2814';ctx.fill();ctx.restore()}
    ctx.font='bold 8px '+FUI;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#3a2814';ctx.fillText('N',0,-r-8);ctx.restore() }
  // a small key
  ctx.save();ctx.fillStyle='rgba(30,20,10,.82)';rrect(ctx,6,DH-80,168,54,4);ctx.fill();
  const key=[['#c8744a','Houses'],['#d9a43a','Shops'],['#f2ecd8','Temples'],['#6fb8c0','Baths'],['#8a8070','Ruins'],['#9fbe74','Parks'],['#4f95b8','Ponds'],['#f3d57a','Avenue'],['#f6c846','Doors']];
  key.forEach(([c,t],i)=>{const kx=12+(i%3)*54,ky=DH-74+Math.floor(i/3)*16;ctx.fillStyle=c;ctx.fillRect(kx,ky,8,8);ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=.6;ctx.strokeRect(kx,ky,8,8);txt(t,kx+11,ky+5,7,'#e8dcb4','left')});
  ctx.restore();
}
