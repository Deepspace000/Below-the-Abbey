/* ==========================================================================
   HOLLOW GRASSLANDS CITIES: GIANTS, WINGED CREATURES, PEACOCKS, ANGELFISH, PLANETS (prefix hgtg / HGTG)
   Models for the MESH3D renderer (hgt_mesh.js): geometry in code, painted textures (hgt_art2.js). Nothing is drawn in code.
   Everything here is scenery: no dialogue, no health, never saved, rebuilt from the level seed on every level entry (hgtgAuto, hooked automatically
   into hgtmSync; hgt_town_*.js are not edited).

   SPAWN BY NAME:  hgtgSpawn(name, {x,y,yaw,scale,level,route,speed,...})  (wraps hgtmSpawn: adds the behaviour hooks). Scale 1 = model size below.
     STILT-WALKERS (about 10 cells tall at scale 1; use scale .6 to 1.4 = 6 to 14 cells): hgtg_stilt4 (pink, 4 legs), hgtg_stilt6 (aqua, 6 legs), hgtg_stilt_heron (amber, 4 legs, beak)
     BULK GIANTS (about 9 cells tall; scale .65 to 1.3): hgtg_bulk_mound (pink, pedestal belly), hgtg_bulk_lilac (4 legs, frill), hgtg_bulk_amber (2 legs, horns),
        hgtg_bulk_aqua (tentacle skirt, 3 eyes). They blink, breathe and turn eyes and head to the party.
     WINGED (wingspan about 2 cells at scale 1; scale .5 to 3 = 1 to 6): hgtg_moth, hgtg_bellmoth, hgtg_bat, hgtg_butterfly, hgtg_dragonfly (route points need z: [x,y,z])
     PEACOCKS (about 1.7 cells tall): hgtg_peacock (blue), hgtg_peacock_green, hgtg_peacock_white. The fan opens slowly when the party is near.
     ANGELFISH: hgtg_angel_<pearl|aqua|rose|gold|violet|bw|glow> (one fish, length 1 at scale 1) and schools via hgtgSchool(level,{route,n,scale,tints,seed}) (route points [x,y,z])
     PLANETS: hgtg_planet_<orange|ocean|gas|pearl|jade|violet|ice|lava|desert|cratered|crystal|coral> (hgtgPlanetSpawn(level,name,route,speed)); clouds: hgtmCloudField (puffs use hgt_cloud_*).
     HORIZON (scenery only, never hostile, no health, not targetable): hgtgSpawn names hgtg_scorpionfish (about 100 cells long, fanned spiny dorsal fin, frilled pectorals, barbels, ragged tail, glaring eye),
        hgtg_levi_whale (64), hgtg_levi_manta (52 span), hgtg_levi_eel (80), hgtg_levi_jelly (26 bell). Give them route points [x,y,z] far outside the level (hundreds of cells), fly:true, far:2000, cheap:true.
        hgtgHorizon(levelId) places them by itself: level 470 gets 1 scorpionfish and 5 leviathans (2 far, 2 mid at 150 to 190 cells, 1 near at about 95), cities 480..484 get 1 scorpionfish and 3 leviathans.
        Level 470 is a flat raycaster level: hgtgFlatBegin replaces hgtmBegin there (own light and haze set HGTG_FTC, ground depth table YB filled for a flat floor, walls hide them through hgtmRec; the roof is not tested).
   AUTO:  hgtgAuto(levelId, opts) places a population (deterministic from the level id and opts.seed). opts: {seed, scale:0..2 (count multiplier), mix:{stilt,bulk,wing,peacock,schools,planets,clouds}, skip:true}.
     It runs by itself the first time a terraced level is drawn (480..484 full mixes, other terraced levels a small one, none for 485 and 486 test rooms).
     HGTG.off=true switches the automatic population off. HGTG.killDemos (default true) drops the demo spawns of hgt_mesh.js.
   Edits made to hgt_mesh.js (4 one-line changes): SM (visible mesh slots) 6 to 12, texture size rounds to the nearest power of two (126 px becomes 128, not 64), instances with o.cheap are never dropped by the time budget
   and an over-budget instance is skipped (continue) instead of ending the loop. Everything else is wrapped here
   (part type 'dome', fan spread pose.fs and length pose.fl, per-instance tick hook o.tick, HGTG.cur = instance being drawn).
   ========================================================================== */
const HGTG={building:true,lift:.22,done:{},info:{},cur:null,killDemos:true,off:false,vdone:false,kind:{},stat:{}};
const hgtgR=hgtmRnd,hgtgClamp=(v,a,b)=>v<a?a:v>b?b:v,hgtgWrap=a=>Math.atan2(Math.sin(a),Math.cos(a)),hgtgSm=(a,b,x)=>{const t=hgtgClamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};

/* ---------- wrappers around the mesh renderer ---------- */
(function(){
  const bp=hgtmBuildPart;hgtmBuildPart=function(d,ix){if(HGTG.building){if(d.grade===undefined)d.grade=false;if(d.glow===undefined&&d.t!=='fan')d.glow=HGTG.lift;if(d.t==='fan'&&d.tex&&d.alpha===undefined)d.alpha=true}return d.t==='dome'?hgtgDome(d,ix):bp(d,ix)};
  const gf=hgtmGenFan;hgtmGenFan=function(P,pose,inst){const d=P.def,s=d.spread,l=d.len,ks=pose&&pose.fs,kl=pose&&pose.fl;
    if(ks===undefined&&kl===undefined)return gf(P,pose,inst);d.spread=(s||2.4)*(ks===undefined?1:ks);d.len=(l||1)*(kl===undefined?1:kl);gf(P,pose,inst);d.spread=s;d.len=l};
  const rm0=hgtmRenderMesh,rm=function(I,cam,s){if(!HGTG.prof)return rm0(I,cam,s);const t0=performance.now(),r=rm0(I,cam,s),k=I.o.rim?'rim':I.kind==='mesh'?(HGTG.kind[I.name]||I.name):I.kind;HGTG.prof[k]=(HGTG.prof[k]||0)+performance.now()-t0;return r};hgtmRenderMesh=function(I,cam,s){HGTG.cur=I;if(!HGTG.vdone)hgtgVariants();if(I.o.minD&&I.zc<I.o.minD)return null;if(I.o.hgk==='levi'&&CAMZ<6&&HGTG.hcT===G.time&&++HGTG.hcN>1)return null;if(I.o.hgk==='levi'&&CAMZ<6&&HGTG.hcT!==G.time){HGTG.hcT=G.time;HGTG.hcN=1}if(!I.o.cheap&&I.zc>0&&F*I.M.rad*I.sc/Math.max(.3,I.zc)<2.5)return null;if(!I.o.cheap&&I.zc>6&&hgtgHidden(I))return null;if(I.zc>50+I.sc*22&&/school|angel/.test(I.name))return null;if(!I.o.cheap&&I.zc>60){if(HGTG.farT!==G.time){HGTG.farT=G.time;HGTG.farN=0}if(++HGTG.farN>3)return null}return rm(I,cam,s)};
  const up=hgtmUpdate;hgtmUpdate=function(dt){for(const I of HGTM.inst){const f=I.o&&I.o.tick;if(f)f(I,dt)}const r=up(dt);if(HGTG.moon)hgtgMoonGuard(dt);return r};
  const sy=hgtmSync;hgtmSync=function(){if(HGTM.lvl!==LEVEL)HGTG.moonI=null;if(HGTM.lvl!==LEVEL&&!HGTG.off){hgtgOnEnter(LEVEL);try{hgtgFixRoosts(LEVEL);hgtgFixStatics(LEVEL)}catch(e){console.error('roost',e)}try{hgtgWrapLook();if(LEVEL===470||(LEVEL>=480&&LEVEL<=484))hgtgMoon(LEVEL)}catch(e){console.error('moon',e)}}return sy()};
})();
/* a glossy eye dome: a spherical cap of height bulge on a flat circle of radius r (axis '+y','-y','+x','-x','+z','-z'), the picture mapped flat across it */
function hgtgDome(d,ix){
  const seg=d.seg||16,R=d.rings||5,r=d.r||.2,b=d.bulge===undefined?r*.6:d.bulge,ax=d.axis||'+y',sg=ax[0]==='-'?-1:1,A=ax[1],c=d.c||[0,0,0];
  const nv=1+R*(seg+1),P={node:ix,tex:d.tex||null,texMax:d.texMax||256,col:d.col||[255,255,255],glow:d.glow||0,alpha:!!d.alpha,grade:d.grade,dbl:true,kind:'dome',def:d,vcol:null,gen:null};
  P.nv=nv;P.lpos=new Float32Array(nv*3);P.lnor=new Float32Array(nv*3);P.uv=new Float32Array(nv*2);
  const put=(o,rho,a)=>{const ca=Math.cos(a),sa=Math.sin(a),q=rho/r,hh=b*(1-q*q),k=2*b*rho/(r*r),nl=Math.hypot(k,1),u=ca*rho,w=sa*rho,nu=ca*k/nl,nw=sa*k/nl,na=1/nl;let p,n;
    if(A==='y'){p=[u,sg*hh,w];n=[nu,sg*na,nw]}else if(A==='x'){p=[sg*hh,u,w];n=[sg*na,nu,nw]}else{p=[u,w,sg*hh];n=[nu,nw,sg*na]}
    for(let i=0;i<3;i++){P.lpos[o*3+i]=p[i]+c[i];P.lnor[o*3+i]=n[i]}P.uv[o*2]=.5+.5*q*ca;P.uv[o*2+1]=.5-.5*q*sa};
  put(0,0,0);let o=1;for(let j=1;j<=R;j++)for(let i=0;i<=seg;i++)put(o++,r*j/R,6.2831853*i/seg);
  const tr=[];for(let i=0;i<seg;i++)tr.push(0,1+i,2+i);
  for(let j=1;j<R;j++)for(let i=0;i<seg;i++){const a=1+(j-1)*(seg+1)+i,b2=a+1,c2=a+seg+1,d2=c2+1;tr.push(a,c2,b2,b2,c2,d2)}
  P.tr=Uint16Array.from(tr);P.nt=tr.length/3;return P;
}

/* ---------- picture variants made from painted pictures at load time (hue, saturation, value; no new drawing) ---------- */
function hgtgHSV(r,g,b,dh,sk,vk,bw){
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d>0){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4}h=(h*60+dh+360)%360;
  let s=mx?d/mx:0,v=mx/255;if(bw){const l=(r*.3+g*.59+b*.11)/255,k=hgtgClamp((l-bw)*2.4+.55,.18,1);return[k*232,k*236,k*246]}
  s=Math.min(1,s*sk);v=Math.min(1,v*vk);const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;let o=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
  return[(o[0]+m)*255,(o[1]+m)*255,(o[2]+m)*255];
}
function hgtgRecolor(src,dst,dh,sk,vk,bw){
  const im=IMG[src];if(!im||!im.width)return false;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);
  const d=x.getImageData(0,0,c.width,c.height),a=d.data;for(let i=0;i<a.length;i+=4){if(a[i+3]<8)continue;const o=hgtgHSV(a[i],a[i+1],a[i+2],dh,sk,vk,bw);a[i]=o[0];a[i+1]=o[1];a[i+2]=o[2]}
  x.putImageData(d,0,0);IMG[dst]=c;return true;
}
const HGTG_FISHCOL={pearl:[0,1,1,0],aqua:[165,2.2,1],rose:[-135,2.4,1],gold:[-8,2.6,1.05],violet:[100,2.2,.95],bw:[0,0,1,.62],glow:[150,1.8,1.15]};
function hgtgVariants(){
  if(HGTG.vdone)return;const base=IMG.hgtb_fish_angel;if(!base||!base.width)return;HGTG.vdone=true;
  for(const k in HGTG_FISHCOL){const v=HGTG_FISHCOL[k];if(k==='pearl')IMG.hgtg_fish_pearl=base;else hgtgRecolor('hgtb_fish_angel','hgtg_fish_'+k,v[0],v[1],v[2],v[3])}
  hgtgRecolor('hgtb_feather_peacock1','hgtg_feather_green1',-60,1.1,1);hgtgRecolor('hgtb_feather_peacock2','hgtg_feather_green2',-70,1.1,1);
  hgtgRecolor('hgtb_feather_peacock1','hgtg_feather_white1',0,.12,1.6);hgtgRecolor('hgtb_feather_peacock2','hgtg_feather_white2',0,.1,1.6);
}

/* ---------- soft ground shadow: a dithered radial picture made at load (alpha cut-out), drawn as a flat disc just above the ground ---------- */
(function(){const S=128,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d'),d=x.createImageData(S,S),B=[0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
  for(let j=0;j<S;j++)for(let i=0;i<S;i++){const r=Math.hypot(i-S/2+.5,j-S/2+.5)/(S/2),a=Math.exp(-r*r*3.2)*.8*(r<1?1:0),th=(B[(j&7)*8+(i&7)]+.5)/64,o=(j*S+i)*4;d.data[o]=d.data[o+1]=d.data[o+2]=0;d.data[o+3]=Math.min(255,a*320)}
  x.putImageData(d,0,0);IMG.hgtg_shadow=c})();
const gShadow=r=>({id:'shd',pos:[0,0,.07],parts:[{t:'disc',c:[0,0,0],r,axis:'+z',seg:16,tex:'hgtg_shadow',alpha:true,soft:true,col:[6,8,6],glow:0,grade:false}]});
/* nearby lamps light the big creatures more strongly and in their colour (heights compressed, stronger pool) */
{const hl=hgtmLightAt;hgtmLightAt=function(x,y,z,nx,ny,nz,o){const I=HGTG.cur;if(HGTG._ci!==I||HGTG._cf!==G.time){HGTG._ci=I;HGTG._cf=G.time;HGTG._ck=I&&I.o&&I.o.hgk}const k=HGTG._ck;if(!k)return hl(x,y,z,nx,ny,nz,o);const big=k==='bulk'||k==='stilt'||k==='peacock',night=HGTG._nk===G.time?HGTG._nv:(HGTG._nk=G.time,HGTG._nv=typeof hgtlmNight==='function'?hgtlmNight():0);
  const C=TC,lb=C.lbm,L=hgtmL,df=Math.max(0,nx*HGTM_LF[0]+ny*HGTM_LF[1]+nz*HGTM_LF[2]),base=lb*(.8+.6*df+.15*nz)*1.1+.1+.16*night+(k==='levi'?.4+.2*night:0);let r=base*C.tbR,g=base*C.tbG,b=base*C.tbB;
  const LN=I.zc>45?Math.min(L.n,3):L.n;for(let i=0;i<LN;i++){const dx=L.x[i]-x,dy=L.y[i]-y,dz=(L.z[i]-z)*.3,d2=dx*dx+dy*dy+dz*dz,q=L.q[i]*(big?1.9:1.4)/(1+1.15*(d2*.5+.44)),il=1/Math.sqrt(d2+1e-6),ln=(dx*nx+dy*ny+dz*nz)*il,w=q*(.4+.6*Math.max(0,ln*.7+.3));r+=w*L.r[i];g+=w*L.g[i];b+=w*L.b[i]}
  o[0]=r;o[1]=g;o[2]=b}}
HGTG.alias={art_tex_hgtb_skinpink:'hgtb_bulk_skin_pink',art_tex_hgtb_skinaqua:'hgtb_bulk_skin_aqua',art_tex_hgtb_skinlilac:'hgtb_bulk_skin_lilac',art_tex_hgtb_skinamber:'hgtb_bulk_skin_amber'};
{const ta=hgtmTex;hgtmTex=function(name,max,grade){const a=HGTG.alias[name];if(a){const k=IMG['art_tex_'+a]?'art_tex_'+a:IMG[a]?a:null;if(k)name=k}return ta(name,max,grade)}}
/* the sleeping giants use a copy of their painted face with the eyes closed: the pupils are found in the picture and covered with the cheek colour and a lid line */
function hgtgSleepFace(name){const key='hgtg_sleep_'+name;if(IMG[key])return key;const im=IMG[name];if(!im||!im.width)return name;const w=im.width,h=im.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);const d=x.getImageData(0,0,w,h).data;
  const lum=i=>d[i]*.3+d[i+1]*.59+d[i+2]*.11;
  for(const half of[0,1]){let best=1e9,bx=0,by=0;const x0=half?w*.52:w*.08,x1=half?w*.92:w*.48;
    for(let yy=(h*.18)|0;yy<h*.5;yy+=2)for(let xx=x0|0;xx<x1;xx+=2){const i=(yy*w+xx)*4;if(d[i+3]<200)continue;let s=0;for(let dy=-3;dy<=3;dy+=3)for(let dx=-3;dx<=3;dx+=3)s+=lum(((yy+dy)*w+xx+dx)*4);s/=9;if(s<best){best=s;bx=xx;by=yy}}
    const r=w*.085,si=(((by+r*2.1)|0)*w+(bx|0))*4;x.fillStyle='rgb('+d[si]+','+d[si+1]+','+d[si+2]+')';x.beginPath();x.ellipse(bx,by,r*1.6,r*1.25,0,0,6.2832);x.fill();
    x.strokeStyle='rgba(60,30,50,.85)';x.lineWidth=Math.max(2,w*.008);x.beginPath();x.arc(bx,by-r*.35,r*1.15,.15*Math.PI,.85*Math.PI);x.stroke()}
  IMG[key]=c;return key}
{const th=hgtmTex;hgtmTex=function(name,max,grade){if(name&&name.indexOf('hgtb_bulk_face_')===0&&HGTG.cur&&HGTG.cur.o&&HGTG.cur.o.sleep)name=hgtgSleepFace(name);return th(name,max,grade)}}
/* ---------- model building helpers ---------- */
const gSkin=n=>'art_tex_hgtb_skin'+n,gEyeT=i=>'hgtb_eye'+i;
/* eye on a head: returns a node (static orientation rot) with a lip ring, a kid ball node (gaze) holding the dome, and fixed gloss highlights.
   ball id = id+'b'. ax = [pitch,0,yaw] to point the dome outwards (use gSurf to get it) */
function gEye(id,pos,r,tex,rot,o){
  o=o||{};const b=o.bulge===undefined?r*.7:o.bulge;
  const hl=(rho,a,s,gl)=>({t:'disc',c:[Math.cos(a)*rho*r,b*(1-rho*rho)+r*.05,Math.sin(a)*rho*r],r:r*s,axis:'+y',seg:8,col:[255,255,255],glow:gl});
  return{id,pos,rot:rot||[0,0,0],parts:[{t:'ell',c:[0,-r*.2,0],r:[r*1.16,r*.3,r*1.16],seg:[14,6],col:o.lip||[225,150,170],tex:o.lipTex,uv:[2,1]}],
    kids:[{id:id+'b',pos:[0,0,0],parts:[{t:'dome',r,bulge:b,axis:'+y',tex,seg:o.seg||16,rings:o.rings||5,col:o.tint||[255,255,255],glow:o.eg},hl(.5,2.3,.17,1),hl(.7,-.8,.07,.8)]}]};
}
function gSurf(c,r,x,z){const q=1-((x-c[0])/r[0])**2-((z-c[2])/r[2])**2;return q>0?c[1]+r[1]*Math.sqrt(q):c[1]}
function gNormRot(c,r,p){const n=[(p[0]-c[0])/(r[0]*r[0]),(p[1]-c[1])/(r[1]*r[1]),(p[2]-c[2])/(r[2]*r[2])],l=Math.hypot(...n);return[Math.asin(n[2]/l),0,Math.atan2(-n[0],n[1])]}
/* a chain of n short tapered limbs growing up from the node origin, each a node (id+i), kid appended at the end of the last */
function gChain(id,n,seg,r0,r1,o,kid){
  o=o||{};const build=i=>{const ra=r0+(r1-r0)*i/n,rb=r0+(r1-r0)*(i+1)/n,N={id:id+i,pos:i?[0,0,seg]:[0,0,0],rot:(o.curve&&o.curve[i])?[o.curve[i],0,0]:[0,0,0],parts:[{t:'limb',id:id+'L'+i,up:true,len:[seg],rad:[ra,rb],col:o.col,tex:o.tex,sides:o.sides||7}],kids:[]};
    if(i<n-1)N.kids.push(build(i+1));else if(kid){kid.pos=[0,0,seg];N.kids.push(kid)}return N};
  return build(0);
}
/* gaze toward the camera: returns {y:relative yaw, p:pitch, k:0..1 strength}; hz = world height of the head above the instance ground, range in cells */
function gGaze(st,hz,range){
  const I=HGTG.cur,cam=HGTM.cam;if(!I||!cam)return{y:0,p:0,k:0};
  const g=I.g||(I.g={}),dx=cam.cx-I.x,dy=cam.cy-I.y,d=Math.hypot(dx,dy),k=hgtgSm(range,range*.35,d);
  const ty=hgtgClamp(hgtgWrap(Math.atan2(-dx,dy)-I.yaw),-1.3,1.3),tp=hgtgClamp(Math.atan2(cam.cz-(I.z+hz*st.sc),Math.max(.5,d)),-.9,.5),t=G.time,dt=hgtgClamp(t-(g.lt||t),0,.1);g.lt=t;
  const a=1-Math.exp(-dt*2.2);g.gy=(g.gy||0)+(ty*k-(g.gy||0))*a;g.gp=(g.gp||0)+(tp*k-(g.gp||0))*a;g.gk=(g.gk||0)+(k-(g.gk||0))*a;
  return{y:g.gy,p:g.gp,k:g.gk};
}
const gBlink=(t,seed)=>{const tt=((t*.37+seed*3.1)%1)*2.7;return tt<.22?Math.sin(Math.PI*tt/.22):0};
/* planar IK legs: spec {legs:[{id,hip,hx,hy,hz,sx,sy,ph,foot}],L:[l1,l2,l3],bend,A,H,beta,ankle} -> adds to pose.l and pose.n */
function gGait(S,st,bodyZ,l,n){
  const wk=st.walk,ph=st.phase,L=S.L;
  for(const g of S.legs){
    const fo=hgtmFoot(ph+g.ph,S.A*wk,S.H*wk,S.beta),fx=g.sx,fy=g.sy+fo[0],dx=fx-g.hx,dy=fy-g.hy,f=Math.hypot(dx,dy),yaw=Math.atan2(-dx,dy),dr=bodyZ+g.hz-(fo[1]+L[2]+S.ankle),ik=hgtmIK2(L[0],L[1],f,dr,S.bend);
    l[g.id]=S.five?[ik[0],0,ik[1],0,-(ik[0]+ik[1])]:[ik[0],ik[1],-(ik[0]+ik[1])];n[g.hip]={r:[0,0,yaw]};if(g.foot)n[g.foot]={p:[fx,fy,fo[1]+S.fz-bodyZ],r:[0,0,yaw]};
  }
}

