import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d_load import *
from PIL import Image
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/dshots'); OUT.mkdir(exist_ok=True)
only=[int(a) for a in sys.argv[1:]]
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    vig=pg.evaluate('()=>LEVELS[476]._hgpd.vig')
    for i,v in enumerate(vig):
        if only and i not in only: continue
        r=pg.evaluate('''(v)=>{const L=LEVELS[476],O=L._hgdo,DVS=[[0,-1],[1,0],[0,1],[-1,0]];const land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&O.wm[y*201+x]!==1;
          let best=null;if(v.ix||v.iy){for(const n of [3,2,1]){const x=v.x+v.ix*n,y=v.y+v.iy*n;if(land(x,y)){best=[x,y,DVS.findIndex(d=>d[0]===-v.ix&&d[1]===-v.iy)];break}}}
          if(!best)for(const n of [2,1])for(let f=0;f<4&&!best;f++){const x=v.x-DVS[f][0]*n,y=v.y-DVS[f][1]*n;if(land(x,y))best=[x,y,f]}
          if(!best)return null;G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x:best[0],y:best[1],f:best[2]});hgoFace(best[2]);return best}''',v)
        pg.wait_for_timeout(1700)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];')
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT/('v%d.png'%i)))
        print(i,v['t'],r)
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
