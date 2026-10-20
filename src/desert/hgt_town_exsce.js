/* ==========================================================================
   EXSCE, the shell city (level 481, interiors 4860 to 4879). Prefix hgtxexsce. See tools/HGT_BRIEF.md.
   150 by 150 cells, real heights. Layout (centre 75,75):
     the Conservatory Spiral at the centre (a spiral of glasshouse terraces, 13 high, the wizard's study on the summit) with the Root Well
     (its sunken counterpart) to the east; the Glass Court and four corner gardens round it; the Boulevard ring at 31 to 34 cells from the middle;
     WEST the Hill of Balconies (terraces rising west), EAST the Sunken Gardens (courts and houses below the ground), NORTH the Spire Quarter
     (tall towers, stair towers, step bridges), SOUTH the Gate Quarter (market lanes, nooks, the south gate); the north gate is in the north wall.
   Everything that is walked on is a height in B.h; walls are mass blocks carved by streets. Pictures are the painted art of hgt_art.js.
   ========================================================================== */
var HGTCITIES=(typeof HGTCITIES==='undefined')?{}:HGTCITIES;
var hgtxexsce=(function(){
const ID=481,W=150,H=150,CX=75,CY=75,SEED=4810,INT0=4860,INTN=4879,K=HGTL.K;
const hs=(x,y,k)=>hash2(x,y,SEED+(k|0));
let CITY=null; // the built city (memoised: the interiors read it too)

/* ---------- tiles ---------- */
const TN={a:{p:'hgt_wp',w:'hgt_ww0',b:'hgt_wb0',d:'hgt_d0'},b:{p:'hgt_wa',w:'hgt_ww1',b:'hgt_wb1',d:'hgt_d1'},c:{p:'hgt_wc',w:'hgt_ww3',b:'hgt_wb2',d:'hgt_d3'},d:{p:'hgt_wl',w:'hgt_ww2',b:'hgt_wb3',d:'hgt_d2'}};
const tcache=new Map();
function mkTile(list,wh){ // list: picture names from the bottom up (it repeats); wh: wall height in cells
  const key=list.join(',')+'|'+wh;if(tcache.has(key))return tcache.get(key);
  const units=Math.max(1,Math.ceil(wh-1e-6)),Hp=Math.max(8,Math.round(128*wh)),c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');x.fillStyle='#cfc4d6';x.fillRect(0,0,128,Hp);
  for(let u=0;u<units;u++){const im=hgtaPic(list[u%list.length]);if(!im)continue;const part=Math.min(1,wh-u);
    x.drawImage(im,0,im.height*(1-part),im.width,im.height*part,0,Hp-Math.round(u*128)-Math.round(128*part),128,Math.round(128*part))}
  const d=x.getImageData(0,0,128,Hp).data,id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;tcache.set(key,gid);return gid}
function pat(t,wh,v){const T=TN[t],n=Math.ceil(wh-1e-6),l=[];for(let u=0;u<n;u++){const top=u===n-1&&wh>=3;let p;
  if(top)p=T.b;else if(u===0)p=T.p;else if(u%3===0)p=T.b;else{const win=v===0?(u%2===1):v===1?(u%2===0):(u%3!==0);p=win?T.w:T.p}
  l.push(p)}return l}
const wallGid=(t,wh,v)=>mkTile(pat(t,wh,v||0),wh);
const META=new Map(); // map character -> {t,wh,v}: lets a wall be re-made taller (foot lowered) with the same look
function wc(t,wh,v){const ch=hgtaChar(wallGid(t,wh,v||0));if(!META.has(ch))META.set(ch,{t,wh,v:v||0});return ch} // a map character for a tinted wall of height wh
function doorGid(t,wh,link,pic){const l=[pic||TN[t].d].concat(pat(t,wh,1).slice(1)),base=mkTile(l,wh),gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[base];KH_DOOR[gid]=link;return gid}
const TINTS=['a','b','c','d'];

/* ---------- the builder ---------- */
function newB(){const B=hgtlNew(W,H,SEED);B.rooms=[];B.npcs=[];B.rg=null;return B}
const inB=(B,x,y)=>x>=0&&y>=0&&x<W&&y<H;
const isO=(B,x,y)=>inB(B,x,y)&&B.rows[y][x]==='.';
const hAt=(B,x,y)=>B.h[y*W+x];
function O(B,x,y,h,k){if(inB(B,x,y))hgtlOpen(B,x,y,h,k===undefined?K.GROUND:k)}
function Wl(B,x,y,ch,h){if(inB(B,x,y))hgtlWall(B,x,y,ch,h)}
function rect(B,x,y,w,d,h,k){for(let j=0;j<d;j++)for(let i=0;i<w;i++)O(B,x+i,y+j,h,k)}
function solid(B,x,y,w,d,ch,h){for(let j=0;j<d;j++)for(let i=0;i<w;i++)Wl(B,x+i,y+j,ch,h)}
function decor(B,k,x,y,o){B.decor.push(Object.assign({k,x,y,block:false},o||{}))}
function plant(B,k,x,y,sc,o){if(isO(B,x,y))decor(B,'hgt_'+k,x,y,Object.assign({walk:true,deco:true,sc:sc||1,ox:(hs(x,y,41)-.5)*.5,oy:(hs(x,y,42)-.5)*.5},o||{}))}
const light=(B,x,y)=>{if(isO(B,x,y))B.lights.push([x,y])};
function lampPost(B,x,y){if(isO(B,x,y)){decor(B,'hgt_lamppost',x,y,{walk:true,deco:true,sc:1});light(B,x,y)}}
function discOpen(B,cx,cy,r,h,k){for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)if(Math.hypot(x-cx,y-cy)<=r)O(B,x,y,h,k)}

/* ---------- the mass of the city: every cell starts as wall, the streets are carved out ---------- */
function massChar(x,y,prof){ // a lot is about 4 cells across: one tint, one height, one window phase
  const lx=Math.floor((x+hs(y>>3,3,7)*3)/4),ly=Math.floor((y+hs(x>>3,5,7)*3)/4),r=hs(lx,ly,8),t=TINTS[(hs(lx,ly,9)*4)|0],v=1+((hs(lx,ly,10)*2)|0);
  let acc=0,wh=prof[prof.length-1][0];for(const [h,p] of prof){acc+=p;if(r<acc){wh=h;break}}
  return wc(t,wh,v)}
const PROF={west:[[2.4,.25],[3.4,.4],[4.4,.25],[6,.1]],north:[[3.4,.2],[6,.35],[8,.25],[11,.2]],east:[[2.4,.45],[3.4,.4],[4.4,.15]],south:[[3.4,.35],[4.4,.3],[6,.3],[8,.05]],wall:[[5,1]]};

/* ==========================================================================
   THE CONSERVATORY SPIRAL (the signature)
   A helicoid: the ground at a cell is a function of its angle and radius, so the whole tower is one continuous ramp 5 cells wide that climbs
   2.6 turns round a core (13 up) and ends in a summit garden. Between turns the next turn stands 5 higher: a cliff of window-and-band wall, the
   glasshouse front of the terrace above. The core is a tall tower with the wizard's study. The ramp starts at the south, at the end of the Spiral Way.
   ========================================================================== */
const CON={cx:CX,cy:CY,R0:21,P:5,TT:2.6,HT:13,a0:Math.PI/2};
function conT(x,y){ // {n,t,h,th,r} for a cell, or null outside the tower
  const dx=x-CON.cx,dy=y-CON.cy,r=Math.hypot(dx,dy);if(r>CON.R0+CON.P/2+.8)return null;
  const TWO=Math.PI*2;let th=(Math.atan2(dy,dx)-CON.a0)%TWO;if(th<0)th+=TWO;
  let n=Math.round((CON.R0-r)/CON.P-th/TWO);if(n<0)return null;if(n>2)n=2;
  const t=th/TWO+n;return {n,t,th,r,h:CON.HT*Math.min(1,t/CON.TT)}}
function buildCone(B,info){
  const cells=[];
  for(let y=CON.cy-26;y<=CON.cy+26;y++)for(let x=CON.cx-26;x<=CON.cx+26;x++){const c=conT(x,y);if(!c)continue;O(B,x,y,Math.round(c.h*100)/100,K.TERRACE);cells.push([x,y,c])}
  info.cone=cells;
  // the core tower: a drum of tall wall, the study door facing east onto the summit
  const core=wc('d',13,0),coreB=wc('b',13,1),mid=wc('c',16,2),top=wc('d',19,1);
  for(let y=CON.cy-3;y<=CON.cy+3;y++)for(let x=CON.cx-3;x<=CON.cx+3;x++){const r=Math.hypot(x-CON.cx,y-CON.cy);if(r<=2.6){const h=hAt(B,x,y);Wl(B,x,y,r<1.1?top:r<1.9?mid:(x+y)&1?core:coreB,h)}}
  info.studyDoor={x:CON.cx+2,y:CON.cy,face:1,ax:CON.cx+3,ay:CON.cy}}

/* the sunken counterpart: the Root Well, a spiral stair running DOWN round a drum, 8 deep, with a door at the bottom */
const RW={cx:103,cy:103,R0:8,P:4,TT:1.5,D:7};
function rwT(x,y){const dx=x-RW.cx,dy=y-RW.cy,r=Math.hypot(dx,dy);if(r>RW.R0+RW.P/2+.8)return null;const TWO=Math.PI*2;let th=(Math.atan2(dy,dx)-Math.PI)%TWO;if(th<0)th+=TWO;
  let n=Math.round((RW.R0-r)/RW.P-th/TWO);if(n<0)return null;if(n>1)n=1;const t=th/TWO+n;return {n,t,r,h:-RW.D*Math.min(1,t/RW.TT)}}
function buildRootWell(B,info){
  const cells=[];
  for(let y=RW.cy-12;y<=RW.cy+12;y++)for(let x=RW.cx-12;x<=RW.cx+12;x++){const c=rwT(x,y);if(!c)continue;O(B,x,y,Math.round(c.h*100)/100,K.COURT);cells.push([x,y,c])}
  info.root=cells}

/* ---------- heights: the Hill of Balconies in the west (x 2 to 31) rises in flights of 7 steps and flat contour streets; everything else is level ---------- */
const S=HGTL.STEP,r2=v=>Math.round(v*100)/100;
function hillH(x){if(x>=32)return 0;if(x>=25)return r2(S*(32-x));if(x>=22)return r2(7*S);if(x>=15)return r2(7*S+S*(22-x));if(x>=12)return r2(14*S);if(x>=5)return r2(14*S+S*(12-x));return r2(21*S)}
const hillFlat=x=>x>=32||(x>=22&&x<=24)||(x>=12&&x<=14)||x<=4;
const ground=(x,y)=>x<=31?hillH(x):0;
const region=(x,y)=>x<=31?'west':x>=119?'east':y<=31?'north':y>=119?'south':'mid';
const kindOf=(x,y)=>(x<32&&!hillFlat(x))?K.STAIR:K.GROUND;
const YS=[[2,4],[17,19],[32,34],[46,48],[60,62],[73,77],[88,90],[102,104],[116,118],[131,133],[145,147]];
function fl(B,x,y,d){if(inB(B,x,y))B.fl[y*W+x]=48+d}
function street(B,x0,y0,x1,y1,d){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<=0||y<=0||x>=W-1||y>=H-1)continue;O(B,x,y,ground(x,y),kindOf(x,y));const rg=region(x,y);fl(B,x,y,d===undefined||d===0?(rg==='north'?1:rg==='east'?2:0):d)}}

/* ---------- the city ---------- */
function buildCity(){
  const B=newB();B.fl=new Uint8Array(W*H);const info={};
  B.info=info;info.doors=[];
  // 1. mass: every cell wall, the middle box open
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const g=ground(x,y),reg=region(x,y);
    if(x===0||y===0||x===W-1||y===H-1){Wl(B,x,y,wc(TINTS[(hs(x>>2,y>>2,3)*4)|0],7,((x+y)>>3)%3),g);continue}
    if(reg==='mid'){O(B,x,y,0,K.GROUND);fl(B,x,y,5);continue}
    Wl(B,x,y,massChar(x,y,PROF[reg]),g)}
  // 2. the streets
  for(const [a,b] of YS)street(B,2,a,W-3,b,0);              // the cross streets, all the way across (stairs on the hill)
  street(B,2,2,4,H-3,0);street(B,W-5,2,W-3,H-3,0);            // the west and east wall streets
  for(const [a,b] of [[22,24],[12,14],[32,34],[116,118],[125,127],[137,139],[73,77]])street(B,a,2,b,H-3,0);
  for(const [a,b] of [[44,46],[58,60],[90,92],[104,106]]){street(B,a,2,b,31,0);street(B,a,119,b,H-3,0)}
  // 3. the middle: the Glass Court, the Conservatory Spiral, the Root Well
  discOpen(B,CX,CY,30,0,K.PLAZA);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(B.kind[y*W+x]===K.PLAZA)fl(B,x,y,1);
  buildCone(B,info);
  buildRootWell(B,info);
  // 4. the districts, the gates, the decoration
  eastLane(B);ravineBridge(B,info);closeStreets(B);
  districts(B,info);skyBridge(B,info);
  coneDecor(B,info);rootDrum(B,info);rootDecor(B,info);rootStairsLamps(B,info);courtDecor(B,info);
  mazeGarden(B,info,36,36,17);orchard(B,info,106,43);pond(B,info,43,107);axisDecor(B);
  gates(B,info);
  streetDecor(B);boxDecor(B);gateDecor(B);belvedere(B);placeFolk(B,info);
  B.start={x:CX,y:H-3,f:0};
  return B}
