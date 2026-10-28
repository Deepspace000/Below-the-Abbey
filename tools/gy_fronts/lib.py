import sys, time, os, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('GY_PORT', '8353')
SHOTS = os.environ.get('GY_SHOTS', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots'))
os.makedirs(SHOTS, exist_ok=True)
URL = 'http://localhost:%s/index.html?town=graveyard&lvl=84&v=%d' % (PORT, time.time())

def boot(p, w=900, h=600):
    prof = os.path.join(os.environ.get('TEMP', '.'), 'gyfronts_profile')
    b = p.chromium.launch_persistent_context(prof, args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], viewport={'width': w, 'height': h})
    pg = b.pages[0] if b.pages else b.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.on('response', lambda r: errs.append('HTTP %d %s' % (r.status, r.url)) if r.status >= 400 else None)
    pg.goto(URL, wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=500", timeout=600000)
    pg.wait_for_timeout(3000)
    return b, pg, errs

def go(pg, lv, x, y, f, wait=1800):
    pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [lv, x, y, f])
    pg.wait_for_timeout(wait)
    pg.evaluate("() => { G.talk=null; G.msgs=[]; }")
    pg.wait_for_timeout(250)

def shot(pg, name):
    path = os.path.join(SHOTS, name + '.png'); pg.screenshot(path=path); return path
