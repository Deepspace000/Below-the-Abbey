/* ==========================================================================
   THE STORY SO FAR. A page in the journal that writes the main story down as it happens: the chapters the party has lived through,
   in order, each marked with the day it was reached, and a line at the top about what to do next.
   An entry appears when its condition becomes true; the day is noted the first time the page (or the game) sees it.
   ========================================================================== */
const STORY=[
  {id:'abbey',c:()=>true,t:'The Crypts and the Town',x:'The tale began in the crypts below the Abbey, and in the timber town of Thornwick above them, a town that did not much want four more adventurers. There was work to be had, and the road beyond the palisade was long.'},
  {id:'gandrick',c:()=>G.flags.gandrickDead,t:'Gandrick\'s Ledger',x:'The party killed Gandrick, the bandit who raided the Thornwick road, and took his ledger from the body. It showed that the mayor of Thornwick had been paid to send travellers to their deaths.'},
  {id:'ironhill',c:()=>G.flags.halbrecht||G.flags.wanted,t:'The Mayor of Ironhill',x:'At Ironhill the ledger was a gift to the wrong man. Mayor Halbrecht called it a forgery, threw the party in his dungeon, and sent a rider to the king naming them forgers. A warrant was out for all four of them, and hunters and hitmen were already on the road.'},
  {id:'pass',c:()=>G.flags.passDone,t:'Over the Greyfang Pass',x:'With the hunters at their heels the party crossed the Greyfang Pass and left the known country behind. East of the pass the maps stop.'},
  {id:'anaea',c:()=>G.flags.annaMet,t:'Mayor Marigold of Anaea',x:'In white-stoned Anaea, Mayor Marigold heard the whole story and believed it. The king would not listen to a village mayor, she said, but there was one man he did listen to: the wizard Ishkander, in the desert kingdom to the north.'},
  {id:'khemetra',c:()=>G.flags.khWizardKnown||G.flags.scoriaWizard,t:'The Road to Khemetra',x:'The party crossed the Sand Road and the desert to Khemetra, the golden city. The grand vizier, Hotep-Ra, would not give the wizard\'s hiding place to strangers, but he named it for those who recovered the royal seal.'},
  {id:'ishkander',c:()=>G.flags.scoriaWizard,t:'The Wizard in the Cistern',x:'Ishkander lives in a study at the end of the cisterns beneath the Potters Market. He knew the warrant was forged the moment he heard the word forger, and he promised to write to the king. The king of Khemetra was away at his summer court, and would be home in a few days.'},
  {id:'knives',c:()=>G.flags.mqDay0!==undefined,t:'A Price on Their Heads',x:'Ishkander warned the party that the warrant carried a price, twenty thousand crowns on each head, and that such money buys knives. In Khemetra the knives came: cloaked strangers in the streets, and a few waiting behind the doors of the houses. The party stayed alive.'},
  {id:'king',c:()=>G.flags.kingBack,t:'The King Returns',x:'The trumpets sounded over Khemetra. King Rahotep was home, and Ishkander told the party to go straight to the palace.'},
  {id:'audience',c:()=>G.flags.audience,t:'The King\'s Audience',x:'King Rahotep read Ishkander\'s letter and the dead bandit\'s ledger, and knew the hand that signed the warrant was not King Osric\'s. It was Lord Corvane, Warden of the western Crown, who had been taking the tolls for himself. The ledger the party carried was only a copy. The master was written in three pages by Corvane\'s scribe, Isolde, who fled by sea and hid them on the islands of the Vaast Sea. Then a dying rider fell at the foot of the throne: Corvane\'s black ship, the Black Heron, lay off Yarrim, and he meant to have the party by the new moon. The king ordered the Sea Gate unsealed.'},
  {id:'gate',c:()=>G.flags.yarOpen,t:'The Sea Gate',x:'The warden\'s key lay in a rusted chest in the cisterns. With it the grand vizier unsealed the Sea Gate in the east wall of Khemetra, shut for a hundred years.'},
  {id:'tunnel',c:()=>qSt('yar3')==='done',t:'The Tunnel',x:'The tunnel behind the Sea Gate was full of the drowned dead. The party cleared it, and Menkaure the shipwright called it a road at last.'},
  {id:'yarrim',c:()=>G.flags.yarSeen,t:'Yarrim',x:'At the far end of the tunnel lay Yarrim, a small fishing town on the Vaast Sea, with gulls over the pier and fishing boats moored in the bay. The harbourmaster, Tamsin Kell, was hiding the Dawn Walker, a ship built in secret, from Corvane\'s men.'},
  {id:'outfit',c:()=>qSt('yar6')==='done',t:'The Dawn Walker',x:'The party found the stores washed up on the beach, cleared the rats from the Net Loft, and brought torches to old Orsa so that the Yarrim Light burned again. The Dawn Walker was ready to sail.'},
  {id:'castoff',c:()=>G.flags.voyage,t:'Cast Off',x:'The Dawn Walker slipped her moorings on the evening tide just as the Black Heron turned into the bay. Corvane called for them to heave to. The party ran for the shallows by the light of the lamp, and by dawn there was only the sea.'},
  {id:'saltbarrow',c:()=>qSt('vq1')==='done',t:'Saltbarrow',x:'On a pirate island of sand and wrecks, Sable Maeve wanted Corvane\'s marines gone. The party cleared them from her shore, and she told them where Isolde had gone: to the Isle of Bells.'},
  {id:'bells',c:()=>qSt('vq2')==='done',t:'The Isle of Bells',x:'On the Isle of Bells, in a drowned abbey, Brother Aldous would give up the first page of the ledger only to those who rang all three bells and faced the dead who woke. The party faced them. The first page was theirs.'},
  {id:'cinder',c:()=>qSt('vq3')==='done',t:'Cinder Isle',x:'On a black volcano of an island, the ash-priestess Ketra asked for three crystals and the death of the Cinder Guardian that walked the slopes. The party brought both, and she gave up the second page.'},
  {id:'lastlight',c:()=>qSt('vq4')==='done',t:'Last Light',x:'At the end of the chain, Isolde herself sat in a hut by a ruined beacon. The third page lay in the altar at the top of the island, and Lord Corvane had followed the party\'s lamp across half the sea to take it. He did not leave the island.'},
  {id:'oldhaven',c:()=>G.flags.oldhavenSeen,t:'Oldhaven',x:'The Dawn Walker came home at dawn to Oldhaven, the king\'s city, with the whole master ledger in Isolde\'s own hand. The royal harbour was a wall of pale stone with every gun turned on the water. The gate would open at noon, and a warrant still stood against four named persons.'},
  {id:'court',c:()=>G.flags.courtSeen,t:'The Court of King Osric',x:'At noon the party was brought before King Osric and his court, with the master ledger in their hands.'},
  {id:'pardon',c:()=>G.flags.pardoned,t:'The Warrant Torn Up',x:'The ledger was read in open court, and the king saw whose hand wrote his tolls and his warrants. The chancellor who had stood behind Corvane fell, the warrant was torn in two, and the ransom on four heads was lifted. The road home, so long and so strange, was clear.'}
];
STORY.push(
  {id:'yarvillage',c:()=>G.flags.yarSeen,t:'The Village of Yarrim',x:'Yarrim is a hamlet that grew up by itself: one little cobbled road down to a harbour square, three lanes off it, a green behind the inn, and a dirt track at the back past two cottages to the gorge and the tunnel. Its people are small ones, and each has a favour to ask: a telescope stolen by a gull, a census of crabs, a message in a bottle, a left boot that is a right boot, a wedding of two boats, a donkey who will not budge, a thief of nets, a lantern at the bottom of the harbour, and a shanty with no last verse.'},
  {id:'wanderers',c:()=>G.flags.wMet&&Object.keys(G.flags.wMet).length,t:'The Wandering Monsters',x:'Strange things walk the levels without warning: the Ferryman of Dust, Mother Mossback, Aunt Marrow, the Hollow Bride and others, nine who ask for a favour and six who hunt. The rarest is the Messenger of Death, who writes the letters of his name on the walls, and whose letters kill when all five have been read. The Wanderers page in the main menu keeps a record of each one met.'},
  {id:'open',c:()=>G.flags.pardoned,t:'What is still open',x:'The warrant is torn up and Lord Corvane is dead, but the story does not end at the pardon. The Dawn Walker is the ship of the party, with the whole Vaast Sea around her. Oldhaven, the city of the king, is a stony castle town with a court and a throne. The wanderers keep walking, the Messenger is somewhere in the dark of every level, and nobody has yet said where the road goes from here.'});
