"""Graveyard tests on your OWN server (python -m http.server 8373 from the repo root):  python tools/gy_test.py [load|shots|mazes|quests|all]
load    graveyard, crypt and the four mazes build; flood fills; pictures; console errors
shots   screenshots of ten places into the scratch folder
mazes   each maze: fill, quest object, door, boss fight numbers
quests  the four quests and the ending in order with the real game functions
"""
import sys, time, os, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('GY_PORT', '8373')
SHOTS = os.environ.get('GY_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'gy_shots'))
os.makedirs(SHOTS, exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'load'
URL = 'http://localhost:%s/index.html?town=graveyard&lvl=84&v=%d' % (PORT, time.time())


def boot(p, url=URL, w=900, h=600):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('GY_CHROME') or None)  # GY_CHROME = path of an installed Chrome if Playwright's own is missing
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.on('response', lambda r: errs.append('HTTP %d %s' % (r.status, r.url)) if r.status >= 400 else None)
    pg.goto(url, wait_until='domcontentloaded', timeout=90000); pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=500", timeout=120000); pg.wait_for_timeout(2500)
    return b, pg, errs


def shot(pg, name):
    path = os.path.join(SHOTS, name + '.png'); pg.screenshot(path=path); print('shot', path)


def run_load():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = {level: LEVEL, ready: GY.ready, name: LEVEL_NAMES[LEVEL], rating: LEVEL_RATING[LEVEL]};
          const L = LEVELS[530]; out.yard = L && {w: L.rows[0].length, h: L.rows.length, decor: L.decor.length, enemies: L.enemies.length, lights: L.lights.length, softened: L._gy.softened, epi: L._gy.epitaphs, placed: L._gy.placed};
          out.pics = Object.keys(GY_LIST).filter(k => !IMG['gyp_' + k]).length;
          const lv = {};
          for (const id of [531, 532, 533, 534, 535]) { try { if (!LEVELS[id]) KH_LAZY[id](); const L2 = LEVELS[id]; lv[id] = {w: L2.rows[0].length, decor: L2.decor.length, enemies: L2.enemies.length, g: L2._gy && {unreached: L2._gy.unreached, bad: L2._gy.badNeed, door: L2._gy.doorReach}} } catch (e) { lv[id] = 'ERR ' + e + e.stack } }
          out.lv = lv; return out }""")
        print(json.dumps(r, indent=1))
        print('errors', errs[:12])
        shot(pg, 'load'); b.close()


if what in ('load', 'all'): run_load()


PLACES = [  # name, level, x, y, facing (0 north, 1 east, 2 south, 3 west)
    ('01_lychgate_in', 530, 66, 35, 3), ('02_plaza_tomb', 530, 35, 36, 0), ('03_tomb_close', 530, 35, 33, 0), ('04_iron_gate', 530, 58, 11, 0),
    ('05_family_plot', 530, 36, 46, 2), ('06_gravedigger', 530, 57, 40, 2), ('07_chapel', 530, 19, 27, 0), ('08_stair_door', 530, 58, 60, 2),
    ('09_archway', 530, 12, 60, 2), ('10_trapdoor', 530, 12, 10, 0), ('11_rows', 530, 46, 20, 3), ('12_crypt_nave', 531, 12, 17, 0), ('13_crypt_ghost', 531, 12, 9, 0),
    ('14_wenlock_lane', 496, 12, 31, 3), ('15_wenlock_gate', 496, 5, 31, 3)]


def run_shots(sel=None):
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for name, lv, x, y, f in PLACES:
            if sel and not any(s in name for s in sel): continue
            pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [lv, x, y, f])
            pg.wait_for_timeout(3500 if lv == 496 else 2200)
            pg.evaluate("() => { G.talk=null; G.msgs=[]; }")
            pg.wait_for_timeout(300)
            shot(pg, name)
        print('errors', [e for e in errs if 'assets/sp_' not in e and 'assets/icn_' not in e and 'Failed to load resource' not in e][:10])
        b.close()


if what in ('shots', 'all'): run_shots(sys.argv[2:] or None)


def run_maze_shots(ks=(0, 1, 2, 3)):
    ks = [int(a) - 1 for a in sys.argv[2:]] or ks
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for k in ks:
            info = pg.evaluate("""(k) => { const id = GY.M[k]; if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id], M = L._gy.M, d = M.door, B = M.boss;
              const dir = (d.ox < d.x) ? 1 : (d.ox > d.x) ? 3 : (d.oy < d.y) ? 2 : 0;
              const di = (d.ix > d.x) ? 3 : (d.ix < d.x) ? 1 : (d.iy > d.y) ? 0 : 2;
              return {id, start: L.start, door: d, dir, di, boss: L._gy.Q.boss} }""", k)
            id = info['id']; d = info['door']
            for nm, (x, y, f) in [('start', (info['start']['x'], info['start']['y'], 1)), ('door', (d['ox'], d['oy'], info['dir'])), ('boss', (d['ix'], d['iy'], info['di']))]:
                pg.evaluate("([id,x,y,f]) => { G.menu=false; G.talk=null; goToLevel(id,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [id, x, y, f])
                pg.wait_for_timeout(2500); pg.evaluate("() => { G.talk=null; G.msgs=[]; }"); pg.wait_for_timeout(200)
                shot(pg, 'm%d_%s' % (k + 1, nm))
        print('errors', [e for e in errs if 'assets/sp_' not in e and 'assets/icn_' not in e and 'Failed to load resource' not in e][:10])
        b.close()


if what in ('mazeshots',): run_maze_shots()


def run_stats():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => { const out = {heroes: G.heroes.map(h => [h.lvl, h.max, heroArmor(h)])};
          for (const t of ['gyvane','gygrimsby','gyaldric','gymorwenna','gyskel','gypike','gybmage','gyghoul','gyzombie','gygiant','gywraith','gyshade','gybanshee','gyrats','gyhound','gyrat','gyraven']) {
            const d = ENEMY_DEF[t], lvl = d.gyb !== undefined ? 84 + d.gyb : ({gyskel:84,gypike:84,gybmage:84,gyghoul:85,gyzombie:85,gygiant:85,gywraith:86,gyshade:86,gybanshee:86})[t] || 87, st = enemyStat(t, lvl);
            out[t] = {lvl, hp: st.hp, dmg: st.dmg, xp: st.xp, hitFront: Math.round(enemyHitC(d, 0, lvl) * 100) / 100, hitBack: Math.round(enemyHitC(d, 3, lvl) * 100) / 100} }
          return out }""")
        print(json.dumps(r))
        b.close()


