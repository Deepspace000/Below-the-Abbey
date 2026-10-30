"""Walks the built Pale Spire levels and takes screenshots from well-spread viewpoints (farthest-point sampling over the reachable open cells, each facing its longest free view), then writes a contact sheet per level.
   python tools/ps_tour.py [level ids; t<n> is floor n of the Never-Ending Tower, e.g. 9730 9740 t1 t7]   (no ids: every built castle level)
   Env: PS_PORT, BTA_CHROME, PS_TOUR (output folder), PS_NV (viewpoints per level, default 4; 12 for the visual tour check). Run on your own server from the repo root.
   The sheet is 2 by 2 for 4 views, 3 wide otherwise; each view is labelled with its square and facing (N E S W)."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8621')
WAIT = int(os.environ.get('PS_LOADWAIT', '15000'))
class T:
    BUILT = "() => PSP.LEVELS.filter(l => l.built).map(l => l.id)"
    @staticmethod
    def real(errs):
        return [e for e in errs if 'Failed to load resource' not in e and 'assets/sp_' not in e and 'assets/icn_' not in e and 'hgtm model' not in e]
    @staticmethod
    def boot(p, town='palespire', w=900, h=600):
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': w, 'height': h})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
        pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9710&&typeof PSP!=='undefined'&&PSP.ready", timeout=WAIT + 45000)
        pg.wait_for_timeout(1500)
        return b, pg, errs
from PIL import Image

OUT = os.environ.get('PS_TOUR', os.path.join(os.environ.get('TEMP', '.'), 'ps_tour'))
NV = int(os.environ.get('PS_NV', '4'))
os.makedirs(OUT, exist_ok=True)

PICK = """async ([id, nv]) => { if (id >= 1e9) { await ntLoad(); ntEnsure(id) } else if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length;
  const bs = new Set(); for (const d of L.decor) if (d.block) bs.add(d.x + ',' + d.y);
  const TB = (typeof TERRS !== 'undefined' && TERRS[id] && TERRS[id].block) || null;
  const open = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L.rows[y][x] === '.' && !bs.has(x + ',' + y) && !(TB && TB[y * W + x]);
  const seen = new Set([L.start.x + ',' + L.start.y]), q = [[L.start.x, L.start.y]];
  for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b, k = nx + ',' + ny; if (!seen.has(k) && open(nx, ny)) { seen.add(k); q.push([nx, ny]) } } }
  const view = c => Math.max(...[[0,-1],[1,0],[0,1],[-1,0]].map(([dx, dy]) => { let n = 0; while (n < 14 && open(c[0] + dx * (n + 1), c[1] + dy * (n + 1))) n++; return n }));
  const cand = q.filter(c => view(c) >= 5).length >= nv ? q.filter(c => view(c) >= 5) : q;   // viewpoints with a real view, not a wall at arm's length
  const pts = [[L.start.x, L.start.y]]; while (pts.length < nv && cand.length) { let best = null, bd = -1; for (const c of cand) { let d = 1e9; for (const p of pts) d = Math.min(d, Math.hypot(c[0] - p[0], c[1] - p[1])); if (d > bd) { bd = d; best = c } } pts.push(best) }
  const dirs = [[0,-1,0],[1,0,1],[0,1,2],[-1,0,3]];
  return pts.map(p => { let bf = 0, bn = -1; for (const [dx, dy, f] of dirs) { let n = 0; while (n < 14 && open(p[0] + dx * (n + 1), p[1] + dy * (n + 1))) n++; if (n > bn) { bn = n; bf = f } } return [p[0], p[1], bf] }) }"""

GO = """([id, x, y, f]) => { if (G.state !== 'play') return 'notplay'; if (LEVEL !== id) { goToLevel(id, {x, y, f}) }
  G.P.x = x; G.P.y = y; G.P.f = f; G.P.angT = (f - 1) * Math.PI / 2; G.P.ang = G.P.angT; G.C.x = x; G.C.y = y; G.lvlBanners = []; G.talk = null; G.msgs = []; try { PSOV.on = false } catch (e) {} return LEVEL }   // the castle plan panel folded away for the pictures"""

from PIL import ImageDraw
args = sys.argv[1:]
with sync_playwright() as p:
    b, pg, errs = T.boot(p, 'palespire', 900, 600)
    ids = [int(1e9) + int(a[1:]) if a.startswith('t') else int(a) for a in args] or pg.evaluate(T.BUILT)
    for id_ in ids:
        pts = pg.evaluate(PICK, [id_, NV])
        shots = []
        for k, (x, y, f) in enumerate(pts):
            pg.evaluate(GO, [id_, x, y, f])
            pg.wait_for_timeout(2500 if k == 0 else 1200)
            pg.evaluate(GO, [id_, x, y, f])
            pg.wait_for_timeout(900)
            fn = os.path.join(OUT, 'ps_%d_%d.png' % (id_, k))
            pg.screenshot(path=fn, clip={'x': 0, 'y': 0, 'width': 790, 'height': 392})
            shots.append((fn, x, y, f))
        ims = [Image.open(s[0]) for s in shots]
        w, h = ims[0].size
        cols = 2 if len(ims) <= 4 else 3
        rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (w * cols, h * rows))
        dr = ImageDraw.Draw(sheet)
        for i, im in enumerate(ims):
            sheet.paste(im, ((i % cols) * w, (i // cols) * h))
            dr.text(((i % cols) * w + 6, (i // cols) * h + 4), '%d: %d,%d %s' % (i, shots[i][1], shots[i][2], 'NESW'[shots[i][3]]), fill=(255, 255, 0))
        name = ('t%d' % (id_ - int(1e9))) if id_ >= 1e9 else str(id_)
        sheet.save(os.path.join(OUT, 'sheet_%s.jpg' % name), quality=82)
        print('level', name, [list(q) for q in pts])
    print('errors', T.real(errs)[:5])
    b.close()
