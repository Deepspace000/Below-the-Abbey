#!/usr/bin/env python3
"""Makes assets/hg_lecternglow.png: the hive lectern (hg_lectern, with its open book) with a golden glow round the book and the pages lit from within."""
import os
import numpy as np
from PIL import Image, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
im = Image.open(os.path.join(ROOT, 'assets', 'hg_lectern.png')).convert('RGBA')
pad = 56
W, H = im.width + 2 * pad, im.height + 2 * pad
base = Image.new('RGBA', (W, H), (0, 0, 0, 0)); base.paste(im, (pad, pad), im)
yy, xx = np.mgrid[0:H, 0:W].astype(float)
cx, cy = W / 2, pad + im.height * .22                      # the open book, in the top fifth
d = np.hypot((xx - cx) / 1.25, yy - cy)
halo = np.exp(-(d / 46) ** 2) * .85 + np.exp(-(d / 22) ** 2) * .5
a = np.asarray(base).astype(float) / 255
# light the book: the upper part of the sprite is warmed towards bright gold
lit = np.clip(np.exp(-(((xx - cx) / 34) ** 2 + ((yy - cy) / 17) ** 2)) * a[..., 3], 0, 1)
rgb = a[..., :3] * (1 - lit[..., None] * .55) + np.array([1, .88, .5]) * lit[..., None] * .55
col = np.array([1, .8, .3])
al = np.clip(np.maximum(a[..., 3], halo * .8), 0, 1)
mix = halo[..., None] * (1 - a[..., 3:4])                    # glow only where the sprite is clear
out_rgb = np.where(a[..., 3:4] > .02, rgb, col)
out_rgb = out_rgb * (1 - 0) + 0
res = np.concatenate([out_rgb, np.clip(np.maximum(a[..., 3], halo * .8 * (a[..., 3] < .02))[..., None], 0, 1)], 2)
Image.fromarray((np.clip(res, 0, 1) * 255).astype('uint8'), 'RGBA').save(os.path.join(ROOT, 'assets', 'hg_lecternglow.png'), optimize=True)
print('ok', W, H, pad)
