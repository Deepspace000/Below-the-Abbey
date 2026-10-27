from common import *
r=Run();r.budget=60000
r.pg.on('crash',lambda p: print('PAGE CRASH EVENT',flush=True))
r.start(True)
try:
    print(r.ev("PT.goLevel(10)"),flush=True)
    print(play(r,"PT.collect({})"),flush=True)
    for k in range(6):
        print(r.ev("(()=>{const e=PT.nearestEnemy();if(!e)return 'none';const w=PT.walkTo(e.x,e.y,{adj:true});return [e.t,e.lvl,e.x,e.y,w,G.P.x,G.P.y]})()"),flush=True)
        for i in range(12):
            r.ev("PT.faceEnemy()")
            if not r.ev("PT.adjEnemy().length"): break
            print(' round',i,r.ev("[G.enemies.filter(e=>e.hp>0&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<3).map(e=>e.t+e.hp+(e.alert?'a':'')+(e.surr?'s':'')).join(','),G.heroes.map(h=>h.hp).join('/'),G.timers.length,Math.round(performance.memory.usedJSHeapSize/1e6)]"),flush=True)
            r.ev("PT.fightRound()")
except Exception as e:
    print('EXC',str(e)[:100]);print(list(r.trace)[-4:])
