/* ---------- what stands in each room ---------- */
function pshFurnish(S){
  const {put,pic,foe,lamp,sign,col,stat,pt,mark,open,fr,RI,decor,hs,g}=S;
  const N=[0,-1],So=[0,1],Ea=[1,0],We=[-1,0],V=PSH_COL.violet,WM=PSH_COL.warm,CO=PSH_COL.cold;
  const thing=(k,id,x,y,o)=>put(k,x,y,Object.assign({block:true,npc:id},o||{}));
  const hang=(x,y,lt,col2)=>{put('ps_chandelier',x,y,{bob:1.45,over:true,sc:1});lamp(x,y,col2||CO,lt||1.7,150)};
  const wall=(k,list,wd,o)=>{for(const [x,y] of list)pic(k,x,y,wd,o)};
  const guard=(x,y)=>{if(ENEMY_DEF.psguard)foe('psguard',x,y);else foe('psarmour',x,y)};
  const mst=i=>{const n=['ps_st_chimera','ps_st_hydra','ps_st_judge','ps_st_headless','ps_st_bishop','ps_st_mourners','ps_st_veiled','ps_st_hound'][i%8];return IMG[n]&&!IMG[n]._ps?n:PSH.st(i)};
  PSH.mst=mst;
  /* ===== A. the Entrance Hall ===== */
  for(const y of [70,73,76,79]){col(50,y,(y/3|0)%2);col(62,y,((y/3|0)+1)%2)}
  for(const [x,y,i] of [[48,68,0],[51,68,3],[61,68,1],[64,68,4]]){mark(x,67,'bay');stat(x,y,i)}
  thing(PSH.st(2),'psh_anc1',53,69);thing(PSH.st(6),'psh_anc2',59,69);
  hang(56,72);hang(56,77,1.6);
  wall('ps_banner_violet',[[52,81],[60,81]],So,{});wall('ps_pt_pale_lands',[[48,81]],So);wall('ps_pt_feast',[[64,81]],So);sign(58,81,So,'THE ENTRANCE HALL','The Great Halls lie north');
  wall(pt(1),[[46,69],[46,72],[46,79]],We);wall(pt(8),[[66,69],[66,72],[66,79]],Ea);
  thing('ps_p_chamberlain','psh_chamberlain',53,76);
  thing('ps_suit_armour','psh_suitA',47,72);put('ps_suit_armour',65,72,{block:true});
  thing('hl_p_note','psh_notice',47,80,{sc:.5});
  guard(49,71);guard(63,71);foe('psarmour',48,78);foe('psarmour',64,78);
  /* ===== B. the Gallery of Portraits ===== */
  for(let x=9,i=0;x<=41;x+=4,i++){col(x,73,i%2);col(x,78,(i+1)%2)}
  {const skipN=new Set(),skipS=new Set(),wide=(set,x,k,r)=>{set.add(x);for(let d=1;d<=r;d++){set.add(x-d);set.add(x+d)}};
   const SPN={20:['ps_pt_king',1],23:['ps_pt_queen',1],27:['ps_pt_prince',1],32:['ps_pt_ancestors',2],38:['ps_pt_gallery8',1]},SPS={12:['ps_pt_battle',1],17:['ps_pt_hunt',1],35:['ps_pt_feast',1],40:['ps_pt_pale_lands',1]};
   for(const x in SPN){const [k,r]=SPN[x];pic(k,+x,70,N);wide(skipN,+x,k,r)}
   for(const x in SPS){const [k,r]=SPS[x];pic(k,+x,81,So);wide(skipS,+x,k,r)}
   let i=0;for(let x=7;x<=43;x+=2){if(Math.abs(x-10)<=1||Math.abs(x-24)<=1||skipN.has(x))continue;pic(pt(i++),x,70,N)}
   for(let x=7;x<=43;x+=2){if(Math.abs(x-28)<=2||skipS.has(x))continue;pic(pt(i++),x,81,So)}
   for(const y of [71,79])pic(pt(i++),6,y,We);for(const y of [71,73,79,81])pic(pt(i++),44,y,Ea)}
  for(const y of [74,77]){mark(5,y,'bay')}stat(6,74,0);stat(6,77,5);
  thing('ps_pt_isaude','psh_isaude',34,72,{sc:1});thing('ps_pt_empty','psh_emptyframe',14,80,{sc:1});
  thing('hl_p_lectern','psh_stand2',40,72);
  sign(26,81,So,'THE GALLERY OF PORTRAITS','West Gallery. Do not touch the frames.');
  hang(15,75);hang(25,75,1.8);hang(35,75);
  foe('psfiend',16,71);foe('psfiend',30,80);foe('psfiend',38,71);foe('psfiend',20,80);foe('pscarver',22,77);foe('pscourtier',36,77);foe('psarmour',12,80);foe('psarmour',40,79);foe('pscarver',8,76);
  put('chest',24,68,{block:true});
  /* the painters' closet */
  thing('hl_p_shelf','psh_pigments',7,67);thing('hl_p_lectern','psh_easel',12,67);put('hl_p_desk',9,66,{block:true});lamp(10,67,CO,1.6,100);
  /* ===== C. the Hall of Statues ===== */
  for(let x=72,i=0;x<=96;x+=8,i++)col(x,73,i);for(let x=76,i=0;x<=92;x+=8,i++)col(x,78,i+1);
  {const north=[71,74,77,80,83,92,95,98],south=[71,74,77,80,83,86,89,92,95,98];let i=0;const named={74:'psh_pl0',98:'psh_pl2',77:'psh_pl3',89:'psh_pl4',95:'psh_pl5'};
   for(const x of north){mark(x,69,'bay');const id=x===74?'psh_pl0':x===98?'psh_pl2':null;put(mst(i++),x,70,{block:true,npc:id||undefined})}
   mark(86,69,'bay');put(mst(i++),86,70,{block:true,npc:'psh_pl1'});
   put(mst(7),88,70,{block:true,npc:'psh_turner'});
   for(const x of south){mark(x,82,'bay');const id=named[x]&&x!==74&&x!==98?named[x]:null;put(mst(i++),x,81,{block:true,npc:id||undefined})}
   for(const x of [76,84,92])put(mst(i++),x,73,{block:true});for(const x of [72,80,88,96])put(mst(i++),x,78,{block:true})}
  for(let y=70;y<=81;y++)mark(107,y,'ivy');for(let x=100;x<=106;x++)mark(x,69,'ivy');
  put('fountain',103,77,{block:true});for(const [x,y] of [[101,73],[105,73],[101,80],[105,80]])put('gy_bench',x,y,{block:true});
  for(const [x,y] of [[100,71],[106,71],[100,75],[100,79],[106,79]])put('ps_urn_pale',x,y,{block:true});
  put('ps_hst1',102,71,{block:true});put('ps_hst2',104,81,{block:true});put('ps_hst4',106,73,{block:true});
  for(const x of [99,100,101,105,106])put('ps_hedge',x,70,{});
  wall(pt(30),[[68,71],[68,73],[68,79],[68,81]],We);
  thing('ps_p_curator','psh_curator',74,80);sign(70,81,So,'THE HALL OF STATUES','Kings and monsters of the old house');
  hang(74,76);hang(86,76);hang(98,76);lamp(103,74,V,1.5,110);
  foe('psarmour',80,72);foe('psarmour',88,79);foe('psarmour',96,72);foe('pscarver',92,76);foe('psdancer',84,76);foe('psdancer',100,78);foe('pscourtier',78,79);
  put('chest',88,68,{block:true});
  /* ===== D. the Great Hall ===== */
  for(let y=36,i=0;y<=62;y+=4,i++){col(42,y,i%2?2:0);col(70,y,i%2?0:2);col(38,y+2,1);col(74,y+2,1)}
  for(const x of [49,56,63]){for(let y=40;y<=60;y++){if((y-40)%5===2)put('ps_candelabra_tall',x,y,{block:true});else put('ps_table_long',x,y,{block:true,sc:.8})}
    for(let y=41;y<=59;y+=3){put('ps_chair_high',x-1,y,{block:true});put('ps_chair_high',x+1,y,{block:true})}}
  for(const x of [50,52,54,58,60,62])put('ps_table_high',x,34,{block:true});put('ps_candelabra_tall',53,35,{block:true});put('ps_candelabra_tall',59,35,{block:true});
  for(const x of [51,53,59,61])put('ps_chair_high',x,33,{block:true});put('ps_throne',56,32,{block:true});
  for(const [x,y] of [[52,32],[60,32]])pic('ps_pt_battle',x,y,N);
  pic('ps_hearth_cold',36,48,We,{bob:.35});pic('ps_hearth_cold',76,48,Ea,{bob:.35});lamp(37,48,[1.05,1.1,1.35],2.2,170);lamp(75,48,[1.05,1.1,1.35],2.2,170);
  for(const y of [38,43,53,59,63]){pic('ps_banner_violet',36,y,We);pic('ps_banner_violet',76,y,Ea)}
  for(const x of [41,45,67,71])mark(x,31,'win');for(const x of [38,43,69,74])pic('ps_banner_violet',x,32,N);
  for(const x of [38,41,45,48,66,69,72,75])pic(pt(40+x),x,65,So);sign(53,65,So,'THE GREAT HALL','Feast and dance of the old house');
  for(const [x,y] of [[53,46],[53,54],[59,46],[59,54],[45,42],[45,58],[67,42],[67,58],[56,38],[56,63]])hang(x,y,1.9);
  foe('psdancer',45,52);foe('psdancer',67,50);foe('psdancer',46,45);
  for(const [x,y] of [[52,44],[60,52],[52,58],[60,44]])foe('psservant',x,y);
  foe('pscourtier',45,38);foe('pscourtier',67,38);foe('pscourtier',50,63);foe('pscarver',47,60);foe('pscarver',65,44);
  foe('psarmour',53,37);foe('psarmour',59,37);foe('psarmour',40,64);foe('psarmour',72,64);
  thing('hl_p_note','psh_seating',54,62,{sc:.5});
  /* ===== E. the Screens Passage ===== */
  for(let x=9,i=0;x<=29;x+=4,i++){col(x,52,i);col(x,60,i+1)}
  for(const x of [12,20,28])put('ps_sideboard',x,53,{block:true});
  thing('hl_p_rack','psh_keyboard',31,54);
  wall(pt(60),[[11,52],[15,52],[19,52],[23,52],[27,52],[31,52]],N);wall(pt(61),[[11,60],[15,60],[19,60],[23,60],[27,60],[31,60]],So);
  pic('gy_hatch',24,60,So,{bob:.6});sign(26,60,So,'THE BUTTERY','The hatch is painted shut');
  sign(8,52,N,'THE SCREENS PASSAGE','West to the kitchens and armoury');
  hang(14,56,1.6);hang(24,56,1.6);
  foe('psservant',16,54);foe('psservant',26,58);foe('psservant',22,56);foe('pscarver',30,57);foe('psarmour',10,58);
  /* ===== F. the Banqueting Hall ===== */
  for(let x=84,i=0;x<=104;x+=4,i++){col(x,45,i);col(x,61,i+1)}
  for(let x=84;x<=103;x++){if((x-84)%4===2)put('ps_candelabra_tall',x,50,{block:true});else put('ps_table_long',x,50,{block:true,sc:.8})}
  for(let x=85;x<=103;x+=2){put('ps_chair_high',x,49,{block:true});put('ps_chair_high',x,51,{block:true})}
  for(let k=0;k<5;k++){const x=86+k*4;put('ps_p_courtier'+(k+1),x,49,{block:true,npc:'psh_guest'+k})}
  for(let k=0;k<4;k++){const x=88+k*4;put('ps_p_courtier'+(k+2),x,51,{block:true,npc:'psh_guest'+(5+k)})}
  thing('ps_chair_high','psh_headchair',83,50);thing('hl_p_note','psh_sheet3',104,50,{sc:.5});
  for(let x=81;x<=91;x++)put('ps_balustrade',x,42,{block:true});for(let x=95;x<=105;x++)put('ps_balustrade',x,42,{block:true});
  for(const x of [84,88,100,104])pic('ps_banner_violet',x,40,N);put('ps_harpsichord',98,41,{block:true});put('ps_candelabra_tall',82,41,{block:true});put('ps_candelabra_tall',104,41,{block:true});
  for(const y of [43,46,49,60,63])pic(pt(80+y),106,y,Ea);for(const x of [82,85,88,91,94,97,100,103])pic(pt(100+x),x,64,So);for(const y of [45,48,52,60,63])pic(pt(120+y),80,y,We);
  sign(82,64,So,'THE BANQUETING HALL','The State Dining Room');
  for(const [x,y] of [[88,47],[98,47],[88,53],[98,53]])hang(x,y,1.9,V);
  foe('psdancer',90,59);foe('psdancer',100,59);foe('pscourtier',86,47);foe('pscourtier',102,47);foe('pscarver',92,53);foe('pscarver',96,53);foe('psarmour',84,63);foe('psarmour',104,63);
  /* ===== G. the Music Salon ===== */
  for(const [x,y] of [[11,34],[27,34],[11,46],[27,46],[19,32],[19,48]])col(x,y,2);
  thing('ps_harpsichord','psh_harp',8,40);put('ps_chair_high',10,38,{block:true});put('ps_chair_high',10,42,{block:true});
  for(const x of [16,22])put('ps_chair_high',x,31,{block:true});
  for(const x of [9,17,21,25,29])pic('ps_mirror',x,30,N);for(const y of [36,44])pic('ps_mirror',6,y,We);
  wall(pt(140),[[9,50],[13,50],[17,50],[21,50],[25,50],[29,50]],So);wall(pt(150),[[32,34],[32,46]],Ea);
  thing('hl_p_lectern','psh_stand1',7,32);thing('ps_p_lutenist','psh_lutenist',9,45);
  sign(30,30,N,'THE MUSIC SALON','Dancing every night');
  for(const [x,y] of [[13,36],[25,36],[13,44],[25,44],[19,40]])hang(x,y,1.7,V);
  for(const [x,y] of [[17,38],[22,42],[15,44],[23,36]])foe('psdancer',x,y);foe('pscourtier',28,40);foe('pscourtier',12,48);
  /* ===== H. the Lady's Withdrawing Room (rest) ===== */
  thing('ps_bed_four','psh_bed',13,16);put('chest',18,16,{block:true});
  for(const x of [9,13,17])mark(x,13,'win');
  pic('ps_mirror',6,20,We);wall(pt(160),[[6,24],[20,22],[20,26]],We);pic(pt(165),20,18,Ea);
  put('ps_candelabra_tall',9,26,{block:true});put('ps_candelabra_tall',17,26,{block:true});put('ps_urn_pale',8,16,{block:true});
  for(const [x,y] of [[10,20],[16,20],[13,15],[8,26],[18,26]])lamp(x,y,WM,1.9,140);
  /* ===== I. the Grand Stair Hall ===== */
  for(const x of [50,52,60,62])mark(x,15,'win');for(const x of [49,53,59,63])mark(x,15,'pilaster');for(const x of [47,48,64,65])mark(x,15,'ivy');
  for(const y of [16,17,18,19,20,21,22]){put('ps_balustrade',49,y,{block:true});put('ps_balustrade',63,y,{block:true})}
  put(PSH.st(3),52,17,{block:true});put(PSH.st(5),60,17,{block:true});
  for(const y of [18,22,26]){col(46,y,0);col(66,y,0)}col(50,26,1);col(62,26,1);
  put(PSH.st(1),45,11,{block:true});put(PSH.st(4),67,11,{block:true});put(PSH.st(0),45,13,{block:true});put(PSH.st(2),67,13,{block:true});
  for(const y of [14,18,22])mark(43,y,'win');for(const y of [14,22])mark(69,y,'win');
  wall(pt(200),[[44,12],[44,16],[44,20],[44,24]],We);wall(pt(210),[[68,12],[68,15],[68,23],[68,26]],Ea);wall(pt(220),[[46,28],[50,28],[62,28],[66,28]],So);
  sign(54,16,N,'UP THE GRAND STAIR','The way to the state rooms. Ask the Chamberlain.');sign(68,20,Ea,'THE AUDIENCE CHAMBER','The Sovereign receives no one');
  hang(56,24,1.8);hang(56,19,1.8,V);lamp(46,16,V,1.7,120);lamp(66,16,V,1.7,120);
  foe('psstairwarden',56,21);
  /* ===== J. the Trophy and Hunting Hall ===== */
  for(const y of [14,19,24,30]){col(84,y,1);col(102,y,1)}col(90,12,0);col(96,12,0);
  for(let x=86;x<=100;x++){if((x-86)%4===2)put('ps_candelabra_tall',x,28,{block:true});else put('ps_table_long',x,28,{block:true,sc:.8})}
  for(let x=87;x<=99;x+=2){put('ps_chair_high',x,27,{block:true});put('ps_chair_high',x,29,{block:true})}
  put('ps_throne',93,11,{block:true});
  for(const x of [82,85,88,98,101,104])pic(x%2?'ps_trophy_stag':'ps_trophy_stag',x,10,N);
  for(const y of [13,17,21,25,30])pic('ps_pt_hunt',80,y,We);for(const y of [13,17,21,25,30])pic(y%2?'ps_banner_violet':'ps_pt_battle',106,y,Ea);
  for(const x of [82,86,102])put('hl_p_cage',x,34,{block:true});
  thing('chest','psh_bowchest',104,12);sign(90,36,So,'THE TROPHY AND HUNTING HALL','The Sovereign hunted here');
  for(const [x,y] of [[88,16],[98,16],[88,32],[98,32]])hang(x,y,1.8);
  foe('psantlered',93,15);foe('psarmour',84,13);foe('psarmour',102,13);foe('pscarver',88,30);
  for(const [x,y] of [[84,32],[100,32],[90,20],[96,20]])foe('pshhound',x,y);
  thing('hl_p_note','psh_huntbook',92,26,{sc:.5});
}
