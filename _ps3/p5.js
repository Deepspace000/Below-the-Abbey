/* ---------- doors ---------- */
function pshSelfMove(a){G.talk=null;sfx('door');G.P.x=a[0];G.P.y=a[1];G.P.f=a[2];G.P.angT=(a[2]-1)*Math.PI/2;G.C={x:a[0],y:a[1],a:G.P.angT};try{reveal()}catch(e){}}
function pshDoor(d,nx,ny){
  const F=pshF();
  if(d.psh==='link'){const l=d.link;
    if(l.lock){
      if(bagCount(l.lock)<=0){sfx('locked');msg('An iron-bound door with a silver lock. It will not move. The key must be somewhere on this floor.','#c8c4e8');
        if(typeof QUESTS!=='undefined'&&QUESTS.psq10&&qSt('psq10')===null){qAccept('psq10');msg('The Chamberlain in the Entrance Hall may know where the key is kept.','#ffe36a')}return true}
      if(!F.stairOpen){F.stairOpen=1;msg('The silver key turns in the lock without a sound. The door opens inward.','#dcd4ff')}}
    if(!LEVELS[l.to]&&!KH_LAZY[l.to]){sfx('locked');msg('The way beyond is not open yet.','#c8c4e8');return true}
    if(!LEVELS[l.to])try{KH_LAZY[l.to]()}catch(e){console.error(e)}
    sfx('door');goToLevel(l.to,{x:l.land[0],y:l.land[1],f:l.land[2]});return true}
  if(d.psh==='warp'){const into=G.P.y<d.y?d.b:d.a;pshSelfMove(into);if(into===d.b)msg("The Lady's Withdrawing Room. It is warm and quiet here, and the light is candlelight. Nothing has followed you in.",'#f0c890');return true}
  if(d.psh==='closet'){if(F.closetOpen||bagCount('pskeyclo')>0){F.closetOpen=1;if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;sfx('door');msg("The brass key turns. The painters' closet is open.",'#e8dcc0');return true}
    sfx('locked');msg("A small door with a brass lock. A sign on it says PAINTERS. It is locked.",'#c8c4e8');return true}
  if(d.psh==='barred'){sfx('locked');msg("The Sovereign's audience chamber. Sealed.",'#c8c4e8');return true}
  if(d.psh==='niche'){if(F[d.flag]){if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}sfx('bump');msg('A wall of cold stone. Nothing else.','#a8a8b8');return true}
  return false}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];if(d&&d.psh)return pshDoor(d,nx,ny);return _k.apply(this,arguments)}}
/* arrival: hidden chests and opened secret doors follow the flags; the party is told where it is */
const PSH_HID=[[24,68,'framePainted'],[88,68,'statueTurned']];
function pshApply(){
  const F=pshF();if(!G.decor||!G.grid)return;
  for(const [x,y,flag] of PSH_HID){const on=!!F[flag];for(const d of G.decor)if(d.k==='chest'&&d.x===x&&d.y===y){d.found=!on;d.hidden=!on;if(!on)d.block=false}if(on&&G.grid[y+1])G.grid[y+1][x]=0}
  if(F.closetOpen&&G.grid[69])G.grid[69][10]=0}
function pshArrive(n){try{pshApply()}catch(e){console.error('pshApply',e)}}
/* ---------- helpers ---------- */
function pshGive(item){if(!bagAdd(mkItem(item)))G.items.push({k:item,x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false})}
function pshDismiss(pred){let n=0;for(const e of G.enemies||[])if(e.hp>0&&!e.dying&&pred(e)){e.hp=0;e.dying=.55;n++}return n}
function pshTake(id,name,pic,flag,item,before,after,btn,done){
  khNpc(id,name,pic,d=>{const F=pshF();if(F[flag])return say(after,[BYE]);
    return say(before,[[btn,()=>{F[flag]=1;pshGive(item);sfx('key');msg(done,'#ffe36a');G.talk=null;return null}],BYE])});}
