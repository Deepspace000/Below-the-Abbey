/* ==========================================================================
   THE WORLD MAP: THE WESTERN KINGDOMS, THE WELL MAZE, THE UNDERLEVEL AND THE LITTLE DUNGEONS (prefix wmw / WMW). Last map file in the injection order.
   It puts every area of the western kingdoms on the world map, in the same manuscript style as the rest (pictures from the atlas where one exists, otherwise small
   drawings in ink and wash): Wenlock with its church, the Maze of Gardens, Blackbriar Wood, the Wenlock Graveyard with its crypt and its four brick mazes, the Well Maze
   (four levels, drawn as a stack), the road west that is not yet open, the Underlevel with the Black Sea and its island, the Drowned Maze, the Golden Pyramid and the
   little dungeons of the deserts. The atlas page of mazes and dungeons is in maps_world_atlas2.js. Ids that the other builders have not added yet (WK.GRAVE) fall back to
   the planned numbers and are looked up again every time the map is opened (wmwSync).
   ========================================================================== */
const WMW={ready:false,cache:{}};
/* the planned ids, until the builders' own tables exist */
const wmwId=()=>({
  garden:(typeof WK!=='undefined'&&WK.GARDEN)||490,gardenRooms:(typeof WK!=='undefined'&&WK.GARDEN_ROOMS)||[491,492,493,494,495],
  wenlock:(typeof WK!=='undefined'&&WK.WENLOCK)||496,
  well:(typeof WM!=='undefined'&&WM.IDS)||[497,498,499,502],
  witch:(typeof WK!=='undefined'&&WK.WITCH)||520,witchRooms:(typeof WK!=='undefined'&&WK.WITCH_ROOMS)||[521,522,523],
  grave:(typeof WK!=='undefined'&&WK.GRAVE)||530,graveRooms:[(typeof WK!=='undefined'&&WK.GRAVECRYPT)||531],
  gmaze:(typeof WK!=='undefined'&&WK.GRAVEMAZES)||[532,533,534,535]});

/* ---------- places: positions in map units. The map already has a wide western land (The Western Reaches, The Far West), so nothing is widened; Wenlock moves west to make room ---------- */
const wmwGyName=(id,i)=>(typeof GY!=='undefined'&&GY.NAMES&&GY.NAMES[id])||LEVEL_NAMES[id]||('Grave Maze '+(i+1));
const WMW_POS={wenlock:[-300,226],gardens:[-214,200],witchwood:[-296,150],wkgrave:[-356,198],gm1:[-392,166],gm2:[-396,216],gm3:[-362,244],gm4:[-330,174],wellmaze:[-258,260],westgate:[-350,262],
  underlevel:[-84,98],drowned:[-30,100],thornwell:[186,176],goldenpyramid:[678,178]};
function wmwBuild(){
  const I=wmwId(),by=k=>WORLD_LOCS.find(l=>l.k===k),add=(o)=>{if(!by(o.k))WORLD_LOCS.push(o);return by(o.k)};
  const P=WMW_POS,wl=by('wenlock');
  if(wl){wl.x=P.wenlock[0];wl.y=P.wenlock[1];delete wl.sub}
  add({k:'gardens',n:'The Maze of Gardens',lv:[I.garden].concat(I.gardenRooms),x:P.gardens[0],y:P.gardens[1],ic:'maze'});
  add({k:'witchwood',n:'Blackbriar Wood',lv:[I.witch].concat(I.witchRooms),x:P.witchwood[0],y:P.witchwood[1],ic:'forest'});
  add({k:'wkgrave',n:'Wenlock Graveyard',lv:[I.grave].concat(I.graveRooms),x:P.wkgrave[0],y:P.wkgrave[1],ic:'graves'});
  I.gmaze.forEach((id,i)=>add({k:'gm'+(i+1),n:wmwGyName(id,i),lv:[id],x:P['gm'+(i+1)][0],y:P['gm'+(i+1)][1],ic:'rubymaze'}));
  add({k:'wellmaze',n:'The Well Maze',lv:I.well.slice(),x:P.wellmaze[0],y:P.wellmaze[1],ic:'maze'});
  add({k:'westgate',n:'The Western Kingdoms',lv:[],x:P.westgate[0],y:P.westgate[1],ic:'gate'});
  add({k:'underlevel',n:'The Underlevel',lv:[476],x:P.underlevel[0],y:P.underlevel[1],ic:'sea'});
  add({k:'drowned',n:'The Drowned Maze',lv:[477],x:P.drowned[0],y:P.drowned[1],ic:'maze'});
  add({k:'thornwell',n:LEVEL_NAMES[501]||'Under the Well',lv:[501],x:P.thornwell[0],y:P.thornwell[1],ic:'rubymaze'});
  add({k:'goldenpyramid',n:'The Golden Pyramid',lv:[65],x:P.goldenpyramid[0],y:P.goldenpyramid[1],ic:'pyramid'});
  // the four towns of the Hollow Grasslands and their rooms count as the grasslands: the party is "here" in them
  const hg=by('hollowgrass');if(hg){for(let n=480;n<=489;n++)if(!hg.lv.includes(n))hg.lv.push(n);for(let n=4850;n<=5499;n++)if(!hg.lv.includes(n))hg.lv.push(n)}
  // roads: the garden road from the gate of the Deeper Hollow, Blackbriar Lane, Churchyard Lane, the road west (shut), the lanes to the four mazes
  const R=(...a)=>{if(!WORLD_ROADS.some(r=>r.join()===a.join()))WORLD_ROADS.push(a)};
  R('deephollow','gardens','wenlock');R('wenlock','witchwood');R('wenlock','wkgrave');R('wenlock','westgate');R('wkgrave','gm1');R('wkgrave','gm2');R('wkgrave','gm3');R('wkgrave','gm4');R('wenlock','wellmaze');R('thornwick','thornwell');
  // pictures: the graveyard has the graves and a crypt of the atlas; the mazes are the brick maze of the atlas in other colours; the pyramid is the atlas pyramid
  Object.assign(WMN_SPEC,{wkgrave:[['i_graves',-9,0,22],['i_crypt',11,-3,19]],gm1:[['i_rubymaze',0,0,20,1]],gm2:[['i_rubymaze',0,0,20,1]],gm3:[['i_rubymaze',0,0,20,1]],gm4:[['i_rubymaze',0,0,20,1]],
    goldenpyramid:[['i_pyramid',0,0,22,1]],thornwell:[['i_rubymaze',0,0,17,1]],gardens:[],witchwood:[],wellmaze:[],westgate:[],underlevel:[],drowned:[]});
  Object.assign(WMN_BOX,{gardens:[-19,-36,19,2],witchwood:[-27,-49,27,6],wellmaze:[-17,-33,17,6],westgate:[-12,-26,12,2],underlevel:[-24,-26,24,4],drowned:[-15,-30,15,2]});
  WMW.ready=true}
