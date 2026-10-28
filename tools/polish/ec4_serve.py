"""python -m http.server 8363 with a bigger listen backlog (the default of 5 drops connections when the browser asks for 3500 pictures at boot)."""
import http.server, os, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
os.chdir(ROOT)
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
class S(http.server.ThreadingHTTPServer):
    request_queue_size = 512
    daemon_threads = True
S(('', int(sys.argv[1]) if len(sys.argv) > 1 else 8363), H).serve_forever()
