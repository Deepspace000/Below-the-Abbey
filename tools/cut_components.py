"""Cuts every separate picture out of a sheet made on a flat magenta background (Gemini), one PNG each, in reading order.

    python tools/cut_components.py <sheet.jpg> <out_dir> <prefix> <height> [merge=<px>] [min=<px>] [hue=<deg>] [sat=<x>] [val=<x>]

The magenta is keyed out and its fringe cleaned the same way as tools/ingest_sprite.py. Pictures are found as connected
blobs (merge= grows each blob by that many pixels so a tree and its grass patch stay one picture), tiny specks (under
min= pixels across) are dropped, the rest are cropped and scaled to <height> pixels tall (or less, keeping the scale
of the biggest piece: every piece is shrunk by the same factor so a small tree stays smaller than a big one; scale=0
gives each piece the full height). Output: <out_dir>/<prefix>_NN.png, NN counted from 00 in reading order.
"""
import sys, os, colorsys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, out_dir, prefix, height = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
opts = dict(a.split('=') if '=' in a else (a, '1') for a in sys.argv[5:])
merge = int(opts.get('merge', 18)); minpx = int(opts.get('min', 40)); unify = opts.get('scale', '1') != '0'
im = Image.open(src).convert('RGB')
a = np.array(im).astype(int)
r_, g_, b_ = a[..., 0], a[..., 1], a[..., 2]
key = (r_ > 110) & (b_ > 110) & (r_ - g_ > 45) & (b_ - g_ > 45)
mask = Image.fromarray(np.where(key, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
a[..., 0] = np.minimum(r_, np.maximum(g_, 40) + 110); a[..., 2] = np.minimum(b_, np.maximum(g_, 40) + 110)
rgb = Image.fromarray(a.clip(0, 255).astype(np.uint8))
inner = mask.filter(ImageFilter.MinFilter(5))
arr = np.array(rgb).astype(float); w = (np.array(inner).astype(float) / 255)[..., None]
blur = Image.fromarray((arr * w).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))
den = np.maximum(np.array(inner.filter(ImageFilter.GaussianBlur(4))).astype(float) / 255, .02)[..., None]
fill = np.array(blur).astype(float) / den
ring = (np.array(mask) > 0) & (np.array(inner) < 128)
arr[ring] = fill[ring]
rgb = Image.fromarray(arr.clip(0, 255).astype(np.uint8))
if 'hue' in opts or 'sat' in opts or 'val' in opts:
    hsv = np.array(rgb.convert('HSV')).astype(float)
    hsv[..., 0] = (hsv[..., 0] + float(opts.get('hue', 0)) / 360 * 255) % 255
    hsv[..., 1] = np.clip(hsv[..., 1] * float(opts.get('sat', 1)), 0, 255)
    hsv[..., 2] = np.clip(hsv[..., 2] * float(opts.get('val', 1)), 0, 255)
    rgb = Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB')
full = Image.merge('RGBA', (*rgb.split(), mask))
alpha = np.array(mask) > 128
grown = ndimage.binary_dilation(alpha, iterations=merge) if merge else alpha
lab, n = ndimage.label(grown)
boxes = []
for i, sl in enumerate(ndimage.find_objects(lab), 1):
    if sl is None: continue
    piece = alpha[sl] & (lab[sl] == i)
    ys, xs = np.nonzero(piece)
    if len(xs) == 0: continue
    x0, x1, y0, y1 = xs.min() + sl[1].start, xs.max() + 1 + sl[1].start, ys.min() + sl[0].start, ys.max() + 1 + sl[0].start
    if x1 - x0 < minpx or y1 - y0 < minpx: continue
    if piece.sum() < .06 * (x1 - x0) * (y1 - y0) or (x1 - x0 > im.width * .5 and y1 - y0 > im.height * .5): continue   # a thin frame or grid line, not a picture
    boxes.append((x0, y0, x1, y1, i))
# reading order: rows by the box's lower edge (bands of one third of the median height), then left to right
mh = float(np.median([b[3] - b[1] for b in boxes])) if boxes else 1
boxes.sort(key=lambda b: (round(((b[1] + b[3]) / 2) / (mh * .9)), b[0]))
os.makedirs(out_dir, exist_ok=True)
tall = max(b[3] - b[1] for b in boxes)
for k, (x0, y0, x1, y1, i) in enumerate(boxes):
    keep = np.isin(lab[y0:y1, x0:x1], [i])
    # keep every pixel of the original sheet that lies inside the grown blob, so thin parts survive the crop
    piece = full.crop((x0, y0, x1, y1))
    pa = np.array(piece)
    pa[..., 3] = np.where((np.array(piece.getchannel('A')) > 128) & ndimage.binary_dilation(keep, iterations=2), 255, 0)
    piece = Image.fromarray(pa)
    s = (height / tall) if unify else (height / piece.height)
    nw, nh = max(1, round(piece.width * s)), max(1, round(piece.height * s))
    piece = piece.resize((nw, nh), Image.LANCZOS)
    piece.save(os.path.join(out_dir, '%s_%02d.png' % (prefix, k)))
print(len(boxes), 'pieces,', 'tallest', tall, 'px -> scale', round(height / tall, 3))
