/* ==========================================================================
   The tomb and the mounds: traps, secret doors, the sun discs and the great door, ambushes, loot, and Sut himself
   ========================================================================== */
const F_TRAPDMG=()=>Math.round(5+(LEVELS[LEVEL].diff||15)*.7);
function sunDiscCount(){let n=0;const m=G.flags.discs||0;for(let i=1;i<=4;i++)if(m&(1<<i))n++;return n}
function setSunDoor(){const n=sunDiscCount();for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(SUNDOOR_GIDS.includes(G.grid[y][x]))G.grid[y][x]=SUNDOOR_GIDS[n]}
function freeNear(x,y,rad,count){
  const out=[];
  for(let r=1;r<=rad&&out.length<count;r++)for(let dy=-r;dy<=r&&out.length<count;dy++)for(let dx=-r;dx<=r&&out.length<count;dx++){
    if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const nx=x+dx,ny=y+dy;
    if(nx<0||ny<0||nx>=MW||ny>=MH||G.grid[ny][nx]!==0||cellBlocked(nx,ny)||enemyAt(nx,ny)||(nx===G.P.x&&ny===G.P.y)||out.some(o=>o[0]===nx&&o[1]===ny))continue;
    out.push([nx,ny]);
  }
  return out;
}
function desertBump(nx,ny,g){
  if(TERR_BLOCK&&TERR_BLOCK[ny*MW+nx]){sfx('bump');msg('The mountainside is too steep to climb.','#d8c8a0');return true}
  { // the door in the side of a mound: walk into it
    const d=G.decor.find(q=>q.enter&&q.x===nx&&q.y===ny&&!q.found);
    if(d){sfx('door');goToLevel(d.enter.to,{x:d.enter.x,y:d.enter.y,f:d.enter.f});return true}
  }
  if(LEVEL!==42)return false;
  if(SUNDOOR_GIDS.includes(g)){
    const n=sunDiscCount();
    if(n>=4){
      for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(SUNDOOR_GIDS.includes(G.grid[y][x]))G.grid[y][x]=0;
      G.flags.sunDoor=1;sfx('door');G.shake=.5;msg('The four suns blaze. The great door grinds open, and cold air rolls out of the dark beyond.','#ffe9a0');later(320,endRound);return true;
    }
    sfx('locked');msg('The great door has four round sockets. '+(n===0?'All of them are empty.':n===1?'One holds a sun disc.':n+' hold sun discs.')+' Find '+(4-n)+' more.','#d8b878');return true;
  }
  const sec=(LEVEL42_DATA.secrets||[]).find(s=>s.x===nx&&s.y===ny);
  if(sec&&g>0&&!G.flags['sec_'+sec.id]){
    G.secBumps=G.secBumps||{};G.secBumps[sec.id]=(G.secBumps[sec.id]||0)+1;
    if(G.secBumps[sec.id]<2){sfx('bump');G.shake=.18;msg('You press the wall. It sounds hollow.','#e8d8a0');return true}
    G.grid[ny][nx]=0;G.flags['sec_'+sec.id]=1;sfx('door');G.shake=.4;msg('The wall swings inward on a hidden hinge!','#ffe9a0');later(320,endRound);return true;
  }
  return false;
}
function springTrap(d){
  d.opened=true;d.hidden=false;sfx('fire');G.shake=.7;
  msg('A plate clicks underfoot. Fire roars out of the walls!','#ff9a60');
  for(const i of livingHeroes()){
    const h=G.heroes[i],dmg=Math.max(2,F_TRAPDMG()+rnd(-3,4)-Math.floor(heroArmor(h)*.4));h.hp-=dmg;h.hurt=1;addFloat(portraitX(i)+19,250,'-'+dmg,'#ff8a4a');
    if(h.hp<=0){h.hp=0;h.alive=false;msg(HERO_DEF[i].name+' is burned down!','#ff8a7a');if(G.sel===i)nextHero()}
  }
}
function desertStep(nx,ny){
  if(LEVEL===42){const d=G.decor.find(q=>q.trap&&!q.opened&&q.x===nx&&q.y===ny);if(d)springTrap(d)}
}
function desertDisc(it){
  const n=+it.k.slice(7);G.flags.discs=(G.flags.discs||0)|(1<<n);it.taken=true;sfx('key');
  const c=sunDiscCount();msg('You lift the golden sun disc: sun disc '+n+' of 4. You have '+c+'.','#ffe070');setSunDoor();
  if(c>=4)msg('All four suns are yours. The great door in the Hall of Eternity will answer them.','#ffe9a0');
  if(n===4&&!G.flags.disc4Trap){G.flags.disc4Trap=1;msg('The sand stirs all round the pedestal. Bandaged shapes rise out of it!','#e8a090');for(const [x,y] of freeNear(it.x,it.y,3,3))addEnemy('mummy',x,y,true)}
}
function desertAmbush(d){
  d.ambushed=true;const spots=freeNear(d.x,d.y,2,d.ambush.length);
  d.ambush.forEach((t,i)=>{if(spots[i])addEnemy(t,spots[i][0],spots[i][1],true)});
  sfx('screech');msg('The lid grinds aside, and bandaged hands reach out of the dark!','#e8a090');
}
function desertLoot(d){
  if(LEVEL<41)return null;
  const r=k=>hash2(d.x,d.y,100+k),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
  const lv=LEVELS[LEVEL].diff||15,pick=a=>a[Math.floor(r(9)*a.length)],rings=['ringM','ringS','ringW','ringV'];
  if(d.k==='sarcoph'||d.k==='sarcophU'){d.gold=d.goldAmt||(60+Math.floor(r(1)*70)+lv*4);if(r(2)<.5)add('potion',1+(r(3)<.4?1:0));if(r(4)<.22)add(pick(DS_MAGIC_TOMB));else if(r(5)<.3)add(pick(rings));return items}
  if(/^vase\d$/.test(d.k)){d.gold=d.goldAmt||(10+Math.floor(r(1)*40)+lv);if(r(2)<.2)add('potion',1);else if(!d.plain&&r(3)<.12)add(pick(rings));return items}
  if(d.k==='treasure'){d.gold=d.goldAmt||(180+Math.floor(r(1)*220)+lv*8);add('potion',2);if(d.plain){}else if(r(2)<.55)add(pick(DS_MAGIC_TOMB));else add(pick(rings));return items}
  if(d.k==='offering'){d.gold=d.goldAmt||(30+Math.floor(r(1)*40));add('bread',2);add('potion',1);return items}
  if(d.k==='chest'){d.gold=d.goldAmt||(130+Math.floor(r(1)*160)+lv*3);add('potion',2);if(d.magic)add(d.magic);else if(r(2)<.45)add(pick(DS_MAGIC_TOMB));else add(pick(rings));add(foodFor(r(6)),1);return items}
  return null;
}
function desertApplyState(){
  if(LEVEL!==42)return;
  setSunDoor();
  for(const s of LEVEL42_DATA.secrets||[])if(G.flags['sec_'+s.id])G.grid[s.y][s.x]=0;
  if(G.flags.sunDoor)for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(SUNDOOR_GIDS.includes(G.grid[y][x]))G.grid[y][x]=0;
  if(G.flags.sutDead)G.grid[1][48]=31;
}
function sutDefeated(){G.flags.sutDead=1;G.grid[1][48]=31;sfx('door');startCut('sutDown')}
ENEMY_DEF.sut.act=function(e){ // when he is hurt, Sut calls the dead of his tomb to stand with him
  e.calls=(e.calls||0)+1;
  const mummies=G.enemies.filter(o=>o.hp>0&&o.t==='mummy'&&Math.abs(o.x-e.x)+Math.abs(o.y-e.y)<=14).length;
  if(e.calls%4===0&&e.hp<e.maxhp*.8&&mummies<5){
    const spots=freeNear(e.x,e.y,3,2);
    if(spots.length){for(const [x,y] of spots)addEnemy('mummy',x,y,true);sfx('screech');msg('Sut raises his sceptre, and the dead of his tomb rise at his call!','#ff9a80');return 700}
  }
  return 0;
};
Object.assign(CUTS,{
  sutRoom:()=>[
    {text:'The throne room is vast, and its ceiling is lost in a painted night of gold stars. Braziers burn along the pillars. At the far end, on a throne of red stone, a figure that has been sitting very still raises its head.'},
    {who:'Sut',text:'Who carries the four suns into the house of Sut? Who wakes the lord of the red desert?'},
    {who:hn(0),text:'Travellers. We only want the way through, old god. We have no quarrel with you.'},
    {who:'Sut',text:'Every traveller wanted only the way through. Their bones are in my floor.'},
    {who:hn(1),text:'Then we will be careful where we step.'},
    {who:hn(3),text:'And we are going to be very, very rich when this is over. Weapons up!'}],
  sutDown:()=>[
    {text:'The great god sinks to his knees, and the red light leaves his eyes. The sceptre rings once on the stone and is still. Then, in the north wall behind the throne, a seam of light opens, and a door is simply there, as though it had always been.'},
    {who:hn(1),text:'That door was not there a moment ago.'},
    {who:hn(0),text:"We are in the heart of Sut's tomb. The old stories say it was a prison as much as a grave, a place to hold the red god so that the sands would lie still."},
    {who:hn(2),text:'Then everything on the other side of that door is his country. Red sand as far as anyone has ever walked.'},
    {who:hn(3),text:'And somewhere out in that heat, a city. The caravan people always spoke of a golden city at the end of the red dunes.'},
    {text:'The door breathes warm air. The wind that comes through it smells of iron and dust.'}]});
