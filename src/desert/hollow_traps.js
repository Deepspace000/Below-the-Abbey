/* ==========================================================================
   THE DEATHTRAP. Floor 20 of the Orange Spire (level 459): the labyrinth between the two rooms is full of traps, and every step needs care.
   - FIREBALL PLATES: a plate hidden in the floor of a passage. Stepping on it wakes a painted mouth set in the wall at the end of the straight passage ahead; after a
     breath one fireball (sometimes two, one after the other) rolls down the passage toward the party, in real time, a glowing sprite with embers that can be seen from far
     off. It flies straight, is stopped by walls and by closed doors, and explodes on whatever stands in its way. The party can step back round a corner or into a side
     passage; every plate was placed with such a place within three steps and enough time to reach it (tested by hltDodgeSlack).
   - SPIKE TILES: a tile of a slightly different stone (a cooler tone and a fine seam round its edge). Walking onto it makes spikes shoot up. HOW I READ THE OWNER'S WORDS "can be
     avoided by pressing on the tile": in a one-square passage a tile cannot be walked round, so the party presses it from where it stands: with the tile directly ahead, a tap on
     the floor ahead, or the Attack key when there is nothing to hit, makes the hero press it with the butt of a weapon. The spikes shoot up harmlessly, sink back after a few
     seconds, and the tile is safe for good (remembered in F.tr, saved with the game).
   - NOTICING: a Thief, Assassin, Ranger or Archer, or any hero with 14 or more dexterity, may notice an undiscovered trap one or two squares straight ahead and say that there
     might be a trap ahead. Never which tile and never what kind; nothing is marked on any map.
   - SENSE TRAPS: a Thief power (the tenth power of the class), see the end of this file.
   - JUMP SCARES: a few tiles on floors 14 to 20 make a figure appear in front of the party for a moment and vanish.
   - LETTERS OF THE MESSENGER OF DEATH: floor 20 holds all five (D and E painted at corridor ends on the way, A, T and H behind secret doors in alcoves of the labyrinth's outer
     wall), and floors 16, 17 and 18 hold an omen each (D, E, A) behind a secret door of an obviously different stone. The letters seen are one list for the whole game.
   ========================================================================== */
const HLT_V=2,HLT_T0=.55,HLT_R=.45,HLT_STEP=.192,HLT_MARGIN=.15; // fireball: cells per second, the breath before it flies, a player's reaction, seconds per step of the party, slack needed
const HLT_TOP=HL.BASE+HL.N-1,HLT_D4=[[0,-1],[1,0],[0,1],[-1,0]];
const HLT={fb:[],boom:[],spk:[],scare:null,light:null,flash:0,flashCol:'255,140,40',sense:{until:-1,hi:0},lv:-1,dec:null,clock:0,seed:1};
loadImg('hl_nozzle','assets/hl_fire.png');NPC_H.hl_nozzle=.8; // the painted fireplace with a screaming face, hung at the end of a passage: the mouth that spits the fireball
/* ---- the stone of a spike tile: the paving of the spire (tombslab, painted) a little cooler and greyer, with a fine dark seam inset from the edge of the tile ---- */
function hltFloors(){
  const src=FLOORS.tombslab;if(!src||(FLOORS.hlspike&&FLOORS.hlspike._src===src))return false;
  const d=new Uint8ClampedArray(src.length);
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4,e=Math.min(x,y,127-x,127-y);let r=src[i],g=src[i+1],b=src[i+2];
    const l=r*.3+g*.59+b*.11;r=(l+(r-l)*.78)*.91;g=(l+(g-l)*.78)*.96;b=(l+(b-l)*.78)*1.07; // cooler, greyer
    if(e>=5&&e<=7){r*=.38;g*=.38;b*=.38}else if(e===8||e===4){r*=1.16;g*=1.16;b*=1.16} // the seam, with a faint lip either side
    d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255}
  d._src=src;FLOORS.hlspike=d;return true}
const hltBfs=(open,sx,sy)=>{const dist=new Map(),par=new Map(),q=[[sx,sy]];dist.set(sx+','+sy,0);
  for(let i=0;i<q.length;i++){const [x,y]=q[i],d=dist.get(x+','+y);for(const [a,b] of HLT_D4){const nx=x+a,ny=y+b,kk=nx+','+ny;if(!dist.has(kk)&&open(nx,ny)){dist.set(kk,d+1);par.set(kk,[x,y]);q.push([nx,ny])}}}
  return {dist,par}};
/* the seconds of slack a plate gives: for a ball that starts HLT_T0 after the click at s=0 and flies HLT_V cells a second, and a party at s=n that needs HLT_R to react and
   HLT_STEP a step, how long before the ball reaches the tile where the party leaves the line (the tile B at s) after the party has gone */
const hltDodgeSlack=(n,s)=>{const steps=Math.abs(s-n);return (HLT_T0+(s-.45)/HLT_V)-(HLT_R+steps*HLT_STEP)};
/* ==========================================================================
   BUILDING: called from the end of hlBuild (hollow.js) for every floor of the spire
   ========================================================================== */
