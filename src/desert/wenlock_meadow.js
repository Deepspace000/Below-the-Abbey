/* ==========================================================================
   WENLOCK: THE EMPTY MEADOWS (prefix wle). Detail for the big flat fields, five small quests for the people who live near them, and the people and things those quests need.
   Detail: cattails at the pond and the brook, flower clumps, a few more trees (never close to another), benches, stumps and logs, mossy stones, a haystack or two. Kept light.
   Quests (all open once the mayor's welcome is done, rewards for a party of level 80):
   wlq16 The Stuck Dove       Dobbs the farmhand, north-east meadow: a dove is tangled in the netting of the dovecote (room 7094).
   wlq17 Scarecrow Duty       Rafe the woodsman: three old scarecrows in the north-east meadow need their hats put right.
   wlq18 A Muddy Letter       Meg the shepherd: a letter with paw prints in a wheelbarrow at the east end of the back track, for Old Bracken in his den in the north-east corner.
   wlq19 The Lost Duckling    Hetty the dairymaid, south meadow: carry a duckling over the bridge to its mother on the village green pond.
   wlq20 The Evening Rounds   Brother Tuck: light the five lanterns of Churchyard Lane, and lay a wildflower on old Hester's grave, where a mourning dove sits.
   (There is no painted owl or fox yet, so the dove and a hermit stand in for them; the scarecrows are the painted coat stand.)
   ========================================================================== */
for(const [k,h] of [['pet_duck_0',.45],['pet_duck_1',.4],['pet_parrot_0',.5],['wd_rock0',1.1]])if(NPC_H[k]===undefined)NPC_H[k]=h;
function wleObj(npc,k,at,rad,o){WL_QOBJ.push({npc,k:typeof k==='function'?k:()=>k,at,rad:rad||3,o:o||{}})}
Object.assign(WL_REW,{wlq16:{gold:800,xp:8000},wlq17:{gold:700,xp:7000},wlq18:{gold:900,xp:9000,items:['potion5']},wlq19:{gold:800,xp:8000},wlq20:{gold:1000,xp:10000,items:['potion5']}});
WL_QUESTS.push(
  {id:'wlq16',giver:'Dobbs the farmhand',title:'The Stuck Dove',desc:'A dove is tangled in the netting inside the old dovecote in the north-east meadow. Go in and free it.'},
  {id:'wlq17',giver:'Rafe the woodsman',title:'Scarecrow Duty',desc:'Three old scarecrows in the north-east meadow have lost their hats and their dignity. Put each right.'},
  {id:'wlq18',giver:'Meg the shepherd',title:'A Muddy Letter',desc:'A letter with muddy paw prints has been left at the east end of the back track. Take it to Old Bracken, the hermit.'},
  {id:'wlq19',giver:'Hetty the dairymaid',title:'The Lost Duckling',desc:'A duckling has wandered into the south meadow, far from its mother. Carry it over the bridge to the pond on the green.'},
  {id:'wlq20',giver:'Brother Tuck',title:'The Evening Rounds',desc:'Light the five lanterns along Churchyard Lane, and lay a wildflower on old Hester\'s grave.'});
const wleF=()=>G.flags;
const wleDup=(F,k,n)=>{let c=0;for(let i=1;i<=n;i++)if(F[k+i])c++;return c};
/* ---- wlq16: the stuck dove ---- */
khNpc('wlm_dovestuck','A dove, caught in the netting','kh_anim1_5',d=>{const F=wleF();
  if(qSt('wlq16')==='active'&&!F.wlq16a){F.wlq16a=1;yrStep('You have freed the dove.');d.found=true;d.block=false;return say("A grey-white dove, one wing folded the wrong way into the old netting, looking at you with one very round orange eye. You lift the cord off her, strand by strand. She sits quite still until the last strand is off, and then she is gone out of the loft window in a clatter of wings, and a feather floats down to land on your boot.",[BYE])}
  if(F.wlq16a){d.found=true;d.block=false;return say('The netting hangs empty. A single feather lies under it.',[BYE])}
  return say('A dove, tangled in the old netting, watching you with one eye. She cannot get out. Nobody has asked you to help yet, but she does not know that.',[BYE])},{sc:.9});
