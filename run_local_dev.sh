#!/bin/bash

cd ~/Source/personal-website &&
  python3 -m venv venv &&
  source venv/bin/activate &&
  pip3 install -r app/requirements.txt &&
  cd app &&
  python3 dev_server.py
