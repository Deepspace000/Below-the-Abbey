/* ==========================================================================
   PLACE 2 OF THE BLIGHTED ROAD: ASHENFOLD FARM (level 9620, rated 85; the farmhouse kitchen is 9621, the cellar 9622, the barn 9623; prefix bla / BLA). 80 by 70.
   The road runs east to west along y 34 to 36 (east gate x 78 back to the Toll House, west gate x 1 on to the Church of the Hollow Saint, 9630). A lane leads north into the muddy farmyard: the farmhouse (door to
   9621, where the dead family still sit at supper: the farmer, his wife, his mother and old Uncle Amos), the barn (9623, with the living cowman Hob), a well, haystacks, carts, a dead orchard, and two dead fields
   with walking scarecrows (they stand still until the party is close, then drop off their poles). The biggest scarecrow, in the north field, has a pale silver heart. The trapdoor in the kitchen leads to the cellar (9622), where a child is hiding.
   People: Hob Fenner the cowman (bla_hob, in the barn), Mistress Edda Sedge the farmer's wife (bla_edda, a ghost at the table), Tilly Sedge (bla_tilly, the child), Farmer Wilf Sedge (bla_wilf, at the table), Gran Sedge (bla_gran), Uncle Amos (bla_amos).
   Quests: blq4 The Child in the Cellar (Hob), blq5 The Silver Heart (Hob: kill the Heart-Scarecrow, burn its heart in the kitchen hearth), blq6 The Farmer's Ring (Edda: dig the ring out of the long furrow, put it on Wilf's finger at the table).
   Flags: G.flags.bl = {tillyFound, tillyFree, heart, heartBurnt, ring, ringGiven, chestA}.
   ========================================================================== */
const BLA={ID:9620,HOUSE:9621,CELLAR:9622,BARN:9623,W:80,H:70};
for(const [id,n] of [[9621,"The Sedges' Kitchen"],[9622,'The Farmhouse Cellar'],[9623,'The Ashenfold Barn']]){LEVEL_NAMES[id]=n;LEVEL_RATING[id]=85}
const BLA_HOUSE={x0:42,x1:51,y0:19,y1:24,face:'S',sty:'dbrick',roof:'thatch2',wh:2.4,to:BLA.HOUSE};
const BLA_BARN={img:'b14_barn',x0:56,x1:60,y0:20,y1:24,w:5.2,wh:2.4,to:BLA.BARN};
ITEMDEF.blheart={n:'Pale Silver Heart',k:'quest',t:'Quest item',ic:'ore',c:'#d8e0e8',stack:1,price:0,sw:.3,d:'A lump of pale silver the size of a fist, shaped roughly like a heart, taken from the chest of the great scarecrow. It is cold, and it is faintly warm when you hold it. Burn it in the hearth of the farmhouse kitchen.'};
ITEMDEF.blring={n:"The Farmer's Wedding Ring",k:'quest',t:'Quest item',ic:'ring',c:'#e0b050',stack:1,price:0,sw:.1,d:'A plain gold ring worn thin, dug out of the long furrow in the dead field. Inside it is cut: W and E, and a date forty years gone. It belongs on Farmer Wilf Sedge’s finger.'};
ITEMDEF.blsedgering={n:"Sedge's Wedding Band",k:'ring',t:'Ring',ic:'ring',c:'#d8b868',price:0,lvl:85,pas:{ward:16,dodge:.06,regen:.7,mpRegen:.4},int:5,hp:75,rar:1,sw:.1,d:'A second ring in the Sedge family, thin gold, left on the supper table for whoever finished the quarrel. Adds 5 Intelligence and 75 health, every blow on the wearer is 16 lighter, enemies miss 6% more, and wounds and weariness close steadily. Needs level 85.'};
ITEMDEF.blscythe={n:"Hob's Reaping Hook",k:'weapon',t:'Sword',ic:'sword',c:'#c0c8c8',dmg:[440,540],hit:.2,req:{str:68},lvl:85,price:0,rar:1,eff:{bleed:[.35,6,40],bossdmg:.3},dbl:.2,sw:.46,d:'A long reaping hook with a grey ash handle, sharpened on the same stone for fifty harvests. Wounds bleed hard, and bosses take 30% more. Needs level 85.'};
/* ---------- the people ---------- */
khNpc('bla_hob','Hob Fenner, cowman','kh_ohfolk7_3',()=>yrLines('bla_hob',[
  'I have been in this barn since the supper started. That was nine days ago. They have not finished eating. They do not eat, you understand. They just sit, and pass the bread.',
  'The cows went first. Then the dog went quiet. Then the scarecrows started coming down off their poles at dusk, one at a time, and standing in the lane. I do not go out at dusk.',
  'Mistress Edda was good to me. I would like to think she knows what she is. I would like to think she would not mind me not coming in.']));
