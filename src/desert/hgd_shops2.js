/* ==========================================================================
   THE SHOPS OF THE MAZE (prefix hgds2 / HGDS2). Every kind of shop the rest of the game has now works in each of the eight towns of the Deeper Hollow:
   a weaponsmith (swords, maces, axes, bows, staves), an armourer, a magic seller, a general trader and an inn (a bed, food). Added to the shops already there.
   ========================================================================== */
const HGDS2_KINDS=[
  {id:'arms',role:'weaponsmith',img:['hg_npc3','hg_npc1','hg_npc4'],names:['Brand','Hild','Ketter','Osk','Varn','Mara','Dagny','Tor'],title:'Weaponsmith',greet:'Swords, maces, axes and bows, made for this maze. Nothing here will snap on the first slug.'},
  {id:'armour',role:'armourer',img:['hg_npc4','hg_npc2','hg_npc5'],names:['Gunnar','Sigrun','Aldric','Edda','Rolf','Tilde','Bram','Hedda'],title:'Armourer',greet:'Helms, plate, shields and greaves. A good set of armour is cheaper than a bad funeral.'},
  {id:'magic',role:'magic seller',img:['hg_npc5','hg_wizard','hg_npc1'],names:['Syl','Orrin','Vesper','Mirel','Quill','Anwen','Lorn','Isolde'],title:'Magic Seller',greet:'Scrolls, rings, staves and draughts of mana. I do not take questions about where I got them.'},
  {id:'trader',role:'trader',img:['hg_npc2','hg_npc4','hg_npc3'],names:['Pim','Sabel','Tobb','Wren','Cask','Nell','Harl','Dorrit'],title:'General Trader',greet:'Torches, lanterns, rope, food, herbs. Everything a traveller forgets until it is dark.'},
  {id:'inn',role:'innkeeper',img:['hg_npc1','hg_npc3','hg_npc5'],names:['Mother Tansy','Old Garrick','Big Hesper','Little Joss','Marta','Ferris','Dame Orla','Cob'],title:'Inn',greet:'A bed, a hot meal and a roof with no slugs in it. Sixty gold a night, and you wake healed.'}];
const HGDS2_PLACE=['Hedgefoot','Cairnhold','Combwick','Nacre Landing','Dunewell','Blue Lantern','Tessera','Gildmere'];
const hgds2Items=f=>Object.keys(ITEMDEF).filter(id=>f(ITEMDEF[id],id));
function hgds2Stock(kind,town){
  const pick=(list,n)=>{const out=[];for(let i=0;i<n&&list.length;i++)out.push(list[(town*3+i*5)%list.length]);return Array.from(new Set(out))};
  if(kind==='arms'){
    const base=KH_STOCK.arms().map(r=>[r[0],Math.min(r[1],3)]);
    const tier=hgds2Items(d=>!d.rar&&d.k==='weapon'&&d.lvl>=15&&d.lvl<=50&&(d.price||0)>0&&(d.price||0)<=7000&&!/Harpoon|Scimitar/.test(d.n)).sort((a,b)=>(ITEMDEF[a].lvl-ITEMDEF[b].lvl)||(ITEMDEF[a].price-ITEMDEF[b].price));
    return base.concat(pick(tier,7).map(id=>[id,1]))}
  if(kind==='armour'){
    const base=KH_STOCK.armour().map(r=>[r[0],Math.min(r[1],3)]);
    const sets=['iron','ember','void'],set=sets[town%3],set2=sets[(town+1)%3];
    const pieces=[];for(const s of [set,set2])for(const p of ['h','c','a','l'])if(ITEMDEF['ar_'+s+'_'+p])pieces.push(['ar_'+s+'_'+p,1]);
    const more=hgds2Items(d=>(d.k==='shield'||d.k==='head'||d.k==='chest'||d.k==='legs')&&d.lvl>=20&&d.lvl<=50&&(d.price||0)<=4000&&!/^ar_/.test(d.n||'')).filter(id=>!/^ar_/.test(id));
    return base.concat(pieces,pick(more,3).map(id=>[id,1]))}
  if(kind==='magic'){
    const spells=hgds2Items(d=>d.k==='spell'),rings=hgds2Items(d=>d.k==='ring'&&(d.price||0)<=4000),staves=hgds2Items(d=>!d.rar&&d.k==='weapon'&&d.t==='Staff'&&d.lvl>=10&&d.lvl<=50&&(d.price||0)<=7000);
    return KH_STOCK.scroll().concat(spells.map(id=>[id,2]),pick(rings,4).map(id=>[id,1]),pick(staves,2).map(id=>[id,1]),[['manadraught',4],['greatermana',2],['supermana',1]].filter(r=>ITEMDEF[r[0]]))}
  if(kind==='trader')return KH_STOCK.general().concat([['torch',8],['bread',8],['cheese',6],['water',8],['potion',4],['antidote',3]].filter(r=>ITEMDEF[r[0]]));
  return KH_STOCK.food()}
for(const K of HGDS2_KINDS)for(let t=0;t<8;t++){
  const id='hgd_s2_'+K.id+t,name=K.names[t]+', the '+K.role+' of '+HGDS2_PLACE[t],img=K.img[t%K.img.length];
  khNpc(id,name,img,d=>{
    const nodeFn=()=>{
      if(K.id==='inn')return hgdNode(K.greet,[['Take a room (60 gold)',()=>{if(G.gold<60)return hgdNode('A bed costs sixty gold, and you do not have it.',[BYE],nodeFn);G.gold-=60;restParty(true);return hgdNode('You sleep soundly in a safe place. Everyone wakes healed and fed.',[BYE],nodeFn)}],['Browse the food',()=>{openShop(G.talk.d,KH_STOCK.food(),K.title);return null}],BYE],nodeFn);
      return hgdNode(K.greet,[['Browse the wares',()=>{openShop(G.talk.d,hgds2Stock(K.id,t),K.title);return null}],BYE],nodeFn)};
    return nodeFn()})}
function hgds2Place(L){
  if(L._hgds2)return;const P=L._hgdp,rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.',occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y)),out=[];
  const towns=P.zones.filter(z=>z.type==='safe'&&z.town!==undefined).sort((a,b)=>a.town-b.town);
  towns.forEach((z,t)=>{HGDS2_KINDS.forEach((K,ki)=>{
    let done=false;
    for(let strict=1;strict>=0&&!done;strict--)for(let r=1;r<12&&!done;r++)for(let dy=-r;dy<=r&&!done;dy++)for(let dx=-r;dx<=r&&!done;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=z.x+dx,y=z.y+dy;if(!open(x,y)||occ.has(x+','+y))continue;
      let free=0;for(let ay=-1;ay<=1;ay++)for(let ax=-1;ax<=1;ax++)if((ax||ay)&&open(x+ax,y+ay)&&!occ.has((x+ax)+','+(y+ay)))free++;
      if(free<(strict?8:6))continue;
      occ.add(x+','+y);L.decor.push({k:K.img[t%K.img.length],x,y,block:true,npc:'hgd_s2_'+K.id+t,sc:.72});out.push([K.id,t,x,y]);done=true}})});
  L._hgds2={shops:out}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdp&&L.decor)try{hgds2Place(L)}catch(e){console.error('hgds2',e)}}}
