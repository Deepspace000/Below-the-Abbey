/* ==========================================================================
   THE DROWNED MAZE (prefix hgdw / HGDW), level 477: a flooded part of the labyrinth. Four flights of steps in the pond-side clearings of the maze go down into the water (one in each
   quarter). It is a real underwater level of the game's own system: the party needs a Diving Helm or a Bubble Helm (a hero without one drowns), has four minutes of air, and breathes at
   the bubble vents set in its chambers. Sea creatures swim its passages, shell chests hold pearls and gems, and a warden sleeps at the far end. The same four stairs lead back up.
   ========================================================================== */
const HGDW={ID:477,DIFF:74,N:4,S:61};
LEVEL_NAMES[HGDW.ID]='The Drowned Maze';LEVEL_RATING[HGDW.ID]=HGDW.DIFF;
if(typeof HGTE!=='undefined'&&HGTE.wet)HGTE.wet.add(HGDW.ID); // this makes it a true underwater level (air counter, drowning, hauled up to the surface)
/* ---------- the steps: wall tiles drawn in code (stone steps going down into green water, and the same going up) ---------- */
function hgdwTex(up){const key='hgdw_steps_'+(up?'up':'down');if(IMG[key])return key;
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{const b=IMG.tex_abbeywall;if(b)x.drawImage(b,0,0,w,h);else{x.fillStyle='#3a4a48';x.fillRect(0,0,w,h)}
    x.fillStyle='rgba(0,20,30,.3)';x.fillRect(0,0,w,h);
    // an arched opening, with the water inside it and steps going down into it
    const g=x.createLinearGradient(0,10,0,h);if(up){g.addColorStop(0,'#bfe8f0');g.addColorStop(1,'#1a5a6a')}else{g.addColorStop(0,'#1a5a6a');g.addColorStop(1,'#04141c')}
    x.fillStyle=g;x.beginPath();x.moveTo(20,h);x.lineTo(20,52);x.quadraticCurveTo(20,12,64,12);x.quadraticCurveTo(108,12,108,52);x.lineTo(108,h);x.closePath();x.fill();x.strokeStyle='#0c1418';x.lineWidth=3;x.stroke();
    for(let i=0;i<6;i++){const y=h-6-i*17,a=26+i*3,bw=76-i*6;x.fillStyle=up?'rgba(200,200,190,'+(.85-i*.1)+')':'rgba(180,190,185,'+(.9-i*.14)+')';x.fillRect(a+6,y-12,bw-8,12);x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=1.2;x.strokeRect(a+6,y-12,bw-8,12)}
    x.strokeStyle='rgba(180,240,255,.55)';x.lineWidth=1.4;for(let i=0;i<4;i++){x.beginPath();x.moveTo(30,28+i*9);x.quadraticCurveTo(64,22+i*9,98,28+i*9);x.stroke()}
    x.fillStyle='rgba(230,215,160,.85)';x.beginPath();if(up){x.moveTo(64,4);x.lineTo(74,14);x.lineTo(54,14)}else{x.moveTo(64,16);x.lineTo(74,6);x.lineTo(54,6)}x.closePath();x.fill();
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.strokeRect(1.5,1.5,w-3,h-3)});
  return key}
/* ---------- the four entrances on the surface: in clearings beside a pond ---------- */
function hgdwEntrances(L){
  if(L._hgdw)return;const M=L._hgdm,W=M.W,H=M.H,rows=L.rows.map(r=>r.split('')),kind=M.kind,rnd=hgdmRng(477001),open=(x,y)=>rows[y]&&rows[y][x]==='.',P=L._hgdp;
  const occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const TM=ohTiles(),ch=String.fromCharCode(0x350);
  OH_STY.hgdw_down=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:hgdwTex(false),door:hgdwTex(false),win:hgdwTex(false),alt:hgdwTex(false),zoom:1,contrast:1,tint:[255,255,255,0]});L.chars[ch]=TM.make('plain','hgdw_down',2.7).gid;
  const pond=(x,y)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++)if(L.fmap[y+dy]&&L.fmap[y+dy][x+dx]==='5')return true;return false};
  const out=[];
  for(const [qx,qy] of [[0,0],[100,0],[0,100],[100,100]]){let best=null;const c=[];
    for(let y=Math.max(4,qy);y<Math.min(H-4,qy+101);y++)for(let x=Math.max(4,qx);x<Math.min(W-4,qx+101);x++){if(!open(x,y)||!reach.has(x+','+y)||occ.has(x+','+y)||!kind[y*W+x]||!pond(x,y))continue;if(P.zones.some(z=>z.type==='danger'&&Math.hypot(z.x-x,z.y-y)<=z.r+2))continue;
      for(const [a,b] of [[0,-1],[1,0],[0,1],[-1,0]]){const wx=x+a,wy=y+b,cc=rows[wy][wx];if(cc==='.'||cc.charCodeAt(0)<0x2e0||cc.charCodeAt(0)>=0x2e8)continue;c.push([x,y,wx,wy,a,b]);break}}
    c.sort(()=>rnd()-.5);best=c.find(z=>out.every(o=>Math.hypot(o.ax-z[0],o.ay-z[1])>=30));if(best){out.push({ax:best[0],ay:best[1],x:best[2],y:best[3],dx:best[4],dy:best[5]});occ.add(best[0]+','+best[1])}}
  for(const e of out)rows[e.y][e.x]=ch;
  L.rows=rows.map(r=>r.join(''));L._hgdw={entrances:out}}
