import json,sys
t=open(sys.argv[1]).read()
i=t.rindex('ERRS');d=json.loads(t[:i])
for k in sys.argv[2:]:
    print(k, json.dumps(d[k])[:2500])
