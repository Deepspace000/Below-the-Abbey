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
