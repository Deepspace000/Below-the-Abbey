import sys, json, pathlib
sys.path.insert(0,'tools/polish/c3tmp')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/c3shots')
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    info=pg.evaluate('''()=>{const L=LEVELS[476];return {lad:L._hgdu.ladders.length,keys:[...new Set(L.decor.filter(d=>d.pic).map(d=>d.k))],ex:L.decor.filter(d=>d.pic&&/lad/i.test(d.k)).slice(0,6),exl:L._hgdu.ladders.slice(0,3)}}''')
    print(json.dumps(info)[:1500])
    b.close()
