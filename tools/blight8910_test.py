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


QHELP = r"""
window.T = {
  wait: ms => new Promise(r => setTimeout(r, ms)),
  btn: (node, label) => { const o = node.opts.find(o => o[0] === label); if (!o) throw new Error('no button "' + label + '" in ' + JSON.stringify(node.opts.map(o => o[0])) + ' text: ' + (node.text || '').slice(0, 80)); return o[1]() },
  root: (id, d) => NPCS[id].root(d || {k: 'x', x: 1, y: 1}),
  go: async (lv, e) => { goToLevel(lv, e || {x: 4, y: 4, f: 0}); for (let i = 0; i < 40 && LEVEL !== lv; i++) await T.wait(250); await T.wait(600); G.state = 'play'; G.talk = null },
  dec: (id, i) => G.decor.find(d => d.npc === id && (i === undefined || d.i === i)),
  kill: t => { let n = 0; for (const e of G.enemies) if (e.t === t && e.hp > 0) { hurtEnemy(e, 99999999); n++ } return n },
  st: ids => ids.map(q => q + ':' + qSt(q)).join(' '),
  acc: id => { let n = T.root(id); for (let i = 0; i < 6 && n.opts.some(o => o[0] === 'Go on.'); i++) n = T.btn(n, 'Go on.'); T.btn(n, 'We will help.') },
}
"""


def checker():
    fails = []

    def check(name, ok, extra=''):
        print(('PASS ' if ok else 'FAIL ') + name + ((' | ' + str(extra)) if extra != '' else ''))
        if not ok: fails.append(name)
    return fails, check


def run_links():
    fails, check = checker()
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        pg.evaluate(QHELP)
        ev = lambda js, a=None: pg.evaluate(js, a) if a is not None else pg.evaluate(js)
        r = ev("""() => {
          const doors = id => { if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id]; const o = []; for (const c in L.chars) { const d = KH_DOOR[L.chars[c]]; if (d && d.bl) o.push({side: d.side, lvl: d.lvl, at: d.at}) } return o };
          const out = {};
          for (const id of [9670, 9680, 9690, 9700]) { const ds = doors(id); out[id] = {E: (ds.find(d => d.side === 'E') || {}).lvl, W: (ds.find(d => d.side === 'W') || {}).lvl, Wat: (ds.find(d => d.side === 'W') || {}).at, Eat: (ds.find(d => d.side === 'E') || {}).at} }
          return out }""")
        print(r)
        check('Hollowbell east gate leads to the Vault, west to the Rookery', r['9680']['E'] == 9670 and r['9680']['W'] == 9690)
        check('Rookery east gate leads to Hollowbell, west to the Pale Bridge', r['9690']['E'] == 9680 and r['9690']['W'] == 9700)
        check('Pale Bridge east gate leads to the Rookery, west gate to Sale (600)', r['9700']['E'] == 9690 and r['9700']['W'] == 600)
        check('west gate of Hollowbell arrives in the Rookery on its east side', r['9680']['Wat']['x'] > 60 and r['9690']['Eat']['x'] < 20)
        check('the Vault side: neighbours', ev("() => { const n = VT.neighbour('west'); const m = VT.neighbour('east'); return n && n.id === 9680 && m && m.id === 9660 }"))
        for lv, side, ex in [(9680, 'W', 9690), (9690, 'W', 9700), (9690, 'E', 9680), (9700, 'E', 9690), (9680, 'E', 9670)]:
            ev("async ([lv]) => { await T.go(lv, {x: LEVELS[lv].start.x, y: LEVELS[lv].start.y, f: 3}) }", [lv])
            ev("([side]) => { const L = LEVELS[LEVEL]; for (const c in L.chars) { const d = KH_DOOR[L.chars[c]]; if (d && d.bl && d.side === side) goToLevel(d.lvl, d.at) } }", [side])
            pg.wait_for_function("(lv)=>LEVEL===lv", arg=ex, timeout=60000); pg.wait_for_timeout(500)
            pos = ev("() => [LEVEL, G.P.x, G.P.y]"); print('walked', side, 'from', lv, '->', pos)
            check('walk %s from %d reaches %d' % (side, lv, ex), pos[0] == ex)
        ev("async () => { await T.go(9700, {x: 4, y: 35, f: 1}) }")
        ev("() => { const L = LEVELS[LEVEL]; for (const c in L.chars) { const d = KH_DOOR[L.chars[c]]; if (d && d.bl && d.side === 'W') goToLevel(d.lvl, d.at) } }")
        try:
            pg.wait_for_function("()=>LEVEL===600", timeout=90000)
        except Exception:
            pass
        pg.wait_for_timeout(1500)
        pos = ev("() => [LEVEL, G.P.x, G.P.y]"); print('into Sale', pos)
        check('the west gate arrives in Sale at the entrance square', pos[0] == 600 and pos[1] == 67 and pos[2] == 36)
        sale = ev("() => { const L = LEVELS[600]; const p = L && L.portals && L.portals[1]; return p ? {to: p.to, x: p.x, y: p.y, lock: !!p.lock, open: !!G.flags.saRoadOpen} : null }")
        print(sale)
        check("Sale's east gate leads back to the Pale Bridge toll yard", bool(sale) and sale['to'] == 9700 and sale['x'] == 4 and sale['y'] == 35 and not sale['lock'])
        check('Sale road flag set', bool(sale) and sale['open'])
        print('errors', real(errs)[:10])
        check('no console errors', not real(errs))
        b.close()
    return not fails


