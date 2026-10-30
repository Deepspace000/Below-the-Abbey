/* ==========================================================================
   THE PALE SPIRE: THE KIT (package 6; prefix psp / PSP). The level maker every builder of the castle uses, built on blKit (blight_kit.js). Pale stone, silver and violet light, cold; warm candlelight only in rest rooms.
   Every function that takes a kit `C` first also works without it (it then uses the kit being built, PSP.cur), so the plan's short forms pspFoe(type,x,y) etc. are fine.

   PALETTE: PSP_PAL (one table, top of this file): stone, trim, glass, light colours, ambient, sky, mist. Moonlit teal-blue night, black and charcoal stone, brass and aged-orange banners, verdigris only as small accents. Re-tone the castle by editing that table (wall styles, doors, floors, sky read it).
   const C = pspMake({id, start:{x,y,f}, wh:2.6, amb:.16, floor:'flag', lcol:PSP_PAL.silver, tele:[x,y], wind:.2, walled:true, terrace:true, castle:{...}})   (terrace:true = real per-cell heights from C.hgt, outdoor levels only; see the REDESIGN ADDITIONS comment near the end)   W, H, name and rating come from PSP.LEVELS[id]; kind 'in' = indoor (a sealed castle: everything is wall until you carve), else outdoor.
     Everything of blKit is on C too: C.dec C.D C.DB C.thing C.person C.foe C.foes C.light C.lamp C.pth C.setF C.house C.post C.dress C.near C.reserve C.solid C.mapNames C.rows C.free C.isOpen ...
     (blKit limits: open cells must lie inside x 2..W-3, y 2..H-3; link tiles may stand on the edge, they are solid.)
   Floors (names): flag marble runner wet straw lawn gravel cobble flagdark dirt   C.floor(name) -> the char of that floor (seven kinds per level at most; the first named is slot 0)
     C.setFloor(x0,y0,x1,y1,name)  inclusive rectangle     C.setFloorCell(x,y,name)
   Rooms (indoor):  C.room(x0,y0,x1,y1,{floor,name,at:[x,y],warm,glow}) carves an inner floor rectangle (inclusive), sets its floor, names it for the map (name = plaque text of the place, 'at' = where its number sits)
     C.carve(x0,y0,x1,y1)  open floor only;  C.wallRect(x0,y0,x1,y1,style) paints solid wall (styles: ash ivy win dun bone panel pier arch dark; ivy = pale stone hung with dark ivy, see tools/PALE_SPIRE_REFERENCES.md);  C.fillWalls(style) makes the whole map wall (done for you in indoor levels before you start)
     C.door(x,y,style,o)  a doorway tile that is NOT a link (just a decorative or later-opened door); C.arch(x0,y0,x1,y1) = carve (an open archway)
   Props: C.prop(name,x,y,{block,sc,i,npc,wd})  a picture from the PSP_PICS table (pspPic) as decor (blocks by default);  C.picture(name,x,y,wd,{sc}) a painting hung on the wall: wd=[dx,dy] points from the floor cell to the wall ([0,-1] north wall)
     C.column(x,y,design 'fluted'|'twist'|'silver')   C.statue(x,y,name,o)   C.sign(x,y,wd,line1,line2) a plaque on a wall ("THE GREAT HALL")   C.chest(x,y,{gold,tier})   C.cand(x,y,col) a tall candelabra with its light
     C.glow(gap,col)  invisible lamps every few squares over open ground (call last)
   Links (the contract table PSP.LINKS):  C.links({style:{linkName regexp or index: style}})  places every link of this level; or one by one:
     pspPortal(C,link,{style,name})  turns a PSP.LINKS entry into a door tile on link.at (styles: oak great iron dungeon stair gate arch);  a link with lock:'pskey2' becomes an iron door that needs the key (pspLockDoor(C,link) is the same with style iron)
     Stepping on the door runs ps_glue's rules: lock check, sealed message for prov links whose far side is not built, otherwise goToLevel(to, land).
   Creatures:  pspFoe(C,type,x,y)  ordinary creature (refused inside a safe zone);  pspWander(C,type,x,y,loop,{slow:.3,leash:6})  a creature or mini boss that walks the waypoints loop=[[x,y],...] slowly and chases only inside its leash;
     pspStatueWake(C,type,x,y)  stands still as a statue until the party is within 3 squares, then wakes (msg ENEMY_DEF[type].wake);  pspSafeZone(C,x,y,r)  no creature within r (and none wanders within r+2);  pspSafeRect(C,x0,y0,x1,y1)
   Rest:  pspRest(C,{x0,y0,x1,y1,bed:[x,y],chest:[x,y],name,line})  makes the rect a safe zone, warm light, a bed that rests the party free (restParty(true)), a chest of potions, and a calm line on entering.
   Finish:  return C.finish({start:{x,y,f}})  (patches the level to indoor or outdoor, floors, lights, sky; registers LEVELS, names, rating)
   ========================================================================== */
const PSPK={tiles:{},floors:{}};
/* ---------- THE PALETTE (the one place; every package reads it): demented gothic, black weathered stone, verdigris copper, sickly green light, bone-white accents, brass ---------- */
const PSP_PAL={
  stone:[.72,.84,.97],stoneGain:1.0,          // rgb multipliers and gain for wall stone: black and charcoal with a slate-blue cast, wet
  copper:'#7898a4',copperHi:'#b4d0d8',copperDk:'#38505a',   // slate-teal trim; verdigris only as small accents (spire tips): verdigris:'#5aa890'
  verdigris:'#5aa890',bone:'#d0d4d8',brass:'#b08a40',brassHi:'#e0b860',banner:'#8a4a22',iron:'#181c22',moss:'#2a3e3a',mossHi:'#44605a',ivy:['#1a2c2e','#24383a','#122224','#30484a'],
  glass:['#2a2016','#80602e','#18120c'],     // window glass, top to bottom: tiny lit windows, aged amber
  silver:[.78,.95,1.1],violet:[.55,.8,1.1],green:[.6,.95,1.1],warm:[1.5,1.05,.55],   // light colours: cold teal moonlight; warm only in rest rooms (violet and green are kept as names for old callers and are teal-blue now)
  amb:{out:.8,in:.2},sky:{top:[16,34,50],mid:[34,66,86],low:[78,116,130]},mist:[64,92,108],moon:[220,236,240],
  floorTint:{flag:[.72,.82,.92],cobble:[.62,.74,.86],wet:[.55,.68,.82]}};
