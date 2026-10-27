/* ==========================================================================
   THE FOUR ENEMIES OF THE GHOST, and what happens in the mazes (prefix gy / GYB): the boss fights (volleys on a count, helpers at two thirds and one third of the health), the death of each
   (it drops the relic, the party is brought back up to the graveyard), the doors of the mazes (key, levers, the hunt, the seal), no respawn.
   Flags: G.flags.gy = {dead:{k:1}, open:{k:1}, key:1 (the Warden's key was taken), seq:[] (levers pulled so far), lev:1 (levers solved), k3:n (spirits put to rest), seal:1 (the seal was taken), met, peace, bell, ...}.
   ========================================================================== */
const gyF=()=>G.flags.gy||(G.flags.gy={dead:{},open:{},seq:[],k3:0});
const gyIn=()=>GY.M.includes(LEVEL);
function gyFreeAround(e,rad){const out=[];for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++){if(!dx&&!dy)continue;const x=e.x+dx,y=e.y+dy;if(cellBlocked(x,y)||enemyAt(x,y)||(x===G.P.x&&y===G.P.y))continue;out.push([x,y,Math.abs(dx)+Math.abs(dy)])}out.sort((a,b)=>a[2]-b[2]||Math.random()-.5);return out}
/* a volley at the front two (all = false) or at everyone: every hero rolls to be hit, takes mult times a blow of the creature, and may be afflicted */
function gyVolley(e,txt,col,all,mult,affl,verb){
  const st=enemyStat(e.t,e.lvl),def=ENEMY_DEF[e.t];msg(txt,col);sfx('screech');G.shake=.4;
  for(const hi of (all?[0,1,2,3]:[0,1])){const h=G.heroes[hi];if(!h||!h.alive||h.hp<=0)continue;
    if(Math.random()<enemyHitC(def,hi,e.lvl,e)+.05){let d=Math.max(1,Math.round(rnd(st.dmg[0],st.dmg[1])*mult));if(typeof armourWard==='function')d=Math.max(1,d-armourWard(hi));
      h.hp-=d;h.hurt=1;msg((verb||'It hits')+' '+HERO_DEF[hi].name+' for '+d+'.',col);addFloat(portraitX(hi)+19,250,'-'+d,col);
      try{if(h.hp>0&&affl)afflInflict(affl,hi,true)}catch(x){}
      if(h.hp<=0){h.hp=0;h.alive=false;msg(HERO_DEF[hi].name+' has fallen!','#ff8a7a');try{bondFall(hi)}catch(x){}if(G.sel===hi)nextHero()}}
    else msg('It misses '+HERO_DEF[hi].name+'.','#a09880')}
  return 330}
function gyBossAct(e,spec){
  if(e.hp<=0)return 0;
  e.gyR=(e.gyR||0)+1;
  const d=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y),los=d<=6&&hasLOS(e.x,e.y,G.P.x,G.P.y);
  if(spec.mend&&e.gyR%spec.mend[0]===0&&e.hp<e.maxhp){const h=Math.round(e.maxhp*spec.mend[1]);e.hp=Math.min(e.maxhp,e.hp+h);msg(spec.mend[2],'#e8d8ff')}
  for(const m of spec.moves)if(e.gyR%m.every===0&&los&&(!m.near||d<=m.near))return gyVolley(e,m.txt,m.col,m.all,m.mult,m.affl,m.verb);
  return 0}
