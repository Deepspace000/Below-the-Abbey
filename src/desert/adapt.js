/* ==========================================================================
   INTELLIGENT ADJUSTMENT (Menu > Gameplay, on by default). The game watches how the party is doing and helps either way:
   1. If the party falls four times in a row in the same area (without winning five fights in between), the death screen offers help: make the game a bit easier for good
      (difficulty 30 percent lower), weaker enemies for 15 minutes (difficulty 50 percent lower for a while, then back), or a 15 minute boost of +5 to strength, dexterity and intelligence.
   2. If the party wins fights very fast (eight quick wins in a row: each enemy dead within two rounds, enemies not far below the party's level), the game puts the difficulty up one step
      (10 percent) and says "master player detected, putting difficulty up. ;)". If the wins stay that fast, it goes up another step, and so on (never more than 12 steps in all).
   Turn it off in Menu > Gameplay to play at exactly the difficulty that is set. State is kept in G.flags.ada (saved with the game); the death count and the fast-win count live only in the session.
   ========================================================================== */
const ADA={deaths:0,lastLv:-1,killsSince:0,counted:false,offer:false,fast:0,boostRounds:0};
const adaOn=()=>!(G.flags&&G.flags.noAdapt);
function adaF(){return G.flags.ada||(G.flags.ada={up:0,boostLeft:0,boostOn:0,lowLeft:0,lowDelta:0})}
function adaAvgLvl(){const a=G.heroes.filter(h=>h.alive);return a.length?a.reduce((s,h)=>s+h.lvl,0)/a.length:1}
function adaBoost(on){const F=adaF();if(on===!!F.boostOn)return;const d=on?5:-5;for(let i=0;i<G.heroes.length;i++){const h=G.heroes[i];h.str+=d;h.dex+=d;h.int+=d;try{recalcMax(i)}catch(e){}}F.boostOn=on?1:0}
function adaLow(on){const F=adaF();if(on){const was=G.flags.diffStep|0,n=Math.max(DIFF_MIN,was-5);F.lowDelta=was-n;G.flags.diffStep=n}else{const was=G.flags.diffStep|0;G.flags.diffStep=Math.min(DIFF_MAX,was+(F.lowDelta|0));F.lowDelta=0}try{diffApply()}catch(e){}}
function adaTick(dt){
  if(G.state==='dead'){
    if(!ADA.counted){ADA.counted=true;
      if(adaOn()){ADA.deaths=(ADA.lastLv===LEVEL||ADA.lastLv===-1)?ADA.deaths+1:1;ADA.lastLv=LEVEL;ADA.killsSince=0;ADA.fast=0;
        if(ADA.deaths>=4){ADA.offer=true;ADA.deaths=0}}}
  }else{ADA.counted=false;if(ADA.offer&&G.state!=='dead')ADA.offer=false}
  if(G.state==='play'&&G.flags&&G.flags.ada){const F=G.flags.ada;
    if(F.boostOn){F.boostLeft-=dt;if(F.boostLeft<=0){adaBoost(false);msg('The boost wears off. Your stats are back to normal.','#c8c8e8')}}
    if(F.lowDelta){F.lowLeft-=dt;if(F.lowLeft<=0){adaLow(false);msg('The enemies of this area are back to their normal strength.','#c8c8e8')}}}
}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{adaTick(dt||.016)}catch(e){console.error('adapt',e)}return r}}
/* fast wins: how many rounds each enemy took to kill */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){
  const was=e&&e.hp>0;if(was&&e._ada0===undefined)e._ada0=G.rounds;
  const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&adaOn()&&G.state==='play'){
    ADA.killsSince++;if(ADA.killsSince>=5)ADA.deaths=0;   // five wins after a fall and the string of falls is broken
    const lv=e.lvl||LEVEL_RATING[LEVEL]||0,dur=G.rounds-(e._ada0===undefined?G.rounds:e._ada0);
    if(lv>=adaAvgLvl()-8&&!(ENEMY_DEF[e.t]&&ENEMY_DEF[e.t].boss&&dur>=3)){
      if(dur<=1)ADA.fast++;else if(dur>=4)ADA.fast=Math.max(0,ADA.fast-2);
      const F=adaF();
      if(ADA.fast>=8&&F.up<12&&(G.flags.diffStep|0)<DIFF_MAX){ADA.fast=0;F.up++;diffChange(1);msg('master player detected, putting difficulty up. ;)','#ffd870')}}}}catch(x){console.error('adapt kill',x)}
  return r}}
/* the offer on the death screen */
function adaWrap(t,w,s){return wrapText(t,w,s)}
{const _d=drawEnd;drawEnd=function(win){
  if(win||!ADA.offer)return _d.apply(this,arguments);
  BTNS=[];veil(.78);bigPanel(50,26,380,268);
  ctx.save();ctx.font='20px '+FTITLE;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='#000';ctx.strokeText('The Party Has Fallen Again',240,52);ctx.fillStyle='#ff9a8a';ctx.fillText('The Party Has Fallen Again',240,52);ctx.restore();
  txt('Would you like a bit of help in this area?',240,78,11,'#e8d8a0','center',true);
  const lines=['You have fallen four times in a row here. You can keep trying as you are, or pick one of these. You can change the difficulty at any time in Menu > Gameplay, and turn Intelligent adjustment off there.'];
  let y=96;for(const p of lines)for(const l of adaWrap(p,330,8.4)){txt(l,240,y,8.4,'#cdbf94','center');y+=11}
  btnText('ada_ease','Make it a bit easier (difficulty -30%)',80,y+8,320,26);
  btnText('ada_low','Play at a lower level for 15 minutes',80,y+40,320,26);
  btnText('ada_boost','15 minute boost: +5 to STR, DEX and INT',80,y+72,320,26);
  btnText('ada_no','No thanks, I will carry on',80,y+112,320,26);
  txt('Easier and the 15 minute help are saved with your game.',240,y+150,7.6,'#a89c78','center')}}
{const _b=handleBtn;handleBtn=function(id){
  if(G.state==='dead'&&ADA.offer&&/^ada_/.test(id)){
    const F=adaF();
    if(id==='ada_ease'){G.flags.diffStep=Math.max(DIFF_MIN,(G.flags.diffStep|0)-3);try{diffApply()}catch(e){}msg('Difficulty: '+diffLabel()+'. You can change it in Menu > Gameplay.','#a8d8a0')}
    else if(id==='ada_low'){if(!F.lowDelta)adaLow(true);F.lowLeft=900;msg('For the next 15 minutes the enemies here are about half as hard.','#a8d8a0')}
    else if(id==='ada_boost'){adaBoost(true);F.boostLeft=900;msg('A 15 minute boost: +5 to strength, dexterity and intelligence.','#a8d8a0')}
    ADA.offer=false;ADA.deaths=0;ADA.killsSince=0;sfx('equip');return}
  if(G.menu==='gameplay'&&id==='gp_adapt'){G.flags.noAdapt=G.flags.noAdapt?0:1;
    if(G.flags.noAdapt)msg('Intelligent adjustment is OFF. The difficulty stays exactly where you set it.','#e8d8a0');
    else{msg('Intelligent adjustment is ON. If the party falls four times in a row in one area, the game offers help (an easier game, weaker enemies for 15 minutes, or a 15 minute +5 boost to STR, DEX and INT).','#e8d8a0');msg('If the party wins fights very fast, the game raises the difficulty one step at a time ("master player detected"). Turn it off here to stop both.','#e8d8a0')}
    return}
  return _b.apply(this,arguments)}}
