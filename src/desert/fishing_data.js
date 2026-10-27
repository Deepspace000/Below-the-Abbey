/* ==========================================================================
   FISHING: THE DATA (prefix fsh / FSH). Five rods and thirty fish, as ordinary items. The rules are in fishing.js.
   A rod gives the chance that a fish is landed once the line game was won: 20, 32, 45, 58 and 70 percent.
   The Simple Rod (300 gold) is stocked by the general merchants (Thornwick, Ironhill, Greendale, Wenlock, Khemetra and the traders of the Hollow).
   The better rods are added to the same shops as the party's level rises (see fsh_openLoot in fishing.js).
   The fish icons are the painted fish of the freshwater pack (assets/ds_fw_*, ds_hgtb_fish_*, ds_hgf*), cropped, and recoloured for the kinds that share a picture.
   The rod icons are drawn in code (there is no painted rod yet).
   ========================================================================== */
const FSH_RODS=[ // [id, name, chance (percent), price, party level at which shops start to sell it, shaft colour, description]
  ['fishrod_1','Simple Rod',20,300,0,'#9a7a4a','A plain hazel pole with a cord, a cork bobber and a bent pin for a hook. A fish is landed 20 percent of the time after a good pull.'],
  ['fishrod_2','Hazel Rod',32,800,5,'#7a8a4a','A springy, well-seasoned rod with a brass reel. A fish is landed 32 percent of the time after a good pull.'],
  ['fishrod_3','Yew Rod',45,1800,15,'#a86a3a','A rod of yew with a steady tip and a waxed line. A fish is landed 45 percent of the time after a good pull.'],
  ['fishrod_4','Steel-Tipped Rod',58,4200,25,'#8a98aa','A long rod with a steel tip and silk line, made for big water. A fish is landed 58 percent of the time after a good pull.'],
  ['fishrod_5',"Master Angler's Rod",70,8000,35,'#d8b84a','A gilded rod, light as a feather and strong as a chain. A fish is landed 70 percent of the time after a good pull.']];
const FSH_TIERS=[ // [name, colour, weight in a catch, hunger range label]
  ['Common','#d8d0b8',60],['Uncommon','#8ad88a',24],['Rare','#7ab8f0',10],['Very rare','#d8a0f0',4],['Legendary','#ffd76a',1.6]];
