/* ---------- door tiles (code: oak, silver, iron) ---------- */
function pshDoorTile(kind){
  PSH._dt=PSH._dt||{};if(PSH._dt[kind]!==undefined)return PSH._dt[kind];
  const WH=PSH.WH,draw=(x,w,h)=>{
    const big=kind==='great'||kind==='gallery',hw=big?52:kind==='closet'?30:40,top=h*(big?.14:.3),bot=h,cx=w/2;
    x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.3);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw);x.lineTo(cx+hw,bot);x.closePath();
    x.save();x.clip();
    const g=x.createLinearGradient(0,top,0,bot);
    if(kind==='iron'){g.addColorStop(0,'#2c2a3c');g.addColorStop(1,'#14121e')}else if(kind==='barred'){g.addColorStop(0,'#3a2c24');g.addColorStop(1,'#1c120c')}else{g.addColorStop(0,'#5a3a22');g.addColorStop(1,'#2a160c')}
    x.fillStyle=g;x.fillRect(0,0,w,h);
    x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(cx+i*hw/4.2,top);x.lineTo(cx+i*hw/4.2,bot);x.stroke()}
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.beginPath();x.moveTo(cx,top-hw*.3);x.lineTo(cx,bot);x.stroke();
    const band=kind==='great'||kind==='gallery'?'#cfd4ea':'#6a6878';
    x.fillStyle=band;for(const yy of [.32,.52,.74,.9]){x.fillRect(cx-hw,h*yy,hw*2,6);x.fillStyle='rgba(0,0,0,.45)';x.fillRect(cx-hw,h*yy+6,hw*2,2);x.fillStyle=band}
    if(big){x.fillStyle='#e8e4fa';for(const yy of [.32,.52,.74,.9])for(let i=-3;i<=3;i++){x.beginPath();x.arc(cx+i*hw/3.4,h*yy+3,2.6,0,6.3);x.fill()}
      x.strokeStyle='#e8d890';x.lineWidth=3;x.beginPath();x.arc(cx-hw*.42,h*.62,9,0,6.3);x.stroke();x.beginPath();x.arc(cx+hw*.42,h*.62,9,0,6.3);x.stroke()}
    if(kind==='iron'){const gr=x.createRadialGradient(cx,h*.6,2,cx,h*.6,30);gr.addColorStop(0,'rgba(220,190,255,1)');gr.addColorStop(1,'rgba(130,80,220,0)');x.fillStyle=gr;x.beginPath();x.arc(cx,h*.6,30,0,6.3);x.fill();x.strokeStyle='#e8e0ff';x.lineWidth=2.5;x.beginPath();x.arc(cx,h*.6,10,0,6.3);x.stroke();x.fillStyle='#14121e';x.fillRect(cx-3,h*.6-4,6,14)}
    if(kind==='barred'){x.fillStyle='#4a4650';x.fillRect(cx-hw,h*.58,hw*2,12);x.fillStyle='#8a8694';x.fillRect(cx-hw,h*.58,hw*2,3);x.fillStyle='#b8a050';x.beginPath();x.arc(cx,h*.58+6,6,0,6.3);x.fill()}
    if(kind==='closet'){x.fillStyle='#c8a860';x.beginPath();x.arc(cx+hw*.55,h*.62,4,0,6.3);x.fill();x.fillRect(cx+hw*.55-1,h*.62,2,10)}
    if(kind==='service'||kind==='cloister'){x.fillStyle='#b8b0a0';x.beginPath();x.arc(cx+hw*.5,h*.62,5,0,6.3);x.fill();if(kind==='cloister'){x.strokeStyle='#4a8a50';x.lineWidth=3;for(let i=0;i<5;i++){x.beginPath();x.arc(cx-hw*.5+i*hw*.25,h*.5+((i%2)*14),8,0,3.2);x.stroke()}}}
    x.restore();
    x.strokeStyle=big?'#e8e4fa':'#9a96aa';x.lineWidth=big?7:5;x.beginPath();x.moveTo(cx-hw,bot);x.lineTo(cx-hw,top+hw);x.quadraticCurveTo(cx-hw,top,cx,top-hw*.3);x.quadraticCurveTo(cx+hw,top,cx+hw,top+hw);x.lineTo(cx+hw,bot);x.stroke();
    x.strokeStyle='rgba(0,0,0,.5)';x.lineWidth=2;x.stroke()};
  const st=kind==='iron'||kind==='barred'?'stair':'hall';
  return PSH._dt[kind]=gyTile(PSH_STYLES[st].tex,WH,{gain:1.15,rgb:PSH_STYLES[st].rgb,tag:'psh_door_'+kind,emit:.25,fac:{img:'gatesC_0',i:0,n:1},draw})}
