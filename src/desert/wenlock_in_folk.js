/* ==========================================================================
   WENLOCK: THE SMALL FOLK OF THE ROOMS (prefix wli). The cats, dogs, children and neighbours who live in the rooms of Wenlock (the keepers and the priest are in wenlock_folk.js),
   the library (eight short books, read in place with the book reader of hgt_books.js), the notice boards, the votive candles in the church, the pie on the cottage table and the
   polite ghost in the inn cellar. Nothing here is outdoors.
   ========================================================================== */
{const H={kh_anim1_0:.3,kh_anim1_3:.55,kh_oqdogs_0:.5,kh_oqdogs_1:.62,kh_oqdogs_2:.5,kh_oqdogs_3:.36,kh_oqdogs_4:.46,kh_oqdogs_5:.44,ghost:.9};for(const k in H)if(NPC_H[k]===undefined)NPC_H[k]=H[k]}
const wliF=k=>'wl2_'+k;               // a new picture of ours
const wliLines=(id,name,face,lines,o)=>khNpc(id,name,face,()=>yrLines(id,lines),o);
/* ---- animals: a pet is a picture of its own (wl2_home_2 is a cat, wl2_home_3 a dog) ---- */
const WLI_PETS=[
  ['wli_innkeeper_dog','Hops, the inn dog',wliF('home_3'),["Woof. (He lies under the table nearest the hearth and watches every plate go by.)","Woof. (He has been given a sausage by seven different people and is going to tell the eighth he has not eaten.)"]],
  ['wli_inn_cat','Barley, the inn cat',wliF('home_2'),["Mrr. (She sits in the warm patch the dog has not noticed yet.)","Miaow. (She looks at the minstrel. She has opinions about the minstrel.)"]],
  ['wli_dibble_cat','A shop cat',wliF('home_2'),["Mrr. (She is asleep on a coil of rope and does not intend to be sold with it.)","Miaow. (She has knocked one button off the shelf. She will do the next one at midnight.)"]],
  ['wli_holt_cat','Bubble, the potion cat',wliF('home_2'),["Mrr. (Her whiskers are a very faint green. Nobody has asked why.)","Miaow. (She watches the cauldron the way other cats watch mice.)"]],
  ['wli_bryony_cat','Sage, the herb cat',wliF('home_2'),["Mrr. (She smells of catmint and is very pleased with herself.)","Purr. (She has rolled in the thyme again.)"]],
  ['wli_quill_cat','Inkpot, the scribe\'s cat',wliF('home_2'),["Mrr. (Her paws are black to the ankle. There are small prints across three scrolls.)","Miaow. (She sits very upright on the best parchment and dares you to mind.)"]],
  ['wli_lib_cat','Dewey, the library cat',wliF('home_2'),["Mrr. (She is sitting on the one book you wanted.)","Purr. (She is the only creature in the library allowed to make a noise.)"]],
  ['wli_lacey_cat','Pincushion, the tailor\'s cat',wliF('home_2'),["Mrr. (There is a thread tied to her tail. She has not noticed. She will.)","Miaow. (She is lying on a very expensive piece of velvet and looks pleased about it.)"]],
  ['wli_wick_cat','Tallow, the chandler\'s cat',wliF('home_2'),["Mrr. (She keeps well back from the candles. She learned about candles once.)","Purr. (She is the colour of old wax and rather smells of it.)"]],
  ['wli_church_cat','Verger, the church cat',wliF('home_2'),["Mrr. (She sits in the sunbeam from the east window and looks very holy.)","Miaow. (She has never missed a service. She has never listened to one.)"]],
  ['wli_almscat','Mrs Pennywhistle, a cat',wliF('home_2'),["Mrr. (She goes from lap to lap as the soup goes round.)","Purr. (She belongs to nobody and the whole almshouse.)"]],
  ['wli_home_cat','The house cat',wliF('home_2'),["Mrr. (She is on the one chair you were going to sit in, and she is not moving.)","Miaow. (She yawns, stretches, and goes straight back to the same spot.)","Purr. (She is not on the table. She is merely above the floor.)"]],
  ['wli_cat2','A tabby',wliF('home_2'),["Mrr. (She looks at you, then at the door, then at you, as if to say there is a draught.)","Purr. (She has brought in a very small gift. It is under the rug. Do not look.)"]],
  ['wli_baker_dog','Crust, the baker\'s dog',wliF('home_3'),["Woof. (He is covered in flour and has no regrets.)","Woof. (He has found a crust that fell off the table, and has found another, and is thinking about the table.)"]],
  ['wli_butcher_dog','Chop, the butcher\'s dog',wliF('home_3'),["Woof. (He sits very, very still, and looks at the sausages, and does not blink.)","Woof. (He has been told to guard the shop. He is guarding the sausages. He feels this is a promotion.)"]],
  ['wli_heel_dog','Last, the cobbler\'s dog',wliF('home_3'),["Woof. (He has one of your boots. He has the look of a dog who will give it back, eventually.)","Woof. (He is sitting on a pile of old shoes and has never been happier.)"]],
  ['wli_hoop_dog','Bung, the cooper\'s dog',wliF('home_3'),["Woof. (He is lying inside a barrel with only his tail out.)","Woof. (It echoes. He barks again to hear it echo.)"]],
  ['wli_home_dog','The family dog',wliF('home_3'),["Woof. (He leans on your leg until you scratch his ears.)","Woof. (He has heard a noise that might be dinner. He is checking.)","Woof. (Everyone in the house claims he is not allowed on the bed. He is on the bed.)"]],
  ['wli_pip_goat','Gertrude, the greengrocer\'s goat','kh_anim1_3',["Maaa. (She has eaten the label off a turnip crate and is chewing on the turnip's name.)","Maaa. (She looks at the apples, then at Pip, then at the apples.)"]]
];
for(const [id,n,face,lines] of WLI_PETS)wliLines(id,n,face,lines);
/* ---- people of the rooms ---- */
const WLI_FOLK=[
  ['wli_minstrel','Jory\'s cousin, the inn minstrel',wliF('folk2_0'),["I play every night but Sunday, when the inn plays me. The tune is the same. It is just louder.","Do you have a request? I know four hundred songs and I can start any of them, and the ending is a surprise to us both.","They say a good song makes the ale taste better. I have found it works the other way round."]],
  ['wli_apprentice','Little Alfred, the smith\'s apprentice',wliF('folk1_3'),["I pump the bellows. It is a very important job. Master Fenn says that without me the fire would just be a nice sit down.","One day I will hit the anvil. Not yet. Yet is a word I hear a lot.","I have burned one eyebrow off. I have two to spare."],{sc:.8}],
  ['wli_hale_d1','Ada Hale, weaponsmith',wliF('folk1_0'),["Father says he makes the noise and we make the swords. He is right. He is also loud.","I made that one. It is the straight one. The crooked one is Rosie's."]],
  ['wli_hale_d2','Rosie Hale, weaponsmith',wliF('folk1_0'),["Do not mind the crooked sword. It is meant to do that. It is a very special sword. It just needs a very special person.","Ada says my blades are crooked. They are only curved. It is a style."]],
  ['wli_baker_wife','Mistress Crumb\'s sister, who helps in the bakery',wliF('folk1_0'),["Mind the flour. It gets in everything. I found some in my shoe on Tuesday, and I was not even working.","The buns are for the vicar. The other buns are for the vicar too. The third batch is for sale."]],
  ['wli_lacey_help','A seamstress',wliF('folk1_0'),["Hold still, pins are about."]],
  ['wli_reader1','A man reading',wliF('folk2_2'),["Shh. I am on the last page and I think the butler did it. There is no butler. I am still sure.","I have been on this chapter since Tuesday. It is a very good chapter."]],
  ['wli_reader2','A student',wliF('folk1_3'),["I am looking up how to make gold from lead. Mr Pemberton says it cannot be done. I am checking.","The trick is not to read the whole book. You read the first page and the last page, and tell everyone you read the middle."],{sc:.9}],
  ['wli_page2','Wren, the mayor\'s page',wliF('folk1_3'),["The mayor is a very busy man. He is also asleep. I am keeping the first one going.","Sir, madam, please do not touch the chain. The chain is on a very strict list."],{sc:.85}],
  ['wli_clerk','The town clerk',wliF('folk2_4'),["Births, deaths, pigs and rain. I keep a book of all four. The pigs are most reliable.","If you want a form, there is a form. If you want to know what the form is for, there is another form."]],
  ['wli_pupil1','Tommy Briggs, aged eight',wliF('folk1_3'),["Two and two is five. Miss Larkin says it is four. We are going to have it out after lunch.","I am not looking out of the window. The window is looking at me."],{sc:.78}],
  ['wli_pupil2','Daisy Briggs, aged six',wliF('folk1_4'),["I can write my name. It goes D, A, I, and then a bit that is a bee, I think.","Dolly is at school today. She is not allowed to talk. She is very good at it."],{sc:.74}],
  ['wli_pupil3','Peg, a pupil',wliF('folk1_4'),["I know all my letters. I have not been told which order they go in.","Please do not tell Miss Larkin about the frog in the desk. He is a good frog. He is learning to count."],{sc:.78}],
  ['wli_gran','Old Hannah of the almshouse',wliF('folk2_3'),["When I was a girl the brook ran the other way. Everyone says it did not. Everyone was not there.","I knit for the whole almshouse. This is the third scarf. The second was for the cat, and she has declined it.","I have outlived two vicars and a very bad pudding."]],
  ['wli_oldfarmer','Old Silas of the almshouse',wliF('folk2_2'),["I farmed forty years and I have not got a field to show for it. I have an armchair. It is the better deal.","Sit, sit. The soup is on and it is mostly soup.","In my day the hills were taller. The sheep were bigger. The ale was cheaper. I do not recall the weather."]],
  ['wli_widow','A widow at prayer',wliF('folk1_0'),["Shh. I come every Tuesday to tell my husband what he missed. It is a lot.","He used to sing in the choir. He was loud. Everyone says he was good."]],
  ['wli_choirboy','A choirboy',wliF('folk1_3'),["I sing the high bit. When my voice breaks Mother says I will be a plough horse.","The vicar says the Lord loves a joyful noise. He did not say which noise."],{sc:.8}],
  ['wli_home_kid','A child at home',wliF('folk1_4'),["This is the dragon. He is a bit like a dog. He is mostly a dog.","I am not supposed to tell you where the biscuits are. They are behind the clock."],{sc:.72}]
];
for(const [id,n,face,lines,o] of WLI_FOLK)wliLines(id,n,face,lines,o);
/* ---- the polite ghost of the inn cellar ---- */
khNpc('wli_ghost','Percival, a ghost','ghost',()=>yrLines('wli_ghost',[
  "Oh, good evening. Do come in. I am so sorry about the draught. I do not do it on purpose, it is simply what I am.",
  "I have been in this cellar for two hundred years, and I have never once frightened anybody. I try. They keep offering me a stool.",
  "Landlord Pluckrose is very decent. He leaves me a mug of ale every night. I cannot drink it, but it is the thought.",
  "If you are looking for the old landlord's money, it is behind the third barrel. I would take it myself, but I have no hands to speak of."]),{sc:1});