/* one line of news each time the party enters a part of the tomb */
function tombStory(){
  const F=G.flags,x=G.P.x,y=G.P.y;
  if(y>=26&&y<=45&&x>=30&&x<=66&&!F.zHall){F.zHall=1;msg('The Hall of Eternity. Pillars, gold and lapis, and a great gold door in the north wall with four round sockets.','#e8d8a0')}
  if(x<22&&y>=28&&y<=42&&!F.zA){F.zA=1;msg('The Hall of Embers. The floor is scorched, and carved slabs lie across it in a pattern. Some have been fired before.','#e8c8a0')}
  if(x>=75&&y>=26&&y<=44&&!F.zB){F.zB=1;msg('The Crypt of Sarcophagi. And on the far wall one eye of gold, bright among the dull signs.','#e8d8a0')}
  if(x<=34&&y>=10&&y<=20&&!F.zC){F.zC=1;msg('The Chamber of Switches. At the far west end, three gold barriers close off a vault. The levers that raise them must be somewhere in this wing.','#e8d8a0')}
  if(x>=66&&y<=22&&!F.zD){F.zD=1;msg('The Sand Pit. Sand pours from the ceiling here, deep and dry, and something moves under it.','#e8c8a0')}
  if(y<=13&&x>=34&&x<=62&&!F.zSut&&!F.sutDead){F.zSut=1;startCut('sutRoom')}
}
