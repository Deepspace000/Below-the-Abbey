import sys, json, pathlib, random
sys.path.insert(0,'tools/polish/c3tmp')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/c3shots'); OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    plan=pg.evaluate('''()=>{const L=LEVELS[476],O=L._hgdo,DVS=[[0,-1],[1,0],[0,1],[-1,0]];
     const land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&O.wm[y*201+x]!==1;const out=[];
     const stand=(v,tag)=>{let best=null;if(v.ix||v.iy){for(const n of [3,2,1]){const x=v.x+v.ix*n,y=v.y+v.iy*n;if(land(x,y)){best=[x,y,DVS.findIndex(d=>d[0]===-v.ix&&d[1]===-v.iy),tag];break}}}
      if(!best)for(const n of [2,1])for(let f=0;f<4&&!best;f++){const x=v.x-DVS[f][0]*n,y=v.y-DVS[f][1]*n;if(land(x,y))best=[x,y,f,tag]}return best};
     for(const v of L._hgpd.vig){const s=stand(v,'vig:'+v.t);if(s)out.push(s)}
     const lad=L._hgdu.ladders;out.push(['ladders',JSON.stringify(lad).slice(0,300)]);
     return {out,start:L.start,lamp:L.decor.filter(d=>d.k==='hgpd_lamp'||/lamp/.test(d.k)).slice(0,3).map(d=>[d.k,d.x,d.y])}}''')
    print(json.dumps(plan)[:3500])
    json.dump(plan,open('tools/polish/c3tmp/plan.json','w'))
    b.close()
