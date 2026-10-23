"""Cut a Gemini grid of party portraits into game portraits: assets/pt/<n>.png, 192x192.

usage: python tools/ingest_pt.py <sheet.jpg> <first index> [cols=2 rows=2 low=72 sat=.86 margin=.035 only=0,1,2,3 xs=x0,x1,x0,x1 ys=y0,y1,y0,y1 zoom=1 top=0]

Each cell is found between the thin dividing lines, trimmed by `margin`, squared, shrunk to `low` pixels and blown back
up to 192 with hard edges, so it has the same chunky pixel look as the old portraits. `sat` mutes the colours a little.
"""
import sys, os
from PIL import Image, ImageEnhance
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def splits(a, n, axis):
    # the dividing lines: the rows (or columns) near each expected split that differ most from their neighbours
    size = a.shape[axis]; prof = a.mean(axis=(1 - axis, 2)) if axis == 0 else a.mean(axis=(0, 2))
    cuts = [0]
    for k in range(1, n):
        c = size * k // n; w = size // 25
        seg = prof[c - w:c + w]; d = np.abs(np.diff(seg, 2)); j = int(np.argmax(d)) + c - w + 1
        cuts.append(j)
    cuts.append(size)
    return cuts

def main():
    sheet, first = sys.argv[1], int(sys.argv[2])
    opt = dict(cols=2, rows=2, low=72, sat=.86, margin=.035, only=None, xs=None, ys=None, zoom=1.0, top=0.0)
    for a in sys.argv[3:]:
        k, v = a.split('=')
        opt[k] = [int(x) for x in v.split(',')] if k in ('only', 'xs', 'ys') else (int(v) if k in ('cols', 'rows', 'low') else float(v))
    im = Image.open(sheet).convert('RGB'); a = np.asarray(im).astype(float)
    # xs= and ys= give each cell's own start and end (for sheets whose panels sit inside a margin), else the lines are found
    pairs = lambda e: [(e[2 * i], e[2 * i + 1]) for i in range(len(e) // 2)]
    xs = pairs(opt['xs']) if opt['xs'] else [(c0, c1) for c0, c1 in zip(splits(a, opt['cols'], 1), splits(a, opt['cols'], 1)[1:])]
    ys = pairs(opt['ys']) if opt['ys'] else [(c0, c1) for c0, c1 in zip(splits(a, opt['rows'], 0), splits(a, opt['rows'], 0)[1:])]
    n = first
    for r in range(opt['rows']):
        for c in range(opt['cols']):
            i = r * opt['cols'] + c
            if opt['only'] is not None and i not in opt['only']:
                n += 1; continue
            (x0, x1), (y0, y1) = xs[c], ys[r]
            m = int(min(x1 - x0, y1 - y0) * opt['margin']); x0 += m; x1 -= m; y0 += m; y1 -= m
            s = min(x1 - x0, y1 - y0); cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
            z = int(s * opt['zoom']); zx, zy = cx - z // 2, cy - s // 2 + int(s * opt['top']) # zoom < 1 crops closer: centred across, starting `top` below the cell top so ears and horns stay in
            cell = im.crop((zx, zy, zx + z, zy + z))
            cell = ImageEnhance.Color(cell).enhance(opt['sat'])
            low = cell.resize((opt['low'], opt['low']), Image.LANCZOS)
            out = low.resize((192, 192), Image.NEAREST)
            dst = os.path.join(ROOT, 'assets', 'pt', '%d.png' % n)
            out.save(dst); print('wrote', dst)
            n += 1

if __name__ == '__main__':
    main()
