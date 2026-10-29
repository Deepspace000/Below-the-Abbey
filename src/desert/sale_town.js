/* ==========================================================================
   SALE: THE TOWN (level 600, rated 90). A small, grim, gothic town of the dead, 72 by 72, in dusk fog. One road, Candle Street, runs west to east through Gibbet Square (a dead fountain, a gibbet, a lamp at each corner);
   the Sanctuary (a gothic chapel) stands at the north of the square. Bell Lane goes north to the Belfry, Charnel Row south into the dead quarter (ruined houses, the Hollow Cellar, the crypt),
   Tanners' Lane south through a few quiet cottages, and the Back Track runs along the south side to the gravedigger's cottage and, past the fog, Hollin Farm (ruins).
   Ten shops line Candle Street. Every one is BARRICADED (planks over the door, the keeper's voice through the boards) until the party has won that keeper's trust (sale_quests.js).
   The party arrives from the east gate at SA.START (the entrance square); the road to the east gate is not built yet: saAttachRoad(to,x,y,f) lets later work attach it. Test link: ?town=sale&lvl=90.
   Hostile ground: only the dead quarter and Hollin Farm (SA_ZONES); everywhere else the dead are peaceful ghosts and the party walks freely (sale_folk.js).
   ========================================================================== */
const SA_Y=36,SA_SQ={x0:30,y0:30,x1:40,y1:42};
const SA_ROADS=[[4,36,68,36,'0','Candle Street'],[57,20,57,35,'3','Bell Lane'],[20,37,20,60,'3','Charnel Row'],[53,37,53,60,'3',"Tanners' Lane"],[20,61,66,61,'3','Back Track']];
const SA_ROAD=(x,y)=>SA_ROADS.some(r=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3]);
/* where the dead are hostile; nowhere else is */
const SA_ZONES=[{k:'dead',n:'The Dead Quarter',x0:8,y0:38,x1:34,y1:67},{k:'farm',n:'Hollin Farm',x0:57,y0:55,x1:68,y1:67}];
const saZoneAt=(x,y)=>SA_ZONES.find(z=>x>=z.x0&&x<=z.x1&&y>=z.y0&&y<=z.y1)||null;
/* the ten shops: name, kind, keeper, look. `q` is the trust quest that opens it, `room` the Wenlock room it is furnished like, `stock` its goods (sale_rooms.js) */
const SA_SPEC={
  general:{name:"Pennyworth's Provisions",kind:'general',keeper:'Tabitha Pennyworth',sty:'sa_slate',roof:'sa_rf_1',wh:2.5,room:'general',q:'sa1',key:'general'},
  armour:{name:"Ironbrow's Armoury",kind:'armour',keeper:'Sergeant Hob Ironbrow',sty:'sa_black',roof:'sa_rf_2',wh:2.6,room:'armour',q:'sa2',key:'armour'},
  weapons:{name:"Stroud and Daughter, Weaponsmiths",kind:'weapons',keeper:'Marta Stroud',sty:'sa_brick',roof:'sa_rf_7',wh:2.5,room:'weapons',q:'sa3',key:'weapons'},
  apothecary:{name:"Marrowbone's Remedies",kind:'herb',keeper:'Old Nan Marrowbone',sty:'sa_moss',roof:'sa_rf_3',wh:2.4,room:'herbs',q:'sa4',key:'apothecary'},
  books:{name:'The Dead Letter Scriptorium',kind:'scroll',keeper:'Ottoline Quill',sty:'sa_ash',roof:'sa_rf_5',wh:2.6,room:'scrolls',q:'sa5',key:'books'},
  jeweller:{name:'The Gilded Eye, Jewellers',kind:'jewel',keeper:'Silvio Gilt',sty:'sa_bone',roof:'sa_rf_4',wh:2.4,room:'chandler',q:'sa6',key:'jeweller'},
  tailor:{name:"Madame Veil, Mourning Tailor",kind:'tailor',keeper:'Madame Orla Veil',sty:'sa_ash',roof:'sa_rf_9',wh:2.4,room:'tailor',q:'sa7',key:'tailor'},
  butcher:{name:'Crust and Cleaver',kind:'bakery',keeper:'Hettie Mawd',sty:'sa_brick',roof:'sa_rf_6',wh:2.4,room:'bakery',q:'sa8',key:'butcher'},
  alchemist:{name:"Vesper's Alembic",kind:'potion',keeper:'Master Orrin Vesper',sty:'sa_slate',roof:'sa_rf_5',wh:2.6,room:'potion',q:'sa9',key:'alchemist'},
  tavern:{name:'The Last Orders',kind:'inn',keeper:'Big Bram Cobb',sty:'sa_black',roof:'sa_rf_4',wh:2.9,room:'inn',q:'sa10',key:'tavern'}
};
/* the lots. [side, position, width, special]. N and S: the two sides of Candle Street (position = x). CW and CE: Charnel Row. TW, TE: Tanners' Lane. BW, BE: Bell Lane. KN and KS: the Back Track (position = x) */
const SA_LOTS=[
  ['N',5,2],['N',8,3,'general'],['N',13,2],['N',16,3,'armour'],['N',21,2],['N',24,3,'weapons'],['N',43,3,'apothecary'],['N',48,2],['N',52,3,'books'],['N',60,3,'jeweller'],['N',64,2],
  ['S',5,2],['S',8,3,'butcher'],['S',13,2],['S',24,3,'alchemist'],['S',43,3,'tavern'],['S',48,3,'tailor'],['S',56,2],['S',60,2],['S',64,2],
  ['CW',42,2],['CW',47,2,'rope'],['CW',52,2],['CW',57,2],['CE',44,2],['CE',49,2],['CE',54,2],
  ['TW',41,2],['TW',46,2,'reeve'],['TW',51,2],['TW',56,2],['TE',43,2],['TE',48,2,'midwife'],['TE',53,2],['TE',58,2],
  ['BW',22,2],['BW',26,2,'ringer'],['BW',32,2,'billet'],['BE',24,2,'cats'],['BE',28,2],['BE',32,2],
  ['KN',28,2],['KN',44,2,'digger'],['KS',30,2],['KS',40,2],['KS',46,2]
];
const SA_HOMES={rope:{name:"The Ropewalk Cottage",room:'cellardoor'},ringer:{name:"The Bellman's Cottage",room:'home',scene:'messy',keeper:'sa_k_ringer'},digger:{name:"The Gravedigger's Cottage",room:'home',scene:'spartan',keeper:'sa_k_digger'},
  reeve:{name:"The Reeve's House",room:'home',scene:'scholar'},midwife:{name:"The Midwife's Cottage",room:'home',scene:'healer'},billet:{name:"The Watchman's Billet",room:'home',scene:'soldier'},cats:{name:"The Wool Merchant's House",room:'home',scene:'merchant'}};   // the last four are empty and quiet: webs, a candle, and nobody home
function saLotRect(side,pos,w){
  let x0,y0,x1,y1,face;
  if(side==='N'){x0=pos;x1=pos+w-1;y0=SA_Y-2;y1=SA_Y-1;face='S'}
  else if(side==='S'){x0=pos;x1=pos+w-1;y0=SA_Y+1;y1=SA_Y+2;face='N'}
  else if(side==='CW'||side==='TW'||side==='BW'){const lx={CW:20,TW:53,BW:57}[side];x0=lx-2;x1=lx-1;y0=pos;y1=pos+w-1;face='E'}
  else if(side==='CE'||side==='TE'||side==='BE'){const lx={CE:20,TE:53,BE:57}[side];x0=lx+1;x1=lx+2;y0=pos;y1=pos+w-1;face='W'}
  else if(side==='KN'){x0=pos;x1=pos+w-1;y0=59;y1=60;face='S'}
  else{x0=pos;x1=pos+w-1;y0=62;y1=63;face='N'}
  return {x0,y0,x1,y1,face}}
