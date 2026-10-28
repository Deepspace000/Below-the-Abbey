import sys
sys.path.insert(0,'tools/spellfx')
from spellfx_lib import *
from sheet import sheet
g=Game()
g.ev("()=>__setup({foes:[['bandit',3,0,400]]})")
print(g.ev("()=>{const r=__cast(2,'pw:Fireball');return [r,G.msgs.map(m=>m.text)]}"))
want=[27,30,33,37,42,48]
fs=[]
for k in range(60):
    g.step(1)
    if k in want:
        f=str(OUT/f'_f{k}.png');open(f,'wb').write(g.shot('view'));fs.append(f)
print(g.logs[:5],g.ev("()=>SPFX.stat"))
print(sheet(fs,str(OUT/'_sheet.png'),3,.62))
g.close()
