"""Keys a painted orb frame (flat magenta background) into assets/<out>.png at 392x578, same anchor as glow_orb_frame.png.
    python tools/ingest_orbframe.py <source.png> <out-name>      e.g. glow_orb_frame_empty
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
src, name = sys.argv[1], sys.argv[2]
a = np.array(Image.open(src).convert('RGB')).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
key = (r - g > 35) & (b - g > 35) & (np.abs(r - b) < 70) & (r > 45)
mask = Image.fromarray(np.where(key, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))
a[..., 0] = np.minimum(r, np.maximum(g, 40) + 100); a[..., 2] = np.minimum(b, np.maximum(g, 40) + 100)
rgb = Image.fromarray(a.clip(0, 255).astype(np.uint8))
out = Image.merge('RGBA', (*rgb.split(), mask))
out = out.crop(out.getchannel('A').point(lambda v: 255 if v > 128 else 0).getbbox())
bw, bh = 374, 558
s = min(bw / out.width, bh / out.height)
out = out.resize((round(out.width * s), round(out.height * s)), Image.LANCZOS)
cv = Image.new('RGBA', (392, 578), (0, 0, 0, 0))
cv.paste(out, (9 + (bw - out.width) // 2, 10 + (bh - out.height) // 2), out)
dst = pathlib.Path(__file__).resolve().parent.parent / 'assets' / (name + '.png')
cv.save(dst, optimize=True); print(dst.name, cv.size, cv.getchannel('A').getbbox())
