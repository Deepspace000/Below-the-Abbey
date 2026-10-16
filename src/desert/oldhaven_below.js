/* ==========================================================================
   OLDHAVEN, ACT 4: THE ORRERY AND THE DESCENT. Captain Aldwyn reads Ishkander's sealed letter: the six pieces make the Orrery of Hours,
   which opens the sealed door under the Abbey crypts. The party sails home, opens the door and goes down four levels to the Hollow Abbot.
   Behind him a stair leads to the Hollow Land, the next part of the game (not built yet: it holds a plaque and nothing else).
   Four quests: the Orrery, the way home, the four floors, the Hollow Abbot.
   ========================================================================== */
const BELOW={IDS:[360,361,362,363],LAND:364,NAMES:['The Sealed Stair','The Drowned Cloister','The Ossuary of Brothers','The Hollow Abbey'],SIZE:[[31,23],[35,25],[39,27],[43,29]]};
ITEMDEF.orrery={n:'The Orrery of Hours',k:'quest',t:'Quest item',ic:'herb',c:'#e8d070',stack:0,price:0,d:'Six small pieces of brass, glass and stone, fitted together by the king’s clockmaker. A ring of moving discs ticks slowly in your hand. It opens the sealed door under the Abbey.',sw:.4};
ENEMY_DEF.hollowabbot={name:'The Hollow Abbot',hp:2600,dmg:[26,42],hit:.86,w:1.25,img:'wraith',xp:12000,gold:[900,1400],speed:1,verb:'strikes',aboveParty:4};