function saLotDoor(h){
  const horiz=h.face==='N'||h.face==='S',span=horiz?h.x1-h.x0+1:h.y1-h.y0+1,ci=(horiz?h.x0:h.y0)+((span-1)>>1)+(span>=4&&hash2(h.x0,h.y0,13)<.5?1:0);
  if(h.face==='N'){h.door=[ci,h.y0];h.front=[ci,h.y0-1];h.out=0;h.wall=[0,1]}
  else if(h.face==='S'){h.door=[ci,h.y1];h.front=[ci,h.y1+1];h.out=2;h.wall=[0,-1]}
  else if(h.face==='E'){h.door=[h.x1,ci];h.front=[h.x1+1,ci];h.out=1;h.wall=[-1,0]}
  else{h.door=[h.x0,ci];h.front=[h.x0-1,ci];h.out=3;h.wall=[1,0]}
  return h}
const SA_HOUSES=[];
{for(const [side,pos,w,sp] of SA_LOTS){const r=saLotRect(side,pos,w);SA_HOUSES.push(Object.assign(r,{w,spk:SA_SPEC[sp]?sp:null,sp:SA_SPEC[sp]||null,home:SA_HOMES[sp]?sp:null}))}
 let n=SA.H0+1;for(const h of SA_HOUSES){saLotDoor(h);h.id=n++}}
/* the Sanctuary: a gothic chapel at the north of the square, five squares wide, its door always barred (Wren and Aldous Wend will live there later: its room is 7299, not built) */
const SA_CHAPEL={x0:32,x1:36,y0:25,y1:29,front:[34,30],out:0};
const SA_BELFRY={x0:55,x1:59,y0:15,y1:19,door:[57,19],front:[57,20]};
const SA_CRYPTGATE={x:20,y:62,front:[20,61]};   // the crypt stair: the south end of Charnel Row, below the Back Track
/* the doors of the town that lead somewhere (for tests and the map): id = the level behind; shops are SA_DOORS entries with .shop */
const SA_DOORS=[];
for(const h of SA_HOUSES)if(h.spk||h.home)SA_DOORS.push({id:h.id,name:h.sp?h.sp.name:SA_HOMES[h.home].name,shop:h.spk,home:h.home,front:{x:h.front[0],y:h.front[1]},out:h.out,door:{x:h.door[0],y:h.door[1]}});
/* ---- the barricade: the painted door with planks nailed across it ---- */
function saBarricadeTex(baseId,wh,seed){
  const src=TEX[baseId],Hp=Math.round(128*wh),c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');
  x.putImageData(new ImageData(new Uint8ClampedArray(src.d),128,Hp),0,0);
  const y0=Hp-128,pl=(cx,cy,len,ang,h,s)=>{x.save();x.translate(cx,cy);x.rotate(ang);const g=x.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,'#3a2c1e');g.addColorStop(.5,'#5a4630');g.addColorStop(1,'#2a1f15');x.fillStyle=g;x.fillRect(-len/2,-h/2,len,h);
    x.strokeStyle='rgba(0,0,0,.65)';x.lineWidth=1.5;x.strokeRect(-len/2,-h/2,len,h);
    for(let i=0;i<10;i++){const gy=-h/2+2+hash2(i,s,3)*(h-4);x.strokeStyle='rgba(20,10,4,'+(.25+hash2(i,s,4)*.3)+')';x.lineWidth=1;x.beginPath();x.moveTo(-len/2+hash2(i,s,5)*20,gy);x.lineTo(len/2-hash2(i,s,6)*20,gy+(hash2(i,s,7)-.5)*3);x.stroke()}
    for(const nx of [-len/2+9,len/2-9]){x.fillStyle='#8a8478';x.beginPath();x.arc(nx,0,2.3,0,6.3);x.fill();x.fillStyle='rgba(0,0,0,.5)';x.beginPath();x.arc(nx+.8,.8,1.2,0,6.3);x.fill()}
    x.restore()};
  pl(64,y0+30+seed%5,148,-.14+(seed%3)*.03,17,seed);pl(64,y0+60,150,.1-(seed%2)*.05,18,seed+1);pl(64,y0+92-seed%4,146,-.07,17,seed+2);
  pl(60+seed%7,y0+64,140,Math.PI/2+.04,15,seed+3);
  const id=addTex(x.getImageData(0,0,128,Hp).data,null);TEX[id].h=Hp;TEX[id].wh=wh;return id}
