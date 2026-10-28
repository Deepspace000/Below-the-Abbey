"""python tools/polish/b58_dump.py OUTPNG key1 key2 ...   contact sheet of IMG keys on a grey ground (BL_PORT default 8631)"""
import sys, os, time, base64, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BL_PORT', '8631')
keys = sys.argv[2:]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    pg.goto('http://localhost:%s/index.html?town=blight6&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'", timeout=60000)
    pg.wait_for_timeout(2500)
    d = pg.evaluate("""(keys)=>{const c=document.createElement('canvas');const n=keys.length,cell=200;c.width=cell*Math.min(n,6);c.height=cell*Math.ceil(n/6);const x=c.getContext('2d');x.fillStyle='#667';x.fillRect(0,0,c.width,c.height);x.font='11px sans-serif';
      keys.forEach((k,i)=>{const im=IMG[k];const ox=(i%6)*cell,oy=Math.floor(i/6)*cell;if(im&&im.width){const s=Math.min((cell-10)/im.width,(cell-24)/im.height);x.drawImage(im,ox+5,oy+18,im.width*s,im.height*s)}x.fillStyle='#fff';x.fillText(k+(im?'':' MISSING'),ox+3,oy+12)});return c.toDataURL('image/png')}""", keys)
    open(sys.argv[1], 'wb').write(base64.b64decode(d.split(',')[1]))
    b.close()
