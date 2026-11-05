/* ==========================================================================
   THE PALE SPIRE, THIRD FLOOR, PART TWO: THE OBSERVATORY GALLERY AND THE SOVEREIGN'S REFLECTION (level 9881, 56 x 44, indoor, rating 107; prefix psf3o / PSF3O).
   The stair at the north end of the Hall of Mirrors opens once the crystal there burns (psf3F().beam). It lands in the Landing (28,40).
   The Gallery (middle) leads west to the Chart Room (five star charts with brass pins), north to the Telescope Room (behind a silver gate), east to the Reflecting Court (behind a mirror).
   Puzzle: press the five pins in the order the constellations rise (Lamp, Hound, Crown, Ladder, Mirror). The order is worked out from three notes: the Gallery lectern, the Study and the Archive.
   A wrong pin springs all five back up and lets two shades out. The right order opens the gate to the Telescope Room. The telescope shows the mirror door in the east wall of the Gallery, and it swings open.
   In the Reflecting Court the great mirror gives out the boss, The Sovereign's Reflection. Killing it gives the Shield of the Last Reflection and opens the spiral stair to the Moon Tower (a stub).
   State (G.flags.psp.f3o via psf3oF()):  seq = pins pressed so far, chart = solved, scope = telescope used, reflect 0/1/2 (none / loose / dead), got = shield given.
   ========================================================================== */
const PSF3O={ID:9881,W:56,H:44,WH:3.2,
  SOLVE:['lamp','hound','crown','ladder','mirror'],
  NAMES:{lamp:'The Lamp',hound:'The Hound',crown:'The Crown',ladder:'The Ladder',mirror:'The Mirror'},
  PIC:{lamp:'candelabra_tall',hound:'st_hound',crown:'furn_throne_black',ladder:'stairs_curved',mirror:'furn_mirror_gothic'},
  STANDS:{crown:[7,23],mirror:[9,23],lamp:[11,23],ladder:[13,23],hound:[15,23]},
  GATE:[28,14],MIRRORDOOR:[38,23],SCOPE:[28,6],GLASS:[47,17],UP:[47,29],SPAWN:[47,23]};
PSP.LEVELS.push(PSP_LV(9881,'The Observatory Gallery',56,44,107,0,'in'));
function psf3oF(){const P=(G.flags.psp=G.flags.psp||{});return P.f3o||(P.f3o={seq:[],chart:0,scope:0,reflect:0,got:0})}
/* the pins: a pure function of what has been pressed so far */
function psf3oCheck(seq){for(let i=0;i<seq.length;i++)if(seq[i]!==PSF3O.SOLVE[i])return 'wrong';return seq.length===PSF3O.SOLVE.length?'done':'ok'}
function psf3oApply(){
  if(LEVEL!==PSF3O.ID||!G.decor)return;const F=psf3oF();
  for(const d of G.decor){
    if(d.npc==='psf3o_gate'){d.hidden=!!F.chart;d.found=!!F.chart;d.block=!F.chart}
    if(d.npc==='psf3o_mirrordoor'){d.hidden=!!F.scope;d.found=!!F.scope;d.block=!F.scope}
    if(d.npc==='psf3o_up'){const on=F.reflect===2;d.hidden=!on;d.found=!on;d.block=on}}}
