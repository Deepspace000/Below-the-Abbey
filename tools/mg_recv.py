"""CORS receiver for marginalia sheets: python tools/mg_recv.py <outdir> [port]  (POST /save/<name>)"""
import http.server, pathlib, sys
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8315
PAGE = b"""<!doctype html><meta charset=utf-8><title>rx</title><body style="font:14px sans-serif"><div id=s>waiting</div><script>
let n=0;addEventListener('message',async e=>{const d=e.data||{};if(!d.name)return;
try{const r=await fetch('/save/'+encodeURIComponent(d.name),{method:'POST',body:d.buf});const t=await r.text();n++;document.getElementById('s').textContent='saved '+n+' '+d.name+' '+t;e.source.postMessage({ok:d.name},'*')}catch(x){e.source.postMessage({err:d.name+' '+x},'*')}});
if(window.opener)window.opener.postMessage({ready:1},'*');</script>"""
class H(http.server.BaseHTTPRequestHandler):
    def cors(self):
        self.send_header('Access-Control-Allow-Origin', '*'); self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS'); self.send_header('Access-Control-Allow-Private-Network', 'true')
    def do_GET(self):
        self.send_response(200); self.send_header('Content-Type','text/html'); self.send_header('Content-Length',str(len(PAGE))); self.end_headers(); self.wfile.write(PAGE)
    def do_OPTIONS(self):
        self.send_response(204); self.cors(); self.end_headers()
    def do_POST(self):
        n = int(self.headers.get('Content-Length', 0)); body = self.rfile.read(n)
        name = self.path.split('/save/', 1)[1].replace('/', '_')
        (OUT / name).write_bytes(body)
        self.send_response(200); self.cors(); self.send_header('Content-Length', '2'); self.end_headers(); self.wfile.write(b'ok')
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
