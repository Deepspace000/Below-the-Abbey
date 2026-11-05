/* ==========================================================================
   TOP-DOWN LEVELS (the planets of the Floor of the Moon, level ids 9891 to 9894).
   A level listed in TD.levels is played on the same grid, with the same turn rounds and the same fights as every other level, but it is SEEN
   from above: render3D() draws nothing there and drawWorld() draws tdDraw() instead, a map that follows the party. The party is one token.
   Moving:  the four arrows (or W A S D, or the pad) walk north, south, west and east on the map, whatever way the party faced before.
   Fighting: walking into a creature turns to it and the selected hero strikes it (a bump attack). The Attack button and the powers strike the
             creature next to the party, turning to it first. Creatures walk up and strike back in the usual rounds.
   Seeing:  only the squares in line of sight, within TD.sight squares, are lit. Squares seen once stay on the map, dimmed. Nothing is drawn in
             the dark, so a maze must be explored. The remembered squares are G.seen, so the O map and the minimap work too.
   Hooks in index.html (all one line each): render3D() returns at once on a top-down level, drawWorld() calls tdDraw(), act() calls tdAct().
   ========================================================================== */
const TD={levels:new Set(),sight:7,cs:21,look:{},vis:null,visKey:'',visLv:-1};
TD.look.def={floor:['#ecdcae','#e6d5a5','#efe0b6'],wall:['#7d6a4f','#74634a','#85735a'],wallTop:'#b59e76',mortar:'rgba(40,28,14,.5)',ink:'#241a0e',lip:'#8a7048',vign:'#120d08',door:'#9a6a32',exit:'#c42a20',grass:'#b9c58a',keep:'#d2cbb4',grave:'#c4b694',gold:'#c9993a',shade:'4,3,2'};
TD.zones=null;TD.zLv=-1;
function tdOn(){return TD.levels.has(LEVEL)}
function tdLook(){return TD.look[LEVEL]||TD.look.def}
/* ---------- what can be seen now: line of sight from the party, kept in TD.vis and added to G.seen ---------- */
function tdBuildZones(){
  TD.zLv=LEVEL;TD.zones=new Uint8Array(MW*MH);TD.zlist=[];const lv=LEVELS[LEVEL],zs=lv&&lv._td&&lv._td.zones||[];
  zs.forEach(z=>{TD.zlist.push(z);for(let y=z.y0;y<=z.y1;y++)for(let x=z.x0;x<=z.x1;x++)TD.zones[y*MW+x]=TD.zlist.length})}
function tdZone(x,y){return TD.zones&&TD.zones[y*MW+x]?TD.zlist[TD.zones[y*MW+x]-1]:null}
function tdUpdateVis(){
  if(TD.zLv!==LEVEL||!TD.zones||TD.zones.length!==MW*MH)tdBuildZones();
  const P=G.P,key=LEVEL+':'+P.x+','+P.y;
  if(TD.visKey===key&&TD.vis&&TD.vis.length===MW*MH)return;
  TD.visKey=key;TD.vis=new Uint8Array(MW*MH);const R=TD.sight;
  for(let y=P.y-R;y<=P.y+R;y++)for(let x=P.x-R;x<=P.x+R;x++){
    if(x<0||y<0||x>=MW||y>=MH)continue;
    if(Math.hypot(x-P.x,y-P.y)>R+.5)continue;
    if(x===P.x&&y===P.y||hasLOS(P.x,P.y,x,y)){TD.vis[y*MW+x]=1;if(G.seen&&G.seen[y])G.seen[y][x]=1}
  }
}
function tdVisible(x,y){return !!(TD.vis&&x>=0&&y>=0&&x<MW&&y<MH&&TD.vis[y*MW+x])}
/* ---------- moving and striking ---------- */
const TD_DIR={fwd:0,right:1,back:2,left:3,turnR:1,turnL:3};   // index into DIRS: north, east, south, west
function tdFace(f){
  const P=G.P,C=G.C;let d=((f-P.f)%4+4)%4;if(d===3)d=-1;
  P.f=f;P.angT+=d*Math.PI/2;C.a=P.angT}                       // the turn is instant: the top-down view has nothing to swing round
