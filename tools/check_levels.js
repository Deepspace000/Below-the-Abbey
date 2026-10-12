// Checks the desert levels without a browser: node tools/check_levels.js
// Builds the road and the tomb from the same source files the game uses, then walks them.
const fs=require('fs'),path=require('path');
const src=f=>fs.readFileSync(path.join(__dirname,'..','src','desert',f),'utf8');
const TAU=Math.PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v;
function hash2(x,y,s){let h=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,1274126177);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
const code='const DS_MAGIC_TOMB=["a","b","c"],EMBERS_LEVELS=[];\n'+src('road.js')+'\n'+src('tomb.js')+'\n'+src('burrows.js')+'\nreturn {LEVELS,SANDROAD,TOMB,LEVEL41_DATA,LEVEL42_DATA};';
const LEVELS={};
const fn=new Function('LEVELS','hash2','clamp','TAU',code);
const {SANDROAD,TOMB,LEVEL41_DATA,LEVEL42_DATA}=fn(LEVELS,hash2,clamp,TAU);

function reach(rows,decor,start,opened){
  const H=rows.length,W=rows[0].length,block=new Set(decor.filter(d=>d.block).map(d=>d.x+','+d.y));
  const seen=new Uint8Array(W*H),q=[start];seen[start[1]*W+start[0]]=1;
  const ok=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return false;const c=rows[y][x];if(opened.has(x+','+y))return !block.has(x+','+y);return c==='.'&&!block.has(x+','+y)};
  while(q.length){const [x,y]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(ok(nx,ny)&&!seen[ny*W+nx]){seen[ny*W+nx]=1;q.push([nx,ny])}}}
  return (x,y)=>!!seen[y*W+x];
}
let bad=0;const fail=m=>{console.log('FAIL',m);bad++};
// ---- the road ----
{
  const R=SANDROAD,rr=reach(R.rows,R.decor,[R.start.x,R.start.y],new Set());
  const gx=R.rows[5].indexOf('1');
  console.log('road',R.rows[0].length+'x'+R.rows.length,'decor',R.decor.length,'scenery',R.scen.length,'enemies',R.enemies.length,'items',R.items.length);
  if(!rr(gx,6))fail('the tomb gate cannot be reached from the start of the road');
  for(const e of R.enemies)if(R.rows[e.y][e.x]!=='.')fail('road enemy in a wall '+e.t+' '+e.x+','+e.y);
}
// ---- the tomb ----
{
  const T=TOMB,rows=T.rows,decor=T.decor;
  console.log('tomb',rows[0].length+'x'+rows.length,'decor',decor.length,'enemies',T.enemies.length,'items',T.items.length);
  const disc=n=>T.items.find(i=>i.k==='sundisc'+n);
  const open=new Set();
  const r1=reach(rows,decor,[T.start.x,T.start.y],open);
  const lever=i=>decor.find(d=>d.k==='lever'&&d.idx===i);
  const chk=(r,x,y,what)=>{if(!r(x,y))fail(what+' not reachable at '+x+','+y)};
  chk(r1,disc(1).x,disc(1).y,'disc 1');chk(r1,disc(4).x,disc(4).y,'disc 4');
  chk(r1,lever(1).x,lever(1).y,'lever 1');chk(r1,lever(3).x,lever(3).y,'lever 3');
  if(r1(disc(2).x,disc(2).y))fail('disc 2 reachable without the secret door');
  if(r1(lever(2).x,lever(2).y))fail('lever 2 reachable without the secret door');
  if(r1(disc(3).x,disc(3).y))fail('disc 3 reachable without the levers');
  open.add('91,35');open.add('20,21');
  const r2=reach(rows,decor,[T.start.x,T.start.y],open);
  chk(r2,disc(2).x,disc(2).y,'disc 2 (after secret)');chk(r2,lever(2).x,lever(2).y,'lever 2 (after secret)');
  for(const x of [5,6,7])open.add(x+',14');
  const r3=reach(rows,decor,[T.start.x,T.start.y],open);
  chk(r3,disc(3).x,disc(3).y,'disc 3 (after levers)');
  if(r3(48,6))fail('the throne room is reachable without the great door');
  open.add('48,25');
  const r4=reach(rows,decor,[T.start.x,T.start.y],open);
  chk(r4,48,3,'the throne room (after the door)');chk(r4,48,2,'the exit cell');
  for(const e of T.enemies)if(rows[e.y][e.x]!=='.')fail('tomb enemy in a wall '+e.t+' '+e.x+','+e.y);
  const lv=lever(1);if(rows[lv.y+lv.wd[1]][lv.x+lv.wd[0]]==='.')fail('lever 1 is not against a wall');
  for(const i of [2,3]){const l=lever(i);if(rows[l.y+l.wd[1]][l.x+l.wd[0]]==='.')fail('lever '+i+' is not against a wall')}
  console.log('wall chars used:',[...new Set(rows.join('').split(''))].join(''));
}
// ---- the little dungeons ----
for(let k=0;k<10;k++){
  const L=LEVELS[50+k];if(!L){fail('burrow '+k+' missing');continue}
  const spot=SANDROAD.burrows[k];if(!spot){fail('burrow '+k+' has no mound on the road');continue}
  const rr=reach(L.rows,L.decor,[L.start.x,L.start.y],new Set());
  const ch=L.decor.find(d=>d.k==='chest');if(!rr(ch.x,ch.y+1))fail('burrow '+k+' chest not reachable');
  for(const e of L.enemies)if(L.rows[e.y][e.x]!=='.'||L.decor.some(d=>d.block&&d.x===e.x&&d.y===e.y))fail('burrow '+k+' enemy blocked '+e.t+' '+e.x+','+e.y);
  const road=reach(SANDROAD.rows,SANDROAD.decor,[SANDROAD.start.x,SANDROAD.start.y],new Set());
  if(!road(spot.x,spot.y+1))fail('burrow '+k+' mound front not reachable on the road at '+spot.x+','+spot.y);
}
console.log('burrows at',SANDROAD.burrows.map(b=>b.x+','+b.y).join(' '));
console.log(bad?bad+' problem(s)':'all good');
process.exit(bad?1:0);
