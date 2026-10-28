/* ==========================================================================
   THE WELL MAZE: hooks into the game (prefix wm / WM): loading a level (open doors stay open, lamp colours), pits, the Well-Warden's fight, loot, the lists and the test link.
   ========================================================================== */
/* ---------- loading a level ---------- */
const WM_LCOLS=[[1.05,.5,1.5],[1.05,.5,1.5],[1.05,.5,1.5],[1.15,.8,1.4],[1.15,.8,1.4],[1.4,1.0,.45],[.5,1.2,1.1]];
{const _ll=loadLevel;loadLevel=function(n){
  const r=_ll.apply(this,arguments);G.wmOpenLv=-1;
  try{if(WM.IDS.includes(n)){wmArt();const L=LEVELS[n],F=wmF();
      // opened doors stay open
      for(const key in F.open){const [lv,xy]=key.split(':');if(+lv!==n)continue;const [x,y]=xy.split(',').map(Number);if(G.grid[y])G.grid[y][x]=0}
      // pulled levers show as pulled; a taken prize and the dead boss are gone
      for(const s of L._wm.sw)if(F.sw[n+':'+s.n]&&s.type==='lever'){const d=G.decor.find(q=>q.x===s.x&&q.y===s.y&&q.npc==='wmsw_'+s.n);if(d)d.k='wm_lever_down'}
      if(F.prize)for(const d of G.decor)if(d.npc==='wm_prize'){d.found=true;d.block=false}
      for(const d of G.decor)if(d.npc&&/^wmw_/.test(d.npc)&&F.got[n+':'+d.x+','+d.y]){d.found=true;d.block=false}
      if(F.bossDead)G.enemies=G.enemies.filter(e=>e.t!=='wmwarden');
      // lamps: violet, lilac, a little gold and teal
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=L._wm.lcol[key]||WM_LCOLS[(hash2(Math.floor(l.x),Math.floor(l.y),n+4)*WM_LCOLS.length)|0];l.kI=1.5;l.range2=150;l.calm=true}
      // light the shafts and the hall props too
      if(!F.seen[n]){F.seen[n]=1;msg(n===497?'The well shaft: cold air, wet brick, and a purple glow far below.':n===498?'Brick, violet brick, in every direction. The glow comes from the mortar.':n===499?'Somewhere below, a bell hangs in the dark.':'Amethyst. The whole Deep is amethyst, and it is humming.','#d8b8ff')}}
  }catch(e){console.error('wm load',e)}
  return r}}
/* ---------- pits: hollow slabs ---------- */
{const _dm=doMove;doMove=function(){
  const r=_dm.apply(this,arguments);
  try{if(wmIn()&&G.state==='play'){const L=LEVELS[LEVEL],F=wmF(),key=G.P.x+','+G.P.y,p=L._wm.pits[key];
      if(p&&!F.pit[LEVEL+':'+key]){F.pit[LEVEL+':'+key]=1;sfx('bump');G.shake=.5;
        const pct=p===2?.12:.08;let hit=0;
        for(const i of livingHeroes()){const h=G.heroes[i],dmg=Math.max(1,Math.min(h.hp-1,Math.round(h.max*pct)));h.hp-=dmg;h.hurt=1;hit++;addFloat(portraitX(i)+19,250,'-'+dmg,'#c8a0f0')}
        msg('A hollow slab gives way under your foot! The party tumbles into a shallow pit and climbs out bruised.','#e8b8d8')}}}catch(e){console.error('wm pit',e)}
  return r}}
