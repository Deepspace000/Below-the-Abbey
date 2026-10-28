/* ==========================================================================
   FISHING RODS IN THE HAND, BAIT ON THE ROD (prefix frd). A rod (item kind 'tool', frod set) fits the MAIN HAND of any hero: the Equip button, the E key,
   a tap on the main hand slot and a drag to it all work. A hero who holds a rod fights bare-handed, as with a torch; the weapon it replaced goes back to the
   hand when the rod is taken off, if it is still in the bag. fshBestRod (fishing.js) counts a rod in any hero's hand as well as one in the bag.
   A bait (fbait set) gets an 'Add to the rod' button on its card in the bag (and the E key): it becomes the bait of the next casts (G.flags.fishBait,
   which the Bait button on the fishing prompt shows and cycles). On the card of the chosen bait the button reads 'Take off the rod'.
   ========================================================================== */
const frdRod=d=>!!d&&d.frod!==undefined;
const frdIsBait=d=>!!d&&d.fbait!==undefined;
{const _sf=slotFits;slotFits=function(slot,d,hi){if(frdRod(d))return slot==='main';return _sf.apply(this,arguments)}}
{const _as=autoSlot;autoSlot=function(hi,d){if(frdRod(d))return 'main';return _as.apply(this,arguments)}}
{const _et=equipTo;equipTo=function(hi,slot,bagIdx){
  const it=G.bag[bagIdx],d=it&&idef(it);
  if(frdRod(d)){
    if(slot!=='main'){msg('A fishing rod is held in the main hand.','#d09a80');return false}
    const h=G.heroes[hi],old=h.eq.main,ok=_et.apply(this,arguments);
    if(ok){if(old&&!frdRod(idef(old)))h.prevMain=old.id;msg(HERO_DEF[hi].name+' fights bare-handed while the '+d.n+' is in the hand.','#a8d8f0')}
    return ok}
  return _et.apply(this,arguments)}}
{const _ue=unequip;unequip=function(hi,slot){
  const h=G.heroes[hi],it=h.eq[slot],wasRod=it&&slot==='main'&&frdRod(idef(it)),ok=_ue.apply(this,arguments);
  if(ok&&wasRod&&h.prevMain){const i=G.bag.findIndex(b=>b.id===h.prevMain);h.prevMain=null;if(i>=0&&!h.eq.main)equipTo(hi,'main',i)}
  return ok}}
/* the bait: put on the rod, or taken off */
function frdBaitToggle(it){
  const d=ITEMDEF[it.id],rod=typeof fshBestRod==='function'?fshBestRod():null;
  if(!rod){msg('You need a fishing rod first.','#d09a80');return}
  const rn=ITEMDEF[rod[0]].n;
  if(G.flags.fishBait===it.id){G.flags.fishBait='';msg('You take the '+d.n+' off the line of the '+rn+'.','#bfe0f4');sfx('equip');return}
  G.flags.fishBait=it.id;sfx('equip');msg('You fix the '+d.n+' to the line of the '+rn+'.','#bfe0f4')}
const frdSelBait=()=>{const I=G.inv;if(!I||!I.open||!I.sel||I.sel.src!=='bag'||I.tab==='powers'||I.tab==='char')return null;const it=G.bag[I.sel.i];return it&&frdIsBait(ITEMDEF[it.id])?it:null};
{const _di=drawInventory;drawInventory=function(){const r=_di.apply(this,arguments);
  try{const it=frdSelBait();if(it&&G.inv.dropKey!=='b'+G.inv.sel.i)btnText('frdbait',G.flags.fishBait===it.id?'Take off the rod':'Add to the rod',338,141,112,26)}catch(e){}
  return r}}
{const _hb=handleBtn;handleBtn=function(id){
  if(id==='frdbait'){const it=frdSelBait();if(it)frdBaitToggle(it);return}
  return _hb.apply(this,arguments)}}
{const _ib=invBtn;invBtn=function(id){
  if(id==='iequip'){const it=frdSelBait();if(it){frdBaitToggle(it);return}}
  return _ib.apply(this,arguments)}}