/* ---------- the stone, in code ---------- */
function pspPointed(x,x0,x1,top,bot,ap){x.beginPath();x.moveTo(x0,bot);x.lineTo(x0,top+ap);x.quadraticCurveTo(x0,top+ap*.25,(x0+x1)/2,top);x.quadraticCurveTo(x1,top+ap*.25,x1,top+ap);x.lineTo(x1,bot);x.closePath()}
/* painted textures (assets/ps tex_*): alias them for gyTile (it reads IMG['gyp_'+name]); fb is the code-made fallback */
function pspTex(n,fb){const k='ps_tex_'+n;if(typeof IMG!=='undefined'&&IMG[k]&&IMG[k].width){IMG['gyp_pst_'+n]=IMG[k];return 'pst_'+n}return fb}
function pspWallGid(style,v,wh){
  const k=style+v+'|'+wh;if(PSPK.tiles[k]!==undefined)return PSPK.tiles[k];
  const P=PSP_PAL,A=[P.stoneGain,P.stone],g=(tex,opt)=>gyTile(tex,wh,Object.assign({gain:tex.startsWith('pst_')?1.9:A[0],rgb:tex.startsWith('pst_')?[.9,1,1.08]:A[1]},opt));let gid;
  const wet=(x,w,h)=>{const gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(120,150,180,.0)');gr.addColorStop(.5,'rgba(60,90,130,.10)');gr.addColorStop(1,'rgba(14,28,50,.3)');x.fillStyle=gr;x.fillRect(0,0,w,h);
    for(let q=0;q<5;q++){const px=hash2(q,v,61)*w;x.fillStyle='rgba(150,190,230,.10)';x.fillRect(px,0,1.6,h*(.4+hash2(q,v,62)*.6))}};   // wet streaks and a shine
  switch(style){
    case 'dun':gid=gyTile('texBlack_'+(v%5),wh,{gain:1.3,rgb:[.7,.84,.78],tag:'psd'+v});break;
    case 'dark':gid=pspTex('ashlar',null)?g('pst_ashlar',{gain:1.6,tag:'pskP'+v,draw:wet}):gyTile('texBlack_'+(v%5),wh,{gain:.85,rgb:[.7,.82,.76],tag:'psk'+v});break;
    case 'bone':gid=gyTile('texBone_'+(1+v%4),wh,{gain:1.0,rgb:[.86,.92,.84],tag:'psb'+v});break;
    case 'brick':if(pspTex('brick_dark')!=='pst_brick_dark'){gid=g('texBlack_'+(v%5),{gain:1.35,rgb:[.78,.78,.7],tag:'psbr'+v,draw:(x,w,h)=>{x.strokeStyle='rgba(10,16,12,.55)';x.lineWidth=1.5;for(let yy=0,r=0;yy<h;yy+=14,r++){x.beginPath();x.moveTo(0,yy);x.lineTo(w,yy);x.stroke();for(let xx=(r%2)*16;xx<w;xx+=32){x.beginPath();x.moveTo(xx,yy);x.lineTo(xx,yy+14);x.stroke()}}wet(x,w,h)}});break}gid=g('pst_brick_dark',{gain:1.05,rgb:[.84,.9,1.0],tag:'psbrP2'+v,draw:(x,w,h)=>{x.save();x.globalCompositeOperation='color';x.globalAlpha=.85;x.fillStyle='#5c646e';x.fillRect(0,0,w,h);x.restore();wet(x,w,h)}});break;
    case 'panel':if(pspTex('timber_plaster')==='pst_timber_plaster'){gid=g('pst_timber_plaster',{gain:.62,rgb:[.8,.78,.9],tag:'pspP'+v,draw:wet});break}gid=g('texBone_'+(1+v%3),{gain:.5,rgb:[.7,.8,.62],tag:'psp'+v,draw:(x,w,h)=>{x.globalAlpha=.6;x.fillStyle='#10201a';for(let i=0;i<2;i++){const px=8+i*60;x.fillRect(px,h*.18,52,h*.5);x.fillStyle='#1c342a';x.fillRect(px+4,h*.18+4,44,h*.5-8);x.fillStyle='#10201a'}x.globalAlpha=1;x.fillStyle=P.brass;x.fillRect(0,h*.7,w,3)}});break;
    case 'win':gid=g(pspTex('ashlar','texBlack_2'),{tag:'psw'+v,draw:(x,w,h)=>{const top=h-h*.9,bot=h-34,x0=48,x1=80;x.save();pspPointed(x,x0-6,x1+6,top-6,bot+6,36);x.fillStyle=P.copper;x.fill();pspPointed(x,x0,x1,top,bot,34);const gr=x.createLinearGradient(0,top,0,bot);gr.addColorStop(0,P.glass[1]);gr.addColorStop(.5,P.glass[0]);gr.addColorStop(1,P.glass[2]);x.fillStyle=gr;x.fill();x.clip();
      x.strokeStyle='#4a5a64';x.lineWidth=2.4;x.beginPath();x.moveTo(64,top);x.lineTo(64,bot);for(let yy=top+36;yy<bot;yy+=38){x.moveTo(x0,yy);x.lineTo(x1,yy)}x.stroke();
      x.fillStyle='rgba(180,255,210,.35)';x.beginPath();x.arc(64,top+36,8,0,6.3);x.fill();x.restore();wet(x,w,h)}});break;   // tall thin lancet, green glass
    case 'pier':gid=g(pspTex('ashlar','texBlack_1'),{tag:'psr'+v,draw:(x,w,h)=>{const gr=x.createLinearGradient(30,0,98,0);gr.addColorStop(0,'rgba(10,20,16,.6)');gr.addColorStop(.3,'rgba(150,176,190,.12)');gr.addColorStop(.7,'rgba(120,150,165,.05)');gr.addColorStop(1,'rgba(8,16,12,.62)');x.fillStyle=gr;x.fillRect(30,0,68,h);x.fillStyle='#1c262c';x.fillRect(26,h-14,76,14);x.fillRect(26,0,76,10);x.fillStyle='#34444c';x.fillRect(26,10,76,3)}});break;
    case 'string':gid=g(pspTex('ashlar','texBlack_2'),{tag:'psst'+v,draw:(x,w,h)=>{const y1=h-128*2.05,y2=h-14;   // a plinth at the foot, a projecting string course two squares up, a drip line under the cornice
      x.fillStyle='rgba(8,12,16,.5)';x.fillRect(0,y2,w,14);x.fillStyle='rgba(150,176,190,.22)';x.fillRect(0,y2,w,2);
      x.fillStyle='rgba(6,10,14,.55)';x.fillRect(0,y1+8,w,8);x.fillStyle='rgba(150,176,190,.3)';x.fillRect(0,y1-2,w,3);x.fillStyle='rgba(40,52,62,.55)';x.fillRect(0,y1+1,w,7);
      x.fillStyle='rgba(6,10,14,.45)';x.fillRect(0,0,w,8);wet(x,w,h)}});break;
    case 'slit':gid=g(pspTex('ashlar','texBlack_2'),{tag:'pssl'+v,draw:(x,w,h)=>{const top=h-128*2.7,bot=h-128*1.35;   // an arrow slit: a deep splay with a thin cold light down the middle
      x.fillStyle='rgba(4,8,12,.5)';x.beginPath();x.moveTo(50,top-8);x.lineTo(78,top-8);x.lineTo(70,bot+10);x.lineTo(58,bot+10);x.closePath();x.fill();
      x.fillStyle='#04070a';x.fillRect(60,top,8,bot-top);x.fillStyle='rgba(120,160,176,.32)';x.fillRect(63,top+6,2,bot-top-12);
      x.fillStyle='rgba(150,176,190,.18)';x.fillRect(46,bot+10,36,3);wet(x,w,h)}});break;
    case 'ivy':if(pspTex('ivy_wall')==='pst_ivy_wall'){gid=g('pst_ivy_wall',{gain:2.2,tag:'psiP'+v,draw:wet});break}gid=g('texBlack_'+(1+v%4),{tag:'psi'+v,draw:(x,w,h)=>{const G=P.ivy;for(let k=0;k<9;k++){let px=hash2(k,v,71)*w,py=h;x.strokeStyle='#0c1c14';x.lineWidth=2;x.beginPath();x.moveTo(px,py);for(let t=0;t<8;t++){px+=(hash2(k,t,72)-.5)*14;py-=h*(.05+hash2(k,t,73)*.09);x.lineTo(px,py)}x.stroke()}
      for(let k=0;k<420;k++){const px=hash2(k,v,74)*w,py=h*(1-Math.pow(hash2(k,v,75),1.5)),r=1.4+hash2(k,v,76)*2.6;x.fillStyle=G[(hash2(k,v,77)*4)|0];x.globalAlpha=.94;x.beginPath();x.ellipse(px,py,r,r*.62,hash2(k,v,78)*3.1,0,6.3);x.fill()}x.globalAlpha=1;wet(x,w,h)}});break;
    case 'moss':if(pspTex('ashlar_moss')==='pst_ashlar_moss'){gid=g('pst_ashlar_moss',{tag:'psmP'+v,draw:wet});break}gid=g('texBlack_'+(v%5),{tag:'psm'+v,draw:(x,w,h)=>{for(let k=0;k<120;k++){const px=hash2(k,v,81)*w,py=h*(1-Math.pow(hash2(k,v,82),2.2)),r=2+hash2(k,v,83)*5;x.fillStyle=hash2(k,v,84)<.5?P.moss:P.mossHi;x.globalAlpha=.8;x.beginPath();x.arc(px,py,r,0,6.3);x.fill()}x.globalAlpha=1;wet(x,w,h)}});break;
    case 'copper':gid=g('texBlack_3',{gain:1.1,rgb:[.5,1.05,.85],tag:'psc2'+v,draw:(x,w,h)=>{x.strokeStyle='rgba(10,50,40,.6)';x.lineWidth=2;for(let xx=8;xx<w;xx+=16){x.beginPath();x.moveTo(xx,0);x.lineTo(xx,h);x.stroke()}x.fillStyle='rgba(150,230,200,.12)';for(let xx=8;xx<w;xx+=32)x.fillRect(xx,0,5,h)}});break;
    case 'arch':gid=g(pspTex('ashlar','texBlack_3'),{tag:'psc'+v,draw:(x,w,h)=>{const top=h*.16,bot=h-4;x.save();pspPointed(x,x,22,106,top,26);x.restore();pspPointed(x,x,24,104,top,24);x.fillStyle='#08120e';x.fill();x.strokeStyle=P.bone;x.lineWidth=5;x.stroke();x.strokeStyle=P.copper;x.lineWidth=2;x.stroke()}});break;
    default:gid=g(pspTex('ashlar','texBlack_'+(v%5)),{tag:'psa'+v,draw:wet});}   // 'ash': black weathered stone, wet
  return PSPK.tiles[k]=gid}
