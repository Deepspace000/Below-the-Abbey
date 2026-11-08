/* ==========================================================================
   BATTLE AND SURVIVAL HINTS FOR A NEW PLAYER (v3.882). Little boxes in the play screen, spread over the first battles, and a few that appear the first time something happens:
     battle 1: hold the space bar or action button for repeated attacks; power moves hit harder but cost mana or stamina.
     battle 2: if monsters are too hard, come back later.     battle 3: potions can be put in shortcut slots.
     the first door opened: some doors need keys and odd walls may hide secrets.   the first weapon picked up: equip it from the inventory.
     the first food picked up: food stops starving.   the first rest: resting heals if you have food.   the first meal eaten: buy or find food and potions.
   The boxes glow and shine (a moving highlight, a breathing gold glow) and have a line along the bottom that runs out, so they look temporary.
   Each box goes away by itself after 12 seconds or when clicked, and a 'Hints' button on the Gameplay page (kept on this computer: abbeyHintsOff) stops every hint, and each box column ends with a line saying so.
   What has been shown is kept in the game's flags (G.flags.tut), so a hint is not shown twice in a game.
   ========================================================================== */
const TUT_TEXT={
  b1a:'Hold the space bar or the action button down to do repeated attacks!',
  b1b:'Your power moves will do more damage, but will cost mana or stamina.',
  b2:'If monsters are too hard, you can always come back later.',
  b3:'Potions can be put in shortcut slots that make them easier to access during battle.',
  food:'Food will stop your character from starving.',
  rest:'Resting will heal your character if you have food.',
  eat:'Buy food and potions from shops in towns or find them out in the wild.',
  door:'Some doors will require keys and some walls that look unusual may hide secret passages or rooms.',
  gear:'Make sure to equip weapons and armour that you find by opening your inventory and choosing which character gets it.'};
const tutOff=()=>{try{return localStorage.getItem('abbeyHintsOff')==='1'}catch(e){return false}};
const tutF=()=>{const F=G.flags;return F.tut||(F.tut={n:0,s:{}})};
let TUT_SHOW=[];
function tutHint(id){
  try{if(tutOff()||G.state!=='play')return;const T=tutF();if(T.s[id])return;T.s[id]=1;TUT_SHOW.push({id,t:G.time});if(TUT_SHOW.length>3)TUT_SHOW.shift()}catch(e){console.error('tut',e)}}
// a battle begins when an enemy turns hostile near the party
let TUT_IN=false;
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(G.state==='play'&&!G.cut&&!G.talk&&G.heroes&&G.heroes.length){const h=hostileNear();
    if(h&&!TUT_IN){TUT_IN=true;const T=tutF();T.n=(T.n||0)+1;
      if(T.n===1){tutHint('b1a');tutHint('b1b')}else if(T.n===2)tutHint('b2');else if(T.n===3)tutHint('b3')}
    else if(!h)TUT_IN=false}}catch(e){}
  return r}}
{const _p=pickup;pickup=function(it){const r=_p.apply(this,arguments);try{if(r&&it&&ITEMDEF[it.k]&&ITEMDEF[it.k].k==='food')tutHint('food');if(r&&it&&ITEMDEF[it.k]&&ITEMDEF[it.k].k==='weapon')tutHint('gear')}catch(e){}return r}}
{const _r=restParty;restParty=function(inn){const r=_r.apply(this,arguments);try{if(r!==false)tutHint('rest')}catch(e){}return r}}
{const _h=useHeal;useHeal=function(hi,idx){let food=false;try{const it=G.bag[idx];food=!!(it&&ITEMDEF[it.id]&&ITEMDEF[it.id].k==='food')}catch(e){}const r=_h.apply(this,arguments);if(r&&food)tutHint('eat');return r}}
// the boxes
{const _ui=ui;ui=function(dt){_ui.apply(this,arguments);
  try{
    if(G.state!=='play'||!TUT_SHOW.length)return;
    if(tutOff()){TUT_SHOW=[];return}
    TUT_SHOW=TUT_SHOW.filter(b=>G.time-b.t<12);if(!TUT_SHOW.length)return;
    const w=164,fs=8,x=404-w;let y=30; // right-hand side, narrow: the enemy's name and health bar are top left and the enemy is in the middle
    for(const b of TUT_SHOW){
      const lines=wrapText(TUT_TEXT[b.id],w-18,fs),h=lines.length*10+14;
      ctx.save();ctx.globalAlpha=clamp((12-(G.time-b.t))*2,0,1)*clamp((G.time-b.t)*5+.2,0,1);
      const age=G.time-b.t,pulse=.5+.5*Math.sin(G.time*4+y*.05);
      // a gold glow that breathes, so the box is easy to notice
      ctx.shadowColor='rgba(255,214,120,'+(.45+.4*pulse).toFixed(2)+')';ctx.shadowBlur=7+7*pulse;
      ctx.fillStyle='rgba(12,9,5,.88)';rrect(ctx,x,y,w,h,4);ctx.fill();ctx.lineWidth=1.8;ctx.strokeStyle=goldG(x,y,w,h);rrect(ctx,x,y,w,h,4);ctx.stroke();
      ctx.shadowBlur=0;ctx.shadowColor='transparent';
      lines.forEach((s,i)=>txt(s,x+9,y+12+i*10,fs,'#ece0c0','left',false,undefined,w-18));
      // a shine that sweeps across the box every couple of seconds
      ctx.save();rrect(ctx,x,y,w,h,4);ctx.clip();
      const ph=((G.time*.45+y*.004)%1),sx=x-40+ph*(w+80),sg=ctx.createLinearGradient(sx-22,y,sx+22,y+h);
      sg.addColorStop(0,'rgba(255,240,190,0)');sg.addColorStop(.5,'rgba(255,240,190,.34)');sg.addColorStop(1,'rgba(255,240,190,0)');
      ctx.fillStyle=sg;ctx.fillRect(x,y,w,h);ctx.restore();
      // a thin line along the bottom that runs out: the hint is only there for a while
      ctx.fillStyle='rgba(232,200,120,.75)';ctx.fillRect(x+4,y+h-3,(w-8)*clamp(1-age/12,0,1),1.4);
      ctx.restore();btn('tut_ok'+b.id,x,y,w,h);y+=h+4}
    // a plain line under the boxes: the switch is in Menu > Settings > Gameplay
    ctx.save();ctx.globalAlpha=.9;txt('Turn hints off in gameplay settings.',x+w-4,y+8,7.6,'#d8c88e','right');ctx.restore()}catch(e){console.error('tut ui',e)}}}
{const _b=handleBtn;handleBtn=function(id){
  if(G.menu==='gameplay'&&id==='gp_hints'){try{localStorage.setItem('abbeyHintsOff',tutOff()?'0':'1')}catch(e){}TUT_SHOW=[];sfx('equip');return}
  if(/^tut_ok/.test(id)){const k=id.slice(6);TUT_SHOW=TUT_SHOW.filter(b=>b.id!==k);sfx('equip');return}
  return _b.apply(this,arguments)}}
// the switch: a button on the Gameplay page (Menu > Settings > Gameplay)
{const _g=drawGameplay;drawGameplay=function(){_g.apply(this,arguments);btnText('gp_hints','Hints: '+(tutOff()?'OFF':'ON'),296,290,106,24)}}
// the first door opened (pushed, or unlocked with a key)
{const _m=msg;msg=function(t){const r=_m.apply(this,arguments);try{if(/^You push the door open|^The rusty key turns/.test(String(t)))tutHint('door')}catch(e){}return r}}
