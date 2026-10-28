/* ==========================================================================
   PLACE 1 OF THE BLIGHTED ROAD: THE TOLL HOUSE OF THE ROAD WARDENS (level 9610, rated 84; the toll house inside is 9611; prefix blt / BLT). The first blighted ground outside the west gate of Wenlock.
   72 by 64. The road runs east to west along y 31 to 33 between dead hedges; the east gate (x 70) leads back to Wenlock, the west gate (x 1) on to Ashenfold Farm (9620). In the middle the Wardens' toll yard
   with the toll bar, the toll house (a house in the style of Wenlock, door to 9611 with the ledger desk, a strongbox of pale silver wax seals, and a dead warden), a graveyard row of the nine Wardens, the ruined
   wayside shrine to the south west, a roadmender's hut in a side track, a crow tree, a field of dead stalks. Milestone: SALE 9 STAGES.
   People: Wat Harrow (the toll keeper who survived, blt_keeper), Marl Quill (the crow-keeper, blt_crow), Sister Anwen (a living nun at the shrine, blt_nun).
   Quests: blq1 The Wardens' Ledger (Wat: take the ledger from the desk), blq2 Rest for the Wardens (Marl: five Dead Road Wardens), blq3 The Shrine Candle (Anwen: the candle in the dead warden's belt, lit at the shrine).
   Flags: G.flags.bl = {ledger, candle, shrineLit, chest, wk (wardens put down since blq2 was taken)}.
   ========================================================================== */
const BLT={ID:9610,HOUSE:9611,W:72,H:64,keep:{x:42,y:29}};
LEVEL_NAMES[BLT.HOUSE]="The Wardens' Toll House";LEVEL_RATING[BLT.HOUSE]=84;
const BLT_HOUSE={x0:39,x1:46,y0:21,y1:26,face:'S',sty:'flint',roof:'slate',wh:2.5,to:BLT.HOUSE};
/* ---------- things carried ---------- */
ITEMDEF.blledger={n:"The Wardens' Ledger",k:'quest',t:'Quest item',ic:'book',c:'#6a5a40',stack:1,price:0,sw:.5,d:'A long ledger bound in grey cloth, taken from the desk of the toll house. Every line is a day, a weight of pale silver, and the words paid by the Sovereign’s clerk. Take it to Wat Harrow at the toll yard.'};
ITEMDEF.blcandle={n:'White Shrine Candle',k:'quest',t:'Quest item',ic:'ore',c:'#e8e4d0',stack:1,price:0,sw:.1,d:'A stub of white wax with the stamp of the wayside shrine on its foot. A Road Warden took it from the shrine and kept it in his belt. It belongs on the shrine.'};
ITEMDEF.blwaxseal={n:'Pale Silver Wax Seal',k:'quest',t:'Quest item',ic:'ore',c:'#c8d0d8',stack:1,price:0,sw:.1,d:'A lump of grey wax stamped with a small pale silver mark. It is the same mark that is on the Warden’s Seals of Wenlock.'};
ITEMDEF.blwardenring={n:"Warden's Toll Ring",k:'ring',t:'Ring',ic:'ring',c:'#b8c0c8',price:0,lvl:84,pas:{ward:15,dodge:.06,regen:.6,mpRegen:.4},int:5,hp:70,rar:1,sw:.1,d:'A heavy ring of grey metal, stamped with the toll bar of the Road Wardens. Adds 5 Intelligence and 70 health, every blow on the wearer is 15 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 84.'};
/* ---------- the people ---------- */
const BLT_KEEP_LINES=[
  'I took the toll here for thirty years. Pale silver, always, never copper. I asked the Warden-Captain once why, and he smiled at me, and I never asked again.',
  'They went into the toll house one night, all nine of them, and shut the door. In the morning the hedges were dead. I sleep in the lean-to by the shrine road now, and I do not sleep much.',
  'There are two rules on this road. Do not drink from the ditch. Do not answer anything that calls you by name. I have kept both, and I am still here.',
  'The road goes on west to Ashenfold Farm. I would not walk it at dusk. It is always dusk now.'];
