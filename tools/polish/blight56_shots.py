"""python tools/polish/blight56_shots.py OUTDIR name:lvl:x:y:f ... (f 0 N,1 E?,see game; same as test). Own server BL_PORT 8603."""
import sys, os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8603'); out = sys.argv[1]; os.makedirs(out, exist_ok=True)
specs = [a.split(':') for a in sys.argv[2:]]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path='C:/Program Files/Google/Chrome/Application/chrome.exe')
    pg = b.new_page(viewport={'width': 900, 'height': 600}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=blight5&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=60000)
    pg.wait_for_timeout(2500)
    for name, lv, x, y, f in specs:
        lv, x, y, f = int(lv), int(x), int(y), int(f)
        pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [lv, x, y, f])
        pg.wait_for_timeout(2600)
        pg.evaluate("() => { G.talk=null; G.msgs=[]; G.lvlBanners.length=0; for(const e of G.enemies) e.hp=Math.max(e.hp,1) }")
        pg.wait_for_timeout(500)
        pg.screenshot(path=os.path.join(out, name + '.png')); print('shot', name)
    print('errs', [e for e in errs if 'Failed to load' not in e][:8])
    b.close()
