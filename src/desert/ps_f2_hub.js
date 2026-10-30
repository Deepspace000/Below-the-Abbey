/* ==========================================================================
   THE PALE SPIRE, SECOND FLOOR: THE HALL OF ILLUSIONS (level 9820, 56 x 44, indoor, rating 103; prefix psf2 / PSF2H). See tools/PS_F2_SPEC.md and tools/PS_F2_NOTES.md.
   A small gothic hall in the style of the Great Halls (9740): the same carved black stone (pshTile), marble chequer, violet runners, columns and a ribbed vault.
     The Stair Landing (south): the Grand Stair comes up at (28,38); the Dreamkeeper stands beside it and gives psq40, "The Sleeper's Pieces".
     The Hall of Illusions (the nave, x 24 to 32): columns down both sides, the Sleeper's table on a dais at the crossing (28,22).
     The Gallery of Doors (north, y 4 to 6): five doors in the north wall (forest, island, snow, waterways, desert); the West Arm and the East Arm lead to the swamp door (2,22) and the nightmare door (53,22).
     Four small side rooms between the gallery and the arms (mirrors, books of dreams, masks, sleepers' beds), the Quiet Chapel (a rest room) and the Gallery of the Sleeper (her story).
   The Sleeper's table: seven hollows; placing a piece takes it from the bag (psf2F().placed). With all seven placed the Sleeper wakes (F.woke), speaks, and the quest is ready;
   the Dreamkeeper hands out the reward (once, by the quest) and F.done is set. A sealed iron stair at the east end of the gallery is the way to the third floor (not open yet).
   ========================================================================== */
const PSF2H={ID:9820,W:56,H:44,WH:3.2,TABLE:[28,22],KEEPER:[26,35],STAIR3:[52,5]};
/* painted pieces wanted (assets/ps/<name>.webp replaces the stand-in with no code change) */
{const P=(n,h,src,o)=>{PSP_PICS[n]=[h,src,o||{}]};
 P('f2_dreamkeeper',1.0,['ps_p_librarian','kh_ohfolk6_0'],{keep:1});
 P('f2_bier',1.0,['ps_altar','hl_p_tomb'],{keep:1});
 P('f2_sleeper',1.1,['hl_p_tomb','ps_altar'],{keep:1});
 P('f2_sleeper_up',1.0,['ps_p_ghost_lady','gyi_banshee'],{keep:1})}
const PSF2_HINT={
  hand:"The Perfect Forest. In the middle of a glade stand four standing stones, each carved with a season, and an old hollow oak. Touch the stones in the order of the year, spring first. The hand is in the oak.",
  foot:"The Island by the Sea. Read the message in the bottle on the shore, then fetch the spade from the fisherman's hut and dig in the sand patch whose shell matches the drawing. The wrong patch has crabs in it.",
  face:"The Cabin in the Snow. The hearth in the cabin is cold. Three logs lie in the snow round the cabin, and the flint is on a post by the woodpile. Lay the logs on the hearth and strike the flint. The fire will melt the ice on the mirror.",
  chest:"The Waterways. A locked palazzo door at the north end has three carnival masks beside it. The plaque says the Doge lets in only the one who watches and says nothing. Choose that mask. The wrong one wakes the eels.",
  legs:"The Desert. In the sunken temple court, the wall frieze shows four symbols in a row. Step on the floor tiles in that order. The wrong tile lets out scorpions. Then the sarcophagus opens.",
  heart:"The Swamp. The witch's note by her cauldron asks for a toadstool, an eel and a clump of marsh moss. All three are out in the swamp, at small marked places. Put them in the pot.",
  brain:"The Nightmare. Four lanterns stand in a ring. Watch them light one after another, then touch them in the same order. Get it wrong and the shadows come. Get it right and the jar opens."};
