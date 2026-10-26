/* ==========================================================================
   KEYBOARD FOCUS. When the game runs inside a page (the itch.io embed, a preview pane) the keys go to the page that has the focus, which is often not the game
   until it is clicked: W, A, S and D then do nothing. This file asks for the focus as soon as the game has loaded and at every pointer movement, touch and press
   over the game, and, while the game still does not have it, shows a small notice at the foot of the screen: "Click the game once to use the keyboard."
   ========================================================================== */
const KBF={lost:false,t:0,tries:0};
function kbfGrab(){try{cv.tabIndex=0;window.focus();cv.focus({preventScroll:true})}catch(e){}}
function kbfCheck(){try{KBF.lost=!document.hasFocus()}catch(e){KBF.lost=false}}
kbfGrab();
for(const ev of ['pointermove','pointerdown','mousedown','touchstart','mouseenter'])cv.addEventListener(ev,()=>{if(!KBF.lost&&document.hasFocus())return;kbfGrab();kbfCheck()},{passive:true,capture:true});
addEventListener('focus',()=>{KBF.lost=false});addEventListener('blur',()=>{setTimeout(kbfCheck,50)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){kbfGrab();kbfCheck()}});
addEventListener('keydown',()=>{KBF.lost=false},true);
setInterval(()=>{if(window.__ready){if(KBF.tries<6&&!document.hasFocus()){KBF.tries++;kbfGrab()}kbfCheck()}},800);
{const _ui=ui;ui=function(dt){_ui(dt);try{
  if(!KBF.lost||!window.__ready||G.state==='dead')return;
  const t='Click the game once to use the keyboard.';ctx.save();ctx.font='bold 9px serif';ctx.textAlign='center';
  const w=ctx.measureText(t).width+22,x=240-w/2,y=299;ctx.fillStyle='rgba(12,8,4,.82)';ctx.fillRect(x,y,w,15);ctx.strokeStyle='#d8b860';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,14);
  ctx.fillStyle='#f0e0a8';ctx.fillText(t,240,y+10.5);ctx.restore()}catch(e){}}}
