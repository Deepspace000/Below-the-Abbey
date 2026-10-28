import sys,os;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import c5lib
# usage: c5shot.py name x y [f] ...
a=sys.argv[1:]
H=os.path.dirname(os.path.abspath(__file__))
i=0
while i<len(a):
    n,x,y,f=a[i],int(a[i+1]),int(a[i+2]),a[i+3]
    f=None if f=='-' else int(f)
    r=c5lib.run({'op':'shot','path':os.path.join(H,'c5_shots',n+'.png'),'tx':x,'ty':y,'f':f})
    print(n,r.get('r'),r['errs'] if r.get('errs') else '')
    i+=4
