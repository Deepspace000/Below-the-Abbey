from common import *
r=Run();r.budget=60000;r.start(True)
run_stages(r,[('crypt',st_crypt),('abbey',st_abbey),('th_town',st_th_town),('th_gandrick',st_th_gandrick)])
print(json.dumps(r.ev("PT.snap()"))[:300])
print(r.ev("PT.deaths.map(d=>d.hero+' '+d.killer+' L'+d.killerLvl+' @'+d.area+' avg'+d.avgLvl)"))
print(r.ev("Object.entries(G.quests).map(([k,v])=>k+':'+v.st)"))
print(r.ev("[G.flags.gandrickDead,G.flags.ledger,LEVEL]"))
r.close()
