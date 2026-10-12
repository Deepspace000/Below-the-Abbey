"""Cuts one Gemini sheet (pictures on flat magenta) into the separate pieces the city of Khemetra uses.

    python tools/ingest_kh.py <sheet.jpg> <name> <fac|sprite|tex> [cols=<n> rows=<n>] [maxh=<px>]

fac     each house front is cropped out and saved as assets/kh/<name>_<k>.jpg (opaque, a flat wall)
sprite  each picture is keyed out of the magenta and saved as assets/kh/<name>_<k>.webp (with transparency)
tex     the sheet is cut into a cols x rows grid of seamless squares, saved as assets/kh/<name>_<k>.jpg

Pieces are numbered in reading order. assets/kh/manifest.json lists every piece with its size.
"""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter

src, name, kind = sys.argv[1], sys.argv[2], sys.argv[3]
opts = dict(a.split('=') for a in sys.argv[4:] if '=' in a)
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'kh'
OUT.mkdir(parents=True, exist_ok=True)
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text()) if MAN.exists() else {}
im = Image.open(src).convert('RGB')
a = np.array(im).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mag = (r > 140) & (b > 140) & (g < 120) & (np.abs(r - b) < 90)     # the background
fg = ~mag

def runs(profile, mingap):
    """spans of the profile that hold something, split wherever there is an empty gap of at least mingap"""
    spans = []; start = None; gap = 0
    for i, v in enumerate(profile):
        if v:
            if start is None: start = i
            gap = 0; last = i
        elif start is not None:
            gap += 1
            if gap >= mingap:
                spans.append((start, last)); start = None
    if start is not None: spans.append((start, last))
    return spans


def fill_magenta(c):
    """magenta left in a corner or a gap (a pylon's notch, a broken wall) takes the colour of the nearest wall pixel on its row"""
    a = np.array(c).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (r > 120) & (b > 120) & (g < 150) & (r - g > 35) & (b - g > 35)
    m = np.array(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))) > 0
    # a top that is mostly background is cut off first
    top = 0
    while top < a.shape[0] // 4 and m[top].mean() > .4: top += 1
    a = a[top:]; m = m[top:]
    if m.any():
        for y in np.where(m.any(axis=1))[0]:
            xs = np.where(~m[y])[0]
            if len(xs) == 0: a[y] = a[min(y + 1, a.shape[0] - 1)]; continue
            idx = np.searchsorted(xs, np.where(m[y])[0])
            left = xs[np.clip(idx - 1, 0, len(xs) - 1)]; right = xs[np.clip(idx, 0, len(xs) - 1)]
            pos = np.where(m[y])[0]
            pick = np.where(np.abs(pos - left) <= np.abs(right - pos), left, right)
            a[y, pos] = a[y, pick]
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))

