/* ==========================================================================
   PET SHOPS OF THE FOUR CITIES (Exsce, Ulb, Glorm, Nibb). Each city has a pet-seller near its first plaza who sells little versions of the creatures of the Hollow
   Grasslands, and of its giants. They are ordinary companions (pets.js: up to three follow the party) with the same shop screen; each gives a small gift of its own.
   Their pictures are the creature pictures already in the game (pet_<id>_0 and _1 are aliases of them). Names start with HGP.
   ========================================================================== */
const HGP={ // id: [name, picture, price, size (height in cells), perk text, passives {key:amount}, bag, giant?]
  hgpinkbulb:['Pink bulb','hgtb_pinkbulb',70,.30,'Glows when trouble is near: enemies miss the party 2% more often.',{dodge:.02}],
  hglilacmoth:['Lilac moth','hgtb_lilacmoth',80,.34,'Flutters ahead and shows where to strike: the party hits 2% more often.',{hitPct:.02},0,0,true],
  hglanternbeetle:['Lantern beetle','hgtb_lanternbeetle',90,.30,'Its lit shell turns blows aside: armor +1.',{armor:1}],
  hgpearlslug:['Pearl slug','hgtb_pearlslug',70,.24,'A hard pearly shell: armor +1.',{armor:1}],
  hgjadefinmoth:['Jade fin-moth','hgtb_jadefinmoth',110,.34,'Finds the weak spot and the safe step: hits +1.5% and misses on you +1%.',{hitPct:.015,dodge:.01},0,0,true],
  hgspindleray:['Spindle ray','hgtb_spindleray',100,.32,'Drifts between the party and the blow: enemies miss 2% more often.',{dodge:.02},0,0,true],
  hgamberpup:['Amber shell-pup','hgtb_amberpup',90,.28,'Guards the camp. Enemies miss the party 2% more often.',{dodge:.02}],
  hgfishbeetle:['Fish beetle','hgtb_fishbeetle',100,.34,'Carries eight more things in the bag.',{},8],
  hgcreamjelly:['Cream jelly','hgtb_creamjelly',140,.34,'Its soft light closes small wounds, a little every round.',{regen:.25},0,0,true],
  hgjadeeel:['Jade lantern-eel','hgtb_jadeeel',120,.30,'Lights the blade: all damage +3%.',{dmgPct:.03}],
  hgfishfly:['Fish fly','hgtb_fishfly',80,.34,'Scouts ahead: the party hits 2% more often.',{hitPct:.02},0,0,true],
  hgcreammoth:['Cream moth','hgtb_creammoth',90,.28,'Leads the party to dropped coins: gold from fights +5%.',{goldPct:.05},0,0,true],
  hgpups:['Shell pups','hgtb_pups',120,.28,'A loud pair of guards: enemies miss the party 3% more often.',{dodge:.03}],
  hgspindlespider:['Spindle spider','hgtb_spindlespider',110,.32,'Bites the foe in front now and then: all damage +3%.',{dmgPct:.03}],
  // little versions of the giants
  hgstiltchick:['Stilt-walker chick','hgtb_stilt_head',380,.60,'A long-necked chick that sees far: the party hits 3% more often and enemies miss 1% more.',{hitPct:.03,dodge:.01},0,1],
  hgbulkcub:['Little bulk giant','hgtb_bulk_face_amber',420,.40,'A small, patient giant. It stands in front of blows: armor +2 and all damage +3%.',{armor:2,dmgPct:.03},0,1],
  hgpeachick:['Peacock chick','hgtb_peacockfan',360,.40,'Fans out in good company: gold from fights +8% and enemies miss 1% more.',{goldPct:.08,dodge:.01},0,1],
  hgwhalecalf:['Bulb-whale calf','hgtb_aquawhale',400,.46,'Floats beside the party and carries fourteen more things. Wounds close a little each round.',{regen:.2},14,1]
};
const HGP_IDS=Object.keys(HGP);
// what each seller has: eight animals, one or two giants among them
const HGP_STOCK={
  481:['hgpinkbulb','hglanternbeetle','hgamberpup','hgcreammoth','hgfishfly','hgspindleray','hgstiltchick','hgpeachick'],
  482:['hgpearlslug','hglilacmoth','hgcreamjelly','hgjadeeel','hgfishbeetle','hgjadefinmoth','hgbulkcub','hgwhalecalf'],
  483:['hgpups','hgamberpup','hgspindlespider','hglanternbeetle','hgcreamjelly','hgpinkbulb','hgbulkcub','hgstiltchick'],
  484:['hgjadefinmoth','hgfishfly','hgspindleray','hgcreammoth','hgjadeeel','hgpups','hgpeachick','hgwhalecalf']};
const HGP_SELLER={481:['hgt_petshop481','Quibb, the pet-seller','hg_npc2'],482:['hgt_petshop482','Ressa, the moth-keeper','hg_npc3'],483:['hgt_petshop483','Drum, the pup-breeder','hg_npc4'],484:['hgt_petshop484','Ooma, the lantern-pet seller','hg_npc1']};
for(const id of HGP_IDS){const [n,pic,price,size,perk,pas,bag,giant,fly]=HGP[id];
  PETS[id]={n,price,size,fly:!!fly,names:HGP_NAMES(id,n),perk,lines:['{n} bobs along behind the party and looks about.','{n} settles close to your boot for a moment.'],hgp:true}}
