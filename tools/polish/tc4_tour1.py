import json,tc4lib as t
Z=json.load(open('tc4_zones.json'))
out={}
def S(name,x,y,f=None,wait=1100):
    r=t.shot(name,x,y,f,wait);out[name]=[x,y,r.get('r'),r.get('errs')]
    print(name,x,y,r.get('r'),r.get('err') or '',flush=True)
# hubs of the 8 towns
for z in Z['zones'][:8]:S('hub_'+z[0].replace(' ',''),z[1],z[2])
# churches
for c in Z['churches']:S('church'+c[0][-1],c[1],c[2])
# givers q0..q7 (q0..q7 are the town givers)
for g in Z['givers'][:8]:S('giver_'+g[0],g[1],g[2])
json.dump(out,open('tc4_tour1.json','w'),indent=0)
print('errs',[v[3] for v in out.values() if v[3]][:2])