function hlTrapsBuild(c){try{hltBuildAll(c)}catch(e){console.error('hlTrapsBuild',e)}}
function hltBuildAll(c){
  if(c.violet)return;
  const {k,lv,rows,W,H,decor,used,hs,secretCh}=c,key=(x,y)=>x+','+y;
  lv._traps=[];lv._scares=[];lv._ldoors=[];
  const jit=(x,y,s)=>hs(x*13+s,y*7+k,911+s);
  const setC=(x,y,ch)=>{rows[y]=rows[y].slice(0,x)+ch+rows[y].slice(x+1)};
  const wallAt=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]!=='.'&&rows[y][x]!=='0'&&rows[y][x]!=='1';
  const floorAt=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.';
  const alcoveOK=(cx,cy,w)=>{const px=-w[1],py=w[0],Wd=[cx+w[0],cy+w[1]],A=[cx+2*w[0],cy+2*w[1]],F=[cx+3*w[0],cy+3*w[1]];
    if(!wallAt(Wd[0],Wd[1])||!wallAt(A[0],A[1])||!wallAt(F[0],F[1]))return false;
    if(!wallAt(A[0]+px,A[1]+py)||!wallAt(A[0]-px,A[1]-py)||!wallAt(F[0]+px,F[1]+py)||!wallAt(F[0]-px,F[1]-py))return false;
    if(used.has(key(A[0],A[1]))||used.has(key(Wd[0],Wd[1])))return false;
    return !lv._ldoors.some(q=>Math.abs(q.x-Wd[0])+Math.abs(q.y-Wd[1])<5)&&!(lv._secrets||[]).some(q=>Math.abs(q.x-Wd[0])+Math.abs(q.y-Wd[1])<3)};
  const makeAlcove=(cx,cy,w,letter)=>{const Wd=[cx+w[0],cy+w[1]],A=[cx+2*w[0],cy+2*w[1]]; // a door of different stone in the wall, and a one-square alcove behind it; the letter is on its far wall
    setC(Wd[0],Wd[1],secretCh);setC(A[0],A[1],'.');lv._ldoors.push({x:Wd[0],y:Wd[1],ax:A[0],ay:A[1],k:letter});used.add(key(A[0],A[1]));used.add(key(Wd[0],Wd[1]));used.add(key(cx,cy));
    return {k:letter,x:A[0],y:A[1],wd:[w[0],w[1]]}};
  const H_={key,jit,setC,wallAt,floorAt,alcoveOK,makeAlcove};
  if(c.top&&c.plan&&c.plan.maze)try{hltMaze(c,H_)}catch(e){console.error('hltMaze',e)}
  // the omens: one letter behind a secret door on floors 16, 17 and 18
  const OM={15:'D',16:'E',17:'A'}[k];
  if(OM){const cands=[],inRoom=(x,y)=>c.rooms.some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
    for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!floorAt(x,y)||c.d[y*W+x]<6||used.has(key(x,y)))continue;
      for(const w of HLT_D4)if(alcoveOK(x,y,w))cands.push([x,y,w,inRoom(x,y)?0:1,jit(x,y,5)])}
    cands.sort((p,q)=>p[3]-q[3]||p[4]-q[4]);
    if(cands.length){const [x,y,w]=cands[0],let1=makeAlcove(x,y,w,OM);
      if(lv._msgr){lv._msgr.letters.push(let1);lv._omen=let1} // (floors 17 and 18 already have the Messenger and a letter set of their own; the omen joins it)
      else lv._letters=[let1]}}
  // jump scares on floors 14 to 19 (the labyrinth has its own, placed by hltMaze)
  const SC_N={13:1,14:1,15:2,16:1,17:2,18:2}[k];
  if(SC_N){const trig=new Set((lv._trig||[]).map(t=>key(t.x,t.y))),cands=[];
    const fl=(x,y)=>floorAt(x,y)&&!decor.some(q=>q.block&&q.x===x&&q.y===y);
    for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!floorAt(x,y)||c.d[y*W+x]<8||used.has(key(x,y))||trig.has(key(x,y)))continue;
      for(const u of HLT_D4)if(fl(x-u[0],y-u[1])&&fl(x+u[0],y+u[1])&&fl(x+2*u[0],y+2*u[1])&&fl(x+3*u[0],y+3*u[1])){cands.push([x,y,jit(x,y,9)]);break}}
    cands.sort((p,q)=>p[2]-q[2]);
    for(const q of cands){if(lv._scares.length>=SC_N)break;if(lv._scares.every(s=>Math.max(Math.abs(s.x-q[0]),Math.abs(s.y-q[1]))>=7))lv._scares.push({x:q[0],y:q[1]})}}
}
/* the labyrinth of floor 20: letters, secret alcoves, traps, jump scares, a floor of different stone under the spike tiles */
function hltMaze(c,h){
  const {lv,rows,used,decor,k,hs}=c,M=c.plan.maze,key=h.key,jit=h.jit,x0=M.x0,x1=M.x1,y0=M.y0,y1=M.y1;
  const inR=(x,y)=>x>=x0&&x<=x1&&y>=y0&&y<=y1,open=(x,y)=>inR(x,y)&&rows[y][x]==='.';
  let E=null,X=null;for(let x=x0;x<=x1;x++){if(rows[y1][x]==='.')E=[x,y1];if(rows[y0][x]==='.')X=[x,y0]}
  if(!E||!X)return;
  const {dist,par}=hltBfs(open,E[0],E[1]),dd=(x,y)=>dist.get(key(x,y));
  const sol=[];for(let cur=X;cur;cur=par.get(key(cur[0],cur[1])))sol.push(cur);sol.reverse();
  const onSol=new Set(sol.map(p=>key(p[0],p[1]))),tiles=[];for(const kk of dist.keys())tiles.push(kk.split(',').map(Number));
  const deg=(x,y)=>HLT_D4.reduce((n,[a,b])=>n+(open(x+a,y+b)?1:0),0),reserved=new Set(),letters=[];
  const tdir=(x,y)=>{const p=par.get(key(x,y));return p?[x-p[0],y-p[1]]:null}; // the way the party walks into a tile, coming from the entrance
  // 1) the two obvious letters, D and E: painted on the wall at the end of a straight run that the way through turns at, early on
  const corners=[];
  for(let i=5;i<Math.min(44,sol.length-3);i++){const p=sol[i],a=sol[i-1],b=sol[i+1],din=[p[0]-a[0],p[1]-a[1]],dout=[b[0]-p[0],b[1]-p[1]];if(din[0]===dout[0]&&din[1]===dout[1])continue;
    let run=0;while(i-run-1>=0){const q=sol[i-run-1],t2=sol[i-run];if(!(t2[0]-q[0]===din[0]&&t2[1]-q[1]===din[1]))break;run++;if(run>=6)break}
    if(run>=3&&!used.has(key(p[0],p[1])))corners.push({i,p,din,run})}
  let D=corners[0],E2=D&&corners.find(q=>q.i>=D.i+8);if(D&&!E2)E2=corners.find(q=>q.i>D.i+4);
  [['D',D],['E',E2]].forEach(([l,q])=>{if(q){letters.push({k:l,x:q.p[0],y:q.p[1],wd:q.din,obvious:1});reserved.add(key(q.p[0],q.p[1]));used.add(key(q.p[0],q.p[1]))}});
  // 2) the three hidden ones, A, T and H: a door of different stone in the outer wall at a dead end (or, failing that, anywhere along it), an alcove behind it
  const ring=[];
  for(const [x,y] of tiles){if(x===E[0]&&y===E[1]||x===X[0]&&y===X[1])continue;
    const ws=[];if(x===x0+1)ws.push([-1,0]);if(x===x1-1)ws.push([1,0]);if(y===y0+1)ws.push([0,-1]);if(y===y1-1)ws.push([0,1]);
    for(const w of ws)if(h.alcoveOK(x,y,w)&&!reserved.has(key(x,y)))ring.push({x,y,w,dead:deg(x,y)===1?0:1,d:dd(x,y),j:jit(x,y,3)})}
  ring.sort((p,q)=>p.dead-q.dead||p.j-q.j);
  const picked=[];
  for(const r of ring){if(picked.length>=3)break;if(picked.every(p=>Math.abs(p.x-r.x)+Math.abs(p.y-r.y)>=8)&&!(letters.some(l=>Math.abs(l.x-r.x)+Math.abs(l.y-r.y)<4)))picked.push(r)}
  picked.sort((p,q)=>p.d-q.d);
  picked.forEach((r,i)=>{if(!h.alcoveOK(r.x,r.y,r.w))return;letters.push(h.makeAlcove(r.x,r.y,r.w,'ATH'[i]));reserved.add(key(r.x,r.y))});
  lv._letters=letters;
  // 3) the traps: eight fireball plates (as many as possible on the way through) and eight spike tiles, never near the entrance, never closer than three steps to one another
  const placed=[],nozz=new Set(),fireAt=new Map(),rej={ahead:0,short:0,back:0,mouth:0,dodge:0,ok:0};
  const mouthOK=(S,u)=>{const here=decor.filter(q=>q.x===S[0]&&q.y===S[1]);return !reserved.has(key(S[0],S[1]))&&!here.some(q=>q.block||q.k==='hl_nozzle'&&!(q.wd[0]===u[0]&&q.wd[1]===u[1]))}; // (a corridor picture on the very wall is replaced by the mouth)
  const fireInfo=(px,py)=>{const td=tdir(px,py);if(!td){rej.ahead++;return null}const u=td; // the passage ahead of the party, to a wall: the mouth is at its end
    let n=0;while(open(px+u[0]*(n+1),py+u[1]*(n+1)))n++;
    const wx=px+u[0]*(n+1),wy=py+u[1]*(n+1);if(n<3||!inR(wx,wy)||rows[wy][wx]==='.'){rej.short++;return null}
    let m=0;while(open(px-u[0]*(m+1),py-u[1]*(m+1)))m++;
    const bx=px-u[0]*(m+1),by=py-u[1]*(m+1);if(!inR(bx,by)||rows[by][bx]==='.'){rej.back++;return null} // the line ends in a wall at both ends, inside the labyrinth
    const S=[px+u[0]*n,py+u[1]*n],nk=key(S[0],S[1])+'|'+u;if(!mouthOK(S,u)){rej.mouth++;return null}
    let dod=null;const Ls=s=>[px+u[0]*(n-s),py+u[1]*(n-s)];
    for(let s=0;s<=n+m;s++){const B=Ls(s),steps=Math.abs(s-n);if(steps+1>3)continue;
      for(const q of [[-u[1],u[0]],[u[1],-u[0]]]){const Q=[B[0]+q[0],B[1]+q[1]];if(!open(Q[0],Q[1]))continue;const sl=hltDodgeSlack(n,s);if(sl>=HLT_MARGIN&&(!dod||sl>dod.slack))dod={B,Q,s,slack:sl,steps:steps+1}}}
    if(!dod){rej.dodge++;return null}
    rej.ok++;return {x:px,y:py,u,n,m,S,W:[wx,wy],dod,end:Ls(n+m),long:n>=6,nk}};
  for(const [x,y] of tiles){if((dd(x,y)||0)<6||(X[0]===x&&X[1]===y))continue;const f=fireInfo(x,y);if(f)fireAt.set(key(x,y),f)}
  const spot=(x,y,md)=>!reserved.has(key(x,y))&&!used.has(key(x,y))&&placed.every(t=>(t.map.get(key(x,y))===undefined?99:t.map.get(key(x,y)))>=md);
  const add=t=>{t.map=hltBfs(open,t.x,t.y).dist;placed.push(t);
    if(t.t==='fire'&&!nozz.has(t.nk)){nozz.add(t.nk);
      for(let i=decor.length-1;i>=0;i--){const q=decor[i];if(q.x===t.S[0]&&q.y===t.S[1]&&q.pic&&q.wd&&q.wd[0]===t.u[0]&&q.wd[1]===t.u[1])decor.splice(i,1)}
      decor.push({k:'hl_nozzle',x:t.S[0],y:t.S[1],wd:[t.u[0],t.u[1]],pic:1,block:false,walk:true,deco:true,bob:.32});used.add(key(t.S[0],t.S[1]))}
    return t};
  const tryFire=(x,y)=>{const f=fireAt.get(key(x,y));if(!f||!spot(x,y,3)||!mouthOK(f.S,f.u))return false;add(Object.assign({t:'fire',two:jit(x,y,7)<.4},f));return true};
  const trySpike=(x,y)=>{if((dd(x,y)||0)<5||(X[0]===x&&X[1]===y)||dd(x,y)>=dd(X[0],X[1])-1||!spot(x,y,4))return false;add({t:'spike',x,y});return true};
  const L=sol.length,lo=6,hi=L-4,nsl=9,span=(hi-lo)/nsl,slotIdx=j=>{const a=Math.floor(lo+j*span),b=Math.floor(lo+(j+1)*span),idx=[];for(let i=a;i<b&&i<L;i++)idx.push(i);return idx.sort((p,q)=>jit(sol[p][0],sol[p][1],11)-jit(sol[q][0],sol[q][1],11))};
  const lg=(x,y)=>{const f=fireAt.get(key(x,y));return f&&f.n>=5?0:1}; // a long passage first: the ball is seen coming from further off
  let nf=0,ns=0;
  for(let j=0;j<nsl&&nf<6;j++){const idx=slotIdx(j).sort((p,q)=>lg(sol[p][0],sol[p][1])-lg(sol[q][0],sol[q][1]));for(const i of idx)if(tryFire(sol[i][0],sol[i][1])){nf++;break}} // six fireball plates on the way through, one in each slot that has a place for one
  const rest=[...fireAt.values()].sort((p,q)=>(p.n>=5?0:1)-(q.n>=5?0:1)||jit(p.x,p.y,15)-jit(q.x,q.y,15));
  for(const f of rest){if(nf>=8)break;if(tryFire(f.x,f.y))nf++} // and the rest in side passages, or on the way if there is room
  const sp=[0,1,2,3,4,5,6,7,8].map(slotIdx);
  for(let j=0;j<nsl&&ns<5;j++)for(const i of sp[j])if(trySpike(sol[i][0],sol[i][1])){ns++;break} // five spike tiles on the way through
  const side=tiles.filter(([x,y])=>!onSol.has(key(x,y))&&(dd(x,y)||0)>=8).sort((p,q)=>jit(p[0],p[1],13)-jit(q[0],q[1],13));
  for(const [x,y] of side){if(ns>=8)break;if(trySpike(x,y))ns++}
  for(let j=0;j<nsl&&ns<8;j++)for(const i of sp[j])if(trySpike(sol[i][0],sol[i][1])){ns++;break}
  for(const t of placed)lv._traps.push({t:t.t,x:t.x,y:t.y,u:t.u,n:t.n,m:t.m,S:t.S,W:t.W,dod:t.dod,end:t.end,long:t.long,two:t.two,onSol:onSol.has(key(t.x,t.y))});
  // side alcoves: along every fireball passage, one-square niches dug into the side walls where the walls are thick enough, so the party can step out of the way of the slow ball
  lv._niches=[];const rawO=(x,y)=>!!rows[y]&&rows[y][x]==='.';
  for(const t of lv._traps){if(t.t!=='fire')continue;const u=t.u;
    for(let i=-t.m;i<=t.n;i++){const cx=t.x+u[0]*i,cy=t.y+u[1]*i;if(!open(cx,cy)||reserved.has(key(cx,cy)))continue;
      for(const q of [[-u[1],u[0]],[u[1],-u[0]]]){const nx=cx+q[0],ny=cy+q[1];
        if(nx<2||ny<2||ny>=rows.length-2||nx>=rows[0].length-2||rawO(nx,ny)||reserved.has(key(nx,ny))||decor.some(q=>q.x===nx&&q.y===ny&&(!q.wd||q.k==='hl_nozzle'||q.msgr||q.npc)))continue;
        if(HLT_D4.some(d=>{const ax=nx+d[0],ay=ny+d[1];return !(ax===cx&&ay===cy)&&(rawO(ax,ay)||reserved.has(key(ax,ay)))}))continue;
        if(lv._niches.some(z=>Math.abs(z[0]-nx)+Math.abs(z[1]-ny)<3))continue;
        for(let j=decor.length-1;j>=0;j--)if(decor[j].x===nx&&decor[j].y===ny)decor.splice(j,1);h.setC(nx,ny,'.');const fr=lv.fmap&&lv.fmap[cy];if(fr)lv.fmap[ny]=lv.fmap[ny].slice(0,nx)+fr[cx]+lv.fmap[ny].slice(nx+1);
        lv._niches.push([nx,ny]);break}}}
  // the spike tiles are a different stone
  hltFloors();
  if(lv._traps.some(t=>t.t==='spike')){if(!lv.floorSet.includes('hlspike'))lv.floorSet=lv.floorSet.concat(['hlspike']);
    for(const t of lv._traps)if(t.t==='spike'){const r=lv.fmap[t.y];lv.fmap[t.y]=r.slice(0,t.x)+(lv.floorSet.indexOf('hlspike')+'')+r.slice(t.x+1)}}
  // 4) the jump scares of the labyrinth: four along the way through and two in side passages, each with a straight run of three tiles ahead of the party
  const trapAt=new Set(lv._traps.map(t=>key(t.x,t.y))),scareOK=(x,y,any)=>{const td=tdir(x,y);if(!td||trapAt.has(key(x,y))||reserved.has(key(x,y))||used.has(key(x,y)))return false;
    if((dd(x,y)||0)<5||dd(x,y)>=dd(X[0],X[1])-2)return false;
    if(!lv._traps.every(t=>Math.abs(t.x-x)+Math.abs(t.y-y)>=2))return false;
    const run=u=>{for(let i=1;i<=3;i++)if(!open(x+u[0]*i,y+u[1]*i))return false;return true};
    return run(td)||(any&&HLT_D4.some(run))}; // (a straight run of three tiles ahead of the party, the way it walks in; failing that, any way it might look)
  const sc=[],far=(x,y)=>sc.every(s=>Math.abs(s.x-x)+Math.abs(s.y-y)>=6);
  for(let j=0;j<4;j++){const a=Math.floor(7+j*(L-12)/4),b=Math.floor(7+(j+1)*(L-12)/4),idx=[];for(let i=a;i<b&&i<L;i++)idx.push(i);
    idx.sort((p,q)=>jit(sol[p][0],sol[p][1],17)-jit(sol[q][0],sol[q][1],17));
    for(const i of idx){const [x,y]=sol[i];if(scareOK(x,y)&&far(x,y)){sc.push({x,y});break}}}
  for(const [x,y] of side){if(sc.length>=6)break;if(scareOK(x,y)&&far(x,y))sc.push({x,y})}
  for(const [x,y] of tiles.slice().sort((p,q)=>jit(p[0],p[1],19)-jit(q[0],q[1],19))){if(sc.length>=6)break;if(scareOK(x,y,true)&&far(x,y))sc.push({x,y})}
  lv._scares=sc;
  lv._mazeInfo={E,X,sol,onSol,rej,solLen:L,nFire:lv._traps.filter(t=>t.t==='fire').length,nSpike:lv._traps.filter(t=>t.t==='spike').length};
}
/* ==========================================================================
   RUNNING: state, sounds, the fireballs, the spikes, noticing, jump scares
   ========================================================================== */
