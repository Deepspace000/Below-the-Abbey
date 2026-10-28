()=>{const o={};for(const k of ['art_tex_hgdp_dock','hgdb_dock','yar_boat_row','art_wm_boat','art_hgtb_lamp_tall','art_hgtb_deco_shellstatue','art_wm_crystal_pillar']){const im=IMG[k];o[k]=im?[im.width,im.height]:null}
const c=IMG.hgdb_dock||IMG.art_tex_hgdp_dock;o.png=c&&c.toDataURL?c.toDataURL('image/png'):null;
const b=document.createElement('canvas');const im=IMG.yar_boat_row;b.width=im.width;b.height=im.height;b.getContext('2d').drawImage(im,0,0);o.boat=b.toDataURL('image/png');return o}