function gates(B,info){
  for(let x=CX-2;x<=CX+2;x++){O(B,x,H-2,0,K.GROUND);fl(B,x,H-2,0);O(B,x,1,0,K.GROUND);fl(B,x,1,0)}
  const gw=doorGid('d',7,{lvl:470,at:{x:75,y:90,f:2}},'hgt_d2'),gn=doorGid('d',7,{lvl:470,at:{x:75,y:66,f:0}},'hgt_d2');
  Wl(B,CX,H-1,hgtaChar(gw),0);B.doors.push({x:CX,y:H-1,face:0,ax:CX,ay:H-2,to:470});
  Wl(B,CX,0,hgtaChar(gn),0);B.doors.push({x:CX,y:0,face:2,ax:CX,ay:1,to:470});
  info.gateS={x:CX,y:H-1,ax:CX,ay:H-2};info.gateN={x:CX,y:0,ax:CX,ay:1}}

/* ---------- finishing: feet, unreachable cells, risers, floors, the level object ---------- */
function finalize(B){
  const info=B.info,dirs=HGTL.DIRS;
  // walls reach down to the lowest open cell beside them (so nothing floats), keeping their tops
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=B.rows[y][x];if(ch==='.')continue;const m=META.get(ch),dd=DOORS.get(ch);if((!m&&!dd)||(m&&m.fixed))continue;const i=y*W+x;let mn=1e9;
    for(const d of dirs){const nx=x+d[0],ny=y+d[1];if(isO(B,nx,ny)){const v=B.h[ny*W+nx];if(v<mn)mn=v}}
    if(mn<1e8&&mn<B.h[i]-.05){const ext=Math.ceil(B.h[i]-mn-1e-6);
      if(dd){const c2=doorChar(dd.t,dd.wh,dd.link,dd.pic,ext);DOORS.set(c2,dd);B.rows[y][x]=c2}else B.rows[y][x]=wc(m.t,m.wh+ext,m.v);
      B.h[i]=r2(B.h[i]-ext)}}
  // open cells that cannot be reached become wall
  const rr=hgtlReach(B,B.start.x,B.start.y);let un=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(B.rows[y][x]==='.'&&!rr.seen[y*W+x]){un++;Wl(B,x,y,massChar(x,y,PROF[region(x,y)]||PROF.north),B.h[y*W+x]);B.decor=B.decor.filter(d=>!(d.x===x&&d.y===y))}
  info.unreachedFilled=un;
  return B}
function chooseRiser(B,x,y,drop){let t;
  const c=conT(x,y);
  if(c)t=['b','c','d'][c.n];
  else t=TINTS[(hs(x>>2,y>>2,61)*4)|0];
  return wallGid(t,8,(hs(x>>1,y>>1,62)*3)|0)}
function assemble(B){
  const info=B.info,rg=new Int32Array(W*H),fm=[];
  const stair=mkTile(['floor_hgt_f4'],1);
  for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++){const i=y*W+x;
    if(B.rows[y][x]==='.'){const h=B.h[i];let mn=h;for(const d of HGTL.DIRS){const nx=x+d[0],ny=y+d[1];if(isO(B,nx,ny)){const v=B.h[ny*W+nx];if(v<mn)mn=v}}
      if(h-mn>.6)rg[i]=chooseRiser(B,x,y,h-mn);
      let d=B.fl[i]?B.fl[i]-48:-1;
      if(d<0){const k=B.kind[i];d=k===K.STAIR?4:k===K.COURT?3:k===K.PLAZA?1:k===K.TERRACE?1:k===K.ALLEY?2:0}
      r+=d}else r+='0'}
    fm.push(r)}
  const chars={},used=new Set();for(let y=0;y<H;y++)for(const c of B.rows[y].join(''))if(c!=='.')used.add(c);
  for(const c of used){if(hgtaChars[c]!==undefined)chars[c]=hgtaChars[c];else if(roleChar[c]!==undefined&&roleChar[c]!==null)chars[c]=roleChar[c]}
  const L=hgtlAssemble(B,{name:'Exsce',label:'Exsce',diff:66,start:B.start,chars});
  L.chars=chars;L.terrace.riser=stair;L.terrace.rg=rg;L.fmap=fm;
  L.floorSet=['hgt_f0','hgt_f5','hgt_f2','hgt_f3','hgt_f4','hgt_f7'];L.floor='hgt_f0';L.ceil='tomb';L.ceilH=3;L.amb=1;L.noExtras=true;L.noTele=true;L.sky=skyTowers();
  return L}
// library placeholder characters (HGTL_CHARS roles) get painted wall tiles here
const roleChar={};
(function(){for(const role in HGTL_CHARS){const c=HGTL_CHARS[role],wh=HGTL_WH[c];let t='a';const m=/^nacre_([abcd])/.exec(role);if(m)t=m[1];else if(/window|band|secret/.test(role))t='c';else if(/pillar|hedge/.test(role))t='d';
  const v=(role.length*3)%3;META.set(c,{t,wh,v});roleChar[c]=null}})();
function bindRoles(){for(const c in roleChar){const m=META.get(c);roleChar[c]=wallGid(m.t,m.wh,m.v)}}
function getCity(){if(CITY)return CITY;bindRoles();const B=buildCity();finalize(B);CITY={B,level:assemble(B),info:B.info};return CITY}
LEVEL_NAMES[ID]='Exsce';
HGTE.look[ID]={ambient:.82,wallSat:1.75,wallGain:1.02,lamp:[1,.74,.42],tint:[1.08,1,1.02],grade:[255,222,236,.14],hazeCol:[130,92,150],floorSat:1.3,floorGain:.85,riserGain:.95,wallAO:.22};
for(let k=4860;k<=4879;k++)HGTE.look[k]={ambient:.8,wallSat:1.6,lamp:[1,.74,.42],grade:[255,225,236,.1]};
hgtRegister(ID,()=>getCity().level);
HGTCITIES.exsce={level:ID,key:'exsce',name:'Exsce',entry:{x:CX,y:H-3,f:0},entryNorth:{x:CX,y:2,f:2},exitDoor:{x:CX,y:H-1,to:470,at:{x:75,y:90,f:2}},exitDoorNorth:{x:CX,y:0,to:470,at:{x:75,y:66,f:0}}};
/* ---------- blocks, frontages and doors ---------- */
const XB={west:[[5,11],[15,21],[25,31]],east:[[119,124],[128,136],[140,144]],north:[[35,43],[47,57],[61,72],[78,89],[93,103],[107,115]]};
const YB=[[5,16],[20,31],[35,45],[49,59],[63,72],[78,87],[91,101],[105,115],[119,130],[134,144]];
function allBlocks(){const out=[],mk=(x0,y0,x1,y1,reg,i,j)=>out.push({x0,y0,x1,y1,w:x1-x0+1,d:y1-y0+1,reg,i,j,cx:(x0+x1)>>1,cy:(y0+y1)>>1,id:reg+i+'_'+j});
  for(const reg of ['west','east'])XB[reg].forEach((xr,i)=>YB.forEach((yr,j)=>mk(xr[0],yr[0],xr[1],yr[1],reg,i,j)));
  XB.north.forEach((xr,i)=>{[0,1].forEach(j=>mk(xr[0],YB[j][0],xr[1],YB[j][1],'north',i,j));[8,9].forEach(j=>mk(xr[0],YB[j][0],xr[1],YB[j][1],'south',i,j))});
  return out}
function frame(bk,side){const {x0,y0,x1,y1}=bk;
  if(side==='E')return {A:bk.d,Bd:bk.w,face:1,side,at:(a,b)=>[x1-b,y0+a],front:a=>[x1+1,y0+a]};
  if(side==='W')return {A:bk.d,Bd:bk.w,face:3,side,at:(a,b)=>[x0+b,y0+a],front:a=>[x0-1,y0+a]};
  if(side==='N')return {A:bk.w,Bd:bk.d,face:0,side,at:(a,b)=>[x0+a,y0+b],front:a=>[x0+a,y0-1]};
  return {A:bk.w,Bd:bk.d,face:2,side,at:(a,b)=>[x0+a,y1-b],front:a=>[x0+a,y1+1]}}
const DOORED=new Map(); // 'x,y' -> true
const ROOMLINK={};      // room key -> {x,y,face,ax,ay}: where the door stands in the city (the interior's way out)
const DOORS=new Map();  // door char -> {t,wh,link,pic}
function doorChar(t,wh,link,pic,ext){ // a door tile of wall height wh whose door picture sits ext cells above the bottom
  const l=[];for(let e=0;e<(ext||0);e++)l.push(TN[t].p);l.push(pic||TN[t].d);const p=pat(t,wh+(ext||0),1);for(let u=l.length;u<p.length;u++)l.push(p[u]);
  const base=mkTile(l,wh+(ext||0)),gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[base];if(link)KH_DOOR[gid]=link;return hgtaChar(gid)}
/* turn the wall cell (x,y) into a door facing `face` (the open cell in front is the doorstep). spec: a room key (enterable) or null (a shut door, painted only) */
function doorOn(B,x,y,face,spec,o){o=o||{};const ch0=B.rows[y][x];if(ch0==='.'||DOORED.has(x+','+y))return null;const m=META.get(ch0);if(!m)return null;
  const d=HGTL.DIRS[face&3],ax=x+d[0],ay=y+d[1];if(!isO(B,ax,ay))return null;
  const wh=Math.max(2.4,o.wh||m.wh),room=spec?ROOMS[spec]:null,link=room?{lvl:room.id,at:{x:room.w>>1,y:room.d-2,f:0}}:null;
  const pic=o.pic||(room&&room.pic)||null,ch=doorChar(m.t,wh,link,pic,0);
  B.rows[y][x]=ch;B.h[y*W+x]=B.h[ay*W+ax];DOORS.set(ch,{t:m.t,wh,link,pic});DOORED.set(x+','+y,1);B.doors.push({x,y,face:face&3,ax,ay,to:room?room.id:null});
  if(spec){ROOMLINK[spec]={x,y,face:face&3,ax,ay};B.info.rooms=B.info.rooms||[];B.info.rooms.push(spec);light(B,ax,ay);
    for(const pf of [(face+1)&3,(face+3)&3]){const q=HGTL.DIRS[pf],px=ax+q[0],py=ay+q[1];if(isO(B,px,py)&&Math.abs(B.h[py*W+px]-B.h[ay*W+ax])<.1&&!B.decor.some(d=>d.x===px&&d.y===py)){lampPost(B,px,py);break}}}
  return {x,y,ax,ay}}
// a wall cell on the side of a block with a free doorstep, near position t (0..1) along the side
function sideDoor(B,bk,side,t,spec,o){const f=frame(bk,side),c=[];for(let a=1;a<f.A-1;a++){const [x,y]=f.at(a,0),[fx,fy]=f.front(a);if(!isO(B,fx,fy)||isO(B,x,y))continue;
    let near=false;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,2],[0,-2]])if(DOORED.has((x+dx)+','+(y+dy)))near=true;if(!near)c.push([a,x,y])}
  if(!c.length)return null;const k=c[Math.min(c.length-1,Math.floor(t*c.length))];return doorOn(B,k[1],k[2],f.face,spec,o)}
const rr=(B,a,b,k)=>hs(a,b,k);

/* ---------- block templates (all written in the frame of one side: a runs along the street, b runs into the block) ---------- */
// a courtyard inside the block, entered from the street through a gateway
function tCourt(B,bk,side,o){o=o||{};const f=frame(bk,side),m=bk.w<=bk.d?bk.w:bk.d;if(f.A<7||f.Bd<7)return false;
  const a0=2,a1=f.A-3,b0=2,b1=f.Bd-3,mid=(f.A-1)>>1;
  for(let b=b0;b<=b1;b++)for(let a=a0;a<=a1;a++){const [x,y]=f.at(a,b);O(B,x,y,ground(x,y),K.PLAZA);fl(B,x,y,o.floor===undefined?2:o.floor)}
  for(let b=0;b<b0;b++){const [x,y]=f.at(mid,b);O(B,x,y,ground(x,y),K.ALLEY);fl(B,x,y,0)}
  { const [x,y]=f.at(mid,0);decor(B,'hgt_arch',x,y,{walk:true,deco:true,sc:1}) }
  // contents
  const cx=f.at((a0+a1)>>1,(b0+b1)>>1);
  if(o.fountain!==false&&(a1-a0)>=4&&(b1-b0)>=4){decor(B,'hgt_fountain',cx[0],cx[1],{block:true,sc:1})}
  for(let b=b0;b<=b1;b++)for(let a=a0;a<=a1;a++){const [x,y]=f.at(a,b),edge=a===a0||a===a1||b===b1;if(!isO(B,x,y)||(x===cx[0]&&y===cx[1]))continue;
    const r=rr(B,x,y,70);if(edge&&r<.55)plant(B,['pearlbush','shrub','fern','shellflower','bulbflower','crystalgrass'][(r*11|0)%6],x,y,.9+r*.7);else if(r>.93)plant(B,'mushrooms',x,y,1)}
  { const [lx,ly]=f.at(a0,b1);lampPost(B,lx,ly);const [mx,my]=f.at(a1,b1);lampPost(B,mx,my)}
  return true}
