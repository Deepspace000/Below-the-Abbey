import os
from common import *
r=Run();r.budget=60000;r.start(True)
print(r.ev("[0,1,2,3].map(i=>HERO_DEF[i].cls+': '+heroPowers(i).map((p,k)=>k+'|'+p.lv+'|'+p.name+'|'+(p.act?'A':'P')+'|'+p.type+'|c'+p.cost+(p.all?'|ALL':'')+(p.range?'|r'+p.range:'')).join(' ; ')).join(String.fromCharCode(10))"))
print(r.ev("G.heroes.map(h=>h.powSel)"),r.ev("Object.keys(SPELLS).slice(0,12).join(' ')"))
print(r.ev("JSON.stringify(G.aff||[]).slice(0,200)"), r.ev("typeof afflList==='function'?afflList().length:null"))
r.close()
