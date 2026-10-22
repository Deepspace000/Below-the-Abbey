/* ==========================================================================
   THE FOUR THIEVES OF THE MAZE (prefix hgdv / HGDV). One thief wanders each quarter of the labyrinth, outside the towns, and each lives in a lone house in a clearing of his own quarter.
   When the party is close he creeps up on them along the passages and shows as a red mark on the mini map. If he reaches the party and they have not turned to face him,
   he takes up to 500 gold and runs off with it (back home). If the party faces him in time, he is caught and the fight begins; kill him and the stolen gold comes back.
   A Thief, Ranger or Assassin in the party hears him coming and says so.
   Whenever the party is near his house, the thief is at home. Accuse him, and he tries to talk them out of it; if they keep to the accusation he gives back the gold he took from them.
   If the party has killed him, his house is empty and a chest there holds some of his gold.
   ========================================================================== */
ENEMY_DEF.hgthief={name:'Maze Thief',hp:140,dmg:[6,12],hit:.7,w:.44,img:'pickpocket',xp:420,gold:[0,0],speed:1.3,kind:'bandit'};
if(typeof NO_VARY!=='undefined')NO_VARY.push('hgthief');
const HGDV={agents:[],dec:null,map:null,blk:null};
const HGDV_NAMES=['Nimble Tam','Quick Ness','Silvertongue Hob','Magpie Jo'];
const hgdvF=()=>{const F=G.flags;F.hgdvLoot=F.hgdvLoot||{};F.hgdvDead=F.hgdvDead||{};F.hgdvAcc=F.hgdvAcc||{};return F};
function hgdvBuild(L){
  if(L._hgdv)return;const M=L._hgdm,W=M.W,P=L._hgdp,rows=L.rows,kind=M.kind,rnd=hgdmRng(475035),open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Set(L.decor.filter(d=>d.npc||d.opens||d.loot).concat(L.enemies).map(d=>d.x+','+d.y)); // only people, doors, chests and creatures stop a house; plain scenery in the footprint is cleared
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const safe=P.zones.filter(z=>z.type==='safe'),danger=P.zones.filter(z=>z.type==='danger'),bad=(x,y)=>safe.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+4)||danger.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+3);
  const roomOk=(x,y)=>{for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const k=(x+dx)+','+(y+dy);if(!open(x+dx,y+dy)||occ.has(k))return false}return reach.has(x+','+y)};
  const out=[],h=W>>1;
  for(let qi=0;qi<4;qi++){const x0=qi%2?h:0,y0=qi<2?0:h;let t=0;
    while(t++<9000){const x=x0+5+((rnd()*(h-10))|0),y=y0+5+((rnd()*(h-10))|0),lax=t>4000;if(!roomOk(x,y)||bad(x,y)||Math.hypot(x-L.start.x,y-L.start.y)<20)continue;
      if(out.some(o=>Math.hypot(o.house[0]-x,o.house[1]-y)<(lax?25:40)))continue;
      for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)occ.add((x+dx)+','+(y+dy));
      L.decor=L.decor.filter(d=>Math.abs(d.x-x)>2||Math.abs(d.y-y)>2);L.items=L.items.filter(d=>Math.abs(d.x-x)>2||Math.abs(d.y-y)>2);
      const id='hgdvt'+qi;
      L.decor.push({k:'hg_house'+(qi%3),x,y,block:true});
      L.decor.push({k:'pickpocket',x:x,y:y+1,block:false,walk:true,npc:'hgd_thf'+qi,sc:.72});
      L.decor.push({k:'pickpocket',x:x+1,y:y+1,block:false,walk:true,deco:true,thiefid:id,sc:.72});
      out.push({id,i:qi,house:[x,y],front:[x,y+1],chest:[x-1,y+1],chestOn:false,home:[x+1,y+1],cell:[x+1,y+1],tgt:null,f:0,wait:rnd()*3,mode:'wander',carry:0,warned:false,grace:0,gone:0,pt:0});break}}
  L._hgdv={agents:out}}
