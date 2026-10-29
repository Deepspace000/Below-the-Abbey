import pathlib, numpy as np
from PIL import Image, ImageFilter
HERE = pathlib.Path(__file__).resolve().parent; OUT = HERE.parent.parent.parent / 'assets'
def cut(sheet, box, name, flip=False, maxh=420):
    im = Image.open(HERE / 'raw' / sheet).convert('RGB').crop(box)
    a = np.array(im).astype(float); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mag = np.clip(((np.minimum(r, b) - g) - 50) / 70.0, 0, 1); alpha = 1 - mag
    sp = np.clip(np.minimum(r, b) - g, 0, None) * (alpha < 1)
    a[..., 0] = np.where(alpha < 1, r - sp * .85, r); a[..., 2] = np.where(alpha < 1, b - sp * .85, b)
    al = np.array(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)))
    pic = Image.fromarray(np.dstack([a.clip(0, 255), al]).astype(np.uint8), 'RGBA')
    pic = pic.crop(pic.getchannel('A').point(lambda v: 255 if v > 30 else 0).getbbox())
    if flip: pic = pic.transpose(Image.FLIP_TOP_BOTTOM)
    if pic.height > maxh: pic = pic.resize((max(1, round(pic.width * maxh / pic.height)), maxh), Image.LANCZOS)
    pic.save(OUT / ('ds_' + name + '.png'), optimize=True); print(name, pic.size)
cut('sheet2.png', (700, 5, 910, 268), 'bl_stilt1')
cut('sheet2.png', (615, 285, 940, 545), 'bl_stilt2')
cut('sheet2.png', (110, 25, 410, 229), 'bl_ibell2', flip=True)
cut('sheet1.png', (135, 295, 255, 540), 'bl_hang1', maxh=380)
cut('sheet1.png', (735, 285, 960, 540), 'bl_hang2', maxh=380)
