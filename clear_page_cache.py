import os
import shutil
from glob import glob

import config

"""
This script clears the prerendered versions of some
paths in "static/cache/".
"""

CACHE_PATH = config.cache_path

print("> Clearing cache...")
files = glob("%s/*" % CACHE_PATH)
for f in files:
  print("    removing '%s'" % f)
  if os.path.isdir(f):
    shutil.rmtree(f)
  else:
    os.remove(f)