/* ---- the cottage pie: a slice once from each table ---- */
khNpc('wli_pie','A pie on the table','wl2_home_0',()=>{
  const k='wlpie'+LEVEL,F=G.flags;
  if(F[k])return say('The pie is a pie-shaped gap now, with one very satisfied crumb. Somebody was watching you. It was the cat.',[BYE]);
  return say('A golden pie sits on the table with steam still rising, and a note: FOR THE VICAR. Underneath, in a different hand: HE HAS HAD ENOUGH.',[['Take a slice.',()=>{F[k]=1;if(!bagAdd(mkItem('pie'))){F[k]=0;return say('Your bag is full. The pie waits.',[BYE])}sfx('equip');return say('You take a slice. It is still warm. The cat watches you with enormous sorrow.',[BYE])}],BYE])});
/* ---- the notice boards ---- */
const WLI_NOTICES=['LOST: one ginger cat, answers to Marmalade. FOUND: one ginger cat, answers to nothing. Possibly the same cat. Apply to the baker.',
  'THE FLOWER SHOW is on the green on Saturday. Marrows may be entered. Pumpkins may not. Mr Hedge has been asked to stop explaining.',
  'NOTICE: the hall roof has been mended. It will leak again in autumn. The mayor regrets this in advance.',
  'WANTED: someone to say a few kind words about the vicar\'s harvest poem. Will pay in pie.',
  'Anyone found feeding the geese will be asked to explain themselves to the geese.',
  'The road west is not yet open. Please stop asking the clerk. He does not know. He has asked the road.'];
