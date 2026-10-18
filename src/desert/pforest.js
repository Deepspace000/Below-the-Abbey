/* ==========================================================================
   THE WOODS OF THE PILGRIM'S PATH. The trees along the path are real woods you can walk into: narrow trails wind off the road between the trunks, for no reason but to
   explore. Squirrels and rabbits run about, deer step through the trees, bees drift over the flowers, and now and then a wolf waits on a trail and attacks.
   Twenty small, dark caves are hidden in the trees at the back, each with a rock face and a door. Some hold treasure, some gems, some wolves, some outcasts, and
   three hold a fugitive with a quest.
   ========================================================================== */
const PF_CAVE0=7100,PF_CAVES=20;
const PF_SEGS=[1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20,21]; // the stretch of the path that hides each cave
const PF_KINDS=['wolves','treasure','outcast','gems','fugitive','treasure','wolves','gems','outcast','fugitive','treasure','wolves','gems','outcast','treasure','fugitive','gems','wolves','outcast','treasure'];
const PF_NAMES=['The Wolf Hollow','The Root Cellar','The Outcast’s Den','The Glittering Crack','The Fugitive’s Cave','The Old Smuggler’s Hole','The Grey Den','The Gem Crack','The Hermit’s Burrow','The Runaway’s Cave','The Buried Hoard','The Howling Cave','The Crystal Hollow','The Ragged Man’s Cave','The Moss Chest Cave','The Hunted Man’s Cave','The Glimmer Pocket','The Wolf Mother’s Den','The Beggar’s Cave','The Forgotten Strongbox'];
PF_NAMES.forEach((n,i)=>LEVEL_NAMES[PF_CAVE0+i]=n);
if(QAREA_ORDER.indexOf('The Pilgrim’s Path')<0)QAREA_ORDER.splice(QAREA_ORDER.indexOf('Elsewhere'),0,'The Pilgrim’s Path');
const PF_ENT={}; // cave index -> where its door stands on the path: {n,x,y}
/* ---------- the trails ---------- */
function pfSet(L,x,y,c){const r=L.rows[y];if(r&&x>=0&&x<r.length)L.rows[y]=r.slice(0,x)+c+r.slice(x+1)}
function pfPrep(n){
  const L=LEVELS[n];if(!L||L._pf||!L.rows||!L.decor)return;L._pf=1;
  const W=L.rows[0].length,H=L.rows.length,s=n-LP.BASE,hs=hash2;
  const isTree=d=>!d.npc&&/^[lp]tree\d/.test(d.k),trees=new Map(); // blocking trees and the soft, walk-through ones that fill out the woods
  for(const d of L.decor)if(isTree(d)){const k=d.x+','+d.y;if(!trees.has(k))trees.set(k,[]);trees.get(k).push(d)}
  if(trees.size<400)return;const blk=new Set(L.decor.filter(d=>d.block&&isTree(d)).map(d=>d.x+','+d.y));
  const walk=(x,y)=>x>=3&&y>=3&&x<W-6&&y<H-3&&L.rows[y][x]==='.';
  const clear=new Set(),trails=[],st=L.start||{x:0,y:0};
  const cut=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const l=trees.get((x+dx)+','+(y+dy));if(l)for(const d of l)clear.add(d)}};
  const carve=(x0,y0,dx,dy,len,seed,cells)=>{ // a winding trail, two squares wide, that stops at rock or water
    let x=x0,y=y0;
    for(let i=0;i<len;i++){
      if(!walk(x,y)||!walk(x,y+1))break;
      cells.push([x,y]);cut(x,y);cut(x,y+1);
      if(i%3===2){const r=hs(seed,i,610);if(dx!==0)y+=r<.3?-1:r<.6?1:0;else x+=r<.3?-1:r<.6?1:0}
      x+=dx;y+=dy;
    }};
  for(let y=150,k=0;y<H-150;k++,y+=22+((hs(s,k,601)*12)|0)){
    if(Math.abs(y-st.y)<8)continue;
    let e=-1;for(let x=56;x<W-8;x++){if(blk.has(x+','+y)){e=x;break}}
    if(e<60||!walk(e-1,y))continue;
    const cells=[];carve(e-1,y,1,0,14+((hs(s,k,602)*24)|0),s*1000+k,cells);
    if(cells.length<6)continue;
    trails.push({y,cells});
    if(hs(s,k,603)<.5&&cells.length>12){ // a side trail
      const m=cells[(cells.length*.55)|0],sgn=hs(s,k,604)<.5?-1:1,c2=[];carve(m[0],m[1]+(sgn>0?2:-1),0,sgn,6+((hs(s,k,605)*8)|0),s*1000+k+500,c2);if(c2.length)trails.push({y:m[1],cells:c2,side:1})}
  }
  // wolves: now and then one waits deep on a trail
  L.enemies=L.enemies||[];
  trails.forEach((t,i)=>{if(t.side||i%8!==3||t.cells.length<16)return;const c=t.cells[(t.cells.length*.8)|0];if(Math.abs(c[1]-st.y)>30)L.enemies.push({t:'wolf',x:c[0],y:c[1]})});
  // a cave hidden at the end of one trail in this stretch
  const ci=PF_SEGS.indexOf(s);
  if(ci>=0){
    const rock=pfRock(L);
    placing:for(const t of trails.filter(t=>!t.side).sort((a,b)=>b.cells.length-a.cells.length)){
      for(let i=t.cells.length-1;i>=5;i--){const [xe,ye]=t.cells[i];if(xe>W-12)continue;
        let ok=walk(xe,ye);for(let dy=-1;dy<=1&&ok;dy++)for(let dx=1;dx<=3;dx++)if(!walk(xe+dx,ye+dy)||L.decor.some(d=>d.npc&&Math.abs(d.x-(xe+dx))<2&&Math.abs(d.y-(ye+dy))<2))ok=false;
        if(!ok)continue;
        for(let dy=-1;dy<=1;dy++)for(let dx=1;dx<=3;dx++){cut(xe+dx,ye+dy);cut(xe+dx+1,ye+dy)}
        for(let dy=-1;dy<=1;dy++)for(let dx=1;dx<=3;dx++)pfSet(L,xe+dx,ye+dy,rock);
        pfSet(L,xe+1,ye,pfDoor(L,ci));PF_ENT[ci]={n,x:xe,y:ye};L._cave=ci;if(typeof wdThicket==='function')wdThicket(L,n,xe,ye,PF_CAVE0+ci);break placing}
    }
  }
  for(const d of clear){d.block=false;d.sc=.0001;d.pfCut=1} // the trees on a trail are made invisible, not removed, so saved decor keeps its places in the list
  L.enemies=L.enemies.filter(e=>e.t!=='wolf'||(L.rows[e.y]&&L.rows[e.y][e.x]==='.'));
}
loadImg('pf_rock','assets/pf_rock.jpg');
function pfRockGid(wh,inside){ // a rough, dark, painted cave rock wall of the given height
  const k=inside?'pfrockin':'pfrock';
  if(!OH_STY[k])OH_STY[k]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'pf_rock',zoom:1,contrast:1.25,tint:inside?[190,186,182,0]:[250,246,240,0]});
  return ohTiles().make('plain',k,wh).gid}
