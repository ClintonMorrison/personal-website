from core import database as database
from core.exceptions import NotFoundError, ServerError
from pprint import pprint
import core.functions

def get_page_data(path, get, post, variables):
  articles_table = database.Table('article')
  articles = articles_table.filter([['name', '=', get.get('name', '')]])

  if not articles or len(articles) < 1:
    raise NotFoundError("No article with name: '" + get.get('name', ''))
  
  article = articles[0]
  article['date_published'] = article.get('date_published').strftime('%y/%m/%d')

  return {'article': article, 'title': article.get('title', '')}
