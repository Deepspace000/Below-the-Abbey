"""Helpers for testing spell animations with Playwright (server: python -m http.server 8356 from the repo root).
The game loop is paused and stepped by hand (16.7 ms per step) so frames can be captured at exact times after a cast."""
import time, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
OUT = ROOT / 'tools' / 'spellfx'
URL = 'http://localhost:8356/index.html?town=ironhill&lvl=8&v=%d'

SETUP = """() => {
  window.__rafOff = true; window.requestAnimationFrame = () => 0;
  window.__t = window.__t || performance.now();
  window.__step = n => { for (let i = 0; i < n; i++) { window.__t += 1000/60; frame(window.__t); } };
  window.__setup = (opt) => {
    // opt: {foes:[[type,k,side,hp]], hero, lvl}
    G.enemies.length = 0; G.floats.length = 0; G.msgs.length = 0; try { G.lvlBanners.length = 0 } catch (e) {}
    for (const f of opt.foes || []) { const d = DIRS[G.P.f], k = f[1], sd = f[4] || 0; let ex = G.P.x + d[0] * k - d[1] * sd, ey = G.P.y + d[1] * k + d[0] * sd; if (cellBlocked(ex, ey)) { ex = G.P.x + d[0] * k; ey = G.P.y + d[1] * k } addEnemy(f[0], ex, ey, true); const e = G.enemies[G.enemies.length - 1]; if (f[3]) { e.hp = e.maxhp = f[3] } }
    for (const h of G.heroes) { h.mp = 9999; h.mpMax = 9999; h.alive = true; h.hp = h.max; h.lvl = Math.max(h.lvl, 60) }
    G.acted = [false, false, false, false]; G.buffs = []; G.timers.length = 0;
    SPFX.fx.length = 0; SPFX.obj.length = 0; SPFX.fl.length = 0; SPFX.tint.clear(); SPFX.held.clear(); for (const p of SPP) p.a = 0;
    G.shake = 0; window.__step(3);
  };
  window.__cast = (hi, id, hurt, dead) => {
    const h = G.heroes[hi];
    if (dead) { G.heroes[3].alive = false; G.heroes[3].hp = 0 }
    if (hurt) for (const g of G.heroes) { g.hp = Math.max(1, Math.round(g.max * hurt)) }
    if (id.startsWith('sp:')) { const k = id.slice(3); h.eq.s0 = {id: k === 'fire' ? 'sp_fire' : k === 'frost' ? 'scrollFrost' : 'scrollLight', n: 1}; h.spellSel = 0; h.powSel = 0 }
    else { if (id.startsWith('pw:')) { const nm0 = id.slice(3); const ci = CLASSES.findIndex(c => c.powers.some(p => p.name === nm0)); if (ci >= 0) { HERO_DEF[hi].clsId = ci; HERO_DEF[hi].cls = CLASSES[ci].name } }
      if (!id.startsWith('pw:')) { h.learned = h.learned || []; if (!h.learned.includes(id)) h.learned.push(id) }
      const PW = heroPowers(hi); const nm = id.startsWith('pw:') ? id.slice(3) : null; const idx = PW.findIndex(p => nm ? p.name === nm : p.mx === id); if (idx < 0) return 'nopower'; h.powSel = idx; h.lvl = Math.max(h.lvl, PW[idx].lv || 1) }
    h.mp = 9999; h.alive = true;
    const hp0 = G.enemies.map(e => e.hp);
    const r = heroSpecial(hi); return r ? 'ok' : 'fail';
  };
}"""

class Game:
    def __init__(self, headless=True):
        self.p = sync_playwright().start()
        self.b = self.p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'], headless=headless)
        self.pg = self.b.new_page(viewport={'width': 1000, 'height': 700})
        self.logs = []
        self.pg.on('console', lambda m: self.logs.append((m.type, m.text)) if m.type == 'error' and 'ERR_CONNECTION' not in m.text and 'Failed to load resource' not in m.text else None)
        self.pg.on('pageerror', lambda e: self.logs.append(('pageerror', str(e))))
        self.pg.goto(URL % time.time(), wait_until='commit', timeout=120000)
        self.pg.wait_for_function('window.__ready', timeout=400000)
        self.pg.wait_for_timeout(7000)
        self.pg.evaluate(SETUP)
        last, same = None, 0
        for i in range(40):  # the town jump of the url finishes after some frames: step until the level stays the same
            r = self.ev("()=>{try{__step(8)}catch(e){return 'err'}return LEVEL+':'+G.state+':'+G.enemies.length}")
            same = same + 1 if r == last and r != 'err' else 0
            last = r
            if same >= 3: break
    def ev(self, js, arg=None):
        return self.pg.evaluate(js, arg) if arg is not None else self.pg.evaluate(js)
    def step(self, n=1): self.ev('n=>window.__step(n)', n)
    def box(self):
        return self.ev("()=>{const r=cv.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}")
    def shot(self, region='view'):
        """returns PNG bytes of the game area: 'view' = the 3D view (0..420 x 0..210), 'hud' = view plus portraits (0..420 x 0..300)"""
        x, y, w, h = self.box(); s = w / 480
        H = 210 if region == 'view' else 300
        return self.pg.screenshot(clip={'x': x, 'y': y, 'width': 420 * s, 'height': H * s})
    def close(self):
        self.b.close(); self.p.stop()
