"""Cuts the painted title logo (made in Gemini on flat magenta) into a transparent webp for the title screen.

    python tools/ingest_title.py <sheet.png> [name=title_logo] [width=1100] [A=x0,y0,x1,y1] [win=x,y]     (one picture of the whole logo)
    python tools/ingest_title.py --pieces <A.png> <below_the.png> <bbey.png> [name] [layout=drop|stack] [A_w=108 asc=52 below_h=36 ...]   (three pieces, see LAYOUT)

  -> assets/ui/<name>.webp          the logo, cropped to what is in it, scaled to <width> px wide
  -> src/desert/titlelogo.js        gets the measurements and a small 480 px copy (a data: address) for the loading screen
Prints the box of the illuminated A as fractions of the cropped picture (give A=x0,y0,x1,y1 in the source sheet's pixels to
measure it; the game uses it for the slow golden glint). The magenta is keyed out by unmixing: every edge pixel is
treated as a blend of the picture colour (taken from the nearest solid pixel) and the local background, so no pink fringe is left.
"""
import sys, pathlib, json
import numpy as np
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'ui'
OUT.mkdir(exist_ok=True)


def shift(a, dy, dx):
    return np.roll(np.roll(a, dy, 0), dx, 1)


def propagate(col, known, iters):
    """spread the colours of known pixels outward over unknown ones, iters pixels deep (mean of the known 8 neighbours)"""
    col = col.copy(); known = known.copy()
    for _ in range(iters):
        acc = np.zeros_like(col); cnt = np.zeros(known.shape, float)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dy == 0 and dx == 0: continue
                k = shift(known, dy, dx)
                acc += shift(col, dy, dx) * k[..., None]; cnt += k
        new = (~known) & (cnt > 0)
        if not new.any(): break
        col[new] = acc[new] / cnt[new][..., None]; known = known | new
    return col, known


def key(rgb):
    a = rgb.astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mn = np.minimum(r, b)
    ratio = (mn - g) / np.maximum(mn, 30)
    bal = np.clip(1.5 * (1 - np.abs(r - b) / np.maximum(np.maximum(r, b), 1)), 0, 1)
    mag = ratio * bal
    bg = mag > 0.82          # surely background
    fg = mag < 0.30          # surely picture
    # tidy: the background must be connected to the edge region only through background; an isolated 'bg' speck inside a letter stays bg (counters are real holes)
    Mcol, _ = propagate(a, bg, 12)       # local background colour under the edge pixels
    Fcol, _ = propagate(a, fg, 12)       # local picture colour under the edge pixels
    unk = ~bg & ~fg
    d = Fcol - Mcol
    num = ((a - Mcol) * d).sum(-1); den = np.maximum((d * d).sum(-1), 1)
    # an edge pixel is p = a*F + (1-a)*M, so p - M = a (F - M)  and  a = (p-M).(F-M) / |F-M|^2
    alpha_u = np.clip(num / den, 0, 1)
    alpha = np.where(bg, 0.0, np.where(fg, 1.0, alpha_u))
    alpha = np.clip((alpha - 0.18) / 0.82, 0, 1)      # choke the faint pink halo a little
    alpha = np.where(alpha < 0.05, 0, alpha)
    # colours: only pixels well inside the picture keep their own colour; the others take the colour of the nearest solid pixel
    solid = alpha > 0.98
    inner = solid.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            inner &= shift(solid, dy, dx)
    Fin, _ = propagate(a, inner, 10)
    out = np.where(inner[..., None], a, Fin)
    # in the edge zone (within 3 px of the transparent area) any pink left is turned to gold, then the fringe is gone for good
    clear = alpha < 0.5
    zone = clear.copy()
    for _ in range(3):
        z = zone.copy()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                z |= shift(zone, dy, dx)
        zone = z
    hsv = np.array(Image.fromarray(out.clip(0, 255).astype(np.uint8)).convert('HSV')).astype(float)
    H, Sa, V = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    pink = zone & (H > 205) & (H < 246) & (Sa > 25)
    H = np.where(pink, 27 + (H - 205) * 0.05, H); Sa = np.where(pink, Sa * 0.85, Sa)
    out = np.array(Image.fromarray(np.dstack([H, Sa, V]).clip(0, 255).astype(np.uint8), 'HSV').convert('RGB')).astype(float)
    return out.clip(0, 255), alpha


