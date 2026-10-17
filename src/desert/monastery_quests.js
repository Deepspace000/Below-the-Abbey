/* ==========================================================================
   SAINT ELEN'S MONASTERY, part two: the ten quiet quests, the people who give them, and the generator for the crypts below.
   ========================================================================== */
const MON_FOLK={herb:['mon_herb','Brother Herbert, the herbalist','kh_ohfolk2_3'],cook:['mon_cook','Brother Cook','kh_ohfolk2_2'],scribe:['mon_scribe','Brother Scribe','kh_ohfolk5_4'],bees:['mon_bees','Brother Bee-keeper','kh_ohfolk3_3'],
  cellar:['mon_cellar','Brother Cellarer','kh_ohfolk1_0'],bell:['mon_bellman','Brother Bellringer','kh_ohfolk7_1'],abbot:['mon_abbot','Abbot Anselm','kh_ohfolk2_1'],wilma:['mon_wilma','Sister Wilma, the cemetery gardener','kh_ohfolk5_2']};
monq('mq1','Meet the Brothers','Abbot Anselm','Abbot Anselm would like you to say good day to four of the brothers: Brother Herbert in the herb garden, Brother Cook in the kitchen, Brother Scribe in the scriptorium and Brother Bee-keeper by the hives.',4,()=>['mon_herb','mon_cook','mon_scribe','mon_bees'].filter(i=>MONF().met[i]).length,{gold:300,xp:3000});
monq('mq2','Herbs for the Infirmary','Brother Herbert, the herbalist','The infirmary is low on herbs. Pick 6 herbs in the herb garden and bring them to Brother Herbert.',6,()=>Math.min(6,bagCount('herb')),{gold:250,xp:2500});
monq('mq3','Apples for the Pilgrims','Brother Cook','Brother Cook is making pies for the pilgrims. Bring him 8 apples from the orchard.',8,()=>Math.min(8,bagCount('apple')),{gold:250,xp:2500});
monq('mq4','A Little Honey','Brother Bee-keeper','Gather 3 honeycombs from near the hives and bring them to the bee-keeper.',3,()=>Math.min(3,bagCount('honeycomb')),{gold:300,xp:3000});
monq('mq5','Flowers for the Graves','Sister Wilma, the cemetery gardener','Sister Wilma lays a flower on every grave on the feast of Saint Elen. Pick 6 wildflowers in the monastery grounds and bring them to her in the cemetery.',6,()=>Math.min(6,bagCount('wildflower')),{gold:300,xp:3000});
monq('mq6','The Cold Cellar','Brother Cellarer','Ghosts have come up from the old crypts into the cellars and the brothers cannot keep the wine in peace. Lay 6 of them to rest.',6,q=>(G.flags.k_ghost||0)-(q.base||0),{gold:500,xp:6000},{cnt:'k_ghost'});
monq('mq7','A Letter for the Cold Spring','Brother Scribe','Take the monastery’s letter to Osk, the innkeeper of the Cold Spring Inn, on the Pilgrim’s Path, a little way along the mountain road.',1,()=>MONF().letter?1:0,{gold:300,xp:3000});
monq('mq8','The Abbot’s Ring','Abbot Anselm','The ring of the old abbot lies in a chest in the old crypts, below the cellars. Bring it back, so that he can rest.',1,()=>Math.min(1,bagCount('abbotring')),{gold:700,xp:8000});
monq('mq9','Ring the Bell','Brother Bellringer','The bell has not been rung for three days, because the bell-ringer has a cold. Ring it once, at the foot of the church.',1,()=>MONF().bell?1:0,{gold:200,xp:2000});
monq('mq10','A Quiet Hour','Brother Hilarion, the guest-master','Take a quiet hour at the guest house. Rest by the fire, and let the brothers look after you.',1,()=>MONF().rest?1:0,{gold:200,xp:2000});
const MOND={
 mq1:khQD('Welcome to Saint Elen’s. We have no rules for visitors except to be kind to the bees. If you would like to be useful, say good day to four of the brothers: Herbert in the herb garden, Cook in the kitchen, Scribe in the scriptorium and our bee-keeper by the hives. They are all very friendly.','Four brothers, then. Take your time. Nobody here hurries.',(g,n)=>`${g} of ${n} brothers met.`,'You have met them all? Good. Then you are one of us, for as long as you like. Please take this.','Thank you. Stay for supper.','You have met the brothers.','I have said good day to all four.'),
 mq2:khQD('Ah, a pair of hands. The infirmary herbs are running low, and the herb garden is in full bloom. Six herbs would last us the month. Just pick them from the beds.','Six herbs, from the garden beds. Mind the bees.',(g,n)=>`${g} of ${n} herbs.`,'Six herbs! The infirmary will smell of summer. Thank you.','Six herbs, and a good morning’s work.','The herbs are in.','Here are six herbs.'),
 mq3:khQD('Pies for the pilgrims. I have the pastry and the patience, and not an apple in the house. The orchard is full of them. Eight, please.','Eight apples from the orchard. Wait until they are warm from the sun.',(g,n)=>`${g} of ${n} apples.`,'Eight apples. The pilgrims will think it is a feast day. Thank you.','Eight apples, for the pies.','The pies are baking.','Here are eight apples.'),
 mq4:khQD('The hives are heavy this year. If you could bring me three honeycombs from beside them, we could make candles and a little mead. The bees do not mind, if you move slowly.','Three honeycombs from near the hives. Walk softly.',(g,n)=>`${g} of ${n} honeycombs.`,'Three honeycombs. The candles will smell of clover for a year.','Three honeycombs, and no stings.','The honey is gathered.','Here are three honeycombs.'),
 mq5:khQD('On the feast of Saint Elen I lay a flower on every grave in the cemetery. Nobody is forgotten here. If you could pick six wildflowers in the grounds and bring them to me, I would be glad of the help.','Six wildflowers. There are plenty on the lawns.',(g,n)=>`${g} of ${n} wildflowers.`,'Six wildflowers. That is six more graves with a flower on them. Thank you.','Six wildflowers.','The graves have their flowers.','Here are six wildflowers.'),
 mq6:khQD('Something is wrong in the cellars. Ghosts, the brothers say. Not dangerous, just sad, and very cold. They have been wandering up from the old crypts below. If you could lay six of them to rest, we would all sleep better. The hatch is in the herb garden.','Six ghosts. They are in the cellars, below the hatch in the herb garden.',(g,n)=>`${g} of ${n} ghosts laid to rest.`,'The cellar is warm again! The wine is calm. Thank you.','Six ghosts, and a quiet cellar.','The cellar is quiet.','Six of them are at rest.'),
 mq7:khQD('I have a letter for Osk, the innkeeper of the Cold Spring Inn, along the mountain road. We have written to each other for thirty years and never once met. It is a very good friendship. Would you take it to him?','The Cold Spring Inn is on the Pilgrim’s Path, in the mountains. Take your time.',()=>'Osk at the Cold Spring Inn, on the Pilgrim’s Path.','You have delivered it? He wrote back already? What a man.','Thank you. Thirty years of letters, and one more.','The letter is delivered.','I delivered the letter.'),
 mq8:khQD('There was an abbot before me, Abbot Aldhelm. His ring was buried with him, but it was moved to a chest in the old crypts, and he has not rested since. If you could find the ring, I would put it where it belongs. The way down is by the cellars, and the crypts are below them.','The old crypts are below the cellars. The ring is in a chest, I believe.',()=>'The ring is in a chest in the old crypts, below the cellars.','The ring! Aldhelm can rest. Thank you, truly.','The abbot’s ring, back where it belongs.','The ring is found.','Here is the ring.'),
 mq9:khQD('The bell has not rung for three days. The bell-ringer has a cold, and I do not like to ask him. If you could ring it once, at the foot of the church, the whole valley would know that Saint Elen’s is still here.','Just ring it once. It is the bell at the foot of the church.',()=>'Ring the bell at the foot of the church.','You rang it? We heard it in the garden. The bees stopped to listen. Thank you.','The bell rang, and the valley heard it.','The bell has rung.','I rang the bell.'),
 mq10:khQD('You have walked a long way. Take a quiet hour at the guest house, by the fire. We will look after everything. That is not a request, it is what we do.','Rest by the fire. We will bring soup.',()=>'Rest by the fire in the guest house.','Rested? Good. A quiet hour is the best gift one can give oneself.','A quiet hour, and a full heart.','You are rested.','I have rested.')
};
khNpc('mon_herb',MON_FOLK.herb[1],MON_FOLK.herb[2],()=>{const M=MONF();M.met.mon_herb=1;if(qSt('mq2')==='done')return say('The infirmary is well supplied, thanks to you. The herbs are growing back already.',[BYE]);return qNode('mq2',MOND.mq2)},{q:'mq2'});
khNpc('mon_cook',MON_FOLK.cook[1],MON_FOLK.cook[2],()=>{const M=MONF();M.met.mon_cook=1;if(qSt('mq3')==='done')return say('The pies are in the oven, and the whole kitchen smells like a feast day.',[BYE]);return qNode('mq3',MOND.mq3)},{q:'mq3'});
khNpc('mon_scribe',MON_FOLK.scribe[1],MON_FOLK.scribe[2],()=>{const M=MONF();M.met.mon_scribe=1;if(qSt('mq7')==='done')return say('Osk wrote back. Of course he did. Thirty years of letters, and I still cannot read his handwriting.',[BYE]);return qNode('mq7',MOND.mq7)},{q:'mq7'});
khNpc('mon_bees',MON_FOLK.bees[1],MON_FOLK.bees[2],()=>{const M=MONF();M.met.mon_bees=1;if(qSt('mq4')==='done')return say('The bees are quiet today. They know the honey went to a good cause.',[BYE]);return qNode('mq4',MOND.mq4)},{q:'mq4'});
khNpc('mon_cellar',MON_FOLK.cellar[1],MON_FOLK.cellar[2],()=>{if(qSt('mq6')==='done')return say('The cellar is warm, the wine is calm and the barrels are in their rows. I could kiss you. I will not, but I could.',[BYE]);return qNode('mq6',MOND.mq6)},{q:'mq6'});
khNpc('mon_bellman',MON_FOLK.bell[1],MON_FOLK.bell[2],()=>{if(qSt('mq9')==='done')return say('I heard it from my bed. It sounded better than when I ring it.',[BYE]);return qNode('mq9',MOND.mq9)},{q:'mq9'});
khNpc('mon_bell','The monastery bell','memorial',()=>{const M=MONF();
  const ring=()=>{try{playSmp('church_bell1',.7,1)}catch(e){try{sfx('level')}catch(x){}}M.bell=1;msg('The bell rings out over the grounds, and the valley answers.','#e8d890');return say('A single, clear note rolls out over the gardens, over the wall and down the mountain. Somewhere a bird answers it.',[BYE])};
  return say('A great bronze bell hangs from an oak frame at the foot of the church, with a rope worn smooth by many hands.',[['Ring the bell.',ring],['Leave it.',()=>null]])});
