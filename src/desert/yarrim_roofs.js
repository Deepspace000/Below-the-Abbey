/* ==========================================================================
   YARRIM: THE ROOFS. Level 290 uses the ray-cast roofs of thornwick_roofs.js (TKR). The house table is made from the village plan when the
   level is built (TKR.sets[290].dyn is called by tkrBuild), so there are no hand-typed rows: every cottage and building of YR.plan.houses gets a
   pitched roof exactly over its wall squares (no overhang), standing on its own wall height (the optional wh of a row, from the plan).
   The ridge runs the way the door faces (a door on the south or north: ridge north to south, gable to the street; east or west: ridge east to west).
   The lighthouse is not in the plan's house list and keeps its own painted top. Sea-village look: tile and thatch mostly, a little shingle, weathered
   timber, ochre and board gables, salt-bleached tints. The chapel is slate and stone with a bell tower and spire.
   ========================================================================== */
const YRR_SLOPE=['thatch','tile','shingle','tile','thatch','tile'],YRR_GABLE=['timber','ochre','boards','ochre','timber','boards'];
const YRR_TINT=[[1.06,1,.94],[1,1.03,1.04],[1.05,1.02,.96],[1.02,.98,.94],[1,1.02,1.06],[1.04,1.04,1]];
function yarRoofRows(){
  const P=typeof YR!=='undefined'&&YR.plan;if(!P)return [];
  return P.houses.map(hz=>{
    const sp=hz.sp&&hz.sp.id,chapel=sp==='chapel',ax=(hz.face==='S'||hz.face==='N')?'y':'x',across=ax==='y'?hz.w:hz.d,r=hash2(hz.x0,hz.y0,91),r2=hash2(hz.x0,hz.y0,92),r3=hash2(hz.x0,hz.y0,93);
    const rise=chapel?1.3:(across>=3?.98:.84)+.1*r,slope=chapel?'slate':YRR_SLOPE[hz.roof%6],gable=chapel?'stone':YRR_GABLE[hz.hue%6];
    const chim=chapel?null:r2<.6?[.25+.5*r3,(r3<.5?-1:1)*(.3+.15*r),r<.5?'brick':'stone']:null;
    const dark=chapel?.92:.95+.1*r3,opt={wh:hz.wh};if(chapel){opt.chapel=1;opt.th=1.2;opt.sh=3}
    return [hz.id,hz.x0,hz.x1,hz.y0,hz.y1,ax,rise,slope,gable,chim,chapel?[.96,.98,1.02]:YRR_TINT[hz.hue%6],dark,opt]});
}
TKR.sets[290]={wh:1.4,houses:[],dyn:yarRoofRows};
