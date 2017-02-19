from pages.paths import paths
import core.functions

def get_page_data(path, get, post, variables):
  pages = [
    {'title': 'Home', 'path': 'index', 'icon': 'home'},
    {'title': 'Projects', 'path': 'projects', 'icon': 'code'},
    {'title': 'Resume', 'path': 'resume', 'icon': 'file-text'},
    {'title': 'About', 'path': 'about', 'icon': 'vcard'},
    {'title': 'Contact', 'path': 'contact', 'icon': 'envelope'},
    {'title': 'Blog', 'path': 'blog', 'icon': 'commenting'},
  ]

  for page in pages:
    # Add URL
    page['url'] = core.functions.path_to_url(page.get('path', ''))

    # Select pages that look like the current page
    if page.get('path') in path:
      page['selected'] = 'selected'

  return {'pages': pages}
