from stages_act1 import *
import sys
r=Run();r.budget=90000;r.start(True)
run_stages(r,ACT1)
print('ACT1 DONE',r.ev("[LEVEL,G.heroes.map(h=>h.lvl)]"))
r.close()
