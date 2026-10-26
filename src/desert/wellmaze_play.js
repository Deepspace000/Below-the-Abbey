/* ==========================================================================
   THE WELL MAZE: how it plays (prefix wm / WM). State is G.flags.wm (saved with the game): open doors, switches pulled, weights on the scale, bells rung, lanterns lit, pits sprung, hints
   read, the boss and the prize. Doors: stair doors need their own key (Violet, Amethyst, Warden's), vault doors open to a switch or a puzzle, secret doors open when walked into.
   ========================================================================== */
function wmF(){const F=G.flags;if(!F.wm)F.wm={open:{},sw:{},got:{},hint:{},pit:{},unl:{},wb:0,wc:0,bell:[],lamp:[],pz:{},seen:{},pin:{},bossDead:0,prize:0,row:0};return F.wm}
function wmTalk(name,node,img){G.talk={d:null,n:{name,img},node,t:G.time,btns:[]};G.hold=null;G.queued=null}
function wmOpenCell(x,y){const F=wmF();F.open[LEVEL+':'+x+','+y]=1;if(G.grid[y])G.grid[y][x]=0}
/* open the door of a vault (the cell stays open for good, and the map gets a pin) */
function wmOpenVault(vault,quiet){const L=LEVELS[LEVEL],v=L&&L._wm&&L._wm.vault[vault];if(!v)return false;const F=wmF();if(F.open[LEVEL+':'+v.x+','+v.y])return false;
  wmOpenCell(v.x,v.y);F.pin[LEVEL+':'+vault]=1;sfx('door');G.shake=.45;if(!quiet)msg('Somewhere a door grinds open.','#ffe9a0');return true}
/* ---------- doors ---------- */
function wmKeyish(){const id=['wmkey1','wmkey2','wmkey3'];return id.some(i=>bagCount(i)>0)||(G.keys||0)>0||!!G.flags.goldKey||(typeof HGDS_KEYS!=='undefined'&&HGDS_KEYS.some(k=>bagCount('hgdkey_'+k[0])>0))}
function wmDoorBump(L,dd,nx,ny){
  const F=wmF(),k=L._wm.k;
  if(dd.type==='secret'){G.shake=.3;sfx('door');msg('The wall gives way. A hidden door grinds open.','#ffe9a0');wmOpenCell(nx,ny);later(300,endRound);return true}
  if(dd.type==='sealed'){sfx('locked');G.shake=.1;msg('The wall is cold and solid. Something far away holds it shut.','#d09a80');return true}
  if(dd.type==='riddle'){wmRiddle();return true}
  if(dd.type==='up'){sfx('door');msg('You climb the stair up.','#cfe0ff');goToLevel(WM.IDS[k-1],WM.M[k-1].back);return true}
  if(dd.type==='down'){
    if(!F.unl[k]){
      const id=dd.key;
      if(bagCount(id)>0){bagRemove(id,1);F.unl[k]=1;sfx('door');msg('The '+ITEMDEF[id].n+' turns, the lock clicks, and the key crumbles to violet dust in your hand. The door opens.','#ffe070')}
      else{sfx('locked');msg(wmKeyish()?'This lock is the wrong shape.':'The lock is stamped with a shape. You need the '+ITEMDEF[id].n+'.','#d09a80');return true}}
    sfx('door');msg('You go down the stair.','#cfe0ff');goToLevel(WM.IDS[k+1],WM.M[k+1].arrive);return true}
  return false}
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(wmIn()&&g!==0){const L=LEVELS[LEVEL],dd=L&&L._wm&&L._wm.doors[nx+','+ny];if(dd&&wmDoorBump(L,dd,nx,ny))return true}}catch(e){console.error('wm bump',e)}
  return _db.apply(this,arguments)}}
/* ---------- the riddle door (498) ---------- */
function wmRiddle(){
  const F=wmF(),L=LEVELS[LEVEL],v=L._wm.vault.riddle;
  const ans=(good)=>()=>{if(good){wmOpenCell(v.x,v.y);F.pin[LEVEL+':riddle']=1;sfx('door');return say('The plaque glows violet. "Well answered." The door swings open.',[['Go in.',()=>null]])}
    sfx('locked');return say('The plaque dims. Nothing happens. You may try again.',[['Think again.',()=>null]])};
  wmTalk('The plaque on the door',say('Letters are cut into the plaque: "I AM DUG BUT NEVER BURIED. I AM DEEP, AND HAVE NO FLOOR OF MY OWN. FILL ME AND I GIVE. LEAVE ME EMPTY AND I WAIT. WHAT AM I?"',[['A grave.',ans(false)],['A cellar.',ans(false)],['A well.',ans(true)],['A bucket.',ans(false)],['Leave.',()=>null]]),'wm_keydoor')}
