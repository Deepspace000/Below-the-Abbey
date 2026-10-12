/* ==========================================================================
   THE CARAVANS. Now and then (rarely) a trading caravan is crossing an open desert: one to four camels in a line, each
   carrying a nomad rider or a load, and a few nomads on foot behind. They walk back and forth along a straight route
   and stop when you come close. Walk into any of them to talk, and to buy water and food.
   ========================================================================== */
const CV_CHANCE=.28;   // the chance that a given visit to an open desert has a caravan
const CV_LEVELS=[41,43,60,61,62,63,64];
const CV_STOCK=[['water',14],['dates',10],['bread',8],['cheese',6],['apple',6]];
NPCS.caravan={name:'Caravan trader',img:'cvnomadA',root:d=>{
  const F=G.flags,lines=[
    'Peace on your road. We carry water, dates and bread across the sand, and we sell what we can spare.',
    'You are a long way from any well. Buy water while you can. The next oasis is further than it looks.',
    'We have been walking since before dawn. Take what you need, and pay fairly.',
    'The sand is quiet today. When the wind rises, we stop and wait it out. You should do the same.'];
  const i=(F.cvTalk||0)%lines.length;F.cvTalk=i+1;
  return say(lines[i],[['Buy water and food',()=>{openShop(d,CV_STOCK,'The Caravan');return null}],BYE]);
}};
for(const n of CV_LEVELS)STREAM_LISTS[n]=['music_sands_goldenkey']; // Golden Key plays in every open desert
function cvFlip(k){ // the mirror of a picture, made once from the painted one
  const im=IMG[k];if(!im||IMG[k+'f'])return;
  IMG[k+'f']=mkCanvas(im.width,im.height,(x,w,h)=>{x.translate(w,0);x.scale(-1,1);x.drawImage(im,0,0)});
}
function makeCaravanArt(){NPC_H.camelrE=1.05;NPC_H.camelrW=1.05;NPC_H.camelpE=.82;NPC_H.camelpW=.82;NPC_H.cvnomadA=.62;NPC_H.cvnomadB=.62;NPC_H.cvnomadAf=.62;NPC_H.cvnomadBf=.62}
function maybeSpawnCaravan(){
  if(!CV_LEVELS.includes(LEVEL)||Math.random()>CV_CHANCE)return;
  const L=LEVELS[LEVEL],rows=L.rows,W=rows[0].length,H=rows.length,T=terrFor(LEVEL);
  const blocked=new Set();for(const d of G.decor)if(d.block)blocked.add(d.y*W+d.x);
  const clear=(x,y)=>{const cx=Math.floor(x),cy=Math.floor(y);if(cx<3||cy<3||cx>=W-3||cy>=H-3)return false;if(rows[cy][cx]!=='.')return false;if(T&&T.block&&T.block[cy*W+cx])return false;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(blocked.has((cy+dy)*W+cx+dx))return false;
    if(LEVEL===41&&(cy>140||rdBiome(cx,cy)<.7))return false;return true};
  const px=G.P.x,py=G.P.y;
  for(let t=0;t<500;t++){
    const x0=20+Math.random()*(W-40),y0=20+Math.random()*(H-40),a=Math.random()*Math.PI*2,len=45+Math.random()*60,x1=x0+Math.cos(a)*len,y1=y0+Math.sin(a)*len;
    if(Math.hypot((x0+x1)/2-px,(y0+y1)/2-py)<14)continue;
    let ok=true;for(let s=0;s<=len&&ok;s+=1.5)if(!clear(x0+(x1-x0)*s/len,y0+(y1-y0)*s/len))ok=false;
    if(!ok)continue;
    const camels=1+Math.floor(Math.random()*4),walkers=1+Math.floor(Math.random()*3),members=[];
    const add=(k,camel)=>{const d={k,x:0,y:0,block:true,npc:'caravan',caravan:true,camel};G.decor.push(d);members.push(d)};
    for(let i=0;i<camels;i++)add(i===0||Math.random()<.45?'camelrE':'camelpE',true);
    for(let i=0;i<walkers;i++)add('cvnomadA',false);
    // distance behind the leader: camels two cells apart, a gap, then the walkers a cell and a half apart
    const offs=[];let o=0;members.forEach((d,i)=>{offs.push(o);o+=d.camel?2.1:(i===camels?2.6:1.6)});
    G.caravan={x0:x0+.5,y0:y0+.5,x1:x1+.5,y1:y1+.5,len,D:Math.random()*len*2,speed:.75,members,offs,t:0};
    return;
  }
}
function caravanTick(dt){
  if(G.state!=='play')return;
  if(G._cvLevel!==LEVEL||G._cvDecor!==G.decor){G._cvLevel=LEVEL;G._cvDecor=G.decor;G.caravan=null;maybeSpawnCaravan();G._cvDecor=G.decor}
  const C=G.caravan;if(!C)return;
  if(!IMG.cvnomadAf){cvFlip('cvnomadA');cvFlip('cvnomadB')}
  C.t+=dt;
  // stop while you are talking, shopping, or standing close to any of them
  let near=!!(G.talk||G.loot);
  if(!near)for(const d of C.members)if(Math.abs(d.x-G.P.x)+Math.abs(d.y-G.P.y)<=2){near=true;break}
  if(!near)C.D+=dt*C.speed;
  const dx=C.x1-C.x0,dy=C.y1-C.y0,L2=C.len*2;
  const at=(D)=>{let m=((D%L2)+L2)%L2;const f=m<C.len?m:L2-m;return [C.x0+dx*f/C.len,C.y0+dy*f/C.len,m<C.len?1:-1]};
  C.members.forEach((d,i)=>{
    const [x,y,dir]=at(C.D-C.offs[i]);
    d.x=Math.floor(x);d.y=Math.floor(y);d.ox=x-(d.x+.5);d.oy=y-(d.y+.5);
    const E=(dx*dir)>0||((Math.abs(dx)<.5)&&(dy*dir)>0);
    if(d.camel){const rider=d.k.startsWith('camelr');d.k=(rider?'camelr':'camelp')+(E?'E':'W');d.bob=.015+.012*Math.abs(Math.sin(C.t*5+i*1.7))}
    else{d.k=((Math.floor(C.t*3+i)&1)?'cvnomadB':'cvnomadA')+(E?'f':'');d.bob=.01+.012*Math.abs(Math.sin(C.t*6+i))}
  });
}