khNpc('wli_notice2','The notice board','wl2_library_5',()=>yrLines('wli_notice2',WLI_NOTICES));
khNpc('wli_blackboard','The blackboard','wl2_library_5',()=>yrLines('wli_blackboard',['The blackboard says: 2 + 2 = 4. Underneath, in a small hand: =5 (Tommy).','The blackboard says: WE DO NOT FEED THE FROG. Underneath, in a smaller hand: HE IS HUNGRY.','The blackboard says: A, B, C, D, E, F, G, H, I, J, K, L, N. Someone has circled the gap and written ?']));
/* ---- the church: a candle, and the book on the lectern ---- */
khNpc('wli_lectern','The lectern','wl2_church_4',()=>say('The great Bible lies open on the eagle\'s wings, and beside it a smaller, much-thumbed book: THE LEGEND OF SAINT WENNA.',[['Read the legend.',()=>{hgbOpen('read','wlb_wenna');return null}],BYE]));
/* ---- the library ---- */
const WLIBK={
  wlb_goose:{t:'The Goose Who Would Be King',d:'A very short tale of the brook, and a bird with plans.',p:[
    'There was once a goose on the Wenlock brook who believed she was a king. Nobody had told her otherwise, because nobody had dared. She held court on the bank every morning, and the ducks stood in a line and nodded, because the alternative was being hissed at.',
    'She made laws. Bread must be left on the bank. Dogs must bow. The miller must be told to turn the wheel more quietly, for it disturbed her thoughts. The miller turned the wheel more quietly, and nobody was more surprised than the miller.',
    'When winter came she led the flock south and was never seen in Wenlock again. The ducks missed her very much. The dogs, a little less. The brook is quiet in the mornings now, and every so often the miller stops, and bows, just in case.']},
  wlb_history:{t:'A Short History of Wenlock',d:'Forty lines, and one flood.',p:[
    'Wenlock was founded by a man who was lost. He sat down by the brook to think about it, and was still sitting there when a second man arrived, who had also been lost. They agreed it was a good place to be lost together. That was the market.',
    'The church of Saint Wenna was built on the spot where the first man put down his bundle. The bundle was a pie. This is why every Wenlock church service finishes with a pie, and also why the vicar looks hungry.',
    'The brook flooded in the year of the big marrow. It is still said to be the biggest flood and the biggest marrow in the county, though the two are unrelated. The mayor of the day was found afterwards on the church roof, holding a goose.']},
  wlb_pies:{t:'Pies, and the Principles Thereof',d:'A baker\'s guide, with a few firm opinions.',p:[
    'The first principle of the pie is that it must be filled. A pie without a filling is a hat. The second principle is that the lid must be sealed with a fork, firmly, like a decision you have thought about.',
    'The third principle is that a pie must be left to cool. Nobody has ever left a pie to cool. It is the great tragedy of the pie. Every baker in Wenlock leaves one on the windowsill each morning, and loses it by noon.',
    'The fourth principle is that a pie is better shared. The baker adds, in a smaller hand: but not with the vicar. He has had quite enough.']},
  wlb_poem:{t:'The Vicar\'s Harvest Poem',d:'An honest effort. Seventeen verses, and a little more heart than rhyme.',p:[
    'Oh barley, barley, bend your head, / for we have bread, and bread is bread, / and bread is what we have for tea, / and tea is also good for me.',
    'The wheat, the oat, the mighty rye, / go up and down against the sky, / and in the barn, so snug and tight, / the mouse is up till late at night.',
    'And so we thank the Lord on high / for pie, and also for pie, / and pigs, and plums, and plums, and pigs, / and other things of such like size. (Verses four to seventeen are about a marrow.)']},
  wlb_wenna:{t:'The Legend of Saint Wenna',d:'How the church got its name, and a wolf got a better one.',p:[
    'Saint Wenna lived in the wood before there was a town. She was a small woman with a large stick, and she was not afraid of anything but geese. The wolves of the forest came to eat her, and found her mending a boot.',
    'She said to the biggest wolf: if you are going to eat me, you may at least hold this boot. He held the boot. She finished mending it, and gave it to him, and he wore it home. He was never seen without it again.',
    'The wolves gave up eating people after that, out of embarrassment. The town of Wenlock grew where she sat. Her stick is still in the church, in the corner, with a very small boot hung beside it.']},
  wlb_hedges:{t:'On Hedges, and Their Moods',d:'A gardener\'s notes. Mr Hedge insists every word is true.',p:[
    'A hedge is a living thing, and living things have moods. A hedge in a good mood grows evenly. A hedge in a bad mood grows towards the neighbours, and sends out a branch to look at their washing.',
    'Never trim a hedge when it is watching. It will know. Trim it at dusk, from behind, with the shears held low, and say something kind. A hedge that has been spoken to kindly will keep out sheep for years.',
    'The great hedge-maze in the gardens east of Wenlock is the largest hedge in the kingdom. It is also, the book admits, the most annoyed. The advice is to walk in quietly, and not to hurry.']},
  wlb_cats:{t:'The Cat in the Counting House',d:'A parable, with fish.',p:[
    'The miller kept a cat to catch the mice in the counting house. The cat caught none. The miller said: why do you not catch the mice? The cat said: they are my staff.',
    'The mice kept the books. The cat kept the mice. The miller kept an accountant, who was the only one who had never been paid, and who therefore never noticed the others had.',
    'In the end the mill did better than ever. The cat grew round, the mice grew rich, and the miller retired to the country. The cat still has the key to the counting house. Nobody has asked for it back.']},
  wlb_west:{t:'A Traveller\'s Notes on the Western Road',d:'Written by somebody who was told it would be open soon.',p:[
    'The road west leaves Wenlock between two stones and a gate that has been shut since before the vicar. A sign in a wobbly hand says NOT YET. Another sign beside it says WHEN. A third says PLEASE STOP ASKING.',
    'Beyond it, the notes say, lie the Western Kingdoms, which are said to have castles and rivers and a sea. The author has not seen them, but has heard them described by a goose, who was very certain.',
    'The author finishes: I shall wait. It is a very good town to wait in. The pie is excellent, the beds are warm, and nobody has told me to go. It is possible I am not leaving.']}
};
for(const id in WLIBK){const b=WLIBK[id];HGB_TEXT[id]={title:b.t,desc:b.d,stat:'',price:0,pages:b.p}}
const wliRead=ids=>()=>say('The shelf holds '+ids.length+' books worth a look.',ids.map(id=>[WLIBK[id].t,()=>{hgbOpen('read',id);return null}]).concat([BYE]));
for(const [i,ids] of [['1',['wlb_goose','wlb_history']],['2',['wlb_pies','wlb_poem']],['3',['wlb_wenna','wlb_hedges']],['4',['wlb_cats','wlb_west']],['5',['wlb_history','wlb_pies']],['6',['wlb_poem','wlb_goose']],['7',['wlb_hedges','wlb_wenna']]])
  khNpc('wli_shelf'+i,'A shelf of books','wl2_library_0',wliRead(ids));
