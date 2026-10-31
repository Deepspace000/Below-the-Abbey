/* ==========================================================================
   THE PALE SPIRE, SECOND FLOOR: THE ILLUSION KIT (prefix f2 / F2). Shared by the hub (ps_f2_hub.js, 9820) and the seven illusion rooms (ps_f2_rooms_a/b/c.js, 9821 to 9827).
   See tools/PS_F2_SPEC.md (the brief) and tools/PS_F2_NOTES.md (how it is built). Items and flags are in ps_f2_core.js (psf2Give, psf2F).
   What is here:
     F2B[id]                 the biome of each room: sky colours, mist, light, weather effect, the text of the air, the sound
     f2Room(spec)            the room maker (pspMake outdoor + the mist wall border + the open band round the paths and clearings + filler props + the way back to the castle)
     f2Foe(C,t,x,y) / F2_FOES  the creatures of the illusions: existing painted creatures of the matching areas (forest, sea, snow, water, desert, swamp, nightmare), some re-toned
     f2Thing(C,key,npc,x,y,o) a clickable piece (khNpc registered by the caller); f2Hide(key,x,y,on) shows or hides a piece in the live level
     f2OnArrive(id,fn)       called on every arrival in that room (puzzle state is applied, half-done sequences reset)
   The castle passes (ps_curate, ps_tidy ...) wrap KH_LAZY at their own load time, before these files register: the rooms arrange themselves by hand and call pswaHang (wall pictures) at the end.
   ========================================================================== */
const F2={HUB:9820,ROOMS:[9821,9822,9823,9824,9825,9826,9827],sky:{},tiles:{},art:0,arrive:{},R:{}};
const f2Is=n=>n>=9821&&n<=9827;
const f2Room0=n=>F2.ROOMS.includes(n);
/* the state of a room's puzzle: psf2F().rooms[roomNo] (saved with the game) */
const f2S=id=>{const F=psf2F(),n=id-9820;return F.rooms[n]||(F.rooms[n]={})};
/* ---------- the biomes ---------- */
const F2B={
  9821:{k:'forest',sky:{top:[40,110,200],mid:[126,186,236],low:[240,230,190]},cloud:.95,silver:.3,fog:[228,214,156,.005],haze:.08,amb:1.2,lcol:[1.3,1.18,.86],wn:'Morning mist',fx:null,
    text:'A soft morning mist hangs between the trees. Birds sing somewhere. Everything here is a little too perfect.'},
  9822:{k:'island',sky:{top:[40,104,196],mid:[110,168,228],low:[206,226,240]},cloud:1.05,fog:[186,208,228,.008],amb:1.05,lcol:[1.15,1.1,.95],wn:'Sea air',fx:null,
    text:'A warm wind blows off the sea. The sun is bright, and the waves come in slow and even, always the same.'},
  9823:{k:'snow',sky:{top:[150,164,184],mid:[190,200,212],low:[226,230,236]},cloud:1.15,fog:[214,222,232,.02],amb:.95,lcol:[.95,1.0,1.12],wn:'Snow',fx:'snow',
    text:'Snow falls without a sound. It is bitterly cold, and the light is grey and even.'},
  9824:{k:'water',sky:{top:[46,44,104],mid:[206,124,118],low:[255,196,128]},cloud:1.9,fog:[214,176,160,.006],haze:.1,silver:.62,amb:1.0,lcol:[1.45,1.05,.7],wn:'Evening haze',fx:null,
    text:'The canals lie still under a pink evening sky. Water laps at the steps, and somewhere a bell rings the hour.'},
  9825:{k:'desert',sky:{top:[84,146,212],mid:[200,202,192],low:[242,216,160]},cloud:.55,fog:[230,210,170,.007],haze:.12,amb:1.15,lcol:[1.3,1.1,.75],wn:'Heat',fx:'heat',
    text:'The sun beats down on the sand. The air shimmers with heat, and there is no wind.'},
  9826:{k:'swamp',sky:{top:[38,48,44],mid:[78,94,80],low:[118,130,104]},cloud:1.0,fog:[92,106,84,.034],amb:.62,lcol:[.85,1.1,.7],wn:'Bog mist',fx:null,
    text:'A thick green mist lies on the black water. Frogs croak, and the mud bubbles and stinks.'},
  9827:{k:'nightmare',sky:{top:[8,0,6],mid:[56,10,16],low:[116,30,24]},cloud:.7,fog:[30,6,10,.018],haze:0,amb:.5,lcol:[1.3,.55,.5],wn:'Red dark',fx:null,
    text:'The sky is the colour of a bruise, and the air is thick and still. Things move just out of sight.'}};
/* ---------- floors: f2 names to engine FLOORS keys (some re-toned here) ---------- */
const F2_FLMAKE={snow:['scree',1.62,[.97,1.0,1.07]],snowpath:['wwf_dirt',1.05,[.9,.94,1.02]],bogwater:['water',.78,[.66,.86,.58]],canal:['water',.66,[.62,.92,.98]],
  seawater:['bluewater',1.0,[1,1,1]],blood:['redsand2',.6,[.9,.6,.6]],ash:['blf_ash',.7,[.9,.85,.9]]};
function f2FloorKey(n){
  const m=F2_FLMAKE[n];if(!m)return FLOORS[n]?n:'grass';
  const out='f2f_'+n;if(!FLOORS[out]){if(FLOORS[m[0]]&&typeof gyFloorTone==='function')try{gyFloorTone(out,m[0],m[1],m[2])}catch(e){}if(!FLOORS[out])FLOORS[out]=FLOORS[m[0]]||FLOORS.grass}
  return out}
/* C.fl(name) gives the floor char of an f2 floor name (registered once with the castle floor cache so that pspMake's finish maps it) */
function f2Fl(C,n){const nm='f2:'+n;if(typeof PSPK!=='undefined')PSPK.floors[nm]=f2FloorKey(n);return C.floor(nm)}
/* ---------- the sky of each room: a 1024 x 256 panorama in the biome's colours, soft cloud (made once per room) ---------- */
function f2SkyArr(id){
  if(F2.sky[id])return F2.sky[id];
  const B=F2B[id],W=1024,H=256,d=new Uint8ClampedArray(W*H*4),S=B.sky,hs=(a,b,c)=>hash2(a,b,c+id);
  const lat=(gx,gy,gw,seed)=>hs(((gx%gw)+gw)%gw,gy,seed);
  const vn=(x,y,cw,ch,seed)=>{const u=x/cw,v=y/ch,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),gw=Math.ceil(W/cw);
    return (lat(i,j,gw,seed)*(1-sx)+lat(i+1,j,gw,seed)*sx)*(1-sy)+(lat(i,j+1,gw,seed)*(1-sx)+lat(i+1,j+1,gw,seed)*sx)*sy};
  const cl=B.cloud||1;
  for(let y=0;y<H;y++){const v=Math.min(1,y/150),top=v<.55?v/.55:1,low=Math.max(0,(v-.55)/.45);
    for(let x=0;x<W;x++){
      let r=S.top[0]+(S.mid[0]-S.top[0])*top+(S.low[0]-S.mid[0])*low,g=S.top[1]+(S.mid[1]-S.top[1])*top+(S.low[1]-S.mid[1])*low,b=S.top[2]+(S.mid[2]-S.top[2])*top+(S.low[2]-S.mid[2])*low;
      const f=vn(x,y,160,44,3)*.5+vn(x,y,70,24,5)*.32+vn(x,y,26,10,7)*.18,c=Math.max(0,f-.52)*2.2*cl*(1-low*.6);
      const cw=B.k==='nightmare'?[120,40,40]:B.k==='swamp'?[150,160,140]:B.k==='water'?[255,214,200]:[250,252,255];
      r+=(cw[0]-r)*Math.min(1,c);g+=(cw[1]-g)*Math.min(1,c);b+=(cw[2]-b)*Math.min(1,c);
      {const sv=Math.max(0,Math.min(1,(y-118)/34))*(B.silver===undefined?.42:B.silver);r+=(214-r)*sv;g+=(222-g)*sv;b+=(234-b)*sv}   // the illusion thins to a band of silver mist along the horizon
      const o=(y*W+x)*4;d[o]=Math.min(255,r);d[o+1]=Math.min(255,g);d[o+2]=Math.min(255,b);d[o+3]=255}}
  return F2.sky[id]=d}
/* the castle kit draws its night sky on every outdoor castle level: in an illusion room the room's own sky is shown instead */
{const _sf=pspSkyFrame;pspSkyFrame=function(){
  if(f2Is(LEVEL)&&LEVELS[LEVEL]&&LEVELS[LEVEL].outdoor){if(!PSPK.live)PSPK.live=new Uint8ClampedArray(1024*256*4);self.BKSKY_LV=LEVEL;self.BKSKY_PAN=f2InRoof()?f2RoofPan(F2.inside[LEVEL][4]):f2SkyArr(LEVEL);return}
  return _sf.apply(this,arguments)}}
/* a room inside an outdoor illusion (the snow cabin): F2.inside[id]=[x0,y0,x1,y1,roof texture]; while the party stands in it the sky is a roof and no weather falls */
F2.inside={};
function f2InRoof(){const r=F2.inside[LEVEL];if(!r||!G.P)return false;const x=Math.round(G.C?G.C.x:G.P.x),y=Math.round(G.C?G.C.y:G.P.y);return x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3]}
function f2RoofPan(key){F2.roof=F2.roof||{};if(F2.roof[key])return F2.roof[key];const im=IMG[key];const c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d');x.fillStyle='#1c120a';x.fillRect(0,0,1024,256);
  if(im&&im.width)for(let yy=0;yy<256;yy+=128)for(let xx=0;xx<1024;xx+=128)x.drawImage(im,xx,yy,128,128);
  const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'rgba(10,6,3,.55)');g.addColorStop(.7,'rgba(30,18,8,.2)');g.addColorStop(1,'rgba(60,36,16,.1)');x.fillStyle=g;x.fillRect(0,0,1024,256);
  return F2.roof[key]=x.getImageData(0,0,1024,256).data}
/* a painted texture (assets/ps tex) as a wall tile */
function f2TexWall(key,wh,o){o=o||{};const im=IMG[key];if(!im||!im.width)return null;const nm='f2w_'+key;IMG['gyp_'+nm]=im;return gyTile(nm,wh,{gain:o.gain||1.0,rgb:o.rgb||[1,1,1],tag:'f2tw'+key})}
/* the air: each room's own mist, light and weather effect (snow falling, heat shimmer) */
{const _w=weatherNow;weatherNow=function(){
  if(f2Is(LEVEL)&&f2InRoof())return {id:'fog',n:'Indoors',fog:.01,haze:0,dark:0,mix:.2,col:[60,40,24],text:'',fx:null};
  if(f2Is(LEVEL)){const B=F2B[LEVEL];return {id:'fog',n:B.wn,fog:B.fog[3],haze:B.haze===undefined?.25:B.haze,dark:0,mix:.4,col:B.fog.slice(0,3),text:B.text,fx:B.fx||null}}
  return _w.apply(this,arguments)}}
