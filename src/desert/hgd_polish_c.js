/* ==========================================================================
   THE MAZE TOWNS, POLISHED (prefix hgdpc / HGDPC). Patches the BUILT Deeper Hollow after every other builder has run (it is the last file in tools/inject.py ORDER):
   - proportions: the little boy picture (hg_npc2) had no height and was drawn 1.7 high; every person now stands at one scale (a frog about 0.95, a child 0.8, the wizard 1.0), people in a town no longer share one picture where it can be helped
   - every NPC of the towns and enclaves gets its own words (the warning line, the rumour, the greeting), a unique line per person
   - signs with real text at every shop and church, a signpost with true distances, a notice board with local gossip in every town
   - a hand-built vignette in every town and every enclave (lamps, props, a note that tells a short story), too-dense identical props thinned, stacked props separated, props that blocked a one-square corridor moved
   Cosmetic decor only: quest objects, shops, people's cells and chests that quests use stay where they are.
   ========================================================================== */
const HGDPC={cur:null,done:false,stats:{}};
/* ---------- round 3: the honeycomb wall. The wall picture 'hg_wax' never existed, so the whole Honeycomb Reach was a flat beige slab; it is painted here in code (a tileable lattice of waxed hexagons, some capped, some empty) ---------- */
(function(){try{if(typeof IMG==='undefined'||IMG.hg_wax)return;const S=128,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');
  const r=S/6,hh=S/4,rx=r,ry=hh/1.7320508*1.0;const H=(a,b,k)=>hgdpcH(a,b,k);
  x.fillStyle='#6b4310';x.fillRect(0,0,S,S);
  const cell=(cx,cy,i,j)=>{const v=H(i,j,1),kind=v<.18?2:v<.5?1:0;
    x.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;const px=cx+Math.cos(a)*r*.93,py=cy+Math.sin(a)*(hh/2)/.8660254*.93;x[k?'lineTo':'moveTo'](px,py)}x.closePath();
    const g=x.createRadialGradient(cx-r*.25,cy-r*.3,1,cx,cy,r);
    if(kind===2){g.addColorStop(0,'#2b1708');g.addColorStop(.7,'#4a2a0c');g.addColorStop(1,'#7a4c16')}
    else if(kind===1){g.addColorStop(0,'#f0c765');g.addColorStop(.6,'#d9962f');g.addColorStop(1,'#a8661c')}
    else{const t=.85+v*.4;g.addColorStop(0,'rgb('+Math.min(255,226*t|0)+','+Math.min(255,170*t|0)+','+(70*t|0)+')');g.addColorStop(.65,'rgb('+(200*t|0)+','+(138*t|0)+','+(48*t|0)+')');g.addColorStop(1,'rgb('+(150*t|0)+','+(94*t|0)+','+(28*t|0)+')')}
    x.fillStyle=g;x.fill();x.lineWidth=3.2;x.strokeStyle='#5a360c';x.stroke();x.lineWidth=1.2;x.strokeStyle='rgba(255,226,150,.55)';x.save();x.clip();x.translate(-.8,-.9);x.stroke();x.restore();
    if(kind===1){x.fillStyle='rgba(255,236,170,.35)';x.beginPath();x.ellipse(cx-r*.22,cy-ry*.35,r*.35,ry*.18,-.4,0,6.3);x.fill()}};
  for(let ox=-S;ox<=S;ox+=S)for(let oy=-S;oy<=S;oy+=S)for(let i=-1;i<5;i++)for(let j=-1;j<5;j++){const cx=ox+i*1.5*r+r*.5+0,cy=oy+j*hh+(i%2?hh/2:0)+hh*.5;if(cx<-r*2||cx>S+r*2||cy<-hh||cy>S+hh)continue;cell(cx,cy,((i%4)+4)%4+(ox?7:0)*0,((j%4)+4)%4)}
  const d=x.getImageData(0,0,S,S),px=d.data;for(let i=0;i<px.length;i+=4){const n=(hgdpcH(i>>2&127,i>>9,3)-.5)*14;px[i]+=n;px[i+1]+=n*.8;px[i+2]+=n*.5}x.putImageData(d,0,0);
  IMG.hg_wax=c}catch(e){console.error('hgdpc wax wall',e)}})();
/* the hedge walls of the Hedge Maze were so dark a green that Hedgefoot read as black; one lighter copy of the picture is made before the maze is built */
function hgdpcBrighten(){if(HGDPC.bright||typeof IMG==='undefined')return;let n=0;
  for(const [k,f] of [['lushwall','brightness(1.4) saturate(1.1)'],['art_tex_wall_lapis','brightness(1.35) saturate(1.05)']]){const b=IMG[k];if(!b||!b.width)continue;const c=document.createElement('canvas');c.width=b.width;c.height=b.height;const x=c.getContext('2d');try{x.filter=f}catch(e){}x.drawImage(b,0,0);try{x.filter='none'}catch(e){}IMG[k]=c;n++}
  if(n)HGDPC.bright=1}
{const _b0=hgdBuild;hgdBuild=function(){try{hgdpcBrighten()}catch(e){console.error('hgdpc bright',e)}return _b0.apply(this,arguments)}}
/* ---------- proportions: one scale for people ---------- */
if(NPC_H.hg_npc2===undefined)NPC_H.hg_npc2=1.0; // the boy picture: width follows its own height now (it was drawn 1.7 high)
const HGDPC_PIC={hg_npc0:.98,hg_npc1:.9,hg_npc3:.95,hg_npc4:1.0,hg_npc5:.95,hg_npc6:.95,hg_wizard:1.0,hg_npc2:.8}; // wanted height in squares, by picture
for(const [k,h] of Object.entries({wm_noticeboard:.95,wm_signpost:1.25,wm_crate:.5,wm_barrel:.58,wm_barrel_tall:.8,wm_bucket:.36,wm_bookshelf:1.8,wm_bell:.95,wm_brazier:1.05,wm_statue:1.7,wm_mine_cart:.7,wm_cage_lantern:.5,wm_lantern_gold:.8,wm_lantern_hang:.9,yar_tent:1.1}))if(NPC_H[k]===undefined)NPC_H[k]=h;
/* ---------- the words ---------- */
const HGDPC_TOWN=['Hedgefoot','Cairnhold','Combwick','Nacre Landing','Dunewell','Blue Lantern','Tessera','Gildmere'];
const HGDPC_NEWS=[ // six rumours a town: the quest giver, the grocer, three villagers, the rest
 ['The hedge is trimmed on the first of every month. It is trimmed again on the second, because the first went badly.','Our grocer weighs everything twice. Once for you, and once for the slugs.','The shears on the gate are older than the town. Nobody is brave enough to sharpen them.','Every spring we hold a hedge-cutting contest. Last year\'s winner is still somewhere in the middle of the entry.','The children here learn to read leaves. A wet leaf, curled down, means a slug came by.','If the hedge hums, step back. If it hums a tune, step back faster.'],
 ['We build with what the maze gives us, and the maze gives us rock. We are not complaining. We are very, very sturdy.','The cairn in the square gets one new stone for every traveller we lose. It has been a slow year, mostly.','Cairnhold folk do not argue. We simply put a stone on it and wait.','A stonemason here carved a perfect door once. It was in the wrong wall. We keep it for the memory.','The stone is cold at night and warm at noon, and the whole town grumbles at both.','Do not lean on the north wall of the square. It has opinions.'],
 ['Combwick runs on honey. Honey for bread, honey for medicine, honey for the hinges.','The beekeepers say the queen is well. The queen has not said anything to anyone in years.','If your boots are sticky, do not worry. Everyone\'s boots are sticky. It is only the town.','The Honey Feast is the best night of the year. We eat until we cannot stand, then sing sitting down.','My cousin fell in the honey press. He came out very sweet and very quiet.','Wax candles last, and honey never spoils. We have a jar older than the first signpost.'],
 ['Nacre Landing was a shell once, so the story goes, and the maze grew round it. We still keep the shell polished.','The tide is a rumour here. Everyone swears they heard it. Nobody has seen water come in.','Pearls grow in the wall if you wait long enough. Most people do not wait long enough.','The ferryman talks about the black sea like it owes him money.','Never throw a coin in the fountain unless you mean the wish. It collects.','My grandmother said the shell galleries sing at midnight. I stay in at midnight.'],
 ['The well in Dunewell is forty fathoms deep and we do not know who dug it. We only know who is thirsty.','Water is gold here. Gold, by the way, is also gold. We have tested it.','The wind carries sand through the corridors. We sweep every morning and every afternoon, and it is always the same sand.','My uncle swears he found a pond in the dunes once. He has not found his way back, but he swears.','Dates, dry bread and a very long memory. That is how Dunewell eats.','Sandstone remembers who walked on it. Do not ask it about me.'],
 ['In Blue Lantern the lamps are lit by hand, one at a time. It takes three people all night, and then it is morning.','Our lamplighter says the blue ones burn longer. Our other lamplighter says that is nonsense. They are not speaking.','If a lamp goes out, a worm is near. If two go out, run.','The blue light is good for sleeping. Bad for reading. Excellent for pretending you have read.','We keep a lamp lit for everyone who has not come home. It is a very bright street.','The cook says soup tastes better in blue light. The cook is wrong. The cook is also right.'],
 ['Tessera is a mosaic that happens to have people in it. We do our best not to be in the pattern.','Each tile in the square was laid by a different hand. Two of them were laid by the same drunk.','The big mosaic was smashed by something large. We want the shards back, and a few words with the large thing.','You can tell the tile-trader by the knees. He has been kneeling since spring.','Blue tiles for luck, red for argument, white for the cat. I do not make the rules.','A gap in the floor is a gap in the story. Mind the gaps.'],
 ['Gildmere is not as rich as it looks. The gold is leaf, and the leaf is thin, and the roof leaks anyway.','The Gilder says gold is only a colour that people agreed on. He says this while selling it.','We polish the statue every morning. It does not thank us. It is a statue.','There is a story that the first gilder painted the sun. It came out very well, but it will not come down.','The ember warden is polite and very hot. Do not shake hands.','If it glitters, someone is selling it. If it does not glitter, someone is selling that too.']];
const HGDPC_VILL=[ // by villager id (three a town): the line each one says in place of the old stock lines
 'I have lived in Hedgefoot all my life. That is a lie. I have lived in one corner of it, and I refuse to visit the others.','Everyone says the maze is huge. I say it is just badly signposted.','My shears are my best friend. They are also my only friend. Mind the shears.',
 'I carry a stone in my pocket for luck. It is a very heavy stone and I have terrible luck. I am starting to see the connection.','A cairn is a great thing to sit by. Quiet, sturdy, and it never asks how your day was.','Cairnhold has no mayor. We tried one. He kept making speeches and we put a stone on him. A small one.',
 'I make candles. People say they are too sweet. I say they are not sweet enough and I keep adding honey.','Bees are very polite. They only sting you if you are rude or if you are me.','I once sold a jar of honey to a traveller and he never came back for the lid. I keep the lid.',
 'I came here for the shells. I stayed for the quiet. The quiet turned out to be the shells.','The pearls in the wall are not pearls. I have been told this three times and I still check every morning.','If you hear singing in the galleries, do not sing back. They take it as an invitation.',
 'I walked a very long way to get to Dunewell, and it turns out I walked a very long way to get thirsty.','The well-keeper lets me draw one bucket a day. I draw it very slowly, to make it last.','I carry sand in my boots as a reminder of home. I am not from here. The sand is.',
 'I am the lamplighter. Do not ask me about the other lamplighter. I will not stop.','Blue lamps make everyone look ill. It is very good for business at the apothecary.','I keep a lamp lit in my window all night. It does not attract the slugs. It attracts the moths, which is worse.',
 'I lay tiles. I am told I lay them crooked. I say that is called style.','A mosaic is just a lot of small mistakes that agree with each other.','I found a shard in my soup last week. I am not sure which of us was more surprised.',
 'I came to Gildmere to get rich. I am now very good at polishing the people who already are.','Gold leaf comes off on the fingers. I am the richest man in town after a handshake.','They say the ember warden is a friend. I say he is a friend I do not stand near.'];
const HGDPC_VNAME_FIX={};
const HGDPC_REST=['Sit a while. The benches here have held many tired people, and they are still smug about it.','I have walked three quarters of the maze and slept in four of them. I recommend this one.','This is the only quiet spot I have found. If you hear someone coming, it is me, making more tea.','There is a door ahead that wants a key. I have been staring at it for a week. It has not blinked.','The towns sell keys and some shops sell gems. They are not cheap. Everyone says that, and everyone is right.','I rest here because the lamp is warm and the corridor is not. That is my whole philosophy.'];
const HGDPC_RESTNAME=['Wanderer Aldous','Sister Pim, resting','Old Cobb the tea-maker','Maren Quickfoot','Tolliver the mapless','Hester Bellwether'];
const HGDPC_WARN=['Keep clear of $Z. Nobody comes back from there with the same number of boots.','The signs around $Z are not decoration. Believe the signs.','If you hear squelching toward $Z, it is not the soup.','I would not go near $Z with a lamp, a sword or a good attitude.','They say $Z is not so bad. They said it before they went in.','Stay clear of $Z. It is quiet there, and quiet is how it starts.',
 'My cousin went into $Z for a short cut. We still have the short.','Something in $Z keeps a very tidy larder, and we would rather not be in it.','$Z is where the walls start listening back.','Pack bandages for $Z, and then pack more bandages.','There is a draught from $Z that smells of old cellars and new regrets.','Never whistle near $Z. It whistles back.',
 'The ground near $Z is warm in the wrong places.','People who like $Z are not usually around to say so.','Even the slugs go round $Z, and the slugs fear nothing.','Go to $Z only with a very good reason and a faster friend.','I heard something laughing in $Z, and it was not a happy laugh.','Do not follow the footprints into $Z. They only go one way.',
 '$Z has eaten better adventurers than you, and politely asked for more.','Take a rope to $Z, and leave one end with someone you trust.','If $Z looks empty, it is only being polite.','A lamp burns lower near $Z, which should tell you something.','The last thing I sent to $Z was a coin. It never rang.','Chalk an arrow on every corner of $Z, and trust the arrows over your feet.',
 'Rest well before $Z, because you will not get to rest in it.','We bar the shutters at night against $Z, and the shutters hold. Mostly.','I have never met anyone who came back from $Z and wanted to talk about it.','There are two ways out of $Z. I have only heard of one.','$Z is never as dark as it feels. It is darker.','I leave a candle burning for anyone heading into $Z. I run out quickly.',
 'Whatever you hunt in $Z, it hunts you back, only closer.','They sell maps of $Z in the market. The maps are blank, and honest.','The old folk call $Z the hungry corner, and they are not wrong.','Walk softly near $Z. The floor is thin and the dark below it is hungry.','We never send our children toward $Z, only our enemies.','If your shadow lags behind you near $Z, keep walking and do not look back.',
 'Listen for dripping near $Z. When it stops, run.','I once saw a lantern go into $Z by itself. It came back a different colour.','Bring a friend to $Z, and bring a second friend for the first one.','You can smell $Z before you see it. Trust your nose over your map.','Three lamps in a row mean safe. Three lamps in a row near $Z mean somebody is lying.','Mind the loose stones near $Z. They are loose on purpose.',
 'The air near $Z tastes of old pennies.','Do not drink from the puddles near $Z. They drink back.',
 'The walls near $Z are warm, and walls should not be warm.','I would take the long way round $Z, and the long way has a long way of its own.','Anything that follows you out of $Z is not a friend, and that includes the draught.','There is a smell of bread near $Z, and no bakery for miles.','Do not count the footsteps behind you near $Z. There are too many.','They paved the road to $Z with good intentions and bad luck.','If a stranger offers you a short cut to $Z, give him your shortest answer.','The rats leave $Z at dusk and come back at dawn with opinions.','My dog goes anywhere with me, except $Z. He has standards.','A single candle burning at $Z is a signal. Nobody here knows for what.','Ask the guard about $Z. Watch his hands, not his mouth.','Whoever drew the map of $Z never came back for the corrections.','In $Z the corridors argue with each other, and you lose.','The bridge at $Z holds one traveller at a time and not a boot more.','I would not shout in $Z. The echo might be somebody else.','Carry salt to $Z and use it sparingly.','The moss near $Z grows backwards, toward the dark.','Pray before $Z, and then pray at it.','Wear your boots near $Z, even in bed.','It is bad luck to name $Z after sundown, so I will say it fast and not again.'];