/* ---------- the level ---------- */
function psf3oBuild(info){
  const W=PSF3O.W,H=PSF3O.H,id=PSF3O.ID;
  try{gyAlias();if(typeof pshPics==='function')pshPics()}catch(e){}
  const C=pspMake({id,W,H,start:{x:28,y:40,f:0},floor:'flag',wh:PSF3O.WH,amb:.34,lcol:PSH_COL.cold,kind:'in'});
  const {rows}=C;
  C.room(24,36,32,41,{floor:'flag',name:'The Landing',at:[28,39]});
  C.room(34,37,40,41,{floor:'flag',name:'The Stargazers\' Loft',at:[37,39]});
  C.room(20,16,36,32,{floor:'flag',name:'The Observatory Gallery',at:[28,20]});
  C.room(6,20,16,30,{floor:'flag',name:'The Chart Room',at:[11,26]});
  C.room(6,6,14,14,{floor:'flag',name:'The Astronomer\'s Study',at:[10,10]});
  C.room(22,4,34,11,{floor:'flag',name:'The Telescope Room',at:[28,8]});
  C.room(44,32,52,41,{floor:'flag',name:'The Archive',at:[48,37]});
  C.room(42,16,53,30,{floor:'flag',name:'The Reflecting Court',at:[47,24]});
  C.carve(27,33,29,35);C.carve(33,39,33,39);C.carve(41,39,43,39);C.carve(17,25,19,25);C.carve(10,15,10,19);C.carve(28,12,28,15);C.carve(37,23,41,23);
  C.links({});
  const pic=(n,x,y,wd,o)=>{const k=pspPic(n);if(!C.isOpen(x,y))return null;const bx=x+wd[0],by=y+wd[1];if(rows[by][bx]==='.')return null;return C.dec(k,x,y,Object.assign({wd,block:false},o||{}))};
  const cand=(x,y,col)=>{if(!C.free(x,y))return;C.cand(x,y,col||PSH_COL.cold)};
  const put=(name,x,y,o)=>{C.used.delete(x+','+y);return C.dec(pspPic(name),x,y,Object.assign({block:true},o||{}))};
  const WALLP=['pt_pale_lands','pt_ancestors','pt_empty','pt_gallery8','portrait_ancestor_1','portrait_ancestor_2'];
  // ---- the Landing and the quiet loft ----
  pic('banner_long_a',26,36,[0,-1]);pic('banner_long_b',30,36,[0,-1]);C.light(28,38,[.9,1.05,1.4]);
  pspSafeRect(C,24,36,32,41);
  pspRest(C,{x0:34,y0:37,x1:40,y1:41,bed:[36,38],chest:[39,40],name:'The Stargazers\' Loft',line:'A small loft with a narrow bed and a brass lamp. Warm candles burn here, and nothing from the Gallery can come in.'});
  // ---- the Gallery ----
  for(const y of [18,22,26,30]){C.column(22,y,y%4?'fluted':'twist');C.column(34,y,y%4?'twist':'fluted')}
  put('globe',28,24,{sc:1.3});C.light(28,24,[1.2,1.2,1.4]);
  for(let i=0,x=22;x<=34;x+=3,i++)pic(WALLP[i%WALLP.length],x,16,[0,-1]);
  for(const y of [18,28])pic('window_stained_tall',20,y,[-1,0]);
  put('lectern',23,29,{npc:'psf3o_lecternA'});put('table_books',33,19);put('reading_desk',23,19);put('scroll_rack',34,29);
  for(const [x,y] of [[24,17],[32,17],[24,31],[32,31]])cand(x,y,[.8,.95,1.3]);
  C.light(28,18,[1.1,1.1,1.3]);C.light(28,30,[1.0,1.0,1.3]);
  // the gate to the Telescope Room (a silver pillar with a seal of light) and the mirror in the east wall
  put('col_silver',PSF3O.GATE[0],PSF3O.GATE[1],{npc:'psf3o_gate',sc:1.15});
  put('mirror_haunted_b',PSF3O.MIRRORDOOR[0],PSF3O.MIRRORDOOR[1],{npc:'psf3o_mirrordoor',sc:1.1});
  // ---- the Chart Room ----
  for(const k in PSF3O.STANDS){const [x,y]=PSF3O.STANDS[k];put(PSF3O.PIC[k],x,y,{npc:'psf3o_s_'+k,sc:.9})}
  for(const x of [7,9,11,13,15])pic(WALLP[x%WALLP.length],x,20,[0,-1]);
  pic('window_stained_tall',6,27,[-1,0]);pic('window_stained_tall',16,27,[1,0]);
  put('globe',11,28,{sc:.9});C.light(11,25,[1.1,1.1,1.4]);cand(7,29);cand(15,29);
  // ---- the Study ----
  put('ghost_scholar',10,9,{npc:'psf3o_astro',sc:1});put('lectern',7,12,{npc:'psf3o_lecternB'});put('reading_desk',12,8);
  pic('furn_bookcase',8,6,[0,-1]);pic('bookcase_tall',12,6,[0,-1]);C.chest(13,13,{gold:3000,tier:1});cand(7,8,[1.3,1.1,.8]);C.light(10,10,[1.3,1.1,.8]);
  pspSafeRect(C,6,6,14,14);
  // ---- the Telescope Room ----
  put('f2_flagpole',PSF3O.SCOPE[0],PSF3O.SCOPE[1],{npc:'psf3o_scope',sc:1.5});C.light(28,7,[1.4,1.4,1.5]);
  pic('window_rose',28,4,[0,-1]);pic('window_stained_tall',23,4,[0,-1]);pic('window_stained_tall',33,4,[0,-1]);
  put('globe',24,9,{sc:1});put('table_books',32,9);cand(24,6);cand(32,6);
  // ---- the Archive ----
  for(const x of [45,47,49,51])pic(x%4===1?'furn_bookcase':'bookcase_tall',x,32,[0,-1]);
  put('lectern',48,35,{npc:'psf3o_lecternC'});put('scroll_rack',51,34);put('table_books',45,38);C.chest(51,40,{gold:3600,tier:1});
  cand(45,34);cand(51,36);C.light(48,37,[1.2,1.1,.9]);
  // ---- the Reflecting Court ----
  for(const y of [18,22,26]){C.column(44,y,'silver');C.column(51,y,'silver')}
  put('furn_mirror_gothic',PSF3O.GLASS[0],PSF3O.GLASS[1],{npc:'psf3o_glass',sc:1.35});
  for(const x of [44,50])pic('mirror_haunted_a',x,16,[0,-1]);
  for(const y of [20,25,29])pic('mirror_haunted_c',53,y,[1,0]);
  {const d=put('stair_spiral_iron',PSF3O.UP[0],PSF3O.UP[1],{npc:'psf3o_up',sc:1});if(d){d.hidden=true;d.found=true;d.block=false}}
  C.light(47,19,[1.2,1.2,1.5]);C.light(47,25,[1.1,1.1,1.4]);
  // ---- creatures ----
  const L=info.lvl||107;
  for(const [t,x,y] of [['psmirrorshade',24,22],['psmirrorshade',32,26],['psstarwraith',28,19],['psclockwork',22,28],['psclockwork',34,22],
      ['psstarmoth',9,28],['psstarmoth',14,27],['psstarwraith',26,7],['psstarwraith',31,8],
      ['psclockwork',47,38],['psclockwork',50,34],['psstarmoth',46,40]])pspFoe(C,t,x,y,{lvl:L});
  C.glow(6.5,PSH_COL.cold);
  return C.finish({start:{x:28,y:40,f:0}})}
