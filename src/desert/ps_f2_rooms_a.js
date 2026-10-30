/* ==========================================================================
   ps_f2_rooms_a.js: the illusion rooms 1 to 3 of the Hall of Illusions. See tools/PS_F2_SPEC.md and tools/PS_F2_NOTES.md. Built with f2Room (ps_f2_kit.js).
   9821 The Perfect Forest (the hand): four standing stones round a hollow oak; touch them in the order of the year (spring, summer, autumn, winter).
   9822 The Island by the Sea (the foot): the bottle on the shore shows a starfish; the spade is at the fisherman's hut; dig the starfish patch on the north beach.
   9823 The Cabin in the Snow (the face): three logs in the snow, the flint on a post by the woodpile; logs on the hearth, strike the flint, the fire melts the ice on the mirror.
   Every room: arrival (24,35) facing north, the way back (24,38), the puzzle at the north end, two or three clearings with creatures, three chests.
   ========================================================================== */
/* painted pieces wanted (assets/ps/<name>.webp replaces the stand-in) */
{const P=(n,h,src,o)=>{PSP_PICS[n]=[h,src,o||{}]};
 for(const s of ['spring','summer','autumn','winter'])P('f2_stone_'+s,1.6,['hgxrock4','ww_stone'],{keep:1});
 P('f2_hollowoak',3.2,['dtreehole','ww_oakface'],{keep:1});
 P('f2_bottle',.5,['it_bottle','ic_bottle'],{keep:1});
 for(const s of ['conch','scallop','starfish','spiral'])P('f2_patch_'+s,.45,['yar_shells','hgxrock3'],{keep:1});
 P('f2_patch_dug',.4,['hgxrock3','yar_shells'],{keep:1});
 P('f2_spade',1.1,['it_blspade','ic_blspade'],{keep:1});
 P('f2_flintpost',1.2,['ww_stump','ww_sign'],{keep:1});
 P('f2_log',.4,['f2i_snowlog','glogm'],{keep:1});
 P('f2_woodpile',.8,['plog','logm'],{keep:1});
 P('f2_mirror_ice',2.0,['furn_mirror_gothic','hl_p_mirror'],{keep:1});
 P('f2_mirror_face',2.0,['mirror_haunted_b','furn_mirror_gothic'],{keep:1})}
const F2_FOREST_TREES=['ltree0','ltree4','ltree8','ltree12','ltree1','ltree5','ltree19','ltree9','ltree0','ltree8'];
/* ---------- 1. THE PERFECT FOREST (9821): the hand ---------- */
const F2_SEASON=[['spring','a bud opening on a twig','SPRING'],['summer','a round sun with straight rays','SUMMER'],['autumn','a single falling leaf','AUTUMN'],['winter','a six-pointed snowflake','WINTER']];
const F2_FOREST={STONES:[[20,5,1],[28,5,3],[20,9,0],[28,9,2]],OAK:[24,6]};   // [x,y,season index]: the order of the year is not the order round the ring
function f2ForestBuild(){
  const C=f2Room({id:9821,ground:'lush',path:'trail',band:[2,5],
    routes:[[[24,35],[24,28],[17,24],[17,15],[24,12],[24,10]],[[24,28],[34,25],[38,19]],[[17,19],[8,18]],[[22,32],[10,30]],[[18,8],[9,6]]],
    clear:[[16,2,32,12,'grass','The Glade of the Four Stones',1],[4,13,12,23,'grass','The Wolf Hollow',1],[33,13,43,23,'grass','The Bramble Glade',1],[5,26,13,34,'grass','The Fern Dell',1],[3,2,11,9,'grass','The Old Ring',1]],
    keep:(x,y)=>Math.abs(x-24)<=1&&y>=36});
  const S=C.f2;
  // the glade: the hollow oak in the middle, the four stones round it, the plaque at the way in
  const [ox,oy]=F2_FOREST.OAK;C.used.delete(ox+','+oy);C.dec(pspPic('f2_hollowoak'),ox,oy,{block:true,npc:'f2f_oak'});
  F2_FOREST.STONES.forEach(([x,y,si],i)=>{C.used.delete(x+','+y);C.dec(pspPic('f2_stone_'+F2_SEASON[si][0]),x,y,{block:true,npc:'f2f_stone'+i})});
  C.plaque(27,11,'f2_forest_plaque',['TOUCH THE STONES','IN THE ORDER','OF THE YEAR'],'f2f_plaque','A plaque of grey stone at the edge of the glade. The letters cut in it read: TOUCH THE STONES IN THE ORDER OF THE YEAR. Under it is a small carving of a bud, a sun, a leaf and a snowflake, in that order.');
  for(const [x,y] of [[22,7],[26,7]])if(C.free(x,y))C.dec('lbush0',x,y,{block:false,sc:.6});
  // the forest: tall green trees in the band, ferns and logs in the glades
  C.fill(F2_FOREST_TREES,{sc:1,p1:.1,p2:.55,p3:.9});
  C.scrub(['lbush0','lbush0_2','lbush0','logm','boulder'],.05);
  for(const [x,y] of [[6,15],[10,21],[35,15],[41,21],[7,28],[11,33],[5,4],[9,8]])if(C.free(x,y))C.dec('lbush0_2',x,y,{block:false,sc:.8});
  C.capTrees(/ltree/,2.2);
  // creatures (the perfect forest still bites), chests
  pspSafeZone(C,24,35,6);
  C.foes(['f2wolf','f2wolf','f2wolf','f2wasps'],[4,13,12,23],1);
  C.foes(['f2stag','f2treant','f2wolf','f2wasps'],[33,13,43,23],2);
  C.foes(['f2treant','f2stag'],[5,26,13,34],3);
  C.foes(['f2wasps','f2wolf'],[3,2,11,9],4);
  for(const [x,y] of [[5,14],[42,14],[6,33]])C.chestAt(x,y,1);
  C.ret();
  const lv=C.done({glow:8});
  lv.mapNames.push({t:'The Hollow Oak',x:24,y:6,k:'place'});
  return lv}
