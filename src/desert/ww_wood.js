/* ==========================================================================
   THE WITCH'S WOOD, the level (id 520, rated 82; prefix ww / WW; pictures and wiring in ww_art.js). Blackbriar Wood: a small (55 by 55) dark forest under a thick green-grey murk, made of a winding
   maze of narrow paths between walls of black bark, bramble and old stone, with ten clearings: the gate glade (a warning sign), the graveyard glade, the hanged man's glade, the stone circle,
   the ruined chapel, the well glade, the root hollow, the north-west and north-east glades, and the witch's clearing in front of Grisselda Blackbriar's gingerbread cottage. A dried brook with a rotten
   bridge cuts across the middle. The trodden track (dirt underfoot) runs from the gate to the cottage; the paths of moss lead to dead ends.
   Guardians: scarecrows, hounds, spiders with human faces, toad-things, bone golems, crows, a hanged revenant, root-horrors and the Flesh-Pile, nastier near the cottage (see WW_FOES below).
   The quest objects (clues, hag-stone, rowan, three bone totems) are placed here; the people and the story are in ww_quests.js, the cottage rooms in ww_rooms.js.
   ========================================================================== */
function wwRng(seed){let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
const WW_R={gate:[21,45,33,53],grave:[1,37,11,47],chapel:[43,35,53,47],well:[21,27,33,35],hang:[1,19,11,27],circle:[43,17,53,27],hollow:[21,15,33,21],witch:[15,1,39,11],nw:[1,5,9,13],ne:[45,3,53,11]};
const WW_RNAME={gate:'The Gate Glade',grave:'The Graveyard Glade',chapel:'The Ruined Chapel',well:'The Well Glade',hang:"The Hanged Man's Glade",circle:'The Stone Circle',hollow:'The Root Hollow',witch:"The Witch's Clearing",nw:'The Bramble Glade',ne:'The Spider Glade'};
const WW_PLAQUES=[['TURN BACK','Blackbriar Wood. The path is not a promise.'],['THIS WAY TO WENLOCK','(it is not)'],['NO CHILDREN','Beyond this sign. Thank you.'],['MIND THE ROOTS','They mind you'],['GINGERBREAD','Free. Ask why.'],['THE WELL IS DRY','So are the wells of the next three towns'],
  ['TO THE COTTAGE','Wipe your boots, dearies'],['LOST?','So were they']];
/* ---- the maze: a winding walk over a lattice (cells at odd squares), a few loops knocked through, the clearings stamped on top ---- */
function wwGen(){
  const W=WW.W,H=WW.H,R=wwRng(52013),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const N=(W-1)/2,vis=new Uint8Array(N*N),dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  const cx0=26,cy0=26,st=[[cx0,cy0,-1]];vis[cy0*N+cx0]=1;g[1+2*cy0][1+2*cx0]='.';
  while(st.length){const [i,j,last]=st[st.length-1];const opts=[];for(let d=0;d<4;d++){const a=i+dirs[d][0],b=j+dirs[d][1];if(a>=0&&b>=0&&a<N&&b<N&&!vis[b*N+a])opts.push(d)}
    if(!opts.length){st.pop();continue}
    // twisting: a turn is three times as likely as going straight on
    const turns=opts.filter(d=>d!==last),pool=turns.length&&R()<.78?turns:opts,d=pool[(R()*pool.length)|0],a=i+dirs[d][0],b=j+dirs[d][1];
    g[1+2*j+dirs[d][1]][1+2*i+dirs[d][0]]='.';g[1+2*b][1+2*a]='.';vis[b*N+a]=1;st.push([a,b,d])}
  // loops
  for(let k=0,t=0;k<34&&t<4000;t++){const x=2+((R()*(W-4))|0),y=2+((R()*(H-4))|0);if(g[y][x]!=='#')continue;const horiz=y%2===1&&x%2===0,vert=y%2===0&&x%2===1;if(!horiz&&!vert)continue;
    const a=horiz?g[y][x-1]:g[y-1][x],b=horiz?g[y][x+1]:g[y+1][x];if(a==='.'&&b==='.'){g[y][x]='.';k++}}
  // the clearings
  const roomAt={};for(const id in WW_R){const [x0,y0,x1,y1]=WW_R[id];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';roomAt[x+','+y]=id}}
  return {g,roomAt}}
const WW_DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
function wwBfs(g,sx,sy){const W=WW.W,H=WW.H,d=new Int16Array(W*H).fill(-1),par=new Int32Array(W*H).fill(-1),q=[sy*W+sx];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of WW_DIRS){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;par[ny*W+nx]=c;q.push(ny*W+nx)}}
  return {d,par}}
