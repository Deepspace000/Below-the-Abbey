/* ==========================================================================
   THE PALE SPIRE, THE LAST PART: THE PALE TOWER (levels 9910 to 9919 and 9920; prefix psf6).
   Ten tiny rooms, one above the other, 14 x 14 each. In every room a boss stands between the stairs; a circular stair leads up, and a gilded chest holds a piece of the best gear in the
   game. Both stay shut until the boss of the room is dead. Room 1 (9910) has a teleport stone. The tenth room's stair leads up to the Throne Room (9920): a big hall with the Pale King on
   his throne (level 120), and a second teleport stone so the party can go back to shop for gear and potions.
   Bosses, gear and drops are in ps_f6_foes.js (ENEMY_DEF psf6_e1..psf6_e10, psf6_king; items pg_f6_*). Pictures: assets/ps f6rN* (see tools/PS_F6_ART.md).
   State: G.flags.psp.f6 = {boss:{N:2 when dead}, chest:{N:1 when opened}, seen, won}.
   ========================================================================== */
const PSF6={BASE:9909,THRONE:9920,N:10,W:14,
  UP:[7,3],DOWN:[7,10],LAND:[7,9],ABOVE:[7,4],BOSS:[7,5],CHEST:[10,9],
  THEME:['The Vestibule of Candles','The Bone Organ','The Clock Room','The Reliquary','The Tapestry Room','The Mirror Cabinet','The Thorn Library','The Weeping Chapel','The Crown Armoury','The Antechamber of the King'],
  INTRO:['A hall of gilded gates, thick with candle flames. Something in black and gold armour waits among them.','Great organ pipes of bone and black iron fill the walls. Somewhere a key is being held down.','Gilt clocks of every size tick out of step. Something tall stands under the biggest pendulum.','Gilded boxes and crystal cases of old bones line the walls, each with a small lamp.','Black and red tapestries hang to the floor, woven with spiders and moths. Something pale moves behind them.','Gilt mirrors with black glass cover every wall. A tall figure stands in all of them at once.','Black shelves of books run up into the dark, with thorns grown through the pages. Something sits at the desk and writes.','A small chapel of black marble and gilded cherubs. A stone saint stands at the altar, weeping.','Gilt armour stands and crossed halberds line the walls, and crowns lie on cushions. Something heavy is already awake.','The doors at the top are gilt and shaped like a throne. A hooded giant stands before them with an axe.']};
const psf6S=()=>{const P=(G.flags.psp=G.flags.psp||{}),F=P.f6=P.f6||{};F.boss=F.boss||{};F.chest=F.chest||{};return F};
const psf6Id=n=>n>=11?PSF6.THRONE:PSF6.BASE+n;
const psf6Room=id=>id===PSF6.THRONE?11:(id>PSF6.BASE&&id<=PSF6.BASE+PSF6.N?id-PSF6.BASE:0);
if(typeof TELE_KEEP_HI!=='undefined'){TELE_KEEP_HI.add(9910);TELE_KEEP_HI.add(9920)}   // the two teleport stones of the tower: room 1 and the throne room
/* a painted picture of room n (assets/ps), or null while it is not made */
const psf6Has=name=>{try{const k=pspPic(name);return k!=='gy_column'&&IMG[k]&&IMG[k].width?k:null}catch(e){return null}};
/* the painted wall of room n, cut from tile 0 of its texture sheet; the plain dark ashlar stands in until it exists */
function psf6Wall(n,wh){
  const im=IMG['ps_f6r'+n+'tex_0'];
  if(im&&im.width){IMG['gyp_pst_f6r'+n+'w']=im;return gyTile('pst_f6r'+n+'w',wh,{gain:1.25,rgb:[1,1,1],tag:'psf6w'+n+'_'+wh})}
  return pspWallGid('dark',n%5,wh)}
