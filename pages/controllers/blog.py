from core import database as database
from pprint import pprint
import core.functions
from core.markdown import MarkdownParser
import textwrap

def get_page_data(path, get, post, variables):
  data = {}

  articlesTable = database.Table('article')
  articles = articlesTable.filter(
    orderBy = 'date_published',
    order = 'DESC',
    limit = 50
  )

  for article in articles:
    article['date_published'] = article.get('date_published').strftime('%B %m, %Y')
    markdownParser = MarkdownParser('blog/%s/' % (article.get('name')), preview_mode=True)
    text = core.functions.truncate_text(article.get('body'), 150)
    article['intro'] = markdownParser.render(text)

  data['articles'] = articles

  return data
