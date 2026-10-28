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
        ok = all(x['ok'] for x in r) and r[0]['W'] == 9630 and r[1]['W'] == 9640 and r[2]['W'] == 9650 and r[1]['E'] == 9620 and r[2]['E'] == 9630
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
    ('g06_jetty', 9640, 50, 38, 0), ('g07_ferryman', 9641, 6, 7, 0), ('g08_reeve', 9642, 6, 7, 0), ('g09_west', 9640, 14, 38, 3), ('g10_map', 9640, 70, 38, 3), ('g11_heron', 9640, 62, 16, 0), ('g12_reeve_isle', 9640, 28, 15, 0), ('g13_pans', 9640, 37, 56, 2), ('g14_nave_alder', 9631, 10, 9, 0)]


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


QHELP = r"""
window.T = {
  wait: ms => new Promise(r => setTimeout(r, ms)),
  btn: (node, label) => { const o = node.opts.find(o => o[0] === label); if (!o) throw new Error('no button "' + label + '" in ' + JSON.stringify(node.opts.map(o => o[0])) + ' text: ' + (node.text || '').slice(0, 80)); return o[1]() },
  root: (id, d) => NPCS[id].root(d || {k: 'x', x: 1, y: 1}),
  go: async (lv, e) => { goToLevel(lv, e || {x: 4, y: 4, f: 0}); for (let i = 0; i < 40 && LEVEL !== lv; i++) await T.wait(250); await T.wait(600); G.state = 'play'; G.talk = null },
  dec: id => G.decor.find(d => d.npc === id),
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
        ev("() => { G.heroes.forEach(h=>{h.hp=h.max}); G.gold=1000 }")
        # ---------------- the church ----------------
        ev("async () => { await T.go(9630,{x:56,y:31,f:1}) }")
        check('gideon offers blq7 (gold !)', ev("() => [].concat(QGIVER.blc_gideon).includes('blq7')"))
        check('blq7 accept', ev("() => { const n=T.root('blc_gideon'); T.btn(n,'We will help.'); return qSt('blq7')==='active' }"))
        ev("async () => { await T.go(9633,{x:5,y:7,f:0}) }")
        check('a false bell hurts, does not finish the quest', ev("() => { const h0=G.heroes[0].hp; const n=NPCS.blc_bellA.root({}); T.btn(n,'Ring it.'); return (blF().wrongBells|0)===1 && !blF().trueBell && G.heroes[0].hp<h0 }"))
        check('the true bell: quest ready', ev("() => { const n=NPCS.blc_bellC.root({}); T.btn(n,'Ring it.'); return blF().trueBell===1 && qReady('blq7') }"))
        ev("async () => { await T.go(9630,{x:56,y:31,f:1}) }")
        check('blq7 hand in', ev("() => { const g0=G.gold; const n=T.root('blc_gideon'); T.btn(n,'Here you go.'); return qSt('blq7')==='done' && G.gold>g0 }"))
        ev("async () => { await T.go(9631,{x:10,y:12,f:0}) }")
        check('ambrose offers blq8', ev("() => [].concat(QGIVER.blc_ambrose).includes('blq8')"))
        check('blq8 accept', ev("() => { const n=T.root('blc_ambrose'); T.btn(n,'We will help.'); return qSt('blq8')==='active' }"))
        check('choir singers stand in the nave', ev("() => G.decor.filter(d=>d.npc==='blc_choir'&&!d.found).length>=12"))
        ev("async () => { await T.go(9632,{x:10,y:12,f:0}) }")
        check('boss stands in the crypt', ev("() => G.enemies.some(e=>e.t==='blcantor')"))
        check('page 1 taken', ev("() => { const d=T.dec('blc_page1'); const n=NPCS.blc_page1.root(d); T.btn(n,'Take the page.'); return blF().pg1===1 }"))
        check('niche gives the alms bowl', ev("() => { const n=NPCS.blc_pauper.root({}); T.btn(n,'Lift the slab.'); return bagCount('blalmsbowl')>0 }"))
        check('chantry chest', ev("() => { const g0=G.gold; const n=NPCS.blc_cryptchest.root({}); T.btn(n,'Open it.'); return G.gold>g0 }"))
        ev("async () => { await T.go(9633,{x:5,y:7,f:0}) }")
        check('page 2 taken', ev("() => { const d=T.dec('blc_page2'); const n=NPCS.blc_page2.root(d); T.btn(n,'Take the page.'); return blF().pg2===1 }"))
        ev("async () => { await T.go(9630,{x:50,y:27,f:1}) }")
        check('page 3 taken, quest step 1 done', ev("() => { const d=T.dec('blc_page3'); const n=NPCS.blc_page3.root(d); T.btn(n,'Take the page.'); return blF().pg3===1 && blcPages()===3 }"))
        ev("async () => { await T.go(9631,{x:10,y:12,f:0}) }")
        check('pages given, choir rests, quest ready', ev("() => { const n=T.root('blc_ambrose'); T.btn(n,'Give him the pages.'); return blF().choirRest===1 && qReady('blq8') && G.decor.filter(d=>d.npc==='blc_choir'&&!d.found).length===0 }"))
        check('blq8 hand in', ev("() => { const n=T.root('blc_ambrose'); T.btn(n,'Here you go.'); return qSt('blq8')==='done' }"))
        check('blq9 accept (Alder)', ev("() => { const n=T.root('blc_alder'); T.btn(n,'We will help.'); return qSt('blq9')==='active' }"))
        ev("async () => { await T.go(9630,{x:26,y:29,f:0}) }")
        check('six grave boards read', ev("() => { for (let i=0;i<6;i++) NPCS.blc_name.root({i}); return blcNames()===6 }"))
        ev("async () => { await T.go(9631,{x:10,y:12,f:0}) }")
        check('names read to Alder, ready', ev("() => { const n=T.root('blc_alder'); T.btn(n,'Read out the six names.'); return blF().namesGiven===1 && qReady('blq9') }"))
        check('blq9 hand in', ev("() => { const n=T.root('blc_alder'); T.btn(n,'Here you go.'); return qSt('blq9')==='done' }"))
        check('blq10 accept (statue)', ev("() => { const n=T.root('blc_saint'); T.btn(n,'We will help.'); return qSt('blq10')==='active' && blF().bowl===1 }"))
        check('bowl set in the statue hands, ready', ev("() => { const n=T.root('blc_saint'); T.btn(n,'Set the bowl in her hands.'); return blF().bowlGiven===1 && qReady('blq10') }"))
        check('blq10 hand in', ev("() => { const n=T.root('blc_saint'); T.btn(n,'Here you go.'); return qSt('blq10')==='done' }"))
        # ---------------- Gallowmere ----------------
        ev("async () => { await T.go(9641,{x:6,y:6,f:0}) }")
        check('osk offers blq11', ev("() => [].concat(QGIVER.blg_osk).includes('blq11')"))
        check('blq11 accept', ev("() => { const n=T.root('blg_osk'); T.btn(n,'We will help.'); return qSt('blq11')==='active' }"))
        ev("async () => { await T.go(9640,{x:49,y:48,f:0}) }")
        check('boat to Heron Isle moves the party', ev("() => { const n=NPCS.blg_boat0.root({}); T.btn(n,'Row to Heron Isle, north east.'); return G.P.x===62 && G.P.y===18 }"))
        check('lantern taken', ev("() => { const d=T.dec('blg_lantern'); const n=NPCS.blg_lantern.root(d); T.btn(n,'Take the lantern.'); return bagCount('blferrylamp')>0 }"))
        check('marker Peascod set', ev("() => { const n=NPCS.blg_marker.root({i:1}); T.btn(n,'Set the marker upright.'); return (blF().mk&2)===2 }"))
        check('boat back to the village', ev("() => { const n=NPCS.blg_boat1.root({}); T.btn(n,'Row back to the village.'); return G.P.x===50 && G.P.y===48 }"))
        ev("async () => { await T.go(9641,{x:6,y:6,f:0}) }")
        check('lantern given, quest ready', ev("() => { const n=T.root('blg_osk'); T.btn(n,'Give him the lantern.'); return blF().lanternGiven===1 && qReady('blq11') }"))
        check('blq11 hand in', ev("() => { const n=T.root('blg_osk'); T.btn(n,'Here you go.'); return qSt('blq11')==='done' }"))
        ev("async () => { await T.go(9643,{x:5,y:6,f:0}) }")
        check('blq12 accept (Nan)', ev("() => { const n=T.root('blg_nan'); T.btn(n,'We will help.'); return qSt('blq12')==='active' }"))
        check('three salt sacks', ev("() => { for (let i=0;i<3;i++) { const n=NPCS.blg_salt.root({i}); T.btn(n,'Take the sack.') } return blgSalt()===3 }"))
        check('salt given, ready', ev("() => { const n=T.root('blg_nan'); T.btn(n,'Give her the three sacks of salt.'); return blF().saltGiven===1 && qReady('blq12') }"))
        check('blq12 hand in', ev("() => { const n=T.root('blg_nan'); T.btn(n,'Here you go.'); return qSt('blq12')==='done' }"))
        check('blq14 offered after blq12', ev("() => [].concat(QGIVER.blg_nan).includes('blq14')"))
        check('blq14 accept', ev("() => { const n=T.root('blg_nan'); T.btn(n,'We will help.'); return qSt('blq14')==='active' }"))
        ev("async () => { await T.go(9640,{x:37,y:36,f:0}) }")
        check('blq13 accept (Tam)', ev("() => { const n=T.root('blg_tam'); T.btn(n,'We will help.'); return qSt('blq13')==='active' }"))
        check('markers Corder and Hay set, ready', ev("() => { for (const i of [0,2]) { const n=NPCS.blg_marker.root({i}); T.btn(n,'Set the marker upright.') } return blgMk()===3 && qReady('blq13') }"))
        check('blq13 hand in', ev("() => { const n=T.root('blg_tam'); T.btn(n,'Here you go.'); return qSt('blq13')==='done' }"))
        check('lamp 2 refuses before lamp 1', ev("() => { const n=NPCS.blg_lamp.root({i:1}); return !n.opts.some(o=>o[0]==='Light the lamp.') }"))
        check('lamps light in order and banish wisps', ev("() => { const w0=G.enemies.filter(e=>e.t==='blwisp'&&e.hp>0).length; for (let i=0;i<5;i++) { const n=NPCS.blg_lamp.root({i}); T.btn(n,'Light the lamp.') } const w1=G.enemies.filter(e=>e.t==='blwisp'&&e.hp>0).length; return blgLamps()===5 && w1<w0 }"))
        ev("async () => { await T.go(9642,{x:7,y:10,f:0}) }")
        check('the Reeve is here with his bloats', ev("() => G.enemies.some(e=>e.t==='blreeve')"))
        check('the Reeve falls: rod, quest ready', ev("() => { const k=T.kill('blreeve'); return k===1 && blF().reeve===1 && qReady('blq14') }"))
        ev("async () => { await T.go(9643,{x:5,y:6,f:0}) }")
        check('blq14 hand in', ev("() => { const n=T.root('blg_nan'); T.btn(n,'Here you go.'); return qSt('blq14')==='done' }"))
        print('quests', ev("() => T.st(['blq7','blq8','blq9','blq10','blq11','blq12','blq13','blq14'])"))
        check('flags are plain data (save safe)', ev("() => { JSON.parse(JSON.stringify(G.flags.bl)); return true }"))
        print('errors', real(errs)[:10])
        check('no console errors', not real(errs))
        b.close()
    return not fails


if what in ('quests', 'all'): print('QUESTS', 'OK' if run_quests() else 'FAIL')


def run_walk():
    """Flood fill over the real levels (water blocks): gates, doors, people, objects and every creature are reached; no creature within 9 squares of an arrival square."""
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = [];
          for (const id of %s) {
            if (!LEVELS[id]) KH_LAZY[id]();
            const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length, bs = new Set(), T = TERRS[id];
            for (const d of L.decor) if (d.block && !d.found) bs.add(d.x + ',' + d.y);
            const wet = (x, y) => !!(T && T.block && T.block[y * W + x]);
            const starts = [L.start]; if (id === 9640) starts.push({x: 4, y: 38}, {x: 50, y: 48}, {x: 62, y: 18}, {x: 28, y: 18});
            const seen = new Uint8Array(W * H), q = [];
            for (const st of starts) { seen[st.y * W + st.x] = 1; q.push(st.y * W + st.x) }
            for (let i = 0; i < q.length; i++) { const c = q[i], x = c %% W, y = (c / W) | 0;
              for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b; if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny*W+nx] || L.rows[ny][nx] !== '.' || bs.has(nx + ',' + ny) || wet(nx, ny)) continue; seen[ny*W+nx] = 1; q.push(ny*W+nx) } }
            const reach = (x, y) => [[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([a,b]) => seen[(y+b)*W + x + a]);
            const bad = [];
            for (const d of L.decor) if (d.npc && !d.found && !reach(d.x, d.y)) bad.push('npc ' + d.npc + ' ' + d.x + ',' + d.y);
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = L.chars[L.rows[y][x]]; if (g !== undefined && KH_DOOR[g] && !reach(x, y)) bad.push('door ' + x + ',' + y) }
            const st = L.start, near = L.enemies.filter(e => Math.hypot(e.x - st.x, e.y - st.y) < 9).map(e => e.t + '@' + e.x + ',' + e.y);
            const unreachFoes = L.enemies.filter(e => !seen[e.y*W+e.x]).map(e => e.t + '@' + e.x + ',' + e.y);
            const water = L.enemies.filter(e => wet(e.x, e.y)).map(e => e.t + '@' + e.x + ',' + e.y);
            const lamps = L.decor.filter(d => d.npc === 'blg_lamp').length;
            out.push({id, size: W + 'x' + H, decor: L.decor.length, foes: L.enemies.length, bad, near, unreachFoes, water, lamps}) }
          return out }""" % json.dumps(CH + GM))
        ok = True
        for x in r:
            print(x)
            if x['bad'] or (x['near'] and x['id'] in (9630, 9640)) or x['unreachFoes'] or x['water']: ok = False
        print('errors', real(errs)[:10])
        b.close()
        return ok and not real(errs)


if what in ('walk', 'all'): print('WALK', 'OK' if run_walk() else 'FAIL')


def run_save():
    """A game saved inside each place and room loads again in the same place, with the same flags."""
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        res = []
        for lv, x, y in [(9630, 30, 36), (9631, 10, 12), (9632, 10, 12), (9633, 5, 7), (9634, 5, 6), (9640, 60, 38), (9641, 6, 6), (9642, 7, 10), (9643, 5, 6)]:
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
