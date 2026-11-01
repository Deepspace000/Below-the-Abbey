/* ps_fog.js: the cloud cover (fog of war) on the maps. The engine only clouds outdoor levels; the castle's rooms are indoor levels, so their maps showed everything at once.
   The owner's rule: most rooms are clouded until explored, only peaceful towns are clear. Every Pale Spire level (indoor or outdoor) and every Never-Ending Tower floor now has it,
   unless the player has switched Fog of war off in the gameplay menu.
   The same rule now covers every maze and every dungeon of moderate size or more (DFOG_LEVELS: about 250 open squares and up, and every maze whatever its size). */
const DFOG_LEVELS=new Set([1,8,11,18,21,31,39,40,42,65,104,107,114,117,124,127,134,137,144,147,260,289,363,445,446,447,448,449,450,451,452,453,459,471,472,473,474,475,476,477,497,498,499,500,501,502,531,532,533,534,535,542,4940,5080,5240,7098,9671,9672,9673,9674,9675,9676,9677]);
{const _f=mplFogOn;mplFogOn=function(L){
  try{if(L&&L.rows&&!(G.flags&&G.flags.noFog)&&((typeof pspIs==='function'&&pspIs(LEVEL))||(typeof ntIs==='function'&&ntIs(LEVEL))||(DFOG_LEVELS.has(LEVEL)&&L===LEVELS[LEVEL])))return true}catch(e){}
  return _f.apply(this,arguments)}}
