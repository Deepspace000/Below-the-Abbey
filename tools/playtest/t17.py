from common import *
r=Run();r.budget=60000;r.start(True)
run_stages(r,[('th_handin',st_th_handin),('ironhill_road',st_ironhill_road)])
print(r.ev("PT.snap().heroes.map(h=>h.l)"),r.ev("[LEVEL,G.state,G.gold]"))
print(r.ev("PT.deaths.slice(-5).map(d=>d.hero+' '+d.killer+' L'+d.killerLvl+' @'+d.area)"))
r.close()
