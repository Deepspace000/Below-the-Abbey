from c2lib import *
print(run({'op':'reload'},timeout=400))
j=ev('c2_audit.js');r=j['r'];h=r.pop('heights');print(json.dumps(r)[:1500],j['errs']);json.dump(h,open('c2_heights.json','w'))
info=run({'op':'eval','js':"""()=>{const L=LEVELS[475];const T=[];const zs=L._hgdp.zones;
const w=L.decor.find(d=>d.k==='well'&&Math.hypot(d.x-42,d.y-90)<8);if(w)T.push(['well',w.x,w.y]);
for(const d of L.decor.filter(d=>d.hgdpcV||(d.npc==='hgdpc_text'&&/Honey Press|Pearl Fountain|Bell of the Lost/.test(d.kname||''))))T.push(['v_'+d.kname.replace(/\W/g,''),d.x,d.y]);
for(const z of zs.filter(z=>z.type==='safe'&&z.town===undefined&&z.name!=='The Foot of the Maze').slice(0,6))T.push(['enc_'+z.name.replace(/\W/g,''),z.x,z.y]);
const c=L.decor.filter(d=>/^hgd_church[07]$/.test(d.npc));for(const d of c)T.push(['church'+d.npc.slice(-1),d.x,d.y]);
return T}"""})['r']
print(info)
for n,x,y in info:
    run({'op':'shot','path':'c2_shots/%s.png'%n,'tx':x,'ty':y,'f':None,'wait':1300},timeout=200)
