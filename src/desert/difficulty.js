/* ==========================================================================
   GAMEPLAY: AUTOSCALING AND THE LADDER OF LEVELS.
   By default the world is fixed: every place has its own level, a ladder that rises by about three levels for each place the story leads to, creatures stand at that level (with the usual
   mix of some lower), the great creatures stand a few levels above it, and the world map shows each place's level.
   In Menu > Gameplay autoscaling can be turned on (G.flags.autoScaleOn): then the world scales to the party (see rebalanceEnemies), and the places keep their old difficulty.
   ========================================================================== */
const LEVEL_LADDER=[ // [levels of the game that make up a place, its level]
  [[1],1],[[2,23],3],[[3,4,5,6,9,12,29],3],[[7,25],5],[[8],7],[[10,24],9],[[11],11],
  [[13,14,15,16,17,30],13],[[18],15],[[21],17],[[20],19],[[19,26,28],21],[[22,27],23],
  [[32],25],[[33,34,35,36,37,38],25],
  [[41],27],[[50,51,52,53,54,55,56,57,58,59],28],[[42],29],[[43],29],[[64],31],[[60],31],[[63],33],[[61],35],[[62],37],
  [[44,199,261],39],[[260],41],[[266],43],[[289],45],[[290,291,292,293,294,295,296,297,298,299],45],
  [[300],47],[[320],48],[[301],49],[[321],50],[[302],51],[[322],52],[[303],53],[[323],54],[[330],55],
  [[331,332,333,335],56],[[334,336,337,339],57],[[338,340,341],58],[[342],59],[[343],60],
  [[304],61],[[305,307,308,309,310],62],[[306],63]
];
const LEVEL_RATING={};
for(const [ls,r] of LEVEL_LADDER)for(const l of ls)LEVEL_RATING[l]=Math.round(1+(r-1)*1.5)+3;   // each place stands three levels above the one before it (the table is in steps of two), and the whole ladder three levels higher
LEVEL_RATING[20]-=2; // the Burial Ground stands two levels lower than the ladder gave it
for(const [ls,r] of LEVEL_LADDER){if(r===21){for(const l of ls)LEVEL_RATING[l]=30}else if(r>21){for(const l of ls)LEVEL_RATING[l]-=3}} // Ironhill Moor is level 30, and every place after it three levels lower
// the ladder goes on after Oldhaven: the four floors below the Abbey, the Hollow Land, then each floor of the Orange Spire and the foot of the Violet Tower, each three levels above the one before
{const top=Math.max(...Object.values(LEVEL_RATING));
 for(let i=0;i<4;i++)LEVEL_RATING[360+i]=top+3+3*i;
 LEVEL_RATING[364]=top+15;
 for(let k=0;k<20;k++)LEVEL_RATING[440+k]=top+18+3*k;
 LEVEL_RATING[460]=top+18+60}
/* the levels of the later places, set by hand: Greendale and Anaea have no enemies, so the road after the moor climbs slowly */
{const set=(ls,v)=>{for(const l of ls)LEVEL_RATING[l]=v};
 set([41,50,51,52,53,54,55,56,57,58,59],36);   // the Sand Road
 set([42],39);set([43],41);                     // the Tomb of Sut, the Red Dunes
 set([260],43);set([44,199,261],44);set([266],45);for(let n=199;n<=274;n++)if(n!==260&&n!==266&&n!==261)LEVEL_RATING[n]=44; // Khemetra
 set([60,61,62,63,64],45);                      // the other deserts
 set([289,290,291,292,293,294,295,296,297,298,299],48); // Yarrim
 set([300,301,302,303],49);set([320,321,322,323,330,331,332,333,334,335,336,337,338,339,340,341,342,343],50); // the islands and the sea
 set([304,305,306,307,308,309,310,311],55);     // Oldhaven and the Oakwood
 set([360],56);set([361],57);set([362],58);set([363],58);   // the Abbey, revisited
 LEVEL_RATING[364]=58;for(let k=0;k<20;k++)LEVEL_RATING[440+k]=Math.round(58+7*k/19);LEVEL_RATING[460]=65; // the Hollow Land and the Orange Spire, 58 to 65
}
/* humanoid creatures always carry gold when they fall */
for(const k of ['bandit','archer','hunter','hitman','guard','nomad','nomad2','assassin','rguard','ashguard','pservant','hlgoblin','hlorc','hljester','hlmadman','hlvictim','hlduke','hlbutcher','hlheadless','skel','dskeleton','hlwarlord','hlwight','hlvampire','w_candleknight','mummy'])if(ENEMY_DEF[k])ENEMY_DEF[k].humanoid=true;
const autoscaleOn=()=>!!G.flags.autoScaleOn;
// the level of a place on the world map: the lowest and highest of its levels that have one
function locRating(loc){if(loc.lv.length===1&&loc.lv[0]===1)return '1-3';   // the crypts climb from 1 to 3
  let lo=1e9,hi=-1;for(const v of loc.lv){const r=LEVEL_RATING[v];if(r!==undefined){lo=Math.min(lo,r);hi=Math.max(hi,r)}}return hi<0?null:(lo===hi?String(lo):lo+'-'+hi)}
