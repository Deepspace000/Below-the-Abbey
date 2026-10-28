import sys, base64, io
sys.path.insert(0,'tools/polish')
from d2_load import *
from PIL import Image, ImageDraw
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]()}')
    keys=pg.evaluate('()=>Object.keys(IMG).filter(k=>/^hgpd_/.test(k)&&!/_m$/.test(k)&&!/^hgpd_book[23]$/.test(k))')
    names=sys.argv[1].split(',') if len(sys.argv)>1 and sys.argv[1]!='all' else keys
    data=pg.evaluate('(ns)=>ns.map(k=>{const im=IMG[k];if(!im||!im.width)return null;const c=document.createElement("canvas");c.width=im.width;c.height=im.height;c.getContext("2d").drawImage(im,0,0);return c.toDataURL()})',names)
    S=150;cols=8;rows=(len(names)+cols-1)//cols
    sh=Image.new('RGB',(cols*S,rows*(S+14)),(70,70,80));d=ImageDraw.Draw(sh)
    for i,n in enumerate(names):
        x=(i%cols)*S;y=(i//cols)*(S+14);d.text((x+3,y+S),n.replace('hgpd_',''),fill=(255,255,255))
        if not data[i]: continue
        im=Image.open(io.BytesIO(base64.b64decode(data[i].split(',')[1]))).convert('RGBA');im.thumbnail((S-6,S-6));sh.paste(im,(x+3,y+3),im)
    sh.save('C:/Users/mirko/AppData/Local/Temp/d2shots/u3_hgpd.png');print(len(names),errs[:3]);b.close()
