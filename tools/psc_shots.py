"""Courtyard screenshots: python tools/psc_shots.py outdir level name:x,y,f ...   (level default 9730). Env PSC_PORT, BTA_CHROME, BL_W, BL_H."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PSC_PORT', '8623')
out = sys.argv[1]; lvl = int(sys.argv[2]); spots = sys.argv[3:]
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': int(os.environ.get('BL_W','900')), 'height': int(os.environ.get('BL_H','600'))})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=blight1&lvl=84&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'", timeout=40000)
    pg.wait_for_timeout(2000)
    first = spots[0].split(':')[1].split(',')
    pg.evaluate("([l,x,y,f])=>{goToLevel(l,{x:+x,y:+y,f:+f})}", [lvl]+first)
    pg.wait_for_function("(l)=>LEVEL===l&&G.state==='play'", arg=lvl, timeout=90000)
    pg.wait_for_timeout(2500)
    for s in spots:
        name, pos = s.split(':'); x, y, f = pos.split(',')
        pg.evaluate("([x,y,f])=>{G.P.x=+x;G.P.y=+y;G.P.f=+f;G.P.angT=+f*Math.PI/2;if(typeof reveal==='function')reveal();G.talk=null}", [x,y,f])
        pg.wait_for_timeout(1400)
        pg.screenshot(path=os.path.join(out, name + '.png'))
    print('errs', [e for e in errs if 'Failed to load' not in e][:8])
    b.close()
