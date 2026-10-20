/* ==========================================================================
   ULB, THE REED-WEAVERS' CITY (level 482, interiors 4880 to 4899). Prefix hgtxulb. One of the four strange cities of the Hollow Grasslands (tools/HGT_BRIEF.md).
   A terraced hillside of reed-woven shell houses that steps down from the north gate, along a grand cascade of steps, to a sunken reed basin in the south.
   Signature: THE LOOM SPIRE, a double-helix stair (one pink arm and one aqua arm) winding up a stepped cone to a lookout under a column of looms and
   hanging threads of light; its counterpart below ground is the Warp Pit, the same double helix wound downward.
   Plan of the file: tiles and styles, the builder (terrain, cascade, court, spire, pit, gate, districts, houses, towers, plants), finishing walls
   (every wall cell is kept as a design: tint, kind, top height; the picture is chosen last, when its foot is known), the interiors, the folk.
   ========================================================================== */
var HGTCITIES=(typeof HGTCITIES==='undefined')?{}:HGTCITIES;
const HGTXULB={ID:482,INT0:4880,INTN:4899,W:150,H:150,GX:75,Q:.36,PAD:3.6,SP:{x:75,y:60,R0:13,P:6,rc:4.5,rise:.18},PIT:{x:75,y:86,R0:6.6,P:4,rc:2.4,rise:-.16},DEV:{}};
HGTXULB.INT={5081:[23,13],5082:[13,9],4880:[9,7],4881:[13,9],4882:[9,7],4883:[9,7],4884:[9,7],4885:[9,9],4886:[11,9],4887:[7,6],4888:[9,7],4889:[7,6],4890:[13,9],4891:[9,7],4892:[9,7],4893:[11,8],4894:[9,7],4895:[15,11],4896:[9,7],4897:[9,7],4898:[9,7],4899:[7,6]}; // interior id -> [width, height]; the party arrives in front of the door in the middle of the bottom wall
HGTXULB.RT=[[4963,36,84],[4964,114,84],[4972,48,118],[4973,104,118]]; // shared rooms of hgt_rooms.js given to Ulb: [id, x, y]
HGTXULB.TARGETS=[[4880,44,36],[4881,60,33,20],[4883,96,44],[4884,58,52],[4889,20,92],[4890,92,46],[4891,58,38],[4892,130,30],]; // [interior id, x, y, minimum cells]: the nearest street door becomes the door of that room
HGTCITIES.ulb={level:HGTXULB.ID,key:'ulb',name:'Ulb',entry:{x:75,y:3,f:2},entrySouth:{x:75,y:147,f:0},exitDoor:{x:75,y:1,face:0,to:470,at:{x:26,y:89,f:0}},exitDoorSouth:{x:75,y:148,face:2,to:470,at:{x:26,y:111,f:2}}};
LEVEL_NAMES[HGTXULB.ID]='Ulb';

