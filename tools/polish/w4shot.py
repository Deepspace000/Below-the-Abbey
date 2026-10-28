import sys,json,os
sys.path.insert(0,'tools/polish')
import w4lib
# usage: w4shot.py name x y f [wait]
n,x,y,f=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4])
p=os.path.abspath('tools/polish/w4_shots/%s.png'%n)
r=w4lib.run({'op':'shot','path':p,'tx':x,'ty':y,'f':f,'wait':int(sys.argv[5]) if len(sys.argv)>5 else 1200})
print(n,r['r'],r['errs'][:2])
