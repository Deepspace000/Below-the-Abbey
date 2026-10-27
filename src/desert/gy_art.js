/* ==========================================================================
   THE WENLOCK GRAVEYARD AND CRYPT: ids, pictures, creatures, items (prefix gy / GY). Rated 84 (the four mazes 84, 85, 86 and 87).
   Levels: 530 the graveyard (70 by 70), 531 the crypt (Lady Aldith's), 532 The Red Ossuary (skeletons, red brick), 533 The Grey Charnel (ghouls and zombies, grey stone brick),
   534 The Black Barrow (wraiths and shades, black basalt brick), 535 The Pale Catacombs (rats, bone hounds and ravens, bone-white mossy brick).
   Pictures: painted (Gemini), cut with tools/ingest_gy.py into assets/gy and listed in gy_list.js (tools/gy_list.py). They load with the town (Wenlock builds its lych-gate from them) or when
   the graveyard is first needed (gyLoad). IMG['gyp_<piece>'] is the raw piece; IMG['gy_<alias>'] and NPC_H the pieces as the game uses them (GYA: alias -> [piece, height in squares]).
   Notes: tools/GRAVEYARD_NOTES.md.
   ========================================================================== */
const GY={ID:530,CRYPT:531,M:[532,533,534,535],W:70,H:70,ready:false,loading:null,tiles:{},LV:{530:84,531:84,532:84,533:85,534:86,535:87,536:84,537:84,538:84,539:84,540:84,541:84,542:85}};
const gyIs=n=>n===530||n===531||(n>=532&&n<=542);   // 536 to 541 are the six small tombs built into the yard's edge (gy_tombs.js)
const gyMazeK=n=>GY.M.indexOf(n);   // 0..3, or -1
GY.NAMES={530:'Wenlock Graveyard',531:"Lady Aldith's Crypt",532:'The Red Ossuary',533:'The Grey Charnel',534:'The Black Barrow',535:'The Pale Catacombs',536:'The Vane Tomb',537:'The Ashby Vault',538:'The Thorne Mausoleum',539:'The Marsh Crypt',540:'The Cobb Vault',541:'The Fell Tomb',542:'The Vaults Beneath the Avenue'};
for(const n in GY.LV){LEVEL_RATING[n]=GY.LV[n];LEVEL_NAMES[n]=GY.NAMES[n]}
const GYA={ // alias: [piece, height of the thing in squares (one square is about a person's height)]
  ghost0:['ghost_0',1.1],ghost1:['ghost_1',1.1],ghost2:['ghost_2',1.1],
  vane:['boss_0',1.95],grimsby:['boss_1',2.15],aldric:['boss_2',2.3],morwenna:['boss_3',2.1],
  skel:['crA_0',1.55],pike:['crA_1',1.9],bmage:['crA_2',1.75],ghoul:['crA_3',1.5],zombie:['crA_4',1.55],giant:['crA_5',2.1],
  wraith:['crB_0',1.95],shade:['crB_1',1.8],banshee:['crB_2',1.6],rats:['crB_3',1.0],hound:['crB_4',.9],rat:['crB_5',1.0],raven:['crB_6',1.05],
  stone1:['stonesA_0',1.0],stone2:['stonesA_1',1.0],ccross:['stonesA_2',1.75],angel:['stonesA_3',1.95],tomb:['stonesA_4',.8],mausoleum:['stonesA_5',2.7],
  yew:['sceneB_0',3.5],dead:['sceneB_1',3.1],hut:['sceneB_3',2.3],chapel:['sceneB_4',3.2],rpost:['sceneB_5',1.05],
  igate:['gatesC_0',2.2],arch:['gatesC_1',2.5],hatch:['gatesC_3',1.35],crypt:['gatesC_4',3.6],lych:['gatesC_5',2.9],
  sarc:['cryptD_0',1.0],altar:['cryptD_1',1.5],candles:['cryptD_2',1.85],niche:['cryptD_3',2.0],edmund:['cryptD_4',1.15],coffin:['cryptD_5',1.7],
  ring:['relicsE_0',.34],locket:['relicsE_1',.4],book:['relicsE_2',.42],nameplate:['relicsE_3',.9],rose:['relicsE_4',.5],bell:['relicsE_5',.45],
  stair:['stairFix_0',2.6],mound:['stairFix_1',.85],igate2:['stairFix_2',2.3],hatch2:['stairFix_3',1.3],
  lean:['stonesB_0',.8],wcross:['stonesB_1',1.15],slab:['stonesB_2',1.1],obelisk:['stonesB_3',2.3],column:['stonesB_4',1.9],urn:['stonesB_5',1.3],
  fence:['fenceG_0',1.55],barrow:['fenceG_1',.75],lantern:['fenceG_2',2.1],bench:['fenceG_3',.55],
  bones:['bonesH_0',.45],web:['bonesH_1',1.2],lever:['bonesH_2',.9],chest:['bonesH_3',.6],rune:['bonesH_4',1.15],sign:['bonesH_5',1.2]};
