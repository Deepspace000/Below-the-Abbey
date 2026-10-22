/* ==========================================================================
   THE DEEPER HOLLOW, FINISHING TOUCHES (prefix hgdf / HGDF). A named champion in every danger zone, guarding a chest; notes scratched and chalked on the walls (jokes, lore and
   hints); statues and plinths in the atriums; lamps and extra villagers in the towns. Runs after the maze, the people and the secrets are built.
   ========================================================================== */
const HGDF_BOSS={slug:['hgdslug','Old Gnaw, the Great Slug'],jelly:['hgdjelly','The Pale Queen Jelly'],worm:['hgdworm','Grandfather Worm'],bug:['hgdbug','The Horned Terror'],spider:['hgdspider','Mother Silk'],beetle:['hgdbeetle','The Lantern King'],mixed:['hgdbug','The Hollow Beast']};
for(const k in HGDF_BOSS){const [b,n]=HGDF_BOSS[k],d=ENEMY_DEF[b];ENEMY_DEF['hgdb_'+k]=Object.assign({},d,{name:n,hp:Math.round(d.hp*3.4),dmg:[Math.round(d.dmg[0]*1.35),Math.round(d.dmg[1]*1.35)],xp:d.xp*5,gold:[120,320],w:(d.w||1.3)*1.35,boss:true,aboveParty:2});if(typeof NO_VARY!=='undefined')NO_VARY.push('hgdb_'+k)}
const HGDF_NOTES=[
 'Someone has scratched into the wall: I WALKED PAST THE SAME TREE FOUR TIMES. IT WAS A DIFFERENT TREE EACH TIME. I DO NOT LIKE THIS MAZE.',
 'Chalked on the wall: The hedge maze is the easy part. Do not get cocky.',
 'A neat note: If you are reading this, you are lost. So was I. Turn left. No, the other left.',
 'Scratched small: There is a shortcut here. I walked into the wall to find it, and I was right. Try the walls that look a shade off.',
 'Written in charcoal: The slug is not slow. The slug is patient. There is a difference.',
 'A child\'s drawing of a worm, with a sign: DO NOT FEED. Underneath, someone has added: TOO LATE.',
 'Carved deep: A KEY IS USED UP IN THE LOCK. SAVE THEM FOR THE GOOD DOORS.',
 'Chalked: Gem doors are worth the trouble. The treasure behind them is better than anything you can buy.',
 'Scratched: The signs mean what they say. I have stood under one and watched a worm go by the other way.',
 'A note pinned to the wall: LOST: one lantern, brass, very dear to me. If found, please do not return it, I am never going back there.',
 'Chalked: Four towns is a good walk. Eight towns is a good life.',
 'Carved: THE HONEYCOMB WALLS ARE WARM. THE SHELL WALLS ARE COLD. THE SANDSTONE WALLS HAVE SECRETS.',
 'Scribbled: I came for the treasure and stayed for the soup. Ask in the towns.',
 'Scratched: Dead ends are not always dead. Press on the wall at the end, and press on the wall before it.',
 'Written small: The ponds are shallow and the fish are not real. Do not ask me how I know.',
 'Chalked on the stone: HEDGEFOOT IS THIS WAY. NO. THAT WAY. I AM NOT SURE ANY MORE.',
 'A note: Whoever keeps moving the walls, please stop.',
 'Carved: I found a gold key in a vault and a gold door two hours later. I have never been so happy.',
 'Chalked: The warden at the top is not as clever as he looks. He is bigger than he looks, though.',
 'Scratched: There are people living in the maze who have never seen the sky. They are very polite about it.',
 'A scrap of cloth nailed up: The Hollowed Warden was a gardener once. We do not talk about the hedge.',
 'Written in a neat hand: Rest in the safe places. Fight in the dangerous ones. Never confuse the two.',
 'Scratched: Blue door, blue key. Red door, red key. Gem door, gem. Nobody has ever been this organised before.',
 'Chalked: I counted the steps from the start to the top. Then the maze changed my mind.',
 'Carved: Every maze has a middle. This one has several, and none of them is the middle.',
 'A note: If the lamp goes out, stand still. If the lamp goes out and something breathes, run.',
 'Scratched: The spiders are the worst. They are also, I am told, delicious. I have not tested this.',
 'Chalked: Atriums are full of trees and quiet. Quiet is good. Trees are better. Ponds are best.',
 'A child\'s writing: MY MOTHER SAYS NOT TO GO PAST THE SIGNS. I AM ON THE SAFE SIDE. I CAN SEE THE SIGN FROM HERE.',
 'Carved by a careful hand: The Gilded Quarter is the richest and the most dangerous. They are the same thing.',
 'Scratched: Something large went past here in the night, and it did not say good morning.',
 'Chalked: The Blue Quarter is quiet. Too quiet. I have gone back.',
 'A note: To whoever finds my gem: it was a gift. Please do not use it on a door. Marry someone with it.',
 'Written small: The mosaic was beautiful once. Then the dark came and the tiles began to fall.',
 'Scratched: There are twelve people in the maze who will give you a task. I have done two. I am very tired.',
 'Chalked: Every shop is better than the last, but the last is dearer. Choose wisely.',
 'Carved: The hollow slugs came up through the floor at the same time as the dark. Make of that what you will.',
 'A note: Do not trust a corridor that is too straight. Nobody built one.'];
