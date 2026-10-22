/* ==========================================================================
   THE BOAT CANALS (prefix hgdb / HGDB). Two flooded canal labyrinths, levels 478 (The Vine Canal) and 479 (The Croc Canals). A wooden dock in a wall of the maze, in a part of the
   maze that is fairly empty, lets the party hop on a boat; steering it (the ordinary arrows) takes it through a maze of water passages, the walls hung thick with vines. Crocodiles, eels and
   vine snakes swim there. At the far dock the party lands in another empty part of the maze and goes on on foot. (The same two docks serve both ways.)
   ========================================================================== */
const HGDB={A:478,B:479,S:71,DIFF:73};
LEVEL_NAMES[HGDB.A]='The Vine Canal';LEVEL_NAMES[HGDB.B]='The Croc Canals';LEVEL_RATING[HGDB.A]=LEVEL_RATING[HGDB.B]=HGDB.DIFF;
Object.assign(ENEMY_DEF,{
  hgwcroc:{name:'Swamp Crocodile',hp:300,dmg:[15,26],hit:.8,w:1.9,img:'hgw_croc',xp:230,gold:[10,40],speed:1,verb:'snaps at',aboveParty:1},
  hgweel:{name:'Marsh Eel',hp:150,dmg:[10,18],hit:.8,w:1.1,img:'uw_eel_0',xp:150,gold:[0,12],speed:1,verb:'bites'},
  hgwsnake:{name:'Vine Snake',hp:130,dmg:[9,16],hit:.82,w:1.0,img:'hgw_snake',xp:140,gold:[0,10],speed:1,verb:'strikes'}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('hgwcroc','hgweel','hgwsnake');
AFFL_HITS.push([/^hgwsnake/,'stung',.3],[/^hgwcroc/,'bleeding',.2],[/^hgweel/,'fever',.1]);
function hgdbArt(){if(!IMG.hgw_croc&&IMG.firelizard){try{hlTint('firelizard',30,90,40,.62,'hgw_croc');if(IMG.firelizardA)hlTint('firelizardA',30,90,40,.62,'hgw_crocA')}catch(e){}}
  if(!IMG.hgw_snake&&IMG.cobra){try{hlTint('cobra',40,150,60,.55,'hgw_snake');if(IMG.cobraA)hlTint('cobraA',40,150,60,.55,'hgw_snakeA')}catch(e){}}}
/* ---------- the looks: the wall hung with vines, and the dock ---------- */
function hgdbTexVines(){const key='hgdb_vines';if(IMG[key])return key;const PV=IMG.art_tex_hgdp_vines;if(PV&&PV.width){const b=IMG.lushwall||IMG.tex_forestwall;IMG[key]=mkCanvas(128,128,(x,w,h)=>{if(b)x.drawImage(b,0,0,w,h);x.globalCompositeOperation='multiply';x.globalAlpha=.9;x.drawImage(PV,0,0,w,h);x.globalCompositeOperation='source-over';x.globalAlpha=.25;x.fillStyle='#0a2a10';x.fillRect(0,0,w,h)});return key}
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{const b=IMG.lushwall||IMG.tex_forestwall;if(b)x.drawImage(b,0,0,w,h);else{x.fillStyle='#2a4a24';x.fillRect(0,0,w,h)}
    x.fillStyle='rgba(8,30,12,.35)';x.fillRect(0,0,w,h);
    for(let i=0;i<9;i++){const px=8+i*14+((i*37)%7),len=50+((i*53)%70);x.strokeStyle=i%2?'#2f6a2a':'#245a22';x.lineWidth=2.4+(i%3)*.6;x.lineCap='round';x.beginPath();x.moveTo(px,0);
      for(let y=0;y<len;y+=8)x.lineTo(px+Math.sin(y*.16+i)*4,y+8);x.stroke();
      x.fillStyle=i%3?'#4a9a3a':'#6ab84a';for(let y=10;y<len;y+=13){x.beginPath();x.ellipse(px+Math.sin(y*.16+i)*4+5,y,5,2.6,.5,0,6.3);x.fill();x.beginPath();x.ellipse(px+Math.sin(y*.16+i)*4-5,y+6,5,2.6,-.5,0,6.3);x.fill()}}
    x.strokeStyle='rgba(0,0,0,.7)';x.lineWidth=3;x.strokeRect(1.5,1.5,w-3,h-3)});
  return key}
function hgdbTexDock(){const key='hgdb_dock';if(IMG[key])return key;if(IMG.art_tex_hgdp_dock&&IMG.art_tex_hgdp_dock.width)return 'art_tex_hgdp_dock';
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{const b=IMG.tex_abbeywall;if(b)x.drawImage(b,0,0,w,h);else{x.fillStyle='#4a4638';x.fillRect(0,0,w,h)}x.fillStyle='rgba(0,16,20,.3)';x.fillRect(0,0,w,h);
    const g=x.createLinearGradient(0,40,0,h);g.addColorStop(0,'#2a6a74');g.addColorStop(1,'#0a2a34');x.fillStyle=g;x.beginPath();x.moveTo(14,h);x.lineTo(14,50);x.quadraticCurveTo(14,14,64,14);x.quadraticCurveTo(114,14,114,50);x.lineTo(114,h);x.closePath();x.fill();x.strokeStyle='#0c1418';x.lineWidth=3;x.stroke();
    // a little boat lying in the water, seen from the side
    x.fillStyle='#8a5a2c';x.strokeStyle='#2a1808';x.lineWidth=2;x.beginPath();x.moveTo(34,92);x.quadraticCurveTo(64,112,94,92);x.lineTo(88,80);x.lineTo(40,80);x.closePath();x.fill();x.stroke();
    x.fillStyle='#c8a060';x.fillRect(44,84,40,4);x.strokeStyle='#5a3a18';x.lineWidth=2.4;x.beginPath();x.moveTo(64,80);x.lineTo(64,40);x.stroke();x.fillStyle='#e8e0c8';x.beginPath();x.moveTo(64,42);x.lineTo(88,66);x.lineTo(64,66);x.closePath();x.fill();x.stroke();
    x.strokeStyle='rgba(180,240,230,.5)';x.lineWidth=1.4;for(let i=0;i<3;i++){x.beginPath();x.moveTo(24,100+i*8);x.quadraticCurveTo(64,94+i*8,104,100+i*8);x.stroke()}
    x.fillStyle='#7a5a30';x.fillRect(8,110,112,10);x.strokeStyle='#2a1808';x.lineWidth=1.4;x.strokeRect(8,110,112,10);for(let i=1;i<7;i++){x.beginPath();x.moveTo(8+i*16,110);x.lineTo(8+i*16,120);x.stroke()}
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.strokeRect(1.5,1.5,w-3,h-3)});
  return key}