HGTE.look[482]={ambient:.86,lamp:[1,.7,.46],wallGain:1.12,wallSat:1.95,wallAO:.35,riserGain:1.05,hazeCol:[170,112,200],haze:.14,hazeRate:.01,vignette:.3,tint:[1,.98,1.02],motes:80,moteCol:[255,200,230],grade:[250,232,250,.12],roofGain:.75,floorContrast:1.3,floorGain:.92};
(function(){
const U=HGTXULB,W=U.W,H=U.H,Q=U.Q,PAD=U.PAD,cx0=U.SP.x,cy0=U.SP.y;
const qz=(v,q)=>Math.round(v/q)*q;
const rnd=(a,b,k)=>hash2(a,b,4820+(k|0));
HGTXULB.CENTRE_ALL=['hgtb_furn_loom','hgtb_furn_table_chairs','hgtb_furn_hearth','hgtb_furn_clock','hgtb_deco_fountain','hgtb_furn_books_globe','hgtb_deco_shellstatue','hgtb_furn_bed','hgtb_furn_stage','hgtb_deco_pearlplinth','hgtb_furn_bunk','hgtb_furn_bookshelf','hgtb_plant_glowshrooms','hgtb_furn_cabinet'];
HGTXULB.CENTRE={4880:'hgtb_furn_hearth',4881:'hgtb_furn_loom',4882:'hgtb_furn_loom',4883:'hgtb_furn_bed',4884:'hgtb_furn_books_globe',4885:'hgtb_deco_pearlplinth',4886:'hgtb_deco_fountain',4887:'hgtb_deco_pearlplinth',4888:'hgtb_deco_fountain',4889:'hgtb_furn_bunk',4890:'hgtb_furn_table_chairs',4891:'hgtb_stall_sage_herbs',4892:'hgtb_furn_clock',4893:'hgtb_furn_bookshelf',4894:'hgtb_deco_fountain',4895:'hgtb_furn_stage',4896:'hgtb_furn_chandelier',4897:'hgtb_furn_loom',4898:'hgtb_furn_bed',4899:'hgtb_deco_shellstatue'};
{const m=[0,3,8,2,5,4,12,6,9,7,13,1,10,5,11,0,12,3];for(let k=0;k<45;k++)HGTXULB.CENTRE[5083+k]=HGTXULB.CENTRE_ALL[m[k%m.length]%HGTXULB.CENTRE_ALL.length]}
HGTXULB.floorFor=(t,id,def)=>{const F={p:['hgtb_f_rosette','hgtb_f_pearlbands','hgtb_f_floral'],a:['hgtb_f_waves','hgtb_f_hex','hgtb_f_scales'],c:['hgtb_f_planks','hgtb_f_marble','hgtb_f_terrazzo'],l:['hgtb_f_diamonds','hgtb_f_terrazzo','hgtb_f_stained']}[t],n=F[id%3];return typeof FLOORS!=='undefined'&&FLOORS[n]?n:def};
const TINTS='pacl',KINDS=[]; // KINDS holds the picture specs: three letters (bottom unit, middle units, top unit) of p plain, w window, b band
const kindOf=spec=>{let i=KINDS.indexOf(spec);if(i<0){KINDS.push(spec);i=KINDS.length-1}return i+1};

/* ---------- wall styles: four pastel tints, each with a plain picture, a window picture and a band picture ---------- */
const TT={p:['hgt_wp','hgt_ww0','hgt_wb0','hgt_d0'],a:['hgt_wa','hgt_ww1','hgt_wb1','hgt_d1'],c:['hgt_wc','hgt_ww3','hgt_wb2','hgt_d3'],l:['hgt_wl','hgt_ww2','hgt_wb3','hgt_d2']};
const wq=wh=>Math.max(.25,Math.ceil(wh*4-1e-6)/4); // wall heights come in quarters of a cell
/* district wall characters: the painted detail patterns (letter d in a spec) differ from district to district, so every ring and quarter has its own look */
const STY=['hgt_w3_relief_pink','hgt_w2_rings','hgt_w3_fresco_cream','hgt_w3_reed_lilac','hgt_w3_arcade_cream','hgt_w3_scroll_aqua','hgt_w2_portholes','hgt_w3_relief_aqua','hgt_w3_fresco_amber','hgt_w3_scroll_pink','hgt_w3_shutters_lilac','hgt_w3_arcade_lilac'];
function wallCh(t,spec,wh,sty){const [pl,wi,ba]=TT[t];wh=wq(wh);sty=sty|0;const pat=STY[sty%STY.length],pd=hgtaPic(pat)?pat:pl;const pic=c=>c==='w'?wi:c==='b'?ba:c==='d'?pd:c==='D'?(hgtaPic('hgt_w3_dado_pink')?'hgt_w3_dado_pink':pl):c==='C'?(hgtaPic('hgt_w3_cornice_cream')?'hgt_w3_cornice_cream':ba):pl;
  return hgtaChar(hgtaWallTile(pl,wh,{base:pic(spec[0]),mid:pic(spec[1]),top:pic(spec[2])}))}
const DOORP=['hgt_d0','hgt_d1','hgt_d2','hgt_d3','hgt_w2_doorteal','hgt_w2_doorblue','hgt_d2','hgt_d0'];
function doorCh(t,wh,lvl,at,v){const [pl,,,dr]=TT[t];const dp=v!==undefined?DOORP[(v|0)%DOORP.length]:dr;return hgtaChar(hgtaDoorTile(hgtaPic(dp)?dp:dr,pl,wq(wh),lvl===undefined||lvl===null?null:{lvl,at}))}
/* a stack of risers for the cliff faces: band over window, repeating every two cells of height */
function riserGid(t,kind){const [pl,wi,ba]=TT[t];return hgtaWallTile(pl,kind==='win'?2:1,kind==='win'?{base:wi,top:ba}:{})}

/* ---------- the builder ---------- */
function build(id){
  const B=hgtlNew(W,H,482),I=(x,y)=>y*W+x,ok=(x,y)=>x>=0&&y>=0&&x<W&&y<H,h=B.h,rows=B.rows;
  const ws=new Uint8Array(W*H),wt=new Uint8Array(W*H),wk=new Uint8Array(W*H),wtop=new Float32Array(W*H),wdoor=new Map(),rg=new Int32Array(W*H),fm=new Array(W*H).fill('0'),occ=new Uint8Array(W*H);
  const getH=(x,y)=>ok(x,y)?h[I(x,y)]:0,isOpen=(x,y)=>ok(x,y)&&rows[y][x]==='.';
  const open=(x,y,hh,k)=>{if(!ok(x,y))return;rows[y][x]='.';if(hh!==undefined)h[I(x,y)]=hh;B.kind[I(x,y)]=k|0;wk[I(x,y)]=0};
  /* a wall cell: design only (tint t, kind, top = absolute top height); its picture is chosen at the end */
  let curSty=0;const wall=(x,y,t,kind,top,foot)=>{if(!ok(x,y))return;const i=I(x,y);ws[i]=curSty;rows[y][x]='#';if(foot!==undefined)h[i]=foot;wt[i]=TINTS.indexOf(t);wk[i]=kindOf(kind);wtop[i]=top;B.kind[i]=0};
  const wallH=(x,y,t,kind,wh,foot)=>wall(x,y,t,kind,(foot!==undefined?foot:getH(x,y))+wh,foot);
  const door=(x,y,face,t,wh,to,tx,ty,tf)=>{const i=I(x,y),d=HGTL.DIRS[face&3];wall(x,y,t,'pdb',getH(x,y)+wh);wdoor.set(i,{face:face&3,lvl:to,at:to?{x:tx,y:ty,f:tf}:null,wh});B.doors.push({x,y,face:face&3,ax:x+d[0],ay:y+d[1],to:to||null})};
  const dec=(k,x,y,o)=>{B.decor.push(Object.assign({k,x,y,block:false},o||{}))};
  const LAMPK=['hgtb_lamp_tall','hgtb_lamp_vine','hgtb_lamp_short','hgtb_lamp_bare','hgtb_lamp_tall','hgtb_lamp_vine','hgtb_lamp_short','hgt_gardenlantern'];const lamp=(x,y,o)=>{if(!isOpen(x,y))return;if(((x*5+y*3)%7)===0&&!o){B.lights.push([x,y]);return}dec(LAMPK[(rnd(x,y,150)*LAMPK.length)|0],x,y,Object.assign({walk:true,deco:true},o||{}));B.lights.push([x,y])};
  const light=(x,y)=>B.lights.push([x,y]);
  const GX=U.GX,SP=U.SP;
  const cx=SP.x,cy=SP.y,CR=26;
  const info=U.DEV.info={doors:[],towers:[],features:[]};U.DEV.occ=occ;U.DEV.wdoor=wdoor;U.DEV.wk=wk;
  const toInt=id=>({to:id,tx:U.INT[id][0]>>1,ty:U.INT[id][1]-2,tf:0});
  /* --- the natural hillside --- */
  const bowlAt=r=>PAD+Q*Math.floor(Math.max(0,r-14)/2); // the Loom Court is a bowl of broad treads rising outward from the foot of the spire
  const avenueY=y=>y<=10?9.6:y<=34?9.6-(y-10)*(9.6-bowlAt(26))/24:y<=60?bowlAt(60-y):y<=78?PAD:y<=108?PAD-(y-78)*(PAD+1.4)/30:y<=116?-1.4-(y-108)*1.1/8:-2.5;
  const natural=(x,y)=>{
    let g=9.6-.09*Math.max(0,y-12);
    g+=.055*Math.max(0,Math.abs(x-GX)-34);
    const rr=Math.hypot((x-GX)*.5,y-134),bowl=-2.5+.14*Math.max(0,rr-12); // the reed basin: a wide bowl in the south, ringed by terraces
    return Math.max(-2.5,Math.min(g,bowl))};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)h[I(x,y)]=qz(natural(x,y),Q);
  const terr=new Float32Array(h); // the plain hillside, kept for later reference
  /* --- the great cascade: a stair 17 wide down the middle of the city, in treads two rows deep --- */
  for(let y=2;y<H-2;y++){const a=avenueY(y<=10?y:y<=116?Math.floor(y/2)*2:y);for(let x=GX-8;x<=GX+8;x++){open(x,y,a,1);fm[I(x,y)]='1';occ[I(x,y)]=1}}
  /* --- the Loom Court: a round bowl, floor at the foot of the spire, treads rising outward until they meet the hillside --- */
  for(let y=cy-CR-1;y<=cy+CR+1;y++)for(let x=cx-CR-1;x<=cx+CR+1;x++){const r=Math.hypot(x-cx,y-cy);if(r>CR+.5)continue;
    const i=I(x,y),cur=h[i],hb=bowlAt(r);open(x,y,Math.min(cur,hb),r<14.2?5:5);fm[i]=r<14.5?'5':((Math.floor(Math.max(0,r-14)/2))&1?'1':'5');occ[i]=1}
  /* --- THE LOOM SPIRE: a double helix wound up a stepped cone, one pink arm and one aqua arm, with a column of looms rising from the platform at its top --- */
  const helix=o=>hgtxulbHelix(B,Object.assign({open,wall,wallH,door,dec,light,rg,fm,occ,I,ok,isOpen,getH,toInt,h:PAD},o));
  curSty=9;
  const spire=helix({cx:SP.x,cy:SP.y,R0:SP.R0,P:SP.P,rc:SP.rc,rise:SP.rise,lw:1.0,arms:2,tints:['p','a'],core:true,coreH:[5,10],coreDoor:{id:4885},threads:true});
  U.DEV.spire=spire;
  /* ================= the kit: set pieces that stand in the hillside before the houses fill the rest ================= */
  const clampv=(v,a,b)=>v<a?a:v>b?b:v,T_=(x,y)=>ok(x,y)?terr[I(x,y)]:0;
  const mark=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(ok(x,y))occ[I(x,y)]=1};
  /* a rectangle at height h0 (open), with a margin of m cells whose treads blend back into the hillside; the whole is kept clear of houses */
  const flatten=(x0,y0,x1,y1,h0,m,kind,floor)=>{for(let y=y0-m;y<=y1+m;y++)for(let x=x0-m;x<=x1+m;x++){if(!ok(x,y)||x<3||y<3||x>W-4||y>H-4)continue;const d=Math.max(x0-x,0,x-x1,y0-y,0,y-y1),i=I(x,y);
    if(d===0){open(x,y,h0,kind||0);if(floor)fm[i]=floor}else if(rows[y][x]==='.'&&!occ[i]){h[i]=h0+clampv(T_(x,y)-h0,-Q*d,Q*d)}occ[i]=1}};
  const bench=(x,y,o)=>{if(!isOpen(x,y))return;const k=khProp('bench');if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH('bench');dec(k,x,y,Object.assign({block:true,deco:true},o||{}))};
  const PLANTS=['hgtb_plant_belltree','hgtb_plant_spiralfern','hgtb_plant_orbbush','hgtb_plant_lacecoral','hgtb_plant_tealgrass','hgtb_plant_lupin','hgtb_plant_potvine','hgtb_plant_glowshrooms','hgt_bulbflower','hgt_shellflower','hgt_reeds','hgt_pearlbush','hgtb_plant_barrel'];
  const plant=(x,y,kind,o)=>{if(!isOpen(x,y))return;const k=kind||PLANTS[(rnd(x,y,70)*PLANTS.length)|0];dec(k,x,y,Object.assign({walk:true,deco:true,sc:.85+rnd(x,y,71)*.6,ox:(rnd(x,y,72)-.5)*.5,oy:(rnd(x,y,73)-.5)*.5},o||{}));if(rnd(x,y,74)<.4)light(x,y)};
  const bed=(x0,y0,w,d,den,kinds)=>{for(let y=y0;y<y0+d;y++)for(let x=x0;x<x0+w;x++){if(!isOpen(x,y)||B.kind[I(x,y)]===1)continue;if(rnd(x,y,75)<den)plant(x,y,kinds?kinds[(rnd(x,y,76)*kinds.length)|0]:undefined)}};
  /* a wide plaza: flat, paved in pale marble, lamps at the corners, a fountain, benches and glitter beds */
  const plaza=(x0,y0,w,d,o)=>{o=o||{};const h0=qz(T_(x0+(w>>1),y0+(d>>1)),Q);flatten(x0,y0,x0+w-1,y0+d-1,h0,3,5,'3');
    for(const [px,py] of [[x0,y0],[x0+w-1,y0],[x0,y0+d-1],[x0+w-1,y0+d-1]])lamp(px,py);
    if(o.fountain!==false)dec('hgt_fountain',x0+(w>>1),y0+(d>>1),{block:true});
    for(let i=2;i<w-2;i+=4){bench(x0+i,y0+1);bench(x0+i,y0+d-2)}
    bed(x0+1,y0+2,2,d-4,.5);bed(x0+w-3,y0+2,2,d-4,.5);
    info.features.push({k:'plaza',x:x0,y:y0,w,d,name:o.name});return h0};
  /* a pit sunk into the hillside, entered by a broad flight of treads at v=0; origin (x,y) is the entry-side corner, dir the way into the pit */
  const sunken=(x,y,dir,w,d,depth,o)=>{o=o||{};const c=hgtlXf(x,y,dir);let minT=99;
    for(let v=0;v<d;v++)for(let u=0;u<w;u++){const [px,py]=c(u,v);minT=Math.min(minT,T_(px,py))}
    const floor=qz(minT-depth,Q),sw=Math.min(w,o.stairW||3),su=(w-sw)>>1;
    const [ex,ey]=c(su+(sw>>1),-1),te=T_(ex,ey),n=Math.max(1,Math.ceil((te-floor)/.3));
    for(let v=0;v<d;v++)for(let u=0;u<w;u++){const [px,py]=c(u,v);open(px,py,floor,4);fm[I(px,py)]='2';occ[I(px,py)]=1}
    for(let v=0;v<n&&v<d;v++)for(let l=0;l<sw;l++){const [px,py]=c(su+l,v);open(px,py,te-(te-floor)*(v+1)/(n+1),1);fm[I(px,py)]='1'}
    for(let v=-1;v<=d;v++)for(let u=-1;u<=w;u++){if(u>=0&&u<w&&v>=0&&v<d)continue;const [px,py]=c(u,v);if(ok(px,py))occ[I(px,py)]=1}
    let doorCell=null;
    if(o.house&&d>=n+6){const hd=3;for(let v=d-hd;v<d;v++)for(let u=1;u<w-1;u++){const [px,py]=c(u,v);wall(px,py,o.tint||'c',(v===d-hd&&u!==(w>>1)&&rnd(px,py,13)<.5)?'wdb':'pdb',floor+3.5+(d-1-v)*.5)}
      const [dx,dy]=c(w>>1,d-hd);doorCell={x:dx,y:dy,face:(dir+2)&3};}
    for(let v=n+1;v<d-(o.house?3:0);v++){for(const u of [0,w-1]){const [px,py]=c(u,v);if(isOpen(px,py)&&rnd(px,py,77)<.6)plant(px,py)}}
    if(o.fountain){const [fx,fy]=c(w>>1,Math.max(n+1,(d>>1)));if(isOpen(fx,fy))dec('hgt_fountain',fx,fy,{block:true})}
    for(const [u,v] of [[0,n+1],[w-1,n+1]]){const [px,py]=c(u,v);lamp(px,py)}
    if(doorCell){door(doorCell.x,doorCell.y,doorCell.face,o.tint||'c',3.5,null)}
    info.features.push({k:'sunken',x,y,w,d,floor,name:o.name});
    return {floor,n,door:doorCell,c}};
  /* a house on a pedestal: a 9 by 9 platform at ledge height with a tall five by five house on it and a flight of treads at the front. (x,y) is the centre, dir the front. */
  const pedestal=(x,y,dir,o)=>{o=o||{};const c=hgtlXf(x,y,dir),t=o.tint||'a';let g=0,cnt=0;
    for(let v=-4;v<=9;v++)for(let u=-4;u<=4;u++){const [px,py]=c(u,v);if(ok(px,py)){g+=T_(px,py);cnt++}}g=qz(g/cnt,Q);
    const ledge=o.ledge||1.44,hb=g+ledge,n=Math.ceil(ledge/.3);
    // blend the hillside round the pedestal first
    for(let v=-5;v<=5+n;v++)for(let u=-5;u<=5;u++){const [px,py]=c(u,v);if(!ok(px,py))continue;const cd=Math.max(Math.abs(u),Math.abs(v));if(cd>=5||v>=5){if(rows[py][px]==='.')h[I(px,py)]=g+clampv(T_(px,py)-g,-.36,.36)}occ[I(px,py)]=1}
    for(let v=-4;v<=4;v++)for(let u=-4;u<=4;u++){const [px,py]=c(u,v),cd=Math.max(Math.abs(u),Math.abs(v));
      if(cd<=2){const edge=cd===2;wall(px,py,t,edge?(rnd(px,py,14)<.5?'wdb':'pdb'):'ppp',hb+(cd<=0?7.5:cd<=1?5.5:3.8),hb)}
      else{open(px,py,hb,2);fm[I(px,py)]='5'}occ[I(px,py)]=1}
    for(let k=0;k<n;k++)for(let u=-1;u<=1;u++){const [px,py]=c(u,5+k);open(px,py,hb-(k+1)*ledge/n,1);fm[I(px,py)]='1';occ[I(px,py)]=1}
    const [dx,dy]=c(0,2);door(dx,dy,dir,t,3.8,null);
    for(const [u,v] of [[-4,4],[4,4],[-3,-4],[3,-4]]){const [px,py]=c(u,v);lamp(px,py)}
    for(const [u,v] of [[-4,0],[4,0],[0,-4]]){const [px,py]=c(u,v);plant(px,py)}
    info.features.push({k:'pedestal',x,y,dir,hb,name:o.name});
    return {dx,dy,hb}};
  /* a tapering tower: rings of walls rising towards the middle. lean shifts the upper rings. top is the height of the tallest ring above the ground. */
  const taper=(tx,ty,r,top,t,o)=>{o=o||{};const steps=o.steps||4,lean=o.lean||[0,0];let g=-9;
    for(let y=Math.floor(ty-r);y<=Math.ceil(ty+r);y++)for(let x=Math.floor(tx-r);x<=Math.ceil(tx+r);x++)if(ok(x,y)&&Math.hypot(x-tx,y-ty)<=r)g=Math.max(g,T_(x,y));
    for(let y=Math.floor(ty-r-2);y<=Math.ceil(ty+r+2);y++)for(let x=Math.floor(tx-r-2);x<=Math.ceil(tx+r+2);x++){if(!ok(x,y)||x<2||y<2||x>W-3||y>H-3)continue;
      let lv=-1;for(let k=0;k<steps;k++){const f=k/steps,rad=r*(1-.78*f),mx=tx+lean[0]*f*r,my=ty+lean[1]*f*r;if(Math.hypot(x-mx,y-my)<=rad+.01)lv=k}
      if(lv<0)continue;const sp=lv===0?(rnd(x,y,15)<.5?'wdb':'pdb'):lv<steps-1?'pwb':'wwb';
      wall(x,y,lv%2?(o.t2||t):t,sp,g+top*(.42+.58*lv/Math.max(1,steps-1)));occ[I(x,y)]=1}
    info.towers.push({x:tx,y:ty,r,top:g+top});return g};
  /* a square spiral tower (the library's inward spiral): the cells between the lanes become rails, the middle a small lookout. (x,y) is the corner where the stair starts. */
  const sqspiral=(x,y,size,rise,t,o)=>{o=o||{};const h0=qz(T_(x,y),Q);flatten(x,y,x+size-1,y+size-1,h0,2,0);
    const sp=hgtlSpiralStairs(B,x,y,size,h0,rise,{gap:1,wall:null,helix:!!o.helix});
    for(const k of sp.cellH.keys()){const [a,b]=k.split(',').map(Number);fm[I(a,b)]='1';occ[I(a,b)]=1;B.kind[I(a,b)]=1}
    for(let j=y;j<y+size;j++)for(let i=x;i<x+size;i++){const k=i+','+j;if(sp.cellH.has(k))continue;let lo=1e9,hi=-1e9;
      for(const d of HGTL.DIRS){const v=sp.cellH.get((i+d[0])+','+(j+d[1]));if(v!==undefined){lo=Math.min(lo,v);hi=Math.max(hi,v)}}
      if(hi<-1e8)for(const d of [[1,1],[1,-1],[-1,1],[-1,-1]]){const v=sp.cellH.get((i+d[0])+','+(j+d[1]));if(v!==undefined){lo=Math.min(lo,v);hi=Math.max(hi,v)}}
      if(hi<-1e8){lo=hi=sp.top}
      wallH(i,j,t,hi-lo>2.5?'pwb':'pdb',hi-lo+.35,lo);occ[I(i,j)]=1}
    const e=sp.ends[0];
    info.towers.push({x,y,size,top:sp.top,end:e,kind:'square'});
    return {top:sp.top,end:e,entry:sp.entries[0],cellH:sp.cellH}};
  /* a single-arm helix tower: a cone with one stair winding up its outside */
  const helixTower=(tx,ty,R0,P,rc,rise,t,o)=>{o=o||{};const h0=qz(T_(tx,ty),Q);flatten(tx-R0-2,ty-R0-2,tx+R0+2,ty+R0+2,h0,2,0);
    const r=hgtxulbHelix(B,Object.assign({open,wall,wallH,door,dec,light,rg,fm,occ,I,ok,isOpen,getH,h:h0,cx:tx,cy:ty,R0,P,rc,rise,lw:1.0,arms:1,tints:[t],core:true,coreH:o.coreH||[3,6],threads:!!o.threads,wallSpec:'wdb'},o.opts||{}));
    info.towers.push({x:tx,y:ty,R0,top:r.top,kind:'helix'});return r};
  /* a colonnade: a row of tall slim pillars along a line */
  const pillars=(x0,y0,dx,dy,n,gap,t,top)=>{for(let i=0;i<n;i++){const x=x0+dx*gap*i,y=y0+dy*gap*i;if(ok(x,y)&&isOpen(x,y)){const g=getH(x,y);wall(x,y,t,'bbb',g+top)}}};

  /* ================= placements ================= */
  const links={};   // interior id -> {x,y,f}: where the outside door sits (the street cell in front of it)
  const dlink=(d,id)=>{const q=toInt(id);const i=I(d.x,d.y);wdoor.set(i,{face:d.face,lvl:id,at:{x:q.tx,y:q.ty,f:q.tf},wh:wdoor.get(i)?wdoor.get(i).wh:4});links[id]={x:d.ax!==undefined?d.ax:d.x+HGTL.DIRS[d.face][0],y:d.ay!==undefined?d.ay:d.y+HGTL.DIRS[d.face][1],f:d.face};const bd=B.doors.find(b=>b.x===d.x&&b.y===d.y);if(bd)bd.to=id};
  curSty=10;
  // --- the gate: two round towers, two pillars, an arch, lamps and glitter beds on the plaza
  taper(62,5,3.6,13,'p',{t2:'l',steps:5,lean:[-.15,0]});taper(88,5,3.6,13,'a',{t2:'c',steps:5,lean:[.15,0]});
  taper(48,10,3,15,'l',{t2:'a',steps:5,lean:[.35,.1]});taper(102,12,3,11,'c',{t2:'p',steps:4,lean:[-.3,.15]});taper(40,6,2.2,9,'a',{t2:'p',steps:3});taper(110,6,2.2,9,'p',{t2:'l',steps:3});
  for(const [x,y,k] of [[70,6,'hgtb_deco_shellstatue'],[80,6,'hgtb_deco_pearlplinth'],[66,4,'hgt_obelisk'],[84,4,'hgt_obelisk'],[75,7,'hgtb_deco_fountain']])if(isOpen(x,y))dec(k,x,y,{block:true,sc:1.2});
  for(const x of [64,68,82,86])if(isOpen(x,4))dec('hgtb_deco_banner',x,4,{walk:true,deco:true,bob:.4,sc:1.3});
  pillars(73,2,1,0,2,4,'c',6);
  for(const x of [67,70,80,83]){lamp(x,3);lamp(x,7)}
  bed(66,3,4,5,.35);bed(80,3,4,5,.35);
  // --- the cascade: a colonnade of slim lit pillars along both edges in its steep parts, and lamps
  for(let y=12;y<=32;y+=5){for(const x of [GX-8,GX+8])if(isOpen(x,y)){wall(x,y,(y/5|0)%2?'p':'a','bbb',getH(x,y)+5.5)}}
  for(let y=90;y<=112;y+=5){for(const x of [GX-8,GX+8])if(isOpen(x,y)){wall(x,y,(y/5|0)%2?'p':'a','bbb',getH(x,y)+5.5)}}
  for(let y=14;y<=110;y+=8){if(y>34&&y<86)continue;for(const x of [GX-6,GX+6])lamp(x,y)}
  // --- the Warp Pit: the double helix wound downward, west side of the court; its floor is the door to the Warp Cellar
  const pitH=qz(getH(54,60),Q);flatten(49,55,59,65,pitH,3,0);
  curSty=7;
  const pit=hgtxulbHelix(B,{open,wall,wallH,door,dec,light,rg,fm,occ,I,ok,isOpen,getH,toInt,h:pitH,cx:54,cy:60,R0:5.8,P:5,rc:2.2,rise:-.2,lw:.75,arms:2,tints:['a','p'],core:true,coreH:t=>[pitH-t+.4,pitH-t+2.4],coreR:.7,doorTo:{id:4886,tint:'l'},wallSpec:'wdC'});
  U.DEV.pit=pit;if(pit.door)links[4886]={x:pit.door.ax,y:pit.door.ay,f:pit.door.face};if(spire.door)links[4885]={x:spire.door.ax,y:spire.door.ay,f:spire.door.face};
  // --- towers and the rest of the kit, west side
  const nwTower=sqspiral(6,5,11,.17,'p');
  const dyeCourt=sunken(28,46,3,11,18,2.2,{house:true,tint:'l',fountain:false,name:'The Dye Court'});
  const ped1=pedestal(14,66,1,{tint:'p',name:'The Pearl House'});
  const shell1=helixTower(17,86,6,5,2.6,.2,'a',{threads:true});
  // --- east side
  const neTower=helixTower(136,14,7,5,2.6,.2,'l',{threads:true,coreH:[3,7]});
  const spinCourt=sunken(121,48,1,11,18,2.4,{house:true,tint:'a',fountain:true,name:'The Spinners Court'});
  const ped3=pedestal(132,78,3,{tint:'l',name:'The Lilac House'});
  const ped4=pedestal(118,100,2,{tint:'a',name:'The Aqua House'});
  const seTower=sqspiral(130,96,9,.17,'c');
  /* ================= liminal detail: stairs that lead nowhere, mazes, fish tanks ================= */
  const spots={mazes:[],tanks:[],nowhere:[],tubes:[]};U.SPOTS=spots;
  curSty=11;
  /* the Stair Garden: five flights that go nowhere, in the south-west bank */
  {const h0=qz(T_(14,110),Q);flatten(4,97,25,122,h0,2,0,'0');
   const V=[['wall',6,'a'],['window',11,'b'],['arch',16,'d'],['chair',21,'c']];
   for(const [v,x,t] of V){const r=hgtlStairsToNowhere(B,x,120,0,v,{tint:t,len:v==='chair'?10:12,width:2,h0});spots.nowhere.push({v,x:r.top.x,y:r.top.y,h:r.top.h});for(const c of r.cells)fm[I(c[0],c[1])]='1'}
   const lp=hgtlStairsToNowhere(B,8,99,0,'loop',{tint:'a',size:6,h0});spots.nowhere.push({v:'loop',x:lp.top.x,y:lp.top.y,h:lp.top.h});
   for(const c of lp.cells)fm[I(c[0],c[1])]='1';
   for(const x of [5,10,15,20,24])lamp(x,121);
   bed(5,111,2,8,.4,['hgt_fern','hgt_shellflower']);bed(22,111,2,8,.4,['hgt_fern','hgt_shellflower']);
   hgtlName(B,14,98,'The Stair Garden','place')}
  /* mazes: the Grand Maze in the north, and five smaller ones of different kinds */
  const MZP=['hgt_w3_relief_pink','hgt_w3_relief_aqua','hgt_w3_fresco_cream','hgt_w3_scroll_aqua','hgt_w3_reed_lilac','hgt_w3_arcade_cream','hgt_w2_rings','hgt_w3_fresco_amber'];
  const mazeTile=n=>(role,wh,info)=>{if(role==='wall'||role==='border'||role==='post'){if(info&&info.kind==='hedge')return undefined;const p=MZP[(n+((info&&info.band)|0))%MZP.length],pd=hgtaPic(p)?p:'hgt_wp';return hgtaChar(hgtaWallTile(pd,wh,wh>=2.5?{top:'hgt_wb'+(n%4)}:{}))}return undefined};
  const mazeAt=(x,y,w,hh,opts,name,n)=>{const h0=qz(T_(x+(w>>1),y+(hh>>1)),Q);flatten(x,y,x+w-1,y+hh-1,h0,3,0);
    for(let j=y;j<y+hh;j++)for(let i=x;i<x+w;i++){wk[I(i,j)]=0;wdoor.delete(I(i,j))}
    const m=hgtzMaze(B,x,y,w,hh,Object.assign({base:h0,seed:x*7+y*3+n,tile:mazeTile(n),floor:opts.kind==='hedge'?4:3},opts));
    if(B.fm)for(let j=y;j<y+hh;j++)for(let i=x;i<x+w;i++){const v=B.fm[j*W+i];if(v)fm[I(i,j)]=String(v)}
    mark(x-3,y-3,x+w+2,y+hh+2);hgtlName(B,x+(w>>1),y-1,name,'place');spots.mazes.push({name,x,y,w,h:hh,m,base:h0});return m};
  const gmz=mazeAt(26,3,33,33,{kind:'tall',algo:'braid',wallH:5,braid:.5,reward:'view',secret:true,side:'S'},'The Grand Maze',0);
  mazeAt(104,14,21,21,{kind:'hedge',algo:'backtracker',reward:'creature',secret:true,side:'W'},'The Hedge Maze',1);
  mazeAt(126,26,19,19,{kind:'tube',algo:'prim',reward:'lamp',side:'W'},'The Tube Maze',2);
  mazeAt(126,108,17,17,{kind:'raised',algo:'kruskal',reward:'shrine',side:'W'},'The Raised Maze',3);
  mazeAt(6,126,17,17,{kind:'sunken',algo:'wilson',reward:'chest',side:'E'},'The Sunken Maze',4);
  mazeAt(24,110,21,21,{kind:'shell',algo:'circular',reward:'lamp',side:'E'},'The Shell Maze',5);
  /* the tank walk: a run of three wall tanks along the north rampart east of the gate, with benches and lamps */
  {const h0=qz(T_(102,6),Q);flatten(90,2,114,8,h0,2,0,'5');
   for(const [x,th,sd] of [[92,'reef',41],[99,'deep',42],[106,'lagoon',43]]){hgtkTank(B,x,2,7,3,{type:'wall',face:'S',theme:th,seed:sd,h:h0,wh:3.5});spots.tanks.push({k:'wall',x,y:2})}
   for(const x of [93,100,107,113]){lamp(x,6)}for(const x of [96,103,110]){bench(x,6)}bed(92,7,22,1,.3);
   hgtlName(B,102,6,'The Tank Walk','place')}
  /* a second wall tank run, along the south rampart, seen from the north */
  {const h0=qz(T_(126,142),Q);flatten(114,140,139,146,h0,2,0,'5');
   for(const [x,th,sd] of [[116,'lagoon',71],[123,'reef',72],[130,'violet',73]]){hgtkTank(B,x,144,7,3,{type:'wall',face:'N',theme:th,seed:sd,h:h0,wh:3.5});spots.tanks.push({k:'wall',x,y:144})}
   for(const x of [117,124,131,137])lamp(x,142);for(const x of [120,127,134])bench(x,142);hgtlName(B,126,141,'The South Tanks','place')}
  /* the plaza tank: a round tank on the Reed Market, which moved to the west side of the court */
  const mk1=plaza(30,52,15,11,{name:'The Reed Market',fountain:false});
  {const px=30+7,py=52+5,h0=getH(px,py);hgtkTank(B,px-1,py-1,3,3,{type:'round',theme:'lagoon',seed:44,h:h0,z1:3});spots.tanks.push({k:'round',x:px,y:py});
   spots.market={x:px,y:py,w:15,d:11,h:h0}}
  /* ================= the reed basin: the lowest ground of Ulb ================= */
  const BF=-2.5;
  // the great round plaza at the foot of the cascade, with four obelisks and a fountain
  {const px=GX,py=125,r=8;for(let y=py-r;y<=py+r;y++)for(let x=px-r;x<=px+r;x++){if(Math.hypot(x-px,y-py)<=r+.3){open(x,y,BF,5);fm[I(x,y)]='5';occ[I(x,y)]=1}}
   dec('hgt_fountain',px,py,{block:true});
   for(const [ox,oy] of [[px-6,py],[px+6,py],[px,py-6],[px,py+6]])dec('hgt_obelisk',ox,oy,{block:true});
   for(let a=0;a<8;a++){const lx=Math.round(px+7*Math.cos(a*Math.PI/4+.4)),ly=Math.round(py+7*Math.sin(a*Math.PI/4+.4));lamp(lx,ly)}
   for(let a=0;a<8;a++){const lx=Math.round(px+4*Math.cos(a*Math.PI/4+.4)),ly=Math.round(py+4*Math.sin(a*Math.PI/4+.4));plant(lx,ly,'hgt_shellflower')}
   info.features.push({k:'plaza',x:px,y:py,r,name:'The Reed Plaza'})}
  // causeways of paving between the plaza, the hall and the gate, and across the pools
  const road=(x0,y0,x1,y1,wd)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(let k=0;k<wd;k++){const xx=x+(x0===x1?k:0),yy=y+(y0===y1?k:0);if(!ok(xx,yy)||rows[yy][xx]!=='.')continue;if(h[I(xx,yy)]<BF+.2){h[I(xx,yy)]=BF;fm[I(xx,yy)]='0';B.kind[I(xx,yy)]=0;occ[I(xx,yy)]=1}}};
  road(GX-1,133,GX+1,146,3);road(GX-18,125,GX+18,125,2);road(GX-1,147,GX+1,147,3);
  curSty=4;
  // the Reed Hall on the middle of the south shore: a long hall with a tower at each end
  {const hx=GX-8,hy=134,hw=17,hd=7;flatten(hx-1,hy-1,hx+hw,hy+hd,BF,2,0);
   for(let y=hy;y<hy+hd;y++)for(let x=hx;x<hx+hw;x++){const edge=y===hy||y===hy+hd-1||x===hx||x===hx+hw-1;wall(x,y,(x+y)%3?'p':'c',edge?(rnd(x,y,16)<.4?'wdb':'pdb'):'ppp',BF+5.5+((y===hy+hd-1)?0:.75));occ[I(x,y)]=1}
   door(GX,hy,0,'l',4,null);const rd=B.doors[B.doors.length-1];rd.hall=1;U.HALL=rd;
   taper(hx-1,hy+3,2.6,8,'a',{t2:'l',steps:3});taper(hx+hw,hy+3,2.6,8,'a',{t2:'l',steps:3});
   road(GX-1,hy-2,GX+1,hy-1,3);
   info.features.push({k:'hall',x:hx,y:hy,w:hw,d:hd,name:'The Reed Hall'})}
  // the cistern house, and two lantern towers that lean, at the edge of the plaza
  {const cx0=59,cy0=119;flatten(cx0-1,cy0-1,cx0+5,cy0+5,BF,2,0);for(let y=cy0;y<cy0+5;y++)for(let x=cx0;x<cx0+5;x++){wall(x,y,'a',(x===cx0||y===cy0||x===cx0+4||y===cy0+4)?(rnd(x,y,17)<.5?'wdb':'pdb'):'ppp',BF+4.25);occ[I(x,y)]=1}
   door(cx0+4,cy0+2,1,'a',3.5,null);U.CIST=B.doors[B.doors.length-1]}
  taper(63,116,2.6,9,'l',{t2:'c',steps:4,lean:[.2,-.4]});taper(87,116,2.6,9,'l',{t2:'c',steps:4,lean:[-.2,-.4]});
  // stilt houses on the terraces round the basin
  // two real pools: the west one can be swum and dived into (a diving helm opens the way down to the Drowned Loom Hall), the east one is a bath
  {flatten(38,126,57,138,BF,3,0);const p1=hgtlPool(B,40,128,16,9,{rim:BF,shallow:2,lead:{to:5082,x:7,y:2,f:2,ret:{x:39,y:132,f:1}},lamps:true});
   flatten(94,126,113,138,BF,3,0);const p2=hgtlPool(B,96,128,16,9,{rim:BF,shallow:2,bath:true,lamps:true});
   for(const p of [p1,p2])for(const c of p.cells){fm[I(c[0],c[1])]='2';occ[I(c[0],c[1])]=1}
   spots.pools=[p1,p2];hgtlName(B,48,132,'The Diving Pool','place');hgtlName(B,104,132,'The Bathing Pool','place');
   // tank towers on the shore beside the plaza
   for(const [x,th,sd] of [[59,'deep',51],[89,'violet',52]]){flatten(x-1,126,x+3,130,BF,1,0,'5');hgtkTank(B,x,127,3,3,{type:'tower',theme:th,seed:sd,h:BF});spots.tanks.push({k:'tower',x:x+1,y:128})}
   const ped6=pedestal(130,134,3,{tint:'p',name:'The Shore House'})}
  // reeds and glitter plants over the whole basin floor, thickest in the pools
  for(let y=110;y<H-3;y++)for(let x=3;x<W-3;x++){if(!isOpen(x,y)||occ[I(x,y)]&&fm[I(x,y)]!=='2')continue;if(h[I(x,y)]>BF+.9)continue;const pool=fm[I(x,y)]==='2';
    if(pool){if(rnd(x,y,81)<.42)plant(x,y,rnd(x,y,82)<.7?'hgt_reeds':'hgt_shellflower',{sc:.9+rnd(x,y,83)*.9})}
    else if(rnd(x,y,84)<.05)plant(x,y)}
  /* the reed lake: lit islands, boats of steps, pontoon paths, reed rings, splash sprites and wading pools across the whole basin */
  {let hmaxF=0;const free=(x,y,r)=>{let mn=99,mx=-99;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const xx=x+i,yy=y+j;if(!isOpen(xx,yy)||occ[I(xx,yy)]||B.kind[I(xx,yy)]===1||(B.water&&B.water[I(xx,yy)]))return false;const v=getH(xx,yy);mn=Math.min(mn,v);mx=Math.max(mx,v)}hmaxF=mx;return mx-mn<=.2};
   const TREES=['hgt_willow','hgtb_plant_belltree','hgt_fairytree','hgt_giantcap'];let nI=0,nB=0,nR=0;
   const SITES=[[141,141,0],[113,144,2],[141,131,2],[31,139,0],[39,144,1],[47,138,2],[26,144,2],[56,115,0],[60,142,2],[91,144,1],[100,142,0],[100,143,2]];for(const [x,y] of SITES){flatten(x-3,y-2,x+3,y+2,qz(T_(x,y),Q),1,0);hmaxF=getH(x,y);const k=SITES.find(q=>q[0]===x&&q[1]===y)[2],hb=hmaxF;
     if(k===0){for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const d=Math.max(Math.abs(i),Math.abs(j));if(d===2&&Math.abs(i)===2&&Math.abs(j)===2)continue;open(x+i,y+j,hb+(d<=1?.72:.27),2);fm[I(x+i,y+j)]='4';occ[I(x+i,y+j)]=1}
       dec(TREES[(rnd(x,y,133)*3)|0],x,y,{block:true,sc:.9+rnd(x,y,134)*.8});lamp(x+1,y+1);plant(x-1,y+1);plant(x+1,y-1);nI++}
     else if(k===1){const hz=rnd(x,y,135)<.5;for(let a=-2;a<=2;a++)for(let b=-1;b<=1;b++){const px=hz?x+a:x+b,py=hz?y+b:y+a,end=Math.abs(a)===2;open(px,py,hb+(end?.27:.54),2);fm[I(px,py)]='0';occ[I(px,py)]=1}
       dec('hgt_hanglamp',hz?x:x,y,{walk:true,deco:true,bob:1.2,sc:1.3});dec('hgt_lamppost',hz?x+2:x,hz?y:y+2,{walk:true,deco:true});B.lights.push([x,y]);bench(hz?x-1:x,hz?y:y-1);nB++}
     else{for(let a=0;a<10;a++){const an=a*.628+rnd(x,y,136),px=Math.round(x+2.4*Math.cos(an)),py=Math.round(y+2.4*Math.sin(an));if(isOpen(px,py))dec('hgt_reeds',px,py,{walk:true,deco:true,sc:1.7+rnd(px,py,137)*1.2,ox:(rnd(px,py,138)-.5)*.4})}
       dec('hgt_shellflower',x,y,{walk:true,deco:true,sc:1.2});light(x,y);bench(x+1,y);nR++}}
   // pontoon paths across the two big pools, with lamps, and splash sprites round their edges
   for(const p of spots.pools){const y=p.y+(p.d>>1);for(let x=p.x;x<p.x+p.w;x++){if(!B.water)break;const i=I(x,y);B.water[i]=0;h[i]=BF;fm[i]='0';B.kind[i]=2}
     for(let x=p.x+2;x<p.x+p.w;x+=4)lamp(x,y-1<p.y?y:y,{});for(let k=0;k<p.w;k+=2){const c=[p.x+k,p.y-1],d=[p.x+k,p.y+p.d];for(const q of [c,d])if(isOpen(q[0],q[1]))dec('hgtb_tank_bubbles',q[0],q[1],{walk:true,deco:true,sc:1.4,bob:.1})}}
   // three small wading pools, shallow all over
   for(const [wx,wy] of [[50,141],[92,141]]){flatten(wx-1,wy-1,wx+8,wy+4,BF,1,0);const wp=hgtlPool(B,wx,wy,8,4,{rim:BF,shallow:1,deep:false});for(const c of wp.cells){fm[I(c[0],c[1])]='2';occ[I(c[0],c[1])]=1}for(let k=0;k<8;k+=3)plant(wx+k,wy-1,'hgt_reeds')}
   info.lake={islands:nI,boats:nB,reedRings:nR}}
  /* the approach: a long avenue of lamps on the axis of the cascade and banners, bunting and lantern clusters hanging along both edges, so that the spire is seen from far */
  for(let y=12;y<=108;y+=4){if(y>34&&y<88)continue;for(const dx of [-3,0,3]){const x=GX+dx;if(isOpen(x,y))dec('hgtb_lamp_tall',x,y,{walk:true,deco:true,sc:1.1});}}
  for(let y=15;y<=105;y+=6){if(y>34&&y<88)continue;for(const [dx,k,bb] of [[-7,'hgtb_deco_banner',.3],[7,'hgtb_deco_banner',.3],[-5,'hgtb_deco_lanterns',.9],[5,'hgtb_deco_lanterns',.9],[0,'hgtb_deco_bunting',1.2]]){const x=GX+dx;if(isOpen(x,y))dec(k,x,y,{walk:true,deco:true,bob:bb,sc:1.2})}}
  for(let y=18;y<=102;y+=10){if(y>34&&y<88)continue;for(const dx of [-8,8]){const x=GX+dx;if(isOpen(x,y))dec('hgtb_tank_bubbles3',x,y,{walk:true,deco:true,sc:1.5,bob:.1})}}
  /* stalls on the plazas and along the Reed Plaza */
  {const ST=['coral_fruit','aqua_jars','lilac_cloth','yellow_bread','pink_flowers','teal_fish','orange_pottery','sage_herbs','navy_books','rose_lanterns'];let n=0;
   const stall=(x,y)=>{if(!isOpen(x,y)||B.decor.some(d=>d.x===x&&d.y===y))return;dec('hgtb_stall_'+ST[(n++)%ST.length],x,y,{block:true,sc:1.2})};
   for(let i=0;i<spots.market.w;i+=3){stall(spots.market.x-7+i,spots.market.y-5);stall(spots.market.x-7+i,spots.market.y+5)}
   for(let i=-14;i<=14;i+=4){stall(GX+i,121);if(Math.abs(i)>9)stall(GX+i,129)}
   for(const x of [93,100,107])stall(x,8)}
  {const mx=spots.market.x,my=spots.market.y;for(let i=-6;i<=6;i+=3)for(const dy of [-4,4]){lamp(mx+i,my+dy,{});light(mx+i,my+dy)}
   for(let i=-7;i<=7;i++)for(const dy of [-3,3])if(rnd(mx+i,my+dy,190)<.5){plant(mx+i,my+dy,['hgtb_plant_glowshrooms','hgtb_plant_lupin','hgt_lightvine','hgtb_plant_potvine'][(rnd(mx+i,my+dy,191)*4)|0]);light(mx+i,my+dy)}
   for(const [dx,dy] of [[-7,-5],[7,-5],[-7,5],[7,5]])dec('hgtb_deco_banner',mx+dx,my+dy,{walk:true,deco:true,bob:.4,sc:1.3})}
  dec('hgtb_deco_fountain',spots.market.x-5,spots.market.y,{block:true});dec('hgtb_deco_shellstatue',spots.market.x+5,spots.market.y,{block:true});dec('hgtb_deco_pearlplinth',GX-10,125,{block:true});dec('hgtb_deco_pearlplinth',GX+10,125,{block:true});
  /* ================= the town fabric ================= */
  const tintAt=(x,y,k)=>{const pool=x<GX?'ppllcpa':'aaccpla';return pool[(rnd(x,y,k||3)*pool.length)|0]};
  const specFront=(x,y)=>{const r=rnd(x,y,11);return r<.25?'wdC':r<.4?'wdb':r<.55?'DdC':r<.7?'dwC':r<.85?'bdC':'wwC'};
  const specSide=(x,y)=>{const r=rnd(x,y,12);return r<.25?'DdC':r<.5?'wdC':r<.7?'ddC':r<.85?'bdb':'dwb'};
  const reserve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(ok(x,y))occ[I(x,y)]=1};
  const farFromCourt=(x,y)=>Math.hypot(x-cx,y-cy)>CR+1.2;
  const canPlace=(x0,y0,w,d)=>{for(let y=y0;y<y0+d;y++)for(let x=x0;x<x0+w;x++){if(!ok(x,y)||occ[I(x,y)]||rows[y][x]!=='.'||!farFromCourt(x,y))return false}return true};
  /* a house: w across, d deep, its door in the middle of the front, which faces north (0) or south (2). The roof steps up towards the back; sometimes a tower rises at a back corner. */
  let houseN=0;
  const house=(x0,y0,w,d,face,o)=>{
    o=o||{};const t=o.tint||tintAt(x0,y0),inc=[0,.75,1.25][(rnd(x0,y0,6)*3)|0],wh0=o.wh||3+((rnd(x0,y0,5)*3)|0);
    let ref=-9;for(let y=y0;y<y0+d;y++)for(let x=x0;x<x0+w;x++)ref=Math.max(ref,terr[I(x,y)]);
    const tw=(o.tower!==undefined?o.tower:(w>=4&&rnd(x0,y0,7)<.25)),twx=x0+(rnd(x0,y0,8)<.5?0:w-1),dx=x0+(w>>1),id=++houseN;
    for(let j=0;j<d;j++){const dep=face===0?j:d-1-j;
      for(let i=0;i<w;i++){const x=x0+i,y=y0+j,front=dep===0,edge=i===0||i===w-1||dep===d-1;
        let top=ref+wh0+Math.min(inc*dep,2.5),spec=front?specFront(x,y):edge?specSide(x,y):'ppp';
        if(tw&&dep===d-1&&x===twx){top+=3.5+rnd(x0,y0,9)*2;spec='pwb'}
        wall(x,y,t,spec,top);occ[I(x,y)]=1}}
    const fy=face===0?y0:y0+d-1,fx=dx;
    door(fx,fy,face,t,wh0,null);occ[I(fx,fy)]=1;
    const d0=B.doors[B.doors.length-1];d0.house=id;d0.w=w;d0.d=d;
    info.doors.push({x:fx,y:fy,ax:d0.ax,ay:d0.ay,face,house:id});
    return d0};
  /* The streets are rings round the Loom Court, two cells wide, every 13 cells outward (a little wavy), and the houses stand in two rows between each pair of rings with a
     lane of one cell between the rows. Along a ring the houses are 3 to 6 cells wide, some with a one-cell alley between. */
  const FLD=(x,y)=>{const dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy),th=Math.atan2(dy,dx);return r+2.2*Math.sin(th*3+.7)+1.2*Math.sin(th*7+2.1)};
  const F0=28.5,PER=13,NB=7;
  const bound=[];for(let k=0;k<NB;k++)for(let sd=0;sd<2;sd++){const rm=F0+PER*k+(sd?10:4.5),arr=[];let t=rnd(k,sd,40)*6.283,t0=t,n=0;
    while(t<t0+6.2832&&n++<200){const w=3+((rnd(k*7+sd,n,41)*4)|0);arr.push({t:t,gap:rnd(k*7+sd,n,42)<.16,r:rm});t+=w/rm}
    bound.push(arr)}
  const grpOf=new Int32Array(W*H).fill(-1),groups=[];
  const gKey=new Map();
  reserve(60,2,90,8);
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
    const i=I(x,y);if(occ[i]||rows[y][x]!=='.'||y>136||(y>108&&Math.abs(x-GX)<38))continue;
    const fv=FLD(x,y)-F0;if(fv<0)continue;
    const k=Math.floor(fv/PER),f=fv-PER*k;if(k>=NB)continue;
    let sd;if(f>=2&&f<7)sd=0;else if(f>=8&&f<13)sd=1;else continue;
    const th0=Math.atan2(y-cy,x-cx),arr=bound[k*2+sd];let th=th0-arr[0].t;th=((th%6.2832)+6.2832)%6.2832;
    // which house along the ring: the last boundary at or before this angle
    let j=0;for(let q=0;q<arr.length;q++){const tq=((arr[q].t-arr[0].t)%6.2832+6.2832)%6.2832;if(tq<=th)j=q}
    const tj=((arr[j].t-arr[0].t)%6.2832+6.2832)%6.2832;
    if(arr[j].gap&&(th-tj)*arr[j].r<1.0)continue;
    const key=k+'_'+sd+'_'+j;let g=gKey.get(key);if(g===undefined){g=groups.length;gKey.set(key,g);groups.push({k,sd,j,cells:[]})}
    groups[g].cells.push([x,y,f]);grpOf[i]=g}
  const isStreetCell=(x,y)=>{if(!ok(x,y)||rows[y][x]!=='.'||grpOf[I(x,y)]>=0)return false;const u=FLD(x,y)-F0;if(u<0)return true;const f=u-PER*Math.floor(u/PER);return f<2};
  const dirsC=HGTL.DIRS;
  let nHouses=0;
  for(let gi=0;gi<groups.length;gi++){const G0=groups[gi];if(G0.cells.length<6){for(const c of G0.cells)grpOf[I(c[0],c[1])]=-1;G0.dead=1;continue}
    curSty=(G0.k*2+G0.sd+(G0.cells[0][0]<GX?0:5))%STY.length;
    const t=tintAt(G0.cells[0][0],G0.cells[0][1],3),inc=[0,.75,1.25][(rnd(gi,3,6)*3)|0],wh0=3+((rnd(gi,3,5)*3)|0);
    let ref=-9;for(const c of G0.cells)ref=Math.max(ref,terr[I(c[0],c[1])]);
    // door: a cell of the group that touches a street, nearest the middle of the group
    let mx=0,my=0;for(const c of G0.cells){mx+=c[0];my+=c[1]}mx/=G0.cells.length;my/=G0.cells.length;
    let best=null,bd=1e9;
    for(const c of G0.cells){for(let q=0;q<4;q++){const nx=c[0]+dirsC[q][0],ny=c[1]+dirsC[q][1];if(isStreetCell(nx,ny)){const d=Math.hypot(c[0]-mx,c[1]-my);if(d<bd){bd=d;best={x:c[0],y:c[1],face:q}}}}}
    G0.door=best;
    const shapeK=G0.cells.length>=14?(rnd(gi,3,10)<.2?1:rnd(gi,3,11)<.2?2:0):0,domeR=Math.max(2,Math.min(3.4,Math.sqrt(G0.cells.length)/2)),leanA=rnd(gi,3,12)*6.283,leanX=Math.cos(leanA),leanY=Math.sin(leanA);
    const tw=shapeK===0&&G0.cells.length>=16&&rnd(gi,3,7)<.3,twc=G0.cells[(rnd(gi,3,8)*G0.cells.length)|0];
    const front=sdv=>sdv; void front;
    for(const c of G0.cells){const x=c[0],y=c[1],f=c[2],dep=G0.sd===0?f-2:13-f; // how far back from the street this cell is
      let edge=false,frontc=false;for(let q=0;q<4;q++){const nx=x+dirsC[q][0],ny=y+dirsC[q][1];if(ok(nx,ny)&&rows[ny][nx]==='.'&&grpOf[I(nx,ny)]<0){edge=true;if(isStreetCell(nx,ny))frontc=true}}
      let top=ref+wh0+Math.min(inc*Math.max(0,dep),2.5),spec=frontc?specFront(x,y):edge?specSide(x,y):'ppp';
      if(tw&&Math.hypot(x-twc[0],y-twc[1])<1.3){top+=3.5+rnd(gi,3,9)*2.5;spec='pwb'}
      else if(shapeK===1){const dd=Math.hypot(x-mx,y-my);if(dd<domeR){top+=Math.round((.6+3.2*Math.sqrt(1-dd/domeR))*2)/2;spec=dd<domeR*.5?'wwb':'pwb'}} // a bulb or dome rising over the middle of the house
      else if(shapeK===2){top+=Math.max(0,Math.round(((x-mx)*leanX+(y-my)*leanY)*.45*2)/2);spec=spec==='ppp'?'pwb':spec} // a house that leans: the roof climbs steadily to one side
      wall(x,y,t,spec,top);occ[I(x,y)]=1}
    if(best){door(best.x,best.y,best.face,t,wh0,null);const d0=B.doors[B.doors.length-1];d0.house=gi;info.doors.push({x:best.x,y:best.y,ax:d0.ax,ay:d0.ay,face:best.face,house:gi,n:G0.cells.length})}
    nHouses++}
  info.houses=nHouses;
  const streets=[];for(let k=0;k<NB+1;k++)streets.push(k);
  curSty=6;
  /* the ramparts: two cells thick all round, six high above the ground */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x<2||y<2||x>=W-2||y>=H-2){const g=terr[I(x,y)];wall(x,y,'c',(x+y)%5?'ppp':'pbb',Math.max(g,terr[I(Math.min(W-3,Math.max(2,x)),Math.min(H-3,Math.max(2,y)))])+6.5,g);occ[I(x,y)]=1}}
  /* the north gate and the south gate: a glowing door, an arch in front of it */
  door(GX,1,2,'l',4,470,26,89,0);door(GX,H-2,0,'l',4,470,26,111,2);
  dec('hg_arch',GX,2,{walk:true,deco:true});dec('hg_arch',GX,H-3,{walk:true,deco:true});
  /* lamps along every ring street */
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!isOpen(x,y)||occ[I(x,y)])continue;const u=FLD(x,y)-F0;if(u<0)continue;const f=u-PER*Math.floor(u/PER);if(f<2&&f>=.9&&((x*7+y*13)%11===0))lamp(x,y)}
  /* ================= covered tubes: passages with a ceiling, cut through the houses ================= */
  {const rowOpen=(x,y,dir)=>{for(let k=0;k<30;k++)for(const sg of [1,-1]){const xx=x+sg*k*dir;if(isOpen(xx,y)&&B.kind[I(xx,y)]!==1&&!B.decor.some(d=>d.x===xx&&d.y===y&&d.block))return xx}return null};
   const tube=(x0,x1,y,o)=>{const a=rowOpen(x0,y,1),b=rowOpen(x1,y,1);if(a===null||b===null||Math.abs(a-b)<8)return null;
     const ha=getH(a,y),hb=getH(b,y),n=Math.abs(b-a),rise=(hb-ha)/n;if(Math.abs(rise)>.28)return null;
     const t=hgtlTube(B,a,y,b,y,Object.assign({h:ha,rise,lid:2.4,lampEvery:3},o||{}));mark(Math.min(a,b),y-2,Math.max(a,b),y+2);spots.tubes.push({x0:a,x1:b,y});return t};
   const tubeV=(x,y0,y1,o)=>{const col=(yy)=>{for(let k=0;k<30;k++)for(const sg of [1,-1]){const y2=yy+sg*k;if(isOpen(x,y2)&&B.kind[I(x,y2)]!==1&&!B.decor.some(d=>d.x===x&&d.y===y2&&d.block))return y2}return null};
     const a=col(y0),b=col(y1);if(a===null||b===null)return null;const ha=getH(x,a),hb=getH(x,b),n=Math.abs(b-a),rise=(hb-ha)/n;if(Math.abs(rise)>.28)return null;
     const t=hgtlTube(B,x,a,x,b,Object.assign({h:ha,rise,lid:2.4,lampEvery:3},o||{}));mark(x-2,Math.min(a,b),x+2,Math.max(a,b));spots.tubes.push({x,y0:a,y1:b,v:1});return t};
   const tV=tubeV(21,20,62,{width:1,wall:'nacre_c_mid'});hgtlName(B,21,40,'The Long Tube','place');
   if(tV){const x=21;for(let y=spots.tubes[0].y0;y<=spots.tubes[0].y1;y++){fm[I(x,y)]='3';const k=y-spots.tubes[0].y0;
      for(const sx of [-1,1]){const wx=x+sx;if(ok(wx,y)&&rows[y][wx]!=='.'&&(k%3===1))rows[y][wx]=HGTL_CHARS.window_mid}
      if(k%4===2){dec('hgtb_deco_lanterns',x,y,{walk:true,deco:true,bob:1.1,sc:.9});light(x,y)}if(k%8===5)dec('hgt_lightvine',x,y,{walk:true,deco:true,sc:.9})}}
   const t1=tube(30,50,86,{width:1,wall:'nacre_a_mid'}),t2=tube(100,122,92,{width:3,lid:2.4,peak:3.2,wall:'nacre_b_mid'}),t3=tube(30,50,100,{width:1});
   info.tubes=[t1,t2,t3,tV].filter(Boolean).length}
  /* the edge of the city: buttress towers, arches and lit beds along the inside of the ramparts */
  {const tryTower=(px,py)=>{for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){const xx=px+i,yy=py+j;if(!isOpen(xx,yy)||occ[I(xx,yy)]||B.kind[I(xx,yy)]===1)return false}
     curSty=6+((px+py)%3);taper(px,py,2.2,5+rnd(px,py,160)*4,'pacl'[(rnd(px,py,161)*4)|0],{t2:'pacl'[(rnd(px,py,162)*4)|0],steps:3,lean:[(rnd(px,py,163)-.5)*.5,(rnd(px,py,164)-.5)*.5]});return true};
   for(let k=0;k<5;k++){for(const [px,py] of [[10+k*30,5],[10+k*30,H-6],[5,12+k*30],[W-6,12+k*30]])for(let t=0;t<6;t++)if(tryTower(px+t*2-5,py+(px===5||px===W-6?t*2-5:0)))break}
   for(let x=4;x<W-4;x+=6){for(const y of [3,H-4])if(isOpen(x,y)&&!occ[I(x,y)]&&rnd(x,y,165)<.5)plant(x,y,['hgt_willow','hgt_fairytree','hgt_giantcap','hgt_bulbflower'][(rnd(x,y,166)*4)|0],{block:false,sc:1+rnd(x,y,167)})}}
  /* ================= connections, pockets, doors ================= */
  /* flights of treads pour from the hillside into the cascade: every eight rows, two cells wide, cut through whatever stands in the way */
  const carve=(x,y,hh)=>{open(x,y,hh,1);fm[I(x,y)]='1';occ[I(x,y)]=1};
  for(const side of [-1,1]){for(let y0=13;y0<=112;y0+=8){if(y0>32&&y0<88)continue;
    for(const dy of [0,1]){const y=y0+dy;let cur=getH(GX+side*8,y);
      for(let k=1;k<=18;k++){const x=GX+side*(8+k);if(!ok(x,y)||x<3||x>W-4)break;
        const here=isOpen(x,y)&&!occ[I(x,y)]?getH(x,y):null;
        if(here!==null&&Math.abs(here-cur)<=.45&&k>1)break;
        if(here!==null&&Math.abs(here-cur)<=.45&&k===1&&Math.abs(T_(x,y)-cur)<=.45)break;
        const want=cur+clampv(T_(x,y)-cur,-.3,.3);carve(x,y,want);cur=want}}}}
  /* pockets that nothing can reach are walled in */
  const sealPockets=()=>{if(U.NOSEAL)return 0;const r=hgtlReach(B,B.start?B.start.x:GX,B.start?B.start.y:3),seen=r.seen;let n=0;const done=new Uint8Array(W*H);info.sealedBig=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(rows[y][x]!=='.'||seen[I(x,y)]||done[I(x,y)])continue;
      const q=[[x,y]],comp=[];done[I(x,y)]=1;while(q.length){const [a,b]=q.pop();comp.push([a,b]);for(const d of HGTL.DIRS){const nx=a+d[0],ny=b+d[1];if(!isOpen(nx,ny)||done[I(nx,ny)]||seen[I(nx,ny)]||Math.abs(getH(nx,ny)-getH(a,b))>.55)continue;done[I(nx,ny)]=1;q.push([nx,ny])}}
      if(comp.length>12)info.sealedBig.push([comp.length,x,y]);
      for(const [a,b] of comp){wall(a,b,tintAt(a,b,3),'ppp',getH(a,b)+3.5+rnd(a,b,80)*2);occ[I(a,b)]=1;n++}}
    return n};
  /* a pocket of ground that nothing can reach is joined to the rest by a cut stair: the shortest way through walls, with treads of at most .3 */
  const connectPockets=()=>{let joined=0;
    for(let pass=0;pass<60;pass++){const r=hgtlReach(B,B.start?B.start.x:GX,B.start?B.start.y:3),seen=r.seen,done=new Uint8Array(W*H);let comp=null;
      for(let y=0;y<H&&!comp;y++)for(let x=0;x<W&&!comp;x++){if(rows[y][x]!=='.'||seen[I(x,y)]||done[I(x,y)])continue;
        const q=[[x,y]],c=[];done[I(x,y)]=1;while(q.length){const [a,b]=q.pop();c.push([a,b]);for(const d of HGTL.DIRS){const nx=a+d[0],ny=b+d[1];if(!isOpen(nx,ny)||done[I(nx,ny)]||seen[I(nx,ny)]||Math.abs(getH(nx,ny)-getH(a,b))>.55)continue;done[I(nx,ny)]=1;q.push([nx,ny])}}
        if(c.length>=6)comp=c}
      if(!comp)break;
      const inC=new Set(comp.map(c=>I(c[0],c[1]))),prev=new Int32Array(W*H).fill(-2),dist=new Int16Array(W*H),q=[];for(const c of comp){prev[I(c[0],c[1])]=-1;q.push(I(c[0],c[1]))}
      let hit=-1;for(let qi=0;qi<q.length&&hit<0;qi++){const i=q[qi],x=i%W,y=(i/W)|0;for(const d of HGTL.DIRS){const nx=x+d[0],ny=y+d[1];if(nx<3||ny<3||nx>=W-3||ny>=H-3)continue;const j=I(nx,ny);if(prev[j]!==-2)continue;if(B.kind[j]===1&&!seen[j])continue;prev[j]=i;dist[j]=dist[i]+1;
        if(rows[ny][nx]==='.'&&seen[j]&&!inC.has(j)&&dist[j]>=2){hit=j;break}q.push(j)}}
      if(hit<0)break;
      const path=[];for(let i=prev[hit];i>=0&&!inC.has(i);i=prev[i])path.push(i);path.reverse();
      const startI=prev[path.length?I(path[0]%W,(path[0]/W)|0):hit];void startI;
      let cur=getH(comp[0][0],comp[0][1]);const first=path.length?path[0]:hit;let bd=1e9,fromC=comp[0];for(const c of comp){const dd=Math.abs(c[0]-first%W)+Math.abs(c[1]-((first/W)|0));if(dd<bd){bd=dd;fromC=c}}cur=getH(fromC[0],fromC[1]);
      const endH=getH(hit%W,(hit/W)|0),n=path.length+1;
      path.forEach((i,k)=>{const x=i%W,y=(i/W)|0,want=cur+(endH-cur)/(n-k),hh=cur+clampv(want-cur,-.3,.3);open(x,y,hh,1);fm[i]='1';occ[i]=1;cur=hh;joined++});
      if(!path.length)break}
    return joined};
  info.joined=connectPockets();
  const sealed=sealPockets();info.sealed=sealed;
  // decor and lights that ended up inside walls are dropped
  B.decor=B.decor.filter(d=>isOpen(d.x,d.y));B.lights=B.lights.filter(l=>isOpen(l[0],l[1]));
  /* interior doors: the nearest reachable street door to each target */
  const reach2=hgtlReach(B,B.start?B.start.x:GX,B.start?B.start.y:3).seen;
  const freeDoors=info.doors.filter(d=>d.house!==undefined&&rows[d.y][d.x]!=='.'&&isOpen(d.ax,d.ay)&&reach2[I(d.ax,d.ay)]&&!wdoor.get(I(d.x,d.y)).lvl);
  const assign=(id,tx,ty,nmin)=>{let best=null,bd=1e9;for(const d of freeDoors){if(d.used||(nmin&&(d.n||0)<nmin))continue;const dd=Math.hypot(d.x-tx,d.y-ty);if(dd<bd){bd=dd;best=d}}
    if(!best)return null;best.used=1;best.id=id;dlink(best,id);return best};
  U.TARGETS.forEach(t=>assign(t[0],t[1],t[2],t[3]));
  /* the sphere rooms and star rooms assigned to Ulb (hgt_rooms.js), the indoor maze and the tank room */
  const roomAt=id=>{const r=typeof HGTROOMS!=='undefined'&&HGTROOMS.find(q=>q.id===id);return r&&r.entry};
  const assignAt=(id,tx,ty,at,ret)=>{if(!at)return;let best=null,bd=1e9;for(const d of freeDoors){if(d.used)continue;const dd=Math.hypot(d.x-tx,d.y-ty);if(dd<bd){bd=dd;best=d}}
    if(!best)return;best.used=1;best.id=id;const i=I(best.x,best.y);wdoor.set(i,{face:best.face,lvl:id,at:{x:at.x,y:at.y,f:at.f|0},wh:wdoor.get(i).wh});links[id]={x:best.ax,y:best.ay,f:best.face};
    const bd2=B.doors.find(b=>b.x===best.x&&b.y===best.y);if(bd2)bd2.to=id;if(ret&&typeof hgtrSetReturn==='function')hgtrSetReturn(id,U.ID,{x:best.ax,y:best.ay,f:best.face})};
  for(const [id,tx,ty] of U.RT)assignAt(id,tx,ty,roomAt(id),true);
  {let ind=null;try{ind=hgtzIndoorLevel(5080,{w:31,h:31,seed:5080,back:{lvl:U.ID,at:{x:1,y:1,f:0}}})}catch(e){console.error('ulb indoor maze',e)}
   if(ind)assignAt(5080,140,70,{x:ind.start.x,y:ind.start.y,f:ind.start.f|0});assignAt(5081,100,12,{x:11,y:11,f:0})}
  {const cand=freeDoors.filter(d=>!d.used);cand.sort((a,b)=>rnd(a.x,a.y,180)-rnd(b.x,b.y,180));let n=0;for(const d of cand){if(n>=45)break;const id=5083+n;d.used=1;d.id=id;dlink(d,id);n++}info.themedDoors=n}
  // the doors of the pedestals, the sunken houses and the tops of the towers
  const linkDoor=(rec,id)=>{if(!rec)return;const bd=B.doors.find(b=>b.x===rec.x&&b.y===rec.y);if(bd){bd.to=id;dlink(Object.assign({},rec,{ax:bd.ax,ay:bd.ay,face:bd.face}),id)}};
  linkDoor({x:ped1.dx,y:ped1.dy},4898);linkDoor(dyeCourt.door&&{x:dyeCourt.door.x,y:dyeCourt.door.y},4888);linkDoor(spinCourt.door&&{x:spinCourt.door.x,y:spinCourt.door.y},4897);dlink(U.HALL,4895);dlink(U.CIST,4894);
  U.LINKS=links;
  B.start={x:GX,y:3,f:2};
  /* every door that leads nowhere becomes a window: only the doors that open are doors */
  for(const d of info.doors){if(d.used||wdoor.get(I(d.x,d.y)).lvl)continue;const i=I(d.x,d.y);wdoor.delete(i);wk[i]=kindOf('wdb');const bd=B.doors.findIndex(b=>b.x===d.x&&b.y===d.y);if(bd>=0)B.doors.splice(bd,1)}
  info.doors=info.doors.filter(d=>d.used);
  /* a second door in the Loom Spire: at the foot of an inner wall, on the aqua stair, into the Pattern Archive */
  {let best=null;for(const g of spire.gapWalls){if(g.arm!==1)continue;for(const d of HGTL.DIRS){const lc=spire.lane.get((g.i+d[0])+','+(g.j+d[1]));if(lc&&Math.abs(lc.h-g.lo)<.01&&lc.u>.45&&lc.u<.6&&!best)best={g,d,lc}}}
    if(best){const q=toInt(4893),face=HGTL.DIRS.findIndex(z=>z[0]===best.d[0]&&z[1]===best.d[1]);door(best.g.i,best.g.j,face,'a',best.g.hi-best.g.lo+.6,4893,q.tx,q.ty,q.tf);const rec=B.doors[B.doors.length-1];links[4893]={x:rec.ax,y:rec.ay,f:rec.face}}}
  /* looms, tapestries and threads of light on the top platform, round the column */
  {const ring=spire.plat.filter(c=>{const r=Math.hypot(c[0]-cx,c[1]-cy);return r>2.5});let n=0;
   for(const c of ring){if(!isOpen(c[0],c[1])||(c[0]===(spire.door&&spire.door.ax)&&c[1]===(spire.door&&spire.door.ay)))continue;n++;
     if(n%2===0)dec('kh_int4_2',c[0],c[1],{block:true,deco:true,sc:1.5});else if(n%3===1)dec('kh_int4_3',c[0],c[1],{block:true,deco:true,sc:1.4});else dec('hgt_lightvine',c[0],c[1],{walk:true,deco:true,sc:1.4,bob:.1});light(c[0],c[1])}
   NPC_H.kh_int4_2=1.0;NPC_H.kh_int4_3=1.0}
  /* the basin is dressed: stalls on the shore, lamps down every causeway, trees, giant caps and glitter plants on the banks, benches by the plaza */
  for(const [sx,sy] of [[GX-12,121],[GX+12,121],[GX-14,128],[GX+14,128],[GX-12,131],[GX+12,131]]){const k=khProp(['stallA','stallC','stallB','stallD','stallE','stallF'][(sx+sy)%6]);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH('stallA');if(isOpen(sx,sy))dec(k,sx,sy,{block:true,deco:true,sc:1.3})}
  for(let y=112;y<H-3;y++)for(let x=3;x<W-3;x++){if(!isOpen(x,y)||B.kind[I(x,y)]===1)continue;const r=rnd(x,y,86),road=fm[I(x,y)]==='0'||fm[I(x,y)]==='5';
    if(road){if((x+y*3)%9===0)lamp(x,y);continue}
    if(fm[I(x,y)]==='2')continue;
    if(h[I(x,y)]<-2.3){if(r<.06)dec(['hgt_willow','hgt_fairytree','hgt_giantcap'][(r*100|0)%3],x,y,{block:true,sc:.9+rnd(x,y,87)*.6});else if(r<.2)plant(x,y,['hgt_reeds','hgt_mushrooms','hgt_bulbflower','hgt_crystalgrass'][(r*100|0)%4])}
    else if(r<.18)plant(x,y)}
  for(let x=GX-6;x<=GX+6;x+=4){bench(x,119);bench(x,131)}
  /* ================= the folk, and what waits at the tops of the towers ================= */
  const nearOpen=(tx,ty,seen)=>{let best=null,bd=1e9;for(let dy=-9;dy<=9;dy++)for(let dx=-9;dx<=9;dx++){const x=tx+dx,y=ty+dy;if(!isOpen(x,y)||(seen&&!seen[I(x,y)])||B.kind[I(x,y)]===1)continue;if(B.decor.some(d=>d.x===x&&d.y===y&&d.block))continue;const d=Math.hypot(dx,dy);if(d<bd){bd=d;best=[x,y]}}return best};
  const folk=(id,img,tx,ty,sc)=>{const c=nearOpen(tx,ty,reach2);if(!c)return;dec(img,c[0],c[1],{block:false,walk:true,npc:id,sc:sc||1})};
  folk('hgn_plonk','hg_npc4',72,4);folk('hgn_lorr','hg_npc4',36,23);folk('hgxulb_wuubb','hg_npc0',75,18);folk('hgxulb_orp','hg_npc4',57,63);folk('hgxulb_child','hg_npc3',70,78,.8);
  folk('hgxulb_sloob','hg_npc1',75,126);
  { // the top of the Loom Spire: a lookout on the platform and a lamp
    const pl=spire.plat.filter(c=>Math.hypot(c[0]-cx,c[1]-cy)>2.6).sort((a,b)=>b[0]-a[0]);if(pl.length){const c=pl[0];dec('hg_npc6',c[0],c[1],{block:false,walk:true,npc:'hgxulb_blem',sc:1});}
    for(let k=0;k<spire.plat.length;k+=3){const c=spire.plat[k];light(c[0],c[1])}}
  { // a door at the top of the north-west tower into the hermit's cell
    const e=nwTower.end;let done=false;
    for(const d of HGTL.DIRS){const wx=e[0]+d[0],wy=e[1]+d[1];if(done||!ok(wx,wy)||rows[wy][wx]==='.')continue;const face=HGTL.DIRS.findIndex(q=>q[0]===-d[0]&&q[1]===-d[1]);
      const q=toInt(4899);door(wx,wy,face,'l',1.8,4899,q.tx,q.ty,q.tf);const rec=B.doors[B.doors.length-1];links[4899]={x:rec.ax,y:rec.ay,f:rec.face};wdoor.get(I(wx,wy)).wh=1.8;done=true}}
  // a chest at the top of each of the other towers
  for(const t of [seTower,{end:[neTower.plat[0][0],neTower.plat[0][1]]},{end:[shell1.plat[0][0],shell1.plat[0][1]]}]){const e=t.end;if(e&&isOpen(e[0],e[1]))dec(['hg_chestjelly','hg_chestwax','hg_chestweed'][(e[0]+e[1])%3],e[0],e[1],{block:true})}
  /* ================= faces of the cliffs, names on the map, the far towers ================= */
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=I(x,y);if(rows[y][x]!=='.'||rg[i])continue;let drop=0;
    for(const d of HGTL.DIRS){const nx=x+d[0],ny=y+d[1];if(rows[ny][nx]==='.')drop=Math.max(drop,h[i]-h[I(nx,ny)])}
    if(drop>.55){const t=TINTS[(rnd(x>>2,y>>2,90)*4)|0];rg[i]=riserGid(t,drop>1.6&&rnd(x,y,91)<.8?'win':'plain')}}
  for(const c of spire.lane.values())rg[I(c.i,c.j)]=riserGid(c.arm?'a':'p',rnd(c.i,c.j,92)<.6?'win':'plain');
  for(const c of pit.lane.values())rg[I(c.i,c.j)]=riserGid(c.arm?'p':'a','plain');
  const nm=(t,x,y)=>hgtlName(B,x,y,t,'place');
  nm('North Gate',GX,6);nm('The Great Cascade',GX,24);nm('The Loom Court',GX,40);nm('THE LOOM SPIRE',cx,cy);nm('The Warp Pit',54,60);nm('The Reed Market',36,22);nm('The Thread Market',112,25);
  nm('Dyers’ Tower',11,10);nm('The Dye Court',22,52);nm('The Spinners Court',128,53);nm('The Shell Tower',136,14);nm('The Reed Shell Tower',17,86);nm('The Reed Plaza',GX,125);nm('The Reed Hall',GX,138);nm('South Gate',GX,145);nm('The Reed Basin',55,132);nm('The Cream House',38,98);nm('The Aqua House',118,98);
  // far towers stand outside the walls, a ring of them, fading into the haze
  const sky=[];for(let i=0;i<44;i++){const f=(i+rnd(i,1,95)*.7)/44*4,e=Math.floor(f),u=f-e,m=10+rnd(i,2,96)*26,x=e===0?-m+u*(W+2*m):e===2?W+m-u*(W+2*m):e===1?W+m:-m,y=e===0?-m:e===2?H+m:e===1?-m+u*(H+2*m):H+m-u*(H+2*m),k='hg_tower'+['5','7','7','6','4','5','7','0','6'][(rnd(i,3,97)*9)|0];sky.push({x,y,k,w:5+Math.pow(rnd(i,6,100),1.6)*20,z:(rnd(i,7,101)<.25?3+rnd(i,8,102)*10:0),big:1})}
  U.SKY=sky;
  /* ================= the open ground between the houses: gardens, so that no terrace is bare ================= */
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){const i=I(x,y);if(!isOpen(x,y)||occ[i]||B.kind[i]===1||fm[i]==='1'||fm[i]==='5')continue;
    if(B.decor.some(d=>d.x===x&&d.y===y))continue;
    const r=rnd(x,y,120);if(r<.045)plant(x,y,undefined,{});else if(r<.075)lamp(x,y)}
  /* focal points: every fifteen to twenty cells of open ground a small composition, so that no stretch is bare */
  {const flat3=(x,y)=>{const h0=getH(x,y);for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const xx=x+i,yy=y+j;if(!isOpen(xx,yy)||B.kind[I(xx,yy)]===1||Math.abs(getH(xx,yy)-h0)>.02||B.decor.some(d=>d.x===xx&&d.y===yy))return false}return true};
   const FK=['hgt_obelisk','hgt_fountain','hgt_willow','hgt_fairytree','hgtb_shrine','hgt_giantcap','hgt_cupola'];let n=0;
   for(let gy=10;gy<H-8;gy+=17)for(let gx=10;gx<W-8;gx+=17){let c=null;for(let r=0;r<8&&!c;r++)for(let dy=-r;dy<=r&&!c;dy++)for(let dx=-r;dx<=r&&!c;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=gx+dx,y=gy+dy;if(x>3&&y>3&&x<W-4&&y<H-4&&reach2[I(x,y)]&&flat3(x,y))c=[x,y]}
     if(!c)continue;const k=FK[(rnd(gx,gy,170)*FK.length)|0];if(k==='hgt_cupola'){dec('hgt_obelisk',c[0],c[1],{block:true,sc:1.2})}else dec(k,c[0],c[1],{block:true,sc:1+rnd(gx,gy,171)*.5});
     for(const [dx,dy] of [[-1,-1],[1,1]])plant(c[0]+dx,c[1]+dy);lamp(c[0]+1,c[1]-1,{});light(c[0],c[1]);bench(c[0]-1,c[1]+1);n++}
   info.focal=n}
  /* ================= life: tenders, sweepers, readers, fishers, walkers and pets ================= */
  const AG=[];U.AG=AG;
  const cellNear=(x,y)=>nearOpen(x,y,reach2);
  const A=o=>{const c=cellNear(o.hx,o.hy);if(!c)return null;o.home={x:c[0],y:c[1]};
    if(o.spotsN)o.spots=o.spotsN.map(p=>cellNear(p[0],p[1])).filter(Boolean).map(q=>({x:q[0],y:q[1]}));
    if(o.routeN)o.route=o.routeN.map(p=>{const q=cellNear(p[0],p[1]);return q&&{x:q[0],y:q[1],wait:p[2]||1}}).filter(Boolean);
    delete o.hx;delete o.hy;delete o.spotsN;delete o.routeN;AG.push(o);return o};
  const npcA=(sprite,task,name,hx,hy,spotsN,lines,extra)=>A(Object.assign({kind:'npc',sprite,task,name,hx,hy,spotsN,lines,speed:.7,zone:9},extra||{}));
  npcA('hgtb_sweep','clean','Sweeper',spots.market.x,spots.market.y+4,[[spots.market.x-5,spots.market.y+4],[spots.market.x+5,spots.market.y+4],[spots.market.x,spots.market.y-4]],['The market is swept at dusk.']);
  npcA('hgtb_sweep','clean','Sweeper',100,6,[[95,6],[104,6],[110,6]],['The tank glass is wiped every day.']);
  npcA('hgtb_plantbed','tend','Gardener',75,10,[[68,6],[82,6],[75,9]],['The gate beds are replanted each season.']);
  npcA('hgtb_sweep','clean','Sweeper',75,76,[[68,70],[82,70],[75,80],[62,74]],['I sweep the court every morning.','The dust comes from the houses.']);
  npcA('hgtb_sweep','clean','Sweeper',75,119,[[70,121],[80,121],[75,129]],['The plaza is swept once a day.']);
  npcA('hgtb_sweep','clean','Sweeper',75,20,[[70,22],[80,22],[75,26]],['I start at the gate and sweep down.']);
  npcA('hgtb_polish','clean','Lamp polisher',69,40,[[69,44],[69,36],[81,40]],['Each lamp is polished by hand.']);
  npcA('hgtb_polish','clean','Lamp polisher',75,108,[[69,100],[81,100],[75,112]],['The glass clouds over in the damp.']);
  npcA('hgtb_water','tend','Gardener',70,122,[[68,121],[72,121],[78,121],[82,121]],['The shellflowers need water twice a day.']);
  npcA('hgtb_plantbed','tend','Gardener',37,60,[[33,57],[41,57],[37,62]],['The beds round the market are mine.']);
  npcA('hgtb_plantbed','tend','Gardener',54,128,[[53,132],[57,125]],['The reeds by the pool are thinned each season.']);
  npcA('hgtb_read','read','Reader',96,7,[[96,7],[103,7]],['I read here because the tanks give light.']);
  npcA('hgtb_read','read','Reader',37,48,[[34,48],[40,48]],['This is a book of patterns.']);
  npcA('hgtb_fisher','fish','Fisher',39,132,[[39,132],[39,135]],['Nothing bites in the diving pool. I come here anyway.']);
  npcA('hgtb_fisher','fish','Fisher',112,132,[[112,131],[112,134]],['The bathing pool is shallow and warm.']);
  npcA('hgtb_watch','watch','Tank-watcher',99,6,[[95,6],[102,6],[109,6]],['The angelfish come to the glass at noon.']);
  npcA('hgtb_watch','watch','Watcher',75,121,[[75,121]],['I watch the fountain.']);
  npcA('hgtb_elder','sit','Elder',40,50,[[40,50]],['Sit if you like.']);
  npcA('hgtb_walk','walk','Walker',75,16,null,['I walk the cascade from the gate to the plaza.'],{routeN:[[75,14,2],[75,32,2],[70,44,1],[75,66,1],[80,80,1],[75,108,2],[75,118,3],[75,60,1]],speed:.9});
  npcA('hgtb_lantern','walk','Lantern-bearer',75,100,null,['I light the lamps along the cascade.'],{routeN:[[69,98,1],[69,110,1],[81,110,1],[81,98,1]],speed:.8});
  npcA('hgtb_jar','walk','Water-carrier',70,124,null,['The cistern is by the plaza.'],{routeN:[[64,121,2],[70,125,1],[80,125,1],[86,126,2],[75,132,1]],speed:.7});
  // neutral creatures: in maze centres, by the pools, on tower tops and balconies
  const pets=[['ulb_pinkbulb','Pink bulb',.45,'wander',0],['ulb_lilacmoth','Lilac moth',.75,'wander',.3],['ulb_lanternbeetle','Lantern beetle',.55,'sit',0],['ulb_pearlslug','Pearl slug',.4,'sit',0],['ulb_aquawhale','Aqua bulb-whale',1.5,'sit',0],['ulb_jadefinmoth','Jade fin-moth',.8,'wander',.35],['ulb_creamjelly','Cream jelly',.9,'wander',.4],['ulb_amberpup','Amber shell-puppy',.35,'wander',0],['ulb_pups','Shell-puppies',.4,'sit',0],['ulb_fishbeetle','Fish-beetle',.8,'wander',0],['ulb_spindleray','Spindle ray',.75,'wander',.25],['ulb_creammoth','Cream moth',.5,'sit',.2],['ulb_jadeeel','Jade lantern-eel',.6,'wander',.15],['ulb_peachwhale','Peach bulb-whale',1.9,'sit',0],['ulb_spindlespider','Spindle spider',.7,'wander',0],['ulb_fishfly','Fish-fly',.7,'wander',.4]];
  const PIC={ulb_pinkbulb:'hgtb_pinkbulb',ulb_lilacmoth:'hgtb_lilacmoth',ulb_lanternbeetle:'hgtb_lanternbeetle',ulb_pearlslug:'hgtb_pearlslug',ulb_aquawhale:'hgtb_aquawhale',ulb_jadefinmoth:'hgtb_jadefinmoth',ulb_creamjelly:'hgtb_creamjelly',ulb_amberpup:'hgtb_amberpup',ulb_pups:'hgtb_pups',ulb_fishbeetle:'hgtb_fishbeetle',ulb_spindleray:'hgtb_spindleray',ulb_creammoth:'hgtb_creammoth',ulb_jadeeel:'hgtb_jadeeel',ulb_peachwhale:'hgtb_peachwhale',ulb_spindlespider:'hgtb_spindlespider',ulb_fishfly:'hgtb_fishfly'};
  U.PETS=pets.map(p=>({key:p[0],name:p[1],h:p[2],mode:p[3],hover:p[4],sprite:PIC[p[0]]}));
  const pet=(k,hx,hy,zone)=>{const p=pets.find(q=>q[0]===k);if(!p)return;A({kind:'creature',species:k,name:p[1],hx,hy,mode:p[3],zone:zone||2})};
  (spots.mazes||[]).forEach((m,i)=>{if(m.m&&m.m.centre)pet(pets[(i*3+1)%pets.length][0],m.m.centre.x,m.m.centre.y,1)});
  pet('ulb_aquawhale',34,60,3);pet('ulb_pearlslug',70,6,2);pet('ulb_amberpup',80,8,3);pet('ulb_pinkbulb',spots.market.x+3,spots.market.y+3,3);pet('ulb_creammoth',spots.market.x-4,spots.market.y-3,3);pet('ulb_fishfly',GX,119,3);pet('ulb_peachwhale',64,134,3);pet('ulb_jadeeel',44,132,3);pet('ulb_jadeeel',104,132,3);pet('ulb_creamjelly',100,131,3);pet('ulb_pinkbulb',75,4,3);pet('ulb_pearlslug',96,7,2);
  pet('ulb_lilacmoth',cx+3,cy,2);pet('ulb_fishfly',cx-3,cy,2);pet('ulb_creammoth',neTower.plat[0][0],neTower.plat[0][1],1);pet('ulb_lanternbeetle',nwTower.end[0],nwTower.end[1],1);
  pet('ulb_spindleray',58,126,3);pet('ulb_amberpup',20,100,3);pet('ulb_pups',14,110,3);pet('ulb_fishbeetle',116,98,3);pet('ulb_spindlespider',130,100,3);pet('ulb_jadefinmoth',60,40,3);
  /* giant scenery moments, spawned when the level is entered (see the end of this file): a bulk giant sleeps on the Reed Market, peacocks roost on the tower tops */
  /* the tops of the towers: lamp, seat, plants, banner and a creature roost */
  {const top=(cells,n)=>{let i=0;for(const c of cells){if(!isOpen(c[0],c[1])||B.decor.some(d=>d.x===c[0]&&d.y===c[1]))continue;const r=i++%6;
      if(r===0)dec('hgtb_lamp_tall',c[0],c[1],{walk:true,deco:true,sc:1.1});else if(r===1)bench(c[0],c[1]);else if(r===2)dec('hgtb_plant_orbbush',c[0],c[1],{walk:true,deco:true,sc:1.2});else if(r===3)dec('hgtb_deco_banner',c[0],c[1],{walk:true,deco:true,sc:1.2,bob:.3});else if(r===4)plant(c[0],c[1],'hgtb_plant_glowshrooms');else dec('hgtb_deco_lanterns',c[0],c[1],{walk:true,deco:true,bob:.8,sc:.8});light(c[0],c[1])}};
   top(spire.plat.filter(c=>Math.hypot(c[0]-cx,c[1]-cy)>3.2));top(neTower.plat);top(shell1.plat);
   pet('ulb_creamjelly',spire.plat[2][0],spire.plat[2][1],1);pet('ulb_lilacmoth',shell1.plat[0][0],shell1.plat[0][1],1)}
  U.GIANTS=[{name:'hgtg_bulk_mound',x:spots.market.x+3,y:spots.market.y+2,yaw:.5,scale:.78},{name:'hgtg_peacock',x:neTower.plat[0][0],y:neTower.plat[0][1],yaw:2.2,scale:1.4},{name:'hgtg_peacock_white',x:seTower.end[0],y:seTower.end[1],yaw:.8,scale:1.4},{name:'hgtg_peacock_green',x:nwTower.end[0],y:nwTower.end[1],yaw:3.6,scale:1.3}];
  B.start={x:GX,y:3,f:2};
  return {B,rg,fm,wt,wk,wtop,wdoor,occ,info,terr,ws};
}

