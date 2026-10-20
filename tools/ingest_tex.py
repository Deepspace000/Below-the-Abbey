"""Turns one cell of a Gemini picture into a 128x128 tile for a desert floor, wall, door or ceiling.

    python tools/ingest_tex.py <source> <kind> <name> [cell=c,r,cols,rows] [seam=xy|x|edge|none] [hue=<deg>] [sat=<x>] [val=<x>] [margin=<fraction>]

kind is floor, tex (wall and door pictures, number-matched in the game by name), or ceil. Writes assets/ds_<kind>_<name>.png,
which the game loads in place of the tile the code drew with the same name. seam=xy makes it tile both ways (floors),
seam=x only sideways (walls), seam=none leaves it alone (doors).
"""
import sys, pathlib
import numpy as np
from PIL import Image

src, kind, name = sys.argv[1], sys.argv[2], sys.argv[3]
opts = dict(a.split('=') if '=' in a else (a, '1') for a in sys.argv[4:])
im = Image.open(src).convert('RGB')
if 'cell' in opts:
    c, r, cols, rows = map(int, opts['cell'].split(','))
    W0, H0 = im.size
    im = im.crop((c * W0 // cols, r * H0 // rows, (c + 1) * W0 // cols, (r + 1) * H0 // rows))
m = float(opts.get('margin', .035))
w, h = im.size
im = im.crop((int(w * m), int(h * m), int(w * (1 - m)), int(h * (1 - m)))).resize((256, 256), Image.LANCZOS)
a = np.array(im).astype(float)
seam = opts.get('seam', 'xy' if kind == 'floor' else 'x' if kind == 'tex' else 'none')
if seam == 'edge':   # keeps the middle untouched (windows, doors in the middle of a tile) and only makes the left and right edges meet
    B = 28
    L = a[:, :B].copy(); R = a[:, -B:][:, ::-1].copy()
    t = (np.arange(B) / B)[None, :, None]
    a[:, :B] = L * (.5 + .5 * t) + R * (.5 - .5 * t)
    a[:, -B:] = (R * (.5 + .5 * t) + L * (.5 - .5 * t))[:, ::-1]
elif seam != 'none':
    u = np.linspace(0, 1, 256)
    wx = (1 - np.abs(2 * u - 1))[None, :]; wy = (1 - np.abs(2 * u - 1))[:, None]
    if seam == 'xy':
        r_ = np.roll(a, (128, 128), (0, 1)); wm = (wx * wy)[..., None]
    else:
        r_ = np.roll(a, 128, 1); wm = np.broadcast_to(wx, (256, 256))[..., None]
    a = a * wm + r_ * (1 - wm)
im = Image.fromarray(a.clip(0, 255).astype(np.uint8)).resize((128, 128), Image.LANCZOS)
if any(k in opts for k in ('hue', 'sat', 'val')):
    hsv = np.array(im.convert('HSV')).astype(float)
    hsv[..., 0] = (hsv[..., 0] + float(opts.get('hue', 0)) / 360 * 255) % 256
    hsv[..., 1] = np.clip(hsv[..., 1] * float(opts.get('sat', 1)), 0, 255); hsv[..., 2] = np.clip(hsv[..., 2] * float(opts.get('val', 1)), 0, 255)
    im = Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB')
dst = pathlib.Path(__file__).resolve().parent.parent / 'assets' / ('ds_%s_%s.png' % (kind, name))
im.save(dst, optimize=True)
print(dst.name)