khNpc('bla_edda','Edda Sedge, at supper','gy_ghost1',()=>yrLines('bla_edda',[
  'Sit, sit. There is plenty. Wilf will be along in a moment, he never lets the soup go cold.',
  'It is a nice evening. A little grey, but nice. Tilly will be home soon, she is only playing in the cellar.',
  'You will have heard about the scarecrow. I told Wilf not to stuff him with silver. Silver is for the wedding, I said.']),{sc:1});
khNpc('bla_wilf','Farmer Wilf Sedge, at supper','gy_zombie',()=>yrLines('bla_wilf',[
  'Pass the bread. Pass the bread. Pass the bread.',
  'There was something I had to do before supper. My hand feels light. I cannot think what I have lost.']),{sc:1});
khNpc('bla_gran','Gran Sedge, at supper','gy_ghost0',()=>yrLines('bla_gran',[
  'I said to him, you cannot sow in October. Nobody listens to the old.',
  'A very polite young man came and said he would take the harvest away. A pale man. His coat was all wax. We shook hands, and the grain was never the same.']),{sc:1});
khNpc('bla_amos','Uncle Amos, at supper','gy_skel',()=>yrLines('bla_amos',[
  'Clack. (He holds out an empty plate to you, with great dignity, and puts it down again.)',
  'Clack. Clack. (He has the look of a man who never thought much of the soup.)']),{sc:.95});
khNpc('bla_tilly','Tilly Sedge','kh_ohfolk3_0',d=>{
  const F=blF();
  if(!F.tillyFound){F.tillyFound=1;sfx('key');return say('A small girl in a nightdress sits behind the barrels with a doll, with her knees up and her hands over her ears. She looks up very slowly. "Are you dead?" she says. "Mummy says it is only for a little while. But I do not think the rest of them are going to stop. Please can I come out?"',[['Come out. We will take you somewhere safe.',()=>blaFreeTilly(d)],['Stay there a moment longer.',()=>null]])}
  if(!F.tillyFree)return say('"Please can I come out? I have been so quiet."',[['Come out. We will take you somewhere safe.',()=>blaFreeTilly(d)],BYE]);
  return yrLines('bla_tilly',['"Hob says I am to stay in the barn and never go near the kitchen. I told him I would not. I do not want any more supper."','"My doll is called Mrs Pennyworth. She was in the cellar with me. She says thank you."'])},{sc:.78});
function blaFreeTilly(d){
  const F=blF();F.tillyFree=1;sfx('win');
  if(d){d.found=true;d.block=false}
  try{const L=LEVELS[BLA.CELLAR];if(L)for(const x of L.decor)if(x.npc==='bla_tilly')x.found=true}catch(e){}
  try{const L=LEVELS[BLA.BARN];if(L&&!L.decor.some(x=>x.npc==='bla_tilly'))blaTillyIn(L.decor)}catch(e){}
  msg('Tilly slips past the kitchen and runs across the yard to the barn.','#ffe36a');return null}
function blaTillyIn(decor){const kp=KH_KEEPERS.bla_tilly;decor.push({k:khFaceKey(kp.face),x:9,y:5,block:false,walk:true,npc:'bla_tilly',sc:kp.sc||1})}
/* ---------- the quests ---------- */
function blaQ(id,title,who,steps,reward){const q=yrQ(id,title,who,steps,reward);QAREA[id]=BL.REGION;return q}
blaQ('blq4','The Child in the Cellar','Hob Fenner, cowman',[
  ["Find Tilly, the farmer's girl, in the cellar under the farmhouse (the trapdoor is in the kitchen) and take her out to the barn.",()=>!!blF().tillyFree,['bla_tilly']]],
  {gold:3000,xp:25000,items:['potion6','potion6']});
