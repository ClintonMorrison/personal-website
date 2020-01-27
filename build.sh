#!/bin/bash
docker stop personal-website
docker rm personal-website

VERSION='0.0.1-dev'

docker build -t "clintonmorrison/projects:personal-website-$VERSION" . &&
  echo "Running container..." &&
  sh run_container.sh &&
  docker exec -it personal-website bash