if(typeof WORLD_LOCS!=='undefined'&&typeof WMN_SPEC!=='undefined')wmwBuild();
/* the names of the lanes, written along the road itself: [first place, last place, how far along (0 to 1), words] */
const WMW_WORDS=[['deephollow','wenlock',.62,'Garden Road'],['wenlock','witchwood',.5,'Blackbriar Lane'],['wenlock','wkgrave',.5,'Churchyard Lane'],['wenlock','westgate',.55,'road not yet open'],['wenlock','wellmaze',.5,'Well Lane']];
function wmwRoadWords(){
  const M=mpWorldM,c=ctx;if(!M.rd)return;
  for(const [a,b,t,txt] of WMW_WORDS){const A=M.by[a],B=M.by[b];if(!A||!B)continue;
    const r=M.rd.find(q=>{const p=q.pts,f=p[0],l=p[p.length-1];return Math.hypot(f[0]-A.x,f[1]-A.y)<3&&Math.hypot(l[0]-B.x,l[1]-B.y)<3});if(!r)continue;
    const p=r.pts;let L=0;const seg=[];for(let i=1;i<p.length;i++){const d=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);seg.push(d);L+=d}
    const lay=wmnLayout(),hw=txt.length*1.7+2;let done=false;
    for(const tt of [t,.5,.4,.6,.3,.7,.25,.75]){if(done)break;
      let want=L*tt,i=0;while(i<seg.length-1&&want>seg[i]){want-=seg[i];i++}const u=want/(seg[i]||1),x=p[i][0]+(p[i+1][0]-p[i][0])*u,y=p[i][1]+(p[i+1][1]-p[i][1])*u;let ang=Math.atan2(p[i+1][1]-p[i][1],p[i+1][0]-p[i][0]);if(ang>Math.PI/2)ang-=Math.PI;if(ang<-Math.PI/2)ang+=Math.PI;
      let bad=Math.abs(Math.sin(ang))>.5;   // only lanes that run more or less across the page carry words
      for(const k in lay){if(bad)break;const o=lay[k],q=o.ib,r=o.rect;if(x+hw>q[0]-2&&x-hw<q[2]+2&&y+6>q[1]-2&&y-9<q[3]+2)bad=true;if(r&&x+hw>r[0]-1&&x-hw<r[2]+1&&y+6>r[1]&&y-9<r[3])bad=true}
      for(const q of M.rvx&&M.rvx.bridges||[])if(Math.hypot(q[0]-x,q[1]-y)<hw)bad=true;
      if(bad)continue;done=true;
    c.save();c.translate(x,y);c.rotate(ang);c.font=`italic 6.4px ${FUI}`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=2.4;c.strokeStyle='rgba(236,222,176,.8)';c.strokeText(txt,0,-4.2);c.fillStyle='rgba(60,40,20,.9)';c.fillText(txt,0,-4.2);c.restore()}}}
{const _n=mpWorldNames;mpWorldNames=function(V,z){_n.apply(this,arguments);try{wmwRoadWords()}catch(e){console.error('wmw words',e)}}}
/* the area names of the quests, so that the red dots stand under the right place */
if(typeof QWORLD_ID!=='undefined'){QWORLD_ID.wk1='deephollow';QWORLD_ID.wk2='gardens';QWORLD_ID.wk3='wenlock';QWORLD_ID.bsw1='underlevel'}
if(typeof QWORLD!=='undefined')QWORLD['The Western Kingdoms']='wenlock';
if(typeof QWORLD!=='undefined')QWORLD['Wenlock Graveyard']='wkgrave';   // Lady Aldith and her five quests (gy_quests.js); the witch quests are given in Wenlock and count there

/* ---------- small helpers: an offscreen copy of a picture, tinted once ---------- */
function wmwSprite(key,w,h,fn){let s=WMW.cache[key];if(s)return s;if(!WMN.ok)return null;const K=5,cv2=document.createElement('canvas');cv2.width=Math.ceil(w*K);cv2.height=Math.ceil(h*K);const c=cv2.getContext('2d');c.scale(K,K);try{fn(c)}catch(e){console.error('wmwSprite',e)}return WMW.cache[key]={cv:cv2,w,h}}
const wmwInk='#2a1a0c';
/* a seeded little maze on an n by n grid: the walls as segments [x0,y0,x1,y1] in cell units, with a gap in the bottom wall at column `gap` */
function wmwMazeWalls(n,seed,gap){
  const seen=new Array(n*n).fill(0),open={},key=(a,b)=>a<b?a+'_'+b:b+'_'+a,st=[0];seen[0]=1;let k=0;
  while(st.length){const c=st[st.length-1],x=c%n,y=(c/n)|0,nb=[];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<n&&Y<n&&!seen[Y*n+X])nb.push(Y*n+X)}
    if(!nb.length){st.pop();continue}const q=nb[Math.floor(hash2(c,k++,seed)*nb.length)];seen[q]=1;open[key(c,q)]=1;st.push(q)}
  const seg=[];
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const c=y*n+x;
    if(x<n-1&&!open[key(c,c+1)])seg.push([x+1,y,x+1,y+1]);
    if(y<n-1&&!open[key(c,c+n)])seg.push([x,y+1,x+1,y+1])}
  return seg}