/* graves, tombs and walls are grown over with ivy: the painted grass texture over the lower part of each picture, thickest at the foot */
function gyIvy(){
  if(GY._ivy){for(const a in GY._ivy)IMG['gy_'+a]=GY._ivy[a];return}
  const t=IMG.gyp_texFloor_0;if(!t)return;GY._ivy={};
  for(const a of ['stone1','stone2','lean','slab','wcross','ccross','tomb','urn','obelisk','column','mausoleum','angel','chapel','hut','crypt','barrow','fence']){
    const s=IMG['gy_'+a];if(!s)continue;try{
    const c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');x.drawImage(s,0,0);x.globalCompositeOperation='source-atop';
    const w=c.width,h=c.height,n=Math.round(w*h/(a==='fence'?110:52)),G=['#2a5a26','#3b7f31','#58a03e','#244c24','#6fb04a'];
    // vines running up from the foot, then leaves over them, thickest low down
    for(let k=0;k<Math.round(w/16);k++){let px=hash2(k,1,620)*w,py=h;x.strokeStyle='#27481f';x.lineWidth=1.6+hash2(k,2,620)*1.6;x.beginPath();x.moveTo(px,py);for(let t=0;t<9;t++){px+=(hash2(k,t+3,621)-.5)*10;py-=h*(.04+hash2(k,t+4,622)*.08);x.lineTo(px,py)}x.stroke()}
    for(let k=0;k<n;k++){const px=hash2(k,1,623)*w,py=h*(1-Math.pow(hash2(k,2,623),1.9)),r=2.2+hash2(k,3,623)*3.6;x.fillStyle=G[(hash2(k,4,623)*G.length)|0];x.globalAlpha=.9;x.beginPath();x.ellipse(px,py,r,r*.62,hash2(k,5,623)*3.14,0,6.3);x.fill()}
    x.globalAlpha=1;GY._ivy[a]=c;IMG['gy_'+a]=c}catch(e){console.error('gyIvy',a,e)}}}
