import sys,json,subprocess,time
sys.path.insert(0,'tools/polish')
import w4lib
def sh(n,x,y,f):
    r=w4lib.run({'op':'shot','path':'C:/Users/mirko/Downloads/workspace/Below-the-Abbey/tools/polish/w4_shots/%s.png'%n,'tx':x,'ty':y,'f':f,'wait':1200},timeout=300)
    print(n,r['r'],r['errs'][:2],flush=True)
def ev(js,arg=None): return w4lib.ev(js,arg)
print(w4lib.run({'op':'reload'},timeout=1200),flush=True)
ev('w4_go477.js')
time.sleep(5)
a=ev('w4_audit.js')['r']; json.dump(a,open('tools/polish/w4_result.json','w'),indent=1); print(json.dumps(a)[:1500],flush=True)
for nm,x,y,f in [('hub_a',34,28,0),('hub_b',17,18,3),('hub_c',9,9,1),('c11',27,9,1),('cor7',25,41,0),('c9',7,33,0),('c7',41,36,0)]: sh(nm,x,y,f)
sg=ev('w4_signs.js')['r']; print(len(sg),flush=True)
for n,x,y,f,p in sg[:10]: sh('sg_'+n[:18],x,y,f)
ev('w4_go475.js'); time.sleep(20)
for nm,x,y,f in [('d2a',97,65,1),('d2b',123,43,2),('d1b',147,71,2),('l2w',99,65,1),('l1w',147,95,0)]: sh(nm,x,y,f)
print('ALLDONE',flush=True)