function storyNext(){ // what to do next, from the chapter the party has reached
  const F=G.flags;
  if(F.pardoned)return 'The warrant is torn up and the ransom lifted. The road is yours.';
  if(F.courtSeen)return 'You stand in the court of King Osric. Finish what you started.';
  if(F.oldhavenSeen)return 'Oldhaven. Wait for noon at the quay gate, then carry the master ledger to the king.';
  if(qSt('vq4')==='done'||F.page3)return 'Take the Dawn Walker to Oldhaven, the king\'s city, with the whole ledger.';
  if(qSt('vq3')==='done')return 'Sail to Last Light. Isolde keeps the last page, and Corvane is close behind.';
  if(qSt('vq2')==='done')return 'Sail to Cinder Isle. Ketra the ash-priestess keeps the second page.';
  if(qSt('vq1')==='done')return 'Sail to the Isle of Bells. Brother Aldous keeps the first page.';
  if(F.voyage)return 'Corvane\'s marines are camped on Saltbarrow. Find Sable Maeve and help her.';
  if(qSt('yar6')==='done')return 'Find Menkaure on the pier at Yarrim and cast off.';
  if(F.yarSeen)return 'In Yarrim, fit out the Dawn Walker. The harbourmaster, Tamsin Kell, and the lighthouse keeper, Orsa, need help.';
  if(F.yarOpen)return 'Go through the Sea Gate in the east wall of Khemetra, clear the tunnel with Menkaure\'s help, and reach Yarrim.';
  if(F.audience)return 'The king has ordered the Sea Gate opened. Ask the grand vizier for the key.';
  if(F.kingBack)return 'The king is home. Go to the throne room in the palace.';
  if(F.mqDay0!==undefined)return 'Wait in Khemetra for the king to return, and stay alive.';
  if(F.scoriaWizard)return 'Ask Ishkander about the king. Be careful in the streets.';
  return 'Find the wizard Ishkander, hiding in the cisterns of Khemetra.';
}
function storyTickDays(){
  const F=G.flags;F.storyD=F.storyD||{};
  for(const e of STORY){if(!F.storyD[e.id]&&e.c()){F.storyD[e.id]=dayNum()+1;if(e.id!=='abbey'&&G.state==='play')msg('The journal records a new chapter: '+e.t+'.','#e8d8a0')}}
}
journalPage({id:'story',title:'The Story So Far',
  summary:()=>{const n=STORY.filter(e=>e.c()).length;return `${n} chapters written. ${storyNext()}`},
  note:()=>0,
  open(){G.rs=1e6},
  draw(){
    jFrame('The story so far');
    const F=G.flags;try{storyTickDays()}catch(e){}
    const lived=STORY.filter(e=>e.c()),list=G.storyAll?STORY:lived;
    txt(G.storyAll?`all ${STORY.length} chapters, ${lived.length} lived`:`${lived.length} chapters`,440,25,8,'#a89878','right');
    const nx=storyNext();const nl=wrapText('Next: '+nx,396,8.2);
    nl.forEach((l,i)=>txt(l,240,40+i*10,8.2,'#e8c878','center'));
    const top=44+nl.length*10+4,viewH=300-top,bw=392;let y=0;
    const rows=list.map(e=>{const ls=wrapText(e.x,bw,8.2);const o={e,ls,y};y+=14+ls.length*10.4+12;return o});
    const max=Math.max(0,y-viewH);G.rs=clamp(G.rs||0,0,max);
    ctx.save();ctx.beginPath();ctx.rect(30,top,420,viewH);ctx.clip();
    for(const o of rows){const ry=top+o.y-G.rs;if(ry<top-80||ry>top+viewH)continue;
      ctx.fillStyle='#8a6a2a';ctx.fillRect(38,ry+2,3,13+o.ls.length*10.4);
      const lv=o.e.c();
      txt(o.e.t,48,ry+7,9.6,lv?'#e8d8a0':'#8a7e66','left',true);
      const d=F.storyD&&F.storyD[o.e.id];txt(lv?(d&&o.e.id!=='abbey'?'Day '+d:''):'not yet reached',440,ry+7,7.4,'#8a7a60','right');
      o.ls.forEach((l,i)=>txt(l,48,ry+19+i*10.4,8.2,lv?'#d2c9b2':'#8e8670','left'));
    }
    ctx.restore();
    if(max>0){btnText('st_up','Up',60,288,50,16);btnText('st_dn','Down',370,288,50,16)}
    btnText('st_all',G.storyAll?'Only what I have lived':'The whole story',150,288,180,16);
    BTNS.push({id:'rmarea',x:30,y:top,w:420,h:viewH,up:true,drag:'rum'});
  },
  click(id){if(id==='st_all'){G.storyAll=!G.storyAll;G.rs=0}if(id==='st_up')G.rs=Math.max(0,(G.rs||0)-90);if(id==='st_dn')G.rs=(G.rs||0)+90}
});
