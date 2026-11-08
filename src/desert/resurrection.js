/* ==========================================================================
   RESURRECTION POTIONS (v3.873). The Resurrection Potion raises one fallen hero at half health. Select it in the bag and use it on the fallen hero (the dead can drink nothing else).
   It costs 1,000 gold, and it is sold in every potion shop from Oldhaven onwards (areas of level 55 and up), to a party with a hero of level 50 or more.
   Only 10 can be bought in every 14 days, counted for all the shops together: bought potions come off the same stock, and the stock is made up to 10 again 14 days after it started.
   Pictures: assets/icn_resurrection.png.
   ========================================================================== */
ITEMDEF.resurrection={n:'Resurrection Potion',k:'potion',t:'Potion',ic:'potion',c:'#fff0b0',stack:1,price:1000,revive:.5,sw:.26,rar:0,
  d:'Raises one fallen hero at half health. Select it in the bag and use it on the fallen hero.'};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('resurrection');
const RES_CAP=10,RES_DAYS=14;
function resPool(){const F=G.flags,P=F.resP||(F.resP={n:RES_CAP,t:G.clock});if(G.clock-P.t>=RES_DAYS*1440){P.n=RES_CAP;P.t=G.clock}return P}
function resDaysLeft(){const P=resPool();return Math.max(1,Math.ceil((P.t+RES_DAYS*1440-G.clock)/1440))}
function reviveSel(id){
  if(id==='iuse'){const s=typeof I!=='undefined'&&I.sel;return !!(s&&s.src==='bag'&&G.bag[s.i]&&ITEMDEF[G.bag[s.i].id]&&ITEMDEF[G.bag[s.i].id].revive)}
  if(/^ipotb/.test(id)){const pid=(G.potBack||[])[+id.slice(5)];return !!(pid&&ITEMDEF[pid]&&ITEMDEF[pid].revive)}
  return false}
function reviveDrink(hi,idx){
  const h=G.heroes[hi],it=G.bag[idx],D=idef(it);
  if(h.alive){msg(`${HERO_DEF[hi].name} is not fallen. Use it on a hero who has fallen.`,'#d09a80');return false}
  bagTake(idx);h.alive=true;h.hp=Math.max(1,Math.ceil(h.max*D.revive));sfx('level');
  msg(`${HERO_DEF[hi].name} drinks the ${D.n} and rises!`,'#ffe9a0');try{addFloat(portraitX(hi)+19,250,'RISES','#ffe9a0')}catch(e){}return true}
/* the shops */
const resShop=d=>{try{return typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[LEVEL]>=55&&partyLevel()>=50&&d&&d.contents&&d.contents.some(x=>['healdraught','greaterheal','superiorheal','elixir','manadraught','potion2','potion3','potion4','potion5','potion6','potion7'].includes(x.id))}catch(e){return false}};
function resSync(d){if(!d||!d.contents)return;const i=d.contents.findIndex(x=>x.id==='resurrection');
  if(!resShop(d)){if(i>=0)d.contents.splice(i,1);return}
  const P=resPool();if(P.n<=0){if(i>=0)d.contents.splice(i,1)}else if(i>=0)d.contents[i].n=P.n;else d.contents.push({id:'resurrection',n:P.n})}
{const _os=openShop;openShop=function(d,stock,name){
  const r=_os.apply(this,arguments);
  try{resSync(d);if(resShop(d)){const P=resPool();msg(P.n>0?`Resurrection Potions in stock: ${P.n} (10 every 14 days, for all the shops together).`:`No Resurrection Potions left. More in ${resDaysLeft()} days.`,'#d8d4a0')}}catch(e){console.error('resSync',e)}
  return r}}
{const _hb=typeof hgBoughtItem==='function'?hgBoughtItem:null;hgBoughtItem=function(id){
  if(id==='resurrection'){const P=resPool();P.n=Math.max(0,P.n-1);try{const d=G.loot&&G.loot.decor;if(d&&d.contents&&P.n<=0){const i=d.contents.findIndex(x=>x.id==='resurrection');if(i>=0)d.contents.splice(i,1)}}catch(e){}}
  return _hb?_hb.apply(this,arguments):undefined}}
