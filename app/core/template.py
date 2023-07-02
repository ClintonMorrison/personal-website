import re
import core.functions
import sass
from pprint import pprint

class Template:
  def __init__(self, template_path):
    self.raw_contents = self._read_file(template_path)
    self.contents = self.raw_contents

  def render(self, data, remove_empty_tags = True):
    self.data = data

    # does this template exend another?
    extended_templates = re.findall(r"\[\% extends '([A-Za-z/0-9\.]+)' %\]", self.contents)
    extended_template = None
    if extended_templates:
      extended_template = extended_templates[0]


    # get regions defined and save as variables
    regions = re.findall(r"\[\% region ([A-Za-z0-9]+) \%\](.*?)\[\% end region \%\]", self.contents, re.S)
    for (region_name, value) in regions:
      if not self.data.get(region_name, False):
        self.data[region_name] = ""
      self.data[region_name] += value

    # get the parent template and load into that
    if extended_template:
      parent = Template(extended_template)
      self.contents = parent.render(self.data, False)
  
    # handle 'for each' blocks
    self.contents = re.sub(
      r"\[\% for each ([A-Za-z0-9]+) in ([A-Za-z0-9]+) \%\](.*?)\[\% end for each \%\]",
      self._render_foreach,
      self.contents,
      flags=re.S
    )

    # apply custom functions
    functions = self._get_functions()
    for (name, function) in functions.items():
      self._applyFunction(name)

    # fill in known values
    for key in list(self.data.keys()):
      self.contents = self._fill_tag(key, self.data.get(key, False), self.contents)

    # remove any unfilled tags
    if remove_empty_tags:
      self.contents = re.sub('\[\[.+?\]\]', '', self.contents)
      self.contents = re.sub('\[\%.+?\%\]', '', self.contents)
    
    return self.contents

  def _read_file(self, path):
    f = open(path, 'r', encoding="utf-8")
    contents = f.read()
    return contents

  def _is_string(self, object):
    return isinstance(object, str)

  def _render_foreach(self, match):
    item_name = match.group(1)
    collection_name = match.group(2)
    collection = self.data.get(collection_name, [])
    original_contents = match.group(3)

    newContents = ""
    for item in collection:
      newContents += self._fill_tag(item_name, item, original_contents)

    return newContents
  
  def _fill_tag(self, tag, data, string):
    if self._is_string(data):
        return re.sub('\[\[' + tag + '\]\]', data, string)
    else:
      new_string = string
      fields_to_replace = set(re.findall('\[\[' + tag + '.([a-zA-Z0-9_\$]+)' +'\]\]', string, re.S))
      for field in fields_to_replace:
        try:
          new_string = re.sub('\[\['+ tag + '.' + field + '\]\]', data[field], new_string)
        except KeyError:
          new_string = new_string
      return new_string
    # return unmodified string if bad data given
    return string

  def _applyFunction(self, function_name):
    tag = "\[\% " + function_name + " '(.+?)' \%\]"
    calls = re.findall(tag, self.contents, re.S)

    functions = self._get_functions()
    function = functions.get(function_name, False)
    if not function:
      raise Exception("Function '" + function_name + "' not implemented")
    
    for data in calls:
      replacement = function(data)
      specific_tag = "[% " + function_name + " '" + data + "' %]"
      self.contents = self.contents.replace(specific_tag, replacement)

  def _get_functions(self):
    return {
      'add javascript': self._add_javascript,
      'add sass': self._add_sass,
      'add css': self._add_css,
      'url': self._url,
      'static': self._static,
      'partial': self._render_partial
    }

  def _add_javascript(self, path):
    return   "%s<script type='text/javascript'>\n%s</script>" % (
      self._format_filename(path), self._read_file(path))

  def _add_css(self, path):
    return "%s\n<style>\n%s\n</style>" % (
      self._format_filename(path),  self._read_file(path))

  def _add_sass(self, path):
    return "%s\n<style>\n%s\n</style>" % (
      self._format_filename(path),
      sass.compile(string=bytes(self._read_file(path), 'utf-8'))
    )

  
  def _url(self, path):
    return core.functions.path_to_url(path)

  def _static(self, path):
    return core.functions.static_to_url(path)

  def _format_filename(self, path):
    return "\n<!-- FILE: " + path + " -->\n"

  def _render_partial(self, path):
    template = Template(path)
    return template.render({})
