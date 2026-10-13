/* ==========================================================================
   KHEMETRA: THE GREAT STORIES. The cartographer who sends the party across the seven deserts for the pieces of the
   Instrument of Dawn, the grand vizier who wants his seal back before he says where the wizard lives, the wizard in the
   cisterns beneath the city, and the shipwright who looks east to the Vaast Ocean.
   ========================================================================== */
const KH_FACE_FALLBACK={kh_npc5_0:'beggar',kh_npc5_1:'child',kh_npc5_2:'fisher',kh_npc5_3:'miner',kh_npc5_4:'smith',kh_npc5_5:'drunk',kh_npc6_0:'scribe',kh_npc6_1:'sergeant',kh_npc6_2:'innkeeper',kh_npc6_3:'waterwoman',kh_npc6_4:'prismwiz',kh_npc6_5:'child',kh_anim1_0:'chicken'};
function khFaceKey(face){return IMG[face]?face:(KH_FACE_FALLBACK[face]&&IMG[KH_FACE_FALLBACK[face]]?KH_FACE_FALLBACK[face]:'peasantM')}
/* ---- the seven pieces of the Instrument of Dawn: one in a little dungeon of each desert ---- */
const KH_ARTS=[
  {id:'khart1',n:'Compass of Dawn',d:'A golden compass whose needle points not north but toward the sunrise. It is warm to the touch.',desert:'The Sand Road',lv:103,quest:'kh_c1'},
  {id:'khart2',n:'Sphinx Scroll Case',d:'A bronze scroll case sealed with a sphinx. Inside, a map of stars that no longer exist.',desert:'The Red Dunes',lv:108,quest:'kh_c2'},
  {id:'khart3',n:'Copper Serpent Amulet',d:'A sun amulet with a copper serpent coiled round it. It hums when the wind turns.',desert:'The Blue Dunes',lv:120,quest:'kh_c3'},
  {id:'khart4',n:'Sand Mother Astrolabe',d:'A bronze astrolabe of the oldest design. Its rings still turn, though the sands have filled them twice.',desert:'The Golden Erg',lv:128,quest:'kh_c4'},
  {id:'khart5',n:'Jade Scarab of the Pale Cartographer',d:'A jade beetle carved with a tiny map along its wings. The map changes when you are not looking.',desert:'The Violet Erg',lv:134,quest:'kh_c5'},
  {id:'khart6',n:'Lens of the Twin Suns',d:'A crystal lens in a gold ring. Through it, the desert at noon shows two suns, one a little behind the other.',desert:'The White Dunes',lv:141,quest:'kh_c6'},
  {id:'khart7',n:'Ankh Key of the Last Oasis',d:'A golden key shaped like an ankh. It fits no lock in Khemetra, and it opens every door it touches.',desert:'The Flatlands',lv:146,quest:'kh_c7'},
];
for(const a of KH_ARTS){ITEMDEF[a.id]={n:a.n,k:'quest',ic:'sundisc',c:'#f0d070',price:1,d:a.d,sw:.34}}
if(typeof DS_ITEM_IDS!=='undefined')for(const a of KH_ARTS)DS_ITEM_IDS.push(a.id);
(function placeArtifacts(){
  for(const a of KH_ARTS){
    const L=LEVELS[a.lv];if(!L)continue;
    const cof=(L.decor||[]).find(d=>d.k==='sarcoph')||{x:L.start.x,y:L.start.y-3};
    let spot=null;
    for(let r=1;r<=3&&!spot;r++)for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1],[0,2],[2,0],[-2,0],[0,-2]]){
      const x=cof.x+dx*r,y=cof.y+dy*r;
      if(!L.rows[y]||L.rows[y][x]!=='.')continue;
      if((L.decor||[]).some(d=>d.block&&d.x===x&&d.y===y)||(L.items||[]).some(i=>i.x===x&&i.y===y))continue;
      spot=[x,y];break;
    }
    if(spot)(L.items=L.items||[]).push({k:a.id,x:spot[0],y:spot[1]});
  }
})();
const khHave=n=>KH_ARTS.slice(0,n).every(a=>bagCount(a.id)>0||G.flags['kh_gave_'+a.id]);
/* ---- the cartographer, Neferet ---- */
khQuest('kh_c1','The Compass of Dawn','Neferet, the cartographer','Neferet asks you to recover the Compass of Dawn from the Catacomb of Whispering Sands, a little dungeon on the Sand Road, north-east of Anaea.',1,()=>bagCount('khart1'),{gold:300,xp:900,items:['potion2']},{take:{khart1:1}});
khQuest('kh_c2','The Sphinx Scroll Case','Neferet, the cartographer','Neferet needs the Sphinx Scroll Case from the Shrine of the Sleeping Sphinx, a little dungeon in the Red Dunes.',1,()=>bagCount('khart2'),{gold:400,xp:1200,items:['potion2']},{take:{khart2:1}});
khQuest('kh_c3','The Copper Serpent Amulet','Neferet, the cartographer','Neferet needs the Copper Serpent Amulet from the Shrine of the Copper Serpent in the Blue Dunes.',1,()=>bagCount('khart3'),{gold:500,xp:1500,items:['potion3']},{take:{khart3:1}});
khQuest('kh_c4','The Sand Mother Astrolabe','Neferet, the cartographer','Neferet needs the Astrolabe from the Undercroft of the Sand Mother in the Golden Erg.',1,()=>bagCount('khart4'),{gold:600,xp:1800,items:['potion3']},{take:{khart4:1}});
khQuest('kh_c5','The Jade Scarab','Neferet, the cartographer','Neferet needs the Jade Scarab from the Barrow of the Pale Cartographer in the Violet Erg.',1,()=>bagCount('khart5'),{gold:700,xp:2200,items:['potion3']},{take:{khart5:1}});
khQuest('kh_c6','The Lens of the Twin Suns','Neferet, the cartographer','Neferet needs the Lens of the Twin Suns from the Sepulchre of the Twin Suns in the White Dunes.',1,()=>bagCount('khart6'),{gold:800,xp:2600,items:['potion4']},{take:{khart6:1}});
khQuest('kh_c7','The Ankh Key','Neferet, the cartographer','Neferet needs the Ankh Key from the Barrow of the Last Oasis in the Flatlands.',1,()=>bagCount('khart7'),{gold:1000,xp:3200,items:['potion4']},{take:{khart7:1}});
const KH_CART=['kh_c1','kh_c2','kh_c3','kh_c4','kh_c5','kh_c6','kh_c7'];
const KH_CART_TALK=[
  ['Beyond the Sand Road, in a little dungeon called the Catacomb of Whispering Sands, lies the first piece, the Compass of Dawn. Bring it to me.','The Sand Road. Take the east gate of Anaea and walk north. Little dungeons are scattered through the dunes and the palms.','The compass is warm, and it points to the sunrise. This is the first piece of the Instrument. Thank you.'],
  ['The second piece is the Sphinx Scroll Case, kept in the Shrine of the Sleeping Sphinx, a small dungeon in the Red Dunes, beyond the tomb of Sut.','The Red Dunes lie north of the tomb of Sut. The shrine has a stair or a hatch, and it keeps a scroll case.','A map of dead stars, sealed by a sphinx. The second piece. You have more courage than most.'],
  ['The third piece, the Copper Serpent Amulet, rests in the Shrine of the Copper Serpent in the Blue Dunes. Few have come back from there with their wits.','The Blue Dunes are east of the Red Dunes. Follow the road, and ask the wind.','A copper serpent, and it hums. The third piece is mine. I hear the Instrument beginning to sing.'],
  ['The fourth piece is the Astrolabe, in the Undercroft of the Sand Mother in the Golden Erg. The sand there is pure gold, and it is not kind.','The Golden Erg is a sea of yellow sand. Look for the Undercroft, and take water.','The astrolabe turns! Four pieces, and I have not slept in a week. Thank you.'],
  ['The fifth is the Jade Scarab, in the Barrow of the Pale Cartographer, in the Violet Erg. It was a cartographer like me. Be kind to her ghost.','The Violet Erg is east of the Golden Erg, beyond the shifting dunes. The barrow is small and cold.','The scarab shows a new map every hour. The fifth piece. You have my gratitude, and my admiration.'],
  ['The sixth is the Lens of the Twin Suns, in the Sepulchre of the Twin Suns in the White Dunes. They say it shows two suns at noon.','The White Dunes lie beyond the Violet Erg. The sepulchre is cold and bright.','The lens is perfect. Through it I see where the last piece lies. The sixth piece. Thank you.'],
  ['The last piece is the Ankh Key, in the Barrow of the Last Oasis, in the Flatlands. Take care. The key opens more than doors.','The Flatlands lie east of the White Dunes. The barrow is hard to find, and harder to leave.','The Ankh Key. All seven, and the Instrument of Dawn is whole. You have given Khemetra back its sunrise.'],
];
khNpc('kh_neferet','Neferet, the royal cartographer','kh_npc6_0',()=>{
  const F=G.flags;
  for(let i=0;i<7;i++){const q=KH_CART[i];if(qReady(q))return say(KH_CART_TALK[i][2],[['Hand over the piece.',()=>{qTurnIn(q);F['kh_gave_khart'+(i+1)]=1;if(i===6){F.khInstrument=1;return say('All seven pieces, on my table. The Instrument of Dawn hums, and for a heartbeat the whole city is lit from inside. Take this, with the thanks of Khemetra. The Instrument will point the way to something far across the sands. When it does, I will send word.',[BYE])}return say('Another piece. Come to me again, and I will tell you where the next one lies.',[BYE])}],BYE])}
  for(let i=0;i<7;i++){const q=KH_CART[i];if(qSt(q)==='active')return say(KH_CART_TALK[i][1],[BYE])}
  const next=KH_CART.findIndex(q=>qSt(q)===null);
  if(next<0)return say('The Instrument of Dawn is whole, and the maps are drawn. You have done more than any cartographer could ask.',[BYE]);
  if(next===0&&!F.khNeferetMet)return say('You are the travellers the vizier mentioned. I am Neferet, the royal cartographer. This room holds every map of every desert, and none of them is complete. A long time ago the first cartographers built the Instrument of Dawn, seven pieces that together show the shape of the whole world. The pieces were lost in the little dungeons of the deserts. I would give a great deal to see them again.',[['I would like to help.',()=>{F.khNeferetMet=1;qAccept('kh_c1');return say(KH_CART_TALK[0][0],[BYE])}],['Not now.',()=>null]]);
  return say(KH_CART_TALK[next][0],[['We will find it.',()=>{qAccept(KH_CART[next]);return say(KH_CART_TALK[next][1],[BYE])}],['Not now.',()=>null]]);
},{q:KH_CART});
/* ---- the grand vizier, Hotep-Ra ---- */
khQuest('kh_seal','The Stolen Seal','Hotep-Ra, the grand vizier','The royal seal was stolen by a band that hides in the ruined houses of the old quarter, in the north-west of Khemetra. Recover it from a boarded house.',1,khFlag('khSeal'),{gold:500,xp:1500,items:['ringW']});
khNpc('kh_sealchest','A locked chest','chest',d=>{const F=G.flags;if(qSt('kh_seal')==='active'&&!F.khSeal){F.khSeal=1;sfx('key');return say('Under a pile of stolen silver lies a heavy gold ring with the sun of Khemetra cut into its face. This is the royal seal.',[BYE])}
  return say(F.khSeal?'An empty chest. The stolen silver is gone.':'A chest of stolen silver and pewter. Nothing of the crown is here.',[BYE])});
