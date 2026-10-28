import os, sys, json; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
from sites import *
tag = sys.argv[1] if len(sys.argv) > 1 else 'before'
only = sys.argv[2].split(',') if len(sys.argv) > 2 and sys.argv[2] != 'all' else None
dists = [int(a) for a in (sys.argv[3].split(',') if len(sys.argv) > 3 else ['1', '3', '5'])]
with sync_playwright() as p:
    b, pg, errs = boot(p)
    info = pg.evaluate("""() => { const L=LEVELS[530], cnt={}; for(const d of L.decor){cnt[d.k]=(cnt[d.k]||0)+1}
      return {missing:Object.keys(cnt).filter(k=>!IMG[k]&&!NPC_H[k]), keys:Object.keys(IMG).filter(k=>/^gyp_(gatesC|stairFix|entry)/.test(k)).map(k=>[k,IMG[k].width,IMG[k].height])} }""")
    print(json.dumps(info))
    for name, x, y, f in SITES:
        if only and name not in only: continue
        for d in dists:
            sx, sy = stand(x, y, f, d)
            go(pg, 530, sx, sy, f)
            print(shot(pg, '%s_%s_d%d' % (tag, name, d)))
    print('errors', [e for e in errs if 'sp_' not in e][:10])
    b.close()