function psf6Dress(C,n,W,H,wh){
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(C.rows[y][x]!=='.')C.solid(x,y,C.ch(psf6Wall(n,wh)))}
const PSF6_PROP={centre:1.0,tall:1.0,hang:1.0};
function psf6Build(info){
  const id=info.id||PSF6.cur,n=psf6Room(id),W=PSF6.W,H=PSF6.W,wh=3.2;
  const C=pspMake({id,start:{x:PSF6.LAND[0],y:PSF6.LAND[1],f:0},floor:'f6f'+n,wh,amb:.3,lcol:[1.45,.85,.55],kind:'in',tele:n===1?[3,10]:undefined});
  C.room(2,2,11,11,{floor:'f6f'+n,name:PSF6.THEME[n-1],at:[7,7]});
  /* the room is small and round: everything outside a circle of radius 4.4 round the middle is wall again */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(Math.hypot(x-6.5,y-6.5)>4.4){C.rows[y][x]='#';C.block[y*W+x]=1}
  psf6Dress(C,n,W,H,wh);
  /* the stairs: a circular stair up in the north wall, one down in the south wall */
  const put=(name,x,y,o)=>{C.used.delete(x+','+y);return C.dec(pspPic(name),x,y,Object.assign({block:true},o||{}))};
  put('stair_spiral_iron',PSF6.UP[0],PSF6.UP[1],{npc:'psf6_up'+n,sc:1});
  put('stair_spiral_iron',PSF6.DOWN[0],PSF6.DOWN[1],{npc:'psf6_down'+n,sc:.9});
  /* the painted furnishing of the room: a centrepiece, two tall pieces, two hangings; red candelabras in the corners */
  const cen=psf6Has('f6r'+n+'_centre'),tal=psf6Has('f6r'+n+'_tall'),han=psf6Has('f6r'+n+'_hang');
  if(cen)C.used.delete('3,7'),C.dec(cen,3,7,{block:true,sc:PSF6_PROP.centre});
  if(tal){for(const x of [3,10]){C.used.delete(x+',4');C.dec(tal,x,4,{block:true,sc:PSF6_PROP.tall})}}
  if(han){for(const x of [5,8]){C.used.delete(x+',3');C.dec(han,x,3,{wd:[0,-1]})}}
  for(const [x,y] of [[4,4],[9,4],[4,9],[9,9]])if(C.free(x,y)){C.prop('candelabra_red',x,y,{block:true,sc:.8})}
  for(const [x,y] of [[4,4],[9,4],[7,8],[4,9],[9,9]])C.light(x,y,[1.5,.75,.5]);
  /* the boss, and the chest that opens when it is dead */
  const F=psf6S();
  if(F.boss[n]!==2)pspFoe(C,'psf6_e'+n,PSF6.BOSS[0],PSF6.BOSS[1],{lvl:Math.min(111+n,120)});
  C.used.delete(PSF6.CHEST.join(','));
  const chp=psf6Has('f6_chest');   // the painted special chest when it is made, the plain gilded one until then
  C.dec(chp||'gy_chest',PSF6.CHEST[0],PSF6.CHEST[1],{block:true,sc:chp?.9:.75,npc:'psf6_chest'+n});
  C.mapNames.push({t:PSF6.THEME[n-1],x:7,y:7,k:'place'});
  return C.finish({start:{x:PSF6.LAND[0],y:PSF6.LAND[1],f:0}})}
/* the Throne Room: a big hall, a red runner, a row of columns, the great throne at the north end, the Pale King in front of it, a teleport stone by the stair */
function psf6ThroneBuild(info){
  const id=PSF6.THRONE,W=40,H=32,wh=4.2;
  const C=pspMake({id,start:{x:20,y:26,f:0},floor:'f6f11',wh,amb:.5,lcol:[1.45,.85,.55],kind:'in',tele:[8,24]});
  C.room(4,4,35,27,{floor:'f6f11',name:'The Throne Room',at:[20,15]});
  for(let y=4;y<=27;y++)C.setFloor(19,y,21,y,'runner');
  psf6Dress(C,11,W,H,wh);
  const put=(name,x,y,o)=>{C.used.delete(x+','+y);return C.dec(pspPic(name),x,y,Object.assign({block:true},o||{}))};
  put('stair_spiral_iron',20,27,{npc:'psf6_down11',sc:.9});
  const cen=psf6Has('f6r11_centre'),tal=psf6Has('f6r11_tall'),han=psf6Has('f6r11_hang');
  if(cen)put('f6r11_centre',20,5,{sc:1});
  for(const y of [8,12,16,20,24])for(const x of [10,29]){if(tal)put('f6r11_tall',x,y,{sc:1});else C.column(x,y,'silver')}
  if(han)for(const x of [8,14,26,32])C.dec(han,x,4,{wd:[0,-1]});
  for(const [x,y] of [[7,6],[32,6],[7,23],[32,23],[16,7],[24,7]])if(C.free(x,y))C.prop('candelabra_red',x,y,{block:true,sc:.9});
  for(const x of [8,14,20,26,32])for(const y of [7,13,19,25])C.light(x,y,[1.5,.75,.5]);   // a lit hall: a candle light every six squares
  const F=psf6S();
  if(F.king!==2)pspFoe(C,'psf6_king',20,9,{lvl:120});
  pspSafeRect(C,6,22,12,26);pspSafeRect(C,17,24,23,27);
  C.mapNames.push({t:'The Throne Room',x:20,y:15,k:'place'});
  return C.finish({start:{x:20,y:26,f:0}})}
