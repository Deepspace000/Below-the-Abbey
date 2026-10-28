import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/d2shots'); OUT.mkdir(exist_ok=True)
# usage: d2_shot.py tag x,y,f x,y,f ... [orb]
tag=sys.argv[1]; pts=[a for a in sys.argv[2:] if a!='orb']; orb='orb' in sys.argv
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem(%s);G.lightLevel=1}'%("'glowOrb'" if orb else "'torch'"))
    for i,s in enumerate(pts):
        x,y,f=[int(v) for v in s.split(',')]
        pg.evaluate('''([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}''',[x,y,f])
        pg.wait_for_timeout(1700)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];')
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT/('%s%d.png'%(tag,i))),clip={'x':0,'y':0,'width':960,'height':520})
        print(i,s)
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
