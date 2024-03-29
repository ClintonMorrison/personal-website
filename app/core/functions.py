import config
import importlib
import textwrap

def path_to_url(path = 'index', parameters = [], hash = ''):
  if hash == '':
    return "/%s" % (path)
  return "/%s#%s" % (path, hash)

# Gets URL for static resource
def static_to_url(path):
  return path_to_url("static/" + path)

def get_func_from_module(path):
  module_name, func_name = path.rsplit('.', 1)
  module = importlib.import_module(module_name)
  func = getattr(module, func_name)
  return func

def truncate_text(text, length):
  if len(text) <= length:
    return text

  next_space_index = text.find(' ', length)
  return text[:next_space_index].rstrip(',.?,:;" ') + ' ...'

def format_date(date):
  return date.strftime('%-B %-d, %-Y')

def format_date_field(dict, field_name):
  dict[field_name] = format_date(dict.get(field_name))
