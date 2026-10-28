"""python tools/polish/s_snap.py OUTDIR 'JSON [[name,x,y,f],...]' [query]  (server 8341)"""
import sys, json, time, pathlib
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
SET = "([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x,y,a:G.P.angT};if(G.lvlBanners)G.lvlBanners.length=0;G.msgs=[];G.talk=null;return [x,y,f]}"
pl = json.loads(sys.argv[2]) if sys.argv[2].startswith('[') else json.load(open(sys.argv[2]))
q = sys.argv[3] if len(sys.argv) > 3 else ''
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8341/index.html?town=deephollow&lvl=34&v=%d%s' % (time.time(), q), wait_until='commit', timeout=400000)
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"&&typeof LEVEL!=="undefined"&&LEVEL===475&&G.grid&&LEVELS[475]._hgpb', timeout=400000)
    pg.wait_for_timeout(3000)
    for name, x, y, f in pl:
        pg.evaluate(SET, [x, y, f]); pg.wait_for_timeout(1500); pg.screenshot(path=str(OUT / ('%s.png' % name))); print(name, x, y, f)
    print('ERRS', errs[:10]); b.close()
