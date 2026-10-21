/* ==========================================================================
   THE HOLLOW LAND. Below the Abbey, past the Hollow Abbot, the stair comes out on a high ledge in a vast underground dark. Far below, lit by red
   and purple torches, stands a great orange spire. Stairs lead down to its gate. Inside, 20 levels climb to a spire. The first has one room, the second
   two, and so on up to ten rooms on the tenth; then the rooms fall away again, down to one room on the nineteenth. The top level has two rooms with a small labyrinth between them, and the labyrinth is a deathtrap (hollow_traps.js). Each level has a number on the stone, a strange place and armoured goblins, slimes and orcs. At the top a wizard asks
   three questions. Answered with good will, they open the way to the next tower (violet). Answered with greed, the party falls down two levels.
   Levels: 364 the ledge and the way down, 440 to 459 the orange spire (levels 1 to 20), 460 the foot of the violet tower.
   ========================================================================== */
const HL={CAV:364,BASE:440,N:20,VIOLET:460};
for(const n of ['hl_goblin','hl_goblinA','hl_slime','hl_slimeA','hl_orc','hl_orcA'])loadImg(n,'assets/'+n+'.png'); // the new creatures, painted
loadImg('hl_castle_art','assets/hl_castle.png'); // the great orange spire: ornate and gothic, with gargoyles and walkways jutting from its towers
ENEMY_DEF.hlgoblin={name:'Armoured Goblin',hp:120,dmg:[10,17],hit:.74,w:.5,img:'hl_goblin',xp:420,gold:[12,45],speed:1,aboveParty:1};
ENEMY_DEF.hlslime={name:'Cave Slime',hp:180,dmg:[7,13],hit:.7,w:.78,img:'hl_slime',xp:380,gold:[0,10],speed:1,aboveParty:0};
ENEMY_DEF.hlorc={name:'Orc Brute',hp:320,dmg:[17,28],hit:.78,w:.7,img:'hl_orc',xp:900,gold:[40,110],speed:1,aboveParty:2};
LEVEL_NAMES[HL.CAV]='The Hollow Land';
for(let k=0;k<HL.N;k++)LEVEL_NAMES[HL.BASE+k]='The Orange Spire, level '+(k+1);
LEVEL_NAMES[HL.VIOLET]='The Foot of the Violet Tower';
const HL_POWER=new Set(['crownbreaker','veilpiercer','dukesgavel','hollowscepter','worldblade','starbow','ragnarok','doomhammer','titanaxe','stormbow2','kingslayer','sunderer','mountainmaul','sandstaff','skullcrusher']);
const HLF=()=>{const F=G.flags;return F.hl||(F.hl={riddles:{},falls:0})};
function hlTint(src,r,g,b,a,name){ // a copy of a picture washed with a colour, for the goblins, the slimes, the orcs and the torches
  if(IMG[name])return IMG[name];const im=IMG[src];if(!im)return null;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');
  x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba('+r+','+g+','+b+','+a+')';x.fillRect(0,0,c.width,c.height);return IMG[name]=c}
function hlArt(){
  if(IMG.hl_castle)return;
  if(!IMG.hl_orc){hlTint('bandit',90,170,60,.52,'hl_goblin');hlTint('cyclops',70,150,60,.5,'hl_orc')} // (stand-ins, only if the painted creatures are not loaded)
  // a slime: a green heap with eyes, drawn in code since no painted one exists yet
  if(!IMG.hl_slime){const c=document.createElement('canvas');c.width=200;c.height=170;const x=c.getContext('2d');
   const g=x.createRadialGradient(100,100,10,100,100,95);g.addColorStop(0,'rgba(150,240,110,.95)');g.addColorStop(1,'rgba(40,130,60,.9)');x.fillStyle=g;
   x.beginPath();x.moveTo(8,160);x.bezierCurveTo(0,90,50,30,100,26);x.bezierCurveTo(150,30,200,90,192,160);x.bezierCurveTo(160,170,40,170,8,160);x.fill();
   x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(70,70,22,12,-.5,0,TAU);x.fill();
   x.fillStyle='#10300c';for(const ex of [76,124]){x.beginPath();x.ellipse(ex,96,11,15,0,0,TAU);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex-3,91,4,0,TAU);x.fill();x.fillStyle='#10300c'}
   IMG.hl_slime=c}
  const lamp=IMG.lamp;
  if(lamp){hlTint('lamp',255,60,40,.62,'hl_torch_r');hlTint('lamp',170,70,255,.62,'hl_torch_p');NPC_H.hl_torch_r=NPC_H.hl_torch_p=1.5}
  hlTint('kh_ohkeep1_0',255,150,40,.7,'hl_castle');hlTint('kh_ohtower1_0',255,130,50,.55,'hl_tower0');hlTint('kh_ohtower1_2',255,130,50,.55,'hl_tower2');hlTint('kh_ohtower1_3',255,130,50,.55,'hl_tower3');
  hlTint('kh_ohkeep1_0',170,110,255,.5,'hl_castle_v');
}
function hlNumKey(n,violet){ // the number of the level, carved large in a slab of the tower's stone, set against the wall of the first room
  const k='hl_num_'+n+(violet?'v':'');if(IMG[k])return k;const w=256,h=256,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,violet?'#6a5a8a':'#c47a3a');g.addColorStop(1,violet?'#463a62':'#8a4c20');x.fillStyle=g;
  x.beginPath();x.moveTo(40,h);x.lineTo(40,90);x.quadraticCurveTo(40,20,w/2,12);x.quadraticCurveTo(w-40,20,w-40,90);x.lineTo(w-40,h);x.closePath();x.fill();
  x.strokeStyle='rgba(20,10,4,.7)';x.lineWidth=6;x.stroke();x.strokeStyle='rgba(255,210,150,.35)';x.lineWidth=2;x.stroke();
  x.textAlign='center';x.textBaseline='middle';x.font='bold '+(n>9?96:128)+'px Georgia,serif';
  x.lineWidth=8;x.strokeStyle='rgba(255,225,170,.55)';x.strokeText(String(n),w/2+3,138+3);x.fillStyle='#2a1208';x.fillText(String(n),w/2,138);
  x.font='bold 22px Georgia,serif';x.fillStyle='rgba(30,14,6,.85)';x.fillText('LEVEL',w/2,52);
  IMG[k]=c;NPC_H[k]=1.5;return k}
/* ---- the people who talk about the place ---- */
const HL_FIGS=[
 ['hl_fig0','A hooded figure by the stair','kh_ohfolk2_3',["Nobody built it. It was always there, and we were put under it.","The torches are never lit by anyone. I have waited a long time to see who lights them. Nobody does.","Climb. Do not look down. The ones who look down start to feel it pulling."]],
 ['hl_fig1','A grey friar, very old','kh_ohfolk2_1',["The rooms grow in number for ten floors, and then they fall away again. They say that at the top there is room for only one question.","I came up eleven floors, and then came down ten. I am not sure that I am the same person.","The rooms in the middle of each floor are not rooms. They are tests, and nobody tells you what for."]],
 ['hl_fig2','A woman with an empty lantern','kh_ohfolk3_1',["The dark here is not an absence of light. It is a presence. Feel how it leans on the torches.","My lantern went out on the third floor. The torches did not mind. They give light to anyone, and ask for nothing.","Be careful what you want, in the tower. It listens."]],
 ['hl_fig3','A pale scholar','kh_ohfolk5_4',["The numbers on the stones are not counting up. They are counting down. To something.","The goblins are not evil. They are afraid of the wizard. So is everything else.","He asks three questions. They are not hard. That is the trouble."]],
 ['hl_fig4','A very small man, sitting','kh_ohfolk3_3',["I have been on the nineteenth floor for a year. I like it. It is quiet, and the stair is just there.","Slimes do not hate you. They only want to be near warmth. So do I.","At the top, they say, one fall is a lesson and two falls is a habit."]],
 ['hl_fig5','The keeper of the stair','kh_ohfolk6_1',["Welcome to the Hollow Land. Below is the Abbey, and above is the tower, and in between there is only the dark and the torches.","Walk down the steps to the castle gate. The tower is called the Orange Spire, though there will be others.","Do not fear the torches, red or purple. They burn for the lost."]]
];
HL_FIGS.forEach(([id,n,face,lines])=>khNpc(id,n,face,()=>yrLines(id,lines)));
/* ---- the riddles ---- */
const HL_RIDDLES=[
 ['I have no voice, yet I answer every call. What am I?',['An echo','A bell','A wolf'],0],
 ['The more of me you take, the more you leave behind. What am I?',['Footsteps','Gold','Bread'],0],
 ['I am lighter than a feather, yet no one can hold me for long. What am I?',['A breath','A stone','A coin'],0],
 ['I fall without breaking, and break without falling. What am I?',['Night and day','A glass','A leaf'],0],
 ['What has roots nobody sees, and is taller than the trees?',['A mountain','An oak','A tower'],0],
 ['I speak only when spoken to, and then I vanish. What am I?',['Silence','A shadow','A ghost'],0],
 ['What can you keep, only after you have given it?',['Your word','A coin','A secret key'],0],
 ['I have a heart that does not beat, and many rooms but no one lives in me. What am I?',['A tower','A crypt','A hive'],0],
 ['What is always coming, but never arrives?',['Tomorrow','A guest','A ship'],0],
 ['I shine without a flame, and warm nobody. What am I?',['The moon','A gem','A mirror'],0]
];
for(let k=0;k<HL.N;k++){const R=HL_RIDDLES[k%10],id='hl_riddler'+k;
  khNpc(id,'A wizard with a riddle','kh_ohfolk5_4',()=>{const F=HLF();
    if(F.riddles[k])return say('You have answered me already, and well. Go on.',[BYE]);
    const rot=k%3,opts=R[1].map((o,i)=>[o,i===R[2]]);const shown=opts.map((_,i)=>opts[(i+rot)%3]);
    return say('"'+R[0]+'"',shown.map(([o,good])=>[o,()=>{if(good){F.riddles[k]=1;try{giveXP(2500+k*400);G.gold+=150+k*40;G.heroes.forEach(h=>{h.hp=h.max})}catch(e){}msg('The wizard smiles. Your wounds close, and a purse appears.','#e8d890');return say('Yes. It is always that. Take this, and be well.',[BYE])}return say('No. Think about it quietly, and ask me again.',[BYE])}]))})}
/* ---- the wizard at the top ---- */
const HL_Q=[
 ['You find a purse full of gold on the road, and its owner is nowhere. What do you do?',['Look for its owner, and give it back.','Keep it. It found you.']],
 ['A friend asks you to carry a burden for a day, and offers you nothing for it. What do you do?',['Carry it, gladly.','Ask what is in it for you.']],
 ['You may take one thing from this tower. What is it?',['Nothing. I came to see it.','The greatest treasure it holds.']]
];
khNpc('hl_wizard','The Wizard at the top of the tower','kh_ohfolk5_4',()=>{
  const F=HLF();
  if(F.towerOpen)return say('The way to the next tower is open. Go in peace.',[['Go to the violet tower.',()=>{goToLevel(HL.VIOLET);return null}],BYE]);
  const ask=n=>{const q=HL_Q[n];return say(`Question ${n+1}. ${q[0]}`,[[q[1][0],()=>{if(n===2){F.towerOpen=1;try{giveXP(60000)}catch(e){}msg('The wizard bows. A door opens in the wall of the spire.','#e8d890');return say('You came with good will, all three times. A door opens, and a stair leads across to the violet tower. Go on.',[['Go to the violet tower.',()=>{goToLevel(HL.VIOLET);return null}],BYE])}return ask(n+1)}],
    [q[1][1],()=>{F.falls++;msg('The floor drops away.','#ff9a7a');later(400,()=>{G.cut=null;goToLevel(HL.BASE+HL.N-3,{x:HLX[HL.N-3].x,y:HLX[HL.N-3].y,f:0});msg('You fall two levels, and land hard in the dark.','#ff9a7a')});return null}]])};
  return say('Climb a long way, did you? Then answer me three questions, and answer them honestly. Good will opens the door. Greed opens the floor.',[['I am ready.',()=>ask(0)],BYE]);
});
khNpc('hl_violet','A plaque at the foot of the violet tower','gate',()=>say('THE VIOLET TOWER. The road goes on, above and beyond. This is as far as the Hollow Land goes for now. Below the Abbey is in early access. Thank you for climbing.',[['Go back down.',()=>{goToLevel(HL.BASE+HL.N-1,{x:HLX[HL.N-1].x,y:HLX[HL.N-1].y,f:0});return null}],BYE]));
const HLX=[]; // where each level's stair down arrives
/* ---- the mystery rooms ---- */
const HL_MYST=['riddle','bridge','sand','statues','pit','monster','chasm','treasure'];
/* ---- building ---- */
/* ---- the floors of the spire. Floor f has as many rooms as its number, up to floor 10 (ten rooms), and then the rooms fall away again: floor 11 has nine, floor 18 has two and floor 19 has one, like floor 1.
   The top floor, 20, has two rooms with a small labyrinth of one-square passages between them. The rooms stand in a coarse grid of places (the first at the south edge, the stair up in a room of the top row,
   toward the north) and are joined by plain passages: a tree, and on the larger floors a loop or two. ---- */
