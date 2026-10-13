"""Cuts a Gemini sheet of pictures on flat magenta into separate transparent PNGs, found by looking for the gaps between them.

    python tools/ingest_sheet.py <sheet.jpg> <out_prefix> <names,comma,separated> [size=128] [rows=<n>] [dir=assets]

The pictures are found row by row (a band of rows that holds something), then left to right inside each band. The first len(names)
pictures in reading order are saved as <dir>/<out_prefix><name>.png, fitted into a size by size square (or, with size=0, kept whole).
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter

src, prefix, names = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
opts = dict(a.split('=') for a in sys.argv[4:] if '=' in a)
SIZE = int(opts.get('size', 128)); OUT = pathlib.Path(opts.get('dir', pathlib.Path(__file__).resolve().parent.parent / 'assets'))
im = Image.open(src).convert('RGB'); a = np.array(im).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mag = (g < np.minimum(r, b) - 55) & (r > 120) & (b > 120)
fg = ~mag
def runs(profile, mingap, minlen=6):
    spans = []; start = None; gap = 0; last = 0
    for i, v in enumerate(profile):
        if v:
            if start is None: start = i
            gap = 0; last = i
        elif start is not None:
            gap += 1
            if gap >= mingap:
                if last - start >= minlen: spans.append((start, last))
                start = None
    if start is not None and last - start >= minlen: spans.append((start, last))
    return spans
rowprof = fg.sum(axis=1) > 12
GAP = int(opts.get('gap', 14)); bands = runs(rowprof, GAP, 24)
pieces = []
for (y0, y1) in bands:
    colprof = fg[y0:y1 + 1].sum(axis=0) > 3
    for (x0, x1) in runs(colprof, GAP, 24):
        sub = fg[y0:y1 + 1, x0:x1 + 1]
        ys = np.where(sub.sum(axis=1) > 2)[0]; xs = np.where(sub.sum(axis=0) > 2)[0]
        if len(ys) == 0 or len(xs) == 0: continue
        pieces.append((y0 + ys[0], y0 + ys[-1] + 1, x0 + xs[0], x0 + xs[-1] + 1))
print(src, 'bands', len(bands), 'pieces', len(pieces))
OUT.mkdir(parents=True, exist_ok=True)
for name, (y0, y1, x0, x1) in zip(names, pieces):
    c = im.crop((x0, y0, x1, y1)); ca = np.array(c).astype(int)
    cr, cg, cb = ca[..., 0], ca[..., 1], ca[..., 2]
    key = (cg < np.minimum(cr, cb) - 55) & (cr > 120) & (cb > 120)
    mask = Image.fromarray(np.where(key, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
    # take the pink spill off the edge pixels
    ca[..., 0] = np.minimum(cr, np.maximum(cg, 40) + 120); ca[..., 2] = np.minimum(cb, np.maximum(cg, 40) + 120)
    rgb = Image.fromarray(ca.clip(0, 255).astype(np.uint8)).convert('RGBA'); rgb.putalpha(mask)
    if SIZE:
        w, h = rgb.size; s = (SIZE - 6) / max(w, h)
        rgb = rgb.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
        canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0)); canvas.paste(rgb, ((SIZE - rgb.width) // 2, (SIZE - rgb.height) // 2), rgb)
        rgb = canvas
    rgb.save(OUT / (prefix + name + '.png'))
print('saved', min(len(names), len(pieces)))