function pspDoorGid(style,wh){
  const k='door_'+style+'|'+wh;if(PSPK.tiles[k]!==undefined)return PSPK.tiles[k];let gid;const P=PSP_PAL;
  const frame=(x,w,h,x0,x1,top,ap,fill)=>{pspPointed(x,x0-9,x1+9,top-9,h,ap+4);x.fillStyle='#10181a';x.fill();x.strokeStyle=P.copper;x.lineWidth=3;x.stroke();pspPointed(x,x0,x1,top,h,ap);x.fillStyle=fill;x.fill()};
  const DP={great:'door_great',oak:'door_oak',iron:'door_ironbound',dungeon:'door_dungeon',stair:'door_stair',gate:'door_great'}[style];
  if(DP&&typeof IMG!=='undefined'&&IMG['ps_'+DP]&&IMG['ps_'+DP].width){IMG['gyp_psd_'+DP]=IMG['ps_'+DP];gid=gyTile(pspTex('ashlar','texBlack_2'),wh,{fac:{img:'psd_'+DP,i:0,n:1},gain:.9,rgb:[.58,.7,.8],tag:'psdp2'+style+wh,emit:.06})}
  else if(style==='stair')gid=gyTile('texBlack_1',wh,{fac:{img:'stairFix_0',i:0,n:1},gain:1.2,rgb:[.8,1,.9],tag:'psstair'+wh,emit:.3});
  else if(style==='gate')gid=gyTile('texBlack_1',wh,{fac:{img:'gatesC_0',i:0,n:1},gain:1.0,rgb:[.7,1,.85],tag:'psgate'+wh,emit:.3});
  else gid=gyTile('texBlack_2',wh,{gain:1.2,rgb:[.76,.92,.82],tag:'psdoor'+style,draw:(x,w,h)=>{
    const big=style==='great',x0=big?14:24,x1=big?114:104,dh=Math.min(h-6,128*(big?2.9:2.15)),top=h-dh;
    const wood=style==='dungeon'?'#14181a':style==='iron'?'#1c2426':'#2c241c';
    frame(x,w,h,x0,x1,top,big?34:26,wood);x.save();pspPointed(x,x0,x1,top,h,big?34:26);x.clip();
    x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=1.5;for(let px=x0+(x1-x0)/6;px<x1;px+=(x1-x0)/6){x.beginPath();x.moveTo(px,top);x.lineTo(px,h);x.stroke()}
    x.fillStyle=style==='great'?P.copper:style==='oak'?'#1c2020':'#34403c';for(const f of [.3,.52,.74]){x.fillRect(x0,top+dh*f,x1-x0,big?7:5)}
    if(big){x.beginPath();x.arc(64,top+dh*.32,13,0,6.3);x.fillStyle=P.copperDk;x.fill();x.strokeStyle=P.bone;x.lineWidth=3;x.stroke()}
    if(style==='iron'){x.fillStyle='#a8c0b4';x.fillRect(70,top+dh*.55,26,36);x.fillStyle='#5ad8a0';x.beginPath();x.arc(83,top+dh*.55+18,7,0,6.3);x.fill()}
    if(style==='dungeon'){x.fillStyle='#04080a';x.fillRect(50,top+dh*.24,28,22);x.strokeStyle='#7a8a84';x.lineWidth=2;for(let q=0;q<3;q++){x.beginPath();x.moveTo(56+q*8,top+dh*.24);x.lineTo(56+q*8,top+dh*.24+22);x.stroke()}}
    x.fillStyle=P.brass;x.beginPath();x.arc(x1-16,top+dh*.58,5,0,6.3);x.fill();x.restore()}});
  return PSPK.tiles[k]=gid}
