/* ==========================================================================
   SALE: THE ROOMS. The ten shops (levels 7201 and up, one per door of SA_HOUSES), two cottages, and the three small levels: the Hollow Cellar (601), the Sale Crypt (602) and the Belfry (603).
   The shops are Wenlock's rooms (WLIN_ROOMS) dimmed, with the Wenlock folk taken out; they only open once the keeper's trust quest is done (sale_town.js, sale_quests.js).
   Stock is for a party of level 90: only the gear of levels 50 to 95, the whole potion ladder, the best scrolls and rings.
   ========================================================================== */
/* ---- what the shops sell ---- */
const saHas=r=>ITEMDEF[r[0]];
function saGear(kinds,part){
  const ids=Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];return d&&!d.rar&&kinds.includes(d.k)&&(d.price||0)>0&&(d.lvl||1)>=50&&(d.lvl||1)<=95}).sort((a,b)=>(ITEMDEF[b].lvl||1)-(ITEMDEF[a].lvl||1)||ITEMDEF[a].price-ITEMDEF[b].price);
  return ids.filter((id,i)=>part===undefined||i%2===part).map(id=>[id,1])}
KH_STOCK.sa_general=()=>KH_STOCK.wli_general().concat([['hgescape',3],['potion5',2]].filter(saHas));
KH_STOCK.sa_armour=()=>saGear(['shield','head','chest','legs','arms','armor','armour'],0);
KH_STOCK.sa_weapons=()=>saGear(['weapon']);
KH_STOCK.sa_apothecary=()=>KH_STOCK.wli_herbs().concat([['healdraught',6],['greaterheal',5],['superiorheal',4],['elixir',3],['antidote',8],['salve',8]].filter(saHas));
KH_STOCK.sa_books=()=>KH_STOCK.wli_scrolls();
KH_STOCK.sa_jeweller=()=>Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];return d&&(d.k==='ring'||d.k==='amulet'||d.k==='neck')&&(d.price||0)>0}).sort((a,b)=>ITEMDEF[a].price-ITEMDEF[b].price).map(id=>[id,1]);
KH_STOCK.sa_tailor=()=>KH_STOCK.wli_tailor().concat(saGear(['head','chest','legs','arms'],1));
KH_STOCK.sa_butcher=()=>[['sausage',16],['roast',12],['pie',10],['bread',14],['herring',8],['pottage',8],['cheese',6]].filter(saHas);
KH_STOCK.sa_alchemist=()=>KH_STOCK.wli_potion();
KH_STOCK.sa_tavern=()=>[['ale',16],['pottage',8],['pie',6],['bread',8],['sausage',8],['cheese',6]].filter(saHas);
/* ---- the keepers ---- */
const SA_KEEP={
  general:{face:'kh_ohfolk2_5',thanks:"The boards are down. I had forgotten the door opened outwards. Come in, come in. I sell what I could carry down here in the first week, and I have been rationing it to nobody ever since. Take what you like and leave what you pay."},
  armour:{face:'kh_ohsold1_0',thanks:"You killed Ranulf. He was my captain, and then he was not, and then he was walking about in his armour. I did not have it in me. Thank you. The armour on these racks is all that is left of the watch. It is yours for gold."},
  weapons:{face:'kh_ohfolk4_0',thanks:"The ghouls have stopped coming to the whetstone at night. I can hear it. My daughter is back at the bench, which means there is a Stroud and Daughter again. Look at the blades, they are good."},
  apothecary:{face:'kh_ohfolk3_1',thanks:"My three are out. I could hear them on the other side of the wall, counting steps. Sit, dear, there is nothing wrong with you that a draught will not help. Everything here is for the living."},
  books:{face:'kh_ohfolk5_0',thanks:"He answered! Three words, and I know that hand. I have run the scriptorium for twenty years and I have never been so glad of a bad letter. The scrolls and the rings are on the shelves. The ink is still wet on some."},
  jeweller:{face:'kh_ohfolk5_5',thanks:"My Eye! Look at it, the gilt is scratched and the glass is not. It will go back over the door tomorrow. Stones, rings and chains, then. Nothing here was ever buried with anybody, and I will say so to anyone who asks."},
  tailor:{face:'kh_ohfolk1_3',thanks:"He is home, and eating a whole loaf in the corner, which is how I know he is fine. You have my cloth, my thread and my thanks. I make mourning wear, mostly. Business has been very good for nine years."},
  butcher:{face:'kh_ohfolk2_2',thanks:"Flour! Real flour. I will have a loaf in the oven before you reach the door. The meat is from the cellar and I will not say what it was before. It was a cow. I promise. It was a cow."},
  alchemist:{face:'kh_ohfolk5_4',thanks:"Grave-salt, and a good fat piece. Splendid. I will have the batch started tonight. The mixtures on the shelf are finished and tested. Do not ask me how, I tested them on the neighbours, and they are dead already."},
  tavern:{face:'kh_ohfolk3_5',thanks:"Three rounds, three regulars, and not a single complaint about the beer. They have gone to wherever it is they were going. The Last Orders is open. A bed is upstairs, a hot meal is in the kitchen, and a cold ale is where it always was."}
};
for(const key in SA_SPEC){const sp=SA_SPEC[key],K=SA_KEEP[key],id='sa_k_'+key;
  const root=d=>{const F=G.flags;
    const opts=[];
    if(!F['sa_thanked_'+key]){F['sa_thanked_'+key]=1;return say(K.thanks,[['Let us see the wares.',()=>{if(key==='tavern')return saInnNode(d);openShop(d,KH_STOCK['sa_'+key](),sp.name);return null}],BYE])}
    if(key==='tavern')return saInnNode(d);
    return say(['Take your time. Everything has its price and its place.','The door is open now, and I mean to keep it that way.','Good to see living faces. Yours are very nearly the best I have seen this year.'][(F.rounds||0)%3],[['Browse the wares',()=>{openShop(d,KH_STOCK['sa_'+key](),sp.name);return null}],BYE])};
  khNpc(id,sp.keeper,K.face,root)}