function saBuild(){
  if(LEVELS[SA.ID])return true;
  if(!SA.ready||(typeof KH_READY!=='undefined'&&!KH_READY)){saLoad();return false}
  saPrep();
  const FS=saFloors();
  const W=SA.W,H=SA.H,N=W*H,hs=(a,b,c)=>hash2(a,b,c);
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const pch=n=>{const c=String.fromCharCode(nextCh++);chars[c]=30+n;return c};
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const block=new Uint8Array(N),fm=new Array(N).fill('2'),hgt=new Float32Array(N).fill(.3),rk=new Float32Array(N);
  const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
  const sky=[],decor=[],lights=[],items=[],enemies=[],used=new Set(),street=new Set();
  const lv={rows:null,start:{x:SA.START.x,y:SA.START.y,f:SA.START.f},enemies,items,decor,scenery:[],sky,fmap:null,floorSet:FS,floor:FS[2],ceil:'cloud',day:.62,outdoor:true,amb:.6,
    name:'Sale',label:'Sale',noExtras:true,diff:90,tele:{x:38,y:40},ceilH:5.2,chars,lights,portals:[],torchGap:1e9};
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)fm[y*W+x]=f};
  const isRoad=(x,y)=>street.has(x+','+y);
  const free=(x,y)=>x>2&&y>2&&x<69&&y<69&&rows[y][x]==='.'&&!block[y*W+x]&&!used.has(x+','+y)&&!isRoad(x,y);
  const dc=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}))};
  const tryDc=(k,x,y,o)=>{if(k&&IMG[k]&&free(x,y)){dc(k,x,y,o);return true}return false};
  const solidDc=(k,x,y,o)=>{if(k&&IMG[k]&&free(x,y)){const soft=/lantern|lamp|hedge|bush/.test(k)&&!(o&&(o.npc||o.solid));dc(k,x,y,soft?(o||{}):Object.assign({block:true,walk:false},o||{}));return true}return false}; // lamps and bushes are walk-through, as in the rest of the game
  const walk=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true},o||{}))};
  const near=(x,y,rad)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(free(x+dx,y+dy))return [x+dx,y+dy]}return null};
  const person=(id,x,y,rad)=>{const kp=KH_KEEPERS[id];if(!kp)return null;const q=near(x,y,rad||3);if(!q)return null;walk(khFaceKey(kp.face),q[0],q[1],{npc:id,sc:kp.sc||1});SA.people.push([id,q[0],q[1]]);return q};
  SA.people=[];SA.free=free;SA.near=near;
  const pick=(arr,a,b,c)=>arr[(hs(a,b,c)*arr.length)|0];
  const lamp=(x,y)=>{if(solidDc('gy_lantern',x,y))lights.push([x,y])};
  const foe=(t,x,y)=>{const q=near(x,y,4);if(!q)return false;used.add(q[0]+','+q[1]);enemies.push({t,x:q[0],y:q[1],lvl:90});return true};
  const DEAD=['gy_dead','gy_dead','gy_yew'],tree=(x,y)=>solidDc(pick(DEAD,x,y,61),x,y,{sc:.9+hs(x,y,62)*.35});
  const bones=(x,y)=>tryDc('gy_bones',x,y,{sc:.8}),web=(x,y)=>tryDc('gy_web',x,y,{sc:.55});
  // ---- the ground ----
  setF(0,0,W-1,H-1,'2');
  const road=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){street.add(x+','+y);fm[y*W+x]=f}};
  for(const r of SA_ROADS)road(r[0],r[1],r[2],r[3],r[4]);
  setF(SA_SQ.x0,SA_SQ.y0,SA_SQ.x1,SA_SQ.y1,'1');for(let x=SA_SQ.x0;x<=SA_SQ.x1;x++)fm[SA_Y*W+x]='0';
  // the dead quarter is bare earth and dead grass, Hollin Farm too; the mire is a few sunk patches
  for(const z of SA_ZONES)for(let y=z.y0;y<=z.y1;y++)for(let x=z.x0;x<=z.x1;x++)if(!isRoad(x,y)&&hs(x,y,5)<.8)fm[y*W+x]=hs(x>>1,y>>1,6)<.3?'5':'3';
  for(let y=3;y<69;y++)for(let x=3;x<69;x++)if(fm[y*W+x]==='2'&&hs(x>>2,y>>2,8)<.16)fm[y*W+x]='5';
  // ---- the boundary: a black wall of tall stone, two squares thick, with the east gate ----
  const WALL=1.9,wt=[0,1,2].map(i=>ch(TM.make('plain',['sa_black','sa_slate','sa_ash'][i],WALL).gid));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x>=3&&x<=68&&y>=3&&y<=68)continue;solid(x,y,wt[(hs(x,y,7)*3)|0])}
  {const gh=2.6,gate=TM.make('gate','sa_black',gh,'gy_igate');T_DOORS.sagate=gate.tex;const pil=ch(TM.make('plain','sa_black',gh).gid),gc=pch(1);
    solid(69,SA_Y-1,pil);solid(69,SA_Y+1,pil);rows[SA_Y][69]=gc;block[SA_Y*W+69]=0;
    lv.portals[1]={to:SA.ID,x:SA.START.x,y:SA.START.y,f:SA.START.f,tex:'sagate',req:'saRoadOpen',lock:'The iron gate of Sale is shut. A rotten cart lies on its side across the road beyond, and crows sit on the cart and watch you. The road is not passable yet.'};
    if(SA.ROAD)Object.assign(lv.portals[1],{to:SA.ROAD.to,x:SA.ROAD.x,y:SA.ROAD.y,f:SA.ROAD.f,req:undefined,lock:undefined});
    // a gate house of two pointed lanterns
    for(const y of [SA_Y-2,SA_Y+2]){if(solidDc('gy_lantern',68,y))lights.push([68,y])}}
  // ---- the WEST gate (Pale Spire redesign): a gate tile in the wall at PSP.SALE.gate, one open square before it, leading up the castle road to the Pale Approach (9720) ----
  if(typeof PSP!=='undefined'){const gh=2.6,pil=ch(TM.make('plain','sa_black',gh).gid),gc=pch(2),gx=PSP.SALE.gate[0],gy=PSP.SALE.gate[1];
    solid(gx,gy-1,pil);solid(gx,gy+1,pil);rows[gy][gx]=gc;block[gy*W+gx]=0;rows[gy][gx+1]='.';block[gy*W+gx+1]=0;
    lv.portals[2]={to:PSP.ENTRY.id,x:PSP.ENTRY.x,y:PSP.ENTRY.y,f:PSP.ENTRY.f,tex:'sagate'};
    for(const y of [gy-2,gy+2]){if(solidDc('gy_lantern',3,y))lights.push([3,y])}}
  // ---- the buildings ----
  const STYS=['sa_slate','sa_moss','sa_black','sa_bone','sa_brick','sa_ash'],houses=SA_HOUSES;
  houses.forEach((h,k)=>{
    const sp=h.sp;h.k=k;h.sty=sp?sp.sty:pick(STYS,h.x0,h.y0,14);h.rk=sp?sp.roof:pick(SA_ROOFSET,h.x0,h.y0,15);
    {const pv=houses[k-1],pv2=houses[k-2];
     if(!sp&&pv&&pv.face===h.face){for(let t=1;t<=STYS.length&&(h.sty===pv.sty||(pv2&&pv2.face===h.face&&h.sty===pv2.sty));t++)h.sty=STYS[(STYS.indexOf(h.sty)+t)%STYS.length];
       for(let t=1;t<=SA_ROOFSET.length&&(h.rk===pv.rk||(pv2&&pv2.face===h.face&&h.rk===pv2.rk));t++)h.rk=SA_ROOFSET[(SA_ROOFSET.indexOf(h.rk)+t)%SA_ROOFSET.length]}}
    h.wh=sp?sp.wh:Math.round((2.0+hs(h.x0,h.y0,16)*.7)*10)/10;h.name=sp?sp.name:(h.home?SA_HOMES[h.home].name:null)});
  SA.dgid={};   // door gid per house id: {bar, open, texBar, texOpen}
  for(const h of houses){
    const sty=h.sty,wh=h.wh,front=(x,y)=>h.face==='N'?y===h.y0:h.face==='S'?y===h.y1:h.face==='E'?x===h.x1:x===h.x0;
    const plain=ch(TM.make('plain',sty,wh).gid),plain2=ch(TM.make('plain2',sty,wh).gid),win=ch(TM.make(h.spk&&h.sp.kind!=='inn'?'shopfront':'window',sty,wh).gid),side=ch(TM.make('window',sty,wh).gid),gwin=ch(TM.make('slit',sty,wh).gid);
    const dtile=TM.make('door',sty,wh),dgid=KH_NEXT_GID++;T_TILE[dgid]=dtile.tex;
    const D={door:dgid,texOpen:dtile.tex,texBar:h.spk?saBarricadeTex(dtile.tex,wh,h.id):dtile.tex,house:h};SA.dgid[h.id]=D;
    const tgt=h.home==='rope'?SA.CELLAR:h.id;
    KH_DOOR[dgid]={lvl:h.spk||h.home?tgt:undefined,get at(){if(!LEVELS[tgt]&&KH_LAZY[tgt])KH_LAZY[tgt]();const L=LEVELS[tgt],st=L&&L.start;return st?{x:st.x,y:st.y,f:0}:{x:4,y:4,f:0}},
      sale:h.spk?{shop:h.spk}:h.home?null:{sealed:1,h:h.id}};
    if(h.spk){KH_DOOR[dgid].lvl=undefined;T_TILE[dgid]=D.texBar}
    for(let y=h.y0;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++){
      let c;if(x===h.door[0]&&y===h.door[1])c=ch(dgid);else if(front(x,y))c=win;else c=((x+y)%3===0)?side:((x*5+y*3)%5===1?gwin:(x*3+y)%4===1?plain2:plain);
      solid(x,y,c)}
    const horiz=h.face==='N'||h.face==='S',span=horiz?h.x1-h.x0+1:h.y1-h.y0+1;
    sky.push({x:(h.x0+h.x1+1)/2,y:(h.y0+h.y1+1)/2,k:wlRoofFor(h.rk,h),w:span+.5+(h.sp?.15:0),z:h.wh-.03});
    // a lamp or a dead shrub by the door, never in the road
    const sideCells=horiz?[[h.front[0]-1,h.front[1]],[h.front[0]+1,h.front[1]]]:[[h.front[0],h.front[1]-1],[h.front[0],h.front[1]+1]];
    const wallRow=horiz?[[h.x0-1,h.face==='S'?h.y1:h.y0],[h.x1+1,h.face==='S'?h.y1:h.y0]]:[[h.face==='E'?h.x1:h.x0,h.y0-1],[h.face==='E'?h.x1:h.x0,h.y1+1]];
    for(const [tx,ty] of wallRow)if(free(tx,ty)&&hs(tx,ty,96)<.55){const r=hs(tx,ty,97);if(r<.4)tryDc('gy_urn',tx,ty,{block:true,walk:false,sc:.5});else if(r<.7)bones(tx,ty);else tryDc('gy_web',tx,ty,{sc:.5})}
  }
  // the barricades: a flat picture of planks on the wall by each shop door, spoken for by the shopkeeper behind it (the quest mark shows over it)
  for(const h of houses){if(!h.spk)continue;const k='sa_planks'+(h.id%3);
    if(IMG[k]){decor.push({k,x:h.front[0],y:h.front[1],wd:h.wall,pic:1,block:false,walk:true,deco:false,npc:'sa_b_'+h.spk,bob:.05,cloudid:'sa_bar'})}}
  // the signs of the shops, and the street names
  for(const h of houses){
    if(!h.spk)continue;const horizontal=h.face==='N'||h.face==='S';
    for(const sgn of [1,-1]){const sx=horizontal?h.front[0]+sgn:h.front[0],sy=horizontal?h.front[1]:h.front[1]+sgn,wallCell=horizontal?[sx,h.face==='S'?h.y1:h.y0]:[h.face==='E'?h.x1:h.x0,sy];
      if(rows[wallCell[1]]&&rows[wallCell[1]][wallCell[0]]==='.')continue;
      if(!free(sx,sy)&&!isRoad(sx,sy))continue;
      decor.push({k:'sign_sa'+h.id,x:sx,y:sy,block:false,wd:h.wall,txt:[(h.name.length>24?h.name.split(',')[0]:h.name).toUpperCase()],sc:.7,bob:(h.wall[0]+h.wall[1])>0?.4:.26});break}}
  // ---- the Sanctuary: a gothic chapel front, five squares wide, three of them the (barred) door ----
  {const C=SA_CHAPEL,wh=3.6,cp=ch(TM.make('plain','sa_ash',wh).gid),cw=ch(TM.make('window','sa_ash',wh).gid);
    SA.sanct=[];
    for(let y=C.y0;y<=C.y1;y++)for(let x=C.x0;x<=C.x1;x++){
      if(y===C.y1&&IMG.gyp_f_gothic){const i=x-C.x0,gid=gyTile('texGrey_0',wh,{fac:{img:'f_gothic',i,n:5,fit:1,at:.5},gain:1.05,tag:'sanct'+i});
        if(i>=1&&i<=3){KH_DOOR[gid]={sale:{sanct:1},lvl:undefined};SA.sanct.push(gid)}solid(x,y,ch(gid))}
      else if(y===C.y1){solid(x,y,(x-C.x0)%2?cw:cp)}
      else solid(x,y,(x+y)%3===0?cw:cp)}
    sky.push({x:(C.x0+C.x1+1)/2,y:(C.y0+C.y1+1)/2,k:wlRoofFor('sa_rf_2'),w:6.4,z:wh-.03});
    const tw=wlPick('church_tower','kh_ohtower1_4');if(tw)sky.push({x:C.x0+.2,y:C.y1+.4,k:tw,w:3.2,z:wh-.03,big:1});
    decor.push({k:'sign_sasanct',x:C.front[0]+2,y:C.front[1],block:false,wd:[0,-1],txt:['THE SANCTUARY'],sc:.8,bob:.3});
    for(let y=C.y0;y<=C.y1;y++)for(let x=C.x0-1;x<=C.x1+1;x++)used.add(x+','+y);
    used.add(C.front[0]+','+C.front[1]);used.add(C.front[0]+','+(C.front[1]+1))}
  // ---- the Belfry: a black tower at the north end of Bell Lane ----
  {const B=SA_BELFRY,wh=4.4,bp=ch(TM.make('plain','sa_black',wh).gid),bw=ch(TM.make('window','sa_black',wh).gid),bd=TM.make('door','sa_black',wh),dgid=KH_NEXT_GID++;T_TILE[dgid]=bd.tex;
    KH_DOOR[dgid]={lvl:SA.BELFRY,get at(){if(!LEVELS[SA.BELFRY]&&KH_LAZY[SA.BELFRY])KH_LAZY[SA.BELFRY]();const L=LEVELS[SA.BELFRY];return L?{x:L.start.x,y:L.start.y,f:0}:{x:5,y:12,f:0}}};
    for(let y=B.y0;y<=B.y1;y++)for(let x=B.x0;x<=B.x1;x++)solid(x,y,x===B.door[0]&&y===B.door[1]?ch(dgid):(x+y)%2?bw:bp);
    const tw=wlPick('church_tower','kh_ohtower1_4','kh_ohtower1_1');if(tw)sky.push({x:57.5,y:17.6,k:tw,w:5.4,z:wh-.03,big:1});
    for(let y=B.y0-2;y<=B.y1+1;y++)for(let x=B.x0-1;x<=B.x1+1;x++)used.add(x+','+y);
    decor.push({k:'sign_sabelfry',x:B.front[0]+1,y:B.front[1],block:false,wd:[0,-1],txt:['THE BELFRY'],sc:.7,bob:.3})}
  // ---- the crypt stair, at the south end of Charnel Row: an arch in the Back Track's south wall of stone ----
  {const G0=SA_CRYPTGATE,wh=2.6,cp=ch(TM.make('plain','sa_black',wh).gid);
    for(let x=G0.x-2;x<=G0.x+2;x++)for(const y of [62,63]){if(rows[y][x]==='.')solid(x,y,cp)}
    const gid=gyTile('texGrey_0',wh,{fac:{img:'f_vault',i:0,n:1,fit:1,at:.5},gain:1.05,tag:'crypt'});KH_DOOR[gid]={lvl:SA.CRYPT,get at(){if(!LEVELS[SA.CRYPT]&&KH_LAZY[SA.CRYPT])KH_LAZY[SA.CRYPT]();const L=LEVELS[SA.CRYPT];return L?{x:L.start.x,y:L.start.y,f:0}:{x:12,y:11,f:0}}};
    rows[G0.y][G0.x]=ch(gid);
    decor.push({k:'sign_sacrypt',x:G0.front[0]+1,y:G0.front[1],block:false,wd:[0,1],txt:['THE CRYPT'],sc:.7,bob:.3})}
  // the Ropewalk Cottage's door leads down to the Hollow Cellar: the lot's door is made when its room is built (sale_rooms.js)
  // ---- Gibbet Square: a dead fountain, a gibbet, lamps, a plague cart, benches, bones, a notice ----
  {const S=SA_SQ;
    tryDc('sa_fountain',35,38,{block:true,walk:false,sc:1.35,npc:'sa_fountain',deco:false});
    tryDc('sa_gibbet',38,33,{block:true,walk:false,sc:1.15,npc:'sa_gibbet',deco:false});tryDc('gy_rpost',37,33,{block:true,walk:false,sc:.8});tryDc('gy_raven',39,33,{sc:.6,bob:.0});
    tryDc('sa_cart',32,40,{block:true,walk:false,sc:1.1});tryDc('sa_coffins',31,40,{block:true,walk:false,sc:.9});tryDc('sa_coffins',33,41,{block:true,walk:false,sc:.8});
    for(const [x,y] of [[30,30],[40,30],[30,42],[40,42],[35,31]])lamp(x,y);
    for(const [x,y] of [[31,38],[39,40],[33,33],[37,41]])tryDc('gy_bench',x,y,{block:true,walk:false,sc:1});
    for(const [x,y] of [[34,40],[37,35],[32,34],[39,38],[36,32],[31,41]])bones(x,y);
    for(const [x,y] of [[33,31],[37,31]])tryDc('gy_candles',x,y,{block:true,walk:false,sc:.7});
    tryDc('gy_sign',31,32,{block:true,walk:false,npc:'sa_notice',deco:false,sc:.95});
    for(const [x,y] of [[31,35],[39,37],[36,41],[33,38]])web(x,y);
    tryDc('gy_rpost',32,37,{});}
  // ---- the dead quarter: stones, bones, webs, dead trees, broken fences, ruined yards ----
  for(const z of SA_ZONES)for(let n=0;n<(z.k==='dead'?110:50);n++){const x=z.x0+((hs(n,1,31)*(z.x1-z.x0+1))|0),y=z.y0+((hs(n,2,31)*(z.y1-z.y0+1))|0);if(!free(x,y)||SA_ROAD(x-1,y)||SA_ROAD(x+1,y)||SA_ROAD(x,y-1)||SA_ROAD(x,y+1))continue;
    const r=hs(n,3,31);if(r<.3)tree(x,y);else if(r<.5)solidDc(pick(['gy_stone1','gy_stone2','gy_lean','gy_wcross'],x,y,32),x,y,{sc:.9});else if(r<.7)bones(x,y);else if(r<.85)web(x,y);else solidDc('gy_fence',x,y,{sc:.9})}
  // ---- Hollin Farm: a barn, a hut, hay, a cart, a broken fence, bones ----
  {const pic=(img,x0,y0,x1,y1,wh,sx,sy,w)=>{if(!IMG[img])return false;const pw=ch(TM.make('plain','sa_black',wh).gid);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(rows[y][x]==='.'){solid(x,y,pw);used.add(x+','+y)}sky.push({x:sx,y:sy,k:img,w,z:0,big:1});for(let y=y0-2;y<=y1+1;y++)for(let x=x0-1;x<=x1+1;x++)used.add(x+','+y);return true};
    pic('wl_bldg1_5',62,57,65,59,2.4,64,56.8,4.4);
    tryDc('gy_hut',60,63,{block:true,walk:false,sc:1.05,npc:'sa_hut',deco:false});
    for(const [x,y] of [[59,58],[66,62],[63,65],[58,65]])tryDc('hay',x,y,{block:true,walk:false,sc:1.2});
    for(const [x,y] of [[60,60],[64,62],[66,66],[58,57]])solidDc('gy_fence',x,y,{sc:.9});
    for(const [x,y] of [[61,59],[65,64],[59,61]])bones(x,y)}
  // ---- everywhere else: dead trees and fences in the back gardens, lamps along the roads ----
  for(let n=0;n<260;n++){const x=4+((hs(n,1,20)*64)|0),y=4+((hs(n,2,20)*64)|0);if(!free(x,y)||saZoneAt(x,y)||(x>=SA_SQ.x0-1&&x<=SA_SQ.x1+1&&y>=SA_SQ.y0-1&&y<=SA_SQ.y1+1))continue;
    if(SA_ROAD(x-1,y)||SA_ROAD(x+1,y)||SA_ROAD(x,y-1)||SA_ROAD(x,y+1))continue;
    const r=hs(n,3,20);if(r<.34)tree(x,y);else if(r<.5)solidDc('gy_fence',x,y,{sc:.9});else if(r<.62)bones(x,y);else if(r<.75)tryDc('hay',x,y,{block:true,walk:false,sc:1.1});else if(r<.9)web(x,y);else solidDc('gy_stone2',x,y,{sc:.85})}
  for(let x=7;x<=66;x++){if(x>=SA_SQ.x0-1&&x<=SA_SQ.x1+1)continue;if(x%7!==3)continue;for(const y of [SA_Y-1,SA_Y+1])if(free(x,y)){lamp(x,y);break}}
  for(const [x,y] of [[21,40],[21,50],[21,58],[52,40],[52,50],[52,58],[56,24],[58,32],[56,36]])if(free(x,y))lamp(x,y);else if(free(x-1,y))lamp(x-1,y);
  for(let x=24;x<=64;x+=10)if(free(x,62))lamp(x,62);
  // ---- the polish: candle-lit windows, a dead well, crows, a gravestone in the front gardens (the quiet streets were too evenly dark) ----
  {let lit=0;for(const h of houses){if(h.spk&&hs(h.id,3,41)<.7||(!h.spk&&hs(h.id,4,41)<.34)){const lx=h.front[0],ly=h.front[1];if(!saZoneAt(lx,ly)&&!lights.some(l=>Math.abs(l[0]-lx)+Math.abs(l[1]-ly)<2)){lights.push([lx,ly]);lit++}}}
   SA.litWindows=lit;
   for(const [x,y] of [[51,46],[55,48],[22,34],[46,41]]){const q=near(x,y,3);if(q&&tryDc('sa_well',q[0],q[1],{block:true,walk:false,sc:1.05}))break}
   for(let n=0;n<34;n++){const x=5+((hs(n,5,44)*62)|0),y=5+((hs(n,6,44)*62)|0);if(saZoneAt(x,y)||!free(x,y))continue;if(!(SA_ROAD(x-1,y)||SA_ROAD(x+1,y)||SA_ROAD(x,y-1)||SA_ROAD(x,y+1)))continue;
     const r=hs(n,7,44);if(r<.45)tryDc('gy_raven',x,y,{sc:.55+hs(n,8,44)*.2});else if(r<.8)solidDc(pick(['gy_stone1','gy_stone2','gy_lean','gy_wcross'],x,y,45),x,y,{sc:.75});else tryDc('gy_candles',x,y,{sc:.5})}}
  // ---- the people, the dead and the quest things (sale_folk.js, sale_quests.js) ----
  const C={W,H,rows,block,fm,hgt,sky,decor,lights,items,enemies,used,street,ch,TM,solid,free,dc,tryDc,solidDc,walk,near,person,pick,hs,lamp,foe,houses,pch,chars,lv,setF,isRoad,tree,bones,web};
  if(typeof saPlaceFolk==='function')saPlaceFolk(C);
  if(typeof saPlaceQuest==='function')saPlaceQuest(C);
  // ---- the QA and atmosphere pass: readable notes, trails, small things, then no identical neighbours ----
  try{saStoryPass(C)}catch(e){console.error('saStoryPass',e)}
  // ---- the level ----
  lv.rows=rows.map(r=>r.join(''));
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}lv.fmap=fmap;
  lv.mapNames=[{t:'Candle Street',x:15,y:35,k:'lane'},{t:'Gibbet Square',x:35,y:34.5,k:'place'},{t:'Bell Lane',x:57,y:27,k:'lane'},{t:'Charnel Row',x:20,y:50,k:'lane'},{t:"Tanners' Lane",x:53,y:50,k:'lane'},{t:'Back Track',x:42,y:61,k:'lane'},
    {t:'The Sanctuary',x:34,y:26.5,k:'place'},{t:'The Belfry',x:57,y:16.5,k:'place'},{t:'The Dead Quarter',x:15,y:52,k:'place'},{t:'Hollin Farm',x:63,y:62,k:'place'},{t:'The Crypt',x:20,y:64.5,k:'place'}];
  {for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=chars[rows[y][x]];if(c>=30&&c<100)block[y*W+x]=0}}
  SA.houses=houses;SA.street=street;
  LEVELS[SA.ID]=lv;LEVEL_NAMES[SA.ID]='Sale';
  {const T=yarTerrain(W,H,hgt,rk,block);TERRS[SA.ID]=T}
  return true}
