/* ==========================================================================
   THE BLIGHTED ROAD, POLISH FOR PLACES 1 TO 4 (prefix b14 / B14): the Toll House (9610), Ashenfold Farm (9620), the Church of the Hollow Saint (9630), Gallowmere (9640) and their rooms.
   Last in ORDER. It gives the four builders shared helpers (dead wall styles, dead copies of painted props, ground patches) and wraps the weather.
   Nothing here is drawn in code except filters over painted pieces. See tools/polish/blight1to4_CRITIC.md for the faults and tools/polish/blight1to4_NOTES.md for what was done.
   Helpers: b14Dead(key,src,filter,h) makes a filtered copy of a painted picture once and returns its key. b14Styles() registers the dark wall styles (WL.sty.dflint, dbrick, dtimber, dhoney, dwhite).
   b14Patches(C,opt) lays patches of bare earth and mud on the grass. b14Furrows(C,x0,y0,x1,y1) ploughs a field. b14Dressing(C,id) is the prop pass of each place.
   ========================================================================== */
const B14={ids:[9610,9620,9630,9640]};
const b14Mine=id=>id>=9610&&id<=9643;
/* ---- the air: a darker, greener fog ---- */
{const _w=weatherNow;weatherNow=function(){
  const r=_w.apply(this,arguments);
  if(r&&r.id==='fog'&&b14Mine(LEVEL)){const L=LEVELS[LEVEL];if(L&&L.outdoor)return Object.assign({},r,{col:[70,82,68],mix:.65,haze:.32})}
  return r}}
/* ---- dead copies of painted pieces ---- */
function b14Dead(key,src,filter,h){
  if(IMG[key])return key;
  const im=IMG[src];if(!im||!im.width)return src;
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');try{x.filter=filter||'saturate(.35) brightness(.62)'}catch(e){}x.drawImage(im,0,0);x.filter='none';
  x.globalCompositeOperation='multiply';x.fillStyle='rgb(190,200,186)';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='destination-in';x.drawImage(im,0,0);
  IMG[key]=c;NPC_H[key]=h||NPC_H[src]||1;return key}
const B14_ROOF='saturate(.3) brightness(.56) sepia(.25)';
function b14Roof(k){return b14Dead('b14r_'+k,k,B14_ROOF)}
/* the dark wall styles: the Wenlock sheets, greyed and dimmed (tint is a multiply) */
function b14Styles(){
  if(typeof OH_STY==='undefined'||typeof WL==='undefined'||!WL.sty)return;
  const mk=(name,from,tint)=>{const S=OH_STY[from];if(!S)return;OH_STY[name]=Object.assign({},S,{tint:tint});WL.sty[name]=name};
  mk('dflint',WL.sty.flint||'wlgrey',[112,118,112,0]);mk('dbrick',WL.sty.brick||'brick',[104,92,90,0]);mk('dtimber',WL.sty.timber||'timber',[104,108,100,0]);
  mk('dhoney',WL.sty.honey||'golden',[110,110,100,0]);mk('dwhite',WL.sty.white||'cottage',[100,106,100,0]);mk('dblack',WL.sty.black||'timber',[118,120,114,0])}
/* ---- noise for the patches ---- */
function b14Noise(hs,x,y,cs,sd){const u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
  return(hs(i,j,sd)*(1-sx)+hs(i+1,j,sd)*sx)*(1-sy)+(hs(i,j+1,sd)*(1-sx)+hs(i+1,j+1,sd)*sx)*sy}
/* patches of bare earth ('1') and wet mud ('5') on the grass ('0'): never on a path, a reserved square or the boundary. opt: {earth:.66, mud:.78, cs:6, keep:fn} */
function b14Patches(C,opt){
  opt=opt||{};const hs=C.hs,W=C.W,H=C.H,E=opt.earth===undefined?.58:opt.earth,M=opt.mud===undefined?.72:opt.mud,cs=opt.cs||5;
  for(let y=C.Y0;y<=C.Y1;y++)for(let x=C.X0;x<=C.X1;x++){
    const i=y*W+x;if(C.fm[i]!=='0'||C.path.has(x+','+y)||(opt.keep&&opt.keep(x,y)))continue;
    const n=b14Noise(hs,x,y,cs,C.id+91)*.75+b14Noise(hs,x,y,2.5,C.id+92)*.25;
    if(n>M)C.fm[i]='5';else if(n>E)C.fm[i]='1'}}