function tdPassable(g){return g===3||g===4||g===5||g===7||(g>=15&&g<=19)||(g>=30&&g<100)||(g>=200&&g<1000)||(g>=1000&&typeof KH_DOOR!=='undefined'&&!!KH_DOOR[g])}
function tdAct(id){
  if(!tdOn())return false;
  if(id in TD_DIR){
    const f=TD_DIR[id],d=DIRS[f];tdFace(f);
    const e=enemyAt(G.P.x+d[0],G.P.y+d[1]);
    if(e&&e.hp>0){const i=G.sel;if(G.heroes[i].alive&&heroAttack(i))heroDone(i);return true}   // a bump attack
    const nx=G.P.x+d[0],ny=G.P.y+d[1],g=G.grid[ny]&&G.grid[ny][nx];
    if(g>0&&!tdPassable(g)){sfx('bump');G.shake=.1;return true}   // a plain wall: a bump, and no words
    doMove(0);return true}
  if(id==='attack'||id==='special'){                           // strike the creature next to the party, turning to it first
    const P=G.P,here=DIRS[P.f];
    if(!enemyAt(P.x+here[0],P.y+here[1])){
      for(let f=0;f<4;f++){const d=DIRS[f],e=enemyAt(P.x+d[0],P.y+d[1]);if(e&&e.hp>0){tdFace(f);break}}}}
  return false}
/* ---------- drawing ---------- */
function tdSeal(sx,sy,n,L){
  ctx.fillStyle=L.floor[0];ctx.fillRect(sx,sy,n,n);const p=.5+.5*Math.sin(G.time*3),cx=sx+n/2,cy=sy+n/2;
  ctx.fillStyle=L.exit;ctx.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU,r=n*(.5+(i%2?.08:0));ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,220,170,'+(.4+.4*p)+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,n*.24,0,TAU);ctx.stroke();
  ctx.fillStyle='rgba(255,230,190,'+(.5+.4*p)+')';ctx.fillRect(cx-1,cy-n*.16,2,n*.32);ctx.fillRect(cx-n*.16,cy-1,n*.32,2)}
function tdCell(ox,oy,x,y,g,cs,L,vis){
  const sx=Math.round(ox+x*cs),sy=Math.round(oy+y*cs),n=Math.ceil(cs),h=hash2(x,y,LEVEL);
  if(g>0){
    const open=(xx,yy)=>xx>=0&&yy>=0&&xx<MW&&yy<MH&&G.grid[yy][xx]===0;
    if(g===3||g===4||(g>=15&&g<=19)||(g>=200&&g<1000)){ // a door of oak with iron bands
      ctx.fillStyle=L.door;ctx.fillRect(sx,sy,n,n);ctx.strokeStyle=L.ink;ctx.lineWidth=1.5;ctx.strokeRect(sx+1,sy+1,n-2,n-2);
      ctx.fillStyle='#3a2410';for(const k of [.3,.66])ctx.fillRect(sx+2,sy+n*k,n-4,2);ctx.fillStyle=L.gold;ctx.fillRect(sx+n*.5-1.5,sy+n*.45,3,3);return}
    if(g===5||g===7||(g>=30&&g<100)||(g>=1000&&typeof KH_DOOR!=='undefined'&&KH_DOOR[g])){ // the way out: a red wax seal on the parchment
      tdSeal(sx,sy,n,L);return}
    // a wall: dark inked stone in courses, with a lit edge where it faces the floor
    ctx.fillStyle=L.wall[(h*3)|0];ctx.fillRect(sx,sy,n,n);
    ctx.strokeStyle=L.mortar;ctx.lineWidth=1;ctx.beginPath();const row=((x+y)&1)?n/2:0;
    ctx.moveTo(sx,sy+n/2);ctx.lineTo(sx+n,sy+n/2);ctx.moveTo(sx+row+n/4,sy);ctx.lineTo(sx+row+n/4,sy+n/2);ctx.moveTo(sx+(n/2-row)+n/4,sy+n/2);ctx.lineTo(sx+(n/2-row)+n/4,sy+n);ctx.stroke();
    if(open(x,y-1)){ctx.fillStyle=L.wallTop;ctx.fillRect(sx,sy,n,2)}
    if(open(x,y+1)){ctx.fillStyle=L.ink;ctx.fillRect(sx,sy+n-2,n,2);ctx.fillStyle=L.lip;ctx.fillRect(sx,sy+n,n,0)}
    if(open(x-1,y)){ctx.fillStyle=L.wallTop;ctx.fillRect(sx,sy,1,n)}
    if(open(x+1,y)){ctx.fillStyle=L.ink;ctx.fillRect(sx+n-1,sy,1,n)}
    return}
  const z=tdZone(x,y),pat=z&&z.pat;
  ctx.fillStyle=z&&z.col?z.col:L.floor[(h*3)|0];ctx.fillRect(sx,sy,n,n);
  if(pat==='flag'){ctx.strokeStyle='rgba(60,44,26,.38)';ctx.lineWidth=1;ctx.strokeRect(sx+.5,sy+.5,n-1,n-1)}   // flagstones
  else if(pat==='tuft'){ctx.strokeStyle=L.tuft||'rgba(60,86,34,.55)';ctx.lineWidth=1;for(let i=0;i<2;i++){const tx=sx+3+((h*(11+i*5))%1)*(n-7),ty=sy+4+((h*(17+i*3))%1)*(n-8);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx-1,ty-3);ctx.moveTo(tx,ty);ctx.lineTo(tx+1,ty-3);ctx.stroke()}}   // tufts, frost marks, embers
  else if(pat==='crack'){ctx.strokeStyle=L.crack||'rgba(60,30,20,.5)';ctx.lineWidth=1;if(h>.45){ctx.beginPath();ctx.moveTo(sx+2,sy+((h*9)%1)*n);ctx.lineTo(sx+n/2,sy+n/2+((h*5)%1)*4);ctx.lineTo(sx+n-2,sy+((h*7)%1)*n);ctx.stroke()}}
  else{ctx.fillStyle=L.speck||'rgba(110,80,40,.16)';if(h>.7)ctx.fillRect(sx+((h*9)%1)*(n-3),sy+((h*21)%1)*(n-3),2,2);if(h<.12){ctx.fillRect(sx+((h*53)%1)*(n-4),sy+((h*31)%1)*(n-4),3,1)}}   // a dirt road, with a few specks
}
function tdToken(im,sx,sy,w,h,o){ // a creature or prop picture stood on its square: feet on the square's lower edge, a shadow under it
  if(!im)return;o=o||{};
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx,sy+2,w*.42,w*.14,0,0,TAU);ctx.fill();
  ctx.save();if(o.alpha!==undefined)ctx.globalAlpha=o.alpha;ctx.drawImage(im,sx-w/2+(o.dx||0),sy-h+(o.dy||0),w,h);
  if(o.flash>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(.9,o.flash);ctx.drawImage(im,sx-w/2+(o.dx||0),sy-h+(o.dy||0),w,h)}
  ctx.restore()}
