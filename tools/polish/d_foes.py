import sys, json
sys.path.insert(0,'tools/polish')
from d_load import *
JS=r'''()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();const L=LEVELS[476];const ks=[...new Set(L.enemies.map(e=>e.t))];const o=[];
for(const k of ks){const def=ENEMY_DEF[k],base=IMG[def.img];if(!base){o.push([k,'noimg',def.img]);continue}const fs=fitScale(k,def,base),h=def.w*base.height/base.width*fs,w=def.w*fs;o.push([k,def.name,+h.toFixed(2),+w.toFixed(2),+fs.toFixed(2),def.w,+(base.width/base.height).toFixed(2)])}
const ref=['goblin','skeleton','rat','orc','giant'].filter(k=>ENEMY_DEF[k]).map(k=>{const def=ENEMY_DEF[k],base=IMG[def.img];if(!base)return [k];const fs=fitScale(k,def,base);return [k,+(def.w*base.height/base.width*fs).toFixed(2),+(def.w*fs).toFixed(2)]});
return {o,ref,FIT_MAX}}'''
with sync_playwright() as p:
    b,pg,errs=open_level(p)
    r=pg.evaluate(JS)
    for x in r['o']: print(x)
    print(r['ref'],r['FIT_MAX']); b.close()
