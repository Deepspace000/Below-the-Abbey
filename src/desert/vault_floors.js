/* ==========================================================================
   THE PLANS OF THE FLOORS (prefix vtp). Each plan: size, the rooms (rectangles x0,y0,x1,y1), the doors, the look, the names of the places for the map, and a dress function that furnishes it.
   Coordinates are squares, x across and y down. The marks used in the pieces: npc ids 'vto_...' are talked to in vault_story.js (i is the number of the page, bell, coffin, sign and so on).
   ========================================================================== */
const vtDown=(to)=>()=>{vtMake(to);return LEVELS[to].start};          // the way down arrives at the start of the next floor
const vtUp=(from)=>()=>{vtMake(from);return LEVELS[from]._vt.downAt};  // the way up arrives beside the stair down of the floor above
const P_BRAZ=['hl_p_candle'];
/* ===== 9671 THE BARROW STAIR: the way in, the Hall of Guards, the Warden's Hall and the first pale-silver lock ===== */
VT_SPEC[9671]={W:29,H:29,diff:88,brick:'texGrey',rgb:[.95,.97,1.03],lcol:[1.5,.95,.55],torch:{fl:0,col:[1.5,.9,.45],name:'orange',css:'#e8923a'},fgain:.52,
  rects:[[11,2,17,5],[13,6,15,8],[5,9,23,15],[4,12,4,12],[1,9,3,15],[24,12,24,12],[25,9,27,15],[13,16,15,18],[8,19,20,24],[14,26,14,27]],
  doors:[{x:14,y:1,kind:'stair',to:VT.ID,at:()=>VT.hillBack,start:true},{x:14,y:25,kind:'lock',lock:'L1'},{x:14,y:28,kind:'stair',to:9672,at:vtDown(9672),down:true}],
  names:[{t:'The Vestibule',x:14,y:3,k:'place'},{t:'The Hall of Guards',x:14,y:12,k:'place'},{t:'The Cells',x:2,y:12,k:'place'},{t:"The Scribe's Alcove",x:26,y:12,k:'place'},{t:"The Warden's Hall",x:14,y:21,k:'place'},{t:'The First Lock',x:14,y:25,k:'place'}],
  dress(C){const {dec,sign,foe,light,trap}=C;
    sign(12,2,[0,-1],'THE VAULT OF MALDRAKE','Barrows of Underhill');sign(16,2,[0,-1],'CLOSED BY THE GARRISON','Do not go down alone');
    dec('candles',11,5,{block:true,sc:.8});dec('candles',17,5,{block:true,sc:.8});light(14,3,[1.5,1,.6]);
    dec('bones',12,4,{sc:.7});dec('web',11,2,{sc:.5});dec('web',17,2,{sc:.5});
    // the Hall of Guards: sarcophagi down both sides, candles, cobwebs
    let n=0;for(const x of [7,10,18,21])for(const y of [9,15])dec('sarc',x,y,{block:true,npc:'vto_sarc',i:n++});
    dec('candles',6,12,{block:true,sc:.8});dec('candles',22,12,{block:true,sc:.8});
    for(const [x,y] of [[9,12],[14,11],[19,12],[14,14]])light(x,y,[1.45,.9,.55]);
    for(const [x,y] of [[5,9],[23,9],[5,15],[23,15],[12,9],[16,15]])dec('web',x,y,{sc:.55});
    for(const [x,y] of [[8,13],[15,10],[20,14]])dec('bones',x,y,{sc:.8});
    sign(8,9,[0,-1],'THE HALL OF GUARDS','They have kept watch a long time');
    trap('ambush',14,12,{spawn:['gyskel','gypike']});
    // the cells: the garrison's one survivor
    for(const [x,y] of [[1,10],[3,10],[1,14],[3,14]])dec('hl_p_cage',x,y,{block:true,npc:'vto_cage',sc:.9,raw:true});
    dec('bones',1,12,{sc:.8});dec('bones',3,13,{sc:.7});light(2,12,[1.45,.95,.6]);
    {const kp=KH_KEEPERS.vto_fenn;if(kp){const d=dec(khFaceKey(kp.face),2,12,{block:false,npc:'vto_fenn',raw:true});if(d)d.sc=kp.sc||1}}
    // the Scribe's Alcove: the first page of the journal, a chest, a shelf
    dec('hl_p_lectern',26,10,{block:true,npc:'vto_book',i:1,raw:true,sc:.9});dec('hl_p_shelf',26,13,{block:true,npc:'vto_shelf',raw:true,sc:1});dec('chest',27,14,{block:true});light(26,12,[1.4,.95,.6]);
    dec('bones',25,15,{sc:.8});dec('candles',25,9,{block:true,sc:.7});
    // the way to the Warden: two spike plates in a passage of three, hidden warnings, then the Warden's Hall
    trap('spike',13,17);trap('spike',15,17);light(14,17,[1.4,.9,.55]);C.setF(13,17,13,17,'4');C.setF(15,17,15,17,'4');
    sign(14,16,[0,-1],'MIND THE FLOOR','The middle is the way');
    dec('candles',8,19,{block:true,sc:.8});dec('candles',20,19,{block:true,sc:.8});dec('candles',8,24,{block:true,sc:.8});dec('candles',20,24,{block:true,sc:.8});
    for(const [x,y] of [[8,21],[8,22],[20,21],[20,22]])dec('sarc',x,y,{block:true,npc:'vto_sarc',i:n++});
    for(const [x,y] of [[14,20],[10,23],[18,23],[14,24],[14,26]])light(x,y,[1.5,.95,.55]);
    foe('vtwarden',14,22);foe('gypike',11,22);foe('gypike',17,22);
    // the dead of the hall
    for(const [t,x,y] of [['gyskel',8,10],['gyskel',12,10],['gyskel',16,10],['gyskel',20,11],['gyskel',11,14],['gyskel',17,14],['gypike',9,13],['gypike',19,13],['gybmage',14,15]])foe(t,x,y);
    foe('gyghoul',26,11);foe('gyghoul',26,15);foe('gyskel',2,10)||0;
    C.setF(8,19,20,24,'3')}};
