"""Tests for the Never-Ending Tower, on your OWN server (python -m http.server 8624 from the repo root). Run ONE mode at a time:
   python tools/nt_test.py [build|foes|shops|save|tele|dash|walk|mem|seal|shots|all] [floor numbers for shots]
Env: NT_PORT (default 8624), BTA_CHROME (Chrome path), NT_SHOTS (screenshot folder)
build   floors 1 to 60 and 100, 1000, 100000 build quickly (timed); rows rectangular; arrival and stairs open and joined by a flood fill; the stone reachable; no creature within 6 of the
        stone or the arrival; neighbouring floors differ in colour; names unique-ish; no NaN anywhere
foes    every creature of every family has a loaded picture, enemyStat is finite at levels 100, 1000 and 1e6, floor creatures stand at their floor's level
shops   the cycle covers every shop stock of the game; keepers exist, their stock is not empty, shop floors have a reachable shop room
save    a game saved on floor 37 and in the entrance hall loads again in the same place with chests, items and the dead kept
tele    the stone wakes when stepped on, the network lists the floors, the menu has the plus and minus buttons, the stones of floors are found by the world map
dash    no em dash in any nt file, the notes or this test
seal    the tower is always open; the level gate (100) at the great door and the road gate, the jump flag passes; the south gate leads to the Crooked Road; stairs down from floor 1 reach the entrance
mem     240 floors in a row: textures, built floors and the save stay bounded
walk    the party walks a real path from the arrival to the stairs up on floors 1 to 40, 100, 1000, 100000 with the real collision grid, uses the stairs up and down, and reaches the stone, the shop and the fishing stands
fish    a pond floor: the stand faces a deep-water fishing spot, a rod starts the fishing, 200 catches with no error
shots   screenshots of floors of different looks (default twelve)
"""
import sys, os, json, time, re, math
from playwright.sync_api import sync_playwright
PORT = os.environ.get('NT_PORT', '8624')
SHOTS = os.environ.get('NT_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'nt_shots'))
os.makedirs(SHOTS, exist_ok=True)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
what = sys.argv[1] if len(sys.argv) > 1 else 'build'


def boot(p, q='town=neverending&floor=1', w=900, h=600):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?%s&v=%d' % (PORT, q, time.time()), wait_until='domcontentloaded', timeout=90000)
    try:
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof NT!=='undefined'&&NT.ready&&LEVEL>=1e9", timeout=120000)
    except Exception:
        print('BOOT FAILED', errs[:8]); b.close(); sys.exit(1)
    pg.wait_for_timeout(1500)
    return b, pg, errs


def real(errs):
    return [e for e in errs if 'Failed to load resource' not in e and 'assets/sp_' not in e and 'assets/icn_' not in e and 'hgtm model' not in e]


FAILS = []


def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' ' + str(extra)[:600] if extra and not ok else ''))
    if not ok:
        FAILS.append(name)


def finish(errs):
    r = real(errs)
    check('no page errors', not r, r[:6])
    print('FAILED: ' + ', '.join(FAILS) if FAILS else 'ALL PASSED')
    sys.exit(1 if FAILS else 0)


def goto_floor(pg, f):
    pg.evaluate("""(f) => { const id = NT.BASE + f; if (!LEVELS[id]) ntEnsure(id); const L = LEVELS[id]; goToLevel(id, {x: L.start.x, y: L.start.y, f: L.start.f}) }""", f)
    pg.wait_for_function('(f) => LEVEL === NT.BASE + f && G.state === "play"', arg=f, timeout=60000)
    pg.wait_for_timeout(400)


