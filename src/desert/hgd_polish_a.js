/* ==========================================================================
   DEEPER HOLLOW POLISH, FIRST HALF (prefix hgpa / HGPA), ROUND 2: patches the BUILT level 475 after every other builder has run.
   Zone: the first twelve precincts (biomes 0 to 3: the Hedge Maze, the Stone Warrens, the Honeycomb Reach, the Shell Galleries).
   SCALE (the scheme for the whole zone): a picture's height in squares is NPC_H[k] * sc. The walls of the maze are 2.7 high (ceilH). A villager is 0.9 to 0.98,
   a door or gate 1.15, a statue 1.3 to 1.6, a lamp post 1.3, a plinth 0.65, a table, chest, bench or crate 0.35 to 0.5, a house 2.2, trees by size class 1.6 / 2.0 / 2.4 / 2.7,
   shell flowers 1.1 to 1.3, ordinary vermin about 1.0, bosses 1.9 and mini bosses 1.7 to 1.8 (a boss is always taller than its guards).
   - proportions are set from one table (hgpaScale), after the identical-neighbour swap
   - light: every corner of the four biomes is within a few squares of a real, coloured light with a prop to match (teal and violet crystals and fungus in the Stone Warrens,
     garden lamps and glow mushrooms in the hedge, honey lamps in the honeycomb, pearl lamps in the shells); the pools are real lights (see setupLights below)
   - twelve vignettes, one per precinct, each with its OWN props, light colour, wall note and reward
   - every wall note has its own text (no duplicates, none blank), at its own height; the odd floor patches that looked like flat coloured rectangles are smoothed
   - hg_house2 (a bare white slab) is swapped for the painted houses, boss and mini boss sizes are fixed, dead ends are dressed with kits that differ from each other
   Nothing quest related is moved: decor is re-skinned in place and new things are appended. Deterministic. Exposes L._hgpa for testing.
   ========================================================================== */
const HGPA_ALIAS={hpa_barrel:['art_wm_barrel',.55],hpa_cask:['art_wm_cask',.46],hpa_crate:['art_wm_crate',.5],hpa_skel:['art_dskeleton',.85],
  hpa_table:['art_hgtb_table',.55],hpa_chair:['art_hgtb_chair',.5],hpa_vase:['art_vase0',.5],hpa_candle:['hl_p_candle',.5],
  hpa_post:['art_hgt_gardenlantern',1.15],hpa_lamp:['art_wm_lantern_gold',.4],hpa_sacks:['sacks',.5],hpa_sack:['sack2',.38],hpa_cage:['art_wm_cage_lantern',.45],hg_npc2:['hg_npc6',1.3],
  // round 2: props that belong to one vignette
  hpa_tools:['wm_tools',.55],hpa_bucket:['wm_bucket',.36],hpa_bench:['hgtb_bench',.5],hpa_ribbon:['hgt_banner',1.15],hpa_glamp:['hgt_gardenlantern',.9],hpa_rack:['hl_p_rack',.42],hpa_web:['wm_web',.9],
  hpa_bones:['hgxprop0',.3],hpa_ctable:['hl_p_candle',.62],hpa_arch:['hg_arch',1.3],hpa_stonecart:['wm_mine_cart',.55],hpa_coldfire:['brazier0',.5],hpa_bedroll:['hgtb_furn_bed',.5],
  hpa_skelsit:['hpb_skel',.55],hpa_waxbarrel:['hg_waxbarrel',.6],hpa_jar:['hg_jar',.6],hpa_eggs:['hg_eggs',.85],hpa_wguard:['w_candleknight',.9],hpa_chestwax:['hg_chestwax',.4],
  hpa_bulb:['wm_mush_bulb',.8],hpa_bunk:['hgtb_furn_bunk',.75],hpa_globe:['hgtb_furn_books_globe',.55],hpa_shells:['yar_shells',.28],hpa_pplinth:['hgtb_deco_pearlplinth',.7],
  hpa_bell:['hpb_bell',.55],hpa_gold:['hpb_gold',.32],hpa_pots:['yar_pots',.5],hpa_lid:['hpb_lid',.45],hpa_keg:['hpb_keg',.5],
  // round 2: the light sources
  hpa_crysT:['wm_crystal_teal',.8],hpa_crysV:['wm_crystal_small',.7],hpa_crysTall:['wm_crystal_tall',1.1],hpa_crysW:['wm_crystal_white',.9],hpa_crysP:['wm_crystal_pillar',1.1],
  hpa_mushC:['wm_mush_cluster',.6],hpa_mushT:['wm_mush_tall',.95],hpa_brazier:['wm_brazier',.85],hpa_glow:['hgtb_plant_glowshrooms',.7],hpa_lampT:['hgtb_lamp_tall',1.3],hpa_lampS:['hgtb_lamp_short',1],
  hpa_lampV:['hgtb_lamp_vine',1.2],hpa_lampost:['hgt_lamppost',1.3]};