khNpc('blt_keeper','Wat Harrow, toll keeper','kh_ohfolk2_3',()=>yrLines('blt_keeper',BLT_KEEP_LINES));
const BLT_CROW_LINES=[
  'The crows still mind me, mostly. They have stopped bringing me what I ask for and started bringing me what they like. Last week it was a ring with the finger still in it.',
  'Crows know the road better than the Wardens ever did. They say there is a bridge at the end of it, and a gate, and a pale knight who does not blink.',
  'Do not feed the crows near the toll house. They are not my crows there. They belong to the dead wardens, and the dead wardens pay in bones.'];
khNpc('blt_crow','Marl Quill, crow-keeper','kh_ohfolk3_3',()=>yrLines('blt_crow',BLT_CROW_LINES));
const BLT_NUN_LINES=[
  'I walked here from Wenlock to pray at the shrine of the Hollow Saint, and found it dark. I will stay until it is lit again. The Saint will not mind a little waiting. She has had a great deal of practice.',
  'The Hollow Saint kept the road once. They say she walked it from end to end and lit a candle at every shrine, and the candles are why the road was ever safe.',
  'Do not be afraid of the dark here. Be afraid of the pale light in it. The dead carry that.'];
khNpc('blt_nun','Sister Anwen','kh_ohfolk5_2',()=>yrLines('blt_nun',BLT_NUN_LINES));
/* ---------- the quests ---------- */
function bltQ(id,title,who,steps,reward,extra){const q=yrQ(id,title,who,steps,reward,extra);QAREA[id]=BL.REGION;return q}
const bltF=()=>{const F=blF();return F};
bltQ('blq1',"The Wardens' Ledger",'Wat Harrow, toll keeper',[
  ["Take the Wardens' ledger from the desk in the toll house (the black house in the middle of the toll yard) and bring it to Wat Harrow.",()=>bagCount('blledger')>0,['blt_ledger']]],
  {gold:2600,xp:23000,items:['potion6','potion6']});
QUESTS.blq2={title:'Rest for the Wardens',who:'Marl Quill, crow-keeper',need:5,goal:()=>Math.min(5,bltF().wk|0),reward:{gold:3200,xp:27000,items:['blwardenring','potion6']},
  get desc(){const n=Math.min(5,bltF().wk|0);return n>=5?'Go back to Marl Quill. All five are at rest.':'Put five Dead Road Wardens to rest ('+n+' of 5). They walk the road and the toll yard round the toll house.'}};
QAREA.blq2=BL.REGION;
bltQ('blq3','The Shrine Candle','Sister Anwen',[
  ["Find the shrine's white candle. A dead Road Warden kept it in his belt, inside the toll house.",()=>bagCount('blcandle')>0||!!bltF().shrineLit,['blt_deadwarden']],
  ['Light the candle at the wayside shrine, south west of the toll yard.',()=>!!bltF().shrineLit,['blt_shrine']]],
  {gold:2200,xp:19000,items:['potion6','potion6','potion6']});
wwGive('blt_keeper','blq1',()=>true,{
  offer:"Will you do something for me? The Wardens kept a ledger in the toll house, in the desk at the back. Every toll, every name, every payment. I want it, and I want to know who the silver came from. I cannot go in. A dead warden sits at that desk, and he looks at me.",
  accept:'Thank you. The desk is under the clock, at the back of the house. Bring the book out, and do not read it standing near the window.',
  remind:()=>'The ledger is on the desk in the toll house. Have you got it yet?',
  ready:'That is it. That is the Wardens’ ledger. Give it here, slowly.',
  thanks:'I have read the last page. The silver paid for the shut gate, and for a man named Maldrake, who was never a Warden at all. Thirty years of silver in advance, to a vault in the hills. Take this, and my thanks.',
  after:'I have copied the names out onto the wall of my lean-to. One day somebody will want them.'});
