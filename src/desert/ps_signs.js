/* ps_signs.js: the castle's signs (Pale Spire, every castle level 9710 to 9800 and the rest of PSP.LEVELS).
   The engine's shopSign() paints every sign_gy board with a warm tan tint and cream lettering, which reads as a village inn sign on a bracket in the castle.
   Here the same bracket picture (signb0 / signb1) is re-toned into a black wrought-iron plaque with cool blue-black plate and pale silver lettering. Only castle levels are
   affected: every other area still gets the original shopSign. The sign shows the place name only (ps_curate.js empties the second line). */
const PSSIGN_CACHE={};
function pssignOn(){return typeof LEVEL!=='undefined'&&typeof PSP!=='undefined'&&PSP.LEVELS&&PSP.LEVELS.some(l=>l.id===LEVEL)}
function pssignMake(d,flip){
  const key=(d.x*31+d.y)%2,nm=String(d.txt[0]),id=key+'|'+nm;
  if(PSSIGN_CACHE[id])return PSSIGN_CACHE[id];
  const base=IMG['signb'+key];if(!base)return null;
  const w=base.width,h=base.height;
  const mk=fl=>mkCanvas(w,h,x=>{
    if(fl){x.save();x.translate(w,0);x.scale(-1,1);x.drawImage(base,0,0);x.restore()}else x.drawImage(base,0,0);
    const im=x.getImageData(0,0,w,h),a=im.data;
    for(let py=0;py<h;py++)for(let px=0;px<w;px++){const o=(py*w+px)*4;if(!a[o+3])continue;
      const l=(a[o]*.3+a[o+1]*.59+a[o+2]*.11)/255,u=fl?(w-1-px)/w:px/w,board=u>.12&&u<.93&&py>h*.44;
      let v;if(board)v=.07+l*.2+(l>.42?(l-.42)*.55:0);else v=.06+l*.5;     // dark plate with a lit rim; the bracket stays black iron
      a[o]=Math.min(255,255*v*.8);a[o+1]=Math.min(255,255*v*.92);a[o+2]=Math.min(255,255*v*1.12)}
    x.putImageData(im,0,0);
    x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
    const cx=w*(fl?.465:.535),mw=w*.7,fam='Georgia,serif';let fs=h*.15;x.font=`bold ${fs}px ${fam}`;let tw=x.measureText(nm).width,sx=1;
    if(tw>mw){sx=Math.max(.64,mw/tw);tw*=sx}while(tw>mw&&fs>10){fs-=2;x.font=`bold ${fs}px ${fam}`;tw=x.measureText(nm).width*sx}
    x.save();x.translate(cx,h*.72);x.scale(sx,1);x.lineWidth=Math.max(3,fs*.14);x.strokeStyle='rgba(2,4,8,.95)';x.strokeText(nm,0,0);x.fillStyle='#d6e2ea';x.fillText(nm,0,0);x.restore();
  });
  const c0=mk(false);c0.alt=mk(true);return PSSIGN_CACHE[id]=c0}
{const _s=shopSign;shopSign=function(d){if(d&&d.k==='sign_gy'&&d.txt&&pssignOn()){try{const c=pssignMake(d);if(c)return c}catch(e){console.error('ps sign',e)}}return _s.apply(this,arguments)}}

/* the castle sign is a flat plaque on the wall. The engine hangs a sign as a shop blade sign (board standing out from the wall, its face along the wall's direction), which is edge-on when the party looks straight at the wall it
   is fixed to: a 15 pixel speck from the end of a corridor, invisible from three squares. In the castle every sign_gy is turned into a flat wall picture (drawn in true perspective like a painting): full face from the front, narrower
   at an angle, always one size (about 0.95 of a cell wide, as wide as a door leaf), at the same height. */