const hlRoomCount=f=>f<=10?f:f<=19?20-f:2;
const HL_GRID={2:[1,2],3:[2,2],4:[2,2],5:[3,2],6:[3,2],7:[3,3],8:[3,3],9:[3,3],10:[4,3]}; // columns and rows of the grid of room places, by the number of rooms
function hlMaze(R,cw,ch,base){ // a perfect maze of cw x ch cells in (2cw+1) x (2ch+1) tiles, entered at the bottom and left at the top, both in column cw>>1; of 120 tries, the one whose way through is about 70 steps (about 35 cells of the 81) and that has the most long straight passages, so that it is a real walk but a short one, with room for the traps
  const TW=2*cw+1,TH=2*ch+1,ex=cw>>1;let best=null;
  for(let tr=0;tr<120;tr++){const t=new Uint8Array(TW*TH),vis=new Uint8Array(cw*ch),st=[[ex,ch-1]];vis[(ch-1)*cw+ex]=1;t[(2*(ch-1)+1)*TW+2*ex+1]=1;let n=0;
    while(st.length){const [x,y]=st[st.length-1],nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,y+b,a,b]).filter(([a,b])=>a>=0&&b>=0&&a<cw&&b<ch&&!vis[b*cw+a]);
      if(!nb.length){st.pop();continue}const [nx,ny,a,b]=nb[R(base+tr*997+(n++),nb.length)];vis[ny*cw+nx]=1;t[(2*y+1+b)*TW+2*x+1+a]=1;t[(2*ny+1)*TW+2*nx+1]=1;st.push([nx,ny])}
    const d=new Int16Array(TW*TH).fill(-1),q=[(2*(ch-1)+1)*TW+2*ex+1];d[q[0]]=0;
    for(let i=0;i<q.length;i++){const c=q[i],x=c%TW,y=(c/TW)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=TW||ny>=TH||!t[ny*TW+nx]||d[ny*TW+nx]>=0)continue;d[ny*TW+nx]=d[c]+1;q.push(ny*TW+nx)}}
    const len=d[TW+2*ex+1];
    let lng=0;for(let c=0;c<TW*TH;c++){if(d[c]<1)continue;const x=c%TW,y=(c/TW)|0;let a0=0,b0=0; // the long straight passages: tiles with four or more open tiles straight ahead in the way the party walks in (room for a fireball to be seen coming)
      for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx>=0&&ny>=0&&nx<TW&&ny<TH&&t[ny*TW+nx]&&d[ny*TW+nx]===d[c]-1){a0=a;b0=b;break}}
      let n=0;while(true){const nx=x-a0*(n+1),ny=y-b0*(n+1);if(nx<0||ny<0||nx>=TW||ny>=TH||!t[ny*TW+nx])break;n++}if(n>=4)lng++}
    const sc=lng-Math.max(0,Math.abs(len-70)-6)*4; // a walk of 64 to 76 steps with as many long straight passages as possible
    if(!best||sc>best.sc)best={t,len,TW,TH,sc}}
  return best}
function hlPlan(k,R){ // the plan of floor k+1: the grid g (walls '#', floor '.'), its size, the rooms (the first at the south edge) and the room with the stair up
  const f=k+1,top=k===HL.N-1,n=hlRoomCount(f);let W,H,g;
  const mk=()=>{g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'))};
  const cut=r=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.'};
  const mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  const hl=(y,xa,xb)=>{for(let x=Math.min(xa,xb);x<=Math.max(xa,xb);x++)g[y][x]='.'},vl=(x,ya,yb)=>{for(let y=Math.min(ya,yb);y<=Math.max(ya,yb);y++)g[y][x]='.'};
  const nookOf=r=>{const x0=R(3,2)===0?r.x0:r.x1-2;return {x0,y0:r.y0,x1:x0+2,y1:r.y0+2}}; // an alcove in a top corner of the first room, where a floor has no spare room for the strange one
  if(top){ // two rooms, and between them the labyrinth: 9 x 9 cells of one-square passages, in 19 x 19 tiles
    const m=hlMaze(R,9,9,3000),mx0=3,my0=10,r0={x0:8,y0:29,x1:16,y1:33},r1={x0:7,y0:2,x1:17,y1:8};W=25;H=36;mk();cut(r0);cut(r1);
    for(let ty=0;ty<m.TH;ty++)for(let tx=0;tx<m.TW;tx++)if(m.t[ty*m.TW+tx])g[my0+ty][mx0+tx]='.';
    g[my0+m.TH-1][12]='.';g[my0][12]='.';g[my0-1][12]='.'; // the way in from the first room, and the way out to the last
    return {W,H,g,rooms:[r0,r1],far:r1,n,nook:nookOf(r0),maze:{x0:mx0,y0:my0,x1:mx0+m.TW-1,y1:my0+m.TH-1,len:m.len}}}
  if(n===1){ // one room: floors 1 and 19. The stair in is in the south wall, the stair up in the north wall
    const w=f===1?11:13,h=f===1?7:9;W=w+14;H=h+12;mk();const x0=(W-w)>>1,y1=H-3,r={x0,y0:y1-h+1,x1:x0+w-1,y1};cut(r);
    return {W,H,g,rooms:[r],far:r,n,nook:nookOf(r)}}
  const [C,Rw]=HL_GRID[n],A=n<=3,maxW=A?9:8,maxH=7,px=maxW+4,py=maxH+4,mg=n===2?4:0;W=C*px+2*mg;H=Rw*py;mk();
  const c0=C>>1,occ=new Map(),sl=[],par=[],kf=(c,r)=>c+','+r;
  const add=(c,r,p)=>{occ.set(kf(c,r),sl.length);sl.push([c,r]);par.push(p)};
  const freeN=(c,r)=>[[c,r-1],[c-1,r],[c+1,r],[c,r+1]].filter(([a,b])=>a>=0&&b>=0&&a<C&&b<Rw&&!occ.has(kf(a,b)));
  add(c0,Rw-1,-1);
  if(n>=3){const fn=freeN(c0,Rw-1).filter(q=>q[1]===Rw-1),q=fn[R(11,fn.length)];add(q[0],q[1],0)} // the strange room, beside the first
  for(let r=Rw-2;r>=0;r--)add(c0,r,r===Rw-2?0:sl.length-1); // the way north, to the top row
  for(let t=0;sl.length<n&&t<200;t++){let p=sl.length-1;if(!freeN(sl[p][0],sl[p][1]).length||R(20+t,100)>=65){const ps=sl.map((_,i)=>i).filter(i=>freeN(sl[i][0],sl[i][1]).length);p=ps[R(40+t,ps.length)]}
    const fn=freeN(sl[p][0],sl[p][1]),q=fn[R(60+t,fn.length)];add(q[0],q[1],p)}
  const E=[];for(let i=1;i<sl.length;i++)E.push([i,par[i]]);
  const isE=(a,b)=>E.some(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a)),pairs=[];
  for(let i=0;i<sl.length;i++)for(let j=i+1;j<sl.length;j++)if(Math.abs(sl[i][0]-sl[j][0])+Math.abs(sl[i][1]-sl[j][1])===1&&!isE(i,j))pairs.push([i,j]);
  for(let t=0,want=n>=9?2:n>=6?1:0;t<want&&pairs.length;t++)E.push(pairs.splice(R(80+t,pairs.length),1)[0]); // a loop or two, on the larger floors only
  const ms=n===3?7:Math.max(5,7-Math.floor(k/8)),rooms=[];
  sl.forEach(([c,r],i)=>{let w,h;
    if(i===0){w=A?9:7;h=A?5:4}else if(i===1&&n>=3){w=h=ms}else{w=A?7+R(100+i,3):5+R(100+i,4);h=A?5+R(200+i,3):4+R(200+i,3)}
    const ox=mg+c*px+2,oy=r*py+2,x0=i===0?ox+((maxW-w)>>1):ox+R(300+i,maxW-w+1),y0=i===0?H-2-h:oy+R(400+i,maxH-h+1);
    rooms.push({x0,y0,x1:x0+w-1,y1:y0+h-1})});
  rooms.forEach(cut);
  E.forEach(([i,j],t)=>{const a=rooms[i],b=rooms[j]; // each passage leaves a room at the middle of its wall, so the strange room's bridges and paths meet it
    if(sl[i][0]!==sl[j][0]){const Lr=sl[i][0]<sl[j][0]?a:b,Rr=Lr===a?b:a,ya=mid(Lr)[1],yb=mid(Rr)[1],lo=Lr.x1+2,hi=Rr.x0-2,xm=lo<=hi?lo+R(500+t,hi-lo+1):Lr.x1+1;hl(ya,Lr.x1,xm);vl(xm,ya,yb);hl(yb,xm,Rr.x0)}
    else{const U=sl[i][1]<sl[j][1]?a:b,D=U===a?b:a,xa=mid(U)[0],xb=mid(D)[0],lo=U.y1+2,hi=D.y0-2,ym=lo<=hi?lo+R(500+t,hi-lo+1):U.y1+1;vl(xa,U.y1,ym);hl(ym,xa,xb);vl(xb,ym,D.y0)}});
  const adj=sl.map(()=>[]);E.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a)});
  const dd=sl.map(()=>-1),qq=[0];dd[0]=0;for(let i=0;i<qq.length;i++)for(const j of adj[qq[i]])if(dd[j]<0){dd[j]=dd[qq[i]]+1;qq.push(j)}
  let fi=-1;for(let i=n>=3?2:1;i<sl.length;i++)if(sl[i][1]===0&&(fi<0||dd[i]>dd[fi]))fi=i; // the stair up: the farthest room of the top row
  return {W,H,g,rooms,far:rooms[fi],n,nook:n<3?nookOf(rooms[0]):null}}
/* ---- what the parchment maps (maps_os440.js to maps_os459.js) say about the plan of a floor, taken from the real level data ---- */
const HL_WORDS=['no','one','two','three','four','five','six','seven','eight','nine','ten'];
function hlMapSub(L){const n=L._nrooms||1,w=HL_WORDS[n].charAt(0).toUpperCase()+HL_WORDS[n].slice(1);
  return L._maze?'Two rooms with a trapped labyrinth between them':w+(n===1?' room and a strange alcove':n===2?' rooms and a strange alcove':' rooms, one of them strange')}