pspRegister(PSF3O.ID,psf3oBuild);
/* ---------- the creatures ---------- */
{
  const E=(id,name,img,ph,hp,dmg,verb,ex)=>{ENEMY_DEF[id]=pscE(id,Object.assign({img,ph,name,hp,dmg,verb,xp:Math.round(30+hp/10),gold:[200,520]},ex||{}))};
  E('psmirrorshade','Mirror Shade','gyi_shade',1.7,92,[10,15],'rakes',{fly:true,floatH:.1,w:.7});
  E('psstarwraith','Star Wraith','ps_c_pswraith',2.1,118,[11,16],'burns',{fly:true,floatH:.12,glow:.5});
  E('psclockwork','Brass Clockwork Guardian','ps_c_psarmour',1.9,170,[12,18],'smashes',{still:0});
  E('psstarmoth','Star Moth Swarm','ps_c_psmoth',.9,64,[9,13],'dusts',{speed:2,fly:true,floatH:.3,blind:1});
  if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^psmirrorshade/,'cursed',.12],[/^psstarwraith/,'cursed',.15],[/^psstarmoth/,'shaken',.25]);
}
/* ---------- the boss ---------- */
{
  psf3oReflectArt=function(){return f2Tint('ps_psreflect',pspPic('f2_sleeper_up'),'grayscale(1) brightness(1.9) contrast(.85)','rgba(190,215,255,.4)')};
  ENEMY_DEF.psreflect=pscE('psreflect',{img:'ps_psreflect',ph:2.6,w:1.2,name:"The Sovereign's Reflection",hp:760,dmg:[14,20],hit:.9,verb:'shatters',xp:1550,boss:true,aboveParty:0,gold:[0,0]});
  if(typeof NO_VARY!=='undefined')NO_VARY.push('psreflect');
  if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.psreflect=[5600,7200];
  if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^psreflect/,'cursed',.2]);
}
var psf3oReflectArt;
function psf3oReflectFix(){const k=psf3oReflectArt(),im=k&&IMG[k];if(im&&im.width){ENEMY_DEF.psreflect.w=+(ENEMY_DEF.psreflect.ph*im.width/im.height).toFixed(2);if(NPC_H.ps_f2_sleeper_up!==undefined)NPC_H[k]=NPC_H.ps_f2_sleeper_up}return !!k}
const psf3oLive=()=>(G.enemies||[]).some(e=>e.t==='psreflect'&&e.hp>0);
function psf3oRise(){if(LEVEL!==PSF3O.ID)return;const F=psf3oF();F.reflect=1;psf3oReflectFix();if(!psf3oLive())bl3Add('psreflect',PSF3O.SPAWN[0],PSF3O.SPAWN[1],108);psf3oApply()}
/* the boss changes what it fights with every quarter of its health lost */
bl3Hit('psreflect',e=>{
  const r=e.hp/e.maxhp,ph=r<.25?3:r<.5?2:r<.75?1:0;if(ph<=(e._ph|0))return;e._ph=ph;
  const T=[null,['psmirrorshade','psmirrorshade'],['psclockwork'],['psstarwraith','psstarwraith']][ph],M=[null,'The Reflection cracks across the face. Two shades step out of the cracks.','The glass behind her bulges, and a brass guardian marches out of the mirror.','The Reflection throws her head back. Two star wraiths pour out of her mouth.'][ph];
  for(const t of T){if(G.enemies.filter(m=>m._kid&&m.hp>0).length>=4)break;const m=bl3Add(t,e.x,e.y,108);if(m)m._kid=1}
  msg(M,'#c8d8ff')});
