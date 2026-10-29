/* ps_curate.js: the Pale Spire's curator. Runs once on every castle level right after it is built.
   1. Works out the MAIN ROUTE of the level: the cheapest walk from the start to every door, stair and landing (it steers round big furniture).
   2. Clears small loose props (urns, candelabra, chairs, barrels, rubble, flowers and so on) off that route and one square either side of it.
   3. Thins the foes by a third, and moves any foe standing within 3 squares of the route to a quiet spot further off (rooms, corners, side places).
      Bosses, statues that wake, patrols, the slow ghosts and anything in a rest room stay as they are.
   The report is in LEVELS[id]._curate. */
const PSC_SMALL=/urn|vase|candel|chair|stool|barrel|crate|sack|pot\b|plant|flower|rose|rubble|bones|skull|bucket|basket|lantern|brazier|cobweb|web|sheet|mirror|rug|cask|jar|candle|tray|book|crow|bat|moss|weed|bush/i;
const PSC_BIG=/table|sideboard|wardrobe|bed|pulpit|pew|fireplace|throne|clock|col|screen|statue|st_|fountain|bench|altar|tomb|bookcase|shelf|rack|gargoyle|tree|well|stair|bridge|tower|fence|gate|door|arch/i;
function pscHeap(){const a=[];return {n:()=>a.length,push(c,v){a.push([c,v]);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(a[p][0]<=a[i][0])break;[a[p],a[i]]=[a[i],a[p]];i=p}},
  pop(){const t=a[0],l=a.pop();if(a.length){a[0]=l;let i=0;for(;;){let m=i,L=2*i+1,R=L+1;if(L<a.length&&a[L][0]<a[m][0])m=L;if(R<a.length&&a[R][0]<a[m][0])m=R;if(m===i)break;[a[m],a[i]]=[a[i],a[m]];i=m}}return t}}}