/* ===== 9672 THE OSSUARY OF THE ROLL: the Roll of Underhill and the ring of eight coffins ===== */
const VT_RING={names:[['PIERS COBB','45, smith'],['EDDA MARL','9, the miller\'s daughter'],['NAN PELTER','40, midwife'],['BROTHER ALDER','52, priest of Underhill'],['OLD JOSS THATCHER','74'],['NELL BRIGHT','19, shepherdess'],['WAT BRAMBLE','33, ferryman'],['DAME ORLA FENN','68, widow']],
  pos:[[15,15],[19,16],[21,19],[19,22],[15,23],[11,22],[9,19],[11,16]],order:[1,4,2,6,7,0,5,3]};   // the order of death is the order to open them: Edda, Joss, Nan, Wat, Orla, Piers, Nell, Brother Alder
VT_SPEC[9672]={W:31,H:32,diff:88,brick:'texBone',lcol:[1.35,1.2,.62],torch:{fl:4,col:[1.45,1.25,.4],name:'yellow',css:'#f2d23c'},fgain:.6,wall:.9,ftint:[.95,.95,.98],
  rects:[[13,2,17,3],[14,4,16,4],[10,5,20,9],[8,7,9,7],[2,5,7,9],[21,7,22,7],[23,5,28,9],[15,10,15,12],[7,13,23,25],[15,27,15,29]],
  doors:[{x:15,y:1,kind:'stair',to:9671,at:vtUp(9671),start:true},{x:15,y:26,kind:'ringgate'},{x:15,y:30,kind:'stair',to:9673,at:vtDown(9673),down:true}],
  names:[{t:'The Vestibule',x:15,y:3,k:'place'},{t:'The Reading Room',x:15,y:7,k:'place'},{t:"The Gravedigger's Rest",x:4,y:7,k:'place'},{t:'The Cold Store',x:26,y:7,k:'place'},{t:'The Ring of Coffins',x:15,y:19,k:'place'},{t:'The Coffin Gate',x:15,y:26,k:'place'}],
  dress(C){const {dec,sign,foe,light,trap}=C;
    sign(14,2,[0,-1],'THE OSSUARY OF THE ROLL','Read the Roll before you open a lid');dec('candles',13,3,{block:true,sc:.75});dec('candles',17,3,{block:true,sc:.75});light(15,3,[1.35,1.2,.6]);
    // the Reading Room
    dec('hl_p_lectern',15,6,{block:true,npc:'vto_book',i:0,raw:true,sc:.9});dec('candles',11,5,{block:true,sc:.8});dec('candles',19,5,{block:true,sc:.8});
    let n=0;for(const [x,y] of [[11,9],[13,9],[17,9],[19,9]])dec('sarc',x,y,{block:true,npc:'vto_sarc',i:n++});
    for(const [x,y] of [[12,7],[18,7],[15,8]])light(x,y,[1.35,1.2,.6]);for(const [x,y] of [[10,5],[20,9],[10,9]])dec('web',x,y,{sc:.55});
    foe('gyskel',12,6);foe('gyskel',18,6);foe('gyghoul',15,8);
    // the Gravedigger's Rest: a chest guarded by two plates, a tally on the desk
    dec('hl_p_desk',3,5,{block:true,npc:'vto_book',i:2,raw:true,sc:.9});dec('chest',4,9,{block:true});trap('spike',4,8);trap('spike',3,9);C.setF(4,8,4,8,'4');C.setF(3,9,3,9,'4');
    dec('bones',6,6,{sc:.8});dec('bones',2,8,{sc:.8});dec('hl_p_candle',7,5,{block:true,sc:.6,raw:true});light(4,7,[1.35,1.15,.6]);
    sign(5,5,[0,-1],"THE GRAVEDIGGER'S REST","Tally of the dead, in his own hand");
    foe('gyzombie',5,7);foe('gyzombie',3,7);
    // the Cold Store: biers and a chest
    for(const [x,y] of [[24,6],[26,6],[24,8],[26,8]])dec('sarc',x,y,{block:true,npc:'vto_sarc',i:n++});dec('chest',28,5,{block:true});light(26,7,[1.35,1.2,.6]);dec('web',23,5,{sc:.55});dec('bones',28,9,{sc:.8});
    foe('gyghoul',25,7);foe('gyghoul',27,7);foe('gybmage',27,9);
    // the corridor and the Ring of Coffins
    light(15,11,[1.35,1.2,.6]);sign(14,13,[0,-1],'THE RING','Eight lids, one order');
    VT_RING.pos.forEach(([x,y],i)=>dec('hl_p_coffin',x,y,{block:true,npc:'vto_coffin',i,raw:true,sc:.95}));
    dec('rune',15,19,{block:true,npc:'vto_rune',raw:true,sc:1.0});
    for(const [x,y] of [[13,13],[17,13],[9,14],[21,14],[9,24],[21,24],[13,24],[17,24]])dec('candles',x,y,{block:true,sc:.75});
    for(const [x,y] of [[15,17],[13,19],[17,19],[15,21],[10,15],[20,15],[10,23],[20,23],[12,18],[18,18]])light(x,y,[.75,1.1,1.5]);
    for(const [x,y] of [[7,13],[23,13],[7,25],[23,25]])dec('web',x,y,{sc:.6});
    foe('gyskel',9,17);foe('gyskel',21,21);foe('gyghoul',12,20);foe('gyskel',18,14);
    C.setF(7,13,23,25,'3');C.setF(14,18,16,20,'2');
    light(15,27,[.75,1.1,1.5]);light(15,29,[.75,1.1,1.5])}};
