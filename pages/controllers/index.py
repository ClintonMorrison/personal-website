from core import database as database
from pprint import pprint

def get_page_data(path, get, post, variables):
  data = {'title': 'Hello there!'}

  projects_table = database.Table('project')
  projects = projects_table.filter(
    conditions = [('hidden', '=', 0)],
    orderBy = 'date_published',
    order = 'DESC',
    limit = 3
  )
  data['projects'] = projects


  articles_table = database.Table('article')
  articles = articles_table.filter(
    orderBy = 'date_published',
    order = 'DESC',
    limit = 3
  )
  data['articles'] = articles

  return data
