from core import database as database
from pprint import pprint

def get_page_data(path, get, post, variables):
  scores_table = database.Table('GameScore')
  scores = scores_table.filter(
    orderBy = 'score',
    order = 'DESC',
    limit = 5
  )

  for score in scores:
    score['score'] = str(score['score'])

  return {'scores': scores}
