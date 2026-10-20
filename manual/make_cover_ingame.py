"""Below the Abbey: covers made ONLY of the game's own graphics (no new painting):

    python manual/make_cover_ingame.py                    the default four heroes, both covers
    python manual/make_cover_ingame.py 12 25 44 51        four other heroes (numbers 1 to 70, see manual/showcase/hero_portraits.png)
    python manual/make_cover_ingame.py --shoot            first take fresh screenshots of the real game (needs Playwright)
    python manual/make_cover_ingame.py --only landscape   (or portrait, compare)

  -> manual/showcase/game_cover_ingame.png   1260x1000 (5:4), the itch.io cover shape; the logo and the heroes stay central
  -> manual/cover_front_ingame.png           1800x2700 (6:9, 300 dpi), the front cover of the printed manual
  -> manual/showcase/cover_compare_all.png   every cover version that exists, side by side, labelled

Everything in the picture comes from the game:
  assets/ui/title_logo.webp                  the painted title logo (loaded fresh on every run; the layout follows its real shape)
  manual/portraits/ptNN.png                  the hero portraits (HEROES below, numbers 1 to 70 = file index + 1)
  manual/cover_art/ingame/quay_dawn.png      a real colour screenshot of the 3D view: the Oldhaven quay at dawn (level 304)
  manual/cover_art/ingame/map_world.jpg      the real world map screen, drawn by the game at 8x size, clouds switched off
  assets/*.png, assets/kh/*.webp, assets/uw_*.png   the painted creatures, ships, gargoyles, banners and item icons
Only the glue is made here: soft masks, fog, rim light, a warm key light, a gilded frame, the colour grade, the lettering.
Fixed seeds everywhere, so the same inputs always give the same pictures.
--shoot starts its own `python -m http.server` on a free port of its own (never port 8399) and stops it again afterwards.
"""
import os, sys, io, json, time, math, base64, socket, subprocess
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, 'assets')
ART = os.path.join(HERE, 'cover_art', 'ingame')
PORTRAITS = os.path.join(HERE, 'portraits')
LOGO = os.path.join(ASSETS, 'ui', 'title_logo.webp')
OUT_GAME = os.path.join(HERE, 'showcase', 'game_cover_ingame.png')
OUT_FRONT = os.path.join(HERE, 'cover_front_ingame.png')
OUT_GAME_GRIMY = os.path.join(HERE, 'showcase', 'game_cover_ingame_grimy.png')
OUT_FRONT_GRIMY = os.path.join(HERE, 'cover_front_ingame_grimy.png')
OUT_COMPARE = os.path.join(HERE, 'showcase', 'cover_compare_all.png')
FONT = 'C:/Windows/Fonts/OLDENGL.TTF'
GOLD_HI, GOLD_LO, GOLD_RULE = (250, 228, 160), (203, 152, 64), (222, 184, 92)

# ---- the four heroes, left to right: numbers 1 to 70 from manual/showcase/hero_portraits.png (file ptNN.png, NN = number - 1).
#      1 2 3 4 would be the ready-made party Aldric, Vesna, Orrin and Thessaly.  Or give them on the command line.
HEROES = [70, 59, 66, 58]

SEED = 20261020
SHOT_PORT = 8431


# ==================================================================================================================
#  taking the screenshots of the real game (only with --shoot, or when a file is missing)
# ==================================================================================================================
def _port_free(p):
    s = socket.socket()
    try:
        s.bind(('127.0.0.1', p)); return True
    except OSError:
        return False
    finally:
        s.close()


class Server:
    """A private `python -m http.server` for the repo, on its own port; stopped through its own handle."""
    def __enter__(self):
        port = SHOT_PORT
        while not _port_free(port) or port == 8399:
            port += 1
        self.port = port
        self.p = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1'], cwd=ROOT,
                                  stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(50):
            try:
                socket.create_connection(('127.0.0.1', port), timeout=.3).close(); break
            except OSError:
                time.sleep(.2)
        return self

    def __exit__(self, *a):
        self.p.terminate()
        try: self.p.wait(10)
        except Exception: self.p.kill()


JS_MAP = """async (a)=>{const S=a[0],z=a[1],cx=a[2],cy=a[3];
 window.mpWorldClouds=function(){}; G.flags.noFog=1;G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=true;
 G._wvT=1e9; G.wv={z:z,x:-(cx-240)*z,y:-(cy-160)*z};
 await new Promise(r=>setTimeout(r,1500));
 G.wv={z:z,x:-(cx-240)*z,y:-(cy-160)*z}; G._wvT=G.time;
 const w0=cv.width,h0=cv.height; cv.width=w0*S/2; cv.height=h0*S/2; render3D(); ctx.setTransform(S,0,0,S,0,0); G._wvT=G.time; ui(.016);
 const d=cv.toDataURL('image/png'); cv.width=w0; cv.height=h0; return d}"""


def shoot():
    """Colour screenshots of the real game: the 3D view at the quay at dawn, and the world map (8x size, no clouds)."""
    from playwright.sync_api import sync_playwright
    os.makedirs(ART, exist_ok=True)
    with Server() as srv, sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page(viewport={'width': 960, 'height': 640})
        pg.goto('http://127.0.0.1:%d/index.html?town=oldhaven&lvl=34' % srv.port); pg.wait_for_timeout(14000)
        pg.evaluate("khLoadAssets()")
        try: pg.wait_for_function("typeof KH_READY!=='undefined'&&KH_READY", timeout=60000)
        except Exception: pass
        # the map first (needs no particular place)
        d = pg.evaluate(JS_MAP, [8, .62, 300, 230])
        im = Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).convert('RGB')
        im.save(os.path.join(ART, 'map_world.jpg'), quality=95, subsampling=0)
        print('map', im.size)
        # then the 3D view: the pier at the Oldhaven quay (level 304) at dawn, colour, sharp, no scanlines
        pg.evaluate("G.flags.noFog=0;G.overview=false;G.world=false;GFX.scan=0;GFX.sharp=2;GFX.dither=1;G.crt=false;gfxApply()")
        for _ in range(3):
            pg.evaluate("goToLevel(304)"); pg.wait_for_timeout(1800)
            if pg.evaluate("LEVEL") == 304: break
        pg.evaluate("G.cut=null;G.talk=null;G.menu=null;if(G.inv)G.inv.open=false")
        # the pier is empty: the few people who stand on it are sent away (a screenshot only; nothing is saved)
        pg.evaluate("for(const d of G.decor){if(d.npc&&d.x>=36&&d.x<=44&&d.y>38&&d.y<=52)d.x=-100}")
        x, y, f = 40, 49, 0
        pg.evaluate("G.clock=%d;G.P.x=%d;G.P.y=%d;G.P.f=%d;G.P.angT=(%d-1)*Math.PI/2;G.C={x:%d,y:%d,a:G.P.angT};G.msgs=[]"
                    % (5.8 * 60, x, y, f, f, x, y))
        pg.wait_for_timeout(3000)
        png = pg.screenshot(clip={'x': 4, 'y': 36, 'width': 830, 'height': 378})
        Image.open(io.BytesIO(png)).convert('RGB').save(os.path.join(ART, 'quay_dawn.png'))
        print('quay shot saved')
        b.close()


def ensure_shots():
    if not (os.path.exists(os.path.join(ART, 'quay_dawn.png')) and os.path.exists(os.path.join(ART, 'map_world.jpg'))):
        print('screenshots missing: taking them from the running game (needs Playwright)')
        shoot()



# ==================================================================================================================
#  small image toolbox (float32 images, 0..1, shape H x W x 3 or H x W x 4 with straight alpha)
# ==================================================================================================================
def f32(im):
    return np.asarray(im, np.float32) / 255.


def to_img(a):
    return Image.fromarray((np.clip(a, 0, 1) * 255 + .5).astype(np.uint8))


def load_rgba(path):
    return f32(Image.open(path).convert('RGBA'))


def load_rgb(path):
    return f32(Image.open(path).convert('RGB'))


def asset(name):
    """A picture of the game by file name, looked for in assets/ and assets/kh/ (webp or png)."""
    for d in (ASSETS, os.path.join(ASSETS, 'kh')):
        for ext in ('', '.png', '.webp'):
            p = os.path.join(d, name + ext)
            if os.path.isfile(p):
                return p
    raise FileNotFoundError(name)


