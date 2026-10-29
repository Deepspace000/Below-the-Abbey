/* ==========================================================================
   THE PALE SPIRE: THE KIT (package 6; prefix psp / PSP). The level maker every builder of the castle uses, built on blKit (blight_kit.js). Pale stone, silver and violet light, cold; warm candlelight only in rest rooms.
   Every function that takes a kit `C` first also works without it (it then uses the kit being built, PSP.cur), so the plan's short forms pspFoe(type,x,y) etc. are fine.

   const C = pspMake({id, start:{x,y,f}, wh:2.6, amb:.16, floor:'flag', lcol:[.9,.94,1.15], tele:[x,y], wind:.2})   W, H, name and rating come from PSP.LEVELS[id]; kind 'in' = indoor (a sealed castle: everything is wall until you carve), else outdoor.
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
/* ---------- the stone, in code ---------- */
function pspPointed(x,x0,x1,top,bot,ap){x.beginPath();x.moveTo(x0,bot);x.lineTo(x0,top+ap);x.quadraticCurveTo(x0,top+ap*.25,(x0+x1)/2,top);x.quadraticCurveTo(x1,top+ap*.25,x1,top+ap);x.lineTo(x1,bot);x.closePath()}
function pspWallGid(style,v,wh){
  const k=style+v+'|'+wh;if(PSPK.tiles[k]!==undefined)return PSPK.tiles[k];
  const A=[1.95,[.9,.93,1.2]],g=(tex,opt)=>gyTile(tex,wh,Object.assign({gain:A[0],rgb:A[1]},opt));let gid;
  switch(style){
    case 'dun':gid=gyTile('texBlack_'+(v%5),wh,{gain:1.5,rgb:[.78,.86,1.05],tag:'psd'+v});break;
    case 'dark':gid=gyTile('texBlack_'+(v%5),wh,{gain:.9,rgb:[.8,.85,1.0],tag:'psk'+v});break;
    case 'bone':gid=gyTile('texBone_'+(1+v%4),wh,{gain:1.18,rgb:[.92,.94,1.1],tag:'psb'+v});break;
    case 'panel':gid=g('texBone_'+(1+v%3),{gain:.78,rgb:[.8,.74,.92],tag:'psp'+v,draw:(x,w,h)=>{x.globalAlpha=.55;x.fillStyle='#3a2c48';for(let i=0;i<2;i++){const px=8+i*60;x.fillRect(px,h*.18,52,h*.5);x.fillStyle='#4a3a5c';x.fillRect(px+4,h*.18+4,44,h*.5-8);x.fillStyle='#3a2c48'}x.globalAlpha=1;x.fillStyle='rgba(216,192,112,.8)';x.fillRect(0,h*.7,w,3)}});break;
    case 'win':gid=g('texGrey_2',{tag:'psw'+v,draw:(x,w,h)=>{const top=h-h*.9,bot=h-34,x0=34,x1=94;x.save();pspPointed(x,x,x0-5,top-5,bot+5,26);x.fillStyle='#e6e8f6';x.fill();pspPointed(x,x,x0,top,bot,24);const gr=x.createLinearGradient(0,top,0,bot);gr.addColorStop(0,'#7a68c8');gr.addColorStop(.5,'#5a4aa8');gr.addColorStop(1,'#3a3488');x.fillStyle=gr;x.fill();x.clip();
      x.strokeStyle='#d8dcf4';x.lineWidth=3;x.beginPath();x.moveTo(64,top);x.lineTo(64,bot);for(let yy=top+40;yy<bot;yy+=44){x.moveTo(x0,yy);x.lineTo(x1,yy)}x.stroke();
      x.fillStyle='rgba(200,170,255,.5)';x.beginPath();x.arc(64,top+40,12,0,6.3);x.fill();x.restore()}});break;
    case 'pier':gid=g('texGrey_1',{tag:'psr'+v,draw:(x,w,h)=>{const gr=x.createLinearGradient(30,0,98,0);gr.addColorStop(0,'rgba(60,56,90,.5)');gr.addColorStop(.3,'rgba(255,255,255,.28)');gr.addColorStop(.7,'rgba(255,255,255,.1)');gr.addColorStop(1,'rgba(50,46,80,.55)');x.fillStyle=gr;x.fillRect(30,0,68,h);x.fillStyle='rgba(235,238,252,.5)';x.fillRect(26,h-14,76,14);x.fillRect(26,0,76,10)}});break;
    case 'ivy':gid=g('texGrey_'+(1+v%4),{tag:'psi'+v,draw:(x,w,h)=>{const G=['#2c4a34','#3c5c44','#243c2e','#4c6c50'];for(let k=0;k<9;k++){let px=hash2(k,v,71)*w,py=h;x.strokeStyle='#22382a';x.lineWidth=2;x.beginPath();x.moveTo(px,py);for(let t=0;t<8;t++){px+=(hash2(k,t,72)-.5)*14;py-=h*(.05+hash2(k,t,73)*.09);x.lineTo(px,py)}x.stroke()}
      for(let k=0;k<150;k++){const px=hash2(k,v,74)*w,py=h*(1-Math.pow(hash2(k,v,75),1.6)),r=2.5+hash2(k,v,76)*4;x.fillStyle=G[(hash2(k,v,77)*4)|0];x.globalAlpha=.92;x.beginPath();x.ellipse(px,py,r,r*.62,hash2(k,v,78)*3.1,0,6.3);x.fill()}x.globalAlpha=1}});break;
    case 'arch':gid=g('texGrey_3',{tag:'psc'+v,draw:(x,w,h)=>{const top=h*.16,bot=h-4;x.save();pspPointed(x,x,22,106,top,26);x.restore();pspPointed(x,x,24,104,top,24);x.fillStyle='#28244a';x.fill();x.strokeStyle='#e8eaf8';x.lineWidth=5;x.stroke()}});break;
    default:gid=g('texGrey_'+(1+v%4),{tag:'psa'+v});}
  return PSPK.tiles[k]=gid}