const WLD16=khQD("Oh, good, somebody with two hands. There is a dove stuck in the dovecote, in the netting at the back of the loft, and I can hear her from here. I would go myself, but I am afraid of birds, which is a bad thing in a farmhand. They are only little. They look at me. Would you go in and let her out? The dovecote is the round stone tower in the middle of the north-east meadow, with the little arched door. Just lift the cord off her, and mind she does not have your eye.",
  "Thank you. The round tower in the meadow, the arched door. Mind the step.",
  (n,m)=>'The dove is in the dovecote, the round stone tower in the north-east meadow. Go in and lift the netting off her.',
  "She is out? She flew? And she did not mind? Well. I may have been a little unfair to birds.",
  "Here. It is not much, but it is honest, and it is mostly money. The doves will be very pleased. They will not say so. They will coo, which is the same.",
  "The dove has been seen on the barn roof, looking pleased, and not at all like a bird who ever got stuck.","The dove is free.");
wlQ('wlq16','Dobbs the farmhand',[["Go into the dovecote, the round stone tower in the north-east meadow, and free the dove from the netting.",()=>wleF().wlq16a,['wlm_dovestuck']]]);
wlGive('wlo_farmhand','wlq16','wlq1',WLD16);
/* ---- wlq17: scarecrow duty ---- */
const WLE_SCARE=[[41,22],[53,31],[66,38]];
WLE_SCARE.forEach((at,i)=>{const id='wlo_scare'+(i+1);
  khNpc(id,'An old scarecrow','wl2_hall_5',d=>{const F=wleF(),flag='wlq17_'+(i+1);
    if(qSt('wlq17')==='active'&&!F[flag]){F[flag]=1;yrStep('You have put a scarecrow right. ('+wleDup(F,'wlq17_',3)+'/3)');return say(["The scarecrow leans in a crooked line. You set the pole straight, push the hat down on its head and stuff a fistful of fresh straw back up its sleeve. It looks a great deal more threatening. A crow on the next fence post looks at it, and then at you, and moves house.","The scarecrow has slipped down its pole and its hat is over one eye. You hitch it up, find the hat a better angle, and tie the coat shut with a bit of string. It looks quite smug now.","The scarecrow has lost most of an arm. You find the arm in the grass, and put it back. It is not the same arm, but it is a good arm. The crows will not know."][i],[BYE])}
    return say(F[flag]?'The scarecrow stands very straight, hat at a fine angle, and glares at the whole sky.':'An old scarecrow, a coat on a pole. It has seen better years, and the crows have noticed.',[BYE])},{sc:1.15});
  wleObj(id,'wl2_hall_5',at,3,{sc:1.15})});
const WLD17=khQD("Three scarecrows, and I put up every one of them myself, years ago, for Farmer Giles, and nobody has said a word of thanks since. Now look at them. One has its hat over its eyes, one has lost an arm, and the third is leaning on its pole like it has been at the ale. The crows have noticed. A crow can tell a bad scarecrow from three fields away. They are out in the meadow in the north-east, east of the square and west of the barn, one, two, three, in a line, more or less. Would you go and put them right? Straw, string, a straight pole, a hat at a good angle, and a stern look. That is all it takes.",
  "Bless you. In the meadow east of the square. If a crow gives you any trouble, tell it Rafe is watching.",
  (n,m)=>`${n} of ${m} scarecrows put right. They are in the north-east meadow, east of the square and west of the barn.`,
  "All three? And standing straight? Then the barley is saved, and my work is respected at last.",
  "Here, for your trouble, and my thanks, and a very hard look from every scarecrow in the county. They will remember this.",
  "The crows are going round the field the long way. I have never been so pleased with a coat on a pole.","All three are right.");