const PSSIGN_FLAT={};
function pssignFlat(nm){
  if(PSSIGN_FLAT[nm])return PSSIGN_FLAT[nm];
  const w=384,h=128;
  return PSSIGN_FLAT[nm]=mkCanvas(w,h,x=>{
    const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0b0f15');g.addColorStop(1,'#05070b');
    x.fillStyle='#1c242c';x.fillRect(0,0,w,h);                              // iron frame
    x.fillStyle='#050608';x.fillRect(4,4,w-8,h-8);x.fillStyle='#3b4a56';x.fillRect(8,8,w-16,2);x.fillRect(8,h-10,w-16,2);   // rim light
    x.fillStyle=g;x.fillRect(10,10,w-20,h-20);
    x.fillStyle='#53636f';for(const[px,py]of[[18,18],[w-18,18],[18,h-18],[w-18,h-18]]){x.beginPath();x.arc(px,py,4.5,0,7);x.fill()}   // rivets
    x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
    const mw=w-76,fam='Georgia,serif';let fs=h*.42,sx=1;x.font=`bold ${fs}px ${fam}`;let tw=x.measureText(nm).width;
    if(tw>mw){sx=Math.max(.6,mw/tw);tw*=sx}while(tw>mw&&fs>14){fs-=2;x.font=`bold ${fs}px ${fam}`;tw=x.measureText(nm).width*sx}
    x.save();x.translate(w/2,h/2+2);x.scale(sx,1);x.lineWidth=Math.max(3,fs*.14);x.strokeStyle='rgba(2,4,8,.95)';x.strokeText(nm,0,0);x.fillStyle='#d6e2ea';x.fillText(nm,0,0);x.restore();
  })}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  if((pssignOn()||(typeof NT!=='undefined'&&LEVEL===NT.BASE))&&!window.PSSIGN_FLATOFF)for(const s of L){const d=s.decor;if(!d||d.k!=='sign_gy'||!s.hang||!d.txt||!d.wd)continue;
    try{const nm=String(d.txt[0]);s.img=pssignFlat(nm);const k=s.hang;s.hang=null;s.mount=null;s.flat=[k[0],k[1]];s.pic=1;
      s.x=d.x+.5+k[0]*.47;s.y=d.y+.5+k[1]*.47;s.w=.95;s.bob=Math.max(.3,Math.min(.62,CEILH-.5))}catch(e){console.error('ps sign flat',e)}}
  return L}}

/* the wall torches: the engine draws one painted torch (wtorch0..2, an iron bracket and a cloth-wrapped head, orange-brown) on every wall torch. In the castle they are re-toned to black iron and pewter, and put back
   when the party leaves the castle. */
const PSS_TORCH={};
function pssTorches(n){
  const on=typeof PSP!=='undefined'&&PSP.LEVELS&&PSP.LEVELS.some(l=>l.id===n);
  for(let q=0;q<4;q++){const k='wtorch'+q,cur=IMG[k];if(!cur||!cur.width)continue;
    let e=PSS_TORCH[k];if(!e){e=PSS_TORCH[k]={orig:cur,cast:null};try{e.cast=pswToneCanvas(cur,(a,i)=>{PSW_OPS.warm(a,i);PSW_OPS.purple(a,i);a[i]*=.8;a[i+1]*=.82;a[i+2]*=.9})}catch(er){e.cast=null}}
    IMG[k]=on&&e.cast?e.cast:e.orig}}
{const _ll=loadLevel;loadLevel=function(n){const r=_ll.apply(this,arguments);try{pssTorches(n)}catch(e){console.error('ps torches',e)}return r}}

/* the Glorm meshes (hgt_giants.js): a level that has raised floors (terrace) was filled by hgtgAuto with the Hollow's own creatures and sky: a peacock, a moth, a dragonfly, stilt walkers, lilac and pink spires, planets and white clouds,
   standing in the castle kitchens and cloister (the white hard-edged "fog" slabs, the pink blob in the scullery, the lilac moth wing). None of that belongs in the castle: no mesh, planet or cloud is drawn on a castle level. */
{const _b=hgtmBegin;hgtmBegin=function(){if(pssignOn())return [];return _b.apply(this,arguments)}}
