"""Soft magenta key for pale, glowing sprites (the Hollow Grasslands cities). The ordinary ingest_sprite.py erodes thin pale parts and leaves a purple halo.

    python tools/ingest_hgt_sprite.py <source> <name> <height> [cell=c,r,cols,rows] [lo=<n>] [hi=<n>] [flip]

Alpha comes from how magenta a pixel is (min(r,b)-g): fully magenta is clear, plant colours are opaque, glow in between is half clear. The magenta
that bleeds into soft edges is subtracted from the colour. Writes assets/ds_<name>.png (RGBA) scaled to <height> pixels tall.
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
src, name, height = sys.argv[1], sys.argv[2], int(sys.argv[3])
o = dict(a.split('=') if '=' in a else (a, '1') for a in sys.argv[4:])
im = Image.open(src).convert('RGB')
if 'cell' in o:
    c, r, cols, rows = map(int, o['cell'].split(',')); W0, H0 = im.size
    im = im.crop((c * W0 // cols, r * H0 // rows, (c + 1) * W0 // cols, (r + 1) * H0 // rows))
a = np.array(im).astype(float)
R, G, B = a[..., 0], a[..., 1], a[..., 2]
m = np.minimum(R, B) - G                      # magentaness
lo, hi = float(o.get('lo', 40)), float(o.get('hi', 115))
al = np.clip((hi - m) / (hi - lo), 0, 1)
al[(R < 120) | (B < 120)] = np.maximum(al[(R < 120) | (B < 120)], 1) if False else al[(R < 120) | (B < 120)]
alpha_img = Image.fromarray((al * 255).astype(np.uint8))
# drop tiny specks of alpha far from the main object
bb = alpha_img.point(lambda v: 255 if v > 100 else 0).filter(ImageFilter.MaxFilter(9)).getbbox()
# remove the magenta contribution: c = a*fg + (1-a)*bg
bg = np.array([255., 0., 255.])
al3 = np.maximum(al, .06)[..., None]
fg = (a - (1 - al[..., None]) * bg) / al3
fg = np.clip(fg, 0, 255)
# where alpha is low the colour is noisy: pull it to a neighbour average so the resize does not bring pink back
rgb = Image.fromarray(fg.astype(np.uint8))
out = Image.merge('RGBA', (*rgb.split(), alpha_img))
if bb: out = out.crop(bb)
s = height / out.height
out = out.resize((max(1, round(out.width * s)), height), Image.LANCZOS)
if 'flip' in o: out = out.transpose(Image.FLIP_LEFT_RIGHT)
# kill any leftover pink in the semi-transparent fringe
p = np.array(out).astype(float)
pk = np.minimum(p[..., 0], p[..., 2]) - p[..., 1]
fix = pk > 40
p[..., 0][fix] = np.minimum(p[..., 0][fix], p[..., 1][fix] + 40); p[..., 2][fix] = np.minimum(p[..., 2][fix], p[..., 1][fix] + 40)
out = Image.fromarray(p.clip(0, 255).astype(np.uint8), 'RGBA')
dst = pathlib.Path(__file__).resolve().parent.parent / 'assets' / ('ds_%s.png' % name)
out.save(dst, optimize=True)
print(dst.name, out.size)
