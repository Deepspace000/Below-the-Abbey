/* ==========================================================================
   THE NEVER-ENDING TOWER: THE LOOK (prefix nt / NT). Every floor of the tower has its own colour and its own look. All of it is worked out from the floor number alone,
   so a floor looks the same every time it is built and nothing but flags has to be saved.
   ntRng(seed)            a small seeded random generator (mulberry32)
   ntPalette(n)           hue, saturation, brightness; wall tint, floor tint, ceiling tint, flame, fog, light colour
   ntLook(n)              the look set: wall family and pattern, floor kinds, ceiling, wall height, ambient light, fog, name
   ntWallTiles(n,look)    the wall tiles of a floor (gyTile with a code pattern drawn on the painted stone), stairs, accent tiles
   ntFloorSet(n,look)     the floor textures of a floor
   Notes: tools/NT_NOTES.md
   ========================================================================== */
const NT={BASE:1e9,TOP:1e15,ready:false,loading:null,SHOP_EVERY:7,GUARD_EVERY:10,DEBUG:false};
/* the numbers: floor n has the level id BASE+n; floor 0 is the entrance hall, "The Crooked Tower" */
const ntIs=n=>typeof n==='number'&&n>=NT.BASE&&n<NT.TOP;
const ntFloorOf=n=>n-NT.BASE;
const ntIdOf=f=>NT.BASE+f;
const ntRatingOf=f=>99+f;
function ntSeed(n,salt){   // a 32 bit seed from a floor number (floors can be far above 2^32) and a salt
  const lo=n%4294967296,hi=Math.floor(n/4294967296);
  let h=Math.imul(lo^0x9e3779b9,0x85ebca6b)^Math.imul(hi+0x7f4a7c15,0xc2b2ae35)^Math.imul((salt|0)+0x165667b1,0x27d4eb2f);
  h^=h>>>15;h=Math.imul(h,0x2c1b3c6d);h^=h>>>12;h=Math.imul(h,0x297a2d39);h^=h>>>15;return h>>>0}
function ntRng(seed){let a=seed>>>0;const f=()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
  f.int=(lo,hi)=>lo+Math.floor(f()*(hi-lo+1));f.pick=a=>a[Math.floor(f()*a.length)];f.chance=p=>f()<p;return f}
function ntHsv(h,s,v){h=((h%360)+360)%360;const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;let r=0,g=0,b=0;
  if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}return [r+m,g+m,b+m]}
/* ---------- the colour of a floor ---------- */
const NT_HUEWORDS=['Crimson','Vermilion','Amber','Saffron','Golden','Olive','Moss','Verdant','Emerald','Jade','Verdigris','Teal','Cyan','Azure','Cobalt','Sapphire','Indigo','Violet','Amethyst','Orchid','Magenta','Rose','Cerise','Scarlet'];
const NT_MODS=[['Pale',.5,.95],['Deep',.85,.62],['Dusky',.5,.6],['Bright',.95,.95],['Ashen',.3,.8],['Smoky',.4,.55],['Rich',.8,.8]];
/* flames: 0 orange, 1 red, 2 purple, 3 blue, 4 yellow; their hue in degrees */
const NT_FLAMES=[[0,28],[1,2],[2,285],[3,215],[4,52]];
function ntPalette(n){
  const R=ntRng(ntSeed(n,11));
  const hue=((n*137.508)+R()*18)%360;           // the golden angle: any two floors that follow each other are far apart in hue
  const mod=NT_MODS[Math.floor(R()*NT_MODS.length)],useMod=R()<.55;
  const sat=useMod?mod[1]:.42+R()*.38,val=useMod?mod[2]:.66+R()*.3;
  const wall=ntHsv(hue,sat,val),wl=(wall[0]+wall[1]+wall[2])/3||.3;
  const norm=c=>{const l=(c[0]+c[1]+c[2])/3||.3;return c.map(v=>v/l)};   // a tint to multiply a grey stone with: mean 1, so the stone keeps its own lightness
  const tint=norm(ntHsv(hue,Math.min(.85,sat*1.1),Math.max(.55,val)));
  const fh=(hue+(R()<.5?55:-55)+360)%360,ftint=norm(ntHsv(fh,sat*.5,.8));   // the floor leans away from the wall's hue, so a floor reads as stone under coloured walls
  const th=(hue+R.pick([-40,-20,0,20,40])+360)%360;   // the torch light is near the stone's own colour
  let best=NT_FLAMES[0],bd=999;for(const f of NT_FLAMES){const d=Math.min(Math.abs(f[1]-th),360-Math.abs(f[1]-th));if(d<bd){bd=d;best=f}}
  const lc=ntHsv(th,.55+R()*.3,1),lcol=lc.map(v=>+(v*1.4+.12).toFixed(3));
  const name=NT_HUEWORDS[Math.floor(hue/15)%24];
  const modName=useMod?mod[0]:null;
  return {hue,sat,val,wallTint:tint,floorTint:ftint,ceilTint:norm(ntHsv((hue+20)%360,sat*.5,.7)),flame:best[0],flameHue:best[1],lcol,fog:ntHsv(hue,sat*.45,.55),name,modName,css:'rgb('+wall.map(v=>Math.round(v*255)).join(',')+')',lightness:wl}}
