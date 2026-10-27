from common import *
r=Run();r.budget=4000
r.start(True)
r.ev("goToLevel(3,{x:29,y:18,f:1});PT.pump(5)")
enter(r,7)
print(r.ev("(()=>{const d=G.decor.find(d=>d.loot&&!d.shop);return [d.k,d.x,d.y,G.P.x,G.P.y]})()"))
print(r.ev("(()=>{const d=G.decor.find(d=>d.loot&&!d.shop);return PT.walkTo(d.x,d.y,{adj:true})})()"))
print(list(r.trace)[-12:])
print(r.ev("[G.P.x,G.P.y,G.P.f,G.timers.length,canAct(),G.rounds,G.enemies.filter(e=>e.hp>0&&e.alert).length,G.time]"))
print(r.ev("PT.msgs.slice(-6)"))
