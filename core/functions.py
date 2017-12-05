import config
import importlib

def path_to_url(path = 'index', parameters = [], hash = ''):
  if hash == '':
    return "http://%s/%s" % (config.base_url, path)
  else:
    return "http://%s/%s#%s" % (config.base_url, path, hash)

# Gets URL for static resource
def static_to_url(path):
  return path_to_url("static/" + path)

def get_func_from_module(path):
  module_name, func_name = path.rsplit('.', 1)
  module = importlib.import_module(module_name)
  func = getattr(module, func_name)
  return func

