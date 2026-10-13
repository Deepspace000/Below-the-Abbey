/* ==========================================================================
   MAGIC MASKS. Shifty salesmen in the quiet corners of Khemetra (the dead ends of the narrow lanes) sell Magic Masks for 500 gold each.
   Wearing one makes the whole party a stranger to the watch for twelve hours: no guard will accost it for walking into a house.
   ========================================================================== */
AFFL.masked={n:'Masked',kind:'good',who:'the whole party',col:'#c070e0',days:.5,
  text:'A mask of gold and red, and a prickle of something that is not quite magic. To the watch, the party is nobody at all: a few strangers in fine masks, of no interest to anyone.',
  src:'Wearing a Magic Mask, bought from a shifty salesman in a quiet corner of Khemetra for 500 gold.',cure:'Not an affliction. The mask works for twelve hours, and then it is just a mask.'};
AFFL_ORDER.push('masked');
ITEMDEF.magicmask={n:'Magic Mask',k:'potion',t:'Mask',ic:'magicmask',c:'#c04060',stack:1,mask:1,price:500,d:'A gold and red half mask. Wear it and, for twelve hours, the watch of Khemetra looks straight through the party: no warnings for walking into houses. The salesman swore it was real magic.',sw:.3};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('magicmask');
function wearMask(hi){
  afflInflict('masked',-1,true);
  msg(`${HERO_DEF[hi].name} puts on the mask, and so do the others. For twelve hours the watch will not give the party a second look.`,'#e0c0f0');sfx('potion');
}
const MASK_LINES=[
  'Psst. Friend. You have the look of someone who goes into houses. Not that there is anything wrong with that. I sell masks. Real magic. The guards look straight through you.',
  'Quiet, quiet. A word. Masks, my friend. Enchanted by a genuine wizard I will not name. Wear one and no guard will trouble you. Five hundred gold. A bargain.',
  'Over here. Not so loud. Do you want to walk into any house you like without a guard making a fuss? I have exactly the thing. Magic masks. Limited stock. Unlimited discretion.'
];
khNpc('kh_snakeoil','A shifty salesman','kh_npc5_5',d=>{
  const line=MASK_LINES[(hash2(d.x,d.y,5)*MASK_LINES.length)|0];
  return say(line,[
    ['Buy a Magic Mask (500 gold).',()=>{
      if(G.gold<500)return say('Five hundred. That is the price. I am not a charity, I am a businessman.',[BYE]);
      if(!bagAdd(mkItem('magicmask')))return say('Your bag is full. I cannot be seen handing you things in a crowd.',[BYE]);
      G.gold-=500;sfx('key');honourAdd(-1,'you bought a thief mask');
      return say('Pleasure. Keep it out of the rain, and do not wear it near a mirror. Do not ask what happens. Nothing happens. Mostly.',[BYE]);
    }],
    ['What does the mask do?',()=>say('Wear it, and for twelve hours the watch sees a stranger in a pretty mask and thinks of something else. You can walk into any house you like, and nobody bats an eye. They work on the whole party at once. One mask, one party.',[['Buy a Magic Mask (500 gold).',()=>{if(G.gold<500)return say('Five hundred gold. I do not haggle in alleys.',[BYE]);if(!bagAdd(mkItem('magicmask')))return say('Your bag is full.',[BYE]);G.gold-=500;sfx('key');honourAdd(-1,'you bought a thief mask');return say('You will not regret it. Much.',[BYE])}],BYE])],
    BYE]);
});
