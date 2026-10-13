// node tools/yar_layout_test.js [seed]  : prints the plan of Yarrim and a few counts
const {YP,yarPlan,yarAscii}=require('../src/desert/yarrim_layout.js');
let P;try{P=yarPlan(+process.argv[2]||90210)}catch(e){console.log('PLAN ERROR:',e.message);process.exit(1)}
console.log('    '+Array.from({length:44},(_,i)=>(i+16)%10).join(''));
console.log(yarAscii(P,16,29,59,50));
const by={};for(const h of P.houses){const k=h.sp?'special':h.outlying?'outlying':h.w+'x'+h.d;by[k]=(by[k]||0)+1}
console.log('houses',P.houses.length,by);
// every house door must stand next to a street cell, and every street cell must be reachable from the tunnel mouth
const W=P.W,H=P.H;let bad=0;for(const h of P.houses){if(!P.street[h.front[1]*W+h.front[0]]){bad++;console.log('door not on a street',h.id,h.door,h.front)}}
console.log('doors off the street:',bad);
const sx=18,sy=40,seen=new Uint8Array(W*H),q=[sy*W+sx];seen[q[0]]=1;let n=0;
while(q.length){const c=q.pop();n++;const x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(P.street[j]&&!seen[j]){seen[j]=1;q.push(j)}}}
let total=0;for(let i=0;i<W*H;i++)if(P.street[i])total++;
console.log('street cells',total,'reachable from the tunnel',n);
// the roads: no 2x2 block of street cells outside the square and the quay (that would be a wide road), and the number of junctions on the main road
let wide=0;for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const a=P.street[y*W+x]&&P.street[y*W+x+1]&&P.street[(y+1)*W+x]&&P.street[(y+1)*W+x+1];const sq=P.square;const inSq=x>=sq.x0-1&&x<=sq.x1&&y>=sq.y0-1&&y<=sq.y1;if(a&&!inSq&&x<54)wide++}
console.log('wide road blocks outside the square and quay:',wide);
let branches=0;for(let x=33;x<=47;x++){const n=P.street[39*W+x],s=P.street[41*W+x];if(n||s)branches++}
console.log('lanes that leave the main road (north or south):',branches);
