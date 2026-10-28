"""Frame time with and without a spell, a kill test, and the Siphon (python tools/spellfx/spellfx_perf.py)."""
import sys,time
sys.path.insert(0,'tools/spellfx')
from spellfx_lib import *
g=Game()
g.ev("()=>{window.__ft=n=>{const a=[];for(let i=0;i<n;i++){const t=performance.now();window.__step(1);a.push(performance.now()-t)}return a}}")
g.ev("()=>__setup({foes:[['bandit',3,0,5000,0],['bandit',4,0,5000,1],['wolf',2,0,5000,-1]]})")
base=g.ev("()=>__ft(40)");
g.ev("()=>__cast(2,'pw:Fireball')")
fx=g.ev("()=>__ft(40)")
avg=lambda a:sum(a)/len(a)
print('base avg %.1f ms max %.1f | during fireball avg %.1f ms max %.1f'%(avg(base),max(base),avg(fx),max(fx)))
print('effect code',g.ev("()=>SPFX.stat"))
# kill test: held until impact
g.ev("()=>__setup({foes:[['bandit',3,0,30,0]]})")
g.ev("()=>__cast(2,'pw:Fireball')")
for k in range(4):
    g.step(8);print('t=%.2f'%((k+1)*8/60),g.ev("()=>{const e=G.enemies[0];return {hp:e.hp,dying:e.dying,held:SPFX.held.size,floats:G.floats.length}}"))
g.step(60);print(g.ev("()=>({fx:SPFX.fx.length,held:SPFX.held.size})"))
g.ev("()=>__setup({foes:[['bandit',1,0,5000,0]]})");print('siphon',g.ev("()=>__cast(2,'pw:Siphon')"))
g.step(40)
print('errors',[l for l in g.logs if l[0] in('error','pageerror')])
g.close()
