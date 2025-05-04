
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
    'title':      'Home',
    'description': "I'm a full-stack software engineer in Toronto, Canada. Currently I work at BiblioCommons, helping to create awesome digital spaces for public libraries."
  },
  'projects': {
    'controller':  'pages.controllers.projects',
    'template':    'pages/templates/projects.html',
    'title':       'Projects',
    'description': 'This page lists some of the interesting projects I have worked on! For a more complete list and source code you should check out my GitHub profile.'
  },
  'resume': {
    'controller':  'pages.controllers.resume',
    'template':    'pages/templates/resume.html',
    'title':       'Resume',
    'description': 'I am an experienced full stack developer with a background in Java, Spring, React, and Node.'
  },
  'contact': {
    'template':    'pages/templates/contact.html',
    'title':       'Contact',
    'description': 'I would love to hear from you! You can reach me by email, social media, or GitHub.'
  },
  'blog': {
    'controller':  'pages.controllers.blog',
    'template':    'pages/templates/blog.html',
    'title':       'Blog',
    'description': 'On my blog I write about my projects, things I am learning about, and technology.',
    'og_type':     'blog'
  },

  # Project pages
  'projects/pong': {
    'template':   'pages/projects/pong/index.html',
    'title':      'Pong',
    'og_type':    'game',
    'description': 'A clone fo the classic pong game'
  },
  'projects/fluffy_chicken_adventures': {
    'template':   'pages/projects/fluffy_chicken_adventures/index.html',
    'title':      'Fluffy Chicken Adventures',
    'og_type':    'game',
    'description': 'In this side scrolling action game you can help Binky the Fluffy Chicken save the world!'
  },
  'projects/explore_the_stars': {
      'template':   'pages/projects/explore_the_stars/index.html',
      'title':      'Explore The Stars',
      'og_type':    'game',
      'description': 'I created a simple HTML5 application which shows a field of stars. I think it looks quite interesting.'
  },
  'projects/avoid_the_shapes': {
    'controller': 'pages.projects.avoid_the_shapes.controller',
    'template':   'pages/projects/avoid_the_shapes/index.html',
    'dynamic':    True,
    'title':      'Avoid The Shapes',
    'og_type':    'game',
    'description': 'This is a simple yet fun web game created with HTML5 and JavaScript. The player controls a yellow circle and must avoid touching the other shapes. The longer the player survives the higher his score.'
  },
  'projects/space_defender': {
    'template':   'pages/projects/space_defender/index.html',
    'title':      'Space Defender',
    'og_type':    'game',
    'description': 'This is a retro arcade style space shooter game with vector graphics. It was created with HTML5 and JavaScript. Fly through space destroying alien space ships! Survive as long as you can. Play against a friend in two player mode!'
  },
  'projects/calculate': {
    'template':   'pages/projects/calculate/index.html',
    'title':      'Calculate!',
    'description': 'This is an online calculator that evaluates simple expressions as you type them. It supports addition, subtraction, multiplication, division, and exponentiation. The expression is converted into postfix form before it is evaluated.'
  },
  'projects/chatbot': {
    'template':   'pages/projects/chat/index.html',
    'title':      'Chat',
    'description': 'A simple chat bot powered by Python'
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
    'controller':     'pages.controllers.blog_article',
    'template':       'pages/templates/blog_article.html',
    'title':          'Blog',
    'og_type':        'article',
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
  'projects/taskbird': 'https://taskbird.clintonmorrison.com',
  'projects/lorikeet': 'https://lorikeet.clintonmorrison.com',
}