const HGDPC_GREET=['Welcome, traveller.','Well met.','Come in, come in.']; // fallback starters
const HGDPC_OPEN={ // one opener per shop kind and town, in town order
 arms:['Sharp day for it, traveller.','Stone and steel, that is all I deal in.','Careful, the blades are sticky today.','Mind the pearls on the hilts, they bite.','Dry work, smithing. Come in out of the dust.','Hold still while I size you up.','Every blade here was tested on a tile.','Do not breathe on the gilt, it flakes.'],
 armour:['Try the green, it fits the hedge.','Heavy stuff here, so lift with your knees.','Do not mind the bees, they come with the mail.','Shell plate, fresh from the polishing.','Armour for a dry road. It rattles less in sand.','Blue plate for blue lamps, ask the lamplighter.','Every plate here was a tile once, believe it or not.','Gold plate looks fine until the first fight.'],
 magic:['A little sage, a little shade, step in.','Whisper. The stones are listening.','Sweet charms and stronger spells, in that order.','The tide told me you were coming.','Water spells cost extra here, for obvious reasons.','Hold still, the lamps are reading you.','Colours and cantrips, pick any.','Shiny things, serious spells.'],
 trader:['Looking for rope? You have found it.','Stone and string, I keep both.','Fresh wax, fresh wicks, fresh opinions.','Salt air, salt fish, salt of the earth.','Sand in every bag, free of charge.','Chalk for the walls, lamps for the dark.','Bits and bobs in a thousand colours.','Everything here has been polished, even the receipts.'],
 inn:['Wipe your feet and your webbing.','Come in out of the stone, friend.','The beds are warm and so is the honey.','A shell for a bed and a bell to wake you.','The cellar is cool and the soup is not.','Light the lamp by the door when you leave.','Sleep on a tile, wake on a tile, it is very flat.','Rooms by the night, gilded on request.']};
const HGDPC_CHEND=['Do you need healing, or a prayer?','Is it healing you need, or a quiet word?','Healing, or a prayer, or both?','Shall I mend you, or shall we pray first?','Do you come for healing, or for the quiet?','Are you hurt, or only weary?','A prayer or a plaster, which will it be?','Shall we light a candle, or patch you up?'];
const HGDPC_CSIGN=['Healing and mending for a small gift.','Candles, herbs and a bench for the weary.','Bring a coin for the bell and a friend for the pew.','The door is open and the font is full.','Whoever is hurt may come in, whoever is tired may stay.','Light a lamp on your way in, and take one out.','A tile of thanks for every wound mended.','Ring once, and someone will come.'];
const HGDPC_PCLOSE=['The hedge will tell you the rest, if you ask it nicely.','Stones do not move, but the corridors do, so walk with patience.','Follow the honey and you will not go far wrong, only sticky.','If the road forks, take the one with fewer snails.','Water is rarer than gold, so carry both.','Keep the lamps on your left and your wits on your right.','Count the tiles, lose the count, start again.','Bright roads are not always safe roads.'];
const HGDPC_TAG={ // the sign and the greeting of each shop, a different line in each town
 arms:['Shears sold as shears, swords sold as swords. Please do not confuse the two.','Stone-ground edges that outlast the stone.','Wax-polished blades. They slide out clean and slide in cleaner.','Pearl-handled and slug-tested.','Dry steel, never a speck of rust. We have no water to rust it.','Blades that flash blue by lamplight. Very good for morale.','Every edge set like a tile: true, flat and level.','Gilded hilts, honest edges.'],
 armour:['Hedge-green plate. Hard to spot and hard to hit.','Heavy as a cairn, and nearly as hard to knock over.','Honeycomb mail: light, strong and faintly sticky.','Shell plate, polished daily by someone who should be doing something else.','Sand-hardened leather for people who like walking out alive.','Blue-steel helms. Dents mended free, bad dents for a small fee.','Plate with a mosaic trim. Dying in style is still dying, so please do not.','Gold-leaf cuirasses. Not for the thrifty, not for the slug.'],
 magic:['Scrolls, rings and a little hedge sage. Ask me nothing about the sage.','Cold stone charms. They hum when someone lies to you.','Honey draughts and sweet charms. Stir well, drink slowly.','Tide charms and pearl rings. Mind the pearls, they watch.','Dust of the old dunes in little jars. It is mostly dust.','Blue-lamp charms, brightest in the dark and bad at everything else.','Glass-bead charms, a different colour for each problem.','Gilded rings and gilded staves. Gold outside, magic inside.'],
 trader:['Rope, torches and bread. Slugs not included.','Chalk, rope and one good strong lantern.','Comb honey, candles and spare wicks.','Salt, kelp and dry socks. You will want the socks.','Water skins, dates and sand boots.','Lamp oil by the pint, wicks by the yard.','Tile glue, nails and a great deal of string.','Fine bread, fine cheese, fine prices.'],
 inn:['Clean beds, warm soup and a hedge to hide behind.','Stone walls a yard thick. Nothing comes through, including the noise.','Honey on the porridge, honey on the pillow, honey on the cat.','Beds shaped like shells. Please do not curl up in one and get carried off.','The coolest cellar in the maze, and the only cool thing in Dunewell.','A lamp in every window and a bed beneath every lamp.','Mosaic headboards. Count the tiles till you fall asleep.','Gilded beds, plain porridge.'],
 general:['Everything for the road into the maze.','Chalk marks cost extra. Getting lost costs more.','The honey is free if you buy the bread.','Salted, dried and shelled, all of it.','Water is by the cup. Do not ask for a second cup.','Open until the last lamp goes out, which is never.','Anything you need, and some things you do not.','Gold only. And it must be real gold, we check.']};
const HGDPC_CHURCH=['The roof is a hedge, and it leaks only in spring.','A stone stands by the door for every one the maze kept.','The candles are beeswax and the sermons are short.','The font is a shell the size of a bath. Please do not use it as one.','We pray for rain. We have for forty years, and we are patient.','The light never goes out, and neither does the priest.','Every tile in the floor is a prayer. Please do not stand on the loud ones.','Gold on the altar, patches on the roof. The gold is not for sale.'];
const HGDPC_KIND_ROLE={arms:'Weaponsmith',armour:'Armourer',magic:'Magic Seller',trader:'General Trader',inn:'Inn',general:'General Goods',church:'Church'};
/* ---------- who says what ---------- */
const hgdpcL=()=>LEVELS[HGD.ID];
function hgdpcTownOf(d){ // town index (0..7) and enclave index of a person
  const m=/^hgd_(?:s2_[a-z]+|church|shop|q)(\d+)$/.exec(d.npc||'');if(m&&!/^hgd_q/.test(d.npc))return {t:+m[1]};
  const L=hgdpcL();if(!L||!L._hgdp)return {t:0};let b=null,bd=1e9;
  for(const z of L._hgdp.zones){if(z.type!=='safe')continue;const dd=Math.hypot(z.x-d.x,z.y-d.y);if(dd<bd){bd=dd;b=z}}
  return b?{t:b.town,z:b}:{t:0}}
function hgdpcRole(d){const n=d.npc||'';if(/^hgd_q\d/.test(n))return 0;if(/^hgd_shop\d/.test(n))return 1;const v=/^hgd_vill(\d+)$/.exec(n);if(v)return 2+(+v[1]%3);return 5}
function hgdpcWarn(d,salt){const L=hgdpcL();let z=null,bd=1e9;if(L&&L._hgdp)for(const q of L._hgdp.zones){if(q.type!=='danger')continue;const dd=Math.hypot(q.x-d.x,q.y-d.y);if(dd<bd){bd=dd;z=q}}
  const nm=z?z.name:'the danger zones';let h=0;for(const c of (d.npc||'')+salt)h=(h*31+c.charCodeAt(0))|0;const wi=d._wi!==undefined?d._wi:Math.abs(h);return HGDPC_WARN[wi%HGDPC_WARN.length].replace('$Z',nm)}
function hgdpcText(plain,d){
  if(!d||!d.npc)return plain;const n=d.npc;if(!/^hgd_(q|shop|vill|rest|s2_|fw|diver|cinder)/.test(n))return plain;
  const T=hgdpcTownOf(d),t=T.t===undefined?0:T.t;
  for(const w of HGDP_WARN)if(plain.includes(w)){plain=plain.replace(w,hgdpcWarn(d,'a'));break}
  if(HGDP_GOSS.includes(plain.trim())){ // the "Anything else?" answer: this town's rumour for this person
    if(/^hgd_rest(\d+)$/.test(n))return HGDPC_REST[(+/(\d+)$/.exec(n)[1]+3)%6];
    return HGDPC_NEWS[t%8][hgdpcRole(d)]}
  for(let i=0;i<HGDP_REST.length;i++)if(plain.includes(HGDP_REST[i])){const k=+(/(\d+)$/.exec(n)||[0,0])[1];plain=plain.replace(HGDP_REST[i],HGDPC_REST[k%6]);break}
  const v=/^hgd_vill(\d+)$/.exec(n);if(v&&typeof HGDF_VLINES!=='undefined')for(const l of HGDF_VLINES)if(plain.includes(l)){plain=plain.replace(l,HGDPC_VILL[+v[1]%24]);break}
  const s=/^hgd_s2_([a-z]+)(\d)$/.exec(n);if(s&&HGDPC_TAG[s[1]]){const K=HGDS2_KINDS.find(k=>k.id===s[1]);if(K&&plain.includes(K.greet))plain=plain.replace(K.greet,((HGDPC_OPEN[s[1]]||HGDPC_GREET)[+s[2]%(HGDPC_OPEN[s[1]]||HGDPC_GREET).length])+' '+HGDPC_TAG[s[1]][+s[2]])}
  return plain}
{const _hn=hgdNode;hgdNode=function(plain,opts,again){try{plain=hgdpcText(plain,HGDPC.cur)}catch(e){console.error('hgdpc text',e)}return _hn.call(this,plain,opts,again)}}
{const _st=startTalk;startTalk=function(d){HGDPC.cur=d;return _st.apply(this,arguments)}}
// the churches speak in say(), not hgdNode: change the greeting of the root
for(let t=0;t<8;t++){const n=NPCS['hgd_church'+t];if(!n)continue;const root=n.root;n.root=function(d){const nd=root.apply(this,arguments);try{if(nd&&nd.text&&/^Welcome to the church/.test(nd.text))nd.text=hgdSay('Welcome to the church of '+HGDPC_TOWN[t]+'. '+HGDPC_CHURCH[t]+' '+HGDPC_CHEND[t])}catch(e){}return nd};if(KH_KEEPERS['hgd_church'+t])KH_KEEPERS['hgd_church'+t].root=n.root}
for(let i=0;i<6;i++){const id='hgd_rest'+i;if(NPCS[id])NPCS[id].name=HGDPC_RESTNAME[i];if(KH_KEEPERS[id])KH_KEEPERS[id].name=HGDPC_RESTNAME[i]}
// wrapped roots must also be visible to the keepers table when they were copied from it
for(const id in NPCS)if(/^hgd_(q\d|shop\d|vill|rest|s2_)/.test(id)&&KH_KEEPERS[id]&&KH_KEEPERS[id].root!==NPCS[id].root)KH_KEEPERS[id].root=NPCS[id].root;
/* ---------- text pages: signs, boards, notes ---------- */
khNpc('hgdpc_text','A sign','noticeboard',d=>say(hgdSay((d&&d.txt)||'The writing has faded.'),[BYE]));
/* ---------- boards, vignettes ---------- */
const HGDPC_BOARD=[ // lost, wanted, notice: one board in every town
 ['Lost: one pair of shears, blue handle. Answers to nothing.','Wanted: someone to tell the hedge it is not a door.','The slugs have been seen on the lower path. They have not been seen leaving.'],
 ['Lost: a small grey stone, very dear to me.','Wanted: a mason who can carve a door that stays where it is put.','The cairn is full. Please leave your stone beside it, not on it.'],
 ['Lost: one jar of honey, dark. The finder may keep half.','Wanted: a beekeeper with a steady hand and a short memory.','The honey press is not a ride.'],
 ['Lost: a pearl, lightly used.','Wanted: someone to row the ferry, and someone to tell them where it goes.','Please stop wishing aloud at the fountain. It gets crowded.'],
 ['Lost: a cup of water. Reward: a cup of water.','Wanted: one honest well-digger. Thirsty ones preferred.','The water ration is unchanged. So is our opinion of it.'],
 ['Lost: a blue lamp, still lit, last seen walking away.','Wanted: a third lamplighter who gets on with the first two.','If your lamp goes out, light it again. Do not wait for us. We are not coming.'],
 ['Lost: tile number 1,204, blue, with a small chip.','Wanted: a steady hand for the big mosaic. Steady, I said.','Please do not step on the loud tiles.'],
 ['Lost: one gold leaf, nearly weightless. It may be on you.','Wanted: a buyer for a very shiny statue.','The ember warden is not for hugging.']];
