/* ==========================================================================
   THE PILGRIM'S PATH, COMPLETED. A stone teleporter stands beside every fifth signpost (95, 90 ... 5 km to Yarrim) and another by the cliff above
   Yarrim: twenty in all. When the party has woken every one, an achievement comes up, with 1000 gold and the armour of a powerful abbot in the
   backpack: a mitre, a chasuble of plate, cuffs and robe-hem greaves, with a set bonus. Any class may wear it.
   ========================================================================== */
const PP_KMS=[95,90,85,80,75,70,65,60,55,50,45,40,35,30,25,20,15,10,5,0];
function ppCount(){const f=(G.flags&&G.flags.lpKm)||{};return PP_KMS.filter(k=>f[k]).length}
const PP_SET=[ // [id, slot, name, type, picture, armour, effects, what it is]
 ['pp_h','head','Abbot’s Mitre of the Pilgrim’s Path','Helm','head',22,{ward:12,secondWind:.5},'A tall white and gold mitre with a blue gem and a golden cross.'],
 ['pp_c','chest','Abbot’s Chasuble Plate','Chest','chest',40,{regen:.9,dodge:.08},'Plate cut like the vestment of an abbot, with a long red and gold stole.'],
 ['pp_a','arms','Abbot’s Embroidered Cuffs','Arms','arms',14,{lifesteal:.1,dmgPct:.12},'Wide cuffs of white and gold plate, sewn with small golden crosses.'],
 ['pp_l','legs','Abbot’s Pilgrim Greaves','Legs','legs',18,{mpRegen:.6,hungerSlow:.5},'Greaves like the hem of a robe, with golden pilgrim sandals.']];
const PP_BONUS={ward:10,regen:1.2,secondWind:.5,dmgPct:.15,dodge:.08};
{const btxt=Object.keys(PP_BONUS).map(k=>ARM_TXT[k](PP_BONUS[k])).join(' ');
 ARM_SET_OF.abbot={name:'Abbot of the Pilgrim’s Path',bonus:PP_BONUS,btxt,lv:1,key:'abbot'};
 for(const [id,slot,n,ty,ic,armor,pas,what] of PP_SET){
   ITEMDEF[id]={n,k:slot,t:ty,ic,c:'#e8d890',armor,price:9000,lvl:1,pas,set:'abbot',rar:1,
     d:`${what} ${Object.keys(pas).map(k=>ARM_TXT[k](pas[k])).join(' ')} Set bonus (all four): ward 10, regeneration, second wind, +15% damage, dodging. Any class.`,sw:slot==='chest'?.46:.38,gear:1}}
 if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...PP_SET.map(q=>q[0]))}
CUTS.pilgrimDone=()=>[{text:'ACHIEVEMENT. You have completed the pilgrim’s path.'},{text:'Look for a reward in your backpack...'}];
function ppReward(){
  const F=G.flags;if(F.lpAbbot)return;F.lpAbbot=1;G.gold+=1000;
  for(const [id] of PP_SET){if(!bagAdd(mkItem(id)))G.items.push({k:id,x:G.P.x,y:G.P.y,taken:false})}
  msg('Achievement: You have completed the pilgrim’s path. Look for a reward in your backpack... (1000 gold and the armour of an abbot)','#ffe36a');sfx('win');
  startCut('pilgrimDone');
}
function ppStep(nx,ny){
  const L=LEVELS[LEVEL];if(!L||L._stoneKm===undefined||L._stoneKm===null||!G.tele||nx!==G.tele.x||ny!==G.tele.y)return;
  const F=G.flags;F.lpKm=F.lpKm||{};
  if(!F.lpKm[L._stoneKm]){F.lpKm[L._stoneKm]=1;msg(`Pilgrim stone lit: ${ppCount()} of 20.`,'#a8d8ff')}
  if(!F.lpAbbot&&ppCount()>=PP_KMS.length)ppReward();
}
{const _ts=teleStep;teleStep=function(nx,ny){_ts.apply(this,arguments);try{ppStep(nx,ny)}catch(e){console.error(e)}}}
