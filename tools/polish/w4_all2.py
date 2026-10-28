import sys,json,time
sys.path.insert(0,'tools/polish')
import w4lib
def sh(n,x,y,f):
    try:
        r=w4lib.run({'op':'shot','path':'C:/Users/mirko/Downloads/workspace/Below-the-Abbey/tools/polish/w4_shots/%s.png'%n,'tx':x,'ty':y,'f':f,'wait':1000},timeout=200)
        print(n,r.get('r'),r.get('err','')[:80],r['errs'][:2],flush=True)
    except Exception as e: print('fail',n,e,flush=True)
sg=w4lib.ev('w4_signs.js')['r']
for n,x,y,f,p in sg:
    if f<0: continue
    if n[:6] in ('Hest_s','Stairs','Steps_','Ferry_','Warden','Tin_Cu','Forty_','Three_','Turn_B','Two_Le') : sh('sg_'+n[:18],x,y,f)
w4lib.ev('w4_go475.js'); time.sleep(15)
for nm,x,y,f in [('d2a',97,65,1),('d2b',123,43,2),('d1b',147,71,2),('l2w',99,65,1),('l1w',147,95,0)]: sh(nm,x,y,f)
print('ALLDONE',flush=True)