// a flight of 6 steps along the street up to a balcony 2 cells deep, with a door behind it at the balcony's height
function tBalcony(B,bk,side,spec,o){o=o||{};const f=frame(bk,side);if(f.A<11||f.Bd<5)return null;
  const a0=o.a0===undefined?1:o.a0,n=o.steps||5,L=Math.min(f.A-2-a0,n+4),[fx,fy]=f.front(a0),base=hAt(B,fx,fy);if(!isO(B,fx,fy))return null;
  let hp=base;
  for(let k=0;k<n;k++){const [x,y]=f.at(a0+k,0);hp=r2(base+HGTL.STEP*(k+1));O(B,x,y,hp,K.STAIR);fl(B,x,y,4)}
  for(let a=a0+n;a<a0+L;a++)for(let b=0;b<2;b++){const [x,y]=f.at(a,b);O(B,x,y,hp,K.PLAT);fl(B,x,y,1)}
  const am=a0+n+((L-n)>>1),[dx,dy]=f.at(am,2),door=doorOn(B,dx,dy,f.face,spec,{wh:o.wh||3.4,pic:o.pic});
  if(!door&&spec)return null;
  { const [lx,ly]=f.at(a0+L-1,1);lampPost(B,lx,ly);plant(B,'bulbflower',...f.at(a0+n,1),1.1);plant(B,'shellflower',...f.at(a0+L-1,0),1.2) }
  return {door,hp,base,steps:n}}
// a sunken court reached by stairs down from the street; an optional house at the far end with a door
function tSunken(B,bk,side,spec,o){o=o||{};const f=frame(bk,side),depth=o.depth||2.08,n=Math.ceil(depth/HGTL.STEP-1e-6),wc_=Math.min(f.A-2,o.w||7),dc=Math.min(f.Bd-1,o.d||(n+5));
  if(wc_<5||dc<n+3)return null;const a0=o.a0===undefined?((f.A-wc_)>>1):o.a0,[fx,fy]=f.front(a0+(wc_>>1)),base=hAt(B,fx,fy),floor=r2(base-depth);
  if(!isO(B,fx,fy))return null;
  for(let b=0;b<dc;b++)for(let a=a0;a<a0+wc_;a++){const [x,y]=f.at(a,b);O(B,x,y,floor,K.COURT);fl(B,x,y,3)}
  const sa=a0+((wc_-2)>>1);
  for(let k=0;k<n;k++)for(let l=0;l<2;l++){const [x,y]=f.at(sa+l,k);O(B,x,y,r2(base-depth*(k+1)/n),K.STAIR);fl(B,x,y,4)}
  let door=null;
  if(spec!==undefined&&dc>=n+4){const hb=dc-3;for(let b=hb;b<dc;b++)for(let a=a0+1;a<a0+wc_-1;a++){const [x,y]=f.at(a,b);Wl(B,x,y,wc(['a','b','c','d'][(hs(bk.x0,bk.y0,3)*4)|0],3.4,(a+b)%3),floor)}
    const [dx,dy]=f.at(a0+(wc_>>1),hb);door=doorOn(B,dx,dy,f.face,spec,{wh:3.4,pic:o.pic})}
  const ph=door?dc-3:dc;
  for(let b=n;b<ph;b++)for(let a=a0;a<a0+wc_;a++){const [x,y]=f.at(a,b),r=rr(B,x,y,71);if(a===a0||a===a0+wc_-1){if(r<.7)plant(B,['giantcap','mushrooms','fern','shellflower','bulbflower'][(r*9|0)%5],x,y,.8+r*.6);if(r<.4)light(B,x,y)}}
  if(o.fountain){const [x,y]=f.at(a0+(wc_>>1),n+((ph-n)>>1));decor(B,'hgt_fountain',x,y,{block:true,sc:1})}
  { const [lx,ly]=f.at(a0,ph-1);lampPost(B,lx,ly);const [mx,my]=f.at(a0+wc_-1,ph-1);lampPost(B,mx,my)}
  return {door,floor,base}}
// a stepped round tower standing in the block
function tTower(B,bk,tint,o){o=o||{};const sz=Math.min(bk.w,bk.d)-(o.margin===undefined?0:o.margin),h=ground(bk.cx,bk.cy);if(sz<5)return null;
  hgtlTower(B,bk.cx,bk.cy,sz,sz,{shape:o.shape||'round',chars:hgtlTaper(tint).slice(o.skip===undefined?0:o.skip),h,lean:o.lean||[0,0],window:HGTL_CHARS.window_mid,windowP:.3});return {sz}}
// a lane across the block (a runs across), with a lamp and a little nook that holds a chest
function tAlley(B,bk,dirAcross,o){o=o||{};const horiz=dirAcross==='x';const m=horiz?bk.cy:bk.cx;
  if(horiz){for(let x=bk.x0;x<=bk.x1;x++){O(B,x,m,ground(x,m),kindOf(x,m));fl(B,x,m,2)}}
  else for(let y=bk.y0;y<=bk.y1;y++){O(B,m,y,ground(m,y),K.ALLEY);fl(B,m,y,2)}
  const mid=horiz?[bk.cx,m]:[m,bk.cy];
  if(o.nook){const dir=horiz?(hs(bk.cx,bk.cy,5)<.5?0:2):(hs(bk.cx,bk.cy,5)<.5?1:3),f=HGTL.DIRS[dir];let x=mid[0]+f[0],y=mid[1]+f[1];const g=ground(mid[0],mid[1]);
    for(let k=0;k<3;k++){O(B,x,y,g,K.ALLEY);fl(B,x,y,2);B.secrets.push([x,y]);x+=f[0];y+=f[1]}x-=f[0];y-=f[1];
    decor(B,'hg_chestweed',x,y,{block:true,sc:.9});lampPost(B,mid[0]+f[0],mid[1]+f[1])}
  else lampPost(B,mid[0],mid[1]);
  return true}
// the whole block is a small square: paving, trees, a fountain, lamps
function tSquare(B,bk,o){o=o||{};for(let y=bk.y0;y<=bk.y1;y++)for(let x=bk.x0;x<=bk.x1;x++){O(B,x,y,ground(x,y),K.PLAZA);fl(B,x,y,o.floor===undefined?1:o.floor)}
  decor(B,'hgt_fountain',bk.cx,bk.cy,{block:true,sc:1.1});
  for(const [x,y] of [[bk.x0+1,bk.y0+1],[bk.x1-1,bk.y0+1],[bk.x0+1,bk.y1-1],[bk.x1-1,bk.y1-1]]){plant(B,['willow','fairytree','giantcap'][(rr(B,x,y,72)*3)|0],x,y,1);lampPost(B,x+(x===bk.x0+1?1:-1),y)}
  for(let y=bk.y0;y<=bk.y1;y++)for(let x=bk.x0;x<=bk.x1;x++)if(rr(B,x,y,73)<.14&&isO(B,x,y)&&!B.decor.some(d=>d.x===x&&d.y===y))plant(B,['crystalgrass','fern','mushrooms','pearlbush'][(rr(B,x,y,74)*4)|0],x,y,.9);
  return true}
// a bulb house: a tall core and spire in a ring of windows on a balcony pedestal, stairs up to it from the street
function tBulb(B,bk,side,tint){const f=frame(bk,side);if(f.A<9||f.Bd<12)return null;const [x,y]=f.at(f.A>>1,7),dir=f.face;
  const r=hgtlBulbHouse(B,x,y,dir,{tint,ledge:1.0,h0:hAt(B,...f.front(f.A>>1))});
  const d=r.door;if(d){B.doors=B.doors.filter(q=>q!==d);B.rows[d.y][d.x]=HGTL_CHARS.window_mid}
  for(const [u,v] of [[-4,6],[4,6]]){const q=hgtlXf(x,y,dir)(u,v);lampPost(B,q[0],q[1])}return r}
// a garden terrace: the block lifted to a level platform reached by one flight, with a cupola and plants
function tGarden(B,bk,side,o){o=o||{};const f=frame(bk,side);if(f.A<7||f.Bd<6)return null;const [fx,fy]=f.front(f.A>>1),base=hAt(B,fx,fy),n=o.steps||5,hp=r2(base+HGTL.STEP*n);if(!isO(B,fx,fy))return null;
  for(let b=1;b<f.Bd-1;b++)for(let a=1;a<f.A-1;a++){const [x,y]=f.at(a,b);O(B,x,y,hp,K.PLAT);fl(B,x,y,5)}
  const mid=(f.A-1)>>1;for(let k=0;k<n;k++){for(const l of [0,1]){const [x,y]=f.at(mid+l-0,k);O(B,x,y,r2(base+HGTL.STEP*(k+1)),K.STAIR);fl(B,x,y,4)}}
  for(let b=n;b<f.Bd-1;b++)for(let a=1;a<f.A-1;a++){const [x,y]=f.at(a,b),r=rr(B,x,y,75);if((a===1||a===f.A-2||b===f.Bd-2)&&r<.7)plant(B,['fairytree','pearlbush','bulbflower','lightvine','shrub'][(r*13|0)%5],x,y,.9+r*.6);else if(r>.9)plant(B,'mushrooms',x,y,.9)}
  const [cx,cy]=f.at(mid,f.Bd-3);decor(B,'hgt_cupola',cx,cy,{block:true,sc:1.2});light(B,cx,cy);
  { const [lx,ly]=f.at(1,n);lampPost(B,lx,ly);const [mx,my]=f.at(f.A-2,n);lampPost(B,mx,my) }
  return {hp}}
/* ---------- the rooms (interiors, built below) ---------- */
const ROOMS={
  guard:{id:4860,name:'The South Gatehouse',w:9,d:7,t:'a',kind:'guard'},
  glubba:{id:4861,name:"Mother Glubba's House",w:9,d:7,t:'a',kind:'home',pic:'hgt_d0'},
  wibb:{id:4862,name:'The House of Salves',w:9,d:7,t:'b',kind:'healer'},
  ubbo:{id:4863,name:"Elder Ubbo's Tower Room",w:7,d:7,t:'d',kind:'elder',pic:'hgt_d2'},
  brollo:{id:4864,name:"Brollo's Pearl Shop",w:11,d:7,t:'c',kind:'shop',next:'archive'},
  root:{id:4865,name:'The Root Cellar',w:11,d:9,t:'b',kind:'cellar'},
  study:{id:4866,name:"The Wizard's Study",w:11,d:9,t:'d',kind:'study',next:'orrery',pic:'hgt_d2'},
  orchard:{id:4867,name:'The Orchard Glasshouse',w:11,d:9,t:'c',kind:'glass',pic:'hgt_d2'},
  lamps:{id:4868,name:'The House of Lamps',w:9,d:9,t:'a',kind:'library',next:'hidden'},
  inn:{id:4869,name:'The Pearl Rest',w:11,d:9,t:'a',kind:'inn'},
  pip:{id:4870,name:"Pip's Loft",w:7,d:7,t:'d',kind:'loft'},
  bells:{id:4871,name:'The Bell Loft',w:9,d:7,t:'c',kind:'bells',pic:'hgt_d2'},
  archive:{id:4872,name:'The Drowned Archive',w:9,d:9,t:'b',kind:'archive',parent:'brollo'},
  loom:{id:4873,name:"The Weavers' Room",w:9,d:7,t:'a',kind:'loom'},
  observatory:{id:4874,name:'The Observatory',w:9,d:9,t:'d',kind:'observ',pic:'hgt_d2'},
  hidden:{id:4875,name:'The Hidden Garden',w:9,d:7,t:'b',kind:'hidden',parent:'lamps'},
  orrery:{id:4876,name:'The Orrery Gallery',w:9,d:7,t:'d',kind:'orrery',parent:'study'},
  baths:{id:4877,name:'The Sunken Baths',w:11,d:7,t:'b',kind:'baths'},
  stall:{id:4878,name:'The Cloth Merchant',w:9,d:7,t:'c',kind:'stall'}};
for(const k in ROOMS)ROOMS[k].key=k;