def save_outputs(pic, name, width, info):
    """writes assets/ui/<name>.webp (scaled to <width> px wide) and, for the real logo, the measurements and the small loading-screen copy into titlelogo.js"""
    final = pic.resize((width, round(pic.height * width / pic.width)), Image.LANCZOS) if width != pic.width else pic
    final.save(OUT / (name + '.webp'), quality=93, method=6)
    small = pic.resize((480, round(pic.height * 480 / pic.width)), Image.LANCZOS)
    import io
    buf = io.BytesIO(); small.save(buf, 'WEBP', quality=78, method=6); small_bytes = buf.getvalue()   # only embedded in titlelogo.js, not a file in assets
    info['size'] = list(final.size); info['aspect'] = round(final.width / final.height, 4)
    print(json.dumps(info))
    # keep src/desert/titlelogo.js in step: the picture's measurements and the small copy (a data: address, so the loading screen can show it
    # at once and the itch.io picture-pack shim, which only holds back assets/ paths, leaves it alone)
    js = ROOT / 'src' / 'desert' / 'titlelogo.js'
    if js.exists() and name == 'title_logo':
        import base64, re
        b64 = base64.b64encode(small_bytes).decode()
        assert 'assets/' not in b64 and '?' not in b64 and '#' not in b64
        t = js.read_text(encoding='utf-8')
        meta = {k: info[k] for k in ('A', 'win', 'aspect', 'units') if k in info}
        t = re.sub(r'^const TL_META=.*$', lambda m: 'const TL_META=' + json.dumps(meta, separators=(',', ':')) + ';', t, flags=re.M)
        t = re.sub(r'^const TL_SMALL=.*$', lambda m: "const TL_SMALL='data:image/webp;base64," + b64 + "';", t, flags=re.M)
        js.write_text(t, encoding='utf-8'); print('updated', js.name, len(b64), 'bytes of data')



# ----- re-assembling the logo from three high-resolution painted pieces (the illuminated A, "Below the" and "bbey", each made as its own Gemini picture) -----
# Everything is measured in game design units (the canvas is 480x320 units, drawn at 2 px per unit); the composite has P px per unit, so the
# game's cache (2 px per unit) is an exact halving of it. The pieces keep their painted pixels: each is only reduced, never enlarged.
LAYOUT = dict(
    P=4.0,            # composite pixels per game unit
    A_w=108.0,        # width of the A panel's gold frame in units (79.6 in the first single-picture logo, 89 in the second)
    asc=52.0,         # height of the tall letters of "bbey" (ascender top to baseline) in units
    hang=6.0,         # (layout=stack) how far the A panel hangs below the baseline of "bbey"
    gapx=0.5,         # space between the A piece and the lettering
    align=1.0,        # (layout=drop) 1: "bbey" is spaced out so it ends where "Below the" ends
    below_h=36.0,     # height of the "Below the" picture in units
    gapy=1.2,         # (layout=stack) clear space between "Below the" and what is under it
    t_dx=0.0,         # (layout=drop) "Below the" is moved this far right of the column's left edge
    lock_gap=1.0,     # (layout=drop) "Below the" sits on top of "bbey" with only this much clear space above the b letters
    base_off=8.0,     # (layout=drop) the baseline of "bbey" is this far above the bottom of the A frame
)
A_FRAME = (112, 128, 912, 890)    # the gold frame of the panel in the A sheet (x0, y0, x1, y1), sheet pixels
A_CLIP = (122, 140, 902, 880)     # inside the frame: where the glint is clipped to
A_WIN = (516, 418)                # the lit window