function pfRock(L){ // the rough rock face of a cave mouth
  L.chars=L.chars||{};if(L._pfRock)return L._pfRock;
  const gid=pfRockGid(L.ceilH||5.2),c=String.fromCharCode(0x2c0);L.chars[c]=gid;return L._pfRock=c}
function pfDoor(L,ci){ // the door into the cave: a dark opening in the rock
  L.chars=L.chars||{};const dgid=KH_NEXT_GID++;T_TILE[dgid]=T_DOORS.cave;KH_DOOR[dgid]={lvl:PF_CAVE0+ci,at:{x:8,y:12,f:0}};
  const c=String.fromCharCode(0x2d0+ci);L.chars[c]=dgid;return c}
{const _ll=loadLevel;loadLevel=function(n){try{if(n>=LP.BASE&&n<LP.BASE+LP.N){if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();pfPrep(n)}}catch(x){console.error(x)}return _ll.apply(this,arguments)}}
{const _g=goToLevel;goToLevel=function(n,e){try{if(n>=LP.BASE&&n<LP.BASE+LP.N-0){if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();pfPrep(n)}}catch(x){console.error(x)}return _g.apply(this,arguments)}}
/* ---------- the caves ---------- */
const PF_OUTCAST=[ // [name, face, what they say, gift]
 ['A ragged hermit','kh_ohfolk6_3','Shh. I came here when the village decided I was bad luck. It is warm enough, and nobody asks about the goat. Mind the wolves, they like the pilgrims better than they like me.','potion'],
 ['An outcast','kh_ohfolk7_1','I was a tax-collector, once. Now I collect mushrooms, and I am much better liked. If you are looking for gems, try the cracks in the rock. The wolves guard the best ones.','bread'],
 ['A lonely woman','kh_ohfolk1_0','They say I am a witch because the cat talks to me. The cat does not talk. The cat is rude. You are welcome to sit, if you do not mind a lot of cat.','cheese'],
 ['A man in rags','kh_ohfolk5_3','Do not look at me like that, I was a respectable man. A bad winter, a bad harvest, a bad word to the wrong lord. Walk on, friend, and be kind to the next one you find in a cave.','apple']];
