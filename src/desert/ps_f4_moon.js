/* ==========================================================================
   THE PALE SPIRE, FOURTH FLOOR: THE FLOOR OF THE MOON (hub, level 9890, 46 x 46, indoor, rating 110; prefix psf4m).
   The stair from the Observatory lands in the Moon Hall (centre). Four rooms lead off it, each with a great painted planet floating in it; touching a planet
   puts the party into that planet's maze, seen from above (ps_f4_planets.js, topdown.js). When all four are done the iron gate to the Moon Gate room opens.
   There the floating Moon, the boss (level 110), hangs in front of the stair to the fifth floor. Killing it gives the Orrery Staff of the Pale Moon.
   State: G.flags.psp.f4 = {done:{9891:1,..}, intro, moon (0 / 2 dead), got}.
   ========================================================================== */
const PSF4M={ID:9890,W:46,H:46,
  PLANETS:[[9891,'stone',23,8,'The Stone Planet'],[9892,'ice',38,23,'The Ice Planet'],[9893,'grow',23,38,'The Growing Planet'],[9894,'fire',8,23,'The Fire Planet']],
  SEAL:[30,8],GATE:[36,3],MOON:[36,4],DOWN:[23,28]};
PSF4.BACK={9891:[23,10,0],9892:[36,23,1],9893:[23,36,2],9894:[10,23,3]};
const psf4Done=()=>PSF4.IDS.filter(i=>psf4F().done[i]).length;
function psf4mApply(){
  if(LEVEL!==PSF4M.ID||!G.decor)return;const all=psf4Done()===4;
  for(const d of G.decor)if(d.npc==='psf4_seal'){d.hidden=all;d.found=all;d.block=!all}}
function psf4mBuild(info){
  const W=PSF4M.W,H=PSF4M.H,id=PSF4M.ID;
  try{gyAlias();if(typeof pshPics==='function')pshPics()}catch(e){}
  const C=pspMake({id,W,H,start:{x:23,y:26,f:0},floor:'flag',wh:3.2,amb:.4,lcol:PSH_COL.cold,kind:'in'});
  const {rows}=C;
  C.room(18,18,28,28,{floor:'flag',name:'The Moon Hall',at:[23,21]});
  C.room(18,4,28,12,{floor:'flag',name:'The Stone Room',at:[23,6]});
  C.room(34,18,42,28,{floor:'flag',name:'The Ice Room',at:[38,21]});
  C.room(18,34,28,42,{floor:'flag',name:'The Growing Room',at:[23,36]});
  C.room(4,18,12,28,{floor:'flag',name:'The Fire Room',at:[8,21]});
  C.room(31,4,41,12,{floor:'flag',name:'The Moon Gate',at:[36,7]});
  C.room(31,33,39,39,{floor:'flag',name:'The Quiet Loft',at:[35,35]});
  C.carve(22,13,24,17);C.carve(29,22,33,24);C.carve(22,29,24,33);C.carve(13,22,17,24);C.carve(29,8,30,8);C.carve(29,36,30,36);
  C.links({});
  const put=(name,x,y,o)=>{C.used.delete(x+','+y);return C.dec(pspPic(name),x,y,Object.assign({block:true},o||{}))};
  // the Moon Hall
  for(const [x,y] of [[19,19],[27,19],[19,27],[27,27]])C.column(x,y,'fluted');
  put('obs_orrery',23,23,{sc:1});C.light(23,23,[1.2,1.2,1.5]);
  put('stair_spiral_iron',PSF4M.DOWN[0],PSF4M.DOWN[1],{npc:'psf4_down',sc:1});
  for(const x of [20,26])C.picture('banner_long_a',x,18,[0,-1]);
  // the four planets, each floating in its room with a light of its own colour
  const COL={stone:[1.3,1.15,.95],ice:[.9,1.2,1.6],grow:[.9,1.4,.8],fire:[1.6,.9,.6]};
  for(const [pid,key,x,y,name] of PSF4M.PLANETS){
    put('planet_'+key,x,y,{npc:'psf4_pl_'+pid,sc:1.15});C.light(x,y,COL[key]);C.light(x+(x<23?2:x>23?-2:0),y+(y<23?2:y>23?-2:0),COL[key]);
    const rx=x<23?[4,12]:x>23?[34,42]:[18,28],ry=y<23?[4,12]:y>23?[34,42]:[18,28];
    for(const [cx,cy] of [[rx[0]+1,ry[0]+1],[rx[1]-1,ry[0]+1],[rx[0]+1,ry[1]-1],[rx[1]-1,ry[1]-1]])if(C.free(cx,cy))C.cand(cx,cy,COL[key])}
  // the iron gate to the Moon Gate room, shut until all four planets are done
  put('iron_gate_big',PSF4M.SEAL[0],PSF4M.SEAL[1],{npc:'psf4_seal',sc:1});
  // the Moon Gate room
  for(const x of [32,40])for(const y of [5,11])C.column(x,y,'fluted');
  C.light(36,6,[1.2,1.25,1.6]);C.light(36,10,[1.0,1.05,1.4]);
  pspRest(C,{x0:31,y0:33,x1:39,y1:39,bed:[33,35],chest:[38,38],name:'The Quiet Loft',line:'A small loft off the Growing Room, with a narrow bed and a brass lamp. Warm candles burn here, and nothing from the floor can come in.'});
  pspSafeRect(C,31,33,39,39);pspSafeRect(C,18,18,28,28);
  C.glow(7,PSH_COL.cold);
  // the Moon hangs in front of the stair to the fifth floor, unless it is already dead
  if(psf4F().moon!==2)pspFoe(C,'psmoon',PSF4M.MOON[0],PSF4M.MOON[1],{lvl:110});
  return C.finish({start:{x:23,y:26,f:0}})}