/* ==========================================================================
   SPINDLY STILT-WALKERS
   ========================================================================== */
function hgtgHidden(I){ // every sampled column of the instance is behind a wall whose top is above the instance's top: skip it
  if(typeof zbuf==='undefined'||I.kind!=='mesh')return false;const zc=I.zc,rad=I.M.rad*I.sc,hw=F*rad/zc,cx=VW/2+F*I.xc/zc;if(cx+hw<0||cx-hw>=VW)return false;
  const top=(I.o.fly?I.pz:I.z)+((HGTG.height[I.name]||I.M.rad*1.2)*I.sc),yt=HH-F*(top-CAMZ)/zc;
  for(let k=0;k<5;k++){const x=Math.max(0,Math.min(VW-1,(cx-hw+hw*2*k/4)|0));if(!(zbuf[x]<zc-rad&&yt>=wtop[x]))return false}return true}
function gScl(parts,k){return parts.map(p=>{const q=Object.assign({},p);if(q.c)q.c=q.c.map(v=>v*k);if(Array.isArray(q.r))q.r=q.r.map(v=>v*k);else if(typeof q.r==='number'&&q.t!=='disc')q.r*=k;if(q.t==='limb'){q.len=q.len.map(v=>v*k);q.rad=q.rad.map(v=>v*k)}if(q.t==='fan'){q.len*=k;q.wid*=k;q.base=(q.base||.04)*k}return q})}
function gStiltDef(name,o){
  const K=2;
  const nl=o.legs||4,hh=7.4,L=[4.2,4.6,.45],ys=nl===4?[.6,-.6]:[.9,0,-.9],legs=[],kids=[];
  const ph4={'-1_0':0,'1_0':.5,'-1_1':.75,'1_1':.25},ph6=(side,i)=>(side<0?[2,1,0][i]/6:[5,4,3][i]/6);
  for(let i=0;i<nl/2;i++)for(const side of[-1,1])legs.push({id:'L'+legs.length,hip:'hip'+legs.length,foot:'ft'+legs.length,hx:side*.46*K,hy:ys[i]*K,hz:-.28*K,sx:side*3.2,sy:ys[i]*3.6,ph:nl===4?ph4[side+'_'+i]:ph6(side,i)});
  const S={legs,L,bend:o.bend||1,A:1.3,H:1.1,beta:nl===4?.75:.8333,ankle:0,fz:.05,five:true};
  const body=[{t:'ell',c:[0,.35,0],r:[.74,1.12,.64],seg:[12,8],tex:o.skin,col:o.col,uv:[2,2],glow:.3},{t:'ell',c:[0,-.85,-.04],r:[.58,1.0,.54],rot:[.18,0,0],seg:[10,6],tex:o.skin,col:o.col,uv:[2,2],glow:.3},
    {t:'ell',c:[0,.0,.36],r:[.46,1.1,.22],seg:[10,5],tex:'art_tex_hgtb_stilt_armour',col:o.plate,uv:[2,1]}];
  for(let k=0;k<5;k++)body.push({t:'ell',c:[0,.9-k*.45,.4+(k%2?.0:.04)],r:[.09,.13,.11],seg:[6,4],col:o.plate});
  const bodyS=gScl(body,K);
  for(const g of legs)kids.push({id:g.hip,pos:[g.hx,g.hy,g.hz],parts:[{t:'limb',id:g.id,len:[L[0]/2,L[0]/2,L[1]/2,L[1]/2,L[2]],rad:[.36,.34,.17,.15,.1,.07],col:o.leg,tex:'art_tex_hgtb_stilt_leg512',texMax:512,sides:nl===6?4:5,glow:.4}]},
    {id:g.foot,pos:[0,0,0],parts:[{t:'ell',c:[0,.1,0],r:[.45,.62,.12],seg:[8,5],tex:'art_tex_hgtb_scales',col:o.leg},{t:'ell',c:[-.2,.7,0],r:[.08,.24,.06],rot:[0,0,.3],seg:[4,3],col:[250,240,215]},{t:'ell',c:[0,.76,0],r:[.08,.26,.06],seg:[4,3],col:[250,240,215]},{t:'ell',c:[.2,.7,0],r:[.08,.24,.06],rot:[0,0,-.3],seg:[4,3],col:[250,240,215]}]});
  const hc=[0,.15*K,0],hr=[.33*K,.48*K,.3*K],eyeNodes=[],er=(o.eyeR||.27)*K;
  for(const sd of[-1,1]){const x=sd*.28*K,z=.08*K,y=gSurf(hc,hr,x,z),p=[x,y,z];eyeNodes.push(gEye(sd<0?'eL':'eR',p,er*1.1,o.eye,gNormRot(hc,hr,p),{bulge:er*.8,lip:o.lip,seg:12,rings:4,eg:.55}))}
  const headP=gScl([{t:'ell',c:[0,.15,0],r:[.33,.48,.3],seg:[14,10],tex:o.skin,col:o.col,uv:[1,1]},{t:'ell',c:[0,.62,-.1],r:[.17,.3,.14],seg:[10,6],tex:o.skin,col:o.col},
    {t:'ell',c:[0,.84,-.12],r:[.1,.06,.05],seg:[8,4],col:[90,40,70]},
    {t:'limb',id:'aL',up:true,len:[.5,.4],rad:[.03,.02,.01],c:[-.12,.05,.26],noball:true,col:o.plate,rest:[.3,.5]},{t:'limb',id:'aR',up:true,len:[.5,.4],rad:[.03,.02,.01],c:[.12,.05,.26],noball:true,col:o.plate,rest:[.3,.5]},
    {t:'ell',c:[-.15,.2,.9],r:[.05,.05,.05],seg:[6,4],col:[255,240,200],glow:.9},{t:'ell',c:[.15,.2,.9],r:[.05,.05,.05],seg:[6,4],col:[255,240,200],glow:.9},
    {t:'fan',c:[0,-.05,.28],n:7,len:.6,wid:.24,base:.02,spread:1.5,tex:'hgtb_feather_iridescent',col:o.crest,vcol:[[255,255,255],[255,255,255],[255,255,255]]}],K),head={id:'head',pos:[0,0,0],parts:headP.concat([{t:'quad',c:[0,hr[1]+hc[1]+.12,.1*K],size:[1.05*K,2.1*K],piv:[.5,.5],tex:'hgtb_stilt_head',alpha:true,col:[255,255,255],glow:.25,texMax:512}]),kids:eyeNodes};
  const neck=gChain('nk',7,.7,.5,.2,{col:o.col,tex:o.skin,curve:[-.8,-.3,.1,.3,.35,.3,.15]},head);
  neck.pos=[0,1.15*K,.15*K];kids.push(neck);
  return hgtmDef(name,{rad:13,foot:2.2,cycle:2*S.A/S.beta,speed:.45,root:{id:'root',kids:[{id:'body',pos:[0,0,hh],parts:bodyS,kids},gShadow(4.2)]},
    anim(t,st){const wk=st.walk,ph=st.phase,bob=Math.sin(ph*6.283*nl/2)*.05*wk+Math.sin(t*.6+st.seed)*.04,l={},n={};gGait(S,st,hh+bob,l,n);
      const gz=gGaze(st,10,40),stp=hgtgSm(0,1,gz.k);n.body={p:[0,0,bob],r:[Math.sin(t*.5)*.02,0,Math.sin(ph*6.283)*.03*wk]};
      for(let i=0;i<7;i++)n['nk'+i]={r:[(i?gz.p*.16:0)-stp*(i<5?.2:.12)+Math.sin(t*.35+i*.8+st.seed)*.04,0,(i>2?gz.y*.22:0)+Math.sin(t*.28+i)*.03]};
      n.head={r:[gz.p*.3+Math.sin(t*.8)*.03,0,gz.y*.15]};n.eLb={r:[gz.p*.2,0,gz.y*.12]};n.eRb={r:[gz.p*.2,0,gz.y*.12]};
      return{l,n,fs:.8+.15*Math.sin(t*.6),ro:{}}}});
}
gStiltDef('hgtg_stilt4',{legs:4,skin:gSkin('pink'),col:[255,225,235],plate:[235,190,215],leg:[240,225,215],eye:gEyeT(3),crest:[255,190,235],lip:[230,150,190]});
gStiltDef('hgtg_stilt6',{legs:6,skin:gSkin('aqua'),col:[215,255,250],plate:[150,225,215],leg:[225,245,240],eye:gEyeT(2),crest:[150,245,255],lip:[160,225,225],eyeR:.3});
gStiltDef('hgtg_stilt_heron',{legs:4,skin:gSkin('amber'),col:[255,235,200],plate:[225,170,90],leg:[235,205,150],eye:gEyeT(1),crest:[255,215,120],lip:[225,170,90],eyeR:.24});

/* ==========================================================================
   BULK GIANTS
   ========================================================================== */
function gBulkEyes(bc,br,eyes,skin,col,kidsOut){
  const ids=[];
  eyes.forEach((e,i)=>{const y=gSurf(bc,br,e.x,e.z),p=[e.x,y,e.z],rot=gNormRot(bc,br,p),id='e'+i,b=e.r*.8,lr=e.lr||e.r;ids.push(id);
    kidsOut.push(gEye(id,p,e.r,e.tex,rot,{bulge:b,lip:e.lip||[225,160,175],lipTex:skin,seg:16,rings:5,eg:.3}));
    kidsOut.push({id:'lid'+i,pos:p,rot,parts:[{t:'ell',c:[0,e.lr?lr*.25:b*.5,lr*1.8],r:[lr*1.24,e.lr?lr*.4:b*.62,lr*1.08],seg:[10,6],tex:skin,col,uv:[1,1]}]});e.lz=lr*1.8});
  return ids;
}
function gArm(id,pos,sgn,skin,col,L,rad){
  const q=rad[2];
  return{id,pos,parts:[{t:'limb',id:id+'L',len:L,rad,col,tex:skin,sides:7}],kids:[{id:id+'h',pos:[0,0,0],parts:[{t:'ell',c:[0,0,0],r:[q*1.5,q*1.3,q*1.5],seg:[8,6],col,tex:skin},
    {t:'ell',c:[-.28*sgn*q,.1,-q*1.2],r:[q*.45,q*.5,q*.8],seg:[6,4],col},{t:'ell',c:[0,.15,-q*1.4],r:[q*.45,q*.5,q*.8],seg:[6,4],col},{t:'ell',c:[.28*sgn*q,.1,-q*1.2],r:[q*.45,q*.5,q*.8],seg:[6,4],col}]}]};
}
function gArmPose(id,L,a0,a1,l,n){l[id+'L']=[a0,a1];let y=Math.sin(a0)*L[0],z=-Math.cos(a0)*L[0];const c=a0+a1;y+=Math.sin(c)*L[1];z-=Math.cos(c)*L[1];n[id+'h']={p:[0,y,z]}}
function gWarts(R,bc,br,n,col,tex,rmin,rmax,zmin){
  const out=[];for(let i=0;i<n;i++){const th=R()*6.283,z=zmin+(1-zmin)*R(),s=Math.sqrt(1-z*z),p=[bc[0]+br[0]*s*Math.cos(th),bc[1]+br[1]*s*Math.sin(th),bc[2]+br[2]*z],q=rmin+(rmax-rmin)*R();
    out.push({t:'ell',c:p,r:[q,q*.85,q*.8],seg:[5,4],col,tex,uv:[1,1],rot:gNormRot(bc,br,p)})}return out;
}
function gBulkDef(name,o){
  o.eyes.forEach(e=>{e.r*=1.4;e.x*=1.15});
  {const kz=o.tall||1.25,kx=o.narrow||.78;o.bc=[o.bc[0],o.bc[1],o.bc[2]*kz];o.br=[o.br[0]*kx,o.br[1]*kx,o.br[2]*kz];o.eyes.forEach(e=>{e.x*=kx;e.z*=kz});if(o.mouth)o.mouth.z*=kz;o.armZ*=kz;o.armX*=kx;if(o.armY)o.armY*=kx;
    if(o.extra)o.extra=o.extra.map(p=>{const q=Object.assign({},p);if(q.c)q.c=[q.c[0]*kx,q.c[1]*kx,q.c[2]*kz];if(Array.isArray(q.r))q.r=[q.r[0]*kx,q.r[1]*kx,q.r[2]*kz];return q});
    if(o.kids)o.kids=o.kids.map(k=>Object.assign({},k,{pos:[k.pos[0]*kx,k.pos[1]*kx,k.pos[2]*kz]}));
    if(o.legs){o.L=[o.L[0]*kz,o.L[1]*kz,o.L[2]];o.legX*=kx;o.legY*=kx;o.stX*=kx;o.legZ*=kz}if(o.tail)o.tail=Object.assign({},o.tail,{pos:[o.tail.pos[0],o.tail.pos[1]*kx,o.tail.pos[2]*kz]})}
  const bz0=o.bc[2],R=hgtgR(o.seed||3),bc=o.bc,br=o.br,kids=[],legs=[],S=o.legs?{legs,L:o.L,bend:1,A:o.A||.9,H:.7,beta:o.legs===4?.75:.6,ankle:0,fz:.05}:null;
  const col=o.col,skin=o.skin;
  const parts=[{t:'ell',c:bc,r:br,seg:[18,12],tex:skin,col,uv:[1,1],texMax:512}].concat(o.extra||[]);
  if(o.face){const ez=o.eyes.reduce((s,e)=>s+e.z,0)/o.eyes.length,fw=br[0]*2.7,zc=ez-fw*.1;o.eyes.forEach((e,i)=>{e.lr=i<2?fw*.1:.01;e.x=(e.x<0?-1:1)*fw*.2;e.z=zc+fw*.17});parts.push({t:'ell',c:[0,gSurf(bc,br,0,zc-fw*.34)+.02,zc-fw*.34],r:[fw*.3,fw*.13,fw*.11],seg:[10,6],tex:skin,col},{t:'quad',c:[0,gSurf(bc,br,0,zc)+.12,zc],size:[fw,fw*.9],piv:[.5,.5],tex:'hgtb_bulk_face_'+o.face,alpha:true,col:[255,255,255],glow:.2,texMax:512});o.eyes.forEach(e=>e.r*=.04)}
  parts.push(...gWarts(R,bc,br,o.warts||6,o.wart||[255,235,225],skin,.22,.5,.05));
  gBulkEyes(bc,br,o.eyes,skin,col,kids);
  if(o.mouth){const m=o.mouth,y=gSurf(bc,br,m.x||0,m.z);parts.push({t:'ell',c:[m.x||0,y-.04,m.z],r:[m.w,.3,m.h],seg:[12,6],col:[100,45,80],rot:gNormRot(bc,br,[m.x||0,y,m.z])})}
  kids.push(...(o.kids||[]));
  for(const sd of[-1,1]){const id=sd<0?'aL':'aR';kids.push(gArm(id,[sd*(o.armX),o.armY||.4,o.armZ],sd,skin,col,o.AL||[1.7,1.5],o.AR||[.55,.42,.34]))}
  if(o.legs){const ys=o.legs===4?[o.legY,-o.legY]:[0];let k=0;for(let i=0;i<ys.length;i++)for(const side of[-1,1]){const g={id:'L'+k,hip:'hip'+k,foot:'ft'+k,hx:side*o.legX,hy:ys[i],hz:bz0+o.legZ,sx:side*o.stX,sy:ys[i]*(o.stY||1.1),ph:o.legs===4?{'-1_0':0,'1_0':.5,'-1_1':.75,'1_1':.25}[side+'_'+i]:(side<0?0:.5)};legs.push(g);
    kids.push({id:g.hip,pos:[g.hx,g.hy,g.hz],parts:[{t:'limb',id:g.id,len:o.L,rad:o.LR,col,tex:skin,sides:7}]},{id:g.foot,pos:[0,0,0],parts:[{t:'ell',c:[0,.15,.12],r:[o.LR[0]*1.1,o.LR[0]*1.5,o.LR[0]*.55],seg:[10,6],col:o.foot||col,tex:skin}]});k++}}
  if(o.tail)kids.push({id:'tail',pos:o.tail.pos,parts:[{t:'limb',id:'tailL',len:o.tail.L,rad:o.tail.R,col,tex:skin,sides:7}]});
  const bz=bc[2],AL=o.AL||[1.7,1.5];
  return hgtmDef(name,{rad:o.rad||11,foot:o.foot2||3,cycle:S?2*S.A/S.beta:6,speed:.28,root:{id:'root',kids:[{id:'body',pos:[0,0,0],parts,kids},gShadow(Math.max(br[0],br[1])*1.45)]},
    anim(t,st){const l={},n={},gz=gGaze(st,bz+br[2],48),ph=st.phase,wk=st.walk;let bob=Math.sin(t*.55+st.seed)*.07;
      if(S){bob+=Math.abs(Math.sin(ph*3.1416*(o.legs/2)))*.1*wk;gGait(S,st,bob,l,n)}
      const slp=HGTG.cur&&HGTG.cur.o&&HGTG.cur.o.sleep;n.body={p:[0,0,bob+(slp?Math.sin(t*.55)*.16:0)],r:[(slp?.1+Math.sin(t*.55)*.02:Math.sin(t*.4)*.012),0,S?Math.sin(ph*6.283)*.02*wk:Math.sin(t*.3+st.seed)*.015]};
      const bl=(HGTG.cur&&HGTG.cur.o&&HGTG.cur.o.sleep)?1:gBlink(t,st.seed);
      o.eyes.forEach((e,i)=>{n['e'+i+'b']={r:[gz.p*.35,0,gz.y*.28]};n['lid'+i]={p:[0,0,-e.lz*bl*.95]}});
      const w=gz.k*(Math.sin(t*1.3)*.5+.5);gArmPose('aL',AL,.25+Math.sin(t*.6)*.1,-.5-w*1.2,l,n);gArmPose('aR',AL,.25+Math.sin(t*.6+1)*.1,-.5,l,n);
      if(o.tail)l.tailL=[-1.0+Math.sin(t*.7)*.25,-.3+Math.sin(t*.7+1)*.3];
      if(o.extraAnim)o.extraAnim(t,st,l,n,gz);
      return{l,n,ro:{}}}});
}
gBulkDef('hgtg_bulk_mound',{face:'pink',seed:5,skin:gSkin('pink'),col:[255,225,235],bc:[0,0,4.3],br:[3.3,3.0,4.3],armX:3.0,armZ:5.2,
  eyes:[{x:-1.4,z:6.1,r:1.05,tex:gEyeT(2)},{x:1.4,z:6.1,r:1.05,tex:gEyeT(2)}],mouth:{z:3.6,w:1.1,h:.35},
  extra:[{t:'ell',c:[0,0,1.1],r:[4.3,4.0,1.4],seg:[16,8],tex:gSkin('pink'),col:[235,190,210],uv:[5,1]}],
  kids:[0,1,2].map(i=>({id:'td'+i,pos:[(i-1)*1.1,-.4,8.4],rot:[(i-1)*.1,0,0],parts:[{t:'limb',id:'tdL'+i,up:true,len:[1.5],rad:[.14,.07],col:[255,200,230]},{t:'ell',c:[0,0,1.62],r:[.22,.22,.22],seg:[8,6],col:[255,235,170],glow:.9}]})),
  extraAnim(t,st,l,n){for(let i=0;i<3;i++)n['td'+i]={r:[Math.sin(t*.9+i)*.15,0,Math.sin(t*.7+i*1.7)*.2]}}});
