from core import database as database
from core.exceptions import NotFoundError, ServerError
from core.markdown import MarkdownParser
from core.article_helpers import get_article
import core.functions
import yaml

def get_page_data(path, get, post, variables):
  article = get_article(get.get('name', ''))

  if not article:
    raise NotFoundError("No article with name: '{}'".format(get.get('name', '')))
  
  markdownParser = MarkdownParser('blog/%s/' % (article.get('name')))
  raw_articule = article['body']
  article['body'] = markdownParser.render(article['body'])

  return {
    'article': article,
    'title': article.get('title', ''),
    'raw_article': raw_articule
  }

def get_possible_paths():
  articles = database.Table('article').filter()
  queries = []

  for article in articles: 
    queries.append('blog/%s' % article.get('name'))

  return queries
  