PF_OUTCAST.forEach(([nm,face,line,gift],i)=>khNpc('pf_out'+i,nm,face,()=>{const F=G.flags;if(!F['pfg'+i]){F['pfg'+i]=1;try{bagAdd(mkItem(gift));msg(`${nm} presses something into your hand.`,'#ffe9a0')}catch(e){}}return say(line,[BYE])}));
const PF_FUG=[
 {id:'pf1',who:'Wulf, a runaway',face:'kh_ohfolk3_3',title:'Bread for the Fugitive',need:3,item:'bread',what:'loaves of bread',reward:{gold:450,xp:4500},
  offer:'Quiet. Please. I have run from the lord’s men for six days, and I have not eaten since the river. I cannot go out to the road. If you could bring me three loaves of bread, I would be in your debt for life.',accept:'Three loaves. Bless you. I will be here. I am always here.',
  thanks:'Bread! Real bread! Take this, it is all I have left, and tell nobody about me.',after:'I will sleep tonight. Thank you.'},
 {id:'pf2',who:'Mara, a runaway',face:'kh_ohfolk2_3',title:'Medicine for the Runaway',need:2,item:'potion',what:'healing potions',reward:{gold:500,xp:5000},
  offer:'My brother was hurt getting us out of the keep. He is in the back of the cave, and he will not wake. I have no money, only a name I cannot give you. Two healing potions would save him.',accept:'Two potions. I will wait with him. Please be quick.',
  thanks:'He opened his eyes! Thank you, thank you. I will remember this.',after:'He is sitting up and complaining about the soup. That is a good sign.'},
 {id:'pf3',who:'Old Brannic, a prisoner escaped',face:'kh_ohfolk5_2',title:'A Pick for the Prisoner',need:2,item:'lockpick',what:'lock picks',reward:{gold:550,xp:5500},
  offer:'I got out of the lord’s cells with a bent nail. There is still a chain on my leg, and the lock is a clever one. Two lock picks and I could be walking free by morning. I would pay if I had a coin. I have a story, which is worth less.',accept:'Two lock picks. A trader on the road will sell you them.',
  thanks:'Click. Click. There! Free of it. Here, take what I have, and walk well.',after:'I am walking tomorrow, with no chain at all.'}];