// pieces: [dx,dy,key,scale,flags]  flags: b = blocks (a statue, a well), l = gives light, c = reward chest, n = the note
const HGDPC_VIG=[
 {title:'The Gardener\'s Rest',text:'Here stands Orrin Hedge, who trimmed the hedge of Hedgefoot for forty years. He was last seen trimming it from the inside. We think he is still at it.',p:[[0,0,'wm_statue',1,'b'],[-2,1,'hgtb_bench',1.1],[2,1,'urn',1],[-2,-1,'hgt_gardenlantern',1,'l'],[2,-1,'hgt_gardenlantern',1,'l'],[0,2,'noticeboard',.9,'n']]},
 {title:'The Bell of the Lost',text:'Ring once for every one the maze has kept. It has been rung 211 times. The rope wore through, so we ring it with a spoon. A scratch beside the bell says: the cairn pays its tithe to whoever kneels at the bell.',p:[[0,0,'wm_bell',1,'b'],[-2,0,'wm_brazier',1,'l'],[2,0,'wm_brazier',1,'l'],[-1,2,'hgtb_bench',1.1],[2,2,'urn',1],[0,-2,'hg_chestwax',1,'c'],[1,2,'noticeboard',.9,'n']]},
 {title:'The Honey Press',text:'Sticky, loud and strictly no tasting. A smaller notice beneath says: whoever tasted is still stuck.',p:[[0,0,'hgtb_stall_orange_pottery',.85],[-2,1,'wm_barrel_tall',1],[2,1,'hg_waxbarrel',1],[-1,2,'hg_jar',1],[2,-1,'hg_jar',.9],[-2,-1,'hl_p_candle',1,'l'],[0,2,'noticeboard',.9,'n']]},
 {title:'The Pearl Fountain',text:'Throw one coin for luck. The keeper collects on Thursdays, whatever day it is.',p:[[0,0,'hgtb_deco_fountain',.95,'b'],[-2,1,'hgtb_bench',1.1],[2,1,'hgtb_bench',1.1],[-2,-1,'hgtb_deco_lanterns',.75,'l'],[1,-2,'hgt_pearlbush',1],[0,2,'noticeboard',.9,'n']]},
 {title:'The Old Well',text:'Forty fathoms deep. Do not drop anything you want back, and do not drop anything you do not. A mark by the stones says: look below the second crate.',p:[[0,0,'well',1,'b'],[-1,1,'wm_bucket',1],[-2,0,'wm_barrel',1],[2,0,'hg_jar',1],[2,2,'sacks',1],[0,-2,'hg_chestwax',1,'c'],[0,2,'noticeboard',.9,'n']]},
 {title:'The Lamplighters\' Post',text:'Two lamplighters, one ladder and forty years of disagreement. The ladder is winning.',p:[[0,0,'hgt_lamppost',.8,'bl'],[-2,1,'wm_lantern_gold',1,'l'],[2,1,'hgtb_lantern',.9,'l'],[-2,-1,'wm_crate',1],[2,-1,'hgtb_bench',1.1],[0,2,'noticeboard',.9,'n']]},
 {title:'The Mosaic Corner',text:'The great mosaic was smashed on this spot. The tile-trader has the pieces he can find. He is looking for the rest, and for whatever did it.',p:[[0,0,'hgtb_table',1],[-1,1,'hgtb_chair',1],[1,1,'hgtb_chair',1],[2,-1,'vase0',1],[-2,-1,'hgtb_deco_banner',.8],[2,2,'hgtb_bench',1.1],[0,-2,'noticeboard',.9,'n']]},
 {title:'The Gilder\'s Bench',text:'Everything here is gold leaf. Please do not lick it. The Gilder has had complaints. A bead of gold behind the bench is a gift, if you are quick.',p:[[0,0,'hgtb_stall_rose_lanterns',.85],[-2,1,'hgtb_bench',1.1],[2,1,'urn',1],[-2,-1,'wm_lantern_gold',1,'l'],[2,-1,'hgtb_deco_banner',.8],[0,-2,'hg_chestwax',1,'c'],[0,2,'noticeboard',.9,'n']]}];
const HGDPC_ENC=[ // the ten enclaves, in zone order
 {title:'Silence Notice',text:'Silence is kept in this room by order of the Warden. Anyone caught whispering will be shushed by the clock.',p:[[0,0,'hgtb_furn_table_chairs',1],[2,0,'hgtb_furn_clock',.65],[-2,0,'hl_p_candle',1,'l'],[0,2,'urn',1],[-2,2,'noticeboard',.9,'n']]},
 {title:'The Lamplighter\'s Plaque',text:'Tuck the Lamplighter lit these lamps himself, one a night, to see how long the dark would let him. It is still letting him.',p:[[0,0,'hgt_lamppost',.8,'bl'],[3,0,'hgt_lamppost',.8,'bl'],[1,1,'hgtb_bench',1.1],[-1,-1,'hgt_hanglamp',1,'l'],[1,3,'noticeboard',.9,'n']]},
 {title:'A Frog\'s Warning',text:'The water is clean and the frogs are rude. Please do not ask the frogs for directions. They will give them.',p:[[0,0,'hgt_fountain',1,'b'],[-2,1,'hgtb_bench',1.1],[2,-1,'hgt_reeds',.8],[2,2,'hgt_pearlbush',1],[-2,-2,'hgt_reeds',.7],[0,3,'noticeboard',.9,'n']]},
 {title:'Reading Room Rules',text:'Most of the books here are about the maze. One is about cheese. The cheese one is the most worn.',p:[[0,0,'wm_bookshelf',.95],[-2,0,'hgtb_furn_bookshelf',.8],[2,0,'hg_lectern',1],[0,2,'hgtb_furn_books_globe',1],[2,2,'hl_p_candle',1,'l'],[-2,2,'noticeboard',.9,'n']]},
 {title:'Tea Notice',text:'Rest Stop. Free sitting, cheap tea, no questions. Please wash your own cup. The cups are all the same cup.',p:[[0,0,'yar_tent',1],[-2,1,'wm_brazier',1,'l'],[2,1,'hgtb_bench',1.1],[2,-1,'sacks',1],[-2,-1,'hgtb_plant_barrel',1],[0,3,'noticeboard',.9,'n']]},
 {title:'Do Not Wake',text:'Please do not wake the sleeper. He has been here three days. We checked. He is asleep. He snores in the key of the corridor.',p:[[0,0,'hgtb_furn_bed',1],[-3,0,'hgtb_furn_bunk',.7],[3,0,'sack2',1],[-2,2,'hl_p_candle',1,'l'],[2,2,'urn',1],[0,3,'noticeboard',.9,'n']]},
 {title:'Lantern Landing Rule',text:'Lost lamps end up here. Leave one, take one. Do not take the one that is still warm. It belongs to someone.',p:[[0,0,'hgtb_deco_lanterns',.8,'l'],[-2,1,'wm_lantern_gold',1,'l'],[2,1,'wm_lantern_hang',1,'l'],[-2,-1,'wm_crate',1],[2,-1,'wm_cage_lantern',1,'l'],[0,3,'noticeboard',.9,'n']]},
 {title:'Mossy Corner',text:'The moss here has been growing since before the maze. Please do not pet it. It has started to purr.',p:[[0,0,'hgtb_plant_barrel',1],[-2,1,'hgt_fern',1],[2,1,'hgtb_plant_spiralfern',1],[2,-1,'hgtb_bench',1.1],[-2,-1,'hgt_mushrooms',1],[0,3,'noticeboard',.9,'n']]},
 {title:'The Waiting Card',text:'The Waiting Room. For whom, nobody remembers. A card on the table says: back in five minutes. The card is old.',p:[[0,0,'hgtb_table',1],[-1,1,'hgtb_chair',1],[1,1,'hgtb_chair',1],[3,0,'hgtb_furn_clock',.65],[-3,0,'hgtb_bench',1.1],[0,3,'noticeboard',.9,'n']]},
 {title:'A Torn Journal',text:'Day 9. Safe here. Day 10. Still safe. Day 11. Very hungry, but safe. Day 12. Found a box under the crates. The box was not empty. Neither am I.',p:[[0,0,'wm_crate',1],[2,0,'wm_crate',1],[-2,1,'wm_barrel',1],[2,2,'wm_brazier',1,'l'],[-2,-1,'dbones',1],[0,-2,'hg_chestwax',1,'c'],[0,3,'noticeboard',.9,'n']]}];
