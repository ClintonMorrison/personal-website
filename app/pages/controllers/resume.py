import yaml

from core.markdown import MarkdownParser

markdown_parser = MarkdownParser('')

def get_page_data(path, get, post, variables):
  resume_data = yaml.safe_load(open("static/resume.yml", "r"))
  for job in resume_data['work']:
    tasks = [markdown_parser.render_inline(task) for task in job['tasks']]
    job['tasks_html'] = "<ul><li>%s</li></ul>" % "</li><li>".join(tasks)

  return resume_data
