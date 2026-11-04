/* ==========================================================================
   UNDER OLDHAVEN: THREE SMALL DUNGEONS (levels 6710, 6711, 6712; prefix ohu / OHU; the quests that use them are in oldhaven_tales.js).
   The sewer (6710) is entered by a manhole in the city (south of the great square) or a grating on the quay, and has a hidden door in a side chamber.
   The crypt (6711) is entered by a hatch beside the chapel in Chapel Close. The bandit hideaway (6712) is behind the hidden door of the sewer.
   Each is rooms and one-square passages (laid out by hand below), 36 squares wide, painted with the ordinary dungeon walls; creatures are the existing kinds at Oldhaven's rating (55).
   The hatches are placed by oldhaven.js (the city) and oldhaven_quay.js (the quay) from OHT_HATCHES, which records where the party comes back out in OHT_SPOTS.
   ========================================================================== */
const OHU={SEWER:6710,CRYPT:6711,HIDE:6712,RATE:{6710:55,6711:56,6712:57}};
const OHT_SPOTS={};
const OHT_HATCHES=[
  {id:'sewerCity',lv:305,at:[56,92],enter:{to:6710,x:18,y:30,f:0}},
  {id:'sewerQuay',lv:304,at:[47,23],enter:{to:6710,x:35,y:11,f:3}},
  {id:'crypt',lv:305,at:[42,65],enter:{to:6711,x:17,y:30,f:0}}];
const OHT=()=>{const F=G.flags;return F.oht||(F.oht={})};

/* ---- things carried for the quests ---- */
ITEMDEF.bellpin={n:'Clapper Pin',k:'quest',t:'Quest item',ic:'herb',c:'#c8a050',stack:0,price:0,d:'A thick bronze pin, as long as a hand. It holds the clapper inside the great bell of Oldhaven, and the bandits took it.',sw:.4};
ITEMDEF.bronzescrap={n:'Scrap of Bronze',k:'quest',t:'Quest item',ic:'herb',c:'#b87a3a',stack:1,price:0,d:'A lump of old bronze, green with age. The bellfounder will melt it down for the bell.',sw:.3};
ITEMDEF.heraldhat={n:'Herald’s Plumed Hat',k:'quest',t:'Quest item',ic:'herb',c:'#d0a8e0',stack:0,price:0,d:'A tall hat with a long white plume, a little chewed. The gull took it from the king’s herald.',sw:.3};
ITEMDEF.tansypie={n:'Dame Tansy’s Pie',k:'quest',t:'Quest item',ic:'parcel',c:'#d8b070',stack:1,price:0,d:'A small pie in a cloth, still warm. Dame Tansy wants it given to someone.',sw:.3};
ITEMDEF.mapchart={n:'Chart of the Sewers',k:'quest',t:'Quest item',ic:'parcel',c:'#e8d8a0',stack:0,price:0,d:'A rolled chart in Mistress Corvane’s hand. It shows the sewers under Oldhaven and where they run out beyond the east wall.',sw:.2};
const OHU_BOSS=(base,o)=>Object.assign({},ENEMY_DEF[base],{aboveParty:3,speed:1},o);
ENEMY_DEF.ohgratekin=OHU_BOSS('boss',{name:'The Grate King',hp:110,dmg:[11,17],xp:6000,gold:[500,800]});
ENEMY_DEF.ohcryptwarden=OHU_BOSS('skel',{name:'The Crypt Warden',hp:120,dmg:[12,19],hit:.8,xp:7000,gold:[600,900],verb:'strikes'});
ENEMY_DEF.ohcrowe=OHU_BOSS('gandrick',{name:'Wat Crowe',hp:125,dmg:[12,18],hit:.8,xp:8000,gold:[700,1100],verb:'slashes'});
for(const k of ['ohgratekin','ohcryptwarden','ohcrowe'])ENEMY_DEF[k].boss=true;

