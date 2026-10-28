"""Cuts a Gemini sheet of pieces drawn on flat bright GREEN (#00FF00) into transparent pictures for the Wenlock well dungeon.
(Green, not magenta, because the pieces are purple and magenta keying would eat them.)

    python tools/wm_ingest.py <sheet.jpg> <names comma separated, reading order> [h=<height px, default 420>] [hmap=name:height,...] [dry=1]

Pieces are found as connected blobs, numbered in reading order (rows first), written as assets/ds_wm_<name>.png (the game loads every
assets/ds_*.png as IMG['art_<name>']) and as a copy in assets/wm/<name>.png. dry=1 only prints what was found.
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
from collections import deque

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = sys.argv[1]; names = sys.argv[2].split(',')
opts = dict(a.split('=') if '=' in a else (a, '1') for a in sys.argv[3:])
H0 = int(opts.get('h', 420)); hmap = dict(p.split(':') for p in opts.get('hmap', '').split(',') if p)
im = Image.open(src).convert('RGB'); a = np.array(im).astype(float); H, W = a.shape[:2]
r, g, b = a[..., 0], a[..., 1], a[..., 2]
gd = np.minimum(r, b) - g                                   # how green the pixel is
alpha = np.clip((115 - gd) / 70, 0, 1)                       # opaque unless clearly green
S = 2; h, w = H // S, W // S
fg = alpha[:h * S, :w * S].reshape(h, S, w, S).mean(axis=(1, 3)) > .5
d = fg.copy()
for dy in range(-2, 3):
    for dx in range(-2, 3): d |= np.roll(np.roll(fg, dy, 0), dx, 1)
lab = np.zeros((h, w), np.int32); n = 0; comps = {}
for y0 in range(h):
    for x0 in range(w):
        if d[y0, x0] and not lab[y0, x0]:
            n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; pts = []
            while q:
                y, x = q.popleft(); pts.append((y, x))
                for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if 0 <= ny < h and 0 <= nx < w and d[ny, nx] and not lab[ny, nx]: lab[ny, nx] = n; q.append((ny, nx))
            comps[n] = np.array(pts)
big = [(c, p) for c, p in comps.items() if len(p) >= 400]
boxes = [(c, p[:, 0].min() * S, p[:, 0].max() * S + S, p[:, 1].min() * S, p[:, 1].max() * S + S) for c, p in big]
# reading order: group by rows (a piece whose top is within half a median height of the row's first piece joins the row)
boxes.sort(key=lambda t: t[1]); rows = []
for bx in boxes:
    for row in rows:
        if abs(bx[1] - row[0][1]) < 0.6 * (bx[2] - bx[1]) or abs((bx[1] + bx[2]) / 2 - (row[0][1] + row[0][2]) / 2) < 0.45 * (bx[2] - bx[1]): row.append(bx); break
    else: rows.append([bx])
order = [bx for row in rows for bx in sorted(row, key=lambda t: t[3])]
print('found', len(order), 'pieces, expected', len(names))
for i, (c, y0, y1, x0, x1) in enumerate(order): print(i, (names[i] if i < len(names) else '?'), 'x', x0, x1, 'y', y0, y1, 'size', x1 - x0, 'x', y1 - y0)
if 'dry' in opts: sys.exit(0)
(ROOT / 'assets' / 'hp').mkdir(exist_ok=True)
for i, (c, y0, y1, x0, x1) in enumerate(order):
    if i >= len(names) or names[i] in ('-', '_'): continue
    y0 = max(0, y0 - 8); x0 = max(0, x0 - 8); y1 = min(H, y1 + 8); x1 = min(W, x1 + 8)
    sub = a[y0:y1, x0:x1].copy(); al = alpha[y0:y1, x0:x1].copy()
    keep = np.kron(np.isin(lab, [c]), np.ones((S, S), bool)); keep = np.pad(keep, ((0, H - keep.shape[0]), (0, W - keep.shape[1])))[y0:y1, x0:x1]
    kd = keep.copy()
    for dy in range(-6, 7):
        for dx in range(-6, 7): kd |= np.roll(np.roll(keep, dy, 0), dx, 1)
    al = al * kd
    # remove the green cast on the fringe
    sub[..., 1] = np.maximum(sub[..., 1], np.minimum(sub[..., 0], sub[..., 2]) - 6)
    pic = Image.fromarray(np.dstack([sub.clip(0, 255).astype(np.uint8), (al * 255).astype(np.uint8)]), 'RGBA')
    ys, xs = np.where(al > .35)
    if 'trim' in opts:   # the thin dark ground line Gemini draws under a piece
        lum = sub[..., 0] * .3 + sub[..., 1] * .59 + sub[..., 2] * .11; yy, xx = np.where(al > .35); yb = yy.max(); band = max(6, int((yb - yy.min()) * .045))
        for y in range(yb - band, yb + 1):
            m = lum[y] < 52; al[y][m] = 0
        sub2 = np.dstack([sub.clip(0, 255).astype(np.uint8), (al * 255).astype(np.uint8)]); pic = Image.fromarray(sub2, 'RGBA'); ys, xs = np.where(al > .35)
    pic = pic.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    th = int(hmap.get(names[i], H0)); s = th / pic.height
    pic = pic.resize((max(1, round(pic.width * s)), th), Image.LANCZOS)
    rgb = pic.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.2, percent=70, threshold=2))
    A = pic.getchannel('A').filter(ImageFilter.GaussianBlur(1.0)).point(lambda v: 0 if v < 70 else 255 if v > 185 else int((v - 70) * 255 / 115))
    fin = Image.merge('RGBA', (*rgb.split(), A))
    fin.save(ROOT / 'assets' / ('ds_hs_%s.png' % names[i]), optimize=True); fin.save(ROOT / 'assets' / 'hp' / ('signs_%s.png' % names[i]), optimize=True)
    print('wrote', names[i], fin.size)
