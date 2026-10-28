import json,subprocess,sys
r=json.load(open('tools/polish/w4_looks.json'))['r']
a,b=int(sys.argv[1]),int(sys.argv[2])
for n,x,y,f in r[a:b]:
    subprocess.run(['python','tools/polish/w4shot.py','v_'+n,str(x),str(y),str(f)])
