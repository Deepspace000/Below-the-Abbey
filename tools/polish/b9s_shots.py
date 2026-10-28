"""python tools/polish/b9s_shots.py <spec.json> <outdir>   spec: {"url":"?town=sale&lvl=90","shots":[[name,x,y,f,(optional lvl)]]}
Port from B9S_PORT (default 8791). One headless Chrome."""
import sys, os, json, pathlib, time
from playwright.sync_api import sync_playwright
spec = json.load(open(sys.argv[1])); out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
port = os.environ.get('B9S_PORT', '8791')
kw = {'args': ['--use-gl=swiftshader', '--enable-unsafe-swiftshader']}
kw['executable_path'] = os.environ.get('BTA_CHROME', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
with sync_playwright() as p:
    b = p.chromium.launch(**kw); pg = b.new_page(viewport={'width': 1100, 'height': 700})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:%s/index.html%s&v=%d' % (port, spec['url'], time.time()))
    pg.wait_for_function("() => typeof G!=='undefined' && G.state==='play' && typeof LEVEL!=='undefined'", timeout=120000)
    pg.wait_for_timeout(2500)
    cur = pg.evaluate("()=>LEVEL")
    for s in spec['shots']:
        name, x, y, f = s[:4]; lv = s[4] if len(s) > 4 else None
        if lv is not None and lv != cur:
            pg.evaluate("([lv,x,y,f]) => { if(!LEVELS[lv]&&KH_LAZY[lv])KH_LAZY[lv](); const st=LEVELS[lv]&&LEVELS[lv].start; goToLevel(lv, x<0&&st?{x:st.x,y:st.y,f:st.f}:{x:x,y:y,f:f}) }", [lv, x, y, f]); pg.wait_for_timeout(2500); cur = lv
            if x < 0: pg.screenshot(path=str(out / (name + '.png'))); continue
        pg.evaluate("([x,y,f]) => { G.talk=null; G.P.x=x; G.P.y=y; G.P.f=f; G.P.angT=(f-1)*Math.PI/2; G.C={x:x,y:y,a:G.P.angT}; G.lvlBanners.length=0; G.msgs=[]; }", [x, y, f])
        pg.wait_for_timeout(900); pg.screenshot(path=str(out / (name + '.png')))
    print('errors:', errs[:8])
    b.close()
