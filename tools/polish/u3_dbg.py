import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/d2shots')
x,y,f=[int(v) for v in sys.argv[1].split(',')]
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    pg.evaluate('([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}',[x,y,f]); pg.wait_for_timeout(1700)
    print('statDrop',pg.evaluate('HGPD.statDrop'),pg.evaluate('LEVELS[476].decor.filter(d=>/hgdn_st/.test(d.k)).length'),pg.evaluate('G.decor.filter(d=>/hgdn_st/.test(d.k)).length'))
    print(pg.evaluate('([x,y])=>LEVELS[476].decor.filter(d=>Math.abs(d.x-x)<=4&&Math.abs(d.y-y)<=4).map(d=>[d.k,d.x,d.y,d.sc,d.ox,d.oy,d.wd?1:0]).concat(LEVELS[476].enemies.filter(e=>Math.abs(e.x-x)<=5&&Math.abs(e.y-y)<=5).map(e=>[e.t,e.x,e.y]))',[x,y]))
    pg.screenshot(path=str(OUT/'dbg_on.png'),clip={'x':0,'y':40,'width':840,'height':420})
    pg.evaluate('()=>{0}'); pg.wait_for_timeout(100)
    pg.screenshot(path=str(OUT/'dbg_off.png'),clip={'x':0,'y':40,'width':840,'height':420})
    b.close()