/* ---------- which template goes in which block ---------- */
const PLAN={ // planned blocks: [template, side, room key]
  west1_3:['balcony','E','glubba'],west0_4:['balcony','E','loom'],west0_1:['balcony','W','observatory'],west2_6:['sunken','N','wibb'],west1_7:['balcony','W','pip'],
  north3_0:['balcony','S','lamps'],north4_0:['balcony','S','bells'],north1_1:['spire','N','ubbo'],north2_1:['spire','N',null],north3_1:['spire','N',null],north5_1:['spire','N',null],north0_1:['spire','N',null],west0_0:['spire','E',null],west0_9:['spire','E',null],east1_0:['spire','S',null],east1_9:['spire','N',null],south2_9:['tower','N',null],north2_0:['tower','S',null],east2_0:['tower','W',null],east2_9:['tower','W',null],
  east1_2:['sunken','N','brollo'],east1_6:['sunken','S','baths'],
  south3_9:['door','W','guard'],south2_8:['door','E','inn'],south1_9:['door','N','stall']};
const WEIGHTS={
  west:[['balcony',.26],['court',.18],['sunken',.1],['alley',.14],['tower',.1],['garden',.04],['mass',.18]],
  north:[['bulb',.16],['tower',.24],['balcony',.14],['court',.12],['alley',.14],['garden',.06],['mass',.22]],
  east:[['bulb',.1],['sunken',.3],['court',.18],['garden',.1],['alley',.1],['mass',.28]],
  south:[['bulb',.14],['court',.16],['square',.08],['alley',.18],['balcony',.14],['tower',.1],['mass',.28]]};
function pickT(bk){const r=hs(bk.x0,bk.y0,91);let acc=0;for(const [t,p] of WEIGHTS[bk.reg]){acc+=p;if(r<acc)return t}return 'mass'}
function sidesFor(bk){return bk.reg==='west'||bk.reg==='east'?(bk.d>=9?['E','W','N','S']:['E','W']):['N','S','E','W']}
function doBlock(B,bk){
  const plan=PLAN[bk.id],t=plan?plan[0]:pickT(bk),r=hs(bk.x0,bk.y0,92),sides=sidesFor(bk),side=plan?plan[1]:sides[(r*sides.length)|0],tint=TINTS[(hs(bk.x0,bk.y0,93)*4)|0];
  const spec=plan?plan[2]:null;let ok=true;
  if(t==='balcony')ok=!!tBalcony(B,bk,side,spec);
  else if(t==='court')ok=tCourt(B,bk,side,{floor:r<.5?2:5});
  else if(t==='sunken')ok=!!tSunken(B,bk,side,spec||(r>.4?null:undefined),{depth:1.56,w:5,fountain:!spec&&r<.3});
  else if(t==='alley')ok=tAlley(B,bk,bk.w>bk.d?'x':(bk.reg==='west'||bk.reg==='east'?'x':'y'),{nook:r<.4});
  else if(t==='tower')ok=!!tTower(B,bk,tint,{lean:[(r-.5)*.8,(hs(bk.x0,bk.y0,94)-.5)*.8],margin:bk.reg==='west'?0:1});
  else if(t==='garden')ok=!!tGarden(B,bk,side);
  else if(t==='bulb')ok=!!tBulb(B,bk,side,tint);
  else if(t==='spire'){const sz=bk.w>=11?11:bk.w>=9?9:7,sr=squareSpire(B,bk,side,spec,{size:sz,dir:bk.id==='north1_1'?1:bk.id==='north2_1'?-1:(bk.i+bk.j)%2?1:-1,chest:!spec&&sz<11});ok=!!sr;if(sr){(B.info.spires=B.info.spires||{})[bk.id]=sr;if(spec)B.info.spireEntry=sr.entry}}
  else if(t==='square')ok=tSquare(B,bk);
  else if(t==='door'){sideDoor(B,bk,side,.5,spec)}
  if(!ok&&plan&&plan[2]){ // a planned room that did not fit: put its door in plainly
    for(const sd of sidesFor(bk)){if(sideDoor(B,bk,sd,.5,plan[2]))break}}
}
function districts(B,info){for(const bk of allBlocks())doBlock(B,bk)}
// lamps and plants along the streets
function streetDecor(B){
  const front=new Set();for(const d of B.doors)front.add(d.ax+','+d.ay);
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!isO(B,x,y)||front.has(x+','+y)||(B.kind[y*W+x]!==K.GROUND&&B.kind[y*W+x]!==K.STAIR))continue;
    if(x>=CX-30&&x<=CX+30&&y>=CY-30&&y<=CY+30&&Math.hypot(x-CX,y-CY)<31)continue;
    let wall=false;for(const d of HGTL.DIRS)if(!isO(B,x+d[0],y+d[1]))wall=true;if(!wall)continue;
    if(B.decor.some(q=>q.x===x&&q.y===y))continue;
    const r=hs(x,y,97);
    if(((x*5+y*3)%11)===0&&r<.9)lampPost(B,x,y);
    else if(r<.07)plant(B,['shrub','pearlbush','fern','crystalgrass','shellflower','bulbflower','lightvine'][(hs(x,y,98)*7)|0],x,y,.85+hs(x,y,99)*.7)
    else if(r<.10){const o=wallSide(B,x,y);if(o)decor(B,'hgt_banner',x,y,{walk:true,deco:true,sc:1,ox:o[0]*.38,oy:o[1]*.38})}
    else if(r<.135){const o=wallSide(B,x,y);if(o)decor(B,'hgt_balcony',x,y,{walk:true,deco:true,sc:1.15,bob:1.15+hs(x,y,101)*.5,ox:o[0]*.44,oy:o[1]*.44})}}}
function wallSide(B,x,y){for(const d of HGTL.DIRS)if(!isO(B,x+d[0],y+d[1]))return d;return null}
// the middle of the box: lawn with trees and lamps (the gardens are made later)
function boxDecor(B){
  for(let y=33;y<=117;y++)for(let x=33;x<=117;x++){if(!isO(B,x,y))continue;const r=hs(x,y,100);
    if(B.fl[y*W+x]===53&&B.kind[y*W+x]===K.GROUND){ // lawn
      if(r<.05)plant(B,['fairytree','willow','giantcap','pearlbush','shrub','fern','reeds'][(hs(x,y,101)*7)|0],x,y,.9+hs(x,y,102)*.9);
      else if(r<.09)plant(B,['crystalgrass','mushrooms','shellflower','bulbflower','fern'][(hs(x,y,103)*5)|0],x,y,.9+hs(x,y,104)*.6)}}}
/* ---------- the Conservatory: plants, lamps, glasshouse pavilions, the summit ---------- */
const FIXED=new Set(); // wall characters that keep exactly their own height and foot
function glassChar(t,wh){const list=t==='b'?['hgt_ww1','hgt_ww3','hgt_wb1']:['hgt_ww3','hgt_ww1','hgt_wb2'],ch=hgtaChar(mkTile(list,wh));META.set(ch,{t,wh,v:0,fixed:true});return ch}
function pavilion(B,info,n,th0,spec,t){
  const TWO=Math.PI*2,R=CON.R0-CON.P*(n+th0)-.9,a=CON.a0+th0*TWO,cx=Math.round(CON.cx+R*Math.cos(a)),cy=Math.round(CON.cy+R*Math.sin(a));
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const c=conT(cx+dx,cy+dy);if(!c||c.n!==n||!isO(B,cx+dx,cy+dy))return null}
  const gw=glassChar(t,3.4),gt=glassChar(t==='b'?'c':'b',5);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)Wl(B,cx+dx,cy+dy,dx===0&&dy===0?gt:gw,B.h[(cy+dy)*W+cx+dx]);
  const ox=cx-CON.cx,oy=cy-CON.cy,face=Math.abs(ox)>=Math.abs(oy)?(ox>0?1:3):(oy>0?2:0),dd=HGTL.DIRS[face];
  const dxx=cx+dd[0],dyy=cy+dd[1];let door=null;
  if(isO(B,dxx+dd[0],dyy+dd[1]))door=doorOn(B,dxx,dyy,face,spec,{wh:3.4,pic:'hgt_d2'});
  if(door===null&&spec)return null;
  light(B,door?door.ax:cx,door?door.ay:cy);if(door){lampPost(B,door.ax+(face===1||face===3?0:1),door.ay+(face===1||face===3?1:0))}
  return {x:cx,y:cy,face}}
function coneDecor(B,info){
  const cells=info.cone,k=0;let cnt=0;
  const SP=[['willow','fairytree','giantcap','shrub','pearlbush','fern'],['fairytree','pearlbush','bulbflower','shellflower','fern','mushrooms'],['shellflower','lightvine','crystalgrass','bulbflower','pearlbush','fairytree']];
  for(const [x,y,c] of cells){if(!isO(B,x,y))continue;const h=B.h[y*W+x];let outer=false,inner=false;
    for(const d of HGTL.DIRS){const nx=x+d[0],ny=y+d[1];if(!inB(B,nx,ny))continue;const q=isO(B,nx,ny)?B.h[ny*W+nx]:null;if(q===null)continue;if(q<h-1)outer=true;else if(q>h+1)inner=true}
    const r=hs(x,y,110);
    if(outer&&r<.7){plant(B,SP[c.n][(hs(x,y,111)*6)|0],x,y,.9+hs(x,y,112)*.9);if(r<.3)light(B,x,y);cnt++}
    else if(inner&&r<.45){plant(B,['lightvine','bulbflower','shellflower','fern'][(hs(x,y,113)*4)|0],x,y,1+hs(x,y,114)*.6);cnt++}
    else if(!outer&&!inner&&r<.025&&c.th>.15){plant(B,['crystalgrass','mushrooms','pearlbush'][(r*120|0)%3],x,y,1)}
    if((outer||inner)&&((x*3+y*5)%9===0)&&r>.7)lampPost(B,x,y)}
  info.coneDecor=cnt;
  // the glasshouse pavilions
  info.pav=[pavilion(B,info,0,.58,null,'b'),pavilion(B,info,1,.32,'orchard','c'),pavilion(B,info,2,.16,null,'b')];
  // the summit: banners, lamps, finials, beds; the study door faces east
  for(const [x,y,c] of cells){if(!isO(B,x,y)||c.t<CON.TT||Math.hypot(x-CON.cx,y-CON.cy)<3.2)continue;const r=hs(x,y,115);
    if(r<.16)plant(B,['fairytree','shellflower','pearlbush','lightvine','bulbflower','crystalgrass'][(r*37|0)%6],x,y,1+hs(x,y,116)*.6);else if(r<.2)decor(B,'hgt_finial',x,y,{walk:true,deco:true,sc:1.1})}
  for(const [x,y] of [[CON.cx+4,CON.cy-3],[CON.cx+4,CON.cy+3],[CON.cx+3,CON.cy+4],[CON.cx+6,CON.cy]])if(isO(B,x,y)){B.decor=B.decor.filter(q=>!(q.x===x&&q.y===y));lampPost(B,x,y)}
  { const sd=info.studyDoor,ch=B.rows[sd.y][sd.x];doorOn(B,sd.x,sd.y,sd.face,'study',{wh:13,pic:'hgt_d2'}) }
  B.decor=B.decor.filter(q=>!(q.x===CON.cx+3&&q.y===CON.cy)); light(B,CON.cx+3,CON.cy);light(B,CON.cx+5,CON.cy+2);light(B,CON.cx+5,CON.cy-2)}
function rootDecor(B,info){
  for(const [x,y,c] of info.root){if(!isO(B,x,y))continue;let outer=false,inner=false;const h=B.h[y*W+x];
    for(const d of HGTL.DIRS){const nx=x+d[0],ny=y+d[1];if(!isO(B,nx,ny))continue;const q=B.h[ny*W+nx];if(q>h+1)outer=true;else if(q<h-1)inner=true}
    const r=hs(x,y,120);
    if((outer||inner)&&r<.6){plant(B,['giantcap','mushrooms','mushrooms','fern','reeds','crystalgrass'][(hs(x,y,121)*6)|0],x,y,.8+hs(x,y,122)*1);if(r<.25)light(B,x,y)}
    else if(r<.03)plant(B,'mushrooms',x,y,1)}}
