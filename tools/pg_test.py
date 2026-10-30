"""Tests for the Pale Spire gear (src/desert/ps_gear.js). On your OWN server (python -m http.server 8623 from the repo root):
   PS_PORT=8623 BTA_CHROME=<chrome> python tools/pg_test.py
Checks: 26 items with sane fields and stronger than the previous best of their slot, one placement each, boss and quest ids exist, two pieces on every built level,
riddle and key chests on reachable open dead ends, boss drop, quest reward (and a full bag), riddle right and wrong, key chest, save and load, no em dashes."""
import sys, os, json, time, glob
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8623')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
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


def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' ' + str(extra) if extra and not ok else ''))
    if not ok:
        FAILS.append(name)


def enter(pg, id_):
    pg.evaluate("""(id) => { if (!LEVELS[id] && KH_LAZY[id]) KH_LAZY[id](); const L = LEVELS[id]; goToLevel(id, {x: L.start.x, y: L.start.y, f: L.start.f}) }""", id_)
    try:
        pg.wait_for_function('(id) => LEVEL === id && G.state === "play"', arg=id_, timeout=90000)
    except Exception:
        print('could not enter', id_)
    pg.wait_for_timeout(500)


SLOTS = ['Sword', 'Axe', 'Mace', 'Bow', 'Staff', 'Dagger']
ARM = ['head', 'chest', 'arms', 'legs', 'shield']
ITEMS_JS = """() => { const o = {bad: [], n: 0, types: {}, str: []}; const ids = Object.keys(PGR_ITEMS); o.n = ids.length;
  const prev = {}; for (const id in ITEMDEF) { if (PGR_ITEMS[id]) continue; const d = ITEMDEF[id]; if (!['weapon','head','chest','arms','legs','shield','ring'].includes(d.k)) continue;
    const key = d.k === 'weapon' ? d.t : d.k; const v = d.k === 'weapon' ? (d.dmg[0] + d.dmg[1]) / 2 : (d.armor || 0); if (!(key in prev) || v > prev[key]) prev[key] = v }
  const prevWard = Math.max(...Object.values(ITEMDEF).filter(d => !d.pg && d.k === 'ring' && d.pas && d.pas.ward).map(d => d.pas.ward));
  for (const id of ids) { const d = ITEMDEF[id], bad = [];
    if (d.lvl !== 100 || d.rar !== 1 || d.price !== 0 || d.gear !== 1) bad.push('basic fields');
    if (!/^pg_/.test(id) || d.id !== id) bad.push('id');
    if (!d.n || !d.d || !/Needs level 100\\.$/.test(d.d) || /\\u2014|\\u2013/.test(d.n + d.d)) bad.push('text');
    if (!/^#[0-9a-f]{6}$/i.test(d.c) || !d.ic) bad.push('colour/icon');
    const key = d.k === 'weapon' ? d.t : d.k; o.types[key] = (o.types[key] || 0) + 1;
    if (d.k === 'weapon') { if (!Array.isArray(d.dmg) || d.dmg.length !== 2 || d.dmg[0] >= d.dmg[1] || !d.req) bad.push('weapon fields'); const v = (d.dmg[0] + d.dmg[1]) / 2; o.str.push(id + ' ' + key + ' ' + v + ' vs ' + prev[key] + ' = +' + Math.round((v / prev[key] - 1) * 100) + '%'); if (v < prev[key] * 1.25 || v > prev[key] * 1.45) bad.push('damage ' + v + ' vs ' + prev[key]); if (d.t === 'Staff' && !(d.magic > 140)) bad.push('staff magic');
      if (d.eff && d.eff.stun !== undefined && typeof d.eff.stun !== 'number') bad.push('stun must be a number') }
    else if (d.k === 'ring') { if (!d.pas || d.pas.ward < prevWard * 1.25 || !d.hp) bad.push('ring strength ward ' + (d.pas && d.pas.ward) + ' vs ' + prevWard) }
    else { const v = d.armor; o.str.push(id + ' ' + key + ' ' + v + ' vs ' + prev[key] + ' = +' + Math.round((v / prev[key] - 1) * 100) + '%'); if (v < prev[key] * 1.25 || v > prev[key] * 1.45) bad.push('armour ' + v + ' vs ' + prev[key]); if (!d.pas) bad.push('no pas') }
    if (bad.length) o.bad.push(id + ': ' + bad.join(', ')) } return o }"""
