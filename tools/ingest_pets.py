"""Cuts a pet sheet (six animals in columns, the same animal repeated down each column in different poses, on flat magenta) into
assets/pet_<id>_0.png and assets/pet_<id>_1.png, the first two poses found in each column, on a square canvas.

    python tools/ingest_pets.py <sheet.jpg> goat,llama,frog,duck,cat,dog [size=192] [dir=assets]
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
src, ids = sys.argv[1], sys.argv[2].split(',')
opts = dict(a.split('=') for a in sys.argv[3:] if '=' in a)
SIZE = int(opts.get('size', 192)); OUT = pathlib.Path(opts.get('dir', pathlib.Path(__file__).resolve().parent.parent / 'assets'))
im = Image.open(src).convert('RGB'); a = np.array(im).astype(int); H, W = a.shape[:2]
r, g, b = a[..., 0], a[..., 1], a[..., 2]
fg = ~((g < np.minimum(r, b) - 55) & (r > 120) & (b > 120))
def runs(profile, mingap, minlen):
    out = []; start = None; gap = 0; last = 0
    for i, v in enumerate(profile):
        if v:
            if start is None: start = i
            gap = 0; last = i
        elif start is not None:
            gap += 1
            if gap >= mingap:
                if last - start >= minlen: out.append((start, last))
                start = None
    if start is not None and last - start >= minlen: out.append((start, last))
    return out
def core(sub):
    """x range of the biggest solid piece in sub (a boolean array): small stray bits from neighbours are dropped"""
    prof = sub.sum(axis=0); spans = runs(prof > 1, 8, 3)
    if not spans: return 0, sub.shape[1] - 1
    best = max(spans, key=lambda sp: prof[sp[0]:sp[1] + 1].sum())
    return best
PAIRS = {}
def keyed(cimg):
    ca = np.array(cimg).astype(int); cr, cg, cb = ca[..., 0], ca[..., 1], ca[..., 2]
    key = (cg < np.minimum(cr, cb) - 55) & (cr > 120) & (cb > 120)
    mask = Image.fromarray(np.where(key, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
    ca[..., 0] = np.minimum(cr, np.maximum(cg, 40) + 120); ca[..., 2] = np.minimum(cb, np.maximum(cg, 40) + 120)
    rgb = Image.fromarray(ca.clip(0, 255).astype(np.uint8)).convert('RGBA'); rgb.putalpha(mask); return rgb
def save_pairs():
    for pid, fr in PAIRS.items():
        sc = min((SIZE - 6) / max(f.size) for f in fr.values())   # both poses at the same scale, feet on the floor of the canvas
        for f, rgb in fr.items():
            w, h = rgb.size; rgb = rgb.resize((max(1, round(w * sc)), max(1, round(h * sc))), Image.LANCZOS)
            canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0)); canvas.paste(rgb, ((SIZE - rgb.width) // 2, SIZE - 3 - rgb.height), rgb)
            canvas.save(OUT / ('pet_%s_%d.png' % (pid, f)))
n = len(ids)
if opts.get('mode') == 'rows':   # the sheet is two clear rows; the animals in a row are found by their gaps
    bands = runs(fg.sum(axis=1) > 3, 14, 24)
    print('rows', len(bands))
    for f in (0, 1):
        y0, y1 = bands[f]; rowfg = fg[y0:y1 + 1]
        pcs = []
        if 'splits' in opts:   # the columns are cut at given fractions of the width
            fr = [0.0] + [float(v) for v in opts['splits'].split(',')] + [1.0]
            for k in range(n):
                xa, xb = int(fr[k] * W), int(fr[k + 1] * W)
                xs = np.where(rowfg[:, xa:xb].sum(axis=0) > 1)[0]
                if len(xs): pcs.append((xa + xs[0], xa + xs[-1]))
        else:
            for gap in (12, 8, 6, 4, 3, 2):
                pcs = runs(rowfg.sum(axis=0) > 1, gap, 12)
                if len(pcs) == n: break
        print('row', f, 'pieces', len(pcs))
        for pid, (x0, x1) in zip(ids, pcs):
            sub = rowfg[:, x0:x1 + 1]; cx0, cx1 = core(sub); x0, x1 = x0 + cx0, x0 + cx1; sub = rowfg[:, x0:x1 + 1]
            rp = sub.sum(axis=1); rs = runs(rp > 1, 8, 3); ry0, ry1 = max(rs, key=lambda sp: rp[sp[0]:sp[1] + 1].sum()) if rs else (0, sub.shape[0] - 1)
            cimg = im.crop((x0, y0 + ry0, x1 + 1, y0 + ry1 + 1)); ca = np.array(cimg).astype(int)
            PAIRS.setdefault(pid, {})[f] = keyed(cimg)
    save_pairs()
    sys.exit(0)
cols = []
for gap in (14, 10, 8, 6, 4, 3):
    cols = runs(fg.sum(axis=0) > 3, gap, 24)
    if len(cols) == n: break
print('columns', len(cols), 'wanted', n)
if len(cols) != n: cols = [(c * W // n, (c + 1) * W // n - 1) for c in range(n)]
for c, pid in enumerate(ids):
    x0, x1 = cols[c][0], cols[c][1] + 1
    col = fg[:, x0:x1]
    bands = runs(col.sum(axis=1) > 3, 5, 24)
    print(pid, 'poses found', len(bands))
    for f in (0, 1):
        if f >= len(bands): bands.append(bands[-1])
        y0, y1 = bands[f]
        sub = col[y0:y1 + 1]; cx0, cx1 = core(sub); sub = sub[:, cx0:cx1 + 1]
        rp = sub.sum(axis=1); rs = runs(rp > 1, 8, 3); ry0, ry1 = max(rs, key=lambda sp: rp[sp[0]:sp[1] + 1].sum()) if rs else (0, sub.shape[0] - 1)
        cimg = im.crop((x0 + cx0, y0 + ry0, x0 + cx1 + 1, y0 + ry1 + 1))
        PAIRS.setdefault(pid, {})[f] = keyed(cimg)
save_pairs()
