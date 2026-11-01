/* Safeguard: a person never stands in the road. Level setup already makes every NPC walk-through; this catches
   people added later (events, scripts, arrival scenes) by clearing block on any non-solid, non-gate person each time
   the blocking map is rebuilt. Gates, fences, levers and pieces marked solid keep blocking. */
(function(){
  if(typeof buildDecorMap!=='function'||buildDecorMap.__unblock)return;
  const orig=buildDecorMap;
  const fixed=function(){
    try{for(const d of G.decor){if(d.npc&&d.block&&!d.found&&!d.solid&&!/^(lockedgate|gate|fence|lever|hatch)/.test(d.k)){d.block=false;d.walk=true}}}catch(e){}
    return orig.apply(this,arguments);
  };
  fixed.__unblock=1;
  buildDecorMap=fixed;
})();
