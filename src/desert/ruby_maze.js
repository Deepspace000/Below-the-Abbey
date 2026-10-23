/* ==========================================================================
   THE RUBY MAZE (level 500, prefix rm / RMZ). A small labyrinth of ruby red walls, about the size of the Golden Crypt, built behind Dorn's store in Ironhill.
   1. The level: a perfect maze (one way only, no loops) of one-wide passages, cut from a fixed seed by a recursive backtracker, so it is the same every time.
      At its heart is a little walled garden (7 by 5) with a fountain, flowers, bushes, small trees, a chest and the sorceress Wren, who hides there from the
      people of Ironhill. The one door into the garden is at the end of the longest walk from the entrance. Ghosts and undead servants fill the passages:
      about twenty of them, standing at levels 27 to 30 (the nearest to the garden, and the Wraith, at 30). The place is rated level 30.
   2. The walls are the painted gold panel wall recoloured ruby red with gold bands (made when the level is first entered); the torches are the ordinary wall
      torches. The floor is red and black tiles, the garden floor is grass.
   3. The way in: a plain back door in the back wall of Dorn's store (Ironhill square 20,24), reached from the back lane (20,25), with a sign beside it that
      says STAY OUT. Level 13 is changed here, from this file, once.
   4. Wren (NPC rubysorceress): asks the party to keep her secret. Keep it and she gives the Ruby Staff (a level 30 weapon). Refuse and she gives a Red Apple, which
      is poisoned. She gives one or the other, once. She also asks after Tobin, a young man in Ironhill, who misses her (NPC ihboy, flag ironhillBoy).
      Tobin can be told what the party did after they have met her: if the party kept her secret he gives them a Greater Mana Draught, once.
   ========================================================================== */
const RMZ={ID:500,W:37,H:27,GX0:15,GX1:21,GY0:11,GY1:15,CX:18,CY:13,EX:5,DX:20,DY:24,TD:String.fromCharCode(0x2f1),townIdx:undefined};

