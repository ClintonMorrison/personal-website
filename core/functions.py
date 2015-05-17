
def path_to_url(path = 'index', parameters = [], hash = ''):
  return "http://clintonmorrison.com/main.cgi?q=" + path

# Gets URL for static resource
def static_to_url(path):
  return "http://clintonmorrison.com/static/" + path
