cd /c/Users/mirko/Downloads/workspace/Below-the-Abbey
python - <<'P'
import sys
sys.path.insert(0,'tools/polish')
import w4lib
print(w4lib.run({'op':'reload'},timeout=900))
P
python tools/polish/w4ev.py w4_go475.js null
sleep 20
for a in "d0a 39 137 0" "d1a 147 97 0" "d2a 97 65 1" "d0b 19 137 0" "d1b 147 71 2" "d2b 123 43 2"; do python tools/polish/w4shot.py $a; done
echo ALLDONE