/* ---- the maze ---- */
function rmRng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function rmBuild(){
  const W=RMZ.W,H=RMZ.H,R=rmRng(30031),g=[];
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const inG=(x,y)=>x>=RMZ.GX0-1&&x<=RMZ.GX1+1&&y>=RMZ.GY0-1&&y<=RMZ.GY1+1; // the garden and its wall ring are not part of the maze
  const sx=RMZ.EX,sy=H-2,seen=new Set([sx+','+sy]),stack=[[sx,sy]];g[sy][sx]='.';
  while(stack.length){
    const [cx,cy]=stack[stack.length-1],nb=[];
    for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){const nx=cx+dx,ny=cy+dy;if(nx<1||ny<1||nx>W-2||ny>H-2||inG(nx,ny)||seen.has(nx+','+ny))continue;nb.push([nx,ny,dx,dy])}
    if(!nb.length){stack.pop();continue}
    const [nx,ny,dx,dy]=nb[Math.floor(R()*nb.length)];g[cy+dy/2][cx+dx/2]='.';g[ny][nx]='.';seen.add(nx+','+ny);stack.push([nx,ny]);
  }
  const D4=[[1,0],[-1,0],[0,1],[0,-1]];
  const bfs=(ax,ay)=>{const d=new Int16Array(W*H).fill(-1),q=[ay*W+ax],par=new Int32Array(W*H).fill(-1);d[q[0]]=0;
    for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of D4){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;par[ny*W+nx]=c;q.push(ny*W+nx)}}
    return {d,par}};
  // the garden's door faces west or east, on whichever side is the longer walk from the entrance
  const e0=bfs(sx,sy),wCell=e0.d[13*W+13],eCell=e0.d[13*W+23],side=eCell>wCell?'E':'W',gapX=side==='W'?14:22,outX=side==='W'?13:23;
  for(let y=RMZ.GY0;y<=RMZ.GY1;y++)for(let x=RMZ.GX0;x<=RMZ.GX1;x++)g[y][x]='.';
  g[13][gapX]='.';
  g[H-1][RMZ.EX]='0'; // the door out, in the outer wall (the party goes through it to the back lane of Ironhill)
  const S=bfs(sx,sy),C=bfs(outX,13); // distance from the entrance, and from the cell outside the garden door
  const mx=x=>side==='E'?W-1-x:x;
  const floor=[],deg=new Map();
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(g[y][x]!=='.'||inG(x,y))continue;floor.push([x,y]);deg.set(x+','+y,D4.filter(([a,b])=>g[y+b][x+a]==='.').length)}
  // the main way: from the entrance to the garden door
  const path=[];{let c=13*W+outX;while(c>=0){path.push([c%W,(c/W)|0]);c=S.par[c]}path.reverse()}
  // creatures
  const taken=new Set(),enemies=[],gap=[outX,13];
  const okCell=(x,y)=>!inG(x,y)&&S.d[y*W+x]>=10&&C.d[y*W+x]>=3&&deg.get(x+','+y)<=2&&!taken.has(x+','+y);
  const onPath=n=>{for(let k=Math.min(path.length-2,Math.max(1,path.length-1-n));k>=1;k--){const [x,y]=path[k];if(okCell(x,y))return [x,y]}return null};
  const put=(t,xy,lvl)=>{if(!xy)return;taken.add(xy[0]+','+xy[1]);enemies.push({t,x:xy[0],y:xy[1],lvl,c:C.d[xy[1]*W+xy[0]]})};
  put('wraith',onPath(5),30);put('hlwight',onPath(12),30);put('hlwight',onPath(21),30);
  const kinds=['ghost','ghost','ghost','ghost','spectre','spectre','spectre2','spectre2','hlghost','hlghost','pservant','pservant','pservant','pservant','mummy','mummy','dskeleton'];
  for(let i=kinds.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[kinds[i],kinds[j]]=[kinds[j],kinds[i]]}
  const cand=floor.filter(([x,y])=>okCell(x,y)&&C.d[y*W+x]>=8);
  for(let i=cand.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[cand[i],cand[j]]=[cand[j],cand[i]]}
  const far=(x,y,m)=>enemies.every(e=>Math.hypot(e.x-x,e.y-y)>=m);
  for(const k of kinds){const p=cand.find(([x,y])=>!taken.has(x+','+y)&&far(x,y,5.2));if(!p)continue;put(k,p,0)}
  // levels 27 to 30: the nearer to the garden, the higher (the Wraith and the Wights always 30)
  {const rest=enemies.filter(e=>e.lvl!==30).sort((a,b)=>a.c-b.c),slots=[30,30,29,29,29,29,29,28,28,28,28,28,27,27,27,27,27];rest.forEach((e,i)=>{e.lvl=slots[Math.min(i,slots.length-1)]})}
  enemies.forEach(e=>delete e.c);
  // a few potions at the far dead ends
  const items=[];{const de=floor.filter(([x,y])=>deg.get(x+','+y)===1&&!taken.has(x+','+y)&&S.d[y*W+x]>=20&&!(x===sx&&y===sy));de.sort((a,b)=>S.d[b[1]*W+b[0]]-S.d[a[1]*W+a[0]]);
    for(const p of de){if(items.length>=4)break;if(items.every(q=>Math.hypot(q.x-p[0],q.y-p[1])>=6))items.push({k:'potion',x:p[0],y:p[1]})}}
  // the garden
  const decor=[],lights=[[mx(16),12],[mx(16),14],[mx(20),13],[mx(18),13]];
  const dc=(k,x,y,o)=>decor.push(Object.assign({k,x:mx(x),y,block:false},o||{}));
  dc('rubysorceress',18,13,{npc:'rubysorceress',walk:true});
  dc('chest',21,13,{block:true,goldAmt:450});
  dc('fountain',18,11,{block:true});dc('bench',18,15,{block:true});
  for(const [x,y] of [[17,11],[19,11],[17,15],[19,15]])dc('bush',x,y,{block:true});
  dc('dplant1',15,11,{block:true,sc:.85});dc('dplant1',21,11,{block:true,sc:.85});dc('dplant0',15,15,{block:true,sc:.85});dc('dplant0',21,15,{block:true,sc:.85});
  dc('urn',20,12,{block:true});dc('urn',20,14,{block:true});
  dc('brazier',16,12,{block:true});dc('brazier',16,14,{block:true});
  dc('flowerpot',15,12);dc('flowerpot',15,14);
  for(const [k,x,y] of [['flora4',16,11],['flora9',16,15],['flora2',20,11],['flora3',20,15],['flora4',21,12],['flora2',21,14],['flora1',17,12],['flora1',19,12],['flora1',17,14],['flora1',19,14],['flora10',17,13],['flora10',19,13]])dc(k,x,y);
  // floor map: 0 red and black tiles, 1 grass, 2 gravel paths in the garden
  const fm=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++){let c='0';if(x>=RMZ.GX0&&x<=RMZ.GX1&&y>=RMZ.GY0&&y<=RMZ.GY1)c=(y===13||x===18)?'2':'1';else if(x===gapX&&y===13)c='2';r+=c}fm.push(r)}
  // checks: every floor square can be reached from the start, and so can the chest, the sorceress and the garden; the door is in the outer wall; the maze has no loops
  let floors=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]==='.')floors++;
  let reach=0;for(let i=0;i<S.d.length;i++)if(S.d[i]>=0)reach++;
  const inGarden=(x,y)=>x>=RMZ.GX0&&x<=RMZ.GX1&&y>=RMZ.GY0&&y<=RMZ.GY1;
  const reachOk=decor.every(d=>(d.k==='chest'||d.npc)?S.d[d.y*W+d.x]>=0:true);
  // the maze with the garden counted as one room: it is a tree (squares minus one is the number of neighbouring pairs), so there is only one way between any two places
  let nodes=1,edges=1;for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]!=='.'||inGarden(x,y))continue;nodes++;for(const [a,b] of [[1,0],[0,1]])if(g[y+b]&&g[y+b][x+a]==='.'&&!inGarden(x+a,y+b))edges++}
  const info={ok:reach===floors&&reachOk&&g[H-1][RMZ.EX]==='0'&&edges===nodes-1,floors,reach,nodes,edges,side,pathLen:path.length,deadEnds:[...deg.values()].filter(v=>v===1).length,creatures:enemies.length,gap,start:{x:sx,y:sy}};
  if(!info.ok)console.error('The Ruby Maze failed its own checks',info);
  return {rows:g.map(r=>r.join('')),fmap:fm,start:{x:sx,y:sy,f:0},enemies,items,decor,lights,info,side};
}
{const M=rmBuild();RMZ.M=M;
  LEVELS[RMZ.ID]={rows:M.rows,fmap:M.fmap,start:M.start,enemies:M.enemies,items:M.items,decor:M.decor,lights:M.lights,day:0,torchGap:4.2,
    floor:'rmfloor',floorSet:['rmfloor','lush','sandpath','rmfloor','rmfloor','rmfloor'],ceil:'rmceil',
    name:'The Ruby Maze',label:'The Ruby Maze',diff:30,
    portals:[{to:13,x:RMZ.DX,y:RMZ.DY+1,f:2,tex:'farm'}],
    mapNames:[{t:'The Garden',x:RMZ.CX,y:RMZ.GY0-1,k:'place'},{t:'The Back Door',x:RMZ.EX,y:RMZ.H-3,k:'lane'}],_rmz:M.info};
  LEVEL_NAMES[RMZ.ID]='The Ruby Maze';LEVEL_RATING[RMZ.ID]=30;
  NPC_H.rubysorceress=.95;}

