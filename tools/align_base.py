"""Makes the frames of an animated sprite sit on the same spot: each picture is shifted so the centre of its base
(the bottom fifth of what is drawn) is in the middle of one common canvas.

    python tools/align_base.py brazier0 brazier1 brazier2 brazier3
"""
import sys, pathlib
import numpy as np
from PIL import Image
A = pathlib.Path(__file__).resolve().parent.parent / 'assets'
names = sys.argv[1:]
ims = [Image.open(A / ('ds_%s.png' % n)).convert('RGBA') for n in names]
info = []
for im in ims:
    a = np.array(im.getchannel('A')) > 40
    ys = np.where(a.any(axis=1))[0]
    y1 = ys.max(); y0 = ys.min()
    band = a[max(y0, y1 - (y1 - y0) // 5): y1 + 1]
    xs = np.where(band.any(axis=0))[0]
    info.append((xs.min() + xs.max()) / 2)
half = max(max(c, im.width - c) for c, im in zip(info, ims))
W = int(np.ceil(half * 2)) + 2
for n, im, c in zip(names, ims, info):
    out = Image.new('RGBA', (W, im.height), (0, 0, 0, 0))
    out.paste(im, (int(round(W / 2 - c)), 0), im)
    out.save(A / ('ds_%s.png' % n), optimize=True)
print('aligned', names, 'width', W)