function hlMapNotes(L,extra){const f=LEVEL-HL.BASE+1,n=L._nrooms||1,W=L.rows[0].length,up=L._up,side=!up?'':up.x<W/3?'on the left':up.x>W*2/3?'on the right':'in the middle';
  return ['Floor '+f+' of 20. '+(L._maze?'It has two rooms, with a small labyrinth between them. The labyrinth is trapped, so every step needs care.':n===1?'It has a single room.':'It has '+HL_WORDS[n]+' rooms.'),
    'You arrive by the stair at the bottom of this plan. '+(L._maze?'There is no stair up. The wizard waits in the room at the top, beyond the labyrinth.':n===1?'The stair up is in the wall opposite, in the same room.':'The stair up is in a room at the top, '+side+'.')].concat(extra||['Rooms you have not yet walked past stay covered.'])}
const hlInStrange=(L,k)=>{const r=(L._roomsInfo||[]).find(q=>q.n==='The Strange Room')||L._nook;return !!r&&k.x>=r.x0&&k.x<=r.x1&&k.y>=r.y0&&k.y<=r.y1}; // is a thing inside the strange room (or the alcove): the maps leave its chests out
function hlBuild(k){
  const id=k<HL.N?HL.BASE+k:HL.VIOLET;if(LEVELS[id])return;
  const top=k===HL.N-1,violet=k>=HL.N,kk=Math.min(k,HL.N-1),hs=hash2,R=(i,m)=>(hs(k*31+i,k*7+5,97)*m)|0;
  const plan=violet?null:hlPlan(k,R),W=violet?19:plan.W,H=violet?13:plan.H; // every floor has its own plan (hlPlan); the foot of the violet tower keeps its three random rooms
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const sty=violet?'hlviolet':'hlorange';
  OH_STY[sty]=Object.assign({},OH_STY.castle2||OH_STY.gold,{zoom:2.2,contrast:2.2,tint:violet?[190,150,255,.0]:[255,170,95,.0]});
  const CH=1.5+kk*.13,wall=ch(TM.make('plain',sty,CH).gid),wall2=ch(TM.make('slit',sty,CH).gid);
  const g=violet?[]:plan.g;if(violet)for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const rooms=violet?[]:plan.rooms,cut=r=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.'},mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  if(violet){const nrooms=3,ms=Math.max(5,7-Math.floor(kk/8));
  rooms.push({x0:(W>>1)-2,y0:H-5,x1:(W>>1)+2,y1:H-3});
  for(let t=0;t<1500&&rooms.length<nrooms;t++){const first=rooms.length===1,w=first?ms:3+R(100+t,Math.max(2,5-Math.floor(kk/6))),h=first?ms:3+R(200+t,3),x0=1+R(300+t,W-w-2),y0=1+R(400+t,H-h-2);
    if(rooms.some(r=>x0<=r.x1+2&&x0+w-1>=r.x0-2&&y0<=r.y1+2&&y0+h-1>=r.y0-2))continue;rooms.push({x0,y0,x1:x0+w-1,y1:y0+h-1})}
  rooms.forEach(cut);
  const hl=(y,x0,x1)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)g[y][x]='.'},vl=(x,y0,y1)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)g[y][x]='.'};
  const link=(a,b,s)=>{const [ax,ay]=mid(a),[bx,by]=mid(b);if(R(600+s,2)===0){hl(ay,ax,bx);vl(bx,ay,by)}else{vl(ax,ay,by);hl(by,ax,bx)}};
  for(let i=1;i<rooms.length;i++){let bj=0,bd=1e9;const [ax,ay]=mid(rooms[i]);for(let j=0;j<i;j++){const [bx,by]=mid(rooms[j]),d=Math.abs(ax-bx)+Math.abs(ay-by)+R(500+i*9+j,6);if(d<bd){bd=d;bj=j}}link(rooms[i],rooms[bj],i)}
  for(let e=0;e<2+(kk>>2);e++){const i=R(700+e,rooms.length),j=R(710+e,rooms.length);if(i!==j)link(rooms[i],rooms[j],40+e)} // loops (the foot of the violet tower only)
  }
  // the stair in, and the stair up in the furthest room
  const r0=rooms[0],ux=(r0.x0+r0.x1)>>1,uy=r0.y1+1;g[uy][ux]='0';const start={x:ux,y:r0.y1,f:0};
  const d=new Int16Array(W*H).fill(-1),q=[start.x+start.y*W];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}
  let far=violet?rooms[rooms.length-1]:plan.far,fd=-1;if(violet)rooms.forEach((r,i)=>{if(i<2)return;const [mx,my]=mid(r),v=d[my*W+mx];if(v>fd){fd=v;far=r}});
  let up=null;if(!violet&&!top){const dxm=(far.x0+far.x1)>>1;g[far.y0-1][dxm]='1';up={x:dxm,y:far.y0}}
  const rows=g.map((r,y)=>r.map((c,x)=>c==='#'?((x*7+y*3)%9===0?wall2:wall):c).join(''));
  const decor=[],enemies=[],items=[],lights=[],used=new Set([start.x+','+start.y]),fm=new Array(W*H).fill('0');
  const blockAt=(x,y)=>{used.add(x+','+y);decor.push({k:'lp_gap',x,y,block:true,deco:true})};
  const myst=(plan&&plan.nook)||rooms[1],mt=violet?'':HL_MYST[(k*5+2)%8],[mx,my]=mid(myst); // (floors with fewer than three rooms have no spare room: the strange place is an alcove in a corner of the first room)
  const pathCell=new Set();
  if(!violet){
    if(mt==='bridge'||mt==='chasm'){ // a void: dark floor, nothing to stand on but a narrow way across
      for(let y=myst.y0;y<=myst.y1;y++)for(let x=myst.x0;x<=myst.x1;x++){fm[y*W+x]='3';
        const onPath=y===my||x===mx||(mt==='chasm'&&(y===myst.y0||x===myst.x0));
        if(onPath){pathCell.add(x+','+y);fm[y*W+x]='0'}}
      for(let y=myst.y0;y<=myst.y1;y++)for(let x=myst.x0;x<=myst.x1;x++){if(pathCell.has(x+','+y))continue;
        const nearPath=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>pathCell.has((x+a)+','+(y+b)));
        if(mt==='bridge'&&nearPath&&IMG.lp_rail){used.add(x+','+y);decor.push({k:'lp_rail',x,y,block:true,deco:true})}else blockAt(x,y)}
      if(mt==='chasm'){decor.push({k:'chest',x:myst.x1,y:myst.y1,block:true,magic:1});used.add(myst.x1+','+myst.y1);pathCell.add(myst.x1+','+myst.y1);
        for(let y=myst.y0;y<=myst.y1;y++){pathCell.add(myst.x1+','+y)}for(let x=myst.x0;x<=myst.x1;x++)pathCell.add(x+','+myst.y1)}
      else items.push({k:'potion',x:mx,y:my});
    }
    else if(mt==='sand'){for(let y=myst.y0;y<=myst.y1;y++)for(let x=myst.x0;x<=myst.x1;x++){fm[y*W+x]='1';if(hs(x,y,k+50)<.12&&!(x===mx&&y===my)){used.add(x+','+y);decor.push({k:'bones',x,y,block:false,walk:true,deco:true})}}
      items.push({k:'potion',x:mx+1,y:my});enemies.push({t:'hlslime',x:myst.x1,y:myst.y0})}
    else if(mt==='statues'){for(let y=myst.y0;y<=myst.y1;y++)for(let x=myst.x0;x<=myst.x1;x++){if(x===mx||y===my||(x+y)%2||(Math.abs(x-myst.x0)+Math.abs(y-myst.y0)<=1))continue;used.add(x+','+y);decor.push({k:'statue',x,y,block:true,deco:true})}
      decor.push({k:'chest',x:myst.x0,y:myst.y0,block:true,magic:1});used.add(myst.x0+','+myst.y0)}
    else if(mt==='pit'){const prev=k>0?HL.BASE+k-1:HL.CAV;
      decor.push({k:'dhatch',x:mx,y:my,block:true,npc:'hl_pit'+k});used.add(mx+','+my);
      khNpc('hl_pit'+k,'A deep pit','dhatch',()=>say('A pit in the floor, round and black. You cannot see the bottom. Cold air breathes up out of it, and something far below is listening.',[['Jump in.',()=>{msg('You fall.','#ff9a7a');later(300,()=>{G.cut=null;goToLevel(prev,prev===HL.CAV?{x:34,y:6,f:2}:{x:HLX[k-1].x,y:HLX[k-1].y,f:0})});return null}],['Step back.',()=>null]]))}
    else if(mt==='monster'){enemies.push({t:'hlorc',x:mx,y:my},{t:'hlorc',x:myst.x1,y:myst.y0});decor.push({k:'chest',x:myst.x0,y:myst.y1,block:true,magic:1});used.add(myst.x0+','+myst.y1)}
    else if(mt==='treasure'){decor.push({k:'chest',x:mx,y:my,block:true,magic:1},{k:'chest',x:myst.x0,y:myst.y0,block:true,magic:1});used.add(mx+','+my);used.add(myst.x0+','+myst.y0);for(const [a,b] of [[myst.x1,myst.y1],[myst.x1,myst.y0]])items.push({k:'potion',x:a,y:b})}
    else if(mt==='riddle'){const kp=KH_KEEPERS['hl_riddler'+k];if(kp){decor.push({k:khFaceKey(kp.face),x:mx,y:my,block:true,npc:'hl_riddler'+k,sc:kp.sc||1});used.add(mx+','+my)}}
  }
  // the top: the wizard, in the spire room
  if(top){const [fx,fy]=mid(far),kp=KH_KEEPERS.hl_wizard;if(kp){decor.push({k:khFaceKey(kp.face),x:fx,y:fy,block:true,npc:'hl_wizard',sc:kp.sc||1});used.add(fx+','+fy)}}
  if(violet){const kp=KH_KEEPERS.hl_violet;decor.push({k:khFaceKey(kp.face),x:mx,y:my+1,block:true,npc:'hl_violet',sc:1})}
  // torches, red and purple, lighting the way: in the rooms and along the passages
  // lanterns stand only in the open: the corners of the broad rooms, never in a one-block passage. They are plain iron lanterns, and the LIGHT they give glows red or purple (the wall torches in the passages burn red or purple too)
  const torch=(x,y,c)=>{if(!IMG.lamp||used.has(x+','+y)||pathCell.has(x+','+y))return;used.add(x+','+y);decor.push({k:'lamp',x,y,block:false,walk:true,deco:true});lights.push([x,y,c?1:0])};
  rooms.forEach((r,i)=>{if(r.x1-r.x0<3||r.y1-r.y0<3)return;torch(r.x0,r.y0,i%2);torch(r.x1,r.y0,(i+1)%2);if(r.x1-r.x0>4&&r.y1-r.y0>3){torch(r.x0,r.y1,(i+1)%2);torch(r.x1,r.y1,i%2)}});
  // the number of the level, on the stone wall beside the stair
  // (the level number is a painted stone plaque now, hung on the wall of the first room by hlDress)
  // the strange figures, on a few levels
  const figLv={0:'hl_fig1',3:'hl_fig2',7:'hl_fig3',11:'hl_fig0',15:'hl_fig4'};
  const fr=rooms[2]||(plan&&plan.n===1?rooms[0]:null); // (a floor with one room puts the figure in that room)
  if(figLv[k]&&fr){const kp=KH_KEEPERS[figLv[k]],[fx,fy]=mid(fr);if(kp&&!used.has(fx+','+fy)){decor.push({k:khFaceKey(kp.face),x:fx,y:fy,block:true,npc:figLv[k],sc:kp.sc||1});used.add(fx+','+fy)}}
  // the foes: armoured goblins, slimes, orcs
  const cells=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]==='.'&&d[y*W+x]>6&&!used.has(x+','+y)&&!(x>=myst.x0&&x<=myst.x1&&y>=myst.y0&&y<=myst.y1)&&!(plan&&plan.maze&&x>=plan.maze.x0-1&&x<=plan.maze.x1+1&&y>=plan.maze.y0-2&&y<=plan.maze.y1+1))cells.push([x,y]); // (the labyrinth of the top floor is the trap: no creatures and no pickups in its passages)
  const kinds=kk<6?['hlgoblin','hlgoblin','hlslime']:kk<13?['hlgoblin','hlslime','hlorc','hlgoblin']:['hlorc','hlorc','hlgoblin','hlslime'];
  // (fewer foes on the small floors)
  if(!violet)for(let i=0,nF=top?6:Math.max(3,Math.min(13,Math.round(1.5+plan.n*1.1)));i<nF;i++){const c=cells[R(900+i*13,cells.length)];if(c&&!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);enemies.push({t:kinds[R(950+i,kinds.length)],x:c[0],y:c[1]})}}
  for(let i=0,nP=Math.max(4,Math.round(10*Math.min(1,((plan?plan.n:6)+2)/8)));i<nP&&cells.length;i++){const c=cells[R(100+i*7,cells.length)];if(!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);items.push({k:'potion',x:c[0],y:c[1]})}}
  for(let i=0,nQ=Math.max(2,Math.round(6*Math.min(1,((plan?plan.n:6)+2)/8)));i<nQ&&cells.length;i++){const c=cells[R(300+i*11,cells.length)];if(!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);items.push({k:'hlfood',x:c[0],y:c[1]})}}
  OH_STY.hlsecret=Object.assign({},OH_STY.castle2||OH_STY.gold,{zoom:3.6,contrast:2.0,tint:[110,150,255,.0]});const secretCh=violet?'#':ch(TM.make('plain','hlsecret',CH).gid);
  const dress={k,id,rows,W,H,rooms,myst,far,used,decor,enemies,d,violet,top,R,hs,secretCh,items,up,start,maze:plan&&plan.maze,esc:violet?1:top?.5:Math.min(1,plan.n/7)};hlDress(dress); // esc: how much of the usual horrors a small floor gets
  const portals=[{to:k===0?HL.CAV:violet?HL.BASE+HL.N-1:id-1,x:0,y:0,f:2,tex:'tomb'}];
  if(up)portals[1]={to:id+1,x:0,y:0,f:0,tex:'tomb'};
  const lv={rows,start,enemies,items,decor,fmap:(()=>{const f=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];f.push(s)}return f})(),
    floorSet:['tombslab','sand','tombgold','tombdark','tombred'],floor:'tombslab',ceil:'tomb',name:LEVEL_NAMES[id],label:violet?'The Violet Tower':'The Orange Spire',diff:36+kk,torchGap:4.4,_secrets:dress.lv_secrets,_trap:dress.lv_trap,_roomsInfo:dress.lv_rooms,portals,lights,chars,_trig:dress.lv_trig,_msgr:dress.lv_msgr,_man:dress.lv_man,amb:.05,day:0,ceilH:CH,
    mapNames:rooms.map((r,i)=>({t:i===0?'Stair ('+(k+1)+')'+(r===far&&up?' and Stair Up':''):r===myst&&!violet?'The Strange Room':r===far&&up?(dress.lv_names&&dress.lv_names[i]&&!/Hall$/.test(dress.lv_names[i])?dress.lv_names[i]+' and Stair Up':'The Stair Up'):top&&r===far?'The Spire':(dress.lv_names&&dress.lv_names[i])||'Hall',x:mid(r)[0],y:r.y0-1,k:'place'})).concat(plan&&plan.maze?[{t:'The Labyrinth',x:(plan.maze.x0+plan.maze.x1)>>1,y:(plan.maze.y0+plan.maze.y1)>>1,k:'place'}]:[]),_up:up,_start:start,_nook:plan&&plan.nook,_maze:plan&&plan.maze,_nrooms:rooms.length};
  LEVELS[id]=lv;
  if(typeof hlTrapsBuild==='function')hlTrapsBuild({k,id,lv,rows,W,H,rooms,d,plan,decor,enemies,items,used,R,hs,secretCh,wall,wall2,start,up,far,top,violet,fm}); // the traps, jump scares and letters of floors 14 to 20 (hollow_traps.js)
}
function hlCavern(){
  if(LEVELS[HL.CAV])return;
  const W=71,H=64,rows=[],hs=hash2,N=W*H,h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N);
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  OH_STY.hlrock={...(OH_STY.castle2||OH_STY.gold),zoom:2.6,contrast:2.6,tint:[120,96,84,.0]};
  const rock=[3.2,4.4,5.6].map(wh=>ch(TM.make('plain','hlrock',wh).gid));
  for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const fm=new Array(N).fill('3'),decor=[],lights=[],items=[],enemies=[],sky=[],used=new Set();
  // a high ledge in the south (y 50 to 62) with stairs down, in broad flights, to a floor far below at the north (y 12 to 20), and the gate
  const haze=(()=>{const c=mkCanvas(128,58,(x,w,h)=>{const gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#1a1218');gr.addColorStop(1,'#0c080c');x.fillStyle=gr;x.fillRect(0,0,w,h)});const d=c.getContext('2d').getImageData(0,0,128,58).data,id=addTex(d,null);TEX[id].h=58;TEX[id].wh=.45;const gid=KH_NEXT_GID++;T_TILE[gid]=id;return ch(gid)})();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,lim=y<14?33:y<48?20:30;
    if(y<2){rows[y][x]=haze;block[i]=1;continue}
    if(x<3||x>=W-3||y>=H-2||Math.abs(x-35)>lim){rows[y][x]=rock[(x*5+y*3)%3];block[i]=1;continue}
    h[i]=y>=50?3.6:y<=18?.2:Math.max(.2,3.6-(50-y)*.107);fm[i]=y>=22&&y<=48&&Math.abs(x-35)<=2?'1':y>=50?'0':'3'}
  // the stairs: steps are painted as lighter floor bands across the path
  for(let y=19;y<=49;y++)for(let x=33;x<=37;x++)if(y%3===0)fm[y*W+x]='2';
  // the gate of the castle, in the north wall under the castle
  OH_STY.hlorange=Object.assign({},OH_STY.castle2||OH_STY.gold,{zoom:2.2,contrast:2.2,tint:[255,170,95,.0]});const gt=TM.make('door','hlorange',3.2);T_DOORS.hlgate=gt.tex;const gc=String.fromCharCode(nextCh++);chars[gc]=31;const fl=ch(TM.make('plain','hlorange',3.2).gid);
  for(const x of [34,36]){rows[9][x]=fl;block[9*W+x]=1}rows[9][35]=gc;block[9*W+35]=1
  // lights: purple and red torches lining the stairs and the ledge
  const torch=(x,y,c)=>{if(!IMG.lamp||used.has(x+','+y))return;used.add(x+','+y);decor.push({k:'lamp',x,y,block:false,walk:true,deco:true});lights.push([x,y,c?1:0])};
  for(let y=6;y<=60;y+=3){torch(31,y,(y/3|0)%2);torch(39,y,(y/3|0)%2?0:1)}
  for(let x=10;x<=60;x+=6)torch(x,54,x/6%2);
  // the castle: a great orange spire at the foot of the stairs, with towers, behind the gate wall, and torches of two colours along its foot
  sky.push({x:35,y:6,k:IMG.hl_castle_art?'hl_castle_art':'hl_castle',w:62,z:0,big:1});
  if(!IMG.hl_castle_art)for(const [x,y,k,w] of [[8,4,'hl_tower3',14],[62,4,'hl_tower3',14]])sky.push({x,y,k,w,z:0,big:1});
  for(let x=6;x<=64;x+=4)torch(x,11,(x/4|0)%2);
  // people and a stair-keeper
  const place=(id,x,y)=>{const kp=KH_KEEPERS[id];if(kp&&!used.has(x+','+y)){used.add(x+','+y);decor.push({k:khFaceKey(kp.face),x,y,block:false,walk:true,npc:id,sc:kp.sc||1})}};
  place('hl_fig5',36,56);place('hl_fig0',30,38);place('hl_fig3',40,26);
  const lv={rows:rows.map(r=>r.join('')),start:{x:35,y:60,f:0},enemies,items,decor,sky,fmap:fm.map(x=>x).reduce((a,c,i)=>{if(i%W===0)a.push('');a[a.length-1]+=c;return a},[]),
    floorSet:['tombdark','tombslab','tombgold','tombslab'],floor:'tombdark',ceil:'tomb',name:'The Hollow Land',label:'The Hollow Land',diff:36,portals:[],lights,chars,amb:.6,day:0,ceilH:7,
    mapNames:[{t:'The Orange Spire',x:35,y:5,k:'place'},{t:'The High Ledge',x:35,y:58,k:'place'},{t:'The Long Stair',x:35,y:34,k:'lane'},{t:'The Castle Gate',x:35,y:12,k:'lane'}]};
  lv.portals[0]={to:360+3,x:0,y:0,f:2,tex:'tomb'};lv.portals[1]={to:HL.BASE,x:0,y:0,f:0,tex:'hlgate'};
  // the stair back down to the Hollow Abbey, hidden in the south wall behind the keeper; the castle gate (portal 1) in the north
  rows[H-2][35]='0';lv.rows=rows.map(r=>r.join(''));
  LEVELS[HL.CAV]=lv;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=chars[rows[y][x]];if(c!==undefined&&c>=30&&c<100)block[y*W+x]=0}
  TERRS[HL.CAV]=yarTerrain(W,H,h,rk,block);
}
function hlAll(){
  if(typeof KH_READY!=='undefined'&&!KH_READY)return;
  if(LEVELS[HL.BASE+HL.N-1]&&LEVELS[HL.CAV])return;
  ohAlias();oqAlias();ohArt();ohFloors();ohStyles();isleFloors();lpArt();hlArt();
  hlCavern();for(let k=0;k<HL.N;k++)hlBuild(k);hlBuild(HL.N);
  // portals that go up and down: where each lands
  for(let k=0;k<HL.N;k++){const L=LEVELS[HL.BASE+k];HLX[k]={x:L._up?L._up.x:L._start.x,y:L._up?L._up.y:L._start.y}}
  HLX[HL.N]=HLX[HL.N-1];
  const cav=LEVELS[HL.CAV];
  for(let k=0;k<HL.N;k++){const L=LEVELS[HL.BASE+k],nx=LEVELS[k<HL.N-1?HL.BASE+k+1:HL.VIOLET];
    if(L.portals[1]&&k<HL.N-1){L.portals[1].x=nx._start.x;L.portals[1].y=nx._start.y;L.portals[1].f=0}
    const dn=k===0?cav:LEVELS[HL.BASE+k-1];
    if(k===0){L.portals[0].x=cav.start.x;L.portals[0].y=cav.start.y-2*0;L.portals[0].f=2;cav.portals[1].x=L._start.x;cav.portals[1].y=L._start.y;cav.portals[1].f=0}
    else{L.portals[0].x=dn._up.x;L.portals[0].y=dn._up.y;L.portals[0].f=2}}
  const vl=LEVELS[HL.VIOLET];vl.portals[0].x=LEVELS[HL.BASE+HL.N-1]._start.x;vl.portals[0].y=LEVELS[HL.BASE+HL.N-1]._start.y;vl.portals[0].f=0;
  cav.portals[0].x=LEVELS[363]._start?LEVELS[363]._start.x:cav.portals[0].x;
  const abbey=LEVELS[363];if(abbey&&abbey.portals[1]){abbey.portals[1].x=cav.start.x;abbey.portals[1].y=cav.start.y;abbey.portals[1].f=0}
  if(abbey&&abbey._down){cav.portals[0].x=abbey._down.x;cav.portals[0].y=abbey._down.y;cav.portals[0].f=2}
}
for(const id of [HL.CAV,HL.VIOLET,...Array.from({length:HL.N},(_,k)=>HL.BASE+k)])KH_LAZY[id]=()=>{BELOW.IDS.forEach((_,n)=>belowBuild(n));belowLink();hlAll()};

/* ---- the journal and the hints: what the party has seen of the Hollow Land and the tower ---- */
{const _oe=ohEnter;ohEnter=function(n){_oe.apply(this,arguments);const F=G.flags;
  if(n===HL.CAV)F.hlSeen=1;
  const lacks=G.heroes.some(h=>!h.eq.main||!HL_POWER.has(h.eq.main.id)); // (on the ledge and on level 1 the party is armed again if any hero lacks a powerful weapon, so an old saved game gets them too)
  if(((n===HL.CAV||n===HL.BASE)&&lacks)||(n>=HL.BASE&&n<=HL.VIOLET&&!F.hlArmed)){if(giveTestWeapons()){F.hlArmed=1;msg('The relics of the four rulers and the other powerful weapons are in the party bag, and the party carries the relics.','#ffe36a')}} // the first time the party reaches the Hollow Land
  if(n>=HL.BASE&&n<HL.BASE+HL.N)F.hlTop=Math.max(F.hlTop||0,n-HL.BASE+1);
  if(n===HL.VIOLET)F.hlViolet=1}}


/* ==========================================================================
   THE HAUNTED CASTLE. The rulers who lived here went mad, and the rooms show it: gaunt portraits, candles that nobody lit, a cup of poison on a table,
   coffins, chains, notes and books with dreadful entries, hands that reach out of the wall, a thin man who is never where he was, a voice that calls
   for help, lights that go out on certain stones, a witch who screams, and a fireplace with a face in it.
   ========================================================================== */
for(const n of ['pt0','pt1','pt2','pt3','pt4','pt5','p_candle','p_poison','p_apple','p_window','p_alcove','p_chains','p_mirror','p_coffin','p_cage','p_throne','p_banner','p_armour','p_shelf','p_lectern','p_desk','p_note','p_rack','p_ghost','p_feast','p_tomb','hands','handsA','gent','gentA','witch','witchA','fire','fireA'])loadImg('hl_'+n,'assets/hl_'+n+'.png');
Object.assign(NPC_H,{hl_pt0:.95,hl_pt1:.95,hl_pt2:.95,hl_pt3:.95,hl_pt4:.95,hl_pt5:.95,hl_p_candle:.8,hl_p_poison:.55,hl_p_apple:.5,hl_p_window:1.4,hl_p_alcove:.8,hl_p_chains:1.3,hl_p_mirror:1.25,hl_p_coffin:.95,hl_p_cage:.8,hl_p_throne:1.05,hl_p_banner:1.3,hl_p_armour:1.0,hl_p_shelf:1.15,hl_p_lectern:.8,hl_p_desk:.6,hl_p_note:.45,hl_p_rack:.4,hl_p_ghost:.9,hl_p_feast:.45,hl_p_tomb:.4,hl_fire:1.0,hl_gent:1.0});
ENEMY_DEF.hlhands={name:'Clawing Hands',hp:150,dmg:[9,15],hit:.82,w:.95,img:'hl_hands',xp:350,gold:[0,0],speed:1,verb:'rakes',
  act:e=>{if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)===1){enemyAttack(e);return 290}return 220}};