for(const k in HGPA_ALIAS)NPC_H[k]=HGPA_ALIAS[k][1];
function hgpaAlias(){for(const k in HGPA_ALIAS){if(!IMG[k]){const s=IMG[HGPA_ALIAS[k][0]];if(s)IMG[k]=s}}}
{const _u=update;update=function(dt){try{if(LEVEL===HGD.ID)hgpaAlias()}catch(e){}return _u.apply(this,arguments)}}
// creature sizes (the drawn width gives the height: height = w * picture height / picture width). Ordinary vermin about 1.0, mini bosses 1.7 to 1.8, bosses 1.9.
const HGPA_ENEMY=[['hgdguard',245/380,1.0],['hgdbug',446/400,1.0],['hgdworm',214/200,.95],['hgdjelly',146/200,.95],['hgmcricket',479/480,1.0],['hgmtoad',663/480,.98],
  ['hgdb_spider',289/200,1.9],['hgdb_beetle',316/200,1.9],['hgmini2',328/420,1.8],['hgmini3',330/420,1.7],['hgmini4',323/420,1.8]];
function hgpaEnemies(){for(const [k,asp,h] of HGPA_ENEMY)if(ENEMY_DEF[k]){ENEMY_DEF[k].w=Math.round(h*asp*100)/100;ENEMY_DEF[k]._pa2=1}}
// one scratched note: the text lives on the decor
khNpc('hgd_pa_note','A scratched note','hl_p_note',()=>{const d=G.talk&&G.talk.d;return say(hgdSay((d&&d.text)||'The writing has worn away.'),[BYE])});
// the twelve vignettes, in the order of the precincts (HGDMP.names): props are [alias, far, side] (far = towards the end wall, side = across the corridor); lc = [colour, strength, range squared] of the vignette's own light
const HGPA_VIG=[
 {nm:'The Gardener\'s Rest',p:[['hpa_tools',.32,-.24],['hpa_bucket',.28,.26],['hpa_bench',-.12,.3]],lc:[[1,.82,.48],1.2,60],it:'potion3',t:'Tobin the hedge-clipper sat down here to rest in the spring. He meant to finish the south row after supper. The hedge finished first.'},
 {nm:'The Ribbon Corner',p:[['hpa_ribbon',.36,-.2],['hpa_vase',.3,.24],['hpa_glamp',-.1,.3]],lc:[[1,.7,.85],1.15,56],it:'hgcomb',t:'A faded ribbon is tied to the branch. Every year someone ties a new one beside it. Nobody in Hedgefoot will say whose they are.'},
 {nm:'The Thorn Barricade',p:[['hpa_rack',.34,.0],['hpa_crate',.2,-.27],['hpa_web',.4,.0],['hpa_bones',-.05,.25]],lc:[[.6,1,.55],1.1,56],it:'greatermana',t:'We stacked the crates here to hold the thorns back. The thorns did not mind the crates. Go back the way you came.'},
 {nm:'The Tally Wall',p:[['hpa_ctable',.3,.22],['hpa_chair',.05,-.26],['hpa_sack',-.12,.3]],lc:[[1,.72,.38],1.25,56],it:'potion3',t:'Carved into the wall: Two hundred and eleven scratches, in rows of five. Then the scratches stop, and one clean line runs across all of them.'},
 {nm:'The Unfinished Arch',p:[['hpa_arch',.36,.0],['hpa_stonecart',.1,.28],['hpa_barrel',.28,-.3]],lc:[[.75,.9,1],1.2,60],it:'hgjelly',t:'The mason left his tools and his lunch on the ledge. The lunch is long gone to dust. Nothing has been taken, and nothing has been finished.'},
 {nm:'The Cold Camp',p:[['hpa_coldfire',.12,.0],['hpa_bedroll',.36,-.22],['hpa_skelsit',.3,.26],['hpa_sacks',-.1,-.3]],lc:[[1,.55,.25],1.1,50],it:'greatermana',t:'A bedroll, a cold fire, a diary. The last page says: I can hear the walls humming the song my mother used to sing. I am going to listen a little closer.'},
 {nm:'The Beekeeper\'s Lantern',p:[['hpa_post',.36,.0],['hpa_waxbarrel',.3,-.26],['hpa_jar',.3,.27]],lc:[[1,.7,.24],1.45,64],it:'hgcomb',t:'Honey for the lamp and wax for the wick. Mind the floor here. It is sweet, and it is not always honey.'},
 {nm:'The Drone\'s Vigil',p:[['hpa_wguard',.32,.0],['hpa_chestwax',.14,.26],['hpa_lamp',.28,-.3]],lc:[[1,.86,.35],1.2,56],it:'potion3',t:'Even the guards of the comb grow old. This one stood so long the wax grew over his boots. He has not been relieved.'},
 {nm:'The Nursery Door',p:[['hpa_eggs',.34,-.2],['hpa_bunk',.3,.24],['hpa_bulb',-.1,.3]],lc:[[1,.66,.5],1.2,60],it:'hgjelly',t:'It is quiet here. The cells are shut and warm. Whatever sleeps in them has not been told it is time.'},
 {nm:'The Shell Collector',p:[['hpa_globe',.32,.2],['hpa_shells',.12,-.22],['hpa_bench',.3,-.3]],lc:[[.7,1,.95],1.2,60],it:'hgpond',t:'I came for one perfect shell. This is the fortieth, and it is still not perfect. I will stay a little longer.'},
 {nm:'The Drowned Shrine',p:[['hpa_pplinth',.36,.0],['hpa_bell',.2,-.28],['hpa_crysT',.2,.28]],lc:[[.45,.95,1],1.35,64],it:'greatermana',t:'The tide has not come here in a hundred years, yet the floor is always damp. Leave a coin or leave a word. Do not leave nothing.'},
 {nm:'The Pearl Thief\'s Stash',p:[['hpa_gold',.3,-.2],['hpa_pots',.34,.22],['hpa_lid',.1,.28]],lc:[[.85,.65,1],1.2,56],it:'potion3',t:'I hid my pearls under the third tile. Whoever you are, the third tile is loose and the pearls are paste. I knew you would look.'}];