/* ---------- the floors (made once, the engine wants 128 by 128 RGBA) ---------- */
const PSP_FLOOR_NAMES=['flag','marble','runner','wet','straw','lawn','gravel','cobble','flagdark','dirt','grate','slate'];
function pspFloor(name){
  if(PSPK.floors[name])return PSPK.floors[name];
  if(typeof gyFloors==='function')try{gyFloors()}catch(e){}
  const out='psf_'+name,N=128,hs=(a,b,c)=>hash2(a,b,c);
  const tone=(src,g,t)=>FLOORS[src]?gyFloorTone(out,src,g,t):(FLOORS[out]=FLOORS.cobble||FLOORS.grass,out);
  {const PT={flag:['flagstone',1.7,[.9,1,1.08],.8,.5],flagdark:['flagstone',1.1,[.82,.94,1.04],.8,.5],slate:['flagstone',.95,[.8,.9,1.02],.7,.18],gravel:['gravel',1.5,[.92,1,1.06],.6,.5],cobble:['cobble',1.55,[.92,1,1.08],.5,.45],wet:['cobble_wet',1.45,[.85,.98,1.14],.5,.55],marble:['marble',1.9,[.95,1,1.05]]}[name];
    const im=PT&&IMG['ps_tex_'+PT[0]];
    if(im&&im.width){const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(im,0,0,N,N);const d=x.getImageData(0,0,N,N).data;
      let mr=0,mg=0,mb=0,mn=0;for(let i=0;i<d.length;i+=4){mr+=d[i];mg+=d[i+1];mb+=d[i+2];mn++}mr/=mn;mg/=mn;mb/=mn;
      const fl=PT[3]===undefined?1:PT[3],sa=PT[4]===undefined?1:PT[4];   // fl: how much of the stone's contrast is kept (the cobbles were noisy), sa: how much of its colour (the lodge floor was tan)
      for(let i=0;i<d.length;i+=4){let r=mr+(d[i]-mr)*fl,g2=mg+(d[i+1]-mg)*fl,b=mb+(d[i+2]-mb)*fl;const l=(r+g2+b)/3;r=l+(r-l)*sa;g2=l+(g2-l)*sa;b=l+(b-l)*sa;
        d[i]=Math.max(0,Math.min(255,r*PT[1]*PT[2][0]));d[i+1]=Math.max(0,Math.min(255,g2*PT[1]*PT[2][1]));d[i+2]=Math.max(0,Math.min(255,b*PT[1]*PT[2][2]));d[i+3]=255}
      FLOORS[out]=new Uint8ClampedArray(d);return PSPK.floors[name]=out}}
  switch(name){
    case 'flag':tone('gyf_flag',.8,[.7,.82,.94]);break;
    case 'flagdark':tone('gyf_flag',.5,[.64,.78,.9]);break;
    case 'gravel':tone('gyf_gravel',.9,[.78,.88,.96]);break;
    case 'cobble':tone('gyf_cobble',.6,[.64,.76,.88]);if(FLOORS[out]&&FLOORS.gyf_cobble)gyFloorWet(out+'w',out,[.4,.56,.72],17);break;
    case 'dirt':tone('gyf_dirt',.5,[.66,.74,.7]);break;
    case 'lawn':tone('gyf_grass',.5,[.66,.82,.78]);break;
    case 'wet':{tone('gyf_flag',.34,[.58,.74,.9]);const w=gyFloorWet(out+'x',out,[.36,.54,.74],23);if(FLOORS[w])FLOORS[out]=FLOORS[w]}break;
    case 'straw':{tone('gyf_flag',.5,[.88,.9,1.02]);const d=new Uint8ClampedArray(FLOORS[out]);for(let n=0;n<420;n++){const x0=(hs(n,1,31)*N)|0,y0=(hs(n,2,31)*N)|0,len=6+((hs(n,3,31)*14)|0),a=hs(n,4,31)*6.28,c=hs(n,5,31)<.5?[190,170,96]:[158,138,78];
        for(let t=0;t<len;t++){const px=(x0+Math.cos(a)*t+N)%N|0,py=(y0+Math.sin(a)*t+N)%N|0,o=(py*N+px)*4;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2]}}FLOORS[out]=d}break;
    case 'marble':{const d=new Uint8ClampedArray(N*N*4);
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,dark=((x>>6)+(y>>6))%2===1,vein=Math.abs(Math.sin((x*.07+y*.045)+hs(x>>3,y>>3,41)*2.2)),n=hs(x>>1,y>>1,42)*14;
        let r,g,b;if(dark){r=20+n*.5;g=24+n*.6;b=30+n*.5}else{r=140+n-vein*24;g=150+n-vein*22;b=160+n-vein*14}
        const e=Math.min(x&63,y&63,63-(x&63),63-(y&63));if(e<2){r*=.7;g*=.7;b*=.8}
        d[o]=Math.min(255,r);d[o+1]=Math.min(255,g);d[o+2]=Math.min(255,b);d[o+3]=255}
      FLOORS[out]=d}break;
    case 'runner':{const base=FLOORS.gyf_flag,d=new Uint8ClampedArray(N*N*4);
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,e=Math.min(x,127-x),n=hs(x>>2,y>>2,43)*10;
        let r=34+n*.35,g=22+n*.3,b=30+n*.3;   // a dark oxblood runner, worn: the bright red and the brass border were the loudest thing in the room
        if(e<5){r=84;g=70;b=46}else if(e<8){r=16,g=10,b=12}else if(Math.abs(x-64)<6&&((y>>4)&1)===0){r=58;g=38;b=42}
        d[o]=r;d[o+1]=g;d[o+2]=b;d[o+3]=255}
      FLOORS[out]=d}break;
    case 'grate':{tone('gyf_flag',.22,[.58,.74,.9]);const d=new Uint8ClampedArray(FLOORS[out]);for(let y=0;y<N;y++)for(let x=0;x<N;x++){const bar=(x%16<3)||(y%16<3),o=(y*N+x)*4,v=bar?96:6;if(bar||(x%16<5||y%16<5)){d[o]=v*.8;d[o+1]=v*1.1;d[o+2]=v*.9}else{d[o]=3;d[o+1]=7;d[o+2]=6}}FLOORS[out]=d}break;
    default:tone('gyf_flag',.7,[.7,.82,.94]);}
  if(!FLOORS[out])FLOORS[out]=FLOORS.cobble||FLOORS.grass;
  return PSPK.floors[name]=out}
/* the pale ceilings: sky for outdoors (a lilac-white cloud), vault stone for indoors */
function pspCeils(){
  if(PSPK.ceil)return;PSPK.ceil=1;
  const T=(out,src,g,t)=>{const b=CEILS[src];if(!b||CEILS[out])return;const d=new Uint8ClampedArray(b.length);for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,b[i]*g*t[0]);d[i+1]=Math.min(255,b[i+1]*g*t[1]);d[i+2]=Math.min(255,b[i+2]*g*t[2]);d[i+3]=255}CEILS[out]=d};
  T('ps_sky','cloud',.5,[.7,.85,1.0]);T('ps_vault','gyc_1',.7,[.7,.82,.95]);T('ps_dark','gyc_2',.6,[.68,.8,.94]);
  for(const n of ['ps_sky','ps_vault','ps_dark'])if(!CEILS[n])CEILS[n]=CEILS.gyc_crypt||CEILS.beam||CEILS.cloud}
/* a magenta fringe on a cut-out (the keying left it on the edge pixels): the red and blue are pulled down to the green, so the edge goes grey-brown instead of purple. Done once per picture, on a copy. */
function pspDefringe(k){
  const im=IMG[k];if(!im||!im.width||im._psfd||/rose|lantern_red|candles|stained|c_psraven/.test(k))return;
  try{const w=im.width,h=im.height;if(w*h>5e6){im._psfd=1;return}const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,w,h),p=d.data;let n=0;
    const A=(xx,yy)=>xx<0||yy<0||xx>=w||yy>=h?0:p[(yy*w+xx)*4+3];
    for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const i=(yy*w+xx)*4,a=p[i+3];if(a===0)continue;
      let edge=a<250;if(!edge){for(let r=1;r<=3&&!edge;r++)if(A(xx-r,yy)<40||A(xx+r,yy)<40||A(xx,yy-r)<40||A(xx,yy+r)<40)edge=true}
      if(a<22){p[i+3]=0;n++;continue}   // a faint haze left by the keying (it showed as a pale rectangle round the piece)
      if(!edge)continue;const R=p[i],G=p[i+1],B=p[i+2];
      if(R>G+12&&B>G+12){p[i]=Math.min(R,G*1.12+3);p[i+2]=Math.min(B,G*1.05+3);p[i+1]=G*.94;n++}}
    if(n){x.putImageData(d,0,0);c._psfd=1;IMG[k]=c}else im._psfd=1}catch(e){}}
