"""Contact sheet of existing pictures to reuse: python tools/blight_contact.py out.png folder prefix1 prefix2 ...  (webp/png from assets/<folder>)"""
import sys, os, glob
from PIL import Image, ImageDraw
out, folder = sys.argv[1], sys.argv[2]
pre = sys.argv[3:]
files = []
for p in pre:
    files += sorted(glob.glob(os.path.join('assets', folder, p + '*')))
files = [f for f in files if f.lower().endswith(('.webp', '.png', '.jpg'))]
cell = 200
cols = 6
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cell, rows * (cell + 16)), (90, 90, 100))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    try:
        im = Image.open(f).convert('RGBA')
    except Exception:
        continue
    im.thumbnail((cell - 6, cell - 6))
    x, y = (i % cols) * cell, (i // cols) * (cell + 16)
    sheet.paste(im, (x + 3, y + 3), im)
    d.text((x + 3, y + cell), os.path.basename(f)[:28], fill=(255, 255, 255))
sheet.save(out)
print(len(files), out)
