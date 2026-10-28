/* ==========================================================================
   THE BLIGHTED ROAD: THE KIT (prefix bl / BL). What every place of the road shares (see blight_road.js for the table and how to add a place, tools/BLIGHT_NOTES.md for the notes):
   1. the look: a sickly grey-green light, fog, dead grass, pale lamps (blFloors, weatherNow, setupLights below)
   2. the sound: wind, crows, creaking, now and then a far bell tolling (blsTick)
   3. the creatures: undead of the road, built from the painted pieces of the graveyard and the witch wood (ENEMY_DEF bl*)
   4. lettered pictures: signposts, milestones that count down to Sale, grave boards (blPost, blSlab, blMilestone)
   5. blRoadLevel(spec): the level builder. It gives a "kit" C (ground, paths, walls, gates, houses, props, creatures, lights, a dressing pass) and returns the finished level.
   Pictures come from the graveyard (gy_*), the witch wood (ww_*), Wenlock (wl_*, wl2_*, kh_oh*) and the engine; nothing here is drawn in code except lettering and ground textures.
   ========================================================================== */
/* ---------- 1. the ground and the light ---------- */
const BL_FLOORSET=['blf_grass','blf_dirt','blf_gravel','blf_flag','blf_cobble','blf_mud','blf_ash'];
function blFloors(){
  if(BL._floors)return;
  if(typeof gyFloors==='function')try{gyFloors()}catch(e){console.error(e)}
  const tone=(out,src,g,t)=>{if(typeof gyFloorTone==='function'&&FLOORS[src])gyFloorTone(out,src,g,t);if(!FLOORS[out])FLOORS[out]=FLOORS.cobble||FLOORS.grass};
  tone('blf_grass','gyf_grass',.56,[.98,.92,.66]);   // dead grass: dry, yellow-olive, grey
  tone('blf_dirt','gyf_dirt',.62,[.92,.9,.82]);
  tone('blf_gravel','gyf_gravel',.7,[.92,.95,.92]);
  tone('blf_flag','gyf_flag',.66,[.9,.95,.95]);
  tone('blf_cobble','gyf_cobble',.74,[.9,.94,.92]);
  tone('blf_mud','gyf_dirt',.42,[.8,.85,.72]);
  tone('blf_ash','gyf_gravel',.5,[.85,.85,.82]);
  BL._floors=1}
/* the air: a pale green-grey fog out of doors, in every place of the road */
{const _w=weatherNow;weatherNow=function(){
  if(blIs(LEVEL)){const L=LEVELS[LEVEL];
    if(L&&L.outdoor)return {id:'fog',n:'Blight haze',fog:.016,haze:.34,dark:.02,mix:.5,col:[128,146,120],text:'A thin grey-green haze hangs over the dead grass, and the light has a sick colour. Somewhere a crow is complaining.'};
    return null}
  return _w.apply(this,arguments)}}
/* lamps: a pale blue-green flame for the dead places, warm for a lamp that a living hand lights. lv._bl.lcol maps "x,y" to a colour. */
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(blIs(LEVEL)){const L=LEVELS[LEVEL],lc=(L._bl&&L._bl.lcol)||{},cols=L._bl&&L._bl.col||[.78,1.1,.95];
    for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=lc[key]||cols;l.kI=L.outdoor?1.1:1.4;l.range2=L.outdoor?70:120;l.calm=true}}}catch(e){console.error('bl lights',e)}
  return r}}
