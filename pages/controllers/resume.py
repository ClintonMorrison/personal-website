from pprint import pprint
import yaml

def get_page_data(path, get, post, variables):
  resume_data = yaml.load(open("static/resume.yaml", "r"))
  for job in resume_data['work']:
    job['tasks_html'] = "<ul><li>%s</li></ul>" % "</li><li>".join(job['tasks'])

  return resume_data