def key_piece(path, pad=3):
    """one piece cut out of its magenta (cached next to the sheet as <sheet>.keyed.png, so changing the layout is quick)"""
    path = pathlib.Path(path); cache = path.with_name(path.stem + '.keyed.png')
    if cache.exists() and cache.stat().st_mtime >= path.stat().st_mtime:
        full = Image.open(cache).convert('RGBA')
    else:
        im = np.array(Image.open(path).convert('RGB'))
        rgb, alpha = key(im)
        full = Image.fromarray(np.dstack([rgb.astype(np.uint8), (alpha * 255).astype(np.uint8)]), 'RGBA'); full.save(cache)
    al = np.array(full.getchannel('A')) / 255.0
    ys, xs = np.where(al > 0.3)
    x0, y0, x1, y1 = max(0, xs.min() - pad), max(0, ys.min() - pad), min(full.width, xs.max() + 1 + pad), min(full.height, ys.max() + 1 + pad)
    pic = full.crop((x0, y0, x1, y1))
    return pic, (x0, y0), al[y0:y1, x0:x1]


def respace(B, bal, extra, gaps):
    """returns B with its letters moved apart: the four painted letters of "bbey" are found as separate blobs (the y keeps its own tail) and letter i is
    moved right by i*extra/gaps pixels, so the word is longer without any letter being stretched"""
    S = 4; h, w = bal.shape; hh, ww = h // S, w // S
    fg = bal[:hh * S, :ww * S].reshape(hh, S, ww, S).max(axis=(1, 3)) > 0.3
    d = fg                                                 # (no dilation: the tail of the y runs close under the e)
    lab = np.zeros((hh, ww), np.int32); n = 0; comps = {}
    from collections import deque
    for y0 in range(hh):
        for x0 in range(ww):
            if d[y0, x0] and not lab[y0, x0]:
                n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; pts = []
                while q:
                    y, x = q.popleft(); pts.append((y, x))
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = y + dy, x + dx
                            if 0 <= ny < hh and 0 <= nx < ww and d[ny, nx] and not lab[ny, nx]: lab[ny, nx] = n; q.append((ny, nx))
                comps[n] = np.array(pts)
    big = sorted([c for c in comps if len(comps[c]) > 150], key=lambda c: comps[c][:, 1].mean())
    if len(big) != gaps + 1:
        print('respace: found %d letters, expected %d, leaving the word as it is' % (len(big), gaps + 1)); return B
    # small specks (lichen) go to the nearest letter; every pixel of the full-size picture goes to the letter whose coarse blob is nearest
    out = Image.new('RGBA', (B.width + int(round(extra)), B.height), (0, 0, 0, 0))
    owner = np.full((hh, ww), -1, np.int32)
    for i, c in enumerate(big): owner[lab == c] = i
    ys, xs = np.where(owner < 0)
    mask_all = np.zeros((hh, ww), bool)
    # nearest letter for the unowned coarse cells that still hold picture (specks): by distance to letter blobs' pixels
    for y, x in zip(*np.where((lab > 0) & (owner < 0))):
        best, bi = 1e9, 0
        for i, c in enumerate(big):
            pts = comps[c]; dd = np.min((pts[:, 0] - y) ** 2 + (pts[:, 1] - x) ** 2)
            if dd < best: best, bi = dd, i
        owner[y, x] = bi
    own_full = np.kron(owner, np.ones((S, S), np.int32))
    own_full = np.pad(own_full, ((0, h - own_full.shape[0]), (0, w - own_full.shape[1])), mode='edge')
    arr = np.array(B)
    for i in range(len(big)):
        m = (own_full == i)
        mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))   # a little wider than the blob so soft edges are kept
        layer = arr.copy(); layer[..., 3] = (layer[..., 3].astype(float) * (np.array(mi) / 255.0)).astype(np.uint8)
        out.alpha_composite(Image.fromarray(layer, 'RGBA'), (int(round(i * extra / gaps)), 0))
    return out


