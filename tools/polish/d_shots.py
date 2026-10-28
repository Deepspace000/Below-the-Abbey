import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/dshots'); OUT.mkdir(exist_ok=True)
pts=json.loads(sys.argv[1]); tag=sys.argv[2] if len(sys.argv)>2 else 's'
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();const it=mkItem(window.__LIGHT||"torch");G.heroes[0].eq.off=it;G.heroes[0].eq.main=G.heroes[0].eq.main||null}')
    pg.evaluate('G.lightLevel=1')
    for i,(x,y,f) in enumerate(pts):
        pg.evaluate('([x,y,f])=>{if(f<0){const L=LEVELS[476];let b=0,bf=0;for(let q=0;q<4;q++){let n=0;while(n<12&&L.rows[y+DIRS[q][1]*(n+1)]&&L.rows[y+DIRS[q][1]*(n+1)][x+DIRS[q][0]*(n+1)]===".")n++;if(n>b){b=n;bf=q}}f=bf}G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f);}',[x,y,f])
        pg.wait_for_timeout(1800)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];')
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT/('%s%d.png'%(tag,i))))
        print(i,x,y,f)
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
