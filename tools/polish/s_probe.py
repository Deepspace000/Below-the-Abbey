import sys,json
from playwright.sync_api import sync_playwright
JS=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':840,'height':520})
    errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('response',lambda r: errs.append('404 '+r.url) if r.status==404 else None)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    import os
    pg.goto('http://localhost:8341/index.html?town=deephollow&lvl=34'+os.environ.get('HGQ',''),wait_until='commit',timeout=400000)
    pg.wait_for_function('typeof LEVELS!=="undefined"&&LEVELS[475]&&LEVELS[475].rows',timeout=400000)
    r=pg.evaluate(open(JS).read() if JS.endswith('.js') else JS)
    import pathlib;pathlib.Path(sys.argv[2] if len(sys.argv)>2 else "tools/polish/b_out.json").write_text(json.dumps(r));print(json.dumps(r)[:3000])
    print('ERRS',errs[:8])
    b.close()
