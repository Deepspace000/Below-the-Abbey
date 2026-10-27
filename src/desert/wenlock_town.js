/* ==========================================================================
   WENLOCK: THE TOWN (level 496), a peaceful English country market town in the western kingdoms, 100 by 100.
   One little High Street runs east to west through a market square; three lanes leave it (Church Lane and Green Lane to the north, Mill Lane to the south),
   a dirt track runs along the back, a brook with an old stone bridge crosses the south, and the village green with its duck pond lies south west of the square.
   The party comes in from the Maze of Gardens through the lych-gate at the east end (WK.WSTART) and the road west is signposted but not yet open.
   Every road is one square wide and nothing stands in it; houses are two by two (the shops and the inn three across); each has its own painted roof.
   ========================================================================== */
WK.WSTART={x:95,y:50,f:3};
const WL_W=100,WL_H=100,WL_Y=50;       // High Street runs along y=50
/* ---- the special buildings: name, kind of interior, keeper (named here; the interior builder makes the shopkeeper), wall height, wall style, roof, width across the front ---- */
const WL_SPEC={
  inn:{name:'The Plough and Pigeon',kind:'inn',keeper:'Joss Pluckrose',wh:2.9,sty:'timber',roof:'tile',w:3},
  smith:{name:"Fenn's Forge",kind:'smith',keeper:'Fenn Ironside',wh:2.4,sty:'flint',roof:'slate',w:3},
  bakery:{name:"Crumb's Bakery",kind:'bakery',keeper:'Goodwife Crumb',wh:2.4,sty:'honey',roof:'thatch',w:3},
  butcher:{name:"Hodge the Butcher",kind:'butcher',keeper:'Hodge',wh:2.4,sty:'brick',roof:'tile',w:3},
  library:{name:'The Wenlock Library',kind:'library',keeper:'Mr Pemberton',wh:2.7,sty:'honey',roof:'slate',w:3},
  scrolls:{name:"Quill's Scrolls",kind:'scroll',keeper:'Ambrose Quill',wh:2.5,sty:'timber',roof:'stone',w:3},
  tailor:{name:"Madame Lacey, Tailor",kind:'tailor',keeper:'Madame Lacey',wh:2.4,sty:'white',roof:'tile2',w:3},
  armour:{name:"Blackwood's Armoury",kind:'armour',keeper:'Old Sergeant Blackwood',wh:2.4,sty:'flint',roof:'dark',w:3},
  weapons:{name:"Hale and Daughters, Weaponsmiths",kind:'weapons',keeper:'Osric Hale',wh:2.4,sty:'brick',roof:'slate',w:3},
  general:{name:"Dibble's General Store",kind:'general',keeper:'Mrs Dibble',wh:2.5,sty:'black',roof:'tile',w:3},
  green:{name:"Hargreaves the Greengrocer",kind:'greengrocer',keeper:'Pip Hargreaves',wh:2.3,sty:'white',roof:'thatch2',w:3},
  potion:{name:"Holt's Potions and Cordials",kind:'potion',keeper:'Mistress Verity Holt',wh:2.5,sty:'timber',roof:'plum',w:3},
  herbs:{name:"Old Bryony's Herb Shop",kind:'herb',keeper:'Old Bryony',wh:2.2,sty:'white',roof:'thatch',w:3},
  cooper:{name:"Hoop the Cooper",kind:'cooper',keeper:'Barnaby Hoop',wh:2.3,sty:'timber',roof:'shingle',w:3},
  chandler:{name:"Wick's Chandlery",kind:'chandler',keeper:'Wick',wh:2.3,sty:'honey',roof:'tile2',w:3},
  cobbler:{name:"Tom Heel, Cobbler",kind:'cobbler',keeper:'Tom Heel',wh:2.2,sty:'white',roof:'thatch2',w:3},
  almshouse:{name:'The Almshouse',kind:'almshouse',keeper:'Sister Maud',wh:2.3,sty:'honey',roof:'moss',w:3},
  school:{name:'Wenlock School',kind:'school',keeper:'Miss Larkin',wh:2.5,sty:'brick',roof:'slate',w:3},
  hall:{name:'The Village Hall',kind:'hall',keeper:'Clerk Fiddlesticks',wh:3.0,sty:'honey',roof:'stone',w:4},
  cellar:{name:'The Inn Cellar',kind:null,wh:1.6,sty:'flint',roof:'stone',w:2},
  granary:{name:'The Old Granary',kind:null,wh:2.0,sty:'black',roof:'tile',w:2}
};
/* ---- the lots. Each: [side, position along the road, width across the front, special or null].
   N and S are the two sides of High Street (x is the position); W and E are the two sides of a lane (y is the position); TN and TS the two sides of the back track. ---- */
