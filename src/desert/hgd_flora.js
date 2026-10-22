/* ==========================================================================
   SYMBOLS, SHIELDS, PLANTS, VINES AND CLOUDS OF THE MAZE (prefix hgdf2 / HGDF2). All painted pictures (assets/ds_hgdf_*.png, made with Gemini):
   - 16 ornate symbols drawn straight on the walls, like a tattoo or a cave painting, in each biome's own sign (and a few common ones: snake, moon, tree, hand);
   - 9 round gilded shields, hung in the built-up places (the towns and the stone rooms);
   - 8 kinds of grass and small wild plants growing out of the ground in the wilder parts of the maze;
   - 4 kinds of hanging vine on the walls;
   - clouds that drift slowly through sections of the maze, only ever over open floor (never through a wall).
   ========================================================================== */
for(let i=0;i<16;i++)NPC_H['art_hgdf_wsym'+i]=.85;
for(let i=0;i<9;i++)NPC_H['art_hgdf_shield'+i]=.8;
Object.assign(NPC_H,{art_hgdf_plant0:.95,art_hgdf_plant1:.5,art_hgdf_plant2:.8,art_hgdf_plant3:.55,art_hgdf_plant4:.7,art_hgdf_plant5:.85,art_hgdf_plant6:.35,art_hgdf_plant7:1.0});
for(let i=0;i<4;i++)NPC_H['art_hgdf_vine'+i]=1.8;
for(const k of ['aqua1','aqua2','cream1','cream2','lilac1','lilac2','pink1','pinkstreak'])NPC_H['hgt_cloud_'+k]=.75;
// the cloud pictures are soft clouds on BLACK with no alpha (brightness is the alpha): as plain sprites they showed as opaque blocks with a cloud painted on, so each is turned into a see-through picture
function hgdfCloudInit(){if(HGDF2_CLOUD_OK)return;let n=0;for(const k of ['aqua1','aqua2','cream1','cream2','lilac1','lilac2','pink1','pinkstreak']){if(IMG['hgdfc_'+k]){n++;continue}
    const src=IMG['hgt_cloud_'+k];if(!src||!src.width)continue;const S=Math.min(256,src.width),h=Math.max(8,Math.round(S*src.height/src.width)),c=document.createElement('canvas');c.width=S;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(src,0,0,S,h);
    const d=x.getImageData(0,0,S,h),a=d.data;for(let i=0;i<a.length;i+=4){const l0=Math.max(a[i],a[i+1],a[i+2])/255,l=Math.max(0,(l0-.1)/.9),kk=l0>.02?1/l0:0;a[i]=Math.min(255,a[i]*kk*.92);a[i+1]=Math.min(255,a[i+1]*kk*.92);a[i+2]=Math.min(255,a[i+2]*kk*.92);a[i+3]=Math.min(255,Math.pow(l,.85)*255*.85)} // the dark noise of the black background counts as nothing
    x.putImageData(d,0,0);IMG['hgdfc_'+k]=c;NPC_H['hgdfc_'+k]=.75;n++}
  if(n>=8)HGDF2_CLOUD_OK=true}