khNpc('hgd_note','A scratched note','hl_p_note',()=>{const d=G.talk&&G.talk.d,i=d&&d.note!==undefined?d.note:0;return say(hgdSay(HGDF_NOTES[i%HGDF_NOTES.length]),[BYE])});
const HGDF_VNAMES=['Tilda','Brom','Wenna','Pike','Orla','Fenn','Dilly','Hobb','Mara','Corwin','Sable','Teague','Nim','Rook','Yara','Pell','Bess','Garrick','Ness','Tam','Ivo','Lotte','Mab','Dunstan'];
const HGDF_VLINES=['I was born in the maze and I have never seen the end of it. I hear it is very big.','The hedge folk and the stone folk do not get on. It is mostly about the walls.','Do not go past the signs. I say that to everyone. Nobody listens.','I keep a lamp lit all night. The dark does not like a lamp.','There is a door in the Blue Quarter that nobody has opened. Some say a gem would do it.','My cousin walked into a wall on purpose and found a room full of treasure. We do not speak of it.','The soup here is the best in the maze. It is also the only soup.','If you find a golden key, bring it to Gildmere. They will pay a great deal.','A worm came through the town last year. We built a wall. It was not a good wall.','I like the safe places. I like them very much.','The jellies hum when they are angry. Learn the hum.','Walk into a wall that looks a shade off. Half the secrets of the maze are behind such walls.'];
for(let i=0;i<24;i++)khNpc('hgd_vill'+i,HGDF_VNAMES[i],'hg_npc'+(1+(i%5)),d=>{const nodeFn=()=>hgdNode(HGDF_VLINES[i%HGDF_VLINES.length]+' '+HGDP_WARN[(i+3)%HGDP_WARN.length],[['Anything else?',()=>hgdNode(HGDP_GOSS[(i+2)%HGDP_GOSS.length],[BYE],nodeFn)],BYE],nodeFn);return nodeFn()});
function hgdfBuild(L){
  if(L._hgdf)return;const M=L._hgdm,W=M.W,H=M.H,rnd=hgdmrngSafe(475005),rows=L.rows,kind=M.kind,P=L._hgdp;
  const open=(x,y)=>rows[y]&&rows[y][x]==='.',occ=new Set();for(const d of L.decor.concat(L.items,L.enemies))occ.add(d.x+','+d.y);
  const interior=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(!open(x+dx,y+dy)||(occ.has((x+dx)+','+(y+dy))&&!(dx===0&&dy===0)))return false;return true};
  // only places the party can reach without opening a secret, key or gem door
  const reach=new Set([L.start.x+','+L.start.y]),qq=[[L.start.x,L.start.y]];for(let i=0;i<qq.length;i++){const [x,y]=qq[i];for(const [a2,b2] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a2,ny=y+b2,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);qq.push([nx,ny])}}
  const free=(x,y)=>open(x,y)&&reach.has(x+','+y)&&!occ.has(x+','+y),take=(x,y)=>occ.add(x+','+y);
  // 1) a champion in every danger zone, with a chest beside it (a key or a gem inside, more treasure besides)
  const GIVE=['hgdkey_gold','hgdgem_amber','hgdkey_blue','hgdgem_pearl','hgdkey_green','hgdgem_ruby','hgdkey_red','hgdgem_sapphire','hgdkey_gold','hgdgem_emerald','hgdkey_blue','hgdgem_amethyst','hgdkey_green','hgdgem_amber'];
  const deg=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a2,b2])=>open(x+a2,y+b2)).length;
  let n1=0;P.zones.filter(z=>z.type==='danger'&&!z.boss).forEach((z,zi)=>{let best=null,bd=1e9;
    // the chest stands in an open place (never in a one-square passage, where it could shut the way), or at the end of a dead end
    for(let y=z.y-z.r+2;y<=z.y+z.r-2;y++)for(let x=z.x-z.r+2;x<=z.x+z.r-2;x++){if(!free(x,y)||Math.hypot(x-z.x,y-z.y)>z.r-2)continue;
      for(const [a2,b2] of [[1,0],[-1,0],[0,1],[0,-1]]){const cx=x+a2,cy=y+b2;if(!free(cx,cy))continue;const ok=interior(cx,cy)||deg(cx,cy)===1;if(!ok)continue;const d=Math.hypot(x-z.x,y-z.y);if(d<bd){bd=d;best=[x,y,cx,cy]}}}
    if(!best)return;take(best[0],best[1]);take(best[2],best[3]);const b=HGDF_BOSS[z.mon]?'hgdb_'+z.mon:'hgdb_mixed';L.enemies.push({t:b,x:best[0],y:best[1]});
    L.decor.push({k:['hg_chestjelly','hg_chestwax','hg_chestweed'][zi%3],x:best[2],y:best[3],block:true,hgdTier:3,hgdGive:[GIVE[zi%GIVE.length]]});z.champion=HGDF_BOSS[z.mon]?HGDF_BOSS[z.mon][1]:'The Hollow Beast';n1++});
  // 2) notes on the walls of the corridors, spread over the maze, a few in the safe places too
  const NW=[[0,-1],[1,0],[0,1],[-1,0]];let n2=0,tries=0;const noted=[];
  while(n2<44&&tries++<6000){const x=3+((rnd()*(W-6))|0),y=3+((rnd()*(H-6))|0);if(!free(x,y)||kind[y*W+x]||noted.some(p=>Math.hypot(p[0]-x,p[1]-y)<14))continue;
    const w=NW.find(([a,b])=>!open(x+a,y+b)&&rows[y+b]&&rows[y+b][x+a]!=='.');if(!w)continue;
    take(x,y);noted.push([x,y]);L.decor.push({k:'hl_p_note',x,y,wd:[w[0],w[1]],pic:1,block:false,walk:true,deco:true,npc:'hgd_note',note:n2,bob:.6});n2++}
  // 3) statues and plinths in the atriums; lamps and villagers in the towns
  let n3=0,n4=0,n5=0;
  for(const s of M.spots.filter(q=>q.type===3&&!q.boss)){for(let k=0;k<2;k++){for(let t=0;t<40;t++){const x=s.x-s.r+2+((rnd()*(2*s.r-3))|0),y=s.y-s.r+2+((rnd()*(2*s.r-3))|0);if(free(x,y)&&interior(x,y)&&kind[y*W+x]===3&&L.fmap[y][x]!=='5'&&Math.hypot(x-s.x,y-s.y)>2){take(x,y);L.decor.push({k:k?'hgtb_deco_pearlplinth':'hgtb_deco_shellstatue',x,y,block:true});n3++;break}}}}
  P.zones.filter(z=>z.town!==undefined).forEach((z,zi)=>{let lamps=0,vill=0;
    for(let t=0;t<200&&(lamps<4||vill<3);t++){const x=z.x-8+((rnd()*17)|0),y=z.y-8+((rnd()*17)|0);if(Math.hypot(x-z.x,y-z.y)>8||!free(x,y)||!interior(x,y))continue;
      if(lamps<4&&t%2===0){take(x,y);L.decor.push({k:'hg_lamp',x,y,block:true});lamps++;n4++}
      else if(vill<3){take(x,y);const id=zi*3+vill;L.decor.push({k:'hg_npc'+(1+(id%5)),x,y,block:true,npc:'hgd_vill'+id,sc:1});vill++;n5++}}});
  L._hgdf={champions:n1,notes:n2,statues:n3,lamps:n4,villagers:n5}}
const hgdmrngSafe=hgdmRng;
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgds)try{hgdfBuild(L)}catch(e){console.error('hgdf',e)}}}