/* ---------- the helix: spiral stairs wound round a centre, up (rise>0) or down (rise<0). arms 2 is the double helix (two lanes interleaved, like the strands of a rope),
   arms 1 a single stair round a cone. A lane is lw cells either side of its centre line. The cells between lanes are walls: foot at the lower lane, a low rail above the higher. ---------- */
function hgtxulbHelix(B,o){
  const {cx,cy,R0,P,rc,rise,open,wall,wallH,rg,fm,I,tints}=o,h0=o.h,lw=o.lw||1.0,arms=o.arms||2,S=P/arms;
  const lane=new Map(),twoPi=Math.PI*2,arc=u=>twoPi*(R0*u-P*u*u/2),umax=(R0-rc)/P,rmax=R0+2.5;
  for(let j=Math.floor(cy-rmax);j<=Math.ceil(cy+rmax);j++)for(let i=Math.floor(cx-rmax);i<=Math.ceil(cx+rmax);i++){
    const dx=i-cx,dy=j-cy,r=Math.hypot(dx,dy);if(r>R0+lw+.05||r<rc-1)continue;
    let th=Math.atan2(dy,dx);if(th<0)th+=twoPi;
    const q=arms*th/twoPi,m=Math.round((R0-r)/S-q),rcm=R0-S*(m+q),u=(m+q)/arms;
    if(Math.abs(r-rcm)>lw||u<-.0001||u>umax)continue;
    lane.set(i+','+j,{i,j,m,u,arm:((m%arms)+arms)%arms,h:h0+rise*arc(Math.max(0,u)),side:r-rcm});
  }
  // thin lanes touch only at their corners: fill in a cell wherever two lane cells meet diagonally and share no neighbour
  for(const c of [...lane.values()]){for(const [dx,dy] of [[1,1],[1,-1],[-1,1],[-1,-1]]){const d=lane.get((c.i+dx)+','+(c.j+dy));if(!d||Math.abs(d.h-c.h)>.5)continue;
    if(lane.has((c.i+dx)+','+c.j)||lane.has(c.i+','+(c.j+dy)))continue;
    const a=[c.i+dx,c.j],b=[c.i,c.j+dy],pick=Math.hypot(a[0]-cx,a[1]-cy)>Math.hypot(b[0]-cx,b[1]-cy)?b:a;
    const r=Math.hypot(pick[0]-cx,pick[1]-cy);lane.set(pick[0]+','+pick[1],{i:pick[0],j:pick[1],m:c.m,u:c.u,arm:c.arm,h:(c.h+d.h)/2,side:c.side});void r}}
  for(const c of lane.values()){open(c.i,c.j,c.h,1);fm[I(c.i,c.j)]='1';o.occ[I(c.i,c.j)]=1;rg[I(c.i,c.j)]=0}
  const top=h0+rise*arc(umax);
  const plat=[];
  for(let j=Math.floor(cy-rc-2);j<=Math.ceil(cy+rc+2);j++)for(let i=Math.floor(cx-rc-2);i<=Math.ceil(cx+rc+2);i++){const r=Math.hypot(i-cx,j-cy);if(r<=rc-.2&&!lane.has(i+','+j)){open(i,j,top,2);fm[I(i,j)]='5';o.occ[I(i,j)]=1;plat.push([i,j])}}
  const nb4=[[1,0],[-1,0],[0,1],[0,-1]],nb8=nb4.concat([[1,1],[1,-1],[-1,1],[-1,-1]]);
  const gapWalls=[];
  for(let j=Math.floor(cy-rmax);j<=Math.ceil(cy+rmax);j++)for(let i=Math.floor(cx-rmax);i<=Math.ceil(cx+rmax);i++){
    const r=Math.hypot(i-cx,j-cy);if(r>R0+lw+.6||r<rc-.2||lane.has(i+','+j))continue;
    let lo=1e9,hi=-1e9,arm=0;
    for(const d of nb4){const c=lane.get((i+d[0])+','+(j+d[1]));if(c){if(c.h<lo)lo=c.h;if(c.h>hi){hi=c.h;arm=c.arm}}}
    if(hi<-1e8)for(const d of nb8){const c=lane.get((i+d[0])+','+(j+d[1]));if(c){if(c.h<lo)lo=c.h;if(c.h>hi){hi=c.h;arm=c.arm}}}
    if(hi<-1e8)continue;
    if(r>R0+lw+.05&&hi-lo<.3)continue;
    const wh=Math.abs(hi-lo)+.35,wl=Math.min(lo,hi),sp=o.wallSpec||'wdC';
    wallH(i,j,tints[arm%tints.length],sp,wh,wl);
    o.occ[I(i,j)]=1;gapWalls.push({i,j,lo,hi,arm});
  }
  const ch=typeof o.coreH==='function'?o.coreH(top):o.coreH,coreCells=[],isPlat=(a,b)=>plat.some(p=>p[0]===a&&p[1]===b),faceTo=(dx,dy)=>HGTL.DIRS.findIndex(d=>d[0]===dx&&d[1]===dy);
  if(o.core){const cr=o.coreR||2.3;for(let j=Math.floor(cy-cr-1);j<=Math.ceil(cy+cr+1);j++)for(let i=Math.floor(cx-cr-1);i<=Math.ceil(cx+cr+1);i++){const r=Math.hypot(i-cx,j-cy);
    if(r<=cr){wallH(i,j,'l','bbb',r<=1.2?ch[1]:ch[0],top);o.occ[I(i,j)]=1;coreCells.push([i,j])}}}
  // a door in the foot of the column of looms (coreDoor) or in a wall at the bottom of the pit (doorTo)
  let doorRec=null;
  const tryDoor=(cells,spec,tint,wh)=>{for(const c of cells){for(const d of HGTL.DIRS){if(isPlat(c[0]+d[0],c[1]+d[1])){const q=o.toInt(spec.id);o.door(c[0],c[1],faceTo(d[0],d[1]),tint,wh,spec.id,q.tx,q.ty,q.tf);doorRec={x:c[0],y:c[1],ax:c[0]+d[0],ay:c[1]+d[1],face:faceTo(d[0],d[1])};return true}}}return false};
  if(o.coreDoor)tryDoor(coreCells.filter(c=>Math.hypot(c[0]-cx,c[1]-cy)>1.3).sort((a,b)=>b[0]-a[0]),o.coreDoor,'l',ch[0]);
  if(o.doorTo)tryDoor(gapWalls.map(g=>[g.i,g.j]).sort((a,b)=>Math.hypot(a[0]-cx,a[1]-cy)-Math.hypot(b[0]-cx,b[1]-cy)),o.doorTo,o.doorTo.tint||'l',Math.abs(top-h0)+.6);
  // threads of light: a hanging light on the inside edge of the lanes, every third cell
  if(o.threads){let n=0;for(const c of lane.values()){if(c.side>-.4)continue;if(((c.i*5+c.j*3)%3)!==0)continue;o.dec('hgt_lightvine',c.i,c.j,{walk:true,deco:true,sc:1.1,bob:.15});if((n++)%2===0)o.light(c.i,c.j)}}
  return {lane,umax,top,plat,gapWalls,arc,door:doorRec};
}