const pshTalk=(id,name,pic,text)=>khNpc(id,name,pic,()=>say(text,[BYE]));
const pshCount=o=>Object.keys(o||{}).length;
/* ---------- quests and people ---------- */
if(typeof QAREA!=='undefined'){for(const q of ['psq10','psq11','psq12'])QAREA[q]='The Pale Lands'}
yrQ('psq10','Up the Grand Stair','The Chamberlain, in the Entrance Hall',[
  ['Find the Second Floor Key. The Chamberlain says the household went up the Grand Stair and the keys went with the Sacristan. Ask the porter at the gate, the librarian and the prisoners below.',()=>!!pshF().key2||bagCount('pskey2')>0||!!pshF().stairOpen,['psh_chamberlain']],
  ['Open the iron-bound Grand Stair door at the north end of the Great Halls with the key.',()=>!!pshF().stairOpen,['psh_chamberlain']]],{gold:8000,xp:50000,items:['potion6','potion6']});
yrQ('psq11','The Wrong Waltz','The Lutenist, in the Music Salon',[
  ['Find the three sheets of the waltz: one on the stand in the Music Salon, one on the lectern in the Gallery of Portraits, one on the high table of the Banqueting Hall.',()=>!!(bagCount('pssheet1')&&bagCount('pssheet2')&&bagCount('pssheet3'))||!!pshF().waltz,['psh_stand1','psh_stand2','psh_sheet3']],
  ['Play the three sheets at the harpsichord in the Music Salon.',()=>!!pshF().waltz,['psh_harp']]],{gold:6500,xp:40000,items:['pslutering']});
yrQ('psq12',"The Curator's Count",'The Curator, in the Hall of Statues',[
  ['Read the nameplates of six statues in the Hall of Statues, so that the Curator can have them counted and named.',()=>pshCount(pshF().pl)>=6,['psh_pl0','psh_pl1','psh_pl2','psh_pl3','psh_pl4','psh_pl5']]],{gold:5000,xp:30000,items:['potion6']});
khNpc('psh_chamberlain','The Chamberlain (a ghost)','ps_p_chamberlain',()=>say('Good evening. Or good morning. I have lost the habit of telling them apart. I am the Chamberlain of this house, and I am afraid the house is closed. The Sovereign and the whole household went up the Grand Stair long ago, and the stair has been locked ever since. I cannot open it myself. I cannot open anything, now.',[
  ['What is this place?',()=>say('The Great Halls, the ground floor of the main block. The Great Hall is straight ahead, with the long tables. The Gallery of Portraits is west, the Hall of Statues is east. The service wing is beyond the Screens Passage, west of the Great Hall, and the cloister and chapel are beyond the Banqueting Hall, to the east.',[BYE])],BYE]));
blGiveOpt('psh_chamberlain','psq10',()=>true,{
  offer:'There is a door at the north end of the Great Halls, the Grand Stair, with a silver lock. The Sovereign sent for the key when the household went up, and nobody ever brought it back. If the key could be found, the stair could be opened. I would like to know that somebody had tried. Will you look for it?',
  accept:'Thank you. The keys of the upper floors were always returned to the Sacristan at dusk. The porter at the gate, the librarian in the east wing and the prisoners in the dungeons may remember more than I do. I am a ghost, and ghosts forget.',
  remind:()=>pshF().stairOpen?'Go back to the Chamberlain: the door is open.':'The key to the Grand Stair. Ask the porter at the gate, the librarian, and the prisoners below. Then open the iron-bound door at the north end of the Great Halls.',
  ready:'You have opened it. I heard the lock turn from here, and I think I have not heard a sound so good in a hundred years.',
  thanks:'The household is up there still. Mind them. Take this, it is the last of the kitchen stores.',
  after:'The stair is open. I will stay here, in case anyone comes back down.'});
khNpc('psh_lutenist','The Lutenist (a ghost)','ps_p_lutenist',()=>say('Shh. Listen. Do you hear it? The waltz in the walls. It is wrong. It was always wrong, but now it will not stop, and the dancers will not stop either.',[
  ['Who are the dancers?',()=>say('Courtiers of the house. They danced here on the night the household went up the stair, and they have danced since. They do not know they are dead.',[BYE])],BYE]));
