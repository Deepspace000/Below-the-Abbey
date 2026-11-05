/* ==========================================================================
   THE PALE SPIRE, FOURTH FLOOR: THE FLOOR OF THE MOON. Four rooms, each with a planet floating in it; each planet is a maze played from ABOVE
   (see topdown.js). Planet levels: 9891 stone, 9892 ice, 9893 growth, 9894 fire. The hub is 9890. All four done opens the way up, past the Moon.
   This file holds the maze maker (psf4Maze) and the planets. Prefix psf4 / PSF4.
   State: G.flags.psp.f4 = {done:{9891:1,...}} (a planet is done when the party steps onto its way out).
   ========================================================================== */
const PSF4={HUB:9890,IDS:[9891,9892,9893,9894]};
function psf4F(){const P=(G.flags.psp=G.flags.psp||{});return P.f4||(P.f4={done:{}})}
/* a small seeded random generator, so a planet is the same maze every time */
function psf4Rng(seed){let a=(seed>>>0)||1;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
/* a maze on a W x H grid (both odd): open[y][x] true where the party can walk. Passages are one square wide; `rooms` rooms are cut out of it so fights have space,
   and `braid` is the share of dead ends that are opened into loops. Returns {open, start, exit, dead} (dead = dead ends, far ones first). */
function psf4Maze(W,H,seed,o){
  o=o||{};const R=psf4Rng(seed),open=[];for(let y=0;y<H;y++)open.push(new Array(W).fill(false));
  const cw=(W-1)/2,ch=(H-1)/2,seen=new Uint8Array(cw*ch),st=[[0,0]];seen[0]=1;open[1][1]=true;
  while(st.length){
    const [cx,cy]=st[st.length-1],nb=[];
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx>=0&&ny>=0&&nx<cw&&ny<ch&&!seen[ny*cw+nx])nb.push([nx,ny,dx,dy])}
    if(!nb.length){st.pop();continue}
    const [nx,ny,dx,dy]=nb[(R()*nb.length)|0];seen[ny*cw+nx]=1;
    open[cy*2+1+dy][cx*2+1+dx]=true;open[ny*2+1][nx*2+1]=true;st.push([nx,ny]);
  }
  const rooms=[];
  for(let i=0,tries=0;i<(o.rooms||6)&&tries<200;tries++){
    const rw=3+2*((R()*2)|0),rh=3+2*((R()*2)|0),rx=1+2*((R()*((W-rw-1)/2))|0),ry=1+2*((R()*((H-rh-1)/2))|0);
    if(rx+rw>=W-1||ry+rh>=H-1)continue;
    if(Math.hypot(rx-1,ry-1)<9)continue;
    if(rooms.some(r=>rx<r.x1+3&&rx+rw>r.x0-3&&ry<r.y1+3&&ry+rh>r.y0-3))continue;
    for(let y=ry;y<ry+rh;y++)for(let x=rx;x<rx+rw;x++)open[y][x]=true;
    rooms.push({x0:rx,y0:ry,x1:rx+rw-1,y1:ry+rh-1});i++}
  const nbr=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>open[y+dy]&&open[y+dy][x+dx]);
  const deadEnds=()=>{const d=[];for(let y=1;y<H-1;y+=2)for(let x=1;x<W-1;x+=2)if(open[y][x]&&nbr(x,y).length===1)d.push([x,y]);return d};
  for(const [x,y] of deadEnds()){if(R()>=(o.braid===undefined?.25:o.braid))continue;
    const ws=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>{const wx=x+dx,wy=y+dy,bx=x+2*dx,by=y+2*dy;return !open[wy][wx]&&bx>0&&by>0&&bx<W-1&&by<H-1&&open[by][bx]});
    if(ws.length){const [dx,dy]=ws[(R()*ws.length)|0];open[y+dy][x+dx]=true}}
  // the distance from the start: the way out is the farthest dead end
  const dist=new Int32Array(W*H).fill(-1),q=[[1,1]];dist[W+1]=0;
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(open[ny]&&open[ny][nx]&&dist[ny*W+nx]<0){dist[ny*W+nx]=dist[y*W+x]+1;q.push([nx,ny])}}}
  const dead=deadEnds().filter(([x,y])=>!(x===1&&y===1)&&dist[y*W+x]>0).sort((a,b)=>dist[b[1]*W+b[0]]-dist[a[1]*W+a[0]]);
  return {open,rooms,dist,dead,start:[1,1],exit:dead[0]||[W-2,H-2]}}