/* ---------- drawings, each [centre x, bottom y] in map units ---------- */
function wmwHedge(c,x,y){ // the Maze of Gardens: a green hedge maze with a fountain at its heart and a gold gate
  const S=34,x0=x-S/2,y0=y-S-2,n=6,u=S/n;
  c.save();c.fillStyle='rgba(50,36,20,.3)';c.fillRect(x0+1.8,y0+2,S,S);
  const g=c.createLinearGradient(0,y0,0,y0+S);g.addColorStop(0,'#b6c47a');g.addColorStop(1,'#93a85e');c.fillStyle=g;c.fillRect(x0,y0,S,S);
  c.strokeStyle='rgba(120,90,50,.35)';c.lineWidth=.3;for(let i=1;i<n;i++){c.beginPath();c.moveTo(x0+i*u,y0);c.lineTo(x0+i*u,y0+S);c.moveTo(x0,y0+i*u);c.lineTo(x0+S,y0+i*u);c.stroke()}
  const seg=wmwMazeWalls(n,811);c.lineCap='round';
  for(const pass of [0,1]){c.beginPath();for(const s of seg){c.moveTo(x0+s[0]*u,y0+s[1]*u-(pass?.5:0));c.lineTo(x0+s[2]*u,y0+s[3]*u-(pass?.5:0))}c.strokeStyle=pass?'#6f9d48':'#2f5a2a';c.lineWidth=pass?1.1:2.2;c.stroke()}
  // leafy dabs along every wall, so that the hedge looks grown rather than ruled
  {let q=0;const dab=(px,py)=>{c.fillStyle=['#4f8a3a','#7fb054','#3f7a30','#8fc060'][q++%4];c.beginPath();c.arc(px+(hash2(q,1,813)-.5)*.8,py+(hash2(q,2,813)-.5)*.8,.55+hash2(q,3,813)*.45,0,6.3);c.fill()};
    for(const s of seg){const n2=3;for(let i=0;i<=n2;i++){const t=i/n2;dab(x0+(s[0]+(s[2]-s[0])*t)*u,y0+(s[1]+(s[3]-s[1])*t)*u-.3)}}
    for(let i=0;i<=12;i++){const t=i/12;dab(x0+S*t,y0);dab(x0+S*t,y0+S);dab(x0,y0+S*t);dab(x0+S,y0+S*t)}}
  // the outer hedge, with a gap for the gate in the bottom
  c.beginPath();c.moveTo(x0,y0);c.lineTo(x0+S,y0);c.lineTo(x0+S,y0+S);c.lineTo(x0+S/2+u*.5,y0+S);c.moveTo(x0+S/2-u*.5,y0+S);c.lineTo(x0,y0+S);c.closePath();c.strokeStyle='#2f5a2a';c.lineWidth=2.6;c.stroke();c.strokeStyle='#6f9d48';c.lineWidth=1;c.stroke();
  c.strokeStyle=wmwInk;c.lineWidth=.5;c.strokeRect(x0-1.3,y0-1.3,S+2.6,S+2.6);
  // the fountain and the flowers
  c.fillStyle='#e8e0c0';c.strokeStyle=wmwInk;c.lineWidth=.45;c.beginPath();c.arc(x,y0+S/2,2.6,0,6.3);c.fill();c.stroke();c.fillStyle='#7fb6d4';c.beginPath();c.arc(x,y0+S/2,1.6,0,6.3);c.fill();
  for(let i=0;i<16;i++){const fx=x0+2+hash2(i,1,812)*(S-4),fy=y0+2+hash2(i,2,812)*(S-4);c.fillStyle=['#d8506a','#f0c040','#f4f0e0','#b070d0'][i%4];c.beginPath();c.arc(fx,fy,.6,0,6.3);c.fill()}
  // the gate: two gold posts and a lintel
  c.fillStyle='#d8b040';c.strokeStyle=wmwInk;c.lineWidth=.4;c.fillRect(x-u*.5-.5,y0+S-2.4,1.2,3);c.fillRect(x+u*.5-.7,y0+S-2.4,1.2,3);c.strokeRect(x-u*.5-.5,y0+S-2.4,1.2,3);c.strokeRect(x+u*.5-.7,y0+S-2.4,1.2,3);
  c.restore()}
function wmwForest(c,x,y){ // Blackbriar Wood: dark pines round a crooked cottage with a thread of smoke
  const spr=wmwSprite('forest',58,62,(q)=>{
    q.filter='brightness(.52) saturate(.75) contrast(1.08)';
    const T=[[-20,-2,0],[-9,0,3],[2,1,6],[13,-1,9],[22,-3,2],[-15,-9,5],[-3,-10,8],[9,-10,11],[18,-12,4],[-8,-18,1],[4,-19,7],[14,-21,10],[-21,-15,6]];
    q.save();q.translate(29,56);for(const [tx,ty,i] of T.slice().sort((a,b)=>a[1]-b[1]))wmnDraw(q,'pine'+i,tx,ty,i%3?26:23,false);q.restore();q.filter='none'});
  if(spr){c.drawImage(spr.cv,x-spr.w/2,y-spr.h+6,spr.w,spr.h)}
  // the witch's cottage in a clearing: small, crooked, with a red glow in the window
  c.save();c.translate(x,y-8);c.fillStyle='rgba(20,10,20,.55)';c.beginPath();c.ellipse(0,1.2,6,2,0,0,6.3);c.fill();
  c.fillStyle='#4a3a30';c.strokeStyle=wmwInk;c.lineWidth=.45;c.fillRect(-3.4,-4,6.8,5);c.strokeRect(-3.4,-4,6.8,5);
  c.fillStyle='#2a1a2a';c.beginPath();c.moveTo(-4.6,-4);c.lineTo(.4,-9.6);c.lineTo(4.8,-4);c.closePath();c.fill();c.stroke();
  c.fillStyle='#ff8a40';c.fillRect(.4,-2.6,1.6,1.6);c.fillStyle='#2a1a10';c.fillRect(-2.4,-1.8,1.2,2.8);
  c.strokeStyle='rgba(60,60,70,.55)';c.lineWidth=.7;c.beginPath();c.moveTo(2.4,-8);c.bezierCurveTo(4,-11,.4,-12,2.4,-15);c.stroke();
  c.restore()}
