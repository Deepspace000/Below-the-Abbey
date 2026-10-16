"""Cuts hand-picked boxes out of a sheet into 256 square wall pieces and lists them in assets/kh/manifest.json.

    python tools/cut_cells.py <sheet.jpg> <name> x0,y0,x1,y1 x0,y0,x1,y1 ...     (boxes in sheet pixels, in the order of the pieces)

Used when the generator does not keep to an even grid. Pieces are saved as assets/kh/<name>_<k>.jpg and kind 'tex'.
"""
import sys, json, pathlib
from PIL import Image
src, name = sys.argv[1], sys.argv[2]
boxes = [tuple(int(v) for v in a.split(',')) for a in sys.argv[3:]]
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'kh'
MAN = OUT / 'manifest.json'
man = json.loads(MAN.read_text())
im = Image.open(src).convert('RGB')
for k, b in enumerate(boxes):
    c = im.crop(b).resize((256, 256), Image.LANCZOS)
    fn = '%s_%d.jpg' % (name, k)
    c.save(OUT / fn, quality=92)
    man['%s_%d' % (name, k)] = {'file': fn, 'w': 256, 'h': 256, 'kind': 'tex', 'sheet': name}
MAN.write_text(json.dumps(man, indent=0))
print(name, 'tex', len(boxes), 'pieces')
