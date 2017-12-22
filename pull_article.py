import sys
import core.database as database
import yaml

if len(sys.argv) != 2:
    print('Usage: pull_article.py <article_name>')
    sys.exit()

arg_count, article_name = sys.argv

handle = database.get_handle('main')
article = handle.query_one(
    'SELECT * FROM %l WHERE name = %s',
    ['article', article_name]
)

if not article:
    print('Article does not exist')
    sys.exit()

print(article['body'])