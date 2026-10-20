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
function pat(t,wh,v){const T=TN[t],n=Math.ceil(wh-1e-6),l=[];for(let u=0;u<n;u++){const top=u===n-1&&wh>=3;l.push(top?T.b:u===0?T.p:((u+v)%3===1?T.w:T.p))}return l}
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
  const lx=Math.floor((x+hs(y>>3,3,7)*3)/4),ly=Math.floor((y+hs(x>>3,5,7)*3)/4),r=hs(lx,ly,8),t=TINTS[(hs(lx,ly,9)*4)|0],v=(hs(lx,ly,10)*3)|0;
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
  const core=wc('d',13,0),coreB=wc('b',13,1),coreC=wc('c',13,2);
  for(let y=CON.cy-3;y<=CON.cy+3;y++)for(let x=CON.cx-3;x<=CON.cx+3;x++){const r=Math.hypot(x-CON.cx,y-CON.cy);if(r<=2.6){const h=hAt(B,x,y);Wl(B,x,y,r<1.2?coreC:(x+y)&1?core:coreB,h)}}
  info.studyDoor={x:CON.cx+2,y:CON.cy,face:1,ax:CON.cx+3,ay:CON.cy}}

/* the sunken counterpart: the Root Well, a spiral stair running DOWN round a drum, 8 deep, with a door at the bottom */
const RW={cx:108,cy:75,R0:7.5,P:4,TT:2.2,D:8};
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
function street(B,x0,y0,x1,y1,d){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<=0||y<=0||x>=W-1||y>=H-1)continue;O(B,x,y,ground(x,y),kindOf(x,y));fl(B,x,y,d===undefined?0:d)}}

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
  districts(B,info);
  gates(B,info);
  streetDecor(B);boxDecor(B);
  B.start={x:CX,y:H-3,f:0};
  return B}
function gates(B,info){
  const gw=doorGid('d',7,{lvl:470,at:{x:75,y:90,f:2}},'hgt_d2'),gn=doorGid('d',7,{lvl:470,at:{x:75,y:66,f:0}},'hgt_d2');
  Wl(B,CX,H-1,hgtaChar(gw),0);B.doors.push({x:CX,y:H-1,face:0,ax:CX,ay:H-2,to:470});
  Wl(B,CX,0,hgtaChar(gn),0);B.doors.push({x:CX,y:0,face:2,ax:CX,ay:1,to:470});
  info.gateS={x:CX,y:H-1,ax:CX,ay:H-2};info.gateN={x:CX,y:0,ax:CX,ay:1}}

/* ---------- finishing: feet, unreachable cells, risers, floors, the level object ---------- */
function finalize(B){
  const info=B.info,dirs=HGTL.DIRS;
  // walls reach down to the lowest open cell beside them (so nothing floats), keeping their tops
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const ch=B.rows[y][x];if(ch==='.')continue;const m=META.get(ch),dd=DOORS.get(ch);if(!m&&!dd)continue;const i=y*W+x;let mn=1e9;
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
  L.floorSet=['hgt_f0','hgt_f5','hgt_f2','hgt_f3','hgt_f4','hgt_f7'];L.floor='hgt_f0';L.ceil='tomb';L.ceilH=3;L.amb=.88;L.noExtras=true;L.noTele=true;L.sky=[];
  return L}
// library placeholder characters (HGTL_CHARS roles) get painted wall tiles here
const roleChar={};
(function(){for(const role in HGTL_CHARS){const c=HGTL_CHARS[role],wh=HGTL_WH[c];let t='a';const m=/^nacre_([abcd])/.exec(role);if(m)t=m[1];else if(/window|band|secret/.test(role))t='c';else if(/pillar|hedge/.test(role))t='d';
  const v=(role.length*3)%3;META.set(c,{t,wh,v});roleChar[c]=null}})();
