"""python shoot.py outdir [name ...]  (own server port 8611; BTA_CHROME). One browser."""
import sys, os, time, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8611')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True); sel = sys.argv[2:]
PL = json.load(open(os.path.join(os.path.dirname(__file__), 'places.json')))
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=blight3&lvl=84&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=60000)
    pg.wait_for_timeout(2500)
    for name, lv, x, y, f in PL:
        if sel and not any(s in name for s in sel): continue
        pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [lv, x, y, f])
        pg.wait_for_timeout(2600)
        pg.evaluate("() => { G.talk=null; G.msgs=[]; G.lvlBanners.length=0; G.overview=false }")
        pg.wait_for_timeout(400)
        pg.screenshot(path=os.path.join(OUT, name + '.png')); print('shot', name)
    print('errors', [e for e in errs if 'Failed to load' not in e][:10])
    b.close()
