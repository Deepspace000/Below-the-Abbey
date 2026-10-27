/* ==========================================================================
   WENLOCK: THE AIR (prefix WLAIR). The things that make the town feel lived in rather than built:
   - sunbeams: soft gold shafts (a soft layered shaft of light, wl_beam) at the churchyard yews, on the green, in the square, and indoors in the church nave, the library and the chapel;
   - blowing leaves: about sixty small leaves drifting along the ground in the churchyard, on the green, on the back track and by the square (decor with a cloudid 'wlf<n>', moved
     every frame by an update wrapper, the same trick as the garden's butterflies);
   - lamp pools and lit windows at dusk and night: warm lights by the doors of about half of the houses (lights flagged lamp, which the engine already dims by day);
   - coloured light from the stained glass in the church, and warm sun patches on the floor under every window of every room, by day;
   - a warm golden haze for Wenlock in the day, subtle, wrapped round weatherNow (rain, fog and storm are left alone).
   ========================================================================== */
const WLAIR={fly:[],beams:0};
function wlaImgs(){
  if(IMG.wl_leaf0)return;
  // a soft slanted shaft of sunlight, layered so its edges fade out
  IMG.wl_beam=mkCanvas(170,320,(x,w,h)=>{
    for(let i=0;i<10;i++){const inset=i*3.4,a=.06;const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,238,170,0)');g.addColorStop(.18,'rgba(255,236,160,'+a*1.3+')');g.addColorStop(.75,'rgba(255,228,140,'+a*1.6+')');g.addColorStop(1,'rgba(255,224,130,'+a+')');
      x.fillStyle=g;x.beginPath();x.moveTo(34+inset,0);x.lineTo(86-inset,0);x.lineTo(160-inset*1.6,h);x.lineTo(30+inset*1.6,h);x.closePath();x.fill()}
    x.fillStyle='rgba(255,250,215,.5)';for(let i=0;i<22;i++){const u=hash2(i,1,2),v=hash2(i,2,2),px=50+v*70*(.4+u)+u*34,py=40+u*250;x.beginPath();x.arc(px,py,1.1+hash2(i,3,2)*1.4,0,6.3);x.fill()}});
  NPC_H.wl_beam=3.0;
  [['#a8641c','#6a3a0c'],['#c89a2c','#7a5810'],['#7a8c2c','#44541a'],['#b0481c','#6a2410']].forEach(([a,b],i)=>{
    IMG['wl_leaf'+i]=mkCanvas(30,20,(x,w,h)=>{x.fillStyle=a;x.beginPath();x.moveTo(2,10);x.quadraticCurveTo(14,-2,28,10);x.quadraticCurveTo(14,22,2,10);x.fill();x.strokeStyle=b;x.lineWidth=1.4;x.beginPath();x.moveTo(3,10);x.lineTo(27,10);x.stroke();
      x.lineWidth=.9;for(let k=0;k<3;k++){x.beginPath();x.moveTo(9+k*6,10);x.lineTo(13+k*6,4+k);x.moveTo(9+k*6,10);x.lineTo(13+k*6,16-k);x.stroke()}});
    NPC_H['wl_leaf'+i]=.1});
}
function wlaPass(C){
  const {hs}=C;
  wlaImgs();
  // sunbeams out of doors: between the churchyard yews, on the green, in the square, in the orchard
  const beams=[[18,15],[26,17],[32,19],[15,21],[20,19],[34,24],[23,63],[33,62],[27,75],[21,72],[37,68],[46,48],[51,52],[44,53],[84,64],[88,69],[56,24],[45,32]];
  for(const [x,y] of beams)if(C.free(x,y))C.dc('wl_beam',x,y,{bob:0,sc:1});
  // blowing leaves
  const zones=[[14,13,34,25,16],[18,57,39,79,16],[40,14,91,14,12],[41,46,55,54,10],[4,49,96,51,8],[24,27,24,49,4]];
  let n=0;for(const [x0,y0,x1,y1,cnt] of zones)for(let i=0;i<cnt;i++){
    const x=x0+((hs(i,n,81)*(x1-x0+1))|0),y=y0+((hs(i,n,82)*(y1-y0+1))|0);if(C.rows[y][x]!=='.'||C.block[y*C.W+x])continue;
    const id='wlf'+WLAIR.fly.length;C.decor.push({k:'wl_leaf'+((hs(x,y,83)*4)|0),x,y,block:false,walk:true,deco:true,bob:.04,sc:.8+hs(x,y,84)*.5,cloudid:id});
    WLAIR.fly.push({sp:.07+hs(x,y,85)*.08,ph:hs(x,y,86),sc:.8+hs(x,y,84)*.5,len:1.6+hs(x,y,87)*1.4});n++}
  C.lv._wla={fly:WLAIR.fly};
  // the lit windows: a warm light by the door of about half the houses, which the engine only lets shine when it is not day
  C.lv._wlaLights=[];
  for(const h of C.houses){if(!h.front||hs(h.x0,h.y0,88)>.55)continue;C.lv._wlaLights.push([h.front[0]+.5-h.wall[0]*.35,h.front[1]+.5-h.wall[1]*.35])}
}
/* ---- the update wrapper: leaves blow, the house lights go in, and the church and the rooms get their light ---- */
{const _u=update;let fdec=null,fl=[],lightLv=-1;
  update=function(dt){
    try{
      if(G.state==='play'&&G.decor){
        if(LEVEL===496){
          const L=LEVELS[496];
          if(L&&L._wla){
            if(fdec!==G.decor){fdec=G.decor;fl=[];const by=new Map();for(const q of G.decor)if(q.cloudid&&q.cloudid.startsWith('wlf'))by.set(q.cloudid,q);L._wla.fly.forEach((f,i)=>{const d=by.get('wlf'+i);if(d)fl.push([d,f])})}
            const t=G.time;for(const [d,f] of fl){const u=(t*f.sp+f.ph)%1,a=u*Math.PI*2;d.ox=(u-.5)*f.len;d.oy=Math.sin(a*2+f.ph*9)*.2;d.bob=.03+Math.abs(Math.sin(a*5+f.ph*7))*.1;d.sc=f.sc*Math.max(.05,1-Math.pow(Math.abs(2*u-1),6))}
          }
          if(L&&L._wlaLights&&lightLv!==LIGHTS){lightLv=LIGHTS;for(const [x,y] of L._wlaLights)LIGHTS.push({x,y,ph:hash2(x|0,y|0,9)*6.28,key:-5000-LIGHTS.length,taken:false,red:false,free:true,lamp:true,calm:true,col:[1.35,.95,.42],range2:14,kI:.85,wlx:1})}
        }else if(LEVEL>=WL.H0&&LEVEL<=WL.H0+99){
          if(lightLv!==LIGHTS){lightLv=LIGHTS;wlaRoomLights()}
          const hr=(G.clock%1440)/60,sun=hr>6.5&&hr<19?Math.sin((hr-6.5)/12.5*Math.PI):0;
          for(const l of LIGHTS)if(l.wlsun)l.kI=l.wlsun*sun;
        }
      }
    }catch(e){console.error('WLAIR',e)}
    return _u.apply(this,arguments)}}
