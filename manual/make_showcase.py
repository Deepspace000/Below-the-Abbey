"""Two-page spread pictures of the manual for the itch.io page: python make_showcase.py  ->  manual/showcase/spread_*.png"""
import os, pymupdf
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); PDF = os.path.join(os.path.dirname(HERE), 'Below-the-Abbey-manual.pdf'); OUT = os.path.join(HERE, 'showcase'); os.makedirs(OUT, exist_ok=True)
d = pymupdf.open(PDF)
N = {k: v['page'] + 1 for k, v in d.resolve_names().items()}
def at(key, off=0): return N[key] + off
SP = {'contents': (2, 3), 'chapter1': (at('ch01'), at('ch01', 1)), 'gear_tiers': (at('ch03-tiers'), at('ch03-tiers', 1)), 'whos_who': (at('ch04-whos'), at('ch04-whos', 1)),
      'history_map': (at('ch04-map'), at('ch04-map', 1)), 'atlas': (at('ch05-atlas-h'), at('ch05-atlas-h', 1)), 'bestiary': (at('ch08-bestiary'), at('ch08-bestiary', 1)), 'desert': (at('ch06'), at('ch06', 1))}
print(SP)
for name, (a, b) in SP.items():
    ims = []
    for p in (a, b):
        pm = d[p - 1].get_pixmap(dpi=110); f = os.path.join(OUT, '_t.png'); pm.save(f); ims.append(Image.open(f).convert('RGB'))
    w, h = ims[0].size; sh = Image.new('RGB', (w * 2 + 6, h), (40, 40, 40)); sh.paste(ims[0], (0, 0)); sh.paste(ims[1], (w + 6, 0)); sh.save(os.path.join(OUT, 'spread_%s.png' % name))
os.remove(os.path.join(OUT, '_t.png'))
c = d[0].get_pixmap(dpi=140); c.save(os.path.join(OUT, 'cover.png')); print('done')
