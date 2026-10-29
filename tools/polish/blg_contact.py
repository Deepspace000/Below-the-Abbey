import sys, glob, pathlib
from PIL import Image
fs = sorted(glob.glob('assets/ds_bl_*.png')); W = 6; cw, ch = 200, 260
sh = Image.new('RGB', (cw * W, ch * ((len(fs) + W - 1) // W)), (120, 130, 115))
for i, f in enumerate(fs):
    p = Image.open(f); p.thumbnail((cw - 8, ch - 8)); sh.paste(p, ((i % W) * cw + 4, (i // W) * ch + ch - 4 - p.height), p)
sh.save(sys.argv[1])