/* ===== 9673 THE BELL GALLERY: five bells hang along the north wall; the peal of Underhill opens the second lock ===== */
const VT_BELLS={names:['The Miller\'s Bell','The Great Bell','The Child\'s Bell','The Priest\'s Bell','The Widow\'s Bell'],sub:['Cast for the mill, the deepest of the five','Cast last, and never rung alone','Cast for the youngest of the parish','Cast for the one who buried the rest','Cast for the ones who stayed behind'],
  xs:[7,12,17,22,27],order:[2,4,0,3,1],freq:[196,110,392,262,329]};   // the child, the widow, the miller, the priest, then the Great Bell
VT_SPEC[9673]={W:33,H:26,diff:88,brick:'texBlack',lcol:[.5,.8,1.5],torch:{fl:3,col:[.45,.8,1.7],name:'blue',css:'#4f9cff'},fgain:.55,ftint:[.85,.92,1.1],ceil:'gyc_2',
  rects:[[14,2,18,4],[15,5,17,5],[3,6,29,13],[15,14,17,15],[12,16,20,19],[16,21,16,23],[6,14,6,15],[2,16,10,22],[26,14,26,15],[24,16,30,22]],
  doors:[{x:16,y:1,kind:'stair',to:9672,at:vtUp(9672),start:true},{x:16,y:20,kind:'lock',lock:'L2'},{x:16,y:24,kind:'stair',to:9674,at:vtDown(9674),down:true}],
  names:[{t:'The Vestibule',x:16,y:3,k:'place'},{t:'The Bell Gallery',x:16,y:9,k:'place'},{t:"The Ringers' Room",x:6,y:19,k:'place'},{t:"The Founder's Loft",x:27,y:19,k:'place'},{t:"The Founder's Landing",x:16,y:17,k:'place'},{t:'The Second Lock',x:16,y:20,k:'place'}],
  dress(C){const {dec,sign,foe,light,trap}=C;
    sign(15,2,[0,-1],'THE BELL GALLERY','Five bells. One peal.');dec('candles',14,4,{block:true,sc:.75});dec('candles',18,4,{block:true,sc:.75});light(16,3,[.55,.85,1.5]);
    // the five bells, with the plate of each hung beside it on the wall
    VT_BELLS.xs.forEach((x,i)=>{const big=i===1;dec(big?'wm_bell':'bell',x,6,{block:true,npc:'vto_bell',i,raw:true,sc:big?1.5:[2.4,0,1.7,2.1,2.0][i]});sign(x,6,[0,-1],VT_BELLS.names[i].toUpperCase(),VT_BELLS.sub[i])});
    for(const x of [9,14,19,24])dec('column',x,9,{block:true,sc:.75});
    for(const [x,y] of [[3,6],[29,6],[3,13],[29,13]])dec('candles',x,y,{block:true,sc:.8});
    for(const [x,y] of [[6,8],[12,8],[17,8],[22,8],[27,8],[8,12],[16,12],[24,12]])light(x,y,[.5,.85,1.5]);
    for(const [x,y] of [[4,7],[28,7],[10,13],[20,13]])dec('web',x,y,{sc:.55});for(const [x,y] of [[5,11],[26,11],[14,12]])dec('bones',x,y,{sc:.8});
    trap('ambush',16,11,{spawn:['gyshade','gywraith']});
    // the Ringers' Room: the third page, a chest, plates
    dec('hl_p_lectern',3,17,{block:true,npc:'vto_book',i:3,raw:true,sc:.9});dec('chest',9,21,{block:true});dec('sacks',9,17,{block:false,sc:.8,raw:true});dec('sacks',2,21,{block:false,sc:.8,raw:true});
    trap('spike',8,21);trap('spike',9,20);C.setF(8,21,8,21,'4');C.setF(9,20,9,20,'4');light(6,19,[.5,.85,1.5]);
    sign(5,16,[0,-1],"THE RINGERS' ROOM",'Ropes, a ledger, a bench');dec('hl_p_candle',5,22,{block:true,sc:.6,raw:true});
    // the Founder's Loft
    dec('hl_p_desk',29,17,{block:true,npc:'vto_book',i:21,raw:true,sc:.9});dec('chest',29,21,{block:true});dec('sacks',25,21,{sc:.8,raw:true});light(27,19,[.5,.85,1.5]);
    sign(27,16,[0,-1],"THE FOUNDER'S LOFT",'Where the bells were cast');dec('bones',25,17,{sc:.8});
    // the landing and the lock
    for(const [x,y] of [[12,16],[20,16]])dec('candles',x,y,{block:true,sc:.75});trap('spike',14,18);trap('spike',18,17);C.setF(14,18,14,18,'4');C.setF(18,17,18,17,'4');light(16,17,[.55,.85,1.5]);light(16,22,[.55,.85,1.5]);
    sign(16,16,[0,-1],'THE SECOND LOCK','The peal opens it');
    // the dead of the gallery
    for(const [t,x,y] of [['gywraith',6,10],['gywraith',16,8],['gywraith',26,10],['gyshade',10,11],['gyshade',22,11],['gyshade',14,7],['gybanshee',20,9],['gybanshee',8,8],['gyshade',5,19],['gyshade',8,18],['gywraith',27,18],['gybanshee',28,20],['gywraith',14,17],['gywraith',18,19]])foe(t,x,y);
    C.setF(3,6,29,13,'3')}};