/* ---- the four levels: rooms and passages in the old crypt style ---- */
function belowBuild(n){
  const id=BELOW.IDS[n];if(LEVELS[id])return;
  if(typeof KH_READY!=='undefined'&&!KH_READY)return; // Brother Sevrin's picture is not loaded yet (goToLevel waits for it)
  const [W,H]=BELOW.SIZE[n],hs=(a,b,c)=>hash2(a,b,c),R=(i,m)=>(hs(n*31+i,n*7+5,93)*m)|0;
  const g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const rooms=[],cut=r=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.'};
  const want=6+n;
  rooms.push({x0:(W>>1)-2,y0:H-5,x1:(W>>1)+2,y1:H-3});
  for(let t=0;t<900&&rooms.length<want;t++){
    const big=n===3&&rooms.length===want-1;const w=big?9:4+R(100+t,4),h=big?7:3+R(200+t,3),x0=1+R(300+t,W-w-2),y0=1+R(400+t,H-h-2);
    if(rooms.some(r=>x0<=r.x1+2&&x0+w-1>=r.x0-2&&y0<=r.y1+2&&y0+h-1>=r.y0-2))continue;
    rooms.push({x0,y0,x1:x0+w-1,y1:y0+h-1});
  }
  rooms.forEach(cut);
  const mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  for(let i=1;i<rooms.length;i++){
    let bj=0,bd=1e9;const [ax,ay]=mid(rooms[i]);
    for(let j=0;j<i;j++){const [bx,by]=mid(rooms[j]),d=Math.abs(ax-bx)+Math.abs(ay-by)+R(500+i*9+j,6);if(d<bd){bd=d;bj=j}}
    const [bx,by]=mid(rooms[bj]);
    const hl=(y,x0,x1)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)g[y][x]='.'},vl=(x,y0,y1)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)g[y][x]='.'};
    if(R(600+i,2)===0){hl(ay,ax,bx);vl(bx,ay,by)}else{vl(ax,ay,by);hl(by,ax,bx)}
  }
  // the stair up, in the bottom wall of the first room
  const r0=rooms[0],ux=(r0.x0+r0.x1)>>1,uy=r0.y1+1;g[uy][ux]='0';
  const start={x:ux,y:r0.y1,f:0};
  // the furthest room by walking distance holds the stair down
  const d=new Int16Array(W*H).fill(-1),q=[start.x+start.y*W];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}
  let far=rooms[rooms.length-1],fd=-1;for(const r of rooms){const [mx,my]=mid(r),v=d[my*W+mx];if(v>fd){fd=v;far=r}}
  const dxm=(far.x0+far.x1)>>1,dy0=far.y0-1;g[dy0][dxm]='1';
  const down={x:dxm,y:far.y0};
  // torches in the walls beside the floor
  const rows=g.map((r,y)=>r.map((c,x)=>{if(c!=='#')return c;if(x>0&&g[y][x-1]==='.'&&hs(x,y,70+n)<.07)return '%';if(y>0&&g[y-1][x]==='.'&&hs(x,y,71+n)<.07)return '%';return '#'}).join(''));
  const decor=[],enemies=[],items=[],used=new Set([start.x+','+start.y,down.x+','+down.y]);
  const cells=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]==='.'&&d[y*W+x]>6)cells.push([x,y]);
  const pickc=i=>{for(let t=0;t<40;t++){const c=cells[R(900+i*13+t,cells.length)];if(c&&!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);return c}}return null};
  const kinds=[['skel','rat','bat'],['skel','skel','bat','ghost'],['skel','ghost','spectre'],['skel','spectre','wraith']][n];
  for(let i=0;i<8+n*2;i++){const c=pickc(i);if(c)enemies.push({t:kinds[R(950+i,kinds.length)],x:c[0],y:c[1]})}
  for(let i=0;i<3;i++){const c=pickc(100+i);if(c)items.push({k:'potion',x:c[0],y:c[1]})}
  for(let i=0;i<5;i++){const c=pickc(200+i);if(c)decor.push({k:['coffin','barrel','bones','coffin','grave'][i],x:c[0],y:c[1],block:i!==2})}
  // the people and the boss
  const kpS=KH_KEEPERS.ab_sevrin;
  if(n===3&&kpS){decor.push({k:khFaceKey(kpS.face),x:start.x,y:start.y-1,block:false,walk:true,npc:'ab_sevrin',sc:kpS.sc||1})}
  if(n===3){const [mx,my]=mid(far);enemies.push({t:'hollowabbot',x:mx,y:my+1});decor.push({k:'chest',x:far.x0,y:far.y1,block:true,magic:1})}
  const portals=[{to:n?BELOW.IDS[n-1]:1,x:0,y:0,f:2,tex:'tomb'},{to:n<3?BELOW.IDS[n+1]:BELOW.LAND,x:0,y:0,f:0,tex:'tomb'}];
  if(n===3){portals[1].req='hollowSlain';portals[1].lock='The stair is covered by a slab of black stone. It will not move while the Hollow Abbot lives.'}
  const lv={rows,start,enemies,items,decor,name:BELOW.NAMES[n],label:'Below the Abbey',diff:34+n*3,portals,lights:[]};
  LEVELS[id]=lv;LEVEL_NAMES[id]=BELOW.NAMES[n];
  lv._down=down;lv._up=start;
}
function belowLink(){ // portals know where the next level starts, so they are filled in when each level is built
  BELOW.IDS.forEach((id,n)=>{const L=LEVELS[id];if(!L)return;
    const prev=n?LEVELS[BELOW.IDS[n-1]]:LEVELS[1],next=n<3?LEVELS[BELOW.IDS[n+1]]:null;
    if(n===0){L.portals[0].x=3;L.portals[0].y=18;L.portals[0].f=0}
    else if(prev&&prev._down){L.portals[0].x=prev._down.x;L.portals[0].y=prev._down.y;L.portals[0].f=2}
    if(next&&next._up){L.portals[1].x=next._up.x;L.portals[1].y=next._up.y;L.portals[1].f=0}
  });
}
BELOW.IDS.forEach((id,n)=>{KH_LAZY[id]=()=>{BELOW.IDS.forEach((_,k)=>belowBuild(k));belowLink()};LEVEL_NAMES[id]=BELOW.NAMES[n]});
// the Hollow Land, where the next part of the game will begin
function landBuild(){
  if(LEVELS[BELOW.LAND])return;
  const W=25,H=17,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  for(let y=3;y<H-2;y++)for(let x=3;x<W-3;x++)g[y][x]='.';g[H-2][W>>1]='0';
  const kp=KH_KEEPERS.ab_plaque;
  LEVELS[BELOW.LAND]={rows:g.map(r=>r.join('')),start:{x:W>>1,y:H-3,f:0},enemies:[],items:[],decor:kp?[{k:khFaceKey(kp.face),x:W>>1,y:6,block:false,walk:true,npc:'ab_plaque',sc:1}]:[],name:'The Hollow Land',label:'The Hollow Land',diff:40,
    portals:[{to:BELOW.IDS[3],x:0,y:0,f:2,tex:'tomb'}]};
  LEVEL_NAMES[BELOW.LAND]='The Hollow Land';
}
KH_LAZY[BELOW.LAND]=()=>{BELOW.IDS.forEach((_,k)=>belowBuild(k));belowLink();landBuild();const p=LEVELS[BELOW.LAND].portals[0],d=LEVELS[BELOW.IDS[3]]._down;if(d){p.x=d.x;p.y=d.y}};
LEVEL_NAMES[BELOW.LAND]='The Hollow Land';