/* ---------- the mist wall: the edge of every illusion. Pale silver mist with cracks where the black stone of the castle shows through (made in code, like the castle walls) ---------- */
function f2MistGid(v,wh){
  const k='mist'+v+'|'+wh;if(F2.tiles[k]!==undefined)return F2.tiles[k];
  if(IMG.ps_f2_tex_mist&&IMG.ps_f2_tex_mist.width){IMG.gyp_f2_tex_mist=IMG.ps_f2_tex_mist;return F2.tiles[k]=gyTile('f2_tex_mist',wh,{gain:1.05,rgb:[.95,.98,1.03],tag:'f2mistP'+(v%3),draw:(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(225,232,240,.35)');g.addColorStop(1,'rgba(225,232,240,0)');x.fillStyle=g;x.fillRect(0,0,w,h)}})}   // the painted mist (Gemini), cracks and all
  return F2.tiles[k]=gyTile('texBlack_'+(v%5),wh,{gain:1.0,rgb:[.92,.97,1.04],tag:'f2mist'+v,draw:(x,w,h)=>{
    const hs=(a,b,c)=>hash2(a,b,c+7300+v*13),m=document.createElement('canvas');m.width=w;m.height=h;const mx=m.getContext('2d');
    const gr=mx.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(200,210,222,.72)');gr.addColorStop(.6,'rgba(214,222,232,.9)');gr.addColorStop(1,'rgba(226,232,240,.96)');mx.fillStyle=gr;mx.fillRect(0,0,w,h);
    for(let n=0;n<40;n++){const px=hs(n,1,1)*w,py=hs(n,2,1)*h,r=16+hs(n,3,1)*34;const g2=mx.createRadialGradient(px,py,1,px,py,r);const a=.1+hs(n,4,1)*.2;g2.addColorStop(0,'rgba(245,248,252,'+a+')');g2.addColorStop(1,'rgba(245,248,252,0)');mx.fillStyle=g2;mx.fillRect(px-r,py-r,r*2,r*2)}
    // soft veils of brighter mist drifting down the face
    for(let n=0;n<6;n++){const px=hs(n,7,1)*w,vw=10+hs(n,8,1)*26,g3=mx.createLinearGradient(px-vw,0,px+vw,0);g3.addColorStop(0,'rgba(255,255,255,0)');g3.addColorStop(.5,'rgba(255,255,255,'+(.08+hs(n,9,1)*.14)+')');g3.addColorStop(1,'rgba(255,255,255,0)');mx.fillStyle=g3;mx.fillRect(px-vw,0,vw*2,h)}
    // the cracks: wide jagged rifts through the mist where the black castle stone shows
    mx.lineCap='round';mx.lineJoin='round';
    const cracks=[];const nc=1+((hs(v,9,2)*3)|0);for(let c=0;c<nc;c++){let px=14+hs(c,5,2)*(w-28),py=h*(.05+hs(c,6,2)*.45);const pts=[[px,py]];for(let s=0;s<8;s++){px+=(hs(c,s,3)-.5)*34;py+=12+hs(c,s,4)*28;px=Math.max(6,Math.min(w-6,px));pts.push([px,py])}cracks.push(pts)}
    const path=pts=>{mx.beginPath();mx.moveTo(pts[0][0],pts[0][1]);for(const p of pts)mx.lineTo(p[0],p[1])};
    for(const pts of cracks){mx.strokeStyle='rgba(150,165,185,.55)';mx.lineWidth=16;path(pts);mx.stroke();   // a cold halo where the mist thins
      mx.globalCompositeOperation='destination-out';mx.lineWidth=9;path(pts);mx.stroke();const b=pts[3];mx.lineWidth=4;mx.beginPath();mx.moveTo(b[0],b[1]);mx.lineTo(b[0]+(hs(b[0],1,5)-.5)*44,b[1]+22);mx.stroke();mx.globalCompositeOperation='source-over'}
    x.drawImage(m,0,0);
    // inside the rifts the stone is black and wet
    x.save();x.globalCompositeOperation='destination-over';x.restore();
    for(const pts of cracks){x.strokeStyle='rgba(6,8,12,.55)';x.lineWidth=5;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(const p of pts)x.lineTo(p[0],p[1]);x.stroke();
      x.strokeStyle='rgba(235,242,250,.75)';x.lineWidth=1.3;x.beginPath();x.moveTo(pts[0][0]-5,pts[0][1]);for(const p of pts)x.lineTo(p[0]-5,p[1]);x.stroke()}}})}
/* ---------- re-toned copies of existing painted creatures and props (the original pictures are not touched) ---------- */
const F2_TINT=[ // new key, source key, canvas filter, overlay colour (source-atop) or null
  ['f2i_snowwolf','wolf','grayscale(.85) brightness(1.55) contrast(.92)','rgba(200,222,255,.22)'],
  ['f2i_snowbear','bear','grayscale(.9) brightness(1.7) contrast(.9)','rgba(210,226,255,.2)'],
  ['f2i_frostwraith','gyi_wraith','grayscale(.6) brightness(1.25)','rgba(120,190,255,.32)'],
  ['f2i_icegolem','art_wm_golem','hue-rotate(-75deg) saturate(.7) brightness(1.35)','rgba(170,220,255,.18)'],
  ['f2i_sandwraith','gyi_shade','sepia(1) saturate(1.4) brightness(1.5)',null],
  ['f2i_dustdevil','hl_phantom','sepia(1) saturate(1.3) brightness(1.15)','rgba(210,170,110,.25)'],
  ['f2i_swamptroll','gyi_giant','hue-rotate(55deg) saturate(.9) brightness(.85)','rgba(60,90,40,.25)'],
  ['f2i_watersprite','wwi_wisp','hue-rotate(105deg) saturate(1.2) brightness(1.1)',null],
  ['f2i_seaspawn','art_hgfsnake','hue-rotate(95deg) saturate(1.25) brightness(1.05)',null],
  ['f2i_snowpine','ptree5','saturate(.5) brightness(1.15)','rgba(225,235,250,.32)'],
  ['f2i_snowpine2','ptree6','saturate(.5) brightness(1.2)','rgba(225,235,250,.36)'],
  ['f2i_snowbirch','ptree4','brightness(1.05)',null],
  ['f2i_snowrock','grocks','grayscale(.6) brightness(1.5)','rgba(230,238,250,.3)'],
  ['f2i_snowboulder','gboulder','grayscale(.7) brightness(1.45)','rgba(230,238,250,.3)'],
  ['f2i_snowlog','glogm','grayscale(.4) brightness(1.2)','rgba(230,238,250,.25)'],
  ['f2i_bogwillow','ww_willow','brightness(1.15) saturate(1.1)','rgba(40,70,40,.2)'],
  ['f2i_nightoak','ww_oakface','brightness(.9)','rgba(120,20,20,.25)'],
  ['f2i_nightthorn','ww_thorn','brightness(.9)','rgba(110,20,20,.25)']];
function f2Tint(nk,src,filt,ov){
  if(IMG[nk]&&IMG[nk].width)return nk;const im=IMG[src];if(!im||!im.width)return null;
  const mk=s=>{const c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');try{x.filter=filt||'none'}catch(e){}x.drawImage(s,0,0);x.filter='none';
    if(ov){x.globalCompositeOperation='source-atop';x.fillStyle=ov;x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='source-over'}return c};
  IMG[nk]=mk(im);if(NPC_H[src]!==undefined)NPC_H[nk]=NPC_H[src];
  const A=IMG[src+'A'];if(A&&A.width)IMG[nk+'A']=mk(A);
  return nk}
/* painted trees of the rooms go by tree names of the engine (ltree81 and up), so they cast no round shadow and fade like the woodland trees */
const F2_TREES=['f2_fo_oak','f2_fo_beech','f2_fo_fir','f2_fo_maple','f2_fo_birch','f2_fo_lime','f2_sn_pine','f2_sn_spruce','f2_sn_birch','f2_sn_fir','f2_sn_dead','f2_de_palm','f2_hollowoak'];
function f2Tree(name){return pspPic(name)}
const F2_TREE_RX=new RegExp('^ps_('+F2_TREES.join('|')+')(_fl)?$');
function f2Art(){
  if(F2.art)return;F2.art=1;
  for(const t of F2_TINT)try{f2Tint(t[0],t[1],t[2],t[3])}catch(e){console.error('f2 tint',t[0],e)}
  // painted wall textures of other areas, aliased for gyTile (it reads IMG['gyp_'+name])
  for(const [a,b] of [['f2_rock','pf_rock'],['f2_ruin','pf_ruinwall']])if(IMG[b]&&IMG[b].width)IMG['gyp_'+a]=IMG[b];
  for(const t in ENEMY_DEF){const d=ENEMY_DEF[t];if(d&&d.f2&&d.f2h&&IMG[d.img]&&IMG[d.img].width){const im=IMG[d.img];d.w=+(d.f2h*im.width/im.height).toFixed(2)}}}
/* ---------- the creatures of the illusions ---------- */
/* [id, name, picture, height in cells (the width follows the picture), hp, dmg, verb, extra] ; base numbers like the castle's own creatures (the level of the room scales them) */
const F2_FOES=[
  ['f2wolf','Forest Wolf','wolf',1.0,74,[8,13],'bites',{speed:2}],
  ['f2stag','Thorn Stag','cr_stag',1.45,96,[9,14],'gores',{}],
  ['f2treant','Treant','wwi_root',2.0,128,[10,15],'lashes',{}],
  ['f2wasps','Wasp Swarm','hg_swarm0',1.0,52,[7,11],'stings',{fly:true,floatH:.3,speed:2}],
  ['f2crab','Giant Crab','uw_crab_0',.75,92,[9,14],'pinches',{}],
  ['f2siren','Siren','hl_banshee',1.6,70,[9,14],'shrieks at',{fly:true,floatH:.15,ranged:2,glow:.3}],
  ['f2gull','Storm Gull','yar_gull_stand',.8,48,[7,11],'pecks',{fly:true,floatH:.25,speed:2}],
  ['f2spawn','Sea Serpent Spawn','f2i_seaspawn',1.1,88,[9,14],'bites',{}],
  ['f2snowwolf','Snow Wolf','f2i_snowwolf',1.0,78,[8,13],'bites',{speed:2}],
  ['f2frostwraith','Frost Wraith','f2i_frostwraith',1.7,84,[9,14],'chills',{fly:true,floatH:.12,glow:.3}],
  ['f2snowbear','Snow Bear','f2i_snowbear',1.35,118,[10,16],'mauls',{}],
  ['f2iceelem','Ice Elemental','f2i_icegolem',1.9,124,[10,15],'crushes',{}],
  ['f2eel','Canal Eel','uw_eel_0',.9,76,[8,13],'bites',{}],
  ['f2gondolier','Drowned Gondolier','ps_c_psdrowned',1.7,96,[9,14],'strikes with an oar at',{}],
  ['f2sprite','Water Sprite','f2i_watersprite',.9,58,[8,12],'splashes',{fly:true,floatH:.35,ranged:2,glow:.35}],
  ['f2cutthroat','Masked Cutthroat','assassin',1.7,88,[10,15],'stabs',{speed:2}],
  ['f2scorpion','Sand Scorpion','scorpion',.8,84,[9,14],'stings',{}],
  ['f2mummy','Mummy','mummy',1.75,104,[9,14],'claws',{}],
  ['f2sandwraith','Sand Wraith','f2i_sandwraith',1.7,80,[9,14],'rakes',{fly:true,floatH:.15}],
  ['f2dustdevil','Dust Devil','f2i_dustdevil',1.6,64,[8,13],'whips sand at',{fly:true,floatH:.1,speed:2}],
  ['f2leech','Bog Leech','art_hgfleech',.8,86,[8,13],'sucks at',{}],
  ['f2hag','Bog Hag','hl_witch',1.7,92,[9,15],'curses',{ranged:2}],
  ['f2wisp','Will-o-the-Wisp','wwi_wisp',.9,56,[8,12],'burns',{fly:true,floatH:.4,glow:.5}],
  ['f2troll','Swamp Troll','f2i_swamptroll',1.9,130,[10,16],'smashes',{}],
  ['f2frog','Giant Frog','art_hgmtoad',1.0,84,[8,13],'snaps at',{}],
  ['f2shadow','Shadow','gyi_shade',1.7,78,[9,14],'rakes',{fly:true,floatH:.1}],
  ['f2horror','Many-Faced Horror','hl_choir',1.8,120,[10,16],'smothers',{}],
  ['f2hound','Nightmare Hound','wwi_hound',1.05,86,[9,14],'savages',{speed:2}],
  ['f2hands','Clawing Hands','hl_hands',1.2,74,[9,14],'claws',{}],
  ['f2doll','Grinning Doll','hl_jester',1.6,70,[9,14],'cuts',{speed:2}]];
for(const [id,name,img,h,hp,dmg,verb,ex] of F2_FOES){
  const src=Object.values(ENEMY_DEF).find(d=>d&&d.img===img);
  ENEMY_DEF[id]=Object.assign({name,hp,dmg,hit:.87,w:src&&src.w?src.w:h*.7,img,xp:Math.round(26+hp/12),gold:[160,420],speed:1,verb,f2:1,f2h:h},ex||{})}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^f2(wolf|snowwolf|hound|stag)/,'bleeding',.15],[/^f2(frostwraith|iceelem|snowbear)/,'frostbitten',.12],[/^f2(hag|shadow|doll|horror)/,'cursed',.12],[/^f2(leech|scorpion|wasps)/,'poisoned',.15]);
/* a creature at the room's level (103 or 104); refused inside a safe zone (pspFoe) */
function f2Foe(C,t,x,y){const ok=pspFoe(C,t,x,y);if(ok)C.enemies[C.enemies.length-1].lvl=C.rating;return ok}
/* ---------- clickable pieces and the live level ---------- */
function f2Thing(C,key,npc,x,y,o){return C.dec(key,x,y,Object.assign({block:true,npc},o||{}))}
/* show or hide a piece in the live level (by picture and square); returns true if found */
function f2Hide(key,x,y,hide){let n=0;for(const d of G.decor||[])if(d.k===key&&Math.round(d.x)===x&&Math.round(d.y)===y){d.hidden=!!hide;d.found=!!hide;if(hide)d.block=false;else if(d.npc)d.block=true;n++}return n>0}
function f2OnArrive(id,fn){(F2.arrive[id]=F2.arrive[id]||[]).push(fn)}
pspOnArrive((n,restored)=>{for(const fn of F2.arrive[n]||[])try{fn(restored)}catch(e){console.error('f2 arrive',n,e)}});
/* spawn a few creatures next to the party (a wrong answer in a puzzle): real creatures at the room's level, on free squares near (x,y) */
function f2Release(t,n,x,y){
  if(!ENEMY_DEF[t])return 0;F2.amb=(F2.amb||[]).filter(e=>e.hp>0&&G.enemies.includes(e));if(F2.amb.length>=4)return 0;   // never more than four released at a time
  let k=0;
  for(let r=2;r<=5&&k<n;r++)for(let dy=-r;dy<=r&&k<n;dy++)for(let dx=-r;dx<=r&&k<n;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const a=x+dx,b=y+dy;
    if(!G.grid[b]||cellBlocked(a,b)||enemyAt(a,b)||(a===Math.round(G.P.x)&&b===Math.round(G.P.y)))continue;
    try{addEnemy(t,a,b,true);const e=G.enemies[G.enemies.length-1];if(e)F2.amb.push(e);k++}catch(err){console.error('f2 release',err)}}
  return k}
/* ---------- the sound of each room (the castle's own pspTick is quiet here) ---------- */
const F2SND={n:{}};
function f2Due(k,lo,hi,now){const N=F2SND.n;if(N[k]===undefined){N[k]=now+Math.random()*hi*.5;return false}if(now<=N[k])return false;N[k]=now+lo+Math.random()*(hi-lo);return true}
function f2Surf(v){if(!AC||G.mute)return;nz(3.6,.05*v,'lowpass',400,900,0);nz(2.2,.025*v,'bandpass',1400,2200,1.2)}
function f2Leaves(v){if(!AC||G.mute)return;nz(2.6,.018*v,'bandpass',2600,1800,0)}
function f2Frog(v){if(!AC||G.mute)return;const f=120+Math.random()*60;for(let i=0;i<3;i++){tone(f,f*.8,.09,'square',.012*v,i*.16);tone(f*2,f*1.6,.07,'sine',.01*v,i*.16)}}
function f2Bell(v){if(!AC||G.mute)return;const f=196;tone(f,f*.995,3,'sine',.04*v,0);tone(f*2.76,f*2.75,1.8,'sine',.012*v,0)}
function f2Whisper(v){if(!AC||G.mute)return;for(let i=0;i<4;i++)nz(.35,.012*v,'bandpass',1600+Math.random()*2400,900,i*.4+Math.random()*.2)}
function f2Heart(v){if(!AC||G.mute)return;tone(55,45,.18,'sine',.06*v,0);tone(55,45,.16,'sine',.045*v,.28)}
function f2Tick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!f2Is(LEVEL)||!SNDOPT.amb)return;
  const now=AC.currentTime,B=F2B[LEVEL],D=(k,lo,hi)=>f2Due(k+LEVEL,lo,hi,now);
  switch(B.k){
    case 'forest':if(D('b',4,10)&&typeof gmsBird==='function')gmsBird(.7);if(D('l',7,14))f2Leaves(.8);if(D('w',16,30)&&typeof wlsBird==='function')wlsBird(.5);break;
    case 'island':if(D('s',5,9))f2Surf(.9);if(D('g',9,20)&&typeof gullCry==='function')gullCry(.5);break;
    case 'snow':if(D('w',6,12))pssWind(1.0);if(D('c',30,60))wwsCreak(.3);break;
    case 'water':if(D('w',6,12))pssWater(.5);if(D('b',35,70))f2Bell(.6);if(D('d',8,16))wwsDrip(.5);break;
    case 'desert':if(D('w',10,20))pssWind(.45);if(D('v',30,60)&&typeof wwsCrow==='function')wwsCrow(.25);break;
    case 'swamp':if(D('f',3,7))f2Frog(.8);if(D('u',6,12))wwsBubble(.7);if(D('c',25,45))wwsCrow(.4);break;
    case 'nightmare':if(D('h',2.2,2.6))f2Heart(.7);if(D('x',8,16))f2Whisper(.8);if(D('m',20,40))pssMoan(.6);break}}
{const _pt=pspTick;pspTick=function(){if(typeof LEVEL!=='undefined'&&f2Is(LEVEL)){try{f2Tick()}catch(e){console.error('f2 tick',e)}return}return _pt.apply(this,arguments)}}
/* ---------- the room maker ----------
   spec: {id, ground:'lush', path:'trail', wh, route:[[x,y],...] (centre line from the arrival north), rw:1 (half width of the path), clear:[[x0,y0,x1,y1,floor,name,ellipse]],
          band:[lo,hi] (open ground beyond the core, squares), edge:(C,x,y)=>true if handled (else mist wall), filler:[keys], fillSc, scrub:[keys], keep:(x,y)=>true to keep a square free}
   returns C with: C.core (Uint8Array), C.E (distance from the core), C.open(x,y), C.mist(x,y), C.water(x,y,floor), C.ret() (the way back), C.done(o) (finish) */
