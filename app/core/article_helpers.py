import yaml
from core.functions import format_date_field

def get_all_articles():
  articles = yaml.load(open('static/articles.yml', 'r'))
  filtered_articles = []

  for article in articles:
    article['body'] = get_article_body(article.get('name'))
    format_date_field(article, 'date_published')
    if article.get('visible'):
      filtered_articles.append(article)

  return filtered_articles

def get_article_body(name):
  return open('static/blog/{}/article.txt'.format(name), 'r').read()

def get_article(name):
  articles = yaml.load(open('static/articles.yml', 'r'))

  for article in articles:
    if article.get('name') == name:
      article['body'] = get_article_body(article.get('name'))
      format_date_field(article, 'date_published')
      return article

  return None
