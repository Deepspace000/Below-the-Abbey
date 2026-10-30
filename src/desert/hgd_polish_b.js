/* ==========================================================================
   DEEPER HOLLOW POLISH B (prefix hgpb / HGPB): the second half of the surface maze (precincts thirteen to twenty-four: the Sandstone Deeps, the Blue Quarter, the Mosaic Halls and the
   Gilded Quarter), the great atrium and the gate. It patches the BUILT level after every other builder has run (it wraps hgdBuild last), so no generator is touched:
   1) PROPORTIONS: one scale for the Hollow (a villager is about 0.9 of a square tall, a chest knee-to-hip, a statue clearly taller than a person, a tree much taller than a house door);
      the flower beds that were three squares wide, the plinths wider than their niches, the warning signs wider than the corridor and the one folk picture with no height are fixed.
   2) Nothing blocks a one-square way (a chest in a corridor is moved to a dead end), no two props share a cell, no more than three of one kind stand within four squares.
   3) Twelve hand-built vignettes, one for each precinct, each with its own props, a light and a note that tells a short story; real signposts at the junctions (the directions and the
      distances are computed from the maze, so they are true); a lamp at the end of the longest straight way of every precinct, so there is always something to walk towards.
   4) The plaque at the foot of the atrium says what is true once the Black Swill is dead.
   Deterministic (hgdmRng 475700). Only cosmetic decor is ever moved or removed; quest objects, people, chests with keys and gems, items and enemies stay where they are.
   ========================================================================== */
const HGPB={log:null};
/* sizes (heights in squares; a villager is 0.9) for the pictures this file uses that had none */
Object.assign(NPC_H,{hg_npc2:1.3,art_hgtb_furn_books_globe:.34,art_hgtb_furn_bookshelf:1.05,art_hgtb_bench:.5,art_hgtb_deco_banner:.95,art_hgobones:.28,art_hgtb_furn_table_chairs:.55});
const HGPB_ASP={hgdfc_aqua1:2.88,hgdfc_aqua2:1.83,hgdfc_lilac1:1.87,hgdfc_lilac2:1.57,hgdfc_cream1:2.08,hgdfc_cream2:1.08,hgdfc_pink1:1.94,gate:1.47,hgtb_deco_pearlplinth:.84,hgtb_deco_shellstatue:.63};
/* the twelve vignettes, one per precinct (the order of the precinct names of hgd_maps.js, thirteenth to twenty-fourth). p: [picture, steps in from the dead end, side offset, scale, wall] */
const HGPB_V=[ // p: [picture, steps in from the dead end, side offset, HEIGHT in squares (a villager is 0.9)]; every vignette has its own kit, no prop of the Well Maze set appears in two of them. lb: the title of the note
 {n:'The Keeper\'s Cache',lb:'Keeper\'s Cache',chest:4,col:'amber',p:[['art_hgxstat5',1,.3,1.1],['art_hgxprop2',2,-.3,.42],['art_hgxprop10',2,.2,.2],['art_hgxprop0',3,-.25,.3]],note:'Carved under the owl: It keeps what the dark gives it. Take a little, and leave the rest. It counts.',lamp:1},
 {n:'The Cold Camp',lb:'Cold Camp Diary',col:'cold',p:[['hpb_brazier',0,-.3,.75],['art_hgxprop15',1,.3,.42],['art_hgxprop1',1,-.28,.4],['art_hgxprop7',2,.28,.34]],note:'Day nineteen. The Dry Ward goes round in circles. I have decided it is the corridors that are wrong and not me. If you read this, I went left.',lamp:1},
 {n:'The Dry Well',lb:'Dunewell Founding',col:'pale',p:[['hpb_windlass',0,0,.85],['hpb_bucket',1,-.3,.32],['art_hgxrock2',2,.3,.6],['art_hgxprop6',3,.3,.48]],note:'DUNEWELL. Founded beside a well. The well turned out to be a rumour. We kept the name out of stubbornness.',lamp:0},
 {n:'The Last Lamplighter',lb:'The Lamplighter',col:'amber',p:[['art_hgxstat7',0,0,.95],['hpb_ladder',1,-.3,1.25],['art_hgxprop7',1,.3,.4],['art_hgxprop7',2,-.25,.3]],note:'Tuck lit forty lamps here, one a night. She lit the last one, put down her ladder and went home. The statue is her. The lamp is still lit. Do not blow it out.',lamp:1},
 {n:'The Waiting Bench',lb:'The Waiting Bench',col:'cold',p:[['art_hgtb_bench',0,0,.5],['hpb_cage',1,.3,.5],['art_hgxprop4',2,-.3,.55],['art_hgxprop3',1,-.3,.24]],note:'Waiting for the Blue Door to open since spring. The bench is very good. The door is not.',lamp:1},
 {n:'The Scribe\'s Corner',lb:'Archive Notice',col:'cold',p:[['art_hgtb_furn_bookshelf',0,0,1.2],['hgtb_table',1,-.28,.5],['hgtb_chair',2,.28,.55],['art_hgtb_furn_books_globe',1,.3,.34],['hpb_candle',3,-.3,.6]],note:'INKWELL COURT ARCHIVE. Everything is filed. Nothing can be found. Please return books to the shelf they fell from.',lamp:1},
 {n:'The Tile Counter',lb:'The Tile Counter',col:'lilac',p:[['art_hgxprop11',0,-.28,.3],['art_hgxprop11',1,.28,.26],['hpb_scale',2,.28,.5],['art_hgxrock3',1,-.3,.3],['art_hgxrock6',3,-.25,.36]],note:'Counting the tiles. Lost count at 3,112. Starting again from the beginning. Please do not talk to me.',lamp:1},
 {n:'The Barricade',lb:'The Barricade',col:'lilac',p:[['hpb_orecart',0,0,.55],['hpb_crate',1,-.3,.42],['hpb_crate',2,.28,.34],['art_hgxprop6',1,.3,.45],['art_hgxrock1',2,-.2,.5]],note:'We stacked all this against the worm. The worm was behind us the whole time. It is a very good barricade.',lamp:0},
 {n:'The Mortar Mistake',lb:'The Mortar Mistake',col:'lilac',p:[['hpb_skel',0,.3,.5],['hpb_tools',2,.3,.42],['art_hgxrock6',0,-.25,.5],['art_hgxrock0',1,-.2,.4]],note:'Grout Court was to have a fine floor by Friday. The mason promised. It is still Friday here, and he is still kneeling in the corner.',lamp:1},
 {n:'The Trophy Wall',lb:'Hunt Club Trophies',col:'amber',w:[['hpb_antler',0,1,.62],['hpb_antler',0,-1,.55],['hpb_sh3',1,1,.5],['hpb_sh4',1,-1,.5]],p:[['hpb_keg',1,.3,.42],['hpb_lid',2,-.28,.34]],note:'GILDMERE HUNT CLUB. Trophies so far: 3 antlers and 1 boot. Slugs: none. They know why.',lamp:1},
 {n:'The Gilder\'s Hoard',lb:'Gilder\'s Hoard',chest:4,col:'gold',p:[['hpb_gold',2,-.2,.24],['hpb_gold',1,.25,.2],['art_hgxprop10',3,.3,.2],['hpb_candle',0,-.18,.62]],note:'A coin for the road and a chest for the patient. Not all that glitters is gold, but this is. Mind the lid.',lamp:1},
 {n:'The Little Shrine',lb:'The Little Shrine',col:'amber',p:[['hpb_shrine',0,0,.7],['art_hgxprop2',1,-.3,.4],['art_hgxprop8',1,.3,.3],['art_hgxprop9',2,.3,.45]],note:'Someone leaves a candle here every week. Nobody has ever seen them. Please leave it burning.',lamp:1}];
/* painted pictures borrowed from the other mazes, under names of their own with a fixed height in squares (a villager is 0.9): [alias, picture, height] */
const HGPB_AL=[['hpb_lan_gold','art_wm_lantern_gold',.55],['hpb_lan_lilac','art_wm_lantern_lilac',.55],['hpb_lan_violet','art_wm_lantern_violet',.55],['hpb_lan_hang','art_wm_lantern_hang',.65],['hpb_cage','art_wm_cage_lantern',.5],
 ['hpb_brazier','art_wm_brazier',.75],['hpb_bucket','art_wm_bucket',.3],['hpb_windlass','art_wm_windlass',.85],['hpb_ladder','art_wm_ladder',1.25],['hpb_tools','art_wm_tools',.38],['hpb_lid','art_wm_crate_lid',.32],['hpb_barrel','art_wm_barrel',.55],
 ['hpb_cask','art_wm_cask',.42],['hpb_keg','art_wm_keg',.4],['hpb_candle','art_wm_candelabra',.62],['hpb_scale','art_wm_scale',.5],['hpb_gold','art_wm_gold',.22],['hpb_orb','art_wm_orb_pedestal',.8],['hpb_bell','art_wm_bell',.6],
 ['hpb_orecart','art_wm_ore_cart',.55],['hpb_minecart','art_wm_mine_cart',.5],['hpb_skel','art_wm_skeleton',.5],['hpb_shrine','art_wm_shrine',.7],['hpb_rune','art_wm_rune',.55],['hpb_antler','art_hgxprop13',.42],['hpb_crate','art_wm_crate',.4],['hpb_signb','art_wm_signpost',.95],['hpb_sh3','art_hgdf_shield3',.5],['hpb_sh4','art_hgdf_shield4',.5]];
