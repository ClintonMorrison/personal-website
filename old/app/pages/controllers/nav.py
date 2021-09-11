import core.functions

def get_page_data(path, get, post, variables):
  pages = [
    {'title': 'Home', 'path': ''},
    {'title': 'Projects', 'path': 'projects'},
    {'title': 'Resume', 'path': 'resume'},
    {'title': 'Contact', 'path': 'contact'},
    {'title': 'Blog', 'path': 'blog'},
  ]

  for page in pages:
    page['url'] = core.functions.path_to_url(page.get('path', ''))

    page_path = page.get('path')
    if page_path == '':
      page_path = 'index'

    # Mark current page as active
    if path == page_path or page_path in path:
      page['active'] = 'active'

  return {'pages': pages}
