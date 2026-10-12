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
    else if(k.startsWith('tex_')){const id=DS_TEXREG[k.slice(4)];if(id!==undefined&&TEX[id])TEX[id].d=dsPaintedTex(im)} // a painted wall or door picture goes into the texture the code made for it
    else IMG[k]=im;
  }
}
const DS_TEXREG={}; // name -> texture number of every wall and door picture the desert code makes, so a painted picture can replace it
