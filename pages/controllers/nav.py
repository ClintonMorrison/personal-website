import core.functions

def get_page_data(path, get, post, variables):
  pages = [
    {'title': 'Home', 'path': 'index', 'icon': 'home'},
    {'title': 'Projects', 'path': 'projects', 'icon': 'code'},
    {'title': 'Resume', 'path': 'resume', 'icon': 'file-text'},
    {'title': 'Contact', 'path': 'contact', 'icon': 'envelope'},
    {'title': 'Blog', 'path': 'blog', 'icon': 'commenting'},
  ]

  for page in pages:
    page['url'] = core.functions.path_to_url(page.get('path', ''))

    # Mark current page as active
    if page.get('path') in path:
      page['active'] = 'active'

  return {'pages': pages}
