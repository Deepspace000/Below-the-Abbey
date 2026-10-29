/* ==========================================================================
   THE PALE SPIRE: CORE (package 6; prefix psp / PSP). Shared tables and the small helpers every builder calls. Read tools/PALE_SPIRE_PLAN.md and tools/PALE_SPIRE_NOTES.md.
   Order of files (see ORDER in tools/inject.py): ps_ids (numbers) ps_core (this) ps_kit (the level maker) ps_gate ps_court ps_halls ps_wings ps_dungeon (the five builders) ps_glue ps_maps ps_sound.
   WHAT THIS FILE GIVES YOU (signatures; all globals start with psp / PSP, ids as strings start with ps):
     pspF()                         the saved flags table G.flags.psp (always an object)
     pspPic(name)                   the decor / picture key 'ps_'+name, painted if assets/ps has it, else a stand-in made from existing pictures. Use the returned string as decor key `k` or as ENEMY_DEF img.
                                    Names are the keys of PSP_PICS below (st_*, col_*, c_<creatureId>, p_<person>, pt_*, ...). Ask for a name that is not in the table and you get a plain stand-in; add yours to the table.
     pspStand(name)                 makes the stand-in now (done for you by pspPic and by the loader)
     pspRegister(id, fn, opts)      KH_LAZY[id] = build lazily; fn(info) gets the PSP.LEVELS entry {id,name,W,H,lvl,kind,...} and builds LEVELS[id] (use pspMake in ps_kit.js); opts {names:{id:name}, rating:{id:n}}
     PSP_ITEMS[id]                  {n,d,k,t,ic,c,pkg,stack}: agreed item ids; the OWNER package defines ITEMDEF[id] itself, ps_glue only fills a gap if nobody did
     PSP_CREATURES[id]              [name, package, picture height in cells, stand-in sources]; define ENEMY_DEF[id] yourself with img:'ps_c_'+id and ph:<height> (w is then set from the picture)
   FROM ps_kit.js:  pspMake(plan)  pspPortal(C,link)  pspLockDoor(C,link)  pspFoe(C,type,x,y)  pspWander(C,type,x,y,loop,o)  pspStatueWake(C,type,x,y)  pspSafeZone(C,x,y,r)  pspRest(C,room)  (details in that file)
   ========================================================================== */
