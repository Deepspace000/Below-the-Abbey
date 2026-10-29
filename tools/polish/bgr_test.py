"""Tests for blight_growths.js. Own server first: python -m http.server 8606 (repo root). ONE mode at a time.
  python tools/polish/bgr_test.py verify     every level: counts, flood fill, corridor width, distances, spacing
  python tools/polish/bgr_test.py perf       decor counts and frame time with and without the pass
  python tools/polish/bgr_test.py shots      screenshots of the ten places, the hill and Sale
Env: BGR_PORT (8606), BTA_CHROME, BGR_SHOTS (folder)."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BGR_PORT', '8606')
SHOTS = os.environ.get('BGR_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'bgr_shots'))
os.makedirs(SHOTS, exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'verify'
IDS = [9610, 9620, 9630, 9640, 9650, 9660, 9670, 9680, 9690, 9700, 600]


def boot(p, town='blight1', w=1000, h=640, off=False):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    if off:
        pg.add_init_script('window.__BGR_OFF=true')
    if os.environ.get('BGR_INIT'):
        pg.add_init_script(os.environ['BGR_INIT'])
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=70000)
    pg.wait_for_timeout(2500)
    return b, pg, errs


BUILD = """async (id) => {
  if (id === 600) { saLoad(); for (let i = 0; i < 200 && !(SA.ready && (typeof KH_READY === 'undefined' || KH_READY)); i++) await new Promise(r => setTimeout(r, 300)); saBuild(); }
  else if (!LEVELS[id]) KH_LAZY[id]();
  return !!LEVELS[id] }"""

VERIFY = """(id) => {
  const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length, T = TERRS[id], N = W * H, idx = (x, y) => y * W + x;
  const mine = L.decor.filter(d => d._bgr), other = L.decor.filter(d => !d._bgr && !d._bgru && !d._win);
  const base = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (L.rows[y][x] === '.' && !(T && T.block && T.block[idx(x, y)])) base[idx(x, y)] = 1;
  const mk = (list) => { const b = new Uint8Array(N); for (const d of list) if (d.block && !d.found) b[idx(d.x, d.y)] = 1; return b };
  const bAll = mk(L.decor), bNo = mk(other);
  const pass = (b, x, y) => x >= 0 && y >= 0 && x < W && y < H && base[idx(x, y)] && !b[idx(x, y)];
  const wide = (b, x, y) => { if (!pass(b, x, y)) return false; for (let ox = -1; ox <= 0; ox++) for (let oy = -1; oy <= 0; oy++) { const a = x + ox, c = y + oy; if (pass(b, a, c) && pass(b, a + 1, c) && pass(b, a, c + 1) && pass(b, a + 1, c + 1)) return true } return false };
  const ent = [[L.start.x, L.start.y]];
  const p = (typeof blIs === 'function' && blIs(id)) ? blPlaceOf(id) : null; if (p && p.id === id) { ent.push([p.fromE.x, p.fromE.y], [p.fromW.x, p.fromW.y]) }
  if (id === 9670) for (const k of ['east', 'west']) ent.push([VT.arrive[k].x, VT.arrive[k].y]);
  if (id === 600 && SA.ROAD) ent.push([SA.ROAD.x, SA.ROAD.y]);
  const flood = (b) => { const seen = new Uint8Array(N), q = []; for (const [x, y] of ent) if (pass(b, x, y) && !seen[idx(x, y)]) { seen[idx(x, y)] = 1; q.push(idx(x, y)) }
    for (let i = 0; i < q.length; i++) { const c = q[i], x = c % W, y = (c / W) | 0; for (const [a, d] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + a, ny = y + d; if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[idx(nx, ny)] || !pass(b, nx, ny)) continue; seen[idx(nx, ny)] = 1; q.push(idx(nx, ny)) } } return seen };
  const R0 = flood(bNo), R1 = flood(bAll); let lost = 0, lostXY = [];
  for (let i = 0; i < N; i++) if (R0[i] && !bAll[i] && !R1[i]) { lost++; if (lostXY.length < 5) lostXY.push([i % W, (i / W) | 0]) }
  let narrow = 0, narrowXY = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (wide(bNo, x, y) && pass(bAll, x, y) && !wide(bAll, x, y)) { narrow++; if (narrowXY.length < 5) narrowXY.push([x, y]) }
  const doors = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = L.rows[y][x]; if (c === '.') continue; const g = L.chars && L.chars[c]; if (g !== undefined && (KH_DOOR[g] || (typeof g === 'number' && g >= 30 && g < 100))) doors.push([x, y]) }
  const prot = []; for (const d of other) if (d.npc || d.deco === false || d.wd) prot.push([d.x, d.y, 'npc ' + (d.npc || d.k)]); for (const it of (L.items || [])) if (!/^(herb_|supermana|greatermana|minormana|mana)/.test(it.k)) prot.push([it.x, it.y, 'item']);
  for (const [x, y] of doors) prot.push([x, y, 'door']);
  let close = [], solidBad = 0, spawnClose = 0, sameKey = 0;
  for (const m of mine) { for (const [x, y, w] of prot) if (Math.max(Math.abs(m.x - x), Math.abs(m.y - y)) <= 2) { close.push(m.k + '@' + m.x + ',' + m.y + ' near ' + w); break }
    for (const e of L.enemies) if (Math.max(Math.abs(m.x - e.x), Math.abs(m.y - e.y)) <= 1) spawnClose++;
    for (const o of mine) if (o !== m && o.k === m.k && Math.max(Math.abs(o.x - m.x), Math.abs(o.y - m.y)) <= 2) sameKey++;
    if (L.rows[m.y][m.x] !== '.' || (T && T.block && T.block[idx(m.x, m.y)])) solidBad++;
    const dup = L.decor.filter(o => o !== m && o.x === m.x && o.y === m.y && !o._win && !o._bgru).length; if (dup) solidBad++ }
  const reachT = (R, x, y) => R[idx(x, y)] || [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => x + a >= 0 && y + b >= 0 && x + a < W && y + b < H && R[idx(x + a, y + b)]);
  let cut = []; for (const [x, y, w] of prot) if (reachT(R0, x, y) && !reachT(R1, x, y)) cut.push(w + '@' + x + ',' + y);
  const pocket = []; for (const d of L.decor) { if (!d.block || d.found) continue; const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]]; if (nb.some(([a, b]) => pass(bAll, d.x + a, d.y + b))) continue;
    if (d._bgr || L.decor.some(o => o._bgr && o.block && nb.some(([a, b]) => o.x === d.x + a && o.y === d.y + b))) pocket.push(d.k + '@' + d.x + ',' + d.y) }
  const kinds = {}; for (const m of mine) kinds[m.k] = (kinds[m.k] || 0) + 1;
  return { id, pocket, mine: mine.length, solid: mine.filter(m => m.block).length, talk: mine.filter(m => m.npc).length, total: L.decor.length, lost, lostXY, narrow, narrowXY, close: close.slice(0, 5), nclose: close.length, spawnClose, sameKey, solidBad, cut, kinds, stats: L._bgrStats } }"""


def run_verify():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        bad = False
        for id in IDS:
            ok = pg.evaluate(BUILD, id)
            if not ok:
                print(id, 'NOT BUILT'); bad = True; continue
            r = pg.evaluate(VERIFY, id)
            flag = r['lost'] or r['narrow'] or r['nclose'] or r['spawnClose'] or r['sameKey'] or r['solidBad'] or r['cut'] or r['pocket'] or r['mine'] == 0 or r['mine'] > 250
            bad = bad or bool(flag)
            print(('FAIL ' if flag else 'ok   ') + json.dumps({k: r[k] for k in r if k != 'kinds'}))
        errs = [e for e in errs if 'Failed to load resource' not in e and 'assets/sp_' not in e and 'assets/icn_' not in e]
        print('errors', errs[:10]); b.close(); return not bad and not errs


FRAMES = """async (id) => {
  goToLevel(id, id === 600 ? SA.START : blPlaceOf(id).fromE); await new Promise(r => setTimeout(r, 2500));
  const t = []; for (let i = 0; i < 60; i++) { const a = performance.now(); frame(performance.now()); t.push(performance.now() - a) }
  t.sort((a, b) => a - b); return { med: +t[30].toFixed(1), p90: +t[54].toFixed(1), level: LEVEL, decor: G.decor.length } }"""


def run_perf():
    out = {}
    for off in (True, False):
        with sync_playwright() as p:
            b, pg, errs = boot(p, off=off)
            for id in [9610, 9650, 9680]:
                pg.evaluate(BUILD, id)
                out[(off, id)] = pg.evaluate(FRAMES, id)
            b.close()
    for k, v in out.items():
        print('OFF' if k[0] else 'ON ', k[1], v)
    return True


SHOTS_JS = """async ([id, x, y, f]) => { goToLevel(id, {x, y, f}); await new Promise(r => setTimeout(r, 2200)); return [LEVEL, G.C.x, G.C.y] }"""
SPOT = """(id) => { const L = LEVELS[id]; const m = L.decor.filter(d => d._bgr && d.block); if (!m.length) return null;
  let best = null, bn = -1; for (const s of m) { let n = 0; for (const o of m) if (Math.abs(o.x - s.x) <= 5 && Math.abs(o.y - s.y) <= 5) n++;
    const cells = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [s.x + a, s.y + b]).filter(([x, y]) => L.rows[y][x] === '.' && !L.decor.some(d => d.block && d.x === x && d.y === y));
    if (n > bn && cells.length) { bn = n; best = [cells[0][0], cells[0][1], s.x, s.y] } } return best }"""


def run_shots():
    names = [(9610, 'toll'), (9620, 'ash'), (9630, 'church'), (9640, 'gall'), (9650, 'orch'), (9660, 'lantern'), (9670, 'hill'), (9680, 'abbey'), (9690, 'mill'), (9700, 'bridge'), (600, 'sale')]
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for id, nm in names:
            pg.evaluate(BUILD, id)
            L = pg.evaluate(SPOT, id)
            if not L:
                print(nm, 'no spot'); continue
            x, y, tx, ty = L
            f = 1 if tx > x else 3 if tx < x else 2 if ty > y else 0
            pg.evaluate(SHOTS_JS, [id, x, y, f]); pg.wait_for_timeout(1500)
            pg.screenshot(path=os.path.join(SHOTS, nm + '.png')); print(nm, x, y, f)
        b.close()
    return True


ok = {'verify': run_verify, 'perf': run_perf, 'shots': run_shots}[what]()
print('PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
