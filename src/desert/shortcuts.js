/* ==========================================================================
   KEYBOARD SHORTCUTS. Every main action has a key. The Keyboard page (Settings, Keyboard, or the ? key) lists them all. Keys 1 to 4 choose the hero, in the world
   and in the inventory (including the Powers tab). This listener runs before the main one and only takes the keys it owns.
   ========================================================================== */
const SHORTCUTS=[ // [group, key shown, what it does]
 ['Moving','W / Up','Forward'],['Moving','S / Down','Back'],['Moving','A','Step left'],['Moving','D','Step right'],['Moving','Q / Left','Turn left'],['Moving','E / Right','Turn right'],
 ['Fighting','Space / Enter','Attack'],['Fighting','X','Special attack or spell'],['Fighting','H / P','Drink a healing potion'],['Fighting','Z','Wait a turn'],['Fighting','R','Rest and camp'],
 ['Heroes','1 2 3 4','Choose a hero (also in the inventory)'],
 ['Screens','I','Items (the bag)'],['Screens','C','Hero sheet'],['Screens','B','Spell book'],['Screens','K','Powers'],['Screens','J','Quests'],['Screens','L','Journal'],
 ['Screens','F','Afflictions'],['Screens','U','Collection'],['Screens','M / O','Map of this level'],['Screens','T','Teleport stones'],['Screens','Esc','Menu, or close a screen'],
 ['Exploring','G','Dig with a shovel'],['Exploring','N','Catch a butterfly'],['Exploring','F5','Quick save'],['Exploring','? / F1','This page'],
 ['In the bag','E','Equip or use the chosen item'],['In the bag','U','Unequip the chosen item'],['In the bag','S','Sort the bag'],['In the bag','X / Enter','Use hero power (Powers)']];
const keyBusy=()=>G.state!=='play'||G.cut||G.talk||G.saves||(typeof TP!=='undefined'&&TP);
function keyHero(i){const h=G.heroes[i];if(!h)return;if(G.inv.open){G.inv.hero=i;G.inv.sel=null;if(h.alive)G.sel=i}else if(h.alive)G.sel=i}
function keyTab(t){if(!G.inv.open){if(G.menu||G.map||G.loot||G.overview)return;openInv(G.sel)}G.inv.tab=t;G.inv.sel=null}
function keyScreen(m){if(G.inv.open)G.inv.open=false;G.overview=false;G.map=false;G.menu=G.menu===m?false:m;if(m==='aff')G.afs=0}
addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||keyBusy())return;
  const k=e.key,lk=k.length===1?k.toLowerCase():k;let used=true;
  const free=!G.loot&&!G.map&&!G.menu&&!G.inv.open&&!G.overview;
  if(k==='?'||k==='F1'){G.inv.open=false;G.overview=false;G.map=false;G.menu=G.menu==='keys'?false:'keys'}
  else if(G.menu&&((lk==='l'&&G.menu==='journal')||(lk==='f'&&G.menu==='aff')||(lk==='u'&&G.menu==='collection'))){G.menu=false}
  else if(G.menu){used=false} // a menu is open: leave the other keys to it
  else if(k>='1'&&k<='4'&&(G.inv.open||free)){keyHero(+k-1)}
  else if(G.inv.open){
    const I=G.inv;
    if(lk==='c')keyTab('char');else if(lk==='b')keyTab('spell');else if(lk==='k')keyTab('powers');
    else if(lk==='s'){invBtn('isort')}else if(lk==='u'){if(I.sel&&I.sel.src==='slot')invBtn('iunequip')}
    else if(lk==='e'){if(I.sel){const it=selItem(),d=it?idef(it):null;invBtn(I.sel.src==='slot'?'iunequip':(d&&(d.k==='potion'||d.k==='food'))?'iuse':'iequip')}}
    else if(I.tab==='powers'&&(lk==='x'||k==='Enter')){handleBtn('ipow'+I.hero)}
    else used=false;
  }
  else if(!free){used=false}
  else if(lk==='h')act('potion');
  else if(lk==='c')keyTab('char');else if(lk==='b')keyTab('spell');else if(lk==='k')keyTab('powers');
  else if(lk==='l')keyScreen('journal');else if(lk==='f')keyScreen('aff');else if(lk==='u'){G.menuBack='more';keyScreen('collection')}
  else if(lk==='g'){if(canDigHere())doDig();else msg('Nothing to dig here.','#a89878')}
  else if(lk==='n'){try{bfCatch()}catch(x){}}
  else used=false;
  if(used){e.preventDefault();e.stopImmediatePropagation()}
},true);
/* ---- the Keyboard page ---- */
function drawKeysPage(){
  BTNS=[];veil(.86);bigPanel(8,6,464,308);
  txt('KEYBOARD SHORTCUTS',240,22,14,'#d8c88e','center',true);
  const cols=[['Moving','Fighting','Heroes','In the bag'],['Screens','Exploring']];
  cols.forEach((col,ci)=>{let y=38;const x=22+ci*232;
    for(const g of col){txt(g.toUpperCase(),x,y+4,8.5,'#e8c870','left',true);ctx.fillStyle='rgba(216,200,142,.35)';ctx.fillRect(x,y+10,216,1);y+=17;
      for(const [,key,what] of SHORTCUTS.filter(s=>s[0]===g)){ctx.save();rrect(ctx,x,y-6,72,12,3);ctx.fillStyle='rgba(60,46,24,.95)';ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='#8a7448';ctx.stroke();ctx.restore();
        txt(key,x+36,y,7.8,'#f0e4b4','center',true,undefined,68);txt(what,x+78,y,7.6,'#d8cba4','left',false,undefined,138);y+=11.5}
      y+=5}});
  txt('Esc closes the screen you are in.',360,274,7.6,'#a89878','center');
  btnText('menuback','Back',310,284,100,22);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
{const _d=drawMenu;drawMenu=function(){if(G.menu==='keys'){drawKeysPage();return}return _d.apply(this,arguments)}}
{const _h=handleBtn;handleBtn=function(id){
  if(G.menu==='keys'&&!G.cut&&!G.talk){if(id==='menuback'||id==='menuclose'||id==='menu')G.menu='settings';return}
  if(G.menu==='settings'&&id==='keyspage'){G.menu='keys';return}
  return _h.apply(this,arguments)}}
