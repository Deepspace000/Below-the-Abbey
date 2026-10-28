"""Shared helpers for the quest ring harness. Needs your OWN server: python -m http.server 8359 from the repo root."""
import os, time, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('QR_PORT', '8359')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots')
os.makedirs(OUT, exist_ok=True)
URL = 'http://localhost:%s/index.html?town=oldhaven&lvl=55&v=%d' % (PORT, time.time())

def boot(p, w=960, h=640):
    b = p.chromium.launch(channel='chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e) + ' ' + str(getattr(e,'stack','') or '')[:400]))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto(URL, wait_until='domcontentloaded', timeout=240000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'", timeout=300000)
    pg.wait_for_timeout(2000)
    return b, pg, errs
