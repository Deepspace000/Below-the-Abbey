import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/d2shots')
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    lamp=pg.evaluate('()=>HGPD.lamp'); print('lamp',lamp)
    # find open cells (land or water) at distance 6,12,20 in a straight line south/east/west with clear sight
    for tag,(dx,dy,f) in {'s':(0,1,0),'e':(1,0,3),'w':(-1,0,1)}.items():
        for k in (6,14,24,34):
            r=pg.evaluate('''([lx,ly,dx,dy,f,k])=>{const L=LEVELS[476];let x=lx+dx*k,y=ly+dy*k;if(!(L.rows[y]&&L.rows[y][x]==='.'))return null;G.cut=null;G.talk=null;goToLevel(476,{x,y,f});hgoFace(f);return [x,y]}''',[lamp[0],lamp[1],dx,dy,f,k])
            if not r: continue
            pg.wait_for_timeout(1500); pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];'); pg.wait_for_timeout(300)
            pg.screenshot(path=str(OUT/('lamp_%s%d.png'%(tag,k))),clip={'x':0,'y':40,'width':840,'height':420}); print(tag,k,r)
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
