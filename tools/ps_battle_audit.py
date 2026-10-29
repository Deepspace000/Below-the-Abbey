"""Battle visibility audit. There is no separate battle screen in Below the Abbey: a fight is the first-person 420x210 window with the
enemy plate, the fight-rating panel and the red health bar drawn over it. This script starts a real fight against each enemy type (the
creature is put on the square in front of the party, frozen so it does not move, and the real game loop draws it), records where the
game really drew it (every drawImage call of the frame is logged and the one belonging to the creature is picked by its screen
position), and checks the creature against the window.

   python tools/ps_battle_audit.py [types or prefixes...]      (default: every ENEMY_DEF type starting 'ps', the Never-Ending Tower
                                                                 families and their guardians; 'all' = every type that has a picture)
Env: PS_PORT (default 8621; run your OWN `python -m http.server <port>` from the repo root), BTA_CHROME (Chrome path),
     PS_SHOTS (folder for screenshots, default %TEMP%/ps_battle_shots), AUDIT_SHOTS=1 (save a screenshot of every fight).

For each type it checks, with the creature one square ahead (the worst case for being cut off) and as a group (one in front, two
standing behind at the diagonals):
   CUT      the part you can see is cut off by the left, right or top edge of the window
   UNDER_UI more than 30 percent of the visible body lies under the enemy plate, the fight-rating panel, the health bar or the Menu tab
   SPECK    the visible body is smaller than 40 pixels high (of 210) or 24 wide
   HIDDEN   in the group, a creature standing behind has less than half of its body visible past the others
Creatures that are really big (height 3.0 squares or more, or the giants the game lets stand over the window) are only reported, never failed.
"""
import sys, os, json, time
from playwright.sync_api import sync_playwright