/* ===== 9674 THE SILVERED CELLARS: where the Sovereign's silver was kept; three rooms each guard a sigil; the third lock wants all three ===== */
VT_SPEC[9674]={W:35,H:30,diff:89,brick:'texGrey',rgb:[.9,1,1.22],lcol:[.78,.72,1.45],torch:{fl:2,col:[.56,.36,.74],name:'purple',css:'#b06cf0'},fgain:.58,ftint:[.9,.9,1.12],ceil:'gyc_1',
  rects:[[15,2,19,4],[17,5,17,7],[12,8,22,16],[8,12,11,12],[1,8,7,16],[23,12,26,12],[27,8,33,16],[13,17,13,21],[2,22,14,28],[21,18,21,25]],
  doors:[{x:17,y:1,kind:'stair',to:9673,at:vtUp(9673),start:true},{x:21,y:17,kind:'lock',lock:'L3'},{x:21,y:26,kind:'stair',to:9675,at:vtDown(9675),down:true}],
  names:[{t:'The Vestibule',x:17,y:3,k:'place'},{t:'The Counting Hall',x:17,y:12,k:'place'},{t:'The Room of Needles',x:4,y:12,k:'place'},{t:"The Hounds' Den",x:30,y:12,k:'place'},{t:'The Silvered Hall',x:8,y:25,k:'place'},{t:'The Third Lock',x:21,y:17,k:'place'}],
  dress(C){const {dec,sign,foe,light,trap}=C;
    sign(16,2,[0,-1],'THE SILVERED CELLARS','Counted, weighed and paid out');dec('candles',15,4,{block:true,sc:.75});dec('candles',19,4,{block:true,sc:.75});light(17,3,[.8,.75,1.5]);
    // the Counting Hall
    dec('hl_p_desk',21,9,{block:true,npc:'vto_book',i:4,raw:true,sc:.95});dec('hl_p_desk',13,9,{block:true,npc:'vto_desk',raw:true,sc:.95});
    for(const [x,y] of [[12,8],[22,8],[12,16],[22,16]])dec('candles',x,y,{block:true,sc:.8});
    for(const [x,y] of [[15,10],[19,10],[15,14],[19,14],[17,12]])light(x,y,[.8,.75,1.5]);for(const [x,y] of [[13,13],[20,15],[16,16]])dec('bones',x,y,{sc:.8});dec('web',12,10,{sc:.55});dec('web',22,14,{sc:.55});
    sign(16,8,[0,-1],'THE COUNTING HALL','All silver in, all silver out');
    for(const [t,x,y] of [['gywraith',15,11],['gywraith',19,13],['gywraith',17,15],['gyhound',14,14],['gyhound',20,10]])foe(t,x,y);
    // A: the Room of Needles. A field of spike plates, one lane between them, and the first sigil on an altar at the far end.
    {const lane=new Set(['7,12','6,12','5,12','5,13','4,13','3,13','3,12','2,12']);
     for(let y=8;y<=16;y++)for(let x=2;x<=7;x++){if(lane.has(x+','+y))continue;trap('spike',x,y);C.setF(x,y,x,y,'4')}
     dec('altar',1,12,{block:true,npc:'vto_sigilaltar',i:0,raw:true,sc:.9});dec('candles',1,10,{block:true,sc:.8});dec('candles',1,14,{block:true,sc:.8});for(const [x,y] of [[4,12],[6,13],[3,10],[5,15]])light(x,y,[.8,.75,1.5]);
     sign(7,10,[0,-1],'THE ROOM OF NEEDLES','Walk where the floor is plain')}
    // B: the Hounds' Den
    dec('altar',33,12,{block:true,npc:'vto_sigilaltar',i:1,raw:true,sc:.9});
    for(const [x,y] of [[28,9],[32,9],[29,15],[32,15],[30,12]])dec('bones',x,y,{sc:1});for(const [x,y] of [[29,11],[31,13],[28,14]])dec('web',x,y,{sc:.55});for(const [x,y] of [[29,12],[32,12],[30,9],[30,15]])light(x,y,[.8,.75,1.5]);
    trap('ambush',30,12,{spawn:['gyhound','gyhound']});foe('gyhound',29,10);foe('gyhound',32,14);foe('gyhound',30,14);foe('gyghoul',28,11);
    sign(28,8,[0,-1],"THE HOUNDS' DEN",'Feed them or fight them');
    // C: the Silvered Hall
    dec('altar',3,28,{block:true,npc:'vto_sigilaltar',i:2,raw:true,sc:.9});dec('chest',14,28,{block:true});dec('chest',14,22,{block:true});
    for(const [x,y] of [[3,22],[8,22],[12,22],[3,26],[13,26]])dec('candles',x,y,{block:true,sc:.8});for(const [x,y] of [[5,24],[9,25],[12,24],[4,27],[9,27]])light(x,y,[.8,.75,1.5]);
    for(const [x,y] of [[6,22],[11,28]])dec('sarc',x,y,{block:true,npc:'vto_sarc',i:50+x});
    foe('gygiant',8,24);foe('gygiant',11,26);foe('gypike',6,26);foe('gypike',10,23);foe('gybmage',5,25);foe('gyzombie',12,25);
    sign(13,21,[0,-1],'THE SILVERED HALL','Where the silver slept');
    // the passage to the lock and the stair
    light(13,19,[.8,.75,1.5]);light(21,20,[.8,.75,1.5]);light(21,23,[.8,.75,1.5]);sign(20,16,[0,1],'THE THIRD LOCK','Three seats, three sigils');
    C.setF(12,8,22,16,'3')}};
