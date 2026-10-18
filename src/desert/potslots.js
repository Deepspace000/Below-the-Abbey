/* ==========================================================================
   BACKUP POTION SLOTS. The frequent use potion (H, or the Potion button) is followed by two backups, set in the inventory by dragging a potion on to a small slot.
   When the frequent use potion runs out, the first backup that is still in the bag takes its place.
   ========================================================================== */
function potBagCount(id){return G.bag.reduce((a,b)=>a+(b.id===id?b.n:0),0)}
function potPromote(){
  if(!G.potFav||potBagCount(G.potFav)>0)return;
  G.potBack=G.potBack||[null,null];
  for(let q=0;q<G.potBack.length;q++){const id=G.potBack[q];if(id&&ITEMDEF[id]&&potBagCount(id)>0){G.potBack[q]=null;G.potFav=id;msg(`The ${ITEMDEF[id].n} is now the frequent use potion.`,'#a8e0a0');return}}
}
{const _u=ui;ui=function(){try{if(G.state==='play'&&G.bag)potPromote()}catch(e){}return _u.apply(this,arguments)}}