bl3Kill('psreflect',e=>{
  const F=psf3oF();F.reflect=2;
  try{f2Chime('open')}catch(x){}
  msg("The Reflection falls apart into a hundred bright pieces, and each piece shows a different face for a moment, and then only a ceiling.",'#d8e4ff');
  if(!F.got){F.got=1;bl3Give('pg_mirrorshield');msg("A round shield of silvered glass lies among the pieces: the Shield of the Last Reflection.",'#ffe36a')}
  later(900,()=>{psf3oApply();msg('At the back of the Court, a spiral stair of black iron stands where a mirror hung. It goes up.','#e0ecff')})});
pgrItem('pg_mirrorshield',{n:'Shield of the Last Reflection',k:'shield',t:'Shield',ic:'shield',c:PGR_C.vio,armor:40,pas:{ward:26,thorns:20,dodge:.08,spellPct:.08},sw:.5,
  d:"A round shield of silvered glass that did not break when the Sovereign's Reflection did. Armour 40, every blow on the wearer is 26 lighter, 20 damage is thrown back at each melee attacker, enemies miss 8% more, and spells strike 8% harder."});
/* ---------- the two cutscenes ---------- */
CUTS.psScope=()=>[
  {text:'You put your eye to the brass eyepiece. The glass is cold. For a moment there is only black, and then stars.'},
  {text:'The telescope does not point at the sky. It points at the Spire itself, from far outside, as if the tower were looking at its own reflection.'},
  {text:'You see the Observatory laid out like a map. In the east wall of the Gallery, between two tall mirrors, a thin door is drawn in lines of silver. Something stands behind it, waiting.'},
  {who:'The Astronomer',text:'That is the Reflecting Court. The Sovereign built it so she could look at herself. She has looked for a very long time, and I think it has begun to look back.'},
  {who:hn(1),text:'It is waiting for us.'},
  {text:'Far below, in the east wall of the Gallery, a mirror swings open on a hinge that was never there.'}];
