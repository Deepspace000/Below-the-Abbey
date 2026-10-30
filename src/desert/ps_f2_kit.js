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
  9821:{k:'forest',sky:{top:[64,104,140],mid:[150,186,196],low:[214,222,186]},cloud:.85,fog:[150,176,150,.014],amb:.95,lcol:[1.1,1.08,.85],wn:'Morning mist',fx:null,
    text:'A soft morning mist hangs between the trees. Birds sing somewhere. Everything here is a little too perfect.'},
  9822:{k:'island',sky:{top:[40,104,196],mid:[110,168,228],low:[206,226,240]},cloud:1.05,fog:[186,208,228,.008],amb:1.05,lcol:[1.15,1.1,.95],wn:'Sea air',fx:null,
    text:'A warm wind blows off the sea. The sun is bright, and the waves come in slow and even, always the same.'},
  9823:{k:'snow',sky:{top:[150,164,184],mid:[190,200,212],low:[226,230,236]},cloud:1.15,fog:[214,222,232,.02],amb:.95,lcol:[.95,1.0,1.12],wn:'Snow',fx:'snow',
    text:'Snow falls without a sound. It is bitterly cold, and the light is grey and even.'},
  9824:{k:'water',sky:{top:[40,42,92],mid:[188,120,124],low:[248,190,132]},cloud:.95,fog:[196,160,156,.014],amb:.9,lcol:[1.35,1.0,.7],wn:'Evening haze',fx:null,
    text:'The canals lie still under a pink evening sky. Water laps at the steps, and somewhere a bell rings the hour.'},
  9825:{k:'desert',sky:{top:[84,146,212],mid:[200,202,192],low:[242,216,160]},cloud:.55,fog:[228,206,166,.012],amb:1.1,lcol:[1.3,1.1,.75],wn:'Heat',fx:'heat',
    text:'The sun beats down on the sand. The air shimmers with heat, and there is no wind.'},
  9826:{k:'swamp',sky:{top:[38,48,44],mid:[78,94,80],low:[118,130,104]},cloud:1.0,fog:[92,106,84,.034],amb:.62,lcol:[.85,1.1,.7],wn:'Bog mist',fx:null,
    text:'A thick green mist lies on the black water. Frogs croak, and the mud bubbles and stinks.'},
  9827:{k:'nightmare',sky:{top:[8,0,6],mid:[56,10,16],low:[116,30,24]},cloud:.7,fog:[44,10,16,.03],amb:.42,lcol:[1.3,.55,.5],wn:'Red dark',fx:null,
    text:'The sky is the colour of a bruise, and the air is thick and still. Things move just out of sight.'}};
/* ---------- floors: f2 names to engine FLOORS keys (some re-toned here) ---------- */
const F2_FLMAKE={snow:['scree',1.62,[.97,1.0,1.07]],snowpath:['wwf_dirt',1.05,[.9,.94,1.02]],bogwater:['water',.55,[.62,.8,.55]],canal:['water',.82,[.8,.95,1.0]],
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
      const o=(y*W+x)*4;d[o]=Math.min(255,r);d[o+1]=Math.min(255,g);d[o+2]=Math.min(255,b);d[o+3]=255}}
  return F2.sky[id]=d}
/* the castle kit draws its night sky on every outdoor castle level: in an illusion room the room's own sky is shown instead */
{const _sf=pspSkyFrame;pspSkyFrame=function(){
  if(f2Is(LEVEL)&&LEVELS[LEVEL]&&LEVELS[LEVEL].outdoor){if(!PSPK.live)PSPK.live=new Uint8ClampedArray(1024*256*4);self.BKSKY_LV=LEVEL;self.BKSKY_PAN=f2SkyArr(LEVEL);return}
  return _sf.apply(this,arguments)}}
