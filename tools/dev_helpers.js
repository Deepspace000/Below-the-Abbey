/* Test helpers for the browser pane. Load them into a running game with:
     (0,eval)(await (await fetch('tools/dev_helpers.js')).text())
   muteAll() silences the game, look(x,y,angle,hour) puts the party somewhere and draws, shot(name) and planshot(...) send a picture
   to the receiver (python tools/kh_recv.py, port 8314), which saves it in its output folder. */
window.muteAll=()=>{try{localStorage.setItem('abbeySND',JSON.stringify({combat:0,amb:0,music:0,steps:0}))}catch(e){}try{Object.assign(SNDOPT,{combat:0,amb:0,music:0,steps:0})}catch(e){}try{G.mute=true}catch(e){}try{if(MASTER)MASTER.gain.value=0}catch(e){}};
window.shot=async function(name){const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const buf=await blob.arrayBuffer();try{await fetch('http://127.0.0.1:8314/save/'+name+'.png',{method:'POST',mode:'no-cors',body:buf})}catch(e){return 'err '+e}return 'sent '+buf.byteLength};
window.look=function(x,y,ang,clock){if(clock!==undefined)G.clock=clock*60;G.P.x=x;G.P.y=y;G.P.angT=ang;G.P.f=((Math.round(ang/(Math.PI/2))+1)%4+4)%4;G.C.x=x;G.C.y=y;G.C.a=ang;G.msgs=[];G.cut=null;G.talk=null;let now=performance.now();for(let i=0;i<8;i++){now+=16;frame(now)}};
window.planshot=async function(name,x0,y0,x1,y1,S){S=S||16;const W=x1-x0+1,H=y1-y0+1,MWd=G.grid[0].length;const c=document.createElement('canvas');c.width=W*S;c.height=H*S;const g=c.getContext('2d');
  const fcol=['#d8c28a','#9a9690','#a0784a','#b6a272','#3a78b8','#5c9a40'];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const fm=G.fmap&&G.fmap[y*MWd+x];g.fillStyle=fcol[fm]||'#888';g.fillRect((x-x0)*S,(y-y0)*S,S,S);const w=G.grid[y]&&G.grid[y][x];if(w){g.fillStyle=w>=1000?'#e8d8c8':'#555';g.fillRect((x-x0)*S+1,(y-y0)*S+1,S-2,S-2);g.fillStyle='#000';g.font='9px sans-serif';g.fillText(String(w).slice(-3),(x-x0)*S+2,(y-y0)*S+11)}}
  g.strokeStyle='rgba(0,0,0,.15)';for(let x=0;x<=W;x++){g.beginPath();g.moveTo(x*S,0);g.lineTo(x*S,H*S);g.stroke()}for(let y=0;y<=H;y++){g.beginPath();g.moveTo(0,y*S);g.lineTo(W*S,y*S);g.stroke()}
  const dot=(o,col,r)=>{if(o.x<x0||o.x>x1+1||o.y<y0||o.y>y1+1)return;g.fillStyle=col;g.beginPath();g.arc((o.x-x0+.5)*S,(o.y-y0+.5)*S,r,0,7);g.fill()};
  for(const d of G.flora||[])dot({x:d.wx-.5,y:d.wy-.5},'#2a7a2a',2);for(const d of G.decor||[])dot(d,d.npc?'#d02020':'#202090',3);
  g.fillStyle='#000';g.font='11px sans-serif';for(let x=x0;x<=x1;x+=2)g.fillText(x,(x-x0)*S+1,H*S-2);for(let y=y0;y<=y1;y+=2)g.fillText(y,0,(y-y0)*S+10);
  const blob=await new Promise(r=>c.toBlob(r,'image/png'));const buf=await blob.arrayBuffer();try{await fetch('http://127.0.0.1:8314/save/'+name+'.png',{method:'POST',mode:'no-cors',body:buf})}catch(e){return 'err '+e}return 'sent '+buf.byteLength+' '+W+'x'+H};
muteAll();
