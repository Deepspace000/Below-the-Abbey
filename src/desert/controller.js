/* ==========================================================================
   CONTROLLER SUPPORT, AND THE MENUS THAT HOLD THE LESS USED BUTTONS.
   A gamepad (the standard layout: Xbox, PlayStation, Switch and most others) plays the whole game. While the party is walking it sends the same
   keys the keyboard sends. In every menu, dialogue and screen with buttons it moves a gold frame from button to button (D-pad) or a free
   pointer (left stick), A presses, B goes back. The Controller page, in Settings, shows the pad and what each button does.
   Also here: the Settings and More menus, so the main menu is short, with Exit game at the bottom.
   ========================================================================== */
const PADMAP={ // what each button does while the party is walking (the same key the keyboard would send)
  0:['Enter','Attack, talk, use'],1:['z','Wait a round'],2:['x','Special attack'],3:['i','Inventory'],4:['q','Turn left'],5:['e','Turn right'],
  8:['m','Map'],9:['Escape','Menu'],10:['p','Drink a potion'],11:['r','Rest']};
const PAD={cx:240,cy:160,focus:null,act:false,held:{},btn:{},keysDown:{},name:'',seen:0,lastX:0,lastY:0,rep:0,mode:'play'};
function padKey(key,down){try{window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key,bubbles:true,cancelable:true}))}catch(e){}}
function padPointer(type,x,y){
  const r=cv.getBoundingClientRect(),o={clientX:r.left+x/DW*r.width,clientY:r.top+y/DH*r.height,pointerId:77,pointerType:'mouse',bubbles:true,cancelable:true,button:0,isPrimary:true};
  const ev=new PointerEvent(type,o);if(type==='pointerdown')cv.dispatchEvent(ev);else if(type==='pointermove')cv.dispatchEvent(ev);else window.dispatchEvent(ev)}
function padClick(x,y){padPointer('pointermove',x,y);padPointer('pointerdown',x,y);padPointer('pointerup',x,y)}
function padPlaying(){return G.state==='play'&&!G.menu&&!G.map&&!G.inv.open&&!G.loot&&!G.talk&&!G.cut&&!G.overview&&!G.saves&&!G.drag}
function padTargets(){ // the buttons the pad can jump to: not the great invisible ones that cover the whole screen
  const out=[];for(const b of BTNS){if(!b||!(b.w>0)||!(b.h>0))continue;if(b.w*b.h>DW*DH*.3)continue;if(/area$|^menuclose|^mapclose$|^tkskip$|^cut$/.test(b.id||''))continue;out.push(b)}return out}
const padCenter=b=>[b.x+b.w/2,b.y+b.h/2];
function padJump(dx,dy){
  const T=padTargets();if(!T.length)return;
  let cur=PAD.focus&&T.find(b=>b.id===PAD.focus);
  if(!cur){let bd=1e9;for(const b of T){const [x,y]=padCenter(b),d=Math.hypot(x-PAD.cx,y-PAD.cy);if(d<bd){bd=d;cur=b}}PAD.focus=cur.id;[PAD.cx,PAD.cy]=padCenter(cur);return}
  const [cx,cy]=padCenter(cur);let best=null,bs=1e9;
  for(const b of T){if(b===cur)continue;const [x,y]=padCenter(b),ax=(x-cx)*dx+(y-cy)*dy,perp=Math.abs((x-cx)*dy)+Math.abs((y-cy)*dx);if(ax<2)continue;const s=ax+perp*2.2;if(s<bs){bs=s;best=b}}
  if(best){PAD.focus=best.id;[PAD.cx,PAD.cy]=padCenter(best);sfx('step')}
}
function padOnButtons(){return BTNS.length&&padTargets().length}
function padPress(i){ // a button has just gone down
  PAD.act=true;
  if(padPlaying()){
    if(i===12){padKey('ArrowUp',true);PAD.keysDown.up=1;return}if(i===13){padKey('ArrowDown',true);PAD.keysDown.down=1;return}
    if(i===14){padKey('ArrowLeft',true);PAD.keysDown.left=1;return}if(i===15){padKey('ArrowRight',true);PAD.keysDown.right=1;return}
    if(i===6){const n=(G.sel+3)%4;G.sel=n;return}if(i===7){G.sel=(G.sel+1)%4;return}
    const m=PADMAP[i];if(m){padKey(m[0],true);padKey(m[0],false)}return}
  // menus, dialogue, shops, maps: the frame and the pointer
  if(G.cut&&i===0){padKey('Enter',true);padKey('Enter',false);return}
  if(i===12)padJump(0,-1);else if(i===13)padJump(0,1);else if(i===14)padJump(-1,0);else if(i===15)padJump(1,0);
  else if(i===0){ // A: press what the frame is on, or what is under the pointer
    if(G.state==='title'&&!BTNS.length){padKey('Enter',true);padKey('Enter',false);return}
    padClick(PAD.cx,PAD.cy)}
  else if(i===1||i===9){padKey('Escape',true);padKey('Escape',false)} // B or Start: back
  else if(i===3){padKey('i',true);padKey('i',false)}
  else if(i===8){padKey('m',true);padKey('m',false)}
  else if(i===4||i===5){const dir=i===4?-1:1;if(G.menu==='quests'||G.state==='play')padKey(dir<0?'ArrowLeft':'ArrowRight',true),padKey(dir<0?'ArrowLeft':'ArrowRight',false)}
}
function padRelease(i){const k={12:'up',13:'down',14:'left',15:'right'}[i],names={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};if(k&&PAD.keysDown[k]){padKey(names[k],false);delete PAD.keysDown[k]}}
function padStickKeys(ax,ay){ // the left stick walks: up and down go forward and back, left and right step sideways. The right stick turns.
  const want={w:ay<-.55,s:ay>.55,a:ax<-.55,d:ax>.55};
  for(const k in want){if(want[k]&&!PAD.keysDown[k]){padKey(k,true);PAD.keysDown[k]=1}else if(!want[k]&&PAD.keysDown[k]){padKey(k,false);delete PAD.keysDown[k]}}}