function tdDraw(){
  const L=tdLook(),C=G.C,cs=TD.cs,VWd=420,VHd=210;
  G.hits=[];G._spr=null;G.arrows.length=0;
  ctx.fillStyle=L.vign;ctx.fillRect(0,0,VWd,VHd);
  if(!G.grid||!G.seen||!G.P)return;
  tdUpdateVis();
  const ox=VWd/2-(C.x+.5)*cs,oy=VHd/2-(C.y+.5)*cs;
  const x0=Math.max(0,Math.floor(-ox/cs)),x1=Math.min(MW-1,Math.ceil((VWd-ox)/cs)),y0=Math.max(0,Math.floor(-oy/cs)),y1=Math.min(MH-1,Math.ceil((VHd-oy)/cs));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const seen=G.seen[y][x],vis=TD.vis[y*MW+x];if(!seen&&!vis)continue;
    tdCell(ox,oy,x,y,G.grid[y][x],cs,L,vis);
    if(!vis){ctx.fillStyle='rgba(26,18,10,.42)';ctx.fillRect(Math.round(ox+x*cs),Math.round(oy+y*cs),Math.ceil(cs),Math.ceil(cs))}
  }
  const cell=(x,y)=>[ox+(x+.5)*cs,oy+(y+1)*cs-3];
  // the way out: a pulsing golden glow around the seal, once its square has been seen, and an arrow at the edge of the map pointing to it when it is off screen
  {const lv=LEVELS[LEVEL],t=lv&&lv._td,ex=t&&t.exit;
    if(ex&&(G.seen[ex[1]][ex[0]]||TD.vis[ex[1]*MW+ex[0]])){
      tdSeal(Math.round(ox+ex[0]*cs),Math.round(oy+ex[1]*cs),Math.ceil(cs),L);
      const p=.5+.5*Math.sin(G.time*3),ex_=ox+(ex[0]+.5)*cs,ey=oy+(ex[1]+.5)*cs,R=cs*(1.6+.5*p);
      ctx.save();const gr=ctx.createRadialGradient(ex_,ey,cs*.3,ex_,ey,R);gr.addColorStop(0,'rgba(255,214,110,.75)');gr.addColorStop(1,'rgba(255,214,110,0)');ctx.fillStyle=gr;ctx.fillRect(ex_-R,ey-R,R*2,R*2);ctx.restore();
      const inside=ex_>8&&ex_<VWd-8&&ey>8&&ey<VHd-8;
      if(!inside){const px=ox+(C.x+.5)*cs,py=oy+(C.y+.5)*cs,a=Math.atan2(ey-py,ex_-px),r=Math.min(VWd/2-18,VHd/2-18)*(.55+.05*p),ax=VWd/2+Math.cos(a)*Math.min(r*1.8,VWd/2-18),ay=VHd/2+Math.sin(a)*r;
        ctx.save();ctx.translate(ax,ay);ctx.rotate(a);ctx.fillStyle='#ffd66e';ctx.strokeStyle='#241a0e';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-5,-7);ctx.lineTo(-2,0);ctx.lineTo(-5,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
        txt('EXIT',ax,ay+(Math.sin(a)>0?-12:16),7,'#ffd66e','center',true)}}}
  // things lying on the ground
  for(const it of G.items){if(it.taken||!tdVisible(it.x,it.y))continue;
    const sx=ox+(it.x+.5)*cs,sy=oy+(it.y+.5)*cs,p=.5+.5*Math.sin(G.time*4+it.x);
    const gr=ctx.createRadialGradient(sx,sy,1,sx,sy,cs*.8);gr.addColorStop(0,`rgba(255,226,120,${.45+.25*p})`);gr.addColorStop(1,'rgba(255,226,120,0)');ctx.fillStyle=gr;ctx.fillRect(sx-cs,sy-cs,cs*2,cs*2);
    try{const d=ITEMDEF[it.k];if(d)itemIcon(Object.assign({id:it.k},d),sx,sy,cs/44);else throw 0}catch(e){ctx.fillStyle='#ffd76a';ctx.beginPath();ctx.arc(sx,sy,cs*.22,0,TAU);ctx.fill()}}
  // chests, people and props
  const order=[];
  for(const d of G.decor){if(d.hidden||d.found||d.wd||d.deco||!tdVisible(d.x,d.y))continue;if(!(d.loot||d.npc||d.block))continue;order.push(d)}
  order.sort((a,b)=>a.y-b.y);
  for(const d of order){
    const [sx,sy]=cell(d.x,d.y),im=IMG[d.k];
    if(d.loot&&(d.k==='gy_chest'||!im)){ // a chest: a little box with a gold band
      ctx.fillStyle='#5a3a1c';ctx.fillRect(sx-cs*.36,sy-cs*.55,cs*.72,cs*.5);ctx.fillStyle='#caa24e';ctx.fillRect(sx-cs*.36,sy-cs*.36,cs*.72,2.5);ctx.fillRect(sx-2,sy-cs*.42,4,cs*.2);continue}
    if(im){const hh=Math.min(cs*1.3,(NPC_H[d.k]||1)*cs*.75*(d.sc||1)),ww=hh*im.width/im.height;tdToken(im,sx,sy,Math.min(ww,cs*1.1),hh*Math.min(1,cs*1.1/ww))}}
  // creatures
  const foes=G.enemies.filter(e=>(e.hp>0||e.dying>0)&&tdVisible(Math.round(e.rx),Math.round(e.ry))).sort((a,b)=>a.ry-b.ry);
  for(const e of foes){
    const def=ENEMY_DEF[e.t]||{},im=(e.lunge>.2&&e.hp>0&&IMG[def.img+'A'])||IMG[def.img]||IMG._fbRat;
    const big=Math.max(1,Math.min(3,def.ph||1.2));
    const [sx,sy]=cell(e.rx,e.ry),hh=cs*Math.min(1.5,.72*big),ww=im?hh*im.width/im.height:hh;
    const dx=e.x-G.P.x,dy=e.y-G.P.y,lu=e.lunge>0&&e.hp>0?-Math.sign(dx)*e.lunge*cs*.4:0,lv=e.lunge>0&&e.hp>0?-Math.sign(dy)*e.lunge*cs*.4:0;
    e.sx=sx;e.sy=sy-hh*.7;
    const fall=e.hp<=0?Math.max(0,e.dying/.55):1;
    if(im)tdToken(im,sx+lu,sy+lv,Math.min(ww,cs*2.2),hh,{alpha:fall,flash:e.flash});
    if(e.hp>0){const bw=cs*.9,bx=sx-bw/2,by=sy-hh-4,fr=Math.max(0,e.hp/e.maxhp);
      ctx.fillStyle='rgba(10,4,4,.8)';ctx.fillRect(bx,by,bw,3);ctx.fillStyle=e.alert?'#e84a38':'#c8a050';ctx.fillRect(bx,by,bw*fr,3)}
  }
  // the party: the hero whose turn it is, in a ring, with an arrow for the way it faces
  {const px=ox+(C.x+.5)*cs,py=oy+(C.y+.5)*cs,f=G.P.f,d=DIRS[f],r=cs*.46;
    ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(px,py+r*.7,r*.95,r*.4,0,0,TAU);ctx.fill();
    ctx.save();ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.clip();ctx.fillStyle='#120e0a';ctx.fillRect(px-r,py-r,r*2,r*2);
    const img=portraitImg(G.sel);if(img){const sw=Math.min(img.width,img.height),sx=(img.width-sw)/2;ctx.drawImage(img,sx,0,sw,sw*.9,px-r,py-r,r*2,r*2)}
    ctx.restore();
    ctx.lineWidth=2;ctx.strokeStyle='#ffe36a';ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.stroke();
    const ax=px+d[0]*(r+5),ay=py+d[1]*(r+5),nx=-d[1],ny=d[0];
    ctx.fillStyle='#ffe36a';ctx.beginPath();ctx.moveTo(ax+d[0]*5,ay+d[1]*5);ctx.lineTo(ax-d[0]*2+nx*5,ay-d[1]*2+ny*5);ctx.lineTo(ax-d[0]*2-nx*5,ay-d[1]*2-ny*5);ctx.closePath();ctx.fill();
  }
  // darkness closing in at the edge of sight
  {const px=ox+(C.x+.5)*cs,py=oy+(C.y+.5)*cs,gr=ctx.createRadialGradient(px,py,cs*4.2,px,py,cs*(TD.sight+1.5));gr.addColorStop(0,'rgba(11,8,5,0)');gr.addColorStop(1,'rgba(11,8,5,.72)');ctx.fillStyle=gr;ctx.fillRect(0,0,VWd,VHd)}
  tdFrame(L);
}