const HGDV_N=[[1,0],[-1,0],[0,1],[0,-1]];
// shortest way from a cell to the party through the open passages (breadth first, up to a limit); returns the next cell to step to
function hgdvStep(L,blk,from,to,lim){
  const key=(x,y)=>x+','+y,prev=new Map([[key(from[0],from[1]),null]]),qu=[[from[0],from[1],0]];
  for(let i=0;i<qu.length;i++){const [x,y,d]=qu[i];if(x===to[0]&&y===to[1]){let k=key(x,y),step=[x,y];while(prev.get(k)){step=k.split(',').map(Number);k=prev.get(k)}return {step,len:d}}
    if(d>=lim)continue;for(const [a,b] of HGDV_N){const nx=x+a,ny=y+b,k=key(nx,ny);if(prev.has(k)||!L.rows[ny]||L.rows[ny][nx]!=='.'||blk.has(k))continue;prev.set(k,key(x,y));qu.push([nx,ny,d+1])}}
  return null}
function hgdvAway(L,blk,from,fromP){ // a step that takes him farther from the party
  let best=null,bd=-1;for(const [a,b] of HGDV_N){const nx=from[0]+a,ny=from[1]+b,k=nx+','+ny;if(!L.rows[ny]||L.rows[ny][nx]!=='.'||blk.has(k))continue;const d=Math.abs(nx-fromP[0])+Math.abs(ny-fromP[1])+Math.random()*.5;if(d>bd){bd=d;best=[nx,ny]}}return best}
function hgdvHeard(a){
  if(a.warned)return;a.warned=true;
  const hi=G.heroes.findIndex((h,i)=>h.alive&&h.hp>0&&['Ranger','Thief','Assassin'].includes(HERO_DEF[i].cls));
  if(hi>=0)msg(HERO_DEF[hi].name+': "A thief is near, be on guard."','#e8d080')}
function hgdvFight(L,a,d,why){ // he is caught, and becomes a creature to fight
  const st=enemyStat('hgthief',lvlHere());
  const e={id:G.enemies.length,t:'hgthief',lvl:lvlHere(),x:a.cell[0],y:a.cell[1],rx:a.cell[0],ry:a.cell[1],hp:st.hp,maxhp:st.hp,alert:true,chilled:0,flash:0,lunge:0,dying:0,seed:Math.random()*10,sx:210,sy:100,hgdvId:a.id,hgdvI:a.i,carry:a.carry};
  G.enemies.push(e);d.x=-50;d.y=-50;d.ox=0;d.oy=0;a.mode='fighting';a.eid=e;
  msg(why||'You spin round and catch the thief! He draws a knife.','#ff9a80');sfx('hit')}
function hgdvSteal(L,a,d){
  const F=hgdvF(),take=Math.min(500,G.gold);a.carry+=take;G.gold-=take;F.hgdvLoot[a.i]=(F.hgdvLoot[a.i]||0)+take;
  if(take>0){msg('A hand slips into your purse! A thief takes '+take+' gold and runs off with it.','#ff7a6a');sfx('hit')}
  a.mode='flee';a.pt=0}