KH_LAZY[SA.ID]=()=>{saBuild()};
/* ---- the east gate: later work attaches the Blighted Lands road here ---- */
function saAttachRoad(to,x,y,f){
  SA.ROAD={to,x,y,f:f||0};const L=LEVELS[SA.ID];
  if(L&&L.portals&&L.portals[1]){const p=L.portals[1];p.to=to;p.x=x;p.y=y;p.f=f||0;delete p.req;delete p.lock}
  G.flags.saRoadOpen=1}
/* ---- the doors: barricaded shops, sealed houses, the barred Sanctuary ---- */
const SA_SEALED=['The door is nailed shut from the outside. Somebody has scratched a tally of days into the frame, and then stopped counting.','The door is bolted. Behind it, very faintly, something is humming a lullaby.','The door is shut and the shutters are closed. A dry wreath hangs on the knocker, as brown as a leaf.','The door will not move. Someone has piled furniture behind it, and the dust on the doorstep has not been disturbed in years.','The door is locked. A child\'s boot lies on the step, and has lain there a long time.'];
function saShopOpen(k){return !!(G.flags&&G.flags['sa_open_'+k])}
function saApplyDoors(){
  if(!SA.dgid)return;
  for(const id in SA.dgid){const D=SA.dgid[id],h=D.house;if(!h.spk)continue;const open=saShopOpen(h.spk);T_TILE[D.door]=open?D.texOpen:D.texBar;KH_DOOR[D.door].lvl=open?h.id:undefined}
  const L=LEVELS[SA.ID];if(L&&G.decor)for(const d of G.decor){if(d.cloudid==='sa_bar'){const k=(d.npc||'').slice(5);if(saShopOpen(k)){d.found=true;d.block=false}else d.found=false}}
}
/* press on a barricaded door: the keeper answers through the boards */
function saBarricadeTalk(shop,nx,ny){
  sfx('locked');try{startTalk({k:'_',x:nx,y:ny,npc:'sa_b_'+shop})}catch(e){console.error(e)}}
{const _kb=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.sale&&saIs(LEVEL)){const s=d.sale;
    if(s.shop&&!saShopOpen(s.shop)){saBarricadeTalk(s.shop,nx,ny);return true}
    if(s.sanct){sfx('locked');G.talk={d:{k:'_',x:nx,y:ny},n:{name:'The Sanctuary'},node:say('The doors of the chapel are barred from the inside. A heavy beam holds them, and between the doors a thin line of candlelight shows. A voice you cannot place says, very quietly, nothing at all, and then a latch moves.\n\nBarred from inside. Someone is sheltering here.',[['Leave them be.',()=>null]]),t:G.time,btns:[]};G.hold=null;G.queued=null;return true}
    if(s.sealed){sfx('locked');msg(SA_SEALED[(hash2(s.h,5,5)*SA_SEALED.length)|0],'#d09a80');return true}}
  return _kb.apply(this,arguments)}}
