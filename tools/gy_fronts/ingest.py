"""Cuts one picture on flat magenta (made with Canva or Gemini) into a front piece for the Wenlock Graveyard (assets/gy2/).

    python tools/gy_fronts/ingest.py <raw.png> <name> [up=2] [soft=1]

The magenta is keyed out with a soft edge and its fringe taken off, the piece is cropped to its own outline (the bottom edge is the foot of the
building), enlarged with Lanczos and sharpened a little, and saved as assets/gy2/<name>.webp. assets/gy2/manifest.json lists every piece.
"""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter

src, name = sys.argv[1], sys.argv[2]
opts = dict(a.split('=') for a in sys.argv[3:] if '=' in a)
UP = float(opts.get('up', 2))
OUT = pathlib.Path(__file__).resolve().parent.parent.parent / 'assets' / 'gy2'
OUT.mkdir(parents=True, exist_ok=True)
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text()) if MAN.exists() else {}

im = Image.open(src).convert('RGB')
a = np.array(im).astype(np.float32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
# how magenta each pixel is: 1 for pure magenta, 0 for anything with real green in it
mag = np.clip((np.minimum(r, b) - g - 40) / 110.0, 0, 1)
mag = np.where(np.abs(r - b) < 110, mag, 0)
alpha = 1 - mag
# the flat background connected to the border is removed, magenta islands inside (between bars) too
alpha = np.where(alpha < .5, 0, alpha)
al = Image.fromarray((alpha * 255).astype(np.uint8))
al = al.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.7))   # shave the fringe, soften the edge
alpha = np.array(al).astype(np.float32) / 255.0
# take the pink out of edge pixels: pull red and blue down towards green where they overshoot
edge = (alpha > 0) & (alpha < 1) | ((mag > 0) & (mag < 1))
spill = np.clip((np.minimum(r, b) - g) / 255.0, 0, 1)
for ch in (r, b):
    ch -= np.where(edge | (spill > .08), (np.minimum(r, b) - g).clip(0) * .7, 0)
rgb = np.stack([r, g, b], -1).clip(0, 255)
rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
out = Image.fromarray(rgba, 'RGBA')
bb = out.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
out = out.crop(bb)
if UP != 1:
    out = out.resize((round(out.width * UP), round(out.height * UP)), Image.LANCZOS)
    rgb2 = out.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
    rgb2.putalpha(out.getchannel('A'))
    out = rgb2
out.save(OUT / (name + '.webp'), 'WEBP', quality=90, method=6)
man[name] = {'file': name + '.webp', 'w': out.width, 'h': out.height}
MAN.write_text(json.dumps(man, indent=1))
print(name, out.size)