/* ---- the three layouts: rooms [x0,y0,x1,y1,name], passages [from,to,'v'|'h' first], creatures [room,kind,count], pieces [kind,x,y,extra] ---- */
const OHU_SPEC={
 6710:{W:38,H:34,name:'The Sewers of Oldhaven',floor:'mosscobble',start:{x:18,y:30,f:0},
  rooms:[[15,26,21,30,'The Manhole Landing'],[3,21,11,27,'The Settling Pool'],[14,14,24,21,'The Grate Hall'],[27,20,35,27,'The Rat Warren'],[29,8,35,15,'The Quay Outfall'],
         [13,3,23,10,'The Washing Cistern'],[2,2,10,9,'The Grate King’s Hall'],[2,12,8,18,'The Dry Ledge'],[26,2,32,5,'The Bricked Landing']],
  links:[[0,2,'v'],[0,1,'h'],[2,3,'h'],[3,4,'v'],[2,5,'v'],[5,6,'h'],[6,7,'v'],[1,7,'v'],[5,8,'h']],
  portals:[{ch:'0',x:18,y:31,to:'sewerCity',f:2},{ch:'1',x:36,y:11,to:'sewerQuay',f:2}],
  foes:[[0,'rat',1],[1,'rat',3],[1,'bat',2],[2,'rat',3],[2,'bat',2],[3,'rat',6],[3,'bat',1],[4,'bat',2],[4,'rat',2],[5,'rat',3],[5,'bat',2],[6,'rat',3],[7,'rat',1]],
  boss:[6,'ohgratekin'],
  items:[['bronzescrap',5,26],['bronzescrap',33,25],['bronzescrap',15,9],['potion',20,18],['potion',9,6]],
  decor:[['chest',9,3,{magic:1,goldAmt:700}],['chest',34,26],['chest',22,4],['barrel',34,9,{}],['barrel',16,28],['crate',4,26],
         ['gate',15,15,{npc:'oht_grate',solid:1}],['gate',23,15,{npc:'oht_grate',solid:1}],['gate',34,9,{npc:'oht_grate',solid:1}],['gate',4,22,{npc:'oht_grate',solid:1}],['gate',14,4,{npc:'oht_grate',solid:1}],
         ['ep_ratnest',30,25,{deco:1}],['ep_bonepile',6,25,{deco:1}],['ep_moss',20,6,{deco:1}],['ep_web_hang',17,17,{deco:1}],
         ['ep_rubble',31,4,{npc:'oht_stone',deco:1}],['@oht_pip',5,15,{}]]},
 6711:{W:36,H:34,name:'The Crypt Under the Chapel',start:{x:17,y:30,f:0},
  rooms:[[14,27,20,30,'The Crypt Stair'],[11,17,23,24,'The Nave of Tombs'],[3,17,8,24,'The West Ossuary'],[26,17,33,24,'The East Vault'],[3,8,9,14,'The Reliquary'],
         [26,8,33,14,'The Founders’ Chamber'],[12,2,23,11,'The Warden’s Hall'],[3,27,8,31,'The Light Well']],
  links:[[0,1,'v'],[1,2,'h'],[1,3,'h'],[1,6,'v'],[2,4,'v'],[3,5,'v'],[2,7,'v'],[4,6,'h'],[5,6,'h']],
  portals:[{ch:'0',x:17,y:31,to:'crypt',f:2}],
  foes:[[1,'skel',4],[1,'ghost',1],[2,'skel',3],[3,'skel',3],[3,'spectre',2],[4,'ghost',2],[4,'spectre',1],[5,'spectre',2],[5,'skel',2],[6,'skel',2],[7,'bat',2]],
  boss:[6,'ohcryptwarden'],
  items:[['heraldhat',5,29],['bronzescrap',30,19],['bronzescrap',7,10],['potion',16,19],['potion',28,12]],
  decor:[['chest',22,3,{magic:1,goldAmt:800}],['chest',4,9],['chest',32,18],['sarcoph',29,10,{npc:'oht_tomb',solid:1}],['sarcoph',13,18],['sarcoph',21,18],['sarcoph',13,23],['sarcoph',21,23],
         ['coffin',5,19],['coffin',5,22],['coffin',28,22],['bones',9,21],['ep_bonepile',31,22],['ep_candles',28,9,{deco:1}],['ep_candles',31,9,{deco:1}],['ep_ratnest',5,30,{deco:1}],['ep_skel_slump',16,3,{deco:1}],['ep_web_hang',15,19,{deco:1}]]},
 6712:{W:36,H:32,name:'Crowe’s Hideaway',floor:'dirt',start:{x:18,y:27,f:0},
  rooms:[[15,24,21,27,'The Hidden Landing'],[13,15,23,21,'The Guard Room'],[3,15,10,22,'The Barracks'],[26,17,33,23,'The Stash'],[3,5,10,11,'The Kitchen'],[13,3,23,11,'Crowe’s Hall'],[27,5,33,11,'The Ledger Nook']],
  links:[[0,1,'v'],[1,2,'h'],[1,3,'h'],[1,5,'v'],[2,4,'v'],[4,5,'h'],[5,6,'h'],[3,6,'v']],
  portals:[{ch:'0',x:18,y:28,to:'hideSewer',f:2}],
  foes:[[1,'bandit',3],[1,'archer',2],[2,'bandit',3],[3,'hitman',2],[3,'archer',1],[4,'bandit',2],[5,'bandit',2],[5,'archer',2],[6,'assassin',1]],
  boss:[5,'ohcrowe'],
  items:[['bellpin',30,8],['bronzescrap',6,8],['potion',18,22],['potion',29,21]],
  decor:[['chest',22,4,{magic:1,goldAmt:900}],['chest',27,18],['chest',32,22],['chest',31,18],['barrel',27,22],['barrel',32,19],['crate',28,21],['barrel',4,6],['barrel',9,10],['crate',5,20],['crate',8,16],
         ['ep_bonepile',4,21,{deco:1}],['ep_chains',14,4,{deco:1}],['ep_jar',31,6,{deco:1}],['ep_moss',15,19,{deco:1}]]}
};
function ohuBuild(id){
  if(LEVELS[id])return;
  const S=OHU_SPEC[id],W=S.W,H=S.H,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const rooms=S.rooms.map(r=>({x0:r[0],y0:r[1],x1:r[2],y1:r[3],n:r[4]}));
  rooms.forEach(r=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.'});
  const mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  const hl=(y,a,b)=>{for(let x=Math.min(a,b);x<=Math.max(a,b);x++)g[y][x]='.'},vl=(x,a,b)=>{for(let y=Math.min(a,b);y<=Math.max(a,b);y++)g[y][x]='.'};
  for(const [a,b,m] of S.links){const [ax,ay]=mid(rooms[a]),[bx,by]=mid(rooms[b]);if(m==='v'){vl(ax,ay,by);hl(by,ax,bx)}else{hl(ay,ax,bx);vl(bx,ay,by)}}
  const sp=OHT_SPOTS,back=k=>{const s=sp[k];return s&&s.back?{x:s.back[0],y:s.back[1],f:2}:{x:74,y:141,f:0}};
  const portals=[];
  for(const p of S.portals){g[p.y][p.x]=p.ch;const t=p.to==='hideSewer'?{x:32,y:3,f:3}:back(p.to);portals.push({to:p.to==='hideSewer'?OHU.SEWER:p.to==='sewerQuay'?304:p.to==='sewerCity'?305:305,x:t.x,y:t.y,f:t.f,tex:'tomb'})}
  if(id===OHU.SEWER){portals.push({to:OHU.HIDE,x:18,y:27,f:0,tex:'tomb',req:'ohtDoor',lock:'A wall of wet brick. Nothing moves.'})}   // portal 2: the hidden door, opened by the loose brick (ohuDoorOpen)
  const rows=g.map((r,y)=>r.map((c,x)=>{if(c!=='#')return c;if(x>0&&g[y][x-1]==='.'&&hash2(x,y,70+id)<.07)return '%';if(y>0&&g[y-1][x]==='.'&&hash2(x,y,71+id)<.07)return '%';return '#'}).join(''));
  const used=new Set([S.start.x+','+S.start.y]),inRoom=(r,x,y)=>x>=r.x0&&x<=r.x1&&y>=r.y0&&y<=r.y1;
  const enemies=[],items=[],decor=[];
  const cellsOf=(ri)=>{const r=rooms[ri],o=[];for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)if(Math.hypot(x-S.start.x,y-S.start.y)>3)o.push([x,y]);return o};
  S.items.forEach(([k,x,y])=>{items.push({k,x,y});used.add(x+','+y)});
  S.decor.forEach(([k,x,y,o])=>{used.add(x+','+y)});
  let n=0;
  for(const [ri,t,c] of S.foes){const cs=cellsOf(ri);for(let i=0;i<c;i++){for(let tr=0;tr<60;tr++){const q=cs[(hash2(ri*7+i,n++,id)*cs.length)|0];if(q&&!used.has(q[0]+','+q[1])){used.add(q[0]+','+q[1]);enemies.push({t,x:q[0],y:q[1]});break}}}}
  {const r=rooms[S.boss[0]],[mx,my]=mid(r);enemies.push({t:S.boss[1],x:mx,y:my+1});used.add(mx+','+(my+1))}
  for(const [k,x,y,o0] of S.decor){
    const o=o0||{};
    if(k[0]==='@'){const kp=KH_KEEPERS[k.slice(1)];if(kp)decor.push({k:khFaceKey(kp.face),x,y,block:false,walk:true,npc:k.slice(1),sc:kp.sc||1});continue}
    if(k.startsWith('ep_')&&!IMG[k])continue;
    const d=Object.assign({k,x,y,block:!o.deco&&!o.npc||!!o.solid},o);
    if(o.deco){d.block=false;d.walk=true;delete d.deco;d.deco=true}
    decor.push(d)}
  const mapNames=rooms.map(r=>{const [mx]=mid(r);return {t:r.n,x:mx,y:r.y0-1,k:'place'}});
  const lv={rows,start:Object.assign({},S.start),enemies,items,decor,name:S.name,label:'Under Oldhaven',diff:OHU.RATE[id],portals,lights:[],mapNames};
  if(S.floor)lv.floor=S.floor;
  lv._rooms=rooms;
  LEVELS[id]=lv;LEVEL_NAMES[id]=S.name;LEVEL_RATING[id]=OHU.RATE[id];
}
for(const id of [OHU.SEWER,OHU.CRYPT,OHU.HIDE]){LEVEL_NAMES[id]=OHU_SPEC[id].name;LEVEL_RATING[id]=OHU.RATE[id];KH_LAZY[id]=()=>{seaBuild(304);ohBuild();ohuBuild(id)}}
/* the hidden door of the sewer opens when the loose brick is pressed (oht_stone); the door is a wall until then */
const OHU_DOOR={x:33,y:3};
function ohuDoorOpen(){
  if(LEVEL!==OHU.SEWER||!G.grid||!G.grid[OHU_DOOR.y])return;
  if(OHT().door){G.grid[OHU_DOOR.y][OHU_DOOR.x]=32;G.flags.ohtDoor=1}
}
{const _oe=ohEnter;ohEnter=function(n){
  const r=_oe.apply(this,arguments);
  try{
    if(n===OHU.SEWER){OHT().sewer=1;ohuDoorOpen()}
    if(n===OHU.CRYPT)OHT().crypt=1;
    if(n===OHU.HIDE)OHT().hide=1;
    if(n>=OHU.SEWER&&n<=OHU.HIDE){const p=OHT().pipGone&&G.decor.find(d=>d.npc==='oht_pip');if(p){p.hidden=true;p.block=false}}
  }catch(e){console.error('ohu',e)}
  return r}}
