"""Round 2 stills: python tools/polish/bgr_r2_shots.py <outdir> <spec> ...   spec = id:x:y:f:wet(0/1)[:strength]
Own server on BGR_PORT (8614), BTA_CHROME. One browser."""
import sys, os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BGR_PORT', '8614')
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
specs = sys.argv[2:]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 1000, 'height': 640})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=blight1&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=70000)
    pg.wait_for_timeout(2500)
    for s in specs:
        a = s.split(':'); id, x, y, f, wet = [int(v) for v in a[:5]]; st = float(a[5]) if len(a) > 5 else .7
        pg.evaluate("""async ([id,x,y,f,wet,st]) => {
          if (id === 600) { saLoad(); for (let i = 0; i < 200 && !(SA.ready && (typeof KH_READY === 'undefined' || KH_READY)); i++) await new Promise(r => setTimeout(r, 300)); saBuild(); }
          else if (!LEVELS[id]) KH_LAZY[id]();
          goToLevel(id, {x, y, f}); await new Promise(r => setTimeout(r, 2500));
          BKS.force = [wet, st]; BKS.wet = wet ? st : 0; BKS.segWet = !!wet; BKS.segStr = wet ? st : 0; BKS.segEnd = 1e9; BKS.next = 1e9;
          await new Promise(r => setTimeout(r, 2500)); }""", [id, x, y, f, wet, st])
        name = '%d_%d_%d_%d_w%d.png' % (id, x, y, f, wet)
        pg.screenshot(path=os.path.join(out, name)); print(name)
    print('errors', [e for e in errs if 'Failed to load resource' not in e][:6])
    b.close()