khNpc('kh_vizier','Hotep-Ra, the grand vizier','kh_npc3_5',()=>{
  const F=G.flags,st=qSt('kh_seal');
  if(qReady('kh_seal'))return say('You have it. Show me.',[['The royal seal is here.',()=>{qTurnIn('kh_seal');F.khWizardKnown=1;msg('The vizier names the wizard\'s hiding place. A hatch in the Potters Market now opens.','#ffe36a');return say('The seal of the king, unbroken. You have done Khemetra a great service, and a service is the only coin I accept. Now I will keep my word. The wizard Ishkander lives beneath the city, in the old cisterns. The entrance is a hatch in the Potters Market, in the north-west, hidden behind a stall. He receives few visitors. Tell him I sent you, and be careful. The cisterns are not empty.',[BYE])}],BYE]);
  if(st==='active')return say('The seal is in a boarded house in the old quarter, in the north-west. The thieves call themselves the Hollow Hand. Bring me the ring, and the wizard is yours.',[BYE]);
  if(st==='done'){return say(F.scoriaWizard?'Ishkander has spoken for you? Then you have friends in high places, and I am not one of them. Yet.':'The cisterns lie below the Potters Market. Ishkander does not like to be disturbed.',[BYE])}
  if(!F.khVizierMet){F.khVizierMet=1;return say('Strangers in white robes, and not a single one of you is carrying a petition. Interesting. I am Hotep-Ra, grand vizier of Khemetra. State your business, or leave it.',[
    ['Mayor Marigold of Anaea sent us to find the wizard Ishkander.',()=>say('Ishkander. Yes, I know the name. He has not walked in the upper city for ten years. I could tell you where he lives. I will not tell strangers. But I will tell those who have served Khemetra. The royal seal was stolen last week by a gang that hides in the ruined houses of the old quarter. Recover it, and I will give you what you ask.',[['We will recover the seal.',()=>{qAccept('kh_seal');return say('The old quarter is in the north-west. The seal is a gold ring with the sun on its face. They will have hidden it in a chest, in a boarded house. Take care.',[BYE])}],['Not now.',()=>null]])],
    ['We are only travellers.',()=>say('Then you are welcome in the city, and you may buy bread. I have nothing else for you.',[BYE])]])}
  return say('Do you want to take on the matter of the seal?',[['Yes. Tell me again.',()=>{if(qSt('kh_seal')===null){qAccept('kh_seal');return say('The seal is a gold ring with the sun of Khemetra on its face. The thieves, the Hollow Hand, hide in the ruined houses in the north-west of the city. Bring it to me.',[BYE])}return say('You already know the task.',[BYE])}],['Not yet.',()=>null]]);
},{q:'kh_seal'});
/* ---- Ishkander, in the cisterns ---- */
khNpc('kh_ishkander','Ishkander, the wizard','kh_npc6_4',()=>{
  const F=G.flags;
  if(F.scoriaWizard)return say('The warrant will be torn up by the end of the week. I have written to the king, and to the one man who can read my handwriting. You may rest. The king of Khemetra returns from his summer court in a few days. Ask me about him when you are ready, and be careful in the streets in the meantime.',[BYE]);
  return say('Visitors. In my cistern. I have lived here ten years, and in all that time not a soul has come to the door who was not lost or hungry. You are neither. Who sent you?',[
    ['The grand vizier. And before him, Mayor Marigold of Anaea.',()=>say('Marigold! She once gave me a loaf of honey bread and a bad piece of advice, and I have never forgotten either. And the vizier, who does not give a name away for nothing. So you are the ones who killed Gandrick, and took his ledger to a mayor who threw you in his dungeon.',[
      ['We were set up. We want the warrant torn up.',()=>say('The warrant is forged, and I knew it as soon as I heard the word forger. The king trusts me, though I do not know why. I will vouch for you. A letter, with my seal, in my own hand. It will reach the king within the week. Go and breathe the air of the city for a while.',[['Thank you, Ishkander.',()=>{F.scoriaWizard=1;qTurnIn('scoria');giveXP(2500);G.gold+=500;msg('Quest complete: Counsel in Scoria. +500 gold.','#ffe36a');sfx('win');return say('You are welcome. The king returns from his summer court in a few days. Ask me about him. And be careful out in the streets. A forged warrant has a price on it, and a price has friends.',[BYE])}]])],
      ['Just the wizard we were told of.',()=>say('Then you have found him. Sit down, and tell me when you are ready.',[BYE])]])],
    ['Nobody. We got lost.',()=>say('Lost, in the cisterns, under a city of four hundred thousand. How remarkable. The way up is that way.',[BYE])]]);
},{q:'scoria'});
/* ---- Captain Menkaure, the shipwright, and the road to the sea ---- */
khQuest('kh_sea','The Road to the Vaast Ocean','Captain Menkaure','Menkaure the shipwright says a tunnel runs from the east of the Violet Erg to the shore of the Vaast Ocean. Find it, walk it, and see the sea.',1,khFlag('khSeaSeen'),{gold:900,xp:4000,items:['potion4']});
khNpc('kh_captain','Menkaure, the shipwright','kh_npc6_1',()=>{
  const F=G.flags,st=qSt('kh_sea');
  if(qReady('kh_sea'))return say('You have been to the shore? Tell me everything. How wide was it? What colour? Did it smell of salt?',[['We stood on the shore of the Vaast Ocean.',()=>{qTurnIn('kh_sea');F.khSeaReport=1;return say('Then the old sailors were right. There is a sea, and the road to it exists. I will start building at once. A ship takes time, and so does a crew, but I think we shall sail before the year is out. Come and see me when the keel is laid.',[BYE])}],BYE]);
  if(st==='active')return say('The tunnel lies in the east of the Violet Erg, near the coast. Look for a cave mouth between two dunes, with sea birds over it. Do not go at noon.',[BYE]);
  if(st==='done')return say('The ship will be called the Dawn Walker. She will not sail before the keel is laid, and the keel needs a century-old cedar, which is a problem for another day. Come back when you hear the hammers.',[BYE]);
  return say('Menkaure, shipwright of Khemetra, and every man in this city thinks I am mad. Four hundred miles from the sea, building ships. But my grandfather sailed, and my grandfather\'s grandfather, and their charts say the Vaast Ocean lies east of the Violet Erg, at the end of a tunnel in the rock. Nobody has seen it for a hundred years.',[['We could look for the tunnel.',()=>{qAccept('kh_sea');return say('Brave souls! Go east, past the Violet Erg, to the coast. Find the tunnel and walk it to the shore. Then come back and tell me what you saw. The sea will be waiting, or it will not.',[BYE])}],['Not now.',()=>null]]);
},{q:'kh_sea'});
