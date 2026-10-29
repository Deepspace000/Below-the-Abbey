"""Stills facing a kind of extra: python tools/polish/bgr_r2_look.py <outdir> <id>:<what>:<dist>:<wet> ...   what = win | moss | arch | k:<decor key>"""
import sys, os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BGR_PORT', '8614')
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 1000, 'height': 640})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=blight1&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=70000)
    pg.wait_for_timeout(2500)
    for s in sys.argv[2:]:
        a = s.split(':'); id = int(a[0]); what = a[1]; dist = int(a[2]); wet = int(a[3]); nth = int(a[4]) if len(a) > 4 else 0
        r = pg.evaluate("""async ([id,what,dist,wet,nth]) => {
          if (id === 600) { saLoad(); for (let i = 0; i < 200 && !(SA.ready && (typeof KH_READY === 'undefined' || KH_READY)); i++) await new Promise(r => setTimeout(r, 300)); saBuild(); }
          else if (!LEVELS[id]) KH_LAZY[id]();
          const L = LEVELS[id];
          const m = L.decor.filter(d => what === 'win' ? d._win && d.wd : what === 'moss' ? d.k === 'bl_moss' : what === 'arch' ? d.k === 'bl_arch' : d.k === what);
          if (!m.length) return null;
          const d = m[Math.min(nth, m.length - 1)]; let sx = d.x, sy = d.y, f = 1;
          const dirs = d.wd ? [[-d.wd[0], -d.wd[1]]] : [[-1,0],[1,0],[0,-1],[0,1]];
          let best = null;
          for (const [a, b] of dirs) for (let k = dist; k >= 2; k--) { const x = d.x + a * k, y = d.y + b * k; if (L.rows[y] && L.rows[y][x] === '.' && !L.decor.some(o => o.block && o.x === x && o.y === y)) { best = [x, y, a, b]; break } if (best) break }
          if (!best) return 'nospot';
          const [x, y, a, b] = best; f = a === -1 ? 1 : a === 1 ? 3 : b === -1 ? 2 : 0;
          goToLevel(id, {x, y, f}); await new Promise(r => setTimeout(r, 2500));
          BKS.force = [wet, .7]; BKS.wet = wet ? .7 : 0; BKS.segWet = !!wet; BKS.segStr = wet ? .7 : 0; BKS.segEnd = 1e9; BKS.next = 1e9;
          await new Promise(r => setTimeout(r, 2000)); return [x, y, f, d.x, d.y, m.length] }""", [id, what, dist, wet, nth])
        name = '%d_%s_%d_w%d.png' % (id, what.replace(':', ''), nth, wet)
        pg.screenshot(path=os.path.join(out, name)); print(name, r)
    print('errors', [e for e in errs if 'Failed to load resource' not in e][:6])
    b.close()
