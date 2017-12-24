from core.functions import get_func_from_module, path_to_url
from pages.paths import paths, pattern_paths

def get_page_data(path, get, post, variables):
  urls = []
  for item_path, item in list(paths.items()) + list(pattern_paths.items()):
    if item.get('sitemap_exclude'):
      continue

    if item_path == 'index':
      item_path = ''

    possible_paths = [item_path]

    if item.get('possible_paths'):
      possible_paths = get_func_from_module(item.get('possible_paths'))()

    for possible_path in possible_paths:
      urls.append(path_to_url(possible_path))

  return { 'urls': urls }