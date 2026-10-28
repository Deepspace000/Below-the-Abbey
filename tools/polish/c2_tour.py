from c2lib import *
import sys
print(run({'op':'reload'},timeout=400))
j=ev('c2_audit.js');r=j['r'];h=r.pop('heights');print(json.dumps(r)[:1600],j['errs']);json.dump(h,open('c2_heights.json','w'))
info=run({'op':'eval','js':"""()=>{const L=LEVELS[475];const T=[];
const first=(re)=>L.decor.filter(d=>re.test(d.npc||d.k));
for(let t=0;t<8;t++){const q=L.decor.find(d=>d.npc==='hgd_q'+t);T.push(['q'+t,q.x,q.y])}
for(const d of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc)))T.push(['church'+d.npc.slice(-1),d.x,d.y]);
const hs=L.decor.filter(d=>d.hs);for(const i of [1,7,12,18,24,29])if(hs[i])T.push(['house'+i,hs[i].x,hs[i].y]);
for(const d of L.decor.filter(d=>/^hgdpc_vn/.test(d.k)).filter((d,i)=>i%3===0))T.push(['vign'+d.k.slice(8),d.x,d.y]);
return T}"""})['r']
print(len(info))
for n,x,y in info:
    run({'op':'shot','path':'c2_shots/%s.png'%n,'tx':x,'ty':y,'f':None,'wait':1300},timeout=200)
print(info)
