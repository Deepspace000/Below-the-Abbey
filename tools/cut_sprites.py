"""Cuts hand-picked boxes out of a sheet of pictures on magenta into transparent sprites.

    python tools/cut_sprites.py <sheet.jpg> <name> x0,y0,x1,y1 ...    (boxes in sheet pixels, in the order of the pieces)

Saves assets/kh/<name>_<k>.webp, trimmed to the picture, and lists them in assets/kh/manifest.json as kind 'sprite'.
Used when the generator does not keep to an even grid, or draws pieces of very different sizes.
"""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter
src, name = sys.argv[1], sys.argv[2]
boxes = [tuple(int(v) for v in a.split(',')) for a in sys.argv[3:]]
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'kh'
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text())
im = Image.open(src).convert('RGB')
for k, b in enumerate(boxes):
    c = np.array(im.crop(b)).astype(int)
    r, g, bl = c[..., 0], c[..., 1], c[..., 2]
    mag = (r > 150) & (bl > 150) & (g < 130) & (np.abs(r - bl) < 90)
    # pink fringe on the edge: pixels that lean magenta and touch the background
    lean = ((r - g) > 55) & ((bl - g) > 55)
    near = np.array(Image.fromarray((mag * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    mag = mag | (lean & near)
    a = np.where(mag, 0, 255).astype(np.uint8)
    a = np.array(Image.fromarray(a).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.6)))
    rgb = c.clip(0, 255).astype(np.uint8)
    out = Image.fromarray(np.dstack([rgb, a]), 'RGBA')
    bb = out.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
    if not bb: print('empty', k); continue
    out = out.crop(bb)
    if out.width > 700: out = out.resize((700, round(out.height * 700 / out.width)), Image.LANCZOS)
    if out.height > 700: out = out.resize((round(out.width * 700 / out.height), 700), Image.LANCZOS)
    fn = '%s_%d.webp' % (name, k)
    out.save(OUT / fn, quality=90, method=6)
    man['%s_%d' % (name, k)] = {'file': fn, 'w': out.width, 'h': out.height, 'kind': 'sprite', 'sheet': name}
MAN.write_text(json.dumps(man, indent=0))
print(name, 'sprite', len(boxes), 'pieces')