for(const [a,,h] of HGPB_AL)NPC_H[a]=h;
const HGPB_LET={}; // the signposts: a board with the place names painted on it, made once the blank picture has loaded: [biome, line one, line two]
/* The Well Maze pictures are purple; the Hollow versions (assets/ds_hpb_<prop>_<biome>.png, made by tools/hpb_recolor.py) are recoloured to the precinct: 4 sandstone, 5 Blue Quarter, 6 Mosaic Halls, 7 Gilded Quarter */
const HPB_MAP={hpb_barrel:'barrel',hpb_crate:'crate',hpb_lid:'crate_lid',hpb_bucket:'bucket',hpb_brazier:'brazier',hpb_cask:'cask',hpb_keg:'keg',hpb_bell:'bell',hpb_orecart:'ore_cart',hpb_minecart:'mine_cart',hpb_tools:'tools',hpb_windlass:'windlass',hpb_ladder:'ladder',hpb_scale:'scale',hpb_shrine:'shrine',hpb_candle:'candelabra',hpb_skel:'skeleton',hpb_rune:'rune',hpb_lan_hang:'lantern_hang',hpb_lan_violet:'lantern_violet',hpb_lan_lilac:'lantern_lilac',hpb_orb:'orb_pedestal'};
function hpbTint(k,b){const m=HPB_MAP[k];if(!m||!(b>=4&&b<=7))return k;const n='art_hpb_'+m+'_'+b;if(NPC_H[n]===undefined)NPC_H[n]=NPC_H[k];return n}
/* walls of the Blue Quarter and the Mosaic Halls come in variants (tools/hpb_walls.py); the variant characters live at 0x3a0 and up */
const HPB_WCH=c=>!!c&&c!=='.'&&c!=='#'&&((c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8)||(c.charCodeAt(0)>=0x3a0&&c.charCodeAt(0)<0x3b0));
const HPB_VAR={5:[['art_tex_hpb_blue0',46],['art_tex_hpb_blue1',20],['art_tex_hpb_blue2',16],['art_tex_hpb_blue3',6],['art_tex_hpb_blue4',12]],6:[['art_tex_hpb_mos0',42],['art_tex_hpb_mos1',24],['art_tex_hpb_mos2',16],['art_tex_hpb_mos3',18]]};
function hpbShort(n,m){n=String(n).replace(/^The\s+/i,'');const u=n.toUpperCase();if(/^GREAT ATRIUM/.test(u))return 'ATRIUM';m=m||13;if(u.length<=m)return u;const w=u.split(' ');return w[0].length>=4?w[0]:u.slice(0,m)}
/* a title of one to four words for every note and sign: my own lines have a hand-made title, any other line gets its first few telling words */
const HPB_TITLES=[[/warm at noon/i,'Warm Walls'],[/sand in my boots/i,'Sand Complaint'],[/rumour of one/i,'Rumour of a Well'],[/count the pillars/i,'Pillar Count'],[/older than the dark/i,'Old Dust'],[/the way I came has moved/i,'Moving Corridors'],
 [/blue lamps do not flicker/i,'Blue Lamps'],[/tiles are cold/i,'Cold Tiles'],[/blue silence/i,'Blue Silence'],[/swept this corridor/i,'Swept Corridor'],[/sound of dripping/i,'Dripping Sound'],[/it was a sock/i,'A Sock'],
 [/eleven thousand tiles/i,'Tile Count'],[/repeats every nineteen/i,'Repeating Pattern'],[/follow the red tiles/i,'Red Tiles'],[/shows a map of this place/i,'Wrong Map'],[/one tile crooked/i,'Crooked Tile'],[/if the tiles hum/i,'Humming Tiles'],
 [/everything here that shines/i,'Not Yours'],[/took the ladder/i,'Missing Ladder'],[/mop it|have to mop/i,'Mopping Gold'],[/open to guests/i,'Guest Notice'],[/took one coin/i,'One Coin'],[/wealthy are polite/i,'Polite Warning'],
 [/came all this way for a dead end/i,'Nice Dead End'],[/^chalked: turn back/i,'Turn Back'],[/good place to sit/i,'Quiet Seat'],[/not a door/i,'Not a Door'],[/dead end got you too/i,'Dead End Warning'],[/left at the last crossing/i,'Wrong Turn'],
 [/same tree four times/i,'Same Tree Four Times'],[/hedge maze is the easy/i,'Hedge Maze Warning'],[/the other left/i,'Which Left'],[/shortcut here/i,'Shortcut Secret'],[/slug is not slow/i,'Patient Slug'],[/do not feed/i,'Do Not Feed'],[/key is used up/i,'Spent Keys'],[/gem doors are worth/i,'Gem Doors'],[/signs mean what they say/i,'Signs Mean It'],[/one lantern, brass/i,'Lost Lantern'],[/four towns is a good walk/i,'Four Towns'],[/honeycomb walls are warm/i,'Warm and Cold Walls'],[/stayed for the soup/i,'Treasure and Soup'],[/dead ends are not always dead/i,'Press the Wall'],[/ponds are shallow/i,'Shallow Ponds'],[/hedgefoot is this way/i,'Hedgefoot, This Way'],[/keeps moving the walls/i,'Moving Walls'],[/gold key in a vault/i,'Gold Key, Gold Door'],[/warden at the top/i,'Warden Warning'],[/people living in the maze/i,'Maze Dwellers'],[/was a gardener once/i,'The Gardener Warden'],[/rest in the safe places/i,'Safe Places'],[/blue door, blue key/i,'Coloured Doors'],[/counted the steps/i,'Counting Steps'],[/every maze has a middle/i,'Many Middles'],[/if the lamp goes out/i,'Lamp Goes Out'],[/spiders are the worst/i,'Spider Warning'],[/atriums are full of trees/i,'Atrium Trees'],[/past the signs/i,'Child at the Signs'],[/richest and the most dangerous/i,'Gilded Danger'],[/something large went past/i,'Large Night Visitor'],[/blue quarter is quiet/i,'Quiet Blue Quarter'],[/finds my gem/i,'A Gift Gem'],[/mosaic was beautiful/i,'Fallen Tiles'],[/twelve people in the maze/i,'Twelve Tasks'],[/every shop is better/i,'Shops Get Dearer'],[/hollow slugs came up/i,'Hollow Slugs'],[/too straight/i,'Straight Corridors'],
 [/^SIGNPOST/,'Signpost'],[/^DANGER/,'Danger Sign'],[/pace stone|paces from the lamp|stone marker|marker stone|rune-cut stone|cut into the stone/i,'Pace Stone']];
function hpbLabel(t){t=String(t||'');for(const [re,l] of HPB_TITLES)if(re.test(t))return l;
  let r=t.replace(/^(a |an )?(scratched|chalked|carved|written|etched|scrawled|note|painted|inked|stamped|pinned|neatly|small)[^:]{0,40}:\s*/i,'');const stop=/^(the|a|an|i|my|we|our|this|that|it|if|to|in|of|and|is|are|was|were|do|did|not|no|for|on|at|by|with|has|have|be|been|you|your|me|so|as|but|or)$/i;
  const w=r.replace(/[^A-Za-z' ]/g,' ').split(/\s+/).filter(Boolean);while(w.length&&stop.test(w[0]))w.shift();const o=[];for(const x of w){if(o.length>=3)break;o.push(x[0].toUpperCase()+x.slice(1).toLowerCase())}
  return o.join(' ')||'Old Note'}
function hgpbWalls(L,E){const {W,H,bio,rows}=E;if(L._hpbWalls)return;L._hpbWalls=1;const TM=ohTiles(),chars=L.chars,seq={5:[],6:[]};let ch=0x3a0;
  for(const b of [5,6]){const tot=HPB_VAR[b].reduce((n,v)=>n+v[1],0);HPB_VAR[b].forEach((v,i)=>{const sty='hgpb_wall'+b+'_'+i;OH_STY[sty]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:v[0],door:v[0],win:v[0],alt:v[0],zoom:1,contrast:1.05,tint:[255,255,255,0]});const c=String.fromCharCode(ch++);chars[c]=TM.make('plain',sty,2.7).gid;seq[b].push([c,v[1]/tot,i])})}
  const niche={};let n=0;const hs=(x,y,s)=>hgpbHs(x,y,s);
  for(let y=1;y<H-1;y++){let row=null;for(let x=1;x<W-1;x++){const c=rows[y][x],b=bio[y*W+x];if((c!==String.fromCharCode(0x2e0+5)&&c!==String.fromCharCode(0x2e0+6))||(b!==5&&b!==6)||c.charCodeAt(0)-0x2e0!==b)continue;
      let r=hs(x,y,41),acc=0,pick=seq[b][0];for(const v of seq[b]){acc+=v[1];if(r<acc){pick=v;break}}
      if(b===5&&pick[2]===3){if(niche[(x-1)+','+y]||niche[x+','+(y-1)]||niche[(x+1)+','+y]||niche[x+','+(y+1)])pick=seq[b][0];else niche[x+','+y]=1}
      if(b===6&&pick[2]===3&&(rows[y][x-1]===pick[0]||(rows[y-1]&&rows[y-1][x]===pick[0])))pick=seq[b][0];
      if(!row)row=rows[y].split('');row[x]=pick[0];n++}
    if(row)rows[y]=row.join('')}
  return n}
