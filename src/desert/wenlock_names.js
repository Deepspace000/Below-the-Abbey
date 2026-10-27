/* ==========================================================================
   WENLOCK: NUMBERS, NAMES AND STREET SIGNS (prefix wln). Every door of the town was the same door. Now:
   - each house has its number on a brass-and-enamel plate set in its door tile (odd numbers on the west or north side of a street, even on the east or south side, counted from
     the west or the north), a door painted one of ten colours, and a knocker; some doors have a coloured fan-light;
   - about forty cottages have a name, on a hanging board beside the door ("Pear Tree Cottage, 11 High Street");
   - the corners of the streets have a signpost with white enamel street plates, readable from both ways; the bridge has plates on its parapet;
   - the west gate is a proper gate: wooden leaves bound in iron, a lamp each side, and a board over it.
   The plates are the same kind of thing as the shop signs: decor with wd and txt, drawn by shopSign() (wrapped below for the white street plates).
   ========================================================================== */
const WLN_STREET={N:'High Street',S:'High Street',MW:'Mill Lane',ME:'Mill Lane',CW:'Church Lane',CE:'Church Lane',GW:'Green Lane',GE:'Green Lane',TN:'Back Track',TS:'Back Track'};
const WLN_HINT={N:'high',S:'high',MW:'mill',ME:'mill',CW:'church',CE:'church',GW:'green',GE:'green',TN:'track',TS:'track'};
const WLN_ODD={N:1,MW:1,CW:1,GW:1,TN:1};   // the sides that carry the odd numbers
/* ten door colours: [name, r, g, b] */
const WLN_DOORS=[['racing green',38,92,60],['navy blue',38,60,124],['oxblood',124,34,38],['black',36,34,36],['cream',230,216,180],['mustard',200,152,40],['plum',96,48,104],['teal',36,122,128],['slate grey',98,106,114],['terracotta',194,98,46]];
/* the house names: [name, where it likes to stand] */
const WLN_NAMES=[['Pear Tree Cottage','any'],['Wren\'s Rest','any'],['Honeysuckle Cottage','any'],['Mill View','mill'],['The Nook','any'],['Rose Cottage','any'],['Bramble Cottage','any'],['Hollyhock House','any'],
  ['Church View','church'],['Tansy Cottage','any'],['Dove Cottage','church'],['Fiddler\'s Rest','any'],['Lavender Cottage','any'],['The Old Dairy','track'],['Sparrow Hall','any'],['Elm Tree House','any'],['Primrose Cottage','any'],
  ['Brook Cottage','mill'],['Thimble Cottage','any'],['The Sheepfold','track'],['Foxglove Cottage','any'],['Marigold House','any'],['Ivy Cottage','any'],['The Hollies','any'],['Cobbler\'s Rest','high'],['The Willows','mill'],
  ['Jasmine Cottage','any'],['Damson Cottage','green'],['Quince House','any'],['Robin\'s Nest','any'],['Bluebell Cottage','green'],['Meadow View','track'],['Orchard End','green'],['Little Thatch','any'],['Brewer\'s Cottage','high'],
  ['Lamplighter\'s Cottage','high'],['Thrush Cottage','any'],['Hazel Cottage','any'],['Apple Loft','green'],['Barley Mow','track'],['Gable End','any'],['Green View','green'],['Weaver\'s Cottage','high'],['Swallow\'s Rest','any'],['Sexton\'s Cottage','church']];