/* a border like the edge of an old map: a double ink line, gold corners, a compass rose, the name of the place, and the name of the room the party stands in */
function tdFrame(L){
  const w=420,h=210;ctx.save();ctx.strokeStyle=L.ink;ctx.lineWidth=3;ctx.strokeRect(2,2,w-4,h-4);ctx.strokeStyle=L.gold;ctx.lineWidth=1;ctx.strokeRect(5,5,w-10,h-10);
  ctx.fillStyle=L.gold;for(const [cx,cy] of [[5,5],[w-5,5],[5,h-5],[w-5,h-5]]){ctx.beginPath();ctx.moveTo(cx,cy-5);ctx.lineTo(cx+5,cy);ctx.lineTo(cx,cy+5);ctx.lineTo(cx-5,cy);ctx.closePath();ctx.fill()}
  // the compass rose, top right
  const cx=w-26,cy=28,r=15;ctx.globalAlpha=.9;ctx.fillStyle='rgba(26,18,10,.42)';ctx.beginPath();ctx.arc(cx,cy,r+3,0,TAU);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle='#e6d6a6';for(let i=0;i<4;i++){const a=i*Math.PI/2-Math.PI/2,k=i===0?r:r*.8;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*k,cy+Math.sin(a)*k);ctx.lineTo(cx+Math.cos(a+.45)*r*.28,cy+Math.sin(a+.45)*r*.28);ctx.lineTo(cx+Math.cos(a-.45)*r*.28,cy+Math.sin(a-.45)*r*.28);ctx.closePath();ctx.fill()}
  ctx.fillStyle=L.exit;ctx.beginPath();ctx.moveTo(cx,cy-r);ctx.lineTo(cx+3,cy-r*.3);ctx.lineTo(cx-3,cy-r*.3);ctx.closePath();ctx.fill();
  txt('N',cx,cy-r-4,7,'#e6d6a6','center',true);ctx.restore();
  const z=tdZone(G.P.x,G.P.y);
  txt(String(LEVEL_NAMES[LEVEL]||'').toUpperCase(),210,16,9,'#e6d6a6','center',true);
  if(z&&z.name)txt(z.name,210,198,8,'#f0e0b0','center',true);
}