/* ===== 9675 THE HALL OF UNDERHILL: the village sits down to supper; the old study and the red-eyed book ===== */
VT_SPEC[9675]={W:37,H:28,diff:89,brick:'texRed',lcol:[1.5,.8,.48],torch:{fl:0,col:[1.5,.8,.4],name:'orange',css:'#e0803a'},fgain:.5,ftint:[1,.92,.9],ceil:'gyc_0',wall:.88,
  rects:[[16,2,20,4],[17,5,19,5],[5,6,31,17],[9,18,10,18],[5,19,14,25],[17,18,19,18],[18,19,18,23],[27,18,28,18],[24,19,33,25],[35,22,35,22]],
  doors:[{x:18,y:1,kind:'stair',to:9674,at:vtUp(9674),start:true},{x:18,y:24,kind:'stair',to:9676,at:vtDown(9676),down:true},{x:34,y:22,kind:'secret',v:2},{x:36,y:22,kind:'stair',to:9678,at:vtDown(9678),secretStair:true}],
  names:[{t:'The Vestibule',x:18,y:3,k:'place'},{t:'The Hall of Underhill',x:18,y:11,k:'place'},{t:'The Chapel',x:9,y:22,k:'place'},{t:"Maldrake's Old Study",x:28,y:22,k:'place'}],
  dress(C){const {dec,sign,foe,light,trap}=C;
    sign(17,2,[0,-1],'THE HALL OF UNDERHILL','Where the village sat down to supper');dec('candles',16,4,{block:true,sc:.75});dec('candles',20,4,{block:true,sc:.75});light(18,3,[1.5,.85,.5]);
    // the long tables, and the dead of Underhill still sitting at them
    const T=[10,14,18,22,26];for(const x of T){dec('hl_p_candle',x,8,{block:true,sc:.65,raw:true});dec('hl_p_candle',x,15,{block:true,sc:.65,raw:true})}
    let v=0;for(const x of [8,12,16,20,24,28]){dec('zombie',x,8,{block:true,npc:'vto_villager',i:v++,sc:.95,raw:true});dec('zombie',x,15,{block:true,npc:'vto_villager',i:v++,sc:.95,raw:true})}
    for(const [x,y] of [[6,7],[30,7],[6,16],[30,16]])dec('candles',x,y,{block:true,sc:.8});
    for(const [x,y] of [[8,10],[14,11],[20,11],[26,10],[8,13],[14,13],[20,13],[26,13],[31,11]])light(x,y,[1.5,.85,.5]);for(const [x,y] of [[5,6],[31,6],[5,17],[31,17],[18,9]])dec('web',x,y,{sc:.55});
    for(const [x,y] of [[11,12],[24,12]])dec('bones',x,y,{sc:.9});
    sign(13,6,[0,-1],'SUPPER AT SEVEN','Chalked on the wall, in a child\'s hand');
    for(const [t,x,y] of [['gyzombie',10,11],['gyzombie',16,12],['gyzombie',22,11],['gyzombie',28,12],['gyzombie',12,13],['gyzombie',26,11],['gygiant',18,12],['gygiant',24,13],['gyghoul',7,12],['gyghoul',30,12],['gyghoul',20,9]])foe(t,x,y);
    trap('ambush',18,11,{spawn:['gyzombie','gyghoul']});
    // the chapel
    dec('altar',9,20,{block:true,npc:'vto_altar',raw:true,sc:.85});dec('candles',7,20,{block:true,sc:.8});dec('candles',11,20,{block:true,sc:.8});
    for(const [x,y] of [[6,23],[8,23],[10,23],[12,23]])dec('bench',x,y,{sc:.8,raw:true});for(const [x,y] of [[6,22],[12,22],[8,25],[11,25]])light(x,y,[1.5,.85,.5]);dec('ccross',13,19,{block:true,sc:.7});
    sign(6,19,[0,-1],'THE CHAPEL OF UNDERHILL','Brother Alder preached here, to the last');
    foe('gyskel',7,22);foe('gyskel',12,24);foe('gybmage',9,24);foe('gypike',6,24);
    // the old study: the fifth page, a chest, and the book with the red eye
    dec('hl_p_lectern',31,20,{block:true,npc:'vto_book',i:5,raw:true,sc:.9});dec('hl_p_desk',27,20,{block:true,npc:'vto_desk',raw:true,sc:.95});dec('chest',32,24,{block:true});
    dec('hl_p_shelf',33,20,{block:true,npc:'vto_shelf1',raw:true,sc:1});dec('hl_p_shelf',33,24,{block:true,npc:'vto_shelf',raw:true,sc:1});dec('candles',25,19,{block:true,sc:.75});dec('hl_p_candle',25,25,{block:true,sc:.6,raw:true});
    for(const [x,y] of [[26,22],[30,22],[29,24],[24,22]])light(x,y,[1.4,.85,.5]);sign(28,19,[0,-1],"MALDRAKE'S OLD STUDY",'Private. Knock.');dec('web',24,25,{sc:.55});
    foe('gywraith',27,23);foe('gywraith',30,21);
    // the passage down
    light(18,21,[1.5,.85,.5]);light(18,18,[1.5,.85,.5]);light(35,22,[.8,.9,1.5]);
    C.setF(5,6,31,17,'3')}};
