/* ==========================================================================
   FOOD COSTS TWICE AS MUCH (prefix fdpr). Every food item (water, bread, cheese, apples, pottage, pies, roasts, ale and the rest: item kind 'food') has its gold price doubled, in every shop.
   It runs last, so it sees every food item added by any area. A food item is doubled once only.
   ========================================================================== */
for(const id in ITEMDEF){const d=ITEMDEF[id];if(!d||d.k!=='food'||d.fdprx2||typeof d.price!=='number')continue;d.fdprx2=1;d.price=Math.round(d.price*2)}
