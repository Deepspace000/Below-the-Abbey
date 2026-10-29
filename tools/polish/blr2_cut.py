"""Cuts ONE picture on flat magenta into a transparent PNG: python tools/polish/blr2_cut.py <in.jpg> <name> [maxh=420]
Writes assets/ds_<name>.png. Removes the thin ground line Gemini sometimes draws at the bottom edge."""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
src, name = sys.argv[1], sys.argv[2]; maxh = int(sys.argv[3]) if len(sys.argv) > 3 else 420
OUT = pathlib.Path(__file__).resolve().parent.parent.parent / 'assets'
a = np.array(Image.open(src).convert('RGB')).astype(float); r, g, b = a[..., 0], a[..., 1], a[..., 2]
mag = np.clip(((np.minimum(r, b) - g) - 50) / 70.0, 0, 1); alpha = 1 - mag
sp = np.clip(np.minimum(r, b) - g, 0, None) * (alpha < 1)
a[..., 0] = np.where(alpha < 1, r - sp * .85, r); a[..., 2] = np.where(alpha < 1, b - sp * .85, b)
al = np.array(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)))
# remove a thin full-width ground line: a row with far more opaque pixels than the rows 3 above and 3 below
op = (al > 128).sum(axis=1); H = len(op)
ys = np.nonzero(op)[0]; y1 = ys.max()
for y in range(max(0, y1 - int(H * .2)), y1 + 1):
    up = op[max(0, y - 4)]; dn = op[min(H - 1, y + 4)]
    if op[y] > 40 and op[y] > 2.5 * max(up, 1) and (dn < op[y] * .5):
        al[max(0, y - 1):y + 2, :] = np.where(al[max(0, y - 1):y + 2, :] > 0, 0, 0)
out = np.dstack([a.clip(0, 255), al]).astype(np.uint8)
pic = Image.fromarray(out, 'RGBA'); bb = pic.getchannel('A').point(lambda v: 255 if v > 30 else 0).getbbox(); pic = pic.crop(bb)
if pic.height > maxh: pic = pic.resize((max(1, round(pic.width * maxh / pic.height)), maxh), Image.LANCZOS)
pic.save(OUT / ('ds_%s.png' % name), optimize=True); print(name, pic.size)
