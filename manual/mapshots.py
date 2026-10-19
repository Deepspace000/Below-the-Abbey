"""The illuminated area maps (colour) for the manual: python mapshots.py  ->  img/maps/NAME.png"""
import os, base64
from shotlib import Game
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img', 'maps'); os.makedirs(OUT, exist_ok=True)
LEVELS = {'abbey': 1, 'thornwood': 2, 'gwood': 7, 'ironroad': 10, 'ironhill': 13, 'moor': 19, 'graves': 20, 'pass': 22, 'greendale': 32, 'anaea': 33,
          'sandroad': 41, 'tomb': 42, 'reddunes': 43, 'khemetra': 44, 'bluedunes': 60, 'goldenerg': 61, 'violeterg': 62, 'whitedunes': 63, 'flatlands': 64,
          'yarrim': 290, 'bells': 301, 'cinder': 302, 'lastlight': 303, 'quay': 304, 'oldhaven': 305, 'oakwood': 311, 'hollowland': 364,
          'path': 400, 'monasterygate': 411, 'monastery': 430, 'spire1': 440, 'spire5': 444, 'hollowgrass': 470}
JS = """async (id)=>{ if(!LEVELS[id]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[id])KH_LAZY[id]();
  G.flags.noFog=1; goToLevel(id,{x:(LEVELS[id]&&LEVELS[id].start&&LEVELS[id].start.x)||2,y:(LEVELS[id]&&LEVELS[id].start&&LEVELS[id].start.y)||2,f:0});
  G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=false;
  await new Promise(r=>setTimeout(r,2500)); render3D(); ctx.setTransform(2,0,0,2,0,0); ui(.016); return ctx.canvas.toDataURL('image/png')}"""
def save(name, data):
    open(os.path.join(OUT, name + '.png'), 'wb').write(base64.b64decode(data.split(',')[1])); print('saved', name)
if __name__ == '__main__':
    with Game() as g:
        g.js("G.flags.noFog=1")
        # the world map
        g.js("G.state='play';G.menu=false;G.cut=null;G.talk=null;G.overview=true;G.world=true;G.wv=wvDefault()"); g.pg.wait_for_timeout(2500)
        save('world', g.js("(()=>{render3D();ctx.setTransform(2,0,0,2,0,0);ui(.016);return ctx.canvas.toDataURL('image/png')})()"))
        for name, lv in LEVELS.items():
            try: save(name, g.pg.evaluate(JS, lv))
            except Exception as e: print('FAIL', name, str(e)[:100])
