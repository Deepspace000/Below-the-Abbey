"""Cuts a Gemini sheet of flame frames painted on pure black into assets/ep/flame_<n>.webp for the painted wall torch
(src/desert/early_polish.js). The frames keep their black ground: the game draws them with 'screen', so black adds nothing and the
flame stays soft and see-through. All frames share one crop box (the union of what is lit), so the flame stands on one baseline.

    python tools/ep_ingest_flames.py <sheet> cols rows [n=6] [px=192] [thr=14]
"""
import sys, json, pathlib
import numpy as np
from PIL import Image

src, cols, rows = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
opts = dict(a.split('=', 1) for a in sys.argv[4:] if '=' in a)
n, PX, THR = int(opts.get('n', cols * rows)), int(opts.get('px', 192)), float(opts.get('thr', 14))
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ep'
LST = OUT / 'list.json'
lst = json.loads(LST.read_text()) if LST.exists() else {}
A = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H, W = A.shape[:2]
cells = []
for j in range(rows):
    for i in range(cols):
        c = A[int(j * H / rows):int((j + 1) * H / rows), int(i * W / cols):int((i + 1) * W / cols)]
        my, mx = int(c.shape[0] * .06), int(c.shape[1] * .08)
        c = c[my:-my, mx:-mx].copy()
        c[(c.min(2) > 120) | ((c.max(2) - c.min(2)) < 22)] = 0   # white or grey sheet borders and gaps are not flame
        cells.append(c)
ch, cw = min(c.shape[0] for c in cells), min(c.shape[1] for c in cells)
cells = [c[:ch, :cw] for c in cells[:n]]
lit = np.zeros((ch, cw), bool)
for c in cells:
    lit |= c.max(2) > THR
ys, xs = np.nonzero(lit)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
cx = (x0 + x1) // 2; half = max(cx - x0, x1 - cx) + 4
x0, x1 = max(0, cx - half), min(cw, cx + half)
for k, c in enumerate(cells):
    a = c[max(0, y0 - 4):y1, x0:x1].copy()
    a[a.max(2) < THR * .6] = 0   # a clean black ground
    im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    if im.height > PX:
        im = im.resize((max(1, round(im.width * PX / im.height)), PX), Image.LANCZOS)
    fn = 'flame_%d.webp' % k
    im.save(OUT / fn, quality=92)
    lst['flame_%d' % k] = {'file': fn, 'w': im.width, 'h': im.height, 'kind': 'flame', 'sheet': pathlib.Path(src).stem}
    print(fn, im.size)
LST.write_text(json.dumps(lst, indent=0))
