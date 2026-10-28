import sys, json
sys.path.insert(0,'tools/polish')
from d2_load import *
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
const reads=typeof HGPD!=='undefined'?Object.values(HGPD.read):[];const badText=reads.filter(r=>!r.t||r.t.length<25||/TODO|lorem|undefined|\bsign\b/i.test(r.t)||/\u2014/.test(r.t)).length;
const emd=JSON.stringify(reads).includes('\u2014');
const unreachLand=L.decor.filter(d=>land(d.x,d.y)&&!isl(d.x,d.y)&&!seen.has(d.x+','+d.y)&&!(L._bsw&&Math.hypot(d.x-L._bsw.cx,d.y-L._bsw.cy)<L._bsw.R+3)).map(d=>[d.k,d.x,d.y]);
const onWall=L.decor.filter(d=>!d.pic&&!open(d.x,d.y)).length,onWater=L.decor.filter(d=>wat(d.x,d.y)&&!/boat/.test(d.k)).length;
const wallPicBad=L.decor.filter(d=>d.pic&&!(rows[d.y+d.wd[1]]&&rows[d.y+d.wd[1]][d.x+d.wd[0]]!=='.')).length;
const foeOnDecorBlock=L.enemies.filter(e=>L.decor.some(d=>d.block&&d.x===e.x&&d.y===e.y)).length;
const foeBad=L.enemies.filter(e=>!/^hgo/.test(e.t)&&!land(e.x,e.y)).length;
const chests=L.decor.filter(d=>d.k==='chest').length;const lad=L._hgdu.ladders;

const CAN=k=>k.replace(/_m$/,'').replace(/^(hgpd_|hgq_|art_wm_|art_hgx)/,'').replace(/^skeleton$/,'skel').replace(/^crate_lid$/,'lid').replace(/^chain$/,'post').replace(/^prop2$/,'candle').replace(/^rock0$/,'stone').replace(/^rock2$/,'cairn').replace(/^prop0$/,'bones').replace(/^prop13$/,'tooth').replace(/^prop12$/,'root').replace(/^rock6$/,'rubble').replace(/^book[23]$/,'book');
const TGT={skel:.5,chest:.4,crate:.42,barrel:.5,keg:.38,bucket:.32,lid:.42,post:.85,lamp:1.4,bell:.6,wheel:.54,candle:.15,lantern:.24,tools:.52,cart:.5,shrine:.72,stone:.36,cairn:.4,stat6:1.15,stat7:1.1,stat3:.75,blue:.9,teal:.5,coral:.4,shells:.22,bones:.34,rubble:.34,root:.44,tooth:.4,straw:.28,cage:.5,book:.14,pot:.3,bbucket:.28,lanternW:.24,lanternC:.24,coins:.12,tiles:.1,slab:.3,carved:.55,pillar:.55,crag:.5,scale:.46,key:.26,windlass:.6,candel:.4,cask:.45,skelL:.3,skelS:.46,wreck:.62,sign:.55};
const hOf=d=>{const nh=NPC_H[d.k];return nh?nh*(d.sc||1):null};
const wOf=d=>{const im=IMG[d.k],h=hOf(d);return im&&im.width&&h?h*im.width/im.height:null};
const byc={};for(const d of L.decor){if(d.pic||d.hidden)continue;const c=CAN(d.k);(byc[c]=byc[c]||[]).push(d)}
const ptab=[];let outl=0,scored=0;
for(const [c,a] of Object.entries(byc)){const t=TGT[c];const hs=a.map(hOf).filter(v=>v!=null).sort((p,q)=>p-q);if(!hs.length)continue;
  let bad=0;if(t)for(const v of hs){scored++;if(v<t*.75||v>t*1.25){bad++;outl++}}
  ptab.push([c,a.length,+hs[0].toFixed(2),+hs[hs.length>>1].toFixed(2),+hs[hs.length-1].toFixed(2),t||null,bad])}
