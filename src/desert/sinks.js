/* ==========================================================================
   GOLD SINKS FOR THE END GAME (v3.871). The Last Smith (Ysolde Vane, Watch Nook, Pale Spire) will temper equipped gear, one step at a time, up to +10.
   Each step adds 3 percent to a weapon's damage and spell power, or to a piece of armour's armour (at least 1 point), and costs 1.4 times the step before:
   the first step is (2,000 + 35 percent of the item's price) gold. A top weapon costs about 1 million for all ten steps, so equipping four heroes completely takes several million: more than a full clear pays.
   An item remembers its steps in it.tp; idef() (core) returns TP_DEF(it) for it. A tempered item that goes back into the bag may merge with a plain copy and lose its steps, so temper what you wear.
   ========================================================================== */
const TP_MAX=10,TP_CACHE={};
function TP_DEF(it){const k=it.id+'|'+it.tp;let d=TP_CACHE[k];if(d)return d;const b=ITEMDEF[it.id];if(!b)return b;d=Object.assign({},b);d.n=b.n+' +'+it.tp;
  const f=1+.03*it.tp;
  if(b.k==='weapon'){d.dmg=[Math.round(b.dmg[0]*f),Math.round(b.dmg[1]*f)];if(b.magic)d.magic=Math.round(b.magic*f)}
  else if(b.armor)d.armor=b.armor+Math.max(it.tp,Math.round(b.armor*.03*it.tp));
  return TP_CACHE[k]=d}
const tpCost=it=>{const b=ITEMDEF[it.id];return Math.round((2000+(b.price||0)*.35)*Math.pow(1.4,it.tp||0)/10)*10};
const TP_SLOTS=[['main','Weapon'],['head','Helm'],['chest','Chest'],['arms','Arms'],['legs','Legs'],['off','Shield or off hand']];
function tpStart(d){return say('"Bring me what you wear and I will make it better. Steel can be worked again and again, if you can pay for the fire. Each step adds three in a hundred, and each costs more than the last. Whose gear shall I look at?"',
  G.heroes.map((h,i)=>[HERO_DEF[i].name,()=>tpHero(d,i)]).concat([['Not now',()=>{G.talk=null;return null}]]))}
function tpHero(d,i){const h=G.heroes[i],opts=[];let txt=`${HERO_DEF[i].name}. You have ${G.gold} gold.\n`;
  for(const [k,lab] of TP_SLOTS){const it=h.eq[k],b=it&&ITEMDEF[it.id];if(!b||!(b.k==='weapon'||b.armor))continue;const t=it.tp||0;
    if(t>=TP_MAX){txt+=`${lab}: ${b.n} +${t} (finished)\n`;continue}
    const c=tpCost(it);txt+=`${lab}: ${b.n} +${t}, next step ${c} gold\n`;
    opts.push([`${b.n} +${t} to +${t+1} (${c})`,()=>{if(G.gold<c){msg('You cannot afford that.','#e88');return tpHero(d,i)}G.gold-=c;it.tp=t+1;sfx('key');msg(`${b.n} is now +${it.tp}.`,'#ffe9a0');try{recalcMax(i)}catch(e){}return tpHero(d,i)}])}
  opts.push(['Someone else',()=>tpStart(d)]);opts.push(['Done',()=>{G.talk=null;return null}]);
  return say(txt.trim(),opts)}