function wmwWell(c,x,y){ // the Well Maze: four violet levels one under the other, and the well above them
  c.save();
  const lv=[['#6a4a8a','#3a2658'],['#7a58a0','#44306a'],['#8a68b0','#503a78'],['#9a7ac0','#5c4488']];
  for(let i=3;i>=0;i--){const dx=-5+i*0,dy=-7-i*-6.2+0;const X=x-12+i*0,Y=y-24+ (3-i)*0;
    const px=x-11,py=y-30+i*7.4,w=22,h=11;
    c.fillStyle='rgba(30,20,40,.35)';c.fillRect(px+1.4,py+1.6,w,h);
    c.fillStyle=lv[i][0];c.fillRect(px,py,w,h);c.strokeStyle=wmwInk;c.lineWidth=.5;c.strokeRect(px,py,w,h);
    c.strokeStyle=lv[i][1];c.lineWidth=.9;c.lineCap='round';c.beginPath();const sg=wmwMazeWalls(4,830+i);for(const s of sg){c.moveTo(px+1+s[0]*(w-2)/4,py+1+s[1]*(h-2)/4);c.lineTo(px+1+s[2]*(w-2)/4,py+1+s[3]*(h-2)/4)}c.stroke();
    c.fillStyle='#f4ecc8';c.font='bold 4.2px '+FUI;c.textAlign='center';c.textBaseline='middle';c.lineWidth=1.2;c.strokeStyle=wmwInk;c.strokeText(String(i+1),px+w-3,py+h-3.2);c.fillText(String(i+1),px+w-3,py+h-3.2)}
  // the well: a stone ring on top of the stack
  c.fillStyle='#b8b09c';c.strokeStyle=wmwInk;c.lineWidth=.5;c.beginPath();c.ellipse(x,y-34,6.2,3.2,0,0,6.3);c.fill();c.stroke();c.fillStyle='#1c2a4a';c.beginPath();c.ellipse(x,y-34,3.9,1.9,0,0,6.3);c.fill();
  c.restore()}
function wmwSea(c,x,y){ // the Underlevel: a round black sea with an island of pillars and the Black Swill in the middle
  c.save();const cy=y-12;c.fillStyle='rgba(30,20,10,.3)';c.beginPath();c.ellipse(x+1.4,cy+1.8,24,14.5,0,0,6.3);c.fill();
  const g=c.createRadialGradient(x,cy,2,x,cy,24);g.addColorStop(0,'#2c3448');g.addColorStop(1,'#0e1018');c.fillStyle=g;c.strokeStyle=wmwInk;c.lineWidth=.7;c.beginPath();c.ellipse(x,cy,23,14,0,0,6.3);c.fill();c.stroke();
  c.strokeStyle='rgba(150,170,200,.35)';c.lineWidth=.4;for(let i=0;i<9;i++){const a=hash2(i,1,840)*6.3,r=.55+hash2(i,2,840)*.35,px=x+Math.cos(a)*23*r,py=cy+Math.sin(a)*14*r;c.beginPath();c.moveTo(px-2.6,py);c.quadraticCurveTo(px,py-1.2,px+2.6,py);c.stroke()}
  c.fillStyle='#8a7a62';c.strokeStyle=wmwInk;c.lineWidth=.5;c.beginPath();c.ellipse(x,cy,8.6,5.2,0,0,6.3);c.fill();c.stroke();
  c.fillStyle='#cfc4a8';for(let i=0;i<6;i++){const a=i/6*6.3+.4,px=x+Math.cos(a)*6.4,py=cy+Math.sin(a)*3.8;c.fillRect(px-.5,py-2.8,1,2.8)}
  c.fillStyle='#14141c';c.beginPath();c.ellipse(x,cy-.4,3.4,2.2,0,0,6.3);c.fill();c.fillStyle='rgba(180,170,210,.55)';c.beginPath();c.ellipse(x-1,cy-1.2,1,.6,0,0,6.3);c.fill();
  c.restore()}
function wmwDrown(c,x,y){ // the Drowned Maze: a flooded maze, blue-green water over dark walls
  const S=26,x0=x-S/2,y0=y-S-2;c.save();c.fillStyle='rgba(40,30,20,.3)';c.fillRect(x0+1.6,y0+1.8,S,S);
  const g=c.createLinearGradient(0,y0,0,y0+S);g.addColorStop(0,'#9ccad0');g.addColorStop(1,'#5f9aa8');c.fillStyle=g;c.fillRect(x0,y0,S,S);
  c.lineCap='round';c.beginPath();for(const s of wmwMazeWalls(5,851)){c.moveTo(x0+s[0]*S/5,y0+s[1]*S/5);c.lineTo(x0+s[2]*S/5,y0+s[3]*S/5)}c.strokeStyle='#244a5c';c.lineWidth=1.6;c.stroke();c.strokeStyle='#4a8aa0';c.lineWidth=.6;c.stroke();
  c.strokeStyle=wmwInk;c.lineWidth=.8;c.strokeRect(x0,y0,S,S);
  c.strokeStyle='rgba(255,255,255,.65)';c.lineWidth=.4;for(let i=0;i<7;i++){const px=x0+3+hash2(i,1,852)*(S-6),py=y0+3+hash2(i,2,852)*(S-6);c.beginPath();c.moveTo(px-2,py);c.quadraticCurveTo(px,py-1,px+2,py);c.stroke()}
  c.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<4;i++){c.beginPath();c.arc(x0+S*.7+i*.9,y0+S*.3-i*1.6,.55+i*.1,0,6.3);c.fill()}
  c.restore()}
