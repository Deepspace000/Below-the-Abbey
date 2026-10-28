from c3lib import *
info=run({'op':'eval','js':"""()=>{const L=LEVELS[475];const T=[];const zs=L._hgdp.zones.filter(z=>z.type==='safe');
for(const d of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc)))T.push(['church'+d.npc.slice(-1),d.x,d.y]);
const hs=L.decor.filter(d=>d.hs==='hgdpc_house');for(let t=0;t<8;t++){const h=hs[t*4];if(h)T.push(['street'+t,h.x,h.y+1])}
for(const d of L.decor.filter(d=>d.main&&d.vig))T.push(['vig_'+d.vig.replace(/\W/g,'').slice(0,10),d.x,d.y]);
const q4=L.decor.find(d=>d.npc==='hgd_q4');if(q4)T.push(['giver_q4',q4.x,q4.y]);
for(const z of zs.filter(z=>z.town===undefined&&z.name!=='The Foot of the Maze').slice(0,4)){const l=L.decor.filter(d=>d.cl&&Math.hypot(d.x-z.x,d.y-z.y)<z.r+12)[1];if(l)T.push(['corr_'+z.name.replace(/\W/g,'').slice(0,8),l.x,l.y])}
return T}"""})['r']
print(len(info))
for n,x,y in info:
    r=run({'op':'shot','path':'c3_shots/t_%s.png'%n,'tx':x,'ty':y,'f':None,'wait':1200},timeout=300)
    print(n,r['r'],r['errs'][:1])
