// node tools/yar_layout_test.js [seed]  : prints the plan of Yarrim and a few counts
const {YP,yarPlan,yarAscii}=require('../src/desert/yarrim_layout.js');
const P=yarPlan(+process.argv[2]||90210);
console.log(yarAscii(P,14,28,60,48));
const by={};for(const h of P.houses){const k=h.sp?'special':h.w+'x'+h.d;by[k]=(by[k]||0)+1}
console.log('houses',P.houses.length,by);
console.log('specials',Object.keys(P.special).map(k=>k+':'+(P.special[k]?'placed':'MISSING')).join(' '));
// every house door must stand next to a street cell
let bad=0;for(const h of P.houses){if(!P.street[h.front[1]*P.W+h.front[0]]){bad++;console.log('door not on a street',h.i,h.door,h.front,h.sp&&h.sp.id)}}
console.log('doors off the street:',bad);
// the streets must all be connected
const W=P.W,H=P.H;let start=-1;for(let i=0;i<W*H;i++)if(P.street[i]){start=i;break}
const seen=new Uint8Array(W*H),q=[start];seen[start]=1;let n=0;
while(q.length){const c=q.pop();n++;const x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(P.street[j]&&!seen[j]){seen[j]=1;q.push(j)}}}
let total=0;for(let i=0;i<W*H;i++)if(P.street[i])total++;
console.log('street cells',total,'connected',n);
