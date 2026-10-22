/* ==========================================================================
   THE CHURCHES OF THE MAZE (prefix hgdch / HGDCH). Each of the eight maze towns has a small church near its shops: a frog priest stands in front of a painted chapel (the picture is drawn behind the priest by
   hgd_stalls.js, assets/ds_hgstall_church.png). The priest will heal the whole party for a small gift, raise a fallen hero, lift a curse or a haunting, and cure sicknesses (30 gold each).
   ========================================================================== */
const HGDCH={NAMES:['Father Ripple','Sister Reed','Brother Mossback','Mother Brook','Elder Tadwick','Sister Marsh','Father Lilywick','Brother Croakley'],IMG:['hg_npc2','hg_npc4','hg_npc1','hg_npc5','hg_npc3','hg_npc2','hg_npc4','hg_npc1'],TOWN:['Hedgefoot','Cairnhold','Combwick','Nacre Landing','Dunewell','Blue Lantern','Tessera','Gildmere']};
const hgdchLvl=()=>{const a=G.heroes||[];return Math.max(1,Math.round(a.reduce((n,h)=>n+h.lvl,0)/Math.max(1,a.length)))};
for(let t=0;t<8;t++){
  const id='hgd_church'+t,name=HGDCH.NAMES[t]+', the priest of '+HGDCH.TOWN[t];
  khNpc(id,name,HGDCH.IMG[t],d=>{
    const lvl=hgdchLvl(),heal=4*lvl+10,raise=40*lvl,hurt=G.heroes.some(h=>h.alive&&(h.hp<h.max||h.mp<h.mpMax)),dead=G.heroes.map((h,i)=>h.alive?-1:i).filter(i=>i>=0);
    const opts=[];
    opts.push(['Ask for healing ('+heal+' gold)',()=>{
      if(!hurt)return say('You are all in good health. Keep your gold, and walk with care.',[BYE]);
      if(G.gold<heal)return say('The church asks '+heal+' gold for the candles and the herbs. Come back when you have it.',[BYE]);
      G.gold-=heal;G.heroes.forEach(h=>{if(h.alive){h.hp=h.max;h.mp=h.mpMax}});sfx('heal');return say('The priest lays a wet green hand on each of you and murmurs the old words. Your hurts close, and your strength comes back.',[BYE])}]);
    if(dead.length)opts.push(['Raise '+HERO_DEF[dead[0]].name+' ('+raise+' gold)',()=>{
      if(G.gold<raise)return say('Raising the dead costs '+raise+' gold, and the church cannot do it for less.',[BYE]);
      G.gold-=raise;const h=G.heroes[dead[0]];h.alive=true;h.hp=Math.max(1,Math.ceil(h.max/2));sfx('heal');return say('The bells ring, and '+HERO_DEF[dead[0]].name+' breathes again.',[BYE])}]);
    try{if(typeof afflCureOn==='function'&&typeof afflList==='function'&&afflList().some(e=>{const A=AFFL[e.id];return A&&(A.cureOn||[]).includes('church')}))opts.push(['Ask the priest to lift a curse or a haunting',()=>{const c=afflCureOn('church');sfx('heal');return say(c?'He lays a hand on each of you and says the old words. The weight lifts.':'You carry no curse that he can lift.',[BYE])}])}catch(e){}
    try{if(typeof afflHealOptions==='function')opts.push(...afflHealOptions(30))}catch(e){}
    opts.push(BYE);
    return say('Welcome to the church of '+HGDCH.TOWN[t]+'. The roof leaks, the bell is cracked, and the door is always open. Do you need healing, or a prayer?',opts)});
}
function hgdchPlace(L){
  if(L._hgdch||!L._hgds2)return;const rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.',occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y)),out=[];
  for(let t=0;t<8;t++){
    const sh=L._hgds2.shops.filter(s=>s[1]===t);if(!sh.length)continue;
    const cx=Math.round(sh.reduce((n,s)=>n+s[2],0)/sh.length),cy=Math.round(sh.reduce((n,s)=>n+s[3],0)/sh.length);let done=false;
    for(let strict=1;strict>=0&&!done;strict--)for(let r=1;r<16&&!done;r++)for(let dy=-r;dy<=r&&!done;dy++)for(let dx=-r;dx<=r&&!done;dx++){
      if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=cx+dx,y=cy+dy;if(!open(x,y)||occ.has(x+','+y))continue;
      if(sh.some(s=>Math.abs(s[2]-x)+Math.abs(s[3]-y)<2))continue; // not right on top of a shopkeeper
      let free=0;for(let ay=-1;ay<=1;ay++)for(let ax=-1;ax<=1;ax++)if((ax||ay)&&open(x+ax,y+ay)&&!occ.has((x+ax)+','+(y+ay)))free++;
      if(free<(strict?8:6))continue;
      occ.add(x+','+y);L.decor.push({k:HGDCH.IMG[t],x,y,block:true,npc:'hgd_church'+t,sc:.72});out.push([t,x,y]);done=true}}
  L._hgdch={churches:out}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdp&&L.decor)try{hgdchPlace(L)}catch(e){console.error('hgdch',e)}}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('Every town has a little church near its shops. The priest heals for a few coins, and will raise the fallen if you can pay.');
