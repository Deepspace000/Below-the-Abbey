/* cutscenes_more.js: the party talks again. Story scenes (the Violet Tower, the end of the Hollow Grasslands, the start and end of the Deeper Hollow maze, the start of the Blighted Lands,
   the arrival at Sale, at the Pale Spire and at the Never-Ending Tower) and seven light ones in unexpected places. Each plays once (flags in G.flags.cs2), over the new level, the same way
   as the early cutscenes (CUTS, startCut, speechLines): narration lines have no speaker, hero lines say who (hn(0) the front fighter, hn(1) the thief, hn(2) the mage, hn(3) the priest). */
const CS2_ARRIVE={
  460:['orangeEnd','The Foot of the Violet Tower: the end of the Orange Spire'],
  475:['mazeStart','the start of the Deeper Hollow'],
  9610:['blightStart','the start of the Blighted Lands'],
  600:['saleArrive','the arrival at Sale'],
  9720:['paleArrive','the arrival at the Pale Spire'],
  449:['funHalfway','floor ten of the Orange Spire'],
  476:['funBogey','the Underlevel'],
  9730:['funStatues','the Court of Statues'],
  9732:['funRavens','the Mews and Stable'],
  9750:['funKitchen','the Kitchens and Armoury'],
  9820:['funDoors','the Hall of Illusions']};
CUTS.orangeEnd=()=>[
  {text:'The stair from the Orange Spire ends in a small round room. A plaque is set in the wall beside a slow wheel of dark air. A wind comes out of it that smells of wet grass.'},
  {who:hn(2),text:'Twenty floors, and the wizard\'s last words were about Vance. He served the Pale Sovereign. Every letter we found was written for a master we had never heard of.'},
  {who:hn(1),text:'So the man who sent the king\'s men to the abbey was working for the one who blighted the west. It is all one chain.'},
  {who:hn(3),text:'The wizard said good will opens the door. I hope it keeps opening them.'},
  {who:hn(0),text:'Then we follow the chain. Through the portal.'}];
CUTS.hgEnd=()=>[
  {text:'The grass is quiet. The hives are cleared, the villagers are free, and the four books lie in the bag. The frog-folk have come out of their houses to see the party go.'},
  {who:hn(3),text:'They are thanking us in their own tongue, and now we understand every word.'},
  {who:hn(2),text:'Aldous Wend was right. The corruption comes up from below. The Child-King\'s rot is seeping through from the deeper lands.'},
  {who:hn(1),text:'And a whale is going to carry us down to a maze. I have had better plans.'},
  {who:hn(0),text:'It is a way down. Bulb, take us.'},
  {text:'The great whale opens the old gate in the water, and the party slips down into the dark.'}];
CUTS.mazeStart=()=>[
  {text:'The whale leaves them at the foot of a hedge. Beyond it, corridors one square wide run away in every direction, climbing through hedge, stone, honeycomb, shell and sandstone as far as the eye can see.'},
  {who:hn(1),text:'A maze of one-square corridors. I hate it already.'},
  {who:hn(2),text:'Two hundred squares across, by the surveyors\' count. Eight towns hide inside it, each with a church. Madam Voss walks it for a living.'},
  {who:hn(0),text:'Then we go up. The corruption comes from the great room at the top.'},
  {who:hn(3),text:'Keep close, all of you. In a maze, whoever loses the others loses everything.'}];
CUTS.mazeEnd=()=>[
  {text:'The Hollowed Warden folds into the ground like cut hedge. The walls stop shaking. Far off a low hum rises and fades, and the air tastes cleaner.'},
  {who:hn(2),text:'The corruption had a root, and the root was a gardener. The hedge grew round him until nothing of him was left.'},
  {who:hn(3),text:'Rest now, poor man. You were only the first thing it spoiled.'},
  {who:hn(1),text:'Twelve ladders down to a black sea, burning spheres, and a Bogeyman. The maze is not finished with us.'},
  {who:hn(0),text:'It is finished with the Warden. We finish this, and then we go west.'}];
