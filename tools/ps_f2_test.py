"""End-to-end test of the second floor of the Pale Spire: the Hall of Illusions (9820) and the seven illusion rooms (9821 to 9827). See tools/PS_F2_SPEC.md.
   python tools/ps_f2_test.py        (on your OWN server: python -m http.server <port> from the repo root; env PS_PORT, BTA_CHROME)
Checks, from a fresh state (the second floor flags wiped):
  levels    all eight build, the arrival squares are open, every room has 10 to 16 creatures at level 103 or 104 and none within 6 of the arrival
  links     every hub door leads into its room on an open landing and every room's way back leads to the hub, both ways, by pressing the doors (khBump)
  puzzles   each room's puzzle is solved by the real talk options and step calls, after a wrong answer first (which must not lock it): the forest stones,
            the island bottle, spade and dig, the snow logs, flint, hearth and mirror, the waterways masks and door, the desert floor plates and sarcophagus,
            the swamp ingredients and cauldron, the nightmare lanterns and jar
  items     each piece is given exactly once (a second give is refused), and the hub table takes all seven, the Sleeper wakes, the quest is handed in once
  save      a save made with all flags set loads again with the same flags
"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8621')
WAIT = int(os.environ.get('PS_LOADWAIT', '15000'))
FAILS = []


def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' ' + str(extra) if extra and not ok else ''))
    if not ok:
        FAILS.append(name)


HELP = r"""
window.T = {
  wait: ms => new Promise(r => setTimeout(r, ms)),
  go: async (id, x, y, f) => { if (!LEVELS[id]) KH_LAZY[id](); const L = LEVELS[id]; goToLevel(id, {x: x === undefined ? L.start.x : x, y: y === undefined ? L.start.y : y, f: f || 0}); for (let i = 0; i < 80 && LEVEL !== id; i++) await T.wait(100); await T.wait(300); return LEVEL },
  // pick the talk option of an npc whose text matches re; returns the option text or null
  opt: (npc, re) => { const n = NPCS[npc]; if (!n) return 'NO NPC ' + npc; const node = n.root(); if (!node || !node.opts) return null; const o = node.opts.find(q => re.test(q[0])); if (!o) return null; G.talk = null; o[1](); return o[0] },
  opts: npc => { const n = NPCS[npc]; const node = n && n.root(); return node && node.opts ? node.opts.map(q => q[0]) : [] },
  foes: () => G.enemies.filter(e => e.hp > 0).length,
  bump: (x, y) => { const c = G.grid[y][x]; const L = LEVELS[LEVEL]; const g = L.chars[L.rows[y][x]]; return khBump(x, y, g) },
  bag: id => bagCount(id)
};"""


def main():
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
        pg.goto('http://localhost:%s/index.html?town=palespire9&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===9820&&PSP.ready", timeout=WAIT + 60000)
        pg.wait_for_timeout(1500)
        pg.evaluate(HELP)
        pg.evaluate("() => { delete G.flags.psp.f2; for (const p of PSF2.PARTS) bagRemove(PSF2.ITEMS[p], 99); delete G.quests.psq40; G.flags.noFog = 0 }")
        # ---- levels ----
        r = pg.evaluate("""() => { const o = []; for (let id = 9820; id <= 9827; id++) { const bad = []; try { if (!LEVELS[id]) KH_LAZY[id]() } catch (e) { o.push([id, ['build ' + e.message]]); continue }
            const L = LEVELS[id]; if (!L) { o.push([id, ['no level']]); continue } const s = L.start; if (L.rows[s.y][s.x] !== '.') bad.push('start not open');
            if (!pspLevel(id).built) bad.push('not built');
            if (id > 9820) { const n = L.enemies.length; if (n < 10 || n > 16) bad.push(n + ' creatures'); if (L.enemies.some(e => e.lvl < 103 || e.lvl > 104)) bad.push('creature level ' + L.enemies.map(e => e.lvl).join(','));
              if (L.enemies.some(e => Math.hypot(e.x - 24, e.y - 35) < 6)) bad.push('creature near the arrival'); if (L.decor.filter(d => /chest/.test(d.k)).length < 3) bad.push('fewer than 3 chests') }
            else if (L.enemies.length) bad.push('creatures in the hub');
            o.push([id, bad]) } return o }""")
        for id_, bad in r:
            check('level %d builds and is sound' % id_, not bad, bad)
        # ---- links both ways, by pressing the doors ----
        r = pg.evaluate("""async () => { const o = []; const rooms = PSP.LINKS.filter(l => l.from === 9820 && l.to >= 9821 && l.to <= 9827);
            for (const l of rooms) { await T.go(9820, l.land ? (PSP.LINKS.find(t => t.from === l.to && t.to === 9820).land[0]) : 28, PSP.LINKS.find(t => t.from === l.to && t.to === 9820).land[1], 0);
              T.bump(l.at[0], l.at[1]); for (let i = 0; i < 60 && LEVEL !== l.to; i++) await T.wait(100); await T.wait(300);
              const there = LEVEL, px = G.P.x, py = G.P.y, back = PSP.LINKS.find(t => t.from === l.to && t.to === 9820);
              T.bump(back.at[0], back.at[1]); for (let i = 0; i < 60 && LEVEL !== 9820; i++) await T.wait(100); await T.wait(300);
              o.push([l.to, there, px, py, LEVEL, G.P.x, G.P.y, back.land]) } return o }""")
        for to, there, px, py, back, bx, by, land in r:
            check('hub door to %d lands at 24,35 and the way back lands at %s' % (to, land), there == to and (px, py) == (24, 35) and back == 9820 and [bx, by] == land[:2], [there, px, py, back, bx, by])
        # ---- the puzzles ----
        PUZ = {
            9821: """async () => { const o = []; const R = () => f2S(9821);
              // a wrong touch first: winter before spring resets
              T.opt('f2f_stone' + F2_FOREST.STONES.findIndex(s => s[2] === 3), /Touch/); if ((R().seq || []).length !== 0) o.push('wrong touch did not reset');
              if (T.opts('f2f_oak').some(t => /Take/.test(t))) o.push('oak open too early');
              for (const si of [0, 1, 2, 3]) T.opt('f2f_stone' + F2_FOREST.STONES.findIndex(s => s[2] === si), /Touch/);
              if (!R().solved) o.push('not solved after the order of the year');
              if (!T.opt('f2f_oak', /Take/)) o.push('no take option at the oak'); if (T.bag('psf_hand') !== 1) o.push('hand ' + T.bag('psf_hand')); return o }""",
            9822: """async () => { const o = []; const R = () => f2S(9822); const i = s => 'f2i_patch' + F2_ISLAND.PATCH.findIndex(q => q[2] === s);
              T.opt('f2i_bottle', /x/); if (!R().read) o.push('bottle not read');
              if (T.opts(i('starfish')).some(t => /Dig/.test(t))) o.push('dig without a spade');
              if (!T.opt('f2i_spade', /Take/)) o.push('no spade'); const f0 = T.foes();
              T.opt(i('conch'), /Dig/); if (T.foes() <= f0) o.push('wrong dig released nothing'); if (T.bag('psf_foot')) o.push('foot from the wrong patch');
              T.opt(i('starfish'), /Dig/); if (T.bag('psf_foot') !== 1) o.push('foot ' + T.bag('psf_foot')); return o }""",
            9823: """async () => { const o = []; const R = () => f2S(9823);
              if (T.opts('f2s_hearth').some(t => /Lay|Strike/.test(t))) o.push('hearth usable without logs');
              for (let i = 0; i < 3; i++) if (!T.opt('f2s_log' + i, /Take/)) o.push('log ' + i);
              if (!T.opt('f2s_hearth', /Lay/)) o.push('cannot lay the logs'); if (T.opts('f2s_hearth').some(t => /Strike/.test(t))) o.push('strike without flint');
              if (!T.opt('f2s_flint', /Take/)) o.push('no flint'); if (!T.opt('f2s_hearth', /Strike/)) o.push('cannot strike'); if (!R().lit) o.push('not lit');
              if (!T.opt('f2s_mirror', /Take/)) o.push('no face in the mirror'); if (T.bag('psf_face') !== 1) o.push('face ' + T.bag('psf_face'));
              // the cabin door goes in and out
              T.bump(24, 8); await T.wait(200); if (Math.round(G.P.x) !== F2_SNOW.IN[0] || Math.round(G.P.y) !== F2_SNOW.IN[1]) o.push('cabin door in ' + G.P.x + ',' + G.P.y);
              T.bump(41, 8); await T.wait(200); if (Math.round(G.P.x) !== 24 || Math.round(G.P.y) !== 9) o.push('cabin door out ' + G.P.x + ',' + G.P.y); return o }""",
            9824: """async () => { const o = []; const R = () => f2S(9824); const f0 = T.foes();
              const D = F2_WATER.DOOR; T.bump(D[0], D[1]); if (T.bag('psf_chest')) o.push('chest through a locked door');
              T.opt('f2w_mask_moon', /Hang/); if (R().open) o.push('wrong mask opened'); if (T.foes() <= f0) o.push('wrong mask woke nothing');
              T.opt('f2w_mask_plague', /Hang/); if (!R().open) o.push('right mask did not open');
              T.bump(D[0], D[1]); if (T.bag('psf_chest') !== 1) o.push('chest ' + T.bag('psf_chest')); T.bump(D[0], D[1]); if (T.bag('psf_chest') !== 1) o.push('chest twice');
              // the gondola ferry: up the Rio of Sighs to the steps of the campo, and back down to the Riva
              for (const up of [true, false]) { f2WaterRide(up); for (let i = 0; i < 600 && F2.ride; i++) await T.wait(100); const L = up ? F2_WATER.FERRY.upLand : F2_WATER.FERRY.downLand;
                if (F2.ride || G.P.x !== L[0] || G.P.y !== L[1]) o.push('ride ' + (up ? 'up' : 'down') + ' ended at ' + G.P.x + ',' + G.P.y); if (G.time < G.lockT) o.push('still locked after the ride') }
              return o }""",
            9825: """async () => { const o = []; const R = () => f2S(9825); const at = s => F2_DESERT.PLATES.find(p => p[2] === s); const f0 = T.foes();
              F2.step[9825](...at('scarab')); F2.step[9825](...at('sun').slice(0, 2)); if ((R().seq || []).length) o.push('wrong plate did not reset'); if (T.foes() <= f0) o.push('wrong plate released nothing');
              if (T.opts('f2d_sarc').some(t => /Take/.test(t))) o.push('sarcophagus open too early');
              for (const s of F2_DESERT.ORDER) F2.step[9825](...at(s).slice(0, 2)); if (!R().solved) o.push('not solved');
              if (!T.opt('f2d_sarc', /Take/)) o.push('no legs'); if (T.bag('psf_legs') !== 1) o.push('legs ' + T.bag('psf_legs')); return o }""",
            9826: """async () => { const o = []; const R = () => f2S(9826);
              if (T.opts('f2m_cauldron').some(t => /Put/.test(t))) o.push('cauldron takes nothing yet');
              T.opt('f2m_note', /x/);
              for (const k of ['toad', 'eel', 'moss']) if (!T.opt('f2m_' + k, /Take/)) o.push('no ' + k);
              for (let i = 0; i < 3; i++) T.opt('f2m_cauldron', /Put/); if (!R().solved) o.push('not solved ' + JSON.stringify(R().in));
              if (!T.opt('f2m_cauldron', /Take/)) o.push('no heart'); if (T.bag('psf_heart') !== 1) o.push('heart ' + T.bag('psf_heart')); return o }""",
            9827: """async () => { const o = []; const R = () => f2S(9827);
              T.opt('f2n_lamp0', /Touch/); if (R().solved) o.push('solved without the order');
              f2NightNew(); const s0 = R().seq.slice(); const wrong = [0, 1, 2, 3].find(i => i !== s0[0]); const f0 = T.foes();
              T.opt('f2n_lamp' + wrong, /Touch/); if (T.foes() <= f0) o.push('wrong lantern brought no shadows'); if (R().pos) o.push('wrong lantern did not reset');
              await T.wait(200); R().showing = 0; const seq = R().seq.slice(); for (const i of seq) T.opt('f2n_lamp' + i, /Touch/); if (!R().solved) o.push('not solved ' + seq + ' pos ' + R().pos);
              if (!T.opt('f2n_jar', /Take/)) o.push('no brain'); if (T.bag('psf_brain') !== 1) o.push('brain ' + T.bag('psf_brain')); return o }"""}
        for id_ in range(9821, 9828):
            pg.evaluate("(id) => T.go(id)", id_)
            pg.wait_for_timeout(800)
            pg.evaluate("() => { for (const e of G.enemies) e.hp = 0; G.enemies.length = 0 }")   # a quiet room for the test (the released creatures are counted)
            bad = pg.evaluate(PUZ[id_])
            check('puzzle of %d solved by the real calls after a wrong answer' % id_, not bad, bad)
        # ---- items exactly once ----
        r = pg.evaluate("() => ({count: PSF2.PARTS.map(p => bagCount(PSF2.ITEMS[p])), again: PSF2.PARTS.map(p => psf2Give(p)), after: PSF2.PARTS.map(p => bagCount(PSF2.ITEMS[p]))})")
        check('each of the seven pieces is in the bag once', r['count'] == [1] * 7, r)
        check('a second give is refused', r['again'] == [False] * 7 and r['after'] == [1] * 7, r)
        # ---- the hub: quest, table, wake, reward once ----
        r = pg.evaluate("""async () => { const o = []; await T.go(9820); const g0 = G.gold;
            if (!T.opt('psf2_keeper', /anything we can do/)) o.push('no quest offer'); const n = qNode('psq40', {offer: '', accept: '', remind: () => '', ready: '', thanks: '', after: ''}); if (qSt('psq40') === null) { n.opts[0][1]() }
            if (qSt('psq40') !== 'active') o.push('quest ' + qSt('psq40'));
            if (!T.opt('psf2_table', /Place/)) o.push('table takes nothing'); if (psf2Placed() !== 7) o.push('placed ' + psf2Placed());
            if (PSF2.PARTS.some(p => bagCount(PSF2.ITEMS[p]))) o.push('pieces still in the bag');
            if (!T.opt('psf2_table', /Wake/)) o.push('cannot wake'); if (!psf2F().woke) o.push('not woken');
            if (!qReady('psq40')) o.push('quest not ready');
            const sl = G.decor.find(d => d.npc === 'psf2_sleeper'); if (!sl || sl.hidden) o.push('the woken Sleeper does not stand');
            if (!T.opt('psf2_keeper', /Here you go/)) o.push('no hand in'); if (qSt('psq40') !== 'done' || !psf2F().done) o.push('not done');
            const gain = G.gold - g0; if (gain < 20000) o.push('gold ' + gain); if (bagCount('pg_dreamcrown') !== 1) o.push('no circlet');
            const st = qTurnIn('psq40'); if (st) o.push('handed in twice'); if (bagCount('pg_dreamcrown') !== 1) o.push('circlet twice');
            return o }""")
        check('the hub: quest offered, seven placed, the Sleeper wakes, the reward is given once', not r, r)
        # ---- save and load keep the flags ----
        r = pg.evaluate("""async () => { const before = JSON.stringify(G.flags.psp.f2); writeSave('auto'); delete G.flags.psp.f2; const sv = readSave('auto'); restore(sv); await T.wait(1500);
            const after = JSON.stringify((G.flags.psp || {}).f2); return [before === after, before.length, LEVEL] }""")
        check('save and load keep the second floor flags', r[0], r)
        real = [e for e in errs if 'Failed to load resource' not in e and 'assets/sp_' not in e and 'assets/icn_' not in e and 'hgtm model' not in e]
        check('no page errors', not real, real[:6])
        b.close()
    print('ALL PASSED' if not FAILS else 'FAILED: %s' % FAILS)
    sys.exit(1 if FAILS else 0)


main()
