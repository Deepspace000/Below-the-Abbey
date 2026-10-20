/* ==========================================================================
   HOLLOW GRASSLANDS CITIES: SOFTWARE 3D MESHES, FLOATING PLANETS AND LOW CLOUDS (prefix hgtm / HGTM)
   A small triangle renderer that draws articulated models INSIDE the raycaster frame. Terraced town levels only (480..489, 4850..).
   Hooks (index.html, drawSprites): hgtmBegin() before the sprite loop, hgtmDraw(entry) between sprites (far to near, by depth),
   hgtmEnd() after it (cloud fog). render3D calls hgtmRec(x,perp,top,first) for every wall hit (so a mesh can show above a low wall).
   Camera: exactly the raycaster's (cx,cy, CAMZ, dX,dY, F, HH, VW x VH). World units = cells; z is height (terrace heights).

   API
     hgtmDef(name, model)                       register a model (see format)
     hgtmSpawn(name, {x,y,h,scale,yaw,speed,route,seed,level,foot,loop,stride,far})   place one on level opts.level (default: current LEVEL).
        Instances are rebuilt from these records on every level entry and are never saved. route=[[x,y],...] (planets/clouds [x,y,z]):
        a smooth closed loop (Catmull-Rom); loop:false = there and back. A walker waits when the party is within `foot` cells of its next step.
        h = fixed ground height (default: the terrace height under it, eased). scale multiplies the model (1 = model units = cells).
     hgtmPlanet(name, tex, radius, opts)        define a floating sphere: tex = IMG name of an equirectangular picture (or null: stand-in bands from
        opts.col/col2), radius in cells, opts {spin(rad/s), tilt, glow 0..1, atmo:[r,g,b], ring:{in,out,col,alpha}, moon:{r,orbit,period,col,tex}, max:512}
        then hgtmSpawn(name,{level,route:[[x,y,z],...],speed}).  Planets are scenery in the air; they never block a cell.
     hgtmCloud(opts)                            spawn a low 3D cloud now: {level,x,y,z,r,puffs,seed,route,speed,alpha,col,loop}. A party can walk into one
        (milky fog overlay, lit from within by lamp colours). hgtmCloudField(level,n,{x0,y0,x1,y1,z0,z1}) scatters n of them on slow loops.
     hgtmUpdate(dt)                             moves instances (called automatically from hgtmBegin with the frame time)
     hgtmClear(level)                           forget the spawn records of a level
     HGTM.test=false                            switch the demo spawns (levels 480 and 483) off
     HGTM.ms / HGTM.tris / HGTM.vis             cost of the last frame (ms in hgtmBegin+draw, triangles rasterised, instances drawn)

   MODEL FORMAT (hgtmDef):
     model={ rad: bounding radius in model units (for culling), foot: footprint radius for the party rule, cycle: model units walked per gait cycle,
             root: NODE, anim:(t,st)=>pose }
       NODE={ id:'body', pos:[x,y,z], rot:[rx,ry,rz] (radians, R=Rz*Ry*Rx), parts:[PART..], kids:[NODE..] }     local axes: +y forward, +x right, +z up
       POSE (returned by anim; every key optional):  {n:{nodeId:{p:[dx,dy,dz], r:[drx,dry,drz]}}, l:{limbId:[a0,a1,a2]}, ro:{limbId:rollRadians}}
         limb angles are relative joint pitches about x; positive swings the far end toward +y (forward).  st={t,phase(cycles),walk 0..1,sp,seed,sc}
       PARTS (all take tex:'IMG name' (optional), col:[r,g,b] 0..255 multiplier or flat colour, glow:0..1 self light, alpha:true (cut-out), grade:false):
         {t:'ell', c:[x,y,z], r:[rx,ry,rz], rot:[..], seg:[lon,lat], uv:[repeatU,repeatV]}          sphere / ellipsoid
         {t:'limb', id, len:[l0,l1,(l2)], rad:[r0,r1,r2,(r3)], sides:6, ball:true, up:true}        tapered segmented limb (FK), hangs down (-z), up:true grows up
         {t:'quad', c:[x,y,z], size:[w,h], piv:[.5,.5], uv:[u0,v0,u1,v1]}                           flat card in the x/z plane (wings, fins), double sided
         {t:'fan', c:[x,y,z], n:20, len:1, wid:.2, base:.04, spread:2.4, layers:2, shimmer:[amp,freq], vcol:[[r,g,b],[r,g,b],[r,g,b]]}   feathers radiating
              in the x/z plane from c, angle 0 = up; each feather is a textured card (tex = one feather picture); vcol colours base/middle/tip
         {t:'disc', c:[x,y,z], r:.1, axis:'+y', seg:12}                                              flat disc (eyes), tex mapped across it
       Texture images are loaded from IMG, graded a little by the level look, and sampled perspective-correct.
   Rendering: Gouraud lighting per vertex (fixed cave light + the level's lamps with their colours), per-pixel haze like the walls, per-pixel depth test
   against wall tops/walls (hgtmRec) and the terraced ground (YB). Everything is drawn into one layer per instance, ordered with the sprites by depth.
   ========================================================================== */
const HGTM={models:{},planets:{},spawns:{},inst:[],lvl:-1,tex:{},slots:[],puffC:{},ms:0,tris:0,vis:0,test:true,tLast:-1,out:[],fog:0,fogCol:[200,196,225],budget:9,sw:null};
var HGTM_REC=true;
const HGTM_N=8,HGTM_WN=new Uint8Array(VW),HGTM_WS=new Float64Array(VW).fill(-1),HGTM_WP=new Float32Array(VW*HGTM_N),HGTM_WT=new Float32Array(VW*HGTM_N);
function hgtmRec(x,perp,yT,first){ // one wall hit of screen column x (called far to near)
  let n=first?0:HGTM_WN[x];HGTM_WS[x]=G.time;
  if(n>=HGTM_N){const b=x*HGTM_N;for(let k=0;k<HGTM_N-1;k++){HGTM_WP[b+k]=HGTM_WP[b+k+1];HGTM_WT[b+k]=HGTM_WT[b+k+1]}n=HGTM_N-1}
  HGTM_WP[x*HGTM_N+n]=perp;HGTM_WT[x*HGTM_N+n]=yT;HGTM_WN[x]=n+1;
}
const HGTM_SEC=new Float32Array(VW);for(let x=0;x<VW;x++){const u=(x+.5-VW/2)/F;HGTM_SEC[x]=Math.sqrt(1+u*u)}
const hgtmRnd=s=>{let a=(s|0)+0x6D2B79F5|0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};

/* ---------- small matrix helpers: M=[r00,r01,r02,r10,r11,r12,r20,r21,r22,tx,ty,tz] ---------- */
function hgtmEuler(rx,ry,rz,o){const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),cz=Math.cos(rz),sz=Math.sin(rz);
  o[0]=cz*cy;o[1]=cz*sy*sx-sz*cx;o[2]=cz*sy*cx+sz*sx;o[3]=sz*cy;o[4]=sz*sy*sx+cz*cx;o[5]=sz*sy*cx-cz*sx;o[6]=-sy;o[7]=cy*sx;o[8]=cy*cx;return o}
function hgtmMul(P,L,o){ // o = P * L
  o[0]=P[0]*L[0]+P[1]*L[3]+P[2]*L[6];o[1]=P[0]*L[1]+P[1]*L[4]+P[2]*L[7];o[2]=P[0]*L[2]+P[1]*L[5]+P[2]*L[8];
  o[3]=P[3]*L[0]+P[4]*L[3]+P[5]*L[6];o[4]=P[3]*L[1]+P[4]*L[4]+P[5]*L[7];o[5]=P[3]*L[2]+P[4]*L[5]+P[5]*L[8];
  o[6]=P[6]*L[0]+P[7]*L[3]+P[8]*L[6];o[7]=P[6]*L[1]+P[7]*L[4]+P[8]*L[7];o[8]=P[6]*L[2]+P[7]*L[5]+P[8]*L[8];
  o[9]=P[0]*L[9]+P[1]*L[10]+P[2]*L[11]+P[9];o[10]=P[3]*L[9]+P[4]*L[10]+P[5]*L[11]+P[10];o[11]=P[6]*L[9]+P[7]*L[10]+P[8]*L[11]+P[11];return o}
/* two-bone inverse kinematics in the leg plane: foot at (f forward, d down) from the hip. bend=+1 knee forward, -1 knee back. returns [a0,a1] */
function hgtmIK2(l1,l2,f,d,bend){let D=Math.hypot(f,d);const mx=(l1+l2)*.999,mn=Math.abs(l1-l2)*1.001+.001;if(D>mx)D=mx;if(D<mn)D=mn;
  const be=Math.atan2(f,d),al=Math.acos(Math.max(-1,Math.min(1,(l1*l1+D*D-l2*l2)/(2*l1*D)))),a0=be+(bend||1)*al,kf=l1*Math.sin(a0),kd=l1*Math.cos(a0);
  return [a0,Math.atan2(f-kf,d-kd)-a0]}
/* gait helper: foot position along the body for a leg with phase s (0..1): returns [forward, lift] ; A = half stride, H = lift height, beta = stance fraction */
function hgtmFoot(s,A,H,beta){s=((s%1)+1)%1;beta=beta||.7;if(s<beta)return[A-2*A*(s/beta),0];const q=(s-beta)/(1-beta);return[-A+2*A*q,H*Math.sin(Math.PI*q)]}

/* ---------- textures ---------- */
function hgtmTex(name,max,grade){
  if(!name)return null;const key=name+'|'+(max||256)+'|'+(grade===false?0:LEVEL);let t=HGTM.tex[key];
  if(t)return t.d?t:(G.time-t.miss>3?(delete HGTM.tex[key],hgtmTex(name,max,grade)):null);
  const im=IMG[name]||IMG['art_'+name]||IMG[name.replace(/^ds_/,'art_')]||IMG[name.replace(/^ds_/,'')];
  if(!im||!(im.width||im.videoWidth)){HGTM.tex[key]={d:null,miss:G.time};return null}
  const pw=n=>{let p=1;while(p*2<=n*1.04)p*=2;return p},mx=max||256,w=Math.min(pw(im.width),mx),h=Math.min(pw(im.height),mx);
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,w,h);
  const d=x.getImageData(0,0,w,h).data;
  if(grade!==false&&hgtLook(LEVEL)){const K=hgtLookFor(LEVEL),sa=1+(K.wallSat-1)*.5,gn=(1+K.wallGain)/2;
    for(let i=0;i<d.length;i+=4){const lm=d[i]*.3+d[i+1]*.59+d[i+2]*.11;d[i]=(lm+(d[i]-lm)*sa)*gn;d[i+1]=(lm+(d[i+1]-lm)*sa)*gn;d[i+2]=(lm+(d[i+2]-lm)*sa)*gn}}
  return HGTM.tex[key]={w,h,d,wm:w-1,hm:h-1};
}

/* ---------- part geometry ---------- */
const hgtmSphT={};
function hgtmSphere(lon,lat){const k=lon+'x'+lat;if(hgtmSphT[k])return hgtmSphT[k];
  const nv=(lon+1)*(lat+1),p=new Float32Array(nv*3),uv=new Float32Array(nv*2),tr=[];
  for(let j=0;j<=lat;j++){const th=Math.PI*j/lat,st=Math.sin(th),ct=Math.cos(th);for(let i=0;i<=lon;i++){const ph=2*Math.PI*i/lon,o=j*(lon+1)+i;p[o*3]=st*Math.cos(ph);p[o*3+1]=st*Math.sin(ph);p[o*3+2]=ct;uv[o*2]=i/lon;uv[o*2+1]=j/lat}}
  for(let j=0;j<lat;j++)for(let i=0;i<lon;i++){const a=j*(lon+1)+i,b=a+1,c=a+lon+1,d=c+1;if(j>0)tr.push(a,c,b);if(j<lat-1)tr.push(b,c,d)}
  return hgtmSphT[k]={nv,p,uv,tr:Uint16Array.from(tr)}}