/* ---- the ruby walls, floor and ceiling: painted pictures recoloured when the level is first entered ---- */
const RMA={on:false,made:false,save:null};
function rmMakeArt(){
  if(RMA.made)return;
  // the wall: the painted gold panel wall (or, failing that, the stone) mapped to a ruby ramp, with a gold band near the top and the bottom
  let src=null;const im=IMG.art_tex_wall_gold||IMG.goldwall;
  if(im){const [c,x]=tcv();x.drawImage(im,0,0,TS,TS);src=x.getImageData(0,0,TS,TS).data}else if(TEX[T_STONE])src=TEX[T_STONE].d;
  const N=TS*TS,L=new Float32Array(N);
  for(let i=0;i<N;i++)L[i]=src?(src[i*4]*.3+src[i*4+1]*.59+src[i*4+2]*.11)/255:.5;
  const sorted=Float32Array.from(L).sort(),lo=sorted[(N*.03)|0],hi=sorted[Math.min(N-1,(N*.97)|0)],span=Math.max(.05,hi-lo),Ln=new Float32Array(N);
  for(let i=0;i<N;i++)Ln[i]=Math.min(1,Math.max(0,(L[i]-lo)/span));
  const Lb=new Float32Array(N),tmp=new Float32Array(N);
  for(let y=0;y<TS;y++)for(let x=0;x<TS;x++)tmp[y*TS+x]=(Ln[y*TS+((x+TS-1)%TS)]+2*Ln[y*TS+x]+Ln[y*TS+((x+1)%TS)])/4;
  for(let y=0;y<TS;y++)for(let x=0;x<TS;x++)Lb[y*TS+x]=.5*Ln[y*TS+x]+.5*(tmp[((y+TS-1)%TS)*TS+x]+2*tmp[y*TS+x]+tmp[((y+1)%TS)*TS+x])/4;
  const RAMP=[[0,20,2,8],[.3,86,6,22],[.62,150,14,34],[.85,196,36,52],[1,236,92,92]];
  const ramp=v=>{for(let k=1;k<RAMP.length;k++)if(v<=RAMP[k][0]){const a=RAMP[k-1],b=RAMP[k],t=(v-a[0])/(b[0]-a[0]);return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,a[3]+(b[3]-a[3])*t]}const l=RAMP[RAMP.length-1];return [l[1],l[2],l[3]]};
  const wall=new Uint8ClampedArray(N*4),k=TS/128,band=(y0,y1,y)=>y>=Math.round(y0*k)&&y<Math.round(y1*k),edge=(y0,y1,y)=>y===Math.round(y0*k)-1||y===Math.round(y1*k);
  for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){
    const i=y*TS+x,o=i*4;let [r,g,b]=ramp(Lb[i]);const sh=1+.1*Math.sin(x/TS*Math.PI);r*=sh;g*=sh;b*=sh;
    for(const [y0,y1] of [[5,9],[118,122]]){
      if(band(y0,y1,y)){const t=(y-Math.round(y0*k))/Math.max(1,Math.round(y1*k)-Math.round(y0*k)-1),f=.75+.25*Math.sin(t*Math.PI);r=232*f;g=190*f;b=92*f}
      else if(edge(y0,y1,y)){r=60;g=38;b=8}}
    wall[o]=r;wall[o+1]=g;wall[o+2]=b;wall[o+3]=255}
  RMA.stone=addTex(wall);RMA.torch=TEX.length;for(const f of torchFrames(wall))addTex(f.d,f.e);
  // the floor: red and black tiles (the tomb's red and dark floors in a chequer), with a dark joint between them
  {const A=FLOORS.tombdark||FLOORS.cobble,B=FLOORS.tombred||A,d=new Uint8ClampedArray(TS*TS*4),h=TS/2;
    for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const o=(y*TS+x)*4,s=(((x/h)|0)^((y/h)|0))&1?B:A,j=(x%h<2||y%h<2)?.45:1,tint=s===B?1:.8;d[o]=s[o]*tint*j;d[o+1]=s[o+1]*tint*j*(s===B?.92:1);d[o+2]=s[o+2]*tint*j*(s===B?.92:1);d[o+3]=255}
    FLOORS.rmfloor=d}
  // the ceiling: the tomb ceiling, darkened and leaned to red
  {const C0=CEILS.tomb||CEILS.gloom;if(C0){const d=new Uint8ClampedArray(C0.length);for(let i=0;i<C0.length;i+=4){const m=(C0[i]+C0[i+1]+C0[i+2])/3;d[i]=m*.62+10;d[i+1]=m*.14;d[i+2]=m*.2;d[i+3]=255}CEILS.rmceil=d}}
  RMA.made=true;
}
// the plain stone wall and its torches are swapped for the ruby ones while the party is in the maze, and put back the moment it leaves
function rmSwapWalls(on){
  if(on&&!RMA.on&&RMA.made){RMA.save=[T_STONE,T_TORCH_STONE];T_STONE=RMA.stone;T_TORCH_STONE=RMA.torch;RMA.on=true}
  else if(!on&&RMA.on){T_STONE=RMA.save[0];T_TORCH_STONE=RMA.save[1];RMA.on=false}
}
{const _ll=loadLevel;loadLevel=function(n){
  try{if(n===RMZ.ID)rmMakeArt();rmSwapWalls(n===RMZ.ID)}catch(e){console.error(e)}
  return _ll.apply(this,arguments)}}