gBulkDef('hgtg_bulk_lilac',{face:'lilac',seed:7,skin:gSkin('lilac'),col:[240,225,255],bc:[0,0,5.4],br:[3.3,4.2,3.3],tu:5,tv:3,armX:3.0,armY:1.6,armZ:5.9,
  eyes:[{x:-1.0,z:7.3,r:.95,tex:gEyeT(3)},{x:1.0,z:7.3,r:.95,tex:gEyeT(3)}],mouth:{z:5.2,w:1.2,h:.3},
  legs:4,L:[1.9,1.9,.5],LR:[.95,.8,.7,.6],legX:2.2,legY:2.3,legZ:-2.2,stX:2.7,stY:1.1,A:.9,foot:[220,190,240],rad:12,foot2:3.4,
  tail:{pos:[0,-3.9,4.2],L:[2.2,2.0],R:[1,.6,.25]},
  kids:[{id:'frill',pos:[0,2.4,6.6],parts:[{t:'fan',c:[0,0,0],n:13,layers:2,len:3.1,wid:1.5,base:.1,spread:3.3,tex:'hgtb_feather_down',col:[215,185,255],shimmer:[.05,1.2]}]}],
  extraAnim(t,st,l,n){n.frill={r:[-.35+Math.sin(t*.4)*.04,0,0]}}});
gBulkDef('hgtg_bulk_amber',{face:'amber',seed:11,skin:gSkin('amber'),col:[255,235,205],bc:[0,0,7.3],br:[3.0,3.0,4.6],tu:4,tv:4,armX:2.8,armZ:8.2,wart:[255,220,150],
  eyes:[{x:-1.3,z:8.6,r:1.1,tex:gEyeT(5)},{x:1.3,z:8.6,r:1.1,tex:gEyeT(5)}],mouth:{z:6.0,w:1.3,h:.3},
  legs:2,L:[2.3,2.3,.6],LR:[1.1,.95,.8,.7],legX:1.7,legY:0,legZ:-3.6,stX:1.8,A:.9,foot:[200,150,80],rad:11,foot2:3,
  extra:[0,1,2,3,4].map(i=>({t:'ell',c:[0,-2.4,10.4-i*1.1],r:[.45,.9,.55],seg:[8,5],tex:'art_tex_hgtb_scales',col:[255,215,140],rot:[.4,0,0]})),
  kids:[-1,1].map(s=>({id:'hn'+s,pos:[s*1.5,.5,11.3],parts:[{t:'limb',id:'hnL'+s,up:true,len:[1.5,1.2,1],rad:[.4,.3,.18,.05],col:[245,215,160],tex:'art_tex_hgtb_limbs',rest:[s*.3,.5,.5]}]}))});
(function(){
  const kids=[],N=16,bc=[0,0,5.2],br=[3.6,3.6,4.0];
  for(let i=0;i<N;i++){const a=i/N*6.283;kids.push({id:'tn'+i,pos:[Math.cos(a)*3.5,Math.sin(a)*3.5,2.5],rot:[.5,0,a-1.5708],parts:[{t:'limb',id:'tnL'+i,len:[2.1,1.7],rad:[.38,.25,.08],col:[190,245,235],tex:gSkin('aqua'),sides:5,noball:true}]})}
  gBulkDef('hgtg_bulk_aqua',{face:'aqua',seed:13,skin:gSkin('aqua'),col:[215,255,250],bc,br,armX:3.5,armZ:5.4,tu:5,tv:3,wart:[170,235,225],
    eyes:[{x:0,z:6.4,r:1.4,tex:gEyeT(4)},{x:-2.3,z:4.6,r:.85,tex:gEyeT(2)},{x:2.3,z:4.6,r:.85,tex:gEyeT(2)}],mouth:{z:3.4,w:1.0,h:.3},
    extra:[{t:'ell',c:[0,0,1.5],r:[3.9,3.9,1.5],seg:[16,8],tex:gSkin('aqua'),col:[190,245,235],uv:[5,1]}].concat([0,1,2,3,4,5,6,7].map(i=>({t:'ell',c:[Math.cos(i*.8)*2.6,Math.sin(i*.8)*2.6,1.2+(i%3)*.7],r:[.5,.5,.4],seg:[7,5],tex:'art_tex_hgtb_scales',col:[230,255,245]}))),
    kids,extraAnim(t,st,l,n){for(let i=0;i<N;i++)l['tnL'+i]=[Math.sin(t*.8+i*.7)*.35,Math.sin(t*.8+i*.7+1)*.4]}});
})();


/* ==========================================================================
   WINGED CREATURES: moth, bell-moth, bat, butterfly, dragonfly
   ========================================================================== */
/* one wing: flap node id (pos), flat node id+'a' (inner half), outer half node id+'o'; uv = sub rectangle of the picture whose attachment is on its left */
function gWing(id,side,w,h,tex,uv,pos,o){
  o=o||{};const u0=uv[0],v0=uv[1],u1=uv[2],v1=uv[3],du=(u1-u0)/3,ww=w/3,vc=o.vein||[80,55,90];
  const sec=k=>{const a=u0+du*k,b=a+du;return{t:'quad',c:[0,0,0],size:[ww*1.04,h],piv:side<0?[1,.5]:[0,.5],uv:side<0?[b,v0,a,v1]:[a,v0,b,v1],tex,alpha:true,col:o.col||[255,255,255],glow:o.glow===undefined?.3:o.glow,texMax:256}};
  const vein=k=>({t:'quad',c:[side*ww*.5,0,h*(k===0?.46:.44)],size:[ww,h*.045],piv:[.5,.5],col:vc,glow:0,alpha:false}),spar=k=>({t:'quad',c:[side*ww*.5,0,0],size:[ww,h*.02],piv:[.5,.5],col:vc,glow:0});
  const lay=k=>[sec(k),Object.assign({},sec(k),{c:[0,.05,0],col:[205,185,225],glow:.15}),vein(k),spar(k)];
  const tipN={id:id+'p',pos:[side*ww,0,0],rot:[0,0,-side*.14],parts:lay(2)};
  const midN={id:id+'o',pos:[side*ww,0,0],rot:[0,0,-side*.1],parts:lay(1),kids:[tipN]};
  return{id,pos,kids:[{id:id+'a',rot:[-1.5708,0,0],parts:lay(0),kids:[midN]}]};
}
function gWingPose(n,id,side,A,F){n[id]={r:[0,-side*A,0]};n[id+'o']={r:[0,0,-side*F]};n[id+'p']={r:[0,.06*Math.sin(F*3),-side*F*1.3]}}
function gBank(st,rate){
  const I=HGTG.cur;if(!I)return 0;const g=I.g||(I.g={}),t=G.time,dt=hgtgClamp(t-(g.bt||t),0,.1);g.bt=t;
  if(dt>0){const dy=hgtgWrap(I.yaw-(g.py===undefined?I.yaw:g.py))/dt;g.py=I.yaw;g.bk=(g.bk||0)+(hgtgClamp(dy*(rate||1.3),-.55,.55)-(g.bk||0))*Math.min(1,dt*2)}
  return g.bk||0;
}
function gWinged(name,o){
  const T=o.type,kids=[],parts=[],sk=o.skin||gSkin('amber'),col=o.col||[255,235,200];
  let wspan=o.w||1,wh=o.h||1.4,tex=o.wing||'hgtb_wing_butterfly',uvs=[[0,0,1,1]],wpos=[.1,.1,.1];
  const hc=[0,.36,.03],hr=[.1,.11,.1];
  const head=(er,etex,rr)=>{const nodes=[];for(const sd of[-1,1]){const x=sd*hr[0]*.85,z=.02,y=gSurf(hc,hr,x,z);nodes.push(gEye(sd<0?'eL':'eR',[x,y,z],er,etex,gNormRot(hc,hr,[x,y,z]),{bulge:er*.8,seg:12,rings:4,lip:rr||[60,40,50]}))}return nodes};
  if(T==='moth'){
    parts.push({t:'ell',c:[0,.04,0],r:[.15,.28,.14],seg:[12,8],tex:sk,col,uv:[1,1]},{t:'ell',c:[0,-.42,-.03],r:[.12,.36,.12],seg:[12,8],tex:sk,col,uv:[1,2]},{t:'ell',c:hc,r:hr,seg:[10,8],tex:sk,col});
    kids.push(...head(.07,gEyeT(6)));
    for(const sd of[-1,1])parts.push({t:'limb',id:'an'+sd,up:true,len:[.3,.25],rad:[.014,.01,.004],c:[sd*.04,.42,.1],noball:true,col:[255,225,200],rest:[-.5,.7]},{t:'fan',c:[sd*.07,.45,.12],n:4,len:.2,wid:.05,base:.01,spread:.7,tex:'hgtb_feather_iridescent',col:[255,240,230]});
  }else if(T==='bellmoth'){
    tex='hgtb_wing_insect';wspan=.95;wh=.95*256/254;
    parts.push({t:'ell',c:[0,.05,0],r:[.1,.2,.1],seg:[10,8],tex:sk,col:[255,240,200],uv:[1,1]},{t:'ell',c:hc,r:hr,seg:[10,8],tex:sk,col:[255,240,200]},
      {t:'limb',id:'stalk',len:[.25],rad:[.025,.02],c:[0,-.15,-.05],noball:true,col:[210,180,110],up:false},
      {t:'ell',c:[0,-.2,-.42],r:[.2,.2,.3],seg:[14,10],col:[255,205,110],glow:.5},{t:'ell',c:[0,-.2,-.75],r:[.045,.045,.06],seg:[8,6],col:[255,250,210],glow:1},{t:'ell',c:[0,-.2,-.17],r:[.2,.2,.05],seg:[14,4],col:[220,160,70]});
    kids.push(...head(.07,gEyeT(6)));
    for(const sd of[-1,1])parts.push({t:'limb',id:'an'+sd,up:true,len:[.3,.25],rad:[.014,.01,.004],c:[sd*.04,.42,.1],noball:true,col:[255,225,200],rest:[-.5,.7]});
  }else if(T==='butterfly'){
    wspan=.85;wh=.85*256/170;
    parts.push({t:'ell',c:[0,.05,0],r:[.06,.24,.06],seg:[10,6],tex:sk,col:[60,40,50]},{t:'ell',c:[0,-.32,0],r:[.045,.3,.045],seg:[10,6],col:[60,40,50]},{t:'ell',c:hc,r:[.07,.07,.07],seg:[8,6],col:[60,40,50]});
    kids.push(...head(.045,gEyeT(6)));
    for(const sd of[-1,1])parts.push({t:'limb',id:'an'+sd,up:true,len:[.35,.3],rad:[.008,.006,.004],c:[sd*.03,.4,.05],noball:true,col:[60,40,50],rest:[-.3,.6]},{t:'ell',c:[sd*.03+sd*.0,.62,.38],r:[.025,.04,.025],seg:[6,4],col:[255,230,140],glow:.7});
  }else if(T==='bat'){
    tex='hgtb_wing_bat';wspan=1.3;wh=1.3*256/367;wpos=[.17,.1,.08];
    parts.push({t:'ell',c:[0,0,0],r:[.2,.3,.18],seg:[14,10],tex:gSkin('lilac'),col:[200,170,220],uv:[1,1]},{t:'ell',c:[0,.4,.02],r:[.14,.15,.13],seg:[12,8],tex:gSkin('lilac'),col:[200,170,220]},{t:'ell',c:[0,.55,-.02],r:[.07,.08,.06],seg:[8,6],col:[120,70,110]},
      {t:'ell',c:[-.09,.36,.17],r:[.05,.03,.13],rot:[0,-.3,0],seg:[8,5],col:[190,150,210]},{t:'ell',c:[.09,.36,.17],r:[.05,.03,.13],rot:[0,.3,0],seg:[8,5],col:[190,150,210]});
    kids.push(...head(.06,gEyeT(1),[90,60,80]));
    for(const sd of[-1,1])parts.push({t:'limb',id:'lg'+sd,len:[.28,.22],rad:[.035,.025,.015],c:[sd*.1,-.28,-.12],col:[190,150,205],rest:[-.5,.6]});
  }else if(T==='dragonfly'){
    tex='hgtb_wing_insect';uvs=[[0,0,1,.53],[0,.47,1,1]];wspan=1.15;wh=.58;
    parts.push({t:'ell',c:[0,.05,0],r:[.1,.22,.1],seg:[10,8],tex:gSkin('aqua'),col:[200,255,240],uv:[1,1]},{t:'ell',c:[0,.32,0],r:[.12,.1,.11],seg:[10,8],col:[170,245,235]},
      );
    kids.push({id:'abdn',pos:[0,-.15,0],rot:[-1.5708,0,0],parts:[{t:'limb',id:'abd',len:[.3,.3,.3,.3,.3],rad:[.07,.05,.04,.033,.027,.02],col:[130,235,225],tex:gSkin('aqua'),sides:5}]});
    kids.push(...head(.095,gEyeT(6)));
  }
  const wnodes=[];
  for(const sd of[-1,1])for(let i=0;i<uvs.length;i++)wnodes.push(gWing('w'+(sd<0?'L':'R')+i,sd,wspan,wh,tex,uvs[i],[sd*wpos[0]*.5,wpos[1]-i*.22,wpos[2]],{glow:o.wglow,col:o.wcol}));
  kids.push(...wnodes);
  const nw=uvs.length,def=hgtmDef(name,{rad:Math.max(1.4,wspan*1.2),foot:.01,cycle:1,speed:.9,root:{id:'root',kids:[{id:'body',pos:[0,0,0],parts,kids}]},
    anim(t,st){
      const n={},l={},sc=st.sc,f=(o.freq||2.2)/Math.sqrt(sc),bank=gBank(st),sd=st.seed,env=hgtgSm(-.1,.35,Math.sin(t*.42+sd)),ph=t*f*6.283;
      for(const sdn of[-1,1])for(let i=0;i<nw;i++){const q=ph+(i?o.hind||.6:0)+(T==='dragonfly'?(i?3.14:0):0),A=(o.dih||.35)*(1-env*.6)+(o.amp||.7)*env*Math.sin(q),F=(o.flex||.55)*env*Math.sin(q-.9)+.12;gWingPose(n,'w'+(sdn<0?'L':'R')+i,sdn,A,F)}
      n.body={p:[0,0,Math.sin(ph*.5)*.03*env],r:[Math.sin(t*.6+sd)*.05-.08*env*Math.cos(ph),bank,0]};
      if(T==='dragonfly')l.abd=[Math.sin(t*1.1)*.12,Math.sin(t*1.1+.6)*.1,Math.sin(t*1.1+1.2)*.08,Math.sin(t*1.1+1.8)*.06,Math.sin(t*1.1+2.4)*.05];
      for(const k of[-1,1])if(parts.some(p=>p.id==='an'+k))l['an'+k]=[-.5+Math.sin(t*1.7+k)*.15,.7+Math.sin(t*1.3+k)*.1];
      if(T==='moth'||T==='butterfly'||T==='bat'){const g=gGaze(st,.4,24);n.eLb={r:[g.p*.3,0,g.y*.2]};n.eRb={r:[g.p*.3,0,g.y*.2]}}
      if(T==='bellmoth')n.body.r[0]+=Math.sin(t*.9)*.05;
      return{n,l,ro:{}}}});
  return def;
}
gWinged('hgtg_moth',{type:'moth',w:1,wing:'hgtb_wing_butterfly',freq:1.9,amp:.65,hind:.5});
gWinged('hgtg_bellmoth',{type:'bellmoth',freq:2.4,amp:.55,wglow:.4});
gWinged('hgtg_bat',{type:'bat',freq:1.5,amp:.6,flex:.5,dih:.25});
gWinged('hgtg_butterfly',{type:'butterfly',freq:2.0,amp:.8,hind:.3});
gWinged('hgtg_dragonfly',{type:'dragonfly',freq:3.4,amp:.45,flex:.2,dih:.1,wglow:.45});

/* ==========================================================================
   PEACOCKS (about 1.7 cells tall, train fan of eyed feathers)
   ========================================================================== */
function gPeacockDef(name,o){
  const hh=.82,L=[.34,.32,.1],legs=[{id:'L0',hip:'hip0',foot:'ft0',hx:-.1,hy:0,hz:-.2,sx:-.1,sy:0,ph:0},{id:'L1',hip:'hip1',foot:'ft1',hx:.1,hy:0,hz:-.2,sx:.1,sy:0,ph:.5}];
  const S={legs,L,bend:1,A:.15,H:.1,beta:.6,ankle:0,fz:.02},kids=[],body=o.body,neck=o.neck;
  const parts=[{t:'ell',c:[0,0,0],r:[.24,.48,.24],rot:[.28,0,0],seg:[16,12],tex:gSkin('aqua'),col:body,uv:[2,2]},{t:'ell',c:[0,.22,.06],r:[.2,.3,.2],seg:[14,10],col:neck,glow:.12},
    {t:'ell',c:[-.19,-.06,.03],r:[.06,.32,.17],rot:[.3,0,.12],seg:[10,6],tex:'art_tex_hgtb_scales',col:o.wing},{t:'ell',c:[.19,-.06,.03],r:[.06,.32,.17],rot:[.3,0,-.12],seg:[10,6],tex:'art_tex_hgtb_scales',col:o.wing}];
  for(const g of legs){kids.push({id:g.hip,pos:[g.hx,g.hy,g.hz],parts:[{t:'limb',id:g.id,len:L,rad:[.04,.026,.018,.012],col:[170,140,95],sides:5}]},
    {id:g.foot,pos:[0,0,0],parts:[{t:'ell',c:[0,.06,0],r:[.035,.1,.012],seg:[6,4],col:[170,140,95]},{t:'ell',c:[-.05,.05,0],r:[.015,.08,.01],rot:[0,0,.5],seg:[5,3],col:[170,140,95]},{t:'ell',c:[.05,.05,0],r:[.015,.08,.01],rot:[0,0,-.5],seg:[5,3],col:[170,140,95]}]})}
  const hc=[0,.04,0],hr=[.07,.1,.065],eyes=[];
  for(const sd of[-1,1]){const x=sd*.06,z=.015,y=gSurf(hc,hr,x,z)+.0;eyes.push(gEye(sd<0?'eL':'eR',[x,y,z],.03,gEyeT(4),gNormRot(hc,hr,[x,y,z]),{bulge:.025,seg:10,rings:3,lip:[40,60,100]}))}
  const head={id:'head',pos:[0,0,0],parts:[{t:'ell',c:hc,r:hr,seg:[10,8],col:neck,glow:.12},{t:'ell',c:[0,.0,.04],r:[.075,.06,.03],seg:[8,5],col:[250,250,255]},
    {t:'limb',id:'beak',len:[.11],rad:[.035,.005],c:[0,.1,-.015],noball:true,col:[215,190,130],sides:5,rot:[1.45,0,0]},
    {t:'fan',c:[0,0,.07],n:9,len:.2,wid:.055,base:.008,spread:1.1,tex:'hgtb_feather_iridescent',col:o.crest||[90,160,255]}],kids:eyes};
  const nk=gChain('pk',4,.2,.105,.055,{col:neck,sides:7,curve:[-.5,.5,.5,-.5]},head);nk.pos=[0,.38,.12];kids.push(nk);
  kids.push({id:'tail',pos:[0,-.42,.02],rot:[1.25,0,0],parts:[
    {t:'fan',c:[0,0,0],n:15,layers:2,len:1.35,wid:.45,base:.03,spread:2.4,tex:o.fa,vcol:[[150,180,170],[255,255,255],[255,255,255]],col:[255,255,255],shimmer:[.03,2],tag:'sh'},
    {t:'fan',c:[0,-.025,0],n:13,layers:1,len:1.2,wid:.4,base:.03,spread:2.2,tex:o.fb,vcol:[[150,180,170],[255,255,255],[255,255,255]],col:[255,255,255],shimmer:[.03,2.4],tag:'sh'},
    {t:'fan',c:[0,-.05,0],n:9,layers:1,len:1.55,wid:.16,base:.02,spread:2.0,tex:'hgtb_feather_iridescent',col:o.back||[140,230,200],shimmer:[.04,1.6]}]});
  return hgtmDef(name,{rad:2.6,foot:.9,cycle:2*S.A/S.beta,speed:.2,root:{id:'root',kids:[{id:'body',pos:[0,0,hh],parts,kids},gShadow(1.1)]},
    anim(t,st){const wk=st.walk,ph=st.phase,l={},n={},I=HGTG.cur,g=I&&I.g||{},a=g.fan||0,gz=gGaze(st,1.7,12),bob=Math.abs(Math.sin(ph*3.1416))*.02*wk;
      const rs=0;S.fz=.02+.2*rs;gGait(S,st,hh+bob+.2*rs,l,n);n.body={p:[0,0,bob+.2*rs],r:[Math.sin(t*.5)*.015,0,Math.sin(ph*6.283)*.03*wk]};n.plinth={p:[0,0,.3*rs]};
      for(let i=0;i<4;i++)n['pk'+i]={r:[Math.sin(ph*6.283*2+i)*.1*wk*(i&1?1:-1)+(i?gz.p*.25:0)+Math.sin(t*.7+i)*.04,0,(i>1?gz.y*.35:0)+Math.sin(t*.5+i*.6)*.04]};
      n.head={r:[gz.p*.3,0,gz.y*.2]};n.eLb={r:[gz.p*.15,0,gz.y*.1]};n.eRb={r:[gz.p*.15,0,gz.y*.1]};
      const open=hgtgSm(0,1,a),rx=1.25*(1-open)+.12*open,sw=Math.sin(t*1.3)*.02*open;
      n.tail={r:[rx,sw,Math.sin(t*.45)*.05]};
      const sh=.5+.5*Math.sin(t*1.1);for(const P of HGTM.models[name].parts)if(P.def.tag==='sh'){P.col=[255-30*sh,255-10*sh,255-40*(1-sh)]}
      return{l,n,ro:{},fs:.22+.78*open,fl:.85+.15*open}}});
}
gPeacockDef('hgtg_peacock',{body:[40,110,235],neck:[30,120,225],wing:[200,170,110],fa:'hgtb_feather_peacock1',fb:'hgtb_feather_peacock2',crest:[80,150,255]});
gPeacockDef('hgtg_peacock_green',{body:[40,180,120],neck:[40,170,110],wing:[215,190,100],fa:'hgtg_feather_green1',fb:'hgtg_feather_green2',crest:[90,230,150],back:[160,240,120]});
gPeacockDef('hgtg_peacock_white',{body:[245,245,255],neck:[240,240,255],wing:[230,230,245],fa:'hgtg_feather_white1',fb:'hgtg_feather_white2',crest:[255,255,255],back:[240,230,255],fanq:[240,240,255]});