const psf2Placed=()=>PSF2.PARTS.filter(p=>psf2F().placed[p]).length;
/* ---------- the level ---------- */
function psf2HubBuild(info){
  const W=PSF2H.W,H=PSF2H.H,id=PSF2H.ID;
  try{gyAlias();pshPics()}catch(e){}
  const fl=pshFloors();   // marble chequer, flags, violet runner, wood, carpet, dais, black marble (the Great Halls' own floors) and the ribbed vault psc_hall
  const FK={h_chq:fl[0],h_flag:fl[1],h_run:fl[2],h_wood:fl[3],h_carpet:fl[4],h_dais:fl[5],h_black:'psf_black'};
  for(const k in FK)PSPK.floors[k]=FK[k];
  const C=pspMake({id,start:{x:28,y:38,f:0},floor:'h_chq',wh:PSF2H.WH,amb:.3,lcol:PSH_COL.cold,kind:'in'});
  const {rows,block}=C,hs=(a,b,c)=>hash2(a,b,c+id),room=new Int8Array(W*H).fill(-1),ix=(x,y)=>y*W+x;
  const ROOMS=[]; // [name, style]
  const R=(x0,y0,x1,y1,floor,name,style,at)=>{const r=ROOMS.length;ROOMS.push([name,style]);C.room(x0,y0,x1,y1,{floor,name,at});for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)room[ix(x,y)]=r;return r};
  const P=(x0,y0,x1,y1,r,floor)=>{C.carve(x0,y0,x1,y1);C.setFloor(x0,y0,x1,y1,floor||'h_chq');for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)room[ix(x,y)]=r};
  const rG=R(4,4,51,6,'h_chq','The Gallery of Doors','gallery',[28,5]);
  const rN=R(24,7,32,33,'h_chq','The Hall of Illusions','hall',[28,13]);
  const rW=R(3,20,23,24,'h_chq','The West Arm','statues',[12,22]);
  const rE=R(33,20,52,24,'h_chq','The East Arm','statues',[44,22]);
  const rS=R(24,34,32,40,'h_flag','The Stair Landing','stair',[28,36]);
  const rQ=R(16,35,21,39,'h_carpet','The Quiet Chapel','lady',[18,37]);
  const rY=R(35,35,40,39,'h_flag','The Gallery of the Sleeper','gallery',[37,37]);
  const rM=R(6,9,12,16,'h_black','The Room of Mirrors','salon',[9,12]);
  const rB=R(15,9,21,16,'h_wood','The Library of Dreams','trophy',[18,12]);
  const rK=R(35,9,41,16,'h_flag','The Room of Masks','banquet',[38,12]);
  const rD=R(44,9,50,16,'h_carpet',"The Sleepers' Beds",'lady',[47,12]);
  // passages: from the gallery south into the side rooms (under the forest, island, waterways and desert doors), from the side rooms into the arms, between the side rooms, the chapel and the Sleeper's gallery
  P(9,7,9,8,rM);P(9,17,9,19,rM);P(19,7,19,8,rB);P(18,17,18,19,rB);P(13,12,14,12,rM);P(22,12,23,12,rB);
  P(39,7,39,8,rK);P(38,17,38,19,rK);P(49,7,49,8,rD);P(47,17,47,19,rD);P(42,12,43,12,rK);P(33,12,34,12,rK);
  P(22,37,23,37,rQ,'h_carpet');P(33,37,34,37,rY,'h_flag');
  P(3,22,3,22,rW);P(52,22,52,22,rE);
  // runners and the dais
  C.setFloor(6,5,49,5,'h_run');C.setFloor(28,7,28,17,'h_run');C.setFloor(28,27,28,37,'h_run');C.setFloor(5,22,23,22,'h_run');C.setFloor(33,22,50,22,'h_run');
  C.setFloor(26,19,30,25,'h_dais');
  // ---- the links (the contract table): the seven illusion doors and the Grand Stair down; painted doors of the castle ----
  const doorGid=(st)=>{try{return pspDoorGid(st,PSF2H.WH)}catch(e){return null}};
  for(const l of pspLinksFrom(id)){if(!l.at)continue;const g=pspPortal(C,l,{style:'great'});const st=/Grand Stair/.test(l.name)?'stairarch':'great',b=doorGid(st);if(g!=null&&b!=null&&T_TILE[b]!==undefined){T_TILE[g]=T_TILE[b];if(GY.col&&GY.col[b])GY.col[g]=GY.col[b]}}
  // the stair to the third floor: an iron door that does not open yet
  {const b=doorGid('iron'),g=KH_NEXT_GID++;T_TILE[g]=T_TILE[b];if(GY.col&&GY.col[b])GY.col[g]=GY.col[b];KH_DOOR[g]={psf2:'stair3'};C.carve(51,5,51,5);C.solid(52,5,C.ch(g));C.used.add('52,5')}
  // keep clear: every landing (3 by 3), the stair arrival, the passages
  for(const l of PSP.LINKS)if(l.to===id&&l.land)C.reserve(l.land[0]-1,l.land[1]-1,l.land[0]+1,l.land[1]+1);
  C.reserve(27,37,29,40);C.reserve(50,4,51,6);
  // ---- the dressing ----
  const pic=(n,x,y,wd,o)=>{const k=pspPic(n);if(!C.isOpen(x,y))return null;const bx=x+wd[0],by=y+wd[1];if(rows[by][bx]==='.')return null;return C.dec(k,x,y,Object.assign({wd,block:false},o||{}))};
  const prop=(n,x,y,o)=>{if(!C.free(x,y))return null;return C.prop(n,x,y,o)};
  const cand=(x,y,col)=>{if(!C.free(x,y))return;C.cand(x,y,col||PSH_COL.cold)};
  // the gallery: a painted name plaque beside every door, banners and mirrors between the doors (the place of illusions: mirrors everywhere)
  const NAMES={9821:'THE PERFECT FOREST',9822:'THE ISLAND BY THE SEA',9823:'THE CABIN IN THE SNOW',9824:'THE WATERWAYS',9825:'THE DESERT',9826:'THE SWAMP',9827:'THE NIGHTMARE'};
  for(const l of pspLinksFrom(id)){if(!NAMES[l.to])continue;const [x,y]=l.at;
    if(y===3){C.sign(x+1,4,[0,-1],NAMES[l.to]);cand(x-2,4)}
    else if(x===2){C.sign(4,20,[0,-1],NAMES[l.to]);cand(4,24)}
    else{C.sign(51,20,[0,-1],NAMES[l.to]);cand(51,24)}}
  for(const x of [14,24,34,44]){pic(x===24||x===34?'mirror_haunted_a':'banner_long_a',x,4,[0,-1]);pic('banner_long_b',x,6,[0,1])}
  for(const x of [5,50])pic('window_stained_tall',x,6,[0,1]);
  // the nave: two rows of columns, stained windows high on the side walls, candelabra by the dais
  for(const y of [9,12,15,29,32]){C.column(25,y,y%2?'twist':'fluted');C.column(31,y,y%2?'twist':'fluted')}
  for(const [x,y] of [[25,18],[31,18],[25,26],[31,26]])C.column(x,y,'silver');
  for(const y of [10,14,28,31])for(const [x,wd] of [[24,[-1,0]],[32,[1,0]]])pic(y===14||y===28?'window_stained_tall':'portrait_ancestor_'+(1+((y+x)%8)),x,y,wd);
  for(const [x,y] of [[26,20],[30,20],[26,24],[30,24]])cand(x,y,[.75,.9,1.25]);
  // the Sleeper's table at the crossing
  C.used.delete('28,22');C.dec(pspPic('f2_bier'),28,22,{block:true,npc:'psf2_table',sc:1});
  C.light(28,22,[.85,.95,1.3]);
  {C.used.delete('28,24');const d=C.dec(pspPic('f2_sleeper_up'),28,24,{block:false,npc:'psf2_sleeper'});if(d)d.hidden=true}
  // the arms: columns in rows (aisles), alcoves with statues, candles
  for(const x of [8,11,14,17,20]){prop('col_fluted',x,20);prop('col_fluted',x,24)}
  for(const x of [36,39,42,45,48]){prop('col_twist',x,20);prop('col_twist',x,24)}
  for(const [x,y,wd,n] of [[6,24,[0,1],'alcove_weeper'],[12,24,[0,1],'alcove_maiden'],[19,24,[0,1],'alcove_monk'],[37,24,[0,1],'alcove_knight'],[43,24,[0,1],'alcove_weeper'],[50,24,[0,1],'alcove_maiden'],
    [13,20,[0,-1],'mirror_haunted_b'],[22,20,[0,-1],'portrait_ancestor_3'],[34,20,[0,-1],'portrait_ancestor_5'],[44,20,[0,-1],'mirror_haunted_c']])pic(n,x,y,wd);
  // the Room of Mirrors: mirrors on every wall, a single candelabra in the middle
  for(const [x,y,wd] of [[7,9,[0,-1]],[11,9,[0,-1]],[6,11,[-1,0]],[6,14,[-1,0]],[12,10,[1,0]],[12,15,[1,0]],[7,16,[0,1]],[11,16,[0,1]]])pic(['mirror_haunted_a','mirror_haunted_b','mirror_haunted_c'][(x+y)%3],x,y,wd);
  cand(9,12);prop('furn_mirror_gothic',7,12);prop('furn_mirror_gothic',11,13);
  // the Library of Dreams: bookcases along the walls, a reading desk and a lectern with the book of dreams
  for(const [x,y] of [[15,9],[17,9],[21,9],[15,16],[21,16]])prop('bookcase_tall',x,y);
  prop('reading_desk',18,13);if(C.free(16,12)){C.used.delete('16,12');C.dec(pspPic('lectern'),16,12,{block:true,npc:'psf2_book'})}cand(20,11,[1.3,1.0,.6]);
  // the Room of Masks: masks of carnivals painted on the walls (portraits of masked faces), a long table, candles
  for(const [x,y,wd] of [[36,9,[0,-1]],[40,9,[0,-1]],[35,11,[-1,0]],[41,14,[1,0]]])pic('portrait_ancestor_'+(1+(x+y)%8),x,y,wd);
  prop('furn_table_long_black',38,13);prop('furn_chair_dining_black',37,13);prop('furn_chair_dining_black',39,13);cand(36,15);cand(40,10);
  // the Sleepers' Beds: four canopied beds with cobwebs, people who once slept here and never woke
  for(const [x,y] of [[45,10],[49,10],[45,15],[49,15]])prop((x+y)&1?'furn_bed_canopy':'bed_four',x,y);
  pic('portrait_ancestor_6',47,9,[0,-1]);pic('window_sheeted_a',50,13,[1,0]);pic('window_sheeted_b',44,12,[-1,0]);
  cand(47,12,[.75,.9,1.25]);
  // the Quiet Chapel (rest): a bed, a chest, warm candles; the Gallery of the Sleeper: her portrait and her story
  pspRest(C,{x0:16,y0:35,x1:21,y1:39,bed:[17,36],chest:[20,39],name:'The Quiet Chapel',line:'A small quiet chapel. Warm candles burn here, and nothing that lives in the illusions can come in.'});
  pic('window_stained',18,35,[0,-1]);pic('altar',16,38,[-1,0]);
  for(const [x,y,wd,n] of [[37,35,[0,-1],'pt_isaude'],[40,37,[1,0],'portrait_ancestor_7'],[35,39,[0,1],'portrait_ancestor_2']])pic(n,x,y,wd);
  if(C.free(38,36)){C.used.delete('38,36');C.dec(pspPic('lectern'),38,36,{block:true,npc:'psf2_story'})}
  cand(36,38,[1.3,1.0,.6]);
  // the Stair Landing: the Dreamkeeper beside the stair, candelabra, banners
  C.used.delete(PSF2H.KEEPER.join(','));C.dec(pspPic('f2_dreamkeeper'),PSF2H.KEEPER[0],PSF2H.KEEPER[1],{block:true,npc:'psf2_keeper'});
  C.light(26,35,[1.2,1.0,.7]);cand(25,40);cand(31,40);for(const x of [25,31])pic('banner_long_a',x,34,[0,-1]);
  pic('window_great',32,36,[1,0]);pic('window_great',24,39,[-1,0]);
  // no creatures on this floor's hub: it is a safe hall
  pspSafeRect(C,2,2,W-3,H-3);
  // ---- the walls: the Great Halls' carved stone, the style of the room beside it ----
  const styleAt=(x,y)=>{for(const [a,b] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]){const xx=x+a,yy=y+b;if(xx>=0&&yy>=0&&xx<W&&yy<H&&rows[yy][xx]==='.'&&room[ix(xx,yy)]>=0)return ROOMS[room[ix(xx,yy)]][1]}return 'hall'};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(rows[y][x]==='.')continue;const g=C.chars[rows[y][x]];if(g!==undefined&&KH_DOOR[g])continue;
    const st=styleAt(x,y),edge=x===0||y===0||x===W-1||y===H-1;let kind='plain';
    if(!edge&&(y===3||y===41)&&x%5===2)kind='win';else if(!edge&&(x===23||x===33)&&y>=8&&y<=32&&y%4===0)kind='pilaster';
    C.solid(x,y,C.ch(pshTile(st,kind,kind==='plain'?(hs(x,y,3)*2)|0:0)))}
  C.glow(6.5,PSH_COL.cold);
  const lv=C.finish({start:{x:28,y:38,f:0}});
  lv.floorSet=C.floorNames.map(n=>FK[n]||pspFloor(n));while(lv.floorSet.length<7)lv.floorSet.push(lv.floorSet[0]);lv.floor=lv.floorSet[0];lv.floor2=lv.floorSet[1];
  lv.ceil='psc_hall';lv.ceilH=PSF2H.WH;
  try{if(typeof pswaHang==='function')pswaHang(id,lv)}catch(e){console.error('psf2 wallart',e)}
  return lv}
