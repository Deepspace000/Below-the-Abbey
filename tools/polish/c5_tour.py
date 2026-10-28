import json,os,re
import c5lib
H=os.path.dirname(os.path.abspath(__file__))
T=c5lib.run({'op':'eval','js':"""()=>{const L=LEVELS[475];const T=[];const zs=L._hgdp.zones.filter(z=>z.type==='safe');
for(const z of zs.slice(0,8))T.push(['t_hub_'+z.name.replace(/\W/g,''),z.x,z.y,null]);
for(let t=0;t<8;t++){const q=L.decor.find(d=>d.npc==='hgd_q'+t);if(q)T.push(['t_q'+t,q.x,q.y,null])}
for(const d of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc)))T.push(['t_church'+d.npc.slice(-1),d.x,d.y,null]);
const hs=L.decor.filter(d=>d.hs==='hgdpc_house');for(const i of [0,9,21,28])if(hs[i])T.push(['t_house'+i,hs[i].x,hs[i].y,null]);
const nt=L.decor.filter(d=>d.hgcc);for(const i of [0,5,10,15,20,25,30])if(nt[i])T.push(['t_note'+i,nt[i].x,nt[i].y,null]);
const ss=L.decor.filter(d=>/^hgdpc_ss/.test(d.k));for(const i of [0,10,20,30])if(ss[i])T.push(['t_ss'+i,ss[i].x,ss[i].y,null]);
return T}"""})['r']
out={}
for n,x,y,f in T:
    r=c5lib.run({'op':'shot','path':os.path.join(H,'c5_shots',n+'.png'),'tx':x,'ty':y,'f':f,'wait':900})
    out[n]=[x,y,r.get('r'),r['errs']]
json.dump(out,open(os.path.join(H,'c5_tour.json'),'w'))
print(len(T),'errs',[v[3] for v in out.values() if v[3]][:3])
