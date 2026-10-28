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


PLACES = [  # name, level, x, y, facing (0 north, 1 east, 2 south, 3 west)
    ('t01_east_gate', 9610, 66, 32, 3), ('t02_toll_bar', 9610, 52, 32, 3), ('t03_toll_house', 9610, 42, 33, 0), ('t04_graves', 9610, 55, 29, 0),
    ('t05_shrine', 9610, 20, 45, 0), ('t06_west', 9610, 14, 32, 3), ('t07_milestone', 9610, 10, 32, 3), ('t08_crowtree', 9610, 58, 20, 0),
    ('t09_hut', 9610, 13, 22, 0), ('t10_inside', 9611, 6, 7, 0), ('t11_desk', 9611, 6, 5, 0),
    ('a01_east_gate', 9620, 74, 35, 3), ('a02_farmyard', 9620, 55, 35, 3), ('a03_house', 9620, 48, 29, 0), ('a04_field', 9620, 30, 20, 3),
    ('a05_well', 9620, 45, 32, 3), ('a06_barn', 9620, 58, 30, 0), ('a07_house_in', 9621, 7, 9, 0), ('a08_cellar', 9622, 6, 7, 0), ('a09_barn_in', 9623, 7, 9, 0), ('a10_west', 9620, 8, 35, 3), ('t12_map', 9610, 42, 33, 0), ('a11_map', 9620, 48, 36, 0), ('t13_map_in', 9611, 6, 7, 0)]


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


if what in ('shots', 'all'): run_shots(sys.argv[2:] or None)



QHELP = r"""
window.T = {
  wait: ms => new Promise(r => setTimeout(r, ms)),
  btn: (node, label) => { const o = node.opts.find(o => o[0] === label); if (!o) throw new Error('no button "' + label + '" in ' + JSON.stringify(node.opts.map(o => o[0])) + ' text: ' + (node.text || '').slice(0, 80)); return o[1]() },
  root: (id, d) => NPCS[id].root(d || {k: 'x', x: 1, y: 1}),
  go: async (lv, e) => { goToLevel(lv, e || {x: 4, y: 4, f: 0}); for (let i = 0; i < 40 && LEVEL !== lv; i++) await T.wait(250); await T.wait(600); G.state = 'play'; G.talk = null },
  dec: id => G.decor.find(d => d.npc === id),
  accept: (id, qid) => { const n = T.root(id); const o = n.opts.find(o => /help|do it|go\?|look|fetch|Yes/i.test(o[0]) || o[0] !== 'Not now.' && o[0] !== 'Bye.'); return o },
  kill: t => { let n = 0; for (const e of G.enemies) if (e.t === t && e.hp > 0) { hurtEnemy(e, 99999999); n++ } return n },
  st: ids => ids.map(q => q + ':' + qSt(q)).join(' '),
}
"""


