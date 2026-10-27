from common import *
r=Run();r.budget=60000;r.start(True)
print(r.ev("[LEVEL,G.state,G.gold,G.P.x,G.P.y]"))
print(r.ev("PT.npcs().map(d=>d.npc+':'+NPCS[d.npc].name+'@'+d.x+','+d.y).join(' ')"))
print(r.ev("Object.entries(G.quests).map(([k,v])=>k+':'+v.st).join(' ')"))
for lv in (14,18,21):
    r.ev("goToLevel(%d,LEVELS[%d].start);PT.pump(5)"%(lv,lv))
    print(lv,r.ev("PT.npcs().map(d=>d.npc+':'+NPCS[d.npc].name+'@'+d.x+','+d.y).join(' ')"), r.ev("G.enemies.map(e=>e.t+e.lvl).join(',')"))
r.close()