/* ---------- the two canal levels ---------- */
function hgdbBuild(id){
  if(LEVELS[id])return;const SU=LEVELS[HGD.ID]&&LEVELS[HGD.ID]._hgdb;if(!SU){try{hgBuild();hgdBuild()}catch(e){console.error(e)}}
  const docks=LEVELS[HGD.ID]._hgdb.docks.filter(d=>d.level===id);if(docks.length<2)return;hgdbArt();
  const S=HGDB.S,N=(S-1)>>1,rnd=hgdmRng(478000+id),g=[];for(let y=0;y<S;y++)g.push(new Array(S).fill('#'));
  const seen=new Uint8Array(N*N),st=[[0,0,-1]],D=[[0,-1],[1,0],[0,1],[-1,0]];seen[0]=1;g[1][1]='.';
  while(st.length){const [i,j,pd]=st[st.length-1],opts=[];for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni>=0&&nj>=0&&ni<N&&nj<N&&!seen[nj*N+ni])opts.push(d)}
    if(!opts.length){st.pop();continue}let d=opts[(rnd()*opts.length)|0];if(pd>=0&&opts.includes(pd)&&rnd()<.55)d=pd;const ni=i+D[d][0],nj=j+D[d][1];seen[nj*N+ni]=1;g[2*j+1+D[d][1]][2*i+1+D[d][0]]='.';g[2*nj+1][2*ni+1]='.';st.push([ni,nj,d])}
  for(let y=2;y<S-2;y++)for(let x=2;x<S-2;x++)if(g[y][x]==='#'&&((y%2===1&&x%2===0&&g[y][x-1]==='.'&&g[y][x+1]==='.')||(y%2===0&&x%2===1&&g[y-1][x]==='.'&&g[y+1][x]==='.'))&&rnd()<.06)g[y][x]='.';
  // basins: wider pools of open water, with lily plants and hanging vines (never in a one-square canal)
  const basins=[];for(let k=0;k<5;k++){const w=5+((rnd()*2)|0),h=5+((rnd()*2)|0),x0=4+((rnd()*(S-w-8))|0),y0=4+((rnd()*(S-h-8))|0);if(basins.some(b=>Math.abs(b.x-x0)<14&&Math.abs(b.y-y0)<14)||(x0<10&&y0<10))continue;for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)g[y][x]='.';basins.push({x:x0,y:y0,w,h,cx:x0+(w>>1),cy:y0+(h>>1)})}
  // the far end: the open cell farthest by water from the start
  const start={x:1,y:1},dist=new Int32Array(S*S).fill(-1),q=[[1,1]];dist[S+1]=0;let far=[1,1];
  for(let i=0;i<q.length;i++){const [x,y]=q[i];far=[x,y];for(const [a,b] of D){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=S||ny>=S||g[ny][nx]!=='.'||dist[ny*S+nx]>=0)continue;dist[ny*S+nx]=dist[y*S+x]+1;q.push([nx,ny])}}
  const TM=ohTiles(),chars={};
  OH_STY.hgdb_vines=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:hgdbTexVines(),door:hgdbTexVines(),win:hgdbTexVines(),alt:hgdbTexVines(),zoom:1,contrast:1.05,tint:[255,255,255,0]});
  OH_STY.hgdb_dock=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:hgdbTexDock(),door:hgdbTexDock(),win:hgdbTexDock(),alt:hgdbTexDock(),zoom:1,contrast:1,tint:[255,255,255,0]});
  chars['#']=TM.make('plain','hgdb_vines',2.7).gid;const chD=String.fromCharCode(0x360);chars[chD]=TM.make('plain','hgdb_dock',2.7).gid;
  const dockAt=(c)=>{for(const [a,b] of D){const wx=c[0]+a,wy=c[1]+b;if(wx>0&&wy>0&&wx<S-1&&wy<S-1&&g[wy][wx]==='#'&&(wx%2===0||wy%2===0)){g[wy][wx]=chD;return {ax:c[0],ay:c[1],x:wx,y:wy,dx:a,dy:b}}}return null};
  const dIn=dockAt([1,1])||dockAt([1,3]),dOut=dockAt(far);
  const used=new Set([dIn&&dIn.ax+','+dIn.ay,dOut&&dOut.ax+','+dOut.ay]);
  const cells=[];for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++)if(g[y][x]==='.'&&dist[y*S+x]>8&&Math.hypot(x-far[0],y-far[1])>6)cells.push([x,y]);
  const take=()=>cells.length?cells.splice((rnd()*cells.length)|0,1)[0]:null;
  const enemies=[],decor=[];
  const kinds=['hgwcroc','hgwcroc','hgweel','hgweel','hgwsnake','hgwsnake'];for(let k=0;k<40;k++){const c=take();if(c)enemies.push({t:kinds[k%6],x:c[0],y:c[1]})}
  for(const b of basins)for(let k=0;k<4;k++){const x=b.x+1+((rnd()*(b.w-2))|0),y=b.y+1+((rnd()*(b.h-2))|0);if(g[y][x]==='.'&&!used.has(x+','+y)&&!enemies.some(e=>e.x===x&&e.y===y)&&!decor.some(d=>d.x===x&&d.y===y)){decor.push({k:k%2?'hgt_reeds':'hgt_vine_roundleaf',x,y,block:false,walk:true,deco:true})}}
  const L={rows:g.map(r=>r.join('')),start:{x:dIn?dIn.ax:1,y:dIn?dIn.ay:1,f:0},enemies,items:[],decor,chars,day:0,amb:.7,floor:'water',floor2:'water',name:LEVEL_NAMES[id],label:LEVEL_NAMES[id],diff:HGDB.DIFF,ceilH:2.6,torchGap:1e9,noTele:true,noExtras:true,portals:[],lights:basins.map(b=>[b.cx,b.cy]),
    _hgdb:{docks:{in:dIn,out:dOut},basins:basins.length},mapNames:[{t:LEVEL_NAMES[id],x:35,y:35,k:'place'}]};
  LEVELS[id]=L}