PF_FUG.forEach(f=>{
  monq(f.id,f.title,f.who,`${f.who.split(',')[0]} hides in a cave in the woods of the Pilgrim’s Path. Bring ${f.need} ${f.what}.`,f.need,()=>Math.min(f.need,bagCount(f.item)),f.reward,{take:{[f.item]:f.need}});QAREA[f.id]='The Pilgrim’s Path';
  khNpc('pf_f'+f.id,f.who,f.face,()=>qNode(f.id,khQD(f.offer,f.accept,(g,n)=>`${g} of ${n} ${f.what}.`,`You have the ${f.what}? Oh, thank you.`,f.thanks,f.after,'Here they are.')),{q:f.id});
});
function pfCaveBuild(ci){
  const W=17,H=15,kind=PF_KINDS[ci],hs=hash2,sd=ci*17+5,g=[];
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  let x=8,y=H-3;const cells=[];
  const carve=(a,b)=>{if(a>=2&&b>=2&&a<=W-3&&b<=H-3&&g[b][a]==='#'){g[b][a]='.';cells.push([a,b])}};
  carve(x,y);
  for(let i=0;i<190;i++){const r=hs(sd,i,701);if(r<.45)y--;else if(r<.6)y++;else if(r<.8)x--;else x++;x=Math.max(2,Math.min(W-3,x));y=Math.max(2,Math.min(H-3,y));carve(x,y);if(hs(sd,i,702)<.1){carve(x+1,y);carve(x,y+1);carve(x+1,y+1)}}
  const door=String.fromCharCode(0x2f0);g[H-2][8]=door;g[H-3][8]='.';
  const d=new Int16Array(W*H).fill(-1),q=[8+(H-3)*W];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],cx=c%W,cy=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}
  const open=cells.filter(([a,b])=>d[b*W+a]>3).sort((a,b)=>d[b[1]*W+b[0]]-d[a[1]*W+a[0]]);
  const used=new Set(['8,'+(H-3)]),pick=i=>{for(let t=0;t<open.length;t++){const c=open[(i*7+t*3)%open.length];if(!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);return c}}return null};
  const far=open[0]||[8,H-4],decor=[],enemies=[],items=[];used.add(far[0]+','+far[1]);
  const seg=LEVELS[LP.BASE+PF_SEGS[ci]],diff=(seg&&seg.diff)||25;
  {const bc=pick(1)||[9,10];decor.push({k:'bones',x:bc[0],y:bc[1],block:false})}
  const gold=220+ci*30;
  if(kind==='treasure'){decor.push({k:'chest',x:far[0],y:far[1],block:true,goldAmt:gold});const c=pick(2);if(c)items.push({k:'potion',x:c[0],y:c[1]});const b=pick(3);if(b)decor.push({k:'barrel',x:b[0],y:b[1],block:true})}
  else if(kind==='gems'){const base=Math.min(34,6+Math.round(diff*.35));for(let i=0;i<6;i++){const c=pick(10+i);if(!c)break;const gm=GEM_BY_VALUE[Math.min(39,base+((hs(sd,i,710)*6)|0))];items.push({k:'gem_'+gm[0],x:c[0],y:c[1]})}}
  else if(kind==='wolves'){for(let i=0;i<4;i++){const c=pick(20+i);if(c)enemies.push({t:'wolf',x:c[0],y:c[1]})}const c=pick(30);if(c)items.push({k:'potion',x:c[0],y:c[1]});decor.push({k:'bones',x:far[0],y:far[1],block:false})}
  else if(kind==='outcast'){const oi=PF_KINDS.slice(0,ci).filter(k=>k==='outcast').length%4,kp=KH_KEEPERS['pf_out'+oi];if(kp)decor.push({k:khFaceKey(kp.face),x:far[0],y:far[1],block:false,walk:true,npc:'pf_out'+oi,sc:1});const c=pick(40);if(c)decor.push({k:'barrel',x:c[0],y:c[1],block:true})}
  else if(kind==='fugitive'){const fi=PF_KINDS.slice(0,ci).filter(k=>k==='fugitive').length%3,id='pf_f'+PF_FUG[fi].id,kp=KH_KEEPERS[id];if(kp)decor.push({k:khFaceKey(kp.face),x:far[0],y:far[1],block:false,walk:true,npc:id,sc:1});const c=pick(50);if(c)decor.push({k:'barrel',x:c[0],y:c[1],block:true})}
  if(!PF_ENT[ci]){const sn=LP.BASE+PF_SEGS[ci];try{if(!LEVELS[sn]&&KH_LAZY[sn])KH_LAZY[sn]();pfPrep(sn)}catch(e){console.error(e)}}
  const ent=PF_ENT[ci]||{n:LP.BASE+PF_SEGS[ci],x:80,y:300};
  const rk=pfRockGid(2.6,true),dgid=KH_NEXT_GID++;T_TILE[dgid]=T_DOORS.cave;KH_DOOR[dgid]={lvl:ent.n,at:{x:ent.x,y:ent.y,f:3}};
  const chars={'#':rk};chars[door]=dgid;
  return {rows:g.map(r=>r.join('')),start:{x:8,y:H-3,f:0},enemies,items,decor,chars,day:0,name:PF_NAMES[ci],label:PF_NAMES[ci],diff,ceilH:2.6,torchGap:1e9,portals:[],lights:[],
    mapNames:[{t:PF_NAMES[ci],x:8,y:H-1,k:'place'}]};
}
for(let i=0;i<PF_CAVES;i++)KH_LAZY[PF_CAVE0+i]=((ci)=>()=>{if(!LEVELS[PF_CAVE0+ci]){const lv=pfCaveBuild(ci);LEVELS[PF_CAVE0+ci]=lv}})(i);
/* ---------- creatures of the woods: squirrels and rabbits dart about, deer step through the trees, bees drift ---------- */
for(const n of ['sq0','sq1','rb0','rb1','doe','stag','bee0','bee1'])loadImg('cr_'+n,'assets/cr_'+n+'.png');
ENEMY_DEF.critter={name:'Creature',hp:1,dmg:[0,0],hit:0,w:.3,img:'',xp:0,gold:[0,0],speed:1};
const WDC=[];
const WD_KIND={ // h: height in the world, spd: squares a second, flee: how close the party can come
  squirrel:{f:['sq0','sq1'],h:.34,spd:2.6,flee:3.4,wt:2},rabbit:{f:['rb0','rb1'],h:.36,spd:2.2,flee:3.6,wt:2,hop:1},
  deer:{f:['doe','stag'],h:1.0,spd:1.5,flee:5,wt:1},bee:{f:['bee0','bee1'],h:.075,spd:1.1,flee:0,wt:2,fly:1}};