function hgpbAlias(){for(const [a,s] of HGPB_AL)if(!IMG[a]){const im=IMG[s]||IMG[s.replace(/^art_/,'')];if(im&&im.width)IMG[a]=im}
  for(const k in HGPB_LET){if(IMG[k])continue;const [bi,l1,l2]=HGPB_LET[k],b=IMG['art_hpb_signpost_'+bi]||IMG['hpb_signpost_'+bi]||IMG['art_wm_signpost']||IMG.wm_signpost;if(!(b&&b.width))continue;
    // the board is stretched wider (the post keeps its width), the two direction lines are laid on it in bold cream with a dark edge so they read from three squares away
    const SX=1.3,cw=Math.round(b.width*SX),ch=b.height,c=document.createElement('canvas');c.width=cw;c.height=ch;const x=c.getContext('2d'),seam=Math.round(ch*.5);
    x.drawImage(b,0,0,b.width,seam,0,0,cw,seam);x.drawImage(b,0,seam,b.width,ch-seam,Math.round((cw-b.width)/2),seam,b.width,ch-seam);
    const bx=cw*.07,bw=cw*.86,by=ch*.125,bh=ch*.335,lines=[l1,l2];x.textAlign='center';x.textBaseline='middle';
    lines.forEach((t,i)=>{let fs=bh/2*.86;x.font='bold '+fs+'px '+FUI;while(x.measureText(t).width>bw&&fs>9){fs-=2;x.font='bold '+fs+'px '+FUI}
      const cx=cw/2,cy=by+bh/2*(i+.5);x.lineJoin='round';x.lineWidth=Math.max(3,fs*.2);x.strokeStyle='rgba(14,8,4,.95)';x.strokeText(t,cx,cy);x.fillStyle=i?'#f1dca0':'#fff0c0';x.fillText(t,cx,cy)});
    IMG[k]=c}}
{const _u=update;update=function(dt){try{if(LEVEL===HGD.ID)hgpbAlias()}catch(e){}return _u.apply(this,arguments)}}
khNpc('hgdb_note','A note','hl_p_note',d0=>{const d=d0||(G.talk&&G.talk.d);return say(hgdSay(d&&d.pbt?d.pbt:'The writing has worn away.',1),[BYE])});
khNpc('hgdb_post','A signpost','hl_p_note',d0=>{const d=d0||(G.talk&&G.talk.d);return say(d&&d.pbt?d.pbt:'The signpost has been turned round.',[BYE])});
/* FIX for the old scratched notes and warning signs: startTalk calls the root with the picture it was given BEFORE G.talk is set, so the old roots (which read G.talk.d) always showed note 0 and a sign with no place name.
   These read the argument instead. */
khNpc('hgd_note','A scratched note','hl_p_note',d0=>{const d=d0||(G.talk&&G.talk.d),i=d&&d.note!==undefined?d.note:0;return say(hgdSay(d&&d.pbt?d.pbt:HGDF_NOTES[i%HGDF_NOTES.length]),[BYE])});
khNpc('hgd_sign','A warning sign','gate',d0=>{const d=d0||(G.talk&&G.talk.d),z=d&&d.zone!==undefined?L_ZONES()[d.zone]:null;return say(hgdSay('DANGER. '+(z?z.name:'The danger')+' lies ahead. '+(z?'Slugs, jellies, worms and bugs':'Creatures')+' live beyond this sign, and they do not stop. Turn back.'),[BYE])});
/* the plaque below the atrium: what is true once the Black Swill is dead (the old text said the road ended) */
khNpc('hgd_plaque','A plaque','gate',()=>{const F=G.flags||{};
  if(F.bswDead)return say('THE GREAT ATRIUM. The gate to the north is open. It leads out of the Hollow Lands to the Maze of Gardens, and on to the western kingdoms. Walk on.',[BYE]);
  return say('THE GREAT ATRIUM. The Hollowed Warden keeps the north gate, and the gate keeps something else. The way on is under the black water, to the south: ask who the Black Swill is, and who is afraid of it.',[BYE])});