function saInnNode(d){
  const cost=150;
  return say('The Last Orders. A hot meal, a cold ale and a bed that is upstairs where a bed should be. A room is '+cost+' gold, and you wake mended and fed. The cellar has a few things in it, but we do not go down there at night.',[
    ['Take rooms ('+cost+' gold)',()=>{if(G.gold<cost)return say('That is '+cost+' gold. I cannot go lower. The bed is the only warm thing in Sale.',[BYE]);G.gold-=cost;restParty(true);return say('You sleep behind a barred door, and nothing knocks. Everyone wakes healed and fed.',[BYE])}],
    ['Buy a meal or a drink',()=>{openShop(d,KH_STOCK.sa_tavern(),'The Last Orders');return null}],
    ['Any news?',()=>say(SA_NEWS[(G.rounds||0)%SA_NEWS.length],[BYE])],BYE])}
const SA_NEWS=['The Sanctuary has been barred from the inside since last spring. We leave bread on the step. It is gone in the morning. We do not know who takes it, and we are careful not to ask.','The dead keep to the dead quarter and the old farm. Everyone else is a ghost and means no harm. Mind the ghouls south of Charnel Row, and mind the bell, which rings on its own.','The shops are all barricaded, because nobody trusted anybody. If you do the favours, the planks come down. That is how it works here.'];
/* ---- small stories for the shops (b7 pass): one readable note, a lit candle, a few things dropped. Every note is plain; every piece stands on a square the audit found free ---- */
const SA_SHNOTE={
  general:"A ledger page nailed to the counter. The last entry reads: 'Day 3,291. Oil low. Nobody came.' The pen is still in the ink.",
  armour:"A duty roster nailed to the rack. Eight names are crossed out in a row. Ironbrow's name is the last one left.",
  weapons:"An order book, open. The last order is one sword, half paid, to be collected by an apprentice who has not come.",
  apothecary:"A list of remedies in a shaky hand. The word 'ghoul-bite' is underlined twice and nothing is written after it.",
  books:"The reeve's book of the dead, open on the desk. Every page is full. The last page is in a different handwriting.",
  jeweller:"A tray of rings with paper tags. The tags say 'buried with', 'not buried with' and 'not sure'.",
  tailor:"A bolt of black cloth, half cut. The chalk marks outline a small coat, a child's coat.",
  butcher:"A slate: loaves baked, loaves sold, loaves left on the Sanctuary step. The last column is the longest.",
  alchemist:"A note beside a cloudy retort: DO NOT DRINK. DO NOT SELL. DO NOT BURY. Nothing is said about spilling it.",
  tavern:"A slate behind the bar lists the regulars and what each owes. Every name is marked paid. One has been underlined twice."};
