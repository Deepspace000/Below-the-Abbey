from h import *
h=H();print(h.load());h.lib()
h.ev("act()");h.ev("crBtn('cr_pick_def')")
t0=time.time()
def rec():
    w=h.ev("PT.recover()")
    if w: print('WIPE',w)
    return w
print(h.ev("PT.lootAll({})") if False else '')
h.ev("""(()=>{PT.lootNoCoffin=()=>{const res=[];for(const d of G.decor.filter(d=>d.loot&&!d.shop&&!d.looted&&d.k!=='coffin')){const r=PT.openDecor(d);if(r!=='open'){res.push(r);continue}PT.takeAll();d.looted=true}return res};})()""")
print(h.ev("PT.lootNoCoffin()"),h.ev("PT.gearUp()"))
for it in range(40):
    r=h.ev("PT.clearLevel({cap:3,filter:e=>/rat|bat/.test(e.t)})")
    rec()
    if h.ev("G.state")!='play': continue
    if not h.ev("G.enemies.some(e=>e.hp>0&&/rat|bat/.test(e.t))"):break
h.ev("(()=>{PT.avoid=e=>/skel|boss/.test(e.t)})()")
print(h.ev("(()=>{const d=G.decor.find(d=>d.shop);return PT.openDecor(d)})()"))
print(json.dumps(h.ev("PT.shop()")))
h.ev("G.loot=null;PT.avoid=null")
print(json.dumps(h.ev("PT.snap().heroes.map(x=>x.n+JSON.stringify(x.eq))")))
for it in range(60):
    r=h.ev("PT.clearLevel({cap:2})")
    rec()
    if h.ev("G.state")!='play': continue
    if r==[]: break
    if h.ev("PT.needRest()"): h.ev("PT.rest()")
print(h.ev("PT.collect({skip:i=>0})"))
print(h.ev("PT.gearUp()"),h.ev("G.keys"))
print(h.ev("PT.nearestEnemy()&&PT.nearestEnemy().t"))
print(json.dumps(h.ev("PT.snap()")))
print(json.dumps(h.ev("PT.deaths")))
print(h.ev('G.bossDead'),h.ev('PT.takeExit()'),h.ev('LEVEL'),h.ev('G.state'),h.ev('!!G.cut'))
print(time.time()-t0)
print(h.ev("G.enemies.filter(e=>e.hp>0).map(e=>e.t+e.lvl+'@'+e.x+','+e.y)"),h.ev("G.items.map(i=>i.k+'@'+i.x+','+i.y+(i.taken?'T':''))"),h.ev("G.keys"))
print(chr(10).join(h.ev("(()=>{const r=[];for(let y=0;y<MH;y++){let s='';for(let x=0;x<34;x++){const g=G.grid[y][x];s+=(x===G.P.x&&y===G.P.y)?'@':g===0?'.':g===1?'#':g===3?'D':g===4?'L':g===5?'X':g===8?'C':g;}r.push(s)}return r.slice(0,24)})()")))
h.close()