if what == 'links': print('LINKS', 'OK' if run_links() else 'FAIL')


def run_quests():
    fails, check = checker()
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        pg.evaluate(QHELP)
        ev = lambda js: pg.evaluate(js)
        ev("() => { G.heroes.forEach(h=>{h.hp=h.max}); G.gold=3000 }")
        # ---------------- Hollowbell ----------------
        ev("async () => { await T.go(9680,{x:19,y:44,f:3}) }")
        check('Elias offers blq40 (gold !)', ev("() => [].concat(QGIVER.blh_elias).includes('blq40')"))
        check('blq40 accept', ev("() => { const n=T.root('blh_elias'); T.btn(n,'We will help.'); return qSt('blq40')==='active' }"))
        ev("async () => { await T.go(9682,{x:6,y:7,f:0}) }")
        check('letter taken', ev("() => { const d=T.dec('blh_letter'); const n=NPCS.blh_letter.root(d); T.btn(n,'Take the letter.'); return blF().letter===1 && bagCount('blsevrinletter')>0 }"))
        ev("async () => { await T.go(9681,{x:8,y:9,f:0}) }")
        check('letter read to Prior Hugh, quest ready', ev("() => { const n=T.root('blh_prior'); T.btn(n,'Read it to him.'); return blF().letterRead===1 && qReady('blq40') }"))
        ev("async () => { await T.go(9680,{x:19,y:44,f:3}) }")
        check('blq40 hand in', ev("() => { const g0=G.gold; const n=T.root('blh_elias'); T.btn(n,'Here you go.'); return qSt('blq40')==='done' && G.gold>g0 && bagCount('blgreyring')>0 }"))
        ev("async () => { await T.go(9683,{x:9,y:7,f:0}) }")
        check('Anselm offers blq41', ev("() => [].concat(QGIVER.blh_anselm).includes('blq41')"))
        check('blq41 accept', ev("() => { const n=T.root('blh_anselm'); T.btn(n,'We will help.'); return qSt('blq41')==='active' }"))
        ev("async () => { await T.go(9680,{x:41,y:34,f:0}) }")
        check('Hollow Brothers counted (six needed)', ev("() => { const k=T.kill('blbrother'); return k>=6 && (blF().hb|0)>=6 && qReady('blq41') }"))
        ev("async () => { await T.go(9683,{x:9,y:7,f:0}) }")
        check('blq41 hand in', ev("() => { const n=T.root('blh_anselm'); T.btn(n,'Here you go.'); return qSt('blq41')==='done' }"))
        ev("async () => { await T.go(9684,{x:4,y:7,f:0}) }")
        check('Cuthbert offers blq42', ev("() => [].concat(QGIVER.blh_cuthbert).includes('blq42')"))
        check('blq42 accept', ev("() => { const n=T.root('blh_cuthbert'); T.btn(n,'We will help.'); return qSt('blq42')==='active' }"))
        check('two ropes cut in the ringing chamber', ev("() => { for (const i of [0,1]) { const d=T.dec('blh_rope'+i); const n=NPCS['blh_rope'+i].root(d); T.btn(n,'Cut the rope.') } return blhRopes()===2 }"))
        ev("async () => { await T.go(9685,{x:7,y:9,f:0}) }")
        check('third rope cut, bell silent', ev("() => { const d=T.dec('blh_rope2'); const n=NPCS.blh_rope2.root(d); T.btn(n,'Cut the rope.'); return blhRopes()===3 && qReady('blq42') }"))
        ev("async () => { await T.go(9684,{x:4,y:7,f:0}) }")
        check('blq42 hand in', ev("() => { const n=T.root('blh_cuthbert'); T.btn(n,'Here you go.'); return qSt('blq42')==='done' && bagCount('blringercowl')>0 }"))
        ev("async () => { await T.go(9681,{x:8,y:9,f:0}) }")
        check('Prior offers blq43', ev("() => [].concat(QGIVER.blh_prior).includes('blq43')"))
        check('blq43 accept', ev("() => { const n=T.root('blh_prior'); T.btn(n,'We will help.'); return qSt('blq43')==='active' }"))
        ev("async () => { await T.go(9685,{x:7,y:9,f:0}) }")
        check('the Abbot falls: clapper, quest ready', ev("() => { const k=T.kill('blabbot'); return k===1 && blF().abbot===1 && bagCount('blsilverclapper')>0 && qReady('blq43') }"))
        ev("async () => { await T.go(9681,{x:8,y:9,f:0}) }")
        check('blq43 hand in', ev("() => { const n=T.root('blh_prior'); T.btn(n,'Here you go.'); return qSt('blq43')==='done' }"))
        # ---------------- the Rookery ----------------
        ev("async () => { await T.go(9690,{x:58,y:26,f:0}) }")
        check('Speaker offers blq44 (gold !)', ev("() => [].concat(QGIVER.blr_speaker).includes('blq44')"))
        check('blq44 accept through the bargain', ev("() => { const n=T.root('blr_speaker'); T.btn(n,'What service would settle it?'); return qSt('blq44')==='active' }"))
        check('thimble 0 (sluice) and 2 (cart) taken', ev("() => { for (const i of [0,2]) { const d=T.dec('blr_thimble'+i); const n=NPCS['blr_thimble'+i].root(d); T.btn(n,'Take the thimble.') } return blrTh()===2 }"))
        ev("async () => { await T.go(9692,{x:2,y:7,f:0}) }")
        check('thimble 1 (loft) taken', ev("() => { const d=T.dec('blr_thimble1'); const n=NPCS.blr_thimble1.root(d); T.btn(n,'Take the thimble.'); return blrTh()===3 }"))
        ev("async () => { await T.go(9690,{x:58,y:26,f:0}) }")
        check('thimbles given: Parliament at peace, quest done', ev("() => { const n=T.root('blr_speaker'); T.btn(n,'Give the three thimbles to the Speaker.'); return blF().parl==='help' && qSt('blq44')==='done' && bagCount('blrookring')>0 }"))
        ev("async () => { await T.go(9691,{x:7,y:8,f:0}) }")
        check('Tolly offers blq45', ev("() => [].concat(QGIVER.blr_tolly).includes('blq45')"))
        check('blq45 accept', ev("() => { const n=T.root('blr_tolly'); T.btn(n,'We will help.'); return qSt('blq45')==='active' }"))
        check('millstone will not turn before the sluice', ev("() => { const n=NPCS.blr_stone.root({}); return !n.opts.some(o=>o[0].startsWith('Pour')) }"))
        ev("async () => { await T.go(9690,{x:28,y:32,f:0}) }")
        check('sluice opened', ev("() => { const n=NPCS.blr_sluice.root({}); T.btn(n,'Pull the lever.'); return blF().race===1 }"))
        ev("async () => { await T.go(9692,{x:2,y:7,f:0}) }")
        check('three sacks taken', ev("() => { for (const i of [0,1,2]) { const d=T.dec('blr_sack'+i); const n=NPCS['blr_sack'+i].root(d); T.btn(n,'Take the sack.') } return blrSacks()===3 }"))
        ev("async () => { await T.go(9691,{x:7,y:8,f:0}) }")
        check('rye ground, quest ready', ev("() => { const n=NPCS.blr_stone.root({}); T.btn(n,'Pour in the three sacks of rye.'); return blF().ground===1 && qReady('blq45') }"))
        check('blq45 hand in', ev("() => { const n=T.root('blr_tolly'); T.btn(n,'Here you go.'); return qSt('blq45')==='done' && bagCount('blmillcap')>0 }"))
        check('Tolly offers blq46 after blq45', ev("() => [].concat(QGIVER.blr_tolly).includes('blq46')"))
        check('blq46 accept (court at peace: ready at once)', ev("() => { const n=T.root('blr_tolly'); T.btn(n,'We will help.'); return qSt('blq46')==='active' && qReady('blq46') }"))
        check('blq46 hand in', ev("() => { const n=T.root('blr_tolly'); T.btn(n,'Here you go.'); return qSt('blq46')==='done' }"))
        ev("async () => { await T.go(9693,{x:5,y:8,f:0}) }")
        check('peaceful Queen: no boss enemy, she gives her crown', ev("() => { const d=T.dec('blr_queen'); const hid=!!(d&&d.hidden); const e=G.enemies.some(e=>e.t==='blcrowqueen'&&e.hp>0); const n=NPCS.blr_queen.root(d); T.btn(n,'Take the crown.'); return !hid && !e && bagCount('blcrowcrown')>0 }"))
        ev("async () => { await T.go(9694,{x:5,y:6,f:0}) }")
        check('Dame Tolly offers blq47', ev("() => [].concat(QGIVER.blr_widow).includes('blq47')"))
        check('blq47 accept', ev("() => { const n=T.root('blr_widow'); T.btn(n,'We will help.'); return qSt('blq47')==='active' }"))
        ev("async () => { await T.go(9693,{x:5,y:8,f:0}) }")
        check('spyglass looked through', ev("() => { const n=NPCS.blr_glass.root({}); T.btn(n,'Look through it.'); return blF().glass===1 }"))
        ev("async () => { await T.go(9694,{x:5,y:6,f:0}) }")
        check('blq47 hand in', ev("() => { const n=T.root('blr_widow'); T.btn(n,'Here you go.'); return qSt('blq47')==='done' }"))
        # ---------------- the Pale Bridge ----------------
        ev("async () => { await T.go(9700,{x:16,y:37,f:3}) }")
        check('Joss offers blq48', ev("() => [].concat(QGIVER.blp_joss).includes('blq48')"))
        check('blq48 accept', ev("() => { const n=T.root('blp_joss'); T.btn(n,'We will help.'); return qSt('blq48')==='active' }"))
        check('a later lamp will not light before the first', ev("() => { const d=T.dec('blp_lamp2'); const n=NPCS.blp_lamp2.root(d); return !n.opts.some(o=>o[0]==='Light the lamp.') }"))
        check('four lamps light in order', ev("() => { for (let i=0;i<4;i++) { const d=T.dec('blp_lamp'+i); const n=NPCS['blp_lamp'+i].root(d); T.btn(n,'Light the lamp.') } return blpLamps()===4 && qReady('blq48') }"))
        check('blq48 hand in', ev("() => { const n=T.root('blp_joss'); T.btn(n,'Here you go.'); return qSt('blq48')==='done' && bagCount('blwatchhelm')>0 }"))
        ev("async () => { await T.go(9700,{x:6,y:35,f:3}) }")
        check('Pike offers blq49', ev("() => [].concat(QGIVER.blp_pike).includes('blq49')"))
        check('blq49 accept', ev("() => { const n=T.root('blp_pike'); T.btn(n,'We will help.'); return qSt('blq49')==='active' }"))
        ev("async () => { await T.go(9700,{x:60,y:36,f:3}) }")
        check('banner taken from the cart', ev("() => { const n=NPCS.blp_cart.root({}); T.btn(n,'Take the banner.'); return bagCount('blbanner')>0 }"))
        check('Piper offers blq50 and it is accepted', ev("() => { const n=T.root('blp_piper'); T.btn(n,'We will help.'); return qSt('blq50')==='active' }"))
        ev("() => { bagAdd(mkItem('vtgatekey')) }")
        ev("async () => { await T.go(9700,{x:50,y:35,f:3}) }")
        check('the Knight steps aside for the Gate Key', ev("() => { const d=T.dec('blp_knight'); const n=NPCS.blp_knight.root(d); T.btn(n,'Show him the Gate Key of Sale.'); const hid=T.dec('blp_knight').hidden; return blF().knightYield===1 && hid===true && !G.enemies.some(e=>e.t==='blpaleknight') }"))
        ev("async () => { await T.go(9700,{x:6,y:35,f:3}) }")
        check('Pike gets the banner, blq49 done', ev("() => { const n=T.root('blp_pike'); T.btn(n,'Give him the banner.'); return qSt('blq49')==='done' && bagCount('blwatchring')>0 }"))
        ev("async () => { await T.go(9701,{x:6,y:7,f:0}) }")
        check('Captain takes the message, blq50 done', ev("() => { const n=T.root('blp_captain'); T.btn(n,'Tell her that the bridge is open.'); return qSt('blq50')==='done' }"))
        check('Captain offers blq51 after blq50', ev("() => [].concat(QGIVER.blp_captain).includes('blq51')"))
        check('blq51 accept', ev("() => { T.acc('blp_captain'); return qSt('blq51')==='active' }"))
        ev("async () => { await T.go(9700,{x:13,y:45,f:3}) }")
        check("Wren's glove taken", ev("() => { const d=T.dec('blp_glove'); const n=NPCS.blp_glove.root(d); T.btn(n,'Take the glove.'); return bagCount('blwrenglove')>0 }"))
        ev("async () => { await T.go(9701,{x:6,y:7,f:0}) }")
        check('glove shown, blq51 done', ev("() => { const n=T.root('blp_captain'); T.btn(n,'Show her the glove.'); return qSt('blq51')==='done' }"))
        print('quests', ev("() => T.st(['blq40','blq41','blq42','blq43','blq44','blq45','blq46','blq47','blq48','blq49','blq50','blq51'])"))
        check('flags are plain data (save safe)', ev("() => { JSON.parse(JSON.stringify(G.flags.bl)); return true }"))
        check('every quest has an area and a ring entry', ev("() => ['blq40','blq41','blq42','blq43','blq44','blq45','blq46','blq47','blq48','blq49','blq50','blq51'].every(q => QAREA[q]==='The Blighted Lands' && QRF.T[q])"))
        print('errors', real(errs)[:10])
        check('no console errors', not real(errs))
        b.close()
    return not fails


