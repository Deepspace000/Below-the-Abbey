/* ---- painted pictures for the spell effects that used to be drawn as stiff lines (assets/fx_<name>.png, light on black, added over the view) ---- */
{
  for(const n of ['shockring','runecircle','burst','flare','crescent','streaks','impact','arrowfly','vines','spikes','crack','chains','net','clock','arc','claw','bolt'])loadImg('fx_'+n,'assets/fx_'+n+'.png');
  const TCACHE={};
  // the picture, recoloured to a spell colour when one is given (keeps the painted light and shade)
  const pic=(n,col)=>{const im=IMG['fx_'+n];if(!im||!im.width)return null;if(!col||(col[0]==='#'&&col.length>=7&&Math.min(parseInt(col.slice(1,3),16),parseInt(col.slice(3,5),16),parseInt(col.slice(5,7),16))>=150))return im;const k=n+col;if(TCACHE[k])return TCACHE[k];
    const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);g.globalCompositeOperation='color';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);return TCACHE[k]=c};
  const at=(im,x,y,w,h,rot,a)=>{ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,a));ctx.translate(x,y);if(rot)ctx.rotate(rot);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore()};
  const fade=(u,i)=>Math.min(1,u/(i||.12))*Math.pow(1-u,1.2);
  const K={
    ring(o,u){const r=o.r1*sE(u);if(r<2)return true;const flat=o.fl<.7,im=pic(flat?'shockring':'runecircle',o.c);if(!im)return false;const w=r*(flat?2.5:2.3);at(im,o.x,o.y,w,w*(flat?1:Math.max(.5,o.fl)),0,Math.min(1,(1-u)*(o.a||1)*1.3));return true},
    bolt(o,u){const im=pic('arc','#8aa8ff');if(!im)return false;const fi=Math.floor(o.t*28),a=(u<.7?1:(1-u)/.3)*(fi%3===2?.55:1),L=o.y+6,th=Math.max(40,70*(o.z||1));ctx.save();ctx.globalAlpha=a;ctx.translate(o.x,(o.y-6)/2);ctx.rotate(Math.PI/2);if(fi%2)ctx.scale(1,-1);ctx.drawImage(im,-L/2,-th/2,L,th);ctx.restore();return true},
    arc(o,u){const im=pic('arc','#7898ff');if(!im)return false;const fi=Math.floor(o.t*30),dx=o.x1-o.x0,dy=o.y1-o.y0,L=Math.hypot(dx,dy)+10;ctx.save();ctx.globalAlpha=(u<.6?1:(1-u)/.4);ctx.translate((o.x0+o.x1)/2,(o.y0+o.y1)/2);ctx.rotate(Math.atan2(dy,dx));if(fi%2)ctx.scale(1,-1);ctx.drawImage(im,-L/2,-22,L,44);ctx.restore();return true},
    cres(o,u){const im=pic('crescent',o.c);if(!im)return false;const pr=Math.min(1,u*3.2),w=o.r*2.3*(.7+.3*sE(pr));at(im,o.x,o.y,w,w,-.35+pr*.5,fade(u,.1)*1.2);return true},
    slash(o,u){const im=pic('claw',o.c);if(!im)return false;const w=o.len*2.6*Math.max(.8,(o.n||3)/3);at(im,o.x,o.y,w,w,-.1,fade(u,.1)*1.3);return true},
    speed(o,u){const im=pic('streaks');if(!im)return false;const p=Math.min(1,u/.5),a=Math.pow(1-u,1.2);for(let i=0;i<6;i++){const an=i*TAU/6+.3,d=(1-p)*120+36;at(im,o.x+Math.cos(an)*d,o.y+Math.sin(an)*d*.8,80,80,an+Math.PI,a*.9)}return true},
    rays(o,u){const im=pic('burst',o.c);if(!im)return false;const R=o.r*(.35+.65*sE(Math.min(1,u*2.5)));at(im,o.x,o.y,R*2.2,R*2.2,o.t*(o.sp||1.2)*.4,Math.min(1,u*8)*Math.pow(1-u,1.3)*1.1);return true},
    cross(o,u){const im=pic('flare');if(!im)return false;const L=o.r*sE(Math.min(1,u*3));at(im,o.x,o.y,L*2.2,L*2.2,0,Math.min(1,u*10)*Math.pow(1-u,1.2));return true},
    star(o,u){const im=pic('flare',o.c);if(!im)return false;const r=o.r*(.4+.6*sE(u));at(im,o.x,o.y,r*2.6,r*2.6,(o.rot||0)*.3,1-u);return true},
    spikes(o,u){const im=pic('spikes');if(!im)return false;const gr=Math.min(1,u*6),a=u>.55?1-(u-.55)/.45:1,w=(o.n*13*o.z)+40,h=w*gr;if(h<2)return true;ctx.save();ctx.globalAlpha=a;ctx.drawImage(im,o.x-w/2,o.y+22*o.z-h*.95,w,h);ctx.restore();return true},
    roots(o,u){const im=pic('vines');if(!im)return false;const p=sE(Math.min(1,u*2.4)),a=u>.65?1-(u-.65)/.35:1,w=110*o.z;if(p<.03)return true;ctx.save();ctx.globalAlpha=a;ctx.drawImage(im,o.x-w/2,o.y+22*o.z-w*.95*p,w,w*p);ctx.restore();return true},
    crack(o,u){const im=pic('crack');if(!im)return false;const p=Math.min(1,u*4),a=u>.6?1-(u-.6)/.4:1,w=130*o.z*(.5+.5*p);at(im,o.x,o.y+10*o.z,w,w,0,a);return true},
    chains(o,u,ex,ey){const im=pic('chains');if(!im)return false;const p=sE(Math.min(1,u*5)),w=110*o.z;at(im,ex,ey-6*o.z,w*(.6+.4*p),w*(.6+.4*p),Math.sin(o.t*6)*.04,Math.min(1,(1-u)*1.7));return true},
    net(o,u,ex,ey){const im=pic('net');if(!im)return false;const R=36*o.z,a=Math.min(1,u*6)*(u>.6?1-(u-.6)/.4:1);at(im,ex,ey,R*2.6,R*2.6,u*.3,a);return true},
    clock(o,u){const im=pic('clock');if(!im)return false;const R=o.r*(.6+.4*sE(Math.min(1,u*3))),a=Math.min(1,u*6)*Math.min(1,(1-u)*2.5);at(im,o.x,o.y,R*2.4,R*2.4,0,a);return true},
    stuck(o,u){const im=pic('arrowfly');if(!im)return false;const a=u<.7?1:1-(u-.7)/.3,s=(22*o.z+8)*2.6+20,j=u<.12?Math.sin(u*160)*1.2:0;ctx.save();ctx.globalAlpha=a;ctx.translate(o.x+j,o.y);ctx.rotate(o.ang);ctx.drawImage(im,-s*.96,-s/2,s,s);ctx.restore();return true}
  };
  const _od=spObjDraw;
  spObjDraw=function(o,h){
    const f=K[o.k];if(!f)return _od.apply(this,arguments);
    const u=o.t/o.d;if(u>=1)return false;
    const e=o.e,ex=e&&e.sx?sCl(e.sx,10,410):o.x,ey=e&&e.sy?sCl(e.sy,20,195):o.y;
    let ok=false;ctx.save();ctx.globalCompositeOperation='lighter';
    try{ok=f(o,u,ex,ey)}catch(err){ok=false}
    ctx.restore();ctx.globalAlpha=1;
    return ok?true:_od.apply(this,arguments)};
  // an arrow in flight: the painted arrow with its glowing trail, tip at the given point
  const _ad=spArrowDraw;
  spArrowDraw=function(x,y,ang,len,P,al,long){
    const im=pic('arrowfly');if(!im)return _ad.apply(this,arguments);
    const s=len*2.5+(long?70:26);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=al;ctx.translate(x,y);ctx.rotate(ang);ctx.drawImage(im,-s*.96,-s/2,s,s);ctx.restore();ctx.globalAlpha=1};
}