def compose_main():
    args = [x for x in sys.argv[2:] if '=' not in x]
    opts = dict(x.split('=', 1) for x in sys.argv[2:] if '=' in x)
    L = dict(LAYOUT)
    for k in L:
        if k in opts: L[k] = float(opts[k])
    pathA, pathT, pathB = args[:3]
    name = args[3] if len(args) > 3 else 'title_logo'
    P = L['P']
    A, aoff, aal = key_piece(pathA); T, toff, tal = key_piece(pathT); B, boff, bal = key_piece(pathB)
    # measurements in native piece pixels
    frame_w = A_FRAME[2] - A_FRAME[0]
    sA = L['A_w'] * P / frame_w
    top_b = np.where(bal.max(1) > 0.5)[0].min()
    first_b = bal[:, : int(B.width * 0.22)]                 # the first b: its bottom is the baseline
    base_b = np.where(first_b.max(1) > 0.5)[0].max()
    sB = L['asc'] * P / (base_b - top_b)
    sT = L['below_h'] * P / T.height
    def rs(img, s): return img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS)
    Ts = rs(T, sT)
    if L.get('align', 1) and opts.get('layout', 'drop') == 'drop':
        # "bbey" is made as long as "Below the" by moving its four letters apart (they keep their own shape), so the right-hand ends line up
        want = (Ts.width - L['t_dx'] * P) / sB                  # the width "bbey" should have, in the piece's own pixels
        if want > B.width:
            B = respace(B, bal, want - B.width, 3)
            print('bbey letters moved apart by %.1f units each' % ((want - np.array(B).shape[1] + 0) * 0 + (B.width - bal.shape[1]) / 3 * sB / P))
    As, Bs = rs(A, sA), rs(B, sB)
    layout = opts.get('layout', 'drop')
    fb = (A_FRAME[3] - aoff[1]) * sA                         # frame bottom inside the scaled A piece
    ft = (A_FRAME[1] - aoff[1]) * sA                         # frame top
    fl = (A_FRAME[0] - aoff[0]) * sA
    if layout == 'drop':
        # the A stands at the left like a drop cap spanning both lines; "Below the" runs along the top to its right, "bbey" along the bottom.
        # y = 0 is the top of the A frame.
        ax, ay = 0, -ft
        rx = ax + As.width + L['gapx'] * P                   # the left edge of the right-hand column
        tx = rx + L['t_dx'] * P                               # "Below the": left edge of the right-hand column (moved by t_dx)
        base_y = fb - ft - L['base_off'] * P                 # the baseline of "bbey": a little above the frame bottom
        bx, by = rx, base_y - base_b * sB
        # "Below the" sits straight on top of "bbey": moved down until it is only lock_gap units clear of the tops of the b letters
        ta = np.array(Ts.getchannel('A')) > 40; ba_ = np.array(Bs.getchannel('A')) > 40
        ty = 1e9
        for c in range(Ts.width):
            xx = int(round(tx + c - bx))
            if 0 <= xx < Bs.width:
                tc = np.where(ta[:, c])[0]; bc = np.where(ba_[:, xx])[0]
                if len(tc) and len(bc): ty = min(ty, by + bc.min() - L['lock_gap'] * P - tc.max())
        if ty > 1e8: ty = 0.0
        # report the clear space between the two lines
        ta = np.array(Ts.getchannel('A')) > 40; ba_ = np.array(Bs.getchannel('A')) > 40
        gaps = []
        for c in range(Ts.width):
            xx = int(round(tx + c - bx))
            if 0 <= xx < Bs.width:
                tc = np.where(ta[:, c])[0]; bc = np.where(ba_[:, xx])[0]
                if len(tc) and len(bc): gaps.append((by + bc.min()) - (ty + tc.max()))
        print('smallest clear space between the lines: %.1f units' % (min(gaps) / P if gaps else 99))
    else:
        # line 2: the A piece, then "bbey". y = 0 is the baseline of "bbey"
        ax = 0
        ay = L['hang'] * P - fb
        bx = ax + As.width + L['gapx'] * P
        by = -(base_b * sB)
        # "Below the": centred over the A frame and "bbey", then moved up until nothing touches what is under it
        cx = (ax + fl + bx + Bs.width) / 2
        tx = cx - Ts.width / 2
        def top_profile(img, x0, y0, width):
            a = np.array(img.getchannel('A')) > 40
            prof = np.full(width, 1e9)
            for c in range(img.width):
                col = np.where(a[:, c])[0]
                if len(col) and 0 <= x0 + c < width: prof[int(x0 + c)] = y0 + col.min()
            return prof
        Wtot = int(max(ax + As.width, bx + Bs.width, tx + Ts.width) + 4)
        low = np.minimum(top_profile(As, ax, ay, Wtot + 4000), top_profile(Bs, bx, by, Wtot + 4000))
        ta = np.array(Ts.getchannel('A')) > 40
        ty = 1e9
        for c in range(Ts.width):
            col = np.where(ta[:, c])[0]
            xx = int(round(tx + c))
            if len(col) and 0 <= xx < len(low) and low[xx] < 1e8: ty = min(ty, low[xx] - L['gapy'] * P - col.max())
    # compose
    allx0 = min(ax, bx, tx); ally0 = min(ay, by, ty)
    CW = int(max(ax + As.width, bx + Bs.width, tx + Ts.width) - allx0 + 8); CH = int(max(ay + As.height, by + Bs.height, ty + Ts.height) - ally0 + 8)
    canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    def put(img, x, y): canvas.alpha_composite(img, (int(round(x - allx0 + 4)), int(round(y - ally0 + 4))))
    put(As, ax, ay); put(Bs, bx, by); put(Ts, tx, ty)
    # trim to the picture
    al = np.array(canvas.getchannel('A'))
    ys, xs = np.where(al > 40)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    canvas = canvas.crop(box)
    ox, oy = allx0 - 4 + box[0], ally0 - 4 + box[1]            # composite origin -> layout coordinates
    info = {'units': [round(canvas.width / P, 2), round(canvas.height / P, 2)], 'P': P, 'scales': [round(sA, 3), round(sT, 3), round(sB, 3)]}
    def frac(px, py): return [round((px - ox) / canvas.width, 4), round((py - oy) / canvas.height, 4)]
    cl = (A_CLIP[0] - aoff[0]) * sA + ax, (A_CLIP[1] - aoff[1]) * sA + ay, (A_CLIP[2] - aoff[0]) * sA + ax, (A_CLIP[3] - aoff[1]) * sA + ay
    p0, p1 = frac(cl[0], cl[1]), frac(cl[2], cl[3])
    info['A'] = [p0[0], p0[1], p1[0], p1[1]]
    info['win'] = frac((A_WIN[0] - aoff[0]) * sA + ax, (A_WIN[1] - aoff[1]) * sA + ay)
    info['aspect'] = round(canvas.width / canvas.height, 4)
    save_outputs(canvas, name, canvas.width, info)


