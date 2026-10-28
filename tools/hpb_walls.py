"""Wall variants for the Deeper Hollow Blue Quarter (lapis) and Mosaic Halls, made from the painted wall pictures that already exist.
Blue: the Well Maze bricks recoloured blue, with a dado and cornice trim, a lantern niche and a gold-framed inlaid lapis panel. Mosaic: dimmed (it blew out near lights) plus filigree, scales and dado panels.
Writes assets/ds_tex_hpb_blue0..4.png and ds_tex_hpb_mos0..3.png (game names art_tex_hpb_...). python tools/hpb_walls.py"""
import numpy as np, pathlib
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import importlib.util
A = pathlib.Path(__file__).resolve().parent.parent / 'assets'
def ld(n): return Image.open(A/('ds_tex_%s.png'%n)).convert('RGB').resize((128,128),Image.LANCZOS)
def hue_to(im,th,sm=1.0,vm=1.0,spread=.5):
    a=np.asarray(im).astype(np.float64)/255;r,g,b=a[...,0],a[...,1],a[...,2];mx=a.max(-1);mn=a.min(-1);d=mx-mn+1e-9
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60;s=np.where(mx>0,(mx-mn)/(mx+1e-9),0)
    # pull the whole picture towards one hue, keeping a little of its own variation
    base=np.angle(np.exp(1j*np.deg2rad(h)).mean())*180/np.pi
    nh=(th+np.angle(np.exp(1j*np.deg2rad(h-base)))*180/np.pi*spread)%360;ns=np.clip(s*sm,0,1);nv=np.clip(mx*vm,0,1)
    c=nv*ns;x=c*(1-abs((nh/60)%2-1));m=nv-c;h6=(nh/60)%6;z=np.zeros_like(c)
    R=np.select([h6<1,h6<2,h6<3,h6<4,h6<5],[c,x,z,z,x],c);G=np.select([h6<1,h6<2,h6<3,h6<4,h6<5],[x,c,c,x,z],z);B=np.select([h6<1,h6<2,h6<3,h6<4,h6<5],[z,z,x,c,c],x)
    return Image.fromarray((np.stack([R+m,G+m,B+m],-1)*255).clip(0,255).astype(np.uint8))
def bright(im,f): return ImageEnhance.Brightness(im).enhance(f)
def band(im,y0,y1,dark,hl=True):
    a=np.asarray(im).astype(np.float64)
    a[y0:y1]*=dark
    if hl and y0>0: a[y0-1:y0+1]=np.clip(a[y0-1:y0+1]*1.35+10,0,255)
    return Image.fromarray(a.clip(0,255).astype(np.uint8))
def shade(im,top=.82,bot=.86):  # a little depth: darker under the cornice and at the foot
    a=np.asarray(im).astype(np.float64);ys=np.linspace(0,1,128)[:,None,None]
    f=np.minimum(1,top+(1-top)*np.clip(ys/.18,0,1))*np.minimum(1,bot+(1-bot)*np.clip((1-ys)/.18,0,1));return Image.fromarray((a*f).clip(0,255).astype(np.uint8))
BLUE=214
bb=hue_to(ld('wm_brick_big'),BLUE,1.5,1.3);bo=hue_to(ld('wm_brick_old'),BLUE,1.5,1.0);bn=hue_to(ld('wm_niche'),BLUE,1.4,1.25)
# niche: keep the glow of the lantern a cold white-blue (the hue pull makes it blue already)
b0=shade(bb,.9,.9)
b1=shade(bo,.9,.92)
b2=bb.copy();b2=band(b2,104,128,.62);b2=band(b2,0,12,.72,hl=False);b2=band(b2,12,14,1.3,hl=False);b2=shade(b2,.95,.95)
b3=bn
# inlaid lapis panel: the old star lapis in a thin gold frame on bricks
lap=hue_to(ld('wall_lapis'),222,1.0,1.25,.3);b4=bb.copy();pan=lap.crop((20,10,108,118)).resize((72,96));fr=Image.new('RGB',(78,102),(150,118,52));fr.paste(pan,(3,3));b4.paste(fr,(25,13))
d=ImageDraw.Draw(b4);d.rectangle((25,13,102,114),outline=(210,176,86));b4=shade(b4,.92,.9)
for i,im in enumerate([b0,b1,b2,b3,b4]): im.save(A/('ds_tex_hpb_blue%d.png'%i),optimize=True)
mos=bright(ld('hgt_w2_mosaic'),.76);fil=bright(ld('hgt_w2_filigree'),.72);sca=bright(ld('hgt_w2_scales'),.8);dad=bright(ld('hgt_w3_dado_pink'),.74)
for i,im in enumerate([shade(mos,.9,.9),shade(fil,.9,.9),shade(sca,.9,.9),dad]): im.save(A/('ds_tex_hpb_mos%d.png'%i),optimize=True)
sh=Image.new('RGB',(128*9,128))
for i,n in enumerate(['blue0','blue1','blue2','blue3','blue4','mos0','mos1','mos2','mos3']): sh.paste(Image.open(A/('ds_tex_hpb_%s.png'%n)).convert('RGB'),(i*128,0))
sh.save(pathlib.Path(__file__).resolve().parent/'polish'/'s3_walls_sheet.png');print('ok')