function hgtmRotPart(pos,nor,rot){if(!rot)return;const m=hgtmEuler(rot[0],rot[1],rot[2],new Float32Array(9));
  for(let i=0;i<pos.length;i+=3){for(const A of nor?[pos,nor]:[pos]){const x=A[i],y=A[i+1],z=A[i+2];A[i]=m[0]*x+m[1]*y+m[2]*z;A[i+1]=m[3]*x+m[4]*y+m[5]*z;A[i+2]=m[6]*x+m[7]*y+m[8]*z}}}
function hgtmBuildPart(d,nodeIx){
  const P={node:nodeIx,tex:d.tex||null,texMax:d.texMax||256,col:d.col||[255,255,255],glow:d.glow||0,alpha:!!d.alpha,grade:d.grade,dbl:false,kind:d.t,def:d,vcol:null,gen:null};
  const c=d.c||[0,0,0];
  if(d.t==='ell'){const r=d.r||[.5,.5,.5],S=hgtmSphere(d.seg?d.seg[0]:12,d.seg?d.seg[1]:8),nv=S.nv,uvr=d.uv||[1,1];
    P.nv=nv;P.lpos=new Float32Array(nv*3);P.lnor=new Float32Array(nv*3);P.uv=new Float32Array(nv*2);P.tr=S.tr;
    for(let i=0;i<nv;i++){const ux=S.p[i*3],uy=S.p[i*3+1],uz=S.p[i*3+2];P.lpos[i*3]=ux*r[0];P.lpos[i*3+1]=uy*r[1];P.lpos[i*3+2]=uz*r[2];
      const nx=ux/r[0],ny=uy/r[1],nz=uz/r[2],nl=Math.hypot(nx,ny,nz)||1;P.lnor[i*3]=nx/nl;P.lnor[i*3+1]=ny/nl;P.lnor[i*3+2]=nz/nl;P.uv[i*2]=S.uv[i*2]*uvr[0];P.uv[i*2+1]=S.uv[i*2+1]*uvr[1]}
    hgtmRotPart(P.lpos,P.lnor,d.rot);for(let i=0;i<nv;i++){P.lpos[i*3]+=c[0];P.lpos[i*3+1]+=c[1];P.lpos[i*3+2]+=c[2]}
  }else if(d.t==='disc'){const seg=d.seg||12,r=d.r||.1,ax=d.axis||'+y',sg=ax[0]==='-'?-1:1,A=ax[1];
    P.dbl=d.dbl!==false;P.nv=seg+2;P.lpos=new Float32Array(P.nv*3);P.lnor=new Float32Array(P.nv*3);P.uv=new Float32Array(P.nv*2);
    const tr=[];for(let i=0;i<=seg;i++){const a=2*Math.PI*i/seg,ca=Math.cos(a),sa=Math.sin(a),o=(i+1)*3;let p;
      if(A==='y')p=[ca*r,0,sa*r];else if(A==='x')p=[0,ca*r,sa*r];else p=[ca*r,sa*r,0];
      P.lpos[o]=p[0]+c[0];P.lpos[o+1]=p[1]+c[1];P.lpos[o+2]=p[2]+c[2];P.uv[(i+1)*2]=.5+.5*ca;P.uv[(i+1)*2+1]=.5-.5*sa;if(i<seg)tr.push(0,i+1,i+2)}
    P.lpos[0]=c[0];P.lpos[1]=c[1];P.lpos[2]=c[2];P.uv[0]=.5;P.uv[1]=.5;
    for(let i=0;i<P.nv;i++){P.lnor[i*3+(A==='x'?0:A==='y'?1:2)]=sg}
    P.tr=Uint16Array.from(tr);
  }else if(d.t==='quad'){const w=d.size[0],h=d.size[1],pv=d.piv||[.5,.5],u=d.uv||[0,0,1,1];P.dbl=true;P.nv=4;
    const x0=-pv[0]*w,x1=(1-pv[0])*w,z0=-pv[1]*h,z1=(1-pv[1])*h;
    P.lpos=Float32Array.from([x0+c[0],c[1],z0+c[2],x1+c[0],c[1],z0+c[2],x1+c[0],c[1],z1+c[2],x0+c[0],c[1],z1+c[2]]);
    P.lnor=Float32Array.from([0,1,0,0,1,0,0,1,0,0,1,0]);P.uv=Float32Array.from([u[0],u[3],u[2],u[3],u[2],u[1],u[0],u[1]]);P.tr=Uint16Array.from([0,1,2,0,2,3]);
    hgtmRotPart(P.lpos,P.lnor,d.rot);
  }else if(d.t==='limb'){
    const L=d.len,nb=L.length,sd=d.sides||6,up=!!d.up,rad=d.rad,joints=nb+1,ball=d.ball!==false&&!d.noball,bs=ball?hgtmSphere(6,4):null;
    P.id=d.id;P.up=up;P.sides=sd;P.nb=nb;P.rad=rad;P.len=L;P.ball=ball;
    const ringV=joints*sd,tip=1;P.nv=ringV+tip+(ball?joints*bs.nv:0);P.lpos=new Float32Array(P.nv*3);P.lnor=new Float32Array(P.nv*3);P.uv=new Float32Array(P.nv*2);
    const tr=[];for(let i=0;i<nb;i++)for(let k=0;k<sd;k++){const a=i*sd+k,b=i*sd+(k+1)%sd,cc=(i+1)*sd+k,dd=(i+1)*sd+(k+1)%sd;if(up){tr.push(a,b,cc,b,dd,cc)}else{tr.push(a,cc,b,b,cc,dd)}}
    for(let k=0;k<sd;k++){const a=nb*sd+k,b=nb*sd+(k+1)%sd;if(up)tr.push(a,b,ringV);else tr.push(a,ringV,b)}
    for(let i=0;i<joints;i++)for(let k=0;k<sd;k++){const o=i*sd+k;P.uv[o*2]=k/sd;P.uv[o*2+1]=i/nb}
    if(ball)for(let i=0;i<joints;i++){const base=ringV+tip+i*bs.nv;for(let v=0;v<bs.nv;v++){P.uv[(base+v)*2]=bs.uv[v*2];P.uv[(base+v)*2+1]=bs.uv[v*2+1]}
      for(let q=0;q<bs.tr.length;q++)tr.push(base+bs.tr[q])}
    P.tr=Uint16Array.from(tr);P.bs=bs;
    P.gen=hgtmGenLimb;
  }else if(d.t==='fan'){const n=d.n||20,lay=d.layers||1,nf=n*lay;P.dbl=true;P.nf=nf;P.nv=nf*6;P.lpos=new Float32Array(P.nv*3);P.lnor=new Float32Array(P.nv*3);P.uv=new Float32Array(P.nv*2);P.vc=new Float32Array(P.nv*3);
    const vc=d.vcol||[[255,255,255],[255,255,255],[255,255,255]],tr=[];
    for(let f=0;f<nf;f++){const b=f*6;      for(let r=0;r<3;r++)for(let s=0;s<2;s++){const vi=b+r*2+s;P.uv[vi*2]=s;P.uv[vi*2+1]=1-r*.5;for(let k=0;k<3;k++)P.vc[vi*3+k]=vc[r][k]/255;P.lnor[vi*3+1]=1}}
    // two quads: rows (0,1)-(2,3) and (2,3)-(4,5)
    const t2=[];for(let f=0;f<nf;f++){const b=f*6;t2.push(b,b+1,b+3,b,b+3,b+2,b+2,b+3,b+5,b+2,b+5,b+4)}
    P.tr=Uint16Array.from(t2);P.gen=hgtmGenFan;
    P.vcol=P.vc;
  }
  P.nt=P.tr.length/3;return P;
}
function hgtmGenLimb(P,pose,inst,M){ // fills P.lpos / P.lnor from the joint angles (relative pitches, positive = far end swings forward)
  const a=(pose&&pose.l&&pose.l[P.id])||P.def.rest||[],roll=(pose&&pose.ro&&pose.ro[P.id])||0,sd=P.sides,nb=P.nb,up=P.up,cr=Math.cos(roll),sr=Math.sin(roll);
  const c=P.def.c||[0,0,0],lp=P.lpos,ln=P.lnor,bs=P.bs,ringV=(nb+1)*sd,cb=[];let cum=0;
  for(let i=0;i<nb;i++){cum+=(a[i]||0);cb.push(cum)}
  let py=0,pz=0;
  const put=(o,x,y,z,nx,ny,nz)=>{lp[o]=(x*cr+z*sr)+c[0];lp[o+1]=y+c[1];lp[o+2]=(-x*sr+z*cr)+c[2];ln[o]=nx*cr+nz*sr;ln[o+1]=ny;ln[o+2]=-nx*sr+nz*cr};
  for(let i=0;i<=nb;i++){
    const ang=i===0?cb[0]:i===nb?cb[nb-1]:(cb[i-1]+cb[i])*.5,cs=Math.cos(ang),sn=Math.sin(ang),wy=cs,wz=up?-sn:sn,r=P.rad[Math.min(i,P.rad.length-1)];
    for(let k=0;k<sd;k++){const th=6.283185*k/sd,ct=Math.cos(th),st=Math.sin(th);put((i*sd+k)*3,r*ct,py+r*st*wy,pz+r*st*wz,ct,st*wy,st*wz)}
    if(P.ball){const br=r*1.12,base=ringV+1+i*bs.nv;for(let v=0;v<bs.nv;v++){const ux=bs.p[v*3],uy=bs.p[v*3+1],uz=bs.p[v*3+2];put((base+v)*3,ux*br,py+uy*br,pz+uz*br,ux,uy,uz)}}
    if(i<nb){const L=P.len[i],s2=Math.sin(cb[i]),c2=Math.cos(cb[i]);py+=s2*L;pz+=(up?c2:-c2)*L}
  }
  const el=P.rad[P.rad.length-1]*.8,ang=cb[nb-1],s3=Math.sin(ang),c3=Math.cos(ang);
  put(ringV*3,0,py+s3*el,pz+(up?c3:-c3)*el,0,s3,up?c3:-c3);
}
function hgtmGenFan(P,pose,inst){
  const d=P.def,n=d.n||20,lay=d.layers||1,len=d.len||1,wid=d.wid||.2,wb=d.base===undefined?.04:d.base,spread=d.spread||2.4,c=d.c||[0,0,0],sh=d.shimmer||[0,0],t=G.time,lp=P.lpos,ln=P.lnor;
  const lw=(pose&&pose.fan)||0;
  for(let L=0;L<lay;L++)for(let i=0;i<n;i++){const f=L*n+i,fr=n>1?i/(n-1):.5,a0=-spread/2+spread*fr+(L?spread/n*.5:0)+(lw*.12),rip=Math.sin(t*sh[1]+i*.7+L*1.9)*sh[0],a=a0+rip*.35,sa=Math.sin(a),ca=Math.cos(a);
    const yo=-.03*L-.012*Math.abs(fr-.5)*4,bend=Math.sin(t*sh[1]*.7+i*.5)*sh[0]*.6*len,tl=len*(L?.93:1);
    for(let r=0;r<3;r++){const r0=r*.5,dist=tl*r0,w=(r===0?wb:r===1?wid:wid*.55)*.5,px=c[0]+sa*dist,pz=c[2]+ca*dist,yy=c[1]+yo+bend*r0*r0;
      for(let s=0;s<2;s++){const sg=s?1:-1,o=(f*6+r*2+s)*3;lp[o]=px+ca*w*sg;lp[o+1]=yy;lp[o+2]=pz-sa*w*sg;ln[o]=0;ln[o+1]=1;ln[o+2]=0}}
  }
}