blaQ('blq5','The Silver Heart','Hob Fenner, cowman',[
  ['Break the great scarecrow in the north field of Ashenfold and take the pale silver heart from its chest.',()=>!!(blF().heart||blF().heartBurnt),['bla_hob']],
  ['Burn the silver heart in the hearth of the farmhouse kitchen.',()=>!!blF().heartBurnt,['bla_hearth']]],
  {gold:4200,xp:32000,items:['blscythe','potion6']});
blaQ('blq6',"The Farmer's Ring",'Edda Sedge, at supper',[
  ["Find Wilf Sedge's wedding ring. Edda says he lost it ploughing the long furrow in the south field, by the old stone.",()=>!!(blF().ring||blF().ringGiven),['bla_ringspot']],
  ['Give the ring to Farmer Wilf, at the supper table in the kitchen.',()=>!!blF().ringGiven,['bla_wilf']]],
  {gold:3400,xp:28000,items:['blsedgering','potion6']});
wwGive('bla_hob','blq4',()=>true,{
  offer:'Please. The farmer’s girl, Tilly, ran into the cellar when it began, and I have not seen her since. I heard her through the floor the first night. I cannot get in: the family sit at supper in the kitchen, and when I open the door they all turn their heads together. Would you go?',
  accept:'Thank you. The trapdoor is in the kitchen, in the corner by the dresser. Go quietly. They are not unkind. They just do not stop.',
  remind:()=>'Tilly is in the cellar, under the kitchen. Take her out to me in the barn.',
  ready:'She is here. Oh, thank the Saint. Look at her. She has not even lost the doll.',
  thanks:'You have done a better thing than you know. Take this.',
  after:'Tilly sleeps in the loft. She talks about the dead people at supper as if they were an odd set of relatives.'});
wwGive('bla_hob','blq5',()=>qSt('blq4')==='done',{
  offer:'There is one more thing, and it is worse. The great scarecrow in the north field was ours. Wilf made it for the wedding of the barley. Something put silver in its chest, and now it walks, and the others follow it. Break it, and take out what is in its chest. The only fire hot enough is the kitchen hearth, and you will have to walk in past the family to use it.',
  accept:'Then you are braver than I am. Do not let the others near you while you fight it. They wake when you are close.',
  remind:()=>blF().heart?'You have the heart. Burn it in the hearth of the farmhouse kitchen.':'The great scarecrow stands in the north field, in the rows of dead corn.',
  ready:'It is done. I could feel it go from here, like a tooth coming out.',
  thanks:'The field will not grow, but it will stop walking. Take my reaping hook. I have no more use for it.',
  after:'The scarecrows still stand on their poles, but they stay on them now.'});
wwGive('bla_edda','blq6',()=>true,{
  offer:'Oh, you are so kind to listen. It is only a small thing. Wilf lost his wedding ring ploughing the long furrow in the south field, by the old stone, and he has not been right since. His hand feels light, he says. I cannot leave the table. Would you look for it?',
  accept:'Thank you, dear. The old stone is in the south field. Dig by the foot of it, where the furrow ends.',
  remind:()=>blF().ring?'You have the ring. Put it on Wilf’s finger, at the table.':'The ring is in the long furrow, by the old stone in the south field.',
  ready:'He has stopped saying it. He is only sitting, now, and holding my hand.',
  thanks:'Thank you. We will be going soon, I think. Take the other ring from the table. It was my mother’s.',
  after:'It is a very quiet supper tonight. A good one.'});
/* ---------- the objects ---------- */
khNpc('bla_hearth','The kitchen hearth','gy_candles',()=>{
  const F=blF();
  if(F.heartBurnt)return say('The fire has burnt down to white ash. A small puddle of silver cooled on the hearthstone and was swept away.',[BYE]);
  if(bagCount('blheart')>0)return say('A wide stone hearth with a good fire. The family at the table do not look round. You have the pale silver heart.',[['Throw the heart into the fire.',()=>{bagRemove('blheart',1);F.heartBurnt=1;sfx('win');msg('The silver heart screams once, thinly, and runs down into the ashes. Far off, in the north field, something falls over.','#ffe9a0');return null}],BYE]);
  return say('A wide stone hearth with a good fire, though nobody has fed it. The family at the table do not look round.',[BYE])});