ENEMY_DEF.hlghost={name:'Wailing Ghost',hp:140,dmg:[8,14],hit:.76,w:.5,img:'hl_p_ghost',xp:650,gold:[0,0],speed:1,fly:true,floatH:.04,glow:.7,verb:'chills',aboveParty:1};
ENEMY_DEF.hlwitch={name:'The Screaming Witch',hp:400,dmg:[8,14],hit:.7,w:.85,img:'hl_witch',xp:3500,gold:[150,380],speed:1,ranged:4,verb:'blasts',
  act:e=>{if(e.alert){G.shake=.2;if(Math.random()<.5)msg(['The witch SCREAMS. The lights stutter.','"MINE! ALL OF IT MINE!" The torches flash on and off.','The witch shrieks and the whole room flickers.'][(Math.random()*3)|0],'#e0a8ff')}return 0}}; // (the strobe itself runs every frame, in hollow_haunt.js)
function hlLights(out){G.hlOut=out;for(const l of LIGHTS)if(!l.keep)l.out=out}
const hlLive=()=>{const a=[];G.heroes.forEach((h,i)=>{if(h.alive!==false&&h.hp>0)a.push(i)});return a};
function hlHurt(hi,d){const h=G.heroes[hi];h.hp-=d;h.hurt=1;G.shake=.3;sfx('hurt');addFloat(portraitX(hi)+19,250,'-'+d,'#ff6a5a');
  if(h.hp<=0){h.hp=0;h.alive=false;msg(HERO_DEF[hi].name+' has fallen!','#ff8a7a');try{bondFall(hi)}catch(x){}if(G.sel===hi)nextHero()}}
