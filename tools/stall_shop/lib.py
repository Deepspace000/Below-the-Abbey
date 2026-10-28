"""Shared pieces of the stall shop tests (run.py and repl.py): the page scripts and the helpers that enter a level, stand at a stall and check it.
No frame() calls from outside: the game draws on its own, and the helpers wait for real frames."""
import os, json, time

CFG = {'shots': None}  # shots: a folder for screenshots, or None

TABLE = """()=>{
  const rows=stlTable(),own={};
  for(const d of G.decor){const k=String(d.k||'');if(!(STL_STRONG.test(k)||STL_WEAK.test(k))||STL_NOT.test(k))continue;
    const f=d.npc?'npc':d.shop?'shop':d.loot?'loot':d.contents?'contents':(d.enter||d.door||d.exitDoor)?'door':'';
    if(f)own[k+' ['+f+']']=(own[k+' ['+f+']']||0)+1}
  return {name:LEVEL_NAMES[LEVEL],npcs:G.decor.filter(d=>d.npc).length,rows,own}}"""

PLACE = """([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:x,y:y,a:G.P.angT};G.msgs=[];G.talk=null;G.loot=null;G.menu=false;G.hold=null;G.queued=null;return true}"""

# a standing cell next to (x,y) from which it is faced: [sx,sy,f] or null (far: two steps back is allowed)
STAND = """([x,y,far])=>{
  for(const k of (far?[2,1]:[1])){for(let f=0;f<4;f++){const dx=DIRS[f][0],dy=DIRS[f][1],sx=x-dx*k,sy=y-dy*k;
    let ok=true;for(let j=1;j<=k;j++){const cx=x-dx*j,cy=y-dy*j;if(cellBlocked(cx,cy)||enemyAt(cx,cy)||!G.grid[cy]||G.grid[cy][cx]!==0)ok=false}
    if(ok)return [sx,sy,f]}}
  return null}"""

STATE = """()=>({loot:!!G.loot,shop:!!(G.loot&&G.loot.shop),name:G.loot?G.loot.name:null,npc:G.loot&&G.loot.decor?G.loot.decor.npc:null,talk:!!G.talk,talkNpc:G.talk&&G.talk.d?G.talk.d.npc:null,
  msg:G.msgs.length?G.msgs[G.msgs.length-1].text:null,msgs:G.msgs.map(m=>m.text),gold:G.gold,bag:G.bag.length,P:[G.P.x,G.P.y,G.P.f],lv:LEVEL})"""

# a click point on the stall picture that the game itself resolves to this stall (client pixels), or null
CLICKPT = """([x,y])=>{
  const hs=G.hits.filter(h=>h.stl&&h.ref.x===x&&h.ref.y===y);if(!hs.length)return {none:true,hits:G.hits.length,stl:G.hits.filter(h=>h.stl).map(h=>[h.ref.k,h.ref.x,h.ref.y])};
  const h=hs[0];
  for(let i=1;i<=9;i++)for(let j=1;j<=9;j++){const px=h.x0+(h.x1-h.x0)*i/10,py=h.y0+(h.y1-h.y0)*j/10;
    if(px<0||py<0||px>=420||py>=210)continue;const g=stlHitAt(px,py);if(g&&g.ref===h.ref&&!topBtn(px,py)){const r=cv.getBoundingClientRect();return {cx:r.left+px/DW*r.width,cy:r.top+py/DH*r.height,px,py,ty:h.ty}}}
  return {covered:true,rect:[h.x0,h.y0,h.x1,h.y1]}}"""


def enter(pg, lv):
    pg.evaluate("""(lv)=>{try{if(lv>=470&&lv<=475){if(typeof hgBuild==='function')hgBuild();if(typeof hgdBuild==='function')hgdBuild()}}catch(e){}
      try{if(lv===44&&LEVELS[44]&&LEVELS[44].stub){khEnter(()=>{goToLevel(44,null);G.state='play';G.menu=false});return}}catch(e){}
      G.talk=null;G.loot=null;goToLevel(lv,null);G.state='play';G.menu=false}""", lv)
    pg.wait_for_function("(lv)=>LEVEL===lv&&G.state==='play'&&!TP&&G.decor&&G.decor.length", arg=lv, timeout=600000)
    pg.wait_for_timeout(800)


