"""python tools/polish/b7s_run.py <query> <jsfile> <ids comma> [outfile]  : loads a page, sets window.__ids, evals the js file, prints/writes JSON."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
port = os.environ.get('B7_PORT', '8605')
q, jsf, ids = sys.argv[1], sys.argv[2], [int(x) for x in sys.argv[3].split(',')]
mn = 9670 if '9670' in q or 'vault' in q else 600
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('BTA_CHROME', 'C:/Program Files/Google/Chrome/Application/chrome.exe'), args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    pg.goto('http://localhost:%s/index.html%s&v=%d' % (port, q, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=%d" % mn, timeout=150000)
    pg.wait_for_timeout(3000)
    pg.evaluate("ids=>{window.__ids=ids}", ids)
    r = pg.evaluate(open(jsf, encoding='utf8').read())
    if len(sys.argv) > 4:
        json.dump(r, open(sys.argv[4], 'w'), indent=1)
    else:
        for k, v in r.items():
            print('==', k); print(v if isinstance(v, str) else json.dumps(v))
    b.close()
