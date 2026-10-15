/* ==========================================================================
   THE QUAY OF OLDHAVEN (level 304). The harbour of the king's city, where the Dawn Walker ties up after the crossing of the Narrow Sea.
   A small paved quay under the great grey wall of the city, with the castle looming over the gate. Five piers run out into the water with
   big ships moored between them. Fishermen sell the catch from stalls to a crowd, soldiers stand on every corner, dogs trot about, birds
   wheel overhead, and flags in the blue and white of Oldhaven fly from every pole. Six buildings along the sides have doors that open.
     6700..6705 the quay's shops and inns
   ========================================================================== */
const OQ={W:80,H:70,ID:304,ROOM0:6700,CX:40};
const OQ_PIC={ // key -> [sheet picture, width in cells]  (the height follows the picture)
  ship0:['kh_oqships_0',8.5],ship1:['kh_oqships_1',8],ship2:['kh_oqships_2',8.5],
  flag0:['kh_oqflags_0',2.4],flag1:['kh_oqflags_1',2.8],flag2:['kh_oqflags_2',1.5],flag3:['kh_oqflags_3',2.1],flag4:['kh_oqflags_4',2.9],flag5:['kh_oqflags_5',3.8],
  dog0:['kh_oqdogs_0',.68],dog1:['kh_oqdogs_1',.5],dog2:['kh_oqdogs_2',.6],dog3:['kh_oqdogs_3',.4],dog4:['kh_oqdogs_4',.42],dog5:['kh_oqdogs_5',.5],
  stall:['kh_oqstuff_0',1.7],fcrate:['kh_oqstuff_1',.75],fbarrel:['kh_oqstuff_2',.55],frack:['kh_oqstuff_3',1.0],fbasket:['kh_oqstuff_4',.55],fnet:['kh_oqstuff_5',.9],
  rope:['kh_oqstuff_6',.6],anchor:['kh_oqstuff_7',.7],cargo:['kh_oqstuff_8',.9],sacks:['kh_oqstuff_9',.65],bollard:['kh_oqstuff_10',.5],lantern:['kh_oqstuff_11',.4]
};
function oqAlias(){for(const k in OQ_PIC){const [n,w]=OQ_PIC[k],im=IMG[n];if(im){IMG['oq_'+k]=im;NPC_H['oq_'+k]=w*im.height/im.width}}}
function oqFloor(){ // smooth pale stone for the quay
  if(FLOORS.quayStone)return;const im=IMG.kh_oqstone_0;FLOORS.quayStone=im?dsPaintedTex(im):(FLOORS.pale||FLOORS.cobble);
}
function oqFace(id,fb){return (typeof KH_KEEPERS!=='undefined'&&KH_KEEPERS[id]&&KH_KEEPERS[id].face)||fb}

