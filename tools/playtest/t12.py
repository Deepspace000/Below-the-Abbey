from common import *
r=Run();r.budget=60000
r.pg.on('crash',lambda p: print('PAGE CRASH EVENT',flush=True))
r.start(True)
try:
    print('prep',json.dumps(interior(r,4,3))[:100],flush=True)
    print('to7',enter(r,7),flush=True)
    for step in ["PT.lootAll({})","PT.collect({})","PT.clearLevel({cap:40})"]:
        o=play(r,step);print(step,str(o)[:100],r.ev("[G.state,PT.where]"),flush=True)
    print('to8',enter(r,8),flush=True)
    for i in range(10):
        o=play(r,"PT.clearLevel({cap:3})");print(str(o)[:100],r.ev("[G.state,PT.where,G.rounds,G.msgs.length,PT.msgs.length]"),flush=True)
except Exception as e:
    print('EXC',str(e)[:100]);print(list(r.trace)[-8:])
print(r.ev("G.enemies.filter(e=>e.hp>0).map(e=>e.t+e.lvl+'@'+e.x+','+e.y+' '+(PT.bfs(e.x,e.y,{adj:true})?'R':'X'))"))
print(r.ev("[G.P.x,G.P.y,G.keys]"),r.ev("G.items.filter(i=>!i.taken).map(i=>i.k+'@'+i.x+','+i.y)"))
print(chr(10).join(r.ev("(()=>{const R=new Set();const q=[[G.P.x,G.P.y]];R.add(G.P.y*MW+G.P.x);while(q.length){const [x,y]=q.pop();for(const d of DIRS){const nx=x+d[0],ny=y+d[1];if(PT.passable(nx,ny)&&!R.has(ny*MW+nx)){R.add(ny*MW+nx);q.push([nx,ny])}}}const rows=[];for(let y=0;y<MH;y++){let s='';for(let x=0;x<MW;x++){const g=G.grid[y][x];const en=G.enemies.find(e=>e.hp>0&&e.x===x&&e.y===y);s+=(x===G.P.x&&y===G.P.y)?'@':en?'E':R.has(y*MW+x)?'.':g===0?',':g===1?'#':g>=30&&g<100?'P':g===3?'D':g===4?'L':g===5?'X':(g%10)}rows.push(s)}return rows})()")))