/* ==========================================================================
   ANGELFISH (real 3D: a slim body core with the painted fish on both flanks cut into strips that bend in a travelling wave, hanging pelvic streamers)
   ========================================================================== */
const HGTG_FCORE={pearl:[240,232,222],aqua:[150,225,240],rose:[240,170,200],gold:[240,205,110],violet:[190,160,240],bw:[225,225,235],glow:[130,255,230]};
function gSchoolDef(name,o){
  const R=hgtgR(o.seed||1),N=o.n||1,S=6,FH=1.19,kids=[],fish=[];
  for(let f=0;f<N;f++){
    const tint=o.tints[f%o.tints.length],tex='hgtg_fish_'+tint,gl=tint==='glow'?.55:.14,core=HGTG_FCORE[tint]||[230,230,230];
    const p=N>1?[(R()-.5)*3.2,(R()-.5)*4.4+(f-N/2)*.3,(R()-.5)*1.5]:[0,0,0],ph=[R()*6.28,R()*6.28,R()*6.28];
    const strip=k=>{const x0=k/S,x1=(k+1)/S,wq=1/S*1.08,N0={id:'F'+f+'s'+k,pos:[0,k?-1/S:.5,0],parts:[],kids:[]};
      for(const sd of[-1,1])N0.parts.push({t:'quad',c:[0,sd*.032,0],size:[wq,FH],piv:[0,.5],rot:[0,0,-1.5708],uv:[x0,0,x1,1],tex,alpha:true,glow:gl,col:o.col||[255,255,255],texMax:256});
      if(k>=1&&k<=3){const rz=[.31,.26,.18][k-1];N0.parts.push({t:'ell',c:[0,-.5/S,0],r:[.027,.72/S,rz],seg:[8,5],col:core,glow:gl,tex:tint==='bw'?'art_tex_hgtb_angel_banded':undefined})}
      if(k===S-1)for(const zz of[-.1,.12])N0.parts.push({t:'quad',c:[0,0,zz],size:[.8,.035],piv:[1,.5],rot:[0,0,-1.5708],col:core,glow:gl+.1,alpha:false});
      if(k===1)N0.kids.push({id:'F'+f+'p',pos:[0,-.04,-.22],parts:[{t:'quad',c:[0,0,0],size:[.07,.62],piv:[.5,1],rot:[0,0,-1.5708],tex:'hgtb_feather_iridescent',alpha:true,col:o.col||[255,255,255],glow:gl+.1},{t:'quad',c:[0,0,0],size:[.05,.5],piv:[.5,1],rot:[0,0,-1.5708],tex:'hgtb_feather_iridescent',alpha:true,col:o.col||[255,255,255],glow:gl+.1}]});
      if(k<S-1)N0.kids.push(strip(k+1));return N0};
    const root=strip(0);kids.push({id:'F'+f,pos:p,kids:[root]});fish.push({ph,p});
  }
  return hgtmDef(name,{rad:N>1?4:1.3,foot:.01,cycle:1,speed:.9,root:{id:'root',kids},
    anim(t,st){const n={},fq=.85/Math.sqrt(st.sc),I0=HGTG.cur,cam0=HGTM.cam;let bs=0;if(I0&&cam0&&N>0){const ps=Math.atan2(-(cam0.cx-I0.x),cam0.cy-I0.y),a1=hgtgWrap(ps+1.5708-I0.yaw),a2=hgtgWrap(ps-1.5708-I0.yaw),o1=Math.abs(a1)<Math.abs(a2)?a1:a2;bs=hgtgClamp(o1,-1,1)*.6}
      fish.forEach((F,f)=>{const q=F.ph,tt=t;
        n['F'+f]={p:N>1?[Math.sin(tt*.7+q[0])*.35,Math.sin(tt*.5+q[1])*.5,Math.sin(tt*.9+q[2])*.25]:[0,0,Math.sin(tt*.6)*.03],r:[Math.sin(tt*.8+q[1])*.06,Math.sin(tt*.6+q[2])*.05,bs+(N>1?Math.sin(tt*.6+q[0])*.22:0)]};
        for(let k=0;k<S;k++)n['F'+f+'s'+k]={r:[0,0,.3*(.2+.8*k/(S-1))*Math.sin(6.283*fq*tt-k*.95+q[0])]};
        n['F'+f+'p']={r:[Math.sin(tt*1.4+q[1])*.2,0,Math.sin(tt*1.1+q[2])*.12]}});
      return{n,l:{},ro:{}}}});
}
for(const k of Object.keys(HGTG_FISHCOL))gSchoolDef('hgtg_angel_'+k,{n:1,tints:[k],seed:3});
function hgtgSchool(level,o){ // o: {route:[[x,y,z]..], n, scale, tints, seed, speed}
  hgtgVariants();const key='hgtg_school_'+level+'_'+(o.seed||1)+'_'+(HGTG.sn=(HGTG.sn||0)+1);const b=HGTG.building;HGTG.building=true;
  gSchoolDef(key,{n:o.n||5,tints:o.tints||['pearl'],seed:o.seed||1});HGTG.building=b;HGTG.kind[key]='fish';
  return hgtgSpawn(key,{level,route:o.route,scale:o.scale||1,speed:o.speed||.6,seed:o.seed||1});
}

/* ==========================================================================
   PLANETS (12 painted maps; some glow, some with rings and moons)
   ========================================================================== */
const HGTG_PLANETS={orange:[1.0,{atmo:[255,170,90],spin:.3}],ocean:[1.25,{atmo:[120,180,255],spin:.25,moon:{r:.22,orbit:2.2,period:34,col:[205,205,215]}}],gas:[1.5,{spin:.5,tilt:.3,ring:{in:1.35,out:2.2,col:[225,200,150],alpha:.8}}],
  pearl:[.8,{glow:.3,atmo:[255,240,255],spin:.2}],jade:[.9,{atmo:[120,255,190],spin:.35,moon:{r:.18,orbit:2.0,period:26,col:[190,240,210]}}],violet:[1.05,{atmo:[190,140,255],spin:.3}],
  ice:[.7,{spin:.4,tilt:.45,ring:{in:1.4,out:2.1,col:[205,230,250],alpha:.75}}],lava:[.8,{glow:.55,atmo:[255,120,50],spin:.25}],desert:[1.1,{spin:.3,moon:{r:.2,orbit:2.3,period:30,col:[230,200,160]}}],
  cratered:[.6,{spin:.2}],crystal:[.8,{glow:.4,atmo:[160,255,255],spin:.4,ring:{in:1.3,out:1.8,col:[190,240,255],alpha:.7}}],coral:[1.0,{atmo:[255,150,170],spin:.3}]};
for(const k in HGTG_PLANETS){HGTG_PLANETS[k][0]*=1.5;hgtmPlanet('hgtg_planet_'+k,'hgt_planet_'+k,HGTG_PLANETS[k][0],Object.assign({gain:/jade|violet|ice|lava/.test(k)?1.7:1.3},HGTG_PLANETS[k][1],{glow:(HGTG_PLANETS[k][1].glow||0)+(/jade|violet|ice|lava/.test(k)?.2:.08)}))}
HGTG.planetKeys=Object.keys(HGTG_PLANETS);
function hgtgPlanetTick(I){const m=HGTG.moonI;I.o.light=m&&m.o.far?[m.x-I.x,m.y-I.y,m.pz-(I.pz||0)]:null;if(!I.o.light)delete I.o.light}
function hgtgPlanetSpawn(level,key,route,speed,seed){return hgtmSpawn('hgtg_planet_'+key,{level,route,speed:speed||.5,seed:seed||1,tick:hgtgPlanetTick})}

/* ==========================================================================
   BEHAVIOUR: kinds, spawn wrapper, per-instance tick (idle pauses, smooth speed, reactions)
   ========================================================================== */
for(const n of['hgtg_stilt4','hgtg_stilt6','hgtg_stilt_heron'])HGTG.kind[n]='stilt';
for(const n of['hgtg_bulk_mound','hgtg_bulk_lilac','hgtg_bulk_amber','hgtg_bulk_aqua'])HGTG.kind[n]='bulk';
for(const n of['hgtg_moth','hgtg_bellmoth','hgtg_bat','hgtg_butterfly','hgtg_dragonfly'])HGTG.kind[n]='wing';
for(const n of['hgtg_peacock','hgtg_peacock_green','hgtg_peacock_white'])HGTG.kind[n]='peacock';
for(const k of Object.keys(HGTG_FISHCOL))HGTG.kind['hgtg_angel_'+k]='fish';
HGTG.height={hgtg_stilt4:14,hgtg_stilt6:14,hgtg_stilt_heron:14,hgtg_bulk_mound:11.5,hgtg_bulk_lilac:11.5,hgtg_bulk_amber:15,hgtg_bulk_aqua:12,hgtg_peacock:1.7,hgtg_peacock_green:1.7,hgtg_peacock_white:1.7};
function hgtgTick(I,dt){
  const o=I.o,k=o.hgk,g=I.g||(I.g={}),cam=HGTM.cam,t=G.time;
  if(!g.R){g.R=hgtmRnd((I.seed|0)*31+7);g.mode=1;g.nt=t+g.R()*20;g.sm=1}
  if(k==='wing'||k==='fish'){g.sm=.85+.25*Math.sin(t*.2+I.seed);o.speedMul=g.sm;return}
  const d=cam?Math.hypot(cam.cx-I.x,cam.cy-I.y):99;
  if(t>g.nt){g.mode=g.mode?0:1;g.nt=t+(g.mode?(k==='peacock'?6:25)+g.R()*(k==='peacock'?14:45):(k==='peacock'?8:8)+g.R()*(k==='peacock'?25:22))}
  let tg=g.mode?1:.001;
  if(k==='peacock'){const near=d<32;g.fan=hgtgClamp((g.fan||0)+(near?.22:-.12)*dt,0,1);if(near){tg=.001;if(g.fan>.15){const w=hgtgWrap(Math.atan2(cam.cx-I.x,-(cam.cy-I.y))-I.yaw);I.yaw+=w*Math.min(1,dt*.7)}}}
  else if(d<(o.foot||I.M.foot*I.sc)*1.7)tg=.001;
  if(tg<.01){I.sp=0;I.walk*=.8}
  g.sm+=(tg-g.sm)*Math.min(1,dt*.5);o.speedMul=Math.max(.001,g.sm);
  if(o.over){const inf=HGTG.info[LEVEL];if(inf){const x=I.x|0,y=I.y|0;if(x>=0&&y>=0&&x<inf.W&&y<inf.H)o.h=Math.max(inf.top[y*inf.W+x],inf.h[y*inf.W+x])}}
}
function hgtgSpawn(name,o){
  o=o||{};hgtgVariants();const k=HGTG.kind[name]||'';o.hgk=k;if(o.scale===undefined)o.scale=1;if(o.minD===undefined&&k==='bulk')o.minD=10;if(o.minD===undefined&&k==='stilt')o.minD=6;
  if(k==='wing'||k==='fish'||k==='levi'){o.fly=true;o.foot=.01}
  if(k==='stilt'&&o.over===undefined)o.over=false;
  if(!o.tick&&(k==='stilt'||k==='bulk'||k==='peacock'||k==='wing'||k==='fish'))o.tick=hgtgTick;
  if(o.seed===undefined)o.seed=1+((Math.random()*9000)|0);
  return hgtmSpawn(name,o);
}

HGTG.building=false;

/* leaning mesh spires for the rim of the cities (scenery, static): hgtg_spire_pink, hgtg_spire_aqua, hgtg_spire_lilac, about 24 cells tall */
function gSpireDef(name,skin,col){
  const N=5,seg=5.2,lean=[.03,.08,.12,.14,.16],mk=i=>{const r0=3.4-i*.62,r1=3.4-(i+1)*.62+.1;const nd={id:'sp'+i,pos:i?[0,0,seg]:[0,0,0],rot:[lean[i]*(i?1:.4),0,i%2?.05:-.05],parts:[{t:'limb',id:'spL'+i,up:true,len:[seg],rad:[Math.max(.3,r0),Math.max(.25,r1)],sides:8,col,tex:skin,noball:true},
    {t:'ell',c:[0,0,seg],r:[Math.max(.3,r1)*1.7,Math.max(.3,r1)*1.7,.28],seg:[10,4],col:[250,235,245],glow:.35},{t:'ell',c:[Math.max(.3,r1)*.7,Math.max(.3,r1)*.5,seg*.55],r:[.38,.12,.6],seg:[5,4],col:[255,225,150],glow:.9}],kids:[]};
    if(i<N-1)nd.kids.push(mk(i+1));else nd.kids.push({id:'spt',pos:[0,0,seg],parts:[{t:'limb',id:'spTL',up:true,len:[3.2],rad:[.3,.05],sides:5,noball:true,col:[250,240,215]},{t:'ell',c:[0,0,3.4],r:[.55,.55,.55],seg:[7,5],col:[255,230,160],glow:1}]});return nd};
  return hgtmDef(name,{rad:16,foot:.01,cycle:1,speed:0,root:{id:'root',kids:[mk(0)]},anim(t,st){return{n:{},l:{},ro:{}}}});
}
{const b=HGTG.building;HGTG.building=true;gSpireDef('hgtg_spire_pink',gSkin('pink'),[255,225,235]);gSpireDef('hgtg_spire_aqua',gSkin('aqua'),[215,255,250]);gSpireDef('hgtg_spire_lilac',gSkin('lilac'),[240,225,255]);HGTG.building=b}
for(const n of['hgtg_spire_pink','hgtg_spire_aqua','hgtg_spire_lilac'])HGTG.kind[n]='spire';
HGTG.height.hgtg_spire_pink=HGTG.height.hgtg_spire_aqua=HGTG.height.hgtg_spire_lilac=24;

/* ==========================================================================
   LEVEL ANALYSIS, ROUTES AND THE AUTOMATIC POPULATION
   ========================================================================== */