function hgdpcBuild(L){
  if(L._hgdpc)return;const rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Map(),itm=new Set(L.items.map(i=>i.x+','+i.y)),ene=new Set(L.enemies.map(e=>e.x+','+e.y));
  const reg=d=>{const k=d.x+','+d.y;if(!occ.has(k))occ.set(k,[]);occ.get(k).push(d)};
  const unreg=d=>{const k=d.x+','+d.y,a=occ.get(k);if(a){const i=a.indexOf(d);if(i>=0)a.splice(i,1);if(!a.length)occ.delete(k)}};
  L.decor.forEach(reg);
  const busy=(x,y)=>occ.has(x+','+y)||itm.has(x+','+y)||ene.has(x+','+y);
  const isBlk=(x,y,ex)=>{const a=occ.get(x+','+y);return !!a&&a.some(d=>d.block&&d!==ex)};
  const n4=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(x+a,y+b)).length;
  const n8=(x,y)=>{let c=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&open(x+a,y+b))c++;return c};
  function canBlock(x,y,ex){ // would a blocking prop in this cell cut a corridor?
    const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,y+b]).filter(([a,b])=>open(a,b)&&!isBlk(a,b,ex));
    if(nb.length<=1)return true;const seen=new Set([nb[0].join()]),st=[nb[0]];
    while(st.length){const [cx,cy]=st.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+a,ny=cy+b,k=nx+','+ny;if(seen.has(k)||(nx===x&&ny===y)||Math.abs(nx-x)>5||Math.abs(ny-y)>5||!open(nx,ny)||isBlk(nx,ny,ex))continue;seen.add(k);st.push([nx,ny])}}
    return nb.every(c=>seen.has(c.join()))}
  const reserved=new Set(),put=d=>{L.decor.push(d);reg(d);return d};
  const ok=(x,y,blk,room)=>open(x,y)&&!busy(x,y)&&!reserved.has(x+','+y)&&(!blk||(n4(x,y)>=3&&canBlock(x,y)))&&(!room||n8(x,y)>=room);
  function spot(tx,ty,R,blk,room){for(let r=0;r<=R;r++){let best=null,bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=tx+dx,y=ty+dy;if(!ok(x,y,blk,room))continue;const dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=[x,y]}}if(best)return best}return null}
  const zs=L._hgdp.zones,towns=zs.filter(z=>z.type==='safe'&&z.town!==undefined).sort((a,b)=>a.town-b.town),encl=zs.filter(z=>z.type==='safe'&&z.town===undefined&&z.name!=='The Foot of the Maze');
  const inZone=d=>zs.some(z=>z.type==='safe'&&Math.hypot(d.x-z.x,d.y-z.y)<=z.r);
  const st=HGDPC.stats;
  /* 1. one scale for people, a different picture where we can */
  const NPCRE=/^hgd_(q\d+|shop\d|vill\d+|rest\d|s2_[a-z]+\d|church\d|fwsexton|fwcook|diver|cinder)$/;
  const people=L.decor.filter(d=>d.npc&&NPCRE.test(d.npc));
  const roleOf=n=>/s2_magic/.test(n)?'mage':/church/.test(n)?'priest':/s2_arms/.test(n)?'arms':/s2_armour/.test(n)?'armour':/s2_inn/.test(n)?'inn':/s2_trader/.test(n)?'trader':/shop/.test(n)?'shop':/_q\d/.test(n)?'quest':/vill/.test(n)?'vill':/rest/.test(n)?'rest':'other';
  const PREF={mage:['hg_wizard'],priest:['hg_npc0','hg_npc6'],arms:['hg_npc4','hg_npc3'],armour:['hg_npc5','hg_npc4'],inn:['hg_npc1','hg_npc6'],trader:['hg_npc3','hg_npc5'],shop:['hg_npc1','hg_npc3','hg_npc6'],quest:['hg_npc0','hg_npc5','hg_npc4','hg_npc6','hg_npc3','hg_npc1'],other:['hg_npc6','hg_npc0','hg_npc5','hg_npc3'],vill:['hg_npc2','hg_npc6','hg_npc3','hg_npc0','hg_npc4','hg_npc5','hg_npc1'],rest:['hg_npc6','hg_npc0','hg_npc1','hg_npc3','hg_npc5','hg_npc4']};
  const ORDER=['mage','priest','arms','armour','inn','trader','shop','quest','other','vill','rest'],ALL=['hg_npc0','hg_npc1','hg_npc3','hg_npc4','hg_npc5','hg_npc6','hg_wizard'];
  const byTown={};for(const d of people){const t=hgdpcTownOf(d);const key=t.z?t.z.name:'T'+t.t;(byTown[key]=byTown[key]||[]).push(d)}
  let swapped=0;
  for(const key in byTown){const cnt={};let boy=0;for(const r of ORDER)for(const d of byTown[key].filter(d=>roleOf(d.npc)===r)){
    const pref=PREF[r];let best=null,bc=1e9;for(const p of pref){if(p==='hg_npc2'&&boy>=1)continue;const c=(cnt[p]||0)*10+pref.indexOf(p);if(c<bc){bc=c;best=p}}
    if(!best)best=ALL.slice().sort((a,b)=>(cnt[a]||0)-(cnt[b]||0))[0];
    cnt[best]=(cnt[best]||0)+1;if(best==='hg_npc2')boy++;
    if(d.k!==best)swapped++;d.k=best;d.sc=HGDPC_PIC[best]/NPC_H[best];
    for(const tb of [KH_KEEPERS,NPCS]){const e=tb[d.npc];if(e){if('face' in e)e.face=best;if('img' in e)e.img=best}}}}
  st.peopleRescaled=people.length;st.peopleSwapped=swapped;
  /* 2. thin the identical groves and plaques, separate stacked props */
  const FLORA=['hgt_fairytree','hgtb_plant_belltree','hgt_bulbflower','hgt_fern','hgt_mushrooms','hgt_shellflower','hgt_reeds'],ALT=['hgtb_plant_spiralfern','hgt_bulbflower','hgt_shellflower','hgt_fern','hgt_pearlbush','hgt_mushrooms','hgtb_plantbed'];
  const wallFam=k=>/^art_hgdf_(shield|wsym|vine)\d+$/.exec(k),fam={};
  for(const d of L.decor){const m=wallFam(d.k);if(m){(fam[m[1]]=fam[m[1]]||new Set()).add(d.k)}}
  const cand=L.decor.filter(d=>!d.npc&&inZone(d)&&(FLORA.includes(d.k)||wallFam(d.k)||/^art_hgdf_plant\d+$/.test(d.k))).sort((a,b)=>a.y-b.y||a.x-b.x);
  const near=(d,k)=>cand.filter(e=>e!==d&&e.k===k&&Math.abs(e.x-d.x)<=4&&Math.abs(e.y-d.y)<=4&&e.__ok).length;
  let swappedDecor=0,removedDecor=0;
  for(const d of cand){d.__ok=0;if(near(d,d.k)<2){d.__ok=1;continue}
    if(FLORA.includes(d.k)){const alt=ALT.map(k=>[k,near(d,k)]).sort((a,b)=>a[1]-b[1])[0][0];d.k=alt;delete d.sc;if(d.block){d.block=false;d.walk=true}d.__ok=1;swappedDecor++}
    else{const m=wallFam(d.k);if(m){const alt=[...fam[m[1]]].map(k=>[k,near(d,k)]).sort((a,b)=>a[1]-b[1])[0];if(alt[1]<2){d.k=alt[0];d.__ok=1;swappedDecor++;continue}}
      if(near(d,d.k)>=3){unreg(d);L.decor.splice(L.decor.indexOf(d),1);removedDecor++}else d.__ok=1}}
  for(const d of cand)delete d.__ok;
  for(let pass=0;pass<4;pass++){const live=cand.filter(d=>L.decor.includes(d)),n2=(d,k)=>live.filter(e=>e!==d&&e.k===k&&Math.abs(e.x-d.x)<=4&&Math.abs(e.y-d.y)<=4).length;let ch=0;
    for(const d of live){if(n2(d,d.k)<2)continue;
      if(FLORA.includes(d.k)||ALT.includes(d.k)){const alt=ALT.concat(['hgt_fairytree','hgtb_plant_belltree']).filter(k=>k!==d.k).map(k=>[k,n2(d,k)]).sort((a,b)=>a[1]-b[1])[0][0];d.k=alt;delete d.sc;if(d.block){d.block=false;d.walk=true}ch++;swappedDecor++}
      else{const m=wallFam(d.k);if(m){const alt=[...fam[m[1]]].filter(k=>k!==d.k).map(k=>[k,n2(d,k)]).sort((a,b)=>a[1]-b[1])[0];if(alt&&alt[1]<2){d.k=alt[0];ch++;swappedDecor++;continue}}
        unreg(d);L.decor.splice(L.decor.indexOf(d),1);removedDecor++;ch++}}
    if(!ch)break}
  const PRI=d=>d.npc?9:(/chest|teleporter|lamp/.test(d.k)?8:d.block?6:d.pic?3:1);
  let unstacked=0;
  for(const [k,a] of [...occ]){const fl=a.filter(d=>!d.pic&&!d.npc&&!/chest|teleporter|lamp|moth|beetle/.test(d.k)&&d.deco!==false);if(fl.length<2)continue;fl.sort((p,q)=>PRI(q)-PRI(p));
    for(const d of fl.slice(1)){const i=L.decor.indexOf(d);if(i>=0){L.decor.splice(i,1);unreg(d);unstacked++}}}
  st.groveSwapped=swappedDecor;st.groveRemoved=removedDecor;st.stackedRemoved=unstacked;
  /* 3. props that blocked a corridor: move to the nearest wide place */
  let moved=0,freed=0;
  for(const d of L.decor.slice()){if(!d.block||d.npc||!inZone(d)||!n4(d.x,d.y)||canBlock(d.x,d.y,d))continue;
    unreg(d);const p=spot(d.x,d.y,6,true);if(p){d.x=p[0];d.y=p[1];moved++}else{d.block=false;d.walk=true;freed++}reg(d)}
  st.movedBlockers=moved;st.freedBlockers=freed;
  /* 4. a sign at every shop and church; people stand where they stood */
  const SIGN={arms:['sign_smith',1.4],armour:['hgdpc_sg_armour',1.4],magic:['hgdpc_sg_magic',1.4],trader:['sign_store',1.4],inn:['sign_inn',1.4],general:['sign_store',1.4],church:['sign_church',1.45]};
  let signs=0;
  const firstName=id=>{const n=NPCS[id];return n?n.name.split(',')[0]:'The keeper'};
  const addSign=(keeper,kind,t)=>{let p=null;
    for(const [R,room] of [[3,8],[4,6],[5,0]]){p=spot(keeper.x,keeper.y,R,false,room);if(p&&(p[0]!==keeper.x||p[1]!==keeper.y))break;p=null}
    if(!p)return;reserved.add(p.join());const [k,sc]=SIGN[kind];const T=HGDPC_TOWN[t];
    const nm=firstName(keeper.npc),txt=kind==='church'?'THE CHURCH OF '+T.toUpperCase()+'. '+HGDPC_CHURCH[t]+' '+HGDPC_CSIGN[t]:HGDPC_KIND_ROLE[kind].toUpperCase()+' OF '+T.toUpperCase()+', kept by '+nm+'. '+HGDPC_TAG[kind][t];
    keeper.__sg=put({k,x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt,kname:kind==='church'?'Church sign':HGDPC_KIND_ROLE[kind]+' sign',label:kind==='church'?'Church of '+T:HGDPC_KIND_ROLE[kind]+' of '+T,sc,skind:kind,stown:t});signs++};
  for(const d of people){let m=/^hgd_s2_([a-z]+)(\d)$/.exec(d.npc);if(m){addSign(d,m[1],+m[2]);continue}m=/^hgd_church(\d)$/.exec(d.npc);if(m){addSign(d,'church',+m[1]);continue}m=/^hgd_shop(\d)$/.exec(d.npc);if(m)addSign(d,'general',+m[1])}
  st.shopSigns=signs;
  /* 5. a notice board and a signpost with true directions in every town */
  const top=zs.find(z=>z.boss)||{x:100,y:5,name:'The Black Hall'};
  const dirName=(dx,dy)=>{const a=Math.atan2(dy,dx)*180/Math.PI;return ['east','south-east','south','south-west','west','north-west','north','north-east'][(Math.round(a/45)+8)%8]};
  let boards=0,posts=0;
  towns.forEach(z=>{const t=z.town;
    let p=spot(z.x,z.y,7,false,8);if(p){reserved.add(p.join());put({k:'wm_noticeboard',x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt:'NOTICES OF '+HGDPC_TOWN[t].toUpperCase()+'. Lost: '+HGDPC_BOARD[t][0].replace(/^Lost: /,'')+' Wanted: '+HGDPC_BOARD[t][1].replace(/^Wanted: /,'')+' '+HGDPC_BOARD[t][2],kname:'Notice board',label:'Notices of '+HGDPC_TOWN[t],sc:1});boards++}
    p=spot(z.x+2,z.y-3,8,false,8);if(p){reserved.add(p.join());
      const others=towns.filter(q=>q!==z).map(q=>[q,Math.hypot(q.x-z.x,q.y-z.y)]).sort((a,b)=>a[1]-b[1]).slice(0,3);
      const lines=others.map(([q,dd])=>HGDPC_TOWN[q.town]+': '+dirName(q.x-z.x,q.y-z.y)+', about '+Math.round(dd)+' squares').concat(['The Great Atrium: '+dirName(top.x-z.x,top.y-z.y)+', about '+Math.round(Math.hypot(top.x-z.x,top.y-z.y))+' squares']);
      put({k:'hgdpc_post'+t,x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt:'THE ROAD FROM '+HGDPC_TOWN[t].toUpperCase()+'. '+lines.join('. ')+'. '+HGDPC_PCLOSE[t],kname:'Signpost',label:'Road from '+HGDPC_TOWN[t],sc:1});posts++}});
  st.boards=boards;st.signposts=posts;
  /* 6. the vignettes */
  let vign=0,pieces=0,chests=0;
  const LIGHTKEY=/lamp|lantern|brazier|candle/;
  const build=(z,V)=>{ // find a place with room, plan every piece, then commit
    const cands=[];for(let dy=-9;dy<=9;dy++)for(let dx=-9;dx<=9;dx++){const x=z.x+dx,y=z.y+dy;if(!open(x,y)||Math.hypot(dx,dy)>z.r)continue;let free=0;for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(open(x+a,y+b)&&!busy(x+a,y+b))free++;cands.push([x,y,free-Math.hypot(dx,dy)*.6])}
    cands.sort((a,b)=>b[2]-a[2]);
    for(const [ax,ay] of cands.slice(0,40)){const plan=[],res=[];let good=true;
      for(const [dx0,dy,k,sc,fl] of V.p){const f=fl||'',blk=/[bc]/.test(f);const dx=(/n/.test(f)&&dx0===0)?(hgdpcH(ax,ay,1)<.5?-2:2):dx0;const p=spot(ax+dx,ay+dy,2,blk,0);if(!p){if(/n/.test(f)||blk){good=false;break}continue}reserved.add(p.join());res.push(p.join());plan.push([p,k,sc,f])}
      for(const r of res)reserved.delete(r);
      if(!good||plan.length<Math.ceil(V.p.length*.7)||!plan.some(q=>/n/.test(q[3])))continue;
      for(const [p,k,sc,fl] of plan){if(/n/.test(fl))put({k:'noticeboard',x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt:V.title.toUpperCase()+'. '+V.text,kname:V.title,label:V.title.replace(/^The /,''),sc});
        else if(/c/.test(fl)){put({k,x:p[0],y:p[1],block:true,hgdTier:3,hgdGive:[],sc:1});chests++}
        else put({k,x:p[0],y:p[1],block:/b/.test(fl),walk:!/b/.test(fl),deco:true,sc,vig:V.title,main:p===plan[0][0]?1:0});
        if(/l/.test(fl))L.lights.push([p[0],p[1]]);reserved.add(p.join());pieces++}
      vign++;return true}
    return false};
  towns.forEach((z,i)=>{if(!build(z,HGDPC_VIG[i]))console.warn('hgdpc: no room for vignette',HGDPC_VIG[i].title)});
  encl.slice(0,10).forEach((z,i)=>{if(!build(z,HGDPC_ENC[i]))console.warn('hgdpc: no room for vignette',HGDPC_ENC[i].title)});
  st.vignettes=vign;st.vignettePieces=pieces;st.vignetteChests=chests;
  L._hgdpc={stats:st}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdp&&L.decor)try{hgdpcBuild(L)}catch(e){console.error('hgdpc',e)}if(!had&&L&&L._hgdp&&L.decor)try{hgdpc2Build(L)}catch(e){console.error('hgdpc2',e)}}}

/* ---------- lettered signs: the painted blank boards get their words (made once, when the picture has loaded) ---------- */
const HGDPC_LET={hgdpc_sg_armour:{base:'signb0',r:[.2,.5,.6,.38],text:'ARMOUR'},hgdpc_sg_magic:{base:'signb0',r:[.2,.5,.6,.38],text:'MAGIC'}};
HGDPC_TOWN.forEach((n,t)=>{HGDPC_LET['hgdpc_post'+t]={base:'wm_signpost',r:[.1,.18,.8,.24],text:n.toUpperCase()}});
if(NPC_H.signb0===undefined)NPC_H.signb0=.75;
function hgdpcLetter(){let todo=0;
  for(const k in HGDPC_LET){if(IMG[k])continue;const S=HGDPC_LET[k],b=IMG[S.base];if(!b||!b.width){todo++;continue}
    const sc=S.maxw&&b.width>S.maxw?S.maxw/b.width:1,c=document.createElement('canvas');c.width=Math.round(b.width*sc);c.height=Math.round(b.height*sc);const x=c.getContext('2d');x.drawImage(b,0,0,c.width,c.height);
    const [rx,ry,rw,rh]=S.r,W=c.width*rw,H=c.height*rh;
    if(S.bg){x.fillStyle=S.bg;x.fillRect(c.width*rx-2,c.height*ry,W+4,H);x.strokeStyle='rgba(70,45,20,.8)';x.lineWidth=1.5;x.strokeRect(c.width*rx-2,c.height*ry,W+4,H)}
    let fs=H*.75;x.font='bold '+fs+'px '+FUI;while(x.measureText(S.text).width>W&&fs>5){fs-=1;x.font='bold '+fs+'px '+FUI}
    x.textAlign='center';x.textBaseline='middle';const cx=c.width*(rx+rw/2),cy=c.height*(ry+rh/2);
    if(S.bg){x.fillStyle='#2a1608';x.fillText(S.text,cx,cy+.5)}
    else{x.lineWidth=Math.max(2,fs*.12);x.strokeStyle='rgba(20,12,6,.85)';x.strokeText(S.text,cx,cy);x.fillStyle='#ecd9a2';x.fillText(S.text,cx,cy)}
    IMG[k]=c;NPC_H[k]=NPC_H[k]||NPC_H[S.base]}
  return todo}
{const _u=update;update=function(dt){if(!HGDPC.lettered){try{if(!hgdpcLetter())HGDPC.lettered=1}catch(e){HGDPC.lettered=1;console.error('hgdpc letter',e)}}return _u.apply(this,arguments)}}

/* ==========================================================================
   ROUND 2 (towns): who stands where and looks like what, houses, church silhouettes, lettered signs, coloured light pools, one table of heights
   ========================================================================== */