const pspF=()=>{const F=G.flags;return F.psp||(F.psp={})};
/* ---------- pictures: name -> [height in cells, [stand-in sources, first that exists], options]. The painted piece (assets/ps/<file>, listed in assets/ps/manifest.json) wins when it exists. ---------- */
const PSP_PICS={};
const PSP_CREATURES={};
{const P=(name,h,src,o)=>{PSP_PICS[name]=[h,src,o||{}]};
 /* S1 statues of the courtyard */
 P('st_mourners',2.4,['gy_angel','lpstatue']);P('st_chimera',2.0,['mw_statue','statue']);P('st_weepgiant',3.2,['wm_statue','statue','gy_angel'],{flip:1});P('st_hydra',2.6,['lpstatue','statue']);P('st_judge',2.6,['statue','mw_statue']);
 P('st_gargoyle',1.4,['gy_angel','statue'],{dark:1});P('st_headless',1.8,['mw_statue','statue'],{flip:1});P('st_hound',1.1,['gyi_hound','w_weatherhound'],{stone:1});P('st_veiled',2.0,['gy_angel','lpstatue'],{flip:1});
 P('st_hand',1.6,['gy_bones','gy_column'],{stone:1});P('st_bishop',2.4,['gy_angel','mw_statue']);P('st_fountain',3.4,['fountain','hgtb_deco_fountain','hgt_fountain']);
 /* S3 hall props */
 P('col_fluted',3.4,['ds_dpillar0','hg_pillar','gy_column']);P('col_twist',3.4,['ds_dpillar1','hg_pillar','gy_column']);P('col_silver',3.4,['hg_pillar','ds_dpillar0','gy_column']);
 P('table_long',1.1,['hgtb_furn_table_chairs','hgtb_table','kh_maptable1_0']);P('table_high',1.2,['hgtb_table','hgtb_furn_table_chairs']);P('chair_high',1.5,['kh_throne1_0','hl_p_throne']);
 P('chandelier',1.6,['hgtb_furn_chandelier','hgtb_furn_chandelier_lantern','gy_candles']);P('banner_violet',3.0,['hl_p_banner','mw_banner','hgtb_deco_banner']);P('hearth_cold',2.6,['hl_p_alcove','gy_niche']);
 P('throne',2.4,['hl_p_throne','kh_throne1_0']);P('candelabra_tall',2.0,['hpb_candelabra_4','wm_candelabra','gy_candles']);P('bed_four',2.6,['hgtb_furn_bed','hl_p_coffin']);P('dais_steps',.5,['gy_bench','gy_slab']);
 P('harpsichord',1.3,['kh_kgharp_0','hgtb_table']);P('suit_armour',2.0,['hl_p_armour','gy_vane']);
 /* S4 paintings (wall pictures in frames) */
 for(const [n,h] of [['pt_king',2.2],['pt_queen',2.2],['pt_prince',1.6],['pt_battle',2.0],['pt_hunt',2.0],['pt_feast',2.0],['pt_pale_lands',2.0],['pt_ancestors',1.8],['pt_empty',2.2],['pt_isaude',2.0],['pt_gallery8',1.6]])P(n,h,['hl_p_mirror','hl_p_window'],{frame:1});
 /* S5 service and dungeon props */
 P('cauldron_big',1.3,['ww_cauldron','hg_waxbarrel']);P('spit_hearth',2.0,['hl_p_alcove','gy_niche']);P('butcher_block',.9,['hgtb_table','gy_slab']);P('pans_hanging',1.0,['hl_p_rack','gy_candles']);P('barrels',.9,['wm_barrel','barrel','hpb_barrel_4']);
 P('oven',1.8,['hl_p_alcove','gy_niche']);P('cell_door',2.2,['gy_igate2','gy_igate']);P('chains',2.0,['hl_p_chains','wm_chain']);P('rack',1.6,['hl_p_rack','hl_p_chains']);P('iron_maiden',2.0,['gy_coffin','hl_p_coffin']);
 P('stocks',1.0,['hl_p_chains','gy_bench']);P('brazier',1.2,['gy_candles','hpb_candelabra_4']);P('valve_wheel',1.1,['gy_rune','gy_lever']);P('straw_bed',.45,['gy_bench','gy_slab']);P('shackled_skeleton',1.4,['gyi_skel','gy_bones']);
 P('cage',1.6,['hl_p_cage','gy_hatch']);P('bucket_well',.9,['gy_urn','ww_well']);
 /* S6 chapel and library */
 P('pews',1.0,['mi_pew','gy_bench']);P('altar',1.5,['mi_altar','gy_altar']);P('window_stained',3.2,['hl_p_window','gy_niche']);P('font',1.1,['mi_font','gy_urn']);P('reliquary_chest',.8,['gy_chest','chest']);
 P('lectern',1.3,['hl_p_lectern','mi_lectern','hg_lectern']);P('bookcase_tall',2.6,['hl_p_shelf']);P('reading_desk',1.0,['hl_p_desk']);P('globe',1.0,['hgtb_furn_books_globe']);P('scroll_rack',1.6,['hl_p_rack','hl_p_shelf']);
 for(const n of [1,2,3,4])P('st_saint'+n,2.2,['gy_angel','lpstatue','statue'],{flip:n%2});
 /* S9 gate and fronts (builder 1 paints these; the stand-ins keep the maps working) */
 P('gate_great',4.6,['gy_crypt','gy_lych']);P('barbican_front',4.0,['gy_crypt','gy_mausoleum']);P('gatehouse_front',4.0,['gy_crypt','gy_mausoleum']);P('castle_front_tiles',4.0,['gy_crypt','gy_mausoleum']);
 /* S7 people (living or ghosts); not tinted pale unless 'ghost' */
 for(const [n,s,g] of [['garrick','kh_ohfolk1_0'],['isaude','kh_ohfolk2_0'],['peck','kh_ohfolk3_0'],['sedge','kh_ohfolk4_0'],['calpurnia','kh_ohfolk5_0'],['harrow','kh_ohsold1_0'],['gaunt','kh_ohfolk6_0'],['stamford','kh_ohsold1_1'],['yseult','kh_ohfolk7_0'],
   ['porter','kh_ohfolk1_1'],['gardener','kh_ohfolk3_1'],['falconer','kh_ohfolk2_1',1],['chamberlain','kh_ohfolk4_1',1],['librarian','kh_ohfolk5_1',1],['courtier1','kh_ohfolk6_1',1],['courtier2','kh_ohfolk7_1',1],['courtier3','kh_ohfolk1_2',1],['courtier4','kh_ohfolk2_2',1],['courtier5','kh_ohfolk3_2',1],['courtier6','kh_ohfolk4_2',1]])
   P('p_'+n,1.7,[s,'kh_ohfolk1_0','gyi_pike'],g?{ghost:1}:{keep:1});
 /* S2 creatures: c_<id>. Sources are existing creature pictures; they are toned pale unless keep:1 */
 const CR=PSP_CREATURES;
 for(const [id,nm,pkg,h,src] of [
  ['psguard','Pale Guard',1,1.8,['gyi_pike','kh_ohsold1_0']],['pshalberd','Pale Halberdier',1,2.0,['gyi_vane','gyi_pike']],['psarcher','Pale Archer',1,1.7,['gyi_bmage','kh_ohsold1_0']],['pssentinel','Veiled Sentinel',1,2.1,['lpstatue','gy_angel']],['psgatecaptain','The Gate Captain',1,2.2,['gyi_aldric','gyi_vane']],
  ['psgargoyle','Stone Gargoyle',2,1.4,['gy_angel','gyi_raven']],['pschimera','Chimera Statue',2,2.0,['mw_statue','gyi_giant']],['pshydra','Hydra Statue',2,2.6,['statue','gyi_giant']],['psmourner','Weeping Mourner',2,2.2,['gyi_banshee','gy_angel']],['psjudge','Horned Judge',2,2.6,['gyi_giant','statue']],
  ['psmarblehound','Marble Hound',2,1.0,['gyi_hound']],['pshedger','Hollow Gardener',2,1.8,['gyi_zombie','kh_ohfolk3_0']],['psthornsprite','Thorn Sprite',2,.6,['gyi_rat','gyi_raven']],['psmoth','Pale Moth Swarm',2,.9,['gyi_raven','gyi_rats']],['psraven','Pale Raven',2,1.0,['gyi_raven']],
  ['psfalconer','The Falconer',2,1.8,['gyi_ghost0','ghost_0']],['pscolossus','The Weeping Colossus',2,3.4,['gyi_giant','wm_statue']],['psgargmother','Mother Gargoyle',2,2.2,['gy_angel','gyi_raven']],['psthornwarden','The Thorn Warden',2,3.0,['ww_oakface','gyi_giant']],
  ['psossian','Ossian the Mad Sculptor',2,1.9,['gyi_zombie','kh_ohfolk6_0']],['pshoundmaster','The Hound Master',2,1.9,['gyi_vane','gyi_pike']],
  ['psarmour','Hollow Suit of Armour',3,1.9,['hl_p_armour','gyi_pike']],['psservant','Pale Servant',3,1.7,['gyi_ghost1','gyi_zombie']],['pscourtier','Pale Courtier',3,1.8,['gyi_bmage','gyi_ghost2']],['psdancer','Whirling Dancer',3,1.8,['gyi_ghost2','gyi_banshee']],
  ['psfiend','Portrait Fiend',3,1.7,['gyi_shade','gyi_wraith']],['pscarver','Spectral Carver',3,1.9,['gyi_wraith','gyi_pike']],['psstairwarden','The Stair Warden',3,3.0,['gyi_aldric','gyi_vane']],['psantlered','The Antlered Lord',3,2.4,['gyi_grimsby','gyi_vane']],
  ['pscook','Pale Cook',4,1.8,['gyi_zombie','gyi_ghoul']],['pskrat','Kitchen Rat Swarm',4,.9,['gyi_rats','gyi_rat']],['psarmourer','Dead Armourer',4,1.9,['gyi_pike','gyi_zombie']],['psbakeghost','Baker Ghost',4,1.7,['gyi_ghost0','ghost_0']],
  ['psmonk','Pale Monk',4,1.8,['gyi_zombie','gyi_ghost1']],['pschorister','Pale Chorister',4,1.5,['gyi_banshee','gyi_ghost2']],['psbookwraith','Book Wraith',4,1.9,['gyi_wraith']],['psink','Ink Blot',4,.8,['gyi_rats','gyi_shade']],
  ['psteward','The Pale Steward',4,2.3,['gyi_wraith','gyi_vane']],['pssacristan','The Pale Sacristan',4,2.1,['gyi_ghost1','gyi_morwenna']],
  ['psturnkey','Pale Turnkey',5,1.9,['gyi_pike','gyi_zombie']],['psflayed','Flayed Prisoner',5,1.7,['gyi_ghoul','gyi_zombie']],['psshackle','Shackled Dead',5,1.8,['gyi_skel','gyi_zombie']],['psleech','Cistern Leech',5,1.0,['gyi_rats','gyi_ghoul']],
  ['psdrowned','Drowned Prisoner',5,1.7,['gyi_zombie','gyi_ghoul']],['pscellghost','Cell Ghost',5,1.6,['gyi_ghost2','gyi_ghost0']],['psbonecrawl','Bone Crawler',5,1.5,['gyi_skel','gyi_ghoul']],['psquestioner','The Questioner',5,2.1,['gyi_wraith','gyi_bmage']],
  ['psdrowngaoler','The Drowned Gaoler',5,2.6,['gyi_giant','gyi_zombie']],['pshunger','The Hunger in the Hole',5,3.4,['gyi_giant','gyi_ghoul']]]){
  PSP_PICS['c_'+id]=[h,src,{}];CR[id]=[nm,pkg,h,src]}
}
/* ---------- the items every package agrees on. The owner package defines ITEMDEF[id] (the fields below are what the plan says); ps_glue defines a plain one only if nobody did, so a test never meets a missing id. ---------- */
const PSP_ITEMS={
  pskey2:{n:'The Second Floor Key',pkg:4,k:'quest',t:'Key',ic:'key',c:'#d8d0e8',stack:1,d:'A tall silver key with a violet stone in the bow. It opens the three stair doors to the second floor of the Pale Spire.'},
  pshorn:{n:"The Warden's Horn",pkg:1,k:'quest',t:'Quest item',ic:'ore',c:'#c8c0a8',stack:1,d:'A battered horn on a cord, the horn of the last Road Warden. Captain Harrow in the dungeons would know it.'},
  pskeyring:{n:"The Gate Captain's Key Ring",pkg:1,k:'quest',t:'Quest item',ic:'key',c:'#c8c8d8',stack:1,d:'A heavy ring of keys taken from the Gate Captain. Merrick Dole the porter asked for it.'},
  pstoken:{n:"Pilgrim's Token",pkg:1,k:'quest',t:'Quest item',ic:'ring',c:'#c8c0b0',stack:1,d:'A small keepsake left at the cairn by a pilgrim who did not come back.'},
  psroses:{n:'Silver Rose',pkg:2,k:'quest',t:'Quest item',ic:'herb',c:'#e8e8f4',stack:1,d:'A rose with silver-white petals and a faint violet heart, cut from the Rose Garden of the Court of Statues.'},
  pschisel:{n:"Ossian's Chisel",pkg:2,k:'quest',t:'Quest item',ic:'dagger',c:'#b8b8c8',stack:1,d:"A sculptor's chisel, worn bright. Lady Ysmay's husband carved with it."},
  pspigment:{n:'Pigment Pot',pkg:3,k:'quest',t:'Quest item',ic:'potion',c:'#a890d0',stack:1,d:"A small clay pot of dry pigment from the painters' closet of the Gallery of Portraits."},
  pssignet:{n:"Isaude's Signet Ring",pkg:3,k:'quest',t:'Quest item',ic:'ring',c:'#d8c070',stack:1,d:"A gold signet ring cut with a heron. Lady Isaude Marwen hid it behind her own portrait."},
  psdawnwarden:{n:'Dawnwarden',pkg:4,k:'quest',t:'Quest item',ic:'sword',c:'#e0d8f0',stack:1,d:"Sir Edrik Stamford's sword, taken from him on the road. It hangs in the Armoury."},
  psladle:{n:"Peck's Ladle",pkg:4,k:'quest',t:'Quest item',ic:'dagger',c:'#b0b0b8',stack:1,d:"A long iron ladle with a worn handle. Ansel Peck the cook would like it back."},
  psstew:{n:'Pale Stew',pkg:4,k:'food',t:'Food',ic:'bread',c:'#e0e0ec',stack:1,d:'A bowl of thin, pale stew that is warm even when it has stood for hours. It restores health.'},
  psantidote:{n:'Pale Antidote',pkg:5,k:'potion',t:'Potion',ic:'potion',c:'#d0e8f0',stack:1,d:'A pale, bitter antidote made from silver roses.'}};