function f2Room(S){
  const id=S.id,W=48,H=40,B=F2B[id],wh=S.wh||3.2;
  f2Art();
  const C=pspMake({id,start:{x:24,y:35,f:0},floor:'f2:'+(S.ground||'lush'),wh,amb:B.amb,wind:S.wind===undefined?.25:S.wind,lcol:B.lcol});
  if(typeof PSPK!=='undefined')PSPK.floors['f2:'+(S.ground||'lush')]=f2FloorKey(S.ground||'lush');
  const {rows,block,fm}=C,ix=(x,y)=>y*W+x,hs=(a,b,c)=>hash2(a,b,c+id);C.f2=S;C.hs2=hs;
  const vn=(x,y,cs,sd)=>{const u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return(hs(i,j,sd)*(1-sx)+hs(i+1,j,sd)*sx)*(1-sy)+(hs(i,j+1,sd)*(1-sx)+hs(i+1,j+1,sd)*sx)*sy};C.vn=vn;
  C.open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.'&&!block[ix(x,y)];
  C.mist=(x,y)=>C.solid(x,y,C.ch(f2MistGid((hs(x,y,3)*5)|0,S.mistH||2.9)));
  C.water=(x,y,fl)=>{if(x<2||y<2||x>W-3||y>H-3)return;rows[y][x]='.';fm[ix(x,y)]=f2Fl(C,fl||'seawater');block[ix(x,y)]=1;C.used.add(x+','+y)};
  C.fl=n=>f2Fl(C,n);
  C.setFl=(x0,y0,x1,y1,n)=>{const c=f2Fl(C,n);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.'&&!block[ix(x,y)])fm[ix(x,y)]=c};
  // the core: the paths, the clearings, the arrival glade, the puzzle place
  const core=new Uint8Array(W*H),path=new Uint8Array(W*H);C.core=core;C.pathM=path;
  const mark=(x,y,a)=>{if(x>=2&&y>=2&&x<=W-3&&y<=H-3){core[ix(x,y)]=1;if(a)a[ix(x,y)]=1}};
  const rw=S.rw===undefined?1:S.rw;
  const line=(R0)=>{const R=R0.p||R0,w=R0.rw===undefined?rw:R0.rw;for(let i=0;i<R.length-1;i++){const [ax,ay]=R[i],[bx,by]=R[i+1],len=Math.max(Math.abs(bx-ax),Math.abs(by-ay));for(let t=0;t<=len;t++){const x=Math.round(ax+(bx-ax)*t/len),y=Math.round(ay+(by-ay)*t/len);for(let dy=-w;dy<=w;dy++)for(let dx=-w;dx<=w;dx++)mark(x+dx,y+dy,path)}}};
  for(const R of (S.routes||[S.route]))if(R)line(R);
  for(const c of S.clear||[]){const [x0,y0,x1,y1,,,ell]=c,cx=(x0+x1)/2,cy=(y0+y1)/2,rx=(x1-x0)/2+.5,ry=(y1-y0)/2+.5;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(ell&&((x-cx)/rx)**2+((y-cy)/ry)**2>1.05)continue;mark(x,y)}}
  for(let y=33;y<=37;y++)for(let x=21;x<=27;x++)mark(x,y);
  // E: how far every square is from the core (king moves)
  const E=new Float32Array(W*H).fill(99);for(let i=0;i<W*H;i++)if(core[i])E[i]=0;
  for(let pass=0;pass<2;pass++){const ys=[...Array(H).keys()],xs=[...Array(W).keys()];if(pass){ys.reverse();xs.reverse()}const nb=pass?[[1,0],[1,1],[0,1],[-1,1]]:[[-1,0],[-1,-1],[0,-1],[1,-1]];
    for(const y of ys)for(const x of xs)for(const [a,b] of nb){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<W&&ny<H&&E[ix(nx,ny)]+1<E[ix(x,y)])E[ix(x,y)]=E[ix(nx,ny)]+1}}
  C.E=E;
  const band=S.band||[2,5],lim=S.noBand?(()=>0):(x,y)=>band[0]+Math.floor(vn(x,y,6,41)*(band[1]-band[0]+1)*.9+vn(x,y,3,42)*1.2);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const ring=x<2||y<2||x>W-3||y>H-3;
    if(ring){C.mist(x,y);continue}
    if(core[ix(x,y)]||E[ix(x,y)]<=lim(x,y))continue;
    if(S.edge&&S.edge(C,x,y))continue;
    C.mist(x,y)}
  // floors: the path, the clearings
  if(S.path)for(let i=0;i<W*H;i++)if(path[i]&&rows[(i/W)|0][i%W]==='.'&&!block[i])fm[i]=f2Fl(C,S.path);
  for(const c of S.clear||[])if(c[4]){const [x0,y0,x1,y1,f,,ell]=c,cx=(x0+x1)/2,cy=(y0+y1)/2,rx=(x1-x0)/2+.5,ry=(y1-y0)/2+.5,ch=f2Fl(C,f);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(ell&&((x-cx)/rx)**2+((y-cy)/ry)**2>1.05)continue;if(C.open(x,y))fm[ix(x,y)]=ch}}
  for(const c of S.clear||[])if(c[5])C.mapNames.push({t:c[5],x:(c[0]+c[2])>>1,y:(c[1]+c[3])>>1,k:'place'});
  // the way back: castle stone round the door at (24,38), two lantern pillars, a plaque with the name of the hall
  C.ret=()=>{for(let y=38;y<=39;y++)for(let x=20;x<=28;x++){if(S.softRet&&x!==24)C.mist(x,y);else C.solid(x,y,C.ch(pspWallGid(x===24?'pier':'dark',(hs(x,y,4)*4)|0,3.6)))}
    C.links({style:{'Hall of Illusions':'great'}});
    for(const x of [22,26]){C.used.delete(x+',37');if(!S.softRet)C.dec(pspPic('pillar_lantern'),x,37,{block:true,sc:.85});C.light(x,37,C.silver)}
    C.used.delete('23,37');C.sign(23,37,[0,1],'THE HALL OF ILLUSIONS')};
  // filler: blocking props in the open band (never on the core), denser further out
  C.fill=(keys,o)=>{o=o||{};for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
    if(!C.open(x,y)||!C.free(x,y)||core[ix(x,y)]||(S.keep&&S.keep(x,y)))continue;const e=E[ix(x,y)],cl=vn(x,y,4,51)*1.1+.45,p=Math.min(.95,(e===1?(o.p1||.25):e===2?(o.p2||.62):e===3?(o.p3||.85):.93)*cl);
    if(hs(x,y,52)<p){const k=keys[(hs(x,y,8)*keys.length)|0],d=C.dec(k,x,y,{block:true,sc:(o.sc||1)*(.85+hs(x,y,7)*.35)});if(d){d.ox=(hs(x,y,53)-.5)*.6;d.oy=(hs(x,y,54)-.5)*.4}}}};
  C.scrub=(keys,p,o)=>{o=o||{};for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!C.open(x,y)||!C.free(x,y)||(path[ix(x,y)]&&!o.onPath)||(S.keep&&S.keep(x,y)))continue;if(hs(x,y,55)<p)C.dec(keys[(hs(x,y,56)*keys.length)|0],x,y,{block:false,sc:(o.sc||1)*(.7+hs(x,y,57)*.6)})}};
  // a spot for a creature or a chest inside a rect, off the path, free, not near the arrival
  const nearPath=(x,y,r)=>{for(let b=-r;b<=r;b++)for(let a=-r;a<=r;a++){const xx=x+a,yy=y+b;if(xx>=0&&yy>=0&&xx<W&&yy<H&&path[ix(xx,yy)])return true}return false};C.nearPath=nearPath;
  C.spot=(x0,y0,x1,y1,seed,o)=>{o=o||{};const pr=o.pr===undefined?2:o.pr;for(let k=0;k<160;k++){const x=x0+((hs(k,seed,61)*(x1-x0+1))|0),y=y0+((hs(k,seed,62)*(y1-y0+1))|0);
    if(!C.open(x,y)||!C.free(x,y)||(o.ok&&!o.ok(x,y))||(!o.path&&nearPath(x,y,k<120?pr:0))||Math.hypot(x-24,y-35)<7||C.safe.some(z=>pspInZone(z,x,y,1)))continue;return [x,y]}return null};
  // a big tree right beside a walkable square is kept small and pushed back (a canopy on the next square fills the whole view)
  C.capTrees=(rx,cap)=>{const blk=new Set(C.decor.filter(d=>d.block).map(d=>d.x+','+d.y)),walk=(x,y)=>C.open(x,y)&&!blk.has(x+','+y);
    for(const d of C.decor){if(!d.block||!rx.test(String(d.k)))continue;const nb=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].filter(([a,b])=>walk(d.x+a,d.y+b));if(!nb.length)continue;
      const h=NPC_H[d.k]||3,c=(cap||2.4)/h;if((d.sc||1)>c)d.sc=+c.toFixed(3);d.ox=Math.max(-.35,Math.min(.35,-nb.reduce((t,q)=>t+q[0],0)*.2));d.oy=Math.max(-.35,Math.min(.35,-nb.reduce((t,q)=>t+q[1],0)*.2))}};
  // a lettered stone slab (a plaque of a puzzle): the picture is made once
  C.plaque=(x,y,key,lines,npc,text,o)=>{const k=blSlab(key,lines,{h:1.0,top:.16,span:.66});if(npc&&!NPCS[npc])khNpc(npc,'A carved plaque',k,()=>say(text,[BYE]));C.used.delete(x+','+y);return C.dec(k,x,y,Object.assign({block:true,npc,sc:.9},o||{}))};
  // a door in a wall that takes the party to another square of the same map (into a cabin, out of it)
  C.warp=(x,y,style,to,msgText)=>{const b=style==='house'?null:pspDoorGid(style||'oak',wh),g=KH_NEXT_GID++;if(b!=null){T_TILE[g]=T_TILE[b];if(GY.col&&GY.col[b])GY.col[g]=GY.col[b]}KH_DOOR[g]={psf2:'warp',psh:'warp',to,A:to,B:to,lvl:id,at:{x:to[0],y:to[1],f:to[2]},msg:msgText};(C.warpTo=C.warpTo||[]).push(to);C.solid(x,y,C.ch(g));C.used.add(x+','+y);return g};
  C.foes=(list,rect,seed,o)=>{let n=0;list.forEach((t,i)=>{const q=C.spot(rect[0],rect[1],rect[2],rect[3],seed*31+i,o);if(q&&f2Foe(C,t,q[0],q[1]))n++});return n};
  C.chestAt=(x,y,tier)=>{if(C.enemies.some(e=>e.x===x&&e.y===y)||!C.open(x,y)){const q=C.near(x,y,3,true);if(!q)return null;x=q[0];y=q[1]}C.used.delete(x+','+y);return C.chest(x,y,{tier:tier===undefined?1:tier})};
  // finish: no sealed pockets, lights, the level's air
  C.done=o=>{o=o||{};
    {const bs=new Set();for(const d of C.decor)if(d.block)bs.add(d.x+','+d.y);
     const reach=new Uint8Array(W*H),q=[ix(24,35)];reach[q[0]]=1;for(const [a,b] of C.warpTo||[]){if(!reach[ix(a,b)]){reach[ix(a,b)]=1;q.push(ix(a,b))}}
     for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||reach[ix(nx,ny)]||!C.open(nx,ny)||bs.has(nx+','+ny))continue;reach[ix(nx,ny)]=1;q.push(ix(nx,ny))}}
     const P0=C._edgeSpec&&C._edgeSpec.pillar;
     for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(C.open(x,y)&&!reach[ix(x,y)]&&!bs.has(x+','+y)){if(P0){C.used.delete(x+','+y);for(let i=C.decor.length-1;i>=0;i--)if(C.decor[i].x===x&&C.decor[i].y===y)C.decor.splice(i,1);const d=C.dec(P0[(hs(x,y,181)*P0.length)|0],x,y,{block:true,sc:.9+hs(x,y,182)*.3});if(d){d.ox=(hs(x,y,183)-.5)*.5;d.oy=(hs(x,y,184)-.5)*.4}continue}   // a pocket nothing reaches is a thicket, not a cube of wall
       C.mist(x,y);for(let i=C.decor.length-1;i>=0;i--)if(C.decor[i].x===x&&C.decor[i].y===y)C.decor.splice(i,1);for(let i=C.lights.length-1;i>=0;i--)if(C.lights[i][0]===x&&C.lights[i][1]===y)C.lights.splice(i,1);for(let i=C.enemies.length-1;i>=0;i--)if(C.enemies[i].x===x&&C.enemies[i].y===y)C.enemies.splice(i,1)}}
    // a blocking prop in a straight one-wide gap between walls is not a passage piece: that square becomes mist wall (the way round is unchanged, the prop already blocked it)
    {const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';
     for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if(!d.block||d.npc||d.pic||d.goldAmt||/chest/.test(String(d.k)))continue;const x=d.x,y=d.y;if(!op(x,y))continue;
       const n=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>op(x+a,y+b)).length,st=(op(x+1,y)&&op(x-1,y))||(op(x,y+1)&&op(x,y-1));
       if(n===2&&st){C.decor.splice(i,1);C.mist(x,y)}}}
    if(C._edgeSpec)f2Edge(C,Object.assign({},C._edgeSpec,{noTall:1}));   // squares sealed just now take the painted edge too
    C.glow(o.glow||7,B.lcol);
    const lv=C.finish({start:{x:24,y:35,f:0}});
    lv.fogAt=()=>B.fog;lv.amb=B.amb;lv.f2=1;lv._noTidy=true;
    // last check on the finished level (the same walk as tools/ps_test.py reach): an open square nothing reaches becomes mist wall
    {const TB=TERRS[id]&&TERRS[id].block,bs=new Set();for(const d of lv.decor)if(d.block||(d.npc&&d.solid))bs.add(d.x+','+d.y);
     const seen=new Uint8Array(W*H),q=[];const push=(x,y)=>{if(x<0||y<0||x>=W||y>=H||seen[ix(x,y)])return;seen[ix(x,y)]=1;q.push([x,y])};push(24,35);for(const t of C.warpTo||[])push(t[0],t[1]);
     for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||seen[ix(nx,ny)]||lv.rows[ny][nx]!=='.'||bs.has(nx+','+ny)||(TB&&TB[ix(nx,ny)]))continue;seen[ix(nx,ny)]=1;q.push([nx,ny])}}
     const mc0=C.ch(f2MistGid(1,S.mistH||2.9)),mcAt=(x,y)=>(C._edgeCh&&C._edgeCh(x,y))||mc0;let n=0;
     for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(lv.rows[y][x]==='.'&&!seen[ix(x,y)]&&!bs.has(x+','+y)&&!(TB&&TB[ix(x,y)])){const P1=C._edgeSpec&&C._edgeSpec.pillar;if(P1){lv.decor=lv.decor.filter(d=>!(d.x===x&&d.y===y));lv.enemies=lv.enemies.filter(e=>!(e.x===x&&e.y===y));lv.decor.push({k:P1[(hs(x,y,185)*P1.length)|0],x,y,block:true,sc:1,ox:(hs(x,y,186)-.5)*.5});n++;continue}lv.rows[y]=lv.rows[y].slice(0,x)+mcAt(x,y)+lv.rows[y].slice(x+1);if(TB)TB[ix(x,y)]=1;n++;
       lv.decor=lv.decor.filter(d=>!(d.x===x&&d.y===y));lv.enemies=lv.enemies.filter(e=>!(e.x===x&&e.y===y))}
     // and again: a blocking prop left standing in a straight one-wide gap goes, its square becomes mist
     for(let pass=0;pass<3;pass++){const op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&lv.rows[y][x]==='.';let k=0;
       lv.decor=lv.decor.filter(d=>{if(!d.block||d.npc||d.pic||d.goldAmt||/chest/.test(String(d.k)))return true;const x=d.x,y=d.y;if(!op(x,y))return true;
         const nb=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>op(x+a,y+b)).length,st=(op(x+1,y)&&op(x-1,y))||(op(x,y+1)&&op(x,y-1));
         if(nb===2&&st){lv.rows[y]=lv.rows[y].slice(0,x)+mcAt(x,y)+lv.rows[y].slice(x+1);if(TB)TB[ix(x,y)]=1;k++;return false}return true});if(!k)break}
     lv._f2sealed=n}
    {const sp=lv.decor.filter(d=>d.span);lv.decor=lv.decor.filter(d=>!d.span);try{if(typeof pswaHang==='function')pswaHang(id,lv)}catch(e){console.error('f2 wallart',e)}lv.decor.push(...sp)}   // spans are not wall pictures
    if(C.f2x)lv._f2x=C.f2x;
    return lv};
  return C}