/* ---------- 2. the sound ---------- */
const BLS={nextCrow:0,nextCreak:0,nextToll:0,nextDrip:0,nextWind:0};
function blsToll(strokes,vol){if(!AC||G.mute)return;for(let i=0;i<strokes;i++){const d=i*3.4;tone(130,126,3.2,'sine',.085*vol,d);tone(260,255,2.4,'sine',.04*vol,d);tone(392,386,1.8,'sine',.02*vol,d);tone(522,540,1.2,'triangle',.012*vol,d)}}   // a cracked bell, low, a long way off
function blsTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!blIs(LEVEL)||!SNDOPT.amb)return;
  const now=AC.currentTime,L=LEVELS[LEVEL],out=L&&L.outdoor;
  if(out){
    if(now>BLS.nextCrow){BLS.nextCrow=now+7+Math.random()*14;if(typeof wwsCrow==='function')wwsCrow(.55+Math.random()*.5)}
    if(now>BLS.nextCreak){BLS.nextCreak=now+13+Math.random()*22;if(typeof wwsCreak==='function')wwsCreak(.45+Math.random()*.4)}
    if(now>BLS.nextToll){BLS.nextToll=now+38+Math.random()*50;blsToll(1+((Math.random()*2)|0),.5+Math.random()*.4)}
  }else{
    if(now>BLS.nextCreak){BLS.nextCreak=now+9+Math.random()*14;if(typeof wwsCreak==='function')wwsCreak(.4)}
    if(now>BLS.nextDrip){BLS.nextDrip=now+5+Math.random()*8;if(typeof wwsDrip==='function')wwsDrip(.6)}}}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{blsTick()}catch(e){console.error('bls',e)}}}
/* ---------- 3. the creatures of the road (the pictures are the graveyard's and the witch wood's; ratings follow the place) ---------- */
function blW(img,h){const e=typeof GY_LIST!=='undefined'&&GY_LIST[img];return e?+(h*e[1]/e[2]).toFixed(2):h*.7}
function blWw(img,h){const e=typeof WW_LIST!=='undefined'&&WW_LIST[img];return e?+(h*e[1]/e[2]).toFixed(2):h*.7}
Object.assign(ENEMY_DEF,{
  bldeadwarden:{name:'Dead Road Warden',hp:56,dmg:[6,10],hit:.85,w:blW('crA_1',.74),img:'gyi_pike',xp:24,gold:[0,0],speed:1,verb:'jabs',bl:1},
  blhusk:{name:'Roadside Husk',hp:60,dmg:[5,9],hit:.82,w:blW('crA_4',.62),img:'gyi_zombie',xp:21,gold:[0,0],speed:1,verb:'pummels',bl:1},
  blghoul:{name:'Road Ghoul',hp:50,dmg:[6,10],hit:.85,w:blW('crA_3',.55),img:'gyi_ghoul',xp:22,gold:[0,0],speed:2,verb:'claws',bl:1},
  blbones:{name:'Wayside Skeleton',hp:46,dmg:[5,9],hit:.84,w:blW('crA_0',.68),img:'gyi_skel',xp:20,gold:[0,0],speed:1,verb:'slashes',bl:1},
  blbloat:{name:'Bloated Drowned Man',hp:86,dmg:[7,12],hit:.84,w:blW('crA_5',.72),img:'gyi_giant',xp:30,gold:[0,0],speed:1,verb:'crushes',bl:1},
  blcrow:{name:'Plague Crow',hp:38,dmg:[5,9],hit:.87,w:blW('crB_6',.55),img:'gyi_raven',xp:20,gold:[0,0],speed:2,fly:true,floatH:.3,verb:'stabs',bl:1},
  blshade:{name:'Road Shade',hp:46,dmg:[6,10],hit:.87,w:blW('crB_1',.68),img:'gyi_shade',xp:24,gold:[0,0],speed:2,fly:true,floatH:.2,verb:'rakes',bl:1,glow:.35},
  blhound:{name:'Bone Hound',hp:46,dmg:[6,10],hit:.86,w:blW('crB_4',.5),img:'gyi_hound',xp:24,gold:[0,0],speed:2,verb:'savages',bl:1},
  blscare:{name:'Walking Scarecrow',hp:70,dmg:[7,12],hit:.85,w:blWw('guardA_0',1.6),img:'wwi_scare',xp:28,gold:[0,0],speed:1,verb:'rakes',bl:1,still:1,wake:'The scarecrow drops off its pole with a sound like a hundred dry twigs.'},
  blscarebig:{name:'The Heart-Scarecrow',hp:360,dmg:[9,15],hit:.9,w:blWw('guardA_0',2.5),img:'wwi_scare',xp:620,gold:[0,0],speed:1,verb:'rakes',boss:true,aboveParty:0,bl:1,still:1,glow:.15,wake:'The tallest scarecrow lifts its head. A pale silver light shows through the straw in its chest.'},
  blcrowflock:{name:'Crow Flock',hp:60,dmg:[6,10],hit:.86,w:blWw('guardA_4',1.3),img:'wwi_crows',xp:24,gold:[0,0],speed:2,fly:true,floatH:.2,verb:'pecks at',bl:1,still:1,wake:'The dead tree bursts into a screaming cloud of crows.'}
});
if(typeof NO_VARY!=='undefined')NO_VARY.push('blscarebig');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('blscarebig');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.blscarebig=[3000,3800];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^blghoul/,'tomblung',.2],[/^(blhusk|blbloat)/,'foodpoison',.2],[/^blshade/,'cursed',.15],[/^(blcrow|blhound)/,'bleeding',.18],[/^blscare/,'fever',.12]);
/* ---------- 4. lettered pictures ---------- */
const BL_STONE_INK='#1a1712';
function blWeathered(cv){ // a lettered post or board is greyed and darkened, as everything on the road is
  const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;const x=c.getContext('2d');try{x.filter='saturate(.3) brightness(.82)'}catch(e){}x.drawImage(cv,0,0);x.filter='none';
  x.globalCompositeOperation='multiply';x.fillStyle='rgb(176,184,170)';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='destination-in';x.drawImage(cv,0,0);return c}