/* cobwebs are drawn faint and fine: the painted web at half strength */
function gyWeb(){const s=IMG.gyp_bonesH_1;if(!s)return;if(!GY._web){const c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');x.globalAlpha=.5;x.drawImage(s,0,0);GY._web=c}IMG.gy_web=GY._web}
function gyLoad(){
  if(GY.loading)return GY.loading;
  GY.loading=new Promise(res=>{
    const jobs=Object.keys(typeof GY_LIST!=='undefined'?GY_LIST:{}).map(k=>[k,'assets/gy/'+GY_LIST[k][0]]);
    let left=jobs.length;if(!left){GY.ready=true;res();return}
    const done=()=>{if(--left<=0){try{gyAlias()}catch(e){console.error(e)}GY.ready=true;res()}};
    for(const [k,src] of jobs){if(IMG['gyp_'+k]){done();continue}const i=new Image();i.onload=()=>{IMG['gyp_'+k]=i;done()};i.onerror=()=>done();i.src=src+'?v='+(typeof VERSION!=='undefined'?VERSION:'')}
  });
  return GY.loading}
function gyAlias(){
  for(const a in GYA){const [n,h]=GYA[a];if(IMG['gyp_'+n]){IMG['gy_'+a]=IMG['gyp_'+n];NPC_H['gy_'+a]=h}}
  for(const [k,n] of [['skel','crA_0'],['pike','crA_1'],['bmage','crA_2'],['ghoul','crA_3'],['zombie','crA_4'],['giant','crA_5'],['wraith','crB_0'],['shade','crB_1'],['banshee','crB_2'],['rats','crB_3'],['hound','crB_4'],['rat','crB_5'],['raven','crB_6'],
    ['vane','boss_0'],['grimsby','boss_1'],['aldric','boss_2'],['morwenna','boss_3'],['ghost0','ghost_0'],['ghost1','ghost_1'],['ghost2','ghost_2']])if(IMG['gyp_'+n])IMG['gyi_'+k]=IMG['gyp_'+n];
  gySlab();gyFloors();gyIvy();gyWeb()}
/* the blank grave slab (stonesB_2) was painted as a plain flat grey card, which glows in the mist: it is given the grain of the painted grey stone texture, darker towards the foot like the other stones */
function gySlab(){
  if(GY._slabC){IMG.gy_slab=GY._slabC;return}   // gyAlias runs again for every maze that is built, and puts the plain piece back, so the finished one is put in again each time
  const s=IMG.gyp_stonesB_2,t=IMG.gyp_texGrey_2;if(!s||!t)return;
  try{const c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');
    x.drawImage(t,0,0,c.width,c.height);x.globalCompositeOperation='multiply';
    const g=x.createLinearGradient(0,0,0,c.height);g.addColorStop(0,'rgb(205,208,205)');g.addColorStop(.6,'rgb(170,172,168)');g.addColorStop(1,'rgb(118,120,116)');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
    x.globalCompositeOperation='destination-in';x.drawImage(s,0,0);GY._slabC=c;IMG.gy_slab=c}catch(e){console.error('gySlab',e)}}
/* the ground and the ceilings, from the painted textures */
const GY_FLOORSET=['gyf_grass','gyf_dirt','gyf_gravel','gyf_flag','gyf_bone','gyf_slate','gyf_cobble'];
function gyFloors(){
  if(GY._floors)return;
  const mk=(nm,key,gain,t)=>{const im=IMG['gyp_'+key];if(!im||FLOORS[nm])return;const base=dsPaintedTex(im),d=new Uint8ClampedArray(base.length);
    for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,base[i]*gain*t[0]);d[i+1]=Math.min(255,base[i+1]*gain*t[1]);d[i+2]=Math.min(255,base[i+2]*gain*t[2]);d[i+3]=255}FLOORS[nm]=d};
  const T1=[1,1,1];
  // peaceful, lush grass made in code: soft greens in drifting patches, fine blades, sunlit dapples and the odd tiny white, yellow or pink flower; it tiles
  if(!FLOORS.gyf_grass){const N=128,d=new Uint8ClampedArray(N*N*4),hh=(a,b,c)=>hash2(a,b,c),vn=(x,y,cs,sd)=>{const P=N/cs,u=x/cs,v=y/cs,i=Math.floor(u),j=Math.floor(v),fx=u-i,fy=v-j,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),g=(a,b)=>hh(((a%P)+P)%P,((b%P)+P)%P,sd),t=g(i,j)*(1-sx)+g(i+1,j)*sx,bt=g(i,j+1)*(1-sx)+g(i+1,j+1)*sx;return t*(1-sy)+bt*sy};
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=(y*N+x)*4,n1=vn(x,y,32,611),n2=vn(x,y,16,612),n3=vn(x,y,8,613),blade=hh(x,y>>1,614)-.5,dap=Math.max(0,vn(x,y,32,615)-.62)*70;
      let r=78+n1*26+n2*14+blade*18+dap*.7,g=146+n1*34+n2*20+blade*30+dap,b=50+n1*14+n3*8+blade*10;
      if(hh(x>>2,y>>2,616)<.014){const k=hh(x>>2,y>>2,617);r=k<.5?238:k<.8?240:236;g=k<.5?238:k<.8?214:170;b=k<.5?230:k<.8?90:196}
      d[o]=r;d[o+1]=g;d[o+2]=b;d[o+3]=255}
    FLOORS.gyf_grass=d}
  mk('gyf_grass','texFloor_0',1.5,[.92,1.06,.9]);mk('gyf_dirt','texFloor_1',1.1,[1.05,.95,.85]);mk('gyf_gravel','texFloor_2',1.35,T1);mk('gyf_flag','texFloor_3',1.3,T1);mk('gyf_bone','texFloor_4',.95,T1);mk('gyf_slate','texFloor_5',1.0,T1);
  // real cobbles: small rounded stones of warm grey and brown with dark joints, a little moss in the joints and the odd fallen leaf (about eight stones across each square)
  if(!FLOORS.gyf_cobble){const N=128,S=16,d=new Uint8ClampedArray(N*N*4),hh=(a,b,c)=>hash2(a,b,c),ctr=[];
    for(let j=0;j<N/S;j++)for(let i=0;i<N/S;i++)ctr.push([(i+.5+(hh(i,j,601)-.5)*.5)*S,(j+.5+(hh(i,j,602)-.5)*.5)*S,hh(i,j,603)]);
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){let d1=1e9,d2=1e9,id=0;const gi=Math.floor(x/S),gj=Math.floor(y/S);
      for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=(gi+di+N/S)%(N/S),jj=(gj+dj+N/S)%(N/S),c=ctr[jj*(N/S)+ii];let dx=Math.abs(x-(c[0]+(gi+di-ii)*S)),dy=Math.abs(y-(c[1]+(gj+dj-jj)*S));const dd=Math.hypot(dx,dy*1.15);if(dd<d1){d2=d1;d1=dd;id=c[2]}else if(dd<d2)d2=dd}
      const e=d2-d1,o=(y*N+x)*4,base=128+id*60,round=Math.min(1,e/5),shade=base*(.55+.45*round)*(1+.08*(hh(x,y,604)-.5));
      let r=shade*1.02,g=shade*.97,b=shade*.9;if(e<2.1){r=34;g=32;b=26;if(hh(x>>1,y>>1,605)<.35){g+=14;r+=2}}
      if(hh(x>>2,y>>2,606)<.025){r=150+hh(x,y,607)*60;g=70+hh(x,y,608)*50;b=26}
      d[o]=r;d[o+1]=g;d[o+2]=b;d[o+3]=255}
    FLOORS.gyf_cobble=d}
  for(const nm of GY_FLOORSET)if(!FLOORS[nm])FLOORS[nm]=FLOORS.cobble||FLOORS.grass;
  const cl=(nm,key,gain,t)=>{const im=IMG['gyp_'+key];if(!im||CEILS[nm])return;const base=dsPaintedTex(im),d=new Uint8ClampedArray(base.length);
    for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,base[i]*gain*t[0]);d[i+1]=Math.min(255,base[i+1]*gain*t[1]);d[i+2]=Math.min(255,base[i+2]*gain*t[2]);d[i+3]=255}CEILS[nm]=d};
  cl('gyc_0','texRed_3',.5,T1);cl('gyc_1','texGrey_3',.5,T1);cl('gyc_2','texBlack_3',.55,T1);cl('gyc_3','texBone_3',.5,T1);cl('gyc_crypt','texGrey_0',.5,[.9,.95,1]);
  GY._floors=1}
