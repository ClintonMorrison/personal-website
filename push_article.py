import sys
import core.database as database
import yaml

def prompt(name, default):
    if default:
        result = input('Enter value for "{}" ({}): '.format(name, default))
        if not result:
            return default
        return result
    return input('Enter value for "{}": '.format(name))

if len(sys.argv) != 3:
    print('Usage: push_article.py <filename> <article_name>')
    sys.exit()

arg_count, filename, article_name = sys.argv

file = open(filename, 'r')
body = file.read()

print('Content from file: {}...'.format(body[:15]))


handle = database.get_handle('main')
existing_article = handle.query_one(
    'SELECT * FROM %l WHERE name = %s',
    ['article', article_name]
)

if not existing_article:
    existing_article = {}

title = prompt('title', existing_article.get('title'))
date_published = prompt('date published', existing_article.get('date_published'))
description = prompt('description', existing_article.get('description'))


if not existing_article:
    print('Note: article does not exist')
else:
    print('Note: article already exists')

print("Data to submit:\n---------")
print('Name: {}'.format(article_name))
print('Title: {}'.format(title))
print('Date Published: {}'.format(date_published))
print('Description: {}'.format(description))
print('------------')

proceed = input('Do you want to upsert this article? (y/n): ')

if proceed == 'y':
    print('proceeding...')

    if existing_article.get('name'):
        print('updating existing...')
        query = '''
                 UPDATE %l
                   SET title=%s, body=%s, description=%s, date_published=%s
                   WHERE name=%s
               '''

        handle.query(
            query.strip(),
            ['article', title, body, description, date_published, article_name]
        )
    else:
        query = '''
          INSERT INTO %l
            (name, title, body, description, date_published, author_id)
            VALUES (%s, %s, %s, %s, %s, 0);
        '''

        handle.query(
            query.strip(),
            ['article', article_name, title, body, description, date_published]
        )