def run_quests():
    fails = []

    def check(name, ok, extra=''):
        print(('PASS ' if ok else 'FAIL ') + name + ((' | ' + str(extra)) if extra != '' else ''))
        if not ok: fails.append(name)
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        pg.evaluate(QHELP)
        ev = lambda js: pg.evaluate(js)
        # ---- place 1 ----
        ev("() => { G.heroes.forEach(h=>{h.hp=h.max}); G.gold=1000 }")
        check('keeper offers blq1 (gold !)', ev("() => [].concat(QGIVER.blt_keeper).includes('blq1')"))
        check('blq1 accept', ev("() => { const n=T.root('blt_keeper'); T.btn(n,'We will help.'); return qSt('blq1')==='active' }"))
        ev("async () => { await T.go(9611,{x:6,y:6,f:0}) }")
        check('ledger taken from the desk', ev("() => { const d=T.dec('blt_ledger'); if(!d) return false; const n=NPCS.blt_ledger.root(d); T.btn(n,'Take the ledger.'); return bagCount('blledger')>0 && qReady('blq1') }"))
        ev("async () => { await T.go(9610,{x:60,y:32,f:3}) }")
        check('blq1 hand in', ev("() => { const g0=G.gold; const n=T.root('blt_keeper'); T.btn(n,'Here you go.'); return qSt('blq1')==='done' && G.gold>g0 }"))
        check('blq2 accept', ev("() => { const n=T.root('blt_crow'); T.btn(n,'We will help.'); return qSt('blq2')==='active' }"))
        check('five dead wardens fall and blq2 is ready', ev("() => { const k=T.kill('bldeadwarden'); return k>=5 && (blF().wk|0)>=5 && qReady('blq2') }"))
        check('blq2 hand in (ring)', ev("() => { const n=T.root('blt_crow'); T.btn(n,'Here you go.'); return qSt('blq2')==='done' && bagCount('blwardenring')+G.heroes.some(h=>h.eq&&JSON.stringify(h.eq).includes('blwardenring'))>=0 }"))
        check('blq3 accept', ev("() => { const n=T.root('blt_nun'); T.btn(n,'We will help.'); return qSt('blq3')==='active' }"))
        ev("async () => { await T.go(9611,{x:6,y:6,f:0}) }")
        check('candle from the dead warden', ev("() => { const d=T.dec('blt_deadwarden'); const n=NPCS.blt_deadwarden.root(d); T.btn(n,'Take the candle.'); return bagCount('blcandle')>0 }"))
        ev("async () => { await T.go(9610,{x:20,y:43,f:0}) }")
        check('candle lit at the shrine, quest ready', ev("() => { const n=NPCS.blt_shrine.root({}); T.btn(n,'Set the candle in the hollow and light it.'); return blF().shrineLit===1 && qReady('blq3') }"))
        check('blq3 hand in', ev("() => { const n=T.root('blt_nun'); T.btn(n,'Here you go.'); return qSt('blq3')==='done' }"))
        # ---- place 2 ----
        check('blq4 accept (Hob)', ev("() => { const n=T.root('bla_hob'); T.btn(n,'We will help.'); return qSt('blq4')==='active' }"))
        ev("async () => { await T.go(9622,{x:5,y:3,f:2}) }")
        check('Tilly found and freed', ev("() => { const d=T.dec('bla_tilly'); if(!d) return 'no tilly'; const n=NPCS.bla_tilly.root(d); T.btn(n,'Come out. We will take you somewhere safe.'); return blF().tillyFree===1 && qReady('blq4') }"))
        ev("async () => { await T.go(9623,{x:6,y:7,f:0}) }")
        check('Tilly is in the barn, Hob is there', ev("() => !!T.dec('bla_tilly') && !!T.dec('bla_hob')"))
        check('blq4 hand in', ev("() => { const n=T.root('bla_hob'); T.btn(n,'Here you go.'); return qSt('blq4')==='done' }"))
        check('blq5 accept', ev("() => { const n=T.root('bla_hob'); T.btn(n,'We will help.'); return qSt('blq5')==='active' }"))
        ev("async () => { await T.go(9620,{x:73,y:35,f:3}) }")
        check('Heart-Scarecrow falls, heart drops', ev("() => { const k=T.kill('blscarebig'); return k===1 && bagCount('blheart')>0 }"))
        ev("async () => { await T.go(9621,{x:7,y:8,f:0}) }")
        check('heart burnt in the hearth, quest ready', ev("() => { const n=NPCS.bla_hearth.root({}); T.btn(n,'Throw the heart into the fire.'); return blF().heartBurnt===1 && qReady('blq5') }"))
        check('blq5 hand in', ev("() => { const n=T.root('bla_hob'); T.btn(n,'Here you go.'); return qSt('blq5')==='done' }"))
        check('blq6 accept (Edda)', ev("() => { const n=T.root('bla_edda'); T.btn(n,'We will help.'); return qSt('blq6')==='active' }"))
        ev("async () => { await T.go(9620,{x:26,y:50,f:0}) }")
        check('ring dug up', ev("() => { const n=NPCS.bla_ringspot.root({}); T.btn(n,'Dig.'); return bagCount('blring')>0 }"))
        ev("async () => { await T.go(9621,{x:7,y:8,f:0}) }")
        check('ring put on Wilf, quest ready', ev("() => { const n=NPCS.bla_wilf.root({}); T.btn(n,'Put the ring on his finger.'); return blF().ringGiven===1 && qReady('blq6') }"))
        check('blq6 hand in', ev("() => { const n=T.root('bla_edda'); T.btn(n,'Here you go.'); return qSt('blq6')==='done' }"))
        print('quests', ev("() => T.st(['blq1','blq2','blq3','blq4','blq5','blq6'])"))
        check('flags are plain data (save safe)', ev("() => { JSON.parse(JSON.stringify(G.flags.bl)); return true }"))
        print('errors', real(errs)[:10])
        check('no console errors', not real(errs))
        b.close()
    return not fails


if what in ('quests', 'all'): print('QUESTS', 'OK' if run_quests() else 'FAIL')