for(const k in SA_SHNOTE)khNpc('sa_sh_'+k,'A note',null,()=>say(SA_SHNOTE[k],[BYE]));
{const W={block:false,walk:true,deco:true},NT=k=>['hl_p_note',0,0,{block:true,npc:'sa_sh_'+k,sc:1.1}],nt=(k,x,y)=>{const a=NT(k);a[1]=x;a[2]=y;return a};
 var SA_DRESS={
  general:{props:[],raw:[['hl_p_candle',2,2,Object.assign({sc:.6},W)],['wm_bucket',3,5,W],nt('general',9,4)]},
  armour:{props:[],raw:[['hl_p_armour',10,4,{block:true,sc:.9}],['hl_p_candle',2,2,Object.assign({sc:.6},W)],['wm_bucket',9,6,W],nt('armour',1,4)]},
  weapons:{props:[],raw:[['hl_p_candle',10,2,Object.assign({sc:.6},W)],['wm_bucket',10,6,W],['gy_bones',2,6,Object.assign({sc:.6},W)],nt('weapons',1,4)]},
  apothecary:{props:[],raw:[['hl_p_poison',2,2,Object.assign({sc:.9},W)],['ww_rowan',8,2,Object.assign({sc:.7},W)],['wm_bucket',8,5,W],nt('apothecary',9,6)]},
  books:{props:[],raw:[['gy_book',2,2,Object.assign({sc:.9},W)],['hl_p_candle',8,2,Object.assign({sc:.6},W)],nt('books',9,6)]},
  jeweller:{props:[],raw:[['hl_p_candle',2,2,Object.assign({sc:.6},W)],['gy_ring',6,2,Object.assign({sc:.9},W)],['gy_locket',2,5,Object.assign({sc:.9},W)],nt('jeweller',7,3)]},
  tailor:{props:[],raw:[['gy_ring',2,2,Object.assign({sc:.9},W)],['hl_p_candle',8,2,Object.assign({sc:.6},W)],['wm_bucket',8,5,W],nt('tailor',1,4)]},
  butcher:{props:[],raw:[['ww_crumbs',3,5,Object.assign({sc:1},W)],['hl_p_candle',2,2,Object.assign({sc:.6},W)],['wm_bucket',8,6,W],nt('butcher',9,4)]},
  alchemist:{props:[],raw:[['hl_p_poison',2,2,Object.assign({sc:.9},W)],['ww_hagstone',8,5,Object.assign({sc:1},W)],['hl_p_candle',5,5,Object.assign({sc:.6},W)],nt('alchemist',2,5)]},
  tavern:{props:[],raw:[['wm_bucket',2,5,W],['hl_p_candle',5,7,Object.assign({sc:.6},W)],['ww_boot',2,7,Object.assign({sc:1},W)],['wm_barrel',13,6,{block:true,sc:.9}],nt('tavern',13,7)]}};}
function saVaryRaw(raw){
  const ALT={sacks:['crate','barrel'],crate:['barrel','sacks'],barrel:['crate','sacks']},kept=[];
  for(const r of raw){const n=r[0];
    if(ALT[n]&&kept.some(q=>q[0]===n&&Math.max(Math.abs(q[1]-r[1]),Math.abs(q[2]-r[2]))<=2)){const a=ALT[n].find(m=>!kept.some(q=>q[0]===m&&Math.max(Math.abs(q[1]-r[1]),Math.abs(q[2]-r[2]))<=2));if(a){kept.push([a].concat(r.slice(1)));continue}}
    kept.push(r)}
  return kept}
