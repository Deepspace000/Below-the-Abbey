import sys,math
import numpy as np
from PIL import Image
src,dst=sys.argv[1],sys.argv[2]
for k in range(6):
    a=np.asarray(Image.open(f'{src}/flame_{k}.webp').convert('RGBA')).astype(float)
    H,W=a.shape[:2];al=a[...,3]
    rows=np.where(al.max(1)>20)[0];top,bot=rows[0],rows[-1]
    out=np.zeros_like(a);c=(W-1)/2;Wmax=W*.5
    lum=(a[...,0]*.3+a[...,1]*.55+a[...,2]*.15)/255
    hf=[1,.9,.96,.86,.98,.92][k];sw=[.10,-.12,.06,-.05,.13,-.09][k];ph=k*1.7
    span=(bot-top)*hf
    for yy in range(H):
        t=(bot-yy)/max(1,span)
        if t<0 or t>1: continue
        y=int(round(bot-t*(bot-top)))
        f=.3+.7*math.sin(min(1,t/.32)*math.pi/2) if t<.32 else math.cos((t-.32)/.68*math.pi/2)**1.15
        hw=f*Wmax/2*(1+.06*math.sin(t*5+ph)*t+.03*math.sin(t*13+ph*2))
        cc=c+sw*Wmax*(t**1.6)+Wmax*.04*math.sin(t*7+ph)*t
        xs=np.where(al[y]>20)[0]
        if len(xs)<2 or hw<.5: continue
        l,r=xs[0],xs[-1]
        for x in range(W):
            u=(x-cc)/hw
            if abs(u)>1.15: continue
            sx=(l+r)/2+u*(r-l)/2
            if sx<0 or sx>W-1: continue
            x0=int(sx);fr=sx-x0;x1=min(W-1,x0+1)
            A=al[y,x0]*(1-fr)+al[y,x1]*fr; L=lum[y,x0]*(1-fr)+lum[y,x1]*fr
            edge=max(0,1-max(0,abs(u)-.75)/.4)   # soft fade at the sides
            A*=edge*(1 if t>.04 else t/.04*.6+.4)*(1 if t<.6 else max(.25,1-(t-.6)/.5))
            rr=min(1,abs(u))
            core=max(0,1-rr/.45)*max(0,1-abs(t-.25)/.35)
            body=1-rr**1.3*.85
            col=np.array([255,145,40])*body+np.array([170,32,6])*(1-body)
            col=col*(1-.35*max(0,t-.55)/.45)+np.array([190,40,10])*.35*max(0,t-.55)/.45
            col=col*(1-core)+np.array([255,244,205])*core
            col=col*(.75+.5*L)
            out[yy,x,:3]=np.clip(col,0,255);out[yy,x,3]=np.clip(A*(.85+.3*core),0,255)
    Image.fromarray(out.astype(np.uint8)).save(f'{dst}/flame_{k}.webp',lossless=True)
print('ok')