pieces = []
if kind == 'tex':
    cols, rows = int(opts.get('cols', 3)), int(opts.get('rows', 2))
    W, H = im.size
    for rj in range(rows):
        for ci in range(cols):
            pieces.append((ci * W // cols, rj * H // rows, (ci + 1) * W // cols, (rj + 1) * H // rows))
else:
    if opts.get('order') == 'rows':
        for (y0, y1) in runs(fg.sum(axis=1) > 6, 4):
            if y1 - y0 < 40: continue
            row = fg[y0:y1 + 1]
            for (x0, x1) in runs(row.sum(axis=0) > 6, 3):
                if x1 - x0 < 40: continue
                sub = fg[y0:y1 + 1, x0:x1 + 1]; ys = np.where(sub.sum(axis=1) > 3)[0]
                pieces.append((x0, y0 + ys[0], x1 + 1, y0 + ys[-1] + 1))
        pieces.sort(key=lambda p: (round(p[1] / 120), p[0]))
    # columns first (the gaps between neighbours are widest sideways), then the pieces stacked in each column
    forced_rows = int(opts.get('rows', 0))
    gapx = 3 if kind == 'sprite' else 6
    for (x0, x1) in (runs(fg.sum(axis=0) > 6, gapx) if opts.get('order') != 'rows' else []):
        if x1 - x0 < 40: continue
        col = fg[:, x0:x1 + 1]
        spans = runs(col.sum(axis=1) > 3, 2)
        if forced_rows and len(spans) < forced_rows:
            ys = np.where(col.sum(axis=1) > 3)[0]; top, bot = ys[0], ys[-1] + 1
            h = (bot - top) / forced_rows
            spans = [(int(top + k * h), int(top + (k + 1) * h) - 1) for k in range(forced_rows)]
        for (y0, y1) in spans:
            if y1 - y0 < 40: continue
            sub = fg[y0:y1 + 1, x0:x1 + 1]
            xs = np.where(sub.sum(axis=0) > 3)[0]
            if len(xs) == 0: continue
            pieces.append((x0 + xs[0], y0, x0 + xs[-1] + 1, y1 + 1))
    # reading order: rows of similar height first, then left to right
    pieces.sort(key=lambda p: (round(p[1] / 120), p[0]))
if kind == 'sprite' and len(pieces) > 2:   # slivers (a staff, a stray fringe) are not pictures
    ar = sorted((x1 - x0) * (y1 - y0) for (x0, y0, x1, y1) in pieces); med = ar[len(ar) // 2]
    pieces = [q for q in pieces if (q[2] - q[0]) * (q[3] - q[1]) >= .3 * med]
maxh = int(opts.get('maxh', 512))
n = 0
for (x0, y0, x1, y1) in pieces:
    crop = im.crop((x0, y0, x1, y1))
    if kind == 'tex':
        m = int((x1 - x0) * .03)
        crop = crop.crop((m, m, crop.width - m, crop.height - m)).resize((256, 256), Image.LANCZOS)
        crop.save(OUT / ('%s_%d.jpg' % (name, n)), quality=90)
        man['%s_%d' % (name, n)] = {'file': '%s_%d.jpg' % (name, n), 'w': 256, 'h': 256, 'kind': 'tex', 'sheet': name}
    elif kind == 'fac':
        ct = int(crop.height * float(opts.get('croptop', 0)))
        c = crop.crop((2, 2 + ct, crop.width - 2, crop.height - 2))
        parts = [c]
        ca = np.array(c).astype(int)
        mrow = ((ca[..., 0] > 140) & (ca[..., 2] > 140) & (ca[..., 1] < 125)).mean(axis=1)
        mid = [y for y in range(int(c.height * .25), int(c.height * .75)) if mrow[y] > .6]
        if mid:   # a magenta band across the middle: two houses were stacked
            y = mid[len(mid) // 2]; parts = [c.crop((0, 0, c.width, y - len(mid) // 2)), c.crop((0, y + len(mid) // 2 + 1, c.width, c.height))]
        if len(parts) == 1 and c.height / c.width > 1.35:   # two houses were stacked into one piece: split them
            parts = [c.crop((0, 0, c.width, c.height // 2)), c.crop((0, c.height // 2, c.width, c.height))]
        for c in parts:
            c = fill_magenta(c)
            if c.height > maxh: c = c.resize((round(c.width * maxh / c.height), maxh), Image.LANCZOS)
            c.save(OUT / ('%s_%d.jpg' % (name, n)), quality=90)
            man['%s_%d' % (name, n)] = {'file': '%s_%d.jpg' % (name, n), 'w': c.width, 'h': c.height, 'kind': 'fac', 'sheet': name}
            n += 1
        continue
    else:
        arr = np.array(crop).astype(int)
        rr, gg, bb = arr[..., 0], arr[..., 1], arr[..., 2]
        key = (rr > 140) & (bb > 140) & (gg < 125) & (np.abs(rr - bb) < 90)
        alpha = Image.fromarray(np.where(key, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
        # pull the magenta out of the edge pixels
        arr[..., 0] = np.minimum(rr, np.maximum(gg, 50) + 100); arr[..., 2] = np.minimum(bb, np.maximum(gg, 50) + 100)
        out = Image.fromarray(arr.clip(0, 255).astype(np.uint8)).convert('RGBA'); out.putalpha(alpha)
        bb_ = out.getchannel('A').point(lambda v: 255 if v > 100 else 0).getbbox()
        if bb_: out = out.crop(bb_)
        if out.height > maxh: out = out.resize((round(out.width * maxh / out.height), maxh), Image.LANCZOS)
        out.save(OUT / ('%s_%d.webp' % (name, n)), quality=88, method=4)
        man['%s_%d' % (name, n)] = {'file': '%s_%d.webp' % (name, n), 'w': out.width, 'h': out.height, 'kind': 'sprite', 'sheet': name}
    n += 1
MAN.write_text(json.dumps(man, indent=0))
print(name, kind, n, 'pieces')
