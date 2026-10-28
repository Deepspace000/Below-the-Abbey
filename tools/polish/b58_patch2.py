import re
p = 'src/desert/blight58_polish.js'
s = open(p, encoding='utf-8').read()
s = re.sub(r"  if\(location\.search\.includes\('nofence'\)\).*\n", "", s)
s = re.sub(r"  if\(location\.search\.includes\('edge'\)\)b58Boundary\(L\);\n", "", s)
i = s.index("/* the map edge:")
j = s.index("/* ---------- wrap a level builder")
s = s[:i] + s[j:]
open(p, 'w', encoding='utf-8').write(s)
print('nofence' in s, 'b58Boundary' in s)
