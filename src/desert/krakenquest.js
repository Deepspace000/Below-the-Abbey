/* ==========================================================================
   THE KRAKEN GUNS. The Kraken stands between the two coasts of the Narrow Sea, and it is twenty levels above the party: nothing the party
   carries can hurt it. Four magical harpoons, the Kraken guns of the old Crown fleet, can, and only it. They are scattered over the sea:
     1 the Ember Harpoon      Redcliff (an altar on red cliffs)           clue from Ketra, the ash-priestess
     2 the Verdigris Harpoon  Kelpgate Rock (a ship on the rocks)         clue from Sable Maeve
     3 the Silver Harpoon     the Hollow Isle (a ring of standing stones) clue from Brother Aldous
     4 the Beacon Harpoon     the wreck under Last Light (a dive)         clue from Isolde
   Menkaure sets the quest once the third page of the ledger is found. Every hero needs one in hand. Each does huge damage to the Kraken
   and next to none to anything else. When the Kraken is dead the four crumble away, because they were never meant to outlast it.
   ========================================================================== */
const KG_NAMES=['The Ember Harpoon','The Verdigris Harpoon','The Silver Harpoon','The Beacon Harpoon'];
const KG_DESC=[
  'A black iron harpoon, its barbed head glowing the red of a banked fire. It is made for one thing, and it is not men, and it is not wolves. Only the Kraken feels it.',
  'A long bronze harpoon green with the sea, tiny blue runes crawling along the shaft. It is made for one thing: the Kraken. Against everything else it is a stick.',
  'A silver harpoon with a spiral barb like the inside of a shell, giving off a soft white light. It is made to kill one creature in the world, and it hurts nothing else.',
  'A dark steel harpoon inlaid with gold, warm to the hand. The old fleet forged four of these to kill the Kraken, and nothing else. When the Kraken is dead they will not last.'
];
KG_NAMES.forEach((n,i)=>{ITEMDEF['kharp'+(i+1)]={n,k:'weapon',t:'Sword',ic:'kharp'+(i+1),c:['#e8603c','#5ac8a0','#e0f0ff','#e8c850'][i],dmg:[1,3],hit:.2,kraken:[3000,4400],price:0,rar:1,d:KG_DESC[i],sw:.6}});
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('kharp1','kharp2','kharp3','kharp4');
ENEMY_DEF.kraken.aboveParty=20;   // twenty levels above the party: attacking it without the guns is the end of the party
// a Kraken gun in a hero's hand does huge damage to the Kraken, and next to nothing to anything else
(function(){
  const _rd=rollDmg;rollDmg=function(h){const r=_rd.apply(this,arguments);try{const w=heroWeapon(h);G._atkW=w&&w.kraken?w:null}catch(e){G._atkW=null}return r};
  const _he=hurtEnemy;hurtEnemy=function(e,d){
    const w=G._atkW;G._atkW=null;
    if(w&&e&&e.t==='kraken'){d=Math.round(w.kraken[0]+Math.random()*(w.kraken[1]-w.kraken[0]));msg('The harpoon bites deep into the Kraken for '+d+'!','#ffd76a');sfx('crit')}
    return _he.call(this,e,d)};
})();
const kgFound=()=>(G.flags.kgFound||(G.flags.kgFound={}));
const kgCount=()=>Object.keys(kgFound()).length;
vq('kg0','The Kraken Guns','Menkaure, the shipwright',"The Kraken stands between the two coasts of the Narrow Sea, and nothing the party carries can hurt it. The old Crown fleet killed it once with four magical harpoons, the Kraken guns, which were scattered when the fleet burned. Ketra, Sable Maeve, Brother Aldous and Isolde each know where one lies. Find all four. Every hero needs one in hand, and they work on the Kraken and on nothing else.",4,kgCount,{gold:600,xp:12000});
const kgQ=(id,n,who,title,desc,rw)=>vq(id,title,who,desc,1,()=>kgFound()[n]?1:0,rw);
kgQ('kg1',1,'Ketra, the ash-priestess','Smoke on the Red Cliffs',"Ketra says the first Kraken gun, the Ember Harpoon, lies on an altar in the red cliffs of Redcliff, a rock island in the east of the Narrow Sea. Sail there and find it.",{gold:300,xp:4000});
kgQ('kg2',2,'Sable Maeve','The Admiral\'s Flagship',"Sable Maeve says the Admiral\'s flagship ran aground on Kelpgate Rock, in the south-west of the Narrow Sea, with the second Kraken gun, the Verdigris Harpoon, still in her bow. Sail there and find it.",{gold:300,xp:4000});
kgQ('kg3',3,'Brother Aldous','The Chaplain\'s Stones',"Brother Aldous says the fleet\'s chaplain buried the third Kraken gun, the Silver Harpoon, inside the ring of standing stones on the Hollow Isle, in the west of the Narrow Sea. Sail there and find it.",{gold:300,xp:4000});
kgQ('kg4',4,'Isolde','The Beacon Wreck',"Isolde says the fourth Kraken gun, the Beacon Harpoon, went down with the fleet\'s lamp ship in the wreck under Last Light. Put on a Diving Helm each, dive from Last Light, and find it.",{gold:300,xp:4000});
const KGD={
 kg1:khQD("The altar in the Redcliff rocks smelled of smoke even when I was a girl: the old fleet burned something there, and I think it was the first Kraken gun being blessed. The Ember Harpoon. Redcliff is the red rock island in the east of the sea. Look by the altar. I cannot give you more than that, and I would not trust anyone who said they could.","Redcliff, east, red cliffs and an old altar. Find the harpoon and carry it back aboard.",(n,m)=>"Redcliff, in the east of the Narrow Sea. The harpoon is at the altar on the red cliffs.","You have it? The Ember Harpoon?","Fire for the fire. I can feel it from here. Take this for the trouble.","The harpoon is yours, and the Kraken will learn what fire is."),
 kg2:khQD("My Admiral\'s flagship ran aground on Kelpgate Rock when the fleet burned, and the second Kraken gun was lashed in her bow. The Verdigris Harpoon, green as the sea by now. Kelpgate is a hump of kelp-hung rock in the south-west. The ship is still on the rocks, if the sea has left her anything.","Kelpgate Rock, south-west. Look for the wreck on the rocks.",(n,m)=>"Kelpgate Rock, in the south-west of the Narrow Sea. The harpoon is in the wreck of the flagship.","Is that bronze? Green bronze? That is the Verdigris Harpoon.","My Admiral would have wept. I will do it for him. Here, for the trouble.","The harpoon is yours. Make it worth the fleet."),
 kg3:khQD("The fleet\'s chaplain hid the third Kraken gun, the Silver Harpoon, in the ring of standing stones on the Hollow Isle, west of here. A place that safe and that strange could hold anything. Go and look in the stones, and do not stay there after dark.","The Hollow Isle, west. The harpoon is in the ring of stones.",(n,m)=>"The Hollow Isle, in the west of the Narrow Sea. The harpoon is among the standing stones.","The Silver Harpoon. I can hear it. Does it sing to you?","Then it was not lost after all. Take this, with my thanks, and my blessing on the throw.","The harpoon is yours. Go with it."),
 kg4:khQD("I copied the fleet\'s accounts in my first year at court. The fourth Kraken gun, the Beacon Harpoon, was in the lamp ship when she went down off Last Light. The wreck is under the island, below the kelp. You will need a Diving Helm each, and something very large lives in the wreck. Dive, and look for the gold.","Dive from Last Light. The harpoon is in the wreck.",(n,m)=>"The wreck under Last Light, below the kelp. The harpoon glints gold.","The Beacon Harpoon! Whole, after all this time.","The last of the four. I will sleep better knowing the fleet is not all lost. Take this.","The harpoon is yours. The Kraken has not much longer.")
};
repWrap('ci_ketra',()=>G.flags.kgGiven&&qSt('kg1')!=='done','About the Kraken guns',()=>qNode('kg1',KGD.kg1));
repWrap('sb_maeve',()=>G.flags.kgGiven&&qSt('kg2')!=='done','About the Kraken guns',()=>qNode('kg2',KGD.kg2));
repWrap('ib_aldous',()=>G.flags.kgGiven&&qSt('kg3')!=='done','About the Kraken guns',()=>qNode('kg3',KGD.kg3));
repWrap('ll_isolde',()=>G.flags.kgGiven&&qSt('kg4')!=='done','About the Kraken guns',()=>qNode('kg4',KGD.kg4));
/* ---- Menkaure speaks to the party once the whole ledger is theirs ---- */
Object.assign(CUTS,{kgIntro:()=>[
  {text:'The ledger is whole. Menkaure lays all three pages of it on the chart table of the Dawn Walker and puts a brass dividers on the far side of the Narrow Sea, where nothing is drawn but a mark in the old hand: Oldhaven.'},
  {who:'Menkaure',text:'That is where the king sits. That is where your warrant was written, and where it can be torn up. And there, in the middle, is the reason nobody has crossed in a hundred years.'},
  {who:hn(0),text:'The Kraken.'},
  {who:'Menkaure',text:'I have stood on the pier at Yarrim and listened to old sailors tell me it is a story. It is not a story. It is twenty times what any of you has ever fought. If you sail into its water as you are, it will end this party in a round.'},
  {who:hn(1),text:'Then how did anyone ever beat it?'},
  {who:'Menkaure',text:'Once, and only once. The fleet of the old Crown carried four magical harpoons, forged for this and nothing else. The Kraken guns. They bite the Kraken like nothing in the world, and they are no better than sticks against anything else. When the fleet burned, the guns were scattered over this sea.'},
  {who:hn(2),text:'Where?'},
  {who:'Menkaure',text:'I do not know. But four people on these islands do: Ketra on Cinder Isle, Sable Maeve on Saltbarrow, Brother Aldous on the Isle of Bells and Isolde at Last Light. Ask each of them. Then sail, and dive, and dig, and bring me four harpoons. One for each of you. Every hero in your hand, or none of you at the helm.'},
  {text:'Menkaure rolls the chart. Behind him, in the dark of the hold, something long and iron rattles in a crate that will, for now, hold nothing.'}]});
