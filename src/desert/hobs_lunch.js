/* ==========================================================================
   HOBB'S LUNCH (quest wlq21, prefix hl). Maud Pike, Hobb's sister, stands in the quiet north-west corner of Wenlock, on the footpath south of the Quiet Chapel.
   Her brother Hobb was one of the diggers of the well (the diggers' tally in the camp on level 497 names him). She wants his lunchbox, which still lies in the diggers' camp, and the ring
   that belonged to the family, which lies in the collapsed mine on the same level. Both objects are put into level 497 by WMFU.camp and WMFU.mine (wellmaze_rooms.js). Plain text, rewards for a party of level 80.
   ========================================================================== */
if(NPC_H.sack2===undefined)NPC_H.sack2=.6;
Object.assign(WL_REW,{wlq21:{gold:1400,xp:14000,items:['potion5','potion5']}});
WL_QUESTS.push({id:'wlq21',giver:'Maud Pike',title:"Hobb's Lunch",desc:"Maud Pike, in the quiet corner of Wenlock, wants her brother Hobb's lunchbox from the diggers' camp under the well, and the family ring from the collapsed mine."});
const hlF=()=>G.flags;
khNpc('wlo_maud','Maud Pike','kh_ohfolk4_2',()=>yrLines('wlo_maud',["I come up here because it is quiet. My brother Hobb dug the well, and he did not come back up.","It is a good place to sit and think about him."]),{sc:1});
WL_QOBJ.push({npc:'wlo_maud',k:()=>'kh_ohfolk4_2',at:[10,27],rad:4,o:{sc:1}});
const HLD=khQD("Excuse me. Are you the people who go down the well? My brother Hobb was one of the diggers, years ago. He went down with the others and never came up. I am not asking you to find him. I know what happened. But Hobb always took his lunch down in a tin lunchbox with his name scratched on the lid, and I would like it back. It will be in the diggers' camp, the first big room you find at the bottom. There is also a ring. It was our mother's, and Hobb carried it for luck. He would have kept it near him when he worked, so look in the collapsed mine on the same level. Will you bring me both?",
  "Thank you. The lunchbox is in the diggers' camp, the first big room below the well. The ring should be in the collapsed mine, on the same level.",
  (n,m)=>hlF().wlq21a&&hlF().wlq21b?'You have both. Take them back to Maud Pike, in the quiet corner south of the Quiet Chapel.':(hlF().wlq21a?'You have the lunchbox. The ring should be in the collapsed mine, on the level under the well.':(hlF().wlq21b?"You have the ring. The lunchbox should be in the diggers' camp, the first big room under the well.":"The lunchbox is in the diggers' camp, the first big room below the well. The ring is in the collapsed mine on the same level.")),
  "You found them. His name is still on the lid. And the ring. Thank you. I did not think I would ever hold either of them again.",
  "Please take this. It is all I have put by, and Hobb would have wanted you to have the lunch money.",
  "I keep the lunchbox on my knee when I sit here. The ring is on my finger. Thank you again.","Both are back with Maud.");
wlQ('wlq21','Maud Pike',[["Find Hobb's lunchbox in the diggers' camp, the first big room under the well.",()=>hlF().wlq21a,['wm_hoblunch']],["Find the family ring in the collapsed mine, on the same level under the well.",()=>hlF().wlq21b,['wm_hobring']]]);
wlGive('wlo_maud','wlq21','wlq8',HLD);
/* the two things in level 497 */
NPCS.wm_hoblunch={name:"Hobb's lunchbox",img:'sack2',root:d=>{const F=hlF();
  if(qSt('wlq21')==='active'&&!F.wlq21a){F.wlq21a=1;yrStep("You have Hobb's lunchbox.");d.found=true;d.block=false;sfx('equip');return say("A tin lunchbox with HOBB scratched on the lid. Inside is a crust of bread gone hard as stone, and a folded cloth. You put it in your pack to take back to his sister.",[BYE])}
  if(F.wlq21a){d.found=true;d.block=false;return say('An empty patch of floor where the lunchbox lay.',[BYE])}
  return say('A tin lunchbox with HOBB scratched on the lid. Nobody has asked you to fetch it yet, so you leave it where it is.',[BYE])}};
NPCS.wm_hobring={name:'A ring on the floor',img:'wm_gold',root:d=>{const F=hlF();
  if(qSt('wlq21')==='active'&&!F.wlq21b){F.wlq21b=1;yrStep('You have the family ring.');d.found=true;d.block=false;sfx('equip');return say('A plain silver ring lies in the dust under a fallen beam. It is worn thin on one side. You put it in your pack.',[BYE])}
  if(F.wlq21b){d.found=true;d.block=false;return say('Dust and a fallen beam. The ring is gone.',[BYE])}
  return say('A plain silver ring lies in the dust under a fallen beam. Nobody has asked you to fetch it yet, so you leave it where it is.',[BYE])}};