pspRegister(PSF4M.ID,psf4mBuild);
/* ---------- the things to touch ---------- */
for(const [pid,key,x,y,name] of PSF4M.PLANETS){
  khNpc('psf4_pl_'+pid,name,'ps_planet_'+key,()=>{const F=psf4F(),done=!!F.done[pid];
    return say("A great painted planet turns slowly in the air, as big as a house. "+({stone:'Grey stone, with walls and towers of old castles drawn on it.',ice:'White and blue ice, cracked and ridged.',grow:'Dense green forest, with huge mushrooms and vines.',fire:'Black rock with rivers of lava and small volcanoes.'}[key])+(done?" You have been through its maze and reached its exit.":" Its surface is a maze. If you step onto it, you will walk through it seen from above.")+" "+psf4Done()+" of 4 planets are done.",[
      [done?'Step onto the planet again.':'Step onto the planet.',()=>{G.talk=null;sfx('door');goToLevel(pid,{x:2,y:2,f:2});return null}],BYE])})}
khNpc('psf4_seal','The Iron Gate','ps_iron_gate_big',()=>say("A tall iron gate shuts off the way east, to the Moon Gate. Cut into the bars is a line: WHEN YOU HAVE THE FOUR PLANETS, YOU MAY PASS. "+psf4Done()+" of 4 planets are done.",[BYE]));
khNpc('psf4_down','The spiral stair','ps_stair_spiral_iron',()=>say("The iron stair winds down to the Observatory Gallery.",[['Go down.',()=>{G.talk=null;sfx('door');goToLevel(9881,{x:47,y:28,f:0});return null}],BYE]));
/* ---------- coming off a planet, arriving, the gate ---------- */
pspOnArrive(n=>{if(n!==PSF4M.ID)return;try{psf4mApply();const F=psf4F();
  if(F.moon===2)for(let i=G.enemies.length-1;i>=0;i--)if(G.enemies[i].t==='psmoon')G.enemies.splice(i,1);
  psf4MoonFix();
  if(!F.seen){F.seen=1;msg('The stair ends in a round hall of pale stone. Four doors lead off it, and in every room beyond a whole world hangs in the air.','#d8e4ff')}
  if(psf4Done()===4&&!F.gateMsg){F.gateMsg=1;msg('All four planets are walked. Far to the north-east, the iron gate lets go.','#bfe8ff')}}catch(e){console.error('psf4m arrive',e)}});
/* ---------- the Moon (the boss) ---------- */
{
  ENEMY_DEF.psmoon=pscE('psmoon',{img:'ps_moon_boss',ph:3.4,w:2.4,name:'The Pale Moon',hp:940,dmg:[18,26],hit:.92,verb:'crushes',xp:2100,boss:true,aboveParty:0,gold:[0,0],fly:true,floatH:.2});
  if(typeof NO_VARY!=='undefined')NO_VARY.push('psmoon');
  if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.psmoon=[7000,9000];
  if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^psmoon/,'cursed',.2]);
}
function psf4MoonFix(){const im=IMG.ps_moon_boss;if(im&&im.width)ENEMY_DEF.psmoon.w=+(ENEMY_DEF.psmoon.ph*im.width/im.height).toFixed(2)}
bl3Hit('psmoon',e=>{
  const r=e.hp/e.maxhp,ph=r<.25?3:r<.5?2:r<.75?1:0;if(ph<=(e._ph|0))return;e._ph=ph;
  const T=[null,['psstarmoth','psstarmoth'],['psstarwraith','psmirrorshade'],['psclockwork','psstarwraith']][ph],M=[null,'The Moon cracks along its crown. Two swarms of star moths pour out of the cracks.','The Moon turns its dark side to you, and two shapes fall off it into the room.','The Moon opens its mouth wide. A brass guardian and a star wraith drop out of it.'][ph];
  for(const t of T){if(G.enemies.filter(m=>m._kid&&m.hp>0).length>=4)break;const m=bl3Add(t,e.x,Math.min(e.y+2,10),110);if(m)m._kid=1}
  msg(M,'#d8e4ff')});
bl3Kill('psmoon',e=>{
  const F=psf4F();F.moon=2;
  try{f2Chime('open')}catch(x){}
  msg("The Moon goes dim, and then dark, and the eyes in its craters close one by one. The chains of its crown drop and ring on the floor. The way to the stair is clear.",'#d8e4ff');
  if(!F.got){F.got=1;bl3Give('pg_moonstaff');msg("A staff of pale stone lies among the chains, with a small brass orrery turning at its tip: the Orrery Staff of the Pale Moon.",'#ffe36a')}});
pgrItem('pg_moonstaff',{n:'Orrery Staff of the Pale Moon',t:'Staff',ic:'staff',c:PGR_C.vio,dmg:[300,350],magic:200,req:{int:78},eff:{bossdmg:.6,daze:.3},pas:{spellPct:.18,mpRegen:1.2},sw:.44,
  d:"A tall staff of pale moonstone, topped with a small brass orrery that turns by itself. It came from the floating Moon. Adds 200 to the power of spells, spell damage +18%, tiredness fades faster, bosses take 60% more, and foes are sometimes dazed."});
/* ---------- the links ---------- */
PSP_L(9881,null,9890,[23,26,0],{name:'the spiral stair up to the Floor of the Moon'});
PSP_L(9890,[PSF4M.GATE[0],PSF4M.GATE[1]],9900,[20,20,0],{name:'the stair to the fifth floor',prov:1});
