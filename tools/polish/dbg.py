import sys, os
js=sys.argv[1]; lid=int(sys.argv[2])
sys.argv=[sys.argv[0],'shots']
from playwright.sync_api import sync_playwright
src = open(os.path.join(os.path.dirname(__file__), '..', 'ps_test.py'), encoding='utf8').read().split("modes = {")[0]
exec(src)
with sync_playwright() as p:
    b,pg,errs=boot(p)
    enter(pg,lid)
    print(pg.evaluate(js))
    b.close()