/* stepping onto a square (pressure plates): F2.step[id](x,y) is called whenever the party's square changes in that room */
F2.step={};F2.last='';
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(typeof LEVEL!=='undefined'&&F2.step[LEVEL]&&G.state==='play'&&G.P){const x=Math.round(G.P.x),y=Math.round(G.P.y),k=LEVEL+':'+x+','+y;if(k!==F2.last){F2.last=k;F2.step[LEVEL](x,y)}}}catch(e){console.error('f2 step',e)}
  return r}}
/* a painted piece of a sheet used as a wall face across n tiles (gyTile fac fit) */
function f2FacGid(img,i,n,wh,o){o=o||{};const k='fac'+img+i+'/'+n+'|'+wh+(o.fit===false?'nf':'');if(F2.tiles[k]!==undefined)return F2.tiles[k];if(!IMG[img]||!IMG[img].width)return null;IMG['gyp_'+img]=IMG[img];
  return F2.tiles[k]=gyTile(o.tex||'texBlack_2',wh,{fac:o.fit===false?{img,i,n}:{img,i,n,fit:true,at:o.at},gain:o.gain||1.0,rgb:o.rgb||[1,1,1],tag:'f2fac'+img,emit:o.emit===undefined?.12:o.emit})}
/* a painted texture (assets/ps, kind tex) as a floor of the engine (128 x 128) */
function f2TexFloor(key,out,g,tn,rim){if(FLOORS[out])return out;const im=IMG[key];if(!im||!im.width)return null;try{const N=128,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.drawImage(im,0,0,N,N);
  if(rim){x.strokeStyle='rgba(30,18,8,.85)';x.lineWidth=7;x.strokeRect(4,4,N-8,N-8);x.strokeStyle='rgba(255,230,170,.5)';x.lineWidth=2;x.strokeRect(9,9,N-18,N-18)}   // a carved plate: a dark sunk rim and a bright lip
  const s=x.getImageData(0,0,N,N).data,d=new Uint8ClampedArray(N*N*4);
  for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,s[i]*(g||1)*(tn?tn[0]:1));d[i+1]=Math.min(255,s[i+1]*(g||1)*(tn?tn[1]:1));d[i+2]=Math.min(255,s[i+2]*(g||1)*(tn?tn[2]:1));d[i+3]=255}FLOORS[out]=d;return out}catch(e){return null}}