pspRegister(PSF2H.ID,psf2HubBuild);
/* ---------- the people and the things to touch ---------- */
khNpc('psf2_keeper','The Dreamkeeper','ps_f2_dreamkeeper',()=>say("Welcome to the second floor of the Pale Spire. This is the Hall of Illusions. I am the Dreamkeeper. I keep the doors, and I keep the Sleeper's table.",[
  ['What is this place?',()=>say("The Hall of Illusions. There are seven doors off this hall: five in the gallery to the north, one at the end of the West Arm and one at the end of the East Arm. Each door opens into a world that is not real: a forest, an island, a cabin in the snow, a city of canals, a desert, a swamp and a nightmare. They look real. The creatures in them bite like real creatures. But they are made of mist, and at the edge of each one the mist wall shows the castle stone through the cracks.",[BYE])],
  ['Who is the Sleeper?',()=>say("She was the Sovereign's dreamer. Her dreams were so strong that the castle built rooms for them. One night the Sovereign took her apart, piece by piece, and hid each piece in one of her own dreams, so that she could never wake and tell what she knew. Her table is in the middle of the hall. It is empty.",[BYE])],
  ['Tell me about one of the doors.',()=>say('Which one?',PSF2.PARTS.map(p=>[(psf2Got(p)?'(found) ':'')+'The '+PSF2.WHERE[p]+'.',()=>say(PSF2_HINT[p],[BYE])]).concat([BYE]))],
  BYE]));
