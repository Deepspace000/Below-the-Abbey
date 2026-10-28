import sys,json
sys.path.insert(0,'tools/polish')
import w4lib
r=w4lib.ev(sys.argv[1],json.loads(sys.argv[2]) if len(sys.argv)>2 else None)
print(json.dumps(r)[:int(sys.argv[3]) if len(sys.argv)>3 else 4000])