const hltLive=()=>G.heroes.map((h,i)=>i).filter(i=>G.heroes[i].alive&&G.heroes[i].hp>0);
const hltKey=(x,y)=>LEVEL+':'+x+','+y;
function hltSync(){if(hlIn()&&hltFloors()){const L=LEVELS[LEVEL];if(L&&L.floorSet&&L.floorSet[5]==='hlspike')G.fl6=FLOORS.hlspike}
  if(HLT.dec!==G.decor||HLT.lv!==LEVEL){HLT.dec=G.decor;HLT.lv=LEVEL;HLT.fb.length=0;HLT.boom.length=0;HLT.spk.length=0;HLT.scare=null;HLT.light=null;HLT.sense.until=-1;HLT.flash=0}}
function hltPaused(){return G.state!=='play'||G.menu||G.map||G.inv.open||G.loot||G.cut||G.talk||G.overview||(typeof TP!=='undefined'&&TP)}
function hltSnd(kind,vol){
  if(!AC||G.mute||!SNDOPT.combat)return;SFXM=SNDOPT.combat;vol=vol===undefined?1:vol;
  switch(kind){
    case 'click':tone(1300,800,.06,'square',.12*vol);tone(300,180,.1,'triangle',.12*vol);break;
    case 'crackle':for(let i=0;i<9;i++)nz(.03+Math.random()*.05,.2*vol,'highpass',3000+Math.random()*2500,6500,i*.05+Math.random()*.02);nz(.55,.2*vol,'bandpass',1400,500);tone(180,90,.5,'sawtooth',.06*vol);break;
    case 'whoosh':nz(.3,.32*vol,'bandpass',300,1900);nz(.34,.32*vol,'bandpass',1900,250,.28);tone(140,70,.5,'sawtooth',.08*vol);break;
    case 'boom':tone(85,30,.55,'sine',.5*vol);tone(150,50,.35,'sawtooth',.1*vol);nz(.6,.5*vol,'lowpass',2200,90);nz(.3,.22*vol,'bandpass',900,200);for(let i=0;i<3;i++)nz(.07,.1*vol,'highpass',2500,6000,i*.06);break;
    case 'spike':nz(.12,.32,'highpass',2500,7000);tone(1500,700,.12,'square',.08);tone(210,90,.16,'sawtooth',.14);break;
    case 'chime':tone(880,880,.55,'sine',.09);tone(1320,1320,.55,'sine',.06,.08);tone(1760,1760,.7,'sine',.04,.16);break;
    case 'warn':tone(660,440,.25,'triangle',.1);tone(520,390,.32,'triangle',.08,.15);break;
    case 'sting':tone(1900,3300,.12,'sawtooth',.11);tone(160,60,.45,'sawtooth',.2);nz(.3,.3,'highpass',2000,6000);tone(2800,2400,.2,'triangle',.07,.05);break;
    case 'breath':nz(1,.07,'bandpass',500,240);break;
  }
}
const hltLight=()=>{ // one light that travels with the nearest fireball and tints the passage orange
  const live=HLT.fb.filter(b=>b.t>=0);
  if(!live.length){if(HLT.light){HLT.light.taken=true;const i=LIGHTS.indexOf(HLT.light);if(i>=0)LIGHTS.splice(i,1);HLT.light=null}return}
  let b=live[0],bd=1e9;for(const q of live){const dd=Math.abs(q.x-G.C.x-.5)+Math.abs(q.y-G.C.y-.5);if(dd<bd){bd=dd;b=q}}
  if(!HLT.light||LIGHTS.indexOf(HLT.light)<0){HLT.light={x:b.x,y:b.y,ph:1.3,key:-9100,taken:false,red:true,free:true,fire:true,range2:90,kI:1.15};LIGHTS.push(HLT.light)}
  HLT.light.x=b.x;HLT.light.y=b.y};