khNpc('bla_cellardoor','A trapdoor','gy_hatch2',()=>say('A trapdoor in the kitchen floor, in the corner by the dresser. The ring-pull is worn bright. Somebody small, below, is breathing very carefully.',[['Open it and go down.',()=>{sfx('door');G.talk=null;goToLevel(BLA.CELLAR,{x:5,y:2,f:2});return null}],BYE]));
khNpc('bla_ringspot','Turned earth','gy_mound',()=>{
  const F=blF();
  if(F.ring||F.ringGiven)return say('The furrow is dug up where you took the ring. Nothing else is here.',[BYE]);
  return say('The long furrow ends at an old stone. The earth at its foot has been turned over once, long ago, and a thin edge of gold shows in it.',[['Dig.',()=>{F.ring=1;if(!bagAdd(mkItem('blring')))G.items.push({k:'blring',x:G.P.x,y:G.P.y,taken:false});sfx('key');msg("You dig up Wilf Sedge's wedding ring.",'#ffe36a');return null}],BYE])});
/* Wilf, with the ring in the bag, gets a branch of his own */
yrHook('bla_wilf',d=>{const F=blF();
  if(F.ring&&!F.ringGiven&&bagCount('blring')>0)return say('Farmer Wilf sits at the head of the table with his hand flat on the cloth, as if waiting. His fingers are bare.',[['Put the ring on his finger.',()=>{bagRemove('blring',1);F.ringGiven=1;sfx('win');msg('Wilf Sedge looks at his hand for a long time.','#ffe9a0');return say('He turns the ring once, with his thumb. "There," he says, in a perfectly ordinary voice. "That was it." He takes his wife’s hand, and does not say anything else.',[BYE])}],BYE]);
  if(F.ringGiven)return yrLines('bla_wilf2',['"Thank you. I knew I had put it somewhere."','"Pass the bread, Edda. No. Sit. Let somebody else pass it."']);
  return null});
khNpc('bla_well','The Ashenfold well','ww_well',()=>say('A stone well with a little roof, and a rope gone black with damp. You drop a pebble. It lands a very long time later, in something that is not quite water. A sign nailed to the roof says: DO NOT DRINK. DO NOT LOOK DOWN. DO NOT ANSWER.',[BYE]));
khNpc('bla_scarepole','A scarecrow pole','ww_totem',()=>say('An empty scarecrow pole, with a crosspiece, and a few rags on it. The straw has gone. Where it went, you can guess.',[BYE]));
khNpc('bla_stone','The old stone','ww_stone',()=>say('A tall grey stone at the end of the long furrow. The ploughmen used to turn the team here. Generations of them have leaned on it. There is turned earth at its foot.',[BYE]));
khNpc('bla_chest','A farm chest','gy_chest',d=>{
  const F=blF();if(F.chestA)return say('The chest is empty.',[BYE]);
  return say('A plain chest with a rusted padlock, hanging open. Inside, under the sacking, is the farm’s egg money, and a little more.',[['Take it.',()=>{F.chestA=1;G.gold+=1400;if(ITEMDEF.supermana&&bagAdd(mkItem('supermana'))){}sfx('win');msg('You take 1400 gold.','#ffe36a');return null}],BYE])});
khNpc('bla_sign_farm','A farm signpost','greensign',()=>say('A signpost at the end of the farm lane. The board reads ASHENFOLD FARM, to the north, and below it: EGGS. MILK. HONEST DEALING. Somebody has added with a nail: AND SUPPER.',[BYE]));
khNpc('bla_pigs','A pig sty','bl_fence',()=>say('A sty with a low roof. The pigs are gone. The mud inside is deeply trodden, in a ring, as if something walked round and round all night.',[BYE]));
/* the hearth in the kitchen and the cellar door are decor; the heart drops when the great scarecrow dies */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&e.t==='blscarebig'){const F=blF();if(!F.heart&&!F.heartBurnt){F.heart=1;if(!bagAdd(mkItem('blheart')))G.items.push({k:'blheart',x:Math.round(e.x),y:Math.round(e.y),taken:false});msg('A pale silver heart falls out of the straw. You take it.','#ffe36a');sfx('win')}}}catch(x){console.error(x)}
  return r}}