/* a signpost with one to three boards lettered on it. boards: [name or {n,d}] (d: -1 left, 1 right, 0 ahead, 2 behind), i picks the colours. Returns the decor key (made once). */
function blPost(key,boards,i){
  if(IMG[key])return key;
  if(!IMG.greensign||typeof wlnPostPic!=='function')return 'greensign';
  try{IMG[key]=blWeathered(wlnPostPic(i||0,boards.map(b=>typeof b==='string'?{n:b,d:0}:b)));NPC_H[key]=1.35}catch(e){console.error('blPost',e);return 'greensign'}
  return key}
/* a slab of grey stone with words cut into it (a milestone, a grave board, a plaque). lines: up to three; the picture is the graveyard's blank slab. */
function blSlab(key,lines,opt){
  if(IMG[key])return key;opt=opt||{};
  const base=IMG.gy_slab||IMG.gy_stone2||IMG.gy_stone1;if(!base)return 'gy_slab';
  const w=base.width,h=base.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(base,0,0);
  x.textAlign='center';x.textBaseline='middle';
  const n=lines.length,top=h*(opt.top||.14),span=h*(opt.span||.74),lh=span/Math.max(n,2);
  lines.forEach((t,i)=>{const big=i===0&&n>1&&!opt.flat,fs=Math.round(lh*(big?.62:.5));let f=fs;x.font='bold '+f+'px Georgia,"Times New Roman",serif';
    while(x.measureText(t).width>w*.84&&f>10){f-=1;x.font='bold '+f+'px Georgia,"Times New Roman",serif'}
    const cy=top+lh*(i+.5);x.fillStyle='rgba(235,230,215,.38)';x.fillText(t,w/2+1,cy+1.5);x.fillStyle=BL_STONE_INK;x.fillText(t,w/2,cy)});   // cut letters: a dark face and a pale lower edge
  IMG[key]=c;NPC_H[key]=opt.h||1.05;return key}