blGiveOpt('psh_lutenist','psq11',()=>true,{
  offer:'I wrote a waltz for the last ball. Three sheets: one for this salon, one for the Gallery of Portraits and one for the Banqueting Hall, where the high table stood. The sheets were scattered, and now the waltz is only half played, over and over, in the walls. If you could find all three and play them through at the harpsichord, I think the dancers would be allowed to rest.',
  accept:'The sheet for this room is on the music stand in the corner. The Gallery sheet is on a lectern at the east end of the Gallery of Portraits. The last one lies on the high table in the Banqueting Hall, east of the Great Hall. Play them on the harpsichord when you have all three.',
  remind:()=>(bagCount('pssheet1')+bagCount('pssheet2')+bagCount('pssheet3'))+' of 3 sheets. The Salon stand, the Gallery lectern, the Banqueting Hall table. Then the harpsichord.',
  ready:'You have played it. The walls are quiet. For the first time since the ball, they are quiet.',
  thanks:'Take this ring. It was given to me by the old Queen. I will not be needing it.',
  after:'The salon is quiet. A few of the courtiers still stand about, but they no longer dance.'});
khNpc('psh_curator','The Curator (a ghost)','ps_p_curator',()=>say('Mind the plinths. The statues of this hall are the pride of the house: the founders in the bays on the left, the monsters of the old wars on the right. The count has not been kept since I died.',[BYE]));
blGiveOpt('psh_curator','psq12',()=>true,{
  offer:'I never finished the count. The plinths bear names, if the dust is wiped off. If you would read six of them, I could close the book. Any six will do, and they are along both walls, in the arched bays.',
  accept:'Thank you. Stand in front of a statue and look at the plinth. Six names, and then come back to me.',
  remind:()=>pshCount(pshF().pl)+' of 6 plinths read.',
  ready:'Six names. The Founder, the Hydra, the Judge: I knew them all. The count is closed.',
  thanks:'Here, a little something from the Curator\'s purse.',
  after:'The count is closed. I like to look at them just the same.'});
/* the six plinths of psq12 and the two kings of the entrance hall */
const PSH_PL=[
  ['KING ALDWIN THE FOUNDER','A plinth of grey stone. The nameplate reads KING ALDWIN THE FOUNDER, WHO RAISED THE FIRST TOWER. The stone king holds a trowel instead of a sword.'],
  ['THE HYDRA OF MARWEN','The nameplate reads THE HYDRA OF MARWEN, SLAIN AT THE FORD BY SIR ROLAND. The statue has five necks, and every head has been carved looking at the door.'],
  ['QUEEN ISOLDE THE LATE','The nameplate reads QUEEN ISOLDE THE LATE, WHO WAS ALWAYS AFTER THE FEAST. Her stone hands are open, as if she were waiting for a cup.'],
  ['THE JUDGE OF HORNS','The nameplate reads THE JUDGE OF HORNS, WHO SAT AT THE OLD ASSIZE. A heavy statue with ram horns and a pair of scales, and one of the pans is missing.'],
  ['THE HEADLESS KNIGHT','The nameplate reads SIR EDMUND, WHO WOULD NOT BOW. The statue kneels and has no head at all. The neck has been cut smooth, and the cut has been polished.'],
  ['THE HOUND OF THE HUNT','The nameplate reads BRAN, FIRST HOUND OF THE SOVEREIGN. The marble hound looks very alive, and has been set facing the door.']];