/* identical neighbours in a room's furniture: every second piece of a run becomes a different piece of the same kind of thing (counters, bars and tables are meant to be a run and stay) */
function saVaryProps(props){
  const ALT={shelving:['potshelf','herbrack'],weaponrack:['shields'],mannequin:['shields'],potshelf:['herbrack','shelving'],herbrack:['potshelf','apothcab'],scrollrack:['bookshelf'],bookshelf:['scrollrack'],butcher:['coopstack'],veg:['coopstack'],tailor:['spinwheel','cot'],oven:['bakertable'],cobbler:['shelving'],pew:['lectern']};
  const SAME={shopcounter:1,bar:1,longtable:1,bakertable:1,readdesk:1,chandelier:1,anvil:1};
  const kept=[];for(const p of props){const [n,x,y,o]=p;
    if(!SAME[n]&&ALT[n]&&kept.some(q=>q[0]===n&&Math.max(Math.abs(q[1]-x),Math.abs(q[2]-y))<=2)){
      const a=ALT[n].find(m=>WLIN_P[m]&&!kept.some(q=>q[0]===m&&Math.max(Math.abs(q[1]-x),Math.abs(q[2]-y))<=2));
      if(a){const np=[a,x,y];if(o){const oo=Object.assign({},o);delete oo.h;np.push(oo)}kept.push(np);continue}}
    kept.push(p)}
  return kept}
/* ---- the Wenlock rooms, dimmed and emptied of Wenlock folk, one per shop ---- */
{const LOOK={general:'stone',armour:'cellar',weapons:'cellar',apothecary:'stone',books:'oak',jeweller:'stone',tailor:'stone',butcher:'cellar',alchemist:'stone',tavern:'oakflag'};
 for(const key in SA_SPEC){const sp=SA_SPEC[key],base=WLIN_ROOMS[sp.room];if(!base)continue;
  const D=Object.assign({},base,{look:LOOK[key]||'stone',amb:Math.max(.26,base.amb*(key==='jeweller'?.42:.58)),folk:[],noExtras:true,win:(base.win||[]).slice(0,2)});
  D.raw=(base.raw||[]).concat([['gy_web',1,1,{block:false,walk:true,deco:true,sc:.6}],['gy_web',D.w-2,1,{block:false,walk:true,deco:true,sc:.6}]]);
  if(key==='tavern'){D.folk=[['sa_inn_g1',6,4],['sa_inn_g2',9,4],['sa_inn_g3',5,5]]}
  // the QA pass: props are copied, raw pieces that sit in a wall square are dropped, identical neighbours are varied, and each shop gets its own small story
  D.props=saVaryProps(base.props.slice());D.raw=saVaryRaw(D.raw.filter(r=>r[1]>=1&&r[2]>=1&&r[1]<=D.w-2&&r[2]<=D.h-2));
  const X=SA_DRESS[key];if(X){for(const p of (X.props||[]))D.props.push(p);for(const r of (X.raw||[]))D.raw.push(r)}
  WLIN_ROOMS['sa_'+key]=D}}
function saMakeRoom(h){
  const id=h.id,back={to:SA.ID,x:h.front[0],y:h.front[1],f:h.out};let b,name;
  if(h.spk){const sp=h.sp;name=sp.name;b={id:'sain'+id,wlin:'sa_'+sp.key,name,room:'shop',keeper:'sa_k_'+sp.key,floor:'wood',wallImg:'kh_ohwall1_0'}}
  else{const H=SA_HOMES[h.home];name=H.name;const vn=wlinHomeVariant(H.scene,id);if(!WLIN_ROOMS[vn]._sa){WLIN_ROOMS[vn]._sa=1;const R=WLIN_ROOMS[vn];R.amb=Math.max(.24,R.amb*.5);R.raw=(R.raw||[]).concat([['gy_web',1,1,{block:false,walk:true,deco:true,sc:.6}],['gy_web',R.w-2,1,{block:false,walk:true,deco:true,sc:.55}],['gy_bones',R.w>>1,R.h-2,{block:false,walk:true,deco:true,sc:.6}],['gy_candles',2,R.h-2,{block:false,walk:true,deco:true,sc:.5}]])}
    b={id:'sain'+id,wlin:vn,name,room:'home',keeper:H.keeper,floor:'wood',wallImg:'kh_ohwall1_0'}}
  const R=khRoom(b,id,back);LEVELS[id]=R.level;try{saTidy(R.level,{id})}catch(e){console.error('sale tidy',id,e)}LEVELS[id].diff=90;LEVEL_NAMES[id]=name;LEVEL_RATING[id]=90;return R.level}
