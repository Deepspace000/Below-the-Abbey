/* ==========================================================================
   SHOP STALLS OF THE MAZE (prefix hgdst / HGDST). Every shopkeeper of the eight maze towns (the general shop hgd_shopN, and the weapon, armour, magic, trader and inn of hgd_s2_*) now has a painted stall standing behind them that shows what
   the shop sells (assets/ds_hgstall_<kind>.png). The stall is a picture only: it is drawn about half a square behind the keeper, on the far side from wherever the party stands, so the keeper is always in front of it. It has no collision.
   ========================================================================== */
const HGDST={H:1.2,KIND:{arms:'arms',armour:'armour',magic:'magic',trader:'trader',inn:'inn'},list:null,src:null};
function hgdstKind(npc){npc=String(npc||'');if(/^hgd_shop\d/.test(npc))return 'general';const m=/^hgd_s2_([a-z]+)\d/.exec(npc);return m&&HGDST.KIND[m[1]]||null}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  try{if(LEVEL===HGD.ID&&G.state==='play'&&G.decor){
      if(HGDST.src!==G.decor){HGDST.src=G.decor;HGDST.list=[];for(const d of G.decor){const k=hgdstKind(d.npc);if(k)HGDST.list.push({x:d.x,y:d.y,k})}}
      const cx=G.C.x+.5,cy=G.C.y+.5;
      for(const s of HGDST.list){const im=IMG['art_hgstall_'+s.k];if(!im||!im.width)continue;
        const dx=s.x+.5-cx,dy=s.y+.5-cy,d2=dx*dx+dy*dy;if(d2>900)continue;
        const d=Math.sqrt(d2)||1;
        L.push({x:s.x+.5+dx/d*.5,y:s.y+.5+dy/d*.5,img:im,w:HGDST.H*im.width/im.height,bob:0,drop:0})}}}catch(e){console.error('hgdst',e)}
  return L}}
