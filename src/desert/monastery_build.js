/* ==========================================================================
   SAINT ELEN'S MONASTERY, part three: the grounds, the cemetery, the cellars, the crypts and the mausoleum.
   ========================================================================== */
MON.CEM_IN=[3,20];
/* painted ornaments for the fronts of the buildings: stained glass, a rose window, banners, ivy and roses, shuttered windows, a saint in a niche */
for(const n of ['glass','rose','banner','ivy','shutter','statue','cross','grille'])loadImg('mw_'+n,'assets/mw_'+n+'.png');
Object.assign(NPC_H,{mw_glass:2.3,mw_rose:1.5,mw_banner:2.1,mw_ivy:2.0,mw_shutter:.95,mw_statue:1.3,mw_cross:1.3,mw_grille:.95});
for(const n of ['pew','altar','saint','candel','font','lectern','chand','angel'])loadImg('mi_'+n,'assets/mi_'+n+'.png');
Object.assign(NPC_H,{mi_pew:.55,mi_altar:.95,mi_saint:1.75,mi_candel:1.6,mi_font:.8,mi_lectern:1.0,mi_chand:.95,mi_angel:1.75});
/* inside the chapel: an aisle of little pews, an altar with saints and angels, coloured windows down both walls, candelabra and chandeliers */
function monChapelTpl(b){return {w:11,h:15,floor:'kh2',amb:.8,noExtras:true,lights:[[3,2],[7,2],[5,5],[5,9],[2,6],[8,6],[2,10],[8,10],[5,12]],build:({raw,npc,mid})=>{
  const pic=(n,x,y,wd,bob)=>raw(n,x,y,{pic:1,wd,block:false,walk:true,bob:bob||0});
  // the north wall: a great rose window over the altar, coloured glass beside it
  pic('mw_rose',5,1,[0,-1],1.9);pic('mw_glass',3,1,[0,-1],.7);pic('mw_glass',7,1,[0,-1],.7);pic('mw_banner',1,1,[0,-1],.7);pic('mw_banner',9,1,[0,-1],.7);
  // the long walls: tall stained glass, and banners between
  for(const y of [3,7,11]){pic('mw_glass',1,y,[-1,0],.6);pic('mw_glass',9,y,[1,0],.6)}
  for(const y of [5,9]){pic('mw_banner',1,y,[-1,0],.7);pic('mw_banner',9,y,[1,0],.7)}
  // the worship area: the altar, two angels and two saints, candelabra either side
  raw('mi_altar',5,2,{block:true});
  raw('mi_angel',3,2,{block:true});raw('mi_angel',7,2,{block:true});
  raw('mi_saint',2,3,{block:true});raw('mi_saint',8,3,{block:true});
  raw('mi_candel',4,2,{block:true});raw('mi_candel',6,2,{block:true});
  raw('mi_lectern',4,4,{block:true});
  // little pews down both sides of the aisle
  for(const y of [6,8,10,12]){raw('mi_pew',2,y,{block:true});raw('mi_pew',3,y,{block:true});raw('mi_pew',7,y,{block:true});raw('mi_pew',8,y,{block:true})}
  raw('mi_candel',1,6,{block:true});raw('mi_candel',9,6,{block:true});raw('mi_candel',1,10,{block:true});raw('mi_candel',9,10,{block:true});
  raw('mi_font',9,13,{block:true});raw('mw_cross',1,13,{block:true});
  // chandeliers hang over the aisle
  for(const y of [5,9])raw('mi_chand',5,y,{block:false,walk:true,bob:2.15});
  npc(b.keeper,6,4);
}}}
/* the nave of the church: the chapel's furnishings on a grander plan */
function monChurchTpl(b){return {w:15,h:21,floor:'kh2',amb:.8,noExtras:true,lights:[[4,2],[10,2],[7,6],[7,11],[7,16],[2,8],[12,8],[2,14],[12,14]],build:({raw,npc})=>{
  const pic=(n,x,y,wd,bob)=>raw(n,x,y,{pic:1,wd,block:false,walk:true,bob:bob||0});
  pic('mw_rose',7,1,[0,-1],2.5);pic('mw_glass',4,1,[0,-1],.8);pic('mw_glass',10,1,[0,-1],.8);pic('mw_banner',2,1,[0,-1],.8);pic('mw_banner',12,1,[0,-1],.8);
  for(const y of [3,7,11,15]){pic('mw_glass',1,y,[-1,0],.7);pic('mw_glass',13,y,[1,0],.7)}
  for(const y of [5,9,13,17]){pic('mw_banner',1,y,[-1,0],.8);pic('mw_banner',13,y,[1,0],.8)}
  raw('mi_altar',7,2,{block:true});raw('mi_angel',5,2,{block:true});raw('mi_angel',9,2,{block:true});
  raw('mi_saint',3,3,{block:true});raw('mi_saint',11,3,{block:true});raw('mi_candel',6,2,{block:true});raw('mi_candel',8,2,{block:true});
  raw('mi_lectern',6,4,{block:true});
  for(const y of [8,10,12,14,16,18])for(const x of [2,3,4,5,9,10,11,12])raw('mi_pew',x,y,{block:true});
  for(const [x,y] of [[1,7],[13,7],[1,11],[13,11],[1,15],[13,15]])raw('mi_candel',x,y,{block:true});
  raw('mi_font',13,19,{block:true});raw('mw_cross',1,19,{block:true});
  for(const y of [6,11,16])raw('mi_chand',7,y,{block:false,walk:true,bob:3.1});
  npc(b.keeper,8,4);
}}}
/* the scriptorium: shelves of books along the wall, lecterns with open books, candelabra for the evenings */
function monScriptTpl(b){return {w:11,h:8,amb:.7,noExtras:true,lights:[[2,2],[8,2],[5,4],[3,6],[7,6]],build:({put,raw,npc,mid,has})=>{
  for(const x of [2,3,4,6,7,8])put('shelf',x,1);
  for(const [x,y] of [[2,4],[4,4],[6,4],[8,4],[3,6],[7,6]])raw('mi_lectern',x,y,{block:true});
  raw('mi_candel',1,3,{block:true});raw('mi_candel',9,3,{block:true});raw('mi_candel',1,6,{block:true});raw('mi_candel',9,6,{block:true});
  npc(b.keeper,mid,2);
}}}
/* the other rooms: the plain furnishings stay, and painted windows, banners, candelabra and a chandelier are added */
function monWrapTpl(room){return bb=>{
  const base={hall:khRoomHall,home:khRoomHome,inn:khRoomInn,prayer:khRoomPrayer}[room](bb);
  return Object.assign({},base,{build:h=>{base.build(h);const {raw,has,W,H,mid}=h;
    const pic=(n,x,y,wd,bob)=>{if(!has(x,y))raw(n,x,y,{pic:1,wd,block:false,walk:true,bob:bob||0})};
    for(let x=2;x<=W-3;x+=3)pic('mw_shutter',x,1,[0,-1],.7);
    for(let y=3;y<=H-4;y+=3){pic('mw_banner',1,y,[-1,0],.1);pic('mw_banner',W-2,y,[1,0],.1)}
    for(const [x,y] of [[1,H-3],[W-2,H-3]])if(!has(x,y))raw('mi_candel',x,y,{block:true});
    if(!has(mid,3))raw('mi_chand',mid,3,{block:false,walk:true,bob:1.5});
  }})}}
