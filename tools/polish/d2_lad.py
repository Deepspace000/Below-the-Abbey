import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/d2shots')
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("glowOrb");G.lightLevel=1}')
    n=pg.evaluate('()=>LEVELS[476]._hgdu.ladders.length')
    for i in range(0,n,3):
        r=pg.evaluate('''(i)=>{const L=LEVELS[476],l=L._hgdu.ladders[i],O=L._hgdo,land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&O.wm[y*201+x]!==1;
          const DV=[[0,-1],[1,0],[0,1],[-1,0]];const f=DV.findIndex(d=>d[0]===l.dx&&d[1]===l.dy);let best=null;for(const k of [4,3,2,1]){if(land(l.ax-l.dx*k,l.ay-l.dy*k)){best=[l.ax-l.dx*k,l.ay-l.dy*k,f];break}}
          if(!best)return null;G.cut=null;G.talk=null;goToLevel(476,{x:best[0],y:best[1],f:best[2]});hgoFace(f);return best}''',i)
        pg.wait_for_timeout(1600); pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];'); pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT/('lad_%d.png'%i)),clip={'x':0,'y':40,'width':840,'height':420}); print(i,r)
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