function hgdpcH(a,b,c){const v=Math.sin(a*127.1+b*311.7+(c||0)*74.7)*43758.5453;return v-Math.floor(v)}
/* ---------- the people: wanted height in squares for every picture a villager may use (frogs 0.9 to 1.0, folk 0.9 to 1.05, a child 0.8, moths and whale kin hover low) ---------- */
const HGDPC_PH={hg_npc0:.98,hg_npc1:.9,hg_npc2:.8,hg_npc3:.95,hg_npc4:1,hg_npc5:.95,hg_npc6:.95,hg_wizard:1,baker:.98,farmer:1,guard:1.02,innkeeper:1,merchant:.95,miner:.95,oldman:.9,oldwoman:.88,smith:1.02,waterwoman:1,child:.8,fisher:.98,priest:1,monk:.98,prismwiz:.95,art_hgtb_elder:.88,art_hgtb_fisher:.95,yar_p_aldous:1,yar_p_isolde:1,yar_p_vance:1.02,yar_p_aldwyn:1.05,yar_p_diver:1,yar_p_osric:1,yar_p_maeve:.98,art_hgtb_lilacmoth:.55,art_hgtb_creammoth:.55,art_hgtb_aquawhale:.55,art_hgtb_peachwhale:.55};
for(const k in HGDPC_PH)if(NPC_H[k]===undefined)NPC_H[k]=HGDPC_PH[k];
const HGDPC_PRIEST=['hg_npc0','priest','monk','art_hgtb_elder','yar_p_aldous','yar_p_osric','art_hgtb_lilacmoth','art_hgtb_creammoth'];
const HGDPC_QUEST=['farmer','miner','baker','art_hgtb_fisher','waterwoman','yar_p_isolde','oldman','yar_p_vance','oldwoman','guard','hg_npc5','prismwiz'];
const HGDPC_POOL={arms:['smith','guard','hg_npc4','yar_p_aldwyn','miner','hg_npc3'],armour:['guard','yar_p_aldwyn','hg_npc5','smith','hg_npc4','merchant'],magic:['hg_wizard','prismwiz','art_hgtb_lilacmoth','yar_p_aldous','art_hgtb_elder','art_hgtb_creammoth','oldwoman'],
 trader:['merchant','hg_npc3','art_hgtb_peachwhale','yar_p_vance','art_hgtb_aquawhale','waterwoman','fisher'],inn:['innkeeper','hg_npc1','baker','oldwoman','hg_npc6','waterwoman'],general:['merchant','hg_npc6','farmer','hg_npc3','baker','fisher','hg_npc5','yar_p_isolde'],
 vill:['child','hg_npc2','oldman','farmer','fisher','waterwoman','hg_npc6','hg_npc3','baker','art_hgtb_fisher','art_hgtb_creammoth','miner','hg_npc5','oldwoman','monk','hg_npc0','hg_npc1','hg_npc4','yar_p_isolde','art_hgtb_peachwhale'],
 rest:['monk','oldman','fisher','hg_npc5','yar_p_isolde','miner','oldwoman','hg_npc4','farmer','hg_npc6'],other:['hg_npc4','guard','hg_npc3','hg_npc6']};
/* ---------- colours of the light pools, by town and by enclave ---------- */
const HGDPC_TCOL=[[.55,1,.5],[.72,.82,1],[1,.8,.35],[.5,1,.95],[1,.7,.4],[.45,.6,1],[.85,.55,1],[1,.85,.35]];
const HGDPC_ECOL=[[.8,.85,1],[1,.8,.45],[.5,1,.7],[.9,.75,1],[1,.75,.45],[.7,.7,1],[1,.85,.5],[.6,1,.6],[1,.9,.6],[.7,.9,1]];
const HGDPC_KCOL={arms:[1,.6,.3],armour:[1,.5,.35],magic:[.8,.55,1],trader:[1,.8,.45],inn:[1,.75,.4],general:[1,.85,.5]};
/* ---------- houses: one set of pictures per town (the Hollow Grasslands huts and towers), four to a town, each with a door plate ---------- */
const HGDPC_HK={hut0:['icn_hgdi_hut0',1.15],hut1:['icn_hgdi_hut1',1.2],hut2:['icn_hgdi_hut2',1.2],hut3:['icn_hgdi_hut3',1.2],hut4:['icn_hgdi_hut4',1.05],hut5:['icn_hgdi_hut5',1.4],hut6:['icn_hgdi_hut6',1.4],hut7:['icn_hgdi_hut7',1.4],tim:['icn_hgdi_thouse',1.45],t0:['hg_house0',2.1],t1:['hg_house1',1.9],t2:['hg_house2',2.3]};
const HGDPC_HOUSES=[['tim','hut1','hut0','t0'],['hut1','hut4','tim','hut0'],['hut2','hut0','hut2','hut3'],['hut3','hut4','t1','hut3'],['hut4','hut0','hut5','hut4'],['hut5','tim','hut1','t2'],['hut6','tim','hut6','hut1'],['hut7','tim','t1','hut7']];
const HGDPC_HNOTE=[
 [['THE TRIMMERS','Three generations of shears hang inside. The oldest pair has never been sharpened and has never once been blunt.'],['THE KNOT HOUSE','The door sticks in damp weather. The owner says it is not the door, it is the hedge leaning on it.'],['WIDOW PELL','Please knock twice. She is deaf in one ear and suspicious in the other.'],['THE LAST ON THE PATH','Nobody remembers who lives here. The smoke is real, so someone does.']],
 [['THE MASON','A new doorstep every year, and the old ones piled in the yard.'],['THE CAIRN KEEPER','One stone for each lost traveller, counted every dusk on a slate by the door.'],['GRAN FLINT','She sells soup and refuses to explain the stones in it.'],['THE QUARRY HOUSE','The walls are so thick the owner shouts to himself to check he is in.']],
 [['THE QUEENS COTTAGE','The beekeepers bow here, and nobody tells the bees why.'],['THE CANDLE MAKER','Every window glows amber and the whole street smells of toast.'],['HIVE NUMBER NINE','Please do not knock. The knocking is answered, and not by people.'],['THE MEAD LOFT','The door is warm to the touch, and so is the owner when you owe him.']],
 [['THE PEARL DIVER','The shells by the step are for luck. The empty ones are for the debts.'],['THE FERRYMAN','A boat leans against the wall, and there is no water for forty miles.'],['THE SHELL COTTAGE','Built round one enormous shell, and very proud of it.'],['THE ROPE WALK','Every rope in town was spun here, and so was every rumour.']],
 [['THE WELL KEEPER','The bucket hangs by the door, and the door is locked against it.'],['THE SAND SWEEPER','She sweeps the step forty times a day and the step stays sandy.'],['THE DATE GROWER','A palm in a barrel, and a card saying the palm is not for sale.'],['THE DOWSER','Rods by the door, and a hole in the yard that nobody mentions.']],
 [['THE FIRST LAMPLIGHTER','Ladder, taper and a note: back at dusk, which is always.'],['THE SECOND LAMPLIGHTER','Ladder, taper, and a note saying the first one is wrong.'],['THE GLASSBLOWER','Blue bottles line the sill, and none of them hold anything.'],['THE WICK MAKER','One blue flame in the window that has not gone out in nine years.']],
 [['THE TILE LAYER','Every step is a different colour, and none of them match.'],['THE GROUT HOUSE','The owner says he holds the town together. Nobody argues, in case he stops.'],['THE PATTERN WIDOW','Her mosaic of the maze is exact, except for one corridor she will not discuss.'],['THE SHARD COLLECTOR','A jar of broken tiles by the door, each one labelled with a date.']],
 [['THE GILDER','A pot of leaf, a pot of glue, and a very serious expression.'],['THE LEAF PRESS','Everything inside is gold, and nothing outside is.'],['THE COUNTING HOUSE','Three locks on the door and a card: come back tomorrow.'],['THE LAST OF THE GILT','A small house with a plain door, because the paint ran out.']]];
/* ---------- churches: eight silhouettes from the painted chapel, shrines, towers and domes, each with its own tint and window glow ---------- */
const HGDPC_CH=[ // round 3: real painted fronts, no flattening tints (a gentle warm lift only); the two tall spires are the landmarks of Blue Lantern and Tessera
 {src:'art_hgstall_church',h:2.5,f:'brightness(1.45) saturate(1.15)',glow:[[.5,.33,.16,'rgba(255,205,120,.85)']]},
 {src:'icn_shrine_moor',h:2.7,f:'brightness(1.5) saturate(1.1)',glow:[[.5,.88,.2,'rgba(255,200,120,.55)']]},
 {src:'hg_house1',h:2.8,f:'sepia(.4) saturate(1.6) brightness(1.2)',glow:[[.27,.82,.07,'rgba(255,220,130,.9)'],[.73,.82,.07,'rgba(255,220,130,.9)']]},
 {src:'hgtb_shrine',h:2.5,f:'brightness(1.35) saturate(1.2)',glow:[[.5,.5,.3,'rgba(150,255,230,.35)']]},
 {src:'icn_shrine_sand',h:2.7,f:'brightness(1.5) saturate(1.2)',glow:[[.5,.8,.2,'rgba(255,205,120,.5)']]},
 {src:'hg_tower4',h:4.2,f:'brightness(1.3) saturate(1.2)',glow:[[.5,.9,.14,'rgba(200,230,255,.6)']]},
 {src:'hg_tower7',h:4.4,f:'brightness(1.3) saturate(1.15)',glow:[[.5,.93,.1,'rgba(255,215,255,.6)']]},
 {src:'icn_shrine_sut',h:2.7,f:'brightness(1.4) saturate(1.25)',glow:[[.5,.5,.25,'rgba(255,225,130,.45)']]}];
const HGDPC_CPROP=[ // what stands beside each church: [kind,scale,gives light]
 [['wm_bell',.9,0],['hgt_gardenlantern',1,1],['urn',1,0]],[['wm_brazier',1,1],['hgtb_bench',1,0],['wm_crate',1,0]],[['hg_jar',1,0],['hgtb_stall_orange_pottery',.8,0],['hl_p_candle',1,1]],[['hgt_pearlbush',1,0],['hgt_gardenlantern',1,1],['urn',1,0]],
 [['wm_barrel_tall',1,0],['wm_bucket',1,0],['wm_lantern_hang',1,1]],[['wm_lantern_gold',1,1],['hgt_gardenlantern',1,1],['urn',1,0]],[['hgtb_deco_banner',.55,0],['vase0',1,0],['hgt_hanglamp',1,1]],[['wm_lantern_gold',1,1],['hgtb_deco_banner',.55,0],['hg_chestwax',.9,0]]];
function hgdpcChurchImg(t){const V=HGDPC_CH[t];if(V.c)return V.c;const b=IMG[V.src];if(!b||!b.width)return null;
  const c=document.createElement('canvas'),W=Math.min(b.width,420),H=Math.round(b.height*W/b.width);c.width=W;c.height=H;const x=c.getContext('2d');
  try{x.filter=V.f||'none'}catch(e){}x.drawImage(b,0,0,W,H);try{x.filter='none'}catch(e){}
  x.globalCompositeOperation='source-atop';for(const [gx,gy,gr,col] of V.glow||[]){const g=x.createRadialGradient(gx*W,gy*H,0,gx*W,gy*H,gr*Math.max(W,H));g.addColorStop(0,col);g.addColorStop(1,'rgba(255,200,120,0)');x.fillStyle=g;x.fillRect(0,0,W,H)}
  x.globalCompositeOperation='source-over';V.c=c;return c}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  try{if(LEVEL===HGD.ID&&G.state==='play'&&G.decor){
    if(HGDPC.chSrc!==G.decor){HGDPC.chSrc=G.decor;HGDPC.ch=G.decor.filter(d=>/^hgd_church\d$/.test(d.npc)).map(d=>({x:d.x,y:d.y,t:+d.npc.slice(-1)}))}
    const base=IMG.art_hgstall_church;if(base)for(const c of HGDPC.ch){const im=hgdpcChurchImg(c.t);if(!im)continue;let best=null,bd=.9;
      for(const s of L){if(s.img!==base)continue;const dd=Math.hypot(s.x-(c.x+.5),s.y-(c.y+.5));if(dd<bd){bd=dd;best=s}}
      if(best){best.img=im;best.w=HGDPC_CH[c.t].h*im.width/im.height}}}}catch(e){console.error('hgdpc church',e)}
  return L}}
/* ---------- coloured pools of light ---------- */
HGDPC.lights=[];
{const _sl=setupLights;setupLights=function(){_sl.apply(this,arguments);try{if(LEVEL===HGD.ID)for(const q of HGDPC.lights)LIGHTS.push({x:q.x+.5,y:q.y+.5,ph:hgdpcH(q.x,q.y,21)*6.28,key:-8000-LIGHTS.length,taken:false,red:false,free:true,calm:true,col:q.col,kI:q.kI,range2:q.r2})}catch(e){console.error('hgdpc lights',e)}}}
/* ---------- one table of heights (squares): [pattern, low, high], applied to every prop of the zone that is not a person ---------- */
const HGDPC_SCALE=[[/^hg_lamp$/,1.2,1.4],[/^hgt_shellflower$/,1.3,1.6],[/^hgt_bulbflower$/,1.2,1.5],[/^hgtb_plant_spiralfern$/,1.0,1.3],[/^hgtb_deco_shellstatue$/,1.35,1.7],[/^art_hgxstat\d$/,1.3,1.6],[/^hgtb_deco_pearlplinth$/,.5,.8],[/^hgtb_deco_banner$/,1.0,1.25],
 [/^hgt_lamppost$/,1.2,1.5],[/^art_hgdf_vine\d$/,1.0,1.25],[/^hgtb_deco_fountain$/,1.2,1.5],[/^hgt_fountain$/,1.1,1.4],[/^(wm_bookshelf|hgtb_furn_bookshelf)$/,1.3,1.6],[/^hg_chestwax$/,.35,.5],[/^hgtb_table$/,.4,.5],[/^hgtb_bench$/,.4,.55],[/^hgtb_chair$/,.5,.65],[/^(wm_noticeboard|noticeboard)$/,.8,.9],[/^hgtb_stall_/,1.1,1.4],[/^wm_statue$/,1.4,1.7],[/^(hgt_fairytree|hgtb_plant_belltree)$/,2.3,3.6]];
/* round 4: the per-kind scale table (heights next to a person of about 1.0). Jars, wax barrels and sacks were person-sized, huts were hardly taller than a person, the cream and pink cloud bushes and the lantern cluster at Nacre Landing were giants */
HGDPC_SCALE.push([/^hg_jar$/,.45,.65],[/^hg_waxbarrel$/,.5,.65],[/^hg_lectern$/,.7,.85],[/^sacks$/,.3,.42],[/^sack2$/,.32,.45],[/^hgdfc_(cream|pink|lilac)\d$/,.55,.8],[/^hgtb_deco_lanterns$/,.55,.8],[/^icn_hgdi_/,1.5,1.8],[/^wm_bell$/,.7,.85],[/^hgt_reeds$/,.6,.9]);
function hgdpcScalePass(L,zoneOf){let fixed=0;const rep={};
  for(const d of L.decor){if(d.npc&&!/hgdpc_text/.test(d.npc)||!zoneOf(d)||!NPC_H[d.k])continue;
    for(const [re,lo,hi] of HGDPC_SCALE){if(!re.test(d.k))continue;const base=NPC_H[d.k],h=base*(d.sc||1);let want=h;
      if(/fairytree|belltree/.test(d.k)){want=[2.5,2.9,3.2,3.5][Math.floor(hgdpcH(d.x,d.y,5)*4)]}
      else if(h<lo)want=lo;else if(h>hi)want=hi;
      if(Math.abs(want-h)>.02){d.sc=+(want/base).toFixed(3);fixed++}
      const key=re.source;rep[key]=rep[key]||[1e9,0,0];const hh=base*(d.sc||1);rep[key][0]=Math.min(rep[key][0],hh);rep[key][1]=Math.max(rep[key][1],hh);rep[key][2]++;break}}
  return {fixed,table:rep}}

