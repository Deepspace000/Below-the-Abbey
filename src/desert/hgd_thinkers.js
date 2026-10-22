/* ==========================================================================
   THE THINKERS OF THE MAZE (prefix hgdk / HGDK). Eight people who walk slowly up and down a stretch of passage and say something wise about mazes, to anyone who stops them.
   They keep to the safe ground (never inside a danger zone), walk through the party, and stand still while they talk or when the party is beside them.
   ========================================================================== */
const HGDK_NAMES=[['Old Wend','hg_npc1'],['Mother Loop','hg_npc2'],['The Pacing Scholar','hg_npc3'],['Brother Tangent','hg_npc4'],['Sister Detour','hg_npc5'],['The Slow Surveyor','hg_npc1'],['Grandfather Corner','hg_npc2'],['The Quiet Walker','hg_npc3']];
const HGDK_SAY=[
 'A maze is only a corridor that has changed its mind.','Every wrong turn is a right turn for somebody else.','The wall is not your enemy. It is the shape of your choices.',
 'You are never lost in a maze. You are merely somewhere you did not expect to be.','A dead end is a very honest sort of corridor. It tells you plainly where it stands.',
 'They say the way out is always on the left. They are wrong, and they are also right.','I have walked this passage a thousand times, and it has never been the same length twice.',
 'If you must pick a door, pick the one you are afraid of. The others are only distractions.','A map is a promise made by someone who has already been lost.',
 'The only unwise thing to do in a maze is to stand still and wait for it to get simpler.','Some say the maze is made of walls. I say it is made of the spaces between them.',
 'Do not count your steps. Count your reasons.','Turn back often. A maze rewards those who can change their minds.','Every secret door is somebody\'s good idea, kept very quiet.',
 'The deeper you go, the more the maze looks like you.','Patience is a shortcut that takes the long way round.','When two paths look the same, one of them is lying.',
 'I never ask which way is out. I ask which way is interesting.','Walk slowly. The maze is not going anywhere, and neither, I find, am I.','A lantern shows you the next step. A friend shows you why to take it.'];
for(let i=0;i<8;i++)khNpc('hgd_think'+i,HGDK_NAMES[i][0],HGDK_NAMES[i][1],d=>{const F=G.flags,ck='hgdth'+i,n=F[ck]=(F[ck]||0)+1;
  const nodeFn=()=>hgdNode(HGDK_SAY[(i*3+n)%HGDK_SAY.length],[['Anything else?',()=>{F[ck]++;return hgdNode(HGDK_SAY[(i*3+F[ck])%HGDK_SAY.length],[BYE],nodeFn)}],BYE],nodeFn);return nodeFn()});
