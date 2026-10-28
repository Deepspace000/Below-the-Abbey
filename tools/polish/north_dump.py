import sys,os,json; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
with sync_playwright() as p:
    b,pg,errs=boot(p,700,450)
    r=pg.evaluate("()=>({img:Object.keys(IMG),h:NPC_H,loaded:Object.keys(IMG).filter(k=>IMG[k]&&IMG[k].complete&&IMG[k].naturalWidth).map(k=>[k,IMG[k].naturalWidth,IMG[k].naturalHeight])})")
    json.dump(r,open(os.path.join(os.environ['TEMP'],'n_img.json'),'w'))
    print(len(r['img']),len(r['loaded']),len(r['h']));b.close()