const wdFree=(x,y)=>{const c=Math.floor(x),d=Math.floor(y);const L=LEVELS[LEVEL];return L&&L.rows[d]&&L.rows[d][c]==='.'&&!cellBlocked(c,d)};
function wdTick(dt){
  const L=LEVELS[LEVEL];
  if(!L||LEVEL<LP.BASE||LEVEL>=LP.BASE+LP.N||G.state!=='play'||G.cut){WDC.length=0;return}
  const px=G.P.x+.5,py=G.P.y+.5;
  for(let i=WDC.length-1;i>=0;i--){const c=WDC[i];if(c.lvl!==LEVEL||Math.hypot(c.x-px,c.y-py)>22)WDC.splice(i,1)}
  G._wdT=(G._wdT||0)+dt;
  if(G._wdT>.9&&WDC.length<9){G._wdT=0;
    const kinds=Object.keys(WD_KIND),tot=kinds.reduce((a,k)=>a+WD_KIND[k].wt,0);let u=Math.random()*tot,kind=kinds[0];for(const k of kinds){u-=WD_KIND[k].wt;if(u<=0){kind=k;break}}
    for(let t=0;t<24;t++){const a=Math.random()*Math.PI*2,r=6+Math.random()*7,x=px+Math.cos(a)*r,y=py+Math.sin(a)*r;
      if(wdFree(x,y)){const K=WD_KIND[kind];WDC.push({lvl:LEVEL,kind,x,y,tx:x,ty:y,t:Math.random()*2,ph:Math.random()*6.28,e:{t:'critter',x:Math.floor(x),y:Math.floor(y),hp:1},fi:kind==='deer'?(Math.random()<.5?0:1):0});break}}}
  for(const c of WDC){const K=WD_KIND[c.kind];c.t-=dt;c.ph+=dt*(K.fly?30:K.hop?9:7);
    const dp=Math.hypot(c.x-px,c.y-py);let fleeing=false;
    if(K.flee&&dp<K.flee){fleeing=true;const a=Math.atan2(c.y-py,c.x-px)+(Math.random()-.5)*.8;c.tx=c.x+Math.cos(a)*3;c.ty=c.y+Math.sin(a)*3;c.t=.5}
    else if(c.t<=0||Math.hypot(c.tx-c.x,c.ty-c.y)<.2){c.t=(K.fly?.6:1.2)+Math.random()*2.2;const rest=!K.fly&&Math.random()<.45;if(rest){c.tx=c.x;c.ty=c.y}else{const a=Math.random()*Math.PI*2,r=1+Math.random()*(K.fly?3:4);c.tx=c.x+Math.cos(a)*r;c.ty=c.y+Math.sin(a)*r}}
    const dx=c.tx-c.x,dy=c.ty-c.y,dl=Math.hypot(dx,dy);c.moving=dl>.15;
    if(c.moving){const sp=K.spd*(fleeing?1.7:1)*dt,nx=c.x+dx/dl*sp,ny=c.y+dy/dl*sp;if(wdFree(nx,ny)){c.x=nx;c.y=ny}else c.t=0}
    c.e.x=Math.floor(c.x);c.e.y=Math.floor(c.y)}
}
{const _sl=spriteList;let last=performance.now();spriteList=function(){const L=_sl.apply(this,arguments);try{const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;wdTick(dt);
  for(const c of WDC){const K=WD_KIND[c.kind];let key,bob=0;
    if(c.kind==='squirrel')key=c.moving?K.f[Math.floor(c.ph*.6)%2]:K.f[0];
    else if(c.kind==='rabbit'){const hop=c.moving?Math.max(0,Math.sin(c.ph)):0;bob=hop*.16;key=hop>.15?K.f[1]:K.f[0]}
    else if(c.kind==='deer')key=K.f[c.fi];
    else{key=K.f[Math.floor(c.ph/3.14)%2];bob=.5+Math.sin(c.ph*.13)*.14+Math.sin(c.ph*.07+1)*.1}
    const im=IMG['cr_'+key];if(!im||!im.width)continue;
    L.push({x:c.x,y:c.y,img:im,w:K.h*im.width/im.height,bob,e:c.e,fade:1})}}catch(e){console.error(e)}return L}}
