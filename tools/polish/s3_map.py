import time, pathlib
from playwright.sync_api import sync_playwright
out = pathlib.Path('tools/polish/s3_shots/map'); out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8331/index.html?town=deephollow&lvl=34&v=%d' % time.time(), wait_until='commit', timeout=400000)
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"&&typeof LEVEL!=="undefined"&&LEVEL===475&&G.grid&&LEVELS[475]._hgpb', timeout=400000)
    pg.wait_for_timeout(2500)
    pg.evaluate("()=>{G.P.x=33;G.P.y=5;G.P.f=3;G.P.angT=2*Math.PI/2*1.0;G.C={x:33,y:5,a:G.P.angT};G.msgs=[];G.lvlBanners&&(G.lvlBanners.length=0);G.overview=true;G.menu=false}")
    pg.wait_for_timeout(2500); pg.screenshot(path=str(out / 'overview_blue.png'))
    pg.evaluate("()=>{G.P.x=190;G.P.y=55;G.C={x:190,y:55,a:G.P.angT}}"); pg.wait_for_timeout(2000); pg.screenshot(path=str(out / 'overview_gold.png'))
    pg.evaluate("()=>{G.overview=false}"); pg.wait_for_timeout(1500); pg.screenshot(path=str(out / 'minimap_gold.png'))
    print('ERRS', errs[:8]); b.close()