function hgpbBuild(L){
  if(L._hgpb||(typeof location!=='undefined'&&/[?&]hgpb=0/.test(location.search)))return;const T0=performance.now(),M=L._hgdm,W=M.W,H=M.H,bio=M.bio,kind=M.kind,rows=L.rows,rnd=hgdmRng(475700),N=W*H;
  const isW=c=>!c||c==='#'||HPB_WCH(c),open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.',inZ=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&bio[y*W+x]>=4;
  const D4=[[0,-1],[1,0],[0,1],[-1,0]],nbc=(x,y)=>D4.reduce((n,[a,b])=>n+(open(x+a,y+b)?1:0),0),pass8=(x,y)=>{let n=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&x+a>=0&&y+b>=0&&!isW(rows[y+b][x+a]))n++;return n};
  const COLS={amber:[1.4,1,.5],cold:[.5,.9,1.5],pale:[1.15,1.1,.9],lilac:[1.15,.65,1.45],gold:[1.5,1.15,.45],teal:[.5,1.2,1.1]};L._hgpbCol=L._hgpbCol||{};const colAt=(x,y,nm,kI)=>{const c=COLS[nm]||COLS.amber;L._hgpbCol[x+','+y]=[c[0],c[1],c[2],kI||1.3]};
  const log={moved:[],removedStack:0,removedCluster:0,removedPics:0,scaled:0,posts:0,vign:[],lamps:0,blockFixed:0};
  // ---- flood fill from the start, and from the places signposts point to ----
  const bfs=(srcs)=>{const dist=new Int32Array(N).fill(-1),q=[];for(const [x,y] of srcs)if(open(x,y)&&dist[y*W+x]<0){dist[y*W+x]=0;q.push([x,y])}
    for(let i=0;i<q.length;i++){const [x,y]=q[i],d=dist[y*W+x];for(const [a,b] of D4){const nx=x+a,ny=y+b;if(open(nx,ny)&&dist[ny*W+nx]<0){dist[ny*W+nx]=d+1;q.push([nx,ny])}}}return dist};
  const reach=bfs([[L.start.x,L.start.y]]);
  const cos=d=>!d.npc&&!d.loot&&!d.shop&&!d.hgdTier&&!d.hgdtele&&d.zone===undefined&&!d.thiefid&&!d.petid&&!d.cloudid&&!d.hgdwg&&d.note===undefined&&!d.hgdGive&&!d.found;
  const solid=new Set();const hardAt=new Set();
  for(const e of L.enemies)hardAt.add(e.x+','+e.y);for(const it of L.items)hardAt.add(it.x+','+it.y);
  for(const d of L.decor)if(!cos(d)||/chest|^gate$|teleporter/.test(d.k))hardAt.add(d.x+','+d.y);
  // ---- 1) proportions ----
  for(const d of L.decor){if(!inZ(d.x,d.y)||d.pic)continue;const k=d.k,base=NPC_H[k],asp=HGPB_ASP[k];
    if(/^hgdfc_/.test(k)&&asp){const maxW=1.3,w=(base||.75)*(d.sc||1)*asp; // the drifting petal clouds (hgd_flora.js) get their picture size only at run time, so the base height is read as .75
      if(w>maxW){d.sc=(d.sc||1)*maxW/w;log.scaled++}}
    else if(k==='gate'&&d.npc==='hgd_sign'){d.sc=.62;log.scaled++}
    else if(k==='hgtb_deco_pearlplinth'){d.sc=.64;log.scaled++}
    else if(k==='hgtb_deco_shellstatue'){d.sc=.72;log.scaled++}
    else if(/^hg_chest/.test(k)&&!d._pbs){d.sc=.75;d._pbs=1;log.scaled++}}
  // ---- 2) nothing shuts a one-square way: a blocking piece that cuts the maze in two is moved to a dead end (only cosmetic pieces and chests without a key) ----
  const reachCount=skip=>{const seen=new Uint8Array(N),q=[[L.start.x,L.start.y]];seen[L.start.y*W+L.start.x]=1;let n=1;for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of D4){const nx=x+a,ny=y+b;if(open(nx,ny)&&!seen[ny*W+nx]&&!(nx===skip[0]&&ny===skip[1])){seen[ny*W+nx]=1;n++;q.push([nx,ny])}}}return n};
  const total=reachCount([-9,-9]);
  const deadEnds=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(inZ(x,y)&&open(x,y)&&!kind[y*W+x]&&reach[y*W+x]>=0&&nbc(x,y)===1)deadEnds.push([x,y]);
  const used=new Set();
  for(const d of L.decor){if(!inZ(d.x,d.y)||!d.block||d.pic||!open(d.x,d.y)||nbc(d.x,d.y)!==2)continue;if(!/^hg_chest/.test(d.k)||(d.hgdGive&&d.hgdGive.length))continue;
    if(total-reachCount([d.x,d.y])-1<=0)continue;let best=null,bd=1e9;
    for(const [x,y] of deadEnds){const k=x+','+y;if(used.has(k)||hardAt.has(k))continue;const dd=Math.hypot(x-d.x,y-d.y);if(dd<bd&&dd>1){bd=dd;best=[x,y]}}
    if(best){log.moved.push([d.k,d.x,d.y,best[0],best[1]]);hardAt.delete(d.x+','+d.y);d.x=best[0];d.y=best[1];used.add(best.join(','));hardAt.add(best.join(','));log.blockFixed++}}
  // ---- 3) stacks and clusters (cosmetic pieces only) ----
  const drop=new Set();
  {const at={};for(const d of L.decor){if(!inZ(d.x,d.y)||d.pic||d.hgdl)continue;(at[d.x+','+d.y]=at[d.x+','+d.y]||[]).push(d)}
   for(const k in at){const a=at[k];if(a.length<2)continue;a.sort((p,q)=>(cos(p)?1:0)-(cos(q)?1:0)||(NPC_H[q.k]||0)-(NPC_H[p.k]||0));for(let i=1;i<a.length;i++)if(cos(a[i])){drop.add(a[i]);log.removedStack++}}}
  {const lim=k=>/reeds/.test(k)?7:/^art_hgxprop|^art_hgxrock/.test(k)?2:3,byK={};
   for(const d of L.decor)if(inZ(d.x,d.y)&&!d.pic&&!d.hgdl&&cos(d)&&!drop.has(d)&&(!d.block||/tree|^art_hgx/.test(d.k)))(byK[d.k]=byK[d.k]||[]).push(d);
   for(const k in byK){const arr=byK[k].sort((p,q)=>p.y-q.y||p.x-q.x),kept=new Set(arr);
     for(let i=arr.length-1;i>=0;i--){const d=arr[i];let n=0;for(const e of kept)if(Math.max(Math.abs(e.x-d.x),Math.abs(e.y-d.y))<=4)n++;if(n>lim(k)){kept.delete(d);drop.add(d);log.removedCluster++}}}}
  {const keep={};const lst=L.decor.filter(d=>inZ(d.x,d.y)&&d.pic&&cos(d)).sort((p,q)=>p.y-q.y||p.x-q.x);
   for(const d of lst){const a=keep[d.k]=keep[d.k]||[];let n=0;for(const e of a)if(Math.max(Math.abs(e.x-d.x),Math.abs(e.y-d.y))<=5)n++;if(n>=2){drop.add(d);log.removedPics++}else a.push(d)}}
  // ---- places for the vignettes: dead ends at the end of a one-square way of two to twelve squares, away from towns, danger zones, people and creatures ----
  const zones=(L._hgdp&&L._hgdp.zones)||[];
  const tail=(x,y)=>{const cells=[[x,y]];let px=x,py=y,cx=x,cy=y;for(let s=0;s<14;s++){let nx=-1,ny=-1,c=0;for(const [a,b] of D4){const ax=cx+a,ay=cy+b;if(open(ax,ay)&&!(ax===px&&ay===py)){nx=ax;ny=ay;c++}}if(c!==1)break;const nn=nbc(nx,ny);if(nn!==2){break}px=cx;py=cy;cx=nx;cy=ny;cells.push([cx,cy])}return cells};
  const precOf=(x,y)=>{const b=bio[y*W+x];let bi=-1,bd=1e9;M.prec.forEach((p,i)=>{if(p.b!==b)return;const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;bi=i}});return bi};
  const cand=[];for(const [x,y] of deadEnds){if(hardAt.has(x+','+y))continue;const t=tail(x,y);if(t.length<2||t.length>13)continue;
    if(zones.some(z=>Math.hypot(z.x-x,z.y-y)<(z.r||8)))continue;if(t.slice(0,3).some(c=>hardAt.has(c[0]+','+c[1])))continue;if(L.enemies.some(e=>Math.hypot(e.x-x,e.y-y)<4))continue;
    const ob=D4.find(([a,b])=>open(x+a,y+b));cand.push({x,y,t,ob,pi:precOf(x,y)})}
  const chosen=[];
  HGPB_V.forEach((v,vi)=>{const pi=12+vi;const okc=c=>!c.used&&!chosen.some(h=>Math.hypot(h.c.x-c.x,h.c.y-c.y)<14);let list=cand.filter(c=>c.pi===pi&&okc(c)).sort((a,b)=>b.t.length-a.t.length);
    if(!list.length){const b0=M.prec[pi]?M.prec[pi].b:-1;list=cand.filter(c=>M.prec[c.pi]&&M.prec[c.pi].b===b0&&okc(c)).sort((a,b)=>b.t.length-a.t.length)}
    // prefer long tails, but pick with some chance so the choice is not always the same shape
    const c=list.length?list[Math.min(list.length-1,(rnd()*Math.min(4,list.length))|0)]:null;if(!c)return;chosen.push({c,v,vi});c.used=1});
  for(const {c,v,vi} of chosen){
    // clear the cosmetic pieces of the tail and of the cell beside it
    for(const [x,y] of c.t.slice(0,4))for(const d of L.decor)if(d.x===x&&d.y===y&&cos(d)&&(!d.pic||(x===c.x&&y===c.y)))drop.add(d);
    const dir=[-c.ob[0],-c.ob[1]]; // from the open way towards the dead end: the end wall is that way
    const bi=Math.max(4,Math.min(7,bio[c.y*W+c.x]));const place=(k0,step,side,h,extra)=>{const k=hpbTint(k0,bi),cell=c.t[Math.min(step,c.t.length-1)],px=-c.ob[1],py=c.ob[0];const o=Object.assign({k,x:cell[0],y:cell[1],block:false,walk:true,deco:true,sc:h/(NPC_H[k]||1),ox:px*side,oy:py*side,_pbv:1},extra||{});L.decor.push(o);return o};
    for(const [k,step,side,h] of v.p)place(k,step,side,h);
    for(const [k,step,sd,bob] of (v.w||[])){const cell=c.t[Math.min(step,c.t.length-1)];L.decor.push({k,x:cell[0],y:cell[1],wd:[-c.ob[1]*sd,c.ob[0]*sd],pic:1,block:false,walk:true,deco:true,bob,lift:.5,_pbv:1})}
    if(v.chest)L.decor.push({k:['hg_chestwax','hg_chestweed','hg_chestjelly'][vi%3],x:c.x,y:c.y,block:true,hgdTier:v.chest,hgdGive:[],sc:.75,_pbs:1});
    L.decor.push({k:'hl_p_note',x:c.x,y:c.y,wd:[dir[0],dir[1]],pic:1,block:false,walk:true,deco:true,npc:'hgdb_note',pbt:v.note,label:v.lb,bob:.6,lift:.45,_pbv:1});
    {const lc=c.t[Math.min(1,c.t.length-1)];L.lights.push([lc[0],lc[1]]);colAt(lc[0],lc[1],v.col,1.5)}
    log.vign.push([v.n,c.x,c.y,c.t.length,M.prec[c.pi]?M.prec[c.pi].name:'?'])}
  // ---- signposts at T junctions (true directions and distances from the maze) ----
  {const targets=[];for(const z of zones)if(z.town!==undefined&&z.town!==null&&open(z.x,z.y))targets.push({n:z.name,x:z.x,y:z.y});
   const top=M.spots.find(s=>s.boss);if(top)targets.push({n:'The Great Atrium',x:top.x,y:Math.min(top.y+3,H-3)});
   const bsw=L._hgdb&&L._hgdb.docks&&L._hgdb.docks[0];if(bsw&&open(bsw.ax,bsw.ay))targets.push({n:'The Boat Dock',x:bsw.ax,y:bsw.ay});
   L._hgpbTargets=targets;for(const t of targets){if(!open(t.x,t.y)){let f=null;for(let r=1;r<5&&!f;r++)for(let a=-r;a<=r&&!f;a++)for(let b=-r;b<=r;b++)if(open(t.x+a,t.y+b)){f=[t.x+a,t.y+b];break}if(f){t.x=f[0];t.y=f[1]}}t.d=bfs([[t.x,t.y]])}
   const compass=['North','East','South','West'],posts=[],postAt=new Set(L.decor.filter(d=>d.npc==='hgd_sign'||d.npc==='hgd_note'||d.npc==='hgdb_note').map(d=>d.x+','+d.y));
   const cells=[];for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++)if(inZ(x,y)&&open(x,y)&&!kind[y*W+x]&&reach[y*W+x]>=0&&nbc(x,y)===3)cells.push([x,y]);
   for(let i=cells.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[cells[i],cells[j]]=[cells[j],cells[i]]}
   for(const [x,y] of cells){if(posts.length>=26)break;if(posts.some(p=>Math.hypot(p[0]-x,p[1]-y)<13))continue;if([...postAt].some(s=>{const [a,b]=s.split(',');return Math.hypot(a-x,b-y)<4}))continue;
     if(hardAt.has(x+','+y)||L.decor.some(d=>d.x===x&&d.y===y&&d.pic))continue;
     const wi=D4.findIndex(([a,b])=>!open(x+a,y+b)&&rows[y+b]&&rows[y+b][x+a]!=='.'&&isW(rows[y+b][x+a]));if(wi<0)continue;
     // for every open way, the nearest named place reached through it
     const lines=[];for(let di=0;di<4;di++){const [a,b]=D4[di];if(!open(x+a,y+b))continue;let best=null;for(const t of targets){const dn=t.d[(y+b)*W+x+a],dh=t.d[y*W+x];if(dn<0||dh<0||dn>=dh)continue;if(!best||dh<best.dh)best={t,dh}}if(best)lines.push([di,best.t.n,best.dh])}
     // a place named twice keeps its nearest way only
     const seenN={},out=[];lines.sort((p,q)=>p[2]-q[2]);for(const l of lines){if(seenN[l[1]])continue;seenN[l[1]]=1;out.push(l)}
     if(out.length<2)continue;const pn=precOf(x,y),head=M.prec[pn]?M.prec[pn].name.toUpperCase()+'. ':'';
     const txt='SIGNPOST. '+head+out.slice(0,3).sort((p,q)=>p[0]-q[0]).map(l=>compass[l[0]]+': '+l[1]+', about '+(Math.max(5,Math.round(l[2]/5)*5))+' paces.').join(' ');
     const pk='hpbp'+posts.length,pnm=M.prec[pn]?M.prec[pn].name:'The Hollow';HGPB_LET[pk]=[Math.max(4,Math.min(7,bio[y*W+x])),...out.slice(0,2).map(l=>compass[l[0]][0]+'  '+hpbShort(l[1]))];NPC_H[pk]=1.2;
     posts.push([x,y]);L.decor.push({k:pk,x,y,wd:[D4[wi][0],D4[wi][1]],pic:1,block:false,walk:true,deco:true,npc:'hgdb_post',pbt:txt,label:'Signpost: '+hpbShort(pnm,14),bob:0,lift:.62,_pbv:1});log.posts++}}
  // ---- a lamp at the end of the longest straight way of every precinct (something to walk towards) ----
  {const best={};for(const [x,y] of deadEnds){const t=tail(x,y);if(t.length<2)continue;const pi=precOf(x,y);if(pi<12)continue;
      // a straight run: count the cells of the tail in line with the dead end
      let run=1;const ob=D4.find(([a,b])=>open(x+a,y+b));for(let s=1;s<30;s++){const cx=x+ob[0]*s,cy=y+ob[1]*s;if(!open(cx,cy))break;run=s+1;if(nbc(cx,cy)!==2)break}
      if(run<5||L.decor.some(d=>d.k==='hg_lamp'&&Math.hypot(d.x-x,d.y-y)<8)||hardAt.has(x+','+y)||chosen.some(h=>h.c.x===x&&h.c.y===y)||zones.some(z=>Math.hypot(z.x-x,z.y-y)<(z.r||8)+2))continue;if(!best[pi]||run>best[pi].run)best[pi]={x,y,run,ob}}
   for(const pi in best){const b=best[pi];for(const d of L.decor)if(d.x===b.x&&d.y===b.y&&cos(d)&&!d.pic)drop.add(d);L.decor.push({k:'hg_lamp',x:b.x,y:b.y,block:true,sc:1});L.lights.push([b.x,b.y]);log.lamps++;hardAt.add(b.x+','+b.y)}}
  // (dead ends are furnished in hgpbPolish2, below)
  // ---- the foot of the atrium: a lamp on each side of the gate plaque, so the way out is lit like a gate ----
  {const pl=L.decor.find(d=>d.npc==='hgd_plaque');if(pl)for(const dx of [-3,3]){const x=pl.x+dx,y=pl.y;if(open(x,y)&&!L.decor.some(d=>d.x===x&&d.y===y&&!drop.has(d))){L.decor.push({k:'hg_lamp',x,y,block:true,sc:1,_big:1});L.lights.push([x,y]);colAt(x,y,'gold',1.6);log.lamps++}}}
  try{hgpbPolish2(L,{M,W,H,bio,kind,rows,rnd,N,open,inZ,isW,nbc,bfs,reach,cos,drop,hardAt,deadEnds,tail,precOf,chosen,zones,log,colAt,COLS,D4,targets:L._hgpbTargets||[]})}catch(e){console.error('hgpbPolish2',e)}
  try{hgpbWalls(L,{W,H,bio,rows})}catch(e){console.error('hgpbWalls',e)}
  // the Well Maze pieces that other builders left in this zone (crates, barrels, buckets, braziers, a purple bookshelf) become the Hollow versions at the same height
  {const WM2={wm_crate:'hpb_crate',art_wm_crate:'hpb_crate',wm_bucket:'hpb_bucket',art_wm_bucket:'hpb_bucket',wm_barrel:'hpb_barrel',wm_barrel_tall:'hpb_barrel',wm_brazier:'hpb_brazier',wm_lantern_hang:'hpb_lan_hang'};
   for(const d of L.decor){if(!inZ(d.x,d.y)||!d.k)continue;const b=Math.max(4,Math.min(7,bio[d.y*W+d.x]));
     if(WM2[d.k]&&NPC_H[d.k]){const h=NPC_H[d.k]*(d.sc||1),k=hpbTint(WM2[d.k],b);d.k=k;d.sc=h/(NPC_H[k]||1)}
     else if(d.k==='wm_bookshelf'&&NPC_H.wm_bookshelf&&NPC_H.hgtb_furn_bookshelf){const h=NPC_H.wm_bookshelf*(d.sc||1);d.k='hgtb_furn_bookshelf';d.sc=h/NPC_H.hgtb_furn_bookshelf}
     else if(HPB_MAP[d.k])d.k=hpbTint(d.k,b)}}
  // ---- apply the removals ----
  if(drop.size){const keep=L.decor.filter(d=>!drop.has(d));L.decor.length=0;for(const d of keep)L.decor.push(d)}
  L._hgpb={log,ms:Math.round(performance.now()-T0)};HGPB.log=log}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdm&&L.decor&&L._hgdlDone)try{hgpbBuild(L)}catch(e){console.error('hgpbBuild',e)}}}