/* ---------- the kit ---------- */
const PSP_ARGS=a=>{const A=Array.prototype.slice.call(a);if(A[0]&&A[0].rows&&A[0].finish)return [A[0]].concat(A.slice(1));return [PSP.cur].concat(A)};
function pspMake(plan){
  const id=plan.id,info=pspLevel(id);if(!info)throw new Error('pspMake: unknown id '+id);
  pspCeils();
  const out=(plan.kind||info.kind)!=='in',W=plan.W||info.W,H=plan.H||info.H,wh=plan.wh||(out?2.6:2.7);
  const tele=plan.tele||(id===PSP.TELE.id?PSP.TELE.at:undefined);
  const C=blKit({id,W,H,name:info.name,lvl:info.lvl,start:plan.start,tele,wind:plan.wind===undefined?.2:plan.wind});
  PSP.cur=C;C.out=out;C.wh=wh;C.kitId=id;C.safe=[];C.loops=[];C.rests=[];C.floorNames=[];C.cols=[];C.lcolDef=plan.lcol||PSP_PAL.silver;
  C.silver=PSP_PAL.silver;C.violet=PSP_PAL.violet;C.green=PSP_PAL.green;C.warmCol=PSP_PAL.warm;C.warm=C.warmCol;C.pale=C.silver;
  const {rows,block,solid,ch}=C,int=Math.floor;
  /* floors */
  C.floor=name=>{let i=C.floorNames.indexOf(name);if(i<0){if(C.floorNames.length>=7)throw new Error('pspMake '+id+': more than seven floors');C.floorNames.push(name);i=C.floorNames.length-1}return String(i)};
  C.floor(plan.floor||(out?'lawn':'flag'));
  C.setFloor=(x0,y0,x1,y1,name)=>C.setF(x0,y0,x1,y1,C.floor(name));
  C.setFloorCell=(x,y,name)=>C.setF(x,y,x,y,C.floor(name));
  C.setF0=C.setF;
  /* walls */
  const WS=plan.wall||(out?'ash':'ash');
  C.wallTile=(style,x,y)=>ch(pspWallGid(style||WS,int(hash2(x||0,y||0,id)*9),wh));
  C.wallRect=(x0,y0,x1,y1,style)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H){const st=typeof style==='function'?style(x,y):style;solid(x,y,C.wallTile(st,x,y))}};
  C.fillWalls=style=>C.wallRect(0,0,W-1,H-1,style||WS);
  C.carve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H){rows[y][x]='.';block[y*W+x]=0}};
  C.arch=C.carve;
  C.room=(x0,y0,x1,y1,o)=>{o=o||{};C.carve(x0,y0,x1,y1);C.setFloor(x0,y0,x1,y1,o.floor||C.floorNames[0]);
    if(o.name){const at=o.at||[(x0+x1)>>1,(y0+y1)>>1];C.mapNames.push({t:o.name,x:at[0],y:at[1],k:'place'})}
    if(o.warm)for(let y=y0+1;y<=y1;y+=Math.max(3,(y1-y0)>>1))for(let x=x0+1;x<=x1;x+=Math.max(3,(x1-x0)>>1))C.light(x,y,C.warmCol);
    return [x0,y0,x1,y1]};
  if(!out||plan.walled)C.fillWalls(WS);
  /* a door tile that is not a link */
  C.door=(x,y,style,o)=>{const base=pspDoorGid(style||'oak',wh),gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[base];if(GY.col&&GY.col[base])GY.col[gid]=GY.col[base];if(o&&o.to!==undefined)KH_DOOR[gid]=o;solid(x,y,ch(gid));return gid};
  /* props */
  C.prop=(name,x,y,o)=>{o=Object.assign({block:true},o||{});const pk=pspPic(name);if(o.maxW){const im=IMG[pk];if(im&&im.width){const w=(NPC_H[pk]||1.5)*im.width/im.height;o.sc=(o.sc||1)*Math.min(1,o.maxW/w)}delete o.maxW}return C.dec(pk,x,y,o)};   // maxW: never wider than that many cells (fences, rails)
  C.picture=(name,x,y,wd,o)=>C.dec(pspPic(name),x,y,Object.assign({wd},o||{}));
  C.statue=(x,y,name,o)=>C.prop(name,x,y,o);
  C.column=(x,y,design,o)=>C.prop('col_'+(design||'fluted'),x,y,o);
  C.sign=(x,y,wd,a,b)=>{if(!C.isOpen(x,y))return null;const d={k:'sign_gy',x,y,block:false,wd,txt:[a,b||''],sc:1};C.decor.push(d);return d};
  C.chest=(x,y,o)=>{o=o||{};const d=C.dec('gy_chest',x,y,{block:true,sc:.7});if(d){d.goldAmt=o.gold||0;if(o.tier!==undefined)d.i=o.tier}return d};
  C.cand=(x,y,col)=>{const d=C.prop('candelabra_tall',x,y,{block:false});C.light(x,y,col||C.silver);return d};
  C.glow=(gap,col)=>{const have=C.lights.slice(),g=gap||5.5;for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(rows[y][x]!=='.')continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=g)){have.push([x,y]);C.lights.push([x,y]);C.lcol[x+','+y]=col||C.lcolDef}}};
  /* links */
  C.links=o=>{o=o||{};const st=o.style||{};for(const l of pspLinksFrom(id)){if(!l.at)continue;let s;for(const k in st){if(k==String(l.to)||new RegExp(k,'i').test(l.name||'')){s=st[k];break}}pspPortal(C,l,{style:s})}};
  const fin=C.finish;
  C.finish=function(o){
    o=o||{};
    // safe zones: nothing hostile stands in one (a builder may have used C.foe directly)
    for(let i=C.enemies.length-1;i>=0;i--){const e=C.enemies[i];if(C.safe.some(z=>pspInZone(z,e.x,e.y,0)))C.enemies.splice(i,1)}
    try{const seen={};for(const d of C.decor)if(d.k&&!seen[d.k]){seen[d.k]=1;pspDefringe(d.k)}}catch(e){}
    const lv=fin.call(C,o),cnt=C.floorNames.length;
    lv.floorSet=C.floorNames.map(n=>pspFloor(n));for(let i=cnt;i<7;i++)lv.floorSet.push(lv.floorSet[0]);
    lv.floor=lv.floorSet[0];lv.floor2=lv.floorSet[1]||lv.floor;
    lv.amb=plan.amb!==undefined?plan.amb:(out?PSP_PAL.amb.out:PSP_PAL.amb.in);lv.torchGap=1e9;lv.noExtras=true;lv.diff=C.rating;lv.name=lv.label=info.name;
    if(out){lv.outdoor=true;lv.ceil='ps_sky';lv.day=plan.day!==undefined?plan.day:.5;lv.ceilH=5.2}
    else{lv.outdoor=false;lv.ceil=plan.ceil||'ps_vault';lv.day=0;lv.ceilH=wh;lv.sky=[]}
    if(plan.tele===undefined&&!tele)lv.noTele=true;
    // loops of wanderers are keyed by the creature's number in the spawn list
    const loops={};C.enemies.forEach((e,i)=>{if(e._loop){loops[i]=e._loop;delete e._loop}});
    lv._ps={floorNames:C.floorNames.slice(),lcol:C.lcol,col:C.lcolDef,safe:C.safe,loops,rests:C.rests,out,id,cols:C.cols,castle:C.castle||null};
    lv._bl.lcol=C.lcol;
    if(out&&plan.terrace){lv.terrace={h:Float32Array.from(C.hgt)};try{if(typeof HGTG!=='undefined'&&HGTG.done)HGTG.done[id]=true}catch(e){}   // the Hollow Gold city sky (planets, moon, clouds, sea beasts) is not ours
    try{const T=terrFor(id);if(T&&T.block)for(let i=0;i<T.block.length;i++)if(C.block[i])T.block[i]=1}catch(e){console.error('ps terrace',e)}}   // real heights: the party climbs steps and crosses bridges over drops (the terraced-city engine)
    if(PSP.cur===C)PSP.cur=null;
    return lv};
  pspKitHelpers(C,plan);
  return C}
/* ---------- portals and locked stair doors ---------- */
function pspDoorStyle(l,o){
  if(o&&o.style)return o.style;if(l.style)return l.style;
  if(l.lock)return 'iron';const n=l.name||'';
  if(/stair/i.test(n))return 'stair';if(/great door|great gate|courtyard gate|the great/i.test(n))return 'great';if(/dungeon/i.test(n))return 'dungeon';if(/gate/i.test(n))return 'gate';return 'oak'}
function pspPortal(){
  const [C,l,o]=PSP_ARGS(arguments);if(!C||!l||!l.at)return null;
  const style=pspDoorStyle(l,o),base=pspDoorGid(style,C.wh),gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[base];if(GY.col&&GY.col[base])GY.col[gid]=GY.col[base];
  const land=l.land;
  KH_DOOR[gid]={get lvl(){return l.to},get at(){return {x:land[0],y:land[1],f:land[2]}},psp:l,lock:l.lock||null,prov:!!l.prov,pspName:(o&&o.name)||l.name};
  C.solid(l.at[0],l.at[1],C.ch(gid));C.used.add(l.at[0]+','+l.at[1]);
  C.reserve(land[0]-1,land[1]-1,land[0]+1,land[1]+1);C.used.delete(land[0]+','+land[1]);
  return gid}
function pspLockDoor(){const [C,l,o]=PSP_ARGS(arguments);return pspPortal(C,Object.assign({},l,{lock:l.lock||'pskey2'}),Object.assign({style:'iron'},o||{}))}
/* ---------- creatures ---------- */
function pspInZone(z,x,y,extra){const e=extra||0;if(z.rect)return x>=z.x0-e&&x<=z.x1+e&&y>=z.y0-e&&y<=z.y1+e;return Math.hypot(x-z.x,y-z.y)<=z.r+e}
function pspSafeZone(){const [C,x,y,r]=PSP_ARGS(arguments);if(C&&C.safe){C.safe.push({x,y,r:r||8});C.reserve(x-1,y-1,x+1,y+1);C.used.delete(x+','+y)}else if(x&&x.enemies){}  // (also accepts a built level: marks it)
  return null}
