/* ==========================================================================
   THE WENLOCK GRAVEYARD (level 530, rated 84; prefix gy / GY; pictures in gy_art.js). An old graveyard behind a lych-gate at the end of Churchyard Lane (west edge of Wenlock), about 70 by 70, under a
   cold blue dusk mist. A gravel path runs from the lych-gate (east) to a plaza round the TOMB that leads down to Lady Aldith's crypt (level 531); a second path crosses it north to south.
   Four small mazes lie under it, entered by four different doors: the mossy iron gate (north east, the Red Ossuary 532), the sunken stair (south east, the Grey Charnel 533), the stone archway
   (south west, the Black Barrow 534) and the trapdoor (north west, the Pale Catacombs 535), numbered clockwise from the gate. Between the paths: plots of weathered stones, 56 of them with
   an epitaph to read, angels, crosses, table tombs and mausoleums, yews and dead trees, ravens on posts, lanterns, a gravedigger's hut with an open grave, a ruined chapel, and, south of the tomb,
   the Wenlock family plot with Sir Edmund's stone and Lady Aldith's grave, which has no name on it.
   The ending (see gy_quests.js) happens at that grave. Wenlock's end of the lane is gyWenlockGate (called from wlBuild, wenlock_town.js).
   ========================================================================== */
WK.GRAVE=GY.ID;WK.GRAVECRYPT=GY.CRYPT;WK.GRAVEMAZES=GY.M;
WK.GRAVESTART=WK.GRAVESTART||{x:66,y:35,f:3};WK.GRAVEBACK=WK.GRAVEBACK||{x:3,y:31,f:1};
function gyRng(seed){let a=seed|0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
/* where things stand (cells) */
const GY_Y={gate:{x:68,y:35},start:{x:66,y:35,f:3},crypt:{x:35,y:30},plaza:{x0:29,y0:29,x1:41,y1:41},
  doors:[{x:58,y:6,k:0,name:'The mossy iron gate',pic:'igate2'},{x:58,y:63,k:1,name:'The sunken stair',pic:'stair'},{x:12,y:63,k:2,name:'The stone archway',pic:'arch'},{x:12,y:6,k:3,name:'The trapdoor',pic:'hatch2'}],
  grave:{x:36,y:50},edmund:{x:33,y:50},hut:{x:60,y:44},chapel:{x:19,y:21}};
/* ---- the epitaphs: [who, what is written]. Gentle, funny and sad, a little story each. ---- */
const GY_EPI=[
 ["BARNABY PLUCK, baker","He rose early every morning of his life, and then one morning he did not. The bread, they say, was never quite the same."],
 ["DORCAS WYNN","She knew best. It says so on the other side too."],
 ["TOM ASHBY, aged seven","He loved frogs. There are always three small frogs on this stone, and nobody has ever seen who puts them there."],
 ["THE REVEREND JOSIAH COBB","His sermons were long. His rest is longer. Amen, at last."],
 ["AMBROSE QUILL THE ELDER, scrivener","Here ends the final draft. No corrections to be made."],
 ["MARGERY FELL, egg-wife","She sold the best eggs in three parishes. She has gone to a market where nobody haggles."],
 ["HOB TANNER, miller","Ground exceeding small, and in good time."],
 ["A STRANGER","Died in the snow outside the lych-gate. The village paid for this stone. Someone has left a candle here every winter since, and no one will own up to it."],
 ["PEG LARKIN, aged 94","She outlived two husbands, a doctor and a sheep. All four are buried within sight of her, and she is said to be satisfied."],
 ["CAPTAIN AUBREY THORNE, of the king's service","Survived nine battles. Fell off a chair while inspecting a cobweb. The cobweb is unharmed."],
 ["EDITH AND ALICE MARSH, sisters","They quarrelled for sixty years and lie back to back, at their own request."],
 ["GAFFER BROWN","He said he felt much better. The doctor said that was a very bad sign, and the doctor was right."],
 ["MARY FLETCHER, 1 day old","Loved for one day. Remembered for all the rest."],
 ["SILAS WREN, gamekeeper","He knew every bird in the wood by name, and they all came to the funeral. The vicar says it was the crumbs."],
 ["LADY HESTER VANE","Wife to nobody who deserved her. Mother of one who deserved her less."],
 ["JOSEPH DUNN, tailor","He measured twice and cut once. He was measured once, and cut no further."],
 ["ROSE ABBOTT","Her roses won every prize at the flower show for thirty years. Nobody has dared enter since."],
 ["OLD NED, a dog","Faithful friend of the sexton. Dug up eleven bones in his time, and has now been put in one place with all of them."],
 ["PRUDENCE HOLLOW","Here lies a woman who never once said 'I told you so'. She had it carved instead."],
 ["WILLIAM GRAY, sailor","Died at sea. His mother put the stone here anyway, so that there would be somewhere to come."],
 ["THE TWELVE OF THE MARSH FARM","The fever took them in one week, and the village could not afford twelve stones. So there is one, and a great many names."],
 ["TIMOTHY SPADE, gravedigger","He dug for forty years and never once complained about the ground. The ground, on the other hand, has now got him."],
 ["MISTRESS ELSPETH CROFT","She fed the whole parish through the hungry year and asked for nothing. The parish has put this stone up, and a great deal of flowers."],
 ["ALFRED BOOTH, innkeeper","Last orders."],
 ["SARAH AND JOHN PENN","Married sixty-one years. She died on a Monday. He followed on Wednesday, saying he could not be expected to do the washing."],
 ["ISAAC FOLEY, bellringer","He rang for the dead of this parish for fifty years, and was ringing when he fell. The bell, it is said, rang on a moment longer without him."],
 ["MABEL TUCK, cook","She never wrote a recipe down. Her family have been arguing about the pie ever since."],
 ["ROBERT WELLS, scholar","He read every book in Wenlock, and wrote one himself. It is in the library, on the bottom shelf, and has never been borrowed."],
 ["HERE LIES A THIEF","He stole a loaf. He was hanged for it. The village buried him here in the dark, and put a loaf on the stone every year at harvest. It is still there. It is a different loaf."],
 ["JANE FIELD, aged 19","She went to fetch water at dusk and did not come back. The well was dry. It has been said she is the reason it is sweet now."],
 ["BEN COOPER, barrel-maker","He was very well put together, and went off all at once."],
 ["MOTHER JUNE","She healed half the village and cursed the other half, and nobody ever worked out which was which."],
 ["EDMUND FARROW, aged 3 months","He did not stay. We loved him anyway."],
 ["SIR GILES ASHBY","A good knight and a bad speller. The stone-cutter has done his best."],
 ["NELLIE WARD, who sang","If you stand here at dusk you may hear her still. If you do, do not applaud. She is shy."],
 ["JOHN CARTER, carter","His horse walked behind the coffin all the way here, unled, and stood at the gate for three days."],
 ["ANNE PEMBERTON","Wife of the librarian. She is the only one to have ever got him to leave the shop."],
 ["DAVID LEE, shepherd","A hundred sheep and one dog came to the funeral. The vicar did not like to say anything."],
 ["AGNES TRUE, midwife","She brought four hundred children into Wenlock. They put up this stone between them, a penny each."],
 ["FRANCIS HOBB, who owed money","Everybody has now been paid. In flowers, mostly."],
 ["PETER LOCKE, locksmith","He is locked in here for good, and that, for once, is nobody's fault."],
 ["MARTHA BLACK, widow","She wore black for forty years. It is said that she was very good at it."],
 ["THOMAS REED, thatcher","He fell off a roof he had thatched himself. The roof is still dry."],
 ["JOSEPHINE CLARE","She loved a soldier. He did not come home. She waited at the lych-gate every evening until she was very old, and the village still calls it Josie's Gate."],
 ["A CHILD, name not known","Laid here by the people who found her, with a ribbon. The ribbon has gone. The stone is kept clean by someone, every year."],
 ["WALTER GRIMES, schoolmaster","He taught the parish to read, and the parish has taught him to rest."],
 ["BETSY OAKS, laundress","She is, for the first time in sixty years, not washing anything."],
 ["HAROLD AND HAROLD, uncle and nephew","There was never any confusion. They are in the same grave for convenience."],
 ["HUGH FENN, ferryman","He took the whole parish across the brook, one by one. He has gone across by himself."],
 ["BARTHOLOMEW GOODE, vicar","The best man I ever knew. Please do not tell the bishop. (Added in pencil, and then in stone.)"],
 ["ELEANOR WITT","She said she was a ghost, and was very sorry to be buried. She was not a ghost. She was just not good at funerals."],
 ["LUKE AND LOUISE BARROW","A fire took the house in the night. They are buried under one roof of stone, and someone has planted honeysuckle."],
 ["JACK DAW, poacher","Never caught alive."],
 ["GRANNY MOSS","She said it was all very well and went in the end as she lived, in the middle of an argument."],
 ["NICHOLAS BELL, bell-founder","He cast the bells of Saint Wenna's. One of them is cracked. He always said it was the best one."]
];
/* the plaques and small signs of the yard */
const GY_SIGNS=[
 ["CHURCHYARD OF SAINT WENNA, the older part","Visitors are asked to be quiet and the residents are asked to do the same."],
 ["TO THE CRYPT","Mind the step. Mind the steps. There are a great many steps."],
 ["THE WENLOCK FAMILY PLOT","Private. Though they are not using it much."],
 ["NO DIGGING","By order of the gravedigger, who is the only one allowed to."],
 ["PLEASE KEEP TO THE PATH","The path is the part that is not occupied."]
];
function gyYardBuild(){
  if(LEVELS[GY.ID])return LEVELS[GY.ID];
  gyAlias();
  const W=GY.W,H=GY.H,hs=(a,b,c)=>hash2(a,b,c),R=gyRng(5301);
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const block=new Uint8Array(W*H),fm=new Array(W*H).fill('0'),hgt=new Float32Array(W*H).fill(.3),rk=new Float32Array(W*H);
  const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
  const decor=[],enemies=[],items=[],lights=[],used=new Set(),path=new Set(),glow=[];
  const isOpen=(x,y)=>x>=2&&y>=2&&x<=67&&y<=67&&rows[y][x]==='.';
  const free=(x,y)=>isOpen(x,y)&&!used.has(x+','+y);
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)fm[y*W+x]=f};
  const pth=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){path.add(x+','+y);fm[y*W+x]=f||'3'}};
  const dec=(a,x,y,o)=>{o=o||{};const k=GYA[a]?'gy_'+a:a;if(!isOpen(x,y))return null;const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}
    if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false}if(o.i!==undefined)d.i=o.i;if(o.wd){d.wd=o.wd;d.pic=1}if(o.txt)d.txt=o.txt;
    decor.push(d);used.add(x+','+y);return d};
  const D=(a,x,y,o)=>free(x,y)&&!path.has(x+','+y)?dec(a,x,y,o):null;
  const DB=(a,x,y,o)=>D(a,x,y,Object.assign({block:true},o||{}));
  const foe=(t,x,y)=>{if(!free(x,y))return false;enemies.push({t,x,y,lvl:84});used.add(x+','+y);return true};
  const lamp=(x,y)=>{if(isOpen(x,y)){lights.push([x,y])}};
  // ---- the ground: grass; gravel paths; a flagged plaza; bare earth round the gravedigger ----
  pth(3,35,67,35,'3');pth(35,3,35,66,'3');
  pth(58,8,58,34,'3');pth(58,36,58,62,'3');pth(12,8,12,34,'3');pth(12,36,12,62,'3');
  pth(12,8,58,8,'3');pth(12,62,58,62,'3');   // the paths ring the yard, so that every door can be reached from either side
  pth(GY_Y.plaza.x0,GY_Y.plaza.y0,GY_Y.plaza.x1,GY_Y.plaza.y1,'5');
  pth(30,46,40,54,'3');   // the family plot
  setF(54,40,66,48,'1');   // the gravedigger's yard
  // ---- the boundary: a stone wall two squares thick, with the lych-gate in the east side ----
  const wallH=2.1,wt=v=>ch(gyTile('texGrey_'+v,wallH,{gain:.62}));   // the boundary wall is darker, so that the far wall does not shine in the mist as pale stripes
  const WC=[0,0,0,1,3,5,0,3,2].map(wt);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x>=2&&x<=67&&y>=2&&y<=67)continue;solid(x,y,WC[(hs(x,y,7)*WC.length)|0])}
  {const gid=gyTile('texGrey_0',2.5,{fac:{img:'gatesC_0',i:0,n:1},gain:1.1});KH_DOOR[gid]={lvl:WL.ID,get at(){return WK.GRAVEBACK||{x:3,y:31,f:1}},gy:'lane'};
   const c=ch(gid);rows[GY_Y.gate.y][GY_Y.gate.x]=c;block[GY_Y.gate.y*W+GY_Y.gate.x]=1;
   dec('lych',67,35);used.add('67,35')}
  // ---- the tomb and its plaza ----
  {const cx=GY_Y.crypt.x,cy=GY_Y.crypt.y;dec('crypt',cx,cy,{block:true,npc:'gyo_crypt'});
   for(const [dx,dy] of [[-4,2],[4,2],[-4,8],[4,8],[0,10]])lamp(cx+dx,cy+dy);
   for(const [x,y] of [[31,30],[39,30],[31,40],[39,40]])dec('lantern',x,y,{block:true});
   for(const [x,y] of [[31,35],[39,35]])dec('bench',x,y,{block:false});
   for(const [x,y] of [[32,31],[38,31],[32,39],[38,39]])dec('urn',x,y,{block:true});
   lights.push([cx-1,cy+2],[cx+1,cy+2]);glow.push([cx,cy+1])}
  // ---- two lines of tall wrought iron fence divide the yard into three areas (the west, the tomb and the east); a tall gate stands open wherever a cobbled path crosses ----
  for(const fx of [27,43]){for(let y=3;y<=66;y++){if([8,35,62].includes(y))dec('igate',fx,y,{sc:1.3});else dec('fence',fx,y,{block:true,sc:1.3})}}
  // ---- the four doors into the mazes ----
  for(const g of GY_Y.doors){
    dec(g.pic,g.x,g.y,{block:true,npc:'gyo_door'+g.k});
    lamp(g.x-1,g.y+(g.y<35?2:-2));lamp(g.x+1,g.y+(g.y<35?2:-2));
    const dy=g.y<35?1:-1;for(const dx of [-2,2])D('lean',g.x+dx,g.y+dy*2);
    for(const dx of [-3,3])D('ww_pine',g.x+dx,g.y,{block:true,sc:1})}
  // ---- the ruined chapel, the family plot, the gravedigger ----
  {const c=GY_Y.chapel;dec('chapel',c.x,c.y,{block:true,npc:'gyo_chapel'});for(const [x,y] of [[c.x-3,c.y+2],[c.x+3,c.y+2],[c.x-2,c.y+3],[c.x+2,c.y+3]])D('lean',x,y);D('dead',c.x-4,c.y-1,{block:true});D('dead',c.x+4,c.y-1,{block:true});D('rpost',c.x+2,c.y+1,{block:true});lamp(c.x,c.y+3)}
  {const e=GY_Y.edmund,g=GY_Y.grave;
   dec('edmund',e.x,e.y,{block:true,npc:'gyo_edmund'});dec('slab',g.x,g.y,{block:true,npc:'gyo_grave'});dec('angel',35,52,{block:true,npc:'gyo_angel'});
   for(const [x,y] of [[31,49],[31,51],[40,49],[40,51],[31,53],[40,53]])D('fence',x,y,{block:true,sc:.9});
   D('bench',35,48,{block:false});D('rose',34,50);D('rose',37,50);lamp(35,50);lamp(33,52);lamp(38,52);glow.push([g.x,g.y+1]);
   decor.push({k:'sign_gy',x:35,y:47,block:false,wd:[0,-1],txt:GY_SIGNS[2]})}
  {const h=GY_Y.hut;dec('hut',h.x,h.y,{block:true,npc:'gyo_hut'});dec('mound',56,44,{block:true,npc:'gyo_opengrave'});dec('barrow',58,42,{block:true});dec('rpost',63,42,{block:true});lamp(h.x-2,h.y+2);lamp(55,46);
   decor.push({k:'sign_gy',x:57,y:41,block:false,wd:[0,1],txt:GY_SIGNS[3]})}
  // the lanes' signs
  decor.push({k:'sign_gy',x:65,y:36,block:false,wd:[0,1],txt:GY_SIGNS[0]});decor.push({k:'sign_gy',x:35,y:34,block:false,wd:[0,-1],txt:GY_SIGNS[1]});decor.push({k:'sign_gy',x:34,y:12,block:false,wd:[1,0],txt:GY_SIGNS[4]});
  // ---- the plots of graves: stones at the crossings of a lattice, with gaps so that the plots can be walked ----
  const readable=[];for(let i=0;i<GY_EPI.length;i++)readable.push(i);for(let i=readable.length-1;i>0;i--){const j=(R()*(i+1))|0;[readable[i],readable[j]]=[readable[j],readable[i]]}
  let ri=0;const STONES=['stone1','stone2','lean','slab','wcross','stone1','lean','wcross','stone2','ccross','tomb','urn','angel','obelisk','column','mausoleum'];
  const WEIGHT=[5,4,4,3,4,3,3,3,2,2,1.4,1.2,1,.8,.7,.5],TW=WEIGHT.reduce((a,b)=>a+b,0);
  const pickStone=r=>{let t=r*TW;for(let i=0;i<STONES.length;i++){if((t-=WEIGHT[i])<0)return STONES[i]}return 'stone1'};
  const reserved=(x,y)=>{
    if(x>=GY_Y.plaza.x0-1&&x<=GY_Y.plaza.x1+1&&y>=GY_Y.plaza.y0-1&&y<=GY_Y.plaza.y1+1)return true;
    if(x>=29&&x<=42&&y>=45&&y<=55)return true;   // the family plot
    if(x>=51&&x<=67&&y>=38&&y<=50)return true;   // the gravedigger
    if(x>=12&&x<=28&&y>=14&&y<=26)return true;   // the ruined chapel
    for(const g of GY_Y.doors)if(Math.abs(x-g.x)<=4&&Math.abs(y-g.y)<=4)return true;
    if(x>=62&&y>=32&&y<=38)return true;
    return false};
  for(let y=4;y<=66;y+=3)for(let x=4;x<=66;x+=2){
    if(path.has(x+','+y)||path.has((x-1)+','+y)||path.has((x+1)+','+y)||reserved(x,y)||!free(x,y))continue;
    if(hs(x,y,11)>.52)continue;
    const kind=pickStone(hs(x,y,12)),big=/^(mausoleum|angel|obelisk|column)$/.test(kind);
    if(big&&(x%4)!==0)continue;
    const rd=!big&&ri<readable.length&&hs(x,y,13)<.5;
    const d=DB(kind,x,y,rd?{npc:'gyo_stone',i:readable[ri++]}:{});
    if(d&&!big&&hs(x,y,14)<.12){const f=D('rose',x+(hs(x,y,15)<.5?-1:1),y+1);}
    if(d&&kind==='ccross'&&rd===false&&hs(x,y,16)<.3)glow.push([x,y+1])}
  // any epitaph not yet placed goes on a stone next to a path, so that all of them can be read
  {const spots=[];for(let y=4;y<=66;y++)for(let x=4;x<=66;x++){if(free(x,y)&&!path.has(x+','+y)&&!reserved(x,y)&&(path.has((x+1)+','+y)||path.has((x-1)+','+y))&&(x+y)%2===0)spots.push([x,y])}
    while(ri<readable.length&&spots.length){const [x,y]=spots.splice((R()*spots.length)|0,1)[0];if(!free(x,y))continue;DB(R()<.5?'stone1':'stone2',x,y,{npc:'gyo_stone',i:readable[ri++]})}}
  // ---- every grave stone stands in a plot of bare dirt, with the grass round it ----
  for(const d of decor){if(!d.block||!/^gy_(stone1|stone2|lean|slab|wcross|ccross|tomb|urn|angel|obelisk|column|mausoleum)$/.test(d.k))continue;
    const big=/^gy_(angel|obelisk|column|mausoleum|tomb)$/.test(d.k);
    for(let dy=-(big?1:0);dy<=(big?2:1);dy++)for(let dx=-1;dx<=1;dx++){const x=d.x+dx,y=d.y+dy;if(x<2||y<2||x>67||y>67||path.has(x+','+y)||fm[y*W+x]!=='0')continue;fm[y*W+x]='1'}}
  // ---- trees, ravens, flowers, bones, the iron fence along the plots ----
  const FIR=n=>hs(n[0],n[1],24)<.5?'ww_pine':'ww_pine2';
  for(let i=4;i<=65;i+=2){for(const [x,y] of [[i,4],[i,65],[4,i],[65,i]]){if(hs(x,y,25)<.78)DB(FIR([x,y]),x,y,{sc:.95+hs(x,y,26)*.4})}}   // a dark wall of firs all round the yard
  for(let n=0;n<190;n++){const x=3+((hs(n,1,21)*64)|0),y=3+((hs(n,2,21)*64)|0);if(!free(x,y)||path.has(x+','+y)||reserved(x,y))continue;const r=hs(n,3,21);DB(r<.82?FIR([x,y]):'dead',x,y,{sc:.9+hs(n,4,21)*.35})}
  for(let n=0;n<18;n++){const x=3+((hs(n,1,22)*64)|0),y=3+((hs(n,2,22)*64)|0);if(free(x,y)&&!path.has(x+','+y)&&!reserved(x,y))DB('rpost',x,y)}
  for(let n=0;n<16;n++){const x=3+((hs(n,1,23)*64)|0),y=3+((hs(n,2,23)*64)|0);if(free(x,y)&&!path.has(x+','+y))D('bones',x,y,{sc:.8})}
  for(let x=4;x<=66;x+=4){for(const y of [3,66]){if(free(x,y)&&!path.has(x+','+y))D('fence',x,y,{block:true,sc:.9})}}
  // lanterns along the main paths
  for(let x=6;x<=64;x+=8){for(const y of [34,36])if(free(x,y)&&!(x>=28&&x<=42)){if(DB('lantern',x,y))lights.push([x,y]);break}}
  for(let y=6;y<=64;y+=8){for(const x of [34,36])if(free(x,y)&&!(y>=28&&y<=42)){if(DB('lantern',x,y))lights.push([x,y]);break}}
  // cobwebs hang between the trees, stones and fences
  {const bs=new Set();for(const d of decor)if(d.block)bs.add(d.x+','+d.y);for(let n=0;n<110;n++){const x=3+((hs(n,1,27)*64)|0),y=3+((hs(n,2,27)*64)|0);if(!free(x,y)||path.has(x+','+y))continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>bs.has((x+a)+','+(y+b))))D('web',x,y,{sc:.7+hs(n,3,27)*.5})}}
  for(let x=14;x<=56;x+=10){lamp(x,7);lamp(x,63)}
  for(const g of GY_Y.doors){for(let k=1;k<=3;k++)lamp(g.x+(g.x>35?-1:1),g.y+(g.y<35?k*5:-k*5))}
  // ---- the living: the gravedigger's apprentice, and the things that live here ----
  {const q=(x,y)=>{for(let r=0;r<4;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;if(free(x+a,y+b)){return [x+a,y+b]}}return null};
   const kp=KH_KEEPERS.gyo_digger,p=q(62,45);if(kp&&p){decor.push({k:khFaceKey(kp.face),x:p[0],y:p[1],block:false,walk:true,npc:'gyo_digger',sc:kp.sc||1});used.add(p[0]+','+p[1])}}
  const FOES=[['gyraven',24,10],['gyraven',50,56],['gyskel',20,28],['gyskel',23,30],['gyghoul',46,22],['gyzombie',18,48],['gyraven',52,24],['gyskel',44,58],['gyghoul',8,56],['gyzombie',62,14],['gyraven',30,8],['gyskel',66,58]];
  for(const [t,x,y] of FOES){if(!foe(t,x,y)){let ok=false;for(let r=1;r<4&&!ok;r++)for(let a=-r;a<=r&&!ok;a++)for(let b=-r;b<=r&&!ok;b++)if(Math.max(Math.abs(a),Math.abs(b))===r&&!path.has((x+a)+','+(y+b)))ok=foe(t,x+a,y+b)}}
  // ---- the level ----
  const rowsS=[],fmS=[];for(let y=0;y<H;y++){rowsS.push(rows[y].join(''));let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmS.push(s)}
  const mapNames=[{t:'The Lych-gate',x:65,y:35,k:'place'},{t:'The Tomb of the Crypt',x:35,y:32,k:'place'},{t:'The Mossy Iron Gate',x:58,y:9,k:'place'},{t:'The Sunken Stair',x:58,y:61,k:'place'},{t:'The Stone Archway',x:12,y:61,k:'place'},{t:'The Trapdoor',x:12,y:9,k:'place'},
    {t:'The Ruined Chapel',x:19,y:19,k:'place'},{t:"The Gravedigger's Hut",x:60,y:42,k:'place'},{t:'The Wenlock Family Plot',x:35,y:49,k:'place'},{t:'Lady Aldith\'s Grave',x:36,y:51,k:'place'}];
  const lv={rows:rowsS,chars,fmap:fmS,floorSet:GY_FLOORSET,floor:GY_FLOORSET[0],ceil:'cloud',start:{x:GY_Y.start.x,y:GY_Y.start.y,f:GY_Y.start.f},enemies,items,decor,lights,portals:[],day:.4,outdoor:true,amb:.56,
    name:GY.NAMES[530],label:GY.NAMES[530],noExtras:true,diff:84,ceilH:5.2,noTele:true,torchGap:1e9,mapNames,
    _gy:{kind:'yard',glow,lcol:{},epitaphs:readable.length,placed:ri}};
  // ---- check: everything that can be walked to can be reached from the lych-gate; a piece that walls something in is made walk-through ----
  {const D4=[[1,0],[-1,0],[0,1],[0,-1]];const flood=()=>{const bs=new Set();for(const d of decor)if(d.block)bs.add(d.x+','+d.y);const seen=new Uint8Array(W*H),q=[GY_Y.start.y*W+GY_Y.start.x];seen[q[0]]=1;
      for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of D4){const nx=x+a,ny=y+b;if(nx<2||ny<2||nx>67||ny>67||rows[ny][nx]!=='.'||seen[ny*W+nx]||bs.has(nx+','+ny))continue;seen[ny*W+nx]=1;q.push(ny*W+nx)}}return {seen,bs}};
    let moved=0;for(let pass=0;pass<6;pass++){const {seen,bs}=flood();const kill=new Set();
      for(let y=2;y<=67;y++)for(let x=2;x<=67;x++)if(rows[y][x]==='.'&&!seen[y*W+x]&&!bs.has(x+','+y))for(const [a,b] of D4){const k=(x+a)+','+(y+b);if(bs.has(k))kill.add(k)}
      if(!kill.size)break;
      for(const d of decor)if(d.block&&kill.has(d.x+','+d.y)&&!d.npc){d.block=false;d.walk=true;d.deco=true;moved++}
      for(const d of decor)if(d.block&&d.npc&&kill.has(d.x+','+d.y)&&(d.npc==='gyo_stone')){d.block=false;d.walk=true;d.deco=false;moved++}}
    lv._gy.softened=moved}
  LEVELS[GY.ID]=lv;
  {const NN=W*H;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]!=='.')block[y*W+x]=1;try{TERRS[GY.ID]=yarTerrain(W,H,hgt,rk,block)}catch(e){console.error(e)}}
  return lv}