/* the dungeons' own people and pieces */
khNpc('oht_grate','An iron grating','gate',d=>{
  const GR=[[15,15],[23,15],[34,9],[4,22],[14,4]],i=GR.findIndex(q=>q[0]===d.x&&q[1]===d.y),T=OHT();T.grates=T.grates||{};if(i>=0)T.grates[i]=1;
  return say(`An iron grating set into the wall, with a number painted beside it: grating ${i+1}. Dirty water runs through the bars and out into the dark.`,[BYE])});
khNpc('oht_stone','A loose brick','ep_rubble',()=>{
  const T=OHT();
  if(T.door)return say('The loose brick is pushed in. The hidden door in the east wall of this chamber stands open.',[BYE]);
  return say('One brick in the wall is loose, and fresh scrapes in the mortar show that hands have pressed it often. Press it?',[['Press the brick.',()=>{T.door=1;sfx('door');ohuDoorOpen();msg('Somewhere in the wall, stone grinds on stone. A hidden door opens in the east wall.','#e8d070');return say('The brick sinks into the wall. A section of the east wall swings inward, and cold dry air blows out of a stair beyond it. This is the way to the bandits’ hideaway.',[BYE])}],BYE])});
khNpc('oht_tomb','A tomb of the Thanes','sarcoph',()=>{
  const T=OHT();T.tomb=1;
  return say('A stone tomb with a carved lamp on the lid. The letters read: HERE LIES EDRIC THANE, FIRST LAMPLIGHTER OF OLDHAVEN. HE KEPT THE LAMPS LIT THROUGH THE LONG WINTER. Dust lies thick on the lid, and a few dead lamp-wicks lie beside it.',[BYE])});
khNpc('oht_pip','Pip, a boy','kh_ohfolk4_4',()=>{
  const T=OHT();
  if(T.pip)return say('Pip is already on his way home.',[BYE]);
  return say('A boy sits on the ledge, wet through and shivering. "I came down after my ball and the grating shut behind me. I have been here since yesterday. There are rats on the stairs, and men with knives went through a wall at the north end, past the cistern, in the bricked-off chamber. Please take me home."',[['Walk home, Pip. We have cleared the way.',()=>{T.pip=1;T.pipGone=1;const p=G.decor.find(d=>d.npc==='oht_pip');if(p){p.hidden=true;p.block=false}msg('Pip runs for the manhole and is gone.','#9ae0a0');return say('"Thank you! Tell my mam I am coming!" He splashes away towards the stair.',[BYE])}],BYE])},{sc:.8});
/* the world atlas lists the rooms under Oldhaven with the quay */
if(typeof WMW_INTERIOR!=='undefined')WMW_INTERIOR.push([6710,6712,'oldhaven','the sewer, crypt and hideaway under Oldhaven']);