/* ==========================================================================
   ROUND TWO (south zone): one scale table for the whole zone, nothing tall beside a person who is talking, true notes for each biome, every dead end ends in something,
   landmarks along the long straight climbs, and coloured pools of light so that no corridor is simply black.
   SCALE: a picture's height in squares is NPC_H[k] * sc. A villager is 0.9. The walls of this maze are 2.7 high (ceilH), so a hall is three villagers tall; everything else is sized against the villager:
   door 1.1 to 1.5, statue 1.3 to 1.4 (a statue is larger than life), plinth 0.65, lamp 1.3, shop sign 0.6, table, chest and bench 0.5, house 1.9, trees by size class 1.5 to 2.6.
   ========================================================================== */
const HGPB_NOTES={
 4:['Scratched into the sandstone: The walls here are warm at noon, and I do not know why. There is no noon.','Chalked: Sand in my boots, sand in my bread, sand in the maze. I regret all three.','Carved neatly: Every ward has a well. This one has the rumour of one.','Scratched: Count the pillars on your left. Mine came to eleven. Yours will not.','Chalked: The dust here is older than the dark. Do not sneeze.','A note weighed down with a pebble: Back the way I came, and the way I came has moved.'],
 5:['Chalked in pale blue: The blue lamps do not flicker. Be wary of anything that does not flicker.','Scratched: The tiles are cold and the quiet is colder. I hummed to keep myself company.','A note: Blue lantern, blue door, blue silence. Pick any two to keep.','Carved: Somebody swept this corridor an hour ago. Nobody lives here.','Chalked: I followed the sound of dripping for a day. It was my own water bottle.','Scratched small: The Blue Quarter keeps its secrets in the corners. I found one. It was a sock.'],
 6:['Scratched into the grout: Eleven thousand tiles and not one of them is a door.','Chalked: The pattern repeats every nineteen paces. I know this because I have walked it nineteen times.','Carved: Follow the red tiles and you will arrive somewhere. Probably not where you hoped.','A note: The mosaic shows a map of this place. It is wrong on purpose. Please do not ask me why.','Scratched: I laid one tile crooked on day one. Nobody has noticed. I think about it daily.','Chalked: If the tiles hum, step back. If they sing, run.'],
 7:['Carved with a fine hand: Everything here that shines is not yours. Most of it is not even gold.','Scratched: The gilders left in a hurry and took the ladder. Why the ladder?','Chalked: A gold floor is a lovely thing until you have to mop it.','A note, signed with a flourish: The Gilded Ward is open to guests. The guests are not open to us.','Written very small: I took one coin. I am still carrying it. It is very heavy.','Scratched: The wealthy are polite to the end. The end is not far from here.']};
const HGPB_GEN=['Scratched: I came all this way for a dead end. It is a nice one, I will say that.','Chalked: Turn back. There is nothing here but this note, and I wrote it myself.','Scratched small: A good place to sit. Nobody has found me yet.','Carved: This wall is not a door. I checked it for an hour.','Chalked: If you have read this, the dead end got you too.','Scratched: Left at the last crossing was right. I did not.'];
const HGPB_PACE=['A pace stone, cut with a number: #. Another hand has added: and still going.','Cut into the stone: # paces from the lamp. I counted twice and got two answers.','A rune-cut stone: #. Somebody has scratched an arrow on it. The arrow points at the wall.','Pace stone #. Underneath, in chalk: Almost there. This is a lie told out of kindness.','A small stone marker: # paces. Please do not sit on the marker. Sit on the bench.','Marker stone, number #. Someone has drawn a face on it. It looks tired.'];
const HGPB_LANT={4:['hpb_lan_gold','hpb_lan_hang'],5:['hpb_cage','hpb_lan_violet'],6:['hpb_lan_lilac','hpb_lan_violet'],7:['hpb_lan_gold','hpb_lan_hang']},HGPB_COLN={4:'amber',5:'cold',6:'lilac',7:'gold'},HGPB_R={4:7,5:6,6:6,7:7},HGPB_KI={4:2.5,5:2.4,6:.95,7:1.6};
/* what stands at the end of an ordinary dead end, per biome: [picture, height in squares]. A shuffled deck per biome, so a kind never repeats within twelve squares and no kind is in every other dead end */
const HGPB_POOL={
 4:[['hpb_barrel',.55],['hpb_cask',.45],['hpb_keg',.42],['hpb_crate',.42],['hpb_bucket',.32],['art_hgxprop0',.32],['art_hgxprop1',.42],['art_hgxprop15',.42],['art_hgxprop12',.6],['art_hgxrock0',.45],['art_hgxrock2',.6],['art_hgxrock3',.3],['art_hgxprop7',.36],['hpb_tools',.42],['hpb_orecart',.55],['art_hgxprop6',.5],['hpb_skel',.5]],
 5:[['hpb_lid',.34],['hpb_cask',.45],['hpb_bell',.6],['art_hgxprop4',.55],['art_hgxrock1',.5],['art_hgxrock5',.6],['art_hgxprop2',.42],['art_hgxprop3',.24],['hpb_tools',.42],['hpb_scale',.5],['art_hgxprop0',.32],['art_hgxprop8',.3],['art_hgxprop9',.5],['hpb_cage',.5],['hpb_candle',.62],['hpb_crate',.42]],
 6:[['art_hgxprop11',.3],['hpb_orecart',.55],['hpb_minecart',.5],['hpb_scale',.5],['art_hgxprop1',.42],['art_hgxrock6',.4],['hpb_tools',.42],['hpb_bucket',.32],['hpb_lid',.34],['hpb_rune',.55],['hpb_candle',.62],['art_hgxprop3',.24],['art_hgxrock3',.3],['hpb_crate',.4],['hpb_cask',.45]],
 7:[['art_hgxprop10',.22],['hpb_gold',.24],['hpb_bell',.6],['hpb_scale',.5],['hpb_candle',.62],['art_hgxprop13',.45],['hpb_crate',.42],['hpb_skel',.5],['hpb_rune',.55],['hpb_barrel',.55],['art_hgxprop2',.42],['hpb_lid',.34],['hpb_keg',.42],['art_hgxrock2',.6]]};
