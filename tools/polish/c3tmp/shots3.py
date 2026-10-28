import sys, json, pathlib
sys.path.insert(0,'tools/polish/c3tmp')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/c3shots'); OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    plan=pg.evaluate('''()=>{const L=LEVELS[476],DVS=[[0,-1],[1,0],[0,1],[-1,0]];const out=[];
     for(const a of L._hgdu.ladders){const f=DVS.findIndex(d=>d[0]===a.x-a.ax&&d[1]===a.y-a.ay);out.push([a.ax,a.ay,f,'L%d_%d'.replace('%d',a.x).replace('%d',a.y)]);
       // also a view from 2 back
       out.push([a.ax-DVS[f][0]*2,a.ay-DVS[f][1]*2,f,'Lback%d_%d'.replace('%d',a.x).replace('%d',a.y)])}
     return out.filter((_,i)=>i%2==1)}''')
    for i,(x,y,f,tag) in enumerate(plan):
        pg.evaluate('''([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}''',[x,y,f])
        pg.wait_for_timeout(1500)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];')
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT/('ladB%02d_%s.png'%(i,tag))))
        print(i,tag,x,y,f)
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