/* the secret-door tiles look exactly like the plain wall of the room, but are their own tile numbers */
function pshSecretTile(style){return gyTile(PSH_STYLES[style].tex,PSH.WH,{gain:PSH_STYLES[style].gain,rgb:[PSH_STYLES[style].rgb[0],PSH_STYLES[style].rgb[1],PSH_STYLES[style].rgb[2]+.00031],tag:'psh_secret_'+style,draw:(x,w,h)=>{const S=PSH_STYLES[style],wain=h*.3;x.fillStyle=S.band;x.fillRect(0,h-wain,w,wain);x.fillStyle=S.trim;x.globalAlpha=.55;x.fillRect(0,h-wain-2,w,3);x.globalAlpha=1}})}
/* ---------- the level ---------- */
const PSH_ROOMS=[ // k, rectangles (inner floor), wall style, floor slot, name
  ['A',[[46,68,66,81]],'hall','0','The Entrance Hall'],
  ['B',[[6,70,44,81]],'gallery','0','The Gallery of Portraits'],
  ['L',[[6,66,14,68]],'closet','1',"The Painters' Closet"],
  ['C',[[68,70,106,81]],'statues','0','The Hall of Statues'],
  ['D',[[36,32,76,65]],'hall','0','The Great Hall'],
  ['E',[[6,52,33,60],[3,55,5,57]],'screens','1','The Screens Passage'],
  ['F',[[80,40,106,64],[107,55,108,57]],'banquet','3','The Banqueting Hall'],
  ['G',[[6,30,32,50]],'salon','0','The Music Salon'],
  ['H',[[6,14,20,28]],'lady','4',"The Lady's Withdrawing Room"],
  ['I',[[44,10,68,28]],'stair','5','The Grand Stair Hall'],
  ['J',[[80,10,106,36]],'trophy','3','The Trophy and Hunting Hall']];
const PSH_PASS=[ // x0,y0,x1,y1, owner room, floor slot
  [45,75,45,77,'B','0'],[67,75,67,77,'C','0'],[55,66,57,67,'D','2'],[34,55,35,57,'D','2'],[77,55,79,57,'D','2'],[33,39,35,41,'D','0'],[55,29,57,31,'D','2'],[92,37,94,39,'J','3']];