/* ==========================================================================
   DIFFICULTY SELECTOR (Menu > Gameplay): a relative setting, G.flags.diffStep, in steps of 10 percent either way. Harder means enemies hit harder (full), take a little more
   to kill (40 percent of the change, so fights do not drag), hit the party more often (15 points per 100 percent) and are hit less often (10 points per 100 percent); easier is the
   same the other way. Gold and xp from fights move by the full change. Bosses and the great creatures follow it too.
   ========================================================================== */
const DIFF_MIN=-8,DIFF_MAX=20; // -80 percent to +200 percent
const diffD=()=>Math.max(DIFF_MIN,Math.min(DIFF_MAX,(G.flags&&G.flags.diffStep)|0))/10;
const diffDmg=()=>Math.max(.2,1+diffD()),diffHp=()=>Math.max(.5,1+diffD()*.4),diffRew=()=>Math.max(.2,1+diffD());
const diffHitAdd=()=>diffD()*.15,diffHeroHitSub=()=>diffD()*.10;
function diffLabel(){const st=(G.flags.diffStep|0);return st===0?'Normal':(st>0?'Harder by ':'Easier by ')+Math.abs(st)*10+'%'}
{const _es=enemyStat;enemyStat=function(){const r=_es.apply(this,arguments),dm=diffDmg(),hm=diffHp(),rm=diffRew();if(dm===1&&hm===1&&rm===1)return r;
  return Object.assign({},r,{hp:Math.max(1,Math.round(r.hp*hm)),dmg:[Math.max(1,Math.round(r.dmg[0]*dm)),Math.max(1,Math.round(r.dmg[1]*dm))],xp:Math.max(1,Math.round(r.xp*rm))})}}
{const _hp=heroHitPct;heroHitPct=function(){const d=diffHeroHitSub();const r=_hp.apply(this,arguments);return d===0?r:Math.max(.1,Math.min(.97,r-d))}}
function diffApply(){for(const e of (G.enemies||[])){if(!(e.hp>0))continue;const fr=e.hp/(e.maxhp||e.hp),mh=enemyStat(e.t,e.lvl).hp;e.maxhp=mh;e.hp=Math.max(1,Math.ceil(mh*fr))}}
/* what the setting means in play: the numbers for a real creature of this place against the party's lead hero, now and at Normal */
function diffExample(){try{
  const live=G.heroes.map((h,i)=>({h,i})).filter(o=>o.h.alive);if(!live.length)return null;const me=live[0];
  let e=(G.enemies||[]).filter(q=>q.hp>0&&ENEMY_DEF[q.t]&&ENEMY_DEF[q.t].hit!==undefined&&!ENEMY_DEF[q.t].fly).sort((a,b)=>Math.hypot(a.x-G.P.x,a.y-G.P.y)-Math.hypot(b.x-G.P.x,b.y-G.P.y))[0];
  const t=e?e.t:'wolf',lv=e?e.lvl:Math.max(1,Math.round(me.h.lvl)),def=ENEMY_DEF[t];if(!def||def.hit===undefined)return null;
  const calc=()=>{const st=enemyStat(t,lv),r=heroDmgRange(me.h),avg=Math.max(1,(r[0]+r[1])/2),hits=Math.max(1,Math.ceil(st.hp/avg)),
    eh=Math.max(.1,Math.min(.95,def.hit+diffHitAdd()-heroArmor(me.h)*.03-pas(me.i,'dodge'))),mh=heroHitPct(me.i,!!def.fly);
    // the gold an average kill pays (the same sum as hurtEnemy, with the middle of the roll)
    const LH=livingHeroes(),pl0=LH.length?Math.round(LH.reduce((n,j)=>n+G.heroes[j].lvl,0)/LH.length):1,up=Math.max(0,lv-pl0),lm=up>0?1.5+.2*(up-1):1,
      big=(def.goldFixed||0)>=100||(def.gold&&def.gold[1]>=100),bg=BOSS_GOLD[t],ls=bg?1+Math.min(lv,100)*.02:big?1+Math.min(lv,100)*.04:1+Math.min(lv,100)*.1,
      pct=(1+Math.max(0,...LH.map(j=>pas(j,'goldPct'))))*lm*ls*diffRew(),sea=/^uw/.test(t)&&!/^(uwgiant|uweelboss|uwmega|uwgulper)$/.test(t)||t==='seaserpent',
      base=bg?(bg[0]+bg[1])/2:sea?125:big?300:(def.goldFixed||(def.gold&&def.gold[1]>0&&(def.humanoid||true)))?(def.goldFixed||30):0;
    return {dmg:Math.round((st.dmg[0]+st.dmg[1])/2),hits,eh:Math.round(eh*100),mh:Math.round(mh*100),xp:killXP(st.xp,lv),gold:Math.round(base*pct)}};
  const now=calc(),keep=G.flags.diffStep;G.flags.diffStep=0;const was=calc();G.flags.diffStep=keep;
  return {name:def.name,lv,now,was,hero:HERO_DEF[me.i].name}}catch(err){return null}}
