/* ==========================================================================
   YARRIM: THE SHOPS AND THE DONKEY. The ship dealer, the trader, the inn's patrons and the travelling donkey that goes back to
   Khemetra and up the coast road to the other towns. (The people with quests are in yarrim_quests.js.)
   ========================================================================== */
KH_STOCK.trader=()=>[['torch',8],['lantern',3],['potion',6],['antidote',4],['salve',4],['bread',10],['water',12],['dates',8],['herring',6],['ale',6],['dagger',2],['bow',2],['cap',3],['jerkin',2]];
KH_STOCK.seagoods=()=>[['torch',10],['lantern',3],['antidote',3],['sleeptea',2],['herring',10],['water',10],['bread',8]];
khShop('yr_trader','Wen, the trader','kh_npc2_0',"Wen's Trading Post",'Wen buys, Wen sells, Wen has never once been cheated, and the people who say otherwise were not there. Lamps, ale, a good knife, a bad hat. Have a look.','trader');
khShop('yr_fish','Corran, the fishmonger','kh_yfolk1_5','Corran\'s Fish Stall','Herring, fresh when the boats come in. Smoked, if the boats were late. Nothing here is more than a day out of the sea, and the gulls watch me to make sure.','food');
khNpc('yr_dealer','Selk, the ship dealer','kh_yfolk2_1',d=>{
  const F=G.flags;
  return say('Selk\'s Ship Dealing. Dhows, smacks, a rowing boat for every temper and one very honest barge. The Dawn Walker is not for sale, before you ask. Everybody asks.',[
    ['Look at the boats for sale',()=>say('Out on the water: the Silver Gull, a dhow with a good heart and a bad rudder, four thousand gold. The Little Prudence, a fishing smack that has never lost a crew, mostly, nine hundred. A rowing boat called Mister Biscuit, forty gold, and it answers to nobody. Selk lowers his voice: "None of them is for you yet. A captain buys a ship. You are still hiring one."',[BYE])],
    ['Ask about the Dawn Walker',()=>say('Three masts, a hundred years in a boathouse, and not a plank rotten. Menkaure built her to go where the charts stop. I would not sell her for the whole of Khemetra, and I have been offered most of it.',[BYE])],
    ['Buy sea goods',()=>{openShop(d,KH_STOCK.seagoods(),"Selk's Ship Dealing");return null}],
    BYE]);
});
khNpc('yr1_p1','Rafe, a fiddler','kh_yfolk3_2',()=>say('A man at the next table sold me a map to a treasure island. I paid him in fish. He left. The map is of the next table.',[BYE]));
khNpc('yr1_p2','Moll, a laundry woman','kh_yfolk3_3',()=>say('Bessa waters the ale only on the days it is not raining. You can see the problem.',[BYE]));

/* ---- the travelling donkey ---- */
const YR_FARE_ORIGIN=[692,66];   // Yarrim on the map of the far lands
function yrFare(wx,wy,extra){const d=Math.hypot(wx-YR_FARE_ORIGIN[0],wy-YR_FARE_ORIGIN[1]),half=typeof qSt==='function'&&qSt('yq_donk')==='done'?.5:1;return Math.max(20,Math.round((d*.28+(extra||0))*half/10)*10)}   // Biscuit's friends ride at half fare
const YR_RIDES=[ // where the donkey goes: the name, the level, where you step down, and what has to have happened
  {n:'Khemetra, by the Sea Gate',lv:44,at:{x:394,y:200,f:3},fare:()=>yrFare(486,56),need:()=>true,line:'The donkey takes the cliff road, round the back of the dunes, and the whole of Khemetra comes slowly up out of the sand: white walls, gold roofs, the long wall.'},
  {n:'Oldhaven, the king\'s city',lv:305,fare:()=>yrFare(34,170,60),need:()=>G.flags.oldhavenSeen,line:'The road turns and runs along the cliffs above the sea, and there is a long grey line on the horizon that is the sea wall of Oldhaven.'},
  {n:'Anaea, the white town',lv:33,fare:()=>yrFare(402,238),need:()=>G.flags.lvSeen&&G.flags.lvSeen[33],line:'The donkey knows this road. It goes west, and the dunes become scrub, and the scrub becomes a green valley with a white town in it.'},
  {n:'Greendale',lv:32,fare:()=>yrFare(418,186),need:()=>G.flags.lvSeen&&G.flags.lvSeen[32],line:'Past the pass, the land goes green, and the road runs down between hedges to a small, quiet valley.'},
  {n:'Ironhill',lv:13,fare:()=>yrFare(262,112),need:()=>G.flags.lvSeen&&G.flags.lvSeen[13],line:'A long road, a longer afternoon, and then smoke over a castle on a hill.'},
  {n:'Thornwick',lv:3,fare:()=>yrFare(156,204),need:()=>G.flags.lvSeen&&G.flags.lvSeen[3],line:'Over the moor and through the forest, where the road remembers the party. At the end of it, the little town with the goat on its sign.'}
];
let YR_RIDE=null;
CUTS.yrRide=()=>{const d=YR_RIDE||YR_RIDES[0];return [
  {text:'Hamid clicks his tongue and Biscuit sets off at a steady trot, the cart rattling over the cobbles. The harbour falls away behind, with its gulls and its boats and its smell of tar and herring.'},
  {text:d.line},
  {text:'The cart stops at last. "Here you are, friends. Mind the step, and mind the donkey. He bites."'}]};
function yrRide(d,fare){
  if(G.gold<fare)return say('The fare is '+fare+' gold, and you have too little. Perhaps a nearer place?',[BYE]);
  G.gold-=fare;YR_RIDE=d;sfx('key');G.talk=null;
  startCut('yrRide',()=>{
    const arrive=()=>{
      if(!LEVELS[d.lv]&&KH_LAZY[d.lv])KH_LAZY[d.lv]();
      const L=LEVELS[d.lv],a=d.at||(L&&L.start)||{x:1,y:1,f:1};
      goToLevel(d.lv,{x:a.x,y:a.y,f:a.f!==undefined?a.f:1});
      advanceTime(clamp(Math.round(fare*1.2),60,600));
      msg('You step down from the cart in '+d.n+'.','#ffe9a0');
    };
    if(d.lv===44&&LEVELS[44].stub)khEnter(arrive);else arrive();
  });
  return null;
}
function yrDonkeyMenu(){
  const F=G.flags,here=YR.ID;
  const opts=YR_RIDES.filter(r=>r.lv!==LEVEL&&r.need()).map(r=>{const fare=r.fare();return [r.n+'  ('+fare+' gold)',()=>yrRide(r,fare)]});
  const hidden=YR_RIDES.filter(r=>!r.need()).length;
  const o=opts.slice(0,3);
  if(opts.length>3)o.push(['More places...',()=>{const rest=opts.slice(3);rest.push(['Back',()=>yrDonkeyMenu()]);return say('Where else?',rest)}]);
  o.push(['Never mind.',()=>null]);
  return say('Where to? Hamid knows every road along the coast and a few that are not on any map.'+(hidden?' (The places you have not yet been to, he will not take you to: he says a man cannot go home to a place he has not left.)':''),o);
}
// (Hamid and Biscuit themselves are in yarrim_quests.js, where the donkey also has a favour to ask)