wlQ('wlq17','Rafe the woodsman',WLE_SCARE.map((a,i)=>['Put scarecrow '+(i+1)+' of 3 right, in the north-east meadow.',()=>wleF()['wlq17_'+(i+1)],['wlo_scare'+(i+1)]]));
wlGive('wlo_hunter','wlq17','wlq1',WLD17);
/* ---- wlq18: a muddy letter ---- */
khNpc('wlo_letter','A wheelbarrow','kh_ohgard2_3',d=>{const F=wleF();
  if(qSt('wlq18')==='active'&&!F.wlq18a){F.wlq18a=1;yrStep('You have picked up the muddy letter.');return say("In the wheelbarrow, under a cabbage leaf, a letter folded small and sealed with a blob of wax. It is covered in neat, muddy paw prints, and on the front, in careful, wobbly capitals, it says BRACKEN. Somebody has gone a long way round to deliver it, and has given up here. You put it in your pocket.",[BYE])}
  return say(F.wlq18a?'An empty wheelbarrow with one cabbage leaf in it and a lot of paw prints around it.':'An old wheelbarrow, with a cabbage leaf in it and a lot of small paw prints around it. The prints go off towards the hedge.',[BYE])},{sc:1});
khNpc('wlo_hermit','Old Bracken, a hermit','kh_ohfolk3_3',d=>{const F=wleF();
  if(qSt('wlq18')==='active'&&F.wlq18a&&!F.wlq18b){F.wlq18b=1;yrStep('Old Bracken has the letter.');return say("Old Bracken holds the letter in both hands and turns it over, and looks at the paw prints, and his face does something complicated. 'From my sister,' he says. 'Fifteen years. She cannot write, you know, and she sent a fox with it. Or the fox sent itself. I never could tell with that family.' He breaks the wax with a thumbnail, reads for a long moment, and then he laughs, very quietly. 'She says the pie was good. She says nothing else. Tell Meg I said thank you.'",[BYE])}
  return yrLines('wlo_hermit',["I live in a den. It is a very good den. It has a door, and a roof, and a woodpile, and I have never once had to answer it.","The people of Wenlock leave me bread on the stump. I leave them a nod. It is the fairest trade in the county.","I like it quiet. It is not quiet when you are here, but it is a good sort of not quiet."])},{sc:1});
const WLD18=khQD("It is a small thing, and a stupid one, and I have been looking at it for a week. There was a letter in a wheelbarrow at the east end of the back track, last time I went that way, with paw prints all over it, and I cannot read, and I did not like to pick it up. The only person I know who gets letters from a fox is Old Bracken, who lives in the den in the north-east corner, past the end of the track. I do not go that way. It is full of hedge. Would you take it to him? The wheelbarrow is just where the track runs out, and it is a lovely walk, if you do not mind brambles.",
  "Thank you. The east end of the back track, the wheelbarrow, and then the den in the north-east corner. Mind the hedge. It bites.",
  (n,m)=>wleF().wlq18a?'You have the letter. Take it to Old Bracken, in his den in the north-east corner of the town, beyond the end of the back track.':'The letter is in a wheelbarrow at the east end of the back track. Then it is on to Old Bracken, in the north-east corner.',
  "He has read it? And he said thank you? And laughed? Well. That is a better ending than I expected from a letter with paw prints on.",
  "Here. It is something from the shop. It is not much, but it is honest. You are very good to take the long way.",
  "Bracken has put a loaf out on the stump for the fox. The fox has not taken it. The fox is a gentleman.","The letter is delivered.");
