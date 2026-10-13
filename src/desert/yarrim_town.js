/* ==========================================================================
   YARRIM: THE VILLAGE. Built from the plan in yarrim_layout.js: a hamlet of about twenty tiny seaside cottages (two squares across and
   two deep, each its own colour, with its own roof) round little one-square cobbled lanes, a harbour square at the root of the pier,
   a little park, and the buildings whose doors open: the inn, the ship dealer, the trader, the harbourmaster, the chandler, the chapel,
   Old Maren's house, the Net Loft and the lighthouse. Roofs are painted pictures (kh_yroof3_*) drawn straight on, standing over the walls.
   ========================================================================== */
const YR_ISLANDS=[[82,22,4.5,2.8],[99,26,6.5,4.2],[90,52,5.5,3.4],[103,57,4.5,2.6],[76,58,3.5,1.9],[108,41,5.5,3.6]];
/* p is the portal number and the room number (YR.FIRST+p-1); sp is the building's name in the plan */
const YR_HOUSES=[
  {p:1,sp:'inn',     name:'The Drowned Lantern',          room:'inn',   tpl:'inn',     keeper:'yr_inn',      start:[4,5],door:'yardoor3'},
  {p:2,sp:'harbour', name:"The Harbourmaster's Office",   room:'hall',  tpl:'harbour', keeper:'yr_harbour',  start:[4,5],door:'yardoor2'},
  {p:3,sp:'dealer',  name:"Selk's Ship Dealing",          room:'ship',  tpl:'ship',    keeper:'yr_dealer',   start:[4,5],door:'yardoor5'},
  {p:4,sp:'trader',  name:"Wen's Trading Post",           room:'shop',  tpl:'trader',  keeper:'yr_trader',   start:[4,5],door:'yardoor6'},
  {p:5,sp:'chapel',  name:'The Chapel of the Tides',      room:'prayer',tpl:'chapel',  keeper:'yr_priest',   start:[4,5],door:'yardoor4'},
  {p:6,sp:'maren',   name:"Old Maren's House",            room:'home',  tpl:'maren',   keeper:'yr_maren',    start:[4,5],door:'yardoor7',scene:'fisher'},
  {p:7,sp:'loft',    name:'The Net Loft',                 room:'hall',  tpl:'loft',    keeper:null,          start:[4,5],door:'yardoor'},
  {p:8,sp:'light',   name:'The Yarrim Light',             room:'prayer',tpl:'light',   keeper:'yr_orsa',     start:[3,7],door:'yardoor2',stone:true},
  {p:9,sp:'chandler',name:'Brine and Rope',               room:'shop',  tpl:'chandler',keeper:'yr_chandler', start:[4,5],door:'yardoor3'}
];
const YR_ROOMS=YR_HOUSES.length;
const YR_WINTEX=['yarpink','yaryellow','yargreen','yarblue','yarcoral','yarwall'];   // the painted wall with a window, one for each colour of cottage
const YR_DOORTEX=['yardoor','yardoor2','yardoor3','yardoor4','yardoor5','yardoor6','yardoor7'];

/* ---- the little rooms: nine squares by seven (the lighthouse seven by nine), a wooden floor, the plaster of the cottage's own colour, and
   the sea everywhere: nets, rope, anchors, buckets and ships in bottles. The keeper always stands behind a gap in the counter, so the
   party can step up and talk. ---- */
