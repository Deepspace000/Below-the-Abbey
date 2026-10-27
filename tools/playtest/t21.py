from common import *
r=Run();r.budget=60000;r.start(True)
for lv in (15,17,4):
    r.ev("goToLevel(%d,LEVELS[%d].start);PT.pump(5)"%(lv,lv))
    print(lv,r.ev("(()=>{const o=[];for(const d of PT.npcs()){const T=PT.talkTo(d,{pick:(t,o)=>o.findIndex(x=>/trade|buy/i.test(x))});if(G.loot&&G.loot.shop){o.push(d.npc+': '+G.loot.decor.contents.map(c=>c.id+'x'+c.n+'$'+buyPrice(c.id)).join(' '));G.loot=null}}return o})()"))
r.close()
