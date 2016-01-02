import re
import core.functions
from cgi import escape

class MarkdownParser:
  def __init__(self, resource_path):
    self.resource_path = resource_path
    self.codeblocks = []

  def _render_italics(self, match):
    contents = match.group(1)
    return "<em>%s</em>" % (contents)

  def _render_bold(self, match):
    contents = match.group(1)
    return "<strong>%s</strong>" % (contents)

  def _render_link(self, match):
    label = match.group(1)
    url = match.group(2)
    return "<a target='_blank' href='%s'>%s</a>" % (url, label)

  def _render_header(self, match):
    return "<h4>%s</h4>" % (match.group(1))

  def _render_paragraph(self, match):
    return "<p>%s</p>" % (match.group(1))

  def _render_list_item(self, match):
    return "<li class='blog'>%s</li>" % (match.group(1))

  def _render_image(self, path, position):
    url = core.functions.static_to_url(self.resource_path + path)
    return "<div class='img-wrapper'><img class='%s' src='%s'></img></div>" % (position.lower(), url)

  def _render_codeblock(self, code):
    return "<code>%s</code>" % escape(code.strip())
 
  def _replace_codeblock(self, match):
    self.codeblocks.append(match.group(1))
    return "%CODE_BLOCK_PLACEHOLDER%"

  def _render_code(self, path, language):
    code = open("static/%s/%s" % (self.resource_path, path), "r").read().encode('string-escape')
    return "<code>%s</code>" % escape(code)

  def _render_code_snippet(self, match):
    return "<span class='code-snippet'>%s</span>" % (match.group(1))

  def _get_resource_handlers(self):
    return {
      'IMAGE': self._render_image,
      'CODE': self._render_code,
    }

  def _render_resource(self, match):
    type = match.group(1)
    arg1 = match.group(2)
    arg2 = match.group(3)
    handler = self._get_resource_handlers().get(type, False)

    if handler:
      return handler(arg1, arg2)
    else:
      return "<em style='color: red'>Unknown Resource: %s</em>" % (type)

    

  def apply_rules(self, markdown, rules):
    new_markdown = markdown
    for (rule, replace_func) in rules.iteritems():
      new_markdown = re.sub(
        rule,
        replace_func,
        new_markdown,
        flags = re.S
      )
    return new_markdown



  def render(self, markdown):
    rules_1 =  {
      r"\*([^\n]*?)\*": self._render_italics,
      r"\*\*([^\n]*?)\*\*": self._render_bold,
      r"([^\s]*?)\[(.*?)\]": self._render_link,
      r"\n([^\n]*?)\n(\-+)": self._render_header,
      r"[\s^\n]*?[\#]([^\n]*?)\n": self._render_list_item,
     # r"[^`]`(.*?)`[^`]": self._render_code_snippet
    }

    rules_2 = {
      r"\n([^\n^\^`-]*?)\n": self._render_paragraph,
    }

    rules_3 = {
      r"\%\% (.+?), (.+?), (.+?) \%\%": self._render_resource,
    }
    
   
    # Remove codeblocks
    markdown = re.sub(
      r"```(.*?)```",
      self._replace_codeblock,
      markdown,
      flags = re.S
    )

    markdown = self.apply_rules(markdown, rules_1)
    markdown = self.apply_rules(markdown, rules_2)
    markdown = self.apply_rules(markdown, rules_3)

    for code in self.codeblocks:
      markdown = markdown.replace('%CODE_BLOCK_PLACEHOLDER%', self._render_codeblock(code), 1)

    return markdown


