/* ==========================================================================
   BATTLE AND SURVIVAL HINTS FOR A NEW PLAYER (v3.882). Little boxes in the play screen, spread over the first battles, and a few that appear the first time something happens:
     battle 1: hold the space bar or action button for repeated attacks; power moves hit harder but cost mana or stamina.
     battle 2: if monsters are too hard, come back later.     battle 3: potions can be put in shortcut slots.
     the first food picked up: food stops starving.   the first rest: resting heals if you have food.   the first meal eaten: buy or find food and potions.
   Each box goes away by itself after 12 seconds or when clicked, and a 'Turn hints off' check box (kept on this computer: abbeyHintsOff) stops every hint for good.
   What has been shown is kept in the game's flags (G.flags.tut), so a hint is not shown twice in a game.
   ========================================================================== */
const TUT_TEXT={
  b1a:'Hold the space bar or the action button down to do repeated attacks!',
  b1b:'Your power moves will do more damage, but will cost mana or stamina.',
  b2:'If monsters are too hard, you can always come back later.',
  b3:'Potions can be put in shortcut slots that make them easier to access during battle.',
  food:'Food will stop your character from starving.',
  rest:'Resting will heal your character if you have food.',
  eat:'Buy food and potions from shops in towns or find them out in the wild.'};
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
{const _p=pickup;pickup=function(it){const r=_p.apply(this,arguments);try{if(r&&it&&ITEMDEF[it.k]&&ITEMDEF[it.k].k==='food')tutHint('food')}catch(e){}return r}}
{const _r=restParty;restParty=function(inn){const r=_r.apply(this,arguments);try{if(r!==false)tutHint('rest')}catch(e){}return r}}
{const _h=useHeal;useHeal=function(hi,idx){let food=false;try{const it=G.bag[idx];food=!!(it&&ITEMDEF[it.id]&&ITEMDEF[it.id].k==='food')}catch(e){}const r=_h.apply(this,arguments);if(r&&food)tutHint('eat');return r}}
// the boxes
{const _ui=ui;ui=function(dt){_ui.apply(this,arguments);
  try{
    if(G.state!=='play'||!TUT_SHOW.length)return;
    if(tutOff()){TUT_SHOW=[];return}
    TUT_SHOW=TUT_SHOW.filter(b=>G.time-b.t<12);if(!TUT_SHOW.length)return;
    const x=34,w=258,fs=8.5;let y=30;
    for(const b of TUT_SHOW){
      const lines=wrapText(TUT_TEXT[b.id],w-22,fs),h=lines.length*11+16;
      ctx.save();ctx.globalAlpha=clamp((12-(G.time-b.t))*2,0,1)*clamp((G.time-b.t)*5+.2,0,1);
      ctx.fillStyle='rgba(12,9,5,.93)';rrect(ctx,x,y,w,h,4);ctx.fill();ctx.lineWidth=1.8;ctx.strokeStyle=goldG(x,y,w,h);rrect(ctx,x,y,w,h,4);ctx.stroke();
      lines.forEach((s,i)=>txt(s,x+11,y+13+i*11,fs,'#ece0c0','left',false,undefined,w-22));
      ctx.restore();btn('tut_ok'+b.id,x,y,w,h);y+=h+4}
    // the check box
    ctx.save();ctx.fillStyle='rgba(12,9,5,.93)';rrect(ctx,x,y,112,16,3);ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle='#8a7448';rrect(ctx,x,y,112,16,3);ctx.stroke();
    ctx.strokeStyle='#d8c88e';ctx.lineWidth=1.2;ctx.strokeRect(x+6,y+4.5,8,8);ctx.restore();
    txt('Turn hints off',x+19,y+9,8,'#d8c88e','left');btn('tut_off',x,y,112,16)}catch(e){console.error('tut ui',e)}}}
{const _b=handleBtn;handleBtn=function(id){
  if(id==='tut_off'){try{localStorage.setItem('abbeyHintsOff','1')}catch(e){}TUT_SHOW=[];sfx('equip');return}
  if(/^tut_ok/.test(id)){const k=id.slice(6);TUT_SHOW=TUT_SHOW.filter(b=>b.id!==k);sfx('equip');return}
  return _b.apply(this,arguments)}}