/* ---------- model compile ---------- */
function hgtmDef(name,model){
  const nodes=[],parts=[];
  const walk=(nd,par)=>{const ix=nodes.length,N={id:nd.id||('n'+ix),par,pos:nd.pos||[0,0,0],rot:nd.rot||[0,0,0],M:new Float32Array(12),L:new Float32Array(12)};nodes.push(N);
    for(const pd of nd.parts||[]){const P=hgtmBuildPart(pd,ix);parts.push(P)}
    for(const k of nd.kids||[])walk(k,ix)};
  walk(model.root,-1);
  const ix={};nodes.forEach((n,i)=>ix[n.id]=i);
  let tv=0,tt=0;for(const P of parts){P.def=P.def||{};tv+=P.nv;tt+=P.nt}
  const M={name,nodes,parts,nix:ix,anim:model.anim||null,rad:model.rad||2,foot:model.foot||1,cycle:model.cycle||1,tv,tt,kind:'mesh',speed:model.speed||1};
  if(tt>3000)console.warn('hgtm model '+name+' has '+tt+' triangles (cap about 3000)');
  if(tv>HGTM_MAXV)console.warn('hgtm model '+name+' has too many vertices');
  HGTM.models[name]=M;return M;
}
const HGTM_MAXV=12000;
const gSX=new Float32Array(HGTM_MAXV),gSY=new Float32Array(HGTM_MAXV),gIZ=new Float32Array(HGTM_MAXV),gUZ=new Float32Array(HGTM_MAXV),gVZ=new Float32Array(HGTM_MAXV),
  gKR=new Float32Array(HGTM_MAXV),gKG=new Float32Array(HGTM_MAXV),gKB=new Float32Array(HGTM_MAXV),gXC=new Float32Array(HGTM_MAXV),gYC=new Float32Array(HGTM_MAXV),gZC=new Float32Array(HGTM_MAXV),
  gU=new Float32Array(HGTM_MAXV),gV=new Float32Array(HGTM_MAXV);
const gZB=new Float32Array(VW*VH),TV=new Float64Array(24),gG=new Float64Array(12);

/* ---------- paths ---------- */
function hgtmPath(pts,closed){
  const n=pts.length;if(n<2)return{len:0,at:(s,o)=>{o[0]=pts[0][0];o[1]=pts[0][1];o[2]=pts[0][2]||0;return o}};
  const P=pts.map(p=>[p[0],p[1],p[2]||0]),segs=closed?n:n-1,SM=14,tab=[];let len=0,prev=null;
  const cr=(a,b,c,d,t)=>.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
  const pt=(i,t,o)=>{const g=k=>closed?P[((k%n)+n)%n]:P[Math.max(0,Math.min(n-1,k))],a=g(i-1),b=g(i),c=g(i+1),d=g(i+2);for(let k=0;k<3;k++)o[k]=cr(a[k],b[k],c[k],d[k],t);return o};
  const tmp=[0,0,0];
  for(let i=0;i<segs;i++)for(let j=0;j<=SM;j++){if(i>0&&j===0)continue;pt(i,j/SM,tmp);if(prev)len+=Math.hypot(tmp[0]-prev[0],tmp[1]-prev[1],tmp[2]-prev[2]);prev=[tmp[0],tmp[1],tmp[2]];tab.push([len,i,j/SM])}
  return{len,closed,at:(s,o)=>{if(closed)s=((s%len)+len)%len;else{const m=s%(2*len);s=m<0?m+2*len:m;if(s>len)s=2*len-s}
    let lo=0,hi=tab.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(tab[m][0]<=s)lo=m;else hi=m}
    const A=tab[lo],B=tab[hi],f=B[0]>A[0]?(s-A[0])/(B[0]-A[0]):0;let seg=A[1],t=A[2];if(B[1]===A[1])t=A[2]+(B[2]-A[2])*f;else t=A[2]+(1+B[2]-A[2])*f;
    if(t>1&&B[1]!==A[1]){pt(B[1],t-1,o)}else pt(A[1],t,o);return o}}}

/* ---------- spawning ---------- */
function hgtmSpawn(name,o){o=o||{};const lv=o.level!==undefined?o.level:LEVEL;(HGTM.spawns[lv]=HGTM.spawns[lv]||[]).push({name,o});
  if(lv===LEVEL&&HGTM.lvl===LEVEL){const I=hgtmMake(name,o);if(I)HGTM.inst.push(I);return I}return null}
function hgtmClear(lv){HGTM.spawns[lv]=[];if(lv===HGTM.lvl)HGTM.inst.length=0}
function hgtmMake(name,o){
  const M=HGTM.models[name]||HGTM.planets[name];if(!M&&name!=='cloud')return null;
  const I={name,M,o,kind:name==='cloud'?'cloud':M.kind,sc:o.scale||1,x:o.x||0,y:o.y||0,z:o.h,yaw:o.yaw||0,s:0,seed:o.seed||1,speed:o.speed===undefined?(M&&M.speed||.5):o.speed,walk:0,phase:0,t0:(o.seed||1)*1.37,sp:0,path:null,loop:o.loop!==false,first:true,slot:-1};
  if(o.route&&o.route.length>1){I.path=hgtmPath(o.route,I.loop);I.s=(o.s0!==undefined?o.s0:hgtmRnd(I.seed)()*I.path.len)}
  else if(o.route&&o.route.length===1){I.x=o.route[0][0];I.y=o.route[0][1];I.pz=o.route[0][2]}
  if(I.kind==='cloud'){const R=hgtmRnd(I.seed*7+3),n=o.puffs||9,r=o.r||2.2;I.pf=[];
    for(let i=0;i<n;i++){const a=R()*6.283,rr=r*(.15+.85*Math.sqrt(R())),pr=r*(.45+.4*R());I.pf.push({dx:Math.cos(a)*rr*1.1,dy:Math.sin(a)*rr*1.1,dz:(R()-.5)*r*.45,r:pr,ph:R()*6.28,v:(R()*4)|0})}
    I.r=r;I.cz=o.z===undefined?1:o.z}
  return I;
}
function hgtmPlanet(name,tex,radius,opts){opts=opts||{};const M={name,kind:'planet',tex,R:radius,opts,rad:radius*(opts.ring?(opts.ring.out||2.2):opts.moon?(opts.moon.orbit||2):1)+.2,speed:opts.speed||.4};HGTM.planets[name]=M;return M}
function hgtmCloud(o){o=o||{};const lv=o.level!==undefined?o.level:LEVEL;(HGTM.spawns[lv]=HGTM.spawns[lv]||[]).push({name:'cloud',o});
  if(lv===LEVEL&&HGTM.lvl===LEVEL){const I=hgtmMake('cloud',o);if(I)HGTM.inst.push(I);return I}return null}
function hgtmCloudField(level,n,a){a=a||{};const R=hgtmRnd(a.seed||11);for(let i=0;i<n;i++){const x=a.x0+R()*(a.x1-a.x0),y=a.y0+R()*(a.y1-a.y0),z=(a.z0===undefined?.5:a.z0)+R()*((a.z1===undefined?4:a.z1)-(a.z0===undefined?.5:a.z0)),pts=[];
  for(let k=0;k<4;k++){const ang=R()*6.283,dd=8+R()*22;pts.push([x+Math.cos(ang)*dd,y+Math.sin(ang)*dd,z+(R()-.5)*1.5])}
  hgtmCloud({level,x,y,z,r:1.6+R()*1.8,puffs:7+((R()*5)|0),seed:1+((R()*9000)|0),route:pts,speed:.25+R()*.35,alpha:a.alpha||.6,s0:R()*60})}}

/* ---------- update ---------- */
function hgtmSync(){
  if(HGTM.lvl===LEVEL)return;hgtmTestSetup();HGTM.lvl=LEVEL;HGTM.inst.length=0;
  for(const s of HGTM.spawns[LEVEL]||[]){const I=hgtmMake(s.name,s.o);if(I)HGTM.inst.push(I)}
}
function hgtmUpdate(dt){
  const px=G.C.x+.5,py=G.C.y+.5,tmp=[0,0,0],tm=[0,0,0];
  for(const I of HGTM.inst){
    const sp=I.speed*(I.o.speedMul||1);let adv=sp*dt;
    if(I.path&&I.path.len>0){
      I.path.at(I.s+adv+(I.kind==='mesh'?.1:0),tm);
      if(I.kind==='mesh'){const fr=(I.o.foot||I.M.foot*I.sc),dd=Math.hypot(tm[0]-px,tm[1]-py);if(dd<fr&&dd<Math.hypot(I.x-px,I.y-py)+.001)adv=0} // never step onto the party
      I.s+=adv;I.sp+=((adv/Math.max(dt,1e-4))-I.sp)*Math.min(1,dt*4);
      I.path.at(I.s,tmp);const nx=tmp[0],ny=tmp[1];
      if(I.kind==='mesh'){const ddx=nx-I.x,ddy=ny-I.y;
        if(!I.first&&ddx*ddx+ddy*ddy>1e-8){let ty=Math.atan2(-ddx,ddy),df=ty-I.yaw;df=Math.atan2(Math.sin(df),Math.cos(df));I.yaw+=df*Math.min(1,dt*2.5)}
        else if(I.first){I.path.at(I.s+.2,tm);I.yaw=Math.atan2(-(tm[0]-nx),tm[1]-ny)+(I.o.yaw||0)}}
      I.x=nx;I.y=ny;if(I.kind!=='mesh'||I.o.fly)I.pz=tmp[2];
    }else I.sp=0;
    if(I.kind==='mesh'){
      const T=TERR_NOW;let tz=I.o.h!==undefined?I.o.h:(T?terrH(I.x,I.y):0);if(I.o.fly)tz=I.pz||0;
      if(I.z===undefined||I.first)I.z=tz;else I.z+=(tz-I.z)*(1-Math.exp(-dt*3));
      I.walk+=((I.sp/Math.max(.01,sp)>.05?1:0)-I.walk)*Math.min(1,dt*3);
      I.phase+=(I.sp/I.sc)*dt/I.M.cycle;
    }
    I.first=false;
  }
}