/* ---------- the level ---------- */
function blaBuild(p){
  b14Dead('b14_barn','wl_bldg1_5','saturate(.45) brightness(.66)',NPC_H.wl_bldg1_5);
  const C=blKit({id:BLA.ID,W:BLA.W,H:BLA.H,name:p.name,lvl:85,start:{x:73,y:35,f:3},wind:.36});
  const {hs}=C,F=blF();
  C.hills(.15);C.boundary();C.setF(2,2,77,67,'0');
  C.pth(2,34,77,36,'1');C.pth(35,25,65,33,'5');C.pth(46,25,50,33,'5');C.pth(26,21,26,33,'1');
  C.flatten(2,18,77,40);
  C.gate('E',35);C.gate('W',35);
  // the farmhouse, the barn, the yard
  C.house(BLA_HOUSE);C.picHouse(BLA_BARN);C.reserve(35,25,65,33);
  for(const [x,y] of [[43,26],[50,26]]){C.dec('gy_lantern',x,y,{block:true});C.light(x,y,C.warm)}
  C.dec('bl_urn',41,25,{block:true,sc:.8});C.dec('bl_urn',52,25,{block:true,sc:.8});
  C.dec('ww_well',39,29,{block:true,npc:'bla_well'});
  C.dec('hay',63,26,{block:true,sc:1.3});C.dec('hay',64,29,{block:true,sc:1.2});C.dec('hay',61,31,{block:true,sc:1.1});C.dec('hay',37,27,{block:true,sc:1.0});
  C.dec('kh_ohgard1_5',55,29,{block:true,sc:.9});C.dec('kh_ohgard2_3',44,31,{block:true,sc:.9});C.dec('kh_ohgard2_1',53,27,{block:true,sc:.9});C.dec('kh_oqstuff_8',54,27,{block:true});C.dec('kh_oqstuff_9',62,28,{block:true});C.dec('kh_ohgard2_1',36,31,{block:true,sc:.9});
  C.dec('bl_barrow',58,30,{block:true,sc:.9});
  // wooden fences round the yard, with the lane open; the pig sty beside the barn
  for(let x=35;x<=65;x++){if(x>=45&&x<=51)continue;C.dec('bl_wfence',x,33,{block:true,sc:.9})}
  for(let y=26;y<=32;y++){C.dec('bl_wfence',35,y,{block:true,sc:.9});C.dec('bl_wfence',65,y,{block:true,sc:.9})}
  C.dec('bl_fence',62,22,{block:true,sc:.8,npc:'bla_pigs'});C.dec('bl_fence',63,22,{block:true,sc:.8});
  C.post(44,36,'bl_ash_farm',[{n:'ASHENFOLD FARM',d:0}],'bla_sign_farm','A signpost at the end of the farm lane. The board reads ASHENFOLD FARM, to the north, and below it: EGGS. MILK. HONEST DEALING. Somebody has added with a nail: AND SUPPER.',{i:1});
  C.light(48,32,C.warm);C.light(40,31,C.pale);C.light(60,31,C.warm);
  // dead hedges along the road, with gaps for the lane and the field tracks
  for(let x=3;x<=76;x++){if([26,27,47,48,49,70].includes(x))continue;
    for(const y of [32,38]){if(x>=35&&x<=65&&y===32)continue;if(hs(x,y,33)<.84)C.DB('bl_hedge'+((hs(x,y,35)*3)|0),x,y,{sc:.62+hs(x,y,34)*.22})}}
  for(let x=10;x<=74;x+=8){if(x>34&&x<66)continue;C.dec('gy_lantern',x,38,{block:true});C.light(x,38,C.pale)}
  C.milestone(8,33);
  C.post(5,37,'bl_ash_w',[{n:'THE CHURCH OF THE HOLLOW SAINT',d:-1}],'bla_signW','A signpost by the west gate. The board reads THE CHURCH OF THE HOLLOW SAINT, to the west. Below it somebody has written: THE BELLS ARE UPSIDE DOWN. DO NOT BE ALARMED.',{i:2});
  C.post(74,37,'bl_ash_e',[{n:"THE WARDENS' TOLL HOUSE",d:1}],'bla_signE','A signpost inside the east gate. The board reads THE WARDENS’ TOLL HOUSE, to the east. Below it: NO TOLL TO RETURN.',{i:3});
  // the fields: rows of dead corn, scarecrow poles, the stone and the long furrow, an orchard of dead apple trees
  b14Furrows(C,4,5,34,28,.8);b14Furrows(C,4,42,34,64,.8);
  C.reserve(8,44,28,58);
  C.dec('ww_stone',27,51,{block:true,npc:'bla_stone',sc:.8});C.dec('gy_mound',26,52,{block:true,npc:'bla_ringspot',sc:.6});C.light(26,53,C.pale);
  for(const [x,y] of [[12,8],[20,16],[30,10],[8,22],[16,46],[30,58]])C.dec('ww_totem',x,y,{block:true,npc:'bla_scarepole',sc:.8});
  for(const [x,y] of [[68,44],[72,48],[66,52],[74,56]])C.dec('ww_stump',x,y,{block:true,sc:.7});
  for(const [x,y] of [[10,10],[22,12],[28,24],[16,26]])C.dec('hay',x,y,{block:true,sc:1.1});
  C.dec('kh_ohgard2_3',14,30,{block:true,sc:.8});C.dec('kh_ohgard1_5',32,44,{block:true,sc:.8});
  for(const [x,y] of [[40,50],[44,54],[50,52],[56,56],[62,50],[46,60],[54,62],[60,60]])C.DB('ww_oakmoss',x,y,{sc:.8});   // the dead orchard
  b14AshDress(C);
  b14Patches(C,{keep:(x,y)=>x>=34&&x<=66&&y>=17&&y<=34||x<=34&&(y>=5&&y<=28||y>=42&&y<=64)});
  C.dress({trees:130,scrub:180,stones:14,bones:8,posts:6,keep:(x,y)=>(x>=34&&x<=66&&y>=17&&y<=34)||(y>=32&&y<=38)||(x>=6&&x<=34&&y>=3&&y<=29)||(x>=6&&x<=34&&y>=41&&y<=65)});
  // the creatures
  C.foes([['blscare',12,12],['blscare',24,8],['blscare',30,18],['blscare',8,20],['blscare',22,24],['blscare',14,46],['blscare',24,56],['blscare',32,50],['blscarebig',18,10],
    ['blhusk',62,42],['blhusk',50,40],['blhusk',72,50],['blghoul',44,58],['blbones',38,36],['blbones',62,36],['blbones',20,34],['blhound',54,46],['blcrow',30,32],['blcrow',60,29],['blcrowflock',56,60]]);
  for(const [k,x,y] of [['potion6',30,26],['potion6',20,60],['potion6',68,60]])C.items.push({k,x,y,taken:false});
  C.mapNames.push({t:'Ashenfold Farmhouse',x:46,y:21,k:'place'},{t:'The Barn',x:58,y:22,k:'place'},{t:'The Well',x:39,y:28,k:'place'},{t:'The North Field',x:18,y:12,k:'place'},{t:'The Long Furrow',x:18,y:51,k:'place'},{t:'The Old Stone',x:27,y:50,k:'place'},{t:'The Dead Orchard',x:52,y:56,k:'place'},{t:'To the Toll House',x:73,y:33,k:'place'},{t:'To the Church',x:6,y:33,k:'place'});
  const lv=C.finish({start:{x:73,y:35,f:3}});
  // the pale heart-scarecrow is still while it lives: remove it from a save in which the heart was taken
  if(F.heart||F.heartBurnt)lv.enemies=lv.enemies.filter(e=>e.t!=='blscarebig');
  return lv}
