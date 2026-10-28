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
        # the jump links ?town=blight5 and ?town=blight6 land in the east end of each place
        for town, lv in (('blight5', 9650), ('blight6', 9660)):
            b2, pg2, errs2 = boot(p, town)
            r2 = pg2.evaluate("() => ({lvl: LEVEL, pos: [G.P.x, G.P.y], name: LEVEL_NAMES[LEVEL]})")
            print(town, r2)
            ok = ok and r2['lvl'] == lv and not real(errs2)
            b2.close()
        return ok and not real(errs)


PLACES = [  # name, level, x, y, facing (0 north, 1 east, 2 south, 3 west)
    ('o01_east_gate', 9650, 79, 36, 3), ('o02_lane_yard', 9650, 44, 36, 0), ('o03_yard', 9650, 44, 33, 0), ('o04_hall', 9650, 40, 28, 0), ('o05_orchard', 9650, 18, 17, 1),
    ('o06_orchard2', 9650, 24, 27, 0), ('o07_shed', 9650, 64, 34, 0), ('o08_hut', 9650, 71, 18, 0), ('o09_crypts', 9650, 20, 42, 2), ('o10_crypt_door', 9650, 25, 61, 0),
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


QHELP = r"""
window.T = {
  wait: ms => new Promise(r => setTimeout(r, ms)),
  btn: (node, label) => { const o = node.opts.find(o => o[0] === label); if (!o) throw new Error('no button "' + label + '" in ' + JSON.stringify(node.opts.map(o => o[0])) + ' text: ' + (node.text || '').slice(0, 80)); return o[1]() },
  root: (id, d) => NPCS[id].root(d || {k: 'x', x: 1, y: 1}),
  go: async (lv, e) => { goToLevel(lv, e || {x: 4, y: 4, f: 0}); for (let i = 0; i < 40 && LEVEL !== lv; i++) await T.wait(250); await T.wait(600); G.state = 'play'; G.talk = null; for (const en of G.enemies) if (!/^(blreaper|blmaw)$/.test(en.t)) en.hp = 0 },
  dec: id => G.decor.find(d => d.npc === id),
  kill: t => { let n = 0; for (const e of G.enemies) if (e.t === t && e.hp > 0) { hurtEnemy(e, 99999999); n++ } return n },
  give: (id, n) => { for (let i = 0; i < n; i++) bagAdd(mkItem(id)) },
  mark: id => { const d = G.decor.find(x => x.npc === id); return d ? questMark(d) : -1 },
  // ask the person about a favour (the extra button), then accept
  take: (id, label) => { const n = T.root(id); const o = n.opts.find(o => /anything we can do|About the favour/.test(o[0])); if (!o) throw new Error('no quest button on ' + id + ': ' + JSON.stringify(n.opts.map(o => o[0]))); const q = o[1](); return T.btn(q, label || 'We will help.') },
  turn: id => { const n = T.root(id); return T.btn(n, 'Here you go.') },
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
        # ---------------- place 5 ----------------
        ev("async () => { await T.go(9654,{x:5,y:6,f:0}) }")
        check('Hesper has a gold ! for blq50', ev("() => T.mark('bo_hesper')===1"))
        check('blq50 accept (Hesper)', ev("() => { T.take('bo_hesper'); return qSt('blq50')==='active' }"))
        ev("async () => { await T.go(9650,{x:30,y:36,f:0}) }")
        check('three skull-apples picked from three trees, quest ready', ev("""() => { const ds = G.decor.filter(d => d.npc === 'bo_tree_0'); if (ds.length < 5) return false;
          for (let i = 0; i < 3; i++) { const n = NPCS.bo_tree_0.root(ds[i]); T.btn(n, 'Pick the skull-apple.') }
          const again = NPCS.bo_tree_0.root(ds[0]); const noMore = !again.opts.some(o => /Pick/.test(o[0]));
          return blF().apples === 3 && bagCount('blskullapple') === 3 && qReady('blq50') && noMore }"""))
        ev("async () => { await T.go(9654,{x:5,y:6,f:0}) }")
        check('Hesper has a green ? when ready', ev("() => T.mark('bo_hesper')===2"), ev("() => [blF().apples, qSt('blq50'), qGoal('blq50'), bagCount('blskullapple'), JSON.stringify(G.quests.blq50), JSON.stringify(blF())]"))
        check('blq50 hand in (apples taken, ring given)', ev("() => { const g=G.gold; T.turn('bo_hesper'); return qSt('blq50')==='done' && bagCount('blskullapple')===0 && G.gold>g }"))
        # lost patrol
        ev("async () => { await T.go(9653,{x:6,y:7,f:0}) }")
        check('Dace offers blq51 (gold !)', ev("() => T.mark('bo_dace')===1"))
        check('blq51 accept (Dace)', ev("() => { const n=T.root('bo_dace'); T.btn(n,'We will help.'); return qSt('blq51')==='active' }"))
        check('Dace is freed, the crypt loses him', ev("() => { const d=T.dec('bo_dace'); const n=NPCS.bo_dace.root(d); T.btn(n,'Pull the blades out of the wall.'); return blF().daceFree===1 && d.found===true }"))
        check('three crests taken, quest ready', ev("""() => { for (let i = 0; i < 3; i++) { const d = T.dec('bo_rem' + i); T.btn(NPCS['bo_rem' + i].root(d), 'Take the crest.') }
          const again = NPCS.bo_rem0.root(T.dec('bo_rem0')); return blF().crests === 3 && bagCount('blcrest') === 3 && qReady('blq51') && !again.opts.some(o => /Take/.test(o[0])) }"""))
        ev("async () => { await T.go(9665,{x:6,y:7,f:0}) }")
        check('Dace lies in the infirmary at Lanternrest', ev("() => !!T.dec('bo_dace') && !!T.dec('blr_surgeon')"))
        ev("async () => { await T.go(9664,{x:6,y:8,f:0}) }")
        check('Marsh has a green ? for blq51 and hands it in', ev("() => { const m=T.mark('blr_marsh'); const g=G.gold; T.turn('blr_marsh'); return m===2 && qSt('blq51')==='done' && bagCount('blcrest')===0 && G.gold>g }"))
        # bell
        ev("async () => { await T.go(9652,{x:6,y:7,f:0}) }")
        check('blq52 accept (Bartle)', ev("() => { T.take('bo_bartle'); return qSt('blq52')==='active' }"))
        check('mallet taken from the cellar door', ev("() => { const d=T.dec('bo_mallet'); T.btn(NPCS.bo_mallet.root(d),'Take the mallet.'); return bagCount('blmallet')===1 }"))
        ev("async () => { await T.go(9650,{x:44,y:36,f:0}) }")
        check('bell broken with the mallet, quest ready', ev("() => { const n=NPCS.bo_bell.root({}); T.btn(n,'Break the bell with the mallet.'); return blF().bell===1 && qReady('blq52') && bagCount('blmallet')===0 }"))
        check('Reaper-Farmer falls and drops the scythe', ev("() => { const k=T.kill('blreaper'); return k===1 && blF().reaper===1 && bagCount('blreapscythe')>0 }"))
        ev("async () => { await T.go(9652,{x:6,y:7,f:0}) }")
        check('blq52 hand in', ev("() => { T.turn('bo_bartle'); return qSt('blq52')==='done' }"))
        check('blq53 accept (Bartle, after the bell)', ev("() => { T.take('bo_bartle'); return qSt('blq53')==='active' }"))
        check('cask taken', ev("() => { const d=T.dec('bo_cask'); T.btn(NPCS.bo_cask.root(d),'Take the cask.'); return bagCount('blcask')===1 && qReady('blq53') }"))
        ev("async () => { await T.go(9662,{x:6,y:7,f:0}) }")
        check('blq53 hand in at Tolliver', ev("() => { const m=T.mark('blr_tolliver'); T.turn('blr_tolliver'); return qSt('blq53')==='done' && bagCount('blcask')===0 }"))
        # ---------------- place 6 ----------------
        check('Tolliver has a gold ! (bread)', ev("() => T.mark('blr_tolliver')===1"))
        check('stage is 0 before supplies', ev("() => blrStage()===0"))
        check('blq54 accept (Tolliver) and the shop is still there', ev("() => { const n=T.root('blr_tolliver'); const shop=n.opts.some(o=>/Browse/.test(o[0])); T.take('blr_tolliver'); return shop && qSt('blq54')==='active' }"))
        check('blq54 not ready without bread, then ready with 12', ev("() => { const a=qReady('blq54'); T.give('bread',12); return !a && qReady('blq54') }"))
        check('blq54 hand in (bread taken)', ev("() => { const b0=bagCount('bread'); T.turn('blr_tolliver'); return qSt('blq54')==='done' && bagCount('bread')===b0-12 && blrStage()===1 }"))
        ev("async () => { await T.go(9665,{x:6,y:7,f:0}) }")
        check('blq55 accept and hand in (6 salves, 4 antidotes)', ev("() => { T.take('blr_surgeon'); T.give('salve',6); T.give('antidote',4); const s0=bagCount('salve'), a0=bagCount('antidote'); const r=qReady('blq55'); T.turn('blr_surgeon'); return r && qSt('blq55')==='done' && bagCount('salve')===s0-6 && bagCount('antidote')===a0-4 && blrStage()===2 }"))
        ev("async () => { await T.go(9660,{x:60,y:32,f:0}) }")
        check('blq56 accept and hand in (15 torches)', ev("() => { T.take('blr_nell'); T.give('torch',15); const t0=bagCount('torch'); const r=qReady('blq56'); T.turn('blr_nell'); return r && qSt('blq56')==='done' && bagCount('torch')===t0-15 && blrStage()===3 }"))
        ev("async () => { await T.go(9664,{x:6,y:8,f:0}) }")
        check('Marsh: gold ! and Wren dialogue still reachable', ev("() => { const m=T.mark('blr_marsh'); const n=T.root('blr_marsh'); const w=n.opts.find(o=>/Wren/.test(o[0])); const t=w[1](); return m===1 && /Aldous Wend/.test(t.text) && /Sale/.test(t.text) }"))
        check('blq57 accept', ev("() => { T.take('blr_marsh'); return qSt('blq57')==='active' }"))
        ev("async () => { await T.go(9660,{x:66,y:62,f:3}) }")
        check('Road-Maw falls, colours dropped, quest ready', ev("() => { const k=T.kill('blmaw'); return k===1 && blF().maw===1 && bagCount('blpatrolflag')>0 && qReady('blq57') }"))
        ev("async () => { await T.go(9664,{x:6,y:8,f:0}) }")
        check('blq57 hand in', ev("() => { T.turn('blr_marsh'); return qSt('blq57')==='done' }"))
        check('blq58 accept (after blq57)', ev("() => { T.take('blr_marsh'); return qSt('blq58')==='active' }"))
        ev("async () => { await T.go(9660,{x:8,y:53,f:0}) }")
        check('scout found in the hut and sent home', ev("() => { const d=T.dec('blr_scout'); if(!d) return 'no scout'; const n=NPCS.blr_scout.root(d); T.btn(n,'Come with us. We will take you to the gate.'); return blF().scoutHome===1 && qReady('blq58') }"))
        ev("async () => { await T.go(9664,{x:6,y:8,f:0}) }")
        check('blq58 hand in', ev("() => { T.turn('blr_marsh'); return qSt('blq58')==='done' }"))
        ev("async () => { await T.go(9666,{x:4,y:7,f:0}) }")
        check('blq59 accept (Pell)', ev("() => { T.take('blr_pell'); return qSt('blq59')==='active' }"))
        ev("async () => { await T.go(9660,{x:76,y:54,f:0}) }")
        check('oil from the burnt wagon', ev("() => { const d=T.dec('blr_wagon'); T.btn(NPCS.blr_wagon.root(d),'Take the cask of lamp oil.'); return bagCount('bloil')===1 }"))
        ev("async () => { await T.go(9660,{x:12,y:66,f:0}) }")
        check('flint from the ruined camp', ev("() => { const d=T.dec('blr_camp'); T.btn(NPCS.blr_camp.root(d),'Take the oilcloth bundle.'); return bagCount('blflint')===1 }"))
        ev("async () => { await T.go(9666,{x:4,y:7,f:0}) }")
        check('beacon lit, quest ready', ev("() => { const n=NPCS.blr_beacon.root({}); T.btn(n,'Pour the oil, strike the flint.'); return blF().beaconLit===1 && qReady('blq59') }"))
        check('blq59 hand in', ev("() => { T.turn('blr_pell'); return qSt('blq59')==='done' }"))
        print('quests', ev("() => T.st(['blq50','blq51','blq52','blq53','blq54','blq55','blq56','blq57','blq58','blq59'])"))
        check('quest log text has no em dash', ev("() => !Object.keys(QUESTS).filter(k=>/^blq5\\d$/.test(k)).some(k=>/\\u2014/.test(QUESTS[k].title+QUESTS[k].desc))"))
        check('flags are plain data (save safe)', ev("() => { JSON.parse(JSON.stringify(G.flags.bl)); return true }"))
        print('errors', real(errs)[:10])
        check('no console errors', not real(errs))
        b.close()
    return not fails


def run_shop():
    fails = []

    def check(name, ok, extra=''):
        print(('PASS ' if ok else 'FAIL ') + name + ((' | ' + str(extra)) if extra != '' else ''))
        if not ok: fails.append(name)
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        pg.evaluate(QHELP)
        ev = lambda js: pg.evaluate(js)
        ev("async () => { await T.go(9662,{x:6,y:7,f:0}) }")
        r = ev("""() => { const d = T.dec('blr_tolliver'); const n = NPCS.blr_tolliver.root(d); T.btn(n, 'Browse the garrison stores');
          const c0 = d.contents.map(c => c.id), lv = c0.map(i => (ITEMDEF[i] && ITEMDEF[i].lvl) || 0);
          const armour = c0.filter(i => ITEMDEF[i] && ['shield','head','chest','legs','arms','feet','cloak','armor','armour'].includes(ITEMDEF[i].k));
          return {n: c0.length, armour: armour.length, maxLvl: Math.max(...lv), shopName: d.shopName, shop: d.shop, healing: c0.includes('healdraught')} }""")
        print(r)
        check('quartermaster stores open with army gear and healing', r['n'] >= 10 and r['armour'] >= 6 and r['shop'] and r['healing'], r)
        check('stock is at most level 79 before supplies', r['maxLvl'] <= 79, r['maxLvl'])
        check('the reserve is locked before supplies', ev("() => { const d=T.dec('blr_reserve'); const n=NPCS.blr_reserve.root(d); return !n.opts.some(o=>/Look through/.test(o[0])) }"))
        ev("() => { for (const q of ['blq54','blq55','blq56']) G.quests[q] = {st:'done'} }")
        r2 = ev("""() => { const d = T.dec('blr_tolliver'); const n = NPCS.blr_tolliver.root(d); T.btn(n, 'Browse the garrison stores');
          const c1 = d.contents.map(c => c.id), lv = c1.map(i => (ITEMDEF[i] && ITEMDEF[i].lvl) || 0);
          const rd = T.dec('blr_reserve'); T.btn(NPCS.blr_reserve.root(rd), 'Look through the reserve.');
          const rc = rd.contents.map(c => c.id), rl = rc.map(i => (ITEMDEF[i] && ITEMDEF[i].lvl) || 0);
          return {n: c1.length, maxLvl: Math.max(...lv), reserve: rc.length, reserveMax: Math.max(...rl), reserveMin: Math.min(...rl.filter(x=>x>0))} }""")
        print(r2)
        check('stores grow once the garrison is supplied (higher level gear)', r2['n'] > r['n'] and r2['maxLvl'] > r['maxLvl'], r2)
        check('the reserve opens with level 80 to 92 gear', r2['reserve'] >= 8 and r2['reserveMax'] >= 85, r2)
        ev("async () => { await T.go(9663,{x:7,y:7,f:0}) }")
        r3 = ev("""() => { const d = T.dec('blr_smith'); const n = NPCS.blr_smith.root(d); T.btn(n, 'Browse the blades');
          const c = d.contents.map(c => c.id), w = c.filter(i => ITEMDEF[i] && ITEMDEF[i].k === 'weapon'); return {n: c.length, weapons: w.length, shop: d.shop} }""")
        check('the smith sells weapons', r3['weapons'] >= 6 and r3['shop'], r3)
        ev("async () => { await T.go(9661,{x:7,y:8,f:0}) }")
        r4 = ev("""() => { const d = T.dec('blr_inn'); const n = NPCS.blr_inn.root(d); T.btn(n, 'Buy a meal'); return {n: d.contents.length} }""")
        check('the inn sells meals', r4['n'] >= 3, r4)
        print('errors', real(errs)[:10])
        check('no console errors', not real(errs))
        b.close()
    return not fails


def run_rest():
    fails = []

    def check(name, ok, extra=''):
        print(('PASS ' if ok else 'FAIL ') + name + ((' | ' + str(extra)) if extra != '' else ''))
        if not ok: fails.append(name)
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        pg.evaluate(QHELP)
        ev = lambda js: pg.evaluate(js)
        ev("async () => { await T.go(9661,{x:7,y:8,f:0}) }")
        r = ev("""() => { G.gold = 500; G.heroes.forEach(h => { h.hp = 1; h.mp = 0; h.food = 5 });
          const d = T.dec('blr_inn'); const n = NPCS.blr_inn.root(d); const cost = n.opts.find(o => /Take rooms/.test(o[0]))[0];
          T.btn(n, 'Take rooms (free)');
          return {cost, gold: G.gold, hp: G.heroes.map(h => h.hp === h.max), mp: G.heroes.map(h => h.mp === h.mpMax), food: G.heroes.map(h => h.food >= 70)} }""")
        print(r)
        check('the inn rests the party free of charge', r['gold'] == 500 and all(r['hp']) and all(r['mp']) and all(r['food']), r)
        r2 = ev("""() => ({tele9661: !!teleSpot(9661), spot: teleSpot(9661), road: [9610,9611,9620,9621,9650,9651,9652,9653,9654,9655,9660,9662,9663,9664,9665,9666].map(id => { if (!LEVELS[id]) KH_LAZY[id](); return [id, !!teleSpot(id)] }).filter(x => x[1]) })""")
        print(r2)
        check('one teleport stone: in the inn, nowhere else on the built road', r2['tele9661'] and not r2['road'], r2)
        ev("async () => { await T.go(9661,{x:7,y:8,f:0}) }")
        check('the stone is in the level of the inn (G.tele)', ev("() => !!G.tele && G.tele.n===9661 && !!G.decor.find(d=>d.k==='teleporter')"))
        check('the fort and the orchard have no stones of their own', ev("async () => { await T.go(9660,{x:44,y:50,f:0}); const a=!G.tele; await T.go(9650,{x:44,y:36,f:0}); return a && !G.tele }"))
        print('errors', real(errs)[:10])
        check('no console errors', not real(errs))
        b.close()
    return not fails


def run_save():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        res = []
        for lv, x, y in [(9650, 30, 36), (9651, 7, 7), (9652, 6, 6), (9653, 6, 7), (9654, 5, 6), (9655, 6, 7), (9660, 44, 50), (9661, 7, 8), (9662, 6, 7), (9663, 7, 7), (9664, 6, 8), (9665, 6, 7), (9666, 4, 7)]:
            pg.evaluate("([lv,x,y]) => { goToLevel(lv,{x,y,f:3}); G.state='play'; G.talk=null; blF().marker=lv }", [lv, x, y])
            pg.wait_for_function("(lv)=>LEVEL===lv", arg=lv, timeout=60000)
            pg.wait_for_timeout(1000)
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


def run_walk():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        r = pg.evaluate("""(ids) => { const out = [];
          for (const id of ids) { if (!LEVELS[id]) KH_LAZY[id]();
            const L = LEVELS[id], W = L.rows[0].length, H = L.rows.length, bs = new Set();
            for (const d of L.decor) if (d.block && !d.found) bs.add(d.x + ',' + d.y);
            const st = L.start, seen = new Uint8Array(W * H), q = [st.y * W + st.x]; seen[q[0]] = 1;
            for (let i = 0; i < q.length; i++) { const c = q[i], x = c % W, y = (c / W) | 0;
              for (const [a, b2] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b2; if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny*W+nx] || L.rows[ny][nx] !== '.' || bs.has(nx + ',' + ny)) continue; seen[ny*W+nx] = 1; q.push(ny*W+nx) } }
            const reach = (x, y) => [[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([a,b2]) => seen[(y+b2)*W + x + a]);
            const bad = [];
            for (const d of L.decor) if (d.npc && !d.found && !reach(d.x, d.y)) bad.push('npc ' + d.npc + ' ' + d.x + ',' + d.y);
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const g = L.chars[L.rows[y][x]]; if (g !== undefined && KH_DOOR[g] && !reach(x, y)) bad.push('door ' + x + ',' + y) }
            const near = L.enemies.filter(e => Math.hypot(e.x - st.x, e.y - st.y) < (W > 40 ? 9 : 4)).map(e => e.t + '@' + e.x + ',' + e.y);
            const unreachFoes = L.enemies.filter(e => !seen[e.y*W+e.x]).map(e => e.t + '@' + e.x + ',' + e.y);
            const inFort = id === 9660 ? L.enemies.filter(e => e.x >= 16 && e.x <= 72 && e.y >= 4 && e.y <= 52).map(e => e.t + '@' + e.x + ',' + e.y) : [];
            out.push({id, size: W + 'x' + H, decor: L.decor.length, foes: L.enemies.length, bad, near, unreachFoes, inFort}) }
          return out }""", IDS)
        ok = True
        for x in r:
            print(x)
            if x['bad'] or x['near'] or x['unreachFoes'] or x['inFort']: ok = False
        print('errors', real(errs)[:10])
        b.close()
        return ok and not real(errs)


if what in ('quests', 'all'): print('QUESTS', 'OK' if run_quests() else 'FAIL')
if what in ('shop', 'all'): print('SHOP', 'OK' if run_shop() else 'FAIL')
if what in ('rest', 'all'): print('REST', 'OK' if run_rest() else 'FAIL')
if what in ('save', 'all'): print('SAVE', 'OK' if run_save() else 'FAIL')
if what in ('walk', 'all'): print('WALK', 'OK' if run_walk() else 'FAIL')

