#!/home/clintor1/python/bin/python2

import os
import sys
import cgi
import cgitb
import json
from pprint import pprint
import core.pageloader
from core.exceptions import NotFoundError, ServerError
import config
import urllib

# Show debugging messages?
if config.debug:
  cgitb.enable()

variables = os.environ

# Parse get parameters
get_terms = variables.get('QUERY_STRING', '').split('&')
get_params = {}
for term in get_terms:
  parts = term.split('=')
  if len(parts) == 2:
    get_params[parts[0]] = urllib.unquote(parts[1])

# Figure out a path to use
path = get_params.get('q', False)
if not path:
  parts = variables.get('REQUEST_URI', '').split('?')
  path = parts[0].strip('/')

# Try to load page data
try:
  page_data = core.pageloader.get(path, get_params, {}, variables)
except NotFoundError:
  page_data = core.pageloader.get('404', {}, {}, variables)
except ServerError:
  if not config.debug:
    page_data = core.pageloader.get('500', {}, {}, variables)
  else:
    raise

if not page_data:
  raise Exception('There was a problem loading data for the requested page.')

# Render headers
for header, value in page_data.get('headers').iteritems():
  print(header + ': ' + value)
print("")

# Render body
if page_data.get('headers', {}).get('Content-Type', 'text/html') == 'text/html':
  print('<?xml version="1.0" encoding="UTF-8"?>')

# Remove version_info placeholder
body = page_data.get('body')
body = body.replace('{{%version_info%}}', '')
print(body)
