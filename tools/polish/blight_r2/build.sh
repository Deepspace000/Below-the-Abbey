#!/bin/sh
cd /c/Users/mirko/Downloads/workspace/Below-the-Abbey
python tools/inject.py | tail -1
python - <<'PY'
import re,os
s=open('index.html',encoding='utf-8').read()
b=re.findall(r'<script>(.*?)</script>',s,re.S)
open(os.environ['TEMP']+'/r2chk.js','w',encoding='utf-8').write(max(b,key=len))
PY
node --check "$TEMP/r2chk.js" && echo PARSE OK
