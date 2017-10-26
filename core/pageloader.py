from core.template import Template
from pages.paths import paths, pattern_paths, aliases, redirects
from core.exceptions import NotFoundError, ServerError
import os
import re

import importlib
from pprint import pprint

def path_exists(path):
  if not _get_path_data(path):
    return False
  return True

def _get_path_data(path):
  data = paths.get(path, False) # Is the path directly defined?
  if data: return data
  
  for pattern, data in pattern_paths.items():
    match = re.compile(pattern).match(path)
    if match:
      data['params'] = match.groupdict()
      return data

  return False


def get(path, get = {}, post = {}, variables = {}):
  if path == '':
    path = 'index'
 
  if redirects.get(path, False):
    return {
      'headers': {
        'Content-Type': 'text/html',
        'Location': redirects.get(path)
      },
      'body': 'Please click <a href="%s">here</a>.' % redirects.get(path)
    }

  if aliases.get(path, False):
    path = aliases.get(path)

  path_data = _get_path_data(path)
 
  if not path_data:
    raise NotFoundError('Unknown path: ' + path)

  params = path_data.get('params', {})
  if params: get.update(params)

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
  if not template_path:
    raise ServerError('Path not configured correctly: ' + path)
  
  # Read the template file
  try: 
    template = Template(template_path)
  except IOError:
    raise ServerError('Template file does not exist: ' + template_path)

  template_data = {}

  # Import the controller (if specified)
  if controller_module:
    try:
      controller_module = importlib.import_module(controller_module)
    except ImportError as e:
      raise ServerError('Error importing controller for path "%s": %s' % (path, str(e)))

    # Get data to inject into the template
    template_data = controller_module.get_page_data(path, get, post, variables)

  # Add the page's title, if no title is set
  if not template_data.get('title', False):
    template_data['title'] = page_data.get('title', '')

  # Load predefined regions given in the paths file
  if load_regions:
    regions = paths.get('*', {'regions': {}}).get('regions', {})
    for (name, region) in regions.items():
      if not template_data.get(name, False):
        template_data[name] = _render_page(path, region, get, post, variables, False)

  return template.render(template_data)
  
