"""A small test harness for the stall shops: ONE browser stays open while commands arrive in a file (the page takes minutes to load on a busy machine).
    python -u tools/stall_shop/repl.py CMDFILE OUTFILE        (stop it by writing QUIT into CMDFILE)
A command file is 'js' or 'py' on the first line, then the body. js: evaluated in the page, the result goes to OUTFILE as JSON. py: run here (pg is the page).
OUTFILE gets 'DONE <n>' on its first line when command n is finished, and the answer after it."""
import sys, os, json, time, traceback
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib
from lib import *

CMD, OUT = sys.argv[1], sys.argv[2]
PORT = os.environ.get('STL_PORT', '8352')
errs = []


def write(n, body):
    tmp = OUT + '.tmp'
    open(tmp, 'w', encoding='utf-8').write('DONE %d\n%s\n' % (n, body))
    os.replace(tmp, OUT)


with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    try:
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)[:300]))
        pg.on('console', lambda m: errs.append('CON ' + m.text[:300]) if m.type == 'error' and '404' not in m.text and 'Failed to load resource' not in m.text else None)
        pg.goto('http://localhost:%s/index.html?town=thornwick&lvl=34&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=600000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof stlTable==='function'", timeout=900000)
        pg.wait_for_timeout(1500)
        pg.evaluate("()=>{for(const k of Object.keys(localStorage))if(k.startsWith('abbeySave_'))localStorage.removeItem(k)}")
        write(0, 'READY')
        n = 0
        ENV = dict(vars(lib)); ENV.update({'pg': pg, 'json': json, 'time': time, 'errs': errs, 'os': os})
        while True:
            if os.path.exists(CMD):
                try:
                    code = open(CMD, encoding='utf-8').read()
                    os.remove(CMD)
                except Exception:
                    time.sleep(0.2); continue
                if code.strip() == 'QUIT':
                    write(n + 1, 'bye'); break
                n += 1
                kind, _, body = code.partition('\n')
                try:
                    if kind.strip() == 'js':
                        res = pg.evaluate(body)
                        out = json.dumps(res, indent=None, default=str)
                    else:
                        ENV['result'] = None
                        exec(body, ENV)
                        out = json.dumps(ENV['result'], default=str)
                except Exception as e:
                    out = 'ERR ' + str(e)[:1500]
                write(n, out[:60000])
            time.sleep(0.3)
    finally:
        b.close()
