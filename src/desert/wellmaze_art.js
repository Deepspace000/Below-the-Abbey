/* ==========================================================================
   THE PURPLE MAZE UNDER THE WELL OF WENLOCK: pictures, look, creatures and gear (prefix wm / WM). Four levels: 497 Under the Wenlock Well, 498 The Violet Maze, 499 The Bell Vaults,
   502 The Amethyst Deep (level 500 is the Ruby Maze and 501 the Thornwick well, so the fourth level of the well dungeon is 502). All four are rated level 80.
   Pictures: painted by Gemini, cut with tools/wm_ingest.py (props and creatures on green) and tools/ingest_tex.py (walls, floors, ceilings). They are assets/ds_wm_*.png and
   assets/ds_tex_wm_*.png, so the game has them as IMG['art_wm_*'] and IMG['art_tex_wm_*'] (the list is written by tools/inject.py). Raw copies of the cut pieces are in assets/wm/.
   ========================================================================== */
const WM={IDS:[497,498,499,502],NAMES:['Under the Wenlock Well','The Violet Maze','The Bell Vaults','The Amethyst Deep'],DIFF:80,RATING:[80,81,82,83],W:61,H:61,CH:String.fromCharCode(0x2c0)};
WM.k=id=>WM.IDS.indexOf(id);
const wmIn=()=>WM.IDS.includes(LEVEL);
try{WK.WELL=WM.IDS.slice()}catch(e){} // the contract file says 497..499 (500 in a later note); 500 is the Ruby Maze, so the four levels are these
WM.IDS.forEach((id,i)=>{LEVEL_NAMES[id]=WM.NAMES[i];LEVEL_RATING[id]=WM.RATING[i]});
/* ---------- the look: violet haze, violet lamps, violet motes (the cold look of the Hollow cities, tuned) ---------- */
if(typeof HGTE!=='undefined'){
  for(const id of WM.IDS){HGTE.cold.add(id);HGTE.look[id]={ambient:.62,haze:.5,hazeRate:.04,hazeCol:[86,46,146],roofHaze:[38,20,70],tint:[1.12,.86,1.28],lamp:[1.1,.55,1.4],wallGain:1.0,wallSat:1.2,wallAO:.4,
    floorGain:1.08,floorContrast:1.2,floorSat:1.15,floorTint:[1.05,.92,1.12],roofGain:.8,roofTint:[1.05,.85,1.3],motes:44,moteCol:[214,160,255],vignette:.5,grade:[205,150,255,.14],sheen:0,pano:0,sil:0,mist:.35,mistCol:[150,100,220],shafts:0,caustic:.4}}}
/* ---------- the painted pieces: heights in cells (the width follows the picture) ---------- */
const WM_PROPS={keg:.5,barrel_tall:.92,crate_lid:.64,barrel:.72,cask:.62,chest:.5,treasure_chest:.56,crate:.62,barrel_stack:.9,bucket:.46,windlass:1.15,mine_cart:.78,ore_cart:.84,tools:.95,ladder:1.7,mirror:1.55,bookshelf:1.7,statue:1.6,shrine:.95,
  signpost:1.05,web:1.5,bell:1.0,skeleton:.6,boat:.95,noticeboard:1.15,gold:.42,orb_pedestal:1.3,brazier:1.5,lantern_hang:1.0,lamp_post:1.6,candelabra:1.05,cage_lantern:.85,
  crystal_tall:1.6,crystal_small:.72,crystal_white:1.5,crystal_teal:1.0,crystal_pillar:2.1,geode:1.0,mush_cluster:.95,mush_tall:1.5,mush_tree:2.2,moss_mound:.55,mush_bulb:1.3,bellflower:.95,
  lever_up:1.2,lever_down:1.2,crank:1.2,chain:1.5,button:1.0,scale:1.15,key:.5,lantern_gold:1.0,lantern_lilac:1.0,lantern_violet:1.0,rune:1.0,keydoor:1.5};
function wmArt(){
  if(WM.art)return;
  for(const k in WM_PROPS){const im=IMG['art_wm_'+k];if(im){IMG['wm_'+k]=im;NPC_H['wm_'+k]=WM_PROPS[k]}}
  const mk=(name,src,fn)=>{const im=IMG[src];if(!im||!im.width)return null;const [c,x]=tcv();x.drawImage(im,0,0,TS,TS);const d=x.getImageData(0,0,TS,TS).data;if(fn)fn(d);return d};
  const fl=(n,src,k)=>{const d=mk(n,src,k?(p=>{for(let i=0;i<p.length;i+=4){p[i]*=k[0];p[i+1]*=k[1];p[i+2]*=k[2]}}):null);if(d)FLOORS[n]=d};
  fl('wmflag','art_floor_wm_flag');fl('wmcobble','art_floor_wm_cobble');fl('wmmoss','art_floor_wm_moss');fl('wmwater','art_floor_wm_water',[1.1,1.05,1.2]);
  {const d=mk('wmceil','art_ceil_wm_brick');if(d)CEILS.wmceil=d;const e=mk('wmceilx','art_ceil_wm_crystal');if(e)CEILS.wmceilx=e}
  WM.art=true}
