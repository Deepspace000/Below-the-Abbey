"""Turns a picture made on a flat magenta background (Canva image generator) into a scenery sprite for the desert.

    python tools/ingest_sprite.py <source.jpg|png> <name> <height> [hue=<degrees>] [sat=<x>] [val=<x>] [flip] [xscale=<x>] [cell=c,r,cols,rows]

Writes assets/ds_<name>.png. The magenta is keyed out and its fringe cleaned, the picture is cropped to what is in it,
scaled up smoothly to <height> pixels tall and sharpened a little. hue/sat/val recolour it (so one painted dune becomes
yellow, red and blue ones), flip mirrors it, xscale stretches it sideways. The game loads assets/ds_<name>.png and uses it
in place of the drawn sprite called <name>.
"""
import sys, pathlib, colorsys
import numpy as np
from PIL import Image, ImageFilter

src, name, height = sys.argv[1], sys.argv[2], int(sys.argv[3])
opts = dict(a.split('=') if '=' in a else (a, '1') for a in sys.argv[4:])
im = Image.open(src).convert('RGB')
if 'cell' in opts:
    c, r, cols, rows = map(int, opts['cell'].split(','))
    W0, H0 = im.size
    im = im.crop((c * W0 // cols, r * H0 // rows, (c + 1) * W0 // cols, (r + 1) * H0 // rows))
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
out = Image.merge('RGBA', (*rgb.split(), mask))
bb = out.getchannel('A').point(lambda v: 255 if v > 128 else 0).getbbox()
out = out.crop(bb)
if 'xscale' in opts: out = out.resize((max(1, int(out.width * float(opts['xscale']))), out.height), Image.LANCZOS)
if 'flip' in opts: out = out.transpose(Image.FLIP_LEFT_RIGHT)
s = height / out.height
out = out.resize((max(1, round(out.width * s)), height), Image.LANCZOS)
rgb2 = out.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.4, percent=90, threshold=2))
if any(k in opts for k in ('hue', 'sat', 'val')):
    dh = float(opts.get('hue', 0)) / 360; ds = float(opts.get('sat', 1)); dv = float(opts.get('val', 1))
    hsv = np.array(rgb2.convert('HSV')).astype(float)
    hsv[..., 0] = (hsv[..., 0] + dh * 255) % 256
    hsv[..., 1] = np.clip(hsv[..., 1] * ds, 0, 255); hsv[..., 2] = np.clip(hsv[..., 2] * dv, 0, 255)
    rgb2 = Image.fromarray(hsv.astype(np.uint8), 'HSV').convert('RGB')
alpha = out.getchannel('A').filter(ImageFilter.GaussianBlur(max(1.2, height / 110))).point(lambda v: 0 if v < 70 else 255 if v > 185 else int((v - 70) * 255 / 115))  # smooth the stair-steps the small source leaves on the edge
final = Image.merge('RGBA', (*rgb2.split(), alpha))
dst = pathlib.Path(__file__).resolve().parent.parent / 'assets' / ('ds_' + name + '.png')
final.save(dst, optimize=True)
print(dst.name, final.size)
