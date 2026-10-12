const fs=require('fs'),path=require('path');
function hash2(x,y,s){let h=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,1274126177);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
const src=fs.readFileSync(path.join(__dirname,'..','src','desert','khemetra_map.js'),'utf8');
const fn=new Function('hash2',src+'\nreturn {khBuild,KH};');
const {khBuild,KH}=fn(hash2);
const t=Date.now();const C=khBuild(4321);console.log('built in',Date.now()-t,'ms','modules',C.modules.length);
const W=C.W,H=C.H;
// reachability from the gate
const seen=new Uint8Array(W*H),q=[[200,392]];seen[392*W+200]=1;
while(q.length){const [x,y]=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const i=ny*W+nx;if(C.solid[i]||seen[i])continue;seen[i]=1;q.push([nx,ny])}}
let open=0,reach=0;for(let i=0;i<W*H;i++)if(!C.solid[i]){open++;if(seen[i])reach++}
console.log('open',open,'reachable',reach);
let out='';for(let y=0;y<H;y+=5){let r='';for(let x=0;x<W;x+=4){let s=0,o=0;for(let dy=0;dy<5;dy++)for(let dx=0;dx<4;dx++){if(C.solid[(y+dy)*W+x+dx])s++;else o++}r+=s>14?'#':s>8?'+':s>3?'.':' '}out+=r+'\n'}
console.log(out);
const kinds={};for(const m of C.modules)kinds[m.kind]=(kinds[m.kind]||0)+1;console.log(kinds);
