/* ==========================================================================
   THE FIGHTS OF THE VAULT (prefix vt / VTX): the Barrow Warden (floor 1, carries the Pale Silver Key), the Silver Warden (floor 6, carries the Sanctum Seal) and Wystan Maldrake himself.
   Maldrake is not on the floor as a creature: he sits at his table as a person to talk to (vault_story.js). If the party chooses to fight, vtMaldrakeFight() takes him off the chair and puts the
   creature in his place. He is a hard level 89 boss in three phases (the dead of Underhill climb up at two thirds and at one third; the silver ring flares; he weeps, and says so).
   If the party chooses to listen instead (the Silver Contract read aloud), vtMaldrakeFree() ends it without a blow.
   Flags in G.flags.vt: fight (the fight began), fhp (his health, so that a saved game keeps it), dead (he fell in the fight), freed (the contract was read), gotKey, ph (phases done).
   ========================================================================== */
const VTX_MOVES=[
 [{every:3,mult:1.1,near:6,affl:'cursed',txt:'Maldrake lifts one hand and a black flame goes out of it, low and quiet, like a thing he has done a thousand nights.',col:'#a8b8ff',verb:'Black flame burns'},
  {every:5,all:true,mult:.5,affl:'shaken',txt:'The silver ring turns on his finger. Every hero feels something cold take hold of the heart, and let go.',col:'#cfe0ff',verb:'Cold seizes'}],
 [{every:3,mult:1.2,near:6,affl:'haunted',txt:'Maldrake says one word and the floor beside the front hero opens like a mouth. "I am so sorry," he says, and then the dead hand comes up.',col:'#90a8ff',verb:'A dead hand grips'},
  {every:4,all:true,mult:.6,affl:'cursed',txt:'The ring flares white. A wave of pale silver light goes through the whole party.',col:'#e8f0ff',verb:'Silver light burns'}],
 [{every:2,mult:1.25,near:7,affl:'shaken',txt:'Maldrake is crying. He does not stop casting. "Please," he says, and a spear of black silver goes through the front line.',col:'#8098ff',verb:'A spear of silver hits'},
  {every:3,all:true,mult:.7,affl:'cursed',txt:'The ring screams. Every hero is thrown by the sound.',col:'#f0f4ff',verb:'The ring screams at'}]];
ENEMY_DEF.vtmaldrake.act=e=>{
  if(e.hp<=0)return 0;const ph=Math.min(2,e.vtPh||0);
  const spec={moves:VTX_MOVES[ph]};if(ph>=1)spec.mend=[7,.025,'The ring drinks a little of the silver in the floor, and his wounds close.'];
  return gyBossAct(e,spec)};
ENEMY_DEF.vtwarden.act=e=>gyBossAct(e,{moves:[{every:3,mult:1.3,near:2,affl:'bleeding',txt:'The Barrow Warden brings the silvered blade round in a long stroke, the stroke of a man who has stood a post for three hundred years.',col:'#c8d8f0',verb:'The silver blade cuts'},{every:6,all:true,mult:.5,affl:'shaken',txt:'The Warden strikes the floor with the flat of the sword. The whole hall rings like a struck pan.',col:'#d8e4f4',verb:'The ringing deafens'}]});
ENEMY_DEF.vtsilver.act=e=>gyBossAct(e,{moves:[{every:3,mult:1.4,near:2,affl:'shaken',txt:'The Silver Warden swings the great sword in a flat arc, with no more effort than a gate swinging.',col:'#d0e0ff',verb:'The great sword hits'},{every:5,all:true,mult:.6,affl:'cursed',txt:'Silver mist pours out of the Warden\'s helm and fills the landing.',col:'#e0ecff',verb:'The silver mist burns'}],mend:[9,.03,'The Warden stands very still, and the silver in his armour closes the cuts.']});
const VTX_HELP={vtwarden:['gyskel','The Warden raises a hand, and two of the old guard step out of the walls.'],vtsilver:['gywraith','Two wraiths of the barrow guard slide out of the black stone and kneel to the Warden. Then they stand.'],vtmaldrake:['gyzombie','Villagers of Underhill climb up the stair behind him, in their Sunday clothes, with silver in their veins. They do not want to be here.']};
/* ---- every blow on one of the three: the helpers at two thirds and one third; the phases of Maldrake; his health is kept for a saved game ---- */
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  const def=e&&ENEMY_DEF[e.t],isV=!!(def&&def.vtb&&e.hp>0);
  _he.apply(this,arguments);
  try{
    if(isV){
      if(e.hp>0&&e.t==='vtmaldrake'){const F=vtF();F.fhp=e.hp/Math.max(1,e.maxhp)}
      if(e.hp<=0){vtBossDied(e);return}
      const step=Math.min(2,Math.floor((1-e.hp/e.maxhp)*3));if(e.vtSum===undefined)e.vtSum=Math.min(2,Math.max(0,Math.floor((1-(e.hp+dmg)/e.maxhp)*3)));
      while(e.vtSum<step){e.vtSum++;e.vtPh=e.vtSum;const H=VTX_HELP[e.t],free=gyFreeAround(e,4);
        if(H&&free.length){for(let n=0;n<2&&n<free.length;n++){addEnemy(H[0],free[n][0],free[n][1],true);const m=G.enemies[G.enemies.length-1];if(m){m.vtAdd=1;m.lvl=LEVELS[LEVEL].diff}}msg(H[1],'#d8d0e0');sfx('growl')}
        if(e.t==='vtmaldrake')msg(e.vtSum===1?'"They will not stop," Maldrake says, to himself. "I cannot make them stop."':'"Hurry," he says. "Hurry. Before the ring turns again."','#c8d4ff')}}
  }catch(x){console.error('vt boss hurt',x)}}}
