/* ==========================================================================
   THE WITCH'S WOOD (called Blackbriar Wood in the game), pictures and wiring (level 520; prefix ww / WW). A small dark forest north of Wenlock where the witch Grisselda Blackbriar keeps her
   gingerbread cottage. All the pictures are painted (Gemini) and live in assets/ww, listed in ww_list.js (made by tools/ww_list.py from the manifest, cut by tools/ingest_ww.py):
   guardA, guardB (the creatures), witch (two poses), propsA (cauldron, oven, cages, totem, sign), propsB (stone, grave, toadstools, well, crow tree, bone charm), trees, bldg (bridge, iron gate),
   front (0 the chapel and 1 the cottage facades, seen straight on), tex (six seamless textures), smalls (a boot, a ribbon on a thorn, crumbs, rowan, a hag-stone, a gingerbread man).
   The pictures are loaded when Wenlock is built (its gate stands there) or when the wood is first needed (wwLoad). WWA: alias -> [picture, height in squares].
   Rooms: 520 the wood, 521 the cottage, 522 the cellar, 523 the kitchen. Notes: tools/WITCHWOOD_NOTES.md.
   ========================================================================== */
const WW={ID:520,COTTAGE:521,CELLAR:522,KITCHEN:523,W:55,H:55,ready:false,loading:null,tiles:{}};
const wwIs=n=>n===520||n===521||n===522||n===523;
const WWA={ // alias: [picture, height of the thing in squares (one square is about a person's height)]
  oakface:['trees_0',3.6],oakmoss:['trees_1',3.6],pine:['trees_2',4.0],willow:['trees_3',3.3],pine2:['trees_4',3.8],thorn:['trees_5',3.0],
  stone:['propsB_0',1.7],grave:['propsB_1',1.0],ring:['propsB_2',.42],well:['propsB_3',1.3],stump:['propsB_4',1.9],charm:['propsB_5',1.15],
  cauldron:['propsA_0',.95],oven:['propsA_1',2.0],cagefull:['propsA_2',1.5],cageempty:['propsA_3',1.5],totem:['propsA_4',1.9],sign:['propsA_5',1.35],
  bridge:['bldg_2',.62],boot:['smalls_0',.28],ribbon:['smalls_1',.7],crumbs:['smalls_2',.22],rowan:['smalls_3',.9],hagstone:['smalls_4',.3],gingerman:['smalls_5',.4],
  wisp:['guardB_3',.8],crowtree:['propsB_4',1.9]};