/* ---------- the rooms: small shell-walled interiors (levels 4880 to 4899). Each is a flat level with the door back out in the middle of the bottom wall. ---------- */
const ROOMS={};
const R_=(id,name,tint,floor,fn,o)=>{ROOMS[id]=Object.assign({id,name,tint,floor,fn},o||{})};
/* the folk of Ulb who are not quest givers: plain things to say about the city */
const hgtxulbFolk=[ // [id, name, picture, lines]
 ['hgxulb_teeb','Weaver Teeb','hg_npc1',['The Loom Spire has two stairs. The pink one starts on the east side of the court and the aqua one on the west side. Both end at the same top.','The two stairs never meet on the way up. Nobody has found a reason for that.']],
 ['hgxulb_slon','Weaver Slon','hg_npc3',['I weave the reed ropes that hold the lamps. One rope takes two days.','Every lamp in the lower city hangs from a rope I made.']],
 ['hgxulb_wuubb','Stair-keeper Wuubb','hg_npc0',['The great cascade runs from the north gate down to the reed basin. The Loom Court is about half way down.','I sweep the treads every morning. The dust comes from the houses, not from the stairs.']],
 ['hgxulb_orp','Pit-warden Orp','hg_npc4',['The Warp Pit is the Loom Spire turned upside down. Its stairs go down, not up.','There is a door at the bottom of the pit, into the Warp Cellar. It is not locked.']],
 ['hgxulb_blem','Lookout Blem','hg_npc6',['From the top of the spire you can see the whole city, the basin to the south and the north gate.','The door at the foot of the column of looms leads to a room. Few people go up to see it.']],
 ['hgxulb_sloob','Reed-warden Sloob','hg_npc1',['The reed basin is the lowest place in Ulb. The reeds grow thickest at the south end.','Do not cut the reeds by the island. They are the thick ones, and they are counted.']],
 ['hgxulb_pluub','Dyer Pluub','hg_npc5',['Pink dye comes from shell dust. Aqua dye comes from pond algae. Lilac needs both.','Walls are painted with the same dyes as cloth. That is why the houses are these colours.']],
 ['hgxulb_guild','Guildmaster Hobb','hg_npc0',['The Weavers’ Guild keeps a loom going in the hall at all hours. The work is never finished, and that is intended.','Upstairs is the loft, where the finest cloth is made. Go up if you want to see it.']],
 ['hgxulb_archivist','Archivist Nilp','hg_npc6',['This is the Pattern Archive. Every pattern woven in Ulb has a drawing here.','The oldest pattern is a spiral. It is also the newest, because people keep weaving it.']],
 ['hgxulb_innkeeper','Innkeeper Gwoll','hg_npc5',['The inn is called The Last Thread. Beds are free for travellers who can understand me.','Soup is reed-root and kelp. It is the same every day.']],
 ['hgxulb_lantern','Lamp-maker Tuub','hg_npc3',['I make the lamps for the whole city. A lamp is a glass bulb, a reed cage and a light that does not go out.','The glow in the bulbs comes from the pond. I do not know why it glows.']],
 ['hgxulb_hermit','The Hermit','hg_npc0',['I sit at the top of the Dyers’ Tower because nobody else wants the stairs.','From here you can see the Loom Spire. It looks smaller than it is.']],
 ['hgxulb_cistern','Cistern-keeper Brop','hg_npc4',['The cistern collects water from the cascade. It is cold and it glows a little.','Fill a flask if you like. It tastes of pennies.']],
 ['hgxulb_hall','Reed-Hall Steward Mimm','hg_npc1',['The Reed Hall stands on the island in the basin. Feasts are held here on festival days.','The gallery upstairs looks over the whole hall. It is the best place to sit.']],
 ['hgxulb_cellar','Warp-minder Glip','hg_npc3',['The threads in this cellar are the warp for the whole city. Do not pull any.','The pools are shallow. They are only for the dye.']],
 ['hgxulb_child','Small Ploob','hg_npc3',['I ran up the whole pink stair without stopping. It took a long time.','The top of the spire has a door. I did not open it.']]
];
for(const [id,nm,img,chat] of hgtxulbFolk)hgNative(id,nm,img,chat,null,{sc:/child|Small/.test(nm)?.8:undefined});
hgMerchant('hgxulb_trader','Skeet, the reed trader','hg_npc5','Reeds, ropes, kelp and honey. Look as long as you like.');
function hgtxulbRoom(id){
  const sp=ROOMS[id];if(!sp)return null;
  if(!LEVELS[HGTXULB.ID]&&KH_LAZY[HGTXULB.ID])KH_LAZY[HGTXULB.ID]();
  const [W_,H_]=HGTXULB.INT[id],mid=W_>>1,rows=[],decor=[],lights=[],items=[],chars={},TL=sp.tint;
  const pat=STY[(id*5+3)%STY.length],pd=hgtaPic(pat)?pat:TT[TL][0];
  const wall=hgtaChar(hgtaWallTile(TT[TL][0],3,{base:pd,mid:pd,top:TT[TL][2]}));
  const wallW=hgtaChar(hgtaWallTile(TT[TL][0],3,{base:TT[TL][1],mid:pd,top:TT[TL][2]}));
  for(let y=0;y<H_;y++){let r='';for(let x=0;x<W_;x++)r+=(y===0||y===H_-1||x===0||x===W_-1)?(((y===0||y===H_-1)?x%3===1:y%3===1)?wallW:wall):'.';rows.push(r.split(''))}
  const lk=HGTXULB.LINKS&&HGTXULB.LINKS[id]||{x:75,y:3,f:2};
  const put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const raw=(k,x,y,o)=>decor.push(Object.assign({k,x,y,block:true},o||{}));
  const npc=(nid,img,x,y,o)=>decor.push(Object.assign({k:img,x,y,block:true,npc:nid,sc:1},o||{}));
  const light=(x,y)=>lights.push([x,y]);
  const chest=(x,y,k)=>decor.push({k:k||'hg_chestjelly',x,y,block:true});
  const drs=[];
  const door=(x,y,to,t)=>{const q=HGTXULB.INT[to],tx=q?(q[0]>>1):0,ty=q?q[1]-2:0;rows[y][x]=hgtaChar(hgtaDoorTile(TT[t||TL][3],TT[t||TL][0],3,{lvl:to,at:{x:tx,y:ty,f:0}}));drs.push({x,y,to})};
  // the way out
  rows[H_-1][mid]=sp.parent?hgtaChar(hgtaDoorTile(TT[TL][3],TT[TL][0],3,{lvl:sp.parent.id,at:sp.parent.at})):hgtaChar(hgtaDoorTile(TT[TL][3],TT[TL][0],3,{lvl:HGTXULB.ID,at:{x:lk.x,y:lk.y,f:lk.f}}));
  const ctx={W:W_,H:H_,mid,put,raw,npc,light,chest,door,decor,rows,items,
    back:(x,y,to,face)=>{rows[y][x]=hgtaChar(hgtaDoorTile(TT[TL][3],TT[TL][0],3,{lvl:to,at:{x:HGTXULB.INT[to][0]>>1,y:HGTXULB.INT[to][1]-2,f:0}}))},
    backAt:(x,y,to,at)=>{rows[y][x]=hgtaChar(hgtaDoorTile(TT[TL][3],TT[TL][0],3,{lvl:to,at}))}};
  sp.fn(ctx);
  {// layout: corner alcoves, a half wall, or a raised corner, by room
   const wl=(x,y)=>{if(x>0&&y>0&&x<W_-1&&y<H_-1&&rows[y][x]==='.'&&!decor.some(d=>d.x===x&&d.y===y)&&!(x===mid&&y>=H_-4))rows[y][x]=wall},v=id%4;
   if(v===0){for(const y of [1,2]){wl(3,y);wl(W_-4,y)}}                 // two alcoves in the back corners
   else if(v===1){for(let x=1;x<=3;x++)wl(x,H_-4);for(let y=H_-5;y<H_-4;y++)wl(3,y)}   // a nook behind a stub wall at the front left
   else if(v===2){for(let y=2;y<H_-3;y++)if(y!==(H_>>1))wl(W_-4,y)}          // a long partition with a gap, a side gallery
   else{for(let x=2;x<W_-2;x++)if(Math.abs(x-mid)>1)wl(x,H_-4)}}              // a screen across the room with a gap in the middle
  {const used=new Set(decor.map(d=>d.x+','+d.y));for(let k=1;k<=3;k++)used.add(mid+','+(H_-1-k));
   const free=(x,y)=>x>0&&y>0&&x<W_-1&&y<H_-1&&rows[y][x]==='.'&&!used.has(x+','+y),take=(x,y)=>used.add(x+','+y);
   const prop=(role,x,y,o)=>{if(!free(x,y))return false;take(x,y);put(role,x,y,o);return true};
   // lamps in the corners, hangings on three walls, a rug of cushions in the middle, plants, a lamp over the door
   const LK=['hgtb_lamp_short','hgtb_lamp_tall','hgtb_lamp_vine'];
   for(const [x,y] of [[1,1],[W_-2,1],[1,H_-3],[W_-2,H_-3]])if(free(x,y)){take(x,y);decor.push({k:LK[(id+x+y)%3],x,y,block:false,walk:true,deco:true,sc:1});lights.push([x,y])}
   for(let y=3;y<H_-3;y+=2){prop('tapestry',1,y);prop('tapestry',W_-2,y)}
   for(let x=3;x<W_-3;x+=3)prop('tapestry',x,1);
   const cy0=H_>>1;
   // the centrepiece of the room, one big painted piece in the middle
   {const CEN=HGTXULB.CENTRE[id]||HGTXULB.CENTRE_ALL[id%HGTXULB.CENTRE_ALL.length],ck=IMG[CEN]?CEN:'hgtb_furn_table_chairs';for(const [dx,dy] of [[0,-1],[0,0],[1,-1],[-1,-1],[0,-2]]){const x=mid+dx,y=cy0+dy;if(free(x,y)&&y<H_-4){take(x,y);decor.push({k:ck,x,y,block:true,sc:CEN.indexOf('stage')>0?1.3:1.4});lights.push([x,y]);break}}}
   for(const [x,y,k] of [[1,2,'hgt_bulbflower'],[W_-2,2,'hgt_shellflower'],[1,H_-4,'hgt_fern'],[W_-2,H_-4,'hgt_pearlbush']])if(free(x,y)){take(x,y);decor.push({k,x,y,block:false,walk:true,deco:true,sc:1.1})}
   // one surprise: a small creature, or a glowing fountain, by the room
   const sur=['hgtb_pinkbulb','hgtb_lilacmoth','hgtb_pearlslug','hgtb_creamjelly','hgtb_amberpup','hgtb_creammoth','hgtb_pups','hgtb_jadeeel'][id%8];
   for(const [x,y] of [[W_-3,H_-3],[2,H_-3],[W_-3,2]])if(free(x,y)){take(x,y);decor.push({k:sur,x,y,block:true,sc:1.1});lights.push([x,y]);break}
   lights.push([mid,cy0],[2,2],[W_-3,H_-3]);
   for(const d of decor)if(/lamp|brazier/.test(d.k)||d.k==='kh_int2_1'||d.k==='kh_int5_5')lights.push([d.x,d.y])}
  for(const r of rows)void r;
  Object.assign(chars,hgtaChars);
  const L={rows:rows.map(r=>r.join('')),chars,start:{x:mid,y:H_-2,f:0},enemies:[],items,decor,lights:sp.lights||lights,portals:[],day:0,amb:.58+((id*7)%5)*.05,floor:HGTXULB.floorFor(TL,id,sp.floor||'wood'),ceil:'beam',ceilH:3,name:sp.name,label:sp.name,
    diff:66,noTele:true,noExtras:true,mapNames:[{t:sp.name,x:mid,y:1,k:'place'}]};
  return L;
}
R_(4880,'Granny Murrp’s House','p','wood',({put,raw,npc,light})=>{put('hearth',4,1);put('potshelf',2,1);put('kitchenshelf',6,1);put('bed',1,3);put('cradle',1,5);put('table',6,4);put('chair',5,4);put('chair',7,4);put('loom',7,2);npc('hgn_murrp','hg_npc1',3,3);light(2,2);light(6,2);light(4,4)});
R_(4881,'The Weavers’ Guildhall','l','hgt_f5',({put,raw,npc,light,door})=>{for(const x of [2,4,8,10])put('loom',x,2);for(const x of [3,6,9])put('tapestry',x,1);put('table',2,5);put('chair',3,5);put('table',10,5);put('chair',9,5);put('rolledcarpets',11,3);put('rolledcarpets',1,3);npc('hgxulb_guild','hg_npc0',6,3);door(6,0,4882);for(const [x,y] of [[2,3],[6,2],[10,3],[4,6],[8,6]])light(x,y)});
R_(4882,'The Loom Loft','p','wood',({put,npc,light})=>{for(const x of [2,4,6])put('loom',x,2);put('rolledcarpets',1,4);put('cradle',7,4);put('tapestry',4,1);npc('hgxulb_slon','hg_npc3',3,4);light(2,3);light(6,3);light(4,5)},{parent:{id:4881,at:{x:6,y:1,f:2}}});
R_(4883,'Healer Neeb’s House','a','wood',({put,npc,light})=>{put('bed',1,2);put('bed',1,4);put('bed',7,2);put('bed',7,4);put('washstand',3,1);put('potshelf',5,1);put('cushions',6,5);npc('hgn_neeb','hg_npc6',4,3);light(2,3);light(6,3);light(4,5)});
R_(4884,'Elder Orrl’s Room','c','wood',({put,npc,light})=>{for(const x of [1,2,6,7])put('bookcase',x,1);put('tapestry',4,1);put('desk',4,2);put('chair',2,4);put('chair',6,4);put('brazier',1,5);put('brazier',7,5);npc('hgn_orrl','hg_npc0',3,3);light(2,3);light(6,3);light(4,5)});
R_(4885,'The Spindle Room','l','hgt_f5',({put,raw,npc,light,chest,items})=>{put('shrine',4,1);put('brazier',3,1);put('brazier',5,1);put('harp',1,3);put('birdcage',7,3);for(const [x,y] of [[2,5],[6,5],[2,3]])put('cushions',x,y);chest(1,1,'hg_chestjelly');chest(7,1,'hg_chestjelly');chest(1,6,'hg_chestwax');chest(7,6,'hg_chestweed');items.push({k:'hgjelly',x:4,y:3},{k:'hgcrystal',x:5,y:3});for(const [x,y] of [[2,2],[6,2],[4,4],[2,6],[6,6]])light(x,y)},{amb:.7});
R_(4886,'The Warp Cellar','a','hgt_f3',({put,raw,npc,light,door})=>{for(const [x,y] of [[2,2],[8,2],[2,5],[8,5]])put('basin',x,y);for(const [x,y] of [[1,1],[9,1],[1,7],[9,7]])put('amphora',x,y);put('rolledcarpets',5,1);put('rack',3,1);put('rack',7,1);npc('hgxulb_cellar','hg_npc3',5,3);door(9,0,4887);for(const [x,y] of [[2,3],[5,2],[8,3],[3,6],[7,6],[5,5]])light(x,y)});
R_(4887,'The Hidden Skein','l','hgt_f5',({put,chest,light,items})=>{chest(1,1,'hg_chestjelly');chest(5,1,'hg_chestwax');chest(1,3,'hg_chestweed');put('candle',3,1);put('cushions',4,3);items.push({k:'hgcrystal',x:3,y:3});light(2,2);light(4,2);light(3,4)},{parent:{id:4886,at:{x:9,y:1,f:2}},amb:.7});
R_(4888,'The Dyers’ House','p','hgt_f3',({put,npc,light})=>{for(const [x,y] of [[1,1],[3,1],[5,1],[7,1]])put('basin',x,y);put('rack',1,4);put('rack',7,4);put('amphora',1,5);put('amphora',7,5);put('tapestry',4,1);npc('hgxulb_pluub','hg_npc5',4,3);light(2,3);light(6,3);light(4,5)});
R_(4889,'The Reed-Cutter’s Hut','c','wood',({put,raw,npc,light})=>{put('bed',1,2);put('hearth',3,1);put('rack',5,1);raw('crate',5,3);raw('barrel',1,4);npc('hgn_bibb','hg_npc3',3,3,{sc:.8});light(2,2);light(4,3)});
R_(4890,'The Last Thread (inn)','p','wood',({put,raw,npc,light})=>{for(const x of [4,5,7,8])put('counter',x,3);for(const x of [3,4,8,9])put('shelf',x,1);put('hearth',6,1);for(const [x,y] of [[3,5],[9,5],[3,7],[9,7]]){put('table',x,y);put('chair',x-1,y);put('chair',x+1,y)}raw('barrel',1,2);raw('barrel',11,2);npc('hgxulb_innkeeper','hg_npc5',6,2);for(const [x,y] of [[3,2],[9,2],[6,5],[2,6],[10,6]])light(x,y)});
R_(4891,'The Reed Trader','a','wood',({put,raw,npc,light})=>{for(const x of [3,5])put('counter',x,3);for(const x of [1,2,3,5,6,7])put('shelf',x,1);put('amphora',1,5);put('amphora',7,5);put('chest',1,4);put('chest',7,4);raw('crate',7,3);raw('barrel',1,3);npc('hgxulb_trader','hg_npc5',4,2);light(2,2);light(6,2);light(4,4)});
R_(4892,'The Lamp-Maker’s Workshop','c','wood',({put,npc,light})=>{for(const x of [1,2,6,7])put('shelf',x,1);put('brazier',3,1);put('brazier',5,1);for(const [x,y] of [[1,4],[7,4],[1,5],[7,5]])put('floorlamp',x,y);put('hlamp',4,1);npc('hgxulb_lantern','hg_npc3',4,3);for(const [x,y] of [[2,3],[6,3],[2,5],[6,5],[4,4]])light(x,y)});
R_(4893,'The Pattern Archive','l','hgt_f5',({put,npc,light})=>{for(const x of [1,2,3,7,8,9])put('bookcase',x,1);for(const y of [3,4,5])put('bookcase',1,y),put('bookcase',9,y);put('desk',4,3);put('desk',6,3);put('chair',4,4);put('chair',6,4);npc('hgxulb_archivist','hg_npc6',5,2);for(const [x,y] of [[3,2],[7,2],[3,5],[7,5],[5,4]])light(x,y)});
R_(4894,'The Cistern House','a','hgt_f3',({put,npc,light})=>{for(const [x,y] of [[1,1],[3,1],[5,1],[7,1],[1,4],[7,4]])put('basin',x,y);put('amphora',1,5);put('amphora',7,5);npc('hgxulb_cistern','hg_npc4',4,3);light(2,3);light(6,3);light(4,5)});
R_(4895,'The Reed Hall','p','hgt_f5',({put,raw,npc,light,door})=>{put('throne',7,1);for(const x of [3,11])put('banner',x,1);for(const x of [5,9])put('banner',x,1);for(const [x,y] of [[4,4],[10,4],[4,7],[10,7]]){put('feast',x,y);put('bench',x-1,y);put('bench',x+1,y)}for(const [x,y] of [[2,2],[12,2],[2,8],[12,8]])put('brazier',x,y);npc('hgxulb_hall','hg_npc1',7,3);door(13,0,4896);for(const [x,y] of [[3,3],[11,3],[7,5],[3,7],[11,7],[7,8]])light(x,y)},{amb:.66});
R_(4896,'The Reed Hall Gallery','p','wood',({put,chest,light})=>{for(const x of [2,4,6])put('chair',x,2);put('harp',1,4);put('banner',7,1);chest(7,4,'hg_chestweed');light(2,3);light(6,3);light(4,5)},{parent:{id:4895,at:{x:13,y:1,f:2}}});
R_(4897,'The Spinners’ Sunken House','a','wood',({put,npc,light})=>{put('loom',2,2);put('loom',6,2);put('bed',1,4);put('hearth',4,1);put('cushions',7,4);npc('hgxulb_teeb','hg_npc1',4,3);light(2,3);light(6,3);light(4,5)});
R_(4898,'The Pedestal House','p','wood',({put,chest,light})=>{put('bed',1,2);put('harp',7,2);for(const [x,y] of [[2,4],[4,4],[6,4]])put('cushions',x,y);put('birdcage',4,1);chest(7,5,'hg_chestjelly');light(2,3);light(6,3);light(4,5)});
R_(4899,'The Hermit’s Cell','l','hgt_f5',({put,npc,light})=>{put('shrine',3,1);put('candle',2,1);put('candle',4,1);put('cushions',1,3);put('cushions',5,3);npc('hgxulb_hermit','hg_npc0',3,3);light(2,2);light(4,3)},{amb:.66});
/* chunk_post */
/* ---------- forty-five themed rooms (5083 to 5127): eighteen kinds of room, each id its own instance with its own tint, wall pattern, size and creature ---------- */
const hgtxulbThemes=[
 ['A Weaving Hall','l','hgt_f5',(c,k)=>{const {put,W,H,npc}=c;for(let x=2;x<W-2;x+=2)put('loom',x,2);for(let x=3;x<W-3;x+=3)put('chair',x,4);put('table',W-3,H-4);put('rolledcarpets',1,H>>1)}],
 ['A Spindle Workshop','p','wood',(c)=>{const {put,W,H}=c;for(let x=1;x<W-1;x+=2)put('rack',x,1);put('table',3,3);put('table',W-4,3);put('chair',3,4);put('chair',W-4,4);put('loom',W-2,H-4)}],
 ['A Reed Storehouse','c','wood',(c)=>{const {put,raw,W,H}=c;for(let y=1;y<H-3;y+=2){raw('crate',1,y);raw('barrel',W-2,y)}for(let x=3;x<W-3;x+=2)put('rolledcarpets',x,1);put('amphora',3,H-4)}],
 ['A Dye House','a','hgt_f3',(c)=>{const {put,W,H}=c;for(let x=1;x<W-1;x+=2)put('basin',x,1);put('rack',1,3);put('rack',W-2,3);put('amphora',1,H-4);put('amphora',W-2,H-4);put('tapestry',W>>1,2)}],
 ['A Tapestry Gallery','l','hgt_f5',(c)=>{const {put,W,H}=c;for(let x=1;x<W-1;x++)put('tapestry',x,1);for(let y=2;y<H-3;y+=2){put('tapestry',1,y);put('tapestry',W-2,y)}put('statue',W>>1,3);put('bench',3,H-4);put('bench',W-4,H-4)}],
 ['A Thread Library','l','hgt_f5',(c)=>{const {put,W,H}=c;for(let x=1;x<W-1;x++)put('bookcase',x,1);for(let y=2;y<H-3;y+=1){put('bookcase',1,y);put('bookcase',W-2,y)}put('desk',3,3);put('chair',3,4);put('desk',W-4,3);put('chair',W-4,4)}],
 ['An Apothecary of Glowing Herbs','a','wood',(c)=>{const {put,decor,light,W,H}=c;for(let x=1;x<W-1;x+=2)put('potshelf',x,1);put('basin',2,H-4);put('basin',W-3,H-4);put('table',W>>1,3);for(const [x,y] of [[2,3],[W-3,3],[2,H-5],[W-3,H-5]]){decor.push({k:'hgt_lightvine',x,y,block:false,walk:true,deco:true,sc:1.2});light(x,y)}decor.push({k:'hgt_mushrooms',x:W>>1,y:4,block:false,walk:true,deco:true,sc:1.3})}],
 ['A Bedroom','p','wood',(c)=>{const {put,W,H}=c;put('bed',1,2);put('bed',W-2,2);put('cradle',1,H-4);put('wardrobe',W-2,H-4);put('dresser',W>>1,1);put('harp',W-2,H>>1)}],
 ['A Kitchen','c','wood',(c)=>{const {put,W,H}=c;put('hearth',W>>1,1);put('oven',2,1);put('oven',W-3,1);for(let x=1;x<W-1;x+=2)put('kitchenshelf',x,2);put('table',3,H-4);put('chair',2,H-4);put('chair',4,H-4);put('table',W-4,H-4);put('chair',W-5,H-4)}],
 ['A Clock Room','a','hgt_f5',(c)=>{const {put,W,H}=c;put('statue',W>>1,1);put('birdcage',2,2);put('birdcage',W-3,2);put('obelisk',2,H-4);put('obelisk',W-3,H-4);put('hlamp',W>>1,3);put('table',W>>1,H-4)}],
 ['A Reed-Boat Shed','c','wood',(c)=>{const {put,W,H}=c;put('ship',2,2);put('ship',W-3,2);put('sail',1,H>>1);put('sail',W-2,H>>1);put('rope',3,H-4);put('anchor',W-4,H-4);put('wheel',W>>1,2)}],
 ['A Sunken Bath','a','hgt_f3',(c)=>{const {put,W,H}=c;put('basin',2,2);put('basin',W-3,2);put('basin',2,H-4);put('basin',W-3,H-4);put('fountain',W>>1,2);put('cushions',W>>1,H-4);put('amphora',1,H>>1);put('amphora',W-2,H>>1)}],
 ['A Pearl Archive','p','hgt_f5',(c)=>{const {put,W,H}=c;put('shrine',W>>1,1);for(let x=1;x<W-1;x+=2)put('bookcase',x,2);put('vase0',2,H-4);put('vase1',W-3,H-4);put('vase2',W>>1,H-5);put('candle',3,H-4);put('candle',W-4,H-4)}],
 ['A Lamp Cellar','c','hgt_f3',(c)=>{const {put,W,H}=c;for(let x=1;x<W-1;x+=2){put('floorlamp',x,1);put('floorlamp',x,H-4)}put('table',W>>1,3);put('brazier',2,H>>1);put('brazier',W-3,H>>1)}],
 ['A Music Room','l','wood',(c)=>{const {put,W,H}=c;put('harp',2,2);put('harp',W-3,2);for(let x=2;x<W-2;x+=2)put('chair',x,4);put('cushions',W>>1,2);put('tapestry',W>>1,1);put('birdcage',1,H-4)}],
 ['A Map Room','p','wood',(c)=>{const {put,W,H}=c;put('maptable',W>>1,3);put('mapstand',2,2);put('mapstand',W-3,2);put('chair',W>>1,4);for(let x=1;x<W-1;x+=2)put('tapestry',x,1);put('bookcase',1,H-4);put('bookcase',W-2,H-4)}],
 ['A Pet Room','a','wood',(c)=>{const {put,raw,W,H}=c;put('cradle',1,2);put('cradle',3,2);put('cradle',W-2,2);raw('crate',W-2,H-4);put('cushions',2,H-4);put('cushions',W-3,H-4);put('table',W>>1,3)}],
 ['A Sleeping Hall','l','wood',(c)=>{const {put,W,H}=c;for(let y=2;y<H-3;y+=2){put('bed',1,y);put('bed',W-2,y)}put('hearth',W>>1,1);put('brazier',W>>1,H-4)}]
];
for(let k=0;k<45;k++){const id=5083+k,t=hgtxulbThemes[k%hgtxulbThemes.length],w=9+((k*5)%3)*2,hh=7+((k*7)%3);
  HGTXULB.INT[id]=[w,hh];const nm=t[0]+(k>=18?' ('+(((k/18)|0)+1)+')':'');LEVEL_NAMES[id]=nm;
  R_(id,nm,'pacl'[(k+((k/18)|0))%4],t[2],c=>{t[3](c,k);if(k%5===0)c.door(w-3,0,5128+((k/5)|0))},{amb:.78})}
