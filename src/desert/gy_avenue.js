/* ==========================================================================
   THE VAULTS BENEATH THE AVENUE (level 542, rated 85; prefix gy / GY). A small dungeon under the Avenue of Vaults in the Wenlock Graveyard: a stair behind one of the tomb fronts on the west side of the
   Avenue goes down to a long hall, and off the hall open eight vaults, four to the north and four to the south, each with a sarcophagus, candles, cobwebs and one creature of the graveyard (level 86).
   When all eight are dead the party has "Cleansed the Avenue of Vaults": an achievement, 12,000 gold, a great deal of experience and Vaultbreaker, a level 88 weapon (once only; flag G.flags.gyAvenue).
   ========================================================================== */
const GY_AV={ID:542,W:31,H:19,start:{x:3,y:9,f:1},front:{x:51,y:22,f:1}};
const GY_AV_FOES=['gyskel','gyghoul','gywraith','gybmage','gyzombie','gybanshee','gypike','gygiant'];
ITEMDEF.gyavenue={n:'Vaultbreaker',k:'weapon',t:'Sword',ic:'sword',c:'#c8d8ff',dmg:[480,580],hit:.2,req:{str:70},lvl:88,price:0,rar:1,eff:{daze:.25,bleed:[.3,6,40],bossdmg:.4},dbl:.2,sw:.5,d:"A long grey blade found on the last sarcophagus of the Avenue of Vaults, cold to the hand and never rusted. One blow in four leaves the foe dazed, wounds bleed, and bosses take 40% more. Needs level 88."};
function gyAvenueBuild(){
  if(LEVELS[GY_AV.ID])return LEVELS[GY_AV.ID];
  gyAlias();
  const W=GY_AV.W,H=GY_AV.H,hs=(a,b,c)=>hash2(a,b,c),g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const rect=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]='.'};
  rect(3,8,28,10);
  const vaults=[];for(let i=0;i<4;i++){const x0=2+7*i;rect(x0,2,x0+4,6);g[7][x0+2]='.';vaults.push({x0,y0:2,y1:6,back:2,mid:4});rect(x0,12,x0+4,16);g[11][x0+2]='.';vaults.push({x0,y0:12,y1:16,back:16,mid:14})}
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const WH=3.0,open=(x,y)=>g[y]&&g[y][x]==='.',near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const V=[0,3,0,5,0,1,3,0,2].map(v=>ch(gyTile('texGrey_'+v,WH,{rgb:[.92,.95,1]})));
  const rows=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){s+=open(x,y)?'.':near(x,y)?V[(hs(x,y,9)*V.length)|0]:V[0]}rows.push(s)}
  {const gid=gyTile('texGrey_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:1.1,rgb:[1,1,1.00042]});
   KH_DOOR[gid]={lvl:GY.ID,get at(){return {x:GY_AV.front.x,y:GY_AV.front.y,f:GY_AV.front.f}},gy:'avenueexit'};
   rows[9]=rows[9].slice(0,2)+ch(gid)+rows[9].slice(3)}
  const decor=[],lights=[],lcol={},enemies=[];
  const dec=(a,x,y,o)=>{o=o||{};const k=GYA[a]?'gy_'+a:a;if(!open(x,y))return null;const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}if(o.sc)d.sc=o.sc;decor.push(d);return d};
  const light=(x,y,col)=>{lights.push([x,y]);if(col)lcol[x+','+y]=col};
  // the hall: candles and a warm glow, and bones
  for(let x=5;x<=27;x+=4)light(x,9,[1.4,1.0,.55]);
  for(const x of [4,12,20,27]){dec('candles',x,8,{block:true,sc:.7});dec('candles',x,10,{block:true,sc:.7})}
  for(const [x,y] of [[8,9],[16,9],[24,9]])dec('bones',x,y,{sc:.9});
  for(const [x,y] of [[3,8],[28,8],[3,10],[28,10],[14,8],[22,10]])dec('web',x,y,{sc:.5});
  // the eight vaults
  vaults.forEach((v,i)=>{const cx=v.x0+2,sd=v.y0<8?1:-1;
    dec('sarc',cx,v.back,{block:true,sc:1});dec('candles',v.x0,v.back,{block:true,sc:.65});dec('candles',v.x0+4,v.back,{block:true,sc:.65});
    light(cx,v.mid,[.45,1.05,.95]);light(v.x0,v.back,[1.5,1.0,.5]);light(v.x0+4,v.back,[1.5,1.0,.5]);
    for(const [x,y] of [[v.x0,v.y0],[v.x0+4,v.y0],[v.x0,v.y1],[v.x0+4,v.y1]])dec('web',x,y,{sc:.5});
    dec('bones',v.x0+1,v.mid+sd,{sc:.8});dec('bones',v.x0+3,v.mid,{sc:.7});
    enemies.push({t:GY_AV_FOES[i],x:cx,y:v.mid,lvl:86})});
  const fm=[];for(let y=0;y<H;y++)fm.push('3'.repeat(W));
  const names=[{t:'The Hall of the Avenue',x:15,y:9,k:'place'}];vaults.forEach((v,i)=>names.push({t:'Vault '+(i+1),x:v.x0+2,y:v.mid,k:'place'}));
  const L={rows,chars,fmap:fm,floorSet:gyCryptFloors(),floor:gyCryptFloors()[3],ceil:'gyc_crypt',ceilH:WH+1,start:{x:GY_AV.start.x,y:GY_AV.start.y,f:GY_AV.start.f},enemies,items:[],decor,lights,portals:[],day:0,amb:.05,torchGap:1e9,noTele:true,noExtras:true,
    name:GY.NAMES[542],label:GY.NAMES[542],diff:85,mapNames:names,_gy:{kind:'crypt',lcol}};
  LEVELS[GY_AV.ID]=L;LEVEL_NAMES[GY_AV.ID]=GY.NAMES[542];LEVEL_RATING[GY_AV.ID]=85;
  return L}
KH_LAZY[GY_AV.ID]=gyAvenueBuild;
/* the reward, once every creature in the vaults is dead */
CUTS.avenueDone=()=>[{text:'ACHIEVEMENT. You have cleansed the Avenue of Vaults.'},{text:'Something has been left on the last sarcophagus: a long grey blade, for those who laid the dead to rest. Look in your backpack...'}];
function gyAvenueReward(){
  const F=G.flags;if(F.gyAvenue)return;F.gyAvenue=1;G.gold+=12000;try{giveXP(90000)}catch(e){console.error(e)}
  if(!bagAdd(mkItem('gyavenue')))G.items.push({k:'gyavenue',x:G.P.x,y:G.P.y,taken:false});
  msg('Achievement: Cleansed the Avenue of Vaults. 12,000 gold, a great deal of experience, and Vaultbreaker, a level 88 sword.','#ffe36a');sfx('win');startCut('avenueDone')}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(LEVEL===GY_AV.ID&&G.state==='play'&&!G.cut&&!G.talk&&G.flags&&!G.flags.gyAvenue&&G.enemies&&G.enemies.every(e=>e.hp<=0)&&(G._gyAvT=(G._gyAvT||0)+dt)>1.5){G._gyAvT=0;gyAvenueReward()}else if(LEVEL!==GY_AV.ID)G._gyAvT=0}catch(e){console.error(e)}
  return r}}
/* the Achievements page also says so */
{const _d=drawAch;drawAch=function(){_d.apply(this,arguments);try{if(G.flags&&G.flags.gyAvenue)txt('Cleansed the Avenue of Vaults',240,273,8.5,'#e8d890','center',true)}catch(e){}}}