const WW_ALIAS_EXTRA={};
/* ---- loading the pictures ---- */
function wwLoad(){
  if(WW.loading)return WW.loading;
  WW.loading=new Promise(res=>{
    const jobs=Object.keys(typeof WW_LIST!=='undefined'?WW_LIST:{}).map(k=>[k,'assets/ww/'+WW_LIST[k][0]]);
    let left=jobs.length;if(!left){WW.ready=true;res();return}
    const done=()=>{if(--left<=0){try{wwAlias()}catch(e){console.error(e)}WW.ready=true;res()}};
    for(const [k,src] of jobs){if(IMG[k]){done();continue}const i=new Image();i.onload=()=>{IMG[k]=i;done()};i.onerror=()=>done();i.src=src+'?v='+(typeof VERSION!=='undefined'?VERSION:'')}
  });
  return WW.loading;
}
/* every alias gets its own key in IMG (decor k is 'ww_<alias>') and its height; the creatures their picture keys */
function wwAlias(){
  for(const a in WWA){const [n,h]=WWA[a];if(IMG[n]){IMG['ww_'+a]=IMG[n];NPC_H['ww_'+a]=h}}
  for(const [k,n] of [['wwi_scare','guardA_0'],['wwi_hound','guardA_1'],['wwi_spider','guardA_2'],['wwi_golem','guardA_3'],['wwi_crows','guardA_4'],['wwi_toad','guardA_5'],['wwi_revenant','guardB_0'],['wwi_root','guardB_1'],['wwi_abom','guardB_2'],['wwi_wisp','guardB_3'],['wwi_crow','guardB_4'],['wwi_witch','witch_1'],['wwi_witchA','witch_0']])if(IMG[n])IMG[k]=IMG[n];
  NPC_H.wwi_witch=2.7;NPC_H.wwi_witchA=2.6;
  wwFloors();
}
/* the ground: six pictures, brightened (the originals are very dark), as floors */
const WW_FLOORSET=['wwf_moss','wwf_leaf','wwf_dirt','wwf_brook','wwf_grave','wwf_board'];
function wwFloors(){
  if(WW._floors)return;
  const mk=(nm,key,gain,tint)=>{const im=IMG[key];if(!im||FLOORS[nm])return;const base=dsPaintedTex(im),d=new Uint8ClampedArray(base.length);
    for(let i=0;i<d.length;i+=4){const l=(base[i]+base[i+1]+base[i+2])/3,k=tint.sat===undefined?1:tint.sat;d[i]=(l+(base[i]-l)*k)*gain*tint.r;d[i+1]=(l+(base[i+1]-l)*k)*gain*tint.g;d[i+2]=(l+(base[i+2]-l)*k)*gain*tint.b;d[i+3]=255}FLOORS[nm]=d};
  mk('wwf_moss','tex_1',2.3,{r:.95,g:1.05,b:.9});mk('wwf_leaf','tex_2',2.1,{r:1.02,g:.95,b:.88});mk('wwf_dirt','tex_5',2.1,{r:1.05,g:1,b:.9});
  mk('wwf_brook','tex_5',2.7,{r:1.1,g:1.04,b:.92,sat:.4});mk('wwf_grave','tex_3',1.9,{r:.9,g:1,b:.95});mk('wwf_board','tex_0',1.7,{r:1.15,g:.95,b:.75});
  const fb={wwf_moss:'lush',wwf_leaf:'dirt',wwf_dirt:'dirt',wwf_brook:'dirt',wwf_grave:'mosscobble',wwf_board:'cobble'};
  for(const nm of WW_FLOORSET)if(!FLOORS[nm])FLOORS[nm]=FLOORS[fb[nm]]||FLOORS.cobble;
  WW._floors=1;
}
/* ---- wall tiles: a painted texture stood up into a tall tile (stacked, each copy slid sideways), or one slice of a big front picture (the cottage, the chapel, the gate) ---- */
function wwTile(tex,wh,opt){
  opt=opt||{};const key=tex+'|'+wh+'|'+(opt.fac?opt.fac.img+opt.fac.i+'/'+opt.fac.n:'')+(opt.rgb?opt.rgb.join(','):'')+(opt.gain||'');if(WW.tiles[key]!==undefined)return WW.tiles[key];
  const im=IMG[tex],Hp=Math.round(128*wh),c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');
  x.fillStyle='#0f1a12';x.fillRect(0,0,128,Hp);
  if(im){const units=Math.ceil(wh);for(let u=0;u<units;u++){const y=Hp-(u+1)*128,sh=((u*.37+(tex.length%5)*.11)%1)*128;
      x.save();if(u%2){x.translate(128,0);x.scale(-1,1)}for(const dx of [-sh,128-sh])x.drawImage(im,0,0,im.width,im.height,dx,y,128,128);x.restore()}}
  if(opt.fac){const f=IMG[opt.fac.img];if(f){const n=opt.fac.n,i=opt.fac.i,s=n*128/f.width,fh=f.height*s,sw=f.width/n;x.drawImage(f,i*sw,0,sw,f.height,0,Hp-fh,128,fh)}}
  // light: a little brighter high up, the dark foot where the wall meets the ground
  x.globalCompositeOperation='multiply';const gr=x.createLinearGradient(0,0,0,Hp);gr.addColorStop(0,'rgb(255,255,255)');gr.addColorStop(.7,'rgb(235,240,235)');gr.addColorStop(1,'rgb(170,176,170)');x.fillStyle=gr;x.fillRect(0,0,128,Hp);x.globalCompositeOperation='source-over';
  const d=x.getImageData(0,0,128,Hp).data,gain=opt.gain||(opt.fac?1.18:2.5),m=opt.rgb||[1,1,1];
  for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,d[i]*gain*m[0]*(opt.fac?1:.95));d[i+1]=Math.min(255,d[i+1]*gain*m[1]);d[i+2]=Math.min(255,d[i+2]*gain*m[2]*(opt.fac?1:.9))}
  const id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;
  {let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=4*37){r+=d[i];g+=d[i+1];b+=d[i+2];n++}(WW.col=WW.col||{})[gid]=[r/n|0,g/n|0,b/n|0]}
  return WW.tiles[key]=gid}
