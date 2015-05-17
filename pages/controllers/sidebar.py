from pages.paths import paths
import core.functions

def get_page_data(path, get, post, variables):
  pages = [
    {'title': 'Home', 'path': 'index'},
    {'title': 'Projects', 'path': 'projects'},
    {'title': 'Resume', 'path': 'resume'},
    {'title': 'About', 'path': 'about'},
    {'title': 'Contact', 'path': 'contact'},
    {'title': 'Blog', 'path': 'blog'},
  ]

  for page in pages:
    # Add URL
    page['url'] = core.functions.path_to_url(page.get('path', ''))

    # Select pages that look like the current page
    if page.get('path') in path:
      page['selected'] = 'selected'

  return {'pages': pages}
