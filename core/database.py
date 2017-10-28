import MySQLdb
import MySQLdb.cursors
import re
import config
from pprint import pprint
import json

_database_handles = False

def get_handle(name = 'main'):
  '''
  Gets a handle for the given database. Makes a new connection if necessary.
  '''
  global _database_handles
  if not _database_handles:
    _database_handles = {}

  if _database_handles.get(name, False):
     return _database_handles.get(name, False)

  db_config = config.databases.get(name, False)

  if not db_config:
    raise Exception('No configuration for database handle: ' + name)

  handle = DatabaseHandle(db_config.get('host'), db_config.get('user'), db_config.get('passwd'), db_config.get('db'))
  _database_handles[name] = handle
  return handle


class DatabaseHandle:
  def __init__(self, host, username, passwd, db):
    """
    Creates a connection to the MySQL database
    """
    self.connection = MySQLdb.connect(
      host        = host,
      user        = username,
      passwd      = passwd,
      db          = db,
      cursorclass = MySQLdb.cursors.DictCursor
    )
    self.cursor = self.connection.cursor()

  def _query_raw_one(self, query):
    """
    Performs a query given a raw query string, returning at most one result.
    """
    results = self._query_raw(query)
    if len(results) >= 1:
      return results[0]
    return False

  def _query_raw(self, query):
    """
    Performs a query given a raw query string, returning all results.
    """
    self.cursor.execute(query);
    results = []
    for row in self.cursor.fetchall():
      results.append(row)

    return results

  def _get_replacement(self, placeholder, args):
    """
    Gets the replacement for a given placeholder in the query string.
    """
    if placeholder == '%':
      return '%'

    if len(args) == 0:
      raise Exception('More replacements than args given')
    arg = args.pop(0)

    if placeholder == 's':
      return "'" + self.connection.escape_string(arg) + "'"
    elif placeholder == 'l':
      return self.connection.escape_string(arg)
    elif placeholder == 'i':
      if isinstance(arg, int):
        return self.connection.escape_string(str(arg))
      else:
        return self.connection.escape_string(str(int(arg)))

    raise Exception('Unsupported placeholder: ' + placeholder)

  def query(self, query, args = []):
    print("QUERY ", query, args)
    placeholders = re.findall(r"\%([\%slin])", query, re.S)
    
    for placeholder in placeholders:
      replacement = self._get_replacement(placeholder, args)
      print("Replacement is:")
      print(replacement)
      query = query.replace('%' + placeholder, replacement, 1)

    return self._query_raw(query)

  def query_one(self, query, args = []):
    results = self.query(query, args)

    if len(results) >= 1:
      return results[0]
    return False


class Table:
  def __init__(self, table_name, handle = 'main', idCol = 'id'):
    self.handle = get_handle(handle)
    self.table_name = table_name
    self.id = idCol

  def all(self, offset = 0, limit = 1000, orderBy = False, order = 'DESC'):
    return self.filter([], offset, limit, orderBy, order)
    

  def filter(self, conditions = [], offset = 0, limit = 1000, orderBy = False, order = 'DESC'):
    query = 'SELECT * FROM %l '
    args = [self.table_name]
  
    if len(conditions) > 0:
      query += 'WHERE '

    index = 0
    for condition in conditions:
      if len(condition) != 3:
        raise Exception('Conditions array must be of length 3')
      field = condition[0]
      op    = condition[1]
      value = condition[2]
      
      index += 1

      args.append(value)
      query += self._format_operation(field, op, value)

      if index < len(conditions):
        query += 'AND '

    if orderBy:
      query += 'ORDER BY %l %l '
      args.append(orderBy)
      args.append(order)

    query += 'LIMIT %i, %i ';
    args.append(offset)
    args.append(limit)
    results = self.handle.query(query, args)
    rows = []
    for result in results:
      rows.append(result)
      #rows.append(Row(self.table_name, result.get(self.id), result))
    return rows

  def _format_operation(self, field, op, value):
    placeholder = ' %s '
    if isinstance(value, int):
      placeholder = ' %i '
    if op in ['=', '>', '>=', '<', '<=', '!=']:
      return field + ' ' + op + placeholder
    if op == 'in':
      raise Exception('TODO!')

class Row:
  def __init__(self, table, id, data = False):
    self._table = table
    self._data = data
    self.id = id

  def refresh(self):
    rows = self._table.filter([['id', '=', self.id]])
    if len(rows) >= 1:
      self._data = rows[0]._data
  
  def save(self):
    query = "UPDATE %l WHERE %l = %i SET "
    args = [self._table.table_name, self._table.id, self.id]
    key_value_pairs = []
    for key, value in list(self._data.items()):
      key_value_pairs.append(key + ' = ' + value)
    query += ", ".join(key_value_pairs)
    print('TODO!')

  def __getattr__(self, name):
    return self._data.get(name, None)
  
  def __repr__(self):
    return str(self._data)