const HGPB_KITS=[ // waysides on the long climbs: [picture, side, height]
 [['art_hgtb_bench',-.3,.5],['hpb_cage',.3,.5]],[['hpb_barrel',.3,.55],['art_hgxprop15',-.3,.42]],[['STAT',.32,.95],['hpb_candle',-.3,.6]],[['hpb_brazier',.3,.75],['art_hgxprop6',-.3,.45]],
 [['hpb_minecart',-.3,.5],['hpb_lid',.3,.34]],[['hpb_bell',.3,.6],['art_hgxrock2',-.3,.55]],[['hpb_crate',-.3,.42],['hpb_cask',.3,.45],['art_hgxprop1',.05,.34]],[['hpb_ladder',.3,1.2],['hpb_bucket',-.3,.3]],
 [['hpb_tools',-.3,.42],['art_hgxprop12',.3,.55]],[['hpb_keg',.3,.42],['art_hgxprop7',-.3,.36],['art_hgxrock0',.05,.4]],[['hpb_orecart',.3,.55],['art_hgxrock5',-.3,.6]],[['hpb_scale',-.3,.5],['art_hgxprop2',.3,.4]]];
function hgpbPolish2(L,E){
  const {M,W,H,bio,kind,rows,rnd,N,open,inZ,nbc,bfs,reach,cos,drop,hardAt,deadEnds,tail,chosen,zones,log,colAt,D4}=E;
  const hs=(x,y,s)=>{let h=(Math.imul(x+1,374761393)+Math.imul(y+1,668265263)+Math.imul(s+7,2147483647))>>>0;h=Math.imul(h^(h>>>13),1274126177)>>>0;return((h^(h>>>16))>>>0)/4294967296};
  const hOf=d=>(NPC_H[d.k]||0)*(d.sc||1),setH=(d,h)=>{const b=NPC_H[d.k];if(b>0)d.sc=h/b},alive=d=>!drop.has(d);
  const P2={scaled:0,nuis:0,enemyMoved:0,notes:0,dead:0,way:0,lights:0,fix:0};log.p2=P2;
  const treeH=d=>[1.5,1.9,2.3,2.6][(hs(d.x,d.y,5)*4)|0];
  // ---- 1) the scale table ----
  const R=[[/^hg_lamp$/,d=>d._big?1.5:1.3,'set'],[/^hgt_lamppost$/,()=>1.3,'set'],[/^hgtb_deco_shellstatue$/,()=>1.4,'set'],[/^hgtb_deco_pearlplinth$/,()=>.65,'set'],[/^art_hgxstat/,()=>1.35,'max'],
   [/^(sign_|hgdpc_sg_)/,()=>.6,'set'],[/^(wm_noticeboard|noticeboard)$/,()=>.75,'set'],[/^hgdpc_post/,()=>1,'set'],[/^(wm_bookshelf|hgtb_furn_bookshelf)$/,()=>1.2,'set'],[/^hg_house\d/,()=>1.9,'set'],
   [/^(hg_npc\d|hg_wizard)$/,d=>.9+.08*hs(d.x,d.y,3),'set'],[/^pickpocket$/,()=>.8,'set'],[/^hg_chest/,()=>.5,'max'],[/^hgt_vine_roundleaf$/,()=>1.8,'max'],
   [/^hgt_bulbflower$/,d=>1+.2*hs(d.x,d.y,6),'set'],[/^hgt_shellflower$/,d=>1.1+.2*hs(d.x,d.y,7),'set'],[/^hgtb_plant_spiralfern$/,d=>.75+.2*hs(d.x,d.y,8),'set'],[/^hgt_fern$/,()=>.85,'max'],[/^hgt_pearlbush$/,()=>.85,'max'],
   [/^hgt_mushrooms$/,()=>.8,'max'],[/^hgt_reeds$/,()=>.85,'max'],[/^hgtb_plantbed$/,()=>.55,'set'],[/^hgtb_table$/,()=>.5,'set'],[/^hgtb_chair$/,()=>.55,'set'],[/^hgtb_bench$/,()=>.5,'set'],[/^hgtb_furn_clock$/,()=>1.1,'set'],
   [/^hgtb_deco_banner$/,()=>1.2,'max'],[/^hgtb_deco_lanterns$/,()=>1,'max'],[/^wm_brazier$/,()=>.8,'set'],[/^hgtb_lantern$/,()=>.7,'max'],[/^wm_lantern_hang$/,()=>.7,'max'],[/^hg_lectern$/,()=>1,'set'],
   [/^(hgtb_plant_belltree|hgt_fairytree|hgt_willow|hgt_giantcap)$/,treeH,'set'],[/^gate$/,d=>d.npc==='hgd_plaque'?1.5:null,'set'],
   [/^hgdfc_/,d=>{const a=HGPB_ASP[d.k]||1,c=hOf(d);return Math.min(c,.9,1.2/a)},'set']];
  const plaque=L.decor.find(d=>d.npc==='hgd_plaque');
  for(const d of L.decor){if(!alive(d)||!d.k||d.pic||d._pbv||!inZ(d.x,d.y))continue;const b=NPC_H[d.k];if(!b)continue;
    for(const [re,fn,mode] of R){if(!re.test(d.k))continue;if(d.k==='hg_lamp'&&plaque&&Math.hypot(d.x-plaque.x,d.y-plaque.y)<=4)d._big=1;const t=fn(d);if(t==null)break;const c=hOf(d);if(mode==='set'||c>t){setH(d,t);P2.scaled++}break}
    if(/statue|plinth|^sign_|^hgdpc_sg|chest|^hg_npc|^hg_wizard|^pickpocket|^hgdpc_post|noticeboard|^gate$/.test(d.k))d.lift=Math.max(d.lift||0,.34)}
  // ---- 2) nothing tall beside a person who is talking; creatures keep away from the named people ----
  const people=L.decor.filter(d=>alive(d)&&d.npc&&!d.pic&&inZ(d.x,d.y)&&!/^hgdb_|^hgd_note|^hgd_sign|^hgd_plaque|^hgd_pa_note/.test(d.npc));
  const NUI=/lamp|tree|fern|bush|flower|vine|reeds|statue|plinth|mushroom|plant_|pillar|hgxstat|banner|brazier/;
  for(const g of people)for(const d of L.decor){if(d===g||!alive(d)||d.pic||d._pbv||d.npc||!d.k||Math.max(Math.abs(d.x-g.x),Math.abs(d.y-g.y))>1)continue;if(NUI.test(d.k)&&hOf(d)>.55&&cos(d)){drop.add(d);P2.nuis++}}
  for(const e of L.enemies){if(e.boss||e.q||e.quest||e.t==='hgdwarden'||!inZ(e.x,e.y))continue;const gs=people.filter(g=>Math.hypot(g.x-e.x,g.y-e.y)<4.6);if(!gs.length)continue;
    let best=null,bd=1e9;for(let r=5;r<=16;r++){for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const x=e.x+a,y=e.y+b;if(!open(x,y)||!inZ(x,y)||reach[y*W+x]<0||hardAt.has(x+','+y))continue;if(people.some(g=>Math.hypot(g.x-x,g.y-y)<6))continue;if(L.enemies.some(q=>q!==e&&q.x===x&&q.y===y))continue;const dd=a*a+b*b;if(dd<bd){bd=dd;best=[x,y]}}if(best)break}
    if(best){e.x=best[0];e.y=best[1];for(const [kx,ky] of [['sx','sy'],['hx','hy'],['ox','oy'],['homeX','homeY']])if(e[kx]!==undefined&&e[ky]!==undefined){e[kx]=best[0];e[ky]=best[1]}P2.enemyMoved++;(P2.movedList=P2.movedList||[]).push([e.t,Object.keys(e).join('|')])}}
  // ---- 3) notes: true for the biome where they stand, never the same words twice ----
  {const used=new Set(),bad=/hedge|honeycomb|\btree|garden/i,pool={};for(const b in HGPB_NOTES)pool[b]=HGPB_NOTES[b].slice();
   const txtOf=d=>d.pbt||(typeof HGDF_NOTES!=='undefined'?HGDF_NOTES[d.note%HGDF_NOTES.length]:'');
   for(const d of L.decor){if(!alive(d)||d.npc!=='hgd_note'||!inZ(d.x,d.y))continue;const t=txtOf(d),b=bio[d.y*W+d.x];
     if(bad.test(t)||used.has(t)||!t){const pl=pool[b]||pool[4];const i=pl.findIndex(q=>!used.has(q));const q=i>=0?pl.splice(i,1)[0]:HGPB_GEN.find(q2=>!used.has(q2));if(q){d.pbt=q;used.add(q);P2.notes++}}else used.add(t)}
   for(const d of L.decor)if(alive(d)&&d.npc==='hgdb_note'&&d.pbt)used.add(d.pbt);
   E.noteUsed=used;E.notePool=pool}
  // ---- helpers for the pieces added below ----
  const cellDec={};for(const d of L.decor)if(alive(d)&&!d.pic&&!d.hgdl){(cellDec[d.x+','+d.y]=cellDec[d.x+','+d.y]||[]).push(d)}
  const picAt=new Set();for(const d of L.decor)if(alive(d)&&d.pic&&d.wd)picAt.add(d.x+','+d.y+','+d.wd[0]+','+d.wd[1]);
  const itemAt=new Set(L.items.map(i=>i.x+','+i.y)),enAt=new Set(L.enemies.map(e=>e.x+','+e.y));
  const put=(k,x,y,sc,side,ob,extra)=>{const px=ob?-ob[1]:0,py=ob?ob[0]:0,o=Object.assign({k,x,y,block:false,walk:true,deco:true,sc,ox:px*side,oy:py*side,_pbv:1},extra||{});L.decor.push(o);(cellDec[x+','+y]=cellDec[x+','+y]||[]).push(o);return o};
  const isWallCell=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&E.isW(rows[y][x]);
  const wallDirs=(x,y)=>D4.filter(([a,b])=>!open(x+a,y+b)&&isWallCell(x+a,y+b));
  const biomeOf=(x,y)=>bio[y*W+x];
  const lantern=(x,y,nm)=>{const wd=wallDirs(x,y).filter(([a,b])=>!picAt.has(x+','+y+','+a+','+b));if(!wd.length)return false;const w=wd[(hs(x,y,11)*wd.length)|0],b=biomeOf(x,y),lst=HGPB_LANT[b]||HGPB_LANT[4],k=nm||lst[(hs(x,y,12)*lst.length)|0];
    L.decor.push({k,x,y,wd:[w[0],w[1]],pic:1,block:false,walk:true,deco:true,bob:.3+.12*hs(x,y,13),lift:.62,_pbv:1});picAt.add(x+','+y+','+w[0]+','+w[1]);return true};
  const mustLight=[];
  // ---- 4) every dead end ends in something, on the axis of the corridor, with a light and a line of text ----
  const putH=(k0,x,y,h,side,ob,extra)=>{const k=hpbTint(k0,Math.max(4,Math.min(7,biomeOf(x,y))));return put(k,x,y,h/(NPC_H[k]||1),side,ob,extra)};
  {const deck={},placed=[];const draw=(b,x,y)=>{const pl=HGPB_POOL[b]||HGPB_POOL[4];let e=null;for(let t=0;t<6;t++){if(!deck[b]||!deck[b].length){const d2=pl.slice();for(let i=d2.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[d2[i],d2[j]]=[d2[j],d2[i]]}deck[b]=d2}
       e=deck[b].pop();if(!placed.some(q=>q.k===e[0]&&Math.hypot(q.x-x,q.y-y)<12))break}placed.push({k:e[0],x,y});return e};
   for(const [x,y] of deadEnds){if(chosen.some(h=>h.c.x===x&&h.c.y===y))continue;const ob=D4.find(([a,b])=>open(x+a,y+b));if(!ob)continue;const b=biomeOf(x,y);
     const fur=c=>(cellDec[c]||[]).some(d=>!d.hgdl&&(Math.abs(d.ox||0)<.35&&Math.abs(d.oy||0)<.35)&&hOf(d)>.2)||itemAt.has(c)||enAt.has(c);
     mustLight.push([x+ob[0],y+ob[1]]);
     if(!fur(x+','+y)&&!fur((x+ob[0])+','+(y+ob[1]))){const e=draw(b,x,y);putH(e[0],x,y,e[1]*(1+.2*hs(x,y,14)),0,ob);P2.dead++}
     if(!picAt.has(x+','+y+','+(-ob[0])+','+(-ob[1]))){const pl=(E.notePool[b]||[]).concat(HGPB_GEN),q=pl.find(s=>!E.noteUsed.has(s));if(q){E.noteUsed.add(q);const i=E.notePool[b]?E.notePool[b].indexOf(q):-1;if(i>=0)E.notePool[b].splice(i,1);
       L.decor.push({k:'hl_p_note',x,y,wd:[-ob[0],-ob[1]],pic:1,block:false,walk:true,deco:true,npc:'hgdb_note',pbt:q,label:hpbLabel(q),bob:.6,lift:.45,_pbv:1});picAt.add(x+','+y+','+(-ob[0])+','+(-ob[1]))}}}}
  // ---- 5) the long straight climbs: a wayside every dozen squares (bench and lantern, a pack, a statue, a brazier, a cart, a bell) and a pace stone ----
  {const isC=(x,y,ax)=>open(x,y)&&inZ(x,y)&&!kind[y*W+x]&&reach[y*W+x]>=0&&(ax?(open(x,y-1)&&open(x,y+1)&&(open(x-1,y)?1:0)+(open(x+1,y)?1:0)<=1):(open(x-1,y)&&open(x+1,y)&&(open(x,y-1)?1:0)+(open(x,y+1)?1:0)<=1));
   const sideClosed=(x,y,ax)=>ax?(!open(x-1,y)&&!open(x+1,y)):(!open(x,y-1)&&!open(x,y+1));
   const runs=[];for(let ax=0;ax<2;ax++){const A=ax?W:H,B=ax?H:W;for(let a=0;a<A;a++){let st=-1;for(let b=0;b<=B;b++){const x=ax?a:b,y=ax?b:a,ok=b<B&&isC(x,y,ax);if(ok&&st<0)st=b;if(!ok&&st>=0){if(b-st>=22)runs.push({ax,a,s:st,e:b-1});st=-1}}}}
   let ri=0;for(const r of runs){const n=r.e-r.s+1,step=Math.max(11,Math.min(15,Math.round(n/Math.ceil(n/13)))),ob=r.ax?[0,1]:[1,0];let j=0,kit=(ri*3)%HGPB_KITS.length;
     for(let b=r.s+5;b<=r.e-4;b+=step,j++){let cell=null;for(const dd of [0,1,-1,2,-2,3,-3]){const bb=b+dd,x=r.ax?r.a:bb,y=r.ax?bb:r.a;if(bb<r.s+2||bb>r.e-2)continue;let ok=true;for(let u=-1;u<=1&&ok;u++){const xx=r.ax?x:x+u,yy=r.ax?y+u:y;if(((cellDec[xx+','+yy]||[]).some(d=>hOf(d)>.3&&!d.hgdl))||itemAt.has(xx+','+yy)||enAt.has(xx+','+yy))ok=false}if(ok&&sideClosed(x,y,r.ax)){cell=[x,y,bb];break}}
       if(!cell)continue;const [x,y,bb]=cell,K=HGPB_KITS[kit++%HGPB_KITS.length],side0=hs(x,y,15)<.5?1:-1;
       for(const [k0,side,h] of K){let k=k0;if(k==='STAT')k='art_hgxstat'+((hs(x,y,16)*8)|0);putH(k,x,y,h,side*side0,ob)}
       const pw=r.ax?[side0>0?-1:1,0]:[0,side0>0?-1:1];if(!picAt.has(x+','+y+','+pw[0]+','+pw[1])&&isWallCell(x+pw[0],y+pw[1])){const q=HGPB_PACE[(ri+j)%HGPB_PACE.length].replace('#',String(bb-r.s+1)+' of '+n);
         L.decor.push({k:'hpb_rune',x,y,wd:pw,pic:1,block:false,walk:true,deco:true,npc:'hgdb_note',pbt:q,label:'Pace Stone '+(bb-r.s+1),bob:.5,lift:.5,_pbv:1});picAt.add(x+','+y+','+pw[0]+','+pw[1])}
       mustLight.push([x,y]);P2.way++}
     ri++}}
  // ---- 6) round three: shop signs, notice boards and quest givers in proportion, nothing on the approach to a giver, no bare dead end, a title for every note and sign ----
  {const givers=L.decor.filter(d=>alive(d)&&d.npc&&!d.pic&&inZ(d.x,d.y)&&!/^hgdb_|^hgd_note|^hgd_sign|^hgd_plaque|^hgd_pa_note/.test(d.npc)&&!(d.npc==='hgdpc_text'&&/^hgdpc_(ss|nb|post|sg)/.test(d.k)));
   const nearest=d=>{let b=null,bd=9;for(const g of givers){if(g===d)continue;const dd=Math.hypot(g.x-d.x,g.y-d.y);if(dd<bd){bd=dd;b=g}}return b&&bd<=1.6?b:null};
   for(const d of L.decor){if(!alive(d)||d.pic||!d.k||!inZ(d.x,d.y)||d._pbv)continue;
     if(d.npc==='hgdpc_text'&&/^hgdpc_(vn|hp)/.test(d.k)&&NPC_H[d.k]){setH(d,.95);P2.fix++}
     else if(/^hgdpc_(ss|nb|post)/.test(d.k)&&NPC_H[d.k]){setH(d,/^hgdpc_ss/.test(d.k)?.6:/^hgdpc_nb/.test(d.k)?.6:1);d.lift=Math.max(d.lift||0,.34);P2.fix++;
       const g=nearest(d);if(g){const dx=d.x-g.x,dy=d.y-g.y,px=-dy,py=dx,m=Math.hypot(px,py)||1,sd=hs(d.x,d.y,44)<.5?1:-1;d.ox=(d.ox||0)+px/m*.44*sd-dx*.3;d.oy=(d.oy||0)+py/m*.44*sd-dy*.3;if(dx===0&&dy===0){d.ox=.44*sd}}}}
   const CLR=/rock|stat|plinth|stone|pillar|mushroom|fern|flower|bush|vine|reeds|plant_|tree|willow/;
   for(const g of givers)for(const d of L.decor){if(!alive(d)||d.pic||d._pbv||d.npc||!d.k||!cos(d)||!CLR.test(d.k)||hOf(d)<=.45)continue;if(Math.max(Math.abs(d.x-g.x),Math.abs(d.y-g.y))<=2){drop.add(d);P2.nuis++}}
   // a dead end with nothing within two squares of its end gets one prop
   {const ones=new Set(L.decor.filter(d=>alive(d)&&d.npc&&d.npc.startsWith('hgdb_note')&&!d.pic).map(d=>d.x+','+d.y));
    for(const [x,y] of deadEnds){const ob=D4.find(([a,b])=>open(x+a,y+b));if(!ob)continue;let has=false;
      for(let t=0;t<3&&!has;t++){const c=(x+ob[0]*t)+','+(y+ob[1]*t);if(itemAt.has(c)||enAt.has(c)||(cellDec[c]||[]).some(d=>alive(d)&&!d.pic&&!d.hgdl&&hOf(d)>.25))has=true}
      if(!has){const b=biomeOf(x,y),pl=HGPB_POOL[b]||HGPB_POOL[4],e=pl[(hs(x,y,46)*pl.length)|0];putH(e[0],x,y,e[1]*1.15,0,ob);P2.dead++;P2.fix++}}}
   // the cell in front of every key door and gem door gets one prop, to the side (a vault door with nothing in front of it looks unfinished)
   for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const cc=rows[y].charCodeAt(x);if(cc<0x308||cc>0x311||!inZ(x,y))continue;
     for(const [a,b] of D4){const fx=x+a,fy=y+b;if(!open(fx,fy)||!inZ(fx,fy))continue;const c=fx+','+fy;
       if(itemAt.has(c)||enAt.has(c)||(cellDec[c]||[]).some(d=>alive(d)&&!d.pic&&!d.hgdl&&hOf(d)>.25))continue;
       const bb=biomeOf(fx,fy),pl=HGPB_POOL[bb]||HGPB_POOL[4],e=pl[(hs(fx,fy,47)*pl.length)|0],side=hs(fx,fy,48)<.5?1:-1;putH(e[0],fx,fy,e[1]*1.1,.3*side,[a,b]);P2.fix++;P2.doorProps=(P2.doorProps||0)+1}}
   // a title and some text for every note and sign of the zone (the text agent draws the writing; the title is the name the game shows for it)
   const sgTxt=d=>{const z=d.zone!==undefined?L_ZONES()[d.zone]:null;return 'DANGER. '+(z?z.name:'The danger')+' lies ahead. '+(z?'Slugs, jellies, worms and bugs':'Creatures')+' live beyond this sign, and they do not stop. Turn back.'};
   for(const d of L.decor){if(!alive(d)||!inZ(d.x,d.y)||!d.npc)continue;
     if(d.npc==='hgd_note'){if(!d.pbt){const q=(E.notePool[bio[d.y*W+d.x]]||[]).concat(HGPB_GEN).find(t=>!E.noteUsed.has(t));if(q){E.noteUsed.add(q);d.pbt=q}else if(typeof HGDF_NOTES!=='undefined')d.pbt=HGDF_NOTES[(d.note||0)%HGDF_NOTES.length]}
       if(!d.pbt)d.pbt='Scratched into the wall: Someone was here, and they did not stay.';d.label=hpbLabel(d.pbt);P2.titled=(P2.titled||0)+1}
     else if(d.npc==='hgdb_note'||d.npc==='hgdb_post'){if(!d.pbt)d.pbt='A worn stone with a few scratches. Someone was here, and they did not stay.';if(!d.label)d.label=hpbLabel(d.pbt);P2.titled=(P2.titled||0)+1}
     else if(d.npc==='hgd_sign'){if(!d.pbt)d.pbt=sgTxt(d);if(!d.label){const z=d.zone!==undefined?L_ZONES()[d.zone]:null;d.label='Danger: '+(z?z.name.replace(/^The /,'').split(' ').slice(0,2).join(' '):'Ahead');}P2.titled=(P2.titled||0)+1}}}
  L._hgpbMust=mustLight;
}
/* The game copies only a fixed list of fields from the level's decor to the live decor (G.decor): the text of a note or signpost (pbt), the note number, the danger zone, a picture's height off the floor (when it is 0) and its glow
   were all dropped, so every note and signpost said the same worn-away line. They are copied back here, once, when the level is set up. */