/* ===== 9676 THE STAIR OF QUIET: the last approach; the Hall of Plates; the Silver Warden and the lock of the Sanctum ===== */
VT_SPEC[9676]={W:29,H:36,diff:89,brick:'texBlack',rgb:[.95,.92,1.1],lcol:[.7,.55,1.25],torch:{fl:2,col:[.56,.36,.74],name:'purple',css:'#b06cf0'},fgain:.52,ftint:[.9,.88,1.1],ceil:'gyc_2',
  rects:[[12,2,16,4],[13,5,15,5],[9,6,19,13],[13,14,15,16],[5,17,23,24],[4,20,4,20],[1,18,3,22],[24,20,24,20],[25,18,27,22],[13,25,15,26],[8,27,20,32],[14,34,14,34]],
  doors:[{x:14,y:1,kind:'stair',to:9675,at:vtUp(9675),start:true},{x:14,y:33,kind:'lock',lock:'L4'},{x:14,y:35,kind:'stair',to:9677,at:vtDown(9677),down:true}],
  names:[{t:'The Vestibule',x:14,y:3,k:'place'},{t:'The Stair of Quiet',x:14,y:9,k:'place'},{t:'The Hall of Plates',x:14,y:20,k:'place'},{t:'The Western Vault',x:2,y:20,k:'place'},{t:'The Eastern Vault',x:26,y:20,k:'place'},{t:"The Silver Warden's Landing",x:14,y:29,k:'place'},{t:"The Sanctum Lock",x:14,y:33,k:'place'}],
  dress(C){const {dec,sign,foe,light,trap}=C;
    sign(13,2,[0,-1],'THE STAIR OF QUIET','Walk softly. He sleeps badly.');dec('candles',12,4,{block:true,sc:.75});dec('candles',16,4,{block:true,sc:.75});light(14,3,[.7,.55,1.3]);
    // the stair hall: statues of the dead of Underhill, and the sixth page
    for(const [x,y] of [[10,7],[18,7],[10,12],[18,12]])dec('angel',x,y,{block:true,sc:.85});for(const [x,y] of [[12,6],[16,6]])dec('column',x,y,{block:true,sc:.7});
    dec('hl_p_lectern',14,7,{block:true,npc:'vto_book',i:6,raw:true,sc:.9});for(const [x,y] of [[12,9],[16,9],[14,11],[11,9],[17,9]])light(x,y,[.7,.55,1.3]);for(const [x,y] of [[9,6],[19,13],[9,13]])dec('web',x,y,{sc:.55});
    sign(10,6,[0,-1],'THE STAIR OF QUIET','Eighty-one steps. One for each of them.');
    foe('gygiant',12,10);foe('gygiant',16,10);foe('gybmage',11,8);foe('gybmage',17,8);trap('ambush',14,9,{spawn:['gywraith','gywraith']});
    // the Hall of Plates: rows of plates, lanes between them
    {const lanes=new Set();for(let y=17;y<=24;y++){lanes.add('14,'+y);lanes.add('6,'+y);lanes.add('22,'+y)}for(let x=5;x<=23;x++){lanes.add(x+',17');lanes.add(x+',24');lanes.add(x+',20')}
     for(let y=18;y<=23;y++)for(let x=7;x<=21;x++){if(lanes.has(x+','+y)||(x>=13&&x<=15))continue;if((x*3+y)%4===0){trap('spike',x,y);C.setF(x,y,x,y,'4')}}}
    for(const [x,y] of [[5,17],[23,17],[5,24],[23,24]])dec('candles',x,y,{block:true,sc:.8});for(const [x,y] of [[8,19],[14,19],[20,19],[8,22],[14,22],[20,22]])light(x,y,[.7,.55,1.3]);
    for(const [x,y] of [[10,24],[18,17]])dec('bones',x,y,{sc:.9});sign(9,17,[0,-1],'THE HALL OF PLATES','Where the floor is plain, it is kind');
    for(const [t,x,y] of [['gywraith',8,18],['gywraith',20,23],['gywraith',14,21],['gygiant',10,21],['gygiant',18,20],['gyzombie',6,23],['gyzombie',22,18],['gybmage',14,18]])foe(t,x,y);trap('ambush',14,24,{spawn:['gyskel','gypike']});
    // the two vaults
    dec('chest',1,22,{block:true});dec('sarc',2,18,{block:true,npc:'vto_sarc',i:60});dec('sarc',2,20,{block:true,npc:'vto_sarc',i:61});light(2,20,[.7,.55,1.3]);dec('candles',3,22,{block:true,sc:.75});foe('gywraith',3,19);
    dec('chest',27,22,{block:true});dec('sarc',26,18,{block:true,npc:'vto_sarc',i:62});dec('sarc',26,20,{block:true,npc:'vto_sarc',i:63});light(26,20,[.7,.55,1.3]);dec('candles',25,22,{block:true,sc:.75});foe('gywraith',25,19);
    sign(2,17,[0,-1],'THE WESTERN VAULT','');sign(26,17,[0,-1],'THE EASTERN VAULT','');
    // the Landing
    for(const [x,y] of [[8,27],[20,27],[8,32],[20,32]])dec('candles',x,y,{block:true,sc:.85});for(const [x,y] of [[14,28],[10,30],[18,30],[14,32],[14,34],[14,26]])light(x,y,[.8,.6,1.4]);
    for(const [x,y] of [[8,29],[20,29]])dec('angel',x,y,{block:true,sc:.9});sign(13,27,[0,-1],"THE SILVER WARDEN'S LANDING",'He keeps the last seal');
    foe('vtsilver',14,30);foe('gypike',11,30);foe('gypike',17,30);foe('gybmage',14,28);
    C.setF(5,17,23,24,'3')}};