function padTurnKeys(rx){const want={q:rx<-.6,e:rx>.6};for(const k in want){if(want[k]&&!PAD.keysDown[k]){padKey(k,true);PAD.keysDown[k]=1}else if(!want[k]&&PAD.keysDown[k]){padKey(k,false);delete PAD.keysDown[k]}}}
function padReleaseAll(){for(const k in PAD.keysDown){const n={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[k]||k;padKey(n,false)}PAD.keysDown={}}
let padLast=0;
function padPoll(){
  requestAnimationFrame(padPoll);
  const gp=(navigator.getGamepads?navigator.getGamepads():[]);let p=null;for(const g of gp){if(g&&g.connected){p=g;break}}
  if(!p){if(PAD.name){PAD.name='';padReleaseAll()}return}
  if(!PAD.name){PAD.name=p.id;PAD.act=true;try{msg('Controller connected. Press A.','#a8d8e8')}catch(e){}}
  const now=performance.now(),dt=Math.min(.05,(now-padLast)/1000);padLast=now;
  const ax=p.axes[0]||0,ay=p.axes[1]||0,rx=p.axes[2]||0,ry=p.axes[3]||0,dz=v=>Math.abs(v)<.22?0:v;
  const down=i=>!!(p.buttons[i]&&(p.buttons[i].pressed||p.buttons[i].value>.5));
  let any=false;
  for(let i=0;i<17;i++){const d=down(i);if(d)any=true;if(d&&!PAD.btn[i]){PAD.btn[i]=1;padPress(i)}else if(!d&&PAD.btn[i]){PAD.btn[i]=0;padRelease(i)}}
  if(Math.abs(ax)>.3||Math.abs(ay)>.3||Math.abs(rx)>.3)any=true;
  if(any)PAD.act=true;
  if(padPlaying()){padStickKeys(ax,ay);padTurnKeys(rx);PAD.mode='play'}
  else{
    if(PAD.mode==='play'){padReleaseAll();PAD.mode='menu';PAD.focus=null}
    // the left stick moves a free pointer, and presses nothing by itself. Its D-pad twin jumps between buttons.
    const sx=dz(ax),sy=dz(ay);
    if(sx||sy){PAD.cx=Math.max(0,Math.min(DW,PAD.cx+sx*dt*260));PAD.cy=Math.max(0,Math.min(DH,PAD.cy+sy*dt*260));PAD.focus=null;
      // the pointer also scrolls lists when held on the right stick
    }
    const sy2=dz(ry);if(sy2&&Math.abs(sy2)>.4){PAD.rep-=dt;if(PAD.rep<=0){PAD.rep=.09;try{window.dispatchEvent(new WheelEvent('wheel',{deltaY:sy2*60,bubbles:true}))}catch(e){}}}else PAD.rep=0;
    if(PAD.cx!==PAD.lastX||PAD.cy!==PAD.lastY){PAD.lastX=PAD.cx;PAD.lastY=PAD.cy}
  }
}
requestAnimationFrame(padPoll);
addEventListener('gamepadconnected',()=>{PAD.act=true});
addEventListener('pointerdown',e=>{if(e.pointerId!==77)PAD.act=false});
addEventListener('mousemove',()=>{PAD.act=false});
addEventListener('keydown',e=>{if(!e.isTrusted)return;PAD.act=false});
/* the gold frame and pointer, drawn over everything while a pad is in use and the party is not walking */
{const _pf=drawPressFx;drawPressFx=function(){_pf.apply(this,arguments);
  try{if(!PAD.name||!PAD.act||padPlaying())return;
    const T=padTargets(),f=PAD.focus&&T.find(b=>b.id===PAD.focus);
    ctx.save();
    if(f){const pulse=.55+.45*Math.sin(G.time*6||performance.now()/160);ctx.lineWidth=2.4;ctx.strokeStyle='rgba(255,227,106,'+pulse.toFixed(2)+')';ctx.strokeRect(f.x-2,f.y-2,f.w+4,f.h+4);ctx.fillStyle='rgba(255,227,106,.10)';ctx.fillRect(f.x,f.y,f.w,f.h)}
    else{ctx.translate(PAD.cx,PAD.cy);ctx.fillStyle='#ffe36a';ctx.strokeStyle='#120c08';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,13);ctx.lineTo(3.6,10);ctx.lineTo(6.4,15.5);ctx.lineTo(8.6,14.4);ctx.lineTo(5.8,9.2);ctx.lineTo(10.4,9.2);ctx.closePath();ctx.fill();ctx.stroke()}
    ctx.restore()}catch(e){}}}