/* ---- the foes of the clearings: [clearing, creature, dx from the centre, dy] ---- */
const WW_FOES=[['grave','wwgolem',0,-2],['grave','wwhound',-3,2],['grave','wwscare',3,3],['hang','wwrevenant',0,2],['hang','wwcrows',-3,-3],['circle','wwroot',0,3],['circle','wwspider',-4,2],
  ['chapel','wwtoad',-2,-1],['chapel','wwgolem',-3,3],['well','wwtoad',-3,2],['well','wwspider',3,-2],['hollow','wwabom',0,0],['hollow','wwroot',-4,1],['hollow','wwroot',4,1],
  ['witch','wwgolem',-4,2],['witch','wwgolem',4,2],['witch','wwhound',-6,4],['witch','wwhound',6,4],['nw','wwscare',-2,0],['nw','wwcrows',2,2],['ne','wwspider',0,1],['ne','wwcrow',2,-2]];
function wwBuild(){
  if(LEVELS[WW.ID])return LEVELS[WW.ID];
  wwAlias();
  const W=WW.W,H=WW.H,hs=(a,b,c)=>hash2(a,b,c),R=wwRng(7013);
  const {g,roomAt}=wwGen(),sx=27,sy=53,doorX=27;
  const Q={};for(const id in WW_R){const [x0,y0,x1,y1]=WW_R[id];Q[id]={x0,y0,x1,y1,cx:(x0+x1)>>1,cy:(y0+y1)>>1,id}}
  const isOpen=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&g[y][x]==='.';
  const {d:dd,par}=wwBfs(g,sx,sy),dDoor=dd[1*W+doorX];
  // the trodden track from the gate to the cottage door
  const track=new Set(),pathList=[];{let c=1*W+doorX;while(c>=0){track.add((c%W)+','+((c/W)|0));pathList.push([c%W,(c/W)|0]);c=par[c]}pathList.reverse()}
  const frac=(x,y)=>Math.max(0,dd[y*W+x])/Math.max(1,dDoor);
  // ---- tiles and ground ----
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const near=(x,y,id,pad)=>{const q=Q[id];return x>=q.x0-pad&&x<=q.x1+pad&&y>=q.y0-pad&&y<=q.y1+pad};
  const wallChar=(x,y)=>{
    const wh=Math.round((1.9+hs((x/2)|0,(y/2)|0,41)*.7)*10)/10;
    if(y===0&&x>=doorX-2&&x<=doorX+2)return ch(wwTile('tex_4',4.6,{fac:{img:'front_1',i:x-(doorX-2),n:5},gain:1.3}));          // the cottage front (door in the middle: see below)
    if(x===W-1&&y>=39&&y<=43)return ch(wwTile('tex_3',4.2,{fac:{img:'front_0',i:y-39,n:5},gain:2.3}));                                   // the ruined chapel front
    let tex='tex_0';
    if(near(x,y,'grave',2)||near(x,y,'chapel',2)||near(x,y,'circle',1)||near(x,y,'well',1))tex='tex_3';
    else if(near(x,y,'witch',2)||near(x,y,'hollow',2)||near(x,y,'nw',1)||near(x,y,'ne',1))tex='tex_4';
    if(tex==='tex_0'&&hs(x,y,43)<.16)tex='tex_4';
    return ch(wwTile(tex,wh,{gain:.45}))};   // the solid mass behind the trees is nearly black
  const fl=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){let f=0;if(hs((x/3)|0,(y/3)|0,53)<.32)f=1;fl[y*W+x]=f}
  for(const id in Q){const q=Q[id],f={gate:1,grave:4,chapel:4,well:1,hang:1,circle:0,hollow:1,witch:1,nw:1,ne:0}[id];for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++)fl[y*W+x]=f}
  // the stone floors are only in the middle of the graveyard and the chapel
  for(const k of track)if(!roomAt[k]){const [x,y]=k.split(',').map(Number);fl[y*W+x]=2}
  for(const id of ['gate','witch']){const q=Q[id];for(let y=q.y0;y<=q.y1;y++)if(track.has(q.cx+','+y)||track.has((q.cx+1)+','+y))fl[y*W+q.cx]=2}
  // the dried brook: a band of cracked mud that wanders across the wood
  const brookY=x=>33+Math.round(4*Math.sin(x*.17+1));
  for(let x=0;x<W;x++){for(const dy of [0,1]){const y=brookY(x)+dy;if(y>0&&y<H-1&&isOpen(x,y)&&!roomAt[x+','+y])fl[y*W+x]=3}}
  const inBrook=(x,y)=>fl[y*W+x]===3;
  // ---- decor, foes, items ----
  const decor=[],enemies=[],items=[],lights=[],occ=new Set(),wglow=[];
  const near4=new Set();for(const [a,b] of [[sx,sy],[sx,sy-1],[sx,sy+1],[doorX,1],[doorX,2]])for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)near4.add((a+i)+','+(b+j));
  const free=(x,y)=>isOpen(x,y)&&!occ.has(x+','+y);
  const dec=(a,x,y,o)=>{o=o||{};const k=WWA[a]?'ww_'+a:a;if(!isOpen(x,y))return null;const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.bob)d.bob=o.bob;if(o.npc){d.npc=o.npc;d.deco=false}if(o.goldAmt)d.goldAmt=o.goldAmt;if(o.wd){d.wd=o.wd;d.pic=1}if(o.txt)d.txt=o.txt;if(o.i!==undefined)d.i=o.i;
    decor.push(d);if(o.block||o.occ)occ.add(x+','+y);return d};
  const D=(a,x,y,o)=>free(x,y)&&!near4.has(x+','+y)?dec(a,x,y,o):null;
  const DB=(a,x,y,o)=>D(a,x,y,Object.assign({block:true},o||{}));
  const foe=(t,x,y)=>{if(!free(x,y)||near4.has(x+','+y))return false;enemies.push({t,x,y,lvl:82});occ.add(x+','+y);return true};
  const glow=(x,y)=>wglow.push([x,y]);
  const ring=(q,pad,fn)=>{for(let x=q.x0+pad;x<=q.x1-pad;x++){fn(x,q.y0+pad);fn(x,q.y1-pad)}for(let y=q.y0+pad+1;y<q.y1-pad;y++){fn(q.x0+pad,y);fn(q.x1-pad,y)}};
  const TREES=['oakface','oakmoss','pine','pine2','willow','thorn'];
  const tree=(x,y,k)=>DB(k||TREES[(hs(x,y,61)*TREES.length)|0],x,y);
  const plaque=(x,y,wd,t)=>{if(!isOpen(x,y))return;decor.push({k:'sign_ww',x,y,block:false,wd,txt:[t[0],t[1]]})};
  // the gate glade: a warning sign, thorns, a wisp
  {const q=Q.gate;DB('sign',q.cx-3,q.y1-1,{npc:'wwo_sign',i:0});for(const [x,y,k] of [[q.x0,q.y0,'oakface'],[q.x1,q.y0,'oakmoss'],[q.x0,q.y1,'thorn'],[q.x1,q.y1,'thorn']])DB(k,x,y);
    plaque(q.cx+1,q.y1,[0,1],WW_PLAQUES[0])}
  // the graveyard glade: graves in rows, a bone totem, a golem, hounds and a scarecrow
  {const q=Q.grave;for(let y=q.y0+2;y<=q.y1-2;y+=2)for(let x=q.x0+1;x<=q.x1-1;x+=2){if(Math.abs(x-q.cx)<=1||Math.abs(y-q.cy)<=1)continue;if(hs(x,y,81)<.62)DB('grave',x,y,{sc:.85+hs(x,y,82)*.3})}
    DB('totem',q.cx,q.y0+1,{npc:'wwo_totem1',i:1});glow(q.cx,q.y0+2);plaque(q.cx,q.y1,[0,1],['THE QUIET ONES','Do not wake them. They are cross.'])}
  // the hanged man's glade: the great oak, a crow tree, a totem
  {const q=Q.hang;DB('oakface',q.cx,q.cy-1,{sc:1.2});DB('crowtree',q.cx-3,q.cy+1);DB('totem',q.x1-1,q.y0+2,{npc:'wwo_totem2',i:2});glow(q.x1-1,q.y0+3);plaque(q.cx,q.y1,[0,1],['THE OLD OAK','Fine for hanging washing. And others.'])}
  // the stone circle: eight standing stones, toadstools and a totem in the middle
  {const q=Q.circle;for(const [dx,dy] of [[-3,-2],[0,-3],[3,-2],[4,0],[3,2],[0,3],[-3,2],[-4,0]])DB('stone',q.cx+dx,q.cy+dy,{sc:.95});DB('totem',q.cx,q.cy,{npc:'wwo_totem3',i:3});glow(q.cx,q.cy+1);glow(q.cx-1,q.cy)}
  // the ruined chapel: its front is a wall, the rowan and a chest before it, graves and toadstools
  {const q=Q.chapel;DB('chest',q.x0+1,q.y0+1,{goldAmt:5000});for(const [x,y] of [[q.x1-1,q.cy-4],[q.x1-1,q.cy+4],[q.cx,q.y0+2],[q.cx-3,q.cy+3]])DB('grave',x,y);D('rowan',q.x1-2,q.cy,{npc:'wwo_rowan',deco:false});plaque(q.cx,q.y1,[0,1],['A CHAPEL','Services suspended. By the congregation.'])}
  // the well glade
  {const q=Q.well;DB('well',q.cx,q.cy);for(const [dx,dy] of [[-5,-3],[5,-3],[-5,3],[5,3]])DB(dx<0?'pine':'pine2',q.cx+dx,q.cy+dy);plaque(q.cx,q.y1,[0,1],WW_PLAQUES[5])}
  // the root hollow: dead oaks in a ring, the Flesh-Pile in the middle, a chest
  {const q=Q.hollow;for(const [dx,dy] of [[-5,-2],[5,-2],[-5,2],[5,2],[-2,-2],[2,-2]])DB(Math.abs(dx)===5?'oakface':'oakmoss',q.cx+dx,q.cy+dy);DB('chest',q.cx,q.y0+1,{goldAmt:6000});glow(q.cx,q.cy+2)}
  // the witch's clearing: the cottage in the north wall, the cauldron, empty cages, bone charms, totems of the old kind, pines along the sides
  {const q=Q.witch;DB('cauldron',doorX-4,3);DB('cageempty',doorX+4,3);DB('cageempty',doorX-7,5);DB('sign',doorX+1,q.y1-1,{npc:'wwo_sign',i:4});
    for(const [x,y] of [[doorX-4,3],[doorX+4,3],[doorX,2],[doorX-2,6],[doorX+2,6]])glow(x,y);
    for(let y=q.y0+3;y<=q.y1;y+=3)for(const x of [q.x0,q.x0+1,q.x1,q.x1-1])if(hs(x,y,91)<.6)tree(x,y,hs(x,y,92)<.5?'pine':'pine2');
    plaque(doorX-1,q.y1,[0,1],WW_PLAQUES[6])}
  // the two little glades
  {const q=Q.nw;DB('chest',q.x0+1,q.y0+1,{goldAmt:4500});for(let n=0;n<7;n++)DB('thorn',q.x0+((hs(n,1,95)*(q.x1-q.x0+1))|0),q.y0+((hs(n,2,95)*(q.y1-q.y0+1))|0))}
  {const q=Q.ne;DB('chest',q.x1-1,q.y0+1,{goldAmt:4500});for(const [dx,dy] of [[-3,-2],[3,-2],[-3,2],[3,2]])DB(dx<0?'willow':'oakmoss',q.cx+dx,q.cy+dy);}
  // the foes of the clearings
  for(const [id,t,dx,dy] of WW_FOES){const q=Q[id];let x=q.cx+dx,y=q.cy+dy;if(!foe(t,x,y)){let ok=false;for(let r=1;r<4&&!ok;r++)for(let a=-r;a<=r&&!ok;a++)for(let b=-r;b<=r&&!ok;b++)if(Math.max(Math.abs(a),Math.abs(b))===r&&isOpen(x+a,y+b)&&roomAt[(x+a)+','+(y+b)]===id)ok=foe(t,x+a,y+b)}}
  // trees scattered in the clearings, in what room is left, keeping a clear walk down the middle
  for(const id in Q){const q=Q[id];for(let y=q.y0;y<=q.y1;y++)for(let x=q.x0;x<=q.x1;x++){
      const edge=x<=q.x0+1||x>=q.x1-1||y<=q.y0+1||y>=q.y1-1,mid=Math.abs(x-q.cx)<=1||Math.abs(y-q.cy)<=1;
      if(id==='chapel'&&x>=q.x1-6&&Math.abs(y-41)<=3)continue;   // the chapel front is left clear to be seen
      if(hs(x,y,71)<(edge?.2:.05)&&!(mid&&!edge)&&!track.has(x+','+y))tree(x,y,id==='grave'||id==='chapel'||id==='circle'?['pine','pine2','oakmoss','thorn'][(hs(x,y,62)*4)|0]:undefined)}}
  // the foes of the paths: cells of the corridors, the nastier ones nearer the cottage
  const corr=[],dead=[];const deg=(x,y)=>WW_DIRS.filter(([a,b])=>isOpen(x+a,y+b)).length;
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!isOpen(x,y)||roomAt[x+','+y]||near4.has(x+','+y)||dd[y*W+x]<0)continue;corr.push([x,y]);if(deg(x,y)===1)dead.push([x,y])}
  const TIER=[['wwhound','wwscare','wwcrows','wwcrow'],['wwspider','wwtoad','wwcrow','wwrevenant','wwgolem'],['wwroot','wwgolem','wwrevenant','wwspider','wwtoad']];
  {const cand=corr.slice().sort(()=>R()-.5),placed=[],want=[4,5,5];const cnt=[0,0,0];
    for(const [x,y] of cand){const f=frac(x,y),t=f<.33?0:f<.66?1:2;if(cnt[t]>=want[t]||f<.12)continue;if(placed.some(([a,b])=>Math.abs(a-x)+Math.abs(b-y)<8))continue;
      const k=TIER[t][(hs(x,y,97)*TIER[t].length)|0];if(foe(k,x,y)){placed.push([x,y]);cnt[t]++}}}
  // dressing along the paths (walk through): only twisted branches on the dark ground; bridges over the brook
  for(const [x,y] of corr){if(occ.has(x+','+y))continue;const r=hs(x,y,63);if(r<.16)dec(r<.08?'twig':'twig2',x,y,{sc:.8+hs(x,y,67)*.5});else if(r<.2)dec('dbones',x,y,{sc:.3+hs(x,y,68)*.3})} // small bones here and there
  // bridges: on the track where it crosses the brook, and a couple of others
  {let n=0;for(const [x,y] of pathList){if(inBrook(x,y)&&!roomAt[x+','+y]&&n<2&&!occ.has(x+','+y)){dec('bridge',x,y,{sc:1});n++;x+=0}}
   for(const [x,y] of corr){if(n>=4)break;if(inBrook(x,y)&&!occ.has(x+','+y)&&hs(x,y,65)<.06){dec('bridge',x,y,{sc:.9});n++}}}
  // signposts at some junctions
  {let n=0;for(const [x,y] of corr){if(n>=6)break;if(deg(x,y)>=3&&!occ.has(x+','+y)&&hs(x,y,66)<.12&&frac(x,y)>.1){const d=dec('sign',x,y,{block:true,npc:'wwo_sign',i:1+(n%6)});if(d)n++}}}
  // small finds at dead ends, and a few chests
  {const IK=['potion3','potion3','supermana','elixir'];let ic=0,cc=0;for(const [x,y] of dead){if(occ.has(x+','+y)||hs(x,y,69)>.3)continue;
      if(cc<3&&hs(x,y,70)<.35){DB('chest',x,y,{goldAmt:3500+((hs(x,y,72)*2500)|0)});cc++}}}
  // ---- the quest objects ----
  const objAt=(alias,npc,x,y)=>{for(let r=0;r<5;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const xx=x+a,yy=y+b;if(isOpen(xx,yy)&&!occ.has(xx+','+yy)&&!near4.has(xx+','+yy)){const d=dec(alias,xx,yy,{npc,occ:1});if(d){d.deco=false;return [xx,yy]}}}return null};
  const pathAt=f=>pathList[Math.min(pathList.length-1,Math.floor(pathList.length*f))];
  const clue1=objAt('boot','wwo_boot',Q.gate.cx-4,Q.gate.cy-1),p2=pathAt(.28),clue2=objAt('ribbon','wwo_ribbon',p2[0],p2[1]),p3=pathAt(.5),clue3=objAt('crumbs','wwo_crumbs',p3[0],p3[1]);
  // the hag-stone lies in the dried brook, off the track
  let hag=null;{const cs=corr.filter(([x,y])=>inBrook(x,y)&&!track.has(x+','+y)&&!occ.has(x+','+y)&&frac(x,y)>.2).sort((a,b)=>Math.abs(a[0]-22)-Math.abs(b[0]-22));if(cs.length)hag=objAt('hagstone','wwo_hagstone',cs[0][0],cs[0][1])}
  // ---- the walls ----
  const rows=[],fm=[];
  // the maze walls are trees: every wall square beside an open one is open ground with a dark tree on it (placed below); the solid mass behind them, and the edge of the wood, stay wall
  const treeSq=new Set();for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(g[y][x]!=='#')continue;let n=false;for(let a=-1;a<=1&&!n;a++)for(let b=-1;b<=1;b++)if(g[y+b][x+a]==='.'){n=true;break}if(n)treeSq.add(y*W+x)}
  // every path of the maze is pale dirt, and the ground under the trees is the darkest moss, so the way can be followed through the trunks
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const k=y*W+x;if(treeSq.has(k))fl[k]=0;else if(g[y][x]==='.'&&!roomAt[x+','+y]&&fl[k]!==3)fl[k]=2}
  for(let y=0;y<H;y++){let r='',f='';for(let x=0;x<W;x++){r+=g[y][x]==='.'||treeSq.has(y*W+x)?'.':wallChar(x,y);f+=String(fl[y*W+x])}rows.push(r);fm.push(f)}
  // the gate to Wenlock (south) and the cottage door (north)
  const gx=doorX;
  {const gh=2.6,gid=wwTile('tex_0',gh,{fac:{img:'bldg_3',i:1,n:3},gain:1.3,rgb:[.8,1,.86]}),ga=wwTile('tex_0',gh,{fac:{img:'bldg_3',i:2,n:3},gain:1.3,rgb:[.8,1,.86]}),gb=wwTile('tex_0',gh,{fac:{img:'bldg_3',i:0,n:3},gain:1.3,rgb:[.8,1,.86]});
   const setc=(x,y,gidv)=>{const c=ch(gidv);rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
   setc(gx,H-1,gid);setc(gx-1,H-1,ga);setc(gx+1,H-1,gb);
   KH_DOOR[gid]={ww:'gate',get lvl(){return WK.WENLOCK},get at(){return WK.WITCHBACK||{x:38,y:4,f:2}}};
   const cd=wwTile('tex_4',4.6,{fac:{img:'front_1',i:2,n:5},gain:1.3});setc(doorX,0,cd);
   KH_DOOR[cd]={ww:'cottage',get lvl(){return WW.COTTAGE},get at(){const L=LEVELS[WW.COTTAGE],s=L&&L.start;return s?{x:s.x,y:s.y,f:0}:{x:8,y:9,f:0}}}}
  const mapNames=[];for(const id in Q)mapNames.push({t:WW_RNAME[id],x:Q[id].cx,y:Q[id].cy,k:'place'});
  const lv={rows,chars,fmap:fm,floorSet:WW_FLOORSET,floor:WW_FLOORSET[0],ceil:'cloud',start:{x:sx,y:sy,f:0},enemies,items,decor,lights,portals:[],day:.44,outdoor:true,amb:.36,
    name:"Blackbriar Wood",label:"Blackbriar Wood",noExtras:true,diff:82,ceilH:5.2,noTele:true,mapNames,
    _ww:{Q,roomAt,track:[...track],pathList,hag,clue1,clue2,clue3,dead:dead.length,wglow,brookY,dDoor,foes:enemies.length,decor:decor.length}};
  // ---- checks: every open square is reachable; nothing that stands in the way cuts a clearing off ----
  {const blockSet=()=>{const s=new Set();for(const d of decor)if(d.block)s.add(d.x+','+d.y);return s};   // creatures can be fought through, so only the standing things count
   const flood=bs=>{const seen=new Uint8Array(W*H),q=[sy*W+sx];seen[q[0]]=1;for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of WW_DIRS){const nx=x+a,ny=y+b;if(!isOpen(nx,ny)||seen[ny*W+nx]||bs.has(nx+','+ny))continue;seen[ny*W+nx]=1;q.push(ny*W+nx)}}return seen};
   let removed=0;for(let pass=0;pass<5;pass++){const bs=blockSet(),seen=flood(bs);const kill=new Set();
     for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(isOpen(x,y)&&!seen[y*W+x]&&!bs.has(x+','+y)){for(const [a,b] of WW_DIRS){const k=(x+a)+','+(y+b);if(bs.has(k))kill.add(k)}}
     if(!kill.size)break;
     for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.block&&kill.has(d.x+','+d.y)&&d.k!=='chest'&&!d.npc){decor.splice(i,1);removed++}}
     for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(kill.has(e.x+','+e.y)&&e.t!=='wwabom'){enemies.splice(i,1);removed++}}}
   lv._ww.removed=removed}
  {const TA=['pine','pine2','oakface','thorn','pine','willow','oakmoss','pine2'];for(const k of treeSq){const x=k%W,y=(k/W)|0;if(hs(x,y,69)<.011){decor.push({k:'dbones',x,y,block:true,sc:1.5+hs(x,y,62)*.5});continue}   // skeletal remains deep among the trees, where nobody can reach them
     decor.push({k:'ww_'+TA[(hs(x,y,61)*TA.length)|0],x,y,block:true,sc:.92+hs(x,y,62)*.4})}
   lv._ww.tree=treeSq;
   lv._wdOnly=new Set();for(const id in Q){if(id==='gate'||id==='witch')continue;const q=Q[id];for(let y=q.y0+1;y<=q.y1-1;y++)for(let x=q.x0+1;x<=q.x1-1;x++)lv._wdOnly.add(x+','+y)}}   // the wild caves and ruins (wilds.js) may stand only in the clearings
  LEVELS[WW.ID]=lv;LEVEL_NAMES[WW.ID]="Blackbriar Wood";LEVEL_RATING[WW.ID]=82;
  {const NN=W*H,hh=new Float32Array(NN).fill(.3),rk=new Float32Array(NN),block=new Uint8Array(NN);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]!=='.')block[y*W+x]=1;try{TERRS[WW.ID]=yarTerrain(W,H,hh,rk,block)}catch(e){}}
  try{wwBuildRooms()}catch(e){console.error('wwBuildRooms',e)}
  return lv}
