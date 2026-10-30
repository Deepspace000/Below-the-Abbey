"""Castle sign audit: for every sign_gy decor on every castle level, stand head-on 1, 2, 3 and 5 squares from it (as far as the floor in front is open) and at an angle from 3 squares back and 3 to the side,
and measure the drawn size of the sign on screen (view pixels, the view is 420 wide). Also checks the sign sits on a wall cell with open floor in front. Prints every sign outside the sane range
(width 40 to 140 and height 12 to 60 from 3 squares) and exits 1 if there is one.
   PS_PORT=8993 python tools/ps_signs_audit.py [legacy]     (legacy = the engine's old blade-sign drawing, for a before table)
Env: PS_PORT (own python -m http.server from the repo root), BTA_CHROME (Chrome path)"""
import sys, os, time
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
PORT = os.environ.get('PS_PORT', '8993')
LEGACY = len(sys.argv) > 1 and sys.argv[1] == 'legacy'
WMIN, WMAX, HMIN, HMAX = 40, 140, 12, 60
JS_LIST = """() => { const out = []; for (const l of PSP.LEVELS) { const id = l.id; try { if (!LEVELS[id] && typeof KH_LAZY !== 'undefined' && KH_LAZY[id]) KH_LAZY[id](); } catch (e) {} const L = LEVELS[id]; if (!L) continue;
  (L.decor || []).forEach(d => { if (d.k === 'sign_gy') out.push({ id, x: d.x, y: d.y, wd: d.wd, txt: String(d.txt[0]) }) }) } return out }"""
JS_INFO = """([id, x, y, wd]) => { const r = LEVELS[id].rows; const o = (a, b) => !!(r[b] && '.~-'.includes(r[b][a] || '#')); const w = (r[y + wd[1]] || '')[x + wd[0]];
  let free = 0; for (let n = 1; n <= 6; n++) { if (o(x - wd[0] * n, y - wd[1] * n)) free = n; else break } return { wall: w === undefined ? null : w, here: o(x, y), free } }"""
JS_MEASURE = """async ([id, x, y, f, legacy, ang]) => {
  window.PSSIGN_FLATOFF = legacy; goToLevel(id, { x, y, f });
  if (ang !== null) G.C.a = ang;
  await new Promise(r => setTimeout(r, 350));
  for (const k in PSSIGN_FLAT) PSSIGN_FLAT[k]._sg = 1; for (const k in PSSIGN_CACHE) { PSSIGN_CACHE[k]._sg = 1; if (PSSIGN_CACHE[k].alt) PSSIGN_CACHE[k].alt._sg = 1 }
  for (const k in SIGN_CACHE) { SIGN_CACHE[k]._sg = 1; if (SIGN_CACHE[k].alt) SIGN_CACHE[k].alt._sg = 1 }
  // the engine paints a sprite into a cached or pooled canvas first and then onto the screen from that: follow the flag through it
  try { SPR_CACHE.clear() } catch (e) {}
  const rec = []; const o = SC.drawImage, P = CanvasRenderingContext2D.prototype, po = P.drawImage;
  P.drawImage = function (im, ...a) { if (this.canvas !== SC.canvas) this.canvas._sgsrc = !!(im && im._sg); else if (im && (im._sg || im._sgsrc)) { const n = a.length; rec.push([a[n - 4], a[n - 3], a[n - 2], a[n - 1]]) } return po.call(this, im, ...a) };
  await new Promise(r => setTimeout(r, 400)); P.drawImage = po;
  if (!rec.length) return null;
  // several signs can be in view: group the strips into signs (gaps over 3 px split them) and report the one nearest the centre of the view
  rec.sort((p, q) => p[0] - q[0]); const cl = []; for (const r of rec) { const c = cl[cl.length - 1]; if (c && r[0] <= c.x1 + 3) { c.x1 = Math.max(c.x1, r[0] + r[2]); c.y0 = Math.min(c.y0, r[1]); c.y1 = Math.max(c.y1, r[1] + r[3]) } else cl.push({ x0: r[0], x1: r[0] + r[2], y0: r[1], y1: r[1] + r[3] }) }
  cl.sort((p, q) => Math.abs((p.x0 + p.x1) / 2 - 210) - Math.abs((q.x0 + q.x1) / 2 - 210)); const c = cl[0];
  return [c.x1 - c.x0, c.y1 - c.y0, c.y0, c.y1] }"""


def fdir(wd):
    return {(0, -1): 0, (1, 0): 1, (0, 1): 2, (-1, 0): 3}[(wd[0], wd[1])]


with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    pg.goto('http://localhost:%s/index.html?town=palespire&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof PSP!=='undefined'&&PSP.ready", timeout=90000)
    pg.wait_for_timeout(1500)
    signs = pg.evaluate(JS_LIST)
    print('signs', len(signs)); rows = []; bad = []
    for s in signs:
        wd = s['wd']; info = pg.evaluate(JS_INFO, [s['id'], s['x'], s['y'], wd]); res = {}
        for n in (1, 2, 3, 5):
            if info['free'] < n: continue
            res[n] = pg.evaluate(JS_MEASURE, [s['id'], s['x'] - wd[0] * n, s['y'] - wd[1] * n, fdir(wd), LEGACY, None])
        angv = None
        if info['free'] >= 3:
            for sg in (1, -1):
                px, py = s['x'] - wd[0] * 3 + sg * 3 * abs(wd[1]), s['y'] - wd[1] * 3 + sg * 3 * abs(wd[0])
                if pg.evaluate("([id,x,y])=>{const r=LEVELS[id].rows;return !!(r[y]&&'.~-'.includes(r[y][x]||'#'))}", [s['id'], px, py]):
                    import math
                    angv = pg.evaluate(JS_MEASURE, [s['id'], px, py, fdir(wd), LEGACY, math.atan2(s['y'] - py, s['x'] - px)]); break
        w3 = res.get(3)
        wall_ok = info['wall'] is not None and info['wall'] not in '.~-'
        row = (s['id'], s['x'], s['y'], tuple(wd), s['txt'], info['wall'], {k: (None if v is None else (round(v[0]), round(v[1]))) for k, v in res.items()}, 'ang45', None if angv is None else (round(angv[0]), round(angv[1])))
        rows.append(row); why = []
        if not info['here'] or not wall_ok: why.append('not on a wall facing open floor')
        if w3 is None and info['free'] >= 3: why.append('invisible from 3')
        elif w3 is not None and not (WMIN <= w3[0] <= WMAX and HMIN <= w3[1] <= HMAX): why.append('size %dx%d' % (w3[0], w3[1]))
        if why: bad.append((row, why))
    for r in rows: print(r)
    print('OUTSIDE RANGE (%d of %d):' % (len(bad), len(rows)))
    for r, w in bad: print('  ', r[:5], w)
    b.close()
sys.exit(1 if bad else 0)