/* a milestone that counts the stages down to Sale (n = place number 1 to 10; the stone stands at the west end of the place) */
function blMilestone(n){const left=10-n;return blSlab('bl_mile'+n,['SALE',left>0?left+(left===1?' STAGE':' STAGES'):'THE GATE'],{h:1.0,top:.2,span:.62})}
/* ---------- 5. the level builder ---------- */
let BL_HOUSE_READY=false;
function blHouseInit(){if(BL_HOUSE_READY)return;try{wlHeights();wlRoofs();wlStyles()}catch(e){console.error('bl house init',e)}BL_HOUSE_READY=true}
const blRng=seed=>{let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}};
const BL_TREES=['gy_dead','ww_thorn','ww_willow','ww_oakmoss','ww_oakface','ww_pine2','gy_dead','ww_thorn'];
const BL_SCRUB=['ww_twig','ww_twig2'];
function blKit(spec){
  const id=spec.id,W=spec.W,H=spec.H,hs=(a,b,c)=>hash2(a,b,c),R=blRng(id*7+3),X0=2,X1=W-3,Y0=2,Y1=H-3;
  blFloors();blHouseInit();
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const block=new Uint8Array(W*H),fm=new Array(W*H).fill('0'),hgt=new Float32Array(W*H).fill(.3),rk=new Float32Array(W*H);
  const decor=[],enemies=[],items=[],lights=[],sky=[],used=new Set(),path=new Set(),lcol={},mapNames=[],TM=(typeof ohTiles==='function')?ohTiles():null;
  const C={id,W,H,rows,block,fm,hgt,decor,enemies,items,lights,sky,used,path,lcol,mapNames,ch,chars,TM,hs,R,X0,X1,Y0,Y1,rating:spec.lvl||LEVEL_RATING[id]||84,exits:{}};
  const isOpen=(x,y)=>x>=X0&&y>=Y0&&x<=X1&&y<=Y1&&rows[y][x]==='.';
  const free=(x,y)=>isOpen(x,y)&&!used.has(x+','+y);
  C.isOpen=isOpen;C.free=free;
  const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};C.solid=solid;
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)fm[y*W+x]=f};C.setF=setF;
  /* a road or a path: the ground is changed and nothing is put on it by D/DB (dec ignores the path flag) */
  const pth=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){path.add(x+','+y);fm[y*W+x]=f||'1'}};C.pth=pth;
  /* things that stand about: dec = exactly there (if open); D = also not on a path; DB = solid version of D; DW = walk-through of D */
  const dec=(k,x,y,o)=>{o=o||{};if(!isOpen(x,y)||!k)return null;
    const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}
    if(o.block&&o.npc)d.solid=1;if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false}if(o.i!==undefined)d.i=o.i;if(o.wd){d.wd=o.wd;d.pic=1}if(o.txt)d.txt=o.txt;if(o.bob!==undefined)d.bob=o.bob;
    if(o.ox!==undefined)d.ox=o.ox;if(o.oy!==undefined)d.oy=o.oy;
    decor.push(d);used.add(x+','+y);return d};
  C.dec=dec;C.D=(k,x,y,o)=>free(x,y)&&!path.has(x+','+y)?dec(k,x,y,o):null;C.DB=(k,x,y,o)=>C.D(k,x,y,Object.assign({block:true},o||{}));
  C.reserve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)used.add(x+','+y)};
  const lamp=(x,y,col)=>{if(isOpen(x,y)){lights.push([x,y]);if(col)lcol[x+','+y]=col}};C.lamp=lamp;
  C.warm=[1.5,1.05,.55];C.pale=[.7,1.1,.95];
  C.light=(x,y,col)=>{lights.push([x,y]);if(col)lcol[x+','+y]=col};
  C.foe=(t,x,y)=>{if(!free(x,y))return false;enemies.push({t,x,y,lvl:C.rating});used.add(x+','+y);return true};
  /* the nearest free cell to (x,y) within rad (also off the paths when offPath) */
  C.near=(x,y,rad,offPath)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const a=x+dx,b=y+dy;if(free(a,b)&&!(offPath&&path.has(a+','+b)))return [a,b]}return null};
  C.foeNear=(t,x,y,rad)=>{const q=C.near(x,y,rad||3,true);return q?C.foe(t,q[0],q[1]):false};
  /* a person: the keeper of an id from KH_KEEPERS (khNpc), standing near x,y */
  C.person=(npcId,x,y,rad,o)=>{const kp=KH_KEEPERS[npcId];if(!kp)return null;const q=C.near(x,y,rad||3,false);if(!q)return null;
    const d={k:khFaceKey(kp.face),x:q[0],y:q[1],block:false,walk:true,npc:npcId,sc:(o&&o.sc)||kp.sc||1};decor.push(d);used.add(q[0]+','+q[1]);return d};
  /* an object with something to say: walk up and press (khNpc registered by the caller) */
  C.thing=(k,npcId,x,y,o)=>dec(k,x,y,Object.assign({block:true,npc:npcId},o||{}));
  /* the ground: smooth noise for gentle hills, kept flat on roads */
  const vn=(x,y,cs,sd)=>{const u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return(hs(i,j,sd)*(1-sx)+hs(i+1,j,sd)*sx)*(1-sy)+(hs(i,j+1,sd)*(1-sx)+hs(i+1,j+1,sd)*sx)*sy};
  C.hills=amp=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++){hgt[y*W+x]=.3+amp*((vn(x,y,17,id+1)-.5)*1.6+(vn(x,y,7,id+2)-.5)*.5)}};
  C.flatten=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)hgt[y*W+x]=.3};
  /* the boundary: a bank of dark leaves and bark, two cells thick all round */
  const wallH=2.1,wt=v=>ch(typeof wwTile==='function'&&IMG.tex_1?wwTile(['tex_1','tex_2','tex_1'][v%3],2.6,{gain:.55,rgb:[.86,.94,.84]}):gyTile('texGrey_'+(v%3),wallH,{gain:.55}));
  C.boundary=()=>{const WC=[0,0,0,1,3,5,0,3,2].map(wt);for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x>=X0&&x<=X1&&y>=Y0&&y<=Y1)continue;solid(x,y,WC[(hs(x,y,7)*WC.length)|0])}};
  /* ---- gates: the east and west exits, using the table BL_ROAD ---- */
  C.gate=(side,y,opt)=>{
    opt=opt||{};const p=blPlaceOf(id),x=side==='E'?W-2:1,dest=()=>{const q=p&&(side==='E'?blEastDest(p):blWestDest(p));return q};
    if(p&&!dest())return false;
    const tag='blx'+id+side,gid=gyTile('texGrey_1',2.5,{fac:{img:'gatesC_0',i:0,n:1},gain:1.1,tag});
    KH_DOOR[gid]={get lvl(){return dest().lvl},get at(){const d=dest();if(!LEVELS[d.lvl]&&KH_LAZY[d.lvl])KH_LAZY[d.lvl]();return d.at},bl:1,side};
    rows[y][x]=ch(gid);block[y*W+x]=1;
    const dx=side==='E'?-1:1;
    for(const yy of [y-1,y+1]){dec('gy_lantern',x+dx,yy,{block:true});lights.push([x+dx,yy]);lcol[(x+dx)+','+yy]=opt.col||C.pale}
    dec('gy_urn',x+dx,y-2,{block:true,sc:.8});dec('gy_urn',x+dx,y+2,{block:true,sc:.8});
    pth(side==='E'?x-4:x+1,y,side==='E'?x-1:x+4,y,'1');
    C.exits[side]={x:x+dx,y};return true};
  /* ---- houses: an enterable building in the style of Wenlock (walls, painted roof, door to a room) ---- */
  C.house=h=>{ // h:{x0,y0,x1,y1,face:'S'|'N'|'E'|'W',sty,roof,wh,to,name,door:[x,y] (default: middle of the front wall)}
    const sty=(WL.sty&&WL.sty[h.sty||'timber'])||h.sty||'timber',wh=h.wh||2.3,horiz=h.face==='N'||h.face==='S';
    const door=h.door||(horiz?[(h.x0+h.x1)>>1,h.face==='S'?h.y1:h.y0]:[h.face==='E'?h.x1:h.x0,(h.y0+h.y1)>>1]);
    const front=(x,y)=>h.face==='N'?y===h.y0:h.face==='S'?y===h.y1:h.face==='E'?x===h.x1:x===h.x0;
    const plain=ch(TM.make('plain',sty,wh).gid),plain2=ch(TM.make('plain2',sty,wh).gid),win=ch(TM.make('window',sty,wh).gid),gwin=ch(TM.make('gwin',sty,wh).gid);
    const dtile=TM.make('door',sty,wh),dgid=KH_NEXT_GID++;T_TILE[dgid]=dtile.tex;
    if(h.to)KH_DOOR[dgid]={lvl:h.to,get at(){if(!LEVELS[h.to]&&KH_LAZY[h.to])KH_LAZY[h.to]();const L=LEVELS[h.to],st=L&&L.start;return st?{x:st.x,y:st.y,f:0}:{x:4,y:4,f:0}}};
    for(let y=h.y0;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++){
      let c;if(x===door[0]&&y===door[1])c=ch(dgid);else if(front(x,y))c=win;else c=((x*5+y*3)%5===1)?gwin:((x*3+y)%4===1)?plain2:plain;
      solid(x,y,c);used.add(x+','+y)}
    const span=horiz?h.x1-h.x0+1:h.y1-h.y0+1;
    sky.push({x:(h.x0+h.x1+1)/2,y:(h.y0+h.y1+1)/2,k:wlRoofFor(h.roof||'thatch2',h),w:span+.6,z:wh-.03});
    const fx=door[0]+(h.face==='E'?1:h.face==='W'?-1:0),fy=door[1]+(h.face==='S'?1:h.face==='N'?-1:0);
    h.front=[fx,fy];C.reserve(h.x0-1,h.y0-1,h.x1+1,h.y1+1);used.delete(fx+','+fy);
    if(h.lit!==false){for(const o of [-2,2]){const lx=horiz?fx+o:fx,ly=horiz?fy:fy+o;if(isOpen(lx,ly)){lights.push([lx,ly]);lcol[lx+','+ly]=h.col||C.warm}}}   // the lit windows
    return h};
  /* ---- a lettered signpost (once per key) and a milestone ---- */
  C.post=(x,y,key,boards,npcId,say_,o)=>{const k=blPost(key,boards,(o&&o.i)||0);if(npcId&&!NPCS[npcId])khNpc(npcId,'A signpost',k,()=>say(say_,[BYE]));return dec(k,x,y,{block:true,npc:npcId,sc:(o&&o.sc)||1})};
  C.milestone=(x,y)=>{const n=blPlaceN(id),k=blMilestone(n),nid='bl_mile'+n;if(!NPCS[nid]){const left=10-n;khNpc(nid,'A milestone',k,()=>say(left>0?'A grey milestone beside the road. The letters cut in it read SALE, '+left+(left===1?' STAGE':' STAGES')+'. Somebody has scratched a small tally under it, and the tally stops.':'A grey milestone at the foot of the bridge. The letters cut in it read SALE, THE GATE. Under it somebody has scratched: NO FURTHER.',[BYE]))}return dec(k,x,y,{block:true,npc:nid,sc:1})};
  /* a grave board: names cut in a slab, one line each (key must be unique) */
  C.grave=(x,y,key,lines,o)=>{o=o||{};const k=blSlab(key,lines,{h:o.h||.95,top:.18,span:.6});return C.DB(k,x,y,{sc:o.sc||1,npc:o.npc,i:o.i})};
  /* ---- the dressing pass: dead trees round the edge and scattered, dead scrub, leaning stones, bones, crows on posts. opt: {trees,scrub,stones,bones,posts,keep:fn(x,y) true = leave clear} ---- */
  C.dress=opt=>{opt=opt||{};const keep=opt.keep||(()=>false),near=(x,y,r)=>{for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)if(path.has((x+a)+','+(y+b)))return true;return false};
    for(let i=X0+1;i<=X1-1;i+=2)for(const [x,y] of [[i,Y0+1],[i,Y1-1],[X0+1,i],[X1-1,i]]){if(hs(x,y,25)<.82&&!keep(x,y))C.DB(BL_TREES[(hs(x,y,26)*BL_TREES.length)|0],x,y,{sc:.95+hs(x,y,27)*.35})}
    const nT=opt.trees===undefined?int(W*H*.045):opt.trees;
    for(let n=0;n<nT;n++){const x=X0+((hs(n,1,21)*(X1-X0))|0),y=Y0+((hs(n,2,21)*(Y1-Y0))|0);if(path.has(x+','+y)||keep(x,y)||near(x,y,1))continue;C.DB(BL_TREES[(hs(n,3,21)*BL_TREES.length)|0],x,y,{sc:.85+hs(n,4,21)*.45})}
    const nS=opt.scrub===undefined?int(W*H*.1):opt.scrub;
    for(let n=0;n<nS;n++){const x=X0+((hs(n,1,22)*(X1-X0))|0),y=Y0+((hs(n,2,22)*(Y1-Y0))|0);if(path.has(x+','+y)||keep(x,y))continue;const d=C.D(BL_SCRUB[(hs(n,3,22)*2)|0],x,y,{sc:.7+hs(n,4,22)*.8});if(d){d.ox=(hs(n,5,22)-.5)*.7;d.oy=(hs(n,6,22)-.5)*.7}}
    const nG=opt.stones===undefined?int(W*H*.008):opt.stones;
    for(let n=0;n<nG;n++){const x=X0+2+((hs(n,1,23)*(X1-X0-4))|0),y=Y0+2+((hs(n,2,23)*(Y1-Y0-4))|0);if(keep(x,y)||!near(x,y,2)&&hs(n,9,23)<.5)continue;C.DB(['gy_lean','gy_lean','gy_stone1','gy_wcross','gy_stone2'][(hs(n,3,23)*5)|0],x,y,{sc:.85+hs(n,4,23)*.2})}
    const nB=opt.bones===undefined?int(W*H*.004):opt.bones;
    for(let n=0;n<nB;n++){const x=X0+((hs(n,1,24)*(X1-X0))|0),y=Y0+((hs(n,2,24)*(Y1-Y0))|0);if(keep(x,y))continue;C.D('gy_bones',x,y,{sc:.7})}
    const nP=opt.posts===undefined?int(W*H*.003):opt.posts;
    for(let n=0;n<nP;n++){const x=X0+((hs(n,1,28)*(X1-X0))|0),y=Y0+((hs(n,2,28)*(Y1-Y0))|0);if(keep(x,y))continue;C.DB('gy_rpost',x,y)}};
  const int=Math.floor;
  /* a fair, wide pass of creatures: list [type,x,y] near each spot (a free cell is found if the spot is taken) */
  C.foes=list=>{for(const [t,x,y] of list)C.foeNear(t,x,y,4)};
  /* ---- the level ---- */
  C.finish=o=>{o=o||{};
    const rowsS=[],fmS=[];for(let y=0;y<H;y++){rowsS.push(rows[y].join(''));let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmS.push(s)}
    const st=o.start||spec.start||{x:W-5,y:H>>1,f:3};
    const lv={rows:rowsS,chars,fmap:fmS,floorSet:BL_FLOORSET.slice(),floor:BL_FLOORSET[0],ceil:'cloud',start:st,enemies,items,decor,sky,scenery:[],lights,portals:[],day:.62,outdoor:true,amb:.86,
      name:spec.name,label:spec.name,noExtras:true,diff:C.rating,ceilH:5.2,noTele:!spec.tele,torchGap:1e9,mapNames,_bl:{lcol,col:o.col||[.72,1.1,.95],kind:'road',n:blPlaceN(id)}};
    if(spec.tele)lv.tele=spec.tele;
    LEVELS[id]=lv;LEVEL_NAMES[id]=spec.name;LEVEL_RATING[id]=C.rating;
    // the check: everything that can be walked to is reached from the start; a prop that walls a pocket in is taken away
    {const D4=[[1,0],[-1,0],[0,1],[0,-1]];
     for(let pass=0;pass<6;pass++){const bs=new Set();for(const d of decor)if(d.block)bs.add(d.x+','+d.y);
      const seen=new Uint8Array(W*H),q=[st.y*W+st.x];seen[q[0]]=1;
      for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of D4){const nx=x+a,ny=y+b;if(nx<X0||ny<Y0||nx>X1||ny>Y1||rows[ny][nx]!=='.'||seen[ny*W+nx]||bs.has(nx+','+ny))continue;seen[ny*W+nx]=1;q.push(ny*W+nx)}}
      const kill=new Set();for(let y=Y0;y<=Y1;y++)for(let x=X0;x<=X1;x++)if(rows[y][x]==='.'&&!seen[y*W+x]&&!bs.has(x+','+y))for(const [a,b] of D4){const k=(x+a)+','+(y+b);if(bs.has(k))kill.add(k)}
      if(!kill.size)break;let gone=0;
      for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.block&&kill.has(d.x+','+d.y)&&!d.npc){decor.splice(i,1);gone++}}
      if(!gone)break}}
    {for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]!=='.')block[y*W+x]=1;try{TERRS[id]=yarTerrain(W,H,hgt,rk,block)}catch(e){console.error(e)}}
    if(typeof WIND_AMT!=='undefined')WIND_AMT[id]=spec.wind===undefined?.3:spec.wind;
    return lv};
  return C}
