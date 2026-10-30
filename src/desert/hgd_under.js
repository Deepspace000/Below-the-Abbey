/* ==========================================================================
   THE UNDERLEVEL (prefix hgdu / HGDU), level 476: a very dark, sparse labyrinth under the Deeper Hollow maze (level 475). Twelve ladders on the surface go down to it, at places in
   different precincts; the same twelve ladders go back up, so a long walk under the ground comes up somewhere far away. Long straight corridors join the ladders, with dead ends,
   small nests and no light. No food, no torches, no gold. A great many tough dark insects (little xp, no gold) that leave afflictions, and the Messenger of Death wanders there with his five letters.
   Ladders are wall tiles drawn in code (a shaft in the wall with a wooden ladder): walk into one and answer the prompt.
   ========================================================================== */
const HGDU={ID:476,DIFF:80,N:12};
LEVEL_NAMES[HGDU.ID]='The Underlevel';LEVEL_RATING[HGDU.ID]=HGDU.DIFF;
/* ---------- the dark insects ---------- */
/* twenty frightening creatures, all painted (assets/ds_hgslime*.png and ds_hgyuck*.png): ten black slime monsters and ten demonic horrors. Every one has red glowing eyes; the bodies are darkened at load so that, in the dark, the eyes are most of what is seen */
const HGDU_SL=['Tar Walker','Eye Puddle','Tentacle Ooze','Slime Spider','Slime Serpent','Maw Slime','Slime Hound','Skull Slime','Many-Armed Horror','Eye Mass'],HGDU_YK=['Flesh Maggot Demon','Chest-Eyed Crawler','Skinned Hound','Faced Centipede','Split-Jaw Ghoul','Horned Spider Demon','Tentacled Eye Horror','Leather Imp','Skull Pile','Spined Bone Beast'];
const HGDU_VB=['smothers','engulfs','lashes','bites','strangles','devours','mauls','screams at','crushes','blinds'],HGDU_YV=['gnaws','claws','rends','whips','rips','impales','gazes at','slashes','grasps','tears'];
const HGDU_KINDS=[];
HGDU_SL.forEach((n,i)=>HGDU_KINDS.push(['hgusl'+i,n,'art_hgslime'+i,null,{hp:360+i*28,dmg:[15+i,26+i],xp:30+i*3,w:i===1?1.9:i===9?2.0:1.5,verb:HGDU_VB[i]}]));
HGDU_YK.forEach((n,i)=>HGDU_KINDS.push(['hguyk'+i,n,'art_hgyuck'+i,null,{hp:380+i*30,dmg:[16+i,28+i],xp:34+i*3,w:i===3?1.8:1.5,verb:HGDU_YV[i]}]));
for(const [id,name,img,,o] of HGDU_KINDS){ENEMY_DEF[id]=Object.assign({name,hp:o.hp,dmg:o.dmg,hit:.82,w:o.w,img:'hgu_'+id,xp:o.xp,gold:[0,0],speed:1,verb:o.verb,aboveParty:0,glow:.95},{});if(typeof NO_VARY!=='undefined')NO_VARY.push(id)}
// the bodies are darkened to near black; red pixels (the eyes) are kept and made brighter
function hgduArt(){for(const [id,,img] of HGDU_KINDS){const src=IMG[img];if(IMG['hgu_'+id]||!src||!src.width)continue;try{
  const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.drawImage(src,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data;
  const eye=document.createElement('canvas');eye.width=c.width;eye.height=c.height;const ex=eye.getContext('2d'),ed=ex.createImageData(c.width,c.height),q=ed.data;
  for(let k=0;k<p.length;k+=4){const r=p[k],g=p[k+1],b=p[k+2];if(p[k+3]>40&&r>120&&g<110&&b<110&&r>g*1.7){p[k]=255;p[k+1]=Math.min(70,g);p[k+2]=Math.min(60,b);q[k]=255;q[k+1]=30;q[k+2]=20;q[k+3]=255}else{p[k]*=.32;p[k+1]*=.3;p[k+2]*=.3}}
  x.putImageData(d,0,0);ex.putImageData(ed,0,0);
  x.save();x.globalCompositeOperation='lighter';x.filter='blur('+Math.max(3,c.width/55)+'px)';x.globalAlpha=.9;x.drawImage(eye,0,0);x.filter='blur('+Math.max(8,c.width/22)+'px)';x.globalAlpha=.55;x.drawImage(eye,0,0);x.restore();
  IMG['hgu_'+id]=c;try{wlTrimFoot('hgu_'+id)}catch(e){}}catch(e){console.error('hgduArt',e)}}}   // cut to the feet, so that nothing walks a little above the floor
/* the fight window: a creature is drawn at most about .8 of a wall high (fitScale), but never smaller than .3 of its painted size, so the tall thin pictures of the slimes,
   horrors and demon-insects came out taller than the window and lost their heads. Their size in squares is capped so that the fit always brings them inside it. */
{const _fs=fitScale;fitScale=function(t,def,base){if(base&&base.width&&def&&/^(hgusl|hguyk|hgdemon)\d$/.test(t)){const mx=2.6*base.width/base.height;if(def.w>mx)def.w=Math.round(mx*1000)/1000}return _fs.apply(this,arguments)}}
// what the bites leave behind
AFFL_HITS.push([/^hgusl/,'poisoned',.22],[/^hguyk/,'bleeding',.22],[/^hguyk[35]/,'fever',.14],[/^hgusl[37]/,'stung',.2],[/^hgu/,'shaken',.1],[/^hgu/,'graverot',.07]);
{const _aa=afflArea;afflArea=function(n,L){const r=_aa.apply(this,arguments);if(n===HGDU.ID){r.msgText='The air is close and sour, and something is clicking in the walls. You cannot see more than a step.'}return r}} // only a line of text on arrival: the party is no longer afflicted with nobody near (it used to roll tomblung, shaken, fleas and fever at every arrival; the bites of the creatures still leave afflictions)
/* ---------- the ladders: wall tiles ---------- */
function hgduTex(up){const P=IMG['art_tex_hgdp_ladder'+(up?'up':'dn')];if(P&&P.width)return 'art_tex_hgdp_ladder'+(up?'up':'dn');const key='hgdu_ladder_'+(up?'up':'down');if(IMG[key])return key;
  IMG[key]=mkCanvas(128,128,(x,w,h)=>{const b=IMG.tex_abbeywall;if(b)x.drawImage(b,0,0,w,h);else{x.fillStyle='#3a3630';x.fillRect(0,0,w,h)}
    x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,0,w,h);
    // the shaft: an arched dark opening
    const g=x.createLinearGradient(0,0,0,h);if(up){g.addColorStop(0,'#cdb888');g.addColorStop(.35,'#2a2218');g.addColorStop(1,'#0c0a08')}else{g.addColorStop(0,'#2a2218');g.addColorStop(.5,'#0c0a08');g.addColorStop(1,'#000')}
    x.fillStyle=g;x.beginPath();x.moveTo(26,h);x.lineTo(26,48);x.quadraticCurveTo(26,12,64,12);x.quadraticCurveTo(102,12,102,48);x.lineTo(102,h);x.closePath();x.fill();
    x.strokeStyle='#14100a';x.lineWidth=3;x.stroke();
    // the ladder: two rails and rungs
    x.strokeStyle='#8a6030';x.lineWidth=5;x.beginPath();x.moveTo(48,10);x.lineTo(48,h);x.moveTo(80,10);x.lineTo(80,h);x.stroke();
    x.strokeStyle='#b88848';x.lineWidth=2;x.beginPath();x.moveTo(46,10);x.lineTo(46,h);x.moveTo(78,10);x.lineTo(78,h);x.stroke();
    x.strokeStyle='#7a5228';x.lineWidth=4;for(let y=22;y<h;y+=19){x.beginPath();x.moveTo(48,y);x.lineTo(80,y);x.stroke()}
    // an arrow cut into the lintel
    x.fillStyle='rgba(230,210,150,.8)';x.beginPath();if(up){x.moveTo(64,4);x.lineTo(74,14);x.lineTo(54,14)}else{x.moveTo(64,16);x.lineTo(74,6);x.lineTo(54,6)}x.closePath();x.fill();
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=3;x.strokeRect(1.5,1.5,w-3,h-3)});
  return key}
