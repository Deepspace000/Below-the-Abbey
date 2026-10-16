/* ==========================================================================
   QUEST HINTS. Every quest that is more than a plain fetch or a plain kill count has a Hint button in the quest log. A hint says what to do
   next: the written ones below for the story quests, and for the rest one made from what the quest says and where it is. A quest that is
   ready to hand in always says who to take it to. Each hint pressed is counted on the stats page.
   ========================================================================== */
const QHINT={
  gandrick:'Leave Thornwick by the east gate and follow the trail into Gandrick\'s Wood, fighting the wolves and bandits. His cave is at the far east end of the wood. Tap the quest to see it on the map.',
  goats:'The goats hide in the lanes and yards of Thornwick. Walk right up to one, or tap it, to find it. There are five.',
  ghosts:'The haunted house is on the north side of the main street in Thornwick. Take a torch inside and fight the ghosts.',
  ironhill:'Take the road north-east out of Thornwick to Ironhill. The mayor is inside the castle at the top of the town.',
  mines:'The old mines are east of Ironhill castle. Go in and clear 8 of the undead, rats and bats.',
  overseer:'The Mine Overseer waits in the deepest room of the Ironhill mines. He hits hard, so rest and heal before you open the last door.',
  pip:'Pip is out on Ironhill Moor, near the wolves. Walk the moor until you find him, then tell him to go home.',
  parcel:'Farmer Eadric lives on Ironhill Moor. Deliver the parcel to him first, then go back to Dorn.',
  pass:'Leave the moor to the east and cross Greyfang Pass, following the dashed red line on the map of the pass. Hunters are close behind, so keep moving.',
  colours:'In Anaea, find the dilapidated door on the south side of the main street, near the middle of town. It leads down to the sealed cellar.',
  scoria:'Take the east gate of Anaea and follow the road north into the desert, to Khemetra. Ishkander the wizard is the one to find there.',
  escape:'You are in the castle dungeons. Bribe the jailer, fight your way past the guards, and deal with Halbrecht.',
  kh_c1:'The Catacomb of Whispering Sands is a little dungeon on the Sand Road, north-east of Anaea. The Compass of Dawn lies at the end of it.',
  kh_c2:'Look for the mounds in the Red Dunes, beyond the Tomb of Sut. The Shrine of the Sleeping Sphinx is a little dungeon under one of them.',
  kh_c3:'The Shrine of the Copper Serpent is a little dungeon in the Blue Dunes. The amulet lies at the end of it.',
  kh_c4:'The Undercroft of the Sand Mother is a little dungeon in the Golden Erg. The Astrolabe is in its deepest room.',
  kh_c5:'The Barrow of the Pale Cartographer is a little dungeon in the Violet Erg. The Jade Scarab lies at the far end.',
  kh_c6:'The Sepulchre of the Twin Suns is a little dungeon in the White Dunes. The Lens is kept in its deepest chamber.',
  kh_c7:'The Barrow of the Last Oasis is a little dungeon in the Flatlands. The Ankh Key waits at the end of it.',
  kh_seal:'The thieves hide in the ruined houses of the Old Quarter, north-west in Khemetra. The seal is in a chest in the Boarded House, and its door is circled on the map.',
  kh_sea:'Follow the tunnel to the Narrow Sea. Once the Sea Gate in Khemetra\'s east wall is open you can walk straight through it to Yarrim.',
  yar2:'The key is in an old bronze chest in the cisterns beneath the Potters Market in north-west Khemetra. The hatch opens once the vizier has named it. Take a lantern, and bring the key back to Hotep-Ra.',
  yar3:'Go through the Sea Gate in the east wall of Khemetra (it is circled on the map) and kill 8 skeletons in the tunnel beyond. Then tell Menkaure.',
  yar4:'Walk the beach of Yarrim, north and south of the pier. Four crates lie in the sand. Tell Tamsin Kell, the harbourmaster, when you have all four.',
  yar5:'The Net Loft is in Yarrim, east of the harbourmaster\'s office. Go inside and kill 6 rats, then tell Tamsin Kell.',
  yar6:'Torches are sold at Wen\'s Trading Post in Yarrim and in the general stores of Khemetra. Take 3 of them to Orsa at the Yarrim Light.',
  yar7:'Walk to the end of the pier in Yarrim and speak to Menkaure beside the Dawn Walker.',
  mq1:'Stay in Khemetra for three days and stay out of trouble: rest at an inn if you must. When the trumpets sound, go to the palace.',
  mq2:'Go into the palace at the head of the Avenue of the Sun. The throne room is inside, and the king will hear your story.',
  vq1:'The marines camp along the north and east shore of Saltbarrow. Kill 10 of them, then tell Sable Maeve.',
  vq2:'The three bells hang in the drowned abbey on the Isle of Bells. Ring each one, then fight what wakes. Brother Aldous waits at the altar.',
  vq3:'Climb the slopes of Cinder Isle for 3 cinder crystals and destroy the Cinder Guardian that walks them. Take them to Ketra.',
  vq4:'Isolde\'s altar is at the top of Last Light. Fetch the third page from it, and be ready for Corvane\'s ship.',
  vq5:'Sail the Dawn Walker east from the islands toward Oldhaven. The Kraken lies in the deep water between the coasts, and the harbour boom will not lift until it is dead. The gate opens at noon.',
  vq6:'At noon the party is brought before King Osric. Give him the master ledger and make him read it.',
  uq1:'Buy a Diving Helm for each hero from Tam Salvor on the pier at Yarrim. Dive from the red-and-white buoy on Saltbarrow, kill the Reef Warden and open the great chest.',
  uq2:'Dive from the buoy on the Isle of Bells into the Drowned Abbey. The great chest lies past the boss. You need a Diving Helm each.',
  uq3:'Dive from the buoy on Cinder Isle to the Vent Gardens. Stand in a vent to breathe freely, kill the guardian and open the great chest.',
  uq4:'Dive from the buoy at Last Light to the wreck among the kelp, kill what circles it and open the great chest.',
  sa1:'Corvane\'s victims left their logs in wrecks: drifting hulls out on the Narrow Sea and wrecked ships on the islands. Find 3 and take the news to Maeve.',
  sa2:'Kill the Kraken first. Then sail far east to Leviathan\'s Rest and open the cache under the black altar.',
  sb1:'Orsa\'s sons are on the Narrow Sea: Tobin on a big forest island, Wren on a rock far out. Ask the sailors, then sail to them.',
  sb2:'Bring both boys home to Yarrim once you have found them.',
  sd2:'Take the Great Harpoon you were given and find the Kraken in the deep water between the two coasts.',
  kg0:'Four people each know where a Kraken gun lies: Ketra, Sable Maeve, Brother Aldous and Isolde. Ask each, then fetch all four. Every hero needs one.',
  kg1:'The Ember Harpoon lies on an altar in the red cliffs of Redcliff, a rock island in the east of the Narrow Sea.',
  kg2:'Sail to Kelpgate Rock in the south-west of the Narrow Sea. The Verdigris Harpoon is in the bow of the grounded flagship.',
  kg3:'Sail to the Hollow Isle in the west of the Narrow Sea. The Silver Harpoon is buried inside the ring of standing stones.',
  kg4:'Dive from Last Light, a Diving Helm on every hero, and search the lamp ship wreck for the Beacon Harpoon.',
  oq0:'Take the east road from the middle of Oldhaven to the fair green. Six people have stalls there: the weigher, the bellringer, the baker, the fool, the tutor and the quiet sister. Talk to each one.',
  ox1:'Hob Tally the weigher has his scales at the north-west of the fair green. Bring him a loaf of bread, a piece of cheese and a herring from the stalls or the Cookshop.',
  ox2:'Ewan Marsh the bellringer stands at the north side of the fair green. He wants two torches and a lantern. Pack and Lantern in the city sells them.',
  ox3:'Perrin the baker is at the north-east of the fair green. Buy a salve and an antidote from the Apothecary and bring them to her.',
  ox4:'Pip Jangle the fool is at the south-west of the fair green. Bring him three apples, from the apple sellers or the stalls.',
  ox5:'Master Quill the tutor is in the south of the fair green. He wants a Frost scroll and a Light scroll. The Scroll House sells them.',
  ox6:'Sister Ilse is at the south-east of the fair green. Bring her two flasks of holy water.',
  sg1:'Talk to Captain Aldwyn at the gate after the six names are done. The Ash Guard wait on the east road, east of the middle of the city. Kill 6.',
  sg2:'Sergeant Cade is in the Garrison Hall. Bring him 8 loaves of bread from the bakeries, the Cookshop or the stalls.',
  sg3:'Dunstan the mason stands in the city centre. Bring him 5 pieces of wood from a general store.',
  sg4:'Gammer Wick of the Cats Guild stands in the city centre. Bring her 3 herrings.',
  sg5:'Speak to Rook the falconer, Tobias the crier and Little Ned in the city centre. Each will send a pigeon.',
  sg6:'Four families in the city: a young mother, an old man, an egg seller and a washerwoman. Speak to each and tell them to go to the chapel.',
  sg7:'Perrin the baker is on the fair green. Bring her 3 torches for the old tunnel.',
  sg8:'Speak to Captain Aldwyn again once the wall, the people and the tunnel are done. Then kill 10 more Ash Guard on the east road.',
  oa1:'Speak to Captain Aldwyn at the gate once the siege is over, then take the east road out of the city and through the east gate to the Oakwood. Hale is in the first big glade.',
  oa2:'Wolves roam the Oakwood. Kill 6, then tell Hale in the woodwarden camp.',
  oa3:'Acorns lie on the ground in the Oakwood. Pick up 6 and take them to Master Joss in the south-west glade.',
  oa4:'Bramwick the hedge-wizard is in the middle glade. Herbs lie on the ground in the Oakwood. Bring him 5.',
  oa5:'Wren is in the woodwarden camp. Speak to her again.',
  oa6:'The Ash Guard camp is in the north-east glade. Kill 8, then tell Hale.',
  oa7:'Bring 4 pieces of wood from a general store to Master Joss.',
  oa8:'Ysolt keeps the Great Oak in the south-east glade. Answer her three questions honestly.',
  oa9:'Bring Wren to the Great Oak and ask Ysolt to crown her.',
  ad1:'Bring all six device pieces (the cog, pin, spring, bell, lens and dial) to Captain Aldwyn once Wren is crowned and he has been told.',
  ad2:'Take the royal cutter home from Captain Aldwyn, then find the Sealed Door in the crypt level where the game began, near the start.',
  ad3:'Go through the Sealed Door and down the four floors to the Hollow Abbey. Each floor has a stair down at the far end.',
  ad4:'The Hollow Abbot is in the great room at the bottom. Speak to Brother Sevrin first.',
  mq1:'Walk the Land Path to the halfway point, in the mountains. A gate cut into the cliff on the east side leads to Saint Elen’s. Abbot Anselm is in front of the church.',
  mq2:'Brother Herbert is in the herb garden, south-west of the grounds. Pick 6 herbs from the beds.',
  mq3:'Brother Cook is in the kitchen, in the south-west. Apples lie in the orchard, in the south-east.',
  mq4:'The bee-keeper is by the hives, south of the cloister. Honeycombs lie on the ground around them.',
  mq5:'Wildflowers lie on the lawns of the monastery. Sister Wilma is in the cemetery, through the east gate.',
  mq6:'The hatch to the cellars is in the herb garden. Kill 6 ghosts, then tell Brother Cellarer.',
  mq7:'Take the letter to Osk, the innkeeper of the Cold Spring Inn, on the Land Path in the mountains.',
  mq8:'The ring is in a chest in the old crypts, one floor below the cellars. Speak to the Abbot first.',
  mq9:'The bell hangs at the foot of the church. Ring it once.',
  mq10:'Speak to Brother Hilarion in the guest house, in the east, and rest by the fire.',
  shell:'The shell broke in four. Under each of the four islands a pearl-white clam holds a piece in a far corner of the reef. Dive each one, find the clam, and bring the pieces to Brother Aldous.'
};
/* a plain fetch or a plain kill count needs no hint; every other quest, and every story quest, gets one */
function questHasHint(id){
  const q=QUESTS[id];if(!q||qSt(id)==='done'||qSt(id)===null)return false;
  if(QHINT[id]||(typeof MAIN_QUESTS!=='undefined'&&MAIN_QUESTS.has(id)))return true;
  const src=String(q.goal||'');
  return !(q.cnt||/bagCount|k_\w+|[Kk]ills/.test(src));
}
function questHint(id){
  const q=QUESTS[id];if(!q)return '';
  if(qReady(id)){
    const where=typeof questTargetLevel==='function'?questTargetLevel(id):null;
    return `You have done what ${q.who||'the quest giver'} asked. Go back and hand it in. Tap the quest to see where on the map.`;
  }
  if(QHINT[id])return QHINT[id];
  // made from the quest itself: where it is, and what it asks
  let place='';try{const Lt=questTargetLevel(id);if(Lt!==null&&LEVEL_NAMES[Lt])place=LEVEL_NAMES[Lt];else if(QAREA[id])place=QAREA[id]}catch(e){}
  const first=(q.desc||'').split(/(?<=[.!?])\s+/)[0];
  return `${place?'Look in '+place+'. ':''}${first} If you forget what was asked, talk to ${q.who||'the quest giver'} again. Tap the quest to see where it is on the map.`.replace(/\s+/g,' ');
}