for(const h of SA_HOUSES)if(h.spk||(h.home&&h.home!=='rope'))KH_LAZY[h.id]=()=>{if(!LEVELS[h.id])saMakeRoom(h)};
/* ---- the three small levels ---- */
const SA_MPOOLS={gy_bones:[{k:'gy_rose',sc:.9,b:0},{k:'gy_mound',sc:.7,b:0},{k:'wm_bucket',sc:1,b:0}],gy_web:[{k:'ww_twig',sc:1,b:0},{k:'ww_hagstone',sc:1,b:0}],barrel:[{k:'crate',sc:1,b:1},{k:'sacks',sc:1,b:1},{k:'wm_barrel',sc:1,b:1}],crate:[{k:'barrel',sc:1,b:1},{k:'sacks',sc:1,b:1},{k:'wm_crate',sc:1,b:1}],sacks:[{k:'barrel',sc:1,b:1},{k:'crate',sc:1,b:1}],
  gy_sarc:[{k:'gy_tomb',sc:1,b:1},{k:'hl_p_coffin',sc:.9,b:1}],gy_candles:[{k:'hl_p_candle',sc:.7,b:0}],gy_niche:[{k:'hl_p_alcove',sc:.8,b:0}]};
const SA_MNOTE={sa_c_tally:['A tally on a beam','Scratches on a beam, in fives. Thirty-one days. The last five strokes are fresh.'],sa_r_log:['A mason\'s list','A mason\'s chalk list of the names on the lids, in a neat hand. The last line says: space for four more. Under it, in a rougher hand: make that nine.'],
  sa_r_salt:['A split sack','A sack split open on the floor, and white crystals spilled from it: grave-salt. The walls of the vault are wet with it, and it grows in little frills where the water runs.'],sa_b_nest:['A raven\'s nest','A raven\'s nest built of rope ends and rags. A small wooden horse has been woven into it, and the ravens leave it alone.']};
for(const k in SA_MNOTE)khNpc(k,SA_MNOTE[k][0],null,()=>say(SA_MNOTE[k][0]+'\n\n'+SA_MNOTE[k][1],[BYE]));
function saMini(id,S){
  if(LEVELS[id])return LEVELS[id];
  gyAlias();
  const W=S.W,H=S.H,hs=(a,b,c)=>hash2(a,b,c),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  for(const r of S.rects)for(let y=r[1];y<=r[3];y++)for(let x=r[0];x<=r[2];x++)g[y][x]='.';
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const WH=S.wh||2.8,open=(x,y)=>g[y]&&g[y][x]==='.',near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const V=S.tex.map(t=>ch(gyTile(t,WH,{rgb:S.rgb||[.9,.94,1]})));
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){s+=open(x,y)?'.':near(x,y)?V[(hs(x,y,9)*V.length)|0]:V[0]}rows.push(s)}
  // the way out: a plain door in the wall
  {const TMx=ohTiles(),dt=TMx.make('door','sa_black',WH),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;KH_DOOR[dgid]={lvl:S.back.to,at:{x:S.back.x,y:S.back.y,f:S.back.f}};
   const ex=S.exit;rows[ex[1]]=rows[ex[1]].slice(0,ex[0])+ch(dgid)+rows[ex[1]].slice(ex[0]+1)}
  const decor=[],lights=[],items=[],enemies=[],occ=new Set();
  const dec=(a,x,y,o)=>{o=o||{};const k=GYA[a]?'gy_'+a:a;if(!open(x,y)||occ.has(x+','+y))return null;const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false;d.solid=1}decor.push(d);occ.add(x+','+y);return d};
  const light=(x,y)=>lights.push([x,y]);
  const foe=(t,x,y)=>{if(open(x,y)&&!occ.has(x+','+y)){enemies.push({t,x,y,lvl:90});occ.add(x+','+y)}};
  const person=(npcId,x,y)=>{const kp=KH_KEEPERS[npcId];if(!kp||!open(x,y))return;decor.push({k:khFaceKey(kp.face),x,y,block:true,npc:npcId,sc:kp.sc||1});occ.add(x+','+y)};
  const item=(k,x,y)=>items.push({k,x,y});
  S.fill({dec,light,foe,person,item,open,W,H,occ});
  try{b7Dedupe(decor,SA_MPOOLS,d=>!!d.npc)}catch(e){console.error('mini dedupe',e)}
  const cf=FLOORS[S.floor]?S.floor:'gyf_flag',L={rows,chars,floor:cf,ceil:CEILS.gyc_crypt?'gyc_crypt':'beam',ceilH:WH+1,start:{x:S.start.x,y:S.start.y,f:S.start.f},enemies,items,decor,lights,portals:[],day:0,amb:S.amb||.2,torchGap:1e9,noTele:true,noExtras:true,
    name:S.name,label:S.name,diff:90,mapNames:S.names||[]};
  try{saTidy(L,{id})}catch(e){console.error('sale tidy',id,e)}
  LEVELS[id]=L;LEVEL_NAMES[id]=S.name;LEVEL_RATING[id]=90;return L}
