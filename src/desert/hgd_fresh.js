/* ==========================================================================
   FRESHWATER PACK for The Drowned Maze (prefix hgf / HGFW). Ten freshwater enemies, sixteen ambient fish pictures (two swim poses each),
   and the names of the two mossy wall pictures and two pond-floor pictures. Loaded after hgd_water.js; the level builder uses HGFW.
   ========================================================================== */
const HGFW={
  enemies:['hgfpiranha','hgfsnake','hgfscorpion','hgfspider','hgfleech','hgfbeetle','hgfcrayfish','hgfturtle','hgfcatfish','hgfbloodworm'],
  fish:['fw_carp','fw_perch','fw_trout','fw_goldfish','fw_bream','fw_pike','fw_tench','fw_minnows'],
  walls:['art_tex_hgdw_moss','art_tex_hgdw_moss2'],
  floors:['hgdwf','hgdwf2']};
Object.assign(ENEMY_DEF,{
  hgfpiranha:{name:'Giant Piranha',hp:200,dmg:[10,20],hit:.8,w:1.0,img:'art_hgfpiranha',xp:180,gold:[0,20],speed:2,verb:'tears at',aboveParty:0},
  hgfsnake:{name:'Marsh Water Snake',hp:260,dmg:[14,26],hit:.84,w:1.2,img:'art_hgfsnake',xp:240,gold:[0,25],speed:1,verb:'strikes',aboveParty:0},
  hgfscorpion:{name:'Water Scorpion',hp:300,dmg:[16,30],hit:.82,w:1.3,img:'art_hgfscorpion',xp:280,gold:[0,30],speed:1,verb:'stabs',aboveParty:0},
  hgfspider:{name:'Diving-Bell Spider',hp:340,dmg:[16,30],hit:.82,w:1.5,img:'art_hgfspider',xp:320,gold:[5,35],speed:1,verb:'bites',aboveParty:0},
  hgfleech:{name:'Giant Leech',hp:380,dmg:[14,28],hit:.78,w:1.4,img:'art_hgfleech',xp:300,gold:[0,20],speed:1,verb:'fastens on',aboveParty:0},
  hgfbeetle:{name:'Giant Water Beetle',hp:420,dmg:[18,32],hit:.84,w:1.5,img:'art_hgfbeetle',xp:360,gold:[5,40],speed:1,verb:'rends',aboveParty:0},
  hgfcrayfish:{name:'Mud Crayfish',hp:440,dmg:[20,32],hit:.84,w:1.6,img:'art_hgfcrayfish',xp:380,gold:[5,40],speed:1,verb:'pinches',aboveParty:0},
  hgfturtle:{name:'Snapping Turtle',hp:480,dmg:[22,32],hit:.86,w:1.8,img:'art_hgfturtle',xp:420,gold:[10,50],speed:.7,verb:'snaps at',aboveParty:0},
  hgfcatfish:{name:'Old Whiskers',hp:4200,dmg:[30,52],hit:.88,w:2.4,img:'art_hgfcatfish',xp:5200,gold:[300,700],speed:1,verb:'engulfs',boss:true,aboveParty:2},
  hgfbloodworm:{name:'Bloodworm',hp:320,dmg:[14,28],hit:.8,w:1.4,img:'art_hgfbloodworm',xp:260,gold:[0,20],speed:1,verb:'bores into',aboveParty:0}});
if(typeof NO_VARY!=='undefined')NO_VARY.push(...HGFW.enemies);
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^hgfsnake/,'stung',.3],[/^hgfscorpion/,'poisoned',.3],[/^hgfspider/,'poisoned',.25],[/^hgfleech/,'fever',.2],[/^hgfpiranha/,'bleeding',.3],[/^hgfbloodworm/,'bleeding',.2],[/^hgfcrayfish/,'bleeding',.15]);
// ambient fish: the underwater swimmers read IMG['uw_<k>_<frame>'] and NPC_H['uw_<k>_0']
{const H={fw_carp:.5,fw_perch:.38,fw_trout:.45,fw_goldfish:.3,fw_bream:.42,fw_pike:.6,fw_tench:.42,fw_minnows:.5};
for(const k of HGFW.fish){NPC_H['uw_'+k+'_0']=NPC_H['uw_'+k+'_1']=H[k]}}
function hgfAlias(){let n=0;for(const k of HGFW.fish)for(const f of [0,1]){const a=IMG['art_'+k+'_'+f];if(a){IMG['uw_'+k+'_'+f]=a;n++}}return n}
{hgfAlias();const t=setInterval(()=>{if(hgfAlias()>=16)clearInterval(t)},500);setTimeout(()=>clearInterval(t),120000)}