/* ---- creature levels: in a fixed world every creature is set to the place's level, less a random few; here each one keeps the level it was given (27 to 30) ---- */
{const _rb=rebalanceEnemies;rebalanceEnemies=function(){
  const r=_rb.apply(this,arguments);
  try{if(LEVEL===RMZ.ID&&typeof ENEMY_SPAWNS!=='undefined')for(const e of G.enemies){
    const sp=ENEMY_SPAWNS[e.id];if(!sp||sp.t!==e.t||!sp.lvl||e.hp<=0||e.dying||e.base===undefined)continue;
    const nl=G.flags.autoScaleOn?Math.max(1,e.base-Math.max(0,30-sp.lvl)):sp.lvl,vd=Math.max(0,e.base-nl); // a fixed world: exactly the level it was given; an autoscaled one: the same number of levels below the place's level
    if(e.vd!==vd||e.lvl!==nl){e.vd=vd;if(e.lvl!==nl){const fr=e.hp/e.maxhp;e.lvl=nl;e.maxhp=enemyStat(e.t,nl).hp;e.hp=Math.max(1,Math.ceil(e.maxhp*fr))}}}}catch(x){console.error(x)}
  return r}}

// the Go to area list shows the levels the creatures really stand at (27 to 30), not the spread a fixed world would give them
{const _as=areaStats;areaStats=function(n){const o=_as.apply(this,arguments);
  try{if(n===RMZ.ID&&o&&o.en&&LEVELS[n]){let lo=99,hi=0;for(const e of LEVELS[n].enemies){lo=Math.min(lo,e.lvl);hi=Math.max(hi,e.lvl)}o.lo=lo;o.hi=hi}}catch(x){console.error(x)}
  return o}}