/* a ploughed field: furrows of mud every third row, stalks standing on the ridges. dense: chance of a stalk on a ridge cell */
function b14Furrows(C,x0,y0,x1,y1,dense){
  const hs=C.hs;dense=dense||.8;
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    if(C.path.has(x+','+y))continue;
    if(y%3===0){C.fm[y*C.W+x]='5';continue}
    if(hs(x,y,141)>dense)continue;
    const k=hs(x,y,145)<.45?'ww_twig2':'bl_grass'+((hs(x,y,146)*4)|0);
    const d=C.D(k,x,y,{sc:.8+hs(x,y,142)*.7});if(d){d.ox=(hs(x,y,143)-.5)*.3;d.oy=(hs(x,y,144)-.5)*.2}}}
/* a prop dressing helper: list of [key,x,y,opt] placed with dec (exact) */
function b14Place(C,list){for(const [k,x,y,o] of list)C.dec(k,x,y,Object.assign({block:true},o||{}))}
/* ---- wrap the kit: the four builders get the dark styles, and every roof of the four places is dimmed at C.finish ---- */
{const _k=blKit;blKit=function(spec){
  const C=_k.apply(this,arguments);
  if(b14Mine(spec.id)){
    b14Styles();
    const fin=C.finish;
    C.finish=function(o){
      try{for(const s of C.sky){if(s.k&&!s.big&&IMG[s.k])s.k=b14Roof(s.k)}}catch(e){console.error('b14 roofs',e)}
      // the bright Wenlock garden pieces (flower barrows, crates, sacks) are dimmed to dead copies
      try{for(const d of C.decor){if(/^kh_ohgard\d_\d$/.test(d.k)||/^kh_oqstuff_[89]$/.test(d.k)||d.k==='gy_rose'){const k2=b14Dead('b14d_'+d.k,d.k,'saturate(.25) brightness(.58)');if(IMG[k2])d.k=k2}}}catch(e){console.error('b14 decor',e)}
      return fin.apply(this,arguments)}}
  return C}}

/* ---- the mere: cold grey-green water with long pale ripples (the game's water goes brown under the warm party light and shows no shine, so the fen read as bare mud). Made in code, as walls and floors may be. ---- */
function b14Mere(){
  if(FLOORS.b14_mere)return 'b14_mere';
  const N=128,d=new Uint8ClampedArray(N*N*4),TAU2=Math.PI*2,hh=(a,b,c)=>hash2(a,b,c);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const w=Math.sin(TAU2*(y*3/N+.28*Math.sin(TAU2*x*2/N)))*.5+.5,w2=Math.sin(TAU2*(x*2/N+y*5/N+.2*Math.sin(TAU2*y*3/N)))*.5+.5,m=w*.6+w2*.4;
    let r=70+34*m,g=104+44*m,b=106+40*m;
    const i=(y*N+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255}
  // pale ripple dashes and a few dark weed flecks (wrapped, so the tile joins)
  for(let n=0;n<46;n++){const cx=(hh(n,1,301)*N)|0,cy=(hh(n,2,301)*N)|0,len=6+((hh(n,3,301)*14)|0),pale=hh(n,4,301)>.3;
    for(let k=0;k<len;k++){const x=(cx+k)%N,y=cy%N,i=(y*N+x)*4,a=Math.sin(Math.PI*k/len)*(pale?.5:.35);
      if(pale){d[i]+=(210-d[i])*a;d[i+1]+=(225-d[i+1])*a;d[i+2]+=(225-d[i+2])*a}else{d[i]*=1-a;d[i+1]*=1-a*.8;d[i+2]*=1-a*.8}}}
  FLOORS.b14_mere=d;return 'b14_mere'}