/* ---------- the Well-Warden ---------- */
function wmFree(e,rad){const out=[];for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){if(!dx&&!dy)continue;const x=e.x+dx,y=e.y+dy;if(cellBlocked(x,y)||enemyAt(x,y)||(x===G.P.x&&y===G.P.y))continue;out.push([x,y,Math.abs(dx)+Math.abs(dy)])}out.sort((a,b)=>a[2]-b[2]||Math.random()-.5);return out}
function wmShatter(e,all){
  const st=enemyStat(e.t,e.lvl),def=ENEMY_DEF[e.t];let n=0;
  msg('The Well-Warden clenches his fists and the amethyst in the walls SHRIEKS. Shards of crystal fly across the hall!','#d8a8ff');sfx('screech');G.shake=.5;
  for(const hi of (all?[0,1,2,3]:[0,1])){const h=G.heroes[hi];if(!h||!h.alive||h.hp<=0)continue;
    if(Math.random()<enemyHitC(def,hi,e.lvl,e)+.05){let d=Math.max(1,Math.round(rnd(st.dmg[0],st.dmg[1])*(all?.65:1.15)));if(typeof armourWard==='function')d=Math.max(1,d-armourWard(hi));
      h.hp-=d;h.hurt=1;n++;msg('A shard cuts '+HERO_DEF[hi].name+' for '+d+'.','#e8a0d8');addFloat(portraitX(hi)+19,250,'-'+d,'#d890ff');
      try{if(h.hp>0)afflInflict('bleeding',hi,true)}catch(x){}
      if(h.hp<=0){h.hp=0;h.alive=false;msg(HERO_DEF[hi].name+' has fallen!','#ff8a7a');try{bondFall(hi)}catch(x){}if(G.sel===hi)nextHero()}}
    else msg('A shard whistles past '+HERO_DEF[hi].name+'.','#a09880')}
  return 330}
ENEMY_DEF.wmwarden.act=e=>{
  if(e.hp<=0)return 0;
  e.wmR=(e.wmR||0)+1;
  if(e.hp<e.maxhp)e.hp=Math.min(e.maxhp,e.hp+Math.max(1,Math.round(e.maxhp*.0015))); // the crystal knits back a little every round
  const d=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
  if(e.wmR%9===0&&e.hp<e.maxhp*.9){const h=Math.round(e.maxhp*.025);e.hp=Math.min(e.maxhp,e.hp+h);msg('The white crystal in the Warden\'s chest flares, and his cracks close a little.','#e8d8ff')}
  if(e.wmR%9===0&&d<=6&&hasLOS(e.x,e.y,G.P.x,G.P.y))return wmShatter(e,true);
  if(e.wmR%4===0&&d<=5&&hasLOS(e.x,e.y,G.P.x,G.P.y))return wmShatter(e,false);
  return 0};
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  const boss=!!(e&&e.t==='wmwarden'&&e.hp>0);
  _he.apply(this,arguments);
  if(!boss)return;
  if(e.hp<=0){try{wmDied(e)}catch(x){console.error('wmDied',x)}return}
  // at two thirds and one third of his health the Deep sends a golem
  const step=Math.min(2,Math.floor((1-e.hp/e.maxhp)*3));e.wmSum=e.wmSum||0;
  while(e.wmSum<step){e.wmSum++;try{const free=wmFree(e,4);if(free.length){addEnemy('wmgolem',free[0][0],free[0][1],true);msg('A crystal golem tears itself out of the wall and lumbers toward you.','#c8a0f0');sfx('growl')}}catch(x){console.error(x)}}}}