function pspDoorGid(style,wh){
  const k='door_'+style+'|'+wh;if(PSPK.tiles[k]!==undefined)return PSPK.tiles[k];let gid;
  const frame=(x,w,h,x0,x1,top,ap,fill)=>{pspPointed(x,x0-9,x1+9,top-9,h,ap+4);x.fillStyle='#e4e6f4';x.fill();x.strokeStyle='#8a88b0';x.lineWidth=2;x.stroke();pspPointed(x,x0,x1,top,h,ap);x.fillStyle=fill;x.fill()};
  if(style==='stair')gid=gyTile('texGrey_1',wh,{fac:{img:'stairFix_0',i:0,n:1},gain:1.5,rgb:[.95,.97,1.15],tag:'psstair'+wh,emit:.3});
  else if(style==='gate')gid=gyTile('texGrey_1',wh,{fac:{img:'gatesC_0',i:0,n:1},gain:1.3,rgb:[.95,.97,1.15],tag:'psgate'+wh,emit:.3});
  else gid=gyTile('texGrey_2',wh,{gain:1.55,rgb:[.95,.96,1.1],tag:'psdoor'+style,draw:(x,w,h)=>{
    const big=style==='great',x0=big?14:24,x1=big?114:104,dh=Math.min(h-6,128*(big?2.9:2.15)),top=h-dh;
    const wood=style==='dungeon'?'#2a2430':style==='iron'?'#3a3446':'#6a4c3a';
    frame(x,w,h,x0,x1,top,big?34:26,wood);x.save();pspPointed(x,x0,x1,top,h,big?34:26);x.clip();
    x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1.5;for(let px=x0+(x1-x0)/6;px<x1;px+=(x1-x0)/6){x.beginPath();x.moveTo(px,top);x.lineTo(px,h);x.stroke()}
    x.fillStyle=style==='great'?'#c8cce0':style==='oak'?'#4a4a58':'#6a6a7c';for(const f of [.3,.52,.74]){x.fillRect(x0,top+dh*f,x1-x0,big?7:5)}
    if(big){x.beginPath();x.arc(64,top+dh*.32,13,0,6.3);x.fillStyle='#8a68d8';x.fill();x.strokeStyle='#e8e4f8';x.lineWidth=3;x.stroke()}
    if(style==='iron'){x.fillStyle='#c0c4d8';x.fillRect(70,top+dh*.55,26,36);x.fillStyle='#9a74e8';x.beginPath();x.arc(83,top+dh*.55+18,7,0,6.3);x.fill()}
    if(style==='dungeon'){x.fillStyle='#08080c';x.fillRect(50,top+dh*.24,28,22);x.strokeStyle='#8a8a98';x.lineWidth=2;for(let q=0;q<3;q++){x.beginPath();x.moveTo(56+q*8,top+dh*.24);x.lineTo(56+q*8,top+dh*.24+22);x.stroke()}}
    x.fillStyle='#d8d8e8';x.beginPath();x.arc(x1-16,top+dh*.58,5,0,6.3);x.fill();x.restore()}});
  return PSPK.tiles[k]=gid}