// wall notes of the dead ends: each is used once (sixty of them). The first word tells how it was written, so the sign painter can choose a fitting board.
const HGPA_NOTES=['Scratched: We took turns at the lamp. Then there was only one of us to take a turn.','Chalked: The left way is shorter. The right way is kinder.','A scrap of cloth: If you find my boot, keep it. I will not be needing the other.','Carved: Water here, three days behind me. Do not drink the second pool.','Scratched: I heard footsteps behind me for an hour. They stopped when I stopped. They are still there.','Chalked: Rested here. Nothing came. I mean to say so in the towns, and nobody will believe me.','Written small: Counted forty turns since the last sign. Turned back at forty-one.','Scratched: Dear Mara, I have found the middle. It is smaller than we thought.','Chalked: The wall is warm on this side. I did not look at the other side.','Carved: Someone has been here before me and left the lamp lit. I thank them. I do not see them.','A note, pinned: Sorry about the mess. I was in a hurry to leave.','Scratched: Good ground for a camp, if you like the sound of the dripping. I have stopped hearing it.','Chalked: Brother, if you read this, go home. I mean it kindly.','Carved: The roots push the stones out every spring. By autumn the maze is a little different.','Scratched: Quiet. Too quiet for the Hollow. I went the other way.','A child\'s hand: I WAS HERE AND IT WAS FINE.','Chalked: Two ways out. I took the one that did not smell of honey.','Scratched: A gold coin under the loose stone. I put it back. It looked at me.','Written in charcoal: Turn back, or at least turn on the lamp.','Carved: I do not know where I am, but I have never been so sure of the way.','Scratched: The hedge grew a hand\'s width while I wrote this.','Chalked: Shells under the lamp, a candle in the dust. Somebody lived here, and not so long ago.','A note: The treasure is not here. I looked. Do not look again.','Scratched: The pearls in the wall are real. The wall wants them back.','Chalked: I buried my sword here. The maze has taken enough of it already.','Carved: My name is Pell. I was a tinker. If you find the cart, it is yours.','Scratched: The air changes here, a little sweeter, a little colder. Go slowly.','Chalked: Stopped here to mend my boot. Lost an hour. Lost the way. Found this note instead.','Written small: The dead end is not the end. Nor is it the way.','Scratched: One more turn, I said. One more turn.',
 'Chalked: Ate my last biscuit at this corner. It was a good biscuit. I mean to mention it to the baker.','Scratched: The crystals hum when you are afraid. I have been humming back for an hour.','Carved: Here ends the Mason\'s Ward, and here begins the part nobody mapped.','A torn page: Day nine. The lantern oil is low and the walls are not. I am thinking of building a door.','Chalked: If a wasp asks, I was never here.','Scratched: Left a loaf for whoever follows. Left it on the high ledge, for the rats are tall here.','Written small: I measured the corridor with my arms. It is longer going back.','Carved: For Anselm, who said the hedge would never grow this high. It has. Come and look.','Chalked in green: Moss on the north side. Moss on every side. Useless as a compass.','Scratched: The honey on the wall is warm. Please do not lick the honey.','A scrap of cloth: Whoever finds this, tell my wife I got as far as the shells.','Chalked: A good place to cry, and I have done so. Thank you, corner.','Scratched: There is a draught from the wall. There is no door. There is a draught.','Carved: Eleven steps from here to the lamp, and every one of them uphill. I do not know how.','Written in charcoal: The glowing mushrooms are not food. I have been sick twice to be sure.','Chalked: I named this corner Mildred. She has been a good listener.','Scratched: Someone sang here once. The walls still know the tune.','A note: Lost two days to a wrong turn, found a spoon. A fair trade.','Chalked: Do not trust a corridor that is straight for more than thirty paces.','Carved: In the year of the second flood the pearls came up through the floor. Not all of them went back.','Scratched: My candle burned down here. I sat in the dark and counted to a thousand. Then I counted again.','Chalked: The dead end has a draught that smells of rain. I would go back to the rain.','Written small: I left my map here, with the wrong turns marked. You are welcome.','Scratched: The lamp is not mine. I lit it anyway. It seemed rude not to.','A child\'s hand: MY DAD SAYS THE WAY OUT IS UP. WE WENT DOWN.','Carved: Nine hundred paces from the arch and the arch was not worth it.','Chalked: A stone fell behind me and the corridor shut. I opened it again with a spoon. Do not ask.','Scratched: There are no bees here now. There is only the sound of them.','Written in charcoal: I was brave until the third corridor.','Chalked: Rest your feet. Whatever comes next will want them.'];