/* the air: each room's own mist, light and weather effect (snow falling, heat shimmer) */
{const _w=weatherNow;weatherNow=function(){
  if(f2Is(LEVEL)){const B=F2B[LEVEL];return {id:'fog',n:B.wn,fog:B.fog[3],haze:.25,dark:0,mix:.4,col:B.fog.slice(0,3),text:B.text,fx:B.fx||null}}
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
  C.mist=(x,y)=>C.solid(x,y,C.ch(f2MistGid((hs(x,y,3)*5)|0,S.mistH||3.8)));
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
  C.ret=()=>{for(let y=38;y<=39;y++)for(let x=20;x<=28;x++)C.solid(x,y,C.ch(pspWallGid(x===24?'pier':'dark',(hs(x,y,4)*4)|0,3.6)));
    C.links({style:{'Hall of Illusions':'great'}});
    for(const x of [22,26]){C.used.delete(x+',37');C.dec(pspPic('pillar_lantern'),x,37,{block:true,sc:.85});C.light(x,37,C.silver)}
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
  C.warp=(x,y,style,to,msgText)=>{const b=style==='house'?null:pspDoorGid(style||'oak',wh),g=KH_NEXT_GID++;if(b!=null){T_TILE[g]=T_TILE[b];if(GY.col&&GY.col[b])GY.col[g]=GY.col[b]}KH_DOOR[g]={psf2:'warp',to,A:to,B:to,msg:msgText};(C.warpTo=C.warpTo||[]).push(to);C.solid(x,y,C.ch(g));C.used.add(x+','+y);return g};
  C.foes=(list,rect,seed,o)=>{let n=0;list.forEach((t,i)=>{const q=C.spot(rect[0],rect[1],rect[2],rect[3],seed*31+i,o);if(q&&f2Foe(C,t,q[0],q[1]))n++});return n};
  C.chestAt=(x,y,tier)=>{C.used.delete(x+','+y);return C.chest(x,y,{tier:tier===undefined?1:tier})};
  // finish: no sealed pockets, lights, the level's air
  C.done=o=>{o=o||{};
    {const bs=new Set();for(const d of C.decor)if(d.block)bs.add(d.x+','+d.y);
     const reach=new Uint8Array(W*H),q=[ix(24,35)];reach[q[0]]=1;for(const [a,b] of C.warpTo||[]){if(!reach[ix(a,b)]){reach[ix(a,b)]=1;q.push(ix(a,b))}}
     for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||reach[ix(nx,ny)]||!C.open(nx,ny)||bs.has(nx+','+ny))continue;reach[ix(nx,ny)]=1;q.push(ix(nx,ny))}}
     for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(C.open(x,y)&&!reach[ix(x,y)]&&!bs.has(x+','+y)){C.mist(x,y);for(let i=C.decor.length-1;i>=0;i--)if(C.decor[i].x===x&&C.decor[i].y===y)C.decor.splice(i,1);for(let i=C.lights.length-1;i>=0;i--)if(C.lights[i][0]===x&&C.lights[i][1]===y)C.lights.splice(i,1);for(let i=C.enemies.length-1;i>=0;i--)if(C.enemies[i].x===x&&C.enemies[i].y===y)C.enemies.splice(i,1)}}
    C.glow(o.glow||7,B.lcol);
    const lv=C.finish({start:{x:24,y:35,f:0}});
    lv.fogAt=()=>B.fog;lv.amb=B.amb;lv.f2=1;lv._noTidy=true;
    try{if(typeof pswaHang==='function')pswaHang(id,lv)}catch(e){console.error('f2 wallart',e)}
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
function f2TexFloor(key,out,g,tn){if(FLOORS[out])return out;const im=IMG[key];if(!im||!im.width)return null;try{const N=128,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.drawImage(im,0,0,N,N);const s=x.getImageData(0,0,N,N).data,d=new Uint8ClampedArray(N*N*4);
  for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,s[i]*(g||1)*(tn?tn[0]:1));d[i+1]=Math.min(255,s[i+1]*(g||1)*(tn?tn[1]:1));d[i+2]=Math.min(255,s[i+2]*(g||1)*(tn?tn[2]:1));d[i+3]=255}FLOORS[out]=d;return out}catch(e){return null}}
/* the in-map doors (C.warp) */
function f2MoveTo(a){G.talk=null;G.P.x=a[0];G.P.y=a[1];G.P.f=a[2];G.P.angT=(a[2]-1)*Math.PI/2;G.C={x:a[0],y:a[1],a:G.P.angT};try{reveal()}catch(e){}}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psf2==='warp'){sfx('door');f2MoveTo(d.to);if(d.msg)msg(d.msg,'#e8dcc0');return true}
  return _k.apply(this,arguments)}}
/* puzzle sounds: a bright chime for a right step, a soft low one for a wrong step, a rising run when a puzzle opens */
function f2Chime(kind,i){try{if(!AC||G.mute)return;if(kind==='ok'){const f=[523,659,784,988,1175][i%5];tone(f,f,.9,'sine',.05,0);tone(f*2,f*2,.6,'sine',.015,0)}
  else if(kind==='bad'){tone(220,180,1.1,'sine',.05,0);tone(165,140,1.2,'sine',.03,.1)}
  else{[523,659,784,1047].forEach((f,k)=>{tone(f,f,1.2,'sine',.045,k*.16);tone(f*1.5,f*1.5,.8,'sine',.012,k*.16)})}}catch(e){}}
/* every arrival in a room: say where the party is the first time, apply the puzzle state */
pspOnArrive((n,restored)=>{if(!f2Is(n))return;const S=f2S(n);if(!S.seen&&!restored){S.seen=1;try{msg(F2B[n].text,'#d8e4f0')}catch(e){}}});