function pspSafeRect(){const [C,x0,y0,x1,y1]=PSP_ARGS(arguments);C.safe.push({rect:1,x0,y0,x1,y1});return null}
function pspFoe(){const [C,t,x,y,o]=PSP_ARGS(arguments);if(!C)return false;
  if(C.safe.some(z=>pspInZone(z,x,y,0)))return false;
  if(!ENEMY_DEF[t])console.warn('pspFoe: no ENEMY_DEF for '+t);
  const ok=C.foe(t,x,y);if(ok&&o&&o.lvl)C.enemies[C.enemies.length-1].lvl=o.lvl;return ok}
function pspStatueWake(){const [C,t,x,y]=PSP_ARGS(arguments);const d=ENEMY_DEF[t];if(d){d.still=1;d.pswake=1;if(!d.wake)d.wake='The statue turns its head.'}return pspFoe(C,t,x,y)}
function pspWander(){const [C,t,x,y,loop,o]=PSP_ARGS(arguments);o=o||{};
  if(!pspFoe(C,t,x,y))return false;const e=C.enemies[C.enemies.length-1];
  const xs=loop.map(p=>p[0]).concat([x]),ys=loop.map(p=>p[1]).concat([y]),lg=o.leash||6;
  e._loop={pts:loop,slow:o.slow===undefined?.3:o.slow,box:[Math.min.apply(null,xs)-lg,Math.min.apply(null,ys)-lg,Math.max.apply(null,xs)+lg,Math.max.apply(null,ys)+lg],i:0};return true}
function pspRest(){
  const [C,r]=PSP_ARGS(arguments);if(!C||!r)return null;
  C.safe.push({rect:1,x0:r.x0,y0:r.y0,x1:r.x1,y1:r.y1});C.rests.push({x0:r.x0,y0:r.y0,x1:r.x1,y1:r.y1,line:r.line||'A calm room. A candle burns here, warm and yellow, and the cold stays outside the door.',name:r.name});
  const cx=(r.x0+r.x1)>>1,cy=(r.y0+r.y1)>>1;
  C.light(cx,cy,C.warmCol);C.light(r.x0+1,r.y0+1,C.warmCol);C.light(r.x1-1,r.y1-1,C.warmCol);C.light(r.x1-1,r.y0+1,C.warmCol);
  const bid='psr_bed_'+C.id+'_'+r.x0+'_'+r.y0,bed=r.bed||[r.x0+1,r.y0+1];
  if(!NPCS[bid])khNpc(bid,'A bed','ps_bed_four',()=>say('A clean bed with a patchwork quilt. The candle beside it does not flicker. Nothing here will hurt you.',[['Rest here (free).',()=>{G.talk=null;restParty(true);return say('You sleep warm for the first time in a long while. Everyone wakes healed and fed.',[BYE])}],BYE]));
  C.dec(pspPic('bed_four'),bed[0],bed[1],{block:true,npc:bid,sc:.85});
  const ch=r.chest||[r.x1-1,r.y1-1];C.chest(ch[0],ch[1],{gold:600,tier:0});
  return null}
/* ---------- the look and the sound hooks that belong to the kit: lights, weather, loot, wanderers, statues, rest lines ---------- */
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(pspIs(LEVEL)){const L=LEVELS[LEVEL],P=L&&L._ps;if(P){for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=P.lcol[key]||P.col;l.kI=P.out?1.1:1.45;l.range2=P.out?70:120;l.calm=true}}}}catch(e){console.error('ps lights',e)}
  return r}}
{const _w=weatherNow;weatherNow=function(){
  if(pspIs(LEVEL)){const L=LEVELS[LEVEL];
    if(L&&L.outdoor&&L.fogAt&&G.P){const f=L.fogAt(G.P.x,G.P.y);return {id:'fog',n:'Mist',fog:f[3]||.014,haze:.3,dark:0,mix:.4,col:[f[0],f[1],f[2]],text:'A cold mist lies on the ground, and bats wheel high over the roofs. The night sky never changes, and the moon never sets.'}}
    if(L&&L.outdoor)return {id:'fog',n:'Teal mist',fog:.014,haze:.3,dark:0,mix:.4,col:PSP_PAL.mist,text:'A cold teal mist lies on the ground, and bats wheel high over the roofs. The night sky never changes, and the moon never sets.'};
    return null}
  return _w.apply(this,arguments)}}
if(typeof CONTAINERS!=='undefined'&&!CONTAINERS.includes('gy_chest'))CONTAINERS.push('gy_chest');
{const _lf=lootFor;lootFor=function(d){
  if(pspIs(LEVEL)&&d&&d.k==='gy_chest'){
    const r=q=>hash2(d.x,d.y,700+q+LEVEL),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})},k=Math.max(0,Math.floor((LEVEL-9720)/20));
    for(let q=0;q<2+(k>2?1:0);q++)add(potionFor(r(10+q)),1);add('supermana',1+(k>2?1:0));if(r(2)<.5)add('elixir',1);
    if(d.i!==0){for(let q=0;q<1+(k>3?1:0);q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}
      if(typeof ringFor==='function'&&r(3)<.4)add(ringFor(r(4),100+k))}
    d.gold=(d.goldAmt||0)||3600+k*300+Math.floor(r(5)*2600);return items}
  return _lf.apply(this,arguments)}}
{const _ea=enemyAct;enemyAct=function(e){
  try{const d=ENEMY_DEF[e.t],L=LEVELS[LEVEL],P=L&&L._ps;
    if(P&&d){
      if(d.pswake&&!e.alert){const dist=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);if(dist<=3){e.alert=true;try{msg(d.wake,'#d8d4f0');sfx('rattle')}catch(x){}return 220}return 0}
      const lp=P.loops&&P.loops[e.id];
      if(lp){
        if(!e.alert){
          const dist=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
          if(dist<=5&&hasLOS(e.x,e.y,G.P.x,G.P.y)){e.alert=true;try{msg((d.name||'Something')+' turns and comes for you.','#e8c8f0');sfx('growl')}catch(x){}return 200}
          if(Math.random()>lp.slow)return 0;
          const t=lp.pts[lp.i%lp.pts.length];
          if(Math.abs(e.x-t[0])+Math.abs(e.y-t[1])<=1){lp.i=(lp.i+1)%lp.pts.length;return 120}
          const opts=DIRS.map(q=>[e.x+q[0],e.y+q[1]]).filter(([x,y])=>!cellBlocked(x,y)&&terrStepOK(e.x,e.y,x,y)&&!enemyAt(x,y)&&!(x===G.P.x&&y===G.P.y)&&!P.safe.some(z=>pspInZone(z,x,y,2)));
          let best=null,bd=Math.abs(e.x-t[0])+Math.abs(e.y-t[1]);for(const o of opts){const dd=Math.abs(o[0]-t[0])+Math.abs(o[1]-t[1]);if(dd<bd||(dd===bd&&!best&&Math.random()<.4)){bd=dd;best=o}}
          if(best){e.x=best[0];e.y=best[1];return 260}
          return 0}
        else if(e.x<lp.box[0]||e.y<lp.box[1]||e.x>lp.box[2]||e.y>lp.box[3]){e.alert=false;return 0}   // it does not leave its ground
      }}}catch(x){console.error('ps enemyAct',x)}
  return _ea.apply(this,arguments)}}
/* a calm line when the party first steps into a rest room (once per visit) */
{const _u=update;update=function(dt){try{if(pspIs(LEVEL)&&G.state==='play'&&G.P){const L=LEVELS[LEVEL],P=L&&L._ps;if(P&&P.rests&&P.rests.length){const inn=P.rests.find(r=>G.P.x>=r.x0&&G.P.x<=r.x1&&G.P.y>=r.y0&&G.P.y<=r.y1);
    if(inn&&PSPK.restIn!==inn){PSPK.restIn=inn;try{msg(inn.line,'#f0c890')}catch(e){}}else if(!inn)PSPK.restIn=null}}}catch(e){console.error('ps update',e)}return _u.apply(this,arguments)}}