/* ---- the people of the quay ---- */
const OQ_FOLK=[
  {id:'oq_sailor',n:'A sailor',face:'kh_oqmen_0',sc:1,lines:["Three months out of Saltbarrow, and the ground still moves. Do not stand too close, I might lean.","The Narrow Sea is not narrow. Whoever named it had never sailed it, or had a sense of humour.","They say the Kraken sleeps in the deep water. I say it is merely very patient."]},
  {id:'oq_docker',n:'A stevedore',face:'kh_oqmen_1',sc:1.04,lines:["Forty sacks a ship, six ships a week, and nobody ever asks about my back.","Mind the ropes. Mind the crates. Mind the gulls. The gulls are the worst.","If you are looking for work, ask at the Customs House. If you are looking for trouble, the Captain's Table."]},
  {id:'oq_captain',n:'A ship captain',face:'kh_oqmen_2',sc:1.06,lines:["Captain of the Silver Marten, and nothing in this harbour is faster. Ask the Marten.","I take wool out and wine in, and the Crown takes its share of both. I have given up complaining. It is easier to give up sailing.","That ship at the end of the pier, with the gull on the prow. Is she yours? She is the talk of the quay."]},
  {id:'oq_deckhand',n:'A deckhand',face:'kh_oqmen_3',sc:.92,lines:["I have mopped this deck four times today. The gulls do it on purpose.","Next year I will be a mate. Next year I will not carry the bucket.","Is it true you came across the whole sea? I was sick on the short crossing to the island."]},
  {id:'oq_harbourm',n:'The harbourmaster',face:'kh_oqmen_4',sc:1.04,lines:["Pier fees are two silver a night, five for the big ones. Yes, even for yours. I do not make exceptions, and the Crown does not allow them.","Every ship that comes in has to be counted, weighed and recorded. Yours has been recorded. Several times. Please stop making me do it.","The gate opens at noon. The herald will say so. I will say so. The gulls will say so."]},
  {id:'oq_oldfisher',n:'An old fisherman',face:'kh_oqmen_5',sc:1,lines:["Forty years on this quay, and I have caught three fish that mattered. The rest were just fish.","The sea gives and the sea takes. Mostly it takes, but it lets you keep the herring.","Do not fish off the end of the east pier. Something takes the bait. Something big."]},
  {id:'oq_fisher1',n:'A fisherman',face:oqFace('yr_fisher1','kh_yfolk2_0'),sc:1,lines:["Herring were thick this morning. I sold the lot before the first bell.","My wife says I smell of fish. I say that is the smell of a living.","The soldiers buy the most. Soldiers eat like a flood."]},
  {id:'oq_fisher2',n:'A fisherman',face:oqFace('yr_fisher2','kh_yfolk2_3'),sc:1,lines:["A net is a promise to the sea. The sea does not keep its promises.","I mend while I wait. Mending is the only part of the trade that never fails.","Bring a cat to the quay and you will make friends. The dogs make enemies."]},
  {id:'oq_fisher3',n:'A net-mender',face:oqFace('yr_net','kh_yfolk3_0'),sc:1,lines:["Every hole is a fish that got away. I take it personally.","This net is older than the king. It has caught more than he has.","Hold the end for me, would you? No, the other end. Thank you."]}
];
OQ_FOLK.forEach(f=>khNpc(f.id,f.n,f.face,()=>yrLines(f.id,f.lines),{sc:f.sc}));
const OQ_WORK=['oq_sailor','oq_docker','oq_deckhand','oq_oldfisher','oq_fisher1','oq_fisher2','oq_fisher3','oq_captain'];
const OQ_BUYERS=['oh_f_baker','oh_f_cook','oh_f_maid','oh_f_fishwife','oh_f_noble','oh_f_lady','oh_f_boy','oh_f_friar','oh_f_clerk','oh_f_monk'];