function pscCurate(id,L){
  if(!L||L._curated||!L.rows)return L;L._curated=1;
  const info=pspLevel(id),W=L.rows[0].length,H=L.rows.length,P=L._ps||{};
  const TB=(typeof TERRS!=='undefined'&&TERRS[id]&&TERRS[id].block)||null;
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.'&&!(TB&&TB[y*W+x]);
  const dec=new Map();for(const d of L.decor||[]){if(d.pic||d.deco)continue;const k=d.x+','+d.y;(dec.get(k)||dec.set(k,[]).get(k)).push(d)}
  const bigAt=(x,y)=>(dec.get(x+','+y)||[]).some(d=>d.block&&PSC_BIG.test(String(d.k)));
  const smallAt=(x,y)=>(dec.get(x+','+y)||[]).some(d=>d.block&&!PSC_BIG.test(String(d.k)));
  const near=(x,y)=>{if(open(x,y))return [x,y];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]])if(open(x+a,y+b))return [x+a,y+b];return null};
  // signs carry only the name of the place: no hint lines under it
  for(const d of L.decor||[])if(Array.isArray(d.txt)&&d.txt.length>1)d.txt[1]='';
  // key points: the start, every door of this level, every landing into it
  const keys=[];const add=p=>{if(p&&p[0]!=null){const q=near(Math.round(p[0]),Math.round(p[1]));if(q)keys.push(q)}};
  const st=L.start||{};add([st.x,st.y]);
  for(const l of PSP.LINKS){if(l.from===id&&l.at)add(l.at);if(l.to===id&&l.land)add(l.land)}
  if(PSP.TELE&&PSP.TELE.id===id)add(PSP.TELE.at);
  const cost=new Float32Array(W*H).fill(1e9),par=new Int32Array(W*H).fill(-1),s0=keys[0];
  if(!s0)return L;
  const hp=pscHeap();cost[s0[1]*W+s0[0]]=0;hp.push(0,s0[1]*W+s0[0]);
  while(hp.n()){const [c,v]=hp.pop();if(c>cost[v])continue;const x=v%W,y=(v/W)|0;
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(!open(nx,ny))continue;const w=1+(bigAt(nx,ny)?40:smallAt(nx,ny)?3:0),nv=ny*W+nx;if(c+w<cost[nv]){cost[nv]=c+w;par[nv]=v;hp.push(c+w,nv)}}}
  const path=new Set();for(const k of keys){let v=k[1]*W+k[0];if(cost[v]>=1e9)continue;while(v>=0&&!path.has(v)){path.add(v);v=par[v]}}
  const rep={route:path.size,props:0,foes0:0,foes1:0,moved:0,dropped:0};
  // clear small loose props from the route and one square either side
  const near1=new Set();for(const v of path){const x=v%W,y=(v/W)|0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)near1.add((y+b)*W+x+a)}
  const keepD=d=>d.pic||d.deco||d.npc||d.goldAmt||d.psKeep||!PSC_SMALL.test(String(d.k))||PSC_BIG.test(String(d.k));
  L.decor=(L.decor||[]).filter(d=>{if(keepD(d))return true;const v=Math.round(d.y)*W+Math.round(d.x);if(near1.has(v)){rep.props++;return false}return true});
  // gaol levels: nothing decorative or domestic (mirrors, portraits, dust sheets, candle tables, sheeted windows)
  if(id>=9780&&id<=9800){const bad=/mirror|portrait|dust_sheet|window_sheeted|candles_glow|st_mourners|st_bishop|bench/;L.decor=(L.decor||[]).filter(d=>{if(d.npc&&!/^psh_/.test(d.npc))return true;if(d.psKeep||d.goldAmt)return true;if(bad.test(String(d.k))){rep.props++;return false}if(/lantern_red|web_spider/.test(String(d.k))){const x=Math.round(d.x),y=Math.round(d.y);if(open(x,y)&&(open(x+1,y)?1:0)+(open(x-1,y)?1:0)+(open(x,y+1)?1:0)+(open(x,y-1)?1:0)<=2){rep.props++;return false}}return true})}
  // every castle level: no free-standing blocking prop in a corridor cell (two or fewer open orthogonal neighbours). Removed, or (chests with gold) moved to the nearest roomy cell.
  {const ON=(x,y)=>(open(x+1,y)?1:0)+(open(x-1,y)?1:0)+(open(x,y+1)?1:0)+(open(x,y-1)?1:0);
   const keepK=/door|gate|arch|portcull|bridge|stair|sign|pillar|col_|wall/i;
   const taken=new Set((L.decor||[]).filter(d=>d.block).map(d=>Math.round(d.x)+','+Math.round(d.y)));for(const e of L.enemies||[])taken.add(Math.round(e.x)+','+Math.round(e.y));
   const room=(x,y)=>{if(!open(x,y)||taken.has(x+','+y)||near1.has(y*W+x))return false;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(!open(x+a,y+b))return false;return true};
   const out=[];rep.corr=0;rep.corrMoved=0;
   for(const d of L.decor||[]){
     if(!d.block||d.pic||d.deco||d.npc||d.psKeep||keepK.test(String(d.k))){out.push(d);continue}
     const x=Math.round(d.x),y=Math.round(d.y);if(!open(x,y)||ON(x,y)!==2||!(path.has(y*W+x)||(id>=9780&&id<=9800))){out.push(d);continue}
     if(d.goldAmt){let best=null,bd=1e9;for(let r=1;r<=8&&!best;r++)for(let b=-r;b<=r;b++)for(let a=-r;a<=r;a++){if(Math.max(Math.abs(a),Math.abs(b))!==r||!room(x+a,y+b))continue;const h=Math.hypot(a,b);if(h<bd){bd=h;best=[x+a,y+b]}}
       if(best){taken.delete(x+','+y);d.x=best[0];d.y=best[1];taken.add(best[0]+','+best[1]);rep.corrMoved++;out.push(d);continue}}
     rep.corr++;(rep.rm||(rep.rm=[])).push([d.k,x,y])}
   L.decor=out}
  // foes
  const dist=new Int16Array(W*H).fill(999),q=[];for(const v of path){dist[v]=0;q.push(v)}
  for(let i=0;i<q.length;i++){const v=q[i],x=v%W,y=(v/W)|0;if(dist[v]>=6)continue;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const nx=x+a,ny=y+b;if(nx<0||ny<0||nx>=W||ny>=H)continue;const nv=ny*W+nx;if(dist[nv]>dist[v]+1){dist[nv]=dist[v]+1;q.push(nv)}}}
  const safe=(x,y)=>(P.safe||[]).some(z=>pspInZone(z,x,y,1))||(P.rests||[]).some(r=>x>=r.x0-1&&x<=r.x1+1&&y>=r.y0-1&&y<=r.y1+1);
  const loops=P.loops||{},E=L.enemies||[];rep.foes0=E.length;
  const prot=(e,i)=>{const d=ENEMY_DEF[e.t]||{};return !!(loops[i]||d.boss||d.still||d.pswake||e.boss||e.keep||e.psKeep||safe(e.x,e.y)||/^ps(stairwarden|antlered)/.test(e.t))};
  const occ=new Set(E.map(e=>e.x+','+e.y));for(const d of L.decor||[])if(d.block)occ.add(Math.round(d.x)+','+Math.round(d.y));
  const freeSpot=(e)=>{let best=null,bd=1e9;for(let r=1;r<=14;r++){for(let b=-r;b<=r;b++)for(let a=-r;a<=r;a++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const x=e.x+a,y=e.y+b;if(!open(x,y)||occ.has(x+','+y)||dist[y*W+x]<4||safe(x,y))continue;let n=0;for(let c=-1;c<=1;c++)for(let d=-1;d<=1;d++)if(open(x+c,y+d))n++;if(n<4)continue;const h=Math.hypot(a,b);if(h<bd){bd=h;best=[x,y]}}if(best)break}return best};
  const out=[],nloops={};let cand=0;
  E.forEach((e,i)=>{
    if(prot(e,i)){if(loops[i])nloops[out.length]=loops[i];out.push(e);return}
    cand++;if(cand%3===0||cand%7===0){rep.dropped++;return}                  // a third fewer
    const near=dist[Math.round(e.y)*W+Math.round(e.x)]<=3;
    if(near){const s=freeSpot(e);if(!s){rep.dropped++;return}occ.delete(e.x+','+e.y);e.x=s[0];e.y=s[1];occ.add(s[0]+','+s[1]);rep.moved++}
    out.push(e)});
  L.enemies=out;P.loops=nloops;rep.foes1=out.length;L._curate=rep;return L}
/* every castle level is curated the first time it is built */
{for(const info of PSP.LEVELS){const id=info.id,orig=KH_LAZY[id];if(!orig||orig._psc)continue;
  const w=()=>{const had=LEVELS[id];const lv=orig();if(!had||!lv._curated)try{pscCurate(id,LEVELS[id]||lv)}catch(e){console.error('ps curate',id,e)}return LEVELS[id]||lv};w._psc=1;KH_LAZY[id]=w}}
