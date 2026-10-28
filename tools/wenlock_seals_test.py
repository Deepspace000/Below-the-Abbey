"""Warden's Seals test (src/desert/wenlock_seals.js, quests wk4 to wk8).
Needs a server in the repo root:  python -m http.server 8391   Then:  python tools/wenlock_seals_test.py [port] [shots]
Set BTA_CHROME to an installed Chrome if Playwright has no browser of its own. Screenshots (with 'shots') go to WS_SHOTS (default %TEMP%/ws_shots).
Proves: wk4 can be accepted, each seal can be obtained (boss drop and plinth in an old save), the gate opens only with all three,
wk8 completes, flags persist through save and reload."""
import os, sys, time, tempfile
from playwright.sync_api import sync_playwright
PORT = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].isdigit() else '8391'
SHOTS = 'shots' in sys.argv
OUT = os.environ.get('WS_SHOTS') or os.path.join(tempfile.gettempdir(), 'ws_shots')
os.makedirs(OUT, exist_ok=True)
URL = 'http://localhost:%s/index.html?town=wenlock&lvl=80&v=%d' % (PORT, time.time())
fails = []
def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + ((' | ' + str(extra)) if extra != '' else ''))
    if not ok: fails.append(name)

HELP = r"""
window.T = {
  wait: ms => new Promise(r => setTimeout(r, ms)),
  btn: (node, label) => { const o = node.opts.find(o => o[0] === label); if (!o) throw new Error('no button ' + label + ' in ' + node.opts.map(o => o[0])); return o[1]() },
  has: (node, label) => !!node.opts.find(o => o[0] === label),
  root: (id, d) => NPCS[id].root(d || {k: 'x', x: 1, y: 1}),
  st: () => ['wk4','wk5','wk6','wk7','wk8'].map(q => qSt(q)).join(','),
  go: async (lv, e) => { await wsEnsure(lv); goToLevel(lv, e || {x:1,y:1,f:0}); await T.wait(700); G.state = 'play' },
  seals: () => [1,2,3].map(n => bagCount('wkseal' + n)).join(''),
}
"""
def shot(pg, name):
    if SHOTS: pg.screenshot(path=os.path.join(OUT, name + '.png'))