/* the table of every creature id: PSP_CREATURES is made above with the pictures */
/* ---------- pictures ---------- */
function pspRaw(name){const e=PSP_PICS[name];if(!e)return null;for(const s of e[1])if(IMG[s]&&IMG[s].width)return {k:s,im:IMG[s]};return null}
function pspStand(name){
  const key='ps_'+name;if(IMG[key])return key;const e=PSP_PICS[name]||[1.4,['gy_column','gy_urn'],{}],o=e[2]||{},r=pspRaw(name)||(()=>{for(const s of ['gy_column','gy_urn','gy_bench'])if(IMG[s]&&IMG[s].width)return {k:s,im:IMG[s]};return null})();
  if(!r)return key;
  const im=r.im,c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');
  try{x.filter=o.keep?'none':o.stone?'grayscale(.9) brightness(1.15) contrast(.95)':o.dark?'grayscale(.6) brightness(.8) contrast(1.1)':'grayscale(.55) brightness(1.2) contrast(.96)'}catch(err){}
  if(o.flip){x.translate(c.width,0);x.scale(-1,1)}
  x.drawImage(im,0,0);x.setTransform(1,0,0,1,0,0);x.filter='none';
  if(!o.keep){x.globalCompositeOperation='source-atop';x.fillStyle=o.ghost?'rgba(200,210,255,.34)':'rgba(190,186,232,.2)';x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='source-over'}
  IMG[key]=c;NPC_H[key]=e[0];IMG[key]._ps=1;return key}
