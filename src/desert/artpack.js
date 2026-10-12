/* ==========================================================================
   PAINTED ART FOR THE DESERT. Every picture in assets/ds_<name>.png (made with Canva's image generator, see
   tools/ingest_sprite.py) takes the place of the drawn sprite, floor or wall called <name>. DS_PAINTED is written by
   tools/inject.py from the files that are there. Nothing in the desert should be drawn by code once its picture exists.
   ========================================================================== */
function dsPaintedTex(im){const [c,x]=tcv();x.drawImage(im,0,0,TS,TS);return x.getImageData(0,0,TS,TS).data}
function dsApplyPainted(){
  for(const k of DS_PAINTED){
    const im=IMG['art_'+k];if(!im)continue;
    if(k.startsWith('floor_'))FLOORS[k.slice(6)]=dsPaintedTex(im);
    else if(k.startsWith('ceil_'))CEILS[k.slice(5)]=dsPaintedTex(im);
    else if(k.startsWith('tex_'))DS_PAINTED_TEX[k.slice(4)]=dsPaintedTex(im);
    else IMG[k]=im;
  }
}
const DS_PAINTED_TEX={};