/* ---------- the rooms ---------- */
function blaKitchen(){
  const f=BLA_HOUSE.front;
  blRoom({id:BLA.HOUSE,name:"The Sedges' Kitchen",w:15,h:10,amb:.52,rating:85,floor:'wood',wall:'kh_ohwall1_2',
    back:{to:BLA.ID,x:f[0],y:f[1],f:2},
    lights:[[3,2],[7,5],[11,2],[3,7],[12,7]],lcol:{'3,2':[1.4,1.0,.6],'7,5':[1.35,.98,.58],'11,2':[1.4,1.0,.6],'3,7':[1.3,.95,.6],'12,7':[.75,1.1,.95]},col:[1.3,.95,.6],
    enemies:[['blbones',12,8]],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      P('hearth',7,1,{h:1.3});C.raw('crate',7,2,{npc:'bla_hearth',solid:1,deco:false,hidden:true});
      P('dresser',2,1,{h:1.05});P('clock',11,1,{h:1.1});P('rocker',12,3,{h:.7});P('bookshelf',13,1,{h:1.0});
      P('longtable',7,5,{h:.7});P('longtable',9,5,{h:.7});P('longtable',5,5,{h:.7});
      // the family at supper: four places, each behind the table
      C.raw('gy_ghost1',5,4,{npc:'bla_edda',solid:1,deco:false,sc:1});C.raw('gy_zombie',7,4,{npc:'bla_wilf',solid:1,deco:false,sc:1});C.raw('gy_ghost0',9,4,{npc:'bla_gran',solid:1,deco:false,sc:1});C.raw('gy_skel',11,5,{npc:'bla_amos',solid:1,deco:false,sc:.95});
      C.raw('gy_hatch2',2,5,{npc:'bla_cellardoor',solid:1,deco:false,sc:1});
      P('candlerack',3,3,{h:1.0});P('pietable',12,7,{h:.7});P('waterbarrel',1,8,{h:.7});P('cat',4,8,{h:.26});P('veg',13,8,{h:.6});
      C.raw('gy_web',1,1,{block:false,sc:.5})}})}