khNpc('psf2_table',"The Sleeper's table",'ps_f2_bier',()=>psf2Table());
khNpc('psf2_book','The book of dreams','ps_lectern',()=>say("A heavy book lies open on the lectern. The pages are lists in a neat hand: THE FOREST, WHERE IT IS ALWAYS SPRING. THE ISLAND, WHERE THE TIDE NEVER TURNS. THE CABIN, WHERE IT IS ALWAYS WINTER. THE CITY OF CANALS. THE DESERT. THE SWAMP. THE LAST ONE HAS NO NAME, ONLY A DRAWING OF AN EYE.",[BYE]));
khNpc('psf2_story','The story of the Sleeper','ps_lectern',()=>say("A plaque on a lectern under the portrait. It reads: THE SLEEPER, DREAMER OF THE PALE SPIRE. SHE DREAMED THE SEVEN ROOMS OF THIS FLOOR. WHEN SHE WOULD NOT DREAM FOR THE SOVEREIGN ANY MORE, HER HAND, HER FOOT, HER FACE, HER CHEST, HER LEGS, HER HEART AND HER BRAIN WERE HIDDEN IN HER OWN DREAMS. SHE SLEEPS UNTIL SHE IS WHOLE.",[BYE]));
/* the table: seven hollows, one for each piece; place what you carry; with all seven the Sleeper wakes */
function psf2Table(){
  const F=psf2F();
  if(F.woke)return say("The Sleeper's table. The pale cloth lies smooth over the black stone, and the seven hollows are empty again. The Sleeper stands beside it.",[BYE]);
  if(psf2Placed()>=7)return say("The Sleeper lies whole on her table, pale and still, with her eyes shut. She is breathing.",[['Wake her.',()=>{psf2Wake();G.talk=null;return null}],BYE]);
  const list=PSF2.PARTS.map(p=>p.toUpperCase()+': '+(F.placed[p]?'in place':'empty')).join('. ');
  const carry=PSF2.PARTS.filter(p=>!F.placed[p]&&bagCount(PSF2.ITEMS[p])>0);
  const opts=[];
  if(carry.length)opts.push(['Place '+(carry.length>1?'every piece you carry':'the '+PSF2.NAMES[carry[0]].replace("The Sleeper's ",'').toLowerCase())+'.',()=>{psf2PlaceAll();G.talk=null;return null}]);
  opts.push(BYE);
  return say("A long table of black stone on a low dais, with a pale cloth over it. Seven hollows are cut in the stone in the shape of a person. "+list+'. ('+psf2Placed()+' of 7.)',opts)}
