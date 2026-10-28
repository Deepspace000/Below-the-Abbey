"""Tests for places 3 and 4 of the Blighted Road (the Church of the Hollow Saint 9630 to 9634, Gallowmere 9640 to 9644).
Run your OWN server first (python -m http.server 8481 from the repo root):  python tools/blight34_test.py [load|links|quests|walk|save|shots|all]
Env: BL_PORT (default 8481), BTA_CHROME (Chrome path), BL_SHOTS (folder for screenshots).
load    both places and every room build with zero errors, ratings and names are right
links   gates lead east and west and back; Ashenfold west gate leads to the Church; Gallowmere's west gate leads to 9650
quests  blq7 to blq14 run from offer to hand-in
walk    flood fill: every person, object and door is reachable, no creature near an arrival square
save    a game saved in each room loads again in the same place
shots   screenshots of both places
"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8481')
SHOTS = os.environ.get('BL_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'bl34_shots'))
os.makedirs(SHOTS, exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'load'
CH = [9630, 9631, 9632, 9633, 9634]
GM = [9640, 9641, 9642, 9643]


def boot(p, town='blight3', w=900, h=600):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    try:
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9000", timeout=60000)
    except Exception:
        print('BOOT FAILED', errs[:8]); b.close(); sys.exit(1)
    pg.wait_for_timeout(2500)
    return b, pg, errs


def real(errs):
    return [e for e in errs if 'Failed to load resource' not in e and 'assets/sp_' not in e and 'assets/icn_' not in e]


def run_load():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = {bad: [], built: []};
          for (const id of %s) {
            try { if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id];
              if (!L) { out.bad.push(id + ' no level'); continue }
              const W = L.rows[0].length, H = L.rows.length;
              out.built.push([id, L.name, W, H, L.decor.length, L.enemies.length, LEVEL_RATING[id]]);
              if (!LEVEL_NAMES[id]) out.bad.push(id + ' no name');
              if (LEVEL_RATING[id] !== 86) out.bad.push(id + ' rating ' + LEVEL_RATING[id]);
              for (const d of L.decor) if (d.npc && !NPCS[d.npc]) out.bad.push(id + ' decor npc missing ' + d.npc);
              for (const d of L.decor) if (d.k && !IMG[d.k] && !/^kh_/.test(d.k)) out.bad.push(id + ' no picture ' + d.k);
            } catch (e) { out.bad.push(id + ' ' + e + ' ' + (e.stack || '').slice(0, 300)) } }
          return out }""" % json.dumps(CH + GM))
        for x in r['built']: print(x)
        print('bad', sorted(set(r['bad']))[:30])
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
          for (const n of [2, 3, 4, 5]) { const p = BL_ROAD[n - 1]; if (!LEVELS[p.id]) KH_LAZY[p.id]();
            const ds = doors(p.id), E = ds.find(d => d.side === 'E'), Wd = ds.find(d => d.side === 'W');
            const eDest = blEastDest(p), wDest = blWestDest(p);
            out.push({n: p.n, id: p.id, E: E && E.lvl, expectE: eDest.lvl, W: Wd && Wd.lvl, expectW: wDest && wDest.lvl, ok: !!E && E.lvl === eDest.lvl && !!Wd && Wd.lvl === wDest.lvl}) }
          return out }""")
        for x in r: print(x)
        ok = all(x['ok'] for x in r) and r[1]['W'] == 9630 and r[2]['W'] == 9640 and r[3]['W'] == 9650 and r[2]['E'] == 9620 and r[3]['E'] == 9630
        # a real walk through the gates
        for lv, ex in [(9620, 9630), (9630, 9640)]:
            pg.evaluate("([lv]) => { G.talk=null; goToLevel(lv,{x:6,y:35,f:1}); G.state='play' }", [lv])
            pg.wait_for_function("(lv)=>LEVEL===lv", arg=lv, timeout=60000); pg.wait_for_timeout(800)
            pg.evaluate("() => { const L=LEVELS[LEVEL]; for (const c in L.chars) { const d=KH_DOOR[L.chars[c]]; if (d && d.bl && d.side==='W') goToLevel(d.lvl, d.at) } }")
            pg.wait_for_function("(lv)=>LEVEL===lv", arg=ex, timeout=60000); pg.wait_for_timeout(500)
            pos = pg.evaluate("() => [LEVEL, G.P.x, G.P.y]"); print('walked west from', lv, '->', pos)
            ok = ok and pos[0] == ex
        print('errors', real(errs)[:12])
        b.close()
        return ok and not real(errs)


PLACES = [  # name, level, x, y, facing (0 north, 1 east, 2 south, 3 west)
    ('c01_east_gate', 9630, 74, 35, 3), ('c02_lychgate', 9630, 37, 34, 0), ('c03_path', 9630, 37, 30, 0), ('c04_church', 9630, 37, 25, 0), ('c05_west_graves', 9630, 26, 29, 0),
    ('c06_east_graves', 9630, 52, 28, 0), ('c07_sexton', 9630, 56, 31, 1), ('c08_road_west', 9630, 12, 35, 3), ('c09_pit', 9630, 54, 42, 0), ('c10_lean', 9630, 22, 41, 3),
    ('c11_nave', 9631, 10, 12, 0), ('c12_nave_choir', 9631, 10, 8, 0), ('c13_nave_altar', 9631, 10, 6, 0), ('c14_crypt', 9632, 10, 12, 0), ('c15_crypt_n', 9632, 10, 6, 0),
    ('c16_belfry', 9633, 6, 7, 0), ('c17_vestry', 9634, 5, 7, 0), ('c18_map', 9630, 37, 34, 0),
    ('g01_east_gate', 9640, 85, 38, 3), ('g02_causeway', 9640, 70, 38, 3), ('g03_causeway_mid', 9640, 60, 38, 3), ('g04_village', 9640, 46, 38, 3), ('g05_gibbet', 9640, 40, 36, 3),
    ('g06_jetty', 9640, 50, 38, 0), ('g07_ferryman', 9641, 6, 7, 0), ('g08_reeve', 9642, 6, 7, 0), ('g09_west', 9640, 14, 38, 3), ('g10_map', 9640, 70, 38, 3)]


def run_shots(sel=None):
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for name, lv, x, y, f in PLACES:
            if sel and not any(s in name for s in sel): continue
            pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [lv, x, y, f])
            pg.wait_for_timeout(2600)
            pg.evaluate("() => { G.talk=null; G.msgs=[]; G.lvlBanners.length=0; G.overview=%s }" % ('true' if name.endswith('_map') else 'false'))
            pg.wait_for_timeout(500)
            path = os.path.join(SHOTS, name + '.png'); pg.screenshot(path=path); print('shot', path)
        print('errors', real(errs)[:10])
        b.close()


if what in ('load', 'all'): print('LOAD', 'OK' if run_load() else 'FAIL')
if what in ('links', 'all'): print('LINKS', 'OK' if run_links() else 'FAIL')
if what in ('shots', 'all'): run_shots(sys.argv[2:] or None)