/* wall tiles: a painted texture stood up into a tall tile (stacked, each copy slid sideways), or one slice of a big front picture */
function gyTile(tex,wh,opt){
  opt=opt||{};const key=tex+'|'+wh+'|'+(opt.fac?opt.fac.img+opt.fac.i+'/'+opt.fac.n:'')+(opt.rgb?opt.rgb.join(','):'')+(opt.gain||'');if(GY.tiles[key]!==undefined)return GY.tiles[key];
  const im=IMG['gyp_'+tex],Hp=Math.round(128*wh),c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');
  x.fillStyle='#14120f';x.fillRect(0,0,128,Hp);
  if(im){const units=Math.ceil(wh);for(let u=0;u<units;u++){const y=Hp-(u+1)*128,sh=((u*.37+(tex.length%5)*.11)%1)*128;
      x.save();if(u%2){x.translate(128,0);x.scale(-1,1)}for(const dx of [-sh,128-sh])x.drawImage(im,0,0,im.width,im.height,dx,y,128,128);x.restore()}}
  if(opt.fac){const f=IMG['gyp_'+opt.fac.img];if(f){const n=opt.fac.n,i=opt.fac.i,s=n*128/f.width,fh=f.height*s,sw=f.width/n;x.drawImage(f,i*sw,0,sw,f.height,0,Hp-fh,128,fh)}}
  x.globalCompositeOperation='multiply';const gr=x.createLinearGradient(0,0,0,Hp);gr.addColorStop(0,'rgb(255,255,255)');gr.addColorStop(.7,'rgb(236,238,240)');gr.addColorStop(1,'rgb(176,178,180)');x.fillStyle=gr;x.fillRect(0,0,128,Hp);x.globalCompositeOperation='source-over';
  const d=x.getImageData(0,0,128,Hp).data,gain=opt.gain||1.05,m=opt.rgb||[1,1,1];
  for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,d[i]*gain*m[0]);d[i+1]=Math.min(255,d[i+1]*gain*m[1]);d[i+2]=Math.min(255,d[i+2]*gain*m[2])}
  const id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;
  {let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=4*37){r+=d[i];g+=d[i+1];b+=d[i+2];n++}(GY.col=GY.col||{})[gid]=[r/n|0,g/n|0,b/n|0]}
  return GY.tiles[key]=gid}