/* ---------- per frame ---------- */
const HGTM_LF=(()=>{const a=[.45,-.5,.74],l=Math.hypot(...a);return a.map(v=>v/l)})();
function hgtmSlot(i){let s=HGTM.slots[i];if(!s){const cv=document.createElement('canvas');cv.width=VW;cv.height=VH;const cx=cv.getContext('2d');s=HGTM.slots[i]={cv,cx,img:new ImageData(VW,VH),ob:null};}return s}
/* true when every column the model's bounding sphere can cover has a wall hit (this frame, see hgtmRec) that is nearer than the whole sphere and whose top is at or above the sphere's highest row */
function hgtmHidden(zc,xc,rad,topZ,cz){
  const zn=zc-rad;if(zn<.6)return false;
  const z2=zc+rad,hw=VW/2,l0=xc-rad,l1=xc+rad,vmin=l0<0?l0/zn:l0/z2,vmax=l1>0?l1/zn:l1/z2,yv=topZ-cz,rowTop=HH-F*(yv>0?yv/zn:yv/z2)-1;
  const xa=Math.max(0,Math.floor(hw+F*vmin)-1),xb=Math.min(VW-1,Math.ceil(hw+F*vmax)+1),tnow=G.time;
  if(xb<xa)return true;
  const kbz=Math.min(YBK-1,Math.max(0,((zn-.55)*YBS)|0));
  for(let x=xa;x<=xb;x++){
    if(YB[x*YBK+kbz]<=rowTop)continue;   // the ground nearer than the whole sphere already covers every row it can reach
    if(HGTM_WS[x]!==tnow)return false;
    const n=HGTM_WN[x],b=x*HGTM_N;let ok=false;
    for(let k=0;k<n;k++)if(HGTM_WP[b+k]<zn&&HGTM_WT[b+k]<=rowTop){ok=true;break}
    if(!ok)return false;
  }
  return true;
}
function hgtmBegin(cx,cy,dX,dY,pX,pY){
  const out=HGTM.out;out.length=0;HGTM.fog=0;HGTM.tris=0;HGTM.vis=0;
  if(!TERR_NOW||!TERR_NOW.terr||!TC)return out;
  hgtmSync();if(!HGTM.inst.length){HGTM.ms=0;return out}
  const t0=performance.now();
  let dt=HGTM.tLast<0?0:G.time-HGTM.tLast;HGTM.tLast=G.time;if(dt<0||dt>.25)dt=Math.min(.05,Math.abs(dt));if(dt>0)hgtmUpdate(dt);else if(HGTM.inst.some(i=>i.first))hgtmUpdate(.0001);
  const cam={cx,cy,dX,dY,cz:CAMZ,iw:1/F};HGTM.cam=cam;
  const cand=[];
  for(const I of HGTM.inst){
    const px=I.x,py=I.y,rx=px-cx,ry=py-cy;let pz;
    if(I.kind==='mesh')pz=I.z+(I.M.rad*I.sc)*.5;else pz=I.pz!==undefined?I.pz:(I.kind==='cloud'?I.cz:1);
    const zc=dX*rx+dY*ry,xc=dX*ry-dY*rx,rad=I.kind==='mesh'?I.M.rad*I.sc:I.kind==='planet'?I.M.rad:I.r*1.7;
    if(zc+rad<.1||zc>(I.o.far||(I.kind==='cloud'?36:80)))continue;
    const lim=(zc+rad)*VW/2/F*1.05+rad;if(Math.abs(xc)-rad>lim)continue;
    if(I.kind==='mesh'&&!PERF_MESH4&&!I.o.cheap&&!I.o.fly&&hgtmHidden(zc,xc,rad,I.z+rad,CAMZ)){I._why='hidden';continue}   // the whole model stands behind a nearer wall: it is not worked out at all
    const dd=Math.hypot(rx,ry);I.zc=zc;I.xc=xc;I.cand=zc;I.ccz=pz;
    cand.push(I);
  }
  cand.sort((a,b)=>a.zc-b.zc);
  let slotN=0;const SM=12;
  for(const I of cand){
    if(performance.now()-t0>HGTM.budget&&I.kind!=='cloud'&&!I.o.cheap&&!(I._vis&&G.time-(I._drawT||0)<.6)){I._why='budget';continue}
    if(I.kind==='mesh'){if(slotN>=SM){I._why='slots';continue}const e=hgtmRenderMesh(I,cam,slotN);if(e){I._drawT=G.time;if(!e.cv)slotN++;out.push(e);HGTM.vis++}}
    else if(I.kind==='planet'){if(slotN>=SM)continue;const e=hgtmRenderPlanet(I,cam,slotN);if(e){slotN++;out.push(e);HGTM.vis++}}
    else hgtmCloudEntries(I,cam,out);
  }
  out.sort((a,b)=>b.tY-a.tY);
  HGTM.ms=performance.now()-t0;
  return out;
}
function hgtmDraw(e){
  if(e.k===0){SC.globalAlpha=1;if(e.cv)SC.drawImage(e.cv,0,0,e.w,e.h,e.x0,e.y0,e.w,e.h);else{const s=HGTM.slots[e.slot];SC.drawImage(s.cv,e.x0,e.y0,e.w,e.h,e.x0,e.y0,e.w,e.h)}}
  else hgtmDrawPuff(e);
}
function hgtmEnd(){
  if(HGTM.fog>.01){const f=Math.min(.82,HGTM.fog),c=HGTM.fogCol;SC.save();SC.globalAlpha=f;SC.fillStyle='rgb('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+')';SC.fillRect(0,0,VW,VH);SC.restore()}
}

/* ---------- lighting ---------- */
const hgtmL={n:0,x:new Float32Array(8),y:new Float32Array(8),z:new Float32Array(8),q:new Float32Array(8),r:new Float32Array(8),g:new Float32Array(8),b:new Float32Array(8)};
function hgtmPrepLights(mx,my,rad){ // with a model position and radius, lights too far to add anything (below about 1/500 of full light) are left out
  const C=TC,nl=C.nl,nn=C.nn,L=hgtmL;L.n=0;
  for(let k=0,j=0;k<nn&&L.n<8;k+=3,j++){if(mx!==undefined){const dx=nl[k]-mx,dy=nl[k+1]-my,dh=Math.max(0,Math.sqrt(dx*dx+dy*dy)-rad);if(nl[k+2]*1.9/(1+1.15*(dh*dh*.5+.44))<.002)continue}L.x[L.n]=nl[k];L.y[L.n]=nl[k+1];L.z[L.n]=terrH(nl[k],nl[k+1])+.8;L.q[L.n]=nl[k+2];L.r[L.n]=C.ncr[j];L.g[L.n]=C.ncg[j];L.b[L.n]=C.ncb[j];L.n++}
}
function hgtmLightAt(x,y,z,nx,ny,nz,o){ // o=[r,g,b] multipliers
  const C=TC,lb=C.lbm,L=hgtmL;
  const df=Math.max(0,nx*HGTM_LF[0]+ny*HGTM_LF[1]+nz*HGTM_LF[2]),base=lb*(.8+.6*df+.15*nz)*1.1;
  let r=base*C.tbR,g=base*C.tbG,b=base*C.tbB;
  for(let i=0;i<L.n;i++){const dx=L.x[i]-x,dy=L.y[i]-y,dz=L.z[i]-z,d2=dx*dx+dy*dy+dz*dz,q=L.q[i]/(1+1.15*(d2*.8+.44)),il=1/Math.sqrt(d2+1e-6),ln=(dx*nx+dy*ny+dz*nz)*il,w=q*(.35+.65*Math.max(0,ln*.7+.3));r+=w*L.r[i];g+=w*L.g[i];b+=w*L.b[i]}
  o[0]=r;o[1]=g;o[2]=b;
}

