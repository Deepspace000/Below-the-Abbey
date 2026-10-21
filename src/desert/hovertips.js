/* ==========================================================================
   SHORTCUT TIPS. Rest the mouse on a button or icon for a moment and a small tip shows what it does and the key that does the same thing (the keys are the ones on the Keyboard
   page, shortcuts.js). Mouse only (a touch screen has no hover; a pad has its own frame). Drawn last, over everything, after the stone buttons. Names start with HVT.
   ========================================================================== */
const HVT_TIPS={
  qsave:['Quick save','F5'],menu:['Menu','Esc'],map:['Map of this level','M / O'],wait:['Wait a turn','Z'],rest:['Rest and camp','R'],potion:['Drink a healing potion','H / P'],
  hero0:['Choose hero 1','1'],hero1:['Choose hero 2','2'],hero2:['Choose hero 3','3'],hero3:['Choose hero 4','4'],
  attack:['Attack','Space / Enter'],special:['Special attack or spell','X'],turnL:['Turn left','Q / Left'],turnR:['Turn right','E / Right'],fwd:['Forward','W / Up'],back:['Back','S / Down'],left:['Step left','A'],right:['Step right','D'],
  bfcatch:['Catch the butterfly','N'],bfdig:['Dig with a shovel','G'],
  isort:['Sort the bag','S'],ihero0:['Hero 1','1'],ihero1:['Hero 2','2'],ihero2:['Hero 3','3'],ihero3:['Hero 4','4'],itab_inv:['The bag','I'],itab_char:['Character sheet','C'],itab_spell:['Spell book','B'],itab_powers:['Powers','K'],
  iclose:['Close the bag','I / Esc'],iequip:['Equip the chosen item','E'],iunequip:['Take off the chosen item','U'],iuse:['Use the chosen item','E'],invherbs:['Herbal remedies','Y'],
  resume:['Back to the game','Esc'],quests:['Quests','J'],journal:['Journal and abilities','L'],aff:['Afflictions','F'],overview:['Map of this level','M / O'],
  qclose:['Close','Esc'],qexit:['Close','Esc']};
const HVT={id:null,t0:0};
function hvtDraw(){
  try{
    if(typeof STB==='undefined'||STB.pt!=='mouse'||STB.mx<0||G.cut||G.talk||(typeof TP!=='undefined'&&TP)){HVT.id=null;return}
    const b=topBtn(STB.mx,STB.my),tip=b&&HVT_TIPS[b.id];
    if(!tip){HVT.id=null;return}
    const now=performance.now();if(HVT.id!==b.id){HVT.id=b.id;HVT.t0=now;return}
    if(now-HVT.t0<380)return;
    ctx.save();ctx.setTransform(ctx.canvas.width/DW,0,0,ctx.canvas.height/DH,0,0);
    ctx.font='8px '+FUI;const lw=ctx.measureText(tip[0]).width;ctx.font='bold 7.5px '+FUI;const kw=ctx.measureText(tip[1]).width+8;
    const w=lw+kw+18,h=16;let x=STB.mx+10,y=STB.my+14;if(x+w>DW-4)x=DW-4-w;if(y+h>DH-4)y=STB.my-h-8;if(x<4)x=4;
    ctx.globalAlpha=.97;rrect(ctx,x,y,w,h,4);ctx.fillStyle='rgba(14,10,6,.94)';ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='#8a7448';ctx.stroke();
    ctx.font='8px '+FUI;ctx.fillStyle='#e8dcb4';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(tip[0],x+6,y+h/2+.5);
    const kx=x+10+lw;rrect(ctx,kx,y+3,kw,h-6,3);ctx.fillStyle='rgba(70,52,24,.98)';ctx.fill();ctx.lineWidth=.8;ctx.strokeStyle='#c8a860';ctx.stroke();
    ctx.font='bold 7.5px '+FUI;ctx.fillStyle='#ffe9a0';ctx.textAlign='center';ctx.fillText(tip[1],kx+kw/2,y+h/2+.5);
    ctx.restore()}catch(e){}}
{const _cp=crtPass;crtPass=function(){_cp.apply(this,arguments);hvtDraw()}}
