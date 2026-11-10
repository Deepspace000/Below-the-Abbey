/* ==========================================================================
   INTELLIGENT ADJUSTMENT (Menu > Gameplay, on by default). The game watches how the party is doing and helps either way:
   1. (Once per play session.) If the party falls four times in a row in the same area (without winning five fights in between), the death screen offers help: make the game a bit easier for good
      (difficulty 30 percent lower), weaker enemies for 15 minutes (difficulty 50 percent lower for a while, then back), or a 15 minute boost of +5 to strength, dexterity and intelligence.
   2. A two-way band. Every ordinary kill (enemy not far below the party's level, not a boss) is judged by what it cost since the kill before it:
      health lost (as a share of the party's full health), potions and food used, heroes fallen, and the rounds the enemy lasted.
        cheap  (no potion, nobody fell, at most 2.5 percent of health lost, enemy dead within two rounds): meter +1
        dear   (one potion, or a quarter of the party's health lost): meter -1
        hard   (a hero fell, two potions or more, or 45 percent of health lost): meter -3
        anything else: the meter moves one towards 0.      A fall of the whole party: meter -5.
      Meter at +8: difficulty up one step (10 percent), "master player detected, putting difficulty up. ;)". Meter at -8: difficulty down one step.
      The steps the game has added itself are in F.up: never more than 12 up, never more than 4 down, and a raise is taken back by the same road when the fights turn dear.
   Turn it off in Menu > Gameplay to play at exactly the difficulty that is set. State is kept in G.flags.ada (saved with the game); the meter (F.m) is saved too; only the count of falls in a row lives in the session.
   ========================================================================== */