KH_LAZY[HGDB.A]=()=>{hgBuild();hgdBuild();hgdbBuild(HGDB.A)};KH_LAZY[HGDB.B]=()=>{hgBuild();hgdBuild();hgdbBuild(HGDB.B)};
/* ---------- the docks on the surface: in four fairly empty parts of the maze ---------- */
function hgdbDocks(L){
  if(L._hgdb)return;const M=L._hgdm,W=M.W,P=L._hgdp,rows=L.rows.map(r=>r.split('')),kind=M.kind,open=(x,y)=>rows[y]&&rows[y][x]==='.',rnd=hgdmRng(478999);
  const occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  // how full is each window of the maze? (people, finds, creatures, doors, steps, ladders, stones, towns and danger zones all count)
  const feats=L.decor.concat(L.items,L.enemies).map(d=>[d.x,d.y,1]);for(const z of P.zones)feats.push([z.x,z.y,z.type==='safe'?40:z.r*2]);for(const k in (L._hgds?L._hgds.doors:{})){const p=k.split(',');feats.push([+p[0],+p[1],1])}
  const win=30,wins=[];for(let wy=6;wy+win<W-6;wy+=10)for(let wx=6;wx+win<W-6;wx+=10){let sc=0;for(const f of feats)if(f[0]>=wx&&f[0]<wx+win&&f[1]>=wy&&f[1]<wy+win)sc+=f[2];wins.push({x:wx,y:wy,sc})}
  wins.sort((a,b)=>a.sc-b.sc);const pick=[];for(const w of wins){if(pick.length>=4)break;if(pick.every(p=>Math.hypot(p.x-w.x,p.y-w.y)>=60))pick.push(w)}
  const TM=ohTiles(),chD=String.fromCharCode(0x360);OH_STY.hgdb_dock=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:hgdbTexDock(),door:hgdbTexDock(),win:hgdbTexDock(),alt:hgdbTexDock(),zoom:1,contrast:1,tint:[255,255,255,0]});L.chars[chD]=TM.make('plain','hgdb_dock',2.7).gid;
  const docks=[];pick.forEach((w,i)=>{const cx=w.x+(win>>1),cy=w.y+(win>>1),c=[];
    for(let y=w.y;y<w.y+win;y++)for(let x=w.x;x<w.x+win;x++){if(!open(x,y)||!reach.has(x+','+y)||occ.has(x+','+y)||kind[y*W+x])continue;if(P.zones.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+(z.type==='safe'?3:2)))continue;
      for(const [a,b] of [[0,-1],[1,0],[0,1],[-1,0]]){const wx=x+a,wy=y+b,cc=rows[wy][wx];if(cc==='.'||cc.charCodeAt(0)<0x2e0||cc.charCodeAt(0)>=0x2e8)continue;c.push([x,y,wx,wy,a,b,Math.hypot(x-cx,y-cy)]);break}}
    c.sort((a,b)=>a[6]-b[6]);const e=c[0];if(e){docks.push({ax:e[0],ay:e[1],x:e[2],y:e[3],dx:e[4],dy:e[5],level:i<2?HGDB.A:HGDB.B,end:i%2===0?'in':'out'});occ.add(e[0]+','+e[1])}});
  for(const d of docks)rows[d.y][d.x]=chD;
  L.rows=rows.map(r=>r.join(''));L._hgdb={docks,windows:pick.map(p=>p.sc)}}