function hlSpawn(t,x,y,lv){const L0=lv||lvlHere(),st=enemyStat(t,L0);G.enemies.push({id:G.enemies.length,t,lvl:L0,x,y,rx:x,ry:y,hp:st.hp,maxhp:st.hp,alert:true,chilled:0,flash:0,lunge:0,dying:0,seed:Math.random()*10,sx:210,sy:100})}
/* ---- notes and books ---- */
const HL_NOTES=[
 'A page torn from a diary. "Day 40. The King no longer eats. He sits at the long table and talks to the empty chairs. I think the chairs answer."',
 'A note in a shaking hand. "Do not drink from the golden cup. I did. I am still here, but I am no longer warm."',
 'A note. "The Queen smiles all day now. Nobody has seen her blink since the winter."',
 'A note. "The portraits were painted from life. The painter did not leave the room afterwards."',
 'A note. "I counted the floors. There are twenty. Each floor has as many rooms as its number, up to the tenth, and then the rooms begin to go again. The stair does not go up. It goes in."',
 'A note. "The hands in the wall are quick but slow to wake. Do not stop beside them."',
 'A note. "The child-king ordered every mirror covered. Then he ordered them uncovered. Then he stopped speaking and only pointed."',
 'A note. "If you hear someone calling for help in the dark, do not go. I went. I knew the voice. It was mine."',
 'A note. "The lights go out on certain stones. Stand still and count to ten, and they come back."',
 'A note. "The witch was a guest. Then she was a prisoner. Now the castle is her guest, and she is a poor host."',
 'A note. "Duke Aldric had himself buried alive to see if the dead could rule. They can."',
 'A note. "A thin man in a black coat has stood behind me for three days. When I turn, nobody is there. When I stop turning, he is."',
 'A note. "Every coffin on this floor is open. I have counted them three times. The number changes."',
 'A note. "The wizard at the top is not a ruler. He is the one who locked them all in. Answer him kindly."',
 'A note scratched in many hands. "I wrote my name on the wall so I would remember it. In the morning there were a hundred other names, all mine."',
 'A note. "Spikes, darts, plates in the floor. The rulers loved a joke. Walk where the dust is thick."',
 'A note. "One wall in this hall is the wrong colour. The rulers kept what they loved behind it, and a lever to open it."',
 'A note. "Five letters are written in blood on the walls of the last floors. Whoever reads all five does not leave. Stay on the road and let them be."'];
const HL_BOOKS=[
 '"On the Taste of Crowns". A treatise on which rulers tasted best. The margins are full of tiny teeth marks.',
 '"The Obedient Dead". A manual. Chapter one is how to ask a corpse politely. Chapter two is what to do when it asks you.',
 '"Portraits, and What They Take". Each sitting takes a little of the sitter\'s face. By the sixth there is none left.',
 '"Seventy Ways to Poison a Feast". The last page, the one about antidotes, has been torn out.',
 '"A Gardener\'s Guide to the Hands in Walls". Water them with whispers. Prune with a candle.',
 '"The Book of Staying". Every page says "Stay." The last page says "You stayed."',
 '"The King\'s Own Cookbook". Recipes for a feast with one empty plate. The empty plate is always yours.',
 '"Mirrors, a Warning". Never look into a mirror that looks at you first.',
 '"On the Count of Stairs". Climb forty steps and the number is forty. Climb them again and it is thirty-nine. Someone is taking them.',
 '"Lullabies for the Dead". The tune is slow and quiet. Reading it, you notice you are humming it.'];
HL_NOTES.forEach((t,i)=>khNpc('hl_note'+i,'A pinned note','hl_p_note',()=>say(t,[['Put it back.',()=>null]])));
HL_BOOKS.forEach((t,i)=>khNpc('hl_book'+i,'An old book','hl_p_lectern',()=>say(t,[['Close the book.',()=>null]])));
const HL_WARN=['"Turn back. Turn back. The floor above is hungry."','"Do not trust the voice in the dark. It wants company."','"He stands behind you on the stair. Do not look."','"Do not drink what the last ruler poured."','"At the top he asks you what you want. Want nothing."','"Do not read what is written in blood on the high floors."'];
khNpc('hl_fireplace','A fireplace with a face in it','hl_fire',()=>{const F=HLF();F.fw=((F.fw||0)+1);return say('The fire gutters, and a pale face rises out of the flames. Its mouth moves. '+HL_WARN[(F.fw-1)%HL_WARN.length]+' Then it sinks back into the coals.',[['Step back.',()=>null]])});
khNpc('hl_poisoncup','A golden cup','hl_p_poison',()=>say('A golden cup on a small table. The liquid inside is green and faintly glowing, and it steams. A skull sits beside it, watching.',[
  ['Drink it.',()=>{const l=hlLive();if(l.length){const hi=l[0];hlHurt(hi,18);try{afflInflict('poisoned',hi)}catch(e){}msg(HERO_DEF[hi].name+' drinks it, and is poisoned.','#70e070')}return null}],
  ['Pour it on the floor.',()=>{msg('The green liquid hisses on the stone, and the stone stays black.','#a8d8a8');return null}],['Leave it.',()=>null]]));
khNpc('hl_poisonapple','A glossy red apple','hl_p_apple',()=>say('One perfect red apple on a silver plate. It is shiny, ripe and cold, and there is a faint green sheen under the skin.',[
  ['Eat it.',()=>{const l=hlLive();if(l.length){const hi=l[l.length-1];hlHurt(hi,24);try{afflInflict('poisoned',hi)}catch(e){}msg(HERO_DEF[hi].name+' bites the apple and collapses, retching.','#70e070')}return null}],
  ['Leave it.',()=>null]]));
khNpc('hl_gent','A thin man in a black coat','hl_gent',()=>yrLines('hl_gent',['"Good evening. You are late. They have been waiting."','"I was here a moment ago. I am always here a moment ago."','"Do you like the portraits? I sat for the fourth one. It took a long time. It is still taking."']));
/* ---- what the party says to one another ---- */
const HL_CHAT=[
 ['Does anyone else feel the walls are listening?','Only the walls. The portraits are doing the watching.','Please do not say that.'],
 ['Who builds a castle like this and then leaves nobody in it?','Somebody is in it. I just have not seen where.','I do not like how quiet it is. Even the goblins are quiet.'],
 ['Whoever ruled here was not well. Look at the faces.','Those candles are still lit. Who lights them?','I am choosing not to find out.'],
 ['Something just breathed behind me.','That was me.','Are you sure?','...Mostly.'],
 ['How many floors did the note say?','Twenty. The rooms grow in number up to the tenth floor, and then they dwindle.','Then the top is small, and very close to whatever lives there.']];
