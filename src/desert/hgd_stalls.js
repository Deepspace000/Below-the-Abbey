/* ==========================================================================
   SHOP STALLS OF THE MAZE (prefix hgdst / HGDST). Every shopkeeper of the eight maze towns (the general shop hgd_shopN, and the weapon, armour, magic, trader and inn of hgd_s2_*) now has a painted stall standing behind them that shows what
   the shop sells (assets/ds_hgstall_<kind>.png). The stall is a picture only: it is drawn about half a square behind the keeper, on the far side from wherever the party stands, so the keeper is always in front of it. It has no collision.
   ========================================================================== */
const HGDST={H:1.2,HK:{church:1.75},KIND:{arms:'arms',armour:'armour',magic:'magic',trader:'trader',inn:'inn'},list:null,src:null};
const hgdstShop=npc=>{const k=hgdstKind(npc);return k&&k!=='church'?k:null}; // shops only: the church has its picture behind its priest but no dollar sign
function hgdstKind(npc){npc=String(npc||'');if(/^hgd_church\d/.test(npc))return 'church';if(/^hgd_shop\d/.test(npc))return 'general';const m=/^hgd_s2_([a-z]+)\d/.exec(npc);return m&&HGDST.KIND[m[1]]||null}
{const _sl=spriteList;spriteList=function(){const L=_sl.apply(this,arguments);
  try{if(LEVEL===HGD.ID&&G.state==='play'&&G.decor){
      if(HGDST.src!==G.decor){HGDST.src=G.decor;HGDST.list=[];for(const d of G.decor){const k=hgdstKind(d.npc);if(k)HGDST.list.push({x:d.x,y:d.y,k})}}
      const cx=G.C.x+.5,cy=G.C.y+.5;
      for(const s of HGDST.list){const im=IMG['art_hgstall_'+s.k];if(!im||!im.width)continue;
        const dx=s.x+.5-cx,dy=s.y+.5-cy,d2=dx*dx+dy*dy;if(d2>900)continue;
        const d=Math.sqrt(d2)||1;
        L.push({x:s.x+.5+dx/d*.5,y:s.y+.5+dy/d*.5,img:im,w:(HGDST.HK[s.k]||HGDST.H)*im.width/im.height,bob:0,drop:0})}}}catch(e){console.error('hgdst',e)}
  return L}}
/* ---------- the shops on the Deeper Hollow map: a gold $ for each shop once the map is zoomed in a little, with the kind of shop beside it when zoomed in further ---------- */
const HGDST_LBL={church:'Church',general:'Goods',arms:'Arms',armour:'Armour',magic:'Magic',trader:'Trader',inn:'Inn'};
{const _dn=hgdmpDrawNames;hgdmpDrawNames=function(vi){
  _dn.apply(this,arguments);
  try{const V=MPL.view,L=LEVELS[HGD.ID];if(!V||!V.z||vi>=5||!L||!L._hgdp)return;const z=V.z;if(z<1.25)return;
    if(!HGDST.map||HGDST.mapSrc!==L){HGDST.mapSrc=L;HGDST.map=[];for(const d of L.decor){const k=hgdstKind(d.npc);if(k)HGDST.map.push({x:d.x,y:d.y,k})}}
    const A=V.area,r=Math.max(3.4,Math.min(5.6,2.6+z*.5)),lab=z>=2.2;
    ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();ctx.textAlign='center';ctx.textBaseline='middle';const lbx=[];
    for(const s of HGDST.map){const px=A.x+(V.X(s.x+.5)-V.sx0)*z,py=A.y+(V.Y(s.y+.5)-V.sy0)*z;if(px<A.x-8||px>A.x+A.w+8||py<A.y-8||py>A.y+A.h+8)continue;
      ctx.globalAlpha=1;ctx.fillStyle=s.k==='church'?'#f4f0e0':'#f4c430';ctx.strokeStyle='#2a1a0c';ctx.lineWidth=1;ctx.beginPath();ctx.arc(px,py,r,0,6.2832);ctx.fill();ctx.stroke();
      ctx.fillStyle='#2a1a0c';ctx.font='bold '+Math.round(r*1.35)+'px '+FUI;ctx.fillText(s.k==='church'?'+':'$',px,py+.5);
      if(lab&&!lbx.some(q=>Math.abs(q[0]-px)<22&&Math.abs(q[1]-py)<8)){lbx.push([px,py]);ctx.font='bold 5.6px '+FUI;ctx.lineWidth=2.2;ctx.strokeStyle='rgba(233,220,180,.9)';ctx.strokeText(HGDST_LBL[s.k],px,py+r+4.5);ctx.fillStyle='#4a2a08';ctx.fillText(HGDST_LBL[s.k],px,py+r+4.5)}}
    ctx.restore()}catch(e){console.error('hgdst map',e)}}}
// the key of the map names it
/* ---------- the four quarters of the maze have names, shown under the map title and as a banner at the top of the map when a quarter is opened ---------- */
{const Q=['The Lantern Reaches','The Gilded Heights','The Cairn Warrens','The Hedgefoot Approaches'];for(let i=0;i<4;i++)HGDMP.views[i+1][1]=Q[i]}
{const _dn2=hgdmpDrawNames;hgdmpDrawNames=function(vi){
  _dn2.apply(this,arguments);
  try{const V=MPL.view;if(!V||vi<1||vi>4)return;const B=HGDST.ban=HGDST.ban||{};
    if(B.vi!==vi||G.time-(B.last||0)>1.2)B.t=G.time;B.vi=vi;B.last=G.time; // a quarter opened afresh (or switched to) starts its banner
    const age=G.time-B.t;if(age>3.4)return;const al=age<.4?age/.4:age>2.6?Math.max(0,1-(age-2.6)/.8):1,A=V.area,name=HGDMP.views[vi][1];
    ctx.save();ctx.globalAlpha=al;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 19px '+FTITLE;
    const w=ctx.measureText(name).width+36;ctx.fillStyle='rgba(30,18,8,.78)';ctx.fillRect(A.x+A.w/2-w/2,A.y+8,w,28);ctx.strokeStyle='#c8a050';ctx.lineWidth=1;ctx.strokeRect(A.x+A.w/2-w/2+.5,A.y+8.5,w-1,27);
    ctx.fillStyle='#f0dca0';ctx.fillText(name,A.x+A.w/2,A.y+23);ctx.restore()}catch(e){console.error('hgdst ban',e)}}}