/* ---------- the look set ---------- */
const NT_KINDS=['dense','semi','sparse','spiral','cross','ring','caves'];
const NT_KIND_WORDS={dense:['Warrens','Labyrinth','Tangle','Maze'],semi:['Galleries','Chambers','Cloisters','Passages'],sparse:['Halls','Vaults','Colonnades','Atria'],spiral:['Spiral','Coil','Winding Stair'],cross:['Crossways','Transepts','Four Wings'],ring:['Circuit','Orbit','Round'],caves:['Grottoes','Caverns','Hollows']};
const NT_WALLS=['texGrey','texBone','texBlack','texRed'];
const NT_PATTERNS=['ashlar','brick','panels','flutes','studs','lattice','runes','herring','planks','scales','chevrons','rough'];
const NT_FLOORKINDS=['gyf_flag','gyf_slate','gyf_cobble','gyf_gravel','gyf_bone','gyf_dirt'];
const NT_CEILS=['gyc_0','gyc_1','gyc_2','gyc_3','gyc_crypt'];
/* the layout kind of a floor: a seeded pick, never the same as the picked kind of the floor before it */
function ntKindOf(n){ if(n===1)return 'semi';   // even floors draw from one set of kinds and odd floors from the other, so two floors that follow each other never share a kind
  const r=ntRng(ntSeed(n,3))();
  if(n%2===0)return r<.4?'dense':r<.6?'spiral':r<.8?'ring':'caves';
  return r<.4?'semi':r<.8?'sparse':'cross'}
function ntLook(n){
  const R=ntRng(ntSeed(n,17)),P=ntPalette(n),kind=ntKindOf(n);
  const pk=n>1?ntPalette(n-1):null;
  let wallBase=R.pick(NT_WALLS);
  if(wallBase==='texRed'&&!(P.hue<40||P.hue>320))wallBase='texGrey';   // the red stone only where the floor is red anyway
  let pat=Math.floor(R()*NT_PATTERNS.length);
  if(n>1){const pp=ntSeed(n-1,19)%NT_PATTERNS.length;if(pat===pp)pat=(pat+1+Math.floor(R()*5))%NT_PATTERNS.length}
  const look={n,kind,pal:P,wallBase,wallVar:Math.floor(R()*6),pattern:NT_PATTERNS[pat],patN:pat,
    floorA:R.pick(NT_FLOORKINDS),floorB:R.pick(NT_FLOORKINDS),floorKind:R.pick(['checker','diamond','stripe','plain']),ceil:R.pick(NT_CEILS),
    wh:+(1.35+R()*.5).toFixed(2),amb:+(.07+R()*.06).toFixed(3),fogDen:+(R()*.5).toFixed(2),lamp:P.lcol};
  look.name='Floor '+n+': The '+(P.modName?P.modName+' ':'')+P.name+' '+R.pick(NT_KIND_WORDS[kind]);
  look.short='The '+(P.modName?P.modName+' ':'')+P.name+' '+R.pick(NT_KIND_WORDS[kind]);
  look.pk=pk;return look}
/* two floors one after the other differ if their hues are far apart or their patterns and stone differ: used by the tests */
function ntLooksDiffer(a,b){
  const dh=Math.min(Math.abs(a.pal.hue-b.pal.hue),360-Math.abs(a.pal.hue-b.pal.hue));
  return dh>=50&&(a.pattern!==b.pattern||a.wallBase!==b.wallBase||a.kind!==b.kind)}