pspRegister(9821,f2ForestBuild);
F2_FOREST.STONES.forEach(([x,y,si],i)=>khNpc('f2f_stone'+i,'A standing stone','ps_f2_stone_'+F2_SEASON[si][0],()=>{
  const R=f2S(9821);if(R.solved)return say('A mossy standing stone carved with '+F2_SEASON[si][1]+'. It is warm to the touch now, and quiet.',[BYE]);
  return say('A mossy standing stone, taller than a man. It is carved with '+F2_SEASON[si][1]+'.',[['Touch the stone.',()=>{f2ForestTouch(si);G.talk=null;return null}],BYE])}));
function f2ForestTouch(si){
  const R=f2S(9821);if(R.solved)return;R.seq=R.seq||[];
  if(si===R.seq.length){R.seq.push(si);f2Chime('ok',si);msg('The '+F2_SEASON[si][2].toLowerCase()+' stone hums under your hand, and its carving glows faintly. ('+R.seq.length+' of 4.)','#d8f0c8');
    if(R.seq.length===4){R.solved=1;R.seq=[];f2Chime('open');msg('All four stones ring together. The bark door of the hollow oak creaks open.','#ffe36a');f2ForestApply()}}
  else{R.seq=[];f2Chime('bad');msg('The stone gives a dull, low note, and the glow fades from every carving. Start again.','#c8c8b0')}}
khNpc('f2f_oak','The hollow oak','ps_f2_hollowoak',()=>{const R=f2S(9821);
  if(!R.solved)return say('A huge old oak with a hollow trunk. A small door of bark is set into the hollow, fitted so close that you cannot get a finger into the edge. Four seasons are carved round its frame.',[BYE]);
  if(!psf2F().got.hand)return say('The bark door stands open. Inside the hollow, on a bed of dry leaves, lies a pale hand.',[["Take the Sleeper's Hand.",()=>{psf2Give('hand');G.talk=null;return null}],BYE]);
  return say('The bark door stands open. The hollow is empty except for dry leaves.',[BYE])});
