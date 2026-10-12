"""Turns a cut-out picture (RGBA png, made with Canva's image generator and background remover) into a game sprite.

    python tools/ingest_art.py <source.png> <name> <height>

It crops the picture to what is in it, removes the pale halo the cut-out leaves, scales it up smoothly to <height>
pixels tall, sharpens it a little, and writes assets/<name>.png.
"""
import sys, pathlib
from PIL import Image, ImageFilter, ImageChops

src, name, height = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert('RGBA')
r, g, b, a = im.split()
# remove halo: pale, semi-transparent edge pixels lose their opacity; then shrink the mask by a pixel
px = im.load()
W, H = im.size
for y in range(H):
    for x in range(W):
        R, G, B, A = px[x, y]
        if A < 255 and (R + G + B) / 3 > 200:
            A = int(A * 0.35)
        px[x, y] = (R, G, B, A)
a = im.split()[3].filter(ImageFilter.MinFilter(3))
im.putalpha(a)
bbox = im.split()[3].point(lambda v: 255 if v > 24 else 0).getbbox()
im = im.crop(bbox)
scale = height / im.height
im = im.resize((max(1, round(im.width * scale)), height), Image.LANCZOS)
rgb = im.convert('RGB').filter(ImageFilter.UnsharpMask(radius=1.6, percent=110, threshold=2))
out = rgb.convert('RGBA')
out.putalpha(im.split()[3].filter(ImageFilter.GaussianBlur(0.6)))
dst = pathlib.Path(__file__).resolve().parent.parent / 'assets' / (name + '.png')
out.save(dst, optimize=True)
print(dst, out.size)
