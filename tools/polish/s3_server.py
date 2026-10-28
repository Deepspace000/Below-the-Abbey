import http.server, socketserver, sys
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
class S(http.server.ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True
S(('', 8331), H).serve_forever()