for(let n=1;n<=PSF6.N;n++)pspRegister(psf6Id(n),(info)=>psf6Build(Object.assign({},info,{id:psf6Id(n)})));
pspRegister(PSF6.THRONE,psf6ThroneBuild);
/* ---------- the stairs and the chests ---------- */
for(let n=1;n<=PSF6.N;n++){
  const dead=()=>psf6S().boss[n]===2;
  khNpc('psf6_up'+n,'The spiral stair','ps_stair_spiral_iron',()=>{
    if(!dead())return say("An iron grille is shut across the foot of the stair. It will not move while the guardian of this room is alive.",[BYE]);
    return say(n===PSF6.N?"The stair winds up to the Throne Room of the Pale King. The doors at the top are open.":"The iron stair winds up to the next room of the tower. The grille is open.",[['Go up.',()=>{G.talk=null;sfx('door');goToLevel(psf6Id(n+1),n===PSF6.N?{x:20,y:26,f:0}:{x:PSF6.LAND[0],y:PSF6.LAND[1],f:0});return null}],BYE])});
  khNpc('psf6_down'+n,'The spiral stair','ps_stair_spiral_iron',()=>say(n===1?"The iron stair winds down to the door at the foot of the Pale Tower, and the ramparts.":"The iron stair winds down to the room below.",[['Go down.',()=>{G.talk=null;sfx('door');if(n===1)goToLevel(9900,{x:32,y:35,f:2});else goToLevel(psf6Id(n-1),{x:PSF6.ABOVE[0],y:PSF6.ABOVE[1],f:2});return null}],BYE]));
  khNpc('psf6_chest'+n,'A gilded chest','gy_chest',()=>{const F=psf6S();
    if(!dead())return say("A gilded chest with a black iron lock. It will not open while the guardian of this room is alive.",[BYE]);
    /* the usual loot window: the gear and some potions are listed, you take them one by one or press Take all; what is left stays in the chest */
    if(!F.box)F.box={};
    if(!F.box[n]){const it=(typeof PSF6_GEAR!=='undefined'&&PSF6_GEAR[n-1])||null,c=[];
      if(it)c.push({id:it,n:1});for(const p of ['elixir','supermana'])if(ITEMDEF[p])c.push({id:p,n:2});
      F.box[n]={k:'chest',contents:c,gold:2500+n*700,hs:1}}
    const b=F.box[n];
    if(!b.contents.length&&b.goldTaken)return say("The chest is empty.",[BYE]);
    G.talk=null;openLoot(b);if(G.loot)G.loot.name='Gilded chest';F.chest[n]=1;return null});
}
khNpc('psf6_down11','The spiral stair','ps_stair_spiral_iron',()=>say("The iron stair winds down to the Antechamber of the King.",[['Go down.',()=>{G.talk=null;sfx('door');goToLevel(psf6Id(10),{x:PSF6.ABOVE[0],y:PSF6.ABOVE[1],f:2});return null}],BYE]));
/* ---------- arriving ---------- */
/* a boss is as wide as its picture is */
function psf6Fit(){for(let i=1;i<=11;i++){const d=ENEMY_DEF[i===11?'psf6_king':'psf6_e'+i],im=IMG['ps_f6r'+i+'_foe'];if(d&&im&&im.width&&d.ph)d.w=+(d.ph*im.width/im.height).toFixed(2)}}
pspOnArrive(n=>{const r=psf6Room(n);if(!r)return;try{psf6Fit();const F=psf6S();for(const L of LIGHTS)L.calm=true;   // steady candle light
  if(r<=PSF6.N){if(F.boss[r]===2)for(let i=G.enemies.length-1;i>=0;i--)if(G.enemies[i].t==='psf6_e'+r)G.enemies.splice(i,1);
    const dd=G.decor&&G.decor.find(d=>d.npc==='psf6_chest'+r);
    if(!F.seen)F.seen={};if(!F.seen[r]){F.seen[r]=1;msg(PSF6.INTRO[r-1],'#d8e4ff')}}
  else{if(F.king===2)for(let i=G.enemies.length-1;i>=0;i--)if(G.enemies[i].t==='psf6_king')G.enemies.splice(i,1);
    if(!F.seen)F.seen={};if(!F.seen[11]){F.seen[11]=1;msg('A great black hall, as long as a church, with a red runner down the middle. At the far end the Pale King sits on a gilded throne, as still as a statue. There is a teleport stone by the stair. If you need more gear or potions, you can go back and shop, and come up again.','#ffe0a0')}}}catch(e){console.error('psf6 arrive',e)}});
/* the Pale King is dead: the end of the Pale Tower (ps_f6_foes.js calls this) */
function psf6Won(){const F=psf6S();if(F.won)return;F.won=1;F.king=2;try{f2Chime('open')}catch(e){}
  msg('The Pale King falls from his throne and does not rise. The great hall goes quiet, and the green light in the windows goes out one pane at a time. The Pale Spire is empty.','#ffe0a0');if(typeof psq50Done==='function')psq50Done();if(typeof psf6Ending==='function')psf6Ending()}
