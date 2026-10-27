from common import *
import subprocess
r=Run();r.budget=90000
r.pg.on('crash',lambda p: print('PAGE CRASH EVENT',flush=True))
r.start(False)
try:
    run_stages(r,[('crypt',st_crypt),('abbey',st_abbey)])
except Exception as e:
    print('EXC',str(e)[:200]);print(r.errs[-5:])
r.close()
