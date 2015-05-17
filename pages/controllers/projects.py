from core import database as database
from pprint import pprint
import core.functions

def get_page_data(path, get, post, variables):
  data = {}

  projects_table = database.Table('project')
  projects = projects_table.filter(
    orderBy = 'date_published',
    order = 'DESC',
    limit = 15
  )

  for project in projects:
    if not project.get('source_url', False):
      source_path = "downloads/projects/" + project.get('name') + "/source.zip"
      project['source_url'] = core.functions.static_to_url(source_path)
  
    if project.get('executable_type', False) == 'view_local':
      project['view_url'] = core.functions.path_to_url("projects/" + project.get('name'))
    else:
      source_path = "downloads/projects/" + project.get('name') + "/executable.zip"
      project['view_url'] = core.functions.static_to_url(source_path)

  data['projects'] = projects


  return data