/* the re-toned creatures exist as soon as the castle's pictures are in (a fight or a test may meet them before any room is built) */
{const _pp=pspPics;pspPics=function(){const r=_pp.apply(this,arguments);try{F2.art=0;f2Art()}catch(e){console.error('f2Art',e)}return r}}
/* the jump links ?town=illusion1 to illusion7 (PSP.JUMPS): the engine's town filter keeps digits only for palespire and blight names, so illusionN is passed on as palespire2N */
for(let n=1;n<=7;n++)if(PSP.JUMPS['illusion'+n])PSP.JUMPS['palespire2'+n]=PSP.JUMPS['illusion'+n];
{const _j=jumpFromUrl;jumpFromUrl=function(){try{const q=new URLSearchParams(location.search),m=/^illusion([1-7])$/.exec((q.get('town')||'').toLowerCase());if(m){q.set('town','palespire2'+m[1]);history.replaceState(null,'',location.pathname+'?'+q.toString()+location.hash)}}catch(e){}return _j.apply(this,arguments)}}
/* the in-map doors (C.warp) */
function f2MoveTo(a){G.talk=null;G.P.x=a[0];G.P.y=a[1];G.P.f=a[2];G.P.angT=(a[2]-1)*Math.PI/2;G.C={x:a[0],y:a[1],a:G.P.angT};try{reveal()}catch(e){}}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psf2==='warp'){sfx('door');f2MoveTo(d.to);if(d.msg)msg(d.msg,'#e8dcc0');return true}
  return _k.apply(this,arguments)}}
/* puzzle sounds: a bright chime for a right step, a soft low one for a wrong step, a rising run when a puzzle opens */
function f2Chime(kind,i){try{if(!AC||G.mute)return;if(kind==='ok'){const f=[523,659,784,988,1175][i%5];tone(f,f,.9,'sine',.05,0);tone(f*2,f*2,.6,'sine',.015,0)}
  else if(kind==='bad'){tone(220,180,1.1,'sine',.05,0);tone(165,140,1.2,'sine',.03,.1)}
  else{[523,659,784,1047].forEach((f,k)=>{tone(f,f,1.2,'sine',.045,k*.16);tone(f*1.5,f*1.5,.8,'sine',.012,k*.16)})}}catch(e){}}
/* ---------- free-standing painted planes (a bridge seen from the side, spanning a canal or a street): f2Span ----------
   The engine draws a wall picture (pic + wd) as a flat plane in true perspective; a span is such a plane placed anywhere: centre (cx,cy) in world units, normal (nx,ny), w cells wide, raised by bob.
   It never blocks (the party and the boats pass under it). tools/ps_audit.py knows spans (d.span) are not wall pictures. */
