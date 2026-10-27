from common import *
r=Run();r.budget=60000;r.start(True)
print(r.ev("""(()=>{const o={};for(const n of [7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33]){const L=LEVELS[n];o[n]=L?(L.portals||[]).map(p=>p.to+(p.req?'?'+p.req:'')).join(','):'-'}return JSON.stringify(o)})()"""))
r.close()
