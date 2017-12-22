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

  formatted_projects = []

  for project in projects:
    if project.get('hidden', 0) == 1:
      continue

    project['date_published'] = core.functions.format_date(project.get('date_published'))

    if not project.get('source_url', False):
      source_path = "downloads/projects/" + project.get('name') + "/source.zip"
      project['source_url'] = core.functions.static_to_url(source_path)

    project['view_url'] = project.get('target_url')
    formatted_projects.append(project)

  data['projects'] = formatted_projects


  return data