KH_LAZY[WW.ID]=wwBuild;LEVEL_NAMES[WW.ID]='Blackbriar Wood';LEVEL_RATING[WW.ID]=82;
for(const n of [521,522,523])LEVEL_RATING[n]=82;
/* the doors: a locked cottage door, and the gate */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.ww==='cottage'){const F=G.flags;if(!(F.wwT1&&F.wwT2&&F.wwT3)){sfx('locked');msg('Green fire crawls over the cottage door and spits at your hand. Her wards still hold: three bone totems feed them.','#a8e090');return true}}
  return _k.apply(this,arguments)}}
/* the creatures that stand still until the party is close ("ambushers in the fog") wake with a line of text; the rest come when they see you */
{const _ea=enemyAct;enemyAct=function(e){
  try{const d=ENEMY_DEF[e.t];if(d&&d.still&&!e.alert){const dist=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);
    if(dist<=2){e.alert=true;try{msg(d.wake,'#c8e0a0');sfx('rattle')}catch(x){}return 220}
    return 0}
   if(d&&d.ww&&d.wake&&!e.alert&&!d.still){const dist=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);if(dist<=3&&!e.woke){e.woke=1;try{msg(d.wake,'#c8e0a0')}catch(x){}}}}catch(x){console.error(x)}
  return _ea.apply(this,arguments)}}
