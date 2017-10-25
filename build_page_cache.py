import os
import shutil
from datetime import datetime
import pytz
from glob import glob

import config
from core.functions import get_func_from_module
from core import pageloader
from pages.paths import paths, pattern_paths

"""
This script generates and caches prerendered versions of some
paths in "static/cache/".
"""

CACHE_PATH = config.cache_path

print "> Clearing cache..."
files = glob("%s/*" % CACHE_PATH)
for f in files:
  print "    removing '%s'" % f
  if os.path.isdir(f):
    shutil.rmtree(f)
  else:
    os.remove(f)

print "\n> Rebuilding pages..."

for path, item in paths.items() + pattern_paths.items():
  can_cache = (not item.get('dynamic')) and (not ':' in path) and (not path == '*')

  if not can_cache: 
    print "    [skipping: " + path + "]"
    continue
   
  possible_paths = [path]
  
  cache_paths = item.get('cache_paths')
  if cache_paths:
    possible_paths = get_func_from_module(cache_paths)()

  for possible_path in possible_paths:
    filename = "%s/%s.html" % (CACHE_PATH, possible_path)
    
    # Create path for output file
    dirname = os.path.dirname(filename)
    if not os.path.exists(dirname):
      os.makedirs(dirname)

    print "    GET %s --> '%s'" % (possible_path.ljust(40), filename)
    page_data = pageloader.get(possible_path)
    out_file = open(filename, 'w+')
    
    body = page_data.get('body')
    now = datetime.now(pytz.timezone(config.timezone))

    # Fill version_info placeholder if debug is enabled
    if config.debug:
      last_updated = 'Last updated: %s' % (now.strftime('%-I:%M %p, %b %d, %Y'))
      body = body.replace('{{%version_info%}}', last_updated)
    else:
      body = body.replace('{{%version_info%}}', '&starf;')

    out_file.write(body)
    out_file.close()