function wmwGate(c,x,y){ // the road west: a barred gate across the lane, painted shut
  c.save();c.fillStyle='rgba(50,36,20,.3)';c.beginPath();c.ellipse(x,y,13,3,0,0,6.3);c.fill();
  c.fillStyle='#8a6a42';c.strokeStyle=wmwInk;c.lineWidth=.5;c.fillRect(x-11,y-17,3,18);c.fillRect(x+8,y-17,3,18);c.strokeRect(x-11,y-17,3,18);c.strokeRect(x+8,y-17,3,18);
  c.fillStyle='#a98652';for(let i=0;i<3;i++){c.fillRect(x-8,y-14+i*5,16,1.8);c.strokeRect(x-8,y-14+i*5,16,1.8)}
  c.strokeStyle='#8a2a1a';c.lineWidth=1.2;c.beginPath();c.moveTo(x-7,y-15);c.lineTo(x+7,y-3);c.moveTo(x+7,y-15);c.lineTo(x-7,y-3);c.stroke();
  c.restore()}
/* the four brick mazes of the graveyard, in the colours of their walls (gy_mazes.js): red clay, grey stone, black basalt, bone white */
const WMW_BRICK=[['red clay brick','none'],['grey stone brick','grayscale(1) brightness(1.08) contrast(1.05)'],['black basalt brick','grayscale(1) brightness(.42) contrast(1.15)'],['bone white mossy brick','grayscale(.9) sepia(.55) brightness(1.55) contrast(.95)']];
function wmwBrickFilter(i){return WMW_BRICK[i][1]}
/* the little dungeons of the deserts: marks scattered round each desert, named when the map is zoomed in */
function wmwDungeons(){
  if(WMW.dng)return WMW.dng;const out=[];if(typeof DNG_INFO==='undefined')return WMW.dng=out;
  const lay=wmnLayout(),byN={};for(const l of WORLD_LOCS)byN[l.n]=l;
  const groups={};for(const id of Object.keys(DNG_INFO)){const d=DNG_INFO[id];(groups[d.desert]=groups[d.desert]||[]).push(+id)}
  groups['The Sand Road']=(groups['The Sand Road']||[]).concat([50,51,52,53,54,55,56,57,58,59].filter(n=>LEVEL_NAMES[n]));   // the burrows of the Sand Road
  const taken=[];   // [x0,y0,x1,y1] of every mark with its name
  const hit=(r,q,m)=>r[0]<q[2]+m&&r[2]>q[0]-m&&r[1]<q[3]+m&&r[3]>q[1]-m;
  const obst=[];for(const k in lay){obst.push(lay[k].ib);if(lay[k].rect)obst.push(lay[k].rect)}
  for(const dn of Object.keys(groups)){const l=byN[dn];if(!l)continue;const ids=groups[dn];ids.forEach((id,i)=>{
    const nm=(DNG_INFO[id]&&DNG_INFO[id].name)||LEVEL_NAMES[id],hw=nm.length*1.05+1;let best=null;
    for(let pass=0;pass<2&&!best;pass++)for(let r=10;r<=100&&!best;r+=3.5)for(let k=0;k<14&&!best;k++){
      const a=(k/14+hash2(id,r|0,861)*.07+i*.31)*6.283,x=l.x+Math.cos(a)*r*1.4,y=l.y+Math.sin(a)*r*.9;
      if(!mpWorldM.isLand(x,y)||!mpWorldM.isLand(x,y+6))continue;
      const box=[x-Math.max(hw,3.6),y-5,x+Math.max(hw,3.6),y+7],mk=[x-4,y-5,x+4,y+1];
      let bad=false;for(const o of obst)if(hit(pass?mk:box,o,2)){bad=true;break}if(bad)continue;
      for(const q of taken)if(hit(pass?mk:box,q,1)){bad=true;break}if(bad)continue;
      best={x,y,nolab:!!pass}}
    if(best){taken.push([best.x-(best.nolab?4:Math.max(hw,3.6)),best.y-5,best.x+(best.nolab?4:Math.max(hw,3.6)),best.y+(best.nolab?1:7)]);out.push({id,x:best.x,y:best.y,n:nm,d:dn,nolab:best.nolab})}
    })}
  return WMW.dng=out}
function wmwDungeonMarks(V,z){
  const c=ctx,L=wmwDungeons();if(!L.length)return;
  for(const m of L){if(m.x<V.x0||m.x>V.x1||m.y<V.y0||m.y>V.y1)continue;
    const vis=typeof G!=='undefined'&&G.lst&&G.lst[m.id];
    c.save();c.translate(m.x,m.y);c.fillStyle='rgba(60,40,20,.3)';c.beginPath();c.ellipse(.6,.8,3.8,1.3,0,0,6.3);c.fill();
    c.fillStyle=vis?'#8a6a48':'#9a8a6c';c.strokeStyle=wmwInk;c.lineWidth=Math.max(.3,.45/z);c.beginPath();c.moveTo(-3.6,.6);c.quadraticCurveTo(-3.2,-4.6,0,-4.8);c.quadraticCurveTo(3.2,-4.6,3.6,.6);c.closePath();c.fill();c.stroke();
    c.fillStyle='#1c1208';c.beginPath();c.moveTo(-1.2,.6);c.lineTo(-1.2,-1.6);c.arc(0,-1.6,1.2,Math.PI,0);c.lineTo(1.2,.6);c.closePath();c.fill();c.restore();
    if(z>=(m.nolab?4.2:2.1)){c.save();c.font=`bold ${z>=3?3.4:3.8}px ${FUI}`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=1.6;c.strokeStyle='rgba(238,226,190,.93)';c.strokeText(m.n,m.x,m.y+4.4);c.fillStyle='#3a2410';c.fillText(m.n,m.x,m.y+4.4);c.restore()}}}