/* ---- the Ruby Staff, the Red Apple and the chest ---- */
ITEMDEF.rubystaff={n:'Ruby Staff',k:'weapon',t:'Staff',ic:'staff',c:'#d02a3a',dmg:[58,92],magic:42,req:{int:30},lvl:30,price:2800,rar:1,eff:{daze:.25},sw:.44,d:'The staff of the sorceress of the Ruby Maze, topped with a red stone. Adds 42 to the power of spells, and one blow in four leaves the foe dazed. Needs level 30.'};
ITEMDEF.rubyapple={n:'Red Apple',k:'food',t:'Snack',ic:'apple',c:'#a8302a',heal:6,feed:40,stack:1,price:2,sw:.3,fdhp:1,hpct:4,d:'A shiny red apple, a gift from the sorceress.'};
// the apple is poisoned: the hero who eats it loses a good part of their health and is poisoned
{const _ae=afflEat;afflEat=function(hi,key){
  _ae.apply(this,arguments);
  if(key!=='rubyapple')return;
  try{const h=G.heroes[hi];if(!h||!h.alive)return;
    afflInflict('poisoned',hi,true);
    const loss=Math.max(6,Math.round(h.max*.3));h.hp=Math.max(1,h.hp-loss);h.hurt=.5;
    later(120,()=>{msg(`${HERO_DEF[hi].name} bites the apple. It tastes of bitter almonds. A green heat creeps up the veins. (-${loss} health, poisoned)`,'#8ad06a');try{addFloat(portraitX(hi)+19,250,'-'+loss,'#6ad06a')}catch(e){}})
  }catch(e){console.error(e)}}}
// pictures: the staff is the Hollow Scepter's picture recoloured ruby, and the apple looks exactly like an ordinary apple
{const _gt=gearTintIcons;gearTintIcons=function(){
  _gt.apply(this,arguments);
  try{const b=IMG.icn_hollowscepter||IMG.icn_staff;
    if(b&&!IMG.icn_rubystaff){const c=document.createElement('canvas');c.width=b.width;c.height=b.height;const x=c.getContext('2d');x.drawImage(b,0,0);
      const id=x.getImageData(0,0,c.width,c.height),d=id.data,ST=[[0,26,3,8],[.5,170,16,38],[.85,222,64,72],[1,255,170,150]];
      for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue;let v=Math.pow(Math.min(1,Math.max(0,((d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255-.02)*1.5)),.9);
        for(let k=1;k<ST.length;k++)if(v<=ST[k][0]||k===ST.length-1){const a=ST[k-1],q=ST[k],t=Math.min(1,(v-a[0])/(q[0]-a[0]));d[i]=a[1]+(q[1]-a[1])*t;d[i+1]=a[2]+(q[2]-a[2])*t;d[i+2]=a[3]+(q[3]-a[3])*t;break}}
      x.putImageData(id,0,0);IMG.icn_rubystaff=c;IMG.ic_rubystaff=c;IMG.it_rubystaff=c}
    const ap=IMG.ic_apple||IMG.icn_apple;if(ap&&!IMG.ic_rubyapple){IMG.icn_rubyapple=ap;IMG.ic_rubyapple=ap;IMG.it_rubyapple=IMG.it_apple||ap}
  }catch(e){console.error(e)}}}