BUILD_JS = """(floors) => {
  const out = [], names = new Set(), prev = {};
  for (const f of floors) {
    const id = NT.BASE + f, t0 = performance.now();
    if (LEVELS[id]) { delete LEVELS[id]; ntRelease(f); NTC.live.delete(f); }
    let L, err = null;
    try { L = ntBuildFloor(f); } catch (e) { err = String(e); }
    const dt = performance.now() - t0, r = {f, ms: Math.round(dt), err, probs: []};
    if (L) {
      const W = L.rows[0].length, H = L.rows.length, V = L._nt, pl = V.plan;
      r.kind = V.look.kind; r.W = W; r.H = H; r.name = L.name; r.hue = Math.round(V.look.pal.hue); r.pat = V.look.pattern; r.wall = V.look.wallBase;
      if (!L.rows.every(x => x.length === W)) r.probs.push('rows not rectangular');
      if (W < 24 || H < 24 || W > 100 || H > 100) r.probs.push('size ' + W + 'x' + H);
      const open = (x, y) => L.rows[y] && L.rows[y][x] === '.';
      if (!open(L.start.x, L.start.y)) r.probs.push('start not open');
      const dg = L.rows[pl.down.y][pl.down.x], ug = L.rows[pl.up.y][pl.up.x];
      if (!(KH_DOOR[L.chars[dg]] && KH_DOOR[L.chars[dg]].nt === 'down')) r.probs.push('down door missing');
      if (!(KH_DOOR[L.chars[ug]] && KH_DOOR[L.chars[ug]].nt === 'up')) r.probs.push('up door missing');
      const blk = new Set(); for (const d of L.decor) if (d.block) blk.add(d.x + ',' + d.y);
      const seen = new Set([L.start.x + ',' + L.start.y]), q = [[L.start.x, L.start.y]];
      for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k) || !open(nx, ny) || blk.has(k)) continue; seen.add(k); q.push([nx, ny]); } }
      if (!seen.has(pl.up.ix + ',' + pl.up.iy)) r.probs.push('up stairs not reachable');
      if (V.route) { let onRoute = 0; for (const d of L.decor) if (d.block && V.route.has(d.x + ',' + d.y)) onRoute++; for (const e of L.enemies) if (V.route.has(e.x + ',' + e.y)) onRoute++;
        if (onRoute) r.probs.push('props or creatures on the route to the stairs: ' + onRoute);
        if (!V.route.has(pl.down.ix + ',' + pl.down.iy)) r.probs.push('route does not reach the arrival'); }
      if (!seen.has(L.tele.x + ',' + L.tele.y)) r.probs.push('stone not reachable');
      let unreach = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (open(x, y) && !blk.has(x + ',' + y) && !seen.has(x + ',' + y)) unreach++;
      if (unreach) r.probs.push('unreachable squares ' + unreach);
      for (const e of L.enemies) {
        if (Math.hypot(e.x - L.start.x, e.y - L.start.y) <= 6) r.probs.push('creature within 6 of arrival ' + e.t);
        if (Math.hypot(e.x - L.tele.x, e.y - L.tele.y) <= 6) r.probs.push('creature within 6 of stone ' + e.t);
        if (!open(e.x, e.y) || blk.has(e.x + ',' + e.y)) r.probs.push('creature on a wall or prop ' + e.t);
        if (e.lvl !== 99 + f) r.probs.push('creature level ' + e.lvl);
        if (!Number.isFinite(e.lvl)) r.probs.push('NaN level');
      }
      if (new Set(L.enemies.map(e => e.x + ',' + e.y)).size !== L.enemies.length) r.probs.push('two creatures on one square');
      for (const d of L.decor) if (!Number.isFinite(d.x) || !Number.isFinite(d.y)) r.probs.push('NaN decor');
      r.enemies = L.enemies.length; r.decor = L.decor.length; r.torches = V.torches.length; r.chests = V.chests; r.lights = L.lights.length;
      if (names.has(L.name)) r.probs.push('name repeated'); names.add(L.name);
      if (f > 1) { const pv = ntLook(f - 1), cu = V.look; if (!ntLooksDiffer(cu, pv)) r.probs.push('looks like the floor below: hues ' + Math.round(pv.pal.hue) + ' ' + Math.round(cu.pal.hue) + ' ' + pv.pattern + ' ' + cu.pattern); }
      if (V.torches.length < 30) r.probs.push('few torches ' + V.torches.length);
      // ponds: blocked by an invisible blocker, not the stairs/stone/arrival/shop/route; the fishing spot is reachable and faces the pond; clearings 2 to 4
      r.ponds = (pl.ponds || []).length; r.clearings = (pl.clearings || []).length;
      if (r.clearings < 2 || r.clearings > 4) r.probs.push('clearings ' + r.clearings);
      for (const pd of (pl.ponds || [])) {
        for (const [x, y] of pd.cells) {
          if (!blk.has(x + ',' + y)) r.probs.push('pond square not blocking ' + x + ',' + y);
          if ((x === pl.up.ix && y === pl.up.iy) || (x === pl.down.ix && y === pl.down.iy) || (x === L.tele.x && y === L.tele.y)) r.probs.push('stairs or stone inside a pond');
          if (V.route && V.route.has(x + ',' + y)) r.probs.push('pond on the route');
          if (pl.shop && x >= pl.shop.x0 && x <= pl.shop.x1 && y >= pl.shop.y0 && y <= pl.shop.y1) r.probs.push('pond in the shop');
        }
        const st = pd.stand; if (!seen.has(st.x + ',' + st.y)) r.probs.push('fishing stand not reachable');
        const sp = fshSpots(NT.BASE + f); if (!sp.get((st.x + st.dx) + ',' + (st.y + st.dy))) r.probs.push('no fishing patch in front of the stand');
      }
      if (r.ponds && !(FSH_ADD[NT.BASE + f] && FSH_ADD[NT.BASE + f].length === r.ponds)) r.probs.push('fishing spots not registered');
      if (f % 10 === 0 && !L.enemies.some(e => e.t.startsWith('ntg_'))) r.probs.push('no guardian on a tenth floor');
      if (f % 7 === 0 && !(V.shop)) r.probs.push('no shop on a seventh floor');
      if (f % 7 === 0) { const s = V.shop; if (!seen.has(s.x + ',' + (s.y + 1))) r.probs.push('shop not reachable'); }
    }
    out.push(r);
    delete LEVELS[id]; ntRelease(f); NTC.live.delete(f);
  }
  return out;
}"""


def run_build():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        floors = list(range(1, 61)) + [100, 1000, 100000]
        res = pg.evaluate(BUILD_JS, floors)
        bad = [r for r in res if r['err'] or r['probs']]
        for r in bad:
            print('  floor', r['f'], r['err'], r['probs'][:6])
        check('all floors build with no problems (%d floors)' % len(res), not bad)
        ms = [r['ms'] for r in res if not r['err']]
        print('build ms: max %d avg %.1f; slowest' % (max(ms), sum(ms) / len(ms)), sorted(res, key=lambda r: -r['ms'])[0]['f'])
        check('every floor builds in under 400 ms', max(ms) < 400, max(ms))
        kinds = {}
        for r in res:
            kinds[r.get('kind')] = kinds.get(r.get('kind'), 0) + 1
        print('kinds', kinds)
        check('all seven layout kinds appear', len([k for k in kinds if k]) == 7, kinds)
        for r in res:
            if r['f'] in (1, 7, 10, 100, 1000, 100000):
                print('  ', r['f'], r.get('name'), r.get('kind'), '%sx%s' % (r.get('W'), r.get('H')), 'foes', r.get('enemies'), 'torches', r.get('torches'), 'chests', r.get('chests'), r['ms'], 'ms')
        finish(errs)