function hgtgInfo(id){
  const L=LEVELS[id];if(!L||!L.terrace)return null;let I=HGTG.info[id];if(I&&I.L===L&&I.rev===(L.terrace.rev||0))return I;
  const rows=L.rows,H=rows.length,W=rows[0].length,N=W*H,h=L.terrace.h,t=L.terrace,chars=L.chars||{},wc={};
  const whOf=ch=>{let v=wc[ch];if(v!==undefined)return v;const g=chars[ch];v=(g!==undefined&&g>=100&&T_TILE[g]!==undefined&&TEX[T_TILE[g]])?(TEX[T_TILE[g]].wh||(L.ceilH||CEILH)):(L.ceilH||CEILH);return wc[ch]=v};
  const open=new Uint8Array(N),bad=new Uint8Array(N),top=new Float32Array(N),D=new Int16Array(N),flat=new Uint8Array(N);let zmax=-1e9,x0=W,x1=0,y0=H,y1=0;
  for(let y=0;y<H;y++){const r=rows[y];for(let x=0;x<W;x++){const i=y*W+x,ch=r[x],wall=ch!=='.'&&ch!=='t';open[i]=wall?0:1;
    const lid=t.lid&&t.lid[i]>0?t.lid[i]:0;top[i]=h[i]+(wall?whOf(ch):lid);if(top[i]>zmax)zmax=top[i];if(!wall&&(lid||(t.water&&t.water[i])))bad[i]=1;
    if(!wall&&x>1&&y>1&&x<W-2&&y<H-2){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}}}
  for(let i=0;i<N;i++)D[i]=(open[i]&&!bad[i])?999:0;
  const g=(x,y)=>x<0||y<0||x>=W||y>=H?0:D[y*W+x];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(D[i])D[i]=Math.min(D[i],g(x-1,y)+1,g(x,y-1)+1,g(x-1,y-1)+1,g(x+1,y-1)+1)}
  for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){const i=y*W+x;if(D[i])D[i]=Math.min(D[i],g(x+1,y)+1,g(x,y+1)+1,g(x+1,y+1)+1,g(x-1,y+1)+1)}
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;let m=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)m=Math.max(m,Math.abs(h[i+dy*W+dx]-h[i]));flat[i]=m<=.3?1:0}
  return HGTG.info[id]={L,rev:t.rev||0,W,H,N,h,open,bad,top,D,flat,roof:t.roof!==undefined?t.roof:Math.max(zmax+2.5,6),zmax,x0,x1,y0,y1,start:L.start||{x:W/2,y:H/2}};
}
function hgtgSpots(inf,R,minD,n,sep,o){
  o=o||{};const c=[],W=inf.W,st=inf.start,av=o.avoid===undefined?10:o.avoid;
  for(let i=0;i<inf.N;i++)if(inf.D[i]>=minD&&(o.flat===false||inf.flat[i]))c.push(i);
  for(let i=c.length-1;i>0;i--){const j=(R()*(i+1))|0,t=c[i];c[i]=c[j];c[j]=t}
  const out=[];for(const i of c){const x=i%W,y=(i/W)|0;if(Math.hypot(x-st.x,y-st.y)<av)continue;let ok=true;for(const p of out)if(Math.hypot(p[0]-x,p[1]-y)<sep){ok=false;break}if(ok){out.push([x,y]);if(out.length>=n)break}}
  return out;
}
function hgtgDij(inf,sx,sy,dmin,over,maxC){
  const W=inf.W,H=inf.H,N=inf.N,h=inf.h,D=inf.D,open=inf.open,top=inf.top,dist=new Float32Array(N).fill(1e9),prev=new Int32Array(N).fill(-1),hp=[],S=sy*W+sx;
  const push=(c,i)=>{hp.push([c,i]);let k=hp.length-1;while(k>0){const p=(k-1)>>1;if(hp[p][0]<=hp[k][0])break;const t=hp[p];hp[p]=hp[k];hp[k]=t;k=p}};
  const pop=()=>{const r=hp[0],l=hp.pop();if(hp.length){hp[0]=l;let k=0;for(;;){let a=2*k+1,b=a+1,m=k;if(a<hp.length&&hp[a][0]<hp[m][0])m=a;if(b<hp.length&&hp[b][0]<hp[m][0])m=b;if(m===k)break;const t=hp[m];hp[m]=hp[k];hp[k]=t;k=m}}return r};
  const ok=i=>open[i]?(!inf.bad[i]&&D[i]>=dmin):(over&&top[i]-h[i]<=3.6&&(i%W)>1&&(i%W)<W-2&&((i/W)|0)>1&&((i/W)|0)<H-2);
  if(!ok(S))return null;dist[S]=0;push(0,S);const order=[];
  while(hp.length){const [c,i]=pop();if(c>dist[i])continue;if(c>maxC)break;order.push(i);const x=i%W,y=(i/W)|0;
    for(let d=0;d<4;d++){const nx=x+(d===0?1:d===1?-1:0),ny=y+(d===2?1:d===3?-1:0);if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(!ok(j))continue;
      if(open[i]&&open[j]&&Math.abs(h[i]-h[j])>.5)continue;const nc=c+(open[j]?1+3/(D[j]+.5):2.4);if(nc<dist[j]){dist[j]=nc;prev[j]=i;push(nc,j)}}}
  return{dist,prev,order};
}
/* a closed racetrack route from (sx,sy) to a far point and back along a parallel lane */
function hgtgRoute(inf,R,sx,sy,o){
  const q=hgtgDij(inf,sx,sy,o.dmin,o.over,o.max*1.5);if(!q)return null;const W=inf.W,c=[];
  for(const i of q.order)if(q.dist[i]>=o.min&&q.dist[i]<=o.max&&inf.D[i]>=(o.endD||1)&&inf.open[i])c.push(i);
  let tgn=-1;if(o.near){let bd=1e9;for(const i of q.order){if(!inf.open[i]||inf.D[i]<(o.endD||1))continue;const d=Math.hypot(i%W-o.near[0],((i/W)|0)-o.near[1]);if(d<bd){bd=d;tgn=i}}}
  if(!c.length&&tgn<0)return null;const tg=tgn>=0?tgn:c[(R()*c.length)|0],cells=[];for(let i=tg;i>=0;i=q.prev[i])cells.push(i);cells.reverse();
  let p=[];const st=o.step||3;for(let k=0;k<cells.length;k+=st)p.push([cells[k]%W,((cells[k]/W)|0),cells[k]]);const lc=cells[cells.length-1];if(p[p.length-1][2]!==lc)p.push([lc%W,((lc/W)|0),lc]);
  if(p.length<3)return null;
  for(let it=0;it<2;it++)p=p.map((v,k)=>k===0||k===p.length-1?v:[v[0]*.5+(p[k-1][0]+p[k+1][0])*.25,v[1]*.5+(p[k-1][1]+p[k+1][1])*.25,v[2]]);
  const Lf=[],Rt=[];
  p.forEach((v,k)=>{const a=p[Math.max(0,k-1)],b=p[Math.min(p.length-1,k+1)];let tx=b[0]-a[0],ty=b[1]-a[1];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;
    const kk=Math.max(.15,Math.min(o.lane||1,(inf.D[v[2]]-1)*.55));Lf.push([v[0]+.5-ty*kk,v[1]+.5+tx*kk]);Rt.push([v[0]+.5+ty*kk,v[1]+.5-tx*kk])});
  return Lf.concat(Rt.reverse());
}
function hgtgRouteOK(inf,pts){const W=inf.W,n=pts.length;let pc=-1;for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];for(let k=0;k<5;k++){const x=a[0]+(b[0]-a[0])*k/5,y=a[1]+(b[1]-a[1])*k/5,c=(y|0)*W+(x|0);if(x<1||y<1||x>=W-1||y>=inf.H-1||!inf.open[c]||inf.bad[c])return false;if(pc>=0&&Math.abs(inf.h[c]-inf.h[pc])>.5)return false;pc=c}}return true}
function hgtgSafeCircle(inf,R,cx,cy,r0,n,wob){let r=r0;for(let i=0;i<6;i++){const pts=hgtgCircle(cx,cy,r,0,n,R,wob).map(p=>[p[0],p[1]]);if(hgtgRouteOK(inf,pts))return pts;r*=.7}return[[cx,cy]]}
/* ---------- the sky window of a lookout: the widest arc of azimuths where rays at 11, 19 and 29 degrees clear every wall top and decor piece ---------- */
function hgtgClearArc(inf,L,cx,cy){
  const W=inf.W,hl=inf.h[cy*W+cx]+.5,decs=(L.decor||[]).concat(L.scenery||[]),near=[];
  for(const d of decs){const x=d.x!==undefined?d.x:d[0],y=d.y!==undefined?d.y:d[1];if(x===undefined||y===undefined)continue;const dd=Math.hypot(x-cx,y-cy);if(dd<40&&dd>.5)near.push([Math.atan2(y-cy,x-cx),dd,(inf.h[(y|0)*W+(x|0)]||0)+6.5])}
  const bins=72,ok=new Uint8Array(bins);
  for(let b=0;b<bins;b++){const a=b/bins*6.2832,dx=Math.cos(a),dy=Math.sin(a);let clear=true;
    for(const e of[.2,.35,.55]){for(let d=2;d<=170&&clear;d++){const x=cx+.5+dx*d,y=cy+.5+dy*d;if(x<0||y<0||x>=W||y>=inf.H)break;if(inf.top[(y|0)*W+(x|0)]>hl+d*e-1.2)clear=false}
      if(!clear)break;for(const n of near){const da=Math.abs(Math.atan2(Math.sin(n[0]-a),Math.cos(n[0]-a)));if(da<.09&&n[2]>hl+n[1]*e-1.2){clear=false;break}}if(!clear)break}
    ok[b]=clear?1:0}
  let best=0,bs=0;for(let s=0;s<bins;s++){let l=0;while(l<bins&&ok[(s+l)%bins])l++;if(l>best){best=l;bs=s}}
  return{width:best*5,az:((bs+best/2)%bins)/bins*6.2832};
}
/* a world point seen from the lookout: azimuth az (0 = +x, pi/2 = +y), distance d, elevation el (radians) above the eye */
function hgtgP(v,az,d,el){return[v.x+.5+Math.cos(az)*d*Math.cos(el),v.y+.5+Math.sin(az)*d*Math.cos(el),v.hl+Math.sin(el)*d]}
function hgtgInSector(id,x,y){const v=HGTG.vista&&HGTG.vista[id];if(!v||v.az===undefined)return false;const a=Math.atan2(y-v.y,x-v.x);return Math.abs(Math.atan2(Math.sin(a-v.az),Math.cos(a-v.az)))<.8}
/* clouds, planets in the lookout's clear sector (the scorpionfish and the moon are placed in hgtgHorizon and hgtgMoon) */
function hgtgSectorScene(id,inf,vx,vy,stat,R){
  const v=HGTG.vista[id],deg=Math.PI/180;
  for(let q=0;q<3;q++){const az=v.az+(q-1)*.28,d=14+q*5,p=hgtgP(v,az,d,0),z0=v.hl-.1+q*.5,rt=[];for(let k=0;k<4;k++)rt.push([p[0]+Math.cos(k*1.57)*1.5,p[1]+Math.sin(k*1.57)*1.5,z0]);hgtmCloud({level:id,x:p[0],y:p[1],z:z0,r:2.2+q*.9,puffs:13,seed:300+q*17+id,route:rt,speed:.1+q*.04,alpha:.6})}
  [['ice',v.az-.2,150,13*deg],['violet',v.az+.18,165,22*deg]].forEach(([k,az,d,el],i)=>{const p=hgtgP(v,az,d,el),Rr=HGTG_PLANETS[k][0];hgtmSpawn('hgtg_planet_'+k,{level:id,route:[p,[p[0]+3,p[1]+3,p[2]+1.5]],x:p[0],y:p[1],speed:.05,scale:Math.max(1,d*Math.tan(7*deg)/Rr),seed:5+i,tick:hgtgPlanetTick,far:600})});
  stat.sector={az:+(v.az/deg).toFixed(0),width:v.width};
}
function hgtgMaxTop(inf,cx,cy,r){let m=-99;const x0=Math.max(0,(cx-r)|0),x1=Math.min(inf.W-1,(cx+r)|0),y0=Math.max(0,(cy-r)|0),y1=Math.min(inf.H-1,(cy+r)|0);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if((x-cx)*(x-cx)+(y-cy)*(y-cy)<=r*r){const v=inf.top[y*inf.W+x];if(v>m)m=v}return m}
function hgtgCircle(cx,cy,r,z,n,R,wob){const a0=R()*6.283,pts=[];for(let i=0;i<n;i++){const a=a0+i/n*6.283,rr=r*(1+(R()-.5)*(wob||.3));pts.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.85,z+(R()-.5)*1.4])}return pts}

HGTG.mix={
  480:{stilt:1,bulk:1,wing:2,peacock:1,schools:1,singles:0,planets:3,clouds:5,k:{}},
  481:{stilt:3,bulk:3,wing:3,peacock:4,schools:5,singles:2,planets:8,clouds:16,k:{stilt:['hgtg_stilt4','hgtg_stilt_heron','hgtg_stilt6'],bulk:['hgtg_bulk_mound','hgtg_bulk_aqua','hgtg_bulk_lilac'],wing:['hgtg_butterfly','hgtg_dragonfly','hgtg_moth'],peacock:['hgtg_peacock','hgtg_peacock_green','hgtg_peacock_white','hgtg_peacock'],tints:['pearl','aqua','rose','gold']}},
  482:{stilt:5,bulk:2,wing:6,peacock:2,schools:4,singles:2,planets:7,clouds:14,k:{stilt:['hgtg_stilt6','hgtg_stilt4','hgtg_stilt6'],bulk:['hgtg_bulk_amber','hgtg_bulk_lilac'],wing:['hgtg_moth','hgtg_moth','hgtg_butterfly'],peacock:['hgtg_peacock_green','hgtg_peacock'],tints:['aqua','violet','pearl','glow']}},
  483:{stilt:3,bulk:3,wing:6,peacock:2,schools:4,singles:3,planets:7,clouds:15,k:{stilt:['hgtg_stilt_heron','hgtg_stilt4'],bulk:['hgtg_bulk_amber','hgtg_bulk_mound','hgtg_bulk_aqua'],wing:['hgtg_bat','hgtg_butterfly','hgtg_dragonfly','hgtg_moth','hgtg_bat'],peacock:['hgtg_peacock','hgtg_peacock_white'],tints:['gold','bw','pearl','rose']}},
  484:{stilt:3,bulk:2,wing:5,peacock:4,schools:5,singles:2,planets:10,clouds:18,k:{stilt:['hgtg_stilt4','hgtg_stilt6'],bulk:['hgtg_bulk_lilac','hgtg_bulk_mound'],wing:['hgtg_bellmoth','hgtg_bellmoth','hgtg_butterfly'],peacock:['hgtg_peacock','hgtg_peacock_green','hgtg_peacock_white'],tints:['violet','glow','rose','pearl']}}};
