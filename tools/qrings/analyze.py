"""Turns results2.json into one verdict per (quest, stage). python tools/qrings/analyze.py results2.json [-v]"""
import json, sys
def verdict(r):
    """returns dict(ring, place, world, notes[])"""
    v = {'ring': None, 'place': None, 'world': None, 'notes': []}
    if r.get('levels') is None: v['notes'].append('NO SPEC'); return v
    ring_all, place_all = [], []
    for o in r['on']:
        if o.get('err'): v['notes'].append('ERR ' + str(o['err'])[:80]); ring_all.append(False); place_all.append(False); continue
        if o.get('level') != o.get('lvl'): v['notes'].append('could not enter L%s' % o.get('lvl')); ring_all.append(False); place_all.append(False); continue
        exp = o.get('exp') or []
        if not exp: v['notes'].append('L%s: target not found on the level' % o['lvl']); ring_all.append(False); place_all.append(False); continue
        ring = o.get('ring')
        ring_all.append(bool(ring) and not o.get('world'))
        if not ring: v['notes'].append('L%s: no ring (%s)' % (o['lvl'], 'world map' if o.get('world') else 'none')); place_all.append(False); continue
        ok = any(abs(ring['cx'] - e['x']) <= 1.3 and abs(ring['cy'] - e['y']) <= 1.3 for e in exp)
        place_all.append(ok)
        if not ok: v['notes'].append('L%s: ring at %.0f,%.0f not on target %s' % (o['lvl'], ring['cx'], ring['cy'], [(e['x'], e['y']) for e in exp][:3]))
        if o.get('reach') == 'tele': v['notes'].append('L%s: reached through a teleporter' % o['lvl'])
        elif o.get('reach') is False: v['notes'].append('L%s: target not reachable on foot' % o['lvl'])
        if ring.get('pr', 0) < 6: v['notes'].append('L%s: ring tiny' % o['lvl'])
    v['ring'] = all(ring_all) if ring_all else False
    v['place'] = all(place_all) if place_all else False
    off = r.get('off')
    if off:
        if off.get('err'): v['world'] = False; v['notes'].append('off ERR ' + str(off['err'])[:60])
        else:
            door = bool(off.get('ring')) and off.get('door')
            w = bool(off.get('wring'))
            v['world'] = door or w
            if not v['world']: v['notes'].append('off-level: no door ring and no world ring (world=%s loc=%s)' % (off.get('world'), off.get('loc')))
            elif w and not off.get('goto'): v['world'] = False; v['notes'].append('world map ring has no "Go to" text')
    return v
if __name__ == '__main__':
    d = json.load(open(sys.argv[1])); bad = 0
    for r in d['res']:
        v = verdict(r); ok = v['ring'] and v['place'] and v['world']
        if not ok: bad += 1
        if not ok or '-v' in sys.argv: print(('OK  ' if ok else 'FAIL'), r['id'], r['stage'], 'levels', r.get('levels'), v['notes'][:4])
    print('failures', bad, 'of', len(d['res']), 'errs', d['errs'][:3])
