"""The big-level maps, one fresh browser each (they crash a long session): python mapshots2.py"""
import sys
from shotlib import Game
from mapshots import save
TOWNS = {'path': 'landpath', 'monasterygate': 'monasterygate', 'monastery': 'monastery', 'spire1': 'orangetower', 'hollowgrass': 'hollowgrass', 'khemetra': 'khemetracity'}
names = sys.argv[1:] or list(TOWNS)
for n in names:
    try:
        with Game(url='http://localhost:8399/index.html?town=%s&lvl=34' % TOWNS[n]) as g:
            g.pg.wait_for_timeout(8000)
            g.js("G.flags.noFog=1;G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=false")
            g.pg.wait_for_timeout(4000)
            save(n, g.js("(()=>{render3D();ctx.setTransform(2,0,0,2,0,0);ui(.016);return ctx.canvas.toDataURL('image/png')})()"))
    except Exception as e: print('FAIL', n, str(e)[:120])
