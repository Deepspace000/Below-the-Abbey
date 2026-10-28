"""python tools/polish/b9s_imgs.py out.png file1 file2 ...  contact sheet of sprites on grey"""
import sys
from PIL import Image, ImageDraw
fs = sys.argv[2:]; S = 220
s = Image.new('RGB', (S * min(len(fs), 5), S * ((len(fs) + 4) // 5)), (90, 90, 100))
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGBA'); im.thumbnail((S - 8, S - 20))
    x, y = (i % 5) * S, (i // 5) * S
    s.paste(im, (x + 4, y + 16), im); ImageDraw.Draw(s).text((x + 4, y + 2), f.split('/')[-1] + ' %s' % (Image.open(f).size,), fill=(255, 255, 0))
s.save(sys.argv[1])