wwGive('blt_crow','blq2',()=>true,{
  offer:'Nine Wardens died in that house, and not one of them has the manners to stay down. They walk the road, and they stand in the toll yard as if somebody might still pay. Put five of them to rest, and the crows and I will sleep better.',
  accept:'Five. They are easy to find. They are the ones in the helmets, and they are always polite right until the spear.',
  remind:()=>'Five Dead Road Wardens, on the road or in the toll yard. You have done '+Math.min(5,bltF().wk|0)+'.',
  ready:'Five of them down. I could hear it from the north field. The crows went quiet.',
  thanks:'Take this. One of them used to wear it, and he will not be wanting it back.',
  after:'There are still some in the toll house, I think. But the road is quieter, and the crows thank you.'});
wwGive('blt_nun','blq3',()=>true,{
  offer:'The shrine of the Hollow Saint stands dark, south west of the toll yard. Its white candle was taken, and I think I know where it went. A Road Warden took it into the toll house and has kept it in his belt ever since. Will you bring it back to me, and light it?',
  accept:'Bless you. The toll house is the big black house in the yard. The shrine is to the south west, down the little track. Light the candle there, and the Saint will do the rest.',
  remind:()=>bltF().candle||bagCount('blcandle')>0?'You have the candle. Light it at the shrine, south west of the toll yard.':'The candle is on a dead warden in the toll house.',
  ready:'The shrine is lit! I could see the glow from here. Oh, thank you.',
  thanks:'The Saint keeps her own accounts, but I think she will put this one in your favour.',
  after:'The shrine burns steadily now. I sit by it, and nothing on the road comes near it.'});
