/* ==========================================================================
   CONTROLLER BUTTONS. The Buttons page (Settings, Controller, Change buttons) lists what the pad does while the party is walking and lets every one of those actions be given
   another button: click an action, then press the button on the pad. A button another action already has is swapped. The D-pad and the two sticks stay as they are, and so do the
   buttons in menus, dialogue and shops (A presses, B goes back). The choices are kept in 'abbeyPadBind'. The data and the walking behaviour are in controller.js. Last in the injection order.
   ========================================================================== */
function drawPadBindPage(){
  BTNS=[];veil(.86);bigPanel(20,10,440,300);
  txt('CONTROLLER BUTTONS',240,27,13,'#d8c88e','center',true);
  const wait=PB.wait?PADACT.find(a=>a[0]===PB.wait):null;
  txt(wait?'Press the new button for '+wait[1]+' (Esc cancels)':(PAD.name?'Click an action, then press the button you want on the pad.':'No controller found. Connect one and press a button on it.'),240,41,8,wait?'#ffe36a':'#a89878','center');
  PADACT.forEach((a,i)=>{const col=(i/8)|0,row=i%8,x=34+col*214,y=52+row*26;
    txt(a[1],x,y+11,8.6,'#d8c9a0','left');
    const b=PB.map[a[0]],changed=b!==a[3];
    btnText('pb_'+a[0],PB.wait===a[0]?'...':(b>=0?PADBTN[b]:'None'),x+120,y,64,20);
    if(changed)txt('*',x+190,y+11,9,'#ffe36a','center')});
  txt('* changed.  The D-pad and sticks are fixed. In menus A presses and B goes back.',240,262,7.8,'#a89878','center');
  btnText('pb_reset','Reset all',60,278,110,24);btnText('pb_back','Back',185,278,110,24);btnText('pb_clear','Clear one',310,278,110,24);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
{const _d=drawMenu;drawMenu=function(){if(G.menu==='padbind'){drawPadBindPage();return}return _d.apply(this,arguments)}}
PB.clear=false;
{const _h=handleBtn;handleBtn=function(id){
  if(G.menu==='pad'&&id==='padbindpage'){G.menu='padbind';PB.wait=null;PB.clear=false;return}
  if(G.menu==='padbind'){
    if(id==='pb_back'||id==='menuclose'||id==='menu'){if(PB.wait||PB.clear){PB.wait=null;PB.clear=false}else G.menu='pad'}
    else if(id==='pb_reset'){PB.map={};for(const a of PADACT)PB.map[a[0]]=a[3];padBindSave();PB.wait=null;PB.clear=false}
    else if(id==='pb_clear'){PB.clear=!PB.clear;PB.wait=null} // the next action clicked is set to no button
    else if(id&&id.startsWith('pb_')){const k=id.slice(3);if(PB.clear){PB.map[k]=-1;padBindSave();PB.clear=false}else PB.wait=PB.wait===k?null:k}
    return}
  return _h.apply(this,arguments)}}
window.addEventListener('keydown',e=>{if(PB.wait&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();PB.wait=null}},true);
