from core.template import Template
from pages.paths import paths, aliases
from core.exceptions import NotFoundError, ServerError
import os

import importlib
from pprint import pprint

def path_exists(path):
  if not _get_path_data(path):
    return False
  return True

def _get_path_data(path):
  data = paths.get(path, False) # Is the path directly defined?
  
  if not data:
    parts = path.split('/')
    return False
    #raise ServerError(parts)
  
  return data


def get(path, get = {}, post = {}, variables = {}, use_cache = True):
  if path == '':
    path = 'index'

  if aliases.get(path, False):
    path = aliases.get(path)

  path_data = _get_path_data(path)
 
  if not path_data:
    raise NotFoundError('Unknown path: ' + path)

  body = False
  if not path_data.get('dynamic', False) and use_cache:
    cachedPageName = 'static/cache/' + path.replace('/', '-')
    if os.path.isfile(cachedPageName):
      file = open(cachedPageName, 'r')
      body = file.read()
  if not body:
    #raise ServerError('no cache found for path: ' + path)
    body = _render_page(path, path_data, get, post, variables)

  contentType = 'text/html' 
  if path_data.get('type', 'html') == 'json':
    contentType = 'text/json'

  return {
    'headers': {'Content-Type': contentType},
    'body': body,
  }

  
def _render_page(path, page_data, get, post, variables, load_regions = True): 
  # Get paths for the template and controller for the page
  template_path = page_data.get('template', False)
  controller_module = page_data.get('controller', False)
  if not template_path or not controller_module:
    raise ServerError('Path not configured correctly: ' + path)
  
  # Read the template file
  try: 
    template = Template(template_path)
  except IOError:
    raise ServerError('Template file does not exist: ' + template_path)

  # Import the controller
  try:
    controller_module = importlib.import_module(controller_module)
  except ImportError:
    raise ServerError('Error importing controller for path: ' + path)

  # Get data to inject into the template
  template_data = controller_module.get_page_data(path, get, post, variables)

  # Add the page's title, if no title is set
  if not template_data.get('title', False):
    template_data['title'] = page_data.get('title', '')

  # Load predefined regions given in the paths file
  if load_regions:
    regions = paths.get('*', {'regions': {}}).get('regions', {})
    for (name, region) in regions.iteritems():
      if not template_data.get(name, False):
        template_data[name] = _render_page(path, region, get, post, variables, False)

  return template.render(template_data)
  
