"""python tools/polish/b9s_eval.py "<query e.g. ?town=sale&lvl=90>" <jsfile>   prints the JSON of the expression in jsfile"""
import sys, os, json, time
from playwright.sync_api import sync_playwright
port = os.environ.get('B9S_PORT', '8791')
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('BTA_CHROME', 'C:/Program Files/Google/Chrome/Application/chrome.exe'), args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 700})
    pg.goto('http://localhost:%s/index.html%s&v=%d' % (port, sys.argv[1], time.time()))
    pg.wait_for_function("() => typeof G!=='undefined' && G.state==='play' && typeof LEVEL!=='undefined'", timeout=120000)
    pg.wait_for_timeout(2500)
    print(json.dumps(pg.evaluate(open(sys.argv[2]).read()), indent=1)[:6000])
    b.close()
