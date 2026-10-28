import json, os, sys
H = os.path.dirname(os.path.abspath(__file__))
fb = json.load(open(os.path.join(H, 'expected_before.json')))['res']
fa = json.load(open(os.path.join(H, sys.argv[1] if len(sys.argv) > 1 else 'expected_after.json')))['res']
rows = {}
for b in fb:
    a = [x for x in fa if x['party'] == b['party'] and x['L'] == b['L'] and x['foes'] == b['foes']][0]
    rows.setdefault((b['party'], b['L']), []).append((b['rounds'], a['rounds']))
allc = []
for (p, L), v in rows.items():
    c = [(a / b - 1) * 100 for b, a in v]
    allc += c
    print('%-34s L%2d  before %s  after %s  change %s' % (p, L, '/'.join('%.1f' % b for b, a in v), '/'.join('%.1f' % a for b, a in v), '/'.join('%+.0f%%' % x for x in c)))
print('mean %+.1f%%  min %+.0f%%  max %+.0f%%' % (sum(allc) / len(allc), min(allc), max(allc)))