// the surface map marks the docks
{const _dn=hgdmpDrawNames;hgdmpDrawNames=function(vi){try{const L=LEVELS[HGD.ID],V=MPL.view;if(L&&L._hgdb&&V&&V.z&&vi!==5){const A=V.area,z=V.z;ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
    for(const d of L._hgdb.docks){const px=A.x+(V.X(d.x+.5)-V.sx0)*z,py=A.y+(V.Y(d.y+.5)-V.sy0)*z;if(px<A.x||px>A.x+A.w||py<A.y||py>A.y+A.h)continue;hgdmpBoatIcon(ctx,px,py,Math.max(.9,Math.min(1.6,.7+z*.12)))}
    ctx.restore()}}catch(e){}return _dn.apply(this,arguments)}}
/* ---------- hopping on, and landing ---------- */
function hgdbPrompt(text,opts){G.talk={d:{k:'_',x:G.P.x,y:G.P.y},n:{name:'A dock'},node:say(text,opts),t:G.time,btns:[]};G.hold=null;G.queued=null}
function hgdbGo(dk,toBoat){
  const S=LEVELS[HGD.ID]._hgdb.docks;
  if(toBoat){const lv=dk.level;try{hgdbBuild(lv)}catch(e){console.error(e)}const L=LEVELS[lv];if(!L)return;const d=dk.end==='in'?L._hgdb.docks.in:L._hgdb.docks.out;if(!d)return;
    goToLevel(lv,{x:d.ax,y:d.ay,f:DIRS.findIndex(q=>q[0]===-d.dx&&q[1]===-d.dy)});G.cut=null;msg('You step into the boat and push off. Steer it with the arrows. The vines hang low, and things move in the water.','#9fe0c0')}
  else{goToLevel(HGD.ID,{x:dk.ax,y:dk.ay,f:DIRS.findIndex(q=>q[0]===-dk.dx&&q[1]===-dk.dy)});G.cut=null;msg('The boat bumps the dock. You climb out and walk on.','#e8e0a0')}}
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===HGD.ID){const L=LEVELS[LEVEL],dk=L&&L._hgdb&&L._hgdb.docks.find(d=>d.x===nx&&d.y===ny);
      if(dk){sfx('locked');hgdbPrompt('A wooden dock, and a little boat tied to it. The water beyond is dark, and the walls are hung with vines. A boat can be steered through the canals to another part of the maze. Do you want to hop on?',[['Hop on.',()=>{G.talk=null;sfx('door');hgdbGo(dk,true);return null}],['Not now.',()=>null]]);return true}}
    else if(LEVEL===HGDB.A||LEVEL===HGDB.B){const L=LEVELS[LEVEL],dd=L&&L._hgdb;if(dd){for(const side of ['in','out']){const d=dd.docks[side];if(d&&d.x===nx&&d.y===ny){const sd=LEVELS[HGD.ID]._hgdb.docks.find(q=>q.level===LEVEL&&q.end===side);if(!sd)continue;
        hgdbPrompt(side==='in'?'The dock where you started. Do you want to land here and go back to the maze?':'The far dock. Do you want to land here and continue on foot?',[['Land.',()=>{G.talk=null;sfx('door');hgdbGo(sd,false);return null}],['Keep steering.',()=>null]]);return true}}}}}catch(e){console.warn('hgdb',e)}
  return _db.apply(this,arguments)}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('There are docks in two lonely parts of the maze, and a boat at each. The canals are hung with vines, and crocodiles live in them.');
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdr)try{hgdbDocks(L)}catch(e){console.error('hgdb docks',e)}}}