/* ---- the brass numeral plate, the knocker, and the colour of the door, painted into a copy of the door tile ---- */
function wlnDoorTile(gid,h,pal,num,fan){
  return wlgTile(gid,'door|'+pal+'|'+num+'|'+(fan===undefined?'-':fan),(x,w,hh)=>{
    const top=hh-128,c=WLN_DOORS[pal];
    // the door itself: the darker pixels inside the arch of the opening take the new colour, keeping the grain and the panels
    if(c){const X0=36,X1=94,Y0=top+28,Y1=hh-2,id=x.getImageData(X0,Y0,X1-X0,Y1-Y0),d=id.data,iw=X1-X0;
      for(let yy=0;yy<Y1-Y0;yy++)for(let xx=0;xx<iw;xx++){const wx=X0+xx,wy=Y0+yy;
        if(wy<top+58){const dx=wx-65,dy=wy-(top+58);if(dx*dx+dy*dy>29*29)continue}
        const i=(yy*iw+xx)*4,r=d[i],g=d[i+1],b=d[i+2],l=.3*r+.59*g+.11*b;
        if(l<138){const k=Math.min(1.45,.35+l/80);d[i]=Math.min(255,c[1]*k);d[i+1]=Math.min(255,c[2]*k);d[i+2]=Math.min(255,c[3]*k)}}
      x.putImageData(id,X0,Y0)}
    // the engine shows a wall tile mirrored left to right, so the things painted on it are painted in a mirror (and read the right way round in the game)
    x.save();x.translate(w,0);x.scale(-1,1);
    // a stained fan-light in the top of the doorway
    if(fan!==undefined&&fan!==null){const cx=65,cy=top+62,r=21;x.save();x.beginPath();x.arc(cx,cy,r,Math.PI,0);x.lineTo(cx+r,cy+3);x.lineTo(cx-r,cy+3);x.closePath();x.clip();
      const pal2=WLGS_SETS[fan%WLGS_SETS.length];for(let i=0;i<7;i++){const a0=Math.PI+i*Math.PI/7,a1=Math.PI+(i+1)*Math.PI/7,cc=WLGS_COL[pal2[i%pal2.length]];x.beginPath();x.moveTo(cx,cy+3);x.arc(cx,cy+3,r+4,a0,a1);x.closePath();
        const g=x.createRadialGradient(cx,cy,2,cx,cy,r);g.addColorStop(0,cc[1]);g.addColorStop(1,cc[0]);x.fillStyle=g;x.fill();x.strokeStyle='#17140f';x.lineWidth=1.8;x.stroke()}
      x.restore();x.strokeStyle='#17140f';x.lineWidth=2.4;x.beginPath();x.arc(cx,cy,r+1,Math.PI,0);x.lineTo(cx+r+1,cy+4);x.lineTo(cx-r-1,cy+4);x.stroke()}
    // the knocker: a brass ring on a plate, and a letter slot
    x.fillStyle='#b8862c';x.beginPath();x.arc(80,top+70,3.4,0,6.3);x.fill();x.strokeStyle='#e8c060';x.lineWidth=2.1;x.beginPath();x.arc(80,top+76,4.6,0,6.3);x.stroke();x.fillStyle='#8a6420';x.fillRect(52,top+86,22,4);x.fillStyle='#e0b850';x.fillRect(53,top+86,20,1.5);
    // the number: a brass-rimmed oval of cream enamel beside the door
    if(num){const px=111,py=top+50,s=String(num),fs=s.length>2?12:s.length>1?15:17;
      x.save();x.fillStyle='#6a4a14';x.beginPath();x.ellipse(px,py,16.5,12,0,0,6.3);x.fill();x.fillStyle='#d8a838';x.beginPath();x.ellipse(px,py,15,10.8,0,0,6.3);x.fill();x.fillStyle='#f6eed4';x.beginPath();x.ellipse(px,py,12.6,8.6,0,0,6.3);x.fill();
      x.strokeStyle='#8a6a20';x.lineWidth=.9;x.beginPath();x.ellipse(px,py,11,7.2,0,0,6.3);x.stroke();
      x.font='bold '+fs+'px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#1c1208';x.fillText(s,px,py+1);
      x.fillStyle='#e8c860';for(const sx of [-15,15]){x.beginPath();x.arc(px+sx,py,1.4,0,6.3);x.fill()}x.restore()}
    x.restore();
  });
}
/* ---- white enamel street plates, in the way of the shop signs: decor with wd, txt and plate:'street' ---- */
const WLN_PLATES={};
function wlnStreetPlate(d){
  const id=d.txt.join('|');if(WLN_PLATES[id])return WLN_PLATES[id];
  return WLN_PLATES[id]=mkCanvas(320,150,(x,w,h)=>{
    x.fillStyle='rgba(0,0,0,.35)';x.fillRect(6,8,w-8,h-8);
    x.fillStyle='#161a28';x.fillRect(0,0,w-6,h-8);x.fillStyle='#f4f0e2';x.fillRect(6,6,w-18,h-20);
    x.strokeStyle='#161a28';x.lineWidth=3;x.strokeRect(14,14,w-34,h-36);
    x.fillStyle='#8a8678';for(const [px,py] of [[10,10],[w-16,10],[10,h-18],[w-16,h-18]]){x.beginPath();x.arc(px,py,2.4,0,6.3);x.fill()}
    x.textAlign='center';x.textBaseline='middle';
    const fit=(t,y,fs0,font,col)=>{let fs=fs0;x.font=font+' '+fs+'px Georgia,serif';while(x.measureText(t).width>w-60&&fs>10){fs-=2;x.font=font+' '+fs+'px Georgia,serif'}x.fillStyle=col;x.fillText(t,(w-6)/2,y)};
    fit(d.txt[0],d.txt[1]?h*.42:h*.5,50,'bold','#161a28');
    if(d.txt[1])fit(d.txt[1],h*.7,24,'italic','#3a3a46');
  });
}
{const _s=shopSign;shopSign=function(d){if(d&&d.k==='sign_wlst'&&d.txt)return wlnStreetPlate(d);return _s.apply(this,arguments)}}
/* a freestanding street sign: a painted signpost (walk up and read it) with a plate on each of the two ways it faces */
let WLN_POSTS=0;
function wlnPost(C,x,y,plates,talk,rad){
  const q=C.free(x,y)?[x,y]:C.near(x,y,rad||2);if(!q)return null;
  const id='wlo_post'+(WLN_POSTS++);khNpc(id,'A signpost','greensign',()=>say(talk,[BYE]));
  C.dc('greensign',q[0],q[1],{npc:id,deco:false});
  for(const [wd,t1,t2] of plates)C.decor.push({k:'sign_wlst',x:q[0],y:q[1],block:false,wd,txt:[t1,t2||''],plate:'street',sc:.85});
  return q;
}
/* ---- the pass ---- */
function wlnPass(C){
  const {houses,rows,chars,ch,hs}=C;
  // 1. numbers: counted from the west (or the north) along each side of each street
  const sideOf=h=>{const lot=WL_LOTS[h.k];return lot?lot[0]:null};
  const seq={};
  houses.forEach(h=>{const s=sideOf(h);if(!s)return;(seq[s]=seq[s]||[]).push(h)});
  for(const s in seq){const odd=WLN_ODD[s]?1:0;seq[s].sort((a,b)=>(a.x0-b.x0)||(a.y0-b.y0));seq[s].forEach((h,i)=>{h.num=2*i+(odd?1:2);h.street=WLN_STREET[s];h.sideKey=s})}
  // 2. names: the preferred ones where they fit, about forty of the cottages
  const homes=houses.filter(h=>h.num&&!h.sp);
  const pool=WLN_NAMES.slice(),take=hint=>{let i=pool.findIndex(n=>n[1]===hint);if(i<0)i=pool.findIndex(n=>n[1]==='any');if(i<0)i=0;return pool.splice(i,1)[0][0]};
  const forge=homes.find(h=>h.sideKey==='N'&&h.x0===14);if(forge)forge.hname='The Old Forge House';
  homes.forEach((h,i)=>{if(h.hname)return;if(hs(h.x0,h.y0,44)<.1)return;h.hname=take(WLN_HINT[h.sideKey]);});
  // 3. doors: colour, knocker, number, fan-light; and the name board beside the door
  const FAN={chandler:3,school:1,almshouse:4};
  houses.forEach((h,k)=>{
    if(!h.num)return;
    const dc=rows[h.door[1]][h.door[0]],gid=chars[dc];if(!gid)return;
    const pal=h.sp?-1:((hs(h.x0,h.y0,51)*WLN_DOORS.length)|0),fan=h.sp&&FAN[h.sp.kind]!==undefined?FAN[h.sp.kind]:(!h.sp&&hs(h.x0,h.y0,52)<.12?((hs(h.x0,h.y0,53)*6)|0):undefined);
    const g2=wlnDoorTile(gid,h,pal,h.num,fan);if(g2!==gid&&KH_DOOR[gid])KH_DOOR[g2]=KH_DOOR[gid];   // the new tile opens the same door
    rows[h.door[1]][h.door[0]]=ch(g2);
    h.doorCol=pal>=0?WLN_DOORS[pal][0]:null;
    if(h.hname){
      const horizontal=h.face==='N'||h.face==='S';
      for(const sgn of [1,-1]){
        const sx=horizontal?h.front[0]+sgn:h.front[0],sy=horizontal?h.front[1]:h.front[1]+sgn;
        const wallCell=horizontal?[sx,h.face==='S'?h.y1:h.y0]:[h.face==='E'?h.x1:h.x0,sy];
        if(!rows[wallCell[1]]||rows[wallCell[1]][wallCell[0]]==='.')continue;
        C.decor.push({k:'sign_wlh'+h.id,x:sx,y:sy,block:false,wd:h.wall,txt:[h.hname,h.num+' '+h.street],sc:.78});break}
    }
  });
  // 4. the street signs at the corners
  wlnPost(C,23,49,[[[1,0],'CHURCH LANE','North to the church'],[[0,1],'HIGH STREET','Nos 1 to 35']],'A signpost at the corner. One board reads CHURCH LANE, north to the church. The other reads HIGH STREET.');
  wlnPost(C,71,51,[[[1,0],'MILL LANE','South to the mill'],[[0,-1],'HIGH STREET','Nos 2 to 24']],'A signpost at the corner. One board reads MILL LANE, south to the brook and the mill. The other reads HIGH STREET.');
  wlnPost(C,83,49,[[[1,0],'GREEN LANE','North to the back track'],[[0,1],'HIGH STREET','The east end']],'A signpost at the corner. One board reads GREEN LANE, north to the back track. The other reads HIGH STREET.');
  wlnPost(C,25,31,[[[-1,0],'CHURCHYARD LANE','To the old graveyard'],[[0,1],'CHURCH LANE','South to High Street']],'A signpost. CHURCHYARD LANE goes west to the old graveyard. CHURCH LANE goes south to High Street.');
  wlnPost(C,39,13,[[[-1,0],'BLACKBRIAR LANE','To the witch\'s wood'],[[0,1],'BACK TRACK','East to the farms']],'A signpost. BLACKBRIAR LANE goes north to the witch\'s wood, and the board says to think twice. BACK TRACK goes east to the farms.');
  wlnPost(C,85,15,[[[-1,0],'GREEN LANE','South to High Street'],[[0,-1],'BACK TRACK','West to Blackbriar Lane']],'A signpost at the end of the back track. GREEN LANE goes south to High Street.');
  wlnPost(C,40,49,[[[1,0],'MARKET SQUARE','Market day on Saturday'],[[0,1],'HIGH STREET','Nos 1 to 35']],'A signpost at the edge of the market square. MARKET SQUARE, market day on Saturday, and HIGH STREET.');
  wlnPost(C,29,52,[[[1,0],'THE VILLAGE GREEN','Duck pond. Please do not feed the ducks.'],[[0,-1],'HIGH STREET','Back to the square']],'A signpost at the head of the path. THE VILLAGE GREEN, with a duck pond. Underneath: please do not feed the ducks. Somebody has added: they feed themselves.');
  wlnPost(C,73,83,[[[-1,0],'MILL LANE','The brook and the mill'],[[0,-1],'HIGH STREET','Back up the lane']],'A signpost by the bridge. MILL LANE, over the old bridge to the mill. HIGH STREET is back up the lane.');
  // the bridge: plates on the low parapets
  C.decor.push({k:'sign_wlst',x:72,y:84,block:false,wd:[-1,0],txt:['THE OLD BRIDGE','Built 1412'],plate:'street',sc:.8});
  C.decor.push({k:'sign_wlst',x:72,y:85,block:false,wd:[1,0],txt:['WENLOCK BROOK','Mind the ducks'],plate:'street',sc:.8});
  wlnGate(C);
}
/* the west gate, a proper one: oak leaves bound in iron under the arch, a lamp each side, a board overhead */
function wlnGate(C){
  const tex=T_DOORS.wlgate2;if(tex===undefined||!TEX[tex]||!TEX[tex].d)return;
  const T=TEX[tex],w=128,h=(T.d.length/512)|0,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.putImageData(new ImageData(new Uint8ClampedArray(T.d),w,h),0,0);
  const top=h-128*2.05,bot=h-4;
  // the arch of the opening and two oak leaves
  x.save();x.beginPath();x.moveTo(10,bot);x.lineTo(10,top+60);x.arc(64,top+60,54,Math.PI,0);x.lineTo(118,bot);x.closePath();x.clip();
  for(let i=0;i<2;i++){const lx=10+i*54,g=x.createLinearGradient(lx,0,lx+54,0);g.addColorStop(0,'#4a3018');g.addColorStop(.5,'#6a4824');g.addColorStop(1,'#42281a');x.fillStyle=g;x.fillRect(lx,top,54,bot-top);
    for(let p=0;p<4;p++){x.fillStyle='rgba(20,10,4,.55)';x.fillRect(lx+p*13.5,top,1.6,bot-top);x.fillStyle='rgba(255,220,160,.12)';x.fillRect(lx+p*13.5+2,top,1.2,bot-top)}
    x.fillStyle='#1c1c22';for(const fy of [top+70,top+(bot-top)*.5+20,bot-34]){x.fillRect(lx,fy,54,7);x.fillStyle='#3a3a44';x.fillRect(lx,fy,54,1.8);x.fillStyle='#1c1c22';for(let r=0;r<4;r++){x.beginPath();x.arc(lx+6+r*14,fy+3.5,1.9,0,6.3);x.fill()}}}
  x.fillStyle='#0c0a08';x.fillRect(63,top,2,bot-top);
  x.strokeStyle='#d0a840';x.lineWidth=3;for(const rx of [56,72]){x.beginPath();x.arc(rx,bot-(bot-top)*.38,5,0,6.3);x.stroke()}
  x.restore();
  x.strokeStyle='#14110e';x.lineWidth=5;x.beginPath();x.moveTo(10,bot);x.lineTo(10,top+60);x.arc(64,top+60,54,Math.PI,0);x.lineTo(118,bot);x.stroke();
  const id=addTex(x.getImageData(0,0,w,h).data,null);TEX[id].h=h;TEX[id].wh=T.wh;T_DOORS.wlgate2=id;
  // a lamp each side of the gate and a board over it
  for(const [lx,ly] of [[3,49],[3,51]])C.lamp(lx,ly);
  C.decor.push({k:'sign_wlst',x:3,y:50,block:false,wd:[-1,0],txt:['WEST GATE','Not yet open'],plate:'street',sc:.9});
}