PLACE_JS = """() => { const o = {bad: [], per: {}}; const seen = {};
  for (const [it, lv, how, ref] of PGR.PLACE) { seen[it] = (seen[it] || 0) + 1; o.per[lv] = (o.per[lv] || 0) + 1;
    if (!PGR_ITEMS[it]) o.bad.push('unknown item ' + it);
    if (how === 'boss' && !ENEMY_DEF[ref]) o.bad.push('no boss ' + ref);
    if (how === 'quest' && !(QUESTS[ref] && QUESTS[ref].reward.items.includes(it))) o.bad.push('quest ' + ref + ' lacks ' + it);
    if ((how === 'riddle' || how === 'key') && !(PGR.CHESTS[ref] && PGR.CHESTS[ref].item === it && PGR.CHESTS[ref].lv === lv)) o.bad.push('chest ' + ref);
    if (how === 'key' && !ITEMDEF[PGR.CHESTS[ref].key]) o.bad.push('key item ' + PGR.CHESTS[ref].key);
    if (how === 'riddle' && !PGR.CHESTS[ref].foe.some(t => ENEMY_DEF[t])) o.bad.push('ambush foe ' + ref) }
  for (const id in PGR_ITEMS) if (seen[id] !== 1) o.bad.push(id + ' placed ' + seen[id] + ' times');
  return o }"""
CHEST_JS = """(lv) => { const L = LEVELS[lv], o = {bad: [], n: 0}; const W = G.grid[0].length, H = G.grid.length;
  const reach = new Set([G.P.x + ',' + G.P.y]); const q = [[G.P.x, G.P.y]];
  for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b, k = nx + ',' + ny; if (reach.has(k) || nx < 0 || ny < 0 || nx >= W || ny >= H || G.grid[ny][nx] !== 0 || (typeof cellBlocked === 'function' && cellBlocked(nx, ny))) continue; reach.add(k); q.push([nx, ny]) } }
  for (const cid in PGR.CHESTS) { const c = PGR.CHESTS[cid]; if (c.lv !== lv) continue; o.n++;
    const d = G.decor.find(d => d.npc === cid); if (!d) { o.bad.push(cid + ' not in G.decor'); continue }
    if (L.rows[d.y][d.x] !== '.') o.bad.push(cid + ' on a wall');
    const nb = [[1,0],[-1,0],[0,1],[0,-1]].filter(([a, b]) => reach.has((d.x + a) + ',' + (d.y + b))).length; if (!nb) o.bad.push(cid + ' cannot be reached from the start');
    const P = L._ps || {}; for (const z of P.safe || []) { const inz = z.rect ? (d.x >= z.x0 && d.x <= z.x1 && d.y >= z.y0 && d.y <= z.y1) : Math.hypot(d.x - z.x, d.y - z.y) <= z.r; if (inz) o.bad.push(cid + ' in a safe zone') }
    for (const z of P.rests || []) if (d.x >= z.x0 && d.x <= z.x1 && d.y >= z.y0 && d.y <= z.y1) o.bad.push(cid + ' in a rest room');
    if (L.tele && Math.hypot(d.x - L.tele[0], d.y - L.tele[1]) <= 8) o.bad.push(cid + ' near the waystone');
    const walls = [[1,0],[-1,0],[0,1],[0,-1]].filter(([a, b]) => L.rows[d.y + b][d.x + a] !== '.').length; o.walls = (o.walls || []).concat(walls) }
  return o }"""


