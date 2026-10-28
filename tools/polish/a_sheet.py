# proportion sheet: every kind in the zone drawn at true relative height, a person (0.85) as the ruler
import sys,os,json,base64; sys.path.insert(0,os.path.dirname(__file__))
from a_boot import *
OUT=os.path.join(os.environ.get('TEMP','.'),'a_shots'); os.makedirs(OUT,exist_ok=True)
JS="""(grp)=>{const L=LEVELS[475],M=L._hgdm,W=M.W,bio=M.bio;const inZ=(x,y)=>bio[y*W+x]<4;
 const items=[];const seen={};
 if(grp==='enemy'){const ts={};for(const e of L.enemies)if(inZ(e.x,e.y))ts[e.t]=1;for(const t in ts){const def=ENEMY_DEF[t];if(!def)continue;const im=IMG[def.img];if(!im)continue;items.push({n:t,im,h:def.w*im.height/im.width,w:def.w})}}
 else{const kk={};for(const d of L.decor){if(!inZ(d.x,d.y)||d.pic)continue;const isn=!!d.npc&&!/sign|note|plaque/.test(d.npc);if((grp==='npc')!==isn)continue;(kk[d.k]=kk[d.k]||[]).push(d)}
  for(const k in kk){const im=IMG[k];if(!im)continue;const a=kk[k].map(d=>(NPC_H[k]?NPC_H[k]:(decorW(k)*im.height/im.width))*(d.sc||1)).sort((p,q)=>p-q);items.push({n:k+' x'+a.length,im,h:a[a.length>>1],w:a[a.length>>1]*im.width/im.height})}}
 items.sort((a,b)=>a.h-b.h);const S=150,pad=14;let x=pad;const rowW=1800;let rows=[[]],cw=0;for(const it of items){const w=Math.max(it.w*S,70)+pad;if(cw+w>rowW){rows.push([]);cw=0}rows[rows.length-1].push(it);cw+=w}
 const rowH=Math.max(...items.map(i=>i.h))*S+40;const cv=document.createElement('canvas');cv.width=rowW+40;cv.height=rows.length*rowH+20;const c=cv.getContext('2d');c.fillStyle='#2b2b2b';c.fillRect(0,0,cv.width,cv.height);c.font='11px sans-serif';
 rows.forEach((r,ri)=>{const base=(ri+1)*rowH-18;let x=pad;c.strokeStyle='#555';c.beginPath();c.moveTo(0,base);c.lineTo(cv.width,base);c.stroke();c.strokeStyle='#c33';c.beginPath();c.moveTo(0,base-0.85*S);c.lineTo(30,base-0.85*S);c.stroke();
  for(const it of r){const w=it.w*S,h=it.h*S;c.drawImage(it.im,x,base-h,w,h);c.fillStyle='#fff';c.fillText(it.n.replace('art_','')+' '+it.h.toFixed(2),x,base+12);x+=Math.max(w,70)+pad}});
 return cv.toDataURL('image/png')}"""
with sync_playwright() as p:
    b,pg,errs=boot(p); pg.set_default_timeout(60000); print('booted',flush=True)
    for g in sys.argv[1:]:
        d=pg.evaluate(JS,g); open(os.path.join(OUT,'sheet_%s.png'%g),'wb').write(base64.b64decode(d.split(',')[1])); print(g)
    b.close()