/* ---------- the objects ---------- */
khNpc('blt_ledger',"The Wardens' ledger",'gy_book',d=>{
  const F=bltF();
  if(F.ledger&&!F.ledgerDone&&!bagCount('blledger'))return say('The desk is bare where the ledger lay. If you have lost it, there is nothing more here.',[BYE]);
  if(F.ledger)return say('The desk is bare, apart from rings of damp where cups were put down.',[BYE]);
  return say("A long ledger lies open on the desk. Each line is a day, a weight of pale silver, and the words PAID BY THE SOVEREIGN'S CLERK. The last page is a copy of an order: THE GATE OF WENLOCK TO BE SHUT, THE SEALS SET. SILVER FOR THE VAULT OF MALDRAKE, THIRTY YEARS IN ADVANCE. The dead warden at the desk does not stop you.",[['Take the ledger.',()=>{F.ledger=1;if(!bagAdd(mkItem('blledger')))G.items.push({k:'blledger',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg("You take the Wardens' ledger.",'#ffe36a');return null}],BYE])});
khNpc('blt_deadwarden','A dead warden','gy_skel',d=>{
  const F=bltF();
  if(!F.candle&&!F.shrineLit)return say('A Road Warden in a grey tabard sits at the desk with his hands on the wood. He has been dead a long time and has not noticed. A stub of white candle is stuck in his belt, with a shrine stamp on its foot.',[['Take the candle.',()=>{F.candle=1;if(!bagAdd(mkItem('blcandle')))G.items.push({k:'blcandle',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg('You take the white shrine candle.','#ffe36a');return null}],BYE]);
  return say('The dead warden sits at the desk with his hands on the wood. He does not look up. His belt is empty now.',[BYE])});
khNpc('blt_sealchest','A strongbox','gy_chest',d=>{
  const F=bltF();
  if(F.chest)return say('The strongbox is open and empty, except for grey wax dust.',[BYE]);
  return say('An iron strongbox with the toll bar stamped on its lid. It is not locked. Inside are ledger slips, a few coins, and a lump of grey wax stamped with a small pale silver mark.',[['Take what is in it.',()=>{F.chest=1;G.gold+=900;if(!bagAdd(mkItem('blwaxseal')))G.items.push({k:'blwaxseal',x:G.P.x,y:G.P.y,taken:false});sfx('win');msg('You take 900 gold and a pale silver wax seal.','#ffe36a');return null}],BYE])});
function bltShrine(){
  const F=bltF();
  if(F.shrineLit)return say('The white candle burns steadily on the shrine of the Hollow Saint. The air near it is warm and smells of wax. The crows do not come within a stone’s throw.',[BYE]);
  if(bagCount('blcandle')>0)return say('A ruined wayside shrine to the Hollow Saint: a low arch, a stone shelf, a round hollow where a candle stood. You have the white candle.',[['Set the candle in the hollow and light it.',()=>{bagRemove('blcandle',1);F.shrineLit=1;sfx('win');try{G.heroes.forEach((h,i)=>{if(h.alive){h.hp=h.max;h.mp=h.mpMax}})}catch(e){}msg('The candle takes a flame from nothing. A warm light spreads over the party, and every hero is healed.','#ffe9a0');
      try{const L=LEVELS[BLT.ID];if(L&&L._bl)L._bl.lcol[(BLT.shrine.x)+','+(BLT.shrine.y+1)]=[1.5,1.05,.55]}catch(e){}return null}],BYE]);
  return say('A ruined wayside shrine to the Hollow Saint: a low arch of grey stone with a window, a shelf, and a round hollow where a candle once stood. The hollow is empty and cold.',[BYE])}
khNpc('blt_shrine','A ruined wayside shrine','gy_candles',()=>bltShrine());
khNpc('blt_hut','A roadmender’s hut','bl_hut',()=>say('A roadmender’s hut in a side track. The door is nailed shut from the outside, with four nails and a good deal of care. Something inside taps once on the wood, politely, and then stops.',[BYE]));
khNpc('blt_crowtree','A crow tree','ww_crowtree',()=>say('A dead tree black with crows. They do not move. Every one of them is looking at you.',[BYE]));
const BLT_GRAVES=[
  ['WARDEN ABEL PETTIFER','Held the bar thirty years. Let nobody through without silver.'],
  ['WARDEN HOB DREWE','He asked what the silver was for. The stone says only: Paid.'],
  ['WARDEN IVY CARROW','The only woman of the nine. She said the toll house was cold. It is now.'],
  ['WARDEN CAPTAIN MORLEY','Of the Road Wardens. Under his own orders until the last.'],
  ['WARDEN TOBY LAMMAS','Nineteen years old. He wanted to see Sale.'],
  ['WARDEN SIMEON KETT','Sentry. Asleep at his post, and still there.']];
khNpc('blt_wgrave','A grave board','bl_slab',d=>{const t=BLT_GRAVES[d.i]||BLT_GRAVES[0];return say(t[0]+'. '+t[1]+' The grave is not undisturbed.',[BYE])});
khNpc('blt_notice','A notice post','greensign',()=>say("A notice nailed to a post. BY ORDER OF THE ROAD WARDENS. THE ROAD IS CLOSED. NO CARTS, NO PILGRIMS, NO LETTERS. ALL TOLLS TO BE PAID IN PALE SILVER AT THE BAR. Underneath, in a different ink: THE BAR IS BROKEN. PAY NOBODY.",[BYE]));
khNpc('blt_lean','A lean-to','bl_hut',()=>say('A lean-to of planks and a cart-cover, by the side track. A blanket, a tin cup, and a great many scratches on the wall: names, in columns. Wat Harrow has been copying them out.',[BYE]));
/* ---------- the level ---------- */
function bltBuild(p){
  const C=blKit({id:BLT.ID,W:BLT.W,H:BLT.H,name:p.name,lvl:84,start:{x:65,y:32,f:3},wind:.34});
  const {hs,rows}=C,F=blF();
  C.hills(.16);
  C.boundary();
  C.setF(2,2,69,61,'0');
  // the road: a dirt road three wide, a cobbled toll yard, a gravel apron at each gate
  C.pth(2,31,69,33,'1');C.pth(36,28,53,36,'4');C.pth(42,27,42,30,'4');C.pth(20,34,20,40,'2');
  C.pth(12,16,13,30,'1');C.pth(56,12,57,30,'1');C.pth(12,16,24,16,'1');
  C.flatten(2,26,69,38);
  C.gate('E',32);C.gate('W',32);
  // the toll house, and the yard in front of it
  C.house(BLT_HOUSE);
  C.reserve(36,28,53,36);
  C.lamp(40,29,C.warm);C.lamp(44,29,C.warm);
  for(const x of [40,44]){C.dec('gy_lantern',x,29,{block:true})}
  C.dec('bl_urn',38,28,{block:true,sc:.8});C.dec('bl_urn',47,28,{block:true,sc:.8});
  C.dec('kh_ohgard2_1',48,27,{block:true,sc:.9});C.dec('kh_oqstuff_8',49,27,{block:true});C.dec('kh_oqstuff_9',37,27,{block:true});
  C.dec('kh_ohgard2_3',50,35,{block:true,sc:.9});C.dec('kh_ohgard2_1',37,35,{block:true,sc:.9});
  // the toll bar, broken open: two posts with a crow each, a fallen pole of fence
  C.dec('gy_rpost',48,30,{block:true});C.dec('gy_rpost',48,34,{block:true});
  C.dec('bl_fence',47,34,{block:true,sc:.7});C.dec('bl_fence',49,30,{block:true,sc:.7});
  C.post(47,30,'bl_toll_post',[{n:"THE WARDENS' TOLL",d:0},{n:'WENLOCK',d:1}],'bl_tollsign','A signpost at the toll bar. One board reads THE WARDENS’ TOLL, and below it, smaller: ALL PAY. The other reads WENLOCK, pointing east. The bar itself is broken, and the pole lies in the road.',{i:2});
  C.dec('greensign',35,30,{block:true,npc:'blt_notice'});
  // the Wardens' graves, nine mounds in a railed row and six boards
  C.reserve(50,19,60,27);
  for(let x=51;x<=59;x+=2)C.dec('gy_mound',x,24,{block:true,sc:.8});
  for(let x=50;x<=60;x++){C.dec('bl_fence',x,22,{block:true,sc:.9});}
  BLT_GRAVES.forEach((g,i)=>{const k=blSlab('bl_wg'+i,[g[0].replace('WARDEN CAPTAIN ','').replace('WARDEN ',''),'WARDEN'],{h:.95,top:.2,span:.55});C.dec(k,i<5?51+i*2:55,i<5?23:26,{block:true,npc:'blt_wgrave',i})});
  for(const [x,y] of [[50,20],[60,20],[50,26],[60,26]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.pale)}
  // the ruined wayside shrine
  BLT.shrine={x:20,y:40};
  C.dec('bl_chapel',20,39,{block:true,sc:.75});
  C.dec('gy_candles',20,41,{block:true,npc:'blt_shrine',sc:.9});
  C.dec('gy_bench',18,42,{block:false});C.dec('gy_bench',22,42,{block:false});
  C.dec('gy_rose',17,41,{sc:.6});C.dec('gy_rose',23,41,{sc:.6});C.dec('bl_urn',17,39,{block:true,sc:.8});C.dec('bl_urn',23,39,{block:true,sc:.8});
  C.light(20,42,F.shrineLit?C.warm:C.pale);
  C.pth(20,41,20,43,'3');
  C.person('blt_nun',21,43,2);
  // the roadmender's hut up the north track, the lean-to by the shrine road, the crow tree and the crow-keeper in the north east
  C.dec('bl_hut',13,14,{block:true,npc:'blt_hut'});C.dec('bl_fence',11,17,{block:true,sc:.8});C.dec('bl_fence',15,17,{block:true,sc:.8});C.lamp(13,17,C.pale);
  C.dec('bl_hut',26,36,{block:true,npc:'blt_lean',sc:.6});C.dec('kh_oqstuff_8',28,36,{block:true,sc:.7});C.dec('kh_oqstuff_9',24,36,{block:true,sc:.7});C.light(27,37,C.warm);
  C.dec('ww_crowtree',58,13,{block:true,npc:'blt_crowtree'});
  for(const [x,y] of [[55,14],[61,14],[56,11],[60,11]])C.dec('gy_rpost',x,y,{block:true});
  C.person('blt_keeper',42,30,2);C.person('blt_crow',56,15,2);
  // the milestone and the signs at the gates
  C.milestone(7,30);
  C.post(66,34,'bl_toll_e',[{n:'WENLOCK',d:1}],'bl_signE','A signpost inside the east gate. The board reads WENLOCK, to the east, and below it somebody has scratched: THE HEDGES WERE GREEN THIS MORNING.',{i:4});
  C.post(5,34,'bl_toll_w',[{n:'ASHENFOLD FARM',d:-1}],'bl_signW','A signpost by the west gate. The board reads ASHENFOLD FARM, to the west. Underneath, in smaller letters: SUPPER AT SIX.',{i:5});
  // the dead hedges: two rows of bare thorn along the road, with gaps for the side tracks and the toll yard
  for(let x=3;x<=68;x++){
    if(x>=35&&x<=53)continue;
    if([12,13,56,57,26,27,20].includes(x))continue;
    for(const y of [29,35]){if(hs(x,y,33)<.86)C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  // lamps along the road: pale, one every eight squares, on the south side
  for(let x=10;x<=66;x+=8){if(x>34&&x<54)continue;C.dec('gy_lantern',x,36,{block:true});C.light(x,36,C.pale)}
  // dead fields: stalks of corn gone grey, a few wheelbarrows, stones
  for(const [x0,y0,x1,y1] of [[28,5,50,26],[14,38,34,58],[40,40,68,58],[4,5,10,27]]){
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(C.path.has(x+','+y)||hs(x,y,41)>.22)continue;const d=C.D('ww_twig2',x,y,{sc:.5+hs(x,y,42)*.4});if(d){d.ox=(hs(x,y,43)-.5)*.6;d.oy=(hs(x,y,44)-.5)*.6}}}
  C.dec('kh_ohgard1_5',30,12,{block:true,sc:.8});C.dec('kh_ohgard2_3',45,52,{block:true,sc:.8});
  C.dress({trees:150,scrub:260,stones:20,bones:8,posts:5,keep:(x,y)=>(x>=35&&x<=53&&y>=26&&y<=37)||(y>=29&&y<=35)||(x>=49&&x<=61&&y>=18&&y<=28)});
  // the creatures: Dead Road Wardens on the road and in the yard, husks in the fields, bones at the shrine, a flock in the crow tree
  C.foes([['bldeadwarden',56,31],['bldeadwarden',38,34],['bldeadwarden',30,32],['bldeadwarden',17,31],['bldeadwarden',52,25],['bldeadwarden',8,33],
    ['blbones',16,38],['blbones',24,39],['blbones',19,46],['blhusk',34,16],['blhusk',46,10],['blhusk',24,50],['blhusk',58,46],['blghoul',9,45],['blcrow',30,28],['blcrow',62,36]]);
  enemiesAdd(C,[['blcrowflock',58,15]]);
  for(const [k,x,y] of [['potion6',27,13],['potion6',48,50],['potion6',8,12]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:"The Wardens' Toll House",x:42,y:23,k:'place'},{t:'The Toll Yard',x:44,y:32,k:'place'},{t:'The Wayside Shrine',x:20,y:40,k:'place'},{t:"The Wardens' Graves",x:55,y:24,k:'place'},{t:"The Roadmender's Hut",x:13,y:13,k:'place'},{t:'The Crow Tree',x:58,y:13,k:'place'},{t:'To Wenlock',x:66,y:30,k:'place'},{t:'To Ashenfold Farm',x:6,y:30,k:'place'});
  const lv=C.finish({start:{x:65,y:32,f:3}});
  lv.tele=undefined;
  return lv}
/* a creature placed on the exact cell (a tree is solid): the foe goes on a free cell next to it */
function enemiesAdd(C,list){for(const [t,x,y] of list){if(!C.foe(t,x,y)&&!C.foeNear(t,x,y,2))console.error('no cell for',t,x,y)}}
/* the toll house inside: 13 by 9 */
function bltRoom(){
  blRoom({id:BLT.HOUSE,name:"The Wardens' Toll House",w:13,h:9,amb:.5,rating:84,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLT.ID,x:BLT_HOUSE.front[0],y:BLT_HOUSE.front[1],f:2},
    lights:[[3,2],[9,2],[6,5],[2,7],[10,7]],lcol:{'3,2':[1.4,1.0,.6],'9,2':[.7,1.1,.95],'6,5':[1.3,.95,.6],'2,7':[.7,1.1,.95],'10,7':[1.3,.95,.6]},col:[1.3,.95,.6],
    enemies:[['bldeadwarden',10,6]],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      P('bookshelf',2,1,{h:1.1});P('bookshelf',4,1,{h:1.1});P('hearth',9,1,{h:1.3});P('clock',7,1,{h:1.1});
      P('readdesk',6,3,{h:.85});C.raw('gy_book',6,3,{npc:'blt_ledger',solid:1,deco:false,bob:.38,sc:1});
      C.raw('gy_skel',7,3,{npc:'blt_deadwarden',solid:1,deco:false,sc:.95});
      C.raw('gy_chest',11,2,{npc:'blt_sealchest',solid:1,deco:false,sc:.9});
      P('bed',2,6,{h:.8});P('bed',2,7,{h:.8});P('candlerack',4,5,{h:1.0});P('coatrack',11,5,{h:1.0});P('noticeboard',5,1,{h:.9,block:false});
      P('waterbarrel',11,7,{h:.7});C.raw('gy_web',1,1,{block:false,sc:.5});C.raw('gy_bones',8,6,{block:false,sc:.7});C.raw('gy_bones',3,7,{block:false,sc:.6})}})}
/* wardens put down count towards blq2 */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&e.t==='bldeadwarden'&&qSt('blq2')==='active'){const F=blF();F.wk=(F.wk|0)+1;if(F.wk<=5)msg('A Road Warden put to rest ('+Math.min(5,F.wk)+' of 5).','#ffe36a')}}catch(x){console.error(x)}
  return r}}
/* the quest rings (see quest_rings_fix.js) */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),T=QRF.T;
  T.blq1={give:[N(9610,'blt_keeper')],act:()=>blF().ledger?[N(9610,'blt_keeper')]:[N(9611,'blt_ledger')],ready:[N(9610,'blt_keeper')]};
  T.blq2={give:[N(9610,'blt_crow')],act:[E(9610,/^bldeadwarden$/)],ready:[N(9610,'blt_crow')]};
  T.blq3={give:[N(9610,'blt_nun')],act:()=>blF().candle||blF().shrineLit?[N(9610,'blt_shrine')]:[N(9611,'blt_deadwarden')],ready:[N(9610,'blt_nun')]}}
/* ---------- registration ---------- */
blRegister(1,bltBuild,{fromE:{x:65,y:32,f:3},fromW:{x:4,y:32,f:1},exitY:32,rooms:[BLT.HOUSE],names:{9611:"The Wardens' Toll House"},rating:{9611:84}});
KH_LAZY[BLT.HOUSE]=()=>{if(!LEVELS[BLT.HOUSE]){if(!LEVELS[BLT.ID])KH_LAZY[BLT.ID]();bltRoom()}return LEVELS[BLT.HOUSE]};