/* ---- arriving: doors by the flags, the first words, the stolen gate ---- */
function saArrive(n){
  const F=G.flags;
  if(n===SA.ID){
    saApplyDoors();
    if(!F.saMet){F.saMet=1;msg('Sale. A bell tolls, and nobody is ringing it.','#a8b8d8')}
    if(SA.ROAD)F.saRoadOpen=1;
    try{if(typeof saZoneHint==='function')saZoneHint()}catch(e){}
  }
}
/* ==========================================================================
   SALE: THE QA AND ATMOSPHERE PASS (prefix b7 / saStory). Readable notes on posts, small things lying about (a boot, a spilled cart, a cut bucket rope), trails (bread crumbs to the
   Sanctuary, bones to the crypt stair, candle stubs up Bell Lane to the belfry), roses and candles at the barricaded doors, a warm cage lantern by each shop door, epitaph boards in the
   dead quarter, then a clean-up: no two identical props within two squares of each other (the second one is swapped for a different piece, or dropped).
   ========================================================================== */
const SA_NOTES={
  sa_n_gate:["TOLL BOARD","One coin a head for the gate. The collector's stool is still here, and so is his cup. There are no coins in it."],
  sa_n_charnel:["CHARNEL ROW","Closed by order of the reeve. Nobody living past the post after dusk. Someone has scratched out the words 'after dusk'."],
  sa_n_back:["BACK TRACK","To Hollin Farm and the gravedigger's cottage. The crypt stair is at the west end. Keep to the road."],
  sa_n_bell:["BELL LANE","The belfry is locked. The bell rings with nobody on the rope. Do not climb the stair alone. Under this, in another hand: it is not locked any more."],
  sa_n_farm:["HOLLIN FARM","Flour and eggs by the cart. Ring the bell at the gate. The bell has been taken down. The hook is still there."],
  sa_n_sanct:["THE SANCTUARY","Closed from inside. Leave bread on the step. Do not knock."],
  sa_n_tan:["TANNERS' LANE","Hides, rope and glue. The vats are still full. Nobody has been paid for nine years."],
  sa_boot:["A boot","A child's left boot, lying on its side in the dust. The notice board says one boot was found. Nobody has come for it."],
  sa_steps:["Crumbs on the step","Crumbs of fresh bread lie on the ground near the Sanctuary door. The loaf left here last night is gone."],
  sa_cart2:["An overturned handcart","A handcart on its side with one wheel still turning. Rye flour is trampled flat across the track. Whoever pushed it left in a hurry, and left the load."],
  sa_bucket:["A bucket","A wooden bucket beside the well. The rope has been cut, not frayed, and the cut end is clean."],
  sa_rose:["A rose at the door","A dry red rose and a burnt-down candle on the ground by a boarded shop. Somebody comes here and leaves them. The wax is not old."],
  sa_gibrope:["A coil of rope","A coil of good rope, left at the foot of the gibbet. It has never been used. The knot at the end is a hangman's knot."],
  sa_ghostn:["A pale shape","A pale shape stands very still and looks at a house. It does not look at you, and it does not move when you wave."]};
