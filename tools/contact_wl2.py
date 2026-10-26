"""Contact sheet of assets/wl2 pieces: python tools/contact_wl2.py <prefix> <out.png>  (labels each piece with its name and size)"""
import sys, json, pathlib
from PIL import Image, ImageDraw
root = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'wl2'
man = json.load(open(root / 'manifest.json'))
names = [k for k in man if k.startswith(sys.argv[1] + '_')]
names.sort(key=lambda k: int(k.rsplit('_', 1)[1]))
cell = 260; cols = 4; rows = (len(names) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cell, rows * (cell + 18)), (90, 110, 90)); d = ImageDraw.Draw(sheet)
for i, k in enumerate(names):
    im = Image.open(root / man[k]['file']).convert('RGBA'); im.thumbnail((cell - 8, cell - 8))
    x, y = (i % cols) * cell, (i // cols) * (cell + 18)
    sheet.paste(im, (x + 4, y + 18), im); d.text((x + 4, y + 2), '%s %dx%d' % (k, man[k]['w'], man[k]['h']), fill=(255, 255, 255))
sheet.save(sys.argv[2])
