"""Wenlock interiors: working functions. python tools/wl2_func.py [port]
checks: every room builds and returns to its door in town; shops have stock; inn rests; church heals and raises; library books read; cellar chain."""
import sys, time, json
from playwright.sync_api import sync_playwright
PORT = sys.argv[1] if len(sys.argv) > 1 else '8376'
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 960, 'height': 720}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto('http://localhost:%s/index.html?town=wenlock&lvl=80&v=%d' % (PORT, int(time.time())))
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"&&LEVEL===496', timeout=120000); pg.wait_for_timeout(3000)
    r = pg.evaluate('''()=>{const out={bad:[],ok:0,shops:[],kinds:{}};
      for(const d of WL_DOORS.concat([{id:WL.CELLAR,kind:'cellar'},{id:WL.GRANARY,kind:'granary'}])){
        try{if(!LEVELS[d.id]&&KH_LAZY[d.id])KH_LAZY[d.id]();const L=LEVELS[d.id];if(!L){out.bad.push(d.id+' none');continue}
          const pt=L.portals[0];if(d.front&&(pt.to!==WL.ID||pt.x!==d.front.x||pt.y!==d.front.y||pt.f!==d.out))out.bad.push(d.id+' portal '+JSON.stringify(pt));
          // the start square is open and the exit door is below it
          if(L.rows[L.start.y][L.start.x]!=='.')out.bad.push(d.id+' start blocked');
          const npcs=L.decor.filter(q=>q.npc).map(q=>q.npc);const miss=npcs.filter(n=>!NPCS[n]);if(miss.length)out.bad.push(d.id+' unknown npc '+miss.join(','));
          out.kinds[L.wlin]=(out.kinds[L.wlin]||0)+1;out.ok++;
        }catch(e){out.bad.push(d.id+' ERR '+e.message)}}
      return out}''')
    print(json.dumps(r)[:1500])
    f = pg.evaluate('''()=>{const res={};
      // shops: every keeper has stock
      for(const k in KH_STOCK)if(k.startsWith('wli_')){const s=KH_STOCK[k]();res[k]=s.length+(s.every(r=>ITEMDEF[r[0]])?'':' BAD')}
      // inn
      G.gold=500;G.heroes.forEach(h=>{h.hp=1;h.alive=true});const inn=NPCS.wli_k_inn.root({});const g0=G.gold;inn.opts[0][1]();res.inn=[g0-G.gold,G.heroes.every(h=>h.hp>1)];
      // church: heal and raise
      G.gold=5000;G.heroes[1].alive=false;G.heroes.forEach(h=>{if(h.alive)h.hp=1});const ch=NPCS.wli_k_church.root({});res.church=ch.opts.map(o=>o[0]);
      ch.opts[0][1]();res.healed=G.heroes.filter(h=>h.alive).every(h=>h.hp===h.max);const ch2=NPCS.wli_k_church.root({});const rz=ch2.opts.find(o=>/^Raise/.test(o[0]));rz[1]();res.raised=G.heroes[1].alive;
      // library
      const lib=NPCS.wli_k_library.root({});res.books=lib.opts.length-2;hgbOpen('read','wlb_goose');res.page=BK.ui&&BK.ui.id;BK.ui=null;
      // votive candle, pie, cellar ghost
      res.candle=!!NPCS.wli_votive.root({}).opts.length;res.ghost=!!NPCS.wli_ghost.root({}).text;
      return res}''')
    print(json.dumps(f))
    print('errors', len(errs)); [print(' ', e[:300]) for e in errs[:15]]
    b.close()