/* sun patches under the windows (golden, by day only) and the coloured light of the church glass */
function wlaRoomLights(){
  const L=LEVELS[LEVEL];if(!L||!L.rows)return;const D=WLIN_ROOMS[L.wlin],W=L.rows[0].length,H=L.rows.length;if(!D)return;
  const add=(x,y,col,kI,sun,r2)=>LIGHTS.push({x:x+.5,y:y+.5,ph:hash2(x,y,9)*6.28,key:-6000-LIGHTS.length,taken:false,red:false,free:true,calm:true,col,range2:r2||6,kI,wlsun:sun});
  for(const [x,y] of (D.win||[])){const ix=x===0?1:x===W-1?W-2:x,iy=y===0?1:y===H-1?H-2:y;add(ix,iy,[1.4,1.15,.55],.4,.9,5)}
  if(LEVEL===WL.H0){   // the church: glass in red, blue, gold and green on the nave floor
    const gl=[[3,2,[1.5,.3,.3]],[9,2,[.35,.55,1.5]],[1,4,[1.45,1.1,.3]],[11,4,[.4,1.3,.5]],[1,7,[.7,.4,1.4]],[11,7,[1.5,.5,.3]]];
    for(const [x,y,c] of gl)add(x,y,c,.35,1,7)}
  if(LEVEL===WLX.CHAPEL){for(const [x,y,c] of [[1,2,[1.5,.3,.3]],[5,2,[.4,.55,1.5]],[1,3,[1.4,1.0,.35]]])add(x,y,c,.4,1,7)}
}
/* a warm golden haze for the town by day, rain and fog and storm left as they are */
{const _w=weatherNow;weatherNow=function(){const w=_w.apply(this,arguments);
  if(LEVEL===496&&(!w||w.id==='clear'||w.id==='haze'||w.id==='mist'))return {id:'mist',n:'Golden light',fog:.004,haze:.1,dark:0,mix:.13,col:[255,228,165],text:'The air is warm and golden, and full of woodsmoke and birdsong.'};
  return w}}
/* sunbeams indoors: the church nave, the library desks */
if(typeof WLIN_ROOMS!=='undefined'){
  const beam=(C,xs)=>{wlaImgs();for(const [x,y] of xs)C.raw('wl_beam',x,y,{block:false,walk:true,deco:true,bob:0,sc:.7})};
  WLIN_ROOMS.church.extra=(C,b)=>beam(C,[[1,6],[11,6],[1,9],[11,9]]);
  WLIN_ROOMS.library.extra=(C,b)=>beam(C,[[2,3],[12,4],[2,6]]);
  WLIN_ROOMS.chapel&&(WLIN_ROOMS.chapel.extra=(C,b)=>beam(C,[[1,3]]));
}