def place(pg, st, wait=1000):
    pg.evaluate(PLACE, st)
    pg.wait_for_function("()=>canAct()", timeout=90000)
    pg.wait_for_timeout(wait)


def state(pg):
    return pg.evaluate(STATE)


def close_page(pg):
    pg.evaluate("()=>{if(G.loot)lootBtn('lclose');G.talk=null;G.loot=null;G.msgs=[]}")


def press_and_wait(pg, key):
    """press a key, then wait for the game to answer (a shop page, a talk page or a message), up to 6 seconds"""
    pg.keyboard.press(key)
    try:
        pg.wait_for_function("()=>G.loot||G.talk||G.msgs.length", timeout=6000)
    except Exception:
        pass
    pg.wait_for_timeout(500)
    return state(pg)


def shop_once(pg):
    """buy the first item of the open shop, then sell it back"""
    return pg.evaluate("""()=>{G.gold=Math.max(G.gold,5000);const box=G.loot.decor.contents;if(!box||!box.length)return {err:'empty shop'};
      const id=box[0].id,g0=G.gold,n0=G.bag.filter(x=>x&&x.id===id).length;lootBtn('lbox0');lootBtn('lact');
      const bought=G.gold<g0&&G.bag.filter(x=>x&&x.id===id).length>n0;
      const bi=G.bag.findIndex(x=>x&&x.id===id);let sold=false;
      if(bi>=0){const g1=G.gold;lootBtn('lbag'+bi);lootBtn('lact');sold=G.gold>g1}
      return {id,bought,sold}}""")


def check_stall(pg, row, shot_name, out):
    """face one stall (a row from stlTable) and run the use key, the hover, the click, the buy and sell, and the keeper's own talk"""
    shots = CFG['shots']
    res = {'k': row['k'], 'x': row['x'], 'y': row['y'], 'expect': row['title'] or None, 'npc': row['npc']}
    painted = row['k'].startswith('hgstall_')
    bound = bool(row['npc'])
    st = pg.evaluate(STAND, [row['x'], row['y'], painted])
    if not st:
        res['err'] = 'no standing cell'; out.append(res); return
    if not painted:
        place(pg, st)
        s = press_and_wait(pg, 'Enter'); res['use'] = s
        res['use_ok'] = bool(s['shop'] and s['npc'] == row['npc']) if bound else bool(not s['loot'] and s['msg'])
        if bound and s['shop']:
            if shots and shot_name:
                pg.screenshot(path=os.path.join(shots, shot_name + '_use.png'))
            res['shopping'] = shop_once(pg)
        close_page(pg)
    # the click (and the hover tip first)
    place(pg, st)
    pt = pg.evaluate(CLICKPT, [row['x'], row['y']])
    res['click_point'] = pt
    if pt and pt.get('cx') is not None:
        pg.mouse.move(pt['cx'] - 3, pt['cy'] - 3); pg.mouse.move(pt['cx'], pt['cy']); pg.wait_for_timeout(1400)
        if shots and shot_name and bound:
            pg.screenshot(path=os.path.join(shots, shot_name + '_tip.png'))
        pg.mouse.click(pt['cx'], pt['cy'])
        try:
            pg.wait_for_function("()=>G.loot||G.talk||G.msgs.length", timeout=6000)
        except Exception:
            pass
        pg.wait_for_timeout(500)
        s = state(pg); res['click'] = s
        res['click_ok'] = bool(s['shop'] and s['npc'] == row['npc']) if bound else bool(not s['loot'] and s['msg'])
        if bound and s['shop'] and shots and shot_name and painted:
            pg.screenshot(path=os.path.join(shots, shot_name + '_click.png'))
        close_page(pg)
    # the keeper still talks as before when pressed on directly
    if bound:
        who = pg.evaluate("([npc])=>{const d=G.decor.find(q=>q.npc===npc);return d?{x:d.x,y:d.y,walk:!!d.walk}:null}", [row['npc']])
        st2 = who and pg.evaluate(STAND, [who['x'], who['y'], False])
        if st2:
            place(pg, st2, 600)
            s = press_and_wait(pg, 'Enter' if who['walk'] else 'w')
            res['npc_press'] = {'talk': s['talk'], 'talkNpc': s['talkNpc'], 'loot': s['loot']}
            res['npc_ok'] = bool(s['talk'] and s['talkNpc'] == row['npc'] and not s['loot'])
            close_page(pg)
        else:
            res['npc_ok'] = None
    out.append(res)