function hlChat(n){const l=hlLive();if(l.length<2)return;HL_CHAT[n%HL_CHAT.length].forEach((t,i)=>later(i*1700,()=>msg(HERO_DEF[l[i%l.length]].name+': "'+t+'"','#c8d8ff')))}
const HL_WHISPER=['Somewhere above, a chair scrapes across a stone floor.','A cold hand of air brushes the back of your neck.','Far off, somebody is laughing, very softly.','Every candle in the room leans the same way, then straightens.','A whisper in the wall says your name. It sounds like it is smiling.','Something knocks three times from inside the stone.'];
/* ---- what happens on the stones ---- */
function hlTrap(t){
  const L=hlLive();if(!L.length)return;const hi=L[(Math.random()*L.length)|0];
  if(t.k==='spikes'){msg('A plate clicks under your foot. Spikes shoot up from the floor!','#ffb08a');hlHurt(hi,6+(LEVEL-HL.BASE)*2)}
  else if(t.k==='darts'){msg('A hiss from the wall. Little poisoned darts fly out!','#b8e8a0');hlHurt(hi,5+(LEVEL-HL.BASE));try{afflInflict('poisoned',hi)}catch(e){}}
  else if(t.k==='dark'){hlLights(true);G.hlDark=14;msg('The lights gutter and go out. The dark presses in close.','#b8a8d8')}
  else if(t.k==='chat')hlChat(t.n);
  else if(t.k==='voice')msg(t.n?'"Please... I am hurt... come closer... please..."':'From somewhere ahead, a faint voice: "Help... help me..."','#d8e8ff');
  else if(t.k==='ghost'){msg('The voice stops. Then it screams, and a pale shape rushes out of the air!','#e8f0ff');sfx('hit');
    for(const [dx,dy] of [[0,-1],[1,0],[-1,0],[0,1],[0,-2],[2,0],[-2,0],[0,2]]){const x=G.P.x+dx,y=G.P.y+dy;if(!cellBlocked(x,y)&&!enemyAt(x,y)){hlSpawn('hlghost',x,y);break}}}
}
function hlStep(nx,ny){
  if(LEVEL<HL.BASE||LEVEL>=HL.BASE+HL.N)return;const L=LEVELS[LEVEL];if(!L)return;const F=HLF();F.tr=F.tr||{};
  for(const t of (L._trig||[])){if(t.x!==nx||t.y!==ny)continue;const key=LEVEL+':'+nx+','+ny;if(F.tr[key])continue;F.tr[key]=1;hlTrap(t)}
  if(G.hlOut&&!G.hlStrobe){if(--G.hlDark<=0){hlLights(false);msg('The torches flare back to life.','#ffd8a0')}}
  if(G.hlStrobe!==undefined&&!G.enemies.some(e=>e.t==='hlwitch'&&e.hp>0)){G.hlStrobe=undefined;hlLights(false)} // the witch is dead: the lights stop
  G.hlSteps=(G.hlSteps||0)+1;if(G.hlSteps%31===0)msg(HL_WHISPER[(G.hlSteps/31|0)%HL_WHISPER.length],'#b8b0d8');
  const m=L._man;if(m){const d=G.decor.find(q=>q.npc==='hl_gent');if(d){const dist=Math.abs(d.x-nx)+Math.abs(d.y-ny);
    if(!d.hidden){if(dist<=2){d.hidden=true;m.t=0;msg('The thin man is gone. There was nobody there.','#b8b0d8')}}
    else if(++m.t>=4){const w=m.wp[(m.i=(m.i+1)%m.wp.length)];if(Math.abs(w[0]-nx)+Math.abs(w[1]-ny)>=4){d.x=w[0];d.y=w[1];d.hidden=false;msg('Someone is standing in the dark ahead, quite still.','#b8b0d8')}}}}
}
{const _mp=msgrPlace;msgrPlace=function(){
  try{const F=G.flags,L=LEVELS[LEVEL];if(L&&L._msgr&&LEVEL>=HL.BASE&&LEVEL<HL.BASE+HL.N){F.msgrLv=F.msgrLv||{};
    if(!F.msgrLv[LEVEL]){const m=L._msgr;F.msgrLv[LEVEL]={x:m.x,y:m.y,letters:m.letters.map((q,i)=>({k:q.k||MSG_LETTERS[i],x:q.x,y:q.y,wd:q.wd})),state:'lurk',born:G.rounds,hp:null}}}}catch(e){console.warn('hl msgr',e)} // (the letters seen are one list across all the floors of the spire: the owner's omens on floors 16 to 18 count with the rest, so the list is no longer wiped on each new floor)
  return _mp.apply(this,arguments)}}
{const _ds=desertStep;desertStep=function(x,y){_ds.apply(this,arguments);try{hlStep(x,y)}catch(e){console.warn('hlStep',e)}}}
{const _oe2=ohEnter;ohEnter=function(n){G.hlOut=false;G.hlStrobe=undefined;G.hlSteps=0;_oe2.apply(this,arguments)}}
/* ---- dressing the rooms ---- */
function hlDress(c){
  const {k,rows,W,H,rooms,myst,far,used,decor,enemies,d,violet,top,R,hs,secretCh,items,up,start,maze,esc=1}=c;if(violet)return;
  const inMz=(x,y)=>!!maze&&x>=maze.x0-1&&x<=maze.x1+1&&y>=maze.y0-2&&y<=maze.y1+1; // the labyrinth and its two stubs: no hidden doors, hands or old plates in it (hollow_traps.js trapped it)
  const isW=(x,y)=>{const ch=rows[y]&&rows[y][x];return ch!==undefined&&ch!=='.'&&ch!=='0'&&ch!=='1'},isF=(x,y)=>rows[y]&&rows[y][x]==='.';
  const key=(x,y)=>x+','+y,shuf=(a,s)=>a.map(v=>[hs(v[0]*3+s,v[1]*5+k,41),v]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
  const placedP=[],placedF=[];let cap=999,cnt=0;
  const spaced=(arr,x,y,r)=>!arr.some(q=>Math.max(Math.abs(q[0]-x),Math.abs(q[1]-y))<r);
  const pic=(kk,x,y,wd,ex)=>{if(used.has(key(x,y))||cnt>=cap||!spaced(placedP,x,y,2))return false;used.add(key(x,y));placedP.push([x,y]);cnt++;decor.push(Object.assign({k:kk,x,y,wd,pic:1,block:false,walk:true,deco:true},ex||{}));return true};
  const narrow=(x,y)=>(isW(x-1,y)&&isW(x+1,y))||(isW(x,y-1)&&isW(x,y+1)); // a cell with walls on two opposite sides is a one-block passage: nothing stands there
  const flr=(kk,x,y,ex)=>{if(used.has(key(x,y))||narrow(x,y)||cnt>=cap||!spaced(placedF,x,y,2))return false;used.add(key(x,y));placedF.push([x,y]);cnt++;decor.push(Object.assign({k:kk,x,y,block:false,walk:true,deco:true},ex||{}));return true};
  const slots=r=>{const s=[];for(let x=r.x0;x<=r.x1;x++){s.push([x,r.y0,[0,-1]],[x,r.y1,[0,1]])}for(let y=r.y0;y<=r.y1;y++)s.push([r.x0,y,[-1,0]],[r.x1,y,[1,0]]);return shuf(s.filter(([x,y,w])=>isW(x+w[0],y+w[1])&&!used.has(key(x,y))),r.x0+r.y0)};
  const inner=r=>{const s=[];for(let y=r.y0+1;y<=r.y1-1;y++)for(let x=r.x0+1;x<=r.x1-1;x++)if(!used.has(key(x,y)))s.push([x,y]);return shuf(s,r.x1+r.y1)};
  // a table stands in a corner of the room (or, if a lantern has the corner, the cell beside it)
  const corner=(r,kk,ex)=>{const cs=shuf([[r.x0,r.y0],[r.x1,r.y0],[r.x0,r.y1],[r.x1,r.y1]],r.x0+r.y1);for(const [x,y] of cs)if(flr(kk,x,y,ex))return true;
    for(const [x,y] of cs)for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx>=r.x0&&nx<=r.x1&&ny>=r.y0&&ny<=r.y1&&flr(kk,nx,ny,ex))return true}return false};
  const wallArt=['hl_p_window','hl_p_alcove','hl_p_banner','hl_p_chains'];
  const note=(r,j)=>{for(const sl of slots(r))if(pic('hl_p_note',sl[0],sl[1],sl[2],{npc:'hl_note'+((k*5+j)%HL_NOTES.length),bob:.6}))break};
  const themes=['gallery','banquet','crypt','study','prison','throne','haunted'],THNAME={gallery:'Gallery of Rulers',banquet:'Banquet Hall',crypt:'The Crypt',study:'The Study',prison:'The Cells',throne:'Throne Hall',haunted:'The Haunted Room'},names=[];
  // the number of the level: a painted stone plaque with the number chiselled into it, on the wall of the first room
  {const r0=rooms[0],mx0=(r0.x0+r0.x1)>>1,my0=(r0.y0+r0.y1)>>1,pk='hl_plq'+(k+1);
   if(isW(mx0,r0.y0-1))pic(pk,mx0,r0.y0,[0,-1],{bob:.3});
   else if(isW(r0.x0-1,my0))pic(pk,r0.x0,my0,[-1,0],{bob:.3});
   if(isW(r0.x0-1,my0)&&!used.has(key(r0.x0,my0)))pic(pk,r0.x0,my0,[-1,0],{bob:.3});else if(isW(r0.x1+1,my0)&&!used.has(key(r0.x1,my0)))pic(pk,r0.x1,my0,[1,0],{bob:.3})}
  if(!decor.some(q=>/^hl_plq/.test(q.k))){const r0=rooms[0];for(const [x,y,wd] of slots(r0)){if(pic('hl_plq'+(k+1),x,y,wd,{bob:.3}))break}}
  let manDone=false;
  rooms.forEach((r,i)=>{
    if(r===myst||r.x1-r.x0<2||r.y1-r.y0<2)return;
    const th=r===far&&top?'throne':i===0?'gallery':themes[(k*3+i*2+R(60+i,3))%7],w=r.x1-r.x0+1,h=r.y1-r.y0+1,S=slots(r),I=inner(r);
    cap=Math.max(3,Math.min(9,(w*h/6)|0));cnt=0;names[i]=THNAME[th]||'Hall';
    const walls=(n,fn)=>{let j=0;for(const [x,y,wd] of S){if(j>=n)break;if(fn(x,y,wd,j))j++}};
    if(th==='gallery'){walls(6,(x,y,wd,j)=>pic(j%4===3?wallArt[(k+j)%4]:'hl_pt'+((k+i+j)%6),x,y,wd,{bob:j%4===3?.3:.5}));corner(r,'hl_p_candle')}
    else if(th==='banquet'){if(w>=5&&h>=4)flr('hl_p_feast',(r.x0+r.x1)>>1,(r.y0+r.y1)>>1);corner(r,'hl_p_candle');corner(r,'hl_p_poison',{npc:'hl_poisoncup'});if(R(70+i,10)<7)corner(r,'hl_p_apple',{npc:'hl_poisonapple'});
      walls(2,(x,y,wd,j)=>pic('hl_p_window',x,y,wd,{bob:.35}));for(const [x,y] of S){if(flr('hl_p_armour',x,y))break}}
    else if(th==='crypt'){walls(2,(x,y)=>flr('hl_p_coffin',x,y));for(const [x,y] of S)if(flr('hl_p_tomb',x,y))break;walls(2,(x,y,wd,j)=>pic(j%2?'hl_p_alcove':'hl_p_chains',x,y,wd,{bob:j%2?.35:.9}));note(r,i);if(I[0])enemies.push({t:'hlghost',x:I[0][0],y:I[0][1]})}
    else if(th==='study'){let n=0;for(const [x,y] of S){if(n>=2)break;if(flr('hl_p_shelf',x,y,{npc:'hl_book'+((k*3+n+i)%HL_BOOKS.length)}))n++}
      for(const [x,y] of S)if(flr('hl_p_lectern',x,y,{npc:'hl_book'+((k*7+i)%HL_BOOKS.length)}))break;
      corner(r,'hl_p_desk',{npc:'hl_note'+((k*3+i+4)%HL_NOTES.length)});corner(r,'hl_p_candle');walls(1,(x,y,wd)=>pic('hl_p_window',x,y,wd,{bob:.35}))}
    else if(th==='prison'){walls(2,(x,y)=>flr('hl_p_cage',x,y));for(const [x,y] of S)if(flr('hl_p_rack',x,y))break;walls(2,(x,y,wd,j)=>pic(j%2?'hl_p_alcove':'hl_p_chains',x,y,wd,{bob:j%2?.35:.9}));note(r,i+3)}
    else if(th==='throne'){const mx=(r.x0+r.x1)>>1;flr('hl_p_throne',mx,r.y0);for(const dx of [-2,2]){if(isW(mx+dx,r.y0-1))pic('hl_p_banner',mx+dx,r.y0,[0,-1],{bob:.35})}
      flr('hl_p_armour',r.x0,r.y0+1);flr('hl_p_armour',r.x1,r.y0+1);corner(r,'hl_p_candle');pic('hl_pt'+(k%6),r.x0+1,r.y0,[0,-1],{bob:.9})}
    else if(th==='haunted'){const fp=S[0];if(fp)pic('hl_fire',fp[0],fp[1],fp[2],{npc:'hl_fireplace',bob:0});let j=0;
      for(const [x,y,wd] of S.slice(1)){if(j>=3)break;if(pic(j%2?'hl_p_mirror':'hl_p_window',x,y,wd,{bob:j%2?.1:.35}))j++}
      if(I[0])enemies.push({t:'hlghost',x:I[0][0],y:I[0][1]});
      if(!manDone&&k%2===1&&I[1]){manDone=true;flr('hl_gent',I[1][0],I[1][1],{npc:'hl_gent'})}}
    // more portraits, claw marks on some walls and mirrors for the bogeyman, in any hall
    const extra=(kk,bobv)=>{for(const [x,y,wd] of slots(r))if(pic(kk,x,y,wd,{bob:bobv}))return true;return false};
    if(th!=='gallery'&&R(80+i,10)<6)extra('hl_pt'+((k*2+i)%6),.5);
    if(R(85+i,10)<7)extra('hl_claw'+((k+i*2)%6),.5);
    if(th!=='haunted'&&R(90+i,10)<5)extra('hl_p_mirror',.1);
    // more tall pointed windows looking out on the dark: two in most halls, three in the wide ones, spaced along the walls
    {let nw=(th==='crypt'||th==='prison'?1:2)+(w>=7?1:0),sx=0;for(const [x,y,wd] of slots(r)){if(nw<=0)break;if((sx++&1)===0&&pic('hl_p_window',x,y,wd,{bob:.35}))nw--}}
  });
  cap=999;
  const secretSlots=[];
  // secret rooms: a small chamber with a chest behind a wall. One wall in a hall is the wrong colour and has a lever on it; one bookshelf has a red book that swings it aside.
  const letterId={4:0,9:1,14:2}[k]===undefined?-1:{4:0,9:1,14:2}[k];let letterDone=false; // Vance's letters wait in the secret rooms of levels 5, 10 and 15
  const chamberAt=(x,y,wd)=>{const px=-wd[1],py=wd[0];
    for(let t=1;t<=5;t++)for(let sd=-2;sd<=2;sd++){const cx=x+wd[0]*t+px*sd,cy=y+wd[1]*t+py*sd;if(cx<1||cy<1||cx>=W-1||cy>=H-1||!isW(cx,cy)||used.has(key(cx,cy)))return null}
    const setC=(cx,cy,ch)=>{rows[cy]=rows[cy].slice(0,cx)+ch+rows[cy].slice(cx+1)};
    for(let t=2;t<=4;t++)for(let sd=-1;sd<=1;sd++){const cx=x+wd[0]*t+px*sd,cy=y+wd[1]*t+py*sd;setC(cx,cy,'.');used.add(key(cx,cy))}
    const dx=x+wd[0],dy=y+wd[1];setC(dx,dy,secretCh);used.add(key(dx,dy));
    const bx=x+wd[0]*4,by=y+wd[1]*4;
    decor.push({k:'chest',x:bx,y:by,block:true,magic:1,secret:true});decor.push({k:'hl_p_candle',x:x+wd[0]*3+px,y:y+wd[1]*3+py,block:false,walk:true,deco:true},{k:'hl_p_candle',x:x+wd[0]*3-px,y:y+wd[1]*3-py,block:false,walk:true,deco:true});
    decor.push({k:'hl_p_note',x:bx+px,y:by+py,wd:[wd[0],wd[1]],pic:1,block:false,walk:true,deco:true,npc:(letterId>=0&&!letterDone)?'hl_vance'+letterId:'hl_note16',bob:.6});if(letterId>=0)letterDone=true;if(items)items.push({k:'potion',x:x+wd[0]*3,y:y+wd[1]*3});
    secretSlots.push([bx-px,by-py,[wd[0],wd[1]]]);return {dx,dy};
  };
  {let made=0;const want=1+(k%3===0?1:0)+(k>=HL.N-4?1:0)+(k===HL.N-3?1:0);
   for(const r of shuf(rooms.filter(q=>q!==myst&&q.x1-q.x0>=2),77)){if(made>=want)break;
     for(const [x,y,wd] of slots(r)){const ch=chamberAt(x,y,wd);if(!ch)continue;
       decor.push({k:'lever',x,y,wd:[wd[0],wd[1]],opens:[[ch.dx,ch.dy]],idx:made,block:false,deco:true});used.add(key(x,y));made++;break}}
   // the bookshelf: tap it, pull the red book, and it swings aside
   let sh=0;const wantSh=k<12?1:2;
   for(const r of shuf(rooms.filter(q=>q!==myst&&q.x1-q.x0>=2),91)){if(sh>=wantSh)break;
     for(const [x,y,wd] of slots(r)){const ch=chamberAt(x,y,wd);if(!ch)continue;
       decor.push({k:'hl_p_shelf',x,y,block:false,walk:true,deco:true,npc:'hl_shelfdoor',opens:[[ch.dx,ch.dy]],idx:100+sh});used.add(key(x,y));sh++;break}}}
  if(letterId>=0&&!letterDone){const lr=far||rooms[rooms.length-1];for(const [x,y,wd] of slots(lr)){if(pic('hl_p_note',x,y,wd,{npc:'hl_vance'+letterId,bob:.6})){letterDone=true;break}}}
  // the Messenger of Death waits on floors 18 and 19. His five letters are never together: two are written inside secret walls, three at the far end of long winding corridors that
  // wander off from different rooms, and no two are within ten squares of each other
  if((k===HL.N-3||k===HL.N-2)&&up){
    const setC=(cx,cy,ch)=>{rows[cy]=rows[cy].slice(0,cx)+ch+rows[cy].slice(cx+1)};
    const chosen=secretSlots.slice(0,3).map(q=>[q[0],q[1],q[2],0]);
    const apart=(x,y)=>chosen.every(z=>Math.abs(z[0]-x)+Math.abs(z[1]-y)>=APART);
    const D4=[[0,-1],[1,0],[0,1],[-1,0]];
    // a windy corridor: starts at a wall of a room, runs two to four squares, turns, and so on, for about sixteen squares; every square it digs is surrounded by solid wall except the one it came from
    let MINLEN=9,MINSEG=3,APART=9;
    const snake=(sx,sy,w,seed)=>{
      for(let attempt=0;attempt<48;attempt++){
        let x=sx,y=sy,dir=D4.findIndex(q=>q[0]===w[0]&&q[1]===w[1]),cells=[],len=0,ok=true;
        const free=(cx,cy,px,py)=>{if(cx<2||cy<2||cx>=W-2||cy>=H-2||!isW(cx,cy)||used.has(key(cx,cy)))return false;
          for(const [a2,b2] of D4){const nx=cx+a2,ny=cy+b2;if(nx===px&&ny===py)continue;if(cells.some(q=>q[0]===nx&&q[1]===ny))continue;if(!isW(nx,ny)||used.has(key(nx,ny)))return false}return true};
        let px=sx,py=sy;const turns=[];let segs=0;
        while(len<18&&segs<8){
          const seg=2+((hs(sx*7+attempt,sy*5+segs,seed+13)*3)|0);let moved=0;
          for(let i=0;i<seg;i++){const nx=x+D4[dir][0],ny=y+D4[dir][1];if(!free(nx,ny,x,y))break;cells.push([nx,ny]);px=x;py=y;x=nx;y=ny;moved++;len++}
          if(!moved){break}
          segs++;const sgn=hs(sx*3+segs,sy*11+attempt,seed+17)<.5?1:3;dir=(dir+sgn)%4}
        if(len>=MINLEN&&segs>=MINSEG)return {cells,end:cells[cells.length-1],last:D4[(dir+(segs%2?0:0))%4]}}
      return null};
    const dirOfLast=(cells)=>{const n=cells.length,a2=cells[n-2],b2=cells[n-1];return [b2[0]-a2[0],b2[1]-a2[1]]};
    const starts=[];for(const r of shuf(rooms,91))for(const [x,y,wd] of slots(r))starts.push([x,y,wd,r]);
    {const more=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!isF(x,y)||used.has(key(x,y)))continue;for(const w of D4)if(isW(x+w[0],y+w[1]))more.push([x,y,w,null])}shuf(more,93).forEach(q=>starts.push(q))} // and any other floor square beside a wall
    let tries=0;
    for(const pass of [[9,3,9],[6,2,8],[4,2,7],[3,2,6],[3,2,5]]){MINLEN=pass[0];MINSEG=pass[1];APART=pass[2];
      for(const [x,y,wd,r] of starts){if(chosen.length>=5||tries++>3000)break;
        if(used.has(key(x+wd[0],y+wd[1])))continue;
        const sn=snake(x+wd[0],y+wd[1],wd,x*31+y);if(!sn)continue;const e=sn.end;if(!apart(e[0],e[1]))continue;
        // dig it: the mouth is the wall square next to the room, then each square along the way
        setC(x+wd[0],y+wd[1],'.');used.add(key(x+wd[0],y+wd[1]));for(const [cx,cy] of sn.cells){setC(cx,cy,'.');used.add(key(cx,cy))}
        const dl=dirOfLast([[x+wd[0],y+wd[1]]].concat(sn.cells));chosen.push([e[0],e[1],dl,0])}
      if(chosen.length>=5)break}
    if(chosen.length===5){chosen.forEach(q=>used.add(key(q[0],q[1])));
      const fc=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(isF(x,y)&&d[y*W+x]>=8&&!used.has(key(x,y)))fc.push([x,y]);
      const m0=fc.length?fc[(hs(k,3,5)*fc.length)|0]:[start.x,start.y-2];
      c.lv_msgr={x:m0[0],y:m0[1],letters:chosen.map(q=>({x:q[0],y:q[1],wd:q[2]}))}}
  }
  // a ruler waits in the last hall of levels 4, 9, 14 and 19
  {const ru=HL_RULERS.find(q=>q[0]===k);if(ru&&far&&!top){const cx=(far.x0+far.x1)>>1,cy=rooms.length===1?far.y0+2:(far.y0+far.y1)>>1;let bx=cx,by=cy;if(used.has(key(bx,by))){const c2=[[cx,cy+1],[cx+1,cy],[cx-1,cy],[cx,cy-1]].find(([x,y])=>isF(x,y)&&!used.has(key(x,y)));if(c2){bx=c2[0];by=c2[1]}}
    if(!used.has(key(bx,by))){enemies.push({t:ru[1],x:bx,y:by});used.add(key(bx,by))}}}
  // hidden doors: a wall that looks like any other but opens when you walk into it. It joins two passages that are far apart by the usual way. The map shows them.
  {const sec=[],cand2=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!isW(x,y)||inMz(x,y))continue;
     for(const [a,b] of [[1,0],[0,1]]){const ax=x-a,ay=y-b,bx=x+a,by=y+b;if(isF(ax,ay)&&isF(bx,by)&&d[ay*W+ax]>=0&&d[by*W+bx]>=0&&Math.abs(d[ay*W+ax]-d[by*W+bx])>=6&&isW(x+b,y+a)&&isW(x-b,y-a))cand2.push([x,y,Math.abs(d[ay*W+ax]-d[by*W+bx])])}}
   if(!cand2.length){for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!isW(x,y)||inMz(x,y))continue;for(const [a,b] of [[1,0],[0,1]]){const ax=x-a,ay=y-b,bx=x+a,by=y+b;if(isF(ax,ay)&&isF(bx,by)&&(ax!==bx||ay!==by)&&Math.abs(d[ay*W+ax]-d[by*W+bx])>=2&&isW(x+b,y+a)&&isW(x-b,y-a))cand2.push([x,y,1])}}}
   cand2.sort((p,q)=>hs(p[0],p[1],k+55)-hs(q[0],q[1],k+55));const want=Math.min(3,1+((k/6)|0));
   for(const q of cand2){if(sec.length>=want)break;if(sec.every(z=>Math.abs(z[0]-q[0])+Math.abs(z[1]-q[1])>=8)&&!used.has(key(q[0],q[1])))sec.push(q)}
   c.lv_secrets=sec.map(q=>({x:q[0],y:q[1]}));c.lv_names=names}
  if(typeof hlNewFoes==='function')hlNewFoes(c); // the new horrors, every second level from the third
  // the witch: a room of her own on some levels
  if(k%5===2){const r=rooms.find((q,i)=>i>=2&&q!==myst&&q!==far&&q.x1-q.x0>=3);if(r){const cx=(r.x0+r.x1)>>1,cy=(r.y0+r.y1)>>1;if(!used.has(key(cx,cy))){enemies.push({t:'hlwitch',x:cx,y:cy});used.add(key(cx,cy))}}}
  // corridors: a picture or a chain now and then, so the passages are not bare
  const inRoom=(x,y)=>rooms.some(r=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1);
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!isF(x,y)||inRoom(x,y)||used.has(key(x,y))||hs(x*7,y*3,k+88)>.12)continue;
    const dir=[[0,-1],[0,1],[-1,0],[1,0]].find(([a,b])=>isW(x+a,y+b)&&isF(x-a,y-b));if(!dir)continue;
    const kinds=['hl_pt'+((x+y+k)%6),'hl_pt'+((x*2+y+k)%6),'hl_p_chains','hl_p_window','hl_pt'+((x+y*3+k)%6),'hl_p_alcove','hl_p_banner','hl_claw'+((x+y)%6),'hl_p_mirror','hl_claw'+((x*3+y+k)%6)],kd=kinds[(x*3+y)%10];pic(kd,x,y,dir,{bob:kd==='hl_p_chains'?.9:/^hl_(pt|claw)/.test(kd)?.5:kd==='hl_p_mirror'?.1:.35})}
  // claw marks: at least a few on every level, wherever there is a bare wall
  {let n=G_claws();const want=3+((k/5)|0),spots=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!isF(x,y)||used.has(key(x,y)))continue;const dir=[[0,-1],[0,1],[-1,0],[1,0]].find(([a,b])=>isW(x+a,y+b));if(dir)spots.push([x,y,dir])}
   for(const [x,y,dir] of shuf(spots,23)){if(n>=want)break;if(pic('hl_claw'+((x*3+y*5+k)%6),x,y,dir,{bob:.5}))n++}
   function G_claws(){return decor.filter(q=>/^hl_claw/.test(q.k)).length}}
  // hands that reach out of a niche in the passage wall
  const nh=Math.round(Math.min(5,1+((k/4)|0))*esc);let placed=0;
  const cand=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!isF(x,y)||inRoom(x,y)||inMz(x,y)||used.has(key(x,y))||d[y*W+x]<8)continue;
    for(const [a,b] of [[0,-1],[0,1],[-1,0],[1,0]]){const nx=x+a,ny=y+b;if(isW(nx,ny)&&isF(x-a,y-b)&&isW(nx+a,ny+b)&&isW(nx+b,ny+a)&&isW(nx-b,ny-a)&&!used.has(key(nx,ny)))cand.push([nx,ny])}}
  for(const [nx,ny] of shuf(cand,9)){if(placed>=nh)break;if(used.has(key(nx,ny)))continue;rows[ny]=rows[ny].slice(0,nx)+'.'+rows[ny].slice(nx+1);used.add(key(nx,ny));enemies.push({t:'hlhands',x:nx,y:ny});placed++}
  // the triggers: plates, darkness, a voice, the party talking
  const trig=[],cells=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(isF(x,y)&&d[y*W+x]>5&&!used.has(key(x,y))&&!inMz(x,y))cells.push([x,y]);
  const pick=i=>cells.length?cells[(hs(i*17,k*3,29)*cells.length)|0]:null;
  const tp=(kk,i,ex)=>{const c0=pick(i);if(c0)trig.push(Object.assign({k:kk,x:c0[0],y:c0[1]},ex||{}))};
  for(let i=0,nt=Math.max(1,Math.round((2+((k/5)|0))*esc));i<nt;i++)tp(i%2?'darts':'spikes',100+i);
  for(let i=0;i<1+(k%2);i++)tp('dark',200+i);
  for(let i=0;i<2;i++)tp('chat',300+i,{n:k+i*2});
  if(k%3===1){const r=rooms.find((q,i)=>i>=2&&q!==myst&&q.x1-q.x0>=3);if(r){const cs=[];for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)if(isF(x,y)&&d[y*W+x]>=0)cs.push([x,y,d[y*W+x]]);cs.sort((p,q)=>p[2]-q[2]);
    if(cs.length>=3)trig.push({k:'voice',n:0,x:cs[0][0],y:cs[0][1]},{k:'voice',n:1,x:cs[cs.length>>1][0],y:cs[cs.length>>1][1]},{k:'ghost',x:cs[cs.length-1][0],y:cs[cs.length-1][1]})}}
  // a trap room on every third level: its doorways are the boundary cells beside the passages that lead in; the room is cleared of creatures
  if(k%3===2){const tr=rooms.filter((q,i)=>i>=2&&q!==myst&&q!==far&&q.x1-q.x0>=4&&q.y1-q.y0>=3).pop();
    if(tr){const doors=[];for(let y=tr.y0;y<=tr.y1;y++)for(let x=tr.x0;x<=tr.x1;x++){if(x!==tr.x0&&x!==tr.x1&&y!==tr.y0&&y!==tr.y1)continue;
        for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if((nx<tr.x0||nx>tr.x1||ny<tr.y0||ny>tr.y1)&&isF(nx,ny)){if(!doors.some(q=>q[0]===x&&q[1]===y))doors.push([x,y])}}}
      c.lv_trap={x0:tr.x0,y0:tr.y0,x1:tr.x1,y1:tr.y1,doors};
      for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(e.x>=tr.x0&&e.x<=tr.x1&&e.y>=tr.y0&&e.y<=tr.y1)enemies.splice(i,1)}}}
  c.lv_trig=trig;c.lv_rooms=rooms.map((r,i)=>({x0:r.x0,y0:r.y0,x1:r.x1,y1:r.y1,n:r===myst?'The Strange Room':(names[i]||'')}));
  const wp=rooms.filter((q,i)=>i>0&&q!==myst).slice(0,3).map(q=>[(q.x0+q.x1)>>1,q.y0]).filter(p=>isF(p[0],p[1]));
  if(manDone&&wp.length>=2)c.lv_man={i:0,t:0,wp};
}