function f2ForestApply(){const R=f2S(9821);if(!R.solved)R.seq=[]}
f2OnArrive(9821,()=>f2ForestApply());
/* ---------- 2. THE ISLAND BY THE SEA (9822): the foot ---------- */
const F2_ISLAND={PATCH:[[17,5,'conch','a conch shell'],[21,3,'scallop','a scallop shell'],[27,3,'starfish','a starfish'],[31,5,'spiral','a spiral snail shell']],ANSWER:'starfish',BOTTLE:[20,32],SPADE:[37,28]};
function f2IslandBuild(){
  const C=f2Room({id:9822,ground:'sand',path:'sandpath',band:[0,2],
    routes:[[[24,35],[24,26],[16,22],[16,12],[24,8],[24,6]],[[24,30],[33,29]],[[16,18],[9,18]],[[24,8],[37,13]]],
    clear:[[14,2,34,8,'sand','The North Beach',1],[29,24,40,31,'sand',"The Fisherman's Hut",1],[6,14,12,22,'sand','The Siren Rocks',1],[32,10,40,17,'sand','The Gull Cove',1],[19,31,29,37,'sand',null,1]],
    edge:(C,x,y)=>{C.water(x,y,'seawater');return true}});
  const W=48,H=40;
  // the shore: wet sand next to the water
  {const wet=C.fl('seabed1');for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(C.open(x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>C.block[(y+b)*W+x+a]&&C.rows[y+b][x+a]==='.'))C.fm[y*W+x]=wet}
  // the fisherman's hut (a small timber hut with a thatched roof; the door is shut), nets, the spade by the door
  C.house({x0:34,y0:25,x1:36,y1:26,face:'S',sty:'flint',roof:'thatch2',wh:2.3,lit:false});
  const [sx,sy]=F2_ISLAND.SPADE;C.used.delete(sx+','+sy);C.dec(pspPic('f2_spade'),sx,sy,{block:true,npc:'f2i_spade'});
  {let n=0;for(let r=1;r<8&&n<2;r++)for(const [x,y] of [[42+r,30],[42+r,27],[40,33+r]]){if(n<2&&C.rows[y]&&C.rows[y][x]==='.'&&C.block[y*48+x]&&!C.decor.some(d=>d.x===x&&d.y===y)){C.dec('yar_boat_row',x,y,{block:false,sc:.9});n++}}}   // two rowing boats drawn up in the shallows by the hut
  // the bottle on the south shore, the four sand patches on the north beach
  {const [bx,by]=F2_ISLAND.BOTTLE;C.used.delete(bx+','+by);C.dec(pspPic('f2_bottle'),bx,by,{block:true,npc:'f2i_bottle'})}
  F2_ISLAND.PATCH.forEach(([x,y,s],i)=>{C.used.delete(x+','+y);C.dec(pspPic('f2_patch_'+s),x,y,{block:true,npc:'f2i_patch'+i})});
  // palms, dune grass and rocks
  C.fill(['dpalm0','dpalm1','dpalm2','dpalm3','yar_palms','dpalm0','hgxrock1','boulder'],{p1:.12,p2:.4,p3:.6});
  C.scrub(['yar_shells','hgxrock3','lbush0_1'],.035);
  for(const [x,y] of [[7,16],[8,21],[11,15],[6,19]])if(C.free(x,y))C.dec('hgxrock1',x,y,{block:true,sc:1.1});
  C.capTrees(/dpalm|yar_palms/,2.8);
  pspSafeZone(C,24,35,6);
  C.foes(['f2crab','f2crab'],[14,2,34,8],1);
  C.foes(['f2siren','f2siren','f2spawn'],[5,13,13,23],2);
  C.foes(['f2gull','f2gull','f2gull','f2crab'],[31,9,41,18],3);
  C.foes(['f2spawn','f2crab','f2spawn'],[29,24,41,33],4);
  for(const [x,y] of [[6,15],[39,11],[39,30]])C.chestAt(x,y,1);
  C.ret();
  return C.done({glow:8})}
pspRegister(9822,f2IslandBuild);
khNpc('f2i_bottle','A bottle on the shore','ps_f2_bottle',()=>{const R=f2S(9822);R.read=1;
  return say('A green glass bottle lies half in the wet sand, corked with wax. Inside is a rolled note. It reads: DIG WHERE THE TIDE LEAVES THE FIRST FOOTPRINT OF THE DAY. Under the words is a small drawing of a starfish, and an arrow pointing north.',[BYE])});
