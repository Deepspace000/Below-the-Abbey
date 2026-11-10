/* ==========================================================================
   THE PALE SPIRE: ITS PICTURES ARE PUT AWAY WHEN THE PARTY HAS LEFT (prefix PSPARK).
   The Spire brings about 880 pictures of its own, and makes worked copies of about 200 of them (arches with their openings cut, retoned banners, stand-ins).
   Nothing outside the Spire draws them, but they stayed in memory for the rest of the session.
   Now, when the party has been outside the Spire for PSPARK.MIN seconds (three minutes) in a row:
     - every picture under a ps_ name leaves IMG;
     - a plain picture is remembered by its address only (it comes back from the browser's own store of files);
     - a worked copy (a canvas) is kept as a packed PNG, with the marks the other Spire files put on it (_ps2, _rt and so on), so it comes back as it was with no step run twice (the soft edge of a see-through picture can come back one shade off; nothing else changes).
   PSP.ready goes back to false, so the gates of ps_glue.js (goToLevel, jumpToLevel, restore) hold the party at the door until the pictures are back, as on the first visit.
   Wall and floor textures already cut from these pictures (TEX) are not touched: built levels point at them.
   Keep this file after every other ps_ file in tools/inject.py.
   ========================================================================== */
const PSPARK={store:null,busy:false,out:0,MIN:180,n:0,gap:25};
async function psParkNow(){
  if(PSPARK.store||PSPARK.busy||!PSP.ready||PSP._wait)return false;
  PSPARK.busy=true;
  try{
    const list=[];
    for(const k of Object.keys(IMG)){
      if(!k.startsWith('ps_'))continue;const o=IMG[k];if(!o)continue;
      const props={};for(const p of Object.keys(o))props[p]=o[p];
      if(o instanceof HTMLImageElement){if(!o.src||!o.complete||!o.naturalWidth)continue;list.push({k,o,src:o.src,props})}
      else if(o instanceof HTMLCanvasElement){if(!o.width||!o.height)continue;
        const blob=await new Promise(r=>{try{o.toBlob(r,'image/png')}catch(e){r(null)}});
        if(blob)list.push({k,o,blob,w:o.width,h:o.height,props});   // a copy that cannot be packed simply stays
        await new Promise(r=>setTimeout(r,PSPARK.gap));   // one copy at a time with a breath between, so the game outside does not stutter while they are packed
        if(pspIs(LEVEL)||PSP._wait)return false}}
    if(pspIs(LEVEL)||PSP._wait||!PSP.ready||G.state!=='play')return false;   // the party went back in while the pictures were being packed: leave everything as it is
    const kept=[];for(const s of list){if(IMG[s.k]===s.o){delete IMG[s.k];s.o=null;kept.push(s)}}
    PSPARK.store=kept;PSPARK.n=kept.length;PSP.ready=false;
    try{memFlushCaches()}catch(e){}   // the lit copies in the sprite cache are made again as they are needed
    return true;
  }finally{PSPARK.busy=false}}
async function psUnpark(){
  const list=PSPARK.store;if(!list)return 0;
  const one=async s=>{
    if(s.blob){const bm=await createImageBitmap(s.blob),c=document.createElement('canvas');c.width=s.w;c.height=s.h;c.getContext('2d').drawImage(bm,0,0);try{bm.close()}catch(e){}Object.assign(c,s.props);IMG[s.k]=c;return true}
    for(let n=0;n<3;n++){const im=new Image();await new Promise(r=>{im.onload=r;im.onerror=r;im.src=s.src});
      if(im.naturalWidth){Object.assign(im,s.props);IMG[s.k]=im;return true}
      await new Promise(r=>setTimeout(r,n?1200:400))}
    return false};
  const res=await Promise.all(list.map(s=>one(s).catch(()=>false)));
  const failed=list.filter((s,i)=>!res[i]).map(s=>s.k);
  PSPARK.store=null;
  if(failed.length)console.warn('Pale Spire pictures that did not come back:',failed.join(' '));
  return failed.length}
{const _pl=pspLoad;pspLoad=function(then){
  if(!PSPARK.store)return _pl.apply(this,arguments);
  if(PSP._wait)return true;PSP._wait=1;
  try{msg('The Pale Lands come into view...','#d8d4f0')}catch(e){}
  psUnpark().catch(e=>{console.error('ps unpark',e)}).then(()=>{PSP.ready=true;PSP._wait=0;PSPARK.out=0;then()});
  return true}}
{const _u=update;update=function(dt){
  const r=_u.apply(this,arguments);
  try{if(PSP.ready&&!PSP._wait&&!PSPARK.store&&!PSPARK.busy&&G.state==='play'){
    if(pspIs(LEVEL))PSPARK.out=0;
    else{PSPARK.out+=dt||.016;if(PSPARK.out>=PSPARK.MIN){PSPARK.out=0;psParkNow().catch(e=>console.error('ps park',e))}}}}catch(e){}
  return r}}
