"""Smoke test: does the built page start and run?

  python tools/smoke.py            serves the repo itself on a free port and tests index.html
  python tools/smoke.py <url>      tests a page that is already being served

It opens the page in a headless browser and checks that
  1. the page reaches window.__ready with no page error,
  2. a new game runs frames (game time moves) with nothing in the error log of the game loop,
  3. a save written and loaded again gives the same place and the same party,
  4. a few places can be entered and still run frames.
Exit code 0 = passed, 1 = failed, 2 = could not run (Playwright or a browser is missing).
tools/stamp.py runs this first, so a release is not stamped from a page that does not run."""
import os, sys, json, threading, functools, http.server, socketserver

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLACES = [1, 2, 3, 13]   # the crypts, the Thornwood, Thornwick, Ironhill

def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    class Srv(socketserver.ThreadingMixIn, http.server.HTTPServer):
        daemon_threads = True
    srv = Srv(('127.0.0.1', 0), functools.partial(Quiet, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, 'http://127.0.0.1:%d/index.html' % srv.server_address[1]

def launch(p):
    last = None
    for kw in ({}, {'channel': 'chrome'}, {'channel': 'msedge'}):
        try:
            return p.chromium.launch(headless=True, **kw)
        except Exception as e:
            last = e
    raise last

MOVES = "async()=>{const t0=G.time;await new Promise(r=>setTimeout(r,1500));return G.time>t0}"
LOG = "()=>FRAME_ERR.log.map(l=>l.where+': '+l.m+(l.n>1?' (x'+l.n+')':''))"

def run(url):
    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        print('smoke test NOT RUN: Playwright for Python is not installed (pip install playwright)')
        return 2
    fails = []
    with sync_playwright() as p:
        try:
            b = launch(p)
        except Exception as e:
            print('smoke test NOT RUN: no browser could be started:', str(e)[:200])
            return 2
        pg = b.new_page()
        perr = []
        pg.on('pageerror', lambda e: perr.append(str(e)[:300]))
        try:
            pg.goto(url)
            pg.wait_for_function('window.__ready===true', timeout=240000)
        except Exception as e:
            print('SMOKE TEST FAILED: the page did not start:', str(e)[:300], perr)
            b.close()
            return 1
        def check(name, ok, extra=''):
            print(('  ok    ' if ok else '  FAIL  ') + name + (('  ' + str(extra)) if extra and not ok else ''))
            if not ok:
                fails.append(name)
        check('the page starts with no error', not perr, perr)
        pg.evaluate("()=>{setParty(DEFAULT_PARTY);reset();G.state='play'}")
        check('a new game runs', pg.evaluate(MOVES))
        check('nothing in the error log', not pg.evaluate(LOG), pg.evaluate(LOG))
        r = pg.evaluate("""async()=>{G.gold=321;writeSave('auto');const a=readSave('auto');if(!a)return {saved:false};
          G.gold=0;restore(a);await new Promise(r=>setTimeout(r,2500));
          return {saved:true,state:G.state,level:LEVEL===a.level,gold:G.gold,party:G.heroes.length===a.heroes.length&&G.heroes.every((h,i)=>h.lvl===a.heroes[i].lvl&&h.hp===a.heroes[i].hp),box:!!document.getElementById('notebox')}}""")
        check('a save loads back the same', r.get('saved') and r['state'] == 'play' and r['level'] and r["gold"] == 321 and r['party'] and not r['box'], r)
        for n in PLACES:
            r = pg.evaluate("""async(n)=>{try{reset(n);G.state='play'}catch(e){return {err:String(e)}}
              const t0=G.time;await new Promise(r=>setTimeout(r,1200));return {level:LEVEL,moves:G.time>t0}}""", n)
            check('place %d runs' % n, r.get('level') == n and r.get('moves'), r)
        log = pg.evaluate(LOG)
        check('nothing in the error log at the end', not log and not perr, [log, perr])
        b.close()
    if fails:
        print('SMOKE TEST FAILED:', ', '.join(fails))
        return 1
    print('smoke test passed')
    return 0

if __name__ == '__main__':
    if len(sys.argv) > 1:
        sys.exit(run(sys.argv[1]))
    srv, url = serve()
    try:
        code = run(url)
    finally:
        srv.shutdown()
    sys.exit(code)
