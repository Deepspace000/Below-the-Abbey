/* Oldhaven strikes the hour: the church bell rings once for each hour on the 12 hour clock, twelve times at noon and midnight.
   Only on the quay and in the city (levels 304 and 305). Waiting for noon at the herald jumps the clock to 12, so it rings twelve then. */
const OHB={hour:-1,lv:0,run:0};
{const _dw=drawWorld;
  drawWorld=function(){
    try{if(LEVEL===304||LEVEL===305){
      const h=Math.floor(G.clock/60)%24;
      if(OHB.lv!==LEVEL){OHB.lv=LEVEL;OHB.hour=h}
      else if(h!==OHB.hour){OHB.hour=h;const k=h%12||12,run=++OHB.run;
        for(let i=0;i<k;i++)setTimeout(()=>{if(run===OHB.run&&(LEVEL===304||LEVEL===305))try{playSmp(i%2?'church_bell2':'church_bell1',.7,.9)}catch(e){}},i*2400)}
    }else OHB.lv=0}catch(e){console.error('ohbells',e)}
    return _dw.apply(this,arguments)}}