function f2Span(C,key,cx,cy,nx,ny,w,bob){const d={k:key,x:Math.floor(cx),y:Math.floor(cy),block:false,walk:true,deco:true,pic:1,wd:[nx,ny],span:{x:cx,y:cy,w,bob:bob||0}};C.decor.push(d);f2X(C,d,['span']);return d}
/* the engine copies only its own fields when a level's decor goes live: the extra fields of spans and movers are kept by name (kname f2x<n>) and put back on every arrival */
function f2X(C,d,keys){C.f2x=C.f2x||{};const n='f2x'+Object.keys(C.f2x).length;d.kname=n;const o={};for(const k of keys)o[k]=d[k];C.f2x[n]=o}
pspOnArrive(n=>{const L=LEVELS[n];if(!L||!L._f2x||!G.decor)return;for(const d of G.decor){const o=d.kname&&L._f2x[d.kname];if(!o)continue;for(const k in o)if(d[k]===undefined)d[k]=k==='mv'?Object.assign({},o[k],{segs:null,t:0}):k==='span'?Object.assign({},o[k]):o[k]}});
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  if(typeof LEVEL==='undefined'||!(f2Is(LEVEL)||LEVEL===F2.HUB))return L;
  const LV=LEVELS[LEVEL],dk=LV&&LV._f2deck,cx=G.C.x+.5,cy=G.C.y+.5,onDeck=!!(dk&&cx>=dk[0]&&cx<=dk[2]+1&&cy>=dk[1]&&cy<=dk[3]+1);   // standing on a bridge deck: its side faces give way to its parapets
  let drop=false;
  for(const s of L){const d=s.decor;if(!d)continue;
    if(d.span&&d.span.deck&&((d.span.deck==='hide')===onDeck)){s._f2drop=1;drop=true;continue}
    if(d.span&&s.pic){s.x=d.span.x;s.y=d.span.y;s.w=d.span.w;s.bob=d.span.bob;s.flat=[d.wd[0],d.wd[1]]}
    else if(F2_TREE_RX.test(d.k)&&!d.roof){s.decor=Object.create(d,{k:{value:'tree0'}})}   // a painted tree casts no round shadow and fades into the green like the woodland trees
    else if(d.mv&&d.mvFlip&&!s.pic){const C=G.C,fx=Math.cos(C.a),fy=Math.sin(C.a),rx=-fy,ry=fx;const right=(d.mvDx*rx+d.mvDy*ry)>0;const im=IMG[right?d.mvFlip:d.k];if(im)s.img=im}}   // a boat seen moving to the right shows its prow on the right
  return drop?L.filter(s=>!s._f2drop):L}}
/* a mirrored copy of a picture (a boat going the other way) */
function f2Flip(k){const nk=k+'_fl';if(IMG[nk]&&IMG[nk].width)return nk;const im=IMG[k];if(!im||!im.width)return k;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.translate(im.width,0);x.scale(-1,1);x.drawImage(im,0,0);IMG[nk]=c;NPC_H[nk]=NPC_H[k];return nk}
/* ---------- things that move by themselves (a gondola rowing up and down a canal): decor with mv = {path:[[x,y],...], speed, t} ---------- */
F2.movers=[];
function f2Mover(C,key,path,speed,o){o=o||{};
  if(o.span){const s=o.span,d=f2Span(C,key,path[0][0],path[0][1],s[0],s[1],s[2],o.bob||0);d.mv={path,speed:speed||.6,t:0,len:0,pp:!!o.pingpong};d.mvKey=key;d.mvFlip=f2Flip(key);C.f2x[d.kname].mv=d.mv;C.f2x[d.kname].mvKey=key;C.f2x[d.kname].mvFlip=d.mvFlip;return d}   // a boat as a flat side view lying along its canal
  const d=C.dec(key,Math.round(path[0][0]),Math.round(path[0][1]),{block:false})||(()=>{const q={k:key,x:path[0][0],y:path[0][1],block:false,walk:true,deco:true};C.decor.push(q);return q})();
  d.mv={path,speed:speed||.6,t:0,len:0,pp:!!o.pingpong};d.bob=o.bob||0;d.mvFlip=f2Flip(key);d.mvDx=1;d.mvDy=0;if(o.sc)d.sc=o.sc;f2X(C,d,['mv','mvFlip','mvDx','mvDy']);return d}
function f2MoveTick(dt){if(!f2Is(LEVEL)||!G.decor)return;
  for(const d of G.decor){const m=d.mv;if(!m||d.hidden)continue;const P=m.path;if(!m.segs){m.segs=[];let L=0;for(let i=0;i<P.length-1;i++){const l=Math.hypot(P[i+1][0]-P[i][0],P[i+1][1]-P[i][1]);m.segs.push([L,l]);L+=l}m.len=L}
    m.t=(m.t+dt*m.speed)%(m.pp?m.len*2:m.len);let s=m.t,back=false;if(m.pp&&s>m.len){s=m.len*2-s;back=true}
    for(let i=0;i<m.segs.length;i++){const [L0,l]=m.segs[i];if(s<=L0+l||i===m.segs.length-1){const u=l?(s-L0)/l:0,a=P[i],b=P[i+1];const px=a[0]+(b[0]-a[0])*u,py=a[1]+(b[1]-a[1])*u,dx=(b[0]-a[0])*(back?-1:1),dy=(b[1]-a[1])*(back?-1:1);
        if(d.span){d.span.x=px;d.span.y=py;d.x=Math.floor(px);d.y=Math.floor(py);if(d.mvKey&&(dx||dy)){const pr=[d.wd[1],-d.wd[0]];d.k=(dx*pr[0]+dy*pr[1])>=0?d.mvKey:d.mvFlip}}
        else{d.x=px;d.y=py;if(dx||dy){d.mvDx=dx;d.mvDy=dy}}break}}}}
/* ---------- a ride in a boat: the camera glides along a path over the water, then the party steps off at the landing ---------- */
function f2Ride(path,land,o){o=o||{};if(F2.ride)return;const P=path.map(p=>[p[0],p[1]]);let L=0;const segs=[];for(let i=0;i<P.length-1;i++){const l=Math.hypot(P[i+1][0]-P[i][0],P[i+1][1]-P[i][1]);segs.push([L,l]);L+=l}
  F2.ride={P,segs,len:L,t:0,speed:o.speed||1.6,land,lv:LEVEL,hide:o.hide||null,done:o.done||null};
  if(o.prow&&IMG[o.prow]){const d={k:o.prow,x:P[0][0]|0,y:P[0][1]|0,block:false,walk:true,deco:true,pic:1,wd:[0,1],span:{x:P[0][0],y:P[0][1],w:o.prowW||1.35,bob:o.prowBob===undefined?-.42:o.prowBob},f2prow:1};G.decor.push(d);F2.ride.prow=d}   // the bow of the boat, just in front of the party, all the way
  if(o.hide)o.hide.hidden=true;G.talk=null;G.lockT=G.time+999;try{sfx('door')}catch(e){}}
function f2RideTick(dt){const R=F2.ride;if(!R)return;if(LEVEL!==R.lv){F2.ride=null;G.lockT=0;return}
  R.t=Math.min(R.len,R.t+dt*R.speed);const s=R.t;let x=R.P[0][0],y=R.P[0][1],dx=0,dy=-1;
  for(let i=0;i<R.segs.length;i++){const [L0,l]=R.segs[i];if(s<=L0+l||i===R.segs.length-1){const u=l?Math.min(1,(s-L0)/l):1,a=R.P[i],b=R.P[i+1];x=a[0]+(b[0]-a[0])*u;y=a[1]+(b[1]-a[1])*u;dx=b[0]-a[0];dy=b[1]-a[1];break}}
  const ang=Math.atan2(dy,dx);G.C.x=x;G.C.y=y;let da=ang-G.C.a;while(da>Math.PI)da-=Math.PI*2;while(da<-Math.PI)da+=Math.PI*2;G.C.a+=da*Math.min(1,dt*3);G.P.angT=G.C.a;G.P.ang=G.C.a;G.lockT=G.time+999;
  if(R.prow){const a=G.C.a,fx=Math.cos(a),fy=Math.sin(a),pd=R.prow;pd.span.x=x+.5+fx*.9;pd.span.y=y+.5+fy*.9;pd.wd=[fx,fy];pd.x=Math.floor(pd.span.x);pd.y=Math.floor(pd.span.y);pd.span.bob=(R.prowBob0===undefined?(R.prowBob0=pd.span.bob):R.prowBob0)+Math.sin(G.time*2.2)*.025}
  if(R.t>=R.len){const [lx,ly,lf]=R.land;if(R.prow){const i=G.decor.indexOf(R.prow);if(i>=0)G.decor.splice(i,1)}F2.ride=null;G.lockT=0;f2MoveTo([lx,ly,lf]);if(R.done)try{R.done()}catch(e){console.error('f2 ride done',e)}}}
{const _u2=update;update=function(dt){const r=_u2.apply(this,arguments);try{if(typeof LEVEL!=='undefined'&&f2Is(LEVEL)&&G.state==='play'){const d=Math.min(dt,.05);f2MoveTick(d);if(F2.ride)f2RideTick(d)}}catch(e){console.error('f2 move',e);F2.ride=null;G.lockT=0}return r}}
/* ---------- a painted far skyline on the sky of a room (domes and towers over the roofs, a mountain range, a sea horizon), fixed to the world while the clouds drift ----------
   F2SKY[id] = {img, rows (height in sky rows), base (sky row of its foot; 150 is the horizon), rep (copies round the sky), haze (0..1)} */
const F2SKY={9824:{img:'f2_sky_venice',rows:118,base:156,rep:3,haze:.32},9821:{img:'f2_sky_forest',rows:46,base:154,rep:3,haze:.25},9823:{img:'f2_sky_snow',rows:70,base:154,rep:3,haze:.3},9825:{img:'f2_sky_desert',rows:40,base:153,rep:2,haze:.25}};
function f2SkylineBuf(id){const S=F2SKY[id];if(!S)return null;if(S.buf)return S;const im=IMG['ps_'+S.img];if(!im||!im.width)return null;
  const R=S.rows,c=document.createElement('canvas');c.width=1024;c.height=R;const x=c.getContext('2d');x.imageSmoothingQuality='high';
  const n=S.rep||2,w=1024/n,B=F2B[id],fc=B.fog;
  for(let i=0;i<n;i++){x.save();x.translate(i*w,0);if(i&1){x.translate(w,0);x.scale(-1,1)}x.drawImage(im,0,0,w,R);x.restore()}
  if(S.haze){x.globalCompositeOperation='source-atop';const g=x.createLinearGradient(0,0,0,R);g.addColorStop(0,'rgba('+fc[0]+','+fc[1]+','+fc[2]+','+(S.haze*.6)+')');g.addColorStop(1,'rgba('+fc[0]+','+fc[1]+','+fc[2]+','+Math.min(.9,S.haze*1.6)+')');x.fillStyle=g;x.fillRect(0,0,1024,R);x.globalCompositeOperation='source-over'}
  S.data=x.getImageData(0,0,1024,R).data;S.buf=1;return S}