/* ---- the shops of the quay ---- */
KH_STOCK.fishmonger=()=>[['herring',18],['bread',10],['cheese',8],['pie',6],['ale',8],['water',12],['sausage',6]];
khShop('oq_fm1','Marta, the fishwife','kh_ohfolk2_0',"Marta's Fish Stall",'Herring, mackerel and whatever the boats got. If it is still moving, it is fresh. If it is not, it is smoked.','fishmonger');
khShop('oq_fm2','Big Hobb, the fishmonger','kh_ohfolk1_0',"Hobb's Stall",'Three hundred herring on ice, and I know every one of them by name. Buy two and I will introduce you.','fishmonger');
khShop('oq_fm3','Pol, the quay cook','kh_ohfolk2_2','The Quay Kitchen','Fried fish in a paper cone, a heel of bread and a splash of vinegar. The soldiers eat first, then everyone else.','fishmonger');
khShop('oq_fishhall','Warrick, of the Fish Hall','kh_oqmen_4',"The Fishmonger's Hall",'Every boat on the quay sells to me, and I sell to the castle. If the king eats fish today, it came through that door.','fishmonger');
khShop('oq_chandler','Tilda, ship chandler','kh_ohfolk1_5','The Anchor and Rope','Rope, tar, torches and lanterns. Everything a ship needs and a good deal that a party does.','general');
khShop('oq_armoury',"Ser Aldred, the ship's armourer",'kh_ohsold1_3',"The Ship's Armoury",'Cutlasses, boarding axes and round shields. Bring a blade you are fond of and I will find you a better one.','arms');
khInn('oq_inn1',"Hester, of the Mariners' Rest",'kh_ohfolk2_5',"The Mariners' Rest",20,"The Mariners' Rest. A bed that does not move, a bowl of stew and a window on the water. Twenty gold a room.");
khInn('oq_inn2',"Barnaby, of the Captain's Table",'kh_oqmen_2',"The Captain's Table",30,"The Captain's Table. Best chowder on the quay, a fire that never goes out and rooms upstairs, thirty gold. Mind the parrot.");
khNpc('oq_customs','Ostler Wend, customs officer','kh_oqmen_4',()=>say("The Customs House. Every cask, bale and keg that comes off a ship is entered in my book. You are not carrying anything dutiable? Of course not. Nobody ever is.",[BYE]));

