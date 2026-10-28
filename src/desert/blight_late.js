/* ==========================================================================
   THE BLIGHTED ROAD, PLACES 8 TO 10: SHARED HELPERS (prefix bl3 / BL3). Used by blight_hollowbell.js (9680), blight_rookery.js (9690) and blight_palebridge.js (9700).
   - bl3Q: a quest in the region The Blighted Lands.  bl3Tint: a filtered copy of a painted picture (greyed, ghostly, silver).  bl3Ghost: a pale see-through copy of a person.
   - bl3Door: a stair, ladder or door between levels as a talking object.  bl3Take: an object that gives one item once.
   - bl3Kill / bl3Hit: a function called when a creature type dies, or after each blow on it (bosses: flags, drops, phases).
   - bl3Hide: a person or object that is taken off the map when a flag is set (applied on every arrival, because levels are built once).
   - bl3Prop(C,name,x,y,o): a Wenlock interior prop in a room.
   Flags: G.flags.bl (see blF). Quest ids used by these three places: blq40 to blq51.
   ========================================================================== */
const BL3={hide:[],kill:{},hit:{},arrive:[]};
function bl3OnArrive(fn){BL3.arrive.push(fn)}
function bl3Q(id,title,who,steps,reward,extra){const q=yrQ(id,title,who,steps,reward,extra);QAREA[id]=BL.REGION;return q}
function bl3Tint(key,src,filter,h){
  const im=typeof src==='string'?IMG[src]:src;if(!im||!im.width)return false;
  const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');try{x.filter=filter}catch(e){}x.drawImage(im,0,0);IMG[key]=c;
  if(h)NPC_H[key]=h;else if(typeof src==='string'&&NPC_H[src])NPC_H[key]=NPC_H[src];return true}
/* a person drawn pale and a little see-through: a ghost (a filter over the painted person, nothing drawn) */
function bl3Ghost(key,src){if(IMG[key])return key;if(!bl3Tint(key,src,'saturate(.15) brightness(1.25) opacity(.72)'))return src;return key}
function bl3Door(id,name,pic,lvl,at,text,btn,o){
  khNpc(id,name,pic,()=>say(text,[[btn,()=>{sfx('door');G.talk=null;goToLevel(lvl,typeof at==='function'?at():at);return null}],BYE]));return id}
/* an object that gives an item once. o: {sc, bob, solid} ; before/after: texts; the flag lives in G.flags.bl */
function bl3Take(id,name,pic,flag,item,before,after,btn,msgText,extra){
  khNpc(id,name,pic,d=>{const F=blF();
    if(F[flag])return say(after,[BYE]);
    return say(before,[[btn,()=>{F[flag]=1;if(d){d.found=true;d.hidden=true}
      if(item&&!bagAdd(mkItem(item)))G.items.push({k:item,x:G.P.x,y:G.P.y,taken:false});
      if(extra)try{extra(F)}catch(e){console.error(e)}
      sfx('key');msg(msgText,'#ffe36a');return null}],BYE])});return id}
function bl3Kill(t,fn){BL3.kill[t]=fn}
function bl3Hit(t,fn){BL3.hit[t]=fn}
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(e&&BL3.hit[e.t]&&e.hp>0)BL3.hit[e.t](e);if(was&&e.hp<=0&&BL3.kill[e.t])BL3.kill[e.t](e)}catch(x){console.error('bl3 hurt',x)}
  return r}}
/* taken off the map when fn() is true (a person who has gone, a thing that was picked up) */
function bl3Hide(level,npcId,fn){BL3.hide.push([level,npcId,fn])}
function bl3Apply(n){
  if(!G.decor)return;
  for(const [lv,id,fn] of BL3.hide){if(lv!==n)continue;let on=false;try{on=fn()}catch(e){}
    for(const d of G.decor)if(d.npc===id){if(on){if(!d.hidden){d.found=true;d.hidden=true;d._bl3=1;d._blk=d.block;d.block=false}}else if(d._bl3&&d.hidden){d.found=false;d.hidden=false;d._bl3=0;d.block=!!d._blk}}}}
{const _a=blArrive;blArrive=function(n){_a.apply(this,arguments);try{for(const f of BL3.arrive)f(n);bl3Apply(n)}catch(e){console.error('bl3 arrive',e)}}}
function bl3Prop(C,n,x,y,o){try{wlinProp(C,n,x,y,o)}catch(e){C.raw('crate',x,y,{})}}
/* every hero heals (shrines, bells, thanks) */
function bl3Heal(){try{G.heroes.forEach(h=>{if(h.alive){h.hp=h.max;h.mp=h.mpMax}})}catch(e){}}
/* put an item in the bag, or on the ground if the bag is full */
function bl3Give(item){if(!bagAdd(mkItem(item)))G.items.push({k:item,x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false})}
/* a cell near (x,y) free of creatures, for a creature that is added while playing */
function bl3Near(x,y,r){const L=LEVELS[LEVEL],W=L.rows[0].length;
  const bs=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));
  for(let k=0;k<=r;k++)for(let dy=-k;dy<=k;dy++)for(let dx=-k;dx<=k;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==k)continue;const a=Math.round(x)+dx,b=Math.round(y)+dy;
    if(a<2||b<2||a>=W-2||b>=L.rows.length-2||L.rows[b][a]!=='.'||bs.has(a+','+b))continue;
    if(TERRS[LEVEL]&&TERRS[LEVEL].block&&TERRS[LEVEL].block[b*W+a])continue;
    if(G.enemies.some(e=>e.hp>0&&Math.round(e.x)===a&&Math.round(e.y)===b))continue;return [a,b]}
  return null}
/* a creature added while playing (a wave, a summons): it is awake and takes the level of the place */
function bl3Add(t,x,y,lvl){const q=bl3Near(x,y,4);if(!q)return null;addEnemy(t,q[0],q[1],true);const m=G.enemies[G.enemies.length-1];if(m&&lvl){m.lvl=lvl}return m}