khNpc('mon_abbot',MON_FOLK.abbot[1],MON_FOLK.abbot[2],()=>{
  const nodes=[];
  if(qSt('mq1')!=='done')return qNode('mq1',MOND.mq1);
  if(qSt('mq6')==='done'&&qSt('mq8')!=='done')nodes.push(['About the old abbot’s ring',()=>qNode('mq8',MOND.mq8)]);
  return say('Welcome. You are very welcome. The grounds are open to you, and the church, and the cloister. The cemetery is through the east gate, and the cellars are below the hatch in the herb garden. Take any seat that is empty.',[...nodes,BYE]);
},{q:['mq1','mq8']});
khNpc('mon_wilma',MON_FOLK.wilma[1],MON_FOLK.wilma[2],()=>{if(qSt('mq5')==='done')return say('Every grave has its flower. It is the best feast of the year.',[BYE]);return qNode('mq5',MOND.mq5)},{q:'mq5'});
// delivering the letter: Osk at the Cold Spring Inn
repWrap('lp_inn1',()=>qSt('mq7')==='active'&&!MONF().letter,'Deliver the monastery’s letter',()=>{MONF().letter=1;msg('You hand over the letter from Saint Elen’s.','#a8e8c0');return say('A letter from Brother Scribe! Thirty years of letters. Tell him I am well, and that my handwriting is as bad as ever. Thank you for bringing it.',[BYE])});

