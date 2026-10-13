/* ==========================================================================
   THE NEW SHOPS: a wizard (spells), a swordsmith, an armourer and an alchemist, in Khemetra's Merchants' Quarter (the buildings are listed in
   khemetra_build.js) and in Ironhill (four new buildings built into the town map here).
   ========================================================================== */
KH_STOCK.sword=GEAR_STOCK.sword;KH_STOCK.armour2=GEAR_STOCK.armour;KH_STOCK.potion2=GEAR_STOCK.potion;
khShop('kh_swordsmith','Hakim, the swordsmith','kh_npc4_0','The Gilded Blade','Steel for every level of customer, from the first blade to the last. I sell nothing magic, and I need nothing magic. A good edge is enough.','sword');
khShop('kh_armourer','Nadira, the armourer','kh_npc4_2','The Iron Aegis','Helms, plate and shields, each fitted for a fighter of a certain strength and standing. Try them on. They are heavier than they look.','armour2');
khShop('kh_alchemist','Ptah-Em, the alchemist','kh_npc2_2',"The Alchemist's Cellar",'Draughts to heal, draughts to restore, brews of might and speed, and cures for what ails you. Mind the green one.','potion2');
khShop('ih_swordsmith','Torvald, the swordsmith','kh_npc4_1','Steelhold Blades','Ironhill steel is the best in the north, and I keep the best of it. Take your time. Weigh them.','sword');
khShop('ih_armourer','Grete, the armourer','kh_npc4_3','Ironhill Plate and Mail','Hammered in the north, tested on a wall. If it fails, you will not complain, but I will know.','armour2');
khShop('ih_alchemist','Old Brannoch\'s sister, Ysolt','kh_npc2_3','The Cauldron','Potions, tonics, tinctures. Some of them even taste of something nice.','potion2');
/* ---- Ironhill: four new buildings in the free ground of the town ---- */
const IH_SHOPS=[
  {n:271,name:"Corvin's Arcana",keeper:'ih_wizard',dir:'N',x:2,y:10,door:'9',idx:9,tex:'hall'},
  {n:272,name:'The Cauldron',keeper:'ih_alchemist',dir:'N',x:40,y:10,door:'́',idx:10,tex:'shop'},
  {n:273,name:'Steelhold Blades',keeper:'ih_swordsmith',dir:'S',x:2,y:21,door:'̂',idx:11,tex:'shop'},
  {n:274,name:'Ironhill Plate and Mail',keeper:'ih_armourer',dir:'S',x:40,y:21,door:'̃',idx:12,tex:'shop'}
];
(function(){
  const L=LEVELS[13];if(!L||!L.rows||L.rows.length<26||L._shops)return;
  L._shops=1;
  const src=L.rows.slice(),rows=L.rows.slice();
  const put=(y,x,str)=>{rows[y]=rows[y].slice(0,x)+str+rows[y].slice(x+str.length)};
  const ch=L.chars=Object.assign({},L.chars||{});
  const portals=L.portals=(L.portals||[]).slice();
  for(const S of IH_SHOPS){
    let fx,fy,pat,dx;
    if(S.dir==='N'){pat=[src[10].slice(12,16),src[11].slice(12,16),src[12].slice(12,16)];dx=1;fy=12;pat[2]=pat[2][0]+S.door+pat[2].slice(2);for(let k=0;k<3;k++)put(S.y+k,S.x,pat[k]);fx=S.x+dx;fy=S.y+2;}
    else{pat=[src[21].slice(18,23),src[22].slice(18,23),src[23].slice(18,23),src[24].slice(18,23)];dx=2;pat[0]=pat[0].slice(0,2)+S.door+pat[0].slice(3);for(let k=0;k<4;k++)put(S.y+k,S.x,pat[k]);fx=S.x+dx;fy=S.y}
    if(S.door!=='9')ch[S.door]=30+S.idx;
    portals[S.idx]={to:S.n,x:fx,y:S.dir==='N'?fy+1:fy-1,f:S.dir==='N'?2:0,tex:S.tex};
    S.exit={x:fx,y:S.dir==='N'?fy+1:fy-1,f:S.dir==='N'?2:0};
    L.decor.push({k:'sign_'+S.keeper,x:S.exit.x-1,y:S.exit.y,block:false,wd:[0,S.dir==='N'?-1:1],txt:[S.name.toUpperCase(),{ih_wizard:'Corvin, Wizard',ih_alchemist:'Ysolt, Alchemist',ih_swordsmith:'Torvald, Swordsmith',ih_armourer:'Grete, Armourer'}[S.keeper]]});
    KH_LAZY[S.n]=()=>{
      if(LEVELS[S.n])return;
      LEVELS[S.n]=khRoom({id:'ih'+S.n,name:S.name,room:'shop',keeper:S.keeper},S.n,{to:13,x:S.exit.x,y:S.exit.y,f:S.exit.f}).level;
      LEVEL_NAMES[S.n]=S.name;
    };
  }
  L.rows=rows;
  const base=LEVEL13_DATA;if(base&&base!==L){base.rows=rows;base.chars=ch;base.portals=portals}
})();
/* the town's tile table is rebuilt when the pictures are ready, so the doors' characters are put back every time Ironhill is loaded */
function ihShopsChars(){const L=LEVELS[13];if(!L)return;L.chars=L.chars||{};for(const S of IH_SHOPS)if(S.door!=='9')L.chars[S.door]=30+S.idx}
