from common import *
r=Run();r.budget=100000;r.start(True)
print(r.ev("JSON.stringify(['gandrick','bandit','skel','archer','wolf','rat'].map(t=>[t,ENEMY_DEF[t]&&ENEMY_DEF[t].name,ENEMY_DEF[t]&&enemyStat(t,13)]))"))
print(r.ev("JSON.stringify(G.heroes.map((h,i)=>[HERO_DEF[i].name,h.lvl,h.max,h.str,h.dex,h.int,heroArmor(h),Object.values(h.eq).map(e=>e.id)]))"))
print(r.ev("MERCHANT_STOCK.map(s=>s.join(':')).join(' ')"))
print(r.ev("G.bag.map(b=>b.id+'x'+b.n).join(' ')"))
print(r.ev("JSON.stringify(PT.purchases.slice(-5))"))