/* ==========================================================================
   REDESIGN ADDITIONS (package 1): overcast sky and the castle view, and helpers for arches, bridges, iron fences, vines, ravines and climbs.
   Colours come from PSP_PAL (top of this file). Signatures:
     pspMake({..., walled:true})          outdoor level that starts as solid wall like an indoor one (lanes between high walls); C.fillWalls(style) is done for you
     pspMake({..., castle:{at:[x,y], far:120, near:40, lift:62, lift1:6, h0:38, h1:106}})   shows the CASTLE VIEW in the sky: a painted horizon picture (castle_view, then castle_view_near) at the world point `at`; its apparent size grows as the party gets nearer (distance far -> near)
     C.rise(x0,y0,x1,y1,h0,h1,axis)     ground height ramps from h0 to h1 along axis 'x' or 'y' over the rectangle (heights are in cells, 0.3 is the flat default); the party climbs the slope, walls stand on it
     C.ravine(x0,y0,x1,y1,depth,floor)  an open drop (nobody can walk it; seen from the lane): lower ground, blocked, floor name (default 'wet')
     C.bridge(x0,y0,x1,y1,{h,rail,floor,arches})   a one-square-wide span (horizontal or vertical) with an iron rail each side and arches under it; carve + level; call after C.ravine
     C.fence(x0,y0,x1,y1,{pic,block})   a run of wrought iron fence, never wider than a cell (see-through; it does not block unless block:true: make the cell itself unwalkable with block[] as the Approach does)
     C.vines(x,y,o) / C.vineWall(x0,y0,x1,y1,wd)   hanging vine curtain at a cell (walk-through) / vines on a wall face (wd=[dx,dy] points from the floor cell to the wall)
     C.archway(x,y,name,o)               a walk-through arch picture (arch_high arch_low arch_ivy arch_iron arch_stair) standing over the cell
     C.alcove(x,y,name,wd)               a statue alcove picture on a wall (alcove_weeper alcove_monk alcove_knight alcove_maiden alcove_empty)
   ========================================================================== */
function pspNoiseSky(){
  if(PSPK.skyBase)return PSPK.skyBase;
  const W=1024,H=256,d=new Uint8ClampedArray(W*H*4),S=PSP_PAL.sky,hs=(a,b,c)=>hash2(a,b,c);
  const lat=(gx,gy,gw,seed)=>hs(((gx%gw)+gw)%gw,gy,seed);
  const vn=(x,y,cw,ch,seed)=>{const u=x/cw,v=y/ch,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),gw=Math.ceil(W/cw);
    return (lat(i,j,gw,seed)*(1-sx)+lat(i+1,j,gw,seed)*sx)*(1-sy)+(lat(i,j+1,gw,seed)*(1-sx)+lat(i+1,j+1,gw,seed)*sx)*sy};
  for(let y=0;y<H;y++){
    const v=Math.min(1,y/150),top=v<.55?v/.55:1,low=Math.max(0,(v-.55)/.45);
    for(let x=0;x<W;x++){
      const f=vn(x,y,128,40,3)*.5+vn(x,y,64,22,5)*.3+vn(x,y,24,9,7)*.2,fl=vn(x,y,200,70,9);
      const k=.74+.4*f;   // thin drifting cloud over a night sky
      let r=S.top[0]+(S.mid[0]-S.top[0])*top+(S.low[0]-S.mid[0])*low,g=S.top[1]+(S.mid[1]-S.top[1])*top+(S.low[1]-S.mid[1])*low,b=S.top[2]+(S.mid[2]-S.top[2])*top+(S.low[2]-S.mid[2])*low;
      const seam=Math.max(0,f-.6)*1.3*(.5+fl);   // pale moonlit edges
      r=r*k+seam*34;g=g*k+seam*52;b=b*k+seam*62;
      const o=(y*W+x)*4,star=(y<110&&hs(x,y,99)>.9985)?(120+hs(x,y,98)*120):0;d[o]=Math.min(255,r*1.3+star);d[o+1]=Math.min(255,g*1.3+star);d[o+2]=Math.min(255,b*1.3+star);d[o+3]=255}}
  {const im=IMG['ps_tex_sky_night'];if(im&&im.width){const c=document.createElement('canvas');c.width=c.height=256;const cx=c.getContext('2d');cx.imageSmoothingQuality='high';cx.drawImage(im,0,0,256,256);const t=cx.getImageData(0,0,256,256).data;   // the painted overcast: stretched down the sky, mirrored along it so that it never shows a seam
    for(let y=0;y<H;y++){const ty=Math.min(255,Math.floor(y*256/220));for(let x=0;x<W;x++){const m=x&511,tx=m<256?m:511-m,o=(y*W+x)*4,q=(ty*256+tx)*4;for(let k=0;k<3;k++)d[o+k]=Math.min(255,t[q+k]*.8*1.15+d[o+k]*.22)}}}}
  return PSPK.skyBase=d}
/* the castle view: the picture is composited into a copy of the sky each frame (the engine drifts the sky sideways, so the castle is drawn against the drift) */
function pspCastleImg(near){const k=pspPic(near?'castle_view_near':'castle_view');return IMG[k]||null}
/* stand-ins for the painted sky pieces moon_crescent and bat_flock (replaced at once when the painted pieces are in assets/ps) */
PSP_PICS.moon_crescent=[2.0,['gy_column'],{}];PSP_PICS.bat_flock=[1.0,['gy_column'],{}];PSP_PICS.tex_sky_night=[1.0,['gy_column'],{}];
function pspSkyArt(){
  if(PSPK.skyArt)return;PSPK.skyArt=1;
  const mk=(n,w,h,fn)=>{const k='ps_'+n;if(IMG[k]&&!IMG[k]._ps)return;const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);c._ps=1;IMG[k]=c;NPC_H[k]=2};
  mk('moon_crescent',160,160,(x,w,h)=>{const m=PSP_PAL.moon;x.fillStyle='rgb('+m[0]+','+m[1]+','+m[2]+')';x.beginPath();x.arc(80,80,58,0,6.3);x.fill();x.globalCompositeOperation='destination-out';x.beginPath();x.arc(104,66,52,0,6.3);x.fill();x.globalCompositeOperation='source-over';
    const g=x.createRadialGradient(80,80,40,80,80,80);g.addColorStop(0,'rgba(180,220,235,.0)');g.addColorStop(1,'rgba(150,200,225,0)');x.fillStyle=g;x.fillRect(0,0,w,h)});
  mk('bat_flock',320,110,(x,w,h)=>{x.fillStyle='#04080c';for(let i=0;i<38;i++){const px=20+hash2(i,1,77)*280,py=10+hash2(i,2,77)*90,s=3+hash2(i,3,77)*5;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px-s*1.2,py-s,px-s*2.4,py-s*.2);x.quadraticCurveTo(px-s*1.4,py+s*.3,px-s*.5,py+s*.3);x.lineTo(px,py+s*.7);x.lineTo(px+s*.5,py+s*.3);x.quadraticCurveTo(px+s*1.4,py+s*.3,px+s*2.4,py-s*.2);x.quadraticCurveTo(px+s*1.2,py-s,px,py);x.fill()}})}
