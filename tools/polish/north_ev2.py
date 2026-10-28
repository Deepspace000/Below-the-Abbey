import sys,os,json; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
x,y,f=[int(v) for v in sys.argv[1].split(',')]
with sync_playwright() as p:
    b,pg,errs=boot(p,700,450)
    pg.evaluate("""([x,y,f])=>{G.talk=null;G.cut=null;const ang=(f-1)*Math.PI/2;G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=ang;G.C.x=x;G.C.y=y;G.C.a=ang}""",[x,y,f])
    pg.wait_for_timeout(2500)
    r=pg.evaluate("()=>({nl:Array.from(nearL),nk:Array.from(nearK),RANGE,ceil:CEILH,cx:G.C.x,cy:G.C.y,vis:LIGHTS.filter(l=>l.vis!==undefined&&l.vis>0.01).length,hp:LIGHTS.filter(l=>l.hpa&&Math.hypot(l.x-G.C.x-.5,l.y-G.C.y-.5)<4).map(l=>[l.x,l.y,l.vis,l.out,l.taken])})")
    print(json.dumps(r)[:2500]);b.close()
