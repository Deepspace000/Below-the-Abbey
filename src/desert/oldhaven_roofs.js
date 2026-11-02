/* ==========================================================================
   OLDHAVEN: THE ROOFS. The city (level 305) and the quay (level 304) use the ray-cast roofs of thornwick_roofs.js (TKR), like Thornwick, Ironhill and Yarrim, so every roof stands
   exactly on its walls and is right from every side: the eaves meet the wall tops, the gable is the wall carried up, the slopes rise behind the eaves in true perspective and
   a roof behind a nearer house shows only above that house. (The old roofs were flat painted pictures laid over the houses, which could not do that.)
   The tables are made when the level is built (TKR.sets[n].dyn): every house of OH.houses (the city) and of OQ_HOUSES (the quay) gets a pitched roof exactly over its wall
   squares (no overhang) at its own wall height (the optional wh of a row: Oldhaven's houses run from 2.0 to 3.7 high). The ridge runs along the longer side of the house, so a
   long terrace has one long roof with its eaves to the street and a narrow deep house shows its gable. The roof kind the old picture had (terracotta, slate, plum, sage,
   shingle, brown, thatch, moss) is kept: the painted slope pieces of Thornwick (slate, tile, shingle, thatch) with a tint for plum, sage, brown and moss. The gable end
   follows the house type (timber, merchant, townhouse, cottage, guild, almshouse). The chapel and the guild halls (and now and then another house) have a stone tower
   with a spire standing through the roof; the chapel's has an iron cross. The curtain wall, the castle and the far towers are skyline pictures and stay as they were.
   ========================================================================== */
const OHR_KIND={   // the old roof kind -> [slope picture, tint]
  terra:['tile',[1.05,.96,.9]],red:['tile',[1.05,.97,.92]],slate:['slate',[.97,.99,1.04]],plum:['slate',[1.07,.92,1.04]],sage:['slate',[.92,1.05,.97]],
  shingle:['shingle',[1,1,1]],brown:['shingle',[.96,.9,.84]],thatch:['thatch',[1.04,1,.9]],moss:['thatch',[.9,1.02,.88]]};
const OHR_GABLE={timber:'timber',merchant:'ochre',townhouse:'stone',cottage:'boards',guild:'stone',almshouse:'ochre'};
/* one row of the table: the footprint x0..x1, y0..y1 (squares), the wall height, the roof kind, the gable, whether a tower stands over it (and whether it is the chapel's) */
function ohrRow(id,x0,x1,y0,y1,wh,kind,gable,tower,chapel){
  const ex=x1-x0+1,ey=y1-y0+1,ax=ex>=ey?'x':'y',across=ax==='x'?ey:ex,half=across/2,K=OHR_KIND[kind]||OHR_KIND.slate,slope=K[0],thatch=slope==='thatch';
  const r=hash2(x0,y0,191),r2=hash2(x0,y0,192),r3=hash2(x0,y0,193),R=Math.max(.8,Math.min(2.3,half*(thatch?.8:.62)+.12*r));   // the rise: a pitch of about thirty degrees, thatch steeper
  const withTower=tower&&across>=3&&Math.max(ex,ey)>=4,chim=(chapel||withTower||r2>.62)?null:[.18+.64*r3,(r3<.5?-1:1)*(.3+.2*r),r<.5?'brick':'stone'];
  const opt={wh};
  if(withTower){const end=hash2(x0,y0,194)<.5?0:1;opt.chapel=1;opt.nocross=!chapel;opt.th=chapel?1.7:1.1;opt.sh=chapel?3.2:2.1;   // the tower stands at one end of the ridge, inside the footprint
    if(ax==='x'){opt.tx=end?x1+1-1.05:x0+1.05;opt.ty=(y0+y1+1)/2}else{opt.tx=(x0+x1+1)/2;opt.ty=end?y1+1-1.05:y0+1.05}}
  return [id,x0,x1,y0,y1,ax,R,chapel?'slate':slope,chapel?'stone':gable,chim,chapel?[.96,.98,1.02]:K[1],.93+.08*r3,opt];
}
function ohRoofRows(){
  const hs=typeof OH!=='undefined'&&OH.houses;if(!hs)return [];
  return hs.map(h=>ohrRow(h.id,h.x0,h.x1,h.y0,h.y1,h.wh,h.chapel?'slate':(h.rk||'slate'),OHR_GABLE[h.type]||'stone',!!(h.tw||h.chapel),!!h.chapel));
}
const OQR_KIND=['plum','slate','terra','moss','shingle'];   // the quay's old roof pictures, kh_ohroof1_0 to 4
function oqRoofRows(){
  if(typeof OQ_HOUSES==='undefined')return [];
  return OQ_HOUSES.map((b,k)=>ohrRow('oq'+k,b.x0,b.x1,b.y0,b.y1,b.wh,OQR_KIND[b.roof%5],k%2?'ochre':'stone',!!(b.tower||k===0||k===2),false));
}
TKR.sets[305]={wh:3,houses:[],dyn:ohRoofRows,fade:.15};
TKR.sets[304]={wh:2.7,houses:[],dyn:oqRoofRows,fade:.15};
