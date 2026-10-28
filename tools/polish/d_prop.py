import sys, json
sys.path.insert(0,'tools/polish')
from d_load import *
JS=r'''()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();const L=LEVELS[476];const by={};
for(const d of L.decor){const k=d.k,im=IMG[k];const nh=NPC_H[k];const asp=im&&im.width?im.width/im.height:null;let h=nh!=null?nh*(d.sc||1):null,w=null;
 if(h==null&&typeof decorW==='function'){w=decorW(k)*(d.sc||1);h=asp?w/asp:null}else if(h!=null&&asp)w=h*asp;
 (by[k]=by[k]||[]).push({h,w,sc:d.sc||1,x:d.x,y:d.y,block:d.block,nh:nh,asp})}
const out=[];for(const [k,a] of Object.entries(by)){const hs=a.map(o=>o.h).filter(v=>v!=null).sort((p,q)=>p-q),ws=a.map(o=>o.w).filter(v=>v!=null).sort((p,q)=>p-q);out.push({k,n:a.length,nh:a[0].nh,asp:a[0].asp&&+a[0].asp.toFixed(2),hmin:hs[0],hmed:hs[hs.length>>1],hmax:hs[hs.length-1],wmax:ws[ws.length-1]})}
const en=[];for(const k of ['hgusl0','hgusl1','hgusl9','hguyk3','hgo0','hgo5','hgdemon0','hgdemon5','bsw']){const D=ENEMY_DEF[k];if(!D)continue;const im=IMG[D.img];en.push({k,w:D.w,img:D.img,asp:im&&im.width?+(im.width/im.height).toFixed(2):null,NH:NPC_H[D.img]})}
return {out,en,ENH:typeof ENEMY_H!=='undefined'?1:0,heroH:NPC_H.fisher,monk:NPC_H.monk}}'''
with sync_playwright() as p:
    b,pg,errs=open_level(p)
    r=pg.evaluate(JS)
    for o in sorted(r['out'],key=lambda o:-(o['hmed'] or 0)): print(o)
    print(r['en'],r['heroH'],r['monk']); b.close()
