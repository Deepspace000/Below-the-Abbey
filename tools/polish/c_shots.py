import json, time, pathlib, sys
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(__file__).resolve().parent / 'c_shots'; OUT.mkdir(exist_ok=True)
LIST = """(re)=>{const R=new RegExp(re);const L=LEVELS[475];return L.decor.filter(d=>R.test(d.k+'|'+(d.npc||''))).map(d=>[d.kname||d.npc||d.k,d.k,d.x,d.y])}"""
GO = """([tx,ty,want])=>{const L=LEVELS[475],op=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';const bl=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));
 const dirs=[[0,-1,0],[1,0,1],[0,1,2],[-1,0,3]];let best=null;
 for(const dist of [3,2,4,1])for(const [dx,dy,f] of dirs){let ok=true;for(let i=1;i<=dist;i++){const x=tx-dx*i,y=ty-dy*i;if(!op(x,y)||bl.has(x+','+y))ok=false}
   if(ok&&!best)best=[tx-dx*dist,ty-dy*dist,f]}
 if(!best)best=[tx,ty,0];
 G.P.x=best[0];G.P.y=best[1];G.P.f=best[2];G.P.angT=(best[2]-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};G.lvlBanners.length=0;G.msgs=[];G.talk=null;return best}"""
mode = sys.argv[1] if len(sys.argv) > 1 else 'vig'
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8342/index.html?town=deephollow&lvl=34&v=%d' % time.time(), wait_until='commit', timeout=90000); pg.wait_for_timeout(8000)
    pg.wait_for_function('()=>typeof LOAD!=="undefined"&&LOAD.t>0&&LOAD.d>=LOAD.t', timeout=90000); pg.wait_for_timeout(5000)
    L = pg.evaluate(LIST, sys.argv[1])
    sel = L[:int(sys.argv[2])] if len(sys.argv) > 2 else L
    sel = sel[int(sys.argv[3]):] if len(sys.argv) > 3 else sel
    for i, (nm, k, x, y) in enumerate(sel):
        r = pg.evaluate(GO, [x, y, 0]); pg.wait_for_timeout(900)
        pg.screenshot(path=str(OUT / ('%02d_%s.png' % (i, ''.join(c for c in nm if c.isalnum())[:20])))); print(i, nm, k, x, y, r)
    print('ERRS', errs[:6]); b.close()
