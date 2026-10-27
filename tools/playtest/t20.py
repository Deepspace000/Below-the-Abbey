from common import *
r=Run();r.budget=60000;r.start(True)
print(r.ev("G.heroes.map((h,i)=>HERO_DEF[i].name+' L'+h.lvl+' hp'+h.max+' dmg'+heroDmgRange(h).join('-')+' arm'+heroArmor(h)+' '+Object.values(h.eq).map(e=>e.id).join(',')).join(String.fromCharCode(10))"))
print(r.ev("G.bag.map(b=>b.id+'x'+b.n).join(' ')"),r.ev("G.gold"))
# all weapons with lvl info and prices
print(r.ev("Object.entries(ITEMDEF).filter(([k,d])=>d.k==='weapon'&&!d.rar&&d.price<=1500).map(([k,d])=>k+':'+(d.lvl||0)+':'+d.dmg.join('-')+':$'+d.price).join(' ')"))
r.close()
