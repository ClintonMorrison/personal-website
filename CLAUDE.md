# CLAUDE.md

## Project Overview

Personal portfolio/resume website for clintonmorrison.com. Built with a custom Python WSGI framework (no Flask/Django).

## Tech Stack

- Python 3, MySQL, uWSGI, Nginx, Docker, SASS, Skeleton CSS

## Directory Structure

```
app/
├── core/           # Framework: template.py, markdown.py, requesthandler.py, pageloader.py
├── pages/
│   ├── controllers/  # Page logic (blog.py, projects.py, resume.py, etc.)
│   ├── templates/    # HTML templates with custom syntax
│   ├── style/        # SCSS stylesheets
│   └── paths.py      # Route definitions
├── static/
│   ├── blog/         # Markdown articles in subdirectories
│   ├── articles.yml  # Blog metadata
│   ├── projects.yml  # Project data
│   └── resume.yml    # Resume data
```

## Development Commands

- `./run_local_dev.sh` - Start local dev server (port 8002)
- `./build.sh` - Build and push Docker image
- `python3 app/build_page_cache.py` - Pre-render static pages

## Custom Template Syntax

- Inheritance: `[% extends 'base.html' %]`
- Regions: `[% region content %]...[% end region %]`
- Variables: `[[title]]`, `[[article.date]]`
- Loops: `[% for each article in articles %]...[% end for each %]`
- Functions: `[% add sass 'style.scss' %]`, `[% url 'blog' %]`, `[% static 'image.png' %]`

## Content Management

- **Add blog post**: Create `app/static/blog/{slug}/article.txt`, add entry to `articles.yml`
- **Edit projects**: Modify `app/static/projects.yml`
- **Edit resume**: Modify `app/static/resume.yml`

## Routing

Routes defined in `app/pages/paths.py` as dictionary mapping paths to controllers/templates. Dynamic routes use `{slug}` patterns.

## Key Files Reference

| Purpose | File |
|---------|------|
| Routes | `app/pages/paths.py` |
| Template engine | `app/core/template.py` |
| Markdown parser | `app/core/markdown.py` |
| Request handling | `app/core/requesthandler.py` |
| Page rendering | `app/core/pageloader.py` |
| Config | `app/config.py` |
