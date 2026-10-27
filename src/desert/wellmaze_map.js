/* ==========================================================================
   THE WELL MAZE: the illuminated area maps of the four levels (prefix wmm / WMM). One parchment sheet per level, drawn from the real rows and decor: violet brick walls, lilac floors,
   rooms tinted by kind, crystals, chests, stairs. Sealed vaults, secret closets and the island are left out until they have been opened. Pins (gold keys, levers, vault stars) appear only
   after the key has been hinted at, the switch used or the door opened; the sheet is redrawn when that changes (the pins are part of the cache key).
   ========================================================================== */
const WMM={tint:[-8,-30,26]};
function wmmState(L){
  const F=(typeof G!=='undefined'&&G.flags&&G.flags.wm)||null,W=L._wm;if(!F)return {open:{},pins:[],sig:'-'};
  const id=WM.IDS[W.k],pins=[];
  // keys: hinted and not yet used
  for(const [kid,pos] of Object.entries(W.keyAt||{})){const n=+kid.slice(5);if(F.hint['key'+n]&&!F.unl[n-1])pins.push({t:'key',x:pos.x,y:pos.y,n})}
  // switches that have been used
  for(const s of W.sw)if(F.sw[id+':'+s.n])pins.push({t:'sw',x:s.x,y:s.y,type:s.type});
  // vaults that have been opened
  for(const v in W.vault)if(F.pin[id+':'+v]){const q=W.vault[v];pins.push({t:'vault',x:(q.rect.x0+q.rect.x1)/2,y:(q.rect.y0+q.rect.y1)/2,v})}
  const open={};for(const key in F.open){const [lv,xy]=key.split(':');if(+lv===id)open[xy]=1}
  return {open,pins,sig:pins.map(p=>p.t+p.x+','+p.y).join('|')+'#'+Object.keys(open).length+(F.row?'r':'')}}
