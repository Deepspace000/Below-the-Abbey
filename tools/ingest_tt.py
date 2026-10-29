"""usage: python tools/ingest_tt.py <sheet.jpg> <i>   cuts one boss picture (on magenta) into assets/tt/tt<i>.webp using ingest_ps.py's cutter (no manifest entry kept)."""
import sys, subprocess, json, pathlib, shutil
root = pathlib.Path(__file__).resolve().parent.parent
src, i = sys.argv[1], sys.argv[2]
subprocess.check_call([sys.executable, str(root / 'tools' / 'ingest_ps.py'), src, 'tt', 'sprite', 'names=tt' + i, 'maxh=1000'])
(root / 'assets' / 'tt').mkdir(exist_ok=True)
shutil.move(str(root / 'assets' / 'ps' / ('tt' + i + '.webp')), str(root / 'assets' / 'tt' / ('tt' + i + '.webp')))
mp = root / 'assets' / 'ps' / 'manifest.json'; m = json.loads(mp.read_text()); m.pop('tt' + i, None); mp.write_text(json.dumps(m, indent=0))