/* ---- the creatures. hp is only a size (ordinary creatures take their health from the balance code); the four ghost-enemies are sized to the old boss formula so they come out at 15,000 to 20,000 health ---- */
function gyW(img,h){const e=typeof GY_LIST!=='undefined'&&GY_LIST[img];return e?+(h*e[1]/e[2]).toFixed(2):h*.7}
Object.assign(ENEMY_DEF,{
  gyskel:{name:'Grave Skeleton',hp:44,dmg:[5,9],hit:.84,w:gyW('crA_0',.68),img:'gyi_skel',xp:20,gold:[0,0],speed:1,verb:'slashes',gy:1},
  gypike:{name:'Skeleton Pikeman',hp:52,dmg:[6,10],hit:.84,w:gyW('crA_1',.74),img:'gyi_pike',xp:22,gold:[0,0],speed:1,verb:'jabs',gy:1},
  gybmage:{name:'Bone Mage',hp:40,dmg:[6,11],hit:.86,w:gyW('crA_2',.7),img:'gyi_bmage',xp:24,gold:[0,0],speed:1,ranged:2,verb:'blasts',gy:1,glow:.4},
  gyghoul:{name:'Ghoul',hp:50,dmg:[6,10],hit:.85,w:gyW('crA_3',.55),img:'gyi_ghoul',xp:22,gold:[0,0],speed:2,verb:'claws',gy:1},
  gyzombie:{name:'Rotting Zombie',hp:60,dmg:[5,9],hit:.82,w:gyW('crA_4',.62),img:'gyi_zombie',xp:20,gold:[0,0],speed:1,verb:'pummels',gy:1},
  gygiant:{name:'Bloated Corpse',hp:84,dmg:[7,12],hit:.84,w:gyW('crA_5',.72),img:'gyi_giant',xp:30,gold:[0,0],speed:1,verb:'crushes',gy:1},
  gywraith:{name:'Barrow Wraith',hp:52,dmg:[6,11],hit:.86,w:gyW('crB_0',.76),img:'gyi_wraith',xp:26,gold:[0,0],speed:1,fly:true,floatH:.1,verb:'reaps',gy:1,glow:.5},
  gyshade:{name:'Shade',hp:44,dmg:[6,10],hit:.87,w:gyW('crB_1',.68),img:'gyi_shade',xp:24,gold:[0,0],speed:2,fly:true,floatH:.2,verb:'rakes',gy:1,glow:.35},
  gybanshee:{name:'Banshee',hp:46,dmg:[6,11],hit:.86,w:gyW('crB_2',.68),img:'gyi_banshee',xp:26,gold:[0,0],speed:1,fly:true,floatH:.15,verb:'wails at',gy:1,glow:.6},
  gyrats:{name:'Rat Swarm',hp:40,dmg:[5,8],hit:.86,w:gyW('crB_3',.5),img:'gyi_rats',xp:22,gold:[0,0],speed:2,verb:'gnaws',gy:1},
  gyhound:{name:'Bone Hound',hp:46,dmg:[6,10],hit:.86,w:gyW('crB_4',.5),img:'gyi_hound',xp:24,gold:[0,0],speed:2,verb:'savages',gy:1},
  gyrat:{name:'Corpse Rat',hp:38,dmg:[5,9],hit:.85,w:gyW('crB_5',.6),img:'gyi_rat',xp:20,gold:[0,0],speed:2,verb:'bites',gy:1},
  gyraven:{name:'Carrion Raven',hp:36,dmg:[5,9],hit:.87,w:gyW('crB_6',.55),img:'gyi_raven',xp:20,gold:[0,0],speed:2,fly:true,floatH:.3,verb:'stabs',gy:1},
  // the four enemies of the ghost: named, level 84 to 87, hard but fair
  gyvane:{name:'Lord Corwin Vane',hp:386,dmg:[8,13],hit:.9,w:gyW('boss_0',1.25),img:'gyi_vane',xp:600,gold:[0,0],speed:1,verb:'runs through',boss:true,gy:1,gyb:0,glow:.3},
  gygrimsby:{name:'Digger Grimsby',hp:421,dmg:[9,15],hit:.9,w:gyW('boss_1',1.45),img:'gyi_grimsby',xp:600,gold:[0,0],speed:1,verb:'swings his spade at',boss:true,gy:1,gyb:1},
  gyaldric:{name:'Sir Aldric the Forsworn',hp:456,dmg:[8,14],hit:.9,w:gyW('boss_2',1.55),img:'gyi_aldric',xp:600,gold:[0,0],speed:1,verb:'cleaves',boss:true,gy:1,gyb:2,glow:.3},
  gymorwenna:{name:'Prioress Morwenna',hp:503,dmg:[9,15],hit:.9,w:gyW('boss_3',1.4),img:'gyi_morwenna',xp:600,gold:[0,0],speed:1,verb:'curses',boss:true,gy:1,gyb:3,glow:.3}
});
if(typeof NO_VARY!=='undefined')NO_VARY.push('gyvane','gygrimsby','gyaldric','gymorwenna');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('gyvane','gygrimsby','gyaldric','gymorwenna');
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.gyvane=[3000,3800];BOSS_GOLD.gygrimsby=[3400,4200];BOSS_GOLD.gyaldric=[3800,4600];BOSS_GOLD.gymorwenna=[4200,5200]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^gyghoul/,'tomblung',.2],[/^gyzombie/,'foodpoison',.2],[/^gygiant/,'foodpoison',.25],[/^gywraith/,'shaken',.2],[/^gybanshee/,'haunted',.25],[/^gyshade/,'cursed',.15],[/^gyrat/,'fever',.15],[/^gyhound/,'bleeding',.2],[/^gyraven/,'bleeding',.15],[/^gymorwenna/,'cursed',.2],[/^gyaldric/,'shaken',.2]);
/* ---- the things the party carries: the four relics, the keys, the rewards ---- */
ITEMDEF.gyring={n:"Aldith's Wedding Ring",k:'quest',t:'Quest item',ic:'ring',c:'#e0b050',stack:1,price:0,sw:.1,d:"A thin gold ring with a small red stone, worn smooth on the inside by a lifetime of being turned round and round a finger. It belongs to Lady Aldith of Wenlock."};
ITEMDEF.gyname={n:"Aldith's Name-stone",k:'quest',t:'Quest item',ic:'ore',c:'#a8a8a0',stack:1,price:0,sw:.6,d:"A small grey slab with a carved border and room for one name. It was cut for Lady Aldith's grave and taken away before she was buried. The name is still to be carved."};
ITEMDEF.gylocket={n:"Sir Edmund's Locket",k:'quest',t:'Quest item',ic:'amulet',c:'#c8c8d0',stack:1,price:0,sw:.1,d:"A silver locket on a chain. Inside, two curls of hair, one dark and one fair, tied with the same thread. Sir Edmund meant it for his wife."};
ITEMDEF.gybook={n:"The Prioress's Book of Rest",k:'quest',t:'Quest item',ic:'book',c:'#6a4a30',stack:1,price:0,sw:.4,d:"A black leather prayer book with a brass clasp. The burial service is in it, the one the Prioress would not read over Lady Aldith. The page is marked."};
ITEMDEF.gykey={n:"The Warden's Iron Key",k:'quest',t:'Key',ic:'key',c:'#b88a4a',stack:1,price:0,sw:.2,d:"A heavy iron key, red with old rust. It opens the iron door at the end of the Red Ossuary, and no other lock."};
ITEMDEF.gyseal={n:"The Prioress's Bone Seal",k:'quest',t:'Key',ic:'ore',c:'#e8e4d0',stack:1,price:0,sw:.2,d:"A seal of carved bone on a cord, stamped with a bell. It fits the sealed door of the Prioress's chapel in the Pale Catacombs."};
ITEMDEF.gylantern={n:'Ghostlight Lantern',k:'light',t:'Light',ic:'lantern',c:'#a8d8ff',light:3.2,price:0,rar:1,sw:.4,d:"A little glass lantern with a pale blue flame that gives no heat and never goes out. It was lit from the last of Lady Aldith's light. It shines further than any brass lantern, and the dead like it."};
ITEMDEF.gysword={n:"Sir Edmund's Blessed Sword",k:'weapon',t:'Sword',ic:'sword',c:'#d8e8ff',dmg:[430,520],hit:.2,req:{str:66},lvl:84,price:0,rar:1,eff:{daze:.2,bleed:[.3,6,40],bossdmg:.35},dbl:.2,sw:.46,d:"A plain knight's sword, blessed at the church of Saint Wenna before the wars and kept by a loving wife for three hundred years. One blow in five leaves the foe dazed, wounds bleed, and bosses take 35% more. Needs level 84."};
ITEMDEF.gyring2={n:"Ring of Rest",k:'ring',t:'Ring',ic:'ring',c:'#a8d0f0',price:0,lvl:84,pas:{ward:14,dodge:.06,regen:.6,mpRegen:.4},int:6,hp:70,rar:1,sw:.1,d:"A band of pale silver that is warm to the touch. Adds 6 Intelligence and 70 health, every blow on the wearer is 14 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 84."};
ITEMDEF.gyrose={n:"Aldith's Rose",k:'quest',t:'Keepsake',ic:'herb',c:'#c03040',stack:1,price:0,sw:.05,d:"A dried red rose with a grey ribbon. It never drops a petal. She said it was only for luck, and that you were to stop looking so worried."};
if(typeof CONTAINERS!=='undefined'&&!CONTAINERS.includes('gy_chest'))CONTAINERS.push('gy_chest');
if(typeof DS_LOOTNAME!=='undefined')DS_LOOTNAME.gy_chest='Old chest';
/* the look: dusk mist in the graveyard, nothing outdoors elsewhere */
{const _w=weatherNow;weatherNow=function(){
  if(LEVEL===GY.ID)return {id:'fog',n:'Dusk mist',fog:.02,haze:.3,dark:.02,mix:.4,col:[240,200,120],text:'A cold blue mist lies low between the stones, and the last of the daylight is going. Somewhere a raven clears its throat.'};
  if(gyIs(LEVEL))return null;
  return _w.apply(this,arguments)}}