/* ---------- placing the twelve ladders on the surface ---------- */
function hgduLadders(L){
  if(L._hgdu)return;const M=L._hgdm,W=M.W,H=M.H,kind=M.kind,rows=L.rows.map(r=>r.split('')),rnd=hgdmRng(476001),P=L._hgdp,open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const TM=ohTiles(),chDown=String.fromCharCode(0x330);
  OH_STY.hgdu_down=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'tex_abbeywall',door:hgduTex(false),win:'tex_abbeywall',alt:'tex_abbeywall',zoom:1,contrast:1.0,tint:[255,255,255,0]}); // one ladder at the bottom, plain stone above it
  L.chars[chDown]=TM.make('door','hgdu_down',2.7).gid;
  const cands=[];for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){if(!open(x,y)||!reach.has(x+','+y)||occ.has(x+','+y))continue;if(!kind[y*W+x])continue;
    if(P.zones.some(z=>z.type==='safe'&&Math.hypot(z.x-x,z.y-y)<=z.r+3))continue;
    for(const [a,b] of [[0,-1],[1,0],[0,1],[-1,0]]){const wx=x+a,wy=y+b,c=rows[wy][wx];if(c==='.'||c.charCodeAt(0)<0x2e0||c.charCodeAt(0)>=0x2e8)continue;
      // the wall must be a plain wall of a clearing or room: open ground all round the front, solid behind and beside
      if(!open(x-a*0+b,y+a*0-a)&&false)continue;cands.push([x,y,wx,wy,a,b]);break}}
  cands.sort(()=>rnd()-.5);const out=[];
  for(const c of cands){if(out.length>=HGDU.N)break;if(out.every(o=>Math.hypot(o.ax-c[0],o.ay-c[1])>=34)){out.push({ax:c[0],ay:c[1],x:c[2],y:c[3],dx:c[4],dy:c[5]})}}
  for(const l of out){rows[l.y][l.x]=chDown;occ.add(l.ax+','+l.ay)}
  L.rows=rows.map(r=>r.join(''));
  L._hgdu={ladders:out}}
