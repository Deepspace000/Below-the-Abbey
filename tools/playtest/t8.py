from common import *
r=Run();r.start(False);r.budget=40000
print(crypt_stage(r),flush=True)
print('cut',r.ev("PT.cut()"),flush=True)
for step in ["PT.lootAll({})","PT.collect({})","PT.clearLevel({cap:2})"]*3:
    print(step,flush=True)
    try:
        o=play(r,step,5)
    except Exception as e:
        print('CRASH',r.errs[-8:]);break
    print(str(o)[:200],r.ev("G.state"),r.ev("PT.where"),r.ev('Math.round(performance.memory.usedJSHeapSize/1e6)'),flush=True)
r.close()