/* ---------- a room (an interior, a cellar): khRoom with a template of your own. spec: {id, name, w, h, floor, amb, wall, lights:[[x,y]], build:fn(C), back:{to,x,y,f}, enemies:[[t,x,y]], rating} ---------- */
function blRoom(spec){
  const id=spec.id,b={id:'bl'+id,name:spec.name,room:'home',keeper:null,floor:spec.floor||'wood',wallImg:spec.wall||'kh_ohwall1_0',
    tpl:()=>({w:spec.w,h:spec.h,floor:spec.floor||'wood',amb:spec.amb||.55,tele:spec.tele,noExtras:true,lights:spec.lights||[[2,2],[spec.w-3,2],[spec.w>>1,spec.h>>1]],enemies:(spec.enemies||[]).map(e=>[e[0],e[1],e[2],spec.rating||LEVEL_RATING[id]||84]),build:spec.build})};
  const R=khRoom(b,id,spec.back);
  const L=R.level;LEVELS[id]=L;LEVEL_NAMES[id]=spec.name;LEVEL_RATING[id]=spec.rating||LEVEL_RATING[id]||84;L.diff=L.rating=spec.rating||84;L.noExtras=true;L._bl={lcol:spec.lcol||{},col:spec.col||[1.4,1.0,.6],kind:'room'};
  return L}
