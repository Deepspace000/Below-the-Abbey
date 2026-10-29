"""Contact sheet of the floor screenshots: python tools/nt_sheet.py folder out.png [cols] [floor numbers]"""
import sys, os
from PIL import Image, ImageDraw
folder, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
names = sorted([f for f in os.listdir(folder) if f.startswith('floor_') and f.endswith('.png')], key=lambda f: int(f[6:-4]))
if len(sys.argv) > 4:
    want = set(int(a) for a in sys.argv[4:])
    names = [f for f in names if int(f[6:-4]) in want]
W, H = 600, 260
rows = (len(names) + cols - 1) // cols
sheet = Image.new('RGB', (cols * W, rows * H), (0, 0, 0))
for i, f in enumerate(names):
    im = Image.open(os.path.join(folder, f)).convert('RGB')
    im = im.crop((0, 0, 780, 390)).resize((W, H))
    ImageDraw.Draw(im).text((6, 4), f[6:-4], fill=(255, 255, 0))
    sheet.paste(im, ((i % cols) * W, (i // cols) * H))
sheet.save(out)
print(out, sheet.size)
