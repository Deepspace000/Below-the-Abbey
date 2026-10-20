/* ==========================================================================
   DIVING WITH SOME HELMS. A dive needs at least one hero in a Diving Helm or a Bubble Helm. A hero without one can still go down, but drowns:
   from the moment the party is under water that hero loses health every two seconds (about 4 percent of the maximum), which is not paused
   by anything except the stream of bubbles at a vent, and the hero is lost when the health runs out. The party's four minutes of air for the
   helmed heroes work as before. (uwSuited, in underwater.js, now means "somebody wears a helm": it is the gate on every dive line and pool.)
   ========================================================================== */
const uwHelmed=h=>!!(h&&h.eq&&h.eq.head&&idef(h.eq.head).dive);
function uwBare(){if(G.flags.gill)return [];const o=[];G.heroes.forEach((h,i)=>{if(h.alive&&!uwHelmed(h))o.push(i)});return o}
function uwBareNames(){return uwBare().map(i=>HERO_DEF[i].name).join(', ')}
ITEMDEF.bubblehelm.price=800;
ITEMDEF.bubblehelm.d='One great glass bubble with a brass collar that fits over the head. Worn in the helmet slot it lets a hero breathe underwater for four minutes. Air comes back from bubble vents. A hero without a helm who goes under the water starts to drown.';
ITEMDEF.divehelm.d=(ITEMDEF.divehelm.d||'').replace(/ ?A hero without a helm.*$/,'')+' A hero without a helm who goes under the water starts to drown.';
(function(){const _t=uwTick;uwTick=function(dt){
  _t(dt);
  if(!uwLv(LEVEL)||G.state!=='play'||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||!G.uw)return;
  const bare=uwBare();if(!bare.length){G.uw.bareT=0;return}
  if(G.uw.vent){G.uw.bareT=0;return}                       // the bubbles from a vent keep everyone alive
  G.uw.bareT=(G.uw.bareT||0)+dt;
  if(G.uw.bareT<2)return;G.uw.bareT=0;
  let hurt=false;
  for(const i of bare){const h=G.heroes[i];if(!h.alive)continue;
    const d=Math.max(2,Math.round(h.max*.04));h.hp-=d;h.hurt=1;hurt=true;
    try{addFloat(portraitX(i)+19,250,'-'+d,'#6ac8ff')}catch(e){}
    if(h.hp<=0){h.hp=0;h.alive=false;msg(HERO_DEF[i].name+' has drowned!','#ff8a7a');try{bondFall(i)}catch(e){}if(G.sel===i)nextHero()}
    else if(!(G.uw.bareWarn=G.uw.bareWarn||{})[i]||h.hp<h.max*.3&&!G.uw.bareWarn['l'+i]){const low=h.hp<h.max*.3;G.uw.bareWarn[low?'l'+i:i]=1;msg(HERO_DEF[i].name+(low?' is nearly drowned!':' is drowning without a helm.'),'#ff9070')}}
  if(hurt){sfx('hurt');G.shake=.2}
  if(!livingHeroes().length){later(700,()=>{G.state='dead';sfx('lose')})}
}})();
(function(){const _e=uwEnterHook;uwEnterHook=function(n){_e(n);try{if(uwLv(n)&&G.uw){const b=uwBareNames();if(b)msg('Without a helm, '+b+' will start to drown. Air bubbles from a vent keep everyone breathing.','#ff9070')}}catch(e){}}})();
