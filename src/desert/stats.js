/* ==========================================================================
   THE STATS PAGE. A tally of the whole adventure, kept in the save (G.flags.stats): gold earned and spent, steps, time, kills of every
   kind of monster, potions drunk, shops visited, quests taken and finished, hints used and more. Gold, steps and time are counted each
   frame; the rest by wrapping the game's own functions once, at start-up (statInstall, called before the game begins).
   ========================================================================== */
function ST(){
  const F=G.flags||(G.flags={});
  return F.stats||(F.stats={gE:0,gS:0,gP:0,steps:0,sea:0,sec:0,drinks:0,deaths:0,dmg:0,big:0,hints:0,hintQ:{},shops:{},shopVisits:0,tele:0,rides:0,talks:0,rests:0,chests:0,lootGold:0});
}
const stN=n=>Math.round(n).toLocaleString('en-GB');
function statTick(dt){
  if(!G.state||G.state!=='play'||!G.heroes)return;
  const S=ST();S.sec+=Math.min(.25,dt);
  if(G._stGold!==undefined){const d=G.gold-G._stGold;if(d>0)S.gE+=d;else if(d<0)S.gS-=d}
  G._stGold=G.gold;if(G.gold>S.gP)S.gP=G.gold;
  const p=G._stPos;
  if(p&&p.l===LEVEL&&(p.x!==G.P.x||p.y!==G.P.y)&&Math.abs(p.x-G.P.x)+Math.abs(p.y-G.P.y)<=2){if(typeof SN!=='undefined'&&LEVEL===SN.ID)S.sea++;else S.steps++}
  G._stPos={l:LEVEL,x:G.P.x,y:G.P.y};
  if(G._stAl)G.heroes.forEach((h,i)=>{if(G._stAl[i]&&!h.alive)S.deaths++});
  G._stAl=G.heroes.map(h=>h.alive);
}
let ST_DONE=false;
function statInstall(){ // wrap the game's own functions, once
  if(ST_DONE)return;ST_DONE=true;
  const wrap=(name,fn)=>{try{const o=window[name]||eval(name);if(typeof o!=='function')return;const w=fn(o);eval(name+'=w')}catch(e){console.error('stats',name,e)}};
  wrap('hurtEnemy',o=>function(e,d){const hp0=e.hp,r=o.apply(this,arguments);try{const S=ST(),dealt=Math.max(0,Math.min(hp0,d));S.dmg+=dealt;if(dealt>S.big)S.big=dealt}catch(x){}return r});
  wrap('useHeal',o=>function(){const r=o.apply(this,arguments);if(r)try{ST().drinks++}catch(x){}return r});
  wrap('openShop',o=>function(d,stock,name){try{const S=ST(),k=name||'a shop';S.shops[k]=(S.shops[k]||0)+1;S.shopVisits++}catch(x){}return o.apply(this,arguments)});
  wrap('teleportTo',o=>function(n){const was=!!TP,r=o.apply(this,arguments);if(!was&&TP)try{ST().tele++}catch(x){}return r});
  wrap('yrRide',o=>function(d,fare){const g=G.gold,r=o.apply(this,arguments);if(G.gold<g)try{ST().rides++}catch(x){}return r});
  wrap('khRide',o=>function(d,fare){const g=G.gold,r=o.apply(this,arguments);if(G.gold<g)try{ST().rides++}catch(x){}return r});
  wrap('startTalk',o=>function(){try{ST().talks++}catch(x){}return o.apply(this,arguments)});
  wrap('restParty',o=>function(){try{ST().rests++}catch(x){}return o.apply(this,arguments)});
  wrap('openLoot',o=>function(d){try{if(d&&!d.shop)ST().chests++}catch(x){}return o.apply(this,arguments)});
  wrap('restoreNow',o=>function(){const r=o.apply(this,arguments);G._stGold=undefined;G._stPos=undefined;G._stAl=undefined;return r});
}
/* ---- the numbers ---- */
function statKills(){ // [name, count] for every kind of monster the party has killed, most first
  const F=G.flags||{},out=[];
  for(const k in F){
    if(k.slice(0,2)!=='k_')continue;const t=k.slice(2),d=ENEMY_DEF[t];
    if(!d||t==='dskeleton')continue; // the desert skeleton is counted inside the skeleton's tally
    const n=F[k]|0;if(n>0)out.push([d.name,n,t]);
  }
  // a name shared by two kinds (a wolf and a desert wolf) is listed once
  const m={};for(const [nm,n] of out)m[nm]=(m[nm]||0)+n;
  return Object.keys(m).map(nm=>[nm,m[nm]]).sort((a,b)=>b[1]-a[1]);
}
function statTime(sec){const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);return h?`${h} h ${m} min`:`${m} min`}
function statSections(){
  const S=ST(),F=G.flags||{},qs=G.quests||{},ids=Object.keys(qs),done=ids.filter(i=>qs[i].st==='done').length;
  const A=typeof achList==='function'?achList():{got:0,total:0},main=typeof MAIN_QUESTS!=='undefined'?[...MAIN_QUESTS].filter(i=>qs[i]&&qs[i].st==='done').length:0,mainAll=typeof MAIN_QUESTS!=='undefined'?MAIN_QUESTS.size:0;
  const kills=G.kills||statKills().reduce((a,b)=>a+b[1],0),lv=G.heroes?Math.max(...G.heroes.map(h=>h.lvl)):1;
  const seen=Object.keys(F.lvSeen||{}).length,shopsDistinct=Object.keys(S.shops).length;
  return [
    ['GOLD',[['Gold earned',stN(S.gE)],['Gold spent',stN(S.gS)],['Gold now',stN(G.gold)],['Biggest purse',stN(S.gP)]]],
    ['THE ROAD',[['Steps on land',stN(S.steps)],['Cells sailed',stN(S.sea)],['Days passed',stN((G.clock||0)/1440)],['Time played',statTime(S.sec)],['Places visited',stN(seen)],['Dungeons explored',`${A.got} of ${A.total}`],['Teleporters woken',stN(Object.keys(F.teles||{}).length)],['Teleports taken',stN(S.tele)],['Donkey rides',stN(S.rides)]]],
    ['QUESTS',[['Quests taken',stN(ids.length)],['Quests completed',`${done} of ${ids.length}`],['Main quests done',`${main} of ${mainAll}`],['Hints used',stN(S.hints)]]],
    ['TOWNS AND TRADE',[['Shops visited',stN(shopsDistinct)],['Shop visits',stN(S.shopVisits)],['Conversations',stN(S.talks)],['Chests and boxes opened',stN(S.chests)],['Times rested',stN(S.rests)]]],
    ['BATTLE',[['Monsters killed',stN(kills)],['Kinds of monster',stN(statKills().length)],['Damage dealt',stN(S.dmg)],['Biggest hit',stN(S.big)],['Potions drunk',stN(S.drinks)],['Heroes fallen',stN(S.deaths)],['Highest hero level',stN(lv)]]]
  ];
}
/* ---- the page ---- */
function drawStats(){
  BTNS=[];veil(.72);bigPanel(14,6,452,308);
  txt('STATS',240,21,14,'#d8c88e','center',true);
  const secs=statSections();let y=36-(G.sts2||0);
  const lt=secs.reduce((a,[h,r])=>a+14+r.length*11+5,0);G.stMax2=Math.max(0,lt-250);G.sts2=clamp(G.sts2||0,0,G.stMax2);y=36-G.sts2;
  ctx.save();ctx.beginPath();ctx.rect(20,30,226,254);ctx.clip();
  for(const [head,rows] of secs){
    txt(head,26,y+4,8.5,'#c8a860','left',true);ctx.fillStyle='rgba(200,168,96,.35)';ctx.fillRect(26,y+9,212,1);y+=14;
    for(const [k,v] of rows){txt(k,30,y+3,8,'#c8bc98','left');txt(String(v),236,y+3,8.5,'#ecdca8','right',true);y+=11}
    y+=5;
  }
  ctx.restore();
  if(G.stMax2>0){const th=250,bh=Math.max(18,th*250/lt),by=32+(th-bh)*(G.sts2/G.stMax2);ctx.fillStyle='rgba(216,200,142,.12)';ctx.fillRect(244,32,3,th);ctx.fillStyle='rgba(216,200,142,.6)';ctx.fillRect(244,by,3,bh)}
  BTNS.push({id:'st_left',x:20,y:30,w:226,h:254,up:true,drag:'stats2'});
  // the right-hand column: every kind of monster killed, and how many
  const kills=statKills(),top=50,vh=232,rh=12,total=kills.length*rh;
  G.stMax=Math.max(0,total-vh);G.sts=clamp(G.sts||0,0,G.stMax);
  txt('MONSTERS SLAIN',356,21+14,9,'#c8a860','center',true);ctx.fillStyle='rgba(200,168,96,.35)';ctx.fillRect(254,43,204,1);
  ctx.save();ctx.beginPath();ctx.rect(254,top-2,206,vh+2);ctx.clip();
  if(!kills.length)txt('None yet.',356,top+20,8.5,'#a89878','center');
  kills.forEach(([nm,n],i)=>{const yy=top+i*rh-G.sts;if(yy<top-12||yy>top+vh+4)return;txt(nm,260,yy+5,8,'#c8bc98','left',false,undefined,140);txt(stN(n),454,yy+5,8.5,'#ecdca8','right',true)});
  ctx.restore();
  if(G.stMax>0){const th=vh-4,bh=Math.max(18,th*vh/total),by=top+2+(th-bh)*(G.sts/G.stMax);ctx.fillStyle='rgba(216,200,142,.12)';ctx.fillRect(460,top+2,3,th);ctx.fillStyle='rgba(216,200,142,.6)';ctx.fillRect(460,by,3,bh)}
  BTNS.push({id:'st_list',x:254,y:top,w:206,h:vh,up:true,drag:'stats'});
  btnText('st_close','Close',190,288,100,22);
}
function statsBtn(id){if(id==='st_close'||id==='menu'||id==='menuclose2')G.menu=true}
