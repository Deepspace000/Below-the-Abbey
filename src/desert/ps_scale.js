/* ps_scale.js: sizes in the Pale Spire (owner request, 30 Oct 2026).
   1. PEOPLE. A normal person in the rest of the game stands 0.8 to 1.0 squares tall (kh_ohfolk 0.98, priest .84, guard .86, child .62, the Wenlock and Oldhaven folk
      .8 to 1.0). The castle's people were painted into the table at 1.4 to 1.9 (prisoners, courtiers, servants, every ghost). After every castle level is built, every
      person and ghost standing in it is brought down to that scale: height x 0.57 (so 1.7 becomes 0.97, a tall 1.9 becomes 1.08, a short 1.4 becomes 0.8),
      children and the choir to 0.7 and the ghost hound to 0.54. The walls, doors and ceilings are not touched, and the feet stay where they were (a picture is drawn
      from its feet up; a ghost keeps its own small float). Talking and clicking work on the square, so they do not change.
      People who share a picture with a creature (the gardener, Lady Ysmay, the falconer use the creature pictures) are scaled on their own decor entry (sc), so the creature stays as it is.
      Human statues you can speak to (saints, bishop, headless knight) come down to about 1.3: still bigger than a person, but not towering.
      A giant stays a giant: the Judge and Hydra statues are not touched.
   2. CREATURES IN A FIGHT. The fit-to-window rule (fitScale in index.html: a creature may stand .8 tall, because seen from the next square a taller one is cut off at the
      top) had a floor of 0.3 of the drawn size, so anything taller than 2.7 squares, and a flier lifted off the floor, still came out too high; and a wide creature in a
      group hid the ones standing behind it. For everything below 3.0 squares tall the rule now has no floor (height plus float never above .8), and a creature (other than the great aboveParty ones)
      creature is never drawn wider than 1 square. Giants (3.0 and up) and the creatures listed in HUGE_FOES stay as they are. tools/ps_battle_audit.py checks all of it. */
/* the castle's soldiers and officers are people in armour: they stand a little taller than a villager, not twice as tall (owner: the Gate Captain was too tall). Done once, after the pictures are in. */
const PSS_SOLDIERS={psgatecaptain:1.25,pshalberd:1.2,pssentinel:1.25,psguard:1.1,psarcher:1.05,psarmour:1.15,psofficer:1.15,psturnkey:1.2,psquestioner:1.3,psteward:1.3,pssacristan:1.2,pscarver:1.2,psarmourer:1.15};
let PSS_SOLD_DONE=false;
function pssSoldiers(){
  if(PSS_SOLD_DONE||!PSP.picsReady)return;PSS_SOLD_DONE=true;
  for(const t in PSS_SOLDIERS){const d=ENEMY_DEF[t];if(!d)continue;const h=PSS_SOLDIERS[t];d.ph=h;
    if(typeof d.img==='string'&&IMG[d.img]){const im=IMG[d.img];d.w=+(h*im.width/im.height).toFixed(2);NPC_H[d.img]=h}
    if(typeof HUGE_FOES!=='undefined'){const i=HUGE_FOES.indexOf(t);if(i>=0)HUGE_FOES.splice(i,1)}}}
const PSS_SEEN={};
function pssTarget(k,h){
  if(/ghost_hound|hhound|_hound$/.test(k))return h>.7?+(h*.6).toFixed(2):h;
  if(/child|choir/.test(k))return h>.75?.7:h;
  if(/^ps_st_(saint\d*|bishop|headless)$/.test(k))return h>1.35?+(h*.6).toFixed(2):h;
  if(h>1.15)return +(h*(h>1.25?.57:.6)).toFixed(2);
  return h}
function pssPeople(L){
  pssSoldiers();
  if(!L||!L.decor)return;
  for(const d of L.decor){
    const k=d.k;if(typeof k!=='string')continue;
    if(/^ps_(p_|gh_|ghost_)/.test(k)||(d.npc&&/^ps_st_(saint\d*|bishop|headless)$/.test(k))){
      const h=NPC_H[k];if(h===undefined||PSS_SEEN[k]===h)continue;
      NPC_H[k]=pssTarget(k,h);PSS_SEEN[k]=NPC_H[k]}
    else if(d.npc&&/^ps_c_/.test(k)&&!d._pss){                       // a person drawn with a creature's picture: scale this one decor entry only
      const h=NPC_H[k];d._pss=1;if(!h)continue;const t=pssTarget(k,h);if(t<h)d.sc=+((d.sc||1)*t/h).toFixed(3)}}}
/* every castle level is scaled right after it is built (this wraps the curate wrapper, so it runs last) */
{for(const info of PSP.LEVELS){const id=info.id,orig=KH_LAZY[id];if(!orig||orig._pss)continue;
  const w=()=>{const lv=orig();try{pssPeople(LEVELS[id]||lv)}catch(e){console.error('ps scale',id,e)}return LEVELS[id]||lv};w._pss=1;w._psc=orig._psc;KH_LAZY[id]=w}}
/* the halls' picture loader sets the ghost heights again when the hall is entered, so the people on screen are checked every frame (a short list of keys, so it costs nothing) */
{const _sl=spriteList;let cD=null,cN=-1,keys=[];
  spriteList=function(){
    if(LEVEL>=9710&&LEVEL<=9998){try{const D=G.decor||[];
      if(D!==cD||D.length!==cN){cD=D;cN=D.length;pssPeople({decor:D});const q=new Set();for(const d of D)if(typeof d.k==='string'&&(/^ps_(p_|gh_|ghost_)/.test(d.k)||/^ps_st_(saint\d*|bishop|headless)$/.test(d.k)))q.add(d.k);keys=[...q]}
      for(const k of keys){const h=NPC_H[k];if(h!==undefined&&PSS_SEEN[k]!==h){NPC_H[k]=pssTarget(k,h);PSS_SEEN[k]=NPC_H[k]}}}catch(e){}}
    return _sl.apply(this,arguments)}}
/* creatures: the fit-to-window rule without the 0.3 floor, and a width limit so a group does not hide itself */
{const _fit=fitScale,cache=new Map();
  fitScale=function(t,def,base){
    const v0=_fit.apply(this,arguments);
    if(!base||!def||HUGE_FOES.includes(t))return v0;
    const key=def.img+'|'+def.w+'|'+(def.fly?def.floatH:'g')+'|'+(def.boss?1:0)+(def.aboveParty?1:0);let v=cache.get(key);
    if(v===undefined){
      const A=IMG[def.img+'A'],h0=def.w*base.height/base.width,h1=A?def.w*A.width/base.width*A.height/A.width:0,h=Math.max(h0,h1),fl=def.fly?(def.floatH!==undefined?def.floatH:.3):0;
      if(h<=0)v=1;
      else if(def.ntg){v=Math.min(1,Math.max(.1,(.85-fl)/h));if(def.w>1.0)v=Math.min(v,1.0/def.w)}               // a tower guardian: a little taller than the rest (.85) but never cut off
      else if(h>=3)v=v0;                                                   // really big: as the game had it
      else{v=Math.min(1,Math.max(.1,(FIT_MAX-fl)/h));
        if(!def.aboveParty&&def.w>1.0)v=Math.min(v,1.0/def.w)}  // not wider than 1 square
      if(IMG[def.img])cache.set(key,v)}
    return v}}