/* ---- the dungeons: rooms and passages in the old crypt style ---- */
function monCrypt(sp){
  const W=sp.W,H=sp.H,hs=hash2,R=(i,m)=>(hs(sp.n*31+i,sp.n*7+5,95)*m)|0,g=[];
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const rooms=[],cut=r=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.'};
  rooms.push({x0:(W>>1)-2,y0:H-5,x1:(W>>1)+2,y1:H-3});
  for(let t=0;t<900&&rooms.length<sp.rooms;t++){const big=sp.boss&&rooms.length===sp.rooms-1,w=big?9:4+R(100+t,4),h=big?7:3+R(200+t,3),x0=1+R(300+t,W-w-2),y0=1+R(400+t,H-h-2);
    if(rooms.some(r=>x0<=r.x1+2&&x0+w-1>=r.x0-2&&y0<=r.y1+2&&y0+h-1>=r.y0-2))continue;rooms.push({x0,y0,x1:x0+w-1,y1:y0+h-1})}
  rooms.forEach(cut);const mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  for(let i=1;i<rooms.length;i++){let bj=0,bd=1e9;const [ax,ay]=mid(rooms[i]);for(let j=0;j<i;j++){const [bx,by]=mid(rooms[j]),d=Math.abs(ax-bx)+Math.abs(ay-by)+R(500+i*9+j,6);if(d<bd){bd=d;bj=j}}
    const [bx,by]=mid(rooms[bj]),hl=(y,x0,x1)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)g[y][x]='.'},vl=(x,y0,y1)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)g[y][x]='.'};
    if(R(600+i,2)===0){hl(ay,ax,bx);vl(bx,ay,by)}else{vl(ax,ay,by);hl(by,ax,bx)}}
  const r0=rooms[0],ux=(r0.x0+r0.x1)>>1,uy=r0.y1+1;g[uy][ux]='0';const start={x:ux,y:r0.y1,f:0};
  const d=new Int16Array(W*H).fill(-1),q=[start.x+start.y*W];d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||g[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}
  let far=rooms[rooms.length-1],fd=-1;for(const r of rooms){const [mx,my]=mid(r),v=d[my*W+mx];if(v>fd){fd=v;far=r}}
  let down=null;if(sp.down){const dxm=(far.x0+far.x1)>>1;g[far.y0-1][dxm]='1';down={x:dxm,y:far.y0}}
  const rows=g.map((r,y)=>r.map((c,x)=>{if(c!=='#')return c;if(x>0&&g[y][x-1]==='.'&&hs(x,y,70+sp.n)<.07)return '%';if(y>0&&g[y-1][x]==='.'&&hs(x,y,71+sp.n)<.07)return '%';return '#'}).join(''));
  const decor=[],enemies=[],items=[],used=new Set([start.x+','+start.y]),cells=[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]==='.'&&d[y*W+x]>6)cells.push([x,y]);
  const pickc=i=>{for(let t=0;t<40;t++){const c=cells[R(900+i*13+t,cells.length)];if(c&&!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);return c}}return null};
  for(let i=0;i<sp.foes;i++){const c=pickc(i);if(c)enemies.push({t:sp.kinds[R(950+i,sp.kinds.length)],x:c[0],y:c[1]})}
  for(let i=0;i<3;i++){const c=pickc(100+i);if(c)items.push({k:'potion',x:c[0],y:c[1]})}
  for(let i=0;i<5;i++){const c=pickc(200+i);if(c)decor.push({k:['coffin','barrel','bones','coffin','grave'][i],x:c[0],y:c[1],block:i!==2})}
  if(sp.boss){const [mx,my]=mid(far);enemies.push({t:sp.boss,x:mx,y:my+1});decor.push({k:'chest',x:far.x0,y:far.y1,block:true,magic:1});if(sp.ring)items.push({k:'abbotring',x:far.x0+1,y:far.y1})}
  const lv={rows,start,enemies,items,decor,name:sp.name,label:sp.name,diff:sp.diff,portals:[{to:sp.up.to,x:sp.up.x,y:sp.up.y,f:sp.up.f,tex:'tomb'}],lights:[],_down:down};
  if(sp.down)lv.portals[1]={to:sp.down.to,x:0,y:0,f:0,tex:'tomb'};
  lv.mapNames=rooms.map((r,i)=>({t:i===0?sp.names[0]:(r===far&&sp.down)?sp.names[7]:sp.names[1+((i-1)%6)],x:mid(r)[0],y:r.y0-1,k:'place'}));
  return lv;
}
