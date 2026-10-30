"""Retones the two bright Mews creature pictures to the castle palette, in place (assets/ps/c_psraven.webp, c_psfalconer.webp).
   The raven was pale silver with a magenta fringe from the keying; the falconer ghost stood in a bright cyan glow. Both go dark slate, the fringe is pulled to grey, the cyan halo is almost removed.
   Safe to run once; a copy of each original is kept in assets/ps/_orig/ and used as the source on every run, so running it again gives the same result."""
import pathlib, shutil
import numpy as np
from PIL import Image

A = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'ps'
ORIG = pathlib.Path(__file__).resolve().parent / 'ps_orig'
ORIG.mkdir(exist_ok=True)


def load(name):
    src = ORIG / (name + '.webp')
    if not src.exists():
        shutil.copy(A / (name + '.webp'), src)
    return np.array(Image.open(src).convert('RGBA')).astype(np.float32)


def defringe(a):
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    m = (r > g + 12) & (b > g + 12)
    a[..., 0] = np.where(m, np.minimum(r, g * 1.1 + 3), r)
    a[..., 2] = np.where(m, np.minimum(b, g * 1.05 + 3), b)
    return a


def tone(a, bright, sat, tint, keep_hi=235):
    rgb = a[..., :3]
    lum = (rgb * np.array([.3, .59, .11])).sum(-1, keepdims=True)
    out = (lum + (rgb - lum) * sat) * bright * np.array(tint)
    hi = lum[..., 0] > keep_hi
    out[hi] = rgb[hi]
    a[..., :3] = np.clip(out, 0, 255)
    return a


def save(name, a):
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(A / (name + '.webp'), quality=94, method=6)


a = defringe(load('c_psraven'))
a = tone(a, .5, .55, (.9, .98, 1.1))
save('c_psraven', a)

a = defringe(load('c_psfalconer'))
al = a[..., 3]
mid = (al > 20) & (al < 170)
a[..., 3] = np.where(mid, al * .12, al)          # the cyan halo goes, the soft edge stays faint
a = tone(a, .62, .45, (.92, .98, 1.08), keep_hi=250)
save('c_psfalconer', a)
print('retoned c_psraven, c_psfalconer')

# the red lanterns read pink: pull the blue out of the lit glass so they are a deep red
for nm in ('lantern_red_a', 'lantern_red_b', 'pillar_lantern', 'lantern_hanging', 'lantern_bracket', 'sconce_black'):
    a = defringe(load(nm))
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    pink = (r > 120) & (b > g + 8) & (r > g + 30)
    a[..., 2] = np.where(pink, b * .28, b)
    a[..., 1] = np.where(pink, g * .75, g)
    a[..., 0] = np.where(pink, np.minimum(255, r * 1.05), r)
    save(nm, a)
print('retoned red lanterns')

# the gardener (a straw-hatted villager in bright green-brown) goes dark and weary like the porter
a = defringe(load('p_gardener'))
a = tone(a, .62, .5, (.95, 1.0, 1.05), keep_hi=252)
save('p_gardener', a)
print('retoned gardener')

# the pale guard (c_psguard, painted on the s2a sheet) stood out as a near-white ghost with a magenta fringe in the dark gatehouse: dark slate like the castle, still a little see-through
a = defringe(load('c_psguard'))
a = tone(a, .58, .4, (.9, .97, 1.08), keep_hi=256)
save('c_psguard', a)
print('retoned c_psguard')


def repad_hem(name, pad=.06, fade=.07, seed=3):
    """the sheet edge cut the hem off flat: put transparent rows under it and let the last rows fray out column by column, so the hem ends in rags, not a straight cut"""
    a = load(name)
    h, w = a.shape[:2]
    rng = np.random.default_rng(seed)
    f = max(4, int(h * fade))
    ragged = np.convolve(rng.random(w), np.ones(9) / 9, mode='same')      # 0..1 per column, smooth
    for i in range(f):
        y = h - f + i
        t = (i + 1) / f                                                     # 0 at the top of the band, 1 at the cut
        keep = np.clip((ragged - t * 1.1 + .45) * 3, 0, 1)
        a[y, :, 3] *= keep
    out = np.zeros((h + int(h * pad), w, 4), np.float32)
    out[:h] = a
    return out


save('c_psmourner', repad_hem('c_psmourner'))
print('re-padded c_psmourner (its picture is 6% taller now: the manifest px_h and h follow)')
# (the Weeping Colossus, cut at the thighs on its sheet, was repainted full length instead: python tools/ingest_ps.py <colossus sheet> col1 sprite names=c_pscolossus hs=3.4)
