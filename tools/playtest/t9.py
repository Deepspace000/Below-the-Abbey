from common import *
r=Run();r.budget=60000;r.start(True)
run_stages(r,[('crypt',st_crypt),('abbey',st_abbey)])
for lv in (4,5,6,29):
    print(lv, r.ev("goToLevel(%d,LEVELS[%d].start);PT.pump(5);LEVEL"%(lv,lv)))
    print(r.ev("G.decor.filter(d=>d.npc||d.shop||d.loot).map(d=>d.npc+':'+d.k+(d.shop?'S':'')+'@'+d.x+','+d.y)"))
    print(r.ev("[G.P.x,G.P.y,G.portals]"))
r.close()
