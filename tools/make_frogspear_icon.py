#!/usr/bin/env python3
"""Makes assets/icn_hgfrogspear.png (the Amberthorn Spear) from the painted icon of the Barbed Chitin Spear, recoloured to amber gold."""
import os
import numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
a = np.asarray(Image.open(os.path.join(ROOT, 'assets', 'icn_hgbarb.png')).convert('RGBA')).astype(float) / 255
rgb = a[..., :3]
mx = rgb.max(2); mn = rgb.min(2)
s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
hh = np.full(a.shape[:2], .105)
ss = np.clip(s * .6 + .45, 0, 1); vv = np.clip(mx * 1.12 + .04, 0, 1)
i = (hh * 6).astype(int) % 6; f = hh * 6 - i
p = vv * (1 - ss); q = vv * (1 - f * ss); t = vv * (1 - (1 - f) * ss)
sel = lambda opts: np.select([i == k for k in range(6)], opts)
out = np.stack([sel([vv, q, p, p, t, vv]), sel([t, vv, vv, q, p, p]), sel([p, p, t, vv, vv, q])], 2)
res = np.concatenate([out, a[..., 3:4]], 2)
Image.fromarray((res * 255).astype('uint8'), 'RGBA').save(os.path.join(ROOT, 'assets', 'icn_hgfrogspear.png'), optimize=True)
print('ok')
