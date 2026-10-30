"""The whole-game audit (tools/game_audit.py) run on the floors of the Never-Ending Tower, which are built on demand and so are not in the main run.

   python tools/nt_audit.py [floors, e.g. 1-40,100,1000,100000,123456789] [--json out.json]
Env: GA_PORT (your OWN `python -m http.server <port>` from the repo root), BTA_CHROME, GA_TOL.
Each floor is built with the tower's own ntBuildFloor, loaded with reset(id) and checked with the exact AUDIT script of game_audit.py
(castle rules on, area 'neverending'), then given back so memory stays small. Exit 1 when a fix finding is not allowed in tools/game_audit_allow.json.
"""
import sys, os, json, time, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import game_audit as GA
from playwright.sync_api import sync_playwright

ONE = r"""async ([n, tol, keys]) => {
  if (!NT.ready) await ntLoad();
  const id = ntIdOf(n); window.__ALV = id;
  const fresh = !LEVELS[id]; let L; try { L = ntEnsure(id) } catch (e) { return [[id, 'BUILDFAIL', '', null, null, String(e).slice(0, 200)]] }
  const links = {}, arrive = {}, area = {}; links[id] = []; area[id] = ['The Never-Ending Tower', 'neverending'];
  window.__GA = {links, arrive, area};
  const AUD = new Function('return ' + window.__AUDSRC)();
  const out = AUD([[id], tol, keys]);
  if (fresh && LEVEL !== id) { delete LEVELS[id]; try { ntRelease(n) } catch (e) {} NTC.live.delete(n) }
  return out }"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('floors', nargs='?', default='1-40,100,1000,100000,123456789')
    ap.add_argument('--json')
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    floors = []
    for lo, hi in GA.ranges(a.floors):
        floors += list(range(lo, hi + 1))
    ents = GA.load_allow(); findings = []; t0 = time.time()
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        pg.add_init_script(GA.INIT)
        pg.goto('http://127.0.0.1:%s/index.html?town=neverending&floor=1&v=%d' % (GA.PORT, time.time()), wait_until='domcontentloaded', timeout=120000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof NT!=='undefined'&&NT.ready&&LEVEL>=1e9", timeout=180000)
        pg.wait_for_timeout(2500)
        pg.evaluate("s => { window.__AUDSRC = s }", GA.AUDIT)
        pg.evaluate("() => { window.__AL = [] }")
        for n in floors:
            res = pg.evaluate(ONE, [n, GA.TOL, GA.CASTLE_KEYS])
            for r in res:
                findings.append({'area': 'The Never-Ending Tower', 'areakey': 'neverending', 'level': r[0], 'name': 'floor %d' % n, 'code': r[1], 'key': r[2], 'x': r[3], 'y': r[4], 'extra': r[5]})
            for v, t, m in pg.evaluate("() => { const a = window.__AL; window.__AL = []; return a }"):
                if not GA.NOISE.search(m):
                    findings.append({'area': 'The Never-Ending Tower', 'areakey': 'neverending', 'level': 10**9 + n, 'name': 'floor %d' % n, 'code': 'CONSOLE_ERR' if t == 'error' else 'CONSOLE_WARN', 'key': '', 'x': None, 'y': None, 'extra': m})
        b.close()
    for f in findings:
        f['allowed'] = GA.allowed(f, ents)
    by = {}
    for f in findings:
        if not f['allowed']:
            by.setdefault(f['code'], []).append(f)
    print('TOWER AUDIT: %d floors in %.0fs, %d findings (%d allowed)' % (len(floors), time.time() - t0, len(findings), sum(1 for f in findings if f['allowed'])))
    for c in sorted(by, key=lambda c: -len(by[c])):
        print('  %-12s %4d   e.g. %s' % (c, len(by[c]), '; '.join('%s %s@%s,%s %s' % (f['name'], f['key'], f['x'], f['y'], f['extra'][:50]) for f in by[c][:3])))
    if a.json:
        with open(a.json, 'w', encoding='utf-8') as f:
            json.dump(findings, f, indent=0, ensure_ascii=False)
    fix = [f for f in findings if not f['allowed'] and f['code'] not in GA.REVIEW]
    print('AUDIT CLEAN' if not fix else 'AUDIT FOUND %d to fix' % len(fix))
    sys.exit(1 if fix else 0)


if __name__ == '__main__':
    main()