PSH_PL.forEach((p,i)=>khNpc('psh_pl'+i,p[0],'ps_hst'+(i%5),()=>{const F=pshF();F.pl=F.pl||{};const first=!F.pl[i];F.pl[i]=1;return say(p[1]+(first&&qSt('psq12')==='active'?' ('+pshCount(F.pl)+' of 6 plinths read.)':''),[BYE])}));
pshTalk('psh_anc1','A statue of an ancestor','ps_hst1','A tall statue on a plinth. The nameplate reads KING OSRIC THE FIRST, 220 YEARS BEFORE THE LAST. The stone face is calm. The eyes were once painted, and the paint has gone.');
pshTalk('psh_anc2','A statue of an ancestor','ps_hst2','A statue of a queen with a crown of stone leaves. The nameplate reads QUEEN MAUD, MOTHER OF THE SOVEREIGN. Somebody has left a dry white rose at her feet, a long time ago.');
pshTalk('psh_suitA','A suit of armour','ps_suit_armour','A suit of plate armour on a wooden stand. The visor is down. It does not move, and neither does the dust on it.');
pshTalk('psh_notice','A notice','hl_p_note','A notice board of the household. It reads: HOUSEHOLD ORDERS. DINNER AT SEVEN IN THE GREAT HALL. SERVANTS TO USE THE SCREENS PASSAGE. NO ONE TO GO UP THE GRAND STAIR WITHOUT THE KEY. The last line has been underlined twice.');
pshTalk('psh_seating','The seating of the house','hl_p_note','A card of seating for the Great Hall: the long tables for the household and guests, the high table on the dais for the Sovereign. There is a name for every chair, and every name has been struck out with a single line.');
pshTalk('psh_huntbook','The hunt book','hl_p_note','A heavy book chained to the table. It lists the hunts of the Sovereign, one line each: the date, the quarry, the hounds. The last line reads: THE QUARRY WAS NOT AN ANIMAL. HOUNDS RETURNED. HUNTER DID NOT.');
pshTalk('psh_easel','An easel','hl_p_lectern',"An easel with a half-finished picture on it. It shows a woman at a window, and the face has never been painted. The brushes beside it are dry. A note is pinned to the easel: THE LAST PORTRAIT. FRAME NINE. I WILL FINISH IT TOMORROW.");
khNpc('psh_isaude','A portrait of Lady Isaude Marwen','ps_pt_isaude',()=>{const F=pshF();
  if(F.signet)return say('The portrait of Lady Isaude Marwen: a calm woman in a dark gown with a small gold heron on her hand. The back of the frame is bare, and so is the wall behind it.',[BYE]);
  return say('The portrait of Lady Isaude Marwen: a calm woman in a dark gown. A small gold heron is painted on her hand, and the painted ring has a real shine. The frame is loose on the wall.',[['Look behind the frame.',()=>{F.signet=1;pshGive('pssignet');sfx('key');msg("A gold signet ring cut with a heron lies in a gap behind the frame. You take it.",'#ffe36a');G.talk=null;return null}],BYE])});
khNpc('psh_emptyframe','An empty frame','ps_pt_empty',()=>{const F=pshF();
  if(F.framePainted)return say('The gold frame now holds a picture of a woman at a window. The paint is still wet in places. Somewhere nearby, stone is grinding.',[BYE]);
  const pal=bagCount('pspalette')>0||bagCount('psgauntpalette')>0||bagCount('psgaunt')>0||F.palette;
  return say('A gold frame with nothing in it, hanging by itself. A little brass plate says: THE LAST PORTRAIT. NOT YET PAINTED.',pal?[['Paint the frame with the painter\'s palette.',()=>{pshPaintFrame();return null}],BYE]:[BYE])});
