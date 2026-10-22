/* ==========================================================================
   VERMIN CIRCLES OF THE UNDERLEVEL (prefix hgvu / HGVU), level 476. The same challenge as on the surface (engine in hgd_vermin.js), with higher rewards:
   five large circles (radius 10), eight small ones (radius 4 to 5) on the land of the labyrinth, and one over the black sea (its horrors count). The dark insects already standing inside a circle
   belong to it; the rest are added on free land squares. The ladders keep their distance. Built after the sea and its horrors (hgd_ocean.js, hgd_oceanfoes.js).
   ========================================================================== */
const HGVU_LARGE=['The Weeping Nest','The Black Warren','The Red-Eye Pit','The Chittering Hall','The Bone Gutter'];
const HGVU_SMALL=['The Dripping Hole','The Eye Cluster','The Claw Nook','The Cold Crawl','The Skull Heap','The Sour Corner','The Tar Burrow','The Whisper Bend'];
function hgvuBuild(L){
  if(L._hgvz||!L._hgdu||!L._hgdo)return;
  const W=201,H=201,rnd=hgdmRng(476130),O=L._hgdo,wm=O.wm,rows=L.rows,lad=L._hgdu.ladders;
  const land=(x,y)=>x>=2&&y>=2&&x<W-2&&y<H-2&&rows[y][x]==='.'&&!wm[y*W+x];
  const occ=new Set(),bad=new Set(),mark=(x,y,r)=>{for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)bad.add((x+i)+','+(y+j))};
  for(const d of L.decor){occ.add(d.x+','+d.y);if(d.k==='chest')mark(d.x,d.y,2)}for(const i of L.items)occ.add(i.x+','+i.y);for(const e of L.enemies)occ.add(e.x+','+e.y);
  if(L._msgr)for(const l of L._msgr.letters)mark(l.x,l.y,2);
  const reach=new Uint8Array(W*H),q=[[lad[0].ax,lad[0].ay]];reach[lad[0].ay*W+lad[0].ax]=1;
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H||reach[ny*W+nx]||!land(nx,ny))continue;reach[ny*W+nx]=1;q.push([nx,ny])}}
  const out=[],ids=[];for(let i=0;i<10;i++){ids.push('hgusl'+i);ids.push('hguyk'+i)}
  const isIn=e=>/^hg(usl|uyk)\d$/.test(e.t),nearLad=(x,y,m)=>lad.some(l=>Math.hypot(l.ax-x,l.ay-y)<m);
  const clash=(x,y,R,gap)=>out.some(z=>Math.hypot(z.x-x,z.y-y)<z.r+R+gap);
  const finish=(z,tier,j)=>{z.type='danger';z.vz=true;z.lv=HGDU.ID;z.tier=tier;z.small=tier==='small';z.water=tier==='water';z.rw=hgvzReward('u',tier,j);out.push(z)};
  let wj=0,lj=0,sj=0;
  // the sea: a circle that holds a fair number of horrors
  for(const R of [12,9]){if(out.length)break;let best=null,bs=1e9;const hs=L.enemies.filter(e=>/^hgo/.test(e.t)&&e.t!=='hgoboss'&&!e.vz);
    for(let y=8;y<H-8;y+=3)for(let x=8;x<W-8;x+=3){if(!wm[y*W+x])continue;let c=0;for(const e of hs)if(Math.hypot(e.x-x,e.y-y)<=R)c++;if(c<8||c>26)continue;const sc=Math.abs(c-16)+Math.hypot(x-100,y-100)*.01;if(sc<bs){bs=sc;best=[x,y]}}
    if(best){const z={x:best[0],y:best[1],r:R,name:'The Sunless Deeps',id:'vzu_w0',mon:'sea'};let n=0;for(const e of hs)if(Math.hypot(e.x-z.x,e.y-z.y)<=R){e.vz=z.id;n++}z.n=n;finish(z,'water',wj++)}}
  const cellsOf=(x,y,R)=>{const c=[];for(let j=y-R;j<=y+R;j++)for(let i=x-R;i<=x+R;i++){if(Math.hypot(i-x,j-y)>R||!land(i,j)||!reach[j*W+i])continue;const k=i+','+j;if(!occ.has(k)&&!bad.has(k)&&!nearLad(i,j,8))c.push([i,j])}return c};
  const place=(name,id,R,n0,gap,tier,j)=>{
    for(let t=0;t<9000;t++){const x=8+((rnd()*(W-16))|0),y=8+((rnd()*(H-16))|0);if(!land(x,y)||!reach[y*W+x]||nearLad(x,y,R+8)||clash(x,y,R,gap))continue;
      const ex=L.enemies.filter(e=>isIn(e)&&!e.vz&&Math.hypot(e.x-x,e.y-y)<=R);if(ex.length>(tier==='large'?n0+4:n0+1))continue;
      const cs=cellsOf(x,y,R),need=Math.max(0,n0-ex.length);if(cs.length<need+(tier==='large'?14:5))continue;
      const z={x,y,r:R,name,id,mon:'under'};for(const e of ex)e.vz=id;let got=ex.length;
      for(let k=0;k<need;k++){const c=cs.splice((rnd()*cs.length)|0,1)[0];occ.add(c[0]+','+c[1]);L.enemies.push({t:ids[(rnd()*ids.length)|0],x:c[0],y:c[1],vz:id});got++}
      z.n=got;finish(z,tier,j);return true}return false};
  HGVU_LARGE.forEach((nm,k)=>{place(nm,'vzu_l'+k,10,14+((rnd()*7)|0),6,'large',lj++)});
  HGVU_SMALL.forEach((nm,k)=>{place(nm,'vzu_s'+k,4+((rnd()*2)|0),5+((rnd()*3)|0),3,'small',sj++)});
  L._hgvz=out}
{const _b=hgduBuild;hgduBuild=function(){const had=!!LEVELS[HGDU.ID];_b.apply(this,arguments);const L=LEVELS[HGDU.ID];if(!had&&L&&L._hgdo)try{hgvuBuild(L)}catch(e){console.error('hgvu',e)}}}
/* ---------- the names on the Underlevel map (the shared names layer has no kind for them) ---------- */
{const _dn=hgdmpDrawNames;hgdmpDrawNames=function(vi){_dn.apply(this,arguments);
  if(vi!==5)return;try{const V=MPL.view,U=LEVELS[HGDU.ID];if(!V||!V.z||!U||!U._hgvz)return;const z=V.z,A=V.area,F=G.flags.hgdVz||{};
    ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';
    for(const q of U._hgvz){const sz=Math.max(4.6,6.4/Math.pow(z,.4)),px=A.x+(V.X(q.x+.5)-V.sx0)*z,py=A.y+(V.Y(q.y+.5)-V.sy0)*z;if(px<A.x-60||px>A.x+A.w+60||py<A.y-8||py>A.y+A.h+8)continue;
      ctx.font='bold '+sz+'px '+FUI;const t=q.name+(F[q.id]?' (cleared)':'');ctx.lineWidth=2.2;ctx.strokeStyle='#050102';ctx.strokeText(t,px,py);ctx.fillStyle=F[q.id]?'#7ee08a':'#ecdcc0';ctx.fillText(t,px,py)}
    ctx.restore()}catch(e){}}}