/* ---- the rooms of the four places: bone heaps were drawn a metre across (now a handful of bones), webs in the corners, candle stubs and cold window light so the cosy rooms look blighted, and the barn, cellar, belfry and vestry, which stood nearly empty, get their furniture ---- */
const B14_ROOMX={
  9622:b=>{b.prop('shelving',1,1,{h:1.2});b.prop('coopstack',6,1,{h:.95});b.raw('barrel',1,5,{sc:.9});b.raw('crate',4,6,{sc:.9});b.raw('crate',5,6,{sc:.8});b.raw('hay',9,3,{sc:.8})},
  9623:b=>{b.raw('hay',1,2,{sc:1.1});b.raw('hay',1,3,{sc:1.0});b.raw('hay',11,3,{sc:1.0});b.prop('cothearth',8,1,{h:.95});b.prop('waterbarrel',1,8,{h:.7});b.raw('crate',3,7,{sc:.9});b.raw('crate',4,7,{sc:.8});b.raw('barrel',10,8,{sc:.9});
    b.raw('wl_prop1_5',3,4,{sc:.42,block:true});b.raw('hay',6,8,{sc:.9,block:false})},
  9633:b=>{b.prop('bookshelf',1,1,{h:1.1});b.prop('candlerack',3,1,{h:1.0});b.prop('candlerack',9,1,{h:1.0});b.raw('crate',1,8,{sc:.8});b.raw('hay',11,8,{sc:.8})},
  9634:b=>{b.prop('bookshelf',1,1,{h:1.1});b.prop('candlerack',5,1,{h:1.0});b.prop('coatrack',9,1,{h:1.0});b.prop('waterbarrel',1,7,{h:.7});b.prop('tapestry',7,1,{h:1.0,block:false})}
};
function b14RoomDress(id,b){
  try{if(B14_ROOMX[id])B14_ROOMX[id](b)}catch(e){console.error('b14 room x',id,e)}
  const W=b.W,H=b.H,free=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&!b.has(x,y);
  // webs in the top corners and above the door side, a few bone fragments and candle stubs on free cells, none in the middle of the room or beside the door
  for(const [x,y] of [[1,1],[W-2,1],[1,H-2],[W-2,H-2]])if(free(x,y))b.raw('gy_web',x,y,{block:false,sc:.5});
  let n=0;for(let k=0;k<40&&n<4;k++){const x=1+((hash2(k,id,311)*(W-2))|0),y=1+((hash2(k,id,312)*(H-3))|0);if(!free(x,y)||Math.abs(x-(W>>1))<2&&y>H-4)continue;b.raw('gy_bones',x,y,{block:false,sc:.25});n++}
  n=0;for(let k=0;k<30&&n<3;k++){const x=1+((hash2(k,id,313)*(W-2))|0),y=1+((hash2(k,id,314)*(H-3))|0);if(!free(x,y)||Math.abs(x-(W>>1))<2&&y>H-4)continue;b.raw('gy_candles',x,y,{block:false,sc:.35});n++}}
{const _r=blRoom;blRoom=function(spec){
  if(b14Mine(spec.id)){
    const ob=spec.build;
    spec.build=function(C){if(ob)ob.apply(this,arguments);
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){}};
      b14RoomDress(spec.id,{raw:C.raw,put:C.put,W:C.W,H:C.H,has:C.has,prop:P})};
    // a cold light from the window side: every cosy room gets one pale light
    if(spec.lights&&!spec.b14){spec.b14=1;const w=spec.w,h=spec.h;spec.lights=spec.lights.concat([[w-2,h-2]]);spec.lcol=Object.assign({},spec.lcol||{});spec.lcol[(w-2)+','+(h-2)]=[.7,1.1,.95]}}
  const L=_r.apply(this,arguments);
  return L}}