// the chest in the garden: good things for level 30
{const _lf=lootFor;lootFor=function(d){
  if(LEVEL===RMZ.ID&&d&&d.k==='chest'){
    const r=k=>hash2(d.x,d.y,300+k),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    for(let q=0;q<3;q++)add(potionFor(r(40+q)),1);
    add('supermana',2);add('elixir',1);
    for(let q=0;q<2;q++){const a=typeof armourDrop==='function'?armourDrop(r(60+q)):null;if(a)add(a)}
    add(['ringSage','ringMoon','ringChampion'][Math.floor(r(9)*3)]);
    d.gold=d.goldAmt||450;return items}
  return _lf.apply(this,arguments)}}

/* ---- Wren, the sorceress of the maze ---- */
function rmGive(id,what){
  const F=G.flags,it=mkItem(id);
  if(!bagAdd(it))G.items.push({k:id,x:G.P.x,y:G.P.y,taken:false});
  msg(`The sorceress gives you ${what}.`,'#ffe9a0');sfx('key');
}
function rmSecret(again){
  return say(again?'"Have you decided? I am asking you to keep this place secret."':'"There is one more thing. I am asking you to keep this place secret. Do not tell anyone in Ironhill that I am here. If you will, I will give you something for it."',[
    ['I will keep your secret.',()=>{const F=G.flags;F.rubyKept=1;F.rubyGiven='staff';rmGive('rubystaff','the Ruby Staff');
      return say('Her face relaxes. "Thank you. I am in your debt. Please take this staff. I made it myself, and it is the best thing I have made. Use it well."',[['Thank you.',()=>null]])}],
    ['I will not keep it.',()=>{const F=G.flags;F.rubyRefused=1;F.rubyGiven='apple';rmGive('rubyapple','a Red Apple');
      return say('She smiles sweetly. "I see. Then we will not argue. Take an apple from my garden, as a gift, so that we part as friends."',[['Take the apple.',()=>null]])}],
    ['Leave.',()=>say('"Think about it. I will be here."',[BYE])]]);
}
function rmAsk(){
  const F=G.flags;if(F.rubyAsked)return rmSecret(false);F.rubyAsked=1;
  const opts=[];
  if(F.ironhillBoy)opts.push(['Yes, we spoke to him.',()=>say('"How is he? Did he say anything about me?"',[
    ['He misses you.',()=>{G.flags.rubyBoyKnown=1;return say('She is quiet for a while and looks down at the flowers. "He was the only one who never threw anything at me." She wipes her eye with her sleeve. "Thank you for telling me. It is good to know. I am still not coming out."',[['I understand.',()=>rmSecret(false)]])}],
    ['No. He did not mention you.',()=>say('"No. Of course not." She turns her face away. "It is better that way."',[['I am sorry.',()=>rmSecret(false)]])]])]);
  opts.push([F.ironhillBoy?'No.':'No, we have not.',()=>say('"It does not matter. If you do meet him, please do not tell him about me. I would not want him in trouble."',[['All right.',()=>rmSecret(false)]])]);
  return say('"Before you answer, I want to ask you something else. There is a young man in Ironhill called Tobin. He is thin, with brown hair, and he wears a blue tunic and carries a rolled scroll. Have you seen him?"',opts);
}
function rmWhy(){
  return say('"I grew up in Ironhill. When I was a girl I could light a candle without touching it. People were afraid of me, and then they were cruel. They threw stones at me. Now I am a sorceress, and they would burn me if they knew. So I hide here, behind the store, where nobody looks."',[['I understand.',()=>rmAsk()]]);
}
NPCS.rubysorceress={name:'Wren, the sorceress',img:'rubysorceress',root:d=>{
  const F=G.flags;
  if(F.rubyGiven==='staff')return say('She looks up from the flowers and nods to you. "You kept my secret. I have not forgotten it. You may walk in my garden whenever you like."',[BYE]);
  if(F.rubyGiven==='apple')return say('She smiles at you and does not stand up. "Did you enjoy the apple?"',[BYE]);
  if(F.rubySorceressMet){const asked=!!F.rubyAsked;return asked?rmSecret(true):rmAsk()}
  F.rubySorceressMet=1;
  return say('A woman in a red robe stands among the flowers, holding a staff with a red stone on top. She is not frightened, but she is careful. "You came through the whole maze. Few people get past the ghosts. My name is Wren. I built this place so that nobody from Ironhill could find me."',[['Why are you hiding?',()=>rmWhy()],['Just passing through.',()=>null]]);
}};

