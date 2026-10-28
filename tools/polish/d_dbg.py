import sys,json
sys.path.insert(0,'tools/polish')
from d_load import *
with sync_playwright() as p:
    b,pg,errs=open_level(p)
    r=pg.evaluate('''()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();const L=LEVELS[476];const pos={};for(const d of L.decor){if(d.pic)continue;(pos[d.x+','+d.y]=pos[d.x+','+d.y]||[]).push(d.k+(d.ox?'':''))}
    const s3=Object.entries(pos).filter(([k,a])=>a.length>=3);
    const by={};for(const d of L.decor)(by[d.k]=by[d.k]||[]).push(d);const cl=[];for(const [k,a] of Object.entries(by)){for(const d of a){if(d.pic)continue;const n=a.filter(e=>!e.pic&&Math.abs(e.x-d.x)<=4&&Math.abs(e.y-d.y)<=4).length;if(n>=3&&!(L._bsw&&Math.hypot(d.x-L._bsw.cx,d.y-L._bsw.cy)<L._bsw.R+3))cl.push([k,d.x,d.y,n])}}
    return {s3,cl}}''')
    print(json.dumps(r)); b.close()
