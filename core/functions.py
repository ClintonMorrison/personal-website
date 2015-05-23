import config

def path_to_url(path = 'index', parameters = [], hash = ''):
  return "http://" + config.base_url + "/" + path

# Gets URL for static resource
def static_to_url(path):
  return path_to_url("static/" + path)