/* ---- the fireball plates ---- */
function hltFireSpring(t){
  const dir=[-t.u[0],-t.u[1]];
  msg('A plate clicks under the party\'s feet. Far down the passage, a mouth in the wall begins to glow.','#ffb070');hltSnd('click');
  const mk=(delay,i)=>({x:t.S[0]+.5,y:t.S[1]+.5,dx:dir[0],dy:dir[1],t:-delay,live:false,seed:Math.random()*20,spin:Math.random()*6,trap:t,whoosh:false,i});
  HLT.fb.push(mk(HLT_T0,0));if(t.two)HLT.fb.push(mk(HLT_T0+.95,1));
}
function hltFbHit(fb,why){
  const live=hltLive();HLT.fb.splice(HLT.fb.indexOf(fb),1);
  HLT.boom.push({x:fb.x+fb.dx*.1,y:fb.y+fb.dy*.1,t:0,dur:.75,big:true,h:.4});
  G.shake=Math.max(G.shake||0,.95);HLT.flash=1;HLT.flashCol='255,150,50';hltSnd('boom');
  const names=[];
  for(const i of live){const h=G.heroes[i],front=i<2,frac=front?.25+Math.random()*.15:.08+Math.random()*.06,d=Math.max(4,Math.round(h.max*frac));hlHurt(i,d);if(front)names.push(HERO_DEF[i].name)}
  msg('A fireball explodes on the party!'+(names.length?' '+names.join(' and ')+' take the blast.':''),'#ff9a50');
}
function hltFbWall(fb){
  HLT.fb.splice(HLT.fb.indexOf(fb),1);
  HLT.boom.push({x:fb.x+fb.dx*.45,y:fb.y+fb.dy*.45,t:0,dur:.8,big:true,h:.4});
  const dd=Math.hypot(fb.x-G.C.x-.5,fb.y-G.C.y-.5);hltSnd('boom',Math.max(.12,Math.min(.8,1.1-dd/14)));
  if(dd<9){HLT.flash=Math.max(HLT.flash,.25);HLT.flashCol='255,140,40'}
}
function hltStepBalls(dt){
  for(const fb of HLT.fb.slice()){
    fb.t+=dt;if(fb.t<0)continue;
    if(!fb.live){fb.live=true;hltSnd('crackle',Math.max(.2,Math.min(1,1.2-Math.hypot(fb.x-G.C.x-.5,fb.y-G.C.y-.5)/16)));
      HLT.boom.push({x:fb.x+fb.dx*-.3,y:fb.y+fb.dy*-.3,t:0,dur:.45,big:false,h:.42,muzzle:1})}
    let left=HLT_V*dt;
    while(left>0&&HLT.fb.includes(fb)){
      const s=Math.min(left,.1);left-=s;fb.x+=fb.dx*s;fb.y+=fb.dy*s;
      if(!fb.whoosh&&Math.hypot(fb.x-G.C.x-.5,fb.y-G.C.y-.5)<2.3){fb.whoosh=true;hltSnd('whoosh',.8)}
      if(Math.abs(fb.x-(G.P.x+.5))<.5&&Math.abs(fb.y-(G.P.y+.5))<.5&&hltLive().length){hltFbHit(fb);break}
      const nx=Math.floor(fb.x+fb.dx*.5),ny=Math.floor(fb.y+fb.dy*.5);
      if((nx!==Math.floor(fb.x)||ny!==Math.floor(fb.y))&&cellBlocked(nx,ny)){hltFbWall(fb);break}
    }
  }
}
/* ---- the spike tiles ---- */
function hltSpikeSpring(t,harmless){
  HLT.spk.push({x:t.x,y:t.y,t:0,dur:harmless?2.6:2.2,harm:!harmless});hltSnd('spike');
  if(harmless)return;
  const live=hltLive();if(!live.length)return;const hi=live[(Math.random()*live.length)|0],h=G.heroes[hi],d=Math.max(5,Math.round(h.max*(.25+Math.random()*.15)));
  msg('The tile sinks under the party\'s weight. Spikes shoot up from the floor!','#ffb08a');hlHurt(hi,d);
  if(h.hp>0)try{afflInflict('bleeding',hi)}catch(e){}
}
/* pressing a spike tile that is directly ahead: with a tap on the floor ahead, or the Attack key when there is nothing to hit */
function hltPress(how){
  const L=LEVELS[LEVEL];if(!L||!L._traps||!hlIn()||G.state!=='play'||!canAct())return false;
  const f=DIRS[G.P.f],x=G.P.x+f[0],y=G.P.y+f[1],t=L._traps.find(q=>q.t==='spike'&&q.x===x&&q.y===y);if(!t)return false;
  const F=HLF();F.tr=F.tr||{};if(F.tr[hltKey(x,y)])return false;
  if(how==='key'&&frontEnemy(1))return false; // a foe in reach is hit as usual
  F.tr[hltKey(x,y)]=1;
  const hi=G.heroes[G.sel]&&G.heroes[G.sel].alive?G.sel:hltLive()[0],w=hi!==undefined&&heroWeapon(G.heroes[hi]);
  msg('You press the tile with the butt of '+(w?'the '+w.n:'a weapon')+'.','#e8dcc0');
  later(350,()=>{msg('Spikes shoot up from the floor, harmless, and sink away again. The tile is safe now.','#ffe9a0');hltSpikeSpring(t,true)});
  return true;
}
{const _act=act;act=function(id){try{if(id==='attack'&&hltPress('key'))return}catch(e){console.warn('hltPress',e)}return _act.apply(this,arguments)}}
{const _vt=viewTap;viewTap=function(x,y){try{if(x>=100&&x<=320&&y>=120&&!G.hits.some(h=>h.type!=='torch'&&x>=h.x0&&x<=h.x1&&y>=h.y0&&y<=h.y1)&&hltPress('tap'))return}catch(e){console.warn('hltPress',e)}return _vt.apply(this,arguments)}}
{const _db=desertBump;desertBump=function(nx,ny,g){ // the spikes are up: nobody walks onto them for the moment
  try{if(HLT.spk.some(s=>s.x===nx&&s.y===ny&&s.t<s.dur-.35)&&hlIn()){sfx('bump');msg('The spikes are still up.','#d09a80');return true}}catch(e){}
  return _db.apply(this,arguments)}}
{const _hs=hlStep;hlStep=function(nx,ny){_hs.apply(this,arguments);
  try{const L=LEVELS[LEVEL],t=L&&L._traps&&L._traps.find(q=>q.x===nx&&q.y===ny);if(t){const F=HLF();F.tr=F.tr||{};const kk=hltKey(nx,ny);if(!F.tr[kk]){F.tr[kk]=1;if(t.t==='spike')hltSpikeSpring(t,false);else hltFireSpring(t)}}}catch(e){console.warn('hltStep',e)}}}
