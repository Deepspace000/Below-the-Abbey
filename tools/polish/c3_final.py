import sys
from c3lib import *
print(run({'op':'reload'},timeout=500),flush=True)
j=ev('c2_audit.js');r=j['r'];r.pop('heights');print(json.dumps(r),j['errs'],flush=True)
print(json.dumps(ev('c3_audit2.js')['r']),flush=True)
print(json.dumps(ev('c2_quest.js')['r'])[:400],flush=True)