function pspSkyFrame(){
  const L=LEVELS[LEVEL],P=L&&L._ps;if(!P||!P.out)return;
  const skyB=pspNoiseSky();pspSkyArt();
  if(!PSPK.live){PSPK.live=new Uint8ClampedArray(skyB.length);PSPK.cv=document.createElement('canvas');PSPK.cv.width=1024;PSPK.cv.height=256;PSPK.cx=PSPK.cv.getContext('2d',{willReadFrequently:true})}
  const live=PSPK.live;live.set(skyB);
  self.BKSKY_LV=LEVEL;self.BKSKY_PAN=live;
  const cs=P.castle,C=G.C,px=C.x+.5,py=C.y+.5,TAU=Math.PI*2,t=G.time;
  const x=PSPK.cx;x.clearRect(0,0,1024,256);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  const col=az=>((((az/TAU)%1)+1)%1*1024+t*11)%1024;                    // the engine drifts the sky sideways: pieces are drawn against the drift
  const put=(img,cu,vc,wRows,alpha,wm)=>{if(!img||!img.width)return;const h=wRows,w=h*img.width/img.height*.57*(wm||1);x.globalAlpha=alpha===undefined?1:alpha;for(const o of [-1024,0,1024])x.drawImage(img,cu-w/2+o,vc-h/2,w,h);x.globalAlpha=1};
  // the moon over the shoulder of the castle, and a flock of bats that drifts round the sky
  const baseAz=cs?Math.atan2(cs.at[1]-py,cs.at[0]-px):-Math.PI/2;
  put(IMG[pspPic('moon_crescent')],col(baseAz+.5),64,50);
  put(IMG[pspPic('bat_flock')],col(baseAz-.9+t*.02),84+5*Math.sin(t*.6),38,.9);put(IMG[pspPic('bat_flock')],col(baseAz+1.9-t*.013),100+4*Math.sin(t*.45+2),26,.8);
  if(cs){
    const dist=Math.hypot(cs.at[0]-px,cs.at[1]-py),prog=Math.max(0,Math.min(1,(cs.far-dist)/(cs.far-cs.near)));          // 0 at the foot of the climb, 1 at the barbican
    const H=Math.round((cs.h0||38)+((cs.h1||106)-(cs.h0||38))*prog*prog*(3-2*prog)),near=prog>.45,mix=Math.max(0,Math.min(1,(prog-.35)/.2));   // rows tall on screen (the sky shows about 105 rows above the horizon)
    const lift=Math.round((cs.lift||0)*(1-prog)+(cs.lift1||0)*prog),base=150-lift,cu=col(baseAz);
    const draw=(img,alpha)=>put(img,cu,base-H/2+Math.round(H*.02),H,alpha,cs.wm||1);
    if(cs.ring){const img=pspCastleImg(false);   // lesser towers of the same city, further round the horizon (mirrored copies, smaller and hazier), so the skyline shows from more of the road
      for(const [da,fl,sz,al] of [[1.45,1,.62,.8],[-1.45,0,.56,.75],[2.9,0,.5,.6],[-2.9,1,.54,.65]]){const c2=col(baseAz+da),H2=Math.round(H*sz);x.save();x.translate(c2,0);if(fl)x.scale(-1,1);put(img,0,base-H2/2+Math.round(H2*.02),H2,al,cs.wm||1);x.restore()}}
    draw(pspCastleImg(false),near?1-mix:1);if(near)draw(pspCastleImg(true),mix);
    // distance haze: the castle is a cold shadow in the teal mist far off, and clears as the party climbs
    x.globalCompositeOperation='source-atop';
    const hz=.55*(1-prog)+.1,m=PSP_PAL.mist,gr=x.createLinearGradient(0,base-H,0,base+lift);gr.addColorStop(0,'rgba('+m[0]+','+m[1]+','+m[2]+','+(hz*.4)+')');gr.addColorStop(.7,'rgba('+m[0]+','+m[1]+','+m[2]+','+(hz*.8)+')');gr.addColorStop(1,'rgba('+m[0]+','+m[1]+','+m[2]+','+Math.min(.95,hz+.3)+')');
    x.fillStyle=gr;x.fillRect(0,base-H-4,1024,H+8+lift);x.globalCompositeOperation='source-over'}
  const im=x.getImageData(0,0,1024,160).data;
  for(let i=0,n=1024*160;i<n;i++){const s=i*4,al=im[s+3];if(!al)continue;const k=al/255;live[s]+=(im[s]-live[s])*k;live[s+1]+=(im[s+1]-live[s+1])*k;live[s+2]+=(im[s+2]-live[s+2])*k}}
{const _r=render3D;render3D=function(){
  try{if(pspIs(LEVEL)&&G.state==='play'&&LEVELS[LEVEL]&&LEVELS[LEVEL].outdoor)pspSkyFrame();else if(PSPK.live&&self.BKSKY_PAN===PSPK.live){self.BKSKY_LV=0}}catch(e){console.error('ps sky',e)}
  return _r.apply(this,arguments)}}
/* ---------- helpers on the kit ---------- */
{let _v=0;Object.defineProperty(self,'BKSKY_LV',{configurable:true,get(){return (typeof LEVEL!=='undefined'&&typeof pspIs==='function'&&pspIs(LEVEL)&&LEVELS[LEVEL]&&LEVELS[LEVEL].outdoor&&PSPK.live)?LEVEL:_v},set(x){_v=x}})}   // the engine reads the kit sky on every castle level that is outdoors, whatever other sky code resets
function pspKitHelpers(C,plan){
  const W=C.W,H=C.H,{rows,block,hgt,fm}=C,ix=(x,y)=>y*W+x,hs=C.hs;
  C.rise=(x0,y0,x1,y1,h0,h1,axis)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const t=axis==='x'?(x1===x0?0:(x-x0)/(x1-x0)):(y1===y0?0:(y-y0)/(y1-y0));hgt[ix(x,y)]=h0+(h1-h0)*t}};
  C.ravine=(x0,y0,x1,y1,depth,floor)=>{const f=C.floor(floor||'wet');for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<0||y<0||x>=W||y>=H)continue;rows[y][x]='.';fm[ix(x,y)]=f;hgt[ix(x,y)]=hgt[ix(x,y)]-depth;block[ix(x,y)]=1;C.used.add(x+','+y)}};
  C.bridge=(x0,y0,x1,y1,o)=>{o=o||{};const horiz=y0===y1,f=C.floor(o.floor||'flag'),h=o.h!==undefined?o.h:.3;
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){rows[y][x]='.';block[ix(x,y)]=0;fm[ix(x,y)]=f;hgt[ix(x,y)]=h;C.used.delete(x+','+y)}
    if(o.rail!==false)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(horiz){for(const dy of [-1,1]){const yy=y+dy;if(yy<0||yy>=H)continue;if(rows[yy][x]==='.'&&block[ix(x,yy)]){C.used.delete(x+','+yy);C.prop('bridge_rail',x,yy,{block:false,maxW:1})}}}else{for(const dx of [-1,1]){const xx=x+dx;if(xx<0||xx>=W)continue;if(rows[y][xx]==='.'&&block[ix(xx,y)]){C.used.delete(xx+','+y);C.prop('bridge_rail',xx,y,{block:false,maxW:1})}}}}
    if(o.arches){const n=horiz?x1-x0+1:y1-y0+1;for(let i=1;i<n-1;i+=2){const x=horiz?x0+i:x0,y=horiz?y0:y0+i;C.dec(pspPic('arch_low'),x,y,{block:false})}}};
  C.fence=(x0,y0,x1,y1,o)=>{o=o||{};let n=0;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){C.used.delete(x+','+y);C.prop((o.pic||'iron_fence_')+((n++&1)?'a':'b'),x,y,{block:o.block===true,sc:o.sc||1,maxW:1.02})}};
  C.vines=(x,y,o)=>C.prop((o&&o.name)||(hs(x,y,5)<.5?'vine_a':'vine_b'),x,y,Object.assign({block:false},o||{}));
  C.vineWall=(x0,y0,x1,y1,wd)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(C.isOpen(x,y)&&hs(x,y,7)>.45)C.picture(hs(x,y,6)<.5?'vine_a':'vine_b',x,y,wd)};
  C.archway=(x,y,name,o)=>C.prop(name||'arch_high',x,y,Object.assign({block:false},o||{}));
  C.alcove=(x,y,name,wd)=>C.picture(name||'alcove_weeper',x,y,wd);
  if(plan.castle){C.castle=plan.castle}
}