function hgpbCopyDecor(){const L=LEVELS[HGD.ID];if(!L||!G.decor||typeof DECOR_SPAWNS==='undefined')return;const F=['pbt','note','zone','lift','bob','text','sc','label','ox','oy'],map=new Map();
  for(const s of DECOR_SPAWNS){const k=s.k+'|'+s.x+'|'+s.y+'|'+(s.wd?s.wd[0]+','+s.wd[1]:'')+'|'+(s.ox||0)+'|'+(s.oy||0);(map.get(k)||map.set(k,[]).get(k)).push(s)}
  for(const d of G.decor){const a=map.get(d.k+'|'+d.x+'|'+d.y+'|'+(d.wd?d.wd[0]+','+d.wd[1]:'')+'|'+(d.ox||0)+'|'+(d.oy||0));if(!a)continue;const s=a.length>1&&d.npc?(a.find(q=>q.npc===d.npc)||a[0]):a[0];for(const f of F)if(s[f]!==undefined&&d[f]===undefined)d[f]=s[f]}}
/* Coloured pools of light. This runs when the level is first set up (not when it is built), because some wall pieces turn into open ways after the build and the light has to reach the final maze:
   the cell farthest from any light gets one, until every corridor has a light within a few squares (path distance, so a wall hides the light). Some get a lantern hung on the wall. */
