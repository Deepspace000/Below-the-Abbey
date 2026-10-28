import sys, pathlib
sys.path.insert(0,'tools/polish')
from u4_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/u4shots'); OUT.mkdir(exist_ok=True,parents=True)
tag=sys.argv[1]; pts=[tuple(map(int,a.split(','))) for a in sys.argv[2:]]
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{window.__NOHGPDWV=%s}'%('true' if __import__('os').environ.get('NOWV') else 'false'));pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    for i,(x,y,f) in enumerate(pts):
        pg.evaluate('([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}',[x,y,f]); pg.wait_for_timeout(1400)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];'); pg.wait_for_timeout(250)
        fn=OUT/('%s_%d.png'%(tag,i)); pg.screenshot(path=str(fn),clip={'x':0,'y':40,'width':840,'height':420}); print(fn,flush=True)
    print('errors',[e for e in errs if 'hgpd' in e or 'PAGEERR' in e or 'hgt ' in e or 'rror' in e][:8]); b.close()