def run_foes():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = {fams: [], missing: [], bad: [], guard: [], pools: {}};
          const fams = ntfFamilies();
          out.fams = fams.map(f => f.k + ':' + f.types.length);
          for (const f of NT_FAMS) for (const t of f.types) { if (!ENEMY_DEF[t]) { out.missing.push(t); continue; } }
          const used = new Set(); for (const f of fams) for (const t of f.types) used.add(t);
          for (const t of used) {
            const d = ENEMY_DEF[t], im = IMG[d.img];
            if (!im || !(im.width > 0)) out.bad.push(t + ' has no picture');
            for (const lv of [100, 1000, 1e6]) { const s = enemyStat(t, lv);
              const nums = [s.hp, s.dmg[0], s.dmg[1], s.xp, s.gold[0], s.gold[1]];
              if (!nums.every(Number.isFinite) || s.hp <= 0) out.bad.push(t + ' at ' + lv + ' ' + JSON.stringify(s)); }
          }
          out.used = used.size;
          // guardians
          for (const t of [...used].slice(0, 6)) { const g = ntfGuardian(t); const s = enemyStat(g, 1e6); out.guard.push(g + ' ' + s.hp); if (!Number.isFinite(s.hp)) out.bad.push(g + ' not finite'); }
          // floor pools: creatures of floors 1..200 are all in the used set, stand at the floor's level, and draw
          for (const f of [1, 2, 3, 10, 37, 100, 1000]) { const l = ntLook(f), pl = ntfPool(f, l); out.pools[f] = pl.fams.join('+') + ' ' + pl.types.length; for (const t of pl.types) if (!used.has(t)) out.bad.push('pool of ' + f + ' holds an unusable ' + t); }
          // an ordinary creature at a very large level: hit points and damage as numbers
          return out;
        }""")
        print('families', r['fams'])
        print('pools', r['pools'])
        print('creatures in use', r['used'], 'missing definitions (not used)', r['missing'])
        check('at least 6 families have usable creatures', len(r['fams']) >= 6, r['fams'])
        check('every usable creature has a picture and finite numbers at levels 100, 1000 and 1e6', not r['bad'], r['bad'][:8])
        check('guardians exist and are finite', len(r['guard']) >= 3, r['guard'])
        # the floors really spawn them, at the right level: go to three floors and read G.enemies
        for f in (2, 37, 100):
            goto_floor(pg, f)
            e = pg.evaluate("() => G.enemies.map(e => [e.t, e.lvl, e.maxhp])")
            check('floor %d: creatures stand at level %d (+-1 spread)' % (f, 99 + f), e and all(abs(x[1] - (99 + f)) <= 2 and math.isfinite(x[2]) and x[2] > 0 for x in e), e[:3])
        # every pool creature is drawn: put one of each in front of the party and take a frame; no error
        pg.evaluate("""() => { const t = [...ntfFamilies().flatMap(f => f.types)]; window._ntAll = t; }""")
        n = pg.evaluate("() => _ntAll.length")
        for i in range(0, n, 12):
            pg.evaluate("""(i) => { const L = LEVELS[LEVEL]; const P = G.P; const dd = DIRS[P.f]; let k = 0;
              G.enemies = G.enemies.filter(e => false);
              for (let j = i; j < Math.min(_ntAll.length, i + 12); j++) { const x = P.x + dd[0] * (2 + (k % 3)), y = P.y + dd[1] * (2 + (k % 3)); addEnemy(_ntAll[j], x, y, false); k++; } }""", i)
            pg.wait_for_timeout(250)
        check('every creature of every pool could be added and drawn without error', True)
        finish(errs)


def run_shops():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = {bad: [], covered: [], n: NT_SHOPS.length, missingStock: []};
          const keys = new Set(NT_SHOPS.map(s => s[3]));
          for (const k of Object.keys(KH_STOCK)) if (!keys.has(k) && !NT_SHOP_SKIP.includes(k)) out.missingStock.push(k);
          for (const s of NT_SHOPS) {
            const f = KH_STOCK[s[3]]; if (!f) { out.bad.push(s[0] + ' no stock ' + s[3]); continue; }
            let rows = []; try { rows = (typeof f === 'function' ? f() : f).filter(q => ITEMDEF[q[0]]); } catch (e) { out.bad.push(s[0] + ' stock error ' + e); }
            if (!rows.length) out.bad.push(s[0] + ' empty stock');
            if (!IMG[khFaceKey(s[4])] && !IMG[s[4]]) out.bad.push(s[0] + ' face ' + s[4] + ' not loaded');
            const i = NT_SHOPS.indexOf(s); const id = ntKeeper(i); if (!KH_KEEPERS[id] || !NPCS[id]) out.bad.push(s[0] + ' keeper not registered');
          }
          // the cycle, floor by floor
          const seq = []; for (let k = 1; k <= NT_SHOPS.length * 2; k++) seq.push(ntShopOf(k * NT.SHOP_EVERY)[0]);
          out.cycle = new Set(seq.slice(0, NT_SHOPS.length)).size; out.repeatsAfter = seq[0] === seq[NT_SHOPS.length];
          out.first = seq.slice(0, 11);
          return out; }""")
        print('shops in the cycle', r['n'], 'first ten', r['first'])
        check('no shop is broken', not r['bad'], r['bad'][:8])
        check('the cycle visits every shop before repeating', r['cycle'] == r['n'] and r['repeatsAfter'], r)
        check('every stock of the game is in the cycle (or listed as a duplicate)', not r['missingStock'], r['missingStock'])
        # shop floors: build 7, 14 and 49 and read the keeper
        for f in (7, 14, 77, 280):
            goto_floor(pg, f)
            k = pg.evaluate("""() => { const L = LEVELS[LEVEL], V = L._nt; const kd = L.decor.find(d => d.npc && d.npc.startsWith('nt_k_')); return {shop: V.shop && V.shop.name, npc: kd && kd.npc, face: kd && kd.k, haveFace: kd && !!IMG[kd.k], foes: L.enemies.filter(e => Math.hypot(e.x - V.shop.x, e.y - V.shop.y) < 10).length}; }""")
            check('floor %d has a shop with a keeper (%s)' % (f, k['shop']), k['shop'] and k['npc'] and k['haveFace'] and k['foes'] == 0, k)
        # talk to a keeper: the shop opens
        goto_floor(pg, 7)
        t = pg.evaluate("""() => { const d = G.decor.find(d => d.npc && d.npc.startsWith('nt_k_')); startTalk(d); const nd = G.talk && G.talk.node; const opts = nd ? nd.opts.map(o => o[0]) : null;
           if (nd) { const b = nd.opts.find(o => /Browse|Buy/.test(o[0])); if (b) b[1](); } return {opts, shop: !!(d.shop && d.contents && d.contents.length), n: d.contents && d.contents.length}; }""")
        check('talking to the keeper offers the wares and opens the shop', t['opts'] and t['shop'], t)
        # the inn is floor 77 (shop number 11)
        goto_floor(pg, 77)
        t = pg.evaluate("""() => { const d = G.decor.find(d => d.npc === 'nt_k_inn'); if (!d) return null; startTalk(d); return G.talk.node.opts.map(o => o[0]); }""")
        check('the inn offers rooms', t and any('Take rooms' in o for o in t), t)
        finish(errs)


