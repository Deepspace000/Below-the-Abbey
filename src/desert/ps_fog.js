/* ps_fog.js: the cloud cover (fog of war) on the maps. The engine only clouds outdoor levels; the castle's rooms are indoor levels, so their maps showed everything at once.
   The owner's rule: most rooms are clouded until explored, only peaceful towns are clear. Every Pale Spire level (indoor or outdoor) and every Never-Ending Tower floor now has it,
   unless the player has switched Fog of war off in the gameplay menu. */
{const _f=mplFogOn;mplFogOn=function(L){
  try{if(L&&L.rows&&!(G.flags&&G.flags.noFog)&&((typeof pspIs==='function'&&pspIs(LEVEL))||(typeof ntIs==='function'&&ntIs(LEVEL))))return true}catch(e){}
  return _f.apply(this,arguments)}}