/* ---- noticing: a trap one or two squares straight ahead ---- */
function hltTrapsHere(){
  const L=LEVELS[LEVEL],F=HLF(),tr=F.tr||{},out=[];if(!L)return out;
  for(const t of (L._traps||[]))if(!tr[hltKey(t.x,t.y)])out.push({x:t.x,y:t.y,t:t.t});
  for(const t of (L._trig||[]))if((t.k==='spikes'||t.k==='darts')&&!tr[hltKey(t.x,t.y)])out.push({x:t.x,y:t.y,t:t.k==='darts'?'dart':'spike'});
  return out}
function hltNotices(hi,t){ // may this hero notice this trap? Fixed by a seed, so loading a game does not change the outcome
  const h=G.heroes[hi],cls=HERO_DEF[hi].cls;if(!h||!h.alive)return false;
  if(cls==='Thief'||cls==='Assassin')return true;
  const dex=h.dex||0;if(!(cls==='Ranger'||cls==='Archer'||dex>=14))return false;
  const p=.4+.45*Math.min(1,Math.max(0,(dex-14)/11));
  return hash2(t.x*7+hi*13,t.y*5+LEVEL,700+hi)<p}
function hltNoticeTick(){
  const L=LEVELS[LEVEL];if(!L||!hlIn()||!camSettled()||G.cut||G.talk)return;
  const traps=hltTrapsHere();if(!traps.length)return;const f=DIRS[G.P.f],F=HLF();F.warn=F.warn||{};
  for(let i=1;i<=2;i++){const x=G.P.x+f[0]*i,y=G.P.y+f[1]*i;if(cellBlocked(x,y))break;
    const t=traps.find(q=>q.x===x&&q.y===y);if(!t||F.warn[hltKey(x,y)])continue;
    for(const hi of hltLive())if(hltNotices(hi,t)){F.warn[hltKey(x,y)]=1;msg(HERO_DEF[hi].name+': There might be a trap ahead.','#ffe08a');hltSnd('warn');break}}
}
/* ---- jump scares ---- */
const HLT_FIG=[['hl_p_ghost',.95],['messenger',1.45],['hl_bogey',1.8],['hl_gent',1.1]];
function hltScareTick(dt){
  const L=LEVELS[LEVEL],S=HLT.scare;
  if(S){S.t+=dt;if(!S.done&&S.t>=S.dur){S.done=true;HLT.scare=null;msg('Something stood there. Now nothing does.','#b8b0d8');hltSnd('breath');
      if(Math.random()<.25){const l=hltLive();if(l.length)try{afflInflict('shaken',l[0])}catch(e){}}}
    return}
  if(!L||!L._scares||!L._scares.length||!hlIn()||!camSettled())return;
  const sc=L._scares.find(q=>q.x===G.P.x&&q.y===G.P.y);if(!sc)return;const F=HLF();F.tr=F.tr||{};const kk=hltKey(sc.x,sc.y);if(F.tr[kk])return;
  const f=DIRS[G.P.f];let n=0;while(n<2&&!cellBlocked(G.P.x+f[0]*(n+1),G.P.y+f[1]*(n+1)))n++;if(n<2)return; // wait until the party looks down a passage
  F.tr[kk]=1;const figs=HLT_FIG.filter(q=>IMG[q[0]]&&IMG[q[0]].width),fg=figs.length?figs[(hash2(sc.x,sc.y,LEVEL)*figs.length)|0]:null;if(!fg)return;
  HLT.scare={x:G.P.x+f[0]*2+.5,y:G.P.y+f[1]*2+.5,t:0,dur:1.15,img:fg[0],h:fg[1]};G.shake=Math.max(G.shake||0,.6);HLT.flash=.7;HLT.flashCol='235,240,255';hltSnd('sting');
}
/* ---- Sense Traps: the Thief's power ---- */
{const th=CLASSES.find(q=>q.name==='Thief');
 if(th&&!th.powers.some(p=>p.type==='sense'))th.powers.push(actP(10,'Sense Traps',5,'sense','Reveals every trap within 6 squares for about 20 seconds, as a faint glow on the floor: warm red for the fireball plates and pale steel for the spikes. Nothing is marked on the maps. A short cooldown follows.',{range:6,secs:20,cd:8}))}