HGTG.mixSmall={stilt:0,bulk:0,wing:2,peacock:1,schools:1,singles:0,planets:2,clouds:4,k:{}};
function hgtgAuto(id,opts){
  opts=opts||{};const inf=hgtgInfo(id);if(!inf||opts.skip)return 0;
  if(id===485||id===486)return 0;                                  // the tank and maze test rooms
  let mx=HGTG.mix[id]||(id>=4850?HGTG.mixSmall:{stilt:1,bulk:1,wing:3,peacock:2,schools:2,singles:1,planets:4,clouds:8,k:{}});
  mx=Object.assign({},mx,opts.mix||{});const m=opts.scale===undefined?1:opts.scale,cnt=k=>Math.max(0,Math.round((mx[k]||0)*m));
  const K=k=>mx.k&&mx.k[k]&&mx.k[k].length?mx.k[k]:HGTG.mix[481].k[k],R=hgtgR(id*7919+(opts.seed||0)+13),roof=inf.roof,W=inf.W,gh=(x,y)=>inf.h[(y|0)*W+(x|0)],pick=a=>a[(R()*a.length)|0];
  const stat={stilt:0,bulk:0,peacock:0,wing:0,fish:0,schools:0,planets:0,clouds:0};HGTG.stat[id]=stat;
  hgtgVariants();
  const fitScale=(name,lo,hi,gz)=>{const H0=HGTG.height[name]||10,s=lo+(hi-lo)*R(),lim=(roof-gz-.8)/H0;return Math.max(.25,Math.min(s,lim))};
  const place=(kind,nn,minD,sep,ro,sc)=>{
    const sp=hgtgSpots(inf,R,minD,nn*3,sep);let done=0;
    for(const s of sp){if(done>=nn)break;const name=pick(K(kind)),gz=gh(s[0],s[1]),
      r0=hgtgRoute(inf,R,s[0],s[1],ro),r1=(r0&&!hgtgRouteOK(inf,r0))?hgtgRoute(inf,R,s[0],s[1],Object.assign({},ro,{lane:.15})):r0,r=(r1&&hgtgRouteOK(inf,r1))?r1:hgtgSafeCircle(inf,R,s[0]+.5,s[1]+.5,Math.min(2.2,Math.max(.6,inf.D[s[1]*W+s[0]]-1)),6,.25);
      hgtgSpawn(name,{level:id,x:r[0][0],y:r[0][1],route:r,scale:sc(name,gz),speed:(HGTM.models[name].speed||.4)*(.8+.4*R()),seed:1+((R()*9000)|0),yaw:0});done++;stat[kind]++}};
  place('bulk',cnt('bulk'),4,26,{dmin:3,over:false,min:14,max:52,endD:3,lane:1.3,step:3},(n,gz)=>fitScale(n,.65,1.3,gz));
  place('stilt',cnt('stilt'),2,22,{dmin:1,over:false,min:20,max:64,endD:1,lane:.8,step:3},(n,gz)=>fitScale(n,.58,1.35,gz));
  // peacocks: slow small loops on flat open ground
  {const sp=hgtgSpots(inf,R,3,cnt('peacock')*3,14);let done=0;for(const s of sp){if(done>=cnt('peacock'))break;const name=pick(K('peacock')),rr=Math.min(2.8,Math.max(.8,inf.D[s[1]*W+s[0]]-1.3)),pts=hgtgSafeCircle(inf,R,s[0]+.5,s[1]+.5,rr,6,.35);
    hgtgSpawn(name,{level:id,x:pts[0][0],y:pts[0][1],route:pts,scale:.92+.25*R(),speed:.18+.1*R(),seed:1+((R()*9000)|0),minD:3.4});done++;stat.peacock++}}
  // winged: circling loops above the roofs
  {const sp=hgtgSpots(inf,R,1,cnt('wing')*2,16,{flat:false,avoid:4});let done=0;for(const s of sp){if(done>=cnt('wing'))break;const name=pick(K('wing')),sc=1+2*R(),rad=6+12*R(),mt=hgtgMaxTop(inf,s[0],s[1],Math.min(rad,10)),z=Math.min(roof-1.5,R()<.5?Math.max(mt+1+2*R(),gh(s[0],s[1])+2.5):gh(s[0],s[1])+1.4+4.5*R());
    hgtgSpawn(name,{level:id,x:s[0]+rad,y:s[1],route:hgtgCircle(s[0]+.5,s[1]+.5,rad,z,8,R,.4),scale:sc,speed:(.8+.6*R())*Math.pow(sc,.3),seed:1+((R()*9000)|0)});done++;stat.wing++}}
  // angelfish: schools circling towers and plazas, plus a few huge singles
  {const tints=K('tints'),scales=[.22,.5,1.0,2.0,3.2,1.4,.8];let nS=cnt('schools'),towers=[];
    for(let i=0;i<inf.N;i++)if(!inf.open[i]&&inf.top[i]-inf.h[i]>=5&&inf.top[i]>roof*.3&&(i%W)>3&&(i%W)<W-4)towers.push(i);
    const sp=hgtgSpots(inf,R,5,nS*2,18,{avoid:6});
    for(let s=0;s<nS;s++){let cx,cy,z,rad;
      if(towers.length&&s%2===0){const i=towers[(R()*towers.length)|0];cx=i%W;cy=(i/W)|0;rad=4.5+3*R();z=Math.min(roof-1.2,inf.top[i]+1+2*R())}
      else if(sp.length){const p=sp[s%sp.length];cx=p[0];cy=p[1];rad=Math.max(2.5,Math.min(inf.D[cy*W+cx]-1.5,10));z=gh(cx,cy)+1.3+2*R()}
      else continue;
      const n=4+((R()*4)|0),tt=[pick(tints),pick(tints)],sc2=Math.min(scales[s%scales.length],2.4);rad=Math.max(rad,sc2*3.5+4);
      hgtgSchool(id,{route:hgtgCircle(cx+.5,cy+.5,rad,z,6,R,.35),n,scale:sc2,tints:tt,seed:s+1+id,speed:.5+.4*R()});stat.fish+=n;stat.schools++}
    for(let s=0;s<cnt('singles');s++){if(!towers.length)break;const i=towers[(R()*towers.length)|0],cx=i%W,cy=(i/W)|0,rad=6+4*R(),z=Math.min(roof-1.5,inf.top[i]+1.5+2*R());
      hgtgSpawn('hgtg_angel_'+pick(tints),{level:id,x:cx+rad,y:cy,route:hgtgCircle(cx+.5,cy+.5,rad,z,6,R,.3),scale:3.5+3*R(),speed:.4+.2*R(),seed:1+((R()*9000)|0)});stat.fish++}}
  // vista: from the highest open cells (tower tops, lookouts) a giant stands on lower open ground 22 to 50 cells ahead with a clear line
  {const hs=[];for(let i=0;i<inf.N;i++)if(inf.open[i]&&!inf.bad[i]&&(i%W)>6&&(i%W)<W-7&&((i/W)|0)>6&&((i/W)|0)<inf.H-7)hs.push(i);
    hs.sort((p,q)=>inf.h[q]-inf.h[p]);const topc=hs.slice(0,Math.max(60,hs.length>>5));for(let i=topc.length-1;i>0;i--){const j=(R()*(i+1))|0,q=topc[i];topc[i]=topc[j];topc[j]=q}
    const dirs=[[0,-1],[1,0],[0,1],[-1,0]];let found=null,vx=0,vy=0;
    // among the lookouts with a clear line to open ground, take the one with the fewest decor pieces around it (a clear sky window)
    const decs=(inf.L.decor||[]).concat(inf.L.scenery||[]),dsc=(x,y)=>{let n=0;for(const d of decs){const dx=(d.x!==undefined?d.x:d[0])-x,dy=(d.y!==undefined?d.y:d[1])-y;if(dx*dx+dy*dy<144)n++}return n};let bestO=null;
    for(const md of[3,2]){for(const bi of topc.slice(0,220)){const cx0=bi%W,cy0=(bi/W)|0,arc=hgtgClearArc(inf,inf.L,cx0,cy0);let ff=null;for(let f=0;f<4&&!ff;f++){if(Math.abs(Math.atan2(Math.sin([-1.5708,0,1.5708,3.1416][f]-arc.az),Math.cos([-1.5708,0,1.5708,3.1416][f]-arc.az)))<.95)continue;for(let dd=30;dd<=56&&!ff;dd+=3){const x=cx0+dirs[f][0]*dd,y=cy0+dirs[f][1]*dd;if(x<4||y<4||x>W-5||y>inf.H-5||inf.D[y*W+x]<md||inf.h[y*W+x]>inf.h[bi]-1)continue;
          let clear=true;for(let k=3;k<dd&&clear;k+=2){const c=(cy0+dirs[f][1]*k)*W+cx0+dirs[f][0]*k;if(inf.top[c]>inf.h[bi]+.3)clear=false}if(clear)ff=[x,y,f]}}
        if(ff){const sc=-(arc.width+(inf.h[bi]/Math.max(1,inf.h[hs[0]]))*20);if(!bestO||sc<bestO.sc)bestO={sc,bi,ff,arc}}}if(bestO)break}
    if(bestO){found=bestO.ff;vx=bestO.bi%W;vy=(bestO.bi/W)|0;stat.decorNear=bestO.sc}
    if(found){const gz=gh(found[0],found[1]),dm=Math.max(.8,Math.min(2.4,inf.D[found[1]*W+found[0]]-2)),nb=K('bulk')[0],ns=K('stilt')[0],f=found[2],px=f%2?0:6,py=f%2?6:0;
      const one=(nm,cx,cy,r,sc,sp,sd)=>{const c=hgtgSafeCircle(inf,R,cx,cy,r,6,.2);hgtgSpawn(nm,{level:id,x:c[0][0],y:c[0][1],route:c,scale:sc,speed:sp,seed:sd})};
      one(nb,found[0]+.5,found[1]+.5,dm,fitScale(nb,.9,1.1,gz),.15,77+id);one(ns,found[0]+.5+px,found[1]+.5+py,Math.max(.8,dm-.5),fitScale(ns,.8,1,gz),.25,79+id);
      stat.vista={x:vx,y:vy,f,h:+inf.h[vy*W+vx].toFixed(1),hl:inf.h[vy*W+vx]+.5,az:bestO.arc.az,width:bestO.arc.width,giant:[found[0],found[1]]};HGTG.vista=HGTG.vista||{};HGTG.vista[id]=stat.vista
      // more giants on open ground in clear sight of the lookout and of the main plaza, plus low cloud around the lookout so there is fog to stand in
      {let mp=-1,md=-1;for(let i=0;i<inf.N;i++)if(inf.open[i]&&!inf.bad[i]&&inf.D[i]>md&&(i%W)>6&&(i%W)<W-7&&((i/W)|0)>6&&((i/W)|0)<inf.H-7){md=inf.D[i];mp=i}
        let alt=0;const used=[found];
        const visFrom=(cx0,cy0,n)=>{let c=0;const hb=inf.h[cy0*W+cx0];for(let f=0;f<4&&c<n;f++){const fa0=[-1.5708,0,1.5708,3.1416][f];if(Math.abs(Math.atan2(Math.sin(fa0-bestO.arc.az),Math.cos(fa0-bestO.arc.az)))<.95)continue;for(let dd=18;dd<=52&&c<n;dd+=4){const x=cx0+dirs[f][0]*dd,y=cy0+dirs[f][1]*dd;if(x<4||y<4||x>W-5||y>inf.H-5||inf.D[y*W+x]<3||inf.h[y*W+x]>hb+.6)continue;if(used.some(u=>Math.hypot(u[0]-x,u[1]-y)<9))continue;
            let clr=true;for(let k=3;k<dd&&clr;k+=2){const cc=(cy0+dirs[f][1]*k)*W+cx0+dirs[f][0]*k;if(inf.top[cc]>hb+.3)clr=false}if(!clr)continue;used.push([x,y]);c++;alt++;const nm=alt%2?ns:nb,cs=hgtgSafeCircle(inf,R,x+.5,y+.5,Math.max(.8,Math.min(2.4,inf.D[y*W+x]-2)),6,.2);
            hgtgSpawn(nm,{level:id,x:cs[0][0],y:cs[0][1],route:cs,scale:fitScale(nm,.8,1.1,gh(x,y)),speed:.15+.1*R(),seed:95+id*7+alt})}}};
        visFrom(vx,vy,2);if(mp>=0)visFrom(mp%W,(mp/W)|0,2);
        // the sleeping giant: a large open flat plaza cell with a straight, open, decor-free line of 11 to 14 cells to a viewing cell (checked over walls and decor)
        {const cands=[];for(let i=0;i<inf.N;i++)if(inf.open[i]&&!inf.bad[i]&&inf.flat[i]&&inf.D[i]>=4&&(i%W)>8&&(i%W)<W-9&&((i/W)|0)>8&&((i/W)|0)<inf.H-9)cands.push(i);
          for(let i=cands.length-1;i>0;i--){const j=(R()*(i+1))|0,q=cands[i];cands[i]=cands[j];cands[j]=q}
          const dirs8=[[0,-1],[1,0],[0,1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];let bestS=null;
          for(const ci of cands.slice(0,900)){const sx=ci%W,sy=(ci/W)|0;if(bestS&&inf.D[ci]<=bestS.d)continue;
            for(const [ddx,ddy] of dirs8){const nl=Math.hypot(ddx,ddy);for(const dd of[15,16,14,13]){const vx2=Math.round(sx+ddx/nl*dd),vy2=Math.round(sy+ddy/nl*dd);if(vx2<3||vy2<3||vx2>=W-3||vy2>=inf.H-3)continue;const vc=vy2*W+vx2;if(!inf.open[vc]||inf.bad[vc])continue;
                let ok=true;const n=dd*3;for(let k=1;k<n&&ok;k++){const px=vx2+(sx-vx2)*k/n,py=vy2+(sy-vy2)*k/n,c=(py|0)*W+(px|0);if(!inf.open[c]||inf.bad[c]||inf.top[c]>inf.h[vc]+1.0)ok=false}
                if(ok)for(const d of decs){const dx=(d.x!==undefined?d.x:d[0]),dy=(d.y!==undefined?d.y:d[1]);if(dx===undefined)continue;const L2=(sx-vx2)*(sx-vx2)+(sy-vy2)*(sy-vy2),tt=((dx-vx2)*(sx-vx2)+(dy-vy2)*(sy-vy2))/L2;if(tt<-.05||tt>1.05)continue;const qx=vx2+(sx-vx2)*tt-dx,qy=vy2+(sy-vy2)*tt-dy;if(qx*qx+qy*qy<2.6){ok=false;break}}
                if(ok){bestS={d:inf.D[ci],sx,sy,vx:vx2,vy:vy2};break}}if(bestS&&bestS.sx===sx&&bestS.sy===sy)break}}
          if(bestS){const sx=bestS.sx+.5,sy=bestS.sy+.5,nm0=K('bulk')[0];hgtgSpawn(nm0,{level:id,x:sx,y:sy,route:[[sx,sy]],scale:fitScale(nm0,.8,.9,gh(sx,sy)),h:gh(sx,sy)-.2,yaw:Math.atan2(-(bestS.vx+.5-sx),bestS.vy+.5-sy),speed:0,sleep:true,minD:5,cheap:true,seed:61+id});stat.sleeper=[bestS.sx,bestS.sy];stat.sleeperView=[bestS.vx,bestS.vy];
            const zt=gh(sx,sy)+9*.85;for(let q=0;q<2;q++)hgtmCloud({level:id,x:sx+.8,y:sy,z:zt+q*1.2,r:.55,puffs:4,seed:900+q+id,route:[[sx+.8,sy,zt+q*1.2],[sx+1.2,sy,zt+q*1.2+2.2]],speed:.25,alpha:.7});
            for(let q=1;q<=3;q++){const Ln=Math.hypot(sx-bestS.vx,sy-bestS.vy)||1,sdv=q%2?1:-1,tx=bestS.vx+(sx-bestS.vx)*q/4-(sy-bestS.vy)/Ln*4.2*sdv,ty=bestS.vy+(sy-bestS.vy)*q/4+(sx-bestS.vx)/Ln*4.2*sdv,cs=hgtgCircle(tx,ty,2.4,0,8,R,.3).map(p=>[p[0],p[1],gh(tx,ty)+1.6+R()*1.4]);hgtgSpawn('hgtg_dragonfly',{level:id,x:cs[0][0],y:cs[0][1],route:cs,scale:1.3,speed:1.2,seed:1300+q+id})}}}
        hgtgSectorScene(id,inf,vx,vy,stat,R);
        // low fliers at eye height near the lookout foot and the main plaza, and a leviathan that passes about 40 cells from the centre
        for(const [px0,py0,nmw] of[[found[0],found[1],'hgtg_butterfly'],[found[0]+4,found[1]+2,'hgtg_moth'],[mp>=0?mp%W:found[0],mp>=0?(mp/W)|0:found[1],'hgtg_dragonfly'],[mp>=0?mp%W+3:found[0],mp>=0?((mp/W)|0)+3:found[1],'hgtg_bat']]){const cs=hgtgSafeCircle(inf,R,px0+.5,py0+.5,5,8,.3).map(p=>[p[0],p[1],gh(px0,py0)+1.2+R()*1.6]);if(cs.length>2)hgtgSpawn(nmw,{level:id,x:cs[0][0],y:cs[0][1],route:cs,scale:1+R()*.6,speed:1+R()*.5,seed:700+px0})}
        {const pts=[];for(let i=0;i<10;i++){const a=i/10*6.283;pts.push([W/2+Math.cos(a)*(55+6*Math.sin(a*3)),inf.H/2+Math.sin(a)*(55+6*Math.sin(a*2)),26+4*Math.sin(a*2)])}hgtmSpawn('hgtg_levi_whale',{level:id,x:pts[0][0],y:pts[0][1],route:pts,scale:.7,speed:2.2,fly:true,foot:.01,far:500,cheap:true,hgk:'levi',seed:41,h:0,loop:true})}}
      // a bulk giant walks from the main plaza to the foot of the lookout, and a stilt-walker the same way, so they are seen from the tower top and the plaza
      {let pb=-1,bd=-1;const qv=hgtgDij(inf,found[0],found[1],1,false,320);if(qv)for(const i of qv.order)if(qv.dist[i]>=8&&inf.D[i]>bd&&inf.D[i]>=2){bd=inf.D[i];pb=i}
        if(pb>=0)for(const [nm,dm2,sc0] of[[nb,3,.9],[ns,1,.8]]){const r1=hgtgRoute(inf,R,pb%W,(pb/W)|0,{dmin:dm2,over:false,min:6,max:90,endD:dm2,lane:1,step:3,near:[vx,vy]});
          if(r1&&hgtgRouteOK(inf,r1)){hgtgSpawn(nm,{level:id,x:r1[0][0],y:r1[0][1],route:r1,scale:fitScale(nm,sc0,sc0+.15,gh(pb%W,(pb/W)|0)),speed:.3,seed:91+id+dm2});stat.walkers=(stat.walkers||0)+1;stat.vista.plaza=[pb%W,(pb/W)|0]}}}
    }}
  // the rim: lines of distant giants outside the walls and a row of leaning mesh spires, so the painted skyline is not alone
  {const Hh=inf.H;let nr=0;for(let i=0;i<14;i++){const side=i%4,al=(R()-.5)*.9,out=10+R()*28;let x,y;if(side===0){x=W/2+al*W;y=-out}else if(side===1){x=W+out;y=Hh/2+al*Hh}else if(side===2){x=W/2+al*W;y=Hh+out}else{x=-out;y=Hh/2+al*Hh}
      if(hgtgInSector(id,x,y))continue;const nm=i%2?pick(K('bulk')):pick(K('stilt'));hgtgSpawn(nm,{level:id,x,y,route:[[x,y]],h:0,scale:i%2?.9+.4*R():.8+.5*R(),yaw:Math.atan2(-(W/2-x),Hh/2-y),speed:0,seed:1+((R()*9000)|0),far:300,over:false,minD:28,rim:true});nr++}
    const sp=['hgtg_spire_pink','hgtg_spire_aqua','hgtg_spire_lilac'];let ns2=0;for(let i=0;i<26;i++){const side=i%4,al=(R()-.5)*1.05,out=4+R()*34;let x,y;if(side===0){x=W/2+al*W;y=-out}else if(side===1){x=W+out;y=Hh/2+al*Hh}else if(side===2){x=W/2+al*W;y=Hh+out}else{x=-out;y=Hh/2+al*Hh}
      if(hgtgInSector(id,x,y))continue;hgtgSpawn(sp[i%3],{level:id,x,y,route:[[x,y]],h:0,scale:.8+1.5*R(),yaw:R()*6.283,speed:0,seed:1+((R()*9000)|0),far:300,minD:20,rim:true});ns2++}stat.rim=nr;stat.spires=ns2}
  // planets and clouds
  {const np=cnt('planets'),keys=HGTG.planetKeys.slice();for(let i=keys.length-1;i>0;i--){const j=(R()*(i+1))|0,t=keys[i];keys[i]=keys[j];keys[j]=t}
    for(let i=0;i<np;i++){const k=keys[i%keys.length],Rr=HGTG_PLANETS[k][0],route=[];for(let q=0;q<3;q++)route.push([inf.x0+(inf.x1-inf.x0)*R(),inf.y0+(inf.y1-inf.y0)*R(),Rr*.5+3+R()*5]);
      hgtgPlanetSpawn(id,k,route,.3+.5*R(),1+i);stat.planets++}
    const nc=cnt('clouds');if(nc>0){hgtmCloudField(id,nc,{x0:inf.x0,y0:inf.y0,x1:inf.x1,y1:inf.y1,z0:.4,z1:4.5,seed:id+3,alpha:.6});stat.clouds=nc}}
  return stat;
}
function hgtgWarm(){const seen={};for(const k in HGTM.models)if(k.indexOf('hgtg_')===0)for(const P of HGTM.models[k].parts)if(P.tex&&!seen[P.tex]){seen[P.tex]=1;hgtmTex(P.tex,P.texMax||256,P.grade)}for(const k in HGTM.planets)if(k.indexOf('hgtg_')===0)hgtmTex(HGTM.planets[k].tex,HGTM.planets[k].opts.max||512,false)}
function hgtgOnEnter(id){
  if(HGTG.done[id])return;HGTG.done[id]=true;
  if(HGTG.killDemos)HGTM.test=false;
  if(HGTG.off)return;
  try{hgtgWrapLook()}catch(e){console.error('look',e)}
  try{hgtgAuto(id,{})}catch(e){console.error('hgtgAuto',id,e)}
  try{if(typeof hgtgHorizon==='function')hgtgHorizonDefs();hgtgWarm()}catch(e){console.error('hgtgWarm',e)}
  if(typeof hgtgHorizon==='function'){try{hgtgHorizon(id)}catch(e){console.error('hgtgHorizon',id,e)}}
}

/* ==========================================================================
   HORIZON: the great scorpionfish and the leviathans (scenery only: no hostile behaviour, no health, not targetable; just meshes)
   hgtgHorizon(levelId) places them on level 470 (flat raycaster level) and the terraced cities 480..484.
   Models: hgtg_scorpionfish (about 100 cells long), hgtg_levi_whale (64), hgtg_levi_manta (52 span), hgtg_levi_eel (80), hgtg_levi_jelly (26 bell).
   Painted pictures named hgtb_scorp_*, hgtb_levi_whale_*, hgtb_levi_manta_*, hgtb_levi_eel_*, hgtb_levi_jelly_* are picked up automatically when they exist
   (first picture whose name contains skin/body/scale, fin/spine/dorsal, membrane/pectoral/frill/wing, tail, eye); stand-ins are used until then.
   ========================================================================== */
function gArt(prefix,words,fb){for(const k in IMG){if(k.indexOf(prefix)>=0&&IMG[k]&&IMG[k].width&&words.some(w=>k.indexOf(w)>=0))return k}return fb}
function gBodyChain(id,n,seg,fn,kidLast){const build=i=>{const N={id:id+i,pos:i?[0,-seg,0]:[0,0,0],parts:fn(i),kids:[]};if(i<n-1)N.kids.push(build(i+1));else if(kidLast)N.kids.push(kidLast);return N};return build(0)}
function gScorpDef(name){
  const P_=IMG.hgtb_scorp_dorsal&&IMG.art_tex_hgtb_scorp_body,T=P_?'art_tex_hgtb_scorp_body':'art_tex_hgtb_scales',BEL=P_?(IMG.art_tex_hgtb_scorp_belly2?'art_tex_hgtb_scorp_belly2':'art_tex_hgtb_scorp_belly'):T,FIN=P_?'art_tex_hgtb_scorp_tassels':'hgtb_feather_iridescent',MEM='hgtb_wing_bat',FR=P_?'art_tex_hgtb_scorp_tassels':'hgtb_feather_down',EYE=IMG.hgtb_scorp_eye?'hgtb_scorp_eye':gEyeT(1);
  const col=[255,160,130],kids=[],parts=[{t:'ell',c:[0,-6,0],r:[8,28,13],seg:[16,12],tex:T,col:[255,170,140],uv:[5,3]},{t:'ell',c:[0,-4,-6],r:[6.6,24,8],seg:[12,8],tex:BEL,col:[255,225,190],uv:[4,2]},{t:'ell',c:[0,-36,1],r:[3.6,14,6],seg:[10,8],tex:T,col,uv:[2,1]},
    {t:'ell',c:[0,26,-1],r:[8.5,15,12.5],seg:[14,10],tex:T,col,uv:[2,2]},{t:'ell',c:[0,38,-3],r:[5.5,8,3],seg:[10,6],col:[215,120,100]}];
  for(let i=0;i<9;i++){const y=-30+i*6,ey=(y+6)/28,x=8*Math.sqrt(Math.max(0,1-ey*ey-.02))+.3;for(const sd of[-1,1])parts.push({t:'ell',c:[sd*x,y,2],r:[.8,1.3,.8],seg:[5,4],col:[255,235,160],glow:1})}
  const hc=[0,26,-1],hr=[8.5,15,12.5];
  for(const sd of[-1,1]){const x=sd*8.2,z=3,y=gSurf(hc,hr,x,z),p=[x,y,z];kids.push(gEye(sd<0?'eL':'eR',p,4.6,EYE,gNormRot(hc,hr,p),{bulge:3.6,seg:16,rings:5,lip:[255,150,90],eg:.9}));parts.push({t:'ell',c:[sd*7.4,y+1,8.5],r:[2.6,6.5,2.2],rot:[0,0,sd*.3],seg:[8,5],col:[150,60,50]})}
  kids.push({id:'jaw',pos:[0,32,-5],parts:[{t:'ell',c:[0,4,-4],r:[6,10,3.5],seg:[10,6],col:[170,80,66]},{t:'ell',c:[0,9,-1.2],r:[4.5,2,.8],seg:[8,4],col:[255,245,225]}]});
  const N_T=14;for(let i=0;i<N_T;i++){const a=i/N_T,y=34-a*52,sd=i%2?1:-1,ey=(y+6)/28,x=a<.3?5.5:8*Math.sqrt(Math.max(.05,1-ey*ey)),z=a<.3?-9:-2+(i%3)*3;
    kids.push({id:'ts'+i,pos:[sd*x,y,z],parts:[{t:'limb',id:'tsL'+i,len:[4.5,3.5],rad:[.55,.3,.1],sides:4,noball:true,col:[255,185,120],glow:.15}]})}
  const fanNode=(id,pos,rotP,fans,quad)=>({id,pos,rot:rotP,kids:[{id:id+'f',rot:[0,0,1.5708],parts:fans.concat(quad?[quad]:[])}]});
  kids.push(fanNode('dor',[0,-2,12],[0,0,0],[{t:'fan',c:[0,0,0],n:17,layers:2,len:30,wid:6,base:.6,spread:1.7,glow:.6,tex:FIN,col:[255,120,80],shimmer:[.6,1.1],vcol:[[255,255,255],[255,230,200],[255,255,255]]}],{t:'quad',c:[0,.05,0],size:[44,24],piv:[.5,0],tex:MEM,alpha:true,col:[255,120,90],glow:.4}));
  for(const sd of[-1,1])kids.push(fanNode('pc'+(sd<0?'L':'R'),[sd*8,14,-3],[2.3,0,0],[{t:'fan',c:[0,0,0],n:15,layers:3,len:19,wid:7,base:.5,spread:2.2,glow:.6,tex:FR,col:[255,215,160],shimmer:[.6,.9]}]));
  if(P_){const q=(id,pos,rz,w,h,tx,piv,uv,o)=>kids.push({id,pos,rot:[0,0,rz],parts:[Object.assign({t:'quad',c:[0,0,0],size:[w,h],piv,uv,tex:tx,alpha:true,col:[255,235,215],glow:.3,texMax:512},o||{})]});
    q('dq',[0,-2,11.5],1.5708,48,30,'hgtb_scorp_dorsal',[.5,0],[0,0,1,1]);
    for(const sd of[-1,1])q('pq'+sd,[sd*8.4,14,-3],1.5708,26,26,IMG.hgtb_scorp_pectoral_ruffle1?'hgtb_scorp_pectoral_ruffle'+(sd<0?1:2):'hgtb_scorp_pectoral',[1,.5],[1,0,0,1]);
    q('tq',[0,-48,1],1.5708,38,28,'hgtb_scorp_tail',[1,.5],[1,0,0,1]);q('sq',[0,-26,-10],1.5708,22,10,'hgtb_scorp_smallfins',[.5,1],[0,0,1,1]);
    for(const sd of[-1,1])q('bq'+sd,[sd*7,30,-8],1.5708,12,16,'hgtb_scorp_barbels',[.5,1],[0,0,1,1])}
  kids.push(fanNode('anal',[0,-18,-11],[3.14159,0,0],[{t:'fan',c:[0,0,0],n:7,len:9,wid:3,base:.3,spread:1.2,tex:FIN,col:[255,175,110]}]));
  kids.push(fanNode('tail',[0,-49,1],[1.5708,0,0],[{t:'fan',c:[0,0,0],n:13,layers:2,len:27,wid:6.5,base:.6,spread:1.4,glow:.6,tex:FR,col:[255,215,150],shimmer:[.8,1.0]},{t:'fan',c:[0,.1,0],n:8,len:19,wid:5,base:.4,spread:1.9,tex:FIN,col:[255,215,160]}]));
  return hgtmDef(name,{rad:75,foot:.01,cycle:1,speed:.5,root:{id:'root',kids:[{id:'body',pos:[0,0,0],parts,kids}]},
    anim(t,st){const n={},l={},s=st.seed;
      n.body={r:[Math.sin(t*.13+s)*.03,Math.sin(t*.09+s)*.05,0]};n.jaw={r:[.1+.12*Math.sin(t*.35),0,0]};
      n.pcL={r:[Math.sin(t*.4)*.18,0,0]};n.pcR={r:[Math.sin(t*.4+.4)*.18,0,0]};n.dor={r:[0,0,Math.sin(t*.25)*.05]};n.anal={r:[Math.sin(t*.5)*.1,0,0]};n.tail={r:[Math.sin(t*.3)*.1,0,Math.sin(t*.28)*.35]};
      for(let i=0;i<N_T;i++)l['tsL'+i]=[Math.sin(t*.7+i)*.4,Math.sin(t*.7+i+1)*.5];
      return{n,l,ro:{},fs:.9+.1*Math.sin(t*.3)}}});
}
function gWhaleDef(name){
  const SK=IMG.art_tex_hgtb_whale_contrast?'art_tex_hgtb_whale_contrast':gArt('hgtb_levi_whale',['skin','body','scale'],gSkin('lilac')),FL=gArt('hgtb_levi_whale',['fin','flipper','wing','membrane'],'hgtb_wing_bat'),EYE=gArt('hgtb_levi_whale',['eye'],gEyeT(2)),N=7,rw=[6,7.5,7.8,7.2,6,4.4,3],rh=[5.2,6.8,7,6.4,5.2,3.6,2.4];
  const segParts=i=>{const p=[{t:'ell',c:[0,-4,0],r:[rw[i],5.7,rh[i]],seg:[12,8],tex:SK,col:i%2?[140,165,230]:[225,235,255],uv:[2,1]},{t:'ell',c:[0,-4,-rh[i]*.55],r:[rw[i]*.8,4.5,rh[i]*.55],seg:[8,5],col:[235,240,255],glow:.15}];
    for(let k=-1;k<=1;k++)p.push({t:'ell',c:[k*rw[i]*.42,-4,-rh[i]*.93],r:[1.1,3.2,.9],seg:[5,4],col:[150,255,240],glow:1});for(const sd of[-1,1])p.push({t:'ell',c:[sd*rw[i]*.97,-4,-rh[i]*.1],r:[.7,2.8,.7],seg:[5,4],col:[150,255,240],glow:1});
    if(i===1||i===2)p.push({t:'fan',c:[0,-4,rh[i]*.9],n:5,len:3.5,wid:1.6,base:.2,spread:.8,tex:'hgtb_feather_down',col:[190,215,255]});return p};
  const kids=[],hc=[0,6,0],hr=[7,10,6.4],head=[{t:'ell',c:hc,r:hr,seg:[14,10],tex:SK,col:[205,220,255],uv:[2,1]},{t:'ell',c:[0,9,-3.4],r:[5.8,7,2.2],seg:[10,6],col:[235,240,255]},{t:'ell',c:[0,12.5,-1.6],r:[4,3,.4],seg:[8,4],col:[90,60,90]}];
  for(const sd of[-1,1]){const x=sd*6.2,z=1.2,y=gSurf(hc,hr,x,z),p=[x,y,z];kids.push(gEye(sd<0?'eL':'eR',p,1.7,EYE,gNormRot(hc,hr,p),{bulge:1.2,seg:12,rings:4,lip:[110,90,150]}))}
  for(const sd of[-1,1])kids.push(gWing('fl'+(sd<0?'L':'R'),sd,15,9,FL,[0,0,1,1],[sd*6,6,-3],{col:[190,230,255],glow:.3}));
  const tailK=[0,1].map(i=>gWing('fk'+(i?'R':'L'),i?1:-1,15,8,FL,[0,0,1,1],[0,-4,0],{col:[190,225,255],glow:.3}));
  const chain=gBodyChain('wb',N,8,segParts,{id:'fluk',pos:[0,-8,0],kids:tailK});
  return hgtmDef(name,{rad:50,foot:.01,cycle:1,speed:.5,root:{id:'root',kids:[{id:'head',pos:[0,28,0],parts:head,kids:kids.concat([chain])}]},
    anim(t,st){const n={},s=st.seed;for(let i=0;i<N;i++)n['wb'+i]={r:[Math.sin(t*.32-i*.55+s)*(.04+.02*i),0,Math.sin(t*.2-i*.4+s)*.03*i]};
      n.head={r:[Math.sin(t*.32+s)*.03,0,0]};for(const sd of['L','R']){const k=sd==='L'?-1:1;gWingPose(n,'fl'+sd,k,.5+.25*Math.sin(t*.4),.15*Math.sin(t*.4-.8))}
      n.flukL={};gWingPose(n,'fkL',-1,Math.sin(t*.32-N*.55+s)*.45,0);gWingPose(n,'fkR',1,Math.sin(t*.32-N*.55+s)*.45,0);return{n,l:{},ro:{}}}});
}
function gMantaDef(name){
  const SK=gArt('hgtb_levi_manta',['skin','body','scale'],gSkin('aqua')),WG=gArt('hgtb_levi_manta',['wing','fin','membrane'],'hgtb_wing_bat'),EYE=gArt('hgtb_levi_manta',['eye'],gEyeT(4));
  const parts=[{t:'ell',c:[0,0,0],r:[8,11,2.6],seg:[14,8],tex:SK,col:[150,185,230],uv:[2,2]},{t:'ell',c:[0,2,-1.6],r:[6.6,9,1.4],seg:[12,6],col:[225,235,255],glow:.2}],kids=[];
  for(let i=-3;i<=3;i++)parts.push({t:'ell',c:[i*1.7,-2+Math.abs(i)*.6,-2.6],r:[.5,1.8,.4],seg:[5,4],col:[160,255,235],glow:1});
  for(const sd of[-1,1]){parts.push({t:'limb',id:'hn'+sd,len:[3,3],rad:[.8,.5,.2],c:[sd*3,10,-.5],noball:true,sides:5,col:[130,170,225],rest:[1.0,.6]});
    const x=sd*5.5,y=9,hc=[0,0,0],p=[x,y,.6];kids.push({id:'e'+(sd<0?'L':'R'),pos:p,rot:[0,0,-sd*.9],parts:[{t:'dome',r:1.5,bulge:1.1,axis:'+y',tex:EYE,seg:12,rings:4}]});
    kids.push(gWing('w'+(sd<0?'L':'R'),sd,26,17,WG,[0,0,1,1],[sd*5,0,0],{col:[150,190,235],glow:.3}))}
  kids.push({id:'mt',pos:[0,-10,0],rot:[-1.5708,0,0],parts:[{t:'limb',id:'mtL',len:[8,8,8,8,8],rad:[.9,.7,.5,.35,.2,.1],noball:true,sides:5,col:[140,180,230],tex:SK}]});
  return hgtmDef(name,{rad:32,foot:.01,cycle:1,speed:.5,root:{id:'root',kids:[{id:'body',pos:[0,0,0],parts,kids}]},
    anim(t,st){const n={},l={},s=st.seed,ph=t*.35+s;for(const k of[-1,1]){gWingPose(n,'w'+(k<0?'L':'R'),k,.1+.5*Math.sin(ph),.55*Math.sin(ph-1.1))}
      n.body={p:[0,0,Math.sin(ph)*.9],r:[Math.sin(ph-.6)*.05,0,0]};l.mtL=[Math.sin(ph-1.5)*.18,Math.sin(ph-1.9)*.2,Math.sin(ph-2.3)*.2,Math.sin(ph-2.7)*.2,Math.sin(ph-3.1)*.2];
      l.hn1=[1.0+Math.sin(t*.6)*.2,.6];l['hn-1']=[1.0+Math.sin(t*.6+1)*.2,.6];return{n,l,ro:{}}}});
}
function gEelDef(name){
  const SK=IMG.art_tex_hgtb_eel_thick?'art_tex_hgtb_eel_thick':gArt('hgtb_levi_eel',['skin','body','scale'],'art_tex_hgtb_scales'),EYE=gArt('hgtb_levi_eel',['eye'],gEyeT(1)),N=16,seg=5.2;
  const segParts=i=>{const r=(3.2-i*.14)*1.9,fin=i%2===0?[{t:'quad',c:[seg/2,0,r*.9],size:[seg*1.9,r*1.3],piv:[.5,0],rot:[0,0,-1.5708],tex:'hgtb_wing_bat',alpha:true,col:[255,205,130],glow:.4}]:[],p=fin.concat([{t:'ell',c:[0,-seg/2,0],r:[r,seg*.62,r],seg:[8,6],tex:SK,col:i%2?[120,220,200]:[140,235,215],uv:[2,1]},{t:'ell',c:[0,-seg/2,-r*.85],r:[r*.4,seg*.45,r*.2],seg:[5,4],col:[200,255,235],glow:1},
    {t:'ell',c:[0,-seg/2,r*.95],r:[.5,seg*.5,r*.55],seg:[5,4],col:[255,200,120],glow:.35}]);return p};
  const kids=[],hc=[0,3,0],hr=[3.4,6,3.2],head=[{t:'ell',c:hc,r:hr,seg:[12,8],tex:SK,col:[150,240,215]},{t:'ell',c:[0,8,-1],r:[2.2,4,1.6],seg:[8,5],col:[110,200,185]}];
  for(const sd of[-1,1]){const x=sd*3,z=1.2,y=gSurf(hc,hr,x,z),p=[x,y,z];kids.push(gEye(sd<0?'eL':'eR',p,1.5,EYE,gNormRot(hc,hr,p),{bulge:1.1,seg:12,rings:4,lip:[200,120,60]}));
    head.push({t:'limb',id:'wh'+sd,len:[7,7],rad:[.3,.2,.1],c:[sd*1.5,7,-1],noball:true,sides:4,col:[255,220,150],rest:[1.2,.4]},{t:'limb',id:'hr'+sd,up:true,len:[3,3],rad:[.6,.4,.1],c:[sd*1.3,1,3],noball:true,sides:5,col:[255,200,120],rest:[-.6,-.4]})}
  for(const sd of[-1,1])kids.push(gWing('pf'+(sd<0?'L':'R'),sd,5,3.4,'hgtb_wing_insect',[0,0,1,1],[sd*2.6,-5,-1.2],{col:[190,255,230],glow:.4}));
  const chain=gBodyChain('eb',N,seg,segParts);
  return hgtmDef(name,{rad:48,foot:.01,cycle:1,speed:.5,root:{id:'root',kids:[{id:'head',pos:[0,38,0],parts:head,kids:kids.concat([{id:'bodyc',pos:[0,-2,0],kids:[chain]}])}]},
    anim(t,st){const n={},l={},s=st.seed;for(let i=0;i<N;i++)n['eb'+i]={r:[Math.sin(t*.45-i*.5+s)*.06,0,Math.sin(t*.5-i*.55+s)*.16]};
      n.head={r:[Math.sin(t*.45+s)*.05,0,Math.sin(t*.5+s)*.1]};for(const k of[-1,1]){l['wh'+k]=[1.2+Math.sin(t*.7+k)*.25,.4+Math.sin(t*.6+k)*.2];gWingPose(n,'pf'+(k<0?'L':'R'),k,.3+.4*Math.sin(t*.9),.1)}return{n,l,ro:{}}}});
}
function gJellyDef(name){
  const SK=gArt('hgtb_levi_jelly',['skin','body','bell'],gSkin('lilac')),EYE=gArt('hgtb_levi_jelly',['eye'],gEyeT(3)),kids=[];
  const bell=[{t:'ell',c:[0,0,6],r:[13,13,9],seg:[16,10],tex:SK,col:[205,180,255],glow:.5,uv:[3,2]},{t:'ell',c:[0,0,-.3],r:[13.8,13.8,1.3],seg:[16,5],col:[255,170,230],glow:.7}];
  for(let i=0;i<6;i++){const a=i/6*6.283,r=i?5:0;bell.push({t:'ell',c:[Math.cos(a)*r,Math.sin(a)*r,5.5+(i%2)*2],r:[2.2,2.2,2.2],seg:[7,5],col:[255,225,140],glow:1})}
  const hc=[0,0,6],hr=[13,13,9];for(const sd of[-1,1]){const x=sd*5,z=5,yv=gSurf(hc,hr,x,z),p=[x,yv,z];kids.push(gEye(sd<0?'eL':'eR',p,2.4,EYE,gNormRot(hc,hr,p),{bulge:1.8,seg:14,rings:4,lip:[170,120,210]}))}
  const NT=20;for(let i=0;i<NT;i++){const a=i/NT*6.283;kids.push({id:'jt'+i,pos:[Math.cos(a)*12.6,Math.sin(a)*12.6,-.2],rot:[0,0,a-1.5708],parts:[{t:'limb',id:'jtL'+i,len:[7,7,7,6],rad:[.6,.45,.3,.2,.08],noball:true,sides:4,col:[230,150,255],glow:.3}]})}
  for(let i=0;i<4;i++){const a=i/4*6.283+.7;kids.push({id:'oa'+i,pos:[Math.cos(a)*3,Math.sin(a)*3,0],parts:[{t:'limb',id:'oaL'+i,len:[9,9,6],rad:[1.3,.9,.6,.3],sides:6,col:[255,215,170],tex:SK,glow:.4}]})}
  for(const sd of[-1,1])kids.push(gWing('jf'+(sd<0?'L':'R'),sd,12,7,'hgtb_wing_bat',[0,0,1,1],[sd*3,-11,5],{col:[210,190,255],glow:.5}));
  return hgtmDef(name,{rad:32,foot:.01,cycle:1,speed:.5,root:{id:'root',kids:[{id:'bell',pos:[0,0,0],parts:bell,kids}]},
    anim(t,st){const n={},l={},s=st.seed,ph=t*.4+s,pu=Math.sin(ph);n.bell={p:[0,0,pu*.9],r:[Math.sin(t*.17+s)*.03,Math.sin(t*.13)*.03,0]};
      for(let i=0;i<NT;i++)l['jtL'+i]=[.5+pu*.25+Math.sin(ph*.7-i*.8)*.2,Math.sin(ph-i*.5-1)*.3,Math.sin(ph-i*.5-2)*.3,Math.sin(ph-i*.5-3)*.3];
      for(let i=0;i<4;i++)l['oaL'+i]=[Math.sin(ph-i)*.3,Math.sin(ph-i-1)*.4,Math.sin(ph-i-2)*.4];
      for(const k of[-1,1])gWingPose(n,'jf'+(k<0?'L':'R'),k,.25+.35*pu,.2*Math.sin(ph-1));return{n,l,ro:{}}}});
}
HGTG.horizonSig='';
function hgtgHorizonDefs(){
  let sig='';for(const k in IMG)if(/^hgtb_(scorp|levi)_/.test(k))sig+=k+',';
  if(HGTG.horizonDefs&&sig===HGTG.horizonSig)return;HGTG.horizonSig=sig;HGTG.horizonDefs=true;const b=HGTG.building;HGTG.building=true;const lf=HGTG.lift;HGTG.lift=.5;
  HGTG.lift=.75;gScorpDef('hgtg_scorpionfish');HGTG.lift=.5;gWhaleDef('hgtg_levi_whale');gMantaDef('hgtg_levi_manta');gEelDef('hgtg_levi_eel');gJellyDef('hgtg_levi_jelly');HGTG.building=b;HGTG.lift=lf;
  for(const n of['hgtg_scorpionfish','hgtg_levi_whale','hgtg_levi_manta','hgtg_levi_eel','hgtg_levi_jelly'])HGTG.kind[n]='levi';
}

/* ---------- flat raycaster levels (470): the mesh renderer needs the lighting set (TC) and a flat ground depth table (YB); walls are already recorded by render3D ---------- */
HGTG.flatLevels={470:true};
const HGTG_FTC={nl:[],nn:0,ncr:[],ncg:[],ncb:[],ttR:.5,ttG:.95,ttB:1.5,hzr:[40,58,82],hzmax:.5,hzrate:.03,lbm:.5,tbR:1,tbG:.94,tbB:.84,HLK:null,tm:0};
(function(){
  const bg=hgtmBegin;hgtmBegin=function(cx,cy,dX,dY,pX,pY){if(HGTG.flatLevels[LEVEL]&&!TERR_NOW)return hgtgFlatBegin(cx,cy,dX,dY,pX,pY);return bg(cx,cy,dX,dY,pX,pY)};
})();
function hgtgFlatBegin(cx,cy,dX,dY,pX,pY){
  const out=HGTM.out;out.length=0;HGTM.fog=0;HGTM.tris=0;HGTM.vis=0;hgtmSync();
  if(!HGTM.inst.length){HGTM.ms=0;return out}
  if(HGTG.ybLevel!==LEVEL||HGTG.ybHH!==HH){HGTG.ybLevel=LEVEL;HGTG.ybHH=HH;for(let x=0;x<VW;x++)for(let b=0;b<YBK;b++){const z=.55+(b+.5)/YBS;YB[x*YBK+b]=Math.min(VH,Math.round(HH+EYE*F/z))}}
  const t0=performance.now(),C=HGTG_FTC;C.lbm=Math.max(G.day||0,G.amb||.5,.85);C.tm=G.time;C.cx=cx;C.cy=cy;const saveTC=TC;TC=C;
  let dt=HGTM.tLast<0?0:G.time-HGTM.tLast;HGTM.tLast=G.time;if(dt<0||dt>.25)dt=Math.min(.05,Math.abs(dt));if(dt>0)hgtmUpdate(dt);else if(HGTM.inst.some(i=>i.first))hgtmUpdate(.0001);
  const cam={cx,cy,dX,dY,cz:EYE,iw:1/F};HGTM.cam=cam;const cand=[];
  for(const I of HGTM.inst){if(I.kind==='cloud')continue;const rx=I.x-cx,ry=I.y-cy,zc=dX*rx+dY*ry,xc=dX*ry-dY*rx,rad=I.kind==='mesh'?I.M.rad*I.sc:I.M.rad;
    if(zc+rad<.1||zc>(I.o.far||80))continue;const lim=(zc+rad)*VW/2/F*1.05+rad;if(Math.abs(xc)-rad>lim)continue;I.zc=zc;I.xc=xc;cand.push(I)}
  cand.sort((a,b)=>a.zc-b.zc);let slotN=0;
  for(const I of cand){if(performance.now()-t0>HGTM.budget&&!I.o.cheap)continue;if(slotN>=12)continue;const e=I.kind==='mesh'?hgtmRenderMesh(I,cam,slotN):hgtmRenderPlanet(I,cam,slotN);if(e){slotN++;out.push(e);HGTM.vis++}}
  out.sort((a,b)=>b.tY-a.tY);TC=saveTC;HGTM.ms=performance.now()-t0;return out;
}

/* ---------- placement ---------- */
function hgtgHorizon(id,opts){
  opts=opts||{};if(id!==470&&!(id>=480&&id<=484)&&!opts.force)return 0;hgtgHorizonDefs();
  const L=LEVELS[id];if(!L)return 0;const W=L.rows[0].length,H=L.rows.length,cx=W/2,cy=H/2,R=hgtgR(id*131+(opts.seed||0)+5),flat=id===470;
  const place=(name,dist,z,scale,speedMul,a0)=>{const n=10,pts=[],a=a0===undefined?R()*6.283:a0;
    for(let i=0;i<n;i++){const t=i/n*6.283,rr=dist*(1+.08*Math.sin(t*2+a)),zz=z*(1+.12*Math.sin(t*3+a*2));pts.push([cx+Math.cos(t+a)*rr,cy+Math.sin(t+a)*rr*.9,zz])}
    const sp=Math.max(.3,dist*.0055*speedMul);
    return hgtmSpawn(name,{level:id,x:pts[0][0],y:pts[0][1],route:pts,scale,speed:sp,fly:true,foot:.01,far:dist*2.6+200,cheap:true,hgk:'levi',seed:1+((R()*9000)|0),h:0,speedMul:1,loop:true,s0:a0===undefined?undefined:0})};
  const rec=[],vv=HGTG.vista&&HGTG.vista[id],fa=vv?[-1.5708,0,1.5708,3.1416][vv.f]:undefined;   // the horizon creatures start in front of the main lookout
  if(vv&&vv.az!==undefined&&!flat){const deg=Math.PI/180,pts=[];for(let i=0;i<5;i++)pts.push(hgtgP(vv,vv.az+(i/4-.5)*.6,150,(13+1.5*Math.sin(i))*deg));for(let i=4;i>=0;i--)pts.push(hgtgP(vv,vv.az+(i/4-.5)*.6,190,(15-1.5*Math.sin(i))*deg));
    rec.push(['scorp',hgtmSpawn('hgtg_scorpionfish',{level:id,x:pts[0][0],y:pts[0][1],route:pts,scale:.62,speed:.9,fly:true,foot:.01,far:900,cheap:true,hgk:'levi',seed:11,h:0,speedMul:1,loop:true,s0:0})])}
  else rec.push(['scorp',place('hgtg_scorpionfish',150+20*R(),38,.62,.5,fa)]);
  const far=[['hgtg_levi_whale',70,17,.5],['hgtg_levi_manta',85,20,.55],['hgtg_levi_eel',145,33,.75],['hgtg_levi_jelly',115,26,1.3]],mid=[['hgtg_levi_manta',110,24,.8]],near=[['hgtg_levi_jelly',95,20,1.0]];
  const list=flat?far.concat(mid,near):far.slice(1,4);
  list.forEach(([n,d,z,s],i)=>rec.push([n,place(n,d*(.9+.2*R()),z,s,1,fa===undefined?undefined:fa+(i%2?.6:-.6)*(1+i*.25))]));
  HGTG.stat['h'+id]={scorp:1,leviathans:list.length};return list.length+1;
}

/* ==========================================================================
   THE MOON (hgtgMoon): a vast glowing sphere, a fixed sky object that follows the camera. Up from about 19:00 to 06:00 (G.clock), rising behind the horizon,
   crossing an arc over the north half of the cavern, setting at dawn; absent by day. Apparent width about a fifth of the screen. Surface hgt_moon_main when it exists
   (else hgt_planet_cratered), glow rim from hgt_moon_halo or atmo colour. Lit side turns with the night (phase). The roof is not tested: it reads as seen through a vast opening.
   Visible in 470 and 480..484. Spawned automatically by hgtgOnEnter; HGTG.moon=false switches it off.
   ========================================================================== */
HGTG.moon=true;
function hgtgMoonHour(){return ((((G.clock||0)%1440)+1440)%1440)/60}
function hgtgMoonPos(M,u){
  if(M.look){const deg=Math.PI/180,s=hgtgSm(0,1,Math.min(1,Math.sin(Math.PI*u)*2.4));return hgtgP(M.look,M.look.az+(u-.5)*2.0,300,(32*s-24*(1-s))*deg)} // world path with its lowest point M.bottom above the ground; rises from and sets below the horizon
  const s=hgtgSm(0,1,Math.min(1,Math.sin(Math.PI*u)*2.4)),zc=-M.R*1.1+(M.R*1.1+M.R+M.bottom)*s;
  return M.side?[M.fx,M.cy+(u-.5)*M.span*M.side,zc]:[M.cx+(u-.5)*M.span,M.cy+(M.dy||0),zc];   // cities: a north-south line beyond one wall; 470: east-west right over the land
}
function hgtgMoonTick(I,dt){
  const M=I.o.moon,h=hgtgMoonHour(),u=h>=19?(h-19)/11:h<6?(h+5)/11:-1,o=I.o,cam=HGTM.cam;
  if(u<0||u>1||!cam){o.far=0;HGTG.moonK=0;HGTG.moonI=null;return}
  const p=hgtgMoonPos(M,u);I.x=p[0];I.y=p[1];I.pz=p[2];I.sc=1;o.far=M.span*2+2000;HGTG.moonI=I;
  const dx=cam.cx-p[0],dy=cam.cy-p[1],hd=Math.hypot(dx,dy),d=Math.hypot(hd,Math.max(0,p[2]-M.R));
  const rise=hgtgSm(0,.5,Math.min(u,1-u)*3),pulse=1+.08*Math.sin(G.time*.45);
  HGTG.moonK=Math.min(1,hgtgSm(5*M.R,.4*M.R,d)*rise*pulse);HGTG.moonDX=-dx/(hd||1);HGTG.moonDY=-dy/(hd||1);
  const phs=(u-.5)*1.5,l=hd||1,tx=dx/l,ty=dy/l,px=-ty,py=tx;o.light=[tx*Math.cos(phs)+px*Math.sin(phs),ty*Math.cos(phs)+py*Math.sin(phs),-.35];
}
HGTG.moonRec={};
function hgtgMoon(id){
  if(!HGTG.moon||HGTG.moonRec[id])return;HGTG.moonRec[id]=1;const L=LEVELS[id];if(!L)return;const main=gArt('hgt_moon_main',['moon_main'],'hgt_planet_cratered'),gl=gArt('hgt_moon_glow',['moon_glow'],null),inf=hgtgInfo(id),W=L.rows[0].length,H=L.rows.length,R=inf?100:80;
  hgtmPlanet('hgtg_moon',main,(inf&&HGTG.vista&&HGTG.vista[id]&&HGTG.vista[id].az!==undefined)?80:R,{spin:.02,tilt:.25,glow:gl?.12:.4,glowTex:gl,atmo:[205,195,255],gain:1.2,max:512,lowres:1});
  const vv=inf&&HGTG.vista&&HGTG.vista[id],M={R:vv?80:R,cx:W/2,cy:H/2,dy:inf?-40:0,span:W*9,bottom:inf?Math.max(26,inf.zmax+3):10,look:vv&&vv.az!==undefined?vv:null};
  // cities: the moon crosses through the middle of the sky above and behind the skyline (lowest point above the tallest tower), not beside the city
  return hgtmSpawn('hgtg_moon',{level:id,x:0,y:0,route:[[0,0,50]],speed:0,far:W*20,cheap:true,tick:hgtgMoonTick,seed:3,moon:M});
}
/* corona: a soft billboard behind the sphere (picture hgt_moon_halo, brightness as alpha), added to the draw list; fades in the haze */
(function(){
  const pi=hgtmPuffImg;hgtmPuffImg=function(v,col){if(v===99){const im=HGTG.haloImg||(HGTG.haloImg=hgtgHaloImg());if(im)return im}
    const nm=['pink1','aqua1','aqua2','lilac1','lilac2','cream1','cream2','pinkstreak'][v&7],im0=IMG['hgt_cloud_'+nm];
    if(im0&&im0.width&&col){const key='c'+(v&7)+'|'+(col[0]>>5)+(col[1]>>5)+(col[2]>>5),C=HGTG.cp||(HGTG.cp={});if(C[key])return C[key];
      const S=128,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d',{willReadFrequently:true}),hh=Math.round(S*im0.height/im0.width),oy=(S-hh)>>1;x.drawImage(im0,0,oy,S,hh);
      const d=x.getImageData(0,0,S,S),a=d.data;for(let y=0;y<S;y++)for(let xx=0;xx<S;xx++){const i=(y*S+xx)*4,l=Math.max(a[i],a[i+1],a[i+2])/255,k=l?1/l:0,sh=1-.3*Math.max(0,Math.min(1,(y-oy)/hh));
        a[i]=Math.min(255,(a[i]*k*.5+col[0]*.5)*sh*(.8+.2*l));a[i+1]=Math.min(255,(a[i+1]*k*.5+col[1]*.5)*sh*(.8+.2*l));a[i+2]=Math.min(255,(a[i+2]*k*.5+col[2]*.5)*sh*(.8+.2*l));a[i+3]=Math.min(255,Math.pow(l,.9)*255*.95)}
      x.putImageData(d,0,0);return C[key]=c}
    return pi(v,col)};
  const post=(out)=>{const m=HGTG.moonI;if(!m||m.o.far===0||!m.zc||m.zc<1||!out||!HGTM.cam)return out;const cam=HGTM.cam,M=m.o.moon;
    const sx=VW/2+F*m.xc/m.zc,sy=HH-F*(m.pz-cam.cz)/m.zc,sr=M.R*3.2*F/m.zc;if(sx+sr<0||sx-sr>VW)return out;
    out.push({k:1,tY:m.zc+M.R*.5,sx,sy,sr,zc:m.zc+M.R*.5,col:[200,190,255],v:99,a:.55*(HGTG.moonK*.5+.5),rot:0});out.sort((a,b)=>b.tY-a.tY);return out};
  const b0=hgtmBegin;hgtmBegin=function(){return post(b0.apply(this,arguments))};
  const d0=hgtmDraw;hgtmDraw=function(e){if(TC)return d0(e);if(!HGTG.flatLevels[LEVEL]||TERR_NOW)return;TC=HGTG_FTC;try{d0(e)}finally{TC=null}}; // flat levels have no TC outside hgtgFlatBegin
  const he=hgtmEnd;hgtmEnd=function(){he();const k=HGTG.moonK||0;if(k>.01){const m=HGTG.moonI,a=k*(.11+.03*Math.sin(G.time*.5)),sx=m&&m.zc>0?Math.max(-VW,Math.min(2*VW,VW/2+F*m.xc/Math.max(1,m.zc))):VW/2;
    SC.save();SC.globalCompositeOperation='lighter';const g=SC.createRadialGradient(sx,HH*.6,0,sx,HH*.6,VW*.95);g.addColorStop(0,'rgba(170,160,255,'+a*1.6+')');g.addColorStop(1,'rgba(120,110,220,'+a*.5+')');SC.fillStyle=g;SC.fillRect(0,0,VW,VH);SC.restore()}};
})();
function hgtgHaloImg(){const im=IMG.hgt_moon_halo||IMG[gArt('hgt_moon_halo',['halo'],'')];if(!im||!im.width)return null;const S=128,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,S,S);
  const d=x.getImageData(0,0,S,S),a=d.data;for(let i=0;i<a.length;i+=4){const l=Math.max(a[i],a[i+1],a[i+2]);a[i+3]=Math.min(255,l*1.1);const k=l?255/l:1;a[i]=Math.min(255,a[i]*k*.9);a[i+1]=Math.min(255,a[i+1]*k*.9);a[i+2]=Math.min(255,a[i+2]*k)}x.putImageData(d,0,0);return c}