khNpc('f2i_spade',"A spade by the hut",'ps_f2_spade',()=>{const R=f2S(9822);
  if(R.spade)return say('The place by the door where the spade leaned. You have the spade.',[BYE]);
  return say("A fisherman's spade leans against the wall of the hut, its blade crusted with dry sand.",[['Take the spade.',()=>{R.spade=1;try{sfx('key')}catch(e){}msg('You take the spade.','#ffe36a');f2IslandApply();G.talk=null;return null}],BYE])});
F2_ISLAND.PATCH.forEach(([x,y,s,desc],i)=>khNpc('f2i_patch'+i,'A patch of sand','ps_f2_patch_'+s,()=>{
  const R=f2S(9822);R.dug=R.dug||{};
  if(R.dug[s])return say(s===F2_ISLAND.ANSWER?'The hole you dug. It is empty now.':'A hole full of seawater. Nothing else is in it.',[BYE]);
  const opts=R.spade?[['Dig here.',()=>{f2IslandDig(i);G.talk=null;return null}],BYE]:[BYE];
  return say('A patch of smooth sand, with '+desc+' pressed into it.'+(R.spade?'':' You would need a spade to dig here. The fisherman left one by his hut.'),opts)}));
function f2IslandDig(i){
  const R=f2S(9822),[x,y,s]=F2_ISLAND.PATCH[i];R.dug=R.dug||{};if(R.dug[s])return;R.dug[s]=1;
  if(s===F2_ISLAND.ANSWER){f2Chime('open');msg('The spade strikes something smooth under the sand. You dig out a pale foot, wrapped in sailcloth.','#ffe36a');psf2Give('foot')}
  else{f2Chime('bad');msg('The sand caves in, and the hole fills with seawater. Something with claws comes up out of it.','#e0c8a0');f2Release('f2crab',2,x,y)}
  f2IslandApply()}
function f2IslandApply(){const R=f2S(9822);if(LEVEL!==9822)return;
  if(R.spade){const [sx,sy]=F2_ISLAND.SPADE;f2Hide(pspPic('f2_spade'),sx,sy,true)}
  for(const [x,y,s] of F2_ISLAND.PATCH)if(R.dug&&R.dug[s])for(const d of G.decor||[])if(d.npc&&Math.round(d.x)===x&&Math.round(d.y)===y)d.k=pspPic('f2_patch_dug')}