function f2SkyLive(id){const base=f2SkyArr(id),S=f2SkylineBuf(id);if(!S)return base;
  const live=F2.live||(F2.live=new Uint8ClampedArray(1024*256*4));live.set(base);
  const off=(((G.time*11)%1024)+1024)%1024|0,R=S.rows,y0=S.base-R,d=S.data;
  for(let yy=0;yy<R;yy++){const y=y0+yy;if(y<0||y>255)continue;const ro=y*1024*4,so=yy*1024*4;
    for(let col=0;col<1024;col++){const sc=(col-off+1024)&1023,si=so+sc*4,a=d[si+3];if(!a)continue;const k=a/255,o=ro+col*4;live[o]+=(d[si]-live[o])*k;live[o+1]+=(d[si+1]-live[o+1])*k;live[o+2]+=(d[si+2]-live[o+2])*k}}
  return live}
{const _sf2=pspSkyFrame;pspSkyFrame=function(){
  if(typeof LEVEL!=='undefined'&&f2Is(LEVEL)&&F2SKY[LEVEL]&&LEVELS[LEVEL]&&LEVELS[LEVEL].outdoor&&!f2InRoof()){if(!PSPK.live)PSPK.live=new Uint8ClampedArray(1024*256*4);self.BKSKY_LV=LEVEL;self.BKSKY_PAN=f2SkyLive(LEVEL);return}
  return _sf2.apply(this,arguments)}}
/* a building seen over the roofs (a dome, a tower): drawn only where it rises above the nearest wall (the engine's skyline sprites); it stands on a wall square */
function f2Roof(C,key,x,y,o){o=o||{};const d={k:'kroof',lk:key,x,y,block:false,deco:true,roof:1};if(o.sc)d.sc=o.sc;if(o.bob)d.bob=o.bob;C.decor.push(d);return d}
/* ---------- the painted edges of a room: the mist wall squares that face the open become a painted biome wall (a tree line, a cliff, a reed bed), with a faint silver mist along its foot (the seam of the illusion);
   tall pieces (trees, rock spires) stand on some of those squares and rise over the wall (drawn as skyline sprites, only above the nearest wall).
   o: {img (assets/ps key without ps_), wh (height), n (squares per copy of the picture; the copies alternate with mirrored ones so they join without a seam), veil (0..1 silver mist), tall:[keys], tallP, tallSc:[lo,hi], rgb} ---------- */
function f2Veil(key,a,tag){const nk=key+'_veil'+(tag||'');if(IMG[nk]&&IMG[nk].width)return nk;const im=IMG[key];if(!im||!im.width)return key;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
  const g=x.createLinearGradient(0,c.height,0,c.height*.45);g.addColorStop(0,'rgba(222,230,240,'+a+')');g.addColorStop(.35,'rgba(214,224,236,'+(a*.45)+')');g.addColorStop(1,'rgba(214,224,236,0)');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
  IMG[nk]=c;NPC_H[nk]=NPC_H[key];return nk}
function f2Edge(C,o){const W=48,H=40,rows=C.rows,ix=(x,y)=>y*W+x,hs=C.hs2;if(!IMG['ps_'+o.img])return 0;o.tall=(o.tall||[]).map(k=>k.replace(/^ps_/,''));C._edgeSpec=o;
  const wh=o.wh||2.6,gid=[];   // each picture is fitted by height (n squares carry one copy); the copies follow each other plain and mirrored, and a second picture (img2) between them
  for(const nm of [o.img].concat(o.img2&&IMG['ps_'+o.img2]?[o.img2]:[])){const base=f2Veil('ps_'+nm,o.veil===undefined?.55:o.veil),im0=IMG[base],n=Math.max(1,Math.round(wh*im0.width/im0.height));
    for(const pic of [base,f2Flip(base)])for(let i=0;i<n;i++){const g=f2FacGid(pic,i,n,wh,{tex:'texBlack_2',rgb:o.rgb||[1,1,1],emit:.06});gid.push(g==null?null:C.ch(g))}}
  const n=gid.length/2;
  const mistCh=new Set();for(let v=0;v<5;v++)mistCh.add(C.ch(f2MistGid(v,C.f2.mistH||2.9)));
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';let k=0;const edge=[];
  // a lone square of edge standing out into the open would be a cube of painted forest: it becomes a tree on open ground instead
  // mist islands inside the room (not joined to the outer edge) become thickets of trees on open ground
  if(o.pillar){const seen=new Uint8Array(W*H),q=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if((x<2||y<2||x>W-3||y>H-3)&&rows[y][x]!=='.'){seen[ix(x,y)]=1;q.push([x,y])}
    for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||seen[ix(nx,ny)]||rows[ny][nx]==='.')continue;seen[ix(nx,ny)]=1;q.push([nx,ny])}}
    const inner=(x,y)=>x>=(o.ring||3)&&y>=(o.ring||3)&&x<=W-1-(o.ring||3)&&y<=H-1-(o.ring||3)&&!(y>=36&&x>=20&&x<=28);
    for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if((seen[ix(x,y)]&&!inner(x,y))||!mistCh.has(rows[y][x]))continue;rows[y][x]='.';C.block[ix(x,y)]=0;C.used.delete(x+','+y);const key=o.pillar[(hs(x,y,134)*o.pillar.length)|0];const d=C.dec(key,x,y,{block:true,sc:.85+hs(x,y,135)*.35});if(d){d.edgeTree=1;d.ox=(hs(x,y,136)-.5)*.5;d.oy=(hs(x,y,137)-.5)*.4}}}
  if(o.pillar)for(let pass=0;pass<2;pass++)for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!mistCh.has(rows[y][x]))continue;const e=open(x+1,y),w=open(x-1,y),s=open(x,y+1),nn=open(x,y-1),cnt=e+w+s+nn;
    if(cnt>=3||(e&&w)||(s&&nn)){rows[y][x]='.';C.block[ix(x,y)]=0;C.fm[ix(x,y)]=C.fm[ix(x+(e?1:w?-1:0),y+(s?1:nn?-1:0))];C.used.delete(x+','+y);const key=o.pillar[(hs(x,y,134)*o.pillar.length)|0];const d=C.dec(key,x,y,{block:true,sc:.9+hs(x,y,135)*.3});if(d)d.edgeTree=1}}
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!mistCh.has(rows[y][x]))continue;const nb=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(x+a,y+b));if(!nb.length)continue;
    const horiz=nb.some(([a,b])=>b!==0),p=horiz?x:y,i=((p%(2*n))+2*n)%(2*n);if(gid[i]==null)continue;C.solid(x,y,gid[i]);k++;edge.push([x,y])}
  C._edgeCh=(x,y)=>gid[((x%(2*n))+2*n)%(2*n)];if(o.noTall)return k;
  if(o.innerP&&o.pillar){const edgeN=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>rows[y+b]&&rows[y+b][x+a]!=='.');   // a row of trees just inside the painted edge, so the edge is never the last thing in view
    for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!C.free(x,y)||C.nearPath(x,y,1)||!edgeN(x,y)||(o.innerKeep&&o.innerKeep(x,y))||Math.hypot(x-24,y-35)<5)continue;if(hs(x,y,161)<o.innerP){const d=C.dec(o.pillar[(hs(x,y,162)*o.pillar.length)|0],x,y,{block:true,sc:.95+hs(x,y,163)*.35});if(d){d.ox=(hs(x,y,164)-.5)*.6;d.oy=(hs(x,y,165)-.5)*.5}}}}
  if(o.tall&&o.tall.length){const [lo,hi]=o.tallSc||[.85,1.25];let last='';for(const [x,y] of edge){if(hs(x,y,131)>(o.tallP===undefined?.45:o.tallP))continue;let key=o.tall[(hs(x,y,132)*o.tall.length)|0];if(key===last)key=o.tall[(o.tall.indexOf(key)+1)%o.tall.length];last=key;f2Roof(C,pspPic(key),x,y,{sc:+(lo+(hi-lo)*hs(x,y,133)).toFixed(2)})}}
  return k}
/* patches of ground: open squares off the paths take one of several floors by a soft noise (big patches, not a checker) */
function f2Patches(C,list,o){o=o||{};const W=48,H=40;for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!C.open(x,y)||(C.pathM[y*W+x]&&!o.onPath)||(o.keep&&o.keep(x,y)))continue;
  const v=C.vn(x,y,o.cs||5,141)*.75+C.vn(x,y,2,142)*.25;let acc=0;for(const [fl,w] of list){acc+=w;if(v<acc){C.setFl(x,y,x,y,fl);break}}}}
/* a painted plaque (assets/ps) with letters cut into its blank field: returns the decor key. o: {h (height in cells), box:[x0,y0,x1,y1] (the field, 0..1), col} */
function f2Lettered(src,out,lines,o){o=o||{};const k='ps_'+out;if(IMG[k]&&IMG[k].width&&IMG[k]._f2l)return k;const im=IMG['ps_'+src];if(!im||!im.width)return pspPic(src);
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
  const b=o.box||[.2,.3,.8,.72],bx=b[0]*c.width,by=b[1]*c.height,bw=(b[2]-b[0])*c.width,bh=(b[3]-b[1])*c.height,n=lines.length;
  let fs=bh/n*.72;x.font='bold '+fs+'px Georgia,serif';const wmax=Math.max(...lines.map(l=>x.measureText(l).width));if(wmax>bw)fs*=bw/wmax;x.font='bold '+fs.toFixed(1)+'px Georgia,serif';x.textAlign='center';x.textBaseline='middle';
  lines.forEach((l,i)=>{const ly=by+bh*(i+.5)/n;x.fillStyle='rgba(255,248,230,.55)';x.fillText(l,bx+bw/2+1,ly+1.5);x.fillStyle=o.col||'#3a2614';x.fillText(l,bx+bw/2,ly)});
  c._f2l=1;IMG[k]=c;NPC_H[k]=o.h||NPC_H['ps_'+src]||1;return k}
/* a picture put together from pieces of painted pictures (a portal under a band of the palace wall): f2Compose(out, w, h, [[img, sx,sy,sw,sh, dx,dy,dw,dh], ...]) -> key 'ps_'+out */
function f2Compose(out,w,h,parts,ht){const k='ps_'+out;if(IMG[k]&&IMG[k]._f2c)return k;const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingQuality='high';
  for(const p of parts){const im=IMG[p[0]];if(!im||!im.width)continue;x.drawImage(im,p[1],p[2],p[3]||im.width,p[4]||im.height,p[5],p[6],p[7],p[8])}c._f2c=1;IMG[k]=c;NPC_H[k]=ht||1;return k}