if what == 'stats': run_stats()


def run_quests():
    js = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gy_qtest.js'), encoding='utf-8').read()
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        log = pg.evaluate(js)
        for l in log: print(l)
        bad = [l for l in log if l.startswith('FAIL')]
        print('FAILS', len(bad))
        print('errors', [e for e in errs if 'assets/sp_' not in e and 'assets/icn_' not in e and 'Failed to load resource' not in e][:10])
        b.close()


if what in ('quests', 'all'): run_quests()


def run_torch_shots():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for k in range(4):
            info = pg.evaluate("""(k) => { const id = GY.M[k]; if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id], T = L._gy.torches; const t = T[Math.min(5, T.length - 1)];
              const d = GYM_D[t[2]]; return {id, n: T.length, t, nx: t[0] + d[0], ny: t[1] + d[1], look: (t[2] + 2) % 4, colour: L._gy.torch.name} }""", k)
            print(k + 1, info)
            for nm, back in (('a', 0), ('b', 2)):
                d = [[0,-1],[1,0],[0,1],[-1,0]][info['look']]
                x = info['nx'] - d[0] * back; y = info['ny'] - d[1] * back
                pg.evaluate("([id,x,y,f]) => { G.menu=false; G.talk=null; goToLevel(id,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [info['id'], x, y, info['look']])
                pg.wait_for_timeout(2500); pg.evaluate("() => { G.talk=null; G.msgs=[]; }"); pg.wait_for_timeout(200)
                shot(pg, 'torch%d%s' % (k + 1, nm))
        print('errors', [e for e in errs if 'assets/sp_' not in e and 'assets/icn_' not in e and 'Failed to load resource' not in e][:10])
        b.close()


if what == 'torchshots': run_torch_shots()


def run_map_shots():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for lv, nm in [(530, 'yard'), (531, 'crypt'), (532, 'm1'), (533, 'm2'), (534, 'm3'), (535, 'm4'), (496, 'wenlock')]:
            pg.evaluate("([lv]) => { G.menu=false; G.talk=null; if(!LEVELS[lv]&&KH_LAZY[lv]&&lv!==496)KH_LAZY[lv](); const st=lv===496?{x:12,y:31,f:3}:LEVELS[lv].start; goToLevel(lv,{x:st.x,y:st.y,f:st.f||0}); G.state='play'; }", [lv])
            pg.wait_for_timeout(3000)
            pg.evaluate("() => { G.talk=null; G.flags.noFog=true; G.overview=true; }"); pg.wait_for_timeout(1800)   # the parchment map is G.overview (fog off so that all of it shows)
            shot(pg, 'map_' + nm)
            pg.evaluate("() => { G.overview=false; delete G.flags.noFog; }")
        print('errors', [e for e in errs if 'assets/sp_' not in e and 'assets/icn_' not in e and 'Failed to load resource' not in e][:10])
        b.close()


if what == 'mapshots': run_map_shots()
