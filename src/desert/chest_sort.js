/* ==========================================================================
   STORE AND SORT (prefix cs): a Store button in the inventory (only inside one of the party's houses) that sends the chosen item to the Home Chest,
   and a Sort button in every chest-like loot window (by Value, Type, Quest or Order of acquisition; the arrow button turns the order round).
   - Every new bag stack is stamped with an acquisition number (item.a, counter G.flags.acq) by a wrapper on bagAdd; the stamp travels into the chest and back out.
     Things saved before this existed have no stamp and sort last.
   - Quest items (kind quest, tag Quest item or no tag) can not be stored, because a quest may need them. Herbs, gems, bait and the like can.
   ========================================================================== */
const CS_MODES=['Value','Type','Quest','Order'];
const csTrueQuest=d=>!!d&&d.k==='quest'&&(!d.t||d.t==='Quest item');
function csGroup(d){ // the Type order: weapons, armour, potions, food, fish, gems, scrolls and books, quest items, then the rest
  if(!d)return 9;
  if(d.k==='weapon')return 0;
  if(d.k==='shield'||d.k==='head'||d.k==='chest'||d.k==='arms'||d.k==='legs'||d.k==='ring'||d.k==='light')return 1;
  if(d.k==='potion')return 2;
  if(d.fish)return 4;
  if(d.k==='food')return 3;
  if(d.gem)return 5;
  if(d.k==='spell'||d.fread||/book|scroll/i.test(d.t||''))return 6;
  if(csTrueQuest(d))return 7;
  return 8;
}
function csSortList(arr,mode,asc){ // sorts the array in place, stable
  const dk=it=>ITEMDEF[it.id]||{},nm=it=>dk(it).n||it.id,val=it=>dk(it).price||0;
  const dec=arr.map((it,i)=>({it,i}));
  const cmp=(a,b)=>{
    let r=0;
    if(mode==='Order'){ // oldest first; things without a stamp always last
      const x=a.it.a||0,y=b.it.a||0;if(x&&!y)return -1;if(y&&!x)return 1;if(x&&y&&x!==y)return asc?x-y:y-x;return a.i-b.i}
    if(mode==='Value')r=val(b.it)-val(a.it);                       // highest first
    else if(mode==='Type')r=csGroup(dk(a.it))-csGroup(dk(b.it));
    else r=(csTrueQuest(dk(b.it))?1:0)-(csTrueQuest(dk(a.it))?1:0)||csGroup(dk(a.it))-csGroup(dk(b.it)); // quest items first
    if(r)return asc?r:-r;
    const n=nm(a.it).localeCompare(nm(b.it));if(n)return n;
    return a.i-b.i;
  };
  dec.sort(cmp);dec.forEach((o,i)=>{arr[i]=o.it});return arr;
}
const csState=()=>{const F=G.flags;return F.csort||(F.csort={m:'Value',up:true})};
/* the acquisition stamp */
{const _ba=bagAdd;bagAdd=function(it){try{if(it&&!it.a&&G.flags){G.flags.acq=(G.flags.acq|0)+1;it.a=G.flags.acq}}catch(e){}return _ba.apply(this,arguments)}}
/* the loot window: Take all gets narrower, and the sort buttons stand beside it */
function csDraw(L){
  const S=csState();
  btnText('lsortbox',S.m,385,214,56,26);
  btnText('lsortdir',S.up?'▲':'▼',444,214,26,26);
}
function csLootBtn(id,L){
  if(id!=='lsortbox'&&id!=='lsortdir')return false;
  const S=csState(),box=L.decor.contents;
  if(id==='lsortbox'){S.m=CS_MODES[(CS_MODES.indexOf(S.m)+1)%4];S.up=true}else S.up=!S.up;
  csSortList(box,S.m,S.up);L.sel=null;sfx('equip');
  msg('Sorted by '+S.m.toLowerCase()+(S.m==='Order'?(S.up?', oldest first.':', newest first.'):S.m==='Value'?(S.up?', highest first.':', lowest first.'):S.m==='Quest'?(S.up?', quest items first.':', quest items last.'):(S.up?'.':', backwards.')),'#c8d8a0');
  return true;
}
/* Store in the inventory */
const csAtHome=()=>{try{return !!hsHouseAt(LEVEL)}catch(e){return false}};
function csStore(all){
  const I=G.inv,hi=I.hero,it=selItem();if(!it)return;const d=ITEMDEF[it.id];
  if(!csAtHome()){msg('You can only store things at home. Walk into one of your houses.','#d09a80');return}
  if(csTrueQuest(d)){msg('Quest items cannot be stored.','#d09a80');return}
  const box=hsF().chest,cap=hsCap(),at=d.stack?box.find(b=>b.id===it.id):null;
  if(!at&&box.length>=cap){msg('The Home Chest is full ('+cap+' stacks). Take something out first.','#d09a80');return}
  let n=1;
  if(I.sel.src==='slot'){const slot=I.sel.slot;if(!unequip(hi,slot))return;const i=G.bag.indexOf(it);if(i<0)return;G.bag.splice(i,1)}
  else{const i=I.sel.i;if(all&&(it.n||1)>1){n=it.n;G.bag.splice(i,1)}else{bagTake(i)}}
  if(at)at.n+=n;else box.push({id:it.id,n,a:it.a});
  I.dropKey=null;
  if(I.sel.src==='slot'||!G.bag[I.sel.i]||G.bag[I.sel.i].id!==it.id)I.sel=null;
  sfx('equip');msg('You put '+(n>1?n+' x ':'the ')+d.n+' in the Home Chest.','#b8e8a0');
}
{const _di=drawInventory;drawInventory=function(){
  const r=_di.apply(this,arguments);
  try{const I=G.inv;if(I.open&&I.sel&&I.tab!=='powers'&&I.tab!=='spell'){const cur=selItem();if(cur){
    const d=ITEMDEF[cur.id],rx=316,rw=156,dk=I.sel.src==='bag'?'b'+I.sel.i:'s'+I.sel.slot,sure=I.dropKey===dk;
    if(sure)txt('Or store it at home.',rx+rw/2,163,8,'#a8d898','center');
    else{
      const home=csAtHome(),ok=home&&!csTrueQuest(d),multi=I.sel.src==='bag'&&(cur.n||1)>1&&d.stack;
      const hasLabel=I.sel.src==='slot'||d.k!=='quest',x=rx+(hasLabel?104:80),w=hasLabel?49:72;
      btnText(multi?'istoreall':'istore',multi?'Store all':'Store',x,171,w,26);
      if(!ok){ctx.fillStyle='rgba(10,8,6,.55)';rrect(ctx,x,171,w,26,5);ctx.fill()}
    }}}}catch(e){console.error(e)}
  return r}}
{const _ib=invBtn;invBtn=function(id){
  if(id==='istore'||id==='istoreall'){csStore(id==='istoreall');return}
  return _ib.apply(this,arguments)}}
