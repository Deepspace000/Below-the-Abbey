/* ==========================================================================
   RUMOURS AND LEADS. Townsfolk, bards, innkeepers and travellers let slip what they have heard. Each new rumour goes into the journal, and some of them
   put a mark on the map of Khemetra (a shop, a healer, a hoard) so that the leads can be followed.
   ========================================================================== */
const RUMOURS=[
  {id:'hoard_nw',t:'They say a dark house deep in Khemetra\'s Old Quarter, in the far north-west, hides a chest of gold so old that it carries a curse.',mark:'hoard5000',tag:'hoard'},
  {id:'hoard_ne',t:'A noble family in the Temple District, in the far north-east, hid a chest of gold behind a curtain and died without telling a soul.',mark:'hoard2000',tag:'hoard'},
  {id:'hoard_se',t:'A merchant in the far south-east, near the baths, pushed a strongbox of coins under his table and never came back for it.',mark:'hoard1000',tag:'hoard'},
  {id:'houses_gold',t:'Some houses have a few coins lying in a corner. People are too polite to look.',tag:'hoard'},
  {id:'wizard_kh',t:'The Wizard\'s Emporium in Khemetra\'s Merchants\' Quarter teaches a spell for every kind of adventurer, from level ten to level fifty.',mark:'shop:magic1',tag:'shop'},
  {id:'sword_kh',t:'The Gilded Blade in the Merchants\' Quarter sells good plain steel for every level, nothing magic and all of it sharp.',mark:'shop:sword1',tag:'shop'},
  {id:'armour_kh',t:'The Iron Aegis in the Merchants\' Quarter sells helms, plate and shields, with a few surprises for those who can lift them.',mark:'shop:armour1',tag:'shop'},
  {id:'potion_kh',t:'The Alchemist\'s Cellar in the Merchants\' Quarter has draughts to restore body and mind, and brews of might and speed.',mark:'shop:potion4',tag:'shop'},
  {id:'wizard_ih',t:'A hedge wizard called Corvin has set up shop in the north-west corner of Ironhill. He is not as bad as he looks.',tag:'shop'},
  {id:'smith_ih',t:'Ironhill has two new shops in the south: Steelhold Blades and Ironhill Plate and Mail. The swordsmith swears his steel is the best in the north.',tag:'shop'},
  {id:'healer_kh',t:'Merit the healer stands in the Fountain Garden and cures fevers and poisons for forty gold. She teaches her herbs too.',mark:'npc:kh_healer',tag:'cure'},
  {id:'church_cure',t:'If a curse settles on you, the Church of Light in Khemetra will lift it, for nothing. The priest just asks that you come in.',mark:'shop:church',tag:'cure'},
  {id:'bath_cure',t:'A good hot soak in the baths clears the dust from the lungs, the fleas from the hair and the sun from the head.',tag:'cure'},
  {id:'fixer_th',t:'A man called Sly Dunstan, in Thornwick, pays well for jobs that nobody talks about.',tag:'dark'},
  {id:'fixer_kh',t:'Khafre the Fixer drinks in the Beggars\' Quarter. If you need a little crime, he will arrange it.',tag:'dark'},
  {id:'watch',t:'The watch in Khemetra gives three warnings to anyone who walks into a house, then the cells. A little persuasion helps. So does a coin.',tag:'watch'},
  {id:'pets',t:'Kal the animal trader sells goats, cats and donkeys in Khemetra and in Ironhill. A donkey carries a great deal.',tag:'pets',mark:'npc:pet_trader'},
  {id:'goat_nose',t:'A goat can smell gold hidden in a house. It is the only thing a goat smells that is worth anything.',tag:'pets'},
  {id:'witch',t:'The witch of the road knows how to brew sleeping tea, and has opinions on everything else.',tag:'cure'},
  {id:'heat',t:'Never cross the dunes at noon. Go at dawn or by night, and take water. A heat wave will cook the unwary.',tag:'wx'},
  {id:'rain',t:'A cold rain brings fever to those who stay out in it. Find a roof, or a fire.',tag:'wx'},
  {id:'luck',t:'A black cat is bad luck, unless it is your own cat. Then it is just a cat.',tag:'luck'},
  {id:'bard',t:'A bard turns up in the evenings in the larger towns. A tip for a song brings luck, and sometimes a secret.',tag:'luck'},
  {id:'caravan',t:'Merchants pull their carts off the road in fine weather. They carry things that no shop sells.',tag:'road'},
  {id:'locks',t:'The shuttered houses of Thornwick are not as empty as they look. A thief with a good pick can get in. Some have a little gold.',tag:'dark'},
  {id:'rest',t:'Sleeping in the open is dangerous. Thieves come in the night, and sometimes worse. A cat, a scout or a bit of luck keeps them away.',tag:'road'},
  {id:'masks',t:'Shifty salesmen lurk in the quiet dead-end lanes of Khemetra and sell Magic Masks. Five hundred gold, and the watch looks right through you for twelve hours.',tag:'dark'},
  {id:'friends',t:'Companions who share a fire become friends. Friends fight better, and fall hard.',tag:'bond'}
];
function rumData(){const F=G.flags;return F.rumours||(F.rumours={})}
function rumourFor(kind){
  const known=rumData(),pool=RUMOURS.filter(r=>!known[r.id]&&(kind!=='road'||['road','wx','luck','cure','pets'].includes(r.tag))&&(kind!=='town'||r.tag!=='road'));
  const r=pool.length?pool[(Math.random()*pool.length)|0]:RUMOURS[(Math.random()*RUMOURS.length)|0];
  const fresh=!known[r.id];known[r.id]={day:dayNum(),town:repTownOf(LEVEL)||'the road'};
  if(fresh)msg('A new rumour goes into the journal.','#e8d8a0');
  return 'They say: '+r.t;
}
/* citizens and innkeepers let things slip */
(function(){
  const c=NPCS.kh_citizen;if(c&&!c._rm){c._rm=1;const base=c.root;c.root=function(d){const n=base(d);if(Math.random()<.16)n.text='I hear things, you know. '+rumourFor('town');return n};}
  for(const id of ['bram','odalys','kh_inn1','kh_inn2','kh_inn3'])repWrap(id,()=>true,'Any rumours?',()=>say(rumourFor('town'),[BYE]));
})();
/* marks on the map of Khemetra */
function rumourMarks(){
  const out=[];if(typeof KH_CITY==='undefined'||!KH_CITY)return out;
  const known=rumData();
  for(const r of RUMOURS){
    if(!known[r.id]||!r.mark)continue;
    let x=0,y=0,t='';
    const m=r.mark;
    if(m.startsWith('hoard')){const amt=+m.slice(5),h=KH_CITY._hoards&&[...KH_CITY._hoards.entries()].find(([mm,hh])=>hh.amt===amt);if(!h)continue;x=h[0].cells[0][0];y=h[0].cells[0][1];t='Rumoured hoard'}
    else if(m.startsWith('shop:')){const b=KH_BUILDINGS.find(q=>q.id===m.slice(5));if(!b||!b.front)continue;x=b.front[0];y=b.front[1];t=b.name}
    else if(m==='npc:kh_healer'){x=104;y=206;t='Merit, the healer'}
    else if(m==='npc:pet_trader'){x=196;y=292;t='Kal, animal trader'}
    else continue;
    out.push({x,y,t,hoard:m.startsWith('hoard')});
  }
  return out;
}
function drawRumourMarks(ox,oy,cs){
  for(const k of rumourMarks()){
    const sx=ox+(k.x+.5)*cs,sy=oy+(k.y+.5)*cs;if(sx<-20||sy<-20||sx>DW+20||sy>DH+20)continue;
    ctx.save();ctx.translate(sx,sy);const r=Math.max(4,cs*.9);
    ctx.fillStyle=k.hoard?'#ffd040':'#fff0a0';ctx.strokeStyle='#5a2a0a';ctx.lineWidth=1.2;ctx.beginPath();
    for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}ctx.closePath();ctx.fill();ctx.stroke();
    if(cs>=1.6||true){ctx.font=`italic bold ${clamp(cs*1.2,6.5,9)}px ${FUI}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.strokeStyle='rgba(244,234,196,.95)';ctx.strokeText(k.t,0,r+7);ctx.fillStyle='#7a1a10';ctx.fillText(k.t,0,r+7)}
    ctx.restore();
  }
}
journalPage({id:'rumour',title:'Rumours and Leads',
  summary:()=>{const n=Object.keys(rumData()).length;return n?`${n} of ${RUMOURS.length} rumours heard. Some are marked on Khemetra's map.`:'Nothing heard yet. Listen to citizens, innkeepers, bards and merchants on the road.'},
  note:()=>0,
  open(){G.rs=0},
  draw(){
    jFrame('Rumours and leads');
    const known=rumData(),list=RUMOURS.filter(r=>known[r.id]);
    txt(`${list.length} of ${RUMOURS.length} heard`,440,25,8,'#a89878','right');
    if(!list.length){txt('Nothing yet. Talk to people. Citizens, innkeepers, bards and merchants on the road let things slip.',240,140,9,'#a89878','center',false,undefined,380)}
    const viewH=222,top=38;let y=0;const rows=list.map(r=>{const ls=wrapText(r.t,380,8.4);const o={r,ls,y};y+=ls.length*10.6+14;return o});
    const max=Math.max(0,y-viewH);G.rs=clamp(G.rs||0,0,max);
    ctx.save();ctx.beginPath();ctx.rect(30,top,420,viewH);ctx.clip();
    for(const o of rows){const ry=top+o.y-G.rs;if(ry<top-60||ry>top+viewH)continue;
      const k=known[o.r.id],tc={hoard:'#ffd860',shop:'#a8c8f0',cure:'#a8e0a0',dark:'#d09090',watch:'#e8c878',pets:'#e0c8a0',wx:'#a0c0e0',luck:'#e8e090',road:'#c8b888',bond:'#e8b0c0'}[o.r.tag]||'#c8bc98';
      ctx.fillStyle=tc;ctx.fillRect(38,ry+2,3,o.ls.length*10.6+4);
      o.ls.forEach((l,i)=>txt(l,48,ry+8+i*10.6,8.4,'#d2c9b2','left'));
      txt(`Heard on day ${k.day+1}${k.town?', '+(TOWNS.find(t=>t.id===k.town)?TOWNS.find(t=>t.id===k.town).n:k.town):''}${o.r.mark?'  -  marked on the map':''}`,48,ry+8+o.ls.length*10.6+1,6.6,'#8a7a60','left');
    }
    ctx.restore();
    if(max>0){btnText('rm_up','Up',60,288,50,16);btnText('rm_dn','Down',370,288,50,16)}
    BTNS.push({id:'rmarea',x:30,y:top,w:420,h:viewH,up:true,drag:'rum'});
  },
  click(id){if(id==='rm_up')G.rs=Math.max(0,(G.rs||0)-80);if(id==='rm_dn')G.rs=(G.rs||0)+80}
});