CUTS.psReflect=()=>[
  {text:'The great mirror shows the party. Then it shows the party a moment late. Then it shows a woman in silver, standing exactly where you stand.'},
  {who:"The Sovereign's Reflection",text:'I am what she sees when she looks. She looks every day, and every day I am a little less like her and a little more like me.'},
  {who:hn(0),text:'You are not the Sovereign.'},
  {who:"The Sovereign's Reflection",text:'No. I am what is left of her when you take away the crown, the key and the lie. Come and look.'},
  {who:hn(2),text:'We have broken worse things than glass.'},
  {text:'The mirror bulges like a held breath, and she steps out of it.'}];
/* ---------- the things to touch ---------- */
const PSF3O_CLUE={A:'The Lamp rises first. The Mirror rises last.',B:'The Hound rises before the Crown.',C:'The Ladder rises after the Crown.'};
function psf3oNote(id,key,name,txt){khNpc(id,name,'ps_lectern',()=>{const F=psf3oF();(F.notes=F.notes||{})[key]=1;return say(txt+" (Written into your notes: "+PSF3O_CLUE[key]+")",[BYE])})}
psf3oNote('psf3o_lecternA','A','A lectern in the Gallery',"A page in a neat hand lies open on the lectern. It reads: THE ASTRONOMER'S NOTE, PAGE ONE. THE FIVE STAR CHARTS ARE IN THE CHART ROOM, THE WEST ROOM OFF THIS GALLERY. EACH CHART HAS A BRASS PIN UNDER IT. PRESS THE FIVE PINS IN THE ORDER THE CONSTELLATIONS RISE. THE LAMP RISES FIRST. THE MIRROR RISES LAST. PAGE TWO IS IN MY STUDY, NORTH OF THE CHART ROOM. PAGE THREE IS IN THE ARCHIVE, SOUTH-EAST.");
psf3oNote('psf3o_lecternB','B','A lectern in the Study',"A page in the same hand reads: THE ASTRONOMER'S NOTE, PAGE TWO. THE HOUND RISES BEFORE THE CROWN.");
psf3oNote('psf3o_lecternC','C','A lectern in the Archive',"A page in the same hand reads: THE ASTRONOMER'S NOTE, PAGE THREE. THE LADDER RISES AFTER THE CROWN.");
function psf3oNotesText(){const N=psf3oF().notes||{},got=['A','B','C'].filter(k=>N[k]);
  if(!got.length)return "You have no notes yet. The Astronomer's three pages are on lecterns in the Gallery, the Study and the Archive.";
  return "Your notes: "+got.map(k=>PSF3O_CLUE[k]).join(' ')+(got.length<3?" ("+got.length+" of 3 pages found.)":" That is all three pages. Together they fix the whole order: put the first constellation to rise first, and work along to the last.")}