CUTS.blightStart=()=>[
  {text:'West of Wenlock the Road Wardens\' gate has stood shut for years. The party passes it with the three seals, and the air changes. The grass is grey and the hedges are dead. A crow sits on the toll house roof and does not fly.'},
  {who:hn(1),text:'Even the weeds look sick. Nothing here has been green in years.'},
  {who:hn(2),text:'The Sovereign\'s mark on the seals is the same mark burned into these gateposts. The blight started at this gate.'},
  {who:hn(3),text:'I can feel the dead on the road ahead. They are not resting. They are walking.'},
  {who:hn(0),text:'The road runs west to a town called Sale. Wren and Aldous went this way. We follow.'}];
CUTS.saleArrive=()=>[
  {text:'Sale is a town of grey stone and black timber, packed tight behind a wall. Pale lamps burn in the windows. The people in the street are very quiet, and none of them casts a warm shadow.'},
  {who:hn(1),text:'Every shop is barricaded. The shutters are nailed down. Someone here has been living on fear.'},
  {who:hn(3),text:'These are the dead, and they are not hostile. They look afraid of the same things we are.'},
  {who:hn(2),text:'Wren and Aldous came to shelter here. And somewhere in this town is the way into the Pale Lands.'},
  {who:hn(0),text:'Then we earn each shopkeeper\'s trust, one by one, and we find them.'}];
CUTS.paleArrive=()=>[
  {text:'Beyond the west gate of Sale the world ends in mist, and a road climbs out of it. At the top, black against a pale sky, stands the Pale Spire: tower on tower, window on window, all of it looking down.'},
  {who:hn(2),text:'That is the Sovereign\'s house. I can feel the silver in the stone from here.'},
  {who:hn(1),text:'It is enormous. I would like someone to tell me which door the rats use.'},
  {who:hn(3),text:'Everything that was taken from the west is somewhere inside it.'},
  {who:hn(0),text:'We climb it to the top and finish this. Weapons ready.'}];
CUTS.neverStart=()=>[
  {text:'A tall crooked tower stands alone in the dead wood, leaning as if the wind had pushed it for a thousand years. Its door is open. Torchlight shows a stair going up, and a second stair beyond it, and the sound of a great many stairs above that.'},
  {who:hn(0),text:'A tower with no top. Nobody told us about this one.'},
  {who:hn(2),text:'Each floor is built from its number alone. There is no last floor.'},
  {who:hn(1),text:'So the climb never ends, and every floor has new things that want to kill us. And treasure.'},
  {who:hn(3),text:'There is a stone on every floor to bring us home. We can come and go as we like.'}];
CUTS.funHalfway=()=>[
  {text:'Floor ten of the Orange Spire. The stairs are narrow and the walls are the colour of old marmalade. The party stops on the landing to catch its breath.'},
  {who:hn(1),text:'Ten floors. Ten more to go. Are we there yet?'},
  {who:hn(0),text:'Ask again and I leave you on this landing.'},
  {who:hn(2),text:'Statistically we are exactly halfway. I counted the steps. Then I lost count at four hundred.'},
  {who:hn(3),text:'I will say a small prayer for my knees.'}];
CUTS.funBogey=()=>[
  {text:'The ladder ends in a very dark room. Somewhere in the dark, water laps against a shore. Something with a lot of teeth makes a low, patient noise.'},
  {who:hn(1),text:'I was told there is a Bogeyman down here. I assumed that was a story for children.'},
  {who:hn(3),text:'It is a story for children. The children are how he got so big.'},
  {who:hn(2),text:'Please do not say its name. Names make it hear us.'},
  {who:hn(1),text:'Bogeyman. Bogeyman. Bogeyman.'},
  {who:hn(0),text:'I am going to hit you before it does.'}];
CUTS.funStatues=()=>[
  {text:'The Court of Statues. Every lane is lined with stone figures, and every one has been carved to look as if it has only just noticed you.'},
  {who:hn(1),text:'That one blinked.'},
  {who:hn(2),text:'Stone does not blink. It is the light.'},
  {who:hn(1),text:'Then why is that one closer than it was?'},
  {who:hn(3),text:'Perhaps we should walk as though we are not annoying them.'},
  {who:hn(0),text:'Nobody turns their back on a statue. And nobody touches the roses.'}];