function vtBossDied(e){
  const F=vtF(),t=e.t;
  {const L=LEVELS[LEVEL];for(const q of G.enemies)if(q.hp>0&&q.vtAdd){q.hp=0;q.dying=.4}}
  if(t==='vtwarden'){
    if(!bagAdd(mkItem('vtkey1')))G.items.push({k:'vtkey1',x:e.x,y:e.y,taken:false});F.keyTaken=1;
    msg('The Barrow Warden falls apart. A key of pale silver lies in the bones on a chain.','#ffe36a');sfx('win');
    later(1200,()=>msg('You have the Pale Silver Key. It opens the pale-silver lock at the south end of the hall.','#ffe36a'))}
  else if(t==='vtsilver'){
    if(!bagAdd(mkItem('vtseal')))G.items.push({k:'vtseal',x:e.x,y:e.y,taken:false});F.sealTaken=1;
    msg('The Silver Warden folds in on himself. A heavy seal of pale silver hangs from his belt on a cord.','#ffe36a');sfx('win');
    later(1200,()=>msg("You have the Sanctum Seal. It fits the lock on the door to Maldrake's Sanctum.",'#ffe36a'))}
  else if(t==='vtmaldrake'){
    F.dead=1;F.fight=2;F.gotKey=1;
    for(const it of ['potion6','potion6','supermana','supermana','elixir']){if(!bagAdd(mkItem(it)))G.items.push({k:it,x:e.x,y:e.y,taken:false})}
    for(const it of ['vtgatekey','vtstaff','vtring']){if(!bagAdd(mkItem(it)))G.items.push({k:it,x:e.x,y:e.y,taken:false})}
    msg('You have the Gate Key of Sale.','#ffe36a');sfx('win');
    const LAST="Wystan Maldrake sinks down on one knee, and the silver ring ticks against the floor. He looks at his hands, as if he had not seen them for years. 'Thank you,' he says. 'It was the only way you could, and I would not have let you do it any other way. The key is in my coat. The ring will not come off me, and it will not stop. Somebody must read the paper to the dead. I could not.' He is a heap of grey cloth, and the ring is still cold on a finger that is no longer there. The dead of Underhill have not lain down.";
    later(1500,()=>{G.talk={d:{k:'vti_maldrake',x:G.P.x,y:G.P.y,npc:'vto_maldrake'},n:{name:'Wystan Maldrake',root:()=>null},node:say(LAST,[['Take the key and go.',()=>{vtBossEnd();return null}]]),t:G.time,btns:[]}})}}
function vtBossEnd(){const F=vtF();try{vtMaldrakeVanish()}catch(e){}if(typeof qNote==='function')qNote()}
/* ---- the fight starts: the chair is empty, the creature stands where he sat ---- */
function vtMaldrakeVanish(){const L=LEVELS[9677];if(L)for(const d of L.decor)if(d.npc==='vto_maldrake')d.found=true;if(LEVEL===9677)for(const d of G.decor)if(d.npc==='vto_maldrake'){d.found=true;d.block=false}}
function vtMaldrakeFight(){
  const F=vtF();if(F.fight)return;F.fight=1;F.fhp=1;G.talk=null;vtMaldrakeVanish();
  const L=LEVELS[9677],d=L.decor.find(q=>q.npc==='vto_maldrake'),x=d?d.x:12,y=d?d.y:7;
  addEnemy('vtmaldrake',x,y,true);const m=G.enemies[G.enemies.length-1];if(m){m.lvl=89;m.base=89;m.fixed=LEVEL;m.maxhp=enemyStat('vtmaldrake',89).hp;m.hp=m.maxhp;m.vtPh=0;m.vtSum=0}
  sfx('growl');G.shake=.5;msg('Maldrake stands. The ring is a white fire on his hand. "Then be quick," he says.','#cfe0ff')}
/* a saved game inside the fight, or after it: the chair is empty, the creature (if still alive) stands with the health it had */
function vtSanctumState(){
  const F=vtF();if(LEVEL!==9677)return;
  if(F.fight||F.freed)vtMaldrakeVanish();
  if(F.fight===1&&!F.dead&&!F.freed&&!G.enemies.some(e=>e.t==='vtmaldrake'&&e.hp>0)){
    const L=LEVELS[9677],d=L.decor.find(q=>q.npc==='vto_maldrake'),x=d?d.x:12,y=d?d.y:7;
    addEnemy('vtmaldrake',x,y,true);const m=G.enemies[G.enemies.length-1];if(m){m.lvl=89;m.base=89;m.fixed=LEVEL;m.maxhp=enemyStat('vtmaldrake',89).hp;m.hp=Math.max(1,Math.ceil(m.maxhp*(F.fhp===undefined?1:F.fhp)));m.vtPh=Math.min(2,Math.floor((1-m.hp/m.maxhp)*3));m.vtSum=m.vtPh}}}