const WL_LOTS=[
  ['N',6,2],['N',9,3,'smith'],['N',14,2],['N',17,3,'bakery'],['N',21,2],
  ['N',27,2],['N',30,3,'butcher'],['N',34,2],['N',37,2],
  ['N',58,3,'inn'],['N',62,2],['N',65,3,'library'],['N',69,2],['N',73,3,'scrolls'],['N',77,2],['N',80,2],['N',87,2],['N',90,3,'tailor'],
  ['S',6,2],['S',9,3,'armour'],['S',13,3,'weapons'],
  ['S',58,3,'general'],['S',62,2],['S',65,3,'green'],['S',74,2],['S',77,3,'potion'],['S',81,2],['S',84,3,'herbs'],['S',88,2],['S',91,2],
  ['MW',54,2],['MW',58,3,'cooper'],['MW',63,2],['MW',67,3,'chandler'],['MW',72,2],
  ['ME',54,2],['ME',57,3,'cobbler'],['ME',62,3,'almshouse'],['ME',67,2],['ME',71,3,'school'],
  ['CW',29,2],['CW',33,2],['CW',37,2],['CW',41,2],['CW',45,2],['CE',40,2],['CE',44,2],
  ['GW',22,2],['GW',28,2],['GW',35,2],['GW',41,2],['GE',21,2],['GE',26,2],['GE',32,2],['GE',38,2],['GE',43,2],
  ['TN',46,2],['TN',60,2],['TN',74,2],['TS',52,2],['TS',68,2]
];
const WL_BROOK=x=>x>=66&&x<=78?84:84+Math.round(1.6*Math.sin(x*.13+.7));  // the y of the first of the brook's two rows
const WL_SQUARE={x0:41,y0:45,x1:55,y1:55};
const WL_GREEN={x0:17,y0:56,x1:40,y1:80,pond:[24,66,29,71]};
const WL_CHURCH={x0:21,x1:28,y0:20,y1:25,door:[24,25]};
const WL_HALL={x0:25,x1:28,y0:33,y1:36};
const WL_TRACK={y:14,x0:38,x1:92};
const WL_ROAD=(x,y)=>y===WL_Y&&x>=3&&x<=96||(x===24&&y>=26&&y<=49)||(x===72&&y>=51&&y<=86)||(x===84&&y>=14&&y<=49)||(y===14&&x>=38&&x<=92)||(x===38&&y>=3&&y<=13);   // the last one is Blackbriar Lane, north to the gate of the witch's wood
/* where a lot stands and where its door is: x0..y1 are the wall cells, door the door tile, front the square outside it (in the road), out the way the party faces on leaving, wall the direction from the front square to the wall */
function wlLotRect(side,pos,w){
  let x0,y0,x1,y1,face;
  if(side==='N'){x0=pos;x1=pos+w-1;y0=WL_Y-2;y1=WL_Y-1;face='S'}
  else if(side==='S'){x0=pos;x1=pos+w-1;y0=WL_Y+1;y1=WL_Y+2;face='N'}
  else if(side==='MW'||side==='CW'||side==='GW'){const lx={MW:72,CW:24,GW:84}[side];x0=lx-2;x1=lx-1;y0=pos;y1=pos+w-1;face='E'}
  else if(side==='ME'||side==='CE'||side==='GE'){const lx={ME:72,CE:24,GE:84}[side];x0=lx+1;x1=lx+2;y0=pos;y1=pos+w-1;face='W'}
  else if(side==='TN'){x0=pos;x1=pos+w-1;y0=12;y1=13;face='S'}
  else{x0=pos;x1=pos+w-1;y0=15;y1=16;face='N'}
  return {x0,y0,x1,y1,face};
}
function wlLotDoor(h){
  const horiz=h.face==='N'||h.face==='S',span=horiz?h.x1-h.x0+1:h.y1-h.y0+1;
  const ci=horiz?h.x0+((span-1)>>1)+(span>=4&&hash2(h.x0,h.y0,13)<.5?1:0):h.y0+((span-1)>>1)+(span>=4&&hash2(h.x0,h.y0,13)<.5?1:0);
  if(h.face==='N'){h.door=[ci,h.y0];h.front=[ci,h.y0-1];h.out=0;h.wall=[0,1]}
  else if(h.face==='S'){h.door=[ci,h.y1];h.front=[ci,h.y1+1];h.out=2;h.wall=[0,-1]}
  else if(h.face==='E'){h.door=[h.x1,ci];h.front=[h.x1+1,ci];h.out=1;h.wall=[-1,0]}
  else{h.door=[h.x0,ci];h.front=[h.x0-1,ci];h.out=3;h.wall=[1,0]}
  return h;
}
/* every building of the town, in a fixed order; WL_HOUSES[k].id is the number of its interior level (7000 is the church) */
const WL_HOUSES=[];
{for(const [side,pos,w,sp] of WL_LOTS){const r=wlLotRect(side,pos,w);WL_HOUSES.push(Object.assign(r,{w,spk:sp||null,sp:sp?WL_SPEC[sp]:null}))}
 WL_HOUSES.push({x0:WL_HALL.x0,x1:WL_HALL.x1,y0:WL_HALL.y0,y1:WL_HALL.y1,face:'W',w:4,spk:'hall',sp:WL_SPEC.hall});
 let n=7001;for(const h of WL_HOUSES){wlLotDoor(h);h.id=n++}
}
/* the enterable buildings, for the interior builder (src/desert/wenlock_in_*.js): id = the level number of the interior; door = the door tile in the wall;
   front = the square outside the door in the town (level 496) where the party stands on coming out, and out = the way it faces (0 north, 1 east, 2 south, 3 west).
   kinds: inn, general, smith, armour, weapons, potion, herb, scroll, library, bakery, butcher, greengrocer, tailor, cobbler, chandler, cooper, hall, school, church, almshouse, house */
const WL_DOORS=[{id:7000,kind:'church',name:"Saint Wenna's Church",keeper:'Reverend Alder',door:{x:WL_CHURCH.door[0],y:WL_CHURCH.door[1]},front:{x:WL_CHURCH.door[0],y:WL_CHURCH.door[1]+1},out:2}];
for(const h of WL_HOUSES){if(h.spk==='cellar'||h.spk==='granary')continue;
  WL_DOORS.push({id:h.id,kind:h.sp&&h.sp.kind||'house',name:h.sp?h.sp.name:'A Cottage',keeper:h.sp?h.sp.keeper:null,door:{x:h.door[0],y:h.door[1]},front:{x:h.front[0],y:h.front[1]},out:h.out,w:h.w})}
/* the ten town quests of Wenlock, a chain of little stories, each handed on to the next person (the code is in wenlock_quests.js). The eighth sends the party down the town well
   (WK.WELLDOOR is the well's square; WK.WELLBACK where the party stands on climbing out). Its goal is the flag G.flags.wlWellDone: set by the well builder, or by the town on the party's
   return when the well builder's function wlWellQuestGoal() (optional) says the quest goal is met. The well opens when quest 8 is accepted (flag G.flags.wlWellOpen). */
