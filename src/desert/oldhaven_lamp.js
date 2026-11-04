/* ==========================================================================
   OLDHAVEN: THE STREET LAMP. The city (305) and the quay (304) use the painted wrought-iron lamp (assets/kh/ohlamp_0, strict front elevation) in place of the old
   code-drawn one. Every other place keeps the old lamp: IMG.lamp answers with the painted one only on those two levels, so the lights, the maps and the fade
   (all keyed on the name 'lamp') need no change.
   ========================================================================== */
(function(){
  let old=IMG.lamp;
  Object.defineProperty(IMG,'lamp',{configurable:true,enumerable:true,
    get(){const p=IMG.kh_ohlamp_0;return (LEVEL===304||LEVEL===305)&&p&&p.width?p:old},
    set(v){old=v}});
})();
