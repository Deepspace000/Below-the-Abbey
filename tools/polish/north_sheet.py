import sys,os,json; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
keys=sys.argv[2].split(',')
with sync_playwright() as p:
    b,pg,errs=boot(p,1400,700)
    pg.evaluate("""(keys)=>{const c=document.createElement('canvas');c.width=1400;c.height=700;c.style.cssText='position:fixed;left:0;top:0;z-index:99999;background:#445';document.body.appendChild(c);const x=c.getContext('2d');
      x.fillStyle='#556';x.fillRect(0,0,1400,700);let X=4,Y=4,rowH=0;x.font='11px sans-serif';
      for(const k of keys){const im=IMG[k];if(!im){x.fillStyle='#f88';x.fillText('MISSING '+k,X,Y+12);X+=110;continue}
        const s=Math.min(150/im.height,150/im.width,1.2);const w=im.width*s,h=im.height*s;if(X+Math.max(w,90)>1396){X=4;Y+=rowH+20;rowH=0}
        x.drawImage(im,X,Y,w,h);x.fillStyle='#fff';x.fillText(k,X,Y+h+11);rowH=Math.max(rowH,h);X+=Math.max(w,90)+8}}""",keys)
    pg.wait_for_timeout(500)
    pg.screenshot(path=os.path.join(os.environ['TEMP'],sys.argv[1]+'.png'));b.close()
