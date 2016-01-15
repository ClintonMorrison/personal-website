from core import pageloader
from pages.paths import paths

"""
This script generates and caches prerendered versions of some
paths in "static/cache/".
"""

print "Rebuilding page caches..."

for path, item in paths.items():
  can_cache = (not item.get('dynamic')) and (not ':' in path) and (not path == '*')

  if can_cache: 
    print "Building: " + path
    page_data = pageloader.get(path, use_cache = False)
    filename = "static/cache/" + path.replace('/', '-')
    print filename
    file = open(filename, 'w')
    file.write(page_data.get('body'))
    file.close()
  else:
    print "[skipping: " + path + "]"

