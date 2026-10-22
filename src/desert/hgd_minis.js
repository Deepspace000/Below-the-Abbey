/* ==========================================================================
   THE WANDERING MINI BOSSES OF THE MAZE (prefix hgdm2 / HGDM2). Six huge burning spheres roam the labyrinth, never into a town. Each is a big creature with a lot of health.
   They show on the mini map (an orange ringed mark, from far off) so they can be seen coming and avoided. One that notices the party chases, but slower than the party can walk;
   if the party gets far enough away, it loses them and goes back to wandering. If it catches the party, it attacks.
   ========================================================================== */
Object.assign(ENEMY_DEF,{
  hgmini0:{name:'Great Molten Sphere',hp:900,dmg:[22,36],hit:.8,w:2.4,img:'art_hgfire0',xp:1400,gold:[90,220],speed:1,verb:'scorches',mini:1},
  hgmini1:{name:'White-Hot Sphere',hp:760,dmg:[20,32],hit:.82,w:2.2,img:'art_hgfire1',xp:1250,gold:[80,200],speed:1,verb:'sears',mini:1},
  hgmini2:{name:'Crimson Inferno Sphere',hp:1000,dmg:[18,30],hit:.78,w:2.5,img:'art_hgfire2',xp:1300,gold:[80,200],speed:1,verb:'burns',mini:1},
  hgmini3:{name:'Blue Flame Sphere',hp:700,dmg:[24,38],hit:.84,w:2.2,img:'art_hgfire3',xp:1350,gold:[90,210],speed:1,verb:'singes',mini:1},
  hgmini4:{name:'Green Fire Sphere',hp:950,dmg:[21,34],hit:.8,w:2.5,img:'art_hgfire4',xp:1450,gold:[100,230],speed:1,verb:'blazes at',mini:1},
  hgmini5:{name:'Cinder-Core Sphere',hp:1100,dmg:[23,36],hit:.8,w:2.6,img:'art_hgfire5',xp:1500,gold:[100,240],speed:1,verb:'chars',mini:1}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('hgmini0','hgmini1','hgmini2','hgmini3','hgmini4','hgmini5');
function hgdm2Build(L){
  if(L._hgdm2)return;const M=L._hgdm,W=M.W,P=L._hgdp,rows=L.rows,rnd=hgdmRng(475041),open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Set(L.decor.filter(d=>d.block).concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const safe=P.zones.filter(z=>z.type==='safe'),near=(x,y)=>safe.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+10);
  const homes=[[40,40],[160,40],[40,160],[160,160],[100,100],[100,60]],out=[];
  homes.forEach((hc,i)=>{let t=0;while(t++<8000){const r=t<4000?28:60,x=hc[0]+(((rnd()*2-1)*r)|0),y=hc[1]+(((rnd()*2-1)*r)|0);
    if(!open(x,y)||!reach.has(x+','+y)||occ.has(x+','+y)||near(x,y)||Math.hypot(x-L.start.x,y-L.start.y)<35||out.some(o=>Math.hypot(o[0]-x,o[1]-y)<30))continue;
    occ.add(x+','+y);L.enemies.push({t:'hgmini'+i,x,y});out.push([x,y]);break}});
  L._hgdm2={homes:out}}
// the way of these creatures: they wander on their own, notice the party only when close, chase slower than the party walks, and give up when left behind
{const _ea=enemyAct;enemyAct=function(e){
  const def=ENEMY_DEF[e.t];if(!def||!def.mini||e.chilled>0||(e.st&&typeof mxEnemyAct==='function'))return _ea.apply(this,arguments);
  const L=LEVELS[LEVEL],dist=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
  if(e.hx===undefined){e.hx=e.x;e.hy=e.y}
  if(!e.alert){
    if(dist<=5&&(hasLOS(e.x,e.y,G.P.x,G.P.y)||dist<=3)){e.alert=true;sfx('growl');msg('The '+def.name+' has noticed you!','#ff9a7a');return 200}
    // a slow wander: mostly straight on, never into a town, never far from where it started
    if(G.rounds%2)return 0;
    const safe=(L&&L._hgdp)?L._hgdp.zones.filter(z=>z.type==='safe'):[];
    const opts=DIRS.map(d=>[e.x+d[0],e.y+d[1]]).filter(([x,y])=>!cellBlocked(x,y)&&!enemyAt(x,y)&&!(x===G.P.x&&y===G.P.y)&&Math.hypot(x-e.hx,y-e.hy)<=45&&!safe.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+4));
    if(!opts.length)return 0;
    let pick=null;if(e.pv){const sx=e.x+e.pv[0],sy=e.y+e.pv[1];if(opts.some(o=>o[0]===sx&&o[1]===sy)&&Math.random()<.85)pick=[sx,sy]}
    if(!pick)pick=opts[(Math.random()*opts.length)|0];e.pv=[pick[0]-e.x,pick[1]-e.y];e.x=pick[0];e.y=pick[1];return dist<=12?130:0}
  if(dist>9){e.alert=false;e.pv=null;return 0} // lost the party
  if(dist>1&&(G.rounds+e.id)%3===0)return 0; // slower than the party: it gets no step one round in three
  return _ea.apply(this,arguments)}}
// the marks on the mini map: seen from far off, so they can be avoided
{const _m=drawMinimap;drawMinimap=function(x,y,w,h){_m.apply(this,arguments);
  try{if(LEVEL===HGD.ID&&G.state==='play'){const cs=4.6,ox=x+w/2-(G.C.x+.5)*cs,oy=y+h/2-(G.C.y+.5)*cs;
    ctx.save();ctx.beginPath();ctx.rect(x+2,y+2,w-4,h-4);ctx.clip();
    for(const e of G.enemies){const def=ENEMY_DEF[e.t];if(e.hp<=0||!def||!def.mini)continue;
      const px=ox+(e.rx+.5)*cs,py=oy+(e.ry+.5)*cs;if(px<x-6||px>x+w+6||py<y-6||py>y+h+6)continue;
      ctx.fillStyle='#e8701a';ctx.strokeStyle='#fff2c0';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(px,py,cs*.95,0,TAU);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#3a1204';ctx.lineWidth=1;ctx.beginPath();ctx.arc(px,py,cs*.45,0,TAU);ctx.stroke()}
    ctx.restore()}}catch(e){}}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('Six huge burning spheres roam the maze. They show on your map as big orange rings. They are slower than you, and they lose you if you get far enough away.');
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdv)try{hgdm2Build(L)}catch(e){console.error('hgdm2',e)}}}

