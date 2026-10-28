"""Recolour the painted Well Maze props (purple) into the four Deeper Hollow precinct tints: assets/ds_hpb_<prop>_<biome>.png (game name art_hpb_<prop>_<biome>).
biome 4 sandstone (amber), 5 Blue Quarter (steel blue), 6 Mosaic Halls (rose terracotta), 7 Gilded Quarter (warm gold). Only violet and magenta pixels are shifted; trim, rope and glass stay.
python tools/hpb_recolor.py"""
import numpy as np, colorsys, pathlib
from PIL import Image
A = pathlib.Path(__file__).resolve().parent.parent / 'assets'
PROPS = ['barrel','crate','crate_lid','bucket','brazier','cask','keg','bell','ore_cart','mine_cart','tools','windlass','ladder','scale','shrine','candelabra','lantern_hang','lantern_violet','lantern_lilac','orb_pedestal','skeleton','rune','signpost']
TINT = {4:(18,.95,1.05),5:(213,.85,1.12),6:(352,.72,1.12),7:(34,1.1,1.1)}
def rgb2hsv(a):
    r,g,b=a[...,0],a[...,1],a[...,2];mx=a.max(-1);mn=a.min(-1);d=mx-mn+1e-9
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60
    s=np.where(mx>0,(mx-mn)/(mx+1e-9),0);return h,s,mx
def hsv2rgb(h,s,v):
    c=v*s;x=c*(1-abs((h/60)%2-1));m=v-c;h6=(h/60)%6
    z=np.zeros_like(h);r=np.select([h6<1,h6<2,h6<3,h6<4,h6<5],[c,x,z,z,x],c);g=np.select([h6<1,h6<2,h6<3,h6<4,h6<5],[x,c,c,x,z],z);b=np.select([h6<1,h6<2,h6<3,h6<4,h6<5],[z,z,x,c,c],x)
    return np.stack([r+m,g+m,b+m],-1)
for p in PROPS:
    im=Image.open(A/('ds_wm_%s.png'%p)).convert('RGBA')
    if p!='signpost':bb=im.getchannel('A').getbbox();im=im.crop(bb)  # the signpost keeps its size: the lettering is laid on its board by fractions
    sc=256/max(im.size) if p!='signpost' else 1
    if sc<1:im=im.resize((max(1,round(im.width*sc)),max(1,round(im.height*sc))),Image.LANCZOS)
    arr=np.asarray(im).astype(np.float64)/255;rgb=arr[...,:3];h,s,v=rgb2hsv(rgb)
    # weight: how violet the pixel is (hue 240..340), fading at the edges, and saturated enough
    w=np.clip((62-np.abs(h-292))/25,0,1)*np.clip((s-.05)/.2,0,1)
    for b,(th,sm,vm) in TINT.items():
        nh=np.where(w>.5,(th+(h-292)*.15)%360,h);ns=np.clip(s*(1+(sm-1)*w),0,1);nv=np.clip(v*(1+(vm-1)*w),0,1)
        # purple wood is dark and low-saturation: give it a warmer mid-brown body so it does not read as grey
        out=hsv2rgb(nh,ns,nv);o=np.concatenate([out,arr[...,3:]],-1)
        Image.fromarray((o*255).round().astype(np.uint8),'RGBA').save(A/('ds_hpb_%s_%d.png'%(p,b)),optimize=True)
print('done',len(PROPS)*len(TINT))