/* chests of the wood: potions, mana, gear, a ring, and the gold the chest was made with */
{const _lf=lootFor;lootFor=function(d){
  if(wwIs(LEVEL)&&d&&d.k==='chest'){
    const r=k=>hash2(d.x,d.y,300+k),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
    for(let q=0;q<3;q++)add(potionFor(r(40+q)),1);add('supermana',2);add('elixir',1);
    for(let q=0;q<2;q++){const a=typeof armourDrop==='function'?armourDrop(r(60+q)):null;if(a)add(a)}
    if(typeof ringFor==='function')add(ringFor(r(9),82));
    d.gold=d.goldAmt||4000;return items}
  return _lf.apply(this,arguments)}}
/* the green lights: sickly glows near the witch, her totems, the toadstool rings and the wisps; put in on every arrival (lights are cleared whenever a level is entered) */
function wwLights(){
  try{const L=LEVELS[LEVEL];if(!L)return;const list=LEVEL===WW.ID?(L._ww&&L._ww.wglow)||[]:(L._wwl||[]);
    for(const [x,y] of list)LIGHTS.push({x:x+.5,y:y+.5,ph:hash2(x,y,13)*6.28,key:-5000-LIGHTS.length,taken:false,red:false,free:true,calm:true,col:[.45,1.25,.5],kI:LEVEL===WW.ID?.8:1.1,range2:LEVEL===WW.ID?30:60})}catch(e){console.error('wwLights',e)}}