function psf2Place(p){const F=psf2F();if(F.placed[p]||bagCount(PSF2.ITEMS[p])<=0)return false;bagRemove(PSF2.ITEMS[p],1);F.placed[p]=1;F.got[p]=1;return true}
function psf2PlaceAll(){
  let n=0;for(const p of PSF2.PARTS)if(psf2Place(p))n++;
  if(!n)return 0;
  try{sfx('key')}catch(e){}
  if(psf2Placed()<7)msg('You lay '+(n>1?n+' pieces':'the piece')+' in the hollows of the table. '+psf2Placed()+' of 7 are in place.','#ffe36a');
  else{try{sfx('level')}catch(e){}msg('The last piece settles into its hollow, and the pieces are one body. The Sleeper lies whole on her table, and she is breathing.','#ffe36a')}
  psf2Apply();return n}
function psf2Wake(){const F=psf2F();if(F.woke||psf2Placed()<7)return false;F.woke=1;f2Chime('open');msg('The Sleeper opens her eyes, sits up, and steps down from the table.','#ffe36a');psf2Apply();return true}
khNpc('psf2_sleeper','The Sleeper','ps_f2_sleeper_up',()=>say("Thank you. I was in pieces in my own dreams for a very long time, and I could hear every one of you walking through them. I am the Sleeper. I dreamed the seven rooms of this floor for the Sovereign, until I would not dream for her any more. The stair to the third floor is behind the iron door at the east end of the gallery. It is still shut, and the one who shut it is up there. When it opens, I will show you the way. Now go and tell the Dreamkeeper. He has waited longer than I have.",[BYE]));
/* the live level follows the flags: the empty bier, the whole Sleeper lying on it, then the woken Sleeper standing beside it */
function psf2Apply(){
  if(LEVEL!==PSF2H.ID||!G.decor)return;const F=psf2F(),whole=psf2Placed()>=7;
  for(const d of G.decor){if(d.npc==='psf2_table'){const k=whole&&!F.woke?pspPic('f2_sleeper'):pspPic('f2_bier');if(d.k!==k)d.k=k}
    if(d.npc==='psf2_sleeper'){d.hidden=!F.woke;d.found=!F.woke;d.block=!!F.woke}}}