function psf3oStand(k){const nm=PSF3O.NAMES[k];
  khNpc('psf3o_s_'+k,'The chart of '+nm,'ps_scroll_rack',()=>{const F=psf3oF();
    if(F.chart)return say("The chart of "+nm+" glows faintly. Its brass pin is pressed down, and all five pins are held down together.",[BYE]);
    return say("This is one of five star charts. This one shows "+nm+", a knot of bright stars joined by thin lines. Under it is a brass pin. The five pins must be pressed in the order the constellations rise. "+F.seq.length+" of 5 pins are pressed down so far.",[
      ['Read my notes.',()=>say(psf3oNotesText(),[BYE])],
      [F.seq.includes(k)?'The pin is already down.':'Press the pin.',()=>{G.talk=null;const F=psf3oF();if(F.seq.includes(k))return null;
        F.seq.push(k);sfx('door');const r=psf3oCheck(F.seq);
        if(r==='done'){F.chart=1;try{f2Chime('open')}catch(e){}psf3oApply();msg('The fifth pin clicks down. All five charts light up together, and a deep note rings through the Gallery. Far to the north, the silver gate to the Telescope Room lets go.','#e0f0ff')}
        else if(r==='ok')msg('The pin clicks down and stays down. '+F.seq.length+' of 5 pins are pressed.','#c8c4e0');
        else{F.seq=[];msg('The pin clicks, and then all five pins spring back up with a bang. Something shakes loose from the dark.','#ffb0b0');try{f2Release('f2shadow',2,Math.round(G.P.x),Math.round(G.P.y))}catch(e){}}
        return null}],BYE])})}
for(const k in PSF3O.STANDS)psf3oStand(k);
khNpc('psf3o_gate','The Silver Gate','ps_col_silver',()=>say("A pillar of silver stands in the passage north of the Gallery, with a seal of light across it. It will not let you by. A line on its base says: WHEN THE STARS ARE IN ORDER, THE EYE IS OPEN.",[BYE]));
khNpc('psf3o_mirrordoor','A tall mirror','ps_mirror_haunted_b',()=>say("A tall mirror hangs in the east wall of the Gallery, in a narrow passage. It shows the passage and the party, and nothing else. It does not move when you push it.",[BYE]));
khNpc('psf3o_scope','The telescope','ps_f2_flagpole',()=>{const F=psf3oF();
  if(!F.scope)return say("A long brass telescope on a heavy stand points up through a round hole in the dome. The lens is clean, and the eyepiece is cold.",[
    ['Look through it.',()=>{G.talk=null;const F=psf3oF();F.scope=1;startCut('psScope',()=>{psf3oApply()});return null}],BYE]);
  return say("Through the lens you see the Observatory from far outside, like a map. In the east wall of the Gallery a door of silver lines stands open.",[BYE])});
khNpc('psf3o_glass','The great mirror','ps_furn_mirror_gothic',()=>{const F=psf3oF();
  if(F.reflect===2)return say("The great mirror is a frame of black wood with nothing in it. The glass lies on the floor in a hundred pieces.",[BYE]);
  if(F.reflect===1)return say("The mirror is empty. Something in the Court is looking at you.",[BYE]);
  return say("A mirror taller than a door fills the north wall of the Court. It shows the party, but a moment late, as if the reflections had to be told what to do.",[
    ['Touch the glass.',()=>{G.talk=null;const F=psf3oF();F.reflect=1;startCut('psReflect',()=>psf3oRise());return null}],BYE])});
khNpc('psf3o_up','The spiral stair','ps_stair_spiral_iron',()=>{const l=PSP.LINKS.find(k=>k.from===PSF3O.ID&&k.to===9890);
  return say("A spiral stair of black iron winds up into the dark. It goes to the Moon Tower, on the fourth floor. Cold air comes down it, and it smells of dust and old stars.",[
    ['Climb the stair.',()=>{G.talk=null;const q=l?pspLandOf(l):[20,20,0];sfx('door');goToLevel(9890,{x:q[0],y:q[1],f:q[2]});return null}],BYE])});
