from common import *
import time
r=Run();r.budget=60000
r.pg.on('crash',lambda p: print('PAGE CRASH EVENT after',round(time.time()-T0,1),flush=True))
r.start(True);T0=time.time()
try:
    print(r.ev("PT.goLevel(10)"),flush=True)
    for k in range(40):
        o=play(r,"PT.clearLevel({cap:1})")
        print(round(time.time()-T0,1),str(o)[:60],r.ev("[G.state,G.rounds,Math.round(performance.memory.usedJSHeapSize/1e6),PT.stats.pumps,G.timers.length]"),flush=True)
except Exception as e:
    print('EXC',round(time.time()-T0,1),str(e)[:100])
