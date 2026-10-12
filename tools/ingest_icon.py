"""Turns a picture made on a flat magenta background (Canva image generator) into an inventory icon.

    python tools/ingest_icon.py <source.jpg|png> <id> [col,row,cols,rows]     ->  assets/icn_<id>.png   (96x96, transparent)

The magenta is keyed out, the pink fringe is cleaned from the edge, the picture is cropped to what is in it and
fitted into the square with a little padding. The game loads assets/icn_<id>.png for the item with that id.
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter

src, name = sys.argv[1], sys.argv[2]
SIZE = 96
im = Image.open(src).convert('RGB')
if len(sys.argv) > 3:   # a cell of a sheet:  col,row,cols,rows   (e.g. 1,0,2,2 is the top-right of a 2 by 2 sheet)
    c, r, cols, rows = map(int, sys.argv[3].split(','))
    W0, H0 = im.size
    im = im.crop((c * W0 // cols, r * H0 // rows, (c + 1) * W0 // cols, (r + 1) * H0 // rows))
a = np.array(im).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
key = (r > 140) & (b > 140) & (g < 140) & (r - g > 60) & (b - g > 60)
mask = Image.fromarray(np.where(key, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
# kill pink spill on the edge pixels
a[..., 0] = np.minimum(r, np.maximum(g, 40) + 110); a[..., 2] = np.minimum(b, np.maximum(g, 40) + 110)
rgb = Image.fromarray(a.clip(0, 255).astype(np.uint8))
# push edge colour inward so no magenta halo survives the resize
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
s = (SIZE - 8) / max(out.size)
out = out.resize((max(1, round(out.width * s)), max(1, round(out.height * s))), Image.LANCZOS)
canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
canvas.paste(out, ((SIZE - out.width) // 2, (SIZE - out.height) // 2), out)
dst = pathlib.Path(__file__).resolve().parent.parent / 'assets' / ('icn_' + name + '.png')
canvas.save(dst, optimize=True)
print(dst.name, canvas.size)
