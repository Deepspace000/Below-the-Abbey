"""Black and white gameplay screenshots for the manual.
    from shotlib import Game
    with Game() as g:
        g.go(304, 40, 20, 0)                 # level, x, y, facing (0 N, 1 E, 2 S, 3 W)
        g.shot('quay_gate')                  # 3D view only, B&W  -> manual/img/shots/quay_gate.png
        g.shot('quay_ui', ui=True)           # the whole game window with the HUD, B&W
        g.js("G.menu='inv'")                 # run any JS in the game (G is the game state; see index.html)
        g.shot('menu', ui=True)
Needs the game served at http://localhost:8399/ (cd Below-the-Abbey && python -m http.server 8399). Check with curl first.
Tips: wait after moving (the camera eases in, go() already waits 2.5 s). The camera must be set with the facing: go() does it.
Never stand inside a solid cell or a market stall (blurry grey picture); check the shot with Read before you use it."""
import os, io
from PIL import Image, ImageOps, ImageEnhance
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'img', 'shots')
os.makedirs(OUT, exist_ok=True)
class Game:
    def __init__(self, url='http://localhost:8399/index.html?town=oldhaven&lvl=34', size=(1100, 800)):
        self.url, self.size = url, size
    def __enter__(self):
        self.pw = sync_playwright().start()
        self.b = self.pw.chromium.launch()
        self.pg = self.b.new_page(viewport={'width': self.size[0], 'height': self.size[1]})
        self.pg.goto(self.url); self.pg.wait_for_timeout(12000)
        self.clear()
        return self
    def __exit__(self, *a):
        self.b.close(); self.pw.stop()
    def js(self, code):
        return self.pg.evaluate(code)
    def clear(self):
        self.pg.evaluate("G.cut=null;G.talk=null;G.menu=null;if(G.inv)G.inv.open=false")
    def go(self, level, x, y, f=0, wait=2500):
        self.pg.evaluate("goToLevel(%d,{x:%d,y:%d,f:%d})" % (level, x, y, f))
        self.pg.wait_for_timeout(1500); self.clear()
        self.pg.evaluate("G.P.x=%d;G.P.y=%d;G.P.f=%d;G.P.angT=(%d-1)*Math.PI/2;G.C={x:%d,y:%d,a:G.P.angT}" % (x, y, f, f, x, y))
        self.pg.wait_for_timeout(wait)
    def shot(self, name, ui=False, contrast=1.1):
        clip = None if ui else {'x': 0, 'y': 30, 'width': 965, 'height': 490}
        png = self.pg.screenshot(clip=clip)
        im = Image.open(io.BytesIO(png)).convert('L')
        im = ImageEnhance.Contrast(im).enhance(contrast)
        p = os.path.join(OUT, name + '.png'); im.save(p); return p