wlQ('wlq18','Meg the shepherd',[["Pick up the muddy letter from the wheelbarrow at the east end of the back track.",()=>wleF().wlq18a,['wlo_letter']],["Take the letter to Old Bracken, the hermit, in his den in the north-east corner of the town.",()=>wleF().wlq18b,['wlo_hermit']]]);
wlGive('wlo_shepherd','wlq18','wlq1',WLD18);
wleObj('wlo_letter','kh_ohgard2_3',[91,15],2,{sc:1});
wleObj('wlo_hermit','kh_ohfolk3_3',[88,7],3,{sc:1});
/* ---- wlq19: the lost duckling ---- */
const WLE_DUCK=IMG.pet_duck_1?'pet_duck_1':'kh_anim1_5';
khNpc('wlo_duckling','A lost duckling','pet_duck_1',d=>{const F=wleF();
  if(qSt('wlq19')==='active'&&!F.wlq19a){F.wlq19a=1;yrStep('You have the duckling.');d.found=true;d.block=false;return say("A duckling no bigger than your fist, stuck fast in a bramble and quacking at the whole meadow. You free it a thorn at a time. It climbs up your arm, sits on your shoulder, and makes it quite clear that this is where it will be staying, until further notice.",[BYE])}
  return say('A tiny duckling, stuck in a bramble, quacking at nobody in particular.',[BYE])},{sc:.7});
khNpc('wlo_motherduck','A duck, looking worried','pet_duck_0',d=>{const F=wleF();
  if(qSt('wlq19')==='active'&&F.wlq19a&&!F.wlq19b){F.wlq19b=1;yrStep('The duckling is home.');return say("You set the duckling down at the edge of the pond. The mother duck looks at it, and at you, and at it again, and says something short and furious. The duckling says something short and furious back. Then they go off across the pond together, one big and one small, the small one doing most of the talking.",[BYE])}
  return say('A duck at the edge of the pond, looking over her shoulder at nothing, as if she has lost count of something.',[BYE])},{sc:.9});
const WLD19=khQD("Oh, there is a duckling in my south meadow, and it should not be. I heard it yesterday morning, a small, cross quack, from the brambles by the hedge. I cannot reach it, for I have a bucket and a bad knee. I am quite sure it is one of the pond ducks from the green, because mine are all hens, and the pond is a very long way off, over the bridge and up Mill Lane and down to the green. Would you fetch it? It is only little. It will not bite, though it will want to.",
  "Thank you. It is somewhere in the south meadow, in the brambles. When you have it, take it over the bridge and up to the pond on the village green. The mother will be the one who looks worried.",
  (n,m)=>wleF().wlq19a?'You have the duckling. Carry it over the old bridge, up Mill Lane and across to the pond on the village green.':'The duckling is in the brambles somewhere in the south meadow, across the brook. Then it is a long way to the pond on the green.',
  "It is home? And the mother was pleased? I thought she looked very worried, last time I passed.",
  "Here, with my thanks. A very small quack is a very big thing, if it is yours.",
  "I hear the pond has got a new voice. It is very high. It has opinions about the bread.","The duckling is home.");
wlQ('wlq19','Hetty the dairymaid',[["Find the lost duckling in the brambles of the south meadow, across the brook, and pick it up.",()=>wleF().wlq19a,['wlo_duckling']],["Carry the duckling over the bridge and up to its mother at the duck pond on the village green.",()=>wleF().wlq19b,['wlo_motherduck']]]);
wlGive('wlo_dairymaid','wlq19','wlq1',WLD19);
wleObj('wlo_duckling','pet_duck_1',[50,91],4,{sc:.7});
wleObj('wlo_motherduck','pet_duck_0',[30,68],3,{sc:.9});
/* ---- wlq20: the evening rounds ---- */
const WLE_LAMPS=[[7,30],[10,32],[13,30],[16,32],[19,30]];
WLE_LAMPS.forEach((at,i)=>{const id='wlo_lantern'+(i+1);
  khNpc(id,'A lantern','lamp',d=>{const F=wleF(),flag='wlq20_'+(i+1);
    if(qSt('wlq20')==='active'&&!F[flag]){F[flag]=1;yrStep('You have lit a lantern. ('+wleDup(F,'wlq20_',5)+'/5)');return say('You open the little glass door, trim the wick with your thumbnail, and light it from your own flame. It catches, steadies, and throws a small gold circle on the lane.',[BYE])}
    return say(F[flag]?'The lantern burns steadily, a small gold circle on the lane.':'A lantern on a post along Churchyard Lane. It is not lit.',[BYE])},{sc:1});
  wleObj(id,'lamp',at,1,{})});