function wmDied(e){
  const F=wmF();if(F.bossDead)return;F.bossDead=1;
  msg('The Well-Warden is dead! His great body cracks along every seam, and the light in his chest goes out.','#ffd76a');
  for(const q of G.enemies)if(q.t==='wmgolem'&&q.hp>0&&q.wmSummoned){q.hp=0;q.dying=.4}
  for(const id of ['wmblade','potion6','potion6','supermana']){if(!bagAdd(mkItem(id)))G.items.push({k:id,x:e.x,y:e.y,taken:false})}
  msg("In the glittering shards lie the Warden's Amethyst Edge and a few potions. The orb on the pedestal still glows.",'#d8b8ff')}
{const _u=update;update=function(dt){try{if(wmIn()&&G.state==='play'){const F=G.flags.wm;
    if(F){if(F.bossDead&&G.enemies.some(e=>e.t==='wmwarden'&&e.hp>0))for(const e of G.enemies)if(e.t==='wmwarden'&&e.hp>0){e.hp=0;e.dying=0}
      // doors that were opened stay open after a reload (the grid is made after the level is loaded, so it is set again here)
      if(G.wmOpenLv!==LEVEL||G.wmOpenN!==Object.keys(F.open).length){G.wmOpenLv=LEVEL;G.wmOpenN=Object.keys(F.open).length;for(const key in F.open){const [lv,xy]=key.split(':');if(+lv!==LEVEL)continue;const [x,y]=xy.split(',').map(Number);if(G.grid[y]&&G.grid[y][x]!==0)G.grid[y][x]=0}}}}}catch(e){}return _u.apply(this,arguments)}}
/* ---------- the fight is not softened by the party's level (the great creature stands at the place's level) ---------- */
/* ---------- chests, barrels and casks ---------- */
const WM_CONT=['wm_chest','wm_treasure_chest','wm_cask','wm_barrel_tall','wm_keg','wm_crate_lid'];
for(const n of WM_CONT)if(!CONTAINERS.includes(n))CONTAINERS.push(n);
if(typeof DS_LOOTNAME!=='undefined')Object.assign(DS_LOOTNAME,{wm_chest:'Old chest',wm_treasure_chest:'Treasure chest',wm_cask:'Wine cask',wm_barrel_tall:'Barrel',wm_keg:'Keg',wm_crate_lid:'Crate'});
{const _lf=lootFor;lootFor=function(d){
  if(wmIn()&&d&&WM_CONT.includes(d.k)){
    const L=LEVELS[LEVEL],gm=1+.07*(L._wm.k||0),key=d.x+','+d.y,r=q=>hash2(d.x,d.y,900+q),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})},tier=(L._wm.tier&&L._wm.tier[key])||0,loot=L._wm.loot&&L._wm.loot[key];
    if(loot)for(const id of loot)add(id,1);
    if(tier===0){ // casks and barrels
      add(['potion5','potion6','greatermana'][(r(1)*3)|0],1);if(r(2)<.5)add(foodFor?foodFor(r(3)):'cheese',2);d.gold=Math.round((60+Math.floor(r(4)*200))*gm);return items}
    if(tier===1){add('potion6',1);add(['potion5','greatermana'][(r(5)*2)|0],2);const a=typeof armourDrop==='function'&&r(6)<.4?armourDrop(r(7)):null;if(a)add(a);d.gold=Math.round((300+Math.floor(r(8)*500))*gm);return items}
    if(tier===2){add('potion6',2);add('greatermana',1);if(!loot||!loot.length){add(r(9)<.5?'supermana':'elixir',1)}const a=typeof armourDrop==='function'?armourDrop(r(10)):null;if(a)add(a);d.gold=Math.round((900+Math.floor(r(11)*900))*gm);return items}
    add('potion6',2);add('supermana',1);const a=typeof armourDrop==='function'?armourDrop(r(12)):null;if(a)add(a);d.gold=Math.round((2000+Math.floor(r(13)*2200))*gm);return items}
  return _lf.apply(this,arguments)}}
