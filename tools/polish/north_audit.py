import sys,json,os; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
js=open(os.path.join(os.path.dirname(__file__),'north_audit.js'),encoding='utf8').read()
with sync_playwright() as p:
    b,pg,errs=boot(p)
    r=pg.evaluate(js)
    json.dump(r,open(os.path.join(os.path.dirname(__file__),'north_audit_%s.json'%(sys.argv[1] if len(sys.argv)>1 else 'before')),'w'),indent=1)
    print('errs',[e for e in errs if 'REFUSED' not in e][:5])
    for k,v in r.items():
        if k in('props','noteTexts'):continue
        s=json.dumps(v);print(k,(s[:300]+'...(%d)'%len(v) if isinstance(v,list) else s[:300]) if len(s)>300 else s)
    b.close()