/* [id, name, tier, picture, hue turn (degrees), saturation, brightness, hunger, percent of max health, price, text] */
const FSH_FISH=[
  ['fish_minnow','Minnow',0,'fw_minnows',0,1,1,14,3,4,'A tiny silver fish that swims in shoals. Small, but it is food.','fd'],
  ['fish_bleak','Bleak',0,'hgtb_fish_glassfish',20,.5,1.05,16,3,4,'A thin, bright fish that skims the top of the water.','f'],
  ['fish_roach','Roach',0,'fw_bream',0,.35,1.3,18,3,5,'A silver fish with red fins, common in every slow river.','f'],
  ['fish_gudgeon','Gudgeon',0,'fw_tench',20,.7,1.45,18,4,5,'A small, spotted bottom fish with a little beard at the mouth.','f'],
  ['fish_rudd','Rudd',0,'fw_goldfish',-8,.55,.85,20,4,6,'A golden-bronze fish with red fins that feeds near the reeds.','f'],
  ['fish_stickleback','Stickleback',0,'hgtb_fish_neon',150,.4,.95,16,3,4,'A prickly little fish. There is not much on it, but it is quick to cook.','fsd'],
  ['fish_perch','Perch',0,'fw_perch',0,1,1,24,5,7,'A striped fish with a spiny back fin and sweet white meat.','f'],
  ['fish_bream','Bream',0,'fw_bream',0,1,1,26,5,8,'A deep, flat, bronze fish that feeds on the bottom of slow water.','f'],
  ['fish_tench','Tench',0,'fw_tench',0,1,1,26,6,8,'A thick green fish of muddy ponds, slimy but filling.','fd'],
  ['fish_crucian','Crucian Carp',0,'fw_carp',25,.9,1.2,28,6,9,'A small, round, golden carp from still ponds.','f'],
  ['fish_trout','Brown Trout',1,'fw_trout',0,1,1,34,8,16,'A speckled fish of fast, clear water, with firm pink flesh.','f'],
  ['fish_chub','Chub',1,'fw_carp',-20,.7,.9,34,8,16,'A heavy-headed river fish that takes almost any bait.','f'],
  ['fish_dace','Dace',1,'fw_bream',60,.4,1.4,32,8,15,'A quick, slim, silver fish of the upper river.','f'],
  ['fish_grayling','Grayling',1,'fw_trout',55,.7,1.2,36,9,18,'A silver fish with a tall, sail-like back fin.','f'],
  ['fish_eel','River Eel',1,'hgtb_fish_eel',0,1,1,38,10,20,'A long, muscular fish that slides through the mud. It is rich and oily.','fsd'],
  ['fish_flounder','Flounder',1,'hgtb_fish_flounder',0,1,1,36,9,18,'A flat fish with both eyes on one side, found near river mouths.','fs'],
  ['fish_crayfish','River Crayfish',1,'hgfcrayfish',0,1,1,38,10,22,'A small freshwater lobster with sweet tail meat.','fd'],
  ['fish_pike','Pike',1,'fw_pike',0,1,1,42,11,24,'A long, green, toothy hunter of the weeds, with firm white meat.','f'],
  ['fish_salmon','Salmon',2,'fw_trout',-60,1.1,1.15,56,16,48,'A strong silver fish with rich pink flesh, caught as it swims upstream.','fs'],
  ['fish_wels','Wels Catfish',2,'hgfcatfish',0,1,1,62,17,56,'A huge, whiskered, scaleless fish that lies in deep holes.','fd'],
  ['fish_ray','River Ray',2,'hgtb_fish_pearlray',0,1,.95,58,16,52,'A flat, pale fish with a long tail that glides along the bottom.','fsd'],
  ['fish_angelfish','Striped Angelfish',2,'hgtb_fish_angel',0,1,1,52,15,46,'A tall, thin fish with long fins and gold and white stripes.','fs'],
  ['fish_sturgeon','Sturgeon',2,'fw_pike',30,.5,.8,66,18,64,'An ancient fish with bony plates on its back and fine, dark meat.','fs'],
  ['fish_piranha','Red Piranha',2,'hgfpiranha',0,1,1,60,16,54,'A deep-bellied fish with a mouth of sharp teeth. Handle it with care.','fd'],
  ['fish_goldencarp','Golden Carp',3,'fw_carp',-20,1.8,1.25,76,22,150,'A carp with scales the colour of old gold. It is rare and very good eating.','f'],
  ['fish_anglerfish','Lantern Angler',3,'hgtb_fish_lanternfish',0,1,1,80,24,170,'A dark fish with a glowing lure that hangs over its mouth.','sd'],
  ['fish_leafdragon','Leaf Dragon',3,'hgtb_fish_seadragon',0,1,1,72,21,160,'A strange fish covered in leaf-shaped fins like floating weed.','sd'],
  ['fish_pufferfish','Pearl Pufferfish',3,'hgtb_fish_puffer',0,1,1,78,23,180,'A round, pale, spiny fish that swells when it is afraid.','sd'],
  ['fish_moonpike','Moonscale Pike',4,'fw_pike',150,1.1,1.5,100,32,500,'A huge pike with silver-blue scales that shine in moonlight.','fsd'],
  ['fish_embercarp','Emberscale Koi',4,'fw_goldfish',10,1.6,1.15,100,35,600,'A bright orange koi with scales like glowing coals. It is said to be lucky.','f'],['fish_sardine','Sardine',0,'hgtb_fish_glassfish',0,.6,1.15,16,3,4,'A small, oily silver sea fish that swims in huge shoals.','s'],
  ['fish_herring','Herring',0,'fw_bream',0,.25,1.5,20,4,6,'A slim silver sea fish that travels in great shoals.','s'],
  ['fish_sandgoby','Sand Goby',0,'fw_tench',20,.7,1.45,18,4,5,'A small, spotted fish that hides in the sand of the shore.','s'],
  ['fish_mackerel','Mackerel',1,'fw_trout',120,.8,.9,32,8,15,'A fast, striped sea fish with oily flesh.','s'],
  ['fish_plaice','Plaice',1,'hgtb_fish_flounder',-25,1.7,1.05,36,9,18,'A flat sea fish with orange spots on its back.','s'],
  ['fish_seabream','Sea Bream',1,'fw_bream',200,.9,1.2,34,9,17,'A deep, silver-pink fish of rocky shores.','s'],
  ['fish_cod','Cod',2,'fw_carp',60,.5,.95,60,17,52,'A big, heavy sea fish with thick white flesh and a chin whisker.','s'],
  ['fish_seabass','Sea Bass',2,'fw_perch',0,.2,1.45,56,16,50,'A strong silver fish of the surf, with firm, sweet meat.','s'],
  ['fish_swordfish','Swordfish',3,'fw_pike',200,1.1,1.1,80,23,170,'A long, fast sea fish with a flat blade of bone on its nose.','s'],
  ['fish_tuna','Giant Bluefin Tuna',4,'fw_trout',200,1.5,.8,100,34,550,'A huge, dark blue fish as heavy as a man, the pride of every deep-sea fisher.','s']];
