import json,sys
import tc4lib as t
out={}
for f in ('c2_audit.js','c3_audit2.js','c5_audit.js'):
    r=t.ev(f)
    out[f]=r.get('r',r)
    if f=='c2_audit.js' and isinstance(out[f],dict): out[f].pop('heights',None)
    print(f,'errs',r.get('errs'),r.get('err'))
json.dump(out,open('tc4_audit1.json','w'),indent=1)
for f,v in out.items():
    print('=====',f)
    print(json.dumps(v,indent=None)[:6000])
