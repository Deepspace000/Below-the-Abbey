/* ==========================================================================
   GLOW ORBS, STACKING LIGHTS AND THE SPLIT CHOOSER. Notes for other files: tools/ORBS_NOTES.md. Last in the injection order.
   1. The Glow Orb: a second kind of lantern. Held in a hand like a torch or lantern (k:'light'), it gives a wider, steady, pale blue light. The torch and the orb stack in the bag.
   2. orbTake(decor) / orbFrameEmpty(decor): orbs are lifted out of their frames (decor flagged orbFrame:true, or kind 'wm_orb'). The taken state is kept in G.flags.orbTaken.
   3. Shops: Wenlock's general store and chandler, the Deeper Hollow traders and the Hedgefoot grocer sell them.
   4. Shift+click on a stack in the bag (or the Split button on its card) opens a little amount chooser; the chosen amount becomes a new stack of its own.
   ========================================================================== */
/* ---------- the item ---------- */
ITEMDEF.glowOrb={n:'Glow Orb',k:'light',t:'Light',ic:'lantern',c:'#8ec8ff',light:3.2,tint:[.62,.95,1.5],price:30,stack:1,sw:.3,
  d:'A glowing orb that has been held in an iron frame for a very long time. It gives a steady, pale blue light, brighter than any torch.'};
ITEMDEF.glowOrb.id='glowOrb';
if(ITEMDEF.torch)ITEMDEF.torch.stack=1; // torches stack now; single torches already in a bag stay as they are, new ones join a stack, and Sort merges them
/* the picture: assets/icn_glowOrb.png (painted: a pale blue-white orb in an ornate iron and bronze cage). Until it has loaded, or if it is missing, the old stand-in is used: the painted lantern with red and blue swapped. */
function orbSetIcon(im){IMG.icn_glowOrb=im;IMG.ic_glowOrb=im;IMG.it_glowOrb=im}
function orbIcons(){
  try{
    if(IMG.icn_glowOrb||!IMG.icn_lantern)return;
    const s=IMG.icn_lantern,c=document.createElement('canvas');c.width=s.width;c.height=s.height;const x=c.getContext('2d');x.drawImage(s,0,0);
    const im=x.getImageData(0,0,c.width,c.height),d=im.data;
    for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const r=d[i],g=d[i+1],b=d[i+2];d[i]=Math.min(255,b*.9+r*.1);d[i+1]=Math.min(255,g*.95+r*.12);d[i+2]=Math.min(255,r*1.08+g*.1)}
    x.putImageData(im,0,0);orbSetIcon(c);IMG._orbStandIn=1;
  }catch(e){console.error('orbIcons',e)}
}
if(typeof loadImg==='function'){
  loadImg('glow_orb_icon','assets/icn_glowOrb.png').then(()=>{if(IMG.glow_orb_icon&&IMG.glow_orb_icon.width)orbSetIcon(IMG.glow_orb_icon)});
  loadImg('glow_orb_frame','assets/glow_orb_frame.png').then(()=>{if(IMG.glow_orb_frame&&typeof WM!=='undefined'&&WM.orbArt&&typeof wmOrbArt==='function'){WM.orbArt=false;wmOrbArt()}});
  loadImg('glow_orb_frame_empty','assets/glow_orb_frame_empty.png');
}
{const _ii=itemIcon;itemIcon=function(d){if(d&&d.id==='glowOrb'&&!IMG.ic_glowOrb)orbIcons();return _ii.apply(this,arguments)}}
{let t=setInterval(()=>{orbIcons();if(IMG.icn_glowOrb&&!IMG._orbStandIn)clearInterval(t)},700)}
/* the orb frames of the well maze: the painted orb frame (assets/glow_orb_frame.png), with the glow turned to this floor's orb colour; the empty frame (glow_orb_frame_empty.png) once the orb has been taken. Falls back to the recoloured cage lantern while the pictures load. */
if(typeof wmOrbArt==='function'&&typeof WM!=='undefined'&&WM.ORBS){const _wo=wmOrbArt;wmOrbArt=function(){
  const src=IMG.glow_orb_frame,em=IMG.glow_orb_frame_empty;
  if(!src||!src.width||!em||!em.width)return _wo.apply(this,arguments);
  if(WM.orbArt)return;WM.orbArt=true;
  const w=src.width,h=src.height;
  const hsl=(r,g,b)=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let hh=0,ss=0;if(mx!==mn){const dd=mx-mn;ss=l>.5?dd/(2-mx-mn):dd/(mx+mn);hh=mx===r?(g-b)/dd+(g<b?6:0):mx===g?(b-r)/dd+2:(r-g)/dd+4;hh*=60}return [hh,ss,l]};
  const rgb=(hh,ss,l)=>{const f=n=>{const k=(n+hh/30)%12,a=ss*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return [f(0)*255,f(8)*255,f(4)*255]};
  WM.ORBS.forEach((o,i)=>{
    const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(src,0,0);const im=x.getImageData(0,0,w,h),d=im.data;
    for(let q=0;q<d.length;q+=4){if(!d[q+3])continue;const [hh,ss,l]=hsl(d[q],d[q+1],d[q+2]);if(hh>170&&hh<250&&ss>.12&&l>.3){const k=rgb(o.hue,Math.min(1,Math.max(.85,ss*1.8*o.sat)),Math.min(.78,l));d[q]=k[0];d[q+1]=k[1];d[q+2]=k[2]}}
    x.putImageData(im,0,0);IMG['wm_orbframe'+i]=c;NPC_H['wm_orbframe'+i]=.85;IMG['wm_orbframeE'+i]=em;NPC_H['wm_orbframeE'+i]=.85})}}