/* ---------- the ladder up to Wenlock ---------- */
function wmClimb(n){ // the town builds itself when its pictures are ready, so a ladder used straight after a load waits for it a moment
  const back=(typeof WK!=='undefined'&&WK.WELLBACK)||{x:2,y:2,f:0};
  if(!LEVELS[WK.WENLOCK]&&KH_LAZY[WK.WENLOCK])try{KH_LAZY[WK.WENLOCK]()}catch(e){console.error(e)}
  if(!LEVELS[WK.WENLOCK]){if(n===0)msg('You start up the ladder. The daylight above is slow to come.','#cfe0ff');if(n<60)later(300,()=>wmClimb(n+1));else msg('The ladder will not take your weight. Try again in a moment.','#d09a80');return}
  sfx('door');goToLevel(WK.WENLOCK,back);G.state='play'}
NPCS.wm_ladderup={name:'The ladder',img:'wm_ladder',root:d=>say('An iron-bound ladder climbs the shaft to a coin of daylight, far above. A bucket-rope sways beside it.',[['Climb up to Wenlock.',()=>{G.talk=null;wmClimb(0);return null}],['Stay below.',()=>null]])};
/* ---------- the switches ---------- */
function wmSwitch(n){return LEVELS[LEVEL]._wm.sw[n]}
function wmSwitchTalk(n){
  const F=wmF(),L=LEVELS[LEVEL],s=wmSwitch(n);if(!s)return say('A stone post. Nothing happens.',[BYE]);
  const id=LEVEL+':'+n,what=s.type==='crank'?'crank':s.type==='chain'?'chain':'lever';
  if(F.sw[id])return say('The '+what+' has been worked. It sits as it was left.',[BYE]);
  return say('A '+(s.type==='crank'?'bronze crank wheel':s.type==='chain'?'hanging chain with a bronze handle':'stone post with an iron lever')+'. It looks as if it would still move.',[[s.type==='crank'?'Turn it.':'Pull it.',()=>{
    F.sw[id]=1;sfx('door');G.shake=.2;
    const d=G.decor.find(q=>q.x===s.x&&q.y===s.y&&q.npc==='wmsw_'+n);if(d&&s.type==='lever')d.k='wm_lever_down';
    const same=L._wm.sw.filter(q=>q.vault===s.vault),done=same.filter(q=>F.sw[LEVEL+':'+q.n]).length;
    if(done>=s.need){wmOpenVault(s.vault,true);return say(s.need>1?'The second crank turns. Chains rattle all through the walls, and somewhere a door grinds open.':'It moves with a heavy clunk. Somewhere a door grinds open.',[['Good.',()=>null]])}
    return say('The crank turns, and somewhere far off a chain clanks tight. Something is waiting for the other one.',[['Hm.',()=>null]])}],BYE])}
for(let n=0;n<4;n++)NPCS['wmsw_'+n]={name:'A mechanism',img:'wm_lever_up',root:d=>wmSwitchTalk(n)};
/* ---------- the weights (497): barrels and crates for the scale at the shaft ---------- */
function wmPickWeight(d,kind){
  const F=wmF(),key=LEVEL+':'+d.x+','+d.y;
  if(F.got[key])return say('Only a ring in the dust where it stood.',[BYE]);
  return say(kind==='b'?'A small barrel of sand. A number is burned into the lid: 25.':'A small crate of lead shot. A number is burned into the lid: 15.',[[kind==='b'?'Take the barrel.':'Take the crate.',()=>{
    const it=mkItem(kind==='b'?'wmbarrel':'wmcrate');if(!bagAdd(it)){msg('Your bag is full.','#d09a80');return null}
    F.got[key]=1;d.found=true;d.block=false;sfx('equip');msg('You take it.','#9ae0a0');return null}],BYE])}