const WL_QUESTS=[
  {id:'wlq1',giver:'Mayor Aldous Thistlewood',title:'A Proper Welcome',desc:"Take the mayor's note of welcome to Bartle the town crier, in the market square."},
  {id:'wlq2',giver:'Bartle the town crier',title:'Oyez, a Lost Cat',desc:'Find Marmalade, the ginger cat who has gone missing from among the market stalls.'},
  {id:'wlq3',giver:'Goody Prue',title:'The Missing Pie',desc:"Somebody has stolen the baker's pie. Ask Biscuit, the baker's dog, and follow the crumbs."},
  {id:'wlq4',giver:'Mrs Tanner',title:'The Wedding Ring',desc:'Mrs Tanner has lost her wedding ring on the village green. Ask the children, then search by the duck pond.'},
  {id:'wlq5',giver:'Constable Fudge',title:'A Quiet Word with Hob',desc:'Big Hob has been bullying the little ones on the green. Challenge him to a fair duel and teach him some manners.'},
  {id:'wlq6',giver:'Jack Joiner',title:'The Stuck Cart',desc:"Farmer Giles' hay cart is stuck in the lane, and the pushers are thirsty. Bring 3 mugs of ale."},
  {id:'wlq7',giver:'Curate Pettigrew',title:'A Poem for the Harvest',desc:'The curate needs a verse for the harvest service. Collect a line each from Old Walt, Jory the minstrel and Goody Prue.'},
  {id:'wlq8',giver:'Mrs Suds',title:'The Knocking in the Well',desc:'Something has been knocking at the bottom of the town well, and the bell-ringer\'s key has fallen in. Go down and find out what is there.',well:true},
  {id:'wlq9',giver:'Sexton Moss',title:'The Belfry Key',desc:'Take the belfry key to Sexton Moss in the churchyard, so that the harvest bell can be rung.'},
  {id:'wlq10',giver:'Mayor Aldous Thistlewood',title:'The Harvest Bell',desc:"Tell Lady Eleanor Ashby and Bartle the crier that the bell will ring, then go back to the mayor for the harvest feast."}
];
/* a roofed picture of a building over its walls: [new picture, fall-back, width factor] */
function wlRoofFor(name,h){
  const r=WL_ROOFS[name]||WL_ROOFS.tile||WL_ROOFS.red;return r||'kh_ohroof1_2';
}
function wlBuild(){
  if(LEVELS[WL.ID])return true;
  if(!WLART.ready||(typeof KH_READY!=='undefined'&&!KH_READY)){wlLoad();return false}
  wlHeights();wlRoofs();wlStyles();
  const FS=wlFloors();
  const W=WL_W,H=WL_H,N=W*H,hs=(a,b,c)=>hash2(a,b,c);
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const block=new Uint8Array(N),fm=new Array(N).fill('2'),hgt=new Float32Array(N).fill(.3),rk=new Float32Array(N);
  const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
  const sky=[],decor=[],scenery=[],lights=[],items=[],used=new Set(),street=new Set();
  const lv={rows:null,start:{x:WK.WSTART.x,y:WK.WSTART.y,f:WK.WSTART.f},enemies:[],items,decor,scenery,sky,fmap:null,floorSet:FS,floor:'ohLawn',ceil:'cloud',day:.98,outdoor:true,amb:.9,
    name:'Wenlock',label:'Wenlock',noExtras:true,diff:80,tele:{x:48,y:53},ceilH:5.2,chars,lights,portals:[],peaceful:true};
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)fm[y*W+x]=f};
  const isRoad=(x,y)=>street.has(x+','+y);
  // ---- helpers for everything that stands about ----
  const free=(x,y)=>x>2&&y>2&&x<97&&y<97&&rows[y][x]==='.'&&!block[y*W+x]&&!used.has(x+','+y)&&!isRoad(x,y);
  const dc=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}))};
  const tryDc=(k,x,y,o)=>{if(k&&free(x,y)){dc(k,x,y,o);return true}return false};
  const solidDc=(k,x,y,o)=>{if(k&&free(x,y)){dc(k,x,y,Object.assign({block:true,walk:false},o||{}));return true}return false};
  const walk=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true},o||{}))};
  const near=(x,y,rad)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(free(x+dx,y+dy))return [x+dx,y+dy]}return null};
  const person=(id,x,y,rad)=>{const kp=KH_KEEPERS[id];if(!kp)return null;const q=near(x,y,rad||3);if(!q)return null;walk(khFaceKey(kp.face),q[0],q[1],{npc:id,sc:kp.sc||1});WL.people.push([id,q[0],q[1]]);return q};
  WL.people=[];WL.near=near;WL.free=free;
  const pick=(arr,a,b,c)=>arr[(hs(a,b,c)*arr.length)|0];
  const lamp=(x,y)=>{if(tryDc('lamp',x,y))lights.push([x,y])};
  const flowers=(x,y,sc)=>{const k=pick(['lflora0','lflora0_1','lflora0_2'],x,y,62);if(IMG[k]&&free(x,y)){used.add(x+','+y);scenery.push({k,wx:x+.5,wy:y+.5,sc:sc||1,decor:{k,walk:true,x,y}})}};
  const OAKS=['ltree0','ltree4','ltree8','ltree12','ltree19'],tree=(x,y,k)=>solidDc(k||pick(OAKS,x,y,61),x,y);
  const apple=(x,y)=>solidDc('ltree17',x,y,{npc:'wlo_appletree',deco:false}); // click one: half the time an apple falls (wenlock_folk.js)
  const bush=(x,y)=>solidDc('lbush0',x,y,{sc:1.2});
  const A=(...k)=>wlPick(...k);      // the first picture that exists
  // ---- the ground: lawn everywhere, the square, the roads ----
  setF(0,0,W-1,H-1,'2');
  setF(WL_SQUARE.x0,WL_SQUARE.y0,WL_SQUARE.x1,WL_SQUARE.y1,'1');
  const road=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){street.add(x+','+y);fm[y*W+x]=f}};
  road(3,WL_Y,96,WL_Y,'0');
  road(24,26,24,49,'3');road(72,51,72,86,'3');road(84,14,84,49,'3');road(WL_TRACK.x0,WL_TRACK.y,WL_TRACK.x1,WL_TRACK.y,'3');
  for(let x=WL_SQUARE.x0;x<=WL_SQUARE.x1;x++)fm[WL_Y*W+x]='0';
  // the village green
  const G0=WL_GREEN;setF(G0.x0,G0.y0,G0.x1,G0.y1,'2');
  // paths on the green: gravel from the square and from the high street
  setF(30,51,30,64,'3');setF(19,60,38,60,'3');
  // the brook: two rows of water, with a bridge where Mill Lane crosses
  const brook=[];for(let x=3;x<=96;x++){const by=WL_BROOK(x);for(const y of [by,by+1]){fm[y*W+x]='4';hgt[y*W+x]=-.3;block[y*W+x]=1;brook.push([x,y])}}
  // the bridge: Mill Lane crosses on cells (72,84) and (72,85); low stone parapets stand on either side
  for(const y of [84,85]){block[y*W+72]=0;hgt[y*W+72]=.3;fm[y*W+72]='3'}
  const parapet=ch(TM.make('plain','wlgrey',.7).gid);
  for(const y of [84,85])for(const x of [71,73])solid(x,y,parapet);
  // ---- the boundary: a flint field wall, two squares thick, with the gates ----
  const WALL=1.5,wPlain=ch(TM.make('plain','wlgrey',WALL).gid),wDark=ch(TM.make('plain','castle2',WALL).gid);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x>=3&&x<=96&&y>=3&&y<=96)continue;solid(x,y,(x*7+y*3)%11===0?wDark:wPlain)}
  const pch=n=>{const c=String.fromCharCode(nextCh++);chars[c]=30+n;return c};
  // the lych-gate to the Maze of Gardens at the east end, and the road west
  {const gh=2.5,gate=TM.make('gate','wlgrey',gh,'kh_ohwall1_5');T_DOORS.wlgate=gate.tex;const gc=pch(1),pil=ch(TM.make('plain','wlgrey',gh).gid);
    solid(97,WL_Y-1,pil);solid(97,WL_Y+1,pil);rows[WL_Y][97]=gc;block[WL_Y*W+97]=0;
    lv.portals[1]={to:WK.GARDEN,x:2,y:2,f:0,tex:'wlgate'};   // the real place is looked up when the door is opened (WK.GBACK)
    sky.push({x:97.5,y:WL_Y+.5,k:A('roof1_5','kh_ohroof1_0')||'kh_ohroof1_0',w:3.6,z:gh-.03});
    const gw=TM.make('gate','wlgrey',gh,'kh_ohwall1_5');T_DOORS.wlgate2=gw.tex;const wc=pch(2);solid(2,WL_Y-1,pil);solid(2,WL_Y+1,pil);rows[WL_Y][2]=wc;block[WL_Y*W+2]=0;
    lv.portals[2]={to:WL.ID,x:WK.WSTART.x,y:WL_Y,f:3,tex:'wlgate2',req:'wlNeverOpen',lock:'A signpost beside the gate reads: TO THE WESTERN KINGDOMS. Beneath it, in smaller letters: (not yet open). The gate is shut, and the road beyond it is blocked by a very large and very sleepy ox.'};
    sky.push({x:2.5,y:WL_Y+.5,k:A('roof1_5','kh_ohroof1_0')||'kh_ohroof1_0',w:3.6,z:gh-.03});
  }
  // ---- the church of Saint Wenna, with its tower, and its churchyard ----
  const C=WL_CHURCH;
  {const cwh=3.1,cp=ch(TM.make('plain','golden',cwh).gid),cw=ch(TM.make('window','golden',cwh).gid),cw2=ch(TM.make('window2','golden',cwh).gid);
    const dt=TM.make('door','golden',cwh),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;KH_DOOR[dgid]={lvl:WL.H0,get at(){if(!LEVELS[WL.H0]&&KH_LAZY[WL.H0])KH_LAZY[WL.H0]();const L=LEVELS[WL.H0],st=L&&L.start;return st?{x:st.x,y:st.y,f:0}:{x:6,y:9,f:0}}};
    for(let y=C.y0;y<=C.y1;y++)for(let x=C.x0;x<=C.x1;x++){const front=y===C.y1;solid(x,y,x===C.door[0]&&y===C.door[1]?ch(dgid):front?(x%2?cw:cw2):cp)}
    if(IMG.wl_bldg1_0){if(typeof wlgPaintFront==='function')try{wlgPaintFront()}catch(e){console.error(e)}sky.push({x:25.5,y:C.y1+1.2,k:'wl_bldg1_0',w:8.3,z:0,big:1})}   // the painted church (porch above the door)
    else{sky.push({x:(C.x0+C.x1+1)/2,y:(C.y0+C.y1+1)/2,k:A('church_roof','roof1_4','kh_ohroof1_1')||'kh_ohroof1_1',w:8.2,z:cwh-.03,big:1});
    const tw=A('church_tower','kh_ohtower1_4');if(tw)sky.push({x:C.x0+1,y:C.y1+.6,k:tw,w:3.4,z:cwh-.03,big:1})}
    WL.church={x:(C.x0+C.x1+1)/2,y:C.y1+1,door:C.door};
  }
  // ---- painted buildings that stand over a hidden block of wall: the mill, the windmill, the dovecote and the barn ----
  const pic=(img,x0,y0,x1,y1,wh,sx,sy,w)=>{if(!IMG[img])return false;const pw=ch(TM.make('plain','wlgrey',wh).gid);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(rows[y][x]==='.')solid(x,y,pw);sky.push({x:sx,y:sy,k:img,w,z:0,big:1});for(let y=y0-4;y<=y1+1;y++)for(let x=x0-2;x<=x1+2;x++)used.add(x+','+y);return true};   // and keep the ground in front of it clear of trees
  WL.pics=[];
  for(const [img,x0,y0,x1,y1,sx,sy,w,nm] of [['wl_bldg1_3',75,88,80,91,78,87.8,5.9,'Wenlock Mill'],['wl_bldg1_2',86,89,87,90,87,88.8,3.4,'The Windmill'],['wl_bldg1_4',54,38,55,39,55,37.8,2.5,'The Dovecote'],['wl_bldg1_5',62,18,65,20,64,17.8,4.4,'The Barn']])
    if(pic(img,x0,y0,x1,y1,2.4,sx,sy,w))WL.pics.push({img,x0,y0,x1,y1,nm});
  // ---- the lots: houses along the roads (the plan is WL_HOUSES, at the top of this file) ----
  const houses=WL_HOUSES;
  const STY=['timber','honey','brick','white','flint','black','timber','honey','white'],ROOFS=['thatch','tile','slate','thatch2','tile2','moss','red','shingle','stone','plum','wl_rf_thatch3','wl_rf_thatch4','wl_rf_honey','wl_rf_rose','wl_rf_oak','wl_rf_green','thatch','thatch2'];
  houses.forEach((h,k)=>{
    h.k=k;const sp=h.sp;
    h.sty=sp?sp.sty:pick(STY,h.x0,h.y0,14);h.rk=sp?sp.roof:pick(ROOFS,h.x0,h.y0,15);
    // no two houses in a row on the same street share a wall style or a roof: step on to the next one if they would
    {const pv=houses[k-1],pv2=houses[k-2];
     if(!sp&&pv&&pv.face===h.face){for(let t=1;t<=STY.length&&(h.sty===pv.sty||(pv2&&pv2.face===h.face&&h.sty===pv2.sty));t++)h.sty=STY[(STY.indexOf(h.sty)+t)%STY.length];
       for(let t=1;t<=ROOFS.length&&(h.rk===pv.rk||(pv2&&pv2.face===h.face&&h.rk===pv2.rk));t++)h.rk=ROOFS[(ROOFS.indexOf(h.rk)+t)%ROOFS.length]}}
    h.wh=sp?sp.wh:Math.round((1.9+hs(h.x0,h.y0,16)*.5)*10)/10;
    h.name=sp?sp.name:null;
  });
  const OSTY=WL.sty;
  for(const h of houses){
    const sty=OSTY[h.sty]||h.sty,wh=h.wh,front=(x,y)=>h.face==='N'?y===h.y0:h.face==='S'?y===h.y1:h.face==='E'?x===h.x1:x===h.x0;
    const plain=ch(TM.make('plain',sty,wh).gid),plain2=ch(TM.make('plain2',sty,wh).gid),win=ch(TM.make(h.sp&&h.sp.kind&&!/^(inn|hall|library|almshouse|school)$/.test(h.sp.kind)?'shopfront':'window',sty,wh).gid),side=ch(TM.make('window',sty,wh).gid),gwin=ch(TM.make('gwin',sty,wh).gid);
    const dtile=TM.make('door',sty,wh),dgid=KH_NEXT_GID++;T_TILE[dgid]=dtile.tex;
    KH_DOOR[dgid]={lvl:h.id,get at(){if(!LEVELS[h.id]&&KH_LAZY[h.id])KH_LAZY[h.id]();const L=LEVELS[h.id],st=L&&L.start;return st?{x:st.x,y:st.y,f:0}:{x:4,y:4,f:0}}};
    for(let y=h.y0;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++){
      let c;
      if(x===h.door[0]&&y===h.door[1])c=ch(dgid);
      else if(front(x,y))c=win;
      else c=((x+y)%3===0)?side:((x*5+y*3)%5===1?gwin:(x*3+y)%4===1?plain2:plain);
      solid(x,y,c);
    }
    const horiz=h.face==='N'||h.face==='S',span=horiz?h.x1-h.x0+1:h.y1-h.y0+1;
    if(h.spk==='hall'&&IMG.wl_bldg1_1)sky.push({x:h.x0-.1,y:(h.y0+h.y1+1)/2,k:'wl_bldg1_1',w:4.6,z:0,big:1});
    else sky.push({x:(h.x0+h.x1+1)/2,y:(h.y0+h.y1+1)/2,k:wlRoofFor(h.rk,h),w:span+.5+(h.sp?.15:0),z:wh-.03});
    // tubs and window boxes either side of the door, on the verge beside the wall, never in the road
    const side2=horiz?[[h.front[0]-1,h.front[1]],[h.front[0]+1,h.front[1]]]:[[h.front[0],h.front[1]-1],[h.front[0],h.front[1]+1]];
    const wallRow=horiz?[[h.x0-1,h.face==='S'?h.y1:h.y0],[h.x1+1,h.face==='S'?h.y1:h.y0]]:[[h.face==='E'?h.x1:h.x0,h.y0-1],[h.face==='E'?h.x1:h.x0,h.y1+1]];
    // a different thing by each door, none taller than a man's waist: tubs, window boxes, herb benches, barrels, shrubs, and only rarely a palm in a pot
    for(const [tx,ty] of wallRow)if(free(tx,ty)&&hs(tx,ty,96)<.7){const r=hs(tx,ty,97),PL=[['yar_tub',.78],['kh_city2_5',.8],['kh_ohgard2_4',.7],['kh_ohgard2_1',.62],['kh_city2_2',.7],['lbush0',.9],['vase0',.8],['kh_ohgard2_3',.7],['kh_city2_3',.5]],pi=r<.04?8:((hs(tx,ty,98)*8)|0),[k,psc]=PL[pi];
      if(IMG[k]){used.add(tx+','+ty);scenery.push({k,wx:tx+.5,wy:ty+.5,sc:psc*(.9+hs(tx,ty,99)*.2),decor:{k,walk:true,x:tx,y:ty}})}}
  }
  // ---- the signs of the buildings with something to sell, and the names of the rest ----
  for(const h of houses){
    if(!h.sp||!h.sp.kind)continue;
    const horizontal=h.face==='N'||h.face==='S';
    for(const sgn of [1,-1]){
      const sx=horizontal?h.front[0]+sgn:h.front[0],sy=horizontal?h.front[1]:h.front[1]+sgn;
      const wallCell=horizontal?[sx,h.face==='S'?h.y1:h.y0]:[h.face==='E'?h.x1:h.x0,sy];
      if(rows[wallCell[1]]&&rows[wallCell[1]][wallCell[0]]==='.')continue;
      decor.push({k:'sign_wl'+h.id,x:sx,y:sy,block:false,wd:h.wall,txt:[h.name.toUpperCase(),h.sp.keeper||'']});break;
    }
  }
  // the church's own sign, on the lane
  decor.push({k:'sign_wlchurch',x:24,y:26,block:false,wd:[0,-1],txt:['SAINT WENNA\'S CHURCH','Reverend Alder']});
  // ---- the churchyard: yews, graves, a stone cross, a lych-gate of its own, a low wall ----
  {const gy={x0:13,x1:35,y0:12,y1:26};
    for(let y=gy.y0;y<=gy.y1;y++)for(let x=gy.x0;x<=gy.x1;x++)if(free(x,y)){fm[y*W+x]='2'}
    for(let y=gy.y0+1;y<=24;y+=2)for(let x of [14,16,18,30,32,34]){if(free(x,y)&&hs(x,y,1)<.7)dc(hs(x,y,2)<.5?'grave':'grave2',x,y,{block:true,walk:false,sc:.9})}
    for(const [x,y] of [[16,14],[22,14],[28,14],[33,16],[14,22],[34,22],[19,17],[30,19],[18,26],[31,26]])tree(x,y,'ltree12');
    tryDc('cross',24,27,{block:true,walk:false});tryDc('memorial',29,23,{block:true,walk:false});tryDc('cross',19,22,{block:true,walk:false,sc:.9});
    for(let x=gy.x0;x<=gy.x1;x+=2){if(free(x,gy.y0))bush(x,gy.y0)}
    for(const x of [22,26])flowers(x,26);
    // a path through the yard to the church door
    setF(24,26,24,26,'3');
  }
  // ---- the market square: a market cross, a pump, a fountain, stalls, benches ----
  {const mc=A('prop1_0','cross');solidDc(mc,48,47,{sc:1.1});
    // the town well: a painted well with its own little roof, in a ring of flowers, with a bench and a lamp; the hatch of the dungeon under the town (opened by the quest "The Knocking in the Well")
    {const wk='kh_city1_1';NPC_H[wk]=NPC_H[wk]||1.5;used.add('45,53');
      solidDc(wk,45,52,{sc:1.3,npc:'wlo_well',deco:false});WK.WELLDOOR={x:45,y:52};WK.WELLBACK={x:45,y:53,f:2};WL.well={x:45,y:52};
      for(const [x,y] of [[44,52],[46,52],[44,51],[46,51],[44,53],[46,53],[45,51]])flowers(x,y,1.25);
      tryDc('kh_ohgard1_3',43,53);tryDc('kh_ohgard1_3',47,51);}
    solidDc('kh_ohgard1_0',52,53,{});
    for(const [x,y,k] of [[43,46,'kh_stall1_0'],[46,46,'kh_stall1_1'],[50,46,'kh_stall1_3'],[53,46,'kh_stall1_4'],[43,54,'kh_stall1_2'],[54,54,'kh_stall1_5']])solidDc(k,x,y,{sc:1.28});
    for(const [x,y,k] of [[41,48,'kh_stall2_3'],[55,48,'kh_stall2_0'],[41,52,'kh_stall2_1'],[55,52,'kh_stall2_2'],[44,48,'kh_oqstuff_9'],[52,48,'kh_oqstuff_2'],[47,54,'kh_oqstuff_8']])tryDc(k,x,y,{block:true,walk:false});
    for(const [x,y] of [[46,48],[50,54],[56,47],[40,53]])tryDc('kh_ohgard1_3',x,y);
    for(const [x,y] of [[41,45],[55,45],[41,55],[55,55],[48,45],[48,55]])lamp(x,y);
    for(const [x,y] of [[42,46],[54,46],[42,54]])flowers(x,y,1.1);
    tryDc(A('prop1_3','kh_ohgard2_0'),47,53,{block:true,walk:false});
  }
  // ---- the village green: a duck pond, a maypole, the stocks, benches, a few big oaks, the flower show tent ----
  {const P=G0.pond;
    for(let y=P[1];y<=P[3];y++)for(let x=P[0];x<=P[2];x++){const edge=x===P[0]||x===P[2]||y===P[1]||y===P[3];if(edge&&(x+y)%3===0)continue;fm[y*W+x]='4';hgt[y*W+x]=-.3;block[y*W+x]=1}
    for(let i=0;i<9;i++){const x=P[0]+((hs(i,1,3)*(P[2]-P[0]+1))|0),y=P[1]+((hs(i,2,3)*(P[3]-P[1]+1))|0);used.add(x+','+y)}
    WL.pond=P;
    tryDc(A('prop1_2','kh_ohprops1_2'),20,62,{block:true,walk:false,sc:1});   // the maypole
    tryDc(A('prop1_1','kh_ohgard1_3'),34,58,{block:true,walk:false});              // the stocks
    for(const [x,y] of [[26,64],[32,70],[22,73],[19,58],[38,64],[36,76],[28,78],[18,70]])tree(x,y,'ltree'+pick([0,4,8,12,19],x,y,5));
    for(const [x,y] of [[22,64],[31,66],[26,73],[31,73],[21,69]])tryDc('kh_ohgard1_3',x,y);
    for(let n=0;n<26;n++)flowers(G0.x0+((hs(n,1,6)*(G0.x1-G0.x0))|0),G0.y0+((hs(n,2,6)*(G0.y1-G0.y0))|0),1.05);
    for(const [x,y] of [[30,57],[30,63],[22,60],[36,60]])lamp(x,y);
    tryDc(A('prop1_4','kh_stall2_4'),36,70,{block:true,walk:false});               // the flower show tent
    for(const [x,y,k] of [[34,72,'kh_stall2_3'],[35,73,'kh_ohgard2_4']])tryDc(k,x,y,{block:true,walk:false});
    // geese and ducks on the grass and the water's edge
    for(const [x,y,i] of [[24,65,0],[28,65,1],[23,69,2],[29,72,3],[26,72,4],[30,68,5]])tryDc(A(['duck0','duck1','goose0','goose1','duck2','goose2'][i],'kh_anim1_5'),x,y,{block:false});
  }
  // ---- the south: the allotments and the orchard, haystacks, a cart, a barn, and the mill across the bridge ----
  {for(let y=58;y<=78;y+=3)for(let x=77;x<=94;x+=3){if(hs(x,y,7)<.7)apple(x,y)}
    for(let y=57;y<=62;y++)for(let x=76;x<=82;x++)if(free(x,y)&&(y+x)%2===0)flowers(x,y,.9);
    for(const [x,y] of [[79,66],[85,70],[91,62],[88,76],[80,74]])tryDc('hay',x,y,{block:true,walk:false,sc:1.25});
    for(const [x,y] of [[76,64],[83,60]])tryDc(A('prop1_5','kh_ohgard1_5'),x,y,{block:true,walk:false});
    for(let n=0;n<14;n++){const x=44+((hs(n,1,8)*20)|0),y=60+((hs(n,2,8)*20)|0);if(hs(n,3,8)<.5)tree(x,y);else bush(x,y)}
    // across the brook: meadow with the mill and the windmill, cows and sheep
    setF(3,87,96,96,'5');
    for(const [x,y,i] of [[60,91,0],[64,89,1],[56,93,2],[68,93,3]])tryDc(i%2?'cow':A('sheep','sheep0','kh_anim1_3'),x,y,{block:false});
    for(let n=0;n<26;n++){const x=4+((hs(n,1,9)*90)|0),y=87+((hs(n,2,9)*9)|0);if(free(x,y)&&!(x>=68&&x<=76)){if(hs(n,3,9)<.5)tree(x,y);else bush(x,y)}}
    for(let x=4;x<=95;x+=2)for(const y of [WL_BROOK(x)-1])if(hs(x,y,10)<.35&&free(x,y))flowers(x,y,.9);
  }
  // ---- trees and hedges everywhere else: north meadows, the track, the back gardens ----
  for(let n=0;n<230;n++){const x=4+((hs(n,1,20)*92)|0),y=4+((hs(n,2,20)*92)|0);if(!free(x,y))continue;if(y>=44&&y<=56)continue;if(x>=WL_GREEN.x0&&x<=WL_GREEN.x1&&y>=WL_GREEN.y0&&y<=WL_GREEN.y1)continue;
    if(WL_ROAD(x-1,y)||WL_ROAD(x+1,y)||WL_ROAD(x,y-1)||WL_ROAD(x,y+1))continue;
    const r=hs(n,3,20);if(r<.45)tree(x,y);else if(r<.6)apple(x,y);else if(r<.85)bush(x,y);else flowers(x,y,1)}
  // lamp posts along High Street in the gaps beside the road
  for(let x=5;x<=95;x++){if(x>=WL_SQUARE.x0-1&&x<=WL_SQUARE.x1+1)continue;if(x%9!==2)continue;for(const y of [WL_Y-1,WL_Y+1])if(free(x,y)){lamp(x,y);break}}
  for(const [x,y] of [[24,40],[24,30],[72,60],[72,72],[84,40],[84,28],[93,48],[96,48]])if(free(x+1,y)||free(x-1,y))lamp(free(x+1,y)?x+1:x-1,y);
  // ---- the yards behind the houses: washing, hives, barrows, barrels, sacks, hay, fences, chickens, geese ----
  {const YARD=['hay','kh_ohgard2_2','kh_ohgard2_3','kh_ohgard2_0','kh_ohprops1_7','kh_oqstuff_9','kh_oqstuff_8','fence','chicken','chicken2','kh_ohgard2_4','kh_ohgard1_5','kh_ohgard1_3','fence'];
   for(const h of houses){
    const back=h.face==='S'?[[h.x0,h.y0-1],[h.x1,h.y0-1],[h.x0,h.y0-2]]:h.face==='N'?[[h.x0,h.y1+1],[h.x1,h.y1+1],[h.x0,h.y1+2]]:h.face==='E'?[[h.x0-1,h.y0],[h.x0-1,h.y1],[h.x0-2,h.y0]]:[[h.x1+1,h.y0],[h.x1+1,h.y1],[h.x1+2,h.y0]];
    back.forEach(([bx,by],i)=>{const r=hs(bx,by,30+i);if(r>.62-.12*i)return;const k=YARD[(hs(bx,by,31)*YARD.length)|0];
      if(/^(kh_ohgard2_2|kh_ohgard2_0|kh_ohgard1_5|kh_ohprops1_7)$/.test(k))tryDc(k,bx,by,{block:true,walk:false});else tryDc(k,bx,by,{block:false})});
    if(hs(h.x0,h.y0,33)<.3){const sx=h.face==='S'||h.face==='N'?h.x0-1:h.x0,sy=h.face==='S'||h.face==='N'?h.y0:h.y0-1;if(free(sx,sy))bush(sx,sy)}
   }}
  // ---- the cats and dogs, the people ----
  if(typeof wlPlaceFolk==='function')wlPlaceFolk({person,near,free,walk,dc,tryDc,solidDc,A,hs,decor});
  // ---- Blackbriar Lane: a gate in the north wall that leads to the Witch's Wood (src/desert/ww_wood.js) ----
  if(typeof wwWenlockGate==='function')wwWenlockGate({W,rows,block,fm,street,decor,ch});
  // ---- Churchyard Lane: a lane west of Church Lane to the lych-gate of the old graveyard (src/desert/gy_yard.js) ----
  if(typeof gyWenlockGate==='function')gyWenlockGate({W,rows,block,fm,street,decor,ch});
  // ---- polish: glass, numbers and names, the chapel, the mill, the air, the dead meadows (src/desert/wenlock_polish.js and friends) ----
  if(typeof wlPolish==='function')wlPolish({W,H,rows,block,fm,hgt,sky,decor,scenery,lights,items,used,street,ch,TM,solid,free,dc,tryDc,solidDc,walk,near,person,pick,hs,lamp,flowers,tree,bush,apple,A,houses,pch,chars,lv,setF,isRoad,brook});
  // ---- the level ----
  lv.rows=rows.map(r=>r.join(''));
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}lv.fmap=fmap;
  lv.mapNames=[{t:'High Street',x:70,y:50,k:'lane'},{t:'Market Square',x:48,y:50,k:'place'},{t:'Church Lane',x:24,y:38,k:'lane'},{t:'Mill Lane',x:72,y:66,k:'lane'},{t:'Green Lane',x:84,y:32,k:'lane'},
    {t:"Saint Wenna's",x:24,y:16,k:'place'},{t:'The Village Green',x:28,y:62,k:'place'},{t:'The Brook',x:40,y:84,k:'lane'},{t:'Back Track',x:60,y:13,k:'lane'},{t:'The Orchard',x:86,y:66,k:'place'},{t:'Wenlock Mill',x:78,y:90,k:'place'}];
  if(typeof WL_MAPX!=='undefined')lv.mapNames.push(...WL_MAPX);
  {for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=chars[rows[y][x]];if(c>=30&&c<100)block[y*W+x]=0}} // a gate is not a rock face
  WL.houses=houses;WL.brook=brook;WL.street=street;
  LEVELS[WL.ID]=lv;LEVEL_NAMES[WL.ID]='Wenlock';
  {const T=yarTerrain(W,H,hgt,rk,block);TERRS[WL.ID]=T}
  return true;
}
KH_LAZY[WL.ID]=()=>{wlBuild()};
LEVEL_NAMES[WL.ID]='Wenlock';
LEVEL_RATING[WL.ID]=80;for(let i=0;i<100;i++)LEVEL_RATING[WL.H0+i]=80;
/* a level the garden's exit asks for before Wenlock has been built (and a saved game that stands in Wenlock) waits for the pictures */
const wlFam=n=>n===WL.ID||(n>=WL.H0&&n<=WL.H0+99);
{const _g=goToLevel;goToLevel=function(n,entry){
  if(wlFam(n)&&!(WLART.ready&&(typeof KH_READY==='undefined'||KH_READY))&&!G._wlWait){G._wlWait=1;try{msg('The lanes of Wenlock come into view...','#a8d8ff')}catch(e){}wlLoad().then(()=>{G._wlWait=0;goToLevel(n,entry)}).catch(()=>{G._wlWait=0});return}
  if(n===WL.ID&&!LEVELS[WL.ID])wlBuild();
  if(wlFam(n)&&n!==WL.ID&&!LEVELS[n]&&!KH_LAZY[n]){try{sfx('locked');msg('The door is locked. Nobody answers.','#d09a80')}catch(e){}return}   // an interior that has not been built (yet)
  const r=_g.apply(this,arguments);
  if(n===WL.ID){const F=G.flags;if(F.wlWellOpen&&!F.wlWellDone&&typeof wlWellQuestGoal==='function'){try{if(wlWellQuestGoal())F.wlWellDone=true}catch(e){}}if(!F.wlMet){F.wlMet=1;try{wkMet('wenlock')}catch(e){console.error(e)}msg('Wenlock. Birdsong, woodsmoke, and a smell of fresh bread.','#b8e8a0')}}
  return r}}