/* ---------- the flooded maze itself ---------- */
function hgdwBuild(){
  if(LEVELS[HGDW.ID])return;if(!LEVELS[HGD.ID]||!LEVELS[HGD.ID]._hgdw){try{hgBuild();hgdBuild()}catch(e){console.error(e)}}
  const SU=LEVELS[HGD.ID]._hgdw.entrances,S=HGDW.S,N=(S-1)>>1,rnd=hgdmRng(477002),g=[];for(let y=0;y<S;y++)g.push(new Array(S).fill('#'));
  const seen=new Uint8Array(N*N),st=[[0,0,-1]],D=[[0,-1],[1,0],[0,1],[-1,0]];seen[0]=1;g[1][1]='.';
  while(st.length){const [i,j,pd]=st[st.length-1],opts=[];for(let d=0;d<4;d++){const ni=i+D[d][0],nj=j+D[d][1];if(ni>=0&&nj>=0&&ni<N&&nj<N&&!seen[nj*N+ni])opts.push(d)}
    if(!opts.length){st.pop();continue}let d=opts[(rnd()*opts.length)|0];if(pd>=0&&opts.includes(pd)&&rnd()<.5)d=pd;const ni=i+D[d][0],nj=j+D[d][1];seen[nj*N+ni]=1;g[2*j+1+D[d][1]][2*i+1+D[d][0]]='.';g[2*nj+1][2*ni+1]='.';st.push([ni,nj,d])}
  for(let y=2;y<S-2;y++)for(let x=2;x<S-2;x++)if(g[y][x]==='#'&&((y%2===1&&x%2===0&&g[y][x-1]==='.'&&g[y][x+1]==='.')||(y%2===0&&x%2===1&&g[y-1][x]==='.'&&g[y+1][x]==='.'))&&rnd()<.07)g[y][x]='.';
  // chambers: bigger rooms in the maze, each with a bubble vent
  const rooms=[];for(let k=0;k<10;k++){const w=5+((rnd()*3)|0),h=5+((rnd()*3)|0),x0=3+((rnd()*(S-w-6))|0),y0=3+((rnd()*(S-h-6))|0);if(rooms.some(r=>Math.abs(r.x-x0)<12&&Math.abs(r.y-y0)<12))continue;for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)g[y][x]='.';rooms.push({x:x0,y:y0,w,h,cx:x0+(w>>1),cy:y0+(h>>1)})}
  const vents=rooms.map(r=>[r.cx,r.cy]);
  for(let t=0;t<600&&vents.length<12;t++){const x=2+((rnd()*(S-4))|0),y=2+((rnd()*(S-4))|0);if(g[y][x]==='.'&&vents.every(v=>Math.hypot(v[0]-x,v[1]-y)>=13))vents.push([x,y])} // more vents along the passages, so the air is never far
  // the four stairs up: at the ends of four far-apart passages (the same ones the entrances lead to)
  const TM=ohTiles(),chars={};
  OH_STY.hgdw_wall=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'art_tex_hgt_w2_bubbles',door:'art_tex_hgt_w2_bubbles',win:'art_tex_hgt_w2_bubbles',alt:'art_tex_hgt_w2_bubbles',zoom:1,contrast:1,tint:[20,120,150,.35]});
  OH_STY.hgdw_up=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:hgdwTex(true),door:hgdwTex(true),win:hgdwTex(true),alt:hgdwTex(true),zoom:1,contrast:1,tint:[255,255,255,0]});
  chars['#']=TM.make('plain','hgdw_wall',2.7).gid;const chUp=String.fromCharCode(0x351);chars[chUp]=TM.make('plain','hgdw_up',2.7).gid;
  const corners=[[1,1],[S-2,1],[1,S-2],[S-2,S-2]],stairs=[];
  corners.forEach((c,i)=>{const e=SU[i];if(!e)return;let best=null,bd=1e9;for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){if(g[y][x]!=='.')continue;let deg=0,wall=null;for(const [a,b] of D){if(g[y+b][x+a]==='.')deg++;else if(g[y+b][x+a]==='#'&&y+b>0&&x+a>0&&y+b<S-1&&x+a<S-1)wall=[x+a,y+b,a,b]}
      if(deg<=2&&wall&&!stairs.some(s=>Math.hypot(s.ax-x,s.ay-y)<6)){const d=Math.hypot(x-c[0],y-c[1]);if(d<bd){bd=d;best=[x,y,wall]}}}
    if(best){const [x,y,w]=best;g[w[1]][w[0]]=chUp;stairs.push({i,ax:x,ay:y,x:w[0],y:w[1],dx:w[2],dy:w[3]})}});
  const used=new Set(stairs.map(s=>s.ax+','+s.ay));vents.forEach(v=>used.add(v[0]+','+v[1]));
  const cells=[];for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++)if(g[y][x]==='.'&&!used.has(x+','+y)&&!stairs.some(s=>Math.hypot(s.ax-x,s.ay-y)<5))cells.push([x,y]);
  const take=()=>cells.length?cells.splice((rnd()*cells.length)|0,1)[0]:null;
  const decor=[],enemies=[],items=[];
  for(const v of vents)decor.push({k:'uw_vent0',x:v[0],y:v[1],block:false,walk:true,deco:true});
  const kinds=[['uwshark',5],['uwbarra',7],['uwcrab',8],['uwoctopus',4],['uwjelly',7],['uweel',5],['uwpuffer',4]];let list=[];for(const [k,n] of kinds)for(let i=0;i<n;i++)list.push(k);
  for(const k of list){const c=take();if(c)enemies.push({t:k,x:c[0],y:c[1]})}
  // the warden sleeps in the room farthest from the first stairs, with the prize chest behind him
  const far=rooms.slice().sort((a,b)=>Math.hypot(b.cx-(stairs[0]?stairs[0].ax:1),b.cy-(stairs[0]?stairs[0].ay:1))-Math.hypot(a.cx-(stairs[0]?stairs[0].ax:1),a.cy-(stairs[0]?stairs[0].ay:1)))[0];
  if(far){enemies.push({t:'uwgulper',x:far.cx,y:far.cy+1});decor.push({k:'uw_shellchest',x:far.cx,y:far.cy-1,block:true,hgdwTier:3})}
  for(let k=0;k<12;k++){const c=take();if(c)decor.push({k:'uw_shellchest',x:c[0],y:c[1],block:true,hgdwTier:k%4===0?2:1})}
  for(let k=0;k<30;k++){const c=take();if(c)decor.push({k:['uw_staghorn','uw_brain','uw_kelp','uw_seafan','uw_rocks','uw_seagrass','uw_amphora'][k%7],x:c[0],y:c[1],block:false,walk:true,deco:true})}
  const swim=[];const R=(a,b,c)=>hash2(a,b,c+477);const lane=(k,cnt,hlo,hhi,spd,n0)=>{for(let q=0;q<cnt;q++)swim.push({k,x0:6+R(q,n0,5)*(S-12),y0:8+R(q,n0+1,5)*(S-16),dx:(R(q,n0+2,5)-.5)*40,dy:(R(q,n0+3,5)-.5)*30,h:hlo+R(q,n0+4,5)*(hhi-hlo),sp:spd*(.7+R(q,n0+5,5)*.6),ph:R(q,n0+6,5)*100,sz:.85+R(q,n0+7,5)*.3})};
  lane('reef',8,.5,1.8,.9,60);lane('angel',5,.6,2,.8,70);lane('school',5,.8,2.4,1.0,80);lane('turtle',1,.5,1.4,.35,90);lane('jelly',3,1,2.6,.3,150);
  const a0=stairs[0]||{ax:1,ay:1};
  const fm=[];for(let y=0;y<S;y++)fm.push('0'.repeat(S));
  const L={rows:g.map(r=>r.join('')),start:{x:a0.ax,y:a0.ay,f:0},enemies,items,decor,chars,fmap:fm,floorSet:['seabed1','seabed2','seabed3','sand','sand','seabed4'],floor:'seabed1',day:0,amb:.8,name:'The Drowned Maze',label:'The Drowned Maze',noExtras:true,noTele:true,diff:HGDW.DIFF,ceilH:2.6,torchGap:1e9,lights:[],portals:[],
    _hgdw:{stairs,rooms:rooms.length},mapNames:[{t:'The Drowned Maze',x:30,y:30,k:'place'}]};
  UWS[HGDW.ID]={vents,swim};LEVELS[HGDW.ID]=L}
