import json,os,sys
import c5lib
from PIL import Image
import numpy as np
H=os.path.dirname(os.path.abspath(__file__))
def lum(p):
    im=np.asarray(Image.open(p).convert('RGB').crop((8,60,950,480)),dtype=float)
    return round(float((0.2126*im[...,0]+0.7152*im[...,1]+0.0722*im[...,2]).mean()),1)
S=c5lib.ev('c3_samples.js')['r']
res={}
for s in S:
    for kind in('hubs','cors'):
        for i,(x,y) in enumerate(s[kind]):
            fp=os.path.join(H,'c5_shots','lum_%s_%s%d.png'%(s['z'].replace(' ',''),kind,i))
            c5lib.run({'op':'shot','path':fp,'tx':x,'ty':y,'f':None,'wait':700})
            res.setdefault(s['z'],{}).setdefault(kind,[]).append(lum(fp))
json.dump(res,open(os.path.join(H,'c5_lum.json'),'w'),indent=0)
hub=[np.mean(v['hubs']) for v in res.values()];cor=[a for v in res.values() for a in v['cors']]
print('hub mean',round(np.mean(hub),1),'min',round(min(hub),1),'cor mean',round(np.mean(cor),1),'under50',sum(a<50 for a in cor),'of',len(cor),'min',min(cor))
for z,v in res.items():print(z,v)