for(const id in SA_NOTES)khNpc(id,SA_NOTES[id][0],null,()=>say(SA_NOTES[id][0]+'\n\n'+SA_NOTES[id][1],[BYE]));
const SA_EPI=[
  "MARTHA PELL, baker's wife. Died the first winter. The bread went on without her.",
  "HOB AND EDITH CARTER. Died in the same week and the same bed. A neighbour cut this board and spelled it wrong.",
  "A CHILD, name not known. Found by the well. The reeve's clerk has marked her as 'ours'.",
  "THE WATCH, EIGHT MEN. They held the east road for three days. One of them is not in this row.",
  "JONAH SPRAT, tanner. He knew what was in the vats. Do not dig him up.",
  "SISTER AGNES. She rang the bell for the dying, and then there was nobody left to ring it for."];
SA_EPI.forEach((t,i)=>khNpc('sa_epi'+i,'A grave board',null,()=>say('A wooden board, grey with weather, with words cut into it.\n\n'+t,[BYE])));
/* the shared clean-up: swap or drop a prop that has an identical twin within two squares. decor is the array; pools maps a key to the alternatives; skip(d) keeps a piece as it is. Returns what it did. */
function b7Dedupe(decor,pools,skip,rad){
  rad=rad||2;const kept=[],out={swapped:0,dropped:0},drop=new Set();
  for(const d of decor){
    if(skip&&skip(d)){kept.push(d);continue}
    const clash=k=>kept.some(e=>e.k===k&&e!==d&&Math.max(Math.abs(e.x-d.x),Math.abs(e.y-d.y))<=rad);
    if(clash(d.k)){
      const pool=pools[d.k]||[];let alt=null;
      for(let i=0;i<pool.length;i++){const a=pool[(((d.x*7+d.y*13)>>1)+i)%pool.length];if(IMG[a.k]&&!clash(a.k)){alt=a;break}}
      if(alt){d.k=alt.k;if(alt.sc)d.sc=alt.sc;if(alt.b!==undefined&&!d.npc){if(alt.b){d.block=true;d.walk=false;delete d.deco}else{d.block=false;d.walk=true;d.deco=true}}out.swapped++}
      else{drop.add(d);out.dropped++;continue}
    }
    kept.push(d)}
  if(drop.size){for(let i=decor.length-1;i>=0;i--)if(drop.has(decor[i]))decor.splice(i,1)}
  return out}