def defringe(a, thr=.9, r=2.0):
    """The painted sprites carry coloured fringes (pink, purple) where they were cut out. Pixels that are not solid take the colour
    of the solid pixels next to them, and the alpha is pulled in by a hair."""
    rgb, al = a[..., :3], a[..., 3]
    solid = (al >= thr).astype(np.float32)
    num = cv2.GaussianBlur(rgb * solid[..., None], (0, 0), r)
    den = cv2.GaussianBlur(solid, (0, 0), r)[..., None]
    fill = num / np.maximum(den, 1e-4)
    use = ((al < thr) & (den[..., 0] > .03))[..., None]
    rgb = np.where(use, fill, rgb)
    al = np.clip((al - .06) / .94, 0, 1)
    return np.dstack([rgb, al]).astype(np.float32)


def resize_rgba(a, w, h):
    """Resize in premultiplied colour, so no dark or light halos grow round the edge."""
    w, h = max(1, int(round(w))), max(1, int(round(h)))
    al = a[..., 3:4]
    pm = np.dstack([a[..., :3] * al, al]).astype(np.float32)
    interp = cv2.INTER_AREA if w < a.shape[1] else cv2.INTER_CUBIC
    pm = cv2.resize(pm, (w, h), interpolation=interp)
    al = np.clip(pm[..., 3:4], 0, 1)
    rgb = pm[..., :3] / np.maximum(al, 1e-4)
    return np.dstack([np.clip(rgb, 0, 1), al]).astype(np.float32)


def sprite(name, height=None, width=None, scale=None, crop=None, fringe=True, cut=0.0):
    """Loads a game picture, cleans its edge, optionally crops (l, t, r, b in px) and sizes it. `cut` removes the faint stains of
    near-transparent paint round some of the pictures (alpha below `cut` goes to nothing)."""
    a = load_rgba(asset(name))
    if crop:
        l, t, r, b = crop
        a = a[t:a.shape[0] - b if b else None, l:a.shape[1] - r if r else None]
    if cut:
        a = a.copy()
        a[..., 3] = np.clip((a[..., 3] - cut) / (1 - cut), 0, 1)
    if fringe:
        a = defringe(a)
    h0, w0 = a.shape[:2]
    if height:
        scale = height / h0
    elif width:
        scale = width / w0
    if scale and abs(scale - 1) > 1e-3:
        a = resize_rgba(a, w0 * scale, h0 * scale)
        if scale > 1.05:                                     # enlarged: a touch of sharpening on the colour only
            rgb = cv2.GaussianBlur(a[..., :3], (0, 0), 1.0)
            a[..., :3] = np.clip(a[..., :3] + .35 * (a[..., :3] - rgb), 0, 1)
    return a


def paste(cv, rgb, alpha, x, y, opacity=1.0):
    """Normal 'over' blend of rgb (h,w,3) with alpha (h,w) onto the canvas cv at (x, y); clipped at the edges."""
    H, W = cv.shape[:2]
    h, w = rgb.shape[:2]
    x0, y0, x1, y1 = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    if x1 <= x0 or y1 <= y0:
        return
    s = (slice(y0 - y, y1 - y), slice(x0 - x, x1 - x))
    al = (alpha[s] * opacity)[..., None]
    cv[y0:y1, x0:x1] = cv[y0:y1, x0:x1] * (1 - al) + rgb[s] * al


def place(cv, spr, x, y, opacity=1.0):
    paste(cv, spr[..., :3], spr[..., 3], int(round(x)), int(round(y)), opacity)


def add_light(cv, rgb, mask, x, y, k=1.0):
    """Adds light (screen-like, never beyond 1) from rgb (h,w,3) weighted by mask (h,w)."""
    H, W = cv.shape[:2]
    h, w = rgb.shape[:2]
    x0, y0, x1, y1 = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    if x1 <= x0 or y1 <= y0:
        return
    s = (slice(y0 - y, y1 - y), slice(x0 - x, x1 - x))
    add = rgb[s] * (mask[s] * k)[..., None]
    base = cv[y0:y1, x0:x1]
    cv[y0:y1, x0:x1] = 1 - (1 - base) * (1 - np.clip(add, 0, 1))