const HGDK={agents:[],dec:null};
function hgdkBuild(L){
  if(L._hgdk)return;const M=L._hgdm,W=M.W,P=L._hgdp,rows=L.rows,kind=M.kind,open=(x,y)=>rows[y]&&rows[y][x]==='.',rnd=hgdmRng(475008);
  const occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const danger=P.zones.filter(z=>z.type==='danger'),inDanger=(x,y)=>danger.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+3);
  const nbs=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,y+b]).filter(([a,b])=>open(a,b));
  const out=[];let tries=0;
  while(out.length<8&&tries++<4000){const x=4+((rnd()*(W-8))|0),y=4+((rnd()*(W-8))|0);
    if(!open(x,y)||kind[y*W+x]||!reach.has(x+','+y)||occ.has(x+','+y)||inDanger(x,y)||nbs(x,y).length!==2)continue;
    if(out.some(o=>Math.hypot(o.path[0][0]-x,o.path[0][1]-y)<28))continue;
    // a stretch of passage: walk both ways from here along the single passage, up to six squares each
    const path=[[x,y]];let ok=true;
    for(const dir of [0,1]){let px=x,py=y,prev=null,steps=0;
      while(steps<7){const n=nbs(px,py).filter(c=>!(prev&&c[0]===prev[0]&&c[1]===prev[1])&&!path.some(p=>p[0]===c[0]&&p[1]===c[1]));if(n.length!==1&&!(steps===0&&n.length>=1))break;const c=n[dir===0?0:n.length-1];if(!c||kind[c[1]*W+c[0]]||occ.has(c[0]+','+c[1])||inDanger(c[0],c[1]))break;
        prev=[px,py];px=c[0];py=c[1];if(dir===0)path.push([px,py]);else path.unshift([px,py]);steps++}}
    if(path.length<9)continue;
    const i=out.length,s0=Math.floor(path.length/2);occ.add(path[s0][0]+','+path[s0][1]);
    L.decor.push({k:HGDK_NAMES[i][1],x:path[s0][0],y:path[s0][1],block:false,walk:true,npc:'hgd_think'+i,sc:.72});
    out.push({npc:'hgd_think'+i,path,i:s0,dir:1,f:0})}
  // herbs lying on the ground here and there, in the quiet places (never in a danger zone)
  {const rating=(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[HGD.ID])||HGD.DIFF,pool=HERBS.filter(h=>rating>=h[3]);let nh=0,t2=0;
    while(nh<70&&t2++<6000&&pool.length){const x=3+((rnd()*(W-6))|0),y=3+((rnd()*(W-6))|0);if(!open(x,y)||!reach.has(x+','+y)||occ.has(x+','+y)||inDanger(x,y))continue;
      let tot=0;const w=pool.map(h=>{const v=h[3]?1:4;tot+=v;return v});let u=rnd()*tot,g=pool[0];for(let i=0;i<pool.length;i++){u-=w[i];if(u<=0){g=pool[i];break}}
      occ.add(x+','+y);L.items.push({k:'herb_'+g[0],x,y});nh++}}
  // statues at dead ends: a shell statue or a pearl plinth where a passage simply stops
  {let ns=0;const de=[];for(let y=3;y<W-3;y++)for(let x=3;x<W-3;x++)if(open(x,y)&&!kind[y*W+x]&&reach.has(x+','+y)&&!occ.has(x+','+y)&&nbs(x,y).length===1&&!inDanger(x,y))de.push([x,y]);
    de.sort(()=>rnd()-.5);const got=[];for(const c of de){if(ns>=48)break;if(got.some(g=>Math.hypot(g[0]-c[0],g[1]-c[1])<9))continue;got.push(c);occ.add(c[0]+','+c[1]);L.decor.push({k:ns%3===2?'hgtb_deco_pearlplinth':'hgtb_deco_shellstatue',x:c[0],y:c[1],block:true});ns++}
    L._hgdkStatues=ns}
  // cracked walls: a wall that looks broken, between two passages: walk into it and it crumbles into a way through to the other side. Quite a few.
  {const TM=ohTiles(),S=L._hgds,ch=[];const tex=bi=>{const key='hgdk_crack'+bi;if(!IMG[key]){const b=IMG[HGDM.biomes[bi].wall];IMG[key]=mkCanvas(128,128,(x,w,h)=>{if(b)x.drawImage(b,0,0,w,h);else{x.fillStyle='#777';x.fillRect(0,0,w,h)}
        x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,0,w,h);x.strokeStyle='rgba(8,4,2,.95)';x.lineWidth=3.2;x.lineJoin='round';x.beginPath();x.moveTo(60,0);x.lineTo(72,26);x.lineTo(54,48);x.lineTo(76,74);x.lineTo(58,98);x.lineTo(70,h);x.stroke();
        x.lineWidth=1.6;x.beginPath();x.moveTo(72,26);x.lineTo(98,34);x.moveTo(54,48);x.lineTo(28,58);x.moveTo(76,74);x.lineTo(102,90);x.moveTo(58,98);x.lineTo(34,112);x.stroke();
        x.fillStyle='rgba(6,3,2,.8)';x.beginPath();x.moveTo(54,48);x.lineTo(76,74);x.lineTo(62,86);x.lineTo(46,64);x.closePath();x.fill();
        x.fillStyle='rgba(200,190,170,.55)';for(const [a,c,r] of [[40,112,5],[88,118,4],[64,121,6],[104,108,3],[22,116,4]]){x.beginPath();x.ellipse(a,c,r,r*.6,0,0,6.3);x.fill()}})}return key};
    const chars=HGDM.biomes.map((b,i)=>{const sty='hgdk_cr'+i;OH_STY[sty]=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:tex(i),door:tex(i),win:tex(i),alt:tex(i),zoom:1,contrast:1.0,tint:[255,255,255,0]});const c=String.fromCharCode(0x340+i);L.chars[c]=TM.make('plain',sty,2.7).gid;return c});
    const rows2=L.rows.map(r=>r.split('')),cands=[];
    for(let y=3;y<W-3;y++)for(let x=3;x<W-3;x++){const c=rows2[y][x];if(c==='.'||c.charCodeAt(0)<0x2e0||c.charCodeAt(0)>=0x2e8)continue;
      for(const [a,b] of [[1,0],[0,1]]){const p=[x-a,y-b],r=[x+a,y+b];if(!open(p[0],p[1])||!open(r[0],r[1])||kind[p[1]*W+p[0]]||kind[r[1]*W+r[0]]||!reach.has(p[0]+','+p[1])||!reach.has(r[0]+','+r[1])||inDanger(x,y))continue;
        // not beside another door or a stone
        if(S&&Object.keys(S.doors).some(k=>{const q=k.split(',');return Math.hypot(+q[0]-x,+q[1]-y)<6}))continue;cands.push([x,y])}}
    cands.sort(()=>rnd()-.5);const done=[];for(const c of cands){if(done.length>=70)break;if(done.some(d=>Math.hypot(d[0]-c[0],d[1]-c[1])<9))continue;done.push(c);
      rows2[c[1]][c[0]]=chars[M.bio[c[1]*W+c[0]]];if(S)S.doors[c[0]+','+c[1]]={type:'secret',idx:0,look:'crack'}}
    L.rows=rows2.map(r=>r.join(''));L._hgdkCracks=done.length}
  // little creatures of the grassland wander through the open places and the quiet passages (decoration only: they cannot be fought or spoken to)
  const PETS_=['hgtb_pinkbulb','hgtb_lilacmoth','hgtb_lanternbeetle','hgtb_pearlslug','hgtb_jadefinmoth','hgtb_spindleray','hgtb_amberpup','hgtb_fishbeetle','hgtb_creamjelly','hgtb_jadeeel','hgtb_fishfly','hgtb_creammoth','hgtb_pups'],FLY_=new Set(['hgtb_lilacmoth','hgtb_jadefinmoth','hgtb_spindleray','hgtb_fishfly','hgtb_creammoth','hgtb_creamjelly']);
  const pets=[];let tp=0;
  while(pets.length<26&&tp++<5000){const x=4+((rnd()*(W-8))|0),y=4+((rnd()*(W-8))|0);if(!open(x,y)||!reach.has(x+','+y)||occ.has(x+','+y)||inDanger(x,y))continue;
    const wide=kind[y*W+x]>0;if(!wide&&rnd()<.6)continue; // mostly in the open places
    const img=PETS_[(rnd()*PETS_.length)|0];occ.add(x+','+y);const id='hgdpet'+pets.length;
    L.decor.push({k:img,x,y,block:false,walk:true,deco:true,petid:id,sc:.7,bob:FLY_.has(img)?.45:0});pets.push({id,home:[x,y],cell:[x,y],tgt:null,f:0,wait:rnd()*3})}
  L._hgdk={agents:out,pets}}