const YR_TPL={
  inn:b=>({w:9,h:7,floor:'wood',tele:[7,3],lights:[[2,2],[6,2],[4,4]],build:({put,raw,npc,mid})=>{
    for(const x of [2,3,5,6])put('counter',x,3);
    put('hearth',4,1);put('shelf',2,1);put('shelf',3,1);put('shelf',5,1);put('shelf',6,1);
    raw('barrel',1,2);raw('barrel',7,2);raw('yar_bucket1',1,1);raw('yar_bucket3',7,1);
    for(const [x,y] of [[2,5],[6,5]]){put('table',x,y);put('chair',x-1,y);put('chair',x+1,y)}
    npc(b.keeper,mid,2);npc(b.id+'_p1',1,4);npc(b.id+'_p2',7,4);
  }}),
  harbour:b=>({w:9,h:7,floor:'wood',tele:[7,3],lights:[[2,2],[6,2],[4,4]],build:({put,raw,npc,mid})=>{
    for(const x of [3,5])put('desk',x,3);
    for(const x of [2,3,5,6])raw('noticeboard',x,1);
    put('mapstand',1,2);put('maptable',7,2);put('wheel',1,4);put('rope',7,4);put('anchor',7,5);raw('barrel',1,5);raw('yar_bucket4',2,5);
    npc(b.keeper,mid,2);
  }}),
  ship:b=>({w:9,h:7,floor:'wood',tele:[7,3],lights:[[2,2],[6,2],[4,4]],build:({put,raw,npc,mid})=>{
    for(const x of [3,5])put('counter',x,3);
    put('wheel',4,1);put('ship',2,2);put('ship',6,2);put('sail',1,1);put('sail',7,1);
    put('anchor',1,4);put('anchor',7,4);put('rope',2,5);put('seachest',6,5);
    npc(b.keeper,mid,2);
  }}),
  trader:b=>({w:9,h:7,floor:'wood',tele:[1,2],lights:[[2,2],[6,2],[4,4]],build:({put,raw,npc,mid})=>{
    for(const x of [3,5])put('counter',x,3);
    for(const x of [1,2,3,5,6,7])put('shelf',x,1);
    put('amphora',1,5);put('amphora',7,5);put('chest',1,4);put('chest',7,4);raw('barrel',7,3);raw('crate',1,3);put('rope',2,5);raw('yar_bucket0',6,5);
    npc(b.keeper,mid,2);
  }}),
  chapel:b=>({w:9,h:7,floor:'wood',tele:[1,2],amb:.62,lights:[[2,2],[6,2],[4,4]],build:({put,raw,npc,mid})=>{
    put('shrine',4,1);put('candle',3,1);put('candle',5,1);put('anchor',1,1);put('anchor',7,1);
    put('sail',1,3);put('sail',7,3);put('hlamp',2,2);put('hlamp',6,2);
    for(const [x,y] of [[2,4],[3,4],[5,4],[6,4],[2,5],[3,5],[5,5],[6,5]])put('chair',x,y);
    npc(b.keeper,mid,2);
  }}),
  maren:b=>({w:9,h:7,floor:'wood',tele:[7,3],lights:[[2,2],[6,2],[4,4]],build:({put,raw,npc,mid})=>{
    put('hearth',4,1);put('potshelf',2,1);put('kitchenshelf',6,1);put('bed',1,2);put('loom',7,2);
    put('table',2,4);put('chair',1,4);put('chair',3,4);put('rope',6,4);put('amphora',7,5);raw('yar_bucket0',1,5);
    npc(b.keeper,mid,2);
  }}),
  loft:b=>({w:9,h:7,floor:'wood',tele:[2,1],lights:[[2,2],[6,2],[4,4]],enemies:[['rat',2,2,5],['rat',4,2,5],['rat',6,2,5],['rat',2,4,5],['rat',6,4,5],['rat',3,3,5],['rat',5,3,5],['rat',4,4,5]],build:({put,raw})=>{
    for(const x of [1,3,5,7])put('sail',x,1);
    raw('crate',1,3);raw('crate',7,3);raw('barrel',2,5);raw('barrel',6,5);put('rope',1,5);put('rope',7,5);raw('yar_bucket2',1,2);raw('yar_bucket5',7,2);
  }}),
  light:b=>({w:7,h:9,floor:'wood',tele:[5,2],amb:.6,lights:[[2,2],[4,2],[3,5]],build:({put,raw,npc,mid})=>{
    put('brazier',3,1);put('hlamp',1,1);put('hlamp',5,1);put('wheel',1,3);put('maptable',5,4);put('seachest',1,6);put('bed',5,6);put('rope',1,5);
    npc(b.keeper,mid,2);
  }}),
  chandler:b=>({w:9,h:7,floor:'wood',tele:[7,2],lights:[[2,2],[6,2],[4,4]],build:({put,raw,npc,mid})=>{
    for(const x of [3,5])put('counter',x,3);
    for(const x of [1,2,6,7])put('shelf',x,1);put('wheel',3,1);put('anchor',5,1);
    put('sail',1,3);put('sail',7,3);put('rope',1,5);put('rope',2,5);put('rope',6,5);put('seachest',7,5);raw('barrel',1,4);raw('barrel',7,4);raw('yar_bucket3',2,2);
    npc(b.keeper,mid,2);
  }})
};