NPCS.wmw_barrel={name:'A weighted barrel',img:'wm_barrel',root:d=>wmPickWeight(d,'b')};
NPCS.wmw_crate={name:'A weighted crate',img:'wm_crate',root:d=>wmPickWeight(d,'c')};
function wmScaleTalk(){
  const F=wmF(),tot=25*F.wb+15*F.wc,done=F.pz.weights;
  if(done)return say('The scale stands level, a barrel and a crate on the pan. The bucket pan has settled on the old store door, which stands open.',[BYE]);
  const state='The scale has two pans. On the left a bucket hangs from a rope. On the right is the weight pan: '+F.wb+' barrel'+(F.wb===1?'':'s')+' (25 each) and '+F.wc+' crate'+(F.wc===1?'':'s')+' (15 each), '+tot+' in all. You carry '+bagCount('wmbarrel')+' barrels and '+bagCount('wmcrate')+' crates.';
  return say(state,[
    ['Put a barrel on the pan.',()=>{if(bagCount('wmbarrel')<1)return say('You have no barrel to put on.',[['Back.',()=>wmScaleTalk()]]);bagRemove('wmbarrel',1);F.wb++;sfx('equip');return wmScaleTalk()}],
    ['Put a crate on the pan.',()=>{if(bagCount('wmcrate')<1)return say('You have no crate to put on.',[['Back.',()=>wmScaleTalk()]]);bagRemove('wmcrate',1);F.wc++;sfx('equip');return wmScaleTalk()}],
    ['Take everything off the pan.',()=>{for(let i=0;i<F.wb;i++)bagAdd(mkItem('wmbarrel'));for(let i=0;i<F.wc;i++)bagAdd(mkItem('wmcrate'));F.wb=0;F.wc=0;sfx('equip');return wmScaleTalk()}],
    ['Weigh the bucket.',()=>{
      if(tot===80){F.pz.weights=1;wmOpenVault('weights',true);sfx('level');return say('The scale tips and settles level, and a bell rings once down the shaft. Somewhere a door grinds open.',[['Good.',()=>null]])}
      return say(tot<80?'The bucket side still hangs low. The pan is too light.':'The scale groans and jams against its stops. The pan is too heavy.',[['Back.',()=>wmScaleTalk()]])}],
    BYE])}
NPCS.wm_scale={name:'The scale',img:'wm_scale',root:d=>wmScaleTalk()};
/* ---------- the boat and the rowing stone (the island in the cistern, 497) ---------- */
function wmRow(to){
  const L=LEVELS[LEVEL],M=L._wm.M,isl=M.rooms.find(r=>r.kind==='island'),cis=M.rooms.find(r=>r.kind==='cistern');
  if(!isl||!cis)return say('The boat is old and the water is shallow. It goes nowhere.',[BYE]);
  const dest=to==='b'?{x:isl.x0+1,y:(isl.y0+isl.y1)>>1,f:1}:{x:cis.x0+1,y:(cis.y0+cis.y1)>>1,f:1};
  return say(to==='b'?'A small boat is tied at the stair, and beside it a flat stone carved with oars. The water is black and quite still.':'The boat waits at the island steps. The stair on the far shore is a dim smudge.',[[to==='b'?'Sit on the rowing stone and row.':'Row back.',()=>{
    sfx('door');G.talk=null;G.P.x=dest.x;G.P.y=dest.y;G.P.f=dest.f;G.P.angT=(dest.f-1)*Math.PI/2;G.C={x:G.P.x,y:G.P.y,a:G.P.angT};try{reveal()}catch(e){}
    msg(to==='b'?'The oars dip without a sound. The far shore slides closer, and then the boat grounds on a small dry island.':'The boat glides back across the black water to the stair.','#cfe0ff');wmF().row=1;return null}],BYE])}
NPCS.wmrow_a={name:'The boat',img:'wm_boat',root:d=>wmRow('b')};
NPCS.wmrow_b={name:'The boat',img:'wm_boat',root:d=>wmRow('a')};
/* ---------- the mirrors (498) ---------- */
function wmMirrorText(i){
  const m=LEVELS[LEVEL]._wm.mirror;if(!m)return 'The glass is cloudy and shows only you.';
  const word=t=>t==='R'?'turn RIGHT':t==='L'?'turn LEFT':'turn about';
  const runs=(flip)=>m.runs.map((r,j)=>'walk '+r.n+(r.n===1?' square':' squares')+(r.turn?', then '+word(flip&&r.turn!=='B'?(r.turn==='R'?'L':'R'):r.turn):'')).join('; ');
  const side=flip=>m.side==='ahead'?'dead ahead':(flip?(m.side==='left'?'right':'left'):m.side);
  if(i===0)return 'In the glass you see a white crystal in a dead end, and yourself standing on it, facing the only way out. The reflection walks: '+runs(true)+'. Then it stops, and the wall on its '+side(true)+' is missing. A door is drawn there in the glass, though in life there is none.';
  if(i===1)return 'The mirror shows a long dim walk, bending and bending. It is you, walking from the white crystal: '+runs(true)+'. At the end the reflection reaches out to the '+side(true)+' and the wall is not there.';
  return 'The glass turns everything about. What is left in it is right in life, and what is right is left. Up and down are the same. The reflection of a walk from the white crystal is: '+runs(true)+'. Stop at the end. The missing wall is on the '+side(true)+' in the glass.'}
