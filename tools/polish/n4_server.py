import http.server, socketserver, os, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..'))
class S(http.server.ThreadingHTTPServer):
    request_queue_size=256
    daemon_threads=True
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
S(('0.0.0.0',8320),H).serve_forever()
