"""python tools/contact.py <dir> <prefix> <out.jpg> [cell=<px>] [cols=<n>]  : a contact sheet of the pieces <dir>/<prefix>_NN.png on parchment, numbered"""
import sys, os, glob
from PIL import Image, ImageDraw
d, p, out = sys.argv[1:4]; o = dict(a.split('=') for a in sys.argv[4:])
cell = int(o.get('cell', 220)); cols = int(o.get('cols', 6))
fs = sorted(glob.glob(os.path.join(d, p + '_*.png')))
rows = (len(fs) + cols - 1) // cols
sh = Image.new('RGBA', (cols * cell, rows * cell), (222, 200, 150, 255)); dr = ImageDraw.Draw(sh)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGBA'); s = min((cell - 16) / im.width, (cell - 24) / im.height, 3)
    im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
    x, y = (i % cols) * cell, (i // cols) * cell
    sh.alpha_composite(im, (x + (cell - im.width) // 2, y + cell - 6 - im.height))
    dr.text((x + 4, y + 2), os.path.basename(f)[len(p) + 1:-4] + ' %dx%d' % Image.open(f).size, fill=(120, 20, 10, 255))
sh.convert('RGB').save(out, quality=88)