const saRopeHouse=()=>SA_HOUSES.find(h=>h.home==='rope');
/* 601: the Hollow Cellar. A low cellar under the Ropewalk Cottage: an entry chamber, a passage, a long chamber, and a nook at the east end where three living people have been hiding for a month. */
KH_LAZY[SA.CELLAR]=()=>{const rh=saRopeHouse();saMini(SA.CELLAR,{name:SA_NAMES[601],W:24,H:15,wh:2.5,tex:['texGrey_1','texGrey_3','texBlack_2','texGrey_0'],rgb:[.85,.9,.95],floor:'gyf_cflag',amb:.16,
  rects:[[1,5,6,9],[7,6,10,7],[11,3,19,11],[20,6,22,8]],start:{x:2,y:7,f:1},exit:[0,7],back:{to:SA.ID,x:rh.front[0],y:rh.front[1],f:rh.out},
  names:[{t:'The Entry',x:3,y:7,k:'place'},{t:'The Long Chamber',x:15,y:7,k:'place'},{t:'The Hiding Nook',x:21,y:7,k:'place'}],
  fill:({dec,light,foe,person})=>{
    for(const [x,y] of [[2,5],[5,5],[2,9],[6,9],[12,3],[14,3],[18,3],[12,11],[17,11],[19,10]])dec(['barrel','crate','barrel','crate','sacks'][(x+y)%5],x,y,{block:true});
    for(const [x,y] of [[1,6],[6,6],[11,4],[19,4],[11,10],[3,9],[9,7]])dec('web',x,y,{sc:.55});for(const [x,y] of [[4,8],[8,7],[15,9],[16,5]])dec('bones',x,y,{sc:.85});
    dec('candles',21,5,{block:true,sc:.55});dec('coffin',13,7,{block:true,sc:.8});
    for(const [x,y] of [[2,6],[6,8],[10,7],[12,5],[16,7],[18,10],[21,7],[4,5]])light(x,y);
    foe('saghoul',4,6);foe('saghoul',5,8);foe('saskel',12,6);foe('saghoul',14,9);foe('sazombie',17,6);foe('saskel',18,4);
    person('sa_surv1',21,6);person('sa_surv2',21,8);person('sa_surv3',22,7);
    dec('hl_p_candle',20,5,{sc:.55});dec('wm_bucket',3,9,{});dec('hl_p_apple',19,8,{sc:1});dec('ww_crumbs',19,6,{sc:1});dec('hl_p_note',16,3,{block:true,npc:'sa_c_tally',sc:1.1});dec('wm_barrel',9,6,{block:true,sc:.9})}})};
