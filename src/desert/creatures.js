/* ==========================================================================
   THE SAND ROAD: the creatures of the desert and the tomb (their pictures and their stats)
   ========================================================================== */
Object.assign(ENEMY_DEF,{
  scorpion:{name:'Giant Scorpion',hp:40,dmg:[6,11],hit:.74,w:.95,img:'scorpion',xp:120,gold:[2,8],speed:1,verb:'stings'},
  dwolf:{name:'Desert Wolf',hp:36,dmg:[4,8],hit:.74,w:1.3,img:'dwolf',xp:70,gold:[0,0],speed:2,verb:'bites'},
  nomad:{name:'Desperate Nomad',hp:44,dmg:[5,9],hit:.72,w:.38,img:'nomad',xp:90,gold:[6,22],speed:1,verb:'slashes'},
  nomad2:{name:'Desperate Nomad',hp:44,dmg:[5,9],hit:.72,w:.38,img:'nomad2',xp:90,gold:[6,22],speed:1,verb:'slashes'},
  vulture:{name:'Carrion Vulture',hp:34,dmg:[5,9],hit:.74,w:1.0,img:'vulture',xp:90,gold:[0,0],speed:2,fly:true,verb:'rakes'},
  mummy:{name:'Mummy',hp:45,dmg:[6,10],hit:.76,w:.36,img:'mummy',xp:150,gold:[10,30],speed:1,verb:'claws'},
  sut:{name:'Sut, Lord of the Red Desert',hp:110,dmg:[8,13],hit:.82,w:.78,img:'sut',xp:5000,gold:[800,1200],speed:1,verb:'smites',ranged:3,shot:'a bolt of red fire',boss:true}});

const DS_OL='#2a1808';
// the painted pictures made for the desert creatures (see tools/ingest_art.py)
const DESERT_ART=['dcity','scorpion','scorpionA','mummy','mummyA','sut','sutA','nomad','nomadA','nomad2','nomad2A','sarcoph','sarcophU'];
function makeDesertCreatures(){} // nothing is drawn by code: creatures are painted art
function makeDesertWolf(){ // creatures made from the painted art the game already has (needs the pictures to have loaded)
  const sand=im=>im?mkCanvas(im.width,im.height,(x,w,h)=>{x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(196,134,62,.42)';x.fillRect(0,0,w,h);x.globalCompositeOperation='multiply';x.fillStyle='rgb(238,214,170)';x.fillRect(0,0,w,h);x.globalCompositeOperation='destination-in';x.drawImage(im,0,0)}):null;
  if(IMG.wolf){IMG.dwolf=sand(IMG.wolf);if(IMG.wolfA)IMG.dwolfA=sand(IMG.wolfA)}
  // the nomads: the painted bandit, recoloured into dusty desert robes, with sand clinging to the hem
  if(IMG.bandit&&!IMG.nomad){IMG.nomad=pToneMap(IMG.bandit,[34,24,16],[232,204,150],3.4,.8,.7);IMG.nomad2=pFlip(IMG.nomad);if(IMG.banditA){IMG.nomadA=pToneMap(IMG.banditA,[34,24,16],[232,204,150],3.4,.8,.7);IMG.nomad2A=pFlip(IMG.nomadA)}}
  if(IMG.sut)IMG.dsutstatue=pToneMap(IMG.sut,[40,34,26],[196,176,138],1.6,.9,0); // a great stone Sut for the throne room
}