khNpc('wlo_hester','Hester\'s grave','grave',d=>{const F=wleF();
  if(qSt('wlq20')==='active'&&!F.wlq20g){if(typeof bagCount==='function'&&bagCount('wildflower')>0){bagRemove('wildflower',1);F.wlq20g=1;yrStep('You have laid a wildflower on Hester\'s grave.');return say('You lay the wildflower on the grass under the plain stone. The dove on the wall tilts her head, and then, quite slowly, turns round once and settles with her back to you, as if to say it is all right.',[BYE])}
    return say("A small plain stone, much weathered: HESTER MOSS, who loved a quiet corner. Somebody has kept the grass short. There is no flower on it today. A mourning dove sits on the wall behind, looking at the stone. (You need a wildflower. The greengrocer and the herb shop have them.)",[BYE])}
  return say(F.wlq20g?'A small plain stone, with a wildflower on the grass in front of it, and a dove sitting quietly on the wall behind.':'A small plain stone, much weathered: HESTER MOSS, who loved a quiet corner.',[BYE])},{sc:.9});
khNpc('wlo_mourndove','A mourning dove','kh_anim1_5',()=>yrLines('wlo_mourndove',["Coo. (She looks at the stone, and then at you, and then at the stone.)","Coo, coo. (She is here every evening. Nobody has told her she does not have to be.)"]),{sc:.85});
wleObj('wlo_hester','grave',[6,37],2,{sc:.9,block:true,walk:false});
wleObj('wlo_mourndove','kh_anim1_5',[6,36],2,{sc:.85});
const WLD20=khQD("A friar walks a great deal and my feet are not what they were. There are five lanterns along Churchyard Lane, on posts, and Sexton Moss lights them every evening, and this week his back is bad and he will not say so. And there is a grave. It is his wife's, Hester's, in the quiet corner at the west end of the town, where the lane gives out, and there is a dove that sits by it. He has not had a flower for it in a month and he will never ask. Would you go along the lane, light the five lanterns, and then lay a wildflower on Hester? The greengrocer has them. The herb shop has them. Nobody need know who it was.",
  "Thank you. The lane runs west from Church Lane. The lanterns are on the posts, and Hester is at the far end, past the last of them, under the little stone. I shall say nothing to Moss, and neither will you.",
  (n,m)=>`${n} of 2 done. Light five lanterns along Churchyard Lane (the lane running west from Church Lane) and lay a wildflower on Hester's grave in the quiet west corner.`,
  "Five lanterns, and a flower. You can tell by the quiet that something has been put right. Come, let me shake your hand.",
  "Here. It is little. Hester would have called it a good deal more than that. Thank you. I shall tell her you came.",
  "The lane is lit, the flower is by the stone, and the dove has gone to sleep. It is a good evening.","The rounds are done.");
