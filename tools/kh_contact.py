"""Contact sheet of manifest pieces: python tools/kh_contact.py <prefix> <out.png> [cell=180] [cols=8]"""
import sys, json, pathlib
from PIL import Image, ImageDraw
pre, out = sys.argv[1], sys.argv[2]
opts = dict(a.split('=') for a in sys.argv[3:] if '=' in a)
cell = int(opts.get('cell', 180)); cols = int(opts.get('cols', 8))
root = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'kh'
man = json.loads((root / 'manifest.json').read_text())
names = [k for k in man if k.startswith(pre)]
names.sort(key=lambda k: (k.rsplit('_', 1)[0], int(k.rsplit('_', 1)[1])))
rows = (len(names) + cols - 1) // cols
W = Image.new('RGB', (cols * cell, rows * (cell + 14)), (120, 170, 230)); d = ImageDraw.Draw(W)
for i, n in enumerate(names):
    im = Image.open(root / man[n]['file']).convert('RGBA'); im.thumbnail((cell - 6, cell - 6))
    x, y = (i % cols) * cell, (i // cols) * (cell + 14)
    W.paste(im, (x + 3, y + 14), im); d.text((x + 4, y + 1), n, fill=(255, 255, 255))
W.save(out)