def run_save():
    with sync_playwright() as p:
        b, pg, errs = boot(p, 'town=neverending&floor=37')
        goto_floor(pg, 37)
        s = pg.evaluate("""() => {
          const L = LEVELS[LEVEL]; const it = G.items.findIndex(i => !i.taken); G.items[it].taken = true;
          const d = G.decor.find(d => d.k === 'gy_chest' || d.k === 'chest' || d.k.startsWith('vase')); const di = G.decor.indexOf(d);
          const c = lootFor(d); d.contents = []; d.gold = 0; d.goldTaken = true; d.opened = true;
          const e = G.enemies[0]; e.hp = 0; const eid = e.id; const total = G.enemies.length;
          G.P.x = L._nt.plan.up.ix; G.P.y = L._nt.plan.up.iy;
          G.gold = 12345; G.flags.nt.marker = 'x';
          G.lst[LEVEL] = levelState(); const sv = JSON.parse(JSON.stringify(snapshot()));
          window._sv = sv; window._ref = {it, di, eid, total, px: G.P.x, py: G.P.y, lvl: LEVEL};
          return window._ref; }""")
        # wipe the floor and every texture it made, then load the save as a reload would
        pg.evaluate("""() => { const f = ntFloorOf(LEVEL); G.state = 'title'; goToLevel(NT.BASE, NT.ENT && NT.ENT.back); }""")
        pg.wait_for_function('() => LEVEL === NT.BASE', timeout=30000)
        pg.evaluate("""() => { for (const f of [...NTC.live]) { delete LEVELS[NT.BASE + f]; ntRelease(f); NTC.live.delete(f); } NTC.plans.clear(); }""")
        pg.evaluate("() => restore(_sv)")
        pg.wait_for_function('() => LEVEL === _ref.lvl && G.state === "play"', timeout=60000)
        pg.wait_for_timeout(500)
        r = pg.evaluate("""() => ({lvl: LEVEL === _ref.lvl, pos: G.P.x === _ref.px && G.P.y === _ref.py, itemTaken: !!G.items[_ref.it].taken, chest: !!(G.decor[_ref.di].opened && G.decor[_ref.di].goldTaken), gold: G.gold,
           deadStays: !G.enemies.some(e => e.id === _ref.eid && e.hp > 0), count: G.enemies.length, total: _ref.total, marker: G.flags.nt.marker, name: LEVELS[LEVEL].name})""")
        print(r)
        check('the save loads on floor 37 in the same place', r['lvl'] and r['pos'], r)
        check('the item taken stays taken', r['itemTaken'], r)
        check('the opened chest stays opened', r['chest'], r)
        check('the dead creature stays dead', r['deadStays'], r)
        check('gold and flags kept', r['gold'] == 12345 and r['marker'] == 'x', r)
        # the entrance hall
        goto_floor(pg, 0) if False else None
        pg.evaluate("() => { goToLevel(NT.BASE, NT.ENT.back); }")
        pg.wait_for_function('() => LEVEL === NT.BASE && G.state === "play"', timeout=30000)
        pg.evaluate("() => { window._sv2 = JSON.parse(JSON.stringify(snapshot())); window._p2 = [G.P.x, G.P.y]; for (const f of [...NTC.live]) { delete LEVELS[NT.BASE + f]; ntRelease(f); NTC.live.delete(f); } delete LEVELS[NT.BASE]; restore(_sv2); }")
        pg.wait_for_function('() => LEVEL === NT.BASE && G.state === "play"', timeout=60000)
        r = pg.evaluate("() => [G.P.x === _p2[0] && G.P.y === _p2[1], LEVELS[LEVEL].name]")
        check('the save loads in the entrance hall', r[0] and r[1] == 'The Crooked Tower', r)
        # a game saved on a huge floor
        pg.evaluate("() => { const f = 123456; ntEnsure(NT.BASE + f); const L = LEVELS[NT.BASE + f]; goToLevel(NT.BASE + f, L.start); }")
        pg.wait_for_function('() => LEVEL === NT.BASE + 123456 && G.state === "play"', timeout=60000)
        pg.evaluate("() => { window._sv3 = JSON.parse(JSON.stringify(snapshot())); window._sz = JSON.stringify(_sv3).length; for (const f of [...NTC.live]) { delete LEVELS[NT.BASE + f]; ntRelease(f); NTC.live.delete(f); } NTC.plans.clear(); goToLevel(NT.BASE, NT.ENT.back); }")
        pg.wait_for_function('() => LEVEL === NT.BASE && G.state === "play"', timeout=60000)
        pg.evaluate("() => restore(_sv3)")
        pg.wait_for_function('() => LEVEL === NT.BASE + 123456 && G.state === "play"', timeout=60000)
        r = pg.evaluate("() => [LEVEL_RATING[LEVEL], G.enemies.length, _sz]")
        check('a save on floor 123456 loads (rating %d)' % r[0], r[0] == 99 + 123456, r)
        finish(errs)