/* ---------- the patterns drawn on the wall stone (a canvas 128 across, tiling sideways) ---------- */
function ntDrawPattern(x,w,h,pat,rr){
  x.save();x.lineCap='butt';
  const dark='rgba(0,0,0,.42)',lite='rgba(255,255,255,.16)',line=(x0,y0,x1,y1,c,lw)=>{x.strokeStyle=c;x.lineWidth=lw||1;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke()};
  const vseg=(p)=>{for(let k=0;k<3;k++){}};
  if(pat==='ashlar'){const ch=32;for(let y=0,r=0;y<h;y+=ch,r++){line(0,y,w,y,dark,1.6);line(0,y+1.6,w,y+1.6,lite,1);const off=(r%2)*32;for(let xx=off;xx<w+64;xx+=64){const xc=xx%w;line(xc,y,xc,y+ch,dark,1.6)}}}
  else if(pat==='brick'){const bh=10,bw=32;for(let y=0,r=0;y<h;y+=bh,r++){line(0,y,w,y,dark,1);const off=(r%2)*(bw/2);for(let xx=off;xx<w+bw;xx+=bw){const xc=xx%w;line(xc,y,xc,y+bh,dark,1)}}}
  else if(pat==='panels'){const pw=64;for(let xx=0;xx<w;xx+=pw){const ph=h*.8,y0=(h-ph)/2;x.strokeStyle=dark;x.lineWidth=2;x.strokeRect(xx+8,y0,pw-16,ph);x.strokeStyle=lite;x.lineWidth=1;x.strokeRect(xx+11,y0+3,pw-22,ph-6)}}
  else if(pat==='flutes'){for(let xx=4;xx<w;xx+=16){line(xx,0,xx,h,dark,3);line(xx+3,0,xx+3,h,lite,2)}}
  else if(pat==='studs'){for(let y=16;y<h;y+=32)for(let xx=16;xx<w;xx+=32){x.fillStyle=lite;x.beginPath();x.arc(xx,y,4,0,6.3);x.fill();x.fillStyle=dark;x.beginPath();x.arc(xx+1.5,y+1.5,3,0,6.3);x.fill()}for(let y=0;y<h;y+=64)line(0,y,w,y,dark,2)}
  else if(pat==='lattice'){for(let k=-h;k<w+h;k+=32){line(k,0,k+h,h,dark,1.5);line(k,h,k+h,0,dark,1.5)}}
  else if(pat==='runes'){for(let y=0;y<h;y+=32){line(0,y,w,y,dark,1)}
    for(let y=8,r=0;y<h-8;y+=32,r++)for(let xx=10;xx<w;xx+=32){const t=(rr(r*7+xx)*4)|0;x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=1.8;x.beginPath();
      if(t===0){x.moveTo(xx,y);x.lineTo(xx+10,y+14);x.moveTo(xx+10,y);x.lineTo(xx,y+14)}else if(t===1){x.moveTo(xx+5,y);x.lineTo(xx+5,y+16);x.moveTo(xx,y+5);x.lineTo(xx+10,y+5)}else if(t===2){x.arc(xx+5,y+8,6,0,6.3)}else{x.moveTo(xx,y+14);x.lineTo(xx+5,y);x.lineTo(xx+10,y+14)}x.stroke()}}
  else if(pat==='herring'){for(let y=0;y<h;y+=16){for(let xx=0;xx<w;xx+=16){line(xx,y,xx+8,y+8,dark,1.4);line(xx+8,y+8,xx+16,y,dark,1.4)}}}
  else if(pat==='planks'){for(let xx=0;xx<w;xx+=21.33){line(xx,0,xx,h,dark,2);line(xx+2,0,xx+2,h,lite,1)}for(let k=0;k<6;k++){const px=rr(k+3)*w,py=rr(k+9)*h;x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(px,py,3,5,0,0,6.3);x.fill()}}
  else if(pat==='scales'){for(let y=0,r=0;y<h+16;y+=12,r++)for(let xx=-(r%2)*8;xx<w+16;xx+=16){x.strokeStyle=dark;x.lineWidth=1.2;x.beginPath();x.arc(xx,y,8,0,Math.PI);x.stroke()}}
  else if(pat==='chevrons'){for(let y=0;y<h+24;y+=24){x.strokeStyle=dark;x.lineWidth=3;x.beginPath();x.moveTo(0,y);for(let xx=0;xx<=w;xx+=32){x.lineTo(xx+16,y-12);x.lineTo(xx+32,y)}x.stroke();x.strokeStyle=lite;x.lineWidth=1.4;x.beginPath();x.moveTo(0,y+3);for(let xx=0;xx<=w;xx+=32){x.lineTo(xx+16,y-9);x.lineTo(xx+32,y+3)}x.stroke()}}
  else{for(let k=0;k<140;k++){x.fillStyle=rr(k+50)<.5?'rgba(0,0,0,.22)':'rgba(255,255,255,.1)';x.fillRect(rr(k)*w,rr(k+300)*h,2+rr(k+7)*4,1+rr(k+11)*3)}}
  x.restore()}