for(const [id,n,ch,pr,lv,col,d] of FSH_RODS)ITEMDEF[id]={n,k:'tool',t:'Fishing rod',ic:'fishrod',c:col,stack:0,price:pr,frod:ch,flv:lv,d:d+' Stand at the shore, face a dark patch of water and press G, Space or click the patch.',sw:.4};
for(const [id,n,tier,src,hue,sat,lit,feed,pct,price,txt,hab] of FSH_FISH)ITEMDEF[id]={n,k:'food',t:'Fish',ic:'herring',c:'#9aa4aa',heal:Math.round(pct*2.2),feed,hpct:pct,fdhp:1,fdprx2:1,fish:1,tier,stack:1,price,
  d:FSH_TIERS[tier][0]+' fish. '+txt+' Fills '+feed+' hunger and restores '+pct+' percent of maximum health.',sw:.3};
const FSH_BY_TIER=FSH_TIERS.map((_,t)=>FSH_FISH.filter(f=>f[2]===t));
const FSH_POOL={fresh:FSH_FISH.filter(f=>f[11].includes('f')),salt:FSH_FISH.filter(f=>f[11].includes('s')),deep:FSH_FISH.filter(f=>f[11].includes('d'))}; // the fish of each kind of water
/* ---- baits: one is used per cast; it adds to the chance of landing a fish and pushes the catch towards rarer fish (the bias multiplies the weight of each tier by bias to the power of the tier number) ---- */
const FSH_BAITS=[ // [id, name, price, percent added, rarity bias, water it suits (fresh, salt, any), text, colour, picture]
  ['bait_crumbs','Bread Crumbs',5,3,1.08,'fresh','Stale bread crumbs rolled into a ball.','#c8a060','crumbs'],
  ['bait_worms','Worms',12,6,1.15,'fresh','A pinch of wriggling garden worms.','#c07070','worm'],
  ['bait_maggots','Maggots',30,10,1.25,'fresh','Fat, pale maggots in a little tin. Fish cannot resist them.','#e8e0b0','maggot'],
  ['bait_shrimp','Shrimp Bits',70,14,1.4,'salt','Chopped shrimp in brine, the smell of the sea.','#e8906a','shrimp'],
  ['bait_silver','Silver Lure',180,18,1.7,'any','A silver fish of tin with a hook, bright in any water.','#c8d0dc','lure'],
  ['bait_gold','Golden Lure',400,22,2.1,'any','A fish of real gold leaf with a sharp hook, the best bait there is.','#f0c840','lure']];
