/* ps_f2_rooms_c.js: the illusion rooms 6 and 7 (9826 swamp, 9827 nightmare). See tools/PS_F2_SPEC.md. */
/* any illusion room not built by its file yet is a plain stretch of its world with the way back (so the hub doors always lead somewhere) */
for(const id of F2.ROOMS)if(!pspLevel(id).built)pspRegister(id,()=>{const C=f2Room({id,ground:'lush',route:[[24,35],[24,8]],clear:[[18,4,30,12,null,null,1]]});C.ret();return C.done()});
