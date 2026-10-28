(()=>{const L=LEVELS[475],a=L._hgpbDbg,b=L.rows;let n=0;const ex=[],ch={};for(let y=0;y<b.length;y++){if(a[y]===b[y])continue;for(let x=0;x<b[y].length;x++)if(a[y][x]!==b[y][x]){n++;const k=a[y][x]+'>'+b[y][x];ch[k]=(ch[k]||0)+1;if(ex.length<8)ex.push([x,y,k])}}
return {n,ex,ch,same:a===b}})()