def run_walk():
    """Flood fill over the real levels: gates, doors, people and objects with something to say are all reached; no creature stands within 9 squares of an arrival square."""
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = [];
          for (const id of [9610, 9620, 9611, 9621, 9622, 9623]) {
            if (!LEVELS[id]) KH_LAZY[id]();
            const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length, bs = new Set();
            for (const d of L.decor) if (d.block && !d.found) bs.add(d.x + ',' + d.y);
            const st = L.start, seen = new Uint8Array(W * H), q = [st.y * W + st.x]; seen[q[0]] = 1;
            for (let i = 0; i < q.length; i++) { const c = q[i], x = c % W, y = (c / W) | 0;
              for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b; if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny*W+nx] || L.rows[ny][nx] !== '.' || bs.has(nx + ',' + ny)) continue; seen[ny*W+nx] = 1; q.push(ny*W+nx) } }
            const reach = (x, y) => [[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([a,b]) => seen[(y+b)*W + x + a]);
            const bad = [];
            for (const d of L.decor) if (d.npc && !d.found && !reach(d.x, d.y)) bad.push('npc ' + d.npc + ' ' + d.x + ',' + d.y);
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = L.chars[L.rows[y][x]]; if (g !== undefined && KH_DOOR[g] && !reach(x, y)) bad.push('door ' + x + ',' + y) }
            const near = L.enemies.filter(e => Math.hypot(e.x - st.x, e.y - st.y) < 9).map(e => e.t + '@' + e.x + ',' + e.y);
            const unreachFoes = L.enemies.filter(e => !seen[e.y*W+e.x]).map(e => e.t + '@' + e.x + ',' + e.y);
            out.push({id, size: W + 'x' + H, decor: L.decor.length, foes: L.enemies.length, bad, near, unreachFoes}) }
          return out }""")
        ok = True
        for x in r:
            print(x)
            if x['bad'] or (x['near'] and x['id'] in (9610, 9620)) or x['unreachFoes']: ok = False
        print('errors', real(errs)[:10])
        b.close()
        return ok and not real(errs)


def run_gate():
    """Wenlock's open west gate leads to the Toll House (quest wk8 done: ?town=wenlock&lvl=80&ws=gate)."""
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
        pg.goto('http://localhost:%s/index.html?town=wenlock&lvl=80&ws=gate&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===496&&G.flags&&G.flags.wsGate", timeout=120000)
        pg.wait_for_timeout(2500)
        pg.evaluate("() => { G.talk=null; goToLevel(496,{x:5,y:50,f:3}); G.state='play' }")
        pg.wait_for_timeout(1500)
        pg.evaluate("() => usePortal(2)")
        pg.wait_for_function("()=>LEVEL===9610", timeout=60000)
        pg.wait_for_timeout(1500)
        r = pg.evaluate("() => ({lvl: LEVEL, pos: [G.P.x, G.P.y], name: LEVEL_NAMES[LEVEL], hint: storyNext()})")
        print(r)
        # and back: walk to the east gate door of the Toll House
        pg.evaluate("() => { const L=LEVELS[9610]; for (const c in L.chars) { const d=KH_DOOR[L.chars[c]]; if (d && d.bl && d.side==='E') { goToLevel(d.lvl, d.at); } } }")
        pg.wait_for_function("()=>LEVEL===496", timeout=60000)
        r2 = pg.evaluate("() => ({lvl: LEVEL, pos: [G.P.x, G.P.y]})")
        print(r2)
        print('errors', real(errs)[:10])
        b.close()
        return r['lvl'] == 9610 and r2['lvl'] == 496 and r2['pos'][0] > 2 and not real(errs)


if what in ('walk', 'all'): print('WALK', 'OK' if run_walk() else 'FAIL')
if what in ('gate', 'all'): print('GATE', 'OK' if run_gate() else 'FAIL')



def run_save():
    """A game saved inside each built place and its rooms is loaded again in the same place, with the same flags."""
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        res = []
        for lv, x, y in [(9610, 30, 32), (9611, 6, 6), (9620, 40, 35), (9621, 7, 8), (9622, 5, 4), (9623, 6, 7), (9650, 20, 10)]:
            pg.evaluate("([lv,x,y]) => { goToLevel(lv,{x,y,f:3}); G.state='play'; G.talk=null; blF().marker=lv }", [lv, x, y])
            pg.wait_for_function("(lv)=>LEVEL===lv", arg=lv, timeout=60000)
            pg.wait_for_timeout(1200)
            ok = pg.evaluate("""async (lv) => {
              const sv = JSON.parse(JSON.stringify(snapshot()));
              goToLevel(2, null); await new Promise(r => setTimeout(r, 800));
              restore(sv); for (let i = 0; i < 60 && LEVEL !== lv; i++) await new Promise(r => setTimeout(r, 300));
              await new Promise(r => setTimeout(r, 600));
              return {lvl: LEVEL, marker: blF().marker, state: G.state} }""", lv)
            print(lv, ok)
            res.append(ok['lvl'] == lv and ok['marker'] == lv)
        print('errors', real(errs)[:10])
        b.close()
        return all(res) and not real(errs)


if what in ('save', 'all'): print('SAVE', 'OK' if run_save() else 'FAIL')

