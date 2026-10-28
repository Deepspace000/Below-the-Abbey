import sys, json, pathlib
sys.path.insert(0,'tools/polish/c3tmp')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/c3shots'); OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    plan=pg.evaluate('''()=>{const L=LEVELS[476],O=L._hgdo,DVS=[[0,-1],[1,0],[0,1],[-1,0]];
     const land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&O.wm[y*201+x]!==1;const out=[];
     const stand=(v,tag,bk)=>{let best=null;if(v.ix||v.iy){for(const n of [bk,2,1]){const x=v.x+v.ix*n,y=v.y+v.iy*n;if(land(x,y)){best=[x,y,DVS.findIndex(d=>d[0]===-v.ix&&d[1]===-v.iy),tag];break}}}
      if(!best)for(const n of [bk>2?2:bk,1])for(let f=0;f<4&&!best;f++){const x=v.x-DVS[f][0]*n,y=v.y-DVS[f][1]*n;if(land(x,y))best=[x,y,f,tag]}return best};
     for(const v of L._hgpd.vig){const s=stand(v,'vig_'+v.t.replace(/\W+/g,'_'),3);if(s)out.push(s)}
     for(const a of L._hgdu.ladders){out.push([a.x,a.y,DVS.findIndex(d=>d[0]===a.dx&&d[1]===a.dy),'ladder_%d_%d'.replace('%d',a.x).replace('%d',a.y)])}
     const lamp=L.decor.find(d=>d.k==='hgpd_lamp');
     for(const n of [6,14,24,34]){for(let f=0;f<4;f++){const x=lamp.x-DVS[f][0]*n*-1*-1,y=lamp.y;}}
     // beacon: stand south of lamp along open water
     for(const n of [8,20,34]){const x=lamp.x,y=lamp.y+n;if(land(x,y)||O.wm[y*201+x]===1)out.push([x,y,0,'lamp_%d'.replace('%d',n)])}
     return out}''')
    for i,(x,y,f,tag) in enumerate(plan):
        pg.evaluate('''([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}''',[x,y,f])
        pg.wait_for_timeout(1600)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];')
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT/('%02d_%s.png'%(i,tag))))
        print(i,tag,x,y,f)
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
