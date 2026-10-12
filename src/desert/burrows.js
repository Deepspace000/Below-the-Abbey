/* ==========================================================================
   THE BURIED CHAMBERS (levels 50 to 59): ten little dungeons under mounds in the dunes. Each has a few chambers with
   creatures in them, vases and treasure, and a chest at the far end with a piece of magic gear.
   ========================================================================== */
const BUR_THEMES=[
  {name:'The Scorpion Nest',foes:[['scorpion',6]]},
  {name:'The Mummy Vault',foes:[['mummy',5]],ambush:true},
  {name:'The Nomads\' Hideout',foes:[['nomad',3],['nomad2',2],['dwolf',2]]},
  {name:'The Wolf Den',foes:[['dwolf',6]]},
  {name:'The Sunken Shrine',foes:[['scorpion',2],['mummy',2],['nomad',2]]}];
function buildBurrow(k){
  const W=21,H=16,g=[],fl=[],th=[],flip=k%2===1;
  for(let y=0;y<H;y++){g.push(new Array(W).fill('W'));fl.push(new Array(W).fill('0'));th.push(new Array(W).fill(''))}
  const mx=(x0,x1)=>flip?[W-1-x1,W-1-x0]:[x0,x1];
  const R=(x0,y0,x1,y1,ft,t)=>{const [a,b]=mx(x0,x1);for(let y=y0;y<=y1;y++)for(let x=a;x<=b;x++){g[y][x]='.';fl[y][x]=ft;th[y][x]=t}};
  const X=x=>flip?W-1-x:x;
  const decor=[],enemies=[],items=[],lights=[];
  const put=(kk,x,y,o)=>decor.push(Object.assign({k:kk,x:X(x),y,block:false},o||{}));
  const brazier=(x,y)=>{put('brazier',x,y,{block:true});lights.push([X(x),y])};
  const T=BUR_THEMES[k%BUR_THEMES.length];
  // the plan: an entrance, a way up to two chambers side by side, and the treasure room over them
  R(7,12,13,14,'2','crypt');R(10,10,10,11,'0','crypt');R(4,6,10,9,'0','crypt');R(12,6,17,9,'0','crypt');R(11,7,11,8,'0','crypt');R(6,1,15,4,'1','vault');R(7,5,7,5,'0','crypt');R(14,5,14,5,'0','crypt');
  g[15][X(10)]='0';
  const wall=(x,y,t)=>{const r=hash2(x,y,60+k);return t==='vault'?'G':(r<.4?'W':'H')};
  const rows=[];
  for(let y=0;y<H;y++){let row='';for(let x=0;x<W;x++){let c=g[y][x];if(c==='W'){let t='';for(let dy=-1;dy<=1&&!t;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<W&&ny<H&&g[ny][nx]==='.'){t=th[ny][nx];break}}c=t?wall(x,y,t):'W'}row+=c}rows.push(row)}
  // furnishings
  brazier(7,12);brazier(13,12);brazier(4,6);brazier(17,6);brazier(6,1);brazier(15,1);brazier(4,9);brazier(17,9);
  put('vase'+(k%4),8,14,{block:true});put('vase'+((k+1)%4),12,14,{block:true});put('vase'+((k+2)%4),5,8,{block:true});put('vase'+((k+3)%4),16,8,{block:true});
  put('chest',10,2,{block:true,magic:DS_MAGIC_TOMB[k%DS_MAGIC_TOMB.length],goldAmt:260+k*30});
  put('treasure',8,2,{block:true});put('treasure',13,2,{block:true});put('vase0',6,4,{block:true});put('vase2',15,4,{block:true});
  if(T.ambush){put('sarcoph',5,7,{block:true,ambush:['mummy','mummy']});put('sarcoph',16,7,{block:true,ambush:['mummy']})}
  else{put('sarcoph',14,8,{block:true});put('offering',9,3,{block:true})}
  // the creatures: spread over the two chambers and the way to the treasure
  const spots=[[6,7],[8,8],[6,9],[9,7],[13,7],[15,8],[14,9],[13,9],[8,4],[10,4],[12,4],[11,3]];
  let si=0;for(const [t,n] of T.foes)for(let i=0;i<n&&si<spots.length;i++,si++){let [sx,sy]=spots[si];enemies.push({t,x:X(sx),y:sy,lvl:15+(k%3)})}
  items.push({k:'potion',x:X(10),y:13});if(k%2)items.push({k:'bread',x:X(9),y:8});
  return {rows,fm:fl.map(r=>r.join('')),decor,enemies,items,lights,start:{x:X(10),y:14,f:0}};
}
for(let k=0;k<BURROW_N;k++){
  const B=buildBurrow(k),spot=SANDROAD.burrows[k]||{x:RD.W>>1,y:RD.CY-20};
  LEVELS[BURROW_BASE+k]={rows:B.rows,fmap:B.fm,start:B.start,enemies:B.enemies,items:B.items,decor:B.decor,lights:B.lights,secrets:[],
    amb:.34,ceilH:1.3,floor:'tombslab',floorSet:['tombslab','tombgold','tombsand','tombdark','tomblapis','tombred'],ceil:'tomb',name:BUR_THEMES[k%BUR_THEMES.length].name,label:'Buried Chamber',diff:15+(k%3),
    portals:[{to:41,x:spot.x,y:spot.y+1,f:2,tex:'tomb'}]};
}
// the tiny dungeons share the tomb's walls and the same music as the other small dungeons
function makeBurrowArt(){for(let k=0;k<BURROW_N;k++)LEVELS[BURROW_BASE+k].chars=LEVEL42_DATA.chars}
for(let k=0;k<BURROW_N;k++)EMBERS_LEVELS.push(BURROW_BASE+k);