/* the eight towns of the Deeper Hollow as gold dots on its small maze, once the maze has been built (before that their places are not known) */
function wmwTowns(l){
  const L=typeof LEVELS!=='undefined'&&LEVELS[475];if(!L||!L._hgdp||!L._hgdm)return;const W=L._hgdm.W,H=L._hgdm.H,c=ctx,z=mpWorldM.zz;
  for(const q of L._hgdp.zones){if(q.type!=='safe'||q.town===undefined)continue;const x=l.x-20+q.x/W*40,y=l.y-26+q.y/H*40;
    c.save();c.fillStyle='#e0b020';c.strokeStyle=wmwInk;c.lineWidth=.45;c.beginPath();c.arc(x,y,1.5,0,6.3);c.fill();c.stroke();
    if(z>=2.4&&q.name){c.font=`bold 3.2px ${FUI}`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=1.3;c.strokeStyle='rgba(238,226,190,.95)';c.strokeText(q.name,x,y+3.4);c.fillStyle='#3a2410';c.fillText(q.name,x,y+3.4)}c.restore()}}
function wmwGateMark(l){ // the gate to the gardens, in the north wall of the maze: gold once the way is open, grey while it is shut
  const c=ctx,open=!!(G.flags&&(G.flags.bswDead||G.flags.wkGate)),x=l.x,y=l.y-26;
  c.save();c.fillStyle=open?'#e0b020':'#8a8478';c.strokeStyle=wmwInk;c.lineWidth=.5;c.beginPath();c.moveTo(x-3,y+1.4);c.lineTo(x-3,y-1.6);c.arc(x,y-1.6,3,Math.PI,0);c.lineTo(x+3,y+1.4);c.closePath();c.fill();c.stroke();c.fillStyle='#1c1208';c.beginPath();c.moveTo(x-1.2,y+1.2);c.lineTo(x-1.2,y-1.2);c.arc(x,y-1.2,1.2,Math.PI,0);c.lineTo(x+1.2,y+1.2);c.closePath();c.fill();c.restore()}
{const _w=mpWorldIco;mpWorldIco=function(l,x,y,z){_w.apply(this,arguments);try{if(l&&l.k==='deephollow'){wmwTowns(l);wmwGateMark(l)}}catch(e){}}}
/* ---------- hooks: the drawing of each picture, and the dungeon marks over the desert dunes ---------- */
const WMW_ICO={gardens:wmwHedge,witchwood:wmwForest,wellmaze:wmwWell,underlevel:wmwSea,drowned:wmwDrown,westgate:wmwGate};
{const _ico=wmnIco;wmnIco=function(l){
  const f=WMW_ICO[l.k];if(f){const L=wmnLay(l);if(L){f(ctx,l.x,l.y+(L.off||0)*0,l)}return}
  const m=/^gm(\d)$/.exec(l.k);if(m){ctx.save();ctx.filter=wmwBrickFilter(+m[1]-1);_ico(l);ctx.restore();return}
  if(l.k==='thornwell'){ctx.save();ctx.filter='hue-rotate(185deg) saturate(.5) brightness(1.1)';_ico(l);ctx.restore();return}
  _ico(l)}}
{const _f=mpWorldCreatures;mpWorldCreatures=function(V,z){_f.apply(this,arguments);try{wmwDungeonMarks(V,z)}catch(e){console.error('wmw dungeons',e)}}}

/* ==========================================================================
   THE ATLAS OF MAZES AND DUNGEONS: a book of pages on the same parchment, opened by the Atlas button of the world map. Every area that has its own level id and a name is on the
   world map as a picture, or here with its name, its levels and where it lies (hidden caves show a question mark until they have been found). wmwCoverage(id) says where an id is
   shown; tools/worldmap_check.py lists them all.
   ========================================================================== */