/* ---- Tobin, a young man in Ironhill who misses a girl called Wren ---- */
function rmBoyGive(){const F=G.flags;if(F.ironhillBoyPotion)return;F.ironhillBoyPotion=1;if(!bagAdd(mkItem('greatermana')))G.items.push({k:'greatermana',x:G.P.x,y:G.P.y,taken:false});msg('Tobin gives you a Greater Mana Draught.','#ffe9a0');sfx('key')}
function rmBoyNews(){
  const F=G.flags,more=[['Never mind.',()=>null]];
  if(F.rubyKept)return say('He stands very still. "News? What news?"',[['She is alive and well, and we are keeping her secret.',()=>{F.ironhillBoyTold=1;F.ironhillBoyHappy=1;rmBoyGive();
    return say('His eyes fill with tears, and he laughs. "Alive. And well. Thank you. I will tell no one, I promise." He digs in his pocket. "Take this. It is not much, but it is all I have."',[['Thank you.',()=>null]])}]].concat(more));
  if(F.rubyRefused)return say('He stands very still. "News? What news?"',[['I found her. I would not keep her secret.',()=>{F.ironhillBoyTold=1;F.ironhillBoyHappy=0;
    return say('Tobin says nothing for a while. "I wish you had let her be." He turns away.',[BYE])}]].concat(more));
  return say('He stands very still. "News? What news?"',[['I found her. She is alive and well.',()=>say('He lets out a long breath. "Thank you. That is all I wanted to know. Please be kind to her."',[BYE])]].concat(more));
}
NPCS.ihboy={name:'Tobin',img:'kh_ohfolk7_1',root:d=>{
  const F=G.flags;F.ironhillBoy=1;
  if(F.ironhillBoyTold)return F.ironhillBoyHappy?say('"I have told no one, and I will not. Thank you again."',[BYE]):say('He does not look up. "I wish you had let her be."',[BYE]);
  const t6=()=>say('"Yes. I miss her. I would like to know that she is safe. That is all."',[BYE]);
  const t5=()=>say('"I never threw anything at her. But I never stopped anyone, either. I stood and watched. I wish I had said just one word to them."',[['Do you miss her?',t6],BYE]);
  const t4=()=>say('"One morning her door was open and her room was empty. Nobody saw her go. Some said she became a sorcerer far away. Some said the mountain took her. I do not know which."',[['Were you her friend?',t5],BYE]);
  const t3=()=>say('"People got afraid of it. They called her a witch. Children threw mud and stones at her. Grown people spat at her door. It went on for years, and she hardly ever answered back."',[['What happened then?',t4],BYE]);
  const t2=()=>say('"She lived two streets from me. She was quiet, and she read every book she could find. She could do small magic, a flame on her finger, a candle that lit when she came in. When we were small I thought that was wonderful."',[['What happened to her?',t3],BYE]);
  const t1=()=>say('"Sorry. I was thinking about a girl who used to live here. Her name was Wren."',[['Who was she?',t2],BYE]);
  const opts=[['Are you all right?',t1]];
  if(F.rubySorceressMet)opts.push(['I have news about Wren.',rmBoyNews]);
  opts.push(BYE);
  return say('A young man in a blue tunic stands by the road, turning a rolled scroll over in his hands. "Hello. I am Tobin. You are not from Ironhill. I can always tell."',opts);
}};
/* a little gossip in Ironhill about the back door (nothing about who is behind it) */
repWrap('tilda',()=>true,'Heard anything strange?',()=>say('There is a plain back door behind Dorn\'s store. It has been there as long as I remember. Nobody uses it. Nobody asks. The sign on it says STAY OUT, so we stay out.',[BYE]));
repWrap('maren',()=>true,'Heard anything strange?',()=>say('Someone keeps a lamp lit by that back door behind the store. I pass it every evening. I have never seen anyone go in or come out.',[BYE]));
repWrap('ivo',()=>true,'Heard anything strange?',()=>say('My mother says never go near the back door behind the store. She will not say why. So I looked at it once. It is only a door.',[BYE]));
if(typeof RUMOURS!=='undefined'&&!RUMOURS.some(r=>r.id==='ih_backdoor1')){
  RUMOURS.push({id:'ih_backdoor1',t:'There is a plain back door behind Dorn\'s store in Ironhill, with a sign on it that says STAY OUT. Nobody has ever been seen going in.',tag:'dark'});
  RUMOURS.push({id:'ih_backdoor2',t:'The people of Ironhill walk round the back door behind Dorn\'s store. Somebody keeps a lamp lit beside it, and nobody knows who.',tag:'dark'});
}

