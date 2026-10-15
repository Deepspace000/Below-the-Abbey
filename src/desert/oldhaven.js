/* ==========================================================================
   OLDHAVEN, the city of King Osric. Reached from the quay (304) through a portcullis gate between two towers.
     305 Oldhaven (the city, 150 by 150)   306 The Court of King Osric   307 The King's Rest (inn)   308 Oldhaven Arms (smith)
     309 The Apothecary   310 The Chapel of Saint Brannoch   6000+ every other house and shop
   A grey stone castle city: a curtain wall with a gate between two towers, a great square before the castle, the king's road
   lined with soldiers, streets three houses apart with lanterns, and a door on every house.
   The end of this part of the story is in the court: the master ledger is read, the chancellor turns on the king, and the warrant is torn up.
   ========================================================================== */
for(const n of ['osric','vance','aldwyn','rguard'])loadImg('yar_p_'+n,'assets/yar_p_'+n+'.png');
Object.assign(NPC_H,{yar_p_osric:1,yar_p_vance:1,yar_p_aldwyn:1,yar_p_rguard:1});
Object.assign(ENEMY_DEF,{
  chancellor:{name:'Chancellor Vance',hp:300,dmg:[11,17],hit:.82,w:.5,img:'yar_p_vance',xp:1600,gold:[400,700],speed:1,verb:'strikes',aboveParty:3},
  rguard:{name:'Royal Guard',hp:120,dmg:[9,14],hit:.78,w:.55,img:'yar_p_rguard',xp:300,gold:[40,90],speed:1,verb:'cuts',aboveParty:1}
});
const OH={W:150,H:150,ID:305,COURT:306,ROOM:307,HOME:6000,CX:74};
vq('vq6','The Court of King Osric','King Osric','At noon the party is brought before King Osric with the master ledger. Make him read it.',1,khFlag('pardoned'),{gold:6000,xp:25000,items:['potion4']});

/* ---- the painted pieces: kh_ohprops1_N and friends, and how tall each stands ---- */
const OH_PROP={horse:['ohprops1_1',1.45],banner:['ohprops1_2',2.6],ballista:['ohprops1_4',1.05],rack:['ohprops1_5',1.05],balls:['ohprops1_6',.5],barrel:['ohprops1_7',.62],treb:['ohtreb1_0',2.3]};
function ohAlias(){for(const k in OH_PROP){const [n,h]=OH_PROP[k],im=IMG['kh_'+n];if(im){IMG['oh_'+k]=im;NPC_H['oh_'+k]=h}}}

/* ---- the stone: wall pictures stood up into tall tiles, a door or a window in each ---- */
function ohTiles(){
  const C={};
  const make=(kind,pat,wh,img)=>{
    const key=kind+'|'+pat+'|'+wh+'|'+(img||'');if(C[key])return C[key];
    const Hp=Math.round(128*wh),pi=IMG['kh_ohwall1_'+pat]||IMG.kh_ohwall1_0,units=Math.ceil(wh);
    const c=mkCanvas(128,Hp,(x,w,h)=>{
      x.fillStyle='#6e6e6e';x.fillRect(0,0,w,h);
      for(let u=0;u<units;u++){
        let im=pi;
        if(u===0&&kind==='door')im=IMG.kh_ohwall1_5;
        else if(u===0&&kind==='gate')im=IMG[img];
        else if(u===0&&kind==='shopfront')im=IMG.kh_ohwall1_4;
        else if(u===1&&(kind==='window'||kind==='shopfront'||kind==='door'))im=IMG.kh_ohwall1_4;
        else if(u===1&&kind==='slit')im=IMG.kh_ohwall1_3;
        else if(u===2&&kind==='window'&&wh>=2.9)im=IMG.kh_ohwall1_4;
        if(im)x.drawImage(im,0,0,im.width,im.height,0,h-(u+1)*128,128,128);
      }
    });
    const d=c.getContext('2d').getImageData(0,0,128,Hp).data,id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;
    const gid=KH_NEXT_GID++;T_TILE[gid]=id;
    return C[key]={gid,tex:id};
  };
  return {make};
}

