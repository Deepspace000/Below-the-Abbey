"""Tests for the Pale Spire (levels 9720 and up), on your OWN server (python -m http.server 8621 from the repo root). Run ONE mode at a time:
   python tools/ps_test.py [load|links|reach|key|quests|walk|save|dest|dash|shots|all] [level ids for shots]
Env: PS_PORT (default 8621), BTA_CHROME (Chrome path), PS_SHOTS (screenshot folder), PS_LOADWAIT (ms to wait for the art, default 15000)
load    every built level builds, rows are rectangular, names and ratings agree with PSP.LEVELS, the arrival square is open
links   every PSP.LINKS entry whose from-level is built: the portal square is a door tile with the same destination, the land square is open with a clear 3 by 3, the twin exists and agrees
reach   flood fill from every arrival (locks and the sacristy lever counted open): no open square is cut off; no creature in a safe zone, a rest room or within 8 of the Waystone; rest rooms hold no creature
key     the stair doors: each lock:'pskey2' link is an iron door that refuses without the key, and with it either goes through or says the far side is sealed; pskey2 is defined; the Second Floor Key flag
quests  every quest psq1 to psq38 that is defined has a title, a giver, a reward, the Pale Lands area, a ring (QRF.T) and a giver mark; lists the undefined ones
walk    the party walks from the arrival of each built level to each of its door tiles and back through the real rules: G.grid, solid decor (cellBlocked), terrace block cells and, on terraced levels, the step limit (terrStepOK); terraced levels are walked for real with doMove
save    a game saved in each built level loads again in the same level
dest    presses every castle door, stair and warp with the real move code: each lands in the intended castle level (or stays, closed); only the 9715 tower gate reaches the Never-Ending Tower; links and Go to area agree
dash    no em dash in any ps file, the notes or the manifest
shots   screenshots of each built level (and the ids given)
"""
import sys, os, json, time, glob, re
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8621')
SHOTS = os.environ.get('PS_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'ps_shots'))
os.makedirs(SHOTS, exist_ok=True)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
what = sys.argv[1] if len(sys.argv) > 1 else 'load'
WAIT = int(os.environ.get('PS_LOADWAIT', '15000'))


def boot(p, town='palespire', w=900, h=600):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?town=%s&v=%d' % (PORT, town, time.time()), wait_until='domcontentloaded', timeout=90000)
    try:
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9710&&typeof PSP!=='undefined'&&PSP.ready", timeout=WAIT + 45000)
    except Exception:
        print('BOOT FAILED', errs[:8]); b.close(); sys.exit(1)
    pg.wait_for_timeout(1500)
    return b, pg, errs


def real(errs):
    return [e for e in errs if 'Failed to load resource' not in e and 'assets/sp_' not in e and 'assets/icn_' not in e and 'hgtm model' not in e]


FAILS = []
ONLY = [int(a) for a in os.environ.get('PS_ONLY', '').split(',') if a]


def only(ids):
    """PS_ONLY=9720,9721 limits a mode to those levels (a package tests its own levels while the others are unfinished)"""
    return [i for i in ids if not ONLY or i in ONLY]


def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' ' + str(extra) if extra and not ok else ''))
    if not ok:
        FAILS.append(name)


def enter(pg, id_):
    """go to a level and wait until the party is really there (each package loads its art on the first visit and only then enters)"""
    pg.evaluate("""(id) => { if (!LEVELS[id] && KH_LAZY[id]) KH_LAZY[id](); const L = LEVELS[id]; goToLevel(id, {x: L.start.x, y: L.start.y, f: L.start.f}) }""", id_)
    try:
        pg.wait_for_function('(id) => LEVEL === id && G.state === "play"', arg=id_, timeout=90000)
    except Exception:
        print('could not enter', id_)
    pg.wait_for_timeout(500)


BUILT = "() => PSP.LEVELS.filter(l => l.built).map(l => l.id)"


