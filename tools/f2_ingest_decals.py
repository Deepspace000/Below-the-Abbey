"""Cuts a Gemini sheet of ground decals (pieces on flat magenta, a cols x rows grid) into soft-edged decals for the floor of the
Pale Spire's second floor (src/desert/ps_f2_kit.js, f2 decal layer). Each piece is keyed out of the magenta, cropped to a square round
its middle, its edge feathered (a soft ragged fade, so it never reads as a tile laid on the ground), saved as assets/ps/f2_dc_<name>_<k>.webp
and listed in assets/ps/manifest.json (kind 'decal').

    python tools/f2_ingest_decals.py <sheet> <name> [cols=4 rows=4] [first=0] [names=a,b,...] [size=192] [feather=.22] [skip=3,7]
"""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter

src, name = sys.argv[1], sys.argv[2]
opts = dict(a.split('=') for a in sys.argv[3:] if '=' in a)
cols, rows = int(opts.get('cols', 4)), int(opts.get('rows', 4))
SIZE = int(opts.get('size', 192)); FEA = float(opts.get('feather', .22))
names = opts['names'].split(',') if 'names' in opts else None
skip = set(int(v) for v in opts.get('skip', '').split(',') if v)
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ps'
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text())
im = Image.open(src).convert('RGB'); A = np.asarray(im).astype(np.float32)
H, W = A.shape[:2]
rng = np.random.default_rng(7)


def magness(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g   # how magenta a pixel is
    return np.clip((m - 40) / 70, 0, 1) * (np.abs(r - b) < 110)


k = 0
for j in range(rows):
    for i in range(cols):
        idx = j * cols + i
        if idx in skip:
            continue
        cell = A[int(j * H / rows):int((j + 1) * H / rows), int(i * W / cols):int((i + 1) * W / cols)]
        mg = magness(cell); fg = mg < .5
        ys, xs = np.nonzero(fg)
        if len(xs) < 200:
            continue
        y0, y1, x0, x1 = np.percentile(ys, 1), np.percentile(ys, 99), np.percentile(xs, 1), np.percentile(xs, 99)
        cy, cx, r = (y0 + y1) / 2, (x0 + x1) / 2, max(y1 - y0, x1 - x0) / 2 + 4
        Y0, X0 = int(max(0, cy - r)), int(max(0, cx - r)); Y1, X1 = int(min(cell.shape[0], cy + r)), int(min(cell.shape[1], cx + r))
        c = cell[Y0:Y1, X0:X1].copy(); m = 1 - magness(c)
        # remove the magenta fringe from the colours: pull pinkish edge pixels towards their green-neutral version
        fr = (m < .95)[..., None]
        neu = c.copy(); neu[..., 0] = np.minimum(c[..., 0], c[..., 1] * 1.15 + 10); neu[..., 2] = np.minimum(c[..., 2], c[..., 1] * 1.15 + 10)
        c = np.where(fr, neu, c)
        # soft ragged feather: blur the mask, then an irregular radial fade so the outline is never a tile edge
        h, w = m.shape
        mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(max(2, w * .02)))
        m = np.asarray(mi).astype(np.float32) / 255
        yy, xx = np.mgrid[0:h, 0:w]; ang = np.arctan2(yy - h / 2, xx - w / 2); rr = np.hypot((yy - h / 2) / (h / 2), (xx - w / 2) / (w / 2))
        ph = rng.uniform(0, 6.28, 3)
        edge = 1 - FEA * (.6 + .25 * np.sin(ang * 3 + ph[0]) + .15 * np.sin(ang * 7 + ph[1]) + .1 * np.sin(ang * 13 + ph[2]))
        fade = np.clip((edge - rr) / FEA, 0, 1); fade = fade * fade * (3 - 2 * fade)
        a = np.clip(m * fade, 0, 1)
        out = np.dstack([np.clip(c, 0, 255), a * 255]).astype(np.uint8)
        pic = Image.fromarray(out, 'RGBA').resize((SIZE, SIZE), Image.LANCZOS)
        nm = 'f2_dc_%s_%s' % (name, names[k] if names and k < len(names) else str(k))
        pic.save(OUT / (nm + '.webp'), quality=88)
        man[nm] = {'file': nm + '.webp', 'w': SIZE, 'px_h': SIZE, 'h': .5, 'kind': 'decal', 'sheet': pathlib.Path(src).stem}
        print(nm)
        k += 1
MAN.write_text(json.dumps(man, indent=0))