f2OnArrive(9822,()=>f2IslandApply());
/* ---------- 3. THE CABIN IN THE SNOW (9823): the face ---------- */
const F2_SNOW={LOGS:[[8,23],[40,22],[10,31]],FLINT:[29,9],HEARTH:[41,4],MIRROR:[43,4],IN:[41,7,0],OUT:[24,9,2]};
function f2SnowBuild(){
  const C=f2Room({id:9823,ground:'snow',path:'snowpath',band:[2,5],wh:3.2,
    routes:[[[24,35],[24,26],[30,21],[30,14],[24,12],[24,9]],[[24,29],[12,28],[10,31]],[[30,18],[40,20]],[[24,24],[12,23],[8,23]]],
    clear:[[14,3,34,13,'snow','The Cabin',1],[4,15,13,24,'snow','The Frozen Pond',1],[35,16,44,26,'snow',"The Bear's Den",1],[5,27,15,34,'snow','The Birch Stand',1]],
    keep:(x,y)=>x>=37&&y<=10});
  const W=48,{rows,block,fm}=C;
  // the cabin: a small timber house with a snowy roof; its door opens into the room inside (built in the north-east corner, walled all round)
  try{pspDefringe('ps_f2_cabin')}catch(e){}
  if(IMG.ps_f2_cabin&&IMG.ps_f2_cabin.width&&!IMG.ps_f2_cabin._ps){C.picHouse({img:'ps_f2_cabin',x0:22,y0:5,x1:26,y1:8,w:5.4,door:[24,8],wh:2.6});const wd=C.ch(C.TM.make('plain',(WL.sty&&WL.sty.black)||'timber',2.6).gid);for(let y=5;y<=8;y++)for(let x=22;x<=26;x++)if(!(x===24&&y===8))C.solid(x,y,wd)}   // the sides of the cabin are dark boardselse C.house({x0:21,y0:5,x1:27,y1:8,face:'S',sty:'timber',roof:'thatch2',wh:2.6,col:[1.5,1.05,.55]});
  for(const x of [22,26])C.light(x,9,[1.5,1.05,.55]);
  {const [dx,dy]=[24,8],g=C.chars[rows[dy][dx]];KH_DOOR[g]={psf2:'warp',psh:'warp',to:F2_SNOW.IN,A:F2_SNOW.IN,B:F2_SNOW.IN,lvl:9823,at:{x:F2_SNOW.IN[0],y:F2_SNOW.IN[1],f:0},msg:'You step inside the cabin. It is as cold in here as it is outside.'};(C.warpTo=C.warpTo||[]).push(F2_SNOW.IN)}
  // inside: walls of timber round x 38..43, y 4..7; the hearth on the north wall, the mirror beside it, a bed, a table
  {const TM=C.TM,sty=(WL.sty&&WL.sty.black)||'timber',wall=C.ch(TM.make('plain',sty,3.0).gid),win=C.ch(TM.make('window',sty,3.0).gid);
   for(let y=2;y<=9;y++)for(let x=38;x<=45;x++){const inner=x>=40&&x<=43&&y>=4&&y<=7;if(inner){rows[y][x]='.';block[y*W+x]=0;fm[y*W+x]=C.fl('wl2f0');C.used.delete(x+','+y)}else if(x>=39&&x<=44&&y>=3&&y<=8){C.solid(x,y,(x===42&&y===3)?win:wall)}else C.mist(x,y)}   // timber inside, mist outside (the room is only reached through the cabin door)
   C.warp(41,8,'oak',F2_SNOW.OUT,'You step out into the snow.')}
  {const [hx,hy]=F2_SNOW.HEARTH;C.dec(pspPic('furn_fireplace_tall'),hx,hy,{block:true,npc:'f2s_hearth'});
   C.dec(pspPic('f2_mirror_ice'),F2_SNOW.MIRROR[0],F2_SNOW.MIRROR[1],{block:false,wd:[0,-1],npc:'f2s_mirror'});
   C.dec(pspPic('bed_four'),43,7,{block:true,sc:.75});C.dec(pspPic('table_high'),40,6,{block:true,sc:.75});C.light(41,5,[1.0,.95,1.1])}
  // the woodpile and the flint post beside the cabin, the three logs out in the snow
  C.used.delete('30,9');C.dec(pspPic('f2_log'),30,9,{block:true,sc:1.6});C.used.delete('31,9');C.dec(pspPic('f2_log'),31,9,{block:true,sc:1.4});
  {const [fx,fy]=F2_SNOW.FLINT;C.used.delete(fx+','+fy);C.dec(pspPic('f2_flintpost'),fx,fy,{block:true,npc:'f2s_flint'})}
  F2_SNOW.LOGS.forEach(([x,y],i)=>{C.used.delete(x+','+y);C.dec(pspPic('f2_log'),x,y,{block:true,npc:'f2s_log'+i,sc:1.3})});
  // the frozen pond (ice, walk round it), snowy pines, birches and rocks
  for(let y=17;y<=21;y++)for(let x=6;x<=11;x++)if(Math.hypot((x-8.5)/3,(y-19)/2.4)<1&&C.free(x,y))C.water(x,y,'canal');
  C.fill([pspPic('f2_snowpine'),pspPic('f2_snowpine2'),pspPic('f2_snowpine'),pspPic('f2_snowpine2'),pspPic('f2_snowbirch')],{});
  C.scrub([pspPic('f2_log')],.012);
  C.capTrees(/snowpine|snowbirch/,2.6);
  pspSafeZone(C,24,35,6);
  C.foes(['f2snowwolf','f2snowwolf','f2frostwraith'],[4,15,13,24],1);
  C.foes(['f2snowbear','f2snowwolf','f2frostwraith'],[35,16,44,26],2);
  C.foes(['f2frostwraith','f2snowwolf'],[5,27,15,34],3);
  C.foes(['f2iceelem','f2snowwolf'],[14,3,34,13],4);
  for(const [x,y] of [[12,16],[43,25],[6,33]])C.chestAt(x,y,1);
  C.ret();
  const lv=C.done({glow:8});
  return lv}