const SA_POOLS={
  gy_bones:[{k:'gy_rose',sc:.9,b:0},{k:'gy_mound',sc:.7,b:0},{k:'ww_boot',sc:1,b:0},{k:'gy_book',sc:1,b:0},{k:'wm_bucket',sc:1,b:0}],
  gy_web:[{k:'ww_twig',sc:1,b:0},{k:'ww_twig2',sc:1,b:0},{k:'ww_hagstone',sc:1,b:0},{k:'gy_locket',sc:1,b:0},{k:'gy_ring',sc:1,b:0}],
  gy_urn:[{k:'gy_ccross',sc:.8,b:1},{k:'gy_slab',sc:.9,b:1},{k:'hl_p_tomb',sc:1,b:1},{k:'gy_obelisk',sc:.55,b:1}],
  gy_lantern:[{k:'wm_cage_lantern',sc:1.3,b:0}],
  gy_dead:[{k:'gy_yew',sc:.9,b:1},{k:'ww_stump',sc:.9,b:1},{k:'ww_crowtree',sc:.8,b:1}],
  gy_yew:[{k:'gy_dead',sc:.9,b:1},{k:'ww_stump',sc:.9,b:1},{k:'ww_crowtree',sc:.8,b:1}],
  gy_stone1:[{k:'gy_stone2',sc:.85,b:1},{k:'gy_slab',sc:.85,b:1},{k:'gy_lean',sc:.9,b:1},{k:'gy_wcross',sc:.9,b:1},{k:'gy_ccross',sc:.7,b:1}],
  gy_stone2:[{k:'gy_stone1',sc:.85,b:1},{k:'gy_slab',sc:.85,b:1},{k:'gy_lean',sc:.9,b:1},{k:'gy_wcross',sc:.9,b:1},{k:'gy_ccross',sc:.7,b:1}],
  gy_lean:[{k:'gy_stone1',sc:.85,b:1},{k:'gy_slab',sc:.85,b:1},{k:'gy_stone2',sc:.85,b:1},{k:'gy_wcross',sc:.9,b:1}],
  gy_wcross:[{k:'gy_stone1',sc:.85,b:1},{k:'gy_lean',sc:.9,b:1},{k:'gy_slab',sc:.85,b:1},{k:'gy_stone2',sc:.85,b:1}],
  gy_slab:[{k:'gy_stone1',sc:.85,b:1},{k:'gy_lean',sc:.9,b:1},{k:'gy_wcross',sc:.9,b:1}],
  gy_fence:[{k:'gy_lean',sc:.9,b:1},{k:'gy_wcross',sc:.9,b:1},{k:'gy_slab',sc:.8,b:1},{k:'gy_stone1',sc:.8,b:1}],
  hay:[{k:'wm_crate',sc:1.2,b:1},{k:'wm_barrel',sc:1.2,b:1},{k:'cart',sc:1,b:1}],
  gy_bench:[{k:'wm_crate',sc:1.1,b:1},{k:'wm_barrel_tall',sc:1,b:1}],
  sa_coffins:[{k:'hl_p_coffin',sc:.9,b:1},{k:'gy_coffin',sc:.5,b:1}],
  gy_candles:[{k:'hl_p_candle',sc:.7,b:0},{k:'gy_rose',sc:.9,b:0}],
  gy_rpost:[{k:'ww_totem',sc:.5,b:1},{k:'wm_signpost',sc:.7,b:1}]};
function saStoryPass(C){
  const {near,decor,lights,tryDc,free,hs}=C,houses=C.houses;
  const note=(k,id,x,y,r,o)=>{const q=near(x,y,r===undefined?3:r);if(!q)return null;const d={k,x:q[0],y:q[1],block:true,walk:false,npc:id,deco:false,sc:(o&&o.sc)||.9};if(o&&o._t)d._t=1;decor.push(d);C.used.add(q[0]+','+q[1]);return q};
  const small=(k,x,y,r,o)=>{const q=near(x,y,r===undefined?2:r);if(!q)return null;const d=Object.assign({k,x:q[0],y:q[1],block:false,walk:true,deco:true,sc:1},o||{});decor.push(d);C.used.add(q[0]+','+q[1]);return q};
  // keep the front squares of the Sanctuary, the belfry, the crypt stair and every shop door clear
  for(const h of houses){if(h.front)C.used.add(h.front[0]+','+h.front[1])}
  for(const [cx,cy] of [[34,30],[57,20],[20,61]])for(let dx=-1;dx<=1;dx++)C.used.add((cx+dx)+','+cy);
  // the signposts
  note('gy_sign','sa_n_gate',66,35,3,{sc:.8});note('gy_sign','sa_n_charnel',21,38,3,{sc:.8});note('gy_sign','sa_n_back',30,60,3,{sc:.8});note('gy_sign','sa_n_bell',58,29,3,{sc:.8});
  note('gy_sign','sa_n_farm',62,53,3,{sc:.8});note('gy_sign','sa_n_sanct',31,29,3,{sc:.8});note('gy_sign','sa_n_tan',52,45,3,{sc:.8});
  // small things that were left
  note('ww_boot','sa_boot',32,33,2,{sc:1});
  note('wm_mine_cart','sa_cart2',60,57,3,{sc:1});
  {const w=decor.find(d=>d.k==='sa_well');if(w)note('wm_bucket','sa_bucket',w.x,w.y,2,{sc:1})}
  note('ww_totem','sa_gibrope',37,34,2,{sc:.35});
  // bread crumbs to the Sanctuary step, a thin trail every third square
  for(const [x,y] of [[24,33],[28,31],[32,29]])small('ww_crumbs',x,y,0,{_t:1,sc:1.1});
  note('ww_crumbs','sa_steps',36,31,1,{sc:1.2,_t:1});
  // bones along Charnel Row toward the crypt stair, then a candle stub every third square up Bell Lane
  [[22,42],[22,46],[22,50],[22,54],[22,58]].forEach(([x,y],i)=>small(['gy_bones','gy_mound','gy_book','gy_rose','gy_bones'][i],x,y,1,{_t:1,sc:.8}));
  [[56,32],[58,29],[56,26],[58,23],[56,22]].forEach(([x,y],i)=>{const q=small('hl_p_candle',x,y,1,{_t:1,sc:.6});if(q&&i%2===0&&!lights.some(l=>Math.abs(l[0]-q[0])+Math.abs(l[1]-q[1])<3))lights.push([q[0],q[1]])});
  // a rose and a candle at some barricaded doors, and a warm cage lantern by each shop door
  let ro=0;for(const h of houses){if(!h.spk||!h.front)continue;
    const [fx,fy]=h.front,dx=(h.face==='N'||h.face==='S')?1:0,dy=dx?0:1;
    for(const s of [1,-1,2,-2]){const x=fx+dx*s,y=fy+dy*s;if(free(x,y)&&!lights.some(l=>Math.abs(l[0]-x)+Math.abs(l[1]-y)<2)){tryDc('wm_cage_lantern',x,y,{sc:1.3});lights.push([x,y]);break}}
    if(ro<5&&hs(h.id,9,9)<.6){const q=near(fx+dx*2,fy+dy*2,1);if(q){note('gy_rose','sa_rose',q[0],q[1],0,{sc:1.1});ro++}}}
  // grave boards in the dead quarter
  [[12,42],[16,46],[10,52],[14,58],[24,48],[28,56]].forEach(([x,y],i)=>note('gy_nameplate','sa_epi'+i,x,y,3,{sc:.8}));
  // pale shapes standing in the quiet streets (the Orange Spire's painted ghost)
  [[14,34],[47,34],[27,38],[60,38]].forEach(([x,y],i)=>{const gk=IMG.sa_gv0?'sa_gv'+[1,3,0,1][i%4]:'hl_p_ghost',gs=IMG.sa_gv0?1:.8;if(i===0)note(gk,'sa_ghostn',x,y,2,{sc:gs});else small(gk,x,y,2,{sc:gs})});
  saCharacter(C,note,small);
  // the clean-up: nothing identical within two squares (the trail pieces go first, so the others yield to them)
  {const t=decor.filter(d=>d._t),r=decor.filter(d=>!d._t);decor.length=0;for(const d of t)decor.push(d);for(const d of r)decor.push(d)}
  const res=b7Dedupe(decor,SA_POOLS,d=>d.pic||d._t||(d.npc&&!/^sa_(n_|boot|steps|cart2|bucket|rose|epi|ghostn)/.test(d.npc))||/^sign_|^sa_planks|^sa_gh_|^sa_gibbet|^sa_fountain|^sa_cart$|^sa_well|^kh_/.test(d.k)||d.k==='gy_sign'||d.k==='hl_p_ghost'||/^sa_gv/.test(d.k)||d.k==='wm_cage_lantern');
  for(const d of decor)delete d._t;
  SA.story=res;
}