/* ---- the people: soldiers, townsfolk and the court. Each stands for many of its kind in the streets. ---- */
const OH_FOLK=[
  {id:'oh_f_pike',n:'A halberdier',face:'kh_ohsold1_0',sc:1.08,lines:["Halt. No, I am joking. Move along, citizen. Slowly.","Forty paces from the gate to the square, and I have walked them nine thousand times. The cobbles are lying to me about the distance.","The halberd is heavier at the end of the day than at the start. Nobody tells you that.","Keep to the left of the king's road. The warhorses do not read signs."]},
  {id:'oh_f_xbow',n:'A crossbowman',face:'kh_ohsold1_1',sc:1.05,lines:["Do not stand in front of the wall at noon. We are testing the crossbows. Probably.","One bolt, one purpose, and a fortnight of sergeant's temper if I lose it.","I can hit a gull at forty paces. I have not. The sergeant says it is bad for morale, mostly the gull's.","Quiet street today. That is when I worry."]},
  {id:'oh_f_knight',n:'A knight of the Crown',face:'kh_ohsold1_2',sc:1.14,lines:["A knight of the Crown does not gossip. I will tell you only that the king is old and the chancellor is not.","My shield has a griffin on it. The griffin has seen more of Oldhaven than I have, and says nothing either.","Courtesy costs nothing. Say that to the sergeant who borrowed my second-best sword.","You carry yourselves like people who have been in a fight. Good. This city has forgotten how."]},
  {id:'oh_f_knight2',n:'A mace-bearing knight',face:'kh_ohsold1_3',sc:1.14,lines:["The red plume is for the Knights of the Gate. We stand where the arrows would come.","A mace does what a sword cannot, and does it without a speech.","If the warrant on your heads is true, you are very brave to walk here. If it is false, you are braver.","There is a feast in the keep tonight. I am on the door. There is always a feast, and I am always on the door."]},
  {id:'oh_f_banner',n:'A standard bearer',face:'kh_ohsold1_4',sc:1.12,lines:["The white sun on blue. Seven hundred years it has flown above this city, and I have to hold it up in a headwind.","They say the banner is lucky. I say it is long, and I am short.","Stand clear. If the wind turns, the standard will take your hat, and I will not be allowed to chase it."]},
  {id:'oh_f_herald',n:'A herald',face:'kh_ohsold1_5',sc:1.08,lines:["Hear ye! Well. Not you, specifically. But hear anyway.","I cry the hours, the proclamations and the prices of fish. In that order of dignity, and the reverse order of interest.","The court sits at noon, if the king is well, and the chancellor permits."]},
  {id:'oh_f_smith',n:'A blacksmith',face:'kh_ohfolk1_0',sc:1.05,lines:["Eleven hundred horseshoes since Michaelmas. The warhorses eat iron, I swear it.","A blade is only as good as the arm. And the quench. And the fire. And the temper of the smith.","If you need steel, the Oldhaven Arms has it, and the prices are not my fault."]},
  {id:'oh_f_baker',n:'A baker',face:'kh_ohfolk1_1',sc:1,lines:["Hot rolls, hot rolls! The garrison eats them by the sack, and still complains.","Fifty loaves for the castle every dawn, and the cook sends back three, with notes.","The bread of Oldhaven is round, honest and slightly burnt. Like the people."]},
  {id:'oh_f_noble',n:'A well-fed gentleman',face:'kh_ohfolk1_2',sc:1.04,lines:["The city is quite safe, I am told, though I find it impossible to be sure. I have hired another footman, to be certain.","I have a seat at the court, a house on the square and a cough. Only one of those is a nuisance.","Do you know the chancellor? Nor do I. That is how he likes it."]},
  {id:'oh_f_lady',n:'A lady of the court',face:'kh_ohfolk1_3',sc:1.06,lines:["How tiresome the soldiers are. How reassuring.","The queen wore green at Candlemas, and now every lady in the city has a green gown. I held out until Tuesday.","I do not interfere in matters of state. I merely listen very carefully at dinner."]},
  {id:'oh_f_monk',n:'A brother of the chapel',face:'kh_ohfolk1_4',sc:1,lines:["Peace be with you, and with your swords, when they are in their scabbards.","I am copying the psalter. I have reached the part about patience, which is convenient.","Saint Brannoch walked the roads and mended what he found. We keep his candles, and try to keep his habits."]},
  {id:'oh_f_boy',n:'A boy with a bucket',face:'kh_ohfolk1_5',sc:.78,lines:["I water the warhorses for a penny. They are very large. They do not bite. Much.","My father is a halberdier. I am going to be a knight, or a pie seller.","Is it true you came on a ship with a gull on the front?"]},
  {id:'oh_f_fishwife',n:'A fishwife',face:'kh_ohfolk2_0',sc:1,lines:["Herring, herring, fresh from the Dawn Walker's own quay! Well, near enough.","The soldiers never pay. The sergeant says it is a tax. I say it is a very poor sort of tax.","I smell of fish and I know everyone's business. Do not stand downwind of either."]},
  {id:'oh_f_friar',n:'A grey friar',face:'kh_ohfolk2_1',sc:1,lines:["Alms for the poor, and blessings for the rich, since the rich need them more.","I walk from gate to gate every day. The city is bigger than it looks, and the people smaller.","I have heard confessions from three guards, a baker and a wizard. The wizard was the shortest."]},
  {id:'oh_f_cook',n:'A cook',face:'kh_ohfolk2_2',sc:1.04,lines:["I cook for the castle kitchens, and I can tell you the king eats very little and the chancellor eats very well.","A good stew is two days old. Do not tell the court.","Do you like pepper? I have a cellar of it, and no one to blame."]},
  {id:'oh_f_beggar',n:'An old beggar',face:'kh_ohfolk2_3',sc:.96,lines:["A penny for an old man who remembers the king when he was young and the city had half as many walls.","I sit by the gate. Every secret in Oldhaven goes in or out of that gate, and none of them tip.","The chancellor's men took my cart. The king's men took my dog. The queen's maid gave me soup. Guess which I remember."]},
  {id:'oh_f_clerk',n:'A court clerk',face:'kh_ohfolk2_4',sc:1,lines:["I count things for the Crown. Today I have counted forty-one crates of nothing, in a very detailed ledger.","The court roll is closed to the public. I have never seen that done before.","I have a quill for lying and a quill for truth. The ink is the same."]},
  {id:'oh_f_maid',n:'A serving maid',face:'kh_ohfolk2_5',sc:1,lines:["Three jugs for the soldiers, one for the sergeant, and a very small one for the cat.","I have served ale to knights, thieves and a bishop. The bishop tipped best.","Mind the stairs. The last drunk is still on them."]}
];
OH_FOLK.forEach(f=>khNpc(f.id,f.n,f.face,()=>yrLines(f.id,f.lines),{sc:f.sc}));
const OH_FOLKBY=Object.fromEntries(OH_FOLK.map(f=>[f.id,f]));
const OH_CROWD=['oh_f_baker','oh_f_noble','oh_f_lady','oh_f_monk','oh_f_boy','oh_f_fishwife','oh_f_friar','oh_f_cook','oh_f_beggar','oh_f_clerk','oh_f_maid','oh_f_smith'];
const OH_SOLDIER=['oh_f_pike','oh_f_pike','oh_f_xbow','oh_f_pike','oh_f_knight','oh_f_xbow','oh_f_pike','oh_f_knight2'];

/* ---- the houses: what is inside each, by who lives there ---- */
const OH_SCENES={
  noble:{n:"A Nobleman's House",res:['oh_f_noble','oh_f_lady','oh_f_maid']},scholar:{n:"A Scholar's House",res:['oh_f_clerk','oh_f_monk']},wizard:{n:"A Wizard's Study",res:['oh_f_monk']},
  merchant:{n:"A Merchant's House",res:['oh_f_noble','oh_f_clerk','oh_f_baker']},warm:{n:'A Warm House',res:['oh_f_baker','oh_f_fishwife','oh_f_cook','oh_f_lady']},
  worker:{n:"A Craftsman's House",res:['oh_f_smith','oh_f_cook','oh_f_fishwife']},soldier:{n:"A Soldier's Billet",res:['oh_f_pike','oh_f_xbow','oh_f_knight2']},
  children:{n:"A Family's House",res:['oh_f_boy','oh_f_fishwife','oh_f_baker']},healer:{n:"A Healer's House",res:['oh_f_friar','oh_f_monk']},
  potter:{n:"A Potter's Workshop",res:['oh_f_cook','oh_f_smith']},musician:{n:"A Minstrel's House",res:['oh_f_lady','oh_f_maid']},
  spartan:{n:'A Bare House',res:['oh_f_beggar','oh_f_friar']},messy:{n:'A Messy House',res:['oh_f_beggar','oh_f_boy','oh_f_clerk']},
  priest:{n:"A Chaplain's House",res:['oh_f_monk','oh_f_friar']}
};
const OH_RICH=['noble','scholar','wizard','merchant','noble','musician','warm','priest'];
const OH_POOR=['worker','soldier','children','potter','spartan','messy','warm','soldier','healer','worker'];

/* ---- the shops and special doors: each is put on the lot nearest where it should be ---- */
const OH_SPECIAL=[
  {id:307,name:"The King's Rest",room:'inn',keeper:'oh_inn',want:[66,72],floor:'wood',pat:0},
  {id:308,name:'Oldhaven Arms',room:'shop',keeper:'oh_smith',want:[90,74],floor:'cobble',pat:0},
  {id:309,name:'The Apothecary',room:'shop',keeper:'oh_apoth',want:[38,68],floor:'wood',pat:1},
  {id:310,name:'The Chapel of Saint Brannoch',room:'prayer',keeper:'oh_priest',want:[104,66],floor:'cobble',pat:0,chapel:true},
  {name:"The Armourer's Yard",room:'shop',keeper:'oh_armour',want:[88,104],floor:'cobble',pat:0},
  {name:"The King's Bakery",room:'shop',keeper:'oh_bakery',want:[56,90],floor:'wood',pat:0},
  {name:'The Scroll House',room:'shop',keeper:'oh_scrolls',want:[28,48],floor:'wood',pat:1},
  {name:'Pack and Lantern',room:'shop',keeper:'oh_pack',want:[68,102],floor:'wood',pat:0},
  {name:'The Gilded Lance',room:'inn',keeper:'oh_inn2',want:[120,88],floor:'wood',pat:0},
  {name:'The Cookshop',room:'shop',keeper:'oh_cookshop',want:[110,124],floor:'wood',pat:0},
  {name:'The Garrison Hall',room:'hall',keeper:'oh_sergeant',want:[28,100],floor:'cobble',pat:1},
  {name:"The Herbwife's Cottage",room:'shop',keeper:'oh_herbs',want:[20,128],floor:'wood',pat:0},
  {name:'The Oldhaven Baths',room:'bath',keeper:'oh_bath',want:[76,58],pat:0,scene:'bath_grand'},
  {name:'The Glover and Tailor',room:'shop',keeper:'oh_tailor',want:[126,56],floor:'wood',pat:0}
];