/* ---------- the tiles of a floor ---------- */
const NT_TILES=new Map();      // floor -> {gids:[], texIds:[], keys:[]}: what a floor made, so that it can be given back
function ntOwn(n){let o=NT_TILES.get(n);if(!o){o={gids:[],keys:[]};NT_TILES.set(n,o)}return o}
function ntTile(n,tex,wh,opt){const gid=gyTile(tex,wh,opt);const o=ntOwn(n);if(!o.gids.includes(gid))o.gids.push(gid);return gid}
function ntWallTiles(n,look){
  const P=look.pal,wh=look.wh,tag='nt'+n,rr0=ntRng(ntSeed(n,23)),rr=k=>{const a=Math.sin((k+1)*12.9898+n*78.233)*43758.5453;return a-Math.floor(a)};
  const rgb=P.wallTint,gain=look.wallBase==='texBlack'?1.9:look.wallBase==='texBone'?1.0:look.wallBase==='texRed'?1.1:1.15;
  const vs=[0,1,2,3,4,5].map(i=>(look.wallVar+i)%6),plain=[],mk=(v,extra,ntag)=>ntTile(n,look.wallBase+'_'+v,wh,Object.assign({gain,rgb,tag:tag+ntag,draw:(x,w,h)=>{ntDrawPattern(x,w,h,look.pattern,k=>rr(k+v*13));if(extra)extra(x,w,h)}},{}));
  for(let i=0;i<4;i++)plain.push(mk(vs[i],null,'p'+i));
  const rim=[mk(vs[4],(x,w,h)=>{x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,h-14,w,14)},'r0'),mk(vs[5],(x,w,h)=>{x.fillStyle='rgba(255,255,255,.1)';x.fillRect(0,0,w,10)},'r1')];
  return {plain,rim,far:plain[0],wh,tag}}
/* the stairs: the painted stair picture set in the floor's own stone */
function ntStairTile(n,look,up){
  const P=look.pal;
  return ntTile(n,look.wallBase+'_0',look.wh,{fac:{img:up?'stairFix_1':'stairFix_0',i:0,n:1},gain:1.1,rgb:P.wallTint,tag:'nt'+n+(up?'su':'sd'),emit:.2})}
/* an alcove with a lit candle, set in a wall now and then */
function ntNicheTile(n,look){
  const P=look.pal,c=P.lcol.map(v=>Math.round(Math.min(1,v/1.6)*255));
  return ntTile(n,look.wallBase+'_0',look.wh,{fac:{img:'cryptD_3',i:0,n:1},gain:.95,rgb:P.wallTint,tag:'nt'+n+'nic',emit:.14,draw:(x,w,h)=>{
    x.globalCompositeOperation='lighter';const gr=x.createRadialGradient(64,h-62,2,64,h-62,46);gr.addColorStop(0,'rgba('+c.join(',')+',.3)');gr.addColorStop(1,'rgba('+c.join(',')+',0)');x.fillStyle=gr;x.fillRect(0,h-120,w,120);x.globalCompositeOperation='source-over'}})}
/* ---------- floors and ceilings ---------- */
const NT_FLOORS=new Map();     // floor -> names of the FLOORS / CEILS made for it
function ntOwnF(n){let o=NT_FLOORS.get(n);if(!o){o=[];NT_FLOORS.set(n,o)}return o}
function ntMadeFloor(n,out,data){FLOORS[out]=data;ntOwnF(n).push(out);return out}
function ntToneFloor(n,out,src,g,t){
  if(FLOORS[out])return out;const b=FLOORS[src];if(!b)return null;const d=new Uint8ClampedArray(b.length);
  for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,b[i]*g*t[0]);d[i+1]=Math.min(255,b[i+1]*g*t[1]);d[i+2]=Math.min(255,b[i+2]*g*t[2]);d[i+3]=255}
  return ntMadeFloor(n,out,d)}
