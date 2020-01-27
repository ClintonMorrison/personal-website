import os

base_url = os.environ.get('PERSONAL_WEBSITE_BASE_URL', 'localhost')
protocol = os.environ.get('PERSONAL_WEBSITE_PROTOCOL', 'http')

databases = {
    'main': {
        'host':   os.environ.get('PERSONAL_WEBSITE_DATABASE_HOST', 'localhost'),
        'user':   os.environ.get('PERSONAL_WEBSITE_DATABASE_USER', 'root'),
        'passwd': os.environ.get('PERSONAL_WEBSITE_DATABASE_PASSWORD', ''),
        'db':     os.environ.get('PERSONAL_WEBSITE_DATABASE_NAME', 'clintor1_main'),
    }
}

debug = False
timezone = 'America/Toronto'
cache_path = 'static/cache'