function kgOffer(){
  const F=G.flags;if(!F.page3||F.kgGiven||G.cut||G.talk)return;
  F.kgGiven=1;startCut('kgIntro',()=>{if(qSt('kg0')===null)qAccept('kg0');if(kgCount()>=4&&qReady('kg0'))qTurnIn('kg0');msg('The Kraken guns: ask Ketra, Sable Maeve, Brother Aldous and Isolde where each lies.','#ffe36a')});
}
(function(){const _e=yarEnter;yarEnter=function(n){_e(n);try{if(G.flags.page3&&!G.flags.kgGiven&&(n===SN.ID||emIslandLv(n)))later(900,()=>{if(LEVEL===n)kgOffer()})}catch(e){console.error(e)}}})();
/* ---- the guns themselves: lying where the clues say ---- */
const KG_AT={338:1,337:2,341:3,323:4};   // the level each gun lies in
function kgAlias(){for(let i=1;i<=4;i++){const im=IMG['kh_kgharp_'+(i-1)];if(im){IMG['kg_harp'+i]=im;NPC_H['kg_harp'+i]=1.9*im.height/im.width}}}
function kgPlace(id){
  kgAlias();const L=LEVELS[id],T=TERRS[id];if(!L||!T)return;const n=KG_AT[id],W=L.rows[0].length,H=L.rows.length;
  const taken=new Set((L.decor||[]).map(d=>d.x+','+d.y));
  const want=id===323?[[88,28],[16,28],[88,64]]:null;let spot=null;
  if(want){for(const [wx,wy] of want)for(let r=0;r<10&&!spot;r++)for(let yy=-r;yy<=r&&!spot;yy++)for(let xx=-r;xx<=r&&!spot;xx++){const x=wx+xx,y=wy+yy,i=y*W+x;if(x>3&&y>3&&x<W-4&&y<H-4&&!T.block[i]&&L.rows[y][x]==='.'&&!taken.has(x+','+y))spot=[x,y]}}
  else{const cx=W>>1,cy=(H>>1)-4;for(let q=0;q<400&&!spot;q++){const a=hash2(id,q,801)*TAU,r=hash2(id,q+9,801)*.55*Math.min(W,H)/2,x=Math.round(cx+Math.cos(a)*r*1.2),y=Math.round(cy+Math.sin(a)*r),i=y*W+x;if(x>3&&y>3&&x<W-4&&y<H-4&&!T.block[i]&&L.rows[y][x]==='.'&&T.h[i]>.2&&!taken.has(x+','+y)&&Math.hypot(x-cx,y-(H>>1)-4)>6)spot=[x,y]}}
  if(spot)L.decor.push({k:'kg_harp'+n,x:spot[0],y:spot[1],block:false,walk:true,deco:false,npc:'kg_harp',cat:n});
}
(function(){const _ib=isleBuild;isleBuild=function(id){const had=!!LEVELS[id];_ib.apply(this,arguments);if(!had&&KG_AT[id])kgPlace(id)}})();
(function(){const _ub=uwBuild;uwBuild=function(id){const had=!!LEVELS[id];_ub.apply(this,arguments);if(!had&&KG_AT[id])kgPlace(id)}})();
for(const id in KG_AT)if(LEVELS[id])kgPlace(+id);
khNpc('kg_harp','A Kraken gun','kg_harp1',d=>{
  const F=G.flags,n=d.cat,got=kgFound();
  if(got[n])return say('Nothing is left here. You took the harpoon.',[BYE]);
  if(!bagAdd(mkItem2('kharp'+n,1)))return say('A long iron harpoon lies here, glowing very faintly, but your bag is full. Make room for it.',[BYE]);
  got[n]=1;d.found=true;sfx('key');
  const left=4-kgCount();
  if(!left&&qSt('kg0')==='active'&&qReady('kg0'))qTurnIn('kg0');
  return say(KG_NAMES[n-1]+'. '+KG_DESC[n-1].split('. ')[0]+'. '+(left?left+' of the four still lie out there.':'That is all four. Every hero needs one in hand: equip them, and sail east.'),[BYE])});
/* ---- the guns are not made to outlast the Kraken ---- */
(function(){const _t=seaTick;seaTick=function(dt){_t(dt);const F=G.flags;
  if(F.krakenSlain&&!F.kgGone&&G.state==='play'){F.kgGone=1;let n=0;
    for(const h of G.heroes)for(const k in h.eq){const it=h.eq[k];if(it&&/^kharp[1-4]$/.test(it.id)){delete h.eq[k];n++}}
    for(let i=1;i<=4;i++){const c=bagCount('kharp'+i);if(c){bagRemove('kharp'+i,c);n+=c}}
    try{for(let i=0;i<G.heroes.length;i++)recalcMax(i)}catch(e){}
    if(n)msg('The four harpoons flare white and fall to ash in your hands. They were never meant to outlast the Kraken.','#ffd9a0')}
}})();
/* where each Kraken gun lies, for the quest log's map; the fourth is under Last Light, so its dive line is circled on the island */
for(let n=1;n<=4;n++)QUESTS['kg'+n].spot=()=>{const d=G.decor.find(z=>z.npc==='kg_harp'&&z.cat===n&&!z.found);return d?{x:d.x,y:d.y}:null};
QUESTS.kg4.targets=['uw_dive_303'];