for(let q=0;q<9;q++){const cid=5128+q,k=q*5,w=9+((k*5)%3)*2;HGTXULB.INT[cid]=[7,6];LEVEL_NAMES[cid]='A Back Room';
  R_(cid,'A Back Room','pacl'[(q+2)%4],'wood',c=>{const {put,chest,W,H}=c;put('bed',1,1);put('cradle',W-2,1);chest(W-2,H-3,'hg_chestweed');put('harp',1,H-3)},{parent:{id:5083+k,at:{x:w-3,y:1,f:2}},amb:.7})}
/* ---------- phase 5 rooms: the indoor maze (5080), the tank room (5081) and the drowned loom hall (5082, reached by diving) ---------- */
LEVEL_NAMES[5080]='The Indoor Maze';LEVEL_NAMES[5081]='The Tank Room';LEVEL_NAMES[5082]='The Drowned Loom Hall';
const hgtxulbEnsureCity=()=>{if(!LEVELS[HGTXULB.ID]&&KH_LAZY[HGTXULB.ID])KH_LAZY[HGTXULB.ID]();return HGTXULB.LINKS||{}};
hgtRegister(5080,id=>{const lk=hgtxulbEnsureCity()[5080]||{x:75,y:3,f:2};const L=hgtzIndoorLevel(id,{w:31,h:31,seed:5080,back:{lvl:HGTXULB.ID,at:{x:lk.x,y:lk.y,f:lk.f}}});L.name=L.label='The Indoor Maze';return L});
hgtRegister(5081,id=>{
  const lk=hgtxulbEnsureCity()[5081]||{x:75,y:3,f:2},W_=23,H_=13,B=hgtlNew(W_,H_,5081),body=hgtkTile('body',3.5).ch,back=hgtaDoorTile('hgt_d1','hgt_wa',3.5,{lvl:HGTXULB.ID,at:{x:lk.x,y:lk.y,f:lk.f}}),DCH=hgtaChar(back);
  hgtlBlock(B,0,0,W_,H_,body,0);hgtlFill(B,3,3,17,9,0,0);
  hgtkTank(B,1,0,9,3,{type:'wall',face:'S',theme:'reef',seed:61});hgtkTank(B,13,0,9,3,{type:'wall',face:'S',theme:'lagoon',seed:62});
  hgtkTank(B,0,4,3,7,{type:'wall',face:'E',theme:'violet',seed:63});hgtkTank(B,20,4,3,7,{type:'wall',face:'W',theme:'deep',seed:64});
  hgtkTank(B,10,6,3,3,{type:'round',theme:'reef',seed:65,z1:3.0});
  hgtlWall(B,11,12,DCH,0);
  for(const [x,y] of [[4,11],[18,11],[4,3],[18,3]])hgtlDecor(B,'hg_lamp',x,y,{walk:true,deco:true});
  for(const [k,x,y] of [['hgtb_pearlslug',6,8],['hgtb_creammoth',16,8],['hgtb_amberpup',5,5]])hgtlDecor(B,k,x,y,{block:true});
  const lv=hgtlAssemble(B,{name:'The Tank Room',label:'The Tank Room',start:{x:11,y:11,f:0},ceilH:3.6,diff:66,extra:{floor:'wood',amb:.2,noExtras:true,scenery:[]}});
  delete lv.terrace;delete lv.outdoor;lv.chars=Object.assign({},lv.chars,{[DCH]:back});lv.hgtkOn=true;lv.lights=[[11,11],[6,6],[16,6]];
  return lv});