/* ---------- the lists, the world, the test link ---------- */
{const _g=gotoListRaw;gotoListRaw=function(){
  const out=_g.apply(this,arguments);
  try{if(!out.some(r=>r.n===497)){let i=out.findIndex(r=>r.h&&/western|wenlock/i.test(r.h));if(i<0)i=out.findIndex(r=>r.h==='The Known Lands');let j=i>=0?i+1:out.length;if(i>=0)while(j<out.length&&!out[j].h)j++;
      out.splice(j,0,...WM.IDS.map((n,k)=>({n,name:WM.NAMES[k]})))}}catch(e){console.error(e)}
  return out}}
{const _j=jumpFromUrl;jumpFromUrl=function(){
  const q=new URLSearchParams(location.search),town=(q.get('town')||'').toLowerCase().replace(/[^a-z]/g,'');
  if(town!=='wellmaze')return _j.apply(this,arguments);
  const orig=location.pathname+location.search+location.hash,target=Math.max(1,Math.min(83,parseInt(q.get('lvl')||'80',10)||80));
  q.set('town','ironhill');q.set('lvl','40');
  try{history.replaceState(null,'',location.pathname+'?'+q.toString()+location.hash)}catch(e){}
  try{_j.apply(this,arguments)}finally{try{history.replaceState(null,'',orig)}catch(e){}}
  G.heroes.forEach((h,i)=>{while(h.lvl<target){h.xp=xpNeed(h.lvl);levelUp(i)}h.alive=true;h.hp=h.max;h.mp=h.mpMax;h.food=Math.max(h.food||0,100)});
  if(q.get('gear')!=='0')try{giveJumpGear(target)}catch(e){console.error(e)}
  const k=Math.max(0,Math.min(3,(parseInt(q.get('k')||'1',10)||1)-1)),F=wmF();
  G.heroes.forEach((h,i)=>{while(h.lvl<WM.RATING[k]){h.xp=xpNeed(h.lvl);levelUp(i)}h.hp=h.max;h.mp=h.mpMax}); // a party at the level's own rating
  if(q.get('keys')){for(const id of ['wmkey1','wmkey2','wmkey3'])bagAdd(mkItem(id))}
  if(q.get('dead')){F.bossDead=1}
  KH_LAZY[WM.IDS[k]]&&!LEVELS[WM.IDS[k]]&&KH_LAZY[WM.IDS[k]]();
  const a=k===0?WM.M[0].arrive:WM.M[k].arrive;goToLevel(WM.IDS[k],{x:a.x,y:a.y,f:a.f});G.state='play';G.menu=false;
  msg('Your party stands at the top of '+WM.NAMES[k]+'.','#ffe36a');
}}

/* ---------- the pieces carry a little light of their own, so nothing stands in the dark as a black cut-out ---------- */
const WM_LIFT=[[/orbframe[0-3]$/,1.5],[/brazier|candelabra|lantern|lamp_post|cage|orb_pedestal/,.9],[/crystal|geode|mush|bellflower|bulb/,.72],[/web|skeleton|moss/,.5]];
{const _sl=spriteList;spriteList=function(){const out=_sl.apply(this,arguments);
  try{if(wmIn())for(const s of out){const d=s.decor;if(!d||!d.k||d.k.indexOf('wm_')!==0)continue;let v=.55;for(const [re,l] of WM_LIFT)if(re.test(d.k)){v=l;break}s.lift=Math.max(s.lift||0,v)}}catch(e){}
  return out}}
for(const t of Object.keys(ENEMY_DEF))if(/^wm/.test(t)&&t!=='wmwarden'&&!ENEMY_DEF[t].glow)ENEMY_DEF[t].glow=.3;
for(const t of ['wmcultist','wmgolem','wmbeetle','wmcrab','wmspider','wmfungus','wmmimic'])ENEMY_DEF[t].glow=Math.max(ENEMY_DEF[t].glow||0,.34);

/* the game copies only some decor fields into G.decor (and may rebuild the list), so the orb frames get their flags again whenever the list changes (orbs.js reads orbFrame) */
{let seen=null,seenN=-1;const _uo=update;update=function(dt){const r=_uo.apply(this,arguments);
  try{if(wmIn()&&G.decor&&(G.decor!==seen||G.decor.length!==seenN)){seen=G.decor;seenN=G.decor.length;for(const d of G.decor){const m=/^wm_orbframe(\d)$/.exec(d.k||'');if(m&&!d.orbFrame){d.orbFrame=true;d.orbColor=WM.ORBS[+m[1]].css;d.emptyK='wm_orbframeE'+m[1]}}}}catch(e){}
  return r}}