const WMW_INTERIOR=[[291,299,'yarrim','rooms of Yarrim'],[4850,5499,'hollowgrass','rooms of the terrace towns'],[6700,6705,'oldhaven','rooms of the Oldhaven quay'],[6800,6899,'landpath','rooms of the Pilgrim path'],[7000,7099,'wenlock','rooms of Wenlock'],[7100,7119,'landpath','caves of the Pilgrim woods'],[8000,9999,'wilds','ruins of the outdoor lands']];
const WMW_LEVELNAME=id=>LEVEL_NAMES[id]||(typeof LEVELS!=='undefined'&&LEVELS[id]&&LEVELS[id].name)||('Level '+id);
/* the rows of the atlas: groups of [ids or one id, name (optional), note (optional)]. Names come from LEVEL_NAMES when not given. */
function wmwAtlasData(){
  const I=wmwId(),F=(typeof G!=='undefined'&&G.lst)||{},seen=id=>!!F[id],G1=[];
  const dng={};if(typeof DNG_INFO!=='undefined')for(const id of Object.keys(DNG_INFO)){(dng[DNG_INFO[id].desert]=dng[DNG_INFO[id].desert]||[]).push(+id)}
  G1.push({t:'The Western Kingdoms',sw:'wenlock',rows:[[I.garden,'The Maze of Gardens','a hedge maze; its gate is in the Deeper Hollow maze'],[I.gardenRooms,'Small rooms of the garden'],[I.wenlock,'Wenlock','a market town with a church, a green and a bridge'],
    [7000,'Rooms of Wenlock','houses, shops and the church (7000 to 7099)'],[I.witch,LEVEL_NAMES[I.witch]||'Blackbriar Wood',"the witch's wood, north of Wenlock"],[I.witchRooms,'Rooms of the wood','the cottage, the cellar and the kitchen'],
    [I.grave,LEVEL_NAMES[I.grave]||'Wenlock Graveyard','with its crypt'],[I.graveRooms,'The crypt'],...I.gmaze.map((id,i)=>[id,wmwGyName(id,i),WMW_BRICK[i][0]]),
    [[],'The road to the western kingdoms','shut for now, not yet open']]});
  G1.push({t:'Under the Well of Wenlock',sw:'wellmaze',rows:I.well.map(id=>[id])});
  G1.push({t:'The Deeper Hollow',sw:'deephollow',rows:[[475,'The Deeper Hollow','a giant maze, with eight safe towns (below)'],[476,null,'the Black Sea and the island of the Black Swill'],[477,null,'under the steps in the ponds of the maze']]});
  if(typeof HGDP_T!=='undefined')G1.push({t:'The eight towns of the maze',sw:'deephollow',rows:HGDP_T.map((n,i)=>[[],n,'town '+(i+1)+' of 8, in level 475'])});
  G1.push({t:'The Hollow Grasslands',sw:'hollowgrass',rows:[[[470,471,472,473,474],'The Hollow Grasslands','the dark grassland and its beehive dungeons'],[481],[482],[483],[484]]});
  G1.push({t:'The Terrace test levels',sw:'hollowgrass',rows:[[480],[485],[486],[487]]});
  G1.push({t:'Hidden places',sw:'cave',rows:[[39,null,"a hollow behind a nymph's gift"],[40,null,'the cellars of the Prism Wizard']]});
  if(typeof WD_CAVES!=='undefined')G1.push({t:'The hidden caves',sw:'cave',rows:WD_CAVES.map((c,i)=>{const id=(typeof WD_CAVE0!=='undefined'?WD_CAVE0:7200)+i,P=WORLD_LOCS.find(l=>l.lv.includes(c[0]));return seen(id)?[id,null,'in '+(P?P.n:'the woods')]:[id,'? A hidden cave','somewhere in '+(P?P.n:'the woods')]})});
  G1.push({t:'The burrows of the Sand Road',sw:'dungeon',rows:[50,51,52,53,54,55,56,57,58,59].filter(n=>LEVEL_NAMES[n]).map(n=>[n])});
  for(const dn of Object.keys(dng))G1.push({t:'Little dungeons of '+dn,sw:'dungeon',rows:dng[dn].map(id=>[id])});
  return G1}
/* the paged flow: groups fill columns, two columns to a page */
function wmwAtlasPages(){
  const D=wmwAtlasData(),H=12,R=8.6,N=5.6,CAP=196,cols=[];let cur=[],used=0;
  const rowH=r=>R+(r[2]?N:0);
  const flush=()=>{if(cur.length)cols.push(cur);cur=[];used=0};
  for(const g of D){let rows=g.rows.slice(),first=true;
    while(rows.length){
      if(used+H+rowH(rows[0])*Math.min(2,rows.length)>CAP&&used>0)flush();
      const blk={t:g.t+(first?'':' (continued)'),sw:first?g.sw:null,rows:[]};let h=H;
      while(rows.length&&used+h+rowH(rows[0])<=CAP){const r=rows.shift();blk.rows.push(r);h+=rowH(r)}
      cur.push(blk);used+=h+4;first=false;if(rows.length)flush()}}
  flush();const pages=[];for(let i=0;i<cols.length;i+=2)pages.push([cols[i],cols[i+1]||[]]);return pages}
/* little pictures for the group headings */
function wmwSwatch(c,k,x,y,s){
  c.save();c.translate(x,y);c.scale(s,s);
  const D={wenlock:()=>wmnDraw(c,'i_town',0,10,26),deephollow:()=>wmnDraw(c,'i_stonemaze',0,6,24,true),hollowgrass:()=>wmnDraw(c,'i_oaks',0,10,26),cave:()=>wmnDraw(c,'i_cave',0,10,26),
    wellmaze:()=>wmwWell(c,0,16),dungeon:()=>wmnDraw(c,'i_crypt',0,10,26),maze:()=>wmwHedge(c,0,14)};
  try{(D[k]||D.cave)()}catch(e){}c.restore()}
