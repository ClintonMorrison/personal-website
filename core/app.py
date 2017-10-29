#!/home/clintor1/python/bin/python2

import core.pageloader
from core.exceptions import NotFoundError, ServerError
import config
import urllib


class App:
    def __init__(self, variables):
        self.variables = variables

    def get_params(self):
        terms = self.variables.get('QUERY_STRING', '').split('&')
        params = {}
        for term in terms:
            parts = term.split('=')
            if len(parts) == 2:
                params[parts[0]] = urllib.unquote(parts[1])
        return params

    def get_request_path(self):
        parts = self.variables.get('REQUEST_URI', '').split('?')
        return parts[0].strip('/')

    def get_error_response(self, code):
        return core.pageloader.get('404', {}, {}, self.variables)

    def get_response(self):
        params = self.get_params()
        path = self.get_request_path()

        # Try to load page data
        try:
            page_data = core.pageloader.get(path, params, {}, self.variables)
        except NotFoundError:
            page_data = self.get_error_response('404')
        except ServerError:
            if not config.debug:
                page_data = self.get_error_response('500')
            else:
                raise

        if not page_data:
            raise Exception('There was a problem loading data for the requested page.')

        # Render headers
        headers = []
        for header, value in page_data.get('headers').items():
            headers.append((header , value))

        # Render body
        body = b''
        if page_data.get('headers', {}).get('Content-Type', 'text/html') == 'text/html':
            body += b'<?xml version="1.0" encoding="UTF-8"?>'

        # Remove version_info placeholder
        body += page_data.get('body').encode('utf-8')
        body = body.replace(b'{{%version_info%}}', b'')

        return '200 OK', headers, body