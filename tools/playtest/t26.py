import os
os.environ['BTA_STATE']='state_t.json'
from common import *
r=Run();r.budget=60000;r.start(True)
for lv in (7,3,7,2,3,2,8,7,8):
    r.ev("goToLevel(%d,LEVELS[%d].start);PT.pump(5)"%(lv,lv))
    print(lv,r.ev("G.enemies.filter(e=>e.hp>0).length+'/'+G.enemies.length+' items left '+G.items.filter(i=>!i.taken).length+' day'+Math.floor(G.clock/1440)"))
r.close()