hgtRegister(5082,id=>{
  hgtxulbEnsureCity();const W_=13,Hh=9,wall=hgtaWallTile('hgt_wa',3,{top:'hgt_wb1'}),back=hgtaDoorTile('hgt_d1','hgt_wa',3,{lvl:HGTXULB.ID,at:{x:39,y:132,f:1}}),g=[];
  for(let y=0;y<Hh;y++)g.push(new Array(W_).fill('#'));
  for(let y=1;y<Hh-1;y++)for(let x=1;x<W_-1;x++)g[y][x]='.';
  g[0][6]='d';const cw=hgtaChar(wall),cd=hgtaChar(back);
  const decor=[];for(const [k,x,y,sc,bb] of [['kh_int4_2',3,3,1.6],['kh_int4_2',9,3,1.6],['kh_int4_3',6,2,1.5],['hgt_reeds',2,6],['hgt_reeds',10,6],['hgt_crystalgrass',4,6],['hgt_crystalgrass',8,6],['hgtb_tank_seagrass',3,5],['hgtb_tank_kelp',9,5],['hgtb_fish_angel',5,4,1,.5],['hgtb_fish_neon',8,4,1,.6],['hgtb_creamjelly',6,5,1,.4]]){if(k.startsWith('kh_'))NPC_H[k]=1;decor.push({k,x,y,block:false,walk:true,deco:true,sc:sc||1,bob:bb||0})}
  HGTE.wetLook(5082);UWS[5082]={vents:[[6,6]],swim:[]};
  return {rows:g.map(r=>r.join('').replace(/#/g,cw).replace(/d/g,cd)),chars:{[cw]:wall,[cd]:back},start:{x:6,y:2,f:2},enemies:[],items:[],decor,lights:[[3,4],[9,4],[6,6]],portals:[],floor:'hgt_f3',day:0,amb:.5,ceilH:3,noTele:true,noExtras:true,name:'The Drowned Loom Hall',label:'The Drowned Loom Hall',mapNames:[]}});
/* the pets of Ulb, as creature species for the life system (hgt_life.js); the pictures are the painted hgtb_ creatures */
{const defs=[['ulb_pinkbulb','Pink bulb','hgtb_pinkbulb',.45,'wander',0,['It folds its legs and sits.','Its antennae turn toward you.']],['ulb_lilacmoth','Lilac moth','hgtb_lilacmoth',.75,'wander',.3,['It drifts a short way off.','Its fins fold flat.']],['ulb_lanternbeetle','Lantern beetle','hgtb_lanternbeetle',.55,'sit',0,['The sac on its back glows amber.','It does not move.']],['ulb_pearlslug','Pearl slug','hgtb_pearlslug',.4,'sit',0,['It is cool and smooth.','It leaves a faint shine on the floor.']],['ulb_aquawhale','Aqua bulb-whale','hgtb_aquawhale',1.5,'sit',0,['It is large, warm and harmless.','It sighs through its wide mouth.']],['ulb_jadefinmoth','Jade fin-moth','hgtb_jadefinmoth',.8,'wander',.35,['It circles once and settles.']],['ulb_creamjelly','Cream jelly','hgtb_creamjelly',.9,'wander',.4,['Small lights move inside it.','It drifts above the floor.']],['ulb_amberpup','Amber shell-puppy','hgtb_amberpup',.35,'wander',0,['It sniffs your boots.','It trots off a few steps.']],['ulb_pups','Shell-puppies','hgtb_pups',.4,'sit',0,['The two of them sleep against each other.']],['ulb_fishbeetle','Fish-beetle','hgtb_fishbeetle',.8,'wander',0,['Its whiskers twitch.','It looks at you and goes on chewing.']],['ulb_spindleray','Spindle ray','hgtb_spindleray',.75,'wander',.25,['It glides a little way and stops.']],['ulb_creammoth','Cream moth','hgtb_creammoth',.5,'sit',.2,['It sits with its wings open.']],['ulb_jadeeel','Jade lantern-eel','hgtb_jadeeel',.6,'wander',.15,['The lantern at the end of its tail blinks.']],['ulb_peachwhale','Peach bulb-whale','hgtb_peachwhale',1.9,'sit',0,['It is very large and very still.','It breathes slowly.']],['ulb_spindlespider','Spindle spider','hgtb_spindlespider',.7,'wander',0,['It steps over your foot.']],['ulb_fishfly','Fish-fly','hgtb_fishfly',.7,'wander',.4,['Its wings are pink and aqua.']]];
 for(const [k,n,pic,h,mode,hover,lines] of defs)hgtlfSpecies(k,{name:n,sprites:[pic],h,mode,hover,speed:mode==='sit'?.22:.4,flee:mode==='wander'?1:0,where:['any'],cities:['ulb'],lines});}
/* the giants of Ulb: a bulk giant sleeps on the Reed Market and peacocks roost on the tower tops */
{const _g=hgtgOnEnter;hgtgOnEnter=function(id){const r=_g.apply(this,arguments);if(id===HGTXULB.ID&&!HGTXULB._giants&&HGTXULB.GIANTS&&!HGTG.off){HGTXULB._giants=1;for(const g of HGTXULB.GIANTS){try{hgtgSpawn(g.name,{x:g.x+.5,y:g.y+.5,yaw:g.yaw,scale:g.scale,level:HGTXULB.ID})}catch(e){console.error('ulb giant',e)}}}return r}}
/* ---------- finishing: pictures for every designed wall ---------- */
function finish(S){
  const {B,wt,wk,wtop,wdoor,ws}=S,W=B.W,H=B.H,h=B.h,rows=B.rows,dirs=HGTL.DIRS,rmap=new Map();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const ch=rows[y][x];if(ch==='.')continue;const i=y*W+x;
    if(wk[i]){let foot=h[i];
      for(const d of dirs){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=W||ny>=H||rows[ny][nx]!=='.')continue;const nh=h[ny*W+nx];if(nh<foot)foot=nh}
      const top=wtop[i],dd=wdoor.get(i);let wh=top-foot;if(wh<.5)wh=.5;h[i]=foot;
      rows[y][x]=dd?doorCh(TINTS[wt[i]],wh,dd.lvl,dd.at,(x*7+y*13+(x>>2))&255):wallCh(TINTS[wt[i]],KINDS[wk[i]-1],wh,ws[i])}
    else if(HGTL_ROLE[ch]!==undefined){ // a library placeholder (tubes, stairs to nowhere): the painted tile for its role
      let c=rmap.get(ch);if(!c){c=hgtaChar(hgte2Gid(ch));rmap.set(ch,c)}rows[y][x]=c}
  }
}

/* ---------- registration ---------- */
{const _lf=lootFor;lootFor=function(d){const inHgt=typeof LEVEL==='number'&&LEVEL>=4880&&LEVEL<=4899&&d&&/^hg_(chest|waxbarrel|jar)/.test(d.k);if(inHgt){const s0=LEVEL;LEVEL=470;try{return _lf.apply(this,arguments)}finally{LEVEL=s0}}return _lf.apply(this,arguments)}} // hgtxulbLoot: chests in the rooms of Ulb hold the same things as the chests of the grassland
hgtRegister(HGTXULB.ID,function(id){
  const S=build(id),B=S.B;
  finish(S);
  U.DEV.B=B;
  {// the outside cell and facing of every door that opens onto a room are read back from the finished level, so that the way out of each room is always right
   const mine=new Set([...Object.keys(U.INT).map(Number),...U.RT.map(r=>r[0]),5080,5081]),found={};
   for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=B.rows[y][x];if(ch==='.')continue;const g=hgtaChars[ch],kd=g!==undefined?KH_DOOR[g]:undefined;if(!kd||!mine.has(kd.lvl)||kd.lvl===U.ID)continue;
     for(let q=0;q<4;q++){const nx=x+HGTL.DIRS[q][0],ny=y+HGTL.DIRS[q][1];if(nx>=0&&ny>=0&&nx<W&&ny<H&&B.rows[ny][nx]==='.'){found[kd.lvl]={x:nx,y:ny,f:q};break}}}
   for(const id in found){U.LINKS[id]=found[id];if(U.RT.some(r=>r[0]==id)&&typeof hgtrSetReturn==='function')hgtrSetReturn(+id,U.ID,found[id])}}
  const L=hgtlAssemble(B,{name:'Ulb',label:'Ulb',start:B.start});
  L.terrace=Object.assign(L.terrace||{h:B.h},{rg:S.rg,riser:hgtaWallTile('hgt_wc',1)});
  {const lib=L.terrace.lid;try{hgtzApplyLids(B,L)}catch(e){console.error('ulb lids',e)}if(lib){const mz=L.terrace.lid||new Float32Array(W*H);for(let i=0;i<mz.length;i++)if(lib[i]>mz[i])mz[i]=lib[i];L.terrace.lid=mz}}
  hgtlfRegister(HGTXULB.ID,{agents:U.AG||[]});
  L.fmap=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=S.fm[y*W+x];L.fmap.push(r)}
  L.floorSet=['hgtb_f_pearlbands','hgt_f4','hgtb_f_waves','hgtb_f_marble','hgtb_f_mossy','hgtb_f_mandala'];L.floor='hgtb_f_pearlbands';L.ceil='tomb';L.ceilH=3;L.amb=.9;L.noExtras=true;L.diff=66;
  L.chars=Object.assign({},hgtaChars);
  L.sky=U.SKY.slice();
  {const ORN=['hgt_cupola','hgt_chime','hgt_banner','hgt_chimney','hgt_gardenlantern','hgt_cupola','hgt_finial','hgt_balcony'],WW={hgt_finial:1.0,hgt_cupola:1.7,hgt_chimney:1.2,hgt_banner:1.3,hgt_chime:1.1,hgt_gardenlantern:1.0,hgt_balcony:1.6};
   for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=y*W+x;if(S.wk[i]===0||B.rows[y][x]==='.')continue;const top=S.wtop[i],z=top-B.h[i];if(z<3.2||rnd(x,y,93)>(z>6?.08:.015))continue;
     const k=ORN[(rnd(x,y,94)*ORN.length)|0],sc=.7+rnd(x,y,95)*1.3;L.sky.push({x:x+.5,y:y+.5,k,w:WW[k]*sc*(z>7?1.4:1),z:z+.3,big:0})}
   // a crown of banners and chimes on the column of looms
   for(const [dx,dy,k,z] of [[0,0,'hgt_cupola',10.2],[.4,.4,'hgt_chime',8.3],[-.5,-.2,'hgt_banner',9],[.6,-.4,'hgt_finial',11.4]])L.sky.push({x:cx0+.5+dx,y:cy0+.5+dy,k,w:k==='hgt_banner'?1.6:2,z,big:1})}
  return L;
});
for(const id in ROOMS){LEVEL_NAMES[id]=ROOMS[id].name;hgtRegister(+id,hgtxulbRoom)}
})();
