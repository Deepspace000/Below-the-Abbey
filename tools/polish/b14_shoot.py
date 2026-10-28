"""python tools/polish/b14_shoot.py shots.json outdir  ; shots.json = [[name,lvl,x,y,f],...]. Env BL_PORT, BTA_CHROME, TOWN."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8611')
shots = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
town = os.environ.get('TOWN', 'blight1')
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=%s" % os.environ.get('MINLVL', '9000'), timeout=60000)
    pg.wait_for_timeout(2500)
    if os.environ.get('PRE'): pg.evaluate(os.environ['PRE'])
    for name, lv, x, y, f in shots:
        pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT;G.C.x=x;G.C.y=y},300); }", [lv, x, y, f])
        pg.wait_for_timeout(2400)
        pg.evaluate("() => { G.talk=null; G.msgs=[]; G.lvlBanners.length=0; }")
        pg.wait_for_timeout(500)
        pg.screenshot(path=os.path.join(out, name + '.png'))
    print('errs', errs[:5]); b.close()
