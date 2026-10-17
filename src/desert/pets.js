/* ==========================================================================
   PETS. Twelve little companions are sold in Kal's Menagerie in Khemetra's Merchants' Quarter and by Kal's stall in Ironhill. Up to three follow the party
   about, always turned to face it (the pictures are straight on), with two frames for walking. Each has a small gift of its own.
   ========================================================================== */
const PETS={
  goat:{n:'Goat',price:80,size:0.62,names:['Biscuit','Gruff','Clover','Thistle','Barnaby','Pip'],perk:'Sniffs out gold hidden in houses, and eats anything. It may settle a bad stomach.',lines:['{n} eats a corner of a map, and looks pleased.','{n} butts a lamp post. The lamp post loses.']},
  llama:{n:'Llama',price:200,size:1.1,names:['Dolores','Lord Fluff','Pachamama','Alpaco'],perk:'Carries ten more things in the bag, and now and then spits in an enemy\'s face and stuns it.',lines:['{n} looks down on everybody, which is easy when you are a llama.','{n} spits at a pebble and misses.']},
  frog:{n:'Frog',price:40,size:0.29,names:['Ribbit','Lilypad','Sir Hops','Gordon'],perk:'Croaks before the weather turns. It will tell you what is coming, and the journal shows the forecast.',lines:['{n} sits on your boot and looks wise.','{n} catches a fly and does not share.']},
  duck:{n:'Duck',price:40,size:0.43,names:['Biscuit','Puddles','The Admiral','Waddles'],perk:'Finds a herb or reagent whenever the party forages, and quacks at thieves in the night.',lines:['{n} waddles in a circle and quacks at nothing.','{n} follows a puddle and stays in it.']},
  cat:{n:'Cat',price:60,size:0.39,names:['Pasha','Mafdet','Sekhmet','Dusty','Shadow','Tiger'],perk:'Luck +1. Wards off thieves, and keeps the rats down.',lines:['{n} sits on the map and refuses to move.','{n} washes a paw and watches the shadows.']},
  dog:{n:'Dog',price:90,size:0.54,names:['Rex','Scout','Bramble','Sandy','Toast','Old Bones'],perk:'Guards the camp: night thieves and ambushes are far less likely. Enemies miss the party 2% more often.',lines:['{n} wags so hard that the whole party wobbles.','{n} barks at a cloud, then at the other cloud.']},
  parrot:{n:'Parrot',price:120,size:0.52,names:['Captain','Polly','Squawk','Jewel'],perk:'Squawks a warning when a guard is near, and repeats a rumour it has overheard every day.',lines:['{n} says something rude that it learned at a tavern.','{n} whistles the tune of every song it has ever heard, all at once.']},
  snake:{n:'Snake',price:100,size:0.44,names:['Sir Hiss','Noodle','Basil','Slither'],perk:'Strikes at the foe in front now and then: that foe is poisoned. Snakes, scorpions and cobras do not frighten it.',lines:['{n} coils round a pole and falls asleep.','{n} flicks its tongue at the air and seems satisfied.']},
  bird:{n:'Songbird',price:60,size:0.38,fly:true,names:['Trill','Wren','Pip','Sky'],perk:'Scouts ahead: the party hits 2% more often, and the bird sometimes drops a shiny coin at your feet.',lines:['{n} lands on your shoulder, then thinks better of it.','{n} sings three notes and looks at you for applause.']},
  rat:{n:'Rat',price:30,size:0.26,names:['Nibbles','Squeak','Crumb','Pocket'],perk:'Scrounges: every day it may turn up a coin or a bit of food. It is very proud of itself.',lines:['{n} carries a cheese rind twice its size.','{n} peers out of your pack and then hides again.']},
  skeleton:{n:'Little Skeleton',price:150,size:0.61,names:['Bones','Rattles','Boney','Mr Skull'],perk:'Rattles bravely at the dark: fright and haunting are far less likely, and armor +1.',lines:['{n} waves a finger bone at you in a friendly way.','{n} does a little rattling dance and falls over.']},
  donkey:{n:'Donkey',price:150,size:0.73,names:['Hapi','Bartholomew','Old Grey','Dobbin','Moses','Basket'],perk:'Carries twelve more things in the bag.',lines:['{n} sighs deeply under the packs.','{n} brays, for no reason anybody understands.']}
};
const PET_IDS=Object.keys(PETS),MAX_PETS=3;
for(const id of PET_IDS)for(const f of [0,1])if(typeof loadImg==='function')loadImg('pet_'+id+'_'+f,'assets/pet_'+id+'_'+f+'.png');
function petsData(){const F=G.flags;return F.pets||(F.pets=[])}
function hasCompanion(id){return petsData().some(p=>p.id===id)}
function companionLuck(){return hasCompanion('cat')?1:0}
function petsApply(){BAGCAP=60+(hasCompanion('donkey')?12:0)+(hasCompanion('llama')?10:0)}
function petPas(key){
  let s=0;
  if(hasCompanion('dog')&&key==='dodge')s+=.02;
  if(hasCompanion('bird')&&key==='hitPct')s+=.02;
  if(hasCompanion('skeleton')&&key==='armor')s+=1;
  return s;
}
function petBuy(id){
  const P=PETS[id];if(hasCompanion(id))return 'You already have one.';if(petsData().length>=MAX_PETS)return 'The party can look after only three animals. Dismiss one in the journal first.';
  if(G.gold<P.price)return `That costs ${P.price} gold.`;
  G.gold-=P.price;const nm=P.names[(hash2(G.clock,petsData().length,9)*P.names.length)|0];petsData().push({id,name:nm});petsApply();sfx('equip');
  msg(`${nm} the ${P.n.toLowerCase()} joins the party.`,'#ffe9a0');return null;
}
function petDismiss(id){const L=petsData(),i=L.findIndex(p=>p.id===id);if(i>=0){const p=L.splice(i,1)[0];petsApply();msg(`${p.name} the ${PETS[id].n.toLowerCase()} goes off to find a better home.`,'#d0c090')}}
/* ---- little scenes, and what each pet does round by round ---- */
function petsTick(){
  if(!petsData().length||G.state!=='play'||G.cut||G.talk||G.menu)return;
  const F=G.flags,pets=petsData();F.petT=(F.petT||0)+1;
  const has=id=>pets.find(p=>p.id===id),day=dayNum(),quiet=LEVEL>=400&&LEVEL<440; // on the Pilgrim’s Path and at the monastery the animals say nothing
  if(!quiet&&F.petT%45===0){const p=pets[(Math.random()*pets.length)|0],L=PETS[p.id].lines;msg(L[(Math.random()*L.length)|0].replace('{n}',p.name+' the '+PETS[p.id].n.toLowerCase()),'#d8d0a0')}
  // the first time each day: rumours from the parrot, scraps from the rat, a forecast from the frog
  if(!quiet&&F.petDay!==day){F.petDay=day;
    const pa=has('parrot');if(pa){msg(`${pa.name} the parrot squawks: "${rumourFor('town').replace('They say: ','')}"`,'#e8d890')}
    const ra=has('rat');if(ra&&Math.random()<.5){if(Math.random()<.5){const g=rnd(3,12);G.gold+=g;msg(`${ra.name} the rat drops ${g} gold at your feet, very pleased with itself.`,'#ffe9a0')}else if(bagAdd(mkItem('bread')))msg(`${ra.name} the rat has found a loaf of bread. Nobody asks where.`,'#e8d890')}
  }
  const fr=has('frog'),blk=Math.floor(G.clock/480);
  if(!quiet&&fr&&F.frogB!==blk&&wxRegionOf(LEVEL)){F.frogB=blk;const w=weatherAhead(1);if(w&&w.id!=='clear')msg(`${fr.name} the frog croaks and stares at the sky. ${w.n} is on its way.`,'#a8d0e8')}
  // the parrot's warning
  const pa2=has('parrot');
  if(pa2&&LEVEL===44&&!afflHas('masked')&&G.rounds-(F.parrotW||-99)>40){
    const P=G.P;for(const w of (LEVELS[44].walkers||[]))if(w.guard&&(w.x-P.x)**2+(w.y-P.y)**2<100){F.parrotW=G.rounds;msg(`${pa2.name} the parrot squawks: "Guard! Guard! Hide the lock picks!"`,'#e8d890');break}
  }
  // the snake and the llama in a fight
  const f=frontEnemy(3);
  if(f&&f.e.hp>0&&!f.e.surr){
    const sn=has('snake'),ll=has('llama');
    if(sn&&f.k===1&&Math.random()<.16){msg(`${sn.name} the snake lunges at the ${mxName(f.e)}!`,'#a0e8a0');mxApplyEnemy(0,f.e,['poison',6,3],null)}
    else if(ll&&Math.random()<.12){msg(`${ll.name} the llama spits in the ${mxName(f.e)}'s face!`,'#e8e0b0');mxApplyEnemy(0,f.e,['hold',1],null)}
  }
}
function petEnter(n){
  const pets=petsData();
  const goat=pets.find(p=>p.id==='goat'),dog=pets.find(p=>p.id==='dog'),bird=pets.find(p=>p.id==='bird');
  const nose=goat||dog;
  if(nose&&typeof KH_GOLD!=='undefined'&&KH_GOLD[n]&&!G.flags['kg'+n])later(500,()=>msg(`${nose.name} the ${PETS[nose.id].n.toLowerCase()} ${nose.id==='goat'?'paws at a corner of the room and bleats at a loose stone':'sniffs the floor and whines at a corner'}. There is something here.`,'#ffe9a0'));
  if(bird&&!(n>=400&&n<440)&&Math.random()<.12&&LEVELS[n]&&LEVELS[n].outdoor){const g=rnd(3,12);later(600,()=>{G.gold+=g;msg(`${bird.name} the songbird drops a shiny coin at your feet. ${g} gold.`,'#ffe9a0')})}
}
/* the duck adds to a forage */
function petForage(){
  const du=petsData().find(p=>p.id==='duck');if(!du||Math.random()>.65)return;
  const id=['herb','wildflower','nightshade'][(Math.random()*3)|0];if(bagAdd(mkItem2(id,1)))msg(`${du.name} the duck waddles off and comes back with a ${ITEMDEF[id].n.toLowerCase()}.`,'#a8d898');
}
/* ---------------------------------------------------------------- following the party ---------------------------------------------------------------- */
function petFollow(dt){
  const pets=petsData();if(!pets.length||!G.P||!G.heroes)return;
  const P=G.P,S=G._pf||(G._pf={trail:[],pos:[],lx:P.x,ly:P.y,lvl:LEVEL});
  if(S.lvl!==LEVEL){S.trail=[];S.pos=[];S.lvl=LEVEL;S.lx=P.x;S.ly=P.y}
  if(P.x!==S.lx||P.y!==S.ly){S.trail.unshift([S.lx,S.ly]);if(S.trail.length>14)S.trail.pop();S.lx=P.x;S.ly=P.y}
  const back=DIRS[(P.f+2)%4];
  pets.forEach((p,i)=>{
    let tgt=S.trail[Math.min(S.trail.length-1,i*2+1)];if(!tgt)tgt=[P.x+back[0]*(1+i*.6),P.y+back[1]*(1+i*.6)];
    let q=S.pos[i];if(!q){q=S.pos[i]={x:tgt[0],y:tgt[1],f:0,t:0};if(!S.trail.length){q.x=P.x+back[0]*.9;q.y=P.y+back[1]*.9}}
    const dx=tgt[0]-q.x,dy=tgt[1]-q.y,d=Math.hypot(dx,dy),k=Math.min(1,dt*5.5);
    q.x+=dx*k;q.y+=dy*k;q.moving=d>.07;q.t+=dt;
    if(q.moving)q.f=((q.t*6)|0)&1;else q.f=0;
  });
}
const PET_STUB={};
/* the animals stay below deck on the open sea and out of the water when the party dives: they are only seen on land */
const petsAtSea=()=>(typeof SN!=='undefined'&&LEVEL===SN.ID)||(typeof UW!=='undefined'&&!!UW[LEVEL]);
function petSprites(out){
  const pets=petsData(),S=G._pf;if(!pets.length||!S||petsAtSea())return;
  pets.forEach((p,i)=>{
    const q=S.pos[i];if(!q)return;const P=PETS[p.id],img=IMG['pet_'+p.id+'_'+q.f]||IMG['pet_'+p.id+'_0'];if(!img)return;
    const stub=PET_STUB[p.id]||(PET_STUB[p.id]={walk:true,k:'pet_'+p.id});
    const bob=P.fly?.42+Math.sin(G.time*5+i)*.06+(q.moving?Math.sin(G.time*18)*.03:0):(q.moving?Math.abs(Math.sin(G.time*12+i))*.04:0);
    out.push({x:q.x+.5,y:q.y+.5,img,w:P.size*img.width/img.height,bob,decor:stub});
  });
}
/* ---------------------------------------------------------------- the shop ---------------------------------------------------------------- */
function openPetShop(){G.talk=null;G.menu='petshop';G.psmsg=''}
function drawPetShop(){
  BTNS=[];veil(.72);bigPanel(14,6,452,308);
  txt("KAL'S MENAGERIE",240,22,13,'#d8c88e','center',true);txt(`Gold: ${G.gold}`,452,22,9,'#ffe36a','right',true);
  const mine=petsData();
  txt(`Your animals (${mine.length} of ${MAX_PETS}): ${mine.map(p=>p.name+' the '+PETS[p.id].n.toLowerCase()).join(', ')||'none yet'}`,24,36,8,'#c8bc98','left',false,undefined,300);
  if(G.psmsg)txt(G.psmsg,452,36,8,'#e8a070','right',true,undefined,150);
  PET_IDS.forEach((id,k)=>{
    const P=PETS[id],x=22+(k%2)*220,y=46+Math.floor(k/2)*42,own=hasCompanion(id),im=IMG['pet_'+id+'_'+(((G.time*3)|0)&1)]||IMG['pet_'+id+'_0'];
    ctx.save();rrect(ctx,x,y,214,39,5);ctx.fillStyle=own?'rgba(30,50,24,.92)':'rgba(40,18,14,.92)';ctx.fill();ctx.lineWidth=1.3;ctx.strokeStyle=own?'#7ac060':'#a88a48';ctx.stroke();ctx.restore();
    ctx.fillStyle='#120c08';ctx.fillRect(x+4,y+3,33,33);if(im)ctx.drawImage(im,x+5,y+4,31,31);
    txt(P.n,x+42,y+9,9,'#ecdca8','left',true,undefined,100);
    wrapText(P.perk,124,5.9).slice(0,4).forEach((l,q)=>txt(l,x+42,y+17+q*5.8,5.9,'#b8aa88','left'));
    if(own)txt('YOURS',x+208,y+9,7.5,'#9ae0a0','right',true);
    else btnText('psb_'+id,`Buy ${P.price}g`,x+172,y+3,38,16);
  });
  btnText('psexit','Leave',190,298,100,16);
}
function petShopBtn(id){
  if(id==='psexit'){G.menu=false;return}
  const m=/^psb_(.+)$/.exec(id);if(m){G.psmsg=petBuy(m[1])||''}
}
khNpc('pet_trader','Kal, the animal trader','kh_npc5_2',d=>say('Animals! Goats and llamas, frogs and ducks, cats and dogs, parrots, snakes and songbirds, and one very small skeleton. All house-trained, mostly. Take up to three, and they will follow you anywhere.',[['Show me the animals.',()=>{openPetShop();return null}],['Why would I want one?',()=>say('A goat finds hidden gold. A llama and a donkey carry your loot. A parrot warns you about guards, a frog about the weather. A snake bites for you, a dog guards the camp, and the skeleton... well. He is very brave, for a skeleton.',[['Show me the animals.',()=>{openPetShop();return null}],BYE])],BYE]));
journalPage({id:'pets',title:'Companions',
  summary:()=>{const p=petsData();return p.length?p.map(x=>`${x.name} the ${PETS[x.id].n.toLowerCase()}`).join(', ')+'. Up to three follow you.':'No companion yet. Kal\'s Menagerie in Khemetra\'s Merchants\' Quarter, and Kal\'s stall in Ironhill, sell twelve kinds.'},
  note:()=>0,
  draw(){
    jFrame('Companions');
    const mine=petsData();
    txt(`Up to ${MAX_PETS} animals follow the party. ${mine.length} now. Buy more at Kal's Menagerie (Khemetra, Merchants' Quarter) or Kal's stall in Ironhill.`,40,42,8,'#a89878','left',false,undefined,400);
    if(!mine.length)txt('The party has no animals yet.',240,150,10,'#8a7a60','center');
    mine.forEach((p,k)=>{
      const P=PETS[p.id],y=54+k*76,im=IMG['pet_'+p.id+'_'+(((G.time*3)|0)&1)]||IMG['pet_'+p.id+'_0'];
      ctx.save();rrect(ctx,36,y,408,70,5);ctx.fillStyle='rgba(34,40,22,.92)';ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle='#7ac060';ctx.stroke();ctx.restore();
      ctx.fillStyle='#120c08';ctx.fillRect(44,y+6,58,58);if(im)ctx.drawImage(im,45,y+7,56,56);ctx.strokeStyle='#7a6440';ctx.strokeRect(44,y+6,58,58);
      txt(`${p.name} the ${P.n}`,112,y+13,12,'#ffe9a0','left',true);
      wrapText(P.perk,250,8.4).slice(0,3).forEach((l,q)=>txt(l,112,y+29+q*10.4,8.4,'#c8bc98','left'));
      btnText('pd_'+p.id,'Dismiss',386,y+22,52,20);
    });
    if(petsData().some(p=>p.id==='frog')){const w=weatherAhead(1),w2=weatherAhead(2);txt(`The frog says: next ${w?w.n:'-'}, then ${w2?w2.n:'-'}.`,40,286,8.5,'#a8d0e8','left')}
  },
  click(id){const m=/^pd_(.+)$/.exec(id);if(m)petDismiss(m[1])}
});
