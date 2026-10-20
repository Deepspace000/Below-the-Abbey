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
HGTCITIES.ulb={level:HGTXULB.ID,key:'ulb',name:'Ulb',entry:{x:75,y:3,f:2},exitDoor:{x:75,y:1,face:0,to:470,at:{x:26,y:89,f:0}},exitDoorSouth:{x:75,y:148,face:2,to:470,at:{x:26,y:111,f:2}}};
LEVEL_NAMES[HGTXULB.ID]='Ulb';

(function(){
const U=HGTXULB,W=U.W,H=U.H,Q=U.Q,PAD=U.PAD;
const qz=(v,q)=>Math.round(v/q)*q;
const rnd=(a,b,k)=>hash2(a,b,4820+(k|0));
const TINTS='pacl',KINDS=['plain','win','wing','band','loom','plainwin','tall'];

/* ---------- wall styles: four pastel tints, each with a plain picture, a window picture and a band picture ---------- */
const TT={p:['hgt_wp','hgt_ww0','hgt_wb0','hgt_d0'],a:['hgt_wa','hgt_ww1','hgt_wb1','hgt_d1'],c:['hgt_wc','hgt_ww3','hgt_wb2','hgt_d3'],l:['hgt_wl','hgt_ww2','hgt_wb3','hgt_d2']};
const wq=wh=>Math.max(.25,Math.ceil(wh*4-1e-6)/4); // wall heights come in quarters of a cell
function wallCh(t,kind,wh){const [pl,wi,ba]=TT[t];wh=wq(wh);
  const o=kind==='win'?{base:wi,top:ba}:kind==='wing'?{base:pl,mid:wi,top:ba}:kind==='tall'?{base:pl,mid:wi,top:ba}:kind==='band'?{top:ba}:kind==='loom'?{base:pl,mid:ba,top:ba}:kind==='plainwin'?{base:wi}:{};
  return hgtaChar(hgtaWallTile(pl,wh,o))}
function doorCh(t,wh,lvl,at){const [pl,,,dr]=TT[t];return hgtaChar(hgtaDoorTile(dr,pl,wq(wh),lvl===undefined||lvl===null?null:{lvl,at}))}
/* a stack of risers for the cliff faces: band over window, repeating every two cells of height */
function riserGid(t,kind){const [pl,wi,ba]=TT[t];return hgtaWallTile(pl,kind==='win'?2:1,kind==='win'?{base:wi,top:ba}:{})}

/* ---------- the builder ---------- */
function build(id){
  const B=hgtlNew(W,H,482),I=(x,y)=>y*W+x,ok=(x,y)=>x>=0&&y>=0&&x<W&&y<H,h=B.h,rows=B.rows;
  const wt=new Uint8Array(W*H),wk=new Uint8Array(W*H),wtop=new Float32Array(W*H),wdoor=new Map(),rg=new Int32Array(W*H),fm=new Array(W*H).fill('0'),occ=new Uint8Array(W*H);
  const getH=(x,y)=>ok(x,y)?h[I(x,y)]:0,isOpen=(x,y)=>ok(x,y)&&rows[y][x]==='.';
  const open=(x,y,hh,k)=>{if(!ok(x,y))return;rows[y][x]='.';if(hh!==undefined)h[I(x,y)]=hh;B.kind[I(x,y)]=k|0;wk[I(x,y)]=0};
  /* a wall cell: design only (tint t, kind, top = absolute top height); its picture is chosen at the end */
  const wall=(x,y,t,kind,top,foot)=>{if(!ok(x,y))return;const i=I(x,y);rows[y][x]='#';if(foot!==undefined)h[i]=foot;wt[i]=TINTS.indexOf(t);wk[i]=KINDS.indexOf(kind)+1;wtop[i]=top;B.kind[i]=0};
  const wallH=(x,y,t,kind,wh,foot)=>wall(x,y,t,kind,(foot!==undefined?foot:getH(x,y))+wh,foot);
  const door=(x,y,face,t,wh,to,tx,ty,tf)=>{const i=I(x,y),d=HGTL.DIRS[face&3];wall(x,y,t,'plain',getH(x,y)+wh);wdoor.set(i,{face:face&3,lvl:to,at:to?{x:tx,y:ty,f:tf}:null,wh});B.doors.push({x,y,face:face&3,ax:x+d[0],ay:y+d[1],to:to||null})};
  const dec=(k,x,y,o)=>{B.decor.push(Object.assign({k,x,y,block:false},o||{}))};
  const lamp=(x,y,o)=>{if(!isOpen(x,y))return;dec('hgt_lamppost',x,y,Object.assign({walk:true,deco:true},o||{}));B.lights.push([x,y])};
  const light=(x,y)=>B.lights.push([x,y]);
  const GX=U.GX,SP=U.SP;
  const info=U.DEV.info={doors:[],towers:[],features:[]};
  /* --- the natural hillside --- */
  const avenueY=y=>y<=10?9.6:y<=42?9.6-(y-10)*(9.6-PAD)/32:y<=78?PAD:y<=108?PAD-(y-78)*(PAD+1.4)/30:y<=116?-1.4-(y-108)*1.1/8:-2.5;
  const natural=(x,y)=>{
    let g=9.6-.09*Math.max(0,y-12);
    g+=.055*Math.max(0,Math.abs(x-GX)-34);
    const rr=Math.hypot((x-GX)*.5,y-134),bowl=-2.5+.14*Math.max(0,rr-12); // the reed basin: a wide bowl in the south, ringed by terraces
    return Math.max(-2.5,Math.min(g,bowl))};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)h[I(x,y)]=qz(natural(x,y),Q);
  const terr=new Float32Array(h); // the plain hillside, kept for later reference
  /* --- the great cascade: a stair 17 wide down the middle of the city, in treads two rows deep --- */
  for(let y=2;y<H-2;y++){const a=avenueY(y<=10?y:y<=116?Math.floor(y/2)*2:y);for(let x=GX-8;x<=GX+8;x++){open(x,y,a,1);fm[I(x,y)]='1';occ[I(x,y)]=1}}
  /* --- the Loom Court: a round court at the end of the north cascade --- */
  const cx=SP.x,cy=SP.y,CR=22;
  for(let y=cy-CR-1;y<=cy+CR+1;y++)for(let x=cx-CR-1;x<=cx+CR+1;x++)if(Math.hypot(x-cx,y-cy)<=CR+.5){open(x,y,PAD,5);fm[I(x,y)]='5';occ[I(x,y)]=1}
  /* --- THE LOOM SPIRE, and its counterpart the Warp Pit --- */
  const helix=o=>hgtxulbHelix(B,Object.assign({open,wall,wallH,dec,light,rg,fm,occ,I,ok,isOpen,getH,h:PAD},o));
  const spire=helix({cx:SP.x,cy:SP.y,R0:SP.R0,P:SP.P,rc:SP.rc,rise:SP.rise,lw:1.0,tints:['p','a'],core:true});
  U.DEV.spire=spire;
  B.start={x:GX,y:3,f:2};
  return {B,rg,fm,wt,wk,wtop,wdoor,occ,info,terr};
}

/* ---------- the helix: a double-spiral stair wound round a centre, up (rise>0) or down (rise<0) ---------- */
function hgtxulbHelix(B,o){
  const {cx,cy,R0,P,rc,rise,open,wall,wallH,rg,fm,I,tints}=o,h0=o.h,lw=o.lw||1.0;
  const lane=new Map(),twoPi=Math.PI*2,arc=u=>twoPi*(R0*u-P*u*u/2),umax=(R0-rc)/P,rmax=R0+2.5;
  for(let j=Math.floor(cy-rmax);j<=Math.ceil(cy+rmax);j++)for(let i=Math.floor(cx-rmax);i<=Math.ceil(cx+rmax);i++){
    const dx=i-cx,dy=j-cy,r=Math.hypot(dx,dy);if(r>R0+lw+.05||r<rc-1)continue;
    let th=Math.atan2(dy,dx);if(th<0)th+=twoPi;
    const m=Math.round((R0-r)/(P/2)-th/Math.PI),rcm=R0-(P/2)*(m+th/Math.PI),u=(m+th/Math.PI)/2;
    if(Math.abs(r-rcm)>lw||u<-.0001||u>umax)continue;
    lane.set(i+','+j,{i,j,m,u,arm:((m%2)+2)%2,h:h0+rise*arc(Math.max(0,u))});
  }
  for(const c of lane.values()){open(c.i,c.j,c.h,1);fm[I(c.i,c.j)]='1';o.occ[I(c.i,c.j)]=1;rg[I(c.i,c.j)]=0}
  const top=h0+rise*arc(umax);
  for(let j=Math.floor(cy-rc-2);j<=Math.ceil(cy+rc+2);j++)for(let i=Math.floor(cx-rc-2);i<=Math.ceil(cx+rc+2);i++){const r=Math.hypot(i-cx,j-cy);if(r<=rc-.2&&!lane.has(i+','+j)){open(i,j,top,2);fm[I(i,j)]='5';o.occ[I(i,j)]=1}}
  const nb4=[[1,0],[-1,0],[0,1],[0,-1]],nb8=nb4.concat([[1,1],[1,-1],[-1,1],[-1,-1]]);
  for(let j=Math.floor(cy-rmax);j<=Math.ceil(cy+rmax);j++)for(let i=Math.floor(cx-rmax);i<=Math.ceil(cx+rmax);i++){
    const r=Math.hypot(i-cx,j-cy);if(r>R0+lw+.6||r<rc-.2||lane.has(i+','+j))continue;
    let lo=1e9,hi=-1e9,arm=0;
    for(const d of nb4){const c=lane.get((i+d[0])+','+(j+d[1]));if(c){if(c.h<lo)lo=c.h;if(c.h>hi){hi=c.h;arm=c.arm}}}
    if(hi<-1e8)for(const d of nb8){const c=lane.get((i+d[0])+','+(j+d[1]));if(c){if(c.h<lo)lo=c.h;if(c.h>hi){hi=c.h;arm=c.arm}}}
    if(hi<-1e8)continue;
    if(r>R0+lw+.05&&hi-lo<.3)continue;
    const wh=Math.abs(hi-lo)+.35,wl=Math.min(lo,hi);
    wallH(i,j,tints[arm],wh>3?'wing':'plain',wh,wl);
    o.occ[I(i,j)]=1;
  }
  if(o.core){for(let j=Math.floor(cy-3);j<=Math.ceil(cy+3);j++)for(let i=Math.floor(cx-3);i<=Math.ceil(cx+3);i++){const r=Math.hypot(i-cx,j-cy);
    if(r<=2.3){wallH(i,j,'l','loom',r<=1.2?14:8,top);o.occ[I(i,j)]=1}}}
  return {lane,umax,top};
}

/* ---------- finishing: pictures for every designed wall ---------- */
function finish(S){
  const {B,wt,wk,wtop,wdoor}=S,W=B.W,H=B.H,h=B.h,rows=B.rows;
  const dirs=HGTL.DIRS;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const ch=rows[y][x];if(ch==='.')continue;const i=y*W+x;
    let foot=h[i];
    for(const d of dirs){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=W||ny>=H||rows[ny][nx]!=='.')continue;const nh=h[ny*W+nx];if(nh<foot)foot=nh}
    if(wk[i]){const top=wtop[i],dd=wdoor.get(i);let wh=top-foot;if(wh<.5)wh=.5;
      h[i]=foot;
      rows[y][x]=dd?doorCh(TINTS[wt[i]],wh,dd.lvl,dd.at):wallCh(TINTS[wt[i]],KINDS[wk[i]-1],wh)}
    else{h[i]=foot}
  }
}

/* ---------- registration ---------- */
hgtRegister(HGTXULB.ID,function(id){
  const S=build(id),B=S.B;
  finish(S);
  U.DEV.B=B;
  const L=hgtlAssemble(B,{name:'Ulb',label:'Ulb',start:B.start});
  L.terrace={h:B.h,rg:S.rg,riser:hgtaWallTile('hgt_wc',1)};
  L.fmap=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=S.fm[y*W+x];L.fmap.push(r)}
  L.floorSet=['hgt_f0','hgt_f4','hgt_f3','hgt_f2','hgt_f7','hgt_f5'];L.floor='hgt_f0';L.ceil='tomb';L.ceilH=3;L.amb=.9;L.noExtras=true;L.diff=66;
  L.chars=Object.assign({},hgtaChars);
  return L;
});
})();