function pspPic(name){const k='ps_'+name;if(!IMG[k])pspStand(name);if(NPC_H[k]===undefined&&PSP_PICS[name])NPC_H[k]=PSP_PICS[name][0];return IMG[k]?k:'gy_column'}
/* after the pictures are loaded: every name of the table gets its picture (painted or stand-in); creatures get their width from the picture and the height 'ph' */
function pspPics(){
  for(const n in PSP_PICS){try{pspPic(n)}catch(e){console.error('pspPic',n,e)}}
  for(const t in ENEMY_DEF){const d=ENEMY_DEF[t];if(d&&typeof d.img==='string'&&d.img.startsWith('ps_')&&IMG[d.img]){const h=d.ph||(PSP_CREATURES[t]&&PSP_CREATURES[t][2])||1.6,im=IMG[d.img];d.w=+(h*im.width/im.height).toFixed(2);if(NPC_H[d.img]===undefined)NPC_H[d.img]=h}}
  PSP.picsReady=true}
/* ---------- registering a level builder ---------- */
function pspRegister(id,fn,opts){
  opts=opts||{};const info=pspLevel(id);if(!info)throw new Error('pspRegister: id '+id+' is not in PSP.LEVELS');
  info.built=true;PSP.builders=PSP.builders||{};PSP.builders[id]=fn;
  LEVEL_NAMES[id]=info.name;LEVEL_RATING[id]=info.lvl;
  for(const k in opts.names||{})LEVEL_NAMES[k]=opts.names[k];
  for(const k in opts.rating||{})LEVEL_RATING[k]=opts.rating[k];
  KH_LAZY[id]=()=>{if(LEVELS[id])return LEVELS[id];const lv=fn(info)||LEVELS[id];return lv}}
