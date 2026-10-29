"""indoor critic walk: python tools/polish/psi_walk.py <name> <n> <ids...>; shots to PS_SHOTS/<name>_<id>_<k>.png plus 2x2 sheets.
Optional PSI_PTS='{"9740":[[x,y,f],...]}' to use fixed viewpoints instead of spread ones."""
import sys, os, json
name, n = sys.argv[1], int(sys.argv[2]); ids = [int(a) for a in sys.argv[3:]]
sys.argv = ['x', 'load']
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ps_test.py'), encoding='utf-8').read().split("modes = {")[0]
exec(compile(src, 'ps_test', 'exec'))
from PIL import Image
FIX = json.loads(os.environ.get('PSI_PTS', '{}'))
with sync_playwright() as p:
    b, pg, errs = boot(p, w=800, h=500)
    for id_ in ids:
        enter(pg, id_)
        if str(id_) in FIX:
            pts = [(a[0], a[1], a[2], 0) for a in FIX[str(id_)]]
        else:
            pts = pg.evaluate("""(n) => {
          const W=G.grid[0].length,H=G.grid.length,open=[];
          for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(G.grid[y][x]===0&&!(typeof cellBlocked==='function'&&cellBlocked(x,y)))open.push([x,y]);
          const d=[[0,-1],[1,0],[0,1],[-1,0]];
          const run=(x,y,f)=>{let k=0;while(k<30){const nx=x+d[f][0]*(k+1),ny=y+d[f][1]*(k+1);if(nx<0||ny<0||nx>=W||ny>=H||G.grid[ny][nx]!==0)break;k++}return k};
          const sel=[open.find(p=>p[0]===G.P.x&&p[1]===G.P.y)||open[0]];
          while(sel.length<n){let best=null,bd=-1;for(const p of open){let m=1e9;for(const s of sel){const dd=Math.abs(p[0]-s[0])+Math.abs(p[1]-s[1]);if(dd<m)m=dd}
            if(m>bd){bd=m;best=p}}sel.push(best)}
          return sel.map(([x,y])=>{let bf=0,br=-1;for(let f=0;f<4;f++){const r=run(x,y,f);if(r>br){br=r;bf=f}}return [x,y,bf,br]})}""", n)
        ims = []
        for k, (x, y, f, r) in enumerate(pts):
            pg.evaluate("""([x,y,f]) => { G.lvlBanners=[]; G.talk=null; G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.P.ang=G.P.angT;G.C.x=x;G.C.y=y }""", [x, y, f])
            pg.wait_for_timeout(700)
            fn = os.path.join(SHOTS, '%s_%d_%02d.png' % (name, id_, k))
            pg.screenshot(path=fn); ims.append((fn, x, y, f))
            print(id_, k, x, y, f)
        for s in range(0, len(ims), 4):
            sh = Image.new('RGB', (1200, 760))
            for j, (fn, *_r) in enumerate(ims[s:s+4]):
                im = Image.open(fn).convert('RGB').resize((600, 375)); sh.paste(im, ((j % 2) * 600, (j // 2) * 380))
            sh.save(os.path.join(SHOTS, '%s_%d_sheet%d.png' % (name, id_, s // 4)))
    print('errors', real(errs)[:6]); b.close()