/* ---------- mesh rendering ---------- */
const hgtmTmpK=[0,0,0],hgtmRoot=new Float32Array(12),hgtmEu=new Float32Array(9);
/* the vertices of one part: world position, view position, light, screen position. Its own function so the engine optimises it on its own. Writes the g* arrays from index vo; HVB gets the screen bounds (minx,maxx,miny,maxy) and whether any vertex is behind the camera. */
function hgtmPartBound(P){ // centre and radius of a fixed part in its node's own space, or null
  const lp=P.lpos,n=P.nv;if(!lp||!n)return null;
  let x0=1e9,y0=1e9,z0=1e9,x1=-1e9,y1=-1e9,z1=-1e9;
  for(let v=0;v<n;v++){const x=lp[v*3],y=lp[v*3+1],z=lp[v*3+2];if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;if(z<z0)z0=z;if(z>z1)z1=z}
  const cx=(x0+x1)/2,cy=(y0+y1)/2,cz=(z0+z1)/2;let r2=0;
  for(let v=0;v<n;v++){const dx=lp[v*3]-cx,dy=lp[v*3+1]-cy,dz=lp[v*3+2]-cz,d=dx*dx+dy*dy+dz*dz;if(d>r2)r2=d}
  return [cx,cy,cz,Math.sqrt(r2)];
}
const HVB=new Float64Array(8),HRW=new Int16Array(VW+4);const PXB=new Int32Array(8);/* PERF_MESH6: true = the one-frame-in-three picture of tiny models is OFF (it showed as a visible change between frames) */
var PERF_SPR=false,PERF_MESH=false,PERF_MESH2=false,PERF_MESH3=false,PERF_MESH4=false,PERF_MESH5=false,PERF_MESH6=true,PERF_MESH7=false,PERF_MESH8=false,PERF_MESH9=false;   // true: no hidden-column shortcut in the model pass (for comparing)
function hgtmPartVerts(P,Mx,vo,isc,cx,cy,cz,dX,dY){
  const lp=P.lpos,ln=P.lnor,uvA=P.uv,col=P.col,cr=col[0]/255,cg=col[1]/255,cb=col[2]/255,gl=P.glow,vc=P.vcol,dbl=P.dbl,K=hgtmTmpK,NEAR=.12,F_=F,HH_=HH,hw=VW/2,nv=P.nv;
  let minx=HVB[0],maxx=HVB[1],miny=HVB[2],maxy=HVB[3],behind=HVB[4]!==0,zmin=HVB[5];
  // with no warm light near the model the light is the cave light alone and depends only on the normal: worked out here, not through hgtmLightAt (the formula is the same as there, plus the giants' lift)
  const flat=hgtmL.n===0&&!PERF_MESH8,Cc=TC,lbF=Cc.lbm,tRF=Cc.tbR,tGF=Cc.tbG,tBF=Cc.tbB,L0=HGTM_LF[0],L1=HGTM_LF[1],L2=HGTM_LF[2];let offF=0;
  if(flat&&typeof HGTG!=='undefined'){const Ig=HGTG.cur;if(Ig&&Ig.o&&Ig.o.hgk)offF=.1+.16*(typeof hgtlmNight==='function'?hgtlmNight():0)}
  const m0=Mx[0],m1=Mx[1],m2=Mx[2],m3=Mx[3],m4=Mx[4],m5=Mx[5],m6=Mx[6],m7=Mx[7],m8=Mx[8],m9=Mx[9],m10=Mx[10],m11=Mx[11];
  for(let v=0,v3=0,v2=0;v<nv;v++,v3+=3,v2+=2){
    const lx=lp[v3],ly=lp[v3+1],lz=lp[v3+2],nx0=ln[v3],ny0=ln[v3+1],nz0=ln[v3+2];
    const wx=m0*lx+m1*ly+m2*lz+m9,wy=m3*lx+m4*ly+m5*lz+m10,wz=m6*lx+m7*ly+m8*lz+m11;
    let nx=(m0*nx0+m1*ny0+m2*nz0)*isc,ny=(m3*nx0+m4*ny0+m5*nz0)*isc,nz=(m6*nx0+m7*ny0+m8*nz0)*isc;
    const rx=wx-cx,ry=wy-cy,zc=dX*rx+dY*ry,xc=dX*ry-dY*rx,yc=wz-cz;
    if(dbl&&nx*(cx-wx)+ny*(cy-wy)+nz*(cz-wz)<0){nx=-nx;ny=-ny;nz=-nz}
    let kr,kg,kb;
    if(flat){const df=Math.max(0,nx*L0+ny*L1+nz*L2),base=lbF*(.8+.6*df+.15*nz)*1.1+offF;kr=base*tRF*cr;kg=base*tGF*cg;kb=base*tBF*cb}
    else{hgtmLightAt(wx,wy,wz,nx,ny,nz,K);kr=K[0]*cr;kg=K[1]*cg;kb=K[2]*cb}
if(vc){kr*=vc[v3];kg*=vc[v3+1];kb*=vc[v3+2]}
    if(gl){kr+=gl;kg+=gl;kb+=gl}
    if(zc<zmin)zmin=zc;
    const o=vo+v;gXC[o]=xc;gYC[o]=yc;gZC[o]=zc;gKR[o]=kr;gKG[o]=kg;gKB[o]=kb;const uu=uvA[v2],vv=uvA[v2+1];gU[o]=uu;gV[o]=vv;
    if(zc<NEAR){behind=true}else{const iz=1/zc,sx=hw+F_*xc*iz,sy=HH_-F_*yc*iz;gSX[o]=sx;gSY[o]=sy;gIZ[o]=iz;gUZ[o]=uu*iz;gVZ[o]=vv*iz;
      if(sx<minx)minx=sx;if(sx>maxx)maxx=sx;if(sy<miny)miny=sy;if(sy>maxy)maxy=sy}
  }
  HVB[0]=minx;HVB[1]=maxx;HVB[2]=miny;HVB[3]=maxy;HVB[4]=behind?1:0;HVB[5]=zmin;
}
/* a model that covers only a few pixels (a far peacock is 4 by 8) is worked out one frame in three; in between its last picture is drawn again, moved by the move of its centre on the screen */
function hgtmCachedMesh(I,cam){
  const zc=I.zc;if(!(zc>1))return null;
  const sx=VW/2+F*I.xc/zc,sy=HH-F*((I.ccz!==undefined?I.ccz:1)-cam.cz)/zc,dx=Math.round(sx-I._lsx),dy=Math.round(sy-I._lsy);
  if(Math.abs(dx)>4||Math.abs(dy)>4||G.time-I._lcT>.1||zc>I._lzc*1.12||zc<I._lzc*.89){I._lcN=0;return null}
  I._lcN--;return{k:0,cv:I._lc,tY:Math.max(.2,zc),x0:I._lx0+dx,y0:I._ly0+dy,w:I._lw,h:I._lh};
}
/* level of detail: a model that is small on the screen draws its ellipsoid parts with fewer segments (the limbs and fans are generated each frame and keep theirs). The level only changes with a margin, so it does not flicker between two. */
const HGTM_LOD=[[1,1],[.6,.6],[.4,.4]],HGTM_LODPX=[1e9,40,15];
function hgtmLodPart(P,lv){
  const key='_lod'+lv;let L=P[key];if(L!==undefined)return L;
  const d=P.def,sg=d&&d.seg;if(P.kind!=='ell'||P.gen||!sg){return P[key]=null}
  const k=HGTM_LOD[lv],seg=[Math.max(5,Math.round(sg[0]*k[0])),Math.max(3,Math.round(sg[1]*k[1]))];
  if(seg[0]>=sg[0]&&seg[1]>=sg[1])return P[key]=null;
  const Q=hgtmBuildPart(Object.assign({},d,{seg}),P.node);
  return P[key]={nv:Q.nv,lpos:Q.lpos,lnor:Q.lnor,uv:Q.uv,tr:Q.tr,nt:Q.nt};
}
function hgtmRenderMesh(I,cam,slotIx){
  // a model that came out empty (hidden) is not tried again for the next two frames while the eye has hardly moved
  if(I._nz>0&&!PERF_MESH9){const mx=cam.cx-I._nx,my=cam.cy-I._ny,da=cam.dX*I._nd1+cam.dY*I._nd2;
    if(mx*mx+my*my<.012&&da>.9995&&G.time-I._nt<.08&&Math.abs(cam.cz-I._nz2)<.05){I._nz--;return null}I._nz=0}
  const e=hgtmRenderMesh1(I,cam,slotIx);
  if(!e&&!PERF_MESH9){I._nz=2;I._nx=cam.cx;I._ny=cam.cy;I._nd1=cam.dX;I._nd2=cam.dY;I._nt=G.time;I._nz2=cam.cz}
  return e;
}
function hgtmRenderMesh1(I,cam,slotIx){
  if(PERF_MESH7||!(I.zc>0))return hgtmRenderMesh0(I,cam,slotIx);
  const px=F*I.M.rad*I.sc/I.zc;let lv=I._lodv===undefined?0:I._lodv;
  while(lv<2&&px<HGTM_LODPX[lv+1]*.9)lv++;
  while(lv>0&&px>HGTM_LODPX[lv]*1.15)lv--;
  I._lodv=lv;
  if(lv===0)return hgtmRenderMesh0(I,cam,slotIx);
  const parts=I.M.parts,sw=[];
  for(const P of parts){const L=hgtmLodPart(P,lv);if(L){sw.push(P,P.nv,P.lpos,P.lnor,P.uv,P.tr);P.nv=L.nv;P.lpos=L.lpos;P.lnor=L.lnor;P.uv=L.uv;P.tr=L.tr}}
  try{return hgtmRenderMesh0(I,cam,slotIx)}
  finally{for(let i=0;i<sw.length;i+=6){const P=sw[i];P.nv=sw[i+1];P.lpos=sw[i+2];P.lnor=sw[i+3];P.uv=sw[i+4];P.tr=sw[i+5]}}
}
function hgtmRenderMesh0(I,cam,slotIx){
  if(I._lcN>0&&!PERF_MESH6){const e=hgtmCachedMesh(I,cam);if(e)return e}
  const M=I.M,dX=cam.dX,dY=cam.dY,cx=cam.cx,cy=cam.cy,cz=cam.cz,nodes=M.nodes,sc=I.sc,isc=1/sc,t=G.time+I.t0;
  const st={t,phase:I.phase,walk:I.walk,sp:I.sp,seed:I.seed,sc,yaw:I.yaw};
  const pose=M.anim?M.anim(t,st):null;
  // node matrices
  const cy_=Math.cos(I.yaw),sy_=Math.sin(I.yaw),R=hgtmRoot;R[0]=cy_*sc;R[1]=-sy_*sc;R[2]=0;R[3]=sy_*sc;R[4]=cy_*sc;R[5]=0;R[6]=0;R[7]=0;R[8]=sc;R[9]=I.x;R[10]=I.y;R[11]=I.z;
  for(let i=0;i<nodes.length;i++){const N=nodes[i],pn=pose&&pose.n&&pose.n[N.id],L=N.L;
    const rx=N.rot[0]+(pn&&pn.r?pn.r[0]:0),ry=N.rot[1]+(pn&&pn.r?pn.r[1]:0),rz=N.rot[2]+(pn&&pn.r?pn.r[2]:0);
    hgtmEuler(rx,ry,rz,hgtmEu);for(let k=0;k<9;k++)L[k]=hgtmEu[k];L[9]=N.pos[0]+(pn&&pn.p?pn.p[0]:0);L[10]=N.pos[1]+(pn&&pn.p?pn.p[1]:0);L[11]=N.pos[2]+(pn&&pn.p?pn.p[2]:0);
    hgtmMul(N.par<0?R:nodes[N.par].M,L,N.M)}
  hgtmPrepLights(I.x,I.y,M.rad*sc);
  const C=TC,hzr=C.hzr,hzmax=C.hzmax,hzrate=C.hzrate,lbm=C.lbm,K=hgtmTmpK;
  let vo=0;HVB[0]=1e9;HVB[1]=-1e9;HVB[2]=1e9;HVB[3]=-1e9;HVB[4]=0;HVB[5]=1e9;
  const NEAR=.12,F_=F,HH_=HH,hw=VW/2;
  for(const P of M.parts){
    const Mx=nodes[P.node].M;
    if(P.gen)P.gen(P,pose,I,Mx);
    P.vo=vo;P.hid=false;
    if(!P.gen&&!PERF_MESH5){ // a fixed part whose bounding sphere is hidden by the ground or a nearer wall is not worked out at all
      let cb=P.cb;if(cb===undefined)cb=P.cb=hgtmPartBound(P);
      if(cb){const wx=Mx[0]*cb[0]+Mx[1]*cb[1]+Mx[2]*cb[2]+Mx[9],wy=Mx[3]*cb[0]+Mx[4]*cb[1]+Mx[5]*cb[2]+Mx[10],wz=Mx[6]*cb[0]+Mx[7]*cb[1]+Mx[8]*cb[2]+Mx[11],rd=cb[3]*sc*1.02+.02,rx=wx-cx,ry=wy-cy;
        if(hgtmHidden(dX*rx+dY*ry,dX*ry-dY*rx,rd,wz+rd,cz)){P.hid=true;vo+=P.nv;continue}}}
    hgtmPartVerts(P,Mx,vo,isc,cx,cy,cz,dX,dY);
    vo+=P.nv;
  }
  let x0,x1,y0,y1;const minx=HVB[0],maxx=HVB[1],miny=HVB[2],maxy=HVB[3],behind=HVB[4]!==0;
  if(behind){x0=0;y0=0;x1=VW;y1=VH}
  else{x0=Math.max(0,Math.floor(minx)-1);x1=Math.min(VW,Math.ceil(maxx)+2);y0=Math.max(0,Math.floor(miny)-1);y1=Math.min(VH,Math.ceil(maxy)+2)}
  if(x1<=x0||y1<=y0)return null;
  const S=hgtmSlot(slotIx),D=S.img.data,W4=VW*4;
  // clear the area
  for(let y=y0;y<y1;y++){D.fill(0,y*W4+x0*4,y*W4+x1*4);gZB.fill(0,y*VW+x0,y*VW+x1)}
  HGTM.cur={D,x0,x1,y0,y1,hzr,hzmax,hzrate,lbm,hz:hzr,T:G.time};PXB[0]=0;PXB[1]=VW;PXB[2]=-1;PXB[3]=VH;PXB[4]=-1;
  { // for each column: the first row from which everything of this model is hidden, by the ground or by a wall hit nearer than the whole model (so the per-pixel tests in hgtmRast give the same answer for those rows)
    const zn=Math.max(NEAR,HVB[5]),kbz=Math.min(YBK-1,Math.max(0,((zn-.55)*YBS)|0)),tnow=G.time;
    for(let x=x0;x<x1;x++){let h=YB[x*YBK+kbz];
      if(HGTM_WS[x]===tnow){const n=HGTM_WN[x],b=x*HGTM_N;for(let k=0;k<n;k++)if(HGTM_WP[b+k]<zn){const r=Math.ceil(HGTM_WT[b+k]);if(r<h)h=r}}
      HRW[x]=PERF_MESH?32000:h}
  }
  // rasterise
  let nt=0;const TW=[];
  for(const P of M.parts){
    if(P.hid)continue;
    const tx=P.tex?hgtmTex(P.tex,P.texMax,P.grade):null;
    HGTM.cur.tex=tx;HGTM.cur.alphaT=P.alpha;HGTM.cur.dbl=P.dbl;HGTM.cur.soft=!!(P.def&&P.def.soft);
    const tr=P.tr,vo2=P.vo;
    for(let q=0;q<tr.length;q+=3){const a=vo2+tr[q],b=vo2+tr[q+1],c=vo2+tr[q+2];
      if(gZC[a]>=NEAR&&gZC[b]>=NEAR&&gZC[c]>=NEAR){
        // cheap reject
        const ax=gSX[a],bx=gSX[b],cxx=gSX[c];if((ax<x0&&bx<x0&&cxx<x0)||(ax>x1&&bx>x1&&cxx>x1))continue;
        const ay=gSY[a],by=gSY[b],cyy=gSY[c];if((ay<y0&&by<y0&&cyy<y0)||(ay>y1&&by>y1&&cyy>y1))continue;
        {const tyt=Math.min(ay,by,cyy)-.5,xa=Math.max(x0,Math.floor(Math.min(ax,bx,cxx))),xb=Math.min(x1-1,Math.ceil(Math.max(ax,bx,cxx)));let vis=false;for(let xx=xa;xx<=xb;xx++)if(HRW[xx]>tyt){vis=true;break}if(!vis)continue} // every column it can touch is hidden from above its top row
        let o=0;TV[o++]=ax;TV[o++]=ay;TV[o++]=gIZ[a];TV[o++]=gUZ[a];TV[o++]=gVZ[a];TV[o++]=gKR[a];TV[o++]=gKG[a];TV[o++]=gKB[a];
        TV[o++]=bx;TV[o++]=by;TV[o++]=gIZ[b];TV[o++]=gUZ[b];TV[o++]=gVZ[b];TV[o++]=gKR[b];TV[o++]=gKG[b];TV[o++]=gKB[b];
        TV[o++]=cxx;TV[o++]=cyy;TV[o++]=gIZ[c];TV[o++]=gUZ[c];TV[o++]=gVZ[c];TV[o++]=gKR[c];TV[o++]=gKG[c];TV[o++]=gKB[c];
        hgtmRast();nt++;
      }else if(gZC[a]>=NEAR||gZC[b]>=NEAR||gZC[c]>=NEAR){hgtmClipTri(a,b,c);nt+=1}
    }
  }
  HGTM.tris+=nt;
  // upload
  const cxv=S.cx;if(S.ob){cxv.clearRect(S.ob[0],S.ob[1],S.ob[2],S.ob[3]);S.ob=null}
  if(PXB[0]===0&&!PERF_MESH2)return null;   // nothing of the model shows (it is hidden): nothing to upload or draw
  if(!PERF_MESH3){x0=PXB[1];x1=PXB[2]+1;y0=PXB[3];y1=PXB[4]+1}   // only the rows and columns that were painted
  cxv.putImageData(S.img,0,0,x0,y0,x1-x0,y1-y0);S.ob=[x0,y0,x1-x0,y1-y0];
  if(!PERF_MESH6&&(x1-x0)*(y1-y0)<=400&&I.zc>1&&F*M.rad*sc/I.zc<24){ // a tiny one: keep its picture for the next two frames
    const w=x1-x0,h=y1-y0;let c=I._lc;if(!c){c=I._lc=document.createElement('canvas');c._x=c.getContext('2d')}if(c.width!==w||c.height!==h){c.width=w;c.height=h}else c._x.clearRect(0,0,w,h);
    c._x.drawImage(S.cv,x0,y0,w,h,0,0,w,h);I._lw=w;I._lh=h;I._lx0=x0;I._ly0=y0;I._lsx=VW/2+F*I.xc/I.zc;I._lsy=HH-F*((I.ccz!==undefined?I.ccz:1)-cam.cz)/I.zc;I._lcT=G.time;I._lzc=I.zc;I._lcN=2}
  return{k:0,tY:Math.max(.2,I.zc),slot:slotIx,x0,y0,w:x1-x0,h:y1-y0};
}
function hgtmClipTri(a,b,c){ // near plane clip of one triangle, rasterise the pieces
  const NEAR=.12,id=[a,b,c],V=[];
  for(const i of id)V.push([gXC[i],gYC[i],gZC[i],gU[i],gV[i],gKR[i],gKG[i],gKB[i]]);
  const poly=[];for(let i=0;i<3;i++){const p=V[i],q=V[(i+1)%3],pin=p[2]>=NEAR,qin=q[2]>=NEAR;
    if(pin)poly.push(p);
    if(pin!==qin){const f=(NEAR-p[2])/(q[2]-p[2]),r=[];for(let k=0;k<8;k++)r.push(p[k]+(q[k]-p[k])*f);r[2]=NEAR;poly.push(r)}}
  if(poly.length<3)return;
  const hw=VW/2;const pr=poly.map(p=>{const iz=1/p[2];return[hw+F*p[0]*iz,HH-F*p[1]*iz,iz,p[3]*iz,p[4]*iz,p[5],p[6],p[7]]});
  for(let i=1;i<pr.length-1;i++){let o=0;for(const v of [pr[0],pr[i],pr[i+1]])for(let k=0;k<8;k++)TV[o++]=v[k];hgtmRast()}
}
/* the rasteriser: TV holds three vertices (x,y,1/z,u/z,v/z,r,g,b). Writes to HGTM.cur */
function hgtmRast(){
  const Cu=HGTM.cur,D=Cu.D,bx0=Cu.x0,bx1=Cu.x1,by0=Cu.y0,by1=Cu.y1,tex=Cu.tex,alphaT=Cu.alphaT,dbl=Cu.dbl,soft=Cu.soft;
  const x0=TV[0],y0=TV[1],x1=TV[8],y1=TV[9],x2=TV[16],y2=TV[17];
  const area=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0);if(area===0||(!dbl&&area<0))return;
  const ia=1/area,ymin=Math.max(by0,Math.ceil(Math.min(y0,y1,y2)-.5)),ymax=Math.min(by1-1,Math.ceil(Math.max(y0,y1,y2)-.5)-1);if(ymax<ymin)return;
  // plane gradients
  const g=gG;for(let a=0;a<6;a++){const A0=TV[2+a],A1=TV[10+a],A2=TV[18+a];g[a*2]=((A1-A0)*(y2-y0)-(A2-A0)*(y1-y0))*ia;g[a*2+1]=((A2-A0)*(x1-x0)-(A1-A0)*(x2-x0))*ia}
  const hzr=Cu.hzr,hzmax=Cu.hzmax,hzrate=Cu.hzrate,lbm=Cu.lbm,H0=hzr[0],H1=hzr[1],H2=hzr[2],T=Cu.T;
  const td=tex?tex.d:null,tw=tex?tex.w:1,th=tex?tex.h:1,wm=tex?tex.wm:0,hm=tex?tex.hm:0;
  const wn=HGTM_WN,ws=HGTM_WS,wp=HGTM_WP,wt=HGTM_WT,tnow=G.time;
  for(let y=ymin;y<=ymax;y++){
    const yc=y+.5;let xl=1e9,xr=-1e9;
    for(let e=0;e<3;e++){const pa=e*8,pb=((e+1)%3)*8,ay=TV[pa+1],by=TV[pb+1],ax=TV[pa],bx=TV[pb];
      if((yc>=ay&&yc<by)||(yc>=by&&yc<ay)){const x=ax+(yc-ay)*(bx-ax)/(by-ay);if(x<xl)xl=x;if(x>xr)xr=x}}
    let xs=Math.max(bx0,Math.ceil(xl-.5)),xe=Math.min(bx1-1,Math.ceil(xr-.5)-1);if(xe<xs)continue;
    const dx0=xs+.5-x0,dy0=yc-y0;
    let iz=TV[2]+g[0]*dx0+g[1]*dy0,uz=TV[3]+g[2]*dx0+g[3]*dy0,vz=TV[4]+g[4]*dx0+g[5]*dy0,kr=TV[5]+g[6]*dx0+g[7]*dy0,kg=TV[6]+g[8]*dx0+g[9]*dy0,kb=TV[7]+g[10]*dx0+g[11]*dy0;
    const gi=g[0],gu=g[2],gv=g[4],gr=g[6],gg=g[8],gb=g[10];
    for(let x=xs;x<=xe;x++,iz+=gi,uz+=gu,vz+=gv,kr+=gr,kg+=gg,kb+=gb){
      if(y>=HRW[x])continue;
      const zo=y*VW+x;if(iz<=gZB[zo]||iz<=0)continue;
      const z=1/iz;
      // depth test against the ground and the walls
      let kb2=((z-.55)*YBS)|0;if(kb2<0)kb2=0;else if(kb2>=YBK)kb2=YBK-1;
      if(y>=YB[x*YBK+kb2])continue;
      if(ws[x]===tnow){const n=wn[x];let hid=false;for(let k=0,b=x*HGTM_N;k<n;k++)if(wp[b+k]<z&&y>=wt[b+k]){hid=true;break}if(hid)continue}
      if(soft&&td){const u=uz*z,v=vz*z,ti=(((v*th)|0)&hm)*tw+(((u*tw)|0)&wm),k=1-td[ti*4+3]*.00275,o2=zo*4;if(k<.99){D[o2]*=k;D[o2+1]*=k;D[o2+2]*=k}continue} // a soft ground shadow darkens what is under it (no cut-out dither, which aliased into a checker at a distance)
      let r=255,gc=255,b=255;
      if(td){const u=uz*z,v=vz*z,ti=(((v*th)|0)&hm)*tw+(((u*tw)|0)&wm),i4=ti*4;if(alphaT&&td[i4+3]<110)continue;r=td[i4];gc=td[i4+1];b=td[i4+2]}
      gZB[zo]=iz;
      const sm=Math.min(hzmax,z*HGTM_SEC[x]*hzrate),iv=1-sm,kav=(kr+kg+kb)*.3333,sk=(.55*lbm+.45*Math.max(0,kav-lbm)+.05)*sm,o=zo*4;
      D[o]=r*kr*iv+H0*sk;D[o+1]=gc*kg*iv+H1*sk;D[o+2]=b*kb*iv+H2*sk;D[o+3]=255;PXB[0]++;if(x<PXB[1])PXB[1]=x;if(x>PXB[2])PXB[2]=x;if(y<PXB[3])PXB[3]=y;if(y>PXB[4])PXB[4]=y;
    }
  }
}