if what == 'quests': print('QUESTS', 'OK' if run_quests() else 'FAIL')


def run_bosses():
    """Fresh games: the Abbot summons while the ropes are uncut; the Crow Queen by war, by bribe; the Pale Knight by the sword (and a re-entry that keeps a single knight)."""
    fails, check = checker()
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        pg.evaluate(QHELP)
        ev = lambda js: pg.evaluate(js)
        ev("() => { G.heroes.forEach(h=>{h.hp=h.max}); G.gold=3000 }")
        ev("async () => { await T.go(9685,{x:7,y:9,f:0}) }")
        check('the Abbot stands in the belfry (88)', ev("() => G.enemies.some(e=>e.t==='blabbot'&&e.hp>0)"))
        check('a blow to two thirds calls two dead brothers up while the ropes are whole', ev("() => { const e=G.enemies.find(e=>e.t==='blabbot'); const n0=G.enemies.length; hurtEnemy(e, Math.ceil(e.maxhp*.4)); return G.enemies.length>n0 && e.hp>0 }"))
        check('the Abbot dies: flag, crozier, clapper', ev("() => { T.kill('blabbot'); return blF().abbot===1 && bagCount('blsilverclapper')>0 && bagCount('blabbotcrozier')>0 }"))
        ev("async () => { await T.go(9680,{x:41,y:34,f:0}) }")
        check('the tolling is over once the Abbot is dead', ev("() => !blhTolling()"))
        # the Parliament: war
        ev("async () => { await T.go(9690,{x:58,y:26,f:0}) }")
        check('the Speaker offers pay, silver, service, fight', ev("() => { const n=T.root('blr_speaker'); const l=n.opts.map(o=>o[0]); return l.includes('Pay the toll: 1500 gold.') && l.includes('Give a thing of pale silver.') && l.includes('What service would settle it?') && l.includes('We will not pay. We will fight.') }"))
        check('war: crows wake round the party', ev("() => { const n0=G.enemies.length; const n=T.root('blr_speaker'); T.btn(n,'We will not pay. We will fight.'); return blF().parl==='war' && G.enemies.length>n0 }"))
        ev("async () => { await T.go(9693,{x:5,y:8,f:0}) }")
        check('the Queen is a flying boss enemy here', ev("() => { const e=G.enemies.find(e=>e.t==='blcrowqueen'); return !!e && ENEMY_DEF.blcrowqueen.fly===true && ENEMY_DEF.blcrowqueen.boss===true }"))
        check('her decor is hidden at war', ev("() => { const d=T.dec('blr_queen'); return !!d && d.hidden===true }"))
        check('the Queen falls: crown and flag', ev("() => { const e=G.enemies.find(e=>e.t==='blcrowqueen'); hurtEnemy(e, Math.ceil(e.maxhp*.4)); const added=G.enemies.length; T.kill('blcrowqueen'); return blF().queen===1 && bagCount('blcrowcrown')>0 }"))
        check('quest blq46 settles after the kill', ev("() => { qAccept('blq46'); return qReady('blq46') }"))
        # the Pale Knight by the sword
        ev("async () => { await T.go(9700,{x:48,y:35,f:3}) }")
        check('the Knight is a person at first, with no enemy', ev("() => !!T.dec('blp_knight') && !T.dec('blp_knight').hidden && !G.enemies.some(e=>e.t==='blpaleknight')"))
        check('the Knight offers no key button without the key', ev("() => { const n=NPCS.blp_knight.root(T.dec('blp_knight')); return !n.opts.some(o=>o[0].startsWith('Show him')) && n.opts.some(o=>o[0].startsWith('We will not wait')) }"))
        check('fight: one boss enemy appears, the person goes', ev("() => { const n=NPCS.blp_knight.root(T.dec('blp_knight')); T.btn(n,'We will not wait. We will fight.'); return G.enemies.filter(e=>e.t==='blpaleknight'&&e.hp>0).length===1 && T.dec('blp_knight').hidden===true }"))
        ev("async () => { await T.go(9701,{x:6,y:7,f:0}) }")
        ev("async () => { await T.go(9700,{x:48,y:35,f:3}) }")
        check('coming back keeps a single knight', ev("() => G.enemies.filter(e=>e.t==='blpaleknight'&&e.hp>0).length===1"))
        check('the Knight falls: sword, flag, bridge passable', ev("() => { const e=G.enemies.find(e=>e.t==='blpaleknight'); hurtEnemy(e, Math.ceil(e.maxhp*.5)); T.kill('blpaleknight'); return blF().knight===1 && bagCount('blpalesword')>0 && blpPassed() }"))
        check('the Knight is not brought back after he fell', ev("async () => { await T.go(9701,{x:6,y:7,f:0}); await T.go(9700,{x:48,y:35,f:3}); return !G.enemies.some(e=>e.t==='blpaleknight'&&e.hp>0) }"))
        print('errors', real(errs)[:10])
        check('no console errors', not real(errs))
        b.close()
        # a second game: the bribe
        b, pg, errs = boot(p)
        pg.evaluate(QHELP)
        ev = lambda js: pg.evaluate(js)
        ev("() => { G.heroes.forEach(h=>{h.hp=h.max}); G.gold=3000 }")
        ev("async () => { await T.go(9690,{x:58,y:26,f:0}) }")
        check('bribe: 1500 gold paid, court at peace', ev("() => { const g0=G.gold; const n=T.root('blr_speaker'); T.btn(n,'Pay the toll: 1500 gold.'); return blF().parl==='bribe' && G.gold===g0-1500 }"))
        ev("async () => { await T.go(9693,{x:5,y:8,f:0}) }")
        check('bribe: no Queen enemy, the Queen sits there as a person', ev("() => !G.enemies.some(e=>e.t==='blcrowqueen'&&e.hp>0) && T.dec('blr_queen') && !T.dec('blr_queen').hidden"))
        check('bribe: the Queen gives no crown', ev("() => { const n=NPCS.blr_queen.root(T.dec('blr_queen')); return !n.opts.some(o=>o[0]==='Take the crown.') }"))
        ev("() => { bagAdd(mkItem('blwaxseal')) }")
        print('errors', real(errs)[:10])
        check('no console errors (second game)', not real(errs))
        b.close()
        # a third game: the key
        b, pg, errs = boot(p)
        pg.evaluate(QHELP)
        ev = lambda js: pg.evaluate(js)
        ev("async () => { await T.go(9690,{x:58,y:26,f:0}) }")
        ev("() => { bagAdd(mkItem('blwaxseal')) }")
        check('pale silver pays the toll too', ev("() => { const n=T.root('blr_speaker'); T.btn(n,'Give a thing of pale silver.'); return blF().parl==='bribe' && bagCount('blwaxseal')===0 }"))
        ev("async () => { await T.go(9700,{x:48,y:35,f:3}) }")
        ev("() => { bagAdd(mkItem('vtgatekey')) }")
        check('with the key the Knight yields at once and keeps the key', ev("() => { const n=NPCS.blp_knight.root(T.dec('blp_knight')); T.btn(n,'Show him the Gate Key of Sale.'); return blF().knightYield===1 && bagCount('vtgatekey')===1 && !G.enemies.some(e=>e.t==='blpaleknight') }"))
        check('after yielding, a reload of the level still shows no Knight', ev("async () => { await T.go(9701,{x:6,y:7,f:0}); await T.go(9700,{x:48,y:35,f:3}); return T.dec('blp_knight').hidden===true && T.dec('blp_knight').block===false }"))
        print('errors', real(errs)[:10])
        check('no console errors (third game)', not real(errs))
        b.close()
    return not fails