/* ---- the quay ---- */
const OQ_HOUSES=[
  {x0:8,x1:20,y0:10,y1:17,face:'E',wh:2.7,name:"The Fishmonger's Hall",room:'shop',keeper:'oq_fishhall',pat:0,roof:0,floor:'wood',sp:1},
  {x0:8,x1:17,y0:18,y1:24,face:'E',wh:2.3,name:'The Anchor and Rope',room:'shop',keeper:'oq_chandler',pat:1,roof:1,floor:'wood',sp:1},
  {x0:8,x1:20,y0:25,y1:31,face:'E',wh:3.0,name:"The Mariners' Rest",room:'inn',keeper:'oq_inn1',pat:0,roof:3,floor:'wood',sp:1},
  {x0:59,x1:71,y0:10,y1:16,face:'W',wh:3.0,name:'The Customs House',room:'hall',keeper:'oq_customs',pat:0,roof:0,floor:'cobble',tower:1},
  {x0:62,x1:71,y0:17,y1:23,face:'W',wh:2.5,name:"The Ship's Armoury",room:'shop',keeper:'oq_armoury',pat:1,roof:2,floor:'cobble',sp:1},
  {x0:59,x1:71,y0:24,y1:31,face:'W',wh:2.8,name:"The Captain's Table",room:'inn',keeper:'oq_inn2',pat:0,roof:4,floor:'wood',sp:1}
];
const OQ_PIERS=[[10,12,54],[22,24,58],[39,41,62],[55,57,56],[68,70,50]]; // x0, x1, last row
let OQ_DOGS=[];
function quayBuild(){
  if(LEVELS[OQ.ID])return;
  ohAlias();oqAlias();isleFloors();oqFloor();
  const W=OQ.W,H=OQ.H,N=W*H,hs=(a,b,c)=>hash2(a,b,c);
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N),fm=new Array(N).fill('4');
  const sky=[],decor=[],scenery=[],lights=[],used=new Set();
  const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
  const SHORE=34;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;
    if(y<=SHORE){h[i]=.3;fm[i]='0'}
    else if(y===SHORE+1){h[i]=.1;fm[i]='3'}
    else{h[i]=-.2+.03*(tsmooth(x/6,y/6,77)-.5);fm[i]='4';block[i]=1}
  }
  /* ---- the city wall, the castle behind it and the gate between two towers ---- */
  const WALL=3.4,wPlain=ch(TM.make('plain',0,WALL).gid),wSlit=ch(TM.make('slit',0,WALL).gid),wDark=ch(TM.make('plain',1,WALL).gid);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(y<=9||((x<6||x>73)&&y<=SHORE+1)){const face=y===9||x===5||x===74;solid(x,y,face&&(x+y)%4===0?wSlit:(x*7+y*3)%11===0?wDark:wPlain)}
  }
  const GX=OQ.CX,tWh=4.6;
  {const pg=TM.make('gate',0,3.4,'kh_ohgate1_0');T_DOORS.oqportc=pg.tex;const gc=String.fromCharCode(nextCh++);chars[gc]=31;
    const tp=ch(TM.make('plain',0,tWh).gid),ts=ch(TM.make('slit',0,tWh).gid);
    for(let y=8;y<=9;y++){for(let x=GX-1;x<=GX+1;x++)solid(x,y,gc);for(const xs of [[GX-5,GX-2],[GX+2,GX+5]])for(let x=xs[0];x<=xs[1];x++)solid(x,y,y===9&&x%2===0?ts:tp)}
    sky.push({x:GX-3.5,y:9.6,k:'kh_ohtower1_3',w:7,z:tWh-.05,big:1},{x:GX+3.5,y:9.6,k:'kh_ohtower1_3',w:7,z:tWh-.05,big:1});
    sky.push({x:GX-3.5,y:9.6,k:'kh_oqflags_0',w:2.6,z:tWh+7.2,big:1},{x:GX+3.5,y:9.6,k:'kh_oqflags_3',w:2.4,z:tWh+7.2,big:1});
  }
  // the castle looming over the gate: the keep, great round towers and long spires, all standing on the wall
  sky.push({x:GX,y:4,k:'kh_ohkeep1_0',w:62,z:WALL-.4,big:1});
  for(const [x,y,k,w] of [[14,6,'kh_ohtower1_3',9],[66,6,'kh_ohtower1_3',9],[26,5,'kh_ohtower1_0',5.4],[54,5,'kh_ohtower1_1',5.4],[32,6,'kh_ohtower1_2',5],[48,6,'kh_ohtower1_2',5],[8,7,'kh_ohtower1_4',4],[72,7,'kh_ohtower1_5',4],[20,3,'kh_ohtower1_0',6],[60,3,'kh_ohtower1_1',6]])sky.push({x,y,k,w,z:WALL-.05,big:1});
  for(const [x,y,w,f] of [[40,1,5.6,0],[14,6,3.2,3],[66,6,3.2,3],[26,5,2.4,1],[54,5,2.4,1]])sky.push({x,y,k:'kh_oqflags_'+f,w,z:WALL+(f===0?24:11),big:1});
  /* ---- the buildings along the sides: six of them, all different, each with a door that opens ---- */
  OQ_HOUSES.forEach((b,k)=>{
    const w=b.x1-b.x0+1,d=b.y1-b.y0+1,front=(x,y)=>b.face==='E'?x===b.x1:x===b.x0,ym=b.y0+(d>>1);
    const plain=ch(TM.make('plain',b.pat,b.wh).gid),win=ch(TM.make(b.sp?'shopfront':'window',b.pat,b.wh).gid),side=ch(TM.make('window',b.pat,b.wh).gid);
    const dtile=TM.make('door',b.pat,b.wh),dgid=KH_NEXT_GID++;T_TILE[dgid]=dtile.tex;
    b.id=OQ.ROOM0+k;b.door=b.face==='E'?[b.x1,ym]:[b.x0,ym];b.front=b.face==='E'?[b.x1+1,ym]:[b.x0-1,ym];b.out=b.face==='E'?1:3;b.wall=b.face==='E'?[-1,0]:[1,0];
    const st=b.room==='inn'?[6,7]:b.room==='hall'?[5,6]:[5,6];KH_DOOR[dgid]={lvl:b.id,at:{x:st[0],y:st[1],f:0}};
    for(let y=b.y0;y<=b.y1;y++)for(let x=b.x0;x<=b.x1;x++){
      let c;if(x===b.door[0]&&y===b.door[1])c=ch(dgid);else if(front(x,y))c=win;else c=(x+y)%3===0?side:plain;
      solid(x,y,c);fm[y*W+x]='1';
    }
    sky.push({x:(b.x0+b.x1+1)/2,y:(b.y0+b.y1+1)/2,k:'kh_ohroof1_'+b.roof,w:d+.6,z:b.wh-.03});
    if(b.tower)sky.push({x:(b.x0+b.x1+1)/2+2,y:b.y0+2,k:'kh_ohtower1_2',w:3.6,z:b.wh-.03},{x:(b.x0+b.x1+1)/2+2,y:b.y0+2,k:'kh_oqflags_1',w:2.4,z:b.wh+7.6});
    else if(k===0||k===2)sky.push({x:b.x0+2.5,y:(b.y0+b.y1)/2,k:'kh_ohtower1_'+(k?4:5),w:2.6,z:b.wh-.03});
    LEVEL_NAMES[b.id]=b.name;
  });
  /* ---- the piers: five of them, with the water between full of ships ---- */
  for(const [x0,x1,y1] of OQ_PIERS)for(let y=SHORE+1;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*W+x;block[i]=0;h[i]=.08;rk[i]=0;fm[i]='2'}
  // helpers
  const free=(x,y)=>x>5&&y>9&&x<74&&y<=SHORE+1&&rows[y][x]==='.'&&!block[y*W+x]&&!used.has(x+','+y);
  const onPier=(x,y)=>y>SHORE&&fm[y*W+x]==='2'&&!used.has(x+','+y);
  const dc=(k,x,y,o)=>{used.add(x+','+y);const d=Object.assign({k,x,y,block:false,walk:true,deco:true},o||{});decor.push(d);return d};
  const tryDc=(k,x,y,o)=>{if(free(x,y)||onPier(x,y))return dc(k,x,y,o);return null};
  const walk=(k,x,y,o)=>{used.add(x+','+y);const d=Object.assign({k,x,y,block:false,walk:true},o||{});decor.push(d);return d};
  const near=(x,y,rad)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(free(x+dx,y+dy)||onPier(x+dx,y+dy))return [x+dx,y+dy]}return null};
  const person=(id,x,y,rad)=>{const kp=KH_KEEPERS[id];if(!kp)return null;const q=near(x,y,rad||3);if(!q)return null;walk(khFaceKey(kp.face),q[0],q[1],{npc:id,sc:kp.sc||1});return q};
  const flag=(x,y,k)=>tryDc('oq_flag'+(k===undefined?((hs(x,y,5)*5)|0):k),x,y);
  // ships in the water: the Dawn Walker at the end of the long pier, and the big ships moored between the piers
  decor.push({k:'yar_ship_dawn',x:OQ.CX,y:65,block:true,deco:false,npc:'yr_ship'});used.add(OQ.CX+',65');
  const SHIPS=[['oq_ship0',17,51,1],['oq_ship1',31,55,1],['oq_ship2',47,52,1],['oq_ship0',63,46,.9],['oq_ship2',76,57,.8],['oq_ship1',6,60,.85],['oq_ship2',16,66,.8],['oq_ship0',55,67,.8],['oq_ship1',70,63,.85],['oq_ship2',26,66,.7]];
  for(const [k,x,y,sc] of SHIPS){decor.push({k,x,y,block:true,deco:true,sc});used.add(x+','+y)}
  for(const [k,x,y] of [['yar_boat_fish',8,45],['yar_boat_row',14,42],['yar_boat_fish',19,44],['yar_boat_dhow',27,44],['yar_boat_row',33,46],['yar_boat_fish',45,41],['yar_boat_row',51,45],['yar_boat_dhow',60,41],['yar_boat_fish',65,52],['yar_boat_row',73,45],['yar_boat_fish',36,50],['yar_boat_row',43,58],['yar_boat_row',13,37],['yar_boat_fish',29,38],['yar_boat_row',53,38],['yar_boat_fish',66,39]]){if(IMG[k]){decor.push({k,x,y,block:true,deco:true});used.add(x+','+y)}}
  // the lanterns: iron posts along the quay edge and round the plaza
  const lamp=(x,y)=>{if(tryDc('lamp',x,y))lights.push([x,y])};
  for(let x=23;x<=57;x+=5)lamp(x,SHORE);
  for(let x=24;x<=56;x+=8){lamp(x,12);lamp(x,31)}
  for(let y=14;y<=30;y+=8){lamp(22,y);lamp(58,y)}
  for(const [x0,x1,y1] of OQ_PIERS)for(let y=SHORE+4;y<=y1-1;y+=7){lamp(x0,y);lamp(x1,y)}
  // flags in the blue and white of Oldhaven: on tall poles along the edge, at the corners, along the piers and round the plaza
  for(let x=22;x<=58;x+=6)flag(x,SHORE-1);
  for(const [x,y] of [[22,11],[58,11],[22,31],[58,31],[30,10],[50,10]])flag(x,y,(x+y)%3?0:3);
  for(const [x0,x1,y1] of OQ_PIERS){flag(x0,y1-1);flag(x1,y1);flag(x0,SHORE+6);flag(x1,SHORE+6);if(y1>54){flag(x0,SHORE+14);flag(x1,SHORE+14)}}
  for(const [x,y] of [[26,20],[34,26],[46,26],[54,20],[40,15],[40,28],[30,15],[50,15]])tryDc('oq_flag5',x,y);
  // the fish market on the west of the plaza: stalls with their keepers, crates, barrels, drying racks, baskets, nets
  const stalls=[[26,13,'oq_fm1'],[26,19,'oq_fm2'],[26,25,'oq_fm3'],[54,18,'oq_fm3b']];
  for(const [sx,sy,id] of stalls){
    dc('oq_stall',sx,sy,{block:true,walk:false});
    if(id==='oq_fm3b'){person('oh_f_baker',sx,sy-1,1)}else person(id,sx,sy-1,1);
    for(const [dx,dy,k] of [[-2,0,'oq_fcrate'],[2,0,'oq_frack'],[-2,1,'oq_fbasket'],[2,1,'oq_fbarrel'],[0,2,'oq_fnet']])tryDc(k,sx+dx,sy+dy);
    for(let q=0;q<7;q++){const a=hs(sx,sy,q+60)*TAU,r=2+hs(sx,sy,q+70)*3,id2=OQ_BUYERS[((hs(sx,sy+q,81)*OQ_BUYERS.length)|0)],kp=KH_KEEPERS[id2];const p=near(Math.round(sx+Math.cos(a)*r),Math.round(sy+3+Math.sin(a)*r*.7),2);if(p&&kp)walk(khFaceKey(kp.face),p[0],p[1],{npc:id2,sc:kp.sc||1})}
  }
  // cargo and gear on the quay: crates, sacks, rope, anchors and bollards at the edge and by the Customs House
  for(let q=0;q<26;q++){const x=23+((hs(q,1,90)*36)|0),y=SHORE-((hs(q,2,90)*2)|0);const ks=['oq_cargo','oq_sacks','oq_rope','oq_bollard','oq_anchor','oq_fbarrel','oq_fcrate','oq_fnet'];tryDc(ks[(hs(q,3,90)*ks.length)|0],x,y)}
  for(let q=0;q<14;q++){const x=47+((hs(q,4,91)*11)|0),y=11+((hs(q,5,91)*18)|0);const ks=['oq_cargo','oq_sacks','oq_rope','oq_fcrate','oq_fbarrel'];tryDc(ks[(hs(q,6,91)*ks.length)|0],x,y)}
  for(const [x0,x1,y1] of OQ_PIERS)for(let y=SHORE+3;y<=y1-2;y+=5){const k=['oq_bollard','oq_rope','oq_sacks','oq_cargo','oq_fcrate'][(hs(x0,y,92)*5)|0];tryDc(k,hs(x0,y,93)<.5?x0:x1,y)}
  // the people: soldiers everywhere, the harbour folk, fishermen, sailors, dockers and captains
  let sn=0;const sold=()=>OH_SOLDIER[(sn++)%OH_SOLDIER.length];
  const soldier=(x,y)=>{const id=sold(),kp=KH_KEEPERS[id];const q=near(x,y,1);if(q&&kp)walk(khFaceKey(kp.face),q[0],q[1],{npc:id,sc:kp.sc})};
  for(const x of [35,37,39,41,43,45]){soldier(x,11);}
  for(let x=24;x<=57;x+=4)soldier(x,SHORE-1);
  for(let x=28;x<=52;x+=8)soldier(x,12);
  for(const [x,y] of [[24,16],[24,22],[24,28],[56,13],[56,22],[56,29],[34,20],[46,20],[40,22],[36,28],[44,28]])soldier(x,y);
  for(const [x0,x1,y1] of OQ_PIERS){soldier(x0+1,SHORE+3);soldier(x0+1,y1-2)}
  const named=[['oh_herald',39,12],['oh_guard',37,11],['oh_guard',43,11],['oh_guard2',36,12],['oh_guard2',44,12],['oq_harbourm',39,31],['oq_captain',42,33]];
  for(const [id,x,y] of named)person(id,x,y,3);
  for(let q=0;q<46;q++){const x=23+((hs(q,11,95)*36)|0),y=11+((hs(q,12,95)*23)|0),id=hs(q,13,95)<.55?OQ_WORK[(hs(q,14,95)*OQ_WORK.length)|0]:OQ_BUYERS[(hs(q,15,95)*OQ_BUYERS.length)|0];person(id,x,y,2)}
  for(const [x0,x1,y1] of OQ_PIERS)for(let q=0;q<4;q++){const id=OQ_WORK[(hs(x0,q,96)*OQ_WORK.length)|0];person(id,x0+((q&1)?1:0),SHORE+4+q*Math.max(3,((y1-SHORE-6)/4)|0),2)}
  // dogs: lots of them, trotting about the quay
  OQ_DOGS=[];
  for(let q=0;q<30;q++){const x=7+((hs(q,21,97)*66)|0),y=11+((hs(q,22,97)*24)|0);const p=near(x,y,3);if(!p)continue;const k='oq_dog'+((hs(q,23,97)*6)|0);const d=walk(k,p[0],p[1],{deco:true});d.dg={ph:hs(q,24,97)*TAU,sx:.25+hs(q,25,97)*.35,ax:.8+hs(q,26,97)*1.8,ay:.4+hs(q,27,97)*1.2};OQ_DOGS.push(d)}
  // gulls standing on the bollards, the roofs of the piers and the quay edge
  for(let q=0;q<46;q++){const x=7+hs(q,31,98)*66,y=(hs(q,32,98)<.6?SHORE-.2+hs(q,33,98)*1.4:11+hs(q,34,98)*22),cx=x|0,cy=y|0;if(!free(cx,cy)&&!onPier(cx,cy))continue;scenery.push({k:'yar_gull_stand',wx:x,wy:y,sc:.8+hs(q,35,98)*.4,decor:{k:'yar_gull_stand',walk:true,x:cx,y:cy}})}
  // signs on the doors that open
  for(const b of OQ_HOUSES){const sx=b.front[0],sy=b.front[1]+1;decor.push({k:'sign_'+b.keeper,x:sx,y:sy,block:false,wd:b.wall,txt:[b.name.toUpperCase(),'']});}
  /* ---- the level ---- */
  const lv={rows:rows.map(r=>r.join('')),start:{x:OQ.CX,y:SHORE+2,f:0},enemies:[],items:[{k:'potion',x:44,y:SHORE+2}],decor,scenery,sky,fmap:null,
    floorSet:['quayStone','cobble','wood','bluesand','bluewater','isleSandDk'],floor:'quayStone',ceil:'cloud',day:.98,outdoor:true,amb:.9,name:'Oldhaven Quay',label:'Oldhaven Quay',noExtras:true,diff:25,
    tele:{x:56,y:32},ceilH:5.2,chars,lights,portals:[]};
  lv.portals[1]={to:305,x:74,y:141,f:0,tex:'oqportc',req:'oldhavenOpen',lock:'The great gate of Oldhaven is barred until noon. Speak to the herald.'};
  lv.mapNames=[{t:'The Gate of Oldhaven',x:40,y:12,k:'place'},{t:'Fish Market',x:26,y:21,k:'place'},{t:'The Great Quay',x:40,y:28,k:'place'},{t:'Customs House',x:65,y:13,k:'lane'},{t:'The Piers',x:40,y:50,k:'place'}];
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}lv.fmap=fmap;
  LEVELS[OQ.ID]=lv;LEVEL_NAMES[OQ.ID]='Oldhaven Quay';TERRS[OQ.ID]=yarTerrain(W,H,h,rk,block);
  OQ_HOUSES.forEach((b,k)=>{
    const id=b.id;
    KH_LAZY[id]=()=>{
      if(LEVELS[id])return;
      const bb={id:'oq'+k,name:b.name,room:b.room,keeper:b.keeper,wallImg:'kh_ohwall1_'+b.pat,floor:b.floor};
      const R=khRoom(bb,id,{to:OQ.ID,x:b.front[0],y:b.front[1],f:b.out});LEVELS[id]=R.level;LEVEL_NAMES[id]=b.name;
    };
  });
}
for(let i=0;i<10;i++){const id=OQ.ROOM0+i,stub=()=>{quayBuild();if(!LEVELS[id]&&KH_LAZY[id]&&KH_LAZY[id]!==stub)KH_LAZY[id]()};KH_LAZY[id]=stub}
OQ_HOUSES.forEach((b,k)=>{LEVEL_NAMES[OQ.ROOM0+k]=b.name});
/* the dogs trot back and forth, and more birds wheel over the quay */
(function(){const _t=seaTick;seaTick=function(dt){_t(dt);if(LEVEL!==OQ.ID)return;const t=G.time;for(const d of OQ_DOGS){const g=d.dg;if(!g)continue;d.ox=Math.sin(t*g.sx+g.ph)*g.ax;d.oy=Math.cos(t*g.sx*.7+g.ph)*g.ay}}})();
(function(){const _y=yrSprites;yrSprites=function(out){_y(out);if(LEVEL!==OQ.ID)return;const t=G.time,up=IMG.yar_gull_up,dn=IMG.yar_gull_down;if(!up||!dn)return;
  for(let i=0;i<40;i++){const cx=14+hash2(i,1,201)*52,cy=14+hash2(i,2,201)*40,r=2+hash2(i,3,201)*6,sp=.35+hash2(i,4,201)*.5,a=t*sp+i*2.3,img=((t*3.4+i)|0)%2?up:dn;
    out.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a*1.1)*r*.8,img,w:.32,bob:1.4+(i%5)*.4+Math.sin(t*1.7+i)*.18,decor:{walk:true,k:'yar_gull_fly'}})}}})();
// the gate guards and the herald of the quay are the soldiers of Oldhaven
for(const [id,face] of [['oh_guard','kh_ohsold1_0'],['oh_guard2','kh_ohsold1_1'],['oh_herald','kh_ohsold1_5']]){if(typeof KH_KEEPERS!=='undefined'&&KH_KEEPERS[id]){KH_KEEPERS[id].face=face;KH_KEEPERS[id].sc=1.06}if(NPCS[id])NPCS[id].img=face}