const GY_BOSSMOVES={
  gyvane:{moves:[{every:5,all:true,mult:.55,affl:'cursed',txt:'Lord Vane flings a fistful of cursed coins. They ring on the brick, and burn where they land.',col:'#a8e090',verb:'A coin burns'},{every:3,mult:1.05,near:3,txt:'Lord Vane lunges with the rapier, very elegantly, and very rudely.',col:'#c8e8a0',verb:'The rapier finds'}]},
  gygrimsby:{moves:[{every:4,mult:1.35,near:2,affl:'graverot',txt:'Digger Grimsby swings the great spade in a flat arc. It has buried a great many people, and it knows how.',col:'#d8c090',verb:'The spade hits'},{every:7,all:true,mult:.5,txt:'Grimsby kicks over a heap of grave-earth, and a rotten cloud of it rolls across the hall.',col:'#c8b080',verb:'Grave dirt chokes'}]},
  gyaldric:{moves:[{every:5,all:true,mult:.6,affl:'haunted',txt:'Black flames pour out of the visor of Sir Aldric, and the hall goes cold and blue.',col:'#80c8ff',verb:'Cold flame burns'},{every:3,mult:1.15,near:2,txt:'Sir Aldric brings the greatsword round in a stroke that has not been learnt in this century.',col:'#a8c8f0',verb:'The greatsword cleaves'}]},
  gymorwenna:{moves:[{every:6,all:true,mult:.55,affl:'shaken',txt:'Prioress Morwenna raises the bell-staff and tolls. The sound goes through the bone.',col:'#f0d870',verb:'The bell tolls on'},{every:4,mult:.9,near:5,affl:'cursed',txt:'The Prioress swings the censer, and a yellow smoke curls round one of you, whispering that it is all your fault.',col:'#e8d070',verb:'The smoke stings'}],mend:[9,.04,"The Prioress mutters the burial service backwards, and her wounds close a little."]}};
for(const t in GY_BOSSMOVES)ENEMY_DEF[t].act=e=>gyBossAct(e,GY_BOSSMOVES[t]);
const GY_HELPERS={gyvane:['gypike','The dead of the Vane household step out of the brick to defend their master.'],gygrimsby:['gyzombie','A rotten shape drags itself up out of the pit, still holding a shovel.'],gyaldric:['gywraith','A wraith of the old knight\'s men rises from the black stone, and kneels, and then attacks.'],gymorwenna:['gyhound','A bone hound shakes itself loose from the heap of the dead, and growls at the bell.']};
/* ---- every blow on a boss and on a spirit ---- */
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  const def=e&&ENEMY_DEF[e.t],isB=!!(def&&def.gyb!==undefined&&e.hp>0),spirit=!!(def&&e.hp>0&&/^gy(wraith|shade|banshee)$/.test(e.t)&&LEVEL===GY.M[2]);
  _he.apply(this,arguments);
  try{
    if(isB){if(e.hp<=0){gyBossDied(e);return}
      const step=Math.min(2,Math.floor((1-e.hp/e.maxhp)*3));e.gySum=e.gySum||0;
      while(e.gySum<step){e.gySum++;const H=GY_HELPERS[e.t],free=gyFreeAround(e,4);if(H&&free.length){for(let n=0;n<2&&n<free.length;n++){addEnemy(H[0],free[n][0],free[n][1],true);const m=G.enemies[G.enemies.length-1];if(m)m.gyAdd=1}msg(H[1],'#d8c8a0');sfx('growl')}}}
    else if(spirit&&e.hp<=0)gySpiritDown(e)}catch(x){console.error('gy hurt',x)}}}
function gySpiritDown(e){
  const F=gyF();F.k3=(F.k3|0)+1;
  if(F.k3<8){msg('The '+ENEMY_DEF[e.t].name+' sighs and is gone. '+F.k3+' of 8 restless spirits have been put to rest.','#a8d0f8')}
  else if(F.k3===8){msg('The eighth spirit goes, and the whole Barrow breathes out. Far off, a heavy door swings open.','#a8d0f8');gyOpenDoor(2)}}
