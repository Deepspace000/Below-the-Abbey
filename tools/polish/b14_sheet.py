"""python tools/polish/b14_sheet.py dir out.jpg name1 name2 name3 name4 ... : 2 columns contact sheet of the 3D view (crop of the screenshot)."""
import sys, os
from PIL import Image
d, out, names = sys.argv[1], sys.argv[2], sys.argv[3:]
ims = [Image.open(os.path.join(d, n + '.png')).crop((0, 0, 785, 390)) for n in names]
rows = (len(ims) + 1) // 2
W = Image.new('RGB', (785 * 2, 390 * rows))
for i, im in enumerate(ims):
    W.paste(im, ((i % 2) * 785, (i // 2) * 390))
W.save(out, quality=85)