const ADA={deaths:0,lastLv:-1,killsSince:0,counted:false,offer:false,shown:false,boostRounds:0,prev:null,pl:-1,lost:0,pots:0,fell:0};
const adaOn=()=>!(G.flags&&G.flags.noAdapt);
function adaF(){return G.flags.ada||(G.flags.ada={up:0,boostLeft:0,boostOn:0,lowLeft:0,lowDelta:0})}
function adaAvgLvl(){const a=G.heroes.filter(h=>h.alive);return a.length?a.reduce((s,h)=>s+h.lvl,0)/a.length:1}
function adaBoost(on){const F=adaF();if(on===!!F.boostOn)return;const d=on?5:-5;for(let i=0;i<G.heroes.length;i++){const h=G.heroes[i];h.str+=d;h.dex+=d;h.int+=d;try{recalcMax(i)}catch(e){}}F.boostOn=on?1:0}
function adaLow(on){const F=adaF();if(on){const was=G.flags.diffStep|0,n=Math.max(DIFF_MIN,was-5);F.lowDelta=was-n;G.flags.diffStep=n}else{const was=G.flags.diffStep|0;G.flags.diffStep=Math.min(DIFF_MAX,was+(F.lowDelta|0));F.lowDelta=0}try{diffApply()}catch(e){}}
/* the ledger: what the party has paid since the last kill */
function adaLedger0(){ADA.lost=0;ADA.pots=0;ADA.fell=0}
function adaWatch(){
  if(G.state!=='play'||!G.heroes){ADA.prev=null;return}
  const hs=G.heroes;
  if(ADA.prev&&ADA.prev.length===hs.length&&ADA.pl===LEVEL){
    for(let i=0;i<hs.length;i++){const p=ADA.prev[i],h=hs[i],now=h.alive?Math.max(0,h.hp):0;if(now<p.hp)ADA.lost+=p.hp-now;if(p.alive&&!h.alive)ADA.fell++;p.hp=now;p.alive=!!h.alive}}
  else{ADA.prev=hs.map(h=>({hp:h.alive?Math.max(0,h.hp):0,alive:!!h.alive}));ADA.pl=LEVEL;adaLedger0()}   // a new place, a loaded game, a changed party: start the ledger again
}
/* the band: move the difficulty one step when the meter reaches either end */
function adaBand(){
  const F=adaF();F.up=F.up|0;F.m=Math.max(-8,Math.min(8,F.m|0));
  if(F.m>=8){F.m=0;if(F.up<12&&(G.flags.diffStep|0)<DIFF_MAX){const back=F.up<0;F.up++;diffChange(1);msg(back?'The fights are going well again. Difficulty back up one step.':'master player detected, putting difficulty up. ;)','#ffd870')}}
  else if(F.m<=-8){F.m=0;if(F.up>-4&&(G.flags.diffStep|0)>DIFF_MIN){F.up--;diffChange(-1);msg('These fights are costing the party a lot. Difficulty eased one step.','#a8d8a0')}}
}
function adaTick(dt){
  try{adaWatch()}catch(e){}
  if(G.state==='dead'){
    if(!ADA.counted){ADA.counted=true;
      if(adaOn()){ADA.deaths=(ADA.lastLv===LEVEL||ADA.lastLv===-1)?ADA.deaths+1:1;ADA.lastLv=LEVEL;ADA.killsSince=0;try{adaF().m=(adaF().m|0)-5;adaBand()}catch(e){}
        if(ADA.deaths>=4){ADA.deaths=0;if(!ADA.shown){ADA.shown=true;ADA.offer=true}}}}   // the offer appears once a play session, so it never nags
  }else{ADA.counted=false;if(ADA.offer&&G.state!=='dead')ADA.offer=false}
  if(G.state==='play'&&G.flags&&G.flags.ada){const F=G.flags.ada;
    if(F.boostOn){F.boostLeft-=dt;if(F.boostLeft<=0){adaBoost(false);msg('The boost wears off. Your stats are back to normal.','#c8c8e8')}}
    if(F.lowDelta){F.lowLeft-=dt;if(F.lowLeft<=0){adaLow(false);msg('The enemies of this area are back to their normal strength.','#c8c8e8')}}}
}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);try{adaTick(dt||.016)}catch(e){console.error('adapt',e)}return r}}
/* potions and food used go in the ledger */
{const _uh=useHeal;useHeal=function(hi,idx){const r=_uh.apply(this,arguments);try{if(r&&G.state==='play')ADA.pots++}catch(e){}return r}}
/* a loaded game starts the ledger again, so the health of the save is not counted as health lost */
{const _rn=restoreNow;restoreNow=function(sv){ADA.prev=null;return _rn.apply(this,arguments)}}
/* each kill: what did it cost? */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){
  const was=e&&e.hp>0;if(was&&e._ada0===undefined)e._ada0=G.rounds;
  const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&adaOn()&&G.state==='play'){
    ADA.killsSince++;if(ADA.killsSince>=5)ADA.deaths=0;   // five wins after a fall and the string of falls is broken
    adaWatch();
    const lv=e.lvl||LEVEL_RATING[LEVEL]||0,dur=G.rounds-(e._ada0===undefined?G.rounds:e._ada0),D=ENEMY_DEF[e.t]||{};
    if(lv>=adaAvgLvl()-8&&!D.boss&&!(typeof isBossy==='function'&&isBossy(e.t))){
      const F=adaF(),mx=G.heroes.reduce((s,h)=>s+(h.max||h.hp||1),0)||1,cost=ADA.lost/mx;
      const hard=ADA.fell>0||ADA.pots>=2||cost>=.45,dear=!hard&&(ADA.pots===1||cost>=.25),cheap=!hard&&!dear&&cost<=.025&&dur<=2;
      let m=F.m|0;m=hard?m-3:dear?m-1:cheap?m+1:m>0?m-1:m<0?m+1:0;F.m=m;adaBand()}
    adaLedger0()}}catch(x){console.error('adapt kill',x)}
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
    else{msg('Intelligent adjustment is ON. If the party falls four times in a row in one area, the game offers help (an easier game, weaker enemies for 15 minutes, or a 15 minute +5 boost to STR, DEX and INT).','#e8d8a0');msg('The game also watches what each fight costs. If fights cost almost nothing for a while, the difficulty goes up a step ("master player detected"). If they cost a lot (heroes falling, several potions a fight), it goes down a step. Turn it off here to stop all of it.','#e8d8a0')}
    return}
  return _b.apply(this,arguments)}}
