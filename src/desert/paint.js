/* ==========================================================================
   PAINTERLY TOOLKIT. Creatures and items are painted as raster art, never as flat outlined shapes:
   every form is filled, then shaded with soft blurred layers clipped to its shape, given a soft dark rim
   and a little grain. (The blur is done by scaling down and up, so it works where canvas filters do not.)
   ========================================================================== */
function pc(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function pBlur(src,k){ // a soft blur by shrinking and growing the picture again
  const w=src.width,h=src.height,sw=Math.max(2,Math.round(w/k)),sh=Math.max(2,Math.round(h/k)),a=pc(sw,sh),ax=a.getContext('2d');
  ax.imageSmoothingEnabled=true;ax.imageSmoothingQuality='high';ax.drawImage(src,0,0,sw,sh);
  const b=pc(sw*2,sh*2),bx=b.getContext('2d');bx.imageSmoothingEnabled=true;bx.drawImage(a,0,0,sw*2,sh*2);
  const o=pc(w,h),ox=o.getContext('2d');ox.imageSmoothingEnabled=true;ox.drawImage(b,0,0,w,h);return o;
}
function pGrain(t,w,h,amt,seed){
  const im=t.getImageData(0,0,w,h),d=im.data;let a=(seed||1234567)|0;
  for(let i=0;i<d.length;i+=4){if(d[i+3]<8)continue;a=(Math.imul(a,1664525)+1013904223)|0;const n=((a>>>16)&255)/255-.5,k=1+n*amt;d[i]=Math.min(255,d[i]*k);d[i+1]=Math.min(255,d[i+1]*k);d[i+2]=Math.min(255,d[i+2]*k)}
  t.putImageData(im,0,0);
}
// A form: fill a shape, shade it softly inside itself, darken its rim a little, give it a shadow under it.
//   shape(ctx)  draws the outline path (it must call beginPath itself)
//   fill        a colour, or (ctx)=>gradient
//   shade(ctx)  paints shadows and lights; whatever it paints is blurred and kept inside the shape
function pForm(out,w,h,shape,fill,shade,o){
  o=o||{};const T=pc(w,h),t=T.getContext('2d');
  t.save();shape(t);t.fillStyle=typeof fill==='function'?fill(t):fill;t.fill();t.restore();
  if(shade){const S=pc(w,h);shade(S.getContext('2d'));t.save();t.globalCompositeOperation='source-atop';t.drawImage(pBlur(S,o.blur||3),0,0);t.restore()}
  if(o.fine){const S=pc(w,h);o.fine(S.getContext('2d'));t.save();t.globalCompositeOperation='source-atop';t.drawImage(S,0,0);t.restore()} // crisp detail on top of the soft shading
  if(o.rim!==0){const R=pc(w,h),r=R.getContext('2d');shape(r);r.strokeStyle='rgba('+(o.rimCol||'22,12,4')+','+(o.rim||.55)+')';r.lineWidth=o.rimW||7;r.stroke();t.save();t.globalCompositeOperation='source-atop';t.drawImage(pBlur(R,1.6),0,0);t.restore()}
  if(o.grain)pGrain(t,w,h,o.grain,o.seed);
  if(o.shadow){const D=pc(w,h),d=D.getContext('2d');d.drawImage(T,0,0);d.globalCompositeOperation='source-in';d.fillStyle='#000';d.fillRect(0,0,w,h);out.save();out.globalAlpha=o.shadow;out.drawImage(pBlur(D,3),o.sx===undefined?3:o.sx,o.sy===undefined?5:o.sy);out.restore()}
  out.drawImage(T,0,0);return T;
}
// a tapering limb or tail segment along a line of points, as a smooth outline path
function pLimb(pts,w0,w1){
  return t=>{
    const n=pts.length,L=[],R=[];
    for(let i=0;i<n;i++){
      const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,w=(w0+(w1-w0)*i/(n-1))/2;
      L.push([pts[i][0]+nx*w,pts[i][1]+ny*w]);R.push([pts[i][0]-nx*w,pts[i][1]-ny*w]);
    }
    t.beginPath();t.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)t.lineTo(L[i][0],L[i][1]);
    const e=pts[n-1],te=(w1/2);t.arc(e[0],e[1],te,Math.atan2(L[n-1][1]-e[1],L[n-1][0]-e[0]),Math.atan2(R[n-1][1]-e[1],R[n-1][0]-e[0]),false);
    for(let i=n-1;i>=0;i--)t.lineTo(R[i][0],R[i][1]);t.closePath();
  };
}
// shade a limb cylinder-fashion: a shadow along the side away from the light, a highlight along the side towards it
function pLimbShade(pts,w0,w1,lx,ly,dark,light){
  return s=>{
    const n=pts.length;
    for(let i=0;i<n-1;i++){
      const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;let nx=-dy/len,ny=dx/len;if(nx*lx+ny*ly<0){nx=-nx;ny=-ny}
      const w=(w0+(w1-w0)*i/(n-1));
      s.lineCap='round';s.strokeStyle=dark;s.lineWidth=w*.55;s.beginPath();s.moveTo(a[0]-nx*w*.32,a[1]-ny*w*.32);s.lineTo(b[0]-nx*w*.32,b[1]-ny*w*.32);s.stroke();
      s.strokeStyle=light;s.lineWidth=w*.28;s.beginPath();s.moveTo(a[0]+nx*w*.2,a[1]+ny*w*.2);s.lineTo(b[0]+nx*w*.2,b[1]+ny*w*.2);s.stroke();
    }
  };
}
// recolour a painted picture into a new palette, keeping all of its painted detail
function pToneMap(im,dark,light,gain,gamma,dust){
  const c=pc(im.width,im.height),x=c.getContext('2d');x.drawImage(im,0,0);
  const id=x.getImageData(0,0,c.width,c.height),d=id.data,W=c.width,H=c.height;
  for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const i=(y*W+xx)*4;if(d[i+3]===0)continue;
    let L=(d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255;L=Math.pow(Math.min(1,Math.max(0,(L-.02)*gain)),gamma);
    let r=dark[0]+(light[0]-dark[0])*L,g=dark[1]+(light[1]-dark[1])*L,b=dark[2]+(light[2]-dark[2])*L;
    if(dust){const t=Math.max(0,(y/H-.62)/.38);r+=(222-r)*t*dust;g+=(196-g)*t*dust;b+=(150-b)*t*dust} // sand clings to the lower body
    d[i]=r;d[i+1]=g;d[i+2]=b}
  x.putImageData(id,0,0);return c;
}
function pFlip(im){return mkCanvas(im.width,im.height,(x,w)=>{x.translate(w,0);x.scale(-1,1);x.drawImage(im,0,0)})}