const hgdvNpcD=a=>G.decor&&G.decor.find(q=>q.npc==='hgd_thf'+a.i);
{const _u=update;update=function(dt){
  try{if(LEVEL===HGD.ID&&G.state==='play'&&G.decor){const L=LEVELS[HGD.ID];if(L&&L._hgdv){
    if(HGDV.dec!==G.decor){HGDV.dec=G.decor;HGDV.map=new Map();HGDV.blk=new Set(G.decor.filter(q=>q.block).map(q=>q.x+','+q.y))}
    const F=hgdvF(),busy=G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot,P=[G.P.x,G.P.y],fd=DIRS[G.P.f];
    for(const a of L._hgdv.agents){
      let d=HGDV.map.get(a.id);if(!d){d=G.decor.find(q=>q.thiefid===a.id);if(!d)continue;HGDV.map.set(a.id,d)}
      const nd=hgdvNpcD(a),show=on=>{if(nd){nd.x=on?a.front[0]:-50;nd.y=on?a.front[1]:-50}};
      if(F.hgdvDead[a.i]&&a.mode!=='dead'){a.mode='dead';d.x=-50;d.y=-50}
      if(a.mode==='dead'){show(false);
        if(!a.chestOn&&!G.decor.some(q=>q.hgdvChest===a.i)){a.chestOn=true;const c={k:'chest',x:a.chest[0],y:a.chest[1],block:true,loot:true,hgdvChest:a.i};G.decor.push(c);HGDV.blk.add(c.x+','+c.y);if(G.dmap&&G.dmap.add)G.dmap.add(c.y*MW+c.x)}
        continue}
      if(a.mode==='fighting'){ // the creature on the floor has the fight; when it is gone he is dead, or the party fled and he goes back to wandering
        show(false);
        if(!a.eid||a.eid.hp<=0){F.hgdvDead[a.i]=1;a.mode='dead';d.x=-50;d.y=-50;continue}
        if(Math.abs(a.eid.x-G.P.x)+Math.abs(a.eid.y-G.P.y)>14){G.enemies=G.enemies.filter(e=>e!==a.eid);a.carry=a.eid.carry;a.mode='wander';a.cell=a.home.slice();a.tgt=null;d.x=a.cell[0];d.y=a.cell[1];a.eid=null;a.warned=false}
        continue}
      // at home whenever the party is near his house
      const hd=Math.hypot(a.house[0]-P[0],a.house[1]-P[1]);
      if(a.mode==='home'){if(hd>16){a.mode='wander';a.cell=a.home.slice();a.tgt=null;a.warned=false;show(false);d.x=a.cell[0];d.y=a.cell[1];d.ox=0;d.oy=0}else{show(true);d.x=-50;d.y=-50;continue}}
      else if(hd<=10&&(a.mode==='wander'||a.mode==='gone')){a.mode='home';a.carry=0;a.tgt=null;show(true);d.x=-50;d.y=-50;continue}
      if(a.mode==='gone'){a.gone-=dt;if(a.gone<=0){a.mode='wander';a.cell=a.home.slice();a.tgt=null;a.warned=false;d.x=a.cell[0];d.y=a.cell[1];d.ox=0;d.oy=0}continue}
      show(false);
      const dist=Math.abs(a.cell[0]-P[0])+Math.abs(a.cell[1]-P[1]);
      if(a.mode==='flee'){ // takes the money and runs, then is out of sight for a good while (the gold is at his house)
        a.pt+=dt;if(!a.tgt){const n=hgdvAway(L,HGDV.blk,a.cell,P);if(!n){a.mode='gone';a.carry=0;a.gone=60;d.x=-50;d.y=-50;continue}a.tgt=n;a.f=0}
        a.f+=dt*3.2;if(a.f>=1){a.cell=a.tgt;a.tgt=null;a.f=0;d.x=a.cell[0];d.y=a.cell[1];d.ox=0;d.oy=0}else{d.x=a.cell[0];d.y=a.cell[1];d.ox=(a.tgt[0]-a.cell[0])*a.f;d.oy=(a.tgt[1]-a.cell[1])*a.f}
        if(dist>16||a.pt>14){a.mode='gone';a.carry=0;a.gone=75;a.tgt=null;d.x=-50;d.y=-50}continue}
      // is the party facing him, close by, with a clear line?
      let faced=false;for(let k=1;k<=3;k++){const x=P[0]+fd[0]*k,y=P[1]+fd[1]*k;if(!L.rows[y]||L.rows[y][x]!=='.')break;if(x===a.cell[0]&&y===a.cell[1]){faced=true;break}}
      if(dist<=8&&G.gold>0)hgdvHeard(a);else if(dist>12)a.warned=false;
      if(busy)continue;
      if(faced&&(a.mode==='stalk'||dist<=2)){hgdvFight(L,a,d);continue}
      if(G.gold>0&&dist<=14){ // creep up on the party
        a.mode='stalk';
        if(dist<=1){ // right behind them: a short moment to turn round
          a.grace+=dt;if(a.grace>=1.3){hgdvSteal(L,a,d);a.grace=0}continue}
        a.grace=0;
        if(!a.tgt){const r=hgdvStep(L,HGDV.blk,a.cell,P,26);if(!r||r.step[0]===P[0]&&r.step[1]===P[1]){continue}a.tgt=r.step;a.f=0}
        a.f+=dt*2.2;if(a.f>=1){a.cell=a.tgt;a.tgt=null;a.f=0;d.x=a.cell[0];d.y=a.cell[1];d.ox=0;d.oy=0}else{d.x=a.cell[0];d.y=a.cell[1];d.ox=(a.tgt[0]-a.cell[0])*a.f;d.oy=(a.tgt[1]-a.cell[1])*a.f}
        continue}
      // otherwise he wanders slowly round his quarter
      if(a.mode==='stalk'){a.mode='wander';a.tgt=null;a.grace=0}
      if(!a.tgt){a.wait-=dt;if(a.wait>0)continue;
        const opts=HGDV_N.map(([x,y])=>[a.cell[0]+x,a.cell[1]+y]).filter(([x,y])=>L.rows[y]&&L.rows[y][x]==='.'&&!HGDV.blk.has(x+','+y)&&Math.hypot(x-a.home[0],y-a.home[1])<=30);
        if(!opts.length){a.wait=2;continue}
        let pick=null;if(a.prev){const sx=a.cell[0]+a.prev[0],sy=a.cell[1]+a.prev[1];if(opts.some(o=>o[0]===sx&&o[1]===sy)&&Math.random()<.8)pick=[sx,sy]}
        if(!pick)pick=opts[(Math.random()*opts.length)|0];a.prev=[pick[0]-a.cell[0],pick[1]-a.cell[1]];a.tgt=pick;a.f=0}
      a.f+=dt*.9;if(a.f>=1){a.cell=a.tgt;a.tgt=null;a.f=0;a.wait=.2;d.x=a.cell[0];d.y=a.cell[1];d.ox=0;d.oy=0}else{d.x=a.cell[0];d.y=a.cell[1];d.ox=(a.tgt[0]-a.cell[0])*a.f;d.oy=(a.tgt[1]-a.cell[1])*a.f}}}}}catch(e){console.error('hgdv',e)}
  return _u.apply(this,arguments)}}