// the Glass Court: lamps round the rim, trees, four fountains, arches at the four avenues
function courtDecor(B,info){
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2,x=Math.round(CX+29*Math.cos(a)),y=Math.round(CY+29*Math.sin(a));if(Math.abs(x-CX)<=3||Math.abs(y-CY)<=3)continue;if(isO(B,x,y))lampPost(B,x,y)}
  for(let i=0;i<32;i++){const a=(i+.5)/32*Math.PI*2,x=Math.round(CX+27*Math.cos(a)),y=Math.round(CY+27*Math.sin(a));if(Math.abs(x-CX)<=4||Math.abs(y-CY)<=4)continue;if(isO(B,x,y)&&!B.decor.some(q=>q.x===x&&q.y===y))plant(B,['willow','fairytree','giantcap'][i%3],x,y,1.1)}
  for(const [dx,dy] of [[1,1],[-1,1],[1,-1],[-1,-1]]){const x=CX+dx*19,y=CY+dy*19,up=dx*dy>0;
    for(let j=-5;j<=5;j++)for(let i=-5;i<=5;i++){const d=Math.hypot(i,j);if(d>5||!isO(B,x+i,y+j)||conT(x+i,y+j))continue;const k=d<1.5?4:d<2.8?3:d<4?2:1;O(B,x+i,y+j,up?.26*k:-.26*k,up?K.TERRACE:K.COURT);fl(B,x+i,y+j,up?5:3)}
    if(up){decor(B,'hgt_cupola',x,y,{block:true,sc:1.4});for(const [a,b] of [[3,0],[-3,0],[0,3],[0,-3]])plant(B,'fairytree',x+a,y+b,1.2)}else{decor(B,'hgt_fountain',x,y,{block:true,sc:1.2});for(const [a,b] of [[3,1],[-3,-1],[1,-3],[-1,3]])plant(B,'giantcap',x+a,y+b,.9)}
    lampPost(B,x+dx*6,y);lampPost(B,x,y+dy*6)}
  for(const [x,y] of [[CX,CY-30],[CX,CY+30],[CX-30,CY],[CX+30,CY]])if(isO(B,x,y))decor(B,'hgt_arch',x,y,{walk:true,deco:true,sc:1.1});
  for(let y=CY-30;y<=CY+30;y++)for(let x=CX-30;x<=CX+30;x++){if(!isO(B,x,y)||Math.hypot(x-CX,y-CY)>30||Math.hypot(x-CX,y-CY)<20.5||B.kind[y*W+x]!==K.PLAZA)continue;
    if(B.decor.some(q=>q.x===x&&q.y===y))continue;const r=hs(x,y,123);if(r<.03)plant(B,['crystalgrass','shellflower','bulbflower','pearlbush'][(r*133|0)%4],x,y,1)}}
/* ==========================================================================
   THE INTERIORS (4860 to 4878). Small rooms, every one with the bottom door at the middle of the south wall (the way out) and some with a second
   door in the north wall to a further room. Props are the painted furniture of the Khemetra set (khProp) and the pearl garden pictures.
   ROOMDEF[kind] = {props:[[role,x,y]..], plants:[[name,x,y,scale]..], lights:[[x,y]..], chests:[[x,y,k]..], items:[[k,x,y]..], folk:[[id,pic,x,y,scale]..]}
   ========================================================================== */
const ROOMDEF={
 guard:{props:[['rack',1,1],['rack',2,1],['rack',6,1],['rack',7,1],['bed',1,3],['bed',1,4],['table',6,3],['chair',5,3],['hearth',7,5]],plants:[['gardenlantern',2,5,1]],lights:[[2,2],[6,2],[4,4]],chests:[[7,1,'hg_chestwax']],folk:[['hgx_ex_guard','hg_npc4',3,2,1]]},
 home:{props:[['bed',1,1],['cradle',2,1],['hearth',7,1],['table',4,3],['chair',3,3],['chair',5,3],['bookcase',1,4],['dresser',7,3],['potshelf',7,5],['planter',1,5]],plants:[['fern',2,5,.8],['bulbflower',6,5,.9]],lights:[[4,2],[2,4],[6,4]],chests:[],folk:[['hgn_glubba','hg_npc1',3,2,1]]},
 healer:{props:[['bed',1,1],['bed',2,1],['bed',3,1],['washstand',7,1],['potshelf',5,1],['shelf',7,3],['basin',6,3],['table',2,4]],plants:[['fern',1,5,.8],['bulbflower',7,5,.9],['shellflower',2,3,.8]],lights:[[4,2],[2,5],[6,5]],chests:[],folk:[['hgn_wibb','hg_npc6',4,3,1]]},
 elder:{props:[['bookcase',1,2],['bookcase',5,2],['table',3,3],['chair',2,3],['chair',4,3],['candle',1,5],['candle',5,5]],plants:[['gardenlantern',3,1,1]],lights:[[3,2],[1,4],[5,4]],chests:[],folk:[['hgn_ubbo','hg_npc0',2,5,1]],lectern:[[3,1]]},
 shop:{props:[['counter',3,2],['counter',4,2],['counter',6,2],['counter',7,2],['shelf',1,3],['shelf',1,4],['stallA',8,4],['stallB',9,4],['amphorae',9,5]],plants:[['gardenlantern',1,1,1]],lights:[[3,3],[7,3],[5,5]],chests:[],folk:[['hgn_brollo','hg_npc5',2,1,1]],barrels:[[9,1],[9,2],[1,5]]},
 cellar:{props:[['amphora',1,5],['amphora',9,5]],plants:[['giantcap',2,2,1],['giantcap',8,2,1.1],['mushrooms',3,6,1],['mushrooms',7,6,1],['mushrooms',1,7,1],['mushrooms',9,7,1],['giantcap',2,6,.9],['crystalgrass',8,6,1]],lights:[[2,3],[8,3],[5,6],[5,2]],chests:[[1,1,'hg_chestweed'],[9,1,'hg_chestjelly'],[5,1,'hg_chestwax']],items:[['hgcrystal',3,4],['hgcrystal',7,4]],barrels:[[1,3],[9,3],[1,4],[9,4]]},
 study:{props:[['bookcase',1,1],['bookcase',2,1],['bookcase',8,1],['bookcase',9,1],['bookcase',1,3],['bookcase',1,5],['desk',8,3],['chair',7,3],['maptable',8,5],['mapstand',9,5],['candle',1,7],['candle',9,7]],plants:[['gardenlantern',3,2,1],['gardenlantern',7,2,1]],lights:[[3,3],[7,3],[5,6],[3,6],[7,6]],chests:[[9,7,'hg_chestjelly']],items:[['hgcrystal',2,7],['hgsting',3,7]],folk:[['hg_aldous','hg_wizard',7,4,1]],lectern:[[2,4]]},
 glass:{props:[['bench',3,5],['bench',7,5],['planter',1,1],['planter',9,1],['planter',1,7],['planter',9,7]],plants:[['fairytree',2,2,.7],['fairytree',8,2,.7],['fairytree',2,6,.7],['fairytree',8,6,.7],['pearlbush',3,1,1],['pearlbush',7,1,1],['shellflower',1,4,1],['shellflower',9,4,1],['bulbflower',3,7,1],['bulbflower',7,7,1],['lightvine',1,2,1],['lightvine',9,2,1]],lights:[[3,3],[7,3],[5,6]],chests:[[5,1,'hg_chestweed']],fountain:[[5,3]]},
 library:{props:[['bookcase',1,1],['bookcase',1,3],['bookcase',1,5],['bookcase',1,7],['bookcase',7,1],['bookcase',7,3],['bookcase',7,5],['bookcase',7,7],['desk',2,4],['chair',3,4],['maptable',6,4]],plants:[['gardenlantern',3,2,1],['gardenlantern',5,2,1],['gardenlantern',3,6,1],['gardenlantern',5,6,1]],lights:[[3,3],[5,3],[3,5],[5,5]],chests:[],lectern:[[6,6]]},
 inn:{props:[['table',2,3],['chair',2,2],['chair',2,4],['table',8,3],['chair',8,2],['chair',8,4],['table',2,6],['chair',3,6],['counter',7,6],['counter',8,6],['counter',9,6],['hearth',1,1],['feast',9,1]],plants:[['gardenlantern',5,7,1]],lights:[[2,5],[8,5],[5,3]],chests:[[9,3,'hg_chestwax']],folk:[['hgx_ex_inn1','hg_npc3',3,3,.9],['hgx_ex_inn2','hg_npc0',7,5,1]],barrels:[[1,7],[1,6]]},
 loft:{props:[['bed',1,1],['cradle',5,5],['dresser',5,1]],plants:[['mushrooms',1,5,.9]],lights:[[3,2],[2,4]],chests:[],folk:[['hgn_pip','hg_npc3',2,3,.8]],barrels:[[5,2],[5,3]]},
 bells:{props:[['harp',1,1],['rope',7,1],['banner',1,5],['banner',7,5]],plants:[['chime',2,1,1],['chime',3,1,1],['chime',5,1,1],['chime',6,1,1],['chime',4,1,1],['hanglamp',3,3,1],['hanglamp',5,3,1]],lights:[[3,3],[5,3],[4,5]],chests:[]},
 archive:{props:[['bookcase',1,1],['bookcase',2,1],['bookcase',3,1],['bookcase',5,1],['bookcase',6,1],['bookcase',7,1],['bookcase',1,4],['bookcase',1,6],['bookcase',7,4],['bookcase',7,6],['amphora',2,7],['amphora',6,7]],plants:[['mushrooms',3,3,.9],['mushrooms',5,6,.9],['gardenlantern',2,3,1],['gardenlantern',6,3,1]],lights:[[2,2],[6,2],[3,5],[5,5],[4,7]],chests:[[7,7,'hg_chestjelly'],[1,7,'hg_chestweed']],items:[['hgcrystal',4,2]]},
 loom:{props:[['loom',2,1],['loom',6,1],['rolledcarpets',1,3],['rolledcarpets',7,3],['carpets',1,5],['chair',3,3],['chair',5,3]],plants:[['bulbflower',7,5,.9]],lights:[[3,2],[5,2],[4,5]],chests:[],folk:[['hgx_ex_weaver','hg_npc1',4,2,1]]},
 observ:{props:[['mapstand',1,1],['maptable',3,2],['maptable',6,2],['wheel',7,1],['bench',2,6],['bench',6,6]],plants:[['chime',2,3,1],['chime',6,4,1],['hanglamp',4,3,1],['hanglamp',4,5,1],['gardenlantern',1,7,1],['gardenlantern',7,7,1]],lights:[[3,4],[5,4],[4,7]],chests:[[7,3,'hg_chestjelly']],folk:[['hgx_ex_star','hg_npc0',2,4,1]]},
 hidden:{props:[['bench',3,3]],plants:[['fairytree',1,1,.7],['fairytree',7,1,.7],['pearlbush',2,2,1],['pearlbush',6,2,1],['shellflower',1,3,1],['shellflower',7,3,1],['bulbflower',2,5,1],['bulbflower',6,5,1],['lightvine',1,5,1],['lightvine',7,5,1],['mushrooms',4,5,1]],lights:[[2,3],[6,3],[4,4]],chests:[[4,1,'hg_chestwax']],items:[['hgcarapace',5,3]],fountain:[[4,2]]},
 orrery:{props:[['maptable',2,2],['maptable',6,2],['mapstand',1,1],['mapstand',7,1],['brazier',1,5],['brazier',7,5],['shrine',4,1]],plants:[['chime',3,3,1],['chime',5,3,1],['hanglamp',4,3,1]],lights:[[3,2],[5,2],[4,5]],chests:[[1,3,'hg_chestjelly']],items:[['hgcrystal',7,3]]},
 baths:{props:[['basin',2,1],['basin',4,1],['basin',6,1],['basin',8,1],['washstand',9,3],['bench',2,5],['bench',8,5]],plants:[['reeds',1,3,1],['reeds',9,5,1],['fern',1,5,.9],['hanglamp',5,3,1],['gardenlantern',9,1,1]],lights:[[3,3],[7,3],[5,5]],chests:[],fountain:[[5,2]],folk:[['hgx_ex_bath','hg_npc3',6,4,.8]]},
 stall:{props:[['carpets',1,1],['carpets',2,1],['rolledcarpets',7,1],['counter',3,2],['counter',5,2],['stallC',7,3],['stallD',8,3],['cushions',1,4]],plants:[['gardenlantern',1,5,1]],lights:[[3,3],[6,4],[4,5]],chests:[],folk:[['hgx_ex_cloth','hg_npc5',4,1,1]]}};
const SPR_H={hgt_chime:1.1,hgt_hanglamp:.8,hgt_gardenlantern:.9};
function buildRoom(key){
  const R=ROOMS[key],def=ROOMDEF[R.kind],city=getCity(),link=ROOMLINK[key],w=R.w,d=R.d,cx=w>>1;
  const T=R.t,wall0=wallGid(T,2.7,0),wall1=wallGid(T,2.7,1),wall2=mkTile([TN[T].p,TN[T].w],2.7);
  const chars={},ch=n=>{const c=hgtaChar(n);chars[c]=n;return c},cA=ch(wall0),cB=ch(wall1),cW=ch(wall2);
  let outLink=link?{lvl:ID,at:{x:link.ax,y:link.ay,f:link.face}}:{lvl:ID,at:{x:CX,y:H-3,f:0}};
  if(R.parent){const P=ROOMS[R.parent];outLink={lvl:P.id,at:{x:P.w>>1,y:2,f:2}}}
  const cD=ch(doorGid(T,2.7,outLink,'hgt_d1'));
  const rows=[];for(let y=0;y<d;y++){let r='';for(let x=0;x<w;x++){if(y>0&&y<d-1&&x>0&&x<w-1)r+='.';else if(y===d-1&&x===cx)r+=cD;else r+=((x+y*3)%5===2&&(x>1&&x<w-2||y>1&&y<d-2))?cW:((x+y)%2?cA:cB)}rows.push(r.split(''))}
  if(R.next){const N=ROOMS[R.next],cN=ch(doorGid(T,2.7,{lvl:N.id,at:{x:N.w>>1,y:N.d-2,f:0}},'hgt_d2'));rows[0][cx]=cN}
  const decorL=[],lights=[],items=[];
  const put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decorL.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  for(const [role,x,y] of def.props||[])put(role,x,y);
  for(const [n,x,y,sc] of def.plants||[]){const k='hgt_'+n;decorL.push({k,x,y,block:false,walk:true,deco:true,sc:sc||1})}
  for(const [x,y] of def.lights||[])lights.push([x,y]);
  for(const [x,y,k] of def.chests||[])decorL.push({k,x,y,block:true});
  for(const [x,y] of def.barrels||[])decorL.push({k:'hg_waxbarrel',x,y,block:true});
  for(const [x,y] of def.lectern||[])decorL.push({k:'hg_lectern',x,y,block:true});
  for(const [x,y] of def.fountain||[])decorL.push({k:'hgt_fountain',x,y,block:true,sc:.9});
  for(const [k,x,y] of def.items||[])items.push({k,x,y});
  for(const [id,pic,x,y,sc] of def.folk||[]){if(id==='hg_aldous'||id.startsWith('hgn_')||id.startsWith('hgx_'))decorL.push({k:pic,x,y,block:false,walk:true,npc:id,sc:sc||1})}
  return {rows:rows.map(r=>r.join('')),chars,start:{x:cx,y:d-2,f:0},enemies:[],items,decor:decorL,lights,portals:[],floor:['hgt_f5','hgt_f1','hgt_f0','hgt_f6'][(R.id)%4],day:0,amb:.62,ceil:'beam',ceilH:2.7,noTele:true,noExtras:true,diff:66,name:R.name,label:R.name,mapNames:[]}}
