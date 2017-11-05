from core import database as database
from core.exceptions import NotFoundError, ServerError
from core.markdown import MarkdownParser
from pprint import pprint
import core.functions

def get_page_data(path, get, post, variables):
  articles_table = database.Table('article')
  articles = articles_table.filter([['name', '=', get.get('name', '')]])

  if not articles or len(articles) < 1:
    raise NotFoundError("No article with name: '" + get.get('name', ''))
  
  article = articles[0]
  article['date_published'] = article.get('date_published').strftime('%B %m, %Y')
  markdownParser = MarkdownParser('blog/%s/' % (article.get('name')))
  article['body'] = markdownParser.render(article['body'])

  return {'article': article, 'title': article.get('title', '')}

def get_possible_paths():
  articles = database.Table('article').filter()
  queries = []

  for article in articles: 
    queries.append('blog/%s' % article.get('name'))

  return queries
  