/* builds one planet: a top-down maze level. spec = {id,name,W,H,seed,foes:[types],nFoes,nChests,nItems,floor,wall} */
function psf4Planet(info,spec){
  // the level kit only treats squares 2 to size-3 as floor, so the maze (which starts at 1) is set one square in: maze (x,y) is level (x+1,y+1)
  const id=spec.id,MW0=spec.W,MH0=spec.H,W=MW0+2,H=MH0+2,O=1;
  const C=pspMake({id,W,H,start:{x:1+O,y:1+O,f:2},floor:'flag',wh:2.2,amb:.5,lcol:PSH_COL.cold,kind:'in'});
  const M=psf4Maze(MW0,MH0,spec.seed,spec),open=M.open,R=psf4Rng(spec.seed*7+3);
  for(let y=0;y<MH0;y++)for(let x=0;x<MW0;x++)if(open[y][x])C.carve(x+O,y+O,x+O,y+O);
  const [mex,mey]=M.exit,ex=mex+O,ey=mey+O;
  // the landmark rooms: each is named on the map, drawn in its own ground, and furnished
  const KINDS=[['keep','The Keep'],['chapel','The Chapel'],['grass','The Herb Garden'],['grave','The Graveyard'],['grass','The Well Court'],['keep','The Guardroom']];
  const zones=M.rooms.map((r,i)=>({type:KINDS[i%6][0],name:KINDS[i%6][1],n:i,x0:r.x0+O,y0:r.y0+O,x1:r.x1+O,y1:r.y1+O}));
  const pp=(name,x,y)=>{if(C.free(x,y))C.prop(name,x,y,{block:true,sc:.9})};
  // props stand only on the inside of a room (never on its border ring, where the passages come in), so they can never shut a way
  const PROPS={The_Keep:['brazier','brazier','st_headless'],The_Chapel:['altar','font','pews','pews'],The_Herb_Garden:['well_pale','urn_big','urn_big'],The_Graveyard:['st_saint2','st_headless','skull_pillar','st_headless'],The_Well_Court:['well_pale','barrels','cart_old'],The_Guardroom:['hearth_cold','barrels','cage']};
  for(const z of zones){
    const cx=(z.x0+z.x1)>>1,cy=(z.y0+z.y1)>>1;C.mapNames.push({t:z.name,x:cx,y:cy,k:'place'});
    const ins=[];for(let y=z.y0+1;y<=z.y1-1;y++)for(let x=z.x0+1;x<=z.x1-1;x++)ins.push([x,y]);
    ins.sort((a,b)=>Math.hypot(a[0]-cx,a[1]-cy)-Math.hypot(b[0]-cx,b[1]-cy));
    (PROPS[z.name.replace(/ /g,'_')]||[]).forEach((n,i)=>{if(ins[i])pp(n,ins[i][0],ins[i][1])})}
  // the way out is a door in the wall beside the far dead end
  let at=null;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const wx=mex+dx,wy=mey+dy;if(wx>0&&wy>0&&wx<MW0-1&&wy<MH0-1&&!open[wy][wx]){at=[wx+O,wy+O];break}}
  at=at||[ex+1,ey];
  PSP_L(id,at,PSF4.HUB,[20,20,0],{name:'the way off the planet',prov:1});
  C.links({});
  C.light(1+O,1+O,[1.2,1.2,1.6]);C.light(ex,ey,[.9,1.4,1.8]);
  const spots=[];for(let y=1;y<MH0-1;y++)for(let x=1;x<MW0-1;x++)if(open[y][x]&&M.dist[y*MW0+x]>=10&&!(x===mex&&y===mey))spots.push([x+O,y+O]);
  const take=()=>{if(!spots.length)return null;const i=(R()*spots.length)|0;return spots.splice(i,1)[0]};
  // chests and things lying about go in the dead ends, the far ones first
  const dead=M.dead.slice(1).map(([x,y])=>[x+O,y+O]);let nc=spec.nChests||3;
  for(const [x,y] of dead){if(nc<=0)break;if(!C.free(x,y))continue;if(C.chest(x,y,{gold:2200+((R()*1200)|0),tier:1}))nc--}
  let ni=spec.nItems||5;for(const [x,y] of dead.slice().reverse()){if(ni<=0)break;if(C.items.some(i=>i.x===x&&i.y===y)||C.decor.some(d=>d.x===x&&d.y===y))continue;C.items.push({k:'potion6',x,y,taken:false});ni--}
  const L=info.lvl||108,types=spec.foes;
  let nf=spec.nFoes||12;while(nf-->0){const s=take();if(!s)break;pspFoe(C,types[(R()*types.length)|0],s[0],s[1],{lvl:L})}
  const lv=C.finish({start:{x:1+O,y:1+O,f:2}});
  lv._td={exit:at,seed:spec.seed,look:spec.look,zones};
  return lv}