/* the moon term in the city light: ambient up a little, cool silver-lilac tint, haze tinted; applied on top of the lamps' night look (returns a copy, never edits it) */
HGTG.lookWrapped=false;
function hgtgWrapLook(){if(HGTG.lookWrapped)return;HGTG.lookWrapped=true;const lf=hgtLookFor;
  hgtLookFor=function(id){const v=lf.apply(this,arguments),k=HGTG.moonK||0;if(k<.01||id<480||id>489)return v;
    return Object.assign({},v,{ambient:v.ambient+.07*k,tint:[v.tint[0]*(1-.07*k),v.tint[1]*(1-.01*k),v.tint[2]*(1+.1*k)],hazeCol:v.hazeCol.map((c,i)=>c+([140,130,205][i]-c)*.22*k),wallGain:v.wallGain*(1+.06*k)})}}
/* keep-out: every other instance is held outside the moon's sphere plus a margin, smoothly; the push is applied after the path update (the raw path is untouched) */
function hgtgMoonPts(I){ // [x,y,z,radius] sample spheres covering an instance
  const sc=I.sc||1;
  if(I.kind==='mesh'){const br=Math.max(.4,I.M.rad*sc*.55);if(I.o.fly)return[[I.x,I.y,I.o.fly?I.pz:I.z,br]];const H=(HGTG.height[I.name]||I.M.rad*1.2)*sc;return[[I.x,I.y,I.z+H,br*.6],[I.x,I.y,I.z+H*.5,br*.6]]}
  if(I.kind==='planet')return[[I.x,I.y,I.pz,I.M.rad*sc]];
  if(I.kind==='cloud')return[[I.x,I.y,I.pz!==undefined?I.pz:I.cz||1,I.r*1.7]];return[];
}
function hgtgMoonGuard(dt){
  const m=HGTG.moonI||(HGTG.moonI=HGTM.inst.find(i=>i.name==='hgtg_moon'));if(!m||m.o.far===0||!m.o.moon)return;
  const M=m.o.moon,keep=M.R*1.12,cx=m.x,cy=m.y,cz=m.pz;
  for(const I of HGTM.inst){if(I===m)continue;const g=I.g||(I.g={}),pts=hgtgMoonPts(I);let px=0,py=0,pzv=0;
    const fly=I.kind!=='mesh'||I.o.fly;
    for(const p of pts){const dx=p[0]-cx,dy=p[1]-cy,dz=p[2]-cz,d=Math.hypot(dx,dy,dz)||1,gap=d-keep-p[3];if(gap<0){
      if(fly){const k=-gap/d,ax=dx*k,ay=dy*k,az=dz*k;if(Math.abs(ax)>Math.abs(px))px=ax;if(Math.abs(ay)>Math.abs(py))py=ay;if(Math.abs(az)>Math.abs(pzv))pzv=az}
      else{const h=Math.hypot(dx,dy)||1,kk=Math.max(0,Math.sqrt(Math.max(0,(keep+p[3])*(keep+p[3])-dz*dz))-h);if(kk>Math.hypot(px,py)){px=dx/h*kk;py=dy/h*kk}}}}
    const mo=g.mo||(g.mo=[0,0,0]),a=Math.min(1,dt*6);mo[0]+=(px-mo[0])*a;mo[1]+=(py-mo[1])*a;mo[2]+=(pzv-mo[2])*a;
    if(Math.abs(mo[0])+Math.abs(mo[1])+Math.abs(mo[2])>1e-3){I.x+=mo[0];I.y+=mo[1];if(I.kind==='mesh'){if(I.o.fly){I.pz+=mo[2];I.z=I.pz}}else if(I.pz!==undefined)I.pz+=mo[2]}
  }
}
/* test: simulate the moon's night and the day at a clock speed over a level, report the smallest gap between the moon surface and any other instance (needs the level to be the current one) */
function hgtgMoonTest(speed,dtStep){
  speed=speed||100;dtStep=dtStep||.05;const out={min:1e9,who:'',steps:0,moonSeen:0};if(!HGTM.cam)return out;
  const c0=G.clock,t0=G.time;G.clock=17*60;const total=(15*60)/(speed/60*dtStep);
  for(let i=0;i<total;i++){G.clock+=speed/60*dtStep;G.time+=dtStep;HGTM.tLast=G.time-dtStep;hgtmUpdate(dtStep);
    const m=HGTM.inst.find(x=>x.name==='hgtg_moon');if(!m||m.o.far===0)continue;out.moonSeen++;const R=m.o.moon.R;
    for(const I of HGTM.inst){if(I===m)continue;for(const p of hgtgMoonPts(I)){const d=Math.hypot(p[0]-m.x,p[1]-m.y,p[2]-m.pz)-R-p[3];if(d<out.min){out.min=d;out.who=I.name}}}out.steps++}
  G.clock=c0;G.time=t0;return out;
}