/* ---------- the floors (made once, the engine wants 128 by 128 RGBA) ---------- */
const PSP_FLOOR_NAMES=['flag','marble','runner','wet','straw','lawn','gravel','cobble','flagdark','dirt'];
function pspFloor(name){
  if(PSPK.floors[name])return PSPK.floors[name];
  if(typeof gyFloors==='function')try{gyFloors()}catch(e){}
  const out='psf_'+name,N=128,hs=(a,b,c)=>hash2(a,b,c);
  const tone=(src,g,t)=>FLOORS[src]?gyFloorTone(out,src,g,t):(FLOORS[out]=FLOORS.cobble||FLOORS.grass,out);
  switch(name){
    case 'flag':tone('gyf_flag',1.35,[.8,.86,1.22]);break;
    case 'flagdark':tone('gyf_flag',.7,[.8,.85,1.2]);break;
    case 'gravel':tone('gyf_gravel',1.65,[1,1,1.04]);break;
    case 'cobble':tone('gyf_cobble',.9,[.88,.92,1.05]);if(FLOORS[out]&&FLOORS.gyf_cobble)gyFloorWet(out+'w',out,[.5,.55,.8],17);break;
    case 'dirt':tone('gyf_dirt',.7,[.9,.9,.98]);break;
    case 'lawn':tone('gyf_grass',.88,[.88,.98,.9]);break;
    case 'wet':{tone('gyf_flag',.5,[.84,.88,1.05]);const w=gyFloorWet(out+'x',out,[.45,.5,.8],23);if(FLOORS[w])FLOORS[out]=FLOORS[w]}break;
    case 'straw':{tone('gyf_flag',.5,[.88,.9,1.02]);const d=new Uint8ClampedArray(FLOORS[out]);for(let n=0;n<420;n++){const x0=(hs(n,1,31)*N)|0,y0=(hs(n,2,31)*N)|0,len=6+((hs(n,3,31)*14)|0),a=hs(n,4,31)*6.28,c=hs(n,5,31)<.5?[190,170,96]:[158,138,78];
        for(let t=0;t<len;t++){const px=(x0+Math.cos(a)*t+N)%N|0,py=(y0+Math.sin(a)*t+N)%N|0,o=(py*N+px)*4;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2]}}FLOORS[out]=d}break;
    case 'marble':{const d=new Uint8ClampedArray(N*N*4);
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,dark=((x>>6)+(y>>6))%2===1,vein=Math.abs(Math.sin((x*.07+y*.045)+hs(x>>3,y>>3,41)*2.2)),n=hs(x>>1,y>>1,42)*14;
        let r,g,b;if(dark){r=70+n;g=66+n;b=96+n*1.2}else{r=214+n-vein*20;g=214+n-vein*18;b=232+n-vein*10}
        const e=Math.min(x&63,y&63,63-(x&63),63-(y&63));if(e<2){r*=.7;g*=.7;b*=.8}
        d[o]=Math.min(255,r);d[o+1]=Math.min(255,g);d[o+2]=Math.min(255,b);d[o+3]=255}
      FLOORS[out]=d}break;
    case 'runner':{const base=FLOORS.gyf_flag,d=new Uint8ClampedArray(N*N*4);
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,e=Math.min(x,127-x),n=hs(x>>2,y>>2,43)*10;
        let r=84+n,g=40+n*.6,b=128+n*1.4;
        if(e<5){r=196;g=168;b=88}else if(e<8){r=60;g=26;b=96}else if(Math.abs(x-64)<6&&((y>>4)&1)===0){r=150;g=110;b=178}
        d[o]=r;d[o+1]=g;d[o+2]=b;d[o+3]=255}
      FLOORS[out]=d}break;
    default:tone('gyf_flag',1.2,[.92,.94,1.1]);}
  if(!FLOORS[out])FLOORS[out]=FLOORS.cobble||FLOORS.grass;
  return PSPK.floors[name]=out}