for(const [id,n,pr,pct,bias,wt,txt,col] of FSH_BAITS)ITEMDEF[id]={n,k:'quest',t:'Fishing bait',ic:'herb',c:col,stack:1,price:pr,fbait:pct,fbias:bias,fwater:wt,
  d:txt+' One is used each cast. Adds '+pct+' percent to the chance of landing a fish and makes rare fish likelier.'+(wt==='fresh'?' Best in fresh water; half as good in salt water.':wt==='salt'?' Best in salt water; half as good in fresh water.':' Works in any water.'),sw:.1};
/* ---- things that are not fish: an old boot (the existing item), a bottle with a message, and a jewel (a gem from the Collection) ---- */
const FSH_NOTES=[
  'To whoever finds this: the mill at Wenlock is not haunted. The noise is the miller\'s goat. Please tell him to stop feeding it the bells.',
  'I am stuck on a rock in the Narrow Sea with one biscuit and a very rude gull. If you read this, send a boat. Not a small one.',
  'My treasure is under the third flat stone west of the old bridge. I have forgotten which bridge. Good luck.',
  'The monastery on the Pilgrim\'s Path has a hidden stair behind the statue. The monks know. They do not mind. Bring cheese.',
  'Dear Mary, I am sorry about the boat. I will pay for the boat. Please stop writing to my mother.',
  'The best fishing is at dawn, by the reeds, with the wind behind you. Everything else is luck. I have had no luck since spring.',
  'Do not dig by the Oakwood road. I dug there. It was only roots. I want my weekend back.',
  'Gold coins are buried near the Isle of Bells, under the one tree that leans to the east. Take a shovel and a friend.',
  'If you are reading this, you have a good bottle. I want it back. Please post it to the Plough and Pigeon in Wenlock, care of Joss.',
  'A kraken lives under the sea gate. It is not as large as they say. It is larger. Do not look at it.'];
ITEMDEF.fish_bottle={n:'Bottle with a Message',k:'quest',t:'Message',ic:'potion',c:'#a8d8c8',stack:0,price:8,fread:1,d:'A corked green bottle with a rolled note inside. Select it and press Read to open the message.',sw:.3};
function fshBottleIcon(){const c=document.createElement('canvas');c.width=c.height=64;const X=c.getContext('2d');X.lineJoin='round';X.strokeStyle='#120c08';X.lineWidth=2;
  X.fillStyle='rgba(150,215,190,.85)';X.beginPath();X.moveTo(26,22);X.lineTo(26,14);X.lineTo(38,14);X.lineTo(38,22);X.quadraticCurveTo(50,28,50,40);X.lineTo(50,54);X.quadraticCurveTo(50,60,44,60);X.lineTo(20,60);X.quadraticCurveTo(14,60,14,54);X.lineTo(14,40);X.quadraticCurveTo(14,28,26,22);X.closePath();X.fill();X.stroke();
  X.fillStyle='#8a6038';X.fillRect(25,6,14,9);X.strokeRect(25,6,14,9);X.fillStyle='#f0e4c0';X.fillRect(24,32,16,20);X.strokeStyle='#8a7448';X.lineWidth=1;X.strokeRect(24,32,16,20);
  X.strokeStyle='#6a5a3a';for(const y of [37,42,47]){X.beginPath();X.moveTo(27,y);X.lineTo(37,y);X.stroke()}return c}
