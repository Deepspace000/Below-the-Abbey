# usage: north_tour.py tag bio n [offset]  -> screenshots at n valid sample cells of a biome (longest open direction)
import sys,os,json; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
tag=sys.argv[1];bio=int(sys.argv[2]);n=int(sys.argv[3]);off=int(sys.argv[4]) if len(sys.argv)>4 else 0
OUT=os.path.join(os.environ['TEMP'],'n_shots');os.makedirs(OUT,exist_ok=True)
with sync_playwright() as p:
    b,pg,errs=boot(p,900,560)
    pg.evaluate("()=>{try{Object.assign(SNDOPT,{combat:0,amb:0,music:0,steps:0})}catch(e){}G.mute=true}")
    cells=pg.evaluate("""([bio,n,off])=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,o=[];for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){if(M.bio[y*W+x]!==bio||L.rows[y][x]!=='.')continue;if((x*7+y*13)%89!==0)continue;o.push([x,y])}
      o.sort((a,b)=>((a[0]*31+a[1]*17)%103)-((b[0]*31+b[1]*17)%103));return o.slice(off,off+n)}""",[bio,n,off])
    for i,(x,y) in enumerate(cells):
        pg.evaluate("""([x,y])=>{const L=LEVELS[475],ok=(a,b)=>L.rows[b]&&L.rows[b][a]==='.';let best=0,f=0;[[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dy],i)=>{let n=0;while(n<12&&ok(x+dx*(n+1),y+dy*(n+1)))n++;if(n>best){best=n;f=i}});
          G.talk=null;G.cut=null;G.msgs=[];G.clock=12*60;const ang=(f-1)*Math.PI/2;G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=ang;G.C.x=x;G.C.y=y;G.C.a=ang;}""",[x,y])
        pg.wait_for_timeout(1300);pg.evaluate("()=>{G.talk=null;G.msgs=[]}");pg.wait_for_timeout(150)
        path=os.path.join(OUT,'%s_%d_%02d_%d_%d.png'%(tag,bio,i,x,y));pg.screenshot(path=path);print(path)
    print([e for e in errs if 'Failed to load' not in e][:5]);b.close()
