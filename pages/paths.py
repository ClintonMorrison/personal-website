
# Note: Use 'dynamic' key to indicate that a page has dynamic content
# (eg if the page is not cachable)

paths = {
  '*': {
    'regions': {
      'sidebar': {
        'controller': 'pages.controllers.sidebar',
        'template': 'pages/templates/sidebar.html',
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
    'controller': 'pages.controllers.default_controller',
    'template':   'pages/templates/about.html',
    'title':      'About'
  },
  'resume': {
    'controller': 'pages.controllers.default_controller',
    'template':   'pages/templates/resume.html',
    'title':      'Resume'
  },
  'contact': {
    'controller': 'pages.controllers.default_controller',
    'template':   'pages/templates/contact.html',
    'title':      'Contact'
  },
  'blog': {
    'controller': 'pages.controllers.blog',
    'template':   'pages/templates/blog.html',
    'title':      'Blog'
  },
  'blog/:name': {
    'controller': 'pages.controllers.blog',
    'template':   'pages/templates/blog.html',
    'title':      'Blog'
  },
  'blog/article': {
    'controller': 'pages.controllers.blog_article',
    'template':   'pages/templates/blog_article.html',
    'title':      'Blog',
    'dynamic':    True
  },

  # Project pages
  'projects/pong': {
    'controller': 'pages.controllers.default_controller',
    'template':   'pages/projects/pong/index.html',
    'title':      '',
  },
  'projects/fluffy_chicken_adventures': {
    'controller': 'pages.controllers.default_controller',
    'template':   'pages/projects/fluffy_chicken_adventures/index.html',
    'title':      'Fluffy Chicken Adventures'
  },
  'projects/avoid_the_shapes': {
    'controller': 'pages.projects.avoid_the_shapes.controller',
    'template':   'pages/projects/avoid_the_shapes/index.html',
    'title':      'Avoid The Shapes'
  },
  'projects/space_defender': {
    'controller': 'pages.controllers.default_controller',
    'template':   'pages/projects/space_defender/index.html',
    'title':      'Avoid The Shapes'
  },
  'projects/calculate': {
    'controller': 'pages.controllers.default_controller',
    'template':   'pages/projects/calculate/index.html',
    'title':      'Calculate!'
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
      'controller': 'pages.controllers.default_controller',
      'template':   'pages/templates/404.html',
      'title':      '404: File not found'
  },
  '500': {
      'controller': 'pages.controllers.default_controller',
      'template':   'pages/templates/500.html',
      'title':      '500: Internal server error'
  }
}

# If key is requested, serve path at value (do not redirect)
aliases = {
  'games': 'projects',
  'projects/space-defender': 'projects/space_defender' # support old link on HTML5 game website
}

# If key is requested, redirect to different path. TODO: implement this!
redirects = {}

