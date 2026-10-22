/* ==========================================================================
   BURIED TREASURE IN EVERY MAP. About one square in a hundred of the walkable ground of every map hides a buried strongbox (fixed by the level and the square, so it is the same
   every game and every visit). A shovel and the Dig button turn it up: gold, often a gem, sometimes a potion, all of it better the higher the level of the place.
   A Ranger, Thief or Assassin in the party senses one within a few squares and says so. (prefix bur; wraps doDig)
   ========================================================================== */
const buriedAt=(n,x,y)=>{const L=LEVELS[n];return !!(L&&L.rows&&L.rows[y]&&L.rows[y][x]==='.'&&!L.khRoom&&hash2(x*7+n*3,y*13+n,313)<.01)};
{const _dd=doDig;doDig=function(){
  try{if(canDigHere()&&buriedAt(LEVEL,G.P.x,G.P.y)){const F=G.flags;F.dug=F.dug||{};
    if(F.dug[dugKey()]){msg('This ground has been turned over already.','#c8b898');return}
    F.dug[dugKey()]=1;{const T=collData('treasure');T._digs=(T._digs||0)+1}sfx('step');advanceTime(5);
    const R=Math.max(1,(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[LEVEL])||(LEVELS[LEVEL]&&LEVELS[LEVEL].diff)||partyLevel()),g=Math.round((30+R*9)*(.8+Math.random()*.5));
    G.gold+=g;{const T=collData('treasure');T._gold=(T._gold||0)+g;const o=T.coins||(T.coins={f:0,s:0,g:0});o.f++}
    const give=id=>{if(!bagAdd(mkItem(id))){G.items.push({k:id,x:G.P.x,y:G.P.y,taken:false});msg('Your bag is full: it lies on the ground.','#d09a80')}try{collFound(id)}catch(e){}};
    let text='The shovel rings on wood. You dig up a buried strongbox: '+g+' gold';
    if(Math.random()<.55){const gem=GEM_BY_VALUE[Math.min(39,Math.floor(Math.pow(Math.random(),1.3)*Math.min(40,10+R)))];give('gem_'+gem[0]);text+=', and a '+gem[1].toLowerCase()}
    if(Math.random()<.35){try{give(potionFor(Math.random()))}catch(e){}text+=', and a potion'}
    msg(text+'.','#ffe36a');sfx('level');return}}catch(e){console.warn('buried',e)}
  return _dd.apply(this,arguments)}}
// the sense of a ranger, a thief or an assassin
{const _u=update;let nextT=0,quiet=0;update=function(dt){
  try{if(G.state==='play'&&G.P&&G.flags&&G.time>=nextT&&!G.cut&&!G.talk&&!G.menu){nextT=G.time+.6;const L=LEVELS[LEVEL];
    if(L&&L.rows&&!L.khRoom&&bestShovel()!==null&&G.time>=quiet){const F=G.flags;F.dug=F.dug||{};F.burSensed=F.burSensed||{};
      let hit=null;for(let dy=-5;dy<=5&&!hit;dy++)for(let dx=-5;dx<=5;dx++){if(dx*dx+dy*dy>26)continue;const x=G.P.x+dx,y=G.P.y+dy,k=LEVEL+':'+x+':'+y;if(buriedAt(LEVEL,x,y)&&!F.dug[k]&&!F.burSensed[k]){hit=k;break}}
      if(hit){const hi=G.heroes.findIndex((h,i)=>h.alive&&h.hp>0&&['Ranger','Thief','Assassin'].includes(HERO_DEF[i].cls));
        if(hi>=0){F.burSensed[hit]=1;quiet=G.time+25;msg(HERO_DEF[hi].name+': "There is treasure buried around here somewhere."','#ffe08a')}}}}}catch(e){}
  return _u.apply(this,arguments)}}