pspOnArrive(n=>{if(n===PSF2H.ID)try{psf2Apply()}catch(e){console.error('psf2Apply',e)}});
/* the stair to the third floor (stub) */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psf2==='stair3'){sfx('locked');msg(psf2F().done?'The iron door of the stair to the third floor. The Sleeper has seen the way up, but the door is still shut fast. The third floor is not open yet.':'An iron door with no handle and no keyhole. A stair goes up behind it, to the third floor. It is shut fast.','#c8c4e0');return true}
  return _k.apply(this,arguments)}}
/* ---------- the quest: psq40 The Sleeper's Pieces ---------- */
pgrItem('pg_dreamcrown',{n:"The Sleeper's Circlet",k:'head',t:'Helm',ic:'head',c:PGR_C.bone,armor:34,pas:{dodge:.1,regen:1,mpRegen:1,spellPct:.12,dmgPct:.06},sw:.3,
  d:"A thin circlet of pale silver set with seven grey pearls, one for each piece of the Sleeper. She gave it to the ones who woke her. Armour 34, enemies miss 10% more, spells strike 12% harder, all damage +6%, and wounds and tiredness fade steadily."});
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('pg_dreamcrown',...PSF2.PARTS.map(p=>PSF2.ITEMS[p]));
PGR.PLACE.push(['pg_dreamcrown',9820,'quest','psq40']);
{const S=[['',()=>psf2All(),[]],['',()=>psf2Placed()>=7&&!!psf2F().woke,['psf2_table']]];
 Object.defineProperty(S[0],'0',{get:()=>'Find the seven pieces of the Sleeper in the seven illusion rooms off the Hall of Illusions: the hand, the foot, the face, the chest, the legs, the heart and the brain. '+psf2Count()+' of 7 found.'});
 Object.defineProperty(S[1],'0',{get:()=>psf2Placed()>=7?"Wake the Sleeper: speak to her on her table in the middle of the Hall of Illusions.":"Lay all seven pieces on the Sleeper's table in the middle of the Hall of Illusions. "+psf2Placed()+' of 7 in place.'});
 yrQ('psq40',"The Sleeper's Pieces",'The Dreamkeeper, in the Hall of Illusions',S,{gold:15000,xp:90000,items:['pg_dreamcrown','elixir','elixir','supermana']});
 QAREA.psq40=PSP.REGION}
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids});
  QRF.T.psq40={give:[N(9820,'psf2_keeper')],act:()=>psf2All()?[N(9820,'psf2_table')]:[],ready:[N(9820,'psf2_keeper')]}}