/* ---- the way in: a back door in the back wall of Dorn's store, and a sign (Ironhill is level 13) ---- */
function rmTownSetup(){
  const L=LEVELS[13];if(!L||!L.rows||L.rows.length<26||L._rmDoor||!L._shops)return;
  const x=RMZ.DX,y=RMZ.DY;if(!L.rows[y]||L.rows[y].length<=x||L.rows[y][x]==='.')return;
  L._rmDoor=1;
  L.rows[y]=L.rows[y].slice(0,x)+RMZ.TD+L.rows[y].slice(x+1);
  L.portals=L.portals||[];L.portals.push({to:RMZ.ID,x:RMZ.M.start.x,y:RMZ.M.start.y,f:0,tex:'farm'});RMZ.townIdx=L.portals.length-1;
  L.chars=L.chars||{};L.chars[RMZ.TD]=30+RMZ.townIdx;
  L.decor.push({k:'sign_rubymaze',x:RMZ.DX-1,y:RMZ.DY+1,block:false,wd:[0,-1],sc:1.2,txt:['STAY OUT','']});
  L.decor.push({k:'kh_ohfolk7_1',x:8,y:18,block:false,walk:true,npc:'ihboy'});
}
rmTownSetup();
{const _f=ihShopsChars;ihShopsChars=function(){_f.apply(this,arguments);try{rmTownSetup();const L=LEVELS[13];if(L&&RMZ.townIdx!==undefined){L.chars=L.chars||{};L.chars[RMZ.TD]=30+RMZ.townIdx}}catch(e){console.error(e)}}}

/* ---- the lists: the Go to area list, the world map, ?town=rubymaze ---- */
if(typeof WORLD_LOCS!=='undefined'&&!WORLD_LOCS.some(l=>l.k==='rubymaze')){
  WORLD_LOCS.push({k:'rubymaze',n:'The Ruby Maze',lv:[RMZ.ID],x:262,y:46,ic:'rubymaze'});
  if(typeof WORLD_ROADS!=='undefined'&&!WORLD_ROADS.some(r=>r[0]==='ironhill'&&r[1]==='rubymaze'))WORLD_ROADS.push(['ironhill','rubymaze']);
}
{const _g=gotoListRaw;gotoListRaw=function(){
  const out=_g.apply(this,arguments);
  try{if(!out.some(r=>r.n===RMZ.ID)){const i=out.findIndex(r=>r.h==='The Known Lands');if(i>=0){let j=i+1;while(j<out.length&&!out[j].h)j++;out.splice(j,0,{n:RMZ.ID,name:'The Ruby Maze'})}}}catch(e){console.error(e)}
  return out}}
{const _j=jumpFromUrl;jumpFromUrl=function(){
  const q=new URLSearchParams(location.search),town=(q.get('town')||'').toLowerCase().replace(/[^a-z]/g,'');
  if(town!=='rubymaze')return _j.apply(this,arguments);
  const orig=location.pathname+location.search+location.hash;
  q.set('town','ironhill');if(!q.get('lvl'))q.set('lvl','30');
  try{history.replaceState(null,'',location.pathname+'?'+q.toString()+location.hash)}catch(e){}
  try{_j.apply(this,arguments)}finally{try{history.replaceState(null,'',orig)}catch(e){}}
  const st=LEVELS[RMZ.ID].start;goToLevel(RMZ.ID,{x:st.x,y:st.y,f:st.f});G.state='play';G.menu=false;
  msg('Your party stands at the door of the Ruby Maze.','#ffe36a');
}}