/* ---------- the underlevel ---------- */
function hgduBuild(){
  if(LEVELS[HGDU.ID])return;const S=LEVELS[HGD.ID];if(!S||!S._hgdu){try{hgBuild();hgdBuild()}catch(e){console.error(e)}}
  const SU=LEVELS[HGD.ID]._hgdu,W=201,H=201,rnd=hgdmRng(476002),g=[];hgduArt();
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const prot=new Set(SU.ladders.map(l=>l.x+','+l.y)),inb=(x,y)=>x>=2&&y>=2&&x<W-2&&y<H-2,carve=(x,y)=>{if(inb(x,y)&&!prot.has(x+','+y))g[y][x]='.'};
  const nodes=SU.ladders.map(l=>({x:l.ax,y:l.ay,lad:true}));
  for(let i=0;i<26;i++)nodes.push({x:6+((rnd()*(W-12))|0),y:6+((rnd()*(H-12))|0)});
  // the arrival squares and the corridor leaving each ladder
  for(const l of SU.ladders){carve(l.ax,l.ay);carve(l.ax-l.dx,l.ay-l.dy);carve(l.ax-l.dx*2,l.ay-l.dy*2)}
  const route=(x0,y0,x1,y1,hf)=>{const out=[];let x=x0,y=y0;const hs=()=>{while(x!==x1){x+=Math.sign(x1-x);out.push([x,y])}},vs=()=>{while(y!==y1){y+=Math.sign(y1-y);out.push([x,y])}};if(hf){hs();vs()}else{vs();hs()}return out};
  const run=(x0,y0,x1,y1)=>{let r=route(x0,y0,x1,y1,rnd()<.5);if(r.some(c=>prot.has(c[0]+','+c[1]))){r=route(x0,y0,x1,y1,false);if(r.some(c=>prot.has(c[0]+','+c[1])))r=route(x0,y0,x1,y1,true)}
    if(r.some(c=>prot.has(c[0]+','+c[1]))){ // both ways cross a ladder wall: go round by a point beside it
      const mx=Math.max(4,Math.min(W-5,x0+((x1-x0)>>1)+((rnd()-.5)*8|0))),my=Math.max(4,Math.min(H-5,y0+((y1-y0)>>1)+((rnd()-.5)*8|0)));const r1=route(x0,y0,mx,my,true),r2=route(mx,my,x1,y1,false);r=r1.concat(r2)}
    for(const c of r)carve(c[0],c[1])};
  const path=(a,b)=>{let cx=a.x,cy=a.y;const wps=rnd()<.6?1:rnd()<.5?0:2;for(let k=0;k<wps;k++){const wx=Math.max(4,Math.min(W-5,Math.round((a.x+b.x)/2+(rnd()-.5)*70))),wy=Math.max(4,Math.min(H-5,Math.round((a.y+b.y)/2+(rnd()-.5)*70)));run(cx,cy,wx,wy);cx=wx;cy=wy}run(cx,cy,b.x,b.y)};
  // a spanning tree of long corridors between the nodes, then a few more to make loops
  const inT=[0],edges=[];while(inT.length<nodes.length){let best=null,bd=1e9;for(const i of inT)for(let j=0;j<nodes.length;j++){if(inT.includes(j))continue;const d=Math.abs(nodes[i].x-nodes[j].x)+Math.abs(nodes[i].y-nodes[j].y);if(d<bd){bd=d;best=[i,j]}}inT.push(best[1]);edges.push(best)}
  for(let k=0;k<14;k++){const i=(rnd()*nodes.length)|0;let j=(rnd()*nodes.length)|0;if(i===j)continue;const d=Math.abs(nodes[i].x-nodes[j].x)+Math.abs(nodes[i].y-nodes[j].y);if(d<130&&!edges.some(e=>(e[0]===i&&e[1]===j)||(e[0]===j&&e[1]===i)))edges.push([i,j])}
  for(const [i,j] of edges)path(nodes[i],nodes[j]);
  // dead-end spurs and small nests
  const spurs=[],dirs=[[0,-1],[1,0],[0,1],[-1,0]];
  for(let k=0;k<24;k++){const n=nodes[(rnd()*nodes.length)|0],d=dirs[(rnd()*4)|0],len=14+((rnd()*30)|0);let x=n.x,y=n.y,l=0;while(l<len&&inb(x+d[0],y+d[1])){x+=d[0];y+=d[1];carve(x,y);l++;if(rnd()<.07){const t=dirs[(rnd()*4)|0];if(t[0]!==-d[0]||t[1]!==-d[1]){d[0]=t[0];d[1]=t[1]}}}if(l>=10)spurs.push([x,y,d.slice()])}
  const nests=[];for(let k=0;k<12;k++){const n=nodes[(rnd()*nodes.length)|0],ox=n.x+((rnd()-.5)*20|0),oy=n.y+((rnd()-.5)*20|0),r=2;for(let y=oy-r;y<=oy+r;y++)for(let x=ox-r;x<=ox+r;x++)carve(x,y);nests.push([ox,oy])}
  // the ladders up, in the same walls as the ladders down
  const TM=ohTiles(),chars={};
  const BR=IMG.art_tex_hgdu_brick&&IMG.art_tex_hgdu_brick.width?'art_tex_hgdu_brick':null,BR2=IMG.art_tex_hgdu_brick2&&IMG.art_tex_hgdu_brick2.width?'art_tex_hgdu_brick2':BR;
  OH_STY.hgdu_rock=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:BR||(IMG.art_tex_hgdp_cave?'art_tex_hgdp_cave':'art_tex_wall_cave'),door:BR||'art_tex_wall_cave',win:BR2||'art_tex_wall_cave',alt:BR2||'art_tex_wall_cave',zoom:1,contrast:1.0,tint:[4,3,5,.5]});
  OH_STY.hgdu_up=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:BR||'art_tex_wall_cave',door:hgduTex(true),win:BR||'art_tex_wall_cave',alt:BR||'art_tex_wall_cave',zoom:1,contrast:1.0,tint:[4,3,5,.5]});
  chars['#']=TM.make('plain','hgdu_rock',2.7).gid;const chUp=String.fromCharCode(0x331);chars[chUp]=TM.make('door','hgdu_up',2.7).gid;
  for(const l of SU.ladders)g[l.y][l.x]=chUp;
  // enemies: a great many, spread along every corridor, thicker in the nests; none near the ladders
  const cells=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(g[y][x]==='.'&&!SU.ladders.some(l=>Math.hypot(l.ax-x,l.ay-y)<8))cells.push([x,y]);
  const enemies=[],used=new Set();const ids=HGDU_KINDS.map(k=>k[0]);
  for(let k=0;k<340&&cells.length;k++){const c=cells.splice((rnd()*cells.length)|0,1)[0];used.add(c[0]+','+c[1]);enemies.push({t:ids[(rnd()*ids.length)|0],x:c[0],y:c[1]})}
  for(const n of nests)for(let k=0;k<7;k++){const x=n[0]+((rnd()*5-2)|0),y=n[1]+((rnd()*5-2)|0);if(g[y]&&g[y][x]==='.'&&!used.has(x+','+y)){used.add(x+','+y);enemies.push({t:ids[(rnd()*ids.length)|0],x,y})}}
  // ten demon-insect bosses wander the corridors, far apart (see hgd_minis.js)
  {const bs=[];for(const c of cells.slice().sort(()=>rnd()-.5)){if(bs.length>=10)break;if(bs.every(o=>Math.hypot(o[0]-c[0],o[1]-c[1])>=32)&&!SU.ladders.some(l=>Math.hypot(l.ax-c[0],l.ay-c[1])<22)&&!used.has(c[0]+','+c[1])){bs.push(c);used.add(c[0]+','+c[1]);enemies.push({t:'hgdemon'+(bs.length-1),x:c[0],y:c[1]})}}}
  // the Messenger of Death and his five letters, one at the end of each of five far-apart dead ends
  const letters=[];const sp=spurs.slice().sort(()=>rnd()-.5);
  for(const s of sp){if(letters.length>=5)break;if(letters.every(l=>Math.hypot(l.x-s[0],l.y-s[1])>=40)){const w=dirs.find(d=>g[s[1]+d[1]]&&g[s[1]+d[1]][s[0]+d[0]]==='#');if(w)letters.push({x:s[0],y:s[1],wd:[w[0],w[1]]})}}
  const mid=cells.length?cells[(rnd()*cells.length)|0]:[W>>1,H>>1];
  const a0=SU.ladders[0];
  // a warm lamp at every ladder, and a faint light every dozen squares or so along the corridors, so the walls and ladders can be read
  const ulights=SU.ladders.map(l=>[l.ax,l.ay]);{let k=0;for(const c of cells){if((c[0]*7+c[1]*13)%53===0&&ulights.every(q=>Math.hypot(q[0]-c[0],q[1]-c[1])>=12)&&k++<60)ulights.push([c[0],c[1]])}}
  const L={rows:g.map(r=>r.join('')),start:{x:a0.ax,y:a0.ay,f:0},enemies,items:[],decor:[],chars,day:0,amb:0,floor:FLOORS.hgduf?'hgduf':'dirt',floor2:FLOORS.hgduf2?'hgduf2':'mud',name:'The Underlevel',label:'The Underlevel',diff:HGDU.DIFF,ceilH:2.2,torchGap:1e9,noTele:true,noExtras:true,portals:[],lights:ulights,
    _hgdu:{ladders:SU.ladders,spurs:spurs.length,nests:nests.length,letters},_msgr:letters.length===5?{x:mid[0],y:mid[1],letters:letters.map((l,i)=>({k:MSG_LETTERS[i],x:l.x,y:l.y,wd:l.wd}))}:null,
    mapNames:[{t:'The Underlevel',x:100,y:100,k:'place'}]};
  LEVELS[HGDU.ID]=L}