function ohBuild(){
  if(LEVELS[OH.ID])return;
  ohAlias();
  const W=OH.W,H=OH.H,N=W*H,hs=(a,b,c)=>hash2(a,b,c);
  const TM=ohTiles(),chars={D:LEVEL41_DATA.chars.D},chMap=new Map();let nextCh=0x300;
  const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const block=new Uint8Array(N),fm=new Array(N).fill('0');
  const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
  const sky=[],decor=[],scenery=[],lights=[],used=new Set();
  const lv={rows:null,start:{x:OH.CX,y:141,f:0},enemies:[],items:[],decor,scenery,sky,fmap:null,floorSet:['cobble','pale','dirt','mosscobble','stainedcobble','lush'],floor:'cobble',ceil:'cloud',
    day:.98,outdoor:true,amb:.9,name:'Oldhaven',label:'Oldhaven',noExtras:true,diff:25,tele:{x:OH.CX,y:138},ceilH:5.2,chars,lights,portals:[]};
  /* ---- the curtain wall: two squares thick, arrow slits in its face, towers along it ---- */
  const WALL=3.2,wPlain=ch(TM.make('plain',0,WALL).gid),wSlit=ch(TM.make('slit',0,WALL).gid),wDark=ch(TM.make('plain',1,WALL).gid);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(x>=6&&x<=143&&y>=6&&y<=143)continue;
    const face=x===5||y===5||x===144||y===144;
    solid(x,y,face&&(x+y)%4===0?wSlit:(x*7+y*3)%11===0?wDark:wPlain);
  }
  const pch=n=>{const c=String.fromCharCode(nextCh++);chars[c]=30+n;return c};
  // the portcullis gate on the south wall, between two towers
  const GX=OH.CX,gateWh=3.4,tWh=4.6;
  {const pg=TM.make('gate',0,gateWh,'kh_ohgate1_0');T_DOORS.ohportc=pg.tex;const gc=pch(2);
    for(let y=144;y<=145;y++)for(let x=GX-1;x<=GX+1;x++)solid(x,y,gc);
    const tp=ch(TM.make('plain',0,tWh).gid),ts=ch(TM.make('slit',0,tWh).gid);
    for(let y=144;y<=145;y++)for(const xs of [[GX-4,GX-2],[GX+2,GX+4]])for(let x=xs[0];x<=xs[1];x++)solid(x,y,y===144&&x%2===0?ts:tp);
    lv.portals[2]={to:304,x:0,y:0,f:2,tex:'ohportc'};
    sky.push({x:GX-3,y:144.6,k:'kh_ohtower1_3',w:7,z:tWh-.05,big:1},{x:GX+3,y:144.6,k:'kh_ohtower1_3',w:7,z:tWh-.05,big:1});
  }
  // towers along the wall
  for(let x=14;x<=136;x+=17){if(Math.abs(x-GX)<8)continue;for(const y of [4.5,145])sky.push({x,y,k:hs(x,y,3)<.5?'kh_ohtower1_2':'kh_ohtower1_3',w:5.5,z:WALL-.05,big:1})}
  for(let y=16;y<=134;y+=17)for(const x of [4.5,145])sky.push({x,y,k:hs(x,y,4)<.5?'kh_ohtower1_2':'kh_ohtower1_3',w:5.5,z:WALL-.05,big:1});
  for(const [x,y] of [[4.5,4.5],[145,4.5],[4.5,145],[145,145]])sky.push({x,y,k:'kh_ohtower1_3',w:9,z:WALL-.05,big:1});
  /* ---- the castle: a great mass of tall wall behind the square, the keep standing over it, a double door in the middle ---- */
  const CAS={x0:58,y0:6,x1:90,y1:39},cWh=3.8;
  {const cp=ch(TM.make('plain',0,cWh).gid),cw=ch(TM.make('window',0,cWh).gid),cs=ch(TM.make('slit',0,cWh).gid),cd=ch(TM.make('plain',1,cWh).gid);
    const gh=4.6,gp=ch(TM.make('plain',0,gh).gid),gs=ch(TM.make('slit',0,gh).gid);
    for(let y=CAS.y0;y<=CAS.y1;y++)for(let x=CAS.x0;x<=CAS.x1;x++){
      let c=cp;
      if(y===CAS.y1)c=(x>=GX-5&&x<=GX+5)?(x%2===0?gs:gp):(x%3===0?cw:(x%7===0?cs:cp));
      else if(x===CAS.x0||x===CAS.x1)c=y%3===0?cs:cp;
      else if((x*5+y*3)%13===0)c=cd;
      solid(x,y,c);
    }
    const pc=pch(1);const pd=TM.make('gate',0,gh,'kh_ohgate1_1');T_DOORS.ohpalace=pd.tex;
    for(let x=GX-1;x<=GX+1;x++)solid(x,CAS.y1,pc);
    lv.portals[1]={to:OH.COURT,x:17,y:27,f:0,tex:'ohpalace',req:'courtOpen',lock:'The great doors of the palace are shut. The gate-captain, Aldwyn, can tell you when the court sits.'};
    // the keep, the towers of the castle and the long spires on its wings
    sky.push({x:GX,y:22,k:'kh_ohkeep1_0',w:36,z:cWh-.3,big:1});
    for(const [x,y,k,w] of [[CAS.x0+1.5,CAS.y1-1.5,'kh_ohtower1_3',9],[CAS.x1-.5,CAS.y1-1.5,'kh_ohtower1_3',9],[CAS.x0+1.5,CAS.y0+2,'kh_ohtower1_3',9],[CAS.x1-.5,CAS.y0+2,'kh_ohtower1_3',9],
      [GX-8,CAS.y1-1,'kh_ohtower1_2',5],[GX+8,CAS.y1-1,'kh_ohtower1_2',5],[66,26,'kh_ohtower1_0',4.4],[82,26,'kh_ohtower1_1',4.4],[62,16,'kh_ohtower1_4',3.8],[86,16,'kh_ohtower1_5',3.8],[74,10,'kh_ohtower1_0',5.2]])
      sky.push({x,y,k,w,z:cWh-.05,big:1});
  }
  /* ---- the square before the castle, the king's road down to the gate, and the paving ---- */
  const PLZ={x0:56,y0:40,x1:92,y1:61};
  for(let y=PLZ.y0;y<=PLZ.y1;y++)for(let x=PLZ.x0;x<=PLZ.x1;x++)fm[y*W+x]='1';
  for(let y=PLZ.y1+1;y<=143;y++)for(let x=OH.CX-2;x<=OH.CX+2;x++)fm[y*W+x]='1';
  for(let y=40;y<=43;y++)for(let x=OH.CX-4;x<=OH.CX+4;x++)fm[y*W+x]='1';
  /* ---- the blocks of houses between the streets: three houses apart, terraced, a door on every one ---- */
  const XB=[[6,16],[20,34],[38,52],[56,71],[77,92],[96,110],[114,128],[132,142]],YB=[[10,22],[26,40],[44,58],[62,76],[80,94],[98,112],[116,130],[134,143]];
  const houses=[],gardens=[];
  const row=(x0,x1,y0,y1,face)=>{const w=x1-x0+1,n=Math.max(1,Math.round(w/6)),b=Math.floor(w/n),ex=w-b*n;let x=x0;for(let i=0;i<n;i++){const ww=b+(i<ex?1:0);houses.push({x0:x,x1:x+ww-1,y0,y1,face});x+=ww}};
  const col=(x0,x1,y0,y1,face)=>{const h=y1-y0+1,n=Math.max(1,Math.round(h/6)),b=Math.floor(h/n),ex=h-b*n;let y=y0;for(let i=0;i<n;i++){const hh=b+(i<ex?1:0);houses.push({x0,x1,y0:y,y1:y+hh-1,face});y+=hh}};
  XB.forEach(([bx0,bx1],i)=>YB.forEach(([by0,by1],j)=>{
    if(bx1>=56&&bx0<=92&&by0<=61)return;                                  // the castle and the square
    if(hs(i,j,5)<.06&&i!==3&&i!==4){gardens.push([bx0,by0,bx1,by1]);return}  // now and then a block is a walled garden
    let rx0=bx0,rx1=bx1;
    if(i===3&&j>=3){col(66,71,by0,by1,'E');rx1=65}
    if(i===4&&j>=3){col(77,82,by0,by1,'W');rx0=83}
    const hgt=by1-by0+1;
    if(j===7){row(rx0,rx1,by0,by0+6,'N');return}
    const dt=hgt>>1;
    row(rx0,rx1,by0,by0+dt-1,'N');row(rx0,rx1,by0+dt,by1,'S');
  }));
  houses.forEach((h,k)=>{
    h.k=k;h.wh=[2.3,2.5,2.7,2.9][(hs(h.x0,h.y0,11)*4)|0];
    h.pat=hs(h.x0,h.y0,12)<.78?0:1;
    const w=h.x1-h.x0+1,d=h.y1-h.y0+1;h.w=(h.face==='N'||h.face==='S')?w:d;
    const ci=(h.face==='N'||h.face==='S')?h.x0+((w-1)>>1)+(w>=6&&hs(h.x0,h.y0,13)<.5?1:0):h.y0+((d-1)>>1)+(d>=6&&hs(h.x0,h.y0,13)<.5?1:0);
    if(h.face==='N'){h.door=[ci,h.y0];h.front=[ci,h.y0-1];h.out=0;h.wall=[0,1]}
    else if(h.face==='S'){h.door=[ci,h.y1];h.front=[ci,h.y1+1];h.out=2;h.wall=[0,-1]}
    else if(h.face==='E'){h.door=[h.x1,ci];h.front=[h.x1+1,ci];h.out=1;h.wall=[-1,0]}
    else{h.door=[h.x0,ci];h.front=[h.x0-1,ci];h.out=3;h.wall=[1,0]}
  });
  // which house is which: the shops go to the lot nearest where each belongs
  const taken=new Set(),spec=[];
  for(const sp of OH_SPECIAL){
    let best=null,bd=1e9;
    for(const h of houses){if(taken.has(h.k))continue;const dx=(h.x0+h.x1)/2-sp.want[0],dy=(h.y0+h.y1)/2-sp.want[1],dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=h}}
    if(best){taken.add(best.k);best.sp=sp;spec.push(best)}
  }
  let homeN=0;
  for(const h of houses){
    h.id=h.sp&&h.sp.id?h.sp.id:OH.HOME+(homeN++);
    const d2=Math.hypot((h.x0+h.x1)/2-OH.CX,(h.y0+h.y1)/2-60);
    if(h.sp){h.name=h.sp.name;h.room=h.sp.room;h.keeper=h.sp.keeper;h.floor=h.sp.floor;h.wpat=h.sp.pat;h.scene=h.sp.scene}
    else{
      const rich=d2<44||hs(h.x0,h.y0,14)<.12,pick=(rich?OH_RICH:OH_POOR),sc=pick[(hs(h.x0,h.y0,15)*pick.length)|0];
      h.scene=sc;h.name=OH_SCENES[sc].n;h.room='home';h.floor=(sc==='soldier'||sc==='spartan'||sc==='potter')?'cobble':'wood';h.wpat=hs(h.x0,h.y0,16)<.7?0:1;
      const res=OH_SCENES[sc].res;h.keeper=hs(h.x0,h.y0,17)<.72?res[(hs(h.x0,h.y0,18)*res.length)|0]:null;
      if(hs(h.x0,h.y0,19)<.06)h.gold=25+((hs(h.x0,h.y0,20)*60)|0);
    }
  }
  // build the walls of each house
  for(const h of houses){
    const wh=h.wh,pat=h.pat,front=(x,y)=>h.face==='N'?y===h.y0:h.face==='S'?y===h.y1:h.face==='E'?x===h.x1:x===h.x0;
    const plain=ch(TM.make('plain',pat,wh).gid),win=ch(TM.make(h.sp&&h.sp.room!=='prayer'?'shopfront':'window',pat,wh).gid),side=ch(TM.make('window',pat,wh).gid);
    const dtile=TM.make('door',pat,wh);
    const dgid=KH_NEXT_GID++;T_TILE[dgid]=dtile.tex;
    const mid=h.room==='inn'?[6,7]:h.room==='hall'?[5,6]:h.room==='shop'?[5,6]:h.room==='prayer'?[4,6]:[3,4];h.at={x:mid[0],y:mid[1],f:0};
    KH_DOOR[dgid]={lvl:h.id,at:h.at};
    for(let y=h.y0;y<=h.y1;y++)for(let x=h.x0;x<=h.x1;x++){
      let c;
      if(x===h.door[0]&&y===h.door[1])c=ch(dgid);
      else if(front(x,y))c=win;
      else c=((x+y)%3===0)?side:plain;
      solid(x,y,c);
    }
    // the roof: a painted gable on top of the walls, and now and then a tower standing over the house
    const rk=hs(h.x0,h.y0,21),rr=rk<.34?0:rk<.58?1:rk<.72?2:rk<.84?3:4;
    sky.push({x:(h.x0+h.x1+1)/2,y:(h.y0+h.y1+1)/2,k:'kh_ohroof1_'+rr,w:h.w+.5,z:wh-.03});
    const tk=hs(h.x0,h.y0,22);
    if(tk<.14)sky.push({x:(h.x0+h.x1+1)/2+(hs(h.x0,h.y0,23)-.5)*2,y:(h.y0+h.y1+1)/2,k:'kh_ohtower1_'+[0,1,4,5][(hs(h.x0,h.y0,24)*4)|0],w:2.8,z:wh-.03});
    else if(tk>.97)sky.push({x:(h.x0+h.x1+1)/2,y:(h.y0+h.y1+1)/2,k:'kh_ohtower1_2',w:3.6,z:wh-.03});
  }
  // the walled gardens: a green court with a well, benches and flowers
  for(const [x0,y0,x1,y1] of gardens){
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)fm[y*W+x]='5';
    const wp=ch(TM.make('plain',0,1.8).gid);
    for(let x=x0;x<=x1;x++){solid(x,y0,wp);solid(x,y1,wp)}for(let y=y0;y<=y1;y++){solid(x0,y,wp);solid(x1,y,wp)}
    const gx=(x0+x1)>>1;rows[y1][gx]='.';block[y1*W+gx]=0;
  }
  const free=(x,y)=>x>5&&y>5&&x<144&&y<144&&rows[y][x]==='.'&&!block[y*W+x]&&!used.has(x+','+y);
  const dc=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}))};
  const tryDc=(k,x,y,o)=>{if(free(x,y)){dc(k,x,y,o);return true}return false};
  const walk=(k,x,y,o)=>{used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false,walk:true},o||{}))};
  const near=(x,y,rad)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(free(x+dx,y+dy))return [x+dx,y+dy]}return null};
  OH.near=near;OH.free=free;
  const person=(id,x,y,rad)=>{const kp=KH_KEEPERS[id];if(!kp)return null;const q=near(x,y,rad||3);if(!q)return null;walk(khFaceKey(kp.face),q[0],q[1],{npc:id,sc:kp.sc||1});return q};
  for(const [x0,y0,x1,y1] of gardens){
    const cx=(x0+x1)>>1,cy=(y0+y1)>>1;tryDc('well',cx,cy,{block:true,walk:false});
    for(const [dx,dy] of [[-3,0],[3,0],[0,-2],[0,2]])tryDc('yar_bench',cx+dx,cy+dy);
    for(let n=0;n<14;n++){const x=x0+1+((hs(n,x0,30)*(x1-x0-1))|0),y=y0+1+((hs(n,y0,31)*(y1-y0-1))|0);if(free(x,y))scenery.push({k:hs(n,3,32)<.5?'yar_tub':'yar_lavender',wx:x+.5,wy:y+.5,sc:.9,decor:{k:'yar_tub',walk:true,x,y}})}
    person(OH_CROWD[(hs(x0,y0,33)*OH_CROWD.length)|0],cx+1,cy+1);
  }
  /* ---- the lanterns: iron posts along every street, beside the road and never in it ---- */
  const inCastle=(x,y)=>x>=56&&x<=92&&y<=61;
  const lamp=(x,y)=>{if(!inCastle(x,y)&&tryDc('lamp',x,y))lights.push([x,y])};
  const VSC=[18,36,54,94,112,130],HSC=[8,24,42,60,78,96,114,132];
  for(const c of HSC)for(let x=9+((c*3)%5);x<=141;x+=8)lamp(x,c-1);
  for(const c of VSC)for(let y=12+((c*3)%5);y<=140;y+=8)lamp(c+1,y);
  for(let y=64;y<=140;y+=6){lamp(OH.CX-3,y+2);lamp(OH.CX+3,y+2)}
  /* ---- the square: a fountain, trebuchets and warhorses on display, soldiers, people milling about ---- */
  const fx0=OH.CX,fy0=51;
  dc('fountain',fx0,fy0,{block:true,walk:false});
  for(const [x,y] of [[57,41],[91,41],[57,60],[91,60],[66,51],[82,51]])dc('well',x,y,{block:false,walk:true});
  for(const [x,y] of [[61,46],[87,46],[61,56],[87,56],[71,139],[77,139]]){if(!tryDc('oh_treb',x,y))continue;tryDc('oh_balls',x+(x<74?1:-1),y);if(y<100)tryDc('oh_barrel',x+(x<74?2:-2),y)}
  for(const [x,y] of [[65,44],[83,44],[65,58],[83,58],[69,47],[79,47],[69,56],[79,56]])dc('oh_ballista',x,y,{});
  for(const [x,y] of [[60,43],[88,43],[60,59],[88,59],[63,50],[85,50]])dc('oh_rack',x,y,{});
  for(const [x,y] of [[62,42],[66,42],[82,42],[86,42],[64,53],[84,53],[68,59],[80,59],[62,50],[86,50],[72,46],[76,46]])dc('oh_horse',x,y,{});
  for(let x=58;x<=90;x+=6)dc('oh_banner',x,40,{});
  for(let x=60;x<=88;x+=4){if(Math.abs(x-OH.CX)<3)continue;lamp(x,41);lamp(x,59)}
  // the king's road: soldiers lining both sides, banners, warhorses and trebuchets down its length
  let sn=0;
  for(let y=63;y<=140;y+=3){
    for(const sx of [OH.CX-2,OH.CX+2]){
      const id=OH_SOLDIER[(sn++)%OH_SOLDIER.length];const kp=KH_KEEPERS[id];
      if(free(sx,y))walk(khFaceKey(kp.face),sx,y,{npc:id,sc:kp.sc});
    }
  }
  for(let y=68;y<=136;y+=12){dc('oh_banner',OH.CX-2,y);dc('oh_banner',OH.CX+2,y+6)}
  for(let y=72;y<=132;y+=20){tryDc('oh_horse',OH.CX-1,y);tryDc('oh_horse',OH.CX+1,y+10);tryDc('oh_rack',OH.CX+2,y+4);tryDc('oh_rack',OH.CX-2,y+14)}
  // the named people: the gate, the square and the doors of the palace
  const named=[['oh_cap',OH.CX,42],['oh_guardA',OH.CX-3,40],['oh_guardB',OH.CX+3,40],['oh_g1',OH.CX-3,140],['oh_g2',OH.CX+3,140],['oh_m1',66,48],['oh_m2',82,48],['oh_w1',64,50],['oh_w2',72,56],['oh_k1',76,56],['oh_o1',84,56],['oh_s1',68,45],['oh_pr',80,46]];
  for(const [id,x,y] of named)person(id,x,y,5);
  // a crowd in the square and in the streets, and soldiers everywhere
  let pn=0;
  for(let n=0;n<56;n++){const x=57+((hs(n,1,40)*35)|0),y=44+((hs(n,2,40)*16)|0);
    const arr=hs(n,3,40)<.28?OH_SOLDIER:OH_CROWD,aid=arr[(hs(n,5,40)*arr.length)|0];const q=near(x,y,2);if(q&&!(Math.abs(q[0]-fx0)<2&&Math.abs(q[1]-fy0)<2)){const kp=KH_KEEPERS[aid];walk(khFaceKey(kp.face),q[0],q[1],{npc:aid,sc:kp.sc});pn++}}
  for(let n=0;n<110;n++){const x=8+((hs(n,1,41)*134)|0),y=8+((hs(n,2,41)*134)|0);if(inCastle(x,y))continue;
    const arr=hs(n,3,41)<.3?OH_SOLDIER:OH_CROWD,aid=arr[(hs(n,4,41)*arr.length)|0];
    // only on a street: a cell with a house wall or the square close by in neither
    const q=free(x,y)?[x,y]:near(x,y,1);if(q){const kp=KH_KEEPERS[aid];walk(khFaceKey(kp.face),q[0],q[1],{npc:aid,sc:kp.sc})}}
  // signs on the shops
  const KNAME={oh_bath:'Marta, bath keeper',oh_inn:'Wynn, innkeeper',oh_smith:'Bram, smith',oh_apoth:'Maud, apothecary',oh_priest:'Sister Margery',oh_armour:'Ser Gawen',oh_bakery:'Hild, baker',oh_scrolls:'Osbern, scribe',oh_pack:'Tilda',oh_inn2:'Dame Hester',oh_cookshop:'Pol',oh_sergeant:'Sergeant Cade',oh_herbs:'Old Ysolt',oh_tailor:'Fenwick'};
  for(const h of spec){
    const horizontal=h.face==='N'||h.face==='S',sx=horizontal?h.front[0]+1:h.front[0],sy=horizontal?h.front[1]:h.front[1]+1;
    const spot=(rows[sy]&&rows[sy][sx]==='.')?[sx,sy]:h.front;
    decor.push({k:'sign_'+h.keeper,x:spot[0],y:spot[1],block:false,wd:h.wall,txt:[h.name.toUpperCase(),KNAME[h.keeper]||'']});
  }
  /* ---- finish the level, the rooms behind the doors, and the doors of the gate ---- */
  lv.rows=rows.map(r=>r.join(''));
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}lv.fmap=fmap;
  lv.mapNames=[{t:'Castle of King Osric',x:OH.CX,y:24,k:'place'},{t:'The Great Square',x:OH.CX,y:51,k:'place'},{t:"King's Road",x:OH.CX,y:100,k:'lane'},{t:'Portcullis Gate',x:OH.CX,y:141,k:'place'},
    {t:'Old Town',x:26,y:70,k:'place'},{t:'Tanners Row',x:120,y:110,k:'place'},{t:'Garrison Quarter',x:28,y:104,k:'place'},{t:'Lantern Street',x:36,y:30,k:'lane'},{t:'Smiths Quarter',x:112,y:60,k:'place'}];
  for(const h of houses){
    const id=h.id;LEVEL_NAMES[id]=h.name;
    KH_LAZY[id]=()=>{
      if(LEVELS[id])return;
      const b={id:'oh'+h.k,name:h.name,room:h.room,keeper:h.keeper,scene:h.scene,gold:h.gold,wallImg:'kh_ohwall1_'+h.wpat,floor:h.floor};
      const R=khRoom(b,id,{to:OH.ID,x:h.front[0],y:h.front[1],f:h.out});LEVELS[id]=R.level;LEVEL_NAMES[id]=h.name;
    };
  }
  OH.houses=houses;
  LEVELS[OH.ID]=lv;LEVEL_NAMES[OH.ID]='Oldhaven';
  const q4=LEVELS[304];if(q4)lv.portals[2].x=q4.start.x,lv.portals[2].y=q4.start.y;
}
KH_LAZY[OH.ID]=()=>{seaBuild(304);ohBuild()};LEVEL_NAMES[OH.ID]='Oldhaven';
for(let i=0;i<OH_SPECIAL.length+640;i++){const id=i<4?OH.ROOM+i:OH.HOME+i-4,stub=()=>{seaBuild(304);ohBuild();if(!LEVELS[id]&&KH_LAZY[id]&&KH_LAZY[id]!==stub)KH_LAZY[id]()};KH_LAZY[id]=stub}
for(const sp of OH_SPECIAL)if(sp.id)LEVEL_NAMES[sp.id]=sp.name;
/* ---- the court: a long hall of grey stone, the king and queen on their thrones, and the whole household of the Crown ---- */
function ohBuildCourt(){
  ohAlias();
  const W=35,H=30,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('w'));
  for(let y=1;y<=H-3;y++)for(let x=1;x<=W-2;x++)g[y][x]='.';
  g[H-1][17]='0';g[H-2][17]='.';
  const rows=g.map(r=>r.join(''));
  const decor=[],put=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const raw=(k,x,y,o)=>decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}));
  const npc=(id,k,x,y,o)=>decor.push(Object.assign({k,x,y,block:false,walk:true,npc:id,sc:1},o||{}));
  const arch=(id,x,y)=>{const f=OH_FOLKBY[id];npc(id,f.face,x,y,{sc:f.sc})};
  // the dais and the back wall
  put('throne',17,2);put('throne',20,2);
  for(const x of [4,8,12,24,28,31])raw('oh_banner',x,2);
  for(const x of [6,10,14,22,26,30])put('banner',x,2);
  for(const x of [5,29])for(const y of [6,14,22])put('statue',x,y);
  for(const [x,y] of [[9,9],[25,9],[9,17],[25,17],[14,23],[20,23]])put('brazier',x,y);
  for(const x of [2,32])for(const y of [5,10,15,20])raw('oh_banner',x,y);
  for(const x of [3,31])for(const y of [8,12,18,25])put('candle',x,y);
  put('desk',7,8);put('table',27,19);put('chair',26,19);put('chair',28,19);put('table',8,20);put('chair',7,20);put('chair',9,20);
  raw('oh_barrel',31,26);raw('oh_barrel',3,26);raw('oh_rack',3,22);raw('oh_rack',31,22);
  // the royal household
  npc('oh_king','yar_p_osric',17,3);npc('oh_queen','kh_ohcourt1_1',20,3);
  npc('oh_vance','yar_p_vance',14,4);
  npc('oh_treas','kh_ohcourt1_2',23,4);npc('oh_wiz','kh_ohcourt1_3',26,4);npc('oh_bishop','kh_ohcourt1_5',11,4);npc('oh_jest','kh_ohcourt1_4',17,8);
  npc('oh_halb','mayor',22,10);
  npc('oh_phys','kh_ohfolk1_4',28,10);npc('oh_scribe','kh_ohfolk2_4',7,9);npc('oh_armrer','kh_ohfolk1_0',29,16);
  npc('oh_lord1','kh_ohfolk1_2',12,12);npc('oh_lady1','kh_ohfolk1_3',23,13);npc('oh_lady2','kh_ohfolk1_3',11,15);npc('oh_lord2','kh_ohfolk1_2',24,16);
  npc('oh_maid','kh_ohfolk2_5',27,20);npc('oh_cookc','kh_ohfolk2_2',31,24);
  npc('oh_herald','kh_ohsold1_5',17,23);
  for(const [x,y] of [[6,3],[28,3]])arch('oh_f_banner',x,y);
  for(const [x,y] of [[9,3],[25,3]])arch('oh_f_knight',x,y);
  for(const [x,y] of [[13,9],[21,9],[13,15],[21,15],[13,21],[21,21]])arch(((x+y)&1)?'oh_f_knight2':'oh_f_knight',x,y);
  for(const y of [7,11,15,19,23]){arch('oh_f_pike',3,y);arch('oh_f_pike',31,y)}
  for(const [x,y] of [[15,26],[19,26]])arch('oh_f_xbow',x,y);
  return {rows,start:{x:17,y:H-3,f:0},decor,lights:[[8,4],[17,5],[26,4],[8,10],[26,10],[8,16],[26,16],[17,12],[17,18],[8,22],[26,22],[17,25]]};
}
KH_LAZY[OH.COURT]=()=>{
  if(LEVELS[OH.COURT])return;const c=ohBuildCourt(),wg=khInteriorWall('palace','kh_ohwall1_0');
  LEVELS[OH.COURT]={rows:c.rows,start:c.start,enemies:[],items:[],decor:c.decor,day:0,amb:.8,floor:'cobble',ceil:'beam',name:'The Court of King Osric',label:'Royal Court',lights:c.lights,ceilH:2.2,
    portals:[{to:OH.ID,x:OH.CX,y:41,f:2,tex:'tgate'}],diff:25,noExtras:true,chars:wg?{w:wg}:undefined};
  LEVEL_NAMES[OH.COURT]='The Court of King Osric';
};
LEVEL_NAMES[OH.COURT]='The Court of King Osric';
/* ---- shops and keepers of the new doors ---- */
khShop('oh_armour','Ser Gawen, the armourer','kh_ohsold1_2',"The Armourer's Yard",'Helms, shields and mail, hammered on the premises. Ser Gawen retired from the Gate to make things that stop swords instead of meeting them.','armour');
khShop('oh_bakery','Hild, the baker','kh_ohfolk1_1',"The King's Bakery",'Fresh rolls, pies and cheese. The king has one roll a day, and the garrison has the rest, so there is always plenty.','food');
khShop('oh_scrolls','Osbern, the scribe','kh_ohfolk2_4','The Scroll House','Scrolls of fire, frost and light, written in a very clear hand. I do not do lettering for the chancellor any more.','scroll');
khShop('oh_pack','Tilda, of Pack and Lantern','kh_ohfolk1_5','Pack and Lantern','Torches, lanterns, rope and travelling food. Everything a party needs and nothing it does not.','general');
khShop('oh_cookshop','Pol, the cook','kh_ohfolk2_2','The Cookshop','Stew, roast and pie by the bowl, and bread by the loaf. It is all good and all hot, and the soldiers eat first.','food');
khShop('oh_herbs','Old Ysolt, the herbwife','kh_ohfolk2_0',"The Herbwife's Cottage",'Herbs, salves and tinctures, brewed in my own kitchen and tested on my own cat. He is very well.','potion');
khShop('oh_tailor','Fenwick, the tailor','kh_ohfolk1_2','The Glover and Tailor','Gloves, jerkins and mail shirts for the less gallant. Whatever you need under armour, I can make.','armour');
khInn('oh_inn2','Dame Hester, of the Gilded Lance','kh_ohfolk2_5','The Gilded Lance',35,'The Gilded Lance. Soft beds, a great fire and a ceiling the knights cannot hit with their helmets. A room is 35 gold, and breakfast is on the house.');
khNpc('oh_sergeant','Sergeant Cade, of the garrison','kh_ohsold1_0',()=>say('This is the garrison hall. Two hundred men, one stove, and a rule about boots. If you want a job, ask the gate-captain. If you want a bed, try the King\'s Rest.',[BYE]),{sc:1.08});
/* ---- the household of the Crown ---- */
const ohSay=(id,n,face,a,b)=>khNpc(id,n,face,()=>say(G.flags.pardoned&&b?b:a,[BYE]));
ohSay('oh_queen','Queen Elowen','kh_ohcourt1_1',"I have sat at his side for thirty years, and I have never seen my husband look at a page the way he looks at the one in your hand. Let him read. Let him read it all.","The king is himself again, and I have my husband back. Whatever you ask of us, ask it quickly, before he decides to give you the whole kingdom.");
ohSay('oh_treas','Lord Treasurer Pell','kh_ohcourt1_2',"The tolls are in my books, and my books are in order. That is the difficulty. In this kingdom everything is always in order.","The accounts will be rewritten from the first page. It will take me the rest of my life, and I am delighted.");
ohSay('oh_wiz','Ismar, the court wizard','kh_ohcourt1_3',"I have been watching the chancellor for a year, through a very small window. It is a very small window. I regret nothing.","Magic cannot read a man's heart. A ledger can. I have underestimated paper all my life.");
ohSay('oh_bishop','Bishop Aldous','kh_ohcourt1_5',"Truth is a heavy thing, and very few people can lift it. Stand aside, and let the old king try.","Mercy is an easier thing to say than to do. I think the king will manage both, today.");
ohSay('oh_jest',"Pip, the king's fool",'kh_ohcourt1_4',"A fool sees a great deal. I see that the chancellor has stopped smiling at me, which is the first real warning I have had this year.","I told the king the truth in a joke for twenty years, and he laughed every time. Today he finally heard it. I may retire.");
ohSay('oh_phys','Brother Aldric, the physician','kh_ohfolk1_4',"His majesty is not ill. His majesty is tired. There is no tincture for that, and I have tried them all.","The king slept all night. Nobody in the palace can remember the last time.");
ohSay('oh_scribe',"Master Quillon, the king's scribe",'kh_ohfolk2_4',"I wrote the warrant against you, and I did not like the word forger. I wrote it anyway. The chancellor stood behind my chair.","I have begun a very long letter of apology. I am on page nine.");
ohSay('oh_armrer','Hale, the royal armourer','kh_ohfolk1_0',"Armour for the household, polish for the knights, and silence for the gentry. That is my whole trade.","I made Vance's chain of office. I may offer to melt it down.");
ohSay('oh_lord1','Lord Harrow','kh_ohfolk1_2',"There are rumours in the hall. I never listen to rumours. I only repeat them, so that they may be corrected.","I always said the chancellor was a rogue. Mostly quietly. To my dog.");
ohSay('oh_lord2','Lord Wexcombe','kh_ohfolk1_2',"The ledger. The ledger? The ledger! How remarkable. I would have asked for a chair.","I shall remember this day as the day I was entirely right.");
ohSay('oh_lady1','Lady Brisa','kh_ohfolk1_3',"Do not be frightened. The court is much worse than it looks. Stand up straight and say what you carry.","What a morning. I do believe my veil is crooked.");
ohSay('oh_lady2','Lady Hawise','kh_ohfolk1_3',"They say you came on a ship with a gull on the front. I find that delightful and rather suspicious.","I shall have the dressmaker make a gown for the occasion. Something with a gull.");
ohSay('oh_maid','A serving maid','kh_ohfolk2_5',"Wine for the king, wine for the queen, wine for the chancellor. I have been told not to spill, and I am trying so hard.","Nobody has dropped a tray all morning. It is a miracle, or a warning.");
ohSay('oh_cookc','The castle cook','kh_ohfolk2_2',"There is a roast for the feast, and no one to eat it. The court has lost its appetite. I am furious.","The feast will go ahead after all. I have not slept, and I am unbelievably happy.");
ohSay('oh_herald',"The king's herald",'kh_ohsold1_5',"All stand for King Osric! And for his lady! And for his chancellor. Somebody must.","Hear ye! The warrant is void! I have wanted to shout that for a week.");
/* ---- people ---- */
khNpc('oh_cap','Captain Aldwyn, of the Gate','yar_p_aldwyn',()=>{
  const F=G.flags;
  if(F.pardoned)return say('The warrant is void, and I am glad of it. I have never liked being told to chase honest people. The court is open to you.',[BYE]);
  if(F.courtOpen)return say('The court is sitting. Go in. Say your piece, and let the king read what you carry.',[BYE]);
  if(qSt('vq4')!=='done')return say('The court sits at noon, and not for armed strangers with a price on their heads. If you carry something the king should read, go and get it first.',[BYE]);
  return say('The court sits at noon. Armed parties are not admitted. But I hear there is a ledger, and a scribe called Isolde. Is it true you have it?',[['We have the master ledger, whole, in Isolde\'s hand.',()=>{F.courtOpen=1;return say('Then the king will want to see it, whatever Chancellor Vance says. Go in. The doors are open. I have not seen you, and I never saw you on the quay, and I will stand outside the door with my halberd and listen.',[BYE])}],['Not yet.',()=>null]])
},{q:'vq6'});
khNpc('oh_guardA','A royal guard','yar_p_rguard',()=>say('Eyes front. The gate-captain talks to petitioners. I just keep the door.',[BYE]));
khNpc('oh_guardB','A royal guard','yar_p_rguard',()=>say('If you are the four from the quay, keep your hands where I can see them. I am told to be polite. I do not always do what I am told.',[BYE]));
khNpc('oh_g1','A gate guard','kh_ohsold1_0',()=>say('Oldhaven. Walk, do not run, and do not draw anything in the street.',[BYE]));
khNpc('oh_g2','A gate guard','kh_ohsold1_1',()=>say('Twenty thousand crowns a head. I could have a very nice house. I could. Please do not make this difficult.',[BYE]));
khNpc('oh_m1','A merchant','kh_ohfolk1_2',()=>say(G.flags.pardoned?'Is it true? The king tore up the warrant in open court? Then the world is round after all. I have been selling lamp oil to the watch for years, and I never liked their faces.':'The whole city is talking about four strangers. A ransom! I would not mind five minutes in a back room with them. For the reward, you understand.',[BYE]));
khNpc('oh_m2','A baker','kh_ohfolk1_1',()=>say('Fresh rolls. Not for sale to anyone on the king\'s list. Which is everyone this week, apparently.',[BYE]));
khNpc('oh_w1','A fishwife','kh_ohfolk2_0',()=>say('The chancellor has been buying silence in this city for years. Everyone knows. Nobody says. Here, in the lane, anyone can say anything, because it is all very quiet.',[BYE]));
khNpc('oh_w2','A porter','kh_ohfolk1_0',()=>say('The king is old, and the chancellor is clever. That is all you need to know about Oldhaven.',[BYE]));
khNpc('oh_k1','A child','kh_ohfolk1_5',()=>say('Is it true that the Dawn Walker has a gull figurehead? My brother says it has a lady. I say it is a gull.',[BYE]));
khNpc('oh_o1','An old soldier','kh_ohsold1_3',()=>say('Osric was a good king, once. The old kind, who knew the names of his captains. Then he grew tired, and let the clever ones sign for him.',[BYE]));
khNpc('oh_s1','A city scribe','kh_ohfolk2_4',()=>say('I keep the court roll. Today the chancellor ordered the roll closed to the public. I have never heard that order before. I find it interesting.',[BYE]));
khNpc('oh_pr','A brother of the chapel','kh_ohfolk1_4',()=>say('Oldhaven has a chapel for every kind of sinner. Mine is for the tired ones.',[BYE]));
khShop('oh_shop1','Bram, the smith','smith',"Oldhaven Arms",'Steel, oil and a hot fire. Whatever the court says about you, steel does not ask.','arms');
khShop('oh_shop2','Hester, the grocer','merchant','The King\'s Larder','Bread, cheese and travelling food. The king\'s crest on the barrel makes it taste better.','food');
khInn('oh_inn','Wynn, innkeeper of the King\'s Rest','innkeeper','The King\'s Rest',30,'The King\'s Rest. Clean beds, hot water, a fire, and no questions. A room is 30 gold, and the soup is free.');
khShop('oh_smith','Bram, at the Oldhaven Arms','kh_ohfolk1_0','Oldhaven Arms','Swords, axes and plate. All of it made in the shop behind me.','arms');
khShop('oh_apoth','Maud, the apothecary','kh_ohfolk1_3','The Apothecary','Draughts for the body and tinctures for the mind. Tell me what ails you.','potion');
khNpc('oh_priest','Sister Margery, of the Chapel','priest',()=>say('Saint Brannoch watched over travellers. I watch over the ones who return. Would you like a blessing before you go to the court?',[['Ask for a blessing.',()=>{try{afflCure('cursed',-1,true)}catch(e){}msg('A calm settles on the party.','#a8d8ff');return say('Go with grace.',[BYE])}],BYE]));
khNpc('oh_king','King Osric','yar_p_osric',()=>say(G.flags.pardoned?'You have done me and my kingdom a greater service than any lord of mine. Ask what you will. The road is long, and there is more unwritten in that ledger than a single reading can hold.':'Speak, since you came such a long way.',[BYE]));
khNpc('oh_vance','Chancellor Vance','yar_p_vance',()=>say('Majesty, they are lying, as every forger does.',[BYE]));
khNpc('oh_halb','Mayor Halbrecht','mayor',()=>say(G.flags.pardoned?'The king has taken me for a liar. A pity. I was so good at it.':'The ledger is a forgery, your majesty! Do not listen!',[BYE]));
/* ---- the noon gate on the quay, the court, and the end ---- */
function ohWaitNoon(){const m=G.clock%1440;if(m<720)G.clock+=720-m;G.flags.oldhavenOpen=1;msg('Noon bells ring over Oldhaven. The gate on the quay swings open.','#ffe36a');sfx('level')}
(function(){
  const n=NPCS.oh_herald;if(!n||n._wn)return;n._wn=1;
  n.root=()=>{
    const F=G.flags;
    if(F.oldhavenOpen||F.pardoned)return say('The gate stands open. Walk, do not run.',[BYE]);
    return say('The king\'s court meets at noon. The gate is barred until the bells ring. Wait on the quay and do not touch your swords.',[['Wait for noon.',()=>{ohWaitNoon();return say('You wait on the stones while the harbour goes about its business around you. Then the noon bells ring, and the gate groans open.',[BYE])}],['Not yet.',()=>null]]);
  };
})();
Object.assign(CUTS,{
 oldhavenCourt:()=>[
  {text:'The great doors of the Court of Oldhaven open on a long hall of pale stone and blue banners. King Osric sits on a plain silver throne, older than the portraits of him. Chancellor Vance stands at his right hand, smiling, with a scroll in his ink-stained fingers. Mayor Halbrecht of Ironhill waits in chains by the dais.'},
  {who:'King Osric',text:'So these are the four forgers. You came a very long way to be hanged.'},
  {who:hn(0),text:'We came to be heard, majesty. We carry the master ledger, in the hand of your own scribe, Isolde.'},
  {who:'Chancellor Vance',text:'The scribe Isolde is a thief and a liar, your majesty. Whatever these people carry, it was written in a garret by a woman who fled the court with the king\'s silver.'},
  {who:hn(1),text:'She fled because the man who ordered the tolls was your Warden, Lord Corvane. The tolls, the warrant, the knives sent across the sea. Read the last page, majesty. It names who he paid.'},
  {who:'King Osric',text:'Corvane is dead?'},
  {who:hn(2),text:'He died on an island at the end of the Narrow Sea, with a sword in his hand, and the third page of the ledger in an altar at his back.'},
  {text:'The king takes the ledger. The court is silent as he turns the pages. His hands are steady until the last one.'},
  {who:'King Osric',text:'Every toll. Every year. And on the last page, in Corvane\'s own hand, a name that is not mine. Vance. My chancellor.'},
  {who:'Chancellor Vance',text:'Your majesty, a forger\'s fancy! Guards! These people have come to murder the king! Seize them!'},
  {text:'Silver armour rings on stone. The guards at the doors draw their swords, and Vance throws off his chain of office. In his chains, Halbrecht begins to laugh.'},
  {who:'King Osric',text:'Guards of the Crown, to me! Those who stand with Vance, die with him!'}
 ],
 oldhavenPardon:()=>[
  {text:'Vance falls on the steps of the dais, and the hall goes quiet. The guards who stood with him lower their swords one by one.'},
  {who:'King Osric',text:'I have kept faith with the wrong men for twenty years. And four people I called forgers have kept it for me.'},
  {who:'King Osric',text:'By my seal and my crown, the warrant against you is void, and the ransom on your heads is lifted. Let it be read in every town from Oldhaven to Thornwick. And let Mayor Halbrecht of Ironhill see the inside of the gaol he built for honest people.'},
  {who:'Mayor Halbrecht',text:'Majesty, I only did what I was told!'},
  {who:'King Osric',text:'Yes. That is what is wrong with you.'},
  {who:hn(0),text:'We ask nothing, majesty, except to walk our own road without a price on it.'},
  {who:'King Osric',text:'Then it is yours, and the gates of Oldhaven with it. But the road is long, and there is more written in that ledger than one reading can hold. Corvane was not the only man who wrote letters.'},
  {text:'On the table behind the king, Ishkander\'s letter lies open, the seal still unbroken. The road home is clear. The road onward is not.'}
 ]
});
function ohCourtFight(){
  const F=G.flags;F.courtFight=1;
  const v=G.decor.find(d=>d.npc==='oh_vance');if(v)v.hidden=true;
  seaSpawn('chancellor',3,true);for(let i=0;i<4;i++)seaSpawn('rguard',5,true);
  msg('Chancellor Vance draws a sword from under his robe.','#ff8a7a');
}
function oldhavenPardon(){
  const F=G.flags;if(F.pardoned)return;F.pardoned=1;F.wanted=0;
  for(const e of G.enemies)if(e.t==='rguard'&&e.hp>0){e.hp=0;e.dying=.55}
  const hb=G.decor.find(d=>d.npc==='oh_halb');if(hb)hb.hidden=true;
  startCut('oldhavenPardon',()=>{if(qSt('vq6')===null)qAccept('vq6');if(qReady('vq6'))qTurnIn('vq6');msg('The warrant is void. The ransom is lifted.','#ffe36a');sfx('win')});
}
function ohEnter(n){
  const F=G.flags;
  if(n===OH.COURT){
    const k=G.decor.find(d=>d.npc==='oh_halb');if(k&&F.pardoned)k.hidden=true;const v=G.decor.find(d=>d.npc==='oh_vance');if(v&&(F.courtFight))v.hidden=true;
    if(!F.courtSeen){F.courtSeen=1;if(qSt('vq6')===null)qAccept('vq6');startCut('oldhavenCourt',ohCourtFight)}
  }
}