/* a floor drawn in code: squares, diamonds or stripes of two tones of the floor's colour, with a seam between */
function ntPatternFloor(n,out,kind,c1,c2){
  const N=128,d=new Uint8ClampedArray(N*N*4),S=32;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    let a=0,e=0;
    if(kind==='checker'){a=(((x/S|0)+(y/S|0))&1);e=Math.min(x%S,y%S,S-1-(x%S),S-1-(y%S))}
    else if(kind==='diamond'){const u=(x+y)%64,v=(x-y+128)%64;a=((((x+y)/64|0)+((x-y+128)/64|0))&1);e=Math.min(u,v,63-u,63-v)}
    else{a=((x/16|0)&1);e=Math.min(x%16,15-(x%16))}
    const nz=(((x*374761393+y*668265263)>>>0)%1000)/1000-.5,c=a?c1:c2,k=1+nz*.12-(e<1.5?.45:0)-(e<3&&e>=1.5?-.08:0),o=(y*N+x)*4;
    d[o]=Math.min(255,c[0]*k);d[o+1]=Math.min(255,c[1]*k);d[o+2]=Math.min(255,c[2]*k);d[o+3]=255}
  return ntMadeFloor(n,out,d)}
function ntFloorSet(n,look){
  const P=look.pal,t=P.floorTint,lum=look.wallBase==='texBlack'?.5:.58;
  const a=ntToneFloor(n,'ntf'+n+'a',look.floorA,lum,t)||'gyf_flag',b=ntToneFloor(n,'ntf'+n+'b',look.floorB,lum*1.15,[t[1],t[2],t[0]].map((v,i)=>(v+t[i])/2))||a;
  const wetSrc=FLOORS[a]?a:'gyf_flag';let wet=wetSrc;try{wet=gyFloorWet('ntf'+n+'w',wetSrc,P.lcol.map(v=>Math.min(1,v/1.5)),n%97+3);if(wet!==wetSrc)ntOwnF(n).push(wet)}catch(e){}
  const c1=[150*t[0]*lum*1.3,150*t[1]*lum*1.3,150*t[2]*lum*1.3],c2=[c1[0]*.55,c1[1]*.55,c1[2]*.55];
  const pat=look.floorKind==='plain'?b:ntPatternFloor(n,'ntf'+n+'p',look.floorKind,c1,c2);
  return [a,b,wet,pat,ntWaterFloor(n,look)||wet,b]}
/* the still dark water of a pond: the game's water floor turned dark and tinted towards the floor's own colour (slot 4 of the floor set; it is not one of the game's water names, so only the pond's own fishing spots exist) */
function ntWaterFloor(n,look){
  const out='ntf'+n+'x',src=FLOORS.water||FLOORS.bluewater||FLOORS.wmwater;if(!src)return null;if(FLOORS[out])return out;
  const t=look.pal.floorTint,mx=Math.max(t[0],t[1],t[2])||1,k=[t[0]/mx*.7,t[1]/mx*.85,t[2]/mx*1],d=new Uint8ClampedArray(src.length);
  for(let i=0;i<d.length;i+=4){const m=(src[i]+src[i+1]+src[i+2])/3*.62+6;d[i]=Math.min(255,m*k[0]);d[i+1]=Math.min(255,m*k[1]);d[i+2]=Math.min(255,m*k[2]);d[i+3]=255}
  return ntMadeFloor(n,out,d)}
function ntCeil(n,look){
  const out='ntc'+n;if(CEILS[out])return out;const src=CEILS[look.ceil]||CEILS.gyc_crypt;if(!src)return look.ceil;const t=look.pal.ceilTint,d=new Uint8ClampedArray(src.length),g=.8;
  for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,src[i]*g*t[0]);d[i+1]=Math.min(255,src[i+1]*g*t[1]);d[i+2]=Math.min(255,src[i+2]*g*t[2]);d[i+3]=255}
  CEILS[out]=d;ntOwnF(n).push('C:'+out);return out}
/* a floor far from the party gives its textures back (the floors are endless, the memory is not) */
NT.freeTex=[];
function ntRelease(n){
  const o=NT_TILES.get(n);
  if(o){for(const gid of o.gids){const id=T_TILE[gid];if(id!==undefined){if(TEX[id]){TEX[id].d=null;TEX[id].e=null}NT.freeTex.push(id);delete T_TILE[gid]}delete KH_DOOR[gid];if(GY.col)delete GY.col[gid]}
    for(const k of Object.keys(GY.tiles)){const m=k.match(/nt(\d+)[a-z]+\d?$/);if(m&&+m[1]===n)delete GY.tiles[k]}
    NT_TILES.delete(n)}
  const f=NT_FLOORS.get(n);if(f){for(const nm of f){if(nm.startsWith('C:'))delete CEILS[nm.slice(2)];else delete FLOORS[nm]}NT_FLOORS.delete(n)}}
/* tile numbers freed by ntRelease are used again by the next floor */
{const _at=addTex;addTex=function(d,e){if(NT.freeTex.length&&NT._making){const id=NT.freeTex.pop();TEX[id]={d,e:e||null};return id}return _at.apply(this,arguments)}}
