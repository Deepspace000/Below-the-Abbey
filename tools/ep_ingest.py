"""Cuts Gemini sheets for the early-game polish (src/desert/early_polish.js) into assets/ep/.

    python tools/ep_ingest.py decal  <sheet> cols rows names=a,b,c,...  [size=192] [feather=.22] [skip=3,7]
    python tools/ep_ingest.py sprite <sheet> cols rows names=a,b,c,...  [px=512] [skip=..]
    python tools/ep_ingest.py tex    <sheet> cols rows names=a,b,c,...  [seam=mirror|xy|x] [margin=.04]

decal:  pieces on flat magenta, keyed out, cropped square, soft ragged feathered edge -> assets/ep/dc_<name>.webp
sprite: props on flat magenta, keyed out, cropped to the piece, bottom edge kept    -> assets/ep/<name>.webp (px tall at most)
tex:    edge-to-edge swatches -> 128x128 tiles (mirror = tiles both ways, x = sideways seam blend) -> assets/ep/tex_<name>.webp
Every cut is listed in assets/ep/list.json (name -> file, w, h, kind). Pieces with too little content are skipped (and so take no name).
"""
import sys, json, pathlib
import numpy as np
from PIL import Image, ImageFilter

mode, src, cols, rows = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
opts = dict(a.split('=', 1) for a in sys.argv[5:] if '=' in a)
names = opts['names'].split(',')
skip = set(int(v) for v in opts.get('skip', '').split(',') if v)
OUT = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ep'
OUT.mkdir(exist_ok=True)
LST = OUT / 'list.json'
lst = json.loads(LST.read_text()) if LST.exists() else {}
im = Image.open(src).convert('RGB'); A = np.asarray(im).astype(np.float32)
H, W = A.shape[:2]
rng = np.random.default_rng(11)


def magness(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g
    return np.clip((m - 40) / 70, 0, 1) * (np.abs(r - b) < 110)


def defringe(c, m):
    fr = (m < .97)[..., None]
    neu = c.copy(); neu[..., 0] = np.minimum(c[..., 0], c[..., 1] * 1.15 + 10); neu[..., 2] = np.minimum(c[..., 2], c[..., 1] * 1.15 + 10)
    return np.where(fr, neu, c)


k = 0
for j in range(rows):
    for i in range(cols):
        idx = j * cols + i
        if idx in skip:
            continue
        if k >= len(names):
            break
        cell = A[int(j * H / rows):int((j + 1) * H / rows), int(i * W / cols):int((i + 1) * W / cols)]
        ins = float(opts.get('inset', 0))
        if ins:
            ch, cw = cell.shape[:2]; cell = cell[int(ch * ins):int(ch * (1 - ins)), int(cw * ins):int(cw * (1 - ins))]
        nm = names[k]
        if mode == 'tex':
            mg = float(opts.get('margin', .04)); h, w = cell.shape[:2]
            c = cell[int(h * mg):int(h * (1 - mg)), int(w * mg):int(w * (1 - mg))]
            t = Image.fromarray(c.clip(0, 255).astype(np.uint8)).resize((256, 256), Image.LANCZOS)
            a = np.asarray(t).astype(np.float32)
            seam = opts.get('seam', 'mirror')
            if seam == 'mirror':
                top = np.concatenate([a, a[:, ::-1]], 1); a = np.concatenate([top, top[::-1]], 0)
            elif seam in ('x', 'xy'):
                B = 48; tt = (np.arange(B) / B)[None, :, None]
                L = a[:, :B].copy(); R = a[:, -B:].copy()
                a[:, -B:] = R * (1 - tt) + L[:, ::-1] * tt   # the right edge melts into a mirror of the left edge, so the tile wraps
                if seam == 'xy':
                    T = a[:B].copy(); Bo = a[-B:].copy(); ty = (np.arange(B) / B)[:, None, None]
                    a[-B:] = Bo * (1 - ty) + T[::-1] * ty
            out = Image.fromarray(a.clip(0, 255).astype(np.uint8)).resize((128, 128), Image.LANCZOS)
            fn = 'tex_' + nm + '.webp'; out.save(OUT / fn, quality=92)
            lst['tex_' + nm] = {'file': fn, 'w': 128, 'h': 128, 'kind': 'tex', 'sheet': pathlib.Path(src).stem}
            print('tex_' + nm); k += 1; continue
        mg = magness(cell); fg = mg < .5
        ys, xs = np.nonzero(fg)
        if len(xs) < 300:
            continue
        if mode == 'decal':
            SIZE = int(opts.get('size', 192)); FEA = float(opts.get('feather', .22))
            y0, y1, x0, x1 = np.percentile(ys, 1), np.percentile(ys, 99), np.percentile(xs, 1), np.percentile(xs, 99)
            cy, cx, r = (y0 + y1) / 2, (x0 + x1) / 2, max(y1 - y0, x1 - x0) / 2 + 4
            Y0, X0 = int(max(0, cy - r)), int(max(0, cx - r)); Y1, X1 = int(min(cell.shape[0], cy + r)), int(min(cell.shape[1], cx + r))
            c = cell[Y0:Y1, X0:X1].copy(); m = 1 - magness(c); c = defringe(c, m)
            h, w = m.shape
            mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(max(2, w * .02)))
            m = np.asarray(mi).astype(np.float32) / 255
            yy, xx = np.mgrid[0:h, 0:w]; ang = np.arctan2(yy - h / 2, xx - w / 2); rr = np.hypot((yy - h / 2) / (h / 2), (xx - w / 2) / (w / 2))
            ph = rng.uniform(0, 6.28, 3)
            edge = 1 - FEA * (.6 + .25 * np.sin(ang * 3 + ph[0]) + .15 * np.sin(ang * 7 + ph[1]) + .1 * np.sin(ang * 13 + ph[2]))
            fade = np.clip((edge - rr) / FEA, 0, 1); fade = fade * fade * (3 - 2 * fade)
            a = np.clip(m * fade, 0, 1)
            out = Image.fromarray(np.dstack([np.clip(c, 0, 255), a * 255]).astype(np.uint8), 'RGBA').resize((SIZE, SIZE), Image.LANCZOS)
            fn = 'dc_' + nm + '.webp'; out.save(OUT / fn, quality=88)
            lst['dc_' + nm] = {'file': fn, 'w': SIZE, 'h': SIZE, 'kind': 'decal', 'sheet': pathlib.Path(src).stem}
            print('dc_' + nm)
        else:
            PX = int(opts.get('px', 512))
            y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            c = cell[y0:y1, x0:x1].copy(); m = 1 - magness(c); c = defringe(c, m)
            mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.8))
            out = Image.fromarray(np.dstack([np.clip(c, 0, 255), np.asarray(mi)]).astype(np.uint8), 'RGBA')
            if out.height > PX:
                out = out.resize((max(1, round(out.width * PX / out.height)), PX), Image.LANCZOS)
            fn = nm + '.webp'; out.save(OUT / fn, quality=90)
            lst[nm] = {'file': fn, 'w': out.width, 'h': out.height, 'kind': 'sprite', 'sheet': pathlib.Path(src).stem}
            print(nm, out.width, out.height)
        k += 1
LST.write_text(json.dumps(lst, indent=0))
