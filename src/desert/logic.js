/* ==========================================================================
   THE SAND ROAD: the story beats (cutscenes) and the small rules of the desert and the tomb
   ========================================================================== */
Object.assign(CUTS,{
  citySeen:()=>[
    {text:'The dunes climb, and beyond the last red ridge the horizon stops being empty. A wall of golden stone runs from one edge of the world to the other, and above it stand towers and domes and a stepped temple glowing in the heat haze.'},
    {who:hn(0),text:'It is real. A whole city, out here in the middle of nothing.'},
    {who:hn(3),text:'Khemetra. The caravan people called it the Golden City of the Sun, and I thought it was a story to sell water with.'},
    {who:hn(2),text:'Stories do not have walls that tall. Keep your eyes open, there will be more than sand between us and that gate.'},
    {who:hn(1),text:'I am only glad to see something built by living hands.'}],
  cityGate:()=>[
    {text:'The old road ends at a gate three times the height of a house. Its doors are cedar, bound with bronze and studded with gold, and carved above them is a winged sun with a lion on either side. A hot wind blows under the doors.'},
    {who:hn(0),text:'The doors stand open. Look at the smoke over the roofs, and at the gold on those towers.'},
    {who:hn(1),text:'Somebody keeps this place. Somebody keeps it well.'},
    {who:hn(2),text:'Then we walk in, and we ask for the wizard. We have come a long way for this.'},
    {text:'Khemetra waits beyond the open gate.'}],
  khArrive:()=>[
    {text:'The gate of Khemetra closes behind the party, and the sound of the desert goes with it. They stand in a street of pale stone. A donkey and cart wait close by, and the driver waves, ready to take anyone anywhere in the city for a few coins.'},
    {text:'Ahead, a great avenue of pale stone runs north between white houses trimmed with gold, and at the end of it, so far away that it seems to stand in the sky, rises a palace with a spire of gold.'},
    {who:hn(0),text:'I have never seen a city this big. I did not know a wall could go on this long.'},
    {who:hn(1),text:'Look at the roofs. Domes, towers, gardens on the tops of houses, and palms everywhere. Somebody loved this place.'},
    {who:hn(3),text:'A city this size will have a wizard in it somewhere. And a vizier, and a market, and a lot of pockets to watch.'},
    {who:hn(2),text:'Then we start with the palace. Mayor Marigold said the king listens to the wizard. If anyone knows where he is, it will be the palace.'},
    {text:'Khemetra, the Golden City. Four hundred thousand souls, and not one of them has heard of you.'}],
  khTunnel:()=>[
    {text:'The cave is dry and bright. Light falls in from somewhere ahead, white and flickering, and the air smells of salt for the first time in the party\'s lives.'},
    {who:hn(1),text:'Salt. I know that smell from the old stories. That is the sea.'}],
  khSea:()=>[
    {text:'The tunnel opens. Beyond the rock lies a grey-blue plain that runs to the end of the world, wrinkled with waves and silver where the sun strikes it. Sea birds wheel over a shore of white shingle. The Narrow Sea.'},
    {who:hn(0),text:'It does not end. It just does not end.'},
    {who:hn(2),text:'Menkaure was right. The sea is real, and the road to it is open. We should tell him.'},
    {text:'The party stands on the shore of the Narrow Sea. The road to Khemetra and the shipwright is long, but it is the road to everything that lies beyond.'}],
  sandRoad:()=>[
    {text:"Anaea's east gate closes behind the party. The road runs on between walls of green, and the birdsong thins. A dry wind comes down it from somewhere far to the north."},
    {who:hn(0),text:"Smell that? Dust and hot stone. We are a long way from Greendale's flowers."},
    {who:hn(1),text:"Marigold said the road goes east, then turns north. Past the trees there is only sand."},
    {who:hn(2),text:'Then we walk until the trees give out. Keep your water close, all of you.'},
    {text:'The road is long. Somewhere beyond the desert is Scoria, and the wizard Ishkander.'}],
  caveMouth:()=>[
    {text:'The cliff rises ahead, the colour of old bread. Two stone sphinxes sit either side of a dark gate, and sand has drifted against the door like snow.'},
    {who:hn(0),text:"That is the only way on. Everything else is cliff."},
    {who:hn(1),text:"I do not like it. Nobody walks to a door like that and comes out the same."},
    {who:hn(2),text:"Look at those carvings, though. Whoever built this wanted to be remembered. We go in."},
    {text:'The wind drops as the party steps between the sphinxes. For the first time in days it is quiet.'}],
  tombEnter:()=>[
    {text:'The gate closes softly behind the party. The cave beyond is deep, and it is full of sand: it lies in smooth ridges across the floor and spills down the stairs like water.'},
    {who:hn(1),text:"My skin is crawling. Something is watching us. I can feel it."},
    {who:hn(0),text:"Nothing is watching. It is an old tomb, and old tombs are quiet. Stay close and we will be fine."},
    {who:hn(3),text:"Treasure, my friends! Think of the treasure. Tombs like this do not keep their gold to themselves."},
    {who:hn(2),text:"Gold or not, I want a way out when we are done. Watch the floor, and watch the walls."},
    {text:'Far below, something heavy shifts in the dark, and sand begins to run.'}]});

/* one beat each time the land changes, and the way into the tomb */
function desertStory(){
  if(G.cut||G.state!=='play')return;
  const F=G.flags;
  if(LEVEL===41){
    const b=rdBiome(G.P.x,G.P.y);
    if(b>.32&&!F.roadPalms){F.roadPalms=1;msg('The oaks are changing. Palms stand among them, and the grass has gone dry.','#e8d8a0')}
    if(b>.62&&!F.roadSparse){F.roadSparse=1;msg('The trees are thinning. Hot sand shows between the palms.','#e8d8a0')}
    if(b>.84&&!F.roadDesert){F.roadDesert=1;msg('The last palm is behind you. Ahead, dunes roll away in every direction.','#f0e0a8')}
    if(G.P.y<=22&&!F.caveMouth){F.caveMouth=1;startCut('caveMouth')}
  }
  if(LEVEL===42)tombStory();
  if(LEVEL===43){
    const y=G.P.y;
    if(!F.redIn){F.redIn=1;msg('Red sand, and a red sky at its edge. The wind here tastes of iron.','#f0c8a0')}
    if(y<=120&&!F.redRuins){F.redRuins=1;msg('Broken pillars stand in rings across the dunes. Whoever built here did not leave anything behind but their gold.','#e8c8a0')}
    if(y<=62&&!F.citySeen){F.citySeen=1;startCut('citySeen')}
    if(y<=RS.NORTH+6&&!F.cityGate){F.cityGate=1;startCut('cityGate')}
  }
}