/* ---- the tiles of the walls: plaster, windows, doors and the painted sea-green nets, each at the height of its own cottage ---- */
function yarTileMaker(){
  const cache={};
  const gidOf=texId=>{const g=KH_NEXT_GID++;T_TILE[g]=texId;return g};
  const texCopy=(data,wh)=>{const id=addTex(data);TEX[id].wh=wh;return id};
  const memo=(key,f)=>cache[key]!==undefined?cache[key]:(cache[key]=f());
  const T={};
  const srcWin=hue=>{const id=DS_TEXREG[YR_WINTEX[hue]];return id!==undefined&&TEX[id]?TEX[id].d:null};
  T.plain=(hue,wh)=>memo('p'+hue+'|'+wh,()=>{const im=IMG['kh_ywall1_'+hue];const d=im?dsPaintedTex(im):srcWin(hue);return gidOf(texCopy(d,wh))});
  T.window=(hue,wh)=>memo('w'+hue+'|'+wh,()=>gidOf(texCopy(srcWin(hue),wh)));
  T.special=(name,wh)=>memo('s'+name+'|'+wh,()=>{const id=DS_TEXREG[name];return gidOf(texCopy(TEX[id].d,wh))});
  T.door=(style,wh)=>memo('d'+style+'|'+wh,()=>{const id=T_DOORS[YR_DOORTEX[style%YR_DOORTEX.length]];return gidOf(texCopy(TEX[id].d,wh))});
  T.portalDoor=(name,wh)=>memo('pd'+name+'|'+wh,()=>{const id=T_DOORS[name];const t=texCopy(TEX[id].d,wh);const key='yrd_'+name+'_'+wh;T_DOORS[key]=t;return key});
  return T;
}