/* ---- the death of an enemy of the ghost ---- */
const GY_LAST=[
 "Lord Corwin Vane goes down on one knee, and the plumed hat rolls off across the floor. 'It was only a ring,' he says, to nobody. 'I was going to give it back.' He does not believe it either. The ring lies where he knelt, small and gold and red, and the brick of the Ossuary seems to let go of a held breath.",
 "Digger Grimsby drops the spade, and sits down on the edge of his own pit, and looks at it for a while. 'Forty years I dug,' he says, 'and never once for somebody I was sorry for.' He is gone before he finishes. Where he sat is a small grey slab with a carved border, and room on it for one name.",
 "Sir Aldric the Forsworn lowers the greatsword, and the blue fire goes out of the visor. 'Tell her,' he says, in the voice of a young man, 'tell her I came as far as the door. Every winter. I came as far as the door.' The armour folds in on itself, empty. Something silver is left on the floor, on a chain.",
 "Prioress Morwenna's bell cracks across, with a sound like a dropped plate, and the chapel is suddenly very small and very quiet. 'I did as I was paid,' she says. 'It is a thing I have thought about, since.' She is a heap of black cloth and old grey dust. A leather book lies in it, with a brass clasp, the page still marked."];
const GY_GIVE=[['gyring',"Lady Aldith's Wedding Ring"],['gyname',"Lady Aldith's Name-stone"],['gylocket',"Sir Edmund's Locket"],['gybook',"The Prioress's Book of Rest"]];
function gyBossDied(e){
  const k=ENEMY_DEF[e.t].gyb,F=gyF();if(F.dead[k])return;F.dead[k]=1;
  for(const q of G.enemies)if(q.hp>0&&q.gyAdd){q.hp=0;q.dying=.4}
  const [id,nm]=GY_GIVE[k];if(!bagAdd(mkItem(id)))G.items.push({k:id,x:e.x,y:e.y,taken:false});
  for(const it of ['potion6','potion6','supermana']){if(!bagAdd(mkItem(it)))G.items.push({k:it,x:e.x,y:e.y,taken:false})}
  msg('You have '+nm+'.','#ffe36a');sfx('win');
  later(1500,()=>{const nm=ENEMY_DEF[e.t].name;G.talk={d:{k:'gyi_'+['vane','grimsby','aldric','morwenna'][k],x:G.P.x,y:G.P.y,npc:'gyo_note'},n:{name:nm,root:()=>null},node:say(GY_LAST[k],[['Climb out of the dark.',()=>{gyReturn(k);return null}]]),t:G.time,btns:[]}})}
function gyReturn(k){const d=GY_Y.doors[k],dy=d.y<35?1:-1;sfx('door');G.talk=null;goToLevel(GY.ID,{x:d.x,y:d.y+dy,f:d.y<35?2:0});
  try{msg('You climb out into the dusk, with the cold of the dark still on your coats.','#b8c8e8')}catch(x){}}
/* ---- the boss doors ---- */
function gyOpenDoor(k){
  const F=gyF(),L=LEVELS[GY.M[k]];if(!L)return;const M=L._gy.M;F.open[k]=1;
  if(LEVEL===GY.M[k]&&G.grid&&G.grid[M.door.y])G.grid[M.door.y][M.door.x]=0;
  sfx('door');msg('The door to the end of the maze swings open.','#ffe36a')}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.gy==='bossdoor'){const F=gyF(),k=d.k;
    if(F.open[k]){if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}
    if(k===0){if(bagCount('gykey')){bagRemove('gykey',1);gyOpenDoor(0);msg("The Warden's Iron Key turns with a groan, and stays in the lock.",'#ffe36a')}else{sfx('locked');msg('A barred iron door, red with rust, with a big keyhole. The Warden of the Ossuary kept the key somewhere near his cell.','#d8b090')}}
    else if(k===1){if(F.lev)gyOpenDoor(1);else{sfx('locked');msg('A barred gate with no lock at all. Three levers somewhere in the Charnel work it, in the right order. The stone in the first room will say which.','#c8d8a0')}}
    else if(k===2){if((F.k3|0)>=8)gyOpenDoor(2);else{sfx('locked');msg('The door is sealed with a pale, cold light. '+(F.k3|0)+' of 8 restless spirits have been put to rest. It will open when there are eight.','#a8d0f8')}}
    else if(k===3){if(bagCount('gyseal')){bagRemove('gyseal',1);gyOpenDoor(3);msg("The bone seal fits the door like a key in a lock, and the Prioress's chapel stands open.",'#ffe36a')}else{sfx('locked');msg('A door of bone, sealed with a bell in wax. The Prioress locked it with her own seal, and she keeps the seal in a chest that she has trapped.','#e8e0c0')}}
    return true}
  return _k.apply(this,arguments)}}