/* a softened copy of a painted picture (mist, fog): its edges fade out (fractions of the size: l r t b) and the whole is see-through by a; a 'filter' (canvas filter) can re-grade it -> key */
function f2Soft(key,o){o=o||{};const nk=key+'_s'+(o.tag||'');if(IMG[nk]&&IMG[nk].width)return nk;const im=IMG[key];if(!im||!im.width)return key;const W=im.width,H=im.height,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  if(o.filter)try{x.filter=o.filter}catch(e){}x.drawImage(im,0,0);x.filter='none';
  if(o.l||o.r||o.t||o.b||o.a!==undefined){const d=x.getImageData(0,0,W,H),a=d.data,f=(u,e)=>e?Math.min(1,u/e):1;
    for(let yy=0;yy<H;yy++){const v=yy/H,fy=f(v,o.t)*f(1-v,o.b);for(let xx=0;xx<W;xx++){const u=xx/W,k=fy*f(u,o.l)*f(1-u,o.r)*(o.a===undefined?1:o.a),i=(yy*W+xx)*4+3;a[i]=a[i]*k*k*(3-2*k)}}x.putImageData(d,0,0)}
  IMG[nk]=c;NPC_H[nk]=NPC_H[key];return nk}
/* a painted sign board with lettering (a wooden sign in the forest, a slab in the desert): the same talk as C.plaque */
function f2SignPlaque(C,x,y,src,out,lines,npc,text,o){o=o||{};const k=f2Lettered(src,out,lines,{box:o.box||[.1,.07,.9,.28],col:o.col||'#f0e6c8',h:o.h||NPC_H['ps_'+src]});if(npc&&!NPCS[npc])khNpc(npc,o.name||'A sign',k,()=>say(text,[BYE]));C.used.delete(x+','+y);return C.dec(k,x,y,{block:true,npc,sc:o.sc||1})}
/* the way back to the hall in a room: a three-square gateway picture over x 23..25 of row 38 (the door is the middle square), its plaque lettered THE HALL OF ILLUSIONS; the castle sign there goes */
function f2RetGate(C,img,o){o=o||{};const im=IMG[img];if(!im||!im.width)return;
  const k=f2Lettered(img.replace(/^ps_/,''),img.replace(/^ps_/,'')+'_lt',['THE HALL','OF ILLUSIONS'],{box:o.box||[.4,.065,.6,.115],col:'#d8e4f0',h:NPC_H[img]});
  const wh=2.3,rows=C.rows;
  if(o.one){const g0=f2FacGid(k,0,1,o.wh||3.4,{tex:o.tex||'texBlack_2',emit:.3,fit:false,rgb:o.rgb}),g=C.chars[rows[38][24]];if(g0!=null&&g!==undefined&&KH_DOOR[g])T_TILE[g]=T_TILE[g0]}
  else for(let i=0;i<3;i++){const x=23+i,g0=f2FacGid(k,i,3,wh,{tex:'texBlack_2',emit:.25});if(g0==null)continue;
    if(x===24){const g=C.chars[rows[38][24]];if(g!==undefined&&KH_DOOR[g])T_TILE[g]=T_TILE[g0]}else C.solid(x,38,C.ch(g0))}
  for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if(d.k==='sign_gy'&&d.y===37&&d.x===23)C.decor.splice(i,1)}
  C.light(24,37,[.85,1.0,1.25])}
/* ---------- the parchment area maps of the second floor: each square in the colour of its own floor or wall (sampled from the painted textures), inked on parchment;
   trees as round crowns, water with ripple strokes, the puzzle pieces and people as small marks, places numbered with a key (the cloud cover of ps_fog.js applies as on every castle map) ---------- */
F2.mapCol={};
function f2AvgCol(key,src){const k=key;if(F2.mapCol[k])return F2.mapCol[k];let r=0,g=0,b=0,n=0;try{if(src&&src.length){for(let i=0;i<src.length;i+=4*61){r+=src[i];g+=src[i+1];b+=src[i+2];n++}}}catch(e){}return F2.mapCol[k]=n?[r/n,g/n,b/n]:[180,170,150]}
function f2MapDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,PX=F.ox,PY=F.oy,PW=W*s,PH=H*s,INK=MPL.INK,id=LEVEL,TB=TERRS[id]&&TERRS[id].block;
  const parch=[226,212,178],mix=(c0,k)=>[c0[0]*(1-k)+parch[0]*k,c0[1]*(1-k)+parch[1]*k,c0[2]*(1-k)+parch[2]*k],rgb=c0=>`rgb(${c0[0]|0},${c0[1]|0},${c0[2]|0})`;
  const wall=(cx,cy)=>!(R[cy]&&R[cy][cx]==='.');
  const mistG=new Set(Object.keys(F2.tiles).filter(k=>/^mist/.test(k)).map(k=>F2.tiles[k])),WC=({forest:[28,46,26],island:[128,112,86],snow:[150,160,172],water:[170,100,74],desert:[176,132,80],swamp:[30,40,28],nightmare:[70,30,34]})[(F2B[id]||{}).k];
  x.save();x.shadowColor='rgba(40,30,10,.5)';x.shadowBlur=14;x.shadowOffsetX=3;x.shadowOffsetY=5;x.fillStyle='#3a3226';x.fillRect(PX-1.6,PY-1.6,PW+3.2,PH+3.2);x.restore();
  x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){let col;
    if(wall(cx,cy)){const g=L.chars&&L.chars[R[cy][cx]],gc=(GY.col&&GY.col[g])||[90,86,80];col=mistG.has(g)?[200,206,214]:WC?mix(WC.map((v,i)=>v*(.85+.3*(gc[i]/255))),.08):mix(gc.map(v=>v*.7),.38)}
    else{const f=L.fmap&&L.fmap[cy]?+L.fmap[cy][cx]:0,fk=(L.floorSet&&L.floorSet[f])||L.floor;col=mix(f2AvgCol(fk,FLOORS[fk]),.3)}
    const v=hash2(cx,cy,9)*10-5;x.fillStyle=rgb([col[0]+v,col[1]+v,col[2]+v]);x.fillRect(X(cx)-.1,Y(cy)-.1,s+.2,s+.2);
    if(!wall(cx,cy)&&TB&&TB[cy*W+cx]){x.strokeStyle='rgba(30,50,70,.35)';x.lineWidth=.5;x.beginPath();for(let k=1;k<3;k++){const yy=Y(cy)+s*k/3;x.moveTo(X(cx)+s*.15,yy);x.quadraticCurveTo(X(cx)+s*.5,yy-s*.12,X(cx)+s*.85,yy)}x.stroke()}}   // water and ice: ripple strokes
  // the outline of everything walkable, in ink
  x.strokeStyle=INK;x.lineWidth=.6;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(wall(cx,cy))continue;const X0=X(cx),Y0=Y(cy);
    if(wall(cx,cy-1)){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(wall(cx,cy+1)){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(wall(cx-1,cy)){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}if(wall(cx+1,cy)){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}}
  x.stroke();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){const ch=R[cy][cx];if(ch==='.')continue;const g=L.chars&&L.chars[ch],d=g!==undefined&&KH_DOOR[g];if(d&&(d.psp||d.psf2)){x.fillStyle=d.psp?'#d8b050':'#8a6a3a';x.fillRect(X(cx)+s*.12,Y(cy)+s*.12,s*.76,s*.76)}}
  const TREE=/tree|pine|spruce|fir|birch|beech|oak|maple|lime|palm|willow|swamptree|eyetree|nightoak|thorn|reeds|cactus|ww_/i;
  for(const d of L.decor){if(d.found||d.hidden||d.span||d.roof)continue;const k=String(d.lk||d.k||'');const px=X(d.x+.5+(d.ox||0)),py=Y(d.y+.5+(d.oy||0));
    if(d.npc){x.fillStyle='#7a2a1a';x.beginPath();x.arc(px,py,Math.max(.8,s*.22),0,6.3);x.fill()}
    else if(/chest/.test(k)){x.fillStyle='#b08a30';x.fillRect(px-s*.2,py-s*.15,s*.4,s*.3)}
    else if(d.block&&TREE.test(k)){x.fillStyle='rgba(52,74,44,.85)';x.beginPath();x.arc(px,py,Math.max(.7,s*.36),0,6.3);x.fill();x.fillStyle='rgba(120,150,96,.6)';x.beginPath();x.arc(px-s*.1,py-s*.1,Math.max(.3,s*.14),0,6.3);x.fill()}
    else if(d.block){x.fillStyle='rgba(70,62,52,.7)';x.beginPath();x.arc(px,py,Math.max(.5,s*.2),0,6.3);x.fill()}}
  x.restore();
  const names=L.mapNames||[];
  names.forEach((n,i)=>{const px=X(n.x+.5),py=Y(n.y+.5);x.save();x.fillStyle='rgba(250,240,220,.94)';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(px,py,3.6,0,6.3);x.fill();x.stroke();x.restore();api.text(x,String(i+1),px,py+.2,5.4,INK)});
  api.title(x,LEVEL_NAMES[LEVEL]||L.name||'The Hall of Illusions','',12,5);api.compass(x,50,262,15);
  if(names.length){const a=392,b=40,w=92,lh=10.4,h=14+names.length*lh;api.panel(x,a,b,w,h);api.text(x,'Places',a+w/2,b+8,6.6,'#4a2a6a');
    names.forEach((n,i)=>{api.text(x,(i+1)+'  '+n.t.replace(/^The /,''),a+5,b+17+i*lh,5.2,INK,'left')})}
  {const a=6,b=46,w=84,h=22;api.panel(x,a,b,w,h);api.text(x,'The Pale Spire',a+w/2,b+8,5.6,'#4a2a6a');api.text(x,'Second floor',a+w/2,b+17,5.2,INK)}}
if(typeof mplInstall==='function')mplInstall({name:'palespire2',levels:[9820,9821,9822,9823,9824,9825,9826,9827],draw:f2MapDraw,tint:[3,2,6],foot:'You are the yellow arrow. The numbers on the map are listed on the right; gold squares are the doors of the Hall of Illusions, dark green rounds are trees, red dots are people and things to touch.'});
/* every arrival in a room: say where the party is the first time, apply the puzzle state */
pspOnArrive((n,restored)=>{if(!f2Is(n))return;const S=f2S(n);if(!S.seen&&!restored){S.seen=1;try{msg(F2B[n].text,'#d8e4f0')}catch(e){}}});
