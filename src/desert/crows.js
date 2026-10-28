/* ==========================================================================
   FLYING CROWS. The Crow Swarm and the Carrion Crow of Blackbriar Wood (wwcrows, wwcrow) and the Carrion Raven of the graveyard and the Pale Catacombs
   (gyraven) are all creatures with fly:true, but their old pictures were crows STANDING with their feet on nothing. They now use painted
   crows seen from the FRONT with their wings spread (assets/crow, made with Canva and cut by tools/crows/ingest_crows.py):
     crow_0..2     one crow, wings up, wings level, wings down        (the Carrion Raven, and the old single crow)
     flock_0..2    five to seven crows at different sizes, three wing poses     (the Crow Swarm)
     carrion_0..3  a bigger, scruffier crow: wings up, level, down, and a dive with the wings swept wide (the Carrion Crow; the dive shows while it lunges)
   The engine draws one picture per creature, so the flap is done here: every frame of a set has the same size and the body sits in the
   same place, and the sprite list below swaps the picture (up, level, down, level) as time goes by, each crow a little out of step.
   A soft shadow is laid on the ground under each one (the engine draws none for flyers), so a crow never seems to hang from nothing.
   The creature kinds (wwcrows, wwcrow, gyraven) and their numbers are unchanged, so old saves still work; only the picture and the way it
   hovers are new. Until the pictures have loaded the old ones are used. Notes: tools/crows/NOTES.md.
   ========================================================================== */
const CROW={on:false,files:{crow:3,flock:3,carrion:4},got:{},rate:{crow:9,flock:7,carrion:7}};
/* span: width of the picture in squares (one square is about a person); body: where the body centre sits in the picture, from the top (0..1);
   rise: how high the BODY floats above the ground, in squares (about shoulder height is .75); */
const CROW_KIND={
  wwcrows:{set:'flock',span:1.55,body:.5,rise:.62,sh:.95},
  wwcrow:{set:'carrion',span:1.4,body:.5,rise:.66,sh:.8},
  gyraven:{set:'crow',span:.8,body:.5,rise:.66,sh:.7}};
function crowLoad(){
  if(CROW._started)return;CROW._started=true;
  const ver=typeof VERSION!=='undefined'?VERSION:'';
  for(const set in CROW.files){
    let left=CROW.files[set];const imgs=[];
    for(let k=0;k<CROW.files[set];k++){
      const i=new Image();
      i.onload=()=>{imgs[k]=i;if(--left===0){CROW.got[set]=imgs;try{crowInstall()}catch(e){console.error(e)}}};
      i.onerror=()=>{if(--left===0&&imgs.filter(Boolean).length>=3){CROW.got[set]=imgs;try{crowInstall()}catch(e){console.error(e)}}};
      i.src='assets/crow/'+set+'_'+k+'.webp?v='+ver}}
}
/* once a set has loaded, the creatures that use it get its first picture as their base picture and their new size and height */
function crowInstall(){
  let any=false;
  for(const t in CROW_KIND){
    const K=CROW_KIND[t],fr=CROW.got[K.set],def=ENEMY_DEF[t];
    if(!fr||!def||!fr[0])continue;
    const key='crw_'+K.set+'0';IMG[key]=fr[0];
    const h=K.span*fr[0].height/fr[0].width,ft=Math.max(.02,K.rise-(1-K.body)*h);
    def.img=key;def.w=+K.span.toFixed(3);def.floatH=+ft.toFixed(3);def.fly=true;
    K.h=h;K.live=true;any=true;
    if(typeof HUGE_FOES!=='undefined'&&!HUGE_FOES.includes(t))HUGE_FOES.push(t); // sized by hand here: the fit-to-window shrink is not applied
    if(typeof fitCache!=='undefined')fitCache.clear()}
  if(any)CROW.on=true;
}
/* a soft dark oval, painted once: the shadow on the ground under a crow */
function crowShadow(){
  if(IMG.crw_shadow)return IMG.crw_shadow;
  const c=document.createElement('canvas');c.width=128;c.height=32;const x=c.getContext('2d');
  const g=x.createRadialGradient(64,16,2,64,16,64);g.addColorStop(0,'rgba(0,0,0,.62)');g.addColorStop(.55,'rgba(0,0,0,.34)');g.addColorStop(1,'rgba(0,0,0,0)');
  x.save();x.translate(0,16);x.scale(1,.25);x.translate(0,-16);x.fillStyle=g;x.fillRect(0,-48,128,128);x.restore();
  return IMG.crw_shadow=c;
}
/* the wing beat: up, level, down, level; the dive picture while it lunges */
const CROW_BEAT=[0,1,2,1];
function crowFrame(t,e){
  const K=CROW_KIND[t];if(!K||!K.live)return null;const fr=CROW.got[K.set];if(!fr)return null;
  if(fr[3]&&e.lunge>.2&&e.hp>0)return fr[3];
  if(e.hp<=0)return fr[2]||fr[0];                       // a falling crow has its wings folded down
  const ph=(G.time*CROW.rate[K.set]+(e.seed||0)*7.3)%4;return fr[CROW_BEAT[ph|0]]||fr[0];
}
{const _sl=spriteList;spriteList=function(){
  const L=_sl.apply(this,arguments);
  if(!CROW.on)return L;
  try{
    const sh=[];
    for(const s of L){
      const e=s.e;if(!e)continue;const K=CROW_KIND[e.t];if(!K||!K.live)continue;
      const im=crowFrame(e.t,e);if(im)s.img=im;
      if(e.hp>0){const so=crowShadow();sh.push({x:s.x,y:s.y,img:so,w:K.span*K.sh*(s.w/(ENEMY_DEF[e.t].w||1)),bob:0,drop:.5,fade:s.fade,crowShadow:1})}
    }
    if(sh.length)L.unshift(...sh);                      // first in the list: at the same depth the shadow is painted before its crow
  }catch(err){}
  return L}}
crowLoad();