/* ---------- the round 2 builder (runs once, right after the first pass) ---------- */
function hgdpc2Build(L){
  if(L._hgdpc2)return;const rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Map(),itm=new Set(L.items.map(i=>i.x+','+i.y)),ene=new Set(L.enemies.map(e=>e.x+','+e.y));
  const reg=d=>{const k=d.x+','+d.y;if(!occ.has(k))occ.set(k,[]);occ.get(k).push(d)};
  const unreg=d=>{const k=d.x+','+d.y,a=occ.get(k);if(a){const i=a.indexOf(d);if(i>=0)a.splice(i,1);if(!a.length)occ.delete(k)}};
  L.decor.forEach(reg);
  const busy=(x,y)=>occ.has(x+','+y)||itm.has(x+','+y)||ene.has(x+','+y);
  const isBlk=(x,y,ex)=>{const a=occ.get(x+','+y);return !!a&&a.some(d=>d.block&&d!==ex)};
  const n4=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(x+a,y+b)).length;
  const n8=(x,y)=>{let c=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&open(x+a,y+b))c++;return c};
  function canBlock(x,y,ex){const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,y+b]).filter(([a,b])=>open(a,b)&&!isBlk(a,b,ex));
    if(nb.length<=1)return true;const seen=new Set([nb[0].join()]),st=[nb[0]];
    while(st.length){const [cx,cy]=st.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+a,ny=cy+b,k=nx+','+ny;if(seen.has(k)||(nx===x&&ny===y)||Math.abs(nx-x)>5||Math.abs(ny-y)>5||!open(nx,ny)||isBlk(nx,ny,ex))continue;seen.add(k);st.push([nx,ny])}}
    return nb.every(c=>seen.has(c.join()))}
  const reserved=new Set(),put=d=>{L.decor.push(d);reg(d);return d};
  const ok=(x,y,blk,room)=>open(x,y)&&!busy(x,y)&&!reserved.has(x+','+y)&&(!blk||(n4(x,y)>=3&&canBlock(x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>!open(x+a,y+b)||n4(x+a,y+b)>1)))&&(!room||n8(x,y)>=room);
  const free1=(x,y)=>open(x,y)&&!busy(x,y)&&!reserved.has(x+','+y);
  function spot(tx,ty,R,blk,room){for(let r=0;r<=R;r++){let best=null,bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=tx+dx,y=ty+dy;if(!ok(x,y,blk,room))continue;const dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=[x,y]}}if(best)return best}return null}
  const zs=L._hgdp.zones,towns=zs.filter(z=>z.type==='safe'&&z.town!==undefined).sort((a,b)=>a.town-b.town),encl=zs.filter(z=>z.type==='safe'&&z.town===undefined&&z.name!=='The Foot of the Maze');
  const zoneOf=d=>zs.some(z=>z.type==='safe'&&Math.hypot(d.x-z.x,d.y-z.y)<=z.r+3);
  const st={};HGDPC.st2=st;
  const ISP=d=>d.npc&&NPCS[d.npc]&&!/hgdpc_text|hgdb_post|^hgd_sign$|note/.test(d.npc);
  const stallRe=/^hgd_(s2_[a-z]+|shop)\d$/,villRe=/^hgd_vill\d+$/;
  /* A0. each church moves into its town: on the rim of the square (3 to 9 squares from its centre), with room round it, so it is seen from the square */
  let churchMoved=0;
  for(const c of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc))){const t=+c.npc.slice(-1),z=towns.find(q=>q.town===t);if(!z||Math.hypot(c.x-z.x,c.y-z.y)<=8)continue;
    unreg(c);let best=null,bs=-1e9;const others=L.decor.filter(d=>d!==c&&ISP(d)&&Math.hypot(d.x-z.x,d.y-z.y)<=z.r+3);
    for(let dy=-10;dy<=10;dy++)for(let dx=-10;dx<=10;dx++){const x=z.x+dx,y=z.y+dy,rho=Math.hypot(dx,dy);if(rho>9.5||rho<3||!ok(x,y,true,6))continue;
      if(others.some(p=>Math.max(Math.abs(p.x-x),Math.abs(p.y-y))<3))continue;
      let fr=0;for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(open(x+a,y+b)&&!busy(x+a,y+b))fr++;const sc=fr*.5-Math.abs(rho-6)*1.2;if(sc>bs){bs=sc;best=[x,y]}}
    if(best){c.x=best[0];c.y=best[1];churchMoved++}else console.warn('hgdpc: church',t,'stays');
    reg(c);reserved.add(c.x+','+c.y)}
  st.churchMoved=churchMoved;if(L._hgdch&&L._hgdch.churches)for(const e of L._hgdch.churches){const c=L.decor.find(d=>d.npc==='hgd_church'+e[0]);if(c){e[1]=c.x;e[2]=c.y}}
  /* A. spread the shops and villagers round each square, at least two cells between people */
  let moved=0;
  towns.forEach(z=>{
    const inT=d=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+.5;
    const ppl=L.decor.filter(d=>ISP(d)&&inT(d)),mov=ppl.filter(d=>stallRe.test(d.npc)||villRe.test(d.npc)),placed=ppl.filter(d=>!mov.includes(d)).map(d=>[d.x,d.y]);
    const cheb=(x,y)=>placed.reduce((m,p)=>Math.min(m,Math.max(Math.abs(p[0]-x),Math.abs(p[1]-y))),99);
    mov.sort((a,b)=>hgdpcH(a.x,a.y,2)-hgdpcH(b.x,b.y,2));
    const order=mov.filter(d=>stallRe.test(d.npc)).concat(mov.filter(d=>villRe.test(d.npc))),n=order.length,base=hgdpcH(z.x,z.y,3)*6.28;
    order.forEach((d,i)=>{const isS=stallRe.test(d.npc),ang=base+i*6.2832/n+(hgdpcH(d.x,d.y,4)-.5)*.5,rho=z.r*(isS?(.4+.45*hgdpcH(d.x,d.y,6)):(.2+.7*hgdpcH(d.x,d.y,7)));
      const tx=Math.round(z.x+Math.cos(ang)*rho),ty=Math.round(z.y+Math.sin(ang)*rho);unreg(d);let best=null,bs=-1e9;
      for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){const x=tx+dx,y=ty+dy;if(Math.hypot(x-z.x,y-z.y)>z.r)continue;if(!ok(x,y,true,isS?5:3))continue;const c=cheb(x,y);if(c<(isS?3:2))continue;const sc=-Math.hypot(dx,dy)+Math.min(c,5)*.6;if(sc>bs){bs=sc;best=[x,y]}}
      if(best){if(best[0]!==d.x||best[1]!==d.y)moved++;d.x=best[0];d.y=best[1]}
      reg(d);placed.push([d.x,d.y])})});
  st.peopleMoved=moved;
  if(L._hgds2)for(const s of L._hgds2.shops){const d=L.decor.find(q=>q.npc==='hgd_s2_'+s[0]+s[1]);if(d){s[2]=d.x;s[3]=d.y}}
  /* signs follow their keepers; every shop sign is lettered with the keeper's own shop name */
  const WORD={arms:'FORGE',armour:'ARMOURY',magic:'CURIOS',trader:'TRADING POST',inn:'INN',general:'GOODS'};let snum=0;
  for(const d of L.decor.filter(d=>ISP(d))){const sg=d.__sg;if(!sg)continue;
    let p=null;for(const [R,room] of [[3,8],[4,6],[5,0]]){p=spot(d.x,d.y,R,false,room);if(p&&(p[0]!==d.x||p[1]!==d.y))break;p=null}
    if(sg.skind==='church'){let q=null,bq=1e9;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const c=Math.max(Math.abs(dx),Math.abs(dy));if(c<2||!ok(d.x+dx,d.y+dy,false,3))continue;const v=c*10+hgdpcH(d.x+dx,d.y+dy,12)*5+(Math.abs(dx)>=2&&Math.abs(dy)<=1?-8:0);if(v<bq){bq=v;q=[d.x+dx,d.y+dy]}}if(q)p=q;sg.sc=1.0} // a church sign stands beside the church, never in front of it
    if(p){unreg(sg);sg.x=p[0];sg.y=p[1];reg(sg);reserved.add(p.join())}
    if(sg.skind&&sg.skind!=='church'){const nm=(NPCS[d.npc]&&NPCS[d.npc].name||'The keeper').split(',')[0].replace(/^(Old|Mother|Father|Sister|Brother|Elder)\s+/,''),key='hgdpc_ss'+snum++;
      HGDPC_LET[key]={base:'signb0',r:[.2,.5,.6,.38],text:(nm.toUpperCase()+"'S "+WORD[sg.skind]),maxw:240};NPC_H[key]=NPC_H.signb0;sg.k=key}}
  /* B. the people: a different picture for nearly everyone, one scale */
  const people=L.decor.filter(d=>d.npc&&/^hgd_(q\d+|shop\d|vill\d+|rest\d|s2_[a-z]+\d|church\d|fwsexton|fwcook|diver|cinder)$/.test(d.npc));
  const roleOf=n=>/church/.test(n)?'priest':/^hgd_q/.test(n)?'quest':/s2_(arms|armour|magic|trader|inn)/.test(n)?n.match(/s2_([a-z]+)/)[1]:/shop/.test(n)?'general':/vill/.test(n)?'vill':/rest/.test(n)?'rest':'other';
  const gcount={},tcount={};let swapped=0;
  const townKey=d=>{const t=hgdpcTownOf(d);return t.z?t.z.name:'T'+t.t};
  const give=(d,pic)=>{d.k=pic;d.sc=+(HGDPC_PH[pic]/NPC_H[pic]).toFixed(3);gcount[pic]=(gcount[pic]||0)+1;const tk=townKey(d);(tcount[tk]=tcount[tk]||{})[pic]=(tcount[tk][pic]||0)+1;swapped++;
    for(const tb of [KH_KEEPERS,NPCS]){const e=tb[d.npc];if(e){if('face' in e)e.face=pic;if('img' in e)e.img=pic}}};
  for(const d of people){const r=roleOf(d.npc),num=+(/(\d+)$/.exec(d.npc)||[0,0])[1];
    if(r==='priest')give(d,HGDPC_PRIEST[num%8]);else if(r==='quest')give(d,HGDPC_QUEST[num%12]);else if(d.npc==='hgd_fwsexton')give(d,'monk');else if(d.npc==='hgd_fwcook')give(d,'baker');else if(d.npc==='hgd_diver')give(d,'yar_p_diver')}
  for(const r of ['arms','armour','magic','trader','inn','general','vill','rest','other'])for(const d of people.filter(d=>!d.__g&&roleOf(d.npc)===r&&!['hgd_fwsexton','hgd_fwcook','hgd_diver'].includes(d.npc)&&!/church|^hgd_q/.test(d.npc))){
    const pool=HGDPC_POOL[r],tk=townKey(d);let best=null,bc=1e9;pool.forEach((p,i)=>{const c=((tcount[tk]||{})[p]||0)*100+(gcount[p]||0)*3+i*.3+hgdpcH(d.x,d.y,i)*.5;if(c<bc){bc=c;best=p}});give(d,best)}
  st.peopleSwapped=swapped;st.pictures=Object.keys(gcount).length;let wi=0;for(const d of L.decor.filter(d=>d.npc&&/^hgd_/.test(d.npc)&&!/^hgd_(s2_|shop|church)/.test(d.npc)&&NPCS[d.npc]&&zoneOf(d)).sort((a,b)=>a.y-b.y||a.x-b.x))d._wi=wi++; // each person a different warning
  /* C. houses: a short street of four along the rim of each square (one row or one column, one free square between the houses, one frontage line); anything that does not fit the maze stands singly as before */
  let houses=0,streets=0;const hpos=[];
  towns.forEach((z,t)=>{const kinds=HGDPC_HOUSES[t],notes=HGDPC_HNOTE[t],people=L.decor.filter(d=>ISP(d)&&Math.hypot(d.x-z.x,d.y-z.y)<=z.r+6);
    const base=hgdpcH(z.x,z.y,9)*6.28;
    const mk=(i,best)=>{const [key,h0]=HGDPC_HK[kinds[i]],h=h0*(.96+.08*hgdpcH(best[0],best[1],3));if(NPC_H[key]===undefined)NPC_H[key]=1;
      put({k:key,x:best[0],y:best[1],block:true,deco:true,hs:'hgdpc_house',sc:+(h/NPC_H[key]).toFixed(3)});hpos.push(best);reserved.add(best.join());houses++;
      HGDPC.lights.push({x:best[0],y:best[1],col:[1,.78,.45],kI:.32,r2:16});
      // a door plate in front of it, and a small thing of its own
      const pl=spot(best[0],best[1]+1,2,false,0)||spot(best[0],best[1],3,false,0);
      if(pl){reserved.add(pl.join());const nt=notes[i],kk='hgdpc_hp'+t+'_'+i;HGDPC_LET[kk]={base:'wm_signpost',r:[.08,.16,.84,.3],text:nt[0],maxw:200,small:1};NPC_H[kk]=NPC_H.wm_signpost||1.25;
        put({k:kk,x:pl[0],y:pl[1],block:false,walk:true,npc:'hgdpc_text',txt:nt[0]+'. '+nt[1],kname:'Door plate',label:nt[0].replace(/^THE /,'').split(' ').slice(0,3).join(' '),sc:.62})}
      const TH=['wm_barrel','wm_crate','hgtb_plant_barrel','urn','sacks','wm_bucket','hg_jar','hgt_mushrooms'],pp=spot(best[0]+(hgdpcH(best[0],best[1],8)<.5?-1:1),best[1]+1,2,false,0);
      if(pp){reserved.add(pp.join());put({k:TH[Math.floor(hgdpcH(best[0],best[1],11)*TH.length)],x:pp[0],y:pp[1],block:false,walk:true,deco:true,sc:1})}};
    // the streets: n cells two apart in a row or column, on the rim of the square; four if the maze allows, else runs of three or two
    const findStreet=n=>{let street=null,bsc=-1e9;
      for(const vert of [0,1])for(let dy=-z.r;dy<=z.r;dy++)for(let dx=-z.r;dx<=z.r;dx++){const cells=[];let good=true;
        for(let k=0;k<n&&good;k++){const x=z.x+dx+(vert?0:2*k),y=z.y+dy+(vert?2*k:0);
          if(Math.hypot(x-z.x,y-z.y)>z.r+1||!ok(x,y,true,5)||people.some(p=>Math.max(Math.abs(p.x-x),Math.abs(p.y-y))<2)||hpos.some(p=>Math.max(Math.abs(p[0]-x),Math.abs(p[1]-y))<3)){good=false;break}
          if(k<n-1){const gx=x+(vert?0:1),gy=y+(vert?1:0);if(!free1(gx,gy)||!(free1(gx+(vert?1:0),gy+(vert?0:1))||free1(gx-(vert?1:0),gy-(vert?0:1)))){good=false;break}}
          if(!free1(x+(vert?1:0),y+(vert?0:1))&&!free1(x-(vert?1:0),y-(vert?0:1))){good=false;break}
          cells.push([x,y])}
        if(!good)continue;const mx=cells.reduce((m,c)=>m+c[0],0)/n,my=cells.reduce((m,c)=>m+c[1],0)/n,rho=Math.hypot(mx-z.x,my-z.y);
        const sc=-Math.abs(rho-6.5)*1.5+hgdpcH(dx,dy,30+t)*.4;if(sc>bsc){bsc=sc;street=cells}}
      return street};
    const rem=[0,1,2,3];
    while(rem.length>=2){let got=null;for(let n=Math.min(4,rem.length);n>=2&&!got;n--)got=findStreet(n);if(!got)break;
      got.forEach(c=>mk(rem.shift(),c));streets++}
    rem.forEach(i=>{const hk=kinds[i],ang=base+i*1.5708+(hgdpcH(z.x,z.y,10+i)-.5)*.6,rho=z.r*(.62+.3*hgdpcH(z.x,z.y,20+i)),tx=Math.round(z.x+Math.cos(ang)*rho),ty=Math.round(z.y+Math.sin(ang)*rho);
      let best=null,bs=-1e9;for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){const x=tx+dx,y=ty+dy;if(Math.hypot(x-z.x,y-z.y)>z.r+1||!ok(x,y,true,4))continue;
        if(people.some(p=>Math.max(Math.abs(p.x-x),Math.abs(p.y-y))<2))continue;if(hpos.some(p=>Math.max(Math.abs(p[0]-x),Math.abs(p[1]-y))<4))continue;
        let fr=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(free1(x+a,y+b))fr++;if(fr<1)continue;const s=-Math.hypot(dx,dy)+fr*.4;if(s>bs){bs=s;best=[x,y]}}
      if(best)mk(i,best)})});
  st.streets=streets;
  st.houses=houses;
  /* D. churches: a lamp, a bell or lanterns and other small things of their own, standing BESIDE the church (never within one square, never in the line of the door) */
  let cprops=0;
  for(const c of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc))){const t=+c.npc.slice(-1),P=HGDPC_CPROP[t];
    HGDPC.lights.push({x:c.x,y:c.y,col:t===3?[.6,1,.9]:t===5?[.5,.7,1]:t===6?[.9,.6,1]:[1,.8,.45],kI:.9,r2:56});
    const SLOT=[[-2,-1],[2,-1],[-3,1],[3,1]];
    P.forEach(([k,sc,lt],i)=>{let p=null;for(const [ox,oy] of [SLOT[i],SLOT[(i+1)%4],SLOT[(i+2)%4]]){p=spot(c.x+ox,c.y+oy,1,false,0);if(p&&Math.max(Math.abs(p[0]-c.x),Math.abs(p[1]-c.y))>=2&&!(p[0]===c.x))break;p=null}
      if(!p)return;reserved.add(p.join());put({k,x:p[0],y:p[1],block:false,walk:true,deco:true,sc,cp:1});cprops++;if(lt)L.lights.push([p[0],p[1]])})}
  st.churchProps=cprops;
  /* E. keep things from hiding people and landmarks; duplicate danger signs; clusters of the same thing */
  const moveAway=(d,from,R,r0)=>{unreg(d);let q=null;
    for(let r=r0||2;r<=R&&!q;r++)for(let dy=-r;dy<=r&&!q;dy++)for(let dx=-r;dx<=r&&!q;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=from.x+dx,y=from.y+dy;if(ok(x,y,!!d.block,0))q=[x,y]}
    if(q){d.x=q[0];d.y=q[1];reserved.add(q.join())}reg(d);return !!q};
  let cleared=0;const tallish=d=>NPC_H[d.k]*(d.sc||1)>.45&&!d.pic&&!/lamp|lantern|brazier|candle|chest/.test(d.k);
  const holders=L.decor.filter(d=>(ISP(d)&&zoneOf(d))||(d.block&&!d.npc&&NPC_H[d.k]*(d.sc||1)>=1.2&&zoneOf(d)&&!/tree|lamp/.test(d.k)&&!d.pic));
  for(const h of holders){for(const d of L.decor.slice()){if(d===h||d.npc&&ISP(d)||d.skind)continue;if(Math.max(Math.abs(d.x-h.x),Math.abs(d.y-h.y))>1||!NPC_H[d.k]||d.hgdTier||d.hs)continue;
      if(!tallish(d))continue;if(d.x===h.x&&d.y===h.y&&!d.pic&&d.block===h.block&&false)continue;if(moveAway(d,h,5))cleared++}}
  for(const h of L.decor.filter(d=>d.npc&&/^hgd_(q\d+|s2_[a-z]+\d|shop\d)$/.test(d.npc)&&zoneOf(d)))for(const d of L.decor.slice()){if(d===h||d.npc||d.hgdTier||d.hs||d.pic||!d.block||!NPC_H[d.k]||NPC_H[d.k]*(d.sc||1)<.4)continue;
    if(Math.max(Math.abs(d.x-h.x),Math.abs(d.y-h.y))===2&&(d.x===h.x||d.y===h.y)&&/crate|barrel|sacks|bench|table|chest/.test(d.k)&&moveAway(d,h,7,3))cleared++}
  for(const c of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc)))for(const d of L.decor.slice()){if(d===c||d.cp||d.hgdTier||d.hs||d.pic||(d.npc&&ISP(d))||!NPC_H[d.k])continue;const cb=Math.max(Math.abs(d.x-c.x),Math.abs(d.y-c.y));
    if(cb>2)continue;if(d.skind==='church'&&cb>=2)continue;if(cb<=1||(tallish(d)&&!d.skind)||(cb===2&&(d.x===c.x||d.y===c.y)&&/lamp|lantern/.test(d.k)&&!d.skind)){if(moveAway(d,c,7,3))cleared++}}
  st.cleared=cleared;
  const sg=L.decor.filter(d=>d.npc==='hgd_sign'),seenZ=[];let dsg=0;for(const d of sg){if(seenZ.some(q=>q.zone===d.zone&&Math.hypot(q.x-d.x,q.y-d.y)<12)){unreg(d);L.decor.splice(L.decor.indexOf(d),1);dsg++}else seenZ.push(d)}st.dupSigns=dsg;
  /* clusters: three or more of one thing within three cells: swap, then remove */
  const SW=['hgtb_plant_spiralfern','hgt_bulbflower','hgt_shellflower','hgt_fern','hgt_pearlbush','hgt_mushrooms','hgtb_plantbed','hgt_reeds'];let cl=0;
  for(let pass=0;pass<3;pass++)for(const d of L.decor.filter(d=>!d.npc&&!d.pic&&zoneOf(d)&&(SW.includes(d.k)||/^hg_lamp$|hgxrock|hgxprop/.test(d.k)))){
    const same=k=>L.decor.filter(e=>e!==d&&!e.npc&&e.k===k&&Math.abs(e.x-d.x)<=3&&Math.abs(e.y-d.y)<=3).length;if(same(d.k)<2)continue;
    if(SW.includes(d.k)){const alt=SW.filter(k=>k!==d.k).map(k=>[k,same(k)]).sort((a,b)=>a[1]-b[1])[0];const w=!(/^(hgt_fern|hgt_mushrooms|hgt_pearlbush|hgtb_plantbed)$/.test(alt[0])&&false);d.k=alt[0];delete d.sc;if(d.block){d.block=false;d.walk=true}cl++}
    else{unreg(d);L.decor.splice(L.decor.indexOf(d),1);cl++}}
  st.clustersFixed=cl;
  /* I1. round 4: nobody is hidden. Within one square of a giver, shopkeeper or priest nothing of any size stands, and nothing of a sack's or crate's size stands in the line of sight (up to two squares along the open row or column). Props move to the nearest cell that is out of every line. */
  {const gv=L.decor.filter(d=>d.npc&&/^hgd_(q\d+|s2_[a-z]+\d|shop\d|church\d)$/.test(d.npc)&&zoneOf(d)),nts=L.decor.filter(d=>d.npc&&/^(hgd_note|hgd_pa_note|hgdb_note)$/.test(d.npc)&&zoneOf(d)),people=gv.concat(nts);
   const clr=(p,x,y)=>{const dx=Math.sign(x-p.x),dy=Math.sign(y-p.y),n=Math.max(Math.abs(x-p.x),Math.abs(y-p.y));for(let i=1;i<n;i++)if(!open(p.x+dx*i,p.y+dy*i))return false;return true};
   const lineD=(x,y,arr)=>{let m=9;for(const p of arr){if((x===p.x||y===p.y)&&(x!==p.x||y!==p.y)){const n=Math.abs(x-p.x)+Math.abs(y-p.y);if(n<m&&clr(p,x,y))m=n}}return m};
   const near1=(x,y)=>people.some(p=>Math.max(Math.abs(x-p.x),Math.abs(y-p.y))<=1);
   const SOLID=/tree|statue|well|fountain|plinth|hgxstat|hgxrock|house|hut|stall/;
   const bad=d=>{if(d.npc||d.hgdTier||d.hs||d.pic||d.skind||d.cl||!NPC_H[d.k]||/lamp|lantern|candle|brazier|chest|teleporter|hanglamp|^hgdpc_/.test(d.k))return false;
     const h=NPC_H[d.k]*(d.sc||1);if(h<.3)return false;if(near1(d.x,d.y))return true;if(h>=.3&&lineD(d.x,d.y,nts)<=2)return true;if(d.block&&SOLID.test(d.k))return false;return h>=.35&&lineD(d.x,d.y,gv)<=2};
   let moved=0;
   for(let pass=0;pass<3;pass++)for(const d of L.decor.slice()){if(!zoneOf(d)||!bad(d))continue;
     unreg(d);let q=null;
     for(const lim of [3,2,0]){if(q)break;for(let r=1;r<=10&&!q;r++){let bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=d.x+dx,y=d.y+dy;if(!ok(x,y,!!d.block,0)||near1(x,y)||(lim&&lineD(x,y,people)<=lim))continue;const dd=dx*dx+dy*dy;if(dd<bd){bd=dd;q=[x,y]}}}}
     if(q){d.x=q[0];d.y=q[1];reserved.add(q.join());moved++}reg(d)}
   st.hidersMoved=moved}
  /* F. pools of coloured light: the centre of every square, every stall, and each junction round a square or enclave */
  const pools=[];const addPool=(x,y,col,kI,r2)=>{HGDPC.lights.push({x,y,col,kI,r2});pools.push([x,y])};
  const around=(z,col,reach,gap,maxN,kb)=>{let n=0;const cs=[];for(let dy=-reach;dy<=reach;dy++)for(let dx=-reach;dx<=reach;dx++){const x=z.x+dx,y=z.y+dy;if(!open(x,y)||Math.hypot(dx,dy)>reach)continue;if(n4(x,y)>=3)cs.push([x,y,hgdpcH(x,y,40)])}
    cs.sort((a,b)=>a[2]-b[2]);const got=[];for(const [x,y] of cs){if(got.length>=maxN)break;if(got.some(g=>Math.hypot(g[0]-x,g[1]-y)<gap))continue;got.push([x,y]);addPool(x,y,col,kb||.75,44)}};
  towns.forEach((z,t)=>{const col=HGDPC_TCOL[t];addPool(z.x,z.y,col,1.25,100);around(z,col,z.r+8,6,16);
    for(const d of L.decor.filter(d=>stallRe.test(d.npc||'')&&Math.hypot(d.x-z.x,d.y-z.y)<=z.r+1)){const k=/^hgd_shop/.test(d.npc)?'general':d.npc.match(/s2_([a-z]+)/)[1];addPool(d.x,d.y,HGDPC_KCOL[k]||col,.5,26)}});
  encl.slice(0,10).forEach((z,i)=>{const col=HGDPC_ECOL[i%10];addPool(z.x,z.y,col,2.6,150);around(z,col,z.r+10,4,22,/Lantern Landing|Mossy|Quiet|Sleeping/.test(z.name)?1.5:0)});
  st.pools=pools.length;
  /* F2. light along the corridors round every square and enclave: a hanging lamp and a pool of light every four or five squares, so props are seen and no way is black */
  const allL=pools.concat((L.lights||[]).map(q=>[q[0],q[1]]));let lampsAdded=0;
  const corr=(z,col,reach,gap,kI,r2)=>{const cs=[];for(let dy=-reach;dy<=reach;dy++)for(let dx=-reach;dx<=reach;dx++){const x=z.x+dx,y=z.y+dy;if(!open(x,y)||Math.hypot(dx,dy)>reach||Math.hypot(dx,dy)<z.r*.6||n4(x,y)>3)continue;cs.push([x,y,hgdpcH(x,y,50)])}
    cs.sort((a,b)=>a[2]-b[2]);for(const [x,y] of cs){if(allL.some(g=>Math.hypot(g[0]-x,g[1]-y)<gap))continue;if(occ.has(x+','+y)&&occ.get(x+','+y).some(d=>d.block||d.npc))continue;
      allL.push([x,y]);addPool(x,y,col,kI,r2);if(!busy(x,y)&&!reserved.has(x+','+y)&&!L.decor.some(n=>n.npc&&/^(hgd_note|hgd_pa_note|hgdb_note)$/.test(n.npc)&&(n.x===x||n.y===y)&&Math.abs(n.x-x)+Math.abs(n.y-y)<=3)){put({k:'hgt_hanglamp',x,y,block:false,walk:true,deco:true,sc:1,cl:1});lampsAdded++}}};
  towns.forEach((z,t)=>corr(z,HGDPC_TCOL[t],z.r+11,4,1.0,56));
  encl.slice(0,10).forEach((z,i)=>{const dk=/Mossy|Quiet|Sleeping|Lantern Landing/.test(z.name);corr(z,HGDPC_ECOL[i%10],z.r+18,dk?2.6:3.6,dk?2.8:1.1,dk?80:56)});
  st.corridorLamps=lampsAdded;st.pools=pools.length;
  /* F3. every landmark of a square says what it is: a named plaque beside the main piece, and a light on it */
  let plaques=0;
  towns.forEach((z,t)=>{const V=HGDPC_VIG[t],m=L.decor.find(d=>d.vig===V.title&&d.main)||L.decor.find(d=>d.vig===V.title&&!d.npc);if(!m)return;
    HGDPC.lights.push({x:m.x,y:m.y,col:HGDPC_TCOL[t],kI:.7,r2:36});if(t===4)return;
    const p=spot(m.x+1,m.y+1,2,false,0)||spot(m.x-1,m.y+1,3,false,0);if(!p||Math.max(Math.abs(p[0]-m.x),Math.abs(p[1]-m.y))<1)return;reserved.add(p.join());
    const key='hgdpc_lm'+t;HGDPC_LET[key]={base:'wm_signpost',r:[.1,.18,.8,.24],text:V.title.replace(/^The /,'').toUpperCase(),maxw:260};NPC_H[key]=NPC_H.wm_signpost||1.25;
    put({k:key,x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt:V.title.toUpperCase()+'. '+V.text.split('. ')[0].replace(/\.$/,'')+'.',kname:'Landmark plaque',label:V.title.replace(/^The /,''),sc:.9});plaques++});
  st.plaques=plaques;
  /* F4. nothing a pocket the party cannot reach: any blocker that closes off a cell is made walk-through */
  {const W=L.rows[0].length,H=L.rows.length;let fixedPocket=0;
   for(let pass=0;pass<4;pass++){const bl=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
    const fl=u=>{const sn=new Uint8Array(W*H),q=[[L.start.x,L.start.y]];sn[L.start.y*W+L.start.x]=1;while(q.length){const [x,y]=q.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||sn[ny*W+nx]||!open(nx,ny))continue;if(u&&bl.has(nx+','+ny))continue;sn[ny*W+nx]=1;q.push([nx,ny])}}return sn};
    const A=fl(false),B=fl(true);let cuts=0;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!A[y*W+x]||B[y*W+x]||bl.has(x+','+y))continue;cuts++;
      const adj=L.decor.filter(d=>d.block&&Math.abs(d.x-x)+Math.abs(d.y-y)===1).sort((p,q)=>(p.hs?1:0)-(q.hs?1:0)||(p.npc?1:0)-(q.npc?1:0));
      const t=adj.find(d=>!d.npc&&!d.hs&&!d.hgdTier)||adj.find(d=>!d.npc&&!d.hgdTier);if(t){t.block=false;t.walk=true;fixedPocket++}}
    if(!cuts)break}
   st.pocketsOpened=fixedPocket}
  /* F5. short titles (d.label) for the notes and signs of the towns and enclaves, so the lettering pass has a good heading */
  {const LAB=[['hedge maze is the easy part','Hedge warning'],['if you are reading this','Lost? So was I'],['gem doors are worth','Gem doors'],['eleven thousand tiles','Tile count'],['i found a gold key in a vault','Gold key luck'],['hollowed warden was a gardener','The old Warden'],['blue door, blue key','Door and key rule'],['i counted the steps','Step count'],['every maze has a middle','The middle'],['my mother says','A child\'s warning'],['gilded quarter is the richest','Gilded Quarter'],['something large went past','Something large'],['twelve people in the maze','Twelve tasks'],['blue lamps do not flicker','Blue lamps'],['slow here','Slug warning'],['rested here. nothing came','Rested here'],['counted forty turns','Forty turns'],['two ways out','Two ways out'],['i do not know where i am','Lost but sure'],['shells under the lamp','Shells and candle'],['dead end is not the end','Dead end'],['one more turn','One more turn'],['here ends the mason','Mason\'s Ward'],['i measured the corridor','Measured corridor'],['moss on the north side','Moss rule'],['honey on the wall is warm','Warm honey'],['i named this corner','Mildred\'s corner'],['lost two days to a wrong turn','Wrong turn'],['dead end has a draught','Rain draught'],['the lamp is not mine','Borrowed lamp'],['counting the tiles','Tile counting'],['stacked all this against the worm','Against the worm'],['blue lantern, blue door','Blue silence'],['follow the red tiles','Red tiles'],['sound of dripping','Dripping'],['came all this way for a dead end','A nice dead end'],['left at the last crossing','Last crossing']];
   let labelled=0;const tc=w=>w.toLowerCase().replace(/\b[a-z]/g,m=>m.toUpperCase());
   for(const d of L.decor){if(!d.npc||d.label||!zoneOf(d))continue;
    if(d.npc==='hgd_sign'){d.label='Danger ahead';labelled++;continue}
    if(!/^(hgd_note|hgd_pa_note|hgdb_note|hgdb_post)$/.test(d.npc))continue;
    const t=String(d.pbt||d.text||(d.npc==='hgd_note'&&typeof HGDF_NOTES!=='undefined'?HGDF_NOTES[(d.note||0)%HGDF_NOTES.length]:'')||'').toLowerCase();
    if(d.npc==='hgdb_post'){const raw=String(d.pbt||''),m=/(?:North|East|South|West): (?!The )([A-Z][a-z]+(?: [A-Z][a-z]+)*)/.exec(raw),p=/^SIGNPOST\. ([A-Z ]+?)\./.exec(raw);
      d.label=m&&/PRECINCT/.test(raw)&&(L.decor.some(e=>e!==d&&e.npc==='hgdb_post'&&String(e.pbt||'').startsWith(raw.slice(0,30))&&e.label))?'Road to '+m[1]:(p?tc(p[1]).replace(/\bPrecinct\b/,'precinct'):'Signpost');labelled++;continue}
    const h=LAB.find(e=>t.includes(e[0]));if(h){d.label=h[1];labelled++}}
   st.labelled=labelled}
  /* G. the heights table */
  const sp=hgdpcScalePass(L,zoneOf);st.scaleFixed=sp.fixed;st.scaleTable=sp.table;
  /* I2. round 4: hanging shop signs are 0.6 of a person (they were 1.05 and filled the view), hung a little above the ground */
  {let n=0;for(const d of L.decor)if(/^hgdpc_ss\d+$/.test(d.k||'')&&NPC_H[d.k]&&zoneOf(d)){d.sc=+(.62/NPC_H[d.k]).toFixed(3);d.lift=Math.max(d.lift||0,.3);n++}st.shopSigns=n}
  /* H. lettered boards: the notice board of each town and every plaque carries its own heading */
  towns.forEach((z,t)=>{for(const d of L.decor)if(d.npc==='hgdpc_text'&&d.k==='wm_noticeboard'&&Math.hypot(d.x-z.x,d.y-z.y)<=z.r+2&&d.__nb===undefined){const key='hgdpc_nb'+t;d.__nb=1;
    HGDPC_LET[key]={base:'wm_noticeboard',r:[.16,.0,.68,.2],text:HGDPC_TOWN[t].toUpperCase()+' NOTICES',maxw:300,bg:'#d8c68e'};NPC_H[key]=NPC_H.wm_noticeboard||.95;d.k=key}});
  let vn=0;for(const d of L.decor)if(d.npc==='hgdpc_text'&&d.k==='noticeboard'&&d.kname){const key='hgdpc_vn'+vn++;HGDPC_LET[key]={base:'noticeboard',r:[.1,.2,.8,.16],text:String(d.kname).toUpperCase().replace(/^THE /,''),maxw:260,bg:'#d8c68e'};NPC_H[key]=NPC_H.noticeboard||.77;d.k=key}
  HGDPC.lettered=0;L._hgdpc2={stats:st}}

