/* ==========================================================================
   THE WITCH'S COTTAGE (levels 521 the cottage, 522 the cellar, 523 the kitchen with the great oven; prefix ww). Small rooms behind the cottage door of Blackbriar Wood.
   521: Grisselda's parlour: the cauldron, two bone totems, shelves of jars, and Grisselda herself, all sugar until she is not. A locked cellar door in the west wall (opens when the Flesh-Pile's key is found),
   a kitchen door in the east wall, the door out. 522: the cellar with three hanging cages and a small dog. 523: the kitchen, the brick oven against the north wall, the cauldron, the table.
   The fight: she is NPC 'wwo_grisselda' until the party draws steel (or frees her captives), then the enemy 'wwwitch' (see wwWitchAct and the hurtEnemy hook in ww_quests.js).
   ========================================================================== */
function wwBuildRooms(){
  const wall=(tex,rgb,wh)=>wwTile(tex,wh||2.6,{gain:2.4,rgb,mono:1});
  const prop=(decor,role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const mkRows=(W,H,doors)=>{const rows=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=(y===0||y===H-1||x===0||x===W-1)?'w':'.';rows.push(r.split(''))}for(const [x,y,c] of doors)rows[y][x]=c;return rows.map(r=>r.join(''))};
  const base=(o)=>Object.assign({day:0,amb:.6,ceil:'beam',diff:82,noExtras:true,noTele:true,items:[],enemies:[],lights:[],portals:[]},o);
  // ---- 521: the cottage ----
  {const W=17,H=11,gid=wall('tex_0',[1.7,1.0,.55]);   // gingerbread brown
   const rows=mkRows(W,H,[[8,H-1,'0'],[0,5,'1'],[W-1,5,'2']]),decor=[];
   decor.push({k:'ww_cauldron',x:8,y:3,block:true,deco:true,sc:1.25});
   decor.push({k:'ww_totem',x:3,y:2,block:true,deco:true});decor.push({k:'ww_totem',x:13,y:2,block:true,deco:true});
   decor.push({k:'wwi_witch',x:8,y:6,block:true,npc:'wwo_grisselda'});
   prop(decor,'potshelf',5,1);prop(decor,'potshelf',11,1);prop(decor,'kitchenshelf',2,8);prop(decor,'table',14,8);prop(decor,'chair',12,8);prop(decor,'hearth',14,3);prop(decor,'bed',2,3);prop(decor,'rack',6,1);prop(decor,'rack',10,1);
   decor.push({k:'ww_charm',x:4,y:6,block:false,walk:true,deco:true});decor.push({k:'ww_charm',x:12,y:6,block:false,walk:true,deco:true});decor.push({k:'ww_ring',x:6,y:8,block:false,walk:true,deco:true});
   decor.push({k:'ww_crumbs',x:10,y:8,block:false,walk:true,deco:true});
   LEVELS[WW.COTTAGE]=base({rows,chars:{w:gid},start:{x:8,y:9,f:0},decor,floor:'wwf_board',name:"Grisselda's Cottage",label:"Grisselda's Cottage",lights:[[4,3],[12,3],[8,7],[3,8],[13,8]],
     portals:[{to:WW.ID,x:27,y:1,f:2,tex:'in'},{to:WW.CELLAR,x:7,y:7,f:0,tex:'tomb',req:'wwCellarOpen',lock:'A trapdoor stair behind a heavy iron lock. Something small is crying down there. The lock is far too big for a pick: she keeps the key on one of her creatures.'},{to:WW.KITCHEN,x:6,y:7,f:0,tex:'shop'}],
     _wwl:[[8,4]]});
   LEVEL_NAMES[WW.COTTAGE]="Grisselda's Cottage"}
  // ---- 522: the cellar ----
  {const W=15,H=9,gid=wall('tex_3',[.9,.98,1.15]);   // cold grey-blue cellar stone
   const rows=mkRows(W,H,[[7,H-1,'0']]),decor=[];
   decor.push({k:'ww_cagefull',x:3,y:2,block:true,npc:'wwo_cage1',i:1},{k:'ww_cagefull',x:7,y:2,block:true,npc:'wwo_cage2',i:2},{k:'ww_cagefull',x:11,y:2,block:true,npc:'wwo_cage3',i:3});
   decor.push({k:'kh_oqdogs_3',x:13,y:5,block:true,npc:'wwo_button',sc:1});NPC_H.kh_oqdogs_3=NPC_H.kh_oqdogs_3||.36;
   decor.push({k:'ww_charm',x:2,y:5,block:false,walk:true,deco:true},{k:'ww_ring',x:9,y:5,block:false,walk:true,deco:true},{k:'ww_crumbs',x:5,y:6,block:false,walk:true,deco:true});
   for(const [r,x,y] of [['rack',1,1],['rack',13,1],['shelf',1,7],['chest',13,7]])prop(decor,r,x,y);
   LEVELS[WW.CELLAR]=base({rows,chars:{w:gid},start:{x:7,y:7,f:0},decor,floor:'wwf_cellar',name:"Grisselda's Cellar",label:"Grisselda's Cellar",lights:[[3,3],[7,3],[11,3],[7,6]],
     portals:[{to:WW.COTTAGE,x:1,y:5,f:1,tex:'in'}],_wwl:[[7,4],[2,5]]});LEVEL_NAMES[WW.CELLAR]="Grisselda's Cellar"}
  // ---- 523: the kitchen and the oven ----
  {const W=13,H=9,gid=wall('tex_3',[1.55,1.05,.78]);   // warm terracotta kitchen
   const rows=mkRows(W,H,[[6,H-1,'0']]),decor=[];
   decor.push({k:'ww_oven',x:6,y:2,block:true,npc:'wwo_oven',sc:1.05});
   decor.push({k:'ww_cauldron',x:2,y:3,block:true,deco:true},{k:'ww_cauldron',x:10,y:3,block:true,deco:true,sc:.8});
   decor.push({k:'wwi_witchA',x:6,y:4,block:true,npc:'wwo_witchc',found:true});
   decor.push({k:'ww_gingerman',x:4,y:7,block:false,walk:true,npc:'wwo_recipe',deco:false,found:true,sc:1.4});
   prop(decor,'table',9,6);prop(decor,'kitchenshelf',1,1);prop(decor,'potshelf',11,1);prop(decor,'rack',4,1);prop(decor,'rack',8,1);prop(decor,'shelf',1,6);
   decor.push({k:'ww_charm',x:3,y:5,block:false,walk:true,deco:true},{k:'ww_crumbs',x:8,y:5,block:false,walk:true,deco:true});
   LEVELS[WW.KITCHEN]=base({rows,chars:{w:gid},start:{x:6,y:7,f:0},decor,floor:'wwf_kit',name:"Grisselda's Kitchen",label:"Grisselda's Kitchen",lights:[[3,3],[9,3],[6,6],[2,7],[10,7]],
     portals:[{to:WW.COTTAGE,x:15,y:5,f:3,tex:'in'}],_wwl:[]});LEVEL_NAMES[WW.KITCHEN]="Grisselda's Kitchen"}
}
