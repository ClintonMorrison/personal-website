
source venv/bin/activate
git pull
git checkout master
pip install -r requirements.txt
python clear_page_cache.py
python build_page_cache.py
echo "YOU MUST RESTART WSGI SERVER FOR THESE CHANGES TO TAKE EFFECT."
