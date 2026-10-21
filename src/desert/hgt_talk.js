/* ==========================================================================
   WHAT THE PEOPLE OF THE FOUR CITIES SAY (names start with HGTT). All of it is heard in the grassland tongue until the party can understand it (hollowgrass_talk.js), so the longer
   the speeches, the more there is to ask about and to wonder at: vendors describe their wares, philosophers walk the streets, and everyone else says more than a line. The words in
   these speeches are collected into the lexicon by tools/make_lexicon.py. Buying an item teaches its name in the tongue (hgBoughtItem).
   ========================================================================== */
/* ---------- vendors: what each stall sells, in the words of the stallholder ---------- */
const HGTT_WARES={
  stall0:['These apples came down from the upper terraces this morning, still cool from the shade. The figs are from the oldest tree in the city, and they are sweet enough to eat with nothing else. Dates keep for a month in a pocket. Buy a few of each and tell me which you like best.',
    'A good apple is firm, and it smells like rain. If it smells of nothing, put it back. The blackberries are best when they are almost black, and they stain the fingers for an hour, which is how my customers find each other.'],
  stall1:['Blackberries and rosehips are picked on the cliffs at dawn, before the wind gets up. Rosehips are sour, and they are good for the chest in winter. The hazelnuts are from the north terraces, and the chestnuts are roasted by my sister, who will not tell me how.',
    'Nuts are the best food for a long climb. A handful of hazelnuts and a few dates will carry you up the tall stair and down again. Figs are for the top, when you want to sit and look at the city.'],
  stall2:['Potatoes are the honest food. They grow in the dark, they do not complain, and they keep all winter. Wild garlic is for the pot, and a little goes a long way. The water-lily root is sweet when it is boiled, and watercress is for people who want to feel clever.',
    'Dig the potatoes yourself if you do not trust me. I do not mind. The garlic is strong, so keep it away from the moths. Moss is for the soup, and I sell it by the handful, which is a good price for something that grows on every wall.'],
  stall3:['Cave mushrooms are the plain ones, and they are good fried. Chanterelles are gold, and they smell of apricots, and they only grow where the water runs slowly. Puffballs are for slicing thick, like bread. I have one truffle today. It is the best I have had in a year, and it is not cheap.',
    'Never eat a mushroom you cannot name. If you want to learn the names, buy one of each and ask someone who knows. The truffle is a gift from the old roots under the south stair. A little of it goes into a pot and the whole house smells of it for a week.'],
  stall4:['Watercress comes from the pond edges, and it is peppery. Pickled pond kelp is a taste you learn. The first bite is a surprise, and the second is a habit. Water-lily root and moss are cheap and filling, and the lychees are from a friend who keeps a very strange tree.',
    'The lychees are small and round, and they look back at you. Do not let that put you off. They are sweet inside, and they taste like a pond in summer. The kelp is good with the roots, and the moss is good with everything.'],
  stall5:['I sell a little of everything. Apples, potatoes, figs, garlic, mushrooms and blackberries, all of it from this week. Choose what you like and I will not tell you what to cook. People who ask me what to cook always cook it wrong.',
    'My mother sold fruit here, and her mother sold roots. We have never had the same stall twice, because the market moves a little each year. The prices stay the same, and so do the customers, and the baskets get older.']
};
const HGTT_ORRIM='Bubble helms. They go over the head, and they let you breathe under water for four minutes. Nobody drowns in a bubble helm who remembers to come up. I also have swift shoes. They make your feet quicker in the hollow lands, and they are not cheap, because the leather comes from very far away.';
const HGTT_PETSHOP=['Little ones for the road. Each one has a gift. The pups guard the camp, the moths find coins, and the jelly closes small wounds when you are not looking. The little giants are the dearest, because they take longer to raise, and they eat more than they should. Look at them all before you choose.',
  'Every animal in these baskets was raised by hand. The shell pups sleep in pairs, and the slugs sleep alone. A pet will follow you to the end of the city, and then to the end of the world. Buy one, and it will learn your name before you learn its.'];
