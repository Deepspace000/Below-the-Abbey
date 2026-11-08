/* ==========================================================================
   MORE TELEPORT STONES IN THE PALE SPIRE (v3.888). The test links call the levels palespire1 to palespire9; stones now stand in the ones numbered 1, 5, 7 and 9:
     1 the Pale Approach (9720), 5 the Ground Floor: Cloister, Chapel and Library (9760), 7 the Deep Cells and the Cistern (9790), 9 the Second Floor: the Hall of Illusions (9820).
   (the Court of Statues, level 2, already had one, and so do the first Pale Tower room and the Throne Room.) Each stone stands beside the place the party arrives, on open floor with room round it.
   ========================================================================== */
const PSP_MORE_TELE={9720:[27,48],9760:[3,25],9790:[38,4],9820:[31,39]};
if(typeof TELE_KEEP_HI!=='undefined')for(const id in PSP_MORE_TELE)TELE_KEEP_HI.add(+id);
{const _m=pspMake;pspMake=function(plan){try{if(plan&&PSP_MORE_TELE[plan.id]&&!plan.tele)plan=Object.assign({},plan,{tele:PSP_MORE_TELE[plan.id]})}catch(e){}return _m.apply(this,arguments.length>1?[plan].concat([].slice.call(arguments,1)):[plan])}}
// the cloister and the Deep Cells are built straight into a level table (noTele), so their stones are set once the level is built
for(const id of [9760,9790]){const o=KH_LAZY[id];if(!o)continue;
  KH_LAZY[id]=function(){const had=!!LEVELS[id];const r=o.apply(this,arguments);const L=LEVELS[id];
    if(L&&!had&&!L.tele){const t=PSP_MORE_TELE[id];L.tele={x:t[0],y:t[1]};L.noTele=false}return r}}