function monFacade(b,k,decor){
  const y=b.y1+1,P=(n,x,bob)=>decor.push({k:'mw_'+n,x,y,wd:[0,-1],pic:1,block:false,walk:true,deco:true,bob:bob||0});
  const clear=x=>Math.abs(x-b.dx)>=2;
  if(b.chapel){ // the chapel: stained glass, banners, a rose window over the door, roses on the corners
    for(const x of [b.dx-4,b.dx+4])P('glass',x,.7);
    for(const x of [b.dx-2,b.dx+2])P('banner',x,.7);
    P('rose',b.dx,3.1);P('ivy',b.x0,0);P('ivy',b.x1,0);P('statue',b.dx-3,.4);P('statue',b.dx+3,.4);
    return}
  if(k===0){ // the church: tall stained glass, banners between, a rose window over the door, saints in niches, roses on the corners
    for(const x of [b.dx-6,b.dx+6])P('glass',x,.5);
    for(const x of [b.dx-4,b.dx+4])P('banner',x,.6);
    P('rose',b.dx,2.2);
    P('statue',b.dx-2,.4);P('statue',b.dx+2,.4);
    P('ivy',b.x0,0);P('ivy',b.x1,0);
    return}
  const step=k===1||k===2?3:2;
  for(let x=b.x0+1;x<=b.x1-1;x+=step){if(!clear(x))continue;P(k===5&&x===b.x0+1?'statue':k===3&&(x-b.x0)%4===1?'grille':'shutter',x,k===5&&x===b.x0+1?.3:.8)}
  P('ivy',b.x0,0);if(k!==3)P('ivy',b.x1,0);
  if(k===4||k===2)P('banner',b.dx+3>b.x1?b.dx-3:b.dx+3,.5);
}
for(const [id,n,face,lines] of [
  ['mon_novice1','A novice','kh_ohfolk7_1',["I have been here four months. I thought I would miss talking. I do not.","I sweep the cloister every morning. It does not need it. That is the point.","The bees do not mind me. I think they are the only ones who do not mind anyone."]],
  ['mon_novice2','A novice with a watering can','kh_ohfolk1_5',["The roses here are older than the church. Nobody remembers who planted them.","Watering is the nicest chore. You can see what you did.","Do not step on the lavender. It does not complain, but it remembers."]],
  ['mon_monk3','A monk, sitting','kh_ohfolk1_4',["I am thinking about nothing in particular. It is a good day for it.","A fountain is a clock that tells you the hour with sound. I have never found a better one.","The orchard is at its best at four. Go and see."]]
])khNpc(id,n,face,()=>yrLines(id,lines));
const MON_OAKS=['ltree0','ltree4','ltree8','ltree12','ltree19'];
function monDungeons(){
  if(LEVELS[MON.CELLAR])return;
  const NM=[['The Cellar Stair','The Wine Racks','The Cold Passage','The Barrel Hall','The Cheese Store','The Old Pantry','The Salt Room','The Way Down'],
    ['The Crypt Stair','The Long Gallery','The Brothers’ Niches','The Weeping Chapel','The Candle Room','The Cold Vault','The Reliquary','The Abbot’s Chamber'],
    ['The Door','The Quiet Room','The Family Vault','The Little Chapel','The Stone Bench','The Dim Corner','The Lantern Niche','The End']];
  const cel=monCrypt({n:1,W:31,H:23,rooms:7,foes:14,kinds:['ghost','ghost','ghost','ghost','ghost','bat','rat'],diff:30,name:LEVEL_NAMES[MON.CELLAR],names:NM[0],up:{to:MON.ID,x:30,y:57,f:2},down:{to:MON.CRYPT}});
  const cry=monCrypt({n:2,W:37,H:25,rooms:8,foes:12,kinds:['ghost','ghost','ghost','spectre','skel'],boss:'weepingbrother',ring:1,diff:33,name:LEVEL_NAMES[MON.CRYPT],names:NM[1],up:{to:MON.CELLAR,x:0,y:0,f:2}});
  const mau=monCrypt({n:3,W:21,H:15,rooms:3,foes:3,kinds:['ghost'],diff:30,name:LEVEL_NAMES[MON.MAUS],names:NM[2],up:{to:MON.CEM,x:41,y:12,f:2}});
  cel.portals[1].x=cry.start.x;cel.portals[1].y=cry.start.y;cel.portals[1].f=0;
  if(cel._down){cry.portals[0].x=cel._down.x;cry.portals[0].y=cel._down.y;cry.portals[0].f=2}
  LEVELS[MON.CELLAR]=cel;LEVELS[MON.CRYPT]=cry;LEVELS[MON.MAUS]=mau;
}
function monBuild(){
  if(LEVELS[MON.ID])return;
  if(typeof KH_READY!=='undefined'&&!KH_READY)return;
  ohAlias();oqAlias();ohArt();ohFloors();ohStyles();isleFloors();lpArt();monDungeons();
  const hs=(a,b,c)=>hash2(a,b,c),TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  /* ---------- the grounds ---------- */
  {const W=MON.W,H=MON.H,N=W*H,rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
    const fm=new Array(N).fill('2'),h=new Float32Array(N).fill(.3),rk=new Float32Array(N),block=new Uint8Array(N);
    const decor=[],scenery=[],sky=[],lights=[],items=[],used=new Set();
    const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
    const free=(x,y)=>x>3&&y>3&&x<W-4&&y<H-4&&rows[y][x]==='.'&&!used.has(x+','+y);
    const dc=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}))};
    const tryDc=(k,x,y,o)=>{if(free(x,y)){dc(k,x,y,o);return true}return false};
    const FLO=['lflora0','lflora0_1','lflora0_2'];
    const flower=(x,y,sc)=>{if(!free(x,y))return;used.add(x+','+y);const k=FLO[(hs(x,y,5)*3)|0];scenery.push({k,wx:x+.5,wy:y+.5,sc:sc||.6,decor:{k,walk:true,x,y}})};
    const path=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(rows[y][x]==='.')fm[y*W+x]='1'};
    const lamp=(x,y)=>{if(tryDc('lamp',x,y))lights.push([x,y])};
    const person=(id,x,y)=>{const kp=KH_KEEPERS[id];if(!kp)return;for(let r=0;r<4;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(free(x+dx,y+dy)){used.add((x+dx)+','+(y+dy));decor.push({k:khFaceKey(kp.face),x:x+dx,y:y+dy,block:false,walk:true,npc:id,sc:kp.sc||1});return}}};
    // the outer wall, four thick
    const wp=ch(TM.make('plain','castle2',2.3).gid),wq=ch(TM.make('plain','castle',2.3).gid);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<4||x>=W-4||y<4||y>=H-4)solid(x,y,(x+y)%5===0?wq:wp);
    // gravel paths
    path(41,16,42,67);path(14,34,70,35);path(14,30,15,35);path(68,30,69,35);path(12,46,13,49);path(70,46,71,49);path(12,48,71,49);path(71,34,79,35);path(27,48,28,49);path(42,17,61,17);path(60,14,61,17);
    // the gates: south (to the pass) and east (to the cemetery)
    {const md=lpMonDoor(),dt=TM.make('door','castle',2.6),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;KH_DOOR[dgid]={lvl:LP.BASE+LPM.SEG,at:{x:md.x-1,y:md.y,f:3}};solid(42,H-4,ch(dgid));solid(41,H-4,wq);solid(43,H-4,wq)}
    {const dt=TM.make('door','castle',2.6),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;KH_DOOR[dgid]={lvl:MON.CEM,at:{x:MON.CEM_IN[0],y:MON.CEM_IN[1],f:1}};solid(W-4,34,ch(dgid))}
    // the buildings
    MON_BLD.forEach((b,k)=>{
      const plain=ch(TM.make('plain',b.st,b.wh).gid),win=ch(TM.make('window',b.st,b.wh).gid),dt=TM.make('door',b.st,b.wh),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;KH_DOOR[dgid]={lvl:b.rid,at:b.at};
      for(let y=b.y0;y<=b.y1;y++)for(let x=b.x0;x<=b.x1;x++){const door=x===b.dx&&y===b.y1;solid(x,y,door?ch(dgid):((x+y)%3===0&&y>b.y0&&y<b.y1)?win:plain);used.add(x+','+y)}
      sky.push({x:(b.x0+b.x1+1)/2,y:(b.y0+b.y1+1)/2,k:'kh_ohroof1_'+[0,0,0,2,2,2,0][k],w:(b.y1-b.y0+1)+.9,z:b.wh-.03}); // grey slate on the stone buildings, red clay tile on the cottages
      monFacade(b,k,decor);
      for(const dx of [-1,1])decor.push({k:'flowerpot',x:b.dx+dx,y:b.y1+1,block:false,walk:true,deco:true,sc:.8});
      if(b.chapel)sky.push({x:(b.x0+b.x1+1)/2,y:(b.y0+b.y1+1)/2,k:'kh_ohtower1_4',w:3.6,z:b.wh-.03},{x:b.x0-.3,y:b.y0+1.2,k:'kh_ohtower1_0',w:1.9,z:b.wh-.03},{x:b.x1+1.3,y:b.y0+1.2,k:'kh_ohtower1_0',w:1.9,z:b.wh-.03},{x:b.x0-.3,y:b.y1-.2,k:'kh_ohtower1_4',w:1.4,z:b.wh-.03},{x:b.x1+1.3,y:b.y1-.2,k:'kh_ohtower1_4',w:1.4,z:b.wh-.03});
      if(b.tower)sky.push({x:b.x1+1.4,y:b.y0+1.5,k:'kh_ohtower1_4',w:2.1,z:b.wh-.03},{x:b.x0-.4,y:b.y0+1.5,k:'kh_ohtower1_0',w:1.9,z:b.wh-.03}); // the church: a spired bell tower and a slate cone turret
      LEVEL_NAMES[b.rid]=b.name;const rid=b.rid,front=[b.dx,b.y1+1];
      const mk=()=>{if(LEVELS[rid])return;const bb={id:b.room==='inn'?'mon_guest':'mon'+k,name:b.name,room:b.room,keeper:b.keeper,scene:b.scene,wallImg:'kh_ohwall1_'+(k%3),floor:b.room==='hall'?'cobble':'wood',tpl:b.chapel?monChapelTpl:b.church?monChurchTpl:b.script?(bb=>{const t=monScriptTpl(bb),old=t.build;return Object.assign({},t,{build:h=>{old(h);const {raw,has,W,H,mid}=h;for(let y=3;y<=H-4;y+=3){if(!has(1,y))raw('mw_banner',1,y,{pic:1,wd:[-1,0],block:false,walk:true,bob:.1});if(!has(W-2,y))raw('mw_banner',W-2,y,{pic:1,wd:[1,0],block:false,walk:true,bob:.1})}for(const x of [3,7])raw('mw_shutter',x,H-1>1?1:1,{pic:1,wd:[0,-1],block:false,walk:true,bob:1.2});raw('mi_chand',mid,4,{block:false,walk:true,bob:1.5})}})}):monWrapTpl(b.room)};
        const R=khRoom(bb,rid,{to:MON.ID,x:front[0],y:front[1],f:2});R.level.ceilH=b.chapel?3.4:b.church?4.4:2.6;LEVELS[rid]=R.level};
      KH_LAZY[rid]=mk;
      for(let x=b.x0-1;x<=b.x1+1;x++)used.add(x+','+(b.y1+1));
    });
    // the cloister lawn: a fountain, benches and a bell
    if(IMG.kh_ohgard1_0){dc('kh_ohgard1_0',46,31,{block:true,walk:false});lights.push([46,31])}
    const BENCH=IMG.kh_ohgard1_3?'kh_ohgard1_3':null;
    if(BENCH)for(const [x,y] of [[44,29],[48,31],[44,33],[37,31],[37,27],[48,27]])tryDc(BENCH,x,y);
    dc('memorial',38,18,{block:true,walk:false,npc:'mon_bell',sc:.9});
    // flower beds all over the lawns, hedges beside the paths
    for(let y=5;y<H-5;y++)for(let x=5;x<W-5;x++){if(!free(x,y)||fm[y*W+x]==='1')continue;
      const near=(fm[y*W+x+1]==='1'||fm[y*W+x-1]==='1'||fm[(y+1)*W+x]==='1'||fm[(y-1)*W+x]==='1');
      if(near&&hs(x,y,61)<.55)flower(x,y,.5+hs(x,y,62)*.3);else if(hs(x,y,63)<.05)flower(x,y,.6)}
    for(let y=17;y<=65;y+=2){if(IMG.lbush0){for(const x of [40,43])if(hs(x,y,64)<.55&&free(x,y))dc('lbush0',x,y,{block:false,walk:true,sc:.9})}}
    // oaks round the inside of the wall, and a few on the lawns
    for(let n=0;n<150;n++){const x=5+((hs(n,1,65)*(W-10))|0),y=5+((hs(n,2,65)*(H-10))|0);const edge=x<9||x>W-10||y<9||y>H-10;if(!edge&&hs(n,3,65)>.12)continue;if(!free(x,y)||fm[y*W+x]==='1')continue;
      used.add(x+','+y);decor.push({k:MON_OAKS[(hs(n,4,65)*5)|0],x,y,block:true,sc:.9+hs(n,5,65)*.5,ox:(hs(n,6,65)-.5)*.4,oy:(hs(n,7,65)-.5)*.4})}
    // the herb garden: rows of flowers and herbs, with the hatch down to the cellars
    for(const y of [53,56,59,62])for(let x=9;x<=25;x++)if(hs(x,y,66)<.8)flower(x,y,.65);
    for(let n=0;n<14;n++){const x=9+((hs(n,1,67)*17)|0),y=53+((hs(n,2,67)*11)|0);if(free(x,y)){used.add(x+','+y);items.push({k:'herb',x,y})}}
    {const c=LEVELS[MON.CELLAR];if(IMG.dhatch)decor.push({k:'dhatch',x:30,y:56,block:true,deco:true,enter:{to:MON.CELLAR,x:c.start.x,y:c.start.y,f:0}});used.add('30,56')}
    // the orchard
    for(let i=0;i<7;i++)for(let j=0;j<3;j++){const x=50+4*i,y=54+5*j;if(free(x,y)){used.add(x+','+y);decor.push({k:MON_OAKS[(i+j)%5],x,y,block:true,sc:1.05,ox:0,oy:0});
      for(const [dx,dy] of [[1,1],[-1,1]])if(hs(x+dx,y+dy,68)<.3&&free(x+dx,y+dy)){used.add((x+dx)+','+(y+dy));items.push({k:'apple',x:x+dx,y:y+dy})}}}
    for(let n=0;n<6;n++){const x=50+((hs(n,1,69)*26)|0),y=52+((hs(n,2,69)*12)|0);if(free(x,y)){used.add(x+','+y);items.push({k:'apple',x,y})}}
    // the apiary
    if(IMG.kh_ohgard2_0)for(const [x,y] of [[44,56],[46,57],[44,58]])dc('kh_ohgard2_0',x,y,{block:true,walk:false});
    for(const [x,y] of [[43,59],[45,60],[47,59],[43,55]])if(free(x,y)){used.add(x+','+y);items.push({k:'honeycomb',x,y})}
    // wildflowers lying about the lawns
    for(let n=0;n<40&&items.filter(i=>i.k==='wildflower').length<12;n++){const x=6+((hs(n,1,70)*(W-12))|0),y=6+((hs(n,2,70)*(H-12))|0);if(free(x,y)&&fm[y*W+x]!=='1'){used.add(x+','+y);items.push({k:'wildflower',x,y})}}
    items.push({k:'potion',x:41,y:60});
    for(let y=20;y<=64;y+=8){lamp(40,y);lamp(43,y)}
    for(const [x,y] of [[13,31],[69,31],[13,47],[71,47]])lamp(x,y);
    // the people
    [['mon_abbot',45,18],['mon_bellman',36,18],['mon_herb',16,56],['mon_bees',45,61],['mon_cellar',32,55],['mon_novice1',40,38],['mon_novice2',22,36],['mon_monk3',47,32],['mon_novice1',55,40]].forEach(([id,x,y])=>person(id,x,y));
    const lv={rows:rows.map(r=>r.join('')),start:{x:MON.GATE_IN[0],y:MON.GATE_IN[1],f:0},enemies:[],items,decor,scenery,sky,fmap:null,floorSet:['ohMeadow','ohGravel','ohLawn','ohPale','ohMoss'],floor:'ohLawn',ceil:'cloud',day:.98,outdoor:true,amb:.9,
      name:LEVEL_NAMES[MON.ID],label:'Saint Elen’s',noExtras:false,diff:25,ceilH:5.2,chars,lights,portals:[],
      mapNames:[{t:'The Church of Saint Elen',x:41,y:7,k:'place'},{t:'The Chapel of the Lamps',x:60,y:5,k:'place'},{t:'The Cloister Garden',x:41,y:27,k:'place'},{t:'The Refectory',x:14,y:21,k:'place'},{t:'The Scriptorium',x:68,y:21,k:'place'},{t:'The Kitchen',x:12,y:39,k:'place'},{t:'The Guest House',x:70,y:37,k:'place'},{t:'The Infirmary',x:27,y:41,k:'place'},{t:'The Herb Garden',x:17,y:51,k:'place'},{t:'The Orchard',x:62,y:51,k:'place'},{t:'The Apiary',x:45,y:54,k:'place'},{t:'To the Cemetery',x:74,y:33,k:'lane'},{t:'The Hatch to the Cellars',x:30,y:55,k:'lane'},{t:'The Gate to the Pass',x:41,y:64,k:'lane'}]};
    const fmp=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=fm[y*W+x];fmp.push(r)}lv.fmap=fmp;
    LEVELS[MON.ID]=lv;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=chars[rows[y][x]];if(c>=30&&c<100)block[y*W+x]=0}
    TERRS[MON.ID]=yarTerrain(W,H,h,rk,block);
  }
  /* ---------- the cemetery ---------- */
  {const W=52,H=40,rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
    const fm=new Array(W*H).fill('2'),h=new Float32Array(W*H).fill(.3),rk=new Float32Array(W*H),block=new Uint8Array(W*H);
    const decor=[],scenery=[],sky=[],lights=[],items=[],used=new Set();
    const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
    const free=(x,y)=>x>2&&y>2&&x<W-3&&y<H-3&&rows[y][x]==='.'&&!used.has(x+','+y);
    const dc=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}))};
    const FLO=['lflora0','lflora0_1','lflora0_2'];
    const wp=ch(TM.make('plain','castle2',2.3).gid),wq=ch(TM.make('plain','castle',2.3).gid);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<3||x>=W-3||y<3||y>=H-3)solid(x,y,(x+y)%5===0?wq:wp);
    {const dt=TM.make('door','castle',2.6),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;KH_DOOR[dgid]={lvl:MON.ID,at:{x:W-4+0,y:34,f:3}};KH_DOOR[dgid].at={x:79,y:34,f:3};solid(2,20,ch(dgid))}
    // paths
    for(let x=3;x<=40;x++)for(const y of [20,21])fm[y*W+x]='1';for(let y=12;y<=34;y++)for(const x of [24,25])fm[y*W+x]='1';for(let y=12;y<=20;y++)for(const x of [40,41])fm[y*W+x]='1';
    // the mausoleum
    {const mx0=37,mx1=45,my0=5,my1=11,wh=3.4,plain=ch(TM.make('plain','cream',wh).gid),win=ch(TM.make('window','cream',wh).gid),dt=TM.make('door','cream',wh),dgid=KH_NEXT_GID++;T_TILE[dgid]=dt.tex;
      const mc=LEVELS[MON.MAUS];KH_DOOR[dgid]={lvl:MON.MAUS,at:{x:mc.start.x,y:mc.start.y,f:0}};
      for(let y=my0;y<=my1;y++)for(let x=mx0;x<=mx1;x++){solid(x,y,(x===41&&y===my1)?ch(dgid):((x+y)%3===0&&y>my0)?win:plain);used.add(x+','+y)}
      sky.push({x:41.5,y:8.5,k:'kh_ohroof1_3',w:7.6,z:wh-.03},{x:mx1+1.2,y:my0+1.4,k:'kh_ohtower1_0',w:1.6,z:wh-.03});
      for(let x=mx0-1;x<=mx1+1;x++)used.add(x+','+(my1+1))}
    // the graves, in rows, with crosses, yews and flowers between
    for(let gy=15;gy<=36;gy+=2)for(let gx=6;gx<=48;gx+=2){if(!free(gx,gy)||fm[gy*W+gx]==='1'||fm[gy*W+gx+1]==='1'||fm[gy*W+gx-1]==='1')continue;if(hs(gx,gy,81)<.28)continue;
      const r=hs(gx,gy,82);used.add(gx+','+gy);decor.push({k:r<.2?'cross':r<.6?'grave':'grave2',x:gx,y:gy,block:true,deco:true,sc:1});
      if(hs(gx,gy,83)<.4){const k=FLO[(hs(gx,gy,84)*3)|0];scenery.push({k,wx:gx+.5,wy:gy+.8,sc:.45,decor:{k,walk:true,x:gx,y:gy+1}})}}
    for(let n=0;n<40;n++){const x=4+((hs(n,1,85)*(W-8))|0),y=4+((hs(n,2,85)*(H-8))|0);if(!free(x,y)||fm[y*W+x]==='1')continue;used.add(x+','+y);decor.push({k:hs(n,3,85)<.6?'ltree19':MON_OAKS[(hs(n,4,85)*5)|0],x,y,block:true,sc:.9+hs(n,5,85)*.4,ox:0,oy:0})}
    const BENCH=IMG.kh_ohgard1_3?'kh_ohgard1_3':null;if(BENCH)for(const [x,y] of [[23,18],[27,18],[23,30],[27,30],[10,22]])if(free(x,y))dc(BENCH,x,y);
    for(const [x,y] of [[22,19],[28,19],[22,31],[28,31],[39,13],[43,13]])if(free(x,y)){dc('lamp',x,y);lights.push([x,y])}
    for(let n=0;n<60;n++){const x=4+((hs(n,1,86)*(W-8))|0),y=13+((hs(n,2,86)*(H-17))|0);if(free(x,y)&&hs(n,3,86)<.6){used.add(x+','+y);const k=FLO[(hs(n,4,86)*3)|0];scenery.push({k,wx:x+.5,wy:y+.5,sc:.55,decor:{k,walk:true,x,y}})}}
    const kw=KH_KEEPERS.mon_wilma;if(kw){for(const [x,y] of [[12,24],[13,25],[14,24]])if(free(x,y)){used.add(x+','+y);decor.push({k:khFaceKey(kw.face),x,y,block:false,walk:true,npc:'mon_wilma',sc:kw.sc||1});break}}
    const lv={rows:rows.map(r=>r.join('')),start:{x:MON.CEM_IN[0],y:MON.CEM_IN[1],f:1},enemies:[],items,decor,scenery,sky,fmap:null,floorSet:['ohMeadow','ohGravel','ohLawn','ohPale','ohMoss'],floor:'ohLawn',ceil:'cloud',day:.98,outdoor:true,amb:.9,
      name:LEVEL_NAMES[MON.CEM],label:'The Quiet Cemetery',diff:25,ceilH:5.2,chars,lights,portals:[],
      mapNames:[{t:'The Mausoleum',x:41,y:4,k:'place'},{t:'The Quiet Cemetery',x:26,y:25,k:'place'},{t:'The Old Graves',x:12,y:16,k:'place'},{t:'The Yew Walk',x:40,y:30,k:'place'},{t:'To the Monastery',x:6,y:19,k:'lane'}]};
    const fmp=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=fm[y*W+x];fmp.push(r)}lv.fmap=fmp;LEVELS[MON.CEM]=lv;
    TERRS[MON.CEM]=yarTerrain(W,H,h,rk,block);
  }
}
// built the first time any of them is reached
for(const id of [MON.ID,MON.CEM])KH_LAZY[id]=()=>monBuild();
for(const id of [MON.CELLAR,MON.CRYPT,MON.MAUS])KH_LAZY[id]=()=>{monDungeons();if(!LEVELS[MON.ID])monBuild()};
MON_BLD.forEach(b=>{const stub=()=>{monBuild();if(!LEVELS[b.rid]&&KH_LAZY[b.rid]&&KH_LAZY[b.rid]!==stub)KH_LAZY[b.rid]()};KH_LAZY[b.rid]=stub});