pspRegister(9823,f2SnowBuild);
F2_SNOW.LOGS.forEach(([x,y],i)=>khNpc('f2s_log'+i,'A log in the snow','ps_f2_log',()=>{const R=f2S(9823);R.logs=R.logs||{};
  if(R.logs[i])return say('Only a dent in the snow where the log lay.',[BYE]);
  return say('A split log of firewood, half buried in the snow. It is dry under the bark.',[['Take the log.',()=>{R.logs[i]=1;try{sfx('key')}catch(e){}msg('You take the log. ('+f2SnowLogs()+' of 3.)','#ffe36a');f2SnowApply();G.talk=null;return null}],BYE])}));
const f2SnowLogs=()=>Object.keys(f2S(9823).logs||{}).length;
khNpc('f2s_flint','A post by the woodpile','ps_f2_flintpost',()=>{const R=f2S(9823);
  if(R.flint)return say('A post by the woodpile. The flint and steel that sat on top of it are in your pack.',[BYE]);
  return say('A short post stands by the woodpile. On top of it lie a flint and a steel, out of the snow.',[['Take the flint and steel.',()=>{R.flint=1;try{sfx('key')}catch(e){}msg('You take the flint and steel.','#ffe36a');G.talk=null;return null}],BYE])});
khNpc('f2s_hearth','The hearth','ps_furn_fireplace_tall',()=>{const R=f2S(9823);
  if(R.lit)return say('A fire burns high in the hearth. The cabin is warm at last.',[BYE]);
  const n=f2SnowLogs(),laid=!!R.laid,opts=[];
  if(!laid&&n>=3)opts.push(['Lay the three logs on the hearth.',()=>{R.laid=1;try{sfx('door')}catch(e){}msg('You stack the three logs on the cold hearth.','#ffe36a');G.talk=null;return null}]);
  if(laid&&R.flint)opts.push(['Strike the flint.',()=>{f2SnowLight();G.talk=null;return null}]);
  opts.push(BYE);
  return say(laid?'Three logs lie stacked on the hearth, ready to burn.'+(R.flint?'':' You need something to light them. There was a flint on a post by the woodpile.'):'A stone hearth with a cold, empty grate. A fire would need three logs. You have '+n+'.',opts)});
function f2SnowLight(){const R=f2S(9823);if(R.lit||!R.laid||!R.flint)return;R.lit=1;f2Chime('open');
  msg('Sparks catch, and the logs burn up bright. The heat fills the cabin, and the thick ice on the mirror runs down the glass in streams.','#ffe36a');f2SnowApply()}
khNpc('f2s_mirror','A mirror over the mantel','ps_f2_mirror_ice',()=>{const R=f2S(9823);
  if(!R.lit)return say('A tall mirror beside the hearth, covered in ice as thick as a hand. Something pale is behind the ice, but you cannot see what.',[BYE]);
  if(!psf2F().got.face)return say('The ice has melted off the mirror. A pale face looks out of the glass with its eyes shut, and you can reach into the mirror as if it were water.',[["Take the Sleeper's Face.",()=>{psf2Give('face');f2SnowApply();G.talk=null;return null}],BYE]);
  return say('The mirror shows the warm cabin and the fire. Only your own faces look back.',[BYE])});
function f2SnowApply(){if(LEVEL!==9823)return;const R=f2S(9823);
  F2_SNOW.LOGS.forEach(([x,y],i)=>{if(R.logs&&R.logs[i])f2Hide(pspPic('f2_log'),x,y,true)});
  for(const d of G.decor||[])if(d.npc==='f2s_hearth')d.k=pspPic(R.lit?'f2_hearth':'furn_fireplace_tall');
  for(const d of G.decor||[])if(d.npc==='f2s_mirror')d.k=pspPic(R.lit&&psf2F().got.face?'furn_mirror_gothic':R.lit?'f2_mirror_face':'f2_mirror_ice');
  if(R.lit)for(const l of LIGHTS||[])if(Math.abs(l.x-41.5)<1.2&&Math.abs(l.y-5.5)<1.2){l.col=[1.6,1.0,.45];l.kI=1.8}}
f2OnArrive(9823,()=>f2SnowApply());