function fshBaitIcon(kind,col){const c=document.createElement('canvas');c.width=c.height=64;const X=c.getContext('2d');X.lineCap='round';X.lineJoin='round';X.strokeStyle='#120c08';X.lineWidth=2;X.fillStyle=col;
  if(kind==='crumbs'){for(const [x,y,r] of [[22,38,8],[38,34,7],[30,48,6],[44,48,5],[18,50,4],[34,22,5]]){X.beginPath();X.arc(x,y,r,0,6.3);X.fill();X.stroke()}}
  else if(kind==='worm'){X.lineWidth=7;X.strokeStyle='#120c08';for(const [y,a] of [[22,0],[36,1],[50,0]]){X.beginPath();X.moveTo(12,y);X.bezierCurveTo(26,y-12*(a?-1:1),38,y+12*(a?-1:1),52,y);X.stroke()}X.lineWidth=4.5;X.strokeStyle=col;for(const [y,a] of [[22,0],[36,1],[50,0]]){X.beginPath();X.moveTo(12,y);X.bezierCurveTo(26,y-12*(a?-1:1),38,y+12*(a?-1:1),52,y);X.stroke()}}
  else if(kind==='maggot'){for(const [x,y,a] of [[22,26,.5],[40,24,-.4],[30,40,.1],[46,44,.7],[16,48,-.6]]){X.save();X.translate(x,y);X.rotate(a);X.beginPath();X.ellipse(0,0,10,4.5,0,0,6.3);X.fill();X.stroke();X.restore()}}
  else if(kind==='shrimp'){X.lineWidth=2;X.beginPath();X.moveTo(14,40);X.quadraticCurveTo(14,14,40,18);X.quadraticCurveTo(54,22,50,38);X.quadraticCurveTo(44,32,36,32);X.quadraticCurveTo(24,32,26,46);X.quadraticCurveTo(18,50,14,40);X.closePath();X.fill();X.stroke();
    X.beginPath();X.moveTo(50,38);X.lineTo(58,46);X.lineTo(48,46);X.closePath();X.fill();X.stroke()}
  else{X.beginPath();X.moveTo(8,32);X.quadraticCurveTo(26,10,46,28);X.lineTo(58,16);X.lineTo(58,48);X.lineTo(46,36);X.quadraticCurveTo(26,54,8,32);X.closePath();X.fill();X.stroke();X.fillStyle='#120c08';X.beginPath();X.arc(18,30,2.4,0,6.3);X.fill();
    X.strokeStyle='#8a8a92';X.lineWidth=2;X.beginPath();X.moveTo(30,44);X.quadraticCurveTo(34,60,22,60);X.stroke()}
  return c}
/* ---- the pictures ---- */
function fshHue(c,deg,sat,lit){ // turn the hue, scale the saturation and brightness of a canvas, keeping its alpha
  const x=c.getContext('2d'),im=x.getImageData(0,0,c.width,c.height),p=im.data,a=deg*Math.PI/180,co=Math.cos(a),si=Math.sin(a);
  const m=[.213+co*.787-si*.213,.715-co*.715-si*.715,.072-co*.072+si*.928,.213-co*.213+si*.143,.715+co*.285+si*.140,.072-co*.072-si*.283,.213-co*.213-si*.787,.715-co*.715+si*.715,.072+co*.928+si*.072];
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;let r=p[i],g=p[i+1],b=p[i+2];
    const l=r*.3+g*.59+b*.11;r=l+(r-l)*sat;g=l+(g-l)*sat;b=l+(b-l)*sat;
    const R=r*m[0]+g*m[1]+b*m[2],G2=r*m[3]+g*m[4]+b*m[5],B=r*m[6]+g*m[7]+b*m[8];
    p[i]=Math.max(0,Math.min(255,R*lit));p[i+1]=Math.max(0,Math.min(255,G2*lit));p[i+2]=Math.max(0,Math.min(255,B*lit))}
  x.putImageData(im,0,0)}
function fshCrop(im,size){ // the picture cropped to what is drawn, fitted into a square canvas
  const w=im.width,h=im.height,t=document.createElement('canvas');t.width=w;t.height=h;const tx=t.getContext('2d');tx.drawImage(im,0,0);
  const d=tx.getImageData(0,0,w,h).data;let x0=w,y0=h,x1=0,y1=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>24){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<x0)return null;const cw=x1-x0+1,ch=y1-y0+1,s=Math.min((size-4)/cw,(size-4)/ch),c=document.createElement('canvas');c.width=c.height=size;
  const X=c.getContext('2d');X.imageSmoothingQuality='high';X.drawImage(im,x0,y0,cw,ch,(size-cw*s)/2,(size-ch*s)/2,cw*s,ch*s);return c}