// kill one and the gold he is carrying comes back
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;_he.apply(this,arguments);if(was&&e.hp<=0&&e.t==='hgthief'){const F=hgdvF();
  if(e.hgdvI!==undefined)F.hgdvDead[e.hgdvI]=1;
  if(e.carry>0){G.gold+=e.carry;if(e.hgdvI!==undefined)F.hgdvLoot[e.hgdvI]=Math.max(0,(F.hgdvLoot[e.hgdvI]||0)-e.carry);msg('The thief drops '+e.carry+' gold. It is yours again.','#ffe9a0');e.carry=0}}}}
// the chest in an empty house: some of his own gold, and whatever of the party's gold he still had
{const _lf=lootFor;lootFor=function(d){if(LEVEL===HGD.ID&&d&&d.hgdvChest!==undefined){const F=hgdvF(),i=d.hgdvChest;d.gold=300+i*60+(F.hgdvLoot[i]||0);F.hgdvLoot[i]=0;return []}return _lf.apply(this,arguments)}}
/* ---------- the four thieves at home: they try to talk the party out of it ---------- */
const HGDV_EXCUSE=[
 ['Me? I have not left this house in a month. Ask the cat.','Look at these hands. They shake. Do they look like the hands of a thief to you?','A hundred people wear a hood in this maze. You pick me because I have a roof?'],
 ['A thief? In this maze? Dreadful. And you think it was me, simply because I live alone in a clearing?','If I had so much gold, would I live in a house this small?','You have no proof. A maze is full of strangers. Ask yourselves who really gains by this talk.'],
 ['I am a quiet man. I water my beans. I do not rob travellers.','You are tired and cross, that is all. Sit down. Have a biscuit. Forget it.','Do you not see? You are being unkind to a poor old householder.'],
 ['Gold? What gold? I never saw any gold. I had a very dull day.','Is it not strange how a thief always has a good story? And so do I, because I am honest!','Think how foolish you will feel when you find out it was somebody else.']];
