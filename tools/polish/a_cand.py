import sys,os,base64; sys.path.insert(0,os.path.dirname(__file__))
from a_boot import *
OUT=os.path.join(os.environ.get('TEMP','.'),'a_shots')
KEYS=sys.argv[1].split(',')
JS="""(keys)=>{const S=200,pad=16;const it=keys.map(k=>({k,im:IMG[k]})).filter(o=>o.im);const cv=document.createElement('canvas');cv.width=pad+it.reduce((a,o)=>a+Math.min(o.im.width*S/Math.max(o.im.height,1),400)+pad,0);cv.height=S*1.4+40;const c=cv.getContext('2d');c.fillStyle='#333';c.fillRect(0,0,cv.width,cv.height);let x=pad;c.font='10px sans-serif';
 for(const o of it){const h=S*Math.min(1,1),w=Math.min(o.im.width*h/o.im.height,400);const hh=w*o.im.height/o.im.width;c.drawImage(o.im,x,S*1.4-hh,w,hh);c.fillStyle='#fff';c.fillText(o.k.replace('art_','')+' '+o.im.width+'x'+o.im.height,x,S*1.4+14);x+=w+pad}return cv.toDataURL()}"""
with sync_playwright() as p:
    b,pg,errs=boot(p); pg.set_default_timeout(60000)
    d=pg.evaluate(JS,KEYS); open(os.path.join(OUT,'cand.png'),'wb').write(base64.b64decode(d.split(',')[1])); b.close()