/* arrival: the pictures first, then the level; no door ever opens on a level that is not built */
{const _g=goToLevel;goToLevel=function(n,entry){
  if(gyIs(n)&&!GY.ready&&!GY._wait){GY._wait=1;gyLoad().then(()=>{GY._wait=0;goToLevel(n,entry)});return}
  if(gyIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error(e)}
  const dead=gyIs(n)&&G.lst&&G.lst[n]&&G.lst[n].dead?new Set(G.lst[n].dead):null;
  const r=_g.call(this,n,entry);
  try{if(gyIs(n)){
    if(dead&&G.enemies)G.enemies=G.enemies.filter(e=>!(e.id<ENEMY_SPAWNS.length&&dead.has(e.id)));   // the fallen stay down: nothing returns to a graveyard
    if(typeof gyArrive==='function')gyArrive(n)}
   else if(n===WL.ID&&typeof gyTownArrive==='function')gyTownArrive()}catch(e){console.error('gyArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(gyIs(n)&&!GY.ready&&!GY._wait){GY._wait=1;gyLoad().then(()=>{GY._wait=0;jumpToLevel(n,target)});return}
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&gyIs(sv.level)&&!GY.ready&&!GY._wait){GY._wait=1;gyLoad().then(()=>{GY._wait=0;restore(sv)});return}
  return _r.apply(this,arguments)}}
/* a game loaded inside the graveyard gets the same arrival as walking in (the dressed grave, the lit shrine, the quiet ghost), because the pieces added on arrival are not part of a save */
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);
  try{if(gyIs(LEVEL)&&typeof gyArrive==='function')gyArrive(LEVEL);else if(LEVEL===WL.ID&&typeof gyTownArrive==='function')gyTownArrive()}catch(e){console.error('gy restore',e)}
  return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||gyIs(n)}}