/* arrival: the lights, the witch, the kitchen's creature and the freed folk of Wenlock (see ww_quests.js for wwArrive) */
{const _g=goToLevel;goToLevel=function(n,entry){const r=_g.apply(this,arguments);try{if(wwIs(n)||n===WL.ID)wwArrive(n)}catch(e){console.error('wwArrive',e)}return r}}
/* the way back: out of the gate to Blackbriar Lane */
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);try{if(!out.some(r=>r.n===WW.ID)){out.push({h:"Blackbriar Wood, north of Wenlock"});out.push({n:WW.ID,name:"Blackbriar Wood"});for(const n of [521,522,523])out.push({n,name:LEVEL_NAMES[n]||('Level '+n)})}}catch(e){console.error(e)}return out}}
/* Wenlock's end of it: Blackbriar Lane runs north from the back track to a gate in the north wall (called by wlBuild in wenlock_town.js) */
const WW_LANE={x:38,y0:3,y1:13};
function wwWenlockGate(C){
  try{
    const {rows,block,fm,street,decor,solid,ch,W}=C,x=WW_LANE.x;
    for(let y=WW_LANE.y0;y<=WW_LANE.y1;y++){street.add(x+','+y);fm[y*W+x]='3';for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.x===x&&d.y===y&&d.block)decor.splice(i,1)}}
    // the gate: three squares of the north wall painted with the iron gate and its crows
    const gh=2.5,mid=wwTile('tex_0',gh,{fac:{img:'bldg_3',i:1,n:3},gain:1.3,rgb:[.8,1,.86]}),lft=wwTile('tex_0',gh,{fac:{img:'bldg_3',i:0,n:3},gain:1.3,rgb:[.8,1,.86]}),rgt=wwTile('tex_0',gh,{fac:{img:'bldg_3',i:2,n:3},gain:1.3,rgb:[.8,1,.86]});
    const setc=(xx,yy,gid)=>{const c=ch(gid);rows[yy][xx]=c;block[yy*W+xx]=1};
    setc(x-1,2,lft);setc(x,2,mid);setc(x+1,2,rgt);
    KH_DOOR[mid]={ww:'wenlockgate',get lvl(){return WW.ID},get at(){return WK.WITCHSTART||{x:27,y:53,f:0}}};
    C.decor.push({k:'greensign',x:x+1,y:5,block:false,walk:true,npc:'wwo_lanesign',deco:false});
    C.lamp&&0;
  }catch(e){console.error('wwWenlockGate',e)}}