/* ---------- the colour of the party's own light follows the best light being held ---------- */
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{let best=null,bl=0;for(const h of G.heroes||[]){if(!h.alive)continue;for(const k of ['main','off']){const it=h.eq&&h.eq[k],d=it&&idef(it);if(d&&d.k==='light'&&d.light>=bl){bl=d.light;best=d}}}
    const tg=best&&best.tint?best.tint:[1,1,1],f=1-Math.exp(-(dt||.016)*1.6);for(let i=0;i<3;i++)PARTY_TINT[i]+=(tg[i]-PARTY_TINT[i])*f}catch(e){}
  return r}}
/* ---------- orb frames ---------- */
const orbIsFrame=d=>!!d&&(d.orbFrame===true||d.k==='wm_orb');
const orbKey=d=>LEVEL+':'+d.x+','+d.y;
function orbFrameEmpty(d){
  if(!d)return;d.orbTaken=true;d.lit=false;d.glow=false;d.light=false;d.orbGlow=false;
  if(d.emptyK)d.k=d.emptyK;
  try{ // the glow of the frame stops: any level light standing on it goes out
    if(typeof LIGHTS!=='undefined')for(const l of LIGHTS)if(Math.abs(l.x-(d.x+.5))<.6&&Math.abs(l.y-(d.y+.5))<.6&&(l.free||l.orb)){l.taken=true;l.kI=0;l.out=true}
    if(G.extraLights)G.extraLights=G.extraLights.filter(q=>!(q[0]===d.x&&q[1]===d.y));
  }catch(e){}
  try{(G.flags.orbTaken=G.flags.orbTaken||{})[orbKey(d)]=1}catch(e){}
}
function orbTake(d){
  if(!d)return false;
  if(d.orbTaken){msg('The frame is empty.','#a89878');return false}
  G._wtPick=1;let ok;try{ok=bagAdd(mkItem('glowOrb'))}finally{G._wtPick=0}
  if(!ok){msg(G._heavy?'That is too heavy for the party to carry. Drop something first.':'Your bag is full.','#d09a80');return false}
  orbFrameEmpty(d);sfx('equip');msg('You lift the glowing orb out of its frame.','#9ad8ff');
  try{if(typeof collFound==='function')collFound('glowOrb')}catch(e){}
  return true;
}
{const _ol=openLoot;openLoot=function(d){if(orbIsFrame(d)){orbTake(d);return}return _ol.apply(this,arguments)}}
{const _st=startTalk;startTalk=function(d){if(orbIsFrame(d)){orbTake(d);return}return _st.apply(this,arguments)}}
/* frames taken earlier stay empty after a level is rebuilt or a save is loaded: checked once whenever the level's scenery changes */
{let seen=null,seenN=-1,seenL=-1;const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(G.decor&&(G.decor!==seen||G.decor.length!==seenN||LEVEL!==seenL)){seen=G.decor;seenN=G.decor.length;seenL=LEVEL;const T=G.flags&&G.flags.orbTaken;if(T)for(const d of G.decor)if(orbIsFrame(d)&&!d.orbTaken&&T[orbKey(d)])orbFrameEmpty(d)}}catch(e){}
  return r}}