/* ---------- the Astronomer and his quest ---------- */
khNpc('psf3o_astro','The Astronomer','ps_ghost_scholar',()=>{const F=psf3oF();
  if(F.reflect===2)return say("The Court is quiet. For the first time in a hundred years nothing looks back at me from the glass. Go up, if you want to. The Moon Tower is the next thing the Sovereign watched.",[BYE]);
  if(F.scope)return say("You have seen the Court through my telescope, then. Go in and break the Reflection. I would come with you, but I do not like mirrors.",[BYE]);
  if(F.chart)return say("The gate is open. The telescope is in the room to the north. Look through it.",[BYE]);
  return say("I am the Astronomer, or I was. I watched the stars from this room for the Sovereign, and then I watched the Sovereign, and then I could not stop. My three pages of notes are in the Gallery, in my Study and in the Archive. They tell the order in which the five constellations rise.",[BYE])});
{const steps=[
  ['Press the five pins in the Chart Room in the order the constellations rise. The notes are on lecterns in the Gallery, the Study and the Archive.',()=>!!psf3oF().chart,['psf3o_s_lamp']],
  ['Look through the telescope in the Telescope Room, north of the Gallery.',()=>!!psf3oF().scope,['psf3o_scope']],
  ["Break the Sovereign's Reflection in the Reflecting Court, east of the Gallery.",()=>psf3oF().reflect===2,['psf3o_glass']]];
 yrQ('psq41',"The Sovereign's Reflection",'The Astronomer, in his Study',steps,{gold:22000,xp:120000,items:['elixir','elixir','supermana']});
 QAREA.psq41=PSP.REGION}
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids});
  QRF.T.psq41={give:[N(9881,'psf3o_astro')],act:()=>{const F=psf3oF();return !F.chart?[N(9881,'psf3o_s_lamp')]:!F.scope?[N(9881,'psf3o_scope')]:F.reflect!==2?[N(9881,'psf3o_glass')]:[]},ready:[N(9881,'psf3o_astro')]}}
blGiveOpt('psf3o_astro','psq41',()=>true,{
  offer:"The Sovereign built a Court at the east end of this Gallery to look at herself, and the Court has begun to look back. I want it ended. Press the five pins in the Chart Room in the right order, and the gate to my telescope opens. Look through it, and it will show you the way into the Court. Then break what waits there. Will you do it?",
  accept:"Thank you. My notes will tell you the order. Do not guess at the pins: a wrong one lets shades out.",
  remind:()=>{const F=psf3oF();return F.reflect===2?"It is done. Come back to me.":F.scope?"Go through the mirror door in the east wall of the Gallery, and break the Reflection.":F.chart?"The gate is open. Look through the telescope, in the room to the north.":"Press the five pins in the Chart Room. The order is in my three pages of notes."},
  ready:"The glass is broken. I felt it from here, like a tooth coming out.",
  thanks:"Take this, and the stores of the Gallery with it. I have nothing else to give.",
  after:"The Court is quiet, and the stair at the back of it goes up to the Moon Tower, on the fourth floor. It is not open yet."});
/* ---------- arriving, and the boss that is loose but not on the floor ---------- */
pspOnArrive(n=>{if(n!==PSF3O.ID)return;try{psf3oApply();const F=psf3oF();if(!F.seen){F.seen=1;msg('The stair ends in a long gallery under a dome. Brass rings and star charts hang from the ceiling, and the stars in the glass overhead are not the ones outside.','#d8d4f0')}
  if(F.reflect===1&&!psf3oLive())PSF3O.riseAt=0}catch(e){console.error('psf3o arrive',e)}});
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(typeof LEVEL!=='undefined'&&LEVEL===PSF3O.ID){const F=psf3oF();
    if(F.reflect===1&&!psf3oLive()&&G.state==='play'&&!G.cut&&!G.talk&&G.enemies){PSF3O.riseAt=PSF3O.riseAt||G.time+.8;if(G.time>=PSF3O.riseAt){PSF3O.riseAt=0;psf3oRise()}}}}catch(e){console.error('psf3o update',e)}
  return r}}
/* ---------- the links ---------- */
PSP_L(9880,null,9881,[28,40,0],{name:'the stair up to the Observatory Gallery'});
PSP_L(9881,[28,42],9880,[28,10,2],{name:'the stair back down to the Hall of Mirrors'});
PSP_L(9881,null,9890,[20,20,0],{name:'the spiral stair to the Moon Tower',prov:1});