/* ---------- round 4: corridor notes stand up facing the walker ----------
   A note on the side wall of a corridor is seen edge-on and cannot be read beyond one square. Every note picture in the towns and enclaves (the
   zone of this file) becomes a standing sign in the corner of its square, 1.35 times its usual size, so it faces the walker and reads from
   three or four squares. A loose parchment page becomes the scroll on its board. Called from hgd_polish_text.js just before the lettering. */
function hgdpcCorr(L){
  if(!L||!L._hgdp||!L.decor||typeof HGS_SET==='undefined')return 0;let n=0;
  const zs=L._hgdp.zones.filter(z=>z.type==='safe');
  for(const d of L.decor){if(d.hgcc||!d.hgs||!d.pic||!d.wd||!/^(hgd_note|hgd_pa_note|hgdb_note)$/.test(d.npc||''))continue;
    if(!zs.some(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+3))continue;
    let kind=d.hgs;if(kind==='page')kind='scroll';if(!/^(scroll|plaque|slate|tablet)$/.test(kind))continue;
    const img='art_hs_'+kind;if(!(IMG[img]&&IMG[img].width))continue;
    if(d.hgt){delete d.hgt;delete d.lk;delete d.hgtBase}
    d.k=img;d.hgs=kind;d.hgcc=1;const wd=d.wd;d.hgsWd=wd.slice?wd.slice():wd;d.pic=0;d.ox=wd[0]*.3;d.oy=wd[1]*.3;
    if(wd[0]===0&&wd[1]!==0)d.ox=(hash2(d.x,d.y,17)<.5?-1:1)*.14;else if(wd[1]===0&&wd[0]!==0)d.oy=(hash2(d.x,d.y,19)<.5?-1:1)*.14;
    d.sc=1.35*(.94+hash2(d.x,d.y,23)*.12);d.bob=0;d.block=false;d.walk=true;d.deco=true;n++}
  try{hgdpcLate(L)}catch(e){console.error('hgdpcLate',e)}
  return n}