for(const k in ROOMS)hgtRegister(ROOMS[k].id,()=>buildRoom(k));
for(const k in ROOMS)LEVEL_NAMES[ROOMS[k].id]=ROOMS[k].name;
/* ---------- stair towers: a square helicoid, like the Conservatory in little. Chebyshev rings 2 cells wide, each turn 3 to 4 higher than the one outside it; the entry is the middle
   of the side that faces the street; the top is a deck round a small core, with the door of the room at the top (or a lookout) ---------- */
function squareSpire(B,bk,side,spec,o){o=o||{};const size=Math.min(bk.w,bk.d,o.size||11),f=frame(bk,side),x0=bk.x0+((bk.w-size)>>1),y0=bk.y0+((bk.d-size)>>1),c=size>>1,cx=x0+c,cy=y0+c,
  R0=c,P=o.P||(size>=11?2:size>=9?1.8:1.5),nmax=Math.floor(R0/P),TT=o.TT||nmax-.1,HT=o.HT||(size>=11?9:size>=9?8:7),dir=o.dir||1,a0=[-Math.PI/2,0,Math.PI/2,Math.PI][f.face],TWO=Math.PI*2,t=o.tint||TINTS[(hs(bk.x0,bk.y0,130)*4)|0];
  const cells=[],ex0=cx+[0,c,0,-c][f.face],ey0=cy+[-c,0,c,0][f.face],fd=HGTL.DIRS[f.face],base=isO(B,ex0+fd[0],ey0+fd[1])?hAt(B,ex0+fd[0],ey0+fd[1]):0;
  for(let y=y0;y<y0+size;y++)for(let x=x0;x<x0+size;x++){const dx=x-cx,dy=y-cy,r=Math.max(Math.abs(dx),Math.abs(dy));let th=(((Math.atan2(dy,dx)-a0)*dir)%TWO+TWO)%TWO;
    let n=Math.round((R0-r)/P-th/TWO);
    if(n<0){O(B,x,y,ground(x,y),K.GROUND);fl(B,x,y,5);continue}
    if(n>nmax-1)n=nmax-1;const tt=th/TWO+n,h=r2(base+HT*Math.min(1,tt/TT));O(B,x,y,h,K.TERRACE);fl(B,x,y,1);cells.push([x,y,n,tt,r])}
  // the core: 3 by 3 of tall wall, the door facing the deck
  const ch1=wc(t,HT+4,1),ch2=wc(t==='d'?'b':'d',HT+6,2),cc=[];
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){Wl(B,cx+i,cy+j,(i===0&&j===0)?ch2:ch1,hAt(B,cx+i,cy+j));cc.push([cx+i,cy+j])}
  let door=null;
  // the door goes in the core wall beside the highest open cell
  let best=null;for(const [px,py] of cc){for(let fcd=0;fcd<4;fcd++){const d=HGTL.DIRS[fcd],nx=px+d[0],ny=py+d[1];if(isO(B,nx,ny)){const h=B.h[ny*W+nx];if(!best||h>best.h)best={h,px,py,face:(fcd)}}}}
  if(best){door=doorOn(B,best.px,best.py,best.face,spec||null,{wh:HT+4,pic:'hgt_d2'});info_top(B,best.h)}
  // plants, lamps
  for(const [x,y,n,tt,r] of cells){if(!isO(B,x,y))continue;let outer=false;for(const d of HGTL.DIRS){const nx=x+d[0],ny=y+d[1];if(isO(B,nx,ny)&&B.h[ny*W+nx]<B.h[y*W+x]-1)outer=true}
    const q=hs(x,y,131);if(outer&&q<.5)plant(B,['shrub','pearlbush','fern','crystalgrass','shellflower','bulbflower','mushrooms'][(q*70|0)%7],x,y,.9+hs(x,y,132)*.6);else if(outer&&q<.6)lampPost(B,x,y)}
  { // the top deck: a finial or two, a lamp, and on a lookout a chest
    const topH=best?best.h:HT;let nTop=0;
    for(const [x,y] of cells){if(!isO(B,x,y)||Math.abs(B.h[y*W+x]-topH)>.05||Math.max(Math.abs(x-cx),Math.abs(y-cy))!==2)continue;nTop++;
      if(nTop===1&&o.chest){B.decor=B.decor.filter(q=>!(q.x===x&&q.y===y));decor(B,['hg_chestwax','hg_chestweed','hg_chestjelly'][(hs(cx,cy,133)*3)|0],x,y,{block:true,sc:1});B.secrets.push([x,y])}
      else if(nTop%3===2){B.decor=B.decor.filter(q=>!(q.x===x&&q.y===y));decor(B,'hgt_finial',x,y,{walk:true,deco:true,sc:1.1})}
      else if(nTop%3===0)lampPost(B,x,y)}
    light(B,cx+(best?HGTL.DIRS[best.face][0]*2:2),cy+(best?HGTL.DIRS[best.face][1]*2:0))}
  const ex=[cx+[0,c,0,-c][f.face],cy+[-c,0,c,0][f.face]];
  return {door,top:best?best.h:HT,entry:ex,cx,cy,size,x0,y0}}
function info_top(B,h){}

/* ---------- the Root Well: the drum, the door at the bottom ---------- */
function rootDrum(B,info){
  const wcB=wc('b',9.5,1),wcC=wc('d',9.5,0);
  for(let y=RW.cy-3;y<=RW.cy+3;y++)for(let x=RW.cx-3;x<=RW.cx+3;x++)if(Math.hypot(x-RW.cx,y-RW.cy)<=2.1&&isO(B,x,y)){Wl(B,x,y,(x+y)&1?wcB:wcC,B.h[y*W+x])}
  // the lowest open cell beside the drum: the door goes in the drum wall next to it
  let best=null;for(let y=RW.cy-5;y<=RW.cy+5;y++)for(let x=RW.cx-5;x<=RW.cx+5;x++){if(!isO(B,x,y))continue;for(let f=0;f<4;f++){const d=HGTL.DIRS[f],nx=x+d[0],ny=y+d[1];if(!isO(B,nx,ny)&&META.has(B.rows[ny][nx])&&Math.hypot(nx-RW.cx,ny-RW.cy)<=2.2){const h=B.h[y*W+x];if(!best||h<best.h)best={h,x,y,nx,ny,face:(f+2)&3}}}}
  if(best)info.rootDoor=doorOn(B,best.nx,best.ny,best.face,'root',{wh:9.5,pic:'hgt_d2'})}
function rootStairsLamps(B,info){const cells=info.root;for(const [x,y,c] of cells){if(!isO(B,x,y))continue;if(((x*7+y*3)%13)===0&&B.h[y*W+x]<-1)lampPost(B,x,y)}}

/* ---------- townsfolk ---------- */
const EXFOLK=[
 ['hgx_ex_guard','Gatehouse guard','hg_npc4',['The south gate is the only way in from the grassland. The north gate opens onto the track to the hives.','There is a bunk here for each watch. The watch changes when the lamps are trimmed.']],
 ['hgx_ex_inn1','A child','hg_npc3',['The inn has a fire. The fire is kept burning all the time.']],
 ['hgx_ex_inn2','An old traveller','hg_npc0',['I came up the Spiral Way this morning. It took most of the morning.','The Conservatory has one ramp. It turns two and a half times round the core.']],
 ['hgx_ex_weaver','A weaver','hg_npc1',['Reed thread comes here from Ulb by cart. We weave it into the banners that hang on the terraces.']],
 ['hgx_ex_star','An observer','hg_npc0',['From the belvedere on top of the hill you can see the whole city. The Conservatory is in the middle. The Root Well is east of it.']],
 ['hgx_ex_bath','A bather','hg_npc3',['The water in the baths is warm. It comes up from below the Root Well.']],
 ['hgx_ex_s1','A stair-keeper','hg_npc4',['The Spiral Way ends at the foot of the Conservatory. The ramp climbs two and a half turns to the summit garden.','The study of Aldous Wend is in the tower at the top. Its door faces east.']],
 ['hgx_ex_s2','A lamp-lighter','hg_npc1',['Every street has lamps. They are lit all the time, because the roof gives no light.']],
 ['hgx_ex_s3','A hill-dweller','hg_npc1',['The Hill of Balconies has three terraces. Mother Glubba lives on the middle one, behind a round pink door at the top of a flight of steps.']],
 ['hgx_ex_s4','A herb-gatherer','hg_npc6',['The House of Salves is in a sunken court on the hill. Go down the steps from the street.']],
 ['hgx_ex_s5','A tower-climber','hg_npc3',['Elder Ubbo lives at the top of the northern tower. The stair winds round the outside, and his door is at the very top.']],
 ['hgx_ex_s6','A pond-boy','hg_npc3',['Brollo keeps his shop in a sunken court in the east quarter. The court is at the bottom of a flight of steps.']],
 ['hgx_ex_s7','A gardener','hg_npc1',['The Root Well goes down two turns. At the bottom is a door to the cellar.']],
 ['hgx_ex_s8','A balcony-sitter','hg_npc0',['Some doors in this city are not on the street. You reach them from a balcony, up a flight of steps.']]];
try{for(const [id,nm,img,chat] of EXFOLK)hgNative(id,nm,img,chat,null)}catch(e){console.error('hgt exsce folk',e)}
try{hgMerchant('hgx_ex_cloth','Pell, the cloth trader','hg_npc5','Cloth, rope and a few good things from the hives. Look as long as you like.')}catch(e){console.error('hgt exsce merchant',e)}
/* chests and jars in the cities give the same things as the ones in the grassland and the hives */
if(!globalThis.__hgtLootWrapped){globalThis.__hgtLootWrapped=1;const _lf=lootFor;lootFor=function(d){
  if(hgtAny(LEVEL)&&d&&/^hg_(chest|waxbarrel|jar)/.test(d.k)){
    const r=k=>hash2(d.x,d.y,900+k),it=[],add=(id,n)=>it.push({id,n:ITEMDEF[id]&&ITEMDEF[id].stack?(n||1):1}),chest=/chest/.test(d.k),F=HG_FOOD.map(f=>f[0]);
    add(F[(r(1)*F.length)|0],2+((r(2)*3)|0));if(r(3)<.6)add(F[(r(4)*F.length)|0],2);
    if(r(5)<.5)add(potionFor(r(6)));
    if(chest&&r(7)<.4)add(HG_GEAR[(r(8)*HG_GEAR.length)|0]);
    if(r(9)<.2)add('hgcrystal');
    d.gold=chest?60+Math.floor(r(10)*180):10+Math.floor(r(11)*50);return it}
  return _lf.apply(this,arguments)}}
// where the townsfolk stand: the nearest free ground cell to a place
function freeNear(B,x,y,r){r=r||6;let best=null,bd=1e9;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const px=x+i,py=y+j;if(!isO(B,px,py)||B.kind[py*W+px]===K.STAIR)continue;if(B.decor.some(q=>q.x===px&&q.y===py))continue;if(B.doors.some(q=>q.ax===px&&q.ay===py))continue;
    const dd=Math.hypot(i,j);if(dd<bd){bd=dd;best=[px,py]}}return best}