/* the pale ceilings: sky for outdoors (a lilac-white cloud), vault stone for indoors */
function pspCeils(){
  if(PSPK.ceil)return;PSPK.ceil=1;
  const T=(out,src,g,t)=>{const b=CEILS[src];if(!b||CEILS[out])return;const d=new Uint8ClampedArray(b.length);for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,b[i]*g*t[0]);d[i+1]=Math.min(255,b[i+1]*g*t[1]);d[i+2]=Math.min(255,b[i+2]*g*t[2]);d[i+3]=255}CEILS[out]=d};
  T('ps_sky','cloud',1.05,[.92,.9,1.12]);T('ps_vault','gyc_1',1.35,[.9,.92,1.12]);T('ps_dark','gyc_2',1.1,[.85,.88,1.1]);
  for(const n of ['ps_sky','ps_vault','ps_dark'])if(!CEILS[n])CEILS[n]=CEILS.gyc_crypt||CEILS.beam||CEILS.cloud}
/* ---------- the kit ---------- */
const PSP_ARGS=a=>{const A=Array.prototype.slice.call(a);if(A[0]&&A[0].rows&&A[0].finish)return [A[0]].concat(A.slice(1));return [PSP.cur].concat(A)};
function pspMake(plan){
  const id=plan.id,info=pspLevel(id);if(!info)throw new Error('pspMake: unknown id '+id);
  pspCeils();
  const out=(plan.kind||info.kind)!=='in',W=plan.W||info.W,H=plan.H||info.H,wh=plan.wh||(out?2.6:2.7);
  const tele=plan.tele||(id===PSP.TELE.id?PSP.TELE.at:undefined);
  const C=blKit({id,W,H,name:info.name,lvl:info.lvl,start:plan.start,tele,wind:plan.wind===undefined?.2:plan.wind});
  PSP.cur=C;C.out=out;C.wh=wh;C.kitId=id;C.safe=[];C.loops=[];C.rests=[];C.floorNames=[];C.cols=[];C.lcolDef=plan.lcol||[.9,.94,1.15];
  C.silver=[.9,.94,1.15];C.violet=[.78,.58,1.15];C.warmCol=[1.5,1.05,.55];C.warm=C.warmCol;C.pale=C.silver;
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
  if(!out)C.fillWalls(WS);
  /* a door tile that is not a link */
  C.door=(x,y,style,o)=>{const base=pspDoorGid(style||'oak',wh),gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[base];if(GY.col&&GY.col[base])GY.col[gid]=GY.col[base];if(o&&o.to!==undefined)KH_DOOR[gid]=o;solid(x,y,ch(gid));return gid};
  /* props */
  C.prop=(name,x,y,o)=>{o=Object.assign({block:true},o||{});return C.dec(pspPic(name),x,y,o)};
  C.picture=(name,x,y,wd,o)=>C.dec(pspPic(name),x,y,Object.assign({wd},o||{}));
  C.statue=(x,y,name,o)=>C.prop(name,x,y,o);
  C.column=(x,y,design,o)=>C.prop('col_'+(design||'fluted'),x,y,o);
  C.sign=(x,y,wd,a,b)=>{if(!C.isOpen(x,y))return null;const d={k:'sign_gy',x,y,block:false,wd,txt:[a,b||''],sc:1};C.decor.push(d);return d};
  C.chest=(x,y,o)=>{o=o||{};const d=C.dec('gy_chest',x,y,{block:true,sc:1.1});if(d){d.goldAmt=o.gold||0;if(o.tier!==undefined)d.i=o.tier}return d};
  C.cand=(x,y,col)=>{const d=C.prop('candelabra_tall',x,y,{block:false});C.light(x,y,col||C.silver);return d};
  C.glow=(gap,col)=>{const have=C.lights.slice(),g=gap||5.5;for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(rows[y][x]!=='.')continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=g)){have.push([x,y]);C.lights.push([x,y]);C.lcol[x+','+y]=col||C.lcolDef}}};
  /* links */
  C.links=o=>{o=o||{};const st=o.style||{};for(const l of pspLinksFrom(id)){if(!l.at)continue;let s;for(const k in st){if(k==String(l.to)||new RegExp(k,'i').test(l.name||'')){s=st[k];break}}pspPortal(C,l,{style:s})}};
  const fin=C.finish;
  C.finish=function(o){
    o=o||{};
    // safe zones: nothing hostile stands in one (a builder may have used C.foe directly)
    for(let i=C.enemies.length-1;i>=0;i--){const e=C.enemies[i];if(C.safe.some(z=>pspInZone(z,e.x,e.y,0)))C.enemies.splice(i,1)}
    const lv=fin.call(C,o),cnt=C.floorNames.length;
    lv.floorSet=C.floorNames.map(n=>pspFloor(n));for(let i=cnt;i<7;i++)lv.floorSet.push(lv.floorSet[0]);
    lv.floor=lv.floorSet[0];lv.floor2=lv.floorSet[1]||lv.floor;
    lv.amb=plan.amb!==undefined?plan.amb:(out?.86:.2);lv.torchGap=1e9;lv.noExtras=true;lv.diff=C.rating;lv.name=lv.label=info.name;
    if(out){lv.outdoor=true;lv.ceil='ps_sky';lv.day=plan.day!==undefined?plan.day:.5;lv.ceilH=5.2}
    else{lv.outdoor=false;lv.ceil=plan.ceil||'ps_vault';lv.day=0;lv.ceilH=wh;lv.sky=[]}
    if(plan.tele===undefined&&!tele)lv.noTele=true;
    // loops of wanderers are keyed by the creature's number in the spawn list
    const loops={};C.enemies.forEach((e,i)=>{if(e._loop){loops[i]=e._loop;delete e._loop}});
    lv._ps={floorNames:C.floorNames.slice(),lcol:C.lcol,col:C.lcolDef,safe:C.safe,loops,rests:C.rests,out,id,cols:C.cols};
    lv._bl.lcol=C.lcol;
    if(PSP.cur===C)PSP.cur=null;
    return lv};
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
    if(L&&L.outdoor)return {id:'fog',n:'Pale mist',fog:.012,haze:.4,dark:0,mix:.5,col:[206,200,232],text:'A thin silver mist lies on the ground, and pale motes drift down like ash. The sky is the colour of milk, with no sun in it, and it never changes.'};
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
