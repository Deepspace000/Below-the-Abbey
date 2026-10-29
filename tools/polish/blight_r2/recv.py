import http.server, pathlib
OUT = pathlib.Path(__file__).resolve().parent / 'raw'
class H(http.server.BaseHTTPRequestHandler):
    def cors(self):
        self.send_header('Access-Control-Allow-Origin','*'); self.send_header('Access-Control-Allow-Methods','POST,OPTIONS'); self.send_header('Access-Control-Allow-Headers','*'); self.send_header('Access-Control-Allow-Private-Network','true')
    def do_OPTIONS(self):
        self.send_response(204); self.cors(); self.end_headers()
    def do_POST(self):
        n = int(self.headers.get('Content-Length', 0)); body = self.rfile.read(n)
        (OUT / self.path.split('/save/',1)[1].replace('/','_')).write_bytes(body)
        self.send_response(200); self.cors(); self.send_header('Content-Length','2'); self.end_headers(); self.wfile.write(b'ok')
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('127.0.0.1', 8613), H).serve_forever()
