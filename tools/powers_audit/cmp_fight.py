"""Compare fight_before.json with fight_after.json (or the file named on the command line)."""
import json, sys, os
H = os.path.dirname(os.path.abspath(__file__))
fb = json.load(open(os.path.join(H, 'fight_before.json')))['res']
fa = json.load(open(os.path.join(H, sys.argv[1] if len(sys.argv) > 1 else 'fight_after.json')))['res']
ch = []
for b in fb:
    a = [x for x in fa if x['party'] == b['party'] and x['L'] == b['L'] and x['foes'] == b['foes']][0]
    c = (a['rounds'] / b['rounds'] - 1) * 100
    ch.append(c)
    print('%-34s L%2d f%d  %6.2f -> %6.2f  %+4.0f%%' % (b['party'], b['L'], b['foes'], b['rounds'], a['rounds'], c))
big = [(b, c) for b, c in zip(fb, ch) if b['rounds'] >= 3]
print('mean change %+.1f%%, worst %+.1f%% / %+.1f%% (fights of 3 or more rounds: mean %+.1f%%, worst %+.1f%% / %+.1f%%)' % (sum(ch) / len(ch), min(ch), max(ch), sum(c for _, c in big) / len(big), min(c for _, c in big), max(c for _, c in big)))