/* ---------- planets (analytic spheres, rings, moons) ---------- */
function hgtmRenderPlanet(I,cam,slotIx){
  const M=I.M,o=M.opts,dX=cam.dX,dY=cam.dY,cx=cam.cx,cy=cam.cy,cz=cam.cz,t=G.time+I.t0;
  const px=I.x,py=I.y,pz=I.pz!==undefined?I.pz:2;
  const rx=px-cx,ry=py-cy,Cr=dX*ry-dY*rx,Cf=dX*rx+dY*ry,Cu=pz+Math.sin(t*.4+I.seed)*.15-cz,R=M.R*(I.sc);
  if(Cf-R<.12)return null;
  // moon
  let mo=null;
  if(o.moon){const mm=o.moon,ang=t*6.283/(mm.period||40)+I.seed,or=(mm.orbit||2)*R,tl=mm.tilt===undefined?.5:mm.tilt;
    const wx=Math.cos(ang)*or,wy=Math.sin(ang)*Math.cos(tl)*or,wz=Math.sin(ang)*Math.sin(tl)*or;
    mo={r:(mm.r||.3)*R,xr:wx*-dY+wy*dX+Cr,xf:wx*dX+wy*dY+Cf,xu:wz+Cu,col:mm.col||[190,190,200],tex:mm.tex?hgtmTex(mm.tex,256,false):null}}
  const ringO=o.ring?(o.ring.out||2.1)*R:0;
  const ext=Math.max(R,ringO,mo?Math.hypot(mo.xr-Cr,mo.xf-Cf,mo.xu-Cu)+mo.r:0);
  const sx=VW/2+F*Cr/Cf,sy=HH-F*Cu/Cf,pr=(ext*1.1+.05)*F/Math.max(.2,Cf-ext*.5);
  let x0=Math.max(0,Math.floor(sx-pr)),x1=Math.min(VW,Math.ceil(sx+pr)),y0=Math.max(0,Math.floor(sy-pr)),y1=Math.min(VH,Math.ceil(sy+pr));
  if(Cf-ext<.3){x0=0;x1=VW;y0=0;y1=VH}
  if(x1<=x0||y1<=y0)return null;
  const S=hgtmSlot(slotIx),D=S.img.data,W4=VW*4;
  for(let y=y0;y<y1;y++)D.fill(0,y*W4+x0*4,y*W4+x1*4);
  const txm=M.tex?hgtmTex(M.tex,o.max||512,false):null,gtx=o.glowTex?hgtmTex(o.glowTex,o.max||512,false):null,tg=[0,0,0];
  const spin=t*(o.spin===undefined?.25:o.spin),tilt=o.tilt===undefined?.35:o.tilt,ct=Math.cos(tilt),st=Math.sin(tilt),cs=Math.cos(spin),ss=Math.sin(spin);
  // light direction (world), in camera frame
  const Lw=I.o.light||[.5,.75,.5],Ll=Math.hypot(...Lw),lx=Lw[0]/Ll,ly=Lw[1]/Ll,lz=Lw[2]/Ll;
  const Lr=lx*-dY+ly*dX,Lf=lx*dX+ly*dY,Lu=lz;
  const C=TC,hzr=C.hzr,hzmax=C.hzmax,hzrate=C.hzrate,lbm=C.lbm,glow=o.glow||0,col=o.col||[150,120,200],col2=o.col2||[230,200,160],atmo=o.atmo||null;
  // ring plane normal (world: tilted by tilt about x)
  const Nw=[0,-st,ct],Nr=[Nw[0]*-dY+Nw[1]*dX,Nw[0]*dX+Nw[1]*dY,Nw[2]];
  const ring=o.ring,ri=ring?(ring.in||1.3)*R:0,ro=ringO,rc=ring?(ring.col||[210,190,150]):null,ra=ring?(ring.alpha===undefined?.8:ring.alpha):0;
  const tnow=G.time,wn=HGTM_WN,ws=HGTM_WS,wp=HGTM_WP,wt=HGTM_WT;
  const hw=VW/2,Cs=Cr*Cr+Cf*Cf+Cu*Cu,sd=I.seed;
  const fb=(ux,uy,uz,out,TX)=>{const tx=TX||txm; // texture lookup for a unit world normal
    const x=ux*cs+uy*ss,y=-ux*ss+uy*cs; // spin about z
    const yy=y*ct+uz*st,zz=-y*st+uz*ct; // tilt
    const lon=Math.atan2(yy,x),lat=Math.asin(zz<-1?-1:zz>1?1:zz);
    if(tx){const u=(lon/6.2831853+.5),v=.5-lat/3.1415927,fx=u*tx.w-.5,fy=v*tx.h-.5,ix=Math.floor(fx),iy=Math.floor(fy),ax=fx-ix,ay=fy-iy,d=tx.d,w=tx.w,hm=tx.hm,wm=tx.wm;
      const i00=((iy&hm)*w+(ix&wm))*4,i10=((iy&hm)*w+((ix+1)&wm))*4,i01=(((iy+1)&hm)*w+(ix&wm))*4,i11=(((iy+1)&hm)*w+((ix+1)&wm))*4;
      for(let k=0;k<3;k++)out[k]=(d[i00+k]*(1-ax)+d[i10+k]*ax)*(1-ay)+(d[i01+k]*(1-ax)+d[i11+k]*ax)*ay}
    else{const band=.5+.5*Math.sin(lat*(6+sd%5)+Math.sin(lon*3+sd)*.8),m=.5+.5*Math.sin(lon*5+lat*9+sd*2);const f=Math.min(1,Math.max(0,band*.75+m*.25));for(let k=0;k<3;k++)out[k]=col[k]+(col2[k]-col[k])*f}
  };
  const tc=[0,0,0],ordT=new Float64Array(3),ordK=new Int8Array(3);
  const lightK=(nr,nf,nu)=>{const lam=nr*Lr+nf*Lf+nu*Lu;let k=lam<-.08?0:lam>.4?1:(lam+.08)/.48;k=k*k*(3-2*k);return .2+.8*k};
  const bs=(o.lowres&&(x1-x0)*(y1-y0)>5000)?2:1; // o.lowres (the moon): colour is worked out once per 2x2 block, occlusion and haze stay per pixel
  for(let y=y0;y<y1;y+=bs){
    const v=(HH-(y+bs*.5))/F;
    for(let x=x0;x<x1;x+=bs){
      const u=(x+bs*.5-hw)/F;
      let n=0;
      // sphere hits
      const a=u*u+1+v*v;
      // planet
      let tp=-1,tr_=-1,tm=-1,ed=1;
      {const b=u*Cr+Cf+v*Cu,c=Cs-R*R,dsc=b*b-a*c;if(dsc>0){const tt=(b-Math.sqrt(dsc))/a;if(tt>.1){tp=tt;ed=Math.min(1,(R-Math.sqrt(Math.max(0,Cs-b*b/a)))/(Cf/F*1.4))}}}
      if(mo){const mr=u*mo.xr+mo.xf+v*mo.xu,mc=mo.xr*mo.xr+mo.xf*mo.xf+mo.xu*mo.xu-mo.r*mo.r,dsc=mr*mr-a*mc;if(dsc>0){const tt=(mr-Math.sqrt(dsc))/a;if(tt>.1)tm=tt}}
      if(ring){const dn=u*Nr[0]+Nr[1]+v*Nr[2];if(Math.abs(dn)>1e-4){const tt=(Cr*Nr[0]+Cf*Nr[1]+Cu*Nr[2])/dn;if(tt>.1){const pr_=tt*u-Cr,pf=tt-Cf,pu=tt*v-Cu,rr=Math.sqrt(pr_*pr_+pf*pf+pu*pu);if(rr>ri&&rr<ro)tr_=tt}}}
      if(tp<0&&tm<0&&tr_<0)continue;
      // composite far to near: gather
      let R_=0,G_=0,B_=0,A_=0,zfront=1e9;
      let cnt=0;if(tp>0){ordT[cnt]=tp;ordK[cnt++]=0}if(tm>0){ordT[cnt]=tm;ordK[cnt++]=1}if(tr_>0){ordT[cnt]=tr_;ordK[cnt++]=2}
      for(let i=1;i<cnt;i++){const tT=ordT[i],kK=ordK[i];let j=i-1;while(j>=0&&ordT[j]<tT){ordT[j+1]=ordT[j];ordK[j+1]=ordK[j];j--}ordT[j+1]=tT;ordK[j+1]=kK} // far to near
      for(let q=0;q<cnt;q++){const tt=ordT[q],kind=ordK[q];
        let cr=0,cg=0,cb=0,al=1;
        if(kind===0){const nr=(tt*u-Cr)/R,nf=(tt-Cf)/R,nu=(tt*v-Cu)/R;
          const ux=nr*-dY+nf*dX,uy=nr*dX+nf*dY,uz=nu;fb(ux,uy,uz,tc);
          const k=lightK(nr,nf,nu)*(1-glow)+glow,rim=atmo?Math.pow(1-Math.max(0,-(nr*u+nf+nu*v)/Math.sqrt(a)),3):0;
          cr=tc[0]*k+(atmo?atmo[0]*rim*(.3+.7*lightK(nr,nf,nu)):0);cg=tc[1]*k+(atmo?atmo[1]*rim*(.3+.7*lightK(nr,nf,nu)):0);cb=tc[2]*k+(atmo?atmo[2]*rim*(.3+.7*lightK(nr,nf,nu)):0);if(gtx){fb(ux,uy,uz,tg,gtx);const ge=.9*(1-.6*lightK(nr,nf,nu));cr+=tg[0]*ge;cg+=tg[1]*ge;cb+=tg[2]*ge}
          if(tt<zfront)zfront=tt}
        else if(kind===1){const nr=(tt*u-mo.xr)/mo.r,nf=(tt-mo.xf)/mo.r,nu=(tt*v-mo.xu)/mo.r,k=lightK(nr,nf,nu),sp=.8+.2*Math.sin(nr*9+nu*7+nf*5);
          if(mo.tex){const ux=nr*-dY+nf*dX,uy=nr*dX+nf*dY;const lon=Math.atan2(uy,ux),lat=Math.asin(Math.max(-1,Math.min(1,nu))),T2=mo.tex,fx=(lon/6.2831853+.5)*T2.w,fy=(.5-lat/3.1415927)*T2.h,i4=(((fy|0)&T2.hm)*T2.w+((fx|0)&T2.wm))*4;cr=T2.d[i4]*k;cg=T2.d[i4+1]*k;cb=T2.d[i4+2]*k}
          else{cr=mo.col[0]*k*sp;cg=mo.col[1]*k*sp;cb=mo.col[2]*k*sp}
          if(tt<zfront)zfront=tt}
        else{const pr_=tt*u-Cr,pf=tt-Cf,pu=tt*v-Cu,rr=Math.sqrt(pr_*pr_+pf*pf+pu*pu)/R,band=.5+.5*Math.sin(rr*(28+sd%7))*.6+.25*Math.sin(rr*71+sd);
          al=ra*Math.max(0,Math.min(1,band*.9+.1))*(rr<ri/R+.04?(rr-ri/R)/.04:1)*(ro/R-rr<.05?(ro/R-rr)/.05:1);
          // shadow of the planet on the ring
          const wx=pr_*-dY+pf*dX,wy=pr_*dX+pf*dY,wz=pu,bq=wx*lx+wy*ly+wz*lz,pl2=wx*wx+wy*wy+wz*wz;
          let k=.85;if(bq<0&&pl2-bq*bq<R*R)k=.12;
          cr=rc[0]*k;cg=rc[1]*k;cb=rc[2]*k;if(al>.2&&tt<zfront)zfront=tt}
        if(kind===2){R_=R_*(1-al)+cr*al;G_=G_*(1-al)+cg*al;B_=B_*(1-al)+cb*al;A_=A_+(1-A_)*al}
        else{R_=cr;G_=cg;B_=cb;A_=1}
      }
      if(tp>0&&zfront===tp)A_*=ed;if(A_<.03)continue;
      const z=zfront;
      let kb2=((z-.55)*YBS)|0;if(kb2<0)kb2=0;else if(kb2>=YBK)kb2=YBK-1;
      for(let yy=y;yy<y+bs&&yy<y1;yy++)for(let xx=x;xx<x+bs&&xx<x1;xx++){
      if(yy>=YB[xx*YBK+kb2])continue;
      if(ws[xx]===tnow){const nn=wn[xx];let hid=false;for(let k=0,b=xx*HGTM_N;k<nn;k++)if(wp[b+k]<z&&yy>=wt[b+k]){hid=true;break}if(hid)continue}
      const sm=Math.min(hzmax,z*HGTM_SEC[xx]*hzrate*.7),iv=1-sm,sk=(.55*lbm+.05)*sm,oo=(yy*VW+xx)*4,gn=(o.gain||1);
      D[oo]=R_*iv*gn+hzr[0]*sk;D[oo+1]=G_*iv*gn+hzr[1]*sk;D[oo+2]=B_*iv*gn+hzr[2]*sk;D[oo+3]=Math.min(255,A_*255);
      }
    }
  }
  const cxv=S.cx;if(S.ob)cxv.clearRect(S.ob[0],S.ob[1],S.ob[2],S.ob[3]);
  cxv.putImageData(S.img,0,0,x0,y0,x1-x0,y1-y0);S.ob=[x0,y0,x1-x0,y1-y0];
  return{k:0,tY:Math.max(.2,Cf),slot:slotIx,x0,y0,w:x1-x0,h:y1-y0};
}

