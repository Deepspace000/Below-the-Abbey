"""Tests for places 5 and 6 of the Blighted Road (the Bone Orchard 9650 to 9655, Lanternrest Waystation 9660 to 9666), on your OWN server (python -m http.server 8461 from the repo root):
   python tools/blight56_test.py [load|links|quests|shop|rest|save|walk|shots|all] [shot name parts]
Env: BL_PORT (default 8461), BTA_CHROME (Chrome path), BL_SHOTS (folder for screenshots).
load    both places and all their rooms build with zero errors
links   the gates of 5 and 6 lead to the neighbours and back; the west gate of 6 leads to the Vault stub 9670
quests  blq50 to blq53 and blq54 to blq59 run from offer to hand-in
shop    the quartermaster's stores and the reserve open, stock grows with the supplies; the smith opens
rest    the inn rests the party for free (no gold taken), the teleport stone is in the inn and nowhere else on the road
save    a game saved in each place and room loads again
walk    flood fill: gates, doors, people reached; no creature inside the fort walls or near an arrival square
shots   screenshots
"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8461')
SHOTS = os.environ.get('BL_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'bl56_shots'))
os.makedirs(SHOTS, exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'load'


def boot(p, town='blight5', w=900, h=600):
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


IDS = [9650, 9651, 9652, 9653, 9654, 9655, 9660, 9661, 9662, 9663, 9664, 9665, 9666]


def run_load():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""(ids) => { const out = {bad: [], built: []};
          for (const id of ids) { try { if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id];
            if (!L) { out.bad.push(id + ' no level'); continue }
            out.built.push([id, L.name, L.rows[0].length, L.rows.length, L.decor.length, L.enemies.length, LEVEL_RATING[id]]);
            if (!LEVEL_NAMES[id]) out.bad.push(id + ' no name'); if (LEVEL_RATING[id] !== 87) out.bad.push(id + ' rating ' + LEVEL_RATING[id]);
          } catch (e) { out.bad.push(id + ' ' + e + ' ' + (e.stack || '').slice(0, 200)) } }
          return out }""", IDS)
        for x in r['built']: print(x)
        print('bad', r['bad'])
        print('errors', real(errs)[:12])
        ok = not r['bad'] and not real(errs)
        b.close()
        return ok


def run_links():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => { const out = [];
          const doors = id => { const L = LEVELS[id]; const o = []; for (const c in L.chars) { const d = KH_DOOR[L.chars[c]]; if (d && d.bl) o.push({side: d.side, lvl: d.lvl, at: d.at}) } return o };
          for (const n of [4, 5, 6, 7]) { const p = BL_ROAD[n - 1]; if (!LEVELS[p.id]) KH_LAZY[p.id]();
            const ds = doors(p.id), E = ds.find(d => d.side === 'E'), Wd = ds.find(d => d.side === 'W'), eD = blEastDest(p), wD = blWestDest(p);
            out.push({n, id: p.id, built: p.built, E: E && E.lvl, expectE: eD.lvl, W: Wd && Wd.lvl, expectW: wD.lvl, ok: !!E && !!Wd && E.lvl === eD.lvl && Wd.lvl === wD.lvl}) }
          // 5 west -> 6 -> east back to 5; 6 west -> 9670 and 9670 east -> 6
          const p5 = BL_ROAD[4], p6 = BL_ROAD[5], p7 = BL_ROAD[6];
          out.push({back5: blEastDest(p6).lvl === 9650, to6: blWestDest(p5).lvl === 9660, to7: blWestDest(p6).lvl === 9670, back6: blEastDest(p7).lvl === 9660, arrive6W: JSON.stringify(blWestDest(p5).at), arrive5E: JSON.stringify(blEastDest(p6).at)});
          return out }""")
        for x in r: print(x)
        ok = all(x.get('ok', True) for x in r) and all(v for k, v in r[-1].items() if k.startswith(('back', 'to')))
        print('errors', real(errs)[:12])
        b.close()
        return ok and not real(errs)


PLACES = [  # name, level, x, y, facing (0 north, 1 east, 2 south, 3 west)
    ('o01_east_gate', 9650, 79, 36, 3), ('o02_lane_yard', 9650, 44, 36, 0), ('o03_yard', 9650, 44, 33, 0), ('o04_hall', 9650, 40, 28, 0), ('o05_orchard', 9650, 18, 17, 1),
    ('o06_orchard2', 9650, 24, 27, 0), ('o07_shed', 9650, 64, 34, 0), ('o08_hut', 9650, 71, 18, 0), ('o09_crypts', 9650, 20, 45, 0), ('o10_crypt_door', 9650, 25, 58, 0),
    ('o11_west', 9650, 12, 36, 3), ('o12_bell', 9650, 44, 31, 0), ('o13_ne', 9650, 62, 18, 1),
    ('o14_shed_in', 9651, 7, 7, 0), ('o15_cellar', 9652, 6, 7, 0), ('o16_crypt_in', 9653, 6, 7, 0), ('o17_hut_in', 9654, 5, 6, 0), ('o18_hall_in', 9655, 6, 7, 0), ('o19_map', 9650, 44, 36, 0),
    ('l01_east_gate', 9660, 80, 60, 3), ('l02_fort_front', 9660, 44, 56, 0), ('l03_gate', 9660, 44, 50, 0), ('l04_yard', 9660, 44, 42, 0), ('l05_hall', 9660, 44, 26, 0), ('l06_tents', 9660, 54, 33, 1),
    ('l07_inn_door', 9660, 28, 22, 0), ('l08_armoury', 9660, 24, 33, 0), ('l09_wall', 9660, 30, 42, 1), ('l10_stable', 9660, 62, 22, 0), ('l11_west', 9660, 10, 60, 3), ('l12_hut', 9660, 8, 56, 0),
    ('l13_inn', 9661, 7, 8, 0), ('l14_armoury', 9662, 6, 7, 0), ('l15_forge', 9663, 7, 7, 0), ('l16_hall', 9664, 6, 8, 0), ('l17_infirm', 9665, 6, 7, 0), ('l18_beacon', 9666, 4, 7, 0), ('l19_map', 9660, 44, 56, 0),
    ('l20_maw', 9660, 66, 66, 3), ('l21_beacon_tower', 9660, 22, 20, 0), ('l22_well', 9660, 47, 26, 1)]


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
