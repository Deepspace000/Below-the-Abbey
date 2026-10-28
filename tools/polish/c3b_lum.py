import sys,json
from c3blib import *
from PIL import Image
import numpy as np
tag=sys.argv[1]
S=ev('c3_samples.js')['r']
res={}
for s in S:
    for kind in ('hubs','cors'):
        for i,(x,y) in enumerate(s[kind]):
            p='c3_shots/lum_%s_%s_%s%d.png'%(tag,s['z'].replace(' ',''),kind,i)
            run({'op':'shot','path':p,'tx':x,'ty':y,'f':None,'wait':900},timeout=200)
            im=np.asarray(Image.open(p).convert('RGB').crop((8,60,950,480)),dtype=float)
            lum=float((0.2126*im[...,0]+0.7152*im[...,1]+0.0722*im[...,2]).mean())
            res.setdefault(s['z'],{}).setdefault(kind,[]).append(round(lum,1))
json.dump(res,open('c3_lum_%s.json'%tag,'w'),indent=1)
for z,v in res.items():print(z,v)
a=[l for v in res.values() for l in v.get('cors',[])];b=[l for v in res.values() for l in v.get('hubs',[])]
print('corridor mean',sum(a)/len(a),'hub mean',sum(b)/len(b))