/* the late clearing pass (all other polish passes have run): nothing small stands on or in front of a note (one or two squares in line) or within a square of a giver, shopkeeper or priest.
   Only walk-through props move (to the nearest free cell out of the lines); a hanging lamp picture in front of a note is dropped (its light stays). */
function hgdpcLate(L){
  if(L._hgdpcLate||!L._hgdp)return;L._hgdpcLate=1;const rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const zs=L._hgdp.zones.filter(z=>z.type==='safe'),zoneOf=d=>zs.some(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+3);
  const nts=L.decor.filter(d=>d.npc&&/^(hgd_note|hgd_pa_note|hgdb_note)$/.test(d.npc)&&zoneOf(d)),gv=L.decor.filter(d=>d.npc&&/^hgd_(q\d+|s2_[a-z]+\d|shop\d|church\d)$/.test(d.npc)&&zoneOf(d)),all=nts.concat(gv);
  const clr=(p,x,y)=>{const dx=Math.sign(x-p.x),dy=Math.sign(y-p.y),n=Math.max(Math.abs(x-p.x),Math.abs(y-p.y));for(let i=1;i<n;i++)if(!open(p.x+dx*i,p.y+dy*i))return false;return true};
  const lineD=(x,y,arr)=>{let m=9;for(const p of arr)if((x===p.x||y===p.y)&&(x!==p.x||y!==p.y)){const n=Math.abs(x-p.x)+Math.abs(y-p.y);if(n<m&&clr(p,x,y))m=n}return m};
  const near1=(x,y)=>all.some(p=>Math.max(Math.abs(x-p.x),Math.abs(y-p.y))<=1);
  const taken=new Set(L.decor.filter(d=>!d.pic||d.block||d.npc).map(d=>d.x+','+d.y));L.items.forEach(i=>taken.add(i.x+','+i.y));L.enemies.forEach(e=>taken.add(e.x+','+e.y));
  if(L.start)taken.add(L.start.x+','+L.start.y);
  let moved=0,dropped=0,notesMoved=0;
  const bigs=L.decor.filter(b=>b.block&&!b.npc&&!b.hs&&NPC_H[b.k]&&NPC_H[b.k]*(b.sc||1)>=.3);
  const blocked=(x,y)=>bigs.some(b=>{const c=Math.max(Math.abs(b.x-x),Math.abs(b.y-y));return c===0||(c<=2&&(b.x===x||b.y===y)&&clr({x,y},b.x,b.y))});
  for(let pass=0;pass<2;pass++)for(const n of nts){if(!blocked(n.x,n.y))continue;let q=null;
    for(let r=1;r<=8&&!q;r++){let bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=n.x+dx,y=n.y+dy;if(!open(x,y)||taken.has(x+','+y)||blocked(x,y)||near1(x,y))continue;const dd=dx*dx+dy*dy;if(dd<bd){bd=dd;q=[x,y]}}}
    if(q){n.x=q[0];n.y=q[1];taken.add(q.join());notesMoved++}}
  for(const n of nts){for(const b of bigs.slice()){if(!/art_hgxrock|art_hgxprop|art_hpb_/.test(b.k)||b.hgdTier)continue;const c=Math.max(Math.abs(b.x-n.x),Math.abs(b.y-n.y));
    if(c===0||(c<=2&&(b.x===n.x||b.y===n.y)&&clr(n,b.x,b.y))){const i=L.decor.indexOf(b);if(i>=0){L.decor.splice(i,1);bigs.splice(bigs.indexOf(b),1);dropped++}}}} // a small blocker that cannot move: removing a blocker never closes a way
  for(const d of L.decor.slice()){if(d.npc||d.pic||d.hs||d.hgdTier||d.skind||d.block||d.found||!zoneOf(d))continue;
    const lamp=/hanglamp/.test(d.k||'');if(!lamp&&(!NPC_H[d.k]||/lantern|candle|chest|teleporter|^hgdpc_/.test(d.k)))continue;
    const h=(NPC_H[d.k]||.8)*(d.sc||1);if(!lamp&&h<.3)continue;
    const hitN=nts.some(p=>{const c=Math.max(Math.abs(d.x-p.x),Math.abs(d.y-p.y));return c===0||(c<=2&&(d.x===p.x||d.y===p.y)&&clr(p,d.x,d.y))});
    const hitG=!lamp&&gv.some(p=>Math.max(Math.abs(d.x-p.x),Math.abs(d.y-p.y))<=1);
    if(!hitN&&!hitG)continue;
    if(lamp){L.decor.splice(L.decor.indexOf(d),1);dropped++;continue}
    taken.delete(d.x+','+d.y);let q=null;
    for(const lim of [3,2,0]){if(q)break;for(let r=1;r<=10&&!q;r++){let bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=d.x+dx,y=d.y+dy;if(!open(x,y)||taken.has(x+','+y)||near1(x,y)||(lim&&lineD(x,y,all)<=lim))continue;const dd=dx*dx+dy*dy;if(dd<bd){bd=dd;q=[x,y]}}}}
    if(q){d.x=q[0];d.y=q[1];taken.add(q.join());moved++}else if(/art_hgxprop|art_hpb_|art_hgxrock/.test(d.k)){L.decor.splice(L.decor.indexOf(d),1);dropped++}else taken.add(d.x+','+d.y)}
  L._hgdpcLateN=[moved,dropped,notesMoved]}