function hgpbHs(x,y,s){let h=(Math.imul(x+1,374761393)+Math.imul(y+1,668265263)+Math.imul(s+7,2147483647))>>>0;h=Math.imul(h^(h>>>13),1274126177)>>>0;return((h^(h>>>16))>>>0)/4294967296}
function hgpbLights(L){if(!L||L._hgpbLit||!L._hgdm)return;L._hgpbLit=1;const M=L._hgdm,W=M.W,H=M.H,bio=M.bio,rows=L.rows,N=W*H,D4=[[0,-1],[1,0],[0,1],[-1,0]],P2=(L._hgpb&&L._hgpb.log&&L._hgpb.log.p2)||{};
  const isW=c=>!c||c==='#'||HPB_WCH(c),open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.',inZ=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&bio[y*W+x]>=4,biomeOf=(x,y)=>bio[y*W+x];
  const nbc=(x,y)=>D4.reduce((n,[a,b])=>n+(open(x+a,y+b)?1:0),0);
  const reach=new Uint8Array(N);{const q=[[L.start.x,L.start.y]];reach[L.start.y*W+L.start.x]=1;for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of D4){const nx=x+a,ny=y+b;if(open(nx,ny)&&!reach[ny*W+nx]){reach[ny*W+nx]=1;q.push([nx,ny])}}}}
  const COLS={amber:[1.4,1,.5],cold:[.5,.9,1.5],pale:[1.15,1.1,.9],lilac:[1.15,.65,1.45],gold:[1.5,1.15,.45],teal:[.5,1.2,1.1]};L._hgpbCol=L._hgpbCol||{};
  const colAt=(x,y,nm,kI)=>{const c=COLS[nm]||COLS.amber;L._hgpbCol[x+','+y]=[c[0],c[1],c[2],kI||1.3]};
  const picAt=new Set();for(const d of L.decor)if(d.pic&&d.wd)picAt.add(d.x+','+d.y+','+d.wd[0]+','+d.wd[1]);
  const lantern=(x,y)=>{const wd=D4.filter(([a,b])=>!open(x+a,y+b)&&x+a>=0&&y+b>=0&&x+a<W&&y+b<H&&isW(rows[y+b][x+a])&&!picAt.has(x+','+y+','+a+','+b));if(!wd.length)return;const w=wd[(hgpbHs(x,y,11)*wd.length)|0],lst=HGPB_LANT[biomeOf(x,y)]||HGPB_LANT[4],k=hpbTint(lst[(hgpbHs(x,y,12)*lst.length)|0],biomeOf(x,y));
    const o={k,x,y,wd:[w[0],w[1]],pic:1,block:false,walk:true,deco:true,bob:.3+.12*hgpbHs(x,y,13),lift:.62,_pbv:1};L.decor.push(o);picAt.add(x+','+y+','+w[0]+','+w[1]);if(typeof G!=='undefined'&&G.decor&&LEVEL===HGD.ID)G.decor.push(Object.assign({},o,{loot:false,shop:false}))};
  const dist=new Int16Array(N).fill(9999);const grow=(x,y,lim)=>{if(!open(x,y))return;const q=[[x,y]];dist[y*W+x]=0;for(let i=0;i<q.length;i++){const [cx,cy]=q[i],dd=dist[cy*W+cx];if(dd>=lim)continue;for(const [a,b] of D4){const nx=cx+a,ny=cy+b;if(open(nx,ny)&&dist[ny*W+nx]>dd+1){dist[ny*W+nx]=dd+1;q.push([nx,ny])}}}};
  for(const l of L.lights)grow(l[0],l[1],14);
  const addL=(x,y,fix)=>{L.lights.push([x,y]);colAt(x,y,HGPB_COLN[biomeOf(x,y)]||'amber',HGPB_KI[biomeOf(x,y)]||1.4);grow(x,y,14);P2.lights=(P2.lights||0)+1;if(fix&&hgpbHs(x,y,17)<.7)lantern(x,y)};
  for(const [x,y] of (L._hgpbMust||[]))if(open(x,y)&&dist[y*W+x]>3)addL(x,y,true);
  const cells=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(inZ(x,y)&&open(x,y)&&reach[y*W+x])cells.push(y*W+x);
  for(const l of L.lights)if(inZ(l[0],l[1])&&!L._hgpbCol[l[0]+','+l[1]]){const b=biomeOf(l[0],l[1]);colAt(l[0],l[1],HGPB_COLN[b]||'amber',HGPB_KI[b]||1.4)}
  for(let it=0;it<1200;it++){let bi=-1,bs=0;for(const c of cells){const x=c%W,y=(c/W)|0,s=dist[c]-HGPB_R[biomeOf(x,y)];if(s>bs||(s===bs&&s>0&&bi>=0&&nbc(x,y)>nbc(bi%W,(bi/W)|0))){bs=s;bi=c}}if(bi<0)break;addL(bi%W,(bi/W)|0,true)}
  P2.left=cells.filter(c=>dist[c]-HGPB_R[biomeOf(c%W,(c/W)|0)]>0).length;P2.cells=cells.length}
{const _sl=setupLights;setupLights=function(){try{if(LEVEL===HGD.ID)hgpbLights(LEVELS[HGD.ID])}catch(e){console.error('hgpbLights',e)}_sl.apply(this,arguments);try{if(LEVEL===HGD.ID){hgpbCopyDecor();const L=LEVELS[HGD.ID],C=L&&L._hgpbCol;if(C)for(const l of LIGHTS){if(!l.free||l.lamp||l.red)continue;const c=C[Math.floor(l.x)+','+Math.floor(l.y)];if(c){l.col=[c[0],c[1],c[2]];l.kI=c[3];l.range2=130;l.calm=true}}}}catch(e){}}}