/* ---- the creatures: level 82 guardians, the nastier ones nearer the cottage. w is the width in squares worked out from the picture and the height wanted ---- */
function wwW(img,h){const e=typeof WW_LIST!=='undefined'&&WW_LIST[img];return e?+(h*e[1]/e[2]).toFixed(2):h*.7}
Object.assign(ENEMY_DEF,{
  wwscare:{name:'Twisted Scarecrow',hp:260,dmg:[14,24],hit:.84,w:wwW('guardA_0',2.0),img:'wwi_scare',xp:1050,gold:[0,0],speed:1,verb:'rakes',aboveParty:0,ww:1,still:1,wake:'The scarecrow lurches off its pole with a sound like a hundred dry twigs.'},
  wwhound:{name:'Hag-bound Hound',hp:210,dmg:[13,22],hit:.85,w:wwW('guardA_1',1.0),img:'wwi_hound',xp:950,gold:[0,0],speed:2,verb:'tears at',aboveParty:0,ww:1},
  wwspider:{name:'Manface Spider',hp:300,dmg:[15,26],hit:.84,w:wwW('guardA_2',.95),img:'wwi_spider',xp:1150,gold:[0,10],speed:1,verb:'bites',aboveParty:0,ww:1,wake:'A pale old face turns slowly in the web, and smiles with all of its legs.'},
  wwtoad:{name:'Bloated Toad-thing',hp:400,dmg:[16,28],hit:.82,w:wwW('guardA_5',1.35),img:'wwi_toad',xp:1250,gold:[0,10],speed:1,verb:'slimes',aboveParty:0,ww:1},
  wwgolem:{name:'Rag-and-Bone Golem',hp:440,dmg:[17,30],hit:.84,w:wwW('guardA_3',2.1),img:'wwi_golem',xp:1450,gold:[0,0],speed:1,verb:'bludgeons',aboveParty:0,ww:1,still:1,wake:'The heap of bones and rags stands up and clatters towards you.'},
  wwcrows:{name:'Crow Swarm',hp:170,dmg:[11,19],hit:.86,w:wwW('guardA_4',1.5),img:'wwi_crows',xp:850,gold:[0,0],speed:2,fly:true,floatH:.2,verb:'pecks at',aboveParty:0,ww:1,wake:'The dead tree explodes into a screaming cloud of crows.'},
  wwrevenant:{name:'Hanged Revenant',hp:340,dmg:[16,28],hit:.84,w:wwW('guardB_0',2.3),img:'wwi_revenant',xp:1350,gold:[0,0],speed:1,verb:'chokes',aboveParty:0,ww:1,still:1,wake:'The rope creaks. The hanged man opens his eyes, and they are green.'},
  wwroot:{name:'Root-horror',hp:520,dmg:[18,31],hit:.84,w:wwW('guardB_1',2.2),img:'wwi_root',xp:1700,gold:[0,0],speed:1,verb:'crushes',aboveParty:0,ww:1,still:1,wake:'The roots heave out of the ground, and something inside the knot-hole screams.'},
  wwabom:{name:'The Flesh-Pile',hp:420,dmg:[20,34],hit:.86,w:wwW('guardB_2',1.8),img:'wwi_abom',xp:4200,gold:[100,300],speed:1,verb:'smothers',boss:true,aboveParty:1,ww:1,wake:'The heap of stitched things shudders, and every one of its eyes opens at once.'},
  wwwisp:{name:'Hag-light',hp:130,dmg:[10,17],hit:.87,w:wwW('guardB_3',.9),img:'wwi_wisp',xp:800,gold:[0,0],speed:2,fly:true,floatH:.35,verb:'scorches',aboveParty:0,ww:1,wake:'A pale green light drifts out of the fog, and sighs.'},
  wwcrow:{name:'Carrion Crow',hp:240,dmg:[13,22],hit:.86,w:wwW('guardB_4',1.25),img:'wwi_crow',xp:950,gold:[0,0],speed:2,fly:true,floatH:.1,verb:'stabs',aboveParty:0,ww:1},
  wwwitch:{name:'Grisselda Blackbriar',hp:800,dmg:[24,38],hit:.88,w:wwW('witch_1',2.7),img:'wwi_witch',xp:9000,gold:[300,900],speed:1,verb:'rakes',boss:true,aboveParty:2,ww:1,ranged:4,shot:'a bolt of green fire',act:e=>wwWitchAct(e)}
});
if(typeof NO_VARY!=='undefined')NO_VARY.push('wwwitch','wwabom');
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^wwspider/,'poisoned',.3],[/^wwtoad/,'foodpoison',.2],[/^wwroot/,'bleeding',.25],[/^wwrevenant/,'haunted',.25],[/^wwcrow/,'bleeding',.15],[/^wwwisp/,'cursed',.1],[/^wwwitch/,'cursed',.15],[/^wwabom/,'foodpoison',.2]);
/* a new affliction: blinded by the witch (the party fights with its eyes full of green smoke) */
if(typeof AFFL!=='undefined'&&!AFFL.hagblind){AFFL.hagblind={n:'Hag-blinded',kind:'bad',fx:{dex:-4,int:-2},col:'#9ad060',text:'Green smoke in the eyes. Everything has a halo, the floor is not where it was, and every sword swing finds air.',src:'A curse from Grisselda Blackbriar, the witch of the wood.',cure:'Rest, or wash the eyes with a cleansing salve.',rest:1,cureItem:['salve'],healer:1};if(typeof AFFL_ORDER!=='undefined'&&!AFFL_ORDER.includes('hagblind'))AFFL_ORDER.push('hagblind')}
/* ---- the wood is built only when its pictures are here: doors, the jump and the saved game wait for them ---- */
{const _g=goToLevel;goToLevel=function(n,entry){
  if(wwIs(n)&&!WW.ready&&!WW._wait){WW._wait=1;wwLoad().then(()=>{WW._wait=0;goToLevel(n,entry)});return}
  if(wwIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error(e)}
  return _g.call(this,n,entry)}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(wwIs(n)&&!WW.ready&&!WW._wait){WW._wait=1;wwLoad().then(()=>{WW._wait=0;jumpToLevel(n,target)});return}
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&wwIs(sv.level)&&!WW.ready&&!WW._wait){WW._wait=1;wwLoad().then(()=>{WW._wait=0;restore(sv)});return}
  return _r.apply(this,arguments)}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||wwIs(n)}}
/* Wenlock's own loader also loads the wood's pictures, so that the gate in Wenlock can be painted when the town is built */
{const _wl=wlLoad;wlLoad=function(){if(WW._both)return WW._both;return WW._both=Promise.resolve(_wl.apply(this,arguments)).then(()=>wwLoad())}}
/* fog: the wood lives under a thick, cold, green-grey murk; the party sees a few squares and creatures alert late (ambushers in the fog) */
{const _w=weatherNow;weatherNow=function(){
  if(LEVEL===WW.ID)return {id:'fog',n:'Murk',fog:.125,haze:.9,dark:.7,mix:.9,col:[30,46,36],text:'A thick, cold murk lies between the trees. The view is a few squares, and things stand very close before they are seen.'};
  if(wwIs(LEVEL))return null;
  return _w.apply(this,arguments)}}