function fshRodIcon(col){
  const c=document.createElement('canvas');c.width=c.height=64;const X=c.getContext('2d');X.lineCap='round';
  X.strokeStyle='#120c08';X.lineWidth=5;X.beginPath();X.moveTo(8,58);X.quadraticCurveTo(34,30,58,6);X.stroke();
  X.strokeStyle=col;X.lineWidth=3;X.beginPath();X.moveTo(8,58);X.quadraticCurveTo(34,30,58,6);X.stroke();
  X.strokeStyle='#5a3a1a';X.lineWidth=5.5;X.beginPath();X.moveTo(8,58);X.lineTo(19,47);X.stroke();                       // the handle
  X.fillStyle='#8a8a92';X.strokeStyle='#120c08';X.lineWidth=1.4;X.beginPath();X.arc(24,46,5.5,0,6.3);X.fill();X.stroke();   // the reel
  X.strokeStyle='rgba(235,235,225,.85)';X.lineWidth=1;X.beginPath();X.moveTo(58,6);X.quadraticCurveTo(61,34,56,50);X.stroke(); // the line
  X.fillStyle='#d84030';X.beginPath();X.arc(56,52,4.2,0,6.3);X.fill();X.fillStyle='#f4f0e4';X.beginPath();X.arc(56,52,4.2,Math.PI,6.3);X.fill();X.strokeStyle='#120c08';X.lineWidth=1.2;X.beginPath();X.arc(56,52,4.2,0,6.3);X.stroke();
  return c}
function fshIcons(){
  let todo=0;
  for(const [id,,,col] of FSH_RODS.map(r=>[r[0],0,0,r[5]])){if(IMG['ic_'+id]&&IMG['ic_'+id]._fsh&&IMG['icn_'+id]&&IMG['icn_'+id]._fsh&&IMG['it_'+id]&&IMG['it_'+id]._fsh)continue;const c=fshRodIcon(col);c._fsh=1;IMG['icn_'+id]=c;IMG['ic_'+id]=c;IMG['it_'+id]=c}
  {const set=(id,mk)=>{if(IMG['ic_'+id]&&IMG['ic_'+id]._fsh&&IMG['icn_'+id]&&IMG['icn_'+id]._fsh&&IMG['it_'+id]&&IMG['it_'+id]._fsh)return;const c=mk();c._fsh=1;IMG['icn_'+id]=c;IMG['ic_'+id]=c;IMG['it_'+id]=c};
    set('fish_bottle',fshBottleIcon);for(const b of FSH_BAITS)set(b[0],()=>fshBaitIcon(b[8],b[7]))}
  for(const f of FSH_FISH){const id=f[0];if(IMG['ic_'+id]&&IMG['ic_'+id]._fsh&&IMG['icn_'+id]&&IMG['icn_'+id]._fsh&&IMG['it_'+id]&&IMG['it_'+id]._fsh)continue;
    const src=IMG['art_'+f[3]+(/^fw_/.test(f[3])?'_0':'')];if(!src||!src.width){todo++;continue}
    try{const c=fshCrop(src,64);if(!c){todo++;continue}if(f[4]||f[5]!==1||f[6]!==1)fshHue(c,f[4],f[5],f[6]);c._fsh=1;IMG['icn_'+id]=c;IMG['ic_'+id]=c;IMG['it_'+id]=c}catch(e){todo++}}
  return todo}
{fshIcons();const t=setInterval(()=>{if(fshIcons()===0)clearInterval(t)},700);setTimeout(()=>clearInterval(t),180000)}
/* the fish icon in the code-drawn fallback (until the painted fish has loaded): the salt herring */
/* ---- what the shops sell: the Simple Rod everywhere the general stock is used ---- */
SHOP_STOCK.push(['fishrod_1',2]);MERCHANT_STOCK.push(['fishrod_1',2]);
if(typeof KH_STOCK!=='undefined'){for(const k of ['general','trader','seagoods','wli_general']){const f=KH_STOCK[k];if(f)KH_STOCK[k]=()=>f().concat([['fishrod_1',3]])}}