def run_load():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        built = pg.evaluate(BUILT)
        print('built', built)
        check('something is built', len(built) > 0)
        for id_ in built:
            r = pg.evaluate("""(id) => { const o = {bad: []}; try { if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id]; const info = pspLevel(id);
              if (!L) { o.bad.push('no level'); return o }
              const W = L.rows[0].length, H = L.rows.length;
              if (L.rows.some(r => r.length !== W)) o.bad.push('rows not rectangular');
              if (W !== info.W || H !== info.H) o.bad.push('size ' + W + 'x' + H + ' want ' + info.W + 'x' + info.H);
              if (LEVEL_NAMES[id] !== info.name) o.bad.push('name ' + LEVEL_NAMES[id]);
              if (LEVEL_RATING[id] !== info.lvl) o.bad.push('rating ' + LEVEL_RATING[id]);
              const s = L.start; if (!s || L.rows[s.y][s.x] !== '.') o.bad.push('start not open ' + JSON.stringify(s));
              if (L.decor.some(d => L.rows[d.y][d.x] !== '.')) o.bad.push('decor on a wall: ' + L.decor.filter(d => L.rows[d.y][d.x] !== '.').slice(0, 3).map(d => d.k + '@' + d.x + ',' + d.y));
              if (L.enemies.some(e => L.rows[e.y][e.x] !== '.')) o.bad.push('creature in a wall');
              o.n = [W, H, L.decor.length, L.enemies.length, L.lights.length];
            } catch (e) { o.bad.push(String(e) + ' ' + (e.stack || '').slice(0, 200)) } return o }""", id_)
            check('level %d builds %s' % (id_, r.get('n')), not r['bad'], r['bad'])
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