KH_LAZY[HGDW.ID]=()=>{hgBuild();hgdBuild();hgdwBuild()};
/* ---------- walking into the steps ---------- */
function hgdwPrompt(text,opts){G.talk={d:{k:'_',x:G.P.x,y:G.P.y},n:{name:'Steps'},node:say(text,opts),t:G.time,btns:[]};G.hold=null;G.queued=null}
function hgdwGo(i,down){
  const E=LEVELS[HGD.ID]._hgdw.entrances[i];if(!E)return;
  if(down){try{hgdwBuild()}catch(e){console.error(e)}const st=LEVELS[HGDW.ID]._hgdw.stairs.find(s=>s.i===i)||LEVELS[HGDW.ID]._hgdw.stairs[0];if(!st)return;
    (G.flags.hgtRet=G.flags.hgtRet||{})[HGDW.ID]={to:HGD.ID,x:E.ax,y:E.ay,f:DIRS.findIndex(d=>d[0]===-E.dx&&d[1]===-E.dy)};
    goToLevel(HGDW.ID,{x:st.ax,y:st.ay,f:DIRS.findIndex(d=>d[0]===-st.dx&&d[1]===-st.dy)});G.cut=null;msg('You go down the steps and under the water.','#9fe0f0')}
  else{G.uw=null;goToLevel(HGD.ID,{x:E.ax,y:E.ay,f:DIRS.findIndex(d=>d[0]===-E.dx&&d[1]===-E.dy)});G.cut=null;msg('You climb the steps out of the water.','#e8e0a0')}}
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===HGD.ID){const L=LEVELS[LEVEL],i=L&&L._hgdw&&L._hgdw.entrances.findIndex(e=>e.x===nx&&e.y===ny);
      if(i>=0){sfx('locked');const bare=typeof uwWho==='function'?uwWho():'',suited=typeof uwSuited==='function'&&uwSuited();
        hgdwPrompt('Steps lead down into dark green water. A flooded part of the maze lies below, and you cannot breathe there without a helm. '+(suited?(bare?'Only some of the party are helmed: '+bare+' will drown.':'The party is helmed.'):'Nobody in the party has a helm. Everyone would drown. A Diving Helm or a Bubble Helm is sold in the towns of the Hollow Lands and the islands.')+' Do you want to go down?',
          [['Go down.',()=>{G.talk=null;sfx('door');hgdwGo(i,true);return null}],['Not now.',()=>null]]);return true}}
    else if(LEVEL===HGDW.ID){const L=LEVELS[LEVEL],st=L&&L._hgdw&&L._hgdw.stairs.find(s=>s.x===nx&&s.y===ny);
      if(st){hgdwPrompt('Steps lead up out of the water. Do you want to climb up?',[['Climb up.',()=>{G.talk=null;sfx('door');hgdwGo(st.i,false);return null}],['Not yet.',()=>null]]);return true}}}catch(e){console.warn('hgdw',e)}
  return _db.apply(this,arguments)}}
