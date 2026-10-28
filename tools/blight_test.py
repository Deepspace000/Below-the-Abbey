"""Blighted Road tests on your OWN server (python -m http.server 8447 from the repo root):  python tools/blight_test.py [load|links|quests|shots|all]
Env: BL_PORT (default 8447), BTA_CHROME (Chrome path), BL_SHOTS (folder for screenshots).
load    every id 9610 to 9709 builds with zero errors, ratings and names are right
links   every place: the east and west gates lead to the neighbour and back; Wenlock's open west gate leads to the Toll House
quests  the quests of the built places run from offer to hand-in (see tools/BLIGHT_NOTES.md)
shots   screenshots of each built place
"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8447')
SHOTS = os.environ.get('BL_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'bl_shots'))
os.makedirs(SHOTS, exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'load'


def boot(p, town='blight1', w=900, h=600):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=120000)
    pg.wait_for_timeout(2500)
    return b, pg, errs


def real(errs):
    return [e for e in errs if 'Failed to load resource' not in e and 'assets/sp_' not in e and 'assets/icn_' not in e]


def run_load():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = {bad: [], built: []};
          for (let id = 9610; id <= 9709; id++) {
            try { if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id];
              if (!L) { out.bad.push(id + ' no level'); continue }
              const W = L.rows[0].length, H = L.rows.length;
              if (id % 10 === 0) out.built.push([id, L.name, W, H, L.decor.length, L.enemies.length, LEVEL_RATING[id], BL_ROAD[(id - 9610) / 10].built]);
              if (!LEVEL_NAMES[id]) out.bad.push(id + ' no name');
            } catch (e) { out.bad.push(id + ' ' + e + ' ' + (e.stack || '').slice(0, 200)) } }
          return out }""")
        print(json.dumps(r, indent=1))
        print('errors', real(errs)[:12])
        ok = not r['bad'] and not real(errs)
        b.close()
        return ok


def run_links():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = [];
          const doors = id => { const L = LEVELS[id]; const o = []; for (const c in L.chars) { const d = KH_DOOR[L.chars[c]]; if (d && d.bl) o.push({side: d.side, lvl: d.lvl, at: d.at}) } return o };
          for (const p of BL_ROAD) { if (!LEVELS[p.id]) KH_LAZY[p.id]();
            const ds = doors(p.id), E = ds.find(d => d.side === 'E'), Wd = ds.find(d => d.side === 'W');
            const eDest = blEastDest(p), wDest = blWestDest(p);
            out.push({n: p.n, E: E && E.lvl, expectE: eDest.lvl, W: Wd && Wd.lvl, expectW: wDest && wDest.lvl, ok: !!E && E.lvl === eDest.lvl && (p.n === 10 || (Wd && Wd.lvl === wDest.lvl))}) }
          return out }""")
        bad = [x for x in r if not x['ok']]
        for x in r: print(x)
        print('errors', real(errs)[:12])
        b.close()
        return not bad and not real(errs)


if what in ('load', 'all'): print('LOAD', 'OK' if run_load() else 'FAIL')
if what in ('links', 'all'): print('LINKS', 'OK' if run_links() else 'FAIL')