/* ---------- the quest: kill all six spheres. Cinder the ember warden of Gildmere gives it; the reward is a weapon, the Sunfire Blade ---------- */
ITEMDEF.hgsunblade={n:'Sunfire Blade',k:'weapon',t:'Sword',ic:'sword',c:'#ff8a2a',dmg:[260,380],hit:.15,req:{str:55},lvl:65,price:60000,rar:1,eff:{bossdmg:.3},dbl:.15,sw:.44,d:'A sword that glows like a sphere of fire, made from the burning spheres of the maze. Bosses take 30% more from its blows. Needs level 65.'};
QUESTS.hgsph={title:'Six Burning Spheres',who:'Cinder, the ember warden',desc:'Six huge burning spheres roam the Deeper Hollow. Kill all six: the molten, the white-hot, the crimson, the blue, the green and the cinder-core sphere. They show on the mini map as big orange rings.',need:6,goal:()=>Object.keys(G.flags.hgdSph||{}).length,reward:{gold:12000,xp:60000,items:['hgsunblade']}};
QAREA.hgsph='The Deeper Hollow';
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;_he.apply(this,arguments);if(was&&e.hp<=0&&/^hgmini\d$/.test(e.t)){G.flags.hgdSph=G.flags.hgdSph||{};G.flags.hgdSph[e.t]=1}}}
khNpc('hgd_cinder','Cinder, the ember warden','hg_npc5',d=>{
  const nodeFn=()=>{
    if(qSt('hgsph')==='done')return hgdNode('The maze is cooler for it. Keep the blade bright.',[BYE],nodeFn);
    const n=qNode('hgsph',{offer:'Six great spheres of fire drift through the maze. They are slow, but there is nothing slow about what they do to a party. Kill all six, and the Sunfire Blade is yours. Watch your map: they show as big orange rings.',accept:'Keep an eye on the map. If one starts to chase you, walk away. It loses you in the end.',remind:(g,nn)=>QUESTS.hgsph.desc+' ('+g+' of '+nn+'.)',ready:'All six are out! The air is lighter already.',thanks:'Take the blade. It was made from the same fire.',after:'The maze is cooler for it.'});
    n.text=hgdSay(n.text);return n};return nodeFn()},{q:['hgsph']});
function hgdm2PlaceQ(L){
  if(L._hgdm2q)return;const M=L._hgdm,P=L._hgdp,rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.',occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const z=P.zones.find(q=>q.name==='Gildmere');if(!z)return;
  for(let r=1;r<9;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=z.x+dx,y=z.y+dy;if(!open(x,y)||occ.has(x+','+y))continue;
    let all=true;for(let ay=-1;ay<=1;ay++)for(let ax=-1;ax<=1;ax++)if(!open(x+ax,y+ay)||(occ.has((x+ax)+','+(y+ay))&&!(ax===0&&ay===0)))all=false;if(!all)continue;
    L.decor.push({k:'hg_npc5',x,y,block:true,npc:'hgd_cinder',sc:.72});L._hgdm2q=[x,y];return}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdm2)try{hgdm2PlaceQ(L)}catch(e){console.error('hgdm2q',e)}}}
