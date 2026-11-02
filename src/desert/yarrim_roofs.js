/* ==========================================================================
   YARRIM: THE ROOFS. Level 290 uses the ray-cast roofs of thornwick_roofs.js (TKR). The house table is made from the village plan when the
   level is built (TKR.sets[290].dyn is called by tkrBuild), so there are no hand-typed rows: every cottage and building of YR.plan.houses gets a
   pitched roof exactly over its wall squares (no overhang), standing on its own wall height (the optional wh of a row, from the plan).
   The ridge runs the way the door faces (a door on the south or north: ridge north to south, gable to the street; east or west: ridge east to west).
   The lighthouse is not in the plan's house list and keeps its own painted top. Sea-village look: tile and thatch mostly, a little shingle, weathered
   timber, ochre and board gables, salt-bleached tints. The chapel is slate and stone with a bell tower and spire.
   ========================================================================== */
const YRR_SLOPE=['thatch','tile','shingle','tile','thatch','tile'],YRR_GABLE=['timber','ochre','boards','ochre','timber','boards'];
const YRR_TINT=[[1.06,1,.94],[1,1.03,1.04],[1.05,1.02,.96],[1.02,.98,.94],[1,1.02,1.06],[1.04,1.04,1]];
function yarRoofRows(){
  const P=typeof YR!=='undefined'&&YR.plan;if(!P)return [];
  return P.houses.map(hz=>{
    const sp=hz.sp&&hz.sp.id,chapel=sp==='chapel',ax=(hz.face==='S'||hz.face==='N')?'y':'x',across=ax==='y'?hz.w:hz.d,r=hash2(hz.x0,hz.y0,91),r2=hash2(hz.x0,hz.y0,92),r3=hash2(hz.x0,hz.y0,93);
    const rise=chapel?1.3:(across>=3?.98:.84)+.1*r,slope=chapel?'slate':YRR_SLOPE[hz.roof%6],gable=chapel?'stone':YRR_GABLE[hz.hue%6];
    const chim=chapel?null:r2<.6?[.25+.5*r3,(r3<.5?-1:1)*(.3+.15*r),r<.5?'brick':'stone']:null;
    const dark=chapel?.92:.95+.1*r3,opt={wh:hz.wh};if(chapel){opt.chapel=1;opt.th=1.2;opt.sh=3}
    return [hz.id,hz.x0,hz.x1,hz.y0,hz.y1,ax,rise,slope,gable,chim,chapel?[.96,.98,1.02]:YRR_TINT[hz.hue%6],dark,opt]});
}
/* the lighthouse: a round tower on the north point, standing over its 3 by 3 squares (nothing reaches past them). From the ground up: the round building (white stone with red bands
   and windows), a ledge, the tall tower, the gallery with its glass lantern room, a green copper dome. Painted pictures (assets/tkr/lh_*.webp) wrapped round cylinders and a dome. */
/* the lighthouse door: the wooden door of the ordinary door picture set into the tower's own white stone and red bands (the lowest part of lh_wall, as high as the round base), so the
   door slab looks like part of the tower and not a pale panel. Made when the level is built, and again when the wall picture has loaded (the pixels are changed in place). */
const YR_LHIMG=(()=>{if(typeof Image==='undefined')return null;const i=new Image();i.onload=()=>{if(typeof yarLhDoorFit==='function')yarLhDoorFit()};i.src='assets/tkr/lh_wall.webp?v='+(typeof VERSION!=='undefined'?VERSION:'');return i})();
function yarLhDoorFit(){
  const id=YR.lhDoorTex,im=YR_LHIMG;if(id===undefined||!TEX[id]||!im||!im.complete||!im.naturalWidth)return;
  const t=TEX[id];if(!YR.lhDoorOrig)YR.lhDoorOrig=t.d.slice();
  const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},dc=mk(TS,TS),dx=dc.getContext('2d'),di=dx.createImageData(TS,TS);di.data.set(YR.lhDoorOrig);dx.putImageData(di,0,0);
  const oc=mk(TS,TS),ox=oc.getContext('2d',{willReadFrequently:true}),h0=Math.round(im.naturalHeight*(1-2.3/3.04));
  ox.imageSmoothingQuality='high';ox.drawImage(im,0,h0,im.naturalWidth,im.naturalHeight-h0,0,0,TS,TS);                          // the tower's stone, bottom part, bands where the round wall has them
  ox.drawImage(dc,Math.round(TS*.27),Math.round(TS*.07),Math.round(TS*.47),Math.round(TS*.93),Math.round(TS*.29),Math.round(TS*.3),Math.round(TS*.42),Math.round(TS*.7));   // the door, set in
  ox.fillStyle='rgba(30,22,16,.55)';ox.fillRect(Math.round(TS*.27),Math.round(TS*.285),Math.round(TS*.46),3);                           // a dark lintel line over it
  const out=ox.getImageData(0,0,TS,TS).data;
  for(let i=0;i<out.length;i+=4)for(let c=0;c<3;c++)out[i+c]=125+(out[i+c]-125)*1.32+5;   // the wall pass lights a slab a little flatter and darker than the roof pass lights the round wall: matched by eye and by measure
  t.d.set(out);for(const k of Object.keys(t))if(/^(m|hd|he)\d+$/.test(k))delete t[k];       // forget the blurred copies made from the old pixels
}
function yarLighthouseSolids(objs,gzAt){
  const L=typeof YR!=='undefined'&&YR.plan&&YR.plan.lighthouse;if(!L)return;
  const cx=(L.x0+L.x1+1)/2,cy=(L.y0+L.y1+1)/2,gz=gzAt(cx,cy),W=[1.04,1.02,.98],S=[.9,.88,.86];
  const cyl=(id,r,zb,zt,tex,rep,vh,tn)=>objs.push({t:'cyl',front:1,hid:-2,id,cx,cy,r,zb,zt,tex,rep,vh,tn,gz,X0:cx-r,X1:cx+r,Y0:cy-r,Y1:cy+r});
  cyl('lhb',1.45,-.04,2.3,'lh_wall',3,3.04,W);objs[objs.length-1].vb=0;       // the round building
  cyl('lhl',1.49,2.3,2.5,'lh_wall',3,1.6,S);         // its ledge
  cyl('lht',.95,2.5,5.0,'lh_wall',2,2.98,W);         // the tall tower
  cyl('lhg',1.15,5.0,6.8,'lh_lamp',2,1.8,[1.1,1.08,1.02]);   // the gallery and the glass lantern room
  objs.push({t:'dome',front:1,hid:-2,id:'lhd',cx,cy,r:1.2,zb:6.8,zt:7.7,tex:'lh_dome',rep:4,tn:[1,1,1],gz,X0:cx-1.2,X1:cx+1.2,Y0:cy-1.2,Y1:cy+1.2});
}
TKR.sets[290]={wh:1.4,houses:[],dyn:yarRoofRows,fade:.3,extra:yarLighthouseSolids};   // fade: the roofs are painted brighter and more contrasted than Yarrim's walls, so they are toned down to sit with them