/* Mr Pemberton, the librarian, will fetch any book */
khNpc('wli_k_library','Mr Pemberton, the librarian','kh_ohfolk2_4',()=>{
  const all=Object.keys(WLIBK);
  return say('Shh. Well, not you, you are welcome to speak. It is the books that should be quiet, and they never are. We have forty-one volumes and eight of them are in good repair. Would you like to read one? They are free. They are also, I should say, mostly true.',
    all.map(id=>[WLIBK[id].t,()=>{hgbOpen('read',id);return null}]).concat([['Any news of the library?',()=>yrLines('wli_k_library_news',['The cat has been sitting on the same book since Tuesday. It is the one on turnips. I take that as a review.','Somebody has returned a book that was out for thirty years. They said it had been a very good read, and apologised for the fine. The fine is a groat. It was a very good book.'])],BYE]))});
/* the church's votive candles: five gold buys the party a blessing */
khNpc('wli_votive','Votive candles','wl2_church_5',()=>say('Dozens of small candles burn on the iron stand, each one for somebody. A box beside it says FIVE GOLD A CANDLE, and underneath, in smaller letters: OR WHAT YOU CAN.',[['Light a candle (5 gold) and ask a blessing for the party.',()=>{if(G.gold<5)return say('You have not the five gold. Light one in your heart. It burns just as well, and does not need replacing.',[BYE]);G.gold-=5;try{afflInflict('blessed',-1)}catch(e){}sfx('heal');return say('You light a candle and say a quiet word. It burns steady and gold, and for a moment everything feels a little more possible.',[BYE])}],BYE]));
