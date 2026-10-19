"""Preview ONE chapter on its own:  python preview.py chapters/03_gear.html
Writes _preview/03_gear/page_01.png ... (and a contact sheet sheet.png) so you can look at the pages with the Read tool.
It never touches the shared book files, so several people can run it at once."""
import os, sys, shutil
from playwright.sync_api import sync_playwright
import pymupdf
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
src = os.path.abspath(sys.argv[1]); name = os.path.splitext(os.path.basename(src))[0]
out = os.path.join(HERE, '_preview', name); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
tmp = os.path.join(HERE, '_preview_%s.html' % name)
body = open(src, encoding='utf-8').read()
open(tmp, 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="manual.css"></head><body>%s</body></html>' % body)
pdf = os.path.join(out, 'chapter.pdf')
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); pg.goto('file:///' + tmp.replace(chr(92), '/')); pg.wait_for_timeout(2500)
    pg.pdf(path=pdf, width='6in', height='9in', print_background=True, prefer_css_page_size=True); b.close()
os.remove(tmp)
d = pymupdf.open(pdf); ims = []
for i, pgx in enumerate(d):
    f = os.path.join(out, 'page_%02d.png' % (i + 1)); pgx.get_pixmap(dpi=80).save(f); ims.append(Image.open(f))
cols = 4; w, h = ims[0].size; rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (w * cols, h * rows), (120, 120, 120))
for i, im in enumerate(ims): sh.paste(im, ((i % cols) * w, (i // cols) * h))
sh.save(os.path.join(out, 'sheet.png')); print(len(d), 'pages ->', out)
