import core.functions
import json

def get_page_data(path, get, post, variables):
  data = {}

  message = get.get('message', False)
  if not message:
    return {'content': ''}

  data['source'] = 'computer'
  data['message'] = 'I see.'

  return {'content': json.dumps(data)}
