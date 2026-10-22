/* ==========================================================================
   FOOD AS HEALTH (prefix fdhp / FDHP). Every food item heals a percentage of the hero's MAX health at the moment of eating, as well as feeding hunger.
   Plain bread or cheese about 4-6 percent, cooked meals and stews 9-15, the best feasts 20-25. Potions stay stronger per item. The old fixed 'heal' number
   stays on each item (shrine meals, sorting) but eating uses 'hpct'. Afflictions on eating and starvation are unchanged.
   ========================================================================== */
const FDHP_PCT={water:3,dates:4,apple:4,ale:4,nuts:4,bread:6,cheese:5,herring:9,sausage:10,pottage:12,pie:20,roast:25};
function fdhpPct(id,d){if(FDHP_PCT[id])return FDHP_PCT[id];return Math.max(3,Math.min(25,Math.round((d.heal||8)/2.2)))}
function fdhpSetup(){
  for(const id in ITEMDEF){const d=ITEMDEF[id];if(!d||d.k!=='food'||d.fdhp)continue;
    d.fdhp=1;d.hpct=fdhpPct(id,d);
    const tail=' Restores '+d.hpct+' percent of maximum health.';
    if(d.d&&/restores \d+ health\./.test(d.d))d.d=d.d.replace(/restores \d+ health\./,'restores '+d.hpct+' percent of maximum health.');
    else d.d=(d.t||'Food')+'. Fills '+(d.feed||0)+' hunger.'+tail+(d.d?' '+d.d:'')}
}
fdhpSetup();
{const _f=statLines;statLines=function(d){const L=_f.apply(this,arguments);
  try{if(d&&d.k==='food'&&d.hpct){for(const l of L)if(/^Heals \d+ health$/.test(l[0]))l[0]='Heals '+d.hpct+' percent of max health'}}catch(e){}
  return L}}
{const _h=useHeal;useHeal=function(hi,idx){
  try{const it=G.bag[idx],d=it&&idef(it);
    if(d&&d.k==='food'&&d.hpct){
      const h=G.heroes[hi];
      if(h.hp>=h.max&&h.food>=99){msg(`${HERO_DEF[hi].name} is not hungry or hurt.`);return false}
      const heal=Math.max(1,Math.round(h.max*d.hpct/100)),gain=Math.min(heal,h.max-h.hp),ik=it.id;
      bagTake(idx);h.hp=Math.min(h.max,h.hp+heal);sfx('potion');try{afflEat(hi,ik)}catch(e){}
      if(d.feed)h.food=Math.min(100,h.food+d.feed);
      msg(`${HERO_DEF[hi].name} eats the ${d.n} (+${gain} health${gain<heal?' of '+heal:''}${d.feed?', +'+d.feed+' hunger':''}).`,'#9ae0a0');addFloat(portraitX(hi)+19,250,'+'+gain,'#7fe08a');
      return true}}catch(e){console.error('fdhp',e)}
  return _h.apply(this,arguments)}}