function diffChange(n){const was=G.flags.diffStep|0;G.flags.diffStep=Math.max(DIFF_MIN,Math.min(DIFF_MAX,was+n));if((G.flags.diffStep|0)!==was){diffApply();msg('Difficulty: '+diffLabel()+'.','#e8d8a0')}}
function drawGameplay(){
  BTNS=[];veil(.6);bigPanel(70,10,340,300);
  txt('GAMEPLAY',240,28,14,'#d8c88e','center',true);
  const on=autoscaleOn();
  btnText('gp_scale','Autoscaling:  '+(on?'ON':'OFF'),120,42,240,26);
  btnText('gp_fog','Fog of war:  '+(G.flags.noFog?'OFF':'ON'),120,72,118,22);btnText('gp_lookx','Look drag: '+(G.flags.lookXNormal?'NORMAL':'INVERT'),242,72,118,22);
  {const st=G.flags.diffStep|0;btnText('gp_dm','-',120,98,44,24);btnText('gp_dp','+',316,98,44,24);txt('Difficulty:  '+diffLabel(),240,114,10,st===0?'#d8c88e':st>0?'#f0a080':'#a8d8a0','center',true);
   {const X=diffExample(),mk=(n,w,u)=>{u=u||'';return n===w?n+u:n+u+' (was '+w+u+')'};
    if(X){txt('Example: a '+X.name+' (level '+X.lv+') against '+X.hero+':',240,128,7.6,'#d8c88e','center');
      txt('It hits for about '+mk(X.now.dmg,X.was.dmg)+' and lands '+mk(X.now.eh,X.was.eh,'%')+' of its blows.',240,139,7.6,'#cdbf94','center');
      txt('It takes about '+mk(X.now.hits,X.was.hits)+' hits to kill, and you land '+mk(X.now.mh,X.was.mh,'%')+' of yours.',240,150,7.6,'#cdbf94','center');
      txt('A kill pays '+mk(X.now.xp,X.was.xp)+' xp'+(X.now.gold||X.was.gold?' and about '+mk(X.now.gold,X.was.gold)+' gold.':'.'),240,161,7.6,'#cdbf94','center')}
    else txt('Enemy damage '+(st>0?'+':'-')+Math.round(Math.abs(diffDmg()-1)*100)+'%, health '+(st>0?'+':'-')+Math.round(Math.abs(diffHp()-1)*100)+'%. Gold and xp '+(st>0?'+':'-')+Math.round(Math.abs(diffRew()-1)*100)+'%.',240,128,7.6,'#cdbf94','center')}}
  const lines=on?[
    'Creatures scale to the party. A party that has outgrown a place meets its creatures raised to within a few levels of itself, and the great creatures always stand above the party.',
    'Turn autoscaling off for a fixed world: every place has its own level, rising as the story goes on, and each level is shown on the world map. You will meet creatures that are too strong for you, and too weak.'
  ]:[
    'The world is fixed. Every place has its own level, rising by about three for each place the story leads to, and the level of each place is shown on the world map.',
    'Creatures stand at the level of the place (some a little lower, as ever), and the great creatures a few levels above it. If a place is too hard for the party, go elsewhere and come back stronger.'
  ];
  let y=176;for(const p of lines){for(const l of wrapText(p,300,8.4)){txt(l,240,y,8.4,'#cdbf94','center');y+=11}y+=8}
  const r=LEVEL_RATING[LEVEL];
  txt(on?'Autoscaling is on.':(r?'This place is level '+r+'.':'This place has no fixed level.'),240,y+6,9,'#e8c878','center',true);
  btnText('gp_back','Back',190,278,100,24);
}
(function(){const _b=handleBtn;handleBtn=function(id){
  if(G.menu==='gameplay'&&(id==='gp_dm'||id==='gp_dp')){diffChange(id==='gp_dp'?1:-1);return}
  if(G.menu==='gameplay'&&id==='gp_lookx'){G.flags.lookXNormal=G.flags.lookXNormal?0:1;msg(G.flags.lookXNormal?'Dragging with the right mouse button now swings the view the way you drag.':'Dragging with the right mouse button now swings the view the opposite way.','#e8d8a0');return}
  if(G.menu==='gameplay'){if(id==='gp_back'||id==='menu')G.menu=true;else if(id==='gp_fog'){G.flags.noFog=G.flags.noFog?0:1;msg(G.flags.noFog?'Fog of war is off. Maps show everything.':'Fog of war is on. Maps are covered by clouds where you have not been.','#e8d8a0')}else if(id==='gp_scale'){G.flags.autoScaleOn=G.flags.autoScaleOn?0:1;try{rebalanceEnemies()}catch(e){}msg(G.flags.autoScaleOn?'Autoscaling is on.':'Autoscaling is off. The world is fixed.','#e8d8a0')}return}
  _b(id)}})();