/* ---------- the creatures: level 80. An ordinary creature's health comes from the balance code (hgd_balance.js) by the KIND's written health (hp/48, between .6 and 1.4), so hp here is only a size: 30 is about 1700 health at level 80, 64 about 3400.
   Blows are the written range times 12.35 times 2.1 times 1.23 at level 80. The boss is sized by the old formula (820 gives about 31000 health, like the Black Swill). xp is paid times 80. ---------- */
Object.assign(ENEMY_DEF,{
  wmslime:{name:'Violet Slime',hp:34,dmg:[4,7],hit:.8,w:1.5,img:'art_wm_slime',xp:11,gold:[0,0],speed:1,verb:'smothers',glow:.5},
  wmbat:{name:'Glow-bat',hp:30,dmg:[4,7],hit:.82,w:1.35,img:'art_wm_bat',xp:11,gold:[0,0],speed:2,fly:true,verb:'bites',glow:.6},
  wmcrab:{name:'Amethyst Crab',hp:46,dmg:[5,8],hit:.82,w:1.5,img:'art_wm_crab',xp:17,gold:[0,0],speed:1,verb:'pinches'},
  wmspider:{name:'Lilac Spider',hp:42,dmg:[5,9],hit:.84,w:1.55,img:'art_wm_spider',xp:17,gold:[0,0],speed:1,verb:'bites'},
  wmcultist:{name:'Violet Cultist',hp:50,dmg:[5,9],hit:.84,w:.95,img:'art_wm_cultist',xp:20,gold:[10,60],speed:1,verb:'strikes',glow:.2},
  wmbeetle:{name:'Crystal Beetle',hp:56,dmg:[5,9],hit:.84,w:1.5,img:'art_wm_beetle',xp:20,gold:[0,0],speed:1,verb:'gores'},
  wmfungus:{name:'Fungus Walker',hp:54,dmg:[5,9],hit:.82,w:1.2,img:'art_wm_fungus',xp:20,gold:[0,0],speed:1,verb:'pummels'},
  wmwraith:{name:'Well-Wraith',hp:56,dmg:[6,10],hit:.86,w:1.15,img:'art_wm_wraith',xp:24,gold:[0,0],speed:1,verb:'rakes',glow:.7},
  wmgolem:{name:'Amethyst Golem',hp:64,dmg:[6,11],hit:.84,w:1.9,img:'art_wm_golem',xp:30,gold:[0,0],speed:1,verb:'crushes',glow:.15},
  wmmimic:{name:'Mimic',hp:60,dmg:[8,14],hit:.88,w:1.35,img:'art_wm_mimic',xp:35,gold:[40,160],speed:1,verb:'chomps'},
  wmwarden:{name:'The Well-Warden',hp:830,dmg:[5,8],hit:.9,w:3.2,img:'art_wm_warden',xp:600,gold:[0,0],speed:1,verb:'smashes',boss:true,glow:.5}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('wmwarden');
if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push('wmwarden');
if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.wmwarden=[5600,7200];
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^wmspider/,'poisoned',.3],[/^wmslime/,'poisoned',.15],[/^wmfungus/,'tomblung',.2],[/^wmwraith/,'shaken',.2],[/^wmbat/,'bleeding',.15],[/^wmcrab/,'bleeding',.12],[/^wmwarden$/,'shaken',.15]);
/* ---------- gear and finds ---------- */
ITEMDEF.wmkey1={n:'Violet Key',k:'quest',t:'Key',ic:'ore',c:'#a064e8',stack:1,price:0,sw:.2,d:'A heavy iron key with a violet stone in its bow. It fits the lock of the arched door that leads down from Under the Wenlock Well to the Violet Maze, and no other lock.'};
ITEMDEF.wmkey2={n:'Amethyst Key',k:'quest',t:'Key',ic:'ore',c:'#c488ff',stack:1,price:0,sw:.2,d:'A key cut from a single piece of amethyst. It fits the lock of the door that leads down from the Violet Maze to the Bell Vaults, and no other lock.'};
ITEMDEF.wmkey3={n:"Warden's Key",k:'quest',t:'Key',ic:'ore',c:'#e0b84a',stack:1,price:0,sw:.2,d:"A gold-bound key stamped with a bell. It fits the lock of the great door that leads down from the Bell Vaults to the Amethyst Deep, and no other lock."};
ITEMDEF.wmbarrel={n:'Weight Barrel',k:'quest',t:'Weight',ic:'ore',c:'#6a4a8a',stack:1,price:0,sw:.3,d:'A small barrel of sand with a weight mark burned in the lid: 25. The scale at the well shaft takes barrels and crates.'};
ITEMDEF.wmcrate={n:'Weight Crate',k:'quest',t:'Weight',ic:'ore',c:'#8a6a4a',stack:1,price:0,sw:.3,d:'A small crate of lead shot with a weight mark burned in the lid: 15. The scale at the well shaft takes barrels and crates.'};
ITEMDEF.wmheart={n:'Heart of the Well',k:'quest',t:'Prize',ic:'ore',c:'#d8a8ff',stack:1,price:0,sw:.3,d:'A glowing amethyst the size of a fist, taken from the pedestal in the Amethyst Deep. It was the first stone of the well, and it is warm.'};
ITEMDEF.wmblade={n:"Warden's Amethyst Edge",k:'weapon',t:'Sword',ic:'sword',c:'#b070f0',dmg:[390,470],hit:.2,req:{str:64},lvl:80,price:0,rar:1,eff:{daze:.2,bleed:[.3,6,40],bossdmg:.4},dbl:.18,sw:.46,d:'A blade of living amethyst, ground from the Well-Warden. One blow in five leaves the foe dazed, wounds bleed, and bosses take 40% more. Needs level 80.'};
ITEMDEF.wmplate={n:'Amethyst Warden Plate',k:'chest',t:'Chest',ic:'chest',c:'#9a58d8',armor:48,price:0,lvl:80,pas:{ward:18,regen:.5,dodge:.06},rar:1,gear:1,sw:.5,d:'A breastplate of violet crystal over dark iron, from the treasury of the Amethyst Deep. Enemies miss more, every blow is softened a little, and the wearer slowly mends.'};
ITEMDEF.wmring={n:'Violet Well Ring',k:'ring',t:'Ring',ic:'ring',c:'#a860e8',price:0,pas:{mpRegen:.5},int:4,hp:30,rar:1,sw:.1,d:'A ring of violet glass from the first diggers of the well. Adds 4 Intelligence and 30 health, and mana comes back well.'};
// pictures: the Edge is the greatsword picture recoloured violet; the plate and ring borrow the icons of the Swillhide Mantle and the ordinary ring, tinted
{const _gt=gearTintIcons;gearTintIcons=function(){
  _gt.apply(this,arguments);
  try{const tint=(srcNames,id,ST)=>{if(IMG['icn_'+id])return;const b=srcNames.map(n=>IMG['icn_'+n]).find(Boolean);if(!b)return;const c=document.createElement('canvas');c.width=b.width;c.height=b.height;const x=c.getContext('2d');x.drawImage(b,0,0);
      const im=x.getImageData(0,0,c.width,c.height),d=im.data;
      for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue;const v=Math.pow(Math.min(1,Math.max(0,((d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255-.02)*1.5)),.9);
        for(let k=1;k<ST.length;k++)if(v<=ST[k][0]||k===ST.length-1){const a=ST[k-1],q=ST[k],t=Math.min(1,(v-a[0])/(q[0]-a[0]));d[i]=a[1]+(q[1]-a[1])*t;d[i+1]=a[2]+(q[2]-a[2])*t;d[i+2]=a[3]+(q[3]-a[3])*t;break}}
      x.putImageData(im,0,0);IMG['icn_'+id]=c;IMG['ic_'+id]=c;IMG['it_'+id]=c};
    const VI=[[0,14,4,26],[.5,110,50,170],[.85,184,120,240],[1,240,214,255]];
    tint(['greatsword','claymore','sword'],'wmblade',VI);tint(['cuirass','brigandine','hauberk'],'wmplate',VI);tint(['eyering','ankhring','ring'],'wmring',VI);
    for(const id of ['wmkey1','wmkey2','wmkey3','wmbarrel','wmcrate','wmheart']){const o=IMG['icn_ore']||IMG['icn_gem_amethyst'];if(o&&!IMG['icn_'+id]){IMG['icn_'+id]=IMG['icn_gem_amethyst']||o;IMG['ic_'+id]=IMG['icn_'+id];IMG['it_'+id]=IMG['icn_'+id]}}
  }catch(e){console.error(e)}}}
