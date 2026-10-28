import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/dshots')
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    keys=pg.evaluate('()=>Object.entries(HGPD.read).map(([k,v])=>[k,v.n,v.page||0])')
    print(len(keys),keys[:6])
    # a sign: stand next to a sign wall and bump
    sg=[k for k in keys if k[1] in('A scratched arrow','A scratched sign')][0]
    wx,wy=map(int,sg[0].split(','))
    r=pg.evaluate('''([wx,wy])=>{const L=LEVELS[476];for(let f=0;f<4;f++){const d=DIRS[f],x=wx-d[0],y=wy-d[1];if(L.rows[y][x]==='.'){goToLevel(476,{x,y,f});hgoFace(f);return [x,y,f]}}}''',[wx,wy])
    pg.wait_for_timeout(1800)
    pg.screenshot(path=str(OUT/'sign_a.png'))
    pg.evaluate('()=>{G.msgs=[];doMove(0)}')
    pg.wait_for_timeout(900)
    print('talk',pg.evaluate('()=>G.talk&&G.talk.n&&G.talk.n.name'),pg.evaluate('()=>G.talk&&G.talk.node&&G.talk.node.text||JSON.stringify(G.talk&&G.talk.node).slice(0,300)'))
    pg.screenshot(path=str(OUT/'sign_b.png'))
    # a journal
    pk=[k for k in keys if k[2]==1][0];bx,by=map(int,pk[0].split(','))
    pg.evaluate('()=>{G.talk=null}')
    pg.evaluate('''([bx,by])=>{const L=LEVELS[476];for(let f=0;f<4;f++){const d=DIRS[f],x=bx-d[0],y=by-d[1];if(L.rows[y][x]==='.'){goToLevel(476,{x,y,f});hgoFace(f);return [x,y,f]}}}''',[bx,by])
    pg.wait_for_timeout(1500);pg.evaluate('()=>{G.msgs=[];doMove(0)}');pg.wait_for_timeout(900)
    print('talk2',pg.evaluate('()=>G.talk&&G.talk.n&&G.talk.n.name'))
    pg.screenshot(path=str(OUT/'page_b.png'))
    print('errors',[e for e in errs if 'Failed to load' not in e][:6]); b.close()
