class NotFoundError(Exception):
  code = 404
  pass

class ServerError(Exception):
  code = 500
  pass
