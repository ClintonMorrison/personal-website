from core.requesthandler import RequestHandler

def application(variables, start_response):
    app = RequestHandler(variables)
    status, headers, body = app.get_response()
    start_response(status, headers)
    return body