KH_LAZY[HGDU.ID]=()=>{hgBuild();hgdBuild();hgduBuild()};
/* the Messenger wanders here: the record is made from the level when it is entered (his usual way: he lurks, rushes, touches and hides) */
{const _mp=msgrPlace;msgrPlace=function(){try{const F=G.flags,L=LEVELS[LEVEL];if(LEVEL===HGDU.ID&&L&&L._msgr){F.msgrLv=F.msgrLv||{};if(!F.msgrLv[LEVEL]){const m=L._msgr;F.msgrLv[LEVEL]={x:m.x,y:m.y,letters:m.letters.map(q=>({k:q.k,x:q.x,y:q.y,wd:q.wd})),state:'lurk',born:G.rounds,hp:null}}}}catch(e){console.warn('hgdu msgr',e)}return _mp.apply(this,arguments)}}
/* ---------- walking into a ladder ---------- */
function hgduPrompt(text,opts){G.talk={d:{k:'_',x:G.P.x,y:G.P.y},n:{name:'A ladder'},node:say(text,opts),t:G.time,btns:[]};G.hold=null;G.queued=null}
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(LEVEL===HGD.ID){const L=LEVELS[LEVEL],i=L&&L._hgdu&&L._hgdu.ladders.findIndex(l=>l.x===nx&&l.y===ny);
      if(i>=0){const l=L._hgdu.ladders[i];sfx('locked');
        hgduPrompt('Do you want to descend into the underlevel? It is very dark and dangerous. Make sure you have food and torches if you do.',[['Descend.',()=>{G.talk=null;sfx('door');hgduGo(i,true);return null}],['Not now.',()=>null]]);return true}}
    else if(LEVEL===HGDU.ID){const L=LEVELS[LEVEL],i=L&&L._hgdu&&L._hgdu.ladders.findIndex(l=>l.x===nx&&l.y===ny);
      if(i>=0){hgduPrompt('A ladder leads up to the surface of the maze. Do you want to climb up?',[['Climb up.',()=>{G.talk=null;sfx('door');hgduGo(i,false);return null}],['Not yet.',()=>null]]);return true}}}catch(e){console.warn('hgdu',e)}
  return _db.apply(this,arguments)}}
function hgduGo(i,down){
  const SU=LEVELS[HGD.ID]._hgdu.ladders[i],f=DIRS.findIndex(d=>d[0]===-SU.dx&&d[1]===-SU.dy);
  const to=down?HGDU.ID:HGD.ID;if(down){try{hgduBuild()}catch(e){console.error(e)}}
  goToLevel(to,{x:SU.ax,y:SU.ay,f:f<0?0:f});G.cut=null;
  msg(down?'You climb down into the dark. The air is close, and something clicks in the walls.':'You climb up into the light.',down?'#c8a0e0':'#e8e0a0')}
// the people talk about it
if(typeof HGDP_WARN!=='undefined'){HGDP_WARN.push('Some ladders go down to a level under the maze. Nobody who goes down without food and torches comes back with both.');HGDP_GOSS.push('There is a level under the maze, long dark corridors and nothing else. The ladders down are in the clearings, and the ladders up come out far away from where you went down.','The dark insects under the maze are tough, and they give little for the killing. Leave them be.')}
// the surface ladders are placed once the maze is complete
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdf)try{hgduLadders(L)}catch(e){console.error('hgdu ladders',e)}}}
