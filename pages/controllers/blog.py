from core import database as database
from pprint import pprint
import core.functions

def get_page_data(path, get, post, variables):
  data = {}

  articlesTable = database.Table('article')
  articles = articlesTable.filter(
    orderBy = 'date_published',
    order = 'DESC',
    limit = 25
  )

  for article in articles:
    article['date_published'] = article.get('date_published').strftime('%y/%m/%d')

  data['articles'] = articles

  return data