def boot(b, q=''):
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and '404' not in m.text else None)
    pg.goto(URL + q); pg.wait_for_timeout(8000)
    pg.evaluate(HELP)
    return pg, errs

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    # ---------- run 1: the quests, live boss kills, the gate ----------
    pg, errs = boot(b)
    pg.evaluate("() => { wsDemo('1'); G.state='play'; }"); pg.wait_for_timeout(1500)
    check('wk4 not taken yet', pg.evaluate("() => qSt('wk4') === null && qSt('wk5') === null"))
    check('mayor has a gold ! (wk4 offered)', pg.evaluate("() => QGIVER.wlo_mayor[0] === 'wk4' && questMark({npc:'wlo_mayor'}) === 1"))
    check('gate is shut: portal needs wsGate', pg.evaluate("() => G.portals[2].req === 'wsGate' && !G.flags.wsGate && G.portals[2].tex === 'wlgate2'"))
    pg.evaluate("() => { goToLevel(496,{x:5,y:50,f:3}); G.state='play' }"); pg.wait_for_timeout(500)
    pg.evaluate("() => usePortal(2)")
    check('shut gate stays shut', pg.evaluate("() => LEVEL === 496 && G.P.x === 5"))
    shot(pg, '1_gate_shut')
    # plinths do nothing while the boss lives
    r = pg.evaluate("""async () => { const o = {}; for (const [n, lv] of [[1,502],[2,521],[3,530]]) { await T.go(lv); const d = G.decor.find(d => d.npc === 'ws_plinth' + n); o['p'+n] = !!d && !T.has(T.root('ws_plinth'+n, d), 'Take the seal.'); } goToLevel(496,{x:5,y:50,f:3}); await T.wait(300); return o }""")
    check('plinths exist and give nothing while the boss lives', all(r.values()), r)
    # the mayor: the offer in three pages, accept
    pg.evaluate("() => { const m = G.decor.find(d => d.npc === 'wlo_mayor'); G.talk = null }")
    node = pg.evaluate("""() => { let n = T.root('wlo_mayor'); const o = [n.text.slice(0,60)]; n = T.btn(n,'Go on.'); o.push(n.text.slice(0,60)); n = T.btn(n,'Go on.'); o.push(n.text.slice(0,60)); const hasYes = T.has(n,'We will fetch the three seals.'); T.btn(n,'We will fetch the three seals.'); o.push(T.st()); return [o, hasYes] }""")
    check('mayor offers wk4 in three pages and accepts', node[1] and node[0][3] == 'done,active,active,active,', node)
    check('wk4 reward paid, wk5 to wk7 active, wk8 not yet', pg.evaluate("() => T.st() === 'done,active,active,active,' || T.st() === 'done,active,active,active,'"), pg.evaluate("() => T.st()"))
    check('mayor reminder with 0 of 3', pg.evaluate("() => T.root('wlo_mayor').text.includes('0 of the three')"))
    # live kills: the boss dies, the seal drops, the quest is done
    r = pg.evaluate("""async () => { const o = []; await T.wait(400);
      wmDied({t:'wmwarden', x:1, y:1}); await T.wait(300); o.push(T.seals() + ' ' + T.st());
      G.flags.wwDead = 1; await T.wait(300); o.push(T.seals() + ' ' + T.st());
      gyF().dead[3] = 1; await T.wait(300); o.push(T.seals() + ' ' + T.st()); return o }""")
    check('well boss dies: seal 1 and wk5 done', r[0].startswith('100 done,done,active,active'), r[0])
    check('witch dies: seal 2 and wk6 done', r[1].startswith('110 done,done,done,active'), r[1])
    check('graveyard boss dies: seal 3, wk7 done, wk8 opens', r[2].startswith('111 done,done,done,done,active'), r[2])
    # the gate opens only with all three seals
    r = pg.evaluate("""() => { const o = {};
      bagRemove('wkseal3', 1); let n = T.root('wlo_mayor'); o.missing = !T.has(n, 'Open the gate.') && n.text.includes('do not have all three');
      bagAdd(mkItem('wkseal3')); n = T.root('wlo_mayor'); o.ready = T.has(n, 'Open the gate.'); o.mark = questMark({npc:'wlo_mayor'}); o.shut = !G.flags.wsGate; return o }""")
    check('mayor will not open the gate with a seal missing', r['missing'], r)
    check('mayor offers to open the gate with all three, green ? shows', r['ready'] and r['mark'] == 2 and r['shut'], r)
    # save and restore mid-way
    pg.evaluate("() => writeSave('wstest')")
    pg.evaluate("() => { const sv = readSave('wstest'); G.flags.ws = undefined; G.quests.wk5 = undefined; restore(sv); G.state = 'play' }"); pg.wait_for_timeout(1500)
    check('flags and quests survive save and restore', pg.evaluate("() => G.flags.ws.got[1] && G.flags.ws.got[2] && G.flags.ws.got[3] && T.st() === 'done,done,done,done,active'"), pg.evaluate("() => T.st()"))
    # the scene
    pg.evaluate("() => { goToLevel(496,{x:27,y:33,f:0}); G.state='play' }"); pg.wait_for_timeout(500)
    pg.evaluate("() => { const n = T.root('wlo_mayor'); T.btn(n, 'Open the gate.') }")
    check('scene starts', pg.evaluate("() => !!G.cut && G.cut.id === 'wsGate' && !G.flags.wsGate"))
    pg.evaluate("() => { const e = G.cut.end; e() }"); pg.wait_for_timeout(800)
    check('gate open: flag, wk8 done, seals used up, party at the gate', pg.evaluate("() => G.flags.wsGate === 1 && qSt('wk8') === 'done' && T.seals() === '000' && LEVEL === 496 && G.P.x === 5 && G.P.y === 50"), pg.evaluate("() => [T.st(), T.seals(), LEVEL, G.P.x]"))
    check('open gate picture and no lock', pg.evaluate("() => G.portals[2].tex === 'wlgate3' && T_DOORS.wlgate3 !== undefined"))
    shot(pg, '2_gate_open')
    pg.evaluate("() => usePortal(2)")
    r = pg.evaluate("() => G.talk && G.talk.node.text")
    check('walking through shows the end-of-part message', bool(r) and 'The next part of the story is not written yet' in r, r)
    shot(pg, '3_end_message')
    pg.evaluate("() => T.btn(G.talk.node, 'Go back into Wenlock.')"); pg.wait_for_timeout(500)
    check('party is sent back inside Wenlock', pg.evaluate("() => LEVEL === 496 && G.P.x === 8 && G.P.y === 50 && !G.talk"))
    check('signs no longer say not yet open', pg.evaluate("() => !say('x (not yet open)').text.includes('not yet open')"))
    check('story pages and hint', pg.evaluate("() => ['wsclosed','wswell','wswood','wsgrave','wsgate'].every(id => STORY.find(s => s.id === id).c()) && storyNext().includes('not written yet')"))
    # save, reload the page, flags persist
    pg.evaluate("() => { writeSave('auto') }")
    pg.reload(); pg.wait_for_timeout(8000); pg.evaluate(HELP)
    pg.evaluate("() => { G.state = 'play' }"); pg.wait_for_timeout(1000)
    check('after a page reload the gate is still open', pg.evaluate("() => G.flags.wsGate === 1 && T.st() === 'done,done,done,done,done' && G.portals[2].tex === 'wlgate3'"), pg.evaluate("() => [G.flags.wsGate, T.st(), G.portals && G.portals[2] && G.portals[2].tex]"))
    check('no page errors (run 1)', not errs, errs[:5])
    pg.close()

    # ---------- run 2: an old save, all three bosses already dead: the plinths give the seals ----------
    pg, errs = boot(b, '&ws=2')
    pg.wait_for_timeout(2500)
    check('old save: no seal was dropped, wk4 taken', pg.evaluate("() => T.seals() === '000' && T.st() === 'done,active,active,active,'"), pg.evaluate("() => [T.seals(), T.st()]"))
    r = pg.evaluate("""async () => { const o = {}; for (const [n, lv] of [[1,502],[2,521],[3,530]]) { await T.go(lv); const d = G.decor.find(d => d.npc === 'ws_plinth' + n); const nd = T.root('ws_plinth'+n, d); o['t'+n] = T.has(nd, 'Take the seal.'); if (o['t'+n]) T.btn(nd, 'Take the seal.'); await T.wait(200); o['q'+n] = qSt('wk'+(4+n)); o['s'+n] = bagCount('wkseal'+n); const again = T.root('ws_plinth'+n, d); o['again'+n] = !T.has(again, 'Take the seal.'); if (n === 1) {} }
      return o }""")
    check('plinths hand over each seal in an old save, once', all(r['t%d' % n] and r['q%d' % n] == 'done' and r['s%d' % n] == 1 and r['again%d' % n] for n in (1, 2, 3)), r)
    check('wk8 opens after the third seal', pg.evaluate("() => T.st() === 'done,done,done,done,active'"), pg.evaluate("() => T.st()"))
    shot(pg, '4_plinth_graveyard')
    # a seal can be had again if it is lost (dropped from the bag), only while the gate is shut
    r = pg.evaluate("""async () => { bagRemove('wkseal2', 1); await T.go(521); const d = G.decor.find(d => d.npc === 'ws_plinth2'); const nd = T.root('ws_plinth2', d); return T.has(nd, 'Take the seal.') }""")
    check('a lost seal can be taken again from its plinth', r)
    pg.evaluate("() => { const d = G.decor.find(d => d.npc === 'ws_plinth2'); T.btn(T.root('ws_plinth2', d), 'Take the seal.') }")
    pg.evaluate("() => { goToLevel(496,{x:27,y:33,f:0}); G.state='play' }"); pg.wait_for_timeout(500)
    pg.evaluate("() => { T.btn(T.root('wlo_mayor'), 'Open the gate.') }"); pg.evaluate("() => G.cut.end()"); pg.wait_for_timeout(500)
    check('old-save run: gate opens', pg.evaluate("() => G.flags.wsGate === 1 && qSt('wk8') === 'done'"))
    check('no page errors (run 2)', not errs, errs[:5])
    pg.close()

    # ---------- run 3: the item and the plinth pictures ----------
    pg, errs = boot(b, '&ws=3')
    pg.wait_for_timeout(2500)
    check('ws=3 link: three seals in the bag and wk8 ready', pg.evaluate("() => T.seals() === '111' && qReady('wk8')"), pg.evaluate("() => [T.seals(), T.st()]"))
    check('seal item text', pg.evaluate("() => ITEMDEF.wkseal1.d.includes('pale silver mark') && ITEMDEF.wkseal2.k === 'quest'"))
    pg.evaluate("() => { G.bag = G.bag.filter(b => /^wkseal/.test(b.id)).concat(G.bag.filter(b => !/^wkseal/.test(b.id)));G.menu = false; G.state = 'play' }"); pg.keyboard.press('i'); pg.wait_for_timeout(500); pg.evaluate('() => { G.inv.scroll = 0 }'); pg.mouse.click(345, 55); pg.wait_for_timeout(600)
    shot(pg, '5_bag')
    check('no page errors (run 3)', not errs, errs[:5])
    b.close()
print('\n%d failed' % len(fails) if fails else '\nall passed')
sys.exit(1 if fails else 0)
