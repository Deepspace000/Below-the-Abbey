/* ==========================================================================
   DISPLAY AND KEYS. Two new pages under Settings.
   1. DISPLAY: full screen on or off (the Windows app also has F11); the shape of the picture (fit the window and keep its shape, fill the window, or a whole-number
      scale so every pixel is the same size); smooth or hard-edged pixels. Kept in this device's storage ('abbeyDisp') and applied by fit() in the base game.
   2. KEYBOARD: every key the game uses can be changed. A key you choose is turned into the game's own key for that action before the game sees it (the real key press is
      swallowed and the game's key is sent in its place), so every screen and every part of the game follows without any other change. A key that has been moved away from an
      action does nothing any more. Pressing a key already used by another action swaps the two. Arrow keys, Enter, Esc, F1 and ? keep working as they are. Kept in 'abbeyKeys'.
   Last in the injection order.
   ========================================================================== */
const DK_ACTS=[ // [id, label, the game's own key]
 ['fwd','Forward','w'],['back','Back','s'],['left','Step left','a'],['right','Step right','d'],['turnL','Turn left','q'],['turnR','Turn right','e'],
 ['attack','Attack',' '],['special','Special power','x'],['potion','Potion 1','p'],['potb0','Potion 2','6'],['potb1','Potion 3','7'],['wait','Wait','z'],['rest','Camp','r'],
 ['hero1','Hero 1','1'],['hero2','Hero 2','2'],['hero3','Hero 3','3'],['hero4','Hero 4','4'],
 ['inv','Items','i'],['chr','Character','c'],['spl','Spells','b'],['pow','Powers','k'],['qst','Quests','j'],['jnl','Journal','l'],['aff','Afflictions','f'],['col','Collection','u'],['map','Map','m'],['tel','Teleport','t'],
 ['dig','Dig','g'],['bfly','Butterfly','n'],['qsave','Quick save','F5']];
const DK={custom:{},wait:null,syn:null};
try{DK.custom=JSON.parse(localStorage.getItem('abbeyKeys')||'{}')||{}}catch(e){DK.custom={}}
const dkNorm=k=>k&&k.length===1?k.toLowerCase():k;
const dkBound=id=>DK.custom[id]||DK_ACTS.find(a=>a[0]===id)[2];
function dkSave(){try{localStorage.setItem('abbeyKeys',JSON.stringify(DK.custom))}catch(e){}}
function dkMaps(){const toAct={},canon=new Set(DK_ACTS.map(a=>dkNorm(a[2])));for(const [id,,c] of DK_ACTS)toAct[dkNorm(dkBound(id))]=id;return {toAct,canon}}
function dkName(k){return k===' '?'Space':k.length===1?k.toUpperCase():k}
function dkAssign(id,key){
  key=dkNorm(key);const def=DK_ACTS.find(a=>a[0]===id)[2],old=dkBound(id);
  const other=DK_ACTS.find(a=>a[0]!==id&&dkNorm(dkBound(a[0]))===key);
  if(other){const od=other[2];if(dkNorm(old)===dkNorm(od))delete DK.custom[other[0]];else DK.custom[other[0]]=old}
  if(dkNorm(key)===dkNorm(def))delete DK.custom[id];else DK.custom[id]=key;
  dkSave()}
function dkSend(type,key,rep){const ev=new KeyboardEvent(type,{key,bubbles:true,cancelable:true,repeat:!!rep});ev.__dk=1;(document.body||window).dispatchEvent(ev)}
const dkOkKey=k=>k&&k!=='Escape'&&(k.length===1||/^F([2-9]|10)$/.test(k))&&k!=='F5'||k==='F5';
window.addEventListener('keydown',e=>{
  if(e.__dk)return;
  if(DK.wait){ // waiting for the new key of an action
    e.preventDefault();e.stopImmediatePropagation();
    if(e.key==='Escape'){DK.wait=null;return}
    if(['Shift','Control','Alt','Meta','CapsLock','Tab'].includes(e.key))return;
    if(dkOkKey(e.key)){dkAssign(DK.wait,e.key);DK.wait=null}
    return}
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const lk=dkNorm(e.key),M=dkMaps(),id=M.toAct[lk];
  if(id){const c=DK_ACTS.find(a=>a[0]===id)[2];if(dkNorm(c)!==lk){e.preventDefault();e.stopImmediatePropagation();DK.syn=DK.syn||{};DK.syn[lk]=c;dkSend('keydown',c,e.repeat)}return}
  if(M.canon.has(lk)){e.preventDefault();e.stopImmediatePropagation()} // the game's own key for an action that has been given another key: it does nothing now
},true);
window.addEventListener('keyup',e=>{
  if(e.__dk)return;const lk=dkNorm(e.key),c=DK.syn&&DK.syn[lk];
  if(c){delete DK.syn[lk];e.stopImmediatePropagation();dkSend('keyup',c)}
},true);

