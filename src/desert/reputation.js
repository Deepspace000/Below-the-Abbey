/* ==========================================================================
   REPUTATION AND HONOUR. Each town keeps its own opinion of the party, from -100 to +100. Honest quests raise it; warnings from the watch, the cells and
   the shady jobs of each town's fixer lower it. Prices follow it: a liked party pays up to 22% less and sells for more, a hated one pays more, and a
   despised one is refused. Honour is the party's name over all of them. Both live in G.flags, so they save with the game.
   ========================================================================== */
const TOWNS=[
  {id:'thornwick',n:'Thornwick',col:'#a8c878',blurb:'A timber town behind a log palisade, frightened and watchful.'},
  {id:'ironhill',n:'Ironhill',col:'#a8b8d0',blurb:'A walled mining town. Plain people and honest iron.'},
  {id:'anaea',n:'Anaea',col:'#e0a8d8',blurb:'A white town in a green valley, where everyone is a different colour.'},
  {id:'khemetra',n:'Khemetra',col:'#f0d070',blurb:'The Golden City, ten thousand houses and a watch that notices.'}
];
function repTownOf(n){
  if([3,4,5,6,9,29].includes(n))return 'thornwick';
  if([13,14,15,16,17,21,30,271,272,273,274].includes(n))return 'ironhill';
  if(n>=32&&n<=39)return 'anaea';
  if(n===44||(n>=199&&n<=270)||(n>=1000&&n<30000))return 'khemetra';
  return null;
}
function repTownOfArea(a){
  if(/thornwick|road to ironhill/i.test(a||''))return 'thornwick';
  if(/ironhill|greyfang/i.test(a||''))return 'ironhill';
  if(/greendale|anaea/i.test(a||''))return 'anaea';
  if(/khemetra/i.test(a||''))return 'khemetra';
  return null;
}
const REP_TIERS=[[-100,'Despised'],[-80,'Hated'],[-50,'Distrusted'],[-20,'Unknown'],[20,'Liked'],[50,'Respected'],[80,'Honoured']];
const REP_COL={Despised:'#e04a3a',Hated:'#e0703a',Distrusted:'#d0a050',Unknown:'#c8c0a8',Liked:'#a8d880',Respected:'#80d8a0',Honoured:'#ffe070'};
function repData(){const F=G.flags;return F.rep||(F.rep={thornwick:0,ironhill:0,anaea:0,khemetra:0})}
function repVal(t){return repData()[t]||0}
function repTier(v){let t=REP_TIERS[0][1];for(const [lo,n] of REP_TIERS)if(v>=lo)t=n;return t}
function repAdd(t,a,why){
  if(!t||!a)return;const R=repData(),old=R[t]||0;R[t]=clamp(old+a,-100,100);
  const T=TOWNS.find(x=>x.id===t),tn=repTier(old),tn2=repTier(R[t]);
  msg(`${T.n}'s opinion of the party ${a>0?'improves':'worsens'}${why?' ('+why+')':''}.`,a>0?'#a8e0a0':'#e0a080');
  if(tn!==tn2)msg(`The people of ${T.n} now think of the party as: ${tn2}.`,REP_COL[tn2]);
}
function honourVal(){return G.flags.honour||0}
function honourAdd(a,why){const F=G.flags;F.honour=clamp((F.honour||0)+a,-100,100);if(why)msg(`${a>0?'An honest act':'A shameful act'} (${why}).`,a>0?'#a8e0a0':'#e0a080')}
function honourTitle(v){return v>=60?'Paragon':v>=30?'Honest':v>-30?'Ordinary':v>-60?'Rogue':'Villain'}
/* how much a shopkeeper charges and pays here and now */
function priceMul(side){
  const t=repTownOf(LEVEL),F=G.flags;let m=1;
  if(t){const v=repVal(t);m*=side==='buy'?1-v*.0022:1+v*.0012}
  const h=honourVal();if(h<=-40)m*=side==='buy'?1.1:.92;else if(h>=40)m*=side==='buy'?.95:1.05;
  if(typeof skillMul==='function')m*=skillMul(side);
  if(typeof profMul==='function')m*=profMul(side);
  return m;
}
const buyPrice=id=>Math.max(1,Math.round(ITEMDEF[id].price*priceMul('buy')));
const sellPriceR=id=>Math.max(1,Math.floor(ITEMDEF[id].price*.4*priceMul('sell')));
function repRefuses(){const t=repTownOf(LEVEL);return !!t&&repVal(t)<=-80}
function repQuest(id){
  const q=QUESTS[id];if(!q||q.bad)return;
  const t=repTownOfArea(QAREA[id]);if(!t)return;
  const big=((q.reward&&q.reward.gold)||0)>=200;
  repAdd(t,big?7:4,'quest done');honourAdd(1);
}
/* ---------------------------------------------------------------- the fixers: shady jobs for gold ---------------------------------------------------------------- */
const REP_JOBS={
  thornwick:{fixer:'th_fixer',name:'Sly Dunstan',face:'drunk',level:3,shake:{npc:'aldous',who:'Aldous, the merchant',gold:120,loss:8},fence:{npc:'bram',who:'Bram, the innkeeper',gold:90,loss:6},pay:[180,260]},
  ironhill:{fixer:'ih_fixer',name:'One-Eyed Karl',face:'miner',level:13,shake:{npc:'dorn',who:'Dorn, the merchant',gold:160,loss:8},fence:{npc:'dorn',who:'Dorn, the merchant',gold:110,loss:6},pay:[220,320]},
  anaea:{fixer:'an_fixer',name:'Whisper Mirelle',face:'peasantW',level:33,shake:{npc:'juno',who:'Juno, the baker',gold:130,loss:8},fence:{npc:'odalys',who:'Odalys, the innkeeper',gold:100,loss:6},pay:[200,280]},
  khemetra:{fixer:'kh_fixer',name:'Khafre the Fixer',face:'kh_npc5_5',shake:{npc:'kh_baker',who:'the baker',gold:200,loss:8},fence:{npc:'kh_forge',who:'the smith',gold:160,loss:6},pay:[300,450]}
};
ITEMDEF.stolen={n:'Stolen Goods',k:'quest',t:'Quest item',ic:'parcel',c:'#a89060',stack:1,price:1,d:'A bundle of silver spoons, a candlestick and a purse that does not belong to you. Somebody will want to buy it, and ask no questions.',sw:.3};
function repWrap(npcId,pred,label,fn){
  const n=NPCS[npcId];if(!n||n._rw&&n._rw[label])return;
  (n._rw=n._rw||{})[label]=1;const base=n.root;
  n.root=function(d){const r=base(d);if(pred())r.opts.splice(Math.max(0,r.opts.length-1),0,[label,fn]);return r};
}
for(const t in REP_JOBS){
  const J=REP_JOBS[t],a=t+'_shake',b=t+'_fence';
  QUESTS[a]={title:'A Quiet Word',who:J.name,bad:1,desc:`${J.name} says ${J.shake.who} owes him money, and would rather pay than have an accident. Lean on him. Not nice, but it pays.`,need:1,goal:()=>G.flags['bq_'+a]?1:0,reward:{gold:J.pay[0],xp:60}};
  QUESTS[b]={title:'No Questions Asked',who:J.name,bad:1,desc:`${J.name} gives you a bundle of stolen goods. Sell it to ${J.fence.who}, who asks no questions, and bring back the word.`,need:1,goal:()=>G.flags['bq_'+b]?1:0,reward:{gold:J.pay[1],xp:80}};
  QAREA[a]=QAREA[b]=({thornwick:'Thornwick',ironhill:'Ironhill',anaea:'Elsewhere',khemetra:'Khemetra'})[t];
  const root=d=>{
    const F=G.flags;
    const next=qSt(a)!=='done'?a:qSt(b)!=='done'?b:null;
    if(!next)return say('You have been useful. Come back some other day. There is always somebody who owes somebody something.',[BYE]);
    if(qReady(next))return say('And?',[['It is done.',()=>{qTurnIn(next);F.honour=clamp((F.honour||0)-3,-100,100);repAdd(t,-4);msg('The fixer counts out your gold. Your name in town gets a little darker.','#d0a070');return say('Pleasure doing business. Do not look so glum. Nobody saw.',[BYE])}],BYE]);
    if(qSt(next))return say(next===a?`Lean on ${J.shake.who}. Say I sent you. He will know what you mean.`:`The goods must be sold to ${J.fence.who}. Ask him to look at what you have got.`,[BYE]);
    if(next===a)return say(`A word, friend. Honest folk do not talk to me, which makes the rest of us a closer sort. ${J.shake.who} owes me money. A quiet word, a hard look, and he pays. There is ${J.pay[0]} gold in it for you. It will not make you popular.`,[[`I will do it. (${J.pay[0]} gold, lowers your name)`,()=>{qAccept(a);return say('Good. Do it quietly.',[BYE])}],['Not my kind of work.',()=>say('Suit yourself. The offer will keep.',[BYE])]]);
    return say(`Another job, if you have the stomach. Some silver and candlesticks fell off a cart. Sell them to ${J.fence.who}, no questions. ${J.pay[1]} gold for you when it is done.`,[[`Hand it over. (${J.pay[1]} gold, lowers your name)`,()=>{qAccept(b);if(!bagAdd(mkItem('stolen')))msg('Your bag is full.','#d09a80');return say('Light fingers and a shut mouth. That is the whole trick.',[BYE])}],['No, thank you.',()=>say('Your loss.',[BYE])]]);
  };
  khNpc(J.fixer,J.name,J.face,root);
  repWrap(J.shake.npc,()=>qSt(a)==='active'&&!G.flags['bq_'+a],`Demand the money that ${J.name} says is owed`,()=>{
    const F=G.flags;F['bq_'+a]=1;G.gold+=J.shake.gold;repAdd(t,-J.shake.loss,'you threatened a shopkeeper');honourAdd(-3);sfx('key');
    return say(`He goes pale, and then he pays. ${J.shake.gold} gold, counted twice with shaking hands. You can feel him wishing you were a long way from his door.`,[BYE]);
  });
  repWrap(J.fence.npc,()=>qSt(b)==='active'&&!G.flags['bq_'+b]&&bagCount('stolen')>0,'Sell the stolen goods, no questions',()=>{
    const F=G.flags;F['bq_'+b]=1;bagRemove('stolen',1);G.gold+=J.fence.gold;repAdd(t,-J.fence.loss,'you fenced stolen goods');honourAdd(-3);sfx('key');
    return say(`He turns a spoon over, weighs the purse and says nothing at all. ${J.fence.gold} gold changes hands. He does not look at you again.`,[BYE]);
  });
}
/* the fixers stand in a quiet corner of each town */
(function(){
  for(const t of ['thornwick','ironhill','anaea']){
    const J=REP_JOBS[t],L=LEVELS[J.level];if(!L||!L.rows||L._fixer)continue;L._fixer=1;
    const sx=(L.start&&L.start.x)||5,sy=(L.start&&L.start.y)||5,taken=new Set((L.decor||[]).filter(d=>d.block||d.npc).map(d=>d.x+','+d.y));
    const spot=t==='ironhill'?[7,24]:[sx+3,sy];let best=null,bd=1e9;
    for(let y=1;y<L.rows.length-1;y++)for(let x=1;x<L.rows[0].length-1;x++){
      if(L.rows[y][x]!=='.'||taken.has(x+','+y))continue;const d=Math.abs(x-spot[0])+Math.abs(y-spot[1]);if(d<bd){bd=d;best=[x,y]}}
    if(best)L.decor.push({k:J.face,x:best[0],y:best[1],block:true,npc:J.fixer});
  }
})();
/* ---------------------------------------------------------------- the page ---------------------------------------------------------------- */
journalPage({id:'rep',title:'Reputation',
  summary:()=>TOWNS.map(t=>t.n+': '+repTier(repVal(t.id))).join(' | '),
  note:()=>0,
  draw(){
    jFrame('Reputation and honour');
    TOWNS.forEach((t,k)=>{
      const y=40+k*50,v=repVal(t.id),tier=repTier(v),mul=1-v*.0022;
      txt(t.n,40,y+8,11,t.col,'left',true);txt(tier,440,y+8,10,REP_COL[tier],'right',true);
      jBar(40,y+14,400,8,(v+100)/200,t.col);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(240,y+12,1,12);
      txt(`${v>0?'+':''}${v}`,40,y+31,8,'#c8bc98','left');
      txt(v<=-80?'The shopkeepers will not trade with you.':`Shops here charge ${Math.round(mul*100)}% of the usual price and pay ${Math.round((1+v*.0012)*100)}% for your goods.`,60,y+31,8,'#c8bc98','left',false,undefined,380);
      wrapText(t.blurb,380,7.4).slice(0,1).forEach(l=>txt(l,60,y+41,7.4,'#988a70','left'));
    });
    const h=honourVal(),y=248;
    txt('Honour',40,y+6,11,'#e8d8a0','left',true);txt(honourTitle(h),440,y+6,10,h>=30?'#a8d880':h<=-30?'#e08060':'#c8c0a8','right',true);
    jBar(40,y+12,400,7,(h+100)/200,h>=0?'#a8d880':'#d07050');ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(240,y+10,1,11);
    txt('Honest quests and mercy raise it. Theft, threats, bribes and shady jobs lower it. Over 40, prices fall a little; under -40, they rise.',40,y+30,7.4,'#a89878','left',false,undefined,400);
  }
});
