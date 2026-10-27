"""cuts the Witch's Wood texture sheet (3 x 2 portrait cells) into six seamless 256 squares: assets/ww/tex_0..5.jpg  python tools/ww_tex.py <sheet.jpg>"""
import sys, json, pathlib
import numpy as np
from PIL import Image
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ww'
im = Image.open(sys.argv[1]).convert('RGB'); W, H = im.size
cw, ch = W // 3, H // 2
man = json.loads((OUT / 'manifest.json').read_text())
for k in range(6):
    ci, rj = k % 3, k // 3
    x0, y0 = ci * cw, rj * ch
    m = int(cw * .04); s = cw - 2 * m
    top = (ch - s) // 2
    if k == 3: top = ch - s - m
    crop = im.crop((x0 + m, y0 + top, x0 + m + s, y0 + top + s)).resize((256, 256), Image.LANCZOS)
    a = np.array(crop).astype(float); u = np.linspace(0, 1, 256)
    wx = (1 - np.abs(2 * u - 1))[None, :]; wy = (1 - np.abs(2 * u - 1))[:, None]
    r_ = np.roll(a, (128, 128), (0, 1)); wm = (wx * wy)[..., None]
    Image.fromarray((a * wm + r_ * (1 - wm)).clip(0, 255).astype(np.uint8)).save(OUT / ('tex_%d.jpg' % k), quality=90)
    man['tex_%d' % k] = {'file': 'tex_%d.jpg' % k, 'w': 256, 'h': 256, 'kind': 'tex', 'sheet': 'tex'}
(OUT / 'manifest.json').write_text(json.dumps(man, indent=0)); print('ok')
