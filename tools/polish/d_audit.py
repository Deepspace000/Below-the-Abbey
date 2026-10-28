import sys, json
sys.path.insert(0,'tools/polish')
import d_load
from d_load import *
JS=r'''()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();const L=LEVELS[476],O=L._hgdo,W=201,H=201,rows=L.rows;
const ix=(x,y)=>y*W+x,open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.',wat=(x,y)=>O.wm[ix(x,y)]===1,land=(x,y)=>open(x,y)&&!wat(x,y);
const DV=[[1,0],[-1,0],[0,1],[0,-1]];const deg=(x,y)=>DV.filter(d=>land(x+d[0],y+d[1])).length;
// land flood fill from the first ladder, then from boats: islet cells are reached by boat (counted separately)
const seen=new Set(),q=[[L.start.x,L.start.y]];seen.add(q[0].join(','));for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of DV){const nx=x+a,ny=y+b,k=nx+','+ny;if(seen.has(k)||!land(nx,ny))continue;seen.add(k);q.push([nx,ny])}}
const isl=(x,y)=>!!O.isle[ix(x,y)];
const by={};for(const d of L.decor){(by[d.k]=by[d.k]||[]).push(d)}
const sizeOf=d=>{const im=IMG[d.k],nh=NPC_H[d.k];const asp=im&&im.width?im.width/im.height:1;let h=nh!=null?nh*(d.sc||1):(typeof decorW==='function'?decorW(d.k)*(d.sc||1)/asp:null);return {h,w:h!=null?h*asp:null,asp}};
const prop=Object.entries(by).map(([k,a])=>{const hs=a.map(d=>sizeOf(d).h).filter(v=>v!=null).sort((p,q)=>p-q),ws=a.map(d=>sizeOf(d).w).filter(v=>v!=null).sort((p,q)=>p-q);const s=a.map(d=>d.sc||1).sort((p,q)=>p-q);
  return {k,n:a.length,scmin:s[0],scmax:s[s.length-1],hmin:hs[0],hmed:hs[hs.length>>1],hmax:hs[hs.length-1],wmax:ws[ws.length-1],spread:hs.length?+(hs[hs.length-1]/hs[0]).toFixed(2):null}});
const pos={};for(const d of L.decor){if(d.pic)continue;(pos[d.x+','+d.y]=pos[d.x+','+d.y]||[]).push(d.k)}
const stack3=Object.values(pos).filter(a=>a.length>=3).length,stack2=Object.values(pos).filter(a=>a.length===2).length;
// clusters of 3+ identical within 4 cells (floor props), excluding the ring of braziers round the boss
const cl=[];for(const [k,a] of Object.entries(by)){for(const d of a){if(d.pic)continue;const n=a.filter(e=>!e.pic&&Math.abs(e.x-d.x)<=4&&Math.abs(e.y-d.y)<=4).length;if(n>=3)cl.push([k,d.x,d.y,n])}}
const clNoBoss=cl.filter(c=>!(L._bsw&&Math.hypot(c[1]-L._bsw.cx,c[2]-L._bsw.cy)<L._bsw.R+3));
const choke=L.decor.filter(d=>d.block&&land(d.x,d.y)&&!isl(d.x,d.y)&&deg(d.x,d.y)===2&&((land(d.x+1,d.y)&&land(d.x-1,d.y))||(land(d.x,d.y+1)&&land(d.x,d.y-1)))).map(d=>[d.k,d.x,d.y]);
const dead=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(land(x,y)&&!isl(x,y)&&deg(x,y)===1)dead.push([x,y]);
const near=(x,y,r)=>L.decor.some(d=>Math.abs(d.x-x)<=r&&Math.abs(d.y-y)<=r);
const deadEmpty=dead.filter(([x,y])=>!near(x,y,2)).length;
// long bare stretches: straight corridor cells with nothing (decor or light) within 3 / 5, runs counted per maximal stretch of >=26 cells
const lights=L.lights||[];const marked=(x,y)=>L.decor.some(d=>Math.abs(d.x-x)<=3&&Math.abs(d.y-y)<=3&&!(d.pic&&/web/.test(d.k)))||lights.some(q=>Math.hypot(q[0]-x,q[1]-y)<=5);
let longBare=0;const runBare=(x,y,dx,dy)=>{let n=0,mx=0;while(land(x,y)){const st=land(x+dx,y+dy)&&land(x-dx,y-dy)&&!land(x+dy,y+dx)&&!land(x-dy,y-dx);if(st&&!marked(x,y)){n++;mx=Math.max(mx,n)}else n=0;x+=dx;y+=dy}return mx};
for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!land(x,y))continue;if(!land(x-1,y)&&land(x+1,y)&&runBare(x,y,1,0)>=25)longBare++;if(!land(x,y-1)&&land(x,y+1)&&runBare(x,y,0,1)>=25)longBare++}
// readables: text must be real
const reads=typeof HGPD!=='undefined'?Object.values(HGPD.read):[];const badText=reads.filter(r=>!r.t||r.t.length<25||/TODO|lorem|undefined|\bsign\b/i.test(r.t)||/—/.test(r.t)).length;
const emd=JSON.stringify(reads).includes('—');
const unreachLand=L.decor.filter(d=>land(d.x,d.y)&&!isl(d.x,d.y)&&!seen.has(d.x+','+d.y)&&!(L._bsw&&Math.hypot(d.x-L._bsw.cx,d.y-L._bsw.cy)<L._bsw.R+3)).map(d=>[d.k,d.x,d.y]);
const onWall=L.decor.filter(d=>!d.pic&&!open(d.x,d.y)).length,onWater=L.decor.filter(d=>wat(d.x,d.y)&&!/boat/.test(d.k)).length;
const wallPicBad=L.decor.filter(d=>d.pic&&!(rows[d.y+d.wd[1]]&&rows[d.y+d.wd[1]][d.x+d.wd[0]]!=='.')).length;
const foeOnDecorBlock=L.enemies.filter(e=>L.decor.some(d=>d.block&&d.x===e.x&&d.y===e.y)).length;
const foeBad=L.enemies.filter(e=>!/^hgo/.test(e.t)&&!land(e.x,e.y)).length;
const chests=L.decor.filter(d=>d.k==='chest').length;const lad=L._hgdu.ladders;
return {decor:L.decor.length,lights:lights.length,enemies:L.enemies.length,stack3,stack2,clusters:clNoBoss.length,choke:choke,deadEnds:dead.length,deadEmpty,longBare,readables:reads.length,badText,emdash:emd,unreachLand,onWall,onWater,wallPicBad,foeOnDecorBlock,foeBad,chests,names:L.mapNames.length,prop}}'''
with sync_playwright() as p:
    nohg=len(sys.argv)>1 and sys.argv[1]=='before'
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':960,'height':720})
    errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    if nohg: pg.add_init_script('window.__NOHGPD=true')
    pg.goto('http://localhost:8363/index.html?town=deephollow&lvl=34&v=%d'%int(__import__('time').time()),wait_until='commit',timeout=120000)
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"',timeout=120000);pg.wait_for_timeout(2500)
    r=pg.evaluate(JS)
    json.dump(r,open('tools/polish/d_audit_%s.json'%('before' if nohg else 'after'),'w'))
    prop=r.pop('prop')
    for k,v in r.items(): print(k,json.dumps(v)[:300])
    print('errors',[e for e in errs if 'Failed to load' not in e][:6])
    b.close()
