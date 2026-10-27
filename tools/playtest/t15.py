from common import *
r=Run();r.budget=60000;r.start(True)
run_stages(r,[('th_handin',st_th_handin)])
print(r.ev("PT.talklog.slice(-3)"))
print(r.ev("PT.msgs.slice(-14)"))
print(r.ev("[LEVEL,G.state,!!G.cut,!!G.talk,G.enemies.filter(e=>e.hp>0).map(e=>e.t+e.lvl+'@'+e.x+','+e.y)]"))
r.close()
