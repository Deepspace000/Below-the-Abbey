import sys, os, json
sys.argv = [sys.argv[0], 'shots']
import importlib.util
from playwright.sync_api import sync_playwright
src = open(os.path.join(os.path.dirname(__file__), '..', 'ps_test.py'), encoding='utf8').read().split("modes = {")[0]
exec(src)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots')
ids = [int(a) for a in os.environ.get('IDS', '9720').split(',')]
N = int(os.environ.get('N', '10'))
tag = os.environ.get('TAG', 'r1')
PICK = """([id,N,fixed]) => { const L = LEVELS[id]; const g = G.grid; const H = g.length, W = g[0].length;
 const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
 function run(x,y,f){let n=0;while(n<30){x+=dirs[f][0];y+=dirs[f][1];if(!g[y]||g[y][x]!==0)break;n++}return n}
 if(fixed) return fixed;
 const open=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x]===0&&!G.decor.some(d=>d.block&&d.x===x&&d.y===y))open.push([x,y]);
 const pts=[[L.start.x,L.start.y]];
 while(pts.length<N){let best=null,bd=-1;for(const o of open){let m=1e9;for(const p of pts)m=Math.min(m,Math.hypot(o[0]-p[0],o[1]-p[1]));if(m>bd){bd=m;best=o}}pts.push(best)}
 return pts.map(p=>{let bf=0,bn=-1;for(let f=0;f<4;f++){const n=run(p[0],p[1],f);if(n>bn){bn=n;bf=f}}return [p[0],p[1],bf]}) }"""
with sync_playwright() as p:
    b, pg, errs = boot(p)
    for id_ in ids:
        enter(pg, id_)
        pg.wait_for_timeout(1500)
        vp=os.environ.get('VP')
        pts = [[int(v) for v in q.split(',')] for q in vp.split(';')] if vp else pg.evaluate(PICK, [id_, N, None])
        for i, (x, y, f) in enumerate(pts):
            pg.evaluate("""([x,y,f]) => { G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.x=x;G.C.y=y;G.C.a=G.P.angT;G.lvlBanners=[];G.talk=null;try{reveal()}catch(e){} }""", [x, y, f])
            pg.wait_for_timeout(500)
            pg.screenshot(path=os.path.join(OUT, '%s_%d_%02d_%d_%d_f%d.png' % (tag, id_, i, x, y, f)))
    print('errors', real(errs)[:6]); b.close()
