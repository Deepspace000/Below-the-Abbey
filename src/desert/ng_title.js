/* ==========================================================================
   (v3.881) 1. THE FIRST RATS. The two rats nearest the start of the crypts (within 8 squares of the start) are level 2 exactly (no spread), and the crypt's creatures are given their levels when a new game starts
      (they used to stand at the place's level 4 until the first level up).
   2. NEW GAME PLUS ON THE TITLE SCREEN. Once the Pale King has fallen (in any game on this computer: localStorage abbeyNgpDone) the title screen has a New Game Plus button of its own, which loads a finished
      game and offers to begin again, and a switch to turn New Game Plus off (abbeyNgpOn). With it off the button goes, the Gameplay menu button goes, and a New Game Plus game plays with no raised creatures
      and no raised weapons. ngEff() is the one place that says how much New Game Plus raises things: it is 0 unless the game has been completed, New Game Plus is on and this game is a New Game Plus game.
   ========================================================================== */
{const _c=crypt1Level;crypt1Level=function(e){
  const r=_c.apply(this,arguments);
  try{if(LEVEL===1&&e.t==='rat'&&e._r2===undefined){e._r2=Math.hypot(e.x-1,e.y-14)<=8;if(e._r2){e.zl=2;e.vd=0;e.vr=2}}
    if(LEVEL===1&&e._r2)return 2+(typeof ngEff==='function'?ngEff():0)}catch(err){}
  return r}}
{const _ls=levelSpread;levelSpread=function(e){if(LEVEL===1&&e&&e._r2)return 0;return _ls.apply(this,arguments)}}
{const _sg=startGame;startGame=function(){const r=_sg.apply(this,arguments);try{rebalanceEnemies()}catch(e){}return r}}
function ngpUnlocked(){try{return localStorage.getItem('abbeyNgpDone')==='1'}catch(e){return false}}
function ngpEnabled(){try{return localStorage.getItem('abbeyNgpOn')!=='0'}catch(e){return true}}
function ngpMark(){try{if(localStorage.getItem('abbeyNgpDone')!=='1')localStorage.setItem('abbeyNgpDone','1')}catch(e){}}
function ngDone(){try{return psf6S().king===2}catch(e){return false}}
function ngEff(){const F=G.flags||{};return (F.ngp&&F.ngOff&&ngpUnlocked()&&ngpEnabled())?(F.ngOff|0):0}
/* the finished game is noticed the moment the king falls, when a finished game is loaded or entered, and (once, at load) in the saves already on this computer */
{const _w=psf6Won;psf6Won=function(){const r=_w.apply(this,arguments);ngpMark();return r}}
{const _g=goToLevel;goToLevel=function(){try{if(!ngpUnlocked()&&ngDone())ngpMark()}catch(e){}return _g.apply(this,arguments)}}
function ngFinishedSave(){for(const [k] of SAVE_SLOTS){if(!hasSave(k))continue;const sv=readSave(k);try{if(sv&&sv.flags&&sv.flags.psp&&sv.flags.psp.f6&&sv.flags.psp.f6.king===2)return [k,sv]}catch(e){}}return null}
try{if(!ngpUnlocked()&&ngFinishedSave())ngpMark()}catch(e){}
/* the title screen */
{const _dt=drawTitle;drawTitle=function(){_dt.apply(this,arguments);
  try{if(G.state==='title'&&ngpUnlocked()){
    if(ngpEnabled())btnText('tngp','New Game Plus',296,150,122,21);
    btnText('tngpt','New Game Plus: '+(ngpEnabled()?'on':'off'),296,ngpEnabled()?176:150,122,21);
    if(G.ngpNote&&G.time-G.ngpNote<5)txt('No finished game found. Finish the Pale Tower first.',210,298,9,'#e8c878','center',true)}}catch(e){}}}
{const _tb=titleBtn;titleBtn=function(id){
  if(id==='tngpt'){try{localStorage.setItem('abbeyNgpOn',ngpEnabled()?'0':'1')}catch(e){}sfx('equip');return}
  if(id==='tngp'){audioInit();if(!ngpEnabled())return;const f=ngFinishedSave();if(!f){G.ngpNote=G.time;sfx('locked');return}
    restore(f[1]);const go=()=>{if(G.state!=='play'||G.cut||G.talk){if((go.n=(go.n||0)+1)<40)later(500,go);return}ngOffer()};later(900,go);return}
  return _tb.apply(this,arguments)}}
/* never before the game is completed: the offer and the beginning refuse, and the Gameplay menu button needs both a finished game and the switch on */
{const _no=ngOffer;ngOffer=function(){if(!ngDone()||!ngpEnabled())return;return _no.apply(this,arguments)}}
{const _nb=ngBegin;ngBegin=function(){if(!ngDone()||!ngpEnabled())return;ngpMark();return _nb.apply(this,arguments)}}
