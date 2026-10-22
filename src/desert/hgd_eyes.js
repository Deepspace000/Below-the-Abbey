/* ==========================================================================
   WATCHING EYES OF THE UNDERLEVEL (prefix hgde / HGDE). In the pitch dark of the Underlevel, pairs and clusters of red glowing eyes hang in the corridors and stare at the party from far away: about 500 of them,
   at the far ends of straight corridors, at dead ends and round the nests and the sea. They are the red eyes of the painted slime monsters (the red pixels of the pictures, with a glow), they carry their own light so they
   show from a long way off in the dark, they blink now and then, and they are only a stare: nothing there can be fought. Drawn as sprites by a spriteList wrapper.
   ========================================================================== */
const HGDE={imgs:null,list:null,n:0};
function hgdeImgs(){
  if(HGDE.imgs)return HGDE.imgs;
  const names=['hgslime2','hgslime4','hgslime6','hgslime2','hgslime4','hgslime6','hgslime3','hgslime0','hgslime9','hgslime1'],out=[];
  for(const n of names){const src=IMG['art_'+n];if(!src||!src.width)return null;
    const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.drawImage(src,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data;
    // the eyes: bright red blobs (connected pieces of red); small stray reds (drips, mouths) are dropped, and only the biggest blobs are kept
    const Wd=c.width,Hd=c.height,lab=new Int32Array(Wd*Hd),areas=[];let nl=0;const isRed=k=>p[k+3]>40&&p[k]>150&&p[k+1]<100&&p[k+2]<100&&p[k]>p[k+1]*2;
    for(let sy=0;sy<Hd;sy++)for(let sx=0;sx<Wd;sx++){const si=sy*Wd+sx;if(lab[si]||!isRed(si*4))continue;nl++;let n=0;const st=[si];lab[si]=nl;while(st.length){const q=st.pop();n++;const qx=q%Wd,qy=(q/Wd)|0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=qx+a,ny=qy+b;if(nx<0||ny<0||nx>=Wd||ny>=Hd)continue;const ni=ny*Wd+nx;if(!lab[ni]&&isRed(ni*4)){lab[ni]=nl;st.push(ni)}}}areas[nl]=n}
    const big=Math.max(0,...areas.filter(Boolean)),keep=new Set();for(let l=1;l<=nl;l++)if(areas[l]>=Math.max(12,big*.25))keep.add(l);
    let x0=1e9,y0=1e9,x1=-1,y1=-1;
    for(let k=0;k<p.length;k+=4){const px=(k>>2)%Wd,py=((k>>2)/Wd)|0;
      if(keep.has(lab[k>>2])){p[k]=255;p[k+1]=Math.min(60,p[k+1]);p[k+2]=Math.min(50,p[k+2]);p[k+3]=255;if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py}else p[k+3]=0}
    if(x1<0)continue;
    // a pair or a cluster of eyes only: the topmost ones, within a box about as tall as 0.8 of its width
    {const cut=y0+Math.max(20,Math.round((x1-x0+1)*.8));if(y1>cut){y1=cut;let nx0=1e9,nx1=-1;for(let yy=y0;yy<=y1;yy++)for(let xx=0;xx<Wd;xx++)if(p[(yy*Wd+xx)*4+3]){if(xx<nx0)nx0=xx;if(xx>nx1)nx1=xx}if(nx1>=0){x0=nx0;x1=nx1}}}
    x.putImageData(d,0,0);
    const pad=Math.max(16,Math.round(Math.max(x1-x0,y1-y0)*.18)),w=x1-x0+1+pad*2,h=y1-y0+1+pad*2,o=document.createElement('canvas');o.width=w;o.height=h;const ox=o.getContext('2d');
    ox.drawImage(c,x0,y0,x1-x0+1,y1-y0+1,pad,pad,x1-x0+1,y1-y0+1);
    // the glow round the eyes
    const bl=document.createElement('canvas');bl.width=w;bl.height=h;const bx=bl.getContext('2d');bx.filter='blur('+Math.max(4,pad*.45)+'px)';bx.drawImage(o,0,0);bx.filter='blur('+Math.max(9,pad*.9)+'px)';bx.globalAlpha=.9;bx.drawImage(o,0,0);bx.globalAlpha=.8;bx.drawImage(o,0,0);
    ox.globalCompositeOperation='lighter';ox.drawImage(bl,0,0);
    out.push({img:o,aspect:w/h})}
  if(out.length<4)return null;return HGDE.imgs=out}
function hgdeBuild(U){
  if(U._hgde)return;const rows=U.rows,H=rows.length,W=rows[0].length,rnd=hgdmRng(476900),open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const lad=(U._hgdu&&U._hgdu.ladders)||[],near=(x,y,r)=>lad.some(l=>Math.hypot(l.ax-x,l.ay-y)<r);
  const DV=[[0,-1],[1,0],[0,1],[-1,0]],cand=[];
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y)||near(x,y,10))continue;
    // how far the corridor runs straight away from this cell, in each direction; a cell is a good spot when it is the far end of a long run, or a dead end
    let best=0,deg=0;for(const [a,b] of DV){if(open(x+a,y+b))deg++;let n=0;while(n<30&&open(x-a*(n+1),y-b*(n+1)))n++;if(!open(x+a,y+b)&&n>best)best=n}
    if(deg===1||best>=5)cand.push([x,y,best+(deg===1?6:0)])}
  cand.sort(()=>rnd()-.5);const out=[];
  for(const c of cand){if(out.length>=520)break;if(out.some(o=>Math.abs(o.x-c[0])+Math.abs(o.y-c[1])<6))continue;
    out.push({x:c[0],y:c[1],k:(rnd()*1000)|0,h:.2+rnd()*.95,w:.55+rnd()*.5,ph:rnd()*30,per:4+rnd()*6})}
  U._hgde=out;HGDE.n=out.length}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  try{if(LEVEL===476&&G.state==='play'){const U=LEVELS[476],ims=hgdeImgs();if(U&&ims){if(!U._hgde)hgdeBuild(U);const t=G.time,px=G.P.x,py=G.P.y;
    for(const e of U._hgde){const dx=e.x-px,dy=e.y-py;if(dx*dx+dy*dy>1600||(dx*dx+dy*dy)<2.5)continue;
      const im=ims[e.k%ims.length],ph=(t+e.ph)%e.per,blink=ph<.16?Math.abs(ph-.08)/.08:1; // a blink now and then
      const a=blink*(.82+.18*Math.sin(t*1.3+e.ph));
      L.push({x:e.x+.5,y:e.y+.5,img:im.img,w:e.w*(im.aspect>1.8?1.3:1),bob:e.h,fade:Math.max(0,Math.min(1,a)),lift:1})}}}}catch(err){console.error('hgde',err)}
  return L}}