CUTS.funRavens=()=>[
  {text:'The Mews and Stable. Pale ravens sit in a row on their perches and turn their heads together to look at the party. A falconer\'s ghost drifts among the perches. On one perch lies a single white feather.'},
  {who:hn(1),text:'Good evening, ravens. We are friends. Please do not do the thing.'},
  {who:hn(2),text:'I believe they are waiting for someone to touch the feather.'},
  {who:hn(1),text:'I was not going to touch it.'},
  {who:hn(0),text:'You were already reaching.'},
  {who:hn(1),text:'I was stretching.'}];
CUTS.funKitchen=()=>[
  {text:'The Kitchens and Armoury. Pots hang from every beam. A long table is laid with food that has not been touched for a hundred years, and has not rotted either.'},
  {who:hn(0),text:'That bread looks fresh.'},
  {who:hn(3),text:'It is a hundred years old, '+hn(0)+'.'},
  {who:hn(0),text:'It still looks fresh.'},
  {who:hn(1),text:'I will not be the one to tell her the cheese is moving.'},
  {who:hn(2),text:'Everyone keep your hands in your pockets. That includes you, '+hn(0)+'.'}];
CUTS.funDoors=()=>[
  {text:'At the top of the Grand Stair is a long hall with seven doors. An old man in a silver robe stands straight ahead, holding up a lantern, as if he has been waiting there a very long time. The air smells of forest, and of the sea, and of snow, all at once.'},
  {who:hn(1),text:'Seven doors. Seven different smells. I trust none of them.'},
  {who:hn(2),text:'That is the whole point of an illusion. It is meant to be trusted.'},
  {who:hn(3),text:'Then let us be polite to it, and keep a hand on our purses.'},
  {who:hn(0),text:'We open every door, and we hit whatever comes out.'}];
CUTS.funShop=()=>[
  {text:'On the seventh floor of the Never-Ending Tower there is a lamp-lit room with a counter, a shelf and a bell. A shopkeeper is dusting a jar, and looks up as though nothing were strange.'},
  {who:hn(1),text:'There is a shop. In an endless tower. Full of monsters.'},
  {who:hn(2),text:'The business case is baffling. Who is the customer?'},
  {who:hn(3),text:'We are. And the keeper clearly knows it.'},
  {who:hn(0),text:'Buy potions. Do not ask where he gets his supplies.'}];
function cs2F(){const F=G.flags;return F.cs2||(F.cs2={})}
/* where the party arrives: the scene plays once, after the level is built and the party stands in it */
{const _g=goToLevel;goToLevel=function(n,entry){
  try{
    // the end of the Hollow Grasslands: before the whale carries the party down into the maze
    if(n===475&&LEVEL!==475&&G.state==='play'&&!G.cut&&!cs2F().hgEnd&&((LEVEL>=470&&LEVEL<=474)||(typeof hgtAny==='function'&&hgtAny(LEVEL)))){cs2F().hgEnd=1;const a=arguments,self=this;startCut('hgEnd',()=>goToLevel.apply(self,a));return}
  }catch(e){console.error('cs2 hgEnd',e)}
  const r=_g.apply(this,arguments);
  try{
    if(G.state==='play'&&!G.cut&&LEVEL===n){
      const F=cs2F(),a=CS2_ARRIVE[n];
      if(a&&!F[a[0]]){F[a[0]]=1;startCut(a[0])}
      else if(typeof ntIs==='function'&&ntIs(n)){
        if(typeof NT!=='undefined'&&n===NT.BASE&&!F.neverStart){F.neverStart=1;startCut('neverStart')}
        else if(typeof ntFloorOf==='function'&&ntFloorOf(n)===7&&!F.funShop){F.funShop=1;startCut('funShop')}}}
  }catch(e){console.error('cs2 arrive',e)}
  return r}}
/* the end of the Deeper Hollow maze: when the Hollowed Warden at the top falls */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&e.t==='hgdwarden'&&!cs2F().mazeEnd){cs2F().mazeEnd=1;later(1200,()=>{if(!G.cut)startCut('mazeEnd')})}}catch(x){console.error('cs2 warden',x)}
  return r}}