/* Wenlock's own loader also loads these pictures, so that the lych-gate in Churchyard Lane can be painted when the town is built */
{const _wl=wlLoad;wlLoad=function(){if(!GY_ENABLED)return _wl.apply(this,arguments);if(GY._both)return GY._both;return GY._both=Promise.resolve(_wl.apply(this,arguments)).then(()=>gyLoad())}}

/* ---- flames of other colours for the wall torches of the four mazes: 3 blue and 4 yellow join the engine's 0 orange, 1 red and 2 purple (FLAMES and GLOWS are indexed by colour times eight frames) ---- */
function gyFlames(){
  if(FLAMES.length<24||FLAMES.length>=40||typeof FLAME_FRAMES==='undefined')return;
  const RAMPS=[[[0,[8,20,90]],[.25,[20,70,200]],[.5,[70,150,255]],[.8,[170,220,255]],[1,[235,248,255]]],[[0,[150,110,0]],[.25,[225,180,10]],[.5,[255,225,60]],[.8,[255,246,150]],[1,[255,255,225]]]],
    GL=[['rgba(80,150,255,.8)','rgba(30,70,200,.3)'],['rgba(255,225,70,.75)','rgba(220,170,20,.28)']];
  RAMPS.forEach((st,ci)=>{
    const ramp=I=>{for(let i=1;i<st.length;i++)if(I<=st[i][0]){const t=(I-st[i-1][0])/(st[i][0]-st[i-1][0]),p=st[i-1][1],q=st[i][1];return [p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t]}return st[st.length-1][1]};
    for(let f=0;f<FLAME_FRAMES;f++){
      const c=document.createElement('canvas');c.width=64;c.height=96;const x=c.getContext('2d'),id=x.createImageData(64,96),D=id.data,seed=ci?71:53,ph=hash2(f,3,seed)*6;
      for(let j=0;j<96;j++)for(let i=0;i<64;i++){
        const v=(90-j)/82;if(v>1.02||v<-.08)continue;const vv=Math.max(0,v);
        const sway=Math.sin(f*.8+vv*3.4)*5*vv+(vnoise(i/9+f*.35,j/9-f*1.9,64,seed)-.5)*12*vv,half=26*Math.pow(1-vv,.6)*(1+.4*Math.sin(vv*8-f*1.5+ph))*(v<0?.6+v*4:1),d=Math.abs(i-32-sway)/Math.max(.5,half);
        let I=Math.pow(Math.max(0,1-d),.6)*Math.pow(Math.max(0,1-vv*vv),.8);I*=.74+.5*vnoise(i/4,j/4-f*2.4,64,seed+5);I=Math.max(0,Math.min(1,I));if(I<.03)continue;
        const [r,g,b]=ramp(I),k=(j*64+i)*4;D[k]=r;D[k+1]=g;D[k+2]=b;D[k+3]=Math.min(255,I*330)}
      x.putImageData(id,0,0);FLAMES.push(c)}
    const gc=document.createElement('canvas');gc.width=gc.height=64;const gx=gc.getContext('2d'),gg=gx.createRadialGradient(32,32,2,32,32,32);
    gg.addColorStop(0,GL[ci][0]);gg.addColorStop(.5,GL[ci][1]);gg.addColorStop(1,'rgba(0,0,0,0)');gx.fillStyle=gg;gx.fillRect(0,0,64,64);GLOWS.push(gc)})}

/* the firs of the graveyard are the dark pines of Blackbriar Wood, so that wood's pictures load with this one */
{const _g=gyLoad;gyLoad=function(){if(GY._wwp)return GY._wwp;return GY._wwp=Promise.resolve(_g.apply(this,arguments)).then(()=>typeof wwLoad==='function'?wwLoad():0)}}
