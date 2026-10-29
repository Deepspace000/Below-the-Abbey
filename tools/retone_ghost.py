"""Gives a painted ghost sprite the translucent pale teal ghost look: luminance mapped onto a teal ramp, alpha at 0.9.
usage: python tools/retone_ghost.py name [name...]   (assets/ps/<name>.webp, in place)"""
import sys
import numpy as np
from PIL import Image
ramp_x = np.array([0, .35, .7, 1.0]); ramp = np.array([[14, 30, 38], [70, 118, 122], [150, 205, 200], [222, 246, 240]], float)
for n in sys.argv[1:]:
    p = 'assets/ps/%s.webp' % n
    a = np.array(Image.open(p).convert('RGBA')).astype(float)
    L = (a[..., 0] * .3 + a[..., 1] * .5 + a[..., 2] * .2) / 255.0
    lo, hi = np.percentile(L[a[..., 3] > 200], [2, 99])
    L = np.clip((L - lo) / (hi - lo), 0, 1) ** .85
    for c in range(3): a[..., c] = np.interp(L, ramp_x, ramp[:, c])
    a[..., 3] *= .9
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(p, quality=88, method=4)