if(typeof restore==='function'){const _r=restore;restore=function(sv){const l=sv&&sv.level;if(wlFam(l)&&!(WLART.ready&&(typeof KH_READY==='undefined'||KH_READY))){wlLoad().then(()=>{if(!LEVELS[l]&&KH_LAZY[l])KH_LAZY[l]();restore(sv)});return}return _r.apply(this,arguments)}}
if(typeof jumpToLevel==='function'){const _j=jumpToLevel;jumpToLevel=function(n,target){if(wlFam(n)&&!(WLART.ready&&(typeof KH_READY==='undefined'||KH_READY))){wlLoad().then(()=>jumpToLevel(n,target));return}if(n===WL.ID&&!LEVELS[WL.ID])wlBuild();return _j.apply(this,arguments)}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||wlFam(n)}}
/* the way back to the Maze of Gardens: where the garden says the party stands (WK.GBACK), or its first square */
{const _u=usePortal;usePortal=function(i){const p=G.portals[i];if(LEVEL===WL.ID&&p&&p.to===WK.GARDEN){const b=WK.GBACK||{x:2,y:2,f:0};if(!LEVELS[WK.GARDEN]&&KH_LAZY[WK.GARDEN])KH_LAZY[WK.GARDEN]();p.x=b.x;p.y=b.y;p.f=b.f}return _u.apply(this,arguments)}}
LEVEL_NAMES[WK.GARDEN]=LEVEL_NAMES[WK.GARDEN]||'The Maze of Gardens';