function HGP_NAMES(id,n){const L={hgpinkbulb:['Blip','Rosy','Plum'],hglilacmoth:['Lilac','Dusk','Flutter'],hglanternbeetle:['Glim','Ember','Wick'],hgpearlslug:['Pearl','Dew','Slick'],hgjadefinmoth:['Jade','Fin','Fennel'],hgspindleray:['Spindle','Reed','Drift'],hgamberpup:['Amber','Honey','Biscuit'],hgfishbeetle:['Scale','Net','Gill'],hgcreamjelly:['Custard','Cream','Milk'],hgjadeeel:['Lantern','Sprout','Moss'],hgfishfly:['Zip','Skim','Whirr'],hgcreammoth:['Cream','Dot','Powder'],hgpups:['Pip and Pop','Twin','Both'],hgspindlespider:['Thread','Silk','Spinner'],hgstiltchick:['Stilts','Long','Reach'],hgbulkcub:['Little Mound','Lump','Gentle'],hgpeachick:['Fan','Plume','Jewel'],hgwhalecalf:['Bubble','Little Bulb','Drift']};return L[id]||[n]}
// the pictures: pet_<id>_0 and _1 are the creature picture itself (the pets draw at their own size)
function hgpAlias(){for(const id of HGP_IDS){const im=IMG[HGP[id][1]];if(im&&!IMG['pet_'+id+'_0']){IMG['pet_'+id+'_0']=im;IMG['pet_'+id+'_1']=im}}}
{const _ps=petSprites;petSprites=function(out){try{hgpAlias()}catch(e){}return _ps.apply(this,arguments)}}
{const _dp=drawPetShop;drawPetShop=function(){try{hgpAlias()}catch(e){}return _dp.apply(this,arguments)}}
// the gifts
{const _pp=petPas;petPas=function(key){let s=_pp.apply(this,arguments);for(const p of petsData()){const h=HGP[p.id];if(h&&h[5][key])s+=h[5][key]}return s}}
{const _pa=petsApply;petsApply=function(){_pa.apply(this,arguments);let b=0;for(const p of petsData()){const h=HGP[p.id];if(h&&h[6])b+=h[6]}if(b)BAGCAP+=b}}
/* the sellers: each stands a few steps from the first plaza of the city, with a couple of animals on the ground beside them */
const HGP_ANIMALS={481:['hgtb_amberpup','hgtb_pinkbulb'],482:['hgtb_pearlslug','hgtb_creamjelly'],483:['hgtb_pups','hgtb_lanternbeetle'],484:['hgtb_fishfly','hgtb_creammoth']};
for(const n in HGP_SELLER){const [id,name,img]=HGP_SELLER[n];
  khNpc(id,name,img,d=>{const l=typeof hgLvl==='function'?hgLvl():4,hello='Little ones for the road. Each one has a gift.';
    return hgAskAdd(say(name.split(',')[0]+' lifts a cloth from a row of baskets. "'+(l<4?hgGarble(hello,l):hello)+'"'+(l<4?hgFoot(l):''),[['See the animals.',()=>{openPetShop(HGP_STOCK[n],'THE PET SHOP');return null}],['Leave.',()=>null]]))})}
function hgpPlace(){
  const n=LEVEL;if(!(n>=481&&n<=484))return;const L=LEVELS[n];if(!L||L._hgpDone||!L.terrace||!L.decor)return;L._hgpDone=1;
  const W=L.rows[0].length,h=L.terrace.h,occ=new Set(L.decor.map(d=>Math.floor(d.x)+','+Math.floor(d.y)));
  const stt=L.start||{x:W>>1,y:L.rows.length>>1},folk=L.decor.filter(d=>d.npc);
  const flatAt=(x,y)=>{if(x<2||y<2||x>=W-2||y>=L.rows.length-2||L.rows[y][x]!=='.'||occ.has(x+','+y)||Math.hypot(x-stt.x,y-stt.y)<3||folk.some(d=>Math.hypot(d.x-x,d.y-y)<3))return false;if(typeof hgtnBlocked==='function'&&hgtnBlocked(L,x,y))return false;
    for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+ax,ny=y+ay;if(L.rows[ny][nx]!=='.'||Math.abs(h[ny*W+nx]-h[y*W+x])>.01)return false}return true};
  const st=L.start||{x:W>>1,y:L.rows.length>>1},sx=Math.round(st.x)+(n===481?0:3),sy=Math.round(st.y)+(n===481?-6:3);let best=null;
  for(let r=0;r<22&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r&&!best;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(flatAt(sx+dx,sy+dy))best=[sx+dx,sy+dy]}
  if(!best)return;const add=[{k:HGP_SELLER[n][2],x:best[0],y:best[1],block:false,walk:true,npc:HGP_SELLER[n][0],sc:1}];
  HGP_ANIMALS[n].forEach((k,i)=>{for(const [dx,dy] of i?[[1,0],[0,1],[-1,1]]:[[-1,0],[0,-1],[1,1]]){const x=best[0]+dx,y=best[1]+dy;if(flatAt(x,y)){occ.add(x+','+y);add.push({k,x,y,block:false,walk:true,sc:.5+.1*i,bob:0});break}}});
  for(const d of add){L.decor.push(d)}if(G.decor&&G.decor!==L.decor)for(const d of add)G.decor.push(d);if(typeof buildDecorMap==='function')buildDecorMap();L._hgpAt=best}
{const _u3=update;update=function(dt){try{if(G.state==='play')hgpPlace()}catch(e){console.error('hgp',e)}return _u3.apply(this,arguments)}}
