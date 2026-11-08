/* ==========================================================================
   DAMAGE NUMBERS THAT DO NOT OVERLAP (v3.874). When several hits land on the same creature or near each other in the same moment (a double strike, a spell on a group, poison and a blow together),
   their floating numbers and splats used to be drawn on top of each other. Each new one now takes the nearest free slot above or below, with a little sideways nudge, once, when it first appears.
   ========================================================================== */
function fsSlot(){
  const F=G.floats;if(!F||!F.length)return;
  for(let i=0;i<F.length;i++){const f=F[i];if(f._s)continue;f._s=1;
    const used=[];
    for(let j=0;j<F.length;j++){const g=F[j];if(g===f||!g._s||g._o===undefined)continue;
      if(Math.abs(g.x-f.x)<50&&Math.abs(g.y-f.y)<40&&g.t<.75)used.push(g._o)}
    if(!used.length){f._o=0;continue}
    let c=0;for(const k of [0,-18,18,-36,36,-54,54,-72,72]){if(!used.some(u=>Math.abs(u-k)<16)){c=k;break}}
    f._o=c;f.y+=c;f.x+=((used.length%2)?1:-1)*Math.min(12,4+used.length*3)}}
{const _df=drawFloats;drawFloats=function(dt){try{fsSlot()}catch(e){}return _df.apply(this,arguments)}}
