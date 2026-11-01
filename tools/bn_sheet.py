"""python tools/bn_sheet.py out.jpg cols w img1 img2 ...   a contact sheet with the file names under each picture"""
import sys
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in fs]; h = int(w * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols; S = Image.new('RGB', (cols * w, rows * (h + 16)), (20, 20, 20)); d = ImageDraw.Draw(S)
for i, (im, f) in enumerate(zip(ims, fs)):
    x, y = (i % cols) * w, (i // cols) * (h + 16); S.paste(im.resize((w, h), Image.LANCZOS), (x, y)); d.text((x + 4, y + h + 2), f.split('/')[-1][:60], fill=(230, 230, 200))
S.save(out, quality=88)
