/* ==========================================================================
   TELEPORT STONES IN THE DEEPER HOLLOW MAZE (prefix hgdt / HGDT). One stone in every town and every safe enclave, and a few at the far ends of the dangerous places so a party that
   has pushed too far can get back. The stone of Hedgefoot is the level's ordinary teleporter (it takes part in the world-map network). Standing on any stone of the maze and pressing T
   (or tapping Teleport) lists the maze stones that have been woken, and travels to the one chosen. None in the Underlevel.
   ========================================================================== */
function hgdtBuild(L){
  if(L._hgdt)return;const M=L._hgdm,W=M.W,P=L._hgdp,rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const ok=(x,y)=>open(x,y)&&reach.has(x+','+y)&&!occ.has(x+','+y);
  const near=(cx,cy,minR,maxR)=>{for(let r=minR;r<=maxR;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=cx+dx,y=cy+dy;if(ok(x,y))return [x,y]}return null};
  const stones=[];
  // towns and enclaves: a stone a couple of squares from the middle
  for(const z of P.zones){if(z.type!=='safe'||z.name==='The Foot of the Maze')continue;const c=near(z.x,z.y,2,6);if(!c)continue;occ.add(c[0]+','+c[1]);stones.push({x:c[0],y:c[1],name:(z.town!==undefined?z.name+' Stone':z.name),kind:z.town!==undefined?'town':'enclave',zone:z.name})}
  // the far end of the dangerous places: beside the champion's chest, in six of them and at the Black Hall
  const chests=L.decor.filter(d=>d.hgdTier===3&&d.hgdGive&&d.hgdGive.length);let nd=0;
  for(const z of P.zones.filter(z=>z.type==='danger'&&!z.boss)){if(nd>=6)break;const ch=chests.find(c=>Math.hypot(c.x-z.x,c.y-z.y)<=z.r);if(!ch)continue;if((z.name.length+nd)%2)continue;const c=near(ch.x,ch.y,1,2);if(!c)continue;occ.add(c[0]+','+c[1]);stones.push({x:c[0],y:c[1],name:'The far end of '+z.name,kind:'end',zone:z.name});nd++}
  const top=P.zones.find(z=>z.boss);if(top){const pl=L.decor.find(d=>d.npc==='hgd_plaque'),c=pl?near(pl.x,pl.y,1,3):near(top.x,top.y,2,5);if(c){occ.add(c[0]+','+c[1]);stones.push({x:c[0],y:c[1],name:'The Black Hall',kind:'end',zone:top.name})}}
  // Hedgefoot's stone is the ordinary one of the level
  const main=stones.find(s=>s.zone==='Hedgefoot');if(main){main.main=true;L.tele={x:main.x,y:main.y};L.noTele=false;L.teleName='The Deeper Hollow'}
  stones.forEach((s,i)=>{s.id='s'+i;if(!s.main)L.decor.push({k:'teleporter',x:s.x,y:s.y,block:false,walk:true,loot:false,shop:false,hgdtele:s.id})});
  L._hgdt={stones}}
const hgdtAt=()=>{const L=LEVELS[HGD.ID];if(LEVEL!==HGD.ID||!L||!L._hgdt)return null;return L._hgdt.stones.find(s=>s.x===G.P.x&&s.y===G.P.y)||null};
const hgdtWoken=()=>G.flags.hgdTele||(G.flags.hgdTele={});
// waking a stone: step on it
{const _u=update;update=function(dt){try{if(LEVEL===HGD.ID&&G.state==='play'){const s=hgdtAt(),W0=hgdtWoken();if(s&&!W0[s.id]){W0[s.id]=1;sfx('level');msg('The stone hums, and runes of pale light run round its rim. '+s.name+' is awake. Press T to travel to another woken stone of the maze.','#a8d8ff');if(s.main){G.flags.teles=G.flags.teles||{};G.flags.teles[LEVEL]=1}}}}catch(e){}return _u.apply(this,arguments)}}
// the button and the key work on any stone of the maze
{const _on=teleOn;teleOn=function(){return _on.apply(this,arguments)||(G.state==='play'&&!!hgdtAt())}}
{const _ac=teleActive;teleActive=function(n){return _ac.apply(this,arguments)||(n===HGD.ID&&!!hgdtAt()&&!!hgdtWoken()[hgdtAt().id])}}
{const _om=openTeleMap;openTeleMap=function(){
  const here=hgdtAt();if(LEVEL!==HGD.ID||!here)return _om.apply(this,arguments);
  const L=LEVELS[HGD.ID],W0=hgdtWoken(),list=L._hgdt.stones.filter(s=>W0[s.id]&&s!==here);
  const opts=list.map(s=>[s.name,()=>{G.talk=null;hgdtGo(s);return null}]);
  if(here.main&&G.flags.teles&&Object.keys(G.flags.teles).filter(k=>G.flags.teles[k]&&+k!==HGD.ID).length)opts.push(['The world map.',()=>{G.talk=null;_om.call(this);return null}]);
  opts.push(['Stay.',()=>null]);
  G.talk={d:{k:'teleporter'},n:{name:'Teleporter'},node:say(list.length?'The stone listens. Which woken stone of the maze?':'No other stone of the maze is awake yet. Find them in the towns, the safe places and the far ends of the danger zones.',opts),t:G.time,btns:[]};G.hold=null;G.queued=null}}
function hgdtGo(s){
  if(TP)return;let f=0;const L=LEVELS[HGD.ID];for(let k=0;k<4;k++){const c=(L.rows[s.y+DIRS[k][1]]||'')[s.x+DIRS[k][0]];if(c==='.'){f=k;break}}
  TP={ph:'out',t:0,n:HGD.ID,sp:{x:s.x,y:s.y},f,name:s.name};sfx('level')}
// the maps show the stones that have been woken
{const _dn=hgdmpDrawNames;hgdmpDrawNames=function(vi){try{const L=LEVELS[HGD.ID],V=MPL.view;if(L&&L._hgdt&&V&&V.z){const W0=hgdtWoken(),A=V.area,z=V.z;ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
    for(const s of L._hgdt.stones){if(!(W0[s.id]||(s.main&&G.flags.teles&&G.flags.teles[HGD.ID])))continue;const px=A.x+(V.X(s.x+.5)-V.sx0)*z,py=A.y+(V.Y(s.y+.5)-V.sy0)*z;if(px<A.x||px>A.x+A.w||py<A.y||py>A.y+A.h)continue;
      ctx.strokeStyle='#2a5a9a';ctx.fillStyle='rgba(150,210,255,.9)';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(px,py,2.3,0,6.3);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(px,py,.8,0,6.3);ctx.fillStyle='#2a5a9a';ctx.fill()}
    ctx.restore()}}catch(e){}return _dn.apply(this,arguments)}}
// the people mention them
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('There is a stone in every town and safe place. Wake one by standing on it, and it will carry you to any other you have woken. They say a few stand at the far ends of the danger zones too.');
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdu)try{hgdtBuild(L)}catch(e){console.error('hgdt',e)}}}
