#!/usr/bin/env python3
"""Shortens the over-long chins of some portraits (assets/pt/N.png, 192 x 192).

For each portrait a band of rows (from the mouth down to the foot of the chin) is squeezed to a fraction of its height. Everything above the band
moves down by what was saved, so the shoulders and the frame stay where they were, and the new rows at the top are filled with the picture's own
background (the top row). A soft ramp at both ends of the band keeps the lines of the face smooth.

Run from the game folder: python tools/fix_chins.py            (works from the untouched originals kept in ART-HOLD/portrait_chin_orig/)
                          python tools/fix_chins.py --preview  (writes ART-HOLD/chin_preview.jpg: before and after, nothing in assets changes)
"""
import os, shutil, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PT = os.path.join(ROOT, 'assets', 'pt')
ORIG = os.path.join(ROOT, 'ART-HOLD', 'portrait_chin_orig')
# portrait: (top of the band = about the mouth, bottom of the band = about the foot of the chin, share of the height kept)
FIX = {
    3: (108, 142, .58),    # the blond elf with the circlet: the face runs on and on below the mouth
    25: (104, 134, .68),   # the grey elf with the jutting chin
    42: (120, 148, .68),   # the dark elf
    39: (108, 134, .74),   # the elf with the leaf crown
    40: (112, 140, .70),   # the old grey elf
    41: (120, 150, .76),   # the hooded elf archer
    26: (112, 134, .86),   # the pale elf: only a little
}
RAMP = 5


def remap(a, m, c, f):
    """a: H x W x 3 array. Squeeze rows m..c to f of their height, push the head down, keep everything below c where it is."""
    H = a.shape[0]
    src = np.arange(H + 1, dtype=float)
    g = np.ones(H)                       # how many output rows each source row becomes
    for y in range(H):
        t0 = np.clip((y - (m - RAMP)) / (2 * RAMP), 0, 1)        # ramps down into the band
        t1 = np.clip((y - (c - RAMP)) / (2 * RAMP), 0, 1)        # and back up out of it
        s0, s1 = t0 * t0 * (3 - 2 * t0), t1 * t1 * (3 - 2 * t1)
        g[y] = 1 + (f - 1) * s0 * (1 - s1)
    out = np.concatenate([[0], np.cumsum(g)])    # output position of each source row edge
    shift = (H) - out[-1]                        # what was saved: the whole picture moves down by this so that the bottom stays put
    out = out + shift
    # for each output row find the source position (centre of the row) and sample linearly
    oy = np.arange(H) + .5
    sy = np.interp(oy, out, src) - .5
    y0 = np.clip(np.floor(sy).astype(int), 0, H - 1)
    y1 = np.clip(y0 + 1, 0, H - 1)
    t = np.clip(sy - y0, 0, 1)[:, None, None]
    r = a[y0] * (1 - t) + a[y1] * t
    # rows that come from above the first source row: the background (the top row)
    top = sy < 0
    r[top] = a[0][None, :, :]
    return np.clip(r + .5, 0, 255).astype(np.uint8)


def main():
    os.makedirs(ORIG, exist_ok=True)
    cells = []
    for i, (m, c, f) in sorted(FIX.items()):
        p = os.path.join(PT, '%d.png' % i)
        o = os.path.join(ORIG, '%d.png' % i)
        if not os.path.exists(o):
            shutil.copy2(p, o)
        before = Image.open(o).convert('RGB')
        after = Image.fromarray(remap(np.asarray(before).astype(float), m, c, f))
        cells.append((i, before, after))
        if '--preview' not in sys.argv:
            after.save(p, optimize=True)
    S = 240
    sh = Image.new('RGB', (len(cells) * S, 2 * S), (20, 20, 20))
    d = ImageDraw.Draw(sh)
    for n, (i, b, a) in enumerate(cells):
        sh.paste(b.resize((S, S), Image.LANCZOS), (n * S, 0))
        sh.paste(a.resize((S, S), Image.LANCZOS), (n * S, S))
        d.text((n * S + 4, 4), '#%d before' % i, fill=(255, 255, 0))
        d.text((n * S + 4, S + 4), '#%d after' % i, fill=(0, 255, 255))
    sh.save(os.path.join(ROOT, 'ART-HOLD', 'chin_preview.jpg'), quality=90)
    print('portraits:', ', '.join('#%d' % c[0] for c in cells), '(preview: ART-HOLD/chin_preview.jpg)')


if __name__ == '__main__':
    main()