function yarBuild(){
  if(LEVELS[YR.ID])return;
  const W=YR.W,H=YR.H,N=W*H,P=yarPlan(90210),G0=YP.GORGE;
  YR.plan=P;
  const rows=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push((x===0||y===0||x===W-1||y===H-1)?'D':'.');rows.push(r)}
  const h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N),fm=new Array(N).fill('4');
  // ---- the land and the sea: a gentle shore, the rock to the west with the little gorge to the tunnel, headlands, and islands ----
  const gorge=(x,y)=>(x>G0.x0&&x<=G0.x1+1&&Math.abs(y-G0.y)<=1)||(x===G0.x0&&y===G0.y);
  for(let y=0;y<H;y++){
    const sx=yarCoast(y);
    for(let x=0;x<W;x++){
      const i=y*W+x,land=x<sx;
      let base=land?Math.min(.5,(sx-x)*.055):-.2+.03*(tsmooth(x/4,y/4,21)-.5);
      if(land)base+=.1*tsmooth(x/9,y/9,22);
      const bn=Math.pow(clamp((17-y)/15,0,1),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,3)),bs=Math.pow(clamp((y-(H-18))/15,0,1),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,5));
      const bw=Math.pow(clamp((G0.x1+1-x)/12,0,1),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,7));
      let hh=base+Math.max(bn,bs,gorge(x,y)?0:bw),isl=false;   // the rock to the west, with the gorge floor cut through it
      for(const [cx,cy,r,pk] of YR_ISLANDS){
        const d=Math.hypot(x-cx,y-cy)/(r*(1+.35*(tsmooth(x/3,y/3,9)-.5)));
        if(d<1.5){const v=pk*Math.pow(Math.max(0,1-d),1.15)-.2+.35*Math.max(0,1-d/1.5)*(tsmooth(x/2,y/2,11)-.3);if(v>hh){hh=v;if(v>-.1)isl=true}}
      }
      h[i]=hh;rk[i]=clamp((hh-.7)/1.6,0,1);
      block[i]=(!land||hh>1.7)?1:0;
      if(hh>1.2)fm[i]='5';
      else if(isl)fm[i]=hh>.05?'0':'3';
      else if(land)fm[i]=x<sx-3?'0':'3';
      else fm[i]=x<sx+3?'3':'4';
      if(!land&&!isl&&hh<=-.1&&x<sx+3)fm[i]='3';
    }
  }
  // meadows: green where the land is gentle, in drifts rather than everywhere
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(fm[i]!=='0'||block[i])continue;if(tsmooth(x/6,y/6,61)>.52&&x>G0.x1+1)fm[i]='5'}
  // ---- the lanes, the harbour square and the quay: little cobbled ways, one square wide ----
  for(let i=0;i<N;i++)if(P.street[i]){block[i]=0;fm[i]='1'}
  for(let x=G0.x0;x<=G0.x1;x++){const i=G0.y*W+x;block[i]=0;fm[i]='0'}                  // the gorge floor is bare earth
  rows[G0.y][G0.x0]='0';                                                                  // the door in the rock: the way back to the tunnel
  for(let y=P.park.y0;y<=P.park.y1;y++)for(let x=P.park.x0;x<=P.park.x1;x++){block[y*W+x]=0;fm[y*W+x]='5'}
  for(let y=26;y<=52;y++)for(let x=G0.x1+1;x<=P.park.x1+3;x++){const i=y*W+x;if(!block[i]&&fm[i]!=='1'&&P.yard[i]!==2&&!P.street[i]&&tsmooth(x/3,y/3,62)>.55)fm[i]='5'}   // a few green patches in the yards
  // the pier: a plank walk into the sea with a T at the end
  const plank=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*W+x;block[i]=0;h[i]=.08;rk[i]=0;fm[i]='2'}};
  plank(57,40,86,41);plank(84,36,86,45);
  for(let x=P.harbour.x1+1;x<=56;x++)for(const y of [40,41]){const i=y*W+x;if(!block[i]&&fm[i]!=='2'){fm[i]='1';block[i]=0}}   // the quay runs down to the planks
  // ---- the cottages ----
  const TM=yarTileMaker(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const roofs=[],signs=[],specialDoors={};
  const SIDE=['yarrose','yarnet','yardrift'];
  const hs=(a,b,c)=>hash2(a,b,c);
  for(const hz of P.houses){
    const sp=hz.sp,S=sp?YR_HOUSES.find(q=>q.sp===sp.id):null,wh=hz.wh,hue=hz.hue;
    const plain=ch(TM.plain(hue,wh)),win=ch(TM.window(hue,wh));
    // an odd cottage has rose vines, nets or driftwood on its sides, so they are not all the same
    const odd=!sp&&hs(hz.x0,hz.y0,63)<.38?SIDE[(hs(hz.x0,hz.y0,64)*SIDE.length)|0]:null,oddC=odd?ch(TM.special(odd,wh)):plain;
    for(let y=hz.y0;y<=hz.y1;y++)for(let x=hz.x0;x<=hz.x1;x++){
      const front=hz.face==='S'?y===hz.y1:y===hz.y0,isDoor=x===hz.door[0]&&y===hz.door[1];
      let c;
      if(isDoor)c=S?String(S.p):ch(TM.door((hs(hz.x0,hz.y0,65)*YR_DOORTEX.length)|0,wh));
      else if(front)c=win;
      else c=(x===hz.x0||x===hz.x1)?oddC:plain;
      rows[y][x]=c;block[y*W+x]=1;fm[y*W+x]='0';
    }
    if(S){hz.p=S.p;specialDoors[S.p]=hz}
    // the roof: a painted gable, straight on, standing on the walls and about as wide as the cottage
    const v=hz.roof%6,flip=hs(hz.x0,hz.y0,66)<.5;
    roofs.push({x:(hz.x0+hz.x1+1)/2,y:(hz.y0+hz.y1+1)/2,k:'yar_roof'+v+(flip?'f':''),w:hz.w+.5+(sp?.2:0),z:wh-.03});
  }
  // the lighthouse: a squat stone tower on the point, with a brazier burning at its door
  const LH=P.light,lhWh=2.5,lhPlain=ch(TM.plain(5,lhWh));
  for(let y=LH.y0;y<=LH.y1;y++)for(let x=LH.x0;x<=LH.x1;x++){rows[y][x]=lhPlain;block[y*W+x]=1;fm[y*W+x]='0'}
  {const hz={x0:LH.x0,x1:LH.x1,y0:LH.y0,y1:LH.y1,door:LH.door,front:LH.front,face:'W',wh:lhWh,w:3,d:3,sp:{id:'light'}};P.lighthouse=hz;specialDoors[8]=hz;rows[LH.door[1]][LH.door[0]]='8';
    for(let y=LH.y0;y<=LH.y1;y++)for(let x=LH.x0;x<=LH.x1;x++){const i=y*W+x;h[i]=Math.max(h[i],.5)}
    for(let y=LH.y0-2;y<=LH.y1+2;y++)for(let x=LH.x0-3;x<=LH.x1+2;x++){const i=y*W+x;if(!block[i]||(x>=LH.x0&&x<=LH.x1&&y>=LH.y0&&y<=LH.y1))continue;block[i]=0}}
  roofs.push({x:(LH.x0+LH.x1+1)/2,y:(LH.y0+LH.y1+1)/2,k:'yar_roof4',w:3.9,z:lhWh-.03});
  // ---- decor, scenery, items ----
  const decor=[],scenery=[],items=[];
  const used=new Set();
  const free=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&rows[y][x]==='.'&&!block[y*W+x]&&!used.has(x+','+y);
  const dc=(k,x,y,o)=>{used.add(x+','+y);return decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const tryDc=(k,x,y,o)=>{if(free(x,y)){dc(k,x,y,o);return true}return false};
  const sc2=(k,x,y,s)=>scenery.push({k,wx:x+.5,wy:y+.5,sc:s||1,decor:{k,walk:true,x,y}});
  const walk=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true},o||{}))};
  const near=(x,y,rad)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(free(x+dx,y+dy))return [x+dx,y+dy]}return null};
  YR.near=near;YR.free=free;
  // moored boats and the boats pulled up for mending
  const boats=[['yar_boat_fish',64,35],['yar_boat_fish',67,46],['yar_boat_fish',73,34],['yar_boat_dhow',71,44],['yar_boat_dhow',78,35],['yar_boat_row',62,37],['yar_boat_row',63,44],['yar_boat_row',75,46],['yar_boat_row',80,43],['yar_boat_row',82,34],['yar_boat_row',91,46],['yar_boat_fish',72,28],['yar_boat_dhow',68,52],['yar_boat_row',70,22],['yar_boat_fish',66,60]];
  YR.boats=boats;
  dc('yar_ship_dawn',87,40,{npc:'yr_ship',deco:false});
  const menk=dc('kh_menk1_0',85,38,{npc:'yr_menkaure',deco:false,block:false,walk:true});
  // washed-up crates for the harbourmaster, along the beach
  const crateAt=y=>{const x=Math.floor(yarCoast(y))-2;return [x,y]};
  YR.crates=[27,35,47,53].map(yy=>crateAt(yy));
  YR.crates.forEach(([x,y],i)=>{if(free(x,y)){used.add(x+','+y);decor.push({k:'yar_crates',x,y,block:true,npc:'yr_crate',cat:i})}});
  // beached boats and nets on the sand beside the harbour square
  for(const [k,x,y] of [['yar_boat_row',54,44],['yar_boat_fish',52,46],['yar_boat_row',55,36],['yar_boat_row',51,35]])tryDc(k,x,y);
  for(const [k,x,y] of [['yar_nets',53,43],['yar_pots',55,43],['yar_crates',50,43],['yar_nets',52,37],['yar_pots',54,37]])tryDc(k,x,y);
  // ---- the village is pretty: flower tubs by every door, lamps along the lanes, washing, olive trees ----
  for(const hz of P.houses){
    const [fx,fy]=hz.front,horiz=hz.face==='S'||hz.face==='N';
    // flower tubs on the foot of the wall, one or two squares from the door, where there is a lane to put them
    const sides=horiz?[[fx-1,fy],[fx+1,fy]]:[[fx,fy-1],[fx,fy+1]];
    for(const [tx,ty] of sides)if(P.street[ty*W+tx]&&hs(tx,ty,67)<.55)sc2(hs(tx,ty,68)<.5?'yar_tub':'yar_lavender',tx,ty,.8+hs(tx,ty,69)*.3);
  }
  // the lamps: iron posts along the main lane and in the harbour square, every fifth square
  const lights=[];
  for(let x=27;x<=47;x+=5)if(tryDc('lamp',x,40))lights.push([x,40]);
  for(const [x,y] of [[50,39],[53,41],[48,37],[32,44],[43,44],[32,36],[43,36]])if(tryDc('lamp',x,y))lights.push([x,y]);
  // washing lines, rose arches over a lane end, olive trees, benches
  for(const [x,y] of [[30,34],[39,34],[37,46],[30,47],[41,46],[47,45]])tryDc('yar_washing',x,y);
  for(const [x,y] of [[32,34],[43,34],[32,46],[43,46]])tryDc('yar_arch2',x,y);
  for(const [x,y] of [[27,33],[29,32],[33,32],[38,33],[26,46],[34,47],[44,47],[48,48],[24,35],[24,44],[46,31],[40,31],[22,38],[22,42]])tryDc('yar_olive',x,y);
  for(const [x,y] of [[49,38],[49,42],[53,39]])tryDc('yar_bench',x,y);
  // ---- the little park: a well, benches, trees, flowers ----
  {const pk=P.park;
    dc('well',Math.round((pk.x0+pk.x1)/2),Math.round((pk.y0+pk.y1)/2));
    for(const [dx,dy] of [[-2,0],[2,1]])tryDc('yar_bench',Math.round((pk.x0+pk.x1)/2)+dx,Math.round((pk.y0+pk.y1)/2)+dy);
    for(const [x,y] of [[pk.x0+1,pk.y0+1],[pk.x1-1,pk.y0+1],[pk.x0+1,pk.y1-1],[pk.x1-1,pk.y1-1],[pk.x0+3,pk.y0],[pk.x1-3,pk.y1]])tryDc('yar_olive',x,y);
    for(let n=0;n<22;n++){const x=pk.x0+((hs(n,1,70)*(pk.x1-pk.x0+1))|0),y=pk.y0+((hs(n,2,70)*(pk.y1-pk.y0+1))|0);if(free(x,y)&&hs(n,3,70)<.9)sc2(hs(n,4,70)<.6?'yar_lavender':'yar_tub',x,y,.75+hs(n,5,70)*.4)}
    tryDc('yar_arch2',pk.gate[0],pk.gate[1]);
  }
  // the windblown trees: a row of them on the rise behind the village and along the headlands, all bent the same way by the sea wind
  YR.windTrees=[];
  for(let n=0;n<46;n++){
    const x=G0.x1+2+((hs(n,1,71)*40)|0),y=14+((hs(n,2,71)*50)|0);
    if(!free(x,y)||P.street[y*W+x]||P.yard[y*W+x]===2)continue;
    const nearHouse=P.houses.some(q=>x>=q.x0-1&&x<=q.x1+1&&y>=q.y0-1&&y<=q.y1+1);if(nearHouse)continue;
    if(x>P.park.x0-1&&x<P.park.x1+2&&y>P.park.y0-2&&y<P.park.y1+2)continue;
    if(y>=30&&y<=48&&x>=G0.x1+1&&x<=50&&hs(n,3,71)<.8)continue;   // the village itself stays clear
    const k='yar_wtree'+((hs(n,4,71)*6)|0);used.add(x+','+y);decor.push({k,x,y,block:true,deco:true,sc:.8+hs(n,5,71)*.5,wind:1});YR.windTrees.push([x,y]);
  }
  // fishermen's buckets, crates and coiled rope at the foot of the walls, where there is room
  YR.buckets=[];
  for(const hz of P.houses){
    if(hs(hz.x0,hz.y0,72)>.5)continue;
    const [fx,fy]=hz.front,horiz=hz.face==='S'||hz.face==='N';
    const cands=horiz?[[hz.x0-1,fy],[hz.x1+1,fy],[hz.x0-1,hz.face==='S'?hz.y1:hz.y0]]:[[fx,hz.y0-1],[fx,hz.y1+1]];
    for(const [bx,by] of cands){
      if(!free(bx,by)||(bx===fx&&by===fy))continue;
      if(!P.street[by*W+bx]&&!P.yard[by*W+bx]&&rows[by][bx]!=='.')continue;
      const k='yar_bucket'+((hs(bx,by,73)*6)|0);used.add(bx+','+by);scenery.push({k,wx:bx+.5,wy:by+.5,sc:.9+hs(bx,by,74)*.25,decor:{k,walk:true,x:bx,y:by}});YR.buckets.push([bx,by]);break;
    }
  }
  // gear along the harbour: buckets by the nets, a barrel or two
  for(const [x,y] of [[50,38],[51,42],[54,38],[49,41],[52,42]])if(free(x,y)){const k='yar_bucket'+((hs(x,y,75)*6)|0);used.add(x+','+y);scenery.push({k,wx:x+.5,wy:y+.5,sc:1,decor:{k,walk:true,x,y}})}
  // flowers and lavender at the foot of the walls, in the yards
  for(let n=0;n<150;n++){const x=G0.x1+2+((hs(n,11,41)*30)|0),y=30+((hs(n,12,41)*22)|0);if(!free(x,y)||P.street[y*W+x])continue;
    const nb=rows[y-1][x]!=='.'||rows[y+1][x]!=='.'||rows[y][x-1]!=='.'||rows[y][x+1]!=='.';if(!nb)continue;
    sc2(hs(n,13,41)<.5?'yar_lavender':'yar_tub',x,y,.8+hs(n,14,41)*.4)}
  // the beach: gulls, shells, driftwood and crabs
  const scB=(k,x,y,s)=>scenery.push({k,wx:x,wy:y,sc:s||1,decor:{k,walk:true,x:x|0,y:y|0}});
  for(let n=0;n<420;n++){
    const y=2+((hs(n,1,31)*(H-4))|0),sx=yarCoast(y),x=sx-1-hs(n,2,32)*10;
    if(x<G0.x1+2||y<18||y>62)continue;const cx=x|0,cy=y|0;if(!free(cx,cy)||fm[cy*W+cx]==='1')continue;
    const r=hs(n,3,33),k=r<.34?'yar_gull_stand':r<.5?'yar_shells':r<.66?'yar_driftwood':r<.74?'yar_crab':null;if(!k)continue;
    scB(k,x,y+hs(n,4,34)*.4-.2,.8+hs(n,5,35)*.5);
  }
  for(let n=0;n<40;n++){const x=58+hs(n,6,36)*28,y=40.2+hs(n,7,37)*1.6;scB('yar_gull_stand',x,y,.9+hs(n,8,38)*.3)}
  for(const [cx,cy,r] of YR_ISLANDS)for(let n=0;n<4;n++){const a=hs(cx,n,41)*TAU,x=cx+Math.cos(a)*r*.55,y=cy+Math.sin(a)*r*.55,i=(y|0)*W+(x|0);if(h[i]>.05&&h[i]<1)scB('yar_gull_stand',x,y,.9)}
  for(const [x,y] of [[36,38],[30,42]])items.push({k:'potion',x:Math.min(x,48),y});
  // ---- the signs of the buildings whose doors open, and their names on the map ----
  const nameOf=p=>{const q=YR_HOUSES.find(z=>z.p===p);return q?q.name:''};
  const KEEP_NAME={yr_inn:'Bessa, innkeeper',yr_harbour:'Tamsin Kell',yr_dealer:'Selk, ship dealer',yr_trader:'Wen, trader',yr_priest:'Brother Haldane',yr_maren:'Old Maren',yr_orsa:'Orsa, keeper',yr_chandler:'Pell, chandler'};
  for(const q of YR_HOUSES){
    const hz=specialDoors[q.p];if(!hz){q.f=[P.harbour.x0,P.harbour.y0,2];continue}
    const [fx,fy]=hz.front,out=hz.face==='S'?2:hz.face==='N'?0:hz.face==='W'?3:1;
    q.f=[fx,fy,out];
    const wall=hz.face==='S'?[0,-1]:hz.face==='N'?[0,1]:hz.face==='W'?[1,0]:[-1,0];
    const horizontal=hz.face==='S'||hz.face==='N';
    const sx=horizontal?fx-1:fx,sy=horizontal?fy:fy-1;
    const spot=(P.street[sy*W+sx]||(rows[sy]&&rows[sy][sx]==='.'))?[sx,sy]:[fx,fy];
    decor.push({k:'sign_'+(q.keeper||'yr'),x:spot[0],y:spot[1],block:false,wd:wall,txt:[q.name.toUpperCase(),KEEP_NAME[q.keeper]||'']});
  }
  // ---- the people of the village, who walk through and can be spoken to ----
  YR.people=[];
  const person=(id,x,y)=>{const kp=KH_KEEPERS[id];if(!kp)return null;const q=near(x,y,4);if(!q)return null;walk(khFaceKey(kp.face),q[0],q[1],{npc:id,sc:kp.sc||1});YR.people.push([id,q[0],q[1]]);return q};
  person('yr_fisher1',50,40);person('yr_fisher2',55,38);person('yr_child',33,38);person('yr_old',43,38);person('yr_woman',30,41);person('yr_net',52,44);person('yr_tam',47,33);
  { // Corran's fish stall on the harbour square: a seller with a basket of herring
    const q=near(51,38,3);if(q){dc('yar_crates',q[0],q[1]-1>0&&free(q[0],q[1]-1)?q[1]-1:q[1],{deco:true,block:false,walk:true});walk(khFaceKey(KH_KEEPERS.yr_fish.face),q[0],q[1],{npc:'yr_fish',sc:1})}
  }
  // the donkey and its cart wait on the harbour square, for the road to Khemetra and beyond
  { const q=near(53,42,3);if(q){walk(khFaceKey('kh_cart1_0'),q[0],q[1],{npc:'yr_donkey',sc:1});YR.donkeyAt=q} }
  // quest folk and objects (yarrim_quests.js)
  if(typeof yarPlaceQuestFolk==='function')yarPlaceQuestFolk({near,free,walk,dc,sc2,decor,scenery,P,rows,used});
  // ---- the level ----
  const mapNames=[ // the names the area map writes over the village
    {t:'Quay Lane',x:36,y:39.4,k:'lane'},{t:'Net Lane',x:36,y:36.4,k:'lane'},{t:'Gull Lane',x:36,y:42.4,k:'lane'},
    {t:'The Harbour',x:51.5,y:40,k:'place'},{t:'The Pier',x:70,y:40,k:'place'},{t:'The Little Green',x:(P.park.x0+P.park.x1+1)/2,y:(P.park.y0+P.park.y1+1)/2+2.4,k:'place'},
    {t:'The Gorge',x:21,y:38.6,k:'lane'},{t:'Yarrim Point',x:61,y:27,k:'place'},{t:'The Beach',x:58,y:50,k:'place'}
  ];
  const lv={rows:rows.map(r=>r.join('')),start:{x:G0.x0+1,y:G0.y,f:1},enemies:[],items,decor,scenery,sky:roofs,
    fmap:null,floorSet:['sand','cobble','wood','bluesand','bluewater','lush'],floor:'sand',ceil:'cloud',
    day:.98,outdoor:true,amb:.9,name:'Yarrim',label:'Yarrim',noExtras:true,diff:16,tele:{x:44,y:40},
    chars,lights,portals:[],mapNames};
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}
  lv.fmap=fmap;
  lv.portals[0]={to:YR.TUN,x:62,y:12,f:3,tex:'cave'};
  // each building's door: its own door picture, as tall as its own walls
  for(const q of YR_HOUSES){
    const hz=specialDoors[q.p],wh=hz?hz.wh:1.5;
    const name=TM.portalDoor(q.door,wh);
    lv.portals[q.p]={to:YR.FIRST+q.p-1,x:q.start[0],y:q.start[1],f:0,tex:name};
  }
  LEVELS[YR.ID]=lv;LEVEL_NAMES[YR.ID]='Yarrim';
  TERRS[YR.ID]=yarTerrain(W,H,h,rk,block);
  // the roofs, and the same roofs turned the other way
  for(let k=0;k<6;k++){const im=IMG['kh_yroof3_'+k];if(!im)continue;IMG['yar_roof'+k]=im;IMG['yar_roof'+k+'f']=mkCanvas(im.width,im.height,(x,w,hh)=>{x.translate(w,0);x.scale(-1,1);x.drawImage(im,0,0)})}
  for(let k=0;k<6;k++){const im=IMG['kh_ytree1_'+k];if(im){IMG['yar_wtree'+k]=im;IMG['yar_wtree'+k+'f']=mkCanvas(im.width,im.height,(x,w,hh)=>{x.translate(w,0);x.scale(-1,1);x.drawImage(im,0,0)});NPC_H['yar_wtree'+k]=1.5+.2*(k%3);NPC_H['yar_wtree'+k+'f']=NPC_H['yar_wtree'+k]}}
  for(let k=0;k<6;k++){const im=IMG['kh_ybucket1_'+k];if(im){IMG['yar_bucket'+k]=im;NPC_H['yar_bucket'+k]=.34+.04*(k%3)}}
  // the rooms: each is built when first entered (so the Khemetra pictures are loaded by then); the doors know where in the room you arrive
  for(const q of YR_HOUSES){
    const id=YR.FIRST+q.p-1;
    KH_LAZY[id]=()=>{
      if(LEVELS[id])return;
      const hz=specialDoors[q.p],hue=q.stone?5:hz&&hz.hue!==undefined?hz.hue:1;   // inside, the plaster is the colour of the cottage outside
      const b={id:'yr'+q.p,name:q.name,room:q.room,keeper:q.keeper,scene:q.scene,tpl:q.tpl?YR_TPL[q.tpl]:undefined,wallImg:'kh_ywall1_'+hue};
      const R=khRoom(b,id,{to:YR.ID,x:q.f[0],y:q.f[1],f:q.f[2]}),L=R.level;
      LEVELS[id]=L;LEVEL_NAMES[id]=q.name;
    };
  }
}
LEVEL_NAMES[YR.ID]='Yarrim';LEVEL_NAMES[YR.TUN]='The Sea Gate Tunnel';YR_HOUSES.forEach(q=>{LEVEL_NAMES[YR.FIRST+q.p-1]=q.name}); // so the area list can name them before they are built
KH_LAZY[YR.ID]=yarBuild;
for(let i=0;i<YR_ROOMS;i++){const id=YR.FIRST+i,stub=()=>{yarBuild();if(!LEVELS[id]&&KH_LAZY[id]!==stub)KH_LAZY[id]()};KH_LAZY[id]=stub} // a room asked for before the town exists builds the town first
