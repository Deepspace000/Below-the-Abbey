/* ==========================================================================
   WENLOCK: THE RIVER SIDE (prefix wlr). Tall reeds, grass, willows and flowers along both banks of the brook and round the duck pond, and a small wooden pier
   west of the old bridge, with a rowing boat tied up, a lantern, a crate and a barrel. Runs after the other passes by wrapping wlPolish (wenlock_polish.js).
   Everything that grows is walk-through and melts away when you stand beside it (walk:true, like the trees in the meadows), so the lane, the bridge and the pier stay clear.
   The pier: planks are the floor slot 5 (the south meadow, which used slot 5, is now plain lawn). WLR_PIER = {x,y,dx,dy} is the last plank at the end of the pier and the
   direction out over the water; the water squares beside and beyond it are left open (for fishing spots).
   ========================================================================== */
const WLR_PIER={x:68,y:84,dx:0,dy:1};
function wlrPass(C){
  const {hs,decor,block,fm,hgt,rows,W,lv}=C;
  const get=k=>IMG[k]?k:null;
  for(const [k,h] of [['hgwm_reed0',1.5],['hgwm_grass0',1.3],['pt_willow',2.5],['reeds',.85],['pgrass0',.3],['yar_boat_row',.5],['gy_rpost',.8]])if(NPC_H[k]===undefined)NPC_H[k]=h;
  // ---- the pier: planks as floor slot 5 ----
  const PIMG=IMG.art_tex_hgdp_planks||IMG.art_tex_hgdp_dock;if(PIMG&&!FLOORS.wlPlank)FLOORS.wlPlank=dsPaintedTex(PIMG);
  const FL=FLOORS.wlPlank?'wlPlank':FLOORS.wood?'wood':null;
  if(FL&&lv.floorSet){
    for(let i=0;i<fm.length;i++)if(fm[i]==='5')fm[i]='2';   // the south meadow was slot 5: plain lawn now
    lv.floorSet=lv.floorSet.slice();lv.floorSet[5]=FL;
  }
  const P=WLR_PIER,planks=[[68,82],[69,82],[68,83],[69,83],[68,84],[69,84]];
  for(const [x,y] of planks){const i=y*W+x;fm[i]='5';block[i]=0;hgt[i]=.3;rows[y][x]='.';C.used.add(x+','+y)}
  const water=(x,y)=>fm[y*W+x]==='4';
  // posts at the sides of the planks, a rowing boat tied along the end, a lantern, a crate and a barrel
  const post=get('gy_rpost');
  const D=(k,x,y,o)=>{if(!k)return;C.used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}))};
  D('crate',69,84,{block:true,walk:false,sc:.85});
  D('barrel',69,83,{block:true,walk:false,sc:.85});
  D('lamp',69,82,{sc:1,ox:.15,oy:0});C.lights.push([69,82]);
  D('yar_boat_row',67,84,{block:false,walk:false,sc:1.2,ox:-.1,oy:0});
  if(post)for(const [x,y,ox,oy] of [[68,82,-.42,0],[68,84,-.42,0]])D(post,x,y,{ox,oy,sc:.8,block:false,walk:true});
  // ---- the banks ----
  const ok=(x,y)=>x>3&&y>3&&x<96&&y<96&&C.free(x,y)&&!C.isRoad(x-1,y)&&!C.isRoad(x+1,y);
  const lane=x=>x>=69&&x<=75;       // the bridge and Mill Lane: only low things
  const put=(k,x,y,sc,o)=>{if(!get(k)||!ok(x,y))return false;D(k,x,y,Object.assign({sc,block:false,walk:true,ox:(hs(x,y,201)-.5)*.5,oy:(hs(x,y,202)-.5)*.4},o||{}));return true};
  const TALL=['hgwm_reed0','reeds','hgwm_grass0','pgrass1','hgwm_reed0','pgrass2'];
  for(let x=4;x<=95;x++){
    const by=WL_BROOK(x),near=x>=66&&x<=78;
    for(const [row,r1,r2] of [[by-1,0,1],[by+2,2,3]]){          // the first dry row on each side
      for(let k=0;k<2;k++){
        const h=hs(x,row,210+k+r1*7);if(h>(lane(x)?.2:.6))continue;
        const key=lane(x)?(hs(x,row,215)<.5?'pgrass1':'pflw0_0'):TALL[(hs(x,row,216+k)*TALL.length)|0];
        const tall=/reed|grass0/.test(key);
        put(key,x,row,lane(x)?1.1:(tall?1+hs(x,row,217)*.55:1.1+hs(x,row,218)*.6));
      }
    }
    // second row back: grass and flowers, the odd fern
    for(const row of [by-2,by+3]){const h=hs(x,row,220);if(lane(x)){if(h<.25)put(h<.12?'pflw3_0':'pgrass3',x,row,1.2);continue}
      if(h<.4)put(['pgrass0','pgrass3','pflw0_0','pflw4_0','lflora0'][(hs(x,row,221)*5)|0],x,row,1.2+hs(x,row,222)*.4);else if(h<.5)put('hgwm_grass0',x,row,1.1)}
  }
  // willows and other waterside trees, every nine squares or so, never beside the lane or the pier
  for(let x=6;x<=94;x+=5){
    if(x>=64&&x<=80)continue;
    const by=WL_BROOK(x),x2=x+((hs(x,1,230)*3)|0);
    const north=hs(x,2,231)<.6,y=north?by-3:by+4;
    put('pt_willow',x2,y,1.1+hs(x,3,232)*.4);
    if(hs(x,4,233)<.5)put(['ltree12','ltree0','ltree8','ltree19'][(hs(x,5,234)*4)|0],x2+2,north?by-4:by+5,1);
  }
  // beside the bridge and the mill: a willow on each bank, set back from the lane
  put('pt_willow',65,81,1.3);put('pt_willow',78,81,1.2);put('pt_willow',66,88,1.3);put('pt_willow',70,89,1.1);put('pt_willow',74,89,1.2);
  // ---- the duck pond ----
  const PD=WL_GREEN.pond;
  for(let y=PD[1]-2;y<=PD[3]+2;y++)for(let x=PD[0]-2;x<=PD[2]+2;x++){
    const edge=Math.max(Math.max(PD[0]-x,x-PD[2]),Math.max(PD[1]-y,y-PD[3]));if(edge<1||edge>2)continue;
    const h=hs(x,y,240);
    if(edge===1&&h<.55)put(TALL[(hs(x,y,241)*TALL.length)|0],x,y,1+hs(x,y,242)*.5);
    else if(edge===2&&h<.3)put(['pgrass1','pflw0_0','pflw3_0','lflora0'][(hs(x,y,243)*4)|0],x,y,1.2);
  }
  put('pt_willow',PD[0]-2,PD[1]-1,1.3);put('pt_willow',PD[2]+2,PD[3]+1,1.2);put('pt_willow',PD[0]-1,PD[3]+2,1.1);
}
{const _p=wlPolish;wlPolish=function(C){_p.apply(this,arguments);try{wlrPass(C)}catch(e){console.error('wlPolish river',e)}}}
