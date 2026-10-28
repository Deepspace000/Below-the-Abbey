"""python tools/polish/b58_tour.py OUTDIR "town=blight5" "name,lvl,x,y,f|optionalJS" ...   (BL_PORT default 8631, BTA_CHROME)
The JS after | runs after arrival (e.g. G.C.dist=...)."""
import sys, os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8631')
out = sys.argv[1]; town = sys.argv[2]; os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': int(os.environ.get('BL_W', '1000')), 'height': int(os.environ.get('BL_H', '620'))})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'", timeout=60000)
    pg.wait_for_timeout(2500)
    for spec in sys.argv[3:]:
        a = spec.split('|', 1); name, lv, x, y, f = a[0].split(','); js = a[1] if len(a) > 1 else ''
        lv, x, y, f = int(lv), float(x), float(y), int(f)
        pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [lv, x, y, f])
        pg.wait_for_timeout(2600)
        pg.evaluate("() => { G.talk=null; G.msgs=[]; G.lvlBanners.length=0; }")
        if js:
            r = pg.evaluate("()=>{" + js + "}")
            if r is not None: print(r)
        pg.wait_for_timeout(500)
        pth = os.path.join(out, name + '.png'); pg.screenshot(path=pth); print('shot', pth)
    print('errs', [e for e in errs if 'Failed to load' not in e][:8])
    b.close()
