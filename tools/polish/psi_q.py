"""run a JS expression in the game after entering level ids: python tools/polish/psi_q.py 9740 "js expression returning json" """
import sys, os, json
lvl = int(sys.argv[1]); js = sys.argv[2]
sys.argv = ['x', 'load']
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ps_test.py'), encoding='utf-8').read().split("modes = {")[0]
exec(compile(src, 'ps_test', 'exec'))
with sync_playwright() as p:
    b, pg, errs = boot(p)
    enter(pg, lvl)
    print(json.dumps(pg.evaluate(js), indent=0)[:6000])
    b.close()