wlQ('wlq20','Brother Tuck',[["Light the five lanterns along Churchyard Lane, the lane that runs west from Church Lane.",()=>wleDup(wleF(),'wlq20_',5)>=5,WLE_LAMPS.map((a,i)=>'wlo_lantern'+(i+1))],["Lay a wildflower on Hester's grave, in the quiet corner at the west end of the town. The greengrocer and the herb shop sell them.",()=>wleF().wlq20g,['wlo_hester']]]);
wlGive('wlo_friar','wlq20','wlq1',WLD20);
/* ---- detail in the meadows (called from the polish pass) ---- */
/* ---- the ground: kerbs round the square, worn verges beside the roads, mud banks at the brook and the pond, drifts of flowery meadow ---- */
function wleGround(C){
  const {fm,block,rows,street,hs,W,H}=C,at=(x,y)=>x<0||y<0||x>=W||y>=H?'x':fm[y*W+x],isSt=(x,y)=>street.has(x+','+y);
  const open=(x,y)=>x>2&&y>2&&x<97&&y<97&&!block[y*W+x]&&rows[y][x]==='.';
  const set=[];
  const nb4=[[1,0],[-1,0],[0,1],[0,-1]],nb8=nb4.concat([[1,1],[-1,1],[1,-1],[-1,-1]]);
  for(let y=3;y<97;y++)for(let x=3;x<97;x++){
    const f=at(x,y);if(f!=='2'&&f!=='5'||!open(x,y))continue;
    let road=false,sq=false,wat=false,gl=false;
    for(const [dx,dy] of nb4){if(isSt(x+dx,y+dy))road=true;const g=at(x+dx,y+dy);if(g==='1')sq=true;if(g==='4')wat=true}
    for(const [dx,dy] of nb8){if(at(x+dx,y+dy)==='4')wat=true}
    const r=hs(x,y,201);
    if(sq&&r<.9)set.push([x,y,'0']);                    // a cobbled kerb round the paving of the square
    else if(wat&&r<.88)set.push([x,y,'3']);             // mud and earth at the water's edge
    else if(road&&r<.62)set.push([x,y,'3']);            // the verge beside a road, worn bare in patches
  }
  // the cobbled ribbon of High Street frays into the paving where it crosses the square
  for(let y=44;y<=56;y++)for(let x=40;x<=56;x++){if(at(x,y)!=='1')continue;let n=0;for(const [dx,dy] of nb4)if(at(x+dx,y+dy)==='0')n++;if(n&&hs(x,y,206)<.45)set.push([x,y,'0'])}
  for(const [x,y,c] of set)fm[y*W+x]=c;
  // a second, thinner ring of worn ground round the verges and the banks, so the edge frays into the grass
  const ring=[];
  for(let y=3;y<97;y++)for(let x=3;x<97;x++){if(at(x,y)!=='2'||!open(x,y))continue;let n=0;for(const [dx,dy] of nb4)if(at(x+dx,y+dy)==='3')n++;if(n&&hs(x,y,202)<.2+.08*n)ring.push([x,y])}
  for(const [x,y] of ring)fm[y*W+x]='3';
  // drifts of flowery meadow in the big open fields, so the lawn is not one flat green
  const blob=(x,y)=>{const a=hs((x/4)|0,(y/4)|0,203),b=hs(((x+2)/4)|0,((y+2)/4)|0,204);return (a+b)/2};
  for(let y=3;y<97;y++)for(let x=3;x<97;x++){if(at(x,y)==='2'&&open(x,y)&&blob(x,y)>.62&&hs(x,y,205)<.8&&!isSt(x,y))fm[y*W+x]='5'}
}
function wlePass(C){
  try{wleGround(C)}catch(e){console.error('wleGround',e)}
  const {hs,decor,rows,block,W}=C;
  const get=k=>IMG[k]?k:null,thin=['art_hgthin3','art_hgthin5','art_hgthin0'].filter(get),stumps=['pstump','plog','glogm','stumpm'].filter(get),stones=['mossstone','gstone','grocks'].filter(get);
  for(const k of thin)NPC_H[k]=.75;for(const k of stumps)NPC_H[k]=NPC_H[k]||.5;for(const k of stones)NPC_H[k]=NPC_H[k]||(k==='mossstone'?1.1:.55);
  const trees=[];for(const d of decor)if(/tree/.test(d.k))trees.push([d.x,d.y]);
  const sparse=(x,y,r)=>{for(const [a,b] of trees)if(Math.abs(a-x)<r&&Math.abs(b-y)<r)return false;return true};
  const ok=(x,y)=>x>3&&y>3&&x<96&&y<96&&C.free(x,y)&&!C.isRoad(x-1,y)&&!C.isRoad(x+1,y)&&!C.isRoad(x,y-1)&&!C.isRoad(x,y+1);
  const scatter=(x0,y0,x1,y1,n,fn,seed)=>{let placed=0;for(let i=0;i<n*5&&placed<n;i++){const x=x0+((hs(i,seed,91)*(x1-x0+1))|0),y=y0+((hs(i,seed,92)*(y1-y0+1))|0);if(ok(x,y)&&fn(x,y,i)!==false)placed++}};
  // flower clumps and the odd tree in the big flat meadows
  scatter(33,15,72,44,34,(x,y)=>{C.flowers(x,y,1+hs(x,y,93)*.3)},1);
  scatter(33,15,72,44,9,(x,y)=>{if(!sparse(x,y,5))return false;C.tree(x,y);trees.push([x,y])},2);
  scatter(3,12,13,45,16,(x,y)=>{C.flowers(x,y,1+hs(x,y,93)*.3)},3);
  scatter(3,12,13,45,5,(x,y)=>{if(!sparse(x,y,5))return false;C.tree(x,y);trees.push([x,y])},4);
  scatter(4,4,92,12,12,(x,y)=>{C.flowers(x,y,1)},5);
  scatter(4,87,95,96,16,(x,y)=>{C.flowers(x,y,1.05)},6);
  // benches, stumps and logs, mossy stones, a haystack or two
  for(const [x,y] of [[44,20],[58,29],[40,37],[9,33],[8,43],[46,44]])C.tryDc('kh_ohgard1_3',x,y);
  scatter(33,15,72,44,6,(x,y,i)=>{const k=stumps[i%Math.max(1,stumps.length)];if(!k)return false;C.dc(k,x,y,{block:false,walk:true,sc:1})},7);
  scatter(3,12,13,45,3,(x,y,i)=>{const k=stones[i%Math.max(1,stones.length)];if(!k)return false;C.dc(k,x,y,{block:true,walk:false,sc:1})},8);
  scatter(33,15,72,44,3,(x,y)=>{C.dc('hay',x,y,{block:true,walk:false,sc:1.2})},9);
  // Old Bracken's den, in the north-east corner: an earth-banked hut with a woodpile
  if(IMG.wd_rock0){NPC_H.wd_rock0=NPC_H.wd_rock0||1.1;C.dc('wd_rock0',89,6,{block:true,walk:false,sc:1.2});C.tryDc('hay',87,5,{block:true,walk:false});C.tryDc(IMG.pstump?'pstump':null,91,7,{block:false})}
  // cattails at the pond and at the brook
  const P=WL_GREEN.pond,reed=(x,y,i)=>{const k=thin[i%Math.max(1,thin.length)];if(k&&C.free(x,y))C.dc(k,x,y,{block:false,walk:true,sc:.7+hs(x,y,94)*.25})};
  let ri=0;for(let y=P[1]-1;y<=P[3]+1;y++)for(let x=P[0]-1;x<=P[2]+1;x++){const edge=x<P[0]||x>P[2]||y<P[1]||y>P[3];if(edge&&hs(x,y,95)<.45)reed(x,y,ri++)}
  for(let x=4;x<=95;x++){if(x>=69&&x<=75)continue;const by=WL_BROOK(x);if(hs(x,by,96)<.34)reed(x,by-1,ri++);if(hs(x,by,97)<.3)reed(x,by+2,ri++)}
  // trees and bushes are walk-through and melt away as the party comes close (index.html, WALKTREE), and none stands within a square of a road, so nothing fills the screen or walls in a path
  const roadNear=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(C.street.has((x+dx)+','+(y+dy)))return true;return false};
  for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(!/^(ltree|lbush)/.test(d.k))continue;
    if(roadNear(d.x,d.y)){decor.splice(i,1);continue}
    d.block=false;d.walk=true}
}