/* 602: the Sale Crypt. A stair down from the end of Charnel Row, a hall of sarcophagi, and a vault at the far end where the walls sweat grave-salt. */
KH_LAZY[SA.CRYPT]=()=>saMini(SA.CRYPT,{name:SA_NAMES[602],W:29,H:15,wh:3.0,tex:['texGrey_0','texGrey_3','texGrey_0','texGrey_5','texBlack_3'],rgb:[.9,.95,1.02],floor:'gyf_cflag',amb:.12,
  rects:[[1,5,5,9],[6,6,7,7],[8,3,18,11],[19,6,20,7],[21,4,27,10]],start:{x:2,y:7,f:1},exit:[0,7],back:{to:SA.ID,x:SA_CRYPTGATE.front[0],y:SA_CRYPTGATE.front[1],f:0},
  names:[{t:'The Stair',x:3,y:7,k:'place'},{t:'The Hall of Sarcophagi',x:13,y:7,k:'place'},{t:'The Salt Vault',x:24,y:7,k:'place'}],
  fill:({dec,light,foe,item})=>{
    for(const [x,y] of [[9,4],[12,4],[15,4],[18,4],[9,10],[12,10],[15,10],[18,10]])dec('sarc',x,y,{block:true,sc:.9});
    for(const [x,y] of [[10,7],[14,7],[17,7]])dec('candles',x,y,{block:true,sc:.7});
    for(const [x,y] of [[2,5],[4,9],[3,6]])dec('niche',x,y,{sc:.8});dec('altar',24,4,{block:true});dec('coffin',26,9,{block:true,sc:.8});dec('candles',22,9,{block:true,sc:.6});
    for(const [x,y] of [[8,3],[18,3],[8,11],[18,11],[21,4],[27,10]])dec('web',x,y,{sc:.6});for(const [x,y] of [[3,8],[11,6],[16,9],[23,6],[25,8]])dec('bones',x,y,{sc:.85});
    for(const [x,y] of [[2,6],[4,8],[7,7],[10,5],[13,9],[16,5],[19,7],[22,5],[25,7],[26,5]])light(x,y);
    foe('saskel',3,8);foe('saskel',10,6);foe('saghoul',12,8);foe('saghoul',15,6);foe('sawight',16,9);foe('sabmage',14,5);foe('saskel',17,10);foe('sawight',22,7);foe('sagiant',25,6);
    item('sa_gravesalt',26,7);
    dec('hl_p_note',5,5,{block:true,npc:'sa_r_log',sc:1.1});dec('sacks',27,5,{block:true,npc:'sa_r_salt',sc:1});dec('hl_p_chains',24,5,{sc:1});dec('hl_p_coffin',13,3,{sc:.9});dec('gy_book',22,6,{sc:1});dec('wm_bucket',10,9,{})}});
/* 603: the Belfry. A narrow stair tower: a ground room, a stair, a landing, a stair, and the bell chamber, where a boy hides under the bell. */
KH_LAZY[SA.BELFRY]=()=>saMini(SA.BELFRY,{name:SA_NAMES[603],W:13,H:21,wh:3.2,tex:['texBlack_0','texBlack_3','texGrey_3','texBlack_5'],rgb:[.9,.92,1],floor:'gyf_slate',amb:.2,
  rects:[[3,15,9,19],[5,12,6,14],[3,8,9,11],[5,5,6,7],[3,1,9,4]],start:{x:6,y:18,f:0},exit:[6,20],back:{to:SA.ID,x:SA_BELFRY.front[0],y:SA_BELFRY.front[1],f:2},
  names:[{t:'The Foot of the Tower',x:6,y:17,k:'place'},{t:'The Landing',x:6,y:9.5,k:'place'},{t:'The Bell Chamber',x:6,y:2.5,k:'place'}],
  fill:({dec,light,foe,person})=>{
    dec('bell',4,2,{block:true,sc:1.8});dec('bell',8,2,{block:true,sc:1.4});dec('candles',3,10,{block:true,sc:.6});dec('candles',9,17,{block:true,sc:.6});
    for(const [x,y] of [[3,15],[9,15],[3,8],[9,8],[3,1],[9,1]])dec('web',x,y,{sc:.55});for(const [x,y] of [[5,17],[7,9]])dec('bones',x,y,{sc:.8});
    for(const [x,y] of [[4,17],[8,17],[6,13],[4,9],[8,9],[6,6],[5,3],[7,3]])light(x,y);
    foe('saghoul',5,16);foe('saghoul',8,17);foe('sawight',5,10);foe('saraven',4,3);foe('saraven',8,4);
    person('sa_pip',6,2);
    dec('hl_p_chains',5,1,{sc:1});dec('hl_p_chains',7,1,{sc:.8});dec('ww_twig2',9,3,{block:true,npc:'sa_b_nest',sc:1.1});dec('wm_bucket',8,10,{});dec('ww_boot',4,18,{sc:1});dec('ww_crumbs',5,9,{sc:1})}});
const SA_NAMES={601:'The Hollow Cellar',602:'The Sale Crypt',603:'The Belfry of Sale'};