/* ===== 9677 MALDRAKE'S SANCTUM ===== */
VT_SPEC[9677]={W:25,H:24,diff:89,brick:'texBlack',rgb:[.92,.9,1.12],lcol:[.85,.9,1.5],torch:{fl:3,col:[.45,.8,1.7],name:'blue',css:'#4f9cff'},fgain:.5,ftint:[.9,.9,1.15],ceil:'gyc_2',niches:6,lampGap:6,
  rects:[[9,2,15,4],[4,5,20,18],[11,19,13,20]],
  doors:[{x:12,y:21,kind:'stair',to:9676,at:vtUp(9676),start:true}],
  names:[{t:"Maldrake's Table",x:12,y:4,k:'place'},{t:'The Candles of Underhill',x:12,y:11,k:'place'},{t:'The Stair',x:12,y:20,k:'place'}],
  dress(C){const {dec,sign,foe,light,trap}=C;
    dec('hl_p_desk',12,4,{block:true,npc:'vto_desk2',raw:true,sc:1.05});dec('hl_p_mirror',9,3,{block:true,npc:'vto_mirror',raw:true,sc:1});dec('hl_p_mirror',15,3,{block:true,npc:'vto_mirror',raw:true,sc:1});
    dec('candles',10,2,{block:true,sc:.9});dec('candles',14,2,{block:true,sc:.9});light(12,3,[.9,.95,1.5]);light(10,3,[.85,.9,1.5]);light(14,3,[.85,.9,1.5]);
    // the memorial: twelve candles for the twelve households, in two rows, each with a small stone
    [[6,8],[8,8],[10,8],[14,8],[16,8],[18,8],[6,14],[8,14],[10,14],[14,14],[16,14],[18,14]].forEach(([x,y],i)=>{dec('candles',x,y,{block:true,sc:.5,npc:'vto_memorial',i,raw:true});light(x,y,[.95,.9,1.4])});
    for(const [x,y] of [[5,6],[19,6],[5,17],[19,17]])dec('column',x,y,{block:true,sc:.75});for(const [x,y] of [[6,11],[18,11],[12,16]])dec('rose',x,y,{sc:.8,raw:true});
    for(const [x,y] of [[12,9],[12,13],[7,11],[17,11]])light(x,y,[.85,.9,1.5]);
    sign(6,18,[0,1],'UNDERHILL','Twelve households. Eighty-one souls.');
    // the one who waits
    {const kp=KH_KEEPERS.vto_maldrake;if(kp){const d=dec('vti_maldrake',12,7,{block:false,npc:'vto_maldrake',raw:true});if(d){d.sc=1.05;d.k=khFaceKey('vti_maldrake')}}}
    C.setF(4,5,20,18,'3')}};
