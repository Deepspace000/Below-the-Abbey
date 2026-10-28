p = 'src/desert/blight58_polish.js'
s = open(p, encoding='utf-8').read()
add = '''/* the map edge: the kit's bank of dark leaves showed from far off as a band of pale palings; a plain dark stone bank instead */
function b58Boundary(L){
  const W=L.rows[0].length,H=L.rows.length,old=new Set();
  for(let x=0;x<W;x++){old.add(L.rows[0][x]);old.add(L.rows[H-1][x])}
  const gid=gyTile('texGrey_1',2.7,{gain:.5,rgb:[.78,.88,.8],tag:'b58edge'});let c=null;
  for(let k=0x3f0;k<0x3ff+64;k++){const ch=String.fromCharCode(k);if(!L.chars[ch]){c=ch;break}}
  if(!c)return;L.chars[c]=gid;
  L.rows=L.rows.map((r,y)=>{let o='';for(let x=0;x<W;x++){const edge=x<2||y<2||x>W-3||y>H-3;o+=(edge&&old.has(r[x]))?c:r[x]}return o})}
'''
s = s.replace("/* ---------- wrap a level builder", add + "/* ---------- wrap a level builder", 1)
s = s.replace("b58Wrap(9650,L=>{\n", "b58Wrap(9650,L=>{\n  if(location.search.includes('edge'))b58Boundary(L);\n", 1)
open(p, 'w', encoding='utf-8').write(s)