blGiveOpt('psf2_keeper','psq40',()=>true,{
  offer:"The Sleeper's pieces are hidden in the seven rooms off this hall: a hand, a foot, a face, a chest, a pair of legs, a heart and a brain, one in each room. Each piece is behind a small puzzle. Bring all seven back and lay them on her table in the middle of the hall, and she will wake. Will you do it?",
  accept:"Thank you. Ask me about any of the doors and I will tell you what I know about that room. Rest in the Quiet Chapel, west of the stair, whenever you need to. Nothing from the illusions can follow you out of a door.",
  remind:()=>psf2All()?"You have all seven. Lay them on the Sleeper's table in the middle of the hall.":'You have '+psf2Count()+' of the seven pieces. Ask me about a door if you are stuck.',
  ready:"She is awake. I heard her breathe from here. I have kept that table for longer than I can remember.",
  thanks:"Take this. She made it for whoever woke her, a long time ago, before she stopped dreaming for the Sovereign. And take the stores of the hall as well.",
  after:"The Sleeper is awake. She says the stair to the third floor is behind the iron door at the east end of the gallery. It is still shut."});
{const _qt=qTurnIn;qTurnIn=function(id){const r=_qt.apply(this,arguments);try{if(r&&id==='psq40'){psf2F().done=1}}catch(e){}return r}}