function wmmDraw(c,x,L,api){
  const R=L.rows,W=R[0].length,H=R.length,F=api.fit(W,H),s=F.s,X=F.X,Y=F.Y,k=L._wm.k,M=L._wm.M,st=wmmState(L),INK='#1c1030';
  const roomAt=new Map();for(const r of M.rooms){for(let yy=r.y0;yy<=r.y1;yy++)for(let xx=r.x0;xx<=r.x1;xx++)roomAt.set(yy*W+xx,r)}
  // what is hidden: sealed rooms (until their door is open), closets and the island (until reached)
  const hidden=new Set();
  for(const r of M.rooms)if(r.sealed){const d=r.door,vis=r.noDoor?(G.flags.wm&&G.flags.wm.row):(d&&st.open[d.x+','+d.y]);if(!vis)for(let yy=r.y0;yy<=r.y1;yy++)for(let xx=r.x0;xx<=r.x1;xx++)hidden.add(yy*W+xx)}
  for(const cl of L._wm.closets||[])if(!st.open[cl.door.x+','+cl.door.y])hidden.add(cl.y*W+cl.x);
  const open=(cx,cy)=>R[cy]&&R[cy][cx]==='.'&&!hidden.has(cy*W+cx);
  // ground and walls
  x.save();x.fillStyle='#3b2459';x.fillRect(F.ox,F.oy,W*s,H*s);
  const FL={start:'#efe6f6',stairOut:'#efe6f6',camp:'#e8dcc8',cistern:'#b9b4ee',cellar:'#e0cfc4',shrine:'#f0e0f2',mine:'#d9ccd8',grotto:'#d8c4f4',library:'#e9dcc9',mirror:'#e2e6f6',spiders:'#e8e0f0',fungus:'#dcc8ee',
    bells:'#f0e2c2',lanterns:'#f0dcec',boss:'#e4c4ee',lake:'#a8a4e6',vault:'#f4e6b8',island:'#c8d8f0',riddle:'#f4e6b8'};
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){
    if(open(cx,cy)){const r=roomAt.get(cy*W+cx);let col=r?FL[r.kind]||'#eee4f4':'#f1e9f7';
      if(r&&(r.kind==='cistern'||r.kind==='lake')&&cx>r.x0&&cx<r.x1&&cy>r.y0&&cy<r.y1)col=r.kind==='lake'?'#9c98e4':'#b2aeea';
      x.fillStyle=col;x.fillRect(X(cx),Y(cy),s+.3,s+.3)}
    else{let near=false;for(let dy=-1;dy<=1&&!near;dy++)for(let dx=-1;dx<=1;dx++)if(open(cx+dx,cy+dy)||hidden.has((cy+dy)*W+cx+dx)){near=true;break}
      if(near){x.fillStyle=((cx+cy)&1)?'#7a54a8':'#6c4898';x.fillRect(X(cx),Y(cy),s+.3,s+.3)}}}
  // brick lines on the walls that face a passage
  x.strokeStyle='rgba(28,16,48,.55)';x.lineWidth=.3;x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(open(cx,cy))continue;let near=hidden.has(cy*W+cx);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(open(cx+dx,cy+dy))near=true;if(!near)continue;
    x.moveTo(X(cx),Y(cy)+s*.5);x.lineTo(X(cx)+s,Y(cy)+s*.5);x.moveTo(X(cx)+s*((cy&1)?.3:.7),Y(cy));x.lineTo(X(cx)+s*((cy&1)?.3:.7),Y(cy)+s*.5)}
  x.stroke();
  // the edge of the open ground, inked
  x.strokeStyle=INK;x.lineWidth=.55;x.lineCap='round';x.beginPath();
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<W;cx++){if(!open(cx,cy))continue;
    if(!open(cx,cy-1)){x.moveTo(X(cx),Y(cy));x.lineTo(X(cx+1),Y(cy))}if(!open(cx,cy+1)){x.moveTo(X(cx),Y(cy+1));x.lineTo(X(cx+1),Y(cy+1))}
    if(!open(cx-1,cy)){x.moveTo(X(cx),Y(cy));x.lineTo(X(cx),Y(cy+1))}if(!open(cx+1,cy)){x.moveTo(X(cx+1),Y(cy));x.lineTo(X(cx+1),Y(cy+1))}}
  x.stroke();
  // soft violet glow in the rooms
  for(const r of M.rooms){if(r.sealed||!['grotto','boss','lake','lanterns','bells','shrine','fungus','mirror'].includes(r.kind))continue;
    const a=X((r.x0+r.x1+1)/2),b=Y((r.y0+r.y1+1)/2),rad=Math.max(r.x1-r.x0,r.y1-r.y0)*s*.75,gr=x.createRadialGradient(a,b,0,a,b,rad);gr.addColorStop(0,'rgba(170,110,255,.28)');gr.addColorStop(1,'rgba(170,110,255,0)');x.fillStyle=gr;x.beginPath();x.arc(a,b,rad,0,6.3);x.fill()}
  // props
  const cell=(d)=>[X(d.x+.5),Y(d.y+.5)];
  const dia=(a,b,r,fill)=>{x.fillStyle=fill;x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.moveTo(a,b-r*1.3);x.lineTo(a+r*.8,b);x.lineTo(a,b+r*.9);x.lineTo(a-r*.8,b);x.closePath();x.fill();x.stroke()};
  for(const d of L.decor){if(hidden.has(d.y*W+d.x)||d.found)continue;const [a,b]=cell(d),k2=d.k;
    if(/^wm_crystal|wm_geode/.test(k2))dia(a,b,s*.5,k2==='wm_crystal_teal'?'#38c8c0':k2==='wm_crystal_white'?'#f4f0ff':'#9a58e0');
    else if(/^wm_mush|wm_bellflower|wm_moss/.test(k2)){x.fillStyle='#b890e0';x.strokeStyle=INK;x.lineWidth=.25;x.beginPath();x.arc(a,b,s*.32,Math.PI,0);x.fill();x.stroke()}
    else if(k2==='wm_chest'||k2==='wm_treasure_chest'){x.fillStyle=k2==='wm_chest'?'#a8743a':'#d8b038';x.strokeStyle=INK;x.lineWidth=.3;x.fillRect(a-s*.34,b-s*.24,s*.68,s*.48);x.strokeRect(a-s*.34,b-s*.24,s*.68,s*.48)}
    else if(k2==='wm_brazier'||k2==='wm_candelabra'||k2==='wm_cage_lantern'||k2==='wm_lamp_post'){x.fillStyle='#ff9a3a';x.beginPath();x.arc(a,b,s*.26,0,6.3);x.fill()}
    else if(/^wm_lantern_/.test(k2)){x.fillStyle=k2.endsWith('gold')?'#f0c040':k2.endsWith('lilac')?'#d8b8f4':'#8a40e0';x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.arc(a,b,s*.34,0,6.3);x.fill();x.stroke()}
    else if(k2==='wm_bell'){x.fillStyle='#c89a3a';x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.moveTo(a-s*.35,b+s*.3);x.quadraticCurveTo(a-s*.3,b-s*.4,a,b-s*.4);x.quadraticCurveTo(a+s*.3,b-s*.4,a+s*.35,b+s*.3);x.closePath();x.fill();x.stroke()}
    else if(k2==='wm_mirror'){x.fillStyle='#dcdcf8';x.strokeStyle='#5a4a7a';x.lineWidth=.35;x.fillRect(a-s*.2,b-s*.38,s*.4,s*.76);x.strokeRect(a-s*.2,b-s*.38,s*.4,s*.76)}
    else if(k2==='wm_boat'){x.fillStyle='#7a4a9a';x.strokeStyle=INK;x.lineWidth=.3;x.beginPath();x.moveTo(a-s*.4,b);x.quadraticCurveTo(a,b+s*.55,a+s*.4,b);x.closePath();x.fill();x.stroke()}
    else if(k2==='wm_statue'||k2==='wm_shrine'){x.fillStyle='#8a7aa0';x.strokeStyle=INK;x.lineWidth=.3;x.fillRect(a-s*.22,b-s*.3,s*.44,s*.6);x.strokeRect(a-s*.22,b-s*.3,s*.44,s*.6)}
    else if(k2==='wm_orb_pedestal'){x.fillStyle='#c070ff';x.strokeStyle=INK;x.lineWidth=.35;x.beginPath();x.arc(a,b,s*.42,0,6.3);x.fill();x.stroke()}
    else if(k2==='wm_ladder'){x.strokeStyle='#2a1a40';x.lineWidth=.45;x.beginPath();x.moveTo(a-s*.22,b-s*.4);x.lineTo(a-s*.22,b+s*.4);x.moveTo(a+s*.22,b-s*.4);x.lineTo(a+s*.22,b+s*.4);for(let q=-.3;q<=.3;q+=.2){x.moveTo(a-s*.22,b+q*s);x.lineTo(a+s*.22,b+q*s)}x.stroke()}
    else if(k2==='wm_web'){x.strokeStyle='rgba(60,40,90,.6)';x.lineWidth=.3;x.beginPath();x.arc(a,b,s*.35,0,6.3);x.moveTo(a-s*.35,b);x.lineTo(a+s*.35,b);x.moveTo(a,b-s*.35);x.lineTo(a,b+s*.35);x.stroke()}}
  // stairs: an arrow on the door
  const stairArrow=(sd,down)=>{if(!sd)return;const a=X(sd.x+.5),b=Y(sd.y+.5);x.fillStyle=down?'#b8321e':'#274a9a';x.strokeStyle=INK;x.lineWidth=.4;const dx=sd.ax-sd.x,dy=sd.ay-sd.y,q=s*.85;
    x.beginPath();x.moveTo(a-dx*q*.7,b-dy*q*.7);x.lineTo(a+dy*q*.7+dx*q*.2,b-dx*q*.7+dy*q*.2);x.lineTo(a-dy*q*.7+dx*q*.2,b+dx*q*.7+dy*q*.2);x.closePath();x.fill();x.stroke()};
  if(k>0)stairArrow(M.up,false);stairArrow(M.down,true);
  x.restore();
  // pins
  for(const p of st.pins){const a=X(p.x+.5),b=Y(p.y+.5);x.save();x.lineJoin='round';
    if(p.t==='key'){x.fillStyle='#f0c030';x.strokeStyle=INK;x.lineWidth=.6;x.beginPath();x.arc(a,b-s*.3,s*.9,0,6.3);x.fill();x.stroke();x.fillStyle='#fff3b0';x.beginPath();x.arc(a,b-s*.3,s*.32,0,6.3);x.fill();x.fillRect(a-s*.1,b-s*.1,s*.2,s*1.1);x.strokeRect(a-s*.1,b-s*.1,s*.2,s*1.1)}
    else if(p.t==='sw'){x.fillStyle='#4ad8a0';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();x.arc(a,b,s*.8,0,6.3);x.fill();x.stroke();x.strokeStyle=INK;x.lineWidth=.8;x.beginPath();x.moveTo(a-s*.4,b+s*.4);x.lineTo(a+s*.4,b-s*.4);x.stroke()}
    else{x.fillStyle='#ffe070';x.strokeStyle=INK;x.lineWidth=.5;x.beginPath();for(let q=0;q<10;q++){const r=q%2?s*.9:s*2.1,an=-Math.PI/2+q*Math.PI/5;x.lineTo(a+Math.cos(an)*r,b+Math.sin(an)*r)}x.closePath();x.fill();x.stroke()}
    x.restore()}
  // names of the rooms
  for(const r of M.rooms){if(r.sealed||!WM.ROOMNAMES[r.kind])continue;if(r.kind==='shaft')continue;api.text(x,WM.ROOMNAMES[r.kind],X((r.x0+r.x1+1)/2),Y((r.y0+r.y1+1)/2)-(r.kind==='boss'?s*3:0),5.4,'#3a1a5c','center')}
  const sh=M.rooms.find(r=>r.kind==='start');if(k===0&&sh)api.text(x,'The Well Shaft',X((sh.x0+sh.x1+1)/2),Y(sh.y1+2.5),5.6,'#3a1a5c','center');
  // margins: title, compass, key
  api.title(x,WM.NAMES[k],'Under the town well of Wenlock, level '+WM.RATING[k]);api.compass(x,436,262,12);
  const key=[['Brick wall','#7a54a8'],['Passage','#f1e9f7'],['Still water','#a8a4e6'],['Chest','#d8b038'],['Crystal','#9a58e0'],['Brazier','#ff9a3a'],['Stairs down','#b8321e']];
  if(k>0)key.push(['Stairs up','#274a9a']);key.push(['Key (a hint found)','#f0c030'],['Switch used','#4ad8a0'],['Vault opened','#ffe070']);
  api.panel(x,392,34,86,14+key.length*11.4);api.text(x,'Key',435,44,7.2,MPL.VERM,'center');let yy=55;
  for(const [t,col] of key){x.fillStyle=col;x.strokeStyle=INK;x.lineWidth=.4;x.fillRect(399,yy-3,8,6);x.strokeRect(399,yy-3,8,6);api.text(x,t,412,yy,5.6,'#3a2a1c','left');yy+=11.4}
  // a big amethyst cluster in the left margin
  for(const [dx,dy,sz,col] of [[46,236,26,'#9a58e0'],[30,252,16,'#b27af0'],[62,248,18,'#7c3cc8'],[44,262,12,'#d8b8ff']]){x.fillStyle=col;x.strokeStyle=INK;x.lineWidth=.7;x.beginPath();x.moveTo(dx,dy-sz*1.5);x.lineTo(dx+sz*.42,dy-sz*.5);x.lineTo(dx+sz*.34,dy+sz*.5);x.lineTo(dx-sz*.34,dy+sz*.5);x.lineTo(dx-sz*.42,dy-sz*.5);x.closePath();x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.moveTo(dx-sz*.12,dy-sz*1.1);x.lineTo(dx+sz*.05,dy-sz*.6);x.lineTo(dx-sz*.18,dy+sz*.2);x.closePath();x.fill()}
}
if(typeof mplInstall==='function')mplInstall({get name(){const L=LEVELS[LEVEL];return 'wellmaze'+(L&&L._wm?wmmState(L).sig:'')},levels:WM.IDS,tint:WMM.tint,draw:wmmDraw,foot:'You are the yellow arrow. Press M to close the map.'});
