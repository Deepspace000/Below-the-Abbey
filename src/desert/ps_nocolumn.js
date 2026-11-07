/* ==========================================================================
   NEVER THE IVY COLUMN (v3.871). A Pale Spire picture that has not loaded yet used to be stood in for by the leafy graveyard column (gy_column), and that is what the owner kept seeing on the Ramparts and elsewhere.
   Now (1) a picture with no painted stand-in shows nothing at all, never the ivy column, until the real painting arrives (the painting replaces it by name, so it appears as soon as it has loaded), and
   (2) the pictures are fetched as soon as any Pale Spire level is built, however the player got there (a saved game, a link, the test menu), not only when walking through a door.
   ========================================================================== */
{const _stand=pspStand;pspStand=function(name){
  const key='ps_'+name;if(IMG[key])return key;
  const e=PSP_PICS[name],m=PSP.man&&PSP.man[name],r=e&&pspRaw(name);
  if(!r||r.k==='gy_column'||r.k==='gy_urn'||r.k==='gy_bench'){const c=document.createElement('canvas');c.width=c.height=2;c._blank=1;c._ps=1;IMG[key]=c;NPC_H[key]=(e&&e[0])||(m&&m.h)||1.4;return key}
  return _stand.apply(this,arguments)}}
{const _pp=pspPic;pspPic=function(name){const r=_pp.apply(this,arguments);return r==='gy_column'?(IMG.ps_col_silver&&IMG.ps_col_silver.width?'ps_col_silver':'ps_'+name):r}}
{const _ll=loadLevel;loadLevel=function(id){try{if(pspIs(id)&&!PSP.ready&&!PSP._wait)pspLoad(()=>{})}catch(e){}return _ll.apply(this,arguments)}}
