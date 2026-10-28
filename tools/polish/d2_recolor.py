import colorsys,sys
from PIL import Image
import numpy as np
def grey(im,glow=None,amber=False):
    a=np.array(im.convert('RGBA')).astype(float)
    out=a.copy()
    h,w,_=a.shape
    for y in range(h):
        for x in range(w):
            r,g,b,al=a[y,x]
            if al<8: continue
            hh,l,s=colorsys.rgb_to_hls(r/255,g/255,b/255); hh*=360
            if 225<=hh<=352 and s>.04:
                if s>.55 and l>.45 and glow is not None:
                    hh=glow; s=min(1,s*.9)
                    if amber: l=min(.9,l+.04)
                else:
                    hh=214+(hh-280)*.06; s*=.42
                rr,gg,bb=colorsys.hls_to_rgb(hh/360,l,s)
                out[y,x,:3]=[rr*255,gg*255,bb*255]
    return Image.fromarray(out.astype('uint8'),'RGBA')
def desand(im):
    a=np.array(im.convert('RGBA')).astype(float)
    h,w,_=a.shape
    for y in range(h):
        for x in range(w):
            r,g,b,al=a[y,x]
            if al<8: continue
            hh,l,s=colorsys.rgb_to_hls(r/255,g/255,b/255); hh*=360
            if 18<=hh<=52 and s>.22:
                k=min(1,max(0,(s-.22)/.12))
                a[y,x,3]=al*(1-k)
    return Image.fromarray(a.astype('uint8'),'RGBA')
if __name__=='__main__':
    S=300
    sh=Image.new('RGB',(S*6,S),(70,70,80))
    items=[('boat',None,False),('barrel',None,False),('rune',182,False),('lamp_post',40,True),('skeleton',None,False)]
    for i,(n,g,am) in enumerate(items):
        im=Image.open('assets/ds_wm_%s.png'%n).convert('RGBA'); im.thumbnail((S-6,S-6)); im=grey(im,g,am)
        sh.paste(im,(i*S+3,S-3-im.height),im)
    im=Image.open('assets/ds_dbones.png').convert('RGBA'); im.thumbnail((S-6,S-6)); im=desand(im); sh.paste(im,(5*S+3,S-3-im.height),im)
    sh.save('tools/polish/d2_sheet3.png')