function pshPaintFrame(){const F=pshF();if(F.framePainted)return false;F.framePainted=1;G.talk=null;sfx('door');msg('You paint the empty frame with the court painter\'s palette. A wall nearby grinds open, and a niche shows behind it.','#ffe36a');pshApply();return true}
khNpc('psh_pigments','A shelf of pigments','hl_p_shelf',()=>say('The shelf is empty, except for dry brushes and dust.',[BYE]));
{const n=NPCS.psh_pigments,old=n.root;n.root=d=>{const F=pshF();if(F.pigments)return old(d);return say('A shelf of small clay pots, each with a dab of colour on the lid. Three pots have a violet mark scratched on them, as if set aside.',[['Take the three marked pots.',()=>{F.pigments=1;pshGive('pspigment');pshGive('pspigment');pshGive('pspigment');sfx('key');msg('You take three pots of pigment.','#ffe36a');G.talk=null;return null}],BYE])};if(KH_KEEPERS.psh_pigments)KH_KEEPERS.psh_pigments.root=n.root}
pshTake('psh_keyboard','A board of key hooks','hl_p_rack','closetKey','pskeyclo','A board of brass hooks, each with a paper label: LARDER, PANTRY, SILVER, CELLAR. All the hooks are empty but one. The label on it says PAINTERS, and the key hangs there on a loop of string.','The hooks are empty. A paper label still says PAINTERS, over a bare nail.','Take the key marked PAINTERS.','You take a small brass key marked PAINTERS.');
pshTake('psh_stand1','A music stand','hl_p_lectern','sheet1','pssheet1','A music stand with a single sheet on it, written for the harpsichord. The title is in neat hand: WALTZ FOR THE LAST BALL, THE SALON.','The music stand is bare.','Take the sheet.','You take the first sheet of the waltz.');
pshTake('psh_stand2','A lectern','hl_p_lectern','sheet2','pssheet2','A lectern with a sheet of music clipped to it: WALTZ FOR THE LAST BALL, THE GALLERY.','The lectern is bare.','Take the sheet.','You take the second sheet of the waltz.');
pshTake('psh_sheet3','A sheet of music on the table','hl_p_note','sheet3','pssheet3','A sheet of music lying on the high table among the plates: WALTZ FOR THE LAST BALL, THE BANQUET.','Only crumbs and old wine rings are left on the table here.','Take the sheet.','You take the third sheet of the waltz.');
khNpc('psh_harp','A harpsichord','ps_harpsichord',()=>{const F=pshF();
  if(F.waltz)return say('The harpsichord is quiet. The strings have a faint violet bloom on them, like frost.',[BYE]);
  const all=bagCount('pssheet1')&&bagCount('pssheet2')&&bagCount('pssheet3');
  if(!all)return say('A harpsichord with a cracked lid. A music desk stands open on it, with room for three sheets of music. You have '+(bagCount('pssheet1')+bagCount('pssheet2')+bagCount('pssheet3'))+' of the three.',[['Press a key.',()=>say('One high note rings, then another, then the rest of the notes try to follow it and give up. It is the wrong waltz, and there is a gap in it the size of a sheet.',[BYE])],BYE]);
  return say('Three sheets of music, ready on the desk. The harpsichord is cold.',[['Play the waltz.',()=>{F.waltz=1;G.talk=null;try{if(typeof tone==='function'){const n=[392,440,494,587,523,440,392,330];n.forEach((f,i)=>{tone(f,f*.99,.5,'triangle',.05,i*.45);tone(f/2,f/2,.5,'sine',.03,i*.45)})}}catch(e){}
    const n=pshDismiss(e=>e.t==='psdancer'&&e.x<34&&e.y<52);msg('The waltz comes out whole this time. In the walls, in the floor, the other half of the tune answers and falls quiet.'+(n?' The dancing dead stop, one by one, and fade away.':''),'#ffe36a');sfx('level');return null}],BYE])});
khNpc('psh_bed','A four-poster bed','ps_bed_four',()=>say('A great four-poster bed with violet curtains, made up fresh. The candles in the room burn with a warm yellow flame, the only warm light in the castle. Nothing in this room has ever moved.',[['Rest.',()=>{G.talk=null;if(typeof restParty==='function')restParty(true);return null}],BYE]));
pshTalk('psh_turner','A statue of a monster','ps_hst7','A heavy statue on a plinth in front of a plain stretch of wall. The plinth has an iron ring set into its side, worn bright.');
{const n=NPCS.psh_turner,old=n.root;n.root=d=>{const F=pshF();if(F.statueTurned)return say('The statue has been turned. Behind it, a niche stands open in the wall.',[BYE]);
  return say('A heavy statue on a plinth in front of a plain stretch of wall. The plinth has an iron ring set into its side, worn bright, and a scrape on the floor shows that it has been turned before.',[['Turn the statue by the ring.',()=>{F.statueTurned=1;G.talk=null;sfx('door');msg('The statue turns on its plinth with a grinding sound. A niche opens in the wall behind it.','#ffe36a');pshApply();return null}],BYE])};if(KH_KEEPERS.psh_turner)KH_KEEPERS.psh_turner.root=n.root}