function bindRoles(){for(const c in roleChar){const m=META.get(c);roleChar[c]=wallGid(m.t,m.wh,m.v)}}
function getCity(){if(CITY)return CITY;bindRoles();const B=buildCity();finalize(B);CITY={B,level:assemble(B),info:B.info};return CITY}
LEVEL_NAMES[ID]='Exsce';
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
  B.rows[y][x]=ch;DOORS.set(ch,{t:m.t,wh,link,pic});DOORED.set(x+','+y,1);B.doors.push({x,y,face:face&3,ax,ay,to:room?room.id:null});
  if(spec){ROOMLINK[spec]={x,y,face:face&3,ax,ay};B.info.rooms=B.info.rooms||[];B.info.rooms.push(spec)}
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
function tBalcony(B,bk,side,spec,o){o=o||{};const f=frame(bk,side);if(f.A<9||f.Bd<5)return null;
  const a0=o.a0===undefined?2:o.a0,n=o.steps||6,L=Math.min(f.A-3-a0,n+4),[fx,fy]=f.front(a0),base=hAt(B,fx,fy);if(!isO(B,fx,fy))return null;
  let hp=base;
  for(let k=0;k<n;k++){const [x,y]=f.at(a0+k,0);hp=r2(base+HGTL.STEP*(k+1));O(B,x,y,hp,K.STAIR);fl(B,x,y,4)}
  for(let a=a0+n;a<a0+L;a++)for(let b=0;b<2;b++){const [x,y]=f.at(a,b);O(B,x,y,hp,K.PLAT);fl(B,x,y,1)}
  const am=a0+n+((L-n)>>1),[dx,dy]=f.at(am,2),door=doorOn(B,dx,dy,f.face,spec,{wh:o.wh||3.4,pic:o.pic});
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
    const [dx,dy]=f.at(a0+(wc_>>1),hb);door=doorOn(B,dx,dy,(f.face+2)&3,spec,{wh:3.4,pic:o.pic})}
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
  north3_0:['balcony','S','lamps'],north4_1:['balcony','N','bells'],
  east1_2:['sunken','N','brollo'],east1_6:['sunken','S','baths'],
  south3_9:['door','W','guard'],south2_8:['door','E','inn'],south1_9:['door','N','stall']};
const WEIGHTS={
  west:[['balcony',.26],['court',.18],['sunken',.1],['alley',.14],['tower',.1],['garden',.04],['mass',.18]],
  north:[['tower',.28],['balcony',.18],['court',.12],['alley',.14],['garden',.06],['mass',.22]],
  east:[['sunken',.34],['court',.18],['garden',.1],['alley',.1],['mass',.28]],
  south:[['court',.2],['square',.1],['alley',.18],['balcony',.14],['tower',.1],['mass',.28]]};
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
  else if(t==='square')ok=tSquare(B,bk);
  else if(t==='door'){sideDoor(B,bk,side,.5,spec)}
  if(!ok&&plan&&plan[2]){ // a planned room that did not fit: put its door in plainly
    for(const sd of sidesFor(bk)){if(sideDoor(B,bk,sd,.5,plan[2]))break}}
  // shut doors painted on the facades of every block
  if(!plan||t==='mass'){const n=bk.reg==='north'||bk.reg==='south'?2:3;for(let i=0;i<n;i++){const sd=sides[(hs(bk.x0,bk.y0,95+i)*sides.length)|0];sideDoor(B,bk,sd,hs(bk.x0+i,bk.y0,96+i),null)}}
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
    else if(r<.07)plant(B,['shrub','pearlbush','fern','crystalgrass','shellflower','bulbflower','lightvine'][(hs(x,y,98)*7)|0],x,y,.85+hs(x,y,99)*.7)}}
// the middle of the box: lawn with trees and lamps (the gardens are made later)
function boxDecor(B){
  for(let y=33;y<=117;y++)for(let x=33;x<=117;x++){if(!isO(B,x,y))continue;const r=hs(x,y,100);
    if(B.fl[y*W+x]===53&&B.kind[y*W+x]===K.GROUND){ // lawn
      if(r<.05)plant(B,['fairytree','willow','giantcap','pearlbush','shrub','fern','reeds'][(hs(x,y,101)*7)|0],x,y,.9+hs(x,y,102)*.9);
      else if(r<.09)plant(B,['crystalgrass','mushrooms','shellflower','bulbflower','fern'][(hs(x,y,103)*5)|0],x,y,.9+hs(x,y,104)*.6)}}}
//@@MORE
return {ID,W,H,CX,CY,getCity,buildCity,finalize,assemble,conT,rwT,hillH,META,mkTile,wallGid,get CITY(){return CITY},reset(){CITY=null}};
})();