HGTM.budget=4.5; // far horizon creatures are cheap and exempt (o.cheap); near ones stop when the frame budget is spent

/* peacock roosts never sit on or beside a lookout: any peacock record within 6.5 cells of the lookout cell is moved to open ground at least 7 cells away */
HGTG.roostFixed={};
function hgtgFixRoosts(id){
  if(HGTG.roostFixed[id])return;const v=HGTG.vista&&HGTG.vista[id],inf=hgtgInfo(id);if(!v||!inf)return;HGTG.roostFixed[id]=1;const W=inf.W;let moved=0;
  for(const s of HGTM.spawns[id]||[]){if(HGTG.kind[s.name]!=='peacock')continue;const r=s.o.route&&s.o.route[0];const px=r?r[0]:s.o.x,py=r?r[1]:s.o.y;if(Math.hypot(px-v.x,py-v.y)>=6.5)continue;
    let best=null;for(let dy=-16;dy<=16;dy++)for(let dx=-16;dx<=16;dx++){const x=(px+dx)|0,y=(py+dy)|0;if(x<2||y<2||x>=W-2||y>=inf.H-2)continue;const c=y*W+x;if(!inf.open[c]||inf.bad[c]||inf.D[c]<2||!inf.flat[c])continue;const dv=Math.hypot(x-v.x,y-v.y);if(dv<7)continue;const d=Math.hypot(dx,dy);if(!best||d<best[0])best=[d,x,y]}
    if(best){const cs=[[best[1]+.5,best[2]+.5]];s.o.x=cs[0][0];s.o.y=cs[0][1];s.o.route=cs;moved++}}
  return moved}
/* HGTG.view(cls,level,shotName): moves the party to the level's main lookout and finds the facing and look-up pitch that show a class best
   (cls: moon, scorp, planet, fog, bulk, stilt, peacock, levi). Returns {f,pitch,score}; with shotName and HGTG.shotURL it posts a jpeg of the canvas. */
HGTG.shotURL='http://localhost:8901/';
HGTG.view=async function(cls,lv,shotName,hour){
  const v=HGTG.vista&&HGTG.vista[lv];if(!v)return null;hour=hour===undefined?22:hour;const match=I=>cls==='moon'?I.name==='hgtg_moon':cls==='scorp'?I.name==='hgtg_scorpionfish':cls==='levi'?/levi_/.test(I.name):cls==='planet'?I.kind==='planet'&&I.name!=='hgtg_moon':cls==='bulk'?/bulk/.test(I.name):cls==='stilt'?/stilt/.test(I.name):cls==='peacock'?/peacock/.test(I.name):false;
  const frame=async n=>{for(let i=0;i<n;i++){G.time+=.05;render3D()}ctx.setTransform(2,0,0,2,0,0);ui(.016)};let best=null;
  const go=f=>{goToLevel(lv,{x:v.x,y:v.y,f});G.C.a=[-Math.PI/2,0,Math.PI/2,Math.PI][f];G.state='play';G.menu=false;G.clock=hour*60};
  for(const p of[0,25,45,70])for(let f=0;f<4;f++){go(f);HGTE.pitch=p;HGTE.pitchT=p;await frame(3);
    let sc=0;if(cls==='fog')sc=HGTM.out.filter(e=>e.k===1).length+(HGTM.fog||0)*50;else for(const I of HGTM.inst)if(match(I)&&I.zc>0&&Math.abs(I.xc)<I.zc*.8){for(const e of HGTM.out)if(e.k===0&&Math.abs(e.tY-Math.max(.2,I.zc))<1.5)sc+=e.w*e.h}
    if(!best||sc>best.score)best={f,pitch:p,score:sc}}
  go(best.f);HGTE.pitch=best.pitch;HGTE.pitchT=best.pitch;await frame(5);
  if(shotName&&HGTG.shotURL)await fetch(HGTG.shotURL+shotName+'.jpg',{method:'POST',body:ctx.canvas.toDataURL('image/jpeg',.9)});HGTE.pitch=0;HGTE.pitchT=0;return best};

/* HGTG.view2(cls,level,shotName): aims the camera into the lookout's clear sector (G.C.a = sector azimuth) with a pitch that frames the class,
   at night for moon/planet/scorp (hour 23.5). Returns the setup; posts a jpeg when HGTG.shotURL is set. */
HGTG.view2=async function(cls,lv,shotName,hour){
  const v=HGTG.vista&&HGTG.vista[lv];if(!v||v.az===undefined)return null;hour=hour===undefined?23.5:hour;const pitch={moon:45,scorp:25,planet:40,fog:0,levi:30}[cls]||0;
  G.clock=hour*60;goToLevel(lv,{x:v.x,y:v.y,f:0});G.C.a=v.az;G.state='play';G.menu=false;G.clock=hour*60;HGTE.pitch=pitch;HGTE.pitchT=pitch;
  for(let i=0;i<8;i++){G.C.a=v.az;G.time+=.05;render3D()}ctx.setTransform(2,0,0,2,0,0);ui(.016);
  if(shotName&&HGTG.shotURL)await fetch(HGTG.shotURL+shotName+'.jpg',{method:'POST',body:ctx.canvas.toDataURL('image/jpeg',.9)});HGTE.pitch=0;HGTE.pitchT=0;return{az:v.az,width:v.width,pitch,ms:HGTM.ms}};

/* statics (town giants and peacocks) must stand inside the map on open ground: any record outside, on a wall or over water is moved to the nearest open flat cell (D >= 3) or hidden */
HGTG.staticFixed={};
function hgtgFixStatics(id){
  if(HGTG.staticFixed[id])return;const inf=hgtgInfo(id);if(!inf)return;HGTG.staticFixed[id]=1;const W=inf.W,H=inf.H;let moved=0;
  for(const s of HGTM.spawns[id]||[]){const k=HGTG.kind[s.name];if(!(k==='bulk'||k==='peacock'||k==='stilt')||s.o.rim)continue;const r=s.o.route&&s.o.route[0],x=r?r[0]:s.o.x,y=r?r[1]:s.o.y;if(x===undefined)continue;
    const c=(y|0)*W+(x|0),ok=x>=2&&y>=2&&x<W-2&&y<H-2&&inf.open[c]&&!inf.bad[c];if(ok)continue;
    let best=null;for(let dy=-26;dy<=26;dy++)for(let dx=-26;dx<=26;dx++){const xx=(x|0)+dx,yy=(y|0)+dy;if(xx<3||yy<3||xx>=W-3||yy>=H-3)continue;const cc=yy*W+xx;if(!inf.open[cc]||inf.bad[cc]||inf.D[cc]<3||!inf.flat[cc])continue;const d=Math.hypot(dx,dy);if(!best||d<best[0])best=[d,xx,yy]}
    if(best&&(!r||s.o.route.length<2)){s.o.x=best[1]+.5;s.o.y=best[2]+.5;s.o.route=[[s.o.x,s.o.y]];moved++}else s.o.minD=1e9}
  return moved}
/* HGTG.viewSleeper(level, shotName): a street-level shot of the sleeping giant, from 24 cells down the straight street toward the party start */
HGTG.viewSleeper=async function(lv,shotName){
  const st=HGTG.stat[lv]&&HGTG.stat[lv].sleeper,vw=HGTG.stat[lv]&&HGTG.stat[lv].sleeperView;if(!st||!vw)return null;
  goToLevel(lv,{x:vw[0],y:vw[1],f:0});G.state='play';G.menu=false;HGTE.pitch=60;HGTE.pitchT=60;const ang=()=>Math.atan2(st[1]-vw[1],st[0]-vw[0]);for(let i=0;i<8;i++){G.C.a=ang();G.time+=.05;render3D()}ctx.setTransform(2,0,0,2,0,0);ui(.016);
  if(shotName&&HGTG.shotURL)await fetch(HGTG.shotURL+shotName+'.jpg',{method:'POST',body:ctx.canvas.toDataURL('image/jpeg',.9)});HGTE.pitch=0;HGTE.pitchT=0;return{from:vw,sleeper:st,dist:Math.round(Math.hypot(st[0]-vw[0],st[1]-vw[1])),ms:HGTM.ms}};
