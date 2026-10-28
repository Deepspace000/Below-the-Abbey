import nq,json,sys,statistics as st
nq.wait_ready()
tag=sys.argv[1]
hubs=nq.call({'op':'eval','js':"()=>LEVELS[475]._hgdm.prec.filter(p=>p.b<4).map(p=>[p.lx||p.x,p.ly||p.y,p.name])"})['r']
res={}
for x,y,n in hubs:
    v=[nq.call({'op':'shot','path':'r4s/%s_h%d_%d_%d.png'%(tag,x,y,f),'tx':x,'ty':y,'f':f})['r'][1] for f in range(4)]
    res[n]=[x,y,round(st.mean(v),1),min(v)]; print(n,res[n])
print('hub mean',round(st.mean(r[2] for r in res.values()),1),'min',min(r[2] for r in res.values()))