function placeFolk(B,info){
  const L=key=>ROOMLINK[key],put=(id,img,x,y,sc,near)=>{const c=freeNear(B,x,y,near||8);if(c)decor(B,img,c[0],c[1],{walk:true,npc:id,sc:sc||1})};
  put('hgn_skroop','hg_npc4',CX+4,H-6,1);
  decor(B,'hg_well',CX-6,CY+27,{block:true,sc:1});put('hg_aldous','hg_wizard',CX-5,CY+27,1);
  put('hgx_ex_s1','hg_npc4',CX+3,CY+25,1);
  put('hgx_ex_s2','hg_npc1',CX-4,H-12,1);
  if(L('glubba'))put('hgx_ex_s3','hg_npc1',L('glubba').ax,L('glubba').ay,1,5);
  if(L('wibb'))put('hgx_ex_s4','hg_npc6',L('wibb').ax,L('wibb').ay-1,1,5);
  if(L('ubbo'))put('hgx_ex_s5','hg_npc3',info.spireEntry?info.spireEntry[0]:60,info.spireEntry?info.spireEntry[1]-1:30,.9,6);
  if(L('brollo'))put('hgx_ex_s6','hg_npc3',L('brollo').ax,L('brollo').ay-1,.9,5);
  put('hgx_ex_s7','hg_npc1',RW.cx-RW.R0-2,RW.cy,1,5);
  if(L('pip'))put('hgx_ex_s8','hg_npc0',L('pip').ax,L('pip').ay,1,6)}
/* ==========================================================================
   THE FOUR GARDENS of the middle box, the ravine bridge in the north, the sky towers beyond the walls
   ========================================================================== */
// NW: the Arcade Maze, a maze of low lit arcades (1.2 high, you cannot see over them) with a pearl tree and a chest in the middle
function mazeGarden(B,info,x0,y0,size){
  const hedge=hgtaChar(mkTile(['hgt_wb3'],1.2));META.set(hedge,{t:'d',wh:1.2,v:0,fixed:true});
  const n=(size-1)>>1,vis=new Uint8Array(n*n),open=(x,y)=>O(B,x,y,0,K.PLAZA);
  for(let y=y0;y<y0+size;y++)for(let x=x0;x<x0+size;x++){Wl(B,x,y,hedge,0)}
  const stack=[[0,0]];vis[0]=1;open(x0+1,y0+1);let guard=0;
  while(stack.length&&guard++<5000){const [cx,cy]=stack[stack.length-1],nb=[];for(const d of HGTL.DIRS){const nx=cx+d[0],ny=cy+d[1];if(nx>=0&&ny>=0&&nx<n&&ny<n&&!vis[ny*n+nx])nb.push(d)}
    if(!nb.length){stack.pop();continue}
    const d=nb[(hs(cx*7+stack.length,cy*3+guard,140)*nb.length)|0],nx=cx+d[0],ny=cy+d[1];vis[ny*n+nx]=1;open(x0+1+nx*2,y0+1+ny*2);open(x0+1+cx*2+d[0],y0+1+cy*2+d[1]);stack.push([nx,ny])}
  // a few extra openings so there are loops, and two ways in
  for(let k=0;k<10;k++){const i=(hs(k,1,141)*(n-1))|0,j=(hs(k,2,141)*(n-1))|0;open(x0+2+i*2,y0+1+j*2)}
  const mid=(n>>1)*2+1;open(x0+size-1,y0+mid);open(x0+mid,y0+size-1);open(x0+size-1,y0+mid-2>0?y0+mid-2:y0+1);
  O(B,x0+size-1,y0+size-2,0,K.PLAZA);
  // the heart of the maze
  const hx=x0+1+(n>>1)*2,hy=y0+1+(n>>1)*2;
  for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)O(B,hx+i,hy+j,0,K.PLAZA);
  decor(B,'hg_chestjelly',hx,hy,{block:true,sc:1.1});plant(B,'fairytree',hx+1,hy+1,1.2);plant(B,'fairytree',hx-1,hy-1,1.2);lampPost(B,hx-1,hy+1);lampPost(B,hx+1,hy-1);
  B.secrets.push([hx,hy]);info.mazeHeart=[hx,hy];
  for(let y=y0;y<y0+size;y++)for(let x=x0;x<x0+size;x++){if(isO(B,x,y)){fl(B,x,y,2);if(hs(x,y,142)<.07&&!(x===hx&&y===hy))plant(B,['crystalgrass','shellflower','mushrooms'][(hs(x,y,143)*3)|0],x,y,.8)}}
  // lamps at the entrances
  lampPost(B,x0+size-1,y0+mid-1<y0?y0+1:y0+mid);
}
// NE: the Pearl Orchard, a stepped garden of five rings (each 2 cells wide, half a unit higher) with a cupola and a fountain on top
function orchard(B,info,cx,cy){
  for(let y=cy-9;y<=cy+9;y++)for(let x=cx-9;x<=cx+9;x++){const d=Math.max(Math.abs(x-cx),Math.abs(y-cy)),k=Math.max(0,4-Math.floor(d/2));if(d>9)continue;O(B,x,y,k*.5,k?K.TERRACE:K.GROUND);fl(B,x,y,k?5:5)}
  for(let y=cy-9;y<=cy+9;y++)for(let x=cx-9;x<=cx+9;x++){const d=Math.max(Math.abs(x-cx),Math.abs(y-cy));if(d>9||!isO(B,x,y))continue;const r=hs(x,y,144);
    if(d===0)continue;
    if(d%2===1&&((x+y)%3===0)&&r<.8)plant(B,['fairytree','fairytree','pearlbush','bulbflower'][(r*20|0)%4],x,y,1+hs(x,y,145)*.5);else if(r<.1)plant(B,['shellflower','crystalgrass','fern'][(r*30|0)%3],x,y,.9)}
  decor(B,'hgt_cupola',cx,cy,{block:true,sc:1.5});decor(B,'hgt_fountain',cx+1,cy,{block:true,sc:.9});
  for(const [dx,dy] of [[2,2],[-2,2],[2,-2],[-2,-2],[6,0],[-6,0],[0,6],[0,-6]])lampPost(B,cx+dx,cy+dy);
  info.orchard={x:cx,y:cy}}
// SW: the Willow Pond, a round pool reached by stairs all round (each ring a quarter unit lower), willows on the rim, glittering gravel at the bottom
function pond(B,info,cx,cy){
  for(let y=cy-10;y<=cy+10;y++)for(let x=cx-10;x<=cx+10;x++){const d=Math.hypot(x-cx,y-cy);if(d>9.5)continue;const k=d<3?4:d<5?3:d<7?2:d<9?1:0;O(B,x,y,-.26*k,k?(k>=3?K.COURT:K.STAIR):K.GROUND);fl(B,x,y,k>=3?2:k?4:5)}
  for(let y=cy-10;y<=cy+10;y++)for(let x=cx-10;x<=cx+10;x++){const d=Math.hypot(x-cx,y-cy);if(d>9.5||!isO(B,x,y))continue;const r=hs(x,y,146);
    if(d>=7&&d<9.5&&r<.45)plant(B,['willow','willow','lightvine','reeds'][(r*40|0)%4],x,y,1.1+hs(x,y,147)*.5);
    else if(d<5&&r<.16)plant(B,['reeds','crystalgrass','shellflower'][(r*60|0)%3],x,y,.9+hs(x,y,148)*.5);
    if(d<3&&r<.3)light(B,x,y)}
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;lampPost(B,Math.round(cx+9*Math.cos(a)),Math.round(cy+9*Math.sin(a)))}
  info.pond={x:cx,y:cy}}
// the sky towers beyond the walls: far spires seen over the city wall
function skyTowers(){const out=[];for(let i=0;i<30;i++){const f=(i+hs(i,1,150)*.6)/30*4,e=Math.floor(f),u=f-e,m=14+hs(i,2,151)*30,x=e===0?-20+u*(W+40):e===2?W+20-u*(W+40):e===1?W+m:-m,y=e===0?-m:e===2?H+m:e===1?-20+u*(H+40):H+20-u*(H+40);
    out.push({x,y,k:'hg_tower'+(4+((hs(i,3,152)*4)|0)),w:9+hs(i,4,153)*10,z:0,big:1})}return out}
// the Ravine of the Lamps: the street between two stair towers is a sunken lane, 1.56 down, with steps at both ends
function sunkenLane(B,xs,y0,y1,depth,seed){
  for(let y=y0;y<=y1;y++){const k=Math.min(y-y0,y1-y),d=Math.min(depth,.52*(k+1));
    for(const x of xs){O(B,x,y,-d,k<3?K.STAIR:K.COURT);fl(B,x,y,k<3?4:3)}}
  for(let y=y0+4;y<=y1-4;y++){if(hs(xs[0],y,160+seed)<.5)plant(B,['giantcap','mushrooms','fern','bulbflower','shellflower','lightvine'][(hs(xs[1],y,161+seed)*6)|0],hs(y,3,162+seed)<.5?xs[0]:xs[xs.length-1],y,.8+hs(y,4,163)*.6);if((y-y0)%5===2)light(B,xs[1],y)}}
// a humpback bridge of steps over the Ravine of the Lamps, from the east side of one stair tower to the west side of the next
function skyBridge(B,info){
  const yb=26;if(!(isO(B,57,yb)&&isO(B,61,yb)))return null;const hA=B.h[yb*W+57],hB=B.h[yb*W+61];if(Math.abs(hA-hB)>.6)return null;
  const hm=(hA+hB)/2,hs_=[hm+.3,hm+.6,hm+.3];
  for(let k=0;k<3;k++){O(B,58+k,yb,r2(hs_[k]),K.BRIDGE);fl(B,58+k,yb,0)}
  // the ravine is split in two basins by the bridge; the south one is reached from the south stairs
  lampPost(B,57,yb-1<0?yb:yb);light(B,59,yb);for(const x of [58,60])plant(B,'lightvine',x,yb-1,1.2);
  info.skyBridge={y:yb,hA,hB};return true}
function ravineBridge(B,info){sunkenLane(B,[58,59,60],20,31,1.56,3);sunkenLane(B,[58,59,60],134,144,1.56,5);info.ravine=1}
function axisDecor(B){
  const L=(x,y)=>{if(isO(B,x,y)&&!B.decor.some(q=>q.x===x&&q.y===y))lampPost(B,x,y)};
  for(let k=0;k<9;k+=4){L(72,36+k);L(78,36+k);L(72,114-k);L(78,114-k);L(36+k,72);L(36+k,78);L(114-k,72);L(114-k,78)}
  for(const [x,y] of [[CX,40],[CX,110],[40,CY],[110,CY]])if(isO(B,x,y))decor(B,'hgt_obelisk',x,y,{block:true,sc:1.1})}
// the East: a sunken lane (1.56 down, steps at each end) between every pair of cross streets, so the cross streets pass over it at ground level
function eastLane(B){for(let j=0;j<YB.length;j++)sunkenLane(B,[137,138,139],YB[j][0],YB[j][1],1.56,0)}
// gate plazas and the arches along the avenues
function gateDecor(B){
  for(const gy of [H-10,10]){decor(B,'hgt_fountain',CX,gy,{block:true,sc:1.1});for(const dx of [-2,2]){lampPost(B,CX+dx,gy+(gy>75?1:-1))}
    for(const dy of [0,-3,3])for(const dx of [-2,2])if(dy!==0)plant(B,['shrub','pearlbush'][(hs(dx,dy,164)*2)|0],CX+dx,gy+dy,1)}
  for(const [x,y] of [[CX,H-3],[CX,2],[CX,24],[CX,126],[CX,142],[CX,8],[31,CY],[23,CY],[13,CY],[119,CY],[127,CY],[CX-20,H-3]])if(isO(B,x,y)&&!B.decor.some(q=>q.x===x&&q.y===y))decor(B,'hgt_arch',x,y,{walk:true,deco:true,sc:1.1})}
// the belvedere on the top of the hill: finials, obelisks, lamps, banners along the west wall street
function belvedere(B){
  for(let y=6;y<H-6;y+=7){if(isO(B,3,y)&&!B.decor.some(q=>q.x===3&&q.y===y)){decor(B,y%14===6?'hgt_obelisk':'hgt_finial',3,y,{block:y%14===6,sc:1.1});light(B,3,y)}}
  for(let y=10;y<H-10;y+=9)if(isO(B,4,y)&&!B.decor.some(q=>q.x===4&&q.y===y))decor(B,'hgt_banner',4,y,{walk:true,deco:true,sc:1})}
/* ==========================================================================
   THE OVERVIEW MAP (M key): a parchment map drawn once from the real level (heights shade the ground, stairs are hatched, sunken places are blue)
   ========================================================================== */