def main():
    src = sys.argv[1]
    name = sys.argv[2] if len(sys.argv) > 2 and '=' not in sys.argv[2] else 'title_logo'
    opts = dict(x.split('=', 1) for x in sys.argv[2:] if '=' in x)
    width = int(opts.get('width', 1100))
    im = Image.open(src).convert('RGB')
    W0, H0 = im.size
    # work at 2x so the matte is smooth, then scale down
    S = 2
    big = im.resize((W0 * S, H0 * S), Image.LANCZOS)
    rgb, alpha = key(np.array(big))
    pic = Image.fromarray(np.dstack([rgb.astype(np.uint8), (alpha * 255).astype(np.uint8)]), 'RGBA')
    ys, xs = np.where(alpha > 0.35)
    # drop small specks far from the logo
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    pad = 6 * S
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(pic.width, box[2] + pad), min(pic.height, box[3] + pad))
    pic = pic.crop(box)
    info = {'box_src': [round(v / S) for v in box]}
    if 'A' in opts:
        x0, y0, x1, y1 = [int(v) * S for v in opts['A'].split(',')]
        info['A'] = [round((x0 - box[0]) / pic.width, 4), round((y0 - box[1]) / pic.height, 4), round((x1 - box[0]) / pic.width, 4), round((y1 - box[1]) / pic.height, 4)]
    if 'win' in opts:   # the lit window inside the A, in source pixels
        wx, wy = [int(v) * S for v in opts['win'].split(',')]
        info['win'] = [round((wx - box[0]) / pic.width, 4), round((wy - box[1]) / pic.height, 4)]
    save_outputs(pic, name, width, info)


if len(sys.argv) > 1 and sys.argv[1] == '--pieces':
    compose_main()
else:
    main()