/* the shell chests of the drowned maze: pearls, gems, gold */
{const _lf=lootFor;lootFor=function(d){
  if(LEVEL===HGDW.ID&&d&&d.hgdwTier){const r=k=>hash2(d.x,d.y,800+k),it=[],add=(id,n)=>it.push({id,n:ITEMDEF[id]&&ITEMDEF[id].stack?(n||1):1}),t=d.hgdwTier;
    add('pearl',t===3?4:t===2?2:1);add('gem_'+GEM_BY_VALUE[Math.min(39,10+Math.floor(r(1)*(t*8)))][0],1);if(t>=2)add(potionFor(r(2)));if(t===3){add('gem_'+GEM_BY_VALUE[Math.min(39,30+Math.floor(r(3)*10))][0],1);add('hgcrystal',2)}
    d.gold=t===3?1800+Math.floor(r(4)*1500):t===2?500+Math.floor(r(5)*400):120+Math.floor(r(6)*200);return it}
  return _lf.apply(this,arguments)}}
// the surface map marks the steps
{const _dn=hgdmpDrawNames;hgdmpDrawNames=function(vi){try{const L=LEVELS[HGD.ID],V=MPL.view;if(L&&L._hgdw&&V&&V.z&&vi!==5){const A=V.area,z=V.z;ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
    for(const e of L._hgdw.entrances){const px=A.x+(V.X(e.x+.5)-V.sx0)*z,py=A.y+(V.Y(e.y+.5)-V.sy0)*z;if(px<A.x||px>A.x+A.w||py<A.y||py>A.y+A.h)continue;
      hgdmpStepsIcon(ctx,px,py,Math.max(.9,Math.min(1.6,.7+z*.12)))}
    ctx.restore()}}catch(e){}return _dn.apply(this,arguments)}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('There are steps down into the water in four of the pond clearings. Below is a flooded maze. Bring a helm for everyone, or nobody will come back up with you.');
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdk)try{hgdwEntrances(L)}catch(e){console.error('hgdw entrances',e)}}}
