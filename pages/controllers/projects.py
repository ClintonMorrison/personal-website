import yaml
import core.functions

def render_source_button(project):
  text = 'GitHub'

  if project.get('source_type') == 'none':
    return ''
  elif project.get('source_type') == 'download':
    text = 'Download Source'

  return '<a class="button button-primary" href="{}">{}</a>'.format(project.get('source_url'), text)

def render_demo_button(project):
  text = 'Try It'

  if project.get('demo_type') == 'paper':
    text = 'View Paper'
  elif project.get('demo_type') == 'download':
    text = 'Download Demo'

  return '<a class="button button-primary" href="{}">{}</a>'.format(project.get('demo_url'), text)

def get_page_data(path, get, post, variables):
  data = {}
  projects = yaml.load(open("static/projects.yml", "r"))
  visible_projects = []

  for project in projects:
    project['date_published'] = core.functions.format_date(project.get('date_published'))
    if project.get('visible'):
      visible_projects.append(project)
    project['source_button'] = render_source_button(project)
    project['demo_button'] = render_demo_button(project)

  data['projects'] = visible_projects


  return data