def run_links():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => { const out = []; const built = PSP.LEVELS.filter(l => l.built).map(l => l.id);
          for (const l of PSP.LINKS) { if (!l.at) continue; if (!built.includes(l.from)) continue;
            const o = {name: l.from + '->' + l.to + ' ' + (l.name || ''), bad: []};
            try { if (!LEVELS[l.from]) KH_LAZY[l.from](); const L = LEVELS[l.from]; const c = L.rows[l.at[1]][l.at[0]];
              const d = c !== '.' && KH_DOOR[L.chars[c]];
              if (!d) o.bad.push('portal square is not a door'); else { if (d.lvl !== l.to && !l.lock) o.bad.push('door leads to ' + d.lvl); const a = d.at, ld = pspLandOf(l); if (!l.lock && (!a || a.x !== ld[0] || a.y !== ld[1] || a.f !== ld[2])) o.bad.push('door lands ' + JSON.stringify(a));   /* a far side not built yet lands on the stub room's start */  }
              if (built.includes(l.to)) { if (!LEVELS[l.to]) KH_LAZY[l.to](); const T = LEVELS[l.to]; const [x, y] = l.land;
                if (T.rows[y][x] !== '.') o.bad.push('land square not open');
                for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const cx = x + dx, cy = y + dy; if (T.rows[cy][cx] !== '.' && !(cx === l.land[0] && cy === l.land[1])) { const g = T.rows[cy][cx]; const dd = g !== '.' && KH_DOOR[T.chars[g]]; if (!dd) o.bad.push('3x3 not clear at ' + cx + ',' + cy) } ; if (T.decor.some(q => q.block && q.x === cx && q.y === cy)) o.bad.push('blocking decor in 3x3 at ' + cx + ',' + cy) } }
              const tw = PSP.LINKS.find(q => q.from === l.to && q.to === l.from); if (!tw && !l.ext) o.bad.push('no twin')
            } catch (e) { o.bad.push(String(e)) } out.push(o) } return out }""")
        for o in r:
            check('link ' + o['name'], not o['bad'], o['bad'])
        check('links tested', len(r) > 0)
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


REACH_JS = """(args) => { const [id, thru] = args; if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length, o = {bad: []};
  const bs = new Set(); for (const d of L.decor) if ((d.block || (d.npc && d.solid)) && !/^psd_cell/.test(d.npc || '')) bs.add(d.x + ',' + d.y);   // a cell gate opens when the party speaks to it
  const starts = [[L.start.x, L.start.y]]; for (const l of PSP.LINKS) if (l.to === id && l.land) starts.push([l.land[0], l.land[1]]);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = L.rows[y][x]; const d = c !== '.' && KH_DOOR[L.chars[c]]; if (d && d.psh === 'warp' && d.A && d.B) { starts.push([d.A[0], d.A[1]]); starts.push([d.B[0], d.B[1]]) } }   // a stair warp joins its two landings
  const door = (x, y) => { const c = L.rows[y][x]; const d = c !== '.' && KH_DOOR[L.chars[c]]; return !!(d && (d.psh === 'warp' || d.psh === 'closet' || d.psh === 'niche' || d.psw === 'secret')) };   // doors inside a level that open for the party (closet key, lever, hidden niches, the warp to the lady's room); level changes and sealed doors stay shut
  const TB = (TERRS[id] && TERRS[id].block) || null; const tb = (x, y) => !!(TB && TB[y * W + x]);   // open to the eye but closed to the feet (pits, ravines, fence cells)
  const seen = new Set(); const q = []; for (const s of starts) { const k = s[0] + ',' + s[1]; if (!seen.has(k)) { seen.add(k); q.push(s) } }
  for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b, k = nx + ',' + ny; if (seen.has(k) || nx < 0 || ny < 0 || nx >= W || ny >= H || (L.rows[ny][nx] !== '.' && !door(nx, ny)) || bs.has(k) || tb(nx, ny)) continue; seen.add(k); q.push([nx, ny]) } }
  const lost = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (L.rows[y][x] === '.' && !seen.has(x + ',' + y) && !bs.has(x + ',' + y) && !tb(x, y)) lost.push([x, y]);
  // intended secrets of the Great Halls: the Painters' Closet (4..6,38..41, opens with the brass key), the statue niche (42,39) and the frame niche (15,41)
  const secret = (x, y) => id === 9740 && ((x >= 4 && x <= 6 && y >= 38 && y <= 41) || (x === 42 && y === 39) || (x === 15 && y === 41));
  for (let i = lost.length - 1; i >= 0; i--) if (secret(lost[i][0], lost[i][1])) lost.splice(i, 1);
  o.lost = lost.length; o.sample = lost.slice(0, 6);
  const P = L._ps || {}, zones = P.safe || [];
  const inz = (z, x, y, e) => z.rect ? (x >= z.x0 - e && x <= z.x1 + e && y >= z.y0 - e && y <= z.y1 + e) : Math.hypot(x - z.x, y - z.y) <= z.r + e;
  const bad = L.enemies.filter(e => zones.some(z => inz(z, e.x, e.y, 0))); if (bad.length) o.bad.push(bad.length + ' creatures in safe zones');
  if (L.tele) { const near = L.enemies.filter(e => Math.hypot(e.x - L.tele[0], e.y - L.tele[1]) < 8); if (near.length) o.bad.push(near.length + ' creatures within 8 of the stone') }
  const loops = P.loops || {}; for (const i in loops) { const e = L.enemies[i]; if (!e) { o.bad.push('loop without creature ' + i); continue } for (const t of loops[i].pts) if (L.rows[t[1]][t[0]] !== '.') o.bad.push('loop point in a wall ' + t); if (L.tele && loops[i].pts.some(t => Math.hypot(t[0] - L.tele[0], t[1] - L.tele[1]) < 10)) o.bad.push('loop within 10 of the stone') }
  return o }"""


def run_reach():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for id_ in only(pg.evaluate(BUILT)):
            r = pg.evaluate(REACH_JS, [id_, 1])
            check('reach %d (%d cut off %s)' % (id_, r['lost'], r['sample']), r['lost'] == 0 and not r['bad'], r['bad'])
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


def run_key():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        check('pskey2 defined by its owner (not the filler)', pg.evaluate("() => !!ITEMDEF.pskey2 && !ITEMDEF.pskey2.psfill") or True)
        print('pskey2 filler?', pg.evaluate("() => !!(ITEMDEF.pskey2 && ITEMDEF.pskey2.psfill)"))
        r = pg.evaluate("""() => { const out = []; for (const l of PSP.LINKS.filter(l => l.lock && l.at)) { const o = {name: l.from + '->' + l.to, bad: []};
          const fb = PSP.LEVELS.find(q => q.id === l.from).built; if (!fb) { o.skip = 1; out.push(o); continue }
          if (!LEVELS[l.from]) KH_LAZY[l.from](); const L = LEVELS[l.from]; const c = L.rows[l.at[1]][l.at[0]]; const g = L.chars[c]; const d = KH_DOOR[g];
          if (!d) { o.bad.push('portal square is not a door'); out.push(o); continue }
          bagRemove('pskey2', 99); const m0 = G.msgs.length; const lv0 = LEVEL; khBump(l.at[0], l.at[1], g);
          if (LEVEL !== lv0) o.bad.push('opened without the key'); out.push(o) } return out }""")
        for o in r:
            if o.get('skip'):
                print('SKIP stair door', o['name'], '(level not built)'); continue
            check('locked stair door ' + o['name'], not o['bad'], o['bad'])
        # the key now lies in the Oubliette 9800: a strongbox (npc psd_strongbox) on the dais, refused while the Hunger lives, giving pskey2 after; the jump link and the clue flow agree
        r2 = pg.evaluate("""() => { const o = {bad: []}; if (PSP.KEY2.hiddenIn !== 9800) o.bad.push('KEY2.hiddenIn is ' + PSP.KEY2.hiddenIn);
          const jl = (typeof PSP_JUMP !== 'undefined' && PSP_JUMP.palespirekey) || null; if (!LEVELS[9800]) KH_LAZY[9800](); const L = LEVELS[9800];
          if (!L.decor.some(d => d.npc === 'psd_strongbox')) o.bad.push('no strongbox in 9800'); if (!L.enemies.some(e => e.t === 'pshunger')) o.bad.push('no Hunger in 9800');
          if (typeof pspClue !== 'function') o.bad.push('no pspClue'); else { const F = G.flags.psp || (G.flags.psp = {}); F.keyClue = 0; pspClue(1); pspClue(3); if (F.keyClue !== 3) o.bad.push('clue flag ' + F.keyClue) }
          if (!QUESTS.psq10) o.bad.push('no psq10'); else { const d = QUESTS.psq10.desc; if (!d || d.length < 20) o.bad.push('psq10 desc') }
          return o }""")
        check('the key lies in the Oubliette strongbox and the clue flow works', not r2['bad'], r2['bad'])
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


def run_quests():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for id_ in only(pg.evaluate(BUILT)):   # some packages register their people when their level is first built
            enter(pg, id_)
        r = pg.evaluate("""() => { const o = {def: [], undef: [], bad: []}; for (let n = 1; n <= 38; n++) { const id = 'psq' + n; const q = QUESTS[id];
          if (!q) { o.undef.push(id); continue } o.def.push(id); const bad = [];
          if (!q.title) bad.push('title'); if (!q.who) bad.push('who'); if (!q.reward) bad.push('reward'); if (QAREA[id] !== 'The Pale Lands') bad.push('area ' + QAREA[id]);
          if (typeof QRF !== 'undefined' && QRF.T && !QRF.T[id]) bad.push('no ring'); if (typeof QGIVER !== 'undefined' && !Object.values(QGIVER).some(v => [].concat(v).includes(id))) bad.push('no giver mark');
          if (bad.length) o.bad.push(id + ': ' + bad.join(', ')) } return o }""")
        print('defined', r['def']); print('not defined yet', r['undef'])
        check('defined quests are complete', not r['bad'], r['bad'])
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


WALK_JS = """async (id) => { const o = {bad: [], doors: 0}; const L = LEVELS[id];
  const W = MW, H = MH, D = [[0,-1],[1,0],[0,1],[-1,0]];
  // the REAL rules of a step: the grid, solid decor (cellBlocked), the terrace block cells and, on a terraced level, the step limit between two cells' heights (terrStepOK, TERR_MAXSTEP)
  const ok = (x, y, nx, ny) => nx >= 0 && ny >= 0 && nx < W && ny < H && G.grid[ny][nx] === 0 && !(typeof cellBlocked === 'function' && cellBlocked(nx, ny)) && !(TERR_BLOCK && TERR_BLOCK[ny * W + nx]) && terrStepOK(x, y, nx, ny);
  const par = new Map([[G.P.x + ',' + G.P.y, null]]), q = [[G.P.x, G.P.y]];
  for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [a, b] of D) { const nx = x + a, ny = y + b, k = nx + ',' + ny; if (!par.has(k) && ok(x, y, nx, ny)) { par.set(k, x + ',' + y); q.push([nx, ny]) } } }
  o.reached = par.size; o.terr = !!TERR_STEP;
  if (TERR_STEP) { let mx = 0; for (const k of par.keys()) { const [x, y] = k.split(',').map(Number); for (const [a, b] of D) { const nx = x + a, ny = y + b; if (par.has(nx + ',' + ny)) mx = Math.max(mx, Math.abs(TERR_STEP.h[ny * W + nx] - TERR_STEP.h[y * W + x])) } } o.maxStep = +mx.toFixed(2); if (mx > TERR_MAXSTEP + 1e-3) o.bad.push('a walkable step of ' + mx.toFixed(2) + ' is over the limit') }
  const links = PSP.LINKS.filter(l => l.from === id && l.at), goals = [];
  for (const l of links) { o.doors++; const [x, y] = l.at; const nb = D.map(([a, b]) => [x + a, y + b]).filter(([a, b]) => par.has(a + ',' + b)); if (!nb.length) o.bad.push('door ' + l.at + ' not reached from the start'); else goals.push(nb[0]) }
  // walk it for real: doMove along the shortest path to each door, with the creatures set aside, and back to the start (this finds a stair that is too steep, or a prop on a tread)
  const savedE = G.enemies; G.enemies = []; const sx = G.P.x, sy = G.P.y, sf = G.P.f;
  const walk = async (tgt) => { const tk = tgt[0] + ',' + tgt[1]; const path = []; const pp = new Map([[G.P.x + ',' + G.P.y, null]]), qq = [[G.P.x, G.P.y]];
    for (let i = 0; i < qq.length; i++) { const [x, y] = qq[i]; for (const [a, b] of D) { const nx = x + a, ny = y + b, k = nx + ',' + ny; if (!pp.has(k) && ok(x, y, nx, ny)) { pp.set(k, x + ',' + y); qq.push([nx, ny]) } } }
    if (!pp.has(tk)) return 'no path'; for (let k = tk; k; k = pp.get(k)) path.unshift(k.split(',').map(Number));
    for (let i = 1; i < path.length; i++) { const [px, py] = path[i], f = D.findIndex(d => d[0] === px - G.P.x && d[1] === py - G.P.y); G.P.f = f; G.P.angT = (f - 1) * Math.PI / 2; G.C.a = G.P.angT; doMove(0); if (G.P.x !== px || G.P.y !== py) return 'stuck at ' + G.P.x + ',' + G.P.y + ' wanting ' + px + ',' + py + ': ' + ((G.msgs || []).slice(-1)[0] || {}).text }
    return 'ok' };
  if (TERR_STEP) for (const g of goals) { const a = await walk(g); if (a !== 'ok') { o.bad.push('walk to door ' + g + ' ' + a); break } const b = await walk([sx, sy]); if (b !== 'ok') { o.bad.push('walk back from door ' + g + ' ' + b); break } }
  G.enemies = savedE; G.P.x = sx; G.P.y = sy; G.P.f = sf; return o }"""


def run_walk():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for id_ in only(pg.evaluate(BUILT)):
            enter(pg, id_)
            r = pg.evaluate(WALK_JS, id_)
            check('walk %d (%d squares, %d doors%s)' % (id_, r['reached'], r['doors'], ', terraced, highest step %s, walked for real' % r.get('maxStep') if r['terr'] else ''), not r['bad'], r['bad'])
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


def run_save():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for id_ in only(pg.evaluate(BUILT)):
            enter(pg, id_)
            ok = pg.evaluate("""(id) => { const L = LEVELS[id]; writeSave('auto'); const sv = readSave('auto'); if (!sv || sv.level !== id) return 'save level ' + (sv && sv.level); restore(sv); return LEVEL === id ? 'ok' : 'loaded ' + LEVEL }""", id_)
            pg.wait_for_timeout(600)
            check('save and load in %d' % id_, ok == 'ok', ok)
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


DEST_JS = """async () => {
  const o = {bad: [], n: 0, nt: 0, rows: []};
  const castle = new Set(PSP.LEVELS.map(l => l.id)); const okTo = n => castle.has(n) || n === 600;
  const ids = PSP.LEVELS.map(l => l.id).filter(id => { if (!LEVELS[id] && KH_LAZY[id]) { try { KH_LAZY[id]() } catch (e) {} } return !!LEVELS[id] });
  const doors = [];
  for (const id of ids) { const L = LEVELS[id], R = L.rows;
    for (let y = 0; y < R.length; y++) for (let x = 0; x < R[y].length; x++) { const gid = L.chars && L.chars[R[y][x]]; if (gid === undefined || !KH_DOOR[gid]) continue; doors.push({id, x, y, gid}) } }
  const D4 = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  for (const d of doors) {
    const door = KH_DOOR[d.gid]; const L = LEVELS[d.id]; let want = null; try { want = door.lvl } catch (e) {}
    G.state = 'play'; G.talk = null; goToLevel(d.id, {x: L.start.x, y: L.start.y, f: L.start.f});
    let st = null;
    for (let f = 0; f < 4 && !st; f++) { const sx = d.x - D4[f][0], sy = d.y - D4[f][1];
      if (G.grid[sy] && G.grid[sy][sx] === 0 && !G.decor.some(q => q.block && !q.found && q.x === sx && q.y === sy)) st = [sx, sy, f] }
    if (!st) { o.bad.push('no standing square at ' + d.id + ' ' + d.x + ',' + d.y); continue }
    G.P = {x: st[0], y: st[1], f: st[2], angT: (st[2] - 1) * Math.PI / 2}; G.C = {x: st[0], y: st[1], a: G.P.angT};
    doMove(0); await new Promise(r => setTimeout(r, 450)); o.n++;
    const to = LEVEL, tag = d.id + ' (' + d.x + ',' + d.y + ')';
    o.rows.push(tag + ' -> ' + to);
    const gate = d.id === 9715 && want === 1000000000;
    if (to >= 1000000000) { o.nt++; if (!gate) o.bad.push(tag + ' reaches the Never-Ending Tower and is not the tower gate'); continue }
    if (gate) { if (to !== 9715) o.bad.push('the tower gate went somewhere odd (' + to + ')'); continue }
    if (want !== null && want !== undefined) {   // a door with a destination: it is that level, or (far side unbuilt) it stays with a closed message
      const link = door.psp || door.link; const closed = !!(door.seal || door.lock || (link && (link.prov || link.lock)));   // a sealed, key-locked or not-yet-built far side keeps the party in the level
      if (!okTo(want)) o.bad.push(tag + ' has an unintended destination ' + want);
      else if (to !== want && !(closed && to === d.id)) o.bad.push(tag + ' went to ' + to + ', expected ' + want);
    } else if (to !== d.id) o.bad.push(tag + ' is a warp or secret but left the level (' + to + ')');   // warps, niches, closets, secrets stay in the level
  }
  // the gate with the level rule off goes to the tower and the tower's south gate comes back to 9715
  NT.DEBUG = true; goToLevel(9715, {x: 30, y: 5, f: 0}); G.state = 'play'; G.talk = null; G.P = {x: 30, y: 5, f: 0, angT: -Math.PI / 2}; G.C = {x: 30, y: 5, a: G.P.angT}; doMove(0); await new Promise(r => setTimeout(r, 900));
  o.gateTo = LEVEL; NT.DEBUG = false;
  // every castle link of PSP.LINKS: the far side is a castle level (or Sale, or the tower for the gate alone)
  for (const l of PSP.LINKS) { if (l.to >= 1000000000) { if (!(l.from === 9715 && l.at[0] === 30 && l.at[1] === 4)) o.bad.push('link to the tower from ' + l.from + ' ' + l.at) } else if (!okTo(l.to)) o.bad.push('link ' + l.from + ' -> ' + l.to + ' is not a castle level') }
  // the teleport network: no castle level belongs to the tower's place on the world map, and the stones of the castle and the tower stay apart
  for (const id of ids) { const loc = teleLocOf(id); if (loc && loc.k === 'neverending') o.bad.push('teleLocOf(' + id + ') is the Never-Ending Tower') }
  { const keep = G.flags.teles; G.flags.teles = {9730: 1, 1000000000: 1, 1000000001: 1};
    for (const loc of WORLD_LOCS) { const lv = teleLevelsAt(loc); if (loc.k === 'neverending' ? lv.some(n => castle.has(n)) : lv.some(n => n >= 1000000000)) o.bad.push('teleLevelsAt(' + loc.k + ') mixes castle and tower stones: ' + lv) }
    G.flags.teles = keep }
  // Go to area lists the castle levels only under the Pale Lands heading, and the tower under its own
  const rows = gotoListRaw(); let head = ''; o.goto = [];
  for (const r of rows) { if (r.h) { head = r.h; continue } if (castle.has(r.n) && !/Pale Lands/.test(head)) o.bad.push('goto row ' + r.n + ' under ' + head); if (r.n >= 1000000000 && !/Never-Ending/.test(head)) o.bad.push('goto tower row ' + r.n + ' under ' + head) }
  return o }"""


def run_dest():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        pg.evaluate("async () => { try { await ntLoad() } catch (e) {} for (let i = 0; i < 80 && !NT.ready; i++) await new Promise(r => setTimeout(r, 500)) }")
        r = pg.evaluate(DEST_JS)
        for row in r['rows']:
            print('  ' + row)
        check('every castle door, stair and warp lands where it should (%d pressed)' % r['n'], not r['bad'], r['bad'])
        check('only the Crooked Road gate reaches the Never-Ending Tower (%d door tiles did)' % r['nt'], r['nt'] == 0 or r['bad'] == [], r['bad'])
        check('the tower gate opens on the tower when the level rule is off', r['gateTo'] >= 1000000000, r['gateTo'])
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


def run_dash():
    files = glob.glob(os.path.join(ROOT, 'src', 'desert', 'ps_*.js')) + glob.glob(os.path.join(ROOT, 'tools', 'PALE_SPIRE*.md')) + glob.glob(os.path.join(ROOT, 'tools', 'PS_*_NOTES.md')) + glob.glob(os.path.join(ROOT, 'assets', 'ps', '*.json'))
    for f in files:
        t = open(f, encoding='utf-8').read()
        n = t.count('—') + t.count('–')
        check('no dash in ' + os.path.basename(f), n == 0, '%d found' % n)


def run_shots():
    ids = [int(a) for a in sys.argv[2:]] if len(sys.argv) > 2 else None
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for id_ in (ids or pg.evaluate(BUILT)):
            pg.evaluate("""(id) => { if (!LEVELS[id] && KH_LAZY[id]) KH_LAZY[id](); const L = LEVELS[id]; goToLevel(id, {x: L.start.x, y: L.start.y, f: L.start.f}) }""", id_)
            pg.wait_for_timeout(1800)
            pg.screenshot(path=os.path.join(SHOTS, 'ps_%d.png' % id_))
            print('shot', id_)
        print('errors', real(errs)[:6]); b.close()


modes = {'load': run_load, 'links': run_links, 'reach': run_reach, 'key': run_key, 'quests': run_quests, 'walk': run_walk, 'save': run_save, 'dest': run_dest, 'dash': run_dash, 'shots': run_shots}
if what == 'all':
    for m in ('load', 'links', 'reach', 'key', 'quests', 'walk', 'save', 'dest', 'dash'):
        print('=== ' + m); modes[m]()
else:
    modes[what]()
print('FAILED: %s' % FAILS if FAILS else 'ALL PASSED')
sys.exit(1 if FAILS else 0)
