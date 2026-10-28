()=>{const L=LEVELS[477],op=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';const o=[];for(const d of G.decor){if(!(d.hgt&&d.hgdwText!==undefined)&&!(d.hgt&&d.hgtBase))continue;
let r=null;if(d.pic&&d.wd){const x=d.x,y=d.y;const f=DIRS.findIndex(q=>q[0]===d.wd[0]&&q[1]===d.wd[1]);r=[x,y,f]}else{for(let dist=2;dist>=1&&!r;dist--)for(let f=0;f<4;f++){const dd=DIRS[f];let ok=true;for(let k=1;k<=dist;k++)if(!op(d.x-dd[0]*k,d.y-dd[1]*k))ok=false;if(ok){r=[d.x-dd[0]*dist,d.y-dd[1]*dist,f];break}}}
if(r)o.push([d.hgt.replace(/[^A-Za-z0-9]/g,'_'),r[0],r[1],r[2],!!d.pic])}return o}