/* the title screen: when a pad is in use, start with the frame on the first button */
{const _dt=drawTitle;drawTitle=function(){_dt.apply(this,arguments);if(PAD.name&&PAD.act&&!PAD.focus){const T=padTargets();if(T.length){PAD.focus=T[0].id;[PAD.cx,PAD.cy]=padCenter(T[0])}}}}

/* ---- the Settings and More menus ---- */
function drawSettingsMenu(){
  BTNS=[];veil(.6);bigPanel(110,40,260,232);
  txt('SETTINGS',240,62,14,'#d8c88e','center',true);
  btnText('mute','Sound',140,74,200,26);btnText('gfx','Graphics',140,104,200,26);btnText('gameplay','Gameplay',140,134,200,26);btnText('padpage','Controller',140,164,200,26);btnText('keyspage','Keyboard',140,194,200,26);
  btnText('menuback','Back',170,230,140,28);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
function drawMoreMenu(){
  BTNS=[];veil(.6);bigPanel(110,12,260,296);
  txt('MORE',240,30,14,'#d8c88e','center',true);
  btnText('ach','Achievements',140,44,200,26);btnText('stats','Stats',140,72,200,26);btnText('collection','Collection',140,100,200,26);btnText('wander','Wandering Monsters',140,128,200,26);
  btnText('newparty','New party',140,156,200,26);btnText('restart','Restart game',140,184,200,26);
  btnText('menuback','Back',170,256,140,28);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
/* ---- the Controller page: the pad, and what each button does ---- */
function drawPadPage(){
  BTNS=[];veil(.86);bigPanel(8,6,464,308);
  txt('CONTROLLER',240,22,14,'#d8c88e','center',true);
  const cx=240,cy=132,S=1.2,P=(x,y)=>[cx+x*S,cy+y*S]; // the pad is drawn in its own small space (0,0 is its middle) and scaled up, so every button sits on the body
  ctx.save();ctx.translate(cx,cy);ctx.scale(S,S);
  const dark='#120c08',ol=1.4/S*1.2;
  // the triggers and bumpers, behind the body
  for(const sg of [-1,1]){
    ctx.fillStyle='#34312c';ctx.strokeStyle=dark;ctx.lineWidth=ol;ctx.beginPath();ctx.roundRect(sg*70-20,-62,40,16,6);ctx.fill();ctx.stroke();
    ctx.fillStyle='#4a463f';ctx.beginPath();ctx.roundRect(sg*70-26,-52,52,12,5);ctx.fill();ctx.stroke()}
  // the body: broad middle, two rounded grips
  const body=()=>{ctx.beginPath();ctx.moveTo(-78,-38);ctx.quadraticCurveTo(0,-54,78,-38);ctx.quadraticCurveTo(100,-30,106,10);ctx.quadraticCurveTo(114,60,92,76);ctx.quadraticCurveTo(70,82,58,46);ctx.quadraticCurveTo(0,38,-58,46);ctx.quadraticCurveTo(-70,82,-92,76);ctx.quadraticCurveTo(-114,60,-106,10);ctx.quadraticCurveTo(-100,-30,-78,-38);ctx.closePath()};
  {const g=ctx.createLinearGradient(0,-54,0,80);g.addColorStop(0,'#6a655c');g.addColorStop(.5,'#4a463f');g.addColorStop(1,'#2a2723');body();ctx.fillStyle=g;ctx.fill();ctx.lineWidth=ol*1.4;ctx.strokeStyle=dark;ctx.stroke();
   ctx.save();body();ctx.clip();ctx.fillStyle='rgba(255,255,255,.1)';ctx.beginPath();ctx.ellipse(0,-34,84,14,0,0,TAU);ctx.fill();ctx.restore()}
  // the guide button
  ctx.fillStyle='#1a1816';ctx.beginPath();ctx.arc(0,-24,8,0,TAU);ctx.fill();ctx.strokeStyle='#8a8070';ctx.lineWidth=ol;ctx.stroke();ctx.fillStyle='#8ac078';ctx.beginPath();ctx.arc(0,-24,3.4,0,TAU);ctx.fill();
  // the two sticks
  const stick=(x,y,c)=>{ctx.fillStyle='#16140f';ctx.beginPath();ctx.arc(x,y,16,0,TAU);ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=ol*1.2;ctx.stroke();ctx.fillStyle='#3a3732';ctx.beginPath();ctx.arc(x,y,11,0,TAU);ctx.fill();ctx.strokeStyle=dark;ctx.lineWidth=ol;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.arc(x-2,y-2,6,0,TAU);ctx.fill()};
  stick(-58,-12,'#e8c870');stick(28,22,'#c8c0a8');
  // the D-pad: a cross in a round dish
  ctx.fillStyle='#16140f';ctx.beginPath();ctx.arc(-30,22,17,0,TAU);ctx.fill();ctx.strokeStyle=dark;ctx.lineWidth=ol;ctx.stroke();
  ctx.fillStyle='#2e2b27';ctx.strokeStyle='#8a8070';ctx.lineWidth=ol;ctx.fillRect(-34,8,8,28);ctx.fillRect(-44,18,28,8);ctx.strokeRect(-34,8,8,28);ctx.strokeRect(-44,18,28,8);
  // the face buttons: Y above, X left, B right, A below
  const fb=(x,y,c,l)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,8.5,0,TAU);ctx.fill();ctx.strokeStyle=dark;ctx.lineWidth=ol;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.22)';ctx.beginPath();ctx.arc(x-2,y-2.5,3.5,0,TAU);ctx.fill()};
  fb(60,-30,'#e0c030');fb(45,-14,'#4a7ad0');fb(75,-14,'#d04a38');fb(60,2,'#4aa05a');
  // back and start, small and either side of the guide button
  ctx.fillStyle='#9a9080';ctx.strokeStyle=dark;ctx.lineWidth=ol;ctx.beginPath();ctx.roundRect(-22,-10,11,6,3);ctx.fill();ctx.stroke();ctx.beginPath();ctx.roundRect(11,-10,11,6,3);ctx.fill();ctx.stroke();
  ctx.restore();
  // the letters on the face buttons, drawn upright and unscaled
  for(const [x,y,l] of [[60,-30,'Y'],[45,-14,'X'],[75,-14,'B'],[60,2,'A']]){const q=P(x,y);txt(l,q[0],q[1]+.5,9,'#120c08','center',true)}
  // the notes: two columns, each with a thin line to its part of the pad
  const note=(label,what,side,y,pt)=>{
    const lx=side==='L'?112:368,al=side==='L'?'right':'left',[px,py]=P(pt[0],pt[1]);
    txt(label,lx,y,9.5,'#e8c870',al,true);txt(what,lx,y+11,8,'#cdbf94',al);
    ctx.strokeStyle='rgba(216,200,142,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(side==='L'?118:362,y+4);ctx.lineTo(px,py);ctx.stroke();
    ctx.fillStyle='#e8c870';ctx.beginPath();ctx.arc(px,py,2,0,TAU);ctx.fill()};
  note('Left bumper','Turn left','L',56,[-80,-46]);
  note('Left trigger','Previous hero','L',84,[-80,-58]);
  note('Left stick','Walk, step sideways','L',122,[-58,-12]);
  note('D-pad','Forward, back, turn','L',164,[-30,22]);
  note('Back','Map','L',204,[-16,-7]);
  note('Right bumper','Turn right','R',56,[80,-46]);
  note('Right trigger','Next hero','R',84,[80,-58]);
  note('Y','Inventory','R',112,[60,-30]);
  note('X','Special attack','R',138,[45,-14]);
  note('B','Wait a round','R',164,[75,-14]);
  note('A','Attack, talk, use','R',190,[60,2]);
  note('Start','Menu','R',216,[16,-7]);
  note('Right stick','Turn','R',240,[28,22]);
  txt('Stick presses: left stick potion, right stick rest',240,226,8,'#a89878','center');
  txt('In menus, dialogue and shops: D-pad jumps between buttons, the left stick moves a pointer, A presses, B goes back.',240,262,8,'#cdbf94','center');
  txt('Any standard pad works. Press a button once to wake it.',240,273,8,'#a89878','center');
  btnText('menuback','Back',190,282,100,24);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
