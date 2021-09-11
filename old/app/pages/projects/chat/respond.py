import core.database
import json
import requests
import re
import random
import nltk
import time
import hashlib

def clean_text(text):
  text = re.sub('<[^<]+?>', '', text)
  text = re.sub('\&[a-zA-Z0-9]+\;', '', text)
  text = re.sub('\n', ' ', text)
  text = re.sub('[^a-zA-Z0-9\.\?\!\;\,\ \&\w\%\*]', '', text)
  text = text.split("\n")
  if text:
    return text[0]
  return ""

def get_page_data(path, get, post, variables):
  data = {}

  message = str(get.get('message', False))
  message = message

  if not message:
    return {'content': ''}

  data['source'] = 'computer'
  data['message'] = "I don't know."

  tokenizer = nltk.tokenize.RegexpTokenizer(r'\w+')
  words = tokenizer.tokenize(message)
  words = list(set([word.lower() for word in words]))
  stopset = nltk.corpus.stopwords.words('english')
  filtered_words = [word for word in words if word not in stopset]
  
  search_words = []
  if len(filtered_words) > 1:
    search_words = [random.choice(filtered_words)]
  elif filtered_words:
    search_words = filtered_words
  elif words:
    search_words = [random.choice(words)]

  search_words = list(set(search_words))

  response = requests.get(
    'http://api.urbandictionary.com/v0/define',
    params={'term': " ".join(search_words)}
  )
  results = json.loads(response.content.decode('utf-8')).get('list', {})


  answers = []
  for result in results:
    text = clean_text(result.get('example', ''))
    if text:
      answers.append(text)
  

  if answers:
    data['message'] = random.choice(answers)

  conversation_hash = hashlib.md5()
  conversation_hash.update(bytes("%s %s %s" % (
    variables.get('REMOTE_ADDR', ''),
    variables.get('HTTP_USER_AGENT', ''),
    time.strftime("%Y-%m-%d")
  ), 'utf-8'))
  conversation_id = conversation_hash.hexdigest()
  
  handle = core.database.get_handle()
  handle.query(
    'INSERT INTO `chat_logs`(`conversation`, `source`, `message`)  VALUES(%s, %s, %s)',
    [conversation_id, 'user', message.replace('+', ' ')]
  )
  handle.query(
    'INSERT INTO `chat_logs`(`conversation`, `source`, `message`)  VALUES(%s, %s, %s)',
    [conversation_id, 'computer', data.get('message', '[no message]')]
  )

  return {'content': json.dumps(data)}
