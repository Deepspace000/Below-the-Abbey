import json,sys,os
d=json.load(open(sys.argv[1]))
for r in d['res']:
    for k in ('off','on'):
        o=r.get(k)
        if not o: continue
        print(r['id'],r['stage'],k,'L%s'%o.get('level'),'world' if o.get('world') else 'local','focus',o.get('focus'),'ring',o.get('ring') and {a:round(b,1) for a,b in o['ring'].items()},'wring',bool(o.get('wring')),'spots',o.get('spots'),'exp',r['exp'][:1],'note',o.get('note'),o.get('err') or '')