/* ---------- philosophers: they walk the streets, and each one has something worth hearing ---------- */
const HGTT_PHIL=[
  'A word is a small tool that two people hold at once. If only one of them holds it, it is only a noise. That is why I stop strangers in the street and ask what they think a word means.',
  'The roof of rock above us has never been seen from below by anyone who can tell us what it is made of. We have agreed to call it the sky, and that agreement is all that holds it up.',
  'Is a city a thing, or a habit? The houses could be taken apart and put back in a different order, and we would still say this is the same place. I think a city is what the people in it keep doing.',
  'I walk the same streets every day to find out whether I am the same person each time. So far the streets have changed more than I have, which worries me a little.',
  'The pond remembers nothing, and yet it is always full. I envy it. I remember everything, and I am often empty.',
  'A lamp does not make the dark smaller. It makes a second place that the dark has to go around. Think about what that says about kindness.',
  'If you leave a book unread for a hundred years, does it still say what it says? I have decided that it does, because otherwise most of what is true would only be true while somebody was looking.',
  'There are two kinds of hunger. One is for food, and it ends. The other is for knowing what the food is called, and that one grows when you feed it.',
  'A stranger is only a person whose words we have not learned yet. By that measure every child is a stranger, and every old friend was once a stranger too.',
  'The hive builds without any plan that one bee can read, and the plan comes out right. I have been trying for years to decide whether that makes the bees clever or the plan modest.',
  'Walking is falling, caught again and again. A stair is the same thing, with a little more courage needed at each step.',
  'Do the shells of this city belong to the people who built them, or to the people who climb them? I say the climbers, because the builders are finished, and the climbers are still finding out what the shells are for.',
  'A name makes a thing easier to find and harder to see. Once I call something a fig, I stop looking at it. If you want to see a fig, forget its name for an afternoon.',
  'I was told that the wizard teaches the tongue from four books. I wonder whether he understands the books, or has only collected them. The two are very different, and only one of them can be taught.',
  'A promise is a small bridge built across a part of the future that nobody has seen yet. Most bridges hold. The ones that fall teach us how deep the gap was.',
  'Why do we light the lamps at night when there is no sun here to set? Because a day needs an edge. Without the lamps the hours would run together like wet paint.',
  'If I give you half my bread and you give me half of yours, we each have the same amount, and yet each of us has a different meal. That is the whole of trade, and most of friendship.',
  'I count the steps on the long stair every day, and the number is never the same. I have decided that the stair is not what changes. I am.',
  'Nothing in this city was built to be looked at from the place where you are standing. Walk around it. The part you have not seen is usually the part that explains the rest.',
  'When two people argue about what a word means, they are really arguing about who the word belongs to. The word does not mind. It has been used by many people, and it has learned to be patient.'
];
/* ---------- the people who stand and sit and sweep: they say more than a line now ---------- */
{const T={
  clean:['The stones need sweeping every day. The dust comes down from the roof of rock, a little at a time, and it never stops. My mother swept this landing, and her mother swept the steps below it. I do not mind. A clean stair is the one thing in the city that people thank you for without knowing it.',
    'If you leave the dust where it is, I will only have to sweep it again. Mind the edges, they are slippery after the rain. Do you want to know the secret of sweeping? You start at the top, you finish at the bottom, and you do not look back.'],
  walk:['I walk this way every day, and it takes some time. The stairs here are not steep, and you get used to them. On the way I count the lamps. There are one hundred and twelve between my door and the market, and one of them is always out.',
    'I am on my way to the market. The road is long, and I stop to look at the view. If you are going the same way, walk with me. People who walk alone get lost, and people who walk together get lost together, which is better.'],
  tend:['The plants here are looked after every day. The glitter on the leaves comes back each night, and nobody knows why. I water the roots and I clear the weeds, and I talk to the beds, because the shell flowers grow better when someone speaks to them.',
    'I keep the beds clear of weeds. A bed that is left alone for a month turns into a thicket, and a thicket turns into a wall. Plants are patient, but they always win in the end. I would like to be there to see it.'],
  lamp:['The lamps are trimmed every day, and they burn all night. A lamp that goes out is lit again by morning. The oil comes up from the lower town in jars, and a good jar lasts nine nights. I can tell the hour by the colour of the flame.',
    'I look after the round lamps, the purple, the green, the blue and the orange. Each colour burns a different oil, and each one has a different smell. My favourite is the white one. It smells of nothing at all, which is rare.'],
  sit:['I sit here most of the day. The view is good, and the bench is warm. I have watched the city for forty years from this spot, and it has changed less than you would think. The people change. The stones are patient.',
    'This bench is the best one on the street. If you are tired, sit with me. We do not have to talk. Nobody here minds a person who rests, and a bench that is used is happier than one that is not.'],
  read:['I am reading. It is a short book, and it is about the roots under the city. I have read it nine times. Each time I understand a little more, and each time I find something I did not see before. A good book is never finished.',
    'I read here because the light is steady. The author of this book says that the roots under the city are older than the city itself, and that the houses grew up from them like mushrooms. I cannot decide if that is a fact or a story.'],
  fish:['Nothing has bitten yet. Something usually does. I fish from the edge, and the water here is deep, so deep that the line has never touched the bottom. I do not mind. I am not really fishing for fish.',
    'The line is long, and it has not reached the bottom. People ask me what I am fishing for. I tell them it depends on the day. Today it is a quiet afternoon, and I have caught one already.'],
  watch:['I watch the street from here. You can see a long way from this edge, all the way to the tall towers, and I have learned to tell who is coming by the way they climb. Nothing has happened today, and that is usual.',
    'Somebody has to watch. It is not a hard job. You stand, you look, and you remember what is normal, so that you can tell when it is not. In forty years I have been called to the edge twice.']
 };
 for(const k in T)if(HGTLF_TASK[k])HGTLF_TASK[k].lines=T[k]}
