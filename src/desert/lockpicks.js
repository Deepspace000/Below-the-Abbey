/* ==========================================================================
   LOCK PICKS. Every house door in the towns opens, but about one in three is locked. A locked door needs a real set of lock
   picks (from any trader), and picks can bend or snap. The Lockpicking skill still decides the odds.
   ========================================================================== */
ITEMDEF.lockpick={n:'Lock Picks',k:'tool',t:'Tool',ic:'lockpick',c:'#b8b0a0',stack:1,price:25,d:'A little roll of tension wrenches and hooked picks. Needed to open a locked door. A pick can bend or snap, so buy a few.',sw:.1};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('lockpick');
SHOP_STOCK.push(['lockpick',6]);MERCHANT_STOCK.push(['lockpick',6]);
for(const k of ['general','trader','seagoods']){const f=KH_STOCK[k];if(f)KH_STOCK[k]=()=>f().concat([['lockpick',8]])}
const picksHave=()=>bagCount('lockpick');
function pickSpend(){const i=G.bag.findIndex(b=>b&&b.id==='lockpick');if(i>=0)bagTake(i)}
const doorIsLocked=(lv,x,y)=>hash2(x*3+lv,y*5,41)<.34;
