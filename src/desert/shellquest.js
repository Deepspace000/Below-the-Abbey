/* ==========================================================================
   THE SINGING SHELL. Brother Aldous on the Isle of Bells tells the party of a great spiral shell that broke in four and sank, one piece
   under each island. A piece lies in a far corner of every underwater dungeon, in a pearl-white clam that glows faintly. Put together
   they make the Nautilus Helm: a magic helm that heals the wearer every round of a battle, restores mana, and breathes for them under water.
   ========================================================================== */
const SHELL_LV=[320,321,322,323],SHELL_IDS=['shellp1','shellp2','shellp3','shellp4'];
const SHELL_NAMES=['the Whorl','the Lip','the Spire','the Pearl-Lining'];
SHELL_IDS.forEach((id,i)=>{ITEMDEF[id]={n:'Shell Piece: '+SHELL_NAMES[i][0].toUpperCase()+SHELL_NAMES[i].slice(1),k:'quest',t:'Shell',ic:'pearl',c:'#e8d8f0',stack:1,price:0,d:'A curved piece of pearl-lined shell, cool and a little heavy. It hums very faintly, and when you hold it near your ear you can hear the sea. It is '+SHELL_NAMES[i]+' of a great shell that was broken in four.',sw:.3}});
ITEMDEF.nautilushelm={n:'Nautilus Helm',k:'head',t:'Helm',ic:'divehelm',c:'#e8d8f0',armor:9,price:9000,rar:1,dive:1,pas:{regen:2,mpRegen:.6},d:'A helm grown from one great spiral shell, pearl-white inside and rose at the lip. Its wearer recovers health every round of a battle, mana comes back faster, and they can breathe under the sea. It sings very quietly when blows land.',sw:.4};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('nautilushelm');
const shellHave=()=>SHELL_IDS.reduce((a,id)=>a+Math.min(1,bagCount(id)),0);
vq('shell','The Singing Shell','Brother Aldous','Brother Aldous says a great spiral shell broke in four and sank, one piece beneath each island. Dive each of the four underwater dungeons and find the pearl-white clam that holds its piece in a far corner of the reef. Bring all four to Aldous, and he will make the shell whole. You need a Diving Helm each.',4,shellHave,{gold:3000,xp:15000,items:['nautilushelm']},{take:{shellp1:1,shellp2:1,shellp3:1,shellp4:1}});
const DSHELL=khQD('The old monks told of a shell as big as a helm, a nautilus grown over a thousand years in the deep, that sang when the sea was angry. It broke in four in a storm, and the sea took the pieces under the islands, one beneath each: the Whorl under Saltbarrow, the Lip under this island, the Spire under Cinder Isle, the Pearl-Lining under Last Light. Whoever wears it, the sea itself would mend. I am too old to dive. Will you?','Every dive line is a buoy on a south beach. In each reef, look away from the paths, in a far corner. The piece sits inside a pearl-white clam that glows, and it is not the same as the clams that hold pearls.',(n,m)=>`${n} of ${m} pieces. The Whorl is under Saltbarrow, the Lip under this island, the Spire under Cinder Isle and the Pearl-Lining under Last Light. Look in the far corners of the reefs.`,'Four pieces! Lay them down here, on the stone, in a ring. Yes. Yes, they fit.','It sings. Listen. It is whole, and it is yours: wear it, and the sea will mend what it takes. Go well, and do not drown.','The helm is yours. I still hear the shell, some nights, under the bell.');
Object.assign(CUTS,{nautilus:()=>[
  {text:'Brother Aldous kneels on the cold stone beside the abbey bell and lays the four pieces in a ring: the Whorl, the Lip, the Spire and the Pearl-Lining. For a moment they are only broken shell.'},
  {text:'Then the sea comes into the room. There is no water, but the sound of it, a long low note like wind across the mouth of a jar, and the pieces slide together without a hand on them. The seams close. Pearl runs over them like milk.'},
  {who:'Brother Aldous',text:'I have heard that note in my sleep for forty years. I never thought to hear it awake.'},
  {who:hn(1),text:'It is singing. Listen. It sounds like the reef.'},
  {text:'The shell rises a little way from the floor, turning, rose at the lip and white as a pearl inside. Every wound the party carries gives a small ache, as if remembering, and then lets go.'},
  {who:'Brother Aldous',text:'It is a helm, now. It always was. The monks who grew it meant it for one head, and it waited a thousand years for a head that would carry it down to the sea and back.'},
  {who:hn(0),text:'It is warm. And it is lighter than it looks.'},
  {text:'The Nautilus Helm settles into your hands. Far below the Isle of Bells, in the drowned abbey, something large turns over in its sleep, and is quiet.'}]});
repWrap('ib_aldous',()=>qSt('vq2')==='done'&&qSt('shell')!=='done','About the singing shell',()=>{
  if(qReady('shell'))return say(DSHELL.ready,[['Lay the four pieces down.',()=>{const rw=rewardText('shell');qTurnIn('shell');G.talk=null;startCut('nautilus',()=>msg('Reward: '+rw,'#ffe36a'));return null}],BYE]);
  return qNode('shell',DSHELL)});
khNpc('uw_shellpc','A glowing clam','uw_clam',d=>{
  const F=G.flags;F.shellGot=F.shellGot||{};const i=SHELL_LV.indexOf(LEVEL),id=SHELL_IDS[i];
  if(F.shellGot[LEVEL]||bagCount(id)>0)return say('The clam is open and empty. It still glows a little.',[BYE]);
  if(qSt('shell')===null)return say('A giant clam, pearl-white, glowing faintly from inside, set apart from all the others. It will not open for you. Perhaps someone on the islands knows what it is.',[BYE]);
  if(!bagAdd(mkItem2(id,1)))return say('The clam opens, and there is a piece of shell in it, but your bag is full.',[BYE]);
  F.shellGot[LEVEL]=1;d.found=true;sfx('key');
  return say(`The clam opens like a book, and inside, lying in its own light, is a curved piece of pearl-lined shell: ${SHELL_NAMES[i]}. ${shellHave()} of 4 pieces.`,[BYE])});