const boats={};for(const c of ['boat','yar_boat_row']){const a=byc[c]||[];const ws=a.map(wOf).filter(v=>v!=null);boats[c]=ws.length?[+Math.min(...ws).toFixed(2),+Math.max(...ws).toFixed(2)]:null}
const mx=(c)=>{const a=(byc[c]||[]).map(hOf).filter(v=>v!=null);return a.length?+Math.max(...a).toFixed(2):null};
const rel={wheel:mx('wheel'),barrelMax:mx('barrel'),stat3:mx('stat3'),monk:mx('monk'),chest:mx('chest'),skel:mx('skel'),candle:mx('candle'),book:mx('book')};
const violet=L.decor.filter(d=>!d.pic&&/^art_wm_(boat|crate|barrel|chain|crank|lamp_post|bell|bookshelf|noticeboard|rune|skeleton|tools|mine_cart|keg|bucket|crate_lid|shrine|cask|mirror)$/.test(d.k)).length;
// rows of three or more identical props within two squares in a line, and identical pairs on neighbouring squares
let rows3=0,pairs=0;{const fl=L.decor.filter(d=>!d.pic&&!/boss|brazier|rock5/.test(d.k)&&!(L._bsw&&Math.hypot(d.x-L._bsw.cx,d.y-L._bsw.cy)<L._bsw.R+3));
  for(const d of fl){const c=CAN(d.k);const same=fl.filter(e=>e!==d&&CAN(e.k)===c&&!/web|ladder/.test(c));if(same.filter(e=>(e.y===d.y&&Math.abs(e.x-d.x)<=2)||(e.x===d.x&&Math.abs(e.y-d.y)<=2)).length>=2)rows3++;if(same.some(e=>Math.abs(e.x-d.x)<=1&&Math.abs(e.y-d.y)<=1&&!(e.x===d.x&&e.y===d.y)))pairs++}}
// every wall sign: rune stones and boards say something
const signs=L.decor.filter(d=>d.pic&&d.wd&&/rune|board/.test(d.k));const blankSigns=signs.filter(d=>{const r=HGPD.read[(d.x+d.wd[0])+','+(d.y+d.wd[1])];return !r||!r.t||r.t.length<25}).length;
const orbs=L.decor.filter(d=>d.npc==='wm_orbframe'||/^wm_orbframe/.test(d.k));
const orbReach=orbs.filter(d=>{if(isl(d.x,d.y))return true;return DV.some(v=>seen.has((d.x+v[0])+','+(d.y+v[1])))}).length;
const ncl=HGPD.cl?Object.keys(HGPD.cl).length:0;
// orb light: what the party sees with a torch, and with a glow orb
const lvl={};for(const [n,l] of [['torch',1],['orb',3.2]]){setLightLevel(l);lvl[n]=[+RANGE.toFixed(2),+LUT[300].toFixed(2),+LUT[800].toFixed(2)]}setLightLevel(G.lightLevel);
const rj=JSON.stringify(Object.values(HGPD.read)),emd2=/\u2014/.test(rj)||/\u2014/.test(JSON.stringify(L.mapNames));
const base={decor:L.decor.length,lights:lights.length,coloredLights:ncl,glows:HGPD.glows?HGPD.glows.length:0,orbFrames:orbs.length,orbReach,violet,outliers:outl,scored,rows3,pairs,blankSigns,signCount:signs.length,boats,rel,lvl,emd2,vignettes:L._hgpd.vig.length,ms:L._hgpd.ms,ptab,
 stack3,stack2,clusters:clNoBoss.length,choke:choke.length,deadEnds:dead.length,deadEmpty,longBare,readables:reads.length,badText,emdash:emd,unreachLand:unreachLand.length,onWall,onWater,wallPicBad,foeOnDecorBlock,foeBad,chests,names:L.mapNames.length};
