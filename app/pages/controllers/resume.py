import yaml

def get_page_data(path, get, post, variables):
  resume_data = yaml.safe_load(open("static/resume.yml", "r"))
  for job in resume_data['work']:
    job['tasks_html'] = "<ul><li>%s</li></ul>" % "</li><li>".join(job['tasks'])

  return resume_data