if what == 'bosses': print('BOSSES', 'OK' if run_bosses() else 'FAIL')


def run_walk():
    """Flood fill over the real levels (water and the ravine block): gates, doors, people, objects and every creature are reached; no creature within 9 squares of an arrival square."""
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""() => {
          const out = [];
          for (const id of %s) {
            if (!LEVELS[id]) KH_LAZY[id]();
            const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length, bs = new Set(), T = TERRS[id];
            for (const d of L.decor) if (d.block && !d.found && d.npc !== 'blp_knight') bs.add(d.x + ',' + d.y);
            const wet = (x, y) => !!(T && T.block && T.block[y * W + x]);
            const starts = [L.start]; const pl = blPlaceOf(id); if (pl && pl.id === id) starts.push({x: pl.fromW.x, y: pl.fromW.y});
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
            const onProp = L.enemies.filter(e => bs.has(e.x + ',' + e.y)).map(e => e.t + '@' + e.x + ',' + e.y);
            const sizeOf = pl => 0;
            out.push({id, size: W + 'x' + H, decor: L.decor.length, foes: L.enemies.length, bad, near, unreachFoes, water, onProp}) }
          return out }""" % json.dumps(ALL))
        ok = True
        for x in r:
            print(x)
            if x['bad'] or (x['near'] and x['id'] in (9680, 9690, 9700)) or x['unreachFoes'] or x['water'] or x['onProp']: ok = False
        print('errors', real(errs)[:10])
        b.close()
        return ok and not real(errs)


if what == 'walk': print('WALK', 'OK' if run_walk() else 'FAIL')


def run_save():
    """A game saved inside each level loads again in the same place, with the same flags."""
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        res = []
        spots = [(9680, 60, 38), (9681, 8, 9), (9682, 6, 7), (9683, 9, 7), (9684, 4, 7), (9685, 7, 9), (9686, 9, 11), (9690, 60, 35), (9691, 7, 8), (9692, 2, 7), (9693, 5, 8), (9694, 5, 6), (9700, 60, 35), (9701, 6, 7), (9702, 5, 6)]
        for lv, x, y in spots:
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


if what == 'save': print('SAVE', 'OK' if run_save() else 'FAIL')
