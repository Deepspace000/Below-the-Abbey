"""Montage of the room screenshots made by wl2_test.py: python tools/shots_wl2.py  (writes sheet_N.png, 8 rooms each, into the shots folder)"""
import pathlib, json
from PIL import Image, ImageDraw
D = pathlib.Path('C:/Users/mirko/AppData/Local/Temp/wl2shots')
fs = sorted(D.glob('r7*.png'), key=lambda p: int(p.stem[1:]))
for n in range(0, len(fs), 8):
    sh = Image.new('RGB', (1000, 4 * 262), (20, 20, 20)); d = ImageDraw.Draw(sh)
    for i, f in enumerate(fs[n:n + 8]):
        im = Image.open(f).convert('RGB').crop((0, 40, 840, 460)).resize((500, 250))
        x, y = (i % 2) * 500, (i // 2) * 262
        sh.paste(im, (x, y + 12)); d.text((x + 4, y), f.stem, fill=(255, 255, 0))
    sh.save(D / ('sheet_%d.png' % (n // 8)))
print(len(fs))