/* ---------- for sale ---------- */
{const add=(list,id,n)=>{if(!ITEMDEF[id])return list;const r=list.find(q=>q[0]===id);if(r)r[1]=Math.max(r[1],n);else list.push([id,n]);return list};
  if(typeof KH_STOCK!=='undefined'){
    for(const k of ['wli_general','wli_chandler']){const _f=KH_STOCK[k];if(_f)KH_STOCK[k]=function(){const l=_f.apply(this,arguments).map(r=>r.slice());add(l,'torch',20);add(l,'glowOrb',12);return l}}}
  if(typeof hgds2Stock==='function'){const _h=hgds2Stock;hgds2Stock=function(kind,town){const l=_h.apply(this,arguments);if(kind==='trader'&&Array.isArray(l)){const c=l.map(r=>r.slice());add(c,'glowOrb',6);return c}return l}} // the general trader of each of the eight maze towns
  if(typeof HGDP_SHOPS!=='undefined'&&HGDP_SHOPS[0]&&Array.isArray(HGDP_SHOPS[0][1]))add(HGDP_SHOPS[0][1],'glowOrb',6); // Marl, the grocer of Hedgefoot
}
/* ---------- the split chooser ---------- */
const spOpen=i=>{const it=G.bag[i];if(!it||!(it.n>1)||!idef(it).stack)return false;G.splitDlg={i,id:it.id,n:Math.max(1,Math.floor(it.n/2)),max:it.n};sfx('equip');return true};
const spClose=()=>{G.splitDlg=null};
function spTake(){
  const S=G.splitDlg;if(!S)return;const it=G.bag[S.i],I=G.inv;
  if(!it||it.id!==S.id){spClose();return}
  const n=Math.max(1,Math.min(S.n,it.n));
  if(n>=it.n){I.sel={src:'bag',i:S.i};spClose();return} // the whole stack: nothing to cut off, it is simply picked
  if(G.bag.length>=BAGCAP){msg('There is no free pack slot to put them in.','#d09a80');return}
  it.n-=n;G.bag.splice(S.i+1,0,{id:it.id,n});I.sel={src:'bag',i:S.i+1};I.dropKey=null;
  sfx('equip');msg(`${n} ${idef(it).n}${n>1&&!/s$/.test(idef(it).n)?'s':''} set apart.`,'#c8d8a0');spClose();
}
{const _di=drawInventory;drawInventory=function(){
  _di.apply(this,arguments);
  const I=G.inv;let S=G.splitDlg;
  if(S&&(!I.open||!G.bag[S.i]||G.bag[S.i].id!==S.id||!(G.bag[S.i].n>1))){spClose();S=null}
  if(!S&&I.open&&I.tab==='inv'&&I.sel&&I.sel.src==='bag'&&!I.dropKey){ // a Split button on the card of a selected stack (for touch and controllers)
    const it=G.bag[I.sel.i];
    if(it&&it.n>1&&idef(it).stack){const rx=316+34,y=198;panel(rx,y,88,12,false,false);txt('Split the stack',rx+44,y+6.5,7.5,'#c9ba8e','center',true);btn('spl_open',rx,y,88,12)}}
  if(!S)return;
  S.n=Math.max(1,Math.min(S.n,S.max));
  const x=140,y=76,w=200,h=140,d=ITEMDEF[S.id];
  BTNS.push({id:'spl_bg',x:0,y:0,w:DW,h:DH});
  ctx.fillStyle='rgba(4,3,2,.62)';ctx.fillRect(0,0,DW,DH);
  bigPanel(x,y,w,h);
  txt('How many to take?',x+w/2,y+19,11,'#d8c88e','center',true);
  itemIcon(d,x+34,y+50,1.1);txt(d.n,x+w/2+16,y+44,9.5,'#f0e4b4','center',true,undefined,w-80);txt(`in the stack: ${S.max}`,x+w/2+16,y+58,8,'#a89878','center');
  btnText('spl_dn','-',x+16,y+68,30,24);txt(String(S.n),x+w/2,y+80,17,'#fff4c8','center',true);btnText('spl_up','+',x+w-46,y+68,30,24);
  const q=[['spl_1','1'],['spl_half','Half'],['spl_all','All']];q.forEach(([id,l],k)=>btnText(id,l,x+22+k*58,y+98,46,16));
  btnText('spl_take','Take',x+18,y+h-26,70,20);btnText('spl_no','Cancel',x+w-88,y+h-26,70,20);
}}
{const _hb=handleBtn;handleBtn=function(id){
  if(G.splitDlg&&typeof id==='string'&&id.startsWith('spl_')){
    const S=G.splitDlg;
    if(id==='spl_dn')S.n=Math.max(1,S.n-1);else if(id==='spl_up')S.n=Math.min(S.max,S.n+1);else if(id==='spl_1')S.n=1;
    else if(id==='spl_half')S.n=Math.max(1,Math.floor(S.max/2));else if(id==='spl_all')S.n=S.max;
    else if(id==='spl_take')spTake();else if(id==='spl_no')spClose();
    return}
  if(id==='spl_open'){const I=G.inv;if(I.open&&I.sel&&I.sel.src==='bag')spOpen(I.sel.i);return}
  if(id==='isort'&&G.inv&&G.inv.open){ // Sort also joins the stacks that were cut apart
    const seen={};for(let i=0;i<G.bag.length;){const b=G.bag[i],d=idef(b);if(d&&d.stack&&seen[b.id]!==undefined){G.bag[seen[b.id]].n+=b.n||1;G.bag.splice(i,1)}else{if(d&&d.stack)seen[b.id]=i;i++}}}
  return _hb.apply(this,arguments)}}
addEventListener('keydown',e=>{ // the chooser takes the keyboard while it is open
  const S=G.splitDlg;if(!S)return;
  const k=e.key;
  if(k==='Escape')spClose();else if(k==='Enter'||k===' ')spTake();else if(k==='+'||k==='ArrowUp'||k==='ArrowRight')S.n=Math.min(S.max,S.n+1);else if(k==='-'||k==='ArrowDown'||k==='ArrowLeft')S.n=Math.max(1,S.n-1);
  else if(k==='Home')S.n=1;else if(k==='End')S.n=S.max;
  e.preventDefault();e.stopImmediatePropagation()},true);
cv.addEventListener('pointerdown',e=>{ // shift+click on a stack in the bag
  if(!e.shiftKey||G.splitDlg||!G.inv.open||G.inv.tab!=='inv'||G.loot||G.state!=='play')return;
  const [x,y]=toDesign(e),b=topBtn(x,y);
  if(!b||!b.id.startsWith('ibag')||b.id==='ibagarea')return;
  const i=+b.id.slice(4);
  if(spOpen(i)){G.inv.sel={src:'bag',i};e.preventDefault();e.stopImmediatePropagation()}
},true);
