import json,tc4lib as t
Z=json.load(open('tc4_zones.json'))
out={}
seen=set()
def S(name,x,y,f):
    r=t.shot(name,x,y,f,900);g=r.get('r')
    key=(x,y,tuple(g) if g else None)
    if key in seen:
        print('dup',name,g);return
    seen.add(key);out[name]=[x,y,g,r.get('errs')]
    print(name,x,y,g,r.get('err') or '',flush=True)
for gname,fs in (('hgd_q0',[0,1,2,3]),('hgd_q4',[0,1,2,3]),('hgd_q2',[1,2,3]),('hgd_q3',[1,2,3])):
    g=[a for a in Z['givers'] if a[0]==gname][0]
    for f in fs:S('gv_%s_f%d'%(gname,f),g[1],g[2],f)
json.dump(out,open('tc4_tour2.json','w'),indent=0)
