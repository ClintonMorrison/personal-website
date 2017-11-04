from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import core.requesthandler
from pathlib import Path

class DevServer(BaseHTTPRequestHandler):
    def _set_headers(self, headers):
        self.send_response(200)
        for name, value in headers:
            self.send_header(name, value)
        self.end_headers()

    def _write_body(self, content):
        self.wfile.write(content)

    def do_GET(self):
        self.do_REQUEST()

    def do_HEAD(self):
        request_handler = core.requesthandler.RequestHandler(os.environ)
        status, headers, body = request_handler.get_response()
        self._set_headers(headers)

    def do_POST(self):
        self.do_REQUEST()

    def do_REQUEST(self):
        file_path = self.path.lstrip('/')
        if self._file_exists(file_path):
            self._respond_with_file(file_path)
            return
        self._respond_with_server()

    def _respond_with_file(self, file_path):
        self._set_headers([('Content-Type', 'text/plain')])
        file = open(file_path, 'rb')
        self._write_body(file.read())

    def _respond_with_server(self):
        request_handler = core.requesthandler.RequestHandler({
            'REQUEST_URI': self.path
        })

        status, headers, body = request_handler.get_response()
        self._set_headers(headers)
        self._write_body(body)

    def _file_exists(self, path):
        file_path = Path(self.path.lstrip('/'))
        if file_path.is_file():
            return 'file found'

        return None



def run(server_class=HTTPServer, handler_class=DevServer, port=8002):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print('Server running: http://localhost:{}/'.format(port))
    httpd.serve_forever()


if __name__ == "__main__":
    from sys import argv

    print ("Starting server...")

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()