/* ---------- planet 1: the stone planet ---------- */
PSP.LEVELS.push(PSP_LV(9891,'The Stone Planet',39,39,108,0,'in'));
TD.levels.add(9891);
pspRegister(9891,info=>psf4Planet(info,{id:9891,W:37,H:37,seed:9891,rooms:6,braid:.22,nFoes:14,nChests:3,nItems:5,foes:['psclockwork','psmirrorshade','psstarwraith','psstarmoth']}));
/* stepping onto the way out finishes the planet */
{const _m=doMove;doMove=function(rel){
  try{if(tdOn()){const lv=LEVELS[LEVEL],t=lv&&lv._td;if(t){const d=DIRS[(G.P.f+rel)%4],nx=G.P.x+d[0],ny=G.P.y+d[1];
    if(nx===t.exit[0]&&ny===t.exit[1]&&PSF4.IDS.includes(LEVEL)){const F=psf4F();if(!F.done[LEVEL]){F.done[LEVEL]=1;msg('The planet is complete. A way opens off its edge.','#bfe8ff');sfx('level')}}}}}catch(e){console.error('psf4 exit',e)}
  return _m.apply(this,arguments)}}
/* ---------- the party meets the top-down view: told once, before the first maze ---------- */
CUTS.psPlanet=()=>[
  {text:'The floor under the party has gone flat. The walls are no longer around you. They are drawn beneath you, in ink, like lines on an old map, and you are standing in the middle of it.'},
  {who:hn(0),text:'Wait. Are we looking at ourselves from above? That is us. That small round thing is us.'},
  {who:hn(1),text:'Somebody is watching this maze from the ceiling. This is like being in a game.'},
  {who:hn(0),text:'It cannot be a game. We are standing in it.'},
  {who:hn(2),text:'If it has to be a game, I prefer first person. The old kind, where you move one block at a time and turn on the spot. You could see the walls properly. This is a map.'},
  {who:hn(1),text:'This is a map that is also a game that is also the floor. I do not like it.'},
  {who:hn(3),text:'I prefer the ones where you swap three of the same colour in a row, and they go away. Nobody gets lost in those.'},
  {who:hn(2),text:'Nobody gets stabbed in those either.'},
  {who:hn(3),text:'That is why I prefer them.'},
  {text:'Somewhere past the first wall, something heavy turns over. The map shows it as a small dark shape.'}];
pspOnArrive(n=>{if(n!==9891)return;try{const F=psf4F();if(F.intro)return;F.intro=1;later(700,()=>startCut('psPlanet'))}catch(e){console.error('psf4 intro',e)}});