/* ==========================================================================
   THE FOUR RULERS. Four twisted dead rulers, one on levels 4, 9, 14 and 19 of the Orange Spire, each in the last hall of its level. Each carries a relic
   far stronger than anything sold in a shop, and drops it when it falls.
   ========================================================================== */
for(const n of ['boss0','boss0A','boss1','boss1A','boss2','boss2A','boss3','boss3A'])loadImg('hl_'+n,'assets/hl_'+n+'.png');
const HL_RULERS=[ // [level index, enemy, picture width, relic]
  [3,'hlboss0'],[8,'hlboss1'],[13,'hlboss2'],[18,'hlboss3']];
ENEMY_DEF.hlboss0={name:'The Gaunt King',hp:700,dmg:[30,48],hit:.86,w:.8,img:'hl_boss0',xp:30000,gold:[400,900],speed:1,verb:'cleaves',boss:true,glow:.55,aboveParty:3,relic:'crownbreaker'};
ENEMY_DEF.hlboss1={name:'The Smiling Queen',hp:620,dmg:[26,44],hit:.9,w:.8,img:'hl_boss1',xp:30000,gold:[400,900],speed:1,verb:'shoots',ranged:5,boss:true,glow:.55,aboveParty:3,relic:'veilpiercer'};
ENEMY_DEF.hlboss2={name:'The Poison Duke',hp:820,dmg:[28,46],hit:.84,w:.8,img:'hl_boss2',xp:30000,gold:[400,900],speed:1,verb:'crushes',boss:true,glow:.55,aboveParty:3,relic:'dukesgavel'};
ENEMY_DEF.hlboss3={name:'The Hollow Child-King',hp:660,dmg:[26,46],hit:.88,w:.72,img:'hl_boss3',xp:30000,gold:[400,900],speed:1,verb:'blasts',ranged:4,boss:true,glow:.55,aboveParty:3,relic:'hollowscepter'};
ITEMDEF.crownbreaker={n:'Crownbreaker',k:'weapon',t:'Sword',ic:'sword',c:'#a8202e',dmg:[112,160],hit:.15,req:{str:30},lvl:28,price:12000,rar:1,eff:{exec:[.35,3],bossdmg:.5},dbl:.15,sw:.44,d:'The sword of the Gaunt King. Against a foe under 35% health it deals triple damage, and bosses take 50% more. Needs level 28.'};
ITEMDEF.veilpiercer={n:'Veilpiercer',k:'weapon',t:'Bow',ic:'bow',c:'#9a6ae0',dmg:[100,146],hit:.16,req:{dex:30},lvl:28,price:12000,rar:1,ranged:6,eff:{pierce:1,double:.3},dbl:.15,sw:.42,d:'The bone bow of the Smiling Queen. Shoots 6 squares, its arrows pass through to the foe behind, and three shots in ten send a second arrow. Needs level 28.'};
ITEMDEF.dukesgavel={n:"The Duke's Gavel",k:'weapon',t:'Mace',ic:'mace',c:'#6aa04a',dmg:[118,168],hit:-.02,req:{str:24},lvl:28,price:12000,rar:1,eff:{stun:.3,vuln:[.3,4],shock:.15},sw:.44,d:'The spiked mace of the Poison Duke. Three hits in ten stun the foe, and the same number crack its guard for four rounds. Needs level 28.'};
ITEMDEF.hollowscepter={n:'Hollow Scepter',k:'weapon',t:'Staff',ic:'staff',c:'#e0c050',dmg:[50,80],magic:35,req:{int:28},lvl:28,price:12000,rar:1,eff:{bossdmg:.3},sw:.44,d:'The scepter of the Hollow Child-King. Adds 35 to the power of spells, and bosses take 30% more from its blows. Needs level 28.'};
function hlRelic(e,def){
  const id=def.relic,F=HLF();F.relics=F.relics||{};if(F.relics[id])return;F.relics[id]=1;
  if(bagAdd(mkItem(id)))msg(def.name+' falls, and '+ITEMDEF[id].n+' is yours!','#e090f0');
  else{G.items.push({k:id,x:e.x,y:e.y,taken:false});msg(def.name+' falls and drops '+ITEMDEF[id].n+'. Your bag is full, so it lies on the floor.','#e090f0')}
  sfx('win');
}
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const def=ENEMY_DEF[e.t],was=e.hp>0;_he.apply(this,arguments);if(was&&e.hp<=0&&def&&def.relic)hlRelic(e,def)}}
