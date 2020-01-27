from core.functions import truncate_text
from core.markdown import MarkdownBlogPreviewParser
from core.article_helpers import get_all_articles

def get_page_data(path, get, post, variables):
  data = {}

  articles = get_all_articles()

  for article in articles:
    markdownParser = MarkdownBlogPreviewParser('blog/{}/'.format(article.get('name')))
    text = truncate_text(article.get('body'), 450)
    article['intro'] = markdownParser.render(text)

  data['articles'] = articles

  return data
