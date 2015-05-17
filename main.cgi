#!/home/clintor1/python/bin/python2

import os
import sys
import cgi
import cgitb
import json
from pprint import pprint
import core.pageloader
from core.exceptions import NotFoundError, ServerError

# Show debugging messages?
cgitb.enable()

variables = os.environ

# Parse get parameters
get_terms = variables.get('QUERY_STRING', '').split('&')
get_params = {}
for term in get_terms:
  parts = term.split('=')
  if len(parts) == 2:
    get_params[parts[0]] = parts[1]

# Figure out a path to use



try:
  page_data = core.pageloader.get(get_params.get('q', ''), get_params, {}, variables)
except NotFoundError:
  page_data = core.pageloader.get('404', {}, {}, variables, use_cache = False)
#except ServerError:
#  page_data = core.pageloader.get('500', {}, {}, variables)

if not page_data:
  raise Exception('There was a problem loading data for the requested page.')

# Render headers
for header, value in page_data.get('headers').iteritems():
  print header + ': ' + value + "\n"

# Render body
print '<?xml version="1.0" encoding="UTF-8"?>'
print page_data.get('body')

