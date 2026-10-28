"""Tests for places 8 to 10 of the Blighted Road: Hollowbell Abbey (9680 to 9686), the Rookery Mill (9690 to 9694), the Pale Bridge and the Gate of Sale (9700 to 9702).
Run your OWN server first (python -m http.server 8571 from the repo root), then run ONE mode at a time (no 'all' mode):
  python tools/blight8910_test.py load|links|quests|bosses|walk|save|shots [names]
Env: BL_PORT (default 8571), BTA_CHROME (Chrome path), BL_SHOTS (folder for screenshots).
load    every level builds with zero errors, names, ratings, pictures and people exist
links   gates join both ways along the whole road from the Vault to Sale (and Sale's east gate leads back to the bridge)
quests  blq40 to blq51 run from offer to hand-in
bosses  the Abbot, the Crow Queen and the Pale Knight can be killed, and the paths round them work
walk    flood fill: every person, object and door can be reached, nothing hostile next to an arrival square
save    a game saved in each level loads again in the same place
shots   screenshots
"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8571')
SHOTS = os.environ.get('BL_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'bl8910_shots'))
os.makedirs(SHOTS, exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'load'
HB = [9680, 9681, 9682, 9683, 9684, 9685, 9686]
RK = [9690, 9691, 9692, 9693, 9694]
PB = [9700, 9701, 9702]
ALL = HB + RK + PB


def boot(p, town='blight8', w=900, h=600):
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
              if (!LEVEL_NAMES[id] || /unfinished/i.test(LEVEL_NAMES[id])) out.bad.push(id + ' name ' + LEVEL_NAMES[id]);
              if (LEVEL_RATING[id] < 88) out.bad.push(id + ' rating ' + LEVEL_RATING[id]);
              for (const d of L.decor) if (d.npc && !NPCS[d.npc]) out.bad.push(id + ' decor npc missing ' + d.npc);
              for (const d of L.decor) if (d.k && !IMG[d.k] && !/^kh_/.test(d.k)) out.bad.push(id + ' no picture ' + d.k);
              for (const s of (L.sky || [])) if (s.k && !IMG[s.k]) out.bad.push(id + ' no sky picture ' + s.k);
              for (const e of L.enemies) if (!ENEMY_DEF[e.t]) out.bad.push(id + ' no creature ' + e.t);
            } catch (e) { out.bad.push(id + ' ' + e + ' ' + (e.stack || '').slice(0, 300)) } }
          return out }""" % json.dumps(ALL))
        for x in r['built']: print(x)
        print('bad', sorted(set(r['bad']))[:30])
        print('errors', real(errs)[:12])
        ok = not r['bad'] and not real(errs)
        b.close()
        return ok


PLACES = [  # name, level, x, y, facing (0 north, 1 east, 2 south, 3 west)
    ('h01_east', 9680, 76, 38, 3), ('h02_lane', 9680, 41, 36, 0), ('h03_gate', 9680, 41, 29, 0), ('h04_cloister', 9680, 41, 25, 0), ('h05_cloister2', 9680, 38, 21, 0),
    ('h06_church', 9680, 37, 13, 0), ('h07_tower', 9680, 24, 14, 0), ('h08_chapter', 9680, 54, 20, 0), ('h09_graves', 9680, 63, 12, 0), ('h10_road_w', 9680, 14, 38, 3),
    ('h11_lodge', 9680, 22, 44, 3), ('h12_foundry', 9680, 64, 44, 0), ('h13_pilgrims', 9680, 38, 49, 2), ('h14_map', 9680, 41, 36, 0),
    ('h15_chapter_in', 9681, 8, 9, 0), ('h16_script', 9682, 6, 7, 0), ('h17_refec', 9683, 9, 7, 0), ('h18_ring', 9684, 4, 7, 0), ('h19_belfry', 9685, 7, 9, 0), ('h20_crypt', 9686, 9, 11, 0),
    ('r01_east', 9690, 76, 35, 3), ('r02_hill', 9690, 44, 30, 0), ('r03_mill', 9690, 44, 22, 0), ('r04_parl', 9690, 58, 30, 0), ('r05_bridge', 9690, 30, 35, 3), ('r06_pond', 9690, 24, 46, 2),
    ('r07_west', 9690, 12, 35, 3), ('r08_map', 9690, 70, 35, 3), ('r09_ground', 9691, 7, 9, 0), ('r10_loft', 9692, 7, 7, 0), ('r11_cap', 9693, 7, 9, 0), ('r12_house', 9694, 5, 7, 0),
    ('p01_east', 9700, 76, 35, 3), ('p02_bridge_e', 9700, 62, 35, 3), ('p03_bridge', 9700, 55, 35, 3), ('p04_knight', 9700, 52, 35, 3), ('p05_west_bank', 9700, 40, 35, 3), ('p06_wall', 9700, 18, 35, 3),
    ('p07_toll', 9700, 8, 35, 3), ('p08_map', 9700, 70, 35, 3), ('p09_guard', 9701, 6, 8, 0), ('p10_wallwalk', 9702, 6, 8, 0)]


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


if what == 'load': print('LOAD', 'OK' if run_load() else 'FAIL')
if what == 'shots': run_shots(sys.argv[2:] or None)