/* ==========================================================================
   SALE ROUND 2: composition. Braziers for warm pools of light against the cold fog, houses with a character of their own, a west arch to end the long view of Candle Street,
   a dead orchard, a churchyard and a burning ground in the empty back country, and things leaning on walls. Everything stands beside the roads, never in them.
   ========================================================================== */
function saCharacter(C,note,small){
  const {decor,lights,tryDc,free,hs,houses,near}=C,solidDc=C.solidDc;
  const glow=(x,y)=>{if(!lights.some(l=>Math.abs(l[0]-x)+Math.abs(l[1]-y)<3))lights.push([x,y])};
  const brazier=(x,y)=>{const q=near(x,y,1);if(q&&tryDc('wm_brazier',q[0],q[1],{block:true,walk:false,sc:.8})){lights.push([q[0],q[1]]);return true}return false};
  // braziers: the four corners of the square's middle, the crossroads, the gate and the end of Bell Lane
  [[33,36],[37,36],[20,36],[53,36],[57,36],[64,36],[10,36],[20,60],[53,60],[57,22]].forEach(([x,y])=>{const dy=(y===36)?(hs(x,y,71)<.5?-1:1):0;brazier(x,y+dy)});
  // the west end of Candle Street: a stone arch, shut, with a lamp either side, so that the street ends in something
  {const ax=3,ay=36;
   if(IMG.gy_arch&&!decor.some(d=>d.x===ax&&d.y===ay)){decor.push({k:'gy_arch',x:ax,y:ay,block:true,walk:false,deco:false,sc:1.25,npc:'sa_n_westarch'});C.used.add(ax+','+ay)}
   for(const y of [35,37])tryDc('wm_cage_lantern',4,y,{sc:1.3});lights.push([4,35],[4,37])}
  // a dead orchard behind the north houses: rows of dead trees with wide gaps, then a ring of gravestones
  for(let row=0;row<3;row++)for(let x=6+row;x<=26;x+=4){const y=8+row*5;solidDc(((x+row)%3===0)?'gy_yew':'gy_dead',x,y,{sc:.85+hs(x,y,73)*.3})}
  // a small churchyard in the north east: a fence ring and stones in rows with a cross in the middle
  {const cx=47,cy=9;for(let x=cx-5;x<=cx+5;x+=2){solidDc('gy_fence',x,cy-4,{sc:.85});solidDc('gy_fence',x,cy+4,{sc:.85})}
   for(let y=cy-2;y<=cy+2;y+=2){for(const x of [cx-3,cx-1,cx+1,cx+3])if(!(x===cx-1&&y===cy)&&!(x===cx+1&&y===cy))solidDc(['gy_stone1','gy_slab','gy_lean','gy_wcross','gy_stone2'][(x+y)&3],x,y,{sc:.75})}
   solidDc('gy_ccross',cx,cy,{sc:1.1});solidDc('gy_yew',cx+6,cy+1,{sc:1});glow(cx,cy-3);tryDc('gy_candles',cx,cy+2,{sc:.6});}
  // the burning ground in the west: a heap of mounds, a brazier and rakes, where the first dead were put
  {const cx=10,cy=26;for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2],[-3,2],[3,-2]])tryDc('gy_mound',cx+dx,cy+dy,{block:true,walk:false,sc:.9});
   brazier(cx,cy);for(const [dx,dy] of [[-1,1],[1,-1],[3,1]])tryDc('gy_bones',cx+dx,cy+dy,{sc:.8});tryDc('wm_tools',cx-4,cy,{block:true,walk:false,sc:.9})}
  // character at the houses that are not shops: a ladder, a woodpile, a bucket and rope, a tool stand, a banner or a shrine against the wall
  const CH=['wm_ladder','wm_crate','wm_tools','hl_p_banner','wm_barrel_tall','wm_noticeboard','gy_rose','hl_p_chains','wm_keg'];
  for(const h of houses){if(h.spk||h.home)continue;if(!h.front)continue;const [fx,fy]=h.front,hz=(h.face==='N'||h.face==='S');
    const k=CH[(hs(h.x0,h.y0,81)*CH.length)|0];const s=hs(h.x0,h.y0,82)<.5?1:-1;
    const cells=[[hz?fx+s:fx,hz?fy:fy+s],[hz?fx-s:fx,hz?fy:fy-s]];
    for(const [x,y] of cells){if(!free(x,y))continue;const tall=/ladder|banner|chains|noticeboard/.test(k);
      if(tryDc(k,x,y,tall?{sc:.85}:{block:true,walk:false,sc:.8})){break}}}
}
function used(C,x,y){return C.used.has(x+','+y)}
khNpc('sa_n_westarch','The west arch',null,()=>say('A stone arch at the west end of Candle Street, bricked up to the keystone. Chalked on the bricks, in many hands, are the names of people who went through before it was closed. The last name is not finished.',[BYE]));