KH_LAZY[GY.ID]=gyYardBuild;
/* Wenlock's end of Churchyard Lane: a lane west from Church Lane along y=31 to a lych-gate in the west wall (called by wlBuild in wenlock_town.js). C = the town builder's own tables. */
const GY_LANE={y:31,x0:3,x1:23};
function gyWenlockGate(C){
  if(typeof GY_ENABLED==='undefined'||!GY_ENABLED)return;   // switched off: Wenlock has no lane and no gate
  try{
    const {rows,block,fm,street,decor,ch,W}=C,y=GY_LANE.y;
    for(let x=GY_LANE.x0;x<=GY_LANE.x1;x++){street.add(x+','+y);fm[y*W+x]='3';for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.x===x&&d.y===y&&(d.block||d.npc))decor.splice(i,1)}}
    const gh=2.5,gid=gyTile('texGrey_1',gh,{fac:{img:'gatesC_0',i:0,n:1},gain:1.15});
    KH_DOOR[gid]={lvl:GY.ID,get at(){return WK.GRAVESTART||{x:66,y:35,f:3}},gy:'wenlock'};
    const c=ch(gid);rows[y][2]=c;block[y*W+2]=1;
    decor.push({k:'gy_lych',x:3,y,block:false,walk:true,deco:true});
    decor.push({k:'sign_gy',x:5,y:y-1,block:false,wd:[0,1],txt:['CHURCHYARD LANE','To the old churchyard. Gate closes at dusk. Residents let themselves in.']});
    if(WK.GRAVEBACK===undefined)WK.GRAVEBACK={x:4,y,f:1};
    WK.GRAVEBACK={x:4,y,f:1};
  }catch(e){console.error('gyWenlockGate',e)}}
