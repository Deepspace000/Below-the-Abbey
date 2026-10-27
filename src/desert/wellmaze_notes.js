/* ==========================================================================
   THE WELL MAZE: signs, notes and little stories (prefix wm / WM). Reading a note that hints at a key, a switch or a vault sets a hint flag (G.flags.wm.hint), and the area map then
   shows a pin for it. No em dashes anywhere.
   ========================================================================== */
const WM_NOTES={
  shaft1:['Sign on the Shaft','UNDER THE WELL. Dug by the diggers of Wenlock, forty fathoms down. The bucket is for water. The ladder is for you. Mind the scale, the foreman is particular about weights.'],
  weights:["The Foreman's Notice",'FOR THE BUCKET TO RISE the scale must read EIGHTY, no more and no less. A barrel of sand weighs 25. A crate of shot weighs 15. Barrels and crates were left in the camp, the cellar and the shrine. Put the right mix on the pan and the old store door will open. Too heavy and it jams.','weights'],
  camp1:["The Diggers' Tally",'Day 40: struck brick under the clay. Day 41: the brick goes on and on. Someone built this before us. Day 43: Hobb says the walls hum at night. Day 44: nobody goes down alone. Hobb put a lever at the far end of the east tunnels to open the store where we kept our pay. I never found it again.','lever1'],
  cistern1:['Cistern Sign','WATER NOT FIT TO DRINK. It was fit once. A boat is tied at the stair. Row to the far stone and the old men\'s cache is yours, if you can stand the quiet.','row'],
  cellar1:['Chalk on a Barrel','The good wine is gone. The bad wine is also gone. The barrels and crates with a number burned into the lid are sand and shot for the scale, and the foreman will want them back, so do not leave them lying in the dark.','weights'],
  shrine0:['Shrine Plaque','To the Lady of the Deep Water, from those who dig. Let the bucket come up full and the digger come up whole.'],
  mine0:["The Foreman's Slate",'I took the key to the lower door and locked it in my strongbox at the far end of this mine, because the lad who found the door kept trying it. If you are reading this, I did not come back. The box bites.','key1'],
  stairdown0:['Brass Plate on the Lower Door','THE LOWER DOOR. It opens to the VIOLET KEY and to no other. The foreman keeps it safe, and says so in his slate.'],
  stairdown1:['Brass Plate on the Door','THE DOOR TO THE BELL VAULTS. It opens to the AMETHYST KEY and to no other.'],
  stairdown2:['Brass Plate on the Great Door',"THE GREAT DOOR TO THE DEEP. It opens to the WARDEN'S KEY and to no other."],
  violet2:['Sign at the Stair','THE BELL VAULTS. Three bells hang here that were never meant to be rung by the living. The ringer left his notes somewhere on this level.'],
  violet3:['Sign at the Stair','THE AMETHYST DEEP. The first stone of the well lies at the end of this hall, and its keeper does not sleep.'],
  violet1:['Sign at the Stair','THE VIOLET MAZE. Whoever built it wanted something kept. They did not say what. The left hand wall is a poor guide here. The diggers pinned their notes wherever they stopped to think.'],
  library1:['Soaked Ledger','The ink has run. What is left says: the plaque on the closet door asks about something that is DUG, that is DEEP, that gives when it is FILLED and waits when it is empty. Think of what you climbed down into to get here. The key to the lower door is kept in that closet, behind the plaque door.','key2'],
  library2:['Wet Pages','Pages of tallies, all the same: one more bell rung, one more night kept. The last page is a drawing of a mouth with the words DO NOT FEED IT.'],
  mirror1:['Plaque in the Hall of Mirrors','THE GLASS TURNS EVERYTHING ABOUT, left for right. A white crystal stands in a dead end not far from this hall, and a true walk begins there: stand on the crystal and face the only way out. Read what the glass shows, turn every turn the other way, and walk it. At the end of the walk the wall is missing in the glass. In life a door waits there.','mirror'],
  spiders1:['Scratched in the Wall','DO NOT SLEEP HERE. They do not like the light. They like the dark and anything in it.'],
  fungus1:['Mossy Board','The mushrooms here glow the colour of a bruise. Hobb ate one, and now he sees things. He says there are two cranks in this maze, far apart, and both must be turned before the cache will open. He would not say where. He said the draught tells you.','pair'],
  fungus2:['Mossy Board','The mushrooms down here sing a little. Nobody has told them to stop.'],
  shrine1:['Shrine Plaque','She is not the Lady of the Water any more. Nobody here is sure who she is. Leave a light, and keep walking.'],
  shrine2:["The Warden's Page",'The Warden gave the key to the great door to one of us to keep safe. That one hid it where nobody walks: behind a wall that rings hollow, at the end of a dead end, the way a miser hides coins. If a wall of the maze looks a shade wrong, press it.','key3'],
  shrine3:['Altar Note','The prize stands on the Warden\'s pedestal. Whoever lifts it carries the first heart of the well up to the light. The Warden will not allow that.'],
  grotto1:['Cold Draught','A cold draught blows along the wall of the third dead end from here. The diggers hid a lever behind it, in case the hall flooded. Press the walls at the dead ends.','hidden'],
  grotto2:['Chalked Arrow','An arrow, and the words: THE CHAIN IS AT THE END OF THE LONG TUNNEL, GUARDED BY STONE. WHAT IT OPENS IS THE WARDEN\'S OWN TREASURY.','chain'],
  bellringer1:["The Bell-Ringer's Story",'I rang the bells of Wenlock for thirty years. They sent me down to ring these three for the well. I lost my lantern on the third stair and my way on the fourth. If you find my notes in the library, ring as I wrote. They answer only once, and only when asked properly.'],
  bell_hint:["Notes of the Ringer",'HOW THE VAULT IS RUNG: the LOW bell, held long. Then the MIDDLE bell, a short tap. Then the HIGH bell, held long again. Long, short, long. Any other peal and they only jangle.','bells'],
  lantern_order:["The Warden's Lamp Order",'To wake the hall of lanterns in the Deep: LILAC first, for the dawn. GOLD second, for the bell. VIOLET last, for the well. Any other order and they die, and the one who lit them must begin again.','lanterns'],
  trap1:['Scrawled Warning','The lever in the dead end past the hollow slabs opens the cache. The slabs give way under a heavy step and the watchers do not like visitors. It is only worth it for those who can take a fall.','trap'],
  lake1:['Sign at the Lake','Still water, violet as an eye. Nothing swims in it that we ever saw. Do not drink.'],
  mine3:['Last Slate','Down here the stone sings. The Warden hears it. He does not like singing.'],
  lanterns1:['Rune Slab','Three lights hang in the hall: violet, lilac and gold. They were lit in an order once. What was found in the Bell Vaults says which.'],
  warden1:['The Well-Warden','First of the diggers, last to leave. He is made of what he dug, and amethyst answers him. The white crystal in his chest is his heart. Break the heart and the stone will give.']};
for(const id in WM_NOTES){const [t,s,h]=WM_NOTES[id];
  NPCS['wmnote_'+id]={name:t,img:'wm_signpost',root:d=>{try{if(h){const F=wmF();F.hint[h]=1}}catch(e){}
    return say(s,[BYE])}}}