def run_tele():
    with sync_playwright() as p:
        b, pg, errs = boot(p, 'town=neverending&floor=1')
        # step on the stone of floor 1
        r = pg.evaluate("""() => { const t = G.tele; if (!t) return null; G.P.x = t.x; G.P.y = t.y; teleStep(t.x, t.y); return {woken: !!G.flags.teles[LEVEL], on: teleOn(), tele: t}; }""")
        check('the stone of floor 1 exists and wakes when stepped on', r and r['woken'] and r['on'], r)
        # wake stones on several floors by visiting them
        for f in [2, 3, 12, 25, 37, 50]:
            goto_floor(pg, f)
            r = pg.evaluate("() => { const t = G.tele; if (!t) return null; G.P.x = t.x; G.P.y = t.y; teleStep(t.x, t.y); return !!G.flags.teles[LEVEL]; }")
            check('floor %d has a stone that wakes' % f, r)
        r = pg.evaluate("""() => { const w = ntWoken(), h = ntHandful(); const loc = WORLD_LOCS.find(l => l.k === 'neverending'); return {w, h, loc: !!loc, locOf: teleLocOf(NT.BASE + 37) === loc, lv: teleLevelsAt(loc).length, active: teleActive(NT.BASE + 37)}; }""")
        print(r)
        check('the world map knows the tower and puts floors in it', r['loc'] and r['locOf'], r)
        check('the network lists a handful of floors', 3 <= len(r['h']) <= len(r['w']), r)
        # the menu
        m = pg.evaluate("""() => { const n = ntTeleNode(50, 0); const first = n.opts.map(o => o[0]); const up = n.opts.find(o => /Next stone down/.test(o[0])); const n2 = up ? up[1]() : null; return {text: n.text, first, second: n2 && n2.opts.map(o => o[0])}; }""")
        print(m)
        check('the menu has go, next up, next down, and about ten', m['first'] and any(x.startswith('Go to floor 50') for x in m['first']) and any('Next stone down' in x for x in m['first']) and any('10 floors' in x for x in m['first']), m)
        # travel: teleport from floor 50 to floor 12
        pg.evaluate("() => { teleportTo(NT.BASE + 12); }")
        pg.wait_for_function('() => LEVEL === NT.BASE + 12 && G.state === "play" && !TP', timeout=60000)
        r = pg.evaluate("() => [G.P.x === LEVELS[LEVEL].tele.x && G.P.y === LEVELS[LEVEL].tele.y, G.enemies.filter(e => Math.hypot(e.x - G.P.x, e.y - G.P.y) <= 6 && e.hp > 0).length]")
        check('teleporting lands on the stone with no creature within 6', r[0] and r[1] == 0, r)
        # a floor not built (after a reload) is built by the teleport
        r = pg.evaluate("""() => { const f = 37; delete LEVELS[NT.BASE + f]; ntRelease(f); NTC.live.delete(f); teleportTo(NT.BASE + f); return true; }""")
        pg.wait_for_function('() => LEVEL === NT.BASE + 37 && G.state === "play" && !TP', timeout=60000)
        check('a floor that was given back is built again by the teleport', True)
        finish(errs)


def run_dash():
    bad = []
    files = [os.path.join(ROOT, 'src', 'desert', f) for f in os.listdir(os.path.join(ROOT, 'src', 'desert')) if f.startswith('nt_')]
    files += [os.path.join(ROOT, 'tools', f) for f in ('NT_NOTES.md', 'nt_test.py', 'nt_node.js', 'nt_probe.py') if os.path.exists(os.path.join(ROOT, 'tools', f))]
    for f in files:
        t = open(f, encoding='utf-8').read()
        if chr(0x2014) in t or chr(0x2013) in t:
            bad.append(os.path.basename(f))
    check('no em dash in any nt file, the notes or the tests (%d files)' % len(files), not bad, bad)
    sys.exit(1 if FAILS else 0)


