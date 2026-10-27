from common import *
import sys
r=Run();r.start(False);r.budget=40000
print(crypt_stage(r),flush=True);r.ev("PT.cut()")
print(sweep(r,talk=False),flush=True)
print(r.ev("PT.where"),flush=True)
print(r.ev("PT.takeExit()"),r.ev("LEVEL"),flush=True)
r.ev("PT.cut()")
print(json.dumps(r.ev("PT.snap()"))[:200])
print(r.ev("G.decor.filter(d=>d.npc&&!/epitaph/.test(d.npc)).map(d=>d.npc+':'+d.k+'@'+d.x+','+d.y+(d.walk?'w':''))"))
print(r.ev("PT.findTiles((g)=>g>=3&&g!==8&&g!==6&&g!==2&&g!==1).map(t=>t.join(':'))"))
print(r.ev("G.portals"))
print(r.ev("G.enemies.filter(e=>e.hp>0).map(e=>e.t+e.lvl+'@'+e.x+','+e.y)"))
print(r.ev("G.decor.filter(d=>d.loot||d.shop).map(d=>d.k+(d.shop?'S':'')+'@'+d.x+','+d.y)"))
print(r.ev("Object.keys(G.quests).map(k=>k+':'+G.quests[k].st)"))
r.close()