/* ---- quests ---- */
const adq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Below the Abbey'};
if(QAREA_ORDER.indexOf('Below the Abbey')<0)QAREA_ORDER.splice(QAREA_ORDER.indexOf('Elsewhere'),0,'Below the Abbey');
const PARTS=['dv1','dv2','dv3','dv4','dv5','dv6'];
adq('ad1','The Orrery of Hours','Captain Aldwyn, of the Gate','Ishkander’s letter says the six pieces fit together into the Orrery of Hours, which opens a sealed door under the Abbey crypts. Aldwyn’s clockmaker will fit them while you wait. Bring all six pieces from the fair.',6,()=>PARTS.reduce((n,p)=>n+(bagCount(p)>0?1:0),0),{gold:3000,xp:30000,items:['orrery']});
adq('ad2','Home to the Abbey','The Sealed Door','A royal cutter takes the party home to the Thornwood. Go down into the crypts below the Abbey, to the old stair where the journey began, and find the sealed door.',1,()=>G.flags.homeAbbey?1:0,{gold:500,xp:5000});
adq('ad3','The Four Floors','Brother Sevrin','Behind the sealed door a stair goes down four floors. Reach the bottom, the Hollow Abbey, and speak to Brother Sevrin.',1,()=>G.flags.reachedBottom?1:0,{gold:2000,xp:20000});
adq('ad4','The Hollow Abbot','Brother Sevrin','The Hollow Abbot sits at the bottom of the Hollow Abbey, and the stair onward is under his seat. Kill him.',1,q=>(G.flags.k_hollowabbot||0)-(q.base||0),{gold:8000,xp:80000},{cnt:'k_hollowabbot'});
const ADD={
 ad1:khQD('The king has read Ishkander’s letter, and so have I. The six pieces you carry fit together into a device called the Orrery of Hours. It opens a sealed door beneath the Abbey where you started. Ishkander says the door must be opened by us, and not by Vance’s masters. I have a clockmaker who can fit it together right now. Bring me all six pieces.','Six pieces: the cog, the pin, the spring, the bell, the lens and the dial. Bring them all.',(g,n)=>`The pieces: you hold ${g} of ${n}.`,'All six pieces! Here, give them to the clockmaker. It will take a minute.','The clockmaker has fitted the Orrery. It ticks. It is yours. When you are ready, a royal cutter will take you home.','The Orrery is made.','Here are all six pieces.')
};
repWrap('oh_cap',()=>!!G.flags.heirReported&&qSt('ad1')!=='done','About Ishkander’s letter',()=>qNode('ad1',ADD.ad1));
repWrap('oh_cap',()=>qSt('ad1')==='done'&&!G.flags.homeAbbey,'Take the royal cutter home',()=>say('A royal cutter, with a crew of eight and a good wind, will have you at the Thornwood in a day. The Abbey is a quiet place, and I do not know what waits under it. Are you ready?',[['Sail home.',()=>{G.flags.homeAbbey=1;msg('The royal cutter carries the party home to the Abbey.','#a8d8ff');goToLevel(1,{x:3,y:18,f:0});return null}],['Not yet.',()=>null]]));
{const _t=qTurnIn;qTurnIn=function(id){
  const r=_t.apply(this,arguments);
  if(id==='ad1'&&qSt('ad1')==='done'){for(const p of PARTS){const j=G.bag.findIndex(b=>b.id===p);if(j>=0)G.bag.splice(j,1)}G.flags.deviceBuilt=1;msg('The six pieces are fitted into the Orrery of Hours.','#e8d070')}
  if(id==='ad4'){G.flags.hollowSlain=1;msg('The slab over the stair grinds aside.','#e8d070')}
  return r}}