function wmwAtlasDraw(){
  const M=mpWorldM,c=ctx,ink=mpWorldInk;if(!M.ready)mpWorldInit();
  BTNS=[];veil(1);const x0=14,y0=14,w=452,h=292;G._wAtlasT=G.time;
  c.save();rrect(c,x0,y0,w,h,6);c.clip();c.drawImage(M.paper,0,0,DW,DH);
  // a hand-ruled frame like the map's: blue band, gold line, ink line
  c.fillStyle='rgba(60,40,20,.06)';c.fillRect(x0,y0,w,h);
  c.strokeStyle='#2a3f8a';c.lineWidth=5;c.strokeRect(x0+3,y0+3,w-6,h-6);c.strokeStyle=MPL.GOLD;c.lineWidth=1.2;c.strokeRect(x0+7,y0+7,w-14,h-14);c.strokeStyle=ink;c.lineWidth=.8;c.strokeRect(x0+1,y0+1,w-2,h-2);c.strokeRect(x0+9,y0+9,w-18,h-18);
  c.fillStyle='#d8b040';for(const [a,b] of [[x0+6,y0+6],[x0+w-6,y0+6],[x0+6,y0+h-6],[x0+w-6,y0+h-6]]){c.beginPath();c.moveTo(a,b-5);c.lineTo(a+5,b);c.lineTo(a,b+5);c.lineTo(a-5,b);c.closePath();c.fill();c.stroke()}
  const pages=wmwAtlasPages(),pg=G.wAtlasPage=Math.max(0,Math.min(pages.length-1,G.wAtlasPage|0));
  // the title on a ribbon
  c.save();c.fillStyle='#efe2bc';c.strokeStyle=ink;c.lineWidth=.9;c.beginPath();c.moveTo(70,22);c.lineTo(410,22);c.lineTo(404,36);c.lineTo(410,50);c.lineTo(70,50);c.lineTo(76,36);c.closePath();c.fill();c.stroke();c.strokeStyle=MPL.GOLD;c.lineWidth=.8;c.stroke();
  c.font=`19px ${FTITLE}`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=ink;c.fillText('The Atlas of Mazes and Dungeons',240,34);c.font=`italic 6.6px ${FUI}`;c.fillStyle='#4a3a22';c.fillText('every maze, dungeon and hidden place, and the world map place it belongs to',240,45);c.restore();
  const visit=id=>!!(G.lst&&G.lst[id]),rate=ids=>{let lo=1e9,hi=-1;for(const v of ids){const r=LEVEL_RATING[v];if(r!==undefined){lo=Math.min(lo,r);hi=Math.max(hi,r)}}return hi<0?'':(lo===hi?String(lo):lo+'-'+hi)};
  const cx=[30,250],R=8.6,N=5.6;
  pages[pg].forEach((col,ci)=>{let y=64;const X=cx[ci],W=200;
    for(const g of col){
      // heading: a small picture, the group title in blackletter, a rule
      if(g.sw)wmwSwatch(c,g.sw,X+6,y+3,.5);
      c.font=`10px ${FTITLE}`;c.textAlign='left';c.textBaseline='middle';c.fillStyle='#2a3f8a';c.fillText(g.t,X+(g.sw?16:0),y+5);y+=12;
      c.strokeStyle='rgba(42,26,12,.55)';c.lineWidth=.5;c.beginPath();c.moveTo(X,y-1.5);c.lineTo(X+W,y-1.5);c.stroke();
      for(const r of g.rows){const ids=Array.isArray(r[0])?r[0]:[r[0]],nm=r[1]||(ids.length?WMW_LEVELNAME(ids[0]):'');
        const seenAny=ids.some(visit),rt=rate(ids),idt=ids.length>1?ids[0]+' to '+ids[ids.length-1]:(ids.length?String(ids[0]):'');
        c.fillStyle=seenAny?'#b8860b':'rgba(60,40,20,.35)';c.beginPath();c.arc(X+3,y+3,1.5,0,6.3);c.fill();if(!seenAny){c.strokeStyle='rgba(42,26,12,.6)';c.lineWidth=.4;c.stroke()}
        c.font=`bold 6.8px ${FUI}`;c.textBaseline='middle';
        c.textAlign='right';c.fillStyle='#4a3a22';c.fillText(idt,X+W,y+3.2);let rw=c.measureText(idt).width;
        if(rt){c.fillStyle='#7a1a10';c.fillText('Lv '+rt,X+W-rw-4,y+3.2);rw+=c.measureText('Lv '+rt).width+4}
        c.textAlign='left';c.fillStyle='#1c1208';let t=nm;const mw=W-10-rw-6;while(c.measureText(t).width>mw&&t.length>4)t=t.slice(0,-2);if(t!==nm)t=t.trim()+'.';c.fillText(t,X+9,y+3.2);y+=R;
        if(r[2]){c.font=`italic 5.4px ${FUI}`;c.fillStyle='#5a4a30';let n=r[2];const mw2=W-12;while(c.measureText(n).width>mw2&&n.length>6)n=n.slice(0,-2);if(n!==r[2])n=n.trim()+'.';c.fillText(n,X+9,y+1);y+=N}}
      y+=4}});
  // the foot: page, and the buttons
  c.font=`italic 7px ${FUI}`;c.textAlign='center';c.fillStyle='#4a3a22';c.fillText('Page '+(pg+1)+' of '+pages.length+'.  A gold dot marks a place the party has been to.',240,271);
  c.restore();
  btnText('watl_back','World map',34,278,100,22);btnText('ovexit','Exit',346,278,100,22);
  if(pg>0)btnText('watl_prev','Back',196,278,40,22);if(pg<pages.length-1)btnText('watl_next','Next',246,278,40,22)}
{const _dw=drawWorldMap;drawWorldMap=function(){
  if(G.wAtlas&&G._wAtlasT!==undefined&&G.time-G._wAtlasT>.6)G.wAtlas=false;   // the atlas was left open when the map was closed: the map opens afresh
  if(G.wAtlas){try{wmwAtlasDraw();return}catch(e){console.error('atlas '+e+' '+(e.stack||'').slice(0,300));G.wAtlas=false}}
  const r=_dw.apply(this,arguments);try{if(G.world)btnText('watlas','Atlas',141,278,48,22)}catch(e){}return r}}
{const _hb=handleBtn;handleBtn=function(id){
  if(G.overview&&G.world&&!G.cut&&!G.talk&&!TP){
    if(id==='watlas'){G.wAtlas=true;G.wAtlasPage=0;G._wAtlasT=G.time;return}
    if(G.wAtlas){if(id==='watl_back'){G.wAtlas=false;G._wvT=G.time;return}if(id==='watl_prev'){G.wAtlasPage=Math.max(0,(G.wAtlasPage|0)-1);return}if(id==='watl_next'){G.wAtlasPage=(G.wAtlasPage|0)+1;return}if(id==='ovexit')G.wAtlas=false}}
  return _hb.apply(this,arguments)}}
/* where is a level shown? [how, where] or null (used by tools/worldmap_check.py) */
function wmwCoverage(id){
  const l=WORLD_LOCS.find(q=>q.lv.includes(id));if(l)return ['symbol',l.n];
  for(const g of wmwAtlasData())for(const r of g.rows){const ids=Array.isArray(r[0])?r[0]:[r[0]];if(ids.includes(id))return ['atlas',g.t]}
  for(const [a,b,k,t] of WMW_INTERIOR)if(id>=a&&id<=b){const p=WORLD_LOCS.find(q=>q.k===k);return ['interior',t+(p?' of '+p.n:'')]}
  return null}