// round 3 extras
const kitNames=L._hgpd.kitNames||[],kitUse=L._hgpd.kitUse||{};
const lab=L.decor.filter(d=>d.pic&&d.wd&&/rune|board|art_hs_|hgs|sign/.test(d.k+(d.hgtBase||'')));
const readable=L.decor.filter(d=>(d.pic&&d.wd&&/rune|board/.test(d.hgtBase||d.k))||/book/.test(d.hgtBase||d.k)&&HGPD.read[d.x+','+d.y]||d.label);
const noLabel=readable.filter(d=>!d.label||d.label.split(/\s+/).length>4).length,noText=readable.filter(d=>!(d.text&&d.text.length>10)).length;
const wallPic={};let wallPicDup=0;for(const d of L.decor){if(!d.pic||!d.wd)continue;const k=d.x+','+d.y+','+d.wd;if(wallPic[k])wallPicDup++;wallPic[k]=1}
const sameSq=L.decor.filter(d=>d.pic&&d.wd&&/hook/.test(d.k)&&L.decor.some(o=>o!==d&&o.pic&&o.wd&&o.x===d.x&&o.y===d.y&&/rune|board|art_hs/.test(o.hgtBase||o.k))).length;
const boatWhole=L.decor.filter(d=>/boat/.test(d.k)&&!/wreck/.test(d.k)).length,wreck=L.decor.filter(d=>/wreck/.test(d.k)).length;
const bookMax=(()=>{const a=L.decor.filter(d=>/hgpd_book/.test(d.k)).map(d=>{const im=IMG[d.k];return NPC_H[d.k]*(d.sc||1)*im.width/im.height});return a.length?+Math.max(...a).toFixed(2):null})();
// dead-end kit repeats: for each dead end square with decor, a signature of the loose props; how many distinct signatures and the biggest share
const sig={};for(const [x,y] of dead){const ks=L.decor.filter(d=>!d.pic&&Math.abs(d.x-x)<=1&&Math.abs(d.y-y)<=1).map(d=>CAN(d.k)).sort().join('+');if(ks){sig[ks]=(sig[ks]||0)+1}}
const sv=Object.values(sig).sort((a,b)=>b-a),sigTotal=sv.reduce((a,b)=>a+b,0);
const seatedSkel=L.decor.filter(d=>CAN(d.k)==='skel').length,lanterns=L.decor.filter(d=>/^lantern/.test(CAN(d.k))).length,buckets=L.decor.filter(d=>CAN(d.k)==='bucket').length;
const statNearJunction=L.decor.filter(d=>/hgdn_st/.test(d.k)).length;
const candleBad=L.decor.filter(d=>!d.pic&&!d.hidden&&CAN(d.k)==='candle'&&(hOf(d)<.11||hOf(d)>.19)).map(d=>[d.k,d.sc,NPC_H[d.k],d.x,d.y,Object.keys(d).join()]).slice(0,6);
return Object.assign(base,{candleBad,kitCount:kitNames.length,kitsUsed:Object.keys(kitUse).length,kitUse,noLabel,noText,readableN:readable.length,wallPicDup,sameSq,boatWhole,wreck,bookMax,sigDistinct:sv.length,sigTop:Object.entries(sig).sort((a,b)=>b[1]-a[1]).slice(0,6),sigTotal,sigTopShare:+(sv[0]/sigTotal).toFixed(2),seatedSkel,lanterns,buckets,statNearJunction,missing:L._hgpd.missing||0,hooksMoved:L._hgpd.hooksMoved||0,statDrop:HGPD.statDrop||0,scoreOnly:1})}
'''
with sync_playwright() as p:
    mode=sys.argv[1] if len(sys.argv)>1 else 'after'
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':960,'height':720})
    errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    if mode=='before': pg.add_init_script('window.__NOHGPD2=true')
    pg.goto('http://localhost:8333/index.html?town=deephollow&lvl=34&v=%d'%int(__import__('time').time()),wait_until='commit',timeout=280000)
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"',timeout=280000);pg.wait_for_timeout(2500)
    r=pg.evaluate(JS)
    json.dump(r,open('tools/polish/u3_audit_%s.json'%mode,'w'))
    ptab=r.pop('ptab')
    for k,v in r.items(): print(k,json.dumps(v)[:300])
    for row in sorted(ptab,key=lambda x:-x[2])[:60]: print(row)
    print('errors',[e for e in errs if 'Failed to load' not in e][:6])
    b.close()