function blaCellar(){
  blRoom({id:BLA.CELLAR,name:'The Farmhouse Cellar',w:11,h:8,amb:.4,rating:85,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLA.HOUSE,x:3,y:5,f:3},
    lights:[[3,2],[8,2],[5,5]],lcol:{'3,2':[.75,1.1,.95],'8,2':[1.3,.95,.6],'5,5':[.75,1.1,.95]},col:[1.2,.95,.65],
    enemies:[['blghoul',8,5]],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      P('coopstack',2,1,{h:.95});P('coopstack',4,1,{h:.95});P('shelving',7,1,{h:1.2});P('shelving',9,1,{h:1.2});P('waterbarrel',1,3,{h:.7});P('veg',9,4,{h:.6});
      P('cot',8,6,{h:.55});P('coopstack',2,6,{h:.9});
      C.raw('gy_chest',9,6,{npc:'bla_chest',solid:1,deco:false,sc:.9});C.raw('gy_bones',5,4,{block:false,sc:.3});
      if(!blF().tillyFree){const kp=KH_KEEPERS.bla_tilly;C.raw(khFaceKey(kp.face),3,5,{npc:'bla_tilly',solid:1,deco:false,sc:kp.sc||1,block:false,walk:true})}}})}
function blaBarn(){
  const f=BLA_BARN.front;
  blRoom({id:BLA.BARN,name:'The Ashenfold Barn',w:13,h:9,amb:.5,rating:85,floor:'wood',wall:'kh_ohwall1_0',
    back:{to:BLA.ID,x:f[0],y:f[1],f:2},
    lights:[[3,2],[9,2],[6,5]],lcol:{'3,2':[1.35,.98,.58],'9,2':[1.3,.95,.6],'6,5':[1.35,.98,.58]},col:[1.3,.95,.6],
    enemies:[['blhusk',10,6]],
    build:C=>{
      const P=(n,x,y,o)=>{try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}};
      for(const [x,y] of [[2,1],[3,1],[10,1],[11,1],[1,6],[11,7]])C.raw('hay',x,y,{block:true,sc:1.1});
      P('coopstack',5,1,{h:.95});P('waterbarrel',8,1,{h:.7});P('cothearth',6,1,{h:.95});P('bed',2,5,{h:.7});P('dresser',11,4,{h:1.0});
      C.npc('bla_hob',6,4)}})}
