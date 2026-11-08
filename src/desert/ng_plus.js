/* ==========================================================================
   NEW GAME PLUS (prefix ng). After the credits of the Pale King (and later from Menu > Gameplay once he is dead) the party may end the game or begin again.
   New Game Plus: the party goes back to the first dungeon (level 1, the crypts) with everything it owns: heroes at their level, gear, bag, spells and GOLD.
   Every quest, every town and every area starts again. Creatures are raised: G.flags.ngOff = the party level at completion minus 1, added to the level of every place (DIFF in index.html, and the level 1 crypts),
   so a level 1 creature stands at the party's level and every later one at its old level plus that. The Never-Ending Tower is kept open and keeps its record (its floors scale by themselves, so no offset there),
   and so do owned houses with their chest, kill counts for trophies and the game settings. Finishing the game again offers it again, with the new level.
   ========================================================================== */
const NG_KEEP=/^(nt|hs|ngp|tut|autoScaleOn|noBarNums|noAdapt|noFog|lookXNormal|diffStep|k_.*)$/;
const ngReady=()=>{try{return psf6S().king===2&&ngpEnabled()}catch(e){return false}};
function ngTalk(name,text,opts){G.talk={d:{k:'_',x:G.P.x,y:G.P.y},n:{name},node:say(text,opts),t:G.time,btns:[]};G.hold=null;G.queued=null}
function ngOffer(){
  const pl=partyLevel(),n=(G.flags.ngp|0);
  ngTalk('The tale is told','The Pale King is gone and the land is quiet. The party stands at level '+pl+'. You may end the game here, and your save stays as it is. Or you may begin New Game Plus: the party wakes again in the crypts under the abbey, with its level, gear, spells, bag and gold. Every quest starts again, and the creatures grow: a level 1 creature stands at level '+pl+', and every other one at its old level plus '+(pl-1)+'. The Never-Ending Tower stays open.'+(n?' (This would be New Game Plus number '+(n+1)+'.)':''),
    [['Begin New Game Plus',()=>ngConfirm()],['End the game',()=>{G.talk=null;try{backupAuto();writeSave('auto')}catch(e){}G.cut=null;G.menu=false;G.overview=false;G.state='title';return null}],['Not yet',()=>{G.talk=null;msg('The Gameplay menu offers New Game Plus whenever you want it.','#e0c090');return null}]])}
function ngConfirm(){
  return say('This starts a new journey. Your current game is saved first, so Load can bring it back. Are you sure?',[['Yes, begin again',()=>{G.talk=null;ngBegin();return null}],['Back',()=>ngOffer()||null]])}
function ngBegin(){
  try{writeSave('auto');backupAuto()}catch(e){console.error(e)}   // the finished game goes into the backup slot
  const old=G.flags,pl=partyLevel(),heroes=G.heroes,bag=G.bag,gold=G.gold,kept={};
  for(const k of Object.keys(old))if(NG_KEEP.test(k))kept[k]=old[k];
  G.talk=null;G.cut=null;G.loot=null;
  reset();
  G.heroes=heroes;G.bag=bag;G.gold=gold;
  for(const h of G.heroes){h.hp=h.max;h.mp=h.mpMax;h.alive=true;h.hurt=0;h.flash=0;h.food=100}
  Object.assign(G.flags,kept);G.flags.ngp=(old.ngp|0)+1;G.flags.ngOff=pl-1;
  try{rebalanceEnemies()}catch(e){console.error(e)}
  G.state='play';
  msg('New Game Plus. You wake in the crypts below the abbey, as you were. The creatures have grown to match you.','#ffe36a');
  try{writeAreaSaves()}catch(e){}}
/* the offset: every place's level goes up by ngOff, except the Never-Ending Tower, which scales by itself */
{const _c=crypt1Level;crypt1Level=function(e){const r=_c.apply(this,arguments);return r?r+(typeof ngEff==='function'?ngEff():0):r}}
/* the tower stays open to a New Game Plus party (ntLevelOk in nt_map.js passes when G.flags.ngp is set) */
/* the Gameplay menu: a button once the Pale King is dead */
{const _dg=drawGameplay;drawGameplay=function(){_dg.apply(this,arguments);if(ngReady())btnText('gp_ngp','New Game Plus',296,290,106,24)}}
{const _b=handleBtn;handleBtn=function(id){if(id==='gp_ngp'&&G.menu==='gameplay'){G.menu=false;ngOffer();return}return _b.apply(this,arguments)}}
