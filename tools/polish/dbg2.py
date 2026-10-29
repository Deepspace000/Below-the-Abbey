import sys, os
sys.argv=[sys.argv[0],'shots']
from playwright.sync_api import sync_playwright
src = open(os.path.join(os.path.dirname(__file__), '..', 'ps_test.py'), encoding='utf8').read().split("modes = {")[0]
exec(src)
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'shots')
with sync_playwright() as p:
    b,pg,errs=boot(p)
    enter(pg,9720)
    pg.wait_for_timeout(1000)
    for i,(sc,y) in enumerate([(.72,16),(.3,16),(1.0,22)]):
        pg.evaluate("""([sc,y])=>{const d=G.decor.find(d=>d.k==='ps_gate_clock');d.sc=sc;G.P.x=32;G.P.y=y;G.P.f=0;G.P.angT=-Math.PI/2;G.C.x=32;G.C.y=y;G.C.a=G.P.angT;G.lvlBanners=[];G.talk=null;}""",[sc,y])
        pg.wait_for_timeout(600)
        pg.screenshot(path=os.path.join(OUT,'dbg2_%d.png'%i))
    b.close()
