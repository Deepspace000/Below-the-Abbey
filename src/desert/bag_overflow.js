/* ==========================================================================
   BAG OVERFLOW. When a drop or a reward does not fit in the full bag it goes into an overflow stash (G.flags.ovf, a list of item ids, saved with the game) instead of lying on the floor
   or being lost. Every second or so the stash is checked, and whatever fits is moved into the bag as room appears (sell, drop or use something). Up to 300 items wait.
   ovfStash(id) is called wherever a pickup used to fall to the ground. Pickups the player takes by hand (a chest, a loot window) are unchanged: they stay where they are.
   ========================================================================== */
const ovfList=()=>{const F=G.flags;return F.ovf||(F.ovf=[])};
function ovfStash(id){
  try{const k=typeof id==='string'?id:(id&&(id.id||id.k));if(!k||!ITEMDEF[k])return;
    const L=ovfList();if(L.length>=300){msg('Your bag and your overflow are both full. '+ITEMDEF[k].n+' is lost.','#d09a80');return}
    L.push(k);msg(ITEMDEF[k].n+' goes into your overflow ('+L.length+' waiting). It moves into your bag when you make room.','#e0c090')
  }catch(e){console.error('ovfStash',e)}}
function ovfFlush(){
  try{if(typeof G==='undefined'||!G||!G.flags||!G.bag)return;const L=G.flags.ovf;if(!L||!L.length)return;
    let n=0,last='';while(L.length){const id=L[0];if(!ITEMDEF[id]){L.shift();continue}if(!bagAdd(mkItem(id)))break;L.shift();n++;last=ITEMDEF[id].n}
    if(n)msg(n===1?last+' moves from your overflow into your bag.':n+' items move from your overflow into your bag.'+(L.length?' '+L.length+' still waiting.':''),'#9ae0a0')
  }catch(e){console.error('ovfFlush',e)}}
setInterval(ovfFlush,1500);