function hltSenseList(){const px=G.P.x,py=G.P.y;return hltTrapsHere().filter(t=>Math.hypot(t.x-px,t.y-py)<=6)}
function hltSense(i,P){
  const h=G.heroes[i],def=HERO_DEF[i];
  if(h.mp<P.cost){msg(`${def.name} lacks the ${def.mpn.toLowerCase()}.`,'#d09a80');return false}
  if(G.time<(h._senseCd||0)){msg(def.name+' needs a moment before sensing again.','#d09a80');return false}
  h.mp-=P.cost;h._senseCd=G.time+(P.cd||8);HLT.sense.until=G.time+(P.secs||20);HLT.sense.hi=i;
  const n=hltSenseList().length;
  msg(n?`${def.name} senses ${n} ${n===1?'trap':'traps'} nearby.`:`${def.name} senses no traps nearby.`,'#9ad0ff');hltSnd('chime');return true}
{const _hs=heroSpecial;heroSpecial=function(i){try{const P=curPower(i);if(P&&P.type==='sense')return hltSense(i,P)}catch(e){console.error(e)}return _hs.apply(this,arguments)}}
/* ---- the letters of the Messenger: floors with only letters (16 and 20) have a record without him ---- */
{const _mp=msgrPlace;msgrPlace=function(){
  try{const F=G.flags,L=LEVELS[LEVEL];
    if(L&&hlIn()){F.msgrLv=F.msgrLv||{};
      if(L._msgr){const rec=F.msgrLv[LEVEL];if(rec&&L._omen&&!rec.letters.some(q=>q.x===L._omen.x&&q.y===L._omen.y))rec.letters.push({k:L._omen.k,x:L._omen.x,y:L._omen.y,wd:L._omen.wd})} // (a game saved before the omen was added)
      else if(L._letters&&L._letters.length){
        if(!F.msgrLv[LEVEL])F.msgrLv[LEVEL]={letters:L._letters.map(q=>({k:q.k,x:q.x,y:q.y,wd:q.wd})),state:'hide',only:1};
        const rec=F.msgrLv[LEVEL];
        for(const l of rec.letters)G.decor.push({k:'msgr_'+l.k,x:l.x,y:l.y,block:false,walk:true,deco:true,loot:false,shop:false,wd:l.wd,msgr:l.k});
        return}}}catch(e){console.warn('hlt msgr',e)}
  return _mp.apply(this,arguments)}}
/* ---- the secret doors of the letters: walk into the wall of different stone (the same door, sound and words as every other hidden door) ---- */
{const _sb=secretBump;secretBump=function(nx,ny){
  try{const L=LEVELS[LEVEL];if(L&&L._ldoors&&hlIn()){const s=L._ldoors.find(q=>q.x===nx&&q.y===ny);
    if(s){const F=HLF();F.sec=F.sec||{};const kk=LEVEL+':'+nx+','+ny;if(!F.sec[kk]){F.sec[kk]=1;G.grid[ny][nx]=0;sfx('door');G.shake=.3;msg('The wall gives way. A hidden door grinds open.','#ffe9a0');return true}}}}catch(e){console.warn('hlt door',e)}
  return _sb.apply(this,arguments)}}
{const _hf=hlFrame;hlFrame=function(dt){ // opened letter doors stay open (the level is rebuilt each visit)
  try{const L=LEVELS[LEVEL],F=HLF();if(G.state==='play'&&L&&L._ldoors&&F.sec)for(const s of L._ldoors)if(F.sec[LEVEL+':'+s.x+','+s.y]&&G.grid[s.y]&&G.grid[s.y][s.x]!==0)G.grid[s.y][s.x]=0}catch(e){}
  return _hf.apply(this,arguments)}}
/* ==========================================================================
   THE FRAME: tick everything, and draw the screen flash
   ========================================================================== */
