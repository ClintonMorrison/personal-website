from core.app import App

def application(variables, start_response):
    app = App(variables)
    status, headers, body = app.get_response()
    start_response(status, headers)
    return body