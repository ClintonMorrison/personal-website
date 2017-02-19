
# Note: Use 'dynamic' key to indicate that a page has dynamic content
# (eg if the page is not cachable)

paths = {
  '*': {
    'regions': {
      'nav': {
        'controller': 'pages.controllers.nav',
        'template': 'pages/templates/nav.html',
      }
    }
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
  'about': {
    'template':   'pages/templates/about.html',
    'title':      'About'
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
    'dynamic':    True
  },
  # Other stuff
  'homepage': {
    'controller': 'pages.controllers.homepage',
    'template':   'pages/templates/homepage.html',
    'title':      'Hi Clint!',
    'dynamic':    True
  },

  # Error pages
  '404': {
      'template':   'pages/templates/404.html',
      'title':      '404: File not found'
  },
  '500': {
      'template':   'pages/templates/500.html',
      'title':      '500: Internal server error'
  }
}

pattern_paths = {
  'blog/(?P<name>[a-zA-Z0-9_\-]+)': {
    'controller':  'pages.controllers.blog_article',
    'template':    'pages/templates/blog_article.html',
    'title':       'Blog',
    'cache_paths': 'pages.controllers.blog_article.get_possible_paths'
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