let HGDF2_CLOUD_OK=false;
const HGDF2_WSYM=[0,1,2,3,4,5,6,7],HGDF2_SHIELD=[0,1,2,5,3,4,7,8],HGDF2_EXTRA=[8,9,10,11,12,13,14,15],HGDF2_CLOUDS=['cream1','cream2','aqua1','aqua2','lilac1','lilac2','pink1'];
function hgdf2Build(L){
  if(L._hgdf2)return;const M=L._hgdm,W=M.W,P=L._hgdp,rows=L.rows,kind=M.kind,bio=M.bio,rnd=hgdmRng(475020),open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y)),blk=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const isWall=(x,y)=>{const c=rows[y]&&rows[y][x];return c&&c!=='.'&&c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8};
  const faces=[];for(const k of reach){const [x,y]=k.split(',').map(Number);for(const [a,b] of [[0,-1],[1,0],[0,1],[-1,0]])if(isWall(x+a,y+b))faces.push([x,y,a,b])}
  faces.sort(()=>rnd()-.5);
  const used=new Set(),far=(list,x,y,d)=>list.every(p=>Math.abs(p[0]-x)+Math.abs(p[1]-y)>=d),face=(x,y,a,b)=>x+','+y+','+a+','+b;
  const syms=[],vines=[],shields=[],safeZ=P.zones.filter(z=>z.type==='safe'&&z.town!==undefined),inTown=(x,y,pad)=>safeZ.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+(pad||0));
  let ns=0,nv=0,nsh=0;
  // symbols on the walls: each biome's own sign (mostly), now and then a common one
  for(const [x,y,a,b] of faces){if(ns>=230)break;if(!far(syms,x,y,6))continue;
    const bi=bio[(y+b)*W+(x+a)],sym=rnd()<.22?HGDF2_EXTRA[(rnd()*8)|0]:HGDF2_WSYM[bi];
    L.decor.push({k:'art_hgdf_wsym'+sym,x,y,wd:[a,b],pic:1,block:false,walk:true,deco:true,bob:.55});syms.push([x,y]);used.add(face(x,y,a,b));ns++}
  // shields in the built-up places: round the towns and in the stone rooms
  const hang=(x,y,a,b)=>{const bi=bio[(y+b)*W+(x+a)];L.decor.push({k:'art_hgdf_shield'+(rnd()<.18?6:HGDF2_SHIELD[bi]),x,y,wd:[a,b],pic:1,block:false,walk:true,deco:true,bob:.5});shields.push([x,y]);nsh++};
  for(const [x,y,a,b] of faces){if(nsh>=150)break;if(used.has(face(x,y,a,b)))continue;if(!(inTown(x,y,2)||kind[y*W+x]===2))continue;if(!far(shields,x,y,5))continue;hang(x,y,a,b);used.add(face(x,y,a,b))}
  // vines hanging on the walls, thicker in the wilder parts
  const wild=[];{let t=0;const cells=[...reach];while(wild.length<8&&t++<3000){const c=cells[(rnd()*cells.length)|0].split(',').map(Number);if(inTown(c[0],c[1],6)||wild.some(w=>Math.hypot(w[0]-c[0],w[1]-c[1])<34))continue;wild.push([c[0],c[1],13+((rnd()*6)|0)])}}
  const inWild=(x,y)=>wild.some(w=>Math.hypot(w[0]-x,w[1]-y)<=w[2]);
  for(const [x,y,a,b] of faces){if(nv>=200)break;if(used.has(face(x,y,a,b)))continue;if(!far(vines,x,y,inWild(x,y)?3:9))continue;
    L.decor.push({k:'art_hgdf_vine'+((rnd()*4)|0),x,y,wd:[a,b],pic:1,block:false,walk:true,deco:true,bob:.9});vines.push([x,y]);used.add(face(x,y,a,b));nv++}
  // grass and small plants growing out of the ground, in the wild parts (and a little everywhere in the open)
  let np=0;const plantAt=new Set();
  for(const k of reach){const [x,y]=k.split(',').map(Number);if(occ.has(k)||blk.has(k)||plantAt.has(k))continue;const w=inWild(x,y),wide=kind[y*W+x]>0;
    const p=w?(wide?.34:.12):(wide?.03:0);if(rnd()>=p)continue;
    const t=rnd()<.4?(rnd()<.5?0:1):(rnd()*8)|0;plantAt.add(k);L.decor.push({k:'art_hgdf_plant'+t,x,y,block:false,walk:true,deco:true,sc:.8+rnd()*.35});np++}
  // clouds drifting slowly through seven sections of the maze (open floor only)
  const clouds=[];let tc=0;const cells2=[...reach];const homes=[];
  while(homes.length<7&&tc++<4000){const c=cells2[(rnd()*cells2.length)|0].split(',').map(Number);if(homes.some(h=>Math.hypot(h[0]-c[0],h[1]-c[1])<26))continue;homes.push(c)}
  homes.forEach((h,hi)=>{for(let k=0;k<4;k++){const id='hgdcloud'+hi+'_'+k;let c=h;const near=cells2.map(s=>s.split(',').map(Number)).filter(s=>Math.hypot(s[0]-h[0],s[1]-h[1])<=7);if(near.length)c=near[(rnd()*near.length)|0];
    L.decor.push({k:'hgdfc_'+HGDF2_CLOUDS[(rnd()*HGDF2_CLOUDS.length)|0],x:c[0],y:c[1],block:false,walk:true,deco:true,cloudid:id,sc:1.5+rnd()*.8,bob:.6+rnd()*.25});clouds.push({id,home:h,cell:[c[0],c[1]],tgt:null,f:0,wait:rnd()*3,prev:null})}});
  L._hgdf2={symbols:ns,shields:nsh,vines:nv,plants:np,wild:wild.length,clouds:clouds.length,cloudAgents:clouds}}
// the drift: a cloud steps to a neighbouring open floor square, mostly straight on, slowly; it never enters a wall or a blocked square
{const _u=update;let dec=null,map=null,blk=null;update=function(dt){
  try{hgdfCloudInit()}catch(e){}
  try{if(LEVEL===HGD.ID&&G.state==='play'&&G.decor){const L=LEVELS[HGD.ID];if(L&&L._hgdf2){
    if(dec!==G.decor){dec=G.decor;map=new Map();blk=new Set(G.decor.filter(q=>q.block).map(q=>q.x+','+q.y))}
    const open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&!blk.has(x+','+y);
    for(const a of L._hgdf2.cloudAgents){let d=map.get(a.id);if(!d){d=G.decor.find(q=>q.cloudid===a.id);if(!d)continue;map.set(a.id,d)}
      if(!a.tgt){a.wait-=dt;if(a.wait>0)continue;
        const opts=[[1,0],[-1,0],[0,1],[0,-1]].map(([x,y])=>[a.cell[0]+x,a.cell[1]+y]).filter(([x,y])=>open(x,y)&&Math.hypot(x-a.home[0],y-a.home[1])<=11);
        if(!opts.length){a.wait=2;continue}
        // prefer to keep going the way it was going
        let pick=null;if(a.prev){const sx=a.cell[0]+a.prev[0],sy=a.cell[1]+a.prev[1];if(opts.some(o=>o[0]===sx&&o[1]===sy)&&Math.random()<.75)pick=[sx,sy]}
        if(!pick)pick=opts[(Math.random()*opts.length)|0];a.prev=[pick[0]-a.cell[0],pick[1]-a.cell[1]];a.tgt=pick;a.f=0}
      a.f+=dt*.32;if(a.f>=1){a.cell=a.tgt;a.tgt=null;a.f=0;a.wait=.1;d.x=a.cell[0];d.y=a.cell[1];d.ox=0;d.oy=0;continue}
      d.x=a.cell[0];d.y=a.cell[1];d.ox=(a.tgt[0]-a.cell[0])*a.f;d.oy=(a.tgt[1]-a.cell[1])*a.f}}}}catch(e){}
  return _u.apply(this,arguments)}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdq)try{hgdf2Build(L)}catch(e){console.error('hgdf2',e)}}}