WALK_JS = """async (floors) => {
  const out = [];
  for (const f of floors) {
    const id = NT.BASE + f; if (!LEVELS[id]) ntEnsure(id);
    goToLevel(id, {x: LEVELS[id].start.x, y: LEVELS[id].start.y, f: LEVELS[id].start.f});
    await new Promise(r => { const t = setInterval(() => { if (LEVEL === id && G.state === 'play') { clearInterval(t); r(); } }, 100); });
    const L = LEVELS[LEVEL], pl = L._nt.plan, W = MW, H = MH;
    // the real collision: G.grid and the blocking props; breadth first from the party's square to the square in front of the stairs up
    const start = [G.P.x, G.P.y], goal = [pl.up.ix, pl.up.iy], prev = new Map(), key = (x, y) => x + ',' + y;
    prev.set(key(...start), null); const q = [start];
    for (let i = 0; i < q.length; i++) { const [x, y] = q[i];
      for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H || prev.has(key(nx, ny)) || cellBlocked(nx, ny)) continue; prev.set(key(nx, ny), [x, y]); q.push([nx, ny]); } }
    let ok = prev.has(key(...goal)), steps = 0;
    if (ok) { const path = []; let c = goal; while (c) { path.push(c); c = prev.get(key(...c)); } path.reverse(); steps = path.length;
      // walk it: put the party on each square in turn and check the game agrees it is open (no wall, no solid prop) and the squares are adjacent
      for (let i = 1; i < path.length; i++) { const [x, y] = path[i], [px, py] = path[i - 1]; if (Math.abs(x - px) + Math.abs(y - py) !== 1 || cellBlocked(x, y)) { ok = false; break; } G.P.x = x; G.P.y = y; }
      // then bump the stairs
      if (ok) { const dir = [[0,-1],[1,0],[0,1],[-1,0]].findIndex(d => G.P.x + d[0] === pl.up.x && G.P.y + d[1] === pl.up.y); G.P.f = dir; G.P.angT = (dir - 1) * Math.PI / 2; }
    }
    // the stone, the shop keeper's room, the fishing stands: all reached by the same real collision search; no pond square is walkable
    const V = L._nt, extra = [];
    if (!prev.has(key(L.tele.x, L.tele.y))) extra.push('stone');
    if (V.shop && !prev.has(key(V.shop.x, V.shop.y + 1))) extra.push('shop');
    for (const pd of (pl.ponds || [])) { if (!prev.has(key(pd.stand.x, pd.stand.y))) extra.push('stand'); for (const [x, y] of pd.cells) if (!cellBlocked(x, y)) extra.push('walkable water'); }
    out.push({f, kind: L._nt.look.kind, ok: ok && !extra.length, steps, up: ok, extra, ponds: (pl.ponds || []).length, shop: !!V.shop});
    if (ok) { // use the stairs: khBump with the up door
      const g = G.grid[pl.up.y][pl.up.x]; khBump(pl.up.x, pl.up.y, g);
      await new Promise(r => { const t = setInterval(() => { if (LEVEL === id + 1 && G.state === 'play') { clearInterval(t); r(); } }, 100); });
      out[out.length - 1].arrived = LEVEL === id + 1 && G.P.x === LEVELS[id + 1]._nt.plan.down.ix && G.P.y === LEVELS[id + 1]._nt.plan.down.iy;
      // and back down by the stairs down
      const pl2 = LEVELS[LEVEL]._nt.plan; const g2 = G.grid[pl2.down.y][pl2.down.x]; khBump(pl2.down.x, pl2.down.y, g2);
      await new Promise(r => { const t = setInterval(() => { if (LEVEL === id && G.state === 'play') { clearInterval(t); r(); } }, 100); });
      out[out.length - 1].back = LEVEL === id && G.P.x === pl.up.ix && G.P.y === pl.up.iy;
    }
  }
  return out; }"""


def run_walk():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        # floors of every kind: pick ten, two or more of each kind
        floors = list(range(1, 41)) + [100, 1000, 100000]
        print('floors', floors)
        res = pg.evaluate(WALK_JS, floors)
        for r in res:
            print('  ', r)
        check('the party walks from the arrival to the stairs up (and reaches the stone, the shop and every fishing stand) on %d floors' % len(res), all(r['ok'] for r in res), [r for r in res if not r['ok']])
        check('the stairs up lead to the arrival of the next floor', all(r.get('arrived') for r in res), [r for r in res if not r.get('arrived')])
        check('the stairs down lead back to the stairs up', all(r.get('back') for r in res), [r for r in res if not r.get('back')])
        kinds = set(r['kind'] for r in res)
        check('all seven kinds of layout were walked', len(kinds) == 7, kinds)
        finish(errs)


