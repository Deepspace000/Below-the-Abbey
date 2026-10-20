"""Makes the comparison picture manual/showcase/button_styles.png: the More page in every button style (every folder of assets/ui, then the old brick).

    python tools/make_button_sheet.py [port=8388] [out=manual/showcase/button_styles.png]

Needs a static server for the game folder on that port (cd to the repo, python -m http.server 8388) and Playwright. Each style is switched on with
G.flags.btnStyle, so the list and the order are exactly what the Gameplay page cycles through (UI_LIST.order, written by tools/inject.py).
"""
import sys, io, os, time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
port = sys.argv[1] if len(sys.argv) > 1 else '8388'
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'manual', 'showcase', 'button_styles.png')
os.makedirs(os.path.dirname(out), exist_ok=True)

def font(sz, bold=True):
    for f in ('georgiab.ttf' if bold else 'georgia.ttf', 'timesbd.ttf', 'times.ttf'):
        try: return ImageFont.truetype('C:/Windows/Fonts/' + f, sz)
        except Exception: pass
    return ImageFont.load_default()

shots, errs = [], []
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 960, 'height': 640})
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto('http://localhost:%s/index.html?town=oldhaven&lvl=34&t=%d' % (port, time.time())); pg.wait_for_timeout(12000)
    pg.evaluate("G.cut=null;G.talk=null;G.menu=null;if(G.inv)G.inv.open=false;G.menu='more'")
    styles = pg.evaluate("stbStyleNames().map(k=>[k,stbStyleLabel(k)])")
    for k, name in styles:
        pg.evaluate("G.flags.btnStyle=%r;G.flags.btnFont='imfell'" % k); pg.wait_for_timeout(1100)
        im = Image.open(io.BytesIO(pg.screenshot())).convert('RGB').crop((214, 18, 746, 626))
        shots.append((im, name + ('|default and recommended' if k == 'gold' else '|style folder: ' + k)))
    b.close()

cols, scale = 5, 0.8
cw, ch = int(shots[0][0].width * scale), int(shots[0][0].height * scale)
pad, cap = 14, 56
rows = (len(shots) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (cw + pad) + pad, rows * (ch + cap + pad) + pad + 56), (24, 20, 16))
d = ImageDraw.Draw(sheet)
d.text((pad, 14), 'Button styles: the More page in every style', font=font(30), fill=(226, 206, 150))
for i, (im, n) in enumerate(shots):
    x = pad + (i % cols) * (cw + pad); y = 56 + pad + (i // cols) * (ch + cap + pad)
    sheet.paste(im.resize((cw, ch), Image.LANCZOS), (x, y))
    nm, _, note = n.partition('|')
    tw = d.textlength(nm, font=font(22)); d.text((x + (cw - tw) / 2, y + ch + 6), nm, font=font(22), fill=(236, 220, 170))
    if note:
        tw = d.textlength(note, font=font(17, False)); d.text((x + (cw - tw) / 2, y + ch + 30), note, font=font(17, False), fill=(190, 170, 120))
sheet.save(out)
print('saved', out, sheet.size, 'styles', len(shots), 'errors', errs)