/* ---- the sealed door, Brother Sevrin and the plaque ---- */
khNpc('ab_door','The Sealed Door','gate',()=>{
  const F=G.flags;
  if(qSt('ad2')==='active'&&qReady('ad2')){const rw=rewardText('ad2');qTurnIn('ad2');return say('The door is a slab of black iron, with a ring of hollows in the middle. You have the Orrery. Reward: '+rw+'.',[['Hold up the Orrery.',()=>{F.sealedOpen=1;qAccept('ad3');msg('The Orrery ticks. The door grinds open.','#e8d070');return say('The discs turn and the door grinds into the wall. A stair runs down into the dark, and the air that comes up is cold.',[['Go down.',()=>{goToLevel(BELOW.IDS[0]);return null}],BYE])}],BYE])}
  if(!F.sealedOpen)return say('A slab of black iron with a ring of hollows in the middle. It needs the Orrery of Hours.',[BYE]);
  return say('The stair runs down into the dark.',[['Go down.',()=>{goToLevel(BELOW.IDS[0]);return null}],BYE]);
},{q:'ad2'});
khNpc('ab_sevrin','Brother Sevrin','kh_ohfolk2_1',()=>{
  const F=G.flags;
  if(qSt('ad3')==='active'&&qReady('ad3')){const rw=rewardText('ad3');qTurnIn('ad3');qAccept('ad4');return say('You came down four floors alive. I am Brother Sevrin. I was the Abbey’s last gardener, and I came down here to hide. The Hollow Abbot sits in the great room ahead, and the stair under his seat is the only way on. Reward: '+rw+'. Will you kill him?',[BYE])}
  if(qSt('ad4')==='active')return qNode('ad4',{offer:'',accept:'',remind:()=>'The Hollow Abbot is in the great room ahead. The stair is under his seat.',ready:'He is dead? I felt the floor shake. The stair is open. Take your reward.',thanks:'He was a good man once. The stair goes on down. I cannot go. But you can.',after:'The stair is open.',turn:'The Hollow Abbot is dead.'});
  if(qSt('ad4')==='done')return say('The stair is open. I will stay here and keep the lamp lit.',[BYE]);
  return say('The Abbey above was a kind place. Down here it is not.',[BYE]);
},{q:['ad3','ad4']});
khNpc('ab_plaque','A plaque','gate',()=>say('THE HOLLOW LAND. The road continues in the next part of the game. Below the Abbey is in early access, and this is where it ends for now. Thank you for playing.',[BYE]));
/* ---- the party arrives: at the Abbey, and at the bottom floor ---- */
{const _oe=ohEnter;ohEnter=function(n){_oe.apply(this,arguments);
  const F=G.flags;
  if(n===1&&F.deviceBuilt){
    if(!G.decor.some(d=>d.npc==='ab_door')){
      let best=null;for(let r=1;r<8&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r;dx++){const x=3+dx,y=18+dy;if(y<1||x<1||y>=MH-1||x>=MW-1||G.grid[y][x]!==0)continue;if(G.decor.some(d=>d.x===x&&d.y===y)||(G.enemies||[]).some(e=>e.x===x&&e.y===y))continue;const wallN=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>G.grid[y+b]&&G.grid[y+b][x+a]===1);if(wallN&&Math.abs(dx)+Math.abs(dy)>=2){best=[x,y];break}}
      if(best)G.decor.push({k:'gate',x:best[0],y:best[1],block:true,npc:'ab_door'});
    }
    if(qSt('ad2')===null&&qSt('ad1')==='done')qAccept('ad2');
  }
  if(n===BELOW.IDS[3])F.reachedBottom=1;
}}