/* ---- the Settings page gets Display and Keyboard ---- */
drawSettingsMenu=function(){
  BTNS=[];veil(.6);bigPanel(110,28,260,270);
  txt('SETTINGS',240,50,14,'#d8c88e','center',true);
  btnText('mute','Sound',140,62,200,26);btnText('gfx','Graphics',140,92,200,26);btnText('dispage','Screen',140,122,200,26);btnText('gameplay','Gameplay',140,152,200,26);
  btnText('padpage','Controller',140,182,200,26);btnText('kbpage','Keyboard',140,212,200,26);
  btnText('menuback','Back',170,252,140,28);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
};
const DK_FIT=['Fit window','Fill window','Whole pixels'];
const dkDesk=()=>typeof BTA_DESKTOP!=='undefined'&&BTA_DESKTOP&&BTA_DESKTOP.toggleFullscreen;
function dkFullOn(){if(dkDesk()){if(!DK.fsT||Date.now()-DK.fsT>400){DK.fsT=Date.now();BTA_DESKTOP.fullscreen().then(v=>{DK.fs=v}).catch(()=>{})}return !!DK.fs}return !!(document.fullscreenElement||document.webkitFullscreenElement)}
function dkFullToggle(){try{if(dkDesk()){BTA_DESKTOP.toggleFullscreen().then(v=>{DK.fs=v});return}if(dkFullOn()){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{const d=document.documentElement;(d.requestFullscreen||d.webkitRequestFullscreen).call(d)}}catch(e){}}
function drawDisplayPage(){
  BTNS=[];veil(.6);bigPanel(90,40,300,232);
  txt('SCREEN',240,62,14,'#d8c88e','center',true);
  const row=(i,l,id,v)=>{const y=76+i*34;txt(l,104,y+13,9,'#d8c9a0','left');btnText(id,v,230,y,146,26)};
  row(0,'Full screen','d_full',dkFullOn()?'On':'Off');
  row(1,'Picture shape','d_fit',DK_FIT[DISP.fit]);
  row(2,'Pixels','d_sharp',DISP.sharp?'Hard edged':'Smooth');
  txt('The Windows app also uses F11 for full screen.',240,226,7.4,'#a89878','center');
  txt('Fill stretches the picture to the window shape.',240,236,7.4,'#a89878','center');
  btnText('d_back','Back',170,246,140,22);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
function drawKeybindsPage(){
  BTNS=[];veil(.7);bigPanel(6,6,468,308);
  txt('KEYBOARD',240,22,13,'#d8c88e','center',true);
  txt(DK.wait?'Press the new key for '+DK_ACTS.find(a=>a[0]===DK.wait)[1]+'  (Esc cancels)':'Click a key, then press the key you want.',240,35,7.8,DK.wait?'#ffe36a':'#a89878','center');
  DK_ACTS.forEach(([id,label],i)=>{const col=(i/10)|0,row=i%10,x=16+col*154,y=46+row*20;
    txt(label,x,y+8,8,'#d8c9a0','left');
    const cust=!!DK.custom[id],k=dkBound(id);
    btnText('kb_'+id,DK.wait===id?'...':dkName(k),x+84,y,62,16);
    if(cust)txt('*',x+148,y+8,8,'#ffe36a','center')});
  txt('* changed.  Arrow keys, Enter, Esc and F1 always work.',240,255,7.4,'#a89878','center');
  btnText('kb_reset','Reset all',30,268,110,22);btnText('kb_list','Key list',185,268,110,22);btnText('kb_back','Back',340,268,110,22);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
{const _d=drawMenu;drawMenu=function(){
  if(G.menu==='display'){drawDisplayPage();return}
  if(G.menu==='keybinds'){drawKeybindsPage();return}
  return _d.apply(this,arguments)}}
{const _h=handleBtn;handleBtn=function(id){
  if(G.menu==='settings'&&id==='dispage'){G.menu='display';return}
  if(G.menu==='settings'&&id==='kbpage'){G.menu='keybinds';DK.wait=null;return}
  if(G.menu==='display'){
    if(id==='d_back'||id==='menuclose'||id==='menu')G.menu='settings';
    else if(id==='d_full')dkFullToggle();
    else if(id==='d_fit'){DISP.fit=(DISP.fit+1)%3;try{localStorage.setItem('abbeyDisp',JSON.stringify(DISP))}catch(e){}fit()}
    else if(id==='d_sharp'){DISP.sharp=DISP.sharp?0:1;try{localStorage.setItem('abbeyDisp',JSON.stringify(DISP))}catch(e){}fit()}
    return}
  if(G.menu==='keybinds'){
    if(id==='kb_back'||id==='menuclose'||id==='menu'){if(DK.wait)DK.wait=null;else G.menu='settings'}
    else if(id==='kb_reset'){DK.custom={};dkSave();DK.wait=null}
    else if(id==='kb_list'){G.menu='keys'}
    else if(id&&id.startsWith('kb_'))DK.wait=DK.wait===id.slice(3)?null:id.slice(3);
    return}
  return _h.apply(this,arguments)}}
addEventListener('fullscreenchange',()=>{try{fit()}catch(e){}});
