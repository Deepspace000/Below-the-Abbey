/* ==========================================================================
   POTION KEYS. The three potion slots have keys: 5 drinks the frequent use potion (the Potion button, also H and P), 6 and 7 drink the first and second backup potion. In play
   the potion is drunk by the chosen hero (keys 1 to 4), in the inventory by the hero whose page is open. A backup stays in its slot after it is drunk; when none is left in the bag
   its slot is cleared. Last in the injection order.
   ========================================================================== */
{const _act=act;act=function(id){
  if(id!=='potb0'&&id!=='potb1')return _act.apply(this,arguments);
  const q=id==='potb0'?0:1;G.potBack=G.potBack||[null,null];const pid=G.potBack[q];
  if(!pid){msg('No backup potion is set in that slot. Drag a potion onto it in the inventory.','#a89878');return}
  if(potBagCount(pid)<=0){G.potBack[q]=null;msg(`There is no more ${(ITEMDEF[pid]&&ITEMDEF[pid].n)||'of that'} in the bag.`,'#d09a80');return}
  const keep=G.potFav;G.potFav=pid; // drunk the way the Potion button drinks, with this potion standing in for a moment as the frequent one
  try{return _act.call(this,'potion')}finally{G.potFav=keep}
}}
addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||e.repeat||(e.key!=='5'&&e.key!=='6'&&e.key!=='7'))return;
  if((typeof TP!=='undefined'&&TP)||G.state!=='play'||G.cut||G.talk||G.saves||G.loot||G.map||G.overview)return;
  const q=+e.key-5;
  if(G.inv.open){invBtn(q===0?'ipotion':'ipotb'+(q-1));e.preventDefault();return}
  if(G.menu)return;
  e.preventDefault();act(q===0?'potion':'potb'+(q-1));
});