for(let i=0;i<3;i++)NPCS['wmmirror_'+i]={name:'A tall mirror',img:'wm_mirror',root:d=>{try{wmF().hint.mirror=1}catch(e){}return say(wmMirrorText(i),[BYE])}};
/* ---------- the three bells (499): low long, middle short, high long ---------- */
const WM_BELLCODE=[1,2,5]; // bell*2 + (long?1:0): bell 0 long, bell 1 short, bell 2 long
function wmBell(i){
  const F=wmF(),L=LEVELS[LEVEL];
  if(F.pz.bells)return say('The bell hangs quiet. The vault it opened stands open.',[BYE]);
  const nm=['low','middle','high'][i],ring=(long)=>()=>{
    F.bell.push(i*2+(long?1:0));while(F.bell.length>3)F.bell.shift();sfx('level');G.shake=.15;
    const tone=i===0?(long?'BOOOONG, and the note hangs and hangs':'bong'):i===1?(long?'DONNNG, long and round':'dong'):(long?'a high ringing that will not stop':'ting');
    if(F.bell.length===3&&F.bell.every((v,j)=>v===WM_BELLCODE[j])){F.pz.bells=1;F.bell=[];wmOpenVault('bells',true);return say('The '+nm+' bell: '+tone+'. The last peal fades, and under the floor a lock turns. Somewhere a door grinds open.',[['Good.',()=>null]])}
    if(F.bell.length===3){F.bell=[];return say('The '+nm+' bell: '+tone+'. The three bells jangle sourly together and fall silent. Nothing else happens.',[['Again.',()=>null]])}
    return say('The '+nm+' bell: '+tone+'.',[['Go on.',()=>null]])};
  return say('A great bronze bell hangs from an iron frame, the '+nm+' of three. Its clapper is wrapped in a strip of old cloth, and the cloth is easy to slip off.',[['Ring it long.',ring(true)],['Ring it short.',ring(false)],BYE])}
for(let i=0;i<3;i++)NPCS['wmbell_'+i]={name:['The low bell','The middle bell','The high bell'][i],img:'wm_bell',root:d=>wmBell(i)};
/* ---------- the three lanterns (502): lilac, gold, violet ---------- */
const WM_LAMPORDER=[1,2,0]; // 0 violet, 1 lilac, 2 gold
function wmLamp(i){
  const F=wmF(),nm=['violet','lilac','gold'][i];
  if(F.pz.lanterns)return say('The '+nm+' lantern burns steadily. The hall is awake, and the treasury is open.',[BYE]);
  return say('A hanging lantern, cold and dark, its glass tinted '+nm+'. A wick waits inside. '+(F.lamp.length?'Lit so far: '+F.lamp.map(v=>['violet','lilac','gold'][v]).join(', ')+'.':'None of the three is lit.'),[
    ['Light it.',()=>{
      if(F.lamp.includes(i))return say('It is already lit.',[BYE]);
      F.lamp.push(i);sfx('level');
      if(F.lamp.every((v,j)=>v===WM_LAMPORDER[j])){
        if(F.lamp.length===3){F.pz.lanterns=1;wmOpenVault('lanterns',true);return say('The '+nm+' lantern catches, and all three burn together. A deep note sounds in the floor. Somewhere a door grinds open.',[['Good.',()=>null]])}
        return say('The '+nm+' lantern catches and burns '+nm+'. Something in the hall holds its breath.',[['Go on.',()=>null]])}
      F.lamp=[];G.shake=.3;sfx('locked');return say('The '+nm+' flame catches, gutters, and all the lanterns go dark together with a sigh. They can be lit again.',[['Again.',()=>null]])}],BYE])}
for(let i=0;i<3;i++)NPCS['wmlamp_'+i]={name:['The violet lantern','The lilac lantern','The gold lantern'][i],img:['wm_lantern_violet','wm_lantern_lilac','wm_lantern_gold'][i],root:d=>wmLamp(i)};
/* ---------- the prize, taken after the Warden is dead ---------- */
NPCS.wm_prize={name:'The pedestal',img:'wm_orb_pedestal',root:d=>{
  const F=wmF();if(F.prize)return say('The pedestal is empty.',[BYE]);
  if(!F.bossDead)return say('A violet orb the size of a fist glows on the pedestal. Between you and it, the Well-Warden stands guard, and he is not asleep.',[BYE]);
  return say('The orb glows on its stand. It is warm, and it hums very quietly, the way a well hums at the bottom.',[['Take the orb.',()=>{
    const it=mkItem('wmheart');if(!bagAdd(it)){msg('Your bag is full.','#d09a80');return null}
    F.prize=1;G.flags.wlWellDone=true;d.found=true;d.block=false;sfx('level');G.shake=.3;
    msg('You lift the Heart of the Well from its stand. The whole Deep hums, and then goes still.','#e8c8ff');
    try{if(typeof wlWellQuestGoal==='function')wlWellQuestGoal()}catch(e){console.error(e)}return null}],BYE])}};