function hltTick(dt){
  hltSync();if(!hlIn()||hltPaused())return;
  HLT.clock+=dt;
  hltStepBalls(dt);hltLight();
  for(let i=HLT.boom.length-1;i>=0;i--){HLT.boom[i].t+=dt;if(HLT.boom[i].t>=HLT.boom[i].dur)HLT.boom.splice(i,1)}
  for(let i=HLT.spk.length-1;i>=0;i--){HLT.spk[i].t+=dt;if(HLT.spk[i].t>=HLT.spk[i].dur)HLT.spk.splice(i,1)}
  if(HLT.flash>0)HLT.flash=Math.max(0,HLT.flash-dt*2.6);
  hltScareTick(dt);hltNoticeTick();
}
{const _ui=ui;ui=function(dt){_ui.apply(this,arguments);
  try{hltTick(Math.min(.05,dt||.016));
    if(G.state==='play'&&hlIn()&&HLT.flash>.01){ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba('+HLT.flashCol+','+(HLT.flash*.5).toFixed(3)+')';ctx.fillRect(0,0,420,210);ctx.restore()}}catch(e){console.warn('hltTick',e)}}}
/* ==========================================================================
   DRAWING: custom sprites in the sprite list (fireballs, explosions, spikes, the glow of sensed traps, the jump scare figure)
   ========================================================================== */
const hltRuns=(xa,xb,ty,eps)=>{xa=Math.max(0,Math.floor(xa));xb=Math.min(VW-1,Math.ceil(xb));const runs=[];let st=-1;for(let x=xa;x<=xb;x++){const vis=zbuf[x]>ty-(eps||0);if(vis&&st<0)st=x;else if(!vis&&st>=0){runs.push([st,x]);st=-1}}if(st>=0)runs.push([st,xb+1]);return runs};
const hltCustom=(wx,wy,draw)=>({x:wx,y:wy,custom:{prep:(cx,cy,dX,dY)=>{const q=dX*(wx-cx)+dY*(wy-cy);return q>.3?q:0},draw}});
const hltProj=(wx,wy,cx,cy,dX,dY)=>{const rx=wx-cx,ry=wy-cy,ty=dX*rx+dY*ry,tx=(dX*ry-dY*rx)/PL;return {ty,sx:VW/2*(1+tx/ty)}};
const hltRnd=(a,b,c)=>hash2(a,b,c);
function hltFireArt(sx,sy,sw,fl,rot,alpha){ // the painted fire (assets/fx_fire.png, light on black, added to the view) with a glow round it
  SC.globalCompositeOperation='lighter';
  let g=SC.createRadialGradient(sx,sy,0,sx,sy,sw*1.5);g.addColorStop(0,'rgba(255,170,60,'+(.5*fl*alpha).toFixed(3)+')');g.addColorStop(.5,'rgba(255,100,20,'+(.2*alpha).toFixed(3)+')');g.addColorStop(1,'rgba(200,40,0,0)');SC.fillStyle=g;SC.fillRect(sx-sw*1.5,sy-sw*1.5,sw*3,sw*3);
  const im=IMG.fx_fire;if(im&&im.width){SC.save();SC.translate(sx,sy);SC.rotate(rot);SC.globalAlpha=Math.min(1,.95*fl*alpha);const w=sw*1.35;SC.drawImage(im,-w/2,-w/2,w,w);SC.rotate(2.1+rot*.7);SC.globalAlpha=Math.min(1,.55*alpha);const w2=sw*.9;SC.drawImage(im,-w2/2,-w2/2,w2,w2);SC.restore()}
  g=SC.createRadialGradient(sx,sy,0,sx,sy,sw*.3);g.addColorStop(0,'rgba(255,255,230,'+(.95*alpha).toFixed(3)+')');g.addColorStop(1,'rgba(255,200,90,0)');SC.fillStyle=g;SC.fillRect(sx-sw*.3,sy-sw*.3,sw*.6,sw*.6);
}
function hltDrawBall(fb,cx,cy,dX,dY){
  const wp=hltProj(fb.x,fb.y,cx,cy,dX,dY),ty=wp.ty;if(ty<.3)return;
  const sx=wp.sx,sy=HH+(EYE-.4)*F/ty,sw=Math.min(560,F*.85/ty),runs=hltRuns(sx-sw*1.6,sx+sw*1.6,ty);if(!runs.length)return;
  SC.save();SC.beginPath();for(const [a,b] of runs)SC.rect(a,0,b-a,VH+90);SC.clip();
  const fl=.85+.15*Math.sin(G.time*31+fb.seed)+.08*Math.sin(G.time*47+fb.seed*2);
  hltFireArt(sx,sy,sw,fl,Math.sin(G.time*9+fb.seed)*.5+fb.spin,1);
  // a trail of embers, behind the ball along the passage
  for(let j=1;j<=9;j++){const back=j*.19+hltRnd(j,Math.floor(G.time*18),3)*.12,ex=fb.x-fb.dx*back,ey=fb.y-fb.dy*back,e=hltProj(ex,ey,cx,cy,dX,dY);if(e.ty<.3)continue;
    const jx=(hltRnd(j,Math.floor(G.time*22),5)-.5)*sw*.5,jy=(hltRnd(j,Math.floor(G.time*22),7)-.5)*sw*.4-j*sw*.025,r=Math.max(.7,F*.03/e.ty*(1-j/11));
    SC.fillStyle='rgba(255,'+(150-j*9)+',40,'+(.9*(1-j/10)).toFixed(3)+')';SC.beginPath();SC.arc(e.sx+jx,HH+(EYE-.4)*F/e.ty+jy,r,0,TAU);SC.fill()}
  SC.restore();
}
function hltDrawBoom(b,cx,cy,dX,dY){
  const wp=hltProj(b.x,b.y,cx,cy,dX,dY),ty=wp.ty;if(ty<.3)return;const p=b.t/b.dur,sx=wp.sx,sy=HH+(EYE-(b.h||.4))*F/ty;
  const sw=Math.min(900,F*(b.muzzle?.6:.8+p*(b.big?3.4:1.6))/ty),runs=hltRuns(sx-sw*1.6,sx+sw*1.6,ty,b.muzzle?1.1:0);if(!runs.length)return;
  SC.save();SC.beginPath();for(const [a,bb] of runs)SC.rect(a,0,bb-a,VH+90);SC.clip();
  const a=Math.pow(1-p,1.3);hltFireArt(sx,sy,sw,1,b.t*3+b.x,a);
  SC.globalCompositeOperation='lighter';
  if(!b.muzzle)for(let j=0;j<14;j++){const an=hltRnd(j,3,Math.floor(b.x*7+b.y))*TAU,dd=sw*(.2+p*.9)*(.5+hltRnd(j,5,9)*.6);SC.fillStyle='rgba(255,'+(140+j*6)+',50,'+(a*.9).toFixed(3)+')';SC.beginPath();SC.arc(sx+Math.cos(an)*dd,sy+Math.sin(an)*dd*.8-p*sw*.2,Math.max(.8,sw*.025*(1-p)),0,TAU);SC.fill()}
  SC.restore();
}
function hltDrawSpikes(s,cx,cy,dX,dY){
  const T=s.t,up=T<.14?T/.14:(T>s.dur-.55?Math.max(0,(s.dur-T)/.55):1);if(up<=0)return;
  const pts=[];for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)pts.push([s.x+.5+i*.27+(hltRnd(i+5,j+5,s.x*3+s.y)-.5)*.08,s.y+.5+j*.27+(hltRnd(i+7,j+9,s.x+s.y*5)-.5)*.08]);
  const pr=pts.map(p=>({p,q:hltProj(p[0],p[1],cx,cy,dX,dY)})).filter(o=>o.q.ty>.35).sort((a,b)=>b.q.ty-a.q.ty);if(!pr.length)return;
  const tyc=hltProj(s.x+.5,s.y+.5,cx,cy,dX,dY).ty,runs=hltRuns(pr[pr.length-1].q.sx-F*.5/Math.max(.4,tyc),pr[0].q.sx+F*.5/Math.max(.4,tyc),tyc-.5);if(!runs.length)return;
  SC.save();SC.beginPath();for(const [a,b] of runs)SC.rect(a,0,b-a,VH+90);SC.clip();
  for(const o of pr){const ty=o.q.ty,base=HH+EYE*F/ty,hgt=.62*up*F/ty,hw=Math.max(1.2,F*.05/ty),x=o.q.sx;
    const g=SC.createLinearGradient(x-hw,0,x+hw,0);g.addColorStop(0,'#7a8590');g.addColorStop(.45,'#f0f4fa');g.addColorStop(1,'#59636e');
    SC.fillStyle=g;SC.beginPath();SC.moveTo(x-hw,base);SC.lineTo(x,base-hgt);SC.lineTo(x+hw,base);SC.closePath();SC.fill();
    SC.strokeStyle='rgba(20,24,30,.8)';SC.lineWidth=Math.max(.5,hw*.25);SC.stroke();
    if(s.harm&&T<.6){SC.fillStyle='rgba(190,30,30,'+(.5*(1-T/.6)).toFixed(3)+')';SC.fillRect(x-hw*.4,base-hgt*.35,hw*.8,hgt*.2)}}
  SC.restore();
}
function hltFloorPoly(wx,wy,half,cx,cy,dX,dY){ // the four corners of a tile on the floor, as screen points (cut where it would pass behind the eye)
  const P=[[-half,-half],[half,-half],[half,half],[-half,half]].map(([a,b])=>{const rx=wx+a-cx,ry=wy+b-cy;return [(dX*ry-dY*rx)/PL,dX*rx+dY*ry]}),out=[];
  for(let i=0;i<4;i++){const A=P[i],B=P[(i+1)%4],ia=A[1]>=.3,ib=B[1]>=.3;if(ia)out.push(A);if(ia!==ib){const t=(.3-A[1])/(B[1]-A[1]);out.push([A[0]+(B[0]-A[0])*t,.3])}}
  return out.map(([tx,ty])=>[VW/2*(1+tx/ty),HH+EYE*F/ty])}
function hltDrawDecal(t,cx,cy,dX,dY){
  const wx=t.x+.5,wy=t.y+.5,ty=dX*(wx-cx)+dY*(wy-cy),left=HLT.sense.until-G.time,fade=Math.min(1,left/1.5,Math.max(0,(20-left)*4+.2)),pul=.55+.45*Math.sin(G.time*3.2+t.x*1.7+t.y),fire=t.t==='fire';
  if(left<=0)return;const poly=hltFloorPoly(wx,wy,.46,cx,cy,dX,dY);if(poly.length<3)return;
  const xs=poly.map(p=>p[0]),runs=hltRuns(Math.min(...xs),Math.max(...xs),Math.max(.4,ty-.5));if(!runs.length)return;
  SC.save();SC.beginPath();for(const [a,b] of runs)SC.rect(a,0,b-a,VH+90);SC.clip();SC.globalCompositeOperation='lighter';
  const path=()=>{SC.beginPath();poly.forEach(([x,y],i)=>i?SC.lineTo(x,y):SC.moveTo(x,y));SC.closePath()};
  path();SC.fillStyle=fire?'rgba(255,90,30,'+(.2*pul*fade).toFixed(3)+')':'rgba(170,200,235,'+(.16*pul*fade).toFixed(3)+')';SC.fill();
  SC.lineWidth=1.2;SC.strokeStyle=fire?'rgba(255,150,70,'+(.55*pul*fade).toFixed(3)+')':'rgba(220,235,255,'+(.5*pul*fade).toFixed(3)+')';path();SC.stroke();
  const mx=(xs[0]+xs[2])/2,my=(poly[0][1]+poly[2][1])/2,sz=Math.max(2,Math.abs(xs[1]-xs[0])*.22);
  if(fire){const g=SC.createRadialGradient(mx,my,0,mx,my,sz*3);g.addColorStop(0,'rgba(255,170,70,'+(.45*pul*fade).toFixed(3)+')');g.addColorStop(1,'rgba(255,60,20,0)');SC.fillStyle=g;SC.fillRect(mx-sz*3,my-sz*3,sz*6,sz*6);
    for(let i=0;i<5;i++){const ph=(G.time*.8+i*.2+hltRnd(i,t.x,t.y))%1;SC.fillStyle='rgba(255,'+(130+i*20)+',50,'+(.8*(1-ph)*fade).toFixed(3)+')';SC.fillRect(mx+(hltRnd(i,3,t.y)-.5)*sz*3,my-ph*sz*3.4,Math.max(1,sz*.18),Math.max(1,sz*.18))}}
  else{SC.strokeStyle='rgba(235,245,255,'+(.8*pul*fade).toFixed(3)+')';SC.lineWidth=1.1;SC.beginPath();for(let i=0;i<4;i++){const gx=mx+(i-1.5)*sz*.8,sw=(G.time*1.4+i*.25)%1;SC.moveTo(gx-sz*.25,my+sz*.5-sw*sz);SC.lineTo(gx+sz*.25,my-sz*.5-sw*sz)}SC.stroke()}
  SC.restore();
}
function hltDrawScare(S,cx,cy,dX,dY){
  const im=IMG[S.img];if(!im||!im.width)return;const wp=hltProj(S.x,S.y,cx,cy,dX,dY),ty=wp.ty;if(ty<.3)return;
  const a=S.t<.12?S.t/.12:S.t>S.dur-.3?Math.max(0,(S.dur-S.t)/.3):1,hh=S.h*F/ty,ww=hh*im.width/im.height,sx=wp.sx+(Math.random()-.5)*(S.t<.4?5:1.2),bot=HH+EYE*F/ty,runs=hltRuns(sx-ww/2,sx+ww/2,ty,.4);if(!runs.length)return;
  SC.save();SC.beginPath();for(const [x,y] of runs)SC.rect(x,0,y-x,VH+90);SC.clip();
  SC.globalAlpha=a;SC.drawImage(im,sx-ww/2,bot-hh,ww,hh);SC.globalCompositeOperation='lighter';SC.globalAlpha=a*.28;SC.drawImage(im,sx-ww/2,bot-hh,ww,hh);SC.restore();
}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  try{if(!hlIn())return L;hltSync();
    for(const b of HLT.fb)if(b.t>=0&&b.live)L.push(hltCustom(b.x,b.y,(cx,cy,dX,dY)=>hltDrawBall(b,cx,cy,dX,dY)));
    for(const b of HLT.boom)L.push(hltCustom(b.x,b.y,(cx,cy,dX,dY)=>hltDrawBoom(b,cx,cy,dX,dY)));
    for(const s of HLT.spk)L.push(hltCustom(s.x+.5,s.y+.5,(cx,cy,dX,dY)=>hltDrawSpikes(s,cx,cy,dX,dY)));
    if(HLT.scare)L.push(hltCustom(HLT.scare.x,HLT.scare.y,(cx,cy,dX,dY)=>hltDrawScare(HLT.scare,cx,cy,dX,dY)));
    if(G.time<HLT.sense.until)for(const t of hltSenseList())L.push(hltCustom(t.x+.5,t.y+.5,(cx,cy,dX,dY)=>hltDrawDecal(t,cx,cy,dX,dY)));
  }catch(e){console.warn('hlt sprites',e)}
  return L}}
/* ---- the party reaches the labyrinth for the first time: a short talk among the heroes (a nod to a famous gamebook) ---- */
khNpc('hl_labcut','The party','gate',()=>{
  const nm=i=>(HERO_DEF[i]||HERO_DEF[0]).name,live=hltLive(),a=live[0]===undefined?0:live[0],b=live[1]===undefined?a:live[1],c=live[2]===undefined?b:live[2],d=live[3]===undefined?c:live[3];
  const n6=say(nm(a)+': "I still dream about the blood beast."',[['Go on.',()=>null]]);
  const n5=say(nm(d)+': "Yeah. Great book. That blood beast..."',[['Go on.',()=>n6]]);
  const n4=say(nm(c)+': "Do you mean Deathtrap Dungeon?"',[['Go on.',()=>n5]]);
  const n3=say(nm(b)+': "I read a book about a place like this once. A maze under a mountain, full of traps, and only one way through."',[['Go on.',()=>n4]]);
  const n2=say('The passage ahead leads into a labyrinth. The floor has plates set into it, the walls are scorched, and a dry wind blows out of it carrying a smell of smoke.',[['Go on.',()=>n3]]);
  return say(nm(a)+': "Wait. Look at the walls. Burn marks, and bones in the corners. This is a death trap."',[['Go on.',()=>n2]])});
{const _hs2=hlStep;hlStep=function(nx,ny){_hs2.apply(this,arguments);
  try{const L=LEVELS[LEVEL],F=HLF();if(LEVEL===HLT_TOP&&L&&L._maze&&!F.labCut&&!G.cut&&!G.talk){const m=L._maze;
    if(nx>=m.x0-1&&nx<=m.x1+1&&ny>=m.y0-2&&ny<=m.y1+1){F.labCut=1;later(500,()=>{if(G.state==='play'&&!G.talk&&!G.cut)startTalk({npc:'hl_labcut',x:nx,y:ny})})}}}catch(e){console.warn('labcut',e)}}}