/* ---------- the stubs: a place that is not built yet is a short stretch of road with its milestone, linked both ways ---------- */
function blStubBuild(p){
  const C=blKit({id:p.id,W:44,H:20,name:p.name,lvl:p.lvl,start:{x:39,y:10,f:3}});
  C.boundary();C.setF(2,2,41,17,'0');C.pth(2,9,41,11,'1');
  C.gate('E',10);C.gate('W',10);
  C.milestone(38,8);
  C.post(35,12,'bl_stubpost',['BLIGHTED ROAD'],'bl_stubsign','A signpost at the side of the road. The board reads BLIGHTED ROAD. Somebody has written under it: this stretch is not written yet. Keep walking.',{i:3});
  C.dress({trees:30,scrub:70,stones:6,bones:2,posts:2,keep:(x,y)=>y>=8&&y<=12});
  const lv=C.finish({start:{x:39,y:10,f:3}});
  p.fromE={x:39,y:10,f:3};p.fromW={x:4,y:10,f:1};p.exitY=10;
  return lv}
function blRoomStub(id,p){
  const main=p.id;
  blRoom({id,name:'An unfinished room',w:9,h:7,amb:.55,back:{to:main,x:p.fromE.x,y:p.fromE.y,f:p.fromE.f},build:()=>{}})}
/* arrival: the first visit says where the party is; the last place reached is kept for the story hint */
function blArrive(n){
  const p=blPlaceOf(n);if(!p)return;const F=blF();
  if(n===p.id){if(!F.last||F.last<p.n)F.last=p.n;if(!F['seen'+p.n]){F['seen'+p.n]=1;try{msg(p.name+'. Sale is '+p.sale+(p.sale===1?' stage':' stages')+' on.','#b8d0a8')}catch(e){}}}}
