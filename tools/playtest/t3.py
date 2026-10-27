from h import *
h=H();h.load();h.lib()
h.ev("act()");h.ev("crBtn('cr_pick_def')")
print(h.ev("PT.lootAll({max:3})"))
h.ev("(()=>{const d=G.decor.find(d=>d.k==='coffin');PT.walkTo(d.x,d.y,{adj:true})})()")
print('\n'.join(h.ev("PT.msgs.slice(-40)")))
print(h.ev("G.enemies.filter(e=>e.hp>0&&e.alert).map(e=>e.t+e.lvl+'@'+e.x+','+e.y+' hp'+e.hp)"), h.ev("[G.P.x,G.P.y]"))
