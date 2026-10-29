"""Cuts a 3x2 sheet on magenta into separate transparent pictures: assets/ds_<prefix>_<n>.png
python tools/polish/blg_cut.py <sheet.jpg> <prefix> <firstnumber> [maxh=420]"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
src, prefix, first = sys.argv[1], sys.argv[2], int(sys.argv[3])
maxh = int(sys.argv[4]) if len(sys.argv) > 4 else 420
OUT = pathlib.Path(__file__).resolve().parent.parent.parent / 'assets'
im = Image.open(src).convert('RGB'); W, H = im.size
n = first
for rj in range(2):
    for ci in range(3):
        c = im.crop((ci * W // 3, rj * H // 2, (ci + 1) * W // 3, (rj + 1) * H // 2))
        a = np.array(c).astype(float); r, g, b = a[..., 0], a[..., 1], a[..., 2]
        mag = np.clip(((np.minimum(r, b) - g) - 50) / 70.0, 0, 1)      # 1 = pure background
        alpha = 1 - mag
        # despill: pixels partly magenta lose the magenta
        sp = np.clip(np.minimum(r, b) - g, 0, None) * (alpha < 1)
        a[..., 0] = np.where(alpha < 1, r - sp * .85, r); a[..., 2] = np.where(alpha < 1, b - sp * .85, b)
        al = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
        al = np.array(al)
        out = np.dstack([a.clip(0, 255), al]).astype(np.uint8)
        pic = Image.fromarray(out, 'RGBA'); bb = pic.getchannel('A').point(lambda v: 255 if v > 30 else 0).getbbox()
        pic = pic.crop(bb)
        if pic.height > maxh: pic = pic.resize((max(1, round(pic.width * maxh / pic.height)), maxh), Image.LANCZOS)
        pic.save(OUT / f'ds_{prefix}_{n}.png', optimize=True); print(prefix, n, pic.size)
        n += 1