/* ---------- clouds: clusters of soft puffs drawn as depth-sorted billboards, with a milky fog when the party is inside ---------- */
function hgtmPuffImg(v,col){
  const q=c=>Math.max(0,Math.min(15,(c/16)|0)),key=v+'|'+q(col[0])+'|'+q(col[1])+'|'+q(col[2]);let c=HGTM.puffC[key];if(c)return c;
  const S=96;c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d'),R=hgtmRnd(v*31+5);
  const cr=q(col[0])*16+8,cg=q(col[1])*16+8,cb=q(col[2])*16+8;
  for(let i=0;i<9;i++){const a=R()*6.283,d=R()*S*.2,px=S/2+Math.cos(a)*d,py=S/2+Math.sin(a)*d*.8,r=S*(.2+.2*R());
    const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${cr},${cg},${cb},.38)`);g.addColorStop(.6,`rgba(${cr},${cg},${cb},.14)`);g.addColorStop(1,`rgba(${cr},${cg},${cb},0)`);x.fillStyle=g;x.fillRect(0,0,S,S)}
  const sh=x.createLinearGradient(0,0,0,S);sh.addColorStop(0,'rgba(255,255,255,.10)');sh.addColorStop(1,'rgba(20,10,40,.22)');x.globalCompositeOperation='source-atop';x.fillStyle=sh;x.fillRect(0,0,S,S);
  HGTM.puffC[key]=c;return c;
}
function hgtmCloudEntries(I,cam,out){
  const dX=cam.dX,dY=cam.dY,cx=cam.cx,cy=cam.cy,cz=cam.cz,t=G.time*.3+I.t0,C=TC,o=I.o,al0=o.alpha===undefined?.6:o.alpha;
  hgtmPrepLights();
  // colour of this cloud: milky, lit by the ambient light, tinted by the lamps near it
  const K=[0,0,0],zc0=I.pz!==undefined?I.pz:I.cz;
  hgtmLightAt(I.x,I.y,zc0,0,0,1,K);
  const base=o.col||[205,200,232];
  let cr=Math.min(255,base[0]*(.35+K[0]*1.3)),cg=Math.min(255,base[1]*(.35+K[1]*1.3)),cb=Math.min(255,base[2]*(.35+K[2]*1.3));
  // fog inside
  let dens=0;
  const px0=cx,py0=cy,pz0=cz;
  const hw=VW/2;
  for(let i=0;i<I.pf.length;i++){const p=I.pf[i],rr=p.r*(1+.08*Math.sin(t+p.ph)),wx=I.x+p.dx+Math.sin(t*.7+p.ph)*.15,wy=I.y+p.dy+Math.cos(t*.6+p.ph)*.15,wz=zc0+p.dz;
    const dxx=wx-px0,dyy=wy-py0,dzz=wz-pz0,d2=dxx*dxx+dyy*dyy+dzz*dzz;
    if(d2<rr*rr*1.2){const f=1-Math.sqrt(d2)/(rr*1.1);dens+=Math.max(0,f)*Math.max(0,f)*.9}
    const zc=dX*dxx+dY*dyy,xc=dX*dyy-dY*dxx,yc=dzz;
    if(zc<.25||zc>38)continue;
    const sr=rr*F/zc*1.25;if(sr<1.5)continue;
    const sx=hw+F*xc/zc,sy=HH-F*yc/zc;if(sx+sr<0||sx-sr>VW||sy+sr<0||sy-sr>VH)continue;
    out.push({k:1,tY:zc,sx,sy,sr,zc,col:[cr,cg,cb],v:p.v,a:al0*Math.min(1,(zc-.25)/1.1),rot:p.ph});
  }
  if(dens>0){HGTM.fog=Math.max(HGTM.fog,Math.min(.86,dens*(o.alpha===undefined?1:al0*1.6)));
    // inside the cloud the light comes from within: ambient plus the lamp colours at the camera
    const K2=[0,0,0];hgtmLightAt(px0,py0,pz0,0,0,1,K2);HGTM.fogCol=[Math.min(255,base[0]*(.4+K2[0]*1.5)),Math.min(255,base[1]*(.4+K2[1]*1.5)),Math.min(255,base[2]*(.4+K2[2]*1.5))]}
}
function hgtmDrawPuff(e){
  const C=TC,img=hgtmPuffImg(e.v,e.col),sr=e.sr,left=e.sx-sr,top=e.sy-sr,wd=sr*2,x0=Math.max(0,Math.floor(left)),x1=Math.min(VW,Math.ceil(left+wd)),z=e.zc;
  let kb=((z-.4)*YBS)|0;if(kb<0)kb=0;else if(kb>=YBK)kb=YBK-1;
  const tnow=G.time,bot=top+wd,sm=Math.min(C.hzmax,z*C.hzrate),su=img.width/wd;
  SC.save();SC.globalAlpha=Math.max(0,Math.min(1,e.a*(1-sm*.5)));
  let rs=-1,rc=0;
  const flush=xe=>{if(rs<0)return;const cut=Math.min(bot,rc);if(cut>top){const u0=(rs-left)*su,uw=(xe-rs)*su;SC.drawImage(img,u0,0,Math.max(.5,uw),img.height*(cut-top)/wd,rs,top,xe-rs,cut-top)}rs=-1};
  for(let x=x0;x<x1;x++){
    let cut=Math.min(bot,YB[x*YBK+kb]);
    if(HGTM_WS[x]===tnow){const n=HGTM_WN[x];for(let k=0,b=x*HGTM_N;k<n;k++)if(HGTM_WP[b+k]<z&&HGTM_WT[b+k]<cut)cut=HGTM_WT[b+k]}
    if(rs>=0&&Math.abs(cut-rc)>.7)flush(x);
    if(rs<0){rs=x;rc=cut}
  }
  flush(x1);SC.restore();
}

/* ==========================================================================
   TEST MODELS and demo spawns
   ========================================================================== */
function hgtmLegs(def){return def}
hgtmDef('hgtmTestSpire',{rad:9,foot:2.2,cycle:2.93,speed:.35,
  root:{id:'root',kids:[{id:'body',pos:[0,0,6.9],
    parts:[{t:'ell',c:[0,0,0],r:[.55,.95,.5],seg:[14,10],tex:'art_tex_hgt_wb1',col:[225,215,235],uv:[2,2]},
           {t:'ell',c:[0,.9,.25],r:[.32,.35,.3],seg:[12,8],col:[210,190,225]},
           {t:'ell',c:[-.34,1.18,.38],r:[.3,.3,.3],seg:[12,8],col:[250,250,250]},{t:'ell',c:[.34,1.18,.38],r:[.3,.3,.3],seg:[12,8],col:[250,250,250]},
           {t:'disc',c:[-.34,1.47,.38],r:.2,axis:'+y',seg:12,col:[15,10,30]},{t:'disc',c:[.34,1.47,.38],r:.2,axis:'+y',seg:12,col:[15,10,30]},
           {t:'disc',c:[-.28,1.48,.45],r:.06,axis:'+y',seg:8,col:[255,255,255],glow:1},{t:'disc',c:[.4,1.48,.45],r:.06,axis:'+y',seg:8,col:[255,255,255],glow:1}],
    kids:[
      {id:'hLF',pos:[-.35,.55,-.2],parts:[{t:'limb',id:'LF',len:[3.4,3.4,.5],rad:[.14,.1,.07,.04],col:[200,190,220],tex:'art_tex_hgt_wb1'}]},
      {id:'hRF',pos:[.35,.55,-.2],parts:[{t:'limb',id:'RF',len:[3.4,3.4,.5],rad:[.14,.1,.07,.04],col:[200,190,220],tex:'art_tex_hgt_wb1'}]},
      {id:'hLB',pos:[-.35,-.6,-.2],parts:[{t:'limb',id:'LB',len:[3.4,3.4,.5],rad:[.14,.1,.07,.04],col:[200,190,220],tex:'art_tex_hgt_wb1'}]},
      {id:'hRB',pos:[.35,-.6,-.2],parts:[{t:'limb',id:'RB',len:[3.4,3.4,.5],rad:[.14,.1,.07,.04],col:[200,190,220],tex:'art_tex_hgt_wb1'}]}]}]},
  anim(t,st){
    const A=1.1,H=1.0,hh=6.7,legs=[['LF',0,-1,0],['RF',.5,1,0],['LB',.75,-1,0],['RB',.25,1,0]],l={},ro={},wk=st.walk,ph=st.phase;
    for(const [id,off,side] of legs){
      const fo=hgtmFoot(ph+off,A*wk,H*wk,.75),lx=side*1.5,fz=hh-.5-fo[1],ff=fo[0]+(id[1]==='F'?.2:-.2);
      const dPlane=Math.hypot(lx,fz),ik=hgtmIK2(3.4,3.4,ff,dPlane,-1);ro[id]=-Math.atan2(lx,fz);l[id]=[ik[0],ik[1],-(ik[0]+ik[1])]}
    return{l,ro,n:{body:{p:[0,Math.sin(ph*6.283*2)*.06*wk,Math.sin(t*.7)*.05],r:[Math.sin(t*.5)*.03,0,Math.sin(ph*6.283)*.05*wk]}}}
  }});
hgtmDef('hgtmTestPeacock',{rad:2.4,foot:.9,cycle:.53,speed:.25,
  root:{id:'root',kids:[{id:'body',pos:[0,0,.85],
    parts:[{t:'ell',c:[0,0,0],r:[.25,.5,.26],rot:[.25,0,0],seg:[14,10],col:[30,110,200]},{t:'ell',c:[0,.1,.12],r:[.2,.32,.18],seg:[12,8],col:[20,150,170]}],
    kids:[
      {id:'neck1',pos:[0,.38,.12],rot:[-.45,0,0],parts:[{t:'limb',id:'n1',up:true,len:[.28],rad:[.1,.075],col:[25,130,210],sides:7}],kids:[
        {id:'neck2',pos:[0,0,.28],rot:[.8,0,0],parts:[{t:'limb',id:'n2',up:true,len:[.26],rad:[.075,.06],col:[25,130,210],sides:7}],kids:[
          {id:'neck3',pos:[0,0,.26],rot:[-.5,0,0],parts:[{t:'limb',id:'n3',up:true,len:[.24],rad:[.06,.05],col:[25,130,210],sides:7}],kids:[
            {id:'head',pos:[0,0,.24],parts:[{t:'ell',c:[0,.04,.02],r:[.075,.11,.075],seg:[10,8],col:[25,120,205]},
              {t:'ell',c:[-.045,.09,.05],r:[.032,.032,.032],seg:[8,6],col:[250,250,250]},{t:'ell',c:[.045,.09,.05],r:[.032,.032,.032],seg:[8,6],col:[250,250,250]},
              {t:'disc',c:[-.05,.123,.05],r:.02,axis:'+y',seg:8,col:[10,10,10]},{t:'disc',c:[.05,.123,.05],r:.02,axis:'+y',seg:8,col:[10,10,10]},
              {t:'limb',id:'crest',len:[.1],rad:[.012,.004],up:true,noball:true,col:[40,170,200],c:[0,0,.08]}],
              kids:[{id:'beak',pos:[0,.1,.01],rot:[1.5,0,0],parts:[{t:'limb',id:'beak',len:[.1],rad:[.04,.006],noball:true,col:[190,170,120],sides:5}]}]}]}]}]},
      {id:'tail',pos:[0,-.42,.05],parts:[{t:'fan',c:[0,0,0],n:15,layers:2,len:1.15,wid:.34,base:.03,spread:2.5,shimmer:[.04,2.2],vcol:[[70,170,90],[110,200,130],[50,110,235]],col:[255,255,255]}]},
      {id:'hipL',pos:[-.11,0,-.2],parts:[{t:'limb',id:'LL',len:[.32,.3,.1],rad:[.04,.025,.02,.015],col:[150,120,80]}]},
      {id:'hipR',pos:[.11,0,-.2],parts:[{t:'limb',id:'RL',len:[.32,.3,.1],rad:[.04,.025,.02,.015],col:[150,120,80]}]}]}]},
  anim(t,st){
    const wk=st.walk,ph=st.phase,l={},ro={};
    for(const [id,off,side] of [['LL',0,-1],['RL',.5,1]]){const fo=hgtmFoot(ph+off,.16*wk,.1*wk,.6),ik=hgtmIK2(.32,.3,fo[0],.55-fo[1],1);ro[id]=0;l[id]=[ik[0],ik[1],-(ik[0]+ik[1])]}
    const nb=Math.sin(ph*6.283*2)*.04*wk,sway=Math.sin(t*.6)*.06;
    return{l,ro,n:{body:{p:[0,0,Math.abs(Math.sin(ph*6.283))*.03*wk],r:[0,0,sway*.2]},neck1:{r:[Math.sin(ph*6.283*2)*.18*wk,0,sway]},neck3:{r:[Math.sin(ph*6.283*2+1)*.14*wk,0,sway*.5]},tail:{r:[0,Math.sin(t*.9)*.05,Math.sin(t*.45)*.07]}},
      fan:Math.sin(t*1.3)*.4}
  }});
hgtmPlanet('hgtmTestPlanetA',null,1.2,{col:[70,110,190],col2:[230,200,170],spin:.4,atmo:[120,160,255],moon:{r:.22,orbit:2.1,period:30,col:[200,200,210]}});
hgtmPlanet('hgtmTestPlanetB',null,.8,{col:[200,110,60],col2:[240,190,120],spin:.8,tilt:.5,ring:{in:1.35,out:2.2,col:[225,200,150],alpha:.85}});
hgtmPlanet('hgtmTestPlanetC',null,.5,{col:[255,200,110],col2:[255,240,200],spin:.3,glow:.85});
let hgtmTestDone=false;
function hgtmTestSetup(){ // demo records, built once; HGTM.test=false drops them
  if(hgtmTestDone||!HGTM.test)return;hgtmTestDone=true;
  const walkLoop=(cx,cy,r)=>[[cx-r,cy-r*.5],[cx+r*.2,cy-r],[cx+r,cy-r*.3],[cx+r*.6,cy+r],[cx-r*.4,cy+r*.8]];
  // level 483 (Glorm), near (75,130)
  hgtmSpawn('hgtmTestSpire',{level:483,route:walkLoop(78,128,10),speed:.35});
  hgtmSpawn('hgtmTestPeacock',{level:483,route:[[72,134],[76,136],[80,133],[77,131]],speed:.2});
  hgtmSpawn('hgtmTestPlanetA',{level:483,route:[[70,120,3.2],[95,126,4.2],[88,145,3.4],[64,138,5]],speed:.8});
  hgtmSpawn('hgtmTestPlanetB',{level:483,route:[[100,132,5],[75,118,6],[60,128,4]],speed:.6});
  hgtmSpawn('hgtmTestPlanetC',{level:483,route:[[80,150,3],[68,126,2.4],[84,124,3.6]],speed:.9});
  hgtmCloudField(483,12,{x0:55,y0:105,x1:105,y1:155,z0:.4,z1:4.5,seed:5});
  // level 480 (the test terraces)
  hgtmSpawn('hgtmTestSpire',{level:480,route:[[20,28],[24,22],[30,34],[22,38]],speed:.3});
  hgtmSpawn('hgtmTestPeacock',{level:480,route:[[18,36],[22,38],[26,36],[22,33]],speed:.2});
  hgtmSpawn('hgtmTestPlanetA',{level:480,route:[[16,20,2.2],[34,24,3.2],[26,40,2.6]],speed:.7});
  hgtmSpawn('hgtmTestPlanetB',{level:480,route:[[10,30,3],[30,20,3.5],[40,36,2.6]],speed:.6});
  hgtmCloudField(480,6,{x0:6,y0:12,x1:42,y1:40,z0:.3,z1:3,seed:9});
}