const EXM={cv:null,s:1.64,ox:114,oy:42};
const EXTINT={a:[236,200,212],b:[190,224,220],c:[240,232,204],d:[214,204,236]};
function exmDraw(){
  const c0=getCity(),L=c0.level,B=c0.B;if(!L)return null;
  const cv=document.createElement('canvas');cv.width=DW*3;cv.height=DH*3;const x=cv.getContext('2d');x.scale(3,3);const ink='#2a2038',halo='rgba(246,240,226,.92)',S=EXM.s,OX=EXM.ox,OY=EXM.oy,PX=a=>OX+a*S,PY=a=>OY+a*S;
  const gr=x.createLinearGradient(0,0,0,DH);gr.addColorStop(0,'#d2cfd8');gr.addColorStop(1,'#b8bccb');x.fillStyle=gr;x.fillRect(0,0,DW,DH);
  x.save();x.globalAlpha=.12;for(let i=0;i<140;i++){x.fillStyle=i%3?'#5a6a8a':'#f2f0fa';x.beginPath();x.ellipse(hs(i,1,170)*DW,hs(i,2,170)*DH,6+hs(i,3,170)*30,3+hs(i,4,170)*14,hs(i,5,170)*3,0,Math.PI*2);x.fill()}x.restore();
  const lab=(t,a,b,sz,col,al)=>{x.save();x.font=`bold ${sz}px ${FUI}`;x.textAlign=al||'center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=3;x.strokeStyle=halo;x.strokeText(t,a,b);x.fillStyle=col||ink;x.fillText(t,a,b);x.restore()};
  // the cells
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=y*W+xx,ch=L.rows[y][xx],h=L.terrace.h[i];let r,g,b;
    if(ch==='.'){const k=B.kind[i];
      if(k===K.COURT||h<-.4){r=150;g=190;b=214}else if(k===K.STAIR){r=214;g=206;b=186}else if(k===K.TERRACE||k===K.PLAT||k===K.BRIDGE){const t=Math.max(0,Math.min(1,h/13));r=246-t*20;g=226-t*60;b=206-t*100}
      else if(k===K.PLAZA){r=250;g=244;b=228}else{const f=L.fmap[y][xx];if(f==='5'){r=204;g=224;b=208}else{r=246;g=240;b=226}}
      if(h>0.4&&k!==K.TERRACE){const t=Math.min(1,h/6)*.18;r*=1-t;g*=1-t*.5;b*=1-t*.2}}
    else{const m=META.get(ch),tn=EXTINT[m?m.t:'a'],wh=m?m.wh:4,sh=Math.max(.58,1-wh*.045);[r,g,b]=tn.map(v=>v*sh)}
    x.fillStyle=`rgb(${r|0},${g|0},${b|0})`;x.fillRect(PX(xx),PY(y),S+.35,S+.35)}
  // stairs: a few short hatch strokes
  x.strokeStyle='rgba(60,48,80,.35)';x.lineWidth=.35;x.beginPath();for(let y=1;y<H-1;y+=1)for(let xx=1;xx<W-1;xx+=1){if(B.kind[y*W+xx]!==K.STAIR||L.rows[y][xx]!=='.')continue;x.moveTo(PX(xx),PY(y)+S);x.lineTo(PX(xx)+S,PY(y))}x.stroke();
  // the spiral: its turns as faint rings
  x.save();x.strokeStyle='rgba(120,80,120,.5)';x.lineWidth=.8;x.beginPath();for(let a=0;a<=CON.TT*Math.PI*2+.01;a+=.05){const t=a/(Math.PI*2),r=CON.R0-CON.P*t,ang=CON.a0+a;const px=PX(CON.cx+r*Math.cos(ang)+.5),py=PY(CON.cy+r*Math.sin(ang)+.5);a?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.restore();
  // the wall
  x.strokeStyle=ink;x.lineWidth=1.6;x.strokeRect(PX(0),PY(0),S*W,S*H);
  // doors
  for(const d of B.doors){if(d.to===null||d.to===undefined)continue;const px=PX(d.x)+S/2,py=PY(d.y)+S/2;
    if(d.to===470){x.fillStyle='#b02a2a';x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.moveTo(px,py-3);x.lineTo(px+3,py+2.4);x.lineTo(px-3,py+2.4);x.closePath();x.fill();x.stroke();continue}
    x.fillStyle='#e0b43a';x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.moveTo(px-2,py+2);x.lineTo(px-2,py-.8);x.quadraticCurveTo(px,py-3.4,px+2,py-.8);x.lineTo(px+2,py+2);x.closePath();x.fill();x.stroke()}
  // names
  const SHORT={guard:'Gatehouse',glubba:'Glubba',wibb:'House of Salves',ubbo:'Elder Ubbo',brollo:'Brollo',root:'Root Cellar',study:'Study',orchard:'Orchard Glasshouse',lamps:'House of Lamps',inn:'The Pearl Rest',pip:'Pip',bells:'Bell Loft',loom:'Weavers',observatory:'Observatory',baths:'Baths',stall:'Cloth'};
  const OFF={study:[8,10],root:[0,9],lamps:[-14,-5],bells:[14,-5],orchard:[-10,2],wibb:[0,8],inn:[8,6]};
  for(const k in SHORT){const d=ROOMLINK[k],o=OFF[k]||[0,-4.5];if(d)lab(SHORT[k],PX(d.ax)+S/2+o[0],PY(d.ay)+S/2+o[1],4.6,'#5a2a1a')}
  lab('THE CONSERVATORY SPIRAL',PX(CX)+S/2,PY(CY)+S/2,6.2,'#4a1a5a');
  lab('ROOT WELL',PX(RW.cx),PY(RW.cy)-12,5,'#1a3a5a');lab('ARCADE MAZE',PX(44),PY(44),5,ink);lab('PEARL ORCHARD',PX(106),PY(43),5,ink);lab('WILLOW POND',PX(43),PY(107),5,ink);
  lab('HILL OF BALCONIES',PX(17),PY(75)-14,5.6,'#2a1a50');lab('SPIRE QUARTER',PX(75)-34,PY(20),5.6,'#2a1a50');lab('SUNKEN GARDENS',PX(132),PY(75)-14,5.6,'#2a1a50');lab('GATE QUARTER',PX(75)-34,PY(138),5.6,'#2a1a50');
  lab('SOUTH GATE',PX(CX),PY(H)+7,5.4,'#7a1a1a');lab('NORTH GATE',PX(CX),PY(0)-6,5.4,'#7a1a1a');lab('THE BELVEDERE',PX(3),PY(70),4.4,ink);
  // title, notes, key
  x.save();x.font=`18px ${FTITLE}`;x.textAlign='left';x.textBaseline='middle';x.fillStyle=ink;x.fillText('Exsce',8,14);x.fillText('the shell city',8,32);x.restore();
  lab('stairs up, steps down',9,48,6.6,'#4a3a5c','left');lab('lamps in every street',9,58,6.6,'#4a3a5c','left');
  const lx=368,ly0=70;x.fillStyle=ink;x.font=`bold 8px ${FUI}`;x.textAlign='left';x.fillText('KEY',lx,ly0-10);
  const key=(i,t,draw)=>{const yy=ly0+i*17;draw(lx+8,yy);lab(t,lx+20,yy,6.2,'#3a2a4c','left')};
  key(0,'Street',(a,b)=>{x.fillStyle='#f6f0e2';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(a-5,b-3,10,6);x.strokeRect(a-5,b-3,10,6)});
  key(1,'House (tall = darker)',(a,b)=>{x.fillStyle='#e8c8d4';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(a-5,b-3,10,6);x.strokeRect(a-5,b-3,10,6)});
  key(2,'Stairs',(a,b)=>{x.fillStyle='#d6cebA';x.fillRect(a-5,b-3,10,6);x.strokeStyle='rgba(60,48,80,.6)';x.lineWidth=.5;x.beginPath();for(let k=-5;k<=3;k+=2.5){x.moveTo(a+k,b+3);x.lineTo(a+k+3,b-3)}x.stroke()});
  key(3,'Sunken ground',(a,b)=>{x.fillStyle='#96bed6';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(a-5,b-3,10,6);x.strokeRect(a-5,b-3,10,6)});
  key(4,'Higher ground',(a,b)=>{x.fillStyle='#e8a890';x.strokeStyle=ink;x.lineWidth=.6;x.fillRect(a-5,b-3,10,6);x.strokeRect(a-5,b-3,10,6)});
  key(5,'Door',(a,b)=>{x.fillStyle='#e0b43a';x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.moveTo(a-2,b+2);x.lineTo(a-2,b-.8);x.quadraticCurveTo(a,b-3.4,a+2,b-.8);x.lineTo(a+2,b+2);x.closePath();x.fill();x.stroke()});
  key(6,'Gate to the grassland',(a,b)=>{x.fillStyle='#b02a2a';x.strokeStyle=ink;x.lineWidth=.6;x.beginPath();x.moveTo(a,b-3);x.lineTo(a+3,b+2.4);x.lineTo(a-3,b+2.4);x.closePath();x.fill();x.stroke()});
  { const a=OX+S*W-14,b=OY+14;x.save();x.translate(a,b);x.strokeStyle=ink;x.fillStyle='#e8e4f2';x.lineWidth=1;x.beginPath();x.arc(0,0,8,0,Math.PI*2);x.fill();x.stroke();x.fillStyle=ink;x.beginPath();x.moveTo(0,-12);x.lineTo(2.6,0);x.lineTo(0,-2.2);x.lineTo(-2.6,0);x.closePath();x.fill();x.restore();lab('N',a,b-16,7,ink)}
  return cv}
function exmOverview(){
  if(!EXM.cv)EXM.cv=exmDraw();
  MPL.reveal=false;if(EXM.cv)mplPaint(EXM.cv,3,{x:112,y:38,w:252,h:254},cx=>EXM.ox+cx*EXM.s,cy=>EXM.oy+cy*EXM.s,'You are the yellow arrow.');
}
{const _do=drawOverview;drawOverview=function(){if(LEVEL===ID&&LEVELS[ID]&&!G.world&&!G.teleMode){exmOverview();return}return _do.apply(this,arguments)}}
{const _mf=mplFogOn;mplFogOn=function(L){if(L&&LEVEL===ID&&L===LEVELS[ID])return false;return _mf.apply(this,arguments)}} // a city map is shown whole
// some of the side streets are shut by walls (dead ends and bigger blocks), as long as everything stays reachable
function closeStreets(B){
  const segs=[];
  for(const col of [[22,24],[12,14]])YB.forEach((yr,j)=>segs.push({x0:col[0],x1:col[1],y0:yr[0],y1:yr[1]}));
  for(const col of [[44,46],[58,60],[90,92],[104,106]])for(const j of [0,1,8,9])segs.push({x0:col[0],x1:col[1],y0:YB[j][0],y1:YB[j][1]});
  YB.forEach((yr,j)=>segs.push({x0:125,x1:127,y0:yr[0],y1:yr[1]}));
  for(const ys of [[17,19],[46,48],[60,62],[88,90],[102,104],[131,133]]){for(const xb of XB.west)segs.push({x0:xb[0],x1:xb[1],y0:ys[0],y1:ys[1]});for(const xb of XB.east)segs.push({x0:xb[0],x1:xb[1],y0:ys[0],y1:ys[1]})}
  for(const xb of XB.north){segs.push({x0:xb[0],x1:xb[1],y0:17,y1:19});segs.push({x0:xb[0],x1:xb[1],y0:131,y1:133})}
  let closed=0;const total=()=>{let n=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(B.rows[y][x]==='.')n++;return n};
  const prot=allBlocks().filter(b=>PLAN[b.id]);
  segs.forEach((sg,k)=>{if(hs(sg.x0,sg.y0,180)>.15)return;
    if(prot.some(b=>sg.x1>=b.x0-1&&sg.x0<=b.x1+1&&sg.y1>=b.y0-1&&sg.y0<=b.y1+1))return;
    // skip streets that already hold ravine/eastlane cells
    const saved=[];for(let y=sg.y0;y<=sg.y1;y++)for(let x=sg.x0;x<=sg.x1;x++)saved.push([x,y,B.rows[y][x],B.h[y*W+x],B.kind[y*W+x],B.fl[y*W+x]]);
    if(saved.some(s=>s[3]<0))return;
    const before=total()-saved.filter(s=>s[2]==='.').length;
    for(const [x,y] of saved)Wl(B,x,y,massChar(x,y,PROF[region(x,y)]||PROF.north),ground(x,y));
    const rr=hgtlReach(B,CX,H-3);
    if(rr.count<before){for(const [x,y,c,h,kd,f] of saved){B.rows[y][x]=c;B.h[y*W+x]=h;B.kind[y*W+x]=kd;B.fl[y*W+x]=f}}else closed++});
  B.info.closed=closed}
/* the far sky towers are painted over everything when a tall step fills the screen (the engine keeps no depth for a riser), so they are left out while one is close ahead */
{const _sk=khSkyList;khSkyList=function(cx,cy,dX,dY){const r=_sk.apply(this,arguments);if(LEVEL!==ID||!r.length||!TERR_NOW||!TERR_NOW.terr)return r;
  const T=TERR_NOW;
  for(const ang of [0,.35,-.35,.65,-.65]){const c=Math.cos(ang),s=Math.sin(ang),rx=dX*c-dY*s,ry=dX*s+dY*c;
    for(let k=1;k<=7;k+=.5){const ix=Math.floor(cx+rx*k),iy=Math.floor(cy+ry*k);if(ix<0||iy<0||ix>=T.W||iy>=T.H)break;if(G.grid[iy][ix]>0)break;if((T.h[iy*T.W+ix]-CAMZ)/(k*c)>=.3)return[]}}
  return r}}
//@@MORE
return {ID,W,H,CX,CY,getCity,buildCity,finalize,assemble,conT,rwT,hillH,META,mkTile,wallGid,get CITY(){return CITY},reset(){CITY=null}};
})();