function hgdvTalk(i,d){
  const F=hgdvF(),a=LEVELS[HGD.ID]._hgdv.agents[i],name=HGDV_NAMES[i];
  const att=()=>{a.carry=F.hgdvLoot[i]||0;a.cell=a.front.slice();const dd=HGDV.map&&HGDV.map.get(a.id)||{};hgdvFight(LEVELS[HGD.ID],a,dd,name+' grabs a knife and the fight is on.');const nd=hgdvNpcD(a);if(nd){nd.x=-50;nd.y=-50}return null};
  const round=r=>{const sum=F.hgdvLoot[i]||0;
    if(r>=3){F.hgdvAcc[i]=0;F.hgdvLoot[i]=0;G.gold+=sum;sfx('key');
      return hgdvPlain('Oh, very well! It was me! Here, '+sum+' gold, every coin. You have a stubborn streak, and I admire it. Now please go away.',[['Thank you.',()=>null]])}
    return hgdvPlain(HGDV_EXCUSE[i][r],[['I stand by it. It was you.',()=>round(r+1)],['Maybe I was wrong.',()=>{F.hgdvAcc[i]=0;return hgdvPlain('There! A sensible friend. Off you go, and think twice before you accuse an honest man.',[BYE],()=>start())}]])};
  const start=()=>{const sum=F.hgdvLoot[i]||0;
    const opts=[];
    if(sum>0)opts.push(['You are the thief who robbed us.',()=>round(0)]);else opts.push(['Is it true you are a thief?',()=>hgdvPlain('A thief? Me? Who has been robbed? Nobody here, I see. Ha! Rumours.',[BYE],()=>start())]);
    opts.push(['Draw your knife.',att]);opts.push(BYE);
    return hgdvPlain('Welcome to my little house, strangers. '+(sum>0?'You look as if you have lost something.':'Mind the beans.'),opts,()=>start())};
  return start()}
function hgdvPlain(text,opts,again){const nd=say(text,opts.slice());return nd}
for(let i=0;i<4;i++)khNpc('hgd_thf'+i,HGDV_NAMES[i],'pickpocket',d=>hgdvTalk(i,d));
// the red marks on the mini map
{const _m=drawMinimap;drawMinimap=function(x,y,w,h){_m.apply(this,arguments);
  try{if(LEVEL===HGD.ID&&G.state==='play'){const L=LEVELS[HGD.ID];if(L&&L._hgdv){const cs=4.6*MMZ(),ox=x+w/2-(G.C.x+.5)*cs,oy=y+h/2-(G.C.y+.5)*cs;
    ctx.save();ctx.beginPath();ctx.rect(x+2,y+2,w-4,h-4);ctx.clip();
    for(const a of L._hgdv.agents){if(a.mode==='dead'||a.mode==='gone'||a.mode==='fighting'||a.mode==='home')continue;const d=HGDV.map&&HGDV.map.get(a.id);if(!d)continue;
      const px=ox+(d.x+(d.ox||0)+.5)*cs,py=oy+(d.y+(d.oy||0)+.5)*cs;if(px<x||px>x+w||py<y||py>y+h)continue;
      ctx.fillStyle='#e03a2a';ctx.strokeStyle='#ffe9a0';ctx.lineWidth=1;ctx.beginPath();ctx.arc(px,py,cs*.62,0,TAU);ctx.fill();ctx.stroke();
      ctx.fillStyle='#1a0a06';ctx.fillRect(px-1.3,py-1.6,2.6,1.2)}
    ctx.restore()}}}catch(e){}}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('Four thieves wander the labyrinth, one in each quarter, and each has a lone house in a clearing. They creep up behind you. Turn round and face one before he reaches you, or he will have up to 500 gold.');
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdk)try{hgdvBuild(L)}catch(e){console.error('hgdv',e)}}}