def smooth(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def fnoise(h, w, seed, cells=6, octaves=5, gain=.55):
    """Smooth fractal noise 0..1 (random grids, cubic-resized and summed). `cells` = grid cells along the width of the coarsest octave."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        gx = max(2, int(cells * 2 ** o))
        gy = max(2, int(round(gx * h / w)))
        g = rng.random((gy + 2, gx + 2)).astype(np.float32)
        out += amp * cv2.resize(g, (w + w // gx + 2, h + h // gy + 2), interpolation=cv2.INTER_CUBIC)[:h, :w]
        tot += amp
        amp *= gain
    out /= tot
    lo, hi = np.percentile(out, 2), np.percentile(out, 98)
    return np.clip((out - lo) / (hi - lo + 1e-6), 0, 1)


def unsharp(a, sigma=1.2, amount=.5):
    blur = cv2.GaussianBlur(a, (0, 0), sigma)
    return np.clip(a + amount * (a - blur), 0, 1)


def lum(a):
    return a[..., 0] * .299 + a[..., 1] * .587 + a[..., 2] * .114


def silhouette(spr, tone, k=.78, light=(0, -1), rim=(1.0, .62, .42), rim_k=.8, rim_w=3.0, keep=.5):
    """Turns a painted creature into a hazed, backlit silhouette: its own colours shrink to a dark tone mixed with `keep` of its detail,
    and a rim of warm light runs along the edges that face `light` (a direction vector, y down)."""
    rgb, al = spr[..., :3], spr[..., 3]
    tone = np.array(tone, np.float32)
    detail = lum(spr)[..., None] * (.6 + .4 * rgb / np.maximum(lum(spr)[..., None], .05))
    dark = tone * (.55 + 1.6 * detail * keep)
    col = np.clip(rgb * (1 - k) + dark * k, 0, 1)
    blur = cv2.GaussianBlur(al, (0, 0), rim_w)
    gx = cv2.Sobel(blur, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(blur, cv2.CV_32F, 0, 1, ksize=3)
    mag = np.sqrt(gx * gx + gy * gy) + 1e-6
    nx, ny = -gx / mag, -gy / mag                                  # outward normal
    lx, ly = light
    ln = math.hypot(lx, ly)
    face = np.clip((nx * lx + ny * ly) / ln, 0, 1)
    er = cv2.erode(al, np.ones((3, 3), np.uint8), iterations=int(max(1, rim_w)))
    band = np.clip(al - cv2.GaussianBlur(er, (0, 0), rim_w * .6), 0, 1)
    r = np.clip(band * (.3 + .7 * face) * 2.2, 0, 1)[..., None] * np.array(rim, np.float32) * rim_k
    out = np.clip(col + r, 0, 1)
    return np.dstack([out, al]).astype(np.float32)


def vgrad(h, stops):
    """Vertical gradient from (position 0..1, (r,g,b)) stops -> h x 1 x 3."""
    ys = np.linspace(0, 1, h)
    pos = [s[0] for s in stops]
    out = np.stack([np.interp(ys, pos, [s[1][c] for s in stops]) for c in range(3)], -1)
    return out[:, None, :].astype(np.float32)


def soft_rect_mask(h, w, top=0, bottom=0, left=0, right=0):
    y = np.ones(h, np.float32)
    x = np.ones(w, np.float32)
    if top: y *= smooth(np.arange(h) / top)
    if bottom: y *= smooth((h - 1 - np.arange(h)) / bottom)
    if left: x *= smooth(np.arange(w) / left)
    if right: x *= smooth((w - 1 - np.arange(w)) / right)
    return y[:, None] * x[None, :]


def fog_band(h, w, seed, y0, y1, strength, cells=5, x0=0, x1=None):
    """A bank of mist: alpha 0..strength, thickest at the middle of y0..y1 and broken up by noise."""
    n = fnoise(h, w, seed, cells, 5)
    y = np.arange(h, dtype=np.float32)[:, None]
    prof = np.exp(-((y - (y0 + y1) / 2) / ((y1 - y0) / 2 + 1e-6)) ** 2)
    al = np.clip(prof * (.25 + 1.1 * n ** 1.3), 0, 1) * strength
    if x1 is not None:
        xs = np.arange(w, dtype=np.float32)[None, :]
        al = al * smooth((xs - x0) / 80) * smooth((x1 - xs) / 80)
    return al.astype(np.float32)


def add_fog(cv, alpha, color):
    a = alpha[..., None]
    cv[:] = cv * (1 - a) + np.array(color, np.float32) * a


def glow(cv, thr=.62, sigma=14, k=.30, tint=(1.0, .86, .7)):
    l = lum(cv)
    hi = np.clip((l - thr) / (1 - thr), 0, 1)[..., None] * cv
    g = cv2.GaussianBlur(hi, (0, 0), sigma) * np.array(tint, np.float32) * k
    cv[:] = 1 - (1 - cv) * (1 - np.clip(g, 0, 1))


def grade(cv, seed, shadow=(.10, .07, .20), warm=(1.05, 1.0, .90), sat=1.12, contrast=1.10, vig=.40, grain=.012, lift=.88):
    """The unifying finish: split-toned shadows, warm highlights, a little contrast and colour, soft vignette, film grain."""
    H, W = cv.shape[:2]
    cv[:] = np.clip(cv, 0, 1) ** lift                        # lifts the dark mid-tones a little (the contrast pass below keeps the punch)
    l = lum(cv)[..., None]
    s = (1 - l) ** 2.2 * .26
    cv[:] = cv * (1 - s) + np.array(shadow, np.float32) * s
    hw = smooth((l - .45) / .5)
    cv[:] = cv * (1 - hw) + cv * np.array(warm, np.float32) * hw
    l = lum(cv)[..., None]
    cv[:] = np.clip(l + (cv - l) * sat, 0, 1)
    cv[:] = np.clip((cv - .5) * contrast + .5, 0, 1)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H * .47) / (H / 2)) ** 2) / 1.38
    v = 1 - vig * np.clip(r, 0, 1) ** 2.6
    cv[:] = cv * v[..., None] + np.array((.03, .02, .06), np.float32) * (1 - v[..., None]) * .5
    rng = np.random.default_rng(seed)
    g = rng.normal(0, grain, (H, W, 1)).astype(np.float32)
    cv[:] = np.clip(cv + g * (.4 + .6 * (1 - l)), 0, 1)


# ==================================================================================================================
#  the parts of the poster
# ==================================================================================================================
def prep_scene(width):
    """The real 3D screenshot (the Oldhaven quay at dawn), cleaned up and enlarged to `width`: the save icon in the corner painted
    out, the game's dither and hatch softened without softening the edges, then a gentle sharpening."""
    im = load_rgb(os.path.join(ART, 'quay_dawn.png'))
    u8 = (im * 255).astype(np.uint8)
    m = np.zeros(u8.shape[:2], np.uint8)
    m[0:16, 0:30] = 255                                       # the save icon
    m[0:36, 316:398] = 255                                    # the big banner hanging at the very top (it would stand half-transparent in the mist)
    u8 = cv2.inpaint(u8, m, 4, cv2.INPAINT_TELEA)
    im = u8.astype(np.float32) / 255
    im = cv2.bilateralFilter(im, 5, .07, 3)
    s = width / im.shape[1]
    big = cv2.resize(im, (int(round(width)), int(round(im.shape[0] * s))), interpolation=cv2.INTER_CUBIC)
    big = unsharp(big, 1.5, .6)
    # the pier in the foreground is out of focus (and so loses the blocks of the 3D view's own small pixels)
    h = big.shape[0]
    soft = cv2.GaussianBlur(big, (0, 0), max(1.5, s * 2.0))
    t = smooth((np.arange(h, dtype=np.float32) / h - .50) / .38)[:, None, None]
    return big * (1 - t) + soft * t


def map_crop(box, width):
    """A piece of the real world-map screen. box = (left, top, right, bottom) in the 3840x2560 picture."""
    m = load_rgb(os.path.join(ART, 'map_world.jpg'))
    l, t, r, b = box
    m = m[t:b, l:r]
    s = width / m.shape[1]
    return cv2.resize(m, (int(round(width)), int(round(m.shape[0] * s))), interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC)


def make_sky(W, H, seed, stops, cloud_rows=None):
    """Dawn sky: a gradient and a few streaky clouds (noise), warm at the horizon, indigo overhead."""
    sky = np.tile(vgrad(H, stops), (1, W, 1))
    n1 = fnoise(max(8, H // 5), W, seed, 3, 5)
    n1 = cv2.resize(n1, (W, H), interpolation=cv2.INTER_CUBIC)
    n2 = cv2.resize(fnoise(max(8, H // 12), W, seed + 1, 5, 4), (W, H), interpolation=cv2.INTER_CUBIC)
    c = np.clip((n1 * .7 + n2 * .3 - .42) * 2.2, 0, 1)
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    warm = np.array((1.0, .66, .55), np.float32)
    cool = np.array((.34, .24, .46), np.float32)
    cl = cool * (1 - y[..., None] * .8) + warm * (y[..., None] * .8)
    sky = sky * (1 - c[..., None] * .55) + cl * c[..., None] * .55
    return sky


def radial(h, w, cx, cy, rx, ry, power=2.0):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    return np.clip(1 - d, 0, 1) ** power


def shadow_of(spr, blur, dy, dx=0, strength=.6):
    """A soft contact shadow of a sprite: returns (mask, x pad). Draw it with paste(cv, dark, mask, ...)."""
    al = spr[..., 3]
    pad = int(blur * 3 + abs(dy) + abs(dx))
    big = np.pad(al, pad)
    M = np.float32([[1, 0, dx], [0, 1, dy]])
    big = cv2.warpAffine(big, M, (big.shape[1], big.shape[0]))
    return cv2.GaussianBlur(big, (0, 0), blur) * strength, pad


def drop_shadow(cv, spr, x, y, blur=8, dy=8, dx=0, strength=.55, color=(.02, .015, .03)):
    m, pad = shadow_of(spr, blur, dy, dx, strength)
    dark = np.zeros(m.shape + (3,), np.float32) + np.array(color, np.float32)
    paste(cv, dark, m, int(round(x)) - pad, int(round(y)) - pad)


def rotate_rgba(a, deg, expand=True):
    h, w = a.shape[:2]
    rad = math.radians(deg)
    nw = int(abs(w * math.cos(rad)) + abs(h * math.sin(rad))) + 2
    nh = int(abs(h * math.cos(rad)) + abs(w * math.sin(rad))) + 2
    M = cv2.getRotationMatrix2D((w / 2, h / 2), deg, 1.0)
    M[0, 2] += (nw - w) / 2
    M[1, 2] += (nh - h) / 2
    pm = np.dstack([a[..., :3] * a[..., 3:4], a[..., 3:4]]).astype(np.float32)
    pm = cv2.warpAffine(pm, M, (nw, nh), flags=cv2.INTER_CUBIC, borderValue=(0, 0, 0, 0))
    al = np.clip(pm[..., 3:4], 0, 1)
    return np.dstack([np.clip(pm[..., :3] / np.maximum(al, 1e-4), 0, 1), al]).astype(np.float32)


def flip_h(a):
    return np.ascontiguousarray(a[:, ::-1])


def hero_card(n, S, f, seed=0):
    """One hero: the 192 px portrait stepped to S px (a light unsharp, never stretched) in a dark-gold frame f px wide, lit from the
    top left, with an inner shadow so the black backgrounds of the portraits sit quietly. Returns an RGB float image (square)."""
    p = os.path.join(PORTRAITS, 'pt%02d.png' % (n - 1))
    if not os.path.isfile(p):
        raise SystemExit('no portrait %d (expected %s); the numbers run from 1 to 70' % (n, p))
    im = load_rgba(p)[..., :3]
    if S != im.shape[0]:
        # the portraits are pixel art: repeat each pixel 4 times, then step down with area averaging. Edges stay crisp, nothing is
        # smeared by a soft upscale, and the stepping down is a clean average (never a stretch).
        im = np.repeat(np.repeat(im, 4, 0), 4, 1)
        im = cv2.resize(im, (S, S), interpolation=cv2.INTER_AREA)
    im = unsharp(np.clip(im, 0, 1), 1.0, .22)
    T = S + 2 * f
    yy, xx = np.mgrid[0:T, 0:T].astype(np.float32)
    # the picture, with an inner shadow along the frame
    din = np.minimum(np.minimum(xx - f, T - 1 - f - xx), np.minimum(yy - f, T - 1 - f - yy))
    ish = 1 - .62 * np.exp(-np.maximum(din, 0) / (S * .045))
    card = np.zeros((T, T, 3), np.float32)
    card[f:f + S, f:f + S] = im
    card = card * np.where(din >= 0, ish, 1)[..., None]
    # a warm light from the top left falls on the picture
    lit = radial(T, T, T * .12, T * .06, T * 1.0, T * 1.0, 2.2)
    card = 1 - (1 - card) * (1 - np.array((1.0, .72, .45), np.float32) * (lit * .20)[..., None])
    # the frame: mitred, bevelled (light on the top and left of the outer bevel, on the bottom and right of the inner one)
    dl, dr, dt, db = xx, T - 1 - xx, yy, T - 1 - yy
    dout = np.minimum(np.minimum(dl, dr), np.minimum(dt, db))
    side = np.argmin(np.stack([dt, dl, db, dr]), axis=0)
    toward = np.where(side <= 1, 1.0, -1.0).astype(np.float32)          # top and left edges face the light
    t = np.clip(dout / f, 0, 1)
    shade = np.where(t < .34, .56 + .36 * toward, np.where(t > .66, .56 - .36 * toward, .56))
    rng = np.random.default_rng(seed + n)
    shade = np.clip(shade + cv2.GaussianBlur(rng.normal(0, 1, (T, T)).astype(np.float32), (0, 0), 1.1) * .06, 0, 1)[..., None]
    lo, hi = np.array(GOLD_LO, np.float32) / 255 * .72, np.array(GOLD_HI, np.float32) / 255
    gold = lo * (1 - shade) + hi * shade
    for tt, wid, dk in ((.34, .04, .55), (.66, .04, .55), (0.0, .07, .45)):
        ln = np.clip(1 - np.abs(t - tt) / wid, 0, 1)[..., None] * dk
        gold = gold * (1 - ln) + np.array((.10, .06, .02), np.float32) * ln
    for cx, cy in ((f / 2, f / 2), (T - 1 - f / 2, f / 2), (f / 2, T - 1 - f / 2), (T - 1 - f / 2, T - 1 - f / 2)):
        r = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        st = np.clip(1 - r / (f * .46), 0, 1)
        hl = np.clip(1 - np.sqrt((xx - cx + f * .12) ** 2 + (yy - cy + f * .12) ** 2) / (f * .26), 0, 1)
        stud = np.clip(lo * .6 + (hi - lo * .6) * (.35 + .65 * st[..., None]) + hl[..., None] * .35, 0, 1)
        gold = np.where((st > 0)[..., None], stud, gold)
    card = np.where((dout < f)[..., None], gold, card)
    return card


def load_logo():
    for _ in range(12):                                       # the title artist may be writing the file just now
        try:
            im = Image.open(LOGO); im.load(); return im.convert('RGBA')
        except Exception:
            time.sleep(1.0)
    raise SystemExit('cannot read ' + LOGO)


def up_sharpen(im):
    return im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=28, threshold=3))


def put_logo(canvas, logo_w, logo_top, logo_max_h, halo=1.0, glow_k=.62, brighten=.93):
    """The painted title logo, loaded fresh, centred. Behind it a soft dark glow (so it reads on any picture), then a gentle warm
    golden outer glow, and the logo itself lifted a touch (gamma `brighten`; the sandstone and the illuminated A stay crisp)."""
    logo = load_logo()
    src_w = logo.width
    w = logo_w
    h = round(logo.height * w / logo.width)
    if h > logo_max_h:
        h = logo_max_h; w = round(logo.width * h / logo.height)
    logo = logo.resize((w, h), Image.LANCZOS)
    if w > src_w:
        a = logo.getchannel('A')
        logo = up_sharpen(logo.convert('RGB')).convert('RGBA'); logo.putalpha(a)
    W, H = canvas.size
    x, y = (W - w) // 2, logo_top
    al = Image.new('L', (W, H), 0)
    al.paste(logo.getchannel('A'), (x, y))
    wide = al.filter(ImageFilter.GaussianBlur(w * .06)).point(lambda v: min(255, int(v * 2.1)))
    tight = al.filter(ImageFilter.GaussianBlur(w * .014)).point(lambda v: min(255, int(v * 2.6)))
    hl = np.maximum(np.asarray(wide).astype(np.float32) * .62, np.asarray(tight).astype(np.float32) * .85) * halo
    layer = Image.new('RGBA', (W, H), (10, 7, 14, 0))
    layer.putalpha(Image.fromarray(hl.clip(0, 255).astype(np.uint8)))
    canvas = Image.alpha_composite(canvas, layer)
    # the warm golden glow (screen blend, so it only ever adds light)
    a_arr = np.asarray(al).astype(np.float32) / 255
    canvas = add_title_glow(canvas, a_arr, w, glow_k)
    rgb = np.asarray(logo.convert('RGB')).astype(np.float32) / 255
    rgb = np.clip(rgb ** brighten, 0, 1)
    lg = Image.fromarray((rgb * 255 + .5).astype(np.uint8)).convert('RGBA')
    lg.putalpha(logo.getchannel('A'))
    top = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    top.paste(lg, (x, y), lg)
    return Image.alpha_composite(canvas, top), (x, y, w, h)


def add_title_glow(canvas, alpha, w, k, tint=(1.0, .76, .38)):
    """A gentle golden outer glow around the logo (a wide soft one and a tight one), screened onto an RGBA PIL canvas."""
    wide = np.clip(cv2.GaussianBlur(alpha, (0, 0), w * .045) * 1.9, 0, 1)
    mid = np.clip(cv2.GaussianBlur(alpha, (0, 0), w * .018) * 1.6, 0, 1)
    tight = np.clip(cv2.GaussianBlur(alpha, (0, 0), w * .006) * 1.3, 0, 1)
    g = np.clip(.40 * wide + .38 * mid + .30 * tight, 0, 1) * k
    base = np.asarray(canvas.convert('RGB')).astype(np.float32) / 255
    out = 1 - (1 - base) * (1 - g[..., None] * np.array(tint, np.float32))
    res = Image.fromarray((np.clip(out, 0, 1) * 255 + .5).astype(np.uint8)).convert('RGBA')
    return res


def gold_text(canvas, text, size, cx, cy, glow_k=1.0):
    """Black-letter lettering in gold with a dark edge and shadow (same look as the other covers)."""
    font = ImageFont.truetype(FONT, size)
    l, t, r, b = font.getbbox(text)
    pad = int(size * .7)
    tw, th = r - l, b - t
    tile = (tw + 2 * pad, th + 2 * pad)
    pos = (pad - l, pad - t)
    fill = Image.new('L', tile, 0); ImageDraw.Draw(fill).text(pos, text, font=font, fill=255)
    sw = max(2, size // 20)
    edge = Image.new('L', tile, 0); ImageDraw.Draw(edge).text(pos, text, font=font, fill=255, stroke_width=sw)
    sh = Image.new('L', tile, 0); sh.paste(edge, (sw, sw))
    sh = sh.filter(ImageFilter.GaussianBlur(size / 12)).point(lambda v: min(255, int(v * 1.5 * glow_k)))
    ys = np.linspace(0, 1, tile[1], dtype=np.float32)[:, None, None]
    lo, hi = np.array(GOLD_LO, np.float32), np.array(GOLD_HI, np.float32)
    g = (hi * (1 - ys) + lo * ys) * np.ones((1, tile[0], 1), np.float32)
    grad = Image.fromarray(g.astype(np.uint8)).convert('RGBA')
    lay = Image.new('RGBA', tile, (0, 0, 0, 0))
    lay = Image.alpha_composite(lay, Image.merge('RGBA', (*[Image.new('L', tile, 0)] * 3, sh)))
    lay = Image.alpha_composite(lay, Image.merge('RGBA', (*[Image.new('L', tile, c) for c in (38, 22, 8)], edge)))
    grad.putalpha(fill)
    lay = Image.alpha_composite(lay, grad)
    px, py = int(cx - tile[0] / 2), int(cy - tile[1] / 2)
    base = canvas.crop((px, py, px + tile[0], py + tile[1]))
    canvas.paste(Image.alpha_composite(base, lay), (px, py))
    return canvas


def gold_frame(canvas, outer, inner):
    W, H = canvas.size
    d = ImageDraw.Draw(canvas)
    s = max(1, round(W / 420))
    d.rectangle((outer - 1, outer - 1, W - outer, H - outer), outline=(10, 7, 12, 255), width=1)
    d.rectangle((outer, outer, W - 1 - outer, H - 1 - outer), outline=GOLD_RULE + (255,), width=s * 2)
    d.rectangle((inner, inner, W - 1 - inner, H - 1 - inner), outline=GOLD_RULE + (255,), width=max(1, s - 1))
    return canvas


# ==================================================================================================================
#  the landscape cover, 1260 x 1000
# ==================================================================================================================
def giant(cv, name, xc, top, height, tone, light, flip=False, opacity=.95, keep=.5, rim_k=.8, crop=None, mist=(.62, .45, .55), fade=(.35, 1.0, .85)):
    """A great creature as a backlit, hazed silhouette that thickens into mist toward its feet: fade = (from, to, mist strength at `to`)."""
    s = sprite(name, height=height, crop=crop, cut=.30)
    if flip:
        s = flip_h(s)
    s = silhouette(s, tone, k=.80, light=light, rim_k=rim_k, keep=keep, rim_w=3.0)
    h = s.shape[0]
    t = smooth((np.arange(h, dtype=np.float32) / h - fade[0]) / (fade[1] - fade[0])) * fade[2]
    s[..., :3] = s[..., :3] * (1 - t[:, None, None]) + np.array(mist, np.float32) * t[:, None, None]
    place(cv, s, xc - s.shape[1] / 2, top, opacity)
    return s


def haze(spr, color, k):
    out = spr.copy()
    out[..., :3] = out[..., :3] * (1 - k) + np.array(color, np.float32) * k
    return out


def waterline(cv, cx, y, w, seed, k=1.0):
    """The foot of something standing in water: a dark contact shadow and three pale ripples in front of it."""
    H, W = cv.shape[:2]
    sh = np.zeros((H, W), np.uint8)
    cv2.ellipse(sh, (int(cx), int(y)), (int(w * .52), max(2, int(w * .045))), 0, 0, 360, 255, -1)
    sh = cv2.GaussianBlur(sh.astype(np.float32) / 255, (0, 0), max(2.0, w * .02)) * .6 * k
    cv[:] = cv * (1 - sh[..., None]) + np.array((.03, .05, .09), np.float32) * sh[..., None]
    rp = np.zeros((H, W), np.uint8)
    rng = np.random.default_rng(seed)
    for i, (m, a) in enumerate(((.60, 150), (.74, 105), (.92, 60))):
        rx = int(w * m)
        cv2.ellipse(rp, (int(cx + rng.integers(-4, 5)), int(y + 2 + i * 2)), (rx, max(2, int(rx * .085))), 0, 8, 172, a, 1, cv2.LINE_AA)
    rp = cv2.GaussianBlur(rp.astype(np.float32) / 255, (0, 0), .8) * k
    add_light(cv, np.ones((H, W, 3), np.float32) * np.array((.90, .92, 1.0), np.float32), rp, 0, 0, .5)


def reflection(cv, spr, x, base, k=.32, depth=.55, seed=0):
    """A broken reflection of a sprite on the water under its foot (flipped, faded, rippled sideways)."""
    h, w = spr.shape[:2]
    rh = int(h * depth)
    r = np.ascontiguousarray(spr[::-1][:rh])
    yy = np.arange(rh, dtype=np.float32)
    shift = (2.2 + yy * .03) * np.sin(yy * .55 + seed)
    mapx = (np.arange(w, dtype=np.float32)[None, :] + shift[:, None]).astype(np.float32)
    mapy = np.repeat(yy[:, None], w, 1).astype(np.float32)
    pm = np.dstack([r[..., :3] * r[..., 3:4], r[..., 3:4]]).astype(np.float32)
    pm = cv2.remap(pm, mapx, mapy, cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
    pm = cv2.GaussianBlur(pm, (0, 0), 1.4)
    al = np.clip(pm[..., 3], 0, 1) * np.clip(1 - yy / rh, 0, 1)[:, None] ** 1.4 * k
    rgb = np.clip(pm[..., :3] / np.maximum(pm[..., 3:4], 1e-4), 0, 1) * np.array((.75, .85, 1.0), np.float32)
    paste(cv, rgb, al, int(round(x)), int(round(base)))


def glint(cv, x, y, size, k=.9, color=(1.0, .93, .75)):
    """A small four-point star of light on gold or gems."""
    s = int(size * 2.2)
    yy, xx = np.mgrid[-s:s + 1, -s:s + 1].astype(np.float32)
    a = np.exp(-(np.abs(xx) / (size * .09 + .6)) - (np.abs(yy) / size) ** 1.6) + np.exp(-(np.abs(yy) / (size * .09 + .6)) - (np.abs(xx) / size) ** 1.6)
    a += .8 * np.exp(-(xx * xx + yy * yy) / (2 * (size * .22) ** 2))
    add_light(cv, np.ones(a.shape + (3,), np.float32) * np.array(color, np.float32), np.clip(a, 0, 1), int(x) - s, int(y) - s, k)


def loot(cv, name, cx, cy, height=None, scale=None, deg=0, flip=False, shadow=.55, crop=None, spark=None):
    s = sprite(name, height=height, scale=scale, crop=crop)
    if flip:
        s = flip_h(s)
    if deg:
        s = rotate_rgba(s, deg)
    x, y = cx - s.shape[1] / 2, cy - s.shape[0] / 2
    drop_shadow(cv, s, x, y, blur=5, dy=6, dx=2, strength=shadow)
    place(cv, s, x, y)
    if spark:
        glint(cv, cx + spark[0], cy + spark[1], spark[2])
    return s


def god_rays(cv, cx, cy, seed, k=.22, n=14, color=(1.0, .72, .5), spread=None, reach=1.0):
    """Streaks of dawn light fanning out of one point (the sun behind the castle), broken up by noise, strongest near the source."""
    H, W = cv.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    ang = np.arctan2(yy - cy, xx - cx)
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    rng = np.random.default_rng(seed)
    ph = rng.random(n * 2) * 6.28
    r = np.zeros((H, W), np.float32)
    for i in range(n):
        f = 5 + i * 2.3
        r += np.maximum(0, np.sin(ang * f + ph[i])) ** 6 * rng.uniform(.4, 1.0)
    r /= r.max() + 1e-6
    fall = np.exp(-dist / (W * .6 * reach))
    up = smooth((cy - yy) / 120 + .35)                            # rays go up and out, not down into the water
    m = r * fall * up * (.45 + .55 * fnoise(H, W, seed + 3, 4, 3))
    add_light(cv, np.ones((H, W, 3), np.float32) * np.array(color, np.float32), np.clip(m, 0, 1), 0, 0, k)


def build_landscape(heroes):
    W, H = 1260, 1000
    SY = 215                                                   # where the 3D screenshot starts
    scene = prep_scene(W)
    scene = np.clip(np.clip(scene * 1.30, 0, 1) ** .86 * np.array((1.04, 1.0, .96), np.float32), 0, 1)   # the dawn a little brighter and warmer
    sh = scene.shape[0]
    top_col = np.median(scene[2:10].reshape(-1, 3), axis=0)
    sky = make_sky(W, H, SEED, [(0, (.05, .04, .12)), (.12, (.12, .08, .24)), (SY / H, tuple(top_col * .95)), (.5, (.78, .52, .46)),
                                (.7, (.30, .20, .30)), (1, (.08, .06, .10))])
    cv = sky.copy()
    ones = np.ones((H, W, 3), np.float32)
    # the world map, ghosted into the dawn sky
    mp = map_crop((190, 420, 3650, 1700), W * 1.25)
    mp = mp[:int(H * .5)]
    ml = lum(mp)[..., None] * np.array((1.0, .78, .62), np.float32)
    mm = (radial(*mp.shape[:2], mp.shape[1] * .5, mp.shape[0] * .55, mp.shape[1] * .62, mp.shape[0] * .75, 1.3) * .30).astype(np.float32)
    add_light(cv, ml, mm, -int(W * .125), 0, 1.0)
    # the dawn sun behind the castle
    add_light(cv, ones * np.array((1.0, .62, .40), np.float32), radial(H, W, W * .5, SY + 240, W * .78, 360, 1.5), 0, 0, .95)
    # the great creatures rise behind the castle
    tone = (.13, .08, .20)
    for gx in (118, 1148):
        add_light(cv, ones * np.array((1.0, .66, .56), np.float32), radial(H, W, gx, 230, 230, 300, 1.4), 0, 0, .55)
    god_rays(cv, W * .5, SY + 250, SEED + 11, k=.30)
    giant(cv, 'hl_boss3', 112, 30, 380, tone, (.7, .5), rim_k=.5)
    giant(cv, 'hl_warlord', 1152, 36, 380, tone, (-.7, .5), flip=True, rim_k=.5)
    # the 3D screenshot of the quay, its top lost in the mist
    smask = soft_rect_mask(sh, W, top=95, bottom=150)
    paste(cv, scene, smask, 0, SY)
    add_fog(cv, fog_band(H, W, SEED + 5, SY - 20, SY + 110, .42, 4), (.66, .48, .56))
    # the kraken has the Dawn Walker, the sea serpent watches the black ship Heron
    WATER = (.20, .30, .38)
    kr = haze(sprite('uw_kraken_0', width=540, crop=(0, 0, 0, 4)), WATER, .20)
    place(cv, kr, 165 - kr.shape[1] / 2, 598 - kr.shape[0])
    sp = haze(sprite('uw_serp_0', scale=.58, crop=(0, 0, 0, 4)), WATER, .20)
    place(cv, sp, 1036 - sp.shape[1] / 2, 592 - sp.shape[0])
    dw = haze(sprite('yar_ship_dawn', height=250, cut=.25), (.7, .55, .6), .12)
    hr = haze(sprite('yar_ship_heron', height=235, cut=.25), (.5, .45, .6), .12)
    reflection(cv, dw, 330 - dw.shape[1] / 2, 606, seed=1)
    reflection(cv, hr, 1135 - hr.shape[1] / 2, 604, seed=2)
    waterline(cv, 165, 598, 420, 1, .8)
    waterline(cv, 1036, 592, 140, 2, .8)
    place(cv, dw, 330 - dw.shape[1] / 2, 606 - dw.shape[0])
    place(cv, hr, 1135 - hr.shape[1] / 2, 604 - hr.shape[0])
    waterline(cv, 330, 606, 140, 3, 1.0)
    waterline(cv, 1135, 604, 130, 4, 1.0)
    add_fog(cv, fog_band(H, W, SEED + 6, 560, 640, .30, 5), (.50, .46, .58))
    # the map as the table at the foot of the poster: forest, the sealed door, the coast
    tb = map_crop((1200, 1500, 2650, 1980), W * 1.0)
    th = tb.shape[0]
    tb = (tb.mean() + (tb - tb.mean()) * .66) * np.array((.92, .83, .68), np.float32)      # a calmer chart: parchment, not a heap of small icons
    ty = 722
    tm = soft_rect_mask(th, W, top=120, bottom=0)
    paste(cv, tb, tm[:H - ty], 0, ty) if False else paste(cv, tb[:H - ty], tm[:H - ty], 0, ty)
    band_y = H - 110
    yb = np.clip((np.arange(H, dtype=np.float32) - band_y) / 70, 0, 1)
    add_fog(cv, (smooth(yb) * .46)[:, None] * np.ones((1, W), np.float32), (.04, .03, .06))
    # the standards at the two ends of the row
    for xb in (62, 1198):
        bn = haze(sprite('oqflags_2', scale=1.0), (.30, .26, .36), .22)
        bn[..., :3] *= np.array((.86, .84, .86), np.float32)
        drop_shadow(cv, bn, xb - bn.shape[1] / 2, 912 - bn.shape[0], blur=8, dy=6)
        place(cv, bn, xb - bn.shape[1] / 2, 912 - bn.shape[0])
    # the four heroes
    S, f, gap = 216, 13, 22
    T = S + 2 * f
    x0 = (W - (4 * T + 3 * gap)) // 2
    ys = [616, 592, 592, 616]
    for i, n in enumerate(heroes):
        card = hero_card(n, S, f)
        x = x0 + i * (T + gap)
        sp_ = np.dstack([card, np.ones(card.shape[:2], np.float32)])
        gl = cv2.GaussianBlur(np.pad(np.ones(card.shape[:2], np.float32), 40), (0, 0), 26)
        add_light(cv, np.ones(gl.shape + (3,), np.float32) * np.array((1.0, .66, .34), np.float32), gl, x - 40, ys[i] - 40, .40)
        drop_shadow(cv, sp_, x, ys[i], blur=14, dy=14, strength=.65)
        place(cv, sp_, x, ys[i])
    # the loot on the table
    loot(cv, 'icn_sunblade', 140, 918, scale=.78, deg=-20, spark=(28, -20, 8))
    loot(cv, 'ship1_4', 262, 926, scale=.46)
    loot(cv, 'icn_redpotion', 352, 950, scale=.7)
    loot(cv, 'icn_bluepotion', 378, 960, scale=.66)
    loot(cv, 'icn_ankhring', 418, 948, scale=.50, deg=8, spark=(14, -14, 7))
    loot(cv, 'ds_treasure', 1040, 925, scale=.50, spark=(-26, -24, 10))
    loot(cv, 'icn_eyering', 842, 948, scale=.50, deg=-8, spark=(-12, -14, 7))
    loot(cv, 'icn_warlordhelm', 1176, 936, scale=.66, flip=True)
    loot(cv, 'icn_gem_ruby', 898, 962, scale=.62, spark=(8, -8, 6))
    loot(cv, 'icn_gem_sapphire', 1136, 968, scale=.55, spark=(5, -6, 6))
    glow(cv, .66, 14, .26)
    grade(cv, SEED + 9, vig=.30, contrast=1.14, sat=1.18)
    return cv


# ==================================================================================================================
#  the manual front cover, 1800 x 2700
# ==================================================================================================================
def build_portrait(heroes):
    W, H = 1800, 2700
    SY = 1060                                                  # where the 3D screenshot starts
    scene = prep_scene(W)
    scene = np.clip(np.clip(scene * 1.30, 0, 1) ** .86 * np.array((1.04, 1.0, .96), np.float32), 0, 1)
    sh = scene.shape[0]
    top_col = np.median(scene[2:14].reshape(-1, 3), axis=0)
    sky = make_sky(W, H, SEED + 100, [(0, (.05, .04, .12)), (.12, (.12, .08, .24)), (SY / H, tuple(top_col * .95)), (.54, (.78, .52, .46)),
                                      (.70, (.30, .20, .30)), (1, (.08, .06, .10))])
    cv = sky.copy()
    ones = np.ones((H, W, 3), np.float32)
    mp = map_crop((190, 420, 3650, 1700), W * 1.5)
    mp = mp[:int(SY + 200)]
    ml = lum(mp)[..., None] * np.array((1.0, .78, .62), np.float32)
    mm = (radial(*mp.shape[:2], mp.shape[1] * .5, mp.shape[0] * .45, mp.shape[1] * .60, mp.shape[0] * .70, 1.3) * .30).astype(np.float32)
    add_light(cv, ml, mm, -int(W * .25), 60, 1.0)
    add_light(cv, ones * np.array((1.0, .62, .40), np.float32), radial(H, W, W * .5, SY + 360, W * .85, 520, 1.5), 0, 0, .95)
    # the great creatures rise behind the castle
    tone = (.13, .08, .20)
    for gx in (240, 1560):
        add_light(cv, ones * np.array((1.0, .66, .56), np.float32), radial(H, W, gx, 960, 330, 440, 1.4), 0, 0, .55)
    god_rays(cv, W * .5, SY + 380, SEED + 111, k=.30)
    giant(cv, 'mummy', 520, 740, 520, tone, (.7, .5), keep=.4, rim_k=.45, fade=(.3, 1.0, .85))
    giant(cv, 'hg_ins9', 770, 850, 470, tone, (.3, .6), keep=.45, rim_k=.45)
    giant(cv, 'hg_ins7', 1090, 740, 420, tone, (-.3, .6), keep=.45, rim_k=.45)
    giant(cv, 'ds_pharaohboss', 1310, 750, 500, tone, (-.7, .5), keep=.4, rim_k=.45)
    giant(cv, 'hl_boss3', 230, 650, 640, tone, (.7, .5), rim_k=.5)
    giant(cv, 'hl_warlord', 1580, 650, 640, tone, (-.7, .5), flip=True, rim_k=.5)
    smask = soft_rect_mask(sh, W, top=170, bottom=240)
    paste(cv, scene, smask, 0, SY)
    add_fog(cv, fog_band(H, W, SEED + 105, SY - 30, SY + 170, .42, 4), (.66, .48, .56))
    # the kraken has the Dawn Walker, the sea serpent watches the black ship Heron
    WATER = (.20, .30, .38)
    base_l, base_r = 1618, 1612
    kr = haze(sprite('uw_kraken_0', width=860, crop=(0, 0, 0, 4)), WATER, .20)
    place(cv, kr, 175 - kr.shape[1] / 2, base_l - kr.shape[0])
    sp = haze(sprite('uw_serp_0', scale=1.15, crop=(0, 0, 0, 4)), WATER, .20)
    place(cv, sp, 1615 - sp.shape[1] / 2, base_r - sp.shape[0])
    dw = haze(sprite('yar_ship_dawn', height=540, cut=.25), (.7, .55, .6), .10)
    hr = haze(sprite('yar_ship_heron', height=500, cut=.25), (.5, .45, .6), .10)
    reflection(cv, dw, 470 - dw.shape[1] / 2, base_l + 12, seed=1)
    reflection(cv, hr, 1330 - hr.shape[1] / 2, base_r + 12, seed=2)
    waterline(cv, 175, base_l, 860, 1, .8)
    waterline(cv, 1615, base_r, 280, 2, .8)
    place(cv, dw, 470 - dw.shape[1] / 2, base_l + 12 - dw.shape[0])
    place(cv, hr, 1330 - hr.shape[1] / 2, base_r + 12 - hr.shape[0])
    waterline(cv, 470, base_l + 12, 300, 3, 1.0)
    waterline(cv, 1330, base_r + 12, 270, 4, 1.0)
    add_fog(cv, fog_band(H, W, SEED + 106, 1560, 1760, .30, 5), (.50, .46, .58))
    # the map as the table
    tb = map_crop((1200, 1380, 2650, 2100), W * 1.0)                                  # a taller piece of the map: more room here
    th = tb.shape[0]
    tb = (tb.mean() + (tb - tb.mean()) * .66) * np.array((.92, .83, .68), np.float32)      # a calmer chart: parchment, not a heap of small icons
    ty = 2000
    tm = soft_rect_mask(th, W, top=220)
    paste(cv, tb[:H - ty], tm[:H - ty], 0, ty)
    yb = np.clip((np.arange(H, dtype=np.float32) - 2380) / 130, 0, 1)
    add_fog(cv, (smooth(yb) * .55)[:, None] * np.ones((1, W), np.float32), (.04, .03, .06))
    # the standards stand behind the outer heroes
    for xb in (190, 1610):
        bn = haze(sprite('oqflags_2', scale=2.05), (.30, .26, .36), .22)
        bn[..., :3] *= np.array((.86, .84, .86), np.float32)
        drop_shadow(cv, bn, xb - bn.shape[1] / 2, 2120 - bn.shape[0], blur=12, dy=10)
        place(cv, bn, xb - bn.shape[1] / 2, 2120 - bn.shape[0])
    # the four heroes
    S, f, gap = 340, 22, 28
    T = S + 2 * f
    x0 = (W - (4 * T + 3 * gap)) // 2
    ys = [1812, 1768, 1768, 1812]
    for i, n in enumerate(heroes):
        card = hero_card(n, S, f)
        x = x0 + i * (T + gap)
        sp_ = np.dstack([card, np.ones(card.shape[:2], np.float32)])
        gl = cv2.GaussianBlur(np.pad(np.ones(card.shape[:2], np.float32), 60), (0, 0), 40)
        add_light(cv, np.ones(gl.shape + (3,), np.float32) * np.array((1.0, .66, .34), np.float32), gl, x - 60, ys[i] - 60, .40)
        drop_shadow(cv, sp_, x, ys[i], blur=20, dy=20, strength=.65)
        place(cv, sp_, x, ys[i])
    # the loot spread across the table, in front of the heroes' feet
    loot(cv, 'ship1_4', 250, 2292, scale=.90)
    loot(cv, 'icn_sunblade', 420, 2308, scale=1.25, deg=-24, spark=(40, -30, 12))
    loot(cv, 'icn_redpotion', 120, 2335, scale=.95)
    loot(cv, 'icn_bluepotion', 176, 2350, scale=.90)
    loot(cv, 'icn_ankhring', 600, 2308, scale=.90, deg=8, spark=(22, -22, 10))
    loot(cv, 'icn_gem_ruby', 740, 2330, scale=.90, spark=(10, -10, 9))
    loot(cv, 'ds_treasure', 1020, 2272, scale=.92, spark=(-44, -36, 15))
    loot(cv, 'icn_scarabring', 1330, 2318, scale=.85, deg=-6, spark=(-18, -20, 10))
    loot(cv, 'icn_eyering', 1495, 2308, scale=.76, deg=8, spark=(-18, -20, 10))
    loot(cv, 'icn_warlordhelm', 1660, 2306, scale=1.1, flip=True)
    loot(cv, 'icn_gem_sapphire', 1590, 2356, scale=.85, spark=(6, -8, 8))
    glow(cv, .66, 22, .26)
    grade(cv, SEED + 109, vig=.30, contrast=1.14, sat=1.18)
    return cv


# ==================================================================================================================
#  the finish: lettering, logo and frame, clean or grimy
# ==================================================================================================================
LAND_SPEC = dict(W=1260, H=1000, logo_w=800, logo_top=34, logo_max_h=360,
                 lines=[('Grid-Movement, Turn-Based RPG', 44, 412), ('Bickering Goat Studios', 30, 958)],
                 rule=False, frame=(13, 22),
                 # grime mode: the dark band under the lettering, the heroes (centre x, y, radius x, y as canvas fractions) stay cleaner,
                 # the creases, the number of torn notches, the finger smudges
                 band=(880, 960, .35), hero=(.50, .76, .50, .19), creases=(.545, .80), tears=5,
                 prints=[(.055, .90), (.935, .925), (.915, .19), (.065, .33), (.50, .958), (.80, .60)])
PORT_SPEC = dict(W=1800, H=2700, logo_w=1440, logo_top=104, logo_max_h=660,
                 lines=[('Grid-Movement, Turn-Based RPG', 74, 800), ('The Instruction Manual', 118, 2492), ('Bickering Goat Studios', 50, 2584)],
                 rule=True, rule_y=2412, frame=(52, 70),
                 band=(2370, 2470, .35), hero=(.50, .75, .55, .15), creases=(.665, .80), tears=7,
                 prints=[(.075, .935), (.925, .95), (.93, .30), (.065, .21), (.50, .972), (.90, .70), (.10, .60)])


def finish_clean(cv, spec):
    """Logo (with its soft dark glow), lettering and the gold frame on the finished picture."""
    img = to_img(cv).convert('RGBA')
    img, box = put_logo(img, spec['logo_w'], spec['logo_top'], spec['logo_max_h'])
    W = spec['W']
    for text, size, cy in spec['lines']:
        img = gold_text(img, text, size, W / 2, cy)
    if spec['rule']:
        d = ImageDraw.Draw(img)
        y = spec['rule_y']
        d.line((W / 2 - 330, y, W / 2 + 330, y), fill=GOLD_RULE + (255,), width=4)
        d.line((W / 2 - 330, y + 12, W / 2 + 330, y + 12), fill=GOLD_RULE + (255,), width=2)
    img = gold_frame(img, *spec['frame'])
    return img.convert('RGB')


def import_make_cover():
    """The grime pass already written for the painted cover (manual/make_cover.py, knobs in its GRIME dict)."""
    if HERE not in sys.path:
        sys.path.insert(0, HERE)
    import make_cover as mc
    return mc


GRIMY_KNOBS = dict(trim_dark=.97, logo_dark=1.0, vignette=.56)     # a little brighter than the painted covers' grime, the title glows through


def finish_grimy(cv, spec):
    """The same covers, battered like an old dungeon box: the grade, stains, soot, mildew, scratches, creases and worn edges of
    manual/make_cover.py run over the composed picture, then the logo and the lettering weathered but readable; the heroes are
    kept cleaner by the weight map (spec['hero']). The picture is lifted before the grade (the grade crushes the blacks), the heroes
    most of all, and the title gets its warm glow back after the grime (so it glows through)."""
    mc = import_make_cover()
    cfg = dict(W=spec['W'], H=spec['H'], logo_w=spec['logo_w'], logo_top=spec['logo_top'], logo_max_h=spec['logo_max_h'],
               band=spec['band'], lines=spec['lines'], frame=spec['frame'], hero=spec['hero'], creases=spec['creases'],
               tears=spec['tears'], prints=spec['prints'])
    if spec['rule']:
        cfg['rule_y'] = spec['rule_y']
    saved = {k: mc.GRIME[k] for k in GRIMY_KNOBS}
    mc.GRIME.update(GRIMY_KNOBS)
    try:
        c = mc.grime_context(cfg)
        yy = ((np.arange(spec['H'], dtype=np.float32) + .5) / spec['H'])[:, None, None]
        foot = np.clip((yy - .78) / .12, 0, 1)
        lift = .80 - .10 * c['hm'][..., None] - .12 * foot * foot * (3 - 2 * foot)     # the loot at the foot is lifted too
        img = mc.grade_grimy(np.clip(cv, 0, 1).astype(np.float32) ** lift)
        img = mc.vignette_grimy(img, c)
        img = mc.grime_under(img, c)
        img = mc.band_grimy(img, cfg, c)
        img, logo_a = mc.logo_grimy(img, cfg, c)
        img, trim_a = mc.trim_grimy(img, cfg, c, spec['rule'])
        # the warm glow round the title, laid on after the soaking grime and before the dust and scratches
        lw = max(1, int(np.argmax(logo_a.max(axis=0) > .5)))
        cols = np.where(logo_a.max(axis=0) > .5)[0]
        wlogo = int(cols.max() - cols.min()) if len(cols) else spec['logo_w']
        glow = np.clip(mc.blur(logo_a, wlogo * .045) * 1.9, 0, 1) * .40 + np.clip(mc.blur(logo_a, wlogo * .018) * 1.6, 0, 1) * .38             + np.clip(mc.blur(logo_a, wlogo * .006) * 1.3, 0, 1) * .30
        outside = np.clip(1 - mc.blur(logo_a, 1.2) * 1.0, 0, 1)                        # only OUTSIDE the letters: the logo's own colours stay natural
        img = 1 - (1 - img) * (1 - (np.clip(glow, 0, 1) * outside * .62)[..., None] * np.array((1.0, .72, .34), np.float32))
        keep = np.clip(mc.blur(logo_a, 6 * c['S']) * 1.6, 0, 1) * .50 + np.clip(mc.blur(trim_a, 8 * c['S']) * 3.0, 0, 1) * .66
        c['Gtop'] = (c['Gw'] * (1 - keep)).astype(np.float32)
        c['trim_a'] = trim_a
        img = mc.grime_dust(img, c)
        img = mc.grime_scratches(img, c)
        img = mc.grime_prints(img, c, cfg)
        img = mc.grime_creases(img, c, cfg)
        img = mc.grime_cracks(img, c)
        img = mc.grime_edges(img, cfg, c)
        img = mc.grime_grain(img, c)
    finally:
        mc.GRIME.update(saved)
    return Image.fromarray((img * 255 + .5).clip(0, 255).astype(np.uint8))


# ==================================================================================================================
#  the comparison picture
# ==================================================================================================================
def make_compare(path):
    """Every cover version that exists, side by side and labelled: the itch.io covers on the top row, the manual fronts below."""
    rows = [
        [('Painted cover', os.path.join(HERE, 'showcase', 'game_cover.png')),
         ('Painted, grimy', os.path.join(HERE, 'showcase', 'game_cover_grimy.png')),
         ('In-game graphics', OUT_GAME),
         ('In-game, grimy', OUT_GAME_GRIMY)],
        [('Manual front, painted', os.path.join(HERE, 'cover_front.png')),
         ('Painted, grimy', os.path.join(HERE, 'cover_front_grimy.png')),
         ('Manual front, in-game', OUT_FRONT),
         ('In-game, grimy', OUT_FRONT_GRIMY)]]
    heights = [600, 800]
    font = ImageFont.truetype(FONT, 40)
    m, gap, lab = 50, 36, 70
    built = []
    for row, h in zip(rows, heights):
        items = []
        for label, p in row:
            if os.path.isfile(p):
                im = Image.open(p).convert('RGB')
                items.append((label, im.resize((round(im.width * h / im.height), h), Image.LANCZOS)))
        if items:
            built.append((h, items))
    width = max(m * 2 + gap * (len(items) - 1) + sum(i.width for _, i in items) for _, items in built)
    height = m + sum(lab + h + gap for h, _ in built)
    out = Image.new('RGB', (width, height), (20, 17, 14))
    d = ImageDraw.Draw(out)
    y = m // 2
    for h, items in built:
        rowW = gap * (len(items) - 1) + sum(i.width for _, i in items)
        x = (width - rowW) // 2
        for label, im in items:
            l, t, r, b = font.getbbox(label)
            d.text((x + (im.width - (r - l)) // 2 - l, y + 8 - t), label, font=font, fill=(226, 192, 112))
            out.paste(im, (x, y + lab))
            d.rectangle((x - 1, y + lab - 1, x + im.width, y + lab + h), outline=(120, 100, 60))
            x += im.width + gap
        y += lab + h + gap
    out.save(path, optimize=True)
    print('comparison ->', path, out.size)


# ==================================================================================================================
def main():
    args = sys.argv[1:]
    only = None
    if '--only' in args:
        i = args.index('--only')
        only = args[i + 1]
        del args[i:i + 2]
    do_shoot = '--shoot' in args
    grime = '--no-grime' not in args
    nums = [a for a in args if a.lstrip('-').isdigit()]
    heroes = HEROES
    if nums:
        heroes = [int(n) for n in nums]
        if len(heroes) != 4 or not all(1 <= n <= 70 for n in heroes):
            raise SystemExit('give exactly four hero numbers between 1 and 70, e.g. 12 25 44 51')
    if do_shoot:
        shoot()
    ensure_shots()
    t0 = time.time()
    os.makedirs(os.path.dirname(OUT_GAME), exist_ok=True)
    if only in (None, 'landscape'):
        cv = build_landscape(heroes)
        finish_clean(cv, LAND_SPEC).save(OUT_GAME, optimize=True)
        print('game cover (clean) ->', OUT_GAME, '(%.0fs)' % (time.time() - t0))
        if grime:
            finish_grimy(cv, LAND_SPEC).save(OUT_GAME_GRIMY, optimize=True)
            print('game cover (grimy) ->', OUT_GAME_GRIMY, '(%.0fs)' % (time.time() - t0))
    if only in (None, 'portrait'):
        cv = build_portrait(heroes)
        finish_clean(cv, PORT_SPEC).save(OUT_FRONT, optimize=True)
        print('front cover (clean) ->', OUT_FRONT, '(%.0fs)' % (time.time() - t0))
        if grime:
            finish_grimy(cv, PORT_SPEC).save(OUT_FRONT_GRIMY, optimize=True)
            print('front cover (grimy) ->', OUT_FRONT_GRIMY, '(%.0fs)' % (time.time() - t0))
    if only in (None, 'compare'):
        make_compare(OUT_COMPARE)


if __name__ == '__main__':
    main()