KH_LAZY[BLA.HOUSE]=()=>{if(!LEVELS[BLA.HOUSE]){if(!LEVELS[BLA.ID])KH_LAZY[BLA.ID]();blaKitchen()}return LEVELS[BLA.HOUSE]};
KH_LAZY[BLA.CELLAR]=()=>{if(!LEVELS[BLA.CELLAR]){if(!LEVELS[BLA.ID])KH_LAZY[BLA.ID]();blaCellar()}return LEVELS[BLA.CELLAR]};
KH_LAZY[BLA.BARN]=()=>{if(!LEVELS[BLA.BARN]){if(!LEVELS[BLA.ID])KH_LAZY[BLA.ID]();blaBarn();if(blF().tillyFree&&!LEVELS[BLA.BARN].decor.some(x=>x.npc==='bla_tilly'))blaTillyIn(LEVELS[BLA.BARN].decor)}return LEVELS[BLA.BARN]};
/* the quest rings */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),T=QRF.T;
  T.blq4={give:[N(9623,'bla_hob')],act:()=>blF().tillyFound?[N(9622,'bla_tilly')]:[N(9622,'bla_tilly'),N(9621,'bla_cellardoor')],ready:[N(9623,'bla_hob')]};
  T.blq5={give:[N(9623,'bla_hob')],act:()=>blF().heart?[N(9621,'bla_hearth')]:[E(9620,/^blscarebig$/)],ready:[N(9623,'bla_hob')]};
  T.blq6={give:[N(9621,'bla_edda')],act:()=>blF().ring?[N(9621,'bla_wilf')]:[N(9620,'bla_ringspot')],ready:[N(9621,'bla_edda')]}}
blRegister(2,blaBuild,{fromE:{x:73,y:35,f:3},fromW:{x:4,y:35,f:1},exitY:35,rooms:[9621,9622,9623],names:{9621:"The Sedges' Kitchen",9622:'The Farmhouse Cellar',9623:'The Ashenfold Barn'},rating:{9621:85,9622:85,9623:85}});

/* ---------- polish (round 1 to 4): the farmyard, dressed ---------- */
function b14AshDress(C){
  const cart=b14Dead('b14_cart','cart','saturate(.3) brightness(.62)',1.1),gcart=b14Dead('b14_gcart','wl_prop1_5','saturate(.2) brightness(.55)',1.0),sacks=b14Dead('b14_sacks','sacks','saturate(.3) brightness(.6)',.7),
    wash=b14Dead('b14_wash','yar_washing','saturate(.1) brightness(.7) opacity(.9)',1.3),pots=b14Dead('b14_pots','yar_pots','saturate(.3) brightness(.6)',.4),ban=b14Dead('b14_banner','banner','saturate(.5) brightness(.75)',1.6);
  // the grain cart left in the yard, sacks and barrels at the barn door, a washing line with grey sheets, a milk-can stack (crates), the water trough side (barrels)
  b14Place(C,[[gcart,54,31,{sc:1}],[sacks,56,27,{sc:.9}],['barrel',60,27,{sc:.9}],['barrel',61,27,{sc:.8}],['crate',57,27,{sc:.9}],[wash,38,32,{sc:1}],[pots,41,31,{sc:1}],['barrel',37,26],['crate',38,26],
    [cart,52,30,{sc:.9}],['gy_lantern',45,26],['gy_lantern',48,26]]);
  C.light(45,26,C.warm);C.light(48,26,C.warm);
  for(const [x,y] of [[46,32],[59,31],[40,28],[51,32],[44,29]])C.dec('gy_bones',x,y,{sc:.4});
  // the lane and the road: a broken cart and a crate stack at the verges
  for(const [x,y] of [[20,33],[66,37],[30,37]])C.dec(x%2?cart:gcart,x,y,{block:true,sc:.9});
  for(const [x,y] of [[14,33],[54,37],[72,33]])C.dec('crate',x,y,{block:true,sc:.8})}
