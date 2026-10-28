import sys,base64;sys.path.insert(0,'tools/polish')
from text_lib import *
S={'page':'Four towns is a good walk','scroll':'The slug is not slow','plaque':'A key is used up in the lock','tablet':'Rest in the safe places','slate':'Do not trust a corridor that is too straight','marker':'Mara Fenn','warning':'Beware the hedge','runestone':'Gate of Echoes','waymarker':'Blue Ward','hanging':'The Lantern Shop','board':'Notices, Dunewell','post':'Hedgefoot, 40 steps|Dunewell, 90 steps'}
with sync_playwright() as p:
    b,pg,errs=start(p)
    u=pg.evaluate('''(S)=>{const ks=Object.keys(S),cs=ks.map(k=>hgtPaint(k,S[k]));const W=cs.reduce((a,c)=>a+c.width+20,0),c=document.createElement('canvas');c.width=W;c.height=440;const x=c.getContext('2d');x.fillStyle='#555a6a';x.fillRect(0,0,W,440);let o=0;for(const q of cs){x.drawImage(q,o,0);o+=q.width+20}return c.toDataURL()}''',S)
    open('tools/polish/text_shots/sheet.png','wb').write(base64.b64decode(u.split(',')[1]));print(errs[:3]);b.close()
