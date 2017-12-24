
# Note: Use 'dynamic' key to indicate that a page has dynamic content
# (eg if the page is not cachable)

paths = {
  '*': {
    'regions': {
      'sidebar': {
        'controller': 'pages.controllers.nav',
        'template': 'pages/templates/nav.html',
      }
    },
    'sitemap_exclude': True
  },

  # Main pages
  'index': {
    'controller': 'pages.controllers.index',
    'template':   'pages/templates/index.html',
    'title':      'Home'
  },
  'projects': {
    'controller':  'pages.controllers.projects',
    'template':    'pages/templates/projects.html',
    'title':       'Projects'
  },
  'resume': {
    'controller': 'pages.controllers.resume',
    'template':   'pages/templates/resume.html',
    'title':      'Resume'
  },
  'contact': {
    'template':   'pages/templates/contact.html',
    'title':      'Contact'
  },
  'blog': {
    'controller': 'pages.controllers.blog',
    'template':   'pages/templates/blog.html',
    'title':      'Blog'
  },

  # Project pages
  'projects/pong': {
    'template':   'pages/projects/pong/index.html',
    'title':      '',
  },
  'projects/fluffy_chicken_adventures': {
    'template':   'pages/projects/fluffy_chicken_adventures/index.html',
    'title':      'Fluffy Chicken Adventures'
  },
  'projects/explore_the_stars': {
      'template':   'pages/projects/explore_the_stars/index.html',
      'title':      'Explore The Stars'
  },
  'projects/avoid_the_shapes': {
    'controller': 'pages.projects.avoid_the_shapes.controller',
    'template':   'pages/projects/avoid_the_shapes/index.html',
    'title':      'Avoid The Shapes'
  },
  'projects/space_defender': {
    'template':   'pages/projects/space_defender/index.html',
    'title':      'Avoid The Shapes'
  },
  'projects/calculate': {
    'template':   'pages/projects/calculate/index.html',
    'title':      'Calculate!'
  },
  'projects/chatbot': {
    'template':   'pages/projects/chat/index.html',
    'title':      'Chat'
  },
  'projects/chatbot/respond': {
    'controller': 'pages.projects.chat.respond',
    'template':   'pages/templates/blank.html',
    'type':       'json',
    'dynamic':    True,
    'sitemap_exclude': True

  },

  'sitemap.xml': {
    'controller': 'pages.controllers.sitemap',
    'template': 'pages/templates/sitemap.xml',
    'type':       'xml',
    'sitemap_exclude': True
  },

  # Error pages
  '404': {
      'template':   'pages/templates/404.html',
      'title':      '404: File not found',
      'sitemap_exclude': True
  },
  '500': {
      'template':   'pages/templates/500.html',
      'title':      '500: Internal server error',
      'sitemap_exclude': True
  }
}

pattern_paths = {
  'blog/(?P<name>[a-zA-Z0-9_\-]+)': {
    'controller':  'pages.controllers.blog_article',
    'template':    'pages/templates/blog_article.html',
    'title':       'Blog',
    'possible_paths': 'pages.controllers.blog_article.get_possible_paths'
  },
}

# If key is requested, serve path at value (do not redirect)
aliases = {
  'games': 'projects',
  'projects/space-defender': 'projects/space_defender', # support old link on HTML5 game website
  'projects/fluffy-chicken-adventures.html': 'projects/fluffy_chicken_adventures', # previously shared link to game (on Tumblr)
  'chat': 'projects/chatbot'
}

# If key is requested, redirect to different path.
redirects = {
  'projects/taskbird': 'http://taskbird.ca'
}

