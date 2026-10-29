"""python tools/retone_ps.py name1,name2 [shift_deg=40] [sat=0.7]: shifts the green hues of assets/ps/<name>.webp towards teal-blue and lowers their saturation (owner palette: no big green copper roofs)."""
import sys, pathlib, colorsys
import numpy as np
from PIL import Image
root = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ps'
names = sys.argv[1].split(','); shift = float(sys.argv[2]) if len(sys.argv) > 2 else 40; sat = float(sys.argv[3]) if len(sys.argv) > 3 else .7
for n in names:
    p = root / (n + '.webp'); im = Image.open(p).convert('RGBA'); a = np.array(im)
    hsv = np.array(Image.fromarray(a[..., :3]).convert('HSV')).astype(float)
    h = hsv[..., 0] * 360 / 255
    m = (h > 70) & (h < 170) & (hsv[..., 1] > 40)
    hsv[..., 0] = np.where(m, np.minimum(h + shift, 359) * 255 / 360, hsv[..., 0])
    hsv[..., 1] = np.where(m, hsv[..., 1] * sat, hsv[..., 1])
    rgb = np.array(Image.fromarray(hsv.clip(0, 255).astype(np.uint8), 'HSV').convert('RGB'))
    out = np.dstack([rgb, a[..., 3]]); Image.fromarray(out).save(p, quality=88, method=4)
    print('retoned', n)