// the walking: one square in about two seconds, a smooth slide; they stop while spoken to or while the party is beside them
{const _u=update;update=function(dt){
  try{if(LEVEL===HGD.ID&&G.state==='play'&&G.decor){const L=LEVELS[HGD.ID];if(L&&L._hgdk){
    if(HGDK.dec!==G.decor){HGDK.dec=G.decor;HGDK.map=new Map()}
    for(const a of L._hgdk.agents){let d=HGDK.map.get(a.npc);if(!d){d=G.decor.find(q=>q.npc===a.npc);if(!d)continue;HGDK.map.set(a.npc,d)}
      const cur=a.path[a.i],nextI=a.i+a.dir;
      const near=Math.hypot(cur[0]-G.P.x,cur[1]-G.P.y)<2.6,talking=G.talk&&G.talk.d&&G.talk.d.npc===a.npc;
      if(near||talking||G.cut)continue;
      a.f+=dt*.5;if(a.f>=1){a.f=0;a.i=nextI;if(a.i<=0||a.i>=a.path.length-1)a.dir=-a.dir}
      const c=a.path[a.i],n=a.path[a.i+a.dir]||c;d.x=c[0];d.y=c[1];d.ox=(n[0]-c[0])*a.f;d.oy=(n[1]-c[1])*a.f}}}}catch(e){}
  return _u.apply(this,arguments)}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('A cracked wall is not a wall. Walk into it and it crumbles, and you are on the other side of the passage.','There are statues at the dead ends. Someone liked the idea of a face to look at when the passage ran out.');
// the little creatures: a slow wander round their home square, a pause, a few steps
{const _u=update;let dec=null,map=null,blk=null;update=function(dt){
  try{if(LEVEL===HGD.ID&&G.state==='play'&&G.decor){const L=LEVELS[HGD.ID];if(L&&L._hgdk&&L._hgdk.pets){
    if(dec!==G.decor){dec=G.decor;map=new Map();blk=new Set(G.decor.filter(q=>q.block).map(q=>q.x+','+q.y))}
    const open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&!blk.has(x+','+y),zones=L._hgdp.zones.filter(z=>z.type==='danger');
    for(const a of L._hgdk.pets){let d=map.get(a.id);if(!d){d=G.decor.find(q=>q.petid===a.id);if(!d)continue;map.set(a.id,d)}
      if(!a.tgt){a.wait-=dt;if(a.wait>0)continue;
        const opts=[[1,0],[-1,0],[0,1],[0,-1]].map(([x,y])=>[a.cell[0]+x,a.cell[1]+y]).filter(([x,y])=>open(x,y)&&Math.hypot(x-a.home[0],y-a.home[1])<=4&&!zones.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+2));
        if(!opts.length){a.wait=2;continue}a.tgt=opts[(Math.random()*opts.length)|0];a.f=0}
      a.f+=dt*.6;if(a.f>=1){a.cell=a.tgt;a.tgt=null;a.f=0;a.wait=.8+Math.random()*3.5;d.x=a.cell[0];d.y=a.cell[1];d.ox=0;d.oy=0;continue}
      d.x=a.cell[0];d.y=a.cell[1];d.ox=(a.tgt[0]-a.cell[0])*a.f;d.oy=(a.tgt[1]-a.cell[1])*a.f}}}}catch(e){}
  return _u.apply(this,arguments)}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdt)try{hgdkBuild(L)}catch(e){console.error('hgdk',e)}}}