// replacement lines for the wall notes of the original maze that repeat each other or are blank (each used once, none repeats any other note)
const HGPA_POOL=['Scratched: The hedge here is older than the maze. Trust the hedge.','Chalked: Slow here. The slug on the left wall is faster than it looks.','Carved: There is a way round, and it is the long way, and it is worth it.','Scratched: The floor remembers footsteps. Mine are the small ones.','Chalked: I came in at dawn and it is dawn again. I have not slept.','Written small: Hedge, then stone, then wax, then shell. In that order. Do not skip.','Scratched: Somebody has trimmed this corner very neatly. Nobody has been here.','Chalked: The wasps keep to the left side. So should you.','Carved: A shortcut, once. The hedge has changed its mind.','Scratched: If the corridor smells of honey, you are walking the right way. If it smells of smoke, run.','Chalked: The easy way is behind you. I was going to say something wise about that.','Written in charcoal: Water on the left, moss on the right, and a slug that has not moved since I arrived.'];
function hgpaBuild(L){
  if(L._hgpa)return;const T0=performance.now(),M=L._hgdm,W=M.W,H=M.H,bio=M.bio,rows=L.rows,rnd=hgdmRng(475910),ZB=4,N=W*H;
  const inZ=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&bio[y*W+x]<ZB;
  const isWallC=c=>!!c&&c!=='.'&&c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8;
  const pass=(x,y)=>{const c=rows[y]&&rows[y][x];return !!c&&c!=='#'&&!isWallC(c)},open=(x,y)=>(rows[y]&&rows[y][x])==='.';
  const DV=[[0,-1],[1,0],[0,1],[-1,0]],nOpen=(x,y)=>{let n=0;for(const [a,b] of DV)if(pass(x+a,y+b))n++;return n};
  const med=a=>{a=a.slice().sort((p,q)=>p-q);return a.length?a[a.length>>1]:0};
  const hs=(x,y,s)=>{let h=(Math.imul(x+1,374761393)+Math.imul(y+1,668265263)+Math.imul(s+7,2147483647))>>>0;h=Math.imul(h^(h>>>13),1274126177)>>>0;return((h^(h>>>16))>>>0)/4294967296};
  const stat={reskin:0,clamped:0,chests:0,gates:0,vig:0,notes:0,lamps:0,deadItems:0,deadNotes:0,scaled:0,house:0,patches:0,thinned:0,lights:0,kits:0,notesFixed:0};
  const LT=[]; // lights of this zone: [x, y, colour, strength, range squared]
  // ---- 1) proportions, first pass: tighten the spread of each kind around its median ----
  for(const d of L.decor){if(!inZ(d.x,d.y))continue;
    if(/^hg_chest/.test(d.k)&&!d.sc){d.sc=.7;stat.chests++}
    if(d.k==='gate'&&d.npc==='hgd_sign'){d.sc=1;stat.gates++}
    if(d.k==='hg_npc2'&&!d.sc)d.sc=.72}
  const FAM=[/^(art_hgdf_plant\d|hgt_reeds|hgt_fern|hgt_mushrooms|art_hgthin\d)$/,/^art_hgxrock\d$/,/^(art_hgdf_vine\d|hgt_vine_roundleaf)$/,/^(hgt_fairytree|hgtb_plant_belltree)$/];
  const famOf=k=>{for(let i=0;i<FAM.length;i++)if(FAM[i].test(k))return i;return -1};
  const eff=d=>(NPC_H[d.k]||0)*(d.sc||1);
  const byK={};for(const d of L.decor){if(!inZ(d.x,d.y)||d.pic||d.hgdl||!NPC_H[d.k]||famOf(d.k)<0)continue;(byK[d.k]=byK[d.k]||[]).push(d)}
  for(const k in byK){const a=byK[k],m=med(a.map(eff));for(const d of a){const e=eff(d),lo=m*.86,hi=m*1.16;if(e<lo||e>hi){d.sc=Math.min(hi,Math.max(lo,e))/NPC_H[k];stat.clamped++}}}
  // ---- 2) identical neighbours: the third identical thing within two squares becomes a sibling of the same height ----
  const cand=L.decor.filter(d=>inZ(d.x,d.y)&&!d.pic&&!d.hgdl&&!d.npc&&!d.loot&&NPC_H[d.k]&&famOf(d.k)>=0);
  const pool={};for(const d of cand){const b=bio[d.y*W+d.x],key=famOf(d.k)+'_'+b;(pool[key]=pool[key]||new Set()).add(d.k)}
  const medK={};for(const k in byK)medK[k]=med(byK[k].map(eff));
  const grid=new Map(),gk=(x,y)=>(x>>2)+','+(y>>2),put=d=>{const g=gk(d.x,d.y);if(!grid.has(g))grid.set(g,[]);grid.get(g).push(d)};
  const near=(d,k)=>{let n=0;for(let gx=(d.x>>2)-1;gx<=(d.x>>2)+1;gx++)for(let gy=(d.y>>2)-1;gy<=(d.y>>2)+1;gy++){const g=grid.get(gx+','+gy);if(g)for(const e of g)if(e!==d&&e.k===k&&Math.max(Math.abs(e.x-d.x),Math.abs(e.y-d.y))<=2)n++}return n};
  cand.sort((p,q)=>p.y-q.y||p.x-q.x);
  for(const d of cand){
    if(near(d,d.k)>=2){const tgt=eff(d),f=famOf(d.k),b=bio[d.y*W+d.x];let best=null,bn=1e9;
      for(const k of (pool[f+'_'+b]||[])){if(k===d.k||!medK[k])continue;const r=medK[k]/tgt;if(r<.45||r>2.2)continue;const n=near(d,k)*10+Math.abs(Math.log(r))+rnd()*.3;if(n<bn){bn=n;best=k}}
      if(!best)for(const k of Object.keys(medK)){if(k===d.k||famOf(k)!==f)continue;const r=medK[k]/tgt;if(r<.45||r>2.2)continue;const n=near(d,k)*10+Math.abs(Math.log(r))+rnd()*.3;if(n<bn){bn=n;best=k}}
      if(best){d.sc=Math.min(medK[best]*1.16,Math.max(medK[best]*.86,tgt))/NPC_H[best];d.k=best;stat.reskin++}}
    put(d)}
  // ---- 2a) clumps that are still identical (three or more of one kind within two squares: reeds, ferns, rocks, props): thin every third and vary the rest ----
  {const dropD=new Set(),cl=L.decor.filter(d=>inZ(d.x,d.y)&&!d.pic&&!d.npc&&!d.loot&&!d.block&&!d.hpa&&NPC_H[d.k]&&(d.deco||d.hgdl||famOf(d.k)>=0||/^art_hgx(prop|rock)/.test(d.k)||d.k==='hgt_reeds'));
   const g2=new Map(),key=(x,y)=>(x>>1)+','+(y>>1);for(const d of cl){const kk=key(d.x,d.y)+d.k;if(!g2.has(kk))g2.set(kk,[]);g2.get(kk).push(d)}
   const cnt=(d)=>{let n=0;for(let gx=(d.x>>1)-1;gx<=(d.x>>1)+1;gx++)for(let gy=(d.y>>1)-1;gy<=(d.y>>1)+1;gy++){const a=g2.get(gx+','+gy+d.k);if(a)for(const e of a)if(!dropD.has(e)&&Math.max(Math.abs(e.x-d.x),Math.abs(e.y-d.y))<=2)n++}return n};
   cl.sort((p,q)=>p.y-q.y||p.x-q.x);
   for(const d of cl){const n=cnt(d);if(n>=3){if(hs(d.x,d.y,41)<.72){dropD.add(d);stat.thinned++}}}
   if(dropD.size)L.decor=L.decor.filter(d=>!dropD.has(d))}
  // ---- 2b) a statue that shuts a corridor (and so cuts off squares behind it) stands against the wall instead, so it can be walked past ----
  {const bl=L.decor.filter(d=>d.block&&!d.walk&&!d.npc&&!d.loot&&!d.pic),bs=new Set(bl.map(d=>d.y*W+d.x)),reachB=blk=>{const r=new Uint8Array(N),qq=[L.start.y*W+L.start.x];r[qq[0]]=1;for(let i=0;i<qq.length;i++){const c=qq[i],x=c%W,y=(c/W)|0;for(const [a,b] of DV){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||!pass(nx,ny))continue;const n=ny*W+nx;if(r[n]||(blk&&bs.has(n)))continue;r[n]=1;qq.push(n)}}return r},r0=reachB(false),r1=reachB(true);
   for(const d of bl){if(!inZ(d.x,d.y)||!/statue|plinth|stat\d/.test(d.k))continue;let cut=false;for(const [a,b] of DV){const n=(d.y+b)*W+d.x+a;if(r0[n]&&!r1[n]&&!bs.has(n))cut=true}
    if(!cut)continue;d.block=false;d.walk=true;let ox=0,oy=0;for(const [a,b] of DV)if(!pass(d.x+a,d.y+b)){ox=a*.3;oy=b*.3;break}d.ox=ox;d.oy=oy;stat.freed=(stat.freed||0)+1}}
  // ---- 2c) hg_house2 is a bare white tower with a round door: the painted houses stand in its place ----
  for(const d of L.decor)if(inZ(d.x,d.y)&&d.k==='hg_house2'){d.k=(hs(d.x,d.y,9)<.5?'hg_house0':'hg_house1');stat.house++}
  // ---- 2d) the odd flat patches of another floor (a lone grass or pool tile in stone) look like coloured rectangles: single cells and pairs go back to the floor of the biome ----
  {const fm=L.fmap.map(r=>r.split(''));let ch=0;
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!inZ(x,y))continue;const c=fm[y][x],base=String(bio[y*W+x]);if(c===base||c==='6'||!pass(x,y))continue;
     let same=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)if((i||j)&&fm[y+j][x+i]===c)same++;
     if(same<4){fm[y][x]=base;ch++}}
   // the floor of every dead end and of the square before it is the plain floor of the biome
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!inZ(x,y)||!pass(x,y)||nOpen(x,y)!==1||fm[y][x]==='6')continue;const base=String(bio[y*W+x]);if(fm[y][x]!==base){fm[y][x]=base;ch++}
     for(const [a,b] of DV)if(pass(x+a,y+b)&&fm[y+b][x+a]!=='6'&&fm[y+b][x+a]!==base){fm[y+b][x+a]=base;ch++}}
   if(ch){L.fmap=fm.map(r=>r.join(''));stat.patches=ch}}
  // ---- 3) dead ends, vignettes and landmarks ----
  const dist=new Int32Array(N).fill(-1),q=[L.start.y*W+L.start.x];dist[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of DV){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||!pass(nx,ny))continue;const n=ny*W+nx;if(dist[n]>=0)continue;dist[n]=dist[c]+1;q.push(n)}}
  const isLM=d=>!d.pic&&(d.npc||d.loot||/lamp|stat|gate|tele|brazier|chest|^hpa_/.test(d.k)||d.zone!==undefined);
  const marks=()=>{const m=[];for(const d of L.decor)if(isLM(d)||d.npc==='hgd_note'||d.npc==='hgd_pa_note')m.push(d.y*W+d.x);for(const i of L.items)if(inZ(i.x,i.y))m.push(i.y*W+i.x);for(const e of L.enemies)if(inZ(e.x,e.y))m.push(e.y*W+e.x);return m};
  const flood=(src,lim)=>{const ld=new Int32Array(N).fill(-1),qq=[];for(const c of src)if(ld[c]<0){ld[c]=0;qq.push(c)}
    for(let i=0;i<qq.length;i++){const c=qq[i],x=c%W,y=(c/W)|0;if(lim&&ld[c]>=lim)continue;for(const [a,b] of DV){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||!pass(nx,ny))continue;const n=ny*W+nx;if(ld[n]>=0)continue;ld[n]=ld[c]+1;qq.push(n)}}return ld};
  const ldist=()=>flood(marks());
  const busy=new Set();for(const d of L.decor)if(!d.pic&&(d.block||d.npc||d.loot))busy.add(d.y*W+d.x);for(const i of L.items)busy.add(i.y*W+i.x);for(const e of L.enemies)busy.add(e.y*W+e.x);
  const bigNear=(x,y,r)=>{for(const d of L.decor){if(d.npc&&!/note/.test(d.npc)||d.k==='teleporter'||d.k==='gate'){if(Math.abs(d.x-x)<=r&&Math.abs(d.y-y)<=r)return true}}return false};
  const deadEnd=(x,y)=>inZ(x,y)&&pass(x,y)&&dist[y*W+x]>=0&&nOpen(x,y)===1&&open(x,y)&&L.fmap[y][x]!=='6'&&!busy.has(y*W+x);
  const ends=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(deadEnd(x,y)&&!bigNear(x,y,5)&&Math.hypot(x-L.start.x,y-L.start.y)>10)ends.push([x,y]);
  const farDir=(x,y)=>{for(const [a,b] of DV)if(pass(x+a,y+b))return [-a,-b];return [0,-1]};
  const dressEnd=(x,y,props,lc)=>{const [fx,fy]=farDir(x,y),sx=-fy,sy=fx;
    for(const [k,far,side] of props)L.decor.push({k,x,y,ox:fx*far+sx*side,oy:fy*far+sy*side,block:false,walk:true,deco:true,hpa:1});
    if(lc)LT.push([x,y,lc[0],lc[1],lc[2]]);return [fx,fy]};
  const wallNote=(x,y,text)=>{const [fx,fy]=farDir(x,y);L.decor.push({k:'hl_p_note',x,y,wd:[fx,fy],pic:1,block:false,walk:true,deco:true,npc:'hgd_pa_note',text,bob:.35+.4*hs(x,y,17),hpa:1})};
  const prec=hgdmpPrec(L).filter(p=>p.b<ZB),used=new Set(),vigAt=[];
  const order=[];for(let b=0;b<ZB;b++){const ps=prec.filter(p=>p.b===b);for(const p of ps)order.push(p)}
  order.forEach((p,i)=>{const v=HGPA_VIG[i];if(!v)return;let best=null,bd=1e9;
    for(const [x,y] of ends){if(bio[y*W+x]!==p.b||used.has(x+','+y))continue;if(vigAt.some(a=>Math.hypot(a[0]-x,a[1]-y)<22))continue;const dd=Math.hypot(x-p.x,y-p.y);if(dd<bd){bd=dd;best=[x,y]}}
    if(!best)return;const [x,y]=best;used.add(x+','+y);vigAt.push(best);
    dressEnd(x,y,v.p,v.lc);wallNote(x,y,v.text||v.t);L.items.push({k:v.it,x,y});stat.vig++;stat.notes++;v.at=best})
  // ---- 4) light sources: props that glow, in colours that belong to each biome ([alias, colour, strength, range squared]) ----
  const BP=[
   [['hpa_glamp',[1,.82,.5],1.1,56],['hpa_glow',[.55,1,.8],1.05,50],['hpa_lampost',[1,.85,.55],1.15,60],['hpa_lamp',[1,.8,.45],1,48],['hpa_mushT',[.7,.9,1],1,48]],
   [['hpa_crysT',[.4,.95,1],1.95,78],['hpa_crysV',[.78,.5,1],1.9,76],['hpa_crysTall',[.85,.55,1],1.95,78],['hpa_mushC',[.5,.85,1],1.85,72],['hpa_brazier',[.85,.5,1],1.95,78],['hpa_crysP',[.6,.7,1],1.9,76],['hpa_lamp',[1,.78,.42],1.7,68]],
   [['hpa_eggs',[1,.7,.25],1.25,60],['hpa_lamp',[1,.78,.4],1.1,52],['hpa_cage',[1,.72,.3],1.15,54],['hpa_post',[1,.8,.4],1.2,58],['hpa_bulb',[1,.6,.5],1.05,48]],
   [['hpa_lampT',[.82,.95,1],1.15,60],['hpa_lampS',[.9,.95,1],1.05,54],['hpa_crysW',[.8,.9,1],1.1,56],['hpa_lampV',[1,.8,.9],1.05,54],['hpa_pplinth',[.85,.88,1],1,50],['hpa_glow',[.6,1,.9],1,48]]];
  const lastK=new Map(),gk2=(x,y)=>(x>>2)+','+(y>>2);
  const pickLight=(x,y,b)=>{const L2=BP[b],used2=new Set();for(let gx=(x>>2)-2;gx<=(x>>2)+2;gx++)for(let gy=(y>>2)-2;gy<=(y>>2)+2;gy++){const a=lastK.get(gx+','+gy);if(a)for(const e of a)if(Math.hypot(e[0]-x,e[1]-y)<8)used2.add(e[2])}
    const s=(hs(x,y,3)*L2.length)|0;for(let i=0;i<L2.length;i++){const o=L2[(s+i)%L2.length];if(!used2.has(o[0]))return o}return L2[s]};
  const placeLight=(x,y,b)=>{const o=pickLight(x,y,b);let ox=0,oy=0,found=false;for(const [a,c] of DV)if(!pass(x+a,y+c)){ox=a*.32;oy=c*.32;found=true;break}
    if(!found){ox=(hs(x,y,4)<.5?-1:1)*.3;oy=(hs(x,y,5)<.5?-1:1)*.3}
    L.decor.push({k:o[0],x,y,ox,oy,block:false,walk:true,deco:true,hpa:1});LT.push([x,y,o[1],o[2],o[3]]);const g=gk2(x,y);if(!lastK.has(g))lastK.set(g,[]);lastK.get(g).push([x,y,o[0]]);stat.lamps++};
  const okCell=(x,y)=>inZ(x,y)&&pass(x,y)&&dist[y*W+x]>=0&&!busy.has(y*W+x)&&L.fmap[y][x]!=='6';
  // 4a) a light at every junction (a corner where three or more ways meet), with a gap so that neighbouring junctions are not alike
  {const GAP=[9,6,8,8],js=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(okCell(x,y)&&nOpen(x,y)>=3)js.push([x,y]);
   js.sort((p,q)=>hs(p[0],p[1],8)-hs(q[0],q[1],8));
   for(const [x,y] of js){const b=bio[y*W+x];if(LT.some(l=>Math.abs(l[0]-x)<GAP[b]&&Math.abs(l[1]-y)<GAP[b]&&Math.hypot(l[0]-x,l[1]-y)<GAP[b]))continue;placeLight(x,y,b)}}
  // 4b) fill: no square of a corridor is further than a few steps from a light (the Stone Warrens: five, the others seven or eight)
  {const R=[8,5,7,7];let ld=flood(LT.map(l=>l[1]*W+l[0])),guard=0;
   while(guard++<900){let bx=-1,bd=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const v=ld[y*W+x]<0?99:ld[y*W+x];if(!inZ(x,y))continue;const b=bio[y*W+x];if(v>R[b]&&v>bd&&okCell(x,y)){bd=v;bx=y*W+x}}
     // a square that nothing reaches (v is -1 when the flood never got there) counts as far
     if(bx<0)break;const x=bx%W,y=(bx/W)|0;placeLight(x,y,bio[bx]);
     const qq=[bx];ld[bx]=0;for(let i=0;i<qq.length;i++){const c=qq[i],cx=c%W,cy=(c/W)|0;for(const [a,b] of DV){const nx=cx+a,ny=cy+b;if(nx<0||ny<0||nx>=W||ny>=H||!pass(nx,ny))continue;const m=ny*W+nx;if(ld[m]>=0&&ld[m]<=ld[c]+1)continue;ld[m]=ld[c]+1;qq.push(m)}}}}
  // ---- 5) every other dead end is dressed with a small kit (never the same twice in a row) and, for sixty of them, a note ----
  const DRESS=[['hpa_bench','hpa_bucket','hpa_tools','hpa_sack','hpa_vase','hpa_barrel','hpa_crate','hpa_glamp','hpa_ribbon'],
    ['hpa_stonecart','hpa_keg','hpa_lid','hpa_bones','hpa_rack','hpa_tools','hpa_bell','hpa_sacks','hpa_cask'],
    ['hpa_waxbarrel','hpa_jar','hpa_chestwax','hpa_eggs','hpa_sack','hpa_bunk','hpa_cask','hpa_vase','hpa_bulb'],
    ['hpa_shells','hpa_pots','hpa_globe','hpa_bench','hpa_gold','hpa_lid','hpa_vase','hpa_pplinth','hpa_sack']];
  const SIDES=[[.3,-.26],[.2,.28],[.34,.0],[.05,-.3],[.1,.3]];
  const REW=['hgcomb','hgjelly','potion3','herb_mint','hgcomb','herb_rosemary','hgjelly','herb_lavender'];let ni=0,ri=0,ki=0;
  const lmD=flood(marks().concat(LT.map(l=>l[1]*W+l[0])));
  const ends2=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(inZ(x,y)&&pass(x,y)&&dist[y*W+x]>=0&&nOpen(x,y)===1&&L.fmap[y][x]!=='6'&&!busy.has(y*W+x)&&!used.has(x+','+y))ends2.push([x,y]);
  const dressed=new Set(L.decor.filter(d=>d.hpa).map(d=>d.x+','+d.y));
  for(const [x,y] of ends2){const b=bio[y*W+x],D=DRESS[b],n=D.length,a=(ki*3+((hs(x,y,12)*n)|0))%n,c2=(a+1+((hs(x,y,13)*(n-2))|0))%n;ki++;
    if(!dressed.has(x+','+y)){const p1=SIDES[(ki+1)%SIDES.length],p2=SIDES[(ki+3)%SIDES.length];dressEnd(x,y,[[D[a],p1[0],p1[1]],[D[c2],p2[0],p2[1]]],null);stat.kits++}
    L.items.push({k:REW[ri++%REW.length],x,y});stat.deadItems++;
    if(ni<HGPA_NOTES.length&&hs(x,y,14)<.7){wallNote(x,y,HGPA_NOTES[ni++]);stat.deadNotes++}}
  // ---- 6) wall notes: every note has its own text and its own height ----
  {const seen=new Set(),texts=[];const txt=d=>d.npc==='hgd_pa_note'?String(d.text||''):(d.pbt||HGDF_NOTES[(d.note||0)%HGDF_NOTES.length]||'');
   const notes=L.decor.filter(d=>(d.npc==='hgd_pa_note'||d.npc==='hgd_note')&&inZ(d.x,d.y));
   let pi=0,extra=0;
   for(const d of notes){let t=txt(d);const key=t.trim().toLowerCase();
     if(t.trim().length<8||seen.has(key)){let nt=null;while(pi<HGPA_POOL.length){const c=HGPA_POOL[pi++];if(!seen.has(c.toLowerCase())){nt=c;break}}
       if(!nt)nt='Scratched: Note number '+(++extra)+' on this wall. I kept count so that I would not lose myself.';
       if(d.npc==='hgd_pa_note')d.text=nt;else d.pbt=nt;t=nt;stat.notesFixed++}
     seen.add(t.trim().toLowerCase());if(d.npc==='hgd_note')d.bob=.35+.4*hs(d.x,d.y,17)}}
  // ---- 7) the scale table (see the header). Runs last so that nothing above is undone. ----
  {const treeH=d=>[1.6,2.0,2.4,2.7][(hs(d.x,d.y,5)*4)|0],jit=(d,s,a,b)=>a+(b-a)*hs(d.x,d.y,s);
   const R=[[/^hg_house\d$/,()=>2.2],[/^(hgtb_plant_belltree|hgt_fairytree)$/,treeH],[/^hgt_vine_roundleaf$/,d=>jit(d,6,1.5,1.9)],[/^hg_lamp$/,d=>jit(d,7,1.3,1.5)],[/^hgt_lamppost$/,()=>1.3],
    [/^hgtb_deco_shellstatue$/,d=>jit(d,8,1.35,1.5)],[/^hgtb_deco_pearlplinth$/,()=>.65],[/^art_hgxstat\d$/,d=>jit(d,9,1.3,1.5)],[/^wm_statue$/,()=>1.5],[/^hgtb_deco_fountain$/,()=>1.4],
    [/^hgt_shellflower$/,d=>jit(d,10,1.1,1.3)],[/^hgt_bulbflower$/,d=>jit(d,11,1,1.2)],[/^hgtb_plant_spiralfern$/,d=>jit(d,12,.75,.95)],[/^hgtb_plantbed$/,()=>.55],[/^hgt_fern$/,d=>Math.min(eff(d),jit(d,13,.8,.95))],
    [/^hgt_pearlbush$/,d=>jit(d,14,.75,.9)],[/^hgt_mushrooms$/,d=>jit(d,15,.65,.85)],[/^hgt_reeds$/,d=>jit(d,16,.6,.9)],[/^hgtb_bench$/,()=>.5],[/^hgtb_furn_table_chairs$/,()=>.6],[/^hgtb_furn_clock$/,()=>1.1],[/^hgtb_furn_bunk$/,()=>.9],
    [/^hgtb_furn_bed$/,()=>.6],[/^hgtb_stall_orange_pottery$/,()=>1.1],[/^hgtb_deco_lanterns$/,()=>1],[/^wm_brazier$/,()=>.85],[/^(wm_noticeboard|noticeboard)$/,()=>.75],[/^wm_bell$/,()=>.7],[/^hg_jar$/,()=>.7],[/^hg_waxbarrel$/,()=>.6],
    [/^hg_chest/,d=>jit(d,18,.38,.48)],[/^gate$/,d=>d.npc==='hgd_sign'?1.15:null],[/^(hg_npc\d|hg_wizard)$/,d=>jit(d,19,.9,.98)],[/^pickpocket$/,()=>.8],[/^(sign_|hgdpc_sg_)/,()=>.6],[/^hgdpc_post/,()=>1],[/^wm_barrel_tall$/,()=>.6],
    [/^hl_p_candle$/,()=>.6],[/^hgdfc_/,d=>Math.min(eff(d),.95)],[/^hgtb_lantern$/,d=>Math.min(eff(d),.7)],[/^wm_lantern_hang$/,d=>Math.min(eff(d),.7)]];
   for(const d of L.decor){if(!inZ(d.x,d.y)||d.pic||!NPC_H[d.k])continue;for(const [re,fn] of R){if(!re.test(d.k))continue;const h=fn(d);if(h&&h>0){d.sc=Math.round(h/NPC_H[d.k]*1000)/1000;stat.scaled++}break}}}
  L._hgpa={stat,vig:HGPA_VIG.map(v=>[v.nm,v.at]),lights:LT,ms:Math.round(performance.now()-T0)}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];try{hgpaEnemies()}catch(e){console.error('hgpa enemies',e)}if(!had&&L&&L._hgdm&&L._hgdp&&L.decor)try{hgpaBuild(L);hgpaEnemies()}catch(e){console.error('hgpa',e)}}}
// the coloured lights of the zone (after the torches and level lights are set up)
{const _sl=setupLights;setupLights=function(){_sl.apply(this,arguments);try{if(LEVEL===HGD.ID){const Lv=LEVELS[HGD.ID],A=Lv&&Lv._hgpa;if(A)for(const q of A.lights)LIGHTS.push({x:q[0]+.5,y:q[1]+.5,ph:hash2(q[0],q[1],23)*6.28,key:-7000-LIGHTS.length,taken:false,red:false,free:true,calm:true,hpa:1,col:q[2],kI:q[3],range2:q[4]})}}catch(e){console.error('hgpa lights',e)}}}
