from core.requesthandler import RequestHandler

def application(variables, start_response):
    request_handler = RequestHandler(variables)
    status, headers, body = request_handler.get_response()
    start_response(status, headers)
    return body