def main():
    for f in glob.glob(os.path.join(ROOT, 'src', 'desert', 'ps_gear.js')) + glob.glob(os.path.join(ROOT, 'tools', 'PALE_SPIRE_GEAR.md')) + glob.glob(os.path.join(ROOT, 'tools', 'PS_GEAR_ICONS.md')):
        t = open(f, encoding='utf-8').read()
        check('no dash in ' + os.path.basename(f), t.count('—') + t.count('–') == 0)
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate(ITEMS_JS)
        for s in r['str']:
            print('  ', s)
        check('27 items (26 of the first floor, the circlet of the second floor)', r['n'] == 27, r['n'])
        check('every type has two (rings four; the head three with the second floor circlet)', all(r['types'].get(k) == (3 if k == 'head' else 2) for k in SLOTS + ARM) and r['types'].get('ring') == 4, r['types'])
        check('items sane and stronger than the previous best', not r['bad'], r['bad'])
        r = pg.evaluate(PLACE_JS)
        check('placements valid, one per item', not r['bad'], r['bad'])
        built = pg.evaluate("() => PSP.LEVELS.filter(l => l.built).map(l => l.id)")
        check('two on every built level of the first floor (the Crooked Road, 9715, is a connector without gear); the second floor hub (9820) gives one, its illusion rooms none', all(r['per'].get(str(l), 0) >= 2 for l in built if l != 9715 and l < 9820) and r['per'].get('9820', 0) == 1, r['per'])
        check('pieces outside', r['per'].get('9720', 0) + r['per'].get('9730', 0) >= 2)
        for lv in [9720, 9721, 9722, 9732, 9740, 9750, 9780]:
            enter(pg, lv)
            o = pg.evaluate(CHEST_JS, lv)
            check('chests in %d (%d, walls %s)' % (lv, o['n'], o.get('walls')), o['n'] > 0 and not o['bad'], o['bad'])
        enter(pg, 9721)
        r = pg.evaluate("""() => { const o = {}; addEnemy('psgatecaptain', G.P.x, G.P.y, true); let e = G.enemies[G.enemies.length - 1]; e.hp = 1; hurtEnemy(e, 50);
          o.first = bagCount('pg_tollblade'); addEnemy('psgatecaptain', G.P.x, G.P.y, true); e = G.enemies[G.enemies.length - 1]; e.hp = 1; hurtEnemy(e, 50); o.second = bagCount('pg_tollblade'); o.flag = !!pspF().pg.got.pg_tollblade; return o }""")
        check('boss drops the piece once', r['first'] == 1 and r['second'] == 1 and r['flag'], r)
        r = pg.evaluate("""() => { const o = {}; bagAdd(mkItem('pskeyring')); qAccept('psq2'); o.ready2 = qReady('psq2'); qTurnIn('psq2'); o.bag = bagCount('pg_keyblade');
          for (let i = 0; i < 9; i++) bagAdd(mkItem('pstoken')); qAccept('psq1'); o.ready1 = qReady('psq1');
          qTurnIn('psq1'); let k = 0; while (bagAdd(mkItem('st_rimmed')) && k++ < 400); o.full = k; pgrGive('pg_dawnshield'); o.ground = G.items.some(q => q.k === 'pg_dawnshield'); o.flag = !!pspF().pg.got.pg_dawnshield; return o }""")
        check('quest reward gives the piece, a full bag drops it', r['bag'] == 1 and r['ground'] and r['flag'], r)
        enter(pg, 9740)
        r = pg.evaluate("""() => { const o = {}; const cid = 'pgr_c9740r', d = G.decor.find(d => d.npc === cid); G.P.x = d.x; G.P.y = d.y;
          const open = () => { let node = NPCS[cid].root(d); while (node.opts.length === 1 && node.opts[0][0] === 'Go on.') node = node.opts[0][1](); return node };
          let node = open(); o.opts = node.opts.map(x => x[0]); const before = G.enemies.filter(e => e.hp > 0).length;
          node.opts.find(x => x[0] === 'A raven.')[1](); o.amb = G.enemies.filter(e => e.hp > 0).length - before; o.noItem = bagCount('pg_candlecrown');
          open().opts.find(x => x[0] === 'A heron.')[1](); o.item = bagCount('pg_candlecrown'); o.hidden = !!d.hidden; o.again = NPCS[cid].root(d).text; return o }""")
        check('riddle: wrong wakes two, right gives the piece', r['amb'] == 2 and r['noItem'] == 0 and r['item'] == 1 and r['hidden'], r)
        enter(pg, 9722)
        r = pg.evaluate("""() => { const o = {}; const cid = 'pgr_c9722k', d = G.decor.find(d => d.npc === cid);
          o.had = bagCount('pshorn'); bagRemove('pshorn', 99); let node = NPCS[cid].root(d); const t = node.opts[0][1]() || {text: ''}; o.t = t.text; o.has = pgrHas('pshorn'); o.refused = bagCount('pg_winchbow') === 0 && /no horn/.test(t.text);
          bagAdd(mkItem('pshorn')); node = NPCS[cid].root(d); node.opts[0][1](); o.item = bagCount('pg_winchbow'); return o }""")
        check('key chest refuses without the horn, opens with it', r['refused'] and r['item'] == 1, r)
        r = pg.evaluate("""() => { writeSave('auto'); const sv = readSave('auto'); const got = Object.keys(sv.flags.psp.pg.got); restore(sv); return got }""")
        pg.wait_for_timeout(1500)
        r2 = pg.evaluate("() => [Object.keys(pspF().pg.got), pgrGive('pg_tollblade')]")
        check('save and load keep the awarded flags', set(r) == set(r2[0]) and len(r) >= 5 and r2[1] is False, [r, r2])
        check('no page errors', not real(errs), real(errs)[:8])
        b.close()


main()
print('FAILED: %s' % FAILS if FAILS else 'ALL PASSED')
sys.exit(1 if FAILS else 0)