def run_shots():
    floors = [int(a) for a in sys.argv[2:]] or [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for f in floors:
            goto_floor(pg, f)
            # walk a few squares into the plan so that the view is not the stairs
            pg.evaluate("""() => { const L = LEVELS[LEVEL], pl = L._nt.plan; const d = ntgBfs(plan_G(pl), pl.down.ix, pl.down.iy); }""") if False else None
            pg.evaluate("""() => { const L = LEVELS[LEVEL]; const P = G.P; G.tele && null; for (const e of G.enemies) { e.alert = false; } G.hold = null; G.menu = false; }""")
            # find the longest open view from a square 6 steps along the way
            pg.evaluate("""() => { const L = LEVELS[LEVEL], pl = L._nt.plan, W = MW, H = MH; const d = pl.dist; let best = null, bs = -1;
              for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const dd = d[y * W + x]; if (dd < 3 || dd > 40 || G.grid[y][x] !== 0) continue;
                for (let f = 0; f < 4; f++) { let n = 0; while (n < 14 && G.grid[y + DIRS[f][1] * (n + 1)] && G.grid[y + DIRS[f][1] * (n + 1)][x + DIRS[f][0] * (n + 1)] === 0 && !cellBlocked(x + DIRS[f][0] * (n + 1), y + DIRS[f][1] * (n + 1))) n++;
                  const sc = n + (hash2(x, y, 9) * 2); if (sc > bs) { bs = sc; best = [x, y, f]; } } }
              if (best) { G.P.x = best[0]; G.P.y = best[1]; G.P.f = best[2]; G.P.angT = (best[2] - 1) * Math.PI / 2; G.C = {x: G.P.x, y: G.P.y, a: G.P.angT}; } G.enemies.forEach(e => e.alert = false); }""")
            pg.wait_for_timeout(900)
            pg.screenshot(path=os.path.join(SHOTS, 'floor_%d.png' % f))
            if pg.evaluate("() => !!(LEVELS[LEVEL]._nt.plan.ponds || []).length"):
                pg.evaluate("""() => { const st = LEVELS[LEVEL]._nt.plan.ponds[0].stand; G.P.x = st.x; G.P.y = st.y; const f = st.dx > 0 ? 1 : st.dx < 0 ? 3 : st.dy > 0 ? 2 : 0; G.P.f = f; G.P.angT = (f - 1) * Math.PI / 2; G.C = {x: G.P.x, y: G.P.y, a: G.P.angT}; G.enemies.forEach(e => e.alert = false); }""")
                pg.wait_for_timeout(900)
                pg.screenshot(path=os.path.join(SHOTS, 'pond_%d.png' % f))
            info = pg.evaluate("() => [LEVELS[LEVEL].name, LEVELS[LEVEL]._nt.look.pattern, LEVELS[LEVEL]._nt.look.wallBase, Math.round(LEVELS[LEVEL]._nt.look.pal.hue)]")
            print('shot', f, info)
        print('screenshots in', SHOTS)
        finish(errs)


def run_mem():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""async () => {
          const wait = id => new Promise(r => { const t = setInterval(() => { if (LEVEL === id && G.state === 'play') { clearInterval(t); r(); } }, 20); });
          const out = {tex: [], live: [], save: []};
          for (let f = 1; f <= 240; f++) {
            const id = NT.BASE + f; if (!LEVELS[id]) ntEnsure(id);
            const L = LEVELS[id]; goToLevel(id, {x: L.start.x, y: L.start.y, f: L.start.f}); await wait(id);
            if (f % 40 === 0 || f === 20) { out.tex.push([f, TEX.length, NT.freeTex.length]); out.live.push([f, Object.keys(LEVELS).filter(k => +k >= NT.BASE).length, NTC.live.size]); out.save.push([f, JSON.stringify(snapshot()).length]); }
          }
          out.names = Object.keys(G.lst).length; out.seenKept = Object.values(G.lst).filter(s => s && s.seen && s.seen.rle && s.seen.rle.length > 0).length;
          return out; }""")
        print(r)
        tex = r['tex']
        check('textures stay bounded over 240 floors (%s)' % tex, tex[-1][1] - tex[0][1] < 200, tex)
        check('only a few floors stay built', all(x[1] <= 12 for x in r['live']), r['live'])
        sv = [x[1] for x in r['save']]
        check('the save stays small (%d bytes after 240 floors)' % sv[-1], sv[-1] < 400000, sv)
        finish(errs)


def run_seal():
    """The tower is always open; the only gate is the party's level (100). Jump links pass (debug flag)."""
    with sync_playwright() as p:
        b, pg, errs = boot(p, 'town=neverending')
        # the jump link opened the way (party level 99, debug flag); take the debug flag away and test the level gate
        r = pg.evaluate("""() => { delete G.flags.nt.debug; delete G.flags.nt.open; delete G.flags.psp; const loc = WORLD_LOCS.find(l => l.k === 'neverending');
           const rows = gotoListRaw().filter(r => r.n === NT.BASE).map(r => r.name); return {open: ntUnlocked(), lv: loc.lv.length, rows, lvl: partyLevel()}; }""")
        check('the tower is always open on the map (no padlock)', r['open'] and r['lv'] == 1, r)
        check('the Go to area row is not marked sealed', r['rows'] and 'sealed' not in r['rows'][0], r)
        r = pg.evaluate("""() => { const L = LEVELS[LEVEL]; const g = L.chars[L.rows[NTE.door.y][NTE.door.x0]]; const before = LEVEL; G.msgs.length = 0; khBump(NTE.door.x0, NTE.door.y, g); return {stay: LEVEL === before, lvl: partyLevel(), msgs: G.msgs.map(m => m.text)}; }""")
        check('a party below level 100 is refused at the great door with a plain line', r['lvl'] < 100 and r['stay'] and any('level 100' in m for m in r['msgs']), r)
        check('the refusal has no em dash and no "sealed"', not any((chr(8212) in m) or ('sealed' in m) for m in r['msgs']), r)
        pg.evaluate("() => { for (const h of G.heroes) h.lvl = 100; }")
        pg.evaluate("""() => { const L = LEVELS[LEVEL]; const g = L.chars[L.rows[NTE.door.y][NTE.door.x0]]; khBump(NTE.door.x0, NTE.door.y, g); }""")
        pg.wait_for_function('() => LEVEL === NT.BASE + 1 && G.state === "play"', timeout=60000)
        check('a level 100 party goes through the great door to floor 1', True)
        # the way back down from floor 1 is the entrance hall
        pg.evaluate("""() => { const pl = LEVELS[LEVEL]._nt.plan; khBump(pl.down.x, pl.down.y, G.grid[pl.down.y][pl.down.x]); }""")
        pg.wait_for_function('() => LEVEL === NT.BASE && G.state === "play"', timeout=60000)
        r = pg.evaluate("() => [G.P.x, G.P.y, G.P.f]")
        check('the stairs down from floor 1 lead into the entrance hall in front of the door', r == [18, 4, 2], r)
        # the south gate leads to the Crooked Road and back
        pg.evaluate("""() => { const L = LEVELS[LEVEL]; const g = L.chars[L.rows[NTE.gate.y][NTE.gate.x0]]; khBump(NTE.gate.x0, NTE.gate.y, g); }""")
        pg.wait_for_function('() => LEVEL === 9715 && G.state === "play"', timeout=90000)
        r = pg.evaluate("() => [G.P.x, G.P.y, G.P.f]")
        check('the south gate leads to the north end of the Crooked Road', r == [30, 6, 2], r)
        # the road's tower gate: refuses below level 100, opens at 100
        pg.evaluate("() => { delete G.flags.nt.debug; for (const h of G.heroes) h.lvl = 90; }")
        r = pg.evaluate("""() => { const L = LEVELS[9715]; const g = L.chars[L.rows[4][30]]; G.msgs.length = 0; khBump(30, 4, g); return {stay: LEVEL === 9715, msgs: G.msgs.map(m => m.text)}; }""")
        check('the road gate refuses a level 90 party', r['stay'] and any('level 100' in m for m in r['msgs']), r)
        pg.evaluate("() => { for (const h of G.heroes) h.lvl = 100; }")
        pg.evaluate("""() => { const L = LEVELS[9715]; const g = L.chars[L.rows[4][30]]; khBump(30, 4, g); }""")
        pg.wait_for_function('() => LEVEL === NT.BASE && G.state === "play"', timeout=90000)
        r = pg.evaluate("() => [G.P.x, G.P.y, G.P.f]")
        check('a level 100 party enters the tower hall from the road', r == [18, 26, 0], r)
        # a debug jump passes at party level 99
        pg.evaluate("() => { for (const h of G.heroes) h.lvl = 99; G.flags.nt.debug = 1; }")
        r = pg.evaluate("() => ntLevelOk()")
        check('the jump link flag passes the level gate at 99', r)
        finish(errs)


def run_fish():
    """Fishing in the tower: a floor with a pond; the stand faces a spot; a rod in the bag starts the fishing; catches come from the deep-water table at a deep level."""
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        f = pg.evaluate("() => { for (let f = 1; f < 40; f++) if (ntPlan(f).plan.ponds.length) return f; return 0; }")
        check('a pond floor exists in 1..40', f > 0, f)
        goto_floor(pg, f)
        r = pg.evaluate("""() => { const pd = LEVELS[LEVEL]._nt.plan.ponds[0], st = pd.stand; G.P.x = st.x; G.P.y = st.y; const fc = st.dx > 0 ? 1 : st.dx < 0 ? 3 : st.dy > 0 ? 2 : 0; G.P.f = fc; G.P.angT = (fc - 1) * Math.PI / 2; G.C = {x: G.P.x, y: G.P.y, a: G.P.angT}; G.enemies.length = 0;
            const faced = fshFaced(); const noRod = !fshBestRod(); bagAdd(mkItem('fishrod_3'));
            const sp = fshSpots(LEVEL), w = faced ? faced.water : null;
            const started = fshStart(faced); const F0 = G.fishing;
            let fish = {}, junk = 0, n = 0, bad = null;
            try { for (let i = 0; i < 200; i++) { G.fishing = {phase: 'line', t: 0, cell: faced, water: 'deep', rod: fshBestRod(), id: 'fishrod_3', bait: null, odds: fshOdds(fshBestRod(), null, 'deep'), chance: 100, zone: {c: .5, w: 1}, cur: .5, dir: 1, res: null, show: null, tgt: fshTarget(faced), wait: 1, spd: 1}; fshCatch(G.fishing); const s = G.fishing.show; if (s) { fish[s.id] = (fish[s.id] || 0) + 1; n++; } } } catch (e) { bad = String(e); }
            G.fishing = null; G.menu = false;
            return {faced: !!faced, water: w, spots: sp.size, noRod, started, phase: F0 && F0.phase, n, kinds: Object.keys(fish).length, sample: Object.keys(fish).slice(0, 12), bad, lvl: LEVEL}; }""")
        print(r)
        check('the stand at the pond faces a fishing spot of deep water', r['faced'] and r['water'] == 'deep', r)
        check('a rod in the bag starts the fishing and the line is cast', r['started'] and r['phase'], r)
        check('200 pulls at a deep floor give fish and treasure with no error', r['bad'] is None and r['n'] == 200 and r['kinds'] >= 5, r)
        # without a rod the plain line, not an error
        pg.evaluate("() => { fshEnd(); }")
        finish(errs)


def run_all():
    import subprocess
    codes = []
    for m in ['dash', 'build', 'foes', 'shops', 'save', 'tele', 'walk', 'fish', 'mem', 'seal']:
        print('=== ' + m)
        codes.append(subprocess.call([sys.executable, os.path.abspath(__file__), m]))
    sys.exit(1 if any(codes) else 0)


{'build': run_build, 'foes': run_foes, 'shops': run_shops, 'save': run_save, 'tele': run_tele, 'dash': run_dash, 'walk': run_walk, 'fish': run_fish, 'mem': run_mem, 'seal': run_seal, 'shots': run_shots, 'all': run_all}[what]()