/* open doors stay open: when the level is loaded, and every frame until the grid has caught up (the grid is made after the level is loaded) */
{const _ll=loadLevel;loadLevel=function(n){
  const r=_ll.apply(this,arguments);G.gyOpenLv=-1;
  try{if(gyIs(n)&&gyMazeK(n)>=0){const L=LEVELS[n],F=gyF(),k=gyMazeK(n),M=L._gy.M;if(F.open[k]&&G.grid[M.door.y])G.grid[M.door.y][M.door.x]=0;
        if(F.dead[k])G.enemies=G.enemies.filter(e=>ENEMY_DEF[e.t].gyb===undefined)}}catch(e){console.error('gy load',e)}
  return r}}
/* the lights: lamps take the colour of the place; in each maze the wall torches (all of one colour, flickering) are put in the engine's light list, which setupLights has just emptied and filled again */
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(gyIs(LEVEL)){const L=LEVELS[LEVEL],lc=(L._gy&&L._gy.lcol)||{},cols=L._gy&&L._gy.kind==='maze'?GYM_SPEC[L._gy.k].lcol:L._gy&&L._gy.kind==='crypt'?[1.25,.9,.55]:[1.2,.95,.7];
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=lc[key]||cols;l.kI=LEVEL===GY.ID?1.1:1.4;l.range2=LEVEL===GY.ID?60:130;l.calm=true}
      if(L._gy.kind==='maze'){gyFlames();const T=L._gy.torch;
        for(const [x,y,f,nar] of L._gy.torches){const d=GYM_D[f],O=nar?.035:TORCH_OUT;
          LIGHTS.push({x:x+.5+d[0]*(.5+O),y:y+.5+d[1]*(.5+O),ph:hash2(x,y,5)*6.28,key:(y*MW+x)*4+f,taken:false,red:!!T.red,fl:T.fl,col:T.col,o:O,nar:!!nar,range2:150,kI:1.25})}}}}catch(e){console.error('gy lights',e)}
  return r}}
{const _u=update;update=function(dt){try{if(gyIn()&&G.state==='play'){const F=G.flags.gy;
    if(F&&G.gyOpenLv!==LEVEL){G.gyOpenLv=LEVEL;const k=gyMazeK(LEVEL),M=LEVELS[LEVEL]._gy.M;if(F.open[k]&&G.grid[M.door.y])G.grid[M.door.y][M.door.x]=0}
    if(F)for(let k=0;k<4;k++)if(F.dead[k]&&LEVEL===GY.M[k])for(const e of G.enemies)if(ENEMY_DEF[e.t].gyb!==undefined&&e.hp>0){e.hp=0;e.dying=0}}}catch(e){}return _u.apply(this,arguments)}}
/* the chests of the mazes: potions, mana, gear and gold, better the deeper the maze */
{const _lf=lootFor;lootFor=function(d){
  if(gyIs(LEVEL)&&d&&d.k==='gy_chest'){
    const r=q=>hash2(d.x,d.y,700+q),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})},k=Math.max(0,gyMazeK(LEVEL));
    for(let q=0;q<2+k;q++)add(potionFor(r(10+q)),1);add('supermana',1+(k>1?1:0));if(r(2)<.6)add('elixir',1);
    for(let q=0;q<1+(k>1?1:0);q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}
    if(typeof ringFor==='function'&&r(3)<.5)add(ringFor(r(4),84+k));
    d.gold=2500+k*500+Math.floor(r(5)*2500);return items}
  return _lf.apply(this,arguments)}}