/* the ghosts at the banquet: they do not move until the party sits at the head of the table */
const PSH_GUESTS=['The guest is a pale lady in a long gown. She holds a cup to her lips and does not drink.','A pale man in a doublet sits straight, looking at the empty plate in front of him, and smiling at it.','An old courtier, his chin on his chest. His hands rest on the table either side of a goblet that has dried to a ring.','A pale lady turns the stem of her glass between her fingers. She does not look at you. She is listening to something far away.','A courtier in a feathered hat sits very still. The feather moves, slowly, as if in a draught, though the air is quiet.','A young woman in a grey gown stares at the high table. The chair at the head is empty. She is waiting.','An old man with a white beard raises a hand to speak, and has been raising it for a hundred years.','A lady with a fan, fanning nothing.','A pale man with his napkin tucked in, a fork in his hand, and nothing on the fork.'];
for(let i=0;i<9;i++)khNpc('psh_guest'+i,'A ghost at the table','ps_p_courtier'+((i%5)+1),()=>say(PSH_GUESTS[i]+' It does not answer.',[BYE]));
khNpc('psh_headchair','The head of the table','ps_chair_high',()=>{const F=pshF();
  if(F.banquet)return say('The head of the table. The chair is pulled out, and the plates are empty.',[BYE]);
  return say('A tall chair at the head of the long table, pulled out as if the host had just risen. Every ghost at the table is facing it, and none has moved.',[['Sit down.',()=>{F.banquet=1;G.talk=null;sfx('rattle');
    const L=[[86,47],[92,47],[98,47],[102,53],[90,53],[96,53]];let n=0;for(const [x,y] of L){if(bl3Add(n%3===0?'psdancer':'pscourtier',x,y,101))n++}
    for(let i=0;i<9;i++){for(const d of G.decor)if(d.npc==='psh_guest'+i){d.found=true;d.hidden=true;d.block=false}}
    msg('As you sit, every chair scrapes back at once. The guests stand, all together, and turn to look at you.','#ffd0d0');return null}],BYE])});
/* ---------- the two great ones: what they leave behind ---------- */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&pshIs(LEVEL)){const F=pshF();
    if(e.t==='psstairwarden'&&!F.wardenDead){F.wardenDead=1;pshGive('pswardhalberd');msg("The Stair Warden's armour falls apart in pieces. The halberd rings on the stone, and you take it.",'#ffe36a')}
    if(e.t==='psantlered'&&!F.antleredDead){F.antleredDead=1;pshGive('psantlerring');msg("The Antlered Lord is gone. A silver ring lies on the table where his hand was, and you take it.",'#ffe36a')}}}catch(x){console.error('psh kill',x)}
  return r}}
/* ---------- chests: potions and gear for the rating of the place; the lady's chest holds potions only; the hunting chest holds the good bow ---------- */
ITEMDEF.pshuntbow={n:"The Sovereign's Hunting Bow",k:'weapon',t:'Bow',ic:'bow',c:'#d0d4ec',dmg:[500,600],hit:.16,req:{dex:72},lvl:102,price:0,rar:1,ranged:7,eff:{pierce:1,double:.3},dbl:.15,sw:.42,d:"A long bow of pale yew bound with silver wire, kept in the Trophy and Hunting Hall. Shoots 7 squares, its arrows pass through to the foe behind, and three shots in ten send a second arrow. Needs level 102."};
{const _lf=lootFor;lootFor=function(d){
  if(pshIs(LEVEL)&&d&&d.k==='chest'){const r=q=>hash2(d.x,d.y,700+q),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    if(d.x===104&&d.y===12){add('pshuntbow');add(potionFor(r(1)),1);add('supermana',2);d.gold=5200;return items}
    for(let q=0;q<3;q++)add(potionFor(r(10+q)),1);add('supermana',1+(d.y<30?1:0));if(r(2)<.7)add('elixir',1);
    if(d.y>30){for(let q=0;q<2;q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}if(typeof ringFor==='function'&&r(3)<.6)add(ringFor(r(4),101))}
    d.gold=d.goldAmt||(d.y<30?2400:4200+Math.floor(r(5)*2800));
    if(d.x===24&&d.y===68||d.x===88&&d.y===68){if(typeof gemFor==='function')try{add(gemFor(r(6)))}catch(e){}d.gold=7500}
    return items}
  return _lf.apply(this,arguments)}}
/* ---------- the jump link and a test helper ---------- */
function pshReport(){const L=LEVELS[PSH.ID]||(KH_LAZY[PSH.ID]&&(KH_LAZY[PSH.ID](),LEVELS[PSH.ID]));if(!L)return null;const c={};for(const d of L.decor)c[d.k]=(c[d.k]||0)+1;return {decor:L.decor.length,enemies:L.enemies.length,lights:L.lights.length,cols:(c.ps_col_fluted||0)+(c.ps_col_twist||0)+(c.ps_col_silver||0),pics:L.decor.filter(d=>d.pic).length,miss:L._psh.miss}}