/* ===== 9678 THE SECRET ARCHIVE ===== */
VT_SPEC[9678]={W:21,H:18,diff:89,brick:'texBone',rgb:[1.05,1,.9],lcol:[1.4,1.05,.62],torch:{fl:0,col:[1.5,.9,.45],name:'orange',css:'#e8923a'},fgain:.58,ftint:[1,.96,.9],ceil:'gyc_3',niches:4,lampGap:5,
  rects:[[2,2,18,14]],
  doors:[{x:10,y:15,kind:'stair',to:9675,at:()=>{vtMake(9675);const V=LEVELS[9675]._vt;return {x:35,y:22,f:3}},start:true}],
  names:[{t:'The Secret Archive',x:10,y:8,k:'place'},{t:"Maldrake's Desk",x:10,y:4,k:'place'}],
  dress(C){const {dec,sign,foe,light,trap}=C;
    for(const x of [3,5,7,13,15,17])dec('hl_p_shelf',x,2,{block:true,npc:'vto_shelf',raw:true,sc:1});dec('hl_p_shelf',2,6,{block:true,npc:'vto_shelf',raw:true,sc:1});dec('hl_p_shelf',2,9,{block:true,npc:'vto_shelf',raw:true,sc:1});dec('hl_p_shelf',18,6,{block:true,npc:'vto_shelf',raw:true,sc:1});dec('hl_p_shelf',18,9,{block:true,npc:'vto_shelf',raw:true,sc:1});
    dec('hl_p_desk',10,4,{block:true,npc:'vto_contractdesk',raw:true,sc:1.05});dec('hl_p_lectern',14,5,{block:true,npc:'vto_book',i:7,raw:true,sc:.9});dec('chest',17,13,{block:true,goldAmt:9000});dec('chest',3,13,{block:true});
    for(const [x,y] of [[8,4],[12,4],[6,11],[14,11]])dec('candles',x,y,{block:true,sc:.75});for(const [x,y] of [[10,6],[6,8],[14,8],[10,12],[4,4],[16,4]])light(x,y,[1.4,1.05,.62]);
    {const kp=KH_KEEPERS.vto_hesper;if(kp){const d=dec(khFaceKey(kp.face),10,9,{block:false,npc:'vto_hesper',raw:true});if(d)d.sc=kp.sc||1}}
    sign(9,2,[0,-1],'THE ARCHIVE','Nobody comes here. That is the idea.');dec('web',2,2,{sc:.6});dec('web',18,2,{sc:.6});dec('bones',16,12,{sc:.8});
    C.setF(2,2,18,14,'3')}};