/* ---------- the villagers of the grassland and the wizard's books: a few more words from each ---------- */
{const POOL={
  guard:['The gate is open to the honest and shut to the biters. I have stood here for years, and I know every face on this road. The wizard in Exsce says that four books teach the tongue to strangers. If I were a stranger, I would go and find them.',
    'Quiet watch tonight. Or no, it is always the same watch. The hives are far to the south, and the biters come up from them in the dry season. Anyone who goes to the hives and comes back is a friend of mine, and anyone who brings back a book is a friend of everyone.'],
  healer:['A cough, a limp and a fever, the same as every morning. Most of what I do is to tell people to rest, and most of what they do is to ignore me. If you are hurt, I have a green paste that smells terrible and works well. I keep the recipe in my head, because books get wet.',
    'I have heard that there are four books in the hives that teach the tongue of the grassland. A healer who could talk to strangers would learn twice as much, and I would like to be that healer. If you bring me one of them, I will pay you in paste.'],
  elder:['Sit, sit. The pond has been here longer than we have, and it will be here after. Our elders say that the first words were spoken by the pond, and that we only borrowed them. I do not know if that is true, but it is a good thing to believe.',
    'When a stranger comes to the city, we say a word, and the stranger says a word, and we pretend that this is a conversation. It is how all conversations begin. The books in the hives tell how to say the second word, and the third, and all the rest.'],
  trader:['Honey, kelp, roots and a few good things from the hives. Look as long as you like. I have traded in this city for thirty years, and in all that time I have never sold anything I would not eat myself, except the wax, which nobody eats.',
    'A stranger who cannot speak is a good customer, because he cannot argue about the price. A stranger who learns to speak is a better customer, because he stays. I would be glad if you learned. There are four books somewhere in the hives, and the wizard in Exsce wants them.'],
  child:['Have you seen the big ones on the hills? I have! From very far away! One had a long neck like a bird, and it walked on stilts, and it did not step on a single house. My grandmother says it is looking for something. I think it is looking for me.',
    'I am not afraid of anything. Except the moths. And spiders. And the dark under the stair. And the big one that sleeps in the plaza, but only a little. Do you want to hear a secret? The wizard has a book that talks. At least, that is what Pip says. Pip says a lot.'],
  neighbour:['The mud gives and the mud takes. You have to know which day it is. I have lived on this terrace all my life, and I have never once been right about the weather, but I have been right about the neighbours, and that is worth more.',
    'Strangers are welcome here, but they do not understand us, and we do not understand them, and so we are all very polite. It would be nicer if we could talk. They say that the wizard in Exsce can teach the tongue, if he gets four books from the hives. I hope he does.']};
 const pick=(nm)=>/Guard/i.test(nm)?'guard':/Healer/i.test(nm)?'healer':/Elder/i.test(nm)?'elder':/trader|Brollo/i.test(nm)?'trader':/\bPip\b|child/i.test(nm)?'child':'neighbour';
 for(const town of HG_FOLK)town.forEach((f,i)=>{const chat=f[5];if(!Array.isArray(chat)||!chat.length)return;const pool=POOL[pick(f[1])];
   const first=chat[0];chat[0]=first+' '+pool[0];chat.push(pool[1])})}
/* ---------- buying an item teaches its name in the tongue ---------- */
const HGTT_ITEMWORD={apple:'apple',figs:'figs',blackberries:'blackberries',rosehips:'rosehips',dates:'dates',nuts:'hazelnuts',chestnuts:'chestnuts',potato:'potatoes',wildgarlic:'garlic',watercress:'watercress',cavemushroom:'mushrooms',chanterelle:'chanterelles',puffball:'puffballs',edmoss:'moss',truffle:'truffle',hgroot:'root',hgkelp:'kelp',lychee:'lychees',bubblehelm:'helms',swiftshoes:'shoes',hgcomb:'honey',hgjelly:'jelly',hggrubs:'grubs',bread:'bread',water:'water'};
function hgBoughtItem(id){
  const w=HGTT_ITEMWORD[id];if(!w||typeof HG_LEX==='undefined'||!HG_LEX[w])return;
  if(typeof hgLvl==='function'&&hgLvl()>=4)return;if(!(LEVEL===470||(LEVEL>=481&&LEVEL<=484)||(typeof hgtAny==='function'&&hgtAny(LEVEL))))return;
  const W=G.flags.hgWords||(G.flags.hgWords={});if(W[w])return;W[w]=1;msg('You learned: '+HG_LEX[w]+' = '+w+'.','#a8e8c0')}