function pshBuild(){
  if(LEVELS[PSH.ID])return LEVELS[PSH.ID];
  try{gyAlias();pshPics()}catch(e){console.error('psh pics',e)}
  const W=PSH.W,H=PSH.H,WH=PSH.WH,hs=(a,b,c)=>hash2(a,b,c+9740),fl=pshFloors();
  const g=[],fm=[],rid=[];for(let y=0;y<H;y++){g.push(new Array(W).fill('#'));fm.push(new Array(W).fill('0'));rid.push(new Array(W).fill(-1))}
  const RI={};PSH_ROOMS.forEach((r,i)=>{RI[r[0]]=i;for(const [x0,y0,x1,y1] of r[1])for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';fm[y][x]=r[3];rid[y][x]=i}});
  for(const [x0,y0,x1,y1,o,f] of PSH_PASS)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){g[y][x]='.';fm[y][x]=f;rid[y][x]=RI[o]}
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&g[y][x]==='.';
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  // the niches behind the two secret doors, and the closet door cell stay walls until opened; the niche cells themselves are floor
  g[68][24]='.';rid[68][24]=RI.B;fm[68][24]='1';g[68][88]='.';rid[68][88]=RI.C;fm[68][88]='1';
  // runners down the long axes
  setF(55,36,57,65,'2');setF(55,68,57,81,'2');setF(6,75,44,76,'2');setF(68,75,106,76,'2');setF(6,55,33,57,'2');setF(3,55,5,57,'2');setF(80,55,108,57,'2');setF(55,16,57,28,'2');setF(81,22,105,24,'2');setF(46,56,66,56,'0');
  setF(48,32,64,35,'5');setF(48,36,64,36,'5');                         // the dais of the Great Hall
  setF(50,16,62,22,'5');                                               // the landing of the Grand Stair
  { // the dance floor of the salon: a disc of pale marble
    for(let y=32;y<=48;y++)for(let x=8;x<=30;x++)if(open(x,y)&&Math.hypot((x-19)/8.5,(y-40)/7.5)<1)fm[y][x]='5'}
  setF(99,70,106,81,'6');                                              // the winter bay: pale grass (the garden bay at the east end of the Hall of Statues)
  setF(6,66,14,68,'3');
  // the grand stair massif (the stair block): wall inside the stair hall
  for(let y=10;y<=15;y++)for(let x=47;x<=65;x++){g[y][x]='#';rid[y][x]=-1}
  // ---- links from the contract ----
  const LK=pspLinksFrom(PSH.ID),over={},kindAt={},doorRec=[];
  const keep=new Set(),reserve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)keep.add(x+','+y)};
  for(const [x0,y0,x1,y1] of PSH_PASS)reserve(x0-1,y0-1,x1+1,y1+1);
  for(const l of LK){if(!l.at)continue;const [lx,ly,lf]=l.land;reserve(lx-1,ly-1,lx+1,ly+1);
    const kind=l.to===9730?(l.at[0]===56?'great':'gallery'):l.to===9750?'service':l.to===9760?'cloister':'iron';
    over[l.at[0]+','+l.at[1]]=pshDoorTile(kind);doorRec.push({at:l.at,link:l,kind});reserve(l.at[0]-1,l.at[1]-2,l.at[0]+1,l.at[1]+2)}
  reserve(55,16,57,19);
  // special door tiles
  const gidLady=pshDoorTile('closet'),gidClo=pshDoorTile('closet'),gidBar=pshDoorTile('barred');
  over['13,29']=pshDoorTile('closet');over['10,69']=gidClo;over['69,19']=gidBar;
  over['24,69']=pshSecretTile('gallery');over['88,69']=pshSecretTile('statues');
  reserve(12,28,14,30);reserve(9,69,11,71);reserve(68,18,70,20);reserve(23,68,25,71);reserve(87,68,89,71);
  const decor=[],enemies=[],items=[],lights=[],lcol={},kI={},r2={},occ=new Set(),wocc=new Set(),miss=[];
  const mapNames=[];
  PSH_ROOMS.forEach(r=>{const [x0,y0,x1,y1]=r[1][0];mapNames.push({t:r[4],x:(x0+x1)>>1,y:(y0+y1)>>1,k:'place'})});
  const fr=(x,y)=>open(x,y)&&!occ.has(x+','+y);
  /* put: a piece on the floor (block: solid; npc: talks) */
  const put=(k,x,y,o)=>{o=o||{};if(!open(x,y)||occ.has(x+','+y)||(keep.has(x+','+y)&&!o.force)){miss.push(k+'@'+x+','+y);return null}
    const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false;if(o.block)d.solid=1}if(o.bob!==undefined)d.bob=o.bob;if(o.ox!==undefined){d.ox=o.ox;d.oy=o.oy||0}if(o.txt)d.txt=o.txt;
    decor.push(d);if(!o.over)occ.add(x+','+y);return d};
  /* pic: a picture on the wall; (x,y) is the floor square in front, wd points at the wall */
  const pic=(k,x,y,wd,o)=>{o=o||{};const key=x+','+y+','+wd[0]+','+wd[1];if(!open(x,y)||wocc.has(key)||g[y+wd[1]]===undefined||g[y+wd[1]][x+wd[0]]!=='#'){miss.push('pic '+k+'@'+x+','+y);return null}
    const d={k,x,y,block:false,walk:true,deco:true,wd:[wd[0],wd[1]],pic:1};if(o.bob!==undefined)d.bob=o.bob;if(o.npc){d.npc=o.npc;d.deco=false}decor.push(d);wocc.add(key);return d};
  const foe=(t,x,y)=>{if(!open(x,y)||occ.has(x+','+y)||(keep.has(x+','+y))){miss.push('foe '+t+'@'+x+','+y);return false}if(!ENEMY_DEF[t]){miss.push('nodef '+t);return false}enemies.push({t,x,y,lvl:101});occ.add(x+','+y);return true};
  const lamp=(x,y,col,k,r)=>{if(!open(x,y))return;lights.push([x,y]);lcol[x+','+y]=col||PSH_COL.cold;if(k)kI[x+','+y]=k;if(r)r2[x+','+y]=r};
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd:[wd[0],wd[1]],txt:[a,b||''],sc:1})};
  const COLS=['col_fluted','col_twist','col_silver'];
  const col=(x,y,n)=>put('ps_'+COLS[n%3],x,y,{block:true});
  const stat=(x,y,i,o)=>put(PSH.st(i),x,y,Object.assign({block:true},o||{}));
  const pt=(i)=>pshPortrait(i);
  const mark=(x,y,kind)=>{kindAt[x+','+y]=kind};
  const S={g,fm,rid,open,put,pic,foe,lamp,sign,col,stat,pt,mark,fr,reserve,decor,enemies,items,lights,occ,miss,keep,over,kindAt,doorRec,setF,RI,hs,W,H};
  PSH.st=i=>{const n=['ps_st_veiled','ps_hst0','ps_hst1','ps_hst2','ps_hst3','ps_hst4','ps_hst5','ps_hst7'];return IMG[n[i%8]]?n[i%8]:'ps_hst0'};
  try{pshFurnish(S)}catch(e){console.error('pshFurnish',e);throw e}
  // ---- the wall tiles ----
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const styleAt=(x,y)=>{for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]){const a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<W&&b<H&&g[b][a]==='.'&&rid[b][a]>=0)return PSH_ROOMS[rid[b][a]][2]}return 'hall'};
  const rows=[];
  for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    if(g[y][x]==='.'){s+='.';continue}
    const k=x+','+y;
    if(over[k]!==undefined){s+=ch(over[k]);continue}
    const st=styleAt(x,y),kd=kindAt[k]||'plain',v=(hs(x,y,3)*2)|0;
    s+=ch(pshTile(st,kd,kd==='plain'?v:0))}rows.push(s)}
  // the door records: which tile number is which door
  for(const d of doorRec){const c=rows[d.at[1]][d.at[0]],gid=chars[c];KH_DOOR[gid]={psh:'link',link:d.link,get lvl(){return d.link.to},kind:d.kind}}
  {const c=rows[29][13];KH_DOOR[chars[c]]={psh:'warp',a:[13,30,2],b:[13,28,0],y:29,msgIn:true}}
  {const c=rows[69][10];KH_DOOR[chars[c]]={psh:'closet'}}
  {const c=rows[19][69];KH_DOOR[chars[c]]={psh:'barred'}}
  {const c=rows[69][24];KH_DOOR[chars[c]]={psh:'niche',flag:'framePainted',cell:[24,68],walls:'The gold frame of the painted portrait... no. Only a wall of cold stone.'}}
  {const c=rows[69][88];KH_DOOR[chars[c]]={psh:'niche',flag:'statueTurned',cell:[88,68]}}
  const cf=(x0,y0,x1,y1,f)=>{};
  const fmS=fm.map(r=>r.join(''));
  // lights of the colour table for the walls' own lamp-posts: a light every few squares where none is near
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y)||rid[y][x]===RI.H)continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=7.5)){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=PSH_COL.cold}}}
  const L={rows,chars,fmap:fmS,floorSet:fl.slice(),floor:fl[0],floor2:fl[1],ceil:'psc_hall',ceilH:WH,start:{x:56,y:80,f:0},enemies,items,decor,lights,portals:[],day:0,amb:.16,torchGap:1e9,noTele:true,noExtras:true,sky:[],
    name:'The Ground Floor: the Great Halls',label:'The Great Halls',diff:101,mapNames,_psh:{lcol,kI,r2,col:PSH_COL.cold,miss,S:null}};
  LEVELS[PSH.ID]=L;LEVEL_NAMES[PSH.ID]=L.name;LEVEL_RATING[PSH.ID]=101;
  if(miss.length)console.warn('psh missed: '+miss.slice(0,60).join(' '));
  {const NN=W*H,hh=new Float32Array(NN).fill(.3),rk=new Float32Array(NN),block=new Uint8Array(NN);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]!=='.')block[y*W+x]=1;try{TERRS[PSH.ID]=yarTerrain(W,H,hh,rk,block)}catch(e){console.error(e)}}
  return L}
if(typeof pspRegister==='function'){try{pspRegister(PSH.ID,pshBuild,{})}catch(e){KH_LAZY[PSH.ID]=pshBuild}}else KH_LAZY[PSH.ID]=pshBuild;
LEVEL_NAMES[9740]='The Ground Floor: the Great Halls';LEVEL_RATING[9740]=101;
