/* ==========================================================================
   WENLOCK: THE MARKET STALLS (ids wlo_stall*, wlo_potter, wlo_pedlar). Each of the ten stalls in the square has a keeper beside it who sells what is piled on the stall:
   fruit, spices, pots, fish, cloth and rugs, jewellery, vegetables and eggs, melons, jars, and sacks of grain with cheese. (The gingerbread stall is in ww_quests.js.)
   The keepers are placed by wenlock_folk.js; here they get their shops. Last of the Wenlock shop files, so it replaces the talk those ids had.
   ========================================================================== */
ITEMDEF.wlegg={n:'Boiled Egg',k:'food',t:'Snack',ic:'nuts',c:'#ece0b8',heal:8,feed:45,stack:1,price:3,sw:.2,d:'A hen\'s egg, boiled hard, with a pinch of salt in a twist of paper.'};
ITEMDEF.wlmelon={n:'Slice of Melon',k:'food',t:'Snack',ic:'apple',c:'#7ab050',heal:10,feed:45,stack:1,price:3,sw:.3,d:'A thick, cold slice of green melon.'};
ITEMDEF.wltrout={n:'River Trout',k:'food',t:'Meal',ic:'herring',c:'#b8a890',heal:14,feed:65,stack:1,price:5,sw:.3,d:'A trout from the brook, gutted and wrapped in a dock leaf.'};
ITEMDEF.wlgrapes={n:'Bunch of Grapes',k:'food',t:'Snack',ic:'apple',c:'#6a3a7a',heal:8,feed:40,stack:1,price:3,sw:.3,d:'A bunch of small purple grapes.'};
ITEMDEF.wlbun={n:'Spiced Bun',k:'food',t:'Snack',ic:'bread',c:'#a86a30',heal:14,feed:60,stack:1,price:5,sw:.3,d:'A sticky bun, thick with cinnamon and a little pepper.'};
const wlsHas=r=>ITEMDEF[r[0]];
KH_STOCK.wls_fruit=()=>[['apple',20],['wlgrapes',10],['dates',6],['nuts',10]].filter(wlsHas);
KH_STOCK.wls_spice=()=>[['wlbun',12],['herb',10],['honeycomb',6],['salve',4],['antidote',4]].filter(wlsHas);
KH_STOCK.wls_pots=()=>[['pottage',8],['honeycomb',6],['water',10],['ale',8]].filter(wlsHas);
KH_STOCK.wls_fish=()=>[['wltrout',12],['herring',14]].filter(wlsHas);
KH_STOCK.wls_cloth=()=>[['jerkin',2],['cap',3],['leggings',3],['bracers',3],['lantern',3],['torch',8]].filter(wlsHas);
KH_STOCK.wls_jewels=()=>Object.keys(ITEMDEF).filter(id=>{const d=ITEMDEF[id];return (d.k==='ring'||d.k==='amulet'||d.k==='neck')&&!d.rar&&(d.price||0)>0&&(d.price||0)<=6000}).slice(0,8).map(id=>[id,1]);
KH_STOCK.wls_veg=()=>[['wlegg',20],['herb',8],['wildflower',6],['pottage',6]].filter(wlsHas);
KH_STOCK.wls_melon=()=>[['wlmelon',16],['apple',8],['dates',6]].filter(wlsHas);
KH_STOCK.wls_jars=()=>[['ale',16],['water',12],['honeycomb',6]].filter(wlsHas);
KH_STOCK.wls_sacks=()=>[['bread',14],['cheese',12],['nuts',8]].filter(wlsHas);
const WLSTALLS=[ // id, name, face, shop title, greeting, stock key, size
  ['wlo_stall1','An apple seller','kh_ohfolk6_3','The Fruit Stall','Apples! Sweet as a sunny day and twice as crisp. A bite free if you smile. Do not eat the green ones. I am not telling you why.','wls_fruit',1],
  ['wlo_stall5','A spice seller','kh_ohfolk6_5','The Spice Stall','Cinnamon, pepper, saffron and a very good sticky bun. Smell that. No, smell it properly. Now you have to buy.','wls_spice',1],
  ['wlo_potter','Clay the potter','kh_ohfolk4_4','The Pottery Stall','Jugs, bowls and pots of honey, all made by me this morning. This one already has a crack. That is how you know it is honest work.','wls_pots',1],
  ['wlo_stall3','A fishwife','kh_ohfolk2_0','The Fish Stall','Fish from the river, fresh as a slap. Well, fresh as yesterday. The cat has been watching my stall since dawn. I have made my peace with this.','wls_fish',1],
  ['wlo_pedlar','Silas, a pedlar','kh_ohfolk5_5','The Cloth and Rug Stall','Needles, ribbons, buttons, bells and one very good boot. Cloth by the yard and a rug for every floor. I will sell you the boot at a loss.','wls_cloth',1.02],
  ['wlo_stall6','A jeweller','kh_ohfolk2_3','The Jewellery Stall','Rings and charms, polished this morning. Nothing here is stolen. Some of it was found. Finding is a different thing.','wls_jewels',1],
  ['wlo_stall4','An egg woman','kh_ohfolk3_1','Eggs and Greens','Eggs, a dozen a penny, and greens from the allotment. The hens are in a mood, so they are very good eggs.','wls_veg',.96],
  ['wlo_stall7','A melon seller','kh_ohfolk7_1','The Melon Stall','Melons, cold from the cellar. Sweet inside and a very good shape for dropping on a rival. I do not recommend that. Mind the crate.','wls_melon',1],
  ['wlo_stall8','A jar seller','kh_ohfolk1_2','The Jar Stall','Big jars of ale, small jars of water and honey in the little ones. Please bring the jar back. I know where you live. I do not know where you live. Please bring it back.','wls_jars',1],
  ['wlo_stall2','A cheese seller','kh_ohfolk7_2','Grain and Cheese','Bread from the sacks and cheese from the cart. Sharp, mild or mouldy, and the mouldy ones are the best. A doctor swears at them, and still buys one.','wls_sacks',1]];
for(const [id,n,face,title,greet,key,sc] of WLSTALLS){
  khNpc(id,n,face,d=>{
    let g=greet;
    try{if((id==='wlo_pedlar'||id==='wlo_potter')&&typeof wwF==='function'&&wwF().wwDead)g=id==='wlo_pedlar'?'Silas has gingerbread men for a penny, and they are certified, by a goat, as safe. Cloth, rugs, ribbons and one very good boot too.':'I have made a gingerbread mould for Pip\'s stall, shaped like a small man. It came out with a small, unhappy face, and I could not make it stop. Jugs, bowls and honey are over here.'}catch(e){}
    return say(g,[['Browse the wares',()=>{openShop(d,KH_STOCK[key](),title);return null}],BYE])},{sc});
}
