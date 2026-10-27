from h import *
h=H();h.load();h.lib()
print(h.ev("""(()=>{const o=[];for(let n=1;n<=60;n++){o.push(n+':'+(LEVEL_NAMES[n]||'?')+' r'+(LEVEL_RATING[n]||'-')+(LEVELS[n]?'':' (lazy)'))}return o})()"""))
print(h.ev("Object.keys(LEVELS).map(Number).filter(n=>n>60).length"), h.ev("typeof WK"), h.ev("JSON.stringify(typeof WK!=='undefined'?WK:null)"))