PORT = os.environ.get('PS_PORT', '8621')
SHOTS = os.environ.get('PS_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'ps_battle_shots'))
SAVE = os.environ.get('AUDIT_SHOTS') == '1'
WAIT = int(os.environ.get('PS_LOADWAIT', '15000'))
os.makedirs(SHOTS, exist_ok=True)


def boot(p, town='palespire', w=960, h=640):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    try:
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9710&&typeof PSP!=='undefined'&&PSP.ready", timeout=WAIT + 45000)
    except Exception:
        print('BOOT FAILED', errs[:8]); b.close(); sys.exit(1)
    pg.wait_for_timeout(1500)
    return b, pg, errs


def enter(pg, id_):
    pg.evaluate("""(id) => { if (!LEVELS[id] && KH_LAZY[id]) KH_LAZY[id](); const L = LEVELS[id]; goToLevel(id, {x: L.start.x, y: L.start.y, f: L.start.f}) }""", id_)
    try:
        pg.wait_for_function('(id) => LEVEL === id && G.state === "play"', arg=id_, timeout=90000)
    except Exception:
        print('could not enter', id_)
    pg.wait_for_timeout(500)


SETUP = """() => {
  // the spy: every drawImage of a frame, in window coordinates (420 x 210)
  if (!window.__spy) {
    window.__spy = {on: false, calls: []};
    const orig = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (img, ...a) {
      if (window.__spy.on && this === ctx && a.length === 8 || (window.__spy.on && this === ctx && a.length === 4)) {
        const m = this.getTransform(); const d = a.length === 8 ? [a[4], a[5], a[6], a[7]] : [a[0], a[1], a[2], a[3]];
        window.__spy.calls.push([(d[0] * m.a + m.e) / 2, (d[1] * m.d + m.f) / 2, d[2] * m.a / 2, d[3] * m.d / 2]);
      }
      return orig.call(this, img, ...a);
    };
  }
  return true;
}"""

# find an open spot: 3 squares wide and 3 deep ahead, nothing blocking, level not terraced
FIND = """() => {
  const L = LEVELS[LEVEL]; if (!L || !L.rows) return null; if (typeof TERR_NOW !== 'undefined' && TERR_NOW) return null;
  const W = L.rows[0].length, H = L.rows.length, TB = (typeof TERRS !== 'undefined' && TERRS[LEVEL] && TERRS[LEVEL].block) || null;
  const blk = new Set((L.decor || []).filter(d => d.block).map(d => Math.round(d.x) + ',' + Math.round(d.y)));
  const open = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L.rows[y][x] === '.' && !(TB && TB[y * W + x]) && !blk.has(x + ',' + y);
  let best = null;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let f = 0; f < 4; f++) {
    const d = DIRS[f], s = [-d[1], d[0]]; let ok = open(x, y);
    for (let a = 1; a <= 4 && ok; a++) for (let b = -2; b <= 2 && ok; b++) if (!open(x + d[0] * a + s[0] * b, y + d[1] * a + s[1] * b)) ok = false;
    if (ok) { best = [x, y, f]; return best }
  }
  return null;
}"""

ENEMIES = """() => {
  const out = [];
  for (const t of Object.keys(ENEMY_DEF)) { const d = ENEMY_DEF[t]; if (d && d.img && IMG[d.img] && IMG[d.img].width) out.push(t) }
  return out;
}"""

RUN = """async (args) => {
  const {t, group} = args, P = G.P;
  const d = DIRS[P.f], s = [-d[1], d[0]];
  G.enemies = []; G.decor = []; if (G.flora) G.flora = []; G.items = [];
  G.talk = null; G.cut = null; G.menu = false; G.msgs && (G.msgs.length = 0);
  const spots = group ? [[1, 0], [2, -1], [2, 1]] : [[1, 0]];
  const es = [];
  for (const [a, b] of spots) {
    addEnemy(t, P.x + d[0] * a + s[0] * b, P.y + d[1] * a + s[1] * b, true);
    const e = G.enemies[G.enemies.length - 1]; e.chilled = 1e9; e.rx = e.x; e.ry = e.y; e.hp = e.maxhp = 1e9; es.push(e);
  }
  const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await frame(); await frame();
  window.__spy.calls = []; window.__spy.on = true; await frame(); window.__spy.on = false;
  const calls = window.__spy.calls.slice();
  const def = ENEMY_DEF[t], im = IMG[def.img];
  // the opaque part of the picture (alpha grid 24 x 24 and bounding box)
  const cv = document.createElement('canvas'); cv.width = 24; cv.height = 24; const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, 24, 24);
  const px = cx.getImageData(0, 0, 24, 24).data, grid = []; for (let i = 0; i < 576; i++) grid.push(px[i * 4 + 3] > 40 ? 1 : 0);
  const big = document.createElement('canvas'); const sc = Math.min(1, 200 / Math.max(im.width, im.height)); big.width = Math.max(1, Math.round(im.width * sc)); big.height = Math.max(1, Math.round(im.height * sc));
  const bx = big.getContext('2d'); bx.drawImage(im, 0, 0, big.width, big.height); const bd = bx.getImageData(0, 0, big.width, big.height).data;
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1; for (let y = 0; y < big.height; y++) for (let x = 0; x < big.width; x++) if (bd[(y * big.width + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
  const bb = x1 < 0 ? [0, 0, 1, 1] : [x0 / big.width, y0 / big.height, (x1 + 1) / big.width, (y1 + 1) / big.height];
  const res = es.map(e => {
    // the call that belongs to this creature: its centre is where the game says the creature is (e.sx, e.sy = top + 0.45 of the height)
    let best = null, bd2 = 1e9;
    for (const c of calls) { if (c[2] < 3) continue; const dd = Math.abs(c[0] + c[2] / 2 - e.sx) + Math.abs(c[1] + .45 * c[3] - e.sy); if (dd < bd2) { bd2 = dd; best = c } }
    return {sx: e.sx, sy: e.sy, rect: bd2 < 3 ? best : null};
  });
  return {t, name: def.name, w: def.w, ph: def.ph, fly: !!def.fly, floatH: def.floatH, boss: !!def.boss, ap: def.aboveParty || 0, huge: (typeof HUGE_FOES !== 'undefined' && HUGE_FOES.includes(t)), imgH: def.w * im.height / im.width, iw: im.width, ih: im.height, bb, grid, res, plate: !!frontEnemy(4), cmpMin: CMP_MIN && CMP_MIN.on, ny: HH};
}"""


def analyse(r, group):
    """turn the recorded rectangles into verdicts"""
    problems = []
    huge = r['huge'] or r['imgH'] >= 3.0 or (r.get('ph') or 0) >= 3.0
    bb, grid = r['bb'], r['grid']
    zones = [(26, 4, 206, 26), (176, 0, 256, 18), (28, 30, 152, 114), (8, 40, 21, 190)]   # plate, menu tab, rating panel, health bar (window coordinates)
    opaque = []
    for i, e in enumerate(r['res']):
        c = e['rect']
        if not c:
            problems.append('NOT_DRAWN(%d)' % i); opaque.append(None); continue
        x, y, w, h = c
        o = (x + bb[0] * w, y + bb[1] * h, x + bb[2] * w, y + bb[3] * h)
        opaque.append(o)
    m = {}
    if opaque and opaque[0]:
        o = opaque[0]; m['box'] = [round(v) for v in o]
        # cut off by the window
        cut = []
        if o[0] < -1: cut.append('left %d' % -o[0])
        if o[2] > 421: cut.append('right %d' % (o[2] - 420))
        if o[1] < -1: cut.append('top %d' % -o[1])
        if cut: problems.append('CUT(' + ', '.join(cut) + ')')
        # under the interface: share of the opaque cells inside a zone
        tot = hid = 0
        w, h = o[2] - o[0], o[3] - o[1]
        for gy in range(24):
            for gx in range(24):
                if not grid[gy * 24 + gx]: continue
                px = (gx + .5) / 24; py = (gy + .5) / 24
                if not (bb[0] <= px <= bb[2] and bb[1] <= py <= bb[3]): continue
                X = o[0] + (px - bb[0]) / (bb[2] - bb[0]) * w; Y = o[1] + (py - bb[1]) / (bb[3] - bb[1]) * h
                tot += 1
                if any(z[0] <= X <= z[2] and z[1] <= Y <= z[3] for z in zones if not (r['cmpMin'] and z[1] == 30)): hid += 1
        m['under_ui'] = round(hid / tot, 2) if tot else 0
        if tot and hid / tot > .3: problems.append('UNDER_UI(%d%%)' % round(100 * hid / tot))
        # a speck
        vis_h = min(o[3], 210) - max(o[1], 0); vis_w = min(o[2], 420) - max(o[0], 0)
        m['size'] = [round(vis_w), round(vis_h)]
        if vis_h < 40 or vis_w < 24: problems.append('SPECK(%dx%d)' % (vis_w, vis_h))
    if group and len(opaque) == 3 and all(opaque):
        # the two behind, against the one in front (and each other): how much of each is left uncovered
        front = opaque[0]; vis = []
        for i in (1, 2):
            o = opaque[i]; area = (o[2] - o[0]) * (o[3] - o[1]); cov = 0
            ix = max(0, min(o[2], front[2]) - max(o[0], front[0])); iy = max(0, min(o[3], front[3]) - max(o[1], front[1])); cov = ix * iy
            vis.append(1 - cov / area if area > 0 else 1)
        m['group_visible'] = [round(v, 2) for v in vis]
        if min(vis) < .5: problems.append('HIDDEN(%d%% of the one behind)' % round(100 * min(vis)))
    return problems, m, huge


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        spot = None; used = None
        for lv in [9720, 9730, 9731, 9732, 9740, 9750, 9760]:
            try:
                enter(pg, lv)
            except Exception:
                continue
            s = pg.evaluate(FIND)
            if s: spot, used = s, lv; break
        if not spot:
            print('no open spot found'); b.close(); sys.exit(1)
        print('fighting in level %s at %s' % (used, spot))
        pg.evaluate(SETUP)
        pg.evaluate("""(s) => { G.P.x = s[0]; G.P.y = s[1]; G.P.f = s[2]; G.C.x = s[0]; G.C.y = s[1]; G.P.angT = (s[2] - 1) * Math.PI / 2; G.C.a = G.P.angT; G.state = 'play'; }""", spot)
        # a long wait for the Never-Ending Tower and Pale Spire creatures: their pictures are loaded when the castle is (PSP.ready)
        # the Never-Ending Tower guardians (ntg_<type>) are made on demand: make them all
        pg.evaluate("() => { try { for (const f of NT_FAMS) for (const t of f.types) if (ntfOk(t)) ntfGuardian(t) } catch (e) { console.error(e) } }")
        allt = pg.evaluate(ENEMIES)
        nt = pg.evaluate("() => { const o = []; try { for (const f of NT_FAMS) for (const t of f.types) { o.push(t); o.push('ntg_' + t) } } catch (e) {} return o }")
        if not args:
            types = [t for t in allt if t.startswith('ps')] + [t for t in nt if t in allt and not t.startswith('ps')]
        elif args == ['all']:
            types = allt
        else:
            types = [t for t in allt if any(t == a or (a.endswith('*') and t.startswith(a[:-1])) or t.startswith(a) for a in args)]
        types = list(dict.fromkeys(types))
        print('%d creature types to check (of %d with a picture)' % (len(types), len(allt)))
        bad = {}; rows = []
        for t in types:
            row = {'t': t}
            try:
                pg.evaluate("(s) => { G.P.x = s[0]; G.P.y = s[1]; G.P.f = s[2]; G.C.x = s[0]; G.C.y = s[1]; G.P.angT = (s[2] - 1) * Math.PI / 2; G.C.a = G.P.angT }", spot)
                r1 = pg.evaluate(RUN, {'t': t, 'group': False})
                if SAVE: pg.screenshot(path=os.path.join(SHOTS, 'fight_%s.png' % t))
                pr1, m1, huge = analyse(r1, False)
                r2 = pg.evaluate(RUN, {'t': t, 'group': True})
                if SAVE: pg.screenshot(path=os.path.join(SHOTS, 'group_%s.png' % t))
                pr2, m2, _ = analyse(r2, True)
                pr = list(dict.fromkeys(pr1 + [q for q in pr2 if q.startswith('HIDDEN')]))
                row.update(name=r1['name'], w=r1['w'], ph=r1['ph'], imgH=round(r1['imgH'], 2), fly=r1['fly'], huge=huge, problems=pr, m=m1, g=m2.get('group_visible'))
            except Exception as ex:
                row.update(problems=['ERROR ' + str(ex)[:120]], huge=False)
            rows.append(row)
            flag = 'BIG ' if row.get('huge') else '    '
            print('%s%-16s %-9s %s %s' % (flag, t, 'FAIL' if row['problems'] and not row.get('huge') else ('big-ok' if row.get('huge') and row['problems'] else 'ok'), row.get('m', {}).get('box', ''), '; '.join(row['problems'])))
            if row['problems'] and not row.get('huge'): bad[t] = row['problems']
        json.dump(rows, open(os.path.join(SHOTS, 'audit.json'), 'w'), indent=1)
        print('\n%d checked, %d cut off or hidden' % (len(rows), len(bad)))
        for t, pr in bad.items(): print('  ', t, pr)
        real = [e for e in errs if 'Failed to load resource' not in e]
        if real: print('page errors', real[:5])
        b.close()
        sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
